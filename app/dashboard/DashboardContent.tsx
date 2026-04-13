"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import Link from "next/link";
import PageBackground from "@/components/PageBackground";

export default function DashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/");
      else setUser(user);
    });
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
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Guiding Grace</h1>
            <div className="flex items-center gap-4">
              <Link href="/account" className="text-white/70 hover:text-white text-sm">Account</Link>
              <button onClick={() => signOut().then(() => router.push("/"))} className="text-sm text-white/70 hover:text-white">Sign out</button>
            </div>
          </div>
          {user && <p className="text-white/80 mb-8" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Welcome, {user.user_metadata?.full_name?.split(" ")[0] || "friend"} 🌿</p>}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {features.map((f) => (
              <Link key={f.href} href={f.href} className="flex flex-col items-center text-center hover:opacity-80 transition">
                <span className="text-4xl mb-2">{f.icon}</span>
                <span className="text-sm font-medium text-white" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>{f.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </PageBackground>
  );
}
