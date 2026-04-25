"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/daniel-gimbel-F194iNxMrDk-unsplash.jpg";

type Mode = "trial" | "monthly" | "yearly";
type AuthView = "signin" | "signup";

export default function SubscribePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Auth form state
  const [pendingMode, setPendingMode] = useState<Mode | null>(null);
  const [authView, setAuthView] = useState<AuthView>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  async function startCheckout(mode: Mode, uid: string, userEmail: string) {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: uid, email: userEmail, mode }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  async function handleCheckout(mode: Mode) {
    if (user) {
      await startCheckout(mode, user.id, user.email);
      return;
    }
    // Not logged in — show auth form for this mode
    setPendingMode(mode);
  }

  async function handleGoogle() {
    if (!pendingMode) return;
    localStorage.setItem("subscribe_intent", pendingMode);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/subscribe`,
        queryParams: { prompt: "select_account" },
      },
    });
  }

  async function handleAuthSubmit() {
    if (!email || !password) return;
    setAuthLoading(true);
    setAuthError("");

    if (authView === "signup") {
      if (!name) { setAuthError("Please enter your name."); setAuthLoading(false); return; }
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      });
      if (error) { setAuthError(error.message); setAuthLoading(false); return; }
      // If auto-confirmed (no email confirmation required), proceed straight to checkout
      if (data.user && data.session) {
        await startCheckout(pendingMode!, data.user.id, data.user.email!);
      } else {
        setCheckEmail(true);
        setAuthLoading(false);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setAuthError(error.message); setAuthLoading(false); return; }
      await startCheckout(pendingMode!, data.user!.id, data.user!.email!);
    }
  }

  // After returning from OAuth or email confirmation, pick up the intent
  useEffect(() => {
    if (!loading && user && !pendingMode) {
      const intent = localStorage.getItem("subscribe_intent") as Mode | null;
      if (intent) {
        localStorage.removeItem("subscribe_intent");
        startCheckout(intent, user.id, user.email);
      }
    }
  }, [loading, user]);

  const modeLabel: Record<Mode, string> = {
    trial: "Start Free 3-Day Trial",
    monthly: "Subscribe — $2.99/mo",
    yearly: "Subscribe — $29.99/yr",
  };

  // Auth form shown when user clicks a button but isn't logged in
  if (pendingMode && !checkEmail) {
    return (
      <PageBackground url={BG}>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-sm w-full">
            <button onClick={() => { setPendingMode(null); setAuthError(""); }} className="text-white/50 text-sm mb-6 hover:text-white transition">← Back</button>

            <h2 className="text-2xl font-bold text-white mb-1 text-center" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
              {pendingMode === "trial" ? "Start Your Free Trial" : "Create Your Account"}
            </h2>
            <p className="text-white/50 text-sm text-center mb-6">
              {pendingMode === "trial" ? "No credit card required · Cancel anytime" : ""}
            </p>

            {/* Google sign-in */}
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium py-3 rounded-xl transition mb-4"
            >
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path fill="#fff" d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.1c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.4-10.5 7.4-17.5z"/>
                <path fill="#fff" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.7 42.9 14.8 48 24 48z"/>
                <path fill="#fff" d="M10.8 28.8c-.5-1.4-.7-2.8-.7-4.3s.3-3 .7-4.3v-6.2H2.7C1 17.4 0 20.6 0 24s1 6.6 2.7 9l8.1-4.2z"/>
                <path fill="#fff" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.5 0 24 0 14.8 0 6.7 5.1 2.7 12.8l8.1 4.2C12.7 13.6 17.9 9.5 24 9.5z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/15" />
              <span className="text-white/40 text-xs">or email</span>
              <div className="flex-1 h-px bg-white/15" />
            </div>

            {/* Sign in / Sign up toggle */}
            <div className="flex mb-4 bg-white/10 rounded-xl p-1">
              <button
                onClick={() => { setAuthView("signup"); setAuthError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${authView === "signup" ? "bg-white/20 text-white" : "text-white/50"}`}
              >
                Create Account
              </button>
              <button
                onClick={() => { setAuthView("signin"); setAuthError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${authView === "signin" ? "bg-white/20 text-white" : "text-white/50"}`}
              >
                Sign In
              </button>
            </div>

            <div className="space-y-3 mb-4">
              {authView === "signup" && (
                <input
                  type="text" placeholder="Your name" value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50"
                />
              )}
              <input
                type="email" placeholder="Email address" value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50"
              />
              <input
                type="password" placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAuthSubmit()}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50"
              />
            </div>

            {authError && <p className="text-red-300 text-sm mb-3 text-center">{authError}</p>}

            <button
              onClick={handleAuthSubmit}
              disabled={authLoading || !email || !password || (authView === "signup" && !name)}
              className="w-full bg-white/20 hover:bg-white/30 border border-white/40 text-white font-semibold py-4 rounded-xl transition disabled:opacity-40"
            >
              {authLoading ? "Please wait..." : modeLabel[pendingMode]}
            </button>
          </div>
        </main>
      </PageBackground>
    );
  }

  // "Check your email" screen
  if (checkEmail) {
    return (
      <PageBackground url={BG}>
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-sm w-full">
            <div className="text-5xl mb-4">📬</div>
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>Check Your Email</h2>
            <p className="text-white/60 text-sm mb-6">We sent a confirmation link to <span className="text-white">{email}</span>. Click it to activate your account, then come back here to start your trial.</p>
            <button
              onClick={() => { setCheckEmail(false); setAuthView("signin"); setPassword(""); }}
              className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-xl transition"
            >
              I've confirmed — Sign In
            </button>
          </div>
        </main>
      </PageBackground>
    );
  }

  // Main subscribe page
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

          <p className="text-white/40 text-xs">Already have an account? <button onClick={() => { setPendingMode("trial"); setAuthView("signin"); }} className="text-white/70 underline">Sign in</button></p>
        </div>
      </main>
    </PageBackground>
  );
}
