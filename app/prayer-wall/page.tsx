"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";
import ShareButton from "@/components/ShareButton";

export default function PrayerWallPage() {
  const [prayers, setPrayers] = useState<any[]>([]);
  const [request, setRequest] = useState("");
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

  async function handleDelete(id: string) {
    await supabase.from("prayer_requests").delete().eq("id", id);
    setPrayers((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleEdit(id: string) {
    if (!editText.trim()) return;
    await supabase.from("prayer_requests").update({ prayer_text: editText }).eq("id", id);
    setPrayers((prev) => prev.map((p) => p.id === id ? { ...p, prayer_text: editText } : p));
    setEditingId(null);
  }

  function handleDownload() {
    const lines = prayers.map((p) => {
      const answered = p.is_answered ? " ✓ Answered" : "";
      const count = p.prayer_count > 0 ? ` [${p.prayer_count} praying]` : "";
      return `${answered}${count}\n${p.prayer_text}`.trim();
    });
    const content = `P.U.S.H. Prayer Wall — Guiding Grace\n${new Date().toLocaleDateString()}\n${"—".repeat(40)}\n\n${lines.join("\n\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prayer-wall.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function shareItem(text: string) {
    const shareText = `"${text}" | Pray with us on Guiding Grace`;
    if (navigator.share) {
      try { await navigator.share({ title: "Prayer Request", text: shareText, url: "https://guidinggrace.app/prayer-wall" }); } catch {}
    } else {
      await navigator.clipboard.writeText(`${shareText}\nhttps://guidinggrace.app/prayer-wall`);
    }
  }

  return (
    <SubscriptionGuard>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .pw-no-print { display: none !important; }
          .pw-print-header { display: block !important; margin-bottom: 16px; }
        }
      `}} />
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/imagenesiacristianas-ai-generated-8762262.jpg">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="pw-no-print text-white/70 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>P.U.S.H. Prayer Wall</h1>
              {/* Action toolbar */}
              <div className="pw-no-print flex items-center gap-1">
                <button
                  onClick={handleDownload}
                  title="Save as text file"
                  className="text-white/60 hover:text-white text-sm px-2 py-1.5 rounded-lg hover:bg-white/10 transition"
                >
                  💾
                </button>
                <ShareButton
                  title="P.U.S.H. Prayer Wall"
                  text="Join me in prayer on Guiding Grace — Pray Until Something Happens."
                  url="https://guidinggrace.app/prayer-wall"
                  label="↑"
                  className="text-white/60 hover:text-white text-sm px-2 py-1.5 rounded-lg hover:bg-white/10 transition"
                />
                <button
                  onClick={() => window.print()}
                  title="Print"
                  className="text-white/60 hover:text-white text-sm px-2 py-1.5 rounded-lg hover:bg-white/10 transition"
                >
                  🖨️
                </button>
              </div>
            </div>
            <p className="text-center text-xs text-white/50 mb-8 uppercase tracking-widest">Pray Until Something Happens</p>

            {/* Submit form */}
            <div className="pw-no-print mb-8">
              <textarea
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="Share your prayer request..."
                className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:border-white/60 mb-3"
                rows={3}
              />
              <div className="flex justify-end">
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
                  {p.is_answered && (
                    <div className="mb-1">
                      <span className="text-xs text-green-400 font-semibold">✓ Answered</span>
                    </div>
                  )}

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

                  <div className="pw-no-print flex items-center gap-4">
                    <button
                      onClick={() => handlePrayed(p.id, p.prayer_count || 0)}
                      className="text-xs text-white/50 hover:text-white/80 transition"
                    >
                      🙏 I prayed for this{p.prayer_count > 0 ? ` · ${p.prayer_count}` : ""}
                    </button>

                    <button
                      onClick={() => shareItem(p.prayer_text)}
                      className="text-xs text-white/40 hover:text-white/70 transition"
                    >
                      ↑ Share
                    </button>

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
                        <button
                          onClick={() => { if (confirm("Remove this prayer?")) handleDelete(p.id); }}
                          className="text-xs text-red-400/50 hover:text-red-300 transition"
                        >
                          Remove
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
