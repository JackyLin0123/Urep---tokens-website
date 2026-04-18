import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { generateVoucherCode } from "@/lib/utils";

// GET /api/rewards — list all active rewards
export async function GET() {
  try {
    const rewards = await prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { tokenCost: "asc" },
    });
    return NextResponse.json(rewards);
  } catch (error) {
    console.error("[GET /api/rewards]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/rewards — redeem a reward
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rewardId } = (await req.json()) as { rewardId: string };

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward || !reward.isActive) {
      return NextResponse.json({ error: "Reward not found" }, { status: 404 });
    }

    // Check balance
    if (user.tokenBalance < reward.tokenCost) {
      return NextResponse.json({ error: "Insufficient tokens" }, { status: 400 });
    }

    // Check stock
    if (reward.stock !== null && reward.stock <= 0) {
      return NextResponse.json({ error: "Out of stock" }, { status: 400 });
    }

    const voucherCode = generateVoucherCode();

    // Transaction: create redemption, deduct tokens, reduce stock
    const [redemption] = await prisma.$transaction([
      prisma.redemption.create({
        data: {
          userId: user.id,
          rewardId: reward.id,
          tokensCost: reward.tokenCost,
          status: "FULFILLED",
          code: voucherCode,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { tokenBalance: { decrement: reward.tokenCost } },
      }),
      ...(reward.stock !== null
        ? [
            prisma.reward.update({
              where: { id: reward.id },
              data: { stock: { decrement: 1 } },
            }),
          ]
        : []),
    ]);

    return NextResponse.json({
      redemption,
      code: voucherCode,
      newBalance: user.tokenBalance - reward.tokenCost,
    });
  } catch (error) {
    console.error("[POST /api/rewards]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
