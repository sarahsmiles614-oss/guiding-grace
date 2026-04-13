"use client";
import { useState } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";

const people = [
  { name: "David", type: "both", summary: "Warrior king, poet, adulterer, repenter. A man after God's own heart despite catastrophic failures.", verses: ["Psalm 51:10", "1 Samuel 13:14"] },
  { name: "Mary Magdalene", type: "hero", summary: "Delivered from seven demons, she became the first witness to the resurrection. Loyalty personified.", verses: ["Luke 8:2", "John 20:16"] },
  { name: "Judas Iscariot", type: "villain", summary: "Walked with Jesus for three years and still chose thirty pieces of silver. The tragedy of proximity without surrender.", verses: ["Matthew 26:15", "Acts 1:18"] },
  { name: "Paul (Saul)", type: "both", summary: "Murderer of Christians turned champion of the gospel. The most dramatic transformation in scripture.", verses: ["Acts 9:4", "Philippians 3:8"] },
  { name: "Esther", type: "hero", summary: "An orphan who became queen and risked her life to save her people. Courage dressed in grace.", verses: ["Esther 4:14"] },
  { name: "Jezebel", type: "villain", summary: "Manipulator, idolater, murderer of prophets. Her name became a warning across generations.", verses: ["1 Kings 21:25", "Revelation 2:20"] },
  { name: "Peter", type: "both", summary: "Impulsive, denying, weeping — and then rock-solid. Failure was not his final chapter.", verses: ["Matthew 16:18", "Luke 22:62"] },
  { name: "Joseph", type: "hero", summary: "Betrayed by brothers, enslaved, imprisoned — and never bitter. He fed the very people who sold him.", verses: ["Genesis 50:20"] },
  { name: "Herod", type: "villain", summary: "Murdered infants to protect his throne. Power as the only god he knew.", verses: ["Matthew 2:16"] },
  { name: "Ruth", type: "hero", summary: "A Moabite widow who chose loyalty over convenience. Her love for Naomi echoes across millennia.", verses: ["Ruth 1:16"] },
];

type Filter = "all" | "hero" | "villain" | "both";

export default function HeroesVillainsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<any>(null);
  const filtered = filter === "all" ? people : people.filter(p => p.type === filter);

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/glagolyvechnoyzhizni-goliath-8748113_1920.png">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/70 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Heroes & Villains</h1>
              <div className="w-16" />
            </div>
            <div className="flex gap-3 mb-8">
              {(["all","hero","villain","both"] as Filter[]).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition ${filter === f ? "bg-white/30 text-white" : "text-white/50 hover:text-white"}`}>{f === "both" ? "Complex" : f}</button>
              ))}
            </div>
            {selected ? (
              <div>
                <button onClick={() => setSelected(null)} className="text-white/60 text-sm mb-6 hover:text-white">← Back</button>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{selected.type === "hero" ? "⚔️" : selected.type === "villain" ? "🐍" : "⚖️"}</span>
                  <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>{selected.name}</h2>
                </div>
                <p className="text-white/80 leading-relaxed mb-6" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{selected.summary}</p>
                <div className="space-y-1">{selected.verses.map((v: string) => <p key={v} className="text-white/50 text-xs">📖 {v}</p>)}</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {filtered.map(p => (
                  <button key={p.name} onClick={() => setSelected(p)} className="text-left hover:opacity-80 transition">
                    <span className="text-3xl mb-2 block">{p.type === "hero" ? "⚔️" : p.type === "villain" ? "🐍" : "⚖️"}</span>
                    <p className="font-semibold text-white text-sm" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>{p.name}</p>
                    <p className="text-white/50 text-xs mt-0.5">{p.type === "both" ? "Complex" : p.type === "hero" ? "Hero" : "Villain"}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
