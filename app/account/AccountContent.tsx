"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import Link from "next/link";

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
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard" className="text-purple-700 text-sm">← Dashboard</Link>
          <button onClick={() => signOut().then(() => router.push("/"))} className="text-sm text-gray-500">Sign out</button>
        </div>
        <h1 className="text-2xl font-bold text-purple-900 mb-6">My Account</h1>
        {user && (
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 mb-4">
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="font-medium text-gray-800">{user.email}</p>
          </div>
        )}
        {sub && (
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
            <p className="text-sm text-gray-500 mb-1">Subscription</p>
            <p className="font-medium text-purple-800 capitalize">{sub.status}</p>
            {sub.trial_ends_at && <p className="text-xs text-gray-400 mt-1">Trial ends {new Date(sub.trial_ends_at).toLocaleDateString()}</p>}
          </div>
        )}
      </div>
    </main>
  );
}
