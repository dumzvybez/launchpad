---
slug: kotlin-capstone-project
id: kotlin-capstone
track: kotlin
order: 21
title: "Capstone Project: Build a production-grade Task Management API + Android..."
description: |-
  Build a production-grade Task Management API + Android client ("KanbanKt")
    that supports users, boards, columns, cards, and card moves across columns.
    The backend is a Ktor service exposing a documented REST API with JWT auth,
    PostgreSQL persistence via Exposed (or Ktorm), kotlinx.serializatio
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Capstone Project: Build a production-grade Task Management API + Android...

## Build a production-grade Task Management API + Android...

Problem statement:
Build a production-grade Task Management API + Android client ("KanbanKt")
  that supports users, boards, columns, cards, and card moves across columns.
  The backend is a Ktor service exposing a documented REST API with JWT auth,
  PostgreSQL persistence via Exposed (or Ktorm), kotlinx.serialization for
  JSON, and coroutine-native request handling. The Android client is a single-
  screen Jetpack Compose app that loads boards, displays columns and cards,
  and lets the user drag a card between columns. The system must ship with
  comprehensive tests (unit + integration + Turbine for Flows), structured
  logging, Docker packaging, and a CI-friendly build. This capstone exercises
  every prior stage: data classes, sealed-class UI state, generics, extension
  functions, scope functions, coroutines, Flows (StateFlow for UI), JSON
  serialization, Ktor (server + client), testing, and Android basics.

Target users:
• Individual developers tracking personal boards (todo / doing / done).
• Small engineering teams coordinating sprint cards across projects.
• Mobile users who want a fast, offline-capable board on their phone.
• Operators who need health checks, metrics, and structured logs.

P0 (Must have) requirements:
• User registration and login with bcrypt-hashed passwords.
• JWT issuance and validation on protected endpoints.
• CRUD for boards, columns, and cards (POST/GET/PUT/DELETE).
• Card fields: id, title, description, columnId, position, created/updated.
• Move card endpoint that re-orders cards in the source and destination columns.
• Ktor routes with ContentNegotiation (kotlinx.serialization) and StatusPages.
• PostgreSQL persistence via Exposed (with HikariCP) and Flyway-style migrations.
• kotlinx.serialization for all DTOs (@Serializable, @SerialName).
• Coroutines: every DB call wrapped in `withContext(Dispatchers.IO)`.
• JUnit 5 unit tests for services; MockK for repos; Kotest for spec tests.
• Turbine tests for any Flow exposed by the service layer.
• Android single-screen client in Jetpack Compose showing columns + cards.
• ViewModel exposing StateFlow<UiState> (Loading/Success/Error sealed class).
• Ktor HttpClient in the Android client with the same DTOs (shared module).
• Dockerfile (multi-stage) and docker-compose.yml for Postgres + Ktor.

P1 (Should have) requirements:
• Pagination and sorting on card-list endpoints.
• Server-Sent Events endpoint pushing card moves to subscribed clients (Flow).
• Audit log capturing who moved which card (with timestamps).
• Rate limiting on login (Bucket4j or a simple token-bucket coroutine).
• OpenAPI 3 spec auto-generated via ktor-openapi-tools or hand-written.
• Offline-first Android client with a local Room cache syncing via Flow.

P2 (Nice to have) requirements:
• WebSocket push of card moves to subscribed clients.
• Full-text search on card title and description (PostgreSQL tsvector).
• CSV export endpoint using sequence + kotlinx.serialization.
• Kotlin Multiplatform shared module (board logic) between server and Android.
• Native image via GraalVM for the Ktor service (sub-50ms startup).
• Compose Desktop client reusing the shared module and HttpClient.

Tech stack:
• Kotlin 1.9+ (JVM target 17).
• Ktor 2.3+ server (Netty engine) with plugins: ContentNegotiation, StatusPages,
• Routing, CallLogging, Auth (JWT), CORS.
• Ktor 2.3+ client (OkHttp or CIO engine) for the Android client.
• kotlinx.serialization 1.6+ for all DTOs.
• Exposed ORM (or Ktorm) with HikariCP connection pool.
• PostgreSQL 16 (dev via docker-compose, tests via Testcontainers).
• BCrypt (codex bcrypt library) for password hashing.
• JWT via Ktor's auth-jwt plugin (HS256).
• Jetpack Compose (BOM 2024+) for Android UI.
• ViewModel + StateFlow for Android state.
• collectAsStateWithLifecycle for lifecycle-aware UI updates.
• JUnit 5 + kotlin.test for unit tests.
• MockK for mocking (handles final classes and suspend functions).
• Kotest for BehaviorSpec-style and property tests.
• Turbine for Flow assertions.
• Testcontainers for integration tests with a real Postgres.
• ktor-server-test-host for HTTP slice tests.
• Logback + logstash-logback-encoder for structured JSON logs.
• Docker (multi-stage build) + docker-compose.
• Optional: Kotlin Multiplatform shared module for DTOs.

> **Tip:** Testing strategy:
> - Unit tests for services (MockK + runTest): each service method has a
>     happy-path and at least one error-path test (e.g., `moveCard_returnsNotFound
>     when cardMissing`); target ≥80% line coverage on services.
>   - HTTP slice tests with `testApplication` for every route: assert status
>     codes, JSON bodies, and that the service was called with the right args
>     via `coVerify`.
>   - Integration tests with `@Testcontainers` + Postgres container: full stack
>     (register -> login -> create board -> add column -> add card -> move card).
>   - Turbine tests for Flow<CardEvent>: assert emissions in order,
>     `awaitItem()` and `awaitComplete()`.
>   - Android: unit-test the ViewModel with `runTest` and Turbine (no emulator
>     needed); add a single instrumented test for the Compose UI with
>     `createAndroidComposeRule`.
>   - Coverage gate: JaCoCo at 80% on `service` and `web` packages, enforced
>     by `./gradlew check`.
>   - Run with `./gradlew test` (unit + slice) and `./gradlew integrationTest`
>     (Testcontainers); reports at `build/reports/jacoco/`.

> **Tip:** Deployment guide:
> - Local dev: `docker compose up -d` starts Postgres; `./gradlew
>     :backend:run` starts Ktor on :8080 with auto-reload.
>   - Container deploy: `docker build -t kanbankt-backend:1.0.0 .` and push
>     to a registry.
>   - Cloud deploy: Fly.io (`fly deploy`), Render.com (web service + Postgres),
>     AWS ECS Fargate, or Google Cloud Run.
>   - Environment variables: `DATABASE_URL`, `DATABASE_USER`,
>     `DATABASE_PASSWORD`, `JWT_SECRET`, `JWT_AUDIENCE`, `JWT_ISSUER`,
>     `PORT=8080`, `LOG_LEVEL=INFO`.
>   - Build command: `./gradlew :backend:installDist` (produces a fat dist
>     at `backend/build/install/kanban/bin/kanban`).
>   - Start command: `./kanban` (the installDist launcher) or
>     `java -jar backend/build/libs/kanban-all.jar`.
>   - Post-deploy verification: `curl https://api.example.com/health` (expect
>     200 `{"status":"UP"}`); smoke-test `/register` -> `/login` -> `/boards`;
>     check structured logs in your log aggregator.
>   - Android: build APK with `./gradlew :android:assembleRelease` (signed
>     with a keystore); distribute via Play Store internal testing or
>     Firebase App Distribution.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Architecture & Design (20 pts) — Clear separation of web/service/repository
>      layers; DTOs separate from domain entities; sealed classes for UI state
>      and result types; dependencies are constructor-injected; shared module
>      where applicable.
>   2. Functional Correctness (20 pts) — All P0 endpoints work end-to-end
>      (register, login, CRUD on boards/columns/cards, move card) with correct
>      status codes and JSON shapes; auth and validation are enforced; the
>      Android client loads a board and lets the user move a card.
>   3. Coroutines & Flow Usage (20 pts) — Every DB call switches to IO;
>      services are suspend-typed; structured concurrency (no GlobalScope,
>      no runBlocking in production); StateFlow for UI state with lifecycle-
>      aware collection; Turbine-tested Flow events.
>   4. Testing & Quality (20 pts) — Unit (MockK + runTest), HTTP slice
>      (testApplication), integration (Testcontainers), and Turbine tests
>      all pass; JaCoCo ≥80% on service+web packages; tests cover happy
>      and error paths; coroutines use `runTest` (not `runBlocking`).
>   5. Production-Readiness (20 pts) — Multi-stage Dockerfile,
>      docker-compose for local dev; structured JSON logs via Logback;
>      StatusPages maps exceptions to consistent ErrorDto responses; JWT
>      auth enforced on protected routes; README with run instructions and
>      curl examples; CI builds and tests pass.
> 
> Stretch goals:
>   - Add a Server-Sent Events endpoint `/boards/{id}/events` exposing a
>     `Flow<CardEvent>` so the Android client can subscribe to live updates.
>   - Implement full-text search on card title/description using PostgreSQL
>     `tsvector` columns and a `/cards/search?q=...` endpoint.
>   - Add an offline-first Room cache in the Android client that syncs with
>     the server via a `Flow<List<Card>>` from the local DB.
>   - Make the shared module truly Kotlin Multiplatform: shared DTOs and
>     validation logic between backend, Android, and a Compose Desktop client.
>   - Build a GraalVM native image of the Ktor service; measure startup time
>     and memory footprint vs the JVM build.
>   - Add optimistic locking on Card (using a version column) and a retry
>     decorator for `OptimisticLockException`.
>   - Add drag-and-drop between columns with proper visual feedback (Compose
>     `detectDragGesturesAfterLongPress` and an overlay).
>   - Implement a per-user rate limiter using a token-bucket coroutine and
>     expose `/me/rate-limit` so the client can show remaining quota.
>   - Generate an OpenAPI 3 spec from Ktor routes (via a community plugin)
>     and ship a Swagger UI at `/docs`.
>   - Add end-to-end tests with a real Android emulator in CI (GitHub
>     Actions macos-latest with AVD) to verify the full client + server flow.

> **Tip:** Stretch goals:
> • Add a Server-Sent Events endpoint `/boards/{id}/events` exposing a
> • `Flow<CardEvent>` so the Android client can subscribe to live updates.
> • Implement full-text search on card title/description using PostgreSQL
> • `tsvector` columns and a `/cards/search?q=...` endpoint.
> • Add an offline-first Room cache in the Android client that syncs with
> • the server via a `Flow<List<Card>>` from the local DB.
> • Make the shared module truly Kotlin Multiplatform: shared DTOs and
> • validation logic between backend, Android, and a Compose Desktop client.
> • Build a GraalVM native image of the Ktor service; measure startup time
> • and memory footprint vs the JVM build.
> • Add optimistic locking on Card (using a version column) and a retry
> • decorator for `OptimisticLockException`.
> • Add drag-and-drop between columns with proper visual feedback (Compose
> • `detectDragGesturesAfterLongPress` and an overlay).
> • Implement a per-user rate limiter using a token-bucket coroutine and
> • expose `/me/rate-limit` so the client can show remaining quota.
> • Generate an OpenAPI 3 spec from Ktor routes (via a community plugin)
> • and ship a Swagger UI at `/docs`.
> • Add end-to-end tests with a real Android emulator in CI (GitHub
> • Actions macos-latest with AVD) to verify the full client + server flow.

