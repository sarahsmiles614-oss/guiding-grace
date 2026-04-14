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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) { setUserId(user.id); setUserName(user.user_metadata?.full_name || "Friend"); }
    });
    loadPrayers();
  }, []);

  async function loadPrayers() {
    const { data } = await supabase
      .from("prayer_requests")
      .select("*")
      .eq("is_private", false)
      .order("created_at", { ascending: false });
    if (data) setPrayers(data);
  }

  async function handleSubmit() {
    if (!request.trim() || !userId) return;
    setSubmitting(true);
    await supabase.from("prayer_requests").insert({
      user_id: userId,
      user_name: anonymous ? "Anonymous" : userName,
      prayer_text: request,
      is_private: anonymous,
      prayer_count: 0,
      is_answered: false,
    });
    setRequest("");
    await loadPrayers();
    setSubmitting(false);
  }

  async function handlePrayed(id: string, current: number) {
    await supabase.from("prayer_requests").update({ prayer_count: (current || 0) + 1 }).eq("id", id);
    setPrayers((prev) => prev.map((p) => p.id === id ? { ...p, prayer_count: (p.prayer_count || 0) + 1 } : p));
  }

  async function handleToggleAnswered(id: string, current: boolean) {
    await supabase.from("prayer_requests").update({ is_answered: !current }).eq("id", id);
    setPrayers((prev) => prev.map((p) => p.id === id ? { ...p, is_answered: !current } : p));
  }

  async function handleEdit(id: string) {
    if (!editText.trim()) return;
    await supabase.from("prayer_requests").update({ prayer_text: editText }).eq("id", id);
    setPrayers((prev) => prev.map((p) => p.id === id ? { ...p, prayer_text: editText } : p));
    setEditingId(null);
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

            {/* Submit form */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 mb-8 border border-white/20">
              <textarea
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="Share your prayer request..."
                className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:border-white/60 mb-3"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                  <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="accent-white" />
                  Post anonymously
                </label>
                <button
                  onClick={handleSubmit}
                  disabled={!request.trim() || submitting}
                  className="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-semibold px-6 py-2 rounded-xl transition disabled:opacity-40"
                >
                  {submitting ? "Posting..." : "Post 🙏"}
                </button>
              </div>
            </div>

            {/* Prayer list */}
            <div className="space-y-6">
              {prayers.map((p) => (
                <div key={p.id} className={`${p.is_answered ? "opacity-60" : ""}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-white/40 text-xs">{p.user_name}</p>
                    {p.is_answered && <span className="text-xs text-green-400 font-semibold">✓ Answered</span>}
                  </div>

                  {editingId === p.id ? (
                    <div className="mb-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-white/60 mb-2"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(p.id)} className="text-xs text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-xs text-white/50 hover:text-white">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white/90 text-sm mb-2" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{p.prayer_text}</p>
                  )}

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handlePrayed(p.id, p.prayer_count || 0)}
                      className="text-xs text-white/50 hover:text-white/80 transition"
                    >
                      🙏 I prayed for this{p.prayer_count > 0 ? ` · ${p.prayer_count}` : ""}
                    </button>

                    {/* Own prayer actions */}
                    {p.user_id === userId && editingId !== p.id && (
                      <>
                        <button
                          onClick={() => { setEditingId(p.id); setEditText(p.prayer_text); }}
                          className="text-xs text-white/40 hover:text-white/70 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleAnswered(p.id, p.is_answered)}
                          className="text-xs text-white/40 hover:text-white/70 transition"
                        >
                          {p.is_answered ? "Unmark answered" : "Mark answered ✓"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
