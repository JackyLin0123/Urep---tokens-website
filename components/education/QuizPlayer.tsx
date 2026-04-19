"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  Coins,
  RotateCcw,
  ChevronLeft,
} from "lucide-react";
import type { Quiz } from "@/lib/education-data";

interface QuizPlayerProps {
  quiz: Quiz;
  alreadyCompleted: boolean;
  onComplete: (quizId: string, score: number, total: number) => Promise<{
    tokensEarned: number;
    label: string;
  } | null>;
  onBack: () => void;
}

export default function QuizPlayer({
  quiz,
  alreadyCompleted,
  onComplete,
  onBack,
}: QuizPlayerProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<{
    tokensEarned: number;
    label: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const question = quiz.questions[currentQ];
  const isLastQuestion = currentQ === quiz.questions.length - 1;
  const progress = ((currentQ + (showExplanation ? 1 : 0)) / quiz.questions.length) * 100;

  const handleSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      const finalScore = score;
      setFinished(true);
      if (!alreadyCompleted) {
        setSubmitting(true);
        const res = await onComplete(quiz.id, finalScore, quiz.questions.length);
        setResult(res);
        setSubmitting(false);
      }
    } else {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
    setResult(null);
  };

  const percent = Math.round((score / quiz.questions.length) * 100);

  // ── Finished screen ─────────────────────────
  if (finished) {
    return (
      <div className="space-y-6">
        <button onClick={onBack} className="btn-ghost text-sm -ml-3">
          <ChevronLeft className="w-4 h-4" />
          Back to quizzes
        </button>

        <div className="eco-card p-8 text-center">
          {/* Score circle */}
          <div className="w-28 h-28 rounded-full border-4 border-eco-400 flex items-center justify-center mx-auto mb-4 relative">
            <div>
              <p className="font-display text-3xl text-surface-900">
                {score}/{quiz.questions.length}
              </p>
              <p className="text-xs text-surface-400">{percent}%</p>
            </div>
          </div>

          <h2 className="font-display text-2xl text-surface-900 mb-2">
            {result?.label || (alreadyCompleted ? "Already Completed" : "Quiz Complete!")}
          </h2>

          <p className="text-sm text-surface-500 mb-4">
            You answered {score} out of {quiz.questions.length} questions correctly.
          </p>

          {result && result.tokensEarned > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-eco-100 text-eco-700 rounded-full font-semibold mb-6 animate-scale-in">
              <Coins className="w-4 h-4" />
              +{result.tokensEarned} tokens earned!
            </div>
          )}

          {alreadyCompleted && (
            <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-xl mb-4">
              You've already completed this quiz. No additional tokens awarded.
            </p>
          )}

          {result && result.tokensEarned === 0 && !alreadyCompleted && (
            <p className="text-sm text-surface-500 mb-4">
              Score 60% or higher to earn tokens. Give it another try!
            </p>
          )}

          <div className="flex justify-center gap-3 mt-6">
            <button onClick={onBack} className="btn-secondary">
              All Quizzes
            </button>
            <button onClick={handleRestart} className="btn-primary">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Question screen ─────────────────────────
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="btn-ghost text-sm -ml-3">
        <ChevronLeft className="w-4 h-4" />
        Back to quizzes
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-surface-900">
            {quiz.emoji} {quiz.title}
          </h2>
          <p className="text-sm text-surface-400">
            Question {currentQ + 1} of {quiz.questions.length}
          </p>
        </div>
        {alreadyCompleted && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
            Practice Mode
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-eco-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="eco-card p-6">
        <p className="text-lg font-medium text-surface-800 mb-5 leading-relaxed">
          {question.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === question.correctIndex;
            const showResult = showExplanation;

            let optionClass =
              "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3";

            if (!showResult) {
              optionClass += isSelected
                ? " border-eco-400 bg-eco-50"
                : " border-surface-200 hover:border-surface-300 hover:bg-surface-50 cursor-pointer";
            } else if (isCorrect) {
              optionClass += " border-eco-400 bg-eco-50";
            } else if (isSelected && !isCorrect) {
              optionClass += " border-red-300 bg-red-50";
            } else {
              optionClass += " border-surface-100 bg-surface-50 opacity-60";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={showExplanation}
                className={optionClass}
              >
                {/* Option letter */}
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                    showResult && isCorrect
                      ? "bg-eco-500 text-white"
                      : showResult && isSelected && !isCorrect
                      ? "bg-red-400 text-white"
                      : "bg-surface-100 text-surface-600"
                  }`}
                >
                  {showResult && isCorrect ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : showResult && isSelected && !isCorrect ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    String.fromCharCode(65 + idx)
                  )}
                </span>

                <span
                  className={`text-sm ${
                    showResult && isCorrect
                      ? "text-eco-700 font-medium"
                      : showResult && isSelected
                      ? "text-red-700"
                      : "text-surface-700"
                  }`}
                >
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-slide-up">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">💡 Explanation: </span>
              {question.explanation}
            </p>
          </div>
        )}

        {/* Next button */}
        {showExplanation && (
          <button onClick={handleNext} className="btn-primary mt-5 w-full py-3">
            {isLastQuestion ? (
              <>
                <Trophy className="w-4 h-4" />
                See Results
              </>
            ) : (
              <>
                Next Question
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
