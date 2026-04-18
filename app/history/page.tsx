"use client";

import { useEffect, useState } from "react";
import { History as HistoryIcon, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import { ITEM_CONFIG } from "@/types";
import type { RecyclingEntry } from "@/types";

export default function HistoryPage() {
  const [logs, setLogs] = useState<RecyclingEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/recycling?page=${p}&limit=15`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-surface-900 mb-1">
          Recycling History
        </h1>
        <p className="text-sm text-surface-500">
          A complete log of every item you've recycled.
        </p>
      </div>

      {loading ? (
        <Spinner size="lg" />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No recycling history yet"
          description="Start recycling on campus to see your activity here."
        />
      ) : (
        <>
          {/* ── Log table ─────────────────────────── */}
          <div className="eco-card overflow-hidden">
            {/* Desktop table header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-surface-50 border-b border-surface-100 text-xs font-semibold text-surface-500 uppercase tracking-wider">
              <div className="col-span-3">Date</div>
              <div className="col-span-4">Item</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-3 text-right">Tokens Earned</div>
            </div>

            <div className="divide-y divide-surface-100">
              {logs.map((log) => {
                const config = ITEM_CONFIG[log.itemType] || ITEM_CONFIG.OTHER;
                const { date, time } = formatDate(log.createdAt);

                return (
                  <div
                    key={log.id}
                    className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-surface-50/50 transition-colors"
                  >
                    {/* Date */}
                    <div className="col-span-5 sm:col-span-3">
                      <p className="text-sm font-medium text-surface-800">{date}</p>
                      <p className="text-xs text-surface-400">{time}</p>
                    </div>

                    {/* Item */}
                    <div className="col-span-7 sm:col-span-4 flex items-center gap-2">
                      <span className="text-lg">{config.emoji}</span>
                      <span className="text-sm text-surface-700">{config.label}</span>
                    </div>

                    {/* Quantity */}
                    <div className="hidden sm:block col-span-2 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-surface-100 text-sm font-medium text-surface-700">
                        {log.quantity}
                      </span>
                    </div>

                    {/* Tokens */}
                    <div className="hidden sm:flex col-span-3 justify-end">
                      <span className="token-badge">+{log.tokensEarned}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Pagination ────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="btn-ghost p-2 disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-surface-500 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="btn-ghost p-2 disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
