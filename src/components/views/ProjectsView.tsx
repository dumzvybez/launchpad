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
  const [filter, setFilter] = useState<"all" | "shipped" | "in_progress" | "planned">("all");

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
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border/40">
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
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

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
