---
slug: fastapi-capstone-project
id: fastapi-capstone
track: fastapi
order: 21
title: "Capstone Project: Askable"
description: |-
  Build "Askable", a multi-tenant SaaS Q&A platform API (think a stripped-down
    Stack Overflow for B2B teams) where each organization (tenant) has its own
    private space for questions, answers, tags, and votes. The platform must
    support JWT auth with email verification, per-tenant data isolation e
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Capstone Project: Askable

## Askable

Problem statement:
Build "Askable", a multi-tenant SaaS Q&A platform API (think a stripped-down
  Stack Overflow for B2B teams) where each organization (tenant) has its own
  private space for questions, answers, tags, and votes. The platform must
  support JWT auth with email verification, per-tenant data isolation enforced
  at the repository layer, real-time "new answer" notifications via WebSockets,
  cached hot-question feeds via Redis, file attachments on answers, full-text
  search, and a robust test suite. The service must be deployable to a
  container orchestrator with health/readiness probes, graceful shutdown, and
  zero-downtime migrations. This project exercises every stage of the track:
  path operations, Pydantic v2, dependencies, OAuth2/JWT, async SQLAlchemy,
  WebSockets, file uploads, Redis caching, OpenAPI customization, layered
  project structure, error handling, performance tuning, and Docker deployment.

Target users:
• Engineering team leads who need a private Q&A space for their org.
• Individual contributors asking and answering technical questions.
• API consumers (front-end SPA, mobile app, Slack bot) hitting the REST API.
• Platform admins who manage tenants, billing scopes, and audit logs.

P0 (Must have) requirements:
• Multi-tenant data isolation: every query scoped by `tenant_id` from the
• JWT; cross-tenant access returns 404 (not 403, to hide existence).
• Email + password signup with bcrypt-hashed passwords and JWT access
• tokens (15-min TTL) + refresh tokens (7-day TTL, rotated, revocable).
• Email verification before login (signed token, 24h expiry).
• CRUD for Questions and Answers with tags, soft delete, and timestamps.
• Voting on Questions and Answers with reputation bookkeeping using
• `select_for_update` to prevent double-counting under concurrency.
• Per-tenant rate limiting (e.g., 100 req/min/user, 30 req/min anon)
• backed by Redis.
• WebSocket `/ws/questions/{id}` that broadcasts "new answer" events to
• connected clients of the same tenant only.
• File attachments on Answers (max 10MB, mime-type allowlist) streamed to
• S3 via `run_in_threadpool(boto3)`; downloads via presigned URLs.
• Full-text search on Questions using Postgres `tsvector` + GIN index.
• OpenAPI 3.1 schema with branded examples, security schemes, and
• per-tag descriptions; `/docs` disabled in prod, schema served.
• Health (`/health`, dep-free) and readiness (`/ready`, DB+Redis ping)
• endpoints for k8s probes.
• Docker multi-stage build; Gunicorn + UvicornWorker; `lifespan` for
• startup/shutdown; graceful drain on SIGTERM.
• pytest suite with ≥80% line coverage on core modules; CI runs ruff,
• mypy, pytest --cov.

P1 (Should have) requirements:
• Async Redis caching for hot-question feeds with per-tenant key
• namespacing and write-through invalidation on new answers.
• Audit log of admin actions (invite user, delete question) with diff.
• Background jobs (welcome email, digest) via FastAPI BackgroundTasks
• for sub-second work and Arq for durable multi-second work.
• API-key auth for service-to-service routes (Slack bot, ingest API).
• Pagination via cursor (not offset) for stable ordering under writes.
• Structured JSON logs (request_id, tenant_id, user_id, elapsed_ms).

P2 (Nice to have) requirements:
• AI-powered duplicate detection via pgvector embeddings of question
• bodies (return top-3 similar questions on submit).
• ActivityPub federation so two Askable instances can share questions.
• Per-tenant theming (logo upload, custom CSS).
• Webhooks for external integrations (Slack, Discord, custom HTTP).
• Mobile push notifications via Firebase Cloud Messaging.
• Audit log with full diff (django-auditlog-style or custom).

Tech stack:
• Python 3.12+
• FastAPI 0.110+
• Uvicorn[standard] + Gunicorn (UvicornWorker) for production
• Pydantic v2 + pydantic-settings for config
• SQLAlchemy 2.0 async + asyncpg (Postgres driver)
• Alembic for migrations
• Redis (redis.asyncio) for caching, rate limiting, and pub/sub
• boto3 (via run_in_threadpool) for S3 attachments
• python-jose (or pyjwt) for JWT, passlib[bcrypt] for password hashing
• pytest + pytest-asyncio + httpx.AsyncClient + factory-boy
• Docker (multi-stage) + docker-compose for local dev
• ruff (lint) + mypy (type-check) + pytest --cov for CI

> **Tip:** Testing strategy:
> - Unit tests for services: `vote()`, `signup()`, `search()`,
>     `presign_upload()` — using mocked repositories (via dependency overrides)
>     and a real (sqlite-in-memory or per-test Postgres schema) DB. Each test
>     in isolation with function-scoped fixtures.
>   - Integration tests for the API: every route via `httpx.AsyncClient` +
>     `ASGITransport(app=app)`, covering happy path, validation 422, auth 401,
>     not-found 404, conflict 409, and rate-limit 429.
>   - Concurrency test for voting: spawn 10 `asyncio.gather` voters on the
>     same question simultaneously; assert final vote count == 10 and
>     reputation sums correctly (relies on `select_for_update`).
>   - WebSocket test: use a `websockets` Python client to connect to
>     `/ws/questions/{id}?token=...`, post an Answer via the API, and assert
>     the WS client receives the `new_answer` event with the right payload.
>   - Multi-tenant isolation test: create two tenants with a question each;
>     fetch tenant A's question with tenant B's token and assert 404 (never
>     403 — hide existence).
>   - Coverage target: ≥80% line + 70% branch on `app/services/`,
>     `app/repositories/`, `app/api/`. Run `pytest --cov=app --cov-report=
>     term-missing --cov-fail-under=80`.
>   - CI: GitHub Actions runs `ruff check`, `mypy app`, `pytest --cov` on
>     every push and PR; merges to main require green CI and a successful
>     image build.

> **Tip:** Deployment guide:
> - Hosting: Render (web service + background worker + managed Postgres +
>     managed Redis) or Fly.io (Docker-based, multi-region) or ECS Fargate.
>   - Environment variables: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`,
>     `JWT_ALG=HS256`, `ACCESS_TTL=900`, `REFRESH_TTL=604800`, `S3_BUCKET`,
>     `S3_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`,
>     `MAIL_HOST`, `MAIL_USER`, `MAIL_PASSWORD`, `ENVIRONMENT=prod`,
>     `ALLOWED_HOSTS`, `LOG_LEVEL=info`.
>   - Build command: `pip install -r requirements.txt` (or `uv sync --frozen
>     --no-dev` if using uv). On Fly/Render, the Dockerfile is built by the
>     platform.
>   - Release command (migrations): `alembic upgrade head` — run as a deploy
>     step BEFORE new code serves traffic; on Render use the "release" hook,
>     on Fly use a `release_command` in `fly.toml`.
>   - Start command (web): `gunicorn app.main:app -k
>     uvicorn.workers.UvicornWorker -w 4 --bind 0.0.0.0:$PORT --proxy-headers
>     --forwarded-allow-ips="*" --max-requests 1000 --max-requests-jitter 100
>     --graceful-timeout 30 --timeout 30`.
>   - Start command (worker, if using Arq): `arq app.worker.WorkerSettings`.
>   - Health checks: Render/Fly/k8s probes hit `/health` (liveness, dep-free)
>     and `/ready` (readiness, DB+Redis ping). Configure 10s interval, 3s
>     timeout, 3 failures before restart.
>   - Post-deploy verification: `curl https://api.askable.example/health`
>     returns `{"status":"ok"}`; `/ready` returns 200; signup flow sends a
>     verification email; WS connects to `wss://api.askable.example/ws/
>     questions/<id>?token=...`; `/docs` returns 404 in prod but
>     `/openapi.json` is reachable with an API key.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Multi-tenant correctness (20 pts) — Every query is scoped by tenant_id;
>      cross-tenant reads return 404; tests prove isolation across tenants.
>   2. API design + OpenAPI (20 pts) — RESTful routes with proper status codes,
>      pagination (cursor), response_model filtering, branded error contract,
>      and a customized OpenAPI schema with examples and security schemes.
>   3. Concurrency + data integrity (20 pts) — Voting uses select_for_update;
>      reputation can't go negative; no double-counts under 10-concurrent-vote
>      test; rate limiting prevents abuse.
>   4. Real-time + async correctness (20 pts) — WebSocket fan-out is scoped by
>      tenant; blocking calls (boto3) are offloaded via run_in_threadpool; no
>      event-loop stalls; cache invalidation fires on post-commit.
>   5. Production readiness (20 pts) — Multi-stage Docker build under 300MB;
>      lifespan + graceful drain; health/ready split; ≥80% test coverage; CI
>      green; Alembic migrations run as a release step before traffic shifts.
> 
> Stretch goals:
>   - AI duplicate detection via pgvector: embed question bodies with a small
>     embedding model, store as `vector(384)`, return top-3 similar questions
>     on submit.
>   - ActivityPub federation so two Askable instances can share questions
>     across tenants (with explicit opt-in).
>   - GraphQL endpoint via `strawberry-graphql[asgi]` mounted at `/graphql`
>     with tenant-aware resolvers and depth limiting.
>   - Per-tenant theming (logo upload to S3, custom CSS injection on the SPA).
>   - Mobile push notifications via Firebase Cloud Messaging for new answers
>     on followed questions.
>   - Webhooks: per-tenant HTTP webhook on `question.answered` with HMAC
>     signing and retry (exponential backoff).
>   - Advanced moderation: comment threading, lock/merge questions, shadow-ban
>     repeat offenders.
>   - Real-time presence: "X users are viewing this question" via the
>     ConnectionManager.
>   - Audit log with full diff (before/after) using a generic JSON column.
>   - SLO monitoring: Prometheus metrics (`/metrics`) with RED metrics
>     (Rate, Errors, Duration) per route.

> **Tip:** Stretch goals:
> • AI duplicate detection via pgvector: embed question bodies with a small
> • embedding model, store as `vector(384)`, return top-3 similar questions
> • on submit.
> • ActivityPub federation so two Askable instances can share questions
> • across tenants (with explicit opt-in).
> • GraphQL endpoint via `strawberry-graphql[asgi]` mounted at `/graphql`
> • with tenant-aware resolvers and depth limiting.
> • Per-tenant theming (logo upload to S3, custom CSS injection on the SPA).
> • Mobile push notifications via Firebase Cloud Messaging for new answers
> • on followed questions.
> • Webhooks: per-tenant HTTP webhook on `question.answered` with HMAC
> • signing and retry (exponential backoff).
> • Advanced moderation: comment threading, lock/merge questions, shadow-ban
> • repeat offenders.
> • Real-time presence: "X users are viewing this question" via the
> • ConnectionManager.
> • Audit log with full diff (before/after) using a generic JSON column.
> • SLO monitoring: Prometheus metrics (`/metrics`) with RED metrics
> • (Rate, Errors, Duration) per route.

