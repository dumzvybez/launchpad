"use client";

import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lightweight markdown renderer for chat messages.
 * Supports: code blocks (```lang\n...```), inline code (`code`),
 * bold (**text**), italic (*text*), links [text](url), and line breaks.
 * No external dependencies.
 */
export function MarkdownRenderer({ content }: { content: string }) {
  const blocks = useMemo(() => parseBlocks(content), [content]);
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {blocks.map((block, i) => {
        if (block.type === "code") {
          return <CodeBlock key={i} code={block.code} language={block.language} />;
        }
        if (block.type === "text") {
          return (
            <div key={i} className="whitespace-pre-wrap">
              {renderInline(block.text)}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
      <pre className="p-3 overflow-x-auto text-xs font-mono bg-zinc-950 text-zinc-100 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function renderInline(text: string): React.ReactNode[] {
  // Tokenize: inline code, bold, italic, links
  const tokens: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Inline code: `...`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      tokens.push(
        <code key={key++} className="px-1.5 py-0.5 rounded bg-foreground/10 font-mono text-[0.85em] text-primary">
          {codeMatch[1]}
        </code>,
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }
    // Bold: **...**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      tokens.push(<strong key={key++} className="font-semibold">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }
    // Italic: *...*
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      tokens.push(<em key={key++}>{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }
    // Link: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      tokens.push(
        <a key={key++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          {linkMatch[1]}
        </a>,
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }
    // Plain text up to next special char
    const nextSpecial = remaining.search(/[`*\[]/);
    if (nextSpecial === -1) {
      tokens.push(<span key={key++}>{remaining}</span>);
      break;
    }
    if (nextSpecial > 0) {
      tokens.push(<span key={key++}>{remaining.slice(0, nextSpecial)}</span>);
      remaining = remaining.slice(nextSpecial);
    } else {
      // No match at all — push single char to avoid infinite loop
      tokens.push(<span key={key++}>{remaining[0]}</span>);
      remaining = remaining.slice(1);
    }
  }
  return tokens;
}

type Block =
  | { type: "text"; text: string }
  | { type: "code"; code: string; language?: string };

function parseBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  const lines = content.split("\n");
  let currentText: string[] = [];
  let inCodeBlock = false;
  let codeLang: string | undefined;
  let codeLines: string[] = [];

  for (const line of lines) {
    const codeStart = line.match(/^```(\w*)/);
    if (codeStart && !inCodeBlock) {
      if (currentText.length > 0) {
        blocks.push({ type: "text", text: currentText.join("\n") });
        currentText = [];
      }
      inCodeBlock = true;
      codeLang = codeStart[1] || undefined;
      codeLines = [];
      continue;
    }
    if (line.trim() === "```" && inCodeBlock) {
      blocks.push({ type: "code", code: codeLines.join("\n"), language: codeLang });
      inCodeBlock = false;
      codeLang = undefined;
      codeLines = [];
      continue;
    }
    if (inCodeBlock) {
      codeLines.push(line);
    } else {
      currentText.push(line);
    }
  }

  if (inCodeBlock) {
    // Unclosed code block — push as code
    blocks.push({ type: "code", code: codeLines.join("\n"), language: codeLang });
  } else if (currentText.length > 0) {
    blocks.push({ type: "text", text: currentText.join("\n") });
  }

  return blocks;
}
