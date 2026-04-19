"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  MonitorPlay,
  Coins,
  Trophy,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import QuizPlayer from "@/components/education/QuizPlayer";
import VideoCard from "@/components/education/VideoCard";
import { QUIZZES, VIDEOS } from "@/lib/education-data";
import type { UserProfile } from "@/types";

type Tab = "quizzes" | "videos";

interface EducationProgress {
  quizResults: { quiz_id: string; score: number; total_questions: number; tokens_earned: number }[];
  watchedVideoIds: string[];
  totalEducationTokens: number;
  quizzesCompleted: number;
  videosWatched: number;
}

export default function EducationPage() {
  const [tab, setTab] = useState<Tab>("quizzes");
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [progress, setProgress] = useState<EducationProgress | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // ── Load data ───────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [userRes, eduRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/education"),
        ]);
        if (userRes.ok) setUser(await userRes.json());
        if (eduRes.ok) setProgress(await eduRes.json());
      } catch (err) {
        console.error("Failed to load education data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Quiz completion handler ─────────────────
  const handleQuizComplete = async (
    quizId: string,
    score: number,
    total: number
  ) => {
    try {
      const res = await fetch("/api/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "quiz", quizId, score, totalQuestions: total }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update local state
        setUser((prev) =>
          prev ? { ...prev, tokenBalance: data.newBalance } : prev
        );
        setProgress((prev) =>
          prev
            ? {
                ...prev,
                quizzesCompleted: prev.quizzesCompleted + 1,
                totalEducationTokens: prev.totalEducationTokens + data.tokensEarned,
                quizResults: [
                  ...prev.quizResults,
                  { quiz_id: quizId, score, total_questions: total, tokens_earned: data.tokensEarned },
                ],
              }
            : prev
        );
        if (data.tokensEarned > 0) {
          showToast(`${data.label} +${data.tokensEarned} tokens earned!`);
        }
        return { tokensEarned: data.tokensEarned, label: data.label };
      }

      if (data.alreadyDone) {
        return { tokensEarned: 0, label: "Already Completed" };
      }
      return null;
    } catch {
      return null;
    }
  };

  // ── Video watched handler ───────────────────
  const handleVideoWatched = async (videoId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "video", videoId }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser((prev) =>
          prev ? { ...prev, tokenBalance: data.newBalance } : prev
        );
        setProgress((prev) =>
          prev
            ? {
                ...prev,
                videosWatched: prev.videosWatched + 1,
                totalEducationTokens: prev.totalEducationTokens + data.tokensEarned,
                watchedVideoIds: [...prev.watchedVideoIds, videoId],
              }
            : prev
        );
        showToast(`+${data.tokensEarned} tokens for watching!`);
        return true;
      }
      if (data.alreadyDone) showToast("You've already earned tokens for this video.");
      return false;
    } catch {
      return false;
    }
  };

  if (loading) return <Spinner size="lg" />;

  // ── Active quiz view ────────────────────────
  if (activeQuiz) {
    const quiz = QUIZZES.find((q) => q.id === activeQuiz)!;
    const alreadyCompleted = progress?.quizResults.some(
      (r) => r.quiz_id === activeQuiz
    ) ?? false;

    return (
      <QuizPlayer
        quiz={quiz}
        alreadyCompleted={alreadyCompleted}
        onComplete={handleQuizComplete}
        onBack={() => setActiveQuiz(null)}
      />
    );
  }

  // ── Main education hub ──────────────────────
  const completedQuizIds = new Set(progress?.quizResults.map((r) => r.quiz_id) || []);
  const watchedVideoIds = new Set(progress?.watchedVideoIds || []);

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────── */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-eco-100 text-eco-700 rounded-full text-sm font-medium mb-3">
          <GraduationCap className="w-4 h-4" />
          Education Hub
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-surface-900 mb-1">
          Learn & Earn
        </h1>
        <p className="text-sm text-surface-500">
          Take quizzes and watch videos about sustainability to earn EcoTokens.
        </p>
      </div>

      {/* ── Progress card ───────────────────── */}
      <div className="eco-card eco-gradient p-5 text-white relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute right-8 bottom-1 w-14 h-14 bg-white/10 rounded-full" />

        <div className="relative z-10">
          <p className="text-sm text-white/70 font-medium mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            My Learning Progress
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="font-display text-2xl">{progress?.totalEducationTokens ?? 0}</p>
              <p className="text-xs text-white/70">Tokens Earned</p>
            </div>
            <div>
              <p className="font-display text-2xl">
                {progress?.quizzesCompleted ?? 0}/{QUIZZES.length}
              </p>
              <p className="text-xs text-white/70">Quizzes Done</p>
            </div>
            <div>
              <p className="font-display text-2xl">
                {progress?.videosWatched ?? 0}/{VIDEOS.length}
              </p>
              <p className="text-xs text-white/70">Videos Watched</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────── */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("quizzes")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === "quizzes"
              ? "bg-eco-600 text-white shadow-sm"
              : "bg-white text-surface-600 border border-surface-200 hover:bg-surface-50"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Quizzes
        </button>
        <button
          onClick={() => setTab("videos")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === "videos"
              ? "bg-eco-600 text-white shadow-sm"
              : "bg-white text-surface-600 border border-surface-200 hover:bg-surface-50"
          }`}
        >
          <MonitorPlay className="w-4 h-4" />
          Watch & Learn
        </button>
      </div>

      {/* ── Quizzes tab ─────────────────────── */}
      {tab === "quizzes" && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {QUIZZES.map((quiz) => {
              const completed = completedQuizIds.has(quiz.id);
              const result = progress?.quizResults.find(
                (r) => r.quiz_id === quiz.id
              );

              return (
                <div
                  key={quiz.id}
                  className="eco-card p-5 flex flex-col cursor-pointer hover:shadow-card-hover transition-all"
                  onClick={() => setActiveQuiz(quiz.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{quiz.emoji}</span>
                      <div>
                        <h3 className="font-display text-lg text-surface-900 leading-tight">
                          {quiz.title}
                        </h3>
                        <span className="text-xs text-surface-400">
                          {quiz.questions.length} questions · {quiz.category}
                        </span>
                      </div>
                    </div>
                    {completed && (
                      <CheckCircle2 className="w-5 h-5 text-eco-500 flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-sm text-surface-500 mb-4 flex-1">
                    {quiz.description}
                  </p>

                  <div className="flex items-center justify-between">
                    {completed && result ? (
                      <span className="text-xs bg-eco-100 text-eco-700 px-2.5 py-1 rounded-full font-medium">
                        Score: {result.score}/{result.total_questions} · +{result.tokens_earned} tokens
                      </span>
                    ) : (
                      <span className="text-xs text-surface-400 flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        Earn up to 25 tokens
                      </span>
                    )}
                    <span className="text-xs text-eco-600 font-medium flex items-center gap-1">
                      {completed ? "Retake" : "Start"}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Token reward explanation */}
          <div className="eco-card p-4">
            <p className="text-sm font-medium text-surface-700 mb-2 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Quiz Rewards
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "100%", tokens: 25, color: "bg-eco-100 text-eco-700" },
                { label: "80%+", tokens: 20, color: "bg-blue-100 text-blue-700" },
                { label: "60%+", tokens: 10, color: "bg-amber-100 text-amber-700" },
              ].map(({ label, tokens, color }) => (
                <div key={label} className={`${color} rounded-xl py-2 px-3`}>
                  <p className="text-xs font-semibold">{label}</p>
                  <p className="text-sm font-display">+{tokens}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Videos tab ──────────────────────── */}
      {tab === "videos" && (
        <div className="grid sm:grid-cols-2 gap-5">
          {VIDEOS.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              watched={watchedVideoIds.has(video.id)}
              onMarkWatched={handleVideoWatched}
            />
          ))}
        </div>
      )}

      {/* ── Toast notification ──────────────── */}
      {toast && (
        <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-surface-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2">
            <Coins className="w-4 h-4 text-eco-400" />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
