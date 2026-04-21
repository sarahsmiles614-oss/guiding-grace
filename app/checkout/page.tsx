"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/mateus-campos-felipe-88D7C4c6en8-unsplash.jpg";

function CheckoutForm({ type, mode }: { type: "payment" | "setup"; mode: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    const returnUrl = `${window.location.origin}/success`;

    let result;
    if (type === "setup") {
      result = await stripe.confirmSetup({ elements, confirmParams: { return_url: returnUrl } });
    } else {
      result = await stripe.confirmPayment({ elements, confirmParams: { return_url: returnUrl } });
    }

    if (result.error) {
      setError(result.error.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white/5 border border-white/15 rounded-2xl p-4">
        <PaymentElement options={{
          layout: "tabs",
          appearance: { theme: "night" },
        }} />
      </div>

      {error && (
        <p className="text-red-300 text-sm bg-red-900/30 border border-red-400/20 rounded-2xl px-4 py-3">{error}</p>
      )}

      <button type="submit" disabled={!stripe || loading}
        className="w-full bg-white text-gray-900 font-bold py-4 rounded-2xl transition hover:bg-white/90 disabled:opacity-50 text-base">
        {loading ? "Processing..." : type === "setup" ? "Start Free Trial" : mode === "yearly" ? "Subscribe — $29.99/yr" : "Subscribe — $2.99/mo"}
      </button>

      <p className="text-white/30 text-xs text-center">
        {type === "setup"
          ? "Your card won't be charged until after your 3-day trial."
          : "Secured by Stripe. Cancel anytime."}
      </p>
    </form>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") || "trial";

  const [user, setUser] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [intentType, setIntentType] = useState<"payment" | "setup" | "free_trial">("payment");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const modeLabel = mode === "yearly" ? "$29.99/year" : mode === "monthly" ? "$2.99/month" : "3-Day Free Trial";

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/signin"); return; }
      setUser(user);

      const res = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || "",
          mode,
        }),
      });

      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }

      setIntentType(data.type);
      if (data.type === "free_trial") {
        // No card needed — go straight to success
        router.push("/success");
        return;
      }
      setClientSecret(data.clientSecret);
      setLoading(false);
    }
    init();
  }, [mode, router]);

  const appearance = {
    theme: "night" as const,
    variables: {
      colorPrimary: "#ffffff",
      colorBackground: "rgba(255,255,255,0.05)",
      colorText: "#ffffff",
      colorTextSecondary: "rgba(255,255,255,0.6)",
      borderRadius: "16px",
      fontFamily: "Inter, sans-serif",
    },
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url('${BG}')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/70" />

      <div className="relative z-10 flex flex-col min-h-screen px-6 py-10 items-center">
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/subscribe" className="text-white/60 text-sm hover:text-white transition">← Back</Link>
            <img src="/icon.jpg" alt="Guiding Grace" className="w-10 h-10 rounded-xl object-cover border border-white/20" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
              Guiding Grace
            </h1>
            <div className="inline-block bg-white/15 border border-white/20 rounded-full px-4 py-1 mt-2">
              <p className="text-white/90 text-sm font-medium">{modeLabel}</p>
            </div>
          </div>

          {/* What's included */}
          <div className="bg-black/30 backdrop-blur-xl border border-white/15 rounded-3xl p-5 mb-5">
            <p className="text-white/50 text-xs uppercase tracking-widest mb-3">What's included</p>
            <div className="grid grid-cols-2 gap-y-2 gap-x-3">
              {["Daily Devotions", "Grace Challenge", "His Promises", "Prayer Wall",
                "Nightly Reflections", "Heaven's Hearts", "Shame Recycle Bin", "Heroes & Villains"].map(f => (
                <p key={f} className="text-white/70 text-xs flex items-center gap-1.5">
                  <span className="text-green-400 text-xs">✓</span>{f}
                </p>
              ))}
            </div>
          </div>

          {/* Payment form */}
          <div className="bg-black/30 backdrop-blur-xl border border-white/15 rounded-3xl p-5">
            {loading ? (
              <p className="text-white/50 text-sm text-center py-6 animate-pulse">Setting up your checkout...</p>
            ) : error ? (
              <p className="text-red-300 text-sm text-center py-4">{error}</p>
            ) : clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                <CheckoutForm type={intentType as "payment" | "setup"} mode={mode} />
              </Elements>
            ) : null}
          </div>

          <p className="text-white/25 text-xs text-center mt-6">
            🔒 Payments secured by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url('${BG}')`, backgroundSize: "cover" }}>
        <div className="absolute inset-0 bg-black/60" />
        <p className="relative text-white/60 animate-pulse">Loading...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
