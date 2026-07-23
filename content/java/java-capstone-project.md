---
slug: java-capstone-project
id: java-capstone
track: java
order: 21
title: 'Capstone Project: Build a production-grade Task Management REST API ("TaskFlow")...'
description: |-
  Build a production-grade Task Management REST API ("TaskFlow") that supports
    users, projects, tasks, tags, due dates, and audit history. The service must
    persist data in PostgreSQL, expose a documented REST API with validation and
    error handling, support JWT-based authentication, run backgroun
difficulty: advanced
estMinutes: 600
contentVersion: 1.0.0
whyItMatters: This capstone project integrates every concept from the track into a single production-grade deliverable.
deepDiveResources:
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# Capstone Project: Build a production-grade Task Management REST API ("TaskFlow")...

## Build a production-grade Task Management REST API ("TaskFlow")...

Problem statement:
Build a production-grade Task Management REST API ("TaskFlow") that supports
  users, projects, tasks, tags, due dates, and audit history. The service must
  persist data in PostgreSQL, expose a documented REST API with validation and
  error handling, support JWT-based authentication, run background reminders
  for upcoming due dates via a scheduled job, and ship with comprehensive
  tests (unit, slice, and integration). This capstone exercises every prior
  stage: OOP design, generics, streams, JDBC/JPA, concurrency (schedulers),
  java.time (due dates), exception handling, I/O (config), testing, build
  tooling, JVM tuning, and Spring Boot.

Target users:
• Individual developers tracking personal todos and side projects.
• Small engineering teams coordinating sprint tasks across projects.
• API consumers (mobile/web clients) integrating task data into their UI.
• Operators running the service in production, who need health checks,
• metrics, and structured logs.

P0 (Must have) requirements:
• User registration and login with bcrypt-hashed passwords.
• JWT issuance and validation on protected endpoints.
• CRUD for projects, tasks, and tags (POST/GET/PUT/DELETE).
• Task fields: title, description, due date, priority, status, assignee,
• tags, created/updated timestamps.
• Bean Validation on every request DTO with @ControllerAdvice mapping
• violations to 400 responses.
• PostgreSQL persistence via Spring Data JPA and HikariCP.
• Migration scripts via Flyway (versioned SQL in src/main/resources/db/migration).
• JUnit 5 unit tests for services, @WebMvcTest for controllers,
• @DataJpaTest for repositories.
• JaCoCo coverage gate at 80% line coverage on core modules.
• Spring Boot Actuator health endpoint exposed.
• Structured JSON logging via Logback + logstash-logback-encoder.
• Dockerfile and docker-compose.yml for local Postgres + app.

P1 (Should have) requirements:
• Pagination and sorting on list endpoints.
• Filtering by status, priority, assignee, and due-date range.
• Scheduled @Scheduled job that scans for tasks due within 24h and
• writes reminder records to a reminders table.
• Audit log capturing who changed what on tasks (entity listener).
• Rate limiting via Bucket4j on login to prevent brute force.
• OpenAPI 3 spec auto-generated via springdoc-openapi.

P2 (Nice to have) requirements:
• WebSocket push of task changes to subscribed clients.
• Full-text search on task title and description (PostgreSQL tsvector).
• CSV export endpoint using StringBuilder/stream pipelines.
• Prometheus metrics via micrometer-registry-prometheus.
• Virtual-threads mode (`spring.threads.virtual.enabled=true`) and a
• load-test report comparing platform vs virtual threads.
• GraalVM native-image build via Spring Boot AOT for sub-50ms startup.

Tech stack:
• Java 21 (LTS) — virtual threads, pattern matching, records.
• Spring Boot 3.2+ (Web, Validation, Data JPA, Security, Actuator).
• PostgreSQL 16 + Flyway for migrations.
• HikariCP connection pool (Spring Boot default).
• JWT via spring-boot-starter-oauth2-resource-server or jjwt.
• BCrypt for password hashing.
• Lombok or pure records for DTOs (records preferred).
• Jackson for JSON serialization.
• MapStruct for entity/DTO mapping (optional, reduces boilerplate).
• springdoc-openapi for OpenAPI 3 docs.
• Logback + logstash-logback-encoder for structured JSON logs.
• JUnit 5 + Mockito + AssertJ for tests.
• JaCoCo for coverage.
• Testcontainers for integration tests with a real Postgres.
• Docker + docker-compose for local dev; optional GraalVM native-image.

> **Tip:** Testing strategy:
> - Unit tests for services with Mockito: each service method has at least
>     one happy-path and one error-path test (e.g., `create_throws_whenProjectMissing`).
>   - @WebMvcTest slice tests for every controller: assert status codes, JSON
>     paths, and that the service is called with the right arguments via
>     `verify`.
>   - @DataJpaTest slice tests for custom repository queries: use H2 for
>     speed or Testcontainers Postgres for fidelity.
>   - Integration test with `@SpringBootTest` + Testcontainers: full stack
>     including auth, exercising register -> login -> create -> list -> delete.
>   - Coverage target: ≥80% line coverage on service and web packages,
>     enforced by the JaCoCo Maven plugin's `check` goal in `mvn verify`.
>   - Run with `./mvnw verify`; reports at `target/site/jacoco/index.html`.
>   - Load test the `/api/tasks` GET endpoint with `wrk` or `k6`; capture
>     p99 latency and confirm it's under 100ms at 1000 RPS.

> **Tip:** Deployment guide:
> - Local dev: `docker compose up -d` starts Postgres; `./mvnw spring-boot:run`
>     starts the app on :8080.
>   - Container deploy: build the image with `docker build -t taskflow:1.0.0 .`
>     and push to a registry (Docker Hub, ECR, GCR).
>   - Cloud deploy: Fly.io, Render.com, AWS ECS Fargate, or Google Cloud Run.
>     For Cloud Run: `gcloud run deploy taskflow --image ... --memory 1G --cpu 1`.
>   - Environment variables: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`,
>     `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`, `SPRING_PROFILES_ACTIVE=prod`.
>   - Build command: `./mvnw -B clean package -DskipTests` (or run tests in CI).
>   - Start command: `java -XX:+UseZGC -XX:MaxRAMPercentage=75 -jar app.jar`.
>   - Post-deploy verification: curl `/actuator/health` (expect 200
>     `"status":"UP"`), curl `/swagger-ui.html` for docs, run smoke tests
>     against `/auth/register` and `/api/tasks`.
> 
> Evaluation rubric (5 criteria, 20 points each = 100):
>   1. Architecture & Design (20 pts) — Clear separation of web/service/repository
>      layers; entities, DTOs, and exceptions are well-named and immutable where
>      possible; dependencies are constructor-injected and final.
>   2. Functional Correctness (20 pts) — All P0 endpoints work end-to-end
>      (register, login, CRUD on tasks/projects/tags) with correct status codes
>      and JSON shapes; validation and auth are enforced.
>   3. Testing & Quality (20 pts) — Unit, slice, and integration tests pass;
>      JaCoCo ≥80% on core modules; tests are fast (<10s for unit/slice), use
>      AssertJ fluently, and cover happy and error paths.
>   4. Concurrency & Time Handling (20 pts) — Reminder scheduler is testable
>      via Clock injection; @Transactional boundaries are correct; no shared
>      mutable state in services; due-date filtering uses java.time correctly
>      (ZonedDateTime/Instant for storage, ZoneId for display).
>   5. Production-Readiness (20 pts) — Dockerfile multi-stage, health/metrics
>      endpoints exposed, structured JSON logs, OpenAPI docs, migration
>      scripts versioned in Flyway, README with run instructions.
> 
> Stretch goals:
>   - Add WebSocket push notifications for task changes (Spring WebSocket + STOMP).
>   - Implement full-text search with PostgreSQL `tsvector` columns and triggers.
>   - Add a CSV export endpoint streaming rows with `Stream<Task>` and a
>     `BodyBuilder` that writes a StringBuilder-backed CSV directly to the response.
>   - Build a GraalVM native image via Spring Boot AOT; measure startup time
>     and memory footprint vs the JVM build.
>   - Enable virtual threads (`spring.threads.virtual.enabled=true`) and produce
>     a load-test report comparing p99 latency under 5000 RPS vs platform threads.
>   - Implement optimistic locking on Task (using `@Version`) and a retry
>     decorator for `OptimisticLockingFailureException`.
>   - Add a `/api/tasks/{id}/audit` endpoint returning the full audit history
>     for a task, paginated and sorted by timestamp descending.
>   - Multi-tenant support: scope every entity by `tenantId`, enforce via a
>     Hibernate filter, and validate tenant isolation with integration tests.

> **Tip:** Stretch goals:
> • Add WebSocket push notifications for task changes (Spring WebSocket + STOMP).
> • Implement full-text search with PostgreSQL `tsvector` columns and triggers.
> • Add a CSV export endpoint streaming rows with `Stream<Task>` and a
> • `BodyBuilder` that writes a StringBuilder-backed CSV directly to the response.
> • Build a GraalVM native image via Spring Boot AOT; measure startup time
> • and memory footprint vs the JVM build.
> • Enable virtual threads (`spring.threads.virtual.enabled=true`) and produce
> • a load-test report comparing p99 latency under 5000 RPS vs platform threads.
> • Implement optimistic locking on Task (using `@Version`) and a retry
> • decorator for `OptimisticLockingFailureException`.
> • Add a `/api/tasks/{id}/audit` endpoint returning the full audit history
> • for a task, paginated and sorted by timestamp descending.
> • Multi-tenant support: scope every entity by `tenantId`, enforce via a
> • Hibernate filter, and validate tenant isolation with integration tests.

