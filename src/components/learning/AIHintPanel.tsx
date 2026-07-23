"use client";

// AIHintPanel — v6.005 AI tutor integration shell.
// Renders the per-lesson AI context (hint scaffolding, common misconceptions,
// code examples) as an expandable panel. The "Ask the AI Tutor" action opens
// the existing AI Tutor with this lesson's context pre-loaded.
//
// Architecture only: reads lesson.aiContext (v6.0 type) if present. If absent
// (legacy content), renders a minimal "Ask the AI Tutor" button only.

import { useState } from "react";
import { Sparkles, Lightbulb, AlertTriangle, MessageSquare, ChevronDown, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassPrimitives";
import type { Lesson } from "@/lib/types";

type Props = {
  lesson: Lesson;
  onAskTutor?: (promptPrefix?: string) => void;
};

export function AIHintPanel({ lesson, onAskTutor }: Props) {
  const [open, setOpen] = useState(false);
  const ctx = lesson.aiContext;
  const hasContext = !!(ctx && (ctx.commonMisconceptions?.length || ctx.hintScaffolding?.length || ctx.keyTakeaways?.length));

  return (
    <GlassCard className="p-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 text-left"
        aria-expanded={open}
      >
        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-teal-400 via-fuchsia-400 to-amber-300 flex items-center justify-center shrink-0">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">AI Tutor</div>
          <div className="text-[10px] text-muted-foreground">
            {hasContext ? "Lesson-aware hints & explanations" : "Ask anything about this lesson"}
          </div>
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {/* Key takeaways */}
          {ctx?.keyTakeaways && ctx.keyTakeaways.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono mb-1">Key takeaways</div>
              <ul className="space-y-0.5">
                {ctx.keyTakeaways.map((k, i) => (
                  <li key={i} className="text-[11px] text-foreground/80 flex gap-1.5">
                    <span className="text-teal-500">✓</span> {k}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hint scaffolding */}
          {ctx?.hintScaffolding && ctx.hintScaffolding.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono mb-1 inline-flex items-center gap-1">
                <Lightbulb className="h-2.5 w-2.5" /> Hint scaffolding
              </div>
              <ol className="space-y-0.5 list-decimal list-inside">
                {ctx.hintScaffolding.map((h, i) => (
                  <li key={i} className="text-[11px] text-foreground/80">{h.hint}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Common misconceptions */}
          {ctx?.commonMisconceptions && ctx.commonMisconceptions.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono mb-1 inline-flex items-center gap-1">
                <AlertTriangle className="h-2.5 w-2.5" /> Common misconceptions
              </div>
              <div className="space-y-1">
                {ctx.commonMisconceptions.map((m, i) => (
                  <div key={i} className="text-[11px] bg-rose-500/5 border border-rose-500/15 rounded px-2 py-1">
                    <div className="text-rose-600 dark:text-rose-400">✗ {m.misconception}</div>
                    <div className="text-emerald-600 dark:text-emerald-400 mt-0.5">✓ {m.correction}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ask tutor */}
          <button
            onClick={() => onAskTutor?.(ctx?.suggestedPromptPrefix)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Ask the AI Tutor about this lesson
          </button>
        </div>
      )}
    </GlassCard>
  );
}
