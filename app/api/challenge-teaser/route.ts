import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title, verse_reference, verse_text, reflection } = await req.json();
  if (!title || !verse_reference) {
    return NextResponse.json({ error: "Missing devotion data" }, { status: 400 });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 120,
      messages: [{
        role: "user",
        content: `You are the voice of a warm, clever faith app called Guiding Grace.

Today's devotion:
Title: "${title}"
Verse: ${verse_reference} — "${verse_text}"
Reflection: ${reflection}

Write a single short teaser (2 sentences max) that:
- Connects this specific devotion to the daily Grace Challenge in a fun, clever, or playful way
- Feels warm and human, not preachy
- Ends with a little excitement or wit that makes them want to click

No quotes around the output. No labels. Just the 2 sentences.`,
      }],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text) return NextResponse.json({ error: "No response" }, { status: 500 });

  return NextResponse.json({ teaser: text });
}
