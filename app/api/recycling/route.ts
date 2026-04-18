export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { ITEM_CONFIG } from "@/types";
import type { ItemType } from "@/types";

// GET /api/recycling — list user's recycling history
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [logs, total] = await Promise.all([
      prisma.recyclingLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.recyclingLog.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/recycling]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/recycling — log a new recycling entry
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { itemType, quantity = 1, binLocation } = body as {
      itemType: ItemType;
      quantity?: number;
      binLocation?: string;
    };

    // Validate item type
    if (!ITEM_CONFIG[itemType]) {
      return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
    }

    const tokensEarned = ITEM_CONFIG[itemType].tokens * quantity;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Calculate streak
    const now = new Date();
    const lastRecycled = user.lastRecycledAt;
    let newStreak = user.currentStreak;

    if (lastRecycled) {
      const hoursSince = (now.getTime() - lastRecycled.getTime()) / (1000 * 60 * 60);
      if (hoursSince < 48) {
        // Within 48 hours — continue streak
        const lastDay = lastRecycled.toDateString();
        const today = now.toDateString();
        if (lastDay !== today) {
          newStreak += 1;
        }
      } else {
        // Streak broken
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    // Create log and update user in a transaction
    const [log] = await prisma.$transaction([
      prisma.recyclingLog.create({
        data: {
          userId: user.id,
          itemType: itemType as any,
          quantity,
          tokensEarned,
          binLocation: binLocation || null,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          tokenBalance: { increment: tokensEarned },
          totalRecycled: { increment: quantity },
          currentStreak: newStreak,
          longestStreak: Math.max(user.longestStreak, newStreak),
          lastRecycledAt: now,
        },
      }),
    ]);

    return NextResponse.json({
      log,
      tokensEarned,
      newBalance: user.tokenBalance + tokensEarned,
      streak: newStreak,
    });
  } catch (error) {
    console.error("[POST /api/recycling]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
