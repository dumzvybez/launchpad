"use client";

import { useState, useEffect } from "react";
import { X, Monitor, Smartphone } from "lucide-react";
import { useStore } from "@/lib/store";

export function MobileBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const setPreference = useStore((s) => s.setPreference);
  const mobileBannerDismissed = useStore((s) => s.state.preferences.mobileBannerDismissed);

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024); // tablet and below
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Show again on every new session (page load), but allow dismiss per session
  if (!isMobile || dismissed || mobileBannerDismissed) return null;

  return (
    <div className="px-3 sm:px-4 pt-2">
      <div className="rounded-xl bg-amber-500/15 border border-amber-500/40 p-3 flex items-center gap-3">
        <Smartphone className="h-5 w-5 text-amber-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
            Use desktop for better experience
          </p>
          <p className="text-[10px] text-muted-foreground">
            Launchpad works on mobile but is optimized for larger screens.
          </p>
        </div>
        <button
          onClick={() => {
            setDismissed(true);
            setPreference("mobileBannerDismissed", true);
          }}
          className="p-1 rounded hover:bg-foreground/10 shrink-0"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
