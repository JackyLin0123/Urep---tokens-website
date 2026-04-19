import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/history", "/rewards", "/profile", "/admin", "/leaderboard", "/education"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  const isProtected = PROTECTED_ROUTES.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !session) {
    const redirectUrl = new URL("/auth/login", req.url);
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from login page
  if (req.nextUrl.pathname === "/auth/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|images|api).*)",
  ],
};
