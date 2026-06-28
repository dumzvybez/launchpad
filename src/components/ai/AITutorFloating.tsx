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
      {/* Floating bubble — always visible except when floating window is open */}
      {showBubble && (
        <button
          data-ai-bubble
          onClick={handleBubbleClick}
          className="fixed bottom-6 right-6 z-[60] h-14 w-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          aria-label={onAiTutorTab ? "Minimize AI Tutor to floating window" : "Open AI Tutor"}
          title={onAiTutorTab ? "Minimize AI Tutor" : "Ask the AI Tutor"}
        >
          {onAiTutorTab ? <Minimize2 className="h-5 w-5 text-white" /> : <Bot className="h-6 w-6 text-white" />}
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-background" />
        </button>
      )}

      {/* Floating chat window */}
      {showFloatingWindow && (
        <div
          ref={containerRef}
          className="fixed bottom-6 right-6 z-[60] w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] rounded-2xl border border-border bg-popover shadow-2xl flex flex-col overflow-hidden"
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
