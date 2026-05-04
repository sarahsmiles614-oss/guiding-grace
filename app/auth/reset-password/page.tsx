"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleReset() {
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 2500);
    }
  }

  return (
    <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/world-face-cCG4w5NaH4I-unsplash.jpg">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
              New Password
            </h1>
            <p className="text-white/50 text-sm">Choose a new password for your account</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
            {done ? (
              <div className="text-center py-4">
                <p className="text-3xl mb-3">✓</p>
                <p className="text-white font-semibold mb-1">Password updated!</p>
                <p className="text-white/50 text-sm">Taking you to your dashboard...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {error && (
                  <p className="text-red-300 text-xs bg-red-900/30 border border-red-400/20 rounded-xl px-4 py-2">{error}</p>
                )}
                <input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/80 text-sm focus:outline-none focus:border-white/50"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleReset()}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/80 text-sm focus:outline-none focus:border-white/50"
                />
                <button
                  onClick={handleReset}
                  disabled={!password || !confirm || loading}
                  className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </PageBackground>
  );
}
