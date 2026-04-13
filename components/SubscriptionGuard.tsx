"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status, trial_ends_at")
        .eq("user_id", user.id)
        .single();

      if (!sub) { router.push("/subscribe"); return; }

      const isTrialing = sub.status === "trialing" && new Date(sub.trial_ends_at) > new Date();
      const isActive = sub.status === "active";

      if (isActive || isTrialing) {
        setAllowed(true);
      } else {
        router.push("/subscribe");
      }
      setChecking(false);
    }
    check();
  }, [router]);

  if (checking) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (!allowed) return null;
  return <>{children}</>;
}
