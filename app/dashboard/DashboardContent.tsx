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
    { label: "Daily Devotions", href: "/devotions", icon: "📖" },
    { label: "His Promises", href: "/promises", icon: "🕊️" },
    { label: "Shame Recycle Bin", href: "/shame-recycle", icon: "🗑️" },
    { label: "Heaven's Hearts", href: "/heavens-hearts", icon: "💜" },
    { label: "Nightly Reflections", href: "/nightly-reflections", icon: "🌙" },
    { label: "Heroes & Villains", href: "/heroes-villains", icon: "⚔️" },
    { label: "P.U.S.H. Prayer Wall", href: "/prayer-wall", icon: "🙏" },
    { label: "Truth Testimonies", href: "/testimony-wall", icon: "✨" },
    { label: "Daily Grace Challenge", href: "/grace-challenge", icon: "💛" },
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

          {/* Feature grid */}
          <div className={`grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10 ${subStatus !== "active" ? "opacity-40 pointer-events-none select-none" : ""}`}>
            {features.map((f) => (
              <Link key={f.href} href={f.href} className="flex flex-col items-center text-center hover:opacity-80 transition group">
                <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">{f.icon}</span>
                <span className="text-sm font-medium text-white leading-tight" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>{f.label}</span>
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
