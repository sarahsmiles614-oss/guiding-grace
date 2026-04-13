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
              <Link href="/dashboard" className="text-white/80 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>P.U.S.H. Prayer Wall</h1>
              <div className="w-16" />
            </div>
            <p className="text-center text-xs text-white/60 mb-6 uppercase tracking-widest">Pray Until Something Happens</p>
            <div className="bg-white/90 backdrop-blur rounded-2xl p-6 mb-6">
              <textarea value={request} onChange={e => setRequest(e.target.value)} placeholder="Share your prayer request..." className="w-full border border-purple-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 mb-3" rows={3} />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                  <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} className="accent-purple-600" />
                  Post anonymously
                </label>
                <button onClick={handleSubmit} disabled={!request.trim() || submitting} className="bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold px-6 py-2 rounded-xl transition disabled:opacity-40">
                  {submitting ? "Posting..." : "Post 🙏"}
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {prayers.map(p => (
                <div key={p.id} className="bg-white/90 backdrop-blur rounded-2xl p-5">
                  <p className="text-xs text-purple-400 mb-1">{p.user_name}</p>
                  <p className="text-gray-700 text-sm mb-3">{p.prayer_text}</p>
                  <button onClick={() => handlePrayed(p.id, p.prayer_count || 0)} className="text-xs text-purple-600 hover:text-purple-800 transition">
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
