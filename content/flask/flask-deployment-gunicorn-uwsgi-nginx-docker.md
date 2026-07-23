---
slug: flask-deployment-gunicorn-uwsgi-nginx-docker
id: flask-19
track: flask
order: 19
title: Deployment — Gunicorn, uWSGI, Nginx, Docker
description: Deploy Flask to production with Gunicorn (workers, threads, max-requests), put Nginx in front for TLS and static, ship multi-stage Docker images, and configure env vars safely.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=MwZwr5Tvyxo&t=960s
whyItMatters: Deploy Flask to production with Gunicorn (workers, threads, max-requests), put Nginx in front for TLS and static, ship multi-stage Docker images, and configure env vars safely.
deepDiveResources:
  - label: W3Schools Flask
    url: https://www.tutorialspoint.com/flask/
    kind: course
  - label: Flask Official Docs
    url: https://flask.palletsprojects.com/
    kind: doc
---

# Deployment — Gunicorn, uWSGI, Nginx, Docker

## Deployment — Gunicorn, uWSGI, Nginx, Docker

### Why It Matters

Deploy Flask to production with Gunicorn (workers, threads, max-requests), put Nginx in front for TLS and static, ship multi-stage Docker images, and configure env vars safely.

Deploy Flask to production with Gunicorn (workers, threads, max-requests), put Nginx in front for TLS and static, ship multi-stage Docker images, and configure env vars safely.

### Prerequisites

- Stage 18: Security — CSRF, XSS, Clickjacking, Security Headers
- Stage 8 (factory pattern, wsgi.py entry point).

### Topics

- Gunicorn: -w workers, --threads, --max-requests, --preload
- Worker classes: sync (default), gevent, uvicorn (async views)
- Nginx reverse proxy: TLS, static, X-Forwarded-* headers
- ProxyFix middleware for correct request.scheme and remote_addr
- Multi-stage Dockerfile (builder + runtime, slim base)
- Health checks and graceful shutdown (SIGTERM)
- Environment variables and secrets at runtime (not baked in)
- Render / Fly.io / AWS ECS deployment patterns

### Key Concepts

- Gunicorn's prefork model: a master process spawns N worker processes, each handling one request at a time; tune workers to (2 x CPU) + 1.
- Sync workers block on I/O; gevent/eventlet workers monkeypatch sockets to handle thousands of concurrent connections (good for streaming + many slow clients).
- Always run behind Nginx (or a cloud LB) so Gunicorn never sees the internet directly; Nginx terminates TLS, serves static, sets X-Forwarded-For/Proto.
- ProxyFix(app, x_for=1, x_proto=1, x_host=1) makes request.scheme and request.remote_addr trust the proxy headers — essential for HTTPS detection behind Nginx.
- Bake code into the Docker image but inject secrets (SECRET_KEY, DATABASE_URL) at runtime via env vars; never COPY .env into the image.

```bash
# gunicorn.conf.py (optional, or pass flags)
bind = "0.0.0.0:8000"
workers = 4            # (2 * CPU) + 1
threads = 2            # per-worker threads (for I/O bound)
max_requests = 1000    # recycle workers to leak-proof
max_requests_jitter = 100
timeout = 30
graceful_timeout = 10
preload_app = True     # load code once in master (saves RAM)

# Start (factory app via wsgi.py):
gunicorn -c gunicorn.conf.py wsgi:application
# Or inline:
gunicorn -w 4 --threads 2 --max-requests 1000 -b 0.0.0.0:8000 wsgi:application
```
Caption: Gunicorn config + invocation

### Common Pitfalls

- Running `flask run` or app.run() in production — Both use Werkzeug's dev server; use Gunicorn (or uWSGI). Gunicorn gives workers, threads, max-requests recycling, and graceful shutdown.
- Forgetting ProxyFix behind Nginx — request.scheme reports 'http' and request.remote_addr is Nginx's IP; SESSION_COOKIE_SECURE breaks and access logs lose the client IP. Always wrap with ProxyFix.
- Baking secrets into the Docker image — Anyone with the image can `docker history`/`docker inspect` to extract them; inject at runtime via env vars from a secrets manager (Vault, AWS SM).
- Setting workers=1 in production — One worker means zero concurrency; one slow request blocks everyone. Use (2 x CPU) + 1 and consider --threads 2 for I/O-bound workloads.
- Forgetting --max-requests to leak-proof workers — Long-running workers leak memory (C extensions, matplotlib, careless globals); --max-requests 1000 recycles workers periodically to cap leaks.

### Real-World Applications

- Patreon's Flask services run on Gunicorn (sync workers) behind an Envoy mesh sidecar that handles TLS and routing; the sidecar replaces Nginx in modern deploys.
- Lyft's admin Flask apps run on Gunicorn (4 workers, 2 threads) inside Docker on Kubernetes, with an AWS NLB in front and Envoy for service-to-service mTLS.
- Netflix's Spinnaker-style Flask tools run on Gunicorn in AWS ECS Fargate behind an ALB; secrets are injected via AWS Secrets Manager at task start.
- Twilio's Flask webhook receivers run on Gunicorn with gevent workers to handle thousands of concurrent slow webhook client connections per pod.

### Interview Questions

- 1. Why not use app.run() in production? — It's Werkzeug's dev server: single-threaded, no security headers, debug=True is an RCE vector. Use Gunicorn or uWSGI.
- 2. How do you tune Gunicorn worker count? — Sync workers: (2 x CPU) + 1; CPU-bound workloads use fewer; I/O-bound with --threads or gevent workers use more. Benchmark, don't guess.
- 3. What does ProxyFix do? — It rewrites request.scheme, request.remote_addr, and request.host based on X-Forwarded-* headers from a trusted proxy, so HTTPS detection and access logs work behind Nginx.
- 4. Why bake code but inject secrets in Docker? — Code is the same across environments; secrets differ. Baked secrets leak via docker history; inject at runtime via env vars from a secrets manager.
- 5. What does --max-requests do? — Recycles each worker after N requests, capping memory leaks from C extensions or careless globals; pair with --max-requests-jitter to avoid all workers recycling at once.

### Mini Project

Deploy a Dockerized Flask App: Containerize the Blog with a multi-stage
Dockerfile, run Gunicorn with 4 workers, put Nginx in front for TLS,
and inject SECRET_KEY + DATABASE_URL at runtime. Suggested approach:
  - Write wsgi.py with ProxyFix(application, x_for=1, x_proto=1)
  - Multi-stage Dockerfile (builder + python:3.12-slim runtime)
  - Gunicorn CMD with -w 4 --max-requests 1000 -b 0.0.0.0:8000 wsgi:application
  - Nginx config with TLS + proxy_pass to gunicorn upstream
  - Verify curl -k https://localhost/ returns 200 and /static/ is served by Nginx

### Exercises

1. Write wsgi.py exposing application = create_app('prod') wrapped in ProxyFix.
2. Build a multi-stage Dockerfile and verify `docker build` succeeds.
3. Run Gunicorn with -w 4 --max-requests 1000 and curl /health.
4. Configure Nginx with TLS and proxy_pass to gunicorn; verify X-Forwarded-Proto.
5. Inject SECRET_KEY and DATABASE_URL via env vars; confirm the app boots.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which command runs a Flask factory app in production?
9. A) flask run --prod
10. B) python app.py
11. C) gunicorn -w 4 -b 0.0.0.0:8000 wsgi:application (*)
12. D) app.run(production=True)
13. Explanation: Gunicorn (or uWSGI) is the production WSGI server; wsgi.py exposes application = create_app('prod'). Never use flask run / app.run in prod.
14. Q2: What's a common starting value for Gunicorn workers?
15. A) 1
16. B) 1000
17. C) CPU * 10
18. D) (2 * CPU) + 1 (*)
19. Explanation: Sync workers: (2 x CPU) + 1 is the standard starting point; benchmark and tune. For I/O-bound work add --threads or use gevent workers.
20. Q3: What does ProxyFix do?
21. A) Rewrites request.scheme/remote_addr from X-Forwarded-* headers (*)
22. B) Adds CORS headers
23. C) Encrypts traffic
24. D) Compresses responses
25. Explanation: ProxyFix makes Flask trust X-Forwarded-For/Proto/Host from a configured number of proxy hops so HTTPS detection and access logs work behind Nginx.
26. Q4: Why bake code but inject secrets into Docker?
27. A) Code is smaller
28. B) Baked secrets leak via docker history; inject at runtime via env vars (*)
29. C) Docker forbids secrets
30. D) It's faster
31. Explanation: Code is identical across environments; secrets differ. Bake the code, inject secrets at runtime via env vars from a secrets manager (Vault, AWS SM).
32. Q5: What does --max-requests 1000 do?
33. A) Limits total requests served by the app
34. B) Rejects the 1001st request
35. C) Recycles each worker after 1000 requests, capping memory leaks (*)
36. D) Sets a per-request timeout
37. Explanation: Workers recycle after N requests to cap memory leaks; add --max-requests-jitter to spread recycles so all workers don't restart at once.
38. Q6: Which Gunicorn worker class is best for thousands of slow concurrent connections?
39. A) sync (default)
40. B) eventlet (deprecated)
41. C) uvicorn
42. D) gevent (*)
43. Explanation: gevent monkeypatches sockets to handle thousands of concurrent connections per worker; ideal for streaming or many slow clients (e.g., webhook receivers).
44. Q7: Why serve /static via Nginx instead of Gunicorn?
45. A) Nginx is faster at file I/O and frees Gunicorn workers for dynamic requests (*)
46. B) Gunicorn can't serve files
47. C) Nginx is required by Flask
48. D) It's cheaper
49. Explanation: Nginx serves static files far more efficiently than Python; offloading static to Nginx frees Gunicorn workers for dynamic requests and reduces latency.
50. Q8: What does the HEALTHCHECK Docker directive do?
51. A) Encrypts traffic
52. B) Tells Docker how to check if the container is healthy (curl /health) (*)
53. C) Sets resource limits
54. D) Configures TLS
55. Explanation: HEALTHCHECK runs a command periodically; if it fails, Docker marks the container unhealthy and orchestrators (ECS, K8s) can restart or stop routing to it.
56. Q9: Which Python base image is recommended for small production containers?
57. A) python:3.12
58. B) ubuntu:latest
59. C) python:3.12-slim (*)
60. D) python:3.12-alpine (caution: musl libc issues with some wheels)
61. Explanation: python:3.12-slim is small (~50MB) and glibc-compatible; alpine is smaller but uses musl which breaks many binary wheels. Slim is the safer default.
62. Q10: What env var pattern does Nginx use to pass client IP to Gunicorn?
63. A) X-Client-IP
64. B) REMOTE_ADDR
65. C) Client-IP
66. D) X-Forwarded-For (*)
67. Explanation: proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; ProxyFix on the Flask side reads it (x_for=1 trusts one proxy hop).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which command runs a Flask factory app in production?
  options:
    - flask run --prod
    - python app.py
    - gunicorn -w 4 -b 0.0.0.0:8000 wsgi:application
    - app.run(production=True)
    - is the production WSGI server; wsgi.py exposes application = create_app('prod'). Never use flask run / app.run in prod.
  correctIndex: 2
  explanation: Gunicorn (or uWSGI) is the production WSGI server; wsgi.py exposes application = create_app('prod'). Never use flask run / app.run in prod.
- id: q2
  question: What's a common starting value for Gunicorn workers?
  options:
    - "1"
    - "1000"
    - CPU * 10
    - (2 * CPU) + 1
    - + 1 is the standard starting point; benchmark and tune. For I/O-bound work add --threads or use gevent workers.
  correctIndex: 3
  explanation: "Sync workers: (2 x CPU) + 1 is the standard starting point; benchmark and tune. For I/O-bound work add --threads or use gevent workers."
- id: q3
  question: What does ProxyFix do?
  options:
    - Rewrites request.scheme/remote_addr from X-Forwarded-* headers
    - Adds CORS headers
    - Encrypts traffic
    - Compresses responses
  correctIndex: 0
  explanation: ProxyFix makes Flask trust X-Forwarded-For/Proto/Host from a configured number of proxy hops so HTTPS detection and access logs work behind Nginx.
- id: q4
  question: Why bake code but inject secrets into Docker?
  options:
    - Code is smaller
    - Baked secrets leak via docker history; inject at runtime via env vars
    - Docker forbids secrets
    - It's faster
    - .
  correctIndex: 1
  explanation: Code is identical across environments; secrets differ. Bake the code, inject secrets at runtime via env vars from a secrets manager (Vault, AWS SM).
- id: q5
  question: What does --max-requests 1000 do?
  options:
    - Limits total requests served by the app
    - Rejects the 1001st request
    - Recycles each worker after 1000 requests, capping memory leaks
    - Sets a per-request timeout
  correctIndex: 2
  explanation: Workers recycle after N requests to cap memory leaks; add --max-requests-jitter to spread recycles so all workers don't restart at once.
- id: q6
  question: Which Gunicorn worker class is best for thousands of slow concurrent connections?
  options:
    - sync (default)
    - eventlet (deprecated)
    - uvicorn
    - gevent
  correctIndex: 3
  explanation: gevent monkeypatches sockets to handle thousands of concurrent connections per worker; ideal for streaming or many slow clients (e.g., webhook receivers).
- id: q7
  question: Why serve /static via Nginx instead of Gunicorn?
  options:
    - Nginx is faster at file I/O and frees Gunicorn workers for dynamic requests
    - Gunicorn can't serve files
    - Nginx is required by Flask
    - It's cheaper
  correctIndex: 0
  explanation: Nginx serves static files far more efficiently than Python; offloading static to Nginx frees Gunicorn workers for dynamic requests and reduces latency.
- id: q8
  question: What does the HEALTHCHECK Docker directive do?
  options:
    - Encrypts traffic
    - Tells Docker how to check if the container is healthy (curl /health)
    - Sets resource limits
    - Configures TLS
  correctIndex: 1
  explanation: HEALTHCHECK runs a command periodically; if it fails, Docker marks the container unhealthy and orchestrators (ECS, K8s) can restart or stop routing to it.
- id: q9
  question: Which Python base image is recommended for small production containers?
  options:
    - python:3.12
    - ubuntu:latest
    - python:3.12-slim
    - "python:3.12-alpine (caution: musl libc issues with some wheels)"
    - and glibc-compatible; alpine is smaller but uses musl which breaks many binary wheels. Slim is the safer default.
  correctIndex: 2
  explanation: python:3.12-slim is small (~50MB) and glibc-compatible; alpine is smaller but uses musl which breaks many binary wheels. Slim is the safer default.
- id: q10
  question: What env var pattern does Nginx use to pass client IP to Gunicorn?
  options:
    - X-Client-IP
    - REMOTE_ADDR
    - Client-IP
    - X-Forwarded-For
  correctIndex: 3
  explanation: proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; ProxyFix on the Flask side reads it (x_for=1 trusts one proxy hop).
```

