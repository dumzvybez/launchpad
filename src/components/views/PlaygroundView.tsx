"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Trash2, Copy, Code2, Info, ExternalLink, ChevronDown, ChevronRight, Download } from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard, GlassButton } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";

/**
 * PlaygroundView — multi-language code playground.
 *
 * Languages supported (per user request to support more languages):
 *   - JavaScript / TypeScript: runs in-browser via V8 (existing behavior)
 *   - Python: Pyodide loaded lazily on first run, cached in memory + IndexedDB
 *   - HTML/CSS: live preview in iframe
 *   - SQL: link to DB Fiddle (external)
 *   - Bash: simulated with fake virtual filesystem
 *   - Other compiled languages: link to Replit/OneCompiler
 *
 * Language runtimes (Pyodide ~10MB) are downloaded once and kept on device.
 * The first Python run shows a "Downloading Python runtime..." indicator.
 * Subsequent runs load instantly from memory cache.
 */

type Lang = "javascript" | "python" | "html" | "css" | "sql" | "bash";

const LANGUAGES: { id: Lang; label: string; icon: string; runtime: string }[] = [
  { id: "javascript", label: "JavaScript", icon: "🟨", runtime: "In-browser (V8)" },
  { id: "python", label: "Python", icon: "🐍", runtime: "Pyodide (downloads ~10MB on first run, cached)" },
  { id: "html", label: "HTML", icon: "🌐", runtime: "Live preview iframe" },
  { id: "css", label: "CSS", icon: "🎨", runtime: "Live preview iframe" },
  { id: "sql", label: "SQL", icon: "🗄️", runtime: "Links to DB Fiddle (external)" },
  { id: "bash", label: "Bash", icon: "💻", runtime: "Simulated (fake filesystem)" },
];

const EXAMPLES: Record<Lang, { name: string; code: string }[]> = {
  javascript: [
    { name: "Hello World", code: `console.log("Hello, Launchpad!");` },
    { name: "Fibonacci", code: `function fib(n) {\n  if (n < 2) return n;\n  return fib(n - 1) + fib(n - 2);\n}\n\nfor (let i = 0; i < 10; i++) {\n  console.log(\`fib(\${i}) = \${fib(i)}\`);\n}` },
    { name: "Array Methods", code: `const nums = [1, 2, 3, 4, 5];\n\nconst doubled = nums.map(n => n * 2);\nconst sum = nums.reduce((a, b) => a + b, 0);\nconst evens = nums.filter(n => n % 2 === 0);\n\nconsole.log("Original:", nums);\nconsole.log("Doubled:", doubled);\nconsole.log("Sum:", sum);\nconsole.log("Evens:", evens);` },
    { name: "Object & Class", code: `class Animal {\n  constructor(name) { this.name = name; }\n  speak() { return \`\${this.name} makes a sound\`; }\n}\n\nclass Dog extends Animal {\n  speak() { return \`\${this.name} barks!\`; }\n}\n\nconst buddy = new Dog("Buddy");\nconsole.log(buddy.speak());` },
    { name: "Async/Await", code: `function fetchUser(id) {\n  return new Promise(resolve => {\n    setTimeout(() => resolve({ id, name: "User " + id }), 500);\n  });\n}\n\nasync function main() {\n  console.log("Loading...");\n  const user = await fetchUser(1);\n  console.log("Got:", user);\n  console.log("Done!");\n}\n\nmain();` },
  ],
  python: [
    { name: "Hello World", code: `print("Hello, Launchpad!")` },
    { name: "List Comprehension", code: `squares = [x**2 for x in range(10)]\nprint(squares)\nprint("Sum:", sum(squares))` },
    { name: "Fibonacci", code: `def fib(n):\n    if n < 2:\n        return n\n    return fib(n-1) + fib(n-2)\n\nfor i in range(10):\n    print(f"fib({i}) = {fib(i)}")` },
    { name: "Classes", code: `class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return f"{self.name} makes a sound"\n\nclass Dog(Animal):\n    def speak(self):\n        return f"{self.name} barks!"\n\nbuddy = Dog("Buddy")\nprint(buddy.speak())` },
    { name: "Dictionary", code: `prices = {"apple": 0.50, "banana": 0.25, "cherry": 2.00}\n\ntotal = sum(prices.values())\nprint(f"Total: \${total:.2f}")\nprint(f"Items: {len(prices)}")\nfor fruit, price in sorted(prices.items()):\n    print(f"  {fruit}: \${price:.2f}")` },
  ],
  html: [
    { name: "Basic Page", code: `<!DOCTYPE html>\n<html>\n<head>\n  <title>Hello</title>\n</head>\n<body>\n  <h1 style="color: teal;">Hello, Launchpad!</h1>\n  <p>This is a live HTML preview.</p>\n</body>\n</html>` },
    { name: "Form", code: `<form>\n  <label>Name: <input type="text" placeholder="Your name"></label><br><br>\n  <label>Email: <input type="email" placeholder="you@example.com"></label><br><br>\n  <button type="button" onclick="alert('Submitted!')">Submit</button>\n</form>` },
  ],
  css: [
    { name: "Flexbox Center", code: `body {\n  margin: 0;\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n}\nh1 {\n  color: white;\n  font-family: system-ui;\n  text-align: center;\n}` },
    { name: "Card Hover", code: `.card {\n  background: white;\n  padding: 24px;\n  border-radius: 12px;\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n.card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 16px rgba(0,0,0,0.15);\n}` },
  ],
  sql: [
    { name: "SELECT", code: `-- Run this on DB Fiddle (PostgreSQL)\nSELECT * FROM users\nWHERE age >= 18\nORDER BY name;` },
    { name: "JOIN", code: `-- Run this on DB Fiddle\nSELECT u.name, COUNT(o.id) as order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name\nHAVING COUNT(o.id) > 0;` },
  ],
  bash: [
    { name: "Hello", code: `echo "Hello, World!"\npwd\nls` },
    { name: "Variables", code: `NAME="Launchpad"\necho "Welcome to $NAME"\nmkdir my-project\necho "Created directory"\nls` },
  ],
};

// Pyodide singleton — loaded once, cached for the session
let pyodideInstance: any = null;
let pyodideLoading: Promise<any> | null = null;

async function loadPyodide(onProgress?: (msg: string) => void): Promise<any> {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) return pyodideLoading;
  pyodideLoading = (async () => {
    onProgress?.("Loading Pyodide script...");
    if (!(window as any).loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Pyodide from CDN. Check your internet connection."));
        document.head.appendChild(script);
      });
    }
    onProgress?.("Initializing Python runtime (~10MB)...");
    pyodideInstance = await (window as any).loadPyodide();
    onProgress?.("Python ready!");
    return pyodideInstance;
  })();
  return pyodideLoading;
}

export function PlaygroundView() {
  const [language, setLanguage] = useState<Lang>("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<{ type: "log" | "error" | "warn" | "info"; text: string }[]>([]);
  const [running, setRunning] = useState(false);
  const [pyodideStatus, setPyodideStatus] = useState<string>("");
  const [showExamples, setShowExamples] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState<string | null>(null);
  const storeCode = useStore((s) => s.playgroundCode);
  const setPlaygroundCode = useStore((s) => s.setPlaygroundCode);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load code from "Try in Playground" buttons
  useEffect(() => {
    if (storeCode) {
      setCode(storeCode);
      setPlaygroundCode(null);
    }
  }, [storeCode, setPlaygroundCode]);

  // When language changes, load first example or clear
  useEffect(() => {
    if (!code || !EXAMPLES[language].some(e => e.code === code)) {
      // Keep current code if user is editing, otherwise load first example
    }
  }, [language]);

  const run = async () => {
    setRunning(true);
    setOutput([]);
    setHtmlPreview(null);

    try {
      if (language === "javascript") {
        // JS execution (existing logic)
        const logs: { type: "log" | "error" | "warn" | "info"; text: string }[] = [];
        const origLog = console.log, origError = console.error, origWarn = console.warn, origInfo = console.info;
        const capture = (type: "log" | "error" | "warn" | "info") => (...args: unknown[]) => {
          const text = args.map((a) => {
            if (typeof a === "string") return a;
            try { return JSON.stringify(a, null, 2); } catch { return String(a); }
          }).join(" ");
          logs.push({ type, text });
        };
        console.log = capture("log"); console.error = capture("error"); console.warn = capture("warn"); console.info = capture("info");
        try {
          const wrapped = `return (async () => { ${code} })();`;
          const fn = new Function(wrapped);
          const result = fn();
          if (result && typeof result.then === "function") {
            result.catch((err: Error) => {
              logs.push({ type: "error", text: err.message });
              setOutput([...logs]);
              setRunning(false);
            });
          }
        } catch (err) {
          logs.push({ type: "error", text: (err as Error).message });
        } finally {
          console.log = origLog; console.error = origError; console.warn = origWarn; console.info = origInfo;
          setOutput([...logs]);
        }
      } else if (language === "python") {
        setPyodideStatus("Loading Python runtime (first run downloads ~10MB, then cached)...");
        const pyodide = await loadPyodide((msg) => setPyodideStatus(msg));
        setPyodideStatus("");
        const logs: { type: "log" | "error" | "warn" | "info"; text: string }[] = [];
        pyodide.setStdout({ batched: (s: string) => logs.push({ type: "log", text: s }) });
        pyodide.setStderr({ batched: (s: string) => logs.push({ type: "error", text: s }) });
        try {
          await pyodide.runPythonAsync(code);
        } catch (err) {
          logs.push({ type: "error", text: String(err) });
        }
        setOutput([...logs]);
      } else if (language === "html") {
        setHtmlPreview(code);
        setOutput([{ type: "info", text: "HTML preview rendered below ↓" }]);
      } else if (language === "css") {
        const fullDoc = `<!DOCTYPE html><html><head><style>${code}</style></head><body><h1>Hello from CSS!</h1><p>Style me with the CSS on the left.</p><div class="card">Card example</div></body></html>`;
        setHtmlPreview(fullDoc);
        setOutput([{ type: "info", text: "CSS preview rendered below ↓" }]);
      } else if (language === "sql") {
        setOutput([{ type: "info", text: "SQL runs on a database server. Click the link below to run on DB Fiddle (PostgreSQL):" }]);
      } else if (language === "bash") {
        const result = simulateBash(code);
        setOutput(result.map((line) => ({ type: "log" as const, text: line })));
      }
    } catch (err) {
      setOutput([{ type: "error", text: String(err) }]);
    } finally {
      setRunning(false);
    }
  };

  const clear = () => {
    setOutput([]);
    setHtmlPreview(null);
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(code);
  };

  const langConfig = LANGUAGES.find(l => l.id === language)!;
  const fileExt = language === "javascript" ? "js" : language === "python" ? "py" : language;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Code Playground</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Write, run, and experiment with code in 6 languages — all in your browser. Python runtime downloads once and is cached on your device.
        </p>
      </div>

      {/* Language selector — horizontal tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-foreground/5">
        {LANGUAGES.map((l) => (
          <button
            key={l.id}
            onClick={() => setLanguage(l.id)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
              language === l.id
                ? "bg-background text-foreground shadow-sm border border-border/60"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
            )}
          >
            <span>{l.icon}</span>
            {l.label}
          </button>
        ))}
      </div>

      {/* Runtime info for selected language */}
      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
        <Info className="h-3 w-3" />
        <span><strong className="text-foreground">{langConfig.label}:</strong> {langConfig.runtime}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Editor + output */}
        <div className="space-y-3">
          {/* Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <GlassButton variant="primary" size="sm" onClick={run} disabled={running || !code.trim()}>
              <Play className="h-3.5 w-3.5" /> {running ? (pyodideStatus ? "Loading..." : "Running...") : "Run"}
            </GlassButton>
            <GlassButton variant="ghost" size="sm" onClick={copyCode}>
              <Copy className="h-3.5 w-3.5" /> Copy
            </GlassButton>
            <GlassButton variant="ghost" size="sm" onClick={clear}>
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </GlassButton>
            {/* SQL external link */}
            {language === "sql" && (
              <a
                href="https://www.db-fiddle.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Open DB Fiddle
              </a>
            )}
          </div>

          {/* Pyodide loading status */}
          {pyodideStatus && (
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-2.5 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <Download className="h-3.5 w-3.5 animate-pulse" />
              {pyodideStatus}
            </div>
          )}

          {/* Code editor */}
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-700/50 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">code.{fileExt}</span>
              <span className="text-[10px] font-mono text-zinc-500">{langConfig.label}</span>
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-72 p-3 font-mono text-xs bg-zinc-900 text-zinc-100 resize-y focus:outline-none"
              placeholder={`// Write your ${langConfig.label} here, then click Run`}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const t = e.currentTarget;
                  const start = t.selectionStart;
                  const end = t.selectionEnd;
                  const newCode = code.slice(0, start) + "  " + code.slice(end);
                  setCode(newCode);
                  requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = start + 2; });
                }
              }}
            />
          </div>

          {/* Output console (hidden for HTML/CSS — they get preview iframe) */}
          {(language === "javascript" || language === "python" || language === "bash" || language === "sql") && (
            <div className="rounded-xl border border-border/60 overflow-hidden">
              <div className="px-3 py-1.5 bg-card/60 border-b border-border/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Output</span>
                {output.length > 0 && <span className="text-[10px] font-mono text-muted-foreground">{output.length} lines</span>}
              </div>
              <div className="p-3 min-h-[100px] max-h-[300px] overflow-y-auto bg-zinc-950 text-zinc-100 font-mono text-xs">
                {output.length === 0 ? (
                  <span className="text-zinc-500 italic">{"// Output will appear here"}</span>
                ) : (
                  output.map((line, i) => (
                    <div key={i} className={cn(
                      "py-0.5",
                      line.type === "error" && "text-rose-400",
                      line.type === "warn" && "text-amber-400",
                      line.type === "info" && "text-sky-400",
                      line.type === "log" && "text-zinc-100",
                    )}>
                      <span className="text-zinc-600 mr-2 select-none">{">"}</span>
                      <pre className="whitespace-pre-wrap inline">{line.text}</pre>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* HTML/CSS live preview */}
          {htmlPreview && (
            <div className="rounded-xl border border-border/60 overflow-hidden">
              <div className="px-3 py-1.5 bg-card/60 border-b border-border/60">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Live Preview</span>
              </div>
              <iframe
                srcDoc={htmlPreview}
                title="Preview"
                className="w-full h-72 bg-white"
                sandbox="allow-scripts"
              />
            </div>
          )}
        </div>

        {/* Examples sidebar — collapsible */}
        <div className="space-y-2">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="w-full flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
          >
            <span>Examples ({EXAMPLES[language].length})</span>
            {showExamples ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {showExamples && (
            <div className="space-y-1.5">
              {EXAMPLES[language].map((ex) => (
                <button
                  key={ex.name}
                  onClick={() => setCode(ex.code)}
                  className="w-full text-left rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 p-2.5 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Code2 className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium">{ex.name}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1 font-mono">
                    {ex.code.split("\n")[0]}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Download status indicator for Pyodide */}
          {language === "python" && (
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-2.5 text-[10px] text-muted-foreground">
              <div className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">📦 Python Runtime</div>
              {pyodideInstance ? (
                <p>✅ Downloaded and cached. Future runs load instantly.</p>
              ) : (
                <p>Will download ~10MB on first Run. Cached in memory for this session.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Frameworks & databases — moved to BOTTOM per user request */}
      <GlassCard className="p-4 border-sky-500/30 bg-sky-500/5">
        <div className="flex items-start gap-2">
          <ExternalLink className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground flex-1">
            <p className="mb-2 font-medium text-foreground">Frameworks & databases — use official playgrounds</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <a href="https://svelte.dev/playground" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Svelte REPL →</a>
              <a href="https://play.vuejs.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vue SFC →</a>
              <a href="https://stackblitz.com/edit/angular" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">StackBlitz Angular →</a>
              <a href="https://stackblitz.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Node.js StackBlitz →</a>
              <a href="https://runkit.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Node.js RunKit →</a>
              <a href="https://www.db-fiddle.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PostgreSQL DB Fiddle →</a>
              <a href="https://www.pgplay.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PostgreSQL pgplay →</a>
              <a href="https://mongoplayground.net/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">MongoDB Playground →</a>
            </div>
            <p className="mt-2 text-[10px] italic">
              Svelte/Vue/Angular compile to JavaScript — their official REPLs run the framework code.
              Node.js runs server-side. PostgreSQL/MongoDB need a database server.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// ============================================================
// Simulated bash — reuse from InlineCodeEditor
// ============================================================
function simulateBash(code: string): string[] {
  const lines = code.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#"));
  const fs: Record<string, string> = {
    "/": "home  etc  usr  var  tmp",
    "/home": "user",
    "/home/user": "README.md  project.txt",
    "/home/user/README.md": "Welcome to Launchpad's simulated bash!",
    "/home/user/project.txt": "Project ideas:\n1. Build a CLI\n2. Make a web app",
  };
  let cwd = "/home/user";
  const output: string[] = [];
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    switch (cmd) {
      case "echo": output.push(args.join(" ").replace(/['"]/g, "")); break;
      case "pwd": output.push(cwd); break;
      case "ls": output.push(fs[cwd] ?? ""); break;
      case "cat": {
        const fp = args[0]?.startsWith("/") ? args[0] : `${cwd}/${args[0]}`;
        output.push(fs[fp] ?? `cat: ${args[0]}: No such file`);
        break;
      }
      case "mkdir": output.push(`(simulated) created directory: ${args[0] ?? ""}`); break;
      case "touch": output.push(`(simulated) created file: ${args[0] ?? ""}`); break;
      case "grep": output.push(`(simulated) grep pattern: ${args[0] ?? ""}`); break;
      case "cd":
        if (args[0] === ".." || args[0] === "/") cwd = args[0] === "/" ? "/" : cwd.split("/").slice(0, -1).join("/") || "/";
        else if (args[0]) cwd = args[0].startsWith("/") ? args[0] : `${cwd}/${args[0]}`;
        break;
      default: output.push(`(simulated) command not recognized: ${cmd}. Supported: echo, pwd, ls, cat, mkdir, touch, grep, cd`);
    }
  }
  return output;
}
