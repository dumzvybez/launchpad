import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { LessonBlock } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Estimate reading time (in minutes) for a lesson's content blocks.
 * Uses 200 words/minute for prose, and counts code at half-rate (code
 * reads slower). Returns at least 1 minute.
 *
 * Per Section 4.2 — shown alongside the official `estMinutes` field.
 */
export function estimateReadTime(blocks: LessonBlock[]): number {
  const wordsPerMinute = 200;
  let wordCount = 0;
  for (const block of blocks) {
    if ("content" in block) {
      wordCount += block.content.split(/\s+/).filter(Boolean).length;
    }
    if ("items" in block) {
      wordCount += block.items.join(" ").split(/\s+/).filter(Boolean).length;
    }
    if ("code" in block) {
      // Code reads slower — count at half rate.
      wordCount += block.code.split(/\s+/).filter(Boolean).length / 2;
    }
  }
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
