"use client";

import { useEffect, useState } from "react";
import {
  Coins,
  Recycle,
  Flame,
  TrendingUp,
  Award,
  Calendar,
  Mail,
  GraduationCap,
  LogOut,
  Copy,
  Check,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import Spinner from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase-browser";
import { timeAgo } from "@/lib/utils";
import type { UserProfile, RedemptionRecord } from "@/types";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) setUser(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) return <Spinner size="lg" />;
  if (!user) return null;

  const initials = (user.name || user.email)
    .split(/[\s._@]/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div className="space-y-8">
      {/* ── Profile header ──────────────────────── */}
      <div className="eco-card overflow-hidden">
        {/* Green banner */}
        <div className="h-24 eco-gradient relative">
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-2xl bg-white shadow-card flex items-center justify-center border-4 border-white">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <span className="font-display text-2xl text-eco-600">
                  {initials}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 px-6 pb-6">
          <h1 className="font-display text-2xl text-surface-900 mb-1">
            {user.name || user.email.split("@")[0]}
          </h1>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-surface-500 mb-5">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {user.email}
            </span>
            {user.university && (
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                {user.university}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Joined {new Date(user.createdAt || "").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="btn-ghost text-sm text-red-500 hover:bg-red-50 -ml-3"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Token wallet ────────────────────────── */}
      <div className="eco-card eco-gradient p-6 text-white relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full" />
        <div className="absolute right-10 bottom-2 w-16 h-16 bg-white/10 rounded-full" />

        <div className="relative z-10">
          <p className="text-sm text-white/70 uppercase tracking-wider font-medium mb-1">
            Token Wallet
          </p>
          <p className="font-display text-5xl mb-1">{user.tokenBalance}</p>
          <p className="text-sm text-white/70">EcoTokens available to spend</p>
        </div>
      </div>

      {/* ── Stats grid ──────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Recycled"
          value={user.totalRecycled}
          icon={Recycle}
          color="blue"
        />
        <StatCard
          label="Current Streak"
          value={user.currentStreak}
          icon={Flame}
          suffix="days"
          color="amber"
        />
        <StatCard
          label="Best Streak"
          value={user.longestStreak}
          icon={TrendingUp}
          suffix="days"
          color="purple"
        />
        <StatCard
          label="Last Recycled"
          value={user.lastRecycledAt ? timeAgo(user.lastRecycledAt) : "Never"}
          icon={Calendar}
          color="green"
        />
      </div>

      {/* ── Achievements teaser ─────────────────── */}
      <div className="eco-card p-6">
        <h2 className="font-display text-lg text-surface-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Milestones
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { threshold: 10, label: "First Steps", emoji: "🌱" },
            { threshold: 50, label: "Eco Warrior", emoji: "⚔️" },
            { threshold: 100, label: "Green Champion", emoji: "🏆" },
            { threshold: 500, label: "Planet Saver", emoji: "🌍" },
          ].map(({ threshold, label, emoji }) => {
            const unlocked = user.totalRecycled >= threshold;
            return (
              <div
                key={threshold}
                className={`text-center p-4 rounded-xl border transition-all ${
                  unlocked
                    ? "bg-eco-50 border-eco-200"
                    : "bg-surface-50 border-surface-100 opacity-50"
                }`}
              >
                <span className="text-2xl">{emoji}</span>
                <p className="text-xs font-semibold text-surface-700 mt-1.5">
                  {label}
                </p>
                <p className="text-[10px] text-surface-400 mt-0.5">
                  {threshold} items
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
