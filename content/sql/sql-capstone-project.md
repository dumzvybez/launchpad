---
slug: sql-capstone-project
id: sql-capstone
track: sql
order: 21
title: "Capstone Project: Build a Multi-Tenant Analytics API — a Postgres-backed..."
description: |-
  Build a Multi-Tenant Analytics API — a Postgres-backed service that
    ingests events (page views, clicks, purchases) from many tenants,
    enforces per-tenant isolation with Row-Level Security, exposes a REST
    API for aggregated analytics (daily/weekly/monthly rollups, top-N
    pages, funnel conversi
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Capstone Project: Build a Multi-Tenant Analytics API — a Postgres-backed...

## Build a Multi-Tenant Analytics API — a Postgres-backed...

Problem statement:
Build a Multi-Tenant Analytics API — a Postgres-backed service that
  ingests events (page views, clicks, purchases) from many tenants,
  enforces per-tenant isolation with Row-Level Security, exposes a REST
  API for aggregated analytics (daily/weekly/monthly rollups, top-N
  pages, funnel conversion, retention cohorts), and ships with a tested
  schema, indexes, materialized views, and a CI pipeline. The service
  must handle 1M events/day per tenant, return queries in <500ms p95,
  and support point-in-time recovery via WAL archiving. This project
  exercises every concept from the 20-stage track: schema design,
  indexes, transactions, RLS, JSONB, full-text search, materialized
  views, performance tuning, replication prep, security, and
  application integration.

Target users:
• Product managers who need self-serve dashboards for their product's
• funnel and retention without filing a ticket with the data team.
• Data analysts who want to query raw and aggregated event data via
• SQL through a read-replica or a BI tool.
• Engineering teams who want to embed first-party analytics into
• their app without standing up a separate warehouse like Snowflake.

P0 (Must have) requirements:
• Postgres 16 schema: tenants, users, events, pages, funnels,
• funnel_steps tables with bigint IDENTITY PKs and FK constraints.
• Row-Level Security on every tenant-scoped table with FORCE ROW
• LEVEL SECURITY; policies reference current_setting('app.tenant_id').
• Ingestion endpoint POST /events accepting a batch of JSON events
• with idempotency keys (INSERT ... ON CONFLICT DO NOTHING).
• Query endpoints: GET /stats/daily, /stats/top-pages,
• /stats/funnel/<id>, /stats/retention — all using indexes.
• Materialized view mv_daily_stats refreshed nightly via pg_cron
• with REFRESH CONCURRENTLY (requires a unique index).
• Indexes: (tenant_id, occurred_at), (tenant_id, event_type),
• GIN on event payload (jsonb_path_ops), covering INCLUDE for
• index-only scans on the stats queries.
• Least-privilege app role with INSERT/SELECT on relevant tables
• only; no SUPERUSER for the app connection.
• pg_dump base backup + WAL archiving (archive_command) for PITR.
• pytest suite (using testcontainers-python for a real Postgres)
• with >=80% coverage on the schema/queries module.
• Dockerized via docker-compose (app + Postgres + PgBouncer).

P1 (Should have) requirements:
• pgcrypto for any PII in event payload (pgp_sym_encrypt).
• pgaudit for compliance-grade DML/DDL logging.
• Connection pooling via PgBouncer in transaction mode.
• Alembic migrations using expand-then-contract (add column,
• backfill, switch reads, drop old in a later migration).
• Slow-query log threshold (log_min_duration_statement = 1000ms)
• and an alert on >1s queries.
• Stripe-style idempotency keys on the ingestion endpoint
• (idempotency_key UNIQUE per tenant).

P2 (Nice to have) requirements:
• Logical replication to a read-replica for analytical queries,
• with the app routing /stats/* to the replica.
• Full-text search over event payloads with websearch_to_tsquery
• and ranked snippets via ts_headline.
• dbt models for the rollup layers with unique/not_null tests.
• Grafana dashboard wired to the materialized views.
• OpenTelemetry tracing with spans for every query.
• SCD Type 2 on tenant subscription tier for historical revenue.
• A funnel-builder UI that emits parameterized SQL.
• pg_cron job that runs VACUUM ANALYZE on high-churn tables.

```text
analytics-api/
    pyproject.toml
    README.md
    Dockerfile
    docker-compose.yml
    pgbouncer.ini
    .env.example
    .github/
        workflows/
            ci.yml
    schema/
        001_tenants.sql
        002_users.sql
        003_events.sql
        004_pages.sql
        005_funnels.sql
        006_rls.sql
        007_indexes.sql
        008_materialized_views.sql
        009_pgaudit.sql
    migrations/
        alembic.ini
        versions/
            001_initial_schema.py
            002_rls_policies.py
            003_indexes.py
            004_materialized_views.py
            005_add_idempotency_key.py
    seed/
        001_tenants.sql
        002_users.sql
        003_sample_events.sql
    queries/
        daily_stats.sql
        top_pages.sql
        funnel_conversion.sql
        retention_cohort.sql
        search_events.sql
    src/
        analytics/
            __init__.py
            main.py             # FastAPI app factory
            config.py           # pydantic-settings
            database.py         # async SQLAlchemy engine + session
            models.py           # SQLModel tables
            rls.py              # per-request tenant_id setter
            api/
                __init__.py
                router.py
                events.py       # POST /events
                stats.py        # GET /stats/*
                health.py       # GET /health
            services/
                ingest.py
                rollups.py
    tests/
        conftest.py             # testcontainers Postgres fixture
        test_schema.py
        test_rls.py             # cross-tenant isolation tests
        test_ingest.py
        test_stats.py
        test_queries.py
    scripts/
        refresh_mv.sql
        backup.sh
        restore_pitr.sh
        seed_dev.sh
```
Caption: Suggested file structure

Tech stack:
• PostgreSQL 16 — primary datastore (RLS, JSONB, materialized views,
• full-text search, GIN/GiST indexes, pg_cron).
• Python 3.12 + FastAPI — REST API for ingestion and queries.
• async SQLAlchemy 2.0 — async ORM with parameterized queries.
• Alembic — schema migrations using expand-then-contract.
• PgBouncer — connection pooling in transaction mode.
• pgcrypto — column-level encryption for PII in payloads.
• pgaudit — compliance-grade logging (SOC 2 / HIPAA / PCI).
• pg_cron — scheduled REFRESH MATERIALIZED VIEW CONCURRENTLY.
• pgBackRest — physical backup with WAL archiving for PITR.
• testcontainers-python — integration tests against a real Postgres.
• Docker + docker-compose — local dev environment matching prod.
• GitHub Actions — CI (ruff + mypy + pytest --cov + alembic check).

> **Tip:** Testing strategy:
> - Unit tests with pytest for query builders, tenant_id propagation,
>     and validation; use pytest.mark.parametrize for table-driven cases
>     (e.g. 5 funnel shapes, 10 retention windows).
>   - Integration tests with testcontainers-python spinning up a real
>     Postgres 16 container; each test runs in a transaction that rolls
>     back so tests are isolated and fast (<30s total).
>   - RLS tests: every test creates two tenants and verifies cross-
>     tenant SELECT, INSERT, UPDATE all return zero rows or raise —
>     catching RLS regressions before they reach prod.
>   - Performance tests: a fixture seeds 1M events per tenant, then
>     asserts each /stats/* endpoint returns in <500ms p95 via
>     httpx + time.perf_counter; regressions fail CI.
>   - CI runs: ruff check, ruff format --check, mypy src, alembic check
>     (no missing migrations), pytest --cov=src/analytics --cov-fail-under=80;
>     coverage gate enforced on main.

> **Tip:** Deployment guide:
> - Deploy to Render.com: create a Web Service (Docker), a managed
>     PostgreSQL 16 (standard plan for WAL archiving support), and an
>     optional Redis if you add caching.
>   - Environment variables to set: DATABASE_URL (from Render Postgres
>     internal URL), DATABASE_URL_POOLER (PgBouncer URL on port 6432),
>     PGP_KEY (32-char secret for pgcrypto), API_KEY (per-tenant auth),
>     AUDIT_LOG_LEVEL=info, PYTHONUNBUFFERED=1.
>   - Build command (Render runs this on each deploy): `pip install -e
>     .` (or use the Dockerfile — Render builds the image automatically).
>   - Start command: `gunicorn analytics.main:app -k
>     uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:$PORT` (Render
>     injects $PORT). Run `alembic upgrade head` as a pre-deploy hook.
>   - Post-deploy verification: (1) curl https://your-app.onrender.com/health
>     returns 200 {"status": "ok"}; (2) POST a test event and verify
>     GET /stats/daily returns it; (3) check pg_stat_replication if a
>     read-replica exists; (4) verify pgaudit logs appear in the
>     Postgres log; (5) trigger a manual REFRESH MATERIALIZED VIEW and
>     confirm mv_daily_stats updates.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Schema & RLS (20 pts) — 3NF schema with FKs and CHECK constraints;
>      RLS with FORCE on every tenant-scoped table; policies verified by
>      cross-tenant tests; no SUPERUSER for the app role.
>   2. Query Performance (20 pts) — All hot queries use indexes (verified
>      via EXPLAIN); materialized views refresh in <60s; p95 query
>      latency < 500ms on 1M events per tenant; no Seq Scans on hot paths.
>   3. Security (20 pts) — Least-privilege app role, pgcrypto on PII,
>      pgaudit enabled, all queries parameterized, secrets via env vars,
>      no SQL injection vectors.
>   4. Testing & CI (20 pts) — >=80% coverage on src/analytics/, RLS
>      cross-tenant tests, performance regression tests, CI green on main,
>      alembic check passes.
>   5. Operations (20 pts) — Alembic migrations are reversible (downgrade
>      works), pgBackRest configured with WAL archiving, restore-from-PITR
>      runbook tested, slow-query log monitored, dashboard for query health.
> 
> Stretch goals:
>   - Add logical replication to a read-replica and route /stats/* reads
>     to the replica via a separate SQLAlchemy engine bound to the
>     replica's DATABASE_URL_REPLICA env var.
>   - Add full-text search over event payloads: a GENERATED tsvector
>     column weighted A on event_type and B on payload, GIN-indexed, with
>     a GET /events/search?q=... endpoint using websearch_to_tsquery and
>     ts_rank for ordering.
>   - Wrap the rollup layers as dbt models (stg_events, int_daily_stats,
>     mv_daily_stats) with unique and not_null tests; run dbt test in CI.
>   - Add a Grafana dashboard wired to mv_daily_stats and the events
>     table; ship the JSON model in the repo so it's reproducible.
>   - Add OpenTelemetry tracing with OTLP exporter; every /events and
>     /stats request gets a span, with child spans for each DB call
>     showing the SQL and bind parameters.
>   - Add a funnel-builder UI that emits parameterized SQL (no string
>     concat) — users pick events and time windows, the backend builds
>     a window-function query and returns the conversion curve.
>   - Add SCD Type 2 on tenant subscription tier; track tier changes
>     over time and recompute historical revenue by tier via a join
>     on effective_from/effective_to.
>   - Add a pg_cron job that runs VACUUM ANALYZE on events nightly and
>     alerts if dead-tuple ratio exceeds 20% (sign of autovacuum falling
>     behind).

> **Tip:** Stretch goals:
> • Add logical replication to a read-replica and route /stats/* reads
> • to the replica via a separate SQLAlchemy engine bound to the
> • replica's DATABASE_URL_REPLICA env var.
> • Add full-text search over event payloads: a GENERATED tsvector
> • column weighted A on event_type and B on payload, GIN-indexed, with
> • a GET /events/search?q=... endpoint using websearch_to_tsquery and
> • ts_rank for ordering.
> • Wrap the rollup layers as dbt models (stg_events, int_daily_stats,
> • mv_daily_stats) with unique and not_null tests; run dbt test in CI.
> • Add a Grafana dashboard wired to mv_daily_stats and the events
> • table; ship the JSON model in the repo so it's reproducible.
> • Add OpenTelemetry tracing with OTLP exporter; every /events and
> • /stats request gets a span, with child spans for each DB call
> • showing the SQL and bind parameters.
> • Add a funnel-builder UI that emits parameterized SQL (no string
> • concat) — users pick events and time windows, the backend builds
> • a window-function query and returns the conversion curve.
> • Add SCD Type 2 on tenant subscription tier; track tier changes
> • over time and recompute historical revenue by tier via a join
> • on effective_from/effective_to.
> • Add a pg_cron job that runs VACUUM ANALYZE on events nightly and
> • alerts if dead-tuple ratio exceeds 20% (sign of autovacuum falling
> • behind).

