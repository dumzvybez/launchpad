"use client";

// LessonProgress — v6.010 within-lesson scroll-progress indicator.
//
// A thin, fixed progress bar at the very top of the viewport that fills as
// the learner scrolls through the lesson. Lightweight: uses scroll position,
// no content parsing. Hidden at 0% and 100% to avoid visual noise.
//
// v6.010: The bar now uses a foreground-based accent (not faint teal) so it
// remains visible on light and dark glass backgrounds.

import { useEffect, useState, type RefObject } from "react";

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
      const scrollHeight = el
        ? el.scrollHeight - el.clientHeight
        : document.documentElement.scrollHeight - window.innerHeight;
      const p =
        scrollHeight > 0 ? Math.min(100, Math.round((scrollTop / scrollHeight) * 100)) : 0;
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
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent pointer-events-none"
      aria-hidden
    >
      <div
        className="h-full bg-foreground/70 dark:bg-foreground/80 transition-[width] duration-150"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
