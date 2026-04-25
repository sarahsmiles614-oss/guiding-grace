import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-03-25.dahlia" as any });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function safeDate(val: any) {
  if (!val) return null;
  try { const d = new Date(val * 1000); return isNaN(d.getTime()) ? null : d.toISOString(); } 
  catch { return null; }
}

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

  if (event.type === "checkout.session.completed") {
    const userId = session?.metadata?.userId;
    if (!userId) return NextResponse.json({ received: true });
    const sub = await stripe.subscriptions.retrieve(session.subscription);
    await supabase.from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      status: sub.status,
      trial_end_date: safeDate(sub.trial_end),
      current_period_end: safeDate((sub as any).current_period_end),
    }, { onConflict: "user_id" });
  }

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const uid = sub.metadata?.userId;
    if (uid) {
      await supabase.from("subscriptions").upsert({
        user_id: uid,
        stripe_customer_id: sub.customer,
        stripe_subscription_id: sub.id,
        status: sub.status,
        trial_end_date: safeDate(sub.trial_end),
        current_period_end: safeDate((sub as any).current_period_end),
      }, { onConflict: "user_id" });
    }
  }

  return NextResponse.json({ received: true });
}
