"use client";

// LessonHeader — v6.010 reading-first lesson header (Apple/Stripe docs style).
//
// Renders a focused, top-of-article header for a lesson:
//   - Top row: back-to-tracks link, course-outline toggle button (PanelLeft),
//     "Lesson X of N" indicator, bookmark + print actions.
//   - Title: large h1, single source of truth (no duplicate title elsewhere).
//   - Description: muted, leading-relaxed lead paragraph.
//   - Meta row: difficulty pill, read time, XP, completion status — all with
//     sufficient contrast (foreground / emerald / amber / rose, no faint teal).
//   - Skills gained row (optional): uses foreground + emerald accents instead
//     of low-contrast teal.

import {
  ChevronLeft,
  PanelLeft,
  PanelLeftClose,
  Bookmark,
  Printer,
  Clock,
  Zap,
  Star,
  CheckCircle2,
  Circle,
  PlayCircle,
  Check,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_LANGUAGE_INFO } from "@/lib/lessons-meta";
import { getModule } from "@/lib/curriculum";
import type { Lesson, LessonSkillRef } from "@/lib/types";

function skillDisplayName(ref: LessonSkillRef): string {
  return ref.skillId.split(".").pop() ?? ref.skillId;
}

type Props = {
  lesson: Lesson;
  /** Whether the learner has completed this lesson. */
  completed: boolean;
  inProgress: boolean;
  /** XP awarded for this lesson. */
  xpReward?: number;
  /** Index of the lesson in the track (0-based). */
  index: number;
  /** Total lessons in the track. */
  total: number;
  /** Whether the course outline panel is currently open. */
  outlineOpen: boolean;
  /** Toggle the course outline panel. */
  onToggleOutline: () => void;
  /** Back to all tracks. */
  onBackToTracks: () => void;
  /** Whether the lesson is bookmarked. */
  bookmarked: boolean;
  /** Toggle the bookmark. */
  onToggleBookmark: () => void;
  /** Print the lesson. */
  onPrint: () => void;
  /** Calculated read time in minutes (for the title tooltip). */
  calculatedReadMinutes?: number;
};

export function LessonHeader({
  lesson,
  completed,
  inProgress,
  xpReward,
  index,
  total,
  outlineOpen,
  onToggleOutline,
  onBackToTracks,
  bookmarked,
  onToggleBookmark,
  onPrint,
  calculatedReadMinutes,
}: Props) {
  const trackInfo = ALL_LANGUAGE_INFO[lesson.track];
  const moduleInfo = lesson.moduleId ? getModule(lesson.moduleId) : undefined;
  const skills = lesson.skillsTaught?.map(skillDisplayName).filter(Boolean) ?? [];
  const minutes = lesson.readingTimeMinutes ?? lesson.estMinutes;
  const xp = xpReward ?? lesson.xpReward ?? 10;

  return (
    <header className="no-print">
      {/* Top utility row: back · outline toggle · lesson index · bookmark + print */}
      <div className="flex items-center justify-between gap-2 flex-wrap mb-6">
        <button
          onClick={onBackToTracks}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> All tracks
        </button>

        <div className="flex items-center gap-2 ml-auto">
          {/* Course outline toggle — primary affordance to reopen the outline */}
          <button
            onClick={onToggleOutline}
            className={cn(
              "flex items-center gap-1.5 px-2.5 h-9 rounded-lg text-xs font-medium border transition-colors",
              outlineOpen
                ? "bg-foreground/8 border-border/60 text-foreground"
                : "glass-flat border-border/40 text-foreground/85 hover:bg-foreground/6 hover:text-foreground",
            )}
            aria-label={outlineOpen ? "Hide course outline" : "Open course outline"}
            aria-expanded={outlineOpen}
            title={outlineOpen ? "Hide course outline" : "Open course outline"}
          >
            {outlineOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Outline</span>
          </button>

          <button
            onClick={onToggleBookmark}
            className="h-9 w-9 rounded-lg border border-border/40 glass-flat hover:bg-foreground/6 transition-colors flex items-center justify-center"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark lesson"}
            aria-pressed={bookmarked}
            title={bookmarked ? "Bookmarked — click to remove" : "Bookmark this lesson"}
          >
            <Bookmark
              className={cn(
                "h-4 w-4",
                bookmarked ? "fill-primary text-primary" : "text-muted-foreground",
              )}
            />
          </button>

          <button
            onClick={onPrint}
            className="h-9 w-9 rounded-lg border border-border/40 glass-flat hover:bg-foreground/6 transition-colors flex items-center justify-center"
            aria-label="Print lesson"
            title="Print lesson — opens print dialog (choose 'Save as PDF' for a digital copy)"
          >
            <Printer className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Breadcrumb: Track → Module → Lesson index */}
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-3 flex-wrap">
        <span className="font-medium" style={{ color: trackInfo?.color }}>
          {trackInfo?.icon} {trackInfo?.name ?? lesson.track}
        </span>
        {moduleInfo && (
          <>
            <span className="opacity-50">›</span>
            <span className="text-foreground/80">
              {moduleInfo.icon} {moduleInfo.title}
            </span>
          </>
        )}
        <span className="opacity-50">›</span>
        <span className="font-mono uppercase tracking-wide">
          Lesson {index + 1} of {total}
        </span>
      </div>

      {/* Title — single source of truth */}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2.5 leading-tight">
        {lesson.title}
      </h1>

      {/* Lead paragraph */}
      {lesson.description && (
        <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed mb-4">
          {lesson.description}
        </p>
      )}

      {/* Meta row: difficulty · time · XP · completion */}
      <div className="flex items-center gap-2.5 flex-wrap text-xs mb-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium capitalize border",
            lesson.difficulty === "beginner" &&
              "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
            lesson.difficulty === "intermediate" &&
              "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
            lesson.difficulty === "advanced" &&
              "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
          )}
        >
          <Star className="h-3 w-3" /> {lesson.difficulty}
          {lesson.difficultyScore && (
            <span className="opacity-70">· {lesson.difficultyScore}/5</span>
          )}
        </span>

        <span
          className="inline-flex items-center gap-1 text-muted-foreground font-mono tabular-nums"
          title={`Official estimate: ${lesson.estMinutes}m${
            calculatedReadMinutes ? ` · Calculated read time: ${calculatedReadMinutes}m` : ""
          }`}
        >
          <Clock className="h-3 w-3" /> {minutes}m
        </span>

        <span className="inline-flex items-center gap-1 text-muted-foreground font-mono">
          <Zap className="h-3 w-3" /> +{xp} XP
        </span>

        {lesson.assessmentLevel && lesson.assessmentLevel !== "lesson-quiz" && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-foreground/8 text-foreground/80 text-[10px] font-medium border border-border/40">
            <Trophy className="h-3 w-3" /> {lesson.assessmentLevel.replace("-", " ")}
          </span>
        )}

        {/* Completion status — pushed to the right on wide screens */}
        <span className="ml-auto flex items-center gap-1.5">
          {completed && (
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Completed
            </span>
          )}
          {inProgress && !completed && (
            <span className="inline-flex items-center gap-1 text-foreground/80 font-medium">
              <PlayCircle className="h-3.5 w-3.5" /> In progress
            </span>
          )}
          {!completed && !inProgress && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Circle className="h-3.5 w-3.5" /> Not started
            </span>
          )}
        </span>
      </div>

      {/* Skills gained (optional) — emerald accent instead of teal for contrast */}
      {skills.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">
            Skills gained:
          </span>
          {skills.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium"
            >
              <CheckCircle2 className="h-2.5 w-2.5" /> {s}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

// Silence unused-import warning for Check (kept for future use).
void Check;
