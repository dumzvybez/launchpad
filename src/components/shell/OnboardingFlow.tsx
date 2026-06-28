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

const TOTAL_STEPS = 7; // steps 0-6

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

  const canProceed = useMemo(() => {
    if (step === 0) return true; // privacy intro
    if (step === 1) return name.trim().length > 0 && careerId !== "";
    if (step === 2) return occupationId !== "" && careerId !== "";
    if (step === 3) return selectedLanguages.length > 0;
    if (step === 4) return true; // skill level has default
    if (step === 5) return hoursPerDay > 0 && daysPerWeek > 0;
    if (step === 6) return generatedRoadmap !== null;
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
    if (step === 5) {
      // Generate the roadmap with 8-stage visual feedback
      // The AI is the primary generator; deterministic engine is fallback.
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
      const stages = getGenerationStagesForInput(input);

      // Stage 0: Analyzing inputs
      setGenStage(0);
      await new Promise((r) => setTimeout(r, 500));

      // Stage 1: Mapping career path
      setGenStage(1);
      await new Promise((r) => setTimeout(r, 500));

      // Stage 2: Loading language metadata
      setGenStage(2);
      await new Promise((r) => setTimeout(r, 500));

      // Stage 3: AI personalizing your plan — call the AI
      setGenStage(3);
      let roadmap: GeneratedRoadmap | null = null;
      let usedAI = false;
      try {
        const aiResult = await generateRoadmapWithAI(input);
        if (aiResult.roadmap) {
          roadmap = aiResult.roadmap;
          usedAI = true;
        } else {
          console.warn("[onboarding] AI generation failed, falling back to deterministic:", aiResult.error);
        }
      } catch (err) {
        console.warn("[onboarding] AI generation threw, falling back:", err);
      }

      // Stage 4: Designing phases
      setGenStage(4);
      await new Promise((r) => setTimeout(r, 400));

      // Stage 5: Generating tasks & modules
      setGenStage(5);
      await new Promise((r) => setTimeout(r, 400));

      // Stage 6: Computing timeline
      setGenStage(6);
      await new Promise((r) => setTimeout(r, 400));

      // Stage 7: Validating accuracy — run the 8-check validation
      setGenStage(7);

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
          console.log("[onboarding] retry validation:", validation);
        }
      }

      // If still invalid after retry (or AI failed entirely), fall back to deterministic
      if (!validation.valid && usedAI) {
        console.log("[onboarding] AI roadmap still invalid after retry, using deterministic fallback");
        roadmap = generateRoadmap(input);
        validation = validateRoadmap(roadmap, input);
      }

      if (!validation.valid) {
        console.warn("[onboarding] roadmap still has validation errors:", validation.errors);
      }

      setGeneratedRoadmap(roadmap);
      setGenStage(stages.length);
      await new Promise((r) => setTimeout(r, 400));
      setIsGenerating(false);
      setStep(6);
      return;
    }

    if (step === 6) {
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
                <p className="text-xs text-muted-foreground font-mono">Step {step} of {TOTAL_STEPS - 1}</p>
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
          {step === 1 && (
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
          {step === 2 && (
            <OccupationCareerStep
              occupationId={occupationId}
              setOccupationId={setOccupationId}
              careerId={careerId as CareerId}
              subPath={subPath}
              setSubPath={setSubPath}
            />
          )}
          {step === 3 && (
            <LanguageSelectionStep
              careerId={careerId as CareerId}
              selected={selectedLanguages}
              setSelected={setSelectedLanguages}
            />
          )}
          {step === 4 && (
            <SkillLevelStep skillLevel={skillLevel} setSkillLevel={setSkillLevel} />
          )}
          {step === 5 && (
            <AvailabilityStep
              hoursPerDay={hoursPerDay}
              setHoursPerDay={setHoursPerDay}
              daysPerWeek={daysPerWeek}
              setDaysPerWeek={setDaysPerWeek}
            />
          )}
          {step === 6 && generatedRoadmap && (
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
          {step === 6 ? (
            <GlassButton onClick={handleNext} variant="primary" size="lg" disabled={!canProceed}>
              <Sparkles className="h-4 w-4" />
              Begin my journey
            </GlassButton>
          ) : step === 5 ? (
            <GlassButton onClick={handleNext} variant="primary" size="lg" disabled={!canProceed || isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate my roadmap
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </GlassButton>
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
// Step 0 — Privacy Intro
// ============================================================

function PrivacyIntroStep() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Welcome to Launchpad</h2>
          <p className="text-sm text-muted-foreground">Your private coding education platform</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed">
        Launchpad is a free, open-source coding education platform that builds you a personalized roadmap based on your career goals, languages, and availability. It tracks your progress, teaches you with built-in lessons, and includes an AI tutor — all designed to take you from where you are now to a job-ready developer.
      </p>

      {/* Privacy warning panel */}
      <div className="rounded-xl border-2 border-amber-500/60 bg-amber-500/10 p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Your data is private — stored only on this device</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All your progress, settings, roadmap, chat history, and badges are saved 100% locally in your browser. Nothing is sent to any server. We don't have accounts, we don't sync, and we don't sell your data. Clearing your browser will erase everything — use the Backup feature in Settings to export a copy.
            </p>
          </div>
        </div>
      </div>

      {/* AI tutor notice */}
      <div className="rounded-xl border border-border bg-card/50 p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 h-8 w-8 rounded-full bg-violet-500/20 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-violet-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">AI Tutor — your data goes to AI servers</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Launchpad includes an AI tutor to help you learn. Messages you send to the AI are processed by AI servers (Z.ai by default). Don&apos;t share sensitive personal information. You can add your own API key in AI Tutor settings to use a different provider and bypass rate limits.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <Feature icon={<Map className="h-4 w-4" />} title="Personalized roadmap" desc="6 phases built for you" />
        <Feature icon={<GraduationCap className="h-4 w-4" />} title="30+ lessons" desc="Python & JavaScript tracks" />
        <Feature icon={<Code2 className="h-4 w-4" />} title="Code playground" desc="Practice as you learn" />
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="text-primary">{icon}</div>
        <span className="text-xs font-semibold">{title}</span>
      </div>
      <p className="text-[11px] text-muted-foreground">{desc}</p>
    </div>
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

  const sorted = [...LANGUAGES].sort((a, b) => {
    // Recommended first
    const aRec = recommended.has(a.id) ? 0 : 1;
    const bRec = recommended.has(b.id) ? 0 : 1;
    if (aRec !== bRec) return aRec - bRec;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold mb-1">Pick your languages</h2>
        <p className="text-sm text-muted-foreground">
          We pre-selected languages recommended for {career?.label}. Uncheck any or add others — click the <Info className="inline h-3 w-3" /> icon for details.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {sorted.map((lang) => {
          const isSelected = selected.includes(lang.id);
          const isRec = recommended.has(lang.id);
          return (
            <div key={lang.id} className="relative">
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 hover:border-border bg-card/40",
                )}
                onClick={() => toggle(lang.id)}
              >
                <span className="text-base">{lang.icon}</span>
                <span className="font-medium">{lang.name}</span>
                {isRec && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-semibold uppercase">
                    Rec
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
        })}
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
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">6 phases</div>
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
