"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import { isSafe, MODERATION_ERROR } from "@/lib/moderation";
import PageBackground from "@/components/PageBackground";
import ShareButton from "@/components/ShareButton";

export default function TestimonyWallPage() {
  const [testimonies, setTestimonies] = useState<any[]>([]);
  const [story, setStory] = useState("");
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userHearts, setUserHearts] = useState<string[]>([]);
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata?.full_name || "Friend");
        supabase.from("testimony_hearts").select("testimony_id").eq("user_id", user.id).then(({ data }) => {
          if (data) setUserHearts(data.map((r: any) => r.testimony_id));
        });
        supabase.from("blocked_users").select("blocked_id").eq("blocker_id", user.id).then(({ data }) => {
          if (data) setBlockedIds(new Set(data.map((r: any) => r.blocked_id)));
        });
      }
    });
    loadTestimonies();
  }, []);

  async function loadTestimonies() {
    const { data } = await supabase.from("testimonies").select("*").order("created_at", { ascending: false });
    if (data) setTestimonies(data);
  }

  async function handleSubmit() {
    if (!story.trim() || !userId) return;
    if (!isSafe(story) || !isSafe(title)) { alert(MODERATION_ERROR); return; }
    setSubmitting(true);
    await supabase.from("testimonies").insert({ user_id: userId, user_name: userName, testimony_title: title, testimony_text: story });
    setStory(""); setTitle("");
    await loadTestimonies();
    setSubmitting(false);
  }

  async function handleHeart(id: string) {
    if (!userId) return;
    const current = testimonies.find(t => t.id === id)?.hearts_count || 0;
    if (userHearts.includes(id)) {
      await supabase.from("testimony_hearts").delete().eq("user_id", userId).eq("testimony_id", id);
      await supabase.from("testimonies").update({ hearts_count: Math.max(0, current - 1) }).eq("id", id);
      setUserHearts(h => h.filter(x => x !== id));
    } else {
      await supabase.from("testimony_hearts").insert({ user_id: userId, testimony_id: id });
      await supabase.from("testimonies").update({ hearts_count: current + 1 }).eq("id", id);
      setUserHearts(h => [...h, id]);
    }
    loadTestimonies();
  }

  function handleDownload() {
    const lines = testimonies.map((t) => {
      const titleLine = t.testimony_title ? `${t.testimony_title}\n` : "";
      const hearts = t.hearts_count > 0 ? ` [${t.hearts_count} ♡]` : "";
      return `${t.user_name}${hearts}\n${titleLine}${t.testimony_text}`;
    });
    const content = `Truth Testimonies — Guiding Grace\n${new Date().toLocaleDateString()}\n${"—".repeat(40)}\n\n${lines.join("\n\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "testimonies.txt";
    a.click();
    URL.revokeObjectURL(url);
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
      content_type: "testimony",
      content_id: contentId,
      content_text: contentText,
    });
    alert("Thank you — this has been reported for review.");
  }

  async function shareItem(t: any) {
    const titlePart = t.testimony_title ? `${t.testimony_title}: ` : "";
    const shareText = `"${titlePart}${t.testimony_text.slice(0, 200)}${t.testimony_text.length > 200 ? "..." : ""}" — ${t.user_name} | Guiding Grace`;
    if (navigator.share) {
      try { await navigator.share({ title: t.testimony_title || "Testimony", text: shareText, url: "https://guidinggrace.app/testimony-wall" }); } catch {}
    } else {
      await navigator.clipboard.writeText(`${shareText}\nhttps://guidinggrace.app/testimony-wall`);
    }
  }

  return (
    <SubscriptionGuard>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .tw-no-print { display: none !important; }
        }
      `}} />
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/faserra-beach-1578966_1920.jpg">
        <main className="flex-1 p-6 flex flex-col items-center">
          <div className="max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="tw-no-print text-white/70 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Truth Testimonies</h1>
              {/* Action toolbar */}
              <div className="tw-no-print flex items-center gap-1">
                <button
                  onClick={handleDownload}
                  title="Save as text file"
                  className="text-white/60 hover:text-white text-sm px-2 py-1.5 rounded-lg hover:bg-white/10 transition"
                >
                  💾
                </button>
                <ShareButton
                  title="Truth Testimonies"
                  text="Read powerful testimonies of what God has done — share yours on Guiding Grace."
                  url="https://guidinggrace.app/testimony-wall"
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
            <p className="text-center text-sm text-white/60 mb-8">Share what God has done. Your story is someone else&apos;s hope. ✨</p>

            {/* Submit form */}
            <div className="tw-no-print mb-8">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title (optional)" className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm mb-3 focus:outline-none focus:border-white/60" />
              <textarea value={story} onChange={e => setStory(e.target.value)} placeholder="Share your testimony..." className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:border-white/60 mb-3" rows={4} />
              <button onClick={handleSubmit} disabled={!story.trim() || submitting} className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40">
                {submitting ? "Sharing..." : "Share My Testimony ✨"}
              </button>
            </div>

            <div className="space-y-8">
              {testimonies.filter(t => !blockedIds.has(t.user_id)).map(t => (
                <div key={t.id}>
                  <p className="text-white/40 text-xs mb-1">{t.user_name}</p>
                  {t.testimony_title && <p className="font-semibold text-white mb-1" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>{t.testimony_title}</p>}
                  <p className="text-white text-sm leading-relaxed mb-2" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{t.testimony_text}</p>
                  <div className="tw-no-print flex items-center gap-4">
                    <button onClick={() => handleHeart(t.id)} className="flex items-center gap-1 text-sm">
                      <span>{userHearts.includes(t.id) ? "💜" : "🤍"}</span>
                      <span className="text-white/40 text-xs">{t.hearts_count || 0}</span>
                    </button>
                    <button
                      onClick={() => shareItem(t)}
                      className="text-xs text-white/40 hover:text-white/70 transition"
                    >
                      ↑ Share
                    </button>
                    {t.user_id !== userId && (
                      <button
                        onClick={() => handleBlock(t.user_id)}
                        className="text-xs text-white/30 hover:text-red-300 transition"
                      >
                        Block
                      </button>
                    )}
                    {t.user_id !== userId && (
                      <button
                        onClick={() => handleReport(t.id, t.testimony_text, t.user_id)}
                        className="text-xs text-white/30 hover:text-red-300 transition"
                      >
                        Report
                      </button>
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
