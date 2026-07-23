---
slug: php-capstone-project
id: php-capstone
track: php
order: 21
title: "Capstone Project: Markdown Notes API"
description: |-
  Build "Markdown Notes API" — a production-grade REST API plus a minimal
    Blade UI for managing markdown notes with tags, full-text search, and
    per-user authentication. The service must let users register, log in,
    create and tag notes (markdown body + title), search notes by content,
    share rea
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Capstone Project: Markdown Notes API

## Markdown Notes API

Problem statement:
Build "Markdown Notes API" — a production-grade REST API plus a minimal
  Blade UI for managing markdown notes with tags, full-text search, and
  per-user authentication. The service must let users register, log in,
  create and tag notes (markdown body + title), search notes by content,
  share read-only notes via short tokens, and revoke shares. It must
  persist data in MySQL via Eloquent, hash passwords with Argon2id,
  authenticate API requests via Laravel Sanctum tokens, expose REST
  endpoints with proper status codes and RFC 7807 errors, ship as a
  multi-stage Docker image (php-fpm + nginx + MySQL), pass a CI pipeline
  (Pest + PHPStan + Larastan) with at least 80% line coverage, and
  deploy to Render or Fly.io. This project exercises every concept from
  the 20-stage track: HTTP APIs, database access, security, sessions,
  testing, Docker, CI/CD, and deployment.

Target users:
• Developer teams who want a self-hosted, API-first alternative to
• hosted note apps (Notion, Bear) with markdown and tags.
• Technical writers who need to share read-only drafts of notes with
• editors via short URLs, revocable at any time.
• Indie hackers who want a personal knowledge base with full-text
• search across all notes, accessible from any client via REST.

P0 (Must have) requirements:
• POST /api/auth/register {name, email, password} -> 201 {user, token}
• POST /api/auth/login {email, password} -> 200 {user, token}
• POST /api/auth/logout -> 204 (revokes current Sanctum token)
• GET /api/notes -> 200 [note, ...] (paginated, authenticated)
• POST /api/notes {title, body, tags:[]} -> 201 note
• GET /api/notes/{id} -> 200 note (404 if not owned)
• PUT /api/notes/{id} {title?, body?, tags?} -> 200 note
• DELETE /api/notes/{id} -> 204 (404 if not owned)
• GET /api/notes/search?q=term -> 200 [note, ...] (LIKE-based search on title+body)
• POST /api/notes/{id}/share -> 201 {share_url, token} (generates random 32-char token)
• GET /api/shared/{token} -> 200 note (public, no auth; 404 if revoked)
• DELETE /api/notes/{id}/share/{token} -> 204 (revokes the share)
• Passwords hashed with PASSWORD_ARGON2ID (or PASSWORD_DEFAULT)
• All API endpoints (except /auth/register, /auth/login, /shared/*) require a Bearer token
• RFC 7807 problem+json responses for all errors with correct status codes
• Pest feature tests covering all endpoints, auth, validation, and shares
• Multi-stage Dockerfile (builder + php-fpm runtime) and docker-compose.yml (app + nginx + mysql)
• GitHub Actions CI matrix on PHP 8.2 and 8.3 running Pest + PHPStan
• .env.example documenting all required environment variables
• At least 80% line coverage on app/

P1 (Should have) requirements:
• Rate limiting on /auth/register and /auth/login (5/min per IP via Laravel's throttle middleware)
• Email verification before login works (Laravel's MustVerifyEmail)
• Password reset via email (Laravel's built-in reset broker)
• Tags normalized to lowercase slug form; GET /api/tags returning all of the user's tags
• Eager loading to prevent N+1 queries on note listings
• OpenAPI/Swagger spec at /api/docs (via Scribe or swagger-php)
• Structured JSON logging via Monolog with request_id
• Soft deletes on notes (deleted_at) so DELETE can be undone within 30 days
• `php artisan` commands for listing top users by note count and pruning expired shares

P2 (Nice to have) requirements:
• Markdown rendering on the server (CommonMark via league/commonmark) cached in a `rendered_html` column
• Full-text search via MySQL FULLTEXT indexes (better than LIKE for large datasets)
• Sharing with expiration timestamps (share_token_expires_at)
• Activity log endpoint GET /api/audit showing the last 50 actions per user
• Prometheus /metrics endpoint exposing request count, latency, cache hit rate
• Webhooks: POST to a configured URL when a note is created or shared
• Two-factor auth via Laravel Fortify (TOTP)
• A minimal Blade UI at /notes for browsing and editing notes (with CSRF + auth)

```text
markdown-notes-api/
    composer.json
    composer.lock
    .env.example
    .gitignore
    Dockerfile
    docker-compose.yml
    nginx.conf
    php.ini
    README.md
    .github/
        workflows/
            ci.yml
    app/
        Models/
            User.php
            Note.php
            Tag.php
            NoteShare.php
        Http/
            Controllers/
                Api/
                    AuthController.php
                    NoteController.php
                    ShareController.php
                    SearchController.php
                NotesController.php       # Blade UI
            Requests/
                StoreNoteRequest.php
                UpdateNoteRequest.php
                RegisterRequest.php
            Resources/
                NoteResource.php
                TagResource.php
            Middleware/
                EnsureAcceptJson.php
        Services/
            NoteService.php
            ShareService.php
            SearchService.php
        Exceptions/
            Handler.php                   # renders problem+json
        Providers/
            AppServiceProvider.php
    database/
        migrations/
            2024_01_01_create_users_table.php
            2024_01_02_create_notes_table.php
            2024_01_03_create_tags_table.php
            2024_01_04_create_note_tag_table.php
            2024_01_05_create_note_shares_table.php
        factories/
            UserFactory.php
            NoteFactory.php
            TagFactory.php
        seeders/
            DatabaseSeeder.php
    routes/
        web.php                           # Blade UI routes
        api.php                           # REST API routes
    resources/
        views/
            notes/
                index.blade.php
                show.blade.php
                edit.blade.php
            layouts/
                app.blade.php
    tests/
        Pest.php
        Feature/
            AuthTest.php
            NotesTest.php
            ShareTest.php
            SearchTest.php
            BladeUiTest.php
        Unit/
            NoteServiceTest.php
            ShareServiceTest.php
    config/
        sanctum.php
        logging.php
        services.php
```
Caption: Suggested file structure

Tech stack:
• PHP 8.2+ (8.3 preferred for typed class constants, json_validate)
• Laravel 11 — web framework (routing, Eloquent, Blade, Sanctum, validation)
• Laravel Sanctum — API token authentication (per-user, revocable tokens)
• MySQL 8 — primary datastore (or PostgreSQL 16 for FULLTEXT search)
• Eloquent ORM — ActiveRecord with migrations, factories, and seeders
• Blade — minimal templating for the optional UI
• league/commonmark — server-side markdown rendering (P1)
• Monolog (via Laravel's logging) — structured JSON logging
• Pest 2 + Mockery — testing framework with closures and mocks
• PHPStan + Larastan — static analysis (level 6+)
• Docker (multi-stage) + docker-compose — local dev and prod parity
• nginx 1.25 — reverse proxy to php-fpm
• GitHub Actions — CI (matrix on PHP 8.2/8.3) and CD (deploy on tag)
• Render.com or Fly.io — hosting (web service + managed MySQL)
• Scribe or swagger-php — OpenAPI documentation generation

> **Tip:** Testing strategy:
> - Unit tests with Pest for service classes (NoteService, ShareService,
>     SearchService): mock the Eloquent models, verify the service enforces
>     ownership, normalizes tags, generates share tokens, and queries the
>     right scopes. Use datasets for table-driven cases (10+ search terms,
>     5+ tag normalization cases).
>   - Feature tests with Pest's `RefreshDatabase` and `actingAs`: cover all
>     API endpoints, auth flows, validation errors, ownership (403 for
>     other users' notes), share creation/revocation, and rate limiting.
>     Each test runs in a DB transaction that rolls back, giving isolation.
>   - Integration tests with a real MySQL container (via `docker compose
>     up db` before `pest`) for FULLTEXT search and migration correctness.
>   - ≥80% line coverage on `app/` (services at 95%+); enforce via
>     `pest --coverage --min=80` in CI.
>   - Run tests with: `composer test` (alias for `pest --coverage-text`).
>     Use `composer test -- --filter=NoteService` for focused runs.

> **Tip:** Deployment guide:
> - Deploy to Render.com: create a Web Service (Docker), a managed MySQL
>     (free tier OK for demo), and (optional) Redis for caching.
>   - Environment variables to set in Render: APP_KEY (generate with
>     `php artisan key:generate`), APP_ENV=production, APP_DEBUG=false,
>     APP_URL=https://your-app.onrender.com, DB_CONNECTION=mysql,
>     DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD (from Render
>     MySQL), SANCTUM_STATEFUL_DOMAINS=your-app.onrender.com, LOG_CHANNEL=stderr.
>   - Build command (Render runs on each deploy): Dockerfile builds the
>     image automatically; no build command needed if using Docker.
>   - Start command: Render runs the Docker image's CMD, which is php-fpm
>     (in our Dockerfile). For a single-container deploy, use FrankenPHP
>     or Laravel Octane with RoadRunner instead of nginx + php-fpm.
>   - Run migrations after deploy: `php artisan migrate --force` (Render
>     post-deploy hook), or include it in the entrypoint script.
>   - Post-deploy verification: (1) `curl https://your-app.onrender.com/
>     api/health` returns 200 {"status":"ok"}; (2) register a user with
>     `curl -X POST .../api/auth/register -d '{...}'`; (3) create a note
>     with the returned token; (4) create a share and access it
>     anonymously; (5) revoke the share and verify 404.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Functionality (20 pts) — All P0 endpoints work end-to-end with correct status codes (200/201/204/400/401/403/404/422); auth flows (register/login/logout) work; shares can be created, accessed, and revoked; search returns relevant results.
>   2. Security (20 pts) — Passwords hashed with Argon2id; Sanctum tokens required on all protected routes; CSRF on Blade forms; rate limiting on auth endpoints; ownership checks on every note/share mutation; no SQL injection (Eloquent parameter binding); problem+json errors with no stack traces in production.
>   3. Code quality (20 pts) — Service/Controller/Resource separation; typed properties and return types everywhere; PHPStan level 6 passes with Larastan; PSR-12 code style; no N+1 queries (eager loading); FormRequests for validation; routes grouped and named.
>   4. Testing (20 pts) — ≥80% line coverage on app/; feature tests for all endpoints (happy path + validation + auth + ownership + shares); unit tests for services with Mockery; tests run in <60s; CI matrix on PHP 8.2 and 8.3 is green on main.
>   5. Deployment (20 pts) — Multi-stage Dockerfile builds reproducibly; docker-compose.yml works locally with one command; CI/CD pipeline runs on push and deploys on tag; app reachable on Render (or Fly.io) with /api/health returning 200; migrations run automatically post-deploy.
> 
> Stretch goals:
>   - Add a minimal Blade UI at /notes for browsing and editing notes, with CSRF protection, auth middleware, and Tailwind CSS for styling.
>   - Implement two-factor authentication via Laravel Fortify (TOTP with Google Authenticator support).
>   - Add a public sharing dashboard at /shared/{token} with rendered markdown, syntax highlighting (Prism.js), and a "copy to clipboard" button.
>   - Add an audit log: every note/share mutation appends to an `audit_logs` table, exposed at GET /api/audit (auth required, paginated, last 50 entries).
>   - Add webhooks: POST to a user-configured URL when a note is created, updated, or shared — with HMAC signature verification.
>   - Add a Prometheus /metrics endpoint exposing request count, latency histogram, cache hit rate, and active share count.
>   - Add a `php artisan notes:export {format}` command exporting all of a user's notes as JSON or a single Markdown file.
>   - Add FULLTEXT search via MySQL FULLTEXT indexes (better than LIKE for >10k notes) with relevance ranking.
>   - Add per-note encryption at rest via Laravel's `Encryptable` trait (encrypts body and rendered_html with APP_KEY).
>   - Add a Vue or React SPA frontend that consumes the REST API (separate repo, deployed to Vercel/Netlify).
>   - Add a "public profile" page showing a user's published notes at /u/{username} (with a `published` flag on notes).
>   - Add an MCP-style CLI client (`php artisan notes:cli`) that talks to the API via Sanctum tokens for terminal-based note management.

> **Tip:** Stretch goals:
> • Add a minimal Blade UI at /notes for browsing and editing notes, with CSRF protection, auth middleware, and Tailwind CSS for styling.
> • Implement two-factor authentication via Laravel Fortify (TOTP with Google Authenticator support).
> • Add a public sharing dashboard at /shared/{token} with rendered markdown, syntax highlighting (Prism.js), and a "copy to clipboard" button.
> • Add an audit log: every note/share mutation appends to an `audit_logs` table, exposed at GET /api/audit (auth required, paginated, last 50 entries).
> • Add webhooks: POST to a user-configured URL when a note is created, updated, or shared — with HMAC signature verification.
> • Add a Prometheus /metrics endpoint exposing request count, latency histogram, cache hit rate, and active share count.
> • Add a `php artisan notes:export {format}` command exporting all of a user's notes as JSON or a single Markdown file.
> • Add FULLTEXT search via MySQL FULLTEXT indexes (better than LIKE for >10k notes) with relevance ranking.
> • Add per-note encryption at rest via Laravel's `Encryptable` trait (encrypts body and rendered_html with APP_KEY).
> • Add a Vue or React SPA frontend that consumes the REST API (separate repo, deployed to Vercel/Netlify).
> • Add a "public profile" page showing a user's published notes at /u/{username} (with a `published` flag on notes).
> • Add an MCP-style CLI client (`php artisan notes:cli`) that talks to the API via Sanctum tokens for terminal-based note management.

