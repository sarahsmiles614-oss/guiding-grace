"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { graceScriptures } from "@/lib/grace-scriptures";

export default function ShameRecyclePage() {
  const [text, setText] = useState("");
  const [isReleasing, setIsReleasing] = useState(false);
  const [showScripture, setShowScripture] = useState(false);
  const [currentScripture, setCurrentScripture] = useState(graceScriptures[0]);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mainTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pre-generate particle data so it doesn't shift on re-render
  const embers = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
    left: 20 + Math.random() * 60,
    size: 2 + Math.random() * 5,
    delay: 0.3 + i * 0.09,
    drift: (Math.random() - 0.5) * 130,
    color: i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#FF6600" : "#FF3300",
  })), []);

  const sparks = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    left: 30 + Math.random() * 40,
    size: 1 + Math.random() * 2.5,
    delay: 0.1 + i * 0.12,
    sparkX: (Math.random() - 0.5) * 80,
    white: i % 2 === 0,
  })), []);

  const ashes = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    left: 30 + Math.random() * 40,
    size: 2 + Math.random() * 3,
    delay: 1.8 + i * 0.1,
    drift: (Math.random() - 0.5) * 110,
  })), []);

  const smokes = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    left: 25 + i * 10,
    size: 55 + i * 18,
    delay: i * 0.7,
    smokeX: (Math.random() - 0.5) * 90,
  })), []);

  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      if (mainTimerRef.current) clearTimeout(mainTimerRef.current);
    };
  }, []);

  function handleRelease() {
    if (!text.trim()) return;
    setIsReleasing(true);

    mainTimerRef.current = setTimeout(() => {
      const random = graceScriptures[Math.floor(Math.random() * graceScriptures.length)];
      setCurrentScripture(random);
      setShowScripture(true);
      setIsReleasing(false);
    }, 4000);
  }

  function handleReset() {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    if (mainTimerRef.current) clearTimeout(mainTimerRef.current);
    setText("");
    setShowScripture(false);
    setIsReleasing(false);
  }

  return (
    <SubscriptionGuard>
      <div
        className="h-screen overflow-hidden bg-cover bg-center bg-fixed relative flex flex-col"
        style={{
          backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/cullan-smith-BdTtvBRhOng-unsplash.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-orange-900/25 to-cyan-900/30" />

        <div className="relative z-10 flex flex-col h-full">
          <header className="py-3 px-4 relative">
            <Link href="/dashboard" className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-sm hover:text-amber-200">← Dashboard</Link>
            <h1 className="text-lg font-bold text-white whitespace-nowrap text-center" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>
              Shame Recycle Bin
            </h1>
          </header>

          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
            {!showScripture ? (
              <div className="w-full max-w-md">
                <p className="text-white text-center text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 10px rgba(0,0,0,1)" }}>
                  Give it to God
                </p>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={isReleasing}
                  className="w-full h-24 p-3 bg-black/40 backdrop-blur-sm text-white placeholder-white/70 resize-none outline-none text-sm leading-snug rounded-xl border border-white/30 focus:border-white/60"
                  placeholder="Write what you're ready to release..."
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                />

                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleRelease}
                    disabled={!text.trim() || isReleasing}
                    className="px-5 py-2 text-sm bg-orange-500 hover:bg-orange-400 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed border-2 border-orange-200 rounded-xl flex items-center gap-2 shadow-xl"
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
                        <div className="h-full bg-gradient-to-r from-orange-400 to-yellow-300" style={{ animation: "progressBar 4s linear forwards" }} />
                      </div>
                      <p className="text-white text-sm" style={{ animation: "progressPulse 1.5s ease-in-out infinite" }}>
                        Releasing to God...
                      </p>
                    </div>

                    {/* Deep crimson base glow */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[65vh]"
                      style={{
                        background: "radial-gradient(ellipse 110% 80% at 50% 100%, #3d0000 0%, #8b0000 20%, #cc1100 45%, transparent 72%)",
                        animation: "fireGlow 1.1s ease-in-out infinite",
                        filter: "blur(45px)",
                        transformOrigin: "center bottom",
                      }}
                    />

                    {/* Orange mid-fire */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[75%] h-[52vh]"
                      style={{
                        background: "radial-gradient(ellipse 100% 90% at 50% 100%, #8b2500 0%, #cc4400 25%, #ff6600 55%, transparent 80%)",
                        animation: "fireMid 0.75s ease-in-out infinite 0.1s",
                        filter: "blur(22px)",
                        transformOrigin: "center bottom",
                      }}
                    />

                    {/* Yellow-orange hot core */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[45%] h-[36vh]"
                      style={{
                        background: "radial-gradient(ellipse 100% 100% at 50% 100%, #ff4500 0%, #ff8c00 40%, #ffd700 72%, transparent 90%)",
                        animation: "fireTip 0.5s ease-in-out infinite 0.25s",
                        filter: "blur(14px)",
                        transformOrigin: "center bottom",
                      }}
                    />

                    {/* Bright white-hot tip */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[22%] h-[20vh]"
                      style={{
                        background: "radial-gradient(ellipse at 50% 100%, #ffffff 0%, #fffde7 30%, #ffd700 65%, transparent 88%)",
                        animation: "fireTip 0.32s ease-in-out infinite 0.05s",
                        filter: "blur(7px)",
                        transformOrigin: "center bottom",
                      }}
                    />

                    {/* Smoke wisps */}
                    {smokes.map((s, i) => (
                      <div key={`smoke-${i}`} className="smoke-wisp"
                        style={{
                          left: `${s.left}%`,
                          bottom: "38%",
                          width: `${s.size}px`,
                          height: `${s.size}px`,
                          animationDelay: `${s.delay}s`,
                          ["--smoke-x" as string]: `${s.smokeX}px`,
                        }}
                      />
                    ))}

                    {/* Text being consumed */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="max-w-xl px-6">
                        <p className="text-2xl md:text-3xl text-white leading-relaxed text-center"
                          style={{
                            fontFamily: "'Lora', Georgia, serif",
                            animation: "textConsume 4s ease-in forwards",
                            textShadow: "0 0 20px rgba(255,150,50,0.9), 0 0 40px rgba(255,100,0,0.7), 0 0 70px rgba(255,50,0,0.5)",
                          }}
                        >
                          {text}
                        </p>
                      </div>
                    </div>

                    {/* Ember particles */}
                    <div className="absolute inset-0 pointer-events-none z-30">
                      {embers.map((e, i) => (
                        <div key={`ember-${i}`} className="ember-particle"
                          style={{
                            left: `${e.left}%`,
                            bottom: "22%",
                            width: `${e.size}px`,
                            height: `${e.size}px`,
                            background: e.color,
                            boxShadow: `0 0 ${e.size * 2.5}px ${e.color}, 0 0 ${e.size * 5}px ${e.color}88`,
                            animationDelay: `${e.delay}s`,
                            ["--drift-x" as string]: `${e.drift}px`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Spark particles */}
                    <div className="absolute inset-0 pointer-events-none z-30">
                      {sparks.map((s, i) => (
                        <div key={`spark-${i}`} className="spark-particle"
                          style={{
                            left: `${s.left}%`,
                            bottom: "28%",
                            width: `${s.size}px`,
                            height: `${s.size}px`,
                            background: s.white ? "#FFFFFF" : "#FFD700",
                            boxShadow: `0 0 4px ${s.white ? "#FFFFFF" : "#FFD700"}`,
                            animationDelay: `${s.delay}s`,
                            ["--spark-x" as string]: `${s.sparkX}px`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Ash particles */}
                    <div className="absolute inset-0 pointer-events-none z-30">
                      {ashes.map((a, i) => (
                        <div key={`ash-${i}`} className="ash-particle"
                          style={{
                            left: `${a.left}%`,
                            bottom: "38%",
                            width: `${a.size}px`,
                            height: `${a.size}px`,
                            animationDelay: `${a.delay}s`,
                            ["--drift-x" as string]: `${a.drift}px`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Ignition pulse */}
                    <div className="absolute inset-0 z-40 pointer-events-none"
                      style={{
                        background: "radial-gradient(ellipse at center, rgba(255,100,0,0.55) 0%, transparent 70%)",
                        animation: "ignitionPulse 1.2s ease-out forwards",
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              /* Scripture Reveal */
              <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
                style={{
                  backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/milad-noroozi-QSOwM_tqO6w-unsplash.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Dark overlay so text stays readable */}
                <div className="absolute inset-0 bg-black/55" />

                <div className="relative z-10 max-w-lg mx-auto px-6 text-center">
                  <p className="text-amber-300 text-xs tracking-widest uppercase mb-8"
                    style={{ animation: "textFadeIn 1.5s ease-out forwards", opacity: 0 }}
                  >
                    Your shame is released
                  </p>

                  <blockquote className="text-xl md:text-2xl text-white leading-relaxed mb-5"
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      animation: "textFadeIn 2s ease-out forwards",
                      animationDelay: "0.8s",
                      opacity: 0,
                      textShadow: "0 0 30px rgba(210,130,30,0.4)",
                    }}
                  >
                    &ldquo;{currentScripture.scripture}&rdquo;
                  </blockquote>

                  <p className="text-base text-amber-200 mb-10"
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      animation: "textFadeIn 2s ease-out forwards",
                      animationDelay: "1.8s",
                      opacity: 0,
                    }}
                  >
                    — {currentScripture.reference}
                  </p>

                  <button onClick={handleReset}
                    className="bg-white/10 hover:bg-white/20 text-white border border-amber-300/25 px-8 py-3 text-sm backdrop-blur-sm tracking-wider"
                    style={{
                      animation: "textFadeIn 2s ease-out forwards",
                      animationDelay: "3s",
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
