"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import Link from "next/link";
import PageBackground from "@/components/PageBackground";

export default function AccountContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sub, setSub] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }
      setUser(user);
      const { data } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single();
      setSub(data);
    }
    load();
  }, [router]);

  return (
    <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/gersweb-god-2012104.jpg">
      <main className="flex-1 p-6">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Link href="/dashboard" className="text-white/80 text-sm">← Dashboard</Link>
            <button onClick={() => signOut().then(() => router.push("/"))} className="text-sm text-white/80">Sign out</button>
          </div>
          <h1 className="text-2xl font-bold text-white mb-6" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>My Account</h1>
          {user && (
            <div className="bg-white/20 backdrop-blur rounded-2xl border border-white/30 p-6 mb-4">
              <p className="text-sm text-white/60">Signed in as</p>
              <p className="font-medium text-white">{user.email}</p>
            </div>
          )}
          {sub && (
            <div className="bg-white/20 backdrop-blur rounded-2xl border border-white/30 p-6">
              <p className="text-sm text-white/60 mb-1">Subscription</p>
              <p className="font-medium text-white capitalize">{sub.status}</p>
              {sub.trial_end_date && <p className="text-xs text-white/50 mt-1">Trial ends {new Date(sub.trial_end_date).toLocaleDateString()}</p>}
              {sub.current_period_end && <p className="text-xs text-white/50 mt-1">Next billing {new Date(sub.current_period_end).toLocaleDateString()}</p>}
            </div>
          )}
        </div>
      </main>
    </PageBackground>
  );
}
