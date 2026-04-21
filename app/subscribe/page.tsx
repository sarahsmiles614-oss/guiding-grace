"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/daniel-gimbel-F194iNxMrDk-unsplash.jpg";

export default function SubscribePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  async function handleCheckout(mode: "trial" | "monthly" | "yearly") {
    if (!user) {
      localStorage.setItem("subscribe_intent", mode);
      router.push("/");
      return;
    }
    router.push(`/checkout?mode=${mode}`);
  }

  // After returning from sign-in, auto-resume checkout
  useEffect(() => {
    if (!loading && user) {
      const intent = localStorage.getItem("subscribe_intent");
      if (intent) {
        localStorage.removeItem("subscribe_intent");
        router.push(`/checkout?mode=${intent}`);
      }
    }
  }, [loading, user]);

  return (
    <PageBackground url={BG}>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>Guiding Grace</h1>
          <p className="text-white/60 mb-10">Your daily faith companion</p>

          <div className="grid grid-cols-2 gap-2 mb-10 text-left">
            {["Daily Devotions","His Promises","Shame Recycle Bin","Heaven's Hearts","Nightly Reflections","Heroes & Villains","P.U.S.H. Prayer Wall","Truth Testimonies","Daily Grace Challenge"].map(f => (
              <p key={f} className="text-white/70 text-sm flex items-center gap-2"><span className="text-white/40">✓</span>{f}</p>
            ))}
          </div>

          <button onClick={() => handleCheckout("trial")} className="w-full bg-white/20 hover:bg-white/30 backdrop-blur border border-white/40 text-white font-semibold py-4 rounded-xl transition text-lg mb-3">
            ✨ Start Free 3-Day Trial
          </button>
          <p className="text-white/40 text-xs mb-6">No credit card required · Cancel anytime</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => handleCheckout("monthly")} className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium py-3 rounded-xl transition">
              <p className="text-lg font-bold">$2.99</p>
              <p className="text-xs text-white/60">per month</p>
            </button>
            <button onClick={() => handleCheckout("yearly")} className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium py-3 rounded-xl transition">
              <p className="text-lg font-bold">$29.99</p>
              <p className="text-xs text-white/60">per year · save 16%</p>
            </button>
          </div>

          <p className="text-white/40 text-xs">Already have an account? <a href="/" className="text-white/70 underline">Sign in</a></p>
        </div>
      </main>
    </PageBackground>
  );
}
