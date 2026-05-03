"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";
import { supabase } from "@/lib/supabase";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/zoltan-tasi-KHD_FA43aMw-unsplash.jpg";

const DEFAULT_QUESTIONS = [
  "What does this passage mean to me personally?",
  "How can I apply this truth to my life today?",
  "What is God asking me to do or change?",
];

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
  const [copied, setCopied] = useState(false);

  // Journal fields
  const [stoodOut, setStoodOut] = useState("");
  const [questionNotes, setQuestionNotes] = useState<string[]>([]);
  const [challengeResponse, setChallengeResponse] = useState("");
  const [prayer, setPrayer] = useState("");

  useEffect(() => { init(); }, []);

  async function init() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    await loadDay(getToday(), user.id);
    await loadPastEntries(user.id);
    await loadHighlights(user.id);
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
      .select("id, verse_reference, verse_text, note, created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setHighlights(data);
  }

  async function deleteHighlight(id: string) {
    await supabase.from("bible_highlights").delete().eq("id", id);
    setHighlights(prev => prev.filter(h => h.id !== id));
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

  const isToday = viewingDate === getToday();

  return (
    <SubscriptionGuard>
      <PageBackground url={BG} overlayOpacity={0.72}>
        <main className="flex-1 p-6 pb-24 flex flex-col items-center">
          <div className="max-w-2xl w-full">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <Link href="/dashboard" className="text-white/80 hover:text-white text-sm transition">← Back</Link>
              <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                Dive Deeper
              </h1>
              <button
                onClick={() => setShowPast(!showPast)}
                className="text-white/80 hover:text-white text-sm transition"
              >
                {showPast ? "← Today" : "📔 Past"}
              </button>
            </div>

            {/* Past Entries */}
            {showPast && (
              <div className="bg-black/50 border border-white/20 rounded-2xl p-5 mb-6">
                <p className="text-white/80 text-xs uppercase tracking-widest mb-4">Your Journal Entries</p>
                {pastEntries.length === 0 ? (
                  <p className="text-white/60 text-sm text-center py-4">No entries yet — start writing today.</p>
                ) : (
                  <div className="space-y-2">
                    {pastEntries.map(entry => (
                      <button
                        key={entry.devotion_date}
                        onClick={() => { loadDay(entry.devotion_date, userId!); setShowPast(false); }}
                        className="w-full text-left bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl px-4 py-3 transition"
                      >
                        <p className="text-white text-sm font-semibold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                          {formatDate(entry.devotion_date)}
                        </p>
                        {entry.stood_out && (
                          <p className="text-white/60 text-xs mt-0.5 truncate">{entry.stood_out}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {loading ? (
              <div className="text-center py-20">
                <p className="text-white/70 text-sm">Loading your worksheet...</p>
              </div>
            ) : (
              <>
                {/* Date label */}
                <p className="text-white/70 text-xs uppercase tracking-widest text-center mb-5" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                  {formatDate(viewingDate)}{!isToday && " · Past Entry"}
                </p>

                {/* Devotion card */}
                {devotion ? (
                  <div className="bg-black/50 border border-white/20 rounded-2xl p-5 mb-8">
                    <p className="text-amber-300/90 text-xs font-semibold uppercase tracking-widest mb-2">Today's Word</p>
                    <h2 className="text-white font-bold text-lg mb-3 leading-snug" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                      {devotion.title}
                    </h2>
                    <p className="text-white/90 italic text-sm leading-relaxed mb-2" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                      &ldquo;{devotion.verse_text}&rdquo;
                    </p>
                    <p className="text-amber-300/80 text-xs font-semibold">— {devotion.verse_reference}</p>
                  </div>
                ) : (
                  <div className="bg-black/40 border border-white/20 rounded-2xl p-5 mb-8 text-center">
                    <p className="text-white/60 text-sm">No devotion found for this date.</p>
                  </div>
                )}

                {/* Worksheet */}
                <div className="space-y-7">

                  {/* What stood out */}
                  <div>
                    <p className="text-white font-semibold text-sm mb-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>What stood out to me</p>
                    <p className="text-white/60 text-xs mb-2">What did God place on your heart from this passage?</p>
                    <textarea
                      value={stoodOut}
                      onChange={e => setStoodOut(e.target.value)}
                      placeholder="Write freely..."
                      rows={4}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/35 text-sm resize-none focus:outline-none focus:border-white/50 leading-relaxed"
                    />
                  </div>

                  {/* Reflection questions */}
                  {questions.map((q, i) => (
                    <div key={i}>
                      <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Reflection {i + 1}</p>
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
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/35 text-sm resize-none focus:outline-none focus:border-white/50 leading-relaxed"
                      />
                    </div>
                  ))}

                  {/* Challenge response */}
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Today's Challenge</p>
                    {challenge ? (
                      <div className="bg-amber-500/15 border border-amber-400/30 rounded-xl px-4 py-3 mb-2">
                        <p className="text-amber-100 text-sm leading-relaxed">{challenge.challenge_text}</p>
                      </div>
                    ) : (
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-2">
                        <p className="text-white/40 text-sm italic">No challenge found for this date.</p>
                      </div>
                    )}
                    <p className="text-white font-semibold text-sm mb-2" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>How I responded — or plan to</p>
                    <textarea
                      value={challengeResponse}
                      onChange={e => setChallengeResponse(e.target.value)}
                      placeholder="Be honest. Even small steps count."
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/35 text-sm resize-none focus:outline-none focus:border-white/50 leading-relaxed"
                    />
                  </div>

                  {/* Prayer */}
                  <div>
                    <p className="text-white font-semibold text-sm mb-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>My Prayer</p>
                    <p className="text-white/60 text-xs mb-2">Write your prayer for today in your own words.</p>
                    <textarea
                      value={prayer}
                      onChange={e => setPrayer(e.target.value)}
                      placeholder="Dear Lord..."
                      rows={5}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/35 text-sm resize-none focus:outline-none focus:border-white/50 leading-relaxed"
                    />
                  </div>

                  {/* Save + Share */}
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
                      className={`px-5 py-4 rounded-2xl border font-semibold text-sm transition ${copied ? "bg-green-500/25 border-green-400/40 text-green-200" : "bg-white/10 hover:bg-white/20 border-white/30 text-white/80 hover:text-white"}`}
                    >
                      {copied ? "Copied!" : "Share"}
                    </button>
                  </div>

                </div>

                {/* Bible Highlights */}
                {highlights.length > 0 && (
                  <div className="mt-10">
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-4">Verses You've Highlighted</p>
                    <div className="space-y-3">
                      {highlights.map(h => (
                        <div key={h.id} className="bg-black/40 border border-white/15 rounded-2xl p-4 group">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-amber-200/80 text-xs font-semibold uppercase tracking-widest">{h.verse_reference}</p>
                            <button
                              onClick={() => deleteHighlight(h.id)}
                              className="text-white/20 hover:text-white/60 text-xs transition opacity-0 group-hover:opacity-100"
                            >✕</button>
                          </div>
                          <p className="text-white/90 text-sm italic leading-relaxed mb-2" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                            "{h.verse_text}"
                          </p>
                          {h.note && (
                            <p className="text-white/60 text-xs leading-relaxed border-t border-white/10 pt-2 mt-2">{h.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
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
