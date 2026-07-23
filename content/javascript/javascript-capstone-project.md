---
slug: javascript-capstone-project
id: javascript-capstone
track: javascript
order: 21
title: "Capstone Project: Personal finance is fragmented — bank apps, spreadsheets..."
description: Personal finance is fragmented — bank apps, spreadsheets, and budgeting tools each handle one slice. The capstone builds "Ledger" — a single-page personal finance tracker PWA that runs offline, stores transactions in IndexedDB, syncs to a mock backend when online, and renders interactive charts. Use
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Capstone Project: Personal finance is fragmented — bank apps, spreadsheets...

## Personal finance is fragmented — bank apps, spreadsheets...

Problem statement:
Personal finance is fragmented — bank apps, spreadsheets, and budgeting tools each handle one slice. The capstone builds "Ledger" — a single-page personal finance tracker PWA that runs offline, stores transactions in IndexedDB, syncs to a mock backend when online, and renders interactive charts. Users add income/expense transactions, see category breakdowns, set monthly budgets, and get alerts when approaching limits. The project exercises every concept from the 20 stages: DOM, events, async, modules, fetch, testing, FP, OOP, performance, security, and CI/CD — finishing with a deployed, monitored PWA.

Target users:
• Freelancers tracking irregular income across multiple clients
• Students learning to budget on a fixed allowance
• Households sharing a joint expense tracker across devices
• Small-business owners categorizing business vs personal expenses

P0 (Must have) requirements:
• Add/edit/delete transactions (amount, type, category, date, note)
• Persist transactions in IndexedDB (offline-first)
• List view with filters by date range, type, and category
• Summary dashboard: total income, total expense, net balance
• Category breakdown chart (canvas or SVG)
• Monthly budget per category with visual progress bar
• Budget-exceeded alert (in-app banner)
• Service worker for offline app shell
• Installable PWA (manifest.json, icons)
• Deployed to a static host (Vercel/Netlify/CF Pages) with CI green

P1 (Should have) requirements:
• Sync to a mock REST backend when online (POST/GET /transactions)
• Conflict resolution: last-write-wins with timestamp
• Export transactions to CSV
• Dark/light theme toggle persisted in localStorage
• Searchable, sortable transaction table
• Basic auth with httpOnly cookies (mock backend)

P2 (Nice to have) requirements:
• Multi-currency support with conversion rates
• Recurring transactions (weekly/monthly)
• Charts: trend line, category pie, monthly comparison
• Import CSV from a real bank export
• Push notification when a budget threshold is crossed

Tech stack:
• Vite 5+ as dev server and build tool (Rollup production build)
• Vanilla ES2022+ JavaScript (no framework) to exercise the language directly
• IndexedDB via a small Promise wrapper (or idb-keyval) for client storage
• Service Worker via Vite PWA plugin for offline support
• Vitest for unit and integration tests, Playwright for E2E
• ESLint + Prettier for lint and format
• GitHub Actions for CI/CD
• Vercel or Cloudflare Pages for hosting
• Sentry for production error monitoring
• web-vitals library for field performance data

> **Tip:** Testing strategy:
> - Unit tests (Vitest) for Transaction, Budget, format utils, fp helpers — target 90%+ line coverage on the domain layer; mock IndexedDB with fake-indexeddb.
>   - Integration tests for the store + IndexedDB round-trip: add → getAll → edit → delete → confirm state.
>   - E2E tests (Playwright) for the user flows: add transaction, filter by category, trigger budget alert, toggle theme, reload-and-verify offline persistence.
>   - Coverage gate: ≥80% lines, ≥70% branches on src/ via `vitest run --coverage`; CI fails below threshold.
>   - Run tests with `npm test` (watch in dev), `npm run test:ci` (CI mode with coverage), and `npx playwright test` for E2E.

> **Tip:** Deployment guide:
> - Deploy to Vercel or Cloudflare Pages (both have free tiers); connect the GitHub repo for auto-deploys.
>   - Environment variables: `VITE_API_URL` (mock backend URL), `VITE_SENTRY_DSN`, `VITE_APP_VERSION` (set in CI from git tag).
>   - Build command: `npm ci && npm run build`; output directory: `dist`.
>   - Add a `_headers` (Netlify) or `vercel.json` file with a strict CSP, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin.
>   - Post-deploy: verify the live URL loads, install the PWA, run a Lighthouse audit (target 90+ on all categories), confirm Sentry captures a deliberate test error, and check web-vitals RUM data is flowing.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Functionality (20 pts) — All P0 features work end-to-end with no console errors; transactions persist and survive reload.
>   2. Code quality (20 pts) — Modular ES modules, no globals, pure functions where appropriate, consistent naming, JSDoc on public APIs.
>   3. Testing (20 pts) — ≥80% line coverage with meaningful assertions; E2E covers the critical user flows; CI enforces coverage gate.
>   4. Performance and PWA (20 pts) — Lighthouse 90+ on Performance, Best Practices, SEO, Accessibility; installable; works offline; Core Web Vitals in the green.
>   5. Security and deployment (20 pts) — Strict CSP, sanitized DOM, httpOnly cookies if auth, secrets in env, deployed via CI with preview deploys and Sentry monitoring.
> 
> Stretch goals:
>   - Multi-currency with live conversion rates from a public API (cached in IndexedDB).
>   - Recurring transactions with a daily "tick" via the Page Visibility API or Background Sync.
>   - Trend line chart with optional moving average (computed with reduce).
>   - Import real bank CSVs (Chase, BofA) with a parser and column-mapping UI.
>   - Web Push notifications when a budget threshold is crossed (requires a push service).
>   - Multi-user sharing via the mock backend with optimistic UI and conflict resolution UI.
>   - Dark mode that respects `prefers-color-scheme` AND a manual toggle, persisted in localStorage.
>   - Export to PDF for tax season (via the browser print API + print CSS).

> **Tip:** Stretch goals:
> • Multi-currency with live conversion rates from a public API (cached in IndexedDB).
> • Recurring transactions with a daily "tick" via the Page Visibility API or Background Sync.
> • Trend line chart with optional moving average (computed with reduce).
> • Import real bank CSVs (Chase, BofA) with a parser and column-mapping UI.
> • Web Push notifications when a budget threshold is crossed (requires a push service).
> • Multi-user sharing via the mock backend with optimistic UI and conflict resolution UI.
> • Dark mode that respects `prefers-color-scheme` AND a manual toggle, persisted in localStorage.
> • Export to PDF for tax season (via the browser print API + print CSS).

