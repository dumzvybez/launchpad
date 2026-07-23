---
slug: react-production-patterns-deployment-capstone-prep
id: react-20
track: react
order: 20
title: Production Patterns, Deployment, and Capstone Prep
description: "Ship a React app to production: bundle analysis, code splitting, environment variables, observability, accessibility, and a CI/CD pipeline that auto-deploys on every merge to main."
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=1140s
whyItMatters: "Ship a React app to production: bundle analysis, code splitting, environment variables, observability, accessibility, and a CI/CD pipeline that auto-deploys on every merge to main."
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Production Patterns, Deployment, and Capstone Prep

## Production Patterns, Deployment, and Capstone Prep

### Why It Matters

Ship a React app to production: bundle analysis, code splitting, environment variables, observability, accessibility, and a CI/CD pipeline that auto-deploys on every merge to main.

Ship a React app to production: bundle analysis, code splitting, environment variables, observability, accessibility, and a CI/CD pipeline that auto-deploys on every merge to main.

### Prerequisites

- Stage 19: Server Components and Next.js Integration.
- All previous stages.
- CI/CD basics, environment variables, web hosting.

### Topics

- Build optimization: tree-shaking, minification, source maps
- Bundle analysis with `rollup-plugin-visualizer` / `@next/bundle-analyzer`
- Code splitting via dynamic `import()` and route-level chunks
- Environment variables: `VITE_*` (Vite) and `NEXT_PUBLIC_*` (Next.js)
- Observability: Sentry for errors, LogRocket/PostHog for session replay
- Web Vitals: LCP, FID/INP, CLS, and `web-vitals` library
- Accessibility audits with axe-core and Lighthouse
- CI/CD with GitHub Actions and deploy to Vercel/Netlify/Fly.io

### Key Concepts

- Production builds minify, tree-shake, and split chunks; analyze regularly to catch bloat
- Never commit secrets — use env vars with `VITE_`/`NEXT_PUBLIC_` prefixes for client exposure
- Monitor errors with Sentry, performance with Web Vitals, and behavior with session replay
- Accessibility is not optional — automated audits catch ~30% of issues; manual testing catches the rest
- A CI/CD pipeline runs lint, typecheck, tests, build, and deploy on every PR; deploy previews on every push

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    visualizer({
      filename: "bundle-stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
        },
      },
    },
  },
});
```
Caption: Bundle analyzer setup (Vite)

### Common Pitfalls

- Shipping source maps publicly — exposes your source code; either don't deploy them, or upload them privately to Sentry.
- Bundling everything into one chunk — kills initial load; split routes and heavy libraries with dynamic `import()`.
- Hardcoding API URLs and secrets — use env vars with the right prefix (`VITE_`, `NEXT_PUBLIC_`) so they're injected at build time and rotated without code changes.
- Ignoring Web Vitals — LCP > 2.5s or CLS > 0.1 hurts SEO and UX; monitor and fix regressions.
- Skipping accessibility audits — automated tools (axe, Lighthouse) catch ~30%; pair with manual screen-reader testing.

### Real-World Applications

- Vercel ships a CI/CD pipeline that runs typecheck, lint, test, and build on every PR, with auto-deploy previews per branch.
- Sentry's own dashboard uses Sentry for error tracking, PostHog for product analytics, and `web-vitals` for performance.
- Linear's web client ships weekly with feature flags (LaunchDarkly) gating new UI for gradual rollout.
- Airbnb's frontend deploys dozens of times per day with bundle-size budgets enforced in CI to prevent bloat.

### Interview Questions

- 1. How do you split a React bundle? — Route-level code splitting with `React.lazy` + `Suspense`, and manual chunks for stable heavy libraries (react, router) in the bundler config.
- 2. What are Web Vitals and why care? — LCP, INP (was FID), and CLS are Google's core user-experience metrics; they affect SEO rankings and real UX.
- 3. How do env vars work in Vite/Next.js? — Only vars prefixed with `VITE_` (Vite) or `NEXT_PUBLIC_` (Next.js) are exposed to the client; others are server-only.
- 4. Why upload source maps to Sentry privately? — Public source maps expose your source code; Sentry accepts private uploads so it can un-minify stack traces without leaking source.
- 5. What's in a React CI pipeline? — Lint, typecheck (`tsc --noEmit`), unit/integration tests with coverage, build, and deploy previews; bundle-size budget checks are a bonus.

### Mini Project

Build a "Production-Ready React Starter": A Vite + React + TS app preconfigured with ESLint, Prettier, Vitest + RTL, Playwright, GitHub Actions CI, Sentry error reporting, Web Vitals reporting, bundle analysis, and a Vercel deploy config. Document the bundle size, Lighthouse score, and CI runtime. Suggested approach:
  - Scaffold with Vite, then add ESLint + Prettier + typescript-eslint
  - Add Vitest + RTL with a sample component test
  - Add Playwright with one E2E
  - Write a GitHub Actions workflow with parallel jobs
  - Configure Sentry + `web-vitals` and document the Lighthouse score

### Exercises

1. Run a bundle analyzer and identify the three largest dependencies.
2. Split a heavy route with `React.lazy` + `Suspense` and measure the smaller initial bundle.
3. Add Sentry to a sample app and trigger an error to confirm it appears in the dashboard.
4. Add `web-vitals` reporting and capture LCP/INP/CLS for your app.
5. Write a GitHub Actions workflow with lint, typecheck, test, and build jobs.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which prefix exposes an env var to the client in Vite?
9. A) `CLIENT_`
10. B) `PUBLIC_`
11. C) `REACT_APP_`
12. D) `VITE_` (*)
13. Explanation: Vite exposes only env vars prefixed with `VITE_` to client code via `import.meta.env.VITE_X`; others are server-only and inaccessible client-side.
14. Q2: Which Web Vital measures perceived load speed?
15. A) LCP (Largest Contentful Paint) (*)
16. B) INP
17. C) CLS
18. D) TTFB
19. Explanation: LCP measures when the largest visible content element paints; Google's "good" threshold is ≤2.5s. INP measures interactivity, CLS measures layout shift.
20. Q3: Why avoid shipping public source maps?
21. A) They slow the page
22. B) They expose your original source code to anyone (*)
23. C) They break minification
24. D) They're deprecated
25. Explanation: Source maps let anyone reconstruct your original source from the minified bundle; upload them privately to Sentry instead of deploying them publicly.
26. Q4: Which library reports React errors with component stacks to a dashboard?
27. A) Lighthouse
28. B) PostCSS
29. C) Sentry (*)
30. D) Babel
31. Explanation: Sentry's React SDK captures errors with their React component stack, breadcrumbs, and (optionally) session replay, shipping them to a dashboard for triage.
32. Q5: Which is a good code-splitting strategy?
33. A) Bundle everything into one chunk for fewer requests
34. B) Inline all dependencies
35. C) Use `eval` to load code
36. D) Route-level splitting with `React.lazy` + `Suspense`, plus manual chunks for stable libs (*)
37. Explanation: Route-level splitting loads code on demand, shrinking the initial bundle; manual chunks for stable heavy libraries (react, router) improve caching.
38. Q6: What does `manualChunks` in the Vite/Rollup config do?
39. A) Splits specified dependencies into their own cached chunks (*)
40. B) Disables chunks
41. C) Minifies code
42. D) Generates source maps
43. Explanation: `manualChunks` lets you group stable dependencies (react, react-dom, router) into dedicated chunks that cache well across deploys.
44. Q7: Which metric replaced FID as a Core Web Vital in 2024?
45. A) LCP
46. B) INP (Interaction to Next Paint) (*)
47. C) CLS
48. D) TTFB
49. Explanation: INP replaced FID in March 2024 as the Core Web Vital for interactivity, measuring the latency of all interactions rather than just the first input.
50. Q8: Which tool audits accessibility and performance in CI?
51. A) ESLint
52. B) Prettier
53. C) axe-core / Lighthouse (*)
54. D) Vitest
55. Explanation: axe-core (a11y) and Lighthouse (a11y + perf + SEO) can run in CI; automated audits catch ~30% of a11y issues — pair with manual screen-reader testing.
56. Q9: What's a bundle-size budget in CI?
57. A) A financial budget
58. B) A list of dependencies
59. C) A minification setting
60. D) A threshold that fails the build if the bundle exceeds a configured size (*)
61. Explanation: Bundle-size budgets (e.g. `bundlewatch`, `size-limit`) fail CI if the bundle grows beyond a threshold, preventing accidental bloat from new dependencies.
62. Q10: Which is the recommended deploy model for React apps?
63. A) CI/CD auto-deploys main to production and PRs to preview URLs (*)
64. B) Manual upload via FTP
65. C) Copy-paste to a server
66. D) Email the build to ops
67. Explanation: Modern React deploys use CI/CD: main -> production, every PR -> a unique preview URL for review. Vercel, Netlify, and Fly.io all support this out of the box.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: Which prefix exposes an env var to the client in Vite?
  options:
    - "`CLIENT_`"
    - "`PUBLIC_`"
    - "`REACT_APP_`"
    - "`VITE_`"
  correctIndex: 3
  explanation: Vite exposes only env vars prefixed with `VITE_` to client code via `import.meta.env.VITE_X`; others are server-only and inaccessible client-side.
- id: q2
  question: Which Web Vital measures perceived load speed?
  options:
    - LCP (Largest Contentful Paint)
    - INP
    - CLS
    - TTFB
  correctIndex: 0
  explanation: LCP measures when the largest visible content element paints; Google's "good" threshold is ≤2.5s. INP measures interactivity, CLS measures layout shift.
- id: q3
  question: Why avoid shipping public source maps?
  options:
    - They slow the page
    - They expose your original source code to anyone
    - They break minification
    - They're deprecated
  correctIndex: 1
  explanation: Source maps let anyone reconstruct your original source from the minified bundle; upload them privately to Sentry instead of deploying them publicly.
- id: q4
  question: Which library reports React errors with component stacks to a dashboard?
  options:
    - Lighthouse
    - PostCSS
    - Sentry
    - Babel
  correctIndex: 2
  explanation: Sentry's React SDK captures errors with their React component stack, breadcrumbs, and (optionally) session replay, shipping them to a dashboard for triage.
- id: q5
  question: Which is a good code-splitting strategy?
  options:
    - Bundle everything into one chunk for fewer requests
    - Inline all dependencies
    - Use `eval` to load code
    - Route-level splitting with `React.lazy` + `Suspense`, plus manual chunks for stable libs
  correctIndex: 3
  explanation: Route-level splitting loads code on demand, shrinking the initial bundle; manual chunks for stable heavy libraries (react, router) improve caching.
- id: q6
  question: What does `manualChunks` in the Vite/Rollup config do?
  options:
    - Splits specified dependencies into their own cached chunks
    - Disables chunks
    - Minifies code
    - Generates source maps
  correctIndex: 0
  explanation: "`manualChunks` lets you group stable dependencies (react, react-dom, router) into dedicated chunks that cache well across deploys."
- id: q7
  question: Which metric replaced FID as a Core Web Vital in 2024?
  options:
    - LCP
    - INP (Interaction to Next Paint)
    - CLS
    - TTFB
  correctIndex: 1
  explanation: INP replaced FID in March 2024 as the Core Web Vital for interactivity, measuring the latency of all interactions rather than just the first input.
- id: q8
  question: Which tool audits accessibility and performance in CI?
  options:
    - ESLint
    - Prettier
    - axe-core / Lighthouse
    - Vitest
    - can run in CI; automated audits catch ~30% of a11y issues — pair with manual screen-reader testing.
  correctIndex: 2
  explanation: axe-core (a11y) and Lighthouse (a11y + perf + SEO) can run in CI; automated audits catch ~30% of a11y issues — pair with manual screen-reader testing.
- id: q9
  question: What's a bundle-size budget in CI?
  options:
    - A financial budget
    - A list of dependencies
    - A minification setting
    - A threshold that fails the build if the bundle exceeds a configured size
  correctIndex: 3
  explanation: Bundle-size budgets (e.g. `bundlewatch`, `size-limit`) fail CI if the bundle grows beyond a threshold, preventing accidental bloat from new dependencies.
- id: q10
  question: Which is the recommended deploy model for React apps?
  options:
    - CI/CD auto-deploys main to production and PRs to preview URLs
    - Manual upload via FTP
    - Copy-paste to a server
    - Email the build to ops
  correctIndex: 0
  explanation: "Modern React deploys use CI/CD: main -> production, every PR -> a unique preview URL for review. Vercel, Netlify, and Fly.io all support this out of the box."
```

