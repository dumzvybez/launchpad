"use client";

import { useState, useEffect, useRef } from "react";
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
  const giscusContainerRef = useRef<HTMLDivElement>(null);

  const section = SECTIONS.find((s) => s.id === activeSection)!;

  // Inject/re-inject Giscus script when section changes or reload is requested
  useEffect(() => {
    if (!giscusContainerRef.current) return;
    // Clear previous Giscus iframe
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
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "en");
    script.setAttribute("loading", "lazy");

    giscusContainerRef.current.appendChild(script);
  }, [activeSection, section, reloadKey]);

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

      {/* Giscus embed — takes most of the space, min height 600px for full conversation view */}
      <GlassCard className="p-4 sm:p-6">
        <div ref={giscusContainerRef} className="min-h-[600px]" key={reloadKey}>
          {/* Giscus script injects here */}
          <div className="flex items-center justify-center py-12 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Loading {section.label} from GitHub Discussions…
            </div>
          </div>
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
              href={`https://github.com/dumzvybez/launchpad/discussions/categories/${section.categoryName.toLowerCase().replace(/ /g, "-")}`}
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
