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
              <Link href="/dashboard" className="text-white/70 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Heaven's Hearts</h1>
              <div className="w-16" />
            </div>
            <p className="text-white/60 text-sm text-center mb-8">Honor someone who has gone before you. Their light still shines. 💜</p>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 mb-10 border border-white/20">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Their name" className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm mb-3 focus:outline-none focus:border-white/60" />
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="A memory, a tribute, or simply their name in love..." className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:border-white/60 mb-3" rows={3} />
              <button onClick={handleSubmit} disabled={!name.trim() || submitting} className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40">
                {submitting ? "Adding..." : "Light a Candle 🕯️"}
              </button>
            </div>
            <div className="space-y-6">
              {memorials.map((m) => (
                <div key={m.id}>
                  <p className="text-white font-semibold" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>🕯️ {m.name}</p>
                  {m.message && <p className="text-white/70 text-sm mt-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{m.message}</p>}
                </div>
              ))}
            </div>
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
