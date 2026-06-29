# Launchpad — Free Personalized Coding Education Platform


A free, privacy-first coding education platform with AI-powered personalized roadmaps, **630 lessons across 30 languages**, **6,000 quiz questions**, **207 projects**, **1,860+ daily challenges**, an inline code editor, AI tutor with mock interview mode, AI code review, a resume auto-builder, GitHub Discussions community, shareable progress cards, spaced repetition quizzes, and a code playground. 100% on-device — no accounts, no tracking.

**Live URL:** https://launchpad--pi.vercel.app
**GitHub:** https://github.com/dumzvybez/Launchpad
**Developer:** Dumindu Dulara Wanasinghe ([Portfolio](https://duminduwanasinghe-dev.vercel.app/))

---

## ✨ Features (Updated Edition)

### 🧠 AI-Powered Personalization Engine
- **3-provider fallback chain:** Gemini 2.5 Flash → Groq Llama 3.3 70B → OpenRouter → deterministic engine
- **Double retry loop:** If all 3 providers fail, the chain retries once. If it fails again, the user sees a choice screen — "Continue with built-in engine" or "Try Again".
- **12-check validation** on AI-generated roadmaps (phase count 4-10, foundation/capstone titles, module/task counts, lesson ID references, language coverage, timeline, sequential numbering, unique task IDs, estMinutes range)
- Variable phase count (4-10) based on profile complexity
- AI bonus track (career-specific AI content) as second-to-last phase
- Lesson linking: roadmap tasks link directly to Learn tab lessons (e.g. `python-03`)
- Source message on plan preview: teal "AI-generated" (with provider name) or amber "Built-in engine used"

### 📚 Learn Tab — 630 Lessons × 30 Technologies
Built from the canonical `launchpad_database_v3.txt` curriculum:

| Technology | Stages | | Technology | Stages |
|-----------|---------|---|------------|---------|
| Python | 20 + capstone | | Go | 20 + capstone |
| JavaScript | 20 + capstone | | Rust | 20 + capstone |
| TypeScript | 20 + capstone | | Swift | 20 + capstone |
| HTML | 20 + capstone | | Kotlin | 20 + capstone |
| CSS | 20 + capstone | | PHP | 20 + capstone |
| SQL | 20 + capstone | | Ruby | 20 + capstone |
| Java | 20 + capstone | | R | 20 + capstone |
| C | 20 + capstone | | Dart | 20 + capstone |
| C++ | 20 + capstone | | Bash | 20 + capstone |
| C# | 20 + capstone | | React | 20 + capstone |
| Next.js | 20 + capstone | | Django | 20 + capstone |
| FastAPI | 20 + capstone | | Flask | 20 + capstone |
| Svelte | 20 + capstone | | Vue | 20 + capstone |
| Angular | 20 + capstone | | Node.js | 20 + capstone |
| PostgreSQL | 20 + capstone | | MongoDB | 20 + capstone |

**Per stage:** 8-15 content blocks including `whyItMatters`, prerequisites, topics covered, key concepts, multiple code examples, common pitfalls, real-world apps, interview questions (collapsible), mini project, exercises, and a 10-question quiz with explanations. Each stage also has a curated YouTube tutorial embed (collapsible, privacy-enhanced via youtube-nocookie.com).

### ✏️ Inline Code Editor (NEW — Section 1)
Every code example in every lesson has an **Edit & Run** button:
- **JavaScript/TypeScript:** Runs in a **sandboxed iframe** (`sandbox="allow-scripts"` only) using `Function` constructor (NOT `eval`). 5-second timeout. Inside the iframe, `document.cookie`, `localStorage`, `fetch`, `XMLHttpRequest`, `WebSocket`, and `eval` are stripped before user code runs. All output captured via `postMessage` bridge.
- **HTML/CSS:** Live preview iframe using `srcdoc`.
- **Python:** Pyodide (Python in WebAssembly, ~10MB) loaded lazily and cached.
- **SQL:** sql.js (SQLite in WASM) — Postgres-specific features link to DB Fiddle.
- **Bash/Shell:** Simulated commands (echo, ls, cat, mkdir, touch, grep, pwd, cd) with fake virtual filesystem.
- **Other compiled languages (Java, C, C++, C#, Go, Rust, Swift, Kotlin, PHP, Ruby, R, Dart):** "Open in Online IDE" button → Replit, OneCompiler, or official playgrounds.
- **Svelte / Vue / Angular:** Link to official playgrounds.
- **Node.js / MongoDB:** Link to StackBlitz / MongoDB Playground.

### 📺 YouTube Video Supplements (Section 2)
- **600 per-stage video links** (`src/data/youtube-links.ts`) — one curated tutorial per stage, embedded via youtube-nocookie.com for privacy
- **30 per-track playlist links** — "Watch Full Course on YouTube" button in each lesson
- **Collapsible by default** — click to expand the iframe
- **Per-video dismissal** ("Hide this video" link)
- **Global toggle** in Settings → Preferences → "Show video supplements in lessons"
- Trusted channels: freeCodeCamp, The Net Ninja, Corey Schafer, Kevin Powell, The Cherno, Tim Corey, Let's Get Rusty, Code With Chris, Philipp Lackner, Matt Pocock, Marcus Ng, Hussein Nasser, and more

### 🤖 AI Tutor — Bring Your Own Key (BYOK)
6 providers supported. **No free default** — every user provides their own API key:

| Provider | Models | Free tier |
|----------|--------|-----------|
| **Google Gemini** ⭐ | gemini-2.5-flash (rec), gemini-2.5-pro, gemini-2.0-flash | ✅ |
| **Groq** ⭐ | llama-3.3-70b-versatile (rec), llama-3.1-8b-instant, llama-3.1-70b-versatile | ✅ |
| **OpenRouter** ⭐ | google/gemini-2.5-flash (rec), openai/gpt-4o, anthropic/claude-sonnet-4, meta-llama/llama-3.3-70b-instruct | Free + Paid |
| **OpenAI** | gpt-4o-mini (rec), gpt-4o | 💳 |
| **Anthropic** | claude-sonnet-4-20250514 (rec), claude-3-5-haiku-20241022 | 💳 |
| **Custom Endpoint** | Any OpenAI-compatible endpoint | — |

**Deprecated models auto-migrated** on app hydration: gemini-1.5-*, mixtral-8x7b-32768, gemma2-9b-it, gpt-3.5-turbo, gpt-4-turbo, claude-3-5-sonnet-20241022, claude-3-opus-20240229.

First-time setup screen, **Test Connection** button (sends "Hi" to verify the key), and links to obtain free keys (console.groq.com, aistudio.google.com, openrouter.ai/keys). Multi-conversation history stored on-device. Settings + New Chat + History accessible in BOTH the floating bubble and the full-screen tab.

### 🎯 AI Mock Interview Mode (Section 4 — NEW)
Inside the AI Tutor, click **🎯 Interview Mode** to start a mock technical interview:
- Setup screen: career (read-only, from your roadmap), languages (read-only), difficulty (beginner/intermediate/advanced), question count (5/10/15)
- AI acts as a senior technical interviewer — asks one question at a time, gives 3-5 sentence feedback after each answer
- At the end: overall score (1-10) and 3 specific areas to study
- 80+ curated questions in `src/lib/interview-questions.ts` across all 30 technologies, with extra coverage for Svelte, Vue, Angular, Node.js, PostgreSQL, MongoDB
- Saves session summary to your chat history
- Free — no other free platform offers this

### 🔍 AI Code Review (Section 7 — NEW)
After marking a project as shipped, click **"Get AI Code Review"** on the project card:
- Paste your code into the editor
- AI returns a structured review: Overall Impression, What Works Well (3-5 specifics), Issues Found (with fixes), Suggested Improvements (3 with code), Score (X/10), Encouragement
- Save review to chat history or copy to clipboard
- Like having a senior developer review your code — for free

### 📜 Certificates
**Per-language certificate:**
- **Requirement:** Complete all lessons in a track AND average quiz score ≥ 75%
- Average = (userEarnedMarks / totalPossibleMarks) × 100, where each question = 10 marks, each quiz = 10 questions = 100 marks, totalPossibleMarks = stages × 10 × 10 = 2,000 per track
- 3 button states: active "Download Certificate" (teal), "Retake Quizzes to Unlock" (amber, shows gap), "Complete all lessons first" (grey)
- Editable name (prompt before generating), language icon, skills mastered list, Launchpad watermark, deterministic cert ID (`LP-XXXXXXXX`), PDF export via browser print

**Career Master Certificate:**
- **Requirement:** 100% Career Readiness Score (5-dimension formula)
- Gold accent design, ID prefix `LP-CAREER-XXXXXXXX`
- Lists all roadmap languages as chips, total estimated hours invested

**Public Verification Page (Section 3 — NEW):**
- URL pattern: `/verify/LP-ABC12345`
- Confirms the ID format is valid
- Explains Launchpad's privacy-first approach (no central database)
- Links to the developer portfolio

### 📊 Career Readiness Score (Section 5 — NEW)
A holistic 0-100% score across 5 dimensions:
| Dimension | Weight | How calculated |
|-----------|--------|----------------|
| Roadmap Progress | 25% | % of roadmap tasks completed |
| Knowledge (Quizzes) | 25% | Average quiz score across all completed stages |
| Projects Built | 20% | % of assigned projects marked complete |
| Daily Challenges | 15% | Streak length + % of total challenges completed |
| Interview Readiness | 15% | Mock interview sessions completed × average score |

If Interview Mode has never been used, its 15% is redistributed equally across the other 4 dimensions. Color thresholds: red (0-40%), amber (41-70%), teal (71-89%), gold with glow (90-100%). At 90%+, a banner encourages applying to jobs. At 100%, Career Master Certificate unlocks.

### 📄 Resume Auto-Builder (Section 6 — NEW)
Click **"Build My Resume"** in Career tab to auto-generate a professional resume PDF:
- Customization modal: name, email, GitHub, LinkedIn, career objective, toggles for quiz scores / badges / branding
- Auto-populated from your Launchpad data: completed tracks, projects, certificates, quiz scores, streaks, badges
- PDF via browser print → Save as PDF (no jsPDF dependency needed)

### 📤 Shareable Progress Cards (Section 8 — NEW)
- "Share My Progress" button on Dashboard
- "Share My Achievements" button on Account → Achievements tab
- "Share Certificate" appears after earning any certificate
- Generates a beautiful PNG/PDF card sized for Twitter/X, LinkedIn, Instagram
- All cards generated client-side using browser print → Save as PDF

### 💬 Community Tab (Section 9 — NEW)
GitHub Discussions integration via Giscus:
- **5 sections:** Announcements, Help & Questions, Show & Tell, General Chat, Feature Requests
- Each section embeds Giscus pointing to a Discussion category
- Requires a free GitHub account to post
- **Privacy:** Launchpad progress data is never shared there — it stays on your device

### 🔁 Adaptive Quiz Difficulty / Spaced Repetition (Section 10 — NEW)
- Per-question tracking with SM-2 algorithm
- Questions you consistently get wrong appear more frequently in future quizzes
- "Review Mode" option before each quiz: "Take fresh quiz" or "Review difficult questions"
- "Weak Areas" card on Learn tab shows your top 5 most-missed questions with a "Review Now" button

### 📊 How Do Others Learn? (Section 11 — NEW)
Anonymous benchmark card on Dashboard:
- Most popular career: Software Engineering (38%)
- Most popular first language: Python (67%)
- Average time to complete first phase: 12 days
- % who complete first certificate: 34%
- Your stats vs benchmarks (streak percentile, etc.)
- **Important:** Hardcoded estimates — Launchpad collects ZERO user data

### 🚀 Zero to Hero Visual Journey (Section 12 — NEW)
"View My Journey" button on Dashboard opens a full-screen modal with an animated vertical timeline:
- Each milestone (started Launchpad, first lesson, first badge, 7-day streak, first certificate, first project shipped, Career Master) is a glowing dot on a teal → violet → amber gradient line
- Click any milestone for details
- Summary stats at top: days on Launchpad, lessons completed, projects built
- "What's next?" button takes you to your roadmap

### 🏅 25+ Badges + XP System (Section 13 — ENHANCED)
- **15 new badges:** Video Scholar, Code Typer, Interview Ready, Spaced Repeater, Resume Builder, Code Reviewed, Career Ready, Community Member, Progress Sharer, Interview Master, Perfect Score, Code Reviewer, Target Locked, Resume Ready, Polyglot Plus
- **XP system with explicit 10-level curve:**
  - Level 1: 0–499 XP
  - Level 2: 500–1,499 XP
  - Level 3: 1,500–3,499 XP
  - Level 4: 3,500–7,499 XP
  - Level 5: 7,500–14,999 XP
  - Level 6: 15,000–29,999 XP
  - Level 7: 30,000–59,999 XP
  - Level 8: 60,000–119,999 XP
  - Level 9: 120,000–239,999 XP
  - Level 10: 240,000+ XP (max)
- XP rewards: lesson +50, quiz pass +30, perfect quiz +60, project +150, daily challenge +25, mock interview +100, badge +75, 7-day streak bonus +200

### 📱 PWA Polish (Section 14 — ENHANCED)
- **Install prompt** with 7-day dismissal (top-right toast after 18s on page)
- **Offline banner** — friendly "You're offline" message with list of what still works
- **Mobile bottom navigation** — fixed bottom bar with 5 most important tabs (Home, Roadmap, Learn, AI, More) — feels like a native app

### 🧩 Multi-Language Code Playground
- **JavaScript/TypeScript:** runs in-browser via V8 engine
- **Frameworks & databases:** links to official playgrounds (Svelte REPL, Vue SFC Playground, StackBlitz Angular, DB Fiddle for PostgreSQL, mongoplayground.net for MongoDB, RunKit/StackBlitz for Node.js)

### 📅 Daily Challenges — 1,860+ Tasks
- **60+ tasks per language × 30 languages = 1,860 tasks** (`src/lib/daily-challenges-data-v2.ts`)
- Pool assigned to each user based on their roadmap languages at onboarding
- 7 tasks selected per week (deterministic by week-start date), rotating so the same task doesn't repeat for ≥4 weeks
- Each task: title, description, language tag, difficulty (beginner/intermediate/advanced), hint, reference solution, estimated time, starter code

### 📆 Calendar with Recurring Events & Notifications
- **Frequency options:** one-time, daily, weekly (select weekdays), monthly (day of month)
- **Time picker** with in-app notifications at the scheduled time
- **Snooze:** 5 / 10 / 15 / 30 minutes
- **Notification actions:** Mark done, Delete
- Browser native notifications (with permission)

### 🗂️ Projects — 207 with Instructions
- **Strict language matching:** a project only shows if EVERY required language is in the user's plan
- **Instructions button** on each project card → full-page step-by-step guide (setup, file structure, core model, feature-by-feature implementation, edge cases, README, test/deploy)
- Stretch goals, deliverables, project submission (repo URL + notes)
- 6+ projects per career, range of difficulties

### 🔒 100% On-Device Privacy
No accounts, no servers, no tracking, no analytics. All data in localStorage.
- BYOK AI: your API keys never leave your device
- AI chat history: stored locally only
- Roadmap generation: only your profile inputs are sent to the AI provider (Gemini/Groq/OpenRouter)
- Community tab: requires GitHub account, but your Launchpad progress is never shared

---

## 🛠️ Tech Stack
- **Framework:** Next.js 16 (App Router), TypeScript 5
- **Styling:** Tailwind CSS 4, shadcn/ui, glass design system
- **State:** Zustand (client-side, persisted to localStorage)
- **AI (Roadmap):** Gemini 2.5 Flash → Groq Llama 3.3 70B → OpenRouter fallback chain (server-side, double retry loop)
- **AI (Chat + Interview + Code Review):** BYOK — Gemini, OpenAI, Anthropic, Groq, OpenRouter, Custom
- **Code execution:** Sandboxed iframe (JS/TS), Pyodide (Python), sql.js (SQL), simulated (Bash)
- **Community:** Giscus (GitHub Discussions)
- **Syntax highlighting:** react-syntax-highlighter (Prism + vscDarkPlus)
- **Notifications:** sonner (top-right, slide-in, auto-dismiss)

---

## 🚀 Getting Started

### Environment Variables
Create `.env.local` (see `.env.example`):

```env
# Roadmap Generation (server-side only — never exposed to client)
GEMINI_API_KEY=your_key
GROQ_API_KEY=your_key
OPENROUTER_API_KEY=your_key
```

Get free keys:
- **Gemini:** https://aistudio.google.com
- **Groq:** https://console.groq.com
- **OpenRouter:** https://openrouter.ai/keys

If all 3 keys are missing or all 3 providers fail twice, the user sees a choice screen — "Continue with built-in engine" or "Try Again".

### Install
```bash
git clone https://github.com/dumzvybez/Launchpad.git
cd Launchpad
bun install
bun run dev
```

Open http://localhost:3000

---

## 📖 Course Catalog

All 30 technologies × 21 lessons (20 stages + 1 capstone) = **630 lessons** · **6,000 quiz questions** · **30 capstone project guides** · **600 YouTube tutorial embeds**.

Each technology track is 50–200 hours of estimated learning time (beginner to advanced). Curriculum source: `launchpad_database_v3.txt` (the canonical database).

---

## 📜 Certificate Types

### Per-Language Certificate
- **Requirement:** Complete all 21 lessons in a track + 75%+ average quiz score
- **Format:** Printable PDF (browser print → Save as PDF), landscape, Georgia serif font
- **Features:** Editable name, language icon, skills mastered list, Launchpad watermark, deterministic cert ID (`LP-XXXXXXXX`), actual lesson + quiz counts
- **Verification:** Public URL at `/verify/LP-XXXXXXXX` confirms ID format is valid

### Career Master Certificate
- **Requirement:** 100% Career Readiness Score (5 dimensions: roadmap 25% + quizzes 25% + projects 20% + challenges 15% + interviews 15%)
- **Format:** Printable PDF with gold accent design (amber gradient border, gold seal)
- **Features:** Lists all roadmap languages as chips, total estimated hours invested, ID prefix `LP-CAREER-XXXXXXXX`

---

## 🤝 Contributing

Pull requests welcome at https://github.com/dumzvybez/Launchpad

Developer portfolio: https://duminduwanasinghe-dev.vercel.app/

---

## 📄 License
MIT — free for personal and commercial use.
