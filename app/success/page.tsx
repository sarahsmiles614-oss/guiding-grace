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
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🕊️</div>
          <h1 className="text-2xl font-bold text-purple-900 mb-2">Welcome to Guiding Grace</h1>
          <p className="text-gray-500 mb-6">Your subscription is active. You will be redirected to your dashboard in a few seconds.</p>
          <Link href="/dashboard" className="text-purple-700 underline text-sm">Go now →</Link>
        </div>
      </main>
    </PageBackground>
  );
}
