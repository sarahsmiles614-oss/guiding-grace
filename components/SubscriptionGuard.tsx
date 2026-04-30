"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoggedOut(true); setChecking(false); return; }

      if (user.email === "sarahsmiles614@gmail.com") {
        setAllowed(true); setChecking(false); return;
      }

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status, trial_end_date")
        .eq("user_id", user.id)
        .single();

      if (!sub) { router.push("/subscribe"); return; }

      const isTrialing = sub.status === "trialing" && new Date(sub.trial_end_date) > new Date();
      const isActive = sub.status === "active";

      if (isActive || isTrialing) { setAllowed(true); }
      else { router.push("/subscribe"); }
      setChecking(false);
    }
    check();
  }, [router]);

  if (checking) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;

  if (loggedOut) {
    return (
      <div className="relative min-h-screen">
        <div className="pointer-events-none select-none filter blur-sm opacity-40">
          {children}
        </div>
        <div className="fixed inset-0 flex flex-col items-center justify-center px-6 text-center z-50">
          <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-sm w-full">
            <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Guiding Grace</p>
            <h2 className="text-white text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Your Daily Faith Companion
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Sign in or start your free 3-day trial to access daily devotions, grace challenges, Bible reading, and more.
            </p>
            <Link href="/">
              <button className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 px-6 rounded-2xl transition mb-3">
                Sign In
              </button>
            </Link>
            <Link href="/subscribe">
              <button className="w-full text-white/70 hover:text-white text-sm py-2 transition">
                ✨ Start Free 3-Day Trial
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!allowed) return null;
  return <>{children}</>;
}
