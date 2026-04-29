import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("scripture_match_cards")
    .select("id")
    .eq("card_date", today)
    .single();

  if (existing) return NextResponse.json({ message: "Already generated" });

  const { data: devotion } = await supabase
    .from("daily_devotions")
    .select("title, verse_reference, verse_text, reflection")
    .eq("devotion_date", today)
    .single();

  if (!devotion) return NextResponse.json({ error: "No devotion for today" }, { status: 404 });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      messages: [{
        role: "user",
        content: `Today's devotion is titled "${devotion.title}" based on ${devotion.verse_reference}: "${devotion.verse_text}"\n\nGenerate 6 scripture matching pairs themed around this devotion. Each pair has a LEFT card (a short verse fragment or question) and a RIGHT card (its match).\n\nMix these types:\n- Verse fragment to its Bible reference\n- Bible character to their famous act\n- First half of verse to second half\n\nReturn ONLY a JSON array, no markdown, no preamble:\n[\n  { "left": "text on left card", "right": "text on right card", "difficulty": "easy" },\n  { "left": "...", "right": "...", "difficulty": "easy" },\n  { "left": "...", "right": "...", "difficulty": "medium" },\n  { "left": "...", "right": "...", "difficulty": "medium" },\n  { "left": "...", "right": "...", "difficulty": "hard" },\n  { "left": "...", "right": "...", "difficulty": "hard" }\n]`
      }]
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text) return NextResponse.json({ error: "No response" }, { status: 500 });

  let pairs;
  try { pairs = JSON.parse(text); }
  catch { return NextResponse.json({ error: "Parse failed", raw: text }, { status: 500 }); }

  await supabase.from("scripture_match_cards").insert({
    card_date: today,
    pairs: pairs,
  });

  return NextResponse.json({ message: "Generated", pairs });
}
