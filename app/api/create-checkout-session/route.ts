import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia" as any,
});

export async function POST(req: NextRequest) {
  try {
    const { userId, email, mode } = await req.json();
    const customer = await stripe.customers.create({ email, metadata: { userId } });

    const isTrial = mode === "trial" || !mode;
    const isYearly = mode === "yearly";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      payment_method_collection: isTrial ? "if_required" : "always",
      customer: customer.id,
      line_items: [{ price: isYearly ? process.env.STRIPE_YEARLY_PRICE_ID! : process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      subscription_data: {
        ...(isTrial ? { trial_period_days: 3 } : {}),
        metadata: { userId },
      },
      metadata: { userId },
      success_url: "https://guidinggrace.app/success",
      cancel_url: "https://guidinggrace.app/subscribe",
    });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
