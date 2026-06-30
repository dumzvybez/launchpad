"use client";

import { useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock, Clock, ZoomIn, ZoomOut, Crosshair, ChevronRight } from "lucide-react";
import { useStore, selectPhaseProgress } from "@/lib/store";
import { GlassCard, GlassButton } from "@/components/glass/GlassPrimitives";
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
  const selectModule = useStore((s) => s.selectModule);
  const selectTask = useStore((s) => s.selectTask);
  const setView = useStore((s) => s.setView);
  const isPhaseUnlocked = useStore((s) => s.isPhaseUnlocked);

  const [zoom, setZoom] = useState(1);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const phaseRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Auto-expand the current phase (first phase < 100% complete) when the
  // roadmap loads. Uses the "adjust state during render" pattern recommended
  // by the React docs — no setState-in-useEffect.
  const [autoExpandChecked, setAutoExpandChecked] = useState(false);
  if (!autoExpandChecked && roadmap && !expandedPhase) {
    setAutoExpandChecked(true);
    const current = roadmap.phases.find((p) => selectPhaseProgress(state, p.id).pct < 100);
    if (current) setExpandedPhase(current.id);
  }

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

  const handlePhaseClick = (phaseId: string, locked: boolean) => {
    if (locked) return;
    selectPhase(phaseId);
    setView("roadmap");
  };

  const handleModuleClick = (phaseId: string, moduleId: string, locked: boolean) => {
    if (locked) return;
    selectPhase(phaseId);
    selectModule(moduleId);
    setView("roadmap");
  };

  const handleTaskClick = (phaseId: string, moduleId: string, taskId: string, locked: boolean) => {
    if (locked) return;
    selectPhase(phaseId);
    selectModule(moduleId);
    selectTask(taskId);
    setView("roadmap");
  };

  const scrollToCurrent = () => {
    const current = roadmap.phases.find((p) => {
      const pct = selectPhaseProgress(state, p.id).pct;
      return pct > 0 && pct < 100;
    });
    if (current && phaseRefs.current[current.id]) {
      phaseRefs.current[current.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skill Tree</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your journey from {roadmap.careerLabel} beginner to job-ready. Click any node to dive in.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <GlassButton size="sm" variant="ghost" onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))} title="Zoom out">
            <ZoomOut className="h-3.5 w-3.5" />
          </GlassButton>
          <span className="text-[10px] font-mono text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
          <GlassButton size="sm" variant="ghost" onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))} title="Zoom in">
            <ZoomIn className="h-3.5 w-3.5" />
          </GlassButton>
          <GlassButton size="sm" variant="ghost" onClick={scrollToCurrent} title="Scroll to current position">
            <Crosshair className="h-3.5 w-3.5" /> Current
          </GlassButton>
        </div>
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
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #2DD4BF, #A78BFA, #FCD34D)" }}
                initial={{ width: 0 }}
                animate={{ width: `${overallPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Vertical connected path with gradient flowing line + zoom wrapper */}
      <div ref={containerRef} className="relative overflow-x-auto" style={{ transform: `scale(${zoom})`, transformOrigin: "top center", transition: "transform 0.2s" }}>
        {/* The flowing gradient line — absolute positioned behind the nodes */}
        <div
          className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full opacity-60"
          style={{
            background: `linear-gradient(180deg, ${
              roadmap.phases.map((p, i) => {
                const color = PHASE_COLOR_HEX[p.color] ?? "#888";
                const pct = (i / Math.max(1, roadmap.phases.length - 1)) * 100;
                return `${color} ${pct}%`;
              }).join(", ")
            })`,
            boxShadow: "0 0 20px rgba(45,212,191,0.3)",
          }}
          aria-hidden
        />

        <div className="space-y-4 relative">
          {roadmap.phases.map((phase, idx) => {
            const progress = selectPhaseProgress(state, phase.id);
            const color = PHASE_COLOR_HEX[phase.color] ?? "#888";
            const isComplete = progress.pct === 100;
            const isInProgress = progress.pct > 0 && progress.pct < 100;
            const isUnlocked = isPhaseUnlocked(phase.number);
            const isLocked = !isUnlocked && phase.number > 1;
            const isExpanded = expandedPhase === phase.id;
            const isLeft = idx % 2 === 0;

            return (
              <motion.div
                key={phase.id}
                ref={(el) => { phaseRefs.current[phase.id] = el; }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className={cn(
                  "relative flex items-start gap-4",
                  isLeft ? "sm:flex-row" : "sm:flex-row-reverse",
                )}
              >
                {/* Main node (the phase circle) */}
                <div className="shrink-0 z-10 sm:ml-auto sm:mr-auto sm:order-2">
                  <button
                    onClick={() => isLocked ? null : (isExpanded ? setExpandedPhase(null) : setExpandedPhase(phase.id))}
                    disabled={isLocked}
                    className={cn(
                      "relative h-16 w-16 rounded-full flex items-center justify-center text-2xl transition-all",
                      isLocked ? "opacity-40 cursor-not-allowed" : "hover:scale-110 cursor-pointer",
                      isInProgress && !isLocked && "animate-pulse",
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

                {/* Phase card + expandable module/task nodes */}
                <div className={cn(
                  "flex-1 max-w-md",
                  isLeft ? "sm:order-1 sm:text-right" : "sm:order-3",
                )}>
                  <GlassCard
                    className={cn(
                      "p-4 transition-all cursor-pointer",
                      isLocked ? "opacity-50" : "hover:scale-[1.01]",
                    )}
                    onClick={() => handlePhaseClick(phase.id, isLocked)}
                  >
                    <div className={cn("flex items-center gap-2 mb-1", isLeft && "sm:justify-end")}>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: `${color}22`, color }}>
                        Phase {phase.number}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">{phase.estWeeks}w</span>
                      {!isLocked && (
                        <ChevronRight className={cn("h-3 w-3 text-muted-foreground transition-transform", isExpanded && "rotate-90")} />
                      )}
                    </div>
                    <h3 className="font-semibold text-sm">{phase.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{phase.subtitle}</p>

                    {/* Module dots — smaller nodes branching off */}
                    <div className={cn("flex flex-wrap gap-1.5 mt-3", isLeft && "sm:justify-end")}>
                      {phase.modules.map((m) => {
                        const mTasks = m.tasks;
                        const mComplete = mTasks.filter((t) => state.tasks[t.id]?.completedAt).length;
                        const mDone = mComplete === mTasks.length && mTasks.length > 0;
                        const mInProgress = mComplete > 0 && mComplete < mTasks.length;
                        return (
                          <button
                            key={m.id}
                            onClick={(e) => { e.stopPropagation(); handleModuleClick(phase.id, m.id, isLocked); }}
                            className={cn(
                              "h-3 w-3 rounded-full transition-all hover:scale-150",
                              isLocked ? "bg-foreground/10 cursor-not-allowed" :
                                mDone ? "bg-emerald-500" : mInProgress ? "bg-amber-500 animate-pulse" : "bg-foreground/15",
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
                        <div className="h-full rounded-full transition-all" style={{ width: `${progress.pct}%`, background: color }} />
                      </div>
                    </div>
                  </GlassCard>

                  {/* Expanded module + task nodes (Section 10 — task nodes branch off module nodes) */}
                  {isExpanded && !isLocked && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.2 }}
                      className={cn("mt-2 space-y-2 pl-3 border-l-2", isLeft ? "sm:border-r-2 sm:border-l-0 sm:pr-3 sm:pl-0" : "")}
                      style={{ borderColor: `${color}66` }}
                    >
                      {phase.modules.map((m) => {
                        const mTasks = m.tasks;
                        const mComplete = mTasks.filter((t) => state.tasks[t.id]?.completedAt).length;
                        const mPct = mTasks.length ? Math.round((mComplete / mTasks.length) * 100) : 0;
                        return (
                          <div key={m.id} className="rounded-lg bg-card/40 border border-border/40 p-2">
                            <button
                              onClick={() => handleModuleClick(phase.id, m.id, isLocked)}
                              className="w-full flex items-center justify-between gap-2 text-left"
                            >
                              <span className="text-xs font-medium">{m.title}</span>
                              <span className="text-[10px] font-mono text-muted-foreground">{mComplete}/{mTasks.length} · {mPct}%</span>
                            </button>
                            {/* Task nodes — smallest elements */}
                            <div className="mt-2 space-y-1">
                              {mTasks.map((t) => {
                                const tDone = !!state.tasks[t.id]?.completedAt;
                                return (
                                  <button
                                    key={t.id}
                                    onClick={() => handleTaskClick(phase.id, m.id, t.id, isLocked)}
                                    className="w-full flex items-center gap-2 text-left text-[11px] py-0.5 px-1 rounded hover:bg-foreground/5 transition-colors"
                                  >
                                    {tDone ? (
                                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                                    ) : (
                                      <Circle className="h-3 w-3 text-muted-foreground shrink-0" />
                                    )}
                                    <span className={cn("truncate", tDone && "text-muted-foreground line-through")}>{t.title}</span>
                                    <span className="ml-auto text-[9px] font-mono text-muted-foreground shrink-0">{t.estMinutes}m</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend + mini-map */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <GlassCard className="p-3">
          <div className="text-[10px] uppercase text-muted-foreground mb-2">Legend</div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-foreground/15" /> Not started</div>
            <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" /> In progress</div>
            <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Complete</div>
            <div className="flex items-center gap-1"><Lock className="h-2.5 w-2.5" /> Locked</div>
          </div>
        </GlassCard>
        {/* Mini-map */}
        <GlassCard className="p-3">
          <div className="text-[10px] uppercase text-muted-foreground mb-2">Mini-map · click to jump</div>
          <div className="flex flex-wrap gap-1">
            {roadmap.phases.map((p) => {
              const pct = selectPhaseProgress(state, p.id).pct;
              const color = PHASE_COLOR_HEX[p.color] ?? "#888";
              const isUnlocked = isPhaseUnlocked(p.number);
              return (
                <button
                  key={p.id}
                  onClick={() => phaseRefs.current[p.id]?.scrollIntoView({ behavior: "smooth", block: "center" })}
                  className={cn(
                    "h-6 w-6 rounded-md transition-all hover:scale-110",
                    !isUnlocked && p.number > 1 && "opacity-40",
                  )}
                  style={{
                    background: pct === 100 ? "#34D399" : pct > 0 ? `${color}` : `${color}33`,
                    border: `1px solid ${color}`,
                  }}
                  title={`Phase ${p.number}: ${p.title} (${pct}%)`}
                />
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
