"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Layers, ChevronLeft, ChevronRight, Lightbulb, Check, X, RotateCcw } from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard, GlassButton } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import { ALL_LANGUAGE_INFO } from "@/lib/lessons-meta";
import { isDueForReview } from "@/lib/sm2";
import { getFlashcardsForTrack } from "@/lib/flashcard-generator";
import type { Flashcard } from "@/lib/types";

type FilterMode = "all" | "due" | string; // string = track id

export function FlashcardsView() {
  const userFlashcards = useStore((s) => s.state.flashcards);
  const recordFlashcardResult = useStore((s) => s.recordFlashcardResult);
  const ensureFlashcardsForTrack = useStore((s) => s.ensureFlashcardsForTrack);
  const roadmap = useStore((s) => s.state.roadmap);

  // v5.925 FIX (BUG 6 — flashcard progress not persisting): filter +
  // currentIndex now read from / write to the persisted store instead of
  // local useState, so review position survives a page refresh. `flipped`,
  // `showHint`, and `sessionStats` stay as useState (ephemeral UI state that
  // shouldn't persist — you don't want to resume mid-flip).
  const persistedFilter = useStore((s) => s.state.flashcardsTabState.filter);
  const persistedIndex = useStore((s) => s.state.flashcardsTabState.currentIndex);
  const setFlashcardsTabState = useStore((s) => s.setFlashcardsTabState);

  const filter: FilterMode = persistedFilter;
  const currentIndex = persistedIndex;
  const setFilter = (f: FilterMode) => setFlashcardsTabState({ filter: f, currentIndex: 0 });
  const setCurrentIndex = (updater: number | ((i: number) => number)) => {
    const next = typeof updater === "function" ? updater(persistedIndex) : updater;
    setFlashcardsTabState({ currentIndex: next });
  };

  const [flipped, setFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  // Determine which tracks to show flashcards for. Prefer the user's roadmap
  // languages; fall back to all tracks if no roadmap yet.
  const trackIds = useMemo(() => {
    if (roadmap?.languageIds && roadmap.languageIds.length > 0) {
      return roadmap.languageIds;
    }
    return Object.values(ALL_LANGUAGE_INFO).map((t) => t.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmap]);

  // Ensure flashcards are populated for all visible tracks.
  useEffect(() => {
    for (const id of trackIds) {
      ensureFlashcardsForTrack(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIds, ensureFlashcardsForTrack]);

  // Build the full deck (merging generated defaults with user SM-2 progress).
  const allCards = useMemo(() => {
    const cards: Flashcard[] = [];
    for (const id of trackIds) {
      cards.push(...getFlashcardsForTrack(id, userFlashcards));
    }
    return cards;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIds, userFlashcards]);

  // Apply filter.
  const filteredCards = useMemo(() => {
    if (filter === "all") return allCards;
    if (filter === "due") {
      return allCards.filter((c) => isDueForReview(c.nextReviewDate, c.interval));
    }
    return allCards.filter((c) => c.trackId === filter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCards, filter]);

  const dueCount = useMemo(
    () => allCards.filter((c) => isDueForReview(c.nextReviewDate, c.interval)).length,
    [allCards],
  );

  const currentCard = filteredCards[currentIndex];

  const handleResult = useCallback(
    (correct: boolean) => {
      if (!currentCard) return;
      recordFlashcardResult(currentCard.id, correct);
      setSessionStats((s) => ({
        correct: s.correct + (correct ? 1 : 0),
        incorrect: s.incorrect + (correct ? 0 : 1),
      }));
      setFlipped(false);
      setShowHint(false);
      // v5.865 fix (4.9/B.6): clamp index INSIDE handleResult, not on every
      // render. This prevents the race condition where the render-path clamp
      // and the handleResult index update fight each other.
      setCurrentIndex((i) => {
        const newLen = Math.max(1, filteredCards.length);
        // If the deck shrank (card removed from "due" after correct answer),
        // wrap properly instead of pointing beyond the array.
        const next = (i + 1) % newLen;
        return Math.min(next, newLen - 1);
      });
    },
    [currentCard, recordFlashcardResult, filteredCards.length],
  );

  // Keyboard shortcuts: Space (flip), ← (wrong), → (right), H (hint).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement || (e.target as HTMLElement).isContentEditable) return;
      if (!currentCard) return;
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "ArrowRight" && flipped) {
        e.preventDefault();
        handleResult(true);
      } else if (e.key === "ArrowLeft" && flipped) {
        e.preventDefault();
        handleResult(false);
      } else if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        setShowHint((h) => !h);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCard, flipped, handleResult]);

  // v5.926 (C1) FIX: flashcard persistence — REAL root cause.
  // The v5.925 fix added flashcardsTabState but the `prevFilter` render-path
  // reset below fired during store HYDRATION: the store starts with
  // DEFAULT_STATE (filter="due"), then hydrates to the persisted filter (e.g.
  // "all"). That filter change triggered `setCurrentIndex(0)`, wiping the
  // persisted index. The fix: REMOVE the render-path reset entirely. The
  // `setFilter` function already resets currentIndex to 0 when the USER
  // changes the filter (line 32), so the render-path reset was redundant AND
  // caused the hydration race. The index now survives refresh correctly.
  // (No prevFilter / render-path reset needed.)

  return (
    <div className="space-y-5">
      {/* Header — polished with gradient accent */}
      <div className="relative overflow-hidden rounded-2xl glass-elevated p-5">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: "radial-gradient(circle at 0% 0%, oklch(0.80 0.18 195 / 0.20) 0%, transparent 50%), radial-gradient(circle at 100% 100%, oklch(0.76 0.2 320 / 0.15) 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <span className="text-2xl">📇</span>
              Flashcards
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Spaced repetition for coding concepts — auto-generated from your lessons.
            </p>
          </div>
          {/* Stats badges */}
          <div className="flex items-center gap-3">
            <div className="text-center px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="text-lg font-bold text-amber-500 tabular-nums">{dueCount}</div>
              <div className="text-[9px] uppercase tracking-wide text-muted-foreground font-mono">Due</div>
            </div>
            <div className="text-center px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-lg font-bold text-primary tabular-nums">{allCards.length}</div>
              <div className="text-[9px] uppercase tracking-wide text-muted-foreground font-mono">Total</div>
            </div>
            <div className="text-center px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-lg font-bold text-emerald-500 tabular-nums">{sessionStats.correct}</div>
              <div className="text-[9px] uppercase tracking-wide text-muted-foreground font-mono">✓ Session</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-background border border-border rounded-md px-2.5 py-1.5 text-xs"
        >
          <option value="due">Due today ({dueCount})</option>
          <option value="all">All ({allCards.length})</option>
          {Object.values(ALL_LANGUAGE_INFO).map((t) => {
            const count = allCards.filter((c) => c.trackId === t.id).length;
            return (
              <option key={t.id} value={t.id}>
                {t.name} ({count})
              </option>
            );
          })}
        </select>
        <span className="text-xs text-muted-foreground">
          {filteredCards.length} card{filteredCards.length !== 1 ? "s" : ""} in deck
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          Session: <span className="text-emerald-500 font-medium">{sessionStats.correct}</span> ✓ ·{" "}
          <span className="text-rose-500 font-medium">{sessionStats.incorrect}</span> ✗
        </span>
      </div>

      {/* Card area */}
      {filteredCards.length === 0 ? (
        <GlassCard className="p-8 text-center">
          {filter === "due" ? (
            <>
              <p className="text-sm font-medium text-emerald-500">✅ No cards due for review — you&apos;re on top of it!</p>
              <p className="text-xs text-muted-foreground mt-2">
                Switch to &quot;All&quot; to study ahead, or come back later.
              </p>
              <GlassButton variant="ghost" size="sm" className="mt-3" onClick={() => setFilter("all")}>
                Study all cards
              </GlassButton>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No flashcards available. Complete onboarding to generate flashcards for your languages.
            </p>
          )}
        </GlassCard>
      ) : (
        currentCard && (
          <>
            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-2">
                <span className="font-medium">Card {currentIndex + 1} of {filteredCards.length}</span>
                <span className="text-[10px]">·</span>
                <span className="capitalize">{currentCard.source === "quiz" ? "📝 Quiz" : currentCard.source === "keyConcept" ? "💡 Concept" : "🎤 Interview"}</span>
                <span className="text-[10px]">·</span>
                <span className="font-mono text-[10px]">{ALL_LANGUAGE_INFO[currentCard.trackId]?.name ?? currentCard.trackId}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-500 font-medium">{sessionStats.correct} ✓</span>
                <span className="text-rose-500 font-medium">{sessionStats.incorrect} ✗</span>
              </span>
            </div>
            {/* Progress bar fill */}
            <div className="h-1 bg-foreground/8 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / filteredCards.length) * 100}%` }}
              />
            </div>

            {/* Flip card — enhanced with gradient borders and glow */}
            <div
              className="relative w-full min-h-[300px] cursor-pointer group"
              style={{ perspective: "1200px" }}
              onClick={() => setFlipped((f) => !f)}
            >
              <div
                className="relative w-full h-full transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  minHeight: "300px",
                }}
              >
                {/* Front — gradient border + glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-primary/40 via-transparent to-primary/20 group-hover:from-primary/60 group-hover:to-primary/40 transition-all duration-300"
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                  <div className="w-full h-full glass-elevated rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/60 mb-4">
                      ◇ Question ◇
                    </div>
                    <p className="text-base font-medium leading-relaxed max-w-md">{currentCard.front}</p>
                    <div className="mt-6 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className="inline-block w-1 h-1 rounded-full bg-primary animate-pulse" />
                      Tap to flip
                    </div>
                  </div>
                </div>
                {/* Back */}
                <div
                  className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-emerald-500/40 via-transparent to-emerald-500/20"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="w-full h-full glass-elevated rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-500/60 mb-4">
                      ◆ Answer ◆
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap max-w-md">{currentCard.back}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hint */}
            {showHint && currentCard.hint && (
              <div className="text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-md p-2.5 flex items-start gap-2">
                <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>{currentCard.hint}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-2">
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => handleResult(false)}
                className="text-rose-500 hover:bg-rose-500/10"
                disabled={!flipped}
              >
                <X className="h-4 w-4" /> Got it wrong
              </GlassButton>
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => setShowHint((h) => !h)}
                disabled={!currentCard.hint}
              >
                <Lightbulb className="h-4 w-4" /> {showHint ? "Hide hint" : "Show hint"}
              </GlassButton>
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => handleResult(true)}
                className="text-emerald-500 hover:bg-emerald-500/10"
                disabled={!flipped}
              >
                <Check className="h-4 w-4" /> Got it right
              </GlassButton>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-2">
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFlipped(false);
                  setShowHint(false);
                  setCurrentIndex((i) => (i - 1 + filteredCards.length) % filteredCards.length);
                }}
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </GlassButton>
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFlipped(false);
                  setShowHint(false);
                  setCurrentIndex((i) => (i + 1) % filteredCards.length);
                }}
              >
                Next <ChevronRight className="h-4 w-4" />
              </GlassButton>
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSessionStats({ correct: 0, incorrect: 0 });
                  setCurrentIndex(0);
                  setFlipped(false);
                  setShowHint(false);
                }}
              >
                <RotateCcw className="h-4 w-4" /> Reset session
              </GlassButton>
            </div>

            {/* Keyboard hint */}
            <p className="text-center text-[10px] text-muted-foreground">
              Shortcuts: <kbd className="px-1 py-0.5 bg-muted rounded">Space</kbd> flip ·{" "}
              <kbd className="px-1 py-0.5 bg-muted rounded">←</kbd> wrong ·{" "}
              <kbd className="px-1 py-0.5 bg-muted rounded">→</kbd> right ·{" "}
              <kbd className="px-1 py-0.5 bg-muted rounded">H</kbd> hint
            </p>
          </>
        )
      )}
    </div>
  );
}
