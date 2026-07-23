"use client";

// LessonHeader — v6.005 lesson experience architecture.
// Displays track → module → lesson context, difficulty, time, skills, XP,
// and completion status. Additive: if module/skills data is absent (legacy
// content), the header gracefully degrades to the legacy fields.

import { Clock, Star, Trophy, CheckCircle2, Circle, Zap } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import { ALL_LANGUAGE_INFO } from "@/lib/lessons-meta";
import { getModule } from "@/lib/curriculum";
import type { Lesson, LessonSkillRef } from "@/lib/types";

// Resolve a skill ref to a display name. Forward-looking: once the skill graph
// is populated, this looks up Skill.name. For now it falls back to skillId.
function skillDisplayName(ref: LessonSkillRef): string {
  return ref.skillId.split(".").pop() ?? ref.skillId;
}

type Props = {
  lesson: Lesson;
  /** Whether the learner has completed this lesson. */
  completed: boolean;
  /** XP awarded for this lesson (computed by the store; falls back to lesson.xpReward). */
  xpReward?: number;
};

export function LessonHeader({ lesson, completed, xpReward }: Props) {
  const trackInfo = ALL_LANGUAGE_INFO[lesson.track];
  const moduleInfo = lesson.moduleId ? getModule(lesson.moduleId) : undefined;
  const skills = lesson.skillsTaught?.map(skillDisplayName).filter(Boolean) ?? [];
  const minutes = lesson.readingTimeMinutes ?? lesson.estMinutes;
  const xp = xpReward ?? lesson.xpReward ?? 10;

  return (
    <GlassCard className="p-5">
      {/* Breadcrumb: Track → Module */}
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-2 flex-wrap">
        <span className="font-medium" style={{ color: trackInfo?.color }}>
          {trackInfo?.icon} {trackInfo?.name ?? lesson.track}
        </span>
        {moduleInfo && (
          <>
            <span className="opacity-50">›</span>
            <span>{moduleInfo.icon} {moduleInfo.title}</span>
          </>
        )}
      </div>

      {/* Title + completion status */}
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-bold tracking-tight flex-1 min-w-0">{lesson.title}</h1>
        <div className={cn(
          "shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
          completed
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            : "bg-muted/40 text-muted-foreground border-border/40",
        )}>
          {completed ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
          {completed ? "Completed" : "In progress"}
        </div>
      </div>

      {lesson.lessonSummary && (
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{lesson.lessonSummary}</p>
      )}

      {/* Meta row: difficulty · time · XP */}
      <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground flex-wrap">
        <span className="inline-flex items-center gap-1 capitalize">
          <Star className="h-3 w-3" /> {lesson.difficulty}
          {lesson.difficultyScore && <span className="opacity-60">· {lesson.difficultyScore}/5</span>}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> {minutes}m
        </span>
        <span className="inline-flex items-center gap-1">
          <Zap className="h-3 w-3" /> +{xp} XP
        </span>
        {lesson.assessmentLevel && lesson.assessmentLevel !== "lesson-quiz" && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">
            <Trophy className="h-3 w-3" /> {lesson.assessmentLevel.replace("-", " ")}
          </span>
        )}
      </div>

      {/* Skills gained */}
      {skills.length > 0 && (
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">Skills:</span>
          {skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <CheckCircle2 className="h-2.5 w-2.5" /> {s}
            </span>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
