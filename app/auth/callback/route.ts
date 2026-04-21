import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const type = requestUrl.searchParams.get("type");

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Password reset links redirect to the reset page instead of dashboard
  if (type === "recovery") {
    return NextResponse.redirect(new URL("/auth/reset-password", requestUrl.origin));
  }

  // If they came from the subscribe flow, send them back to complete checkout
  const next = requestUrl.searchParams.get("next") || "/dashboard";
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
