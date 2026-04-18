export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { ITEM_CONFIG } from "@/types";
import type { ItemType } from "@/types";

// POST /api/admin — admin manually adds recycling entry for a user (demo simulation)
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // In production, check isAdmin flag; for demo we allow all authenticated users
    const body = await req.json();
    const { userEmail, itemType, quantity = 1 } = body as {
      userEmail: string;
      itemType: ItemType;
      quantity?: number;
    };

    if (!ITEM_CONFIG[itemType]) {
      return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tokensEarned = ITEM_CONFIG[itemType].tokens * quantity;

    // Create log with admin verification
    const [log] = await prisma.$transaction([
      prisma.recyclingLog.create({
        data: {
          userId: targetUser.id,
          itemType: itemType as any,
          quantity,
          tokensEarned,
          binLocation: "Admin Verified",
          verifiedBy: session.user.email!,
        },
      }),
      prisma.user.update({
        where: { id: targetUser.id },
        data: {
          tokenBalance: { increment: tokensEarned },
          totalRecycled: { increment: quantity },
          lastRecycledAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json({ log, tokensEarned });
  } catch (error) {
    console.error("[POST /api/admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
