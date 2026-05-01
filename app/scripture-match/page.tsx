"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";
import { supabase } from "@/lib/supabase";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/todd-trapani-91T-rq-pY28-unsplash.jpg";

interface Pair { left: string; right: string; difficulty: string; }
interface Card { id: string; text: string; pairIndex: number; side: "left" | "right"; matched: boolean; flipped: boolean; }

function buildCards(pairs: Pair[]): Card[] {
  const cards: Card[] = [];
  pairs.forEach((p, i) => {
    cards.push({ id: `l${i}`, text: p.left, pairIndex: i, side: "left", matched: false, flipped: false });
    cards.push({ id: `r${i}`, text: p.right, pairIndex: i, side: "right", matched: false, flipped: false });
  });
  return cards.sort(() => Math.random() - 0.5);
}

export default function ScriptureMatchPage() {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [matched, setMatched] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [won, setWon] = useState(false);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [personalBest, setPersonalBest] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [newBest, setNewBest] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lockRef = useRef(false);

  function playFlip() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  function playMatch() {
    try {
      const ctx = new AudioContext();
      [520, 660, 780].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.15);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.15);
      });
    } catch {}
  }

  function pbKey(d: string) { return `sm_personal_best_${d}`; }

  useEffect(() => {
    loadGame();
    const pb = localStorage.getItem(pbKey("all"));
    if (pb) setPersonalBest(parseInt(pb));
    const s = localStorage.getItem("sm_streak");
    if (s) setStreak(parseInt(s));
  }, []);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  async function loadGame(diff: "all" | "easy" | "medium" | "hard" = difficulty) {
    setLoading(true); setGenerating(false); setError("");
    const today = new Date().toISOString().split("T")[0];
    let { data } = await supabase
      .from("scripture_match_cards")
      .select("pairs")
      .eq("card_date", today)
      .single();

    if (!data) {
      const { data: latest } = await supabase
        .from("scripture_match_cards")
        .select("pairs")
        .order("card_date", { ascending: false })
        .limit(1)
        .single();
      data = latest;
    }

    if (data) {
      initGame(data.pairs, diff);
      setLoading(false);
      return;
    }

    setGenerating(true);
    const res = await fetch("/api/generate-scripture-match", { method: "POST" });
    const json = await res.json();
    if (json.error || !json.pairs) {
      setError("Could not load today's game. Make sure today's devotion has been generated first.");
      setLoading(false);
      setGenerating(false);
      return;
    }
    initGame(json.pairs, diff);
    setGenerating(false);
    setLoading(false);
  }

  function initGame(allPairs: Pair[], diff: "all" | "easy" | "medium" | "hard") {
    let p = allPairs;
    if (diff !== "all") p = allPairs.filter((x: Pair) => x.difficulty === diff);
    if (p.length === 0) p = allPairs;
    setPairs(p);
    setCards(buildCards(p));
    setSelected([]);
    setMatched(0);
    setAttempts(0);
    setWon(false);
    setTime(0);
    setRunning(false);
    setNewBest(false);
    lockRef.current = false;
  }

  function handleSelect(id: string) {
    if (lockRef.current) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.matched || card.flipped) return;
    if (!running) setRunning(true);

    if (selected.length === 0) {
      playFlip();
      setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
      setSelected([id]);
      return;
    }

    if (selected.length === 1) {
      if (selected[0] === id) return;
      playFlip();
      setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
      const firstCard = cards.find(c => c.id === selected[0])!;
      setAttempts(a => a + 1);
      lockRef.current = true;

      if (firstCard.pairIndex === card.pairIndex && firstCard.side !== card.side) {
        setTimeout(() => {
          playMatch();
          setCards(prev => prev.map(c =>
            c.id === id || c.id === selected[0] ? { ...c, matched: true } : c
          ));
          setMatched(m => {
            const next = m + 1;
            if (next === pairs.length) {
              setRunning(false);
              setWon(true);
              const today = new Date().toISOString().split("T")[0];
              const last = localStorage.getItem("sm_last_played");
              const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
              const newStreak = last === yesterday ? streak + 1 : 1;
              setStreak(newStreak);
              localStorage.setItem("sm_last_played", today);
              localStorage.setItem("sm_streak", String(newStreak));
              setTime(t => {
                const key = pbKey(difficulty);
                const pb = localStorage.getItem(key);
                if (!pb || t < parseInt(pb)) {
                  localStorage.setItem(key, String(t));
                  setPersonalBest(t);
                  setNewBest(true);
                }
                return t;
              });
            }
            return next;
          });
          setSelected([]);
          lockRef.current = false;
        }, 700);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === id || c.id === selected[0] ? { ...c, flipped: false } : c
          ));
          setSelected([]);
          lockRef.current = false;
        }, 900);
      }
    }
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  function handleDifficulty(d: "all" | "easy" | "medium" | "hard") {
    setDifficulty(d);
    const pb = localStorage.getItem(pbKey(d));
    setPersonalBest(pb ? parseInt(pb) : null);
    setNewBest(false);
    loadGame(d);
  }

  return (
    <SubscriptionGuard>
      <PageBackground url={BG} overlayOpacity={0.65}>
        <main className="flex-1 p-6 pb-24 flex flex-col items-center">
          <div className="max-w-lg w-full">
            {showHelp && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-6" onClick={() => setShowHelp(false)}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <div className="relative bg-black/80 border border-white/20 rounded-3xl p-7 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                  <h2 className="text-white text-xl font-bold mb-4 text-center" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>How to Play</h2>
                  <ul className="text-white/80 text-sm leading-relaxed space-y-3 mb-6">
                    <li>📖 Each card hides half of a scripture pair — a verse, character, or concept.</li>
                    <li>👆 Tap any card to flip it and see what's underneath.</li>
                    <li>🔍 Tap a second card — if they match, they stay face up!</li>
                    <li>❌ If they don't match, both flip back after a moment. Try to remember where they were!</li>
                    <li>⏱️ Your time is tracked — finish faster to beat your personal best.</li>
                    <li>🎯 Use Easy, Medium, or Hard to filter the difficulty of pairs.</li>
                    <li>🔥 Play every day to keep your streak alive!</li>
                  </ul>
                  <button onClick={() => setShowHelp(false)} className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-2xl transition text-sm">
                    Got it!
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/70 hover:text-white text-sm transition">← Back</Link>
              <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                Scripture Match
              </h1>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowHelp(true)} className="text-white/50 hover:text-white text-xs border border-white/20 hover:border-white/40 px-2 py-1 rounded-lg transition">
                  How to Play
                </button>
                <div className="text-white/70 text-sm">{formatTime(time)}</div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-5 text-xs text-white/60">
              <span>🔥 {streak} day streak</span>
              <span>{matched}/{pairs.length} matched</span>
              {personalBest !== null && <span>⚡ Best ({difficulty}) {formatTime(personalBest)}</span>}
            </div>

            <div className="flex gap-2 mb-6">
              {(["all", "easy", "medium", "hard"] as const).map(d => (
                <button key={d} onClick={() => handleDifficulty(d)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition border ${difficulty === d ? "bg-white/25 border-white/50 text-white" : "bg-white/5 border-white/15 text-white/50 hover:text-white/80"}`}>
                  {d}
                </button>
              ))}
            </div>

            {(loading || generating) && (
              <p className="text-white/60 text-center py-20 text-sm">
                {generating ? "Preparing today's cards..." : "Loading..."}
              </p>
            )}
            {error && <p className="text-red-300 text-center py-20 text-sm">{error}</p>}

            {!loading && !error && !won && (
              <div className="grid grid-cols-3 gap-3">
                {cards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => handleSelect(card.id)}
                    className={`relative h-24 rounded-2xl border text-xs font-medium leading-tight p-2 transition-all duration-300 text-center flex items-center justify-center
                      ${card.matched
                        ? "bg-green-500/30 border-green-400/50 text-green-200 scale-95"
                        : card.flipped
                        ? selected.includes(card.id)
                          ? "bg-yellow-400/25 border-yellow-300/60 text-white scale-105 shadow-lg"
                          : "bg-white/20 border-white/40 text-white"
                        : "bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:border-white/40 hover:scale-105 cursor-pointer"
                      }`}
                  >
                    {card.matched ? (
                      <span className="leading-snug">{card.text}</span>
                    ) : card.flipped ? (
                      <span className="leading-snug">{card.text}</span>
                    ) : (
                      <span className="text-2xl opacity-30">✦</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {won && (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                  You matched them all!
                </h2>
                {newBest && <p className="text-yellow-300 text-sm font-semibold mb-2">⚡ New personal best!</p>}
                <p className="text-white/70 text-sm mb-1">Time: {formatTime(time)}</p>
                <p className="text-white/70 text-sm mb-1">Attempts: {attempts}</p>
                <p className="text-white/70 text-sm mb-6">🔥 {streak} day streak</p>
                {personalBest !== null && !newBest && (
                  <p className="text-white/50 text-xs mb-6">Personal best: {formatTime(personalBest)}</p>
                )}
                <button onClick={() => loadGame()} className="bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold px-8 py-3 rounded-2xl transition text-sm">
                  Play Again
                </button>
                <p className="text-white/40 text-xs mt-8">A new game drops every day — check back tomorrow! 📖</p>
              </div>
            )}

            {!loading && !error && !won && (
              <p className="text-white/40 text-xs text-center mt-6">
                Tap a card to flip it. Match the pairs to win.
              </p>
            )}
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
