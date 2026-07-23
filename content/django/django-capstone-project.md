---
slug: django-capstone-project
id: django-capstone
track: django
order: 21
title: "Capstone Project: Codex"
description: |-
  Build "Codex" — a production-grade multi-tenant Q&A platform (think
    Stack Overflow for organizations) where users in a tenant can ask
    questions, answer, vote, comment, and earn reputation. Each tenant
    gets its own subdomain (acme.codex.app, globex.codex.app) with strict
    data isolation. The b
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Capstone Project: Codex

## Codex

Problem statement:
Build "Codex" — a production-grade multi-tenant Q&A platform (think
  Stack Overflow for organizations) where users in a tenant can ask
  questions, answer, vote, comment, and earn reputation. Each tenant
  gets its own subdomain (acme.codex.app, globex.codex.app) with strict
  data isolation. The backend is Django 5 + DRF; Celery handles email
  digests and Slack notifications; Channels powers a real-time
  "new answer" feed per question; Postgres stores data; Redis is the
  cache and broker. The platform must ship with auth (JWT + email
  verification), role-based permissions (member/moderator/admin),
  search via Postgres full-text, API rate limiting, CI (ruff + mypy +
  pytest with 85% coverage), Docker, and zero-downtime deploy to
  Render/Fly.io. This capstone exercises every concept from the
  20-stage track: models, ORM, forms, CBVs, DRF, auth, sessions,
  middleware (tenant resolution), admin, tests, Celery, Channels,
  caching, security, performance, deployment, signals, and custom
  managers.

Target users:
• Engineering teams who want an internal Q&A tool without paying for Stack Overflow for Teams.
• Bootcamp cohorts who need a private space for student questions with moderation.
• Open-source projects that want a self-hosted Q&A mirror with SSO.

P0 (Must have) requirements:
• Multi-tenant data isolation: every query scoped by request.tenant; no cross-tenant leaks.
• Custom User model with email-as-username, email verification via signed token.
• Question CRUD via DRF (list with pagination, create, retrieve, update, delete).
• Answer CRUD nested under Question (POST /api/questions/<id>/answers/).
• Voting on questions and answers (one vote per user, toggles up/down).
• Comment threads on answers (one level deep).
• Reputation: +10 for accepted answer, +5 for upvote received, -2 for downvote given.
• Postgres full-text search on question title + body (SearchVector + SearchRank).
• JWT auth (djangorestframework-simplejwt) + refresh-token rotation.
• Rate limiting: 100 req/min per user, 30 req/min anonymous.
• Tenant-resolved subdomain middleware (acme.codex.app -> Tenant row).
• Comprehensive test suite with factory_boy; 85% coverage on core modules.
• Dockerfile + docker-compose (web + worker + beat + db + redis).
• CI on GitHub Actions: ruff, mypy, pytest --cov.
• /health endpoint returning 200 + DB/cache check.

P1 (Should have) requirements:
• Celery Beat weekly digest of unanswered questions per user.
• Slack notification via incoming webhook when a question gets an accepted answer.
• Channels WebSocket for live "new answer" feed per question.
• Tag system with auto-suggest; question list filter by tag.
• Admin customization: tenant-scoped ModelAdmins, custom actions for "merge users".
• django-csp in report-only mode; tighten script-src to nonce-based.
• select_for_update on voting to prevent double-count races.
• Cache the question list per tenant for 60s; invalidate on new question.

P2 (Nice to have) requirements:
• Markdown rendering with bleach sanitization (XSS-safe).
• Image upload to S3 via presigned URLs.
• ActivityPub federation (cross-instance Q&A).
• AI-assisted "duplicate detection" using pgvector embeddings.
• Email digest with per-tag digest preferences.
• Audit log of moderator actions (delete, lock, merge).
• Webhooks for external integrations when a question is asked.
• GraphQL endpoint via strawberry-django.

```text
codex/
    pyproject.toml
    manage.py
    Dockerfile
    docker-compose.yml
    .env.example
    .github/workflows/ci.yml
    config/
        __init__.py
        settings.py
        urls.py
        asgi.py
        wsgi.py
        celery.py
    tenants/
        __init__.py
        apps.py
        middleware.py          # subdomain -> request.tenant
        models.py              # Tenant, Membership
        backends.py            # tenant-aware auth backend
        signals.py
    accounts/
        __init__.py
        apps.py
        models.py              # custom User (email-as-username)
        managers.py
        serializers.py
        views.py               # signup, verify-email, me
        tokens.py              # email verification token generator
        urls.py
    qa/
        __init__.py
        apps.py
        models.py              # Question, Answer, Comment, Vote, Tag
        managers.py            # PostQuerySet (chainable: for_tenant, with_vote_count)
        serializers.py
        views.py               # ViewSets + @action endpoints
        permissions.py         # IsAuthorOrReadOnly, IsTenantMember
        signals.py             # post_save -> cache invalidation + Celery notify
        search.py              # SearchVector helper
        urls.py
    realtime/
        __init__.py
        consumers.py           # QuestionFeedConsumer (Channels)
        routing.py
    notifications/
        __init__.py
        tasks.py               # send_digest, send_slack
        services.py
    codex/                     # project package
        __init__.py
    templates/
        base.html
        emails/
            verify_email.html
            digest.html
    static/
        css/app.css
    tests/
        conftest.py
        factories.py
        test_tenant_isolation.py
        test_qa_api.py
        test_voting.py
        test_auth.py
        test_search.py
        test_realtime.py
    scripts/
        seed_dev.py
```
Caption: Suggested file structure

Tech stack:
• Python 3.12
• Django 5.x
• Django REST Framework 3.15+
• djangorestframework-simplejwt (JWT auth)
• PostgreSQL 16 with pg_trgm + full-text search
• Redis 7 (cache + Channels layer + Celery broker)
• Celery 5 + celery-beat + django-celery-results
• Django Channels 4 + channels-redis
• django-csp (Content Security Policy)
• django-storages with S3 (P2)
• Pillow (image processing, P2)
• factory_boy + pytest-django + pytest-cov (testing)
• ruff (lint/format) + mypy (type-check)
• WhiteNoise (static files in prod)
• Gunicorn (WSGI) + Daphne (ASGI for Channels)
• Nginx (TLS termination, static, WebSocket upgrade)
• Docker + docker-compose
• GitHub Actions (CI)
• Render.com or Fly.io (hosting)

> **Tip:** Testing strategy:
> - Unit tests for services: vote(), transfer reputation, token generator,
>     tenant middleware — using pytest-django + factory_boy. Each test in
>     isolation with function-scoped fixtures.
>   - Integration tests for the API: every ViewSet endpoint with APIClient +
>     force_authenticate, covering happy path, permissions (cross-tenant
>     denial), validation errors (400), and not-found (404).
>   - Concurrency test for voting: spawn 10 threads voting on the same
>     question simultaneously; assert final vote count == 10 and reputation
>     sums correctly (uses select_for_update).
>   - Channels test: use channels.testing.WebsocketCommunicator to connect
>     to QuestionFeedConsumer, post an Answer via the API, assert the
>     consumer received the "new_answer" event.
>   - Coverage target: 85% line + 75% branch on qa/, accounts/, tenants/,
>     realtime/. Run `pytest --cov=. --cov-report=term-missing --cov-fail-under=85`.
>   - CI: GitHub Actions runs ruff check, mypy, pytest --cov on every push
>     and PR; merges to main require green CI.

> **Tip:** Deployment guide:
> - Hosting: Render.com (web service + background worker + cron + managed
>     Postgres + managed Redis) or Fly.io (Docker-based, multi-region).
>   - Environment variables: SECRET_KEY, DATABASE_URL, REDIS_URL, DJANGO_SETTINGS_MODULE
>     (codex.settings.prod), ALLOWED_HOSTS, EMAIL_HOST, EMAIL_HOST_USER,
>     EMAIL_HOST_PASSWORD, SLACK_WEBHOOK_URL, AWS_ACCESS_KEY_ID,
>     AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET (P2), CSP_REPORT_URI.
>   - Build command: `pip install -r requirements.txt` (Render auto-detects
>     Dockerfile or pyproject; on Fly.io use `fly deploy`).
>   - Release command: `python manage.py migrate --noinput && python manage.py
>     collectstatic --noinput`.
>   - Start command (web): `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
>     --workers 4 --threads 2 --max-requests 1000`.
>   - Start command (worker): `celery -A config worker --loglevel=info --concurrency=4`.
>   - Start command (beat): `celery -A config beat --loglevel=info`.
>   - Start command (realtime): `daphne -b 0.0.0.0 -p $PORT_RT config.asgi:application`.
>   - Post-deploy verification: curl https://acme.codex.app/health/ returns
>     {"status":"ok"}; curl a non-existent subdomain returns 404; signup flow
>     sends a verification email; WebSocket connects to
>     wss://acme.codex.app/ws/questions/<id>/.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Multi-tenant correctness (20 pts) — Every query is scoped by request.tenant; cross-tenant data access is impossible; tests cover isolation.
>   2. API design + DRF (20 pts) — RESTful endpoints with proper status codes, pagination, filtering, permissions, and serializers; consistent naming.
>   3. Concurrency + data integrity (20 pts) — Voting uses select_for_update; reputation can't go negative; no double-counts under concurrent load.
>   4. Real-time + async correctness (20 pts) — Channels consumer is async-safe (no blocking ORM); on_commit used for Celery tasks; no event-loop stalls.
>   5. Production readiness (20 pts) — Security checklist applied; tests at 85% coverage; CI green; Docker + deploy pipeline works; /health/ monitored.
> 
> Stretch goals:
>   - Add GraphQL via strawberry-django with tenant-aware resolvers.
>   - Add AI duplicate detection using pgvector embeddings of question bodies.
>   - ActivityPub federation so two Codex instances can share questions.
>   - Plugin system for custom "answer processors" (lint, format, AI summarize).
>   - Mobile push notifications via Firebase Cloud Messaging.
>   - Per-tenant theming (custom CSS upload, logo via S3).
>   - Advanced moderation: comment threading, lock/merge questions, shadow-ban.
>   - Real-time presence indicators (who's typing, who's viewing).
>   - Webhooks for external integrations (Slack, Discord, custom HTTP).
>   - Audit log with full diff (django-simple-history or auditlog).

> **Tip:** Stretch goals:
> • Add GraphQL via strawberry-django with tenant-aware resolvers.
> • Add AI duplicate detection using pgvector embeddings of question bodies.
> • ActivityPub federation so two Codex instances can share questions.
> • Plugin system for custom "answer processors" (lint, format, AI summarize).
> • Mobile push notifications via Firebase Cloud Messaging.
> • Per-tenant theming (custom CSS upload, logo via S3).
> • Advanced moderation: comment threading, lock/merge questions, shadow-ban.
> • Real-time presence indicators (who's typing, who's viewing).
> • Webhooks for external integrations (Slack, Discord, custom HTTP).
> • Audit log with full diff (django-simple-history or auditlog).

