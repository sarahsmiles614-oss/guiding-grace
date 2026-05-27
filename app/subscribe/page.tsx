"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/daniel-gimbel-F194iNxMrDk-unsplash.jpg";
type Mode = "trial" | "monthly" | "yearly";

export default function SubscribePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Auth form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user;
      if (u?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        window.location.href = "/dashboard";
        return;
      }
      if (u) {
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("status, trial_end_date")
          .eq("user_id", u.id)
          .single();
        const isActive = sub?.status === "active";
        const isTrialing = sub?.status === "trialing" && sub?.trial_end_date && new Date(sub.trial_end_date) > new Date();
        if (isActive || isTrialing) {
          window.location.href = "/dashboard";
          return;
        }
      }
      setUser(u);
      setLoading(false);
    });
  }, []);

  // After Google OAuth redirect back here, pick up the intent
  useEffect(() => {
    if (!loading && user) {
      const intent = localStorage.getItem("subscribe_intent") as Mode | null;
      if (intent) {
        localStorage.removeItem("subscribe_intent");
        goCheckout(intent, user.id, user.email);
      }
    }
  }, [loading, user]);

  async function goCheckout(mode: Mode, uid: string, userEmail: string) {
    setBusy(true);
    setAuthError("");
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, email: userEmail, mode }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setAuthError(data.error || "Something went wrong. Please try again.");
        setBusy(false);
      }
    } catch {
      setAuthError("Network error. Please check your connection and try again.");
      setBusy(false);
    }
  }

  async function handleGoogle(mode: Mode) {
    localStorage.setItem("subscribe_intent", mode);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/subscribe` },
    });
  }

  async function handleApple(mode: Mode) {
    localStorage.setItem("subscribe_intent", mode);
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/subscribe` },
    });
  }

  async function handleTrial() {
    if (user) { goCheckout("trial", user.id, user.email); return; }
    if (!name || !email || !password) { setAuthError("Please fill in all fields to start your trial."); return; }
    setBusy(true); setAuthError("");
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    });
    if (error) { setAuthError(error.message); setBusy(false); return; }
    if (data.user && data.session) {
      await goCheckout("trial", data.user.id, data.user.email!);
    } else {
      setCheckEmail(true); setBusy(false);
    }
  }

  async function handlePaid(mode: "monthly" | "yearly") {
    if (user) { goCheckout(mode, user.id, user.email); return; }
    if (!name || !email || !password) { setAuthError("Please fill in all fields below first."); return; }
    setBusy(true); setAuthError("");
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    });
    if (error) { setAuthError(error.message); setBusy(false); return; }
    if (data.user && data.session) {
      await goCheckout(mode, data.user.id, data.user.email!);
    } else {
      setCheckEmail(true); setBusy(false);
    }
  }

  if (loading) return (
    <PageBackground url={BG}>
      <main className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      </main>
    </PageBackground>
  );

  if (checkEmail) {
    return (
      <PageBackground url={BG}>
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-sm w-full">
            <div className="text-5xl mb-4">📬</div>
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
              Check Your Email
            </h2>
            <p className="text-white/60 text-sm mb-6">
              We sent a confirmation link to <span className="text-white">{email}</span>.<br />
              Click it, then come back and sign in below.
            </p>
            <button
              onClick={() => { setCheckEmail(false); setPassword(""); }}
              className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-xl transition"
            >
              OK, I confirmed my email
            </button>
          </div>
        </main>
      </PageBackground>
    );
  }

  return (
    <PageBackground url={BG}>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md md:max-w-xl w-full text-center">
          <h1 className="text-4xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>Guiding Grace</h1>
          <p className="text-white mb-8 text-sm" style={{textShadow:"0 1px 6px rgba(0,0,0,0.9)"}}>Your daily faith companion</p>

          <div className="grid grid-cols-2 gap-1.5 mb-8 text-left">
            {[
              "Daily Devotions",
              "Bible in 365 Days",
              "Canonical Reading Plan",
              "Chronological Reading Plan",
              "Bible Study Journal",
              "Dive Deeper Journal",
              "His Promises",
              "Daily Grace Challenge",
              "P.U.S.H. Prayer Wall",
              "Heaven's Hearts",
              "Nightly Reflections",
              "Heroes & Villains",
              "Shame Recycle Bin",
              "Scripture Match Game",
              "Study Groups",
              "Grace Connections",
            ].map(f => (
              <p key={f} className="text-white text-xs flex items-center gap-1.5" style={{textShadow:"0 1px 6px rgba(0,0,0,0.9)"}}><span className="text-green-400 text-xs">✓</span>{f}</p>
            ))}
          </div>

          {/* If logged in — just show pricing */}
          {user ? (
            <div className="space-y-3">
              <button onClick={() => goCheckout("trial", user.id, user.email)} disabled={busy} className="w-full bg-white/20 hover:bg-white/30 backdrop-blur border border-white/40 text-white font-semibold py-4 rounded-xl transition text-lg disabled:opacity-50">
                {busy ? "Loading..." : "✨ Start Free 3-Day Trial"}
              </button>
              <p className="text-white/40 text-xs">No credit card required · Cancel anytime</p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => goCheckout("monthly", user.id, user.email)} disabled={busy} className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium py-3 rounded-xl transition disabled:opacity-50">
                  <p className="text-lg font-bold">$2.99</p><p className="text-xs text-white/60">per month</p>
                </button>
                <button onClick={() => goCheckout("yearly", user.id, user.email)} disabled={busy} className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium py-3 rounded-xl transition disabled:opacity-50">
                  <p className="text-lg font-bold">$29.99</p><p className="text-xs text-white/60">per year · save 16%</p>
                </button>
              </div>
            </div>
          ) : (
            /* Not logged in — sign-up form + trial button all in one */
            <div>
              <button onClick={() => handleApple("trial")} disabled={busy} className="w-full flex items-center justify-center gap-3 bg-black hover:bg-black/80 border border-white/20 text-white font-medium py-3 rounded-xl transition mb-2">
                <svg width="16" height="16" viewBox="0 0 814 1000" fill="white"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.3-150.3-97.8C27.5 780.6 0 682 0 583.5c0-217.8 141.4-333.1 280.4-333.1 74.9 0 137.2 49.3 184.1 49.3 44.9 0 115.2-52.1 201.7-52.1zm-181.6-175.3c33.2-39.5 56.5-94.2 56.5-148.9 0-7.7-.6-15.4-1.9-21.7-53.7 2-116.4 35.9-154.2 80.1-29.9 33.8-57.9 88.4-57.9 143.8 0 8.3 1.3 16.6 1.9 19.2 3.2.6 8.4 1.3 13.6 1.3 48.1 0 108.8-32.5 142-73.8z"/></svg>
                Sign in with Apple → Free Trial
              </button>
              <button onClick={() => handleGoogle("trial")} disabled={busy} className="w-full flex items-center justify-center gap-3 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-medium py-3 rounded-xl transition mb-3">
                <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#fff" d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.1c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.4-10.5 7.4-17.5z"/><path fill="#fff" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.7 42.9 14.8 48 24 48z"/><path fill="#fff" d="M10.8 28.8c-.5-1.4-.7-2.8-.7-4.3s.3-3 .7-4.3v-6.2H2.7C1 17.4 0 20.6 0 24s1 6.6 2.7 9l8.1-4.2z"/><path fill="#fff" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.5 0 24 0 14.8 0 6.7 5.1 2.7 12.8l8.1 4.2C12.7 13.6 17.9 9.5 24 9.5z"/></svg>
                Continue with Google → Free Trial
              </button>

              {authError && <p className="text-red-300 text-sm mb-3">{authError}</p>}

              <p className="text-white/35 text-xs mb-5">No credit card required · Cancel anytime</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <button onClick={() => handleGoogle("monthly")} disabled={busy} className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium py-3 rounded-xl transition disabled:opacity-50">
                  <p className="text-lg font-bold">$2.99</p><p className="text-xs text-white/60">per month</p>
                </button>
                <button onClick={() => handleGoogle("yearly")} disabled={busy} className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium py-3 rounded-xl transition disabled:opacity-50">
                  <p className="text-lg font-bold">$29.99</p><p className="text-xs text-white/60">per year · save 16%</p>
                </button>
              </div>

            </div>
          )}
        </div>
      </main>
    </PageBackground>
  );
}
