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
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        trial_period_days: 3,
        payment_settings: {
          save_default_payment_method: "on_subscription",
          payment_method_types: ["card"],
        },
        expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
        metadata: { userId },
      });

      const setupIntent = (subscription as any).pending_setup_intent;
      if (setupIntent?.client_secret) {
        return NextResponse.json({
          type: "setup",
          clientSecret: setupIntent.client_secret,
          subscriptionId: subscription.id,
          customerId: customer.id,
        });
      }

      return NextResponse.json({ type: "free_trial", subscriptionId: subscription.id });
    }

    // Paid plan — create incomplete subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
        payment_method_types: ["card"],
      },
      expand: ["latest_invoice.payment_intent"],
      metadata: { userId },
    });

    const invoice = subscription.latest_invoice as any;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    // Update PaymentIntent to allow all automatic payment methods incl. Google Pay
    await stripe.paymentIntents.update(paymentIntent.id, {
      automatic_payment_methods: { enabled: true, allow_redirects: "always" },
    } as any);

    // Re-fetch updated secret
    const updatedIntent = await stripe.paymentIntents.retrieve(paymentIntent.id);

    return NextResponse.json({
      type: "payment",
      clientSecret: updatedIntent.client_secret,
      subscriptionId: subscription.id,
      customerId: customer.id,
    });
  } catch (err: any) {
    console.error("Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
