"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Flame, Recycle, Crown } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import type { LeaderboardEntry } from "@/types";

const RANK_STYLES: Record<number, { bg: string; text: string; icon: typeof Crown }> = {
  1: { bg: "bg-amber-50 border-amber-200", text: "text-amber-600", icon: Crown },
  2: { bg: "bg-surface-50 border-surface-200", text: "text-surface-500", icon: Medal },
  3: { bg: "bg-orange-50 border-orange-200", text: "text-orange-500", icon: Medal },
};

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/leaderboard");
        if (res.ok) setEntries(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* ── Header ──────────────────────────────── */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-3">
          <Trophy className="w-4 h-4" />
          Campus Rankings
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-surface-900 mb-1">
          Leaderboard
        </h1>
        <p className="text-sm text-surface-500">
          The top recyclers on campus this semester.
        </p>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No entries yet"
          description="Be the first to recycle and claim the #1 spot!"
        />
      ) : (
        <>
          {/* ── Top 3 podium ─────────────────────── */}
          {entries.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 items-end">
              {[entries[1], entries[0], entries[2]].map((entry, i) => {
                const rank = [2, 1, 3][i];
                const height = rank === 1 ? "pt-4" : rank === 2 ? "pt-8" : "pt-10";
                return (
                  <div key={entry.id} className={`text-center ${height}`}>
                    <div
                      className={`eco-card p-4 border ${
                        RANK_STYLES[rank]?.bg || ""
                      } ${RANK_STYLES[rank]?.text || ""}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-2 text-lg font-display">
                        {rank === 1 ? "👑" : rank === 2 ? "🥈" : "🥉"}
                      </div>
                      <p className="font-semibold text-surface-800 text-sm truncate">
                        {entry.name || entry.email}
                      </p>
                      <p className="text-2xl font-display text-surface-900 mt-1">
                        {entry.totalRecycled}
                      </p>
                      <p className="text-[10px] text-surface-400 uppercase tracking-wider">
                        items
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Full list ────────────────────────── */}
          <div className="eco-card overflow-hidden">
            <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-surface-50 border-b border-surface-100 text-xs font-semibold text-surface-500 uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Student</div>
              <div className="col-span-2 text-center">Items</div>
              <div className="col-span-2 text-center">Streak</div>
              <div className="col-span-2 text-right">Tokens</div>
            </div>

            <div className="divide-y divide-surface-100">
              {entries.map((entry, i) => {
                const rank = i + 1;
                return (
                  <div
                    key={entry.id}
                    className={`grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-surface-50/50 transition-colors ${
                      rank <= 3 ? "bg-amber-50/30" : ""
                    }`}
                  >
                    <div className="col-span-1">
                      <span
                        className={`text-sm font-bold ${
                          rank <= 3 ? "text-amber-500" : "text-surface-400"
                        }`}
                      >
                        {rank}
                      </span>
                    </div>
                    <div className="col-span-5">
                      <p className="text-sm font-medium text-surface-800 truncate">
                        {entry.name || entry.email}
                      </p>
                      <p className="text-xs text-surface-400 truncate">
                        {entry.email}
                      </p>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center gap-1 text-sm text-surface-700">
                        <Recycle className="w-3.5 h-3.5 text-eco-500" />
                        {entry.totalRecycled}
                      </span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center gap-1 text-sm text-surface-700">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        {entry.currentStreak}d
                      </span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="token-badge text-xs">
                        {entry.tokenBalance}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
