import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAILS = ["sarahsmiles614@gmail.com"];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];
  const date = new Date();
  const fullDate = date.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();

  const { data: existingDevotion } = await supabase.from("daily_devotions").select("id").eq("devotion_date", today).single();
  const { data: existingChallenge } = await supabase.from("grace_challenges").select("id").eq("challenge_date", today).single();
  const { data: existingMatch } = await supabase.from("scripture_match_cards").select("id").eq("card_date", today).single();
  const { data: existingGuide } = await supabase.from("study_guides").select("id").eq("guide_date", today).single();

  if (existingDevotion && existingChallenge && existingMatch && existingGuide) {
    return NextResponse.json({ message: "Already generated today" });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
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
  "challenge": "One specific, practical, real-world act of grace the reader can do today that mirrors the devotion theme. 1-2 sentences. Warm and achievable. IMPORTANT: The challenge must never cost money or require any purchase."
}`
      }]
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text) return NextResponse.json({ error: "No response from Claude", raw: data }, { status: 500 });

  let parsed;
  try { parsed = JSON.parse(text); }
  catch { return NextResponse.json({ error: "Failed to parse", raw: text }, { status: 500 }); }

  if (!existingDevotion) {
    await supabase.from("daily_devotions").insert({
      devotion_date: today,
      title: parsed.title,
      verse_reference: parsed.verse_reference,
      verse_text: parsed.verse_text,
      reflection: parsed.reflection,
    });
  }

  if (!existingChallenge) {
    await supabase.from("grace_challenges").insert({
      challenge_text: parsed.challenge,
      challenge_date: today,
    });
  }

  if (!existingMatch) {
    const matchRes = await fetch("https://api.anthropic.com/v1/messages", {
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
          content: `Today's devotion is titled "${parsed.title}" based on ${parsed.verse_reference}: "${parsed.verse_text}"\n\nGenerate 6 scripture matching pairs themed around this devotion.\n\nMix these types:\n- Verse fragment to its Bible reference\n- Bible character to their famous act\n- First half of verse to second half\n\nReturn ONLY a JSON array, no markdown, no preamble:\n[\n  { "left": "text on left card", "right": "text on right card", "difficulty": "easy" },\n  { "left": "...", "right": "...", "difficulty": "easy" },\n  { "left": "...", "right": "...", "difficulty": "medium" },\n  { "left": "...", "right": "...", "difficulty": "medium" },\n  { "left": "...", "right": "...", "difficulty": "hard" },\n  { "left": "...", "right": "...", "difficulty": "hard" }\n]`
        }]
      }),
    });
    const matchData = await matchRes.json();
    const matchText = matchData.content?.[0]?.text?.trim();
    if (matchText) {
      try {
        const pairs = JSON.parse(matchText);
        await supabase.from("scripture_match_cards").insert({ card_date: today, pairs });
      } catch {}
    }
  }

  if (!existingGuide) {
    const guideRes = await fetch("https://api.anthropic.com/v1/messages", {
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
          content: `Today's devotion is titled "${parsed.title}" based on ${parsed.verse_reference}: "${parsed.verse_text}"\n\nGenerate a warm, accessible Bible study guide for everyday Christians.\n\nReturn ONLY a JSON object, no markdown, no preamble:\n{\n  "title": "${parsed.title}",\n  "verse_reference": "${parsed.verse_reference}",\n  "background": "3-4 sentences of historical and spiritual context for this passage.",\n  "questions": [\n    "A personal reflection question about the verse",\n    "A question about how this applies to daily life",\n    "A deeper question about faith or character growth"\n  ],\n  "application": "2-3 sentences of specific practical guidance for living out this scripture today.",\n  "related_verses": [\n    { "reference": "Book Chapter:Verse", "text": "Full verse text" },\n    { "reference": "Book Chapter:Verse", "text": "Full verse text" },\n    { "reference": "Book Chapter:Verse", "text": "Full verse text" }\n  ]\n}`
        }]
      }),
    });
    const guideData = await guideRes.json();
    const guideText = guideData.content?.[0]?.text?.trim();
    if (guideText) {
      try {
        const guide = JSON.parse(guideText);
        await supabase.from("study_guides").insert({
          guide_date: today,
          title: guide.title,
          verse_reference: guide.verse_reference,
          background: guide.background,
          questions: guide.questions,
          application: guide.application,
          related_verses: guide.related_verses,
        });
      } catch {}
    }
  }

  return NextResponse.json({ message: "Generated", title: parsed.title });
}
