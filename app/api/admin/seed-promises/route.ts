import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CATEGORIES = ["Peace", "Strength", "Hope", "Love", "Guidance", "Provision", "Healing", "Victory"];

function getBooksForRound(round: number): string {
  const books: Record<number, string> = {
    1: "Psalms, Proverbs, Ecclesiastes",
    2: "Matthew, Mark, Luke, John",
    3: "Romans, Corinthians, Galatians, Ephesians, Philippians",
    4: "Isaiah, Jeremiah, Ezekiel, Daniel",
    5: "Genesis, Exodus, Deuteronomy, Joshua",
    6: "Hebrews, James, Peter, John (epistles), Revelation",
    7: "Hosea, Joel, Amos, Micah, Habakkuk, Zephaniah, Zechariah",
    8: "Acts, Colossians, Thessalonians, Timothy, Titus",
  };
  return books[round] ?? books[1];
}

async function generateBatch(category: string, round: number): Promise<any[]> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: `Generate 10 unique Bible scripture promises about "${category}" ONLY from these specific Bible books: ${getBooksForRound(round)}.

- NIV translation
- Pull directly from the listed books only
- Each reflection is 2 personal sentences

Return ONLY a raw JSON array, no markdown, no explanation:
[{"category":"${category}","scripture":"...","reference":"...","reflection":"..."}]`,
        },
      ],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text?.trim() ?? "";

  // Extract JSON array from response
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error(`No JSON array found for ${category}: ${text.slice(0, 200)}`);

  return JSON.parse(text.slice(start, end + 1));
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const round = parseInt(url.searchParams.get("round") ?? "1");

  if (!category || !CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Provide ?category=Peace (or Strength, Hope, Love, Guidance, Provision, Healing, Victory)" });
  }

  try {
    const rows = await generateBatch(category, round);
    const { error } = await supabase.from("promise_scriptures").insert(
      rows.map(r => ({
        category: r.category || category,
        scripture: r.scripture,
        reference: r.reference,
        reflection: r.reflection,
      }))
    );
    if (error) return NextResponse.json({ error: error.message });
    return NextResponse.json({ category, inserted: rows.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
