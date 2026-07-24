"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Bell,
  BellOff,
  Trash2,
  X,
  ChevronDown,
  ChevronRight,
  Trophy,
  Calendar,
  Sparkles,
  Target,
  ArrowRight,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { AppNotification, NotificationCategory } from "@/lib/types";
import { ConfirmDialog } from "@/components/shell/ConfirmDialog";

// ============================================================
// NotificationCentre — v5.931
//
// Design references (researched via web search, July 2026):
//   - iOS 26 (current as of 2026, latest patch ~26.5.2) introduced the
//     "Liquid Glass" design language and card-stacking notifications on
//     the Lock Screen. Key adaptable patterns applied here:
//       1. CARD STACKING — notifications of the same category collapse
//          into a stacked card showing a count; expanding reveals the
//          individual items. Mirrors iOS 26's grouped notification stacks.
//       2. LIQUID GLASS material — the panel uses the app's existing
//          `glass-elevated` translucent layered material (backdrop-blur +
//          saturation) which is the direct web analogue of iOS 26's
//          Liquid Glass.
//       3. GROUPING BY SOURCE/CATEGORY — notifications are grouped by
//          category (Achievement, Certificate, Reminder, System, Challenge)
//          just as iOS groups by app.
//       4. DISMISS — iOS uses swipe-to-dismiss; on web we provide a
//          hover-revealed X button on each card (and Clear All for bulk).
//     The interaction pattern (collapsible category sections with count +
//     expand/collapse arrow) mirrors the Version Update popup's category
//     cards, per the user's instruction.
//
// NO read/unread state. The bell badge is a simple COUNT of notifications
// in the history (reset by Clear All). Snooze suppresses popups but
// notifications are still recorded + visible here.
// ============================================================

const CATEGORY_META: Record<
  NotificationCategory,
  { label: string; icon: typeof Trophy; accent: string; dot: string }
> = {
  achievement: { label: "Achievements", icon: Trophy, accent: "text-amber-500", dot: "bg-amber-500" },
  certificate: { label: "Certificates", icon: Trophy, accent: "text-violet-500", dot: "bg-violet-500" },
  reminder: { label: "Reminders", icon: Calendar, accent: "text-teal-500", dot: "bg-teal-500" },
  system: { label: "System", icon: Sparkles, accent: "text-sky-500", dot: "bg-sky-500" },
  challenge: { label: "Challenges", icon: Target, accent: "text-rose-500", dot: "bg-rose-500" },
};

const CATEGORY_ORDER: NotificationCategory[] = ["achievement", "certificate", "reminder", "challenge", "system"];

export function NotificationCentre() {
  const notifications = useStore((s) => s.state.notifications ?? []);
  const snoozed = useStore((s) => s.state.preferences.notificationSnooze ?? false);
  const setNotificationSnooze = useStore((s) => s.setNotificationSnooze);
  const clearAllNotifications = useStore((s) => s.clearAllNotifications);
  const dismissNotificationItem = useStore((s) => s.dismissNotificationItem);
  const setView = useStore((s) => s.setView);

  const [open, setOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<NotificationCategory>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Click outside closes the panel.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        bellRef.current && !bellRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Group notifications by category (most-recent-first within each group).
  const grouped = useMemo(() => {
    const map: Record<NotificationCategory, AppNotification[]> = {
      achievement: [], certificate: [], reminder: [], system: [], challenge: [],
    };
    for (const n of notifications) {
      if (map[n.category]) map[n.category].push(n);
    }
    return map;
  }, [notifications]);

  const count = notifications.length;

  const toggleCategory = (cat: NotificationCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // v5.933: replaced native window.confirm with themed ConfirmDialog.
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearAll = () => {
    if (count === 0) return;
    setShowClearConfirm(true);
  };

  const confirmClearAll = () => {
    clearAllNotifications();
    setExpandedCategories(new Set());
    setShowClearConfirm(false);
  };

  const handleNotificationClick = (n: AppNotification) => {
    if (n.actionView) {
      setView(n.actionView);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Bell button with count badge */}
      <button
        ref={bellRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${count > 0 ? ` (${count} new)` : ""}`}
        title="Notifications"
        className="relative h-9 w-9 rounded-lg flex items-center justify-center hover:bg-foreground/8 transition-colors text-muted-foreground hover:text-foreground"
      >
        {snoozed ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
        {count > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center leading-none ring-2 ring-background"
            aria-hidden
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {/* Panel — v6.009: rendered via portal to document.body to escape the
          sticky header's backdrop-filter containing block. Mobile uses a
          full-screen overlay with bottom sheet; desktop keeps the anchored
          dropdown. */}
      {open && typeof document !== "undefined" && createPortal(
        <>
          {/* Mobile overlay */}
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            className="fixed left-0 right-0 bottom-0 top-auto z-50 flex flex-col rounded-t-2xl glass-elevated border border-border/60 shadow-2xl overflow-hidden lg:absolute lg:left-auto lg:right-0 lg:bottom-auto lg:top-auto lg:mt-2 lg:w-[min(92vw,400px)] lg:max-h-[80vh] lg:rounded-2xl"
            style={{ maxHeight: "85vh" }}
            role="dialog"
            aria-label="Notification Centre"
          >
          {/* Mobile drag handle */}
          <div className="lg:hidden flex justify-center pt-2 pb-1 shrink-0">
            <div className="h-1 w-10 rounded-full bg-foreground/20" />
          </div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 p-3 border-b border-border/40 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Bell className="h-4 w-4 shrink-0" />
              <span className="text-sm font-semibold truncate">Notifications</span>
              {count > 0 && (
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">{count}</span>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {/* Snooze toggle */}
              <button
                onClick={() => setNotificationSnooze(!snoozed)}
                className={cn(
                  "inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md border transition-colors",
                  snoozed
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-foreground/5",
                )}
                title={snoozed ? "Snooze ON — popups suppressed (notifications still recorded)" : "Snooze OFF — popups show"}
              >
                {snoozed ? <BellOff className="h-3 w-3" /> : <Bell className="h-3 w-3" />}
                {snoozed ? "Snoozed" : "Snooze"}
              </button>
              {/* Clear All */}
              <button
                onClick={handleClearAll}
                disabled={count === 0}
                className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md border border-border/60 text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Clear all notifications"
              >
                <Trash2 className="h-3 w-3" /> Clear All
              </button>
              <button
                onClick={() => setOpen(false)}
                className="h-7 w-7 rounded-md hover:bg-foreground/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Snooze banner */}
          {snoozed && (
            <div className="px-3 py-2 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5 shrink-0">
              <BellOff className="h-3 w-3 shrink-0" />
              <span>Snooze is ON — popups are suppressed. Notifications are still recorded here.</span>
            </div>
          )}

          {/* Body — scrollable, grouped category stacks */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
            {count === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-10 w-10 rounded-full bg-foreground/5 flex items-center justify-center mb-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">No notifications yet</p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">Achievements, certificates, and reminders will appear here.</p>
              </div>
            ) : (
              CATEGORY_ORDER.map((cat) => {
                const items = grouped[cat];
                if (items.length === 0) return null;
                const meta = CATEGORY_META[cat];
                const Icon = meta.icon;
                const expanded = expandedCategories.has(cat);
                return (
                  <div key={cat} className="rounded-xl bg-card/30 border border-border/40 overflow-hidden">
                    {/* Category header — the "stack" top card */}
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="w-full flex items-center gap-2 p-2.5 hover:bg-foreground/5 transition-colors text-left"
                    >
                      <span className={cn("h-2 w-2 rounded-full shrink-0", meta.dot)} />
                      <Icon className={cn("h-3.5 w-3.5 shrink-0", meta.accent)} />
                      <span className="text-xs font-semibold flex-1">{meta.label}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{items.length}</span>
                      {expanded ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                    </button>
                    {/* Expanded items — the "stack" revealed cards */}
                    {expanded && (
                      <div className="px-2 pb-2 space-y-1">
                        {items.map((n) => (
                          <NotificationCard
                            key={n.id}
                            n={n}
                            dot={meta.dot}
                            onDismiss={() => dismissNotificationItem(n.id)}
                            onClick={() => handleNotificationClick(n)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
        </>, document.body
      )}

      {/* v5.933: themed confirmation modal for Clear All (replaces native window.confirm) */}
      <ConfirmDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Clear all notifications?"
        description={`This will permanently remove all ${count} notification${count === 1 ? "" : "s"} from your history. This action cannot be undone.`}
        confirmLabel="Clear All"
        cancelLabel="Cancel"
        destructive
        onConfirm={confirmClearAll}
      />
    </div>
  );
}

/** NotificationCard — a single notification, iOS 26 Liquid-Glass card style.
 *  Hover reveals a dismiss (X) button (web adaptation of iOS swipe-to-dismiss). */
function NotificationCard({
  n,
  dot,
  onDismiss,
  onClick,
}: {
  n: AppNotification;
  dot: string;
  onDismiss: () => void;
  onClick: () => void;
}) {
  return (
    <div className="group relative rounded-lg bg-white/5 dark:bg-black/20 border border-white/10 dark:border-white/5 p-2.5 hover:bg-white/10 dark:hover:bg-black/30 transition-colors">
      <div className="flex items-start gap-2">
        <span className={cn("shrink-0 mt-1 h-1.5 w-1.5 rounded-full", dot)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            {n.icon && <span className="text-xs leading-none">{n.icon}</span>}
            <p className="text-xs font-semibold leading-tight truncate">{n.title}</p>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{n.body}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[9px] font-mono text-muted-foreground/70">{formatRelative(n.createdAt)}</span>
            {n.actionView && n.actionLabel && (
              <button
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                className="inline-flex items-center gap-0.5 text-[10px] text-primary hover:underline font-medium"
              >
                {n.actionLabel} <ArrowRight className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        </div>
        {/* Dismiss (X) — hover-revealed, web adaptation of iOS swipe-to-dismiss */}
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
          className="shrink-0 h-5 w-5 rounded-md hover:bg-foreground/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Dismiss notification"
          title="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

/** Compact relative-time formatter (e.g. "2m ago", "1h ago", "3d ago"). */
function formatRelative(iso: string): string {
  try {
    const then = new Date(iso).getTime();
    const now = Date.now();
    const diff = Math.max(0, now - then);
    const min = Math.floor(diff / 60000);
    if (min < 1) return "just now";
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.floor(hr / 24);
    if (day < 7) return `${day}d ago`;
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}
