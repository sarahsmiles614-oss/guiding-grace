"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";
import { supabase } from "@/lib/supabase";

function getToday() {
  const ny = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  const [m, d, y] = ny.split("/");
  return `${y}-${m}-${d}`;
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

  async function ensureToday() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch("/api/ensure-today", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
  }

  useEffect(() => {
    async function load() {
      const todayStr = getToday();
      let { data } = await supabase
        .from("daily_devotions")
        .select("*")
        .eq("devotion_date", todayStr)
        .single();

      // If no content yet, generate it then re-fetch
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
      // silently fail — fallback text shown instead
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
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/edenmoon-rainbow-5145675_1920.jpg">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/70 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Daily Devotions</h1>
              <div className="w-16" />
            </div>

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
                  className="text-white/50 hover:text-white/80 text-sm px-3 py-2 rounded-xl border border-white/10 transition"
                >
                  Today
                </button>
              )}
            </div>

            {loading ? (
              <p className="text-white/60 text-center py-12">Loading...</p>
            ) : searchError ? (
              <p className="text-white/50 text-center py-8">{searchError}</p>
            ) : !displayed ? (
              <p className="text-white/60 text-center py-12">No devotion posted yet today. Check back soon. 🌅</p>
            ) : (
              <>
                <p className="text-white/50 text-xs uppercase tracking-widest mb-2">{formatDate(displayed.devotion_date)}</p>
                <h2 className="text-3xl font-bold text-white mb-6" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)", fontFamily: "'Playfair Display', Georgia, serif" }}>{displayed.title}</h2>
                <p className="text-white/90 italic text-lg mb-2" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>"{displayed.verse_text}"</p>
                <p className="text-white/50 text-sm mb-8">— {displayed.verse_reference}</p>
                <p className="text-white/80 leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{displayed.reflection}</p>

                {/* Grace Challenge CTA */}
                <div className="mt-10 mb-4 bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm text-center">
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Today's Grace Challenge</p>
                  {teaserLoading ? (
                    <p className="text-white/40 text-sm italic mb-5 animate-pulse">Finding your challenge nudge...</p>
                  ) : teaser ? (
                    <p className="text-white/80 text-sm leading-relaxed mb-5">{teaser}</p>
                  ) : (
                    <p className="text-white/80 text-sm leading-relaxed mb-5">
                      This devotion has a matching real-world challenge waiting for you. Take what you just read and live it out today — your community is doing it alongside you.
                    </p>
                  )}
                  <Link href="/grace-challenge">
                    <button className="bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl backdrop-blur-sm transition">
                      Take the Challenge 💛
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
