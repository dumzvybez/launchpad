---
slug: javascript-deployment-ci-cd-capstone-prep
id: javascript-20
track: javascript
order: 20
title: Deployment, CI/CD, and Capstone Prep
description: Ship JavaScript to production — set up CI/CD, deploy static and server-rendered apps, monitor errors, and prepare for the capstone project.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=16400s
whyItMatters: Ship JavaScript to production — set up CI/CD, deploy static and server-rendered apps, monitor errors, and prepare for the capstone project.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Deployment, CI/CD, and Capstone Prep

## Deployment, CI/CD, and Capstone Prep

### Why It Matters

Ship JavaScript to production — set up CI/CD, deploy static and server-rendered apps, monitor errors, and prepare for the capstone project.

Ship JavaScript to production — set up CI/CD, deploy static and server-rendered apps, monitor errors, and prepare for the capstone project.

### Prerequisites

- Stage 19: Tooling — Bundlers, Transpilers, Linters
- All prior stages (you'll need them for the capstone).

### Topics

- CI/CD with GitHub Actions: lint, test, build, deploy
- Deploying SPAs to Vercel, Netlify, Cloudflare Pages
- Deploying SSR to Render, Railway, Fly.io
- Environment variables and secrets management
- Error monitoring: Sentry, Datadog Browser RUM
- Analytics and Core Web Vitals field data
- Preview deploys and feature branches
- Rollbacks, blue/green deploys, and progressive rollouts

### Key Concepts

- CI runs on every push; deploy only after green build + tests
- Static hosts (Vercel, Netlify, CF Pages) auto-build from git and serve CDN-cached assets with immutability
- Server renderers (Node) need a process manager (PM2) or container (Docker) and a long-running process
- Environment variables are injected at build (VITE_*) or runtime (server-only); never commit secrets
- Preview deploys per PR let reviewers click-test changes before merge
- Rollback = redeploy previous build; immutable deploys make this trivial

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --coverage
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with: { name: dist, path: dist }
```
Caption: GitHub Actions workflow

### Common Pitfalls

- Committing secrets to git — rotate immediately; use env vars and secret managers (Vault, Doppler, GitHub secrets).
- Skipping tests in CI for "speed" — flaky tests slow you down more than they save; fix flakes, don't skip.
- No preview deploys — reviewers can't click-test; ship broken UI; enable previews per PR.
- Mutating deploys in place — makes rollbacks painful; deploy immutable builds and promote.
- No error monitoring in prod — you find out from Twitter; wire Sentry/Datadog from day one.

### Real-World Applications

- Vercel deploys every preview per PR for Next.js, Vue, and SvelteKit apps across millions of repos (Stripe, Hashicorp, Loom).
- Sentry is the standard JS error tracker — used by Disney, Cloudflare, GitHub, Airbnb to capture client-side errors.
- Cloudflare Pages and Workers deploy static + edge functions globally in seconds; used by Discord, Mozilla, and Shopify Hydrogen.
- GitHub itself uses GitHub Actions for its own CI/CD — every PR runs lint, test, and preview deploys before merge.

### Interview Questions

- 1. What's the difference between CI and CD? — CI integrates code (build + test on push); CD deploys automatically (or with one click) after a green build.
- 2. How do Vercel/Netlify deploy a static SPA? — They run your build command, host the dist folder on a CDN, and serve index.html for all routes (SPA fallback).
- 3. What's a preview deploy? — An isolated per-PR deployment that lets reviewers click-test changes before merge.
- 4. Why use environment variables instead of hardcoding? — Same code across dev/staging/prod; secrets stay out of git; values change without rebuild (for runtime vars).
- 5. How do you roll back a broken deploy? — Redeploy the previous immutable build (Vercel/Netlify one-click); for containers, swap the image tag.

### Mini Project

Build a CI/CD pipeline for the capstone prep: a Vite app that runs lint + tests + build on push, deploys a preview per PR to Vercel, and connects Sentry for error tracking. It outputs a live preview URL on every PR. Suggested approach:
  - Add a GitHub Actions workflow with lint, test, build, upload artifact
  - Connect the repo to Vercel; enable preview deploys per PR
  - Add a `VITE_SENTRY_DSN` env var and initialize Sentry in main.js
  - Add a status badge to README showing CI status
  - Tag a v1.0.0 release and trigger a production deploy on tag push

### Exercises

1. Write a GitHub Actions workflow that runs on push and PR with lint + test + build.
2. Deploy a Vite app to Vercel; verify the preview URL on a PR.
3. Add Sentry to a sample app; deliberately throw an error and verify it appears.
4. Set up a feature-branch workflow with required status checks before merge.
5. Trigger a production deploy on `git tag v*` using a workflow rule.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: CI typically runs:
9. A) Only on releases
10. B) On every push and PR — build, lint, test (*)
11. C) Once a year
12. D) Manually
13. Explanation: Continuous Integration runs the pipeline on every push/PR so broken code never merges.
14. Q2: Vercel/Netlify host static SPAs by:
15. A) Running your build, then serving dist on a CDN with SPA fallback (*)
16. B) Compiling to WebAssembly
17. C) Replacing npm
18. D) Using a database
19. Explanation: They run `npm run build`, host the dist/ folder on a CDN, and serve index.html for all routes (SPA fallback).
20. Q3: A preview deploy is:
21. A) A staging environment per PR (*)
22. B) The production deploy
23. C) A local server
24. D) A test runner
25. Explanation: Each PR gets its own isolated deploy so reviewers can click-test changes before merging.
26. Q4: `VITE_API_URL` is exposed:
27. A) At runtime on the server
28. B) At build time to the client (*)
29. C) Never
30. D) Only in Node
31. Explanation: Vite inlines VITE_* env vars at build time into the client bundle; never put secrets here.
32. Q5: Rollback in an immutable deploy system is:
33. A) Impossible
34. B) Redeploy the previous build/tag (*)
35. C) Manually editing prod files
36. D) Dropping the database
37. Explanation: Each deploy is an immutable build; rolling back means pointing prod at the previous build artifact.
38. Q6: Sentry is used for:
39. A) Bundling
40. B) Error monitoring in production (*)
41. C) Linting
42. D) Type checking
43. Explanation: Sentry captures client and server errors in production, with stack traces via source maps.
44. Q7: `npm ci` in CI:
45. A) Interactive install
46. B) Reproducible install from the lockfile (*)
47. C) Installs CI tools only
48. D) Publishes the package
49. Explanation: ci removes node_modules and installs exactly per the lockfile — reproducible and faster in CI.
50. Q8: Feature branches + required status checks:
51. A) Slow you down uselessly
52. B) Block merges until CI passes (*)
53. C) Replace code review
54. D) Are deprecated
55. Explanation: GitHub branch protection rules can require passing CI before merge, preventing broken code on main.
56. Q9: Secrets should be stored:
57. A) In source code
58. B) In environment variables / secret managers (*)
59. C) In the README
60. D) In localStorage
61. Explanation: Never commit secrets; use env vars, GitHub secrets, or tools like Doppler/Vault to inject them at build/runtime.
62. Q10: Production deploys should be triggered by:
63. A) Editing prod files directly
64. B) Promoting a verified build (often on tag or merge to main) (*)
65. C) Randomly
66. D) Every keystroke
67. Explanation: Deploy only verified builds (CI green, preview approved), typically on merge to main or version tag.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: "CI typically runs:"
  options:
    - Only on releases
    - On every push and PR — build, lint, test
    - Once a year
    - Manually
  correctIndex: 1
  explanation: Continuous Integration runs the pipeline on every push/PR so broken code never merges.
- id: q2
  question: "Vercel/Netlify host static SPAs by:"
  options:
    - Running your build, then serving dist on a CDN with SPA fallback
    - Compiling to WebAssembly
    - Replacing npm
    - Using a database
  correctIndex: 0
  explanation: They run `npm run build`, host the dist/ folder on a CDN, and serve index.html for all routes (SPA fallback).
- id: q3
  question: "A preview deploy is:"
  options:
    - A staging environment per PR
    - The production deploy
    - A local server
    - A test runner
  correctIndex: 0
  explanation: Each PR gets its own isolated deploy so reviewers can click-test changes before merging.
- id: q4
  question: "`VITE_API_URL` is exposed:"
  options:
    - At runtime on the server
    - At build time to the client
    - Never
    - Only in Node
  correctIndex: 1
  explanation: Vite inlines VITE_* env vars at build time into the client bundle; never put secrets here.
- id: q5
  question: "Rollback in an immutable deploy system is:"
  options:
    - Impossible
    - Redeploy the previous build/tag
    - Manually editing prod files
    - Dropping the database
  correctIndex: 1
  explanation: Each deploy is an immutable build; rolling back means pointing prod at the previous build artifact.
- id: q6
  question: "Sentry is used for:"
  options:
    - Bundling
    - Error monitoring in production
    - Linting
    - Type checking
  correctIndex: 1
  explanation: Sentry captures client and server errors in production, with stack traces via source maps.
- id: q7
  question: "`npm ci` in CI:"
  options:
    - Interactive install
    - Reproducible install from the lockfile
    - Installs CI tools only
    - Publishes the package
  correctIndex: 1
  explanation: ci removes node_modules and installs exactly per the lockfile — reproducible and faster in CI.
- id: q8
  question: "Feature branches + required status checks:"
  options:
    - Slow you down uselessly
    - Block merges until CI passes
    - Replace code review
    - Are deprecated
  correctIndex: 1
  explanation: GitHub branch protection rules can require passing CI before merge, preventing broken code on main.
- id: q9
  question: "Secrets should be stored:"
  options:
    - In source code
    - In environment variables / secret managers
    - In the README
    - In localStorage
  correctIndex: 1
  explanation: Never commit secrets; use env vars, GitHub secrets, or tools like Doppler/Vault to inject them at build/runtime.
- id: q10
  question: "Production deploys should be triggered by:"
  options:
    - Editing prod files directly
    - Promoting a verified build (often on tag or merge to main)
    - Randomly
    - Every keystroke
  correctIndex: 1
  explanation: Deploy only verified builds (CI green, preview approved), typically on merge to main or version tag.
```

