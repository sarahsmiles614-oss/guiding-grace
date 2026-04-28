"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageBackground from "@/components/PageBackground";
import { supabase } from "@/lib/supabase";

export default function SuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Activating your subscription...");

  useEffect(() => {
    let cancelled = false;

    async function activate() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/subscribe"); return; }

      // Kick off today's content in the background
      fetch("/api/ensure-today", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      // Poll for the subscription row (webhook may take a few seconds)
      const deadline = Date.now() + 20000;
      while (!cancelled && Date.now() < deadline) {
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("user_id", session.user.id)
          .single();

        if (sub && (sub.status === "trialing" || sub.status === "active")) {
          if (!cancelled) router.push("/dashboard");
          return;
        }
        setStatus("Finalizing your account...");
        await new Promise(r => setTimeout(r, 1500));
      }

      // Fallback: go anyway after 20s
      if (!cancelled) router.push("/dashboard");
    }

    activate();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/11703009-web-4063635_1920.jpg">
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div>
          <div className="text-6xl mb-6">🕊️</div>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>Welcome to Guiding Grace</h1>
          <p className="text-white/60 mb-8">{status}</p>
          <Link href="/dashboard" className="text-white/70 underline text-sm">Go now →</Link>
        </div>
      </main>
    </PageBackground>
  );
}
