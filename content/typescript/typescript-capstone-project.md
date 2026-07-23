---
slug: typescript-capstone-project
id: typescript-capstone
track: typescript
order: 21
title: "Capstone Project: Modern product teams need a fast, type-safe task..."
description: |-
  Modern product teams need a fast, type-safe task tracker that both a
    small ops team and an external API consumer can use. The system must
    expose a REST API with full end-to-end type safety (no `any`), support
    real-time updates over WebSockets, validate all input at the boundary
    with Zod, per
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Capstone Project: Modern product teams need a fast, type-safe task...

## Modern product teams need a fast, type-safe task...

Problem statement:
Modern product teams need a fast, type-safe task tracker that both a
  small ops team and an external API consumer can use. The system must
  expose a REST API with full end-to-end type safety (no `any`), support
  real-time updates over WebSockets, validate all input at the boundary
  with Zod, persist data to SQLite (with a typed query builder), and ship
  with a React + TypeScript single-page app. Authentication is JWT-based
  with branded UserId/TokenId types. The project is deployed as a single
  Node.js service to Fly.io (or Render) with a Postgres option for scale.
  This capstone exercises every concept from the 20-stage track: generics,
  conditional types, mapped types, discriminated unions, narrowing, branded
  types, tsconfig strict mode, Zod schemas, Vitest tests, and GitHub
  Actions CI.

Target users:
• A small ops team (3-10 people) that lives in the task tracker daily.
• An external API consumer building a Slack bot that posts task updates.
• A mobile engineer who wants a typed OpenAPI client generated from the
• server's TS types.
• A senior reviewer auditing the codebase for type-safety and CI hygiene.

P0 (Must have) requirements:
• Express (or Fastify) server in TypeScript with `strict: true` and
• `module: NodeNext`.
• Zod-validated request bodies, query strings, and route params on
• every endpoint; the inferred types flow into handlers (no `any`).
• REST endpoints: `POST /auth/login`, `POST /tasks`, `GET /tasks`,
• `PATCH /tasks/:id`, `DELETE /tasks/:id`.
• JWT auth middleware with branded `UserId` and `TokenId` types.
• SQLite persistence via `better-sqlite3` with a thin typed query
• helper (or Drizzle ORM).
• WebSocket endpoint `/ws` that broadcasts `task:created`,
• `task:updated`, `task:deleted` events with `CustomEvent<T>`-style
• typed payloads.
• React + TypeScript SPA with typed hooks, discriminated-union
• component props, and `useReducer` for state.
• Vitest unit tests for the service layer with `vi.mock` for the DB.
• GitHub Actions workflow running `typecheck`, `lint`, `test`, `build`
• in parallel jobs with `.tsbuildinfo` and `node_modules` caching.

P1 (Should have) requirements:
• Drizzle ORM migration scripts and a typed schema as the single
• source of truth for both the DB and the API types.
• Pagination (`?cursor=...&limit=...`) on `GET /tasks` with a typed
• `{ items, nextCursor }` response.
• Role-based access control (`admin` vs `user`) enforced at the type
• level via discriminated-union session objects.
• OpenAPI spec generated from the Zod schemas via `zod-to-openapi`,
• with a typed client generated via `openapi-typescript`.
• Playwright E2E test for the create-task-and-mark-complete flow.

P2 (Nice to have) requirements:
• Real-time optimistic updates in the React app with rollback on
• WebSocket error.
• A `Result<T, E>` algebraic data type wrapping every service call,
• eliminating thrown exceptions in the service layer.
• Property-based tests with `fast-check` for the URL and pagination
• cursor encoders.
• Deployment to Fly.io with a Dockerfile using multi-stage build
• (build with `tsc` + `esbuild`, runtime image only has `node` + JS).
• Observability: structured JSON logging and OpenTelemetry traces
• with typed span attributes.

```text
task-tracker/
├── .github/
│   └── workflows/
│       └── ci.yml
├── packages/
│   ├── server/
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   │   ├── jwt.ts
│   │   │   │   ├── middleware.ts
│   │   │   │   └── brands.ts
│   │   │   ├── db/
│   │   │   │   ├── schema.ts        # Drizzle schema
│   │   │   │   ├── client.ts
│   │   │   │   └── migrations/
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts
│   │   │   │   └── tasks.ts
│   │   │   ├── schemas/             # Zod schemas
│   │   │   │   ├── auth.ts
│   │   │   │   └── task.ts
│   │   │   ├── services/
│   │   │   │   ├── taskService.ts
│   │   │   │   └── result.ts        # Result<T, E>
│   │   │   ├── ws/
│   │   │   │   └── events.ts        # discriminated union events
│   │   │   ├── app.ts
│   │   │   └── index.ts
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   └── e2e/
│   │   ├── drizzle.config.ts
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   └── package.json
│   ├── web/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   │   └── useTasks.ts
│   │   │   ├── api/                  # typed client
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── package.json
│   └── shared/                       # cross-package types
│       ├── src/
│       │   ├── events.ts
│       │   └── index.ts
│       └── package.json
├── tsconfig.base.json
├── package.json                      # workspace root
├── pnpm-workspace.yaml
└── README.md
```
Caption: Suggested file structure

Tech stack:
• TypeScript 5.4+ with `strict`, `noUncheckedIndexedAccess`, `isolatedModules`.
• Node.js 20 LTS with `module: NodeNext` and `"type": "module"`.
• Express 4 (or Fastify 4) with `@types/express` for typed handlers.
• Zod for runtime validation at the API boundary; `z.infer<typeof X>` for types.
• Drizzle ORM with `better-sqlite3` (dev) and `pg` (prod) — single typed schema.
• `ws` for the WebSocket server with `CustomEvent<T>`-style typed payloads.
• React 18 + Vite + TypeScript for the SPA, with `useReducer` and typed hooks.
• `openapi-typescript` for generating a typed API client from the OpenAPI spec.
• Vitest for unit/integration tests; Playwright for E2E; `fast-check` for property tests.
• `typescript-eslint` with type-aware rules + Prettier for lint/format.
• GitHub Actions for CI; Fly.io (or Render) for deployment.

> **Tip:** Testing strategy:
> - Unit tests (Vitest) for every service function, mocking the Drizzle
>     client with `vi.mock`; target 80% line coverage on `services/` and
>     `routes/`.
>   - Integration tests that boot the Express app on a random port and
>     exercise endpoints with `supertest`, including auth flows, validation
>     errors, and pagination cursors.
>   - Property-based tests with `fast-check` for the cursor encoder/
>     decoder, the URL validator, and the JWT round-trip.
>   - E2E tests with Playwright covering the happy path (login, create
>     task, mark complete, delete) and one WebSocket round-trip.
>   - Coverage target: >=80% lines and >=70% branches on `packages/server`;
>     enforce via `vitest run --coverage` in CI with `--coverage.thresholds`.

> **Tip:** Deployment guide:
> - Deploy to Fly.io (free tier sufficient for the capstone) or Render's
>     free web service; both support Node 20 and a managed Postgres.
>   - Required environment variables: `DATABASE_URL`, `JWT_SECRET` (>=32
>     chars), `PORT` (default 3000), `NODE_ENV=production`,
>     `CORS_ORIGIN=https://<your-spa-domain>`.
>   - Build command: `pnpm install --frozen-lockfile && pnpm run build`
>     (runs `tsc --build` + `esbuild --bundle` for server, `vite build`
>     for SPA).
>   - Start command: `node packages/server/dist/index.js` (or the bundled
>     output of `esbuild`).
>   - Post-deploy verification: `curl https://<app>/health` returns 200;
>     run Drizzle migrations (`node dist/migrate.js`); hit the Swagger UI
>     at `/docs` and exercise one endpoint via the "Try it out" button.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Type safety (20 pts) — No `any` anywhere (CI-enforced via
>      `@typescript-eslint/no-explicit-any: error`); all API boundaries
>      validated with Zod; inferred types flow end-to-end from DB to API to
>      React client.
>   2. Architecture (20 pts) — Clean separation of routes, services, DB,
>      and WS layers; `Result<T, E>` used consistently in services; branded
>      ID types prevent cross-assignment; discriminated-union events are
>      exhaustively handled.
>   3. Testing (20 pts) — Unit tests with `vi.mock` for every service
>      function; integration tests for every endpoint; one Playwright E2E
>      covering the happy path; >=80% line coverage on `packages/server`.
>   4. CI/CD (20 pts) — GitHub Actions runs `typecheck`, `lint`, `test`,
>      `build` in parallel jobs; `node_modules` and `.tsbuildinfo` cached;
>      deployment via multi-stage Dockerfile to Fly.io or Render with
>      smoke-test verification.
>   5. Documentation and DX (20 pts) — `README.md` covers setup,
>      architecture, and the type-safety story; OpenAPI spec served at
>      `/openapi.json` with Swagger UI at `/docs`; a typed API client is
>      generated from the spec for external consumers.
> 
> Stretch goals:
>   - Replace Express with Fastify and measure the throughput improvement
>     on a `k6` load test.
>   - Add an Effect-TS-based variant of the service layer that uses
>     variance-annotated `Effect<R, E, A>` for compositional error handling.
>   - Implement a `tRPC` router alongside the REST API and expose the same
>     service layer via both transports.
>   - Add an admin dashboard with role-based access (admin vs user)
>     enforced at the type level via discriminated-union sessions.
>   - Generate a React Native client from the OpenAPI spec and ship a
>     mobile companion app.
>   - Add OpenTelemetry tracing with typed span attributes and ship traces
>     to a free Honeycomb or Grafana Cloud account.
>   - Implement real-time collaborative editing (multiple users editing
>     the same task) using CRDTs via `Yjs` with a typed document schema.
>   - Set up a property-based test suite that generates random API call
>     sequences with `fast-check` and asserts invariants over the system
>     state.

> **Tip:** Stretch goals:
> • Replace Express with Fastify and measure the throughput improvement
> • on a `k6` load test.
> • Add an Effect-TS-based variant of the service layer that uses
> • variance-annotated `Effect<R, E, A>` for compositional error handling.
> • Implement a `tRPC` router alongside the REST API and expose the same
> • service layer via both transports.
> • Add an admin dashboard with role-based access (admin vs user)
> • enforced at the type level via discriminated-union sessions.
> • Generate a React Native client from the OpenAPI spec and ship a
> • mobile companion app.
> • Add OpenTelemetry tracing with typed span attributes and ship traces
> • to a free Honeycomb or Grafana Cloud account.
> • Implement real-time collaborative editing (multiple users editing
> • the same task) using CRDTs via `Yjs` with a typed document schema.
> • Set up a property-based test suite that generates random API call
> • sequences with `fast-check` and asserts invariants over the system
> • state.

