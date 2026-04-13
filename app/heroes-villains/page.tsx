"use client";
import { useState } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";

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
      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Link href="/dashboard" className="text-purple-700 text-sm">← Dashboard</Link>
            <h1 className="text-lg font-bold text-purple-900">Heroes & Villains</h1>
            <div className="w-16" />
          </div>

          <div className="flex gap-2 mb-6">
            {(["all","hero","villain","both"] as Filter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition ${filter === f ? "bg-purple-700 text-white" : "bg-white border border-purple-200 text-purple-700"}`}>{f === "both" ? "Complex" : f}</button>
            ))}
          </div>

          {selected ? (
            <div className="bg-white rounded-3xl shadow-sm border border-purple-100 p-8">
              <button onClick={() => setSelected(null)} className="text-purple-700 text-sm mb-4">← Back</button>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{selected.type === "hero" ? "⚔️" : selected.type === "villain" ? "🐍" : "⚖️"}</span>
                <div>
                  <h2 className="text-2xl font-bold text-purple-900">{selected.name}</h2>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${selected.type === "hero" ? "bg-green-100 text-green-700" : selected.type === "villain" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {selected.type === "both" ? "Complex Figure" : selected.type === "hero" ? "Hero" : "Villain"}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">{selected.summary}</p>
              <div className="space-y-2">
                {selected.verses.map((v: string) => (
                  <p key={v} className="text-xs text-purple-400">📖 {v}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map(p => (
                <button key={p.name} onClick={() => setSelected(p)} className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5 text-left hover:shadow-md transition">
                  <span className="text-2xl mb-2 block">{p.type === "hero" ? "⚔️" : p.type === "villain" ? "🐍" : "⚖️"}</span>
                  <p className="font-semibold text-purple-900 text-sm">{p.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${p.type === "hero" ? "bg-green-100 text-green-700" : p.type === "villain" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {p.type === "both" ? "Complex" : p.type === "hero" ? "Hero" : "Villain"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </SubscriptionGuard>
  );
}
