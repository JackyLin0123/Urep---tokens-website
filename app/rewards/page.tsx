"use client";

import { useEffect, useState } from "react";
import { Coins, Filter, ShoppingBag } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import RewardCard from "@/components/rewards/RewardCard";
import { CATEGORY_CONFIG } from "@/types";
import type { RewardItem, RewardCategory, UserProfile } from "@/types";

const ALL_CATEGORIES: (RewardCategory | "ALL")[] = [
  "ALL",
  "SERVICE_HOURS",
  "FOOD_VOUCHER",
  "MERCHANDISE",
  "EXPERIENCE",
];

export default function RewardsPage() {
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [category, setCategory] = useState<RewardCategory | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [rewardsRes, userRes] = await Promise.all([
          fetch("/api/rewards"),
          fetch("/api/auth/me"),
        ]);
        if (rewardsRes.ok) setRewards(await rewardsRes.json());
        if (userRes.ok) setUser(await userRes.json());
      } catch (err) {
        console.error("Failed to load rewards:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRedeem = async (rewardId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local balance
        setUser((prev) =>
          prev ? { ...prev, tokenBalance: data.newBalance } : prev
        );
        // Update stock
        setRewards((prev) =>
          prev.map((r) =>
            r.id === rewardId && r.stock !== null
              ? { ...r, stock: r.stock - 1 }
              : r
          )
        );
        setToast(`Redeemed! Your code: ${data.code}`);
        setTimeout(() => setToast(null), 5000);
        return true;
      } else {
        const err = await res.json();
        setToast(err.error || "Redemption failed");
        setTimeout(() => setToast(null), 3000);
        return false;
      }
    } catch {
      return false;
    }
  };

  const filtered =
    category === "ALL"
      ? rewards
      : rewards.filter((r) => r.category === category);

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* ── Header with balance ─────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-surface-900 mb-1">
            Rewards Marketplace
          </h1>
          <p className="text-sm text-surface-500">
            Redeem your EcoTokens for rewards and experiences.
          </p>
        </div>
        <div className="eco-card px-5 py-3 flex items-center gap-3 sm:flex-shrink-0">
          <Coins className="w-5 h-5 text-eco-500" />
          <div>
            <p className="text-xs text-surface-400">Your Balance</p>
            <p className="font-display text-xl text-surface-900">
              {user?.tokenBalance ?? 0}{" "}
              <span className="text-sm font-body text-surface-400">tokens</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Category filter tabs ─────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {ALL_CATEGORIES.map((cat) => {
          const active = category === cat;
          const label =
            cat === "ALL" ? "All" : CATEGORY_CONFIG[cat].label;
          const emoji =
            cat === "ALL" ? "✨" : CATEGORY_CONFIG[cat].emoji;

          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                active
                  ? "bg-eco-600 text-white shadow-sm"
                  : "bg-white text-surface-600 border border-surface-200 hover:bg-surface-50"
              }`}
            >
              <span>{emoji}</span>
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Rewards grid ─────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No rewards in this category"
          description="Check back soon — new rewards are added regularly!"
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              userBalance={user?.tokenBalance ?? 0}
              onRedeem={handleRedeem}
            />
          ))}
        </div>
      )}

      {/* ── Toast notification ───────────────────── */}
      {toast && (
        <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-surface-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
