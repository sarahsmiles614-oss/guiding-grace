import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  // Check if already generated today
  const { data: existingDevotion } = await supabase.from("daily_devotions").select("id").eq("devotion_date", today).single();
  if (existingDevotion) return NextResponse.json({ message: "Already generated today" });

  // Get today's date info for seasonal/holiday context
  const date = new Date();
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  const fullDate = date.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });

  // Generate devotion + challenge together
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Today is ${fullDate}. Generate a daily Christian devotion and a matching real-world grace challenge for a faith app called Guiding Grace.

Consider the season, any nearby Christian holidays (Easter season, Pentecost, Advent, Christmas, etc.), or meaningful dates like Mother's Day, Memorial Day, etc. for ${month} ${day}.

Return ONLY a JSON object with these exact fields, no markdown, no preamble:
{
  "title": "Short devotion title (5 words or less)",
  "verse_reference": "Book Chapter:Verse",
  "verse_text": "The full verse text from NIV",
  "reflection": "2-3 sentences of warm, personal spiritual reflection on the verse. Speak directly to the reader.",
  "challenge": "One specific, practical, real-world act of grace the reader can do today that mirrors the devotion theme. 1-2 sentences. Warm and achievable."
}`
      }]
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text) return NextResponse.json({ error: "No response from Claude" }, { status: 500 });

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Failed to parse response", raw: text }, { status: 500 });
  }

  // Insert devotion
  await supabase.from("daily_devotions").insert({
    devotion_date: today,
    title: parsed.title,
    verse_reference: parsed.verse_reference,
    verse_text: parsed.verse_text,
    reflection: parsed.reflection,
  });

  // Insert grace challenge
  await supabase.from("grace_challenges").insert({
    challenge_text: parsed.challenge,
    challenge_date: today,
  });

  return NextResponse.json({ message: "Generated successfully", devotion: parsed.title, challenge: parsed.challenge });
}
