"use client";

import {
  Rocket,
  Github,
  FileText,
  Code2,
  Award,
  Star,
  Briefcase,
  Brain,
  ExternalLink,
  TrendingUp,
  Target,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useStore, selectPhaseProgress, selectOverallProgress } from "@/lib/store";
import { GlassCard, GlassButton, ProgressBar } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import { CAREER_MAP, LANGUAGE_MAP } from "@/lib/career-data";

export function CareerView() {
  const state = useStore((s) => s.state);
  const roadmap = state.roadmap;
  const profile = state.profile;
  const setView = useStore((s) => s.setView);

  if (!roadmap) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-sm text-muted-foreground">Complete onboarding to see your career path.</p>
      </GlassCard>
    );
  }

  const career = profile.careerId ? CAREER_MAP[profile.careerId] : null;
  const overall = selectOverallProgress(state);

  // Career readiness score (based on phase completion + lessons + projects)
  const phaseScore = overall.pct;
  const lessonProgress = Object.values(state.lessonProgress).filter((p) => p.status === "complete").length;
  const lessonScore = Math.min(100, (lessonProgress / 30) * 100);
  const projectScore = Math.min(100, state.projects.filter((p) => p.status === "shipped").length * 33);
  const readiness = Math.round((phaseScore + lessonScore + projectScore) / 3);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Career</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your personalized path to becoming a {career?.label ?? "developer"}.
        </p>
      </div>

      {/* Career summary */}
      {career && (
        <GlassCard className="p-5">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-500 to-violet-500 flex items-center justify-center text-2xl shrink-0">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{career.label}</h2>
              <p className="text-xs text-muted-foreground italic">{career.tagline}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{career.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <Stat label="Demand" value={`${career.demand}/5`} />
            <Stat label="Salary" value={career.salaryRange} />
            <Stat label="Skills" value={`${career.skills.length}+`} />
            <Stat label="Languages" value={`${career.recommendedLanguages.length}+`} />
          </div>
        </GlassCard>
      )}

      {/* Readiness score */}
      <GlassCard className="p-5">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Target className="h-4 w-4" /> Career readiness
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl font-bold font-mono">{readiness}%</div>
          <div className="flex-1">
            <ProgressBar value={readiness} className="h-3" />
            <p className="text-[10px] text-muted-foreground mt-1">
              {readiness < 25 ? "Just getting started — keep going!" :
               readiness < 50 ? "Making solid progress" :
               readiness < 75 ? "Past the midpoint — you're doing great" :
               readiness < 100 ? "Almost job-ready — push to the end" :
               "Job-ready — time to apply!"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Roadmap</div>
            <div className="font-mono font-semibold">{Math.round(phaseScore)}%</div>
            <ProgressBar value={phaseScore} className="h-1 mt-1" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Lessons</div>
            <div className="font-mono font-semibold">{Math.round(lessonScore)}%</div>
            <ProgressBar value={lessonScore} className="h-1 mt-1" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Projects</div>
            <div className="font-mono font-semibold">{Math.round(projectScore)}%</div>
            <ProgressBar value={projectScore} className="h-1 mt-1" />
          </div>
        </div>
      </GlassCard>

      {/* Top companies */}
      {career && (
        <GlassCard className="p-5">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Star className="h-4 w-4" /> Top companies hiring {career.label}
          </h2>
          <div className="flex flex-wrap gap-2">
            {career.topCompanies.map((c) => (
              <span key={c} className="px-3 py-1.5 rounded-lg bg-foreground/5 border border-border/60 text-xs">
                {c}
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Resume & portfolio checklist */}
      <GlassCard className="p-5">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4" /> Job-readiness checklist
        </h2>
        <div className="space-y-2">
          {[
            { label: "Complete Phase 1 (Foundations)", done: selectPhaseProgress(state, roadmap.phases[0]?.id ?? "").pct === 100 },
            { label: "Complete Phase 3 (Building Blocks — first project shipped)", done: state.projects.some((p) => p.status === "shipped") },
            { label: "Complete 10 lessons in Learn tab", done: lessonProgress >= 10 },
            { label: "Complete 5 daily challenges", done: state.dailyChallenge.currentStreak >= 5 || state.dailyChallenge.lastChallengeDate !== undefined },
            { label: "Have a GitHub profile (add to projects)", done: state.projects.some((p) => p.repoUrl) },
            { label: "Ship a capstone project (Phase 6)", done: selectPhaseProgress(state, roadmap.phases[5]?.id ?? "").pct === 100 },
            { label: "Maintain a 7-day streak", done: state.streak.longest >= 7 },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              {item.done ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
              <span className={item.done ? "text-muted-foreground line-through" : ""}>{item.label}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Interview prep resources */}
      <GlassCard className="p-5">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Brain className="h-4 w-4" /> Interview prep resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { label: "LeetCode", url: "https://leetcode.com", desc: "Algorithm practice" },
            { label: "HackerRank", url: "https://hackerrank.com", desc: "Skill assessments" },
            { label: "pramp.com", url: "https://pramp.com", desc: "Mock interviews" },
            { label: "interviewing.io", url: "https://interviewing.io", desc: "Real mock interviews" },
            { label: "Tech Interview Handbook", url: "https://www.techinterviewhandbook.org/", desc: "Free comprehensive guide" },
            { label: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", desc: "System design prep" },
          ].map((r) => (
            <a
              key={r.label}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-lg border border-border/60 hover:bg-foreground/5 transition-colors"
            >
              <ExternalLink className="h-3 w-3 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium">{r.label}</div>
                <div className="text-[10px] text-muted-foreground truncate">{r.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </GlassCard>

      {/* CTA: start capstone */}
      <GlassCard className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Ready to ship your capstone?</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Phase 6 includes a capstone project — the centerpiece of your portfolio.
            </p>
          </div>
          <GlassButton variant="primary" size="sm" onClick={() => setView("roadmap")}>
            View roadmap
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-foreground/5 p-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-xs font-mono font-semibold mt-0.5">{value}</div>
    </div>
  );
}
