"use client";

import {
  Recycle,
  QrCode,
  Coins,
  Gift,
  Leaf,
  ArrowDown,
  HelpCircle,
} from "lucide-react";
import { ITEM_CONFIG } from "@/types";

export default function HowItWorksPage() {
  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* ── Header ──────────────────────────────── */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-eco-100 text-eco-700 rounded-full text-sm font-medium mb-4">
          <HelpCircle className="w-4 h-4" />
          Getting Started
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-surface-900 mb-3">
          How EcoToken Works
        </h1>
        <p className="text-surface-500 max-w-lg mx-auto">
          Our campus recycling program makes it easy and rewarding to make
          sustainable choices every day.
        </p>
      </div>

      {/* ── Step-by-step ────────────────────────── */}
      <div className="space-y-4">
        {[
          {
            step: 1,
            icon: QrCode,
            title: "Find a Campus Recycling Bin",
            desc: "Look for EcoToken-enabled bins around campus — in dorms, dining halls, libraries, and academic buildings. Each bin has a unique QR code.",
            color: "bg-blue-100 text-blue-600",
          },
          {
            step: 2,
            icon: Recycle,
            title: "Scan & Recycle",
            desc: "Open EcoToken on your phone, scan the bin's QR code, select your item type, and drop it in. An admin or sensor verifies the deposit.",
            color: "bg-eco-100 text-eco-600",
          },
          {
            step: 3,
            icon: Coins,
            title: "Earn Tokens",
            desc: "Each recycled item earns EcoTokens based on material type. Maintain a daily streak for bonus rewards! Tokens appear in your wallet instantly.",
            color: "bg-amber-100 text-amber-600",
          },
          {
            step: 4,
            icon: Gift,
            title: "Redeem Rewards",
            desc: "Spend your tokens in the Rewards Marketplace — campus café vouchers, community service certificates, eco-friendly merchandise, and unique experiences.",
            color: "bg-purple-100 text-purple-600",
          },
        ].map(({ step, icon: Icon, title, desc, color }, i) => (
          <div key={step}>
            <div className="eco-card p-6 flex gap-5">
              <div
                className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-eco-500 uppercase tracking-widest mb-1">
                  Step {step}
                </p>
                <h3 className="font-display text-lg text-surface-900 mb-1.5">
                  {title}
                </h3>
                <p className="text-sm text-surface-500 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
            {i < 3 && (
              <div className="flex justify-center py-1">
                <ArrowDown className="w-5 h-5 text-surface-300" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Token values ────────────────────────── */}
      <div className="eco-card p-6">
        <h2 className="font-display text-xl text-surface-900 mb-4 flex items-center gap-2">
          <Coins className="w-5 h-5 text-eco-500" />
          Token Values by Item
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(ITEM_CONFIG).map(([key, { label, emoji, tokens }]) => (
            <div
              key={key}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 border border-surface-100"
            >
              <span className="text-xl">{emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-700 truncate">
                  {label}
                </p>
              </div>
              <span className="token-badge text-xs whitespace-nowrap">
                +{tokens}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────── */}
      <div className="eco-card p-6">
        <h2 className="font-display text-xl text-surface-900 mb-5">
          Frequently Asked Questions
        </h2>
        <div className="space-y-5">
          {[
            {
              q: "Who can participate?",
              a: "Any student with a valid university email can sign up and start earning tokens immediately.",
            },
            {
              q: "Do tokens expire?",
              a: "No! Your tokens never expire. Earn at your own pace and redeem whenever you're ready.",
            },
            {
              q: "How does the streak system work?",
              a: "Recycle at least once every 48 hours to keep your streak going. Your streak count shows how many consecutive days you've recycled.",
            },
            {
              q: "Can I use vouchers off-campus?",
              a: "Food vouchers are currently valid at participating on-campus dining locations. We're working on expanding to local partners.",
            },
            {
              q: "How are community service hours verified?",
              a: "When you redeem a service hours certificate, you receive a unique code and a signed PDF that your university's service office can verify.",
            },
          ].map(({ q, a }) => (
            <div key={q}>
              <h3 className="text-sm font-semibold text-surface-800 mb-1">
                {q}
              </h3>
              <p className="text-sm text-surface-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ──────────────────────────── */}
      <div className="text-center pb-8">
        <div className="inline-flex items-center gap-2 text-sm text-surface-400">
          <Leaf className="w-4 h-4 text-eco-400" />
          Every item counts. Start making a difference today.
        </div>
      </div>
    </div>
  );
}
