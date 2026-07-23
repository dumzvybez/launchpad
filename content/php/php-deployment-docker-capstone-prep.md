---
slug: php-deployment-docker-capstone-prep
id: php-20
track: php
order: 20
title: Deployment, Docker, and Capstone Prep
description: Containerize PHP with multi-stage Dockerfiles, configure php-fpm + nginx for production, tune OPcache, set up CI/CD with GitHub Actions, and prepare for the capstone project.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=15200s
whyItMatters: Containerize PHP with multi-stage Dockerfiles, configure php-fpm + nginx for production, tune OPcache, set up CI/CD with GitHub Actions, and prepare for the capstone project.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Deployment, Docker, and Capstone Prep

## Deployment, Docker, and Capstone Prep

### Why It Matters

Containerize PHP with multi-stage Dockerfiles, configure php-fpm + nginx for production, tune OPcache, set up CI/CD with GitHub Actions, and prepare for the capstone project.

Containerize PHP with multi-stage Dockerfiles, configure php-fpm + nginx for production, tune OPcache, set up CI/CD with GitHub Actions, and prepare for the capstone project.

### Prerequisites

- Stage 13: Composer and Dependency Management
- Stage 16: Error Handling, Exceptions, and Logging
- Stage 18: Laravel Basics — Routing, Eloquent, Blade
- Stage 19: Testing — PHPUnit, Pest, Mockery

### Topics

- Multi-stage Dockerfiles for PHP-FPM + nginx
- `composer install --no-dev --optimize-autoloader` in production
- OPcache configuration (`opcache.enable`, `opcache.preload`)
- Production php.ini: `display_errors=Off`, `expose_php=Off`, `max_execution_time`
- Environment variables and `.env` files via `vlucas/phpdotenv`
- Reverse proxy: nginx fastcgi_pass to php-fpm:9000
- Health checks and `HEALTHCHECK` directive
- GitHub Actions: matrix builds, caching `vendor/`, deploying on tag
- Zero-downtime deploy: rolling restart of php-fpm workers
- Secrets management: GitHub Actions secrets, environment-scoped env vars
- Capstone preparation: project scope, architecture sketch, P0/P1/P2 planning

### Key Concepts

- A production PHP image should contain: PHP-FPM, your code (copied in), `vendor/` (with `--no-dev`), and an OPcache-configured php.ini — no dev tools, no Xdebug, no source maps.
- nginx + php-fpm: nginx serves static files (images, CSS, JS) directly and proxies PHP requests to `php-fpm:9000` via the FastCGI protocol. They're separate containers in a `docker-compose.yml`.
- OPcache caches the compiled bytecode of your PHP files in shared memory, skipping the parse/compile step on every request. Tune `opcache.memory_consumption`, `opcache.max_accelerated_files`, and use `opcache.preload` to warm the cache at startup.
- Production env vars should come from the environment (12-factor app), not from a committed `.env` file. Use `.env.example` to document required vars; never commit `.env`.
- Zero-downtime deploy: run new containers, drain old ones; for php-fpm, the master process can gracefully reload workers without dropping requests (`kill -USR2` to the master).

```dockerfile
# Stage 1: build dependencies
FROM composer:2 AS builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts
COPY . .
RUN composer dump-autoload --classmap-authoritative

# Stage 2: production image
FROM php:8.2-fpm-alpine
RUN docker-php-ext-install pdo pdo_mysql opcache \
    && rm -rf /var/cache/apk/*

# Production php.ini
RUN echo "expose_php = Off" \
        "display_errors = Off" \
        "log_errors = On" \
        "opcache.enable = 1" \
        "opcache.memory_consumption = 128" \
        "opcache.max_accelerated_files = 10000" \
        "opcache.validate_timestamps = 0" > /usr/local/etc/php/conf.d/prod.ini

COPY --from=builder /app /app
WORKDIR /app

HEALTHCHECK --interval=30s --timeout=3s CMD \
    php-fpm-healthcheck || exit 1

USER www-data
```
Caption: Multi-stage Dockerfile

### Common Pitfalls

- Shipping dev dependencies (PHPUnit, PHPStan) to production — `composer install --no-dev --optimize-autoloader` excludes them, shrinking the image and reducing attack surface.
- Leaving `display_errors = On` or `expose_php = On` in production — `display_errors` leaks stack traces; `expose_php` adds an `X-Powered-By: PHP/8.2.x` header that helps attackers fingerprint your stack.
- Forgetting to invalidate OPcache after a deploy — `opcache.validate_timestamps = 0` (production) means OPcache never checks file mtime; you must restart php-fpm or call `opcache_reset()` after deploy.
- Committing `.env` with real secrets — `.env` should be in `.gitignore`; commit `.env.example` with placeholders. Use the hosting platform's environment variables UI or a secrets manager for real values.
- Single-stage Dockerfiles that ship the entire build context — multi-stage builds (builder + runtime) keep the final image lean by copying only what's needed; ship fewer tools = smaller attack surface.

### Real-World Applications

- Laravel Forge and Laravel Vapor automate Docker-style deploys for Laravel apps; Forge provisions a server with nginx + php-fpm, Vapor uses AWS Lambda with Bref.
- WordPress.com (Automattic) deploys via custom Docker images for the WordPress.com hosting tier, with php-fpm pools sized per-traffic-tier.
- Slack's newer internal services deploy as Docker images to Kubernetes, replacing the older HHVM-on-bare-metal deployment model.
- Wikipedia's MediaWiki runs on a custom Kubernetes setup with php-fpm pools per wiki size; OPcache preloading cuts cold-start latency by ~40%.

### Interview Questions

- 1. Why use a multi-stage Dockerfile for PHP? — The builder stage runs `composer install` (with dev tools); the runtime stage copies only the app + production vendor/ — smaller image, smaller attack surface.
- 2. What does OPcache do, and why disable `validate_timestamps` in production? — OPcache caches compiled bytecode in shared memory; `validate_timestamps=0` skips mtime checks (faster) but requires a php-fpm restart after deploy.
- 3. What's the role of nginx in a PHP-FPM setup? — nginx serves static files directly and proxies PHP requests to php-fpm:9000 via FastCGI; separating them allows scaling static vs dynamic independently.
- 4. Why `composer install --no-dev --optimize-autoloader` in production? — `--no-dev` excludes PHPUnit/PHPStan (smaller, safer image); `--optimize-autoloader` builds a classmap for O(1) lookups (faster).
- 5. How do you achieve zero-downtime deploy with php-fpm? — Rolling restart: bring up new containers, drain old ones; php-fpm's master can gracefully reload workers (`kill -USR2`) without dropping in-flight requests.

### Mini Project

Build a Dockerized PHP App with CI/CD: Take a small Slim or Laravel app, write a multi-stage Dockerfile (builder + php-fpm runtime), a docker-compose.yml with nginx + MySQL, a GitHub Actions workflow running tests on PHP 8.2 and 8.3, and deploy on tag. Suggested approach:
  - Write the Dockerfile in two stages: composer install in builder, copy to php:8.2-fpm-alpine runtime
  - Configure OPcache with `validate_timestamps=0` in a `prod.ini`
  - Write `docker-compose.yml` with app + nginx + db services
  - Add `.github/workflows/ci.yml` with `shivammathur/setup-php` and a test matrix
  - Add a deploy job triggered on `v*` tags that builds and pushes the image

### Exercises

1. Write a multi-stage Dockerfile for a Slim app: builder runs `composer install`, runtime is `php:8.2-fpm-alpine` with `COPY --from=builder /app /app`.
2. Add a `prod.ini` with `opcache.enable=1`, `opcache.validate_timestamps=0`, `display_errors=Off`, `expose_php=Off`.
3. Write a `docker-compose.yml` with `app` (php-fpm), `nginx` (proxying to app:9000), and `db` (MySQL 8).
4. Create a GitHub Actions workflow that runs Pest on PHP 8.2 and 8.3 in a matrix, caching `vendor/`.
5. Add a deploy job triggered on `v*` tags that builds the Docker image and pushes to a registry.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which composer flags install for production?
9. A) `composer install --dev`
10. B) `composer update --all`
11. C) `composer deploy`
12. D) `composer install --no-dev --optimize-autoloader` (*)
13. Explanation: `--no-dev` excludes dev dependencies (PHPUnit, PHPStan); `--optimize-autoloader` builds a classmap for O(1) lookups. Use this in production.
14. Q2: What does OPcache do?
15. A) Caches compiled PHP bytecode in shared memory (*)
16. B) Caches database queries
17. C) Caches HTTP responses
18. D) Caches sessions
19. Explanation: OPcache caches the compiled bytecode of PHP files in shared memory, skipping the parse/compile step on every request — major performance win.
20. Q3: Why disable `opcache.validate_timestamps` in production?
21. A) Saves disk space
22. B) Skips mtime checks for faster execution; requires php-fpm restart after deploy (*)
23. C) Prevents file corruption
24. D) Improves security
25. Explanation: `validate_timestamps=0` skips per-request file mtime checks (faster); the trade-off is you must restart php-fpm or call `opcache_reset()` after deploying new code.
26. Q4: What does nginx do in a php-fpm setup?
27. A) Runs PHP scripts directly
28. B) Manages database connections
29. C) Serves static files and proxies PHP requests to php-fpm:9000 via FastCGI (*)
30. D) Handles sessions
31. Explanation: nginx serves static files directly and proxies PHP requests to the php-fpm container via FastCGI on port 9000; the separation allows independent scaling.
32. Q5: Which php.ini setting should be `Off` in production?
33. A) `log_errors`
34. B) `opcache.enable`
35. C) `error_reporting`
36. D) `display_errors` (*)
37. Explanation: `display_errors=Off` prevents leaking stack traces to users. Keep `log_errors=On` and `error_reporting=E_ALL` so errors are still captured server-side.
38. Q6: What's the benefit of a multi-stage Dockerfile?
39. A) Smaller final image (only runtime deps, no build tools) (*)
40. B) Faster builds
41. C) Better debugging
42. D) Lower memory usage
43. Explanation: Multi-stage builds copy only what's needed from the builder stage to the runtime stage — no dev tools, no source, no build dependencies. Smaller image = smaller attack surface.
44. Q7: Which GitHub Action sets up PHP for CI?
45. A) `actions/setup-php`
46. B) `shivammathur/setup-php` (*)
47. C) `php/setup`
48. D) `composer/setup-php`
49. Explanation: `shivammathur/setup-php@v2` is the de-facto GitHub Action for PHP: it installs any PHP version with extensions, coverage (Xdebug/PCOV), and composer caching.
50. Q8: What does the `HEALTHCHECK` Docker directive do?
51. A) Encrypts traffic
52. B) Restarts the container automatically
53. C) Periodically runs a command to check container health (*)
54. D) Allocates resources
55. Explanation: `HEALTHCHECK --interval=30s CMD ...` runs a command periodically; if it exits non-zero, the container is marked unhealthy (orchestrators can restart it).
56. Q9: Why should `.env` be git-ignored?
57. A) It's too large
58. B) It's auto-generated
59. C) It conflicts with composer.json
60. D) It contains secrets (database passwords, API keys) that should never be committed (*)
61. Explanation: `.env` typically contains secrets; commit `.env.example` with placeholders, and use the hosting platform's env vars UI or a secrets manager for real values.
62. Q10: How is zero-downtime deploy achieved with php-fpm?
63. A) Rolling restart: bring up new containers, drain old ones; php-fpm master can gracefully reload workers (*)
64. B) Stop and start the container quickly
65. C) Delete the old code and upload new
66. D) Use OPcache to swap files
67. Explanation: Rolling restart (Kubernetes, ECS, etc.) brings up new containers before draining old ones; php-fpm's master process can gracefully reload workers (`kill -USR2`) without dropping in-flight requests.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: Which composer flags install for production?
  options:
    - "`composer install --dev`"
    - "`composer update --all`"
    - "`composer deploy`"
    - "`composer install --no-dev --optimize-autoloader`"
  correctIndex: 3
  explanation: "`--no-dev` excludes dev dependencies (PHPUnit, PHPStan); `--optimize-autoloader` builds a classmap for O(1) lookups. Use this in production."
- id: q2
  question: What does OPcache do?
  options:
    - Caches compiled PHP bytecode in shared memory
    - Caches database queries
    - Caches HTTP responses
    - Caches sessions
  correctIndex: 0
  explanation: OPcache caches the compiled bytecode of PHP files in shared memory, skipping the parse/compile step on every request — major performance win.
- id: q3
  question: Why disable `opcache.validate_timestamps` in production?
  options:
    - Saves disk space
    - Skips mtime checks for faster execution; requires php-fpm restart after deploy
    - Prevents file corruption
    - Improves security
  correctIndex: 1
  explanation: "`validate_timestamps=0` skips per-request file mtime checks (faster); the trade-off is you must restart php-fpm or call `opcache_reset()` after deploying new code."
- id: q4
  question: What does nginx do in a php-fpm setup?
  options:
    - Runs PHP scripts directly
    - Manages database connections
    - Serves static files and proxies PHP requests to php-fpm:9000 via FastCGI
    - Handles sessions
  correctIndex: 2
  explanation: nginx serves static files directly and proxies PHP requests to the php-fpm container via FastCGI on port 9000; the separation allows independent scaling.
- id: q5
  question: Which php.ini setting should be `Off` in production?
  options:
    - "`log_errors`"
    - "`opcache.enable`"
    - "`error_reporting`"
    - "`display_errors`"
  correctIndex: 3
  explanation: "`display_errors=Off` prevents leaking stack traces to users. Keep `log_errors=On` and `error_reporting=E_ALL` so errors are still captured server-side."
- id: q6
  question: What's the benefit of a multi-stage Dockerfile?
  options:
    - Smaller final image (only runtime deps, no build tools)
    - Faster builds
    - Better debugging
    - Lower memory usage
  correctIndex: 0
  explanation: Multi-stage builds copy only what's needed from the builder stage to the runtime stage — no dev tools, no source, no build dependencies. Smaller image = smaller attack surface.
- id: q7
  question: Which GitHub Action sets up PHP for CI?
  options:
    - "`actions/setup-php`"
    - "`shivammathur/setup-php`"
    - "`php/setup`"
    - "`composer/setup-php`"
    - ", and composer caching."
  correctIndex: 1
  explanation: "`shivammathur/setup-php@v2` is the de-facto GitHub Action for PHP: it installs any PHP version with extensions, coverage (Xdebug/PCOV), and composer caching."
- id: q8
  question: What does the `HEALTHCHECK` Docker directive do?
  options:
    - Encrypts traffic
    - Restarts the container automatically
    - Periodically runs a command to check container health
    - Allocates resources
  correctIndex: 2
  explanation: "`HEALTHCHECK --interval=30s CMD ...` runs a command periodically; if it exits non-zero, the container is marked unhealthy (orchestrators can restart it)."
- id: q9
  question: Why should `.env` be git-ignored?
  options:
    - It's too large
    - It's auto-generated
    - It conflicts with composer.json
    - It contains secrets (database passwords, API keys) that should never be committed
  correctIndex: 3
  explanation: "`.env` typically contains secrets; commit `.env.example` with placeholders, and use the hosting platform's env vars UI or a secrets manager for real values."
- id: q10
  question: How is zero-downtime deploy achieved with php-fpm?
  options:
    - "Rolling restart: bring up new containers, drain old ones; php-fpm master can gracefully reload workers"
    - Stop and start the container quickly
    - Delete the old code and upload new
    - Use OPcache to swap files
  correctIndex: 0
  explanation: Rolling restart (Kubernetes, ECS, etc.) brings up new containers before draining old ones; php-fpm's master process can gracefully reload workers (`kill -USR2`) without dropping in-flight requests.
```

