"use client";

import { useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  Flame,
  Clock,
  Target,
  Award,
  Zap,
  Trophy,
} from "lucide-react";
import { useStore, selectEarnedXP, selectOverallProgress, selectPhaseProgress, selectCareerProgress } from "@/lib/store";
import { dateKey } from "@/lib/storage";
import { GlassCard, ProgressBar } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import { LANGUAGE_MAP, CAREER_MAP } from "@/lib/career-data";

export function AnalyticsView() {
  const state = useStore((s) => s.state);
  const roadmap = state.roadmap;
  const earnedXP = selectEarnedXP(state);
  const overall = selectOverallProgress(state);
  const careerProgress = selectCareerProgress(state);

  // 12 weeks heatmap
  const heatmap = useMemo(() => {
    const days: { date: string; count: number; weekIdx: number; dayIdx: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - 83);
    start.setDate(start.getDate() - start.getDay());
    for (let i = 0; i < 84; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const k = dateKey(d);
      days.push({
        date: k,
        count: state.activity[k] || 0,
        weekIdx: Math.floor(i / 7),
        dayIdx: i % 7,
      });
    }
    return days;
  }, [state.activity]);

  const weeks = Array.from(new Set(heatmap.map((d) => d.weekIdx)));
  const maxCount = Math.max(...heatmap.map((d) => d.count), 1);

  if (!roadmap) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-sm text-muted-foreground">Complete onboarding to see your analytics.</p>
      </GlassCard>
    );
  }

  // Phase breakdown
  const phaseData = roadmap.phases.map((p) => ({
    ...p,
    progress: selectPhaseProgress(state, p.id),
  }));

  // Lesson progress
  const lessonProgress = Object.values(state.lessonProgress);
  const lessonsComplete = lessonProgress.filter((p) => p.status === "complete").length;
  const quizAvg = lessonProgress.filter((p) => p.bestQuizScore !== undefined)
    .reduce((sum, p, _, arr) => sum + (p.bestQuizScore ?? 0) / arr.length, 0);

  // Focus session stats
  const focusSessions = state.focusSessions.filter((f) => f.completed);
  const focusMinutes = focusSessions.reduce((sum, f) => sum + f.durationMinutes, 0);

  // Streak calendar (last 30 days)
  const streakDays = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const k = dateKey(d);
    return { date: k, label: d.getDate(), count: state.activity[k] || 0 };
  });

  const career = state.profile.careerId ? CAREER_MAP[state.profile.careerId] : null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your personalized learning insights for {career?.label ?? "your career"}.
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<Trophy className="h-4 w-4" />} label="Total XP" value={earnedXP.toLocaleString()} color="text-amber-500" />
        <StatCard icon={<Target className="h-4 w-4" />} label="Tasks done" value={`${overall.completed}/${overall.total}`} color="text-emerald-500" />
        <StatCard icon={<Flame className="h-4 w-4" />} label="Current streak" value={`${state.streak.current}d`} color="text-orange-500" />
        <StatCard icon={<Award className="h-4 w-4" />} label="Badges" value={state.badges.filter((b) => b.unlockedAt).length.toString()} color="text-violet-500" />
      </div>

      {/* Career progress (Section 11 — uses centralized selectCareerProgress, same formula as Dashboard + Career) */}
      <GlassCard className="p-5">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" /> Career progress · {career?.label ?? "—"}
        </h2>
        <div className="flex items-center gap-4 mb-3">
          <div className="text-3xl font-bold font-mono">{careerProgress.overall}%</div>
          <div className="flex-1">
            <ProgressBar value={careerProgress.overall} className="h-2.5" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Roadmap (40%)</div>
            <div className="font-mono font-semibold">{careerProgress.roadmapPct}%</div>
            <ProgressBar value={careerProgress.roadmapPct} className="h-1 mt-1" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Lessons (40%)</div>
            <div className="font-mono font-semibold">{careerProgress.lessonsPct}%</div>
            <ProgressBar value={careerProgress.lessonsPct} className="h-1 mt-1" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Projects (20%)</div>
            <div className="font-mono font-semibold">{careerProgress.projectsPct}%</div>
            <ProgressBar value={careerProgress.projectsPct} className="h-1 mt-1" />
          </div>
        </div>
      </GlassCard>

      {/* Activity heatmap */}
      <GlassCard className="p-5">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4" /> Activity — last 12 weeks
        </h2>
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-[600px]">
            {weeks.map((weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const day = heatmap.find((d) => d.weekIdx === weekIdx && d.dayIdx === dayIdx);
                  if (!day) return <div key={dayIdx} className="w-3 h-3" />;
                  const intensity = day.count === 0 ? 0 : Math.ceil((day.count / maxCount) * 4);
                  return (
                    <div
                      key={dayIdx}
                      className={cn(
                        "w-3 h-3 rounded-sm",
                        intensity === 0 && "bg-foreground/5",
                        intensity === 1 && "bg-emerald-500/30",
                        intensity === 2 && "bg-emerald-500/50",
                        intensity === 3 && "bg-emerald-500/75",
                        intensity === 4 && "bg-emerald-500",
                      )}
                      title={`${day.date}: ${day.count} tasks`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-foreground/5" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500/30" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500/50" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500/75" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span>More</span>
        </div>
      </GlassCard>

      {/* Phase progress breakdown */}
      <GlassCard className="p-5">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Target className="h-4 w-4" /> Phase progress
        </h2>
        <div className="space-y-3">
          {phaseData.map((p) => (
            <div key={p.id}>
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{p.icon}</span>
                  <span className="font-medium">{p.title}</span>
                </div>
                <span className="text-muted-foreground font-mono">{p.progress.completed}/{p.progress.total} · {p.progress.pct}%</span>
              </div>
              <ProgressBar value={p.progress.pct} className="h-2" />
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lesson progress */}
        <GlassCard className="p-5">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" /> Lesson progress
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Lessons completed</span>
              <span className="text-sm font-mono font-semibold">{lessonsComplete} / 30</span>
            </div>
            <ProgressBar value={(lessonsComplete / 30) * 100} className="h-2" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Avg quiz score</span>
              <span className="text-sm font-mono font-semibold">{quizAvg > 0 ? `${Math.round(quizAvg)}%` : "—"}</span>
            </div>
            <ProgressBar value={quizAvg} className="h-2" />
          </div>
        </GlassCard>

        {/* Focus session stats */}
        <GlassCard className="p-5">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" /> Focus sessions
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-2xl font-bold font-mono">{focusSessions.length}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">{focusMinutes}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Minutes</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">{state.streak.longest}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Best streak</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 30-day streak calendar */}
      <GlassCard className="p-5">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Flame className="h-4 w-4" /> Last 30 days
        </h2>
        <div className="grid grid-cols-10 gap-1.5">
          {streakDays.map((d, i) => (
            <div
              key={i}
              className={cn(
                "aspect-square rounded text-[10px] font-mono flex items-center justify-center",
                d.count > 0 ? "bg-emerald-500/30 text-emerald-700 dark:text-emerald-300" : "bg-foreground/5 text-muted-foreground",
              )}
              title={`${d.date}: ${d.count} tasks`}
            >
              {d.label}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Language usage */}
      {roadmap.languageIds.length > 0 && (
        <GlassCard className="p-5">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4" /> Languages in your plan
          </h2>
          <div className="flex flex-wrap gap-2">
            {roadmap.languageIds.map((id) => {
              const lang = LANGUAGE_MAP[id];
              if (!lang) return null;
              return (
                <div key={id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-foreground/5 border border-border/60">
                  <span className="text-lg">{lang.icon}</span>
                  <div>
                    <div className="text-xs font-medium">{lang.name}</div>
                    <div className="text-[10px] text-muted-foreground">Demand: {lang.demand}/5 · {lang.trend}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={color}>{icon}</div>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">{label}</span>
      </div>
      <div className="text-xl font-bold font-mono">{value}</div>
    </GlassCard>
  );
}
