---
slug: python-capstone-project
id: python-capstone
track: python
order: 21
title: "Capstone Project: Build a URL Shortener with Analytics — a..."
description: |-
  Build a URL Shortener with Analytics — a production-grade service that
    takes long URLs, generates short memorable slugs, redirects visitors
    with 301/302 status codes, and tracks every click with timestamp,
    IP address, and user-agent. The service must persist data in
    PostgreSQL, cache hot slu
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Capstone Project: Build a URL Shortener with Analytics — a...

## Build a URL Shortener with Analytics — a...

Problem statement:
Build a URL Shortener with Analytics — a production-grade service that
  takes long URLs, generates short memorable slugs, redirects visitors
  with 301/302 status codes, and tracks every click with timestamp,
  IP address, and user-agent. The service must persist data in
  PostgreSQL, cache hot slugs in Redis, expose a REST API with proper
  status codes, ship as a Docker image, run on Render or Fly.io, and
  pass a CI pipeline (ruff + mypy + pytest with ≥80% coverage). This
  project exercises every concept from the 20-stage track: HTTP APIs,
  databases, caching, testing, Docker, CI/CD, and deployment.

Target users:
• Marketing teams who need trackable short links for email and social campaigns.
• Internal engineering teams who want branded short links for documentation and on-call runbooks.
• Individual content creators who want click analytics on shared links without a SaaS subscription.

P0 (Must have) requirements:
• POST /shorten accepts a JSON body {"url": "..."} and returns {"short_url": "...", "slug": "..."}
• GET /<slug> issues a 301 redirect to the stored long URL; returns 404 if slug not found
• PostgreSQL persistence for slugs and long URLs (id, slug, long_url, created_at, expires_at)
• Click tracking: every redirect records (slug, timestamp, ip, user_agent) in a clicks table
• GET /api/stats/<slug> returns {"total_clicks": N, "last_24h_clicks": M, "created_at": "..."}
• Basic input validation: reject malformed URLs with 422; reject slugs already in use with 409
• GET /health returns 200 {"status": "ok"} for platform health checks
• Dockerized via Dockerfile + docker-compose (app + postgres + redis)
• pytest suite with ≥80% line coverage on src/shortener/
• pyproject.toml with [project.scripts] entry point and src/ layout

P1 (Should have) requirements:
• Redis cache for hot slugs (cache long_url for 5 min; invalidate on update)
• Custom slugs: POST /shorten accepts optional "slug" field
• URL expiration: optional "expires_at" ISO timestamp; expired slugs return 410 Gone
• Rate limiting on POST /shorten (e.g. 10/min per IP) via slowapi or redis
• API key auth on /api/stats endpoints (X-API-Key header, validated against env var)
• Structured JSON logging via structlog or python-json-logger

P2 (Nice to have) requirements:
• QR code generation: GET /<slug>/qrcode returns a PNG
• Browser/OS/country detection from user-agent and IP (ua-parser + geoip2)
• A/B testing: a slug can map to multiple destinations with weighted random selection
• Custom domains (CNAME verification)
• CSV export: GET /api/stats/<slug>/export.csv
• Prometheus metrics endpoint at /metrics
• OpenTelemetry tracing with OTLP exporter
• Simple Jinja2 web UI for browsing stats

```text
url-shortener/
    pyproject.toml
    README.md
    Dockerfile
    docker-compose.yml
    .dockerignore
    .env.example
    .github/
        workflows/
            ci.yml
    src/
        shortener/
            __init__.py
            __version__.py
            main.py             # FastAPI app factory + lifespan
            config.py           # pydantic-settings Settings
            database.py         # async SQLAlchemy engine + session
            cache.py            # Redis client + helpers
            models.py           # SQLModel: ShortUrl, Click
            logging_setup.py    # structlog configuration
            api/
                __init__.py
                router.py       # combines all routers
                shorten.py      # POST /shorten
                redirect.py     # GET /<slug>
                stats.py        # GET /api/stats/<slug>
                health.py       # GET /health
            services/
                __init__.py
                slug.py         # slug generation (nanoid or shortuuid)
                analytics.py    # click recording (async)
                rate_limit.py   # redis-backed rate limiter
            middleware/
                __init__.py
                request_id.py   # adds X-Request-ID to every response
    tests/
        __init__.py
        conftest.py             # fixtures: test client, test DB, redis mock
        test_shorten.py
        test_redirect.py
        test_stats.py
        test_health.py
        test_slug.py
        test_analytics.py
```
Caption: Suggested file structure

Tech stack:
• Python 3.12 (latest stable at time of writing)
• FastAPI 0.110+ — ASGI web framework with auto OpenAPI docs
• Uvicorn / Gunicorn — ASGI server (gunicorn with UvicornWorker in prod)
• SQLModel (or SQLAlchemy 2.0 async) — ORM combining Pydantic + SQLAlchemy
• PostgreSQL 16 — primary datastore
• Redis 7 — cache layer for hot slugs + rate limiting
• Pydantic 2 + pydantic-settings — request/response validation and config
• httpx + pytest-asyncio — async test client and tests
• nanoid or shortuuid — URL-safe slug generation
• structlog — structured JSON logging
• Docker + docker-compose — local dev environment matching prod
• GitHub Actions — CI (lint + type-check + test) and CD (deploy on tag)
• Render.com — hosting (web service + managed Postgres + managed Redis)
• Ruff + mypy — lint, format, and type-check

> **Tip:** Testing strategy:
> - Unit tests with pytest for pure functions: slug generation, URL validation,
>     expiration logic, analytics aggregation. Use pytest.mark.parametrize for
>     table-driven cases (e.g. 5 slug-length variants, 10 URL validity cases).
>   - Integration tests with a real PostgreSQL (testcontainers-python) or a
>     sqlite-async fallback for CI speed. Each test runs in a transaction that
>     rolls back, so tests are isolated and fast.
>   - API tests with httpx.AsyncClient + ASGITransport(app=app) — no real port
>     needed. Test status codes, headers, and JSON bodies for /shorten, /<slug>,
>     /api/stats, /health.
>   - ≥80% line coverage on src/shortener/ (core modules at 95%+); enforce via
>     `pytest --cov=src/shortener --cov-fail-under=80` in CI.
>   - Run tests with: `pytest --cov=src/shortener --cov-report=term-missing
>     --cov-report=html`. Async tests use `@pytest.mark.asyncio` and pytest-
>     asyncio in auto mode.

> **Tip:** Deployment guide:
> - Deploy to Render.com: create a Web Service (Docker), a managed PostgreSQL
>     (free tier OK for demo), and a managed Redis (free tier).
>   - Environment variables to set in Render dashboard: DATABASE_URL (from
>     Render Postgres internal URL), REDIS_URL (from Render Redis), BASE_URL
>     (https://your-app.onrender.com), API_KEY (generate a 32-char secret),
>     RATE_LIMIT_PER_MIN=10, PYTHONUNBUFFERED=1.
>   - Build command (Render runs this on each deploy): `pip install -e .` (or
>     just use the Dockerfile — Render builds the image automatically).
>   - Start command: `gunicorn shortener.main:app -k
>     uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:$PORT` (Render injects
>     $PORT; alternatively use the Dockerfile CMD directly).
>   - Post-deploy verification: (1) `curl https://your-app.onrender.com/health`
>     returns 200 {"status": "ok"}; (2) `curl -X POST https://your-app.onrender.com/shorten
>     -H "Content-Type: application/json" -d '{"url":"https://example.com"}'`
>     returns 201 with a short_url; (3) GET the short_url returns a 301 to
>     example.com; (4) GET /api/stats/<slug> with the X-API-Key header returns
>     click counts.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Functionality (20 pts) — All P0 features work end-to-end; correct HTTP status codes (201/301/404/410/422/409); redirects complete in <100ms at p99; stats endpoint returns accurate counts.
>   2. Code quality (20 pts) — Clean src/ layout; type hints everywhere; docstrings on public functions; no ruff violations; mypy --strict passes on src/; pydantic models for all request/response bodies.
>   3. Testing (20 pts) — ≥80% line coverage on src/shortener/; unit tests for services; integration tests for API endpoints; edge cases covered (expired, conflict, rate-limited, 404, 401); tests run in <30s.
>   4. Deployment (20 pts) — App deployed and reachable on Render (or Fly.io); /health returns 200; CI pipeline is green on main branch; Docker image builds reproducibly; .env.example documents all required vars.
>   5. Documentation (20 pts) — README has setup, run, test, and deploy instructions; API is documented via FastAPI auto-docs at /docs; env vars explained; architecture diagram or file-tree overview; example curl commands.
> 
> Stretch goals:
>   - Add QR code generation: GET /<slug>/qrcode returns a PNG using the qrcode library, cached in Redis for 1 hour.
>   - Add browser/OS detection using ua-parser and country detection using geoip2 (with a MaxMind GeoLite2 database).
>   - Implement A/B testing: a slug maps to multiple destinations with weights; redirect picks one via weighted random.
>   - Add a Prometheus /metrics endpoint exposing request count, latency histogram, cache hit rate.
>   - Add OpenTelemetry tracing with OTLP exporter; trace every /shorten and /<slug> request with spans for DB and Redis calls.
>   - Add custom domain support with CNAME verification and per-domain rate limits.
>   - Add CSV export at GET /api/stats/<slug>/export.csv streamed via StreamingResponse.
>   - Add a simple Jinja2 web UI at /ui/<slug> showing a stats dashboard with Chart.js for the time series.
>   - Add a CLI command `shortener migrate` that runs Alembic migrations, replacing SQLModel.metadata.create_all.
>   - Add webhook notifications: POST to a configured URL on each click for real-time downstream processing.

> **Tip:** Stretch goals:
> • Add QR code generation: GET /<slug>/qrcode returns a PNG using the qrcode library, cached in Redis for 1 hour.
> • Add browser/OS detection using ua-parser and country detection using geoip2 (with a MaxMind GeoLite2 database).
> • Implement A/B testing: a slug maps to multiple destinations with weights; redirect picks one via weighted random.
> • Add a Prometheus /metrics endpoint exposing request count, latency histogram, cache hit rate.
> • Add OpenTelemetry tracing with OTLP exporter; trace every /shorten and /<slug> request with spans for DB and Redis calls.
> • Add custom domain support with CNAME verification and per-domain rate limits.
> • Add CSV export at GET /api/stats/<slug>/export.csv streamed via StreamingResponse.
> • Add a simple Jinja2 web UI at /ui/<slug> showing a stats dashboard with Chart.js for the time series.
> • Add a CLI command `shortener migrate` that runs Alembic migrations, replacing SQLModel.metadata.create_all.
> • Add webhook notifications: POST to a configured URL on each click for real-time downstream processing.

