import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/leaderboard — top recyclers
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        totalRecycled: true,
        tokenBalance: true,
        currentStreak: true,
      },
      orderBy: { totalRecycled: "desc" },
      take: 25,
    });

    // Mask emails for privacy: "john.doe@uni.edu" -> "j***@uni.edu"
    const masked = users.map((u) => ({
      ...u,
      email: u.email[0] + "***@" + u.email.split("@")[1],
    }));

    return NextResponse.json(masked);
  } catch (error) {
    console.error("[GET /api/leaderboard]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
