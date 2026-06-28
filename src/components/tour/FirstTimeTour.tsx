"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const TOUR_STEPS = [
  { view: "dashboard", title: "Dashboard", body: "This is your home base — see today's tasks, streak, XP, and quick stats at a glance.", targetSelector: "nav" },
  { view: "roadmap", title: "Roadmap", body: "Your personalized multi-phase roadmap. Click a phase to expand it into modules, then tasks.", targetSelector: "main" },
  { view: "learn", title: "Learn", body: "100+ built-in lessons across 9 languages (Python, JavaScript, TypeScript, Java, C, C++, C#, Go, Rust) with code examples, quizzes, and certificates.", targetSelector: "main" },
  { view: "ai-tutor", title: "AI Tutor", body: "Ask coding questions 24/7. The floating bubble in the corner opens it from any page.", targetSelector: "main" },
  { view: "playground", title: "Playground", body: "Write and run JavaScript directly in your browser — no setup needed.", targetSelector: "main", condition: (langIds: string[]) => langIds.some((id) => ["javascript", "typescript", "react", "nextjs"].includes(id)) },
  { view: "settings", title: "Settings", body: "Customize themes, density, motion, backup your data, and more.", targetSelector: "main" },
];

export function FirstTimeTour() {
  const tourCompleted = useStore((s) => s.state.preferences.tourCompleted);
  const setPreference = useStore((s) => s.setPreference);
  const setView = useStore((s) => s.setView);
  const roadmap = useStore((s) => s.state.roadmap);
  const [step, setStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [active, setActive] = useState(false);

  const steps = TOUR_STEPS.filter((s) => !("condition" in s) || (s.condition && roadmap ? s.condition(roadmap.languageIds) : true));

  useEffect(() => {
    if (tourCompleted === false) {
      const t = setTimeout(() => setActive(true), 600);
      return () => clearTimeout(t);
    }
  }, [tourCompleted]);

  if (!active || tourCompleted === true || tourCompleted === undefined) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const finish = () => {
    setPreference("tourCompleted", true);
    setActive(false);
  };

  const skip = () => {
    if (dontShowAgain) {
      setPreference("tourCompleted", true);
    }
    setActive(false);
  };

  const next = () => {
    if (isLast) {
      finish();
      return;
    }
    setStep(step + 1);
    setView(steps[step + 1].view as never);
  };

  const prev = () => {
    if (step === 0) return;
    setStep(step - 1);
    setView(steps[step - 1].view as never);
  };

  return (
    <>
      {/* Dim overlay — background still visible (rgba(0,0,0,0.4) max) */}
      <div
        className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-[1px]"
        onClick={skip}
      />

      {/* Tooltip card — positioned at bottom-right, NOT in the middle */}
      <div className="fixed bottom-6 right-6 z-[81] w-80 max-w-[90vw] rounded-2xl border border-border bg-popover shadow-2xl p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-[10px] font-mono uppercase text-muted-foreground">
              Tour · Step {step + 1} of {steps.length}
            </div>
            <h3 className="font-semibold text-base mt-1">{current.title}</h3>
          </div>
          <button
            onClick={skip}
            className="p-1 rounded hover:bg-foreground/10"
            aria-label="Close tour"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{current.body}</p>

        {/* Progress dots */}
        <div className="flex gap-1 mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === step ? "w-6 bg-primary" : i < step ? "w-3 bg-primary/60" : "w-3 bg-foreground/10",
              )}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="h-3 w-3"
            />
            Don&apos;t show again
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={prev}
              disabled={step === 0}
              className={cn(
                "flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs",
                step === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-foreground/10",
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            {isLast ? (
              <button
                onClick={finish}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Check className="h-3.5 w-3.5" /> Done
              </button>
            ) : (
              <button
                onClick={next}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={skip}
          className="mt-3 w-full text-center text-[10px] text-muted-foreground hover:text-foreground py-1"
        >
          Skip tour
        </button>
      </div>
    </>
  );
}
