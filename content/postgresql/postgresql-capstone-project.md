---
slug: postgresql-capstone-project
id: postgresql-capstone
track: postgresql
order: 21
title: "Capstone Project: TelemetryHub"
description: |-
  Build "TelemetryHub" — a production-grade, multi-tenant Postgres-backed
    analytics service that ingests high-volume events (page views, clicks,
    purchases, custom) from many tenants, enforces per-tenant isolation with
    Row-Level Security, exposes a REST API for aggregated analytics (daily/
    week
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Capstone Project: TelemetryHub

## TelemetryHub

Problem statement:
Build "TelemetryHub" — a production-grade, multi-tenant Postgres-backed
  analytics service that ingests high-volume events (page views, clicks,
  purchases, custom) from many tenants, enforces per-tenant isolation with
  Row-Level Security, exposes a REST API for aggregated analytics (daily/
  weekly/monthly rollups, top-N pages, funnel conversion, retention
  cohorts, full-text search), and ships with a tested schema, indexes,
  materialized views, partitioning, replication, backups, and a CI
  pipeline. The service must handle 1M events/day per tenant across 50
  tenants (50M events/day total), return dashboard queries in <500ms p95,
  enforce zero cross-tenant data leakage, and support point-in-time
  recovery via WAL archiving. This project exercises every concept from
  the 20-stage track: schema design, indexes, transactions, RLS, JSONB,
  full-text search, materialized views, partitioning, MVCC, performance
  tuning, replication, security, backups, extensions (pg_cron, pgTAP,
  pg_stat_statements, pg_trgm), connection pooling, and application
  integration.

Target users:
• Product managers who need self-serve dashboards for their product's
• funnel and retention without filing a ticket with the data team.
• Data analysts who want to query raw and aggregated event data via
• SQL through a read-replica or a BI tool.
• Engineering teams who want to embed first-party analytics into
• their app without standing up a separate warehouse like Snowflake.
• Compliance officers who require audit logs (pgaudit), per-tenant
• isolation (RLS), and point-in-time recovery (PITR) for SOC 2 / GDPR.

P0 (Must have) requirements:
• Postgres 16 schema: tenants, users, events, pages, funnels,
• funnel_steps tables with bigint IDENTITY PKs and FK constraints,
• CHECK constraints, and EXCLUDE constraints where applicable.
• Events table partitioned by RANGE on occurred_at (monthly), with
• pg_partman for auto-creation and 13-month retention.
• Row-Level Security on every tenant-scoped table with FORCE ROW
• LEVEL SECURITY; policies reference current_setting('app.tenant_id').
• Ingestion endpoint POST /events accepting a batch of JSON events
• with idempotency keys (INSERT ... ON CONFLICT (tenant_id,
• idempotency_key) DO NOTHING RETURNING id) and retry-on-40001.
• Query endpoints: GET /stats/daily, /stats/top-pages,
• /stats/funnel/<id>, /stats/retention, /events/search — all using
• indexes (verified via EXPLAIN (ANALYZE, BUFFERS)).
• Materialized view mv_daily_stats refreshed nightly via pg_cron
• with REFRESH CONCURRENTLY (requires a UNIQUE index on the MV).
• Indexes: (tenant_id, occurred_at DESC) B-tree for time queries,
• (tenant_id, event_type) B-tree, GIN on payload (jsonb_path_ops),
• GIN on a generated tsvector for full-text search, INCLUDE for
• index-only scans on the daily-stats query.
• Least-privilege app role (analytics_app LOGIN NOSUPERUSER
• NOCREATEDB NOCREATEROLE NOREPLICATION) with INSERT/SELECT/UPDATE
• on relevant tables only; no SUPERUSER for the app connection.
• pg_dump base backup + WAL archiving (archive_command to S3) for
• PITR; document the restore procedure and run a restore drill.
• pgTAP test suite covering schema, RLS, ingestion idempotency,
• stats correctness, and partition pruning; >=80% query coverage.
• Dockerized via docker-compose (app + primary Postgres + replica
• Postgres + PgBouncer + pgbackrest container).
• Streaming replication to a read-replica; GET /stats/* reads route
• to the replica via a separate DATABASE_URL_REPLICA.

P1 (Should have) requirements:
• pgcrypto for PII in event payload (pgp_sym_encrypt with key from
• app.pgp_key session setting, sourced from a secret manager).
• pgaudit for compliance-grade DML/DDL logging (pgaudit.log =
• 'write, ddl'); logs shipped to a SIEM.
• PgBouncer in transaction mode with max_prepared_statements=100
• (PgBouncer 1.21+) in front of both primary and replica.
• Alembic migrations using expand-then-contract (add column with
• default, backfill in batches, switch reads, drop old in a later
• migration); every migration is reversible (downgrade works).
• Slow-query log threshold (log_min_duration_statement = 1000ms)
• and a pg_stat_statements-based alert on queries with mean_exec_time
• > 1s; alert routes to PagerDuty.
• Stripe-style idempotency keys on the ingestion endpoint
• (idempotency_key UNIQUE per tenant, with a 24h TTL via pg_cron).
• Statement timeout (statement_timeout = 5s) and idle_in_transaction
• timeout (idle_in_transaction_session_timeout = 60s) per session.
• Per-tenant autovacuum tuning on events (autovacuum_vacuum_scale_factor
• = 0.05) given the high-churn workload.

P2 (Nice to have) requirements:
• Logical replication to an analytical cluster (separate from the
• streaming replica) for cross-tenant rollups without RLS overhead.
• Full-text search over event payloads with websearch_to_tsquery,
• ts_rank_cd, and ts_headline snippets, exposed via /events/search.
• dbt models for the rollup layers (stg_events, int_daily_stats,
• mv_daily_stats) with unique/not_null tests; run dbt test in CI.
• Grafana dashboard wired to mv_daily_stats and pg_stat_statements
• for live DBA visibility; JSON model checked into the repo.
• OpenTelemetry tracing with spans for every query (asyncpg
• integration); exported to Jaeger or Tempo.
• SCD Type 2 on tenant subscription tier for historical revenue
• analysis; recompute monthly revenue by tier via effective_from/
• effective_to joins.
• A funnel-builder UI that emits parameterized SQL (no string
• concat) — users pick events and time windows, the backend builds
• a window-function query and returns the conversion curve.
• pg_cron job that runs VACUUM ANALYZE on events nightly and
• alerts (PagerDuty) if dead-tuple ratio exceeds 20% on any tenant's
• data (sign of autovacuum falling behind).

```text
telemetry-hub/
    pyproject.toml
    README.md
    Dockerfile
    docker-compose.yml                # app + primary + replica + pgbouncer + pgbackrest
    pgbouncer/
        pgbouncer.primary.ini
        pgbouncer.replica.ini
        userlist.txt
    pgbackrest.conf
    .env.example
    .github/
        workflows/
            ci.yml                    # ruff + mypy + alembic check + pgTAP + dbt test
    schema/
        001_tenants.sql
        002_users.sql
        003_events.sql                # range-partitioned by occurred_at
        004_pages.sql
        005_funnels.sql
        006_rls.sql                   # ENABLE + FORCE + CREATE POLICY
        007_indexes.sql               # B-tree, GIN, expression, INCLUDE
        008_materialized_views.sql
        009_pgaudit.sql
        010_partitions.sql            # pg_partman setup + retention
    migrations/
        alembic.ini
        env.py
        versions/
            001_initial_schema.py
            002_rls_policies.py
            003_indexes.py
            004_materialized_views.py
            005_add_idempotency_key.py
            006_partition_events.py
            007_add_fulltext_search.py
    seed/
        001_tenants.sql
        002_users.sql
        003_sample_events.sql         # 1M events across 5 tenants
    queries/
        daily_stats.sql
        top_pages.sql
        funnel_conversion.sql
        retention_cohort.sql
        search_events.sql
    src/
        telemetry/
            __init__.py
            main.py                   # FastAPI app factory
            config.py                 # pydantic-settings
            database.py               # asyncpg pool + PgBouncer
            rls.py                    # per-request tenant_id setter (SET LOCAL)
            models.py                 # Pydantic event model
            api/
                __init__.py
                router.py
                events.py             # POST /events
                stats.py              # GET /stats/* (reads route to replica)
                health.py             # GET /health
            services/
                ingest.py             # idempotent batch insert + retry-on-40001
                rollups.py            # call REFRESH MATERIALIZED VIEW CONCURRENTLY
    tests/
        conftest.py                   # testcontainers Postgres fixture
        test_schema.sql               # pgTAP schema tests
        test_rls.sql                  # pgTAP cross-tenant isolation tests
        test_ingest.py                # idempotency, retry, batch
        test_stats.py                 # daily, top-pages, funnel, retention
        test_queries.py               # EXPLAIN asserts on index usage
        test_pitr.py                  # restore drill from base + WAL
    scripts/
        refresh_mv.sql                # REFRESH CONCURRENTLY
        backup.sh                     # pgbackrest backup
        restore_pitr.sh               # PITR restore runbook
        seed_dev.sh                   # 1M event seed
        restore_drill.sh              # quarterly drill automation
```
Caption: Suggested file structure

Tech stack:
• PostgreSQL 16 — primary datastore (RLS, JSONB, materialized views,
• full-text search, GIN/GiST/B-tree/BRIN indexes, partitioning, pg_cron).
• pg_partman — automated monthly partition creation and 13-month
• retention for the events table.
• Python 3.12 + FastAPI — REST API for ingestion and queries.
• asyncpg — fastest Postgres driver for Python; parameterized queries
• everywhere, statement_timeout and idle_in_transaction_session_timeout
• set on every connection.
• Alembic — schema migrations using expand-then-contract; every
• migration reversible.
• PgBouncer 1.21+ — connection pooling in transaction mode with
• max_prepared_statements=100 for named-statement tracking.
• pgcrypto — column-level encryption for PII in payloads (key from
• secret manager, set per session via app.pgp_key).
• pgaudit — compliance-grade logging (SOC 2 / GDPR / PCI).
• pg_cron — scheduled REFRESH MATERIALIZED VIEW CONCURRENTLY and
• nightly VACUUM ANALYZE on high-churn tables.
• pgBackRest — physical backup with WAL archiving to S3 for PITR.
• pgTAP — unit/integration tests for schema, RLS, and query correctness.
• pg_stat_statements + pg_trgm + hypopg — DBA tooling.
• testcontainers-python — integration tests against a real Postgres 16.
• Docker + docker-compose — local dev environment matching prod.
• GitHub Actions — CI (ruff + mypy + alembic check + pgTAP + dbt test).

> **Tip:** Testing strategy:
> - pgTAP unit tests for schema (constraints, indexes exist), RLS
>     (cross-tenant SELECT/INSERT/UPDATE blocked), and query correctness
>     (daily_stats, top_pages, funnel_conversion, retention_cohort match
>     expected fixtures). Run via `pg_prove tests/*.sql` in CI.
>   - pytest integration tests with testcontainers-python spinning up a
>     real Postgres 16 container; each test runs in a transaction that
>     rolls back so tests are isolated and fast (<30s total).
>   - RLS tests: every test creates two tenants and verifies cross-
>     tenant SELECT returns 0 rows and cross-tenant INSERT raises a
>     WITH CHECK violation — catching RLS regressions before they reach
>     prod.
>   - Performance tests: a fixture seeds 1M events per tenant (5M total),
>     then asserts each /stats/* endpoint returns in <500ms p95 via
>     httpx + time.perf_counter; regressions fail CI. EXPLAIN assertions
>     verify "Index Scan" or "Index Only Scan" on hot queries (no Seq Scan).
>   - PITR drill: a quarterly job restores from pgBackRest base + WAL to
>     a staging cluster and asserts row counts match production within
>     a 1-minute tolerance; the drill result is logged for compliance.
>   - CI runs: ruff check, ruff format --check, mypy src, alembic check
>     (no missing migrations), pg_prove tests/*.sql, pytest --cov=src/
>     telemetry --cov-fail-under=80; coverage gate enforced on main.

> **Tip:** Deployment guide:
> - Deploy to Render.com: create a Web Service (Docker), a managed
>     PostgreSQL 16 primary (standard plan for WAL archiving support),
>     a managed read-replica, and an optional Redis for caching.
>   - Environment variables to set: DATABASE_URL (from Render Postgres
>     primary internal URL), DATABASE_URL_POOLER (PgBouncer URL on
>     port 6432), DATABASE_URL_REPLICA (PgBouncer URL on the replica
>     on port 6433), PGP_KEY (32-char secret from Vault for pgcrypto),
>     API_KEY (per-tenant auth), PGBACKREST_REPO_S3_URI,
>     PGBACKREST_REPO_S3_KEY, PGBACKREST_REPO_S3_KEY_SECRET (S3 + KMS
>     for backups), AUDIT_LOG_LEVEL=info, PYTHONUNBUFFERED=1.
>   - Build command (Render runs this on each deploy): `pip install -e .`
>     (or use the Dockerfile — Render builds the image automatically).
>   - Start command: `gunicorn telemetry.main:app -k
>     uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:$PORT` (Render
>     injects $PORT). Run `alembic upgrade head` as a pre-deploy hook.
>   - Post-deploy verification: (1) curl https://your-app.onrender.com/health
>     returns 200 {"status": "ok", "primary": true, "replica_lag_ms": <100};
>     (2) POST a test event to /events and verify GET /stats/daily returns
>     it within the next refresh window (or immediately from the raw
>     events table); (3) check pg_stat_replication on the primary shows
>     the replica with replay_lag < 1s; (4) verify pgaudit logs appear in
>     the Postgres log and ship to the SIEM; (5) trigger a manual
>     REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_stats and confirm
>     the MV updates; (6) verify pgBackRest completed its nightly backup
>     (`pgbackrest info`); (7) run the restore drill on staging and
>     assert row counts.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Schema, Partitioning & RLS (20 pts) — 3NF schema with FKs, CHECKs,
>      and EXCLUDEs; events partitioned by RANGE on occurred_at with
>      pg_partman retention; RLS with FORCE on every tenant-scoped table;
>      policies verified by pgTAP cross-tenant tests; no SUPERUSER for
>      the app role; no BYPASSRLS.
>   2. Query Performance (20 pts) — All hot queries use indexes (verified
>      via EXPLAIN (ANALYZE, BUFFERS) assertions in tests); materialized
>      views refresh CONCURRENTLY in <60s; p95 query latency <500ms on
>      1M events per tenant across 5 tenants; no Seq Scans on hot paths;
>      partition pruning works (single-month query scans one partition).
>   3. Security (20 pts) — Least-privilege app role (no SUPERUSER, no
>      CREATE, no BYPASSRLS); pgcrypto on PII in payload; pgaudit enabled
>      with log='write, ddl'; all queries parameterized (no f-strings);
>      secrets via env vars / secret manager; SECURITY DEFINER functions
>      have explicit search_path; sslmode=verify-full in production DSNs.
>   4. Replication, Backup & PITR (20 pts) — Streaming replication to a
>      read-replica with hot_standby_feedback; /stats/* reads route to
>      the replica via a separate pool; pgBackRest with WAL archiving to
>      S3; quarterly restore drill automated and logged; RTO/RPO documented
>      and met; replication slot lag monitored and alerted.
>   5. Testing & CI (20 pts) — pgTAP tests for schema, RLS, and query
>      correctness; pytest integration tests with testcontainers-python;
>      >=80% coverage on src/telemetry/; EXPLAIN assertions on hot
>      queries (no Seq Scan); CI runs ruff + mypy + alembic check + pgTAP
>      + pytest --cov + dbt test; CI green on main.
> 
> Stretch goals:
>   - Add logical replication to a separate analytical cluster (no RLS)
>     for cross-tenant rollups; route heavy analytical queries there.
>   - Add SCD Type 2 on tenant subscription tier; track tier changes over
>     time and recompute historical revenue by tier via effective_from/
>     effective_to joins; surface in /stats/revenue-by-tier.
>   - Wrap the rollup layers as dbt models (stg_events, int_daily_stats,
>     mv_daily_stats) with unique and not_null tests; run dbt test in CI.
>   - Add a Grafana dashboard wired to mv_daily_stats, pg_stat_statements,
>     pg_stat_replication, and pg_replication_slots; ship the JSON model
>     in the repo so it's reproducible.
>   - Add OpenTelemetry tracing with OTLP exporter; every /events and
>     /stats request gets a span, with child spans for each DB call
>     showing the SQL and bind parameters.
>   - Add a funnel-builder UI that emits parameterized SQL (no string
>     concat) — users pick events and time windows, the backend builds
>     a window-function query and returns the conversion curve.
>   - Add a pg_cron job that runs VACUUM ANALYZE on events nightly and
>     alerts (PagerDuty) if dead-tuple ratio exceeds 20% on any tenant's
>     data (sign of autovacuum falling behind).
>   - Add per-tenant autovacuum tuning (autovacuum_vacuum_scale_factor
>     = 0.05 for the events table) and per-tenant connection limits in
>     PgBouncer (so a noisy tenant can't starve others).
>   - Add query-result caching in Redis with a tenant-scoped key and a
>     short TTL (e.g. 30s for /stats/daily), with a cache invalidation
>     hook on REFRESH MATERIALIZED VIEW.
>   - Add a chaos engineering job that periodically kills the primary in
>     staging and verifies Patroni promotes a replica within RTO; log
>     the result.

> **Tip:** Stretch goals:
> • Add logical replication to a separate analytical cluster (no RLS)
> • for cross-tenant rollups; route heavy analytical queries there.
> • Add SCD Type 2 on tenant subscription tier; track tier changes over
> • time and recompute historical revenue by tier via effective_from/
> • effective_to joins; surface in /stats/revenue-by-tier.
> • Wrap the rollup layers as dbt models (stg_events, int_daily_stats,
> • mv_daily_stats) with unique and not_null tests; run dbt test in CI.
> • Add a Grafana dashboard wired to mv_daily_stats, pg_stat_statements,
> • pg_stat_replication, and pg_replication_slots; ship the JSON model
> • in the repo so it's reproducible.
> • Add OpenTelemetry tracing with OTLP exporter; every /events and
> • /stats request gets a span, with child spans for each DB call
> • showing the SQL and bind parameters.
> • Add a funnel-builder UI that emits parameterized SQL (no string
> • concat) — users pick events and time windows, the backend builds
> • a window-function query and returns the conversion curve.
> • Add a pg_cron job that runs VACUUM ANALYZE on events nightly and
> • alerts (PagerDuty) if dead-tuple ratio exceeds 20% on any tenant's
> • data (sign of autovacuum falling behind).
> • Add per-tenant autovacuum tuning (autovacuum_vacuum_scale_factor
> • = 0.05 for the events table) and per-tenant connection limits in
> • PgBouncer (so a noisy tenant can't starve others).
> • Add query-result caching in Redis with a tenant-scoped key and a
> • short TTL (e.g. 30s for /stats/daily), with a cache invalidation
> • hook on REFRESH MATERIALIZED VIEW.
> • Add a chaos engineering job that periodically kills the primary in
> • staging and verifies Patroni promotes a replica within RTO; log
> • the result.

