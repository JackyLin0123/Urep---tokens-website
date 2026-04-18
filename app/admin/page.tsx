"use client";

import { useState } from "react";
import {
  Shield,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  QrCode,
} from "lucide-react";
import { ITEM_CONFIG } from "@/types";
import type { ItemType } from "@/types";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [itemType, setItemType] = useState<ItemType>("PLASTIC_BOTTLE");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Simple QR simulation state
  const [showQR, setShowQR] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: email, itemType, quantity }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({
          type: "success",
          message: `Added ${data.tokensEarned} tokens to ${email} for ${quantity}× ${ITEM_CONFIG[itemType].label}`,
        });
        setQuantity(1);
      } else {
        setResult({ type: "error", message: data.error || "Failed to add tokens" });
      }
    } catch {
      setResult({ type: "error", message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const simulateQRScan = () => {
    setShowQR(true);
    setQrScanned(false);
    setTimeout(() => {
      setQrScanned(true);
    }, 2000);
  };

  const tokensPreview = ITEM_CONFIG[itemType].tokens * quantity;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* ── Header ──────────────────────────────── */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-3">
          <Shield className="w-4 h-4" />
          Admin Demo Mode
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-surface-900 mb-1">
          Admin Panel
        </h1>
        <p className="text-sm text-surface-500">
          Simulate bin verification by manually awarding tokens to students.
          In production, this would be triggered by smart bin sensors or staff verification.
        </p>
      </div>

      {/* ── QR Code Simulation ──────────────────── */}
      <div className="eco-card p-6">
        <h2 className="font-display text-lg text-surface-900 mb-4 flex items-center gap-2">
          <QrCode className="w-5 h-5 text-eco-500" />
          QR Code Check-in Simulation
        </h2>
        <p className="text-sm text-surface-500 mb-4">
          In a real deployment, students scan this QR code at a recycling bin to check in.
        </p>

        <div className="flex flex-col items-center gap-4">
          {showQR ? (
            <div className="text-center space-y-4">
              {/* Simulated QR code */}
              <div className="w-48 h-48 bg-surface-900 rounded-2xl mx-auto flex items-center justify-center p-4 relative">
                <div className="grid grid-cols-8 gap-0.5 w-full h-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-[1px] ${
                        Math.random() > 0.4 ? "bg-white" : "bg-surface-900"
                      }`}
                    />
                  ))}
                </div>
                {qrScanned && (
                  <div className="absolute inset-0 bg-eco-500/90 rounded-2xl flex items-center justify-center animate-scale-in">
                    <CheckCircle2 className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-surface-700">
                {qrScanned
                  ? "Scan verified! Student checked in."
                  : "Scanning..."}
              </p>
              {qrScanned && (
                <button
                  onClick={() => setShowQR(false)}
                  className="btn-ghost text-sm"
                >
                  Reset
                </button>
              )}
            </div>
          ) : (
            <button onClick={simulateQRScan} className="btn-secondary">
              <QrCode className="w-4 h-4" />
              Simulate QR Scan
            </button>
          )}
        </div>
      </div>

      {/* ── Manual token form ───────────────────── */}
      <div className="eco-card p-6">
        <h2 className="font-display text-lg text-surface-900 mb-5 flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          Award Tokens Manually
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Student email */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Student Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-eco-500/40 focus:border-eco-400 transition-all"
              required
            />
          </div>

          {/* Item type selector */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Item Type
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {(Object.entries(ITEM_CONFIG) as [ItemType, typeof ITEM_CONFIG[ItemType]][]).map(
                ([key, { label, emoji, tokens }]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setItemType(key)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${
                      itemType === key
                        ? "border-eco-400 bg-eco-50 ring-2 ring-eco-500/20"
                        : "border-surface-200 bg-white hover:bg-surface-50"
                    }`}
                  >
                    <span className="text-lg">{emoji}</span>
                    <span className="text-[10px] font-medium text-surface-600 leading-tight">
                      {label}
                    </span>
                    <span className="text-[10px] text-eco-600 font-semibold">
                      +{tokens}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl border border-surface-200 flex items-center justify-center text-lg font-medium text-surface-600 hover:bg-surface-50"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                min={1}
                max={100}
                className="w-20 text-center px-3 py-2 rounded-xl border border-surface-200 bg-surface-50 text-surface-800 font-medium focus:outline-none focus:ring-2 focus:ring-eco-500/40"
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl border border-surface-200 flex items-center justify-center text-lg font-medium text-surface-600 hover:bg-surface-50"
              >
                +
              </button>
              <span className="token-badge ml-auto">
                = {tokensPreview} tokens
              </span>
            </div>
          </div>

          {/* Result message */}
          {result && (
            <div
              className={`flex items-start gap-2 p-3 rounded-xl text-sm ${
                result.type === "success"
                  ? "bg-eco-50 text-eco-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {result.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              )}
              {result.message}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} className="w-full btn-primary py-3">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Award {tokensPreview} Tokens
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
