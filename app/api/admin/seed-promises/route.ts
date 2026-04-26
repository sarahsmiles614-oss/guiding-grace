import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CATEGORIES = ["Peace", "Strength", "Hope", "Love", "Guidance", "Provision", "Healing", "Victory"];

async function generateBatch(category: string): Promise<any[]> {
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
          content: `Generate 50 unique Bible scripture promises for the category "${category}".

- NIV translation
- No duplicates
- Mix of Old and New Testament
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

  const results: Record<string, any> = {};

  for (const category of CATEGORIES) {
    try {
      const rows = await generateBatch(category);

      // Delete old rows for this category first
      await supabase.from("promise_scriptures").delete().eq("category", category);

      // Insert in one batch
      const { error, count } = await supabase
        .from("promise_scriptures")
        .insert(rows.map(r => ({
          category: r.category || category,
          scripture: r.scripture,
          reference: r.reference,
          reflection: r.reflection,
        })));

      if (error) {
        results[category] = { error: error.message };
      } else {
        results[category] = { inserted: rows.length };
      }
    } catch (e: any) {
      results[category] = { error: e.message };
    }
  }

  return NextResponse.json({ results });
}
