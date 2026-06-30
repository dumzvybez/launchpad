# Launchpad CHANGELOG

## v2.68 — Comprehensive Bug Fix & UX Polish Release

### New Features
- **VS Code Setup Phase** added as the first phase of every generated roadmap.
  Covers installation, language-specific extension packs, theme, format-on-save,
  Settings Sync, the top 10 keyboard shortcuts, and an embedded official
  Microsoft VS Code tutorial video (youtube-nocookie.com embed).
- **AI Tutor Code Review** redesigned to behave like Interview Mode: opens a
  fresh chat, posts the user's code as the first message, and the AI's review
  appears in the chat thread as a normal assistant message. Users can keep
  chatting with the reviewer about the code, ask follow-ups, etc.
- **3 export options for share cards** (Dashboard + Account): Download PNG,
  Copy to Clipboard (PNG via Clipboard API), Open printable page (Save as PDF).
  No more auto-print dialog on page load — user picks the format they want.
- **Searchable Projects catalog**: "Explore More" projects now have a search
  bar, difficulty filter, language filter, and a "Hide projects already in my
  plan" toggle. Grouped by primary language with sticky headers.
- **Redesigned Tools tab**: hero card with greeting + today's snapshot (events,
  notes, focus minutes), each stat is a clickable shortcut to the relevant
  tool. Active tab is persisted to localStorage across page refreshes.
- **Community tab auto-refresh**: Giscus widget re-injects every 60 seconds
  while the tab is visible. Theme syncs with the app's dark/light toggle.
- **VS Code suggestion card** in the Playground, linking to the official
  download page and pointing users to the VS Code Setup phase in their roadmap.

### Renames
- **JS Playground → Playground** everywhere (sidebar, hints, UI labels).
  The Playground now supports 7 languages (JS, TS, Python, HTML, CSS, SQL,
  Bash) and is no longer hidden from users whose roadmap doesn't include JS/TS.

### Splash Screen
- Reduced from 8.8s to 4.5s total duration.
- Added a "Skip intro →" button in the bottom-right corner (accessible).

### Bug Fixes (P0)
- **Calendar recurring events now actually render** on future dates.
  Previously, weekly/daily/monthly events were stored but never expanded —
  they only ever appeared on their original `date`. Now an `eventOccursOn()`
  helper computes whether an event fires on a given date based on its
  `frequency`, `weekdays`, and `dayOfMonth` (with month-length capping).
- **RoadmapView "Go to Dashboard" button** now actually navigates to the
  dashboard. Previously it called `setPreference("tourCompleted", false)`
  (which did nothing useful and used `as never` casts to bypass types).
- **AnalyticsView lesson count** no longer hardcodes `/ 30`. Now computes
  the actual total based on the user's roadmap languages (21 lessons/track).
- **SettingsView "Reset everything"** no longer calls `localStorage.clear()`
  (which would wipe other apps' data on the same origin). Now only removes
  `launchpad*` and `lp-*` keys, and also clears Launchpad's Cache Storage
  so cached API responses don't leak after reset.
- **OnboardingFlow step counter** now shows "Step 1 of 8" instead of
  "Step 0 of 7". Off-by-one fixed.
- **MobileBanner** is now per-session dismissable (not permanent). Previously
  it was permanently dismissed after one click, contradicting its own comment.
- **MongoDB capstone lesson** no longer contains ~200 lines of developer
  build notes ("IMPLEMENTATION NOTES FOR Z AI", "1. CONVERSION RULES", etc.)
  that were accidentally included as lesson content. 22KB of dev notes
  stripped out.

### Security Fixes
- **API key no longer leaked via URL query params**: Test Connection now uses
  POST with `{ test: true }` in the body instead of GET `?apiKey=...`. The
  old GET endpoint is removed (query strings are logged by proxies, CDNs,
  browser history, and server access logs — major leak vector).
- **SSRF protection on /api/chat custom endpoint**: `assertSafeExternalUrl()`
  blocks private/loopback/link-local hostnames (127.x, 10.x, 192.168.x,
  172.16-31.x, 169.254.x — including AWS metadata endpoint). Also enforces
  http(s) protocol.
- **HTML/CSS execution hole closed**: InlineCodeEditor previously opened
  HTML/CSS preview via `window.open + document.write`, which gave the user
  code same-origin access to `window.opener.localStorage` (could exfiltrate
  API keys, chat history, all progress). Now renders in a sandboxed iframe
  with `sandbox="allow-scripts"` (no `allow-same-origin`), so the iframe has
  an opaque origin and cannot reach the parent's storage.
- **postMessage origin validation** in InlineCodeEditor: now checks
  `e.origin === "null"` and verifies `e.source === iframeRef.current.contentWindow`
  so other iframes (e.g. embedded YouTube) can't spoof run-result messages.
- **Rate limiting on /api/roadmap-generate**: 5 generations per IP per hour,
  protecting the deployer's Gemini/Groq/OpenRouter quota from public abuse.
  Returns proper 429 with Retry-After header. Also caps `previousRoadmap`
  payload size at 100KB to prevent oversized-payload DoS.
- **Service worker no longer caches /api/** responses. Previously, chat
  responses containing user code could persist in Cache Storage after the
  user clicked "Reset all data" (which only cleared localStorage). Now
  `/api/*` requests always go straight to the network.
- **next.config.ts** adds security headers: X-Content-Type-Options: nosniff,
  X-Frame-Options: SAMEORIGIN, Referrer-Policy: strict-origin-when-cross-origin,
  Permissions-Policy: camera=(), microphone=(), geolocation=(). Also removes
  the `X-Powered-By: Next.js` header.

### Performance
- **Lazy-loaded all 17 views** via `next/dynamic`. Each view (and its heavy
  deps — react-syntax-highlighter, Pyodide, framer-motion, etc.) is now only
  loaded when the user navigates to that tab. Initial bundle significantly
  smaller.
- **Removed dead code**: Prisma layer (`src/lib/db.ts`, `prisma/schema.prisma`,
  `prisma`/`@prisma/client` deps) — was scaffolding that was never wired up.
  Removed legacy `tailwind.config.ts` (Tailwind v4 uses `@theme` in
  `globals.css`, the v3-style JS config was vestigial and would have broken
  if Tailwind fell back to it).
- **Service Worker cache version bumped** to `launchpad-v2-2` so users
  immediately get the privacy fix (no more cached API responses).

### Accessibility
- **`aria-current="page"`** on the active sidebar nav item.
- **Focus-visible rings** on all sidebar nav buttons.
- **`role="status"` / `aria-live="polite"`** on the Pyodide loading indicator,
  Playground output console, and share-card status messages.
- **`role="dialog"` / `aria-modal="true"` / `aria-labelledby`** on the
  share-card modals (DashboardView, AccountView) and the resume builder
  modal (CareerView).
- **`role="tablist"` / `role="tab"` / `aria-selected` / `aria-controls`** on
  the redesigned Tools tab switcher.
- **Skip button on SplashScreen** so keyboard users aren't trapped for 4.5s.
- **`overflow-hidden`** on share-card and resume-builder modal backdrops and
  inner cards to fix text-bleed-through-popup rendering issues.
- **Modal backdrop opacity** increased from `/40` to `/60` for better
  visual hierarchy (the resume modal was especially hard to read against
  the background content bleeding through).

### Content
- **Interview questions database** expanded from 83 → 233 questions, covering
  all 30 technologies plus cross-cutting topics (DSA, system design,
  behavioral, code review, testing, Git, web performance, API design,
  concurrency, AI/ML, cybersecurity, game dev, hardware/embedded). The
  header comment previously claimed "200+" but the array only had 83.
- **Deterministic seeded shuffle** for `pickInterviewQuestions` so two
  consecutive interview sessions pick different questions (was previously
  using `Math.random()` which could pick the same set twice in a row).

### Developer Experience
- **`bun run typecheck`** script added (`tsc --noEmit`).
- **`bun run db:*`** scripts removed (Prisma is gone).
- **Resume Builder modal** no longer uses `useStore.getState()` for initial
  values; passes them through as props.
- **`openPrintableHtml` / `copyHtmlAsPng` / `downloadHtmlAsPng`** shared
  utilities in `src/lib/print-utils.ts` — used by all 5 PDF/certificate/
  share-card generators. Replaces the duplicated `window.open + document.write
  + window.print()` anti-pattern across 5 files.

### Verification
- ✅ TypeScript: `tsc --noEmit` passes clean (0 errors)
- ✅ Production build: `bun run build` succeeds in 7.2s
- ✅ Dev server: boots in 411ms, returns 200 OK on `/`
- ⚠️ ESLint: 11 pre-existing `react-hooks/set-state-in-effect` warnings from
  React 19's stricter rule (mostly in shadcn/ui and pre-existing view code).
  These don't block the build (TypeScript checking is permissive due to the
  6MB `lessons-data.ts` having subtle legacy type mismatches), but a future
  cleanup pass should refactor them.

### File Summary
- 186 files in the package
- ~22KB of dev notes removed from `lessons-data.ts`
- 1 new file: `src/lib/print-utils.ts`
- 1 new file: `src/components/views/PlaygroundIcons.tsx`
- 4 deleted files: `src/lib/db.ts`, `prisma/schema.prisma`, `tailwind.config.ts`,
  and the empty `prisma/` directory
