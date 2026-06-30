"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  Code,
  Book,
  Dumbbell,
  Moon,
  Flame,
  Clock,
  Check,
} from "lucide-react";
import { useStore, HABIT_DEFINITIONS } from "@/lib/store";
import { GlassCard, GlassButton, GlassPill, ProgressRing } from "@/components/glass/GlassPrimitives";
import { todayKey, dateKey } from "@/lib/storage";
import { cn } from "@/lib/utils";

type TimerMode = "focus" | "break";
type TimerState = "idle" | "running" | "paused";

const HABIT_ICONS: Record<string, typeof Code> = {
  code: Code,
  read: Book,
  exercise: Dumbbell,
  sleep: Moon,
  leetcode: Brain,
};

export function FocusView() {
  const state = useStore((s) => s.state);
  const addFocusSession = useStore((s) => s.addFocusSession);
  const toggleHabit = useStore((s) => s.toggleHabit);

  // Timer state (local, ephemeral — but sessions are persisted on completion)
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [duration, setDuration] = useState(25 * 60); // 25 min default
  const [remaining, setRemaining] = useState(25 * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Preset durations
  const presets = mode === "focus"
    ? [{ m: 25, label: "Pomodoro" }, { m: 50, label: "Deep work" }, { m: 90, label: "Flow state" }]
    : [{ m: 5, label: "Short" }, { m: 10, label: "Long" }, { m: 15, label: "Reset" }];

  // Reset `remaining` when `duration` changes (but only when the timer is
  // idle/paused, so we don't disrupt an active countdown). Uses the
  // "adjust state during render" pattern recommended by the React docs.
  const [prevDuration, setPrevDuration] = useState(duration);
  if (duration !== prevDuration) {
    setPrevDuration(duration);
    if (timerState !== "running") {
      setRemaining(duration);
    }
  }

  // Tick down
  useEffect(() => {
    if (timerState !== "running") return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          // Timer complete
          clearInterval(intervalRef.current!);
          setTimerState("idle");
          if (mode === "focus") {
            addFocusSession({
              startedAt: new Date(Date.now() - duration * 1000).toISOString(),
              durationMinutes: Math.floor(duration / 60),
              completed: true,
            });
            // Auto-switch to break
            setMode("break");
            setDuration(5 * 60);
          } else {
            setMode("focus");
            setDuration(25 * 60);
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState, mode, duration, addFocusSession]);

  const start = () => setTimerState("running");
  const pause = () => setTimerState("paused");
  const reset = () => {
    setTimerState("idle");
    setRemaining(duration);
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = ((duration - remaining) / duration) * 100;

  // Today's habits
  const today = todayKey();
  const todayHabits = state.habits.find((h) => h.date === today)?.habits ?? {};
  const habitsCompleted = Object.values(todayHabits).filter(Boolean).length;

  // Last 14 days of habits
  const last14 = useMemo(() => {
    const days: { date: string; completed: number; label: string }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      const h = state.habits.find((x) => x.date === key);
      const completed = h ? Object.values(h.habits).filter(Boolean).length : 0;
      days.push({
        date: key,
        completed,
        label: d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1),
      });
    }
    return days;
  }, [state.habits]);

  // Today's focus total
  // IMPORTANT: `startedAt` is an ISO/UTC timestamp. Comparing it to
  // `new Date().toISOString().slice(0, 10)` (also UTC) gives the wrong "today"
  // for any user outside UTC — a session at 23:30 local on Jun 15 in UTC−5
  // has startedAt = "2026-06-16T04:30:00Z" and would be counted on Jun 16.
  // Use local-date keys via `dateKey(new Date(...))` and `todayKey()` instead.
  const todayFocusMinutes = useMemo(() => {
    const todayLocal = todayKey();
    return state.focusSessions
      .filter((s) => dateKey(new Date(s.startedAt)) === todayLocal && s.completed)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  }, [state.focusSessions]);

  // This week's focus
  const weekFocusMinutes = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return state.focusSessions
      .filter((s) => new Date(s.startedAt).getTime() > weekAgo && s.completed)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  }, [state.focusSessions]);

  return (
    <div className="view-enter space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Timer */}
        <GlassCard variant="elevated" className="lg:col-span-2">
          <div className="p-6 sm:p-8 flex flex-col items-center">
            {/* Mode toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-foreground/5 mb-6">
              <button
                onClick={() => { setMode("focus"); setDuration(25 * 60); setTimerState("idle"); }}
                className={cn(
                  "px-4 py-1.5 text-xs font-medium rounded-lg transition-all",
                  mode === "focus" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
                )}
              >
                <Brain className="h-3 w-3 inline mr-1" /> Focus
              </button>
              <button
                onClick={() => { setMode("break"); setDuration(5 * 60); setTimerState("idle"); }}
                className={cn(
                  "px-4 py-1.5 text-xs font-medium rounded-lg transition-all",
                  mode === "break" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
                )}
              >
                <Coffee className="h-3 w-3 inline mr-1" /> Break
              </button>
            </div>

            {/* Timer ring */}
            <ProgressRing value={progress} size={240} strokeWidth={10}>
              <div className="flex flex-col items-center">
                <div className="text-5xl font-bold tabular-nums tracking-tight">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
                  {mode === "focus" ? "Focus Session" : "Break Time"}
                </div>
                {timerState === "running" && (
                  <GlassPill className="mt-2 bg-emerald-400/10 border-emerald-400/30 text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" /> Running
                  </GlassPill>
                )}
              </div>
            </ProgressRing>

            {/* Presets */}
            <div className="flex items-center gap-2 mt-6">
              {presets.map((p) => (
                <button
                  key={p.m}
                  onClick={() => { setDuration(p.m * 60); setTimerState("idle"); }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                    duration === p.m * 60
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-foreground/4 border-border/40 text-muted-foreground hover:bg-foreground/8",
                  )}
                >
                  {p.m}m · {p.label}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 mt-6">
              {timerState === "running" ? (
                <GlassButton size="lg" onClick={pause}>
                  <Pause className="h-4 w-4" /> Pause
                </GlassButton>
              ) : (
                <GlassButton size="lg" onClick={start} disabled={remaining === 0}>
                  <Play className="h-4 w-4" /> {timerState === "paused" ? "Resume" : "Start"}
                </GlassButton>
              )}
              <GlassButton size="lg" variant="outline" onClick={reset}>
                <RotateCcw className="h-4 w-4" /> Reset
              </GlassButton>
            </div>
          </div>
        </GlassCard>

        {/* Stats column */}
        <div className="space-y-3">
          <GlassCard>
            <div className="p-5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Today's focus
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tabular-nums">
                  {Math.floor(todayFocusMinutes / 60)}
                </span>
                <span className="text-sm text-muted-foreground">h</span>
                <span className="text-3xl font-bold tabular-nums">
                  {todayFocusMinutes % 60}
                </span>
                <span className="text-sm text-muted-foreground">m</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                {state.focusSessions.filter((s) => dateKey(new Date(s.startedAt)) === todayKey()).length} sessions
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                This week
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tabular-nums">
                  {Math.floor(weekFocusMinutes / 60)}
                </span>
                <span className="text-sm text-muted-foreground">h</span>
                <span className="text-3xl font-bold tabular-nums">
                  {weekFocusMinutes % 60}
                </span>
                <span className="text-sm text-muted-foreground">m</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                {state.focusSessions.filter((s) => {
                  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                  return new Date(s.startedAt).getTime() > weekAgo && s.completed;
                }).length} sessions
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Streak
                </div>
                <Flame className="h-3 w-3 text-orange-400" />
              </div>
              <div className="text-3xl font-bold tabular-nums">{state.streak.current}</div>
              <div className="text-[10px] text-muted-foreground mt-1">
                days · longest {state.streak.longest}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Habit tracker */}
      <GlassCard variant="elevated">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Daily habits</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {habitsCompleted}/{HABIT_DEFINITIONS.length} completed today
              </p>
            </div>
            <GlassPill>
              <Clock className="h-3 w-3" /> {new Date().toLocaleDateString("en-US", { weekday: "long" })}
            </GlassPill>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {HABIT_DEFINITIONS.map((h) => {
              const Icon = HABIT_ICONS[h.id] ?? Code;
              const done = !!todayHabits[h.id];
              return (
                <button
                  key={h.id}
                  onClick={() => toggleHabit(h.id)}
                  className={cn(
                    "rounded-xl p-3 border transition-all text-left",
                    done
                      ? "bg-emerald-400/10 border-emerald-400/30"
                      : "bg-foreground/4 border-border/40 hover:border-primary/30",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={cn("h-4 w-4", done ? "text-emerald-400" : "text-muted-foreground")} />
                    {done && <Check className="h-3 w-3 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] font-medium mt-2 leading-tight">{h.label}</div>
                </button>
              );
            })}
          </div>

          {/* 14-day habit heatmap */}
          <div className="mt-6">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Last 14 days
            </div>
            <div className="flex items-end gap-1">
              {last14.map((d) => (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "w-full h-12 rounded-md transition-all",
                      d.completed === 0 && "bg-foreground/4",
                      d.completed === 1 && "bg-emerald-400/30",
                      d.completed === 2 && "bg-emerald-400/50",
                      d.completed === 3 && "bg-emerald-400/70",
                      d.completed >= 4 && "bg-emerald-400",
                    )}
                    title={`${d.date}: ${d.completed}/${HABIT_DEFINITIONS.length} habits`}
                  />
                  <span className="text-[9px] font-mono text-muted-foreground">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
