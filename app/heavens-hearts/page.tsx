"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";

export default function HeavensHeartsPage() {
  const [memorials, setMemorials] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id); });
    loadMemorials();
  }, []);

  async function loadMemorials() {
    const { data } = await supabase.from("memorials").select("*").order("created_at", { ascending: false });
    if (data) setMemorials(data);
  }

  async function handleSubmit() {
    if (!name.trim() || !userId) return;
    setSubmitting(true);
    await supabase.from("memorials").insert({ user_id: userId, name, message });
    setName(""); setMessage("");
    await loadMemorials();
    setSubmitting(false);
  }

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/geralt-heaven-3335585_1920.jpg">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/80 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Heaven's Hearts</h1>
              <div className="w-16" />
            </div>
            <p className="text-white/80 text-sm text-center mb-6">Honor someone who has gone before you. Their light still shines. 💜</p>
            <div className="bg-white/90 backdrop-blur rounded-2xl p-6 mb-6">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Their name" className="w-full border border-purple-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-purple-300" />
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="A memory, a tribute, or simply their name in love..." className="w-full border border-purple-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 mb-3" rows={3} />
              <button onClick={handleSubmit} disabled={!name.trim() || submitting} className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40">
                {submitting ? "Adding..." : "Light a Candle 🕯️"}
              </button>
            </div>
            <div className="space-y-4">
              {memorials.map((m) => (
                <div key={m.id} className="bg-white/90 backdrop-blur rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-2"><span className="text-xl">🕯️</span><span className="font-semibold text-purple-900">{m.name}</span></div>
                  {m.message && <p className="text-gray-600 text-sm">{m.message}</p>}
                </div>
              ))}
            </div>
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
