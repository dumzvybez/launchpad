---
slug: go-capstone-project
id: go-capstone
track: go
order: 21
title: 'Capstone Project: URL shorteners are the "hello world" of backend...'
description: |-
  URL shorteners are the "hello world" of backend services — but a
    production-grade shortener exercises nearly every Go concept: HTTP
    routing, middleware, structured logging, metrics, persistence,
    caching, concurrency, graceful shutdown, configuration, Docker,
    and CI. In this capstone you will
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Capstone Project: URL shorteners are the "hello world" of backend...

## URL shorteners are the "hello world" of backend...

Problem statement:
URL shorteners are the "hello world" of backend services — but a
  production-grade shortener exercises nearly every Go concept: HTTP
  routing, middleware, structured logging, metrics, persistence,
  caching, concurrency, graceful shutdown, configuration, Docker,
  and CI. In this capstone you will build "shorty," a URL shortener
  service that accepts long URLs, returns short slugs, redirects
  visitors, tracks click counts concurrently, expires stale links,
  and exposes health/readiness/metrics endpoints. The service must
  handle 10,000 req/s on a single 2-vCPU container, survive
  graceful restarts without dropping in-flight requests, and ship
  with table-driven unit tests, integration tests against a real
  Postgres, a Dockerfile producing a <20MB image, and a GitHub
  Actions CI workflow running `go test -race`, golangci-lint, and a
  Docker build. The project deliberately mirrors the architecture
  of real systems like bit.ly, TinyURL, and HashiCorp's internal
  link-service — preparing you to build any Go microservice.

Target users:
• Marketing teams who need short, branded links for campaigns and
• want click analytics without writing code.
• Developers embedding a self-hosted shortener behind their own
• apps (CLI tools, dev docs, internal dashboards) via a clean HTTP
• API.
• Platform/SRE engineers deploying the service in Kubernetes who
• need /healthz, /readyz, and Prometheus metrics out of the box.
• Individual learners building a portfolio project that
• demonstrates end-to-end Go fluency (the capstone evaluator will
• read this code top-to-bottom).

P0 (Must have) requirements:
• POST /shorten { "url": "...", "ttl_seconds": 3600 } → returns
• { "slug": "abc123", "short_url": "https://s.example/abc123" }
• with the slug generated server-side (base62-encoded counter or
• hash).
• GET /{slug} → 301 redirect to the original URL, increments
• click count asynchronously, returns 404 for unknown slugs and
• 410 for expired slugs.
• GET /healthz → 200 OK (liveness; process up).
• GET /readyz → 200 if Postgres reachable AND cache warmed,
• 503 otherwise (readiness).
• GET /metrics → Prometheus text exposition (request count,
• latency histogram, click counter, in-flight gauge).
• Postgres-backed Store interface (slug → url, created_at,
• expires_at, clicks) with migrations via golang-migrate.
• In-process LRU cache (sync.Map or hashicorp/golang-lru/v2)
• with a configurable size; cache misses fall through to Postgres.
• Graceful shutdown on SIGINT/SIGTERM with a 10s drain.
• Structured JSON logging via log/slog with request IDs.
• Context-based cancellation plumbed through every layer
• (handler → service → store).
• Table-driven unit tests covering handler, service, and store
• with ≥80% line coverage on core packages.
• Multi-stage Dockerfile producing a distroless image <20MB.
• GitHub Actions workflow running `go test -race`, golangci-lint
• (≥6 linters enabled), and a Docker build on every push.

P1 (Should have) requirements:
• Click analytics batched via a buffered channel and flushed
• every 1s to Postgres (worker pool pattern from Stage 18).
• Custom short slugs via POST /shorten { "url": "...",
• "custom_slug": "my-link" } with conflict detection (409).
• DELETE /{slug} (soft delete; sets expires_at=now) with basic
• auth for the owner (HMAC-signed token).
• Rate limiting via golang.org/x/time/rate per IP on /shorten.
• Integration tests using testcontainers-go to spin up a real
• Postgres in CI.
• /debug/pprof endpoints on localhost:6060 (Stage 19 tooling).
• A `shorty migrate` cobra subcommand that runs up/down
• migrations.
• README with architecture diagram, local dev quickstart, and
• deployment instructions.

P2 (Nice to have) requirements:
• OpenTelemetry tracing exported to a local Jaeger via OTLP.
• Optional Redis-backed cache (behind the same Cacher interface
• as the in-process LRU).
• gRPC API mirroring the HTTP endpoints (gRPC-Go + grpc-gateway).
• Per-slug analytics endpoint GET /{slug}/stats returning
• clicks over time (timeseries bucketed per minute).
• Web UI in HTMX showing recent links and click counts.
• Horizontal scalability: hash-slot the click-counter flush so
• N replicas don't double-count.

```text
shorty/
├── cmd/
│   └── shorty/
│       └── main.go                 # cobra root + serve/migrate subcommands
├── internal/
│   ├── server/
│   │   ├── server.go               # http.Server, middleware, routes
│   │   ├── middleware.go           # logging, recovery, request-id, rate-limit
│   │   ├── handlers.go             # /shorten, /{slug}, /healthz, /readyz, /metrics
│   │   └── server_test.go          # table-driven handler tests with httptest
│   ├── shortener/
│   │   ├── service.go              # business logic: Create, Resolve, RecordClick
│   │   ├── service_test.go         # service-level unit tests with fake Store
│   │   └── slug.go                 # base62 slug generator
│   ├── store/
│   │   ├── store.go                # Store interface
│   │   ├── postgres.go             # pgx implementation
│   │   ├── postgres_test.go        # integration tests via testcontainers-go
│   │   └── memory.go               # in-memory implementation for unit tests
│   ├── cache/
│   │   ├── cache.go                # Cacher interface
│   │   └── lru.go                  # hashicorp/golang-lru/v2 implementation
│   ├── analytics/
│   │   ├── worker.go               # buffered-channel click counter
│   │   └── worker_test.go
│   ├── config/
│   │   └── config.go               # env-based config (koanf or manual)
│   └── platform/
│       ├── logger.go               # slog setup
│       ├── metrics.go              # prometheus collectors
│       └── shutdown.go             # signal handling + graceful drain
├── migrations/
│   ├── 0001_init.up.sql
│   └── 0001_init.down.sql
├── .golangci.yml
├── Dockerfile
├── docker-compose.yml              # shorty + Postgres + Jaeger for local dev
├── Makefile
├── go.mod
├── go.sum
└── README.md
```
Caption: Suggested file structure

Tech stack:
• Go 1.21+ (uses log/slog, errors.Join, slices, maps, context.AfterFunc)
• Standard library net/http (no chi/gin needed; http.ServeMux in 1.22+
• supports method+path patterns, but classic mux with a small router
• wrapper also works)
• cobra (CLI) + pflag (flags) — github.com/spf13/cobra
• pgx/v5 (Postgres driver) — github.com/jackc/pgx/v5
• golang-migrate (migrations) — github.com/golang-migrate/migrate/v4
• hashicorp/golang-lru/v2 (in-process LRU cache, generics)
• prometheus/client_golang (metrics)
• golang.org/x/time/rate (rate limiting)
• golang.org/x/sync/errgroup (error-aware concurrency)
• testcontainers-go (integration tests with real Postgres)
• log/slog (structured logging)
• golangci-lint (CI linting)
• Docker multi-stage build with gcr.io/distroless/static-debian12

> **Tip:** Testing strategy:
> - Unit tests (table-driven, in-memory fakes): handlers, service,
>     slug generator, in-memory store, LRU cache, analytics worker.
>     Use `t.Run` subtests, `t.Parallel` where safe, `t.Setenv` for
>     config. Target ≥80% line coverage on `internal/shortener`,
>     `internal/store/memory`, `internal/analytics`, `internal/cache`.
>   - Integration tests (testcontainers-go, real Postgres):
>     `PostgresStore` end-to-end — run migrations, exercise CRUD,
>     verify batched flush correctness, test concurrent increments
>     under `-race`. These run in CI but are skipped locally without
>     Docker (`go test -short ./...` skips them via `testing.Short()`).
>   - E2E test (docker-compose + httptest): start the full stack
>     (shorty + Postgres), hit /shorten, follow the redirect, verify
>     click count incremented. One E2E test in `test/e2e_test.go`.
>   - Coverage target: ≥80% line coverage on core modules
>     (`internal/shortener`, `internal/store`, `internal/analytics`,
>     `internal/cache`, `internal/server`). Run `go test -race -cover
>     -coverprofile=cover.out ./...` then `go tool cover -func=cover.out`.
>   - Race detector: every `go test` in CI uses `-race`. Never commit
>     a failing race report — it's a bug, not flakiness.
>   - Benchmarks: `BenchmarkResolve_CacheHit`,
>     `BenchmarkResolve_CacheMiss`, `BenchmarkSlugGenerate`. Run with
>     `go test -bench=. -benchmem ./...` and track regressions in CI
>     via benchstat.

> **Tip:** Deployment guide:
> - Container: build with `docker build -t ghcr.io/you/shorty:v0.1.0
>     .` and push to GHCR. The distroless final image is <20MB.
>   - Orchestration: deploy to Kubernetes with a Deployment (2 replicas
>     minimum), a Service (ClusterIP), and an Ingress. Configure a
>     `readinessProbe` on /readyz and `livenessProbe` on /healthz,
>     `preStop: sleep 10` to let the load balancer deregister.
>   - Environment variables (configure via k8s Secret/ConfigMap):
>     `SHORTY_ADDR` (default `:8080`), `SHORTY_DB_DSN` (Postgres URL),
>     `SHORTY_CACHE_SIZE` (default 10000), `SHORTY_ANALYTICS_FLUSH_MS`
>     (default 1000), `SHORTY_RATE_LIMIT_RPS` (default 10),
>     `SHORTY_LOG_LEVEL` (default info), `SHORTY_LOG_FORMAT` (json or
>     text).
>   - Build command (CI): `CGO_ENABLED=0 go build -ldflags='-s -w' -o
>     bin/shorty ./cmd/shorty`.
>   - Start command (container entrypoint): `/shorty serve` (or
>     `/shorty migrate up && /shorty serve` if your orchestrator
>     supports init containers, prefer the latter via a k8s initContainer
>     so app replicas don't race migrations).
>   - Post-deploy verification: (1) `curl https://shorty.example/healthz`
>     returns 200, (2) `curl -X POST https://shorty.example/shorten -d
>     '{"url":"https://example.com"}'` returns a slug, (3) the
>     returned short URL 301-redirects to the original, (4) `curl
>     https://shorty.example/metrics | grep shorty_requests_total`
>     shows incrementing counters, (5) `kubectl rollout status
>     deployment/shorty` reports the rollout complete, (6) send
>     SIGTERM to one pod and verify zero 5xx in the load balancer
>     logs (graceful shutdown works).
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Correctness & API contract (20 pts) — All P0 endpoints behave
>      per spec (POST /shorten returns a slug; GET /{slug} 301s or
>      returns 404/410; /healthz and /readyz are correct; /metrics
>      exposes the required Prometheus metrics). Edge cases (expired
>      slugs, unknown slugs, malformed JSON, rate-limit) handled
>      gracefully with the right status codes.
>   2. Go idioms & concurrency (20 pts) — Code follows Go idioms:
>      table-driven tests, errors.Is/As, context propagation through
>      every layer, no goroutine leaks, proper use of channels/mutex/
>      errgroup, no copied Mutex, no naked returns in long functions,
>      golint-clean names, exported identifiers documented.
>   3. Architecture & testability (20 pts) — Clean separation: cmd →
>      server → service → store (interface) → postgres/memory. Each
>      layer testable in isolation via fakes. The Store interface
>      allows swapping implementations without touching handlers.
>      Configuration via env vars; no global state; slog-based logging
>      that's testable.
>   4. Testing & CI (20 pts) — ≥80% line coverage on core packages;
>      -race clean; integration tests with testcontainers pass in CI;
>      GitHub Actions runs `go test -race`, golangci-lint (≥6 linters),
>      and a Docker build on every PR; CI is green on the main branch.
>   5. Production readiness (20 pts) — Multi-stage Dockerfile <20MB;
>      graceful shutdown verified (zero 5xx on SIGTERM); /healthz and
>      /readyz behave correctly when Postgres is down; metrics and
>      structured logs observable; README documents deployment,
>      configuration, and operational runbooks (what to do when the
>      click counter falls behind, when Postgres is degraded, etc.).
> 
> Stretch goals:
>   - OpenTelemetry tracing exported via OTLP to Jaeger; trace every
>     HTTP request through service → store → cache, with spans for
>     cache hit/miss and Postgres query.
>   - Redis-backed cache behind the same Cacher interface; runtime-
>     selectable between in-process LRU and Redis via env var.
>   - gRPC API mirroring HTTP endpoints via grpc-gateway; generated
>     stubs checked in.
>   - Per-slug analytics: GET /{slug}/stats returns clicks bucketed
>     per minute for the last 24h, served from a separate time-series
>     table.
>   - Hash-slot the click-counter flush so N replicas don't
>     double-count (use slug-hash mod N to assign each slug to a
>     replica that owns its counter).
>   - HTMX-based admin UI showing recent links, click counts, and a
>     delete button — no JavaScript framework, just server-rendered
>     HTML.
>   - Custom branded domains (CNAME support) with per-domain rate
>     limits and analytics.
>   - Audit log of all admin operations (create/delete) shipped to a
>     separate append-only log via outbox pattern.

> **Tip:** Stretch goals:
> • OpenTelemetry tracing exported via OTLP to Jaeger; trace every
> • HTTP request through service → store → cache, with spans for
> • cache hit/miss and Postgres query.
> • Redis-backed cache behind the same Cacher interface; runtime-
> • selectable between in-process LRU and Redis via env var.
> • gRPC API mirroring HTTP endpoints via grpc-gateway; generated
> • stubs checked in.
> • Per-slug analytics: GET /{slug}/stats returns clicks bucketed
> • per minute for the last 24h, served from a separate time-series
> • table.
> • Hash-slot the click-counter flush so N replicas don't
> • double-count (use slug-hash mod N to assign each slug to a
> • replica that owns its counter).
> • HTMX-based admin UI showing recent links, click counts, and a
> • delete button — no JavaScript framework, just server-rendered
> • HTML.
> • Custom branded domains (CNAME support) with per-domain rate
> • limits and analytics.
> • Audit log of all admin operations (create/delete) shipped to a
> • separate append-only log via outbox pattern.

