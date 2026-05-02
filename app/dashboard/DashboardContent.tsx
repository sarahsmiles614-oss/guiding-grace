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
    { label: "Daily Devotions", href: "/devotions", icon: "📖", desc: "Scripture and reflection delivered every morning" },
    { label: "Bible in 365 Days", href: "/bible-365", icon: "🎧", desc: "Read or listen through the entire Bible in one year" },
    { label: "Dive Deeper", href: "/dive-deeper", icon: "📔", desc: "Daily journal worksheet — reflect on the devotion, challenge, and your prayer" },
    { label: "His Promises", href: "/promises", icon: "🕊️", desc: "Discover scripture promises by category and save your favorites" },
    { label: "Shame Recycle Bin", href: "/shame-recycle", icon: "🗑️", desc: "Release guilt and shame — let it burn away" },
    { label: "Heaven's Hearts", href: "/heavens-hearts", icon: "💜", desc: "Honor your deceased loved ones with a beautiful memorial wall" },
    { label: "Nightly Reflections", href: "/nightly-reflections", icon: "🌙", desc: "End your day with gratitude and surrender" },
    { label: "Heroes & Villains", href: "/heroes-villains", icon: "⚔️", desc: "Explore the stories of the bold heroes and notorious villains of the Bible" },
    { label: "P.U.S.H. Prayer Wall", href: "/prayer-wall", icon: "🙏", desc: "Pray Until Something Happens — post and pray together" },
    { label: "Scripture Match", href: "/scripture-match", icon: "🎮", desc: "Match verses and characters — beat your best time" },
    { label: "Study Groups", href: "/study-groups", icon: "✝️", desc: "Study the Word together — group discussion, Q&A, and Bible trivia" },
  ];

  return (
    <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/sign/Images%20also/thibault-mokuenko-pY-bhzf_ZDk-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzA0YmFjMS1lYTk0LTQzODItYjE3YS1hNDU4OTgwZDllYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZXMgYWxzby90aGliYXVsdC1tb2t1ZW5rby1wWS1iaHpmX1pEay11bnNwbGFzaC5qcGciLCJpYXQiOjE3NzcwODU0MjMsImV4cCI6MTg1NDg0NTQyM30.pyRROLomZi4S8_Gu7aVOheZJexH5vsyWF2CTG4ryhHw">
      <main className="flex-1 p-6 md:p-12 flex flex-col items-center">
        <div className="max-w-5xl w-full">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-2xl font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Guiding Grace</h1>
            <div className="flex items-center gap-6">
              <Link href="/account" className="text-white hover:text-white/80 text-sm">Account</Link>
              <button onClick={() => signOut().then(() => router.push("/"))} className="text-sm text-white hover:text-white/80">Sign out</button>
            </div>
          </div>

          {user && (
            <p className="text-white mb-6 text-lg text-center" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              Welcome, {user.user_metadata?.full_name?.split(" ")[0] || "friend"} 🌿
            </p>
          )}

          {subStatus === "active" && (
            <div className="mb-10">
              <Link href="/today">
                <div className="bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 rounded-2xl p-6 transition cursor-pointer text-center">
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-2">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                  <h2 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                    See Today's Content ✨
                  </h2>
                  <p className="text-white/60 text-sm">Devotion · Challenge · Study Guide · Game · and more</p>
                </div>
              </Link>
            </div>
          )}

          {(subStatus === "expired" || subStatus === "none") && (
            <div className="mb-10 text-center max-w-lg mx-auto">
              <p className="text-white text-xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                {subStatus === "none" ? "No subscription found" : "Your trial has ended"}
              </p>
              <p className="text-white text-sm mb-6" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                Subscribe to continue walking in grace and access all features.
              </p>
              <Link href="/subscribe">
                <button className="bg-white/20 hover:bg-white/30 border border-white/40 text-white font-semibold py-3 px-8 rounded-xl transition">
                  ✨ Subscribe Now
                </button>
              </Link>
            </div>
          )}

          <div className={`mb-10 ${subStatus !== "active" ? "opacity-40 pointer-events-none select-none" : ""}`}>
            <Link href="/grace-challenge">
              <div className="p-2 hover:opacity-80 transition cursor-pointer">
                <div className="flex items-start gap-5">
                  <span className="text-5xl flex-shrink-0">💛</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-yellow-300 text-xs uppercase tracking-widest font-semibold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Live Now</p>
                      <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    </div>
                    <h2 className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                      Daily Grace Challenge
                    </h2>
                    <p className="text-white text-sm leading-relaxed mb-4" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                      A fresh real-world challenge drops every morning. Share your story, vote for responses that move you, and see who the community honors as Most Loved.
                    </p>
                    <span className="text-yellow-200 text-xs font-semibold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                      Take Today's Challenge →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <p className="text-white text-xs uppercase tracking-widest mb-6 text-center">Everything Inside</p>
          <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${subStatus !== "active" ? "opacity-40 pointer-events-none select-none" : ""}`}>
            {features.map((f) => (
              <Link key={f.href} href={f.href} className="group hover:opacity-80 transition p-2">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">{f.icon}</span>
                <p className="text-white text-sm font-semibold mb-1 leading-tight" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{f.label}</p>
                <p className="text-white text-xs leading-relaxed" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>{f.desc}</p>
              </Link>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-white text-xs mb-3">Know someone who could use this?</p>
            <ShareButton
              title="Guiding Grace"
              text="I have been using Guiding Grace for daily devotions and faith challenges — thought you might love it too."
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
