"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";
import { supabase } from "@/lib/supabase";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/thibault-mokuenko-pY-bhzf_ZDk-unsplash.jpg";

function getToday() {
  const ny = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  const [m, d, y] = ny.split("/");
  return `${y}-${m}-${d}`;
}

export default function TodayPage() {
  const [user, setUser] = useState<any>(null);
  const [devotion, setDevotion] = useState<any>(null);
  const [challenge, setChallenge] = useState<any>(null);
  const [guide, setGuide] = useState<any>(null);
  const [streak, setStreak] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [hour, setHour] = useState(new Date().getHours());

  useEffect(() => {
    setHour(new Date().getHours());
    load();
  }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUser(user);

    const today = getToday();

    const [devotionRes, challengeRes, guideRes] = await Promise.all([
      supabase.from("daily_devotions").select("title, verse_reference, verse_text, reflection").eq("devotion_date", today).single(),
      supabase.from("grace_challenges").select("challenge_text").eq("challenge_date", today).single(),
      supabase.from("study_guides").select("title, background, questions").eq("guide_date", today).single(),
    ]);

    if (devotionRes.data) setDevotion(devotionRes.data);
    if (challengeRes.data) setChallenge(challengeRes.data);
    if (guideRes.data) setGuide(guideRes.data);

    if (user) {
      const { data: s } = await supabase
        .from("devotion_streaks")
        .select("streak_count")
        .eq("user_id", user.id)
        .single();
      if (s) setStreak(s.streak_count);
    }

    setLoading(false);
  }

  function greeting() {
    const name = user?.user_metadata?.full_name?.split(" ")[0] || "friend";
    if (hour < 12) return `Good morning, ${name} 🌅`;
    if (hour < 17) return `Good afternoon, ${name} ☀️`;
    return `Good evening, ${name} 🌙`;
  }

  function formatDate() {
    return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }

  return (
    <SubscriptionGuard>
      <PageBackground url={BG} overlayOpacity={0.6}>
        <main className="flex-1 p-6 pb-24 flex flex-col items-center">
          <div className="max-w-2xl w-full">

            <div className="flex justify-between items-center mb-8">
              <Link href="/dashboard" className="text-white/60 hover:text-white text-sm transition">← Home</Link>
              <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Today</h1>
              <div className="w-16" />
            </div>

            {loading ? (
              <p className="text-white/60 text-center py-20 text-sm">Loading your day...</p>
            ) : (
              <div className="space-y-6">

                <div className="text-center mb-2">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{formatDate()}</p>
                  <h2 className="text-white text-2xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                    {greeting()}
                  </h2>
                  {streak !== null && (
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <span className="text-lg">🔥</span>
                      <span className="text-white/70 text-sm">{streak} day streak</span>
                    </div>
                  )}
                </div>

                {devotion && (
                  <Link href="/devotions">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📖</span>
                          <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">Daily Devotion</p>
                        </div>
                        <span className="text-white/30 text-xs">Read →</span>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2 leading-snug" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>
                        {devotion.title}
                      </h3>
                      <p className="text-amber-200 text-xs font-semibold mb-2">{devotion.verse_reference}</p>
                      <p className="text-white/70 text-sm leading-relaxed italic">
                        "{devotion.verse_text.slice(0, 100)}{devotion.verse_text.length > 100 ? "..." : ""}"
                      </p>
                    </div>
                  </Link>
                )}

                {challenge && (
                  <Link href="/grace-challenge">
                    <div className="bg-white/10 backdrop-blur-sm border border-yellow-300/30 rounded-2xl p-5 hover:bg-white/15 transition cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">💛</span>
                          <p className="text-yellow-300 text-xs uppercase tracking-widest font-semibold">Grace Challenge</p>
                          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                        </div>
                        <span className="text-white/30 text-xs">Join →</span>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {challenge.challenge_text}
                      </p>
                    </div>
                  </Link>
                )}

                {guide && (
                  <Link href="/study-guide">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📚</span>
                          <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">Study Guide</p>
                        </div>
                        <span className="text-white/30 text-xs">Study →</span>
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-2">{guide.title}</h3>
                      <p className="text-white/60 text-xs leading-relaxed">
                        {guide.background?.slice(0, 100)}...
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {guide.questions?.slice(0, 2).map((q: string, i: number) => (
                          <span key={i} className="text-white/40 text-xs border border-white/15 rounded-lg px-2 py-1">
                            Q{i + 1}: {q.slice(0, 40)}...
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                )}

                <Link href="/scripture-match">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎮</span>
                        <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">Scripture Match</p>
                      </div>
                      <span className="text-white/30 text-xs">Play →</span>
                    </div>
                    <p className="text-white/70 text-sm">Match today's verses and characters — can you beat your best time?</p>
                  </div>
                </Link>

                <Link href="/bible-365">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎧</span>
                        <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">Bible in 365 Days</p>
                      </div>
                      <span className="text-white/30 text-xs">Continue →</span>
                    </div>
                    <p className="text-white/70 text-sm">Pick up where you left off in your reading plan.</p>
                  </div>
                </Link>

                {hour >= 17 && (
                  <Link href="/nightly-reflections">
                    <div className="bg-white/10 backdrop-blur-sm border border-purple-300/20 rounded-2xl p-5 hover:bg-white/15 transition cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🌙</span>
                          <p className="text-purple-200 text-xs uppercase tracking-widest font-semibold">Nightly Reflection</p>
                        </div>
                        <span className="text-white/30 text-xs">Reflect →</span>
                      </div>
                      <p className="text-white/70 text-sm">End your day with gratitude and surrender.</p>
                    </div>
                  </Link>
                )}

                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { href: "/promises", icon: "🕊️", label: "Promises" },
                    { href: "/prayer-wall", icon: "🙏", label: "Prayer Wall" },
                    { href: "/testimony-wall", icon: "✨", label: "Testimonies" },
                    { href: "/heavens-hearts", icon: "💜", label: "Heaven's Hearts" },
                    { href: "/heroes-villains", icon: "⚔️", label: "Heroes & Villains" },
                    { href: "/shame-recycle", icon: "🗑️", label: "Shame Recycle" },
                  ].map(f => (
                    <Link key={f.href} href={f.href}>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center hover:bg-white/10 transition cursor-pointer">
                        <span className="text-xl block mb-1">{f.icon}</span>
                        <span className="text-white/50 text-xs leading-tight">{f.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>

              </div>
            )}
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
