"use client";

import { useState, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Markdown renderer for AI chat messages (v5.78).
 *
 * v5.78 fix: replaced the hand-rolled regex-based renderer with `react-markdown`
 * + `remark-gfm`. The old renderer didn't support headings, lists, tables,
 * blockquotes, or horizontal rules — all of which the AI system prompts
 * explicitly request (e.g., Code Review asks for `## Overall Impression`,
 * `## Issues Found (list each issue)`, etc.). The old renderer showed these
 * as literal `## ...` and `- ...` text.
 *
 * Now supports the full GitHub-flavored Markdown spec:
 *   - Headings (h1-h6)
 *   - Bold, italic, strikethrough
 *   - Inline code + fenced code blocks (with copy button + language label)
 *   - Ordered/unordered lists + nested lists
 *   - Tables (with GFM)
 *   - Blockquotes
 *   - Horizontal rules
 *   - Links (with URL sanitization — only http/https/mailto allowed)
 *
 * XSS safety: react-markdown does NOT render raw HTML by default (no
 * `rehype-raw`), so injected `<script>` tags in AI output are escaped, not
 * executed. Link URLs are sanitized via the `urlTransform` prop.
 */
export const MarkdownRenderer = memo(function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words
      prose-headings:mt-3 prose-headings:mb-1.5 prose-headings:first:mt-0
      prose-h1:text-base prose-h1:font-bold
      prose-h2:text-sm prose-h2:font-bold prose-h2:mt-4
      prose-h3:text-sm prose-h3:font-semibold
      prose-p:my-1 prose-p:leading-relaxed
      prose-ul:my-1 prose-ul:list-disc prose-ul:pl-5
      prose-ol:my-1 prose-ol:list-decimal prose-ol:pl-5
      prose-li:my-0.5
      prose-blockquote:border-l-2 prose-blockquote:border-primary/40 prose-blockquote:pl-3 prose-blockquote:italic prose-blockquote:text-muted-foreground
      prose-code:before:content-none prose-code:after:content-none
      prose-code:bg-primary/10 prose-code:text-primary prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em] prose-code:font-mono
      prose-pre:bg-zinc-950 prose-pre:p-0 prose-pre:my-2
      prose-a:text-primary prose-a:underline prose-a:underline-offset-2
      prose-hr:my-3 prose-hr:border-border/60
      prose-table:my-2 prose-table:w-full prose-table:text-xs
      prose-th:border prose-th:border-border/60 prose-th:px-2 prose-th:py-1 prose-th:bg-foreground/5 prose-th:font-semibold prose-th:text-left
      prose-td:border prose-td:border-border/60 prose-td:px-2 prose-td:py-1
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={sanitizeUrl}
        components={{
          // Render fenced code blocks with our custom CodeBlock (copy button + language label).
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children, ...props }) => {
            // react-markdown v9+ passes `inline` via className for inline code.
            // Fenced code blocks are wrapped in <pre><code class="language-xxx">.
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");
            if (isInline) {
              return (
                <code className={className} {...props}>{children}</code>
              );
            }
            return (
              <CodeBlock code={String(children).replace(/\n$/, "")} language={match?.[1]} />
            );
          },
          // Open links in a new tab with noopener.
          a: ({ href, children, ...props }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          ),
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
