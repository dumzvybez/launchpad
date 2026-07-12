"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
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
import { ALL_LANGUAGE_INFO } from "@/lib/lessons-meta";
import { getLessonById } from "@/lib/lessons-data";
import { openPrintableHtml } from "@/lib/print-utils";
import { openCareerCertificatePdf } from "@/lib/certificate-pdf";
import { CareerReadinessCard } from "@/components/views/CareerReadinessCard";
import type { AppState, GeneratedRoadmap } from "@/lib/types";

export function CareerView() {
  const state = useStore((s) => s.state);
  const roadmap = state.roadmap;
  const profile = state.profile;
  const setView = useStore((s) => s.setView);
  // Hooks must be called before any early return (Rules of Hooks)
  const issueCareerCertificate = useStore((s) => s.issueCareerCertificate);
  const updateCareerCertificateName = useStore((s) => s.updateCareerCertificateName);

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

      {/* v5.927 (#1): Career Readiness — now uses the SHARED CareerReadinessCard
          component (same as the Dashboard). One source of truth, no duplicate. */}
      <CareerReadinessCard variant="full" />

      {/* Suggested Next Steps trigger (kept separate from the shared card so
          the shared component stays Dashboard-reusable). */}
      <SuggestedNextSteps readiness={readiness} />

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
            { label: "Complete 5 daily challenges", done: (state.dailyChallenge.totalCompleted ?? 0) >= 5 },
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
                {/* v5.866 BUG 1B FIX (career cert): Only show "Download" if a cert
                    was actually issued. If no cert is stored, show "Issue certificate"
                    which calls issueCareerCertificate and handles failure properly. */}
                {careerCert ? (
                  <>
                    <GlassButton
                      variant="primary"
                      onClick={() => {
                        const name = window.prompt("Edit your name for the Career Master Certificate:", careerCert.name);
                        if (name === null) return;
                        const finalName = name.trim() || "Learner";
                        if (careerCert.name !== finalName) {
                          updateCareerCertificateName(finalName);
                        }
                        openCareerCertificatePdf(finalName, career.label, roadmap.languageIds, computeHoursInvested(useStore.getState().state, roadmap));
                      }}
                    >
                      <Download className="h-4 w-4" /> Download Career Certificate (PDF)
                    </GlassButton>
                    <GlassButton
                      variant="ghost"
                      onClick={() => {
                        const name = window.prompt("Edit your name on this certificate:", careerCert.name);
                        if (name === null) return;
                        const finalName = name.trim() || "Learner";
                        updateCareerCertificateName(finalName);
                        openCareerCertificatePdf(finalName, career.label, roadmap.languageIds, computeHoursInvested(useStore.getState().state, roadmap));
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit name
                    </GlassButton>
                  </>
                ) : (
                  <GlassButton
                    variant="primary"
                    onClick={async () => {
                      const defaultName = profile.name ?? "Learner";
                      const name = window.prompt("Edit your name for the Career Master Certificate:", defaultName);
                      if (name === null) return;
                      const finalName = name.trim() || "Learner";
                      // v5.866 BUG 1B FIX: await the result and check for failure.
                      const resultCertId = await issueCareerCertificate(career.label, finalName);
                      if (!resultCertId) {
                        toast.error("Career Master Certificate could not be issued", {
                          description: "This may be a temporary server issue — please try again in a moment. Your progress is saved; the certificate will be issued automatically on your next visit.",
                        });
                        return;
                      }
                      // Success — generate the PDF with the real certId
                      openCareerCertificatePdf(finalName, career.label, roadmap.languageIds, computeHoursInvested(useStore.getState().state, roadmap));
                    }}
                  >
                    <Download className="h-4 w-4" /> Issue Career Certificate
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

  // v5.926 (A2): 4 dimensions (Challenges removed).
  const dims = [
    { key: "roadmap", label: "Roadmap", value: readiness.roadmapProgress, suggestion: "Complete the next roadmap task in your current phase to boost roadmap progress.", cta: "Go to Roadmap", view: "roadmap" as const },
    { key: "quiz", label: "Knowledge", value: readiness.quizAverage, suggestion: "Retake quizzes from completed lessons — your average quiz score is below 75%.", cta: "Go to Learn", view: "learn" as const },
    { key: "projects", label: "Projects", value: readiness.projectsCompleted, suggestion: "Verify a project with AI to boost project completion. Pick one from the Projects tab, submit your code, and pass the AI review.", cta: "Go to Projects", view: "projects" as const },
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

      {open && typeof document !== "undefined" && createPortal(
        // v5.925 FIX (BUG 7 — Career tab popup overlap): portal to document.body
        // so the popup escapes the parent GlassCard's `backdrop-filter` (which
        // per CSS Containment creates a containing block for position:fixed
        // descendants, trapping the popup inside the card). Also applied the
        // v5.85 fixes that the resume popup already had: solid bg-background,
        // max-h + overflow-y-auto, stronger backdrop.
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setOpen(false)}>
          <div className="max-w-md w-full max-h-[85vh] overflow-y-auto bg-background rounded-xl shadow-2xl p-5 border border-border/60 ring-1 ring-black/5 dark:ring-white/5" onClick={(e) => e.stopPropagation()}>
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
        </div>,
        document.body,
      )}
    </div>
  );
}

// ============================================================
// ResumeBuilderButton — Section 6 (Resume Auto-Builder)
// Generates a printable resume PDF in a new window using browser print
// ============================================================
function ResumeBuilderButton() {
  // Subscribe to the store reactively so the form's pre-filled `name` and
  // `objective` reflect the latest state when the user opens the dialog.
  // Previously `useStore.getState()` was called once at mount, so changes
  // made while on the Career tab (e.g. earning badges, completing lessons)
  // were never reflected in the form seeds.
  const profile = useStore((s) => s.state.profile);
  const careerLabel = useStore((s) => s.state.roadmap?.careerLabel);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [objective, setObjective] = useState(
    `Aspiring ${profile.careerId ? (careerLabel ?? "Developer") : "Developer"}`,
  );
  const [includeQuizScores, setIncludeQuizScores] = useState(true);
  const [includeBadges, setIncludeBadges] = useState(true);
  const [includeBranding, setIncludeBranding] = useState(true);

  // v5.76 — reset form fields when the modal opens so stale data from a
  // previous session doesn't persist. The useState initializers only run
  // once (on mount), so we need to explicitly refresh on each open.
  const [prevOpen, setPrevOpen] = useState(false);
  if (open && !prevOpen) {
    setPrevOpen(true);
    setName(profile.name || "");
    setObjective(`Aspiring ${profile.careerId ? (careerLabel ?? "Developer") : "Developer"}`);
  } else if (!open && prevOpen) {
    setPrevOpen(false);
  }

  const handleGenerate = () => {
    setOpen(false);
    // Set badge-tracking flag per Section 13.1
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("launchpad:resume-built", "1");
      } catch { /* ignore storage errors */ }
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

      {open && typeof document !== "undefined" && createPortal(
        // v5.925 FIX (BUG 7): portal to document.body — escapes the parent
        // GlassCard's backdrop-filter containing block so the popup covers
        // the full viewport instead of just the card.
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-hidden"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-builder-title"
        >
          {/* v5.85 fix (0.5): use solid bg-background instead of semi-transparent bg-card
              so background content doesn't bleed through the modal. */}
          <div
            className="max-w-lg w-full max-h-[85vh] overflow-y-auto bg-background rounded-xl shadow-2xl p-5 border border-border/60 ring-1 ring-black/5 dark:ring-white/5"
            onClick={(e) => e.stopPropagation()}
          >
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
        </div>,
        document.body,
      )}
    </>
  );
}

/**
 * Section 23 — compute actual hours invested (not the roadmap's total estimate).
 *
 * Formula (in priority order):
 *   1. If the user has tracked focus-session time OR per-task timeSpent, use
 *      the sum of those (most accurate — real tracked minutes).
 *   2. Otherwise, fall back to summing `estMinutes` for completed lessons +
 *      `estMinutes` for completed roadmap tasks + a flat 2h per shipped
 *      project (reasonable estimate when no real tracking exists).
 *
 * Returns hours (1 decimal place). 0 for brand-new users.
 */
function computeHoursInvested(state: AppState, roadmap?: GeneratedRoadmap): number {
  // Tier 1: actual tracked time
  const focusMinutes = state.focusSessions
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + s.durationMinutes, 0);
  const taskTimeSpentMinutes = Object.values(state.tasks).reduce(
    (sum, t) => sum + (t.timeSpent ?? 0),
    0,
  );
  const actualMinutes = focusMinutes + taskTimeSpentMinutes;
  if (actualMinutes > 0) return actualMinutes / 60;

  // Tier 2: estimated time for completed work
  let fallbackMinutes = 0;
  for (const [lessonId, progress] of Object.entries(state.lessonProgress)) {
    if (progress.status === "complete") {
      fallbackMinutes += getLessonById(lessonId)?.estMinutes ?? 0;
    }
  }
  if (roadmap) {
    for (const phase of roadmap.phases) {
      for (const mod of phase.modules) {
        for (const task of mod.tasks) {
          if (state.tasks[task.id]?.completedAt) {
            fallbackMinutes += task.estMinutes ?? 0;
          }
        }
      }
    }
  }
  // Flat 2h per shipped project (reasonable average for a portfolio project)
  fallbackMinutes += state.projects.filter((p) => p.status === "shipped").length * 120;
  return fallbackMinutes / 60;
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
        return `<li><strong>${escapeHtml(projTitle)}</strong> — ${p.notes ? escapeHtml(p.notes) : "Shipped project"} ${p.repoUrl ? `· <a href="${escapeHtml(safeUrl(p.repoUrl))}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.repoUrl)}</a>` : ""}</li>`;
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
    /* v5.924 PDF FIX (Mode C + orientation): lock to A4 PORTRAIT with 12mm
       margins. Previously the print-utils wrapper injected an unconditional
       @page { margin: 0 } that overrode this margin → content printed flush
       to the page edge and the dark header banner looked cropped. That
       injected rule is now gone (print-utils only injects @page when the
       surface HTML doesn't declare its own), so this @page wins. Explicit
       "portrait" fixes the orientation-inconsistency report (resume was the
       only portrait surface but didn't say so, relying on the browser
       default which could differ on mobile). */
    @page { size: A4 portrait; margin: 12mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1f2937;
      line-height: 1.5;
      font-size: 10.5pt;
      background: white;
    }
    .resume {
      max-width: 800px;
      margin: 0 auto;
      background: white;
    }
    /* Header — gradient banner with name + contact */
    .header {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%);
      color: white;
      padding: 28px 32px;
      border-radius: 12px 12px 0 0;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: ""; position: absolute; top: -30px; right: -30px;
      width: 120px; height: 120px;
      background: radial-gradient(circle, rgba(45, 212, 191, 0.2) 0%, transparent 70%);
    }
    .header h1 {
      font-size: 26pt; font-weight: 800; letter-spacing: -0.5px;
      margin-bottom: 4px;
      position: relative; z-index: 1;
    }
    .header .career {
      font-size: 12pt; opacity: 0.85; font-weight: 500;
      position: relative; z-index: 1;
    }
    .header .contact {
      margin-top: 12px; font-size: 9pt; opacity: 0.75;
      display: flex; flex-wrap: wrap; gap: 12px;
      position: relative; z-index: 1;
    }
    .header .contact a { color: #5EEAD4; text-decoration: none; }
    .header .contact span { display: inline-flex; align-items: center; gap: 4px; }

    /* Body — two-column layout */
    .body {
      display: grid;
      grid-template-columns: 1fr 240px;
      gap: 24px;
      padding: 24px 32px;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 12px 12px;
    }
    .main-col { min-width: 0; }
    .side-col { min-width: 0; }

    h2 {
      font-size: 11pt;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: #0F172A;
      font-weight: 700;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 2px solid #2DD4BF;
      display: flex; align-items: center; gap: 6px;
    }
    h2 .icon { color: #2DD4BF; }
    h3 { font-size: 10pt; font-weight: 600; color: #1f2937; margin-bottom: 2px; }
    .section { margin-bottom: 18px; }
    .section:last-child { margin-bottom: 0; }
    .section ul { list-style: none; padding: 0; }
    .section li {
      font-size: 9.5pt; margin-bottom: 6px; padding-left: 14px;
      position: relative; color: #374151;
    }
    .section li::before {
      content: "▸"; position: absolute; left: 0; color: #2DD4BF; font-weight: bold;
    }
    .section li a { color: #0F172A; text-decoration: underline; }

    /* Sidebar */
    .sidebar-section {
      background: #F9FAFB;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 14px;
    }
    .sidebar-section h3 {
      font-size: 9pt; text-transform: uppercase; letter-spacing: 1px;
      color: #6B7280; margin-bottom: 8px; font-weight: 700;
    }
    .skill-bar {
      margin-bottom: 8px;
    }
    .skill-bar .skill-name {
      font-size: 9pt; font-weight: 600; color: #1f2937;
      display: flex; justify-content: space-between;
    }
    .skill-bar .bar {
      height: 4px; background: #E5E7EB; border-radius: 2px;
      margin-top: 3px; overflow: hidden;
    }
    .skill-bar .bar-fill {
      height: 100%; background: linear-gradient(90deg, #2DD4BF, #6366F1);
      border-radius: 2px;
    }
    .stat-row {
      display: flex; justify-content: space-between;
      font-size: 9pt; padding: 3px 0;
      border-bottom: 1px solid #E5E7EB;
    }
    .stat-row:last-child { border-bottom: none; }
    .stat-row .label { color: #6B7280; }
    .stat-row .value { font-weight: 600; color: #1f2937; }

    .badge {
      display: inline-block; padding: 3px 8px; margin: 2px;
      background: #ECFDF5; border: 1px solid #A7F3D0;
      color: #065F46; border-radius: 12px; font-size: 8.5pt; font-weight: 500;
    }

    .objective {
      font-size: 10pt; color: #374151; font-style: italic;
      line-height: 1.6; margin-bottom: 4px;
    }

    .footer {
      text-align: center; padding: 12px;
      font-size: 8pt; color: #9CA3AF;
      border-top: 1px solid #E5E7EB;
      margin-top: 16px;
    }
    .footer strong { color: #6B7280; }

    /* Table for proficiency */
    table { width: 100%; border-collapse: collapse; font-size: 9pt; margin-top: 6px; }
    th, td { text-align: left; padding: 5px 8px; border-bottom: 1px solid #E5E7EB; }
    th { background: #F3F4F6; color: #374151; font-weight: 600; font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.5px; }
    td { color: #1f2937; }

    /* Print: ensure colors show + keep to one page */
    @media print {
      body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .header { border-radius: 0; }
      .resume { max-width: none; }
      /* v5.924: clamp the resume to a single A4 page. The A4 portrait
         printable area at 12mm margins is ~186mm tall. Setting max-height
         to the page content-box + overflow:hidden guarantees no content
         spills onto page 2. Sections use break-inside:avoid so they don't
         split awkwardly. */
      .resume { max-height: 186mm; overflow: hidden; }
      .section, .sidebar-section { break-inside: avoid; }
    }
    @media screen {
      body { background: #f3f4f6; padding: 20px; }
      .resume { box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    }
  </style>
</head>
<body>
  <div class="resume">
    <!-- Header banner -->
    <div class="header">
      <h1>${escapeHtml(opts.name)}</h1>
      <div class="career">${escapeHtml(roadmap?.careerLabel ?? "Developer")}</div>
      <div class="contact">
        ${opts.email ? `<span>✉ <a href="mailto:${escapeHtml(opts.email)}">${escapeHtml(opts.email)}</a></span>` : ""}
        ${opts.github ? `<span>🔗 <a href="${escapeHtml(safeUrl(opts.github))}" target="_blank" rel="noopener noreferrer">GitHub</a></span>` : ""}
        ${opts.linkedin ? `<span>in <a href="${escapeHtml(safeUrl(opts.linkedin))}" target="_blank" rel="noopener noreferrer">LinkedIn</a></span>` : ""}
        <span>📅 ${date}</span>
      </div>
    </div>

    <!-- Two-column body -->
    <div class="body">
      <!-- Main column -->
      <div class="main-col">
        <!-- Objective -->
        <div class="section">
          <h2><span class="icon">🎯</span> Objective</h2>
          <p class="objective">${escapeHtml(opts.objective)}</p>
        </div>

        <!-- Projects -->
        <div class="section">
          <h2><span class="icon">🚀</span> Projects</h2>
          <ul>${projectsHtml}</ul>
        </div>

        <!-- Certifications -->
        <div class="section">
          <h2><span class="icon">🎓</span> Certifications</h2>
          <ul>${certsList.length > 0 ? certsList.join("") : "<li><em>No certificates earned yet.</em></li>"}</ul>
        </div>

        <!-- Education -->
        <div class="section">
          <h2><span class="icon">📚</span> Education</h2>
          <ul>
            <li>
              <strong>Self-taught via Launchpad Coding Education Platform</strong><br/>
              <span style="font-size: 9pt; color: #6B7280;">
                ${escapeHtml(roadmap?.careerLabel ?? "Developer")} Learning Path · ${startDate} to ${date}<br/>
                ${completedLessons} structured lessons · ${langs.length} languages · ${computeHoursInvested(state, roadmap).toFixed(1)} hours invested
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Sidebar column -->
      <div class="side-col">
        <!-- Skills with proficiency bars -->
        <div class="sidebar-section">
          <h3>🛠️ Skills</h3>
          ${langProficiency.map(lp => `
            <div class="skill-bar">
              <div class="skill-name">
                <span>${escapeHtml(lp.name)}</span>
                <span style="color: #6B7280; font-size: 8pt;">${lp.level}</span>
              </div>
              <div class="bar"><div class="bar-fill" style="width: ${lp.avg}%"></div></div>
            </div>
          `).join("")}
        </div>

        <!-- Stats -->
        <div class="sidebar-section">
          <h3>📊 Stats</h3>
          <div class="stat-row"><span class="label">Lessons completed</span><span class="value">${completedLessons}</span></div>
          <div class="stat-row"><span class="label">Languages</span><span class="value">${langs.length}</span></div>
          <div class="stat-row"><span class="label">Projects shipped</span><span class="value">${projects.length}</span></div>
          <div class="stat-row"><span class="label">Certificates</span><span class="value">${Object.keys(certificates).length + (careerCert ? 1 : 0)}</span></div>
          <div class="stat-row"><span class="label">Current streak</span><span class="value">${streak.current}d 🔥</span></div>
          <div class="stat-row"><span class="label">Hours invested</span><span class="value">${computeHoursInvested(state, roadmap).toFixed(1)}h</span></div>
        </div>

        <!-- Badges (optional) -->
        ${opts.includeBadges && badges.length > 0 ? `
        <div class="sidebar-section">
          <h3>🏆 Badges (${badges.length})</h3>
          <div>${badges.map(b => `<span class="badge">${b.icon} ${escapeHtml(b.title)}</span>`).join("")}</div>
        </div>` : ""}

        <!-- Quiz scores table (optional) -->
        ${opts.includeQuizScores && langProficiency.length > 0 ? `
        <div class="sidebar-section">
          <h3>📝 Quiz Scores</h3>
          <table>
            <thead><tr><th>Lang</th><th>Score</th><th>Lessons</th></tr></thead>
            <tbody>
              ${langProficiency.map(lp => `<tr><td>${escapeHtml(lp.name)}</td><td>${lp.avg}%</td><td>${lp.completed}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>` : ""}
      </div>
    </div>

    ${opts.includeBranding ? `
    <div class="footer">
      Generated by <strong>Launchpad</strong> — Free AI-personalized coding education · launchpad--dev.vercel.app
    </div>` : ""}
  </div>
</body>
</html>`;

  // Open via the shared utility — no auto-print, user clicks "Download Now".
  openPrintableHtml(html, {
    filename: `launchpad-resume-${opts.name.replace(/\s+/g, "-").toLowerCase()}`,
    title: "Launchpad Resume",
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// v5.77 SECURITY fix: validate URL scheme before rendering as `href`.
// Previously, user-controlled URLs (repoUrl, github, linkedin) were
// HTML-escaped but not scheme-validated. A `javascript:` URL would pass
// the escape (no HTML special chars) and execute when clicked in the
// printable resume page.
function safeUrl(url: string): string {
  if (!url) return "#";
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:)/i.test(trimmed)) return trimmed;
  return "#";
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-foreground/5 p-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-xs font-mono font-semibold mt-0.5">{value}</div>
    </div>
  );
}
