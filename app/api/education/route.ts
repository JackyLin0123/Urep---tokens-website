import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { QUIZZES, VIDEOS, getQuizReward, VIDEO_REWARD_TOKENS } from "@/lib/education-data";

export const dynamic = "force-dynamic";

// ── GET /api/education — fetch user's education progress ──

export async function GET() {
  try {
    const supabase = createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Fetch completed quizzes and watched videos using raw SQL
    // (these tables aren't in Prisma schema, they're managed via SQL)
    const quizResults = await prisma.$queryRaw<
      { quiz_id: string; score: number; total_questions: number; tokens_earned: number; completed_at: Date }[]
    >`SELECT quiz_id, score, total_questions, tokens_earned, completed_at 
      FROM user_quiz_results WHERE user_id = ${user.id}::uuid`;

    const watchedVideos = await prisma.$queryRaw<
      { video_id: string; tokens_earned: number; watched_at: Date }[]
    >`SELECT video_id, tokens_earned, watched_at 
      FROM user_watched_videos WHERE user_id = ${user.id}::uuid`;

    // Calculate total education tokens
    const quizTokens = quizResults.reduce((sum, r) => sum + r.tokens_earned, 0);
    const videoTokens = watchedVideos.reduce((sum, v) => sum + v.tokens_earned, 0);

    return NextResponse.json({
      quizResults,
      watchedVideoIds: watchedVideos.map((v) => v.video_id),
      totalEducationTokens: quizTokens + videoTokens,
      quizzesCompleted: quizResults.length,
      videosWatched: watchedVideos.length,
    });
  } catch (error) {
    console.error("[GET /api/education]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST /api/education — submit quiz result or mark video watched ──

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { type } = body as { type: "quiz" | "video" };

    // ── Quiz completion ─────────────────────────
    if (type === "quiz") {
      const { quizId, score, totalQuestions } = body as {
        quizId: string;
        score: number;
        totalQuestions: number;
        type: "quiz";
      };

      // Validate quiz exists
      const quiz = QUIZZES.find((q) => q.id === quizId);
      if (!quiz) {
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
      }

      // Check if already completed
      const existing = await prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM user_quiz_results 
        WHERE user_id = ${user.id}::uuid AND quiz_id = ${quizId}`;

      if (existing.length > 0) {
        return NextResponse.json({ error: "Quiz already completed", alreadyDone: true }, { status: 400 });
      }

      // Calculate reward
      const reward = getQuizReward(score, totalQuestions);

      // Insert result and update user tokens
      await prisma.$executeRaw`
        INSERT INTO user_quiz_results (user_id, quiz_id, score, total_questions, tokens_earned)
        VALUES (${user.id}::uuid, ${quizId}, ${score}, ${totalQuestions}, ${reward.tokens})`;

      if (reward.tokens > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: { tokenBalance: { increment: reward.tokens } },
        });
      }

      return NextResponse.json({
        success: true,
        score,
        totalQuestions,
        tokensEarned: reward.tokens,
        label: reward.label,
        newBalance: user.tokenBalance + reward.tokens,
      });
    }

    // ── Video watched ───────────────────────────
    if (type === "video") {
      const { videoId } = body as { videoId: string; type: "video" };

      // Validate video exists
      const video = VIDEOS.find((v) => v.id === videoId);
      if (!video) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 });
      }

      // Check if already watched
      const existing = await prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM user_watched_videos 
        WHERE user_id = ${user.id}::uuid AND video_id = ${videoId}`;

      if (existing.length > 0) {
        return NextResponse.json({ error: "Video already watched", alreadyDone: true }, { status: 400 });
      }

      // Insert record and update user tokens
      await prisma.$executeRaw`
        INSERT INTO user_watched_videos (user_id, video_id, tokens_earned)
        VALUES (${user.id}::uuid, ${videoId}, ${VIDEO_REWARD_TOKENS})`;

      await prisma.user.update({
        where: { id: user.id },
        data: { tokenBalance: { increment: VIDEO_REWARD_TOKENS } },
      });

      return NextResponse.json({
        success: true,
        tokensEarned: VIDEO_REWARD_TOKENS,
        newBalance: user.tokenBalance + VIDEO_REWARD_TOKENS,
      });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("[POST /api/education]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
