"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  ExpressCheckoutElement,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expressReady, setExpressReady] = useState(false);

  const returnUrl = typeof window !== "undefined" ? `${window.location.origin}/success` : "https://guidinggrace.app/success";

  async function handleExpressConfirm() {
    if (!stripe || !elements) return;
    const result = type === "setup"
      ? await stripe.confirmSetup({ elements, confirmParams: { return_url: returnUrl } })
      : await stripe.confirmPayment({ elements, confirmParams: { return_url: returnUrl } });
    if (result.error) setError(result.error.message || "Payment failed.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");
    const result = type === "setup"
      ? await stripe.confirmSetup({ elements, confirmParams: { return_url: returnUrl } })
      : await stripe.confirmPayment({ elements, confirmParams: { return_url: returnUrl } });
    if (result.error) {
      setError(result.error.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  }

  const isTrial = mode === "trial";
  const buttonLabel = isTrial
    ? "Start Free Trial"
    : mode === "yearly" ? "Subscribe — $29.99/yr" : "Subscribe — $2.99/mo";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Express checkout: Google Pay / Apple Pay */}
      <div>
        <ExpressCheckoutElement
          onConfirm={handleExpressConfirm}
          onReady={({ availablePaymentMethods }) => {
            if (availablePaymentMethods) setExpressReady(true);
          }}
          options={{
            buttonType: { googlePay: "subscribe", applePay: "subscribe" },
            layout: { maxColumns: 1, maxRows: 3 },
          }}
        />
      </div>

      {/* Divider — only shown when express methods are available */}
      {expressReady && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/15" />
          <span className="text-white/35 text-xs">or pay another way</span>
          <div className="flex-1 h-px bg-white/15" />
        </div>
      )}

      {/* Card / Klarna / all other methods */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card", "link"],
          }}
        />
      </div>

      {error && (
        <p className="text-red-300 text-sm bg-red-900/30 border border-red-400/20 rounded-2xl px-4 py-3">{error}</p>
      )}

      <button type="submit" disabled={!stripe || loading}
        className="w-full bg-white text-gray-900 font-bold py-4 rounded-2xl transition hover:bg-white/90 disabled:opacity-50 text-base">
        {loading ? "Processing..." : buttonLabel}
      </button>

      <p className="text-white/30 text-xs text-center">
        {isTrial
          ? "Your payment method won't be charged until after your 3-day trial."
          : "Secured by Stripe · Cancel anytime"}
      </p>
    </form>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") || "trial";

  const [clientSecret, setClientSecret] = useState("");
  const [intentType, setIntentType] = useState<"payment" | "setup" | "free_trial">("payment");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const modeLabel = mode === "yearly" ? "$29.99 / year" : mode === "monthly" ? "$2.99 / month" : "3-Day Free Trial";
  const modeSub = mode === "trial" ? "No charge until trial ends · Cancel anytime" : "Cancel anytime";

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }

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
      colorBackground: "rgba(0,0,0,0.01)",
      colorText: "#ffffff",
      colorTextSecondary: "rgba(255,255,255,0.55)",
      colorTextPlaceholder: "rgba(255,255,255,0.3)",
      borderRadius: "14px",
      fontFamily: "Inter, sans-serif",
      fontSizeBase: "14px",
    },
    rules: {
      ".Input": { backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#ffffff" },
      ".Tab": { backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" },
      ".Tab--selected": { backgroundColor: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", color: "#ffffff" },
      ".Label": { color: "rgba(255,255,255,0.6)" },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: `url('${BG}')` }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/75" />

      <div className="relative z-10 flex flex-col min-h-screen px-6 py-10 items-center">
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/subscribe" className="text-white/60 text-sm hover:text-white transition">← Back</Link>
            <img src="/icon.jpg" alt="Guiding Grace" className="w-10 h-10 rounded-xl object-cover border border-white/20" />
          </div>

          {/* Plan badge */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
              Guiding Grace
            </h1>
            <div className="inline-block bg-white/15 border border-white/20 rounded-full px-5 py-1.5">
              <p className="text-white font-semibold text-sm">{modeLabel}</p>
            </div>
            <p className="text-white/40 text-xs mt-2">{modeSub}</p>
          </div>

          {/* What's included */}
          <div className="bg-black/35 backdrop-blur-xl border border-white/12 rounded-3xl p-5 mb-4">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Everything included</p>
            <div className="grid grid-cols-2 gap-y-2 gap-x-3">
              {["Daily Devotions", "Grace Challenge", "His Promises", "Prayer Wall",
                "Nightly Reflections", "Heaven's Hearts", "Shame Recycle Bin", "Heroes & Villains"].map(f => (
                <p key={f} className="text-white/70 text-xs flex items-center gap-1.5">
                  <span className="text-green-400">✓</span>{f}
                </p>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-black/35 backdrop-blur-xl border border-white/12 rounded-3xl p-5">
            {loading ? (
              <p className="text-white/50 text-sm text-center py-8 animate-pulse">Preparing checkout...</p>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-red-300 text-sm mb-3">{error}</p>
                <Link href="/subscribe" className="text-white/60 text-sm underline">Go back</Link>
              </div>
            ) : clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                <CheckoutForm type={intentType as "payment" | "setup"} mode={mode} />
              </Elements>
            ) : null}
          </div>

          <p className="text-white/20 text-xs text-center mt-5">🔒 Payments secured by Stripe</p>

        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url('${BG}')` }}>
        <div className="absolute inset-0 bg-black/65" />
        <p className="relative text-white/50 animate-pulse text-sm">Loading...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
