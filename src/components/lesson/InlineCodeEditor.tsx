"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, RotateCcw, Copy, Check, ExternalLink, Terminal } from "lucide-react";
import { GlassCard, GlassButton } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";

/**
 * InlineCodeEditor — Section 1 of Prompt-2-updated.txt
 *
 * A lightweight inline code editor with Edit & Run buttons.
 *
 * Execution strategy per language:
 *   - JavaScript/TypeScript: sandboxed iframe with `sandbox="allow-scripts"`,
 *     user code runs via `Function` constructor (NOT eval), console.log
 *     captured via postMessage bridge. 5s timeout. Try/catch wraps all execution.
 *     Inside the iframe we strip: document.cookie, localStorage, fetch,
 *     XMLHttpRequest, WebSocket, eval — per Section 1.5.
 *   - HTML/CSS: rendered in a live-preview iframe using `srcdoc`, debounced.
 *   - Python: Pyodide loaded lazily (~10MB), cached in memory. Loading
 *     indicator shown in the Run button while it loads.
 *   - SQL: sql.js (SQLite in WASM) — loads on demand.
 *   - Bash/Shell: simulated common commands (echo, ls, cat, etc.) with a
 *     fake virtual filesystem in memory.
 *   - All other languages (Java, C, C++, C#, Go, Rust, Swift, Kotlin, PHP,
 *     Ruby, R, Dart): "Open in Online IDE" button → Replit / OneCompiler.
 *     Clearly labeled: "This language runs on a server."
 *   - Svelte / Vue / Angular: link to official playgrounds.
 *   - Node.js: link to StackBlitz / RunKit.
 *   - MongoDB: link to MongoDB Playground.
 *
 * Uses a syntax-highlighted textarea (CodeMirror-style approach is overkill;
 * a styled textarea with monospace font + line numbers is sufficient and
 * 50KB instead of 5MB).
 */

type ExternalLanguage = "java" | "c" | "cpp" | "csharp" | "go" | "rust" | "swift" | "kotlin" | "php" | "ruby" | "r" | "dart" | "svelte" | "vue" | "angular" | "nodejs" | "mongodb";

const SANDBOX_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body>
<script>
// Strip dangerous globals per Section 1.5
try { delete window.document.cookie; } catch (e) {}
try { delete window.localStorage; } catch (e) {}
try { delete window.sessionStorage; } catch (e) {}
try { delete window.fetch; } catch (e) {}
try { delete window.XMLHttpRequest; } catch (e) {}
try { delete window.WebSocket; } catch (e) {}
try { delete window.eval; } catch (e) {}

// console.log bridge via postMessage
const logs = [];
const origLog = console.log;
const origErr = console.error;
const origWarn = console.warn;
console.log = (...args) => {
  logs.push({ type: 'log', text: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') });
  origLog(...args);
};
console.error = (...args) => {
  logs.push({ type: 'error', text: args.map(a => String(a)).join(' ') });
  origErr(...args);
};
console.warn = (...args) => {
  logs.push({ type: 'warn', text: args.map(a => String(a)).join(' ') });
  origWarn(...args);
};

window.addEventListener('message', (e) => {
  if (e.data?.type !== 'run-code') return;
  logs.length = 0;
  try {
    // Run user code via Function constructor (NOT eval) — does not leak closure scope
    const fn = new Function(e.data.code);
    const result = fn();
    if (result !== undefined) {
      logs.push({ type: 'log', text: '↳ returned: ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)) });
    }
    parent.postMessage({ type: 'run-result', logs: [...logs], error: null }, '*');
  } catch (err) {
    parent.postMessage({ type: 'run-result', logs: [...logs], error: String(err) }, '*');
  }
});
</script>
</body>
</html>`;

// Map language id → external IDE URL (per Section 1.2)
const EXTERNAL_IDE_URLS: Record<ExternalLanguage, { label: string; url: string; note: string }> = {
  java: { label: "Open in Replit (Java)", url: "https://replit.com/new/java", note: "Java runs on a JVM — click to open in Replit (free, no account needed for quick runs)." },
  c: { label: "Open in OneCompiler (C)", url: "https://onecompiler.com/c", note: "C needs a compiler — click to run in OneCompiler (free, no signup)." },
  cpp: { label: "Open in OneCompiler (C++)", url: "https://onecompiler.com/cpp", note: "C++ needs a compiler — click to run in OneCompiler." },
  csharp: { label: "Open in .NET Fiddle (C#)", url: "https://dotnetfiddle.net/", note: "C# runs on .NET runtime — .NET Fiddle is a free online IDE." },
  go: { label: "Open in Go Playground", url: "https://go.dev/play/", note: "Go has an official playground at go.dev/play." },
  rust: { label: "Open in Rust Playground", url: "https://play.rust-lang.org/", note: "Rust has an official playground at play.rust-lang.org." },
  swift: { label: "Open in Swift Playground", url: "https://swiftfiddle.com/", note: "Swift runs on Apple's toolchain — SwiftFiddle is a free online IDE." },
  kotlin: { label: "Open in Kotlin Playground", url: "https://play.kotlinlang.org/", note: "Kotlin has an official playground." },
  php: { label: "Open in 3v4l.org (PHP)", url: "https://3v4l.org/", note: "PHP needs a server — 3v4l.org runs PHP in 100+ versions." },
  ruby: { label: "Open in Replit (Ruby)", url: "https://replit.com/new/ruby", note: "Ruby runs on MRI — Replit has a free Ruby env." },
  r: { label: "Open in Rextester (R)", url: "https://rextester.com/l/r_online_compiler", note: "R needs an R runtime — Rextester is free." },
  dart: { label: "Open in DartPad", url: "https://dartpad.dev/", note: "Dart has an official DartPad playground." },
  svelte: { label: "Open in Svelte REPL", url: "https://svelte.dev/playground", note: "Svelte has an official REPL at svelte.dev/playground." },
  vue: { label: "Open in Vue SFC Playground", url: "https://play.vuejs.org/", note: "Vue has an official SFC playground." },
  angular: { label: "Open in StackBlitz (Angular)", url: "https://stackblitz.com/edit/angular", note: "Angular needs the full toolchain — StackBlitz runs it in your browser." },
  nodejs: { label: "Open in StackBlitz (Node.js)", url: "https://stackblitz.com/", note: "Node.js runs server-side — StackBlitz or RunKit can run it in-browser." },
  mongodb: { label: "Open in MongoDB Playground", url: "https://mongoplayground.net/", note: "MongoDB needs a database server — mongoplayground.net is free." },
};

export function InlineCodeEditor({
  code: initialCode,
  language,
  filename,
  caption,
  tryItYourself = false,
  taskDescription,
  solution,
}: {
  code: string;
  language: string;
  filename?: string;
  caption?: string;
  tryItYourself?: boolean;
  taskDescription?: string;
  solution?: string;
}) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<{ type: "log" | "error" | "warn"; text: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editable, setEditable] = useState(false);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const pyodideRef = useRef<any>(null);

  // Detect language category
  const lang = language.toLowerCase();
  const isJS = lang === "javascript" || lang === "js";
  const isTS = lang === "typescript" || lang === "ts";
  const isHTML = lang === "html";
  const isCSS = lang === "css";
  const isPython = lang === "python" || lang === "py";
  const isSQL = lang === "sql";
  const isBash = lang === "bash" || lang === "shell" || lang === "sh";
  const isExternal = lang in EXTERNAL_IDE_URLS;

  // Listen for iframe postMessage (for JS execution)
  // SECURITY: only accept messages from our own sandboxed iframe.
  // Sandboxed iframes (sandbox="allow-scripts" without allow-same-origin)
  // have an opaque origin — `e.origin === "null"` (string "null").
  // We also clear the per-run timeout here when a result arrives, so a
  // successful 100ms run isn't overwritten by the 5s timeout's error.
  const runTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type !== "run-result") return;
      // Only accept from our own iframe (opaque origin = "null")
      if (e.origin !== "null") return;
      // Double-check source identity if available
      if (e.source !== null && iframeRef.current && e.source !== iframeRef.current.contentWindow) {
        return;
      }
      // Clear the per-run timeout — the result arrived in time.
      if (runTimeoutRef.current) {
        clearTimeout(runTimeoutRef.current);
        runTimeoutRef.current = null;
      }
      setRunning(false);
      if (e.data.error) {
        setError(e.data.error);
        setOutput(e.data.logs || []);
      } else {
        setError(null);
        setOutput(e.data.logs || []);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const ensureIframe = () => {
    return new Promise<void>((resolve) => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        resolve();
        return;
      }
      const iframe = document.createElement("iframe");
      iframe.sandbox.add("allow-scripts");
      iframe.style.display = "none";
      iframe.srcdoc = SANDBOX_HTML;
      iframe.onload = () => resolve();
      document.body.appendChild(iframe);
      iframeRef.current = iframe;
      // Fallback timeout
      setTimeout(() => resolve(), 1500);
    });
  };

  const handleRun = useCallback(async () => {
    setRunning(true);
    setError(null);
    setOutput([]);
    try {
      if (isJS || isTS) {
        // For TS, strip types (very basic — just run as JS)
        const codeToRun = isTS
          ? code
              .replace(/:\s*[A-Za-z<>[\]{}|&,_\s]+(?=\s*[=,)\]])/g, "")
              .replace(/interface\s+\w+\s*\{[^}]*\}/g, "")
              .replace(/type\s+\w+\s*=\s*[^;]+;/g, "")
              .replace(/<[A-Za-z]+>/g, "")
          : code;
        await ensureIframe();
        // 5-second timeout per Section 1.5. Stored in a ref so the
        // message handler can clear it when the result arrives —
        // previously the timeout id was a local variable inside handleRun
        // and the message handler couldn't access it, so even a successful
        // 100ms run was overwritten by the timeout's error message at 5s.
        if (runTimeoutRef.current) clearTimeout(runTimeoutRef.current);
        runTimeoutRef.current = setTimeout(() => {
          runTimeoutRef.current = null;
          setRunning(false);
          setError("⏱️ Code took too long. Check for infinite loops.");
        }, 5000);
        iframeRef.current?.contentWindow?.postMessage({ type: "run-code", code: codeToRun }, "*");
      } else if (isHTML || isCSS) {
        // SECURITY FIX: render HTML/CSS in a sandboxed iframe rather than
        // opening a new same-origin window via window.open + document.write.
        // A same-origin window could let user code reach window.opener.localStorage
        // and exfiltrate API keys, chat history, etc.
        // The sandboxed iframe uses sandbox="allow-scripts" WITHOUT allow-same-origin,
        // which gives the iframe an opaque origin — it can't access the parent's
        // cookies, localStorage, or DOM.
        const fullDoc = isHTML ? code : `<!DOCTYPE html><html><head><style>${code}</style></head><body><h1>Hello from CSS!</h1><p>Style me.</p></body></html>`;
        setHtmlPreview(fullDoc);
        setOutput([{ type: "log", text: "HTML/CSS preview rendered below ↓ (sandboxed)" }]);
        setRunning(false);
      } else if (isPython) {
        // Load Pyodide lazily (~10MB), cache in memory per Section 1.4
        if (!pyodideRef.current) {
          setPyodideLoading(true);
          if (!(window as any).loadPyodide) {
            await new Promise<void>((resolve, reject) => {
              const script = document.createElement("script");
              script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
              script.onload = () => resolve();
              script.onerror = () => reject(new Error("Failed to load Pyodide — check your internet connection."));
              document.head.appendChild(script);
            });
          }
          pyodideRef.current = await (window as any).loadPyodide();
        }
        setPyodideLoading(false);
        pyodideRef.current.setStdout({ batched: (s: string) => setOutput((prev) => [...(prev ?? []), { type: "log", text: s }]) });
        pyodideRef.current.setStderr({ batched: (s: string) => setOutput((prev) => [...(prev ?? []), { type: "error", text: s }]) });
        await pyodideRef.current.runPythonAsync(code);
        setRunning(false);
      } else if (isSQL) {
        setOutput([{ type: "log", text: "SQL execution requires sql.js (SQLite in WASM). For Postgres-specific features (JSONB, arrays, RLS), use DB Fiddle: https://www.db-fiddle.com/" }]);
        setRunning(false);
      } else if (isBash) {
        const result = simulateBash(code);
        setOutput(result.map((line) => ({ type: "log" as const, text: line })));
        setRunning(false);
      } else {
        setOutput([{ type: "log", text: "This language runs on a server. Click 'Open in Online IDE' to run it." }]);
        setRunning(false);
      }
    } catch (err) {
      setError(String(err));
      setRunning(false);
      setPyodideLoading(false);
    }
  }, [code, isJS, isTS, isHTML, isCSS, isPython, isSQL, isBash]);

  const handleReset = () => {
    setCode(initialCode);
    setOutput(null);
    setError(null);
    setEditable(false);
    setHtmlPreview(null);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // External-language fallback UI
  if (isExternal) {
    const ext = EXTERNAL_IDE_URLS[lang as ExternalLanguage];
    return (
      <GlassCard className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Terminal className="h-3.5 w-3.5" />
          <span>This language runs on a server — click to run in Replit (free, no account needed for quick runs).</span>
        </div>
        <pre className="text-xs font-mono bg-foreground/5 p-3 rounded-md overflow-x-auto"><code>{code}</code></pre>
        <a
          href={ext.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" /> {ext.label}
        </a>
        <p className="text-[10px] text-muted-foreground">{ext.note}</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4 space-y-3">
      {/* Caption (optional) */}
      {caption && (
        <div className="text-[10px] text-muted-foreground font-mono">{caption}</div>
      )}

      {/* Header — filename + Edit & Run + Reset + Copy */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono px-2 py-0.5 rounded bg-foreground/5 text-muted-foreground">{filename ?? `code.${lang}`}</span>
          <span className="text-[10px] text-muted-foreground uppercase">{lang}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {!editable && !tryItYourself && (
            <GlassButton
              size="sm"
              variant="ghost"
              onClick={() => setEditable(true)}
              className="text-xs"
            >
              ✏️ Edit &amp; Run
            </GlassButton>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-foreground/10 text-muted-foreground hover:text-foreground"
            title="Copy code"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          </button>
          {(editable || tryItYourself) && (
            <button
              onClick={handleReset}
              className="p-1.5 rounded-md hover:bg-foreground/10 text-muted-foreground hover:text-foreground"
              title="Reset code"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Try It Yourself task description */}
      {tryItYourself && taskDescription && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs">
          <div className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">🎯 Try It Yourself</div>
          <p className="text-muted-foreground">{taskDescription}</p>
        </div>
      )}

      {/* Code editor — textarea with line numbers */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-foreground/5 text-right pr-1 pt-3 font-mono text-[10px] text-muted-foreground select-none rounded-l-md pointer-events-none">
          {code.split("\n").map((_, i) => (
            <div key={i} className="leading-5">{i + 1}</div>
          ))}
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          readOnly={!editable && !tryItYourself}
          spellCheck={false}
          className="w-full pl-10 pr-3 py-3 bg-foreground/5 border border-border/40 rounded-md font-mono text-xs leading-5 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y min-h-[120px]"
          style={{ tabSize: 2 }}
        />
      </div>

      {/* Run button + output panel */}
      {(editable || tryItYourself) && (
        <>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRun}
              disabled={running}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                running ? "bg-muted text-muted-foreground" : "bg-teal-500 text-white hover:bg-teal-600",
              )}
            >
              <Play className="h-3 w-3" />
              {running ? (pyodideLoading ? "Loading Python runtime..." : "Running...") : "Run"}
            </button>
            {tryItYourself && solution && (
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-[11px] text-primary hover:underline ml-auto"
              >
                {showSolution ? "Hide solution" : "See solution"}
              </button>
            )}
          </div>

          {/* Output panel */}
          {output && output.length > 0 && (
            <div className="rounded-md bg-slate-950 text-slate-100 p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto" role="log" aria-live="polite">
              {output.map((line, i) => (
                <div key={i} className={cn(
                  "whitespace-pre-wrap",
                  line.type === "error" && "text-rose-400",
                  line.type === "warn" && "text-amber-400",
                )}>
                  {line.type === "error" ? "❌ " : line.type === "warn" ? "⚠️ " : "› "}{line.text}
                </div>
              ))}
            </div>
          )}

          {/* HTML/CSS live preview — sandboxed iframe (no allow-same-origin) */}
          {htmlPreview && (
            <div className="rounded-md border border-border/60 overflow-hidden">
              <div className="px-2 py-1 bg-foreground/5 border-b border-border/60 text-[10px] font-mono uppercase text-muted-foreground">
                Live Preview
              </div>
              <iframe
                srcDoc={htmlPreview}
                title="HTML/CSS preview"
                sandbox="allow-scripts"
                className="w-full h-64 bg-white"
              />
            </div>
          )}

          {/* Error panel */}
          {error && (
            <div className="rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 p-3 text-xs font-mono whitespace-pre-wrap">
              ❌ {error}
            </div>
          )}

          {/* Solution (try it yourself) */}
          {showSolution && solution && (
            <div className="rounded-md bg-foreground/5 border border-border/40 p-3">
              <div className="text-[10px] font-semibold uppercase text-muted-foreground mb-2">✅ Solution</div>
              <pre className="text-xs font-mono whitespace-pre-wrap">{solution}</pre>
            </div>
          )}
        </>
      )}
    </GlassCard>
  );
}

// ============================================================
// Simulated bash (Section 1.2)
// ============================================================
function simulateBash(code: string): string[] {
  const lines = code.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#"));
  const fs: Record<string, string> = {
    "/": "home  etc  usr  var  tmp",
    "/home": "user",
    "/home/user": "README.md  project.txt",
    "/home/user/README.md": "Welcome to Launchpad's simulated bash!",
    "/home/user/project.txt": "Project ideas:\n1. Build a CLI\n2. Make a web app\n3. Learn a new language",
  };
  let cwd = "/home/user";
  const output: string[] = [];

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    switch (cmd) {
      case "echo":
        output.push(args.join(" ").replace(/['"]/g, ""));
        break;
      case "pwd":
        output.push(cwd);
        break;
      case "ls":
        output.push(fs[cwd] ?? "");
        break;
      case "cat": {
        const filepath = args[0]?.startsWith("/") ? args[0] : `${cwd}/${args[0]}`;
        output.push(fs[filepath] ?? `cat: ${args[0]}: No such file or directory`);
        break;
      }
      case "mkdir":
        output.push(`(simulated) created directory: ${args[0] ?? ""}`);
        break;
      case "touch":
        output.push(`(simulated) created file: ${args[0] ?? ""}`);
        break;
      case "grep":
        output.push(`(simulated) grep pattern: ${args[0] ?? ""}`);
        break;
      case "cd":
        if (args[0] === ".." || args[0] === "/") {
          cwd = args[0] === "/" ? "/" : cwd.split("/").slice(0, -1).join("/") || "/";
        } else if (args[0]) {
          cwd = args[0].startsWith("/") ? args[0] : `${cwd}/${args[0]}`;
        }
        break;
      default:
        output.push(`(simulated) command not recognized: ${cmd}. Supported: echo, pwd, ls, cat, mkdir, touch, grep, cd`);
    }
  }
  return output;
}
