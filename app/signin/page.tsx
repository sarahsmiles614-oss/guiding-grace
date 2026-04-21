"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [isNewUser, setIsNewUser] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push("/dashboard");
    });
  }, [router]);

  function reset() { setError(""); setSuccess(""); }

  function getCallbackUrl() {
    const hasIntent = typeof window !== "undefined" && localStorage.getItem("subscribe_intent");
    const next = hasIntent ? "/subscribe" : "/dashboard";
    return `${window.location.origin}/auth/callback?next=${next}`;
  }

  async function handleGoogle() {
    setLoading(true); reset();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: getCallbackUrl() },
    });
  }

  async function handleFacebook() {
    setLoading(true); reset();
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: getCallbackUrl() },
    });
  }

  async function handleEmailSubmit() {
    if (!email || !password || (isNewUser && !name)) return;
    setLoading(true); reset();
    const dest = localStorage.getItem("subscribe_intent") ? "/subscribe" : "/dashboard";

    if (isNewUser) {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) { setError(error.message); setLoading(false); }
      else { setSuccess("Check your email for a confirmation link to activate your account."); setLoading(false); }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); }
      else router.push(dest);
    }
  }

  async function handleForgotPassword() {
    if (!email) { setError("Enter your email address above first."); return; }
    setLoading(true); reset();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });
    if (error) { setError(error.message); }
    else { setSuccess("Reset link sent! Check your email."); }
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/world-face-cCG4w5NaH4I-unsplash.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-10 flex flex-col min-h-screen px-6 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <img src="/icon.jpg" alt="Guiding Grace" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4 shadow-lg border border-white/20" />
          <h1 className="text-3xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
            Guiding Grace
          </h1>
          <p className="text-white/60 text-sm mt-1">
            {forgotMode ? "Reset your password" : isNewUser ? "Create your account" : "Welcome back"}
          </p>
        </div>

        {/* Main card */}
        <div className="bg-black/30 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl">

          {forgotMode ? (
            /* ── Forgot password ── */
            <div className="space-y-4">
              {error && <p className="text-red-300 text-sm bg-red-900/30 border border-red-400/20 rounded-2xl px-4 py-3">{error}</p>}
              {success && <p className="text-green-300 text-sm bg-green-900/20 border border-green-400/20 rounded-2xl px-4 py-3">{success}</p>}
              <input
                type="email" placeholder="Your email address" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleForgotPassword()}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50"
              />
              <button onClick={handleForgotPassword} disabled={!email || loading}
                className="w-full bg-white text-gray-900 font-bold py-4 rounded-2xl transition hover:bg-white/90 disabled:opacity-40 text-sm">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <button onClick={() => { setForgotMode(false); reset(); }}
                className="w-full text-white/50 hover:text-white text-sm py-2 transition">
                ← Back to sign in
              </button>
            </div>
          ) : (
            <>
              {/* ── Sign in / Create account toggle ── */}
              <div className="flex bg-white/8 rounded-2xl p-1 mb-6 border border-white/10">
                <button
                  onClick={() => { setIsNewUser(false); reset(); }}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition ${!isNewUser ? "bg-white/20 text-white shadow" : "text-white/50 hover:text-white/80"}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setIsNewUser(true); reset(); }}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition ${isNewUser ? "bg-white/20 text-white shadow" : "text-white/50 hover:text-white/80"}`}
                >
                  Create Account
                </button>
              </div>

              {/* ── Social ── */}
              <div className="space-y-3 mb-5">
                <button onClick={handleGoogle} disabled={loading}
                  className="w-full flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-5 rounded-2xl shadow-md transition disabled:opacity-60">
                  <svg width="20" height="20" viewBox="0 0 48 48" className="flex-shrink-0">
                    <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.1c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.4-10.5 7.4-17.5z"/>
                    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.7 42.9 14.8 48 24 48z"/>
                    <path fill="#FBBC05" d="M10.8 28.8c-.5-1.4-.7-2.8-.7-4.3s.3-3 .7-4.3v-6.2H2.7C1 17.4 0 20.6 0 24s1 6.6 2.7 9l8.1-4.2z"/>
                    <path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.5 0 24 0 14.8 0 6.7 5.1 2.7 12.8l8.1 4.2C12.7 13.6 17.9 9.5 24 9.5z"/>
                  </svg>
                  <span className="flex-1 text-left">{isNewUser ? "Sign up" : "Sign in"} with Google</span>
                </button>

                <button onClick={handleFacebook} disabled={loading}
                  className="w-full flex items-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold py-4 px-5 rounded-2xl shadow-md transition disabled:opacity-60">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="flex-shrink-0">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                  </svg>
                  <span className="flex-1 text-left">{isNewUser ? "Sign up" : "Sign in"} with Facebook</span>
                </button>
              </div>

              {/* ── Divider ── */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/15" />
                <span className="text-white/35 text-xs tracking-wide">or continue with email</span>
                <div className="flex-1 h-px bg-white/15" />
              </div>

              {/* ── Feedback ── */}
              {error && <p className="text-red-300 text-sm mb-4 bg-red-900/30 border border-red-400/20 rounded-2xl px-4 py-3">{error}</p>}
              {success && <p className="text-green-300 text-sm mb-4 bg-green-900/20 border border-green-400/20 rounded-2xl px-4 py-3">{success}</p>}

              {/* ── Email form ── */}
              <div className="space-y-3">
                {isNewUser && (
                  <input type="text" placeholder="Your name" value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50" />
                )}
                <input type="email" placeholder="Email address" value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50" />
                <input type="password" placeholder="Password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleEmailSubmit()}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50" />

                <button onClick={handleEmailSubmit}
                  disabled={!email || !password || (isNewUser && !name) || loading}
                  className="w-full bg-white text-gray-900 font-bold py-4 rounded-2xl transition hover:bg-white/90 disabled:opacity-40 text-sm">
                  {loading
                    ? (isNewUser ? "Creating account..." : "Signing in...")
                    : (isNewUser ? "Create Account" : "Sign In")}
                </button>

                {!isNewUser && (
                  <button onClick={() => { setForgotMode(true); reset(); }}
                    className="w-full text-white/40 hover:text-white/70 text-xs py-1 transition text-center">
                    Forgot your password?
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Trial CTA */}
        {!forgotMode && (
          <div className="mt-6 text-center">
            <p className="text-white/40 text-sm mb-3">
              {isNewUser ? "Ready to start your journey?" : "Don't have an account yet?"}
            </p>
            <Link href="/subscribe">
              <button className="w-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold py-4 rounded-2xl backdrop-blur-sm transition text-sm">
                ✨ Start Free 3-Day Trial
              </button>
            </Link>
            <p className="text-white/25 text-xs mt-2">No credit card required · Cancel anytime</p>
          </div>
        )}

      </div>
    </div>
  );
}
