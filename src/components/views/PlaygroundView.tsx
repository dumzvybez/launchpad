"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Trash2, Copy, Code2, Info } from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard, GlassButton } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";

const EXAMPLES: { name: string; code: string }[] = [
  {
    name: "Hello World",
    code: `console.log("Hello, Launchpad!");`,
  },
  {
    name: "Fibonacci",
    code: `function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

for (let i = 0; i < 10; i++) {
  console.log(\`fib(\${i}) = \${fib(i)}\`);
}`,
  },
  {
    name: "Array Methods",
    code: `const nums = [1, 2, 3, 4, 5];

const doubled = nums.map(n => n * 2);
const sum = nums.reduce((a, b) => a + b, 0);
const evens = nums.filter(n => n % 2 === 0);

console.log("Original:", nums);
console.log("Doubled:", doubled);
console.log("Sum:", sum);
console.log("Evens:", evens);`,
  },
  {
    name: "Object & Class",
    code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return \`\${this.name} makes a sound\`;
  }
}

class Dog extends Animal {
  speak() {
    return \`\${this.name} barks!\`;
  }
}

const buddy = new Dog("Buddy");
console.log(buddy.speak());`,
  },
  {
    name: "Async/Await",
    code: `// Simulate fetching data
function fetchUser(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id, name: "User " + id }), 500);
  });
}

async function main() {
  console.log("Loading...");
  const user = await fetchUser(1);
  console.log("Got:", user);
  console.log("Done!");
}

main();`,
  },
];

export function PlaygroundView() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<{ type: "log" | "error" | "warn" | "info"; text: string }[]>([]);
  const [running, setRunning] = useState(false);
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

  const run = () => {
    setRunning(true);
    setOutput([]);
    const logs: { type: "log" | "error" | "warn" | "info"; text: string }[] = [];

    // Capture console output
    const origLog = console.log;
    const origError = console.error;
    const origWarn = console.warn;
    const origInfo = console.info;

    const capture = (type: "log" | "error" | "warn" | "info") => (...args: unknown[]) => {
      const text = args
        .map((a) => {
          if (typeof a === "string") return a;
          try {
            return JSON.stringify(a, null, 2);
          } catch {
            return String(a);
          }
        })
        .join(" ");
      logs.push({ type, text });
    };

    console.log = capture("log");
    console.error = capture("error");
    console.warn = capture("warn");
    console.info = capture("info");

    try {
      // Wrap in async function to allow await
      const wrapped = `
        return (async () => {
          ${code}
        })();
      `;
      const fn = new Function(wrapped);
      const result = fn();
      // Handle promise rejection
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
      console.log = origLog;
      console.error = origError;
      console.warn = origWarn;
      console.info = origInfo;
      setOutput([...logs]);
      setRunning(false);
    }
  };

  const clear = () => {
    setOutput([]);
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(code);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">JavaScript Playground</h1>
        <p className="text-sm text-muted-foreground mt-1">
          <strong className="text-foreground">JavaScript Playground — runs JS in your browser.</strong> Write, run, and experiment with JavaScript code instantly. No setup, no installs.
        </p>
      </div>

      <GlassCard className="p-3 border-amber-500/30 bg-amber-500/5">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="mb-1">
              This playground <strong>only runs JavaScript</strong> — it executes JS in your browser using the built-in V8 engine. TypeScript files are also supported (they run as JavaScript).
            </p>
            <p>
              For <strong>Python</strong> or other languages, use an external environment like{" "}
              <a href="https://replit.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Replit</a>,{" "}
              <a href="https://colab.research.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Colab</a>, or{" "}
              <a href="https://www.onlinegdb.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OnlineGDB</a>.
              We do not pretend to run Python here — Pyodide is not integrated.
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        {/* Editor + output */}
        <div className="space-y-3">
          {/* Toolbar */}
          <div className="flex items-center gap-2">
            <GlassButton variant="primary" size="sm" onClick={run} disabled={running}>
              <Play className="h-3.5 w-3.5" /> {running ? "Running..." : "Run"}
            </GlassButton>
            <GlassButton variant="ghost" size="sm" onClick={copyCode}>
              <Copy className="h-3.5 w-3.5" /> Copy
            </GlassButton>
            <GlassButton variant="ghost" size="sm" onClick={clear}>
              <Trash2 className="h-3.5 w-3.5" /> Clear output
            </GlassButton>
          </div>

          {/* Code editor */}
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-700/50 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">main.js</span>
              <span className="text-[10px] font-mono text-zinc-500">JavaScript</span>
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-72 p-3 font-mono text-xs bg-zinc-900 text-zinc-100 resize-y focus:outline-none"
              placeholder="// Write your JavaScript here, then click Run"
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const t = e.currentTarget;
                  const start = t.selectionStart;
                  const end = t.selectionEnd;
                  const newCode = code.slice(0, start) + "  " + code.slice(end);
                  setCode(newCode);
                  requestAnimationFrame(() => {
                    t.selectionStart = t.selectionEnd = start + 2;
                  });
                }
              }}
            />
          </div>

          {/* Output console */}
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <div className="px-3 py-1.5 bg-card/60 border-b border-border/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Console output</span>
              {output.length > 0 && (
                <span className="text-[10px] font-mono text-muted-foreground">{output.length} lines</span>
              )}
            </div>
            <div className="p-3 min-h-[100px] max-h-[300px] overflow-y-auto bg-zinc-950 text-zinc-100 font-mono text-xs">
              {output.length === 0 ? (
                <span className="text-zinc-500 italic">{"// Output will appear here"}</span>
              ) : (
                output.map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      "py-0.5",
                      line.type === "error" && "text-rose-400",
                      line.type === "warn" && "text-amber-400",
                      line.type === "info" && "text-sky-400",
                      line.type === "log" && "text-zinc-100",
                    )}
                  >
                    <span className="text-zinc-600 mr-2 select-none">{">"}</span>
                    <pre className="whitespace-pre-wrap inline">{line.text}</pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Examples sidebar */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Examples</h3>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.name}
              onClick={() => setCode(ex.code)}
              className="w-full text-left rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 p-3 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Code2 className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-medium">{ex.name}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 font-mono">
                {ex.code.split("\n")[0]}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
