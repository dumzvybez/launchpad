# Changelog

All notable changes to Launchpad are documented here. User-facing summaries
live in `src/lib/version-info.ts`; this file holds the technical record.

## [6.010.0] — 2026-07-25 — SEO, Visual Audit & UI/UX Refinement

A comprehensive refinement pass driven by a real visual audit (Agent Browser +
VLM at 1440px, 1024px, 768px, 390px, and 320px). No lesson content was modified.

### Fixed — SEO & Social Previews
- **OG image dimensions**: The OpenGraph image was 1734×907 but metadata declared
  1200×630, causing social platforms to mis-render or reject the preview card.
  Resized to the standard 1200×630 and optimized from 1.5 MB → 265 KB.
- **Inaccurate lesson counts**: All "630 lessons / 30 languages" references
  updated to the verified values (797 lessons / 38 languages & frameworks) in
  `layout.tsx`, `manifest.json`, and `CommandPalette.tsx`.
- Enriched JSON-LD `knowsAbout` with the full technology catalog.

### Changed — Reading-First Lesson Redesign (Part 4)
- Course outline is now **hidden by default**. A clear "Open course outline"
  toggle (PanelLeft icon) in the lesson header reveals a slide-in overlay panel
  (desktop) or bottom-sheet drawer (mobile) via `framer-motion` AnimatePresence.
- Removed the duplicate lesson title block (the first heading is now skipped
  when it matches the lesson title — UI-only dedup, no data change).
- Wider, centered reading column (`max-w-3xl xl:max-w-4xl`) — Apple/Stripe docs
  quality. Dedicated `LessonNavigation` prev/next component at the article end.
- Replaced low-contrast teal labels with emerald/foreground accents.

### Changed — Liquid Glass Readability (Part 5)
- Light mode: `--card` 0.55→0.72, `--popover` 0.75→0.94, `--glass-tint`
  0.68→0.78, `--glass-tint-strong` 0.82→0.93, `--muted-foreground` 0.40→0.44.
- Dark mode: `--card` 0.55→0.68, `--popover` 0.75→0.92, `--glass-tint`
  0.72→0.78, `--glass-tint-strong` 0.85→0.92.
- Result: dropdowns, tooltips, and modals are now near-opaque for WCAG-AA text
  contrast. Background no longer bleeds through content-bearing surfaces.

### Changed — Mobile UX (Part 7)
- `MobileBottomNav`: fixed, high-contrast glass bar with safe-area-inset-bottom
  support, ≥48px touch targets, solid active pill.
- `AITutorFloating`: repositioned to `bottom-[calc(env(safe-area-inset-bottom)+5.25rem)]`
  on mobile so the FAB clears the bottom nav. 56px FAB with pulse ring.
- `NotificationCentre`: bell button ≥44px on mobile; panel renders as a
  bottom sheet respecting safe-area. Dismiss buttons always visible on touch.
- `FirstVisitHints`: keyboard shortcut hints (`⌘K`) wrapped in `hidden sm:inline-flex`.
- `VersionUpdateDialog`: bottom-sheet positioning on mobile, ≥44px close button.
- `OnboardingFlow`: full-screen card on mobile, `text-base` inputs (prevents iOS
  auto-zoom), ≥44px touch targets, wrapping progress dots.
- `CommandPalette`: full-screen sheet on mobile, ≥48px command rows.

### Changed — Dashboard & Shell Polish (Part 6)
- `DashboardView`: welcome header hierarchy (name primary, streak secondary),
  stats row `grid-cols-2 lg:grid-cols-4` with baseline-aligned cards,
  `line-clamp-2`/`truncate` on all descriptions, `min-w-0` flex children.
- `CareerReadinessCard`: 0% / empty state uses `text-muted-foreground` instead
  of alarming pink. More breathing room between the percentage and sub-metrics.
- `TopBar`: search placeholder shortened to "Search…", ≥44px touch targets.
- `Sidebar`: removed redundant active-state dot (kept background highlight),
  nav item padding `py-1.5→py-2`.
- `Footer`: iOS safe-area bottom padding, ≥36px mobile touch targets.
- `ProjectsView`: visual polish (borders, spacing, responsive inputs).

### Fixed — React Warning
- `AppShell.tsx`: moved `window.history.replaceState("/onboarding")` from the
  render body into a `useEffect` (placed before all early returns to satisfy
  the Rules of Hooks). Eliminates "Cannot update a component while rendering
  a different component" console warning.

### Added — Documentation
- README.md: corrected statistics (232 interview questions, 7,221 quiz
  questions), added a Preview section with 4 optimized screenshots, added
  v6.010 changelog entry, bumped version badge to 6.010.0.
- `docs/screenshots/`: dashboard, lesson-view, lesson-outline, mobile-dashboard.

## [6.009.0] — 2026-07-24 — Mobile UX Redesign

A complete mobile-first UI/UX pass. All 5 standard phone viewport widths
(320px, 375px, 390px, 414px, 430px) have zero horizontal overflow. No lesson
content was modified.

### Fixed — Notification Center (critical)
- **Root cause found**: The notification panel was positioned `absolute right-0`
  inside the sticky header, which has `backdrop-filter: blur(40px)`. A
  `backdrop-filter` on an ancestor creates a containing block for `position:
  fixed` descendants, so the panel's `fixed` positioning was relative to the
  header, not the viewport — causing it to be clipped off-screen on mobile.
- **Fix**: Rendered the panel via `createPortal(..., document.body)` to escape
  the header's containing block. Mobile now uses `fixed bottom-0 left-0
  right-0` (full-width bottom sheet with drag handle). Desktop keeps the
  anchored dropdown via `lg:absolute lg:right-0`.

### Added — Mobile Course Outline Drawer
- New "Outline" button in the lesson breadcrumb area (mobile only, `lg:hidden`)
  opens a bottom sheet with the full track lesson list — same `LessonSidebar`
  component as desktop, in a touch-friendly drawer. Closes on lesson selection
  or overlay tap.

### Fixed — Top Bar Overflow
- **320px overflow eliminated**: Added `overflow-x: hidden` to `html` element
  (was only on `body`). The aurora background blobs could extend past the
  viewport despite `body` overflow hidden.
- Decluttered mobile top bar: fullscreen toggle and theme toggle hidden on
  mobile (`hidden sm:flex` / `hidden sm:block`), accessible via Settings.
  Only essential buttons remain: hamburger, title, search, notifications,
  profile.
- Reduced gap and padding on mobile (`gap-1 px-2` vs `gap-2 px-4`).

### Fixed — Keyboard Hints on Mobile
- `FirstVisitHints` Command Palette tip (`Ctrl+K`) now `hidden lg:flex` —
  only shows on desktop where keyboards exist.
- Top bar search bar `⌘K` kbd hint now `hidden lg:inline-flex`.
- Sidebar `⌘K` hint already desktop-only (`lg:block`).

### Improved — AI Tutor Floating Window
- Mobile: full-screen panel (`inset-x-0 bottom-0 top-16`) instead of cramped
  380px box. Rounded top corners (`rounded-t-2xl`).
- Bubble: smaller on mobile (`h-12 w-12` vs `h-14 w-14`), respects iOS
  safe-area via `env(safe-area-inset-bottom)`.
- Desktop: unchanged (380px anchored panel at `bottom-6 right-6`).

### Improved — Version Update Toast
- Mobile: full-width with margins (`left-4 right-4 sm:left-auto`) instead of
  `max-w-sm` which could overflow at 320px.
- Desktop: unchanged (`sm:max-w-sm`).

### Improved — Achievement Badge Toasts
- Mobile: full-width (`w-full sm:min-w-[280px]`), smaller icon
  (`h-10 w-10 sm:h-12`), tighter padding (`p-3 sm:p-4`).
- Container: `left-4 right-4 sm:left-auto` on mobile for full-width toasts.

### Files Changed
- `src/app/globals.css` — `html` overflow-x hidden
- `src/components/shell/NotificationCentre.tsx` — portal + bottom sheet
- `src/components/shell/TopBar.tsx` — decluttered mobile buttons
- `src/components/shell/FirstVisitHints.tsx` — hide Ctrl+K tip on mobile
- `src/components/views/LearnView.tsx` — mobile outline drawer + createPortal
- `src/components/ai/AITutorFloating.tsx` — full-screen mobile chat
- `src/components/shell/VersionUpdateDialog.tsx` — mobile toast width
- `src/components/achievements/BadgeToastContainer.tsx` — mobile toast sizing
- `src/lib/version-info.ts` — v6.009.0 release entry
- `src/app/api/route.ts` — health endpoint version
- `package.json` — version bump
- `CHANGELOG.md` — this entry

### Verification
- TypeScript: 0 errors
- Build: passes (TypeScript validation active)
- Tests: 70/70 pass
- Browser: verified at 320px, 375px, 390px, 414px, 430px — zero horizontal
  overflow at all sizes
- Console: no new errors on fresh load
- Content: all 797 lesson .md files unmodified

---

## [6.008.0] — 2026-07-23 — Professional UI Redesign

A complete UI/UX refinement pass to make Launchpad feel like a polished,
premium learning platform. No lesson content was modified.

### Added
- **Collapsible lesson sidebar** (`src/components/learning/LessonSidebar.tsx`):
  completely redesigned with a proper collapsed state — a 48px icon rail with
  vertical progress indicator and current-lesson counter. The collapse state
  persists in localStorage (`launchpad:lesson-sidebar-collapsed`). Expand
  button uses `PanelLeftOpen`/`PanelLeftClose` icons with clear tooltips.

### Improved — Lesson Reading Experience
- **Documentation-style block rendering** (`LessonBlockView` in `LearnView.tsx`):
  removed all `glass-flat rounded-xl p-3` boxes from content blocks. Sections
  now use clean typography (uppercase tracking-wide labels, left accent borders
  for callouts only). Text is `text-[15px] leading-7` for comfortable reading.
  Headings are `text-xl font-bold tracking-tight`. Content spacing increased
  to `space-y-6`.
- **Clean lesson header** (`LearnView.tsx`): removed `GlassCard` wrapper.
  Header is now pure typography — `h1` + description + metadata pill row
  (difficulty, time, completion status) with a bottom border separator.

### Improved — Dashboard
- Tightened spacing (`space-y-5` → `space-y-4`, hero `text-2xl` → `text-xl`)
  so the hero + stats + continue cards fit in the first viewport on desktop.
- StatCard padding tightened (`p-4` → `p-3.5`), value size (`text-2xl` →
  `text-xl`) with `tabular-nums` for alignment.

### Fixed — Glass Readability
- **Onboarding dropdowns** (`OnboardingFlow.tsx`): replaced all `bg-card/60`
  (60% opacity) with `bg-card` (solid) for career/occupation selectors and
  search inputs. `bg-card/30` → `bg-card/70`, `bg-card/50` → `bg-card/80`.
  Added `backdrop-blur-xl` to dropdown containers.
- All project URLs updated: `launchpad--dev.vercel.app` → `launchpadedu.vercel.app`,
  `duminduwanasinghe-dev.vercel.app` → `dumindu.vercel.app`,
  `dumzvybez/Launchpad` → `dumzvybez/launchpad` (repo URL casing).

### Files Changed
- `src/components/learning/LessonSidebar.tsx` — complete rewrite (collapsible)
- `src/components/views/LearnView.tsx` — doc-style blocks, clean header, PlayCircle import
- `src/components/views/DashboardView.tsx` — tightened spacing + StatCard
- `src/components/shell/OnboardingFlow.tsx` — glass opacity fixes
- `src/lib/version-info.ts` — v6.008.0 release entry
- `src/app/api/route.ts` — health endpoint version
- `package.json` — version bump
- `README.md` — professional rewrite with actual stats + new URLs
- `CHANGELOG.md` — this entry
- All `src/**/*.{ts,tsx}` — URL replacements (20+ files)

### Verification
- TypeScript: 0 errors
- Build: passes (TypeScript validation active)
- Tests: 70/70 pass
- Browser: verified at 1440px (desktop) and 900px (tablet) — no layout breakage
- Console: no new errors
- Content: all 797 lesson .md files unmodified (checksum verified)

---

## [6.007.0] — 2026-07-23 — Desktop & Tablet UX Improvements

A focused UX improvement pass for desktop (1280px+, 1440px+) and tablet
(768–1279px). Mobile is unchanged and will be addressed in a future phase.
No lesson content was modified.

### Added
- **LessonSidebar component** (`src/components/learning/LessonSidebar.tsx`):
  a sticky sidebar shown alongside lesson content on desktop (≥1024px).
  Shows every lesson in the track with completion checkmarks, current-lesson
  highlight, difficulty color dots, estimated time, quiz-question count, and
  best quiz scores. Directly answers "Where am I? What's next? How far have
  I come?" without navigating back to the track list.
- **Dashboard "Continue your lesson" card**: a one-click re-entry point to
  the learner's most recent in-progress (or next-up) lesson. Prioritizes
  lessons explicitly marked "in-progress", then falls back to the first
  not-complete lesson in the first roadmap language that has progress.
  Includes lesson icon, track name, title, difficulty, time, and a Resume
  button.
- **`.scrollbar-thin` CSS utility**: a 6px-wide scrollbar variant for
  compact scroll areas (used by the lesson sidebar).

### Improved
- **Glass surface clarity**: increased glass tint opacity in both themes
  (dark: 0.55→0.72, light: 0.55→0.68) and strengthened borders (dark:
  0.16→0.22, light: 0.6→0.65) so text reads cleanly without the aurora
  background bleeding through. The glass still feels translucent — just
  more legible.
- **Lesson reading width**: lesson content is now constrained to
  `max-w-3xl` (48rem / 768px) inside the new two-column layout, instead of
  stretching across the full `max-w-7xl` container. This gives a
  comfortable reading column comparable to Coursera/Codecademy lesson pages.
- **Main content width**: the app's main content container is now
  `max-w-7xl` (80rem / 1280px) instead of `max-w-6xl` (72rem / 1152px), so
  1440px+ desktop screens use the horizontal space better for dashboards
  and grids.

### Layout
- **Lesson view two-column layout** (`LearnView.tsx`): on `lg+` (≥1024px)
  the lesson view is now a CSS grid `[300px_minmax(0,1fr)]` with the
  sticky sidebar on the left and the constrained lesson content on the
  right. Below `lg` the sidebar is hidden and the existing breadcrumb +
  prev/next buttons serve navigation (no mobile regression).

### Files Changed
- `src/app/globals.css` — glass token opacity/border increases; scrollbar-thin utility
- `src/components/learning/LessonSidebar.tsx` — new component
- `src/components/learning/index.ts` — export LessonSidebar
- `src/components/views/LearnView.tsx` — two-column layout + sidebar integration
- `src/components/views/DashboardView.tsx` — continue-lesson card + imports
- `src/components/shell/AppShell.tsx` — max-w-6xl → max-w-7xl
- `src/lib/version-info.ts` — v6.007.0 release entry
- `src/app/api/route.ts` — health endpoint version
- `package.json` — version bump

### Verification
- TypeScript: 0 errors
- Build: passes (TypeScript validation active, no `ignoreBuildErrors`)
- Tests: 70/70 pass
- Browser: verified at 1440px (desktop), 1024px (tablet landscape), 900px
  (tablet portrait) — no layout breakage, sidebar shows/hides correctly
- Console: no new errors
- Content: all 797 lesson .md files unmodified (checksum verified)

---

## [6.006.0] — 2026-07-23 — Stabilization

See `src/lib/version-info.ts` for the user-facing summary. Technical highlights:
- Removed 11 MB of dead content bundles (`lessons-content.ts`, `lessons-extended.ts`)
- Removed unused Prisma setup (dependencies, `db.ts`, scripts)
- Rewrote `gen-lesson-meta.ts` to read from Markdown frontmatter
- Removed `typescript.ignoreBuildErrors` — all 11 type errors fixed
- Added Vitest test suite (70 tests across 4 files)
- Fixed stale documentation (content README, daily challenge counts, API version, Career Readiness formula)
