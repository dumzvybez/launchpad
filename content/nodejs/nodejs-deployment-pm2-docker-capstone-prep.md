---
slug: nodejs-deployment-pm2-docker-capstone-prep
id: nodejs-20
track: nodejs
order: 20
title: Deployment — PM2, Docker, Capstone Prep
description: Deploy Node apps with PM2 (cluster mode, zero-downtime reload) and Docker (multi-stage builds, distroless images), wire up health checks, CI/CD, and graceful shutdown.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=w-7RQ46RgxU&t=540s
whyItMatters: Deploy Node apps with PM2 (cluster mode, zero-downtime reload) and Docker (multi-stage builds, distroless images), wire up health checks, CI/CD, and graceful shutdown.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# Deployment — PM2, Docker, Capstone Prep

## Deployment — PM2, Docker, Capstone Prep

### Why It Matters

Deploy Node apps with PM2 (cluster mode, zero-downtime reload) and Docker (multi-stage builds, distroless images), wire up health checks, CI/CD, and graceful shutdown.

Deploy Node apps with PM2 (cluster mode, zero-downtime reload) and Docker (multi-stage builds, distroless images), wire up health checks, CI/CD, and graceful shutdown.

### Prerequisites

- Stage 10: Process — graceful shutdown on SIGTERM.
- Stage 14: Clustering and Child Processes (PM2 cluster mode).
- Stage 18: Testing (CI runs tests before deploy).

### Topics

- PM2: `ecosystem.config.js`, cluster mode, `pm2 reload`, logs, monitoring
- Docker multi-stage builds for minimal images
- `distroless` and `alpine` base images (trade-offs)
- `.dockerignore` (exclude node_modules, .git, test files)
- Health checks: liveness vs readiness, HTTP `/healthz` and `/readyz`
- Kubernetes Deployment YAML with liveness/readiness probes
- CI/CD with GitHub Actions: test, build, push image, deploy
- Environment management and secrets (never bake into image)
- Rolling updates and zero-downtime deploys

### Key Concepts

- PM2 keeps processes alive (auto-restart on crash) and supports zero-downtime reload in cluster mode (rolling restart of workers).
- Docker multi-stage builds separate build deps (compilers, dev tools) from runtime; final image contains only the app and runtime.
- Liveness probe ("is the process up?") vs readiness probe ("can it serve traffic?") — k8s routes traffic only when ready.
- Never bake secrets into the image — pass via k8s Secrets, env vars at runtime, or a secrets manager (Vault, AWS Secrets Manager).
- Rolling updates replace pods one at a time; combined with readiness probes, this gives zero-downtime deploys.

```javascript
module.exports = {
  apps: [{
    name: "api",
    script: "./dist/server.js",
    instances: "max",            // one per CPU core
    exec_mode: "cluster",
    max_memory_restart: "500M",
    env: { NODE_ENV: "production", PORT: 3000 },
    env_staging: { NODE_ENV: "staging", PORT: 3001 },
  }],
};

// pm2 start ecosystem.config.js --env production
// pm2 reload api       (zero-downtime reload in cluster mode)
// pm2 logs api
// pm2 monit
```
Caption: PM2 ecosystem.config.js

### Common Pitfalls

- Running as root in Docker — distroless images run as `nonroot` by default; if using alpine, add `USER node` to drop privileges; root in containers is a security risk.
- Baking secrets into the image (`ENV API_KEY=...` in Dockerfile) — anyone with the image can extract them; pass via k8s Secrets or env vars at runtime.
- Not setting memory limits in k8s — a memory leak OOM-kills the node, taking down other pods; always set `resources.limits.memory`.
- Missing health checks — k8s can't tell if your app is actually serving; without liveness/readiness probes, traffic goes to broken pods.
- No graceful shutdown — k8s sends SIGTERM with a 30s grace; if you don't drain, in-flight requests get 5xx. Use `preStop` hook + `server.close()`.

### Real-World Applications

- Netflix deploys Node services via Spinnaker + Docker on AWS; canaries gate production traffic.
- PayPal runs Node in Docker + k8s across thousands of pods.
- Uber uses custom deployment tooling but the pattern is the same: build image, push registry, rolling update.
- Vercel runs Next.js on serverless (a different model but related); many companies still use long-running PM2/Docker.

### Interview Questions

- 1. How do you deploy Node without downtime? — Use rolling updates (k8s `maxUnavailable: 0`) combined with readiness probes and `preStop` hooks; PM2's cluster mode `reload` does this on a single host.
- 2. What is PM2 cluster mode? — A wrapper around Node's `cluster` module that forks one worker per CPU core, auto-restarts crashed workers, and reloads them one-by-one for zero-downtime deploys.
- 3. How do you minimize Docker image size? — Multi-stage builds (build deps in stage 1, copy only artifacts to stage 2), distroless or alpine base images, and `.dockerignore` to exclude dev files.
- 4. What is a readiness probe? — A k8s probe that checks if the pod can serve traffic (e.g. HTTP `/readyz`); the pod only receives traffic when readiness passes.
- 5. How do you handle secrets in production? — Never bake into the image; use k8s Secrets (mounted as env vars or files), cloud secrets managers (AWS Secrets Manager, GCP Secret Manager, Vault), or sealed-secrets.

### Mini Project

Build a Production Dockerfile + PM2 Config: Take your Stage 16/17 API and ship it: multi-stage Dockerfile (<150MB image), PM2 ecosystem.config.js with 4 cluster workers, k8s Deployment YAML with health checks and rolling updates, and a GitHub Actions workflow that tests, builds, and pushes the image. Suggested approach:
  - Write a multi-stage Dockerfile using `node:20-alpine` for build and `gcr.io/distroless/nodejs20-debian12` for runtime
  - Add a `.dockerignore` excluding node_modules, .git, test files, .env
  - Add `/healthz` (always 200) and `/readyz` (checks DB ping) endpoints
  - Write `ecosystem.config.js` with `exec_mode: cluster`, `instances: 4`, `max_memory_restart: 500M`
  - Write a GitHub Actions workflow: `npm ci`, `npm test`, `docker build`, `docker push ghcr.io/...`

### Exercises

1. Write a multi-stage Dockerfile that builds TypeScript and runs the compiled JS in a distroless image; verify size < 150MB.
2. Configure PM2 in cluster mode with 4 workers and verify `pm2 reload` doesn't drop requests.
3. Add `/healthz` and `/readyz` endpoints; verify the latter returns 503 when DB is unreachable.
4. Write k8s YAML with liveness, readiness, resources, and `preStop: node drain.js`.
5. Set up a GitHub Actions workflow that runs `npm ci && npm test && docker build && docker push`.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does PM2 cluster mode do?
9. A) Runs the app in a single thread
10. B) Spawns Docker containers
11. C) Compiles TypeScript
12. D) Forks one worker per CPU core and supports zero-downtime reload (*)
13. Explanation: PM2 cluster mode wraps Node's `cluster` module — one worker per CPU core, auto-restart on crash, and `pm2 reload` restarts workers one-by-one for zero-downtime deploys.
14. Q2: Which Docker base image produces the smallest Node image?
15. A) gcr.io/distroless/nodejs20-debian12 (*)
16. B) node:20
17. C) node:20-alpine
18. D) ubuntu:22.04 with node installed
19. Explanation: Distroless images have no shell, package manager, or extra binaries — just the runtime; they're the smallest and most secure. Alpine is also small but has a musl libc that occasionally breaks native modules.
20. Q3: What is a readiness probe?
21. A) A probe that checks if the process is up
22. B) A probe that checks if the pod can serve traffic (*)
23. C) A probe that restarts the pod
24. D) A probe that scales the deployment
25. Explanation: Readiness checks "can this pod serve traffic?" (e.g. HTTP `/readyz` returning 200); k8s routes traffic only to ready pods. Liveness checks "is the process alive?".
26. Q4: Where should secrets live in production?
27. A) Baked into the Docker image
28. B) In a .env file committed to git
29. C) In k8s Secrets or a cloud secrets manager, mounted at runtime (*)
30. D) Hard-coded in source
31. Explanation: Never bake secrets into images or commit them; use k8s Secrets (mounted as env vars or files), AWS Secrets Manager, GCP Secret Manager, or HashiCorp Vault.
32. Q5: What does `.dockerignore` do?
33. A) Lists files to include in the image
34. B) Ignores Docker daemon errors
35. C) Skips the build stage
36. D) Lists files to exclude from the build context (*)
37. Explanation: `.dockerignore` excludes files (node_modules, .git, .env, test files) from the Docker build context, speeding up builds and reducing image size + secret leakage risk.
38. Q6: Which k8s strategy gives zero-downtime deploys?
39. A) RollingUpdate with maxUnavailable: 0 (*)
40. B) Recreate
41. C) Blue-green only
42. D) Canary only
43. Explanation: `RollingUpdate` with `maxUnavailable: 0` and `maxSurge: 1` adds new pods before removing old ones; combined with readiness probes, traffic never hits a not-ready pod.
44. Q7: Why use a multi-stage Docker build?
45. A) Faster builds
46. B) Separate build deps (compilers, dev tools) from runtime; smaller final image (*)
47. C) Better caching
48. D) Required by Docker
49. Explanation: Stage 1 (`node:20-alpine`) has dev deps and compiles TS; stage 2 copies only compiled JS + prod node_modules to a smaller runtime image, dropping build tools.
50. Q8: What does the `preStop` hook do in k8s?
51. A) Restarts the pod
52. B) Increases replicas
53. C) Runs a command before SIGTERM (e.g. `node drain.js`) to drain traffic (*)
54. D) Deletes the deployment
55. Explanation: `preStop: exec: command: [node, drain.js]` runs before k8s sends SIGTERM; gives the pod a moment to deregister from the load balancer before shutdown.
56. Q9: Why run containers as nonroot?
57. A) Faster
58. B) Smaller image
59. C) Required by Docker
60. D) Security — root in a container is still root on the host kernel (*)
61. Explanation: A container root has many host kernel privileges; if an attacker escapes the container, they have root. Distroless defaults to `nonroot`; alpine images should add `USER node`.
62. Q10: Which GitHub Actions step belongs before `docker push`?
63. A) `npm ci && npm test` (run tests in CI before pushing the image) (*)
64. B) `npm deploy`
65. C) `npm publish`
66. D) `git push`
67. Explanation: Always run tests in CI before building/pushing the image; if tests fail, the workflow stops and no image is pushed, preventing broken deploys.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: What does PM2 cluster mode do?
  options:
    - Runs the app in a single thread
    - Spawns Docker containers
    - Compiles TypeScript
    - Forks one worker per CPU core and supports zero-downtime reload
  correctIndex: 3
  explanation: PM2 cluster mode wraps Node's `cluster` module — one worker per CPU core, auto-restart on crash, and `pm2 reload` restarts workers one-by-one for zero-downtime deploys.
- id: q2
  question: Which Docker base image produces the smallest Node image?
  options:
    - gcr.io/distroless/nodejs20-debian12
    - node:20
    - node:20-alpine
    - ubuntu:22.04 with node installed
  correctIndex: 0
  explanation: Distroless images have no shell, package manager, or extra binaries — just the runtime; they're the smallest and most secure. Alpine is also small but has a musl libc that occasionally breaks native modules.
- id: q3
  question: What is a readiness probe?
  options:
    - A probe that checks if the process is up
    - A probe that checks if the pod can serve traffic
    - A probe that restarts the pod
    - A probe that scales the deployment
  correctIndex: 1
  explanation: Readiness checks "can this pod serve traffic?" (e.g. HTTP `/readyz` returning 200); k8s routes traffic only to ready pods. Liveness checks "is the process alive?".
- id: q4
  question: Where should secrets live in production?
  options:
    - Baked into the Docker image
    - In a .env file committed to git
    - In k8s Secrets or a cloud secrets manager, mounted at runtime
    - Hard-coded in source
  correctIndex: 2
  explanation: Never bake secrets into images or commit them; use k8s Secrets (mounted as env vars or files), AWS Secrets Manager, GCP Secret Manager, or HashiCorp Vault.
- id: q5
  question: What does `.dockerignore` do?
  options:
    - Lists files to include in the image
    - Ignores Docker daemon errors
    - Skips the build stage
    - Lists files to exclude from the build context
  correctIndex: 3
  explanation: "`.dockerignore` excludes files (node_modules, .git, .env, test files) from the Docker build context, speeding up builds and reducing image size + secret leakage risk."
- id: q6
  question: Which k8s strategy gives zero-downtime deploys?
  options:
    - "RollingUpdate with maxUnavailable: 0"
    - Recreate
    - Blue-green only
    - Canary only
  correctIndex: 0
  explanation: "`RollingUpdate` with `maxUnavailable: 0` and `maxSurge: 1` adds new pods before removing old ones; combined with readiness probes, traffic never hits a not-ready pod."
- id: q7
  question: Why use a multi-stage Docker build?
  options:
    - Faster builds
    - Separate build deps (compilers, dev tools) from runtime; smaller final image
    - Better caching
    - Required by Docker
  correctIndex: 1
  explanation: Stage 1 (`node:20-alpine`) has dev deps and compiles TS; stage 2 copies only compiled JS + prod node_modules to a smaller runtime image, dropping build tools.
- id: q8
  question: What does the `preStop` hook do in k8s?
  options:
    - Restarts the pod
    - Increases replicas
    - Runs a command before SIGTERM (e.g. `node drain.js`) to drain traffic
    - Deletes the deployment
  correctIndex: 2
  explanation: "`preStop: exec: command: [node, drain.js]` runs before k8s sends SIGTERM; gives the pod a moment to deregister from the load balancer before shutdown."
- id: q9
  question: Why run containers as nonroot?
  options:
    - Faster
    - Smaller image
    - Required by Docker
    - Security — root in a container is still root on the host kernel
  correctIndex: 3
  explanation: A container root has many host kernel privileges; if an attacker escapes the container, they have root. Distroless defaults to `nonroot`; alpine images should add `USER node`.
- id: q10
  question: Which GitHub Actions step belongs before `docker push`?
  options:
    - "`npm ci && npm test` (run tests in CI before pushing the image)"
    - "`npm deploy`"
    - "`npm publish`"
    - "`git push`"
  correctIndex: 0
  explanation: Always run tests in CI before building/pushing the image; if tests fail, the workflow stops and no image is pushed, preventing broken deploys.
```

