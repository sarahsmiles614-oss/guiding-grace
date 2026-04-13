"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";

export default function PrayerWallPage() {
  const [prayers, setPrayers] = useState<any[]>([]);
  const [request, setRequest] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) { setUserId(user.id); setUserName(user.user_metadata?.full_name || "Friend"); }
    });
    loadPrayers();
  }, []);

  async function loadPrayers() {
    const { data } = await supabase.from("prayer_requests").select("*").order("created_at", { ascending: false });
    if (data) setPrayers(data);
  }

  async function handleSubmit() {
    if (!request.trim() || !userId) return;
    setSubmitting(true);
    await supabase.from("prayer_requests").insert({ user_id: userId, user_name: anonymous ? "Anonymous" : userName, prayer_text: request, is_private: anonymous });
    setRequest("");
    await loadPrayers();
    setSubmitting(false);
  }

  async function handlePrayed(id: string, current: number) {
    await supabase.from("prayer_requests").update({ prayer_count: current + 1 }).eq("id", id);
    loadPrayers();
  }

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/imagenesiacristianas-ai-generated-8762262.jpg">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/70 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>P.U.S.H. Prayer Wall</h1>
              <div className="w-16" />
            </div>
            <p className="text-center text-xs text-white/50 mb-8 uppercase tracking-widest">Pray Until Something Happens</p>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 mb-8 border border-white/20">
              <textarea value={request} onChange={e => setRequest(e.target.value)} placeholder="Share your prayer request..." className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:border-white/60 mb-3" rows={3} />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                  <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} className="accent-white" />
                  Post anonymously
                </label>
                <button onClick={handleSubmit} disabled={!request.trim() || submitting} className="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-semibold px-6 py-2 rounded-xl transition disabled:opacity-40">
                  {submitting ? "Posting..." : "Post 🙏"}
                </button>
              </div>
            </div>
            <div className="space-y-6">
              {prayers.map(p => (
                <div key={p.id}>
                  <p className="text-white/40 text-xs mb-1">{p.user_name}</p>
                  <p className="text-white/90 text-sm mb-2" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{p.prayer_text}</p>
                  <button onClick={() => handlePrayed(p.id, p.prayer_count || 0)} className="text-xs text-white/50 hover:text-white/80 transition">
                    🙏 I prayed for this {p.prayer_count > 0 ? `· ${p.prayer_count}` : ""}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
