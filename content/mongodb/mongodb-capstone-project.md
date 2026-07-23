---
slug: mongodb-capstone-project
id: mongodb-capstone
track: mongodb
order: 21
title: "Capstone Project: Pulse is a multi-tenant, realtime event-analytics and audit..."
description: |-
  Pulse is a multi-tenant, realtime event-analytics and audit platform. SaaS
    companies push arbitrary product events (page views, clicks, purchases,
    feature flags, errors) to Pulse, and Pulse stores them in a time series
    collection, aggregates them per-tenant per-minute/hour/day, exposes a
    rea
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Capstone Project: Pulse is a multi-tenant, realtime event-analytics and audit...

## Pulse is a multi-tenant, realtime event-analytics and audit...

Problem statement:
Pulse is a multi-tenant, realtime event-analytics and audit platform. SaaS
  companies push arbitrary product events (page views, clicks, purchases,
  feature flags, errors) to Pulse, and Pulse stores them in a time series
  collection, aggregates them per-tenant per-minute/hour/day, exposes a
  realtime dashboard powered by change streams, and emits a tamper-evident
  audit log of every read and write. Each tenant's events must be strictly
  isolated by `tenantId` (enforced by `$jsonSchema` validators and a
  per-tenant vector index for "find similar incidents" semantic search).
  Pulse must survive replica-set failover without losing events (write
  concern `majority`), must auto-expire raw events after 90 days (TTL) while
  keeping rollups forever, and must encrypt sensitive PII fields
  client-side (CSFLE). The system is the integration showcase for the
  MongoDB track — it uses 18 of the 20 stages.

Target users:
• SaaS engineering teams wanting product analytics without building a
• Snowflake + Looker stack from scratch.
• Compliance/security teams needing a tamper-evident audit log of every
• dashboard query and configuration change.
• On-call engineers searching past incidents by natural-language query
• (vector search over the incident postmortem archive).
• Data analysts building per-tenant hourly/daily rollups for executive
• dashboards without writing ETL pipelines.

P0 (Must have) requirements:
• Ingest events via `POST /events` with `{ tenantId, type, payload }`,
• validated by a `$jsonSchema` validator on the `events` collection.
• Store raw events in a time series collection (`timeField: ts`,
• `metaField: tenantId`, `granularity: seconds`) with a 90-day TTL.
• Materialize per-tenant per-minute rollups (event count + unique
• users) into a `rollups` collection via `$merge` from an aggregation
• pipeline.
• Expose `GET /metrics/:tenantId?from=&to=&granularity=` returning
• rollups with keyset pagination.
• Maintain a tamper-evident `auditLog` collection written via a
• change stream on `events` AND a change stream on `rollups`.
• Use a replica set (3-node minimum) and `w: "majority"` write concern
• on event ingest.
• CSFLE on `payload.userEmail` and `payload.ip` fields (deterministic
• for userEmail so equality queries work, randomized for ip).
• `/healthz` (always 200) and `/readyz` (uses `db.admin().ping()`).
• Graceful shutdown on SIGTERM (stop HTTP, drain in-flight, close
• MongoClient and change-stream consumers).

P1 (Should have) requirements:
• Per-tenant rate limiting (1000 events/min) using a token bucket in
• a `rateLimits` collection with atomic `findOneAndUpdate`.
• Atlas Vector Search index on `incidents.embedding` and a
• `GET /incidents/similar?q=` endpoint returning top-5 similar past
• incidents (RAG-style).
• Atlas Search `$search` over `payload.message` for full-text
• debugging of error events.
• Schema validation in `warn` mode for the first deploy, then switch
• to `strict` + `error` after data cleanup.
• Index creation via a migration script (NOT app boot) — run as a
• one-off `npm run migrate`.
• Compound ESR-rule indexes on every hot query path.
• Structured JSON logging with `tenantId`, `requestId`, `queryTimeMs`.

P2 (Nice to have) requirements:
• Multi-region replica set with `secondaryPreferred` for rollup reads.
• Per-tenant quotas enforced via a transaction (check quota + insert).
• Anomaly detection: a background job that flags minutes where
• `eventCount` deviates >3 sigma from the trailing 7-day median.
• Webhook fan-out via Atlas Triggers when an anomaly is flagged.
• Field-level audit hash chain (each audit entry includes the SHA-256
• of the previous entry, making tampering detectable).
• A `rollupsByDay` materialized view via `$merge` for ultra-fast
• 30-day dashboards.

Tech stack:
• MongoDB 7.0 (replica set, 3 nodes minimum; Atlas M10 tier in prod)
• mongosh 2.0 (for ad-hoc ops)
• Node.js 20 LTS with the official `mongodb` driver (NOT Mongoose — keep
• schema validation in the DB via `$jsonSchema`)
• Fastify 4 (HTTP)
• Zod (request body validation, mirroring the `$jsonSchema` rules)
• pino (structured JSON logging)
• mongodb-memory-server (integration tests in CI without a real replica set)
• testcontainers + a 3-node replica set (E2E failover test)
• Vitest (test runner)
• prom-client (Prometheus metrics: events_total, rollup_lag_seconds)
• Docker (multi-stage build; runtime image based on `node:20-alpine`)
• GitHub Actions (CI: lint, test, migrate-dry-run, docker build)
• Atlas Vector Search + OpenAI text-embedding-3-small (1536 dims)
• AWS KMS (CSFLE master key in production; local KMS in dev)

> **Tip:** Testing strategy:
> - Unit tests (Vitest + mongodb-memory-server, no external deps):
>     ingest validation, rate-limit token bucket, rollup aggregation
>     logic, hash-chain audit log, zod schemas, CSFLE field selection.
>     Use `vi.useFakeTimers()` for the rollup cron and rate-limit window
>     tests. Target ≥80% line coverage on `src/services`, `src/routes`,
>     `src/changeStreams`, `src/platform`. Run with `vitest run --coverage`.
>   - Integration tests (Vitest + mongodb-memory-server): mount the
>     Fastify app via `supertest` (or `light-my-request`), fire HTTP
>     requests covering event ingest (valid/invalid/validator-rejected/
>     rate-limited), metrics endpoint (keyset pagination), incidents
>     similar (with a seeded vector index stub), audit hash-chain
>     verification. The change-stream tests use a short polling loop with
>     a 5s timeout since change streams on mongodb-memory-server fire
>     near-instantly.
>   - E2E test (Vest against a real 3-node replica set via docker-compose):
>     start the full stack, ingest 1000 events, verify rollups appear in
>     `rollups` within 60s, verify the audit log has 1000 entries with a
>     valid hash chain, then `docker compose kill mongo-1` (the primary)
>     and verify Pulse keeps ingesting via the new primary within 5s
>     (this exercises retryable writes and `w: "majority"`). One E2E
>     suite in `test/e2e/`.
>   - Coverage target: ≥80% line coverage on `src/services`, `src/routes`,
>     `src/changeStreams`, `src/platform`. Run
>     `vitest run --coverage --reporter=html` and view `coverage/index.html`.
>   - Migration test: a CI job that applies all migrations to a fresh
>     replica set, runs a few inserts, then rolls back migrations in
>     reverse order (each migration must have a `down` function) and
>     verifies the collection shapes return to their pre-migration state.
>   - Performance smoke: a `vitest bench` suite that ingests 10k events
>     and queries the metrics endpoint; assert p99 < 100ms on a laptop
>     (CI machines vary, so record baselines, don't hard-fail).

> **Tip:** Deployment guide: see the project repository for a production-ready MongoDB deployment example with replica sets, TLS, CSFLE, and Atlas Vector Search.

