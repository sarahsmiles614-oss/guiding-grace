import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Any authenticated subscriber can call this to ensure today's content exists.
// Idempotent — if content already exists, returns immediately.
export async function POST(req: Request) {
  // Verify the caller is a signed-in user
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user } } = await anonClient.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date()).replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2");

  const { data: existingDevotion } = await supabase.from("daily_devotions").select("id").eq("devotion_date", today).single();
  const { data: existingChallenge } = await supabase.from("grace_challenges").select("id").eq("challenge_date", today).single();

  if (existingDevotion && existingChallenge) {
    return NextResponse.json({ message: "Already exists" });
  }

  const date = new Date();
  const fullDate = date.toLocaleString("en-US", { timeZone: "America/New_York", month: "long", day: "numeric", year: "numeric" });
  const month = date.toLocaleString("en-US", { timeZone: "America/New_York", month: "long" });
  const day = parseInt(new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", day: "numeric" }).format(date));

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
  "challenge": "One specific, practical, real-world act of grace the reader can do today that mirrors the devotion theme. 1-2 sentences. Warm and achievable. IMPORTANT: The challenge must never cost money or require any purchase. It should involve the person themselves (inner work, reflection, a personal habit) or their community (a neighbor, friend, stranger, family member, church) — or both. The goal is to strengthen faith through action, not transaction."
}`,
      }],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text) return NextResponse.json({ error: "No response from Claude" }, { status: 500 });

  let parsed;
  try { parsed = JSON.parse(text); }
  catch { return NextResponse.json({ error: "Failed to parse" }, { status: 500 }); }

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

  return NextResponse.json({ message: "Generated", title: parsed.title });
}
