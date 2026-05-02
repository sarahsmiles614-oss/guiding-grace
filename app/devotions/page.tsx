"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";
import ShareButton from "@/components/ShareButton";
import { supabase } from "@/lib/supabase";

function getToday() {
  const ny = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  const [m, d, y] = ny.split("/");
  return `${y}-${m}-${d}`;
}

function daysBetween(dateStr1: string, dateStr2: string) {
  const a = new Date(dateStr1 + "T12:00:00");
  const b = new Date(dateStr2 + "T12:00:00");
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export default function DevotionsPage() {
  const [today, setToday] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");
  const [searched, setSearched] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [teaser, setTeaser] = useState("");
  const [teaserLoading, setTeaserLoading] = useState(false);

  // Streak state
  const [streak, setStreak] = useState<number | null>(null);
  const [showGrace, setShowGrace] = useState(false);
  const [graceStreak, setGraceStreak] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  async function ensureToday() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch("/api/ensure-today", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
  }

  async function updateStreak(uid: string) {
    const today = getToday();

    const { data: existing } = await supabase
      .from("devotion_streaks")
      .select("streak_count, last_visit_date")
      .eq("user_id", uid)
      .single();

    if (!existing) {
      await supabase.from("devotion_streaks").insert({
        user_id: uid, streak_count: 1, last_visit_date: today,
      });
      setStreak(1);
      return;
    }

    const diff = daysBetween(existing.last_visit_date, today);

    if (diff === 0) {
      setStreak(existing.streak_count);
      return;
    }

    if (diff === 1) {
      const newStreak = existing.streak_count + 1;
      await supabase.from("devotion_streaks")
        .update({ streak_count: newStreak, last_visit_date: today })
        .eq("user_id", uid);
      setStreak(newStreak);
      return;
    }

    if (diff === 2) {
      // Missed exactly one day — offer grace
      setGraceStreak(existing.streak_count);
      setShowGrace(true);
      setStreak(existing.streak_count);
      return;
    }

    // Missed 2+ days — reset
    await supabase.from("devotion_streaks")
      .update({ streak_count: 1, last_visit_date: today })
      .eq("user_id", uid);
    setStreak(1);
  }

  async function handleGraceAccept() {
    if (!userId) return;
    const today = getToday();
    await supabase.from("devotion_streaks")
      .update({ last_visit_date: today })
      .eq("user_id", userId);
    setShowGrace(false);
  }

  async function handleGraceDecline() {
    if (!userId) return;
    const today = getToday();
    await supabase.from("devotion_streaks")
      .update({ streak_count: 1, last_visit_date: today })
      .eq("user_id", userId);
    setStreak(1);
    setShowGrace(false);
  }

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        updateStreak(user.id);
      }

      const todayStr = getToday();
      let { data } = await supabase
        .from("daily_devotions")
        .select("*")
        .eq("devotion_date", todayStr)
        .single();

      if (!data) {
        await ensureToday();
        const result = await supabase
          .from("daily_devotions")
          .select("*")
          .eq("devotion_date", todayStr)
          .single();
        data = result.data;
      }

      if (data) {
        setToday(data);
        fetchTeaser(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function fetchTeaser(devotion: any) {
    setTeaser("");
    setTeaserLoading(true);
    try {
      const res = await fetch("/api/challenge-teaser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: devotion.title,
          verse_reference: devotion.verse_reference,
          verse_text: devotion.verse_text,
          reflection: devotion.reflection,
        }),
      });
      const data = await res.json();
      if (data.teaser) setTeaser(data.teaser);
    } catch {
      // silently fail
    }
    setTeaserLoading(false);
  }

  async function handleSearch() {
    if (!searchDate) return;
    setSearching(true);
    setSearchError("");
    setSearched(null);
    setTeaser("");
    const { data } = await supabase
      .from("daily_devotions")
      .select("*")
      .eq("devotion_date", searchDate)
      .single();
    if (data) {
      setSearched(data);
      fetchTeaser(data);
    } else {
      setSearchError("No devotion found for that date.");
    }
    setSearching(false);
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }

  const displayed = searched || today;

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/edenmoon-rainbow-5145675_1920.jpg" overlayOpacity={0.75}>
        <main className="flex-1 p-6 flex flex-col items-center">
          <div className="w-full max-w-2xl text-center">
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/70 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Daily Devotions</h1>
              <div className="w-16" />
            </div>

            {/* Streak counter */}
            {streak !== null && (
              <div className="mb-6 flex justify-center">
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-5 py-2.5 rounded-2xl">
                  <span className="text-xl">🔥</span>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm leading-tight">{streak} day{streak !== 1 ? "s" : ""} in a row</p>
                    <p className="text-white/50 text-xs">Keep showing up 🌿</p>
                  </div>
                </div>
              </div>
            )}

            {/* Grace day dialog */}
            {showGrace && (
              <div className="mb-6 bg-amber-500/20 border border-amber-400/40 backdrop-blur-sm rounded-2xl p-5 text-center">
                <p className="text-2xl mb-2">🙏</p>
                <p className="text-white font-semibold mb-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                  You missed a day
                </p>
                <p className="text-white/80 text-sm mb-4" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}>
                  Your {graceStreak}-day streak is still within reach. Use your grace day to save it?
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleGraceAccept}
                    className="bg-amber-400/30 hover:bg-amber-400/50 border border-amber-300/50 text-white font-semibold px-6 py-2 rounded-xl text-sm transition"
                  >
                    Save My Streak 🙏
                  </button>
                  <button
                    onClick={handleGraceDecline}
                    className="text-white/50 hover:text-white/80 text-sm px-4 py-2 rounded-xl border border-white/10 transition"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}

            {/* Date search */}
            <div className="flex gap-2 mb-8">
              <input
                type="date"
                value={searchDate}
                onChange={e => { setSearchDate(e.target.value); setSearched(null); setSearchError(""); }}
                max={getToday()}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-white/50 [color-scheme:dark]"
              />
              <button
                onClick={handleSearch}
                disabled={!searchDate || searching}
                className="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm px-5 py-2 rounded-xl backdrop-blur-sm disabled:opacity-40 transition"
              >
                {searching ? "..." : "Search"}
              </button>
              {searched && (
                <button
                  onClick={() => { setSearched(null); setSearchDate(""); setSearchError(""); setTeaser(""); today && fetchTeaser(today); }}
                  className="text-white font-semibold text-sm px-3 py-2 rounded-xl border border-white/40 bg-white/15 hover:bg-white/25 transition"
                >
                  Today
                </button>
              )}
            </div>

            {loading ? (
              <p className="text-white text-center py-12">Loading...</p>
            ) : searchError ? (
              <p className="text-white text-center py-8">{searchError}</p>
            ) : !displayed ? (
              <p className="text-white text-center py-12">No devotion posted yet today. Check back soon. 🌅</p>
            ) : (
              <>
                <p className="text-white font-semibold text-sm mb-2 text-center" style={{ textShadow: "0 2px 10px rgba(0,0,0,1)" }}>{formatDate(displayed.devotion_date)}</p>
                <h2 className="text-3xl font-bold text-white mb-6 text-center" style={{ textShadow: "0 2px 14px rgba(0,0,0,0.9)", fontFamily: "'Playfair Display', Georgia, serif" }}>{displayed.title}</h2>
                <p className="text-white italic text-lg mb-2 text-center" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>"{displayed.verse_text}"</p>
                <p className="text-white/80 text-sm mb-8 text-center" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>— {displayed.verse_reference}</p>
                <p className="text-white leading-relaxed text-center" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>{displayed.reflection}</p>

                {/* Share devotion */}
                <div className="mt-6 flex justify-center">
                  <ShareButton
                    title={`${displayed.title} — Guiding Grace`}
                    text={`"${displayed.verse_text}" — ${displayed.verse_reference}\n\n${displayed.reflection}\n\nRead today's devotion on Guiding Grace:`}
                    url="https://guidinggrace.app"
                    label="🤍 Share This Devotion"
                    className="bg-white/25 hover:bg-white/35 border border-white/50 text-white font-semibold text-sm px-6 py-2.5 rounded-2xl backdrop-blur-sm transition"
                  />
                </div>

                {/* Grace Challenge CTA */}
                <div className="mt-10 mb-4 text-center">
                  <p className="text-white/80 text-xs uppercase tracking-widest mb-3" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>Today's Grace Challenge</p>
                  {teaserLoading ? (
                    <p className="text-white/60 text-sm italic mb-5 animate-pulse">Finding your challenge nudge...</p>
                  ) : teaser ? (
                    <p className="text-white text-sm leading-relaxed mb-5" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>{teaser}</p>
                  ) : (
                    <p className="text-white text-sm leading-relaxed mb-5" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                      This devotion has a matching real-world challenge waiting for you. Take what you just read and live it out today — your community is doing it alongside you.
                    </p>
                  )}
                  <Link href="/grace-challenge">
                    <button className="bg-white/30 hover:bg-white/40 border border-white/60 text-white font-bold px-8 py-3 rounded-xl transition" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                      Take the Challenge 💛
                    </button>
                  </Link>
                </div>

                {/* Dive Deeper CTA */}
                <div className="mt-6 text-center">
                  <Link href="/dive-deeper">
                    <button className="bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl transition text-sm" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                      📔 Dive Deeper — Open Journal
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
