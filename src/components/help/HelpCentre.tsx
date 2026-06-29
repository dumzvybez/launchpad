"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// All answers reviewed for accuracy against the actual app behavior (June 2026).
const QA = [
  {
    q: "How do I add my own AI API key?",
    a: "Open the AI Tutor (floating bubble at bottom-right or the AI Tutor tab in the sidebar). If you haven't set up a key yet, you'll see a setup screen. Pick a provider (Google Gemini, Groq, OpenRouter, OpenAI, Anthropic, or a custom endpoint), choose a model, paste your API key, and click Save. Use the 'Test Connection' button to verify your key works. Get a free key from console.groq.com (Groq) or aistudio.google.com (Gemini).",
  },
  {
    q: "What if all 3 AI providers fail during roadmap generation?",
    a: "Launchpad's roadmap generator tries Google Gemini → Groq → OpenRouter in order. If all three fail (rate limits, network issues, or missing API keys), the built-in deterministic engine creates your roadmap locally. You'll see an amber message on the plan preview explaining the engine was used. Try again later — AI services may be temporarily unavailable.",
  },
  {
    q: "Can I learn multiple careers at once?",
    a: "Currently you can have one career per account. You can regenerate your plan from Settings → Data & backup → Restart Onboarding to switch careers. Your lesson progress and badges are preserved — only the roadmap gets regenerated with the new career.",
  },
  {
    q: "How do I regenerate my plan?",
    a: "Go to Settings → Data & backup and click 'Restart Onboarding (Regenerate Plan)'. This restarts the onboarding flow so you can change your career, skill level, occupation, languages, or availability. Your lesson progress, badges, and chat history are preserved — only your roadmap gets regenerated.",
  },
  {
    q: "How do certificates work?",
    a: "There are two types of certificates:\n\n1. Per-language certificate: Earned when you complete all lessons in a track AND have an average quiz score of 75% or higher. Open the Learn tab → click any completed track → 'Generate Certificate'. You can edit your name on the certificate before downloading it as a PDF.\n\n2. Career Master Certificate: Unlocked when your entire career roadmap reaches 100% completion (40% tasks + 40% lessons + 20% projects). Visit the Career tab to claim and download your gold Career Master Certificate (ID prefix: LP-CAREER-).",
  },
  {
    q: "How do I reset my progress?",
    a: "Go to Settings → Data & backup → click 'Reset everything'. This erases ALL data on this device: profile, progress, lessons, chats, badges, settings. The action cannot be undone. Make sure to download a backup first if you want to keep your data. Note: This is different from Regenerate Plan (which keeps your progress).",
  },
  {
    q: "Is my data really private?",
    a: "Yes. All your data (profile, progress, roadmap, lessons, chat history, badges, settings) is stored 100% in your browser's localStorage. Nothing is sent to a server except: (1) AI chat messages — these go directly from your browser to the AI provider you've configured (Gemini, OpenAI, Anthropic, Groq, or OpenRouter), and (2) roadmap generation inputs — sent to Gemini (or Groq/OpenRouter as fallback) during onboarding. We don't have accounts, we don't sync across devices, and we don't sell or use your data for ads.",
  },
  {
    q: "How do I backup my data?",
    a: "Launchpad automatically creates a daily snapshot in localStorage. To download a backup file: Settings → Data & backup → 'Download backup'. This saves a JSON file you can restore later with 'Restore from file'. Tip: email the file to yourself or store it in cloud storage for safekeeping.",
  },
  {
    q: "How does the AI Tutor work?",
    a: "The AI Tutor uses large language models to answer your coding questions. Launchpad is BYOK (Bring Your Own Key) — you provide your own API key from Google Gemini (recommended, free tier), Groq (recommended, free tier), OpenRouter, OpenAI, Anthropic, or a custom OpenAI-compatible endpoint. Your conversations are stored on your device only. The AI may make mistakes; verify important information.",
  },
  {
    q: "Can I use this offline?",
    a: "Mostly yes. After your first visit, the app loads from cache and works offline — you can view your roadmap, complete tasks, take lessons, and use the playground. The only features requiring internet are: (1) the AI Tutor (needs to call AI servers), and (2) generating a new roadmap (uses AI). Install Launchpad as a PWA (Add to Home Screen) for the best offline experience.",
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
    a: "Badges are awarded automatically when you hit milestones. Examples: 'First Lesson' (complete any lesson), 'Week Warrior' (7-day streak), 'Quiz Master' (pass 5 quizzes at 80%+), 'Code Legend' (complete your entire roadmap). There are 25+ badges across 4 rarity tiers: common, rare, epic, and legendary — including new ones like 'Video Scholar', 'Interview Ready', 'Resume Builder', 'Code Reviewed', 'Career Ready', and 'Polyglot Plus'. When you earn one, an animated toast pops up in the top-right corner — check Account → Achievements to see them all.",
  },
  {
    q: "How is Launchpad different from freeCodeCamp, Codecademy, or Udemy?",
    a: "Launchpad is the only platform that combines: (1) a fully AI-personalized roadmap built around YOUR career and languages — not a generic template, (2) completely free with no paywalls ever, (3) 100% on-device privacy — no accounts, no tracking, no data sold, (4) built-in lessons for 30 languages, an inline code editor, AI tutor, mock interviews, code review, and a resume builder — everything you need, without leaving the platform. Most platforms do one or two of these. Launchpad does all of them.",
  },
  {
    q: "How does the inline code editor work?",
    a: "Every code example in every lesson has a 'Edit & Run' button. Click it to switch the example into an editable Monaco editor (the same engine powering VS Code). JavaScript and TypeScript run inside a sandboxed iframe in your browser — no server needed. HTML/CSS render in a live preview iframe. SQL runs via sql.js (SQLite compiled to WebAssembly). Python runs via Pyodide (Python in WebAssembly, ~10MB loaded lazily). Bash is simulated with a fake virtual filesystem. Other compiled languages (Java, C, C++, Go, Rust, etc.) open in Replit or OneCompiler via 'Open in Online IDE' — they need a server, so we don't pretend to run them in-browser. Frameworks (Svelte, Vue, Angular) link to their official playgrounds.",
  },
  {
    q: "How do I do a mock interview?",
    a: "Go to AI Tutor → click '🎯 Interview Mode' (next to New Chat). Choose your difficulty (Beginner / Intermediate / Advanced) and number of questions (5 / 10 / 15). The AI acts as a senior technical interviewer for your specific career and languages — it asks one question at a time, gives honest feedback after each answer, and at the end produces an overall score (1-10) with 3 specific areas to study before your real interview. Saves the session summary to your chat history. Free — no other free platform offers this.",
  },
  {
    q: "How is my Career Readiness Score calculated?",
    a: "The Career Readiness Score is a holistic 0-100% score across 5 dimensions: Roadmap Progress (25%), Knowledge / Quizzes (25%), Projects Built (20%), Daily Challenges (15%), and Interview Readiness (15%). If you've never used Interview Mode, its 15% is redistributed equally across the other 4 dimensions. The score replaces the older 3-dimension roadmap+lessons+projects calculation. Color coding: red (0-40%), amber (41-70%), teal (71-89%), gold with a glow effect (90-100%). At 90%+, you'll see a banner encouraging you to apply for jobs. At 100%, you unlock the Career Master Certificate.",
  },
  {
    q: "How do I build my resume?",
    a: "Go to Career tab → click 'Build My Resume' (below the Career Readiness Score). A customization modal opens with editable fields: name, email, GitHub URL, LinkedIn URL, career objective, and toggles for quiz scores, achievement badges, and Launchpad branding. Click 'Preview' to see the resume, then 'Download PDF' to save it. The resume is auto-populated from your Launchpad data — completed tracks, projects, certificates, quiz scores, streaks, and badges. Uses jsPDF to generate a professional PDF entirely in your browser.",
  },
  {
    q: "How do I get my code reviewed?",
    a: "After you mark a project as complete (shipped) in the Projects tab, a 'Get AI Code Review' button appears on the project card. Click it, paste your code into the editor, and click 'Submit for Review'. The AI (using your configured API key) returns a structured review with: Overall Impression, What Works Well (3-5 specific things), Issues Found (with explanations and fixes), Suggested Improvements (3 with code examples), a Score (X/10), and an encouraging sentence. Save the review to your history or copy it to clipboard. This is like having a senior developer review your code — for free.",
  },
  {
    q: "What is the Community tab?",
    a: "The Community tab is a lightweight community experience powered by GitHub Discussions (via Giscus). It has 5 sections: Announcements, Help & Questions, Show & Tell, General Chat, and Feature Requests. Participating requires a GitHub account (free). Your Launchpad progress data is never shared there — it stays on your device. The Community tab is entirely optional.",
  },
  {
    q: "Can I share my progress?",
    a: "Yes! On the Dashboard, click 'Share My Progress' (near the top stats) to generate a beautiful PNG image showing your career, roadmap %, languages, streak, and badges — sized for Twitter/X, LinkedIn, and Instagram. On the Achievements tab, click 'Share My Achievements'. After earning any certificate, click 'Share Certificate' to generate a certificate card. All cards are generated client-side using html2canvas — no server roundtrip.",
  },
  {
    q: "What are video supplements?",
    a: "Each lesson stage has an optional YouTube video supplement at the top — a curated tutorial from a trusted channel (freeCodeCamp, The Net Ninja, Kevin Powell, etc.) relevant to that stage's topic. Videos are embedded via youtube-nocookie.com (YouTube's privacy-enhanced mode) so YouTube doesn't track you until you press play. Videos are supplemental only — lesson content works perfectly without them. You can hide individual videos ('Hide this video' link) or disable all video supplements in Settings → Preferences → 'Show video supplements in lessons'.",
  },
  {
    q: "How many languages does Launchpad cover?",
    a: "30 technologies across languages, frameworks, markup, and databases: Python, JavaScript, TypeScript, HTML, CSS, SQL, Java, C, C++, C#, Go, Rust, Swift, Kotlin, PHP, Ruby, R, Dart, Bash, React, Next.js, Django, FastAPI, Flask, Svelte, Vue, Angular, Node.js, PostgreSQL, and MongoDB. Each technology has 20 stages + 1 capstone = 21 lessons, for a total of 630 lessons and 6,000 quiz questions (10 per stage).",
  },
  {
    q: "What is spaced repetition in quizzes?",
    a: "After you fail a quiz question, that question is tagged for review and will appear more frequently in future quiz attempts using the SM-2 spaced repetition algorithm. Questions you consistently get right appear less often. Before each quiz you'll see two options: 'Take fresh quiz' (all questions) or 'Review difficult questions' (just your weak areas). The Learn tab also has a 'Weak Areas' card showing your top 5 most-missed questions with a 'Review Now' button to start a focused mini-quiz. Spaced repetition is proven to increase retention by up to 200%.",
  },
  {
    q: "What is the Zero-to-Hero journey?",
    a: "On the Dashboard, click 'View My Journey' to open a full-screen modal showing an animated vertical timeline of your entire learning journey from day 1 to today. Each milestone (started Launchpad, completed first lesson, earned a badge, completed a certificate, etc.) is a glowing dot on a teal gradient line. Click any milestone for details. At the top you'll see summary stats (days on Launchpad, lessons completed, projects built). At the bottom, a 'What's next?' button takes you to your roadmap.",
  },
  {
    q: "What is the 'How do others learn?' card on the Dashboard?",
    a: "It's a small motivational card showing anonymized, pre-baked benchmark statistics — most popular career (Software Engineering 38%), most popular first language (Python 67%), average time to complete first phase (12 days), etc. Your stats are compared against these benchmarks. Important: these are estimated hardcoded benchmarks based on realistic learning data. Launchpad collects ZERO user data — nothing is sent to any server.",
  },
  {
    q: "Why can't I see the Playground tab?",
    a: "The Playground tab only appears if you have JavaScript or TypeScript in your learning plan. This is intentional — the playground runs JavaScript in your browser only. If you're learning Python or another language exclusively, use an external environment like Replit or Google Colab. To unlock the Playground, regenerate your plan and add JavaScript or TypeScript to your languages.",
  },
  {
    q: "How is my roadmap generated?",
    a: "Our personalization engine combines your career choice, selected languages, current occupation, skill level, and weekly availability. It calls a 3-provider AI fallback chain (Google Gemini → Groq → OpenRouter) to generate a structured JSON roadmap with the right number of phases (4-10) based on your profile complexity. After AI generation, we run an automated validation on phases, content, dependencies, language coverage, timeline, and numbering. If validation finds issues, we send the roadmap back to the AI for one correction retry. If all 3 providers fail or validation still fails, we fall back to a deterministic engine. The visual progress indicator shows each stage: Analyzing inputs → Mapping career → Loading languages → Sending to AI → Receiving response → Extracting structure → Designing phases → Generating tasks → Computing timeline → Validating accuracy → Finalizing.",
  },
  {
    q: "Why are some fields locked in Account Settings?",
    a: "Only your name is directly editable in Account Settings. Other fields (career, occupation, skill level, languages, availability) are locked because changing any of them requires regenerating your roadmap. To change them, go to Settings → Data & backup → 'Restart Onboarding (Regenerate Plan)' — you'll go back through onboarding with your lesson progress and badges preserved.",
  },
  {
    q: "What happens when I complete a lesson in the Learn tab?",
    a: "Two things: (1) Your lesson progress is saved (not started → in progress → complete) and your best quiz score is recorded. (2) If your roadmap has a task linked to that lesson (shown with a 'Lesson: xx-NN' badge in the task detail), the task is automatically marked complete — you earn the XP and your streak updates. Complete all lessons in a track (e.g. all 21 Python lessons including the capstone) to generate a PDF certificate.",
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
    <div className="space-y-3">
      <h2 className="text-sm font-semibold flex items-center gap-2">
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
              <div className="px-3 pb-3 pt-1 text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
