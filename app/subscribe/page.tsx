"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";

export default function SubscribePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/"); return; }
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, email: user.email }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setLoading(false);
  }

  return (
    <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/jensphotography-beach-7239311_1920.jpg">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>Guiding Grace</h1>
          <p className="text-white/60 mb-10">Your daily faith companion</p>
          <p className="text-5xl font-bold text-white mb-1" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>$2.99<span className="text-2xl font-normal">/mo</span></p>
          <p className="text-white/50 text-sm mb-1">or $29.99/year — save 16%</p>
          <p className="text-white/70 text-sm mb-10">✨ 3-day free trial · No credit card required</p>
          <div className="grid grid-cols-2 gap-2 mb-10 text-left">
            {["Daily Devotions","His Promises","Shame Recycle Bin","Heaven's Hearts","Nightly Reflections","Heroes & Villains","P.U.S.H. Prayer Wall","Truth Testimonies Wall","Daily Grace Challenge"].map(f => (
              <p key={f} className="text-white/70 text-sm flex items-center gap-2"><span className="text-white/40">✓</span>{f}</p>
            ))}
          </div>
          <button onClick={handleSubscribe} disabled={loading} className="w-full bg-white/20 hover:bg-white/30 backdrop-blur border border-white/40 text-white font-semibold py-4 rounded-xl transition disabled:opacity-60 text-lg mb-4">
            {loading ? "Redirecting..." : "Start Free Trial"}
          </button>
          <p className="text-white/40 text-xs">Already have an account? <a href="/" className="text-white/70 underline">Sign in</a></p>
        </div>
      </main>
    </PageBackground>
  );
}
