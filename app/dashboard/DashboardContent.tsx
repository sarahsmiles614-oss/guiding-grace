"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import Link from "next/link";
import PageBackground from "@/components/PageBackground";
import ShareButton from "@/components/ShareButton";
import NavMenu from "@/components/NavMenu";

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
    { label: "Daily Devotions", href: "/devotions", icon: "📖", desc: "A fresh scripture, reflection, and guided thought every morning — start your day anchored in faith" },
    { label: "Bible in 365 Days", href: "/bible-365", icon: "🎧", desc: "Read or listen through the entire Bible in a year — 4 reading plans, audio playback, verse highlights, journal, and full progress tracking" },
    { label: "Dive Deeper", href: "/dive-deeper", icon: "📔", desc: "Your personal journal for each day's devotion, grace challenge, and prayer — record what God is showing you and save highlighted verses" },
    { label: "His Promises", href: "/promises", icon: "🕊️", desc: "Browse hundreds of God's promises filtered by category — save your favorites, tap for a new one, and customize a card to share" },
    { label: "Shame Recycle Bin", href: "/shame-recycle", icon: "🗑️", desc: "Write what weighs on you, watch it burn away in flames, and receive a scripture of grace and freedom in return" },
    { label: "Heaven's Hearts", href: "/heavens-hearts", icon: "💜", desc: "Honor loved ones in heaven — create a personalized memorial, choose your name style, and add them to the community tribute wall" },
    { label: "Nightly Reflections", href: "/nightly-reflections", icon: "🌙", desc: "End your day by writing your burdens and blessings — surrender them to God and receive a scripture of peace" },
    { label: "Heroes & Villains", href: "/heroes-villains", icon: "⚔️", desc: "Explore the bold heroes and notorious villains of the Bible — their stories, their failures, and what God did with them" },
    { label: "P.U.S.H. Prayer Wall", href: "/prayer-wall", icon: "🙏", desc: "Post prayer requests, agree in prayer for others, and watch the wall fill with faith — Pray Until Something Happens" },
    { label: "Scripture Match", href: "/scripture-match", icon: "🎮", desc: "Flip cards to match Bible verses with characters and references — a fun memory game you can play solo and beat your best time" },
    { label: "Study Groups", href: "/study-groups", icon: "✝️", desc: "Create or join a group to dig into scripture together — discussion threads, community Q&A, and Bible trivia challenges" },
    { label: "Share Studio", href: "/share-studio", icon: "🎨", desc: "Build custom scripture and memorial cards with 30+ nature and faith backgrounds, your own text, and share them anywhere" },
  ];

  return (
    <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/sign/Images%20also/thibault-mokuenko-pY-bhzf_ZDk-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzA0YmFjMS1lYTk0LTQzODItYjE3YS1hNDU4OTgwZDllYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZXMgYWxzby90aGliYXVsdC1tb2t1ZW5rby1wWS1iaHpmX1pEay11bnNwbGFzaC5qcGciLCJpYXQiOjE3NzcwODU0MjMsImV4cCI6MTg1NDg0NTQyM30.pyRROLomZi4S8_Gu7aVOheZJexH5vsyWF2CTG4ryhHw">
      <main className="flex-1 p-6 md:p-12 flex flex-col items-center">
        <div className="max-w-5xl w-full">
          <div className="flex justify-between items-center mb-10">
            <NavMenu />
            <h1 className="text-3xl font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Guiding Grace</h1>
            <div className="flex items-center gap-6">
              <Link href="/account" className="text-white hover:text-white text-base">Account</Link>
              <button onClick={() => signOut().then(() => router.push("/"))} className="text-base text-white hover:text-white">Sign out</button>
            </div>
          </div>

          {user && (
            <p className="text-white mb-6 text-xl text-center" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              Welcome, {user.user_metadata?.full_name?.split(" ")[0] || "friend"} 🌿
            </p>
          )}

          {subStatus === "active" && (
            <div className="mb-10">
              <Link href="/today">
                <div className="bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 rounded-2xl p-6 transition cursor-pointer text-center">
                  <p className="text-white/50 text-sm uppercase tracking-widest mb-2">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                  <h2 className="text-white text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                    See Today's Content ✨
                  </h2>
                  <p className="text-white/60 text-base">Devotion · Challenge · Study Guide · Game · and more</p>
                </div>
              </Link>
            </div>
          )}

          {(subStatus === "expired" || subStatus === "none") && (
            <div className="mb-10 text-center max-w-lg mx-auto">
              <p className="text-white text-2xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                {subStatus === "none" ? "No subscription found" : "Your trial has ended"}
              </p>
              <p className="text-white text-base mb-6" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
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
                      <p className="text-yellow-300 text-sm uppercase tracking-widest font-semibold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Live Now</p>
                      <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    </div>
                    <h2 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                      Daily Grace Challenge
                    </h2>
                    <p className="text-white text-base leading-relaxed mb-4" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                      A fresh real-world challenge drops every morning. Share your story, vote for responses that move you, and see who the community honors as Most Loved.
                    </p>
                    <span className="text-yellow-200 text-sm font-semibold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                      Take Today's Challenge →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <p className="text-white text-sm uppercase tracking-widest mb-6 text-center">Everything Inside</p>
          <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${subStatus !== "active" ? "opacity-40 pointer-events-none select-none" : ""}`}>
            {features.map((f) => (
              <Link key={f.href} href={f.href} className="group hover:opacity-80 transition p-2">
                <span className="text-5xl mb-3 block group-hover:scale-110 transition-transform">{f.icon}</span>
                <p className="text-white text-lg font-semibold mb-1 leading-tight" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{f.label}</p>
                <p className="text-white text-base leading-relaxed" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>{f.desc}</p>
              </Link>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-white text-sm mb-3">Know someone who could use this?</p>
            <ShareButton
              title="Guiding Grace"
              text="I have been using Guiding Grace for daily devotions and faith challenges — thought you might love it too."
              url="https://guidinggrace.app"
              label="🤍 Share Guiding Grace"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-white text-base font-medium px-6 py-3 rounded-2xl backdrop-blur-sm transition"
            />
          </div>
        </div>
      </main>
    </PageBackground>
  );
}
