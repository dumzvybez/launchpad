---
slug: nodejs-capstone-project
id: nodejs-capstone
track: nodejs
order: 21
title: "Capstone Project: Background-job queues are the backbone of nearly every..."
description: |-
  Background-job queues are the backbone of nearly every non-trivial
    Node backend: send-welcome-email, generate-pdf, transcode-video,
    sync-to-crm, process-webhook. In this capstone you will build
    "queue-hub," a real-time job queue service that accepts jobs via
    an HTTP API, persists them in Pos
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# Capstone Project: Background-job queues are the backbone of nearly every...

## Background-job queues are the backbone of nearly every...

Problem statement:
Background-job queues are the backbone of nearly every non-trivial
  Node backend: send-welcome-email, generate-pdf, transcode-video,
  sync-to-crm, process-webhook. In this capstone you will build
  "queue-hub," a real-time job queue service that accepts jobs via
  an HTTP API, persists them in PostgreSQL, executes them in worker
  threads (CPU-bound) and child processes (external binaries),
  streams live status updates to browsers over WebSocket, exposes
  Prometheus metrics, and ships as a Docker image deployable to
  Kubernetes. The service must handle 1,000 jobs/s submission rate,
  execute jobs concurrently without blocking the event loop, survive
  graceful restarts without losing in-flight work, and ship with
  node:test unit tests, supertest integration tests, Playwright E2E
  for the dashboard, and a CI workflow that builds the Docker image
  on every push. The project deliberately mirrors real systems like
  BullMQ, Sidekiq, and Celery — preparing you to build any Node
  microservice that combines HTTP, WebSockets, persistence, and
  background work.

Target users:
• Backend developers who need a self-hostable job queue without
• adopting Redis+BullMQ or SQS — they want HTTP submit + WebSocket
• status in one binary.
• Frontend/fullstack developers building dashboards that need
• real-time job progress (uploads, transcoding, batch reports)
• without setting up a separate real-time service.
• Platform/SRE engineers deploying to Kubernetes who need
• /healthz, /readyz, Prometheus metrics, and graceful shutdown
• out of the box.
• Individual learners building a portfolio project that
• demonstrates end-to-end Node fluency: http, streams, worker
• threads, child processes, Postgres, WebSockets, testing,
• Docker, and CI (the capstone evaluator will read this code
• top-to-bottom).

P0 (Must have) requirements:
• POST /jobs { "type": "email"|"image"|"shell", "payload": {} }
• → 202 Accepted with { "id": "uuid", "status": "queued" }; the
• server persists the job in Postgres and enqueues it.
• GET /jobs/:id → 200 with current status (queued | running |
• succeeded | failed), result, error, retries, timing.
• GET /jobs?status=running&limit=50 → paginated list filtered
• by status.
• Worker-thread executor for CPU-bound jobs (e.g. image hash,
• factorial) that does NOT block the event loop.
• Child-process executor for shell jobs (with strict arg-array
• passing — no shell injection).
• WebSocket server on the same HTTP port (ws upgrade) that
• pushes job status changes to subscribed clients
• (subscribe via { "type": "subscribe", "jobId": "..." }).
• Postgres schema (jobs table: id, type, payload jsonb, status,
• result jsonb, error text, attempts int, created_at, started_at,
• finished_at) via node-pg-migrate.
• Connection pool via pg.Pool (max 20) with parameterized
• queries (no SQL injection).
• GET /healthz → 200 (liveness; process up).
• GET /readyz → 200 if Postgres reachable AND worker pool ready,
• 503 otherwise (readiness).
• GET /metrics → Prometheus text exposition (jobs_total by
• status, job_duration_seconds histogram, queue_depth gauge,
• worker_pool_size gauge).
• Graceful shutdown on SIGINT/SIGTERM: stop accepting new jobs,
• finish in-flight workers (10s grace), close DB pool, exit 0.
• Structured JSON logging via pino with request IDs and job IDs.
• node:test unit tests for queue, worker pool, and routes;
• supertest integration tests for every endpoint; ≥80% line
• coverage on core modules.
• Multi-stage Dockerfile producing a distroless image <150MB.
• GitHub Actions workflow running tests, linting, and Docker
• build on every push; image pushed to GHCR on tag.

P1 (Should have) requirements:
• Job retry with exponential backoff (max 3 attempts).
• Job timeout (configurable per type; default 30s) using
• AbortController on fetch-style jobs and worker.terminate()
• on CPU jobs.
• Worker pool of configurable size (default 4) reusing workers
• across jobs (Stage 13 pattern).
• Rate limiting on POST /jobs via a token bucket (10 rps per IP).
• Idempotency: POST /jobs with an Idempotency-Key header returns
• the existing job if the key was seen in the last 24h.
• Playwright E2E test that opens the dashboard, submits a job,
• and verifies the WebSocket updates the status in real time.
• Per-job-type concurrency limits (don't run more than 2 shell
• jobs at once even if 4 workers are free).
• README with architecture diagram, local dev quickstart
• (docker-compose up), env var reference, and deployment guide.

P2 (Nice to have) requirements:
• OpenTelemetry tracing exported via OTLP to a local Jaeger;
• trace every job through HTTP → queue → worker → DB.
• Delayed jobs (POST /jobs with "delay_seconds": 60).
• Scheduled/cron jobs via a separate scheduler process.
• Dead-letter queue for jobs that exhaust retries.
• Admin dashboard (HTMX, no JS framework) showing queue depth,
• recent jobs, worker pool stats, and a "retry failed" button.
• Horizontal scalability: use Postgres SKIP LOCKED for safe
• concurrent job claiming across N replicas.

```text
queue-hub/
├── src/
│   ├── server.js                  # http + ws server bootstrap
│   ├── app.js                     # express/fastify app (exported for tests)
│   ├── routes/
│   │   ├── jobs.js                # POST /jobs, GET /jobs/:id, GET /jobs
│   │   ├── health.js              # /healthz, /readyz
│   │   └── metrics.js             # /metrics (prometheus)
│   ├── queue/
│   │   ├── queue.js               # in-process queue (events + buffer)
│   │   └── queue.test.js          # node:test unit tests
│   ├── workers/
│   │   ├── pool.js                # worker_threads pool (Stage 13 pattern)
│   │   ├── executors/
│   │   │   ├── email.js           # async fetch-based executor
│   │   │   ├── image.js           # worker-thread CPU executor
│   │   │   └── shell.js           # child_process.spawn executor
│   │   └── worker.js              # worker thread entry script
│   ├── db/
│   │   ├── pool.js                # pg.Pool singleton
│   │   ├── jobs.js                # job CRUD with parameterized queries
│   │   └── jobs.test.js           # node:test with testcontainers
│   ├── ws/
│   │   └── hub.js                 # WebSocket hub broadcasting job updates
│   ├── platform/
│   │   ├── logger.js              # pino setup
│   │   ├── metrics.js             # prom-client collectors
│   │   └── shutdown.js            # SIGINT/SIGTERM graceful drain
│   └── config.js                  # env-based frozen config
├── migrations/
│   ├── 001_init.up.sql
│   └── 001_init.down.sql
├── test/
│   ├── integration.test.js        # supertest against app.js
│   ├── e2e.test.js                # Playwright against running server
│   └── fixtures/
├── public/
│   └── index.html                 # tiny dashboard for Playwright + manual
├── ecosystem.config.js            # PM2 cluster config
├── Dockerfile                     # multi-stage, distroless final
├── docker-compose.yml             # queue-hub + Postgres + Jaeger for dev
├── .dockerignore
├── .github/workflows/ci.yml
├── package.json
├── package-lock.json
└── README.md
```
Caption: Suggested file structure

Tech stack:
• Node.js 20 LTS+ (ESM, `"type": "module"`)
• Fastify (3x faster than Express; built-in JSON schema validation)
• pg (PostgreSQL driver) with pg.Pool for connection pooling
• node-pg-migrate (migration runner)
• ws (WebSocket server, attached to the http server)
• worker_threads (CPU-bound jobs in parallel threads)
• child_process.spawn (external binary jobs, no shell)
• pino (structured JSON logging, fastest Node logger)
• prom-client (Prometheus metrics)
• zod (input validation on POST /jobs payload)
• node:test (built-in unit tests, no install needed)
• supertest (HTTP integration tests)
• Playwright (E2E browser tests for the dashboard)
• c8 (coverage; V8-based, no instrumentation)
• Docker multi-stage build with gcr.io/distroless/nodejs20-debian12
• GitHub Actions for CI (test, lint, build, push image)

> **Tip:** Testing strategy:
> - Unit tests (node:test, no external deps): queue logic, worker
>     pool, idempotency map, rate limiter token bucket, zod schemas,
>     executor timeouts (use fake fetch / fake timers). Use `t.test`
>     subtests; target ≥80% coverage on `src/queue`, `src/workers/pool`,
>     `src/db/jobs`, `src/routes`. Run with `node --test`.
>   - Integration tests (supertest + real Postgres): mount the Fastify
>     app via `supertest(app.server)` (Fastify exposes `.server`), fire
>     HTTP requests covering success, validation errors, 404s, rate
>     limit 429, and idempotent replays. Spin up Postgres via
>     testcontainers or docker-compose; run migrations before tests.
>   - E2E test (Playwright against a running server): start the full
>     stack via `docker compose up -d`, open `http://localhost:3000/`
>     in Chromium, submit a job via the dashboard form, and verify the
>     WebSocket updates the status from `queued` to `running` to
>     `succeeded` within 5s. One E2E test in `test/e2e.test.js`.
>   - Coverage target: ≥80% line coverage on core modules
>     (`src/queue`, `src/workers/pool`, `src/db/jobs`, `src/routes`,
>     `src/ws/hub`). Run `c8 --reporter=text --reporter=html node
>     --test` and view `coverage/index.html`.
>   - Race detector equivalent: run integration tests with
>     `--expose-gc` and call `global.gc()` between tests to flush
>     closures; use `--detect-open-handlers` (Node 21+) to catch
>     leaked timers/sockets.
>   - Benchmarks: `Benchmark.submitJob`, `Benchmark.workerPool`,
>     `Benchmark.websocketBroadcast`. Run with `node --test --bench`
>     (Node 22+) or via `mitata` and track regressions in CI.

> **Tip:** Deployment guide:
> - Container: build with `docker build -t ghcr.io/myorg/queue-hub:
>     v0.1.0 .` and push to GHCR. The distroless final image is
>     <150MB.
>   - Orchestration: deploy to Kubernetes with a Deployment (3
>     replicas minimum), a Service (ClusterIP), and an Ingress.
>     Configure a `readinessProbe` on /readyz and `livenessProbe` on
>     /healthz, `preStop: exec: command: ["node", "src/drain.js"]` to
>     let the load balancer deregister before SIGTERM.
>   - Environment variables (configure via k8s Secret/ConfigMap):
>     `PORT` (default 3000), `DATABASE_URL` (Postgres URL — required),
>     `WORKER_POOL_SIZE` (default 4), `LOG_LEVEL` (default info),
>     `NODE_ENV` (production), `RATE_LIMIT_RPS` (default 10),
>     `JOB_TIMEOUT_SECONDS` (default 30), `OTEL_EXPORTER_OTLP_ENDPOINT`
>     (optional, for Jaeger).
>   - Build command (CI): `npm ci && npm run build` (if applicable).
>   - Start command (container entrypoint): `node src/server.js` (the
>     server runs migrations on boot OR you run `npm run migrate up`
>     as a k8s initContainer — prefer the latter so app replicas
>     don't race migrations).
>   - Post-deploy verification: (1) `curl https://queue-hub.example/
>     healthz` returns 200; (2) `curl -X POST .../jobs -d '{"type":
>     "email","payload":{"to":"a@b.com"}}'` returns 202 with a job
>     ID; (3) the WebSocket at `wss://queue-hub.example/` accepts a
>     `{type:"subscribe",jobId:"..."}` message and pushes status
>     updates; (4) `curl .../metrics | grep queue_hub_jobs_total`
>     shows incrementing counters; (5) `kubectl rollout status
>     deployment/queue-hub` reports the rollout complete; (6) send
>     SIGTERM to one pod and verify zero 5xx in the load balancer
>     logs (graceful shutdown works).
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Correctness & API contract (20 pts) — All P0 endpoints behave
>      per spec (POST /jobs returns 202 with a UUID; GET /jobs/:id
>      returns correct status; WebSocket pushes live updates; /healthz
>      and /readyz are correct; /metrics exposes the required
>      Prometheus metrics). Edge cases (invalid payload, unknown job
>      ID, rate-limit overflow, idempotency replay) handled with the
>      right status codes.
>   2. Node idioms & concurrency (20 pts) — Code follows Node idioms:
>      async/await everywhere, no sync fs in handlers, worker_threads
>      for CPU work, child_process.spawn (not exec) for shells,
>      AbortController for timeouts, EventEmitter for the queue,
>      proper error-first patterns, `process.on("SIGINT")` graceful
>      drain, no unhandled rejections.
>   3. Architecture & testability (20 pts) — Clean separation: routes
>      → queue → workers → executors → db. Each layer testable in
>      isolation via fakes. The DB module is an interface (Postgres
>      impl swappable for an in-memory impl in unit tests).
>      Configuration via frozen env-loaded object; no global state
>      beyond singletons; pino logging with request IDs and job IDs.
>   4. Testing & CI (20 pts) — ≥80% line coverage on core modules;
>      node:test unit tests for queue, pool, executors; supertest
>      integration tests for every endpoint; Playwright E2E for the
>      dashboard; GitHub Actions runs tests, lint, and Docker build
>      on every PR; CI is green on the main branch.
>   5. Production readiness (20 pts) — Multi-stage Dockerfile <150MB
>      distroless; graceful shutdown verified (zero 5xx on SIGTERM);
>      /healthz and /readyz behave correctly when Postgres is down;
>      metrics and structured logs observable; PM2 ecosystem.config.js
>      provided for single-host deployment; k8s YAML with liveness,
>      readiness, resources, and `preStop` hook; README documents
>      deployment, configuration, and operational runbooks.
> 
> Stretch goals:
>   - OpenTelemetry tracing exported via OTLP to Jaeger; trace every
>     job through HTTP → queue → worker → DB, with spans for pool
>     acquire, DB query, and executor time.
>   - Delayed jobs: POST /jobs with "delay_seconds": 60 enqueues the
>     job at time + 60s; implement via a sorted set in Postgres
>     polled by a scheduler.
>   - Scheduled/cron jobs: a separate `scheduler.js` process that
>     enqueues jobs on a cron schedule (use `node-cron`).
>   - Dead-letter queue: jobs that exhaust retries are moved to a
>     `dead_jobs` table and exposed via GET /dead-jobs for inspection
>     and re-queueing.
>   - Admin dashboard (HTMX, no JS framework): queue depth gauge,
>     recent jobs table with status, worker pool stats, "retry failed"
>     button that re-enqueues dead jobs.
>   - Horizontal scalability: use `SELECT ... FOR UPDATE SKIP LOCKED
>     LIMIT 1` so N queue-hub replicas can safely claim jobs from the
>     same Postgres without double-execution.
>   - Per-tenant rate limits and quotas: track per-API-key usage in
>     Postgres, enforce concurrent-job limits per tenant.
>   - Audit log of all admin operations (retry, delete, requeue)
>     shipped to a separate `audit_log` table with timestamp, admin
>     ID, and job ID.
>   - S3-backed large-payload storage: payloads >1MB are stored in
>     S3 and the job row references the S3 key instead of inlining
>     JSONB.

> **Tip:** Stretch goals:
> • OpenTelemetry tracing exported via OTLP to Jaeger; trace every
> • job through HTTP → queue → worker → DB, with spans for pool
> • acquire, DB query, and executor time.
> • Delayed jobs: POST /jobs with "delay_seconds": 60 enqueues the
> • job at time + 60s; implement via a sorted set in Postgres
> • polled by a scheduler.
> • Scheduled/cron jobs: a separate `scheduler.js` process that
> • enqueues jobs on a cron schedule (use `node-cron`).
> • Dead-letter queue: jobs that exhaust retries are moved to a
> • `dead_jobs` table and exposed via GET /dead-jobs for inspection
> • and re-queueing.
> • Admin dashboard (HTMX, no JS framework): queue depth gauge,
> • recent jobs table with status, worker pool stats, "retry failed"
> • button that re-enqueues dead jobs.
> • Horizontal scalability: use `SELECT ... FOR UPDATE SKIP LOCKED
> • LIMIT 1` so N queue-hub replicas can safely claim jobs from the
> • same Postgres without double-execution.
> • Per-tenant rate limits and quotas: track per-API-key usage in
> • Postgres, enforce concurrent-job limits per tenant.
> • Audit log of all admin operations (retry, delete, requeue)
> • shipped to a separate `audit_log` table with timestamp, admin
> • ID, and job ID.
> • S3-backed large-payload storage: payloads >1MB are stored in
> • S3 and the job row references the S3 key instead of inlining
> • JSONB.

