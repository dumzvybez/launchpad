---
slug: svelte-capstone-project
id: svelte-capstone
track: svelte
order: 21
title: "Capstone Project: Bookmarking tools today are either bare-bones lists owned..."
description: |-
  Bookmarking tools today are either bare-bones lists owned by a single
    browser or bloated SaaS products with paywalls and AI summaries nobody
    asked for. Readers, researchers, and developers want a fast, social,
    taggable bookmark manager that works on every device, supports shared
    collections,
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Capstone Project: Bookmarking tools today are either bare-bones lists owned...

## Bookmarking tools today are either bare-bones lists owned...

Problem statement:
Bookmarking tools today are either bare-bones lists owned by a single
  browser or bloated SaaS products with paywalls and AI summaries nobody
  asked for. Readers, researchers, and developers want a fast, social,
  taggable bookmark manager that works on every device, supports shared
  collections, and respects their data. This capstone builds "Bookshelf"
  — a collaborative bookmark manager with SvelteKit 2 + Svelte 5 runes,
  server-side rendering for SEO, form actions for mutations, optimistic
  UI with use:enhance, tag-based filtering, public collections with
  share URLs, full-text search, OAuth login, and a CI/CD pipeline that
  deploys to Vercel on every push. The project exercises every concept
  from the 20-stage track: runes ($state/$derived/$effect/$props),
  snippets, actions, transitions, lifecycle, stores, context, hooks,
  load functions, form actions, error boundaries, testing, performance,
  and deployment. By the end you will have shipped a real, observable,
  tested SvelteKit app you can put on a resume.

Target users:
• Software developers who want to share curated link collections with
• their team (e.g., "Go links" or "weekly reading").
• Researchers who tag and organize papers, articles, and videos.
• Writers and content creators who maintain a public "what I'm
• reading" page with one URL.
• Hobbyist communities (knitting clubs, board game groups) that want
• a shared resource list.

P0 (Must have) requirements:
• Email/password authentication with argon2 hashing and a session
• cookie set via hooks.server.ts.
• Bookmark CRUD: URL, title (auto-fetched via OpenGraph), tags,
• notes; one bookmark per URL per user.
• Tag-based filtering with multi-select chips and a derived
• "filtered bookmarks" list.
• Collections: named groups of bookmarks, owned by a user, sharable
• via a public URL with /c/[slug] route.
• Form actions for create/update/delete with use:enhance and
• optimistic UI plus rollback on failure.
• Server load for /bookmarks with invalidate() after mutations.
• <svelte:boundary> wrapping the bookmark list so a single broken
• OpenGraph image doesn't kill the page.
• Full-text search across title, URL, and notes server-side.
• Loading, empty, and error states on every async surface.
• TypeScript end-to-end (strict mode, no `any`).
• Responsive layout with scoped CSS and a dark mode persisted via
• a context store.

P1 (Should have) requirements:
• GitHub OAuth login alongside email/password.
• Public profile pages at /u/[username] showing a user's public
• collections.
• Drag-and-drop reorder within collections using animate:flip.
• Keyboard shortcuts (j/k to navigate, / to focus search, e to
• edit) using <svelte:window> keydown bindings.
• Export bookmarks as JSON and import from Pinboard/HTML.
• sitemap.xml and <svelte:head> SEO per public collection.
• Toast notifications for successes and errors.

P2 (Nice to have) requirements:
• Real-time collaborative editing of collections via WebSockets.
• Browser extension for one-click "Save to Bookshelf".
• RSS feed per public collection.
• AI-assisted auto-tagging using OpenAI embeddings.
• End-to-end encryption of private notes via Web Crypto.
• PWA install with offline read support via a service worker.

Tech stack:
• Svelte 5 (runes mode: $state, $derived, $effect, $props, $bindable)
• SvelteKit 2 with file-based routing, layouts, load, and form actions
• adapter-vercel for serverless deployment
• TypeScript 5 strict, noUncheckedIndexedAccess
• Drizzle ORM with Postgres (Neon free tier)
• argon2 for password hashing; cookie-based sessions
• Lucia or custom session tokens in cookies (httpOnly, sameSite=lax)
• Tailwind CSS via @sveltejs/enhanced-tailwindcss or plain scoped CSS
• Zod for input validation in actions and load
• @sveltejs/kit enhance for progressive-enhanced forms
• svelte/animate flip for drag-and-drop reordering
• Vitest + @testing-library/svelte for component tests
• Playwright for E2E
• GitHub Actions for CI; Vercel for hosting; Sentry for errors
• $env/static/private for build-time secrets; $env/dynamic/private
• for runtime secrets in serverless

> **Tip:** Testing strategy:
> - Unit tests (Vitest) for every pure function in
>     `lib/server/openGraph.ts` (parsing), `lib/services/*.ts`
>     (filtering helpers), and `lib/stores/*.ts`; target ≥80% line
>     coverage on `lib/`.
>   - Component tests (@testing-library/svelte + userEvent) for
>     `BookmarkCard`, `BookmarkForm`, `TagFilter`, `CollectionCard`,
>     `Toast` — assert via `getByRole` and `findBy*` for async.
>   - Integration tests that invoke load and action functions directly
>     (mocking `locals.user`, `cookies`, `fetch`) to verify auth gates
>     and validation.
>   - E2E tests (Playwright) covering: signup, login, add bookmark,
>     tag filter, search, share public collection, open public URL,
>     keyboard shortcut navigation. Run against `npm run preview` for
>     production-like behavior.
>   - Accessibility: `@axe-core/playwright` runs in E2E and fails on
>     critical violations; Lighthouse CI enforces a11y ≥ 95.
>   - Coverage target: ≥80% lines and ≥70% branches on `src/lib`;
>     enforce via `vitest run --coverage` in CI.

> **Tip:** Deployment guide:
> - Deploy to Vercel (Hobby tier free for the capstone); every PR
>     gets a preview URL automatically.
>   - Provision a Neon Postgres free-tier database; put the
>     connection string in `DATABASE_URL`.
>   - Required environment variables:
>       web/server: `DATABASE_URL`, `SESSION_SECRET` (≥32 chars),
>                   `GITHUB_OAUTH_CLIENT_ID`,
>                   `GITHUB_OAUTH_CLIENT_SECRET`, `SENTRY_DSN`,
>                   `PUBLIC_ORIGIN` (e.g. https://bookshelf.vercel.app).
>   - Build commands:
>       `pnpm install` then `pnpm run build` (adapter-vercel produces
>       serverless functions per route).
>   - Start commands:
>       Vercel serves the functions automatically; no manual start
>       needed. For Node adapter (alternative): set ORIGIN and PORT,
>       run `node build/index.js`.
>   - Post-deploy verification:
>       1) `curl https://<your-app>/api/health` returns `{"ok":true}`.
>       2) Visit `/signup`, create an account, log in.
>       3) Add a bookmark with a real URL; verify OG image fetches.
>       4) Create a public collection, copy the share URL, open in an
>          incognito window — verify it loads without auth.
>       5) Run a Lighthouse audit; verify a11y ≥ 95, no critical
>          console errors.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Architecture & Type Safety (20 pts) — End-to-end TypeScript
>      with no `any` (CI-enforced via svelte-check); Zod schemas are
>      the single source of truth for actions, forms, and load
>      returns; clean separation of `routes/`, `lib/components/`,
>      `lib/server/`, `lib/services/`.
>   2. Svelte 5 Mastery (20 pts) — Runes ($state/$derived/$effect/
>      $props/$bindable) used correctly; snippets for composition
>      (no legacy slots); `<svelte:boundary>` for error and pending
>      states; keyed `{#each}` everywhere; transitions and
>      `animate:flip` for reorder.
>   3. SvelteKit Mastery (20 pts) — Server vs universal loads chosen
>      correctly; form actions with `use:enhance` and optimistic UI;
>      hooks.server.ts for auth with `sequence()`; `depends()` +
>      `invalidate()` for post-mutation refresh; `<svelte:head>` SEO
>      on public pages; `csr={false}` where appropriate.
>   4. Testing (20 pts) — ≥80% line coverage on `lib/`; component
>      tests use `getByRole` and `findBy*`; one Playwright E2E
>      exercises signup → add bookmark → share collection → open
>      public URL; axe-core reports zero critical violations.
>   5. Production Readiness (20 pts) — CI runs lint, svelte-check,
>      test, build, e2e in parallel; Sentry captures errors with
>      component stacks; env vars correctly split between
>      `$env/static/private`, `$env/dynamic/private`, and
>      `$env/static/public`; Vercel preview deploys per PR;
>      bundle-size budget enforced.
> 
> Stretch goals:
>   - Add real-time collaborative editing via WebSockets (multiple
>     users editing a collection simultaneously with presence).
>   - Build a browser extension (Chrome/Firefox) that adds a "Save to
>     Bookshelf" button on any page, posting to a `/api/bookmarks`
>     endpoint with the user's session cookie.
>   - Generate an RSS feed per public collection at
>     `/c/[slug].rss` using SvelteKit's +server.ts endpoints.
>   - Add AI-assisted auto-tagging using OpenAI embeddings — cluster
>     bookmarks by topic and suggest tags.
>   - End-to-end encrypt private notes using the Web Crypto API with
>     per-user keys derived from the password via PBKDF2.
>   - Make the app installable as a PWA with a service worker that
>     caches recently viewed bookmarks for offline reading.
>   - Add full-text search via Postgres `tsvector` with ranking and
>     typo tolerance, replacing the basic LIKE queries.
>   - Implement a bookmarklet that captures the current selection as
>     a note when saving.
>   - Add per-collection analytics (click count, referrer) using
>     server-side increments in a `click_events` table.
>   - Add a public API at `/api/v1/bookmarks` with OAuth tokens for
>     third-party integrations.

> **Tip:** Stretch goals:
> • Add real-time collaborative editing via WebSockets (multiple
> • users editing a collection simultaneously with presence).
> • Build a browser extension (Chrome/Firefox) that adds a "Save to
> • Bookshelf" button on any page, posting to a `/api/bookmarks`
> • endpoint with the user's session cookie.
> • Generate an RSS feed per public collection at
> • `/c/[slug].rss` using SvelteKit's +server.ts endpoints.
> • Add AI-assisted auto-tagging using OpenAI embeddings — cluster
> • bookmarks by topic and suggest tags.
> • End-to-end encrypt private notes using the Web Crypto API with
> • per-user keys derived from the password via PBKDF2.
> • Make the app installable as a PWA with a service worker that
> • caches recently viewed bookmarks for offline reading.
> • Add full-text search via Postgres `tsvector` with ranking and
> • typo tolerance, replacing the basic LIKE queries.
> • Implement a bookmarklet that captures the current selection as
> • a note when saving.
> • Add per-collection analytics (click count, referrer) using
> • server-side increments in a `click_events` table.
> • Add a public API at `/api/v1/bookmarks` with OAuth tokens for
> • third-party integrations.

