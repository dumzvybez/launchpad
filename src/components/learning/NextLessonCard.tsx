"use client";

// NextLessonCard — v6.010 guided "what's next" recommendation.
//
// Renders a clear, emerald-accented CTA card that recommends the next lesson
// after the learner finishes reading. Falls back to the next lesson in track
// order if `recommendedNextLessons` is empty. Includes module-transition
// feedback ("Module 3 complete → Module 4 starts") when applicable.
//
// Contrast fixes (v6.010):
//   - All teal text replaced with foreground / emerald accents for sufficient
//     contrast on glass backgrounds.
//   - The "Module complete" + "Next lesson" labels use emerald + foreground
//     instead of low-contrast teal.

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
    moduleComplete =
      moduleLessons.length > 0 &&
      moduleLessons.every((l) => lessonProgress[resolveRef(l.id)]?.status === "complete");
  }

  if (!nextLesson && !moduleComplete) return null;

  return (
    <GlassCard className="p-5 border-emerald-500/25 bg-emerald-500/[0.04]">
      {moduleComplete && currentModule && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/30">
          <div className="h-10 w-10 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground">Module complete!</div>
            <div className="text-[11px] text-muted-foreground">
              {currentModule.icon} {currentModule.title} —{" "}
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                {currentModule.skillsUnlocked.length} skill
                {currentModule.skillsUnlocked.length !== 1 ? "s" : ""} unlocked
              </span>
            </div>
          </div>
        </div>
      )}
      {nextLesson && (
        <button
          onClick={() => onSelectLesson(nextLesson.id)}
          className="w-full flex items-center gap-3 text-left hover:bg-foreground/5 -m-2 p-2 rounded-lg transition-colors group"
        >
          <div className="h-10 w-10 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">
              {moduleTransition && nextModule
                ? `Next module: ${nextModule.icon} ${nextModule.title}`
                : "Recommended next"}
            </div>
            <div className="text-sm font-semibold text-foreground truncate group-hover:text-foreground">
              {nextLesson.title}
            </div>
            {nextLesson.lessonSummary && (
              <div className="text-[11px] text-muted-foreground truncate">
                {nextLesson.lessonSummary}
              </div>
            )}
          </div>
          <ArrowRight className="h-4 w-4 text-foreground/70 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>
      )}
    </GlassCard>
  );
}
