"use client";

import { useEffect, useState } from "react";

/**
 * SplashScreen — premium animated intro shown on EVERY page load/refresh.
 * Total duration: ~4.5 seconds (down from 8.8s in v2.67).
 *
 * - 0.0–0.8s: logo draws in
 * - 0.8–3.7s: hold phase, subtitles cycle
 * - 3.7–4.5s: fade out
 *
 * User can disable it permanently in Settings → Appearance.
 * A "Skip" button is shown for accessibility / power users.
 */
const SUBTITLES = [
  "Learn to code. For real this time.",
  "AI-personalized. Completely free. 100% private.",
  "From zero to job-ready — without leaving this app.",
  "Open-source. No accounts. No tracking. Ever.",
];

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"draw" | "hold" | "fade">("draw");
  const [subtitleIdx, setSubtitleIdx] = useState(0);

  useEffect(() => {
    // Draw phase: logo animates in (0.8s)
    const t1 = setTimeout(() => setPhase("hold"), 800);
    // Hold phase: ~2.9s — long enough to read 3 subtitles cycling
    const t2 = setTimeout(() => setPhase("fade"), 3700);
    // Fade phase: 0.8s
    const t3 = setTimeout(() => onDone(), 4500);

    // Cycle subtitles every ~900ms during hold (3 subtitles shown)
    const sub1 = setTimeout(() => setSubtitleIdx(1), 1700);
    const sub2 = setTimeout(() => setSubtitleIdx(2), 2600);
    const sub3 = setTimeout(() => setSubtitleIdx(3), 3300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(sub1);
      clearTimeout(sub2);
      clearTimeout(sub3);
    };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: "oklch(0.11 0.012 250)",
        opacity: phase === "fade" ? 0 : 1,
        transition: "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: phase === "fade" ? "none" : "auto",
      }}
    >
      {/* Aurora glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, oklch(0.80 0.18 195 / 0.18) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, oklch(0.76 0.2 320 / 0.16) 0%, transparent 50%),
            radial-gradient(circle at 50% 90%, oklch(0.84 0.18 80 / 0.12) 0%, transparent 50%)
          `,
        }}
      />

      {/* Logo + wordmark */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated logo — three ascending chevrons */}
        <svg
          width="160"
          height="160"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{
            transform: phase === "draw" ? "scale(0.85)" : "scale(1)",
            transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <defs>
            <linearGradient id="splash-aurora" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2DD4BF">
                <animate attributeName="stop-color" values="#2DD4BF;#5EEAD4;#2DD4BF" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#E879F9">
                <animate attributeName="stop-color" values="#E879F9;#F0ABFC;#E879F9" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#FCD34D">
                <animate attributeName="stop-color" values="#FCD34D;#FDE68A;#FCD34D" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            <filter id="splash-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M 96 320 L 256 200 L 416 320 L 416 360 L 256 240 L 96 360 Z"
            fill="url(#splash-aurora)"
            filter="url(#splash-glow)"
            opacity={phase === "draw" ? 0 : 1}
            style={{
              transform: phase === "draw" ? "translateY(20px)" : "translateY(0)",
              transition: "opacity 400ms 200ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms 200ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
          <path
            d="M 136 220 L 256 140 L 376 220 L 376 260 L 256 180 L 136 260 Z"
            fill="url(#splash-aurora)"
            filter="url(#splash-glow)"
            opacity={phase === "draw" ? 0 : 1}
            style={{
              transform: phase === "draw" ? "translateY(20px)" : "translateY(0)",
              transition: "opacity 400ms 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms 400ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
          <path
            d="M 176 120 L 256 80 L 336 120 L 336 160 L 256 120 L 176 160 Z"
            fill="url(#splash-aurora)"
            filter="url(#splash-glow)"
            opacity={phase === "draw" ? 0 : 1}
            style={{
              transform: phase === "draw" ? "translateY(20px)" : "translateY(0)",
              transition: "opacity 400ms 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms 600ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </svg>

        {/* Wordmark */}
        <div
          className="flex flex-col items-center gap-3"
          style={{
            opacity: phase === "draw" ? 0 : 1,
            transform: phase === "draw" ? "translateY(10px)" : "translateY(0)",
            transition: "opacity 500ms 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms 800ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{
              background: "linear-gradient(135deg, #2DD4BF 0%, #E879F9 50%, #FCD34D 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Launchpad
          </h1>
          <p
            className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground"
          >
            Coding Education Platform
          </p>

          {/* Cycling subtitle */}
          <div className="h-5 mt-2 overflow-hidden">
            <p
              key={subtitleIdx}
              className="text-sm text-foreground/80 italic"
              style={{
                animation: "splash-subtitle-in 500ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {SUBTITLES[subtitleIdx]}
            </p>
          </div>
        </div>

        {/* Loading bar */}
        <div
          className="w-40 h-0.5 rounded-full overflow-hidden"
          style={{
            background: "oklch(0.3 0.01 250)",
            opacity: phase === "draw" ? 0 : 1,
            transition: "opacity 300ms 1000ms",
          }}
        >
          <div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #2DD4BF, #E879F9, #FCD34D)",
              width: phase === "fade" ? "100%" : phase === "hold" ? "100%" : "20%",
              transition: "width 3500ms cubic-bezier(0.65, 0, 0.35, 1)",
            }}
          />
        </div>
      </div>

      {/* Skip button — bottom right, accessible */}
      <button
        onClick={onDone}
        className="absolute bottom-6 right-6 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Skip intro"
      >
        Skip intro →
      </button>

      <style>{`
        @keyframes splash-subtitle-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
