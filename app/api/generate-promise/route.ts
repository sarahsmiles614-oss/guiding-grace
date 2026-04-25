import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const { category, recentRefs = [] } = await req.json();
  const cat = category && category !== "All" ? category : null;

  let query = supabase.from("promise_scriptures").select("*");
  if (cat) query = query.eq("category", cat);

  const { data, error } = await query;
  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: "No scriptures found" }, { status: 404 });
  }

  // Filter out recently seen references
  const pool = recentRefs.length > 0
    ? data.filter((p: any) => !recentRefs.includes(p.reference))
    : data;

  const source = pool.length > 0 ? pool : data;
  const pick = source[Math.floor(Math.random() * source.length)];

  return NextResponse.json(pick);
}
