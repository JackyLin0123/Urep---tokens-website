import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  const supabase = createRouteHandlerClient({ cookies });

  try {
    if (token_hash && type) {
      // Magic link — verify directly
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as any,
      });
      if (error) console.error("verifyOtp error:", error);
    } else if (code) {
      // OAuth flow
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) console.error("exchangeCode error:", error);
    }
  } catch (error) {
    console.error("Auth callback error:", error);
  }

  return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
}