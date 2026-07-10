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
  Bookmark,
  Printer,
  MessageCircleQuestion,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { useStore, selectCertificateEligible, selectTrackQuizAverage, selectWeakAreas } from "@/lib/store";
import { GlassCard, GlassButton, ProgressBar } from "@/components/glass/GlassPrimitives";
import { cn, estimateReadTime } from "@/lib/utils";
import {
  getLessons,
  getLessonById,
  getLessonsForTrack,
  getAllTracks,
  ALL_LANGUAGE_INFO,
} from "@/lib/lessons-data";
import { getVideoLink, getPlaylist } from "@/data/youtube-links";
import { InlineCodeEditor } from "@/components/lesson/InlineCodeEditor";
import { openLanguageCertificatePdf } from "@/lib/certificate-pdf";
import { CertificateDetailDialog, useEarnedCertificates } from "@/components/views/CertificateHub";
import { AIVerifyDialog, type AIVerifyTarget } from "@/components/ai/AIVerifyDialog";
import { isDueForReview } from "@/lib/sm2";
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
  const [lessonFilter, setLessonFilter] = useState<"all" | "bookmarked" | "in-progress" | "completed">("all");
  const [showExploreMore, setShowExploreMore] = useState(false);
  // v5.924: certificate detail popup (opened by the "Certified" badge on a track card).
  const [certPopup, setCertPopup] = useState<ReturnType<typeof useEarnedCertificates>[number] | null>(null);
  // v5.925: AI-Verify dialog target for capstone lessons (lesson 21 of each track).
  const [capstoneVerifyTarget, setCapstoneVerifyTarget] = useState<AIVerifyTarget | null>(null);
  const earnedCerts = useEarnedCertificates();
  // v5.92 (Part 6): "Already completed" popup state — shown when the user
  // progresses sequentially to a lesson they'd already completed earlier.
  const [completedPopup, setCompletedPopup] = useState<{ lessonId: string; trackLessons: Lesson[] } | null>(null);
  const lessonProgress = useStore((s) => s.state.lessonProgress);
  const setLessonProgress = useStore((s) => s.setLessonProgress);
  const setPlaygroundCode = useStore((s) => s.setPlaygroundCode);
  const setView = useStore((s) => s.setView);
  const profile = useStore((s) => s.state.profile);
  const roadmap = useStore((s) => s.state.roadmap);
  const certificates = useStore((s) => s.state.certificates);
  const issueCertificate = useStore((s) => s.issueCertificate);
  const updateCertificateName = useStore((s) => s.updateCertificateName);

  // Section 1 (SM-2) + Section 3 (bookmarks) store hooks
  const state = useStore((s) => s.state);
  const toggleLessonBookmark = useStore((s) => s.toggleLessonBookmark);
  const reviewModeLessonId = useStore((s) => s.reviewModeLessonId);
  const startQuizReviewMode = useStore((s) => s.startQuizReviewMode);
  const weakAreas = useMemo(() => selectWeakAreas(state, 5), [state]);
  const bookmarkedLessons = state.bookmarkedLessons ?? [];

  const selectedLesson = useMemo(
    () => getLessonById(selectedLessonId),
    [selectedLessonId],
  );

  // v5.875 (CRIT-3): Guard against stale persisted lessonId. If the stored
  // selectedLessonId no longer maps to a real lesson (e.g., after content
  // changes, backup import with old IDs, or track restructuring), reset
  // to the tracks view instead of rendering a blank page.
  useEffect(() => {
    if (selectedLessonId && !selectedLesson) {
      console.warn("[LearnView] stale lessonId detected, resetting to tracks view:", selectedLessonId);
      setLearnTabState({ selectedLessonId: null, selectedTrack: null, tab: "tracks" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLessonId, selectedLesson]);

  // v5.875 (CRIT-3): If lessonId is stale (selected but lesson not found),
  // treat it as "no lesson selected" so the tracks view renders instead of blank.
  const effectiveSelectedLessonId = selectedLessonId && selectedLesson ? selectedLessonId : null;

  // v5.875 (CRIT-3): If the lesson is stale, show a brief loading spinner
  // while the useEffect above resets to the tracks view. This prevents a
  // blank page flash.
  if (selectedLessonId && !selectedLesson) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // v5.92 (Part 5): Push URL when lesson/track selection changes for deep-linking.
  // /learn/python/6 → track=python, lesson 6
  // /learn/python → track=python, lesson list
  // /learn → tracks grid
  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentPath = window.location.pathname;
    if (selectedLesson && selectedTrack) {
      // Extract lesson number from the lesson ID (e.g., "python-06" → "6")
      const match = selectedLesson.id.match(/-(\d+)$/);
      const lessonNum = match ? parseInt(match[1], 10) : null;
      if (lessonNum !== null) {
        const expectedPath = `/learn/${selectedTrack}/${lessonNum}`;
        if (currentPath !== expectedPath) {
          window.history.pushState(null, "", expectedPath);
        }
      } else if (selectedLesson.isCapstone) {
        const expectedPath = `/learn/${selectedTrack}/capstone`;
        if (currentPath !== expectedPath) {
          window.history.pushState(null, "", expectedPath);
        }
      }
    } else if (selectedTrack && !selectedLessonId) {
      // Track selected but no lesson → /learn/[trackId]
      const expectedPath = `/learn/${selectedTrack}`;
      if (currentPath !== expectedPath && !currentPath.startsWith(`/learn/${selectedTrack}/`)) {
        window.history.pushState(null, "", expectedPath);
      }
    } else if (!selectedTrack && currentPath !== "/learn") {
      // No track selected → /learn
      const currentBase = "/" + (currentPath.split("/").filter(Boolean).slice(0, 1).join("") || "");
      if (currentBase === "/learn") {
        window.history.pushState(null, "", "/learn");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLessonId, selectedTrack, selectedLesson]);

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
  if (tab === "tracks" && !effectiveSelectedLessonId) {
    return (
      <>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Learn</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalCompleted} of {getLessons().length} lessons complete across {allTracks.length} languages · Build real coding skills with structured lessons, code examples, and quizzes.
          </p>
        </div>

        {/* Section 1.5 — Weak Areas card (SM-2 spaced repetition) */}
        {weakAreas.length > 0 && (
          <GlassCard className="p-4 border-amber-500/30 bg-amber-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-semibold">🎯 Weak Areas — Review these before moving on</h2>
            </div>
            <div className="space-y-1.5">
              {weakAreas.map((w, i) => (
                <div key={`${w.lessonId}:${w.questionId}`} className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground font-mono w-5">{i + 1}.</span>
                  <span className="flex-1 truncate">
                    <span className="font-medium">{ALL_LANGUAGE_INFO[w.trackId]?.name ?? w.trackId}</span>
                    {" · "}
                    <span className="text-muted-foreground">{w.lessonTitle}</span>
                    {" — "}
                    <span className="text-rose-500">missed {w.incorrectCount}×</span>
                  </span>
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[10px]"
                    onClick={() => {
                      setSelectedTrack(w.trackId);
                      setSelectedLessonId(w.lessonId);
                      setTab("lesson");
                      startQuizReviewMode(w.lessonId);
                      window.scrollTo(0, 0);
                    }}
                  >
                    Review Now
                  </GlassButton>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Section 3.3 — Lesson filter chips */}
        <div className="flex flex-wrap gap-1.5">
          {([
            { id: "all", label: "All", count: getLessons().length },
            { id: "bookmarked", label: "⭐ Bookmarked", count: bookmarkedLessons.length },
            { id: "in-progress", label: "🔄 In Progress", count: Object.values(lessonProgress).filter((p) => p.status === "in-progress").length },
            { id: "completed", label: "✅ Completed", count: Object.values(lessonProgress).filter((p) => p.status === "complete").length },
          ] as const).map((chip) => (
            <button
              key={chip.id}
              onClick={() => setLessonFilter(chip.id)}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                lessonFilter === chip.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/60 text-muted-foreground hover:bg-foreground/5",
              )}
            >
              {chip.label} ({chip.count})
            </button>
          ))}
        </div>

        {/* Section 3 — Filtered lessons view (when a filter is active) */}
        {lessonFilter !== "all" && (() => {
          const filteredLessons = getLessons().filter((l) => {
            if (lessonFilter === "bookmarked") return bookmarkedLessons.includes(l.id);
            if (lessonFilter === "in-progress") return lessonProgress[l.id]?.status === "in-progress";
            if (lessonFilter === "completed") return lessonProgress[l.id]?.status === "complete";
            return true;
          });
          return (
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-3 font-mono">
                {lessonFilter === "bookmarked" && "⭐ Bookmarked lessons"}
                {lessonFilter === "in-progress" && "🔄 Lessons in progress"}
                {lessonFilter === "completed" && "✅ Completed lessons"}
                {" · "}{filteredLessons.length} lesson{filteredLessons.length !== 1 ? "s" : ""}
              </div>
              {filteredLessons.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    {lessonFilter === "bookmarked" && "No bookmarked lessons yet. Click the bookmark icon on any lesson to save it here."}
                    {lessonFilter === "in-progress" && "No lessons in progress. Start a lesson and it'll appear here."}
                    {lessonFilter === "completed" && "No completed lessons yet. Finish a lesson to see it here."}
                  </p>
                </GlassCard>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredLessons.map((l) => {
                    const langInfo = ALL_LANGUAGE_INFO[l.track];
                    const progress = lessonProgress[l.id];
                    return (
                      <GlassCard
                        key={l.id}
                        className="p-4 hover:scale-[1.01] transition-transform cursor-pointer"
                        onClick={() => {
                          setSelectedTrack(l.track);
                          setSelectedLessonId(l.id);
                          setTab("lesson");
                          window.scrollTo(0, 0);
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{langInfo?.icon ?? "📘"}</span>
                            <div>
                              <h3 className="font-bold text-sm line-clamp-1">{l.title}</h3>
                              <div className="text-[10px] text-muted-foreground font-mono">{langInfo?.name ?? l.track}</div>
                            </div>
                          </div>
                          {progress?.status === "complete" && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          )}
                          {bookmarkedLessons.includes(l.id) && (
                            <Bookmark className="h-3.5 w-3.5 fill-primary text-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">{l.description}</p>
                        <div className="text-[10px] text-primary mt-2 font-medium">Open lesson →</div>
                      </GlassCard>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* Section 1: Your Languages (from roadmap) — track cards (only when filter is "all") */}
        {lessonFilter === "all" && planTracks.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-3 font-mono">📚 Your languages · {planTracks.length} in your roadmap</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {planTracks.map((t) => {
                const trackLessons = getLessonsForTrack(t.id);
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
                      <div className="flex items-center gap-1">
                        {/* v5.924: Certified badge — opens the certificate detail popup. */}
                        {certificates[t.id] && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const c = earnedCerts.find((ec) => ec.kind === "language" && ec.trackId === t.id);
                              if (c) setCertPopup(c);
                            }}
                            title="Certificate earned — click to view & download"
                            className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 font-semibold uppercase hover:bg-teal-500/30 transition-colors"
                          >
                            <Award className="h-2.5 w-2.5" /> Certified
                          </button>
                        )}
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-semibold uppercase">
                          In Plan
                        </span>
                      </div>
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

        {/* Section 2: Explore More — all other languages, hidden by default (Section 4) */}
        {lessonFilter === "all" && exploreTracks.length > 0 && (
          <div>
            <button
              onClick={() => setShowExploreMore(!showExploreMore)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-foreground/3 hover:bg-foreground/5 transition-colors mb-3"
            >
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">🔍 Explore more · {exploreTracks.length} other languages</div>
              <span className="text-xs text-muted-foreground">
                {showExploreMore ? "Hide ▲" : "Show ▼"}
              </span>
            </button>
            {showExploreMore && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {exploreTracks.map((t) => {
                const trackLessons = getLessonsForTrack(t.id);
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
            )}
          </div>
        )}
      </div>
      {/* v5.924: certificate detail popup (opened by the "Certified" badge) */}
      <CertificateDetailDialog cert={certPopup} onClose={() => setCertPopup(null)} />
      {/* v5.925: AI-Verify dialog for capstone lessons. onVerified marks the
          capstone lesson complete (score 100) — satisfies certificate eligibility. */}
      {capstoneVerifyTarget && capstoneVerifyTarget.mode === "capstone" && (
        <AIVerifyDialog
          open={true}
          onOpenChange={(o) => { if (!o) setCapstoneVerifyTarget(null); }}
          target={capstoneVerifyTarget}
          onVerified={(result) => {
            if (result.passed) {
              const lesson = (capstoneVerifyTarget as Extract<AIVerifyTarget, { mode: "capstone" }>).lesson;
              setLessonProgress(lesson.id, "complete", 100);
              setTab("result");
              window.scrollTo(0, 0);
            }
          }}
        />
      )}
      </>
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
      <>
      <div className="space-y-4 lesson-content">
        {/* Breadcrumb + nav */}
        <div className="flex items-center justify-between gap-3 flex-wrap no-print">
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
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold">{selectedLesson.title}</h1>
                {/* Section 3 — Bookmark button */}
                <button
                  onClick={() => toggleLessonBookmark(selectedLesson.id)}
                  className="p-1 rounded hover:bg-foreground/10 transition-colors no-print"
                  aria-label={bookmarkedLessons.includes(selectedLesson.id) ? "Remove bookmark" : "Bookmark lesson"}
                  title={bookmarkedLessons.includes(selectedLesson.id) ? "Bookmarked — click to remove" : "Bookmark this lesson"}
                >
                  <Bookmark
                    className={cn(
                      "h-4 w-4",
                      bookmarkedLessons.includes(selectedLesson.id)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground",
                    )}
                  />
                </button>
                {/* Section 5 — Print button */}
                <button
                  onClick={() => window.print()}
                  className="p-1 rounded hover:bg-foreground/10 transition-colors no-print"
                  aria-label="Print lesson"
                  title="Print lesson — opens print dialog (choose 'Save as PDF' for a digital copy)"
                >
                  <Printer className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{selectedLesson.description}</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono shrink-0">
              {/* Section 4 — Read time estimate alongside official estMinutes */}
              <span className="flex items-center gap-1" title={`Official estimate: ${selectedLesson.estMinutes}m · Calculated read time: ${estimateReadTime(selectedLesson.blocks)}m`}>
                <Clock className="h-3 w-3" /> {selectedLesson.estMinutes}m · est. {estimateReadTime(selectedLesson.blocks)}m read
              </span>
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
        <div className="no-print">
          <YouTubeEmbed lessonId={selectedLesson.id} trackId={track} />
        </div>

        {/* Capstone badge (Section 3.4) */}
        {selectedLesson.isCapstone && (
          <div className="rounded-lg border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <div>
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">Capstone Project · Full Project Guide</div>
              <p className="text-[10px] text-muted-foreground">This is the capstone for the {ALL_LANGUAGE_INFO[track]?.name ?? track} track. Build it end-to-end and submit your repo.</p>
            </div>
          </div>
        )}

        {/* Lesson content — capstone uses structured layout (Section 3.4) */}
        {selectedLesson.isCapstone ? (
          <CapstoneLayout blocks={selectedLesson.blocks} onTryInPlayground={(code, language) => {
            // v5.77 fix: pass the actual code-block language through to the playground.
            // Previously this hardcoded "javascript", sending Python/TS/SQL/HTML code
            // to the JS runner where it failed with confusing syntax errors.
            setPlaygroundCode(code, language || "javascript");
            setView("playground");
          }} />
        ) : (
          <div className="space-y-3">
            {selectedLesson.blocks.map((block, i) => (
              // Section 20 — key includes lessonId so the editor remounts
              // fresh when the user navigates to a different lesson/phase.
              // Previously key={i} caused React to reuse the same instance,
              // retaining the previous lesson's code/output.
              <LessonBlockView key={`${selectedLesson.id}:${i}`} block={block} onTryInPlayground={(code, language) => {
                // v5.77 fix: pass the actual code-block language through.
                setPlaygroundCode(code, language || "javascript");
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
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 no-print">
          <div className="flex gap-2">
            {prev && (
              <GlassButton variant="ghost" size="sm" onClick={() => { setSelectedLessonId(prev.id); window.scrollTo(0, 0); }}>
                <ChevronLeft className="h-4 w-4" /> {prev.title}
              </GlassButton>
            )}
            {next && (
              <GlassButton variant="ghost" size="sm" onClick={() => {
                // v5.92 (Part 6): If the next lesson was already completed
                // (e.g. from a roadmap deep-link jump-ahead), show the
                // "already completed — retry or skip?" popup instead of
                // navigating directly.
                const nextProgress = lessonProgress[next.id];
                if (nextProgress?.status === "complete") {
                  const trackLessons = getLessonsForTrack(selectedLesson.track);
                  setCompletedPopup({ lessonId: next.id, trackLessons });
                } else {
                  setSelectedLessonId(next.id);
                  setLessonProgress(selectedLesson.id, "in-progress");
                  window.scrollTo(0, 0);
                }
              }}>
                {next.title} <ChevronRight className="h-4 w-4" />
              </GlassButton>
            )}
          </div>
          {/* v5.925 (BUG 4): capstones (lesson 21) have no quiz — the old "Take
              the quiz" button was a dead end that blocked certificate issuance.
              Replace it with an "AI Verify" button that opens the shared
              AIVerifyDialog. A verified capstone marks the lesson complete,
              satisfying the "all 21 lessons complete" certificate requirement. */}
          {selectedLesson.isCapstone && selectedLesson.quiz.length === 0 ? (
            <GlassButton
              variant="primary"
              onClick={() => {
                const trackName = ALL_LANGUAGE_INFO[selectedLesson.track]?.name ?? selectedLesson.track;
                setCapstoneVerifyTarget({ mode: "capstone", lesson: selectedLesson, trackName });
              }}
            >
              <Trophy className="h-4 w-4" /> AI Verify Capstone
            </GlassButton>
          ) : (
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
          )}
        </div>
      </div>
      {/* v5.925: AI-Verify dialog for capstone lessons (lesson-tab view). */}
      {capstoneVerifyTarget && capstoneVerifyTarget.mode === "capstone" && (
        <AIVerifyDialog
          open={true}
          onOpenChange={(o) => { if (!o) setCapstoneVerifyTarget(null); }}
          target={capstoneVerifyTarget}
          onVerified={(result) => {
            if (result.passed) {
              const lesson = (capstoneVerifyTarget as Extract<AIVerifyTarget, { mode: "capstone" }>).lesson;
              setLessonProgress(lesson.id, "complete", 100);
              setTab("result");
              window.scrollTo(0, 0);
            }
          }}
        />
      )}
      </>
    );
  }

  // Quiz view — wraps QuizView with a mode picker (Section 1.4)
  if (tab === "quiz" && selectedLesson) {
    return (
      <QuizModePicker
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
    // v5.77 fix: guard against idx === -1 (lesson not found in track) so
    // "Next lesson" doesn't jump to trackLessons[0].
    const next = idx >= 0 && idx < trackLessons.length - 1 ? trackLessons[idx + 1] : null;

    // Check if entire track is complete
    // v5.77 fix: guard against empty trackLessons (every() returns true on []).
    const trackComplete = trackLessons.length > 0 && trackLessons.every((l) => lessonProgress[l.id]?.status === "complete");

    // Certificate eligibility per Section 1.1 (75% average quiz score required)
    // v5.77 fix: use the subscribed `state` instead of useStore.getState() so
    // the UI updates reactively when a certificate is issued or quiz scores change.
    const certEligible = selectCertificateEligible(state, track, trackLessons);
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
                    {/* v5.866 BUG 1B FIX: Only show "Download" if a cert was actually
                        issued (stored in state with a real certId from Supabase).
                        If no cert is stored, show "Issue certificate" instead,
                        which calls issueCertificate and handles failure properly. */}
                    {certificates[track] ? (
                      <>
                        <GlassButton
                          variant="primary"
                          onClick={() => {
                            const existing = certificates[track];
                            const name = window.prompt("Edit your name for the certificate:", existing.name);
                            if (name === null) return;
                            const finalName = name.trim() || "Learner";
                            if (existing.name !== finalName) {
                              updateCertificateName(track, finalName);
                            }
                            openLanguageCertificatePdf(finalName, trackName, track, trackLessons);
                          }}
                        >
                          <Award className="h-4 w-4" /> Download certificate (PDF)
                        </GlassButton>
                        <GlassButton
                          variant="ghost"
                          onClick={() => {
                            const existing = certificates[track];
                            const name = window.prompt("Edit your name on this certificate:", existing.name);
                            if (name === null) return;
                            const finalName = name.trim() || "Learner";
                            updateCertificateName(track, finalName);
                            openLanguageCertificatePdf(finalName, trackName, track, trackLessons);
                          }}
                        >
                          Edit name
                        </GlassButton>
                      </>
                    ) : (
                      <GlassButton
                        variant="primary"
                        onClick={async () => {
                          const defaultName = profile.name ?? "Learner";
                          const name = window.prompt("Edit your name for the certificate:", defaultName);
                          if (name === null) return;
                          const finalName = name.trim() || "Learner";
                          // v5.866 BUG 1B FIX: await the result and check for failure.
                          // If issueCertificate returns "", the cert was NOT issued.
                          // Show an error and do NOT generate a PDF with a fake ID.
                          const resultCertId = await issueCertificate(track, trackName, finalName);
                          if (!resultCertId) {
                            // v5.868 BUG B FIX: show a specific error message based on the cause.
                            // If the track has no lessons (gap language), explain that.
                            // Otherwise, it's likely a server issue or incomplete progress.
                            const trackLessonsCheck = getLessonsForTrack(track);
                            if (trackLessonsCheck.length === 0) {
                              alert(
                                "Certificates are not available for this technology yet — it doesn't have a full lesson track.\n\n" +
                                "Try completing a track from the 30 core languages (Python, JavaScript, etc.) that have full 21-lesson content."
                              );
                            } else {
                              alert(
                                "Certificate could not be issued. This may be a temporary server issue — please try again in a moment.\n\n" +
                                "Your progress is saved. The certificate will be issued automatically on your next visit or when you complete another quiz."
                              );
                            }
                            return;
                          }
                          // Success — generate the PDF with the real certId
                          openLanguageCertificatePdf(finalName, trackName, track, trackLessons);
                        }}
                      >
                        <Award className="h-4 w-4" /> Issue certificate
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

  // v5.92 (Part 6): Update the module-level lessonProgress reference for the popup.
  lessonProgressGlobal = lessonProgress as Record<string, { status: string }>;

  // v5.92 (Part 6): Render the "already completed" popup if active.
  if (completedPopup) {
    const retryLesson = () => {
      setLessonProgress(completedPopup.lessonId, "in-progress");
      setSelectedLessonId(completedPopup.lessonId);
      window.scrollTo(0, 0);
    };
    const skipLesson = () => {
      const idx = completedPopup.trackLessons.findIndex((l) => l.id === completedPopup.lessonId);
      const nextIncomplete = completedPopup.trackLessons.slice(idx + 1).find(
        (l) => lessonProgress[l.id]?.status !== "complete"
      );
      if (nextIncomplete) {
        setSelectedLessonId(nextIncomplete.id);
      }
      window.scrollTo(0, 0);
    };

    return (
      <AlreadyCompletedPopup
        lessonId={completedPopup.lessonId}
        trackLessons={completedPopup.trackLessons}
        onRetry={retryLesson}
        onSkip={skipLesson}
        onClose={() => setCompletedPopup(null)}
      />
    );
  }

  // v5.924: The CertificateDetailDialog is rendered at the end of each tab's
  // JSX (not as an early return) so the dialog portal overlays the Learn tab
  // instead of unmounting it. See the tracks-tab return below.

  return null;
}
// v5.92 (Part 6): "Already completed" popup
// Shown when a user progresses sequentially to a lesson they'd already
// completed (e.g. from a roadmap deep-link jump-ahead).
// ============================================================

function AlreadyCompletedPopup({
  lessonId,
  trackLessons,
  onRetry,
  onSkip,
  onClose,
}: {
  lessonId: string;
  trackLessons: Lesson[];
  onRetry: () => void;
  onSkip: () => void;
  onClose: () => void;
}) {
  const lesson = trackLessons.find((l) => l.id === lessonId);
  if (!lesson) return null;

  // Find the next incomplete lesson after this one
  const currentIdx = trackLessons.findIndex((l) => l.id === lessonId);
  const nextIncomplete = trackLessons.slice(currentIdx + 1).find(
    (l) => lessonProgressGlobal[l.id]?.status !== "complete"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <GlassCard className="max-w-md w-full p-6 border-2 border-amber-500/40">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base">You&apos;ve already completed this lesson</h3>
            <p className="text-sm text-muted-foreground mt-1">
              &ldquo;{lesson.title}&rdquo; was completed previously. Would you like to retry it or skip to the next incomplete lesson?
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <GlassButton
            variant="primary"
            onClick={() => { onRetry(); onClose(); }}
            className="w-full justify-center"
          >
            <RotateCcw className="h-4 w-4" /> Retry this lesson
          </GlassButton>
          <GlassButton
            variant="ghost"
            onClick={() => { onSkip(); onClose(); }}
            className="w-full justify-center"
          >
            Skip to {nextIncomplete ? `next incomplete (${nextIncomplete.title})` : "end of track"}
            <ChevronRight className="h-4 w-4" />
          </GlassButton>
        </div>
        <button
          onClick={onClose}
          className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Stay on current lesson
        </button>
      </GlassCard>
    </div>
  );
}

// v5.92 (Part 6): Helper to access lessonProgress from the popup component.
// We use a module-level reference that's updated by the LearnView component.
let lessonProgressGlobal: Record<string, { status: string }> = {};

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
        onClick={() => {
          const next = !expanded;
          setExpanded(next);
          // v5.925 FIX (BUG 2): increment the real video-watch counter when the
          // user expands a video supplement (the explicit "watch" action).
          // Powers the "Video Scholar" badge. Only counts on expand (not collapse).
          if (next && typeof window !== "undefined") {
            try {
              const cur = Number(window.localStorage.getItem("launchpad:video-watched-count") ?? "0");
              window.localStorage.setItem("launchpad:video-watched-count", String(cur + 1));
            } catch { /* ignore */ }
          }
        }}
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
  onTryInPlayground: (code: string, language?: string) => void;
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
  onTryInPlayground: (code: string, language?: string) => void;
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

// ============================================================
// Section 1.4 — Quiz Mode Picker (fresh quiz vs review difficult questions)
// ============================================================

function QuizModePicker({
  lesson,
  onComplete,
  onBack,
}: {
  lesson: Lesson;
  onComplete: (score: number) => void;
  onBack: () => void;
}) {
  const [mode, setMode] = useState<"picker" | "fresh" | "review">("picker");
  const questionRecords = useStore((s) => s.state.questionRecords);

  // Compute review questions: those due for review OR marked "hard".
  const reviewQuestions = useMemo(() => {
    return lesson.quiz.filter((q) => {
      const key = `${lesson.id}:${q.id}`;
      const rec = questionRecords?.[key];
      if (!rec) return false;
      return rec.difficulty === "hard" || new Date(rec.nextReviewDate).getTime() <= Date.now();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, questionRecords]);

  if (mode === "picker") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> Back to lesson
          </button>
        </div>

        <GlassCard className="p-5">
          <h2 className="text-lg font-bold mb-1">{lesson.title} — Quiz</h2>
          <p className="text-xs text-muted-foreground mb-4">How would you like to take this quiz?</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setMode("fresh")}
              className="text-left p-4 rounded-xl border-2 border-border/60 hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Take fresh quiz</span>
              </div>
              <p className="text-xs text-muted-foreground">All {lesson.quiz.length} questions</p>
            </button>

            <button
              onClick={() => setMode("review")}
              disabled={reviewQuestions.length === 0}
              className={cn(
                "text-left p-4 rounded-xl border-2 transition-all",
                reviewQuestions.length === 0
                  ? "border-border/40 opacity-50 cursor-not-allowed"
                  : "border-amber-500/40 hover:border-amber-500 hover:bg-amber-500/5",
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <RefreshCw className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold">Review difficult questions</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {reviewQuestions.length > 0
                  ? `${reviewQuestions.length} question${reviewQuestions.length !== 1 ? "s" : ""} due for review`
                  : "No questions due — take a fresh quiz instead"}
              </p>
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <QuizView
      lesson={lesson}
      onComplete={onComplete}
      onBack={onBack}
      reviewMode={mode === "review"}
      reviewQuestions={mode === "review" ? reviewQuestions : undefined}
    />
  );
}

function QuizView({
  lesson,
  onComplete,
  onBack,
  reviewMode = false,
  reviewQuestions,
}: {
  lesson: Lesson;
  onComplete: (score: number) => void;
  onBack: () => void;
  /** Section 1.4 — if true, only show reviewQuestions (due/hard). */
  reviewMode?: boolean;
  /** The subset of questions to show in review mode. */
  reviewQuestions?: QuizQuestion[];
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const recordQuizAnswer = useStore((s) => s.recordQuizAnswer);
  const createChatConversation = useStore((s) => s.createChatConversation);
  const addChatMessage = useStore((s) => s.addChatMessage);
  const setView = useStore((s) => s.setView);
  const setActiveChat = useStore((s) => s.setActiveChat);
  const setAiTutorOpen = useStore((s) => s.setAiTutorOpen);

  // v5.87 FIX: Shuffle quiz options at render time to eliminate the
  // "correct answer is always B" bias found in auto-generated tracks.
  // The shuffle is deterministic per question ID (seeded by the question ID
  // string) so the same question always shuffles the same way within a
  // session — but different questions get different shuffles, eliminating
  // any pattern. This is a render-time fix that works for ALL tracks
  // without needing to edit the 6MB lessons-content.ts data file.
  const questions = useMemo(() => {
    const rawQuestions = reviewMode && reviewQuestions ? reviewQuestions : lesson.quiz;
    // v5.87: shuffle each question's options deterministically
    return rawQuestions.map((q) => {
      // Create a simple seeded shuffle based on the question ID
      const seed = q.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      const indices = q.options.map((_, i) => i);
      // Fisher-Yates shuffle with seeded PRNG
      let s = seed;
      for (let i = indices.length - 1; i > 0; i--) {
        s = (s * 9301 + 49297) % 233280;
        const j = Math.floor((s / 233280) * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      // Build new options array and find new correctIndex
      const shuffledOptions = indices.map((i) => q.options[i]);
      const newCorrectIndex = indices.indexOf(q.correctIndex);
      return {
        ...q,
        options: shuffledOptions,
        correctIndex: newCorrectIndex,
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, lesson.quiz, reviewMode, reviewQuestions]);

  // v5.925 FIX (BUG 1 — quiz scoring race condition): Previously `questions`
  // depended on `reviewQuestions` (review mode), which is itself a derived
  // array whose reference changes synchronously inside handleSubmit →
  // recordQuizAnswer → store updates questionRecords → SM-2 filter drops
  // just-answered (correct) questions from the "due" set. That meant the
  // `questions` array (and thus the `score` useMemo) recomputed BETWEEN the
  // user clicking Submit and the result rendering — the question set shrank,
  // correctly-answered questions vanished, and the score was computed
  // against the new smaller set (appearing "marked wrong"). On retry the
  // churn didn't recur so the same answer scored correctly.
  //
  // Fix: freeze a snapshot of the questions + the user's answers at submit
  // time. Scoring and the result display read from the snapshot, never the
  // live (mutating) `questions` array. The live `questions` is still used to
  // render the interactive quiz pre-submit.
  const [submittedSnapshot, setSubmittedSnapshot] = useState<
    | { questions: typeof questions; answers: Record<string, number> }
    | null
  >(null);

  const score = useMemo(() => {
    // Use the frozen snapshot once submitted; otherwise compute live (pre-submit
    // display only — never used for the recorded score).
    const qs = submitted ? (submittedSnapshot?.questions ?? questions) : questions;
    if (qs.length === 0) return 0;
    const ans = submitted ? (submittedSnapshot?.answers ?? answers) : answers;
    let correct = 0;
    for (const q of qs) {
      if (ans[q.id] === q.correctIndex) correct++;
    }
    return Math.round((correct / qs.length) * 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, questions, submitted, submittedSnapshot]);

  const correctCount = useMemo(() => {
    const qs = submitted ? (submittedSnapshot?.questions ?? questions) : questions;
    const ans = submitted ? (submittedSnapshot?.answers ?? answers) : answers;
    let c = 0;
    for (const q of qs) {
      if (ans[q.id] === q.correctIndex) c++;
    }
    return c;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, questions, submitted, submittedSnapshot]);

  const passMark = Math.max(1, Math.ceil(questions.length * 0.7)); // 70%
  const passed = correctCount >= passMark;

  const handleSubmit = () => {
    // Freeze the question set + answers BEFORE recording anything, so the
    // SM-2 churn triggered by recordQuizAnswer cannot shrink the set we
    // score against.
    setSubmittedSnapshot({ questions, answers });
    setSubmitted(true);
    // Record each answer in the store (per-question tracking per Section 1.1)
    for (const q of questions) {
      const sel = answers[q.id];
      if (sel !== undefined) {
        recordQuizAnswer(lesson.id, q.id, sel, sel === q.correctIndex);
      }
    }
    // Track review-mode usage for the Spaced Repeater badge (Section 1.4).
    if (reviewMode && typeof window !== "undefined") {
      try {
        const cur = Number(window.localStorage.getItem("launchpad:review-mode-count") ?? "0");
        window.localStorage.setItem("launchpad:review-mode-count", String(cur + 1));
      } catch { /* ignore */ }
    }
  };

  // Section 6/11 — "I don't understand" button. Opens the AI Tutor floating
  // bubble with a pending message that auto-sends. This is the unified bubble
  // style — same interaction as the Projects "Get AI Review" button.
  const setPendingTutorMessage = useStore((s) => s.setPendingTutorMessage);
  const openTutorWithQuestion = (q: QuizQuestion) => {
    const prompt = `I'm stuck on this quiz question from "${lesson.title}":\n\n**Question:** ${q.question}\n\n**Options:**\n${q.options.map((o, i) => `${i + 1}. ${o}`).join("\n")}\n\n**Correct answer:** ${q.options[q.correctIndex]}\n\n**Explanation:** ${q.explanation ?? "(no explanation provided)"}\n\nCan you explain this in a different way? I don't understand the explanation.`;
    // Set the pending message — the AI Tutor bubble will pick it up and auto-send
    setPendingTutorMessage(prompt);
    setAiTutorOpen(true);
    if (typeof window !== "undefined") {
      try {
        const cur = Number(window.localStorage.getItem("launchpad:tutor-from-quiz-count") ?? "0");
        window.localStorage.setItem("launchpad:tutor-from-quiz-count", String(cur + 1));
      } catch { /* ignore */ }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Back to lesson
        </button>
        <div className="text-[10px] text-muted-foreground font-mono">
          {reviewMode ? `Review mode · ${questions.length} due question${questions.length !== 1 ? "s" : ""}` : `${questions.length} questions · Need ${passMark}/${questions.length} to pass`}
        </div>
      </div>

      <GlassCard className={cn("p-5", reviewMode && "border-amber-500/30 bg-amber-500/5")}>
        <h2 className="text-lg font-bold mb-1">{lesson.title} — {reviewMode ? "Review Quiz" : "Quiz"}</h2>
        <p className="text-xs text-muted-foreground">
          {reviewMode
            ? "🔁 Spaced repetition review — these are your most-missed questions. Re-answer them to update your SM-2 schedule."
            : "Pick the best answer for each question. Explanations appear after you submit."}
        </p>
      </GlassCard>

      {questions.length === 0 ? (
        <GlassCard className="p-6 text-center">
          <p className="text-sm text-emerald-500 font-medium">✅ No questions due for review — you&apos;re on top of it!</p>
          <p className="text-xs text-muted-foreground mt-2">Take a fresh quiz instead to keep practicing.</p>
        </GlassCard>
      ) : (
        <>
      {/* v5.925: iterate the frozen snapshot after submit so the displayed
          result set matches the set we scored against (immune to SM-2 churn). */}
      {(submitted ? (submittedSnapshot?.questions ?? questions) : questions).map((q, qi) => {
        const displayQs = submitted ? (submittedSnapshot?.questions ?? questions) : questions;
        const displayAns = submitted ? (submittedSnapshot?.answers ?? answers) : answers;
        return (
        <GlassCard key={q.id} className="p-4">
          <div className="flex items-start gap-2 mb-3">
            <span className="text-[10px] font-mono text-muted-foreground mt-0.5 shrink-0">
              Question {qi + 1} of {displayQs.length}
            </span>
            <p className="text-sm font-medium flex-1">{q.question}</p>
          </div>
          <div className="space-y-1.5">
            {q.options.map((opt, oi) => {
              const isSelected = displayAns[q.id] === oi;
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
          {/* Section 6 — "I don't understand" button. Only shown after submit. */}
          {submitted && (
            <button
              onClick={() => openTutorWithQuestion(q)}
              className="mt-2 text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors no-print"
              title="Get a different explanation from the AI Tutor"
            >
              <MessageCircleQuestion className="h-3.5 w-3.5" /> I don&apos;t understand — ask the AI Tutor
            </button>
          )}
        </GlassCard>
        );
      })}

      <div className="flex items-center justify-between gap-3 pt-2">
        {submitted ? (
          <div className={cn(
            "text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5",
            passed ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
          )}>
            <Trophy className="h-4 w-4 inline mr-1" />
            {/* v5.925: use snapshot length so the count is stable post-submit. */}
            {passed
              ? `Passed! ${correctCount}/${(submittedSnapshot?.questions ?? questions).length} correct (${score}%)`
              : `Not yet — ${correctCount}/${(submittedSnapshot?.questions ?? questions).length} correct (need ${passMark})`}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            {Object.keys(answers).length}/{questions.length} answered
          </div>
        )}
        {!submitted ? (
          <GlassButton
            variant="primary"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
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
        </>
      )}
    </div>
  );
}
