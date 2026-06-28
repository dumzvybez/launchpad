"use client";

import { useMemo } from "react";
import { CheckCircle2, Circle, Lock, Clock } from "lucide-react";
import { useStore, selectPhaseProgress } from "@/lib/store";
import { GlassCard } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";

const PHASE_COLOR_HEX: Record<string, string> = {
  teal: "#2DD4BF",
  violet: "#A78BFA",
  amber: "#FCD34D",
  rose: "#FB7185",
  emerald: "#34D399",
  sky: "#38BDF8",
};

export function SkillTreeView() {
  const roadmap = useStore((s) => s.state.roadmap);
  const state = useStore((s) => s.state);
  const selectPhase = useStore((s) => s.selectPhase);
  const setView = useStore((s) => s.setView);

  if (!roadmap) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-sm text-muted-foreground">Complete onboarding to see your skill tree.</p>
      </GlassCard>
    );
  }

  // Compute overall stats
  const allTasks = roadmap.phases.flatMap((p) => p.modules.flatMap((m) => m.tasks));
  const completedTasks = allTasks.filter((t) => state.tasks[t.id]?.completedAt).length;
  const overallPct = allTasks.length ? Math.round((completedTasks / allTasks.length) * 100) : 0;

  const handlePhaseClick = (phaseId: string) => {
    selectPhase(phaseId);
    setView("roadmap");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Skill Tree</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your journey from {roadmap.careerLabel} beginner to job-ready. Click any phase to dive in.
        </p>
      </div>

      <GlassCard className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Overall progress</div>
            <div className="text-2xl font-bold font-mono">{overallPct}%</div>
            <div className="text-[10px] text-muted-foreground">{completedTasks} of {allTasks.length} tasks complete</div>
          </div>
          <div className="flex-1 max-w-xs">
            <div className="h-3 rounded-full bg-foreground/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${overallPct}%`,
                  background: "linear-gradient(90deg, #2DD4BF, #A78BFA, #FCD34D)",
                }}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Vertical connected path with gradient flowing line */}
      <div className="relative">
        {/* The flowing gradient line — absolute positioned behind the nodes */}
        <div
          className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 sm:-translate-x-1/2 rounded-full opacity-60"
          style={{
            background: `linear-gradient(180deg, ${
              roadmap.phases.map((p, i) => {
                const color = PHASE_COLOR_HEX[p.color] ?? "#888";
                const pct = (i / (roadmap.phases.length - 1)) * 100;
                return `${color} ${pct}%`;
              }).join(", ")
            })`,
            boxShadow: "0 0 20px rgba(45,212,191,0.3)",
          }}
          aria-hidden
        />

        <div className="space-y-6 relative">
          {roadmap.phases.map((phase, idx) => {
            const progress = selectPhaseProgress(state, phase.id);
            const color = PHASE_COLOR_HEX[phase.color] ?? "#888";
            const isComplete = progress.pct === 100;
            const isInProgress = progress.pct > 0 && progress.pct < 100;
            const isLocked = idx > 0 && selectPhaseProgress(state, roadmap.phases[idx - 1].id).pct < 50 && idx > 1;
            const isLeft = idx % 2 === 0;

            return (
              <div
                key={phase.id}
                className={cn(
                  "relative flex items-center gap-4",
                  isLeft ? "sm:flex-row" : "sm:flex-row-reverse",
                )}
              >
                {/* Main node (the phase circle) */}
                <div className="shrink-0 z-10 sm:ml-auto sm:mr-auto sm:order-2" style={{ marginLeft: "auto", marginRight: "auto" }}>
                  <button
                    onClick={() => !isLocked && handlePhaseClick(phase.id)}
                    disabled={isLocked}
                    className={cn(
                      "relative h-16 w-16 rounded-full flex items-center justify-center text-2xl transition-all",
                      isLocked ? "opacity-40 cursor-not-allowed" : "hover:scale-110 cursor-pointer",
                    )}
                    style={{
                      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                      boxShadow: `0 0 30px ${color}66, 0 0 0 4px var(--background), 0 0 0 6px ${color}33`,
                    }}
                  >
                    {isLocked ? <Lock className="h-6 w-6 text-foreground/60" /> : phase.icon}
                    {isComplete && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Phase card */}
                <div className={cn(
                  "flex-1 max-w-md",
                  isLeft ? "sm:order-1 sm:text-right" : "sm:order-3",
                )}>
                  <GlassCard
                    className={cn(
                      "p-4 cursor-pointer transition-all",
                      isLocked ? "opacity-50" : "hover:scale-[1.01]",
                    )}
                  >
                    <div className={cn("flex items-center gap-2 mb-1", isLeft && "sm:justify-end")}>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: `${color}22`, color }}>
                        Phase {phase.number}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">{phase.estWeeks}w</span>
                    </div>
                    <h3 className="font-semibold text-sm">{phase.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{phase.subtitle}</p>

                    {/* Module dots — smaller nodes branching off */}
                    <div className={cn("flex flex-wrap gap-1.5 mt-3", isLeft && "sm:justify-end")}>
                      {phase.modules.map((m, mi) => {
                        const mTasks = m.tasks;
                        const mComplete = mTasks.filter((t) => state.tasks[t.id]?.completedAt).length;
                        const mDone = mComplete === mTasks.length && mTasks.length > 0;
                        const mInProgress = mComplete > 0 && mComplete < mTasks.length;
                        return (
                          <div
                            key={m.id}
                            className={cn(
                              "h-2 w-2 rounded-full transition-all",
                              mDone ? "bg-emerald-500" : mInProgress ? "bg-amber-500" : "bg-foreground/15",
                            )}
                            title={`${m.title} (${mComplete}/${mTasks.length})`}
                          />
                        );
                      })}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2 flex items-center gap-2">
                      {!isLeft && <div className="flex-1" />}
                      <div className={cn("flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground")}>
                        <Clock className="h-3 w-3" />
                        <span>{progress.completed}/{progress.total} · {progress.pct}%</span>
                      </div>
                      {isLeft && <div className="flex-1" />}
                      <div className="w-20 h-1 rounded-full bg-foreground/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${progress.pct}%`, background: color }}
                        />
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <GlassCard className="p-3">
        <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-foreground/15" /> Not started</div>
          <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-500" /> In progress</div>
          <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Complete</div>
          <div className="flex items-center gap-1"><Lock className="h-2.5 w-2.5" /> Locked</div>
        </div>
      </GlassCard>
    </div>
  );
}
