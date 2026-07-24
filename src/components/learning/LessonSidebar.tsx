"use client";

/**
 * LessonSidebar — v6.007 UX improvement.
 *
 * A sticky sidebar shown alongside the lesson content on desktop/tablet.
 * Shows the current track's lesson list with:
 *   - Lesson numbering and titles
 *   - Completion status (checkmark for complete, ring for in-progress)
 *   - Current-lesson highlight ("you are here")
 *   - Difficulty color dot
 *   - Estimated time per lesson
 *   - Track-level progress bar at the top
 *
 * This directly addresses the audit finding: "A learner should immediately
 * understand: Where am I? What should I learn next? How much progress have
 * I made?" — which the previous single-column lesson view could not answer
 * without navigating back to the track list.
 *
 * Responsive behavior:
 *   - lg+ (≥1024px): sticky sidebar visible alongside content (320px width)
 *   - <lg: hidden (the existing breadcrumb + prev/next buttons serve navigation)
 */

import { CheckCircle2, Circle, Clock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/glass/GlassPrimitives";
import { ALL_LANGUAGE_INFO } from "@/lib/lessons-meta";
import { resolveRef } from "@/lib/identity";
import type { Lesson, LessonProgress as LessonProgressEntry } from "@/lib/types";

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

export function LessonSidebar({
  lessons,
  currentLessonId,
  lessonProgress,
  onSelectLesson,
}: Props) {
  const trackId = lessons[0]?.track ?? "";
  const trackInfo = ALL_LANGUAGE_INFO[trackId];
  const completedCount = lessons.filter(
    (l) => lessonProgress[resolveRef(l.id)]?.status === "complete",
  ).length;
  const pct = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <nav aria-label="Track lessons" className="space-y-3">
      {/* Track header with progress */}
      <div className="px-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{trackInfo?.icon ?? "📘"}</span>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{trackInfo?.name ?? trackId}</div>
            <div className="text-[10px] text-muted-foreground font-mono">
              {completedCount}/{lessons.length} complete · {pct}%
            </div>
          </div>
        </div>
        <ProgressBar value={pct} size="sm" />
      </div>

      {/* Lesson list */}
      <ol className="space-y-0.5">
        {lessons.map((lesson, idx) => {
          const slug = resolveRef(lesson.id);
          const progress = lessonProgress[slug];
          const isComplete = progress?.status === "complete";
          const isInProgress = progress?.status === "in-progress";
          const isCurrent = lesson.id === currentLessonId;
          const hasQuiz = lesson.quiz.length > 0;

          return (
            <li key={lesson.id}>
              <button
                onClick={() => onSelectLesson(lesson.id)}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "w-full text-left flex items-start gap-2.5 px-2.5 py-2 rounded-lg transition-colors group",
                  isCurrent
                    ? "bg-primary/12 border border-primary/30"
                    : "border border-transparent hover:bg-foreground/5",
                )}
              >
                {/* Status icon / number */}
                <span className="shrink-0 mt-0.5">
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : isInProgress ? (
                    <PlayCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <Circle
                      className={cn(
                        "h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground",
                        isCurrent && "text-primary",
                      )}
                    />
                  )}
                </span>

                {/* Title + meta */}
                <span className="flex-1 min-w-0">
                  <span
                    className={cn(
                      "block text-xs leading-snug line-clamp-2",
                      isCurrent ? "font-semibold text-foreground" : isComplete ? "text-muted-foreground" : "text-foreground/85",
                    )}
                  >
                    <span className="text-muted-foreground/60 font-mono mr-1">{idx + 1}.</span>
                    {lesson.title}
                  </span>
                  <span className="flex items-center gap-1.5 mt-0.5">
                    {/* Difficulty dot */}
                    <span
                      className={cn("h-1.5 w-1.5 rounded-full", DIFFICULTY_DOT[lesson.difficulty] ?? "bg-muted-foreground")}
                      title={`Difficulty: ${lesson.difficulty}`}
                    />
                    {/* Estimated time */}
                    <span className="text-[9px] text-muted-foreground font-mono flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" /> {lesson.estMinutes}m
                    </span>
                    {/* Quiz indicator */}
                    {hasQuiz && (
                      <span className="text-[9px] text-muted-foreground/70 font-mono">
                        · {lesson.quiz.length}Q
                      </span>
                    )}
                    {/* Best quiz score if complete */}
                    {isComplete && progress?.bestQuizScore !== undefined && (
                      <span className="text-[9px] text-emerald-500 font-mono font-semibold">
                        · {progress.bestQuizScore}%
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
