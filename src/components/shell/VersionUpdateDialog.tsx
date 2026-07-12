"use client";

import { useEffect, useState, useMemo } from "react";
import { Sparkles, Check, ArrowUpRight, GitBranch, ChevronDown, ChevronRight, History, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { GlassButton } from "@/components/glass/GlassPrimitives";
import {
  APP_VERSION,
  RELEASES,
  LATEST_RELEASE,
  HIGHLIGHT_LABELS,
  type ReleaseHighlightType,
  type ReleaseHighlight,
  type ReleaseInfo,
} from "@/lib/version-info";

// Per-type accent dots only (no solid colored boxes).
const TYPE_DOT: Record<ReleaseHighlightType, string> = {
  new: "bg-emerald-500",
  improved: "bg-teal-500",
  removed: "bg-rose-500",
  fixed: "bg-amber-500",
};

const CATEGORY_ORDER: ReleaseHighlightType[] = ["new", "improved", "fixed", "removed"];

const CATEGORY_ICON: Record<ReleaseHighlightType, string> = {
  new: "✨",
  improved: "⚡",
  fixed: "🔧",
  removed: "🗑️",
};

/**
 * VersionUpdateDialog — v5.930 (#4) toast-first redesign.
 *
 * Changes from v5.929:
 * - Toast-first: on update, shows a small unobtrusive toast banner instead
 *   of auto-opening the full popup. Clicking "More details" opens the full popup.
 * - No duplication: the latest version's title/summary appear ONLY in the header,
 *   not repeated in the version section body.
 * - Always-visible categories: replaced hover-to-reveal with an always-visible,
 *   compact, icon-labeled layout. Each category is a collapsible section with
 *   its items listed directly — no hover discovery needed.
 * - Historical versions: shown in a minimal compact form (version + date +
 *   expandable summary only, no category breakdown by default).
 */
export function VersionUpdateDialog({ forceOpen = false, onForceClose }: { forceOpen?: boolean; onForceClose?: () => void }) {
  const onboardingCompleted = useStore((s) => s.state.onboardingCompleted);
  const lastSeenReleaseVersion = useStore((s) => s.state.preferences.lastSeenReleaseVersion);
  const setPreference = useStore((s) => s.setPreference);
  const pushNotification = useStore((s) => s.pushNotification);

  const [showToast, setShowToast] = useState(false);
  const [showFullPopup, setShowFullPopup] = useState(false);
  const [shownVersion, setShownVersion] = useState<string | null>(null);

  // Auto-show toast on first visit after update / new user.
  // v5.932: New-user pacing — brand-new users (lastSeenReleaseVersion ===
  // undefined, meaning they've never seen ANY release) get a ~2min delay so
  // the version notification doesn't stack with view hints and the Cmd+K tip
  // during their very first session. Returning users after a real update
  // (lastSeenReleaseVersion is set but differs from APP_VERSION) get the
  // normal 900ms delay — this stagger applies ONLY to first-time users.
  useEffect(() => {
    if (forceOpen) {
      setShowFullPopup(true);
      return;
    }
    if (!onboardingCompleted) return;
    if (lastSeenReleaseVersion === APP_VERSION) return;

    // v5.932: determine if this is a brand-new user (never seen any release).
    const isFirstTimeUser = lastSeenReleaseVersion === undefined;
    const delayMs = isFirstTimeUser ? 120_000 : 900; // 2min for new users, 900ms for returning

    const t = setTimeout(() => {
      setShownVersion(APP_VERSION);
      setShowToast(true);
    }, delayMs);
    // v5.931: record the update as a persistent system notification in the
    // Notification Centre (so the user sees it even if the toast is missed).
    // Dedup on the version string so re-renders don't duplicate it.
    pushNotification({
      id: `system:update:${APP_VERSION}`,
      category: "system",
      title: `Launchpad updated to v${APP_VERSION}`,
      body: LATEST_RELEASE.title,
      icon: "✨",
      actionView: "settings",
      actionLabel: "What's new",
    });
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingCompleted, lastSeenReleaseVersion, forceOpen]);

  const dismissToast = () => {
    setShowToast(false);
    if (onForceClose) onForceClose();
    if (!forceOpen && (shownVersion || APP_VERSION)) {
      setPreference("lastSeenReleaseVersion", shownVersion ?? APP_VERSION);
    }
  };

  // v5.931: toast auto-dismiss — the "Updated to vX.X" toast previously
  // stayed visible indefinitely until the user interacted with it. Standard
  // toast behaviour is to auto-expire after a few seconds. 8s is long enough
  // to read the title + decide to click "More details", short enough not to
  // linger. Reset on every show; cleared on dismiss/unmount.
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(dismissToast, 8000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showToast]);

  const openFullPopup = () => {
    setShowToast(false);
    setShowFullPopup(true);
  };

  const dismissFullPopup = () => {
    setShowFullPopup(false);
    if (onForceClose) onForceClose();
    if (!forceOpen && (shownVersion || APP_VERSION)) {
      setPreference("lastSeenReleaseVersion", shownVersion ?? APP_VERSION);
    }
  };

  if (!onboardingCompleted && !forceOpen) return null;

  return (
    <>
      {/* Toast banner — small, unobtrusive, top-right */}
      {showToast && !showFullPopup && (
        <div
          className="fixed top-16 right-4 z-[95] max-w-sm view-enter"
          style={{ animation: "lp-hint-slide-in 0.3s ease-out" }}
        >
          <div className="glass-elevated rounded-2xl p-3 pr-8 shadow-2xl border border-primary/20 relative">
            <button
              onClick={dismissToast}
              className="absolute top-1.5 right-1.5 h-6 w-6 rounded-md hover:bg-foreground/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="flex items-start gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-400 via-fuchsia-400 to-amber-300 flex items-center justify-center shrink-0">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold">Updated to v{LATEST_RELEASE.version}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                  {LATEST_RELEASE.title}
                </p>
                <button
                  onClick={openFullPopup}
                  className="mt-1.5 text-[11px] text-primary hover:underline font-medium"
                >
                  More details →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full popup — opened from toast "More details" or Settings "What's New" */}
      <Dialog open={showFullPopup || forceOpen} onOpenChange={(v) => { if (!v) dismissFullPopup(); }}>
        <DialogContent
          className="sm:max-w-lg max-h-[88vh] overflow-y-auto overflow-x-hidden break-words !flex !flex-col"
          showCloseButton
        >
          {/* v5.931 header redesign: "What's New" is now the main heading
              (centered), with the latest version's own title + badge + date
              cleanly centered beneath it. The prose summary paragraph is
              removed entirely — only the categorized point-by-point list
              shows (matching the historical-versions treatment below). */}
          <DialogHeader className="gap-0 text-center items-center min-w-0 w-full overflow-hidden">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-400 via-fuchsia-400 to-amber-300 flex items-center justify-center shadow-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight">
              What&apos;s New
            </DialogTitle>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                <GitBranch className="h-3 w-3" />
                v{LATEST_RELEASE.version}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {formatDate(LATEST_RELEASE.date)}
              </span>
            </div>
            <p className="text-sm font-medium leading-snug text-foreground mt-2 max-w-full mx-auto break-words [overflow-wrap:anywhere]">
              {LATEST_RELEASE.title}
            </p>
          </DialogHeader>

          {/* v5.931: Latest version now shows ONLY the categorized point-by-point
              list — the prose summary paragraph was removed. Categories are
              always-visible collapsible sections (icon + label + count), expanded
              by default for the latest version. */}
          <VersionCategories release={LATEST_RELEASE} defaultExpanded={true} />

          {/* Historical versions — v5.931: now show categorized point-by-point
              details (matching the latest version's style) instead of a prose
              summary. Each category is collapsible and collapsed by default to
              keep the list scannable; entries are kept compact/short. */}
          {RELEASES.length > 1 && (
            <div className="mt-4 pt-3 border-t border-border/40">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-2 flex items-center gap-1">
                <History className="h-3 w-3" /> Previous versions
              </div>
              <div className="space-y-1.5">
                {RELEASES.slice(1).map((release) => (
                  <HistoricalVersion key={release.version} release={release} />
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <DialogFooter className="mt-2 sm:items-center sm:justify-between gap-3">
            <a
              href="https://github.com/dumzvybez/Launchpad/blob/main/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <History className="h-3 w-3" /> Full changelog <ArrowUpRight className="h-3 w-3" />
            </a>
            <GlassButton
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={dismissFullPopup}
            >
              <Check className="h-4 w-4" />
              Got it
            </GlassButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** VersionCategories — always-visible collapsible category sections.
 *  v5.931: `compact` mode for historical versions (tighter padding, smaller
 *  text) so the previous-versions list stays scannable while still showing
 *  the same categorized point-by-point detail as the latest version. */
function VersionCategories({ release, defaultExpanded, compact = false }: { release: ReleaseInfo; defaultExpanded: boolean; compact?: boolean }) {
  const grouped = useMemo(() => {
    const map: Record<ReleaseHighlightType, ReleaseHighlight[]> = { new: [], improved: [], fixed: [], removed: [] };
    for (const h of release.highlights) map[h.type].push(h);
    return map;
  }, [release]);

  return (
    <div className={cn("mt-3", compact ? "space-y-1" : "space-y-2")}>
      {CATEGORY_ORDER.map((type) => {
        const items = grouped[type];
        if (items.length === 0) return null;
        return (
          <CategorySection
            key={type}
            type={type}
            items={items}
            defaultExpanded={defaultExpanded}
            compact={compact}
          />
        );
      })}
    </div>
  );
}

/** CategorySection — a single category with always-visible label + collapsible items. */
function CategorySection({ type, items, defaultExpanded, compact = false }: { type: ReleaseHighlightType; items: ReleaseHighlight[]; defaultExpanded: boolean; compact?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const dot = TYPE_DOT[type];

  return (
    <div className={cn(
      "rounded-xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-white/15 dark:border-white/10 overflow-hidden",
      compact && "rounded-lg",
    )}>
      {/* Always-visible header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "w-full flex items-center gap-2 hover:bg-white/5 dark:hover:bg-white/5 transition-colors",
          compact ? "px-2.5 py-1.5" : "p-3",
        )}
      >
        <span className={cn("rounded-full shrink-0", dot, compact ? "h-1.5 w-1.5" : "h-2 w-2")} />
        <span className={cn("font-semibold", compact ? "text-[11px]" : "text-xs")}>{CATEGORY_ICON[type]} {HIGHLIGHT_LABELS[type]}</span>
        <span className="text-[10px] text-muted-foreground ml-auto">{items.length}</span>
        {expanded ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
      </button>
      {/* Collapsible items */}
      {expanded && (
        <div className={cn(compact ? "px-2.5 pb-2 space-y-1" : "px-3 pb-3 space-y-1.5")}>
          {items.map((h, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-2 rounded-lg bg-white/5 dark:bg-black/20 border border-white/10 dark:border-white/5",
                compact ? "p-1.5" : "p-2",
              )}
            >
              <span className={cn("shrink-0 mt-0.5 rounded-full", dot, compact ? "h-1 w-1" : "h-1.5 w-1.5")} />
              <p className={cn("leading-relaxed text-foreground/90 break-words [overflow-wrap:anywhere]", compact ? "text-[11px]" : "text-xs")}>{h.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** HistoricalVersion — v5.931: now shows categorized point-by-point details
 *  (matching the latest version's style, in compact form) instead of a prose
 *  summary paragraph. The version row expands to reveal the same collapsible
 *  New / Improved / Fixed / Removed category sections. */
function HistoricalVersion({ release }: { release: ReleaseInfo }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl bg-card/30 border border-border/40 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-foreground/5 transition-colors text-left"
      >
        {expanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
        <span className="text-[11px] font-mono text-primary font-semibold">v{release.version}</span>
        <span className="text-[11px] text-muted-foreground">·</span>
        <span className="text-[11px] text-foreground/80 truncate flex-1">{release.title}</span>
        <span className="text-[10px] text-muted-foreground font-mono shrink-0">{formatDate(release.date)}</span>
      </button>
      {expanded && (
        <div className="px-2 pb-2">
          <VersionCategories release={release} defaultExpanded={false} compact />
        </div>
      )}
    </div>
  );
}

/** Format an ISO date (YYYY-MM-DD) into a friendly, locale-aware label. */
function formatDate(iso: string): string {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}
