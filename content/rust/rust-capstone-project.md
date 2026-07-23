---
slug: rust-capstone-project
id: rust-capstone
track: rust
order: 21
title: "Capstone Project: Teams running microservices and CLI tools need a..."
description: |-
  Teams running microservices and CLI tools need a fast, self-hosted URL
    shortener that doesn't leak analytics data to third parties and can
    sustain thousands of redirects per second on a single small VM. Public
    services like Bitly impose rate limits and may be blocked in some
    regions; rolling
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Capstone Project: Teams running microservices and CLI tools need a...

## Teams running microservices and CLI tools need a...

Problem statement:
Teams running microservices and CLI tools need a fast, self-hosted URL
  shortener that doesn't leak analytics data to third parties and can
  sustain thousands of redirects per second on a single small VM. Public
  services like Bitly impose rate limits and may be blocked in some
  regions; rolling your own in a GC'd language often surprises teams
  with latency spikes under load. Rust's ownership model, zero-cost
  abstractions, and async runtimes make it ideal for a service that
  must be memory-safe, fast, and cheaply deployable. In this capstone
  you will build "shorly" — a multi-tenant URL shortener with an HTTP
  API, persistent storage, background analytics aggregation, a live
  WebSocket stats feed, and a small CLI. The project exercises every
  major Rust skill: ownership, lifetimes, traits, generics, error
  handling, async/await with Tokio, smart pointers, channels,
  concurrency, macros, testing, and workspace organization.

Target users:
• Developer teams wanting a self-hosted shortener with no per-seat pricing.
• Internal platform engineers who need branded short domains behind their VPN.
• Open-source maintainers embedding a redirect service into larger tools.
• Students learning production Rust by reading a complete, deployable codebase.

P0 (Must have) requirements:
• POST /shorten accepts {url, optional slug, optional tenant} and returns a short URL.
• GET /<slug> performs a 301 redirect to the long URL, recording a hit.
• Slugs are 6-character nanoid-style strings when not user-supplied.
• Persistent storage via `sled` (embedded key-value database) so the service survives restarts.
• Multi-tenant support: each tenant has a namespace; slugs are unique per tenant.
• Background task aggregates hit counts (per slug, per hour) using `tokio::sync::mpsc`.
• GET /stats/<slug> returns lifetime hit count and last-redirected-at.
• GET /health returns 200 OK for liveness probes.
• Structured logging via `tracing`/`tracing-subscriber`.
• All errors use a typed `AppError` enum (thiserror) with proper HTTP status mapping.
• Graceful shutdown on SIGINT/SIGTERM (`tokio::signal`).

P1 (Should have) requirements:
• WebSocket endpoint /stats/live streams hit events as they happen.
• CLI subcommand `shorly shorten <url>` and `shorly stats <slug>` talking to the server.
• Config via `serde` + `figment`/`config` crate (port, db path, base URL).
• Rate limiting via `governor` per tenant.
• `#[cfg(test)]` unit tests for storage, slug generation, and stats aggregation.
• Integration tests in `tests/` hitting the full HTTP API via `reqwest`.

P2 (Nice to have) requirements:
• Prometheus metrics endpoint at /metrics via `metrics` crate.
• Optional in-memory LRU cache (via `moka`) for hot slugs.
• Docker multi-arch build (amd64 + arm64) and helm chart.
• Optional Postgres backend behind a `Storage` trait.
• Custom 404 page served for unknown slugs.

```text
shorly/
  Cargo.toml                  # workspace root
  Cargo.lock
  README.md
  .github/workflows/ci.yml
  crates/
    api/                      # HTTP server (axum)
      Cargo.toml
      src/
        main.rs               # entry: load config, build app, serve
        routes.rs             # /shorten, /<slug>, /stats, /health, /metrics
        error.rs              # AppError enum + IntoResponse
        state.rs              # AppState (Arc<Storage>, mpsc::Sender, ...)
        handlers/
          mod.rs
          shorten.rs
          redirect.rs
          stats.rs
      tests/
        api_integration.rs
    core/                     # storage, slug, analytics
      Cargo.toml
      src/
        lib.rs
        storage.rs            # Storage trait + SledStorage impl
        slug.rs               # nanoid-style slug generation
        analytics.rs          # HitEvent, Aggregator task
        config.rs             # Config struct (serde + figment)
        error.rs              # CoreError
      tests/
        slug.rs
        storage.rs
    cli/                      # shorly CLI
      Cargo.toml
      src/main.rs             # clap subcommands
    proto/                    # shared types
      Cargo.toml
      src/lib.rs              # ShortenRequest, ShortenResponse, StatsResponse
  Dockerfile
  config/default.toml
```
Caption: Suggested file structure

Tech stack:
• Rust 1.75+ (2021 edition), Cargo workspace with `resolver = "2"`
• `tokio` (full features) for async runtime
• `axum` for HTTP/WebSocket server
• `sled` for embedded persistent storage
• `serde` + `serde_json` for request/response types
• `thiserror` for typed errors, `anyhow` for the binary
• `tracing` + `tracing-subscriber` for structured logs
• `clap` (derive) for the CLI
• `figment` (TOML + env) for configuration
• `reqwest` for integration tests
• `nanoid` for slug generation
• `governor` for rate limiting (P1)
• `metrics` + `metrics-exporter-prometheus` for /metrics (P2)
• `moka` for in-memory caching (P2)

> **Tip:** Testing strategy:
> - Unit tests in `#[cfg(test)] mod tests` inside every module; aim for
>     `>=85%` line coverage on `core` (check with `cargo llvm-cov`).
>   - Storage tests use `sled::Config::default().temporary(true)` for
>     isolation; no shared state between tests.
>   - Integration tests in `crates/api/tests/` spin up the full Axum app
>     on a random port via `tokio::net::TcpListener` and use `reqwest`
>     for HTTP calls; assert status codes, JSON bodies, and redirect
>     Location headers.
>   - Property tests with `proptest` for slug generation (length,
>     alphabet) and URL parsing (rejects malformed input).
>   - Async tests use `#[tokio::test]` with `flavor = "current_thread"`.
>   - WebSocket test uses `tokio-tungstenite` to connect, send a
>     redirect, and assert a hit event arrives within 1 second.
>   - Snapshot tests for error JSON via `insta` to catch accidental
>     API-shape changes.
>   - Run all tests with `cargo test --workspace --all-features`;
>     coverage with `cargo llvm-cov --workspace --html`.

> **Tip:** Deployment guide:
> - Deploy target: Fly.io (preferred for global edge) or Render.com.
>   - Environment variables: `SHORLY_PORT=8080`, `SHORLY_DB_PATH=/data/shorly.sled`,
>     `SHORLY_BASE_URL=https://sho.rt`, `RUST_LOG=info,shorly=debug`.
>   - Build command (CI/local): `cargo build --release --workspace`.
>   - Docker image build: `docker build -t shorly:latest .` (multi-stage;
>     final image is ~50MB).
>   - Start command: `./shorly-api` (binary from `crates/api/target/release`).
>   - Fly.io: `fly launch` (auto-detects Dockerfile), `fly deploy`,
>     attach a 1GB persistent volume at `/data` for sled.
>   - Render: create a Web Service from the repo, set build `cargo
>     install --path crates/api --locked`, start `./api`, attach a disk
>     at `/data`.
>   - Post-deploy verification: `curl https://<host>/health` returns 200;
>     `curl -X POST https://<host>/shorten -d '{"url":"https://example.com"}'`
>     returns a short URL; the short URL 301s to the target; `/stats/<slug>`
>     returns `hits >= 1`.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Correctness & API contract (20 pts) — All P0 endpoints work as
>      specified; redirects return proper 301 with Location; errors map
>      to correct HTTP status codes with consistent JSON shape.
>   2. Rust idioms & safety (20 pts) — No `unwrap()` in production
>      paths (only in tests); ownership/borrowing used idiomatically;
>      `Arc<dyn Storage>` for shared trait objects; no `unsafe`; clippy
>      clean with `-D warnings`.
>   3. Async correctness (20 pts) — No blocking calls inside async
>      (`tokio::fs`, not `std::fs`); channels sized reasonably; aggregator
>      task shuts down cleanly on SIGTERM; WebSocket handler is
>      cancellation-safe.
>   4. Testing & CI (20 pts) — `>=85%` coverage on `core`; integration
>      tests in `tests/` exercise the full API; CI runs fmt + clippy +
>      test on every push; property tests for slug generation.
>   5. Polish & deployment (20 pts) — Structured logs with `tracing`;
>      graceful shutdown; clean Dockerfile under 100MB; README with
>      quickstart, architecture diagram, and API reference; deployable
>      to Fly.io or Render with one command.
> 
> Stretch goals:
>   - Add a Postgres backend behind the `Storage` trait using `sqlx` with
>     compile-time query checking.
>   - Implement an LRU cache (`moka`) for hot slugs with a 5-minute TTL.
>   - Add OpenTelemetry tracing export to Honeycomb or Grafana Cloud.
>   - Write a `#[derive(Storage)]` proc-macro that generates `Storage`
>     impls for any `struct` with a primary-key field.
>   - Add a `shorly migrate` CLI that imports from a Bitly CSV export.
>   - Build a small HTML admin UI (served from `axum::serve`) listing
>     top slugs by traffic, using `askama` templates.
>   - Implement exponential backoff retry on sled write failures.
>   - Add per-tenant rate limiting via `governor` returning 429 with
>     `Retry-After` headers.
> 
> 
> ======================================================================
> END OF RUST TRACK — 20 STAGES + CAPSTONE
> ======================================================================

> **Tip:** Stretch goals:
> • Add a Postgres backend behind the `Storage` trait using `sqlx` with
> • compile-time query checking.
> • Implement an LRU cache (`moka`) for hot slugs with a 5-minute TTL.
> • Add OpenTelemetry tracing export to Honeycomb or Grafana Cloud.
> • Write a `#[derive(Storage)]` proc-macro that generates `Storage`
> • impls for any `struct` with a primary-key field.
> • Add a `shorly migrate` CLI that imports from a Bitly CSV export.
> • Build a small HTML admin UI (served from `axum::serve`) listing
> • top slugs by traffic, using `askama` templates.
> • Implement exponential backoff retry on sled write failures.
> • Add per-tenant rate limiting via `governor` returning 429 with
> • `Retry-After` headers.
> • ======================================================================
> • END OF RUST TRACK — 20 STAGES + CAPSTONE
> • ======================================================================

