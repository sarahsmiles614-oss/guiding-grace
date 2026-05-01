import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  const today = new Date().toISOString().split("T")[0];

  // Get today's devotion for context
  const { data: devotion } = await supabase
    .from("daily_devotions")
    .select("title, verse_reference, verse_text, reflection")
    .eq("devotion_date", today)
    .single();

  const context = devotion
    ? `Today's devotion: "${devotion.title}" — ${devotion.verse_reference}: "${devotion.verse_text}". Reflection: ${devotion.reflection.slice(0, 300)}`
    : "General Bible knowledge across both Old and New Testaments.";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1200,
      messages: [{
        role: "user",
        content: `${context}

Create 5 fun Bible trivia questions for a church small group game. Mix easy and medium difficulty. Questions can be from the passage above OR from well-known Bible stories.

Return ONLY a JSON array, no markdown, no preamble:
[
  {
    "question": "Question text here?",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "answer": "A"
  }
]

Rules:
- options array has exactly 4 items (plain text, no letter prefix)
- answer is exactly "A", "B", "C", or "D"
- questions should be enjoyable and accessible for everyday church members
- vary the correct answer position (not always A)`
      }]
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text) return NextResponse.json({ error: "No response" }, { status: 500 });

  let questions;
  try {
    // Strip markdown fences if present
    const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    questions = JSON.parse(clean);
  } catch {
    return NextResponse.json({ error: "Parse failed" }, { status: 500 });
  }

  return NextResponse.json({ questions });
}
