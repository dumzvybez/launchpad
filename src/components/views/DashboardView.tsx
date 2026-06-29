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

      {/* Career progress box (Section 5.2) — primary progress indicator */}
      {career && (() => {
        const cp = selectCareerProgress(state);
        return (
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Career progress · {career.label}
              </h2>
              <button
                onClick={() => setView("career")}
                className="text-xs text-primary hover:underline"
              >
                View Career →
              </button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold font-mono">{cp.overall}%</div>
              <div className="flex-1">
                <ProgressBar value={cp.overall} className="h-3" />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {cp.overall >= 100
                    ? "🎉 Career Master — claim your certificate!"
                    : cp.overall >= 75
                      ? "Almost job-ready — push to the end"
                      : cp.overall >= 50
                        ? "Past the midpoint — you're doing great"
                        : cp.overall >= 25
                          ? "Making solid progress"
                          : "Just getting started — keep going!"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Roadmap (40%)</div>
                <div className="font-mono font-semibold">{cp.roadmapPct}%</div>
                <ProgressBar value={cp.roadmapPct} className="h-1 mt-1" />
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Lessons (40%)</div>
                <div className="font-mono font-semibold">{cp.lessonsPct}%</div>
                <ProgressBar value={cp.lessonsPct} className="h-1 mt-1" />
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Projects (20%)</div>
                <div className="font-mono font-semibold">{cp.projectsPct}%</div>
                <ProgressBar value={cp.projectsPct} className="h-1 mt-1" />
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
// Uses browser print to PDF instead of html2canvas (lighter, no extra dep)
// ============================================================
function ShareProgressCardModal({ onClose }: { onClose: () => void }) {
  const state = useStore((s) => s.state);
  const profile = state.profile;
  const roadmap = state.roadmap;
  const overall = selectOverallProgress(state);
  const streak = state.streak.current;
  const badgesCount = state.badges.filter((b) => b.unlockedAt).length;
  const careerLabel = roadmap?.careerLabel ?? "Developer";

  // Build language chips
  const langChips = (roadmap?.languageIds ?? []).slice(0, 5).map((id) => {
    const lang = LANGUAGE_MAP[id];
    return `${lang?.icon ?? "📘"} ${lang?.name ?? id} ✅`;
  }).join(" · ");

  const handleDownloadPNG = () => {
    // Open a new window with the card HTML and trigger print-to-PDF
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Launchpad Progress — ${profile.name || "Learner"}</title>
  <style>
    @page { size: 600px 360px; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
    .card {
      width: 600px; height: 360px;
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%);
      color: white;
      padding: 28px 32px;
      position: relative;
      overflow: hidden;
    }
    .card::before {
      content: ""; position: absolute; top: -50px; right: -50px;
      width: 200px; height: 200px;
      background: radial-gradient(circle, rgba(45, 212, 191, 0.15) 0%, transparent 70%);
    }
    .card::after {
      content: ""; position: absolute; bottom: -80px; left: -80px;
      width: 250px; height: 250px;
      background: radial-gradient(circle, rgba(232, 121, 249, 0.12) 0%, transparent 70%);
    }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; position: relative; z-index: 1; }
    .brand { display: flex; align-items: center; gap: 8px; }
    .brand-text {
      font-size: 22px; font-weight: 700; letter-spacing: -0.5px;
      background: linear-gradient(135deg, #2DD4BF 0%, #E879F9 50%, #FCD34D 100%);
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .user { font-size: 11px; opacity: 0.8; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); margin: 8px 0 14px; }
    .row { font-size: 13px; margin: 6px 0; position: relative; z-index: 1; }
    .row .label { opacity: 0.7; }
    .row .value { font-weight: 600; }
    .progress-bar { display: inline-block; width: 220px; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; vertical-align: middle; margin: 0 8px; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #2DD4BF, #E879F9); border-radius: 4px; }
    .tagline { font-size: 12px; opacity: 0.6; text-align: center; margin-top: 14px; position: relative; z-index: 1; }
    .url { font-size: 11px; opacity: 0.5; text-align: center; font-family: monospace; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="brand">
        <span style="font-size: 22px;">🚀</span>
        <span class="brand-text">Launchpad</span>
      </div>
      <div class="user">${profile.name || "Learner"}</div>
    </div>
    <div class="divider"></div>
    <div class="row"><span class="label">Career:</span> <span class="value">${careerLabel}</span></div>
    <div class="row">
      <span class="label">Roadmap:</span>
      <span class="progress-bar"><span class="progress-fill" style="width: ${overall.pct}%"></span></span>
      <span class="value">${overall.pct}% complete</span>
    </div>
    <div class="row"><span class="label">Languages:</span> <span class="value">${langChips || "—"}</span></div>
    <div class="row"><span class="label">Current streak:</span> <span class="value">🔥 ${streak} days</span></div>
    <div class="row"><span class="label">Badges earned:</span> <span class="value">${badgesCount}</span></div>
    <div class="divider"></div>
    <div class="tagline">Learning. Building. Growing.</div>
    <div class="url">launchpad--pi.vercel.app</div>
  </div>
  <script>
    window.onload = () => { setTimeout(() => window.print(), 300); };
  </script>
</body>
</html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="max-w-md w-full bg-card rounded-xl shadow-2xl p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">📤 Share My Progress</h3>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Generate a beautiful shareable card for Twitter/X, LinkedIn, or Instagram. Uses your browser&apos;s Print dialog → Save as PDF (or screenshot).
        </p>

        {/* Card preview (mini) */}
        <div className="rounded-lg p-4 mb-4 text-white text-xs" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%)" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-sm bg-gradient-to-r from-teal-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">🚀 Launchpad</div>
            <div className="opacity-70 text-[10px]">{profile.name || "Learner"}</div>
          </div>
          <div className="opacity-80 text-[10px] mb-1">Career: {careerLabel}</div>
          <div className="opacity-80 text-[10px] mb-1">Roadmap: {overall.pct}% complete · 🔥 {streak}d · {badgesCount} badges</div>
          <div className="opacity-60 text-[10px] mt-2">Learning. Building. Growing.</div>
          <div className="opacity-40 text-[9px] font-mono mt-1">launchpad--pi.vercel.app</div>
        </div>

        <GlassButton variant="primary" className="w-full" onClick={handleDownloadPNG}>
          <Share2 className="h-3.5 w-3.5" /> Generate Card (Print to PDF)
        </GlassButton>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          A new window opens with the card. Use your browser&apos;s &quot;Save as PDF&quot; or screenshot tool.
        </p>
      </div>
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
