"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

declare global {
  interface Window { google?: any; }
}

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
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push("/dashboard");
    });

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (!window.google || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return;
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      setGoogleReady(true);
    };
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [router]);

  useEffect(() => {
    if (!googleReady) return;
    const el = document.getElementById("google-btn-container");
    if (el && window.google) {
      window.google.accounts.id.renderButton(el, {
        theme: "filled_black",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: el.offsetWidth || 300,
        logo_alignment: "left",
      });
    }
  }, [googleReady]);

  async function handleGoogleCredential(credentialResponse: { credential: string }) {
    setLoading(true); reset();
    const { error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: credentialResponse.credential,
    });
    if (error) { setError(error.message); setLoading(false); return; }
    const hasIntent = isNewUser && typeof window !== "undefined" && localStorage.getItem("subscribe_intent");
    router.push(hasIntent ? "/subscribe" : "/dashboard");
  }

  function reset() { setError(""); setSuccess(""); }

  async function handleFacebook() {
    setLoading(true); reset();
    const next = isNewUser && typeof window !== "undefined" && localStorage.getItem("subscribe_intent") ? "/subscribe" : "/dashboard";
    await supabase.auth.signInWithOAuth({ provider: "facebook", options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` } });
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
      {error && <p className="text-red-300 text-xs mb-2 text-center">{error}</p>}

      {/* Google button — rendered by Google's GSI, opens a popup (no redirect) */}
      <div className="flex gap-2 mb-3">
        <div id="google-btn-container" className="flex-1" style={{ minHeight: "40px" }}>
          {!googleReady && (
            <div className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white/50 text-xs font-medium py-2 rounded-lg h-10">
              Loading...
            </div>
          )}
        </div>
        <button onClick={handleFacebook} disabled={loading} className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium py-2 rounded-lg transition disabled:opacity-50">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
          Continue with Facebook
        </button>
      </div>

      {loading && <p className="text-white/50 text-xs text-center mb-2">Signing in...</p>}

      <div className="border-t border-white/10 mt-2 pt-3 text-center">
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
