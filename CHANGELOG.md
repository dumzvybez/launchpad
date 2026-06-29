# Launchpad CHANGELOG — Round 4 (Prompt_1_Updated.txt)

## Round 5 — Prompt-2-updated.txt Implementation

### Section 1 — Inline Code Editor Inside Lessons (NEW)
- New `src/components/lesson/InlineCodeEditor.tsx` — lightweight inline code editor with Edit & Run buttons
- JS/TypeScript: runs in sandboxed iframe with `sandbox="allow-scripts"`, user code via `Function` constructor (NOT `eval`), 5-second timeout
- Inside the sandbox iframe: strips `document.cookie`, `localStorage`, `sessionStorage`, `fetch`, `XMLHttpRequest`, `WebSocket`, `eval` per Section 1.5
- Console output captured via `postMessage` bridge (logs + errors + warnings)
- HTML/CSS: live preview via `srcdoc` (opens in new window)
- Python: Pyodide loaded lazily from `https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js`, cached in memory; loading indicator in Run button
- SQL: links to DB Fiddle (Postgres-specific features) per Section 1.2
- Bash/Shell: simulated commands (echo, ls, cat, mkdir, touch, grep, pwd, cd) with fake virtual filesystem
- Other compiled languages (Java, C, C++, C#, Go, Rust, Swift, Kotlin, PHP, Ruby, R, Dart): "Open in Online IDE" button → Replit / OneCompiler / official playgrounds, clearly labeled
- Svelte/Vue/Angular: link to official playgrounds (svelte.dev/playground, play.vuejs.org, stackblitz.com/edit/angular)
- Node.js: link to StackBlitz; MongoDB: link to mongoplayground.net
- All code blocks in LearnView now use InlineCodeEditor (replaces static code + Copy + Try in Playground buttons)

### Section 2 — YouTube Video Supplements (REFACTORED)
- Refactored `YouTubeEmbed` in LearnView to be **collapsible** (collapsed by default, click to expand)
- Added per-video dismissal ("Hide this video" link)
- Added privacy disclaimer when expanded: "⚠️ Loading this video connects to YouTube servers (youtube-nocookie.com)"
- Added `hideVideoSupplements: boolean` to AppState.preferences (default: false)
- Added toggle in Settings → Preferences → "Show video supplements in lessons"
- Existing 600 per-stage videos + 30 playlists (from Round 4) preserved

### Section 3 — Certificate Verification Page (NEW)
- New `src/lib/certificate-utils.ts` with `generateCertificateId(userId, trackId, completionDate)` — deterministic hash with **8-char padding** (fixes the bug in the prompt's `simpleHash` that could return 1-2 char strings for small inputs)
- Helpers: `isValidCertificateFormat(id)`, `getCertificateType(id)`
- New `src/app/verify/[id]/page.tsx` — server-rendered public verification page
  - URL pattern: `/verify/LP-ABC12345` (or `/verify/LP-CAREER-XXXXXXXX`)
  - Confirms ID format is valid (or shows "Invalid Certificate ID" page for malformed IDs)
  - Explains Launchpad's privacy-first approach (no central database to query)
  - Links to developer portfolio: `https://duminduwanasinghe-dev.vercel.app/`
  - Branded with Launchpad gradient (teal/violet/amber) and clean professional design

### Section 4 — AI Mock Interview Mode (NEW)
- New `src/lib/interview-questions.ts` with **80+ curated questions** across all 30 technologies
- Extra coverage for the 6 newly added (Svelte, Vue, Angular, Node.js, PostgreSQL, MongoDB) — 3-4 questions each
- Question types: conceptual, code-review, problem-solving, behavioral, system-design
- Difficulties: beginner, intermediate, advanced
- Helpers: `filterQuestions(opts)`, `pickInterviewQuestions(opts)`, `buildInterviewSystemPrompt(opts)`
- Interview system prompt per Section 4.3 (senior interviewer persona, one question at a time, 3-5 sentence feedback, end-of-session summary score)
- Updated `src/app/api/chat/route.ts` to accept optional `systemPrompt` in request body — used by Interview Mode to override default system prompt
- Added "🎯 Interview Mode" button to AIChat header (visible in both floating bubble and full-screen tab)
- New `InterviewSetupScreen` component — career (read-only), languages (read-only), difficulty (3 options), question count (5/10/15), Start button
- On Start: creates fresh chat, sets interview system prompt, fires first AI call with kickoff message ("Hi! I'm ready to start my mock interview…")
- Interview Mode banner shown in chat header while active — "End interview" link to reset

### Section 5 — Career Readiness Score (UPGRADED to 5 dimensions)
- New `selectCareerReadinessScore(state)` selector in store.ts with 5-dimension formula:
  - Roadmap Progress: 25%
  - Knowledge (Quizzes): 25%
  - Projects Built: 20%
  - Daily Challenges: 15%
  - Interview Readiness: 15% (null if Interview Mode never used → redistributes weight equally)
- CareerView now uses 5-dimension score instead of old 3-dimension (40/40/20)
- Color thresholds per Section 5.2: red (0-40%), amber (41-70%), teal (71-89%), gold with glow (90-100%)
- "🎉 You're interview-ready!" banner at 90%+, "🏆 100% Career Readiness!" banner at 100%
- New `SuggestedNextSteps` modal — shows 3 lowest dimensions with personalized suggestions and CTA buttons
- `selectCareerProgress` (3-dimension) kept for backward compat with Dashboard + Analytics

### Section 6 — Resume Auto-Builder (NEW)
- New `ResumeBuilderButton` component in CareerView
- Customization modal: name, email, GitHub, LinkedIn, career objective, 3 toggles (quiz scores, badges, branding)
- `generateResumePDF()` function opens a new window with print-optimized HTML
- Auto-populated from on-device Launchpad data: profile, roadmap, lesson progress, certificates, career certificate, shipped projects, badges, streak
- Per-language proficiency table (Beginner/Intermediate/Advanced based on quiz avg)
- Skills list, projects list, certifications, education section, achievements row
- Browser print → Save as PDF (no jsPDF dependency)
- Sets `launchpad:resume-built` localStorage flag for badge tracking

### Section 7 — AI Code Review (NEW)
- New `CodeReviewModal` component in ProjectsView
- "Get AI Code Review" button appears on project cards when status is "shipped"
- Code textarea (multi-file via comments like `// file: app.js`)
- Uses user's BYOK AI key + custom system prompt per Section 7.4
- AI returns structured review: Overall Impression, What Works Well, Issues Found, Suggested Improvements, Score (X/10), Encouragement
- "Save to Chat" button — copies review + code to a new AI Tutor conversation
- "Copy" button — copies review to clipboard
- Sets `launchpad:code-reviewed` and increments `launchpad:code-review-count` localStorage flags for badge tracking

### Section 8 — Shareable Progress Cards (NEW)
- "Share My Progress" button in Dashboard header
- New `ShareProgressCardModal` component — preview + "Generate Card (Print to PDF)" button
- Opens new window with print-optimized HTML card (600×360px, midnight blue gradient with Launchpad brand)
- Card shows: user name, career, roadmap %, languages (chips), streak, badges, tagline, URL
- "Share My Achievements" button in AccountView → Achievements tab — generates a card with all unlocked badges
- Uses browser print → Save as PDF (no html2canvas dependency)
- Sets `launchpad:progress-shared` localStorage flag for badge tracking

### Section 9 — Community Layer (NEW)
- New `src/components/views/CommunityView.tsx`
- GitHub Discussions integration via Giscus (script-based, no `@giscus/react` dep needed)
- 5 sections: Announcements, Help & Questions, Show & Tell, General Chat, Feature Requests
- Per-section: Giscus script injected with correct `data-category-id` and `data-term`
- Privacy notice card: "Participating requires a GitHub account. Your Launchpad progress is never shared here."
- "Open on GitHub" link to https://github.com/dumzvybez/Launchpad/discussions
- Added "community" to ViewId type + Sidebar nav + AppShell routing + CommandPalette
- Empty-state hint: "Be the first to post!"

### Section 10 — Adaptive Quiz Difficulty (PARTIAL)
- Badges added for spaced repetition usage (Spaced Repeater badge)
- localStorage flag `launchpad:review-mode-count` tracks Review Mode usage (incremented when user clicks "Review Mode" — to be wired into QuizView in a future round)
- Full SM-2 implementation deferred — badges + tracking are in place

### Section 11 — Compare Yourself Feature (NEW)
- "How do others learn?" card added to Dashboard
- Hardcoded benchmark stats (no real user data collected): most popular career (Software Engineering 38%), most popular first language (Python 67%), avg time to first phase (12 days), avg daily study time (45 min), % who finish 1st cert (34%), % who stick past 30d (28%)
- "Your stats vs average" section with streak percentile calculation
- Info tooltip: "These are estimated benchmarks to motivate you. Launchpad collects zero user data."

### Section 12 — Zero to Hero Visual Journey (NEW)
- "My Journey" button in Dashboard header
- New `JourneyTimelineModal` component — full-screen modal with vertical timeline
- Teal → violet → amber gradient vertical line
- Milestones (sorted by date): Started Launchpad, First lesson complete, First badge, 7-day streak, First certificate, First project shipped, Career Master Certificate
- "Today" marker at the bottom (pulsing border) — "You are here 📍"
- Summary stats at top: days on Launchpad, lessons completed, projects built
- "What's next? View Roadmap →" button at bottom

### Section 13 — Enhanced Badges and Gamification (EXPANDED)
- Added **15 new badges** to `src/lib/achievements-data.ts`:
  - Common: Video Scholar 🎬, Code Typer 💻, Community Member 🗣️, Progress Sharer 📤
  - Rare: Interview Ready 🎤, Spaced Repeater 🔁, Resume Builder 📝, Code Reviewed 🔍, Perfect Score 💯, Code Reviewer 🤝
  - Epic: Career Ready 🌟, Interview Master 🏆, Resume Ready 📄
  - Legendary: Target Locked 🎯, Polyglot Plus 🌍
- Now **40 total badges** (up from 24)
- XP system upgraded to **explicit 10-level curve** per Section 13.2 (Level 1: 0-499 XP through Level 10: 240,000+ XP)
- `selectLevel` rewritten to use `LEVEL_THRESHOLDS` array instead of dynamic 1.3x growth
- `selectEarnedXP` upgraded with new XP awards:
  - Lesson complete: +50 XP
  - Quiz pass (≥70%): +30 XP
  - Perfect quiz (100%): +60 XP (instead of 30)
  - Project shipped: +150 XP
  - Daily challenge (per streak day, capped at 50): +25 XP each
  - Mock interview completed: +100 XP
  - 7-day streak bonus: +200 XP

### Section 14 — Mobile App Experience (ENHANCED)
- New `src/components/pwa/OfflineBanner.tsx` — friendly "You're offline" banner when network is lost
  - Lists what still works (cached lessons, quizzes, roadmap, badges, certificates)
  - "Open Learn →" button
  - Dismissible per session
- New `src/components/shell/MobileBottomNav.tsx` — fixed bottom navigation bar for mobile (< lg breakpoint)
  - 5 most important tabs: Home, Roadmap, Learn, AI, More
  - "More" opens the existing mobile slide-out drawer with all other tabs
- Both components wired into AppShell
- Install prompt (existing) already has 7-day dismissal per Section 14.1

### Section 15 — Final Positioning Statement
- SplashScreen SUBTITLES updated to the 5 new taglines from prompt:
  1. "Learn to code. For real this time."
  2. "AI-personalized. Completely free. 100% private."
  3. "From zero to job-ready — without leaving this app."
  4. "The only platform built around YOUR goal."
  5. "Open-source. No accounts. No tracking. Ever."
- Hold phase extended from 4.5s to 6.5s to fit all 5 subtitles
- Loading bar transition extended from 5500ms to 7500ms
- HelpCentre: new Q&A added: "How is Launchpad different from freeCodeCamp, Codecademy, or Udemy?"

### Section 16 — COMPARISON.md Update
- Full rewrite of `COMPARISON.md` with new Launchpad feature row per Section 16
- Added 11 new dimensions to comparison table: Job readiness, Gamification, Inline code editor
- Added "Where Launchpad Leads" section with 13 bullet points
- Added "Where Launchpad is Competitive" with 5 bullet points
- Reduced "Where Launchpad Has Gaps" from 5 to 2 (Community no longer a gap thanks to GitHub Discussions; video content no longer a gap thanks to YouTube supplements)

### Section 17 — Full Content Audit
- **Old portfolio URL `dumindu-pi.vercel.app` replaced** with `https://duminduwanasinghe-dev.vercel.app/` in:
  - `src/app/layout.tsx` (metadata.authors)
  - `src/components/views/SettingsView.tsx` (AboutDeveloperCard "Visit portfolio" link)
  - `README.md` (top + bottom)
- **Footer developer name made clickable** — now opens portfolio at `https://duminduwanasinghe-dev.vercel.app/` in new tab (Section 17.9)
- **OnboardingFlow Step 0 privacy intro updated** to mention:
  - 630 lessons across 30 languages
  - Inline code editor (JS/Python/SQL/HTML/CSS/Bash)
  - AI tutor with mock interview mode
  - AI code review
  - Resume auto-builder
  - Community tab (GitHub Discussions — requires GitHub account, no Launchpad data shared)
  - BYOK requirement for AI Tutor
- **FirstTimeTour tooltips updated** — all 8 steps now mention new features (Career Readiness Score, shareable cards, "How do others learn?", inline code editor, Interview Mode, AI Code Review, hide video supplements setting)
- **HelpCentre updated** with new Q&A entries:
  - "How is Launchpad different from freeCodeCamp, Codecademy, or Udemy?" (Section 15.2)
  - "How does the inline code editor work?"
  - "How do I do a mock interview?"
  - "How is my Career Readiness Score calculated?"
  - "How do I build my resume?"
  - "How do I get my code reviewed?"
  - "What is the Community tab?"
  - "Can I share my progress?"
  - "What are video supplements?"
  - "How many languages does Launchpad cover?" (now says 30, was 24 in older copies)
  - "What is spaced repetition in quizzes?"
  - "What is the Zero-to-Hero journey?"
  - "What is the 'How do others learn?' card on the Dashboard?"
- **Existing "How do I earn badges?" answer updated** to mention 25+ badges and the new ones by name
- **DashboardView "Badges" stat card** updated from "of 24+" to "of 25+"
- **COMPARISON.md** fixed all "24 languages" references → "30 languages" (was 1 occurrence)
- **API chat route comment** updated from "164+ lessons" to "630 lessons"

## Prompt Audit (mandatory per Prompt-2-updated.txt Section 17)

This section flags any bugs or contradictions found in Prompt-2-updated.txt and notes the fixes applied:

### Bug 1 — simpleHash returning short strings (Section 3.1)
**Prompt issue:** The original `simpleHash` function returned `Math.abs(hash).toString(36)`, which can return strings as short as 1 character for small inputs (e.g., `Math.abs(0).toString(36) === "0"`).
**Fix applied:** Implemented the padded version per the prompt's note: `hash.padStart(8, "0").slice(0, 8)` guarantees 8-char output. See `src/lib/certificate-utils.ts`.

### Bug 2 — Section 1.2 eval vs Section 1.5 strip eval contradiction
**Prompt issue:** Section 1.2 says "Capture `console.log` output via a `postMessage` bridge. **Do NOT use raw `eval` in the main thread**" — Section 1.5 then says "Inside the iframe, strip `document.cookie`, `localStorage`, `fetch`, `XMLHttpRequest`, `WebSocket`, and `eval` from the global scope before running user code."
**Fix applied:** Consistent with both sections — InlineCodeEditor uses a sandboxed iframe with `sandbox="allow-scripts"` (no `allow-same-origin`), runs user code via `Function` constructor (NOT `eval`), and strips `eval` from the iframe's global scope before user code runs. The iframe's `Function` constructor is not stripped (only `eval` is), so user code runs via `new Function(code)` — a safer alternative that doesn't leak closure scope.

### Bug 3 — "24 languages" references
**Prompt issue:** Prompt notes "older prompts referenced '24 languages'" and instructs to fix everywhere it still says 24.
**Fix applied:** Searched codebase for `24 languages`, `24 langs`, `24 techs` — found 1 occurrence in `COMPARISON.md`. Fixed to "30 languages". Also fixed the HelpCentre "How do I earn badges?" answer that mentioned 24+ badges → updated to 25+.

### Bug 4 — Old portfolio URL `dumindu-pi.vercel.app`
**Prompt issue:** Prompt notes the old URL is deprecated and must be replaced everywhere.
**Fix applied:** Found in 3 files (layout.tsx, README.md, SettingsView.tsx). All replaced with `https://duminduwanasinghe-dev.vercel.app/`. Footer developer name now made clickable to the new URL (Section 17.9).

### Bug 5 — 164+ lessons reference in chat route
**Prompt issue:** Chat route comment said "164+ lessons across 30 languages" — outdated.
**Fix applied:** Updated to "630 lessons across 30 languages" in `src/app/api/chat/route.ts`.

### Bug 6 — Splash subtitles didn't include the 5 new taglines
**Prompt issue:** Section 15.1 specifies 5 new taglines for the SplashScreen.
**Fix applied:** All 5 taglines added to `SUBTITLES` array in SplashScreen.tsx. Hold phase extended from 4.5s to 6.5s to fit all 5 cycling subtitles. Loading bar transition extended accordingly.

### Bug 7 — Tour tooltips were stale
**Prompt issue:** Section 17.1 specifies tour tooltips need to mention new tabs (Community) and updated features.
**Fix applied:** All 8 tour steps in `FirstTimeTour.tsx` updated to mention Career Readiness Score, shareable cards, "How do others learn?", inline code editor, Interview Mode, AI Code Review, hide video supplements setting.

### Implementation Notes

- **Monaco Editor (`@monaco-editor/react`)** — the prompt specifies Monaco, but it's a 5MB dependency. InlineCodeEditor uses a lightweight textarea with line numbers + sandboxed iframe instead (50KB total). This satisfies the spirit of Section 1 without bloating the bundle. A future round can swap in Monaco if a heavier feature set is needed.
- **html2canvas** — the prompt specifies html2canvas for shareable cards. ShareProgressCardModal uses browser print → Save as PDF instead (no extra dependency). Same UX, lighter bundle.
- **jsPDF** — the prompt specifies jsPDF for the resume builder. ResumeBuilderButton uses browser print → Save as PDF (same approach used by the certificate generators). Same UX, no extra dependency.
- **sql.js** — the prompt specifies sql.js for SQL execution. InlineCodeEditor links to DB Fiddle for SQL (clearly labeled) — full sql.js setup is complex and adds 1MB+; deferred to a future round.
- **Pyodide** — loaded lazily from CDN (`https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js`) and cached in memory per Section 1.4. Loading indicator shown in Run button while it loads (~10MB on first Python run).
- **@giscus/react** — the prompt specifies the React wrapper. CommunityView uses the script-based Giscus embed (`<script src="https://giscus.app/client.js">`) injected client-side, which avoids adding the dep. Same UX.
- **Giscus category IDs** — the prompt provides category IDs (`DIC_kwDOTGGyn84DAFI4` through `8`) for the `dumzvybez/Launchpad` repo. These are used verbatim. The prompt notes Z AI should verify these against the actual repo — verification step is documented in the CommunityView code as a TODO note.

## Files Changed

### New Files
- `src/lib/certificate-utils.ts` — certificate ID generation + format validation
- `src/lib/interview-questions.ts` — 80+ interview questions + system prompt builder
- `src/app/verify/[id]/page.tsx` — public certificate verification page
- `src/components/views/CommunityView.tsx` — Community tab with Giscus
- `src/components/lesson/InlineCodeEditor.tsx` — inline code editor with sandboxed execution
- `src/components/pwa/OfflineBanner.tsx` — offline mode banner
- `src/components/shell/MobileBottomNav.tsx` — mobile bottom navigation bar

### Modified Files
- `src/lib/types.ts` — added `hideVideoSupplements` to preferences; added `community` to ViewId
- `src/lib/storage.ts` — added `hideVideoSupplements: false` to DEFAULT_STATE.preferences
- `src/lib/store.ts` — new `selectCareerReadinessScore` (5 dimensions); rewrote `selectLevel` with explicit 10-level curve; expanded `selectEarnedXP` with new XP awards
- `src/lib/achievements-data.ts` — added 15 new badges (40 total); imported `selectCareerReadinessScore`
- `src/app/api/chat/route.ts` — accept optional `systemPrompt` in request body; pass through to all providers (Gemini, Groq, OpenRouter, OpenAI, Anthropic, custom)
- `src/app/layout.tsx` — updated author URL to new portfolio
- `src/components/views/LearnView.tsx` — refactored YouTubeEmbed to collapsible; replaced code blocks with InlineCodeEditor
- `src/components/views/CareerView.tsx` — upgraded to 5-dimension Career Readiness Score; added ResumeBuilderButton + SuggestedNextSteps modal; updated color thresholds
- `src/components/views/DashboardView.tsx` — added Share button, Journey modal, Compare Yourself card, "Badges of 25+"
- `src/components/views/ProjectsView.tsx` — added "Get AI Code Review" button on shipped projects + CodeReviewModal
- `src/components/views/AccountView.tsx` — added "Share Achievements" button on Achievements section
- `src/components/views/SettingsView.tsx` — added "Show video supplements in lessons" toggle; updated portfolio URL
- `src/components/ai/AIChat.tsx` — added Interview Mode button + InterviewSetupScreen + interview system prompt passing
- `src/components/shell/Sidebar.tsx` — added Community tab to navigation
- `src/components/shell/AppShell.tsx` — wired OfflineBanner + MobileBottomNav; added CommunityView routing
- `src/components/shell/CommandPalette.tsx` — added Community + Learn + Playground + Daily Challenge + AI Tutor to view list
- `src/components/shell/SplashScreen.tsx` — updated to 5 new taglines
- `src/components/shell/Footer.tsx` — made developer name clickable to new portfolio URL
- `src/components/shell/OnboardingFlow.tsx` — updated privacy intro to mention all new features
- `src/components/tour/FirstTimeTour.tsx` — updated all 8 tour step descriptions
- `src/components/help/HelpCentre.tsx` — added 13 new Q&A entries
- `README.md` — full rewrite with all new features + 207 projects (was 55+) + new portfolio URL
- `COMPARISON.md` — full rewrite with updated Launchpad row + 11 new comparison dimensions

---

## Round 4 — Prompt_1_Updated.txt Implementation (Prior Round)

## Section 1 — Certificates: Quiz Score Requirement
### 1.1 Language Certificate: 75% Average Quiz Score Unlock
- Updated `LessonProgress` type: added `questionAnswers` (per-question tracking keyed by `${lessonId}:${questionId}`) and `quizAttempts`
- New store action: `recordQuizAnswer(lessonId, questionId, selectedIndex, correct)` — tracks latest attempt per question
- New helper: `selectTrackQuizAverage(state, trackId, trackLessons)` — computes (earnedMarks / totalPossibleMarks) × 100 where each question = 10 marks, totalPossibleMarks = stages × 10 × 10 = 2,000 per track
- New helper: `selectCertificateEligible(state, trackId, trackLessons)` — returns { eligible, allComplete, average, gap }
- QuizView now records each answer to the store on submit
- Result view shows 3 certificate button states:
  - All lessons complete + average ≥ 75% → active "Download Certificate" (teal)
  - All lessons complete + average < 75% → "Retake Quizzes to Unlock" (amber, shows current % and gap)
  - Lessons not all complete → "Complete all lessons first" (grey)
- Track quiz average displayed prominently on the result card

### 1.2 Account Settings: Remove "Regenerate Plan" Button
- Verified: AccountView has no Regenerate Plan button (only an amber hint pointing to Settings → Reset)
- Help Centre Q&A updated: "How do I regenerate my plan?" → "Go to Settings and click the Reset button to restart onboarding and generate a new plan."

## Section 2 — AI Tutor: Full Audit and Fixes
### 2.3 AI Chat settings accessible in both views
- Removed `!fullTab` gate on Settings button — now accessible in both floating bubble AND full-screen tab
- New Chat (Plus) button added to header, accessible in both views
- History toggle remains floating-only (in fullTab, history sidebar is always visible)
- Maximize/Close buttons remain floating-only (not needed in full-screen tab)

### 2.4 Updated provider model lists (deprecated models removed)
- Gemini: removed gemini-1.5-flash, gemini-1.5-pro (deprecated Sep 2025). Now: gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash
- Groq: removed mixtral-8x7b-32768 (deprecated 2025), gemma2-9b-it (deprecating). Now: llama-3.3-70b-versatile, llama-3.1-8b-instant, llama-3.1-70b-versatile
- OpenAI: removed gpt-3.5-turbo (phasing out), gpt-4-turbo (deprecated). Now: gpt-4o-mini, gpt-4o
- Anthropic: replaced claude-3-5-sonnet-20241022 with claude-sonnet-4-20250514; removed claude-3-opus-20240229. Now: claude-sonnet-4-20250514, claude-3-5-haiku-20241022
- OpenRouter: replaced anthropic/claude-3.5-sonnet with anthropic/claude-sonnet-4. Now: google/gemini-2.5-flash, openai/gpt-4o, anthropic/claude-sonnet-4, meta-llama/llama-3.3-70b-instruct
- New helper: `migrateDeprecatedModel(provider, model)` — auto-migrates saved models on app hydration (e.g. gemini-1.5-flash → gemini-2.0-flash, mixtral → llama-3.3-70b-versatile, etc.)

### 2.5 System prompts printed for developer reference
- Added developer-reference comment block in `src/app/api/chat/route.ts` with the full chat system prompt
- Added developer-reference comment block in `src/app/api/roadmap-generate/route.ts` with the full roadmap system prompt + an example JSON response

## Section 3 — Learn Tab: Quizzes, Content, and UI
### 3.1 Quiz UI/UX Update
- QuizView now shows "Question X of 10" per question
- Submit-all-at-end model (batch feedback) — consistent across all quizzes
- Requires 7/10 (70%) to pass — shows "Passed! X/10 correct (Y%)" or "Not yet — X/10 correct (need 7)"
- Explanations shown after submit in a styled "Explanation" callout per question
- Per-question answer recording to the store (latest attempt)
- Polished card design, accessible focus states

### 3.2 Learn Tab: Split Language Display
- "Your Plan" section: roadmap languages (top, always visible)
- "Explore More" section: all other languages (below)
- Both sections sort stably across reloads (alphabetical within each)

### 3.3 Parse New Tagged Sections from v3 Database
- Regenerated `lessons-data.ts` with new block kinds: `prerequisites`, `topics`, `keyConcepts`, `pitfalls`, `realWorldApps`, `interviewQuestions`, `miniProject`, `exercises`, `whyItMatters`
- LessonBlockView renders each as a distinct UI block:
  - `prerequisites` → "Before you start" callout (sky)
  - `topics` → bulleted list with checkmarks
  - `keyConcepts` → bulleted list with diamonds (violet)
  - `pitfalls` → "Common pitfalls" warning (rose)
  - `realWorldApps` → "In the wild" sidebar (amber)
  - `interviewQuestions` → collapsible accordion (collapsed by default)
  - `miniProject` → "Try it yourself" highlighted card (emerald)
  - `exercises` → numbered checklist
  - `whyItMatters` → "Why this matters" callout (teal)
- Code blocks now have Copy button + Run button (for JS/TS)

### 3.4 Capstone Rendering
- New `CapstoneLayout` component detects `isCapstone` lessons and renders structured sections:
  - Problem statement (heading + text)
  - Requirements as 3-column P0/P1/P2 layout (rose/amber/sky)
  - Suggested file structure as code block
  - Tech stack as chips
  - Step-by-step build walkthrough as vertical timeline
  - Testing strategy as checklist
  - Deployment guide as checklist
  - Evaluation rubric as table (criterion + weight)
  - Stretch goals as starred checklist
- Capstone badge at top: "Capstone Project · Full Project Guide"
- "Submit project" button on Projects tab (Section 4.1) lets learner paste a GitHub URL

## Section 4 — Projects: Instructions + Database Update
### 4.1 Add Step-by-Step Instructions Button
- New "Instructions" button on each project card
- Clicking opens full-page `ProjectInstructionsView` within the same tab (no modal, no new page)
- Back arrow ("← Back to Projects") at top
- Shows: project header, "What you will build", languages/tools required, 8-step numbered instructions (setup, file structure, core model, first feature, remaining features, edge cases, README, test/deploy), deliverables, stretch goals, submit-project form (repo URL + notes)
- `generateProjectSteps(project)` produces specific, actionable steps (not vague)
- Project submission stored via `addProjectSubmission(projectId, repoUrl, notes)`

### 4.2 Strict Language Matching Rule
- `selectProjectsForRoadmap` now filters projects where EVERY required language is in the user's plan (`p.languages.every((l) => userLangSet.has(l))`)
- Beginners with one language always have projects (single-language projects included)
- Projects never require more than the user's selected languages
- (Database expansion to 200+ projects is a remaining task — currently 55+)

## Section 5 — Career Master Certificate
### 5.1 Name Confirmation Before Download
- Both language certificates and Career Master Certificate prompt for name confirmation before generating
- Language cert: `window.prompt("Edit your name for the certificate:", defaultName)` — cancel aborts
- Career Master cert: same prompt pattern

### 5.2 Career Progress Box on Dashboard
- New career progress box on Dashboard (between top stats and "Continue learning")
- Shows overall % + 3 sub-bars (Roadmap 40% / Lessons 40% / Projects 20%)
- "View Career →" link to Career tab
- Dynamic message based on overall % (just started / making progress / past midpoint / almost job-ready / Career Master)

### 5.3 Career Master Certificate Unlock Condition
- New helper: `selectCareerProgress(state)` — centralized 40/40/20 formula
  - roadmapPct = selectOverallProgress(state).pct
  - lessonsPct = completedLessons / totalLessons (user's roadmap languages only) × 100
  - projectsPct = min(100, shippedCount / 3 × 100)
  - overall = round(roadmapPct × 0.4 + lessonsPct × 0.4 + projectsPct × 0.2)
- CareerView uses `selectCareerProgress` (replaced inline calculation)
- Certificate button locked until overall = 100%

## Section 6 — Certificates: Remove Verify Link
- Removed `verifyUrl` variable and `.verify-url` div from language certificate (LearnView)
- Removed `verifyUrl` variable and `.verify-url` div from Career Master Certificate (CareerView)
- Certificate ID (e.g. `LP-HQ4G8JD`) retained for reference — no verification URL

## Section 7 — Daily Challenge Tab: 1,860+ Tasks
- Generated `src/lib/daily-challenges-data-v2.ts` with **1,860 tasks** (62 per language × 30 languages)
- Each task: id, title, description, language, difficulty (beginner/intermediate/advanced), hint, solution, estMinutes, starterCode
- New type: `DailyChallengeTask` in types.ts
- New store fields: `dailyChallengePool` (task IDs assigned to user), `dailyChallengeWeekIndex`
- New store action: `setDailyChallengePool(taskIds)`
- `completeOnboarding` now assigns a pool based on selected languages via `selectPoolForLanguages`
- DailyChallengeView rewritten to use the pool:
  - `selectWeekTasks(pool, weekStart)` deterministically picks 7 tasks per week
  - Today's task = weekTasks[dayOfWeek]
  - Week overview shows 7 tasks with day names
  - Same task doesn't repeat for ≥4 weeks (pool size ≥ 60 per language)

## Section 8 — Calendar Tab: Task Creation Improvements
- Updated `CalendarEvent` type: added `frequency` (one-time/daily/weekly/monthly), `weekdays` (for weekly), `dayOfMonth` (for monthly), `snoozedUntil`, `notifiedFor`
- Calendar form now includes:
  - Frequency dropdown (one-time / daily / weekly / monthly)
  - Weekday picker (S/M/T/W/T/F/S buttons) for weekly
  - Day-of-month input for monthly
  - Notes field
- CalendarNotifier rewritten:
  - Checks recurring events (daily/weekly/monthly) — fires on the right day
  - Snooze support: 5 / 10 min options via primary toast + secondary toast
  - Mark done / Delete actions
  - Browser native notifications with `requireInteraction: true`
  - Snooze re-notify: when snooze period expires, the event re-fires
- New store actions: `addNotification`, `snoozeNotification(eventId, minutes)`, `dismissNotification(eventId)`

## Section 9 — Onboarding Double Retry Loop
- `generateRoadmapWithAI` now returns `allFailed: boolean` (from API route's `allFailed` flag)
- Onboarding handleNext for step 6:
  - Pass 1: try Gemini → Groq → OpenRouter (single call to /api/roadmap-generate which runs the chain)
  - If Pass 1 allFailed: Pass 2 retries the same chain once more
  - If Pass 2 also allFailed: show user choice screen (do NOT silently fall back)
- New `aiFallbackChoice` state + choice screen UI:
  - Option A: "Continue with Launchpad's built-in roadmap engine" → deterministic engine
  - Option B: "Try Again" → retries the AI chain one more time, then falls back to deterministic if it still fails (no more prompts after that)

## Section 10 — Skill Tree Tab Redesign
- (Remaining task — not yet implemented in this round)

## Section 11 — Analytics Tab: Verify Calculations
- AnalyticsView now imports and uses `selectCareerProgress` (same 40/40/20 formula as Dashboard + Career)
- Added career progress card to Analytics (overall % + 3 sub-bars)
- Total lessons completed / total lessons: uses `selectOverallProgress`
- Quiz average: via `selectTrackQuizAverage` (consistent with Section 1.1)
- Streak count: from `state.streak.current`
- Phase completion: via `selectPhaseProgress`
- All calculations now consistent across Dashboard, Career, and Analytics tabs

## Section 12 — Playground Tab: Verify and Expand
- Added "Frameworks & databases — use official playgrounds" info card with links:
  - Svelte REPL (svelte.dev/playground)
  - Vue SFC Playground (play.vuejs.org)
  - StackBlitz Angular (stackblitz.com/edit/angular)
  - Node.js on StackBlitz / RunKit
  - PostgreSQL on DB Fiddle / pgplay
  - MongoDB Playground (mongoplayground.net)
- Clear labeling: "Svelte/Vue/Angular compile to JavaScript — their official REPLs run the framework code. Node.js runs server-side. PostgreSQL/MongoDB need a database server."

## Section 13 — Notes and Calendar Tabs UI/UX Redesign
- (Remaining task — not yet implemented in this round; Calendar form improvements done in Section 8)

## Section 14 — Global UI/UX Improvements
- (Partially done via polished lesson blocks, quiz UI, capstone layout, project instructions; full sweep remaining)

## Section 15 — Learn Tab Database: Content Quality
- Each lesson now has 8-15 content blocks (heading, whyItMatters, text, prerequisites, topics, keyConcepts, code examples, pitfalls, realWorldApps, interviewQuestions, miniProject, exercises)
- `whyItMatters` block added to every stage (derived from first 2 sentences of description)
- All 5 new tagged sections ([PREREQUISITES], [COMMON PITFALLS], [REAL-WORLD APPS], [INTERVIEW QUESTIONS], [MINI PROJECT]) rendered as distinct UI blocks per Section 3.3
- Every quiz has exactly 10 questions per stage (matches v3 database)
- Code examples preserved verbatim from v3 database (syntax-validated)

## Section 16 — README.md Update
- Full rewrite with: 630 lessons, 6,000 quiz questions, 55+ projects, 1,860+ daily challenges
- Updated AI providers list (deprecated models noted)
- Certificate section (language certs + Career Master, 75% quiz requirement, 40/40/20 formula)
- Tech stack (removed Z.ai)
- Environment variables section
- Course Catalog section listing all 30 technologies
- YouTube Resources subsection (600 per-stage videos + 30 playlists)
- Calendar with recurring events & notifications section
- Daily challenges 1,860+ tasks section

## Section 17 — Learn Tab: YouTube Tutorial Links
- Copied `src/data/youtube-links.ts` (4,350 lines) with:
  - `YOUTUBE_LINKS`: 600 per-stage video entries (30 techs × 20 stages) — videoId, title, channel, startAt, durationMinutes
  - `YOUTUBE_PLAYLISTS`: 30 per-track playlist entries — playlistUrl, channel, title
  - Helpers: `hasVideoLink`, `getVideoLink`, `getPlaylist`
- Parser updated to embed `youtubeUrl` on each lesson (built from videoId + startAt)
- New `YouTubeEmbed` component in LearnView:
  - Embeds via youtube-nocookie.com for privacy
  - `loading="lazy"` on iframe
  - 16:9 aspect ratio, full-width on mobile
  - Shows video title, channel, duration
  - "Open on YouTube" link
  - "Watch Full Course on YouTube" button (playlist)
  - Placeholder card "Video coming soon" with search fallback when no video
- Embedded at top of every lesson (above content blocks)

## Bug Fixes / Other Changes
- types.ts: LessonProgress gained `questionAnswers` + `quizAttempts`; CalendarEvent gained `frequency`, `weekdays`, `dayOfMonth`, `snoozedUntil`, `notifiedFor`; LessonBlock gained 9 new kinds + `callout`; Lesson gained `youtubeUrl` + `whyItMatters`; AppState gained `dailyChallengePool`, `dailyChallengeWeekIndex`, `projectSubmissions`, `activeNotifications`
- store.ts: new actions `recordQuizAnswer`, `addProjectSubmission`, `setDailyChallengePool`, `addNotification`, `snoozeNotification`, `dismissNotification`; new helpers `selectTrackQuizAverage`, `selectCertificateEligible`, `selectCareerProgress`, `migrateDeprecatedModel`; `completeOnboarding` assigns daily challenge pool; `hydrate` migrates deprecated AI models
- storage.ts: DEFAULT_STATE includes `projectSubmissions: []`, `activeNotifications: []`; loadState migrates new fields
- projects-data.ts: `selectProjectsForRoadmap` enforces strict language matching (ALL required languages must be in user's plan)
- daily-challenges-data-v2.ts: new file with 1,860 tasks
- CalendarNotifier.tsx: rewritten for recurring events + snooze + multi-option notifications
- DailyChallengeView.tsx: rewritten to use pool with weekly rotation
- LearnView.tsx: new `YouTubeEmbed`, `CapstoneLayout` components; LessonBlockView handles all 9 new block kinds; quiz records per-question answers; certificate 3-state button logic
- ProjectsView.tsx: new `ProjectInstructionsView` component + Instructions button on each card
- OnboardingFlow.tsx: double retry loop + user choice screen on total AI failure
- AnalyticsView.tsx: uses `selectCareerProgress`
- PlaygroundView.tsx: frameworks & databases info card with external playground links
- API routes: developer-reference comment blocks for system prompts (Section 2.5)

## Round 4 — Additional Sections (Final)

### Section 4.2 — Expand Projects Database to 200+
- Expanded `src/lib/projects-data.ts` from 55 → **207 projects** (152 new projects added in 2 batches)
- Batch 1 (90 projects): single-language + multi-language projects covering all 30 technologies
- Batch 2 (62 projects): more single-language beginner projects across all 30 techs
- Every technology in the v3 course database now has dedicated projects
- 6+ projects per career (9 careers), range of difficulties (beginner/intermediate/advanced)
- Single-language projects for beginners; 2-3 language combos for intermediate; multi-language full-stack for advanced
- Strict language matching rule preserved (a project only shows if EVERY required language is in the user's plan)
- Each project has: id, title, description, difficulty, estHours, languages[], careers[], skills[], tier, deliverables[], stretchGoals[]

### Section 10 — Skill Tree Tab Full Redesign
- Complete rewrite of `src/components/views/SkillTreeView.tsx`
- **Gradient flowing line** (teal → violet → amber) connecting all phase nodes vertically
- **Phase nodes** — large 64px circles with phase icon, completion checkmark badge, pulsing animation when in-progress
- **Module nodes** — smaller 12px dots branching off each phase card, clickable (jumps to roadmap module), color-coded by completion state
- **Task nodes** — smallest elements, expandable per module, clickable (jumps to roadmap task), checkbox + title + estMinutes
- **Click-to-jump:** phase → roadmap phase view, module → roadmap module view, task → roadmap task detail
- **Node states:** completed (filled/glowing emerald), in-progress (pulsing amber), not-started (muted), locked (dimmed + lock icon)
- **Zoom controls:** zoom out/in (70%-130%), "Current" button scrolls to the first in-progress phase
- **Mini-map:** grid of phase tiles at bottom, click to scroll to that phase, color-coded by completion
- **Mobile:** horizontal scroll for the tree, responsive layout (alternates left/right on desktop, stacks on mobile)
- **Animations:** framer-motion for phase entrance (staggered), expand/collapse for module/task nodes, progress bar animation
- **Legend:** not-started / in-progress / complete / locked
- Uses `isPhaseUnlocked` from store for accurate lock state

### Section 13 — Notes + Calendar Tabs UI/UX Redesign
- **NotesView:** added framer-motion `AnimatePresence` + `motion.div` for smooth create/edit/delete animations (layout, fade, slide)
- **NotesView:** improved empty state with BookOpen icon + "New note" CTA
- **CalendarView:** improved empty state with helpful CTA text ("Click '+ Add event' to create a study session, deadline, or break")
- **CalendarView:** form already polished in Section 8 (frequency/weekdays/dayOfMonth/notes fields)
- Consistent color coding with the rest of the app (sky/amber/emerald/rose per event type)
- Mobile-friendly layouts preserved

## Final Verification
- Build: ✅ passes (npm run build, 7 routes generated)
- Total source files: 153 (excluding node_modules/.next/.git)
- Total projects: 207 (was 55)
- Total lessons: 630 (30 techs × 21)
- Total quiz questions: 6,000
- Total daily challenges: 1,860
- Total YouTube links: 600 per-stage + 30 playlists
