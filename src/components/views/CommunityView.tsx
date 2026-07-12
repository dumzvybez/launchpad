"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Megaphone,
  HelpCircle,
  Rocket,
  MessageCircle,
  Lightbulb,
  Github,
  Info,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

/**
 * CommunityView — GitHub Discussions integration via Giscus.
 *
 * HOW GISCUS WORKS (important — read if debugging):
 * - data-mapping="specific" + data-term="X" means Giscus searches the configured
 *   Discussion category for a discussion whose TITLE contains "X".
 * - When a user posts via the Giscus widget, Giscus auto-creates a discussion
 *   titled exactly "X" (e.g., "announcements"). All widget comments become
 *   replies to that single discussion thread.
 * - Manually-created discussions on GitHub (with different titles like "Hello")
 *   will NOT appear in the widget — Giscus only shows the thread matching the term.
 * - To verify: visit https://github.com/dumzvybez/launchpad/discussions/categories/<category>
 *   and confirm a discussion titled "announcements" (etc.) exists.
 *
 * The repo name is CASE-SENSITIVE in Giscus — must be lowercase "launchpad"
 * to match what giscus.app generated. Capital "L" silently fails.
 */

type SectionId = "announcements" | "help" | "showcase" | "general" | "ideas";

const SECTIONS: {
  id: SectionId;
  label: string;
  icon: typeof Megaphone;
  description: string;
  /** GitHub Discussions category name (case-sensitive, must match GitHub) */
  categoryName: string;
  categoryId: string;
  /** The specific term Giscus searches for in discussion titles */
  term: string;
}[] = [
  {
    id: "announcements",
    label: "Announcements",
    icon: Megaphone,
    description: "Official Launchpad updates, releases, and important news.",
    categoryName: "Announcements",
    categoryId: "DIC_kwDOTGGyn84DAFI4",
    term: "announcements",
  },
  {
    id: "help",
    label: "Help & Questions",
    icon: HelpCircle,
    description: "Stuck on a lesson or project? Ask the community — get unstuck fast.",
    categoryName: "Q&A",
    categoryId: "DIC_kwDOTGGyn84DAFI6",
    term: "help",
  },
  {
    id: "showcase",
    label: "Show & Tell",
    icon: Rocket,
    description: "Share your capstone projects, side projects, and wins with the community.",
    categoryName: "Show and tell",
    categoryId: "DIC_kwDOTGGyn84DAFI8",
    term: "showcase",
  },
  {
    id: "general",
    label: "General Chat",
    icon: MessageCircle,
    description: "Talk about anything coding-related — career advice, memes, recommendations.",
    categoryName: "General",
    categoryId: "DIC_kwDOTGGyn84DAFI5",
    term: "general",
  },
  {
    id: "ideas",
    label: "Feature Requests",
    icon: Lightbulb,
    description: "Suggest new features, vote on ideas, and shape the future of Launchpad.",
    categoryName: "Ideas",
    categoryId: "DIC_kwDOTGGyn84DAFI7",
    term: "ideas",
  },
];

// Giscus config — repo name MUST be lowercase to match what giscus.app generated.
// Capital "Launchpad" silently fails to load.
const GISCUS_REPO = "dumzvybez/launchpad";
const GISCUS_REPO_ID = "R_kgDOTGGynw";

export function CommunityView() {
  const [activeSection, setActiveSection] = useState<SectionId>("announcements");
  const [reloadKey, setReloadKey] = useState(0);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  // v5.931 (#6): Loading overlay state, shown via a SIBLING of the giscus
  // container (so it survives the container's innerHTML="" wipe). The
  // overlay is hidden when Giscus posts a message containing the
  // `discussion` field, or after a 4s fallback timeout.
  const [isLoading, setIsLoading] = useState(true);
  const giscusContainerRef = useRef<HTMLDivElement>(null);
  const loadingFallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { resolvedTheme } = useTheme();

  const section = SECTIONS.find((s) => s.id === activeSection)!;

  // Inject/re-inject Giscus script when section changes, theme changes, or reload is requested.
  // v5.931 (#6): The container div is now STABLE (no React `key` prop) — the
  // previous `key={reloadKey}` forced React to unmount+remount the div on every
  // reload, which destroyed the live iframe BEFORE injectGiscus could fade it
  // out. That was the root cause of the "content vanishes then reappears"
  // flash. Now injectGiscus clears innerHTML and appends a fresh <script> on
  // the SAME div, while a sibling loading overlay (driven by `isLoading`)
  // covers the brief gap between clearing and the new iframe rendering.
  const injectGiscus = useCallback(() => {
    if (!giscusContainerRef.current) return;

    // Clear the previous script/iframe in place on the stable container.
    giscusContainerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", GISCUS_REPO);
    script.setAttribute("data-repo-id", GISCUS_REPO_ID);
    script.setAttribute("data-category", section.categoryName);
    script.setAttribute("data-category-id", section.categoryId);
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", section.term);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    // v5.931 (#6): emit-metadata=1 so the iframe posts a METADATA message
    // (with the `discussion` field, possibly null) once it has finished
    // loading. The parent's message listener uses this to (a) hide the
    // loading overlay and (b) update `lastRefreshedAt` when the current
    // user posts a comment — that's what gives "live updates without a
    // full reload". With emit-metadata=0 (the v5.930 default), no
    // METADATA messages are sent and the listener never fires, so the
    // overlay would always wait for the 4s fallback timer. Metadata is
    // just the discussion title/URL/reaction-count — no sensitive data.
    script.setAttribute("data-emit-metadata", "1");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", resolvedTheme === "light" ? "light" : "dark");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "eager");

    giscusContainerRef.current.appendChild(script);
    setLastRefreshedAt(new Date());
    setIsLoading(true);

    // Fallback: hide the loading overlay after 4 seconds even if the Giscus
    // iframe never emits a `discussion` message (e.g., network error, the
    // widget fell back to a sign-in prompt, or the message format changed).
    // The message listener below normally hides it much faster.
    if (loadingFallbackTimer.current) clearTimeout(loadingFallbackTimer.current);
    loadingFallbackTimer.current = setTimeout(() => setIsLoading(false), 4000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, resolvedTheme]);

  useEffect(() => {
    injectGiscus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [injectGiscus, reloadKey]);

  // Cleanup the fallback timer on unmount.
  useEffect(() => {
    return () => {
      if (loadingFallbackTimer.current) clearTimeout(loadingFallbackTimer.current);
    };
  }, []);

  // Auto-refresh: re-inject Giscus periodically while the tab is visible
  // AND the user is NOT actively interacting (hovering, typing, or scrolling
  // inside the Giscus area). v5.931 (#6): interval extended from 60s → 120s
  // — the postMessage listener below already updates `lastRefreshedAt` in
  // real time when the CURRENT user posts a comment, so the periodic
  // re-inject is only needed to pull in OTHER users' new comments. Less
  // frequent re-injection means less work for the browser and less visible
  // churn. The flash bug from v5.930 (caused by `key={reloadKey}` on the
  // container div) is fixed separately by removing the key.
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    let userInteracting = false;
    let interactionTimeout: ReturnType<typeof setTimeout> | null = null;

    const markInteracting = () => {
      userInteracting = true;
      if (interactionTimeout) clearTimeout(interactionTimeout);
      // Resume auto-refresh 10 seconds after the user stops interacting
      interactionTimeout = setTimeout(() => { userInteracting = false; }, 10_000);
    };

    const start = () => {
      if (timer) return;
      timer = setInterval(() => {
        if (document.visibilityState === "visible" && !userInteracting) {
          setReloadKey((k) => k + 1);
        }
      }, 120_000); // 120 seconds (was 60s, originally 10s)
    };
    const stop = () => {
      if (timer) { clearInterval(timer); timer = null; }
    };
    start();

    // Pause during user interaction with the Giscus area
    const giscusContainer = giscusContainerRef.current;
    if (giscusContainer) {
      giscusContainer.addEventListener("mouseenter", markInteracting);
      giscusContainer.addEventListener("focusin", markInteracting);
      giscusContainer.addEventListener("scroll", markInteracting, { passive: true });
    }

    const onVis = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
      if (giscusContainer) {
        giscusContainer.removeEventListener("mouseenter", markInteracting);
        giscusContainer.removeEventListener("focusin", markInteracting);
        giscusContainer.removeEventListener("scroll", markInteracting);
      }
      if (interactionTimeout) clearTimeout(interactionTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for Giscus iframe messages. Giscus posts a message with the
  // `discussion` field (object if found, null if not yet created) once the
  // iframe has finished its initial load. We use this to:
  //   (1) hide the loading overlay (whether the discussion exists or not),
  //   (2) update `lastRefreshedAt` only when there's a real discussion
  //       (so empty sections don't pretend to have refreshed).
  // This is also how we get "live updates" for the current user's own new
  // comments without a full re-inject — Giscus re-posts the discussion
  // metadata every time a comment is added.
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== "https://giscus.app") return;
      const g = e.data?.giscus;
      if (g && typeof g === "object" && "discussion" in g) {
        setIsLoading(false);
        if (g.discussion) {
          setLastRefreshedAt(new Date());
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      {/* Compact header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">Community</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Powered by GitHub Discussions — ask, share, and shape Launchpad.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-colors"
            title="Reload discussion"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reload
          </button>
          <a
            href="https://github.com/dumzvybez/launchpad/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-colors"
          >
            <Github className="h-3.5 w-3.5" /> Open on GitHub
          </a>
        </div>
      </div>

      {/* Auto-refresh status line */}
      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 -mt-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
        Auto-refreshes every 2 min (paused while you interact)
        {lastRefreshedAt && (
          <span className="text-muted-foreground/70">
            · last updated {lastRefreshedAt.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Section tabs — horizontal scroll on mobile, wraps on desktop */}
      <div className="flex flex-wrap gap-1.5">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = s.id === activeSection;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                active
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/60 text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Active section description — single line, compact */}
      <div className="text-xs text-muted-foreground flex items-center gap-2">
        <section.icon className="h-3.5 w-3.5 text-primary shrink-0" />
        <span>{section.description}</span>
      </div>

      {/* Giscus embed — v5.931 (#6): fixed-height scrollable area + no flash on refresh.
          OUTER div is a stable (no `key`) scroll container with `max-h-[70vh] overflow-y-auto`,
          so the Giscus iframe (which sizes itself to its content) is constrained
          and scrolls within a fixed viewport instead of growing the page unboundedly.
          INNER div (giscusContainerRef) is where the <script> injects the iframe;
          it has no React `key`, so reloads clear+reinject in place rather than
          unmounting the live iframe. The loading overlay is a SIBLING of the
          inner div, so it survives the inner div's `innerHTML=""` wipe and can
          cover the brief gap between clearing and the new iframe rendering. */}
      <GlassCard className="p-4 sm:p-6">
        <div className="relative min-h-[500px] max-h-[70vh] overflow-y-auto rounded-xl">
          <div ref={giscusContainerRef} className="min-h-[500px]">
            {/* Giscus <script> injects the <iframe> here. */}
          </div>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[2px] pointer-events-none transition-opacity duration-200">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                Loading {section.label} from GitHub Discussions…
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Compact help box — how Giscus works for the user */}
      <GlassCard className="p-3 bg-teal-500/5 border-teal-500/20">
        <div className="flex items-start gap-2 text-xs">
          <Info className="h-3.5 w-3.5 text-teal-500 shrink-0 mt-0.5" />
          <div className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">How this works:</strong>{" "}
            Comments you post here appear in{" "}
            <a
              href={`https://github.com/dumzvybez/launchpad/discussions/categories/${section.categoryName.toLowerCase().replace(/ /g, "-").replace(/&/g, "a")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-0.5"
            >
              the &quot;{section.categoryName}&quot; category on GitHub <ExternalLink className="h-3 w-3" />
            </a>
            . You need a free GitHub account to post (Giscus authenticates you). Your Launchpad
            progress data is never shared here — it stays on your device.
            <br />
            <strong className="text-foreground">Note:</strong> Discussions you create manually on
            GitHub with custom titles won&apos;t show here — Giscus groups all comments under a
            single thread per section. Use the comment box above to post.
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
