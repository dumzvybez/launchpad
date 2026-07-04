<div align="center">

<img src="public/icons/logo-1024.png" alt="Launchpad Logo" width="140" />

# 🚀 Launchpad

### Free. Private. Personalized. Coding education the way it should be.

[![Status](https://img.shields.io/badge/status-actively%20developing-orange?style=for-the-badge)](https://github.com/dumzvybez/Launchpad/discussions)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](#-license)
[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://launchpad--dev.vercel.app)
[![Privacy](https://img.shields.io/badge/privacy-100%25%20on--device-9cf?style=for-the-badge)](#-100-on-device-privacy)

**[🌐 Live App](https://launchpad--dev.vercel.app)** · **[💬 Discussions](https://github.com/dumzvybez/Launchpad/discussions)** · **[👨‍💻 Developer Portfolio](https://duminduwanasinghe-dev.vercel.app/)**

</div>

---

> ⚠️ **This project is actively under development.** Things are evolving fast, some features are still being polished, and your feedback genuinely shapes the roadmap. Jump into [Discussions](https://github.com/dumzvybez/Launchpad/discussions) to share ideas, report bugs, or just say hi.

## 🧭 What is Launchpad?

Launchpad is an AI-powered, personalized coding education platform built on one core belief: **learning to code shouldn't require an account, a subscription, or your data.**

Tell it your career goal, and Launchpad generates a custom learning roadmap pulling from a massive on-device curriculum — then walks with you through lessons, quizzes, projects, mock interviews, and even helps you build a resume at the end. All of it runs **100% in your browser.** No servers tracking you. No sign-ups. No catch.

<div align="center">

| | | | |
|:---:|:---:|:---:|:---:|
| **630** Lessons | **30** Languages | **207** Projects | **6,000** Quiz Questions |
| **1,860+** Daily Challenges | **25+** Badges | **600** Curated Videos | **0** Accounts Required |

</div>

---

## 📚 Table of Contents

- [✨ Core Features](#-core-features)
- [🧠 How the AI Personalization Works](#-how-the-ai-personalization-works)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📖 Course Catalog](#-course-catalog)
- [📜 Certificates](#-certificates)
- [🔒 Privacy, By Design](#-100-on-device-privacy)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Core Features

<details open>
<summary><strong>🧠 AI-Powered Roadmaps</strong></summary>
<br>

Your personalized learning path is generated through a resilient multi-provider AI chain — if one model is down, it quietly falls back to the next, and if everything fails, you can always continue on a deterministic built-in engine instead.

```mermaid
flowchart LR
    A[Your Profile] --> B{Gemini 2.5 Flash}
    B -- fails --> C{Groq Llama 3.3 70B}
    C -- fails --> D{OpenRouter}
    D -- fails --> E[Built-in Engine /<br/>Try Again Choice]
    B -- success --> F[12-Point Validated Roadmap]
    C -- success --> F
    D -- success --> F
```

- 12-point validation on every AI-generated roadmap (phase counts, lesson references, sequencing, and more)
- Variable-length roadmaps (4–10 phases) that scale with your goals
- A dedicated AI-focused bonus phase near the end of every track
- Every roadmap task links straight into the matching lesson

</details>

<details>
<summary><strong>📚 Learn Tab — 630 Lessons Across 30 Technologies</strong></summary>
<br>

From Python and JavaScript to Rust, Swift, React, and PostgreSQL — each of the 30 tracks has 20 in-depth stages plus a capstone. Every single stage includes:

- A "why it matters" framing + prerequisites
- Multiple worked code examples
- Common pitfalls & real-world applications
- Collapsible interview questions
- A mini project + 10-question quiz with explanations
- A curated, privacy-respecting YouTube tutorial (youtube-nocookie.com)

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
- **Career Master Certificate** unlocks at a 100% Career Readiness Score — a weighted blend of roadmap progress, quiz performance, projects shipped, daily challenges, and interview practice
- Every certificate has a public, privacy-respecting verification page at `/verify/LP-XXXXXXXX`

</details>

<details>
<summary><strong>📄 Resume Builder, Progress Cards & Your Journey</strong></summary>
<br>

- One-click **resume auto-builder**, populated from your real Launchpad progress, exported as a PDF
- **Shareable progress cards** for LinkedIn, X, or Instagram
- A visual **"Zero to Hero" timeline** of every milestone you've hit, start to finish

</details>

<details>
<summary><strong>🔁 Spaced Repetition & Study Tools</strong></summary>
<br>

- **SM-2 spaced repetition** (the same algorithm Anki uses) tracks every quiz question you get wrong and surfaces it for review at the scientifically optimal interval
- **Flashcards tab** — auto-generated from lesson key concepts, interview questions, and quiz answers. Flip cards, mark "got it right/wrong", and let SM-2 schedule your reviews
- **Weak Areas card** on the Learn tab shows your top 5 most-missed questions with one-click "Review Now" deep-links
- **Quiz review mode** — choose between "Take fresh quiz" (all 10 questions) or "Review difficult questions" (only your due/hard questions)
- **Lesson bookmarks** — star lessons to revisit later, with a "Bookmarked" filter chip on the Learn tab
- **Read time estimates** on every lesson card and header (alongside the official curriculum estimate)
- **Print-friendly lesson view** — one-click print to PDF with a clean print stylesheet
- **"I don't understand" button** on every quiz question — sends the question + answer + explanation to the AI Tutor for a different explanation
- **Markdown export of notes** — one-click backup of all notes as a single `.md` file
- **Time-of-day analytics** — a "When you study" chart showing your peak productivity hours with an Early Bird / Day Sprinter / Evening Coder / Night Owl personality badge

</details>

<details>
<summary><strong>🎮 Gamification, Community & Daily Habits</strong></summary>
<br>

- 30+ badges and a 10-level XP curve that rewards lessons, quizzes, projects, streaks, interviews, flashcards, and bookmarks
- **1,860+ daily challenges** across all 30 languages, rotating weekly
- A built-in **Community tab** (GitHub Discussions via Giscus) — Announcements, Help & Questions, Show & Tell, General Chat, and Feature Requests
- Calendar with recurring study sessions, reminders, and snooze support
- Installable as a PWA, with offline support and a mobile-first bottom nav

</details>

---

## 🧠 How the AI Personalization Works

```mermaid
flowchart TD
    A[Onboarding: Your Goals & Background] --> B[AI Roadmap Generation]
    B --> C[Learn Tab: 630 Lessons]
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
| Styling | Tailwind CSS 4 + shadcn/ui (glass design system) |
| State | Zustand, persisted to `localStorage` |
| Roadmap AI | Gemini 2.5 Flash → Groq Llama 3.3 70B → OpenRouter (server-side fallback chain) |
| Tutor / Interview / Review AI | BYOK — Gemini, OpenAI, Anthropic, Groq, OpenRouter, or custom endpoint |
| Code Execution | Sandboxed iframe, Pyodide, sql.js, simulated shell |
| Certificate Verification | Supabase (Postgres + RLS) |
| Community | Giscus (GitHub Discussions) |
| Syntax Highlighting | react-syntax-highlighter (Prism, vscDarkPlus) |

---

## 🚀 Getting Started

**1. Clone & install**

```bash
git clone https://github.com/dumzvybez/Launchpad.git
cd Launchpad
bun install
```

**2. Set up environment variables** — create `.env.local`:

```env
# Server-side only — used for roadmap generation, never exposed to the client
GEMINI_API_KEY=your_key
GROQ_API_KEY=your_key
OPENROUTER_API_KEY=your_key

# Certificate verification (Supabase) — v5.77+
# Set these to enable public certificate verification at /verify/[id]
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # server-only, never expose

# Self-hosting — v5.77+
# Set this to your production URL so SEO metadata, sitemap, and OpenRouter
# attribution point to the right domain. Defaults to the Launchpad dev URL.
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Certificate forgery protection — v5.77+ (optional but recommended)
# If set, the /api/certificates/create endpoint requires an HMAC-SHA256
# completion token signed with this secret. If not set, the endpoint falls
# back to rate-limit-only protection (less secure).
CERT_SECRET=your_random_secret_string
```

Free keys: [Gemini](https://aistudio.google.com) · [Groq](https://console.groq.com) · [OpenRouter](https://openrouter.ai/keys) · [Supabase](https://supabase.com)

> If all three AI keys are missing or every provider fails, you'll get a clean fallback screen — continue on the built-in engine or try again.

**3. Run it**

```bash
bun run dev
```

Then open **http://localhost:3000** 🎉

---

## 📖 Course Catalog

30 technologies × 21 lessons (20 stages + capstone) = **630 lessons total.**

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
| PostgreSQL | MongoDB | | |

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
- Roadmap generation sends only your stated goals to the AI provider — nothing else
- The Community tab requires a GitHub account to post, but your Launchpad progress is **never** shared there

---

## 🤝 Contributing

Pull requests, issues, and ideas are all welcome.

- **Repo:** [github.com/dumzvybez/Launchpad](https://github.com/dumzvybez/Launchpad)
- **Discussions:** [Share feedback, report bugs, request features](https://github.com/dumzvybez/Launchpad/discussions)
- **Developer:** Dumindu Dulara Wanasinghe — [Portfolio](https://duminduwanasinghe-dev.vercel.app/)

---

## 📄 License

MIT — free for personal and commercial use.

<div align="center">

**Built solo, built free, built for everyone learning to code.** 💙

</div>
