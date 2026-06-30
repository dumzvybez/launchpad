"use client";

import { useState, useMemo } from "react";
import { Flame, Lightbulb, Eye, EyeOff, Clock, Trophy, CheckCircle2, Calendar } from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard, GlassButton } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import { DAILY_CHALLENGE_TASKS, DAILY_CHALLENGE_TASK_MAP } from "@/lib/daily-challenges-data-v2";
import type { DailyChallengeTask } from "@/lib/types";

/** Get the start of the current week (Monday) as an ISO date string. */
function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  return d.toISOString().slice(0, 10);
}

/** Deterministically select 7 tasks for the current week from the user's pool. */
function selectWeekTasks(pool: string[] | undefined, weekStart: string): DailyChallengeTask[] {
  if (!pool || pool.length === 0) {
    // Fallback: pick 7 tasks from the global pool deterministically by week
    const seed = weekStart.split("-").join("");
    const start = parseInt(seed) % Math.max(1, DAILY_CHALLENGE_TASKS.length - 7);
    return DAILY_CHALLENGE_TASKS.slice(start, start + 7);
  }
  // Pick 7 from the user's pool, deterministically by week
  const seedNum = weekStart.split("-").reduce((a, b) => a + parseInt(b), 0);
  const start = seedNum % Math.max(1, pool.length - 7);
  const weekIds = pool.slice(start, start + 7);
  return weekIds
    .map((id) => DAILY_CHALLENGE_TASK_MAP[id])
    .filter((t): t is DailyChallengeTask => Boolean(t));
}

export function DailyChallengeView() {
  const pool = useStore((s) => s.state.dailyChallengePool);
  const dailyChallenge = useStore((s) => s.state.dailyChallenge);
  const completeDailyChallenge = useStore((s) => s.completeDailyChallenge);
  const setPlaygroundCode = useStore((s) => s.setPlaygroundCode);
  const setView = useStore((s) => s.setView);

  const weekStart = useMemo(() => getWeekStart(), []);
  const weekTasks = useMemo(() => selectWeekTasks(pool, weekStart), [pool, weekStart]);

  // Today's index = day of week (Mon=0 ... Sun=6)
  const todayIdx = useMemo(() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  }, []);
  const todayTask = weekTasks[todayIdx] ?? weekTasks[0];

  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userSolution, setUserSolution] = useState(todayTask?.starterCode ?? "");
  const [output, setOutput] = useState<string[]>([]);

  // Derive "completed" directly from the store — no need to mirror it in
  // local state (which required a setState-in-effect to stay in sync).
  const today = new Date().toISOString().slice(0, 10);
  const completed =
    dailyChallenge.lastChallengeDate === today &&
    !!dailyChallenge.completedToday;

  // Reset the user solution when today's task changes (e.g. new day or new
  // weekly pool). Uses the "adjust state during render" pattern recommended
  // by the React docs instead of setState-in-useEffect.
  const [prevTaskId, setPrevTaskId] = useState<string | undefined>(todayTask?.id);
  if (todayTask?.id !== prevTaskId) {
    setPrevTaskId(todayTask?.id);
    if (todayTask) setUserSolution(todayTask.starterCode ?? "");
  }

  const handleComplete = () => {
    completeDailyChallenge();
  };

  const handleTryInPlayground = () => {
    // Pass the actual task language through so the Playground opens in the
    // right mode. Previously this hard-coded "javascript" and broke for any
    // non-JS daily challenge.
    setPlaygroundCode(userSolution, todayTask?.language === "python" ? "python" : "javascript");
    setView("playground");
  };

  const handleRun = () => {
    // Only JavaScript tasks can run in-browser. For Python (and any other
    // language), nudge the user to the Playground which has the proper
    // runner (Pyodide for Python, etc.). Previously this always ran the
    // code through `new Function`, producing opaque SyntaxErrors for any
    // non-JS task.
    if (todayTask?.language && todayTask.language !== "javascript") {
      setOutput([
        `This daily challenge is in ${todayTask.language}. ` +
        `Click "Try in Playground" to run it with the proper runtime.`,
      ]);
      return;
    }
    setOutput([]);
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => {
      logs.push(args.map(a => {
        if (typeof a === "string") return a;
        try { return JSON.stringify(a, null, 2); } catch { return String(a); }
      }).join(" "));
    };
    try {
      const fn = new Function(userSolution);
      fn();
    } catch (err) {
      logs.push(`Error: ${(err as Error).message}`);
    } finally {
      console.log = origLog;
      setOutput(logs);
    }
  };

  if (!todayTask) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-sm text-muted-foreground">No daily challenges available. Complete onboarding to get your personalized challenge pool.</p>
      </GlassCard>
    );
  }

  const difficultyStars = todayTask.difficulty === "beginner" ? 1 : todayTask.difficulty === "intermediate" ? 3 : 5;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Daily Challenge</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A new coding challenge every day from your personalized pool of {pool?.length ?? 0} tasks. Build a streak by completing them daily.
        </p>
      </div>

      {/* Streak banner */}
      <GlassCard className="p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-orange-500/30">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <Flame className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold">{dailyChallenge.currentStreak} days</div>
            <div className="text-xs text-muted-foreground">Current streak</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              {completed ? "✅ Done today" : "⏳ Not done yet"}
            </div>
            <div className="text-[10px] text-muted-foreground">Come back tomorrow for the next one</div>
          </div>
        </div>
      </GlassCard>

      {/* Today's challenge */}
      <GlassCard className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="text-lg font-bold">{todayTask.title}</h2>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {todayTask.estMinutes}m</span>
              <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> {difficultyStars * 20} XP</span>
              <span className="px-1.5 py-0.5 rounded bg-foreground/5 capitalize">{todayTask.difficulty}</span>
              <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">{todayTask.language}</span>
            </div>
          </div>
          {completed && (
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-4 w-4" /> Completed
            </div>
          )}
        </div>

        <p className="text-sm text-foreground/90 leading-relaxed mb-4">{todayTask.description}</p>

        {/* Editor */}
        <div className="rounded-lg border border-border/60 overflow-hidden mb-3">
          <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-700/50 flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">{todayTask.language}</span>
            <div className="flex gap-1">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 transition-colors flex items-center gap-1"
              >
                <Lightbulb className="h-3 w-3" /> {showHint ? "Hide hint" : "Hint"}
              </button>
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors flex items-center gap-1"
              >
                {showSolution ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {showSolution ? "Hide solution" : "Solution"}
              </button>
            </div>
          </div>
          <textarea
            value={userSolution}
            onChange={(e) => setUserSolution(e.target.value)}
            spellCheck={false}
            className="w-full h-56 p-3 font-mono text-xs bg-zinc-900 text-zinc-100 resize-y focus:outline-none"
          />
        </div>

        {/* Hint */}
        {showHint && (
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-3 mb-3 text-sm">
            <div className="text-[10px] uppercase text-sky-600 dark:text-sky-400 font-semibold mb-1">💡 Hint</div>
            {todayTask.hint}
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 mb-3">
            <div className="text-[10px] uppercase text-amber-600 dark:text-amber-400 font-semibold mb-1">Reference solution</div>
            <pre className="text-xs font-mono text-foreground/90 overflow-x-auto">{todayTask.solution}</pre>
          </div>
        )}

        {/* Output */}
        {output.length > 0 && (
          <div className="rounded-lg border border-border/60 bg-zinc-950 p-3 mb-3 max-h-40 overflow-y-auto">
            <div className="text-[10px] uppercase text-muted-foreground font-mono mb-1">Output</div>
            {output.map((line, i) => (
              <div key={i} className="text-xs font-mono text-zinc-100 py-0.5">
                <span className="text-zinc-600 mr-2">{">"}</span>
                <pre className="whitespace-pre-wrap inline">{line}</pre>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <GlassButton variant="primary" size="sm" onClick={handleRun}>
            Run code
          </GlassButton>
          <GlassButton variant="ghost" size="sm" onClick={handleTryInPlayground}>
            Open in Playground
          </GlassButton>
          {!completed && (
            <GlassButton
              variant="primary"
              size="sm"
              onClick={handleComplete}
              className="ml-auto bg-emerald-500 hover:bg-emerald-600"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Mark complete
            </GlassButton>
          )}
        </div>
      </GlassCard>

      {/* This week's challenges — 7 from the user's pool */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5" /> This week&apos;s challenges (week of {weekStart})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {weekTasks.map((c, i) => {
            const dayName = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i];
            const isToday = i === todayIdx;
            return (
              <div
                key={c.id + i}
                className={cn(
                  "rounded-lg border p-2 text-xs",
                  isToday ? "border-primary bg-primary/5" : "border-border/60",
                )}
              >
                <div className="font-medium">{dayName} · {c.title}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-2">
                  <span className="capitalize">{c.difficulty}</span>
                  <span>·</span>
                  <span className="font-mono">{c.language}</span>
                  <span>·</span>
                  <span>{c.estMinutes}m</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
