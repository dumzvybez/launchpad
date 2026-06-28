"use client";

import { useState, useEffect } from "react";
import { Target, Flame, Lightbulb, Eye, EyeOff, Clock, Trophy, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard, GlassButton, ProgressBar } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import { DAILY_CHALLENGES, getTodayChallenge } from "@/lib/daily-challenges-data";

export function DailyChallengeView() {
  const todayChallenge = getTodayChallenge();
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [userSolution, setUserSolution] = useState(todayChallenge.starterCode);
  const [output, setOutput] = useState<string[]>([]);

  const dailyChallenge = useStore((s) => s.state.dailyChallenge);
  const completeDailyChallenge = useStore((s) => s.completeDailyChallenge);
  const setPlaygroundCode = useStore((s) => s.setPlaygroundCode);
  const setView = useStore((s) => s.setView);

  // Determine if today's challenge is already done
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (dailyChallenge.lastChallengeDate === today && dailyChallenge.completedToday) {
      setCompleted(true);
    }
  }, [dailyChallenge]);

  const handleComplete = () => {
    completeDailyChallenge();
    setCompleted(true);
  };

  const handleTryInPlayground = () => {
    setPlaygroundCode(userSolution, "javascript");
    setView("playground");
  };

  const handleRun = () => {
    setOutput([]);
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => {
      logs.push(args.map(a => typeof a === "string" ? a : JSON.stringify(a, null, 2)).join(" "));
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

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Daily Challenge</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A new coding challenge every day. Build a streak by completing them daily.
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
            <h2 className="text-lg font-bold">{todayChallenge.title}</h2>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Daily</span>
              <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> {todayChallenge.difficulty * 20} XP</span>
              <span>Difficulty: {"⭐".repeat(todayChallenge.difficulty)}</span>
            </div>
          </div>
          {completed && (
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-4 w-4" /> Completed
            </div>
          )}
        </div>

        <p className="text-sm text-foreground/90 leading-relaxed mb-4">{todayChallenge.prompt}</p>

        {/* Editor */}
        <div className="rounded-lg border border-border/60 overflow-hidden mb-3">
          <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-700/50 flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">{todayChallenge.language}</span>
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
            {todayChallenge.hint}
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 mb-3">
            <div className="text-[10px] uppercase text-amber-600 dark:text-amber-400 font-semibold mb-1">Reference solution</div>
            <pre className="text-xs font-mono text-foreground/90 overflow-x-auto">{todayChallenge.solution}</pre>
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

      {/* All 7 challenges overview */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">This week&apos;s challenges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {DAILY_CHALLENGES.map((c, i) => {
            const dayName = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i];
            const isToday = c.id === todayChallenge.id;
            return (
              <div
                key={c.id}
                className={cn(
                  "rounded-lg border p-2 text-xs",
                  isToday ? "border-primary bg-primary/5" : "border-border/60",
                )}
              >
                <div className="font-medium">{dayName} · {c.title.replace(/^\w+:\s/, "")}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {"⭐".repeat(c.difficulty)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
