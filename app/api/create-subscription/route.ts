import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia" as any,
});

export async function POST(req: NextRequest) {
  try {
    const { userId, email, name, mode } = await req.json();

    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { userId },
    });

    const isTrial = mode === "trial" || !mode;
    const isYearly = mode === "yearly";
    const priceId = isYearly
      ? process.env.STRIPE_YEARLY_PRICE_ID!
      : process.env.STRIPE_PRICE_ID!;

    if (isTrial) {
      // Trial — no payment needed upfront, create subscription directly
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        trial_period_days: 3,
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
        metadata: { userId },
      });

      // If there's a setup intent (card to save for after trial), return it
      const setupIntent = (subscription as any).pending_setup_intent;
      if (setupIntent?.client_secret) {
        return NextResponse.json({
          type: "setup",
          clientSecret: setupIntent.client_secret,
          subscriptionId: subscription.id,
          customerId: customer.id,
        });
      }

      // No card needed — subscription is live, just redirect
      return NextResponse.json({ type: "free_trial", subscriptionId: subscription.id });
    }

    // Paid plan — create incomplete subscription and return payment intent secret
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: { userId },
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    return NextResponse.json({
      type: "payment",
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
      customerId: customer.id,
    });
  } catch (err: any) {
    console.error("Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
