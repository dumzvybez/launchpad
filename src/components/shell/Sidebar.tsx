"use client";

import {
  LayoutDashboard,
  Map,
  GraduationCap,
  Code2,
  Calendar,
  Target,
  Sparkles,
  Workflow,
  StickyNote,
  FolderGit2,
  Timer,
  BarChart3,
  Rocket,
  User,
  Settings,
  Bot,
  Users,
} from "lucide-react";
import { useStore, selectLevel, selectEarnedXP } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ProgressRing } from "@/components/glass/GlassPrimitives";
import type { ViewId } from "@/lib/types";

type NavItem = { id: ViewId; label: string; icon: typeof LayoutDashboard; hint: string; group: "main" | "learn" | "productivity" | "system" };

const ALL_NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, hint: "Overview & today", group: "main" },
  { id: "roadmap", label: "Roadmap", icon: Map, hint: "6 phases, modules, tasks", group: "main" },
  { id: "learn", label: "Learn", icon: GraduationCap, hint: "Lessons & quizzes", group: "learn" },
  { id: "playground", label: "JS Playground", icon: Code2, hint: "Run JavaScript in your browser", group: "learn" },
  { id: "daily-challenge", label: "Daily Challenge", icon: Target, hint: "Rotating coding challenges", group: "learn" },
  { id: "skill-tree", label: "Skill Tree", icon: Workflow, hint: "Dependency graph", group: "main" },
  { id: "ai-tutor", label: "AI Tutor", icon: Bot, hint: "Ask the AI tutor", group: "learn" },
  { id: "calendar", label: "Calendar", icon: Calendar, hint: "Study planner", group: "productivity" },
  { id: "notes", label: "Notes", icon: StickyNote, hint: "Knowledge base & journal", group: "productivity" },
  { id: "projects", label: "Projects", icon: FolderGit2, hint: "Build & track portfolio", group: "productivity" },
  { id: "focus", label: "Focus", icon: Timer, hint: "Pomodoro & habits", group: "productivity" },
  { id: "analytics", label: "Analytics", icon: BarChart3, hint: "Heatmaps & insights", group: "productivity" },
  { id: "career", label: "Career", icon: Rocket, hint: "Resume & interview prep", group: "productivity" },
  { id: "community", label: "Community", icon: Users, hint: "GitHub Discussions (Q&A, showcase, ideas)", group: "productivity" },
  { id: "account", label: "Account", icon: User, hint: "Profile & achievements", group: "system" },
  { id: "settings", label: "Settings", icon: Settings, hint: "Preferences & data", group: "system" },
];

const GROUP_LABELS: Record<string, string> = {
  main: "Learning",
  learn: "Learn",
  productivity: "Productivity",
  system: "System",
};

export function getNavItems(roadmap?: { languageIds: string[] } | null): NavItem[] {
  if (!roadmap) return ALL_NAV;
  const hasJSOrTS = roadmap.languageIds.some((id) =>
    ["javascript", "typescript", "react", "nextjs"].includes(id),
  );
  if (hasJSOrTS) return ALL_NAV;
  // Hide playground if no JS/TS in plan
  return ALL_NAV.filter((n) => n.id !== "playground");
}

export function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const currentView = useStore((s) => s.currentView);
  const setView = useStore((s) => s.setView);
  const state = useStore((s) => s.state);
  const setCommandOpen = useStore((s) => s.setCommandOpen);

  const level = selectLevel(state);
  const earnedXP = selectEarnedXP(state);
  const streak = state.streak.current;
  const freezes = state.streak.freezes;

  const nav = getNavItems(state.roadmap);
  const grouped = nav.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <aside
      className={cn(
        "glass-elevated flex flex-col rounded-3xl p-3 transition-all duration-300 h-full overflow-hidden",
        collapsed ? "w-[68px]" : "w-[244px]",
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 py-2.5 shrink-0">
        <div className="relative h-9 w-9 shrink-0">
          <LogoMark />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">Launchpad</span>
            <span className="text-[10px] text-muted-foreground font-mono">
              Coding Education OS
            </span>
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-2.5 mt-1 flex-1 min-h-0 overflow-y-auto no-scrollbar pr-1">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="flex flex-col gap-0.5">
            {!collapsed && (
              <span className="text-eyebrow px-3 mb-0.5">{GROUP_LABELS[group]}</span>
            )}
            {items.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] transition-all duration-200",
                    "border border-transparent",
                    active
                      ? "nav-item-active"
                      : "text-foreground/60 hover:text-foreground hover:bg-foreground/4",
                  )}
                  title={collapsed ? item.label : item.hint}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                      active && "text-primary",
                    )}
                  />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                  {!collapsed && active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed ? (
        <div className="mt-2 shrink-0">
          <div className="glass rounded-xl p-2.5 flex items-center gap-2.5">
            <ProgressRing value={level.pct} size={36} strokeWidth={3.5}>
              <span className="text-[10px] font-bold">{level.level}</span>
            </ProgressRing>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                <span>L{level.level}</span>
                <span className="text-muted-foreground font-mono text-[10px]">
                  · {earnedXP.toLocaleString()} XP
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                <span className={streak > 0 ? "font-medium text-orange-400" : "text-muted-foreground"}>
                  {streak > 0 ? `${streak}d streak` : "No streak"}
                </span>
                {freezes > 0 && (
                  <span className="ml-auto text-cyan-400 font-mono">❄ {freezes}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setCommandOpen(true)}
              className="shrink-0 rounded-md bg-foreground/5 hover:bg-foreground/10 p-1.5 transition-colors"
              title="Quick actions (Cmd+K)"
            >
              <kbd className="font-mono text-[9px] px-1 py-0.5 rounded bg-foreground/10 border border-border/40">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2 shrink-0 flex flex-col items-center gap-2">
          <ProgressRing value={level.pct} size={36} strokeWidth={3.5}>
            <span className="text-[10px] font-bold">{level.level}</span>
          </ProgressRing>
          <button
            onClick={() => setCommandOpen(true)}
            className="rounded-md bg-foreground/5 hover:bg-foreground/10 p-1.5 transition-colors"
            title="Quick actions (Cmd+K)"
          >
            <kbd className="font-mono text-[9px]">⌘K</kbd>
          </button>
        </div>
      )}
    </aside>
  );
}

// Inline logo mark — three-chevron upward arrow
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div
      className="relative h-full w-full rounded-xl flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, oklch(0.13 0.012 250) 0%, oklch(0.18 0.014 250) 100%)",
      }}
    >
      <svg
        width={size * 0.7}
        height={size * 0.7}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sidebar-logo-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="50%" stopColor="#E879F9" />
            <stop offset="100%" stopColor="#FCD34D" />
          </linearGradient>
        </defs>
        <path d="M 96 320 L 256 200 L 416 320 L 416 360 L 256 240 L 96 360 Z" fill="url(#sidebar-logo-grad)" />
        <path d="M 136 220 L 256 140 L 376 220 L 376 260 L 256 180 L 136 260 Z" fill="url(#sidebar-logo-grad)" />
        <path d="M 176 120 L 256 80 L 336 120 L 336 160 L 256 120 L 176 160 Z" fill="url(#sidebar-logo-grad)" />
      </svg>
    </div>
  );
}

export { ALL_NAV as NAV };
export function totalPhases() {
  return 6;
}
