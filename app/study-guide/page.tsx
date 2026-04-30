"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";
import { supabase } from "@/lib/supabase";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/saud-edum-cgapZpzd7v0-unsplash%20(1).jpg";

interface StudyGuide {
  title: string;
  verse_reference: string;
  background: string;
  questions: string[];
  application: string;
  related_verses: { reference: string; text: string }[];
}

export default function StudyGuidePage() {
  const [guide, setGuide] = useState<StudyGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [openQ, setOpenQ] = useState<number | null>(null);

  useEffect(() => { loadGuide(); }, []);

  async function loadGuide() {
    setLoading(true); setError("");
    const today = new Date().toISOString().split("T")[0];

    // Try today first, then fall back to most recent
    let { data } = await supabase
      .from("study_guides")
      .select("title, verse_reference, background, questions, application, related_verses")
      .eq("guide_date", today)
      .single();

    if (!data) {
      const { data: latest } = await supabase
        .from("study_guides")
        .select("title, verse_reference, background, questions, application, related_verses")
        .order("guide_date", { ascending: false })
        .limit(1)
        .single();
      data = latest;
    }

    if (data) { setGuide(data); setLoading(false); return; }

    setGenerating(true);
    const res = await fetch("/api/generate-study-guide", { method: "POST" });
    const json = await res.json();
    if (json.error) { setError("Could not load today's study guide. Check back after 7am."); }
    else { setGuide(json.guide); }
    setGenerating(false);
    setLoading(false);
  }

  return (
    <SubscriptionGuard>
      <PageBackground url={BG} overlayOpacity={0.65}>
        <main className="flex-1 p-6 pb-24 flex flex-col items-center">
          <div className="max-w-2xl w-full">

            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/70 hover:text-white text-sm transition">← Back</Link>
              <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                Study Guide
              </h1>
              <div className="w-16" />
            </div>

            {(loading || generating) && (
              <div className="text-center py-20">
                <p className="text-white/60 text-sm">{generating ? "Preparing today's study guide..." : "Loading..."}</p>
              </div>
            )}

            {error && <p className="text-red-300 text-center py-20 text-sm">{error}</p>}

            {guide && !loading && (
              <div className="space-y-8">

                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Today's Study</p>
                  <h2 className="text-white text-2xl font-bold leading-snug mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                    {guide.title}
                  </h2>
                  <p className="text-amber-200 text-sm font-semibold">{guide.verse_reference}</p>
                </div>

                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Background</p>
                  <p className="text-white/90 text-sm leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                    {guide.background}
                  </p>
                </div>

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
                  <p className="text-white/90 text-sm leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                    {guide.application}
                  </p>
                </div>

                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Dig Deeper</p>
                  <div className="space-y-3">
                    {guide.related_verses.map((v, i) => (
                      <div key={i} className="border-l-2 border-white/20 pl-4">
                        <p className="text-amber-200 text-xs font-semibold mb-1">{v.reference}</p>
                        <p className="text-white/80 text-sm leading-relaxed italic" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                          {v.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
