---
slug: vue-capstone-project
id: vue-capstone
track: vue
order: 21
title: "Capstone Project: Teams collaborating on small projects often lack a..."
description: |-
  Teams collaborating on small projects often lack a fast, real-time
    kanban board that does not require per-user licenses and that they
    can self-host or run on the free tier of a static host. Existing
    tools (Trello, Jira) are heavy, expensive at scale, and lock the
    user's data in proprietary f
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Capstone Project: Teams collaborating on small projects often lack a...

## Teams collaborating on small projects often lack a...

Problem statement:
Teams collaborating on small projects often lack a fast, real-time
  kanban board that does not require per-user licenses and that they
  can self-host or run on the free tier of a static host. Existing
  tools (Trello, Jira) are heavy, expensive at scale, and lock the
  user's data in proprietary formats. In this capstone you will build
  "VueBoard", a real-time collaborative kanban board using Vue 3.4
  with the Composition API, Pinia for state, Vue Router for pages,
  Vue Test Utils + Vitest for tests, Playwright for E2E, and a small
  Node + WebSocket backend. The web client deploys to Vercel; the
  backend deploys to Fly.io. The finished product supports multiple
  boards, drag-and-drop cards across columns, optimistic updates,
  live presence (active users per board), and offline-friendly
  persistence via localStorage. This capstone exercises every concept
  from the 20-stage track: SFCs, reactivity, computed/watchers,
  components/props/slots, provide/inject, composables, router,
  Pinia, transitions, testing, and deployment.

Target users:
• Small engineering teams (2-10 people) needing a lightweight
• kanban board for sprint planning.
• Open-source maintainers tracking issues across columns.
• Solo developers who want a fast, offline-capable personal board.
• Educators running project-based courses who need a shared board
• per student team.

P0 (Must have) requirements:
• User can sign up, log in, log out (email + password, JWT).
• User can create, rename, archive, and delete boards.
• A board has a default set of columns (Todo, In Progress, Done)
• and supports adding/renaming/deleting columns.
• A card has a title, description, optional label, and can be
• created, edited, moved across columns (drag-and-drop), and
• deleted.
• Card moves sync to all connected clients in real time via
• WebSocket.
• Optimistic updates on card move with rollback on failure.
• Active users (presence) shown per board as avatars.
• Dark/light theme toggle persisted to localStorage.
• Search/filter cards by title within a board.
• Fully responsive UI down to mobile (375px width).

P1 (Should have) requirements:
• Card labels with color picker.
• Card due dates with overdue highlighting.
• Board activity feed (last 20 events).
• Toast notifications for errors and successes.
• Empty, loading, and error states on every async surface.
• Keyboard-accessible drag-and-drop (Space to pick up, arrows to
• move, Space to drop).

P2 (Nice to have) requirements:
• Card assignees with @mention notifications.
• Markdown rendering in card descriptions.
• Drag-and-drop file upload for card attachments to S3.
• PWA install with offline draft caching.
• End-to-end encryption of card contents at rest.
• Per-card comment threads with @mentions.

Tech stack:
• Vue 3.4+ with <script setup> and TypeScript (strict).
• Vite 5 as the SPA bundler/dev server.
• Vue Router 4 (HTML5 history mode) for navigation.
• Pinia for client state (auth, board, UI); persistedstate plugin
• for theme + offline drafts.
• @vueuse/core for composable utilities (useStorage, useDebounce).
• vuedraggable-next (SortableJS) for drag-and-drop with keyboard
• accessibility via a custom wrapper.
• Tailwind CSS 3 (JIT) with CSS variables for theming.
• Zod for runtime validation, shared between web and server.
• Vue Test Utils + Vitest for unit and component tests.
• @testing-library/vue for behavior-focused tests.
• Playwright for E2E (Chromium, Firefox, WebKit).
• vue-i18n for English-only UI (with hooks for future localization).
• Node 20 + Express (or Hono) for the API; ws for WebSockets.
• Drizzle ORM + Postgres (Neon free tier) or SQLite on a persistent
• volume for the capstone.
• Sentry for error reporting; web-vitals for performance.
• GitHub Actions for CI; Vercel for the web deploy; Fly.io for the
• API and Postgres.

> **Tip:** Testing strategy:
> - Unit tests (Vitest) for every Pinia action, every `api.ts`
>     function (mocking fetch), and every composable; target 80% line
>     coverage on `lib/`, `stores/`, and `composables/`.
>   - Component tests (Vue Test Utils + @testing-library/vue) for
>     `Board`, `Column`, `Card`, `CardEditor`, `BoardCreate`, and
>     `Avatar` — using a `createTestingPinia()` and a `BoardProvider`
>     wrapper. Assert via `getByRole` and `findBy*` for async
>     (optimistic updates rolling back).
>   - Composable tests via a host component (`defineComponent` whose
>     setup calls the composable) for `useBoard`, `useOptimisticMove`,
>     `usePresence`, and `useLocalStorage`.
>   - E2E tests (Playwright) covering: signup, login, board creation,
>     card creation, drag-across-columns, reload-and-verify, and the
>     WebSocket live-update flow (two browser contexts on the same
>     board).
>   - Accessibility audits: `@axe-core/playwright` runs in the E2E
>     suite and fails on critical violations; Lighthouse CI enforces
>     a11y >= 95.
>   - Coverage target: >=80% lines and >=70% branches on
>     `apps/web/src` and `apps/server/src`; enforce via `vitest run
>     --coverage` in CI.

> **Tip:** Deployment guide:
> - Deploy `apps/web` to Vercel (free Hobby tier sufficient for the
>     capstone) connected to your GitHub repo; every PR gets a unique
>     preview URL automatically. Set the build command to `pnpm
>     --filter web build` and the output directory to `apps/web/dist`.
>   - Deploy `apps/server` to Fly.io's free tier with a managed
>     Postgres (Neon free tier) or stick with SQLite on a persistent
>     volume for the capstone. Use a `node:20-alpine` Docker image
>     with `node dist/index.js` as the start command.
>   - Required environment variables:
>       web: VITE_API_URL, VITE_WS_URL, VITE_SENTRY_DSN.
>       server: DATABASE_URL, JWT_SECRET (>=32 chars), PORT,
>               CORS_ORIGIN=https://<your-vercel-app>.vercel.app,
>               SENTRY_DSN.
>   - Build commands:
>       web: `pnpm --filter web build` (runs `vue-tsc --noEmit`
>            then `vite build`).
>       server: `pnpm --filter server build` (runs `tsc` then
>               copies `dist/` into a slim Docker image).
>   - Start commands:
>       web: Vercel serves the static `dist/` from its CDN; configure
>            a SPA fallback rewrite (`vercel.json` with
>            `rewrites: [{ source: "/(.*)", destination: "/" }]`).
>       server: `node dist/index.js` inside the Docker image on
>               Fly.io.
>   - Post-deploy verification: `curl https://<api>/health` returns
>     `{"ok":true}`; visit the Vercel preview, sign up, create a board,
>     add a card, move it across columns, open a second browser
>     session (incognito), navigate to the same board, and confirm
>     the first session's card move appears live. Run the Playwright
>     E2E suite against the deployed preview URL.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Architecture & Type Safety (20 pts) — End-to-end TypeScript
>      with no `any` (CI-enforced via `vue-tsc --noEmit`); shared
>      Zod schemas are the single source of truth for API, client,
>      and forms; clean separation of pages, components, composables,
>      stores, and lib.
>   2. Real-time & State Management (20 pts) — WebSocket updates
>      propagate to all clients without duplicate broadcasts; Pinia
>      stores combine cleanly; optimistic card moves roll back on
>      failure; presence avatars update live.
>   3. UX & Accessibility (20 pts) — Drag-and-drop is keyboard
>      accessible; axe-core reports zero critical violations;
>      loading/empty/error states on every async surface; responsive
>      down to 375px; Lighthouse a11y >= 95.
>   4. Testing (20 pts) — >=80% line coverage on `lib/`, `stores/`,
>      `composables/`; component tests use `getByRole` and
>      `findBy*`; one Playwright E2E exercises the full live-update
>      flow across two browser contexts.
>   5. Production Readiness (20 pts) — CI runs lint, typecheck, test,
>      build, e2e in parallel; Sentry captures errors with component
>      stacks; Web Vitals reported; Vercel preview deploys per PR;
>      bundle-size budget enforced via Lighthouse CI.
> 
> Stretch goals:
>   - Add card labels with a color picker and filter-by-label.
>   - Render card descriptions as markdown with `markdown-it`.
>   - Implement drag-and-drop file uploads to an S3-compatible store.
>   - Add email notifications on @mentions via Resend or Postmark.
>   - Make the app installable as a PWA with offline draft caching via
>     a Service Worker and IndexedDB.
>   - End-to-end encrypt card contents at rest using the Web Crypto
>     API with per-board keys.
>   - Add a `tRPC` router alongside the REST API and benchmark the
>     DX and bundle-size differences.
>   - Replace Express with Hono and deploy the API to Cloudflare
>     Workers for sub-50ms global latency.
>   - Implement a presence cursor showing each viewer's mouse position
>     on the board in real time.
>   - Add property-based tests with `fast-check` for the optimistic
>     move/rollback state machine.
>   - Add a `defineAsyncComponent`-based settings panel that lazy-
>     loads only when the user opens Settings.
>   - Implement per-card comment threads with @mentions and unread
>     indicators via WebSocket events.

> **Tip:** Stretch goals:
> • Add card labels with a color picker and filter-by-label.
> • Render card descriptions as markdown with `markdown-it`.
> • Implement drag-and-drop file uploads to an S3-compatible store.
> • Add email notifications on @mentions via Resend or Postmark.
> • Make the app installable as a PWA with offline draft caching via
> • a Service Worker and IndexedDB.
> • End-to-end encrypt card contents at rest using the Web Crypto
> • API with per-board keys.
> • Add a `tRPC` router alongside the REST API and benchmark the
> • DX and bundle-size differences.
> • Replace Express with Hono and deploy the API to Cloudflare
> • Workers for sub-50ms global latency.
> • Implement a presence cursor showing each viewer's mouse position
> • on the board in real time.
> • Add property-based tests with `fast-check` for the optimistic
> • move/rollback state machine.
> • Add a `defineAsyncComponent`-based settings panel that lazy-
> • loads only when the user opens Settings.
> • Implement per-card comment threads with @mentions and unread
> • indicators via WebSocket events.

