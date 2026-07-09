"use client";

import { useEffect, useState } from "react";
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
} from "@/lib/version-info";

// Per-type badge colours. Kept in sync with the app's teal/violet/amber/rose palette
// (no indigo/blue per the project styling rules).
const HIGHLIGHT_STYLES: Record<ReleaseHighlightType, { badge: string; dot: string }> = {
  new: {
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  improved: {
    badge: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    dot: "bg-teal-500",
  },
  removed: {
    badge: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    dot: "bg-rose-500",
  },
  fixed: {
    badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
  },
};

/**
 * VersionUpdateDialog — shows "what's new" once per release.
 *
 * - Existing users: shows on their first visit after an update (when
 *   `lastSeenReleaseVersion` !== `APP_VERSION`).
 * - New users: shows once after they complete onboarding (onboardingCompleted
 *   flips to true, lastSeenReleaseVersion is still unset).
 * - Dismissing (close button or "Got it") records the current version so the
 *   popup never reappears for the same release.
 *
 * The release notes live in src/lib/version-info.ts — update that file (and
 * package.json) on every new release.
 */
export function VersionUpdateDialog() {
  const onboardingCompleted = useStore((s) => s.state.onboardingCompleted);
  const lastSeenReleaseVersion = useStore(
    (s) => s.state.preferences.lastSeenReleaseVersion,
  );
  const setPreference = useStore((s) => s.setPreference);

  // Whether the dialog is visually open. We control this separately from the
  // "should show" condition so we can animate the close before recording.
  const [open, setOpen] = useState(false);

  // The version we're currently showing notes for (frozen at show-time so a
  // mid-display version change can't desync the record we write on dismiss).
  const [shownVersion, setShownVersion] = useState<string | null>(null);

  useEffect(() => {
    // Only show after onboarding is done, and only if this release's notes
    // haven't been seen yet. The small delay lets the dashboard settle before
    // the popup appears (smoother for new users right after onboarding).
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
    // Record the version we just showed so it never reappears for this release.
    if (shownVersion) {
      setPreference("lastSeenReleaseVersion", shownVersion);
    }
  };

  if (!onboardingCompleted) return null;

  const release = LATEST_RELEASE;
  const formattedDate = formatDate(release.date);

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

        {/* Highlights list */}
        <div className="space-y-2 mt-1">
          {release.highlights.map((h, i) => {
            const style = HIGHLIGHT_STYLES[h.type];
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 transition-colors"
              >
                <span
                  className={cn(
                    "shrink-0 mt-0.5 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border",
                    style.badge,
                  )}
                >
                  {HIGHLIGHT_LABELS[h.type]}
                </span>
                <p className="text-sm leading-relaxed text-foreground/90 flex-1">
                  {h.text}
                </p>
              </div>
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
