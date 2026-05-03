import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Password reset
  if (type === "recovery") {
    return NextResponse.redirect(new URL("/auth/reset-password", requestUrl.origin));
  }

  // If heading to subscribe, check if they're already a subscriber first
  if (next === "/subscribe") {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status, trial_end_date")
        .eq("user_id", user.id)
        .single();

      const isActive = sub?.status === "active";
      const isTrialing = sub?.status === "trialing" && sub.trial_end_date && new Date(sub.trial_end_date) > new Date();

      if (isActive || isTrialing) {
        return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
      }
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
