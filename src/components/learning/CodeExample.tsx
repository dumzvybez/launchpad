"use client";

// CodeExample — v6.005 interactive code example shell.
// Renders a LessonInteractiveExample (v6.005 type). Architecture only:
// the component shows the code with syntax highlighting + an "Edit & Run"
// button that, in a future phase, opens the inline runner. For now it
// falls back to a "Copy" + "Open in Playground" action.

import { useState } from "react";
import { Play, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonInteractiveExample } from "@/lib/types";

type Props = {
  example: LessonInteractiveExample;
  onRunInPlayground?: (code: string, language: string) => void;
};

export function CodeExample({ example, onRunInPlayground }: Props) {
  const [copied, setCopied] = useState(false);
  const editable = example.editable ?? true;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  return (
    <div className="rounded-xl border border-border/40 overflow-hidden bg-[#1e1e2e] dark:bg-[#1a1a2a]">
      {example.title && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10">
          <span className="text-[11px] font-mono text-white/70">{example.title}</span>
          <span className="text-[9px] uppercase tracking-wide text-white/40 font-mono">{example.language}</span>
        </div>
      )}
      <pre className="p-3 overflow-x-auto text-[12px] leading-relaxed text-white/90 font-mono">
        <code>{example.code}</code>
      </pre>
      {example.expectedOutput && (
        <div className="px-3 py-2 border-t border-white/10 bg-black/20">
          <div className="text-[9px] uppercase tracking-wide text-white/40 font-mono mb-0.5">Expected output</div>
          <pre className="text-[11px] text-emerald-300/90 font-mono whitespace-pre-wrap">{example.expectedOutput}</pre>
        </div>
      )}
      <div className="flex items-center gap-1 px-2 py-1.5 border-t border-white/10 bg-white/5">
        {editable && onRunInPlayground && (
          <button
            onClick={() => onRunInPlayground(example.code, example.language)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Play className="h-2.5 w-2.5" /> Edit &amp; Run
          </button>
        )}
        <button
          onClick={copy}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-colors ml-auto",
            copied ? "text-emerald-400" : "text-white/60 hover:text-white hover:bg-white/10",
          )}
        >
          {copied ? <Check className="h-2.5 w-2.5" /> : <Copy className="h-2.5 w-2.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {example.explanation && (
        <div className="px-3 py-2 border-t border-white/10 bg-white/[0.02] text-[11px] text-white/60 leading-relaxed">
          {example.explanation}
        </div>
      )}
    </div>
  );
}
