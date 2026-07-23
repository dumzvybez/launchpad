"use client";

// SkillBadge — v6.005 skill visibility.
// Renders a single skill with a level indicator. Used in the lesson header
// and the module-complete celebration. Forward-looking: reads the v6.0
// LessonSkillRef / Skill types.

import { CheckCircle2, Circle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SkillLevel } from "@/lib/types";

type Props = {
  name: string;
  level?: SkillLevel;
  /** Whether the learner has demonstrated this skill (completed the lesson). */
  earned?: boolean;
  size?: "sm" | "md";
};

const LEVEL_LABEL: Record<SkillLevel, string> = {
  beginner: "Intro",
  intermediate: "Working",
  advanced: "Solid",
};

export function SkillBadge({ name, level, earned = false, size = "sm" }: Props) {
  const isSm = size === "sm";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border font-medium",
        isSm ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs",
        earned
          ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20"
          : "bg-muted/30 text-muted-foreground border-border/40",
      )}
      title={level ? `Level: ${LEVEL_LABEL[level]}` : undefined}
    >
      {earned ? <CheckCircle2 className={cn(isSm ? "h-2.5 w-2.5" : "h-3 w-3")} /> : <Circle className={cn(isSm ? "h-2.5 w-2.5 opacity-40" : "h-3 w-3 opacity-40")} />}
      {name}
      {level && <Star className={cn("opacity-50", isSm ? "h-2 w-2" : "h-2.5 w-2.5")} />}
    </span>
  );
}
