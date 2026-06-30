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
  Share2,
  Map as MapIcon,
  BarChart3,
  Info,
} from "lucide-react";
import { useState } from "react";
import { useStore, selectLevel, selectEarnedXP, selectOverallProgress, selectPhaseProgress, selectCareerProgress, selectCareerReadinessScore } from "@/lib/store";
import { GlassCard, GlassButton, ProgressBar, ProgressRing } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import { LANGUAGE_MAP, CAREER_MAP } from "@/lib/career-data";
import { getTodayChallenge } from "@/lib/daily-challenges-data";
import { openPrintableHtml, copyHtmlAsPng, downloadHtmlAsPng } from "@/lib/print-utils";

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

  // Section 11 — Compare Yourself (anonymous benchmarks)
  // Section 12 — Zero to Hero Journey modal state
  const [showJourney, setShowJourney] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  // Recent activity (last 7 days)
  const today = new Date();
  const recentDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { key, label: d.toLocaleDateString("en", { weekday: "short" }).slice(0, 2), count: state.activity[key] || 0 };
  });

  // Streak benchmark percentile (Section 11)
  const streakPercentile =
    streak >= 30 ? 5 : streak >= 14 ? 12 : streak >= 7 ? 22 : streak >= 3 ? 40 : 75;

  return (
    <div className="space-y-5">
      {/* Header + Share button */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {profile.name ? `Welcome back, ${profile.name.split(" ")[0]}! 🔥 ${streak}-day streak` : "Welcome to Launchpad"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {career ? `Training for: ${career.label}${profile.subPath ? ` (${profile.subPath})` : ""}` : "Set up your profile to get personalized content"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <GlassButton variant="ghost" size="sm" onClick={() => setShowJourney(true)}>
            <MapIcon className="h-3.5 w-3.5" /> My Journey
          </GlassButton>
          <GlassButton variant="ghost" size="sm" onClick={() => setShowShareCard(true)}>
            <Share2 className="h-3.5 w-3.5" /> Share
          </GlassButton>
        </div>
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
          sub={`of 25+`}
          color="text-violet-500"
        />
      </div>

      {/* Career Readiness box — Section 5.2: now uses 5-dimension score (matches Career tab) */}
      {career && (() => {
        const cr = selectCareerReadinessScore(state);
        return (
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Career Readiness · {career.label}
              </h2>
              <button
                onClick={() => setView("career")}
                className="text-xs text-primary hover:underline"
              >
                View Career →
              </button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold font-mono">{cr.overall}%</div>
              <div className="flex-1">
                <ProgressBar value={cr.overall} className="h-3" />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {cr.overall >= 100
                    ? "🏆 Career Master — claim your certificate!"
                    : cr.overall >= 90
                      ? "🎉 Interview-ready — consider applying!"
                      : cr.overall >= 71
                        ? "Almost job-ready — push to the end"
                        : cr.overall >= 41
                          ? "Making progress — keep going"
                          : "Just getting started — every lesson counts"}
                </p>
              </div>
            </div>
            {/* 5-dimension breakdown — matches Career tab */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Roadmap</div>
                <div className="font-mono font-semibold">{cr.roadmapProgress}%</div>
                <ProgressBar value={cr.roadmapProgress} className="h-1 mt-0.5" />
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Knowledge 📚</div>
                <div className="font-mono font-semibold">{cr.quizAverage}%</div>
                <ProgressBar value={cr.quizAverage} className="h-1 mt-0.5" />
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Projects 🔨</div>
                <div className="font-mono font-semibold">{cr.projectsCompleted}%</div>
                <ProgressBar value={cr.projectsCompleted} className="h-1 mt-0.5" />
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Challenges 🎯</div>
                <div className="font-mono font-semibold">{cr.challengeScore}%</div>
                <ProgressBar value={cr.challengeScore} className="h-1 mt-0.5" />
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Interviews 🎤</div>
                <div className="font-mono font-semibold">{cr.interviewScore === null ? "—" : `${cr.interviewScore}%`}</div>
                <ProgressBar value={cr.interviewScore ?? 0} className="h-1 mt-0.5" />
              </div>
            </div>
          </GlassCard>
        );
      })()}

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

      {/* Section 11 — How do others learn? (anonymous benchmark card) */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> How do others learn?
          </h2>
          <div className="relative group">
            <Info className="h-3 w-3 text-muted-foreground cursor-help" />
            <div className="absolute right-0 top-5 z-10 w-56 p-2 rounded-md bg-popover border border-border shadow-lg text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              These are estimated benchmarks to motivate you. Launchpad collects zero user data.
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-lg bg-foreground/5 p-2">
            <div className="text-[10px] uppercase text-muted-foreground">Most popular career</div>
            <div className="font-medium">Software Engineering (38%)</div>
          </div>
          <div className="rounded-lg bg-foreground/5 p-2">
            <div className="text-[10px] uppercase text-muted-foreground">Most popular 1st language</div>
            <div className="font-medium">Python (67%)</div>
          </div>
          <div className="rounded-lg bg-foreground/5 p-2">
            <div className="text-[10px] uppercase text-muted-foreground">Avg time to first phase</div>
            <div className="font-medium">12 days</div>
          </div>
          <div className="rounded-lg bg-foreground/5 p-2">
            <div className="text-[10px] uppercase text-muted-foreground">Avg daily study time</div>
            <div className="font-medium">45 minutes</div>
          </div>
          <div className="rounded-lg bg-foreground/5 p-2">
            <div className="text-[10px] uppercase text-muted-foreground">% who finish 1st cert</div>
            <div className="font-medium">34%</div>
          </div>
          <div className="rounded-lg bg-foreground/5 p-2">
            <div className="text-[10px] uppercase text-muted-foreground">% who stick past 30d</div>
            <div className="font-medium">28%</div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border/30 text-xs">
          <div className="font-medium mb-1">Your stats vs average:</div>
          <div className="space-y-1 text-muted-foreground">
            <div>Streak: 🔥 {streak} days {streakPercentile <= 50 ? `(top ${streakPercentile}% of learners 🎉)` : `(bottom ${100 - streakPercentile}% — keep going!)`}</div>
            <div>Roadmap: {overall.pct}% {overall.pct >= 50 ? "(above average ✅)" : "(climbing — keep pushing)"}</div>
          </div>
        </div>
      </GlassCard>

      {/* Section 12 — Zero to Hero Journey modal */}
      {showJourney && <JourneyTimelineModal onClose={() => setShowJourney(false)} />}

      {/* Section 8 — Shareable Progress Card modal */}
      {showShareCard && <ShareProgressCardModal onClose={() => setShowShareCard(false)} />}
    </div>
  );
}

// ============================================================
// JourneyTimelineModal — Section 12: Zero to Hero Visual Journey
// ============================================================
function JourneyTimelineModal({ onClose }: { onClose: () => void }) {
  const state = useStore((s) => s.state);
  const setView = useStore((s) => s.setView);

  // Build milestones from user's activity
  const milestones: { date: string; label: string; description: string; icon: string }[] = [];

  if (state.profile.startDate) {
    milestones.push({
      date: state.profile.startDate,
      label: "Started Launchpad",
      description: `Chose: ${state.roadmap?.careerLabel ?? "Developer"}`,
      icon: "🚀",
    });
  }
  // First lesson complete
  const firstLesson = Object.values(state.lessonProgress)
    .filter((p) => p.status === "complete" && p.completedAt)
    .sort((a, b) => (a.completedAt ?? "").localeCompare(b.completedAt ?? ""))[0];
  if (firstLesson) {
    milestones.push({
      date: firstLesson.completedAt!,
      label: "First lesson complete",
      description: "You completed your first lesson. Great start!",
      icon: "📖",
    });
  }
  // First badge
  const firstBadge = state.badges.filter((b) => b.unlockedAt).sort((a, b) => (a.unlockedAt ?? "").localeCompare(b.unlockedAt ?? ""))[0];
  if (firstBadge) {
    milestones.push({
      date: firstBadge.unlockedAt!,
      label: `Badge: ${firstBadge.title}`,
      description: firstBadge.description,
      icon: firstBadge.icon,
    });
  }
  // 7-day streak
  if (state.streak.longest >= 7) {
    milestones.push({
      date: new Date(Date.now() - state.streak.longest * 86400000).toISOString(),
      label: "7-day streak",
      description: "Hit a week of daily coding — Week Warrior badge unlocked.",
      icon: "⚔️",
    });
  }
  // First certificate
  const firstCert = Object.values(state.certificates).sort((a, b) => a.issuedAt.localeCompare(b.issuedAt))[0];
  if (firstCert) {
    milestones.push({
      date: firstCert.issuedAt,
      label: `Certificate: ${firstCert.trackName}`,
      description: "Completed an entire language track. Major milestone!",
      icon: "🎓",
    });
  }
  // First project shipped
  const firstProject = state.projects.filter((p) => p.status === "shipped" && p.shippedAt).sort((a, b) => (a.shippedAt ?? "").localeCompare(b.shippedAt ?? ""))[0];
  if (firstProject) {
    milestones.push({
      date: firstProject.shippedAt!,
      label: "First project shipped",
      description: "You shipped your first project — portfolio builder.",
      icon: "📦",
    });
  }
  // Career Master Certificate
  if (state.careerCertificate) {
    milestones.push({
      date: state.careerCertificate.issuedAt,
      label: "Career Master Certificate",
      description: "Reached 100% career readiness. Job-ready!",
      icon: "🏆",
    });
  }

  // Sort by date ascending
  milestones.sort((a, b) => a.date.localeCompare(b.date));

  // Summary stats
  const completedLessons = Object.values(state.lessonProgress).filter((p) => p.status === "complete").length;
  const shippedProjects = state.projects.filter((p) => p.status === "shipped").length;
  const daysOnLaunchpad = state.profile.startDate
    ? Math.max(1, Math.floor((Date.now() - new Date(state.profile.startDate).getTime()) / 86400000))
    : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="max-w-2xl w-full max-h-[90vh] bg-card rounded-xl shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">🚀 Zero to Hero — Your Learning Journey</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {daysOnLaunchpad} days on Launchpad · {completedLessons} lessons completed · {shippedProjects} projects built
            </p>
          </div>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {milestones.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              <p>No milestones yet — complete your first lesson to start your journey!</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical teal gradient line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 via-violet-500 to-amber-500" />

              <ol className="space-y-6">
                {milestones.map((m, i) => {
                  const isLast = i === milestones.length - 1;
                  return (
                    <li key={i} className="relative pl-12">
                      {/* Glowing dot */}
                      <div className={cn(
                        "absolute left-0 top-0 h-8 w-8 rounded-full flex items-center justify-center text-sm shadow-lg",
                        isLast
                          ? "bg-gradient-to-br from-teal-400 to-violet-500 ring-4 ring-teal-500/30 animate-pulse"
                          : "bg-gradient-to-br from-teal-500/80 to-violet-500/80",
                      )}>
                        {m.icon}
                      </div>
                      <div className="bg-foreground/5 rounded-lg p-3">
                        <div className="text-[10px] font-mono text-muted-foreground">
                          {new Date(m.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </div>
                        <div className="text-sm font-semibold mt-0.5">{m.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">{m.description}</div>
                      </div>
                    </li>
                  );
                })}
                {/* Today marker */}
                <li className="relative pl-12">
                  <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-foreground/10 border-2 border-primary animate-pulse" />
                  <div className="bg-primary/5 rounded-lg p-3 border border-primary/30">
                    <div className="text-[10px] font-mono text-primary">Today</div>
                    <div className="text-sm font-semibold mt-0.5">You are here 📍</div>
                    <div className="text-xs text-muted-foreground mt-1">Keep going — your next milestone is just ahead.</div>
                  </div>
                </li>
              </ol>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border/60">
          <GlassButton
            variant="primary"
            className="w-full"
            onClick={() => { onClose(); setView("roadmap"); }}
          >
            What&apos;s next? View Roadmap →
          </GlassButton>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ShareProgressCardModal — Section 8: Shareable Progress Card
// Provides 3 export options:
//   - Download PNG (instant rasterized image)
//   - Copy to Clipboard (PNG via Clipboard API)
//   - Open Printable Page (browser Print → Save as PDF)
// No auto-print — user picks the option they want.
// ============================================================
function ShareProgressCardModal({ onClose }: { onClose: () => void }) {
  const state = useStore((s) => s.state);
  const profile = state.profile;
  const roadmap = state.roadmap;
  const overall = selectOverallProgress(state);
  const streak = state.streak.current;
  const badgesCount = state.badges.filter((b) => b.unlockedAt).length;
  const careerLabel = roadmap?.careerLabel ?? "Developer";
  const [busy, setBusy] = useState<null | "png" | "clipboard" | "pdf">(null);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  // Build the inner HTML for the share card (without <html>/<head>/<body>
  // wrappers — so we can reuse it both for the printable page and the
  // PNG rasterizer).
  const cardInnerHtml = buildShareCardInnerHtml({
    name: profile.name || "Learner",
    careerLabel,
    overallPct: overall.pct,
    overallCompleted: overall.completed,
    overallTotal: overall.total,
    streak,
    badgesCount,
    languageIds: roadmap?.languageIds ?? [],
  });

  const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Launchpad Progress — ${profile.name || "Learner"}</title>
<style>${SHARE_CARD_CSS}</style></head><body>${cardInnerHtml}</body></html>`;

  const handlePng = async () => {
    setBusy("png"); setStatus(null);
    const r = await downloadHtmlAsPng(cardInnerHtml, `launchpad-progress-${(profile.name || "learner").replace(/\s+/g, "-").toLowerCase()}`, { width: 1200, height: 675 });
    setBusy(null);
    setStatus({ ok: r.ok, msg: r.ok ? "PNG downloaded." : `Failed: ${r.error}` });
    if (r.ok) markShared();
  };

  const handleCopyClipboard = async () => {
    setBusy("clipboard"); setStatus(null);
    const r = await copyHtmlAsPng(cardInnerHtml, { width: 1200, height: 675 });
    setBusy(null);
    setStatus({
      ok: r.ok,
      msg: r.ok
        ? "Image copied to clipboard. Paste into your post (Ctrl/⌘+V)."
        : `Clipboard unavailable: ${r.error}`,
    });
    if (r.ok) markShared();
  };

  const handlePdf = () => {
    setBusy("pdf");
    const ok = openPrintableHtml(fullHtml, {
      filename: `launchpad-progress-${(profile.name || "learner").replace(/\s+/g, "-").toLowerCase()}`,
      title: "Launchpad Progress Card",
    });
    setBusy(null);
    setStatus({
      ok,
      msg: ok
        ? "Opened in a new tab — click Download Now to save as PDF."
        : "Popup blocked — downloaded the HTML file instead. Open it locally to print.",
    });
    markShared();
  };

  const markShared = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("launchpad:progress-shared", "1");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-card-title"
    >
      <div
        className="max-w-md w-full bg-card rounded-xl shadow-2xl p-5 overflow-hidden border border-border/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 id="share-card-title" className="text-sm font-semibold">📤 Share My Progress</h3>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground p-1 rounded" aria-label="Close">✕</button>
        </div>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Generate a beautiful 1200×675 shareable card for Twitter/X, LinkedIn, or Instagram. Pick the format you need:
        </p>

        {/* Card preview (mini) */}
        <div className="rounded-lg p-4 mb-4 text-white text-xs overflow-hidden" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%)" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-sm bg-gradient-to-r from-teal-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">🚀 Launchpad</div>
            <div className="opacity-70 text-[10px]">{profile.name || "Learner"}</div>
          </div>
          <div className="opacity-80 text-[10px] mb-1">Career: {careerLabel}</div>
          <div className="opacity-80 text-[10px] mb-1">Roadmap: {overall.pct}% complete · 🔥 {streak}d · {badgesCount} badges</div>
          <div className="opacity-60 text-[10px] mt-2">Learning. Building. Growing.</div>
          <div className="opacity-40 text-[9px] font-mono mt-1">launchpad--pi.vercel.app</div>
        </div>

        {/* 3 export buttons */}
        <div className="space-y-2">
          <GlassButton variant="primary" className="w-full justify-center" onClick={handlePng} disabled={busy !== null}>
            <Share2 className="h-3.5 w-3.5" /> {busy === "png" ? "Rendering PNG…" : "Download as PNG image"}
          </GlassButton>
          <GlassButton variant="ghost" className="w-full justify-center" onClick={handleCopyClipboard} disabled={busy !== null}>
            <Share2 className="h-3.5 w-3.5" /> {busy === "clipboard" ? "Copying…" : "Copy to clipboard (PNG)"}
          </GlassButton>
          <GlassButton variant="ghost" className="w-full justify-center" onClick={handlePdf} disabled={busy !== null}>
            <Share2 className="h-3.5 w-3.5" /> {busy === "pdf" ? "Opening…" : "Open printable page (Save as PDF)"}
          </GlassButton>
        </div>

        {status && (
          <div className={cn(
            "mt-3 rounded-md p-2 text-xs",
            status.ok ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30",
          )} role="status">
            {status.ok ? "✅ " : "⚠️ "}{status.msg}
          </div>
        )}

        <p className="text-[10px] text-muted-foreground text-center mt-3">
          PNG / clipboard best for social posts. PDF best for keeping a record.
        </p>
      </div>
    </div>
  );
}

// Shared CSS for the share card (used by both PNG rasterizer and printable page)
const SHARE_CARD_CSS = `
  @page { size: 1200px 675px; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 100%; min-height: 100vh;
    background: #0a0a0a;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .card {
    width: 1200px; height: 675px;
    background:
      radial-gradient(circle at 15% 20%, rgba(45, 212, 191, 0.18) 0%, transparent 40%),
      radial-gradient(circle at 85% 75%, rgba(232, 121, 249, 0.15) 0%, transparent 45%),
      radial-gradient(circle at 50% 50%, rgba(252, 211, 77, 0.06) 0%, transparent 60%),
      linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%);
    color: white;
    padding: 56px 64px;
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    box-shadow: 0 25px 80px rgba(0,0,0,0.5);
    display: flex; flex-direction: column;
  }
  .card::before {
    content: ""; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; position: relative; z-index: 1; }
  .brand { display: flex; align-items: center; gap: 14px; }
  .brand-logo {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, #2DD4BF 0%, #E879F9 50%, #FCD34D 100%);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
    box-shadow: 0 8px 24px rgba(45, 212, 191, 0.3);
  }
  .brand-text {
    font-size: 32px; font-weight: 800; letter-spacing: -1px;
    background: linear-gradient(135deg, #2DD4BF 0%, #E879F9 50%, #FCD34D 100%);
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .user-block { text-align: right; }
  .user-name { font-size: 18px; font-weight: 600; opacity: 0.95; }
  .user-meta { font-size: 12px; opacity: 0.6; margin-top: 2px; }
  .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); margin: 0 0 28px; position: relative; z-index: 1; }
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 32px; position: relative; z-index: 1; flex: 1; }
  .stat { display: flex; flex-direction: column; gap: 6px; }
  .stat-label { font-size: 11px; opacity: 0.55; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 600; }
  .stat-value { font-size: 22px; font-weight: 700; line-height: 1.1; }
  .stat-value .accent { color: #2DD4BF; }
  .stat-value .accent-2 { color: #E879F9; }
  .stat-value .accent-3 { color: #FCD34D; }
  .progress-row { display: flex; align-items: center; gap: 12px; }
  .progress-bar { flex: 1; height: 10px; background: rgba(255,255,255,0.08); border-radius: 5px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, #2DD4BF 0%, #E879F9 100%); border-radius: 5px; box-shadow: 0 0 16px rgba(45, 212, 191, 0.5); }
  .progress-pct { font-size: 22px; font-weight: 700; min-width: 70px; }
  .lang-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; }
  .lang-chip { font-size: 12px; padding: 4px 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; font-weight: 500; }
  .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); position: relative; z-index: 1; }
  .tagline { font-size: 14px; opacity: 0.7; font-style: italic; }
  .url { font-size: 12px; opacity: 0.5; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.5px; }
  @media screen { body { background: #0a0a0a; } }
  @media print { body { background: white; padding: 0; } .card { box-shadow: none; border-radius: 0; } }
`;

function buildShareCardInnerHtml(opts: {
  name: string;
  careerLabel: string;
  overallPct: number;
  overallCompleted: number;
  overallTotal: number;
  streak: number;
  badgesCount: number;
  languageIds: string[];
}): string {
  const langChipsHtml = opts.languageIds.slice(0, 6).map(id => {
    const lang = LANGUAGE_MAP[id];
    return `<span class="lang-chip">${lang?.icon ?? "📘"} ${lang?.name ?? id}</span>`;
  }).join("");
  return `<div class="card">
    <div class="header">
      <div class="brand">
        <div class="brand-logo">🚀</div>
        <div class="brand-text">Launchpad</div>
      </div>
      <div class="user-block">
        <div class="user-name">${escapeHtmlAttr(opts.name)}</div>
        <div class="user-meta">${escapeHtmlAttr(opts.careerLabel)}</div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="stats-grid">
      <div class="stat">
        <div class="stat-label">Roadmap Progress</div>
        <div class="progress-row">
          <div class="progress-bar"><div class="progress-fill" style="width: ${opts.overallPct}%"></div></div>
          <div class="progress-pct"><span class="accent">${opts.overallPct}%</span></div>
        </div>
      </div>
      <div class="stat">
        <div class="stat-label">Daily Streak</div>
        <div class="stat-value">🔥 <span class="accent-2">${opts.streak}</span> days</div>
      </div>
      <div class="stat">
        <div class="stat-label">Badges Earned</div>
        <div class="stat-value">🏆 <span class="accent-3">${opts.badgesCount}</span></div>
      </div>
      <div class="stat">
        <div class="stat-label">Tasks Completed</div>
        <div class="stat-value">✅ <span class="accent">${opts.overallCompleted}</span> <span style="opacity:0.5; font-size:14px;">/ ${opts.overallTotal}</span></div>
      </div>
      <div class="stat" style="grid-column: 1 / -1;">
        <div class="stat-label">Languages in Plan</div>
        <div class="lang-chips">${langChipsHtml}</div>
      </div>
    </div>
    <div class="footer">
      <div class="tagline">Learning. Building. Growing.</div>
      <div class="url">launchpad--pi.vercel.app</div>
    </div>
  </div>`;
}

function escapeHtmlAttr(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
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
