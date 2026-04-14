"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { reflectionScriptures } from "@/lib/reflection-scriptures";

export default function NightlyReflectionsPage() {
  const [burdens, setBurdens] = useState("");
  const [blessings, setBlessings] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showScripture, setShowScripture] = useState(false);
  const [currentScripture, setCurrentScripture] = useState(reflectionScriptures[0]);
  const [showFallback, setShowFallback] = useState(false);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mainTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      if (mainTimerRef.current) clearTimeout(mainTimerRef.current);
    };
  }, []);

  function handleSend() {
    if (!burdens.trim() && !blessings.trim()) return;
    setIsSending(true);
    setShowFallback(false);

    fallbackTimerRef.current = setTimeout(() => setShowFallback(true), 2000);

    mainTimerRef.current = setTimeout(() => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      const random = reflectionScriptures[Math.floor(Math.random() * reflectionScriptures.length)];
      setCurrentScripture(random);
      setShowScripture(true);
      setIsSending(false);
      setShowFallback(false);
    }, 6000);
  }

  function handleReset() {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    if (mainTimerRef.current) clearTimeout(mainTimerRef.current);
    setBurdens("");
    setBlessings("");
    setShowScripture(false);
    setIsSending(false);
    setShowFallback(false);
  }

  return (
    <SubscriptionGuard>
      <div
        className="h-screen overflow-hidden bg-cover bg-center bg-fixed relative flex flex-col"
        style={{
          backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/rezaaskarii-sweden-6834164.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/60 via-blue-900/50 to-slate-900/60" />

        <div className="relative z-10 flex flex-col h-full">
          <header className="py-2 px-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="text-white/70 text-sm hover:text-white">← Dashboard</Link>
            </div>
          </header>

          <div className="flex-1 flex flex-col justify-center px-4 pb-4">
            {!showScripture ? (
              <>
                <h1 className="text-2xl font-thin text-white text-center mb-2" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>
                  Nightly Reflections
                </h1>

                <div className="grid grid-cols-2 gap-2 mb-2 max-w-4xl mx-auto w-full">
                  <div>
                    <label htmlFor="burdens" className="block text-white font-thin mb-1 text-sm">
                      Burdens
                    </label>
                    <textarea
                      id="burdens"
                      value={burdens}
                      onChange={(e) => setBurdens(e.target.value)}
                      disabled={isSending}
                      className="w-full h-32 p-2 text-sm border border-white/20 focus:border-white/40 outline-none bg-white/10 backdrop-blur-md text-white placeholder-white/40 resize-none disabled:opacity-50"
                      placeholder="What weighed on your heart..."
                    />
                  </div>
                  <div>
                    <label htmlFor="blessings" className="block text-white font-thin mb-1 text-sm">
                      Blessings
                    </label>
                    <textarea
                      id="blessings"
                      value={blessings}
                      onChange={(e) => setBlessings(e.target.value)}
                      disabled={isSending}
                      className="w-full h-32 p-2 text-sm border border-white/20 focus:border-white/40 outline-none bg-white/10 backdrop-blur-md text-white placeholder-white/40 resize-none disabled:opacity-50"
                      placeholder="What brought you joy..."
                    />
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleSend}
                    disabled={(!burdens.trim() && !blessings.trim()) || isSending}
                    className="px-4 py-2 text-sm bg-white/90 hover:bg-white text-gray-900 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                  >
                    {isSending ? "Sending..." : "✈ Send to God"}
                  </button>
                </div>

                {/* Bird Animation Overlay */}
                {isSending && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-cover bg-center overflow-hidden"
                    style={{
                      backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/rezaaskarii-sweden-6834164.jpg')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/70 via-blue-900/60 to-slate-900/70" />

                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
                      <p
                        className="text-white/90 text-lg"
                        style={{
                          fontFamily: "'Lora', Georgia, serif",
                          animation: "progressPulse 2s ease-in-out infinite",
                          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                        }}
                      >
                        Sending your prayers...
                      </p>
                    </div>

                    {showFallback && (
                      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <p className="text-white/90 text-xs">Lifting your words to heaven...</p>
                      </div>
                    )}

                    <div className="relative z-10 w-full h-full">
                      {/* Bird 1 */}
                      <div
                        className="absolute"
                        style={{
                          left: "45%",
                          bottom: 0,
                          animation: "driftUpward 6s ease-in-out forwards",
                          ["--sway" as string]: "30px",
                        }}
                      >
                        <div style={{ animation: "sway 6s ease-in-out infinite" }}>
                          <div
                            className="absolute left-1/2 top-0 w-0.5 h-20 bg-gradient-to-b from-white/30 to-transparent"
                            style={{ animation: "trailFade 1s ease-out infinite", transformOrigin: "top center", marginLeft: "-1px" }}
                          />
                          <svg width="60" height="30" viewBox="0 0 60 30" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.95">
                            <path d="M 30 15 Q 15 8 5 10" />
                            <path d="M 30 15 Q 45 8 55 10" />
                            <path d="M 28 15 Q 30 18 32 15" strokeWidth="1" />
                          </svg>
                        </div>
                      </div>

                      {/* Bird 2 */}
                      <div
                        className="absolute"
                        style={{
                          left: "50%",
                          bottom: 0,
                          animation: "driftUpward 6s ease-in-out 0.5s forwards",
                          ["--sway" as string]: "-35px",
                        }}
                      >
                        <div style={{ animation: "sway 6s ease-in-out infinite 0.5s" }}>
                          <div
                            className="absolute left-1/2 top-0 w-0.5 h-20 bg-gradient-to-b from-white/30 to-transparent"
                            style={{ animation: "trailFade 1s ease-out infinite 0.3s", transformOrigin: "top center", marginLeft: "-1px" }}
                          />
                          <svg width="60" height="30" viewBox="0 0 60 30" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.95">
                            <path d="M 30 15 Q 15 9 6 12" />
                            <path d="M 30 15 Q 45 9 54 12" />
                            <path d="M 28 15 Q 30 18 32 15" strokeWidth="1" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center" style={{ animation: "textFadeIn 2s ease-out forwards" }}>
                <h2 className="text-xl font-thin text-white mb-3" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>
                  God&apos;s Word for You Tonight
                </h2>
                <blockquote
                  className="text-lg text-white leading-relaxed mb-3 max-w-2xl mx-auto px-4"
                  style={{ fontFamily: "'Lora', Georgia, serif", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                >
                  &ldquo;{currentScripture.scripture}&rdquo;
                </blockquote>
                <p className="text-sm text-white/80 mb-6" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                  — {currentScripture.reference}
                </p>
                <button
                  onClick={handleReset}
                  className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 text-sm backdrop-blur-sm"
                >
                  Reflect Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </SubscriptionGuard>
  );
}
