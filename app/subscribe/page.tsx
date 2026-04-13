"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SubscribePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/"); return; }

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, email: user.email }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-purple-900 mb-2">Guiding Grace</h1>
        <p className="text-gray-500 mb-6">Your daily faith companion</p>
        <div className="bg-purple-50 rounded-2xl p-6 mb-6">
          <p className="text-4xl font-bold text-purple-800">$2.99<span className="text-lg font-normal">/mo</span></p>
          <p className="text-sm text-gray-500 mt-1">or $29.99/year — save 16%</p>
          <p className="text-sm text-purple-600 font-medium mt-3">✨ 3-day free trial · No credit card required</p>
        </div>
        <ul className="text-left text-sm text-gray-600 space-y-2 mb-8">
          {["Daily Devotions","His Promises","Shame Recycle Bin","Heaven's Hearts","Nightly Reflections","Heroes & Villains","P.U.S.H. Prayer Wall","Truth Testimonies Wall","Daily Grace Challenge"].map(f => (
            <li key={f} className="flex items-center gap-2"><span className="text-purple-500">✓</span>{f}</li>
          ))}
        </ul>
        <button onClick={handleSubscribe} disabled={loading} className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60">
          {loading ? "Redirecting..." : "Start Free Trial"}
        </button>
        <p className="text-xs text-gray-400 mt-4">Already have an account? <a href="/" className="text-purple-600 underline">Sign in</a></p>
      </div>
    </main>
  );
}
