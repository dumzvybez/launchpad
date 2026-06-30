"use client";

import { useState, useEffect } from "react";
import { X, Smartphone } from "lucide-react";

/**
 * MobileBanner — shown on tablet/mobile widths to suggest using desktop.
 *
 * Behavior (v2.68 fix):
 *   - Dismissal is PER-SESSION only (in-memory state, not persisted).
 *   - The banner re-appears on every new page load / refresh.
 *   - This matches the original comment intent: "Show again on every new
 *     session, but allow dismiss per session."
 *
 * Previously the code called `setPreference("mobileBannerDismissed", true)`
 * which made dismissal PERMANENT (until the user reset all data), contradicting
 * the comment and never showing the banner again after the first dismiss.
 */
export function MobileBanner() {
  // Per-session dismissal only — no localStorage, no Zustand preference.
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1024); // tablet and below
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isMobile || dismissed) return null;

  return (
    <div className="px-3 sm:px-4 pt-2">
      <div className="rounded-xl bg-amber-500/15 border border-amber-500/40 p-3 flex items-center gap-3" role="status">
        <Smartphone className="h-5 w-5 text-amber-500 shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
            Use desktop for a better experience
          </p>
          <p className="text-[10px] text-muted-foreground">
            Launchpad works on mobile but is optimized for larger screens.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded hover:bg-foreground/10 shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
