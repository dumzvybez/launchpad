"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock, Clock, ChevronDown, ArrowRight, BookOpen } from "lucide-react";
import { useStore, selectPhaseProgress } from "@/lib/store";
import { GlassCard, ProgressBar } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import { getLessonById } from "@/lib/lessons-data";

// v5.929 (#4): Skill Tree complete redesign.
//
// Research sources (web search, 2025):
// - "How to Avoid MAJOR Pitfalls of Skill Tree Design" (UI expert Kayla Shults):
//   key insight: skill trees should pace upgrades and avoid overwhelming users.
//   Show one level of detail at a time; don't dump all nodes simultaneously.
// - "A User Research Skill Tree" (Medium): progression systems start with common
//   base skills and expand into specialized skills. Linear foundation → branching
//   specialization is the natural mental model.
// - Skill tree design best practices (Lushdesigns, Dribbble):
//   - Visual hierarchy: larger nodes for phases, smaller for modules/tasks
//   - Clear locked/unlocked states with visual differentiation
//   - Progress indicators at every level (phase, module, task)
//   - Connections between nodes show prerequisites/dependencies
//
// Design decisions based on research:
// 1. HORIZONTAL PROGRESS RAIL instead of vertical zigzag — cleaner on mobile,
//    reads left-to-right (natural reading direction), and scales to any number
//    of phases without the alternating-side layout getting cramped.
// 2. COLLAPSIBLE PHASE CARDS — one level of detail at a time (Shults' advice).
//    Click a phase to expand its modules and tasks inline.
// 3. PROGRESS BARS at every level — phase, module, task — so the user always
//    knows where they are.
// 4. LOCKED PHASES are visually distinct (dimmed + lock icon) but still visible
//    so the user can see what's coming.
// 5. NO ZOOM CONTROLS — the old zoom feature added complexity without clarity.
//    The new design is responsive without needing zoom.

const PHASE_COLOR_HEX: Record<string, string> = {
  teal: "#2DD4BF",
  violet: "#A78BFA",
  amber: "#FCD34D",
  rose: "#FB7185",
  emerald: "#34D399",
  sky: "#38BDF8",
};

const PHASE_COLOR_MAP: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
  teal: { bg: "bg-teal-500/10", border: "border-teal-500/40", text: "text-teal-500", gradient: "from-teal-500 to-cyan-500" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/40", text: "text-violet-500", gradient: "from-violet-500 to-purple-500" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/40", text: "text-amber-500", gradient: "from-amber-500 to-orange-500" },
  rose: { bg: "bg-rose-500/10", border: "border-rose-500/40", text: "text-rose-500", gradient: "from-rose-500 to-pink-500" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/40", text: "text-emerald-500", gradient: "from-emerald-500 to-green-500" },
  sky: { bg: "bg-sky-500/10", border: "border-sky-500/40", text: "text-sky-500", gradient: "from-sky-500 to-blue-500" },
};

export function SkillTreeView() {
  const roadmap = useStore((s) => s.state.roadmap);
  const state = useStore((s) => s.state);
  const selectPhase = useStore((s) => s.selectPhase);
  const selectModule = useStore((s) => s.selectModule);
  const selectTask = useStore((s) => s.selectTask);
  const setView = useStore((s) => s.setView);
  const setLearnTabState = useStore((s) => s.setLearnTabState);
  const isPhaseUnlocked = useStore((s) => s.isPhaseUnlocked);

  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

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
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  const handleNavigateToRoadmap = (phaseId: string, moduleId?: string, taskId?: string) => {
    selectPhase(phaseId);
    if (moduleId) selectModule(moduleId);
    if (taskId) selectTask(taskId);
    setView("roadmap");
  };

  const handleGoToLesson = (lessonId: string, trackId: string) => {
    setLearnTabState({ tab: "lesson", selectedLessonId: lessonId, selectedTrack: trackId });
    setView("learn");
    window.scrollTo(0, 0);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Skill Tree</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your journey from {roadmap.careerLabel} beginner to job-ready. Click any phase to expand its modules and tasks.
        </p>
      </div>

      {/* Overall progress */}
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

      {/* Horizontal progress rail — phases as connected nodes */}
      <GlassCard className="p-4 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-fit">
          {roadmap.phases.map((phase, idx) => {
            const progress = selectPhaseProgress(state, phase.id);
            const color = PHASE_COLOR_HEX[phase.color] ?? "#888";
            const isComplete = progress.pct === 100;
            const isInProgress = progress.pct > 0 && progress.pct < 100;
            const isUnlocked = isPhaseUnlocked(phase.number);
            const isLocked = !isUnlocked && phase.number > 1;
            const isExpanded = expandedPhase === phase.id;

            return (
              <div key={phase.id} className="flex items-center shrink-0">
                {/* Phase node */}
                <button
                  onClick={() => handlePhaseClick(phase.id, isLocked)}
                  disabled={isLocked}
                  className={cn(
                    "relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[80px]",
                    !isLocked && "hover:bg-foreground/5 cursor-pointer",
                    isLocked && "opacity-50 cursor-not-allowed",
                    isExpanded && "bg-foreground/5",
                  )}
                >
                  <div
                    className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center text-xl transition-all",
                      isLocked ? "bg-foreground/10" : "hover:scale-110",
                      isInProgress && !isLocked && "animate-pulse",
                    )}
                    style={{
                      background: isLocked ? undefined : `linear-gradient(135deg, ${color}, ${color}cc)`,
                      boxShadow: !isLocked ? `0 0 20px ${color}55` : undefined,
                    }}
                  >
                    {isLocked ? <Lock className="h-5 w-5 text-foreground/40" /> : phase.icon}
                    {isComplete && (
                      <div className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-center w-full truncate" style={{ color: isLocked ? undefined : color }}>
                    {phase.number}
                  </div>
                  <div className="text-[9px] text-muted-foreground text-center w-full truncate max-w-[70px]">
                    {progress.pct}%
                  </div>
                </button>

                {/* Connector line */}
                {idx < roadmap.phases.length - 1 && (
                  <div className="flex items-center">
                    <div
                      className={cn("h-0.5 w-6 rounded-full transition-colors", isComplete ? "bg-emerald-500" : "bg-foreground/10")}
                    />
                    <ArrowRight className="h-3 w-3 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Expanded phase detail */}
      {expandedPhase && (() => {
        const phase = roadmap.phases.find((p) => p.id === expandedPhase);
        if (!phase) return null;
        const colors = PHASE_COLOR_MAP[phase.color] ?? PHASE_COLOR_MAP.teal;
        const color = PHASE_COLOR_HEX[phase.color] ?? "#888";
        const progress = selectPhaseProgress(state, phase.id);
        const isUnlocked = isPhaseUnlocked(phase.number);
        const isLocked = !isUnlocked && phase.number > 1;

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard className={cn("p-5 border-2", colors.border)}>
              {/* Phase header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={cn("h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl shrink-0", colors.gradient)}>
                  {phase.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full", colors.bg, colors.text)}>
                      Phase {phase.number}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">{phase.estWeeks}w</span>
                    {isLocked && <span className="text-[10px] text-amber-500 flex items-center gap-1"><Lock className="h-2.5 w-2.5" /> Locked</span>}
                  </div>
                  <h2 className="text-xl font-bold">{phase.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{phase.subtitle}</p>
                  {/* Progress bar */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-foreground/10 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${progress.pct}%`, background: color }} />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0">{progress.completed}/{progress.total} · {progress.pct}%</span>
                  </div>
                </div>
              </div>

              {/* Objectives */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {phase.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <div className={cn("h-1.5 w-1.5 rounded-full mt-1.5 shrink-0", `bg-${phase.color}-500`)} style={{ background: color }} />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>

              {/* Lesson groups (if this is a language phase) */}
              {phase.lessonGroups && phase.lessonGroups.length > 0 && (
                <div className="space-y-2 mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Lesson Modules</h3>
                  {phase.lessonGroups.map((group, gi) => {
                    const completedInGroup = group.lessonIds.filter((id) => state.lessonProgress[id]?.status === "complete").length;
                    const groupPct = group.lessonIds.length > 0 ? Math.round((completedInGroup / group.lessonIds.length) * 100) : 0;
                    return (
                      <div key={gi} className={cn("rounded-xl border p-3", colors.border, colors.bg)}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{group.title}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{completedInGroup}/{group.lessonIds.length} · {groupPct}%</span>
                        </div>
                        <div className="h-1 rounded-full bg-foreground/10 overflow-hidden mb-2">
                          <div className="h-full rounded-full transition-all" style={{ width: `${groupPct}%`, background: color }} />
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {group.lessonIds.map((lessonId, li) => {
                            const lesson = getLessonById(lessonId);
                            const isComplete = state.lessonProgress[lessonId]?.status === "complete";
                            return (
                              <button
                                key={lessonId}
                                onClick={() => lesson && handleGoToLesson(lessonId, lesson.track)}
                                className={cn(
                                  "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md transition-colors",
                                  isComplete ? "bg-emerald-500/15 text-emerald-500" : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10",
                                )}
                                title={lesson?.title ?? `Lesson ${group.lessonNumbers[li]}`}
                              >
                                {isComplete ? <CheckCircle2 className="h-2.5 w-2.5" /> : <Circle className="h-2.5 w-2.5" />}
                                <span className="truncate max-w-[100px]">{lesson?.title ?? `L${group.lessonNumbers[li]}`}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* v5.931: DUPLICATE-MODULES FIX (third attempt — root cause confirmed).
                  A language phase carries BOTH `lessonGroups` (real lesson content,
                  rendered above as "Lesson Modules") AND `modules` (generic engine
                  stubs like "X fundamentals" / "Build with X"). Rendering both
                  produces duplicate module content. The RoadmapView was guarded in
                  v5.930 (#1) but SkillTreeView — redesigned in v5.929 — was missed,
                  so the duplicate persisted here. Guard: only render the generic
                  `modules` block when the phase does NOT have real `lessonGroups`.
                  No phase in this codebase legitimately needs both shown — language
                  phases use lessonGroups exclusively; foundation/AI-bonus/capstone/
                  multi-language phases use modules exclusively. */}
              {(!phase.lessonGroups || phase.lessonGroups.length === 0) && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Modules & Tasks</h3>
                {phase.modules.map((m, mi) => {
                  const tasks = m.tasks;
                  const completed = tasks.filter((t) => state.tasks[t.id]?.completedAt).length;
                  const pct = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
                  return (
                    <div key={m.id} className="rounded-lg bg-card/40 border border-border/40 p-3">
                      <button
                        onClick={() => handleNavigateToRoadmap(phase.id, m.id)}
                        className="w-full flex items-center justify-between gap-2 text-left mb-2"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{m.title}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{m.description}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] font-mono text-muted-foreground">{completed}/{tasks.length}</div>
                          <div className={cn("text-[10px] font-mono", colors.text)}>{pct}%</div>
                        </div>
                      </button>
                      {/* Task list */}
                      <div className="space-y-1">
                        {tasks.map((t, ti) => {
                          const tDone = !!state.tasks[t.id]?.completedAt;
                          return (
                            <button
                              key={t.id}
                              onClick={() => handleNavigateToRoadmap(phase.id, m.id, t.id)}
                              className="w-full flex items-center gap-2 text-left text-[11px] py-1 px-1.5 rounded hover:bg-foreground/5 transition-colors"
                            >
                              {tDone ? (
                                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                              ) : (
                                <Circle className="h-3 w-3 text-muted-foreground shrink-0" />
                              )}
                              <span className={cn("truncate flex-1", tDone && "text-muted-foreground line-through")}>{t.title}</span>
                              <span className="text-[9px] font-mono text-muted-foreground shrink-0">{t.estMinutes}m</span>
                              {t.lessonId && <BookOpen className="h-2.5 w-2.5 text-violet-500 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              )}

              {/* Navigate to roadmap button */}
              <button
                onClick={() => handleNavigateToRoadmap(phase.id)}
                className={cn("mt-4 w-full flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg transition-colors", colors.bg, colors.text, "hover:bg-foreground/10")}
              >
                Open in Roadmap <ArrowRight className="h-3 w-3" />
              </button>
            </GlassCard>
          </motion.div>
        );
      })()}

      {/* Legend */}
      <GlassCard className="p-3">
        <div className="text-[10px] uppercase text-muted-foreground mb-2">Legend</div>
        <div className="flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1"><Circle className="h-3 w-3" /> Not started</div>
          <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" /> In progress</div>
          <div className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Complete</div>
          <div className="flex items-center gap-1"><Lock className="h-2.5 w-2.5" /> Locked</div>
          <div className="flex items-center gap-1"><BookOpen className="h-2.5 w-2.5 text-violet-500" /> Has lesson link</div>
        </div>
      </GlassCard>
    </div>
  );
}
