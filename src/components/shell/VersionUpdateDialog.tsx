"use client";

import { useEffect, useState, useMemo } from "react";
import { Sparkles, Check, ArrowUpRight, GitBranch, ChevronDown, ChevronRight, History } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

// v5.927 (#9): per-type accent dots only (no solid colored boxes — the cards
// use genuine liquid-glass / frosted styling consistent with the app theme).
const TYPE_DOT: Record<ReleaseHighlightType, string> = {
  new: "bg-emerald-500",
  improved: "bg-teal-500",
  removed: "bg-rose-500",
  fixed: "bg-amber-500",
};

const CATEGORY_ORDER: ReleaseHighlightType[] = ["new", "improved", "fixed", "removed"];

/**
 * CategoryCard — a single category shown as a frosted liquid-glass card.
 * v5.927 (#9): no count line, genuine liquid-glass styling (translucent,
 * blurred, bordered — not flat colors). Expand on hover (desktop) / tap (mobile).
 */
function CategoryCard({
  type,
  items,
  isTouch,
  expandedByDefault,
}: {
  type: ReleaseHighlightType;
  items: ReleaseHighlight[];
  isTouch: boolean;
  expandedByDefault: boolean;
}) {
  const [tapExpanded, setTapExpanded] = useState(expandedByDefault);
  // On desktop, hover via CSS group-hover. On touch, tap to toggle.
  // If expandedByDefault (latest version), always show expanded.
  const showExpanded = expandedByDefault || (isTouch ? tapExpanded : false);

  return (
    <div
      className={cn("relative", !isTouch && !expandedByDefault && "group")}
      onClick={() => { if (isTouch && !expandedByDefault) setTapExpanded((v) => !v); }}
      role={isTouch && !expandedByDefault ? "button" : undefined}
      tabIndex={isTouch && !expandedByDefault ? 0 : undefined}
    >
      <div
        className={cn(
          // v5.927 (#9): genuine liquid-glass — translucent, blurred, bordered.
          "relative rounded-xl p-3.5 transition-all duration-300 cursor-pointer",
          "bg-white/5 dark:bg-white/5 backdrop-blur-md border border-white/15 dark:border-white/10",
          "shadow-sm",
          !expandedByDefault && "hover:bg-white/10 dark:hover:bg-white/10 hover:border-white/25",
        )}
      >
        {/* Category label (no count line per #9) */}
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full shrink-0", TYPE_DOT[type])} />
          <span className="text-sm font-semibold">{HIGHLIGHT_LABELS[type]}</span>
          {!expandedByDefault && (
            <span className="ml-auto text-[10px] text-muted-foreground">
              {isTouch ? (tapExpanded ? "▲" : "▼") : "hover"}
            </span>
          )}
        </div>

        {/* Preview text (first item, truncated) — only when collapsed */}
        {!showExpanded && (
          <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-1 transition-opacity duration-200 group-hover:opacity-0">
            {items[0].text}
          </p>
        )}

        {/* Expanded items */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            showExpanded
              ? "max-h-[600px] opacity-100 mt-2"
              : "max-h-0 opacity-0 group-hover:max-h-[600px] group-hover:opacity-100 group-hover:mt-2",
          )}
        >
          <div className="space-y-1.5">
            {items.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2 rounded-lg bg-white/5 dark:bg-black/20 border border-white/10 dark:border-white/5"
              >
                <span className={cn("shrink-0 mt-0.5 h-1.5 w-1.5 rounded-full", TYPE_DOT[type])} />
                <p className="text-xs leading-relaxed text-foreground/90">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * VersionSection — one version's full display (title, summary, category cards).
 * `expanded` controls whether the categories are shown or just the header.
 */
function VersionSection({ release, isLatest, isTouch }: { release: ReleaseInfo; isLatest: boolean; isTouch: boolean }) {
  const [headerExpanded, setHeaderExpanded] = useState(isLatest);
  const formattedDate = formatDate(release.date);

  const grouped = useMemo(() => {
    const map: Record<ReleaseHighlightType, ReleaseHighlight[]> = { new: [], improved: [], fixed: [], removed: [] };
    for (const h of release.highlights) map[h.type].push(h);
    return map;
  }, [release]);

  return (
    <div className="space-y-2.5">
      {/* Version header — clickable for non-latest versions */}
      <button
        onClick={() => !isLatest && setHeaderExpanded((v) => !v)}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
          "bg-white/5 dark:bg-white/5 backdrop-blur-md border border-white/15 dark:border-white/10",
          !isLatest && "hover:bg-white/10 dark:hover:bg-white/10 cursor-pointer",
        )}
      >
        {!isLatest && (headerExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold">{release.title}</span>
            {isLatest && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/15 text-primary border border-primary/25">
                <Sparkles className="h-2.5 w-2.5" /> Latest
              </span>
            )}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">v{release.version} · {formattedDate}</div>
        </div>
      </button>

      {/* Summary + categories — always shown for latest, toggle for older */}
      {(isLatest || headerExpanded) && (
        <div className="space-y-2.5 pl-1">
          {/* v5.928 (#1a): removed duplicate summary — it's already in the header banner for the latest version. */}
          {!isLatest && <p className="text-xs text-muted-foreground leading-relaxed">{release.summary}</p>}
          {CATEGORY_ORDER.map((type) => {
            const items = grouped[type];
            if (items.length === 0) return null;
            return (
              <CategoryCard
                key={type}
                type={type}
                items={items}
                isTouch={isTouch}
                expandedByDefault={false}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * VersionUpdateDialog — shows "what's new" with version history.
 *
 * v5.927 (#9): redesigned with:
 *   - Liquid-glass / frosted styling (translucent, blurred, bordered — no flat colors)
 *   - No item-count lines above categories
 *   - Version history: latest expanded by default, older versions collapsed
 *   - Can be reopened via a "What's New" button in Settings (forceOpen prop)
 */
export function VersionUpdateDialog({ forceOpen = false, onForceClose }: { forceOpen?: boolean; onForceClose?: () => void }) {
  const onboardingCompleted = useStore((s) => s.state.onboardingCompleted);
  const lastSeenReleaseVersion = useStore((s) => s.state.preferences.lastSeenReleaseVersion);
  const setPreference = useStore((s) => s.setPreference);

  const [open, setOpen] = useState(false);
  const [shownVersion, setShownVersion] = useState<string | null>(null);

  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);
  }, []);

  // Auto-show on first visit after update / new user.
  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
      return;
    }
    if (!onboardingCompleted) return;
    if (lastSeenReleaseVersion === APP_VERSION) return;
    const t = setTimeout(() => {
      setShownVersion(APP_VERSION);
      setOpen(true);
    }, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingCompleted, lastSeenReleaseVersion, forceOpen]);

  const dismiss = () => {
    setOpen(false);
    if (onForceClose) onForceClose();
    // Record the version we just showed so it never reappears for this release
    // (only when auto-shown, not when force-opened from Settings).
    if (!forceOpen && (shownVersion || APP_VERSION)) {
      setPreference("lastSeenReleaseVersion", shownVersion ?? APP_VERSION);
    }
  };

  if (!onboardingCompleted && !forceOpen) return null;

  return (
    <Dialog open={open || forceOpen} onOpenChange={(v) => { if (!v) dismiss(); }}>
      <DialogContent
        className="sm:max-w-lg max-h-[88vh] overflow-y-auto"
        showCloseButton
      >
        {/* Header banner */}
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
            </div>
            <DialogHeader className="gap-1">
              <DialogTitle className="text-lg font-semibold leading-tight pr-6">
                {LATEST_RELEASE.title}
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                {LATEST_RELEASE.summary}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Version history — latest first, older versions collapsed */}
        <div className="space-y-3 mt-2">
          {RELEASES.map((release, i) => (
            <VersionSection
              key={release.version}
              release={release}
              isLatest={i === 0}
              isTouch={isTouch}
            />
          ))}
        </div>

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
            onClick={dismiss}
          >
            <Check className="h-4 w-4" />
            Got it
          </GlassButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
