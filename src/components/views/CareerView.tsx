"use client";

import { useState } from "react";
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
  Pencil,
  Download,
} from "lucide-react";
import { useStore, selectPhaseProgress, selectOverallProgress, selectCareerProgress, selectCareerReadinessScore } from "@/lib/store";
import { GlassCard, GlassButton, ProgressBar } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import { CAREER_MAP, LANGUAGE_MAP } from "@/lib/career-data";
import { ALL_LANGUAGE_INFO } from "@/lib/lessons-data";

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

  // Career Readiness Score per Section 5.1 of Prompt-2: 5 dimensions
  // (roadmap 25% / quizzes 25% / projects 20% / challenges 15% / interviews 15%)
  const readiness = selectCareerReadinessScore(state);
  const lessonProgress = Object.values(state.lessonProgress).filter((p) => p.status === "complete").length;

  // Career Master Certificate: unlocked at 100% readiness
  const careerCert = state.careerCertificate;
  const issueCareerCertificate = useStore((s) => s.issueCareerCertificate);
  const updateCareerCertificateName = useStore((s) => s.updateCareerCertificateName);

  // Color thresholds per Section 5.2
  const readinessColor =
    readiness.overall >= 90 ? "from-amber-400 to-yellow-500" :  // gold with glow
    readiness.overall >= 71 ? "from-teal-400 to-emerald-500" :  // teal
    readiness.overall >= 41 ? "from-amber-500 to-orange-500" :  // amber
    "from-rose-500 to-red-500";                                  // red
  const readinessGlow = readiness.overall >= 90 ? "shadow-lg shadow-amber-500/30" : "";

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

      {/* Readiness score — Section 5.2: 5 dimensions, color thresholds */}
      <GlassCard className={cn("p-5", readinessGlow)}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Target className="h-4 w-4" /> Career Readiness Score
          </h2>
          <span className="text-[10px] text-muted-foreground font-mono">
            weighted: roadmap {Math.round(readiness.weights.roadmap * 100)}% · quiz {Math.round(readiness.weights.quiz * 100)}% · projects {Math.round(readiness.weights.projects * 100)}% · challenges {Math.round(readiness.weights.challenges * 100)}%{readiness.weights.interviews > 0 ? ` · interviews ${Math.round(readiness.weights.interviews * 100)}%` : ""}
          </span>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className={cn("text-4xl font-bold font-mono bg-gradient-to-br bg-clip-text text-transparent", readinessColor)}>
            {readiness.overall}%
          </div>
          <div className="flex-1">
            <ProgressBar value={readiness.overall} className="h-3" />
            <p className="text-[10px] text-muted-foreground mt-1">
              {readiness.overall >= 100
                ? "🎉 You're interview-ready! Consider applying to your first role."
                : readiness.overall >= 90
                  ? "🎉 You're interview-ready! Consider applying to your first role."
                  : readiness.overall >= 71
                    ? "Almost job-ready — push to the end"
                    : readiness.overall >= 41
                      ? "Making progress — focus on the lowest dimension below"
                      : "Just getting started — keep going!"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <div className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">Roadmap</div>
            <div className="font-mono font-semibold">{readiness.roadmapProgress}%</div>
            <ProgressBar value={readiness.roadmapProgress} className="h-1 mt-1" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">Knowledge 📚</div>
            <div className="font-mono font-semibold">{readiness.quizAverage}%</div>
            <ProgressBar value={readiness.quizAverage} className="h-1 mt-1" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">Projects 🔨</div>
            <div className="font-mono font-semibold">{readiness.projectsCompleted}%</div>
            <ProgressBar value={readiness.projectsCompleted} className="h-1 mt-1" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">Challenges 🎯</div>
            <div className="font-mono font-semibold">{readiness.challengeScore}%</div>
            <ProgressBar value={readiness.challengeScore} className="h-1 mt-1" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">Interviews 🎤</div>
            <div className="font-mono font-semibold">
              {readiness.interviewScore === null ? "—" : `${readiness.interviewScore}%`}
            </div>
            <ProgressBar value={readiness.interviewScore ?? 0} className="h-1 mt-1" />
          </div>
        </div>

        {/* 90%+ banner per Section 5.2 */}
        {readiness.overall >= 90 && readiness.overall < 100 && (
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300">
            🎉 You&apos;re interview-ready! Consider applying to your first role.
          </div>
        )}
        {readiness.overall >= 100 && (
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/15 border border-amber-500/40 text-xs text-amber-700 dark:text-amber-300 font-medium">
            🏆 100% Career Readiness! Your Career Master Certificate is unlocked below.
          </div>
        )}

        {/* Suggested Next Steps modal trigger */}
        <SuggestedNextSteps readiness={readiness} />
      </GlassCard>

      {/* Build My Resume button — Section 6.2 */}
      <GlassCard className="p-5 bg-gradient-to-br from-teal-500/10 to-violet-500/10 border-teal-500/30">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-violet-500 flex items-center justify-center shrink-0">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Build My Resume</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Auto-generate a professional resume PDF from your Launchpad progress — completed tracks, projects, certificates, and badges.
            </p>
          </div>
          <ResumeBuilderButton />
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

      {/* Career Master Certificate — gold, unlocked at 100% readiness */}
      {readiness.overall >= 100 && career && (
        <GlassCard className="p-6 bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-orange-500/15 border-amber-500/40">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
              <Award className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold">Career Master Certificate</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold uppercase">Unlocked</span>
              </div>
              <p className="text-sm text-muted-foreground italic mb-2">{career.label} — Mastery Achieved</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                You have reached 100% career readiness — completing {readiness.roadmapProgress}% of roadmap tasks, {lessonProgress} lessons, and {state.projects.filter((p) => p.status === "shipped").length} shipped projects. Claim your gold Career Master Certificate (ID prefix LP-CAREER-) and add it to your portfolio.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <GlassButton
                  variant="primary"
                  onClick={() => {
                    const defaultName = careerCert?.name ?? profile.name ?? "Learner";
                    const name = window.prompt("Edit your name for the Career Master Certificate:", defaultName);
                    if (name === null) return;
                    const finalName = name.trim() || "Learner";
                    if (careerCert) {
                      updateCareerCertificateName(finalName);
                    } else {
                      issueCareerCertificate(career.label, finalName);
                    }
                    generateCareerCertificate(finalName, career.label, roadmap.languageIds, roadmap.totalHours);
                  }}
                >
                  <Download className="h-4 w-4" /> Download Career Certificate (PDF)
                </GlassButton>
                {careerCert && (
                  <GlassButton
                    variant="ghost"
                    onClick={() => {
                      const name = window.prompt("Edit your name on this certificate:", careerCert.name);
                      if (name === null) return;
                      const finalName = name.trim() || "Learner";
                      updateCareerCertificateName(finalName);
                      generateCareerCertificate(finalName, career.label, roadmap.languageIds, roadmap.totalHours);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit name
                  </GlassButton>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* CTA: start capstone */}
      <GlassCard className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Ready to ship your capstone?</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Phase {roadmap.phases.length} includes a capstone project — the centerpiece of your portfolio.
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

// ============================================================
// SuggestedNextSteps modal — Section 5.3
// Personalized suggestions based on which dimension is lowest
// ============================================================
function SuggestedNextSteps({ readiness }: {
  readiness: ReturnType<typeof selectCareerReadinessScore>;
}) {
  const [open, setOpen] = useState(false);
  const setView = useStore((s) => s.setView);

  // Build suggestions based on which dimension is lowest
  const dims = [
    { key: "roadmap", label: "Roadmap", value: readiness.roadmapProgress, suggestion: "Complete the next roadmap task in your current phase to boost roadmap progress.", cta: "Go to Roadmap", view: "roadmap" as const },
    { key: "quiz", label: "Knowledge", value: readiness.quizAverage, suggestion: "Retake quizzes from completed lessons — your average quiz score is below 75%.", cta: "Go to Learn", view: "learn" as const },
    { key: "projects", label: "Projects", value: readiness.projectsCompleted, suggestion: "Ship a project to boost project completion. Pick one from the Projects tab and follow the step-by-step instructions.", cta: "Go to Projects", view: "projects" as const },
    { key: "challenges", label: "Challenges", value: readiness.challengeScore, suggestion: "Complete today's daily challenge to extend your streak — streaks boost this score.", cta: "Go to Daily Challenge", view: "daily-challenge" as const },
    { key: "interviews", label: "Interviews", value: readiness.interviewScore ?? 0, suggestion: "Run a 10-question mock interview to practice your knowledge. Interview Mode is in the AI Tutor tab.", cta: "Open AI Tutor", view: "ai-tutor" as const },
  ];
  const sorted = [...dims].sort((a, b) => a.value - b.value);
  const lowestThree = sorted.slice(0, 3);

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(true)}
        className="text-[11px] text-primary hover:underline"
      >
        View Suggested Next Steps →
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="max-w-md w-full bg-card rounded-xl shadow-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Suggested Next Steps</h3>
              <button onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <p className="text-[11px] text-muted-foreground mb-4">
              Personalized suggestions based on your lowest Career Readiness dimensions.
            </p>
            <div className="space-y-3">
              {lowestThree.map((d, i) => (
                <div key={d.key} className="rounded-lg border border-border/60 p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-xs font-medium">#{i + 1} · {d.label}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{d.value}%</div>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{d.suggestion}</p>
                  <button
                    onClick={() => { setView(d.view); setOpen(false); }}
                    className="text-[10px] px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {d.cta} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ResumeBuilderButton — Section 6 (Resume Auto-Builder)
// Generates a printable resume PDF in a new window using browser print
// ============================================================
function ResumeBuilderButton() {
  const state = useStore.getState().state;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(state.profile.name || "");
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [objective, setObjective] = useState(`Aspiring ${state.profile.careerId ? (useStore.getState().state.roadmap?.careerLabel ?? "Developer") : "Developer"}`);
  const [includeQuizScores, setIncludeQuizScores] = useState(true);
  const [includeBadges, setIncludeBadges] = useState(true);
  const [includeBranding, setIncludeBranding] = useState(true);

  const handleGenerate = () => {
    setOpen(false);
    // Set badge-tracking flag per Section 13.1
    if (typeof window !== "undefined") {
      window.localStorage.setItem("launchpad:resume-built", "1");
    }
    generateResumePDF({
      name: name || "Learner",
      email,
      github,
      linkedin,
      objective,
      includeQuizScores,
      includeBadges,
      includeBranding,
    });
  };

  return (
    <>
      <GlassButton variant="primary" size="sm" onClick={() => setOpen(true)}>
        <FileText className="h-3.5 w-3.5" /> Build My Resume
      </GlassButton>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="max-w-lg w-full max-h-[85vh] overflow-y-auto bg-card rounded-xl shadow-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Customize Your Resume</h3>
              <button onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <p className="text-[11px] text-muted-foreground mb-4">
              We&apos;ll auto-populate the resume from your Launchpad progress. Edit the fields below, then click Download.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-0.5 px-2 py-1.5 rounded-md bg-foreground/5 border border-border/60 text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium">Email (optional)</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full mt-0.5 px-2 py-1.5 rounded-md bg-foreground/5 border border-border/60 text-xs" />
                </div>
                <div>
                  <label className="text-[11px] font-medium">GitHub URL (optional)</label>
                  <input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="github.com/username" className="w-full mt-0.5 px-2 py-1.5 rounded-md bg-foreground/5 border border-border/60 text-xs" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium">LinkedIn URL (optional)</label>
                <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/username" className="w-full mt-0.5 px-2 py-1.5 rounded-md bg-foreground/5 border border-border/60 text-xs" />
              </div>
              <div>
                <label className="text-[11px] font-medium">Career Objective</label>
                <textarea value={objective} onChange={(e) => setObjective(e.target.value)} rows={3} className="w-full mt-0.5 px-2 py-1.5 rounded-md bg-foreground/5 border border-border/60 text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={includeQuizScores} onChange={(e) => setIncludeQuizScores(e.target.checked)} className="h-3 w-3" />
                  Include quiz scores
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={includeBadges} onChange={(e) => setIncludeBadges(e.target.checked)} className="h-3 w-3" />
                  Include achievement badges
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={includeBranding} onChange={(e) => setIncludeBranding(e.target.checked)} className="h-3 w-3" />
                  Include Launchpad branding in footer
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button onClick={handleGenerate} className="flex-1 px-3 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">
                  Download PDF
                </button>
                <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-md border border-border/60 text-xs hover:bg-foreground/5">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * generateResumePDF — opens a new window with a print-optimized resume HTML.
 * User then uses browser's "Save as PDF" to download.
 *
 * Per Section 6.4: pulls from on-device Launchpad data only.
 */
function generateResumePDF(opts: {
  name: string;
  email: string;
  github: string;
  linkedin: string;
  objective: string;
  includeQuizScores: boolean;
  includeBadges: boolean;
  includeBranding: boolean;
}) {
  const state = useStore.getState().state;
  const profile = state.profile;
  const roadmap = state.roadmap;
  const lessonProgress = state.lessonProgress;
  const certificates = state.certificates;
  const careerCert = state.careerCertificate;
  const projects = state.projects.filter((p) => p.status === "shipped");
  const badges = state.badges.filter((b) => b.unlockedAt);
  const streak = state.streak;

  // Compute language proficiency from quiz scores
  const langs: string[] = roadmap?.languageIds ?? [];
  const langProficiency = langs.map((id) => {
    const name = ALL_LANGUAGE_INFO[id]?.name ?? id;
    const lessons = Object.keys(lessonProgress).filter((lid) => lid.startsWith(`${id}-`));
    const completed = lessons.filter((lid) => lessonProgress[lid]?.status === "complete").length;
    const scores: number[] = [];
    for (const lid of lessons) {
      const s = lessonProgress[lid]?.bestQuizScore;
      if (s !== undefined) scores.push(s);
    }
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const level = avg >= 85 ? "Advanced" : avg >= 65 ? "Intermediate" : avg >= 40 ? "Beginner" : "In Progress";
    return { name, level, completed, avg };
  });

  // Projects list
  const projectsHtml = projects.length > 0
    ? projects.map((p) => {
        const projTitle = p.repoUrl ? p.repoUrl.split("/").pop() ?? p.projectId : p.projectId;
        return `<li><strong>${escapeHtml(projTitle)}</strong> — ${p.notes ? escapeHtml(p.notes) : "Shipped project"} ${p.repoUrl ? `· <a href="${escapeHtml(p.repoUrl)}">${escapeHtml(p.repoUrl)}</a>` : ""}</li>`;
      }).join("")
    : "<li><em>No projects shipped yet — visit the Projects tab to start your first one.</em></li>";

  // Certificates list
  const certsList = Object.values(certificates).map((c) =>
    `<li>Launchpad ${escapeHtml(c.trackName)} Track Certificate — Completed ${new Date(c.issuedAt).toLocaleDateString()}${opts.includeQuizScores ? " · ID: " + escapeHtml(c.certId) : ""}</li>`,
  );
  if (careerCert) {
    certsList.push(`<li>Launchpad Career Master Certificate — ${escapeHtml(careerCert.careerLabel)} · Completed ${new Date(careerCert.issuedAt).toLocaleDateString()}</li>`);
  }

  // Quiz scores per language (optional)
  const quizScoresHtml = opts.includeQuizScores && langProficiency.length > 0
    ? langProficiency.map((lp) => `<tr><td>${escapeHtml(lp.name)}</td><td>${lp.level}</td><td>${lp.avg}%</td><td>${lp.completed} lessons</td></tr>`).join("")
    : "";

  // Badges (optional)
  const badgesHtml = opts.includeBadges && badges.length > 0
    ? badges.map((b) => `<span class="badge">${b.icon} ${escapeHtml(b.title)}</span>`).join(" ")
    : "";

  // Skills (all completed languages)
  const skillsHtml = langProficiency.length > 0
    ? langProficiency.map((lp) => `${escapeHtml(lp.name)} (${lp.level})`).join(" · ")
    : "Add a language to your roadmap to begin.";

  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const startDate = profile.startDate ? new Date(profile.startDate).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "Recent";
  const completedLessons = Object.values(lessonProgress).filter((p) => p.status === "complete").length;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Resume — ${escapeHtml(opts.name)}</title>
  <style>
    @page { size: A4; margin: 18mm; }
    * { box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; line-height: 1.5; font-size: 11pt; }
    h1 { font-size: 22pt; margin: 0 0 2px 0; letter-spacing: -0.5px; }
    h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid #1a1a1a; padding-bottom: 2px; margin: 18px 0 8px; }
    .contact { color: #555; font-size: 9pt; margin: 4px 0 0; }
    .contact a { color: #2DD4BF; text-decoration: none; }
    .summary { margin: 12px 0; color: #333; }
    .section { margin: 8px 0; }
    .section ul { margin: 4px 0; padding-left: 18px; }
    .section li { margin: 3px 0; font-size: 10pt; }
    table { width: 100%; border-collapse: collapse; font-size: 10pt; margin: 6px 0; }
    th, td { text-align: left; padding: 4px 6px; border-bottom: 1px solid #ddd; }
    th { background: #f5f5f5; font-weight: 600; }
    .badge { display: inline-block; padding: 2px 8px; margin: 2px; background: #f0f0f0; border-radius: 10px; font-size: 9pt; }
    .badges-row { margin-top: 4px; }
    .footer { margin-top: 20px; padding-top: 8px; border-top: 1px solid #ddd; text-align: center; font-size: 8pt; color: #888; }
    .objective { font-style: italic; color: #444; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(opts.name)}</h1>
  <p class="contact">
    ${escapeHtml(opts.objective)}
    ${opts.email ? ` · <a href="mailto:${escapeHtml(opts.email)}">${escapeHtml(opts.email)}</a>` : ""}
    ${opts.github ? ` · GitHub: <a href="${escapeHtml(opts.github)}">${escapeHtml(opts.github)}</a>` : ""}
    ${opts.linkedin ? ` · LinkedIn: <a href="${escapeHtml(opts.linkedin)}">${escapeHtml(opts.linkedin)}</a>` : ""}
  </p>

  <h2>Objective</h2>
  <p class="objective">${escapeHtml(opts.objective)}</p>

  <h2>Technical Skills</h2>
  <p>${skillsHtml}</p>
  ${opts.includeQuizScores && quizScoresHtml ? `
  <h2>Proficiency by Language</h2>
  <table>
    <thead><tr><th>Language</th><th>Level</th><th>Quiz Avg</th><th>Lessons</th></tr></thead>
    <tbody>${quizScoresHtml}</tbody>
  </table>` : ""}

  <h2>Projects</h2>
  <div class="section">
    <ul>${projectsHtml}</ul>
  </div>

  <h2>Certifications</h2>
  <div class="section">
    <ul>${certsList.length > 0 ? certsList.join("") : "<li><em>No certificates earned yet.</em></li>"}</ul>
  </div>

  <h2>Education</h2>
  <div class="section">
    <p><strong>Self-taught via Launchpad Coding Education Platform</strong></p>
    <p style="font-size: 10pt; color: #555; margin: 2px 0;">
      ${escapeHtml(roadmap?.careerLabel ?? "Developer")} Learning Path — ${startDate} to ${date}<br/>
      Completed ${completedLessons} structured lessons across ${langs.length} languages · ${Math.round(roadmap?.totalHours ?? 0)} hours invested
    </p>
  </div>

  ${opts.includeBadges && badgesHtml ? `
  <h2>Achievements</h2>
  <div class="badges-row">${badgesHtml}</div>
  <p style="font-size: 9pt; color: #555; margin-top: 4px;">${badges.length} badges earned · ${streak.current}-day coding streak (best: ${streak.longest} days)</p>` : ""}

  ${opts.includeBranding ? `
  <div class="footer">
    Generated by <strong>Launchpad</strong> — Free AI-personalized coding education · launchpad--pi.vercel.app
  </div>` : ""}

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
}

// ============================================================
// Career Master Certificate generator
// ============================================================
function generateCareerCertificate(name: string, careerLabel: string, languageIds: string[], totalHours: number) {
  const stored = useStore.getState().state.careerCertificate;
  const certId = stored?.certId ?? `LP-CAREER-${Date.now().toString(36).toUpperCase()}`;
  const issuedAt = stored?.issuedAt ?? new Date().toISOString();
  const date = new Date(issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const langs = languageIds.map((id) => ALL_LANGUAGE_INFO[id]?.name ?? id);
  const langsList = langs.map((l) => `<span class="lang-chip">${escapeHtml(l)}</span>`).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Launchpad Career Master Certificate — ${escapeHtml(name)}</title>
  <style>
    @page { size: landscape; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; }
    .cert {
      width: 100vw; min-height: 100vh;
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 30%, #fefce8 70%, #fdf4ff 100%);
      padding: 50px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .watermark {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg);
      font-size: 240px; font-weight: 900; color: rgba(245, 158, 11, 0.06);
      pointer-events: none; user-select: none; letter-spacing: -0.05em; z-index: 0;
    }
    .border {
      position: absolute; inset: 25px;
      border: 4px solid #D97706; border-radius: 12px; z-index: 1;
      box-shadow: inset 0 0 0 1px #FCD34D;
    }
    .border-inner {
      position: absolute; inset: 35px;
      border: 1px solid #F59E0B; border-radius: 8px; z-index: 1;
    }
    .content { position: relative; z-index: 2; text-align: center; max-width: 850px; }
    .logo {
      font-size: 40px; font-weight: bold; letter-spacing: -0.02em;
      background: linear-gradient(135deg, #F59E0B 0%, #E879F9 50%, #2DD4BF 100%);
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 4px;
    }
    .subtitle { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #92400E; margin-bottom: 28px; }
    .title { font-size: 32px; font-weight: bold; color: #78350F; margin-bottom: 6px; }
    .body-text { font-size: 14px; color: #4b5563; max-width: 650px; line-height: 1.6; margin: 0 auto 24px; }
    .name { font-size: 44px; font-weight: bold; font-style: italic; color: #78350F; margin: 12px 0 24px; border-bottom: 2px solid #D97706; padding-bottom: 6px; display: inline-block; min-width: 350px; }
    .career { font-size: 22px; color: #78350F; font-weight: bold; margin-bottom: 16px; }
    .langs-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-bottom: 12px; }
    .lang-chip { padding: 4px 10px; border: 1px solid #F59E0B; border-radius: 12px; font-size: 11px; color: #92400E; background: rgba(252, 211, 77, 0.2); }
    .stats { font-size: 12px; color: #6b7280; margin-bottom: 28px; }
    .signatures { display: flex; gap: 80px; margin-top: 28px; justify-content: center; }
    .sig { text-align: center; }
    .sig-line { width: 200px; border-top: 1px solid #78350F; margin-bottom: 6px; }
    .sig-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; }
    .cert-id { position: absolute; bottom: 45px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #92400E; font-family: monospace; z-index: 2; }
    .seal {
      position: absolute; bottom: 70px; right: 70px;
      width: 110px; height: 110px; border-radius: 50%;
      background: linear-gradient(135deg, #FCD34D, #F59E0B, #D97706);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      color: white; font-weight: bold; font-size: 11px; text-align: center;
      box-shadow: 0 4px 16px rgba(217, 119, 6, 0.4);
      transform: rotate(-12deg);
      z-index: 2;
      border: 3px solid #FCD34D;
    }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="cert">
    <div class="watermark">Launchpad</div>
    <div class="border"></div>
    <div class="border-inner"></div>
    <div class="content">
      <div class="logo">Launchpad</div>
      <div class="subtitle">Coding Education Platform</div>
      <div class="title">Career Master Certificate</div>
      <div class="body-text">This certifies that the bearer has demonstrated mastery across the entire career curriculum — completing the full personalized roadmap, all linked lessons, and shipped capstone projects with production-grade quality.</div>
      <div class="name">${escapeHtml(name)}</div>
      <div class="career">${escapeHtml(careerLabel)} — Mastery Achieved</div>
      <div class="langs-row">${langsList}</div>
      <div class="stats">~${Math.round(totalHours)} hours invested · ${langs.length} technologies mastered · Completed ${date}</div>
      <div class="signatures">
        <div class="sig">
          <div class="sig-line"></div>
          <div class="sig-label">Launchpad</div>
        </div>
        <div class="sig">
          <div class="sig-line"></div>
          <div class="sig-label">Date · ${date}</div>
        </div>
      </div>
    </div>
    <div class="seal">CAREER<br/>MASTER<br/>${date.split(",")[0]}</div>
    <div class="cert-id">Certificate ID: ${certId}</div>
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
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-foreground/5 p-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-xs font-mono font-semibold mt-0.5">{value}</div>
    </div>
  );
}
