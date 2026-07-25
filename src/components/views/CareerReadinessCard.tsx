"use client";

/**
 * CareerReadinessCard — the SINGLE source of truth for the Career Readiness
 * Score display (v5.927, item #1).
 *
 * Used by BOTH the Dashboard and the Career tab so they always show identical
 * values + breakdown. Previously the Dashboard had its own duplicate copy
 * (which fell out of sync — it still referenced the removed `challengeScore`
 * dimension after v5.926).
 *
 * The `variant` prop controls minor presentation differences:
 *   - "full": the Career-tab version (glow, 90%+ banner, SuggestedNextSteps)
 *   - "compact": the Dashboard version (no glow, no banner, "View Career →" link)
 */

import { Target } from "lucide-react";
import { useStore, selectCareerReadinessScore } from "@/lib/store";
import { GlassCard, ProgressBar } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";

export function CareerReadinessCard({
  variant = "full",
}: {
  variant?: "full" | "compact";
}) {
  const state = useStore((s) => s.state);
  const setView = useStore((s) => s.setView);
  const readiness = selectCareerReadinessScore(state);
  const careerLabel = state.roadmap?.careerLabel ?? "Software Engineering";

  const readinessColor =
    readiness.overall >= 90 ? "from-amber-400 to-yellow-500" :
    readiness.overall >= 71 ? "from-teal-400 to-emerald-500" :
    readiness.overall >= 41 ? "from-amber-500 to-orange-500" :
    readiness.overall > 0 ? "from-rose-400 to-rose-500" :
    ""; // empty/zero state: no gradient — uses neutral foreground color
  // v6.010: For 0% (null/empty) state, use a muted neutral color so we don't
  // draw the user's eye to a bright pink "0%" — that signals alarm where there
  // is none (it's just the start of the journey).
  const isEmpty = readiness.overall === 0;
  const readinessGlow = variant === "full" && readiness.overall >= 90 ? "shadow-lg shadow-amber-500/30" : "";

  return (
    <GlassCard className={cn("p-4 sm:p-5 border border-border/40", readinessGlow)}>
      <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="text-sm font-semibold flex items-center gap-2 min-w-0">
          <Target className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {variant === "compact" ? `Career Readiness · ${careerLabel}` : "Career Readiness Score"}
          </span>
        </h2>
        {variant === "compact" ? (
          <button
            onClick={() => setView("career")}
            className="text-xs text-primary hover:underline shrink-0"
          >
            View Career →
          </button>
        ) : (
          <span className="text-[10px] text-muted-foreground font-mono text-right">
            weighted: roadmap {Math.round(readiness.weights.roadmap * 100)}% · knowledge {Math.round(readiness.weights.quiz * 100)}% · projects {Math.round(readiness.weights.projects * 100)}%{readiness.weights.interviews > 0 ? ` · interviews ${Math.round(readiness.weights.interviews * 100)}%` : ""}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4 sm:gap-5 mb-5">
        <div className={cn(
          "text-4xl sm:text-5xl font-bold font-mono tabular-nums leading-none",
          isEmpty
            ? "text-muted-foreground"
            : "bg-gradient-to-br bg-clip-text text-transparent",
          !isEmpty && readinessColor,
        )}>
          {readiness.overall}%
        </div>
        <div className="flex-1 min-w-0">
          <ProgressBar value={readiness.overall} className="h-3" />
          <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-2 leading-relaxed">
            {readiness.overall >= 100
              ? "🏆 100% Career Readiness — claim your Career Master Certificate!"
              : readiness.overall >= 90
                ? "🎉 You're interview-ready! Consider applying to your first role."
                : readiness.overall >= 71
                  ? "Almost job-ready — push to the end"
                  : readiness.overall >= 41
                    ? "Making progress — focus on the lowest dimension below"
                    : isEmpty
                      ? "Just getting started — complete a task to see your score grow."
                      : "Just getting started — keep going!"}
          </p>
        </div>
      </div>
      {/* 4 dimensions (Challenges removed in v5.926; Interview transparent). */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
        <ReadinessDimension
          label="Roadmap"
          emoji="🗺️"
          value={readiness.roadmapProgress}
        />
        <ReadinessDimension
          label="Knowledge"
          emoji="📚"
          value={readiness.quizAverage}
        />
        <ReadinessDimension
          label="Projects"
          emoji="🔨"
          value={readiness.projectsCompleted}
        />
        <div>
          <div className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">
            <span aria-hidden="true">🎤</span> Interviews
          </div>
          {/* v5.930 (#8): Interview is ALWAYS counted — shows 0% when no sessions
              instead of "—", making it clear it's a required 4th component. */}
          {readiness.interviewScore === null ? (
            <>
              <div className="font-mono font-semibold text-muted-foreground">0%</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">No sessions yet</div>
              <ProgressBar value={0} className="h-1 mt-1" />
            </>
          ) : readiness.interviewQuestions < readiness.minInterviewQuestions ? (
            <>
              <div className="font-mono font-semibold">{readiness.interviewScore}%</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">
                {readiness.interviewQuestions}/{readiness.minInterviewQuestions} Q · {readiness.interviewSessions} session{readiness.interviewSessions === 1 ? "" : "s"}
              </div>
              <ProgressBar value={readiness.interviewScore ?? 0} className="h-1 mt-1" />
            </>
          ) : (
            <>
              <div className="font-mono font-semibold">{readiness.interviewScore}%</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">
                {readiness.interviewSessions} session{readiness.interviewSessions === 1 ? "" : "s"} · {readiness.interviewQuestions} Q answered
              </div>
              <ProgressBar value={readiness.interviewScore ?? 0} className="h-1 mt-1" />
            </>
          )}
        </div>
      </div>

      {/* 90%+ banner (full variant only) */}
      {variant === "full" && readiness.overall >= 90 && readiness.overall < 100 && (
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300">
          🎉 You&apos;re interview-ready! Consider applying to your first role.
        </div>
      )}
      {variant === "full" && readiness.overall >= 100 && (
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/15 border border-amber-500/40 text-xs text-amber-700 dark:text-amber-300 font-medium">
          🏆 100% Career Readiness! Your Career Master Certificate is unlocked below.
        </div>
      )}
    </GlassCard>
  );
}

// v6.010: Small shared sub-component for the 3 standard dimensions
// (Roadmap / Knowledge / Projects). Uses muted foreground for the 0% case
// so empty dimensions don't draw the eye with bright color.
function ReadinessDimension({
  label,
  emoji,
  value,
}: {
  label: string;
  emoji: string;
  value: number;
}) {
  const isEmpty = value === 0;
  return (
    <div>
      <div className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">
        <span aria-hidden="true">{emoji}</span> {label}
      </div>
      <div className={cn(
        "font-mono font-semibold tabular-nums",
        isEmpty && "text-muted-foreground",
      )}>
        {value}%
      </div>
      <ProgressBar value={value} className="h-1 mt-1" />
    </div>
  );
}
