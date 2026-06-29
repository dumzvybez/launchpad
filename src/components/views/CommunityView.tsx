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
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";

/**
 * CommunityView — GitHub Discussions integration via Giscus.
 *
 * Per Section 9 of Prompt-2-updated.txt:
 * 5 sections, each pointing to a different Discussion category:
 *   - Announcements
 *   - Help & Questions (Q&A)
 *   - Show & Tell
 *   - General Chat
 *   - Feature Requests (Ideas)
 *
 * Implementation note: We use the official Giscus script tag (loaded client-side)
 * rather than the `@giscus/react` package to avoid adding a heavy dependency.
 * The script is re-injected when the user switches sections, with the correct
 * `data-category-id` and `data-term` attributes.
 *
 * Privacy: Participating requires a GitHub account. Launchpad progress data
 * is NEVER shared here — it stays on the user's device.
 */

type SectionId = "announcements" | "help" | "showcase" | "general" | "ideas";

const SECTIONS: {
  id: SectionId;
  label: string;
  icon: typeof Megaphone;
  description: string;
  categoryId: string;
  term: string;
}[] = [
  {
    id: "announcements",
    label: "Announcements",
    icon: Megaphone,
    description: "Official Launchpad updates, releases, and important news.",
    categoryId: "DIC_kwDOTGGyn84DAFI4",
    term: "announcements",
  },
  {
    id: "help",
    label: "Help & Questions",
    icon: HelpCircle,
    description: "Stuck on a lesson or project? Ask the community — get unstuck fast.",
    categoryId: "DIC_kwDOTGGyn84DAFI6",
    term: "help",
  },
  {
    id: "showcase",
    label: "Show & Tell",
    icon: Rocket,
    description: "Share your capstone projects, side projects, and wins with the community.",
    categoryId: "DIC_kwDOTGGyn84DAFI8",
    term: "showcase",
  },
  {
    id: "general",
    label: "General Chat",
    icon: MessageCircle,
    description: "Talk about anything coding-related — career advice, memes, recommendations.",
    categoryId: "DIC_kwDOTGGyn84DAFI5",
    term: "general",
  },
  {
    id: "ideas",
    label: "Feature Requests",
    icon: Lightbulb,
    description: "Suggest new features, vote on ideas, and shape the future of Launchpad.",
    categoryId: "DIC_kwDOTGGyn84DAFI7",
    term: "ideas",
  },
];

// Giscus config (Section 9.2 of prompt)
const GISCUS_REPO = "dumzvybez/Launchpad";
const GISCUS_REPO_ID = "R_kgDOTGGynw";

export function CommunityView() {
  const [activeSection, setActiveSection] = useState<SectionId>("announcements");
  const giscusContainerRef = useRef<HTMLDivElement>(null);

  const section = SECTIONS.find((s) => s.id === activeSection)!;

  // Inject/re-inject Giscus script when section changes
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
    script.setAttribute("data-category", section.label);
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
  }, [activeSection, section]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Community</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Discuss Launchpad, ask questions, share projects, and shape the roadmap — powered by GitHub Discussions.
        </p>
      </div>

      {/* Privacy notice */}
      <GlassCard className="p-4 bg-gradient-to-br from-teal-500/5 to-violet-500/5 border-teal-500/20">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-semibold mb-1">How Community works</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Participating in Community requires a free GitHub account (Giscus authenticates you via GitHub).
              <strong className="text-foreground"> Your Launchpad progress data is never shared here</strong> — it
              stays on your device. Comments are stored in the{" "}
              <a
                href="https://github.com/dumzvybez/Launchpad/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-0.5"
              >
                Launchpad GitHub Discussions <ExternalLink className="h-3 w-3" />
              </a>{" "}
              and are public.
            </p>
          </div>
          <a
            href="https://github.com/dumzvybez/Launchpad/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-colors"
          >
            <Github className="h-3.5 w-3.5" /> Open on GitHub
          </a>
        </div>
      </GlassCard>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2">
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

      {/* Active section header */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-teal-500/15 to-violet-500/15 flex items-center justify-center shrink-0">
            <section.icon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold">{section.label}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{section.description}</p>
          </div>
        </div>
      </GlassCard>

      {/* Giscus embed */}
      <GlassCard className="p-4">
        <div ref={giscusContainerRef} className="min-h-[400px]">
          {/* Giscus script injects here */}
          <div className="flex items-center justify-center py-12 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Loading {section.label} from GitHub Discussions…
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Empty-state hint for first-time users */}
      <GlassCard className="p-4 bg-amber-500/5 border-amber-500/20">
        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">No posts yet?</strong> Be the first to start a conversation!
          Click "Open on GitHub" above to browse all discussions or create a new one. The community is new —
          your post helps future learners.
        </div>
      </GlassCard>
    </div>
  );
}
