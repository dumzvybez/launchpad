"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { getBackgroundTheme } from "@/lib/career-data";

/**
 * AuroraBackground — ambient drifting color blobs that sit behind the glass.
 * Adapts to dark/light mode automatically via CSS variables.
 * Includes an optional specular cursor light for premium refraction.
 * Also applies the user's selected background theme.
 */
export function AuroraBackground() {
  const lightRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const backgroundTheme = useStore((s) => s.state.preferences.backgroundTheme);
  const customBackground = useStore((s) => s.state.preferences.customBackground);

  // Apply the user's selected background theme
  useEffect(() => {
    if (!themeRef.current) return;
    const theme = getBackgroundTheme(backgroundTheme, customBackground);
    if (theme && theme.gradient) {
      themeRef.current.style.background = theme.gradient;
    } else {
      themeRef.current.style.background = "";
    }
  }, [backgroundTheme, customBackground]);

  useEffect(() => {
    // Subtle cursor-following specular light — desktop only
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId: number | null = null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      if (lightRef.current) {
        lightRef.current.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* User-selected background theme overlay */}
      <div
        ref={themeRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
      />
      <div className="aurora-bg" aria-hidden="true">
        <div
          className="aurora-blob aurora-drift-1"
          style={{
            width: "45vw",
            height: "45vw",
            top: "-10%",
            left: "-5%",
            background: "radial-gradient(circle, var(--aurora-1) 0%, transparent 70%)",
          }}
        />
        <div
          className="aurora-blob aurora-drift-2"
          style={{
            width: "40vw",
            height: "40vw",
            top: "30%",
            right: "-10%",
            background: "radial-gradient(circle, var(--aurora-2) 0%, transparent 70%)",
          }}
        />
        <div
          className="aurora-blob aurora-drift-3"
          style={{
            width: "38vw",
            height: "38vw",
            bottom: "-10%",
            left: "20%",
            background: "radial-gradient(circle, var(--aurora-3) 0%, transparent 70%)",
          }}
        />
        <div
          className="aurora-blob aurora-drift-4"
          style={{
            width: "32vw",
            height: "32vw",
            top: "10%",
            left: "30%",
            background: "radial-gradient(circle, var(--aurora-4) 0%, transparent 70%)",
            opacity: 0.6,
          }}
        />
      </div>
      <div ref={lightRef} className="specular-light" aria-hidden="true" />
    </>
  );
}
