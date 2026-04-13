"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";
import { supabase } from "@/lib/supabase";

export default function DevotionsPage() {
  const [devotions, setDevotions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("daily_devotions")
        .select("*")
        .order("devotion_date", { ascending: false })
        .limit(30);
      if (data && data.length > 0) {
        setDevotions(data);
        setSelected(data[0]);
      }
      setLoading(false);
    }
    load();
  }, []);

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/imagenesiacristianas-god-8585365_1920.jpg">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/70 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Daily Devotions</h1>
              <div className="w-16" />
            </div>

            {loading ? (
              <p className="text-white/60 text-center py-12">Loading...</p>
            ) : devotions.length === 0 ? (
              <p className="text-white/60 text-center py-12">No devotions yet. Check back at 7am. 🌅</p>
            ) : (
              <>
                <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
                  {devotions.map((d) => (
                    <button key={d.id} onClick={() => setSelected(d)} className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition ${selected?.id === d.id ? "bg-white/30 text-white" : "text-white/60 hover:text-white"}`}>
                      {formatDate(d.devotion_date)}
                    </button>
                  ))}
                </div>

                {selected && (
                  <>
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-2">{formatDate(selected.devotion_date)}</p>
                    <h2 className="text-3xl font-bold text-white mb-6" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)", fontFamily: "'Playfair Display', Georgia, serif" }}>{selected.title}</h2>
                    <p className="text-white/90 italic text-lg mb-2" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>"{selected.verse_text}"</p>
                    <p className="text-white/50 text-sm mb-8">— {selected.verse_reference}</p>
                    <p className="text-white/80 leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{selected.reflection}</p>
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
