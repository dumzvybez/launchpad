"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import {
  GraduationCap,
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
  PlayCircle,
  Code2,
  Target,
  Youtube,
  Lock,
  CheckCircle2,
  Bookmark,
  Printer,
  MessageCircleQuestion,
  RefreshCw,
  RotateCcw,
  X,
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
import { NextLessonCard, LessonSidebar, LessonHeader, LessonNavigation } from "@/components/learning";
import { AnimatePresence, motion } from "framer-motion";
import { isDueForReview } from "@/lib/sm2";
import type { Lesson, QuizQuestion } from "@/lib/types";
// v6.0: stable identity helpers
import { resolveRef, quizRef, getLessonByRef } from "@/lib/identity";
import { QUIZ_PASS_MARK } from "@/lib/constants";
// v6.2: lazy per-track content loading + metadata-based counts
import { loadTrackContent } from "@/lib/content-loader";
import { getTotalLessonCount } from "@/lib/lessons-meta";

type Tab = "tracks" | "lesson" | "quiz" | "result";

// v6.006 fix: LessonBlockView's onTryInPlayground passes language as a generic
// string (code blocks can be any language), but setPlaygroundCode expects a
// specific union. This helper validates and narrows the type at runtime.
const PLAYGROUND_LANGUAGES = ["javascript", "typescript", "python", "html", "css", "sql", "bash"] as const;
type PlaygroundLanguage = (typeof PLAYGROUND_LANGUAGES)[number];
function toPlaygroundLanguage(lang: string | undefined): PlaygroundLanguage {
  if (lang && (PLAYGROUND_LANGUAGES as readonly string[]).includes(lang)) {
    return lang as PlaygroundLanguage;
  }
  return "javascript";
}

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
  // v6.010: course outline panel state — single source of truth for both the
  // desktop slide-in panel and the mobile bottom-sheet drawer. The lesson
  // view defaults to HIDDEN so the reading column is the focus.
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [mobileOutlineOpen, setMobileOutlineOpen] = useState(false);
  // v5.924: certificate detail popup (opened by the "Certified" badge on a track card).
  const [certPopup, setCertPopup] = useState<ReturnType<typeof useEarnedCertificates>[number] | null>(null);
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
    // v6.0: selectedLessonId is now a stable slug (post-migration). getLessonByRef
    // resolves slug → positional id → Lesson. Falls back to getLessonById for legacy.
    () => getLessonByRef(selectedLessonId),
    [selectedLessonId],
  );

  // v6.2: Load track content on-demand when a track is selected. This replaces
  // the v6.0–v6.1 eager 11MB bundle load with a ~200-470KB per-track fetch.
  // The track LIST view (no track selected) uses metadata only — no fetch.
  //
  // v6.2.1 FIX (lazy-loading race): When the user clicks "Explore"/"Start" on
  // a NON-preloaded track, the click handler runs getLessonsForTrack(trackId)
  // synchronously — which returns [] because the track JSON hasn't been
  // fetched yet. So selectedLessonId is set to null and tab is set to "lesson",
  // producing a blank <main> (no render branch matches). This effect now
  // auto-selects the first lesson once the track content arrives, so the lesson
  // view appears instead of a blank screen. If the track has no content (e.g.
  // a metadata-only track with no compiled JSON), it resets to the tracks view.
  useEffect(() => {
    if (!selectedTrack) return;
    loadTrackContent(selectedTrack).then((lessons) => {
      if (lessons.length === 0) {
        // Track has no content (e.g. "git" — present in metadata but no JSON).
        // Reset to the tracks view so the user isn't stuck on a blank screen.
        setLearnTabState({ selectedTrack: null, selectedLessonId: null, tab: "tracks" });
        return;
      }
      // Content arrived. If the user is on the lesson tab but no lesson was
      // selected (because the click handler couldn't pick one pre-load),
      // auto-select the first incomplete lesson (or the first lesson).
      const currentLessonId = useStore.getState().state.learnTabState.selectedLessonId;
      const currentTab = useStore.getState().state.learnTabState.tab;
      if (currentTab === "lesson" && !currentLessonId) {
        const progress = useStore.getState().state.lessonProgress;
        const nextIncomplete = lessons.find(
          (l) => progress[resolveRef(l.id)]?.status !== "complete",
        );
        setLearnTabState({ selectedLessonId: nextIncomplete?.id ?? lessons[0]?.id ?? null });
      } else {
        // Content for an already-selected lesson arrived — just flush a re-render
        // so trackLessons selectors return data.
        useStore.setState((s) => ({ ...s }));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrack]);

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

  // v5.92 (Part 5): Push URL when lesson/track selection changes for deep-linking.
  // /learn/python/6 → track=python, lesson 6
  // /learn/python → track=python, lesson list
  // /learn → tracks grid
  // NOTE: This useEffect MUST run before any early-return guard below, per the
  // React rules-of-hooks (all hooks must run in the same order every render).
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

  // v5.875 (CRIT-3): If the lesson is stale, show a brief loading spinner
  // while the useEffect above resets to the tracks view. This prevents a
  // blank page flash. (Moved BELOW all hooks to satisfy rules-of-hooks.)
  if (selectedLessonId && !selectedLesson) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

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
            {totalCompleted} of {getTotalLessonCount()} lessons complete across {allTracks.length} languages · Build real coding skills with structured lessons, code examples, and quizzes.
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
            { id: "all", label: "All", count: getTotalLessonCount() },
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
            if (lessonFilter === "bookmarked") return bookmarkedLessons.includes(resolveRef(l.id));
            if (lessonFilter === "in-progress") return lessonProgress[resolveRef(l.id)]?.status === "in-progress";
            if (lessonFilter === "completed") return lessonProgress[resolveRef(l.id)]?.status === "complete";
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
                    const progress = lessonProgress[resolveRef(l.id)];
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
                          {bookmarkedLessons.includes(resolveRef(l.id)) && (
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
                const completed = trackLessons.filter((l) => lessonProgress[resolveRef(l.id)]?.status === "complete").length;
                const pct = trackLessons.length ? Math.round((completed / trackLessons.length) * 100) : 0;
                return (
                  <GlassCard key={t.id} className="p-4 hover:scale-[1.01] transition-transform cursor-pointer" onClick={() => {
                    setSelectedTrack(t.id);
                    const nextIncomplete = trackLessons.find((l) => lessonProgress[resolveRef(l.id)]?.status !== "complete");
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
                const completed = trackLessons.filter((l) => lessonProgress[resolveRef(l.id)]?.status === "complete").length;
                const pct = trackLessons.length ? Math.round((completed / trackLessons.length) * 100) : 0;
                return (
                  <GlassCard key={t.id} className="p-4 hover:scale-[1.01] transition-transform cursor-pointer opacity-90 hover:opacity-100" onClick={() => {
                    setSelectedTrack(t.id);
                    const nextIncomplete = trackLessons.find((l) => lessonProgress[resolveRef(l.id)]?.status !== "complete");
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
      </>
    );
  }

  // v6.2.1: Loading guard for the lazy-load race. When the user clicks
  // "Explore"/"Start" on a non-preloaded track, tab is set to "lesson" but
  // selectedLesson is null until the track JSON arrives and the auto-select
  // effect (above) picks the first lesson. Show a spinner during that gap
  // instead of a blank <main>. Also covers the brief window when a preloaded
  // track's lesson is being resolved by getLessonByRef.
  if (tab === "lesson" && selectedTrack && !selectedLesson) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading {ALL_LANGUAGE_INFO[selectedTrack]?.name ?? selectedTrack} lessons…</p>
      </div>
    );
  }

  // Lesson view
  if (tab === "lesson" && selectedLesson) {
    const progress = lessonProgress[resolveRef(selectedLesson.id)];
    const track = selectedLesson.track;
    const trackLessons = getLessonsForTrack(track);
    const idx = trackLessons.findIndex((l) => l.id === selectedLesson.id);
    const prev = idx > 0 ? trackLessons[idx - 1] : null;
    const next = idx < trackLessons.length - 1 ? trackLessons[idx + 1] : null;

    // v6.010: Shared handler for selecting a lesson from the outline or the
    // prev/next nav. Preserves the v5.92 "already completed" popup logic.
    const handleSelectLesson = (lessonId: string) => {
      const targetProgress = lessonProgress[resolveRef(lessonId)];
      setOutlineOpen(false);
      setMobileOutlineOpen(false);
      if (targetProgress?.status === "complete") {
        const tl = getLessonsForTrack(selectedLesson.track);
        setCompletedPopup({ lessonId, trackLessons: tl });
      } else {
        setSelectedLessonId(lessonId);
        setLessonProgress(selectedLesson.id, "in-progress");
        window.scrollTo(0, 0);
      }
    };

    // v5.92 (Part 6): "Next" navigation handler — same as handleSelectLesson
    // but never auto-closes the desktop outline (the user might be reading
    // inline). Kept explicit for clarity.
    const handleNext = () => {
      if (!next) return;
      const nextProgress = lessonProgress[resolveRef(next.id)];
      if (nextProgress?.status === "complete") {
        const tl = getLessonsForTrack(selectedLesson.track);
        setCompletedPopup({ lessonId: next.id, trackLessons: tl });
      } else {
        setSelectedLessonId(next.id);
        setLessonProgress(selectedLesson.id, "in-progress");
        window.scrollTo(0, 0);
      }
    };
    const handlePrev = () => {
      if (!prev) return;
      setSelectedLessonId(prev.id);
      window.scrollTo(0, 0);
    };

    // v6.010: Suppress the FIRST heading block when it duplicates the lesson
    // title. The page <h1> in LessonHeader is already the canonical title;
    // rendering the same string as an <h2> immediately below was flagged by
    // the VLM audit as a redundant title block. This is a pure UI
    // deduplication — the underlying block data is unchanged.
    const lessonTitleNorm = selectedLesson.title.trim().toLowerCase();
    const isDuplicateTitleBlock = (block: Lesson["blocks"][number], idx: number) =>
      idx === 0 &&
      block.kind === "heading" &&
      block.content.trim().toLowerCase() === lessonTitleNorm;

    return (
      <>
      {/* v6.010: Reading-first layout. The lesson content is the focus — a
          single centered column (max-w-3xl, slightly wider on xl). The
          course outline is HIDDEN by default and revealed via a toggle in
          LessonHeader. The outline slides in as an OVERLAY (desktop) or a
          bottom-sheet drawer (mobile) so the reading column never shifts. */}
      <div className="relative">
        {/* ─── Desktop slide-in outline panel (overlay) ─────────────────── */}
        <AnimatePresence>
          {outlineOpen && (
            <>
              {/* Backdrop — click to close. Desktop only. */}
              <motion.div
                key="outline-backdrop"
                className="hidden lg:block fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setOutlineOpen(false)}
                aria-hidden
              />
              {/* Slide-in panel — anchored left, fills viewport height. */}
              <motion.aside
                key="outline-panel"
                className="hidden lg:flex fixed top-0 left-0 bottom-0 z-50 w-[340px] max-w-[85vw] flex-col glass-elevated border-r border-border/60 shadow-2xl overflow-hidden"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 34 }}
                aria-label="Course outline"
              >
                <div className="p-3 flex-1 min-h-0 flex">
                  <LessonSidebar
                    lessons={trackLessons}
                    currentLessonId={selectedLesson.id}
                    lessonProgress={lessonProgress}
                    onSelectLesson={handleSelectLesson}
                  />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ─── Lesson content — centered reading column ────────────────── */}
        <div className="mx-auto w-full max-w-3xl xl:max-w-4xl space-y-8">
          <LessonHeader
            lesson={selectedLesson}
            completed={progress?.status === "complete"}
            inProgress={progress?.status === "in-progress"}
            index={idx}
            total={trackLessons.length}
            outlineOpen={outlineOpen}
            onToggleOutline={() => {
              // Desktop uses the slide-in panel; mobile uses the bottom sheet.
              // Toggle the appropriate one based on viewport.
              if (window.matchMedia("(min-width: 1024px)").matches) {
                setOutlineOpen((v) => !v);
              } else {
                setMobileOutlineOpen(true);
              }
            }}
            onBackToTracks={() => {
              setSelectedLessonId(null);
              setTab("tracks");
              setSelectedTrack(null);
            }}
            bookmarked={bookmarkedLessons.includes(resolveRef(selectedLesson.id))}
            onToggleBookmark={() => toggleLessonBookmark(selectedLesson.id)}
            onPrint={() => window.print()}
            calculatedReadMinutes={estimateReadTime(selectedLesson.blocks)}
          />

          {/* YouTube tutorial video embed (Section 17.5) */}
          <div className="no-print">
            <YouTubeEmbed lessonId={selectedLesson.id} trackId={track} />
          </div>

          {/* v5.937 / v6.010: Lesson content blocks — all lessons use the same
              LessonBlockView rendering. The first block is skipped if it's a
              heading that duplicates the lesson title (handled by
              isDuplicateTitleBlock above). */}
          <article className="space-y-4 lesson-content">
            {selectedLesson.blocks.map((block, i) => (
              isDuplicateTitleBlock(block, i) ? null : (
                <LessonBlockView
                  key={`${selectedLesson.id}:${i}`}
                  block={block}
                  onTryInPlayground={(code, language) => {
                    setPlaygroundCode(code, toPlaygroundLanguage(language));
                    setView("playground");
                  }}
                />
              )
            ))}
          </article>

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

          {/* v6.010: Quiz CTA — centered, calm. The bottom prev/next nav lives
              below it so the reader can choose: take the quiz OR continue to
              the next lesson. */}
          <div className="flex flex-col items-center gap-3 pt-2 no-print">
            <GlassButton
              variant="primary"
              size="md"
              onClick={() => {
                setLessonProgress(selectedLesson.id, "in-progress");
                setTab("quiz");
                window.scrollTo(0, 0);
              }}
            >
              <Trophy className="h-4 w-4" /> Take the quiz
            </GlassButton>
            <p className="text-[11px] text-muted-foreground text-center">
              Test your understanding · Pass with 70% to mark this lesson complete
            </p>
          </div>

          {/* v6.010: Bottom prev/next navigation — clear, docs-style. */}
          <div className="pt-6 border-t border-border/30 no-print">
            <LessonNavigation
              prev={prev}
              next={next}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>

          {/* v6.006: Next-lesson recommendation card — emerald CTA after the
              reader finishes reading. Uses handleSelectLesson to maintain
              behavioral parity with the prev/next nav. */}
          <NextLessonCard
            currentLesson={selectedLesson}
            lessonProgress={lessonProgress}
            onSelectLesson={handleSelectLesson}
          />
        </div>
      </div>

      {/* v6.010: Mobile course outline drawer — bottom sheet with the track's
          lesson list. Triggered by the Outline button in LessonHeader on
          screens below the lg breakpoint. The desktop slide-in panel above
          handles lg+ screens. */}
      {mobileOutlineOpen && typeof document !== "undefined" && createPortal(
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOutlineOpen(false)}
          />
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[82vh] flex flex-col rounded-t-2xl glass-elevated border border-border/60 shadow-2xl overflow-hidden">
            <div className="flex justify-center pt-2 pb-1 shrink-0">
              <div className="h-1 w-10 rounded-full bg-foreground/20" />
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 shrink-0">
              <span className="text-sm font-semibold">Course Outline</span>
              <button
                onClick={() => setMobileOutlineOpen(false)}
                className="h-7 w-7 rounded-md hover:bg-foreground/10 flex items-center justify-center text-muted-foreground"
                aria-label="Close outline"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto p-3 scrollbar-thin">
              <LessonSidebar
                lessons={trackLessons}
                currentLessonId={selectedLesson.id}
                lessonProgress={lessonProgress}
                onSelectLesson={handleSelectLesson}
                onClose={() => setMobileOutlineOpen(false)}
              />
            </div>
          </div>
        </>, document.body
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
    const progress = lessonProgress[resolveRef(selectedLesson.id)];
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
    const trackComplete = trackLessons.length > 0 && trackLessons.every((l) => lessonProgress[resolveRef(l.id)]?.status === "complete");

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
                              toast.warning("Certificates not available for this technology", {
                                description: "This track doesn't have full lesson content yet. Try one of the 30 core languages (Python, JavaScript, etc.) that have full 21-lesson content.",
                              });
                            } else {
                              toast.error("Certificate could not be issued", {
                                description: "This may be a temporary server issue. Your progress is saved; the certificate will be issued automatically on your next visit or when you complete another quiz.",
                              });
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
                Progress: {trackLessons.filter((l) => lessonProgress[resolveRef(l.id)]?.status === "complete").length}/{trackLessons.length}
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
        (l) => lessonProgress[resolveRef(l.id)]?.status !== "complete"
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

function LessonBlockView({
  block,
  onTryInPlayground,
}: {
  block: Lesson["blocks"][number];
  onTryInPlayground: (code: string, language?: string) => void;
}) {
  // v6.008: Documentation-style lesson content. No box-heavy layout.
  // Sections use typography + spacing for hierarchy. Only callouts
  // (warnings, tips, mini projects) use a subtle left accent border.

  if (block.kind === "heading") {
    return (
      <h2 className="text-xl font-bold tracking-tight mt-8 first:mt-0 mb-1 text-foreground">
        {block.content}
      </h2>
    );
  }
  if (block.kind === "text") {
    const paragraphs = block.content.split(/\n\n+/);
    return (
      <div className="space-y-3">
        {paragraphs.map((para, i) => (
          <p key={i} className="text-[15px] leading-7 text-foreground/85 whitespace-pre-line">{para}</p>
        ))}
      </div>
    );
  }
  if (block.kind === "whyItMatters") {
    return (
      <div className="border-l-2 border-teal-500/40 pl-4 py-1">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400 mb-1">Why this matters</div>
        <p className="text-[15px] leading-7 text-foreground/80">{block.content}</p>
      </div>
    );
  }
  if (block.kind === "prerequisites") {
    return (
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Before you start</div>
        <ul className="space-y-1.5">
          {block.items.map((it, i) => (
            <li key={i} className="text-sm text-foreground/80 flex gap-2.5 leading-relaxed">
              <span className="text-sky-500 shrink-0 mt-0.5">→</span>
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
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Topics covered</div>
        <ul className="space-y-1.5">
          {block.items.map((it, i) => (
            <li key={i} className="text-sm text-foreground/85 flex gap-2.5 leading-relaxed">
              <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-1" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (block.kind === "keyConcepts") {
    return (
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400 mb-2">Key concepts</div>
        <ul className="space-y-2">
          {block.items.map((it, i) => (
            <li key={i} className="text-sm text-foreground/85 flex gap-2.5 leading-relaxed">
              <span className="text-violet-500 shrink-0 mt-1 text-xs">◆</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (block.kind === "code") {
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
      <div className="border-l-2 border-rose-500/40 pl-4 py-1">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400 mb-2">Common pitfalls</div>
        <ol className="space-y-2">
          {block.items.map((it, i) => (
            <li key={i} className="text-sm text-foreground/80 flex gap-2.5 leading-relaxed">
              <span className="text-rose-500 font-mono shrink-0 mt-0.5 text-xs tabular-nums">{i + 1}.</span>
              <span>{it}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }
  if (block.kind === "realWorldApps") {
    return (
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-2">In the wild</div>
        <ul className="space-y-2">
          {block.items.map((it, i) => (
            <li key={i} className="text-sm text-foreground/80 flex gap-2.5 leading-relaxed">
              <span className="text-amber-500 shrink-0 mt-1 text-xs">★</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (block.kind === "interviewQuestions") {
    return (
      <details className="group">
        <summary className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-foreground/90 hover:text-foreground transition-colors select-none">
          <ChevronRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform" />
          Interview prep
          <span className="text-xs font-normal text-muted-foreground">({block.items.length} questions)</span>
        </summary>
        <ul className="mt-3 space-y-2 pl-6">
          {block.items.map((it, i) => (
            <li key={i} className="text-sm text-foreground/80 flex gap-2.5 leading-relaxed">
              <span className="text-primary font-mono shrink-0 mt-0.5 text-xs tabular-nums">Q{i + 1}.</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </details>
    );
  }
  if (block.kind === "miniProject") {
    return (
      <div className="border-l-2 border-emerald-500/50 pl-4 py-1">
        <div className="flex items-center gap-2 mb-1.5">
          <Play className="h-3.5 w-3.5 text-emerald-500" />
          <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Try it yourself</div>
        </div>
        <p className="text-[15px] leading-7 text-foreground/85">{block.content}</p>
      </div>
    );
  }
  if (block.kind === "exercises") {
    const cleanedItems = block.items.filter(item => {
      const trimmed = item.trim();
      if (/^>>>\s*QUIZ/i.test(trimmed)) return false;
      if (/^Z AI: render this as/i.test(trimmed)) return false;
      if (/^Q\d+\s*[:.]/i.test(trimmed)) return false;
      if (/^[A-D]\)\s/.test(trimmed)) return false;
      if (/^\([A-D]\)\s/.test(trimmed)) return false;
      if (/^Explanation\s*:/i.test(trimmed)) return false;
      if (/^Answer\s*:/i.test(trimmed)) return false;
      if (/^\(\*\)$/.test(trimmed)) return false;
      if (/^\(Z AI/.test(trimmed)) return false;
      return true;
    });
    if (cleanedItems.length === 0) return null;
    return (
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Exercises</div>
        <ol className="space-y-2">
          {cleanedItems.map((it, i) => (
            <li key={i} className="text-sm text-foreground/80 flex gap-2.5 leading-relaxed">
              <span className="h-5 w-5 rounded-full border border-muted-foreground/30 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5 tabular-nums">{i + 1}</span>
              <span>{it}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }
  if (block.kind === "tip") {
    return (
      <div className="border-l-2 border-sky-500/40 pl-4 py-1">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400 mb-1">Tip</div>
        <p className="text-[15px] leading-7 text-foreground/85">{block.content}</p>
      </div>
    );
  }
  if (block.kind === "warning") {
    return (
      <div className="border-l-2 border-amber-500/50 pl-4 py-1">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1">Warning</div>
        <p className="text-[15px] leading-7 text-foreground/85">{block.content}</p>
      </div>
    );
  }
  if (block.kind === "callout") {
    const accentMap = {
      info: "border-l-sky-500/40",
      success: "border-l-emerald-500/40",
      warning: "border-l-amber-500/50",
    };
    return (
      <div className={`border-l-2 ${accentMap[block.variant]} pl-4 py-1`}>
        <p className="text-[15px] leading-7 text-foreground/85">{block.content}</p>
      </div>
    );
  }
  if (block.kind === "resources") {
    return (
      <div className="space-y-1">
        {block.links.map((l, i) => (
          <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
            <ExternalLink className="h-3.5 w-3.5" /> {l.label}
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
      // v6.0: questionRecords keyed by global quiz slug now.
      const key = quizRef(lesson, q.id);
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

  // v6.0: uses shared QUIZ_PASS_MARK constant (was hardcoded 0.7).
  const passMark = Math.max(1, Math.ceil(questions.length * QUIZ_PASS_MARK));
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
