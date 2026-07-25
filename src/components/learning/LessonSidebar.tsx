"use client";

import {
  CheckCircle2,
  Circle,
  PlayCircle,
  ChevronRight,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/glass/GlassPrimitives";
import { ALL_LANGUAGE_INFO } from "@/lib/lessons-meta";
import { resolveRef } from "@/lib/identity";
import { getModule } from "@/lib/curriculum";
import type { Lesson, LessonProgress as LessonProgressEntry } from "@/lib/types";

/**
 * LessonSidebar — v6.010 reading-first course outline.
 *
 * Design principles (Apple/Stripe docs):
 *   - Controlled component: parent (LearnView) decides whether the outline is
 *     visible. This sidebar just renders the outline content cleanly.
 *   - Module-grouped, scannable lesson rows with clear completion state.
 *   - The current lesson is highlighted with a subtle accent and a small
 *     "Current" badge — using foreground/muted colors with strong contrast
 *     (no low-contrast teal text).
 *   - The track header shows aggregate progress + a clean progress bar.
 *
 * This component is rendered in three places:
 *   - Desktop inline slide-in panel (controlled by LearnView).
 *   - Mobile bottom-sheet drawer (controlled by LearnView).
 *   - Standalone — anywhere a course outline is useful.
 */

type Props = {
  lessons: Lesson[];
  currentLessonId: string;
  lessonProgress: Record<string, LessonProgressEntry>;
  onSelectLesson: (lessonId: string) => void;
  /** Optional close handler — shown as a small X in the header (for mobile drawer). */
  onClose?: () => void;
};

const DIFFICULTY_DOT: Record<string, string> = {
  beginner: "bg-emerald-500",
  intermediate: "bg-amber-500",
  advanced: "bg-rose-500",
};

export function LessonSidebar({
  lessons,
  currentLessonId,
  lessonProgress,
  onSelectLesson,
  onClose,
}: Props) {
  const trackId = lessons[0]?.track ?? "";
  const trackInfo = ALL_LANGUAGE_INFO[trackId];
  const completedCount = lessons.filter(
    (l) => lessonProgress[resolveRef(l.id)]?.status === "complete",
  ).length;
  const pct = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  const currentIdx = lessons.findIndex((l) => l.id === currentLessonId);

  // Group lessons by module for a documentation-style outline.
  const groups = new Map<
    string,
    { moduleSlug: string; moduleName: string; moduleIcon: string; lessons: Lesson[] }
  >();
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

  return (
    <nav aria-label="Course outline" className="flex flex-col h-full min-h-0">
      {/* Track header */}
      <div className="px-1 pb-3 border-b border-border/30 mb-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg shrink-0">{trackInfo?.icon ?? "📘"}</span>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{trackInfo?.name ?? trackId}</div>
              <div className="text-[10px] text-muted-foreground font-mono tabular-nums">
                {completedCount}/{lessons.length} lessons · {pct}%
              </div>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden shrink-0 h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/8 transition-colors"
              aria-label="Close outline"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
        {/* Progress bar */}
        <div className="mt-2.5">
          <ProgressBar value={pct} size="sm" />
        </div>
      </div>

      {/* Lesson list — module-grouped, scannable, no boxes */}
      <ol className="flex-1 min-h-0 space-y-4 overflow-y-auto scrollbar-thin -mr-1 pr-1">
        {[...groups.values()].map((g, gi) => {
          const moduleCompleted = g.lessons.filter(
            (l) => lessonProgress[resolveRef(l.id)]?.status === "complete",
          ).length;
          const containsCurrent = g.lessons.some((l) => l.id === currentLessonId);
          return (
            <li key={g.moduleSlug}>
              {/* Module header — documentation-style */}
              <div className="flex items-center gap-1.5 px-1 mb-1.5">
                <span className="text-xs">{g.moduleIcon}</span>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground/70">
                  <span className="text-muted-foreground/80 font-mono mr-1">{gi + 1}.</span>
                  {g.moduleName}
                </span>
                <span className="ml-auto text-[10px] text-muted-foreground font-mono tabular-nums">
                  {moduleCompleted}/{g.lessons.length}
                </span>
              </div>

              {/* Lesson rows */}
              <ul className="space-y-0.5 border-l border-border/30 ml-2 pl-1">
                {g.lessons.map((lesson) => {
                  const slug = resolveRef(lesson.id);
                  const progress = lessonProgress[slug];
                  const isComplete = progress?.status === "complete";
                  const isInProgress = progress?.status === "in-progress";
                  const isCurrent = lesson.id === currentLessonId;
                  const lessonIdx = lessons.findIndex((l) => l.id === lesson.id);

                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() => onSelectLesson(lesson.id)}
                        aria-current={isCurrent ? "page" : undefined}
                        className={cn(
                          "w-full text-left flex items-start gap-2.5 pl-2.5 -ml-px pr-2 py-1.5 rounded-r-md border-l-2 transition-all duration-150 group",
                          isCurrent
                            ? "border-primary bg-primary/8 "
                            : "border-transparent hover:bg-foreground/4 hover:border-border/60",
                          containsCurrent && !isCurrent && "opacity-90",
                        )}
                      >
                        {/* Status indicator */}
                        <span className="shrink-0 mt-0.5">
                          {isComplete ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          ) : isInProgress ? (
                            <PlayCircle className="h-4 w-4 text-foreground/70" />
                          ) : isCurrent ? (
                            <Circle className="h-4 w-4 text-foreground fill-foreground/15" />
                          ) : lesson.optional ? (
                            <Circle className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground/80 transition-colors" />
                          )}
                        </span>

                        {/* Title + meta */}
                        <span className="flex-1 min-w-0">
                          <span className="flex items-center gap-1.5">
                            <span className="text-[10px] text-muted-foreground/70 font-mono tabular-nums shrink-0">
                              {String(lessonIdx + 1).padStart(2, "0")}
                            </span>
                            <span
                              className={cn(
                                "block text-[13px] leading-snug line-clamp-2 transition-colors",
                                isCurrent
                                  ? "font-semibold text-foreground"
                                  : isComplete
                                    ? "text-muted-foreground group-hover:text-foreground/80"
                                    : "text-foreground/85 group-hover:text-foreground",
                              )}
                            >
                              {lesson.title}
                            </span>
                          </span>
                          <span className="flex items-center gap-2 mt-0.5 ml-5">
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                DIFFICULTY_DOT[lesson.difficulty] ?? "bg-muted-foreground",
                              )}
                              title={lesson.difficulty}
                            />
                            <span className="text-[10px] text-muted-foreground font-mono tabular-nums">
                              {lesson.estMinutes}m
                            </span>
                            {isComplete && progress?.bestQuizScore !== undefined && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold tabular-nums">
                                {progress.bestQuizScore}%
                              </span>
                            )}
                            {lesson.capstoneTier && (
                              <Lock className="h-2.5 w-2.5 text-amber-600 dark:text-amber-500" />
                            )}
                            {isCurrent && (
                              <span className="text-[10px] text-foreground font-medium ml-auto flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-foreground/8 border border-border/40">
                                Current
                                <ChevronRight className="h-2.5 w-2.5" />
                              </span>
                            )}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
