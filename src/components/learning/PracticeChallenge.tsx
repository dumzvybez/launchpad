"use client";

// PracticeChallenge — v6.005 practice challenge shell.
// Renders a LessonPracticeChallenge (v6.005 type). Architecture only: shows
// the prompt, a (future) editable code area, test cases, hint, and solution
// reveal. The inline runner is a future phase; for now it shows starter code
// read-only with a "Open in Playground" action.

import { useState } from "react";
import { Lightbulb, Eye, EyeOff, CheckCircle2, Terminal } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import type { LessonPracticeChallenge } from "@/lib/types";

type Props = {
  challenge: LessonPracticeChallenge;
  index: number;
  onOpenInPlayground?: (code: string, language: string) => void;
};

export function PracticeChallenge({ challenge, index, onOpenInPlayground }: Props) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <GlassCard className="p-4 border-amber-500/20 bg-amber-500/[0.03]">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
          {index + 1}
        </span>
        <h3 className="text-sm font-semibold">{challenge.title}</h3>
        {challenge.testCases && challenge.testCases.length > 0 && (
          <span className="ml-auto text-[9px] uppercase tracking-wide text-muted-foreground font-mono">
            {challenge.testCases.length} test{challenge.testCases.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <p className="text-[13px] text-foreground/90 leading-relaxed mb-3">{challenge.prompt}</p>

      {challenge.starterCode && (
        <div className="rounded-lg border border-border/40 overflow-hidden mb-3">
          <div className="flex items-center justify-between px-2 py-1 bg-muted/30 border-b border-border/30">
            <span className="text-[9px] uppercase tracking-wide text-muted-foreground font-mono inline-flex items-center gap-1">
              <Terminal className="h-2.5 w-2.5" /> {challenge.language ?? "code"}
            </span>
            {onOpenInPlayground && (
              <button
                onClick={() => onOpenInPlayground(challenge.starterCode ?? "", challenge.language ?? "python")}
                className="text-[10px] text-primary hover:underline"
              >
                Open in Playground →
              </button>
            )}
          </div>
          <pre className="p-2.5 text-[11px] leading-relaxed font-mono bg-[#1e1e2e] text-white/90 overflow-x-auto">
            <code>{challenge.starterCode}</code>
          </pre>
        </div>
      )}

      {/* Test cases (visible ones) */}
      {challenge.testCases && challenge.testCases.filter((t) => !t.hidden).length > 0 && (
        <div className="space-y-1 mb-3">
          {challenge.testCases.filter((t) => !t.hidden).map((t, i) => (
            <div key={i} className="text-[10px] font-mono bg-muted/20 rounded px-2 py-1 border border-border/30">
              {t.input && <div className="text-muted-foreground">in: {t.input}</div>}
              {t.expected && <div className="text-emerald-600 dark:text-emerald-400">out: {t.expected}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Hint toggle */}
      {challenge.hint && (
        <button
          onClick={() => setShowHint(!showHint)}
          className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 hover:underline mb-2"
        >
          <Lightbulb className="h-3 w-3" /> {showHint ? "Hide hint" : "Show hint"}
        </button>
      )}
      {showHint && challenge.hint && (
        <div className="text-[11px] text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded px-2 py-1.5 mb-2">
          {challenge.hint}
        </div>
      )}

      {/* Solution toggle */}
      {challenge.solution && (
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
        >
          {showSolution ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          {showSolution ? "Hide solution" : "Show solution"}
        </button>
      )}
      {showSolution && challenge.solution && (
        <pre className="mt-2 p-2.5 text-[11px] font-mono bg-[#1e1e2e] text-white/90 rounded-lg overflow-x-auto border border-emerald-500/20">
          <code>{challenge.solution}</code>
        </pre>
      )}

      {challenge.skillsAssessed && challenge.skillsAssessed.length > 0 && (
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          {challenge.skillsAssessed.map((s) => (
            <span key={s} className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <CheckCircle2 className="h-2 w-2" /> {s}
            </span>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

void cn;
