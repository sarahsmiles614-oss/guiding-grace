"use client";
import { useState } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";

const devotions = [
  { date: "April 12", title: "Walking in Grace", verse: "John 1:16", verseText: "Out of his fullness we have all received grace in place of grace already given.", reflection: "Grace is not a one-time gift — it is an endless river. Every morning you wake, you are standing in a fresh current of it. Today, let yourself receive rather than strive." },
  { date: "April 13", title: "The Quiet Shepherd", verse: "Psalm 23:1", verseText: "The Lord is my shepherd, I lack nothing.", reflection: "When we truly believe we lack nothing, anxiety loses its grip. The Shepherd does not promise a perfect path — He promises His presence on every path." },
  { date: "April 14", title: "Rooted in Love", verse: "Ephesians 3:17", verseText: "That Christ may dwell in your hearts through faith — that you, being rooted and grounded in love.", reflection: "Roots are invisible but everything depends on them. Your hidden life with God — the prayers no one hears, the trust no one sees — is the root that holds you in every storm." },
  { date: "April 15", title: "The Gift of Today", verse: "Lamentations 3:23", verseText: "His mercies are new every morning; great is your faithfulness.", reflection: "You do not carry yesterday into today. Every sunrise is a clean ledger. Whatever yesterday held, today is new mercy." },
  { date: "April 16", title: "Strength in Stillness", verse: "Isaiah 30:15", verseText: "In repentance and rest is your salvation, in quietness and trust is your strength.", reflection: "The world rewards noise and speed. God rewards stillness and trust. Find one quiet moment today and simply sit with Him." },
];

export default function DevotionsPage() {
  const today = devotions[0];
  const [selected, setSelected] = useState(today);

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/imagenesiacristianas-god-8585365_1920.jpg">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/80 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Daily Devotions</h1>
              <div className="w-16" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
              {devotions.map((d) => (
                <button key={d.date} onClick={() => setSelected(d)} className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition ${selected.date === d.date ? "bg-white text-purple-900" : "bg-white/20 text-white border border-white/30"}`}>{d.date}</button>
              ))}
            </div>
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-sm p-8">
              <p className="text-xs text-purple-400 uppercase tracking-widest mb-2">{selected.date}</p>
              <h2 className="text-2xl font-bold text-purple-900 mb-4">{selected.title}</h2>
              <div className="bg-purple-50 rounded-2xl p-4 mb-6">
                <p className="text-purple-800 italic mb-1">"{selected.verseText}"</p>
                <p className="text-xs text-purple-400">— {selected.verse}</p>
              </div>
              <p className="text-gray-600 leading-relaxed">{selected.reflection}</p>
            </div>
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
