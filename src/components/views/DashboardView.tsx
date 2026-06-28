"use client";

import {
  Flame,
  Trophy,
  Target,
  Clock,
  ArrowRight,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Sparkles,
  Bot,
} from "lucide-react";
import { useStore, selectLevel, selectEarnedXP, selectOverallProgress, selectPhaseProgress } from "@/lib/store";
import { GlassCard, GlassButton, ProgressBar, ProgressRing } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import { LANGUAGE_MAP, CAREER_MAP } from "@/lib/career-data";
import { getTodayChallenge } from "@/lib/daily-challenges-data";

export function DashboardView() {
  const state = useStore((s) => s.state);
  const setView = useStore((s) => s.setView);
  const selectPhase = useStore((s) => s.selectPhase);
  const setAiTutorOpen = useStore((s) => s.setAiTutorOpen);
  const roadmap = state.roadmap;
  const profile = state.profile;

  const level = selectLevel(state);
  const earnedXP = selectEarnedXP(state);
  const overall = selectOverallProgress(state);
  const streak = state.streak.current;
  const longest = state.streak.longest;

  // Find current phase (first phase not 100% complete)
  const currentPhase = (() => {
    if (!roadmap) return null;
    for (const p of roadmap.phases) {
      const prog = selectPhaseProgress(state, p.id);
      if (prog.pct < 100) return p;
    }
    return roadmap.phases[roadmap.phases.length - 1];
  })();

  // Find next incomplete task
  const nextTask = (() => {
    if (!currentPhase) return null;
    for (const m of currentPhase.modules) {
      for (const t of m.tasks) {
        if (!state.tasks[t.id]?.completedAt) return { task: t, module: m, phase: currentPhase };
      }
    }
    return null;
  })();

  const todayChallenge = getTodayChallenge();
  const career = profile.careerId ? CAREER_MAP[profile.careerId] : null;

  // Recent activity (last 7 days)
  const today = new Date();
  const recentDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { key, label: d.toLocaleDateString("en", { weekday: "short" }).slice(0, 2), count: state.activity[key] || 0 };
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {profile.name ? `Welcome back, ${profile.name.split(" ")[0]}` : "Welcome to Launchpad"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {career ? `Training for: ${career.label}${profile.subPath ? ` (${profile.subPath})` : ""}` : "Set up your profile to get personalized content"}
        </p>
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Trophy className="h-4 w-4" />}
          label="Level"
          value={level.level.toString()}
          sub={`${earnedXP.toLocaleString()} XP`}
          color="text-amber-500"
        />
        <StatCard
          icon={<Flame className="h-4 w-4" />}
          label="Streak"
          value={`${streak}d`}
          sub={`Best: ${longest}d`}
          color="text-orange-500"
        />
        <StatCard
          icon={<Target className="h-4 w-4" />}
          label="Progress"
          value={`${overall.pct}%`}
          sub={`${overall.completed}/${overall.total} tasks`}
          color="text-emerald-500"
        />
        <StatCard
          icon={<Sparkles className="h-4 w-4" />}
          label="Badges"
          value={state.badges.filter((b) => b.unlockedAt).length.toString()}
          sub={`of ${24}+`}
          color="text-violet-500"
        />
      </div>

      {/* Continue learning */}
      {nextTask && (
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-primary" /> Continue where you left off
            </h2>
            <button
              onClick={() => { selectPhase(nextTask.phase.id); setView("roadmap"); }}
              className="text-xs text-primary hover:underline"
            >
              View roadmap →
            </button>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-violet-500/20 flex items-center justify-center text-2xl shrink-0">
              {nextTask.phase.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">
                Phase {nextTask.phase.number} · {nextTask.module.title}
              </div>
              <h3 className="font-semibold text-sm mt-0.5">{nextTask.task.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{nextTask.task.brief}</p>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground font-mono">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {nextTask.task.estMinutes}m</span>
                <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> {nextTask.task.xp} XP</span>
              </div>
            </div>
            <GlassButton
              variant="primary"
              size="sm"
              onClick={() => { selectPhase(nextTask.phase.id); setView("roadmap"); }}
            >
              Continue
            </GlassButton>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Current phase progress */}
        {currentPhase && (
          <GlassCard className="p-5">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" /> Current phase
            </h2>
            <div className="flex items-center gap-4">
              <ProgressRing value={selectPhaseProgress(state, currentPhase.id).pct} size={64} strokeWidth={5}>
                <span className="text-lg">{currentPhase.icon}</span>
              </ProgressRing>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono text-muted-foreground">Phase {currentPhase.number}</div>
                <h3 className="font-bold text-base">{currentPhase.title}</h3>
                <p className="text-xs text-muted-foreground">{currentPhase.subtitle}</p>
                <div className="mt-2">
                  <ProgressBar value={selectPhaseProgress(state, currentPhase.id).pct} className="h-1.5" />
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Daily challenge */}
        <GlassCard className="p-5">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Daily challenge
          </h2>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
              <Flame className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">{todayChallenge.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{todayChallenge.prompt}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-muted-foreground font-mono">
                  Streak: {state.dailyChallenge.currentStreak}d
                </span>
                <GlassButton variant="ghost" size="sm" onClick={() => setView("daily-challenge")} className="ml-auto">
                  Try it →
                </GlassButton>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Languages */}
      {roadmap && roadmap.languageIds.length > 0 && (
        <GlassCard className="p-5">
          <h2 className="text-sm font-semibold mb-3">Languages in your plan</h2>
          <div className="flex flex-wrap gap-2">
            {roadmap.languageIds.map((id) => {
              const lang = LANGUAGE_MAP[id];
              if (!lang) return null;
              return (
                <button
                  key={id}
                  onClick={() => setView("learn")}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-foreground/5 border border-border/60 hover:border-primary/40 transition-colors"
                >
                  <span className="text-lg">{lang.icon}</span>
                  <div className="text-left">
                    <div className="text-xs font-medium">{lang.name}</div>
                    <div className="text-[10px] text-muted-foreground">{lang.tagline}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Recent activity */}
      <GlassCard className="p-5">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" /> Last 7 days
        </h2>
        <div className="flex items-end justify-between gap-2 h-24">
          {recentDays.map((day) => {
            const max = Math.max(...recentDays.map((d) => d.count), 1);
            const height = (day.count / max) * 100;
            return (
              <div key={day.key} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[10px] font-mono text-muted-foreground">{day.count || ""}</div>
                <div className="w-full bg-foreground/10 rounded-t-md flex items-end" style={{ height: "60px" }}>
                  <div
                    className="w-full bg-gradient-to-t from-primary/60 to-primary rounded-t-md transition-all"
                    style={{ height: `${height}%`, minHeight: day.count > 0 ? "4px" : "0" }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">{day.label}</div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* AI Tutor CTA */}
      <GlassCard className="p-5 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-500/30">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Need help? Ask the AI Tutor</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Stuck on a concept? Want code reviewed? The AI Tutor is one click away.
            </p>
          </div>
          <GlassButton variant="primary" size="sm" onClick={() => setAiTutorOpen(true)}>
            <Bot className="h-4 w-4" /> Ask now
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={color}>{icon}</div>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">{label}</span>
      </div>
      <div className="text-2xl font-bold font-mono">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
    </GlassCard>
  );
}
