<div align="center">

<img src="public/icons/logo-1024.png" alt="Launchpad Logo" width="140" />

# 🚀 Launchpad

### Free. Private. Personalized. Coding education the way it should be.

[![Status](https://img.shields.io/badge/status-actively%20developing-orange?style=for-the-badge)](https://github.com/dumzvybez/launchpad/discussions)
[![Version](https://img.shields.io/badge/version-6.008.0-9cf?style=for-the-badge)](#-changelog)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](#-license)
[![Live App](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://launchpadedu.vercel.app)
[![Privacy](https://img.shields.io/badge/privacy-100%25%20on--device-9cf?style=for-the-badge)](#-100-on-device-privacy)

**[🌐 Live App](https://launchpadedu.vercel.app)** · **[💬 Discussions](https://github.com/dumzvybez/launchpad/discussions)** · **[👨‍💻 Developer Portfolio](https://dumindu.vercel.app)**

</div>

---

> ⚠️ **This project is actively under development.** Things are evolving fast, some features are still being polished, and your feedback genuinely shapes the roadmap. Jump into [Discussions](https://github.com/dumzvybez/launchpad/discussions) to share ideas, report bugs, or just say hi.

## 🧭 What is Launchpad?

Launchpad is a personalized coding education platform built on one core belief: **learning to code shouldn't require an account, a subscription, or your data.**

Tell it your career goal, and Launchpad generates a custom learning roadmap pulling from a massive on-device curriculum — then walks with you through lessons, quizzes, projects, mock interviews, and even helps you build a resume at the end. All of it runs **100% in your browser.** No servers tracking you. No sign-ups. No catch.

<div align="center">

| | | | |
|:---:|:---:|:---:|:---:|
| **38** Tracks | **797** Lessons | **7,220** Quiz Questions | **207** Projects |
| **1,980** Daily Challenges | **43** Achievements | **233** Interview Questions | **0** Accounts Required |

</div>

---

## 📚 Table of Contents

- [✨ Core Features](#-core-features)
- [🧠 How Personalization Works](#-how-personalization-works)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📖 Course Catalog](#-course-catalog)
- [📜 Certificates](#-certificates)
- [🔒 Privacy, By Design](#-100-on-device-privacy)
- [🏗️ Architecture Overview](#️-architecture-overview)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📜 Changelog](#-changelog)

---

## ✨ Core Features

<details open>
<summary><strong>🧠 Personalized Roadmaps</strong></summary>
<br>

Your personalized learning path is generated instantly by Launchpad's built-in deterministic engine — right in your browser. No API keys, no waiting, no network calls. It combines your career, languages, skill level, and availability into a structured plan.

- 12-point validation on every generated roadmap (phase counts, lesson references, sequencing, and more)
- Variable-length roadmaps (4–10+ phases) that scale with your goals and language count
- Auto-injected prerequisite languages with clear 'Required for' labeling
- A dedicated AI-focused bonus phase near the end of every track
- Every roadmap task links straight into the matching lesson

</details>

<details>
<summary><strong>📚 Learn Tab — Lessons Across 38 Technologies</strong></summary>
<br>

From Python and JavaScript to Rust, Swift, React, and PostgreSQL — each track has in-depth lessons. Every single lesson includes:

- A "why it matters" framing + prerequisites
- Multiple worked code examples
- Common pitfalls & real-world applications
- Collapsible interview questions
- A mini project + 10-question quiz with explanations
- A curated, privacy-respecting YouTube tutorial (youtube-nocookie.com)

</details>

<details>
<summary><strong>📖 Documentation-Style Reading Experience</strong></summary>
<br>

Lessons read like professional documentation — clean typography, clear section hierarchy, comfortable reading width, and a collapsible course outline sidebar that shows your progress through the track. No box-heavy layouts, no visual clutter. Just content.

</details>

<details>
<summary><strong>✏️ Inline Code Editor — Edit & Run Everywhere</strong></summary>
<br>

| Language type | How it runs |
|---|---|
| JavaScript / TypeScript | Sandboxed iframe, no `eval`, 5s timeout, network APIs stripped |
| HTML / CSS | Instant live preview |
| Python | Pyodide (Python via WebAssembly) |
| SQL | sql.js in-browser, with DB Fiddle for Postgres-specific features |
| Bash / Shell | Simulated shell with a fake virtual filesystem |
| Compiled languages (Java, C++, Go, Rust, etc.) | One-click launch into Replit / OneCompiler / official playgrounds |
| Frameworks (Svelte, Vue, Angular, Node) | Direct links to official playgrounds / StackBlitz |

</details>

<details>
<summary><strong>🤖 AI Tutor, Mock Interviews & Code Review (Bring Your Own Key)</strong></summary>
<br>

No platform-funded AI costs here — you plug in your own free or paid API key (Gemini, Groq, OpenRouter, OpenAI, Anthropic, or any custom OpenAI-compatible endpoint), and unlock:

- 💬 **AI Tutor** — full conversational help, multi-chat history, all stored on-device
- 🎯 **Mock Interview Mode** — a simulated senior technical interviewer asks questions one at a time, scores you, and tells you exactly what to study next
- 🔍 **AI Code Review** — paste shipped project code and get a structured review with a score out of 10

</details>

<details>
<summary><strong>📜 Certificates & Career Readiness</strong></summary>
<br>

- **Per-language certificates** unlock once you finish every lesson in a track and hit a 75%+ quiz average
- **Career Master Certificate** unlocks at a 100% Career Readiness Score — a weighted blend of roadmap progress (30%), quiz performance (30%), projects shipped (20%), and interview practice (20%)
- Every certificate has a public, privacy-respecting verification page at `/verify/LP-XXXXXXXX`

</details>

<details>
<summary><strong>🔁 Spaced Repetition & Study Tools</strong></summary>
<br>

- **SM-2 spaced repetition** (the same algorithm Anki uses) tracks every quiz question you get wrong and surfaces it for review at the scientifically optimal interval
- **Flashcards tab** — auto-generated from lesson key concepts, interview questions, and quiz answers (14,385 potential cards)
- **Weak Areas card** on the Learn tab shows your top missed questions with one-click "Review Now" deep-links
- **Quiz review mode** — choose between "Take fresh quiz" or "Review difficult questions"
- **Lesson bookmarks** — star lessons to revisit later
- **Read time estimates** on every lesson
- **Print-friendly lesson view** — one-click print to PDF
- **"I don't understand" button** on every quiz question — sends context to the AI Tutor

</details>

<details>
<summary><strong>🎮 Gamification, Community & Daily Habits</strong></summary>
<br>

- 43 achievement badges across 4 rarity tiers (Common, Rare, Epic, Legendary)
- 10-level XP curve that rewards lessons, quizzes, projects, streaks, interviews, flashcards, and bookmarks
- **1,980 daily challenges** across all 38 languages, rotating weekly per user
- A built-in **Community tab** (GitHub Discussions via Giscus) — Announcements, Help & Questions, Show & Tell, General Chat, and Feature Requests
- Calendar with recurring study sessions, reminders, and snooze support
- Installable as a PWA, with offline support and a mobile-first bottom nav

</details>

---

## 🧠 How Personalization Works

```mermaid
flowchart TD
    A[Onboarding: Your Goals & Background] --> B[Roadmap Generation (Built-in Engine)]
    B --> C[Learn Tab: 797 Lessons]
    B --> D[Daily Challenges Pool]
    B --> E[Projects: 207 Available]
    C --> F[Quizzes + Spaced Repetition]
    E --> G[Ship Project → AI Code Review]
    F --> H[Career Readiness Score]
    G --> H
    D --> H
    H -->|100%| I[🏆 Career Master Certificate]
    H -->|per track| J[📜 Language Certificates]
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (Liquid Glass design system) |
| State | Zustand, persisted to `localStorage` |
| Roadmap Engine | Built-in deterministic engine (100% on-device, no API key needed) |
| Tutor / Interview / Review AI | BYOK — Gemini, OpenAI, Anthropic, Groq, OpenRouter, or custom endpoint |
| Code Execution | Sandboxed iframe, Pyodide, sql.js, simulated shell |
| Certificate Verification | Supabase (Postgres + RLS) |
| Community | Giscus (GitHub Discussions) |
| Syntax Highlighting | react-syntax-highlighter (Prism, vscDarkPlus) |
| Testing | Vitest (70 tests across 4 suites) |

> **v6.000 architecture:** Every lesson and quiz question has a permanent stable identity ("slug") decoupled from its display order. Lesson metadata is build-generated from content, never hand-maintained.

> **v6.002 content pipeline:** All 797 lessons are authored as Markdown files in `content/{track}/` and compiled to per-track JSON at build time. The runtime loads only the track you open (~200-470 KB) instead of the entire curriculum.

> **v6.008 UX redesign:** Documentation-style lesson reading, collapsible course outline sidebar, stronger glass contrast, and a dashboard "Continue your lesson" card for one-click re-entry.

---

## 🚀 Getting Started

**1. Clone & install**

```bash
git clone https://github.com/dumzvybez/launchpad.git
cd launchpad
bun install
```

**2. Set up environment variables** — create `.env.local`:

```env
# Optional — only used if you self-host and want platform keys for AI Tutor (BYOK is the default)

# Certificate verification (Supabase) — v5.77+
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # server-only, never expose

# Self-hosting — v5.77+
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Certificate forgery protection — v5.77+ (optional but recommended)
CERT_SECRET=your_random_secret_string
```

Free keys: [Gemini](https://aistudio.google.com) · [Groq](https://console.groq.com) · [OpenRouter](https://openrouter.ai/keys) · [Supabase](https://supabase.com)

> Roadmap generation needs no keys — it runs entirely in your browser. AI Tutor, Mock Interviews, and Code Review are BYOK (bring your own key).

**3. Run it**

```bash
bun run dev
```

Then open **http://localhost:3000** 🎉

---

## 📖 Course Catalog

38 technologies, each with ~21 lessons today (~797 lessons total). The v6.000
architecture supports scaling to **100-150+ lessons per track** — every lesson
now has a permanent stable identity ("slug") so tracks can be reorganized and
expanded without ever breaking user progress.

<div align="center">

| | | | |
|---|---|---|---|
| Python | JavaScript | TypeScript | HTML |
| CSS | SQL | Java | C |
| C++ | C# | Go | Rust |
| Swift | Kotlin | PHP | Ruby |
| R | Dart | Bash | React |
| Next.js | Django | FastAPI | Flask |
| Svelte | Vue | Angular | Node.js |
| PostgreSQL | MongoDB | Docker | Tailwind |
| Express | GraphQL | Kubernetes | Terraform |
| PyTorch | TensorFlow | | |

</div>

Each track represents roughly **50–200 hours** of learning time, beginner to advanced.

---

## 📜 Certificates

| | Per-Language Certificate | Career Master Certificate |
|---|---|---|
| **Unlocks when** | All lessons in a track complete + 75%+ quiz average | 100% Career Readiness Score |
| **Format** | Landscape PDF, deterministic ID (`LP-XXXXXXXX`) | Gold-accented PDF, ID prefix `LP-CAREER-XXXXXXXX` |
| **Verification** | Public page at `/verify/LP-XXXXXXXX` | Same verification system |

---

## 🔒 100% On-Device Privacy

No accounts. No servers storing your data. No analytics. Everything lives in your browser's `localStorage`.

- Your AI API keys never leave your device
- Chat history with the AI Tutor stays local
- Roadmap generation runs entirely on your device — nothing is sent anywhere
- The Community tab requires a GitHub account to post, but your Launchpad progress is **never** shared there

---

## 🏗️ Architecture Overview

```
launchpad/
├── content/               # Markdown lesson source (797 files across 38 tracks)
│   ├── python/            # 21 lessons
│   ├── javascript/        # 21 lessons
│   └── ...
├── public/content/        # Compiled per-track JSON (lazy-loaded at runtime)
├── scripts/
│   ├── gen-lesson-meta.ts # Markdown → metadata (slugs, counts, track maps)
│   └── compile-content.ts # Markdown → per-track JSON
├── src/
│   ├── app/               # Next.js App Router (/, /verify/[id], /api/*)
│   ├── components/
│   │   ├── glass/         # Liquid Glass design primitives
│   │   ├── learning/      # Lesson experience (sidebar, header, blocks)
│   │   ├── shell/         # AppShell, Sidebar, TopBar, Onboarding
│   │   ├── views/         # 18 main views (Dashboard, Learn, Projects, etc.)
│   │   └── ui/            # shadcn/ui components
│   ├── lib/
│   │   ├── curriculum/    # v6.004 module catalog, assessments, capstones
│   │   ├── store.ts       # Zustand store (persisted to localStorage)
│   │   ├── personalization-engine.ts  # On-device roadmap generation
│   │   ├── sm2.ts         # Spaced repetition algorithm
│   │   └── certificate-utils.ts       # HMAC-signed certificate IDs
│   └── data/              # YouTube links, career data
├── supabase/schema.sql    # Certificate verification table + RLS
└── tests/                 # Vitest suites (content, curriculum, certificates, store)
```

**Content pipeline:** `content/*.md` → `scripts/compile-content.ts` → `public/content/*.json` → lazy-fetched by `content-loader.ts` when a user opens a track.

**Identity system:** Every lesson has a permanent slug (e.g., `python-variables-and-data-types`) decoupled from its positional ID. All persisted user state (progress, bookmarks, flashcards, certificates) uses slugs — so lessons can be reordered or expanded without breaking anything.

---

## 🗺️ Roadmap

- ✅ **v6.000–v6.006:** Stable identity system, per-track lazy loading, dead code removal, TypeScript hardening, test suite
- ✅ **v6.007:** Desktop/tablet UX pass — lesson sidebar, reading width, glass clarity
- ✅ **v6.008:** Professional UI redesign — documentation-style lessons, collapsible sidebar, glass fixes, dashboard optimization
- 🔄 **Next:** Populate forward-looking curriculum fields (aiContext, learningObjectives, skillsTaught, practiceChallenges) on lessons
- 🔄 **Next:** Wire the v6.004 graduated assessment ladder (module quizzes, checkpoint exams, certificate exams)
- 📋 **Future:** RAG/vector search for AI tutor, leaderboards, mobile responsive pass

---

## 🤝 Contributing

Pull requests, issues, and ideas are all welcome.

- **Repo:** [github.com/dumzvybez/launchpad](https://github.com/dumzvybez/launchpad)
- **Discussions:** [Share feedback, report bugs, request features](https://github.com/dumzvybez/launchpad/discussions)
- **Live App:** [launchpadedu.vercel.app](https://launchpadedu.vercel.app)
- **Developer:** Dumindu Dulara Wanasinghe — [Portfolio](https://dumindu.vercel.app)

---

## 📜 Changelog

### v6.008.0 — Professional UI Redesign
- Documentation-style lesson reading (no box-heavy layout, clean typography hierarchy)
- Collapsible lesson sidebar with proper compact rail + expand button (persists preference)
- Liquid glass readability fixes (onboarding dropdowns, notification center, stronger tint)
- Dashboard "Continue your lesson" card for one-click re-entry
- Screen size optimization (tighter dashboard spacing for first-viewport fit)
- Updated all project links to new URLs

### v6.007.0 — Desktop & Tablet UX
- Sticky lesson sidebar with track progress
- Constrained reading width (max-w-3xl)
- Glass tint opacity increased for readability
- Wider main content (max-w-7xl) for 1440px+ screens

### v6.006.0 — Stabilization
- Removed 11 MB dead content bundles
- Removed unused Prisma setup
- TypeScript ignoreBuildErrors removed — all errors fixed
- Added Vitest test suite (70 tests)
- Fixed stale documentation

### v6.000–v6.005 — Foundation
- Stable lesson identity (slugs)
- Per-track lazy content loading
- Scalable curriculum architecture (modules, capstones, assessments)
- Guided lesson experience components

---

<div align="center">

**Built solo, built free, built for everyone learning to code.** 💙

</div>
