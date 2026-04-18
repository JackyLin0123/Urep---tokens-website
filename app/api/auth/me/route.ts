export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { emailToName } from "@/lib/utils";

// GET /api/auth/me — return current user profile, auto-create if first visit
export async function GET() {
  try {
    const supabase = createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email!;

    // Upsert: create profile on first login
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          email,
          name:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            emailToName(email),
          avatarUrl: session.user.user_metadata?.avatar_url || null,
          university: email.split("@")[1]?.replace(".edu", "") || null,
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[/api/auth/me]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
