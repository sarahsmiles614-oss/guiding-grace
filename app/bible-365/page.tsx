"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";
import { supabase } from "@/lib/supabase";
import { getBiblePlan, bibleApiUrl } from "@/lib/bible-plan";

interface Verse {
  reference: string;   // "Genesis 1:1"
  text: string;
  bookName: string;
  chapter: number;
  verseNum: number;
  chapterLabel: string; // "Genesis 1"
}

type FontSize = "sm" | "base" | "lg";
type Speed = 0.75 | 1 | 1.25;
type HighlightColor = "yellow" | "blue" | "pink";

const FONT_CLASSES: Record<FontSize, string> = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-xl",
};

const HIGHLIGHT: Record<HighlightColor, { bg: string; border: string; num: string; resume: string; resumeText: string }> = {
  yellow: {
    bg: "bg-yellow-400/25",
    border: "border-yellow-300",
    num: "text-yellow-300",
    resume: "bg-yellow-400/15 border-yellow-400/30",
    resumeText: "text-yellow-300",
  },
  blue: {
    bg: "bg-blue-400/25",
    border: "border-blue-300",
    num: "text-blue-300",
    resume: "bg-blue-400/15 border-blue-400/30",
    resumeText: "text-blue-300",
  },
  pink: {
    bg: "bg-pink-400/25",
    border: "border-pink-300",
    num: "text-pink-300",
    resume: "bg-pink-400/15 border-pink-400/30",
    resumeText: "text-pink-300",
  },
};

const COLOR_SWATCHES: { id: HighlightColor; swatch: string; label: string }[] = [
  { id: "yellow", swatch: "bg-yellow-400", label: "Yellow" },
  { id: "blue",   swatch: "bg-blue-400",   label: "Blue"   },
  { id: "pink",   swatch: "bg-pink-400",   label: "Pink"   },
];

const SPEEDS: Speed[] = [0.75, 1, 1.25];

export default function Bible365Page() {
  const plan = getBiblePlan();
  const searchParams = useSearchParams();

  const [userId, setUserId] = useState<string | null>(null);
  const [day, setDay] = useState(() => {
    const param = searchParams.get("day");
    if (param) {
      const n = parseInt(param);
      if (!isNaN(n)) return Math.min(Math.max(1, n), 365);
    }
    return 1;
  });
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Playback
  const [playing, setPlaying] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(-1);
  const [resumeVerse, setResumeVerse] = useState(0);
  const [speed, setSpeed] = useState<Speed>(1);
  const speedRef = useRef<Speed>(1);
  const stopSignal = useRef(false);

  // Preferences
  const [fontSize, setFontSize] = useState<FontSize>("base");
  const [highlightColor, setHighlightColor] = useState<HighlightColor>("yellow");

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const verseEls = useRef<(HTMLDivElement | null)[]>([]);

  const todayReading = plan[day - 1];
  const progress = Math.round((day / 365) * 100);
  const hasSpeech = typeof window !== "undefined" && "speechSynthesis" in window;
  const hl = HIGHLIGHT[highlightColor];

  // ── Load user, saved progress, bookmarks ──────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);

      const { data: prog } = await supabase
        .from("bible365_progress")
        .select("day, verse_index, font_size, speed, highlight_color")
        .eq("user_id", user.id)
        .single();

      if (prog) {
        // URL param takes priority (e.g. navigating from bookmarks)
        if (!searchParams.get("day")) setDay(Math.min(Math.max(1, prog.day ?? 1), 365));
        setResumeVerse(prog.verse_index ?? 0);
        setFontSize((prog.font_size as FontSize) ?? "base");
        const s = (prog.speed as Speed) ?? 1;
        setSpeed(s);
        speedRef.current = s;
        if (prog.highlight_color) setHighlightColor(prog.highlight_color as HighlightColor);
      }

      const { data: bks } = await supabase
        .from("bible365_bookmarks")
        .select("verse_reference")
        .eq("user_id", user.id);

      if (bks) setBookmarks(new Set(bks.map((b: any) => b.verse_reference)));
    });
  }, []);

  // ── Save progress ──────────────────────────────────────────────────────────
  const saveProgress = useCallback(
    async (d: number, vi: number, fs: FontSize, sp: Speed, hc: HighlightColor) => {
      if (!userId) return;
      await supabase.from("bible365_progress").upsert(
        { user_id: userId, day: d, verse_index: vi, font_size: fs, speed: sp, highlight_color: hc, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
    },
    [userId]
  );

  // ── Fetch scripture when day changes ──────────────────────────────────────
  useEffect(() => {
    cancelSpeech();
    setVerses([]);
    setFetchError(null);
    setLoading(true);
    setCurrentVerse(-1);
    verseEls.current = [];

    async function fetchDay() {
      try {
        const all: Verse[] = [];
        for (const ch of plan[day - 1].chapters) {
          const res = await fetch(bibleApiUrl(ch, "kjv"));
          if (!res.ok) throw new Error();
          const data = await res.json();
          for (const v of (data.verses as any[])) {
            all.push({
              reference: `${ch.bookName} ${ch.chapter}:${v.verse}`,
              text: v.text.trim(),
              bookName: ch.bookName,
              chapter: ch.chapter,
              verseNum: v.verse,
              chapterLabel: `${ch.bookName} ${ch.chapter}`,
            });
          }
        }
        setVerses(all);
        verseEls.current = new Array(all.length).fill(null);
      } catch {
        setFetchError("Could not load scripture. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchDay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day]);

  // ── Auto-scroll to active verse ────────────────────────────────────────────
  useEffect(() => {
    if (currentVerse >= 0) {
      verseEls.current[currentVerse]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentVerse]);

  // ── Cancel speech on unmount ───────────────────────────────────────────────
  useEffect(() => () => { stopSignal.current = true; window.speechSynthesis?.cancel(); }, []);

  // ── Speech ─────────────────────────────────────────────────────────────────
  function cancelSpeech() {
    stopSignal.current = true;
    if (hasSpeech) window.speechSynthesis.cancel();
    setPlaying(false);
  }

  function speakOne(text: string): Promise<void> {
    return new Promise((resolve) => {
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = speedRef.current;
      utt.lang = "en-US";
      utt.onend = resolve;
      utt.onerror = resolve;
      window.speechSynthesis.speak(utt);
    });
  }

  async function startPlayback(fromVerse: number, verseList: Verse[]) {
    if (!hasSpeech || !verseList.length) return;
    stopSignal.current = false;
    setPlaying(true);

    for (let i = fromVerse; i < verseList.length; i++) {
      if (stopSignal.current) break;
      setCurrentVerse(i);
      await speakOne(verseList[i].text);
      if (stopSignal.current) break;
      if (i % 5 === 0) saveProgress(day, i + 1, fontSize, speedRef.current, highlightColor);
    }

    if (!stopSignal.current) {
      setCurrentVerse(-1);
      setResumeVerse(0);
      saveProgress(day, 0, fontSize, speedRef.current, highlightColor);
    }
    setPlaying(false);
  }

  // ── Control handlers ───────────────────────────────────────────────────────
  function handlePlayPause() {
    if (playing) {
      const pausedAt = currentVerse >= 0 ? currentVerse : 0;
      cancelSpeech();
      setResumeVerse(pausedAt);
      saveProgress(day, pausedAt, fontSize, speedRef.current, highlightColor);
    } else {
      startPlayback(currentVerse >= 0 ? currentVerse : resumeVerse, verses);
    }
  }

  function handleRestartDay() {
    cancelSpeech();
    setResumeVerse(0);
    setCurrentVerse(-1);
    saveProgress(day, 0, fontSize, speedRef.current, highlightColor);
    setTimeout(() => startPlayback(0, verses), 80);
  }

  function handleSpeed(s: Speed) {
    setSpeed(s);
    speedRef.current = s;
    saveProgress(day, currentVerse >= 0 ? currentVerse : resumeVerse, fontSize, s, highlightColor);
  }

  function handleFontSize(fs: FontSize) {
    setFontSize(fs);
    saveProgress(day, currentVerse >= 0 ? currentVerse : resumeVerse, fs, speedRef.current, highlightColor);
  }

  function handleHighlightColor(hc: HighlightColor) {
    setHighlightColor(hc);
    saveProgress(day, currentVerse >= 0 ? currentVerse : resumeVerse, fontSize, speedRef.current, hc);
  }

  function goToDay(d: number) {
    const next = Math.min(Math.max(1, d), 365);
    cancelSpeech();
    setResumeVerse(0);
    saveProgress(next, 0, fontSize, speedRef.current, highlightColor);
    setDay(next);
  }

  // ── Bookmarks ──────────────────────────────────────────────────────────────
  async function toggleBookmark(verse: Verse) {
    if (!userId) return;
    const ref = verse.reference;
    if (bookmarks.has(ref)) {
      await supabase.from("bible365_bookmarks").delete().eq("user_id", userId).eq("verse_reference", ref);
      setBookmarks(prev => { const n = new Set(prev); n.delete(ref); return n; });
    } else {
      await supabase.from("bible365_bookmarks").insert({ user_id: userId, day, verse_reference: ref, verse_text: verse.text });
      setBookmarks(prev => new Set(prev).add(ref));
    }
  }

  // ── Group verses by chapter ────────────────────────────────────────────────
  const chapterGroups = useMemo(() => {
    const groups: { label: string; start: number; end: number }[] = [];
    verses.forEach((v, i) => {
      const last = groups[groups.length - 1];
      if (!last || last.label !== v.chapterLabel) {
        if (last) last.end = i;
        groups.push({ label: v.chapterLabel, start: i, end: i });
      }
    });
    if (groups.length) groups[groups.length - 1].end = verses.length;
    return groups;
  }, [verses]);

  const resumeLabel =
    resumeVerse > 0 && verses.length > 0
      ? verses[Math.min(resumeVerse, verses.length - 1)]?.reference
      : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/saud-edum-cgapZpzd7v0-unsplash%20(1).jpg">
        <main className="flex-1 p-6 pb-24">
          <div className="max-w-2xl mx-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/70 text-sm">← Home</Link>
              <h1
                className="text-lg font-bold text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
              >
                Bible in 365 Days
              </h1>
              <Link href="/bible-365/bookmarks" className="text-white/60 hover:text-white text-sm transition">
                🔖 Saved
              </Link>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-white/50 mb-1.5">
                <span>Day {day} of 365</span>
                <span>{progress}% complete</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/40 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Day heading */}
            <div className="mb-5">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Today's Reading</p>
              <p
                className="text-white font-bold text-2xl leading-snug"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
              >
                {todayReading.label}
              </p>
            </div>

            {/* Playback controls */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <button
                onClick={handlePlayPause}
                disabled={loading || !!fetchError || !hasSpeech}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-30"
              >
                <span className="text-base leading-none">{playing ? "⏸" : "▶"}</span>
                <span className="text-sm">{playing ? "Pause" : resumeVerse > 0 ? "Resume" : "Play"}</span>
              </button>

              <button
                onClick={handleRestartDay}
                disabled={loading || !!fetchError}
                className="text-white/60 hover:text-white text-sm border border-white/20 hover:border-white/40 px-3 py-2 rounded-xl transition disabled:opacity-30"
              >
                ↺ Restart
              </button>

              {/* Speed */}
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-white/30 text-xs mr-1">Speed</span>
                {SPEEDS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSpeed(s)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition ${
                      speed === s
                        ? "border-white/60 text-white bg-white/15"
                        : "border-white/20 text-white/40 hover:text-white/70"
                    }`}
                  >
                    {s}×
                  </button>
                ))}
              </div>

              {/* Font size */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleFontSize(fontSize === "lg" ? "base" : "sm")}
                  disabled={fontSize === "sm"}
                  className="text-white/50 hover:text-white disabled:opacity-20 border border-white/20 hover:border-white/40 px-2.5 py-1 rounded-lg transition text-sm"
                >
                  A−
                </button>
                <button
                  onClick={() => handleFontSize(fontSize === "sm" ? "base" : "lg")}
                  disabled={fontSize === "lg"}
                  className="text-white/50 hover:text-white disabled:opacity-20 border border-white/20 hover:border-white/40 px-2.5 py-1 rounded-lg transition"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Highlight color picker */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-white/40 text-xs">Highlight:</span>
              {COLOR_SWATCHES.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleHighlightColor(c.id)}
                  title={c.label}
                  className={`w-5 h-5 rounded-full ${c.swatch} transition-all ${
                    highlightColor === c.id
                      ? "ring-2 ring-white/60 ring-offset-1 ring-offset-transparent scale-110"
                      : "opacity-50 hover:opacity-80"
                  }`}
                />
              ))}
            </div>

            {/* Resume banner */}
            {resumeLabel && !playing && verses.length > 0 && currentVerse < 0 && (
              <div className={`mb-5 flex items-center justify-between ${hl.resume} border rounded-xl px-4 py-3`}>
                <p className="text-white/70 text-sm">
                  Resume at <span className={hl.resumeText}>{resumeLabel}</span>
                </p>
                <button
                  onClick={() => startPlayback(resumeVerse, verses)}
                  className={`${hl.resumeText} hover:text-white text-xs font-semibold transition`}
                >
                  Resume →
                </button>
              </div>
            )}

            {!hasSpeech && (
              <p className="text-white/50 text-xs mb-5">Audio not supported in this browser — you can still read along.</p>
            )}

            {/* Loading */}
            {loading && (
              <div className="text-center py-20">
                <p className="text-white/40 text-sm">Loading scripture…</p>
              </div>
            )}

            {/* Error */}
            {fetchError && (
              <div className="text-center py-20">
                <p className="text-red-300/80 text-sm mb-4">{fetchError}</p>
                <button
                  onClick={() => setDay(d => d)}
                  className="text-white/50 hover:text-white text-xs border border-white/20 px-4 py-2 rounded-xl transition"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Scripture */}
            {!loading && !fetchError && chapterGroups.map(group => (
              <div key={group.label} className="mb-10">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/10">
                  {group.label}
                </p>

                {verses.slice(group.start, group.end).map((verse, localIdx) => {
                  const globalIdx = group.start + localIdx;
                  const isActive = currentVerse === globalIdx;
                  const isBookmarked = bookmarks.has(verse.reference);

                  return (
                    <div
                      key={verse.reference}
                      ref={el => { verseEls.current[globalIdx] = el; }}
                      className={`group relative flex gap-3 py-2 px-2 -mx-2 rounded-xl transition-all duration-300 ${
                        isActive
                          ? `${hl.bg} border-l-2 ${hl.border} pl-4 -ml-3`
                          : "hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={`text-xs mt-1 w-5 flex-shrink-0 text-right transition-colors ${
                          isActive ? `${hl.num} font-bold` : "text-white/25"
                        }`}
                      >
                        {verse.verseNum}
                      </span>

                      <p
                        className={`flex-1 leading-relaxed transition-colors ${FONT_CLASSES[fontSize]} ${
                          isActive ? "text-white" : "text-white/75"
                        }`}
                        style={{ textShadow: isActive ? "0 1px 6px rgba(0,0,0,0.95)" : "0 1px 4px rgba(0,0,0,0.8)" }}
                      >
                        {verse.text}
                      </p>

                      <button
                        onClick={() => toggleBookmark(verse)}
                        className={`flex-shrink-0 mt-0.5 text-sm leading-none transition-all ${
                          isBookmarked
                            ? `${hl.num} opacity-100`
                            : "text-white/20 opacity-0 group-hover:opacity-100 hover:text-white/60"
                        }`}
                        title={isBookmarked ? "Remove bookmark" : "Bookmark this verse"}
                      >
                        🔖
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Day navigation */}
            {!loading && !fetchError && verses.length > 0 && (
              <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <button
                  onClick={() => goToDay(day - 1)}
                  disabled={day === 1}
                  className="text-white/60 hover:text-white disabled:opacity-20 transition text-sm"
                >
                  ← Day {day - 1}
                </button>
                <span className="text-white/20 text-xs">Day {day} of 365</span>
                <button
                  onClick={() => goToDay(day + 1)}
                  disabled={day === 365}
                  className="text-white/60 hover:text-white disabled:opacity-20 transition text-sm"
                >
                  Day {day + 1} →
                </button>
              </div>
            )}

          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
