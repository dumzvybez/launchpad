"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";

// All answers reviewed for accuracy against the actual app behavior.
// The "regenerate plan" answer now points to the real Regenerate Plan
// button in Account Settings (which exists after Change 13).
const QA = [
  {
    q: "How do I reset my progress?",
    a: "Go to Settings → Data & backup → click 'Reset everything'. This erases ALL data on this device: profile, progress, lessons, chats, badges, settings. The action cannot be undone. Make sure to download a backup first if you want to keep your data. Note: This is different from Regenerate Plan (which keeps your progress).",
  },
  {
    q: "Is my data really private?",
    a: "Yes. All your data (profile, progress, roadmap, lessons, chat history, badges, settings) is stored 100% in your browser's localStorage. Nothing is sent to a server. The only exception is the AI Tutor — messages you send to the AI are processed by AI servers (Z.ai by default, or your own provider if you add an API key). We don't have accounts, we don't sync across devices, and we don't sell or use your data for ads.",
  },
  {
    q: "How do I backup my data?",
    a: "Launchpad automatically creates a daily snapshot in localStorage. To download a backup file: Settings → Data & backup → 'Download backup'. This saves a JSON file you can restore later with 'Restore from file'. Tip: email the file to yourself or store it in cloud storage for safekeeping.",
  },
  {
    q: "How do I regenerate my plan (change career, languages, or availability)?",
    a: "Go to Settings and click the Reset button to restart onboarding and generate a new plan. Your lesson progress and badges are preserved — only your roadmap gets regenerated.",
  },
  {
    q: "How does the AI Tutor work?",
    a: "The AI Tutor uses large language models to answer your coding questions. By default it uses Z.ai's GLM-4.6 model, rate-limited to 15 messages per 2-hour window (tracked on-device). You can add your own API key in AI Tutor settings (click the gear icon in the floating chat window, or visit the AI Tutor tab) to use OpenAI, Groq, or a custom endpoint — this bypasses rate limits. Your conversations are stored on your device only. The AI may make mistakes; verify important information.",
  },
  {
    q: "Can I use this offline?",
    a: "Mostly yes. After your first visit, the app loads from cache and works offline — you can view your roadmap, complete tasks, take lessons, and use the playground. The only features requiring internet are: (1) the AI Tutor (needs to call AI servers), and (2) generating a new roadmap (uses AI for refinement). Install Launchpad as a PWA (Add to Home Screen) for the best offline experience.",
  },
  {
    q: "How do I install Launchpad as an app?",
    a: "On desktop Chrome/Edge: click the install icon in the address bar (or menu → Install Launchpad). On Android Chrome: menu → Add to Home screen. On iOS Safari: Share → Add to Home Screen. Once installed, Launchpad opens in its own window like a native app, with offline support and a splash screen.",
  },
  {
    q: "What if I clear my browser?",
    a: "Clearing your browser data (or site data) will erase ALL your Launchpad progress, since everything is stored locally. To prevent data loss: (1) Download a backup regularly from Settings → Data & backup → 'Download backup', (2) The daily auto-backup saves a snapshot to localStorage (note: this won't survive a full browser clear), (3) Consider installing Launchpad as a PWA — installed PWAs sometimes preserve data even when you clear browser cache.",
  },
  {
    q: "Can I export my progress?",
    a: "Yes. Go to Settings → Data & backup → 'Download backup'. This exports your entire state (profile, tasks, lessons, chats, badges, preferences) as a JSON file. You can restore it later on any device with 'Restore from file'. The file is human-readable JSON if you want to inspect it.",
  },
  {
    q: "How do I earn badges?",
    a: "Badges are awarded automatically when you hit milestones. Examples: 'First Lesson' (complete any lesson), 'Week Warrior' (7-day streak), 'Quiz Master' (pass 5 quizzes at 80%+), 'Code Legend' (complete your entire roadmap). There are 24+ badges across 4 rarity tiers: common, rare, epic, and legendary. When you earn one, an animated toast pops up in the top-right corner — check Account → Achievements to see them all.",
  },
  {
    q: "Why can't I see the Playground tab?",
    a: "The Playground tab only appears if you have JavaScript or TypeScript in your learning plan. This is intentional — the playground runs JavaScript in your browser only. If you're learning Python or another language exclusively, use an external environment like Replit or Google Colab (linked inside the Playground view if you do have access). To unlock the Playground, regenerate your plan and add JavaScript or TypeScript to your languages.",
  },
  {
    q: "How is my roadmap generated?",
    a: "Our personalization engine combines your career choice, selected languages, current occupation, skill level, and weekly availability. It calls the Z.ai GLM-4.6 AI to generate a structured JSON roadmap with the right number of phases (4-12, not always 6) based on your profile complexity. After AI generation, we run an 8-check automated validation on phases, content, dependencies, language coverage, timeline, and numbering. If validation finds issues, we send the roadmap back to the AI for one correction retry. If it still fails, we fall back to a deterministic engine. The visual progress indicator shows each stage: Analyzing inputs → Mapping career → Loading languages → AI personalizing → Designing phases → Generating tasks → Computing timeline → Validating accuracy.",
  },
  {
    q: "Why are some fields locked in Account Settings?",
    a: "Only your name is directly editable in Account Settings. Other fields (career, occupation, skill level, languages, availability) are locked because changing any of them requires regenerating your roadmap. To change them, click the 'Regenerate Plan' button — you'll go back through onboarding with your lesson progress and badges preserved.",
  },
  {
    q: "What happens when I complete a lesson in the Learn tab?",
    a: "Two things: (1) Your lesson progress is saved (not started → in progress → complete) and your best quiz score is recorded. (2) If your roadmap has a task linked to that lesson (shown with a 'Lesson: xx-00' badge in the task detail), the task is automatically marked complete — you earn the XP and your streak updates. Complete all lessons in a track (e.g. all 15 Python lessons) to generate a PDF certificate.",
  },
  {
    q: "How are projects chosen for me?",
    a: "Launchpad has a database of 55+ projects covering all careers and languages. When your roadmap is generated, the engine scores each project by career match and language overlap, then selects 8 projects with tier diversity: 2-3 beginner (foundational), 2-3 intermediate (core), and 1-2 advanced (capstone). Visit the Projects tab to see your personalized selection. Each project shows the reason it was selected for you.",
  },
  {
    q: "What is the AI Bonus Track at the end of my roadmap?",
    a: "Every roadmap ends with an 'AI Foundations' bonus phase — customized to your career. For example: Software Engineering gets 'LLM APIs and AI-assisted coding'; Cloud/DevOps gets 'MLOps and AI monitoring'; Data Science gets 'Machine Learning fundamentals'; Web Dev gets 'AI-powered UX features'. This bonus track is optional — it's not required for completion but shows how AI applies to your specific career path.",
  },
];

export function HelpCentre() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <GlassCard className="p-5">
      <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <HelpCircle className="h-4 w-4" /> Help Centre
      </h2>
      <div className="space-y-1">
        {QA.map((item, i) => (
          <div key={i} className="rounded-lg border border-border/40 overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-foreground/5 transition-colors"
            >
              <span className="text-sm font-medium">{item.q}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
                  open === i && "rotate-180",
                )}
              />
            </button>
            {open === i && (
              <div className="px-3 pb-3 pt-1 text-xs text-muted-foreground leading-relaxed">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
