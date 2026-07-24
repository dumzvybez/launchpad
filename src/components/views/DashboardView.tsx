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
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useStore, selectLevel, selectEarnedXP, selectOverallProgress, selectPhaseProgress, selectCareerProgress, selectCareerReadinessScore } from "@/lib/store";
import { GlassCard, GlassButton, ProgressBar, ProgressRing } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import { LANGUAGE_MAP, CAREER_MAP } from "@/lib/career-data";
import { getLessonByRef } from "@/lib/identity";
import { ALL_LANGUAGE_INFO } from "@/lib/lessons-meta";
import { getLessonsForTrack } from "@/lib/lessons-data";
// v5.85 fix (2.6): reverted to old import — importing the 21,000-line v2 file
// directly into DashboardView caused SSR timeout. Instead, we use the store's
// dailyChallengePool (which already has task IDs from v2) and look them up
// via a lazy import only on the client.
import { openPrintableHtml, copyHtmlAsPng, downloadHtmlAsPng } from "@/lib/print-utils";
import { CertificateHub } from "@/components/views/CertificateHub";
import { CareerReadinessCard } from "@/components/views/CareerReadinessCard";

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

  // v6.007 UX: Find the learner's most recent in-progress or next-up lesson.
  // Prioritizes: (1) lessons marked "in-progress", (2) the first not-complete
  // lesson in the first roadmap language that has progress. This powers the
  // "Continue lesson" card so lesson learners (not just roadmap-task learners)
  // see a clear re-entry point on the dashboard.
  const setLearnTabState = useStore((s) => s.setLearnTabState);
  const continueLesson = (() => {
    const userLangs = roadmap?.languageIds ?? [];
    if (userLangs.length === 0) return null;

    // 1. Any lesson explicitly marked "in-progress" (most recently started first).
    const inProgress = Object.entries(state.lessonProgress)
      .filter(([, p]) => p.status === "in-progress")
      .sort((a, b) => (b[1].startedAt ?? "").localeCompare(a[1].startedAt ?? ""));
    for (const [slug, prog] of inProgress) {
      const lesson = getLessonByRef(slug);
      if (lesson) return { lesson, progress: prog };
    }

    // 2. First not-complete lesson in the first language that has ANY progress.
    for (const lang of userLangs) {
      const trackLessons = getLessonsForTrack(lang);
      if (trackLessons.length === 0) continue;
      const hasAnyProgress = trackLessons.some((l) => state.lessonProgress[l.slug ?? l.id]);
      if (!hasAnyProgress) continue;
      const next = trackLessons.find((l) => state.lessonProgress[l.slug ?? l.id]?.status !== "complete");
      if (next) return { lesson: next, progress: undefined };
    }
    return null;
  })();

  // v5.85 fix (2.6): use the store's dailyChallengePool (populated from v2 during
  // onboarding) to show today's challenge. If the pool isn't loaded, show a fallback.
  const dailyChallengePool = useStore((s) => s.state.dailyChallengePool);
  const todayChallenge = (() => {
    if (dailyChallengePool && dailyChallengePool.length > 0) {
      const now = new Date();
      const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
      const taskId = dailyChallengePool[dayOfYear % dailyChallengePool.length];
      // We don't have the task details here (would need to import the 21K-line v2 file),
      // so we show a generic preview. The actual challenge details are in DailyChallengeView.
      return { title: "Today's Challenge", prompt: `Challenge #${taskId.slice(-4)} from your personalized pool. Click to start!` };
    }
    return { title: "Daily Challenge", prompt: "Complete onboarding to get personalized daily challenges." };
  })();
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

      {/* v5.927 (#1): Career Readiness — now uses the SHARED CareerReadinessCard
          component (same as the Career tab). One source of truth, no duplicate. */}
      {career && <CareerReadinessCard variant="compact" />}

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

      {/* v6.007 UX: Continue lesson — gives lesson-learners a one-click re-entry
          point to their most recent in-progress (or next-up) lesson. Shown when
          the user has lesson progress but may not have roadmap tasks. */}
      {continueLesson && (
        <GlassCard className="p-5 border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Continue your lesson
            </h2>
            <button
              onClick={() => {
                setLearnTabState({
                  selectedTrack: continueLesson.lesson.track,
                  selectedLessonId: continueLesson.lesson.id,
                  tab: "lesson",
                });
                setView("learn");
              }}
              className="text-xs text-primary hover:underline"
            >
              All lessons →
            </button>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-2xl shrink-0">
              {ALL_LANGUAGE_INFO[continueLesson.lesson.track]?.icon ?? "📘"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">
                {ALL_LANGUAGE_INFO[continueLesson.lesson.track]?.name ?? continueLesson.lesson.track}
                {continueLesson.progress?.status === "in-progress" && " · In progress"}
              </div>
              <h3 className="font-semibold text-sm mt-0.5">{continueLesson.lesson.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{continueLesson.lesson.description}</p>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground font-mono">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {continueLesson.lesson.estMinutes}m</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded capitalize",
                  continueLesson.lesson.difficulty === "beginner" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                  continueLesson.lesson.difficulty === "intermediate" && "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                  continueLesson.lesson.difficulty === "advanced" && "bg-rose-500/15 text-rose-600 dark:text-rose-400",
                )}>
                  {continueLesson.lesson.difficulty}
                </span>
                {continueLesson.lesson.quiz.length > 0 && (
                  <span>{continueLesson.lesson.quiz.length} quiz questions</span>
                )}
              </div>
            </div>
            <GlassButton
              variant="primary"
              size="sm"
              onClick={() => {
                setLearnTabState({
                  selectedTrack: continueLesson.lesson.track,
                  selectedLessonId: continueLesson.lesson.id,
                  tab: "lesson",
                });
                setView("learn");
              }}
            >
              Resume <ChevronRight className="h-3.5 w-3.5" />
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

      {/* v5.924: Certificate Hub — unified list of all earned certificates. */}
      <CertificateHub />

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

      {/* v5.85 fix (0.8): REMOVED "How do others learn?" section entirely.
          This section displayed fabricated/static benchmark data presented as
          if it reflected real aggregate user behavior. Removed per directive. */}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={onClose}>
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

  // v5.77 SECURITY fix: escape the user name in the <title> tag.
  const safeName = escapeHtmlAttr(profile.name || "Learner");
  const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Launchpad Progress — ${safeName}</title>
<style>${SHARE_CARD_CSS}</style></head><body>${cardInnerHtml}</body></html>`;

  const handlePng = async () => {
    setBusy("png"); setStatus(null);
    // v5.77 fix: sanitize filename to filesystem-safe characters.
    const safeFilename = (profile.name || "learner").replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").toLowerCase() || "learner";
    const r = await downloadHtmlAsPng(cardInnerHtml, `launchpad-progress-${safeFilename}`, { width: 1123, height: 794 });
    setBusy(null);
    setStatus({ ok: r.ok, msg: r.ok ? "PNG downloaded." : `Failed: ${r.error}` });
    if (r.ok) markShared();
  };

  const handleCopyClipboard = async () => {
    setBusy("clipboard"); setStatus(null);
    const r = await copyHtmlAsPng(cardInnerHtml, { width: 1123, height: 794 });
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
      // Wrap in try/catch — setItem throws in Safari private mode, when
      // quota is exceeded, or when storage is disabled. Previously an
      // unhandled throw here would surface as a promise rejection even
      // though the share itself succeeded.
      try {
        window.localStorage.setItem("launchpad:progress-shared", "1");
      } catch { /* ignore storage errors */ }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-hidden"
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
          Generate a beautiful A4-landscape shareable card for Twitter/X, LinkedIn, or Instagram. Pick the format you need:
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
          <div className="opacity-40 text-[9px] font-mono mt-1">launchpad--dev.vercel.app</div>
        </div>

        {/* v5.86 fix (C.1): REMOVED "Download as PNG" and "Copy to clipboard (PNG)" buttons.
            html-to-image could not reliably render glass-morphism/CSS-variable-heavy cards
            (produced blank/transparent images). The "Open printable page" (Save as PDF) option
            still works correctly via openPrintableHtml — that's a different code path that
            opens a new browser tab with the HTML, bypassing html-to-image entirely. */}
        <div className="space-y-2">
          <GlassButton variant="primary" className="w-full justify-center" onClick={handlePdf} disabled={busy !== null}>
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
          Open the printable page and use your browser&apos;s Save as PDF option.
        </p>
      </div>
    </div>
  );
}

// Shared CSS for the share card (used by both PNG rasterizer and printable page)
// v5.924 PDF FIX (Mode B + Mode D):
//   - Replaced non-standard `@page { size: 1200px 675px }` (which browsers
//     IGNORE in the print dialog — they use the user's default paper instead,
//     causing the fixed 1200px-wide card to overflow horizontally and split
//     into 2 pages). Now locked to `A4 landscape; margin: 0` and the card is
//     sized in mm to the A4 landscape printable area (297×210mm).
//   - Added `print-color-adjust: exact` so the dark gradient card background
//     and colored accents actually print (otherwise white text on white =
//     invisible card).
const SHARE_CARD_CSS = `
  @page { size: A4 landscape; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 100%; min-height: 100vh;
    background: #0a0a0a;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex; align-items: center; justify-content: center;
    padding: 0;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .card {
    width: 297mm; height: 210mm;
    background:
      radial-gradient(circle at 15% 20%, rgba(45, 212, 191, 0.18) 0%, transparent 40%),
      radial-gradient(circle at 85% 75%, rgba(232, 121, 249, 0.15) 0%, transparent 45%),
      radial-gradient(circle at 50% 50%, rgba(252, 211, 77, 0.06) 0%, transparent 60%),
      linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%);
    color: white;
    padding: 42px 50px;
    position: relative;
    overflow: hidden;
    border-radius: 0;
    display: flex; flex-direction: column;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
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
  .tagline { font-size: 14px; opacity: 0.85; font-style: italic; }
  .url { font-size: 12px; opacity: 0.75; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.5px; }
  @media screen { body { background: #0a0a0a; padding: 20px; } .card { border-radius: 16px; box-shadow: 0 25px 80px rgba(0,0,0,0.5); } }
  /* v5.924: keep the dark card background + print-color-adjust in print.
     Previously @media print set body{background:white} WITHOUT print-color-
     adjust → the gradient card bg was dropped → white text on white. */
  @media print {
    body { background: white; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .card { box-shadow: none; border-radius: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .stat-label { opacity: 0.8; }
    .url { opacity: 0.85; }
    .user-meta { opacity: 0.8; }
  }
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
  // v5.875 (HIGH-7): Escape ALL user/state-derived values before interpolating
  // into HTML. Previously, `id` (from roadmap.languageIds) was interpolated raw,
  // which allowed XSS via a crafted backup file with languageIds like
  // "<img src=x onerror=...>". Now ALL values are escaped.
  const langChipsHtml = opts.languageIds.slice(0, 6).map(id => {
    const lang = LANGUAGE_MAP[id];
    const icon = escapeHtmlAttr(lang?.icon ?? "📘");
    const name = escapeHtmlAttr(lang?.name ?? id);
    return `<span class="lang-chip">${icon} ${name}</span>`;
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
      <div class="url">launchpad--dev.vercel.app</div>
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
