"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Map,
  Workflow,
  StickyNote,
  FolderGit2,
  Timer,
  BarChart3,
  Rocket,
  CheckCircle2,
  Circle,
  ExternalLink,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  Search,
  Calendar,
  User,
  Users,
  Bot,
  Settings,
  GraduationCap,
  Code2,
  Target,
  Wrench,
  Layers,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ViewId } from "@/lib/types";
import { ConfirmDialog } from "@/components/shell/ConfirmDialog";
import { getLessons } from "@/lib/lessons-data";
import { PROJECTS } from "@/lib/projects-data";
import { ALL_LANGUAGE_INFO } from "@/lib/lessons-meta";
import { resolveRef } from "@/lib/identity";

const VIEW_ICONS: Record<ViewId, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  roadmap: Map,
  "skill-tree": Workflow,
  notes: StickyNote,
  projects: FolderGit2,
  focus: Timer,
  analytics: BarChart3,
  career: Rocket,
  calendar: Calendar,
  community: Users,
  account: User,
  settings: Settings,
  learn: GraduationCap,
  playground: Code2,
  "daily-challenge": Target,
  "ai-tutor": Bot,
  tools: Wrench,
  flashcards: Layers,
};

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "roadmap", label: "Roadmap" },
  { id: "learn", label: "Learn" },
  { id: "playground", label: "Playground" },
  { id: "daily-challenge", label: "Daily Challenge" },
  { id: "skill-tree", label: "Skill Tree" },
  { id: "ai-tutor", label: "AI Tutor" },
  { id: "flashcards", label: "Flashcards" },
  { id: "tools", label: "Tools (Calendar/Notes/Focus)" },
  { id: "projects", label: "Projects" },
  { id: "analytics", label: "Analytics" },
  { id: "career", label: "Career" },
  { id: "community", label: "Community" },
  { id: "account", label: "Account" },
  { id: "settings", label: "Settings" },
];

// v5.931: Compact help-topic index for the Command Palette. These are the
// most-searched help questions (full Q&A live in HelpCentre.tsx). Selecting
// one opens the Help Centre modal — the user reads the full answer there.
const HELP_TOPICS: { q: string; a: string }[] = [
  { q: "How do I get an AI API key?", a: "BYOK — Gemini, Groq, OpenRouter, OpenAI, Anthropic, or custom endpoint." },
  { q: "How do certificates work?", a: "Per-language (all lessons + 75% quiz avg) and Career Master (100% readiness)." },
  { q: "What is the Career Readiness Score?", a: "30% Roadmap + 30% Quizzes + 20% Projects + 20% Interviews." },
  { q: "How does spaced repetition work?", a: "SM-2 algorithm tracks missed quiz questions and flashcards." },
  { q: "Is my data private?", a: "Yes — 100% on-device. Only AI chat leaves your browser (to your provider)." },
  { q: "How do I reset my progress?", a: "Settings → Data & Backup → Reset all progress." },
  { q: "How many lessons are there?", a: "797 lessons across 38 languages & frameworks, with 7,200+ quiz questions." },
  { q: "How do I install the PWA?", a: "Install prompt appears after 18s, or use your browser's Install option." },
];

export function CommandPalette() {
  const open = useStore((s) => s.commandOpen);
  const setOpen = useStore((s) => s.setCommandOpen);
  const setView = useStore((s) => s.setView);
  const selectPhase = useStore((s) => s.selectPhase);
  const selectModule = useStore((s) => s.selectModule);
  const selectTask = useStore((s) => s.selectTask);
  const state = useStore((s) => s.state);
  const exportBackup = useStore((s) => s.exportBackup);
  const resetAll = useStore((s) => s.resetAll);
  const setLearnTabState = useStore((s) => s.setLearnTabState);
  const { theme, resolvedTheme, setTheme } = useTheme();

  const [search, setSearch] = React.useState("");
  // Reset the search field whenever the dialog opens. We use the
  // "adjust state during render" pattern (recommended by React docs) instead
  // of calling setState inside useEffect, which both avoids an extra render
  // and satisfies the react-hooks/set-state-in-effect lint rule.
  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setSearch("");
  }

  // Close handler
  const handleClose = () => setOpen(false);

  // Navigate to a view
  const goToView = (id: ViewId) => {
    setView(id);
    handleClose();
  };

  // v5.928 FIX (#2): Command Palette roadmap search result click now NAVIGATES
  // to the task in the Roadmap view instead of marking it complete.
  const handleTaskNavigate = (taskId: string, phaseId: string, moduleId: string) => {
    selectPhase(phaseId);
    selectModule(moduleId);
    selectTask(taskId);
    setView("roadmap");
    handleClose();
  };

  // v5.931: Navigate to a specific lesson in the Learn view.
  // v6.0: store the stable slug (resolveRef normalizes positional id → slug).
  const handleLessonNavigate = (lessonId: string, track: string) => {
    setLearnTabState({ tab: "lesson", selectedLessonId: resolveRef(lessonId), selectedTrack: track });
    setView("learn");
    handleClose();
  };

  // v5.931: Navigate to a specific project via the deep-link mechanism.
  const handleProjectNavigate = (projectId: string) => {
    useStore.setState({ deepLinkProjectId: projectId });
    setView("projects");
    handleClose();
  };

  const q = search.trim().toLowerCase();
  const hasQuery = q.length > 0;

  // v5.931: Relevance ranker — 0 = exact, 1 = starts-with, 2 = word-boundary,
  // 3 = contains. Lower score ranks first within a group.
  const rank = (text: string): number => {
    const t = text.toLowerCase();
    if (t === q) return 0;
    if (t.startsWith(q)) return 1;
    if (new RegExp(`\\b${escapeRegex(q)}`).test(t)) return 2;
    return 3;
  };
  const sortByRank = <T,>(items: T[], getText: (x: T) => string): T[] =>
    items.slice().sort((a, b) => rank(getText(a)) - rank(getText(b)));

  // Navigation — v5.931: now also filtered by query (previously hidden when searching).
  const filteredViews = React.useMemo(() => {
    if (!hasQuery) return VIEWS;
    return sortByRank(VIEWS.filter((v) => v.label.toLowerCase().includes(q)), (v) => v.label).slice(0, 6);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Tasks (roadmap) — existing, capped at 8.
  const filteredTasks = React.useMemo(() => {
    if (!hasQuery || !state.roadmap) return [];
    const allTasks = state.roadmap.phases.flatMap((p) =>
      p.modules.flatMap((m) =>
        m.tasks.map((t) => ({ ...t, phaseId: p.id, phaseTitle: p.title, moduleId: m.id, moduleTitle: m.title })),
      ),
    );
    const matched = allTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.phaseTitle.toLowerCase().includes(q) ||
        t.moduleTitle.toLowerCase().includes(q),
    );
    return sortByRank(matched, (t) => t.title).slice(0, 8);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, state.roadmap]);

  // v5.931: Lessons — search all 797 lessons (title + description + track name).
  // Uses getLessons() which returns the cached array (or [] if not yet loaded).
  const filteredLessons = React.useMemo(() => {
    if (!hasQuery) return [];
    const all = getLessons();
    if (all.length === 0) return [];
    const trackName = (trackId: string) => ALL_LANGUAGE_INFO[trackId]?.name ?? trackId;
    const matched = all.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        trackName(l.track).toLowerCase().includes(q),
    );
    return sortByRank(matched, (l) => l.title).slice(0, 8);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // v5.931: Projects — search the real 207-project database (title + description + languages + careers).
  const filteredProjects = React.useMemo(() => {
    if (!hasQuery) return [];
    const matched = PROJECTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.languages.some((l) => l.toLowerCase().includes(q)) ||
        p.skills.some((s) => s.toLowerCase().includes(q)),
    );
    return sortByRank(matched, (p) => p.title).slice(0, 5);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // v5.931: Notes — search the user's own notes (title + content).
  const filteredNotes = React.useMemo(() => {
    if (!hasQuery || state.notes.length === 0) return [];
    const matched = state.notes.filter(
      (n) =>
        (n.title || "Untitled").toLowerCase().includes(q) ||
        (n.body || "").toLowerCase().includes(q),
    );
    return sortByRank(matched, (n) => n.title || "Untitled").slice(0, 4);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, state.notes]);

  // v5.931: Help topics — search the compact help index.
  const filteredHelp = React.useMemo(() => {
    if (!hasQuery) return [];
    const matched = HELP_TOPICS.filter(
      (h) => h.q.toLowerCase().includes(q) || h.a.toLowerCase().includes(q),
    );
    return sortByRank(matched, (h) => h.q).slice(0, 4);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleExport = () => {
    exportBackup();
    toast.success("Backup exported");
    handleClose();
  };

  // v5.933: replaced native window.confirm with themed ConfirmDialog.
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    resetAll();
    toast.success("Workspace reset");
    handleClose();
    setShowResetConfirm(false);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        useStore.getState().importBackup(data);
        toast.success("Backup imported");
      } catch {
        toast.error("Invalid backup file");
      }
    };
    input.click();
    handleClose();
  };

  // v5.931: Open the Help Centre. The HelpCentre modal lives in the Footer
  // component (local state). We dispatch a CustomEvent that the Footer listens
  // for, so the Command Palette can trigger it without a store-level flag.
  const handleHelpOpen = () => {
    window.dispatchEvent(new CustomEvent("launchpad:open-help"));
    handleClose();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      // v6.010 (UI-B): mobile-first presentation. On phones the palette
      // becomes a full-screen sheet (top-0 left-0 right-0 bottom-0, no
      // transform, no max-width). Desktop keeps the centered 512px modal.
      className={cn(
        // Mobile: full-screen sheet, no rounded corners, no transform.
        "top-0 left-0 right-0 bottom-0 translate-x-0 translate-y-0",
        "w-full max-w-none h-full sm:h-auto sm:max-h-[85vh]",
        "rounded-none sm:rounded-lg",
        // Restore desktop centered modal at sm: breakpoint.
        "sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]",
        "sm:w-full sm:max-w-lg",
        // Pad the top for the iOS notch / Dynamic Island on mobile.
        "pt-[env(safe-area-inset-top,0px)] sm:pt-0",
        // Pad the bottom for the iOS home indicator on mobile.
        "pb-[env(safe-area-inset-bottom,0px)] sm:pb-0",
      )}
    >
      <CommandInput
        placeholder="Search lessons, projects, tasks, notes, help…"
        value={search}
        onValueChange={setSearch}
      />
      <CommandList
        // v6.010 (UI-B): on mobile use the full available screen height
        // (minus the input + safe-area). Desktop keeps the compact 300px.
        className="max-h-[calc(100vh-12rem)] sm:max-h-[300px]"
      >
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Navigation — v5.931: now shown both when empty AND when filtered by query */}
        {filteredViews.length > 0 && (
          <CommandGroup heading={hasQuery ? `Navigate (${filteredViews.length})` : "Navigate"}>
            {filteredViews.map((v) => {
              const Icon = VIEW_ICONS[v.id];
              return (
                <CommandItem key={v.id} onSelect={() => goToView(v.id)} className="group min-h-[48px] sm:min-h-0">
                  <Icon className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                  <span>{v.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {/* Tasks (roadmap) */}
        {filteredTasks.length > 0 && (
          <CommandGroup heading={`Tasks (${filteredTasks.length})`}>
            {filteredTasks.map((t) => {
              const isDone = !!state.tasks[t.id]?.completedAt;
              return (
                <CommandItem key={t.id} onSelect={() => handleTaskNavigate(t.id, t.phaseId, t.moduleId)} className="group min-h-[48px] sm:min-h-0">
                  {isDone ? (
                    <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" />
                  ) : (
                    <Circle className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">{t.title}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {t.phaseTitle} · {t.xp} XP
                    </div>
                  </div>
                  <CommandShortcut>{t.estMinutes}m</CommandShortcut>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {/* v5.931: Lessons — all 797 lessons across 38 tracks */}
        {filteredLessons.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={`Lessons (${filteredLessons.length})`}>
              {filteredLessons.map((l) => {
                const trackName = ALL_LANGUAGE_INFO[l.track]?.name ?? l.track;
                return (
                  <CommandItem key={l.id} onSelect={() => handleLessonNavigate(l.id, l.track)} className="group min-h-[48px] sm:min-h-0">
                    <BookOpen className="mr-2 h-4 w-4 text-violet-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-sm">{l.title}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {trackName} · Stage {l.order}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}

        {/* v5.931: Projects — real 207-project database */}
        {filteredProjects.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={`Projects (${filteredProjects.length})`}>
              {filteredProjects.map((p) => (
                <CommandItem key={p.id} onSelect={() => handleProjectNavigate(p.id)} className="min-h-[48px] sm:min-h-0">
                  <FolderGit2 className="mr-2 h-4 w-4 text-amber-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">{p.title}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {p.languages.join(", ")} · {p.difficulty} · {p.tier}
                    </div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* v5.931: Notes — user's own notes */}
        {filteredNotes.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={`Notes (${filteredNotes.length})`}>
              {filteredNotes.map((n) => (
                <CommandItem key={n.id} onSelect={() => goToView("notes")} className="min-h-[48px] sm:min-h-0">
                  <StickyNote className="mr-2 h-4 w-4 text-teal-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">{n.title || "Untitled"}</div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {(n.body || "").slice(0, 60)}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* v5.931: Help topics */}
        {filteredHelp.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={`Help (${filteredHelp.length})`}>
              {filteredHelp.map((h, i) => (
                <CommandItem key={i} onSelect={handleHelpOpen} className="min-h-[48px] sm:min-h-0">
                  <HelpCircle className="mr-2 h-4 w-4 text-sky-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">{h.q}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{h.a}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Actions — only when search is empty */}
        {!hasQuery && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem onSelect={() => {
                setTheme(resolvedTheme === "dark" ? "light" : "dark");
                handleClose();
              }} className="min-h-[48px] sm:min-h-0">
                {resolvedTheme === "dark" ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                Toggle theme
              </CommandItem>
              <CommandItem onSelect={handleExport} className="min-h-[48px] sm:min-h-0">
                <Download className="mr-2 h-4 w-4" />
                Export backup
              </CommandItem>
              <CommandItem onSelect={handleImport} className="min-h-[48px] sm:min-h-0">
                <Upload className="mr-2 h-4 w-4" />
                Import backup
              </CommandItem>
              <CommandItem onSelect={handleReset} className="text-rose-500 min-h-[48px] sm:min-h-0">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset all progress
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>

      {/* v5.933: themed confirmation modal for Reset (replaces native window.confirm) */}
      <ConfirmDialog
        open={showResetConfirm}
        onOpenChange={setShowResetConfirm}
        title="Reset all progress?"
        description="This will permanently delete ALL your progress — tasks, lessons, notes, badges, certificates, and streaks. This action cannot be undone."
        confirmLabel="Reset everything"
        cancelLabel="Cancel"
        destructive
        onConfirm={confirmReset}
      />
    </CommandDialog>
  );
}

/** Escape a string for safe use inside a RegExp. */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Keyboard shortcut hook
export function useCommandPaletteShortcut() {
  const setCommandOpen = useStore((s) => s.setCommandOpen);
  const setView = useStore((s) => s.setView);
  const setFocusMode = useStore((s) => s.setFocusMode);
  const focusMode = useStore((s) => s.focusMode);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const cmd = e.metaKey || e.ctrlKey;
      if (cmd && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
      else if (cmd && e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setFocusMode(!focusMode);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCommandOpen, setView, setFocusMode, focusMode]);
}
