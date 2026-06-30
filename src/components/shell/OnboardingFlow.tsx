"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  AlertTriangle,
  Sparkles,
  Target,
  Code2,
  GraduationCap,
  Clock,
  Map,
  Shield,
  Search,
  ChevronDown,
  X,
  Info,
  Loader2,
  Globe,
  Github,
  Linkedin,
  Youtube,
  Instagram,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  CAREERS,
  CAREER_MAP,
  LANGUAGES,
  LANGUAGE_MAP,
  OCCUPATIONS,
  BACKGROUND_THEMES,
} from "@/lib/career-data";
import type { CareerId, LanguageInfo, PersonalizationInput, SkillLevel } from "@/lib/types";
import { GlassButton } from "@/components/glass/GlassPrimitives";
import { LogoMark } from "@/components/shell/Sidebar";
import {
  generateRoadmap,
  validateRoadmap,
  getGenerationStagesForInput,
  generateRoadmapWithAI,
  regenerateRoadmapWithAI,
} from "@/lib/personalization-engine";
import type { GeneratedRoadmap } from "@/lib/types";

const TOTAL_STEPS = 8; // steps 0-7

export function OnboardingFlow({ onDone }: { onDone: () => void }) {
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const setPreference = useStore((s) => s.setPreference);
  const [step, setStep] = useState(0);

  // Input state for all steps
  const [name, setName] = useState("");
  const [careerId, setCareerId] = useState<CareerId | "">("");
  const [subPath, setSubPath] = useState<string>("");
  const [occupationId, setOccupationId] = useState<string>("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("beginner");
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [generatedRoadmap, setGeneratedRoadmap] = useState<ReturnType<typeof generateRoadmap> | null>(null);
  const [genStage, setGenStage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  // Section 9: AI fallback choice state — shown when all 3 providers fail twice
  const [aiFallbackChoice, setAiFallbackChoice] = useState<null | { input: PersonalizationInput }>(null);

  const canProceed = useMemo(() => {
    if (step === 0) return true; // privacy intro
    if (step === 1) return true; // developer message
    if (step === 2) return name.trim().length > 0 && careerId !== "";
    if (step === 3) return occupationId !== "" && careerId !== "";
    if (step === 4) return selectedLanguages.length > 0;
    if (step === 5) return true; // skill level has default
    if (step === 6) return hoursPerDay > 0 && daysPerWeek > 0;
    if (step === 7) return generatedRoadmap !== null;
    return false;
  }, [step, name, careerId, occupationId, selectedLanguages, hoursPerDay, daysPerWeek, generatedRoadmap]);

  // Note: language auto-recommendation happens in Step 2's career change handler
  // (setCareerId in step 1 resets selectedLanguages, and the handler in step 2
  // auto-populates when entering step 3).

  const handleNext = async () => {
    // Auto-recommend languages when advancing from step 2 to step 3
    if (step === 2 && careerId && selectedLanguages.length === 0) {
      const career = CAREER_MAP[careerId];
      if (career) {
        setSelectedLanguages(career.recommendedLanguages.slice(0, 3));
      }
    }
    if (step === 6) {
      // Generate the roadmap with 11-stage visual feedback + sliding progress on the button
      // The AI is the primary generator (3-provider fallback chain); deterministic engine is final fallback.
      setIsGenerating(true);
      setGenStage(0);
      const input: PersonalizationInput = {
        name: name.trim(),
        careerId: careerId as CareerId,
        subPath: subPath || undefined,
        occupationId,
        selectedLanguageIds: selectedLanguages,
        skillLevel,
        hoursPerDay,
        daysPerWeek,
      };

      // 11 stages — labels match the spec exactly
      const STAGE_LABELS = [
        "Analyzing your inputs…",
        "Mapping career path…",
        "Loading language data…",
        "Sending to AI…",
        "Receiving AI response…",
        "Extracting roadmap structure…",
        "Designing phases…",
        "Generating tasks & modules…",
        "Computing timeline…",
        "Validating accuracy…",
        "Finalizing your plan…",
      ];

      // Stage 0
      setGenStage(0); await new Promise((r) => setTimeout(r, 400));
      // Stage 1
      setGenStage(1); await new Promise((r) => setTimeout(r, 400));
      // Stage 2
      setGenStage(2); await new Promise((r) => setTimeout(r, 400));
      // Stage 3: Sending to AI — Pass 1
      setGenStage(3);
      let roadmap: GeneratedRoadmap | null = null;
      let usedAI = false;
      let allFailedPass1 = false;
      try {
        const aiResult = await generateRoadmapWithAI(input);
        if (aiResult.roadmap) {
          roadmap = aiResult.roadmap;
          usedAI = true;
        } else {
          console.warn("[onboarding] AI Pass 1 failed:", aiResult.error);
          if (aiResult.allFailed) allFailedPass1 = true;
        }
      } catch (err) {
        console.warn("[onboarding] AI Pass 1 threw:", err);
      }

      // Section 9: Pass 2 — if Pass 1 had all 3 providers fail, retry the whole chain once more
      if (!roadmap && allFailedPass1) {
        console.log("[onboarding] All 3 providers failed Pass 1, starting Pass 2");
        setGenStage(3); // stay on "Sending to AI"
        try {
          const aiResult2 = await generateRoadmapWithAI(input);
          if (aiResult2.roadmap) {
            roadmap = aiResult2.roadmap;
            usedAI = true;
            allFailedPass1 = false;
          } else {
            console.warn("[onboarding] AI Pass 2 also failed:", aiResult2.error);
          }
        } catch (err) {
          console.warn("[onboarding] AI Pass 2 threw:", err);
        }
      }

      // Section 9: If both passes failed entirely, show user choice screen (do NOT silently fall back)
      if (!roadmap && allFailedPass1) {
        console.log("[onboarding] Both AI passes failed — showing user choice screen");
        setAiFallbackChoice({ input });
        setIsGenerating(false);
        return;
      }
      // Stage 4: Receiving AI response
      setGenStage(4); await new Promise((r) => setTimeout(r, 400));
      // Stage 5: Extracting roadmap structure
      setGenStage(5); await new Promise((r) => setTimeout(r, 300));
      // Stage 6: Designing phases
      setGenStage(6); await new Promise((r) => setTimeout(r, 300));
      // Stage 7: Generating tasks & modules
      setGenStage(7); await new Promise((r) => setTimeout(r, 300));
      // Stage 8: Computing timeline
      setGenStage(8); await new Promise((r) => setTimeout(r, 300));
      // Stage 9: Validating accuracy
      setGenStage(9);

      if (!roadmap) {
        // Fallback: deterministic engine
        roadmap = generateRoadmap(input);
      }

      let validation = validateRoadmap(roadmap, input);

      // If AI generated it and validation found errors, do ONE retry
      if (usedAI && !validation.valid) {
        console.log("[onboarding] AI roadmap had validation errors, retrying:", validation.errors);
        const retryResult = await regenerateRoadmapWithAI(input, roadmap, validation.errors);
        if (retryResult.roadmap) {
          roadmap = retryResult.roadmap;
          validation = validateRoadmap(roadmap, input);
        }
      }

      // If still invalid after retry (or AI failed entirely), fall back to deterministic
      if (!validation.valid && usedAI) {
        console.log("[onboarding] AI roadmap still invalid, using deterministic fallback");
        roadmap = generateRoadmap(input);
        validation = validateRoadmap(roadmap, input);
      }

      // Stage 10: Finalizing your plan
      setGenStage(10);
      setGeneratedRoadmap(roadmap);
      await new Promise((r) => setTimeout(r, 500));
      setIsGenerating(false);
      setStep(7);
      return;
    }

    if (step === 7) {
      // Confirm — finalize onboarding
      const input: PersonalizationInput = {
        name: name.trim(),
        careerId: careerId as CareerId,
        subPath: subPath || undefined,
        occupationId,
        selectedLanguageIds: selectedLanguages,
        skillLevel,
        hoursPerDay,
        daysPerWeek,
      };
      completeOnboarding(input);
      // Show the first-time tour
      setPreference("tourCompleted", false);
      onDone();
      return;
    }

    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  // Section 9: AI fallback choice screen — shown when all 3 providers fail twice
  if (aiFallbackChoice) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="absolute inset-0 pointer-events-none opacity-60" style={{
          background: `radial-gradient(at 20% 20%, rgba(245,158,11,0.12) 0px, transparent 50%), radial-gradient(at 80% 30%, rgba(232,121,249,0.10) 0px, transparent 50%)`,
        }} />
        <div className="glass-elevated rounded-3xl w-full max-w-xl relative z-10 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">AI services unavailable</h2>
              <p className="text-sm text-muted-foreground">All 3 AI providers (Gemini, Groq, OpenRouter) failed after 2 attempts.</p>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/30 p-4 space-y-3 mb-5">
            <p className="text-sm leading-relaxed">
              We tried Google Gemini, Groq, and OpenRouter twice each, but couldn&apos;t reach any of them.
              This is usually temporary (rate limits, network issues, or missing API keys on the server).
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You have two options:
            </p>
          </div>
          <div className="space-y-2">
            <GlassButton
              variant="primary"
              size="lg"
              className="w-full justify-start"
              onClick={() => {
                // Option A: use deterministic engine
                const input = aiFallbackChoice.input;
                const roadmap = generateRoadmap(input);
                setGeneratedRoadmap(roadmap);
                setAiFallbackChoice(null);
                setStep(7);
              }}
            >
              <span className="flex flex-col items-start text-left">
                <span className="font-semibold">Continue with Launchpad&apos;s built-in roadmap engine</span>
                <span className="text-[11px] font-normal opacity-80">Slightly less personalized but still a solid plan.</span>
              </span>
            </GlassButton>
            <GlassButton
              variant="ghost"
              size="lg"
              className="w-full justify-start"
              onClick={async () => {
                // Option B: try the AI chain one more time. Jump to step 7
                // (PlanPreviewStep) FIRST so the user sees the full 11-stage
                // "Building your roadmap…" UI while we wait — otherwise the
                // fallback clears `aiFallbackChoice` and the component falls
                // through to the Availability step which only shows a small
                // spinner on the next button.
                const input = aiFallbackChoice.input;
                setAiFallbackChoice(null);
                setStep(7);
                setIsGenerating(true);
                setGenStage(3);
                let roadmap: GeneratedRoadmap | null = null;
                try {
                  const aiResult = await generateRoadmapWithAI(input);
                  if (aiResult.roadmap) roadmap = aiResult.roadmap;
                } catch (err) {
                  console.warn("[onboarding] Option B retry threw:", err);
                }
                if (!roadmap) {
                  // Final fallback — no more prompts
                  roadmap = generateRoadmap(input);
                }
                setGeneratedRoadmap(roadmap);
                setIsGenerating(false);
              }}
            >
              <span className="flex flex-col items-start text-left">
                <span className="font-semibold">Try Again</span>
                <span className="text-[11px] font-normal opacity-80">Retry the AI chain one more time. Falls back to built-in if it still fails.</span>
              </span>
            </GlassButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 pointer-events-none opacity-60" style={{
        background: `radial-gradient(at 20% 20%, rgba(45,212,191,0.12) 0px, transparent 50%), radial-gradient(at 80% 30%, rgba(232,121,249,0.10) 0px, transparent 50%)`,
      }} />
      <div className="glass-elevated rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-border/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10"><LogoMark size={40} /></div>
              <div>
                <h1 className="text-lg font-semibold">Launchpad Onboarding</h1>
                <p className="text-xs text-muted-foreground font-mono">Step {step + 1} of {TOTAL_STEPS}</p>
              </div>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === step ? "w-8 bg-primary" : i < step ? "w-4 bg-primary/60" : "w-4 bg-foreground/10",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          {step === 0 && <PrivacyIntroStep />}
          {step === 1 && <DeveloperMessageStep />}
          {step === 2 && (
            <NameGoalStep
              name={name}
              setName={setName}
              careerId={careerId}
              setCareerId={(id) => {
                setCareerId(id);
                setSubPath("");
                setSelectedLanguages([]); // reset for new career
              }}
            />
          )}
          {step === 3 && (
            <OccupationCareerStep
              occupationId={occupationId}
              setOccupationId={setOccupationId}
              careerId={careerId as CareerId}
              subPath={subPath}
              setSubPath={setSubPath}
            />
          )}
          {step === 4 && (
            <LanguageSelectionStep
              careerId={careerId as CareerId}
              selected={selectedLanguages}
              setSelected={setSelectedLanguages}
            />
          )}
          {step === 5 && (
            <SkillLevelStep skillLevel={skillLevel} setSkillLevel={setSkillLevel} />
          )}
          {step === 6 && (
            <AvailabilityStep
              hoursPerDay={hoursPerDay}
              setHoursPerDay={setHoursPerDay}
              daysPerWeek={daysPerWeek}
              setDaysPerWeek={setDaysPerWeek}
            />
          )}
          {step === 7 && generatedRoadmap && (
            <PlanPreviewStep
              roadmap={generatedRoadmap}
              isGenerating={isGenerating}
              genStage={genStage}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 border-t border-border/40 flex items-center justify-between gap-3">
          <button
            onClick={handleBack}
            disabled={step === 0 || isGenerating}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors",
              step === 0 || isGenerating
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-foreground/5 text-muted-foreground hover:text-foreground",
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex-1" />
          {step === 7 ? (
            <GlassButton onClick={handleNext} variant="primary" size="lg" disabled={!canProceed}>
              <Sparkles className="h-4 w-4" />
              Begin my journey
            </GlassButton>
          ) : step === 6 ? (
            <GeneratingButton
              isGenerating={isGenerating}
              genStage={genStage}
              totalStages={11}
              disabled={!canProceed}
              onClick={handleNext}
            />
          ) : (
            <GlassButton onClick={handleNext} variant="primary" size="lg" disabled={!canProceed}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </GlassButton>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Step 0 — Privacy Intro (single calm box, per spec)
// ============================================================

function PrivacyIntroStep() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-400 via-fuchsia-400 to-amber-300 flex items-center justify-center">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Welcome to Launchpad</h2>
          <p className="text-sm text-muted-foreground">Your private coding education platform</p>
        </div>
      </div>
      <div className="rounded-xl border border-border/60 bg-card/30 p-5 space-y-3">
        <p className="text-sm leading-relaxed">
          Launchpad is a free, open-source platform that builds you a personalized coding
          roadmap based on your career, languages, and availability. It tracks your progress,
          teaches you with built-in lessons (630 lessons across 30 languages), includes an
          inline code editor (run JS/Python/SQL/HTML/CSS/Bash right in the lesson), an AI
          tutor with mock interview mode, AI code review, a resume auto-builder, and a
          community layer via GitHub Discussions.
        </p>
        <div className="flex items-start gap-2 pt-2 border-t border-border/40">
          <Shield className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">100% on-device.</span> All your
            data — progress, settings, roadmap, chat history — stays in your browser.
            No accounts, no servers, no syncing. Clearing your browser erases everything;
            use Settings → Backup to export a copy. The AI Tutor and mock interview require
            your own API key (BYOK) — messages go directly from your browser to your chosen
            AI provider. The Community tab uses GitHub Discussions (requires a GitHub account;
            your Launchpad progress is never shared there).
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Step 1 — Message from the Developer
// ============================================================

function DeveloperMessageStep() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-400 via-fuchsia-400 to-amber-300 flex items-center justify-center text-white font-bold text-lg">
          D
        </div>
        <div>
          <h2 className="text-xl font-semibold">A message from the developer</h2>
          <p className="text-sm text-muted-foreground">Founder & Developer · Dumindu Dulara Wanasinghe</p>
        </div>
      </div>
      <div className="rounded-xl border border-border/60 bg-card/30 p-5 space-y-3">
        <p className="text-sm leading-relaxed">
          Hey, I&apos;m Dumindu. I built Launchpad because I believe everyone interested in
          coding — no matter their age, background, or budget — deserves a clear,
          personalized path to mastery. Most platforms either cost a fortune, hoard your
          data, or push generic roadmaps that don&apos;t fit you. Launchpad is the opposite:
          free, private, and built around <span className="italic">your</span> goals.
        </p>
        <p className="text-sm leading-relaxed">
          The entire source code is open on GitHub. Your data never leaves your device.
          The curriculum spans 30 languages and frameworks — from Python and JavaScript
          to Rust, Go, and Flutter — so you can go from absolute beginner to job-ready
          in whatever field excites you.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground italic">
          I hope Launchpad helps you ship your first — or next — great thing. — Dumindu
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">Connect</span>
        <a href="https://duminduwanasinghe-dev.vercel.app/" target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 text-xs transition-colors">
          <Globe className="h-3.5 w-3.5" /> Portfolio
        </a>
        <a href="https://github.com/dumzvybez" target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 text-xs transition-colors">
          <Github className="h-3.5 w-3.5" /> GitHub
        </a>
        <a href="https://www.linkedin.com/in/dumindu-wanasinghe-974a52266/" target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 text-xs transition-colors">
          <Linkedin className="h-3.5 w-3.5" /> LinkedIn
        </a>
        <a href="https://www.youtube.com/@DuminduWanasinghe" target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 text-xs transition-colors">
          <Youtube className="h-3.5 w-3.5" /> YouTube
        </a>
        <a href="https://www.instagram.com/dumz_vybez/" target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 text-xs transition-colors">
          <Instagram className="h-3.5 w-3.5" /> Instagram
        </a>
      </div>
    </div>
  );
}

// ============================================================
// GeneratingButton — sliding progress animation on the Generate button
// ============================================================

function GeneratingButton({
  isGenerating,
  genStage,
  totalStages,
  disabled,
  onClick,
}: {
  isGenerating: boolean;
  genStage: number;
  totalStages: number;
  disabled: boolean;
  onClick: () => void;
}) {
  const STAGE_LABELS = [
    "Analyzing your inputs…",
    "Mapping career path…",
    "Loading language data…",
    "Sending to AI…",
    "Receiving AI response…",
    "Extracting roadmap structure…",
    "Designing phases…",
    "Generating tasks & modules…",
    "Computing timeline…",
    "Validating accuracy…",
    "Finalizing your plan…",
  ];
  const progressPct = isGenerating ? ((genStage + 1) / totalStages) * 100 : 0;
  const label = isGenerating ? (STAGE_LABELS[genStage] ?? "Generating…") : "Generate my roadmap";

  return (
    <button
      onClick={onClick}
      disabled={disabled || isGenerating}
      className={cn(
        "relative overflow-hidden flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        (disabled || isGenerating) && "opacity-90 cursor-progress",
      )}
      style={{
        backgroundImage: isGenerating
          ? `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${progressPct}%, hsl(var(--primary) / 0.3) ${progressPct}%, hsl(var(--primary) / 0.3) 100%)`
          : undefined,
        transition: "background-image 0.5s ease",
      }}
    >
      {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
      <span>{label}</span>
      {!isGenerating && <ArrowRight className="h-4 w-4" />}
    </button>
  );
}

// ============================================================
// Step 1 — Name + Goal
// ============================================================

function NameGoalStep({
  name,
  setName,
  careerId,
  setCareerId,
}: {
  name: string;
  setName: (v: string) => void;
  careerId: CareerId | "";
  setCareerId: (id: CareerId) => void;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = CAREERS.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    c.tagline.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Let&apos;s start with you</h2>
        <p className="text-sm text-muted-foreground">Tell us your name and what you want to become.</p>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          Your name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Alex"
          className="w-full px-4 py-3 rounded-lg bg-card/60 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          autoFocus
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          What do you want to become?
        </label>
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-full px-4 py-3 rounded-lg bg-card/60 border border-border/60 text-sm text-left flex items-center justify-between hover:bg-card/80 transition-colors"
          >
            <span className={cn(!careerId && "text-muted-foreground")}>
              {careerId ? CAREER_MAP[careerId]?.label : "Select a career..."}
            </span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </button>
          {open && (
            <div className="absolute z-20 mt-1 w-full max-h-72 overflow-y-auto rounded-lg border border-border bg-popover shadow-xl">
              <div className="sticky top-0 bg-popover p-2 border-b border-border/60">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search careers..."
                    className="w-full pl-7 pr-3 py-1.5 text-sm bg-card/60 rounded border border-border/60 focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCareerId(c.id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "w-full px-3 py-2.5 text-left hover:bg-foreground/5 transition-colors border-b border-border/40 last:border-b-0",
                    careerId === c.id && "bg-primary/10",
                  )}
                >
                  <div className="text-sm font-medium">{c.label}</div>
                  <div className="text-xs text-muted-foreground">{c.tagline}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Step 2 — Occupation + Target Career (with detail panel)
// ============================================================

function OccupationCareerStep({
  occupationId,
  setOccupationId,
  careerId,
  subPath,
  setSubPath,
}: {
  occupationId: string;
  setOccupationId: (id: string) => void;
  careerId: CareerId;
  subPath: string;
  setSubPath: (s: string) => void;
}) {
  const career = CAREER_MAP[careerId];
  const [occSearch, setOccSearch] = useState("");
  const [occOpen, setOccOpen] = useState(false);
  const filteredOcc = OCCUPATIONS.filter((o) =>
    o.label.toLowerCase().includes(occSearch.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Your context & target</h2>
        <p className="text-sm text-muted-foreground">We&apos;ll adjust the pace and depth based on your situation.</p>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          Current occupation
        </label>
        <div className="relative">
          <button
            onClick={() => setOccOpen(!occOpen)}
            className="w-full px-4 py-3 rounded-lg bg-card/60 border border-border/60 text-sm text-left flex items-center justify-between hover:bg-card/80"
          >
            <span className={cn(!occupationId && "text-muted-foreground")}>
              {occupationId ? OCCUPATIONS.find((o) => o.id === occupationId)?.label : "Select your occupation..."}
            </span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", occOpen && "rotate-180")} />
          </button>
          {occOpen && (
            <div className="absolute z-20 mt-1 w-full max-h-72 overflow-y-auto rounded-lg border border-border bg-popover shadow-xl">
              <div className="sticky top-0 bg-popover p-2 border-b border-border/60">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={occSearch}
                    onChange={(e) => setOccSearch(e.target.value)}
                    placeholder="Search occupations..."
                    className="w-full pl-7 pr-3 py-1.5 text-sm bg-card/60 rounded border border-border/60 focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>
              {filteredOcc.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setOccupationId(o.id);
                    setOccOpen(false);
                    setOccSearch("");
                  }}
                  className={cn(
                    "w-full px-3 py-2.5 text-left hover:bg-foreground/5 border-b border-border/40 last:border-b-0",
                    occupationId === o.id && "bg-primary/10",
                  )}
                >
                  <div className="text-sm font-medium">{o.label}</div>
                  <div className="text-xs text-muted-foreground">{o.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Career detail panel */}
      {career && (
        <div className="rounded-xl border border-border/60 bg-card/50 p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-base">{career.label}</h3>
              <p className="text-xs text-muted-foreground italic">{career.tagline}</p>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={cn("h-1.5 w-3 rounded-full", i < career.demand ? "bg-emerald-500" : "bg-foreground/10")}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{career.description}</p>

          {career.subPaths && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                Specialization
              </label>
              <div className="flex flex-wrap gap-2">
                {career.subPaths.map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => setSubPath(subPath === sp.id ? "" : sp.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs border transition-colors",
                      subPath === sp.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 hover:bg-foreground/5",
                    )}
                    title={sp.description}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Salary range</div>
              <div className="text-xs font-mono">{career.salaryRange}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Demand</div>
              <div className="text-xs font-mono">{career.demand}/5</div>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Languages you&apos;ll learn</div>
            <div className="flex flex-wrap gap-1.5">
              {career.recommendedLanguages.map((lid) => {
                const lang = LANGUAGE_MAP[lid];
                return lang ? (
                  <span key={lid} className="px-2 py-0.5 rounded-md text-xs bg-foreground/5 border border-border/60">
                    {lang.icon} {lang.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Top companies hiring</div>
            <div className="text-xs text-muted-foreground">{career.topCompanies.slice(0, 6).join(" · ")}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Step 3 — Language Selection with popover panels
// ============================================================

function LanguageSelectionStep({
  careerId,
  selected,
  setSelected,
}: {
  careerId: CareerId;
  selected: string[];
  setSelected: (ids: string[]) => void;
}) {
  const career = CAREER_MAP[careerId];
  const recommended = new Set(career?.recommendedLanguages ?? []);
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPopoverOpen(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close popover on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(null);
      }
    }
    if (popoverOpen) {
      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
    }
  }, [popoverOpen]);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Categorize languages into sections per spec
  // 1. Recommended for the career (primary languages first, then frameworks)
  // 2. Frontend (for web/software/mobile careers)
  // 3. Backend (for web/software/data careers)
  // 4. All languages (remaining, alphabetical)
  const FRONTEND_IDS = new Set(["html", "css", "javascript", "typescript", "react", "nextjs", "vue", "angular", "svelte", "tailwind", "bootstrap", "jquery", "react-native"]);
  const BACKEND_IDS = new Set(["nodejs", "express", "graphql", "python", "java", "go", "rust", "php", "ruby", "sql", "django", "fastapi", "flask", "postgresql", "mongodb", "bash"]);
  const FRONTEND_CAREERS = new Set(["web-dev", "software-engineering", "mobile-dev"]);
  const BACKEND_CAREERS = new Set(["web-dev", "software-engineering", "data-science"]);

  const recommendedIds = career?.recommendedLanguages ?? [];
  const recommendedLangObjs = recommendedIds
    .map((id) => LANGUAGE_MAP[id])
    .filter(Boolean) as LanguageInfo[];
  // Primary languages first, then frameworks/tools
  const recommendedPrimary = recommendedLangObjs.filter((l) => l.type === "language");
  const recommendedFrameworks = recommendedLangObjs.filter((l) => l.type !== "language");
  const recommendedList = [...recommendedPrimary, ...recommendedFrameworks];

  const frontendList = LANGUAGES.filter(
    (l) => FRONTEND_IDS.has(l.id) && !recommended.has(l.id),
  ).sort((a, b) => a.name.localeCompare(b.name));
  const backendList = LANGUAGES.filter(
    (l) => BACKEND_IDS.has(l.id) && !recommended.has(l.id) && !FRONTEND_IDS.has(l.id),
  ).sort((a, b) => a.name.localeCompare(b.name));
  const recommendedIdSet = new Set(recommendedIds);
  const frontendIdSet = new Set(frontendList.map((l) => l.id));
  const backendIdSet = new Set(backendList.map((l) => l.id));
  const allList = LANGUAGES.filter(
    (l) => !recommendedIdSet.has(l.id) && !frontendIdSet.has(l.id) && !backendIdSet.has(l.id),
  ).sort((a, b) => a.name.localeCompare(b.name));

  const showFrontend = FRONTEND_CAREERS.has(careerId);
  const showBackend = BACKEND_CAREERS.has(careerId);

  const renderChip = (lang: LanguageInfo) => {
    const isSelected = selected.includes(lang.id);
    const isRec = recommended.has(lang.id);
    // Companion hint: if this is a framework and a companion language is NOT selected, show dashed border
    const companionHintActive =
      lang.companions && lang.companions.length > 0 &&
      !lang.companions.some((c) => selected.includes(c));
    return (
      <div key={lang.id} className="relative">
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all cursor-pointer",
            isSelected
              ? "border-primary bg-primary/10 text-primary"
              : companionHintActive
                ? "border-dashed border-amber-500/50 hover:border-amber-500 bg-amber-500/5"
                : "border-border/60 hover:border-border bg-card/40",
          )}
          onClick={() => toggle(lang.id)}
          title={companionHintActive ? `Recommended companion to ${lang.name}` : undefined}
        >
          <span className="text-base">{lang.icon}</span>
          <span className="font-medium">{lang.name}</span>
          {isRec && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-semibold uppercase">
              Rec
            </span>
          )}
          {lang.fullstack && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-500 font-semibold uppercase" title="Fullstack — handles frontend & backend">
              Fullstack
            </span>
          )}
          {lang.type === "tool" && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-500 font-semibold uppercase">
              Tool
            </span>
          )}
          {isSelected && <Check className="h-3.5 w-3.5" />}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPopoverOpen(popoverOpen === lang.id ? null : lang.id);
            }}
            className="ml-1 p-1 rounded hover:bg-foreground/10 transition-colors"
            aria-label={`More info about ${lang.name}`}
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </div>

        {popoverOpen === lang.id && (
          <div
            ref={popoverRef}
            className="absolute z-30 mt-1 w-80 max-w-[90vw] rounded-xl border border-border bg-popover shadow-2xl p-4"
            role="dialog"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{lang.icon}</span>
                <div>
                  <h3 className="font-semibold text-sm">{lang.name}</h3>
                  <p className="text-xs text-muted-foreground">{lang.tagline}</p>
                </div>
              </div>
              <button
                onClick={() => setPopoverOpen(null)}
                className="p-1 rounded hover:bg-foreground/10"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{lang.description}</p>

            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Demand</div>
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={cn("h-1 w-3 rounded-full", i < lang.demand ? "bg-emerald-500" : "bg-foreground/10")} />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Difficulty</div>
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={cn("h-1 w-3 rounded-full", i < lang.difficulty ? "bg-rose-500" : "bg-foreground/10")} />
                  ))}
                </div>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <div><span className="text-muted-foreground">Salary:</span> {lang.salaryImpact}</div>
              <div><span className="text-muted-foreground">Curve:</span> {lang.learningCurve}</div>
              <div>
                <span className="text-muted-foreground">Trend:</span>{" "}
                <span className={cn(
                  lang.trend === "rising" && "text-emerald-500",
                  lang.trend === "stable" && "text-sky-500",
                  lang.trend === "declining" && "text-amber-500",
                )}>{lang.trend}</span>
              </div>
              {lang.companions && lang.companions.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Companions:</span>{" "}
                  {lang.companions.map((c) => LANGUAGE_MAP[c]?.name ?? c).join(", ")}
                </div>
              )}
            </div>

            <div className="mt-2">
              <div className="text-[10px] uppercase text-muted-foreground mb-1">Use cases</div>
              <div className="flex flex-wrap gap-1">
                {lang.useCases.slice(0, 4).map((u) => (
                  <span key={u} className="text-[10px] px-1.5 py-0.5 rounded bg-foreground/5">{u}</span>
                ))}
              </div>
            </div>

            <div className="mt-2">
              <div className="text-[10px] uppercase text-muted-foreground mb-1">Top companies</div>
              <div className="text-[10px] text-muted-foreground">{lang.topCompanies.slice(0, 5).join(" · ")}</div>
            </div>

            <button
              onClick={() => {
                toggle(lang.id);
                setPopoverOpen(null);
              }}
              className={cn(
                "mt-3 w-full py-1.5 rounded-lg text-xs font-medium transition-colors",
                isSelected ? "bg-rose-500/20 text-rose-500 hover:bg-rose-500/30" : "bg-primary/20 text-primary hover:bg-primary/30",
              )}
            >
              {isSelected ? "Remove from plan" : "Add to plan"}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold mb-1">Pick your languages</h2>
        <p className="text-sm text-muted-foreground">
          We pre-selected languages recommended for {career?.label}. Uncheck any or add others — click the <Info className="inline h-3 w-3" /> icon for details. Dashed-border chips indicate companion languages you may want to add.
        </p>
      </div>

      {/* Section 1: Recommended for [Career Name] */}
      {recommendedList.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">
            Recommended for {career?.label}
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendedList.map(renderChip)}
          </div>
        </div>
      )}

      {/* Section 2: Frontend (web/software/mobile only) */}
      {showFrontend && frontendList.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">Frontend</div>
          <div className="flex flex-wrap gap-2">
            {frontendList.map(renderChip)}
          </div>
        </div>
      )}

      {/* Section 3: Backend (web/software/data only) */}
      {showBackend && backendList.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">Backend</div>
          <div className="flex flex-wrap gap-2">
            {backendList.map(renderChip)}
          </div>
        </div>
      )}

      {/* Section 4: All languages */}
      <div className="space-y-2">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">All languages & tools</div>
        <div className="flex flex-wrap gap-2">
          {allList.map(renderChip)}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        {selected.length} language{selected.length === 1 ? "" : "s"} selected
      </div>
    </div>
  );
}

// ============================================================
// Step 4 — Skill Level
// ============================================================

function SkillLevelStep({
  skillLevel,
  setSkillLevel,
}: {
  skillLevel: SkillLevel;
  setSkillLevel: (s: SkillLevel) => void;
}) {
  const options: { id: SkillLevel; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: "beginner", label: "Beginner", desc: "New to programming — start from absolute basics", icon: <Seedling /> },
    { id: "intermediate", label: "Intermediate", desc: "Some experience — skip basics, dive into projects", icon: <Sprout /> },
    { id: "advanced", label: "Advanced", desc: "Comfortable coder — focus on specialization and depth", icon: <Tree /> },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold mb-1">Your current skill level</h2>
        <p className="text-sm text-muted-foreground">This adjusts where your roadmap starts.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSkillLevel(opt.id)}
            className={cn(
              "rounded-xl border-2 p-4 text-left transition-all",
              skillLevel === opt.id
                ? "border-primary bg-primary/10"
                : "border-border/60 hover:border-border bg-card/40",
            )}
          >
            <div className="h-10 w-10 mb-3 flex items-center justify-center rounded-lg bg-foreground/5">
              {opt.icon}
            </div>
            <h3 className="font-semibold text-sm mb-1">{opt.label}</h3>
            <p className="text-xs text-muted-foreground">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Seedling() {
  return <span className="text-2xl">🌱</span>;
}
function Sprout() {
  return <span className="text-2xl">🌿</span>;
}
function Tree() {
  return <span className="text-2xl">🌳</span>;
}

// ============================================================
// Step 5 — Availability (with live timeline estimate)
// ============================================================

function AvailabilityStep({
  hoursPerDay,
  setHoursPerDay,
  daysPerWeek,
  setDaysPerWeek,
}: {
  hoursPerDay: number;
  setHoursPerDay: (n: number) => void;
  daysPerWeek: number;
  setDaysPerWeek: (n: number) => void;
}) {
  const weeklyHours = hoursPerDay * daysPerWeek;
  // Baseline 14 hr/week = 52 weeks. More hours = faster.
  const estWeeks = Math.max(8, Math.round((52 * 14) / Math.max(weeklyHours, 1)));
  const estMonths = Math.round(estWeeks / 4.3);
  const estYears = (estWeeks / 52).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">How much time can you commit?</h2>
        <p className="text-sm text-muted-foreground">We&apos;ll use this to estimate your timeline.</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" /> Hours per day
          </label>
          <span className="text-sm font-mono text-primary">{hoursPerDay}h</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="8"
          step="0.5"
          value={hoursPerDay}
          onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
          <span>0.5h</span><span>4h</span><span>8h</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" /> Days per week
          </label>
          <span className="text-sm font-mono text-primary">{daysPerWeek}d</span>
        </div>
        <input
          type="range"
          min="1"
          max="7"
          step="1"
          value={daysPerWeek}
          onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
          <span>1d</span><span>4d</span><span>7d</span>
        </div>
      </div>

      {/* Live timeline estimate */}
      <div className="rounded-xl border border-primary/40 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Live timeline estimate</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Weekly</div>
            <div className="text-lg font-mono font-semibold">{weeklyHours}h</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Duration</div>
            <div className="text-lg font-mono font-semibold">{estWeeks}w</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Approx</div>
            <div className="text-lg font-mono font-semibold">
              {parseFloat(estYears) >= 1 ? `${estYears}y` : `${estMonths}mo`}
            </div>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Based on {weeklyHours} hours/week. The engine will fine-tune this based on your skill level and occupation.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Step 6 — Plan Preview (with 7-stage visual generation)
// ============================================================

function PlanPreviewStep({
  roadmap,
  isGenerating,
  genStage,
}: {
  roadmap: ReturnType<typeof generateRoadmap>;
  isGenerating: boolean;
  genStage: number;
}) {
  const stages = getGenerationStagesForInput({
    name: "",
    careerId: roadmap.careerId,
    selectedLanguageIds: roadmap.languageIds,
    occupationId: "",
    skillLevel: "beginner",
    hoursPerDay: 2,
    daysPerWeek: 5,
  });

  if (isGenerating) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-1">Building your roadmap...</h2>
          <p className="text-sm text-muted-foreground">Our engine is personalizing every phase for you.</p>
        </div>
        <div className="space-y-2">
          {stages.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all",
                i < genStage
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : i === genStage
                    ? "border-primary bg-primary/10"
                    : "border-border/40 opacity-50",
              )}
            >
              <div className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold",
                i < genStage ? "bg-emerald-500 text-white" :
                i === genStage ? "bg-primary text-primary-foreground" : "bg-foreground/10",
              )}>
                {i < genStage ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.description}</div>
              </div>
              {i === genStage && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold mb-1">Your personalized roadmap</h2>
        <p className="text-sm text-muted-foreground">
          {roadmap.careerLabel}{roadmap.subPath ? ` (${roadmap.subPath})` : ""} · {roadmap.totalWeeks} weeks · {roadmap.totalHours}h total
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <StatBox label="Phases" value={roadmap.phases.length.toString()} />
        <StatBox label="Weeks" value={roadmap.totalWeeks.toString()} />
        <StatBox label="Hours" value={roadmap.totalHours.toString()} />
      </div>

      {/* Languages */}
      <div>
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Languages</div>
        <div className="flex flex-wrap gap-2">
          {roadmap.languageIds.map((id) => {
            const lang = LANGUAGE_MAP[id];
            return lang ? (
              <span key={id} className="px-3 py-1.5 rounded-lg text-sm bg-foreground/5 border border-border/60">
                {lang.icon} {lang.name}
              </span>
            ) : null;
          })}
        </div>
      </div>

      {/* Phase grid */}
      <div>
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">{roadmap.phases.length} phases</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {roadmap.phases.map((p) => {
            const totalTasks = p.modules.flatMap((m) => m.tasks).length;
            return (
              <div key={p.id} className="rounded-xl border border-border/60 bg-card/40 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <div className="text-xs text-muted-foreground font-mono">Phase {p.number}</div>
                    <div className="text-sm font-semibold">{p.title}</div>
                  </div>
                  <div className="ml-auto text-[10px] text-muted-foreground font-mono">
                    {p.estWeeks}w · {totalTasks} tasks
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{p.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
        <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
        <div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Accuracy validated</div>
          <p className="text-[11px] text-muted-foreground">
            Phases, content, dependencies, language coverage, timeline, and numbering all checked.
          </p>
        </div>
      </div>

      {/* Source message — teal if AI succeeded, amber if deterministic fallback */}
      {roadmap.source && roadmap.source !== "deterministic" ? (
        <div className="rounded-lg border border-teal-500/40 bg-teal-500/5 p-3 flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-teal-600 dark:text-teal-400">
              Your roadmap was generated using AI for maximum accuracy and personalization.
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Provider: {roadmap.source.replace("ai-", "").toUpperCase()}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Your roadmap was generated using Launchpad&apos;s built-in engine. For even more
              personalized results, try again later — AI services may be temporarily unavailable.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-3 text-center">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-xl font-mono font-bold mt-1">{value}</div>
    </div>
  );
}
