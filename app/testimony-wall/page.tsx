"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";

export default function TestimonyWallPage() {
  const [testimonies, setTestimonies] = useState<any[]>([]);
  const [story, setStory] = useState("");
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userHearts, setUserHearts] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata?.full_name || "Friend");
        supabase.from("testimony_hearts").select("testimony_id").eq("user_id", user.id).then(({ data }) => {
          if (data) setUserHearts(data.map((r: any) => r.testimony_id));
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

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/faserra-beach-1578966_1920.jpg">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/70 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Truth Testimonies</h1>
              <div className="w-16" />
            </div>
            <p className="text-center text-sm text-white/60 mb-8">Share what God has done. Your story is someone else's hope. ✨</p>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 mb-8 border border-white/20">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title (optional)" className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm mb-3 focus:outline-none focus:border-white/60" />
              <textarea value={story} onChange={e => setStory(e.target.value)} placeholder="Share your testimony..." className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:border-white/60 mb-3" rows={4} />
              <button onClick={handleSubmit} disabled={!story.trim() || submitting} className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40">
                {submitting ? "Sharing..." : "Share My Testimony ✨"}
              </button>
            </div>
            <div className="space-y-8">
              {testimonies.map(t => (
                <div key={t.id}>
                  <p className="text-white/40 text-xs mb-1">{t.user_name}</p>
                  {t.testimony_title && <p className="font-semibold text-white mb-1" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>{t.testimony_title}</p>}
                  <p className="text-white/80 text-sm leading-relaxed mb-2" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{t.testimony_text}</p>
                  <button onClick={() => handleHeart(t.id)} className="flex items-center gap-1 text-sm">
                    <span>{userHearts.includes(t.id) ? "💜" : "🤍"}</span>
                    <span className="text-white/40 text-xs">{t.hearts_count || 0}</span>
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
