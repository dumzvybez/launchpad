---
slug: fastapi-deployment-uvicorn-gunicorn-docker-capstone-prep
id: fastapi-20
track: fastapi
order: 20
title: Deployment — Uvicorn, Gunicorn, Docker, Capstone Prep
description: Ship a FastAPI service to production — Uvicorn tuning, Gunicorn with `UvicornWorker`, Docker multi-stage builds, env-driven config, health checks, graceful shutdown, and capstone kickoff.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=5700s
whyItMatters: Ship a FastAPI service to production — Uvicorn tuning, Gunicorn with `UvicornWorker`, Docker multi-stage builds, env-driven config, health checks, graceful shutdown, and capstone kickoff.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Deployment — Uvicorn, Gunicorn, Docker, Capstone Prep

## Deployment — Uvicorn, Gunicorn, Docker, Capstone Prep

### Why It Matters

Ship a FastAPI service to production — Uvicorn tuning, Gunicorn with `UvicornWorker`, Docker multi-stage builds, env-driven config, health checks, graceful shutdown, and capstone kickoff.

Ship a FastAPI service to production — Uvicorn tuning, Gunicorn with `UvicornWorker`, Docker multi-stage builds, env-driven config, health checks, graceful shutdown, and capstone kickoff.

### Prerequisites

- Stage 11: Middleware, CORS, and Custom Middleware
- Stage 17: Project Structure — Routers, Services, Repositories
- Stage 19: Performance — async DB drivers, connection pooling, profiling
- Familiarity with Docker basics.

### Topics

- Uvicorn flags: `--workers`, `--host`, `--port`, `--proxy-headers`, `--forwarded-allow-ips`
- Gunicorn with `uvicorn.workers.UvicornWorker` for process management
- Docker multi-stage builds (builder + slim runtime)
- `pydantic-settings` for env-driven config; never hard-code secrets
- Health checks (`/health`, `/ready`) for Kubernetes/Load Balancer probes
- Graceful shutdown: `lifespan` events, `SIGTERM`, draining in-flight requests
- CI: lint (ruff), type-check (mypy/pyright), test (pytest), build, deploy
- Capstone prep: review the project-guide structure and pick a scope

### Key Concepts

- Uvicorn is the ASGI server; Gunicorn with `UvicornWorker` is the production process manager (graceful reload, signal handling).
- `--proxy-headers` and `--forwarded-allow-ips` make Uvicorn trust `X-Forwarded-*` from your load balancer.
- Multi-stage Docker builds keep the image small (slim runtime without build tools).
- Health endpoints must be fast (<10ms) and not depend on downstream services; `/ready` can check the DB.
- Use `lifespan` (not `@app.on_event`) for startup/shutdown — the modern API.

```bash
gunicorn main:app \
  -k uvicorn.workers.UvicornWorker \
  -w 4 \
  --bind 0.0.0.0:8000 \
  --proxy-protocol \
  --forwarded-allow-ips="*" \
  --max-requests 1000 \
  --max-requests-jitter 100 \
  --graceful-timeout 30 \
  --timeout 30
```
Caption: Production Gunicorn command

### Common Pitfalls

- Running `uvicorn --reload` in production — adds file-watcher overhead and can restart on unrelated file changes; never enable in prod.
- Forgetting `--proxy-headers` behind a load balancer — `request.client.host` shows the LB IP, not the user; clients see `http://` instead of `https://` in redirects.
- Health check that depends on the DB — `/health` should be dep-free; use a separate `/ready` for DB checks so a DB blip doesn't deregister you.
- Building a single-stage Docker image with build tools — image bloats to 1GB+; use multi-stage to ship only runtime deps.
- Using `@app.on_event("startup")` — deprecated in favor of `lifespan`; migrate to the context-manager style.

### Real-World Applications

- Netflix deploys FastAPI-style services in Docker containers behind Zuul/Eureka; the patterns here (health, proxy headers, graceful shutdown) all apply.
- Uber's microservices run in Docker with health/readiness probes; FastAPI services use the same `/health` vs `/ready` split.
- Microsoft's Azure Container Apps templates ship FastAPI + Gunicorn + UvicornWorker Dockerfiles; multi-stage builds are the default.
- OpenAI's inference endpoints run behind Kubernetes with liveness/readiness probes; FastAPI's `lifespan` handles model warmup and shutdown.

### Interview Questions

- 1. Why use Gunicorn with `UvicornWorker` instead of Uvicorn alone? — Gunicorn provides process management, graceful reload, and signal handling; UvicornWorker brings the ASGI loop.
- 2. What do `--proxy-headers` and `--forwarded-allow-ips` do? — Trust `X-Forwarded-*` from the LB so `request.client.host` and redirect schemes reflect the user, not the LB.
- 3. Why split `/health` and `/ready`? — `/health` (liveness) is dep-free (always 200 if the process is up); `/ready` (readiness) checks DB/Redis so a blip doesn't kill the pod but does stop traffic.
- 4. What's the modern startup/shutdown API? — `lifespan` via `@asynccontextmanager`; `@app.on_event` is deprecated.
- 5. Why use a multi-stage Docker build? — The builder stage has compilers/uv; the runtime stage copies only the venv, keeping the image small and secure.

### Mini Project

Build a "Production-Ready Skeleton": A small FastAPI service with `lifespan` (Redis connect/disconnect), `/health` (dep-free) and `/ready` (DB ping), `pydantic-settings` config, and a multi-stage Dockerfile. Add a Makefile with `make run` (uvicorn dev) and `make prod` (gunicorn). Suggested approach:
  - Create `app/core/config.py` with `Settings(BaseSettings)`
  - Add `lifespan` that opens/closes Redis and the DB engine
  - Add `/health` returning `{"status":"ok"}` and `/ready` pinging the DB
  - Write a two-stage Dockerfile (builder + slim runtime)
  - Add `Makefile` targets and a `.dockerignore`

### Exercises

1. Run Gunicorn with `UvicornWorker` and `-w 4`; verify four worker processes via `ps`.
2. Add `lifespan` that prints "startup" and "shutdown"; verify both messages on `docker stop`.
3. Configure `/health` (no deps) and `/ready` (DB ping); verify `/ready` 503s when the DB is down.
4. Write a multi-stage Dockerfile; verify the final image is <300MB with `docker images`.
5. >>> QUIZ (Stage 20) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Why use Gunicorn with UvicornWorker in production?
8. A) Uvicorn doesn't support ASGI
9. B) Gunicorn is faster per request
10. C) Uvicorn is deprecated
11. D) Gunicorn provides process management, graceful reload, and signal handling (*)
12. Explanation: Gunicorn manages worker processes (restart, scale, graceful reload); `UvicornWorker` brings the ASGI event loop inside each worker.
13. Q2: What do `--proxy-headers` and `--forwarded-allow-ips` do?
14. A) Trust X-Forwarded-* from the LB so request.client.host and redirect schemes reflect the user (*)
15. B) Encrypt traffic
16. C) Add CORS headers
17. D) Disable HTTPS
18. Explanation: Behind a TLS-terminating LB, Uvicorn needs to trust forwarded headers to know the real client IP and scheme.
19. Q3: Why split `/health` and `/ready`?
20. A) For aesthetics
21. B) /health (liveness) is dep-free; /ready (readiness) checks DB/Redis so a blip stops traffic without killing the pod (*)
22. C) To reduce route count
23. D) Because OpenAPI requires it
24. Explanation: Liveness probes should never fail on downstream blips; readiness probes can — this avoids restart loops during DB maintenance.
25. Q4: Which is the modern startup/shutdown API?
26. A) `@app.on_event("startup")`
27. B) `__init__` of FastAPI
28. C) `lifespan` via `@asynccontextmanager` (*)
29. D) `app.startup_handler = ...`
30. Explanation: `lifespan` is the modern context-manager API; `@app.on_event` is deprecated and will be removed.
31. Q5: Why use a multi-stage Docker build?
32. A) To speed up Python
33. B) To enable hot reload
34. C) To use fewer CPUs
35. D) To ship only runtime deps, keeping the image small and secure (*)
36. Explanation: The builder stage has compilers/uv; the runtime stage copies only the venv, dropping build tools and shrinking the attack surface.
37. Q6: Which flag must be enabled for Uvicorn to trust X-Forwarded-* headers?
38. A) `--proxy-headers` (plus `--forwarded-allow-ips`) (*)
39. B) `--reload`
40. C) `--workers`
41. D) `--log-level`
42. Explanation: `--proxy-headers` enables reading `X-Forwarded-Proto`/`X-Forwarded-For`; `--forwarded-allow-ips` restricts which upstreams are trusted.
43. Q7: Why never run `uvicorn --reload` in production?
44. A) It's slower per request
45. B) It adds file-watcher overhead and may restart on unrelated file changes (*)
46. C) It requires root
47. D) It disables CORS
48. Explanation: `--reload` is a dev convenience; in prod it adds CPU overhead and can cause surprise restarts.
49. Q8: What does `HEALTHCHECK` in a Dockerfile do?
50. A) Restarts the container on health failure
51. B) Adds HTTPS
52. C) Docker polls the command and marks the container unhealthy on non-zero exit (*)
53. D) Compresses responses
54. Explanation: `HEALTHCHECK` runs the given command periodically; non-zero exit marks the container unhealthy (orchestrators can then restart it).
55. Q9: Which is a recommended graceful-shutdown setting?
56. A) `--timeout 0`
57. B) `--workers 0`
58. C) `--reload`
59. D) `--graceful-timeout 30 --timeout 30` (drain in-flight requests before killing) (*)
60. Explanation: `--graceful-timeout` gives workers time to finish in-flight requests; `--timeout` caps per-request time so slow ones don't block shutdown.
61. Q10: Where should secrets come from in production?
62. A) Environment variables (via pydantic-settings) (*)
63. B) Hard-coded in `settings.py`
64. C) The Dockerfile
65. D) The git repo
66. Explanation: Never bake secrets into images or source; load from env vars (or a secret manager) via `pydantic-settings.BaseSettings`.
67. ----------------------------------------------------------------------
68. ======================================================================

```quiz
- id: q1
  question: Why use Gunicorn with UvicornWorker in production?
  options:
    - Uvicorn doesn't support ASGI
    - Gunicorn is faster per request
    - Uvicorn is deprecated
    - Gunicorn provides process management, graceful reload, and signal handling
  correctIndex: 3
  explanation: Gunicorn manages worker processes (restart, scale, graceful reload); `UvicornWorker` brings the ASGI event loop inside each worker.
- id: q2
  question: What do `--proxy-headers` and `--forwarded-allow-ips` do?
  options:
    - Trust X-Forwarded-* from the LB so request.client.host and redirect schemes reflect the user
    - Encrypt traffic
    - Add CORS headers
    - Disable HTTPS
  correctIndex: 0
  explanation: Behind a TLS-terminating LB, Uvicorn needs to trust forwarded headers to know the real client IP and scheme.
- id: q3
  question: Why split `/health` and `/ready`?
  options:
    - For aesthetics
    - /health (liveness) is dep-free; /ready (readiness) checks DB/Redis so a blip stops traffic without killing the pod
    - To reduce route count
    - Because OpenAPI requires it
  correctIndex: 1
  explanation: Liveness probes should never fail on downstream blips; readiness probes can — this avoids restart loops during DB maintenance.
- id: q4
  question: Which is the modern startup/shutdown API?
  options:
    - '`@app.on_event("startup")`'
    - "`__init__` of FastAPI"
    - "`lifespan` via `@asynccontextmanager`"
    - "`app.startup_handler = ...`"
  correctIndex: 2
  explanation: "`lifespan` is the modern context-manager API; `@app.on_event` is deprecated and will be removed."
- id: q5
  question: Why use a multi-stage Docker build?
  options:
    - To speed up Python
    - To enable hot reload
    - To use fewer CPUs
    - To ship only runtime deps, keeping the image small and secure
  correctIndex: 3
  explanation: The builder stage has compilers/uv; the runtime stage copies only the venv, dropping build tools and shrinking the attack surface.
- id: q6
  question: Which flag must be enabled for Uvicorn to trust X-Forwarded-* headers?
  options:
    - "`--proxy-headers` (plus `--forwarded-allow-ips`)"
    - "`--reload`"
    - "`--workers`"
    - "`--log-level`"
  correctIndex: 0
  explanation: "`--proxy-headers` enables reading `X-Forwarded-Proto`/`X-Forwarded-For`; `--forwarded-allow-ips` restricts which upstreams are trusted."
- id: q7
  question: Why never run `uvicorn --reload` in production?
  options:
    - It's slower per request
    - It adds file-watcher overhead and may restart on unrelated file changes
    - It requires root
    - It disables CORS
  correctIndex: 1
  explanation: "`--reload` is a dev convenience; in prod it adds CPU overhead and can cause surprise restarts."
- id: q8
  question: What does `HEALTHCHECK` in a Dockerfile do?
  options:
    - Restarts the container on health failure
    - Adds HTTPS
    - Docker polls the command and marks the container unhealthy on non-zero exit
    - Compresses responses
  correctIndex: 2
  explanation: "`HEALTHCHECK` runs the given command periodically; non-zero exit marks the container unhealthy (orchestrators can then restart it)."
- id: q9
  question: Which is a recommended graceful-shutdown setting?
  options:
    - "`--timeout 0`"
    - "`--workers 0`"
    - "`--reload`"
    - "`--graceful-timeout 30 --timeout 30` (drain in-flight requests before killing)"
  correctIndex: 3
  explanation: "`--graceful-timeout` gives workers time to finish in-flight requests; `--timeout` caps per-request time so slow ones don't block shutdown."
- id: q10
  question: Where should secrets come from in production?
  options:
    - Environment variables (via pydantic-settings)
    - Hard-coded in `settings.py`
    - The Dockerfile
    - The git repo
  correctIndex: 0
  explanation: Never bake secrets into images or source; load from env vars (or a secret manager) via `pydantic-settings.BaseSettings`.
```

