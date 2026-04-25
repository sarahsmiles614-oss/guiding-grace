"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";

type Tab = "daily" | "weekly";

interface Entry {
  user_id: string;
  user_name: string;
  hearts: number;
  post_text?: string;
  allTimeHearts: number;
}

interface Notification {
  message: string;
}

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/jeffjacobs1990-cross-3643027_1920.jpg";

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>("daily");
  const [daily, setDaily] = useState<Entry[]>([]);
  const [weekly, setWeekly] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFullList, setShowFullList] = useState(false);
  const [expandedIdxs, setExpandedIdxs] = useState<Set<number>>(new Set());
  const [expandedWinner, setExpandedWinner] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [myAllTime, setMyAllTime] = useState(0);
  const [notification, setNotification] = useState<Notification | null>(null);

  const currentList = tab === "daily" ? daily : weekly;
  const winner = currentList[0] || null;
  const rest = currentList.slice(1);
  const myEntry = currentUser ? currentList.find(e => e.user_id === currentUser.id) : null;
  const myRank = myEntry ? currentList.indexOf(myEntry) + 1 : null;

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      setLoading(true);
      const allTimeMap = await loadAllTimeMap();
      await Promise.all([loadDaily(user, allTimeMap), loadWeekly(allTimeMap)]);
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (currentUser && daily.length > 0) checkNotification();
  }, [currentUser, daily]);

  async function loadAllTimeMap(): Promise<Record<string, number>> {
    const { data } = await supabase.from("user_heart_totals").select("user_id, lifetime_hearts");
    if (!data) return {};
    const map: Record<string, number> = {};
    data.forEach((r: any) => { map[r.user_id] = r.lifetime_hearts; });
    return map;
  }

  async function loadDaily(user: any, allTimeMap: Record<string, number>) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];
    const { data: c } = await supabase.from("grace_challenges").select("id").eq("challenge_date", dateStr).single();
    if (!c) return;
    const { data: posts } = await supabase.from("grace_challenge_posts").select("id, user_id, user_name, post_text").eq("challenge_id", c.id);
    if (!posts) return;
    const results: Entry[] = await Promise.all(posts.map(async (post: any) => {
      const { count } = await supabase.from("grace_challenge_hearts").select("*", { count: "exact", head: true }).eq("post_id", post.id);
      return {
        user_id: post.user_id,
        user_name: post.user_name,
        hearts: count || 0,
        post_text: post.post_text,
        allTimeHearts: allTimeMap[post.user_id] || 0,
      };
    }));
    const sorted = results.sort((a, b) => b.hearts - a.hearts);
    setDaily(sorted);
    if (user) {
      setMyAllTime(allTimeMap[user.id] || 0);
    }
  }

  async function loadWeekly(allTimeMap: Record<string, number>) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data: challenges } = await supabase.from("grace_challenges").select("id").gte("challenge_date", weekAgo.toISOString().split("T")[0]);
    if (!challenges) return;
    const { data: posts } = await supabase.from("grace_challenge_posts").select("id, user_id, user_name").in("challenge_id", challenges.map((c: any) => c.id));
    if (!posts) return;
    const userTotals: Record<string, Entry> = {};
    for (const post of posts) {
      const { count } = await supabase.from("grace_challenge_hearts").select("*", { count: "exact", head: true }).eq("post_id", post.id);
      if (!userTotals[post.user_id]) {
        userTotals[post.user_id] = { user_id: post.user_id, user_name: post.user_name, hearts: 0, allTimeHearts: allTimeMap[post.user_id] || 0 };
      }
      userTotals[post.user_id].hearts += count || 0;
    }
    setWeekly(Object.values(userTotals).sort((a, b) => b.hearts - a.hearts));
  }

  function checkNotification() {
    if (!currentUser || typeof window === "undefined") return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];
    const key = `grace_notified_${dateStr}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");

    const myDailyEntry = daily.find(e => e.user_id === currentUser.id);
    const rank = myDailyEntry ? daily.indexOf(myDailyEntry) + 1 : null;
    let message = "";

    if (!myDailyEntry) {
      message = "The challenge is waiting for you. Every day is a new chance to share your grace.";
    } else if (myDailyEntry.hearts === 0) {
      message = "You showed up today and that matters to God even when it goes unnoticed by others. Keep going — your faithfulness is seen.";
    } else if (rank === 1) {
      message = `You were Most Loved today! 🏆 Your response touched ${myDailyEntry.hearts} heart${myDailyEntry.hearts !== 1 ? "s" : ""}.`;
    } else {
      message = `You placed #${rank} today and received ${myDailyEntry.hearts} heart${myDailyEntry.hearts !== 1 ? "s" : ""}. Beautiful offering — keep showing up.`;
    }

    setNotification({ message });
  }

  function toggleEntry(idx: number) {
    setExpandedIdxs(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  function switchTab(t: Tab) {
    setTab(t);
    setShowFullList(false);
    setExpandedIdxs(new Set());
    setExpandedWinner(false);
  }

  return (
    <SubscriptionGuard>
      <PageBackground url={BG}>

        {/* Daily results notification */}
        {notification && (
          <div className="fixed inset-0 z-50 flex items-end justify-center pb-12 px-6">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setNotification(null)} />
            <div className="relative w-full max-w-sm text-center">
              <p className="text-white text-xl font-semibold mb-6 leading-snug"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 16px rgba(0,0,0,0.95)" }}>
                {notification.message}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setNotification(null)}
                  className="text-white/60 text-sm py-2.5 px-6 border border-white/20 rounded-full transition hover:text-white">
                  Dismiss
                </button>
                <button
                  onClick={() => setNotification(null)}
                  className="text-white text-sm font-semibold py-2.5 px-6 bg-white/15 border border-white/30 rounded-full transition hover:bg-white/25">
                  See Full Results →
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 px-6 pt-8 pb-20">
          <div className="max-w-lg mx-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <Link href="/grace-challenge" className="text-white/60 text-sm hover:text-white transition">← Challenge</Link>
              <h1 className="text-base font-semibold text-white tracking-wide" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                Leaderboard
              </h1>
              <div className="w-16" />
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-12 mb-12">
              {(["daily", "weekly"] as Tab[]).map(t => (
                <button key={t} onClick={() => switchTab(t)}
                  className={`text-sm font-semibold pb-1.5 transition ${tab === t ? "text-white border-b-2 border-white" : "text-white/45 hover:text-white/70"}`}>
                  {t === "daily" ? "Yesterday" : "This Week"}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="text-center text-white/40 py-20 animate-pulse text-sm">Loading...</p>
            ) : currentList.length === 0 ? (
              <p className="text-center text-white/40 py-20 text-sm">No results yet.</p>
            ) : (
              <>
                {/* ── #1 Winner ── */}
                {winner && (
                  <div className="text-center mb-14">
                    {/* Crown */}
                    <div className="text-5xl mb-3 leading-none"
                      style={{ filter: "drop-shadow(0 0 16px rgba(255,215,0,0.9))" }}>
                      👑
                    </div>

                    {/* Glow halo */}
                    <div className="relative inline-block mb-1">
                      <div className="absolute -inset-8 rounded-full"
                        style={{ background: "radial-gradient(ellipse at center, rgba(255,215,0,0.15) 0%, transparent 70%)" }} />
                      <button onClick={() => setExpandedWinner(v => !v)} className="relative">
                        <p className="text-4xl font-bold text-white leading-tight"
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            textShadow: "0 0 40px rgba(255,215,0,0.5), 0 0 15px rgba(255,215,0,0.3), 0 3px 16px rgba(0,0,0,0.95)"
                          }}>
                          {winner.user_name}
                        </p>
                      </button>
                    </div>

                    <p className="text-white/40 text-xs mb-4">({winner.allTimeHearts} ♥ all time)</p>

                    {/* Heart count */}
                    <div className="flex items-center justify-center gap-2 mb-5">
                      <span className="text-4xl font-bold text-yellow-300"
                        style={{ textShadow: "0 0 24px rgba(255,215,0,0.9), 0 0 8px rgba(255,215,0,0.5), 0 2px 8px rgba(0,0,0,0.8)" }}>
                        {winner.hearts}
                      </span>
                      <span className="text-3xl" style={{ filter: "drop-shadow(0 0 10px rgba(255,215,0,0.7))" }}>💛</span>
                    </div>

                    {/* Expand toggle */}
                    <button onClick={() => setExpandedWinner(v => !v)}
                      className="text-white/40 text-sm hover:text-white/70 transition">
                      {expandedWinner ? "▲" : "▼"}
                    </button>

                    {expandedWinner && (
                      <div className="mt-5 max-w-sm mx-auto">
                        <p className="text-white/75 text-sm leading-relaxed italic"
                          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                          "{winner.post_text || "No response submitted"}"
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Full leaderboard toggle ── */}
                {rest.length > 0 && (
                  <>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex-1 h-px bg-white/10" />
                      <button
                        onClick={() => setShowFullList(v => !v)}
                        className="text-white/50 text-xs font-medium whitespace-nowrap hover:text-white/80 transition py-2 px-4">
                        {showFullList ? "Hide Leaderboard ▲" : "View Full Leaderboard ▼"}
                      </button>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {showFullList && (
                      <div className="mb-12">
                        {rest.map((entry, i) => {
                          const rank = i + 2;
                          const isExpanded = expandedIdxs.has(i);
                          return (
                            <div key={i} className="border-b border-white/8">
                              <button
                                onClick={() => toggleEntry(i)}
                                className="w-full flex items-center gap-3 py-3.5 text-left">
                                <span className="text-white/35 text-xs w-5 flex-shrink-0 text-right">{rank}</span>
                                <div className="flex-1 min-w-0">
                                  <span className="text-white text-sm font-medium"
                                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                                    {entry.user_name}
                                  </span>
                                  <span className="text-white/30 text-xs ml-2">({entry.allTimeHearts} ♥ all time)</span>
                                </div>
                                <span className="text-white/70 text-sm font-semibold flex-shrink-0">{entry.hearts} 💛</span>
                                <span className="text-white/35 text-xs flex-shrink-0 ml-1">{isExpanded ? "▲" : "▼"}</span>
                              </button>
                              {isExpanded && (
                                <p className="text-white/55 text-xs leading-relaxed italic pb-3 pl-8 pr-4">
                                  {entry.post_text ? `"${entry.post_text}"` : "No response submitted"}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {/* ── My Results ── */}
                <div className="mt-14 text-center">
                  <p className="text-white/35 text-xs uppercase tracking-widest mb-5">My Results</p>
                  {myEntry ? (
                    <div className="space-y-2">
                      <p className="text-white text-3xl font-bold"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
                        #{myRank}
                      </p>
                      <p className="text-white/70 text-sm">{myEntry.hearts} heart{myEntry.hearts !== 1 ? "s" : ""} received</p>
                      <p className="text-white/40 text-xs">{currentList.length} people participated</p>
                      <p className="text-white/35 text-xs mt-3">{myEntry.allTimeHearts} ♥ all time</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-white/50 text-sm">
                        You didn't participate {tab === "daily" ? "yesterday" : "this week"}
                      </p>
                      <p className="text-white/35 text-xs">{myAllTime} ♥ all time</p>
                      <Link href="/grace-challenge"
                        className="inline-block mt-3 text-white/60 text-xs underline hover:text-white transition">
                        Join today's challenge →
                      </Link>
                    </div>
                  )}
                </div>

              </>
            )}
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
