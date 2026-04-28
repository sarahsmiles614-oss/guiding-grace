"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import { isSafe, MODERATION_ERROR } from "@/lib/moderation";
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
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata?.full_name || "Friend");
        supabase.from("blocked_users").select("blocked_id").eq("blocker_id", user.id).then(({ data }) => {
          if (data) setBlockedIds(new Set(data.map((r: any) => r.blocked_id)));
        });
      }
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
    if (!isSafe(request)) { alert(MODERATION_ERROR); return; }
    setSubmitting(true);
    await supabase.from("prayer_requests").insert({
      user_id: userId,
      user_name: userName,
      prayer_text: request,
      is_private: false,
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

  async function handleBlock(blockedUserId: string) {
    if (!userId || !confirm("Block this user? Their posts will no longer appear for you.")) return;
    await supabase.from("blocked_users").insert({ blocker_id: userId, blocked_id: blockedUserId });
    setBlockedIds(prev => new Set([...prev, blockedUserId]));
  }

  async function handleReport(contentId: string, contentText: string, reportedUserId: string) {
    if (!userId || !confirm("Report this content as inappropriate?")) return;
    await supabase.from("content_reports").insert({
      reporter_id: userId,
      reported_user_id: reportedUserId,
      content_type: "prayer",
      content_id: contentId,
      content_text: contentText,
    });
    alert("Thank you — this has been reported for review.");
  }

  async function handleDelete(id: string) {
    await supabase.from("prayer_requests").delete().eq("id", id);
    setPrayers((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleEdit(id: string) {
    if (!editText.trim()) return;
    if (!isSafe(editText)) { alert(MODERATION_ERROR); return; }
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
        <main className="flex-1 flex flex-col p-6 overflow-hidden" style={{ height: "100dvh" }}>
          <div className="max-w-2xl mx-auto w-full flex flex-col flex-1 overflow-hidden">
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
            <div className="flex-1 overflow-y-auto space-y-10 pr-1"
              style={{ scrollbarWidth: "none" }}>
              {prayers.filter(p => !blockedIds.has(p.user_id)).map((p) => (
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

                  <div className="pw-no-print flex items-center flex-wrap gap-2 mt-1">
                    <button
                      onClick={() => handlePrayed(p.id, p.prayer_count || 0)}
                      className="inline-flex items-center gap-1 text-xs text-white font-medium bg-white/15 hover:bg-white/25 border border-white/20 px-3 py-1 rounded-full transition"
                    >
                      🙏 Prayed{p.prayer_count > 0 ? ` · ${p.prayer_count}` : ""}
                    </button>

                    <button
                      onClick={() => shareItem(p.prayer_text)}
                      className="inline-flex items-center gap-1 text-xs text-white font-medium bg-white/15 hover:bg-white/25 border border-white/20 px-3 py-1 rounded-full transition"
                    >
                      ↑ Share
                    </button>

                    {p.user_id !== userId && (
                      <button
                        onClick={() => handleBlock(p.user_id)}
                        className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white font-medium bg-white/10 hover:bg-red-500/20 border border-white/15 hover:border-red-400/30 px-3 py-1 rounded-full transition"
                      >
                        Block
                      </button>
                    )}
                    {p.user_id !== userId && (
                      <button
                        onClick={() => handleReport(p.id, p.prayer_text, p.user_id)}
                        className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white font-medium bg-white/10 hover:bg-red-500/20 border border-white/15 hover:border-red-400/30 px-3 py-1 rounded-full transition"
                      >
                        Report
                      </button>
                    )}

                    {p.user_id === userId && editingId !== p.id && (
                      <>
                        <button
                          onClick={() => { setEditingId(p.id); setEditText(p.prayer_text); }}
                          className="inline-flex items-center gap-1 text-xs text-white font-medium bg-white/15 hover:bg-white/25 border border-white/20 px-3 py-1 rounded-full transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleAnswered(p.id, p.is_answered)}
                          className="inline-flex items-center gap-1 text-xs text-white font-medium bg-white/15 hover:bg-white/25 border border-white/20 px-3 py-1 rounded-full transition"
                        >
                          {p.is_answered ? "Unmark answered" : "Mark answered ✓"}
                        </button>
                        <button
                          onClick={() => { if (confirm("Remove this prayer?")) handleDelete(p.id); }}
                          className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white font-medium bg-white/10 hover:bg-red-500/20 border border-white/15 hover:border-red-400/30 px-3 py-1 rounded-full transition"
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
