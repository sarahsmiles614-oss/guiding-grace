"use client";
import { useState } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";

const prompts = [
  "Where did you see God's hand in your day today?",
  "What moment today are you most grateful for?",
  "Was there a time today you felt at peace? What were you doing?",
  "Did you extend grace to someone today — or to yourself?",
  "What is one thing you want to release before you sleep tonight?",
  "Where did you fall short today, and how does grace meet you there?",
  "What did today teach you about who God is?",
];

export default function NightlyReflectionsPage() {
  const [prompt] = useState(() => prompts[Math.floor(Math.random() * prompts.length)]);
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/rezaaskarii-sweden-6834164.jpg" overlay="bg-black/50">
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/80 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Nightly Reflections</h1>
              <div className="w-16" />
            </div>
            {!saved ? (
              <div className="bg-white/10 backdrop-blur rounded-3xl p-8 border border-white/20">
                <div className="text-4xl text-center mb-4">🌙</div>
                <p className="text-white/60 text-xs uppercase tracking-widest text-center mb-4">Tonight's Reflection</p>
                <p className="text-white text-lg font-medium text-center mb-6 leading-relaxed">{prompt}</p>
                <textarea value={entry} onChange={e => setEntry(e.target.value)} placeholder="Write your reflection..." className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-white/30 mb-4" rows={6} />
                <button onClick={() => setSaved(true)} disabled={!entry.trim()} className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40">
                  Save Reflection ✨
                </button>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur rounded-3xl p-8 text-center border border-white/20">
                <div className="text-5xl mb-4">⭐</div>
                <h2 className="text-xl font-bold text-white mb-3">Rest well.</h2>
                <p className="text-white/70 text-sm">"He grants sleep to those he loves." — Psalm 127:2</p>
              </div>
            )}
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
