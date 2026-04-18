import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const redirect = requestUrl.searchParams.get("redirect") || "/dashboard";

  const supabase = createRouteHandlerClient({ cookies });

  if (code) {
    // OAuth or PKCE flow
    await supabase.auth.exchangeCodeForSession(code);
  } else if (token_hash && type) {
    // Magic link flow
    await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });
  }

  return NextResponse.redirect(new URL(redirect, requestUrl.origin));
}
