"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import Link from "next/link";

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
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-purple-900">Guiding Grace</h1>
          <button onClick={() => signOut().then(() => router.push("/"))} className="text-sm text-gray-500 hover:text-gray-700">Sign out</button>
        </div>
        {user && <p className="text-gray-600 mb-6">Welcome, {user.user_metadata?.full_name?.split(" ")[0] || "friend"} 🌿</p>}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <Link key={f.href} href={f.href} className="bg-white rounded-2xl shadow-sm border border-purple-100 p-4 flex flex-col items-center text-center hover:shadow-md transition">
              <span className="text-3xl mb-2">{f.icon}</span>
              <span className="text-sm font-medium text-purple-800">{f.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
