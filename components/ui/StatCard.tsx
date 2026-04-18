"use client";

import { type LucideIcon } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  suffix?: string;
  color?: "green" | "amber" | "blue" | "purple";
  animate?: boolean;
}

const COLOR_MAP = {
  green:  "bg-eco-50 text-eco-600 border-eco-200",
  amber:  "bg-amber-50 text-amber-600 border-amber-200",
  blue:   "bg-blue-50 text-blue-600 border-blue-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
};

const ICON_BG = {
  green:  "bg-eco-100",
  amber:  "bg-amber-100",
  blue:   "bg-blue-100",
  purple: "bg-purple-100",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  suffix,
  color = "green",
  animate = false,
}: StatCardProps) {
  const displayValue = typeof value === "number" ? formatNumber(value) : value;

  return (
    <div
      className={`eco-card p-5 border ${COLOR_MAP[color]} ${
        animate ? "animate-scale-in" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label mb-1">{label}</p>
          <p className="stat-number">
            {displayValue}
            {suffix && (
              <span className="text-lg font-body text-surface-400 ml-1">
                {suffix}
              </span>
            )}
          </p>
        </div>
        <div className={`p-2.5 rounded-xl ${ICON_BG[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
