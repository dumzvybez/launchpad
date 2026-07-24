"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  PlayCircle,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/glass/GlassPrimitives";
import { ALL_LANGUAGE_INFO } from "@/lib/lessons-meta";
import { resolveRef } from "@/lib/identity";
import type { Lesson, LessonProgress as LessonProgressEntry } from "@/lib/types";

/**
 * LessonSidebar — v6.008 professional redesign.
 *
 * Design principles:
 *   - Expanded: clean course outline with grouped sections, clear progress,
 *     scannable lesson rows. No visual clutter.
 *   - Collapsed: a deliberate compact rail (48px) with icon + tooltip,
 *     not a broken hidden menu. Click to expand.
 *   - The collapse state persists in localStorage so the user's preference
 *     is remembered across sessions.
 *   - A "focus mode" toggle lets the user hide the sidebar entirely for
 *     distraction-free reading.
 *
 * The collapsed rail shows a vertical progress indicator + current lesson
 * number, so the user still has context without the full list.
 */

type Props = {
  lessons: Lesson[];
  currentLessonId: string;
  lessonProgress: Record<string, LessonProgressEntry>;
  onSelectLesson: (lessonId: string) => void;
};

const DIFFICULTY_DOT: Record<string, string> = {
  beginner: "bg-emerald-400",
  intermediate: "bg-amber-400",
  advanced: "bg-rose-400",
};

const STORAGE_KEY = "launchpad:lesson-sidebar-collapsed";

export function LessonSidebar({
  lessons,
  currentLessonId,
  lessonProgress,
  onSelectLesson,
}: Props) {
  // Collapsed state persists across sessions. Default: expanded.
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "true") setCollapsed(true);
    } catch { /* ignore */ }
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem(STORAGE_KEY, String(next)); } catch { /* ignore */ }
  };

  const trackId = lessons[0]?.track ?? "";
  const trackInfo = ALL_LANGUAGE_INFO[trackId];
  const completedCount = lessons.filter(
    (l) => lessonProgress[resolveRef(l.id)]?.status === "complete",
  ).length;
  const pct = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  const currentIdx = lessons.findIndex((l) => l.id === currentLessonId);

  // ---- Collapsed rail (48px wide) ----
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-3 py-2 px-1 h-full">
        {/* Expand button */}
        <button
          onClick={toggleCollapsed}
          className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/8 transition-colors"
          aria-label="Show course outline"
          title="Show course outline"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>

        {/* Track icon */}
        <div className="text-xl" title={trackInfo?.name ?? trackId}>
          {trackInfo?.icon ?? "📘"}
        </div>

        {/* Vertical progress indicator */}
        <div
          className="flex-1 w-1.5 rounded-full bg-foreground/8 overflow-hidden relative min-h-[80px]"
          title={`${completedCount}/${lessons.length} lessons · ${pct}%`}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-400 to-emerald-400 transition-all duration-500"
            style={{ height: `${pct}%` }}
          />
        </div>

        {/* Current lesson number */}
        <div
          className="text-[10px] font-mono text-muted-foreground tabular-nums"
          title={`Lesson ${currentIdx + 1} of ${lessons.length}`}
        >
          {currentIdx + 1}/{lessons.length}
        </div>
      </div>
    );
  }

  // ---- Expanded panel ----
  return (
    <nav aria-label="Track lessons" className="flex flex-col h-full">
      {/* Header: track info + collapse button */}
      <div className="flex items-center justify-between gap-2 px-1 pb-3 border-b border-border/30 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0">{trackInfo?.icon ?? "📘"}</span>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{trackInfo?.name ?? trackId}</div>
            <div className="text-[10px] text-muted-foreground font-mono tabular-nums">
              {completedCount}/{lessons.length} · {pct}%
            </div>
          </div>
        </div>
        <button
          onClick={toggleCollapsed}
          className="shrink-0 h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/8 transition-colors"
          aria-label="Hide course outline"
          title="Hide outline (focus mode)"
        >
          <PanelLeftClose className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-1 pb-3">
        <ProgressBar value={pct} size="sm" />
      </div>

      {/* Lesson list — clean, scannable, no boxes */}
      <ol className="flex-1 space-y-0 overflow-y-auto scrollbar-thin -mr-1 pr-1">
        {lessons.map((lesson, idx) => {
          const slug = resolveRef(lesson.id);
          const progress = lessonProgress[slug];
          const isComplete = progress?.status === "complete";
          const isInProgress = progress?.status === "in-progress";
          const isCurrent = lesson.id === currentLessonId;

          return (
            <li key={lesson.id}>
              <button
                onClick={() => onSelectLesson(lesson.id)}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "w-full text-left flex items-start gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150 group",
                  isCurrent
                    ? "bg-primary/10 ring-1 ring-primary/25"
                    : "hover:bg-foreground/4",
                )}
              >
                {/* Status indicator */}
                <span className="shrink-0 mt-0.5">
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : isInProgress ? (
                    <PlayCircle className="h-4 w-4 text-primary" />
                  ) : isCurrent ? (
                    <Circle className="h-4 w-4 text-primary fill-primary/20" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors" />
                  )}
                </span>

                {/* Title + meta */}
                <span className="flex-1 min-w-0">
                  <span
                    className={cn(
                      "block text-xs leading-snug line-clamp-2 transition-colors",
                      isCurrent
                        ? "font-semibold text-foreground"
                        : isComplete
                          ? "text-muted-foreground group-hover:text-foreground/80"
                          : "text-foreground/85 group-hover:text-foreground",
                    )}
                  >
                    {lesson.title}
                  </span>
                  <span className="flex items-center gap-2 mt-1">
                    <span
                      className={cn("h-1.5 w-1.5 rounded-full", DIFFICULTY_DOT[lesson.difficulty] ?? "bg-muted-foreground")}
                      title={lesson.difficulty}
                    />
                    <span className="text-[10px] text-muted-foreground font-mono tabular-nums">
                      {lesson.estMinutes}m
                    </span>
                    {isComplete && progress?.bestQuizScore !== undefined && (
                      <span className="text-[10px] text-emerald-500 font-mono font-semibold tabular-nums">
                        {progress.bestQuizScore}%
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] text-primary font-mono font-medium ml-auto flex items-center gap-0.5">
                        Current <ChevronRight className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
