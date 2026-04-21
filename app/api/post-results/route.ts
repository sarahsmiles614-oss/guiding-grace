import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const HEARTS_PER_DAY = 3;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ny = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  const [m, d, y] = ny.split("/");
  const today = `${y}-${m}-${d}`;

  const { data: challenge } = await supabase.from("grace_challenges").select("id").eq("challenge_date", today).single();
  if (!challenge) return NextResponse.json({ message: "No challenge today" });

  const { data: posts } = await supabase.from("grace_challenge_posts").select("id, user_id, user_name").eq("challenge_id", challenge.id);
  if (!posts || posts.length === 0) return NextResponse.json({ message: "No posts today" });

  const { data: allHearts } = await supabase.from("grace_challenge_hearts").select("post_id, giver_user_id").eq("challenge_id", challenge.id);
  if (!allHearts) return NextResponse.json({ message: "No hearts today" });

  const heartsGivenByUser: Record<string, number> = {};
  allHearts.forEach((h: any) => {
    heartsGivenByUser[h.giver_user_id] = (heartsGivenByUser[h.giver_user_id] || 0) + 1;
  });

  const validHeartsPerPost: Record<string, number> = {};
  allHearts.forEach((h: any) => {
    const othersCount = posts.filter((p: any) => p.user_id !== h.giver_user_id).length;
    const required = Math.min(HEARTS_PER_DAY, othersCount);
    const given = heartsGivenByUser[h.giver_user_id] || 0;
    if (given >= required) {
      validHeartsPerPost[h.post_id] = (validHeartsPerPost[h.post_id] || 0) + 1;
    }
  });

  for (const post of posts) {
    const validCount = validHeartsPerPost[post.id] || 0;
    if (validCount === 0) continue;
    const { data: existing } = await supabase.from("user_heart_totals").select("lifetime_hearts").eq("user_id", post.user_id).single();
    await supabase.from("user_heart_totals").upsert({
      user_id: post.user_id,
      user_name: post.user_name,
      lifetime_hearts: (existing?.lifetime_hearts || 0) + validCount,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
  }

  return NextResponse.json({ message: "Results posted", validHeartsPerPost });
}
