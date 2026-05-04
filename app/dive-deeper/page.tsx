"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";
import { supabase } from "@/lib/supabase";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images3/pexels-n3kky-5304734.jpg";

const DEFAULT_QUESTIONS = [
  "What does this passage mean to me personally?",
  "How can I apply this truth to my life today?",
  "What is God asking me to do or change?",
];

type Tab = "journal" | "scripture" | "reflections";

function getToday() {
  const ny = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  const [m, d, y] = ny.split("/");
  return `${y}-${m}-${d}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default function DiveDeeperPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("journal");
  const [devotion, setDevotion] = useState<any>(null);
  const [questions, setQuestions] = useState<string[]>(DEFAULT_QUESTIONS);
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [viewingDate, setViewingDate] = useState(getToday());
  const [pastEntries, setPastEntries] = useState<any[]>([]);
  const [showPast, setShowPast] = useState(false);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [expandedHighlight, setExpandedHighlight] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Journal fields
  const [stoodOut, setStoodOut] = useState("");
  const [questionNotes, setQuestionNotes] = useState<string[]>([]);
  const [challengeResponse, setChallengeResponse] = useState("");
  const [prayer, setPrayer] = useState("");

  // My Reflections
  const [reflections, setReflections] = useState("");
  const [savingReflections, setSavingReflections] = useState(false);
  const [reflectionsSaved, setReflectionsSaved] = useState(false);

  useEffect(() => { init(); }, []);

  async function init() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    await loadDay(getToday(), user.id);
    await loadPastEntries(user.id);
    await loadHighlights(user.id);
    await loadReflections(user.id);
  }

  async function loadDay(date: string, uid: string) {
    setLoading(true);
    setViewingDate(date);
    setSaved(false);

    const [{ data: dev }, { data: guide }, { data: ch }, { data: journal }] = await Promise.all([
      supabase.from("daily_devotions").select("title, verse_reference, verse_text, reflection").eq("devotion_date", date).single(),
      supabase.from("study_guides").select("questions").eq("guide_date", date).single(),
      supabase.from("grace_challenges").select("challenge_text").eq("challenge_date", date).single(),
      supabase.from("devotion_journal").select("*").eq("user_id", uid).eq("devotion_date", date).single(),
    ]);

    setDevotion(dev);
    setChallenge(ch);

    const qs = guide?.questions?.length ? guide.questions : DEFAULT_QUESTIONS;
    setQuestions(qs);

    if (journal) {
      setStoodOut(journal.stood_out || "");
      setQuestionNotes((journal.question_notes as string[]) || new Array(qs.length).fill(""));
      setChallengeResponse(journal.challenge_response || "");
      setPrayer(journal.prayer || "");
    } else {
      setStoodOut("");
      setQuestionNotes(new Array(qs.length).fill(""));
      setChallengeResponse("");
      setPrayer("");
    }

    setLoading(false);
  }

  async function loadHighlights(uid: string) {
    const { data } = await supabase
      .from("bible_highlights")
      .select("id, verse_reference, verse_text, note, created_at, day, plan_order")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setHighlights(data);
  }

  async function loadReflections(uid: string) {
    const { data } = await supabase
      .from("user_reflections")
      .select("content")
      .eq("user_id", uid)
      .single();
    if (data?.content) setReflections(data.content);
  }

  async function deleteHighlight(id: string) {
    await supabase.from("bible_highlights").delete().eq("id", id);
    setHighlights(prev => prev.filter(h => h.id !== id));
  }

  async function shareHighlight(h: any) {
    const text = `"${h.verse_text}" — ${h.verse_reference}${h.note ? `\n\n${h.note}` : ""}`;
    if (navigator.share) {
      await navigator.share({ title: h.verse_reference, text });
    } else {
      await navigator.clipboard.writeText(text);
      setCopiedRef(h.id);
      setTimeout(() => setCopiedRef(null), 2500);
    }
  }

  async function handleShare() {
    const lines: string[] = [];
    if (devotion) lines.push(`"${devotion.verse_text}" — ${devotion.verse_reference}\n`);
    if (stoodOut) lines.push(`What stood out: ${stoodOut}\n`);
    if (prayer) lines.push(`My Prayer: ${prayer}`);
    const text = lines.join("\n");
    if (navigator.share) {
      await navigator.share({ title: `My Journal — ${formatDate(viewingDate)}`, text });
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  async function loadPastEntries(uid: string) {
    const { data } = await supabase
      .from("devotion_journal")
      .select("devotion_date, stood_out")
      .eq("user_id", uid)
      .order("devotion_date", { ascending: false })
      .limit(30);
    if (data) setPastEntries(data);
  }

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    await supabase.from("devotion_journal").upsert(
      {
        user_id: userId,
        devotion_date: viewingDate,
        stood_out: stoodOut,
        question_notes: questionNotes,
        challenge_response: challengeResponse,
        prayer,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,devotion_date" }
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    if (userId) loadPastEntries(userId);
  }

  async function handleSaveReflections() {
    if (!userId) return;
    setSavingReflections(true);
    await supabase.from("user_reflections").upsert(
      { user_id: userId, content: reflections, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
    setSavingReflections(false);
    setReflectionsSaved(true);
    setTimeout(() => setReflectionsSaved(false), 3000);
  }

  const isToday = viewingDate === getToday();

  return (
    <SubscriptionGuard>
      <PageBackground url={BG} overlayOpacity={0.35} bgSize="120%" bgPosition="center 75%">
        <main className="flex-1 p-6 pb-24 flex flex-col items-center">
          <div className="max-w-2xl w-full">

            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <Link href="/dashboard" className="text-white hover:text-white text-sm transition">← Back</Link>
              <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                Dive Deeper
              </h1>
              <Link href="/bible-365" className="text-white/90 hover:text-white text-sm transition">📖 Bible</Link>
            </div>

            {/* Tab bar */}
            <div className="flex rounded-xl overflow-hidden mb-6">
              {([
                { id: "journal", label: "Journal" },
                { id: "scripture", label: "Saved Scripture" },
                { id: "reflections", label: "My Reflections" },
              ] as { id: Tab; label: string }[]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 text-xs font-semibold transition ${
                    activeTab === tab.id
                      ? "text-white border-b-2 border-white"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── JOURNAL TAB ── */}
            {activeTab === "journal" && (
              <>
                {/* Past entries toggle */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setShowPast(!showPast)}
                    className="text-white/90 hover:text-white text-xs transition"
                  >
                    {showPast ? "← Today" : "📔 Past Entries"}
                  </button>
                </div>

                {showPast && (
                  <div className="rounded-2xl p-5 mb-6">
                    <p className="text-white text-xs uppercase tracking-widest mb-4">Your Journal Entries</p>
                    {pastEntries.length === 0 ? (
                      <p className="text-white/90 text-sm text-center py-4">No entries yet — start writing today.</p>
                    ) : (
                      <div className="space-y-2">
                        {pastEntries.map(entry => (
                          <button
                            key={entry.devotion_date}
                            onClick={() => { loadDay(entry.devotion_date, userId!); setShowPast(false); }}
                            className="w-full text-left hover:text-white/80 rounded-xl px-4 py-3 transition"
                          >
                            <p className="text-white text-sm font-semibold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                              {formatDate(entry.devotion_date)}
                            </p>
                            {entry.stood_out && (
                              <p className="text-white/90 text-xs mt-0.5 truncate">{entry.stood_out}</p>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {loading ? (
                  <div className="text-center py-20">
                    <p className="text-white/90 text-sm">Loading your worksheet...</p>
                  </div>
                ) : (
                  <>
                    <p className="text-white/90 text-xs uppercase tracking-widest text-center mb-5" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                      {formatDate(viewingDate)}{!isToday && " · Past Entry"}
                    </p>

                    {devotion ? (
                      <div className="rounded-2xl p-5 mb-8">
                        <p className="text-amber-300 text-xs font-semibold uppercase tracking-widest mb-2">Today's Word</p>
                        <h2 className="text-white font-bold text-lg mb-3 leading-snug" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                          {devotion.title}
                        </h2>
                        <p className="text-white italic text-sm leading-relaxed mb-2" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                          &ldquo;{devotion.verse_text}&rdquo;
                        </p>
                        <p className="text-amber-300 text-xs font-semibold">— {devotion.verse_reference}</p>
                      </div>
                    ) : (
                      <div className="rounded-2xl p-5 mb-8 text-center">
                        <p className="text-white/90 text-sm">No devotion found for this date.</p>
                      </div>
                    )}

                    <div className="space-y-7">
                      <div>
                        <p className="text-white font-semibold text-sm mb-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>What stood out to me</p>
                        <p className="text-white/90 text-xs mb-2">What did God place on your heart from this passage?</p>
                        <textarea
                          value={stoodOut}
                          onChange={e => setStoodOut(e.target.value)}
                          placeholder="Write freely..."
                          rows={4}
                          className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/80 text-sm resize-none focus:outline-none focus:border-white/50 leading-relaxed"
                        />
                      </div>

                      {questions.map((q, i) => (
                        <div key={i}>
                          <p className="text-white/90 text-xs uppercase tracking-widest mb-1">Reflection {i + 1}</p>
                          <p className="text-white font-semibold text-sm mb-2 leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{q}</p>
                          <textarea
                            value={questionNotes[i] ?? ""}
                            onChange={e => {
                              const updated = [...questionNotes];
                              updated[i] = e.target.value;
                              setQuestionNotes(updated);
                            }}
                            placeholder="Your thoughts..."
                            rows={3}
                            className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/80 text-sm resize-none focus:outline-none focus:border-white/50 leading-relaxed"
                          />
                        </div>
                      ))}

                      <div>
                        <p className="text-white/90 text-xs uppercase tracking-widest mb-1">Today's Challenge</p>
                        {challenge ? (
                          <div className="rounded-xl px-4 py-3 mb-2">
                            <p className="text-amber-100 text-sm leading-relaxed">{challenge.challenge_text}</p>
                          </div>
                        ) : (
                          <div className="rounded-xl px-4 py-3 mb-2">
                            <p className="text-white/80 text-sm italic">No challenge found for this date.</p>
                          </div>
                        )}
                        <p className="text-white font-semibold text-sm mb-2" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>How I responded — or plan to</p>
                        <textarea
                          value={challengeResponse}
                          onChange={e => setChallengeResponse(e.target.value)}
                          placeholder="Be honest. Even small steps count."
                          rows={3}
                          className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/80 text-sm resize-none focus:outline-none focus:border-white/50 leading-relaxed"
                        />
                      </div>

                      <div>
                        <p className="text-white font-semibold text-sm mb-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>My Prayer</p>
                        <p className="text-white/90 text-xs mb-2">Write your prayer for today in your own words.</p>
                        <textarea
                          value={prayer}
                          onChange={e => setPrayer(e.target.value)}
                          placeholder="Dear Lord..."
                          rows={5}
                          className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/80 text-sm resize-none focus:outline-none focus:border-white/50 leading-relaxed"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className={`flex-1 font-semibold py-4 rounded-2xl border transition text-sm ${saved ? "bg-green-500/30 border-green-400/50 text-green-200" : "bg-white/20 hover:bg-white/30 border-white/40 text-white disabled:opacity-40"}`}
                        >
                          {saving ? "Saving..." : saved ? "✓ Saved" : "Save Entry"}
                        </button>
                        <button
                          onClick={handleShare}
                          className={`px-5 py-4 rounded-2xl border font-semibold text-sm transition ${copied ? "bg-green-500/25 border-green-400/40 text-green-200" : "bg-white/10 hover:bg-white/20 border-white/30 text-white hover:text-white"}`}
                        >
                          {copied ? "Copied!" : "Share"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── SAVED SCRIPTURE TAB ── */}
            {activeTab === "scripture" && (
              <div>
                <p className="text-white/90 text-xs uppercase tracking-widest mb-4">Verses You've Saved</p>
                {highlights.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-white/80 text-sm mb-2">No saved scriptures yet.</p>
                    <p className="text-white/70 text-xs">While reading the Bible, tap ✍️ on any verse to save it here.</p>
                    <Link href="/bible-365" className="inline-block mt-4 text-white/90 hover:text-white text-xs border border-white/20 px-4 py-2 rounded-xl transition">
                      📖 Go to Bible
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {highlights.map(h => {
                      const isExpanded = expandedHighlight === h.id;
                      const isCopied = copiedRef === h.id;
                      return (
                        <div key={h.id} className="rounded-2xl overflow-hidden">
                          {/* Reference row — always visible */}
                          <div className="flex items-center justify-between px-4 py-3">
                            <button
                              onClick={() => setExpandedHighlight(isExpanded ? null : h.id)}
                              className="flex items-center gap-2 text-left flex-1 min-w-0"
                            >
                              <span className="text-amber-200 text-sm font-semibold">{h.verse_reference}</span>
                              <span className="text-white/70 text-xs">{isExpanded ? "▲" : "▼"}</span>
                            </button>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              {/* Find in Bible */}
                              {h.day && (
                                <Link
                                  href={`/bible-365?day=${h.day}`}
                                  className="text-white/80 hover:text-white/80 text-xs transition"
                                  title="Find in Bible"
                                >
                                  📖
                                </Link>
                              )}
                              {/* Share */}
                              <button
                                onClick={() => shareHighlight(h)}
                                className={`text-xs transition ${isCopied ? "text-green-300" : "text-white/80 hover:text-white/80"}`}
                                title="Share"
                              >
                                {isCopied ? "✓" : "↑"}
                              </button>
                              {/* Delete */}
                              <button
                                onClick={() => deleteHighlight(h.id)}
                                className="text-white/60 hover:text-white/90 text-xs transition"
                                title="Remove"
                              >✕</button>
                            </div>
                          </div>

                          {/* Expanded content */}
                          {isExpanded && (
                            <div className="border-t border-white/10 px-4 py-3">
                              <p className="text-white text-sm italic leading-relaxed mb-2" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                                "{h.verse_text}"
                              </p>
                              {h.note && (
                                <p className="text-white/90 text-xs leading-relaxed border-t border-white/10 pt-2 mt-2">{h.note}</p>
                              )}
                              {h.day && (
                                <Link
                                  href={`/bible-365?day=${h.day}`}
                                  className="inline-flex items-center gap-1 mt-3 text-white/90 hover:text-white text-xs border border-white/15 hover:border-white/30 rounded-lg px-3 py-1.5 transition"
                                >
                                  📖 Find in Bible — Day {h.day}
                                </Link>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── MY REFLECTIONS TAB ── */}
            {activeTab === "reflections" && (
              <div>
                <p className="text-white font-semibold text-sm mb-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>My Reflections</p>
                <p className="text-white/90 text-xs mb-4">A private space for your ongoing thoughts, insights, and personal notes about your faith journey.</p>
                <textarea
                  value={reflections}
                  onChange={e => setReflections(e.target.value)}
                  placeholder="Write whatever is on your heart..."
                  rows={16}
                  className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/80 text-sm resize-none focus:outline-none focus:border-white/50 leading-relaxed mb-4"
                />
                <button
                  onClick={handleSaveReflections}
                  disabled={savingReflections}
                  className={`w-full font-semibold py-4 rounded-2xl border transition text-sm ${reflectionsSaved ? "bg-green-500/30 border-green-400/50 text-green-200" : "bg-white/20 hover:bg-white/30 border-white/40 text-white disabled:opacity-40"}`}
                >
                  {savingReflections ? "Saving..." : reflectionsSaved ? "✓ Saved" : "Save Reflections"}
                </button>
              </div>
            )}

          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
