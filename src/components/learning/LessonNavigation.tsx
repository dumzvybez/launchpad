"use client";

// LessonNavigation — v6.005 course sidebar.
// Shows the track's modules + lessons with completion checkmarks and a
// "current lesson" highlight. Scales from 21 to thousands of lessons
// because it's module-grouped, not a flat list.
//
// Additive: this is an OPTIONAL component. LearnView can render it in a
// collapsible sidebar. It reads getTrackLessons(trackId) which returns []
// until the track is loaded — so it's safe to render at any time.

import { useState } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_LANGUAGE_INFO, getTotalLessonCount } from "@/lib/lessons-meta";
import { getTrackLessons } from "@/lib/lessons-data";
import { getModule } from "@/lib/curriculum";
import { resolveRef } from "@/lib/identity";
import { Progress } from "@/components/ui/progress";
import type { Lesson } from "@/lib/types";
import type { LessonProgress as LessonProgressEntry } from "@/lib/types";

type Props = {
  trackId: string;
  currentLessonId: string | null;
  lessonProgress: Record<string, LessonProgressEntry>;
  onSelectLesson: (lessonId: string) => void;
  onClose?: () => void;
};

export function LessonNavigation({ trackId, currentLessonId, lessonProgress, onSelectLesson }: Props) {
  const [collapsedModules, setCollapsedModules] = useState<Set<string>>(new Set());
  const trackInfo = ALL_LANGUAGE_INFO[trackId];
  const lessons = getTrackLessons(trackId);

  if (lessons.length === 0) {
    return (
      <div className="p-4 text-xs text-muted-foreground">Loading {trackInfo?.name ?? trackId}…</div>
    );
  }

  // Group lessons by moduleId (fall back to lesson.group, then "Lessons").
  const groups = new Map<string, { moduleSlug: string; moduleName: string; moduleIcon: string; lessons: Lesson[] }>();
  for (const l of lessons) {
    const moduleSlug = l.moduleId ?? `legacy:${l.group ?? "Lessons"}`;
    const moduleInfo = l.moduleId ? getModule(l.moduleId) : undefined;
    const moduleName = moduleInfo?.title ?? l.group ?? "Lessons";
    const moduleIcon = moduleInfo?.icon ?? "📚";
    if (!groups.has(moduleSlug)) {
      groups.set(moduleSlug, { moduleSlug, moduleName, moduleIcon, lessons: [] });
    }
    groups.get(moduleSlug)!.lessons.push(l);
  }

  const totalCompleted = lessons.filter((l) => lessonProgress[resolveRef(l.id)]?.status === "complete").length;
  const trackPct = lessons.length ? Math.round((totalCompleted / lessons.length) * 100) : 0;

  const toggleModule = (slug: string) => {
    setCollapsedModules((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  return (
    <nav className="flex flex-col h-full" aria-label="Course navigation">
      {/* Track header */}
      <div className="p-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <span className="text-lg">{trackInfo?.icon}</span>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{trackInfo?.name ?? trackId}</div>
            <div className="text-[10px] text-muted-foreground font-mono">
              {totalCompleted}/{lessons.length} · {trackPct}%
            </div>
          </div>
        </div>
        <Progress value={trackPct} className="h-1 mt-2" />
      </div>

      {/* Module list (scrollable) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[70vh]">
        {[...groups.values()].map((g, gi) => {
          const moduleCompleted = g.lessons.filter((l) => lessonProgress[resolveRef(l.id)]?.status === "complete").length;
          const modulePct = g.lessons.length ? Math.round((moduleCompleted / g.lessons.length) * 100) : 0;
          const isCollapsed = collapsedModules.has(g.moduleSlug);
          const containsCurrent = currentLessonId && g.lessons.some((l) => l.id === currentLessonId || resolveRef(l.id) === currentLessonId);

          return (
            <div key={g.moduleSlug} className="rounded-lg">
              <button
                onClick={() => toggleModule(g.moduleSlug)}
                className={cn(
                  "w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-left hover:bg-foreground/5 transition-colors",
                  containsCurrent && "bg-foreground/5",
                )}
                aria-expanded={!isCollapsed}
              >
                {isCollapsed ? <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" /> : <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />}
                <span className="text-xs">{g.moduleIcon}</span>
                <span className="text-[11px] font-medium flex-1 truncate">
                  <span className="text-muted-foreground font-mono mr-1">{gi + 1}.</span>
                  {g.moduleName}
                </span>
                <span className="text-[9px] text-muted-foreground font-mono shrink-0">{moduleCompleted}/{g.lessons.length}</span>
              </button>
              {!isCollapsed && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border/30 pl-2">
                  {g.lessons.map((l, li) => {
                    const isComplete = lessonProgress[resolveRef(l.id)]?.status === "complete";
                    const isCurrent = (currentLessonId === l.id || currentLessonId === resolveRef(l.id));
                    return (
                      <button
                        key={l.id}
                        onClick={() => onSelectLesson(l.id)}
                        className={cn(
                          "w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-left text-[11px] transition-colors",
                          isCurrent ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                        )}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                        ) : l.optional ? (
                          <Circle className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                        ) : (
                          <Circle className="h-3 w-3 text-muted-foreground shrink-0" />
                        )}
                        <span className="truncate flex-1">{l.title}</span>
                        {l.capstoneTier && <Lock className="h-2.5 w-2.5 text-amber-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

// Re-export for convenience (avoids name clash with the LessonProgress type).
export { getTotalLessonCount };
