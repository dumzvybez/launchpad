"use client";

// LessonProgress — v6.005 within-lesson progress indicator.
// Shows how far through the lesson's blocks the learner has scrolled.
// Lightweight: uses scroll position, no content parsing.

import { useEffect, useState, type RefObject } from "react";
import { Progress } from "@/components/ui/progress";

type Props = {
  /** The scrollable lesson container ref (defaults to window). */
  containerRef?: RefObject<HTMLElement | null>;
};

export function LessonProgress({ containerRef }: Props) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef?.current;
      const scrollTop = el ? el.scrollTop : window.scrollY;
      const scrollHeight = el ? el.scrollHeight - el.clientHeight : document.documentElement.scrollHeight - window.innerHeight;
      const p = scrollHeight > 0 ? Math.min(100, Math.round((scrollTop / scrollHeight) * 100)) : 0;
      setPct(p);
    };
    onScroll();
    const target = containerRef?.current ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [containerRef]);

  if (pct === 0 || pct === 100) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent pointer-events-none">
      <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${pct}%` }} />
    </div>
  );
}

// Silence unused-import warning for Progress (kept for future variant).
void Progress;
