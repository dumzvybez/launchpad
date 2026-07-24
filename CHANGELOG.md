# Changelog

All notable changes to Launchpad are documented here. User-facing summaries
live in `src/lib/version-info.ts`; this file holds the technical record.

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
