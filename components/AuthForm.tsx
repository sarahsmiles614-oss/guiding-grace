"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const inputClass = "w-full bg-white/10 border border-white/25 rounded-lg text-white placeholder-white/60 text-xs py-2 px-3 focus:outline-none focus:border-white/60 transition";

export default function AuthForm() {
  const router = useRouter();
  const [isNewUser, setIsNewUser] = useState(
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("signup") === "1"
  );
  const [forgotMode, setForgotMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push("/dashboard");
    });
  }, [router]);

  function reset() { setError(""); setSuccess(""); }

  function getCallbackUrl() {
    const hasIntent = isNewUser && typeof window !== "undefined" && localStorage.getItem("subscribe_intent");
    const next = hasIntent ? "/subscribe" : "/dashboard";
    return `${window.location.origin}/auth/callback?next=${next}`;
  }

  async function handleGoogle() {
    setLoading(true); reset();
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: getCallbackUrl(), queryParams: { prompt: "select_account" } } });
  }

  async function handleFacebook() {
    setLoading(true); reset();
    await supabase.auth.signInWithOAuth({ provider: "facebook", options: { redirectTo: getCallbackUrl() } });
  }

  async function handleEmailSubmit() {
    if (!email || !password || (isNewUser && !name)) return;
    setLoading(true); reset();
    if (isNewUser) {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) { setError(error.message); setLoading(false); }
      else { setSuccess("Check your email for a confirmation link."); setLoading(false); }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); }
      else {
        if (!rememberMe) sessionStorage.setItem("no_persist", "1");
        router.push("/dashboard");
      }
    }
  }

  async function handleForgotPassword() {
    if (!email) { setError("Enter your email above first."); return; }
    setLoading(true); reset();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });
    if (error) { setError(error.message); }
    else { setSuccess("Reset link sent! Check your email."); }
    setLoading(false);
  }

  if (forgotMode) return (
    <div className="space-y-3">
      <p className="text-white font-semibold text-xs text-center">Reset Password</p>
      {error && <p className="text-red-300 text-xs">{error}</p>}
      {success && <p className="text-green-300 text-xs">{success}</p>}
      <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleForgotPassword()} className={inputClass} />
      <button onClick={handleForgotPassword} disabled={!email || loading} className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-2 rounded-lg transition disabled:opacity-40">
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
      <button onClick={() => { setForgotMode(false); reset(); }} className="w-full text-white/50 hover:text-white text-xs py-1 transition">
        ← Back
      </button>
    </div>
  );

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex justify-center gap-6 mb-3">
        <button onClick={() => { setIsNewUser(false); reset(); }} className={`text-xs font-semibold pb-0.5 transition ${!isNewUser ? "text-white border-b border-white" : "text-white/50 hover:text-white"}`}>Sign In</button>
        <button onClick={() => { setIsNewUser(true); reset(); }} className={`text-xs font-semibold pb-0.5 transition ${isNewUser ? "text-white border-b border-white" : "text-white/50 hover:text-white"}`}>Create Account</button>
      </div>

      {/* Social */}
      <div className="flex gap-2 mb-3">
        <button onClick={handleGoogle} disabled={loading} className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium py-2 rounded-lg transition disabled:opacity-50">
          <svg width="13" height="13" viewBox="0 0 48 48"><path fill="#fff" d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.1c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.4-10.5 7.4-17.5z"/><path fill="#fff" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.7 42.9 14.8 48 24 48z"/><path fill="#fff" d="M10.8 28.8c-.5-1.4-.7-2.8-.7-4.3s.3-3 .7-4.3v-6.2H2.7C1 17.4 0 20.6 0 24s1 6.6 2.7 9l8.1-4.2z"/><path fill="#fff" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.5 0 24 0 14.8 0 6.7 5.1 2.7 12.8l8.1 4.2C12.7 13.6 17.9 9.5 24 9.5z"/></svg>
          Google
        </button>
        <button onClick={handleFacebook} disabled={loading} className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium py-2 rounded-lg transition disabled:opacity-50">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
          Facebook
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-px bg-white/15" />
        <span className="text-white/40 text-xs">or</span>
        <div className="flex-1 h-px bg-white/15" />
      </div>

      {error && <p className="text-red-300 text-xs mb-2">{error}</p>}
      {success && <p className="text-green-300 text-xs mb-2">{success}</p>}

      <div className="space-y-2 mb-2">
        {isNewUser && <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className={inputClass} />}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleEmailSubmit()} className={inputClass} />
      </div>

      {!isNewUser && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => setRememberMe(!rememberMe)}
              className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition ${rememberMe ? "bg-white/80 border-white/80" : "border-white/40 bg-transparent"}`}>
              {rememberMe && <svg width="8" height="6" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </button>
            <span className="text-white/50 text-xs">Remember me</span>
          </div>
          <button onClick={() => { setForgotMode(true); reset(); }} className="text-white/50 hover:text-white text-xs transition">
            Forgot password?
          </button>
        </div>
      )}

      {isNewUser && (
        <button onClick={handleEmailSubmit} disabled={!email || !password || !name || loading}
          className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-semibold py-2 rounded-lg transition disabled:opacity-40 mb-2">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      )}
      {!isNewUser && loading && <p className="text-white/50 text-xs text-center py-1">Signing in...</p>}

      <div className="border-t border-white/10 mt-3 pt-3 text-center">
        <Link href="/subscribe">
          <button className="text-white font-semibold text-xs hover:text-white/80 transition">
            ✨ Start Free Trial — Cancel Anytime
          </button>
        </Link>
        <p className="text-white/40 text-xs mt-0.5">No card required.</p>
      </div>
    </div>
  );
}
