"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // If already signed in, go straight to dashboard
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push("/dashboard");
    });
  }, [router]);

  async function handleGoogleSignIn() {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/terrianneallen-sunset-3916244.jpg')",
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
        <p className="text-white/60 mb-10 text-sm">Welcome back</p>

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

        <p className="text-white/40 text-xs mt-8">
          Don&apos;t have an account?{" "}
          <a href="/subscribe" className="text-white/70 underline">Start free trial</a>
        </p>
      </div>
    </div>
  );
}
