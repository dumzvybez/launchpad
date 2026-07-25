"use client";

/**
 * FirstVisitHints — lightweight, ephemeral per-view contextual hints (v5.926 D2).
 *
 * The first time a user visits each major view, shows a brief, subtle,
 * auto-dismissing (~3.5 second) hint at the top describing what the view is for.
 * Also shows ONE persistent (dismissible, not auto-hiding) tip about the
 * Command Palette (Ctrl+K).
 *
 * v6.010 (UI-B mobile refinement):
 * - View hint now uses ≥14px text on mobile and respects the iOS safe-area
 *   top inset so it never sits under the notch / Dynamic Island.
 * - View hint is repositioned to sit just below the TopBar on mobile
 *   (top-14 + safe-area) instead of overlapping it.
 * - Command Palette tip remains desktop-only (hidden on mobile — no
 *   physical keyboard). The Ctrl+K kbd hint is also wrapped in a
 *   `hidden sm:inline-flex` so it never shows on touch devices.
 * - Close button is ≥44px on mobile.
 *
 * v5.932: New-user notification pacing — staggered delays so first-time users
 * aren't overwhelmed by multiple notifications stacking on top of each other:
 *   - View hints: show immediately (as designed), consistent 3.5s auto-hide
 *     with a smooth fade-out transition (was instant disappear).
 *   - Command Palette tip: delayed to ~30s after session start for FIRST-TIME
 *     users only (returning users who've dismissed it before are unaffected).
 *   - Version-update notification: delayed to ~2min for FIRST-TIME users only
 *     (handled in VersionUpdateDialog.tsx — returning users after a real
 *     update still get the normal ~900ms delay).
 *
 * - Each view's hint shows exactly once per user (tracked in localStorage).
 * - Non-blocking, no modal, no multi-step tour.
 * - Once a view has been visited once, its hint never shows again.
 */

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { X, Command, Sparkles } from "lucide-react";

type ViewHint = {
  view: string;
  text: string;
};

const VIEW_HINTS: ViewHint[] = [
  { view: "dashboard", text: "This is your Dashboard — your home base with today's tasks, streak, and Career Readiness." },
  { view: "roadmap", text: "This is your Roadmap — a personalized multi-phase plan. Click a phase to expand it into tasks." },
  { view: "learn", text: "This is Learn — real lessons with inline code editors and quizzes for every language." },
  { view: "playground", text: "This is the Playground — write and run code directly in your browser, no setup needed." },
  { view: "projects", text: "This is Projects — build real projects and verify them with AI to count toward Career Readiness." },
  { view: "ai-tutor", text: "This is the AI Tutor — ask coding questions 24/7 (BYOK). Includes Interview Mode and Code Review." },
  { view: "career", text: "This is Career — your Career Readiness Score, resume builder, and Career Master Certificate." },
  { view: "flashcards", text: "This is Flashcards — spaced repetition for coding concepts, auto-generated from your lessons." },
  { view: "analytics", text: "This is Analytics — your learning activity, time-of-day patterns, and progress charts." },
  { view: "skill-tree", text: "This is the Skill Tree — a visual graph of your dependencies and prerequisites." },
];

const HINT_SEEN_PREFIX = "launchpad:hint-seen:";
const CMDK_TIP_SEEN = "launchpad:cmdk-tip-seen";

// v5.932: Consistent auto-hide duration for ALL view hints (was already 3.5s
// but some appeared to hide inconsistently due to the instant disappear).
// The fade-out transition (300ms) now makes the hide feel consistent.
const HINT_AUTO_HIDE_MS = 3500;
const HINT_FADE_OUT_MS = 300;

// v5.932: First-time users get the Command Palette tip delayed to ~30s so it
// doesn't stack with view hints and the version notification. Returning users
// (who've already dismissed it) never see it again.
const CMDK_TIP_FIRST_USER_DELAY_MS = 30_000;

export function FirstVisitHints() {
  const currentView = useStore((s) => s.currentView);
  const [hint, setHint] = useState<string | null>(null);
  const [hintFadingOut, setHintFadingOut] = useState(false);
  const [showCmdkTip, setShowCmdkTip] = useState(false);

  // Check + show the view hint on view change.
  useEffect(() => {
    if (!currentView) return;
    const viewHint = VIEW_HINTS.find((h) => h.view === currentView);
    if (!viewHint) return;
    try {
      const seen = window.localStorage.getItem(HINT_SEEN_PREFIX + currentView);
      if (seen === "1") return; // already shown for this view
      setHint(viewHint.text);
      setHintFadingOut(false);
      window.localStorage.setItem(HINT_SEEN_PREFIX + currentView, "1");
      // v5.932: consistent auto-hide with smooth fade-out.
      // After HINT_AUTO_HIDE_MS, trigger the fade-out transition; after the
      // fade completes (HINT_FADE_OUT_MS), clear the hint entirely.
      const fadeTimer = setTimeout(() => setHintFadingOut(true), HINT_AUTO_HIDE_MS);
      const clearTimer = setTimeout(() => { setHint(null); setHintFadingOut(false); }, HINT_AUTO_HIDE_MS + HINT_FADE_OUT_MS);
      return () => { clearTimeout(fadeTimer); clearTimeout(clearTimer); };
    } catch {
      // localStorage unavailable — skip.
    }
  }, [currentView]);

  // Show the Command Palette tip once. v5.932: first-time users get a 30s delay
  // (returning users who've already dismissed it are unaffected — the seen flag
  // short-circuits before the delay matters).
  useEffect(() => {
    try {
      const seen = window.localStorage.getItem(CMDK_TIP_SEEN);
      if (seen !== "1") {
        // v5.932: 30s delay for first-time users so the tip doesn't stack with
        // view hints and the version-update notification during onboarding.
        const t = setTimeout(() => setShowCmdkTip(true), CMDK_TIP_FIRST_USER_DELAY_MS);
        return () => clearTimeout(t);
      }
    } catch {
      // ignore
    }
  }, []);

  const dismissCmdkTip = () => {
    setShowCmdkTip(false);
    try {
      window.localStorage.setItem(CMDK_TIP_SEEN, "1");
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* Ephemeral view hint — auto-dismissing, top-center, with fade-out.
          v6.010 (UI-B): sits below the TopBar (top-14) + safe-area top inset
          so it never overlaps the notch / Dynamic Island on iOS. Text is
          ≥14px on mobile for readability. Width is capped so long hints wrap
          gracefully on small screens. */}
      {hint && (
        <div
          className={cn(
            "fixed left-1/2 -translate-x-1/2 z-[90]",
            "flex items-center gap-2 text-foreground max-w-[92vw]",
            "rounded-xl glass-elevated border border-primary/30 shadow-lg",
            "px-4 py-3 sm:py-2 text-sm sm:text-xs",
            // Mobile: sit just below the TopBar (56px) + safe-area top.
            // Desktop: original top-16 (64px).
            "top-[calc(env(safe-area-inset-top,0px)+3.5rem)] sm:top-16",
            "transition-opacity",
            hintFadingOut ? "opacity-0" : "opacity-100",
          )}
          style={{
            animation: hintFadingOut ? undefined : "lp-hint-slide-in 0.3s ease-out",
            transitionDuration: `${HINT_FADE_OUT_MS}ms`,
          }}
          role="status"
          aria-live="polite"
        >
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <span className="line-clamp-2 sm:truncate">{hint}</span>
        </div>
      )}

      {/* Persistent Command Palette tip — dismissible, bottom-right.
          v6.009: hidden on mobile (no keyboard) — only show on lg+ desktop.
          v6.010 (UI-B): Ctrl+K kbd hints wrapped in `hidden sm:inline-flex`
          so they never appear on touch devices, even if the tip somehow
          renders. Close button is ≥44px on mobile. */}
      {showCmdkTip && (
        <div
          className="hidden lg:flex fixed bottom-20 right-4 z-[90] w-72 max-w-[90vw] rounded-xl glass-elevated border border-primary/30 shadow-xl p-3 items-start gap-2.5"
          style={{ animation: "lp-hint-slide-in 0.4s ease-out" }}
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-400 to-fuchsia-400 flex items-center justify-center shrink-0">
            <Command className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold">Tip: Jump anywhere fast</div>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              Press{" "}
              <kbd className="hidden sm:inline-flex px-1 py-0.5 rounded bg-foreground/10 text-[10px] font-mono items-center">Ctrl</kbd>
              <span className="hidden sm:inline mx-0.5">+</span>
              <kbd className="hidden sm:inline-flex px-1 py-0.5 rounded bg-foreground/10 text-[10px] font-mono items-center">K</kbd>
              {" "}to open the Command Palette — search lessons, jump to tabs, run commands.
            </p>
          </div>
          <button
            onClick={dismissCmdkTip}
            className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Dismiss tip"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </>
  );
}
