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
// v5.91 (Part 2): prerequisite graph for auto-injection
import { findMissingPrerequisites, getNonLessonPrerequisiteNotes, ALL_LANGUAGE_INFO as DEP_LANG_INFO } from "@/lib/dependency-graph";
import { LANGUAGE_MAP as DEP_LANGUAGE_MAP } from "@/lib/career-data";

const TOTAL_STEPS = 10; // steps 0-9 (v5.91: added step 5 — prerequisite confirmation)

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

  // v5.89 (BUG 4): Optional user-supplied API key for roadmap generation.
  // If provided, this key is used for roadmap AI generation AND stored in
  // aiSettings so it's automatically reused for AI Tutor / Interview / Code Review.
  // If skipped, the deterministic engine is used (reliable, instant, but template-based).
  const setAISettings = useStore((s) => s.setAISettings);
  const [optionalApiKey, setOptionalApiKey] = useState("");
  const [optionalApiProvider, setOptionalApiProvider] = useState<string>("gemini");
  const [optionalApiModel, setOptionalApiModel] = useState<string>("gemini-2.5-flash-lite");
  const [apiKeySkipped, setApiKeySkipped] = useState(false);

  // v5.91 (Part 2): Compute missing prerequisites for the confirmation step.
  // This is memoized so it only recomputes when the language selection changes.
  // v5.92 FIX (BUG 2): Removed the `step !== 5` guard — missingPrereqs must
  // always be computed from selectedLanguages, regardless of current step.
  // Previously it returned [] outside step 5, so during generation at step 8
  // the auto-injected prerequisites were lost.
  const missingPrereqs = useMemo(() => {
    return findMissingPrerequisites(selectedLanguages);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguages]);

  // v5.91 (Part 2): The final language list includes auto-injected prerequisites.
  const finalLanguageIds = useMemo(() => {
    const injected = missingPrereqs.map(p => p.trackId);
    return [...selectedLanguages, ...injected];
  }, [selectedLanguages, missingPrereqs]);

  const canProceed = useMemo(() => {
    if (step === 0) return true; // privacy intro
    if (step === 1) return true; // developer message
    if (step === 2) return name.trim().length > 0 && careerId !== "";
    if (step === 3) return occupationId !== "" && careerId !== "";
    if (step === 4) return selectedLanguages.length > 0;
    // v5.91 (Part 2): Step 5 is the prerequisite confirmation step — always proceedable
    if (step === 5) return true;
    if (step === 6) return true; // skill level has default (was step 5)
    if (step === 7) return hoursPerDay > 0 && daysPerWeek > 0; // (was step 6)
    // v5.89: Step 8 is the optional API key step — always proceedable (was step 7)
    if (step === 8) return true;
    if (step === 9) return generatedRoadmap !== null; // (was step 8)
    return false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (step === 8) {
      // v5.92 FIX (BUG 1): Generation triggers at step 8 (API key step), NOT step 9.
      // Previously this checked `step === 9`, but the user clicks "Generate" while
      // ON step 8 — so `step === 9` was always false and generation was SKIPPED.
      // This blocked 100% of onboarding for both AI-key and skip paths.
      // v5.91 (Part 2): Use finalLanguageIds (includes auto-injected prerequisites)
      // and pass missingPrereqs to generateRoadmap for labeling.
      if (isGenerating) return;
      setIsGenerating(true);
      setGenStage(0);

      // v5.922 FIX: Removed `!apiKeySkipped` check — if a key is entered, use it.
      // The `apiKeySkipped` flag was causing false negatives when state got
      // out of sync (e.g., user toggled skip/enter). An empty key is already
      // falsy, so the check is redundant.
      const userKey = optionalApiKey.trim()
        ? { apiKey: optionalApiKey.trim(), provider: optionalApiProvider, model: optionalApiModel }
        : undefined;
      if (userKey) {
        setAISettings({
          provider: optionalApiProvider as any,
          apiKey: optionalApiKey.trim(),
          model: optionalApiModel,
          temperature: 0.7,
        });
      }

      // v5.91 (Part 2): Use the final language list that includes auto-injected prerequisites.
      const input: PersonalizationInput = {
        name: name.trim(),
        careerId: careerId as CareerId,
        subPath: subPath || undefined,
        occupationId,
        selectedLanguageIds: finalLanguageIds,
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

      try {
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

        // v5.92 FIX: If the user skipped (no key), skip AI attempts entirely
        // and go straight to the deterministic engine. Previously the code tried
        // AI with no key, which always failed, then showed the "AI services
        // unavailable" error screen — confusing UX for users who deliberately skipped.
        if (userKey) {
          try {
            const aiResult = await generateRoadmapWithAI(input, userKey);
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

          // Pass 2 — if Pass 1 had all providers fail, retry once more
          if (!roadmap && allFailedPass1) {
            console.log("[onboarding] All providers failed Pass 1, starting Pass 2");
            setGenStage(3);
            try {
              const aiResult2 = await generateRoadmapWithAI(input, userKey);
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

          // If both passes failed entirely, show user choice screen
          if (!roadmap && allFailedPass1) {
            console.log("[onboarding] Both AI passes failed — showing user choice screen");
            setAiFallbackChoice({ input });
            setIsGenerating(false);
            return;
          }
        } else {
          console.log("[onboarding] No user key — skipping AI, using deterministic engine directly");
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
          // Fallback: deterministic engine (v5.92: also handles the skip path)
          roadmap = generateRoadmap(input, missingPrereqs);
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
          roadmap = generateRoadmap(input, missingPrereqs);
          validation = validateRoadmap(roadmap, input);
        }

        // Stage 10: Finalizing your plan
        setGenStage(10);
        if (!roadmap) {
          // Last-resort fallback — should never reach here, but be defensive.
          roadmap = generateRoadmap(input, missingPrereqs);
        }
        setGeneratedRoadmap(roadmap);
        await new Promise((r) => setTimeout(r, 500));
        setIsGenerating(false);
        setStep(9); // v5.92: advance to plan preview (step 9)
        return;
      } catch (err) {
        console.error("[onboarding] generation chain threw:", err);
        // Fall back to deterministic engine so the user can still proceed.
        try {
          const fallback = generateRoadmap(input, missingPrereqs);
          setGeneratedRoadmap(fallback);
          setIsGenerating(false);
          setStep(9); // v5.92: advance to plan preview (step 9)
        } catch (innerErr) {
          console.error("[onboarding] deterministic fallback also threw:", innerErr);
          setIsGenerating(false);
          // Show the user-choice screen so they can retry.
          setAiFallbackChoice({ input });
        }
        return;
      }
    }

    if (step === 9) {
      // v5.91: Confirm — finalize onboarding. Use finalLanguageIds (includes auto-injected prereqs).
      const input: PersonalizationInput = {
        name: name.trim(),
        careerId: careerId as CareerId,
        subPath: subPath || undefined,
        occupationId,
        selectedLanguageIds: finalLanguageIds,
        skillLevel,
        hoursPerDay,
        daysPerWeek,
      };
      // v5.77 fix: pass the AI-generated roadmap (if any) so the store uses it
      // instead of silently regenerating a deterministic one. Previously the
      // user previewed an AI roadmap and then got a different deterministic
      // roadmap saved to their account.
      completeOnboarding(input, generatedRoadmap ?? undefined);
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
                const roadmap = generateRoadmap(input, missingPrereqs);
                setGeneratedRoadmap(roadmap);
                setAiFallbackChoice(null);
                setStep(9); // v5.922 FIX: was setStep(8) — should advance to plan preview (step 9), not back to API key step
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
                // v5.77 fix: Option B "Try Again" — previously this called
                // setStep(7) BEFORE setting generatedRoadmap, which rendered
                // a blank screen because PlanPreviewStep requires both
                // `step === 7 && generatedRoadmap`. Now we keep the user on
                // the fallback screen (with a loading indicator) until the
                // retry completes, then advance.
                const input = aiFallbackChoice.input;
                setIsGenerating(true);
                setGenStage(3);
                let roadmap: GeneratedRoadmap | null = null;
                try {
                  // v5.922 FIX: pass userKey so the retry actually uses the user's key
                  // (was calling generateRoadmapWithAI(input) with no key → always 502)
                  const retryUserKey = optionalApiKey.trim()
                    ? { apiKey: optionalApiKey.trim(), provider: optionalApiProvider, model: optionalApiModel }
                    : undefined;
                  const aiResult = await generateRoadmapWithAI(input, retryUserKey);
                  if (aiResult.roadmap) roadmap = aiResult.roadmap;
                } catch (err) {
                  console.warn("[onboarding] Option B retry threw:", err);
                }
                if (!roadmap) {
                  // Final fallback — no more prompts
                  try {
                    roadmap = generateRoadmap(input, missingPrereqs);
                  } catch (err) {
                    console.error("[onboarding] Option B deterministic fallback threw:", err);
                    setIsGenerating(false);
                    return;
                  }
                }
                if (!roadmap) {
                  // v5.922: safety guard — should never reach here
                  setIsGenerating(false);
                  return;
                }
                setGeneratedRoadmap(roadmap);
                setIsGenerating(false);
                setAiFallbackChoice(null);
                setStep(9); // v5.922 FIX: was setStep(8) — should advance to plan preview
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
            <PrerequisiteConfirmationStep
              selectedLanguages={selectedLanguages}
              missingPrereqs={missingPrereqs}
            />
          )}
          {step === 6 && (
            <SkillLevelStep skillLevel={skillLevel} setSkillLevel={setSkillLevel} />
          )}
          {step === 7 && (
            <AvailabilityStep
              hoursPerDay={hoursPerDay}
              setHoursPerDay={setHoursPerDay}
              daysPerWeek={daysPerWeek}
              setDaysPerWeek={setDaysPerWeek}
            />
          )}
          {/* v5.89 (BUG 4): Optional API key step — between availability and plan preview */}
          {step === 8 && !generatedRoadmap && (
            <OptionalApiKeyStep
              apiKey={optionalApiKey}
              setApiKey={setOptionalApiKey}
              provider={optionalApiProvider}
              setProvider={(p: string) => {
                setOptionalApiProvider(p);
                const defaults: Record<string, string> = {
                  gemini: "gemini-2.5-flash-lite",
                  groq: "openai/gpt-oss-120b",
                  openrouter: "meta-llama/llama-3.3-70b-instruct:free",
                  openai: "gpt-4o-mini",
                  anthropic: "claude-sonnet-4-5",
                };
                setOptionalApiModel(defaults[p] || "");
              }}
              model={optionalApiModel}
              setModel={setOptionalApiModel}
              skipped={apiKeySkipped}
              setSkipped={setApiKeySkipped}
            />
          )}
          {step === 8 && isGenerating && (
            <PlanPreviewStep
              roadmap={null}
              isGenerating={isGenerating}
              genStage={genStage}
            />
          )}
          {step === 9 && generatedRoadmap && (
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
          {step === 9 ? (
            <GlassButton onClick={handleNext} variant="primary" size="lg" disabled={!canProceed}>
              <Sparkles className="h-4 w-4" />
              Begin my journey
            </GlassButton>
          ) : step === 8 ? (
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
  const [showAllLangs, setShowAllLangs] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPopoverOpen(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {recommendedList.map(renderChip)}
          </div>
        </div>
      )}

      {/* Section 2: Frontend (web/software/mobile only) */}
      {showFrontend && frontendList.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">Frontend</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {frontendList.map(renderChip)}
          </div>
        </div>
      )}

      {/* Section 3: Backend (web/software/data only) */}
      {showBackend && backendList.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">Backend</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {backendList.map(renderChip)}
          </div>
        </div>
      )}

      {/* Section 4: All languages — collapsible (Section 18) */}
      <div className="space-y-2">
        <button
          onClick={() => setShowAllLangs(!showAllLangs)}
          className="w-full flex items-center justify-between p-2 rounded-lg bg-foreground/3 hover:bg-foreground/5 transition-colors"
        >
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">All languages & tools ({allList.length})</span>
          <span className="text-xs text-muted-foreground">{showAllLangs ? "Hide ▲" : "Show ▼"}</span>
        </button>
        {showAllLangs && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {allList.map(renderChip)}
          </div>
        )}
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
// v5.91 (Part 2): Step 5 — Prerequisite Confirmation
// Shows auto-injected prerequisite languages with clear labeling.
// ============================================================

function PrerequisiteConfirmationStep({
  selectedLanguages,
  missingPrereqs,
}: {
  selectedLanguages: string[];
  missingPrereqs: Array<{ trackId: string; requiredBy: string[] }>;
}) {
  // Collect non-lesson prerequisite notes for informational display
  const nonLessonNotes: Array<{ forTrack: string; note: string }> = [];
  for (const langId of selectedLanguages) {
    const notes = getNonLessonPrerequisiteNotes(langId);
    for (const note of notes) {
      nonLessonNotes.push({ forTrack: langId, note });
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Prerequisite Check</h2>
        <p className="text-sm text-muted-foreground mt-1">
          We&apos;ve analyzed your selections for required foundations.
        </p>
      </div>

      {missingPrereqs.length === 0 && nonLessonNotes.length === 0 ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-emerald-500" />
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              No missing prerequisites — your selections are complete!
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            All your selected languages have their foundations covered. Click Continue to proceed.
          </p>
        </div>
      ) : (
        <>
          {missingPrereqs.length > 0 && (
            <div className="rounded-xl border border-primary/40 bg-primary/5 p-5 space-y-4">
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Auto-included foundation languages
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on your selections, we&apos;re also including these required foundations.
                  They&apos;ll be added to your roadmap with clear labels.
                </p>
              </div>
              <div className="space-y-2">
                {missingPrereqs.map((prereq) => {
                  const langInfo = DEP_LANGUAGE_MAP[prereq.trackId];
                  return (
                    <div key={prereq.trackId} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/40">
                      <div className="text-2xl">{langInfo?.icon ?? "📘"}</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{langInfo?.name ?? prereq.trackId}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Required for: {prereq.requiredBy.map(id => DEP_LANGUAGE_MAP[id]?.name ?? id).join(", ")}
                        </div>
                        {langInfo?.tagline && (
                          <div className="text-[11px] text-muted-foreground/70 mt-1">{langInfo.tagline}</div>
                        )}
                      </div>
                      <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                        Auto-added
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-muted-foreground">
                These will appear in your roadmap before the languages that require them, with a
                persistent &quot;Required for&quot; label. You can&apos;t remove true prerequisites,
                but you can see exactly what was added and why.
              </p>
            </div>
          )}

          {nonLessonNotes.length > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Additional foundation recommended</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    These skills are recommended but don&apos;t have dedicated lesson tracks —
                    we&apos;ll note them in your roadmap as informational guides.
                  </p>
                  <div className="mt-2 space-y-1">
                    {nonLessonNotes.map((note, i) => (
                      <div key={i} className="text-xs text-muted-foreground">
                        <span className="font-medium capitalize">{note.note}</span> — recommended for{" "}
                        {DEP_LANGUAGE_MAP[note.forTrack]?.name ?? note.forTrack}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="rounded-lg bg-foreground/5 p-3">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Your selected languages: {selectedLanguages.map(id => DEP_LANGUAGE_MAP[id]?.name ?? id).join(", ")}
          {missingPrereqs.length > 0 && (
            <>
              {" "}+ auto-added: {missingPrereqs.map(p => DEP_LANGUAGE_MAP[p.trackId]?.name ?? p.trackId).join(", ")}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

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
// v5.89 (BUG 4): Step 7 — Optional API Key
// Lets the user bring their own AI API key for roadmap generation.
// If provided, the key is also stored for AI Tutor / Interview / Code Review.
// If skipped, the deterministic engine is used (instant, reliable, template-based).
// ============================================================

function OptionalApiKeyStep({
  apiKey,
  setApiKey,
  provider,
  setProvider,
  model,
  setModel,
  skipped,
  setSkipped,
}: {
  apiKey: string;
  setApiKey: (v: string) => void;
  provider: string;
  setProvider: (v: string) => void;
  model: string;
  setModel: (v: string) => void;
  skipped: boolean;
  setSkipped: (v: boolean) => void;
}) {
  const PROVIDER_LABELS: Record<string, { label: string; icon: string; url?: string }> = {
    gemini: { label: "Google Gemini", icon: "✨", url: "https://aistudio.google.com" },
    groq: { label: "Groq", icon: "⚡", url: "https://console.groq.com" },
    openrouter: { label: "OpenRouter", icon: "🌐", url: "https://openrouter.ai/keys" },
    openai: { label: "OpenAI", icon: "🤖", url: "https://platform.openai.com/api-keys" },
    anthropic: { label: "Anthropic", icon: "🧠", url: "https://console.anthropic.com" },
  };
  const MODELS: Record<string, string[]> = {
    gemini: ["gemini-2.5-flash-lite", "gemini-3-flash", "gemini-3.5-flash"],
    groq: ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b"],
    openrouter: ["meta-llama/llama-3.3-70b-instruct:free", "openai/gpt-oss-120b:free", "nvidia/nemotron-3-super-120b-a12b:free", "google/gemma-4-31b-it:free", "openrouter/free"],
    openai: ["gpt-4o-mini"],
    anthropic: ["claude-sonnet-4-5"],
  };
  const providerInfo = PROVIDER_LABELS[provider] ?? PROVIDER_LABELS.gemini;
  const models = MODELS[provider] ?? [];

  // v5.92 FIX (BUG 4): Test Connection state
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({ ok: false, message: "Please enter an API key first." });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey: apiKey.trim(),
          model,
          test: true,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setTestResult({ ok: true, message: "✅ Connection successful! Your key works." });
      } else {
        setTestResult({ ok: false, message: `❌ ${data.error || "Connection failed. Check your key and provider."}` });
      }
    } catch (err) {
      setTestResult({ ok: false, message: `❌ Network error: ${(err as Error).message}` });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Optional: AI API Key</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Provide your own API key for AI-powered roadmap generation, or skip to use the built-in engine.
        </p>
      </div>

      {/* Honest tradeoff explanation */}
      <div className="rounded-xl border border-border/60 bg-card/30 p-4 space-y-3">
        <div className="flex items-start gap-2">
          <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium">With an API key</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              AI generates a personalized roadmap with detailed, contextual task descriptions tailored to your career and languages. The same key powers AI Tutor, mock interviews, and code review — you only enter it once.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium">Without an API key (Skip)</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              The built-in deterministic engine generates your roadmap instantly and reliably. It&apos;s template-based but covers all your selected languages with structured phases and tasks. You can add a key later in Settings to enable AI features.
            </p>
          </div>
        </div>
      </div>

      {/* Skip / Provide Key toggle — v5.92 FIX (BUG 3): can toggle back and forth */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setSkipped(true);
            setApiKey("");
          }}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            skipped
              ? "bg-primary text-primary-foreground"
              : "border border-border/60 hover:bg-foreground/5 text-muted-foreground",
          )}
        >
          Skip — use built-in engine
        </button>
        {skipped && (
          <button
            onClick={() => {
              setSkipped(false);
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-border/60 hover:bg-foreground/5 text-muted-foreground transition-colors"
          >
            Provide a key instead
          </button>
        )}
        {!skipped && (
          <span className="text-xs text-muted-foreground">or provide your key below ↓</span>
        )}
      </div>

      {/* API key input (hidden if skipped) */}
      {!skipped && (
        <div className="space-y-4 rounded-xl border border-border/60 bg-card/20 p-5">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Provider</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
              {Object.entries(PROVIDER_LABELS).map(([id, info]) => (
                <button
                  key={id}
                  onClick={() => setProvider(id)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 rounded-lg border text-xs transition-all",
                    provider === id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/40 hover:bg-foreground/5 text-muted-foreground",
                  )}
                >
                  <span className="text-base">{info.icon}</span>
                  <span className="font-medium">{info.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Paste your ${providerInfo.label} API key here`}
              className="w-full mt-1.5 px-3 py-2 rounded-lg border border-border/60 bg-background/50 text-sm font-mono"
            />
            {providerInfo.url && (
              <p className="text-[11px] text-muted-foreground mt-1">
                Get a free key at{" "}
                <a href={providerInfo.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {providerInfo.url}
                </a>
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full mt-1.5 px-3 py-2 rounded-lg border border-border/60 bg-background/50 text-sm"
            >
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* v5.92 FIX (BUG 4): Test Connection button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTestConnection}
              disabled={testing || !apiKey.trim()}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                testing || !apiKey.trim()
                  ? "bg-foreground/5 text-muted-foreground cursor-not-allowed"
                  : "bg-primary/15 text-primary hover:bg-primary/25"
              )}
            >
              {testing ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Testing...
                </>
              ) : (
                <>
                  <Check className="h-3 w-3" /> Test Connection
                </>
              )}
            </button>
            {testResult && (
              <span className={cn(
                "text-xs",
                testResult.ok ? "text-emerald-500" : "text-rose-500"
              )}>
                {testResult.message}
              </span>
            )}
          </div>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <Shield className="h-3 w-3 inline mr-1" />
              Your key is stored only on this device (localStorage) and sent directly to {providerInfo.label} through our server proxy. It powers roadmap generation, AI Tutor, mock interviews, and code review — you&apos;ll never need to enter it again.
            </p>
          </div>
        </div>
      )}
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
  roadmap: ReturnType<typeof generateRoadmap> | null;
  isGenerating: boolean;
  genStage: number;
}) {
  // v5.922 FIX (CRITICAL): Handle null roadmap during generation animation.
  // Previously this accessed `roadmap.careerId` BEFORE checking isGenerating,
  // crashing with "Cannot read properties of null (reading 'careerId')".
  // The caller passes roadmap={null} during generation (line 533).
  const stages = roadmap
    ? getGenerationStagesForInput({
        name: "",
        careerId: roadmap.careerId,
        selectedLanguageIds: roadmap.languageIds,
        occupationId: "",
        skillLevel: "beginner",
        hoursPerDay: 2,
        daysPerWeek: 5,
      })
    : getGenerationStagesForInput({
        name: "",
        careerId: "software-engineering" as CareerId,
        selectedLanguageIds: [],
        occupationId: "student",
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

  // v5.922: Safety guard — if roadmap is null and not generating, show error
  if (!roadmap) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-10 w-10 mx-auto text-amber-500 mb-3" />
        <p className="text-sm text-muted-foreground">Roadmap generation failed. Please go back and try again.</p>
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
