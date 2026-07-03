"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Layers, ChevronLeft, ChevronRight, Lightbulb, Check, X, RotateCcw } from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard, GlassButton } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import { ALL_LANGUAGE_INFO } from "@/lib/lessons-data";
import { isDueForReview } from "@/lib/sm2";
import { getFlashcardsForTrack } from "@/lib/flashcard-generator";
import type { Flashcard } from "@/lib/types";

type FilterMode = "all" | "due" | string; // string = track id

export function FlashcardsView() {
  const userFlashcards = useStore((s) => s.state.flashcards);
  const recordFlashcardResult = useStore((s) => s.recordFlashcardResult);
  const ensureFlashcardsForTrack = useStore((s) => s.ensureFlashcardsForTrack);
  const roadmap = useStore((s) => s.state.roadmap);

  const [filter, setFilter] = useState<FilterMode>("due");
  const [currentIndex, setCurrentIndex] = useState(0);
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
  }, [roadmap]);

  // Ensure flashcards are populated for all visible tracks.
  useEffect(() => {
    for (const id of trackIds) {
      ensureFlashcardsForTrack(id);
    }
  }, [trackIds, ensureFlashcardsForTrack]);

  // Build the full deck (merging generated defaults with user SM-2 progress).
  const allCards = useMemo(() => {
    const cards: Flashcard[] = [];
    for (const id of trackIds) {
      cards.push(...getFlashcardsForTrack(id, userFlashcards));
    }
    return cards;
  }, [trackIds, userFlashcards]);

  // Apply filter.
  const filteredCards = useMemo(() => {
    if (filter === "all") return allCards;
    if (filter === "due") {
      return allCards.filter((c) => isDueForReview(c.nextReviewDate, c.interval));
    }
    return allCards.filter((c) => c.trackId === filter);
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
      // Advance to next card (wrap around).
      setCurrentIndex((i) => (i + 1) % Math.max(1, filteredCards.length));
    },
    [currentCard, recordFlashcardResult, filteredCards.length],
  );

  // Keyboard shortcuts: Space (flip), ← (wrong), → (right), H (hint).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
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
  }, [currentCard, flipped, handleResult]);

  // Reset index when filter changes. Uses the "adjust state during render"
  // pattern (recommended by React docs) instead of setState-in-useEffect.
  const [prevFilter, setPrevFilter] = useState(filter);
  if (filter !== prevFilter) {
    setPrevFilter(filter);
    setCurrentIndex(0);
    setFlipped(false);
    setShowHint(false);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Layers className="h-6 w-6 text-primary" />
          Flashcards
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Spaced repetition for coding concepts — auto-generated from your lessons.
        </p>
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
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Card {currentIndex + 1} of {filteredCards.length}
              </span>
              <span>
                {currentCard.source === "quiz" ? "From quiz" : currentCard.source === "keyConcept" ? "Key concept" : "Interview question"}
                {" · "}
                {ALL_LANGUAGE_INFO[currentCard.trackId]?.name ?? currentCard.trackId}
              </span>
            </div>

            {/* Flip card */}
            <div
              className="relative w-full min-h-[280px] cursor-pointer"
              style={{ perspective: "1000px" }}
              onClick={() => setFlipped((f) => !f)}
            >
              <div
                className="relative w-full h-full transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  minHeight: "280px",
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 glass-elevated rounded-2xl p-6 flex flex-col items-center justify-center text-center"
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                  <div className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground mb-3">
                    Question
                  </div>
                  <p className="text-base font-medium leading-relaxed">{currentCard.front}</p>
                  <p className="text-xs text-muted-foreground mt-4">Tap to flip</p>
                </div>
                {/* Back */}
                <div
                  className="absolute inset-0 glass-elevated rounded-2xl p-6 flex flex-col items-center justify-center text-center"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="text-[10px] font-mono uppercase tracking-wide text-primary mb-3">
                    Answer
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{currentCard.back}</p>
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
