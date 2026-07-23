---
slug: flask-capstone-project
id: flask-capstone
track: flask
order: 21
title: "Capstone Project: Shortify"
description: |-
  Build "Shortify" — a production-grade multi-tenant URL shortener with
    click analytics, custom slugs, scheduled campaigns, and a public REST
    API. Each tenant (a marketing team, an e-commerce brand, a podcast)
    gets its own namespace (acme.shrt.io, globex.shrt.io) with strict
    data isolation. Au
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: Flask Official Docs
    url: https://flask.palletsprojects.com/
    kind: doc
---

# Capstone Project: Shortify

## Shortify

Problem statement:
Build "Shortify" — a production-grade multi-tenant URL shortener with
  click analytics, custom slugs, scheduled campaigns, and a public REST
  API. Each tenant (a marketing team, an e-commerce brand, a podcast)
  gets its own namespace (acme.shrt.io, globex.shrt.io) with strict
  data isolation. Authenticated users create short links with optional
  expiry, password protection, and campaign tags; anonymous visitors
  hit the short link and are 302-redirected to the destination while a
  Celery worker aggregates the click into a per-tenant rollup. The
  backend is Flask 3 + Flask-SQLAlchemy 3 + Flask-Migrate + Flask-Login
  + Flask-Smorest + Flask-WTF + Celery + Redis; Postgres stores data;
  Redis is the cache and broker. The platform must ship with JWT auth
  for the public API, session auth for the admin UI, CSRF on every form
  POST, brute-force protection on /login, Postgres full-text search on
  links, API rate limiting per tenant, CI (ruff + mypy + pytest with
  85% coverage), Docker, and zero-downtime deploy to Render or Fly.io.
  This capstone exercises every concept from the 20-stage track:
  factory pattern, blueprints, SQLAlchemy 3.x query style, Alembic
  migrations, WTForms, Flask-Login, Flask-Smorest (OpenAPI), Celery,
  pytest-flask, flask-talisman, flask-limiter, structured logging,
  Gunicorn + Nginx, and Prometheus metrics.

Target users:
• Marketing teams who need branded short links (acme.shrt.io/launch)
• with per-campaign click analytics and scheduled go-live.
• E-commerce brands that want promo links with expiry and password
• protection tied to one-time-use coupon codes.
• Podcasters and creators who want a single memorable link
• (shrt.io/show42) that redirects to the latest episode across
• Apple Podcasts, Spotify, and YouTube based on the listener's
• platform.
• Internal platform teams who need a self-hosted Bitly alternative
• behind SSO with audit logging and per-tenant rate limits.

P0 (Must have) requirements:
• Multi-tenant data isolation: every query scoped by request.tenant;
• no cross-tenant leaks; subdomain resolves to Tenant row.
• Custom User model with email-as-username, PBKDF2 password hashing,
• email verification via itsdangerous signed URL.
• Link CRUD: create (long_url, optional custom slug, optional expiry,
• optional password), list (paginated), update, delete, soft-delete.
• Anonymous redirect route GET /<slug> that 302-redirects to long_url,
• enforces expiry (410 Gone), enforces password (form GET), records
• the click event into Redis for batch aggregation.
• Click analytics: per-link and per-tenant daily/hourly rollups of
• total clicks, unique visitors (by IP hash), top referers, top
• countries (via GeoIP), top devices (UA parse).
• Public REST API at /api/v1/ with Flask-Smorest + OpenAPI 3.1 +
• Swagger UI at /api/docs; JWT auth (Flask-JWT-Extended) with
• refresh-token rotation.
• Admin UI at / with Flask-Login session auth, Flask-WTF forms,
• CSRF on every POST, flash messages, Jinja2 templates with
• inheritance.
• Rate limiting: 100 req/min per API key, 30 req/min anonymous,
• 5/min on /login (brute force); Redis-backed so limits are shared
• across workers.
• Comprehensive test suite with pytest-flask + factory_boy; 85%
• coverage on core modules; per-test transaction rollback.
• Dockerfile (multi-stage) + docker-compose (web + worker + beat +
• db + redis + nginx); GitHub Actions CI: ruff, mypy, pytest --cov.
• /health (liveness) and /ready (readiness: DB + Redis ping) plus
• Prometheus metrics at /metrics.

P1 (Should have) requirements:
• Celery Beat schedule: hourly click-aggregation task that drains the
• Redis click buffer into the rollup tables; nightly task that
• expires links past their expiry_at.
• Postgres full-text search on Link.long_url and Link.title using
• SearchVector + GIN index; @action(detail=False) search endpoint.
• Custom slug validation: banned-words list, length 3-32,
• [a-z0-9-] only, uniqueness per tenant.
• QR code generation per link (qrcode library) served from
• /api/v1/links/<id>/qr.png.
• flask-talisman with HSTS, CSP (nonce-based script-src),
• frame-ancestors 'none', X-Content-Type-Options nosniff.
• select_for_update on the slug-counter race (when generating
• auto-increment slugs) to prevent collisions under concurrent
• create requests.
• Cache the per-tenant link-list page for 30s; invalidate on
• Link post_save (signal or after_commit).
• Structured JSON logs with X-Request-ID propagation; Sentry
• integration for 5xx capture.

P2 (Nice to have) requirements:
• A/B testing: rotate between two long_urls per slug with weighted
• split; per-variant click rollup.
• Webhooks: POST to a tenant-configured URL on each click (with
• HMAC signature and retry).
• SSO via SAML (Okta) for enterprise tenants; SCIM provisioning.
• AI-assisted 'spam/phishing detection' on long_url using a hosted
• classifier; auto-quarantine links scoring > 0.8.
• Per-tenant custom domains (acme.com instead of acme.shrt.io)
• with CNAME verification and Let's Encrypt auto-cert.
• GraphQL endpoint via strawberry-flask alongside REST.
• Audit log of admin actions (delete, merge, transfer) with full
• diff (simple-history pattern).
• Real-time click stream via Server-Sent Events on /admin/links/<id>
• /stream.

```text
shortify/
    pyproject.toml
    wsgi.py
    Dockerfile
    docker-compose.yml
    nginx.conf
    .env.example
    .github/workflows/ci.yml
    gunicorn.conf.py
    app/
        __init__.py            # create_app() factory
        config.py              # BaseConfig/DevConfig/ProdConfig/TestConfig
        extensions.py          # db, login_manager, migrate, jwt, csrf, limiter, talisman
        celery.py              # make_celery(app)
        errors.py              # errorhandlers + branded pages
        logging_config.py      # dictConfig + RequestIdFilter
        tenants/
            __init__.py        # Blueprint('tenants')
            middleware.py       # subdomain -> request.tenant
            models.py           # Tenant, Membership
            views.py            # /admin/tenants/ CRUD
        accounts/
            __init__.py        # Blueprint('accounts')
            models.py           # User (email-as-username, PBKDF2)
            forms.py            # SignupForm, LoginForm, VerifyEmailForm
            views.py            # /auth/*
            tokens.py           # email-verification token generator
        links/
            __init__.py        # Blueprint('links')
            models.py           # Link, with tenant FK + unique slug per tenant
            services.py         # create_link, generate_slug (select_for_update)
            forms.py            # LinkForm (WTF + slug validator)
            views.py            # /admin/links/ CRUD UI
            signals.py          # after_commit -> cache invalidation
        public/
            __init__.py        # Blueprint('public')
            views.py            # GET /<slug> -> 302 + click record
            password.py         # password-protected link form
        api/
            __init__.py        # Flask-Smorest Api + register blueprints
            v1/
                __init__.py
                links.py        # blp = Blueprint('links-api', url_prefix='/api/v1/links')
                auth.py         # /api/v1/auth/login, /refresh, /me
                schemas.py      # marshmallow LinkSchema, ClickRollupSchema
                errors.py       # JSON error handlers
        analytics/
            __init__.py
            models.py           # ClickEvent (raw), ClickRollup (daily/hourly)
            services.py         # record_click, aggregate, top_referers
            tasks.py            # aggregate_clicks (Celery Beat hourly)
            geoip.py            # GeoIP lookup helper
        notifications/
            __init__.py
            tasks.py            # send_low_traffic_alert (Celery)
            emails.py           # Flask-Mail render+send
        templates/
            base.html
            admin/
                links/list.html
                links/form.html
                links/detail.html
            auth/
                login.html
                signup.html
            errors/404.html
            errors/500.html
            emails/verify_email.html
        static/
            css/app.css
            js/app.js
    migrations/                  # Alembic (flask db init)
        env.py
        versions/
    tests/
        conftest.py             # app, client, session fixtures
        factories.py            # UserFactory, TenantFactory, LinkFactory
        test_tenant_isolation.py
        test_public_redirect.py
        test_link_crud.py
        test_api_auth.py
        test_api_links.py
        test_analytics_aggregation.py
        test_rate_limiting.py
        test_security_headers.py
    scripts/
        seed_dev.py
        release.sh              # migrate + collectstatic + gunicorn
```
Caption: Suggested file structure

Tech stack:
• Python 3.12
• Flask 3.0+
• Flask-SQLAlchemy 3.1+ (SQLAlchemy 2.x select() style)
• Flask-Migrate 4.x (Alembic) for migrations
• Flask-Login 0.6+ for admin UI session auth
• Flask-WTF 1.2+ for forms + CSRF
• Flask-Smorest 0.14+ for REST API + OpenAPI 3.1
• marshmallow 3.20+ for schemas
• Flask-JWT-Extended 4.6+ for API JWT auth
• Flask-Mail 0.9+ for transactional email
• Celery 5.3+ + celery-beat for background tasks
• Redis 7 (cache + Celery broker + rate-limit storage)
• PostgreSQL 16 with full-text search + GIN indexes
• flask-talisman 1.1+ for HSTS + CSP + security headers
• flask-limiter 3.5+ for rate limiting (Redis backend)
• prometheus-flask-exporter 0.23+ for /metrics
• sentry-sdk[flask] for error capture
• pytest + pytest-flask + pytest-cov + factory_boy
• ruff (lint/format) + mypy (type-check)
• Gunicorn (WSGI) + Nginx (TLS + static) + Docker
• GitHub Actions (CI) + Render.com or Fly.io (hosting)

> **Tip:** Testing strategy:
> - Unit tests for services: create_link (with select_for_update race
>     test using 10 threads), aggregate_clicks (with CELERY_TASK_ALWAYS_EAGER
>     and a mocked Redis list), email-verify token generator, tenant
>     middleware — using pytest-flask + factory_boy. Each test in
>     isolation with function-scoped fixtures.
>   - Integration tests for the API: every Flask-Smorest endpoint with
>     the test_client + JWT header, covering happy path, permissions
>     (cross-tenant denial returns 404 not 403 to avoid leaking existence),
>     validation errors (422), rate-limit (429 after 100/min), and
>     not-found (404).
>   - Concurrency test for slug generation: spawn 10 threads each calling
>     create_link with auto-generated slug on the same tenant; assert all
>     10 links are created with distinct slugs (uses select_for_update).
>   - Security tests: POST /admin/links/new without csrf_token returns
>     400; POST /api/v1/links without Authorization returns 401;
>     securityheaders.com scan returns A+; GET /<slug> on expired link
>     returns 410.
>   - Coverage target: 85% line + 75% branch on app/ (excluding
>     migrations/). Run `pytest --cov=app --cov-report=term-missing
>     --cov-fail-under=85`.
>   - CI: GitHub Actions runs ruff check, mypy, pytest --cov on every
>     push and PR; merges to main require green CI.

> **Tip:** Deployment guide:
> - Hosting: Render.com (web service + background worker + cron +
>     managed Postgres + managed Redis) or Fly.io (Docker-based,
>     multi-region).
>   - Environment variables: FLASK_CONFIG=prod, SECRET_KEY,
>     DATABASE_URL, REDIS_URL, JWT_SECRET_KEY, SENTRY_DSN,
>     MAIL_SERVER, MAIL_USERNAME, MAIL_PASSWORD, ALLOWED_HOSTS
>     (.shrt.io), CSP_REPORT_URI, CELERY_BROKER_URL (= REDIS_URL),
>     CELERY_RESULT_BACKEND (= REDIS_URL).
>   - Build command: `pip install -r requirements.txt` (Render
>     auto-detects Dockerfile; on Fly.io use `fly deploy`).
>   - Release command: `flask db upgrade` (Alembic applies pending
>     migrations before the new code serves traffic).
>   - Start command (web): `gunicorn -c gunicorn.conf.py
>     wsgi:application` (workers=4, threads=2, max_requests=1000,
>     bind=0.0.0.0:$PORT).
>   - Start command (worker): `celery -A app.celery worker -l info
>     --concurrency=4`.
>   - Start command (beat): `celery -A app.celery beat -l info`.
>   - Post-deploy verification: curl https://acme.shrt.io/health
>     returns 200; curl https://acme.shrt.io/ready returns 200 (DB +
>     Redis up); signup flow sends a verification email; GET
>     https://acme.shrt.io/example 302-redirects; /api/docs serves
>     Swagger UI; /metrics is scraped; an unknown subdomain returns
>     404; a k6 load test at 100 RPS for 5 min shows p99 < 300ms on
>     the redirect route.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Multi-tenant correctness (20 pts) — Every query is scoped by
>      g.tenant; cross-tenant data access is impossible (returns 404,
>      not 403, to avoid existence leaks); tests cover isolation.
>   2. API design + Flask-Smorest (20 pts) — RESTful endpoints with
>      proper status codes (201/204/422/401/404/429), pagination, JWT
>      auth + refresh rotation, OpenAPI spec auto-generated, Swagger UI
>      at /api/docs.
>   3. Concurrency + data integrity (20 pts) — Slug generation uses
>      select_for_update under concurrent creates (no collisions);
>      click aggregation drains Redis atomically (RPOPLPUSH pattern);
>      expired links return 410 not 302.
>   4. Production readiness (20 pts) — Security checklist applied
>      (CSRF, HSTS, CSP, frame-ancestors, rate limits); ProxyFix
>      behind Nginx; /health vs /ready separate; Prometheus metrics;
>      Sentry captures 5xx; structured logs with X-Request-ID; 85%
>      test coverage with CI gate.
>   5. Background + async correctness (20 pts) — Celery tasks are
>      idempotent (redelivery safe); after_commit used for webhook
>      dispatch; Beat schedules for aggregation and expiry work under
>      load; worker + beat run as separate Docker services.
> 
> Stretch goals:
>   - A/B testing with weighted splits per slug; per-variant rollups.
>   - Webhooks on each click with HMAC signature and exponential-backoff
>     retry (Celery task).
>   - SAML SSO (Okta) for enterprise tenants + SCIM user provisioning.
>   - AI-assisted spam/phishing detection on long_url; auto-quarantine
>     links scoring > 0.8.
>   - Per-tenant custom domains (acme.com) with CNAME verification and
>     Let's Encrypt auto-cert via certbot.
>   - GraphQL endpoint via strawberry-flask alongside REST.
>   - Audit log of admin actions with full diff (simple-history pattern).
>   - Real-time click stream via Server-Sent Events on
>     /admin/links/<id>/stream (using Flask's streaming response).
>   - Geo-routing: redirect to the closest regional long_url based on
>     GeoIP (CDN-style).
>   - Plugin system: per-tenant hooks that run before redirect
>     (e.g., inject UTM params, A/B test, log to Datadog).

> **Tip:** Stretch goals:
> • A/B testing with weighted splits per slug; per-variant rollups.
> • Webhooks on each click with HMAC signature and exponential-backoff
> • retry (Celery task).
> • SAML SSO (Okta) for enterprise tenants + SCIM user provisioning.
> • AI-assisted spam/phishing detection on long_url; auto-quarantine
> • links scoring > 0.8.
> • Per-tenant custom domains (acme.com) with CNAME verification and
> • Let's Encrypt auto-cert via certbot.
> • GraphQL endpoint via strawberry-flask alongside REST.
> • Audit log of admin actions with full diff (simple-history pattern).
> • Real-time click stream via Server-Sent Events on
> • /admin/links/<id>/stream (using Flask's streaming response).
> • Geo-routing: redirect to the closest regional long_url based on
> • GeoIP (CDN-style).
> • Plugin system: per-tenant hooks that run before redirect
> • (e.g., inject UTM params, A/B test, log to Datadog).

