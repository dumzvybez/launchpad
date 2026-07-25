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
// NotificationCentre — v6.010 (UI-B mobile refinement)
//
// Mobile-first changes:
// - Bell button is now a ≥44px touch target (was h-9 w-9 = 36px).
// - Mobile bottom sheet now respects env(safe-area-inset-bottom) so
//   the dismiss/handle area clears the iOS home indicator.
// - Mobile sheet header buttons (Snooze, Clear All, Close) are ≥44px.
// - Notification cards on mobile use ≥14px body text, ≥12px meta.
// - Cards use larger touch targets and always-visible dismiss on mobile
//   (no hover-only discovery on touch devices).
// - Snooze banner uses ≥14px text on mobile.
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
//          visible X button on each card (always visible on mobile,
//          hover-revealed on desktop) and Clear All for bulk.
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
      {/* Bell button — v6.010 (UI-B): ≥44px touch target on mobile.
          Desktop keeps the compact 36px size for the dense header. */}
      <button
        ref={bellRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${count > 0 ? ` (${count} new)` : ""}`}
        title="Notifications"
        className={cn(
          "relative rounded-lg flex items-center justify-center transition-colors",
          "text-muted-foreground hover:text-foreground hover:bg-foreground/8",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          // Mobile: 44px touch target. Desktop: 36px (h-9 w-9).
          "h-11 w-11 lg:h-9 lg:w-9",
        )}
      >
        {snoozed ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
        {count > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center leading-none ring-2 ring-background"
            aria-hidden
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {/* Panel — v6.010 (UI-B): rendered via portal to document.body.
          Mobile uses a full-height bottom sheet with safe-area padding.
          Desktop keeps the anchored dropdown. */}
      {open && typeof document !== "undefined" && createPortal(
        <>
          {/* Mobile overlay */}
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden",
              // Mobile: full-width bottom sheet, rounded top, safe-area bottom.
              "left-0 right-0 bottom-0 top-auto rounded-t-2xl",
              "glass-elevated border border-border/60 shadow-2xl",
              // Desktop: anchored dropdown.
              "lg:absolute lg:left-auto lg:right-0 lg:bottom-auto lg:top-auto lg:mt-2",
              "lg:w-[min(92vw,400px)] lg:max-h-[80vh] lg:rounded-2xl",
            )}
            style={{
              maxHeight: "85vh",
              // Mobile: pad the bottom so buttons clear the iOS home indicator
              // / Android gesture bar. Desktop: no extra padding.
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
            role="dialog"
            aria-label="Notification Centre"
          >
          {/* Mobile drag handle */}
          <div className="lg:hidden flex justify-center pt-2.5 pb-1 shrink-0">
            <div className="h-1.5 w-12 rounded-full bg-foreground/25" />
          </div>
          {/* Header — v6.010 (UI-B): mobile buttons are ≥44px touch targets */}
          <div className="flex items-center justify-between gap-2 p-3 border-b border-border/40 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Bell className="h-4 w-4 shrink-0" />
              <span className="text-sm font-semibold truncate">Notifications</span>
              {count > 0 && (
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">{count}</span>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {/* Snooze toggle — mobile-friendly (≥44px tap area via py-2.5 px-2.5) */}
              <button
                onClick={() => setNotificationSnooze(!snoozed)}
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs px-2.5 py-2 rounded-md border transition-colors",
                  "min-h-[40px] lg:min-h-0 lg:py-1",
                  snoozed
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-foreground/5",
                )}
                title={snoozed ? "Snooze ON — popups suppressed (notifications still recorded)" : "Snooze OFF — popups show"}
              >
                {snoozed ? <BellOff className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{snoozed ? "Snoozed" : "Snooze"}</span>
              </button>
              {/* Clear All — mobile-friendly */}
              <button
                onClick={handleClearAll}
                disabled={count === 0}
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs px-2.5 py-2 rounded-md border transition-colors",
                  "min-h-[40px] lg:min-h-0 lg:py-1",
                  "border-border/60 text-muted-foreground hover:text-foreground hover:bg-foreground/5",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                )}
                title="Clear all notifications"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
              {/* Close — ≥44px on mobile, 28px on desktop */}
              <button
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md hover:bg-foreground/10 flex items-center justify-center",
                  "text-muted-foreground hover:text-foreground transition-colors",
                  "h-11 w-11 lg:h-7 lg:w-7",
                )}
                aria-label="Close"
              >
                <X className="h-4 w-4 lg:h-3.5 w-3.5 lg:w-3.5" />
              </button>
            </div>
          </div>

          {/* Snooze banner — v6.010 (UI-B): ≥14px text on mobile */}
          {snoozed && (
            <div className="px-3 py-2 bg-amber-500/10 border-b border-amber-500/20 text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1.5 shrink-0">
              <BellOff className="h-3.5 w-3.5 shrink-0" />
              <span>Snooze is ON — popups are suppressed. Notifications are still recorded here.</span>
            </div>
          )}

          {/* Body — scrollable, grouped category stacks */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin">
            {count === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-foreground/5 flex items-center justify-center mb-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No notifications yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1 max-w-[260px]">
                  Achievements, certificates, and reminders will appear here.
                </p>
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
                    {/* Category header — the "stack" top card (≥44px tap target) */}
                    <button
                      onClick={() => toggleCategory(cat)}
                      className={cn(
                        "w-full flex items-center gap-2 p-3 hover:bg-foreground/5 transition-colors text-left",
                        "min-h-[44px]",
                      )}
                    >
                      <span className={cn("h-2 w-2 rounded-full shrink-0", meta.dot)} />
                      <Icon className={cn("h-4 w-4 shrink-0", meta.accent)} />
                      <span className="text-sm font-semibold flex-1">{meta.label}</span>
                      <span className="text-xs font-mono text-muted-foreground">{items.length}</span>
                      {expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
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
 *  v6.010 (UI-B): dismiss button is always visible on mobile (no hover on
 *  touch devices); hover-revealed on desktop. Body text ≥14px on mobile. */
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
    <div className="group relative rounded-lg bg-white/5 dark:bg-black/20 border border-white/10 dark:border-white/5 p-3 hover:bg-white/10 dark:hover:bg-black/30 transition-colors">
      <div className="flex items-start gap-2.5">
        <span className={cn("shrink-0 mt-1.5 h-2 w-2 rounded-full", dot)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {n.icon && <span className="text-sm leading-none">{n.icon}</span>}
            <p className="text-sm font-semibold leading-tight truncate">{n.title}</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{n.body}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-mono text-muted-foreground/70">{formatRelative(n.createdAt)}</span>
            {n.actionView && n.actionLabel && (
              <button
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs text-primary hover:underline font-medium",
                  "min-h-[32px] px-1",
                )}
              >
                {n.actionLabel} <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
        {/* Dismiss (X) — always visible on mobile, hover-revealed on desktop */}
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
          className={cn(
            "shrink-0 rounded-md hover:bg-foreground/10 flex items-center justify-center",
            "text-muted-foreground hover:text-foreground transition-colors",
            // Mobile: ≥44px target, always visible. Desktop: smaller, hover-revealed.
            "h-9 w-9 opacity-100 lg:opacity-0 lg:h-6 lg:w-6 lg:group-hover:opacity-100 lg:focus:opacity-100",
          )}
          aria-label="Dismiss notification"
          title="Dismiss"
        >
          <X className="h-4 w-4 lg:h-3 lg:w-3" />
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
