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
} from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard, GlassButton, ProgressBar } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import {
  ALL_LESSONS,
  getLessonsForTrack,
  getAllTracks,
  ALL_LANGUAGE_INFO,
} from "@/lib/lessons-data";
import type { Lesson, QuizQuestion } from "@/lib/types";

type Tab = "tracks" | "lesson" | "quiz" | "result";

export function LearnView() {
  const [tab, setTab] = useState<Tab>("tracks");
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [filterLang, setFilterLang] = useState<string | null>(null); // null = show all
  const lessonProgress = useStore((s) => s.state.lessonProgress);
  const setLessonProgress = useStore((s) => s.setLessonProgress);
  const setPlaygroundCode = useStore((s) => s.setPlaygroundCode);
  const setView = useStore((s) => s.setView);
  const profile = useStore((s) => s.state.profile);
  const roadmap = useStore((s) => s.state.roadmap);

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

        {/* Language chips — user's plan languages first */}
        {planLanguageIds.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 font-mono">Your languages (from your roadmap)</div>
            <div className="flex flex-wrap gap-2">
              {planTracks.map((t) => {
                const completed = ALL_LESSONS.filter((l) => l.track === t.id && lessonProgress[l.id]?.status === "complete").length;
                const isFiltered = filterLang === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setFilterLang(isFiltered ? null : t.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all",
                      isFiltered
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 hover:border-primary/40 bg-card/40"
                    )}
                  >
                    <span className="text-base">{t.icon}</span>
                    <span className="font-medium">{t.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{completed}/{t.count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Explore more — all other languages */}
        {exploreTracks.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 font-mono">Explore more languages</div>
            <div className="flex flex-wrap gap-2">
              {exploreTracks.map((t) => {
                const completed = ALL_LESSONS.filter((l) => l.track === t.id && lessonProgress[l.id]?.status === "complete").length;
                const isFiltered = filterLang === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setFilterLang(isFiltered ? null : t.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all",
                      isFiltered
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 hover:border-primary/40 bg-card/40 opacity-80"
                    )}
                  >
                    <span className="text-base">{t.icon}</span>
                    <span className="font-medium">{t.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{completed}/{t.count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Track cards (filtered or all) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleTracks.map((t) => {
            const trackLessons = ALL_LESSONS.filter((l) => l.track === t.id).sort((a, b) => a.order - b.order);
            const completed = trackLessons.filter((l) => lessonProgress[l.id]?.status === "complete").length;
            const pct = trackLessons.length ? Math.round((completed / trackLessons.length) * 100) : 0;
            const inPlan = planLanguageIds.includes(t.id);
            return (
              <GlassCard key={t.id} className="p-4 hover:scale-[1.01] transition-transform">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{t.icon}</span>
                    <div>
                      <h3 className="font-bold text-sm">{t.name}</h3>
                      <div className="text-[10px] text-muted-foreground font-mono">{t.count} lessons</div>
                    </div>
                  </div>
                  {inPlan && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-semibold uppercase">
                      In Plan
                    </span>
                  )}
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                    <span>{completed}/{t.count}</span>
                    <span>{pct}%</span>
                  </div>
                  <ProgressBar value={pct} className="h-1.5" />
                </div>
                <GlassButton
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSelectedTrack(t.id);
                    setSelectedLessonId(trackLessons[0]?.id ?? null);
                    setTab("lesson");
                    window.scrollTo(0, 0);
                  }}
                >
                  <Play className="h-3.5 w-3.5" /> {completed > 0 ? "Continue" : "Start track"}
                </GlassButton>
              </GlassCard>
            );
          })}
        </div>

        {/* Achievement: certificate eligibility */}
        <GlassCard className="p-4">
          <div className="flex items-start gap-3">
            <Award className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-1">Complete a track to earn a certificate</h3>
              <p className="text-xs text-muted-foreground">
                Finish all lessons in any track (including quizzes) to generate a downloadable PDF certificate with your name.
              </p>
            </div>
          </div>
        </GlassCard>
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

        {/* Lesson content */}
        <div className="space-y-3">
          {selectedLesson.blocks.map((block, i) => (
            <LessonBlockView key={i} block={block} onTryInPlayground={(code) => {
              setPlaygroundCode(code, "javascript");
              setView("playground");
            }} />
          ))}
        </div>

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

          {trackComplete && (
            <div className="rounded-xl border-2 border-amber-500/60 bg-amber-500/10 p-4 mb-4">
              <Award className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">🎉 You completed the entire {trackName} track!</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-3">Generate your certificate of completion.</p>
              <GlassButton
                variant="primary"
                onClick={() => generateCertificate(profile.name || "Learner", trackName)}
              >
                <Award className="h-4 w-4" /> Download certificate (PDF)
              </GlassButton>
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
    return <p className="text-sm leading-relaxed text-foreground/90">{block.content}</p>;
  }
  if (block.kind === "code") {
    const isJS = block.language === "javascript" || block.language === "typescript";
    return (
      <div>
        {block.caption && <div className="text-[10px] text-muted-foreground font-mono mb-1">{block.caption}</div>}
        <div className="relative rounded-lg bg-zinc-900 dark:bg-black/60 text-zinc-100 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-700/50">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">{block.language}</span>
            {isJS && (
              <button
                onClick={() => onTryInPlayground(block.code)}
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-primary/30 text-primary hover:bg-primary/50 transition-colors"
              >
                <Code2 className="h-3 w-3" /> Try in Playground
              </button>
            )}
          </div>
          <pre className="p-3 overflow-x-auto text-xs font-mono leading-relaxed">
            <code>{block.code}</code>
          </pre>
        </div>
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

  const score = useMemo(() => {
    let correct = 0;
    for (const q of lesson.quiz) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    return Math.round((correct / lesson.quiz.length) * 100);
  }, [answers, lesson.quiz]);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => onComplete(score), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Back to lesson
        </button>
        <div className="text-[10px] text-muted-foreground font-mono">{lesson.quiz.length} questions · Pass at 70%</div>
      </div>

      <GlassCard className="p-5">
        <h2 className="text-lg font-bold mb-1">{lesson.title} — Quiz</h2>
        <p className="text-xs text-muted-foreground">Pick the best answer for each question.</p>
      </GlassCard>

      {lesson.quiz.map((q, qi) => (
        <GlassCard key={q.id} className="p-4">
          <div className="flex items-start gap-2 mb-3">
            <span className="text-[10px] font-mono text-muted-foreground mt-0.5">Q{qi + 1}</span>
            <p className="text-sm font-medium">{q.question}</p>
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
            <p className="text-xs text-muted-foreground mt-2 italic">{q.explanation}</p>
          )}
        </GlassCard>
      ))}

      <div className="flex items-center justify-between gap-3 pt-2">
        {submitted ? (
          <div className={cn(
            "text-sm font-semibold flex items-center gap-2",
            score >= 70 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
          )}>
            <Trophy className="h-4 w-4" /> Score: {score}%
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            {Object.keys(answers).length}/{lesson.quiz.length} answered
          </div>
        )}
        <GlassButton
          variant="primary"
          onClick={handleSubmit}
          disabled={submitted || Object.keys(answers).length < lesson.quiz.length}
        >
          {submitted ? "Submitting..." : "Submit quiz"}
        </GlassButton>
      </div>
    </div>
  );
}

// ============================================================
// Certificate generation — opens a printable PDF
// ============================================================

function generateCertificate(name: string, track: string) {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const certId = `LP-${Date.now().toString(36).toUpperCase()}`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Launchpad Certificate — ${name} — ${track}</title>
  <style>
    @page { size: landscape; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; }
    .cert {
      width: 100vw; height: 100vh; min-height: 800px;
      background: linear-gradient(135deg, #fefce8 0%, #f0fdfa 50%, #fdf4ff 100%);
      padding: 60px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      position: relative;
    }
    .border {
      position: absolute; inset: 30px;
      border: 3px solid #1f2937; border-radius: 12px;
    }
    .border-inner {
      position: absolute; inset: 38px;
      border: 1px solid #6b7280; border-radius: 8px;
    }
    .logo {
      font-size: 36px; font-weight: bold; letter-spacing: -0.02em;
      background: linear-gradient(135deg, #2DD4BF 0%, #E879F9 50%, #FCD34D 100%);
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }
    .subtitle { font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; color: #6b7280; margin-bottom: 32px; }
    .title { font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 8px; }
    .body-text { font-size: 16px; color: #4b5563; text-align: center; max-width: 600px; line-height: 1.6; margin-bottom: 32px; }
    .name { font-size: 42px; font-weight: bold; font-style: italic; color: #111827; margin: 16px 0 32px; border-bottom: 2px solid #1f2937; padding-bottom: 8px; }
    .track { font-size: 20px; color: #1f2937; font-weight: bold; margin-bottom: 8px; }
    .track-detail { font-size: 14px; color: #6b7280; margin-bottom: 48px; }
    .signatures { display: flex; gap: 80px; margin-top: 32px; }
    .sig { text-align: center; }
    .sig-line { width: 200px; border-top: 1px solid #1f2937; margin-bottom: 8px; }
    .sig-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; }
    .cert-id { position: absolute; bottom: 50px; font-size: 10px; color: #9ca3af; font-family: monospace; }
    .seal {
      position: absolute; bottom: 80px; right: 80px;
      width: 100px; height: 100px; border-radius: 50%;
      background: linear-gradient(135deg, #FCD34D, #E879F9);
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: bold; font-size: 14px; text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: rotate(-12deg);
    }
  </style>
</head>
<body>
  <div class="cert">
    <div class="border"></div>
    <div class="border-inner"></div>
    <div class="logo">Launchpad</div>
    <div class="subtitle">Coding Education Platform</div>
    <div class="title">Certificate of Completion</div>
    <div class="body-text">This certifies that the bearer has successfully completed all required lessons, exercises, and quizzes in the track below, demonstrating proficiency in the fundamentals of the language.</div>
    <div class="name">${escapeHtml(name)}</div>
    <div class="track">${escapeHtml(track)} Track</div>
    <div class="track-detail">15 lessons · 15 quizzes · Completed ${date}</div>
    <div class="signatures">
      <div class="sig">
        <div class="sig-line"></div>
        <div class="sig-label">Launchpad AI</div>
      </div>
      <div class="sig">
        <div class="sig-line"></div>
        <div class="sig-label">Date · ${date}</div>
      </div>
    </div>
    <div class="seal">VERIFIED<br/>${date.split(",")[0]}</div>
    <div class="cert-id">Certificate ID: ${certId}</div>
  </div>
  <script>
    window.onload = () => { window.print(); };
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
