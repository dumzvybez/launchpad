---
slug: csharp-capstone-project
id: csharp-capstone
track: csharp
order: 21
title: "Capstone Project: Small engineering teams (5-50 people) need a lightweight..."
description: |-
  Small engineering teams (5-50 people) need a lightweight, real-time
    Kanban board to track work items across columns (Todo, In Progress,
    Review, Done) without the licensing overhead of Jira or the weight of
    a full project-management suite. Existing tools are either too heavy
    (Jira), too simpl
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# Capstone Project: Small engineering teams (5-50 people) need a lightweight...

## Small engineering teams (5-50 people) need a lightweight...

Problem statement:
Small engineering teams (5-50 people) need a lightweight, real-time
  Kanban board to track work items across columns (Todo, In Progress,
  Review, Done) without the licensing overhead of Jira or the weight of
  a full project-management suite. Existing tools are either too heavy
  (Jira), too simple (Trello, no API-first design), or non-real-time
  (GitHub Projects). This capstone builds KanbanFlow, a multi-tenant,
  API-first Kanban service where every board mutation is broadcast to
  connected clients in real time via SignalR, persisted to Postgres via
  EF Core, and backed by a Channel<T>-based notification pipeline. The
  project exercises every major theme of the track: async/await,
  concurrency, collections, channels, Minimal APIs, DI, middleware,
  EF Core, source-generated JSON, xUnit + Testcontainers tests, and
  containerized deployment.

Target users:
• Engineering team leads who want a no-frills board with a clean REST
• API for automation and dashboards.
• Individual contributors who want live updates in their browser
• without manual refreshes.
• Platform engineers who want to embed Kanban state into other tools
• (Slack bots, CI dashboards) via a documented OpenAPI surface.
• Open-source maintainers who need per-repo boards with webhook
• integration for issue/PR status sync.

P0 (Must have) requirements:
• Multi-tenant data model: every board belongs to an organization;
• users belong to organizations; row-level isolation enforced in
• the data and service layers.
• REST API for boards, columns, cards: create/read/update/delete
• with optimistic concurrency via row versions (ETag/If-Match).
• Real-time updates: every card mutation broadcasts a SignalR event
• to all connected clients in the board's group.
• Authentication: JWT bearer tokens issued by /auth/login; passwords
• hashed with BCrypt; tokens validated via ASP.NET Core JWT middleware.
• Authorization: role-based (Owner/Member/Viewer) per organization;
• only Members+ can move cards; only Owners can delete boards.
• Persistence: EF Core + Postgres with a Flyway-style migration
• pipeline (EF Core migrations); indexed by (org_id, board_id).
• Validation: FluentValidation on all input DTOs; 400 ProblemDetails
• on failure with field-level errors.
• Structured logging: Serilog with JSON output to stdout; correlation
• ID per request via a middleware.
• OpenAPI spec at /openapi.json with Swagger UI at /swagger.
• Health checks at /health (DB ping) and /health/ready (all deps).

P1 (Should have) requirements:
• Card assignment, due dates, labels, and priority.
• Pagination and filtering on GET /cards (cursor-based, not OFFSET).
• Rate limiting via ASP.NET Core's rate limiter (token bucket per
• user, 100 req/min).
• Background worker that archives Done cards older than 30 days via
• a Channel<T> + IHostedService.
• Webhook integration: POST to registered URLs on card state changes
• with HMAC signatures and retry via Channels.
• Metrics endpoint (/metrics) in Prometheus format via prometheus-net.

P2 (Nice to have) requirements:
• gRPC streaming API as an alternative to SignalR for non-browser
• clients.
• Source-generated JSON serializers for hot paths (KanbanContext).
• Native AOT-published worker service for the archiver (sub-50ms
• cold start).
• Full-text search on card titles/descriptions via Postgres
• tsvector + GIN index.
• Audit log of every mutation streamed to an append-only events
• table for time-travel debugging.

```text
KanbanFlow/
  src/
    KanbanFlow.Api/
      Program.cs
      Endpoints/
        AuthEndpoints.cs
        BoardEndpoints.cs
        CardEndpoints.cs
        HealthEndpoints.cs
      Middleware/
        CorrelationIdMiddleware.cs
        ExceptionHandlingMiddleware.cs
      Hubs/
        BoardHub.cs
      appsettings.json
      appsettings.Production.json
      KanbanFlow.Api.csproj
    KanbanFlow.Core/
      Domain/
        Organization.cs
        User.cs
        Board.cs
        Column.cs
        Card.cs
        AuditEvent.cs
      Enums/
        CardStatus.cs
        UserRole.cs
      KanbanFlow.Core.csproj
    KanbanFlow.Application/
      Abstractions/
        IBoardRepository.cs
        ICardRepository.cs
        ICurrentUserService.cs
      Services/
        BoardService.cs
        CardService.cs
        AuthorizationService.cs
      Notifications/
        BoardNotifier.cs
        NotificationChannel.cs
        CardArchiverHostedService.cs
      Validators/
        BoardCreateValidator.cs
        CardUpdateValidator.cs
      KanbanFlow.Application.csproj
    KanbanFlow.Infrastructure/
      Persistence/
        KanbanDbContext.cs
        Configurations/
          BoardConfiguration.cs
          CardConfiguration.cs
        Migrations/
          20240101000000_Init.cs
          20240102000000_AddAudit.cs
      Repositories/
        BoardRepository.cs
        CardRepository.cs
      Auth/
        JwtTokenService.cs
        PasswordHasher.cs
      KanbanFlow.Infrastructure.csproj
  tests/
    KanbanFlow.UnitTests/
      Application/
        CardServiceTests.cs
        AuthorizationServiceTests.cs
      Validators/
        CardUpdateValidatorTests.cs
    KanbanFlow.IntegrationTests/
      BoardEndpointsTests.cs
      CardEndpointsTests.cs
      AuthFlowTests.cs
      RealtimeHubTests.cs
      KanbanFlow.IntegrationTests.csproj
  Directory.Build.props
  Directory.Packages.props
  docker-compose.yml
  Dockerfile
  KanbanFlow.sln
  .github/workflows/ci.yml
  README.md
```
Caption: Suggested file structure

Tech stack:
• C# 12 / .NET 8 LTS (ASP.NET Core Minimal APIs, SignalR).
• EF Core 8 with Npgsql provider, code-first migrations.
• PostgreSQL 16 (in docker-compose for dev; Neon or RDS for prod).
• BCrypt.Net-Next for password hashing; System.IdentityModel.Tokens.Jwt for JWT.
• FluentValidation + FluentValidation.AspNetCore for input validation.
• Serilog.AspNetCore with serilog-sinks-console (JSON) for structured logs.
• prometheus-net.AspNetCore for /metrics in Prometheus format.
• Swashbuckle.AspNetCore for OpenAPI + Swagger UI.
• xUnit + FluentAssertions + Moq for unit tests.
• Testcontainers.PostgreSql for integration tests with a real DB.
• Microsoft.AspNetCore.Mvc.Testing (WebApplicationFactory<Program>) for API tests.
• Docker multi-stage build; docker-compose for local dev (api + db).
• GitHub Actions for CI (build, test, coverage, image push to GHCR).
• BenchmarkDotNet for hot-path benchmarks (optional, stretch).
• Optional: source-generated System.Text.Json context for AOT-friendly serialization.

> **Tip:** Testing strategy:
> - Unit tests (xUnit + Moq + FluentAssertions) for every Application
>     service method, covering happy path, authorization denial, validation
>     failure, and optimistic concurrency conflict. Example: assert that
>     `CardService.MoveAsync` throws `ConcurrencyException` when the repo's
>     `SaveChangesAsync` raises `DbUpdateConcurrencyException`.
>   - Integration tests with `WebApplicationFactory<Program>` overriding
>     `IBoardRepository` with a real EF Core + Testcontainers Postgres
>     instance; one container per test class via `IClassFixture`.
>   - Real-time tests using `Microsoft.AspNetCore.SignalR.Client` `HubConnection`
>     to subscribe to `BoardHub`, perform a REST mutation, and assert the
>     client received the broadcast event within 2 seconds.
>   - Coverage target: ≥80% line coverage on KanbanFlow.Application and
>     KanbanFlow.Infrastructure; ≥60% on KanbanFlow.Api (endpoints thin).
>   - Run with `dotnet test --logger "console;verbosity=normal"
>     --collect:"XPlat Code Coverage"`; generate an HTML report with
>     `dotnet reportgenerator -reports:**/coverage.cobertura.xml
>     -targetdir:coverage`.

> **Tip:** Deployment guide:
> - Deploy target: Fly.io or Azure Container Apps (both support Linux
>     containers and autoscaling); use a managed Postgres (Neon, RDS, or
>     Azure Database for PostgreSQL Flexible Server).
>   - Environment variables needed: `ConnectionStrings__Postgres`,
>     `Jwt__Secret`, `Jwt__ExpiryMinutes`, `Cors__AllowedOrigins`,
>     `Serilog__MinimumLevel` (override ASP.NET Core's hierarchical config).
>   - Build command (CI): `dotnet publish src/KanbanFlow.Api -c Release
>     -o /app /p:UseAppHost=false` inside the SDK Docker stage.
>   - Start command (runtime image): `dotnet KanbanFlow.Api.dll` (or the
>     framework-dependent apphost if single-file).
>   - Run EF migrations on startup: `builder.Services.AddHostedService<
>     MigrationHostedService>()` that calls `db.Database.MigrateAsync()` —
>     or run `dotnet ef database update` as an init container before the
>     app starts.
>   - Post-deploy verification: `curl https://api.kanbanflow.example/health`
>     → 200 with `{"status":"Healthy"}`; `curl /swagger` renders the UI;
>     run the `register → login → create board → create card` smoke flow
>     via the Swagger UI or a `curl` script; confirm a SignalR client
>     receives the broadcast within 2 seconds of a mutation.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Architecture & separation of concerns (20 pts) — Clean Core/Application/
>      Infrastructure/Api layering; Core has no infra dependencies; services
>      depend on abstractions, not EF Core directly.
>   2. Correctness & concurrency (20 pts) — Optimistic concurrency works
>      (If-Match returns 409 on stale writes); multi-tenant isolation is
>      enforced in queries (no cross-org leaks); SignalR broadcasts match
>      mutations exactly.
>   3. API design & validation (20 pts) — RESTful routes, proper status
>      codes (201/204/400/401/403/404/409), ProblemDetails for all errors,
>      FluentValidation covers every input, OpenAPI spec is accurate and
>      versioned.
>   4. Test quality (20 pts) — ≥80% coverage on Application/Infrastructure;
>      integration tests via WebApplicationFactory + Testcontainers; real-
>      time flow tested via SignalR client; tests are deterministic and
>      isolated (fresh container per class).
>   5. Production readiness (20 pts) — Structured JSON logging with
>      correlation IDs; /health and /health/ready endpoints; /metrics in
>      Prometheus format; rate limiting enabled; CI builds, tests, and
>      deploys on every push; README documents setup and run.
> 
> Stretch goals:
>   - Replace reflective JSON serialization with a source-generated
>     `JsonSerializerContext` for the hot path; benchmark the startup
>     improvement with BenchmarkDotNet.
>   - Publish the archiver hosted service as a Native AOT binary
>     (`<PublishAot>true</PublishAot>`); resolve all trim warnings by
>     annotation or source generation; target sub-50ms cold start.
>   - Add a gRPC streaming API (`KanbanFlow.Grpc`) as an alternative to
>     SignalR for non-browser clients; generate the proto and server stubs.
>   - Implement full-text search on card titles/descriptions using Postgres
>     `tsvector` + GIN index exposed via EF Core `ForNpgsqlHasMethod` calls
>     and a `GET /cards?q=` query endpoint.
>   - Add an append-only `AuditEvents` table; every service method writes
>     a serialized event; build a `/boards/{id}/history` endpoint that
>     replays the event log for time-travel debugging.
>   - Add a Slack integration hosted service that consumes the notification
>     channel and posts to a webhook on card state changes (with HMAC
>     signatures and exponential-backoff retries via channels).
>   - Implement cursor-based pagination on `GET /cards` (keyset, not OFFSET)
>     with `?after=cardId&limit=50`; expose a `nextCursor` field.
>   - Add OpenTelemetry tracing (otlp exporter) wired through the entire
>     stack (HTTP → service → EF Core → Postgres); visualize in Jaeger.

> **Tip:** Stretch goals:
> • Replace reflective JSON serialization with a source-generated
> • `JsonSerializerContext` for the hot path; benchmark the startup
> • improvement with BenchmarkDotNet.
> • Publish the archiver hosted service as a Native AOT binary
> • (`<PublishAot>true</PublishAot>`); resolve all trim warnings by
> • annotation or source generation; target sub-50ms cold start.
> • Add a gRPC streaming API (`KanbanFlow.Grpc`) as an alternative to
> • SignalR for non-browser clients; generate the proto and server stubs.
> • Implement full-text search on card titles/descriptions using Postgres
> • `tsvector` + GIN index exposed via EF Core `ForNpgsqlHasMethod` calls
> • and a `GET /cards?q=` query endpoint.
> • Add an append-only `AuditEvents` table; every service method writes
> • a serialized event; build a `/boards/{id}/history` endpoint that
> • replays the event log for time-travel debugging.
> • Add a Slack integration hosted service that consumes the notification
> • channel and posts to a webhook on card state changes (with HMAC
> • signatures and exponential-backoff retries via channels).
> • Implement cursor-based pagination on `GET /cards` (keyset, not OFFSET)
> • with `?after=cardId&limit=50`; expose a `nextCursor` field.
> • Add OpenTelemetry tracing (otlp exporter) wired through the entire
> • stack (HTTP → service → EF Core → Postgres); visualize in Jaeger.

