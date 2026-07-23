"use client";

// NextLessonCard — v6.005 guided "what's next" recommendation.
// Shows the recommended next lesson (from lesson.recommendedNextLessons, or
// falls back to the next lesson by order). Includes module transition
// feedback ("Module 3 complete → Module 4 starts") when applicable.

import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassPrimitives";
import { getModule } from "@/lib/curriculum";
import { getLessonByRef, resolveRef } from "@/lib/identity";
import { getTrackLessons } from "@/lib/lessons-data";
import type { Lesson } from "@/lib/types";
import type { LessonProgress as LessonProgressEntry } from "@/lib/types";

type Props = {
  currentLesson: Lesson;
  lessonProgress: Record<string, LessonProgressEntry>;
  onSelectLesson: (lessonId: string) => void;
};

export function NextLessonCard({ currentLesson, lessonProgress, onSelectLesson }: Props) {
  // Determine the next lesson.
  // 1. If recommendedNextLessons is populated, use the first that isn't complete.
  // 2. Else, find the next lesson by order in the same track.
  const trackLessons = getTrackLessons(currentLesson.track);
  const currentIdx = trackLessons.findIndex((l) => l.id === currentLesson.id);
  let nextLesson: Lesson | undefined;

  if (currentLesson.recommendedNextLessons && currentLesson.recommendedNextLessons.length > 0) {
    for (const ref of currentLesson.recommendedNextLessons) {
      const candidate = getLessonByRef(ref);
      if (candidate && lessonProgress[resolveRef(candidate.id)]?.status !== "complete") {
        nextLesson = candidate;
        break;
      }
    }
  }
  if (!nextLesson && currentIdx >= 0 && currentIdx < trackLessons.length - 1) {
    nextLesson = trackLessons[currentIdx + 1];
  }

  // Detect module transition.
  const currentModule = currentLesson.moduleId ? getModule(currentLesson.moduleId) : undefined;
  const nextModule = nextLesson?.moduleId ? getModule(nextLesson.moduleId) : undefined;
  const moduleTransition = currentModule && nextModule && currentModule.slug !== nextModule.slug;

  // Is the current module now complete?
  let moduleComplete = false;
  if (currentModule) {
    const moduleLessons = trackLessons.filter((l) => l.moduleId === currentModule.slug);
    moduleComplete = moduleLessons.length > 0 && moduleLessons.every((l) => lessonProgress[resolveRef(l.id)]?.status === "complete");
  }

  if (!nextLesson && !moduleComplete) return null;

  return (
    <GlassCard className="p-4 border-emerald-500/20 bg-emerald-500/[0.03]">
      {moduleComplete && currentModule && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/30">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-semibold">Module complete!</div>
            <div className="text-[11px] text-muted-foreground">
              {currentModule.icon} {currentModule.title} — {currentModule.skillsUnlocked.length} skill{currentModule.skillsUnlocked.length !== 1 ? "s" : ""} unlocked
            </div>
          </div>
        </div>
      )}
      {nextLesson && (
        <button
          onClick={() => onSelectLesson(nextLesson.id)}
          className="w-full flex items-center gap-3 text-left hover:bg-foreground/5 -m-2 p-2 rounded-lg transition-colors"
        >
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">
              {moduleTransition && nextModule ? `Next: ${nextModule.icon} ${nextModule.title}` : "Next lesson"}
            </div>
            <div className="text-sm font-medium truncate">{nextLesson.title}</div>
            {nextLesson.lessonSummary && (
              <div className="text-[11px] text-muted-foreground truncate">{nextLesson.lessonSummary}</div>
            )}
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>
      )}
    </GlassCard>
  );
}
