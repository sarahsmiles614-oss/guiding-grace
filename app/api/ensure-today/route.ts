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
  const weekday = date.toLocaleString("en-US", { timeZone: "America/New_York", weekday: "long" });
  const month = date.toLocaleString("en-US", { timeZone: "America/New_York", month: "long" });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-7",
      max_tokens: 1200,
      messages: [{
        role: "user",
        content: `You are generating daily content for Guiding Grace — a Christian faith app built for people who want to LIVE their faith, not just read about it. Users take on a real-world grace challenge every day, share their story with a community, and vote on each other's responses. The devotion and challenge are always directly connected — the devotion inspires, the challenge is how you go live it out.

Today is ${weekday}, ${fullDate}.

--- THEME SELECTION (follow this priority order exactly) ---
1. If today is a major US Christian or national holiday/observance, use that theme. Known dates:
   - Mother's Day = second Sunday in May (NOT the days before or after)
   - Father's Day = third Sunday in June (NOT the days before or after)
   - Memorial Day = last Monday in May (NOT the days before or after)
   - Independence Day = July 4 only
   - Thanksgiving = fourth Thursday in November only
   - Christmas = December 25 only
   - Easter = varies (calculate correctly for the year)
   - New Year's Day = January 1 only
   Today is ${weekday}. Apply the holiday rule ONLY if today's date exactly matches. If it does not match, do NOT use a nearby holiday as the theme.
2. If no holiday applies, consider the Christian liturgical season (Advent, Lent, Easter season, Ordinary Time, Pentecost).
3. If neither applies, choose a fresh, meaningful faith theme for ${month} — grace, forgiveness, courage, service, trust, community, healing, gratitude, purpose, patience, etc. Vary the theme; avoid repeating common ones like "prayer" or "trust" unless they are especially fitting for the date.

--- DEVOTION REQUIREMENTS ---
- Title: 4–6 words, evocative and specific (not generic like "Walking in Faith")
- Verse: Choose a verse from the NIV Bible that directly connects to the theme. Quote it accurately word-for-word.
- Reflection: 3–4 warm, personal sentences. Speak directly to the reader as "you." Be specific to the verse. Be encouraging but honest — not preachy. End with a natural lead-in toward the challenge.

--- CHALLENGE REQUIREMENTS ---
The challenge must be the real-world outward expression of the devotion theme. It flows directly from what the devotion said.
RULES (all must be followed):
1. Must involve another person — a neighbor, friend, family member, stranger, coworker, or community member.
2. Must be a specific, doable action — not vague ("be kind today" is too vague; "text one person you've been meaning to check on and tell them one specific thing you appreciate about them" is specific).
3. Must be achievable today by anyone regardless of schedule or budget — no purchases, no events, no travel required.
4. Must NEVER be inner work: no journaling, no personal prayer alone, no self-reflection — those belong in the journal feature.
5. Should feel connected to the devotion — the user should be able to see how the verse led to this action.

--- OUTPUT FORMAT ---
Return ONLY a valid JSON object. No markdown, no explanation, no preamble. Exactly these fields:
{
  "title": "Devotion title here",
  "verse_reference": "Book Chapter:Verse",
  "verse_text": "Exact NIV verse text here",
  "reflection": "3-4 sentences of reflection here.",
  "challenge": "1-2 sentences describing the specific grace challenge here."
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
