"use client";

import { useEffect, useState } from "react";
import { Download, X, Sparkles } from "lucide-react";
import { GlassButton } from "@/components/glass/GlassPrimitives";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "launchpad:pwa-install-dismissed";
const DISMISS_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days
const SHOW_DELAY = 18000; // Show after 18s on page (less disruptive)
const AUTO_DISMISS = 12000; // Auto-hide after 12s if no interaction

/**
 * InstallPrompt — small, top-right toast that appears after a delay.
 * Less disruptive than a bottom-right modal. Auto-dismisses if ignored.
 * Hidden if: already installed, dismissed in last 7 days, or iOS
 * (iOS doesn't support beforeinstallprompt — user must use Share → Add to Home Screen).
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Detect if already running as PWA — synchronously on mount
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ((window.navigator as unknown as { standalone?: boolean }).standalone ===
        true);

    if (standalone) return;

    // Check if user dismissed recently
    try {
      const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
      if (Date.now() - dismissedAt < DISMISS_DURATION) return;
    } catch {
      // ignore
    }

    let showTimer: ReturnType<typeof setTimeout> | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    const handler = (e: Event) => {
      e.preventDefault();
      const evt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(evt);

      // Delay showing — let user explore first
      showTimer = setTimeout(() => {
        setVisible(true);
        // Auto-hide after AUTO_DISMISS ms if no interaction
        hideTimer = setTimeout(() => setVisible(false), AUTO_DISMISS);
      }, SHOW_DELAY);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed top-16 right-4 z-50 max-w-xs view-enter">
      <div className="glass-elevated rounded-2xl p-3 pr-8 relative shadow-2xl">
        <button
          onClick={handleDismiss}
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
            <h3 className="text-xs font-semibold">Install Launchpad</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
              Add to desktop for offline access.
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <button
                onClick={handleInstall}
                className="inline-flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-2 py-1 text-[10px] font-medium hover:brightness-110 transition-all"
              >
                <Download className="h-2.5 w-2.5" /> Install
              </button>
              <button
                onClick={handleDismiss}
                className="inline-flex items-center rounded-md px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-foreground/5 transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
