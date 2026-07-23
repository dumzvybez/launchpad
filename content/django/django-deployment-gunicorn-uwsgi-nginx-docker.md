---
slug: django-deployment-gunicorn-uwsgi-nginx-docker
id: django-18
track: django
order: 18
title: Deployment — Gunicorn, uWSGI, Nginx, Docker
description: Deploy Django with Gunicorn behind Nginx, containerize with Docker, run multi-service with docker-compose, and ship to Render/Fly/AWS. Cover the production checklist, env vars, health checks, and zero-downtime deploys.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=UmljXZIypDc&t=900s
whyItMatters: Deploy Django with Gunicorn behind Nginx, containerize with Docker, run multi-service with docker-compose, and ship to Render/Fly/AWS. Cover the production checklist, env vars, health checks, and zero-downtime deploys.
deepDiveResources:
  - label: W3Schools Django
    url: https://www.w3schools.com/django/
    kind: course
  - label: Django Official Docs
    url: https://docs.djangoproject.com/
    kind: doc
---

# Deployment — Gunicorn, uWSGI, Nginx, Docker

## Deployment — Gunicorn, uWSGI, Nginx, Docker

### Why It Matters

Deploy Django with Gunicorn behind Nginx, containerize with Docker, run multi-service with docker-compose, and ship to Render/Fly/AWS. Cover the production checklist, env vars, health checks, and zero-downtime deploys.

Deploy Django with Gunicorn behind Nginx, containerize with Docker, run multi-service with docker-compose, and ship to Render/Fly/AWS. Cover the production checklist, env vars, health checks, and zero-downtime deploys.

### Prerequisites

- Stage 10 (Static/Media), Stage 16 (Security)
- Comfort with Docker and basic Linux commands.

### Topics

- Gunicorn config: workers, threads, worker_class, max_requests
- uWSGI vs Gunicorn — when to choose
- Nginx reverse proxy: TLS, static files, headers
- Dockerfile for Django (multi-stage, slim base)
- docker-compose with postgres + redis + celery
- Environment variables and django-environ
- Health checks and /health endpoint
- Zero-downtime deploys (rolling, blue-green, gunicorn SIGHUP)
- Static files: collectstatic + WhiteNoise or Nginx
- Database migrations in CI/CD (run before new code starts)

### Key Concepts

- Gunicorn is a sync WSGI server; use --workers (2-4x CPU) + --threads for I/O.
- Nginx sits in front: TLS termination, static files, slow-client buffering, rate limiting.
- A 12-factor app reads config from env vars; use django-environ to load .env.
- Migrations must run before the new code serves traffic; do it in the deploy pipeline.
- Health checks (/health returning 200) let the load balancer know when a container is ready.

```dockerfile
# Dockerfile
FROM python:3.12-slim AS base
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd -m django && chown -R django:django /app
USER django

RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["gunicorn", "mysite.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "4", "--threads", "2", \
     "--max-requests", "1000", "--max-requests-jitter", "100", \
     "--access-logfile", "-", "--error-logfile", "-"]
```
Caption: Dockerfile

### Common Pitfalls

- Running migrations after deploy (or during) — the new code expects new schema; run migrations BEFORE the new code serves traffic, with a maintenance window for breaking changes.
- Forgetting collectstatic — DEBUG=False means Django won't serve static files; run collectstatic at build time (in Dockerfile) or in a release step.
- Hard-coded settings in settings.py — use env vars via django-environ; never bake DB passwords into the image.
- Gunicorn with 1 worker — under-utilizes CPU; use 2-4x CPU cores, or `uvicorn` with async workers for I/O-heavy apps.
- Serving /media/ via Django — slow and a security risk; serve via Nginx (alias) or S3 + CloudFront.

### Real-World Applications

- Instagram deployed Django on Gunicorn + uWSGI behind HAProxy (early); the multi-process model let them scale horizontally.
- Disqus uses Docker + Kubernetes with Nginx ingress; gunicorn --workers tuned per pod CPU.
- Mozilla uses Gunicorn behind Nginx on AWS for SUMO and addons-server.
- Eventbrite runs Django on Kubernetes with rolling deploys and per-pod health checks.

### Interview Questions

- 1. How do you pick the number of Gunicorn workers? — Rule of thumb: (2 × CPU cores) + 1; tune per workload (I/O-heavy: more workers/threads, CPU-heavy: fewer).
- 2. Why put Nginx in front of Gunicorn? — TLS termination, static file serving, slow-client buffering, request limits, and zero-downtime reloads.
- 3. When do you run migrations in a deploy? — AFTER taking the old version out of rotation but BEFORE the new version serves traffic. Or use a separate migration step.
- 4. What's a zero-downtime deploy? — Bring up new instances, wait for health checks to pass, drain old instances (stop accepting new requests, finish in-flight).
- 5. How do you handle static files in production? — collectstatic at build, serve via WhiteNoise (simple) or Nginx (high traffic), with far-future cache headers.

### Mini Project

Deploy a Django Site to Render: Dockerize a Django app + Postgres + Redis (use Render's managed services for DB and Redis), wire env vars, run migrations in a release command, and verify zero-downtime deploys. Suggested approach:
  - Write a multi-stage Dockerfile with python:3.12-slim
  - Add docker-compose for local dev (db + redis + web + worker)
  - On Render: web service + managed Postgres + managed Redis
  - Set release command: `python manage.py migrate --noinput && python manage.py collectstatic --noinput`
  - Add /health/ endpoint; configure Render health check

### Exercises

1. Write a multi-stage Dockerfile for a Django app; build and run locally.
2. Add docker-compose with postgres + redis; verify `docker compose up`.
3. Configure Gunicorn with 4 workers and 2 threads; benchmark with `ab`.
4. Add Nginx in front; verify TLS termination and /static/ serving.
5. Add a /health/ endpoint and configure Render/ECS health check.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is the most common WSGI server for Django in production?
9. A) runserver
10. B) Gunicorn (*)
11. C) Tornado
12. D) uWSGI only
13. Explanation: Gunicorn is the de facto standard. uWSGI is also valid but less common. runserver is dev-only.
14. Q2: Rule of thumb for Gunicorn workers?
15. A) 1
16. B) Always 10
17. C) (2 × CPU cores) + 1 (*)
18. D) Match the DB connection pool size
19. Explanation: (2 × CPU) + 1 is the Gunicorn docs' starting point. Tune per workload — I/O-bound can use more threads or async workers.
20. Q3: When should migrations run during deploy?
21. A) After the new code starts serving
22. B) Manually by an admin
23. C) Never — run them in dev only
24. D) Before the new code serves traffic (release step) (*)
25. Explanation: Migrations must complete before the new code expects the new schema. Breaking migrations need a multi-step deploy (expand, then contract).
26. Q4: Which command gathers static files for production?
27. A) python manage.py collectstatic (*)
28. B) python manage.py buildstatic
29. C) python manage.py static
30. D) gunicorn handles it
31. Explanation: collectstatic copies all static files into STATIC_ROOT. Run it at build (Dockerfile) or in the release command.
32. Q5: Why put Nginx in front of Gunicorn?
33. A) Gunicorn can't handle HTTP
34. B) TLS termination, static files, slow-client buffering, rate limiting (*)
35. C) Nginx runs Python code
36. D) It's required by Django
37. Explanation: Nginx handles TLS, serves /static/ and /media/ directly, and buffers slow clients. Gunicorn focuses on Python.
38. Q6: What does a 12-factor app read config from?
39. A) settings.json committed to git
40. B) Hard-coded constants
41. C) Environment variables (*)
42. D) The database
43. Explanation: 12-factor: config in env vars, not code. Use django-environ or os.environ["KEY"] in settings.py.
44. Q7: What's a zero-downtime deploy?
45. A) Take the site offline briefly
46. B) Restart the DB
47. C) Skip migrations
48. D) Bring up new instances, drain old (no traffic gap) (*)
49. Explanation: Rolling or blue-green: new instances pass health checks before old ones drain. gunicorn SIGHUP reloads workers in place.
50. Q8: What should /health/ return for a healthy app?
51. A) 200 OK with a small JSON body (*)
52. B) 500
53. C) A full HTML page
54. D) Redirect to /admin/
55. Explanation: Health checks should be cheap and return 200. Optionally check DB/cache connectivity. Load balancer uses this to route traffic.
56. Q9: Why should /media/ never be served by Django in prod?
57. A) Django can't read files
58. B) Slow + security risk; use Nginx, S3, or CloudFront (*)
59. C) It's deprecated
60. D) It requires DEBUG=True
61. Explanation: Django streaming user-uploaded files is slow and exposes the app to disk I/O bottlenecks. Use Nginx (alias) or S3.
62. Q10: Which env var does Django need to know the request was HTTPS behind a proxy?
63. A) HTTPS=on
64. B) SSL_CERT
65. C) SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https") (*)
66. D) PROXY_HTTPS
67. Explanation: Behind a TLS-terminating proxy (Nginx/Cloudflare), Django sees HTTP. SECURE_PROXY_SSL_HEADER tells it which header to trust for is_secure().
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is the most common WSGI server for Django in production?
  options:
    - runserver
    - Gunicorn
    - Tornado
    - uWSGI only
  correctIndex: 1
  explanation: Gunicorn is the de facto standard. uWSGI is also valid but less common. runserver is dev-only.
- id: q2
  question: Rule of thumb for Gunicorn workers?
  options:
    - "1"
    - Always 10
    - (2 × CPU cores) + 1
    - Match the DB connection pool size
    - + 1 is the Gunicorn docs' starting point. Tune per workload — I/O-bound can use more threads or async workers.
  correctIndex: 2
  explanation: (2 × CPU) + 1 is the Gunicorn docs' starting point. Tune per workload — I/O-bound can use more threads or async workers.
- id: q3
  question: When should migrations run during deploy?
  options:
    - After the new code starts serving
    - Manually by an admin
    - Never — run them in dev only
    - Before the new code serves traffic (release step)
  correctIndex: 3
  explanation: Migrations must complete before the new code expects the new schema. Breaking migrations need a multi-step deploy (expand, then contract).
- id: q4
  question: Which command gathers static files for production?
  options:
    - python manage.py collectstatic
    - python manage.py buildstatic
    - python manage.py static
    - gunicorn handles it
  correctIndex: 0
  explanation: collectstatic copies all static files into STATIC_ROOT. Run it at build (Dockerfile) or in the release command.
- id: q5
  question: Why put Nginx in front of Gunicorn?
  options:
    - Gunicorn can't handle HTTP
    - TLS termination, static files, slow-client buffering, rate limiting
    - Nginx runs Python code
    - It's required by Django
  correctIndex: 1
  explanation: Nginx handles TLS, serves /static/ and /media/ directly, and buffers slow clients. Gunicorn focuses on Python.
- id: q6
  question: What does a 12-factor app read config from?
  options:
    - settings.json committed to git
    - Hard-coded constants
    - Environment variables
    - The database
  correctIndex: 2
  explanation: '12-factor: config in env vars, not code. Use django-environ or os.environ["KEY"] in settings.py.'
- id: q7
  question: What's a zero-downtime deploy?
  options:
    - Take the site offline briefly
    - Restart the DB
    - Skip migrations
    - Bring up new instances, drain old (no traffic gap)
  correctIndex: 3
  explanation: "Rolling or blue-green: new instances pass health checks before old ones drain. gunicorn SIGHUP reloads workers in place."
- id: q8
  question: What should /health/ return for a healthy app?
  options:
    - 200 OK with a small JSON body
    - "500"
    - A full HTML page
    - Redirect to /admin/
  correctIndex: 0
  explanation: Health checks should be cheap and return 200. Optionally check DB/cache connectivity. Load balancer uses this to route traffic.
- id: q9
  question: Why should /media/ never be served by Django in prod?
  options:
    - Django can't read files
    - Slow + security risk; use Nginx, S3, or CloudFront
    - It's deprecated
    - It requires DEBUG=True
  correctIndex: 1
  explanation: Django streaming user-uploaded files is slow and exposes the app to disk I/O bottlenecks. Use Nginx (alias) or S3.
- id: q10
  question: Which env var does Django need to know the request was HTTPS behind a proxy?
  options:
    - HTTPS=on
    - SSL_CERT
    - SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    - PROXY_HTTPS
  correctIndex: 2
  explanation: Behind a TLS-terminating proxy (Nginx/Cloudflare), Django sees HTTP. SECURE_PROXY_SSL_HEADER tells it which header to trust for is_secure().
```

