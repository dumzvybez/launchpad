"use client";

import { useEffect, useState } from "react";
import { WifiOff, X } from "lucide-react";
import { useStore } from "@/lib/store";

/**
 * OfflineBanner — shows a friendly "You're offline" banner when the network
 * is lost. Per Section 14.2 of Prompt-2-updated.txt: shows what still works
 * offline (cached lessons, quizzes, roadmap, badges, certificates).
 *
 * Dismissible per session.
 */
export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const setView = useStore((s) => s.setView);

  useEffect(() => {
    // Initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setDismissed(false); // Reset dismissal when going offline again
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline || dismissed) return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-xs">
      <div className="max-w-6xl mx-auto flex items-center gap-2 text-amber-700 dark:text-amber-300">
        <WifiOff className="h-3.5 w-3.5 shrink-0" />
        <span className="font-medium">You&apos;re offline</span>
        <span className="text-muted-foreground">
          · Cached lessons, quizzes, roadmap, badges, and certificates still work.
        </span>
        <button
          onClick={() => setView("learn")}
          className="text-primary hover:underline ml-auto"
        >
          Open Learn →
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-0.5 hover:bg-foreground/10 rounded"
          aria-label="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
