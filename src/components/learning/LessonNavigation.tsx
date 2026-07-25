"use client";

// LessonNavigation — v6.010 bottom prev/next navigation.
//
// Renders a clear, docs-style "Previous Lesson / Next Lesson" navigation block
// that sits at the end of the lesson article — so the reader always has an
// obvious next step after finishing the content.
//
// Design:
//   - Two-column grid (Previous left, Next right) on sm+.
//   - Single column on mobile (Previous stacked above Next).
//   - Each card shows: small label, lesson title, brief context (difficulty +
//     estMinutes). Strong foreground contrast; no low-contrast teal.
//   - When there's no prev (first lesson) or no next (last lesson), the slot
//     is replaced with a disabled-looking "Start of course" / "End of course"
//     marker so the layout never feels lopsided.

import { ChevronLeft, ChevronRight, Circle, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/lib/types";

type Props = {
  prev: Lesson | null;
  next: Lesson | null;
  onPrev: () => void;
  onNext: () => void;
};

export function LessonNavigation({ prev, next, onPrev, onNext }: Props) {
  return (
    <nav
      aria-label="Lesson navigation"
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 no-print"
    >
      {/* Previous lesson */}
      {prev ? (
        <button
          onClick={onPrev}
          className={cn(
            "group text-left rounded-xl border border-border/50 bg-background/40 hover:bg-foreground/4 hover:border-border/80 p-4 transition-all",
            "flex items-start gap-3",
          )}
          aria-label={`Previous lesson: ${prev.title}`}
        >
          <span className="shrink-0 h-9 w-9 rounded-lg bg-foreground/6 border border-border/40 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:bg-foreground/10 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] uppercase tracking-wide text-muted-foreground font-mono mb-0.5">
              Previous
            </span>
            <span className="block text-sm font-semibold text-foreground truncate group-hover:text-foreground">
              {prev.title}
            </span>
            <span className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
              <span className="capitalize">{prev.difficulty}</span>
              <span aria-hidden>·</span>
              <span className="font-mono tabular-nums">{prev.estMinutes}m</span>
            </span>
          </span>
        </button>
      ) : (
        <div
          aria-hidden
          className="rounded-xl border border-dashed border-border/40 bg-transparent p-4 flex items-center gap-3 opacity-60"
        >
          <span className="shrink-0 h-9 w-9 rounded-lg bg-foreground/4 border border-border/30 flex items-center justify-center text-muted-foreground">
            <Circle className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] uppercase tracking-wide text-muted-foreground font-mono mb-0.5">
              Start of course
            </span>
            <span className="block text-sm text-muted-foreground">
              This is the first lesson.
            </span>
          </span>
        </div>
      )}

      {/* Next lesson */}
      {next ? (
        <button
          onClick={onNext}
          className={cn(
            "group text-right rounded-xl border border-border/50 bg-background/40 hover:bg-foreground/4 hover:border-border/80 p-4 transition-all sm:col-start-2",
            "flex items-start gap-3 flex-row-reverse",
          )}
          aria-label={`Next lesson: ${next.title}`}
        >
          <span className="shrink-0 h-9 w-9 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary group-hover:bg-primary/15 group-hover:scale-105 transition-all">
            <ChevronRight className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] uppercase tracking-wide text-muted-foreground font-mono mb-0.5">
              Next
            </span>
            <span className="block text-sm font-semibold text-foreground truncate group-hover:text-foreground">
              {next.title}
            </span>
            <span className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground justify-end">
              <span className="capitalize">{next.difficulty}</span>
              <span aria-hidden>·</span>
              <span className="font-mono tabular-nums">{next.estMinutes}m</span>
            </span>
          </span>
        </button>
      ) : (
        <div
          aria-hidden
          className="rounded-xl border border-dashed border-border/40 bg-transparent p-4 flex items-center gap-3 flex-row-reverse opacity-60 sm:col-start-2"
        >
          <span className="shrink-0 h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Flag className="h-4 w-4" />
          </span>
          <span className="min-w-0 text-right">
            <span className="block text-[10px] uppercase tracking-wide text-muted-foreground font-mono mb-0.5">
              End of course
            </span>
            <span className="block text-sm text-muted-foreground">
              You reached the last lesson. 🎉
            </span>
          </span>
        </div>
      )}
    </nav>
  );
}
