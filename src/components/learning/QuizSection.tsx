"use client";

// QuizSection — v6.005 assessment integration shell.
// Wraps the existing quiz runner with assessment-level context (shows which
// assessment level this lesson uses, the pass mark, retake policy). The
// actual quiz logic stays in LearnView; this is the framing UI.
//
// Additive: if lesson.assessmentLevel is absent (legacy content), it renders
// a minimal "Lesson Quiz" framing that matches the existing behavior.

import { Trophy, RotateCcw, Clock } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassPrimitives";
import { getAssessmentLevel } from "@/lib/curriculum";
import type { Lesson } from "@/lib/types";

type Props = {
  lesson: Lesson;
  bestScore?: number;
  attempts?: number;
  onStartQuiz: () => void;
};

export function QuizSection({ lesson, bestScore, onStartQuiz }: Props) {
  const levelId = lesson.assessmentLevel ?? "lesson-quiz";
  const level = getAssessmentLevel(levelId);
  const passed = bestScore !== undefined && bestScore >= (level?.passMark ?? 70);

  return (
    <GlassCard className="p-4 border-primary/20 bg-primary/[0.03]">
      <div className="flex items-center gap-2 mb-2">
        <Trophy className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">{level?.title ?? "Lesson Quiz"}</h3>
        {passed && (
          <span className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Passed · {bestScore}%
          </span>
        )}
      </div>
      <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">
        {level?.description ?? "Test your understanding of this lesson."}
      </p>
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3 flex-wrap">
        <span>Pass mark: {level?.passMark ?? 70}%</span>
        {level?.timed && <span className="inline-flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" /> Timed</span>}
        <span className="inline-flex items-center gap-0.5">
          <RotateCcw className="h-2.5 w-2.5" /> {level?.unlimitedRetakes ? "Unlimited retakes" : "Limited retakes"}
        </span>
        {bestScore !== undefined && <span>Best: {bestScore}%</span>}
      </div>
      <button
        onClick={onStartQuiz}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <Trophy className="h-4 w-4" />
        {passed ? "Retake quiz" : bestScore !== undefined ? "Retry quiz" : "Start quiz"}
      </button>
    </GlassCard>
  );
}
