"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageBackground from "@/components/PageBackground";

export default function SuccessPage() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => router.push("/dashboard"), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/11703009-web-4063635_1920.jpg">
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div>
          <div className="text-6xl mb-6">🕊️</div>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>Welcome to Guiding Grace</h1>
          <p className="text-white/60 mb-8">Your subscription is active. Redirecting to your dashboard...</p>
          <Link href="/dashboard" className="text-white/70 underline text-sm">Go now →</Link>
        </div>
      </main>
    </PageBackground>
  );
}
