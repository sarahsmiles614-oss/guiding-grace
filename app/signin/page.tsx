"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Mode = "google" | "email-signin" | "email-signup";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("google");
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

  async function handleGoogleSignIn() {
    setLoading(true);
    setError("");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function handleFacebookSignIn() {
    setLoading(true);
    setError("");
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function handleEmailSignIn() {
    if (!email || !password) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  async function handleEmailSignUp() {
    if (!email || !password || !name) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess("Check your email for a confirmation link to finish signing up.");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/world-face-cCG4w5NaH4I-unsplash.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-sm px-6 text-center">
        <h1
          className="text-4xl font-bold text-white mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
        >
          Guiding Grace
        </h1>
        <p className="text-white/60 mb-8 text-sm">Welcome back</p>

        {/* Mode tabs */}
        <div className="flex bg-white/10 rounded-xl p-1 mb-6 border border-white/20">
          <button
            onClick={() => { setMode("google"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === "google" ? "bg-white/20 text-white" : "text-white/50 hover:text-white/80"}`}
          >
            Google
          </button>
          <button
            onClick={() => { setMode("email-signin"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === "email-signin" ? "bg-white/20 text-white" : "text-white/50 hover:text-white/80"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode("email-signup"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === "email-signup" ? "bg-white/20 text-white" : "text-white/50 hover:text-white/80"}`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <p className="text-red-300 text-sm mb-4 bg-red-900/30 border border-red-400/30 rounded-xl px-4 py-2">{error}</p>
        )}
        {success && (
          <p className="text-green-300 text-sm mb-4 bg-green-900/30 border border-green-400/30 rounded-xl px-4 py-2">{success}</p>
        )}

        {/* Social buttons */}
        {mode === "google" && (
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-gray-800 font-semibold py-4 rounded-xl shadow-lg transition disabled:opacity-60"
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.1c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.4-10.5 7.4-17.5z"/>
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.7 42.9 14.8 48 24 48z"/>
                <path fill="#FBBC05" d="M10.8 28.8c-.5-1.4-.7-2.8-.7-4.3s.3-3 .7-4.3v-6.2H2.7C1 17.4 0 20.6 0 24s1 6.6 2.7 9l8.1-4.2z"/>
                <path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.5 0 24 0 14.8 0 6.7 5.1 2.7 12.8l8.1 4.2C12.7 13.6 17.9 9.5 24 9.5z"/>
              </svg>
              {loading ? "Signing in..." : "Continue with Google"}
            </button>

            <button
              onClick={handleFacebookSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold py-4 rounded-xl shadow-lg transition disabled:opacity-60"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
              {loading ? "Signing in..." : "Continue with Facebook"}
            </button>
          </div>
        )}

        {/* Email Sign In */}
        {mode === "email-signin" && (
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEmailSignIn()}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50"
            />
            <button
              onClick={handleEmailSignIn}
              disabled={!email || !password || loading}
              className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        )}

        {/* Email Sign Up */}
        {mode === "email-signup" && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50"
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50"
            />
            <button
              onClick={handleEmailSignUp}
              disabled={!email || !password || !name || loading}
              className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
            <p className="text-white/40 text-xs">
              Already subscribed?{" "}
              <button onClick={() => setMode("email-signin")} className="text-white/70 underline">Sign in instead</button>
            </p>
          </div>
        )}

        {mode === "google" && (
          <p className="text-white/40 text-xs mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/subscribe" className="text-white/70 underline">Start free trial</Link>
          </p>
        )}
      </div>
    </div>
  );
}
