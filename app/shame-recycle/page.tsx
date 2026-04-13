"use client";
import { useState } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";

export default function ShameRecyclePage() {
  const [text, setText] = useState("");
  const [recycled, setRecycled] = useState(false);
  const [animating, setAnimating] = useState(false);

  function handleRecycle() {
    if (!text.trim()) return;
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      setRecycled(true);
      setText("");
    }, 1200);
  }

  return (
    <SubscriptionGuard>
      <PageBackground url={recycled ? "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/marcelkessler-heaven-4850411_1920.jpg" : "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/geralt-thunderstorm-9514137_1920.jpg"}>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/80 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Shame Recycle Bin</h1>
              <div className="w-16" />
            </div>
            {!recycled ? (
              <div className="bg-white/90 backdrop-blur rounded-3xl p-8 text-center">
                <div className={`text-6xl mb-4 transition-transform duration-500 ${animating ? "scale-150 rotate-12" : ""}`}>🗑️</div>
                <p className="text-gray-500 text-sm mb-6">Write down what is weighing on you — a shame, a fear, a regret. Then recycle it. You do not have to carry it.</p>
                <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type it here..." className="w-full border border-purple-200 rounded-xl p-4 text-gray-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 mb-4" rows={5} />
                <button onClick={handleRecycle} disabled={!text.trim() || animating} className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40">
                  {animating ? "Recycling..." : "Recycle It 🗑️"}
                </button>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur rounded-3xl p-8 text-center">
                <div className="text-6xl mb-4">🕊️</div>
                <h2 className="text-xl font-bold text-purple-900 mb-3">It is gone.</h2>
                <p className="text-gray-500 text-sm mb-6">"As far as the east is from the west, so far has he removed our transgressions from us." — Psalm 103:12</p>
                <button onClick={() => setRecycled(false)} className="text-purple-700 underline text-sm">Recycle something else</button>
              </div>
            )}
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
