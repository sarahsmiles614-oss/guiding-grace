import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("study_guides")
    .select("title, verse_reference, background, questions, application, related_verses")
    .eq("guide_date", today)
    .single();

  if (existing) return NextResponse.json({ guide: existing });

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
      max_tokens: 1200,
      messages: [{
        role: "user",
        content: `Today's devotion is titled "${devotion.title}" based on ${devotion.verse_reference}: "${devotion.verse_text}"
Reflection: ${devotion.reflection}

Generate a warm, accessible Bible study guide for everyday Christians based on this devotion.

Return ONLY a JSON object, no markdown, no preamble:
{
  "title": "Same as devotion title",
  "verse_reference": "${devotion.verse_reference}",
  "background": "3-4 sentences of historical and spiritual context for this passage. Who wrote it, when, and why it matters today.",
  "questions": [
    "A personal reflection question about the verse",
    "A question about how this applies to daily life",
    "A deeper question about faith or character growth"
  ],
  "application": "2-3 sentences of specific, practical guidance for living out this scripture today.",
  "related_verses": [
    { "reference": "Book Chapter:Verse", "text": "Full verse text" },
    { "reference": "Book Chapter:Verse", "text": "Full verse text" },
    { "reference": "Book Chapter:Verse", "text": "Full verse text" }
  ]
}`
      }]
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text) return NextResponse.json({ error: "No response" }, { status: 500 });

  let parsed;
  try { parsed = JSON.parse(text); }
  catch { return NextResponse.json({ error: "Parse failed" }, { status: 500 }); }

  await supabase.from("study_guides").insert({
    guide_date: today,
    title: parsed.title,
    verse_reference: parsed.verse_reference,
    background: parsed.background,
    questions: parsed.questions,
    application: parsed.application,
    related_verses: parsed.related_verses,
  });

  return NextResponse.json({ guide: parsed });
}
