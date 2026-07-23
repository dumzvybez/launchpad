---
slug: ruby-capstone-project
id: ruby-capstone
track: ruby
order: 21
title: "Capstone Project: Build a URL Shortener with Analytics — a..."
description: |-
  Build a URL Shortener with Analytics — a production-grade Ruby web service that
    takes long URLs, generates short memorable slugs, redirects visitors with
    301 status codes, and tracks every click with timestamp, IP address, and
    user-agent. The service must persist data in PostgreSQL, cache hot 
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Capstone Project: Build a URL Shortener with Analytics — a...

## Build a URL Shortener with Analytics — a...

Problem statement:
Build a URL Shortener with Analytics — a production-grade Ruby web service that
  takes long URLs, generates short memorable slugs, redirects visitors with
  301 status codes, and tracks every click with timestamp, IP address, and
  user-agent. The service must persist data in PostgreSQL, cache hot slugs
  in Redis, expose a REST API with proper status codes, ship as a Docker
  image, run on Render or Fly.io, and pass a CI pipeline (RuboCop + RSpec
  with >=80% coverage). This project exercises every concept from the
  20-stage track: Rack, Sinatra, ActiveRecord, migrations, validations,
  exceptions, threads, regex, testing, Docker, and CI/CD.

Target users:
• Marketing teams who need trackable short links for email and social campaigns.
• Internal engineering teams who want branded short links for documentation and on-call runbooks.
• Individual content creators who want click analytics on shared links without a SaaS subscription.

P0 (Must have) requirements:
• POST /api/shorten accepts JSON {"url": "..."} and returns {"short_url": "...", "slug": "..."}
• GET /:slug issues a 301 redirect to the stored long URL; returns 404 if slug not found
• PostgreSQL persistence for slugs and long URLs (id, slug, long_url, created_at, expires_at)
• Click tracking: every redirect records (slug, timestamp, ip, user_agent) in a clicks table
• GET /api/stats/:slug returns {"total_clicks": N, "last_24h_clicks": M, "created_at": "..."}
• Basic input validation: reject malformed URLs with 422; reject slugs already in use with 409
• GET /health returns 200 {"status": "ok"} for platform health checks
• Dockerized via Dockerfile + docker-compose (app + postgres + redis)
• RSpec suite with >=80% line coverage on lib/
• Gemfile.lock committed; Sinatra::Base modular app

P1 (Should have) requirements:
• Redis cache for hot slugs (cache long_url for 5 min; invalidate on update)
• Custom slugs: POST /api/shorten accepts optional "slug" field
• URL expiration: optional "expires_at" ISO timestamp; expired slugs return 410 Gone
• Rate limiting on POST /api/shorten (e.g. 10/min per IP) via Rack::Attack
• API key auth on /api/stats endpoints (X-API-Key header, validated against env var)
• Structured JSON logging via Logger + custom formatter

P2 (Nice to have) requirements:
• QR code generation: GET /:slug/qrcode returns a PNG
• Browser/OS/country detection from user-agent and IP (user_agent_parser + geoip)
• A/B testing: a slug can map to multiple destinations with weighted random selection
• Custom domains (CNAME verification)
• CSV export: GET /api/stats/:slug/export.csv
• Prometheus metrics endpoint at /metrics
• Simple ERB web UI for browsing stats

```text
url-shortener/
    Gemfile
    Gemfile.lock
    config.ru
    Rakefile
    README.md
    Dockerfile
    docker-compose.yml
    .env.example
    .dockerignore
    .github/
        workflows/
            ci.yml
    config/
        database.yml
        puma.rb
    db/
        migrate/
            001_create_short_urls.rb
            002_create_clicks.rb
        schema.rb
    lib/
        shortener/
            app.rb              # Sinatra::Base app
            models/
                short_url.rb
                click.rb
            services/
                slug_generator.rb
                analytics.rb
                rate_limiter.rb
            middleware/
                request_id.rb
                logging.rb
    spec/
        spec_helper.rb
        factories.rb
        app_spec.rb
        models/
            short_url_spec.rb
            click_spec.rb
        services/
            slug_generator_spec.rb
            analytics_spec.rb
```
Caption: Suggested file structure

Tech stack:
• Ruby 3.3 (latest stable at time of writing)
• Sinatra 4.0 (modular Sinatra::Base style) — lightweight Rack-based web DSL
• Puma 6 — multi-process, multi-threaded Rack server
• ActiveRecord 7.1 — ORM with migrations, validations, and query interface
• PostgreSQL 16 — primary datastore with index on slug
• Redis 7 — cache layer for hot slugs + rate limiting (via Rack::Attack)
• Rack::Attack — Rack middleware for rate limiting and safelisting
• SecureRandom (stdlib) — URL-safe slug generation
• RSpec 3 + SimpleCov — test framework and coverage
• RuboCop + Brakeman — lint and security scan
• Docker + docker-compose — local dev environment matching prod
• GitHub Actions — CI (lint + security + test) and CD (deploy on tag)
• Render.com — hosting (web service + managed Postgres + managed Redis)
• dotenv — local .env loading for development

> **Tip:** Testing strategy:
> - Unit tests with RSpec for pure functions: slug generation (1000
>     iterations for uniqueness), URL validation (table-driven with 10
>     valid + 10 invalid cases), expiration logic, analytics aggregation.
>   - Integration tests with Rack::Test against Shortener::App: POST
>     /api/shorten, GET /:slug, GET /api/stats/:slug, GET /health. Use
>     real PostgreSQL via testcontainers or a transactional fixture that
>     rolls back per test.
>   - Mock Redis with fakeredis (or a real Redis in CI) for cache hit/miss
>     and expiration tests. Mock Rack::Attack by setting the throttle
>     limit very low in the test environment.
>   - >=80% line coverage on lib/shortener/ (services at 95%+); enforce
>     via `bundle exec rspec --coverage --fail-under=80` in CI.
>   - Run tests with: `bundle exec rspec --format documentation --coverage`.
>     Use `bundle exec rubocop` for lint (zero offenses) and `bundle exec
>     brakeman -q -z` for security scan (zero warnings).

> **Tip:** Deployment guide:
> - Deploy to Render.com: create a Web Service (Docker), a managed
>     PostgreSQL (free tier OK for demo), and a managed Redis (free tier).
>   - Environment variables to set in Render dashboard: DATABASE_URL (from
>     Render Postgres internal URL), REDIS_URL (from Render Redis),
>     BASE_URL (https://your-app.onrender.com), API_KEY (generate a 32-char
>     secret), RACK_ENV=production, PORT=4567.
>   - Build command (Render runs this on each deploy): `bundle install --
>     without development test` (or just use the Dockerfile — Render
>     builds the image automatically).
>   - Start command: `bundle exec puma -C config/puma.rb -p $PORT` (Render
>     injects $PORT; alternatively use the Dockerfile CMD directly).
>   - Post-deploy verification: (1) `curl https://your-app.onrender.com/
>     health` returns 200 {"status":"ok"}; (2) `curl -X POST https://your-
>     app.onrender.com/api/shorten -H "Content-Type: application/json" -d
>     '{"url":"https://example.com"}'` returns 201 with a short_url; (3)
>     GET the short_url returns a 301 to example.com; (4) GET /api/stats/
>     <slug> with X-API-Key returns click counts.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Functionality (20 pts) — All P0 features work end-to-end; correct HTTP status codes (201/301/404/410/422/409); redirects complete in <100ms at p99; stats endpoint returns accurate counts.
>   2. Code quality (20 pts) — Clean lib/ layout; modular Sinatra::Base; ActiveRecord models with validations; rubocop clean; brakeman zero warnings; explicit rescue for known errors.
>   3. Testing (20 pts) — >=80% line coverage on lib/shortener/; unit tests for services; integration tests for endpoints; edge cases (expired, conflict, rate-limited, 404, 401); tests run in <30s.
>   4. Deployment (20 pts) — App deployed and reachable on Render (or Fly.io); /health returns 200; CI pipeline is green on main branch; Docker image builds reproducibly; .env.example documents all required vars.
>   5. Documentation (20 pts) — README has setup, run, test, and deploy instructions; API documented with example curl commands; env vars explained; architecture overview or file-tree diagram.
> 
> Stretch goals:
>   - Add QR code generation: GET /:slug/qrcode returns a PNG using the
>     rqrcode gem, cached in Redis for 1 hour.
>   - Add browser/OS detection using user_agent_parser and country
>     detection using geoip (with a MaxMind GeoLite2 database).
>   - Implement A/B testing: a slug maps to multiple destinations with
>     weights; redirect picks one via weighted random.
>   - Add a Prometheus /metrics endpoint exposing request count, latency
>     histogram, cache hit rate, and short_url count.
>   - Add OpenTelemetry tracing with OTLP exporter; trace every POST /
>     api/shorten and GET /:slug with spans for DB and Redis calls.
>   - Add custom domain support with CNAME verification and per-domain
>     rate limits.
>   - Add CSV export at GET /api/stats/:slug/export.csv streamed via
>     Sinatra's stream helper.
>   - Add a simple ERB web UI at /ui/:slug showing a stats dashboard
>     with Chart.js for the time series.
>   - Add a CLI command `rake shortener:cleanup` that purges expired
>     short_urls and their clicks nightly via a cron or Sidekiq job.
>   - Add webhook notifications: POST to a configured URL on each click
>     for real-time downstream processing.

> **Tip:** Stretch goals:
> • Add QR code generation: GET /:slug/qrcode returns a PNG using the
> • rqrcode gem, cached in Redis for 1 hour.
> • Add browser/OS detection using user_agent_parser and country
> • detection using geoip (with a MaxMind GeoLite2 database).
> • Implement A/B testing: a slug maps to multiple destinations with
> • weights; redirect picks one via weighted random.
> • Add a Prometheus /metrics endpoint exposing request count, latency
> • histogram, cache hit rate, and short_url count.
> • Add OpenTelemetry tracing with OTLP exporter; trace every POST /
> • api/shorten and GET /:slug with spans for DB and Redis calls.
> • Add custom domain support with CNAME verification and per-domain
> • rate limits.
> • Add CSV export at GET /api/stats/:slug/export.csv streamed via
> • Sinatra's stream helper.
> • Add a simple ERB web UI at /ui/:slug showing a stats dashboard
> • with Chart.js for the time series.
> • Add a CLI command `rake shortener:cleanup` that purges expired
> • short_urls and their clicks nightly via a cron or Sidekiq job.
> • Add webhook notifications: POST to a configured URL on each click
> • for real-time downstream processing.

