"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/hooks/useSocket";
import { Bell, CheckCircle, Info, Rocket, X, AlertCircle } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Notification {
  type: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

/**
 * Custom toast event emitted by hooks (e.g. useVoting) that need to
 * show a toast without going through the WebSocket.
 *
 * Dispatch via:
 *   window.dispatchEvent(
 *     new CustomEvent<ToastEventDetail>("stellar:toast", { detail })
 *   );
 */
export interface ToastEventDetail {
  type: string;
  title: string;
  message: string;
  /** Optional href rendered as a small "View →" link inside the toast */
  href?: string;
}

// ─── Icon helper ────────────────────────────────────────────────────────────

function ToastIcon({ type }: { type: string }) {
  switch (type) {
    case "grant_created":
      return <Info className="text-blue-400" size={20} />;
    case "grant_updated":
      return <CheckCircle className="text-green-400" size={20} />;
    case "milestone_submitted":
      return <Rocket className="text-orange-400" size={20} />;
    case "vote_recorded":
      return <CheckCircle className="text-green-400" size={20} />;
    case "vote_error":
      return <AlertCircle className="text-red-400" size={20} />;
    default:
      return <Bell className="text-purple-400" size={20} />;
  }
}

// ─── Socket notification → display helpers ──────────────────────────────────

function getSocketTitle(type: string): string {
  switch (type) {
    case "grant_created":       return "New Grant Created";
    case "grant_updated":       return "Grant Updated";
    case "milestone_submitted": return "Milestone Submitted";
    default:                    return "Notification";
  }
}

function getSocketMessage(notification: Notification): string {
  const { type, payload } = notification;
  switch (type) {
    case "grant_created":
      return `Grant "${payload.title}" has been successfully registered on-chain.`;
    case "grant_updated":
      return `Grant "${payload.title}" status changed from ${payload.oldStatus} to ${payload.newStatus}.`;
    case "milestone_submitted":
      return `A new milestone proof has been submitted for Grant #${payload.grantId} (Milestone ${Number(payload.milestoneIdx) + 1}).`;
    default:
      return "You have a new update.";
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

interface ActiveToast {
  type: string;
  title: string;
  message: string;
  href?: string;
}

const AUTO_HIDE_MS = 5000;

export const NotificationToast: React.FC = () => {
  const { lastNotification } = useSocket();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<ActiveToast | null>(null);

  // Single timer ref — cleared before each new toast so rapid-fire
  // notifications never leave a stale hide-timer running.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  // ── 1. Socket-pushed notifications ──────────────────────────────────────
  useEffect(() => {
    if (!lastNotification) return;

    if (timerRef.current !== null) clearTimeout(timerRef.current);

    setCurrent({
      type:    lastNotification.type,
      title:   getSocketTitle(lastNotification.type),
      message: getSocketMessage(lastNotification),
    });
    setVisible(true);

    timerRef.current = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
  }, [lastNotification]);

  // ── 2. Custom DOM events (from hooks like useVoting) ─────────────────────
  useEffect(() => {
    function handleCustom(e: Event) {
      const { type, title, message, href } =
        (e as CustomEvent<ToastEventDetail>).detail;

      if (timerRef.current !== null) clearTimeout(timerRef.current);

      setCurrent({ type, title, message, href });
      setVisible(true);

      timerRef.current = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
    }

    window.addEventListener("stellar:toast", handleCustom);
    return () => window.removeEventListener("stellar:toast", handleCustom);
  }, []); // stable: timerRef never changes, setCurrent/setVisible are stable

  if (!current) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
        >
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl flex items-start gap-4">
            <div className="bg-slate-800/50 p-2 rounded-xl shrink-0">
              <ToastIcon type={current.type} />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white mb-1">{current.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{current.message}</p>
              {current.href && (
                <a
                  href={current.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs text-blue-400 hover:underline"
                >
                  View →
                </a>
              )}
            </div>

            <button
              onClick={() => setVisible(false)}
              className="text-slate-500 hover:text-white transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
