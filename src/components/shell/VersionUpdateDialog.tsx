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

  const [showToast, setShowToast] = useState(false);
  const [showFullPopup, setShowFullPopup] = useState(false);
  const [shownVersion, setShownVersion] = useState<string | null>(null);

  // Auto-show toast on first visit after update / new user.
  useEffect(() => {
    if (forceOpen) {
      setShowFullPopup(true);
      return;
    }
    if (!onboardingCompleted) return;
    if (lastSeenReleaseVersion === APP_VERSION) return;
    const t = setTimeout(() => {
      setShownVersion(APP_VERSION);
      setShowToast(true);
    }, 900);
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
          className="sm:max-w-lg max-h-[88vh] overflow-y-auto"
          showCloseButton
        >
          {/* Header — title + summary appear ONLY here, not duplicated below */}
          <div className="flex items-start gap-3 -mt-1">
            <div className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br from-teal-400 via-fuchsia-400 to-amber-300 flex items-center justify-center shadow-sm">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  What&apos;s new
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                  <GitBranch className="h-3 w-3" />
                  v{LATEST_RELEASE.version}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {formatDate(LATEST_RELEASE.date)}
                </span>
              </div>
              <DialogHeader className="gap-1">
                <DialogTitle className="text-lg font-semibold leading-tight pr-6">
                  {LATEST_RELEASE.title}
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm leading-relaxed text-muted-foreground mt-1">
                {LATEST_RELEASE.summary}
              </p>
            </div>
          </div>

          {/* v5.930 (#4): Always-visible, compact, icon-labeled categories.
              No hover-to-reveal — each category is a collapsible section that's
              expanded by default for the latest version. */}
          <VersionCategories release={LATEST_RELEASE} defaultExpanded={true} />

          {/* Historical versions — minimal compact form */}
          {RELEASES.length > 1 && (
            <div className="mt-4 pt-3 border-t border-border/40">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-2 flex items-center gap-1">
                <History className="h-3 w-3" /> Previous versions
              </div>
              <div className="space-y-1">
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

/** VersionCategories — always-visible collapsible category sections. */
function VersionCategories({ release, defaultExpanded }: { release: ReleaseInfo; defaultExpanded: boolean }) {
  const grouped = useMemo(() => {
    const map: Record<ReleaseHighlightType, ReleaseHighlight[]> = { new: [], improved: [], fixed: [], removed: [] };
    for (const h of release.highlights) map[h.type].push(h);
    return map;
  }, [release]);

  return (
    <div className="space-y-2 mt-3">
      {CATEGORY_ORDER.map((type) => {
        const items = grouped[type];
        if (items.length === 0) return null;
        return (
          <CategorySection
            key={type}
            type={type}
            items={items}
            defaultExpanded={defaultExpanded}
          />
        );
      })}
    </div>
  );
}

/** CategorySection — a single category with always-visible label + collapsible items. */
function CategorySection({ type, items, defaultExpanded }: { type: ReleaseHighlightType; items: ReleaseHighlight[]; defaultExpanded: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const dot = TYPE_DOT[type];

  return (
    <div className="rounded-xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-white/15 dark:border-white/10 overflow-hidden">
      {/* Always-visible header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 p-3 hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
      >
        <span className={cn("h-2 w-2 rounded-full shrink-0", dot)} />
        <span className="text-xs font-semibold">{CATEGORY_ICON[type]} {HIGHLIGHT_LABELS[type]}</span>
        <span className="text-[10px] text-muted-foreground ml-auto">{items.length}</span>
        {expanded ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
      </button>
      {/* Collapsible items */}
      {expanded && (
        <div className="px-3 pb-3 space-y-1.5">
          {items.map((h, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-2 rounded-lg bg-white/5 dark:bg-black/20 border border-white/10 dark:border-white/5"
            >
              <span className={cn("shrink-0 mt-0.5 h-1.5 w-1.5 rounded-full", dot)} />
              <p className="text-xs leading-relaxed text-foreground/90">{h.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** HistoricalVersion — minimal compact form for older versions. */
function HistoricalVersion({ release }: { release: ReleaseInfo }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-foreground/5 transition-colors text-left"
      >
        {expanded ? <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" /> : <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />}
        <span className="text-[11px] font-mono text-muted-foreground">v{release.version}</span>
        <span className="text-[11px] text-muted-foreground">·</span>
        <span className="text-[11px] text-muted-foreground truncate">{release.title}</span>
      </button>
      {expanded && (
        <div className="pl-6 pr-2 py-1.5">
          <p className="text-[11px] text-muted-foreground leading-relaxed">{release.summary}</p>
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
