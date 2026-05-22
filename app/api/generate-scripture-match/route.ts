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

  // Try today's devotion first; fall back to a recent one so generation never fails
  let { data: devotion } = await supabase
    .from("daily_devotions")
    .select("title, verse_reference, verse_text, reflection, journal_challenge")
    .eq("devotion_date", today)
    .single();

  if (!devotion) {
    const { data: recent } = await supabase
      .from("daily_devotions")
      .select("title, verse_reference, verse_text, reflection, journal_challenge")
      .order("devotion_date", { ascending: false })
      .limit(1)
      .single();
    devotion = recent;
  }

  if (!devotion) return NextResponse.json({ error: "No devotion data found" }, { status: 404 });

  const { data: graceChallenge } = await supabase
    .from("grace_challenges")
    .select("challenge_text")
    .eq("challenge_date", today)
    .single();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      messages: [{
        role: "user",
        content: `Today's full devotion content:

Title: "${devotion.title}"
Verse: ${devotion.verse_reference} — "${devotion.verse_text}"
Reflection: ${devotion.reflection}
${graceChallenge ? `Grace Challenge: ${graceChallenge.challenge_text}` : ""}
${devotion.journal_challenge ? `Journal Challenge: ${devotion.journal_challenge}` : ""}

Generate 6 scripture matching pairs that feel like a natural extension of everything above — as if the game is helping the user go deeper into today's specific message. The pairs should reinforce the themes, characters, and truths from today's devotion, not generic Bible trivia.

Each pair has a LEFT card and a RIGHT card. Mix these types:
- First half of today's verse to the second half
- A key word or concept from today's reflection to its meaning or scripture context
- A Bible character connected to today's theme to their relevant act or quote
- Another verse that echoes today's theme to its reference
- A question drawn from today's devotion theme to its answer
- Verse fragment to its Bible reference

Make the easy pairs feel encouraging and confirmational of what they just read. Make the hard pairs stretch them a little deeper into the theme.

Return ONLY a JSON array, no markdown, no preamble:
[
  { "left": "text on left card", "right": "text on right card", "difficulty": "easy" },
  { "left": "...", "right": "...", "difficulty": "easy" },
  { "left": "...", "right": "...", "difficulty": "medium" },
  { "left": "...", "right": "...", "difficulty": "medium" },
  { "left": "...", "right": "...", "difficulty": "hard" },
  { "left": "...", "right": "...", "difficulty": "hard" }
]`
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
