"use client";

import { useEffect, useRef } from "react";
import { Bot, Minimize2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AIChat } from "./AIChat";

export function AITutorFloating() {
  const open = useStore((s) => s.aiTutorOpen);
  const setOpen = useStore((s) => s.setAiTutorOpen);
  const maximized = useStore((s) => s.aiTutorMaximized);
  const setMaximized = useStore((s) => s.setAiTutorMaximized);
  const currentView = useStore((s) => s.currentView);
  const setView = useStore((s) => s.setView);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close floating window when clicking OUTSIDE (but not inside)
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (target.closest("[data-ai-bubble]")) return;
        setOpen(false);
      }
    }
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", onClick);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", onClick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, setOpen]);

  // We are "on the AI Tutor tab" when either the user is on the ai-tutor view,
  // OR they clicked maximize from the floating window.
  const onAiTutorTab = currentView === "ai-tutor" || maximized;

  // The floating chat window only renders when:
  //  - The user clicked the bubble to open it (open === true)
  //  - We're NOT on the full AI Tutor tab (maximized/onAiTutorTab)
  const showFloatingWindow = open && !onAiTutorTab;

  // The bubble button is always visible EXCEPT when the floating window is open.
  // When on the AI Tutor tab, the bubble becomes a "minimize" button that exits the tab.
  const showBubble = !showFloatingWindow;

  const handleBubbleClick = () => {
    if (onAiTutorTab) {
      // Exit the AI Tutor tab back to dashboard + reopen floating
      setMaximized(false);
      setView("dashboard");
      setOpen(true);
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      {/* Floating bubble — v6.010 (UI-B):
          Mobile: sits ABOVE the bottom nav (5rem + safe-area) so it never
          overlaps the nav bar or the iOS home indicator / Android gesture bar.
          Desktop: anchored to bottom-right (1.5rem).
          56px on mobile (≥44px touch target), 56px on desktop.
          High-contrast violet→fuchsia gradient + ring for accessibility. */}
      {showBubble && (
        <button
          data-ai-bubble
          onClick={handleBubbleClick}
          className={cn(
            "fixed right-4 lg:right-6 z-[60]",
            "h-14 w-14 rounded-full",
            "bg-gradient-to-br from-violet-500 to-fuchsia-500",
            "shadow-2xl shadow-fuchsia-500/30",
            "ring-2 ring-white/25 dark:ring-white/10",
            "flex items-center justify-center",
            "hover:scale-110 active:scale-95 transition-transform",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-400/60",
            // Mobile: clear the ~64-72px bottom nav + safe-area.
            // Desktop: standard 1.5rem corner offset.
            "bottom-[calc(env(safe-area-inset-bottom,0px)+5.25rem)] lg:bottom-6",
          )}
          aria-label={onAiTutorTab ? "Minimize AI Tutor to floating window" : "Open AI Tutor"}
          title={onAiTutorTab ? "Minimize AI Tutor" : "Ask the AI Tutor"}
        >
          {onAiTutorTab ? (
            <Minimize2 className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-6 w-6 text-white" />
          )}
          {/* Subtle pulse ring so the FAB reads as interactive on mobile */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-fuchsia-500/30 animate-ping opacity-20 pointer-events-none"
          />
        </button>
      )}

      {/* Floating chat window — v6.010 (UI-B):
          Mobile: full-screen sheet from top-16 to bottom, with safe-area
          bottom padding so the chat input clears the iOS home indicator.
          Desktop: anchored 380x560 panel in the bottom-right. */}
      {showFloatingWindow && (
        <div
          ref={containerRef}
          className={cn(
            "fixed z-[60] flex flex-col overflow-hidden",
            // Mobile: full-width sheet.
            "inset-x-0 bottom-0 top-16 rounded-t-2xl",
            // Desktop: anchored panel.
            "lg:inset-x-auto lg:bottom-6 lg:top-auto lg:right-6",
            "lg:w-[380px] lg:h-[560px] lg:max-h-[calc(100vh-3rem)] lg:rounded-2xl",
            "border border-border bg-popover shadow-2xl",
          )}
          style={{
            backdropFilter: "blur(40px) saturate(200%)",
            WebkitBackdropFilter: "blur(40px) saturate(200%)",
            // Mobile: pad the bottom so the chat input clears the iOS home
            // indicator / Android gesture bar. Desktop: no extra padding.
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          <div className="p-3 flex-1 min-h-0">
            <AIChat
              onMaximize={() => {
                setMaximized(true);
                setOpen(false);
                setView("ai-tutor");
              }}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
