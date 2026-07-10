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
    "from-rose-400 to-rose-500";
  const readinessGlow = variant === "full" && readiness.overall >= 90 ? "shadow-lg shadow-amber-500/30" : "";

  return (
    <GlassCard className={cn("p-5", readinessGlow)}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Target className="h-4 w-4" /> {variant === "compact" ? `Career Readiness · ${careerLabel}` : "Career Readiness Score"}
        </h2>
        {variant === "compact" ? (
          <button
            onClick={() => setView("career")}
            className="text-xs text-primary hover:underline"
          >
            View Career →
          </button>
        ) : (
          <span className="text-[10px] text-muted-foreground font-mono">
            weighted: roadmap {Math.round(readiness.weights.roadmap * 100)}% · knowledge {Math.round(readiness.weights.quiz * 100)}% · projects {Math.round(readiness.weights.projects * 100)}%{readiness.weights.interviews > 0 ? ` · interviews ${Math.round(readiness.weights.interviews * 100)}%` : ""}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className={cn("text-4xl font-bold font-mono bg-gradient-to-br bg-clip-text text-transparent", readinessColor)}>
          {readiness.overall}%
        </div>
        <div className="flex-1">
          <ProgressBar value={readiness.overall} className="h-3" />
          <p className="text-[10px] text-muted-foreground mt-1">
            {readiness.overall >= 100
              ? "🏆 100% Career Readiness — claim your Career Master Certificate!"
              : readiness.overall >= 90
                ? "🎉 You're interview-ready! Consider applying to your first role."
                : readiness.overall >= 71
                  ? "Almost job-ready — push to the end"
                  : readiness.overall >= 41
                    ? "Making progress — focus on the lowest dimension below"
                    : "Just getting started — keep going!"}
          </p>
        </div>
      </div>
      {/* 4 dimensions (Challenges removed in v5.926; Interview transparent). */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <div className="text-[10px] uppercase text-muted-foreground">Roadmap</div>
          <div className="font-mono font-semibold">{readiness.roadmapProgress}%</div>
          <ProgressBar value={readiness.roadmapProgress} className="h-1 mt-1" />
        </div>
        <div>
          <div className="text-[10px] uppercase text-muted-foreground">Knowledge 📚</div>
          <div className="font-mono font-semibold">{readiness.quizAverage}%</div>
          <ProgressBar value={readiness.quizAverage} className="h-1 mt-1" />
        </div>
        <div>
          <div className="text-[10px] uppercase text-muted-foreground">Projects 🔨</div>
          <div className="font-mono font-semibold">{readiness.projectsCompleted}%</div>
          <ProgressBar value={readiness.projectsCompleted} className="h-1 mt-1" />
        </div>
        <div>
          <div className="text-[10px] uppercase text-muted-foreground">Interviews 🎤</div>
          {readiness.interviewScore === null ? (
            <>
              <div className="font-mono font-semibold text-muted-foreground">—</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">No sessions yet</div>
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
