---
slug: nextjs-capstone-project
id: nextjs-capstone
track: nextjs
order: 21
title: "Capstone Project: Independent creators publish newsletters across platforms (Substack"
description: |-
  Independent creators publish newsletters across platforms (Substack,
    Beehiiv, Ghost) but lack a single dashboard to see subscribers,
    revenue, and engagement across all of them. Switching tabs and
    exporting CSVs wastes time and obscures trends. In this capstone you
    will build "Inkwell" — a Ne
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Capstone Project: Independent creators publish newsletters across platforms (Substack

## Independent creators publish newsletters across platforms (Substack

Problem statement:
Independent creators publish newsletters across platforms (Substack,
  Beehiiv, Ghost) but lack a single dashboard to see subscribers,
  revenue, and engagement across all of them. Switching tabs and
  exporting CSVs wastes time and obscures trends. In this capstone you
  will build "Inkwell" — a Next.js 14 App Router dashboard that
  authenticates creators with GitHub (NextAuth.js), connects to a
  Postgres database via Prisma, ingests mock newsletter data through
  Route Handlers, displays it with server components and streaming
  Suspense, lets creators write and publish posts via Server Actions,
  and ships to Vercel with a CI pipeline running Vitest and Playwright.

Target users:
• Solo newsletter creators (1K-50K subscribers) who want one view of
• their audience and revenue.
• Small creator teams (2-5 people) who need shared access and per-
• member post permissions.
• Indie hackers evaluating newsletter ideas via trend data on the
• discover page.

P0 (Must have) requirements:
• NextAuth.js GitHub OAuth with a `User` and `Account` Prisma model
• Protected `/dashboard/*` routes via middleware redirect
• Server-rendered dashboard showing subscriber count, last 30 days
• of opens, and a list of recent posts
• Server Action `createPost(formData)` that validates with Zod and
• inserts a post, then calls `revalidatePath`
• Public `/p/[slug]` page for each published post (SSG via
• `generateStaticParams`, `dynamicParams = false`)
• `app/sitemap.ts` and `app/robots.ts` for SEO
• `next/image` for the hero and OG images
• `next/font` for the Inter font (no FOUT)
• Vitest unit tests on utilities and Server Action validation
• Playwright E2E test covering login -> dashboard -> create post
• Deployed to Vercel with `prisma migrate deploy` in postbuild

P1 (Should have) requirements:
• `useOptimistic` like button on published posts
• Streaming Suspense for the analytics panel so the dashboard
• renders instantly while stats load
• Bundle analyzer wired into `next.config.mjs` (ANALYZE=true)
• Open Graph image generated per post via `opengraph-image.tsx`
• 404 and error boundaries at the root and per segment
• Loading skeletons for `/dashboard` and `/p/[slug]`

P2 (Nice to have) requirements:
• i18n via `[locale]` segment with English and Spanish
• Parallel `@stats` and `@feed` slots on the dashboard
• Intercepting route that opens a post preview in a modal from the
• dashboard list
• Real User Monitoring via `web-vitals` POSTing to `/api/vitals`
• Self-hosted Docker image with `output: 'standalone'` running on
• Fly.io as a staging environment

```text
inkwell/
  app/
    layout.tsx                  # Root layout, Inter font, navbar
    page.tsx                    # Marketing home (server component)
    globals.css                 # Tailwind + design tokens
    robots.ts                   # /robots.txt
    sitemap.ts                  # /sitemap.xml
    opengraph-image.tsx         # Default OG image
    login/
      page.tsx                  # GitHub sign-in button
    dashboard/
      layout.tsx                # Authenticated layout with sidebar
      page.tsx                  # Stats overview (streaming Suspense)
      posts/
        page.tsx                # List of posts
        new/
          page.tsx              # Form -> createPost action
      @stats/
        page.tsx                # Parallel slot for live stats
      @feed/
        page.tsx                # Parallel slot for recent activity
      loading.tsx
      error.tsx
    p/
      [slug]/
        page.tsx                # Public post page (SSG)
        opengraph-image.tsx     # Per-post OG image
        loading.tsx
    api/
      vitals/route.ts           # Receives web-vitals POSTs
      revalidate/route.ts       # On-demand revalidation
    actions.ts                  # 'use server' createPost, likePost
    not-found.tsx
    global-error.tsx
  components/
    Navbar.tsx
    Sidebar.tsx
    PostCard.tsx
    LikeButton.tsx              # useOptimistic client component
    SubmitButton.tsx            # useFormStatus
    WebVitals.tsx               # useReportWebVitals
  lib/
    db.ts                       # Prisma singleton with server-only
    auth.ts                     # NextAuth config
    posts.ts                    # Fetchers and helpers
    validators.ts               # Zod schemas
  prisma/
    schema.prisma               # User, Account, Post, Like
    migrations/
  e2e/
    auth.spec.ts
    dashboard.spec.ts
    post-flow.spec.ts
  src/
    components/
      __tests__/                # Vitest component tests
  middleware.ts                 # NextAuth route gating
  next.config.mjs               # standalone output, bundle analyzer
  tailwind.config.ts
  vitest.config.ts
  playwright.config.ts
  Dockerfile
  .dockerignore
  .env.example
  README.md
```
Caption: Suggested file structure

Tech stack:
• Next.js 14+ (App Router, Server Components, Server Actions)
• TypeScript 5+ with `@/*` path alias
• Tailwind CSS for styling
• Prisma ORM with Postgres (Neon free tier)
• NextAuth.js v5 (GitHub OAuth, JWT sessions)
• Zod for schema validation
• Vitest + React Testing Library for unit tests
• Playwright for E2E tests
• Vercel for production deploy
• Docker (output: 'standalone') for self-host staging on Fly.io
• GitHub Actions for CI (test + build on every PR)

> **Tip:** Testing strategy:
> - Unit tests with Vitest cover Zod validators (valid/invalid inputs),
>     pure helpers (slug generation, date formatting), and the
>     `createPost` action with a mocked Prisma client.
>   - Component tests with React Testing Library cover `LikeButton`
>     (optimistic update + rollback), `SubmitButton` (pending state),
>     and `PostCard` (renders title and excerpt).
>   - E2E tests with Playwright cover the full auth -> create post ->
>     publish -> view flow across Chromium and WebKit.
>   - Coverage target: ≥80% line coverage on `lib/`, `app/actions.ts`,
>     and `components/`; exclude `*.config.*`, `app/layout.tsx`, and
>     `prisma/`.
>   - Run tests locally with `npm run test` (Vitest) and `npm run e2e`
>     (Playwright); CI runs both on every PR.

> **Tip:** Deployment guide:
> - Deploy to Vercel (production): Git-connected auto-deploy from the
>     `main` branch; preview deploys per PR.
>   - Environment variables needed on Vercel: `DATABASE_URL`,
>     `AUTH_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`,
>     `NEXT_PUBLIC_APP_URL` (your Vercel URL).
>   - Build command: `npm run build` (Vercel auto-detects Next.js and
>     runs `next build`); `postbuild` runs `prisma migrate deploy`.
>   - Start command: Vercel auto-runs `next start` on its platform.
>   - Post-deploy verification: visit the live URL, sign in with GitHub,
>     create a post, view it at `/p/[slug]`, and confirm the OG image
>     renders when sharing on a social platform. Run the Playwright E2E
>     against the production URL once.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Routing and architecture (20 pts) — App Router file structure is
>      correct, layouts/templates are used appropriately, parallel and
>      intercepting routes work as intended.
>   2. Server/client boundaries (20 pts) — `'use client'` is used only
>      where necessary, `server-only` guards the db module, no secrets
>      leak to the browser, serialization pitfalls are handled.
>   3. Data and mutations (20 pts) — Prisma singleton pattern is correct,
>      Server Actions validate with Zod, `revalidatePath` refreshes
>      cached data, SSG and ISR are configured appropriately.
>   4. Testing and quality (20 pts) — Vitest unit tests cover validators
>      and actions, Playwright E2E covers the main flow, ≥80% line
>      coverage on core modules, CI passes on every PR.
>   5. Performance and deployment (20 pts) — LCP/CLS/INP are in the
>      green, bundle is analyzed and free of regressions, deployment to
>      Vercel succeeds with migrations running, web-vitals RUM is in
>      place.
> 
> Stretch goals:
>   - Add an `[locale]` segment with English and Spanish message files
>     via `next-intl`.
>   - Implement an intercepting route that opens a post preview in a
>     modal from the dashboard list (soft nav only).
>   - Generate OG images dynamically per post using `next/og`
>     `ImageResponse`.
>   - Add a Docker image with `output: 'standalone'` deployed to Fly.io
>     as a staging environment.
>   - Implement role-based access (owner/editor/viewer) using NextAuth
>     callbacks and a `Role` field on the user.
>   - Add a webhook Route Handler that receives subscriber events from a
>     mock newsletter provider and updates Postgres.
>   - Add Real User Monitoring dashboards in Vercel Speed Insights and
>     alert on INP regressions.
>   - Implement on-demand ISR: a `/api/revalidate` route that calls
>     `revalidateTag('posts')` when a post is updated externally.

> **Tip:** Stretch goals:
> • Add an `[locale]` segment with English and Spanish message files
> • via `next-intl`.
> • Implement an intercepting route that opens a post preview in a
> • modal from the dashboard list (soft nav only).
> • Generate OG images dynamically per post using `next/og`
> • `ImageResponse`.
> • Add a Docker image with `output: 'standalone'` deployed to Fly.io
> • as a staging environment.
> • Implement role-based access (owner/editor/viewer) using NextAuth
> • callbacks and a `Role` field on the user.
> • Add a webhook Route Handler that receives subscriber events from a
> • mock newsletter provider and updates Postgres.
> • Add Real User Monitoring dashboards in Vercel Speed Insights and
> • alert on INP regressions.
> • Implement on-demand ISR: a `/api/revalidate` route that calls
> • `revalidateTag('posts')` when a post is updated externally.

