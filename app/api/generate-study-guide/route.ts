import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SELECT_FIELDS = "title, verse_reference, background, interpretation, questions, application, related_verses, fill_blank";

async function callClaude(prompt: string, maxTokens = 1800): Promise<string | null> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text?.trim() ?? null;
}

async function generateFillBlank(context: string): Promise<any[] | null> {
  const text = await callClaude(
    `Based on this scripture context: ${context}

Generate 4 fill-in-the-blank scripture exercises. Choose short, memorable verses. Blank out 1-2 key theological words per verse — the most meaningful words, NOT articles ("the", "a"), prepositions ("in", "of", "through"), or conjunctions.

Return ONLY a JSON array, no markdown:
[
  {
    "reference": "Book Chapter:Verse",
    "parts": ["Text before blank ", " text after blank."],
    "answers": ["answer"]
  }
]

CRITICAL: parts must have exactly one more element than answers. Split the verse at each blank position.`,
    700
  );
  if (!text) return null;
  try {
    const arr = JSON.parse(text);
    return Array.isArray(arr) ? arr : null;
  } catch { return null; }
}

function buildFullPrompt(context: string): string {
  return `${context}

Return ONLY a JSON object, no markdown, no preamble:
{
  "title": "A short compelling title drawn from the passage",
  "verse_reference": "The key verse or passage reference (e.g. John 3:16)",
  "background": "3-4 sentences of historical and spiritual context. Who wrote it, when, and why it matters today.",
  "interpretation": "3-4 sentences explaining what this passage means — the literary genre, key themes, what the original audience understood, and what God is communicating.",
  "questions": [
    "A personal reflection question about the passage",
    "A question about how this applies to daily life",
    "A deeper question about faith or character growth"
  ],
  "application": "2-3 sentences of specific, practical guidance for living out this scripture today.",
  "related_verses": [
    { "reference": "Book Chapter:Verse", "text": "Full verse text" },
    { "reference": "Book Chapter:Verse", "text": "Full verse text" },
    { "reference": "Book Chapter:Verse", "text": "Full verse text" }
  ],
  "fill_blank": [
    {
      "reference": "Book Chapter:Verse",
      "parts": ["Text before blank ", " text after blank."],
      "answers": ["answer"]
    },
    {
      "reference": "Book Chapter:Verse",
      "parts": ["Text before blank ", " middle text ", " after."],
      "answers": ["firstAnswer", "secondAnswer"]
    },
    {
      "reference": "Book Chapter:Verse",
      "parts": ["Text before blank ", " text after blank."],
      "answers": ["answer"]
    },
    {
      "reference": "Book Chapter:Verse",
      "parts": ["Text before blank ", " text after blank."],
      "answers": ["answer"]
    }
  ]
}

For fill_blank: choose 4 short memorable verses from or related to the passage. Blank 1-2 key theological words per verse — never articles, prepositions, or conjunctions. The parts array must have exactly one more element than answers.`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { planKey, passages } = body as { planKey?: string; passages?: string };

  // ── Plan-specific study guide (Bible 365) ────────────────────────────────
  if (planKey && passages) {
    const { data: existing } = await supabase
      .from("study_guides")
      .select(SELECT_FIELDS)
      .eq("guide_date", planKey)
      .single();

    if (existing) {
      if (existing.fill_blank) return NextResponse.json({ guide: existing });
      // Backfill fill_blank for cached record
      const fill_blank = await generateFillBlank(passages);
      if (fill_blank) {
        await supabase.from("study_guides").update({ fill_blank }).eq("guide_date", planKey);
        return NextResponse.json({ guide: { ...existing, fill_blank } });
      }
      return NextResponse.json({ guide: existing });
    }

    const text = await callClaude(
      buildFullPrompt(`Today's Bible reading plan passages: ${passages}\n\nGenerate a warm, accessible Bible study guide for everyday Christians based on these passages.`)
    );
    if (!text) return NextResponse.json({ error: "No response" }, { status: 500 });

    let parsed: any;
    try { parsed = JSON.parse(text); }
    catch { return NextResponse.json({ error: "Parse failed" }, { status: 500 }); }

    await supabase.from("study_guides").insert({
      guide_date: planKey,
      title: parsed.title,
      verse_reference: parsed.verse_reference,
      background: parsed.background,
      interpretation: parsed.interpretation,
      questions: parsed.questions,
      application: parsed.application,
      related_verses: parsed.related_verses,
      fill_blank: parsed.fill_blank ?? null,
    });

    return NextResponse.json({ guide: parsed });
  }

  // ── Daily devotion study guide (default) ────────────────────────────────
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("study_guides")
    .select(SELECT_FIELDS)
    .eq("guide_date", today)
    .single();

  if (existing) {
    if (existing.fill_blank) return NextResponse.json({ guide: existing });
    // Backfill fill_blank for cached record
    const fill_blank = await generateFillBlank(existing.verse_reference);
    if (fill_blank) {
      await supabase.from("study_guides").update({ fill_blank }).eq("guide_date", today);
      return NextResponse.json({ guide: { ...existing, fill_blank } });
    }
    return NextResponse.json({ guide: existing });
  }

  const { data: devotion } = await supabase
    .from("daily_devotions")
    .select("title, verse_reference, verse_text, reflection")
    .eq("devotion_date", today)
    .single();

  if (!devotion) return NextResponse.json({ error: "No devotion for today" }, { status: 404 });

  const text = await callClaude(
    buildFullPrompt(
      `Today's devotion is titled "${devotion.title}" based on ${devotion.verse_reference}: "${devotion.verse_text}"\nReflection: ${devotion.reflection}\n\nGenerate a warm, accessible Bible study guide for everyday Christians based on this devotion.`
    )
  );
  if (!text) return NextResponse.json({ error: "No response" }, { status: 500 });

  let parsed: any;
  try { parsed = JSON.parse(text); }
  catch { return NextResponse.json({ error: "Parse failed" }, { status: 500 }); }

  await supabase.from("study_guides").insert({
    guide_date: today,
    title: parsed.title ?? devotion.title,
    verse_reference: parsed.verse_reference ?? devotion.verse_reference,
    background: parsed.background,
    interpretation: parsed.interpretation,
    questions: parsed.questions,
    application: parsed.application,
    related_verses: parsed.related_verses,
    fill_blank: parsed.fill_blank ?? null,
  });

  return NextResponse.json({ guide: parsed });
}
