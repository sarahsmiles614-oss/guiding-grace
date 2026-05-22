import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  // Check if BOTH already exist today — only skip if both are present
  const { data: existingDevotion } = await supabase.from("daily_devotions").select("id").eq("devotion_date", today).single();
  const { data: existingChallenge } = await supabase.from("grace_challenges").select("id").eq("challenge_date", today).single();
  if (existingDevotion && existingChallenge) {
    return NextResponse.json({ message: "Already generated today" });
  }

  const date = new Date();
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  const fullDate = date.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-7",
      max_tokens: 2500,
      messages: [{
        role: "user",
        content: `Today is ${fullDate}. Generate a rich, deeply meaningful daily Christian devotion and two challenges for a faith app called Guiding Grace.

Today is a specific day — ${month} ${day} — and it should feel like it. Deeply consider what makes this exact day in the year meaningful: the liturgical season (Advent, Christmas, Epiphany, Lent, Holy Week, Easter, Pentecost, Ordinary Time), any major Christian observances, and cultural moments that touch people's real lives — Mother's Day, Father's Day, Memorial Day, Veterans Day, Thanksgiving, New Year's, the first day of a new season, back-to-school time, harvest season, the longest day, the darkest week. If today lands near a holiday or meaningful date, let that shape the entire devotion. If it is an ordinary day, find the sacred in the ordinary — the turning of a season, a midweek struggle, a quiet Friday. Every single day of the year should feel handcrafted, not generic. The user should open this and think "this was written for today."

EVERYTHING must be connected. The verse, the reflection, the Grace Challenge, and the Journal Challenge should all flow from the same spiritual thread — as if they were written as one unified message for the day. The challenges are not add-ons. They are the lived expression of the devotion.

DEVOTION (reflection field): Write a rich, warm, personal reflection on the verse. Go beyond surface-level encouragement — draw out the deeper spiritual meaning, connect it to real human experience, and speak directly to the reader's heart. This should feel like a trusted pastor or friend sitting with them over coffee. Write as much as is needed to make it land.

GRACE CHALLENGE (community/outward): This must grow directly out of the devotion's message — not just share the same theme, but carry the same spirit into action. It is a community or service-focused act of grace toward others. Completely free. Achievable by anyone, including people who are homebound, elderly, disabled, or isolated. Doable through any form of communication — in person, phone, text, email, social media, handwritten note, or from home. Never require travel or money. Reference the devotion's message so the user feels the connection between what they just read and what they are being called to do. Every day should feel fresh and different. Write as much as needed. End with one sentence offering an alternative for those who truly cannot do the main challenge. Format: the challenge, then 'Alternative: [alternative]'.

JOURNAL CHALLENGE (personal/inward): This also flows directly from the devotion — but turns the lens inward. It is a private reflection challenge for the user's personal journal. Draw specific language or imagery from the verse and reflection. Ask the user to sit with something real — a habit, a fear, a place of pride or shame, a relationship with God they have been avoiding. This is not gentle fluff — it should gently press on something true. Write as much as needed to make it feel searching and honest.

Return ONLY a JSON object with these exact fields, no markdown, no preamble:
{
  "title": "Short devotion title (5 words or less)",
  "verse_reference": "Book Chapter:Verse",
  "verse_text": "The full verse text from NIV",
  "reflection": "Rich, warm, personal devotion reflection. No length limit.",
  "challenge": "The Grace Challenge — community/outward, rooted in today's devotion message, free, accessible to all, ends with Alternative: [one sentence].",
  "journal_challenge": "The Journal Challenge — personal, inward, draws specific language from today's verse and reflection, presses gently on something real."
}`
      }]
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text) return NextResponse.json({ error: "No response from Claude", raw: data }, { status: 500 });

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Failed to parse response", raw: text }, { status: 500 });
  }

  // Insert whichever is missing
  if (!existingDevotion) {
    await supabase.from("daily_devotions").insert({
      devotion_date: today,
      title: parsed.title,
      verse_reference: parsed.verse_reference,
      verse_text: parsed.verse_text,
      reflection: parsed.reflection,
      journal_challenge: parsed.journal_challenge,
    });
  }

  if (!existingChallenge) {
    await supabase.from("grace_challenges").insert({
      challenge_text: parsed.challenge,
      challenge_date: today,
    });
  }

  return NextResponse.json({ message: "Generated successfully", devotion: parsed.title, challenge: parsed.challenge });
}
