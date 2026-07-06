"use client";

import { useState, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Markdown renderer for AI chat messages (v5.78).
 *
 * v5.866 BUG 3 FIX: replaced all `prose` classes (which require
 * @tailwindcss/typography — NOT installed in this project) with explicit
 * Tailwind classes. The assistant's text now uses `text-sm` (14px) to
 * match the user's message text size exactly.
 *
 * v5.78 fix: replaced the hand-rolled regex-based renderer with `react-markdown`
 * + `remark-gfm`. The old renderer didn't support headings, lists, tables,
 * blockquotes, or horizontal rules — all of which the AI system prompts
 * explicitly request.
 *
 * XSS safety: react-markdown does NOT render raw HTML by default (no
 * `rehype-raw`), so injected `<script>` tags in AI output are escaped, not
 * executed. Link URLs are sanitized via the `urlTransform` prop.
 */
export const MarkdownRenderer = memo(function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="text-sm max-w-none break-words leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={sanitizeUrl}
        components={{
          // v5.866: explicit styling for each element — no `prose` dependency.
          h1: ({ children }) => <h1 className="text-base font-bold mt-3 mb-1.5 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="text-sm font-bold mt-4 mb-1.5 first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-semibold mt-3 mb-1 first:mt-0">{children}</h3>,
          h4: ({ children }) => <h4 className="text-sm font-semibold mt-2 mb-1">{children}</h4>,
          p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="my-1 list-disc pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="my-1 list-decimal pl-5">{children}</ol>,
          li: ({ children }) => <li className="my-0.5">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/40 pl-3 italic text-muted-foreground my-2">
              {children}
            </blockquote>
          ),
          hr: ({ }) => <hr className="my-3 border-border/60" />,
          table: ({ children }) => (
            <table className="my-2 w-full text-xs border-collapse">{children}</table>
          ),
          th: ({ children }) => (
            <th className="border border-border/60 px-2 py-1 bg-foreground/5 font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border/60 px-2 py-1">{children}</td>
          ),
          a: ({ href, children, ...props }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2" {...props}>
              {children}
            </a>
          ),
          // Render fenced code blocks with our custom CodeBlock (copy button + language label).
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");
            if (isInline) {
              return (
                <code className="bg-primary/10 text-primary px-1 py-0.5 rounded text-[0.85em] font-mono" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <CodeBlock code={String(children).replace(/\n$/, "")} language={match?.[1]} />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

/**
 * Sanitize URLs to prevent javascript: scheme injection.
 * Only allows http, https, mailto, and relative URLs.
 */
function sanitizeUrl(url: string): string {
  if (!url) return "";
  if (/^(https?:|mailto:|\/|#|\.\/|\.\.\/)/i.test(url)) return url;
  // Block javascript:, data:, vbscript:, etc.
  return "";
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API may be unavailable (HTTP origin) — silently fail.
    }
  };
  return (
    <div className="rounded-lg overflow-hidden border border-border/60 my-2">
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-800 border-b border-zinc-700/50">
        <span className="text-[10px] font-mono text-zinc-400 uppercase">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 transition-colors"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="bg-zinc-950 p-3 overflow-x-auto text-xs">
        <code className="text-zinc-100 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
