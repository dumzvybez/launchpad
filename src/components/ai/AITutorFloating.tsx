"use client";

import { useEffect, useRef } from "react";
import { Bot, Minimize2 } from "lucide-react";
import { useStore } from "@/lib/store";
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
      {/* Floating bubble — v6.009: positioned just above the mobile bottom nav
          (bottom-20 = 80px, clears the ~64px nav bar). Desktop stays at bottom-6.
          Added safe-area padding for iOS devices with home indicators. */}
      {showBubble && (
        <button
          data-ai-bubble
          onClick={handleBubbleClick}
          className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-[60] h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          style={{ bottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}
          aria-label={onAiTutorTab ? "Minimize AI Tutor to floating window" : "Open AI Tutor"}
          title={onAiTutorTab ? "Minimize AI Tutor" : "Ask the AI Tutor"}
        >
          {onAiTutorTab ? <Minimize2 className="h-5 w-5 text-white" /> : <Bot className="h-6 w-6 text-white" />}
        </button>
      )}

      {/* Floating chat window — v6.009: full-screen on mobile, anchored panel on desktop */}
      {showFloatingWindow && (
        <div
          ref={containerRef}
          className="fixed inset-x-0 bottom-0 top-16 z-[60] lg:inset-x-auto lg:bottom-6 lg:top-auto lg:right-6 lg:w-[380px] lg:h-[560px] lg:max-h-[calc(100vh-3rem)] rounded-t-2xl lg:rounded-2xl border border-border bg-popover shadow-2xl flex flex-col overflow-hidden"
          style={{
            backdropFilter: "blur(40px) saturate(200%)",
            WebkitBackdropFilter: "blur(40px) saturate(200%)",
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
