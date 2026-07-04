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
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import type { ViewId } from "@/lib/types";

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

export function CommandPalette() {
  const open = useStore((s) => s.commandOpen);
  const setOpen = useStore((s) => s.setCommandOpen);
  const setView = useStore((s) => s.setView);
  const toggleTask = useStore((s) => s.toggleTask);
  const state = useStore((s) => s.state);
  const exportBackup = useStore((s) => s.exportBackup);
  const resetAll = useStore((s) => s.resetAll);
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

  // Toggle a task from search results
  const handleTaskToggle = (taskId: string) => {
    toggleTask(taskId);
    const wasComplete = !!state.tasks[taskId]?.completedAt;
    toast.success(wasComplete ? "Marked incomplete" : "Task completed", {
      description: `XP ${wasComplete ? "removed" : "added"}`,
    });
  };

  // Filter tasks by search query (only show first ~15)
  const filteredTasks = React.useMemo(() => {
    if (!search.trim() || !state.roadmap) return [];
    const q = search.toLowerCase();
    const allTasks = state.roadmap.phases.flatMap((p) =>
      p.modules.flatMap((m) =>
        m.tasks.map((t) => ({
          ...t,
          phaseTitle: p.title,
          moduleTitle: m.title,
        })),
      ),
    );
    return allTasks
      .filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.phaseTitle.toLowerCase().includes(q) ||
          t.moduleTitle.toLowerCase().includes(q),
      )
      .slice(0, 12);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, state.roadmap]);

  const filteredProjects = React.useMemo(() => {
    if (!search.trim() || !state.roadmap) return [];
    const q = search.toLowerCase();
    const allProjects = state.roadmap.phases.flatMap((p) =>
      p.modules.flatMap((m) =>
        m.tasks
          .filter((t) => t.tags?.includes("project") || t.tags?.includes("capstone"))
          .map((t) => ({
            id: t.id,
            title: t.title,
            // v5.79 fix: use `languages` to match the Project type from projects-data.ts
            languages: state.roadmap!.languageIds,
          })),
      ),
    );
    return allProjects
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          // v5.79 fix: use p.languages (the projects-data.ts Project type field) instead of p.technologies
          p.languages.some((tech) => tech.toLowerCase().includes(q)),
      )
      .slice(0, 5);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, state.roadmap]);

  const handleExport = () => {
    exportBackup();
    toast.success("Backup exported");
    handleClose();
  };

  const handleReset = () => {
    if (window.confirm("Reset ALL progress? This cannot be undone.")) {
      resetAll();
      toast.success("Workspace reset");
      handleClose();
    }
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

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search tasks, jump to views, run actions…"
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Navigation */}
        {!search.trim() && (
          <CommandGroup heading="Navigate">
            {VIEWS.map((v) => {
              const Icon = VIEW_ICONS[v.id];
              return (
                <CommandItem
                  key={v.id}
                  onSelect={() => goToView(v.id)}
                  className="group"
                >
                  <Icon className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                  <span>{v.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {/* Tasks */}
        {filteredTasks.length > 0 && (
          <CommandGroup heading={`Tasks (${filteredTasks.length})`}>
            {filteredTasks.map((t) => {
              const isDone = !!state.tasks[t.id]?.completedAt;
              return (
                <CommandItem
                  key={t.id}
                  onSelect={() => handleTaskToggle(t.id)}
                  className="group"
                >
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

        {/* Projects */}
        {filteredProjects.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Projects">
              {filteredProjects.map((p) => (
                <CommandItem
                  key={p.id}
                  onSelect={() => goToView("projects")}
                >
                  <FolderGit2 className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">{p.title}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {/* v5.79 fix: use p.languages instead of p.technologies */}
                      {p.languages.length} language{p.languages.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Actions */}
        {!search.trim() && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem onSelect={() => {
                // v5.77 fix: use resolvedTheme (not theme) so toggling from
                // "system" works correctly. Previously, if the user had
                // selected "system", `theme === "system"` and the toggle
                // forced "dark", discarding the system preference.
                setTheme(resolvedTheme === "dark" ? "light" : "dark");
                handleClose();
              }}>
                {resolvedTheme === "dark" ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                Toggle theme
                {/* v5.77 fix: removed misleading ⌘D shortcut hint (was never implemented and conflicted with browser bookmark shortcut) */}
              </CommandItem>
              <CommandItem onSelect={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export backup
              </CommandItem>
              <CommandItem onSelect={handleImport}>
                <Upload className="mr-2 h-4 w-4" />
                Import backup
              </CommandItem>
              <CommandItem onSelect={handleReset} className="text-rose-500">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset all progress
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
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
      // v5.77 fix: removed Cmd+1-9 and Cmd+0 shortcuts — they hijacked the
      // universal browser tab-switching shortcuts (Cmd+1 = first tab, etc.).
      // Users who habitually use Cmd+1 to switch tabs were instead navigated
      // to a different in-app view. Use the command palette (Cmd+K) instead.
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
