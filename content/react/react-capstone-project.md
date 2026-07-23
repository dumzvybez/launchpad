---
slug: react-capstone-project
id: react-capstone
track: react
order: 21
title: "Capstone Project: Collaborative task boards (Trello, Linear, Notion) are the..."
description: |-
  Collaborative task boards (Trello, Linear, Notion) are the backbone of
    modern product teams, but most tutorials stop at a static todo list.
    This capstone builds a production-grade collaborative task board called
    "Boardhouse" where multiple users can create boards, columns, and
    cards; drag ca
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Capstone Project: Collaborative task boards (Trello, Linear, Notion) are the...

## Collaborative task boards (Trello, Linear, Notion) are the...

Problem statement:
Collaborative task boards (Trello, Linear, Notion) are the backbone of
  modern product teams, but most tutorials stop at a static todo list.
  This capstone builds a production-grade collaborative task board called
  "Boardhouse" where multiple users can create boards, columns, and
  cards; drag cards between columns in real time; leave comments; and
  receive live updates from other users via WebSockets. The project
  exercises every concept from the 20-stage track: typed components,
  hooks, context, reducers, optimistic UI, virtualization, error
  boundaries, Suspense, React Hook Form + Zod, Zustand, Tailwind,
  Vitest + RTL, Playwright E2E, and a CI/CD pipeline that auto-deploys
  to Vercel. By the end you will have shipped a real, observable,
  tested React app you can put on a resume.

Target users:
• Product managers who need a lightweight board for sprint planning.
• Engineering teams who want real-time visibility into task status.
• Solo founders who want a personal kanban with offline-friendly UX.
• Open-source maintainers tracking issues across multiple repos.

P0 (Must have) requirements:
• User authentication (email/password) with JWT sessions.
• Boards CRUD: create, rename, archive; one board per URL.
• Columns CRUD within a board; reorder via drag-and-drop.
• Cards CRUD within a column; drag across columns.
• Real-time updates via WebSocket: card moves, additions, deletes.
• Optimistic UI for card moves with rollback on failure.
• TypeScript end-to-end; no `any` allowed.
• React Hook Form + Zod for all forms (board create, card edit).
• Error boundary per board section (columns, activity feed).
• Loading and empty states for every async surface.
• Keyboard accessibility for all interactive elements.

P1 (Should have) requirements:
• Comments on cards with optimistic add.
• User presence (avatars of who's viewing the board).
• Search/filter cards across the board.
• Dark mode toggle persisted to localStorage.
• Virtualized card list when a column exceeds 100 cards.
• Activity feed showing recent board changes.
• Toast notifications for errors and successes.

P2 (Nice to have) requirements:
• Card labels, due dates, and assignees.
• Markdown rendering in card descriptions.
• Drag-and-drop file upload for card attachments.
• Email notifications on @mentions.
• PWA install with offline draft caching.
• End-to-end encryption of card contents at rest.

Tech stack:
• React 18 + TypeScript 5 (strict, noUncheckedIndexedAccess).
• Vite 5 for the SPA bundler/dev server.
• React Router 6 (data router) for navigation.
• Zustand for client state (boards cache, UI state).
• TanStack Query for server state (boards, cards, comments).
• React Hook Form + Zod for all forms; `zodResolver` bridge.
• Tailwind CSS 3 with JIT; CSS variables for theming.
• `@dnd-kit/core` for accessible drag-and-drop.
• `@tanstack/react-virtual` for virtualized long columns.
• WebSockets via `ws` on the server; native `WebSocket` in the client.
• React Testing Library + Vitest for component tests.
• Playwright for E2E.
• Sentry for error reporting; `web-vitals` for performance.
• GitHub Actions for CI; Vercel for the web deploy; Fly.io for the API.

> **Tip:** Testing strategy:
> - Unit tests (Vitest) for every Zustand action, every `api.ts`
>     function (mocking fetch), and every reducer; target 80% line
>     coverage on `lib/`, `stores/`, and `hooks/`.
>   - Component tests (RTL + `userEvent`) for `Board`, `Column`, `Card`,
>     `CardEditor`, `BoardCreate` — using `QueryClientProvider` and a
>     `BoardProvider` wrapper. Assert via `getByRole` and `findBy*` for
>     async (optimistic updates rolling back).
>   - Hook tests via `renderHook` + `act` for `useBoard`,
>     `useOptimisticMove`, and `usePresence`.
>   - E2E tests (Playwright) covering: signup, board creation, card
>     creation, drag-across-columns, reload-and-verify, and the
>     WebSocket live-update flow (two browser contexts).
>   - Accessibility audits: `@axe-core/playwright` runs in the E2E
>     suite and fails on critical violations; Lighthouse CI enforces
>     a11y >= 95.
>   - Coverage target: >=80% lines and >=70% branches on `apps/web/src`
>     and `apps/server/src`; enforce via `vitest run --coverage` in CI.

> **Tip:** Deployment guide:
> - Deploy `apps/web` to Vercel (free Hobby tier sufficient for the
>     capstone) connected to your GitHub repo; every PR gets a unique
>     preview URL automatically.
>   - Deploy `apps/server` to Fly.io's free tier with a managed
>     Postgres (or stick with SQLite on a persistent volume for the
>     capstone).
>   - Required environment variables:
>       web: `VITE_API_URL`, `VITE_WS_URL`, `VITE_SENTRY_DSN`.
>       server: `DATABASE_URL`, `JWT_SECRET` (>=32 chars), `PORT`,
>               `CORS_ORIGIN=https://<your-vercel-app>.vercel.app`,
>               `SENTRY_DSN`.
>   - Build commands:
>       web: `pnpm --filter web build` (runs `tsc --noEmit` then
>            `vite build`).
>       server: `pnpm --filter server build` (runs `tsc` then copies
>               `dist/` into a slim Docker image).
>   - Start commands:
>       web: Vercel serves the static `dist/` from its CDN.
>       server: `node dist/index.js` inside a `node:20-alpine` image
>               on Fly.io.
>   - Post-deploy verification: `curl https://<api>/health` returns
>     `{"ok":true}`; visit the Vercel preview, sign up, create a board,
>     add a card, open a second browser session, move the card, and
>     confirm the first session updates live.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Architecture & Type Safety (20 pts) — End-to-end TypeScript
>      with no `any` (CI-enforced); shared Zod schemas are the single
>      source of truth for API, client, and forms; clean separation of
>      components, hooks, stores, and lib.
>   2. Real-time & State Management (20 pts) — WebSocket updates
>      propagate to all clients without duplicate subscriptions;
>      Zustand + TanStack Query combine cleanly; optimistic card moves
>      roll back on failure.
>   3. UX & Accessibility (20 pts) — Drag-and-drop is keyboard
>      accessible via `@dnd-kit`; axe-core reports zero critical
>      violations; loading/empty/error states on every async surface;
>      Lighthouse a11y >= 95.
>   4. Testing (20 pts) — >=80% line coverage on `lib/`, `stores/`,
>      `hooks/`; component tests use `getByRole` and `findBy*`; one
>      Playwright E2E exercises the full live-update flow across two
>      browser contexts.
>   5. Production Readiness (20 pts) — CI runs lint, typecheck, test,
>      build, e2e in parallel; Sentry captures errors with component
>      stacks; Web Vitals reported; Vercel preview deploys per PR;
>      bundle-size budget enforced.
> 
> Stretch goals:
>   - Add card labels, due dates, and assignees with filtering.
>   - Render card descriptions as markdown with `react-markdown`.
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
>     on the board in real time (using `useTransition` for smoothness).
>   - Add property-based tests with `fast-check` for the optimistic
>     move/rollback state machine.

> **Tip:** Stretch goals:
> • Add card labels, due dates, and assignees with filtering.
> • Render card descriptions as markdown with `react-markdown`.
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
> • on the board in real time (using `useTransition` for smoothness).
> • Add property-based tests with `fast-check` for the optimistic
> • move/rollback state machine.

