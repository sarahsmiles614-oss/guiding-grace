"use client";
import { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";
import { supabase } from "@/lib/supabase";
import { getBiblePlan, PlanOrder, PLAN_INFO } from "@/lib/bible-plan";
import { fetchChapterVerses } from "@/lib/bible-fetch";
import { TRANSLATIONS, DEFAULT_TRANSLATION } from "@/lib/translations";

interface Verse {
  reference: string;
  text: string;
  bookName: string;
  chapter: number;
  verseNum: number;
  chapterLabel: string;
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
  yellow: { bg: "bg-yellow-400/25", border: "border-yellow-300", num: "text-yellow-300", resume: "bg-yellow-400/15 border-yellow-400/30", resumeText: "text-yellow-300" },
  blue:   { bg: "bg-blue-400/25",   border: "border-blue-300",   num: "text-blue-300",   resume: "bg-blue-400/15 border-blue-400/30",     resumeText: "text-blue-300"   },
  pink:   { bg: "bg-pink-400/25",   border: "border-pink-300",   num: "text-pink-300",   resume: "bg-pink-400/15 border-pink-400/30",     resumeText: "text-pink-300"   },
};

const COLOR_SWATCHES: { id: HighlightColor; swatch: string; label: string }[] = [
  { id: "yellow", swatch: "bg-yellow-400", label: "Yellow" },
  { id: "blue",   swatch: "bg-blue-400",   label: "Blue"   },
  { id: "pink",   swatch: "bg-pink-400",   label: "Pink"   },
];

const SPEEDS: Speed[] = [0.75, 1, 1.25];

// ── Book categories ────────────────────────────────────────────────────────
const OT_CATEGORIES = [
  { label: "THE LAW",         books: ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"] },
  { label: "HISTORY",         books: ["Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther"] },
  { label: "POETRY & WISDOM", books: ["Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon"] },
  { label: "MAJOR PROPHETS",  books: ["Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel"] },
  { label: "MINOR PROPHETS",  books: ["Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"] },
];

const NT_CATEGORIES = [
  { label: "GOSPELS",          books: ["Matthew", "Mark", "Luke", "John"] },
  { label: "ACTS",             books: ["Acts"] },
  { label: "PAUL'S LETTERS",  books: ["Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon"] },
  { label: "GENERAL LETTERS", books: ["Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude"] },
  { label: "PROPHECY",        books: ["Revelation"] },
];

const OT_BOOK_SET = new Set(OT_CATEGORIES.flatMap(c => c.books));
const NT_BOOK_SET = new Set(NT_CATEGORIES.flatMap(c => c.books));

const CHAPTER_COUNTS: Record<string, number> = {
  Genesis: 50, Exodus: 40, Leviticus: 27, Numbers: 36, Deuteronomy: 34,
  Joshua: 24, Judges: 21, Ruth: 4, "1 Samuel": 31, "2 Samuel": 24,
  "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36,
  Ezra: 10, Nehemiah: 13, Esther: 10, Job: 42, Psalms: 150, Proverbs: 31,
  Ecclesiastes: 12, "Song of Solomon": 8, Isaiah: 66, Jeremiah: 52,
  Lamentations: 5, Ezekiel: 48, Daniel: 12, Hosea: 14, Joel: 3, Amos: 9,
  Obadiah: 1, Jonah: 4, Micah: 7, Nahum: 3, Habakkuk: 3, Zephaniah: 3,
  Haggai: 2, Zechariah: 14, Malachi: 4,
  Matthew: 28, Mark: 16, Luke: 24, John: 21, Acts: 28, Romans: 16,
  "1 Corinthians": 16, "2 Corinthians": 13, Galatians: 6, Ephesians: 6,
  Philippians: 4, Colossians: 4, "1 Thessalonians": 5, "2 Thessalonians": 3,
  "1 Timothy": 6, "2 Timothy": 4, Titus: 3, Philemon: 1, Hebrews: 13,
  James: 5, "1 Peter": 5, "2 Peter": 3, "1 John": 5, "2 John": 1,
  "3 John": 1, Jude: 1, Revelation: 22,
};

export default function Bible365Page() {
  return (
    <Suspense fallback={null}>
      <Bible365Inner />
    </Suspense>
  );
}

function Bible365Inner() {
  const searchParams = useSearchParams();
  const [planOrder, setPlanOrder] = useState<PlanOrder>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("bible365_order") as PlanOrder) ?? "canonical";
    }
    return "canonical";
  });
  const plan = getBiblePlan(planOrder);

  // View: "toc" = book browser, "reading" = scripture view
  const [view, setView] = useState<"toc" | "reading">(() =>
    searchParams.get("day") ? "reading" : "toc"
  );

  // Testament tab
  const [tocTab, setTocTab] = useState<"ot" | "nt">("ot");

  // Picker steps
  const [pickerStep, setPickerStep] = useState<"book" | "chapter">("book");
  const [pickerBook, setPickerBook] = useState<string | null>(null);

  // Completed days (persisted in localStorage)
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  const [userId, setUserId] = useState<string | null>(null);
  const [savedDay, setSavedDay] = useState(1);
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
  const [translation, setTranslation] = useState<string>(() => {
    if (typeof window !== "undefined") return localStorage.getItem("bible365_translation") ?? DEFAULT_TRANSLATION;
    return DEFAULT_TRANSLATION;
  });

  const apiKey = process.env.NEXT_PUBLIC_BIBLE_API_KEY;
  const availableTranslations = TRANSLATIONS.filter(t => !t.requiresKey || !!apiKey);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const verseEls = useRef<(HTMLDivElement | null)[]>([]);

  const todayReading = plan[day - 1];
  const completedCount = completedDays.size;
  const progress = Math.round((completedCount / 365) * 100);
  const hasSpeech = typeof window !== "undefined" && "speechSynthesis" in window;
  const hl = HIGHLIGHT[highlightColor];

  // ── Book → first day mapping ──────────────────────────────────────────────
  const bookStartDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const reading of plan) {
      for (const ch of reading.chapters) {
        if (!map.has(ch.bookName)) map.set(ch.bookName, reading.day);
      }
    }
    return map;
  }, [plan]);

  // Active book for each testament based on saved day
  const activeOtBook = useMemo(() => {
    const reading = plan[savedDay - 1];
    return reading.chapters.find(ch => OT_BOOK_SET.has(ch.bookName))?.bookName ?? null;
  }, [savedDay, plan]);

  const activeNtBook = useMemo(() => {
    const reading = plan[savedDay - 1];
    return reading.chapters.find(ch => NT_BOOK_SET.has(ch.bookName))?.bookName ?? null;
  }, [savedDay, plan]);

  // ── Load completed days ───────────────────────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bible365_completed");
      if (stored) setCompletedDays(new Set(JSON.parse(stored)));
    } catch {}
  }, []);

  function markRead(d: number) {
    setCompletedDays(prev => {
      const next = new Set(prev);
      next.add(d);
      try { localStorage.setItem("bible365_completed", JSON.stringify([...next])); } catch {}
      return next;
    });
  }

  function unmarkRead(d: number) {
    setCompletedDays(prev => {
      const next = new Set(prev);
      next.delete(d);
      try { localStorage.setItem("bible365_completed", JSON.stringify([...next])); } catch {}
      return next;
    });
  }

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
        const progDay = Math.min(Math.max(1, prog.day ?? 1), 365);
        setSavedDay(progDay);
        if (!searchParams.get("day")) setDay(progDay);
        setResumeVerse(prog.verse_index ?? 0);
        setFontSize((prog.font_size as FontSize) ?? "base");
        const s = (prog.speed as Speed) ?? 1;
        setSpeed(s); speedRef.current = s;
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

  // ── Fetch scripture when day/view/translation changes ────────────────────
  useEffect(() => {
    if (view !== "reading") return;
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
          const fetched = await fetchChapterVerses(ch, translation);
          for (const v of fetched) {
            all.push({
              reference: v.reference,
              text: v.text,
              bookName: v.bookName,
              chapter: v.chapter,
              verseNum: v.verseNum,
              chapterLabel: v.chapterLabel,
            });
          }
        }
        setVerses(all);
        verseEls.current = new Array(all.length).fill(null);
      } catch (e: any) {
        setFetchError(e?.message?.includes("API key") ? "This translation requires an API key. Please select KJV or WEB." : "Could not load scripture. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchDay();
  }, [day, view, translation]);

  useEffect(() => {
    if (currentVerse >= 0) verseEls.current[currentVerse]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentVerse]);

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
      utt.rate = speedRef.current; utt.lang = "en-US";
      utt.onend = resolve; utt.onerror = resolve;
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

  // ── Controls ───────────────────────────────────────────────────────────────
  function handlePlayPause() {
    if (playing) {
      const pausedAt = currentVerse >= 0 ? currentVerse : 0;
      cancelSpeech(); setResumeVerse(pausedAt);
      saveProgress(day, pausedAt, fontSize, speedRef.current, highlightColor);
    } else {
      startPlayback(currentVerse >= 0 ? currentVerse : resumeVerse, verses);
    }
  }

  function handleRestartDay() {
    cancelSpeech(); setResumeVerse(0); setCurrentVerse(-1);
    saveProgress(day, 0, fontSize, speedRef.current, highlightColor);
    setTimeout(() => startPlayback(0, verses), 80);
  }

  function handleSpeed(s: Speed) {
    setSpeed(s); speedRef.current = s;
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
    markRead(day);
    const next = Math.min(Math.max(1, d), 365);
    cancelSpeech(); setResumeVerse(0);
    saveProgress(next, 0, fontSize, speedRef.current, highlightColor);
    setSavedDay(next); setDay(next);
    window.scrollTo({ top: 0 });
  }

  function openBook(bookName: string) {
    const d = bookStartDay.get(bookName);
    if (!d) return;
    cancelSpeech(); setResumeVerse(0);
    setDay(d); setView("reading");
    saveProgress(d, 0, fontSize, speedRef.current, highlightColor);
    setSavedDay(d);
    window.scrollTo({ top: 0 });
  }

  function backToToc() {
    cancelSpeech();
    setView("toc");
    window.scrollTo({ top: 0 });
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

  const resumeLabel = resumeVerse > 0 && verses.length > 0
    ? verses[Math.min(resumeVerse, verses.length - 1)]?.reference
    : null;

  const activeBook = tocTab === "ot" ? activeOtBook : activeNtBook;
  const categories = tocTab === "ot" ? OT_CATEGORIES : NT_CATEGORIES;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/saud-edum-cgapZpzd7v0-unsplash%20(1).jpg" overlayOpacity={0.65}>
        <main className="flex-1 p-6 pb-24 flex flex-col items-center">
          <div className="max-w-2xl w-full">

            {/* ── BOOK BROWSER (TOC) ── */}
            {view === "toc" && (
              <>
                {/* Sticky top bar */}
                <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-sm -mx-6 px-6 mb-0">
                  {pickerStep === "book" ? (
                    <>
                      <h1 className="text-2xl font-bold text-white text-center py-4">Choose a Book</h1>
                      {/* OT/NT toggle — flat full-width halves */}
                      <div className="flex">
                        <button
                          onClick={() => setTocTab("ot")}
                          className={`flex-1 py-2 text-sm rounded-none transition ${
                            tocTab === "ot" ? "bg-white/30 text-white font-bold" : "bg-white/10 text-white/70 font-semibold"
                          }`}
                        >
                          Old Testament
                        </button>
                        <button
                          onClick={() => setTocTab("nt")}
                          className={`flex-1 py-2 text-sm rounded-none transition ${
                            tocTab === "nt" ? "bg-white/30 text-white font-bold" : "bg-white/10 text-white/70 font-semibold"
                          }`}
                        >
                          New Testament
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-0 pt-4 pb-2">
                        <button
                          onClick={() => setPickerStep("book")}
                          className="text-white/70 text-sm px-0"
                        >
                          ← Back
                        </button>
                      </div>
                      <h2 className="text-2xl font-bold text-white text-center pb-3">{pickerBook}</h2>
                      <p className="text-white/60 text-sm text-center pb-4">Select a chapter</p>
                    </>
                  )}
                </div>

                {/* Intro description — shown only on book step */}
                {pickerStep === "book" && (
                  <div className="pt-4 pb-2">
                    {/* Plan order toggle */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {(Object.keys(PLAN_INFO) as PlanOrder[]).map(id => {
                        const info = PLAN_INFO[id];
                        return (
                          <button
                            key={id}
                            onClick={() => {
                              setPlanOrder(id);
                              localStorage.setItem("bible365_order", id);
                              setSavedDay(1); setDay(1); setView("toc");
                            }}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition text-left ${planOrder === id ? "bg-white/25 border-white/50 text-white" : "bg-white/5 border-white/15 text-white/50 hover:text-white/80"}`}
                          >
                            <div>{info.emoji} {info.label}</div>
                            <div className={`text-xs font-normal mt-0.5 ${planOrder === id ? "text-white/70" : "text-white/30"}`}>{info.desc}</div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="bg-black/25 rounded-xl px-4 py-3 mb-4 text-left">
                      <p className="text-white font-semibold text-sm mb-2">How it works:</p>
                      <p className="text-white/70 text-xs leading-relaxed mb-1">1. <span className="text-white">Pick a book</span> from the Old or New Testament below.</p>
                      <p className="text-white/70 text-xs leading-relaxed mb-1">2. <span className="text-white">Select a chapter</span> to jump to that day's reading.</p>
                      <p className="text-white/70 text-xs leading-relaxed mb-1">3. <span className="text-white">Read or listen</span> — use the audio player to follow along hands-free.</p>
                      <p className="text-white/70 text-xs leading-relaxed mb-1">4. <span className="text-white">Save your progress</span> — tap the bookmark icon when you finish a day.</p>
                      <p className="text-white/70 text-xs leading-relaxed">5. <span className="text-white">Come back tomorrow</span> — your place is saved so you never lose track.</p>
                    </div>

                    {/* 365-Day Reading Plan */}
                    <div className="px-0 pb-4">
                      <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-3 pt-2">365-Day Reading Plan</p>
                      <div className="space-y-1">
                        {plan.map((entry) => {
                          const isCompleted = completedDays.has(entry.day);
                          const isToday = entry.day === savedDay;
                          return (
                            <button
                              key={entry.day}
                              onClick={() => { cancelSpeech(); setDay(entry.day); setView("reading"); window.scrollTo({ top: 0 }); }}
                              className={`w-full text-left px-4 py-3 rounded-xl border flex items-center justify-between transition ${
                                isToday
                                  ? "bg-white/25 border-white/40 text-white font-bold"
                                  : isCompleted
                                  ? "bg-black/15 border-white/10 text-white/40"
                                  : "bg-black/20 border-white/10 text-white/80 hover:bg-white/15"
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <span className="text-white/50 text-xs mr-2">Day {entry.day}</span>
                                <span className="text-sm">{entry.label}</span>
                              </div>
                              {isCompleted && !isToday && <span className="text-white/40 text-xs ml-2 flex-shrink-0">✓</span>}
                              {isToday && <span className="text-white/80 text-xs font-bold ml-2 flex-shrink-0">Today</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1 — Book list */}
                {pickerStep === "book" && (
                  <div className="-mx-6">
                    {categories.map(category => (
                      <div key={category.label}>
                        <p className="text-white/60 text-xs font-bold tracking-widest uppercase px-4 pt-5 pb-2">
                          {category.label}
                        </p>
                        {category.books.map(book => (
                          <button
                            key={book}
                            onClick={() => { setPickerBook(book); setPickerStep("chapter"); }}
                            className="w-full text-left px-5 py-3 bg-white/10 hover:bg-white/20 border-b border-white/10 text-white font-semibold text-base transition flex items-center justify-between"
                          >
                            <span>{book}</span>
                            <span className="text-white/50">›</span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 2 — Chapter grid */}
                {pickerStep === "chapter" && pickerBook && (
                  <div className="grid grid-cols-5 gap-2 px-4 pt-4">
                    {Array.from({ length: CHAPTER_COUNTS[pickerBook] ?? 1 }, (_, i) => i + 1).map(ch => (
                      <button
                        key={ch}
                        onClick={() => {
                          const match = plan.find(r => r.chapters.some(c => c.bookName === pickerBook && c.chapter === ch));
                          const targetDay = match ? match.day : plan.find(r => r.chapters.some(c => c.bookName === pickerBook))?.day ?? 1;
                          cancelSpeech();
                          setResumeVerse(0);
                          setSavedDay(targetDay);
                          setDay(targetDay);
                          saveProgress(targetDay, 0, fontSize, speedRef.current, highlightColor);
                          setPickerStep("book");
                          setView("reading");
                          window.scrollTo({ top: 0 });
                        }}
                        className="bg-white/10 hover:bg-white/25 text-white font-bold py-3 rounded-lg text-sm transition"
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── READING VIEW ── */}
            {view === "reading" && (
              <>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <button onClick={backToToc} className="text-white text-sm hover:text-white/80 transition">← Books</button>
                  <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                    Day {day}
                  </h1>
                  <Link href="/bible-365/bookmarks" className="text-white/70 hover:text-white text-sm transition">🔖</Link>
                </div>

                {/* Day heading */}
                <div className="mb-5">
                  <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Today's Reading</p>
                  <p className="text-amber-200 font-bold text-xl leading-snug" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                    {todayReading.otLabel}
                  </p>
                </div>

                {/* Mark as Read */}
                <div className="mb-5">
                  <button
                    onClick={() => completedDays.has(day) ? unmarkRead(day) : markRead(day)}
                    className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl border transition font-semibold ${
                      completedDays.has(day)
                        ? "bg-green-500/25 border-green-400/50 text-green-300"
                        : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                    }`}
                  >
                    {completedDays.has(day) ? "✓ Marked as Read" : "Mark as Read"}
                  </button>
                </div>

                {/* Playback controls */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <button
                    onClick={handlePlayPause}
                    disabled={loading || !!fetchError || !hasSpeech}
                    className={`flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl border transition disabled:opacity-30 ${
                      playing ? "bg-white text-gray-900 border-white hover:bg-white/90" : "bg-white/20 hover:bg-white/30 border-white/30 text-white"
                    }`}
                  >
                    <span className="text-base leading-none">{playing ? "⏸" : "▶"}</span>
                    <span className="text-sm">{playing ? "Pause" : resumeVerse > 0 ? "Resume" : "Play"}</span>
                  </button>

                  {playing && (
                    <button
                      onClick={() => { cancelSpeech(); setResumeVerse(0); setCurrentVerse(-1); saveProgress(day, 0, fontSize, speedRef.current, highlightColor); }}
                      className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm border border-white/30 hover:border-white/60 px-4 py-2.5 rounded-xl transition"
                    >
                      <span className="text-base leading-none">⏹</span>
                      <span>Stop</span>
                    </button>
                  )}

                  {!playing && (
                    <button
                      onClick={handleRestartDay}
                      disabled={loading || !!fetchError}
                      className="text-white/70 hover:text-white text-sm border border-white/20 hover:border-white/40 px-3 py-2.5 rounded-xl transition disabled:opacity-30"
                    >
                      ↺ Restart
                    </button>
                  )}

                  <div className="flex items-center gap-1 ml-auto">
                    <span className="text-white/70 text-xs mr-1">Speed</span>
                    {SPEEDS.map(s => (
                      <button key={s} onClick={() => handleSpeed(s)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition ${speed === s ? "border-white/60 text-white bg-white/15" : "border-white/20 text-white/70 hover:text-white"}`}
                      >{s}×</button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <button onClick={() => handleFontSize(fontSize === "lg" ? "base" : "sm")} disabled={fontSize === "sm"}
                      className="text-white/70 hover:text-white disabled:opacity-20 border border-white/20 hover:border-white/40 px-2.5 py-1 rounded-lg transition text-sm">A−</button>
                    <button onClick={() => handleFontSize(fontSize === "sm" ? "base" : "lg")} disabled={fontSize === "lg"}
                      className="text-white/70 hover:text-white disabled:opacity-20 border border-white/20 hover:border-white/40 px-2.5 py-1 rounded-lg transition">A+</button>
                  </div>
                </div>

                {/* Translation picker */}
                {availableTranslations.length > 1 && (
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-white/70 text-xs">Translation:</span>
                    {availableTranslations.map(t => (
                      <button
                        key={t.id}
                        onClick={() => { setTranslation(t.id); localStorage.setItem("bible365_translation", t.id); }}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition ${translation === t.id ? "border-white/60 text-white bg-white/15 font-semibold" : "border-white/20 text-white/70 hover:text-white"}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Highlight color picker */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-white/70 text-xs">Highlight:</span>
                  {COLOR_SWATCHES.map(c => (
                    <button key={c.id} onClick={() => handleHighlightColor(c.id)} title={c.label}
                      className={`w-5 h-5 rounded-full ${c.swatch} transition-all ${highlightColor === c.id ? "ring-2 ring-white/60 ring-offset-1 ring-offset-transparent scale-110" : "opacity-50 hover:opacity-80"}`}
                    />
                  ))}
                </div>

                {/* Resume banner */}
                {resumeLabel && !playing && verses.length > 0 && currentVerse < 0 && (
                  <div className={`mb-5 flex items-center justify-between ${hl.resume} border rounded-xl px-4 py-3`}>
                    <p className="text-white/70 text-sm">Resume at <span className={hl.resumeText}>{resumeLabel}</span></p>
                    <button onClick={() => startPlayback(resumeVerse, verses)} className={`${hl.resumeText} hover:text-white text-xs font-semibold transition`}>Resume →</button>
                  </div>
                )}

                {!hasSpeech && <p className="text-white/70 text-xs mb-5">Audio not supported in this browser — you can still read along.</p>}

                {loading && <div className="text-center py-20"><p className="text-white/70 text-sm">Loading scripture…</p></div>}

                {fetchError && (
                  <div className="text-center py-20">
                    <p className="text-red-300/80 text-sm mb-4">{fetchError}</p>
                    <button onClick={() => setDay(d => d)} className="text-white/70 hover:text-white text-xs border border-white/20 px-4 py-2 rounded-xl transition">Try Again</button>
                  </div>
                )}

                {/* Scripture */}
                {!loading && !fetchError && chapterGroups.map(group => (
                  <div key={group.label} className="mb-10">
                    <p className="text-white/70 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/10">{group.label}</p>
                    {verses.slice(group.start, group.end).map((verse, localIdx) => {
                      const globalIdx = group.start + localIdx;
                      const isActive = currentVerse === globalIdx;
                      const isBookmarked = bookmarks.has(verse.reference);
                      return (
                        <div
                          key={verse.reference}
                          ref={el => { verseEls.current[globalIdx] = el; }}
                          className={`group relative flex gap-3 py-2 px-2 -mx-2 rounded-xl transition-all duration-300 ${isActive ? `${hl.bg} border-l-2 ${hl.border} pl-4 -ml-3` : "hover:bg-white/5"}`}
                        >
                          <span className={`text-xs mt-1 w-5 flex-shrink-0 text-right transition-colors ${isActive ? `${hl.num} font-bold` : "text-white/50"}`}>
                            {verse.verseNum}
                          </span>
                          <p className={`flex-1 leading-relaxed transition-colors ${FONT_CLASSES[fontSize]} ${isActive ? "text-white" : "text-white/90"}`}
                            style={{ textShadow: isActive ? "0 1px 6px rgba(0,0,0,0.95)" : "0 1px 4px rgba(0,0,0,0.8)" }}>
                            {verse.text}
                          </p>
                          <button onClick={() => toggleBookmark(verse)}
                            className={`flex-shrink-0 mt-0.5 text-sm leading-none transition-all ${isBookmarked ? `${hl.num} opacity-100` : "text-white/20 opacity-0 group-hover:opacity-100 hover:text-white/60"}`}
                            title={isBookmarked ? "Remove bookmark" : "Bookmark this verse"}>🔖</button>
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Day navigation */}
                {!loading && !fetchError && verses.length > 0 && (
                  <div className="flex justify-between items-center pt-8 border-t border-white/10">
                    <button onClick={() => goToDay(day - 1)} disabled={day === 1}
                      className="text-white/70 hover:text-white disabled:opacity-20 transition text-sm">← Day {day - 1}</button>
                    <button
                      onClick={() => completedDays.has(day) ? unmarkRead(day) : markRead(day)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition ${completedDays.has(day) ? "border-green-400/50 text-green-300 bg-green-500/20" : "border-white/30 text-white/70 hover:text-white"}`}
                    >{completedDays.has(day) ? "✓ Read" : "Mark Read"}</button>
                    <button onClick={() => goToDay(day + 1)} disabled={day === 365}
                      className="text-white/70 hover:text-white disabled:opacity-20 transition text-sm">Day {day + 1} →</button>
                  </div>
                )}
              </>
            )}

          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
