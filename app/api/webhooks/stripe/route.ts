import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const session = event.data.object as any;
  const userId = session?.metadata?.userId || session?.subscription_data?.metadata?.userId;

  if (event.type === "checkout.session.completed") {
    const sub = await stripe.subscriptions.retrieve(session.subscription);
    await supabase.from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      status: sub.status,
      trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
      current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
    }, { onConflict: "user_id" });
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const uid = sub.metadata?.userId;
    if (uid) {
      await supabase.from("subscriptions").upsert({
        user_id: uid,
        stripe_subscription_id: sub.id,
        status: sub.status,
        trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
        current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
      }, { onConflict: "user_id" });
    }
  }

  return NextResponse.json({ received: true });
}
