---
slug: python-deployment-ci-cd-capstone-prep
id: python-20
track: python
order: 20
title: Deployment, CI/CD, and Capstone Prep
description: Ship your Python app — Dockerize it, set up GitHub Actions CI with lint/test/type-check, deploy to Render or Fly.io, and prepare for the capstone project.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=22700s
whyItMatters: Ship your Python app — Dockerize it, set up GitHub Actions CI with lint/test/type-check, deploy to Render or Fly. io, and prepare for the capstone project.
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Deployment, CI/CD, and Capstone Prep

## Deployment, CI/CD, and Capstone Prep

### Why It Matters

Ship your Python app — Dockerize it, set up GitHub Actions CI with lint/test/type-check, deploy to Render or Fly. io, and prepare for the capstone project.

Ship your Python app — Dockerize it, set up GitHub Actions CI with lint/test/type-check, deploy to Render or Fly.io, and prepare for the capstone project.

### Prerequisites

- Stage 19: Packaging, Virtual Environments, and Project Structure
- Stage 15: Testing — pytest, unittest, and TDD Basics.

### Topics

- Docker for Python apps (Dockerfile, .dockerignore, multi-stage builds)
- GitHub Actions: lint, test, type-check, build, deploy
- Linting with ruff (and flake8 as legacy)
- Formatting with black (and ruff format)
- Type checking with mypy (strict mode)
- pre-commit hooks for local enforcement
- Deployment targets: Render, Fly.io, Heroku, AWS App Runner
- Secrets management (env vars, .env files, vaults)
- Health checks and graceful shutdown

### Key Concepts

- A Docker image packages your app + deps + runtime into a portable artifact.
- CI runs on every push/PR; CD deploys after CI passes on the main branch.
- 12-factor app principles: config in env vars, logs to stdout, stateless processes.
- Health checks (GET /health) let platforms know your app is alive; failing checks trigger restarts.
- "Build once, deploy many" — same image goes to staging and prod, with env vars differing.

```dockerfile
# Multi-stage build for a Python app
FROM python:3.12-slim AS builder
WORKDIR /app
COPY pyproject.toml ./
RUN pip install --no-cache-dir build && python -m build --wheel

FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /app/dist/*.whl /tmp/
RUN pip install --no-cache-dir /tmp/*.whl && rm /tmp/*.whl
COPY . .
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:8000/health || exit 1
CMD ["gunicorn", "myapp:app", "-b", "0.0.0.0:8000", "-w", "4"]
```
Caption: Dockerfile

### Common Pitfalls

- Secrets in git — never commit .env or hardcode API keys; use env vars and a secrets manager (AWS Secrets Manager, Doppler, Vault).
- No CI on PRs — bugs slip in; run lint+test+type-check on every PR before merge.
- Deploying untested code — only deploy after CI passes; tag releases with semver (v1.2.3).
- No rollback plan — keep the previous image; if deploy fails, roll back instantly.
- Building per-environment — build ONE image, deploy to staging and prod with different env vars (12-factor).

### Real-World Applications

- Instagram deploys Python (Django) services hundreds of times per day via CI/CD with Docker and Mesos.
- Netflix uses Spinnaker (Python-driven) for multi-cloud deployments with automated canary analysis.
- Stripe uses GitHub Actions + Docker to deploy its Python SDK and API services.
- Dropbox uses pre-commit hooks company-wide to enforce linting and formatting before push.

### Interview Questions

- 1. What's the difference between CI and CD? — CI (continuous integration) runs tests on every push; CD (continuous deployment) auto-deploys after CI passes.
- 2. What's a 12-factor app? — Methodology: config in env vars, logs to stdout, stateless processes, disposable, port binding, etc.
- 3. Why use Docker for Python? — Reproducible builds, isolation, easy deploy to any platform, no "works on my machine."
- 4. What's a health check? — An endpoint (e.g. /health) the platform polls to know if the app is alive; failing checks trigger restarts.
- 5. Why "build once, deploy many"? — Same image across staging/prod eliminates build-time variance; only env vars differ.

### Mini Project

Build a CI/CD Pipeline for your Stage 19 CLI package: Add a GitHub Actions workflow that lints (ruff), type-checks (mypy), tests (pytest with coverage), builds a wheel, and publishes to TestPyPI on tag. Suggested approach:
  - Create .github/workflows/ci.yml with a matrix on Python 3.10/3.11/3.12
  - Add ruff, mypy, pytest steps with caching of pip downloads
  - Add a release job that builds sdist + wheel and uploads to TestPyPI on git tag
  - Add a .pre-commit-config.yaml with ruff + mypy hooks
  - Add a Dockerfile that builds a slim runtime image

### Exercises

1. Write a Dockerfile for a FastAPI app using python:3.12-slim.
2. Add a .dockerignore that excludes .venv, __pycache__, .git.
3. Write a GitHub Actions workflow that runs ruff, mypy, and pytest on every PR.
4. Add a /health endpoint to a FastAPI app and verify with curl.
5. Set up pre-commit with ruff + mypy; verify it runs on git commit.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the difference between CI and CD?
9. A) Same thing
10. B) CI is for libraries; CD is for apps
11. C) CI deploys; CD tests
12. D) CI runs tests on every push; CD auto-deploys after CI passes (*)
13. Explanation: Continuous Integration = automated tests on every push/PR. Continuous Deployment/Delivery = automated deploy after CI passes.
14. Q2: Which base image is recommended for production Python?
15. A) python:3.12 (full)
16. B) ubuntu:latest + apt install python
17. C) python:3.12-slim (*)
18. D) alpine + pip
19. Explanation: python:3.12-slim is a smaller image (no build tools by default); alpine has issues with Python wheels (often forces source builds).
20. Q3: Where should secrets live?
21. A) In environment variables / secrets manager (never in git) (*)
22. B) In a committed .env file
23. C) Hardcoded in source
24. D) In pyproject.toml
25. Explanation: Secrets go in env vars (12-factor) or a secrets manager (Vault, AWS Secrets Manager, Doppler); never hardcode or commit them.
26. Q4: What does a health check endpoint do?
27. A) Encrypts traffic
28. B) Platform polls it; non-200 triggers restart (*)
29. C) Authenticates users
30. D) Returns the app version
31. Explanation: /health returns 200 if alive; platforms (Render, Fly, k8s) poll it and restart the container on failure.
32. Q5: Which tool lints and formats Python (replacing flake8 + black)?
33. A) pylint
34. B) isort
35. C) autopep8
36. D) ruff (*)
37. Explanation: ruff (Astral, Rust) is 10-100x faster than flake8 and includes a formatter (ruff format) replacing black; consolidates many tools.
38. Q6: What's the 12-factor principle for config?
39. A) Hardcode in source
40. B) Use a config.py file
41. C) Store in env vars (*)
42. D) Use a database table
43. Explanation: 12-factor: config (env-specific values like DB URLs, API keys) goes in env vars, keeping code portable across environments.
44. Q7: What does "build once, deploy many" mean?
45. A) Same image to staging and prod; only env vars differ (*)
46. B) Build per environment
47. C) Build only in production
48. D) Build only in development
49. Explanation: Building per environment creates drift; build one image, deploy it everywhere with env vars differing — eliminates build-time variance.
50. Q8: Which GitHub Action sets up Python?
51. A) actions/python-install
52. B) actions/setup-python (*)
53. C) actions/py
54. D) actions/install-python
55. Explanation: actions/setup-python@v5 installs a Python version and caches pip; standard for Python CI workflows.
56. Q9: What's a rollback plan?
57. A) Reverting code changes
58. B) Manual redeploy
59. C) Disabling CI
60. D) Keeping the previous image to redeploy instantly if a new release fails (*)
61. Explanation: Keep the previous Docker image/version; if the new deploy fails health checks or has bugs, redeploy the previous image instantly.
62. Q10: When should pre-commit hooks run?
63. A) After CI
64. B) After deploy
65. C) On git commit (locally, before push) (*)
66. D) Only in production
67. Explanation: pre-commit runs hooks (ruff, mypy, etc.) on git commit, catching issues locally before they reach CI — faster feedback.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: What's the difference between CI and CD?
  options:
    - Same thing
    - CI is for libraries; CD is for apps
    - CI deploys; CD tests
    - CI runs tests on every push; CD auto-deploys after CI passes
  correctIndex: 3
  explanation: Continuous Integration = automated tests on every push/PR. Continuous Deployment/Delivery = automated deploy after CI passes.
- id: q2
  question: Which base image is recommended for production Python?
  options:
    - python:3.12 (full)
    - ubuntu:latest + apt install python
    - python:3.12-slim
    - alpine + pip
  correctIndex: 2
  explanation: python:3.12-slim is a smaller image (no build tools by default); alpine has issues with Python wheels (often forces source builds).
- id: q3
  question: Where should secrets live?
  options:
    - In environment variables / secrets manager (never in git)
    - In a committed .env file
    - Hardcoded in source
    - In pyproject.toml
  correctIndex: 0
  explanation: Secrets go in env vars (12-factor) or a secrets manager (Vault, AWS Secrets Manager, Doppler); never hardcode or commit them.
- id: q4
  question: What does a health check endpoint do?
  options:
    - Encrypts traffic
    - Platform polls it; non-200 triggers restart
    - Authenticates users
    - Returns the app version
  correctIndex: 1
  explanation: /health returns 200 if alive; platforms (Render, Fly, k8s) poll it and restart the container on failure.
- id: q5
  question: Which tool lints and formats Python (replacing flake8 + black)?
  options:
    - pylint
    - isort
    - autopep8
    - ruff
  correctIndex: 3
  explanation: ruff (Astral, Rust) is 10-100x faster than flake8 and includes a formatter (ruff format) replacing black; consolidates many tools.
- id: q6
  question: What's the 12-factor principle for config?
  options:
    - Hardcode in source
    - Use a config.py file
    - Store in env vars
    - Use a database table
  correctIndex: 2
  explanation: "12-factor: config (env-specific values like DB URLs, API keys) goes in env vars, keeping code portable across environments."
- id: q7
  question: What does "build once, deploy many" mean?
  options:
    - Same image to staging and prod; only env vars differ
    - Build per environment
    - Build only in production
    - Build only in development
  correctIndex: 0
  explanation: Building per environment creates drift; build one image, deploy it everywhere with env vars differing — eliminates build-time variance.
- id: q8
  question: Which GitHub Action sets up Python?
  options:
    - actions/python-install
    - actions/setup-python
    - actions/py
    - actions/install-python
  correctIndex: 1
  explanation: actions/setup-python@v5 installs a Python version and caches pip; standard for Python CI workflows.
- id: q9
  question: What's a rollback plan?
  options:
    - Reverting code changes
    - Manual redeploy
    - Disabling CI
    - Keeping the previous image to redeploy instantly if a new release fails
  correctIndex: 3
  explanation: Keep the previous Docker image/version; if the new deploy fails health checks or has bugs, redeploy the previous image instantly.
- id: q10
  question: When should pre-commit hooks run?
  options:
    - After CI
    - After deploy
    - On git commit (locally, before push)
    - Only in production
  correctIndex: 2
  explanation: pre-commit runs hooks (ruff, mypy, etc.) on git commit, catching issues locally before they reach CI — faster feedback.
```

