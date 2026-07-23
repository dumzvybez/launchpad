---
slug: angular-capstone-project
id: angular-capstone
track: angular
order: 21
title: "Capstone Project: Engineering teams need a fast, opinionated issue tracker..."
description: |-
  Engineering teams need a fast, opinionated issue tracker that
    combines the kanban view of Trello, the structured workflow of
    Jira, and the keyboard-first UX of Linear — without per-user
    licensing costs and without locking data in proprietary formats.
    Existing tools are either too lightweight
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Capstone Project: Engineering teams need a fast, opinionated issue tracker...

## Engineering teams need a fast, opinionated issue tracker...

Problem statement:
Engineering teams need a fast, opinionated issue tracker that
  combines the kanban view of Trello, the structured workflow of
  Jira, and the keyboard-first UX of Linear — without per-user
  licensing costs and without locking data in proprietary formats.
  Existing tools are either too lightweight (no sprints, no custom
  fields) or too heavy (admin overhead, slow on mobile, expensive at
  50+ users). In this capstone you will build "AngularTrack", a
  real-time collaborative issue tracker using Angular 17+ standalone
  components, signals, the new control flow (@if/@for), NgRx for
  global state, Angular Reactive Forms, Angular Material, the Angular
  CDK for drag-and-drop, the HttpClient with functional interceptors,
  lazy-loaded routes with a custom preloading strategy, OnPush
  everywhere, SSR for the marketing/landing pages, and a PWA service
  worker for offline draft caching. The web app deploys to Vercel
  with SPA fallback; a small Node + Express + WebSocket API deploys
  to Fly.io; Postgres (Neon free tier) stores data. The finished
  product supports boards, columns, issues with custom fields, real-
  time multi-user editing, optimistic updates with rollback, full-
  text search, saved filters, and a keyboard-driven command palette.
  This capstone exercises every concept from the 20-stage track:
  standalone components, signals, computed/effect, the new control
  flow, pipes, services/DI, routing with guards/resolvers/
  interceptors, HttpClient, RxJS, Reactive Forms, NgRx, OnPush,
  content projection, dynamic components, testing, i18n, PWA, and
  performance budgets.

Target users:
• Small engineering teams (3-20 people) who want a Linear-like
• keyboard-first issue tracker for sprint planning.
• Open-source maintainers tracking issues across multiple repos
• with custom workflows per repo.
• Solo developers who want a fast, offline-capable personal issue
• tracker installable as a PWA.
• Engineering managers who need real-time visibility into a
• team's board without leaving the page.

P0 (Must have) requirements:
• User can sign up, log in, log out (email + password, JWT).
• User can create, rename, archive, and delete boards.
• A board has a default set of columns (Backlog, In Progress,
• In Review, Done) and supports adding/renaming/deleting columns.
• An issue has a title, description, assignee, priority,
• labels, due date, and custom fields; it can be created,
• edited, moved across columns (drag-and-drop), and deleted.
• Issue moves sync to all connected clients in real time via
• WebSocket with optimistic updates and rollback on failure.
• Active users (presence) shown per board as avatars.
• Full-text search across issue titles and descriptions within
• a board.
• Saved filters (e.g., "My open issues", "High priority this
• sprint") persisted per user.
• Keyboard-driven command palette (Cmd+K) to navigate, search,
• and create issues without leaving the keyboard.
• Fully responsive UI down to mobile (375px width).

P1 (Should have) requirements:
• Custom fields per board (text, number, date, single-select).
• Issue comments with @mentions and live updates.
• Board activity feed (last 50 events).
• Toast notifications for errors, successes, and mentions.
• Empty, loading, and error states on every async surface.
• Keyboard-accessible drag-and-drop (Space to pick up, arrows
• to move, Space to drop) via CDK's `@angular/cdk/a11y`.
• Dark/light theme toggle persisted to localStorage.

P2 (Nice to have) requirements:
• Sprints with start/end dates and burndown chart.
• Markdown rendering in issue descriptions and comments.
• Drag-and-drop file upload for issue attachments to S3.
• PWA install with offline draft caching of new issues.
• End-to-end encryption of issue contents at rest with Web
• Crypto API and per-board keys.
• Multi-board dashboard with cross-board search.
• Email notifications on @mentions via Resend or Postmark.
• Audit log export to CSV for compliance.

Tech stack:
• Angular 17+ with standalone components, signals, `@if`/`@for`,
• TypeScript (strict), and `provideZonelessChangeDetection()`
• (Angular 18+) for predictable, zoneless CD.
• Angular CLI 17+ for `ng new`, `ng generate`, `ng build`, `ng test`.
• Angular Material 17+ for the design system (buttons, dialogs,
• snackbars, tooltips) with custom theming via CSS variables.
• Angular CDK 17+ for drag-and-drop (`@angular/cdk/drag-drop`),
• virtual scrolling (`@angular/cdk/scrolling`), and a11y
• (`@angular/cdk/a11y` for the command palette and keyboard DnD).
• Angular Router 17+ with `provideRouter`, `withComponentInputBinding`,
• `withInMemoryScrolling`, lazy `loadComponent`, and a custom
• `RoleAwarePreload` strategy.
• HttpClient with `provideHttpClient(withFetch(),
• withInterceptors([authInterceptor, errorInterceptor,
• loadingInterceptor]))`.
• RxJS 7+ for WebSocket streams, `combineLatest`, `switchMap`, and
• `takeUntilDestroyed`.
• NgRx 17+ (Store, Effects, Entity, ComponentStore, Devtools) for
• boards, issues, and UI state.
• Angular Reactive Forms with `FormBuilder.nonNullable.group`,
• custom validators, and `updateOn: 'blur'` for performance.
• `@angular/service-worker` for PWA with offline draft caching
• and `SwUpdate` for version-prompt reloads.
• `@angular/ssr` for the marketing/landing pages (SEO + first
• paint); the app shell is CSR for interactivity.
• `@angular/localize` with English-only baseline and i18n hooks
• for future localization.
• Tailwind CSS 3 (JIT) layered with Material theming; CSS
• variables for color tokens to flip dark/light instantly.
• Zod for runtime validation, shared between web and server.
• Angular Testing Library + Jasmine/Karma (or Jest via
• `jest-preset-angular`) for unit/component tests; Cypress for E2E.
• Node 20 + Express for the API; `ws` for WebSockets.
• Drizzle ORM + Postgres (Neon free tier) for storage.
• Sentry for error reporting; `web-vitals` for performance.
• GitHub Actions for CI; Vercel for the web deploy (with SPA
• fallback); Fly.io for the API and Postgres.

> **Tip:** Testing strategy:
> - Unit tests (Jasmine or Jest) for every NgRx reducer (pure
>     functions), every selector (memoization check), every
>     `api.service.ts` method (mocking HttpClient via
>     `HttpTestingController`), and every interceptor; target 80%
>     line coverage on `core/`, `features/`, `shared/`.
>   - Component tests (Angular Testing Library) for
>     `BoardDetailComponent`, `ColumnComponent`, `IssueCardComponent`,
>     `IssueEditorComponent`, `CommandPaletteComponent`, and
>     `AvatarComponent` — using `provideMockStore` and a
>     `BoardProvider` wrapper. Assert via `getByRole` and `findBy*`
>     for async (optimistic updates rolling back).
>   - Directive/pipe tests for `HighlightDirective`, `ClickOutside
>     Directive`, `FileSizePipe`, `FromNowPipe`, `TruncatePipe`.
>   - E2E tests (Cypress) covering: signup, login, board creation,
>     issue creation, drag-across-columns, reload-and-verify,
>     full-text search, saved filters, and the WebSocket live-update
>     flow (two browser contexts on the same board).
>   - Accessibility audits: `cypress-axe` runs in the E2E suite and
>     fails on critical violations; Lighthouse CI enforces a11y >= 95.
>   - Performance budgets: `angular.json` `budgets` set
>     `maximumError: "1mb"` on the initial bundle and
>     `maximumError: "4kb"` on any component style; CI fails on
>     breach.
>   - Coverage target: >=80% lines and >=70% branches on
>     `apps/web/src` and `apps/server/src`; enforce via `ng test
>     --code-coverage` in CI.

> **Tip:** Deployment guide:
> - Deploy `apps/web` to Vercel (free Hobby tier sufficient for the
>     capstone) connected to your GitHub repo; every PR gets a unique
>     preview URL automatically. Set the build command to `pnpm
>     --filter web build` (or `ng build --configuration production`)
>     and the output directory to `apps/web/dist/angulartrack/browser`.
>     Add a `vercel.json` with SPA fallback rewrites
>     (`{ "source": "/(.*)", "destination": "/index.html" }`) and
>     immutable cache headers on `assets/**` and `*.js`/`*.css`.
>   - Deploy `apps/api` to Fly.io's free tier with a managed Postgres
>     (Neon free tier). Use a `node:20-alpine` Docker image with
>     `node dist/index.js` as the start command. Configure CORS to
>     allow the Vercel preview URL and the production URL.
>   - Required environment variables:
>       web: VITE_API_URL (or `environment.ts` injection),
>            VITE_WS_URL, VITE_SENTRY_DSN, VITE_VAPID_PUBLIC_KEY.
>       api: DATABASE_URL, JWT_SECRET (>=32 chars), PORT,
>            CORS_ORIGIN=https://<your-vercel-app>.vercel.app,
>            SENTRY_DSN, VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY.
>   - Build commands:
>       web: `pnpm --filter web build` (runs AOT, minification, tree-
>            shaking, budget enforcement; with `@angular/ssr` also
>            produces `dist/<app>/server`).
>       api: `pnpm --filter api build` (runs `tsc` then copies `dist/`
>            into a slim Docker image).
>   - Start commands:
>       web: Vercel serves the static `dist/` from its CDN; configure
>            a SPA fallback rewrite via `vercel.json`.
>       api: `node dist/index.js` inside the Docker image on Fly.io.
>   - Post-deploy verification: `curl https://<api>/health` returns
>     `{"ok":true}`; visit the Vercel preview, sign up, create a board,
>     add an issue, move it across columns, open a second browser
>     session (incognito), navigate to the same board, and confirm
>     the first session's issue move appears live. Run the Cypress
>     E2E suite against the deployed preview URL. Verify the service
>     worker is registered (Chrome DevTools → Application → Service
>     Workers) and that the app launches offline (DevTools → Network
>     → Offline → reload).
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Architecture & Type Safety (20 pts) — End-to-end TypeScript
>      with no `any` (CI-enforced via `tsc --strict` and ESLint);
>      shared Zod schemas are the single source of truth for API,
>      client, and forms; clean separation of `core/`, `features/`,
>      `shared/`; standalone components with explicit `imports`.
>   2. Real-time & State Management (20 pts) — WebSocket updates
>      propagate to all clients without duplicate broadcasts; NgRx
>      stores combine cleanly with signals (`selectSignal`); optimistic
>      issue moves roll back on failure; presence avatars update live;
>      `takeUntilDestroyed` used on all subscriptions.
>   3. UX & Accessibility (20 pts) — Drag-and-drop is keyboard
>      accessible via CDK a11y; axe-core reports zero critical
>      violations; loading/empty/error states on every async surface;
>      responsive down to 375px; Lighthouse a11y >= 95; command
>      palette (Cmd+K) works end-to-end.
>   4. Testing (20 pts) — >=80% line coverage on `core/`, `features/`,
>      `shared/`; component tests use `getByRole` and `findBy*`; one
>      Cypress E2E exercises the full live-update flow across two
>      browser contexts; reducers and selectors have pure-function
>      tests; interceptor tests use `HttpTestingController`.
>   5. Production Readiness (20 pts) — CI runs lint, typecheck, test,
>      build, e2e in parallel; Sentry captures errors with component
>      stacks; Web Vitals reported; Vercel preview deploys per PR;
>      bundle-size budget enforced via `angular.json` `budgets` and
>      Lighthouse CI; PWA service worker registered with offline app
>      shell; SPA fallback configured on Vercel.
> 
> Stretch goals:
>   - Add sprints with start/end dates and a burndown chart via a
>     custom SVG/Canvas component.
>   - Render issue descriptions and comments as markdown with
>     `markdown-it` and sanitization.
>   - Implement drag-and-drop file uploads to an S3-compatible store
>     (R2, MinIO) with presigned URLs.
>   - Add email notifications on @mentions via Resend or Postmark.
>   - Make the app installable as a PWA with offline draft caching via
>     a Service Worker and IndexedDB (drafts sync when back online).
>   - End-to-end encrypt issue contents at rest using the Web Crypto
>     API with per-board keys (key rotation on member leave).
>   - Add a multi-board dashboard with cross-board full-text search
>     via a Postgres tsvector index.
>   - Add a custom GraphQL endpoint alongside the REST API and
>     benchmark the DX and bundle-size differences vs. HttpClient.
>   - Replace Express with Hono and deploy the API to Cloudflare
>     Workers for sub-50ms global latency.
>   - Implement a presence cursor showing each viewer's mouse position
>     on the board in real time (throttled to 30Hz).
>   - Add property-based tests with `fast-check` for the optimistic
>     move/rollback state machine.
>   - Add a `defineAsyncComponent`-equivalent (lazy standalone) for
>     the settings panel that lazy-loads only when opened.
>   - Add per-issue comment threads with @mentions and unread
>     indicators via WebSocket events.
>   - Add a CSV audit-log export for compliance teams.
>   - Migrate to `provideZonelessChangeDetection()` (Angular 18+) and
>     verify the bundle shrinks by ~30KB without breaking Material.

> **Tip:** Stretch goals:
> • Add sprints with start/end dates and a burndown chart via a
> • custom SVG/Canvas component.
> • Render issue descriptions and comments as markdown with
> • `markdown-it` and sanitization.
> • Implement drag-and-drop file uploads to an S3-compatible store
> • (R2, MinIO) with presigned URLs.
> • Add email notifications on @mentions via Resend or Postmark.
> • Make the app installable as a PWA with offline draft caching via
> • a Service Worker and IndexedDB (drafts sync when back online).
> • End-to-end encrypt issue contents at rest using the Web Crypto
> • API with per-board keys (key rotation on member leave).
> • Add a multi-board dashboard with cross-board full-text search
> • via a Postgres tsvector index.
> • Add a custom GraphQL endpoint alongside the REST API and
> • benchmark the DX and bundle-size differences vs. HttpClient.
> • Replace Express with Hono and deploy the API to Cloudflare
> • Workers for sub-50ms global latency.
> • Implement a presence cursor showing each viewer's mouse position
> • on the board in real time (throttled to 30Hz).
> • Add property-based tests with `fast-check` for the optimistic
> • move/rollback state machine.
> • Add a `defineAsyncComponent`-equivalent (lazy standalone) for
> • the settings panel that lazy-loads only when opened.
> • Add per-issue comment threads with @mentions and unread
> • indicators via WebSocket events.
> • Add a CSV audit-log export for compliance teams.
> • Migrate to `provideZonelessChangeDetection()` (Angular 18+) and
> • verify the bundle shrinks by ~30KB without breaking Material.

