"use client";

/**
 * AIVerifyDialog — shared AI verification flow for Projects + Capstones (v5.925).
 *
 * ONE reusable mechanism, TWO contexts:
 *   - Projects tab: a "Verify Project" button opens this dialog. The user
 *     submits code (paste-text with multi-file support, or text-file upload).
 *     The AI assesses whether the code fulfills the project's stated
 *     deliverables and returns a structured verified/not-verified signal.
 *     Verified → the project is marked shipped + counts toward Career
 *     Readiness. Not-verified → the user sees feedback + can resubmit.
 *   - Capstone lessons (lesson 21 of each track): the dead "Take Quiz"
 *     button is replaced with "AI Verify". Same dialog, same flow, adapted
 *     to the capstone's requirements. Verified → setLessonProgress(complete)
 *     which satisfies the "all 21 lessons complete" certificate requirement.
 *
 * File-upload feasibility (verified, not assumed): the /api/chat route is
 * TEXT-ONLY (no multipart/formData, no image/base64 fields). So file upload
 * is limited to text-readable files (.txt, .md, .json, .csv, .tsv, .log,
 * and source code: .py .js .ts .go .rs .java .c .cpp .rb .php .sh .sql
 * .html .css .yml .xml .svg etc.). Images, PDF, DOCX, XLSX are NOT
 * supported (no parsing library, no multimodal API). We read the file
 * client-side via FileReader.readAsText and append it as a fenced code
 * block — same as paste-text, just from a file.
 *
 * The AI's response MUST end with a parseable marker line so the app can
 * reliably detect verified/not-verified. The marker format is:
 *
 *   VERDICT: PASS  |  VERDICT: FAIL
 *
 * (case-insensitive, on its own line, at the end of the response). The
 * system prompt instructs the AI to always emit this marker.
 */

import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Plus,
  FileCode2,
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { GlassButton } from "@/components/glass/GlassPrimitives";
import { MarkdownRenderer } from "@/components/ai/MarkdownRenderer";
import type { Project } from "@/lib/projects-data";
import type { Lesson } from "@/lib/types";

// ============================================================
// Types
// ============================================================

export type AIVerifyTarget =
  | {
      mode: "project";
      project: Project;
    }
  | {
      mode: "capstone";
      lesson: Lesson;
      trackName: string;
    };

export type AIVerifyResult = {
  passed: boolean;
  rawResponse: string;
  score: number | null; // 0-10 if the AI provides one, else null
};

interface AIVerifyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: AIVerifyTarget;
  onVerified: (result: AIVerifyResult) => void;
}

// ============================================================
// File-input helpers
// ============================================================

/** A single code file entry — either pasted or uploaded. */
type CodeFile = {
  id: string;
  filename: string;
  content: string;
  collapsed: boolean;
};

/** File extensions the AI can realistically read as text. Used for the
 *  upload accept attribute + validation. Derived from the /api/chat route's
 *  text-only contract (no multimodal, no parsing libs). */
const TEXT_FILE_EXTS = [
  ".txt", ".md", ".markdown", ".json", ".csv", ".tsv", ".log",
  ".py", ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs",
  ".go", ".rs", ".java", ".c", ".h", ".cpp", ".hpp", ".cc",
  ".rb", ".php", ".sh", ".bash", ".zsh",
  ".sql", ".html", ".htm", ".css", ".scss", ".less",
  ".yml", ".yaml", ".xml", ".svg", ".toml", ".ini", ".cfg", ".env",
  ".swift", ".kt", ".kts", ".scala", ".clj", ".ex", ".exs", ".dart",
  ".lua", ".r", ".jl", ".pl", ".pm",
];

const ACCEPT_ATTR = TEXT_FILE_EXTS.join(",");

function isTextFile(filename: string): boolean {
  const lower = filename.toLowerCase();
  return TEXT_FILE_EXTS.some((ext) => lower.endsWith(ext));
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("read failed"));
    reader.readAsText(file);
  });
}

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ============================================================
// Verdict parsing
// ============================================================

/**
 * Parse the AI response for the verified/not-verified signal.
 * Looks for a line matching /^VERDICT:\s*(PASS|FAIL)/im (case-insensitive).
 * Also tries to extract a numeric score (e.g. "Score: 8/10" or "8/10").
 */
function parseVerdict(response: string): { passed: boolean; score: number | null } {
  const verdictMatch = response.match(/VERDICT:\s*(PASS|FAIL)/i);
  const passed = verdictMatch ? verdictMatch[1].toUpperCase() === "PASS" : false;
  // Score: try "Score: X/10" or "X/10" near the verdict line.
  const scoreMatch = response.match(/(?:score[:\s]*)?(\d{1,2})\s*\/\s*10/i);
  const score = scoreMatch ? Math.min(10, Math.max(0, parseInt(scoreMatch[1], 10))) : null;
  return { passed, score };
}

// ============================================================
// System prompt builder
// ============================================================

function buildSystemPrompt(target: AIVerifyTarget): string {
  const base = `You are Launchpad's project-verification AI. A learner has submitted code and claims it fulfills the requirements below. Your job is to genuinely assess whether the submitted code meets the stated requirements — do NOT rubber-stamp. Read the code carefully, check each requirement, and give specific, honest feedback.

You MUST end your response with a single line in EXACTLY this format (no other text on that line):
VERDICT: PASS
or
VERDICT: FAIL

Use PASS only if the code genuinely fulfills ALL the core requirements. Use FAIL if any core requirement is missing, broken, or not demonstrable from the code. You may also include a score out of 10 (e.g. "Score: 7/10") before the verdict line.

Format your response as Markdown:
1. A one-paragraph overall impression.
2. "### Requirements Check" — a bullet list of each requirement with ✓ (met) or ✗ (unmet) + a brief note.
3. "### Issues Found" (if any) — specific bugs/gaps with file + line references where possible.
4. "### Suggested Improvements" — 2-3 concrete next steps.
5. "Score: X/10" (optional but recommended).
6. The final verdict line: VERDICT: PASS or VERDICT: FAIL`;

  if (target.mode === "project") {
    const p = target.project;
    return `${base}

PROJECT: ${p.title}
DESCRIPTION: ${p.description}
TIER: ${p.tier}
LANGUAGES: ${p.languages.join(", ")}
CORE DELIVERABLES (the project is PASS only if ALL are met):
${p.deliverables.map((d, i) => `${i + 1}. ${d}`).join("\n")}
${p.stretchGoals && p.stretchGoals.length > 0 ? `\nSTRETCH GOALS (optional — do not fail for missing these):\n${p.stretchGoals.map((g) => `- ${g}`).join("\n")}` : ""}`;
  }
  // capstone mode
  const l = target.lesson;
  return `${base}

CAPSTONE PROJECT: ${l.title}
TRACK: ${target.trackName}
${l.description ? `DESCRIPTION: ${l.description}\n` : ""}This is the capstone project for the ${target.trackName} track. The learner must demonstrate mastery of the track's concepts. Assess whether the submitted code represents a genuine, working implementation (not stub/placeholder code).`;
}

// ============================================================
// The dialog component
// ============================================================

export function AIVerifyDialog({ open, onOpenChange, target, onVerified }: AIVerifyDialogProps) {
  const aiSettings = useStore((s) => s.state.aiSettings);
  const [files, setFiles] = useState<CodeFile[]>([
    { id: genId(), filename: "main.txt", content: "", collapsed: false },
  ]);
  const [reviewing, setReviewing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<{ passed: boolean; score: number | null } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasUserKey = !!aiSettings.apiKey;

  const close = useCallback(() => {
    onOpenChange(false);
    // Reset state after close animation.
    setTimeout(() => {
      setFiles([{ id: genId(), filename: "main.txt", content: "", collapsed: false }]);
      setReviewing(false);
      setResponse(null);
      setError(null);
      setVerdict(null);
    }, 200);
  }, [onOpenChange]);

  const addFile = useCallback(() => {
    setFiles((prev) => [
      ...prev.map((f) => ({ ...f, collapsed: true })),
      { id: genId(), filename: `file-${prev.length + 1}.txt`, content: "", collapsed: false },
    ]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => (prev.length === 1 ? prev : prev.filter((f) => f.id !== id)));
  }, []);

  const updateFile = useCallback((id: string, patch: Partial<CodeFile>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }, []);

  const toggleCollapse = useCallback((id: string) => {
    setFiles((prev) => {
      // When expanding one, collapse others (accordion-style) so the UI stays manageable.
      const target = prev.find((f) => f.id === id);
      if (!target) return prev;
      const willExpand = target.collapsed;
      return prev.map((f) =>
        f.id === id ? { ...f, collapsed: !willExpand } : (willExpand ? { ...f, collapsed: true } : f),
      );
    });
  }, []);

  const handleFileUpload = useCallback(async (e: { target: HTMLInputElement }) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;
    const newFiles: CodeFile[] = [];
    for (const file of Array.from(uploaded)) {
      if (!isTextFile(file.name)) {
        setError(`"${file.name}" is not a supported text file. Supported: code files, .txt, .md, .json, .csv, etc. (no images/PDF/DOCX).`);
        continue;
      }
      if (file.size > 200_000) {
        setError(`"${file.name}" is too large (max 200KB per file).`);
        continue;
      }
      try {
        const content = await readFileAsText(file);
        newFiles.push({ id: genId(), filename: file.name, content, collapsed: false });
      } catch {
        setError(`Could not read "${file.name}".`);
      }
    }
    if (newFiles.length > 0) {
      setFiles((prev) => [...prev.map((f) => ({ ...f, collapsed: true })), ...newFiles]);
    }
    // Reset the input so the same file can be re-uploaded if needed.
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleReview = useCallback(async () => {
    setError(null);
    setResponse(null);
    setVerdict(null);

    if (!hasUserKey) {
      setError("AI verification requires an API key. Open the AI Tutor tab to add your key (BYOK).");
      return;
    }
    const nonEmpty = files.filter((f) => f.content.trim().length > 0);
    if (nonEmpty.length === 0) {
      setError("Please paste or upload some code before requesting a review.");
      return;
    }

    setReviewing(true);
    try {
      // Build the user message: assemble all files as fenced code blocks.
      const codeBlock = nonEmpty
        .map((f) => `### File: ${f.filename}\n\`\`\`\n${f.content}\n\`\`\``)
        .join("\n\n");
      const userMsg = `Please review my submitted code against the requirements.\n\n${codeBlock}\n\nAssess each requirement honestly and end with VERDICT: PASS or VERDICT: FAIL.`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMsg }],
          provider: aiSettings.provider,
          apiKey: aiSettings.apiKey,
          model: aiSettings.model,
          temperature: 0.3,
          customEndpoint: aiSettings.customEndpoint,
          systemPrompt: buildSystemPrompt(target),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Review failed (HTTP ${res.status}). Check your API key and try again.`);
        setReviewing(false);
        return;
      }
      const data = await res.json();
      // v5.926 (A1) FIX: the /api/chat non-streaming response returns
      // { content: string, provider: string }. Previously we looked for
      // data.messages / data.response / data.message (all wrong) → always
      // empty → "The AI returned an empty response" bug. Now reads data.content.
      const rawResponse: string = data.content ?? "";
      if (!rawResponse) {
        setError("The AI returned an empty response. Please try again.");
        setReviewing(false);
        return;
      }
      setResponse(rawResponse);
      const parsed = parseVerdict(rawResponse);
      setVerdict(parsed);
      onVerified({ passed: parsed.passed, rawResponse, score: parsed.score });
    } catch (err) {
      setError(`Network error: ${(err as Error).message}`);
    } finally {
      setReviewing(false);
    }
  }, [files, hasUserKey, aiSettings, target, onVerified]);

  if (!open || typeof document === "undefined") return null;

  const title =
    target.mode === "project"
      ? `Verify Project: ${target.project.title}`
      : `AI Verify Capstone: ${target.lesson.title}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-hidden"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-verify-title"
    >
      <div
        className="max-w-2xl w-full max-h-[88vh] overflow-y-auto bg-background rounded-xl shadow-2xl p-5 border border-border/60 ring-1 ring-black/5 dark:ring-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 id="ai-verify-title" className="text-sm font-semibold">{title}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {target.mode === "project"
                ? `Submit your code — the AI checks it against the project's deliverables. Verified = counts toward Career Readiness.`
                : `Submit your capstone code — the AI verifies it represents genuine mastery. Verified = lesson complete + counts toward your certificate.`}
            </p>
          </div>
          <button onClick={close} className="text-xs text-muted-foreground hover:text-foreground p-1 rounded" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* BYOK gate */}
        {!hasUserKey && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 mb-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-700 dark:text-amber-300">
              <strong>API key required.</strong> AI verification is BYOK (bring your own key). Open the
              AI Tutor tab to add your key (Gemini, Groq, OpenRouter, OpenAI, Anthropic, or custom).
            </div>
          </div>
        )}

        {/* Requirements preview */}
        <div className="rounded-lg bg-foreground/5 p-3 mb-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">
            {target.mode === "project" ? "Core deliverables (all must be met)" : "Capstone requirements"}
          </div>
          <ul className="text-[11px] space-y-0.5">
            {target.mode === "project"
              ? target.project.deliverables.map((d, i) => <li key={i}>• {d}</li>)
              : <li>• A genuine, working implementation demonstrating mastery of {target.trackName} concepts (not stub/placeholder code).</li>}
          </ul>
        </div>

        {/* File list */}
        <div className="space-y-2 mb-3">
          {files.map((f) => (
            <div key={f.id} className="rounded-lg border border-border/60 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 bg-foreground/3">
                <button
                  onClick={() => toggleCollapse(f.id)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={f.collapsed ? "Expand" : "Collapse"}
                >
                  {f.collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
                <FileCode2 className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={f.filename}
                  onChange={(e) => updateFile(f.id, { filename: e.target.value })}
                  className="flex-1 bg-transparent text-xs font-mono outline-none border-b border-transparent focus:border-primary/40"
                />
                <span className="text-[10px] text-muted-foreground font-mono">
                  {f.content.length} chars
                </span>
                {files.length > 1 && (
                  <button
                    onClick={() => removeFile(f.id)}
                    className="text-muted-foreground hover:text-rose-500"
                    aria-label="Remove file"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {!f.collapsed && (
                <textarea
                  value={f.content}
                  onChange={(e) => updateFile(f.id, { content: e.target.value })}
                  placeholder={`Paste your code here (${f.filename})…`}
                  rows={8}
                  className="w-full px-3 py-2 bg-background/50 text-xs font-mono border-t border-border/60 focus:outline-none resize-y"
                />
              )}
            </div>
          ))}
        </div>

        {/* Add-file + upload buttons */}
        <div className="flex items-center gap-2 mb-3">
          <GlassButton variant="ghost" size="sm" onClick={addFile}>
            <Plus className="h-3.5 w-3.5" /> Add file
          </GlassButton>
          <GlassButton variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-3.5 w-3.5" /> Upload text file
          </GlassButton>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_ATTR}
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <span className="text-[10px] text-muted-foreground ml-auto">
            Supports: code files, .txt, .md, .json, .csv (max 200KB each, no images/PDF)
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-2.5 mb-3 text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Verdict banner */}
        {verdict && (
          <div className={cn(
            "rounded-lg border p-3 mb-3 flex items-center gap-2",
            verdict.passed
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-rose-500/40 bg-rose-500/10",
          )}>
            {verdict.passed
              ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              : <XCircle className="h-5 w-5 text-rose-500" />}
            <div className="flex-1">
              <div className={cn(
                "text-sm font-semibold",
                verdict.passed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
              )}>
                {verdict.passed ? "Verified!" : "Not verified yet"}
                {verdict.score !== null && <span className="ml-2 font-mono text-xs">Score: {verdict.score}/10</span>}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {verdict.passed
                  ? target.mode === "project"
                    ? "This project now counts toward your Career Readiness Score."
                    : "Capstone verified — lesson marked complete. Counts toward your certificate."
                  : "Review the feedback below, fix the issues, and resubmit."}
              </div>
            </div>
          </div>
        )}

        {/* AI response */}
        {response && (
          <div className="rounded-lg border border-border/60 bg-foreground/3 p-3 mb-3 max-h-64 overflow-y-auto">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">AI Review</div>
            <div className="text-xs">
              <MarkdownRenderer content={response} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <GlassButton
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleReview}
            disabled={reviewing || !hasUserKey}
          >
            {reviewing ? (
              // v5.927 (#10 Pattern 5): three-ring spinner for AI-verify loading.
              <><span className="lp-loader-rings inline-flex items-center justify-center" style={{ width: 16, height: 16 }}><span className="lp-loader-rings-ring" /><span className="lp-loader-rings-ring" /><span className="lp-loader-rings-ring" /></span> Reviewing…</>
            ) : verdict ? (
              "Resubmit for review"
            ) : (
              "Review with AI"
            )}
          </GlassButton>
          <button
            onClick={close}
            className="px-3 py-2 rounded-md border border-border/60 text-xs hover:bg-foreground/5"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
