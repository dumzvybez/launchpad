"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
  Lock,
  Clock,
  Trophy,
  Code2,
  Target,
  Home,
  BookOpen,
  Youtube,
} from "lucide-react";
import { useStore, selectPhaseProgress } from "@/lib/store";
import { GlassCard, ProgressBar, GlassButton } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import type { GeneratedPhase } from "@/lib/types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";

const PHASE_COLOR_MAP: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
  teal: { bg: "bg-teal-500/10", border: "border-teal-500/40", text: "text-teal-500", gradient: "from-teal-500 to-cyan-500" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/40", text: "text-violet-500", gradient: "from-violet-500 to-purple-500" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/40", text: "text-amber-500", gradient: "from-amber-500 to-orange-500" },
  rose: { bg: "bg-rose-500/10", border: "border-rose-500/40", text: "text-rose-500", gradient: "from-rose-500 to-pink-500" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/40", text: "text-emerald-500", gradient: "from-emerald-500 to-green-500" },
  sky: { bg: "bg-sky-500/10", border: "border-sky-500/40", text: "text-sky-500", gradient: "from-sky-500 to-blue-500" },
};

export function RoadmapView() {
  const roadmap = useStore((s) => s.state.roadmap);
  const selectedPhaseId = useStore((s) => s.selectedPhaseId);
  const selectedModuleId = useStore((s) => s.selectedModuleId);
  const selectedTaskId = useStore((s) => s.selectedTaskId);
  const selectPhase = useStore((s) => s.selectPhase);
  const selectModule = useStore((s) => s.selectModule);
  const selectTask = useStore((s) => s.selectTask);
  const setView = useStore((s) => s.setView);
  const setPlaygroundCode = useStore((s) => s.setPlaygroundCode);

  const selectedPhase = useMemo(
    () => roadmap?.phases.find((p) => p.id === selectedPhaseId),
    [roadmap, selectedPhaseId],
  );
  const selectedModule = useMemo(
    () => selectedPhase?.modules.find((m) => m.id === selectedModuleId),
    [selectedPhase, selectedModuleId],
  );
  const selectedTask = useMemo(() => {
    if (!selectedModule) return null;
    return selectedModule.tasks.find((t) => t.id === selectedTaskId) ?? null;
  }, [selectedModule, selectedTaskId]);

  if (!roadmap) {
    return (
      <GlassCard className="p-8 text-center">
        <Target className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <h2 className="text-lg font-semibold mb-1">No roadmap yet</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Complete onboarding to generate your personalized learning roadmap.
        </p>
        <GlassButton onClick={() => setView("dashboard")}>
          <Home className="h-3.5 w-3.5" /> Go to Dashboard
        </GlassButton>
      </GlassCard>
    );
  }

  // Breadcrumb
  const breadcrumbs = [
    { label: "Roadmap", onClick: () => { selectPhase(null); selectModule(null); selectTask(null); } },
  ];
  if (selectedPhase) {
    breadcrumbs.push({
      label: `Phase ${selectedPhase.number}`,
      onClick: () => { selectModule(null); selectTask(null); },
    });
  }
  if (selectedPhase && selectedModule) {
    breadcrumbs.push({
      label: selectedModule.title,
      onClick: () => selectTask(null),
    });
  }
  if (selectedPhase && selectedModule && selectedTask) {
    breadcrumbs.push({ label: selectedTask.title, onClick: () => {} });
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Roadmap</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {roadmap.careerLabel}{roadmap.subPath ? ` (${roadmap.subPath})` : ""} · {roadmap.totalWeeks} weeks · {roadmap.totalHours}h
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      {breadcrumbs.length > 1 && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono flex-wrap">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              <button
                onClick={b.onClick}
                className={cn(
                  "hover:text-foreground transition-colors px-1 py-0.5 rounded",
                  i === breadcrumbs.length - 1 && "text-foreground font-medium",
                )}
              >
                {b.label}
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Phase grid (root view) */}
      {!selectedPhase && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {roadmap.phases.map((phase) => {
            const progress = selectPhaseProgress(useStore.getState().state, phase.id);
            const colors = PHASE_COLOR_MAP[phase.color] ?? PHASE_COLOR_MAP.teal;
            const totalTasks = phase.modules.flatMap((m) => m.tasks).length;
            const isUnlocked = useStore.getState().isPhaseUnlocked(phase.number);
            const isLocked = !isUnlocked && phase.number > 1;
            return (
              <button
                key={phase.id}
                onClick={() => selectPhase(phase.id)}
                className={cn(
                  "relative text-left rounded-2xl border-2 p-5 transition-all hover:shadow-xl group",
                  colors.bg,
                  colors.border,
                  isLocked && "opacity-60",
                  // Gradient border on hover
                  "hover:border-transparent hover:bg-gradient-to-br hover:from-teal-500/10 hover:via-fuchsia-500/10 hover:to-amber-500/10",
                )}
              >
                {isLocked && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                    <Lock className="h-3 w-3" /> Locked
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl", colors.gradient)}>
                    {phase.icon}
                  </div>
                  {!isLocked && (
                    <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full", colors.bg, colors.text)}>
                      Phase {phase.number}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-base mb-1">{phase.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{phase.subtitle}</p>
                {isLocked ? (
                  <p className="text-[10px] text-muted-foreground italic">
                    Complete Phase {phase.number - 1} to unlock
                  </p>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                        <span>{progress.completed}/{totalTasks} tasks</span>
                        <span>{progress.pct}%</span>
                      </div>
                      <ProgressBar value={progress.pct} className="h-1.5" />
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                        <Clock className="h-3 w-3" /> {phase.estWeeks}w
                      </div>
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Phase detail (modules as connected arrows) */}
      {selectedPhase && !selectedModule && (
        <PhaseDetailView phase={selectedPhase} onBack={() => selectPhase(null)} onModuleClick={(id) => selectModule(id)} />
      )}

      {/* Module detail (task list) */}
      {selectedPhase && selectedModule && !selectedTask && (
        <ModuleDetailView
          phase={selectedPhase}
          module={selectedModule}
          onBack={() => selectModule(null)}
          onTaskClick={(id) => selectTask(id)}
        />
      )}

      {/* Task detail */}
      {selectedPhase && selectedModule && selectedTask && (
        <TaskDetailView
          phase={selectedPhase}
          moduleName={selectedModule.title}
          task={selectedTask}
          onBack={() => selectTask(null)}
          onTryInPlayground={(code, language) => {
            setPlaygroundCode(code, language === "typescript" ? "typescript" : "javascript");
            setView("playground");
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// Phase Detail — modules as connected arrows
// ============================================================

function PhaseDetailView({
  phase,
  onBack,
  onModuleClick,
}: {
  phase: GeneratedPhase;
  onBack: () => void;
  onModuleClick: (moduleId: string) => void;
}) {
  const colors = PHASE_COLOR_MAP[phase.color] ?? PHASE_COLOR_MAP.teal;
  const state = useStore((s) => s.state);

  return (
    <div className="space-y-4">
      <BackButton onClick={onBack} label="All phases" />

      <GlassCard className={cn("p-5 border-2", colors.border)}>
        <div className="flex items-start gap-4">
          <div className={cn("h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl shrink-0", colors.gradient)}>
            {phase.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full", colors.bg, colors.text)}>
                Phase {phase.number}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">{phase.estWeeks} weeks</span>
            </div>
            <h2 className="text-xl font-bold">{phase.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{phase.subtitle}</p>
          </div>
        </div>

        {/* Objectives */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {phase.objectives.map((obj, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <Target className={cn("h-3.5 w-3.5 mt-0.5 shrink-0", colors.text)} />
              <span>{obj}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Modules as connected arrows */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Modules — complete in order</h3>
        <div className="flex flex-col gap-0">
          {phase.modules.map((m, i) => {
            const tasks = m.tasks;
            const completed = tasks.filter((t) => state.tasks[t.id]?.completedAt).length;
            const pct = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
            const isLast = i === phase.modules.length - 1;
            return (
              <div key={m.id}>
                <button
                  onClick={() => onModuleClick(m.id)}
                  className={cn(
                    "group w-full text-left rounded-xl border-2 p-4 transition-all hover:scale-[1.01]",
                    colors.bg, colors.border, "hover:shadow-lg",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("h-8 w-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white shrink-0", colors.gradient)}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{m.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{m.description}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-mono text-muted-foreground">{completed}/{tasks.length}</div>
                      <div className={cn("text-[10px] font-mono", colors.text)}>{pct}%</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
                {!isLast && (
                  <div className="flex justify-center py-1">
                    <div className={cn("h-6 w-0.5 bg-gradient-to-b", colors.gradient)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Module Detail — task list
// ============================================================

function ModuleDetailView({
  phase,
  module,
  onBack,
  onTaskClick,
}: {
  phase: GeneratedPhase;
  module: GeneratedPhase["modules"][number];
  onBack: () => void;
  onTaskClick: (taskId: string) => void;
}) {
  const colors = PHASE_COLOR_MAP[phase.color] ?? PHASE_COLOR_MAP.teal;
  const state = useStore((s) => s.state);

  return (
    <div className="space-y-4">
      <BackButton onClick={onBack} label={`Phase ${phase.number}`} />
      <GlassCard className={cn("p-4 border-2", colors.border)}>
        <h2 className="font-bold text-lg">{module.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
      </GlassCard>

      <div className="space-y-2">
        {module.tasks.map((task, i) => {
          const isComplete = !!state.tasks[task.id]?.completedAt;
          return (
            <button
              key={task.id}
              onClick={() => onTaskClick(task.id)}
              className="w-full text-left rounded-xl border border-border/60 bg-card/40 p-3 hover:bg-card/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                  isComplete ? "bg-emerald-500 text-white" : "bg-foreground/5 text-muted-foreground",
                )}>
                  {isComplete ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-mono">{i + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{task.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {task.estMinutes}m</span>
                    <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> {task.xp} XP</span>
                    {task.codeExample && <span className="flex items-center gap-1"><Code2 className="h-3 w-3" /> code</span>}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Task Detail
// ============================================================

function TaskDetailView({
  phase,
  moduleName,
  task,
  onBack,
  onTryInPlayground,
}: {
  phase: GeneratedPhase;
  moduleName: string;
  task: GeneratedPhase["modules"][number]["tasks"][number];
  onBack: () => void;
  onTryInPlayground: (code: string, language: "javascript" | "typescript" | "python") => void;
}) {
  const colors = PHASE_COLOR_MAP[phase.color] ?? PHASE_COLOR_MAP.teal;
  const isComplete = useStore((s) => !!s.state.tasks[task.id]?.completedAt);
  const toggleTask = useStore((s) => s.toggleTask);
  const setView = useStore((s) => s.setView);

  // Check if this phase is locked — if so, prevent task completion.
  // Phase 1 is always unlocked. Phase N requires the previous phase to be complete.
  // The user can still VIEW locked phases (read-only), but cannot mark tasks complete.
  const isPhaseUnlocked = useStore((s) => s.isPhaseUnlocked);
  const phaseLocked = phase.number > 1 && !isPhaseUnlocked(phase.number);

  const handleToggleTask = () => {
    if (phaseLocked) {
      // Show a friendly message instead of silently failing
      alert(
        `🔒 This phase is locked.\n\n` +
        `Phase ${phase.number} unlocks when you complete Phase ${phase.number - 1}.\n\n` +
        `You can still preview the tasks in this phase, but you'll need to complete the previous phase first to mark them as done.`
      );
      return;
    }
    toggleTask(task.id);
  };

  return (
    <div className="space-y-4">
      <BackButton onClick={onBack} label={moduleName} />

      {/* Phase locked banner — shown at top of task view when phase is locked */}
      {phaseLocked && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/40 p-3 flex items-start gap-2">
          <Lock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 dark:text-amber-300">
            <strong>Phase {phase.number} is locked.</strong> Complete Phase {phase.number - 1} first to unlock this phase.
            You can preview the tasks below but cannot mark them complete yet.
          </div>
        </div>
      )}

      <GlassCard className={cn("p-5 border-2", colors.border, phaseLocked && "opacity-90")}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1">
              Phase {phase.number} · {moduleName}
            </div>
            <h2 className="text-xl font-bold">{task.title}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {task.lessonId && (
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => setView("learn")}
                title="Open the corresponding lesson in the Learn tab"
              >
                <BookOpen className="h-4 w-4" /> Go to lesson
              </GlassButton>
            )}
            <GlassButton
              variant={isComplete ? "primary" : "ghost"}
              onClick={handleToggleTask}
              size="sm"
              disabled={phaseLocked}
              className={phaseLocked ? "opacity-50 cursor-not-allowed" : ""}
            >
              {phaseLocked ? <Lock className="h-4 w-4" /> : isComplete ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              {phaseLocked ? "Locked" : isComplete ? "Completed" : "Mark complete"}
            </GlassButton>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {task.estMinutes} min</span>
          <span className="flex items-center gap-1"><Trophy className="h-3.5 w-3.5" /> {task.xp} XP</span>
          {task.tags?.map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded bg-foreground/5 text-[10px]">{t}</span>
          ))}
          {task.lessonId && (
            <span className="px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-500 text-[10px] font-mono">
              Lesson: {task.lessonId}
            </span>
          )}
        </div>

        {/* Why this matters */}
        <div className="rounded-lg bg-foreground/5 p-3 mb-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Why this matters</div>
          <p className="text-sm">{task.why}</p>
        </div>

        {/* Brief */}
        <div className="rounded-lg bg-card/60 border border-border/60 p-3 mb-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">What to do</div>
          <p className="text-sm">{task.brief}</p>
        </div>

        {/* Steps */}
        {task.steps && task.steps.length > 0 && (
          <div className="mb-3">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Steps</div>
            <ol className="space-y-2">
              {task.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className={cn("h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5", colors.bg, colors.text)}>
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* YouTube video embed — triggered by a `youtube:VIDEO_ID` tag */}
        {(() => {
          const ytTag = task.tags?.find((t) => t.startsWith("youtube:"));
          if (!ytTag) return null;
          const videoId = ytTag.slice("youtube:".length);
          return <TaskYouTubeEmbed videoId={videoId} />;
        })()}

        {/* Code example with Try in Playground */}
        {task.codeExample && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Code example</div>
              {task.codeExample.language !== "python" && (
                <button
                  onClick={() => onTryInPlayground(task.codeExample!.code, task.codeExample!.language as "javascript" | "typescript")}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
                >
                  <Code2 className="h-3 w-3" /> Try in Playground
                </button>
              )}
            </div>
            <div className="rounded-lg overflow-hidden text-xs">
              <SyntaxHighlighter
                language={task.codeExample.language === "typescript" ? "typescript" : task.codeExample.language === "python" ? "python" : "javascript"}
                style={vscDarkPlus}
                customStyle={{ margin: 0, fontSize: "12px", padding: "12px" }}
                codeTagProps={{ style: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" } }}
              >
                {task.codeExample.code}
              </SyntaxHighlighter>
            </div>
            {task.codeExample.language === "python" && (
              <p className="text-[10px] text-muted-foreground mt-1 italic">
                Playground supports JavaScript. For Python, use an external environment.
              </p>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

// ============================================================
// Shared components
// ============================================================

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ChevronLeft className="h-4 w-4" />
      Back to {label}
    </button>
  );
}

// ============================================================
// TaskYouTubeEmbed — collapsible YouTube embed for roadmap tasks
// that include a `youtube:VIDEO_ID` tag (e.g. the VS Code setup task).
// Uses youtube-nocookie.com for privacy. Collapsed by default.
// ============================================================
function TaskYouTubeEmbed({ videoId }: { videoId: string }) {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="mb-3 rounded-lg border border-border/60 bg-card/40 overflow-hidden">
      <div className="px-3 py-2 flex items-center justify-between gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs font-semibold hover:text-primary transition-colors"
          aria-expanded={expanded}
        >
          <Youtube className="h-4 w-4 text-red-500" />
          {expanded ? "Hide video" : "Watch tutorial video"}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          Hide
        </button>
      </div>
      {expanded && (
        <div>
          <div className="px-3 pb-2 text-[10px] text-muted-foreground italic">
            ⚠️ Loading this video connects to YouTube servers (youtube-nocookie.com).
          </div>
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
              title="Tutorial video"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
