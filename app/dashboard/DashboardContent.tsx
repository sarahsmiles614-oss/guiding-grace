"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import Link from "next/link";
import PageBackground from "@/components/PageBackground";
import ShareButton from "@/components/ShareButton";

const ADMIN_EMAILS = ["sarahsmiles614@gmail.com"];

export default function DashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [subStatus, setSubStatus] = useState<"loading" | "active" | "expired" | "none">("loading");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }
      setUser(user);

      if (ADMIN_EMAILS.includes(user.email ?? "")) {
        setSubStatus("active");
        return;
      }

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status, trial_end_date")
        .eq("user_id", user.id)
        .single();

      if (!sub) { setSubStatus("none"); return; }

      const isTrialing = sub.status === "trialing" && new Date(sub.trial_end_date) > new Date();
      const isActive = sub.status === "active";
      setSubStatus(isActive || isTrialing ? "active" : "expired");
    }
    load();
  }, [router]);

  const features = [
    { label: "Daily Devotions", href: "/devotions", icon: "📖", desc: "Scripture & reflection delivered every morning" },
    { label: "His Promises", href: "/promises", icon: "🕊️", desc: "A treasury of God's promises to hold onto" },
    { label: "Shame Recycle Bin", href: "/shame-recycle", icon: "🗑️", desc: "Release guilt and shame — let it burn away" },
    { label: "Heaven's Hearts", href: "/heavens-hearts", icon: "💜", desc: "Light a candle in memory of someone you love" },
    { label: "Nightly Reflections", href: "/nightly-reflections", icon: "🌙", desc: "End your day with gratitude and surrender" },
    { label: "Heroes & Villains", href: "/heroes-villains", icon: "⚔️", desc: "Pray for those who inspire you — and those who challenge you" },
    { label: "P.U.S.H. Prayer Wall", href: "/prayer-wall", icon: "🙏", desc: "Pray Until Something Happens — post and pray together" },
    { label: "Truth Testimonies", href: "/testimony-wall", icon: "✨", desc: "Share what God has done in your life" },
  ];

  return (
    <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/julius_silver-lago-di-limides-3025780_1920.jpg">
      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-2xl font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Guiding Grace</h1>
            <div className="flex items-center gap-6">
              <Link href="/account" className="text-white/70 hover:text-white text-sm">Account</Link>
              <button onClick={() => signOut().then(() => router.push("/"))} className="text-sm text-white/70 hover:text-white">Sign out</button>
            </div>
          </div>

          {user && (
            <p className="text-white/80 mb-10 text-lg" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              Welcome, {user.user_metadata?.full_name?.split(" ")[0] || "friend"} 🌿
            </p>
          )}

          {/* Expired / no subscription banner */}
          {(subStatus === "expired" || subStatus === "none") && (
            <div className="mb-10 rounded-2xl bg-black/50 backdrop-blur-sm border border-white/20 p-8 text-center max-w-lg mx-auto">
              <p className="text-white text-xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {subStatus === "none" ? "No subscription found" : "Your trial has ended"}
              </p>
              <p className="text-white/60 text-sm mb-6">
                Subscribe to continue walking in grace and access all features.
              </p>
              <Link href="/subscribe">
                <button className="bg-white/20 hover:bg-white/30 border border-white/40 text-white font-semibold py-3 px-8 rounded-xl backdrop-blur-sm transition">
                  ✨ Subscribe Now
                </button>
              </Link>
            </div>
          )}

          {/* Grace Challenge hero */}
          <div className={subStatus !== "active" ? "opacity-40 pointer-events-none select-none" : ""}>
            <Link href="/grace-challenge">
              <div className="bg-gradient-to-r from-yellow-500/20 to-amber-400/10 border border-yellow-400/40 rounded-3xl p-6 mb-10 backdrop-blur-sm hover:from-yellow-500/30 hover:to-amber-400/20 transition cursor-pointer">
                <div className="flex items-start gap-5">
                  <span className="text-5xl flex-shrink-0">💛</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-yellow-300 text-xs uppercase tracking-widest font-semibold">Live Now</p>
                      <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    </div>
                    <h2 className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                      Daily Grace Challenge
                    </h2>
                    <p className="text-white/70 text-sm leading-relaxed mb-4">
                      A fresh real-world challenge drops every morning — inspired by the daily devotion. Share your story, vote for responses that move you, and see who the community honors as Most Loved. It's faith in action, together.
                    </p>
                    <span className="inline-block bg-yellow-400/25 border border-yellow-400/40 text-yellow-200 text-xs font-semibold px-4 py-1.5 rounded-full">
                      Take Today's Challenge →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Feature grid */}
          <p className="text-white/40 text-xs uppercase tracking-widest mb-6">Everything Inside</p>
          <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${subStatus !== "active" ? "opacity-40 pointer-events-none select-none" : ""}`}>
            {features.map((f) => (
              <Link key={f.href} href={f.href} className="group bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/25 rounded-2xl p-4 transition backdrop-blur-sm">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">{f.icon}</span>
                <p className="text-white text-sm font-semibold mb-1 leading-tight" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{f.label}</p>
                <p className="text-white/50 text-xs leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>

          {/* Share the app */}
          <div className="mt-14 text-center">
            <p className="text-white/40 text-xs mb-3">Know someone who could use this?</p>
            <ShareButton
              title="Guiding Grace"
              text="I've been using Guiding Grace for daily devotions and faith challenges — thought you might love it too."
              url="https://guidinggrace.app"
              label="🤍 Share Guiding Grace"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white text-sm font-medium px-6 py-3 rounded-2xl backdrop-blur-sm transition"
            />
          </div>
        </div>
      </main>
    </PageBackground>
  );
}
