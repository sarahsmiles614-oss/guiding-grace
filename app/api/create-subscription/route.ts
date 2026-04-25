import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia" as any,
});

// Stripe expand can return either an object or a string ID — handle both
function resolveId(val: any): string | null {
  if (!val) return null;
  if (typeof val === "string") return val;
  return val.id ?? null;
}

function resolveClientSecret(val: any): string | null {
  if (!val) return null;
  if (typeof val === "string") return null; // only an ID, not expanded
  return val.client_secret ?? null;
}

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
        },
        expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
        metadata: { userId },
      });

      const rawSetup = (subscription as any).pending_setup_intent;
      const setupSecret = resolveClientSecret(rawSetup);
      if (setupSecret) {
        return NextResponse.json({
          type: "setup",
          clientSecret: setupSecret,
          subscriptionId: subscription.id,
          customerId: customer.id,
        });
      }

      // No card required for this trial — subscription is live
      return NextResponse.json({ type: "free_trial", subscriptionId: subscription.id });
    }

    // Paid plan — create incomplete subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      metadata: { userId },
    });

    // Explicitly retrieve the invoice so we always get the full object
    const invoiceId = resolveId(subscription.latest_invoice);
    if (!invoiceId) {
      return NextResponse.json({ error: "No invoice found on subscription." }, { status: 500 });
    }
    const invoice = await stripe.invoices.retrieve(invoiceId);
    const paymentIntentId = resolveId(invoice.payment_intent);

    if (!paymentIntentId) {
      return NextResponse.json({ error: "No payment intent on invoice." }, { status: 500 });
    }

    // Update PaymentIntent to allow all automatic payment methods
    await stripe.paymentIntents.update(paymentIntentId, {
      automatic_payment_methods: { enabled: true, allow_redirects: "always" },
    } as any);

    // Re-fetch to get updated client secret
    const updatedIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

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
