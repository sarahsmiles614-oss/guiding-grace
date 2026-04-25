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

    const successUrl = "https://guidinggrace.app/success";
    const cancelUrl = "https://guidinggrace.app/subscribe";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      line_items: [{ price: isYearly ? process.env.STRIPE_YEARLY_PRICE_ID! : process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      subscription_data: {
        ...(isTrial ? { trial_period_days: 3 } : {}),
        metadata: { userId },
      },
      metadata: { userId },
      success_url: successUrl,
      cancel_url: cancelUrl,
    } as any);
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
