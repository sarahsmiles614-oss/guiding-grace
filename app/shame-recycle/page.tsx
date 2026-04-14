"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { graceScriptures } from "@/lib/grace-scriptures";

export default function ShameRecyclePage() {
  const [text, setText] = useState("");
  const [isReleasing, setIsReleasing] = useState(false);
  const [showScripture, setShowScripture] = useState(false);
  const [currentScripture, setCurrentScripture] = useState(graceScriptures[0]);
  const [showFallback, setShowFallback] = useState(false);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mainTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      if (mainTimerRef.current) clearTimeout(mainTimerRef.current);
    };
  }, []);

  function handleRelease() {
    if (!text.trim()) return;
    setIsReleasing(true);
    setShowFallback(false);

    fallbackTimerRef.current = setTimeout(() => setShowFallback(true), 2000);

    mainTimerRef.current = setTimeout(() => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      const random = graceScriptures[Math.floor(Math.random() * graceScriptures.length)];
      setCurrentScripture(random);
      setShowScripture(true);
      setIsReleasing(false);
      setShowFallback(false);
    }, 4000);
  }

  function handleReset() {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    if (mainTimerRef.current) clearTimeout(mainTimerRef.current);
    setText("");
    setShowScripture(false);
    setIsReleasing(false);
    setShowFallback(false);
  }

  return (
    <SubscriptionGuard>
      <div
        className="h-screen overflow-hidden bg-cover bg-center bg-fixed relative flex flex-col"
        style={{
          backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/geralt-thunderstorm-9514137_1920.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-orange-900/40 to-cyan-900/50" />

        <div className="relative z-10 flex flex-col h-full">
          <header className="py-3 px-4">
            <div className="max-w-xl mx-auto flex items-center justify-between">
              <Link href="/dashboard" className="text-white/70 text-sm hover:text-white">← Dashboard</Link>
              <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>
                Shame Recycle Bin
              </h1>
              <div className="w-24" />
            </div>
          </header>

          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
            {!showScripture ? (
              <div className="w-full max-w-md">
                <p className="text-white/90 text-center text-sm mb-3" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                  Write what you're ready to release
                </p>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={isReleasing}
                  className="w-full h-28 p-4 bg-black/30 backdrop-blur-sm text-white placeholder-white/50 resize-none outline-none text-base leading-relaxed"
                  placeholder="Give it to God..."
                  style={{ fontFamily: "'Lora', Georgia, serif", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
                />

                <div className="text-center mt-4">
                  <button
                    onClick={handleRelease}
                    disabled={!text.trim() || isReleasing}
                    className="px-5 py-2 text-sm bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm disabled:opacity-40 disabled:cursor-not-allowed border border-white/30 flex items-center gap-2 mx-auto"
                  >
                    🔥 Release to the Fire
                  </button>
                </div>

                {/* Fire Animation Overlay */}
                {isReleasing && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
                    {/* Progress bar */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
                      <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-400 to-yellow-300"
                          style={{ animation: "progressBar 4s linear forwards" }}
                        />
                      </div>
                      <p className="text-white/80 text-sm" style={{ animation: "progressPulse 1.5s ease-in-out infinite" }}>
                        Releasing to God...
                      </p>
                    </div>

                    {showFallback && (
                      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <p className="text-white/90 text-xs">Processing your release...</p>
                      </div>
                    )}

                    {/* Fire glow */}
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[80vh]"
                      style={{
                        background: "radial-gradient(ellipse 100% 80% at 50% 100%, #8B0000 0%, #B22222 15%, #DC143C 25%, #FF4500 40%, #FF6347 55%, #FF8C00 70%, transparent 100%)",
                        animation: "fireGlow 0.7s ease-in-out infinite",
                        transformOrigin: "center bottom",
                      }}
                    />

                    {/* Text being consumed */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="max-w-xl px-6">
                        <p
                          className="text-2xl md:text-3xl text-white leading-relaxed text-center"
                          style={{
                            fontFamily: "'Lora', Georgia, serif",
                            animation: "textBurn 3s ease-in forwards",
                            textShadow: "0 0 20px rgba(255, 150, 50, 0.8), 0 0 40px rgba(255, 100, 0, 0.6)",
                          }}
                        >
                          {text}
                        </p>
                      </div>
                    </div>

                    {/* Ash particles */}
                    <div className="absolute inset-0 pointer-events-none z-30">
                      {[...Array(20)].map((_, i) => {
                        const randomLeft = 35 + Math.random() * 30;
                        const randomSize = 2 + Math.random() * 3;
                        const randomDelay = 2 + i * 0.08;
                        const randomDrift = (Math.random() - 0.5) * 100;
                        return (
                          <div
                            key={i}
                            className="ash-particle"
                            style={{
                              left: `${randomLeft}%`,
                              bottom: "40%",
                              width: `${randomSize}px`,
                              height: `${randomSize}px`,
                              animationDelay: `${randomDelay}s`,
                              ["--drift-x" as string]: `${randomDrift}px`,
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Golden warmth pulse */}
                    <div
                      className="absolute inset-0 z-40"
                      style={{
                        background: "radial-gradient(ellipse at center, rgba(255, 180, 80, 0.4) 0%, rgba(255, 140, 50, 0.2) 50%, transparent 80%)",
                        animation: "goldenPulse 1.5s ease-in-out forwards",
                        animationDelay: "3s",
                        opacity: 0,
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              /* Scripture Reveal */
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
                <div
                  className="absolute inset-0"
                  style={{
                    background: "radial-gradient(ellipse at center, rgba(200, 150, 50, 0.15) 0%, transparent 70%)",
                    animation: "gentleGlow 4s ease-in-out infinite",
                  }}
                />

                <div className="relative z-10 max-w-lg mx-auto px-6 text-center">
                  <blockquote
                    className="text-xl md:text-2xl text-white leading-relaxed mb-6"
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      animation: "textFadeIn 2s ease-out forwards",
                      animationDelay: "0.5s",
                      opacity: 0,
                    }}
                  >
                    &ldquo;{currentScripture.scripture}&rdquo;
                  </blockquote>

                  <p
                    className="text-base text-white/70 mb-8"
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      animation: "textFadeIn 2s ease-out forwards",
                      animationDelay: "1.5s",
                      opacity: 0,
                    }}
                  >
                    — {currentScripture.reference}
                  </p>

                  <button
                    onClick={handleReset}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2 text-sm backdrop-blur-sm"
                    style={{
                      animation: "textFadeIn 2s ease-out forwards",
                      animationDelay: "2.5s",
                      opacity: 0,
                    }}
                  >
                    Release Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SubscriptionGuard>
  );
}
