---
slug: flask-production-patterns-capstone-prep
id: flask-20
track: flask
order: 20
title: Production Patterns and Capstone Prep
description: "Tie the track together: app vs request context, the g object, thread-safe singletons, connection pooling, health checks and metrics, and a checklist to launch the capstone."
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=Z1RJmh_OqeA
whyItMatters: "Tie the track together: app vs request context, the g object, thread-safe singletons, connection pooling, health checks and metrics, and a checklist to launch the capstone."
deepDiveResources:
  - label: W3Schools Flask
    url: https://www.tutorialspoint.com/flask/
    kind: course
  - label: Flask Official Docs
    url: https://flask.palletsprojects.com/
    kind: doc
---

# Production Patterns and Capstone Prep

## Production Patterns and Capstone Prep

### Why It Matters

Tie the track together: app vs request context, the g object, thread-safe singletons, connection pooling, health checks and metrics, and a checklist to launch the capstone.

Tie the track together: app vs request context, the g object, thread-safe singletons, connection pooling, health checks and metrics, and a checklist to launch the capstone.

### Prerequisites

- Stage 19: Deployment — Gunicorn, uWSGI, Nginx, Docker
- All prior stages (especially Stage 8 factory pattern and Stage 10 SQLAlchemy).

### Topics

- Application context vs request context (and when each is pushed)
- The g object: per-request scratch space
- current_app, current_app.config, and avoiding global app references
- Thread-safe singletons: db.session, current_user, request
- SQLAlchemy connection pooling: pool_size, max_overflow, pool_pre_ping
- Health checks: /health (liveness) vs /ready (readiness)
- Metrics: prometheus-flask-exporter, request latency histograms
- Capstone prep: feature list, file layout, deploy target

### Key Concepts

- App context (current_app, g) is pushed per-request automatically; you push it manually with app.app_context() for scripts/CLI commands/management tasks.
- g is per-request scratch space — stash a DB connection, the loaded tenant, a request id; cleared at request teardown. Never use module-level globals for per-request state.
- SQLAlchemy's pool defaults to pool_size=5, max_overflow=10 (15 conns per worker); with 4 Gunicorn workers that's up to 60 connections — check your DB's max_connections.
- pool_pre_ping=True issues a SELECT 1 before checkout to detect stale connections dropped by the DB (common with RDS idle timeouts); cheap insurance against 'server has gone away'.
- Separate /health (liveness: process is up) from /ready (readiness: DB + Redis are reachable); orchestrators use /ready to decide whether to route traffic.

```python
from flask import Flask, current_app, g, request

app = Flask(__name__)

@app.before_request
def before():
    # Both contexts are pushed here:
    g.request_id = request.headers.get("X-Request-ID", "-")
    current_app.logger.info("start %s", request.path)

# Outside a request (CLI, scripts, tests):
with app.app_context():
    # current_app works; request and session do NOT:
    print(current_app.config["DEBUG"])
    # g exists but is empty:
    g.something = "x"

with app.test_request_context("/x"):
    # Both app AND request contexts are pushed:
    print(request.path)  # '/x'
```
Caption: App vs request context

### Common Pitfalls

- Using module-level globals for per-request state — Gunicorn workers are forked; a module-level dict looks shared but each worker has its own copy. Use g (per-request) or Redis (cross-worker).
- Pushing a request context when only app context is needed — current_app and g live in the app context; pushing a request context for CLI tasks adds nothing and can mask bugs. Use app.app_context() for non-request work.
- Forgetting pool_pre_ping with cloud DBs — AWS RDS idle connections are silently dropped after a few minutes; the next request gets 'server has gone away'. pool_pre_ping=True adds a cheap SELECT 1 to detect this.
- Running out of DB connections with too many workers x pool_size — 4 workers x (pool_size 10 + max_overflow 5) = 60 connections; check your DB's max_connections. Lower pool_size for many small services or use PgBouncer.
- Combining liveness and readiness into one /health endpoint — Orchestrators restart pods that fail liveness and stop routing to pods that fail readiness; mixing them means a DB blip causes a restart loop. Keep them separate.

### Real-World Applications

- Patreon's Flask services expose /health and /ready plus Prometheus metrics scraped by their internal monitoring; PgBouncer pools Postgres connections across many Flask workers.
- Lyft's admin Flask apps use g for per-request tenant context (resolved in before_request) and Redis for cross-worker rate limits and feature flags.
- Netflix's security-automation Flask tools run prometheus-flask-exporter and ship metrics to their internal TSDB; alerts fire on p99 latency > 500ms.
- Twilio's Flask webhook receivers separate /health (process up) from /ready (downstream services reachable) so a Redis blip doesn't cause a pod restart loop.

### Interview Questions

- 1. What's the difference between app context and request context? — App context (current_app, g) is for app-level concerns; request context (request, session) wraps a single HTTP request. App context is pushed per request automatically and manually for CLI/scripts.
- 2. What's the g object for? — Per-request scratch space; stash the loaded tenant, a request id, a cached DB lookup. Cleared at request teardown. Never use module-level globals for per-request state.
- 3. Why use pool_pre_ping? — Cloud DBs (RDS, Cloud SQL) silently drop idle connections; pool_pre_ping issues SELECT 1 before checkout to detect dead connections, avoiding 'server has gone away' errors.
- 4. Why separate /health and /ready? — Liveness (/health) is 'is the process up'; readiness (/ready) is 'can I serve traffic'. Orchestrators restart failed liveness and stop routing to failed readiness; mixing causes restart loops on downstream blips.
- 5. How do you share state across Gunicorn workers? — Module-level globals are per-worker (forked); use Redis (or another shared store) for cross-worker state like rate-limit counters and feature flags.

### Mini Project

Build a Production-Ready Health App: A Flask app with /health and
/ready endpoints, Prometheus metrics, g-based request id, and a
tuned SQLAlchemy pool. Suggested approach:
  - Add /health (200 ok) and /ready (DB+Redis ping, 503 on failure)
  - Wire PrometheusMetrics(app) and curl /metrics
  - Stash g.request_id in before_request; log it everywhere
  - Set SQLALCHEMY_ENGINE_OPTIONS with pool_pre_ping=True
  - Verify 4 Gunicorn workers don't exceed DB max_connections

### Exercises

1. Push app.app_context() in a script and access current_app.config.
2. Add a before_request hook that sets g.request_id and logs it.
3. Configure SQLALCHEMY_ENGINE_OPTIONS with pool_pre_ping=True.
4. Implement /health (200) and /ready (DB+Redis ping) separately.
5. Add prometheus-flask-exporter and scrape /metrics.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which context holds current_app and g?
9. A) Request context
10. B) Session context
11. C) No context (they're globals)
12. D) Application context (*)
13. Explanation: App context holds current_app and g; request context (a child of app context) holds request and session. Both are pushed automatically per request.
14. Q2: What's the g object for?
15. A) Per-request scratch space (tenant, request id, cached lookup) (*)
16. B) Storing app-level config
17. C) Logging
18. D) Database queries
19. Explanation: g is per-request scratch space, cleared at teardown. Use it for the loaded tenant, request id, or a cached DB lookup — never for cross-request state.
20. Q3: Why is pool_pre_ping=True useful with cloud DBs?
21. A) It speeds up queries
22. B) Cloud DBs silently drop idle connections; SELECT 1 before checkout detects dead ones (*)
23. C) It encrypts the connection
24. D) It limits connections
25. Explanation: RDS/Cloud SQL drop idle connections after a few minutes; pool_pre_ping issues a cheap SELECT 1 to detect dead connections before handing them out, avoiding 'server has gone away'.
26. Q4: Why separate /health and /ready?
27. A) They're the same
28. B) For SEO
29. C) Orchestrators use liveness for restart and readiness for routing; mixing causes restart loops (*)
30. D) For caching
31. Explanation: /health (liveness: process up) -> restart if failed; /ready (readiness: can serve) -> stop routing if failed. Mixing means a DB blip restarts the pod in a loop.
32. Q5: How do you share state across Gunicorn workers?
33. A) Module-level globals (forked per worker, not shared)
34. B) You can't; design around it
35. C) Use a file on disk
36. D) Use Redis or another shared store (*)
37. Explanation: Workers are forked, so module-level dicts are per-worker copies. Use Redis (or another shared store) for cross-worker state like rate-limit counters and feature flags.
38. Q6: Which SQLAlchemy engine option recycles connections periodically?
39. A) pool_recycle (*)
40. B) pool_size
41. C) max_overflow
42. D) pool_timeout
43. Explanation: pool_recycle=1800 recycles connections every 30 minutes; useful to prevent long-lived connections from hitting DB-side idle limits or accumulating server-side state.
44. Q7: Which library exposes /metrics for Prometheus?
45. A) flask-talisman
46. B) prometheus-flask-exporter (*)
47. C) flask-limiter
48. D) Flask-WTF
49. Explanation: prometheus-flask-exporter auto-instruments request count, latency histogram, and status code distribution; scrape /metrics with Prometheus.
50. Q8: When do you push app.app_context() manually?
51. A) Inside every view
52. B) Never; Flask pushes it automatically
53. C) Outside a request (CLI, scripts, tests) when you need current_app or DB access (*)
54. D) Only in production
55. Explanation: Per-request the app context is pushed automatically; for CLI commands, scripts, and direct DB access in tests, push app.app_context() manually.
56. Q9: How many DB connections can 4 Gunicorn workers with pool_size=10 + max_overflow=5 open?
57. A) 4
58. B) 15
59. C) 100
60. D) 60 (*)
61. Explanation: 4 workers x (10 + 5) = 60 max connections. Verify your DB's max_connections (Postgres default 100) and consider PgBouncer for many small services.
62. Q10: Which status code should /ready return when the DB is unreachable?
63. A) 503 (Service Unavailable) (*)
64. B) 200
65. C) 404
66. D) 500
67. Explanation: 503 tells the orchestrator/load-balancer to stop routing traffic to this pod; liveness (/health) still returns 200 so the pod isn't restarted, just un-routed until the DB recovers.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: Which context holds current_app and g?
  options:
    - Request context
    - Session context
    - No context (they're globals)
    - Application context
  correctIndex: 3
  explanation: App context holds current_app and g; request context (a child of app context) holds request and session. Both are pushed automatically per request.
- id: q2
  question: What's the g object for?
  options:
    - Per-request scratch space (tenant, request id, cached lookup)
    - Storing app-level config
    - Logging
    - Database queries
  correctIndex: 0
  explanation: g is per-request scratch space, cleared at teardown. Use it for the loaded tenant, request id, or a cached DB lookup — never for cross-request state.
- id: q3
  question: Why is pool_pre_ping=True useful with cloud DBs?
  options:
    - It speeds up queries
    - Cloud DBs silently drop idle connections; SELECT 1 before checkout detects dead ones
    - It encrypts the connection
    - It limits connections
  correctIndex: 1
  explanation: RDS/Cloud SQL drop idle connections after a few minutes; pool_pre_ping issues a cheap SELECT 1 to detect dead connections before handing them out, avoiding 'server has gone away'.
- id: q4
  question: Why separate /health and /ready?
  options:
    - They're the same
    - For SEO
    - Orchestrators use liveness for restart and readiness for routing; mixing causes restart loops
    - For caching
  correctIndex: 2
  explanation: "/health (liveness: process up) -> restart if failed; /ready (readiness: can serve) -> stop routing if failed. Mixing means a DB blip restarts the pod in a loop."
- id: q5
  question: How do you share state across Gunicorn workers?
  options:
    - Module-level globals (forked per worker, not shared)
    - You can't; design around it
    - Use a file on disk
    - Use Redis or another shared store
  correctIndex: 3
  explanation: Workers are forked, so module-level dicts are per-worker copies. Use Redis (or another shared store) for cross-worker state like rate-limit counters and feature flags.
- id: q6
  question: Which SQLAlchemy engine option recycles connections periodically?
  options:
    - pool_recycle
    - pool_size
    - max_overflow
    - pool_timeout
  correctIndex: 0
  explanation: pool_recycle=1800 recycles connections every 30 minutes; useful to prevent long-lived connections from hitting DB-side idle limits or accumulating server-side state.
- id: q7
  question: Which library exposes /metrics for Prometheus?
  options:
    - flask-talisman
    - prometheus-flask-exporter
    - flask-limiter
    - Flask-WTF
  correctIndex: 1
  explanation: prometheus-flask-exporter auto-instruments request count, latency histogram, and status code distribution; scrape /metrics with Prometheus.
- id: q8
  question: When do you push app.app_context() manually?
  options:
    - Inside every view
    - Never; Flask pushes it automatically
    - Outside a request (CLI, scripts, tests) when you need current_app or DB access
    - Only in production
  correctIndex: 2
  explanation: Per-request the app context is pushed automatically; for CLI commands, scripts, and direct DB access in tests, push app.app_context() manually.
- id: q9
  question: How many DB connections can 4 Gunicorn workers with pool_size=10 + max_overflow=5 open?
  options:
    - "4"
    - "15"
    - "100"
    - "60"
  correctIndex: 3
  explanation: 4 workers x (10 + 5) = 60 max connections. Verify your DB's max_connections (Postgres default 100) and consider PgBouncer for many small services.
- id: q10
  question: Which status code should /ready return when the DB is unreachable?
  options:
    - 503 (Service Unavailable)
    - "200"
    - "404"
    - "500"
  correctIndex: 0
  explanation: 503 tells the orchestrator/load-balancer to stop routing traffic to this pod; liveness (/health) still returns 200 so the pod isn't restarted, just un-routed until the DB recovers.
```

