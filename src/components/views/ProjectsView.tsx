"use client";

import { useState, useMemo } from "react";
import {
  Rocket,
  Github,
  ExternalLink,
  CheckCircle2,
  Circle,
  Award,
  FolderGit2,
  Clock,
  Star,
  BookOpen,
  ChevronLeft,
  Target,
  ListChecks,
  Upload,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard, GlassButton, GlassPill, ProgressBar } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import { selectProjectsForRoadmap, type SelectedProject } from "@/lib/projects-data";
import { LANGUAGE_MAP } from "@/lib/career-data";
import type { ProjectTracker } from "@/lib/types";

const STATUS_CONFIG = {
  planned: { label: "Planned", color: "bg-muted text-muted-foreground" },
  in_progress: { label: "In Progress", color: "bg-amber-400/15 text-amber-400 border border-amber-400/30" },
  shipped: { label: "Shipped", color: "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30" },
  abandoned: { label: "Abandoned", color: "bg-rose-400/15 text-rose-400 border border-rose-400/30" },
} as const;

const TIER_CONFIG = {
  foundational: "from-teal-400 to-cyan-400",
  core: "from-fuchsia-400 to-purple-400",
  capstone: "from-amber-400 to-orange-400",
} as const;

const DIFFICULTY_CONFIG = {
  beginner: { label: "Beginner", color: "text-emerald-500" },
  intermediate: { label: "Intermediate", color: "text-amber-500" },
  advanced: { label: "Advanced", color: "text-rose-500" },
} as const;

export function ProjectsView() {
  const state = useStore((s) => s.state);
  const updateProjectTracker = useStore((s) => s.updateProjectTracker);
  const addProjectSubmission = useStore((s) => s.addProjectSubmission);
  const [filter, setFilter] = useState<"all" | "shipped" | "in_progress" | "planned">("all");
  const [instructionsProjectId, setInstructionsProjectId] = useState<string | null>(null);
  const [reviewProjectId, setReviewProjectId] = useState<string | null>(null);

  // Get projects selected for THIS user's roadmap
  const selectedProjects = useMemo<SelectedProject[]>(() => {
    if (!state.roadmap) return [];
    return selectProjectsForRoadmap(
      state.roadmap.careerId,
      state.roadmap.languageIds,
      8,
    );
  }, [state.roadmap]);

  const projectTrackers: Record<string, ProjectTracker> = {};
  for (const p of state.projects) {
    projectTrackers[p.projectId] = p;
  }

  const filtered = selectedProjects.filter((p) => {
    if (filter === "all") return true;
    return (projectTrackers[p.id]?.status ?? "planned") === filter;
  });

  const shippedCount = selectedProjects.filter((p) => projectTrackers[p.id]?.status === "shipped").length;
  const inProgressCount = selectedProjects.filter((p) => projectTrackers[p.id]?.status === "in_progress").length;

  if (!state.roadmap) {
    return (
      <GlassCard className="p-8 text-center">
        <FolderGit2 className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">Complete onboarding to see your personalized projects.</p>
      </GlassCard>
    );
  }

  // Full-page instructions view (Section 4.1)
  if (instructionsProjectId) {
    const proj = selectedProjects.find((p) => p.id === instructionsProjectId);
    if (proj) {
      return <ProjectInstructionsView project={proj} onBack={() => setInstructionsProjectId(null)} onSubmit={(repoUrl, notes) => {
        addProjectSubmission(proj.id, repoUrl, notes);
      }} existingSubmission={state.projectSubmissions.find((s) => s.projectId === proj.id)} />;
    }
  }

  return (
    <div className="view-enter space-y-4">
      <GlassCard variant="flat" className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Rocket className="h-4 w-4 text-primary" /> Your Project Track
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedProjects.length} projects selected for your {state.roadmap.careerLabel} path · {shippedCount} shipped · {inProgressCount} in progress
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-foreground/5 overflow-x-auto">
            {(["all", "planned", "in_progress", "shipped"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap",
                  filter === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
                )}
              >
                {f === "all" ? "All" : STATUS_CONFIG[f].label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {selectedProjects.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No projects match your roadmap. Try a different career or language selection.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((proj) => {
            const tracker = projectTrackers[proj.id];
            const status = tracker?.status ?? "planned";
            const tierGradient = TIER_CONFIG[proj.tier];
            const diffConfig = DIFFICULTY_CONFIG[proj.difficulty];

            const totalDeliverables = proj.deliverables.length;
            const completedDeliverables =
              status === "shipped" ? totalDeliverables : status === "in_progress" ? Math.floor(totalDeliverables / 2) : 0;
            const pct = Math.round((completedDeliverables / totalDeliverables) * 100);

            return (
              <GlassCard key={proj.id} hover className="overflow-hidden">
                <div className={cn("h-1 bg-gradient-to-r", tierGradient)} />

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <GlassPill className="bg-gradient-to-r text-white border-transparent">
                          <span className={cn("bg-gradient-to-r bg-clip-text text-transparent font-semibold capitalize", tierGradient)}>
                            {proj.tier}
                          </span>
                        </GlassPill>
                        <span className={cn("text-[10px] font-mono uppercase", diffConfig.color)}>
                          {diffConfig.label}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-0.5">
                          <Clock className="h-3 w-3" /> {proj.estHours}h
                        </span>
                      </div>
                      <h3 className="text-base font-semibold tracking-tight">{proj.title}</h3>
                    </div>
                    <div className={cn("shrink-0 text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded-md", STATUS_CONFIG[status].color)}>
                      {STATUS_CONFIG[status].label}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{proj.description}</p>

                  {/* Match reason */}
                  {proj.matchReason && (
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 italic">
                      ✓ {proj.matchReason}
                    </div>
                  )}

                  {/* Languages */}
                  <div className="flex flex-wrap gap-1">
                    {proj.languages.slice(0, 4).map((langId) => {
                      const lang = LANGUAGE_MAP[langId];
                      return (
                        <span key={langId} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-foreground/4 border border-border/40 text-muted-foreground">
                          {lang?.icon ?? "📘"} {lang?.name ?? langId}
                        </span>
                      );
                    })}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {proj.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-500">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Deliverables */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      <span>Deliverables</span>
                      <span>{completedDeliverables}/{totalDeliverables}</span>
                    </div>
                    <ProgressBar value={pct} size="sm" />
                    <ul className="space-y-0.5 pt-1">
                      {proj.deliverables.slice(0, 3).map((d, i) => (
                        <li key={i} className="flex gap-1.5 text-[11px]">
                          {i < completedDeliverables ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                          )}
                          <span className={cn("text-foreground/80", i < completedDeliverables && "line-through text-muted-foreground")}>
                            {d}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {proj.stretchGoals && proj.stretchGoals.length > 0 && (
                      <div className="pt-2 mt-2 border-t border-border/30">
                        <div className="text-[9px] uppercase tracking-wide text-amber-500 font-semibold mb-1">Stretch goals</div>
                        <ul className="space-y-0.5">
                          {proj.stretchGoals.slice(0, 2).map((s, i) => (
                            <li key={i} className="flex gap-1.5 text-[10px] text-muted-foreground">
                              <span className="text-amber-500 shrink-0">★</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                    <GlassButton
                      size="sm"
                      variant="ghost"
                      onClick={() => setInstructionsProjectId(proj.id)}
                      className="shrink-0"
                    >
                      <BookOpen className="h-3.5 w-3.5" /> Instructions
                    </GlassButton>
                    <input
                      type="text"
                      placeholder="GitHub repo URL"
                      defaultValue={tracker?.repoUrl ?? ""}
                      onBlur={(e) => updateProjectTracker(proj.id, { repoUrl: e.target.value })}
                      className="flex-1 bg-foreground/4 rounded-lg px-2 py-1 text-[11px] outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    {tracker?.repoUrl && (
                      <a href={tracker.repoUrl} target="_blank" rel="noopener noreferrer">
                        <GlassButton size="icon" variant="ghost" className="h-7 w-7">
                          <Github className="h-3.5 w-3.5" />
                        </GlassButton>
                      </a>
                    )}
                    <input
                      type="text"
                      placeholder="Live URL"
                      defaultValue={tracker?.liveUrl ?? ""}
                      onBlur={(e) => updateProjectTracker(proj.id, { liveUrl: e.target.value })}
                      className="flex-1 bg-foreground/4 rounded-lg px-2 py-1 text-[11px] outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    {tracker?.liveUrl && (
                      <a href={tracker.liveUrl} target="_blank" rel="noopener noreferrer">
                        <GlassButton size="icon" variant="ghost" className="h-7 w-7">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </GlassButton>
                      </a>
                    )}
                  </div>

                  {/* Status switcher */}
                  <div className="flex items-center gap-1 pt-1">
                    <select
                      value={status}
                      onChange={(e) => {
                        const newStatus = e.target.value as ProjectTracker["status"];
                        updateProjectTracker(proj.id, {
                          status: newStatus,
                          startedAt: newStatus === "in_progress" ? new Date().toISOString() : tracker?.startedAt,
                          shippedAt: newStatus === "shipped" ? new Date().toISOString() : tracker?.shippedAt,
                        });
                      }}
                      className="text-[11px] bg-foreground/4 rounded-lg px-2 py-1 outline-none border border-border/40"
                    >
                      <option value="planned">Planned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="shipped">Shipped</option>
                      <option value="abandoned">Abandoned</option>
                    </select>
                    {tracker?.shippedAt && (
                      <GlassPill className="ml-auto bg-emerald-400/10 border-emerald-400/30 text-emerald-400">
                        <Award className="h-3 w-3" /> Shipped
                      </GlassPill>
                    )}
                  </div>

                  {/* AI Code Review button — shown only when project is shipped (Section 7.2) */}
                  {status === "shipped" && (
                    <GlassButton
                      size="sm"
                      variant="primary"
                      onClick={() => setReviewProjectId(proj.id)}
                      className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-transparent hover:brightness-110"
                    >
                      <Target className="h-3.5 w-3.5" /> Get AI Code Review
                    </GlassButton>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* AI Code Review modal — Section 7 */}
      {reviewProjectId && (() => {
        const proj = selectedProjects.find((p) => p.id === reviewProjectId);
        if (!proj) return null;
        return (
          <CodeReviewModal
            project={proj}
            careerLabel={state.roadmap.careerLabel}
            skillLevel={state.profile.skillLevel ?? "intermediate"}
            onClose={() => setReviewProjectId(null)}
          />
        );
      })()}

      {/* Hint about how projects are selected */}
      <GlassCard className="p-4">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Star className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong>How projects are selected:</strong> These projects are chosen from our database of 55+ projects based on your career ({state.roadmap.careerLabel}) and selected languages. They scale in complexity: 2-3 beginner projects early, 2-3 intermediate midway, and 1-2 advanced capstone projects.
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// ============================================================
// ProjectInstructionsView — full-page instructions (Section 4.1)
// ============================================================

function ProjectInstructionsView({
  project,
  onBack,
  onSubmit,
  existingSubmission,
}: {
  project: SelectedProject;
  onBack: () => void;
  onSubmit: (repoUrl: string, notes?: string) => void;
  existingSubmission?: { repoUrl?: string; submittedAt: string; notes?: string };
}) {
  const [repoUrl, setRepoUrl] = useState(existingSubmission?.repoUrl ?? "");
  const [notes, setNotes] = useState(existingSubmission?.notes ?? "");
  const [submitted, setSubmitted] = useState(false);

  // Generate step-by-step instructions from project data
  const steps = generateProjectSteps(project);

  return (
    <div className="view-enter space-y-4">
      {/* Back arrow */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Projects
      </button>

      {/* Project header */}
      <GlassCard className="p-5">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-violet-500 flex items-center justify-center shrink-0">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{project.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/5 capitalize">{project.difficulty}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/5 capitalize">{project.tier}</span>
              <span className="text-[10px] flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" /> {project.estHours}h
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* What you will build */}
      <GlassCard className="p-5">
        <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" /> What you will build
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {project.description} By the end of this project, you will have a working {project.title.toLowerCase()} that demonstrates your understanding of {project.skills.slice(0, 3).join(", ")}.
        </p>
      </GlassCard>

      {/* Languages / tools required */}
      <GlassCard className="p-5">
        <h2 className="text-sm font-semibold mb-2">Languages / tools required</h2>
        <div className="flex flex-wrap gap-1.5">
          {project.languages.map((langId) => {
            const lang = LANGUAGE_MAP[langId];
            return (
              <span key={langId} className="text-xs px-2 py-1 rounded-md bg-foreground/5 flex items-center gap-1">
                <span>{lang?.icon ?? "📘"}</span>
                <span>{lang?.name ?? langId}</span>
              </span>
            );
          })}
        </div>
      </GlassCard>

      {/* Step-by-step instructions */}
      <GlassCard className="p-5">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary" /> Step-by-step instructions
        </h2>
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium">{step.title}</div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </GlassCard>

      {/* Deliverables */}
      <GlassCard className="p-5">
        <h2 className="text-sm font-semibold mb-3">Deliverables</h2>
        <ul className="space-y-1.5">
          {project.deliverables.map((d, i) => (
            <li key={i} className="text-xs flex gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </GlassCard>

      {/* Stretch goals */}
      {project.stretchGoals && project.stretchGoals.length > 0 && (
        <GlassCard className="p-5">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" /> Stretch goals (optional)
          </h2>
          <ul className="space-y-1.5">
            {project.stretchGoals.map((s, i) => (
              <li key={i} className="text-xs flex gap-2">
                <span className="text-amber-500 shrink-0">★</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {/* Submit project (Section 3.4 / 4.1) */}
      <GlassCard className="p-5">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Upload className="h-4 w-4 text-primary" /> Submit your project
        </h2>
        {existingSubmission && !submitted && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-2 mb-3 text-xs">
            Previously submitted on {new Date(existingSubmission.submittedAt).toLocaleDateString()}.
            Update the URL below to resubmit.
          </div>
        )}
        {submitted ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Submitted! Your project is recorded.
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/yourusername/your-project"
              className="w-full bg-foreground/4 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/30"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes about your implementation (optional)…"
              rows={2}
              className="w-full bg-foreground/4 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <GlassButton
              variant="primary"
              onClick={() => {
                if (!repoUrl.trim()) return;
                onSubmit(repoUrl.trim(), notes.trim() || undefined);
                setSubmitted(true);
              }}
              disabled={!repoUrl.trim()}
            >
              <Upload className="h-3.5 w-3.5" /> Submit project
            </GlassButton>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

// ============================================================
// CodeReviewModal — Section 7: AI Code Review
// ============================================================
function CodeReviewModal({
  project,
  careerLabel,
  skillLevel,
  onClose,
}: {
  project: SelectedProject;
  careerLabel: string;
  skillLevel: string;
  onClose: () => void;
}) {
  const aiSettings = useStore((s) => s.state.aiSettings);
  const addChatMessage = useStore((s) => s.addChatMessage);
  const createChat = useStore((s) => s.createChat);
  const conversations = useStore((s) => s.state.chatConversations);
  const setActiveChat = useStore((s) => s.setActiveChat);
  const setView = useStore((s) => s.setView);
  const setAiTutorOpen = useStore((s) => s.setAiTutorOpen);

  const [code, setCode] = useState<string>("");
  const [review, setReview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasKey = !!aiSettings.apiKey;
  const primaryLang = project.languages[0] ?? "javascript";

  const handleSubmit = async () => {
    if (!code.trim()) return;
    if (!hasKey) {
      setError("No API key configured. Open AI Tutor → Settings to add a key.");
      return;
    }
    setLoading(true);
    setError(null);
    setReview(null);

    const systemPrompt = `You are a senior software engineer performing a code review. The user just completed the following project: "${project.title}" — ${project.description}.
They are a ${skillLevel} learner working toward ${careerLabel}.

Review their code for:
1. **Correctness** — Does it work as intended? Are there bugs?
2. **Code Quality** — Is it readable, well-named, properly indented?
3. **Best Practices** — Does it follow ${primaryLang} conventions and idioms?
4. **Efficiency** — Any unnecessary complexity or performance issues?
5. **Improvements** — 3 specific, actionable things they could add or improve

Format your response with these exact headings:
## Overall Impression
## What Works Well (list 3-5 specific things with line references if possible)
## Issues Found (list each issue with explanation and fix)
## Suggested Improvements (list 3 with code examples)
## Score: X/10
## Encouragement (one genuine, specific sentence)

Be honest but encouraging. Remember this is a learning context.
Use code blocks for all code examples.`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user" as const,
            content: `Please review my code for the "${project.title}" project.\n\nPrimary language: ${primaryLang}\nProject description: ${project.description}\n\n\`\`\`${primaryLang}\n${code}\n\`\`\``,
          }],
          apiKey: aiSettings.apiKey,
          provider: aiSettings.provider,
          model: aiSettings.model,
          temperature: aiSettings.temperature,
          customEndpoint: aiSettings.customEndpoint,
          systemPrompt,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
      setReview(data.content || "(no response)");
      // Set badge-tracking flags per Section 13.1
      if (typeof window !== "undefined") {
        window.localStorage.setItem("launchpad:code-reviewed", "1");
        const current = Number(window.localStorage.getItem("launchpad:code-review-count") ?? "0");
        window.localStorage.setItem("launchpad:code-review-count", String(current + 1));
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToChat = () => {
    if (!review) return;
    const chatId = createChat();
    addChatMessage(chatId, {
      id: `msg-${Date.now()}`,
      role: "user",
      content: `Code review for **${project.title}**:\n\n\`\`\`${primaryLang}\n${code}\n\`\`\``,
      timestamp: new Date().toISOString(),
    });
    addChatMessage(chatId, {
      id: `msg-${Date.now()}-review`,
      role: "assistant",
      content: review,
      timestamp: new Date().toISOString(),
      provider: aiSettings.provider,
    });
    setActiveChat(chatId);
    onClose();
    setView("ai-tutor");
    setAiTutorOpen(true);
  };

  const handleCopyReview = () => {
    if (!review) return;
    navigator.clipboard.writeText(review);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="max-w-3xl w-full max-h-[90vh] bg-card rounded-xl shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <div>
            <h3 className="text-sm font-semibold">🔍 AI Code Review — {project.title}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Language: <span className="font-mono">{primaryLang}</span> · Project level: {project.difficulty}
            </p>
          </div>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!hasKey ? (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
              <div className="font-semibold text-amber-700 dark:text-amber-300 mb-1">Set up your AI Tutor first</div>
              <p className="text-muted-foreground">
                Code review uses your configured AI key. Open the AI Tutor → Settings → add a key from Gemini, Groq, OpenRouter, OpenAI, or Anthropic.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-medium">Paste your code for review</label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={12}
                  placeholder={`// Paste your ${primaryLang} code here...\n\n// The AI will review it for correctness, quality,\n// best practices, efficiency, and suggest improvements.`}
                  className="w-full mt-1 px-3 py-2 rounded-md bg-foreground/5 border border-border/60 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <div className="text-[10px] text-muted-foreground mt-1">
                  Tip: Include all relevant files separated by comments like <code className="font-mono">// file: app.js</code>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-300">
                  ⚠️ {error}
                </div>
              )}

              {review && (
                <div className="rounded-lg border border-border/60 bg-foreground/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold">AI Review</div>
                    <div className="flex gap-2">
                      <button onClick={handleCopyReview} className="text-[10px] px-2 py-1 rounded-md bg-foreground/5 hover:bg-foreground/10">Copy</button>
                      <button onClick={handleSaveToChat} className="text-[10px] px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20">Save to Chat</button>
                    </div>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-xs">
                    <pre className="whitespace-pre-wrap font-sans">{review}</pre>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2 p-4 border-t border-border/60">
          <button
            onClick={handleSubmit}
            disabled={!code.trim() || loading || !hasKey}
            className={cn(
              "flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors",
              code.trim() && !loading && hasKey
                ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:brightness-110"
                : "bg-foreground/5 text-muted-foreground cursor-not-allowed",
            )}
          >
            {loading ? "Reviewing..." : "🔍 Submit for Review"}
          </button>
          <button onClick={onClose} className="px-3 py-2 rounded-md border border-border/60 text-xs hover:bg-foreground/5">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/** Generate specific, actionable step-by-step instructions from a project. */
function generateProjectSteps(project: SelectedProject): { title: string; detail: string }[] {
  const primaryLang = LANGUAGE_MAP[project.languages[0]]?.name ?? "your language";
  return [
    {
      title: "Set up your project folder and install dependencies",
      detail: `Create a new folder for ${project.title}. Initialize a ${primaryLang} project (e.g. \`npm init -y\` for Node.js, \`python -m venv venv\` for Python, or \`cargo new\` for Rust). Install any required packages or libraries based on the tech stack.`,
    },
    {
      title: "Create the file structure",
      detail: `Plan your files before coding. For ${project.title}, you'll typically need: a main entry file, a data/model file, and a UI or CLI handler. Create empty files with stubs so you can fill them in one by one.`,
    },
    {
      title: "Implement the core data model",
      detail: `Define the core data structures for ${project.title}. For example, if it's a todo app, define the Task type/interface. If it's a calculator, define the operation enum. Use ${project.skills[0] ?? "clear naming"} conventions.`,
    },
    {
      title: `Build the first feature: ${project.deliverables[0] ?? "core functionality"}`,
      detail: `Start with the smallest deliverable: "${project.deliverables[0] ?? "the core feature"}". Write the code, test it manually, and make sure it works end-to-end before moving on.`,
    },
    {
      title: "Add the remaining features one at a time",
      detail: `Work through each remaining deliverable: ${project.deliverables.slice(1, 4).join("; ")}. Implement, test, commit. Don't try to build everything at once — small commits are easier to debug.`,
    },
    {
      title: "Handle edge cases and errors",
      detail: `Add input validation, error handling, and edge-case coverage. What happens if the user enters empty input? What if a file is missing? Add defensive checks and helpful error messages.`,
    },
    {
      title: "Write a README with usage examples",
      detail: `Document how to install, run, and use your ${project.title}. Include at least 3 usage examples, a list of features, and any known limitations. A good README is what makes a portfolio project shine.`,
    },
    {
      title: "Test, review, and deploy",
      detail: `Run through all deliverables one more time. Fix any bugs. Push to GitHub with a clean commit history. If applicable, deploy to a free host (Vercel, Render, Fly.io, GitHub Pages). Submit the repo URL above.`,
    },
  ];
}
