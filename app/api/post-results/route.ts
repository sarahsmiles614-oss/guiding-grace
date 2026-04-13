import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  // Get today's challenge
  const { data: challenge } = await supabase
    .from("grace_challenges")
    .select("id")
    .eq("challenge_date", today)
    .single();

  if (!challenge) return NextResponse.json({ message: "No challenge today" });

  // Get all posts for today
  const { data: posts } = await supabase
    .from("grace_challenge_posts")
    .select("id, user_id, user_name")
    .eq("challenge_id", challenge.id);

  if (!posts || posts.length === 0) return NextResponse.json({ message: "No posts today" });

  // For each post, count hearts and update user lifetime totals
  // Only count hearts for users who used all their hearts
  for (const post of posts) {
    const { count: heartsReceived } = await supabase
      .from("grace_challenge_hearts")
      .select("*", { count: "exact", head: true })
      .eq("post_id", post.id);

    if (!heartsReceived) continue;

    // Check if this user gave all their hearts
    const otherPostsCount = posts.filter(p => p.user_id !== post.user_id).length;
    const heartBudget = Math.min(5, otherPostsCount);

    const { count: heartsGiven } = await supabase
      .from("grace_challenge_hearts")
      .select("*", { count: "exact", head: true })
      .eq("giver_user_id", post.user_id)
      .eq("challenge_id", challenge.id);

    const usedAllHearts = heartBudget === 0 || (heartsGiven || 0) >= heartBudget;

    if (usedAllHearts && heartsReceived > 0) {
      // Upsert lifetime totals
      const { data: existing } = await supabase
        .from("user_heart_totals")
        .select("lifetime_hearts")
        .eq("user_id", post.user_id)
        .single();

      await supabase.from("user_heart_totals").upsert({
        user_id: post.user_id,
        user_name: post.user_name,
        lifetime_hearts: (existing?.lifetime_hearts || 0) + heartsReceived,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }
  }

  return NextResponse.json({ message: "Results posted successfully" });
}
