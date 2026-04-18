"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Coins,
  Recycle,
  Flame,
  TrendingUp,
  Gift,
  History,
  QrCode,
  ArrowRight,
  Leaf,
  Trophy,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import Spinner from "@/components/ui/Spinner";
import { ITEM_CONFIG } from "@/types";
import { timeAgo } from "@/lib/utils";
import type { UserProfile, RecyclingEntry } from "@/types";

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [recentLogs, setRecentLogs] = useState<RecyclingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [userRes, logsRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/recycling?limit=5"),
        ]);
        if (userRes.ok) setUser(await userRes.json());
        if (logsRes.ok) {
          const data = await logsRes.json();
          setRecentLogs(data.logs || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Spinner size="lg" />;

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* ── Welcome header ──────────────────────── */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-surface-900 mb-1">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-surface-500 text-sm">
          Keep recycling to grow your streak and earn more tokens.
        </p>
      </div>

      {/* ── Stats grid ──────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Token Balance"
          value={user?.tokenBalance ?? 0}
          icon={Coins}
          color="green"
          animate
        />
        <StatCard
          label="Items Recycled"
          value={user?.totalRecycled ?? 0}
          icon={Recycle}
          color="blue"
          animate
        />
        <StatCard
          label="Day Streak"
          value={user?.currentStreak ?? 0}
          icon={Flame}
          suffix="days"
          color="amber"
          animate
        />
        <StatCard
          label="Best Streak"
          value={user?.longestStreak ?? 0}
          icon={TrendingUp}
          suffix="days"
          color="purple"
          animate
        />
      </div>

      {/* ── Quick actions ───────────────────────── */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          href="/rewards"
          className="eco-card p-5 flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-eco-100 flex items-center justify-center group-hover:bg-eco-200 transition-colors">
            <Gift className="w-6 h-6 text-eco-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-surface-800 text-sm">Redeem Rewards</p>
            <p className="text-xs text-surface-400">Spend your tokens</p>
          </div>
          <ArrowRight className="w-4 h-4 text-surface-300 group-hover:text-eco-500 transition-colors" />
        </Link>

        <Link
          href="/history"
          className="eco-card p-5 flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <History className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-surface-800 text-sm">View History</p>
            <p className="text-xs text-surface-400">See all activity</p>
          </div>
          <ArrowRight className="w-4 h-4 text-surface-300 group-hover:text-blue-500 transition-colors" />
        </Link>

        <Link
          href="/leaderboard"
          className="eco-card p-5 flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
            <Trophy className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-surface-800 text-sm">Leaderboard</p>
            <p className="text-xs text-surface-400">See top recyclers</p>
          </div>
          <ArrowRight className="w-4 h-4 text-surface-300 group-hover:text-amber-500 transition-colors" />
        </Link>
      </div>

      {/* ── Recent activity ─────────────────────── */}
      <div className="eco-card">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="font-display text-lg text-surface-900">Recent Activity</h2>
          <Link
            href="/history"
            className="text-sm text-eco-600 hover:text-eco-700 font-medium"
          >
            View all →
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <div className="px-5 pb-6 text-center py-10">
            <Leaf className="w-10 h-10 text-surface-200 mx-auto mb-3" />
            <p className="text-sm text-surface-400">
              No recycling activity yet. Start by scanning a QR code at any campus bin!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-100">
            {recentLogs.map((log) => {
              const config = ITEM_CONFIG[log.itemType] || ITEM_CONFIG.OTHER;
              return (
                <div
                  key={log.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-50/50 transition-colors"
                >
                  <span className="text-xl">{config.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-800">
                      {config.label}
                      {log.quantity > 1 && (
                        <span className="text-surface-400"> × {log.quantity}</span>
                      )}
                    </p>
                    <p className="text-xs text-surface-400">
                      {timeAgo(log.createdAt)}
                    </p>
                  </div>
                  <span className="token-badge text-xs">
                    +{log.tokensEarned}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── QR Code simulation banner ───────────── */}
      <div className="eco-card eco-gradient p-6 text-white relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -right-2 -bottom-2 w-20 h-20 bg-white/10 rounded-full" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <QrCode className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg mb-0.5">Scan & Recycle</h3>
            <p className="text-sm text-white/80">
              Find a campus bin, scan the QR code, and drop your items to earn tokens instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
