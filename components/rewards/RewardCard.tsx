"use client";

import { useState } from "react";
import { Coins, ShoppingBag, Check, Loader2 } from "lucide-react";
import { CATEGORY_CONFIG } from "@/types";
import type { RewardItem } from "@/types";

interface RewardCardProps {
  reward: RewardItem;
  userBalance: number;
  onRedeem: (rewardId: string) => Promise<boolean>;
}

export default function RewardCard({ reward, userBalance, onRedeem }: RewardCardProps) {
  const [loading, setLoading] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const canAfford = userBalance >= reward.tokenCost;
  const inStock = reward.stock === null || reward.stock > 0;
  const category = CATEGORY_CONFIG[reward.category];

  const handleRedeem = async () => {
    if (!canAfford || !inStock || loading || redeemed) return;
    setLoading(true);
    try {
      const success = await onRedeem(reward.id);
      if (success) setRedeemed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eco-card overflow-hidden flex flex-col">
      {/* Category header band */}
      <div className="h-1.5 eco-gradient" />

      <div className="p-5 flex-1 flex flex-col">
        {/* Category tag */}
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full w-fit mb-3 ${category.color}`}
        >
          {category.emoji} {category.label}
        </span>

        <h3 className="font-display text-lg text-surface-900 mb-2 leading-tight">
          {reward.name}
        </h3>

        <p className="text-sm text-surface-500 mb-4 flex-1 line-clamp-2">
          {reward.description}
        </p>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mb-4">
          <div className="token-badge">
            <Coins className="w-3.5 h-3.5" />
            {reward.tokenCost} tokens
          </div>
          {reward.stock !== null && (
            <span className="text-xs text-surface-400">
              {reward.stock} left
            </span>
          )}
        </div>

        {/* Redeem button */}
        <button
          onClick={handleRedeem}
          disabled={!canAfford || !inStock || loading || redeemed}
          className={`w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
            redeemed
              ? "bg-eco-100 text-eco-700 cursor-default"
              : canAfford && inStock
              ? "btn-primary"
              : "bg-surface-100 text-surface-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : redeemed ? (
            <>
              <Check className="w-4 h-4" />
              Redeemed!
            </>
          ) : !inStock ? (
            "Out of Stock"
          ) : !canAfford ? (
            `Need ${reward.tokenCost - userBalance} more tokens`
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              Redeem
            </>
          )}
        </button>
      </div>
    </div>
  );
}
