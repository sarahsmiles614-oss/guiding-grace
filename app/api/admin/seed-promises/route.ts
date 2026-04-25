import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CATEGORIES = ["Peace", "Strength", "Hope", "Love", "Guidance", "Provision", "Healing", "Victory"];

async function generateForCategory(category: string) {
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
          content: `Generate 50 unique Bible scripture promises for the category "${category}" for a Christian faith app called Guiding Grace.

Rules:
- Use NIV translation
- Each verse must be genuinely about ${category}
- Include well-known AND lesser-known verses — variety is important
- No duplicates
- Cover both Old and New Testament
- Each reflection should be warm, personal, and 2-3 sentences

Return ONLY a JSON array with exactly 50 objects, no markdown:
[
  {
    "category": "${category}",
    "scripture": "Full verse text",
    "reference": "Book Chapter:Verse",
    "reflection": "2-3 warm sentences applying this to the reader's life."
  }
]`,
        },
        { role: "assistant", content: "[" },
      ],
    }),
  });

  const data = await response.json();
  const partial = data.content?.[0]?.text?.trim();
  if (!partial) throw new Error(`No response for ${category}`);

  const text = "[" + partial;
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`Could not extract JSON for ${category}`);

  return JSON.parse(match[0]);
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, number> = {};

  for (const category of CATEGORIES) {
    try {
      // Check how many we already have
      const { count } = await supabase
        .from("promise_scriptures")
        .select("*", { count: "exact", head: true })
        .eq("category", category);

      if ((count ?? 0) >= 50) {
        results[category] = count ?? 0;
        continue;
      }

      const promises = await generateForCategory(category);

      // Delete existing for this category and re-insert fresh
      await supabase.from("promise_scriptures").delete().eq("category", category);
      await supabase.from("promise_scriptures").insert(promises);

      results[category] = promises.length;
    } catch (e: any) {
      results[category] = -1;
      console.error(`Error for ${category}:`, e.message);
    }
  }

  return NextResponse.json({ success: true, results });
}
