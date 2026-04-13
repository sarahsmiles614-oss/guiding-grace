"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";

type Tab = "daily" | "weekly" | "alltime";

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>("daily");
  const [daily, setDaily] = useState<any[]>([]);
  const [weekly, setWeekly] = useState<any[]>([]);
  const [allTime, setAllTime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    await Promise.all([loadDaily(), loadWeekly(), loadAllTime()]);
    setLoading(false);
  }

  async function loadDaily() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const { data: c } = await supabase.from("grace_challenges").select("id").eq("challenge_date", yesterday.toISOString().split("T")[0]).single();
    if (!c) return;
    const { data: posts } = await supabase.from("grace_challenge_posts").select("id, user_name, post_text, completed").eq("challenge_id", c.id);
    if (!posts) return;
    const results = await Promise.all(posts.map(async (post) => {
      const { count } = await supabase.from("grace_challenge_hearts").select("*", { count: "exact", head: true }).eq("post_id", post.id);
      return { ...post, hearts: count || 0 };
    }));
    setDaily(results.sort((a, b) => b.hearts - a.hearts));
  }

  async function loadWeekly() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data: challenges } = await supabase.from("grace_challenges").select("id").gte("challenge_date", weekAgo.toISOString().split("T")[0]);
    if (!challenges) return;
    const { data: posts } = await supabase.from("grace_challenge_posts").select("id, user_name, user_id").in("challenge_id", challenges.map((c: any) => c.id));
    if (!posts) return;
    const userTotals: Record<string, { user_name: string; hearts: number }> = {};
    for (const post of posts) {
      const { count } = await supabase.from("grace_challenge_hearts").select("*", { count: "exact", head: true }).eq("post_id", post.id);
      if (!userTotals[post.user_id]) userTotals[post.user_id] = { user_name: post.user_name, hearts: 0 };
      userTotals[post.user_id].hearts += count || 0;
    }
    setWeekly(Object.values(userTotals).sort((a, b) => b.hearts - a.hearts));
  }

  async function loadAllTime() {
    const { data } = await supabase.from("user_heart_totals").select("*").order("lifetime_hearts", { ascending: false }).limit(20);
    if (data) setAllTime(data);
  }

  const medal = (i: number) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
  const currentList = tab === "daily" ? daily : tab === "weekly" ? weekly : allTime;

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/jeffjacobs1990-cross-3643027_1920.jpg">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Link href="/grace-challenge" className="text-white/70 text-sm">← Challenge</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Leaderboard 🏆</h1>
              <div className="w-16" />
            </div>

            <div className="flex gap-3 mb-8">
              {(["daily", "weekly", "alltime"] as Tab[]).map(t => (
                <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${tab === t ? "bg-white/30 text-white" : "text-white/50 hover:text-white"}`}>
                  {t === "daily" ? "Yesterday" : t === "weekly" ? "This Week" : "All Time"}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="text-center text-white/50 py-12">Loading...</p>
            ) : currentList.length === 0 ? (
              <p className="text-center text-white/50 py-12">No results yet.</p>
            ) : (
              <div className="space-y-4">
                {currentList.map((entry, i) => (
                  <div key={i} className={`flex items-center gap-4 ${i === 0 ? "border-l-2 border-yellow-400 pl-4" : ""}`}>
                    <span className="text-2xl w-8 text-center">{medal(i)}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-white" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>{entry.user_name}</p>
                      {tab === "daily" && entry.post_text && <p className="text-white/50 text-xs mt-0.5 line-clamp-1">{entry.post_text}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">💛</span>
                      <span className="font-bold text-white/80">{tab === "alltime" ? entry.lifetime_hearts : entry.hearts}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
