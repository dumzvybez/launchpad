"use client";

import { useEffect, useState, useMemo } from "react";
import { Sparkles, Check, ArrowUpRight, GitBranch } from "lucide-react";
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
  LATEST_RELEASE,
  HIGHLIGHT_LABELS,
  type ReleaseHighlightType,
  type ReleaseHighlight,
} from "@/lib/version-info";

// Per-type badge colours. Kept in sync with the app's teal/violet/amber/rose palette
// (no indigo/blue per the project styling rules).
const HIGHLIGHT_STYLES: Record<ReleaseHighlightType, { badge: string; dot: string; accent: string }> = {
  new: {
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
    accent: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
  },
  improved: {
    badge: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    dot: "bg-teal-500",
    accent: "from-teal-500/20 to-teal-500/5 border-teal-500/30",
  },
  removed: {
    badge: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    dot: "bg-rose-500",
    accent: "from-rose-500/20 to-rose-500/5 border-rose-500/30",
  },
  fixed: {
    badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
    accent: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
  },
};

const CATEGORY_ORDER: ReleaseHighlightType[] = ["new", "improved", "fixed", "removed"];

/**
 * StackedCardCategory — a single category shown as a stack of cards.
 * Collapsed: shows the category label + count + a peek of card edges behind.
 * Expanded (hover on desktop, tap on mobile): cards fan out to reveal items.
 */
function StackedCardCategory({
  type,
  items,
  isTouch,
}: {
  type: ReleaseHighlightType;
  items: ReleaseHighlight[];
  isTouch: boolean;
}) {
  const [tapExpanded, setTapExpanded] = useState(false);
  const style = HIGHLIGHT_STYLES[type];
  // On touch devices, use tap to toggle. On desktop, hover via CSS group-hover.
  const expanded = isTouch ? tapExpanded : false; // desktop uses CSS :hover

  return (
    <div
      className={cn("relative", !isTouch && "group")}
      onClick={() => { if (isTouch) setTapExpanded((v) => !v); }}
      role={isTouch ? "button" : undefined}
      tabIndex={isTouch ? 0 : undefined}
      onKeyDown={(e) => { if (isTouch && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setTapExpanded((v) => !v); } }}
    >
      {/* Stacked card peek (the "cards behind" effect) */}
      <div className="relative">
        {/* Back cards (peek) — only visible when collapsed */}
        {items.slice(0, Math.min(3, items.length - 1)).map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-x-0 rounded-xl border bg-gradient-to-br transition-all duration-300",
              style.accent,
              // Offset each back card slightly
              isTouch
                ? tapExpanded ? "opacity-0" : ""
                : "group-hover:opacity-0",
            )}
            style={{
              top: `${(i + 1) * 3}px`,
              zIndex: 10 - i,
              opacity: (isTouch ? !tapExpanded : true) ? 1 : 0,
              transform: (isTouch ? !tapExpanded : true) ? `scale(${1 - (i + 1) * 0.02})` : "scale(1)",
            }}
          />
        ))}

        {/* Front card (the category header / expanded content) */}
        <div
          className={cn(
            "relative rounded-xl border bg-gradient-to-br p-3.5 transition-all duration-300 cursor-pointer",
            style.accent,
          )}
          style={{ zIndex: 20 }}
        >
          {/* Collapsed view: just the label + count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", style.dot)} />
              <span className="text-sm font-semibold">{HIGHLIGHT_LABELS[type]}</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Preview text (first item, truncated) — only when collapsed */}
          {(!isTouch || !tapExpanded) && (
            <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-1 transition-opacity duration-200 group-hover:opacity-0">
              {items[0].text}
            </p>
          )}

          {/* Expanded items — all items shown */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-out",
              isTouch
                ? tapExpanded ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
                : "max-h-0 opacity-0 group-hover:max-h-[500px] group-hover:opacity-100 group-hover:mt-2",
            )}
          >
            <div className="space-y-1.5">
              {items.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2 rounded-lg bg-background/40 border border-border/30"
                >
                  <span className={cn("shrink-0 mt-0.5 h-1.5 w-1.5 rounded-full", style.dot)} />
                  <p className="text-xs leading-relaxed text-foreground/90">{h.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * VersionUpdateDialog — shows "what's new" once per release.
 *
 * v5.926 (D3): redesigned with grouped stacked-card UI. Items are grouped by
 * category (New/Improved/Fixed/Removed) and shown as expandable card stacks.
 * Hover (desktop) or tap (mobile) to fan out the cards and reveal items.
 *
 * Content is USER-FACING (plain language) — see version-info.ts for the
 * dual-format release-notes process (user-facing here, technical in CHANGELOG).
 */
export function VersionUpdateDialog() {
  const onboardingCompleted = useStore((s) => s.state.onboardingCompleted);
  const lastSeenReleaseVersion = useStore(
    (s) => s.state.preferences.lastSeenReleaseVersion,
  );
  const setPreference = useStore((s) => s.setPreference);

  const [open, setOpen] = useState(false);
  const [shownVersion, setShownVersion] = useState<string | null>(null);

  // Detect touch device for the hover-vs-tap interaction.
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);
  }, []);

  useEffect(() => {
    if (!onboardingCompleted) return;
    if (lastSeenReleaseVersion === APP_VERSION) return;
    const t = setTimeout(() => {
      setShownVersion(APP_VERSION);
      setOpen(true);
    }, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingCompleted, lastSeenReleaseVersion]);

  const dismiss = () => {
    setOpen(false);
    if (shownVersion) {
      setPreference("lastSeenReleaseVersion", shownVersion);
    }
  };

  if (!onboardingCompleted) return null;

  const release = LATEST_RELEASE;
  const formattedDate = formatDate(release.date);

  // Group highlights by category.
  const grouped = useMemo(() => {
    const map: Record<ReleaseHighlightType, ReleaseHighlight[]> = {
      new: [], improved: [], fixed: [], removed: [],
    };
    for (const h of release.highlights) {
      map[h.type].push(h);
    }
    return map;
  }, [release]);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss(); }}>
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
                v{release.version}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {formattedDate}
              </span>
            </div>
            <DialogHeader className="gap-1">
              <DialogTitle className="text-lg font-semibold leading-tight pr-6">
                {release.title}
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                {release.summary}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* v5.926 (D3): grouped stacked cards — hover (desktop) or tap (mobile) to expand. */}
        <div className="space-y-2.5 mt-2">
          <p className="text-[10px] text-muted-foreground text-center">
            {isTouch ? "Tap a category to expand" : "Hover a category to expand"}
          </p>
          {CATEGORY_ORDER.map((type) => {
            const items = grouped[type];
            if (items.length === 0) return null;
            return (
              <StackedCardCategory
                key={type}
                type={type}
                items={items}
                isTouch={isTouch}
              />
            );
          })}
        </div>

        {/* Footer */}
        <DialogFooter className="mt-2 sm:items-center sm:justify-between gap-3">
          <a
            href="https://github.com/dumzvybez/Launchpad/blob/main/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View full changelog <ArrowUpRight className="h-3 w-3" />
          </a>
          <GlassButton
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={dismiss}
            autoFocus
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
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
