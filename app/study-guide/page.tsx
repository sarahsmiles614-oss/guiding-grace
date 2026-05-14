"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";
import { supabase } from "@/lib/supabase";
import { getBiblePlan, PlanOrder } from "@/lib/bible-plan";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/zoltan-tasi-KHD_FA43aMw-unsplash.jpg";

interface FillBlankExercise {
  reference: string;
  parts: string[];
  answers: string[];
}

interface StudyGuide {
  title: string;
  verse_reference: string;
  background: string;
  interpretation: string;
  questions: string[];
  application: string;
  related_verses: { reference: string; text: string }[];
  fill_blank?: FillBlankExercise[];
}

type GuideMode = "devotion" | "canonical" | "chronological";

export default function StudyGuidePage() {
  const [mode, setMode] = useState<GuideMode>("devotion");
  const [guide, setGuide] = useState<StudyGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [openQ, setOpenQ] = useState<number | null>(null);
  const [planDay, setPlanDay] = useState(1);
  const [planLabel, setPlanLabel] = useState("");

  // Fill in the blank state
  const [fillInputs, setFillInputs] = useState<string[][]>([]);
  const [fillChecked, setFillChecked] = useState(false);
  const [fillRevealed, setFillRevealed] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("bible365_order");
    const order: GuideMode = raw === "devotion" || raw === "canonical" || raw === "chronological" ? raw : "canonical";
    setMode(order);

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: prog } = await supabase
          .from("bible365_progress")
          .select("day")
          .eq("user_id", user.id)
          .single();
        if (prog?.day) setPlanDay(prog.day);
      }
    });
  }, []);

  useEffect(() => {
    if (mode === "devotion") {
      loadDevotionGuide();
    } else {
      const plan = getBiblePlan(mode as PlanOrder);
      const reading = plan[planDay - 1];
      if (reading) {
        setPlanLabel(reading.label);
        loadPlanGuide(mode as PlanOrder, planDay, reading.label);
      }
    }
    setOpenQ(null);
  }, [mode, planDay]);

  function initFillInputs(g: StudyGuide) {
    if (g.fill_blank) {
      setFillInputs(g.fill_blank.map(ex => ex.answers.map(() => "")));
    } else {
      setFillInputs([]);
    }
    setFillChecked(false);
    setFillRevealed(false);
  }

  async function loadDevotionGuide() {
    setLoading(true); setError(""); setGuide(null);
    const today = new Date().toISOString().split("T")[0];

    let { data } = await supabase
      .from("study_guides")
      .select("title, verse_reference, background, interpretation, questions, application, related_verses, fill_blank")
      .eq("guide_date", today)
      .single();

    if (!data) {
      const { data: latest } = await supabase
        .from("study_guides")
        .select("title, verse_reference, background, interpretation, questions, application, related_verses, fill_blank")
        .order("guide_date", { ascending: false })
        .limit(1)
        .single();
      data = latest;
    }

    if (data && data.fill_blank) {
      setGuide(data);
      initFillInputs(data);
      setLoading(false);
      return;
    }

    setGenerating(true);
    const res = await fetch("/api/generate-study-guide", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    const json = await res.json();
    if (json.error) setError("Could not load today's study guide. Check back after midnight.");
    else { setGuide(json.guide); initFillInputs(json.guide); }
    setGenerating(false);
    setLoading(false);
  }

  async function loadPlanGuide(order: PlanOrder, day: number, passages: string) {
    setLoading(true); setError(""); setGuide(null);
    const planKey = `${order}-day-${String(day).padStart(3, "0")}`;

    const { data } = await supabase
      .from("study_guides")
      .select("title, verse_reference, background, interpretation, questions, application, related_verses, fill_blank")
      .eq("guide_date", planKey)
      .single();

    if (data && data.fill_blank) {
      setGuide(data);
      initFillInputs(data);
      setLoading(false);
      return;
    }

    setGenerating(true);
    const res = await fetch("/api/generate-study-guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planKey, passages }),
    });
    const json = await res.json();
    if (json.error) setError("Could not generate a study guide for this reading.");
    else { setGuide(json.guide); initFillInputs(json.guide); }
    setGenerating(false);
    setLoading(false);
  }

  function setFillInput(ei: number, pi: number, value: string) {
    setFillChecked(false);
    setFillRevealed(false);
    setFillInputs(prev => prev.map((row, ri) => ri === ei ? row.map((v, ci) => ci === pi ? value : v) : row));
  }

  function resetFill() {
    if (guide?.fill_blank) setFillInputs(guide.fill_blank.map(ex => ex.answers.map(() => "")));
    setFillChecked(false);
    setFillRevealed(false);
  }

  function fillScore() {
    if (!guide?.fill_blank) return { correct: 0, total: 0 };
    let correct = 0, total = 0;
    guide.fill_blank.forEach((ex, ei) => {
      ex.answers.forEach((ans, pi) => {
        total++;
        if (fillInputs[ei]?.[pi]?.trim().toLowerCase() === ans.toLowerCase()) correct++;
      });
    });
    return { correct, total };
  }

  const MODES: { id: GuideMode; label: string; sub: string }[] = [
    { id: "devotion",      label: "Daily Deep Dive", sub: "Today's scripture" },
    { id: "canonical",     label: "📖 Canonical",    sub: `Day ${planDay}` },
    { id: "chronological", label: "🕰️ Chronological", sub: `Day ${planDay}` },
  ];

  return (
    <SubscriptionGuard>
      <PageBackground url={BG} overlayOpacity={0.35}>
        <main className="flex-1 p-6 pb-24 flex flex-col items-center">
          <div className="max-w-2xl w-full">

            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/70 hover:text-white text-sm transition">← Back</Link>
              <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                Study Guide
              </h1>
              <div className="w-16" />
            </div>

            {/* Mode selector */}
            <div className="flex gap-2 mb-6">
              {MODES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex-1 py-2 px-2 rounded-xl border text-xs font-semibold transition text-center ${mode === m.id ? "bg-white/25 border-white/50 text-white" : "bg-white/5 border-white/15 text-white/40 hover:text-white/70"}`}
                >
                  <div>{m.label}</div>
                  <div className={`text-xs font-normal mt-0.5 ${mode === m.id ? "text-white/60" : "text-white/25"}`}>{m.sub}</div>
                </button>
              ))}
            </div>

            {mode !== "devotion" && planLabel && !loading && !generating && (
              <p className="text-amber-200/70 text-xs font-semibold uppercase tracking-widest mb-4">{planLabel}</p>
            )}

            {(loading || generating) && (
              <div className="text-center py-20">
                <p className="text-white/60 text-sm">{generating ? "Preparing your study guide..." : "Loading..."}</p>
              </div>
            )}

            {error && <p className="text-red-300 text-center py-20 text-sm">{error}</p>}

            {guide && !loading && (
              <div className="space-y-8">

                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-2">
                    {mode === "devotion" ? "Today's Study" : `${mode === "canonical" ? "Canonical" : "Chronological"} Plan · Day ${planDay}`}
                  </p>
                  <h2 className="text-white text-2xl font-bold leading-snug mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                    {guide.title}
                  </h2>
                  <p className="text-amber-200 text-sm font-semibold">{guide.verse_reference}</p>
                </div>

                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Background</p>
                  <p className="text-white text-sm leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{guide.background}</p>
                </div>

                {guide.interpretation && (
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Interpretation</p>
                    <p className="text-white text-sm leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{guide.interpretation}</p>
                  </div>
                )}

                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Reflection Questions</p>
                  <div className="space-y-2">
                    {guide.questions.map((q, i) => (
                      <div key={i}>
                        <button
                          onClick={() => setOpenQ(openQ === i ? null : i)}
                          className="w-full text-left flex items-start justify-between gap-3 py-3 border-b border-white/10 hover:border-white/20 transition"
                        >
                          <span className="text-white text-sm leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                            {i + 1}. {q}
                          </span>
                          <span className="text-white/40 text-xs mt-1 flex-shrink-0">{openQ === i ? "▲" : "▼"}</span>
                        </button>
                        {openQ === i && (
                          <div className="py-3 px-2">
                            <textarea
                              placeholder="Write your reflection here..."
                              className="w-full bg-white/10 border border-white/20 rounded-xl text-white text-sm p-3 placeholder-white/40 focus:outline-none focus:border-white/40 resize-none leading-relaxed"
                              rows={4}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Today's Application</p>
                  <p className="text-white text-sm leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{guide.application}</p>
                </div>

                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Dig Deeper</p>
                  <div className="space-y-3">
                    {guide.related_verses.map((v, i) => (
                      <div key={i} className="border-l-2 border-white/20 pl-4">
                        <p className="text-amber-200 text-xs font-semibold mb-1">{v.reference}</p>
                        <p className="text-white text-sm leading-relaxed italic" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{v.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fill in the Blank */}
                {guide.fill_blank && guide.fill_blank.length > 0 && (
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Fill in the Blank</p>
                    <p className="text-white/30 text-xs mb-4">Type the missing word(s) from each verse</p>

                    <div className="space-y-4">
                      {guide.fill_blank.map((ex, ei) => (
                        <div key={ei} className="bg-white/5 border border-white/10 rounded-xl p-4">
                          <p className="text-amber-200 text-xs font-semibold mb-3">{ex.reference}</p>
                          <p className="text-white text-sm leading-loose italic">
                            {ex.parts.map((part, pi) => (
                              <span key={pi}>
                                {part}
                                {pi < ex.answers.length && (
                                  <input
                                    type="text"
                                    value={fillInputs[ei]?.[pi] ?? ""}
                                    onChange={e => setFillInput(ei, pi, e.target.value)}
                                    readOnly={fillRevealed}
                                    placeholder="______"
                                    className={`inline-block mx-1 px-2 py-0.5 bg-white/10 rounded border-b-2 text-white text-sm focus:outline-none transition-colors not-italic ${
                                      fillRevealed
                                        ? "border-amber-400 text-amber-200 bg-amber-400/10"
                                        : fillChecked
                                          ? fillInputs[ei]?.[pi]?.trim().toLowerCase() === ex.answers[pi].toLowerCase()
                                            ? "border-green-400 bg-green-400/10"
                                            : "border-red-400 bg-red-400/10"
                                          : "border-white/30 focus:border-white/70"
                                    }`}
                                    style={{ width: `${Math.max(ex.answers[pi].length + 2, 7)}ch` }}
                                  />
                                )}
                              </span>
                            ))}
                          </p>
                          {fillRevealed && (
                            <p className="text-amber-200/60 text-xs mt-2 not-italic">
                              {ex.answers.join(" · ")}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setFillChecked(true)}
                        disabled={fillRevealed}
                        className="flex-1 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-semibold py-2.5 rounded-xl transition disabled:opacity-40"
                      >
                        Check Answers
                      </button>
                      <button
                        onClick={() => { setFillRevealed(true); setFillChecked(false); }}
                        disabled={fillRevealed}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 text-white/60 hover:text-white text-sm py-2.5 px-4 rounded-xl transition disabled:opacity-40"
                      >
                        Reveal
                      </button>
                      <button
                        onClick={resetFill}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 text-white/60 hover:text-white text-sm py-2.5 px-4 rounded-xl transition"
                      >
                        Reset
                      </button>
                    </div>

                    {fillChecked && !fillRevealed && (() => {
                      const { correct, total } = fillScore();
                      return (
                        <p className="text-center text-white/70 text-sm mt-3">
                          {correct === total
                            ? "🎉 Perfect score!"
                            : `${correct} / ${total} correct — keep going!`}
                        </p>
                      );
                    })()}
                  </div>
                )}

              </div>
            )}

          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
