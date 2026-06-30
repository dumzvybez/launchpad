"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  GraduationCap,
  Clock,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Lightbulb,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  Award,
  Play,
  Code2,
  Target,
  Youtube,
  Lock,
  Star,
  CheckCircle2,
} from "lucide-react";
import { useStore, selectCertificateEligible, selectTrackQuizAverage } from "@/lib/store";
import { GlassCard, GlassButton, ProgressBar } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import {
  ALL_LESSONS,
  getLessonsForTrack,
  getAllTracks,
  ALL_LANGUAGE_INFO,
} from "@/lib/lessons-data";
import { getVideoLink, getPlaylist } from "@/data/youtube-links";
import { InlineCodeEditor } from "@/components/lesson/InlineCodeEditor";
import type { Lesson, QuizQuestion } from "@/lib/types";

type Tab = "tracks" | "lesson" | "quiz" | "result";

export function LearnView() {
  // Read persistent learn-tab state from store — fixes the resume bug
  const learnTabState = useStore((s) => s.state.learnTabState);
  const setLearnTabState = useStore((s) => s.setLearnTabState);
  const tab = learnTabState.tab;
  const selectedTrack = learnTabState.selectedTrack;
  const selectedLessonId = learnTabState.selectedLessonId;
  const setTab = (t: Tab) => setLearnTabState({ tab: t });
  const setSelectedTrack = (id: string | null) => setLearnTabState({ selectedTrack: id });
  const setSelectedLessonId = (id: string | null) => setLearnTabState({ selectedLessonId: id });

  const [filterLang, setFilterLang] = useState<string | null>(null); // null = show all
  const lessonProgress = useStore((s) => s.state.lessonProgress);
  const setLessonProgress = useStore((s) => s.setLessonProgress);
  const setPlaygroundCode = useStore((s) => s.setPlaygroundCode);
  const setView = useStore((s) => s.setView);
  const profile = useStore((s) => s.state.profile);
  const roadmap = useStore((s) => s.state.roadmap);
  const certificates = useStore((s) => s.state.certificates);
  const issueCertificate = useStore((s) => s.issueCertificate);
  const updateCertificateName = useStore((s) => s.updateCertificateName);

  const selectedLesson = useMemo(
    () => ALL_LESSONS.find((l) => l.id === selectedLessonId),
    [selectedLessonId],
  );

  // All tracks with their lesson counts
  const allTracks = useMemo(() => getAllTracks(), []);

  // User's plan languages (from roadmap) — shown as "primary" chips
  const planLanguageIds = roadmap?.languageIds ?? [];

  // Filter tracks: plan languages first, then "explore more"
  const planTracks = allTracks.filter((t) => planLanguageIds.includes(t.id));
  const exploreTracks = allTracks.filter((t) => !planLanguageIds.includes(t.id));

  // Tracks to show based on filter
  const visibleTracks = filterLang
    ? allTracks.filter((t) => t.id === filterLang)
    : allTracks;

  // Track completion stats
  const totalCompleted = Object.values(lessonProgress).filter((p) => p.status === "complete").length;

  // Tracks view
  if (tab === "tracks" && !selectedLessonId) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Learn</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalCompleted} of {ALL_LESSONS.length} lessons complete across {allTracks.length} languages · Build real coding skills with structured lessons, code examples, and quizzes.
          </p>
        </div>

        {/* Section 1: Your Languages (from roadmap) — track cards, no chip buttons */}
        {planTracks.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-3 font-mono">📚 Your languages · {planTracks.length} in your roadmap</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {planTracks.map((t) => {
                const trackLessons = ALL_LESSONS.filter((l) => l.track === t.id).sort((a, b) => a.order - b.order);
                const completed = trackLessons.filter((l) => lessonProgress[l.id]?.status === "complete").length;
                const pct = trackLessons.length ? Math.round((completed / trackLessons.length) * 100) : 0;
                return (
                  <GlassCard key={t.id} className="p-4 hover:scale-[1.01] transition-transform cursor-pointer" onClick={() => {
                    setSelectedTrack(t.id);
                    const nextIncomplete = trackLessons.find((l) => lessonProgress[l.id]?.status !== "complete");
                    setSelectedLessonId(nextIncomplete?.id ?? trackLessons[0]?.id ?? null);
                    setTab("lesson");
                    window.scrollTo(0, 0);
                  }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{t.icon}</span>
                        <div>
                          <h3 className="font-bold text-sm">{t.name}</h3>
                          <div className="text-[10px] text-muted-foreground font-mono">{t.lessonCount} lessons</div>
                        </div>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-semibold uppercase">
                        In Plan
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                        <span>{completed}/{t.lessonCount}</span>
                        <span>{pct}%</span>
                      </div>
                      <ProgressBar value={pct} className="h-1.5" />
                    </div>
                    <div className="text-[11px] text-primary text-center font-medium">
                      {completed > 0 ? "Continue learning →" : "Start track →"}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 2: Explore More — all other languages, collapsible */}
        {exploreTracks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">🔍 Explore more · {exploreTracks.length} other languages</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {exploreTracks.map((t) => {
                const trackLessons = ALL_LESSONS.filter((l) => l.track === t.id).sort((a, b) => a.order - b.order);
                const completed = trackLessons.filter((l) => lessonProgress[l.id]?.status === "complete").length;
                const pct = trackLessons.length ? Math.round((completed / trackLessons.length) * 100) : 0;
                return (
                  <GlassCard key={t.id} className="p-4 hover:scale-[1.01] transition-transform cursor-pointer opacity-90 hover:opacity-100" onClick={() => {
                    setSelectedTrack(t.id);
                    const nextIncomplete = trackLessons.find((l) => lessonProgress[l.id]?.status !== "complete");
                    setSelectedLessonId(nextIncomplete?.id ?? trackLessons[0]?.id ?? null);
                    setTab("lesson");
                    window.scrollTo(0, 0);
                  }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{t.icon}</span>
                        <div>
                          <h3 className="font-bold text-sm">{t.name}</h3>
                          <div className="text-[10px] text-muted-foreground font-mono">{t.lessonCount} lessons</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                        <span>{completed}/{t.lessonCount}</span>
                        <span>{pct}%</span>
                      </div>
                      <ProgressBar value={pct} className="h-1.5" />
                    </div>
                    <div className="text-[11px] text-muted-foreground text-center font-medium">
                      {completed > 0 ? "Continue →" : "Explore →"}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Lesson view
  if (tab === "lesson" && selectedLesson) {
    const progress = lessonProgress[selectedLesson.id];
    const track = selectedLesson.track;
    const trackLessons = getLessonsForTrack(track);
    const idx = trackLessons.findIndex((l) => l.id === selectedLesson.id);
    const prev = idx > 0 ? trackLessons[idx - 1] : null;
    const next = idx < trackLessons.length - 1 ? trackLessons[idx + 1] : null;

    return (
      <div className="space-y-4">
        {/* Breadcrumb + nav */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={() => { setSelectedLessonId(null); setTab("tracks"); setSelectedTrack(null); }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> All tracks
          </button>
          <div className="text-[10px] text-muted-foreground font-mono">
            {track.toUpperCase()} · Lesson {idx + 1} of {trackLessons.length}
          </div>
        </div>

        {/* Lesson header */}
        <GlassCard className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h1 className="text-xl font-bold">{selectedLesson.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{selectedLesson.description}</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono shrink-0">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {selectedLesson.estMinutes}m</span>
              <span className={cn(
                "px-1.5 py-0.5 rounded",
                selectedLesson.difficulty === "beginner" && "bg-emerald-500/15 text-emerald-600",
                selectedLesson.difficulty === "intermediate" && "bg-amber-500/15 text-amber-600",
                selectedLesson.difficulty === "advanced" && "bg-rose-500/15 text-rose-600",
              )}>
                {selectedLesson.difficulty}
              </span>
            </div>
          </div>

          {/* Lesson status */}
          {progress?.status === "complete" && (
            <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="h-3 w-3" /> Completed · Best quiz: {progress.bestQuizScore ?? 0}%
            </div>
          )}
        </GlassCard>

        {/* YouTube tutorial video embed (Section 17.5) */}
        <YouTubeEmbed lessonId={selectedLesson.id} trackId={track} />

        {/* Capstone badge (Section 3.4) */}
        {selectedLesson.isCapstone && (
          <div className="rounded-lg border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <div>
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">Capstone Project · Full Project Guide</div>
              <p className="text-[10px] text-muted-foreground">This is the capstone for the {trackName} track. Build it end-to-end and submit your repo.</p>
            </div>
          </div>
        )}

        {/* Lesson content — capstone uses structured layout (Section 3.4) */}
        {selectedLesson.isCapstone ? (
          <CapstoneLayout blocks={selectedLesson.blocks} onTryInPlayground={(code) => {
            setPlaygroundCode(code, "javascript");
            setView("playground");
          }} />
        ) : (
          <div className="space-y-3">
            {selectedLesson.blocks.map((block, i) => (
              <LessonBlockView key={i} block={block} onTryInPlayground={(code) => {
                setPlaygroundCode(code, "javascript");
                setView("playground");
              }} />
            ))}
          </div>
        )}

        {/* Deep dive resources */}
        {selectedLesson.deepDiveResources && selectedLesson.deepDiveResources.length > 0 && (
          <GlassCard className="p-4">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Deep dive resources
            </h3>
            <div className="space-y-1">
              {selectedLesson.deepDiveResources.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-primary hover:underline py-1"
                >
                  <ExternalLink className="h-3 w-3" /> {r.label}
                </a>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Action: mark in-progress + start quiz */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex gap-2">
            {prev && (
              <GlassButton variant="ghost" size="sm" onClick={() => { setSelectedLessonId(prev.id); window.scrollTo(0, 0); }}>
                <ChevronLeft className="h-4 w-4" /> {prev.title}
              </GlassButton>
            )}
            {next && (
              <GlassButton variant="ghost" size="sm" onClick={() => {
                setSelectedLessonId(next.id);
                setLessonProgress(selectedLesson.id, "in-progress");
                window.scrollTo(0, 0);
              }}>
                {next.title} <ChevronRight className="h-4 w-4" />
              </GlassButton>
            )}
          </div>
          <GlassButton
            variant="primary"
            onClick={() => {
              setLessonProgress(selectedLesson.id, "in-progress");
              setTab("quiz");
              window.scrollTo(0, 0);
            }}
          >
            <Trophy className="h-4 w-4" /> Take the quiz
          </GlassButton>
        </div>
      </div>
    );
  }

  // Quiz view
  if (tab === "quiz" && selectedLesson) {
    return (
      <QuizView
        lesson={selectedLesson}
        onComplete={(score) => {
          setLessonProgress(selectedLesson.id, "complete", score);
          setTab("result");
          window.scrollTo(0, 0);
        }}
        onBack={() => setTab("lesson")}
      />
    );
  }

  // Quiz result view
  if (tab === "result" && selectedLesson) {
    const progress = lessonProgress[selectedLesson.id];
    const score = progress?.bestQuizScore ?? 0;
    const passed = score >= 70;
    const track = selectedLesson.track;
    const trackLessons = getLessonsForTrack(track);
    const idx = trackLessons.findIndex((l) => l.id === selectedLesson.id);
    const next = idx < trackLessons.length - 1 ? trackLessons[idx + 1] : null;

    // Check if entire track is complete
    const trackComplete = trackLessons.every((l) => lessonProgress[l.id]?.status === "complete");

    // Certificate eligibility per Section 1.1 (75% average quiz score required)
    const certEligible = selectCertificateEligible(useStore.getState().state, track, trackLessons);
    const trackAverage = certEligible.average;

    // Get display name for the track
    const trackName = ALL_LANGUAGE_INFO[track]?.name ?? track;

    return (
      <div className="space-y-4">
        <GlassCard className="p-6 text-center">
          <div className={cn(
            "h-16 w-16 rounded-full mx-auto flex items-center justify-center text-3xl mb-3",
            passed ? "bg-emerald-500/20" : "bg-amber-500/20",
          )}>
            {passed ? "🎉" : "📚"}
          </div>
          <h2 className="text-xl font-bold mb-1">
            {passed ? "Lesson complete!" : "Good attempt!"}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            You scored <strong className={passed ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>{score}%</strong> on the quiz.
          </p>

          {/* Certificate section — 3 button states per Section 1.1 */}
          {trackComplete && (
            <div className={cn(
              "rounded-xl border-2 p-4 mb-4",
              certEligible.eligible
                ? "border-teal-500/60 bg-teal-500/10"
                : "border-amber-500/60 bg-amber-500/10",
            )}>
              <Award className={cn("h-8 w-8 mx-auto mb-2", certEligible.eligible ? "text-teal-500" : "text-amber-500")} />
              <h3 className="font-semibold text-sm">🎉 You completed the entire {trackName} track!</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-1">
                Track quiz average: <strong className={certEligible.eligible ? "text-teal-600 dark:text-teal-400" : "text-amber-600 dark:text-amber-400"}>{trackAverage}%</strong>
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                {certEligible.eligible
                  ? "You qualify for the certificate. Edit your name and download."
                  : `Your average: ${trackAverage}% — need 75% to unlock. Retake quizzes to improve.`}
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {certEligible.eligible ? (
                  <>
                    <GlassButton
                      variant="primary"
                      onClick={() => {
                        const existing = certificates[track];
                        const defaultName = existing?.name ?? profile.name ?? "Learner";
                        const name = window.prompt("Edit your name for the certificate:", defaultName);
                        if (name === null) return;
                        const finalName = name.trim() || "Learner";
                        if (existing) {
                          updateCertificateName(track, finalName);
                        } else {
                          issueCertificate(track, trackName, finalName);
                        }
                        generateCertificate(finalName, trackName, track, trackLessons);
                      }}
                    >
                      <Award className="h-4 w-4" /> Download certificate (PDF)
                    </GlassButton>
                    {certificates[track] && (
                      <GlassButton
                        variant="ghost"
                        onClick={() => {
                          const existing = certificates[track];
                          const name = window.prompt("Edit your name on this certificate:", existing.name);
                          if (name === null) return;
                          const finalName = name.trim() || "Learner";
                          updateCertificateName(track, finalName);
                          generateCertificate(finalName, trackName, track, trackLessons);
                        }}
                      >
                        Edit name
                      </GlassButton>
                    )}
                  </>
                ) : (
                  <GlassButton variant="ghost" disabled>
                    <Lock className="h-3.5 w-3.5" /> Retake Quizzes to Unlock ({trackAverage}% / 75%)
                  </GlassButton>
                )}
              </div>
            </div>
          )}
          {!trackComplete && (
            <div className="rounded-xl border border-border/60 bg-card/30 p-3 mb-4">
              <p className="text-xs text-muted-foreground">
                Complete all {trackLessons.length} lessons in this track to unlock the certificate.
                Progress: {trackLessons.filter((l) => lessonProgress[l.id]?.status === "complete").length}/{trackLessons.length}
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mt-4">
            <GlassButton variant="ghost" onClick={() => setTab("lesson")}>
              Re-read lesson
            </GlassButton>
            {next ? (
              <GlassButton variant="primary" onClick={() => {
                setSelectedLessonId(next.id);
                setTab("lesson");
                window.scrollTo(0, 0);
              }}>
                Next lesson <ChevronRight className="h-4 w-4" />
              </GlassButton>
            ) : (
              <GlassButton variant="primary" onClick={() => { setSelectedLessonId(null); setTab("tracks"); setSelectedTrack(null); }}>
                Back to tracks
              </GlassButton>
            )}
          </div>
        </GlassCard>
      </div>
    );
  }

  return null;
}

// ============================================================
// Sub-components
// ============================================================

/**
 * YouTubeEmbed — collapsible video supplement per Section 2.4 of Prompt-2.
 *
 * - Collapsed by default (just shows title + channel + duration)
 * - Expandable to show the iframe
 * - Dismissible per-video ("Hide this video" link)
 * - Honors `hideVideoSupplements` setting (returns null when set)
 * - Privacy disclaimer shown when expanded
 * - Falls back to "Video coming soon" with search URL when no video
 */
function YouTubeEmbed({ lessonId, trackId }: { lessonId: string; trackId: string }) {
  const video = getVideoLink(lessonId);
  const playlist = getPlaylist(trackId);
  // Section 2.4 — hideVideoSupplements preference
  const hideVideoSupplements = useStore((s) => s.state.preferences.hideVideoSupplements ?? false);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Respect the global setting and per-video dismissal
  if (hideVideoSupplements || dismissed) return null;

  // Build the embed URL. Use youtube-nocookie.com for privacy.
  let embedUrl = "";
  let watchUrl = "";
  if (video) {
    embedUrl = `https://www.youtube-nocookie.com/embed/${video.videoId}`;
    if (video.startAt) embedUrl += `?start=${video.startAt}&autoplay=0`;
    else embedUrl += `?autoplay=0`;
    watchUrl = `https://www.youtube.com/watch?v=${video.videoId}` + (video.startAt ? `&t=${video.startAt}s` : "");
  }

  if (!video) {
    // Placeholder card per Section 17.5
    const searchUrl = `https://www.youtube.com/results?search_query=${trackId}+tutorial`;
    return (
      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0">
            <Youtube className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Video coming soon</div>
            <p className="text-xs text-muted-foreground">Meanwhile, search on YouTube for relevant tutorials.</p>
          </div>
          <a href={searchUrl} target="_blank" rel="noopener noreferrer"
             className="text-xs px-3 py-1.5 rounded-md bg-primary/15 text-primary hover:bg-primary/25 transition-colors">
            Search YouTube →
          </a>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="rounded-xl border border-border/40 bg-muted/20 overflow-hidden">
      {/* Collapsible header — Section 2.4 pattern */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
          <Youtube className="h-4 w-4 text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{video.title}</p>
          <p className="text-xs text-muted-foreground">
            by {video.channel}
            {video.durationMinutes ? ` · ${video.durationMinutes} min` : ""} · Optional
          </p>
        </div>
        <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Privacy disclaimer per Section 2.4 */}
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="text-amber-500">⚠️</span>
            Loading this video connects to YouTube servers (youtube-nocookie.com).
          </p>
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={embedUrl}
              title={video.title}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-lg border border-border/60"
            />
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-xs text-muted-foreground">
              Video by <span className="font-medium text-foreground">{video.channel}</span> on YouTube
            </p>
            <div className="flex items-center gap-2">
              <a href={watchUrl} target="_blank" rel="noopener noreferrer"
                 className="text-xs text-primary hover:underline flex items-center gap-1">
                <ExternalLink className="h-3 w-3" /> Open on YouTube
              </a>
              {playlist && (
                <a href={playlist.playlistUrl} target="_blank" rel="noopener noreferrer"
                   className="text-xs px-2.5 py-1 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 transition-colors flex items-center gap-1">
                  <Youtube className="h-3 w-3" /> Full Course
                </a>
              )}
              <button
                onClick={() => setDismissed(true)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Hide this video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * CapstoneLayout — renders capstone blocks as structured sections per Section 3.4.
 * Groups generic blocks (heading/text/code/tip) into labeled sections with
 * premium styling: problem statement, requirements table, file structure,
 * build timeline, testing/deployment checklists, rubric, stretch goals.
 */
function CapstoneLayout({
  blocks,
  onTryInPlayground,
}: {
  blocks: Lesson["blocks"];
  onTryInPlayground: (code: string) => void;
}) {
  // Walk blocks and group into sections. Each "heading" starts a new section.
  const sections: { title: string; blocks: Lesson["blocks"] }[] = [];
  let current: { title: string; blocks: Lesson["blocks"] } | null = null;
  for (const b of blocks) {
    if (b.kind === "heading") {
      if (current) sections.push(current);
      current = { title: b.content, blocks: [] };
    } else {
      if (!current) current = { title: "Overview", blocks: [] };
      current.blocks.push(b);
    }
  }
  if (current) sections.push(current);

  return (
    <div className="space-y-4">
      {sections.map((section, si) => {
        const isProblem = /problem|statement/i.test(section.title);
        const isRequirements = /requirement|p0|p1|p2/i.test(section.title);
        const isFileStructure = /file structure|structure/i.test(section.title);
        const isBuild = /build|walkthrough|step/i.test(section.title);
        const isTesting = /test/i.test(section.title);
        const isDeployment = /deploy/i.test(section.title);
        const isRubric = /rubric|evaluation/i.test(section.title);
        const isStretch = /stretch/i.test(section.title);

        return (
          <GlassCard key={si} className="p-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold">{si + 1}</span>
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.blocks.map((block, bi) => {
                // For requirements section, render as P0/P1/P2 styled blocks
                if (isRequirements && block.kind === "text") {
                  // Try to detect P0/P1/P2 lines
                  const lines = block.content.split("\n");
                  const tiers: { label: string; color: string; items: string[] }[] = [
                    { label: "P0 · Must have", color: "border-rose-500/40 bg-rose-500/5", items: [] },
                    { label: "P1 · Should have", color: "border-amber-500/40 bg-amber-500/5", items: [] },
                    { label: "P2 · Nice to have", color: "border-sky-500/40 bg-sky-500/5", items: [] },
                  ];
                  let currentTier = 0;
                  for (const ln of lines) {
                    if (/p0|must have/i.test(ln)) currentTier = 0;
                    else if (/p1|should have/i.test(ln)) currentTier = 1;
                    else if (/p2|nice to have/i.test(ln)) currentTier = 2;
                    else if (ln.trim().startsWith("-") || ln.trim().startsWith("•")) {
                      tiers[currentTier].items.push(ln.trim().replace(/^[-•]\s*/, ""));
                    }
                  }
                  if (tiers.some((t) => t.items.length > 0)) {
                    return (
                      <div key={bi} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {tiers.map((t, ti) => (
                          <div key={ti} className={cn("rounded-lg border p-2", t.color)}>
                            <div className="text-[10px] font-semibold uppercase mb-1">{t.label}</div>
                            <ul className="space-y-1">
                              {t.items.map((it, ii) => (
                                <li key={ii} className="text-[11px] flex gap-1.5">
                                  <Check className="h-3 w-3 shrink-0 mt-0.5" />
                                  <span>{it}</span>
                                </li>
                              ))}
                              {t.items.length === 0 && <li className="text-[10px] text-muted-foreground italic">None specified</li>}
                            </ul>
                          </div>
                        ))}
                      </div>
                    );
                  }
                }
                // For build section, render as vertical timeline
                if (isBuild && block.kind === "text") {
                  const lines = block.content.split("\n").map((l) => l.trim()).filter((l) => l && /^\d+\.|^-|^\d+\)/.test(l));
                  if (lines.length > 2) {
                    return (
                      <ol key={bi} className="relative border-l-2 border-primary/30 ml-2 space-y-2">
                        {lines.map((ln, li) => (
                          <li key={li} className="ml-3 text-xs relative">
                            <span className="absolute -left-[18px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                            <span>{ln.replace(/^\d+\.|^-|^\d+\)\s*/, "")}</span>
                          </li>
                        ))}
                      </ol>
                    );
                  }
                }
                // For testing/deployment, render as checklist
                if ((isTesting || isDeployment) && block.kind === "tip") {
                  const items = block.content.split("\n").filter((l) => l.trim() && !l.trim().startsWith("Testing") && !l.trim().startsWith("Deployment"));
                  return (
                    <ul key={bi} className="space-y-1">
                      {items.map((it, ii) => (
                        <li key={ii} className="text-xs flex gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{it.replace(/^[-•]\s*/, "")}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                // For rubric, render as table
                if (isRubric && block.kind === "text") {
                  const items = block.content.split("\n").filter((l) => l.trim()).map((l) => l.replace(/^[-•]\s*/, ""));
                  if (items.length > 0) {
                    return (
                      <div key={bi} className="rounded-lg border border-border/60 overflow-hidden">
                        <table className="w-full text-xs">
                          <thead className="bg-foreground/5">
                            <tr>
                              <th className="text-left p-2 font-medium">Criterion</th>
                              <th className="text-left p-2 font-medium w-24">Weight</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((it, ii) => (
                              <tr key={ii} className="border-t border-border/40">
                                <td className="p-2">{it}</td>
                                <td className="p-2 text-muted-foreground font-mono">{Math.round(100 / items.length)}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                }
                // For stretch goals, render as checklist with stars
                if (isStretch && block.kind === "tip") {
                  const items = block.content.split("\n").filter((l) => l.trim()).map((l) => l.replace(/^[-•]\s*/, ""));
                  return (
                    <ul key={bi} className="space-y-1">
                      {items.map((it, ii) => (
                        <li key={ii} className="text-xs flex gap-2">
                          <Star className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                // Default: render via LessonBlockView
                return <LessonBlockView key={bi} block={block} onTryInPlayground={onTryInPlayground} />;
              })}
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}

function LessonBlockView({
  block,
  onTryInPlayground,
}: {
  block: Lesson["blocks"][number];
  onTryInPlayground: (code: string) => void;
}) {
  if (block.kind === "heading") {
    return <h2 className="text-lg font-bold mt-4 first:mt-0">{block.content}</h2>;
  }
  if (block.kind === "text") {
    return <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">{block.content}</p>;
  }
  if (block.kind === "whyItMatters") {
    return (
      <div className="rounded-lg border border-teal-500/30 bg-teal-500/5 p-3 flex items-start gap-2">
        <Target className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
        <div>
          <div className="text-[10px] font-semibold uppercase text-teal-600 dark:text-teal-400 mb-0.5">Why this matters</div>
          <p className="text-sm leading-relaxed">{block.content}</p>
        </div>
      </div>
    );
  }
  if (block.kind === "prerequisites") {
    return (
      <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-3">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-4 w-4 text-sky-500" />
          <div className="text-[10px] font-semibold uppercase text-sky-600 dark:text-sky-400">Before you start</div>
        </div>
        <ul className="space-y-1">
          {block.items.map((it, i) => (
            <li key={i} className="text-xs text-foreground/80 flex gap-2">
              <span className="text-sky-500 shrink-0">•</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (block.kind === "topics") {
    return (
      <div>
        <div className="text-[10px] font-semibold uppercase text-muted-foreground mb-2">Topics covered</div>
        <ul className="space-y-1">
          {block.items.map((it, i) => (
            <li key={i} className="text-sm text-foreground/90 flex gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (block.kind === "keyConcepts") {
    return (
      <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
        <div className="text-[10px] font-semibold uppercase text-violet-600 dark:text-violet-400 mb-2">Key concepts</div>
        <ul className="space-y-1">
          {block.items.map((it, i) => (
            <li key={i} className="text-xs text-foreground/80 flex gap-2">
              <span className="text-violet-500 shrink-0">◆</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (block.kind === "code") {
    // Section 1 — InlineCodeEditor replaces the static code block
    // Keeps the existing Copy + Run (Try in Playground) buttons for backward compat
    // while adding Edit & Run inline execution.
    return (
      <InlineCodeEditor
        code={block.code}
        language={block.language}
        caption={block.caption}
      />
    );
  }
  if (block.kind === "pitfalls") {
    return (
      <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-rose-500" />
          <div className="text-[10px] font-semibold uppercase text-rose-600 dark:text-rose-400">Common pitfalls</div>
        </div>
        <ol className="space-y-1.5">
          {block.items.map((it, i) => (
            <li key={i} className="text-xs text-foreground/80 flex gap-2">
              <span className="text-rose-500 font-mono shrink-0">{i + 1}.</span>
              <span>{it}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }
  if (block.kind === "realWorldApps") {
    return (
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          <div className="text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-400">In the wild</div>
        </div>
        <ul className="space-y-1">
          {block.items.map((it, i) => (
            <li key={i} className="text-xs text-foreground/80 flex gap-2">
              <span className="text-amber-500 shrink-0">★</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (block.kind === "interviewQuestions") {
    return (
      <details className="rounded-lg border border-border/60 bg-card/30 p-3 group">
        <summary className="cursor-pointer flex items-center gap-2 text-xs font-semibold">
          <ChevronRight className="h-3.5 w-3.5 group-open:rotate-90 transition-transform" />
          Interview prep ({block.items.length} questions)
        </summary>
        <ul className="mt-2 space-y-1.5">
          {block.items.map((it, i) => (
            <li key={i} className="text-xs text-foreground/80 flex gap-2">
              <span className="text-primary font-mono shrink-0">Q{i + 1}.</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </details>
    );
  }
  if (block.kind === "miniProject") {
    return (
      <div className="rounded-lg border-2 border-emerald-500/40 bg-emerald-500/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Play className="h-4 w-4 text-emerald-500" />
          <div className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">Try it yourself</div>
        </div>
        <p className="text-sm leading-relaxed">{block.content}</p>
      </div>
    );
  }
  if (block.kind === "exercises") {
    // Filter out quiz content that was accidentally included in the exercises block
    // during the database → lessons-data.ts conversion. The quiz is rendered separately
    // via the dedicated "Take the quiz" button — these raw quiz lines should NOT appear
    // as exercises in the lesson body.
    const cleanedItems = block.items.filter(item => {
      const trimmed = item.trim();
      // Skip lines that are clearly quiz markers/structure, not exercises
      if (/^>>>\s*QUIZ/i.test(trimmed)) return false;
      if (/^Z AI: render this as/i.test(trimmed)) return false;
      if (/^Q\d+\s*[:.]/i.test(trimmed)) return false;  // "Q1: ..." or "Q1. ..."
      if (/^[A-D]\)\s/.test(trimmed)) return false;     // "A) ...", "B) ...", etc.
      if (/^\([A-D]\)\s/.test(trimmed)) return false;   // "(A) ..."
      if (/^Explanation\s*:/i.test(trimmed)) return false;
      if (/^Answer\s*:/i.test(trimmed)) return false;
      if (/^\(\*\)$/.test(trimmed)) return false;        // "(*)" correct answer marker
      if (/^\(Z AI/.test(trimmed)) return false;
      return true;
    });
    if (cleanedItems.length === 0) return null;
    return (
      <div>
        <div className="text-[10px] font-semibold uppercase text-muted-foreground mb-2">Exercises</div>
        <ol className="space-y-1.5">
          {cleanedItems.map((it, i) => (
            <li key={i} className="text-xs text-foreground/80 flex gap-2">
              <span className="h-4 w-4 rounded-full border border-muted-foreground/40 flex items-center justify-center text-[9px] font-mono shrink-0 mt-0.5">{i + 1}</span>
              <span>{it}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }
  if (block.kind === "tip") {
    return (
      <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-3 flex items-start gap-2">
        <Lightbulb className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
        <div>
          <div className="text-[10px] font-semibold uppercase text-sky-600 dark:text-sky-400 mb-0.5">Tip</div>
          <p className="text-sm">{block.content}</p>
        </div>
      </div>
    );
  }
  if (block.kind === "warning") {
    return (
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <div className="text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-400 mb-0.5">Warning</div>
          <p className="text-sm">{block.content}</p>
        </div>
      </div>
    );
  }
  if (block.kind === "callout") {
    const colorMap = {
      info: "border-sky-500/30 bg-sky-500/5 text-sky-600 dark:text-sky-400",
      success: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
      warning: "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400",
    };
    return (
      <div className={`rounded-lg border p-3 ${colorMap[block.variant]}`}>
        <p className="text-sm">{block.content}</p>
      </div>
    );
  }
  if (block.kind === "resources") {
    return (
      <div className="space-y-1">
        {block.links.map((l, i) => (
          <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline">
            <ExternalLink className="h-3 w-3" /> {l.label}
          </a>
        ))}
      </div>
    );
  }
  return null;
}

function QuizView({
  lesson,
  onComplete,
  onBack,
}: {
  lesson: Lesson;
  onComplete: (score: number) => void;
  onBack: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const recordQuizAnswer = useStore((s) => s.recordQuizAnswer);

  const score = useMemo(() => {
    let correct = 0;
    for (const q of lesson.quiz) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    return Math.round((correct / lesson.quiz.length) * 100);
  }, [answers, lesson.quiz]);

  const correctCount = useMemo(() => {
    let c = 0;
    for (const q of lesson.quiz) {
      if (answers[q.id] === q.correctIndex) c++;
    }
    return c;
  }, [answers, lesson.quiz]);

  const passMark = 7; // 7/10 = 70%
  const passed = correctCount >= passMark;

  const handleSubmit = () => {
    setSubmitted(true);
    // Record each answer in the store (per-question tracking per Section 1.1)
    for (const q of lesson.quiz) {
      const sel = answers[q.id];
      if (sel !== undefined) {
        recordQuizAnswer(lesson.id, q.id, sel, sel === q.correctIndex);
      }
    }
    // NOTE: Do NOT auto-advance. Let the user review their answers and the
    // explanations, then they click "See results" manually when ready.
    // Previous behavior: setTimeout(() => onComplete(score), 2000); — too fast.
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Back to lesson
        </button>
        <div className="text-[10px] text-muted-foreground font-mono">
          {lesson.quiz.length} questions · Need {passMark}/{lesson.quiz.length} to pass
        </div>
      </div>

      <GlassCard className="p-5">
        <h2 className="text-lg font-bold mb-1">{lesson.title} — Quiz</h2>
        <p className="text-xs text-muted-foreground">Pick the best answer for each question. Explanations appear after you submit.</p>
      </GlassCard>

      {lesson.quiz.map((q, qi) => (
        <GlassCard key={q.id} className="p-4">
          <div className="flex items-start gap-2 mb-3">
            <span className="text-[10px] font-mono text-muted-foreground mt-0.5 shrink-0">
              Question {qi + 1} of {lesson.quiz.length}
            </span>
            <p className="text-sm font-medium flex-1">{q.question}</p>
          </div>
          <div className="space-y-1.5">
            {q.options.map((opt, oi) => {
              const isSelected = answers[q.id] === oi;
              const isCorrect = oi === q.correctIndex;
              const showResult = submitted;
              return (
                <button
                  key={oi}
                  onClick={() => !submitted && setAnswers({ ...answers, [q.id]: oi })}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm border transition-all",
                    !showResult && isSelected && "border-primary bg-primary/10",
                    !showResult && !isSelected && "border-border/60 hover:bg-foreground/5",
                    showResult && isCorrect && "border-emerald-500 bg-emerald-500/10",
                    showResult && isSelected && !isCorrect && "border-rose-500 bg-rose-500/10",
                    showResult && !isSelected && !isCorrect && "border-border/60 opacity-60",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">{String.fromCharCode(65 + oi)}</span>
                    <span>{opt}</span>
                    {showResult && isCorrect && <Check className="h-3.5 w-3.5 text-emerald-500 ml-auto" />}
                    {showResult && isSelected && !isCorrect && <AlertCircle className="h-3.5 w-3.5 text-rose-500 ml-auto" />}
                  </div>
                </button>
              );
            })}
          </div>
          {submitted && q.explanation && (
            <div className="mt-2 rounded-md bg-foreground/5 p-2">
              <div className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">Explanation</div>
              <p className="text-xs text-foreground/80 italic">{q.explanation}</p>
            </div>
          )}
        </GlassCard>
      ))}

      <div className="flex items-center justify-between gap-3 pt-2">
        {submitted ? (
          <div className={cn(
            "text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5",
            passed ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
          )}>
            <Trophy className="h-4 w-4 inline mr-1" />
            {passed
              ? `Passed! ${correctCount}/${lesson.quiz.length} correct (${score}%)`
              : `Not yet — ${correctCount}/${lesson.quiz.length} correct (need ${passMark})`}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            {Object.keys(answers).length}/{lesson.quiz.length} answered
          </div>
        )}
        {!submitted ? (
          <GlassButton
            variant="primary"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < lesson.quiz.length}
          >
            Submit quiz
          </GlassButton>
        ) : (
          <GlassButton
            variant="primary"
            onClick={() => onComplete(score)}
          >
            See results &amp; review →
          </GlassButton>
        )}
      </div>

      {/* Post-submit hint — tell user they can review answers above before continuing */}
      {submitted && (
        <div className="rounded-lg bg-sky-500/10 border border-sky-500/30 p-3 text-xs text-sky-700 dark:text-sky-300">
          📋 <strong>Review your answers above.</strong> Each question shows whether you got it right
          (✓/✗), the correct answer highlighted in green, and an explanation. When you&apos;re ready,
          click <strong>“See results &amp; review →”</strong> to continue.
        </div>
      )}
    </div>
  );
}

// ============================================================
// Certificate generation — improved with editable name, language icon,
// skills mastered list, verify URL, watermark, actual lesson count, PDF print
// ============================================================

function generateCertificate(
  name: string,
  trackName: string,
  trackId: string,
  trackLessons: Lesson[],
) {
  // Use stored certificate if available (for accurate issue date + cert ID)
  const stored = useStore.getState().state.certificates[trackId];
  const certId = stored?.certId ?? `LP-${Date.now().toString(36).toUpperCase()}`;
  const issuedAt = stored?.issuedAt ?? new Date().toISOString();
  const date = new Date(issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const trackInfo = ALL_LANGUAGE_INFO[trackId];
  const trackIcon = trackInfo?.icon ?? "📘";
  const trackColor = trackInfo?.color ?? "#3B82F6";
  const lessonCount = trackLessons.length;
  const quizCount = trackLessons.reduce((sum, l) => sum + l.quiz.length, 0);
  // Skills mastered — pull 4-6 lesson titles
  const skillsMastered = trackLessons
    .filter((l) => !l.isCapstone)
    .slice(0, 6)
    .map((l) => l.title);
  const skillsList = skillsMastered.map((s) => `<li>${escapeHtml(s)}</li>`).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Launchpad Certificate — ${escapeHtml(name)} — ${escapeHtml(trackName)}</title>
  <style>
    @page { size: landscape; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; }
    .cert {
      width: 100vw; min-height: 100vh;
      background: linear-gradient(135deg, #fefce8 0%, #f0fdfa 50%, #fdf4ff 100%);
      padding: 50px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      position: relative;
      overflow: hidden;
    }
    /* Subtle Launchpad watermark behind content */
    .watermark {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg);
      font-size: 220px; font-weight: 900; color: rgba(45, 212, 191, 0.04);
      pointer-events: none; user-select: none; letter-spacing: -0.05em;
      z-index: 0;
    }
    .border {
      position: absolute; inset: 25px;
      border: 3px solid #1f2937; border-radius: 12px;
      z-index: 1;
    }
    .border-inner {
      position: absolute; inset: 33px;
      border: 1px solid #6b7280; border-radius: 8px;
      z-index: 1;
    }
    .content { position: relative; z-index: 2; text-align: center; max-width: 800px; }
    .logo {
      font-size: 36px; font-weight: bold; letter-spacing: -0.02em;
      background: linear-gradient(135deg, #2DD4BF 0%, #E879F9 50%, #FCD34D 100%);
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 4px;
    }
    .subtitle { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #6b7280; margin-bottom: 28px; }
    .title { font-size: 26px; font-weight: bold; color: #1f2937; margin-bottom: 6px; }
    .body-text { font-size: 14px; color: #4b5563; max-width: 600px; line-height: 1.6; margin: 0 auto 24px; }
    .name { font-size: 38px; font-weight: bold; font-style: italic; color: #111827; margin: 12px 0 24px; border-bottom: 2px solid #1f2937; padding-bottom: 6px; display: inline-block; min-width: 300px; }
    .track-row { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 8px; }
    .track-icon { font-size: 32px; }
    .track { font-size: 20px; color: #1f2937; font-weight: bold; }
    .track-detail { font-size: 13px; color: #6b7280; margin-bottom: 20px; }
    .skills-box { background: rgba(255,255,255,0.5); border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 20px; margin: 0 auto 28px; max-width: 500px; }
    .skills-title { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #6b7280; margin-bottom: 6px; }
    .skills-list { list-style: none; padding: 0; margin: 0; font-size: 11px; color: #374151; columns: 2; column-gap: 24px; }
    .skills-list li { padding: 2px 0; break-inside: avoid; }
    .signatures { display: flex; gap: 80px; margin-top: 28px; justify-content: center; }
    .sig { text-align: center; }
    .sig-line { width: 200px; border-top: 1px solid #1f2937; margin-bottom: 6px; }
    .sig-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; }
    .cert-id { position: absolute; bottom: 45px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #9ca3af; font-family: monospace; z-index: 2; }
    .seal {
      position: absolute; bottom: 70px; right: 70px;
      width: 90px; height: 90px; border-radius: 50%;
      background: linear-gradient(135deg, ${trackColor}, #E879F9);
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: bold; font-size: 12px; text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: rotate(-12deg);
      z-index: 2;
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
      <div class="title">Certificate of Completion</div>
      <div class="body-text">This certifies that the bearer has successfully completed all required lessons, exercises, and quizzes in the track below, demonstrating proficiency in the fundamentals of the technology.</div>
      <div class="name">${escapeHtml(name)}</div>
      <div class="track-row">
        <span class="track-icon">${trackIcon}</span>
        <span class="track">${escapeHtml(trackName)} Track</span>
      </div>
      <div class="track-detail">${lessonCount} lessons · ${quizCount} quiz questions · Completed ${date}</div>
      <div class="skills-box">
        <div class="skills-title">Skills Mastered</div>
        <ul class="skills-list">${skillsList}</ul>
      </div>
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
    <div class="seal">VERIFIED<br/>${date.split(",")[0]}</div>
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
