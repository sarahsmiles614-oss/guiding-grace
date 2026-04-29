"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/hoai-thu-pt-nv4FFbP8IuE-unsplash.jpg";

const features = [
  { icon: "📖", label: "Daily Devotions", desc: "A fresh Scripture-based devotion every morning" },
  { icon: "💛", label: "Grace Challenge", desc: "Real-world faith challenges with community heart voting" },
  { icon: "🎧", label: "Bible in 365 Days", desc: "Read through the entire Bible in one year" },
  { icon: "🕊️", label: "His Promises", desc: "Browse and save scripture promises by theme" },
  { icon: "🙏", label: "Prayer Wall", desc: "Post prayers, pray for others — P.U.S.H. together" },
  { icon: "🌙", label: "Nightly Reflections", desc: "End your day with gratitude and surrender" },
  { icon: "💜", label: "Heaven's Hearts", desc: "A living memorial wall for your loved ones" },
  { icon: "⚔️", label: "Heroes & Villains", desc: "Explore bold Bible figures and the lessons they left" },
  { icon: "✨", label: "Testimonies", desc: "Share what God has done in your life" },
  { icon: "🗑️", label: "Shame Recycle Bin", desc: "Write it down. Let it burn. Walk free." },
];

export default function Home() {
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
  const [challenge, setChallenge] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push("/dashboard");
    });
    supabase
      .from("grace_challenges")
      .select("challenge_text")
      .eq("challenge_date", new Date().toISOString().split("T")[0])
      .single()
      .then(({ data }) => {
        if (data?.challenge_text) setChallenge(data.challenge_text);
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
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: getCallbackUrl(), queryParams: { prompt: "select_account" } } });
  }

  async function handleFacebook() {
    setLoading(true); reset();
    await supabase.auth.signInWithOAuth({ provider: "facebook", options: { redirectTo: getCallbackUrl() } });
  }

  async function handleEmailSubmit() {
    if (!email || !password || (isNewUser && !name)) return;
    setLoading(true); reset();
    const dest = typeof window !== "undefined" && localStorage.getItem("subscribe_intent") ? "/subscribe" : "/dashboard";
    if (isNewUser) {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/auth/callback` },
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

  const inputClass = "w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 text-sm py-3 focus:outline-none focus:border-white/80 transition text-center";

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col" style={{ backgroundImage: `url('${BG}')` }}>
      <div className="min-h-screen flex flex-col bg-black/50">
        <nav className="flex justify-between items-center px-6 pt-6">
          <p className="text-white/50 text-sm font-medium">Guiding Grace</p>
          <div className="flex gap-4 text-white/40 text-xs">
            <Link href="/terms" className="hover:text-white/70">Terms</Link>
            <Link href="/privacy" className="hover:text-white/70">Privacy</Link>
          </div>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-4">Your Daily Faith Companion</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
            365 Days of Grace,<br />Community & Scripture
          </h1>
          <p className="text-white/80 text-base mb-4 max-w-sm leading-relaxed" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
            Not just a reading plan. A daily faith experience with devotions, live community challenges, a prayer wall, and sacred spaces you will not find anywhere else.
          </p>
          <p className="text-white/50 text-xs mb-8 max-w-xs leading-relaxed">
            Release shame. Honor the lost. Share testimony. Pray together. Walk in grace every single day.
          </p>

          {challenge && (
            <div className="mb-10 max-w-sm w-full">
              <div className="bg-white/10 backdrop-blur-sm border border-yellow-300/30 rounded-2xl p-5">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <p className="text-yellow-300 text-xs uppercase tracking-widest font-semibold">Today's Grace Challenge</p>
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                </div>
                <p className="text-white text-sm leading-relaxed mb-4" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                  {challenge}
                </p>
                <p className="text-white/50 text-xs">Sign in to respond, vote, and see who the community honors as Most Loved 💛</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-x-6 gap-y-7 mb-12 w-full max-w-sm">
            {features.map(f => (
              <div key={f.label} className="flex flex-col items-center text-center gap-1.5">
                <span className="text-2xl leading-none">{f.icon}</span>
                <span className="text-white text-xs font-semibold leading-tight">{f.label}</span>
                <span className="text-white/50 text-xs leading-tight">{f.desc}</span>
              </div>
            ))}
          </div>

          <div className="w-full max-w-xs">
            {forgotMode ? (
              <div className="space-y-5">
                <p className="text-white font-semibold">Reset Password</p>
                {error && <p className="text-red-300 text-sm">{error}</p>}
                {success && <p className="text-green-300 text-sm">{success}</p>}
                <input type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleForgotPassword()} className={inputClass} />
                <button onClick={handleForgotPassword} disabled={!email || loading} className="w-full text-white font-semibold text-sm py-3 transition hover:text-white/70 disabled:opacity-40">
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
                <button onClick={() => { setForgotMode(false); reset(); }} className="w-full text-white/70 hover:text-white text-sm py-2 transition">
                  Back to sign in
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-center gap-8 mb-7">
                  <button onClick={() => { setIsNewUser(false); reset(); }} className={`text-sm font-semibold pb-1 transition ${!isNewUser ? "text-white border-b-2 border-white" : "text-white/60 hover:text-white/80"}`}>Sign In</button>
                  <button onClick={() => { setIsNewUser(true); reset(); }} className={`text-sm font-semibold pb-1 transition ${isNewUser ? "text-white border-b-2 border-white" : "text-white/60 hover:text-white/80"}`}>Create Account</button>
                </div>
                <div className="space-y-3 mb-6">
                  <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-3 text-white text-sm font-medium py-3 transition hover:text-white/70 disabled:opacity-50">
                    <svg width="18" height="18" viewBox="0 0 48 48" className="flex-shrink-0"><path fill="#fff" d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.1c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.4-10.5 7.4-17.5z"/><path fill="#fff" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.7 42.9 14.8 48 24 48z"/><path fill="#fff" d="M10.8 28.8c-.5-1.4-.7-2.8-.7-4.3s.3-3 .7-4.3v-6.2H2.7C1 17.4 0 20.6 0 24s1 6.6 2.7 9l8.1-4.2z"/><path fill="#fff" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.5 0 24 0 14.8 0 6.7 5.1 2.7 12.8l8.1 4.2C12.7 13.6 17.9 9.5 24 9.5z"/></svg>
                    {isNewUser ? "Sign up" : "Sign in"} with Google
                  </button>
                  <button onClick={handleFacebook} disabled={loading} className="w-full flex items-center justify-center gap-3 text-white text-sm font-medium py-3 transition hover:text-white/70 disabled:opacity-50">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="flex-shrink-0"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                    {isNewUser ? "Sign up" : "Sign in"} with Facebook
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-white/15" />
                  <span className="text-white/60 text-xs">or email</span>
                  <div className="flex-1 h-px bg-white/15" />
                </div>
                {error && <p className="text-red-300 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-300 text-sm mb-4">{success}</p>}
                <div className="space-y-4 mb-6">
                  {isNewUser && <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className={inputClass} />}
                  <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
                  <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleEmailSubmit()} className={inputClass} />
                </div>
                <button onClick={handleEmailSubmit} disabled={!email || !password || (isNewUser && !name) || loading} className="w-full text-white font-bold text-sm py-3 transition hover:text-white/70 disabled:opacity-40">
                  {loading ? (isNewUser ? "Creating account..." : "Signing in...") : (isNewUser ? "Create Account" : "Sign In")}
                </button>
                {!isNewUser && (
                  <button onClick={() => { setForgotMode(true); reset(); }} className="w-full text-white/60 hover:text-white text-xs py-2 transition">
                    Forgot your password?
                  </button>
                )}
                <div className="mt-8">
                  <Link href="/subscribe">
                    <button className="w-full text-white font-semibold text-sm py-3 transition hover:text-white/70">
                      Start Free 3-Day Trial
                    </button>
                  </Link>
                  <p className="text-white/60 text-xs mt-1">No credit card required. Cancel anytime.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
