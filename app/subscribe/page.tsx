"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/jensphotography-beach-7239311_1920.jpg";

export default function SubscribePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  async function handleSubscribe() {
    setChecking(true);

    // Not signed in — save intent and go to Google OAuth
    if (!user) {
      localStorage.setItem("subscribe_intent", "true");
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/subscribe` },
      });
      return;
    }

    // Signed in — create Stripe checkout session
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Could not start checkout. Please try again.");
        setChecking(false);
      }
    } catch (e) {
      alert("Something went wrong. Please try again.");
      setChecking(false);
    }
  }

  // After OAuth redirect back — auto-trigger checkout if intent was set
  useEffect(() => {
    if (!loading && user && localStorage.getItem("subscribe_intent")) {
      localStorage.removeItem("subscribe_intent");
      handleSubscribe();
    }
  }, [loading, user]);

  return (
    <PageBackground url={BG}>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>Guiding Grace</h1>
          <p className="text-white/60 mb-10">Your daily faith companion</p>

          <p className="text-5xl font-bold text-white mb-1" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>$2.99<span className="text-2xl font-normal">/mo</span></p>
          <p className="text-white/50 text-sm mb-1">or $29.99/year — save 16%</p>
          <p className="text-white/70 text-sm mb-10">✨ 3-day free trial · No credit card required</p>

          <div className="grid grid-cols-2 gap-2 mb-10 text-left">
            {["Daily Devotions","His Promises","Shame Recycle Bin","Heaven's Hearts","Nightly Reflections","Heroes & Villains","P.U.S.H. Prayer Wall","Truth Testimonies","Daily Grace Challenge"].map(f => (
              <p key={f} className="text-white/70 text-sm flex items-center gap-2"><span className="text-white/40">✓</span>{f}</p>
            ))}
          </div>

          <button
            onClick={handleSubscribe}
            disabled={checking}
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur border border-white/40 text-white font-semibold py-4 rounded-xl transition disabled:opacity-60 text-lg mb-4"
          >
            {checking ? "Please wait..." : "Start Free Trial"}
          </button>

          <p className="text-white/40 text-xs">Already have an account? <a href="/dashboard" className="text-white/70 underline">Sign in</a></p>
        </div>
      </main>
    </PageBackground>
  );
}
