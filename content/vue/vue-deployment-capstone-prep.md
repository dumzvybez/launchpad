---
slug: vue-deployment-capstone-prep
id: vue-20
track: vue
order: 20
title: Deployment and Capstone Prep
description: Build, optimize, and deploy a Vue 3 app to Vercel/Netlify/static hosts; configure environment variables, bundle analysis, lighthouse, and CI.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KM1U6DqZf8M&t=540s
whyItMatters: Build, optimize, and deploy a Vue 3 app to Vercel/Netlify/static hosts; configure environment variables, bundle analysis, lighthouse, and CI.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Deployment and Capstone Prep

## Deployment and Capstone Prep

### Why It Matters

Build, optimize, and deploy a Vue 3 app to Vercel/Netlify/static hosts; configure environment variables, bundle analysis, lighthouse, and CI.

Build, optimize, and deploy a Vue 3 app to Vercel/Netlify/static hosts; configure environment variables, bundle analysis, lighthouse, and CI.

### Prerequisites

- Stage 1-19: All previous Vue topics.
- A GitHub account and a deploy target (Vercel, Netlify, or similar).

### Topics

- `npm run build` output (dist/) and what's in it
- SPA hosting vs SSR hosting (Nuxt) vs SSG
- Deploying to Vercel, Netlify, GitHub Pages, Cloudflare Pages
- Environment variables: `VITE_API_URL` and `import.meta.env`
- Code splitting and dynamic imports for performance
- Bundle analysis with `rollup-plugin-visualizer`
- Lighthouse CI for performance budgets
- CI/CD with GitHub Actions (lint, test, build, deploy)

### Key Concepts

- `npm run build` produces static assets in `dist/` that can be served from any static host (with a fallback to `index.html` for the SPA router)
- `VITE_*` env vars are exposed to the client via `import.meta.env.VITE_X`; non-prefixed vars are server-only
- Dynamic `() => import()` enables route-level and component-level code splitting
- Lighthouse CI can fail builds below a performance/accessibility threshold
- Vercel/Netlify auto-deploy on git push and provide preview URLs per PR

```bash
npm run build       # produces dist/
npm run preview     # serve the production build locally (Vite preview)
```
Caption: Build and preview

### Common Pitfalls

- Forgetting the SPA fallback on static hosts — deep links return 404; add a rewrite to `index.html` (Netlify `_redirects`, Vercel `vercel.json`, Nginx try_files).
- Committing `.env.local` secrets — never commit secrets; use the host's env var UI for production values.
- Using non-`VITE_`-prefixed env vars in client code — only `VITE_*` vars are exposed to the client; others are silently undefined.
- Shipping source maps to production — leaks source code; set `build.sourcemap: false` or use hidden source maps for Sentry.
- Skipping `npm run build` locally before deploying — small TypeScript or import errors slip past dev (HMR is forgiving); always build locally first.

### Real-World Applications

- GitLab's frontend is built and tested in GitLab CI itself; the same pipeline lints, types, tests, builds, and deploys per merge request.
- Alibaba's Element Plus docs site is auto-deployed to Vercel on every PR via GitHub Actions.
- Behance's Vue micro-frontends are deployed independently via CI to a CDN with per-PR preview URLs.
- Adobe Portfolio uses Lighthouse CI in GitHub Actions to enforce performance budgets on every deploy.

### Interview Questions

- 1. What does `npm run build` produce? — Static assets in `dist/` (JS, CSS, images, index.html) ready to serve from any static host.
- 2. How are env vars exposed to the client in Vite? — Only `VITE_*`-prefixed vars are exposed via `import.meta.env.VITE_X`; others are server-only.
- 3. What's needed for SPA routing on a static host? — A fallback rewrite to `index.html` for unknown paths (so deep links don't 404).
- 4. How do you code-split a Vue app? — Use dynamic imports for routes (`() => import("./X.vue")`) and for heavy components; the bundler splits them into separate chunks.
- 5. What's Lighthouse CI for? — Running Lighthouse audits in CI and failing builds below a performance/accessibility/SEO threshold.

### Mini Project

Build a "Deployment Pipeline": Take any previous mini-project, add lint/typecheck/test/build to a GitHub Actions workflow, add a `rollup-plugin-visualizer` report, deploy to Vercel, and verify the live URL works. Suggested approach:
  - Add `npm run lint` (ESLint), `npm run typecheck` (`vue-tsc --noEmit`), `npm run test` (Vitest) scripts
  - Write `.github/workflows/ci.yml` that runs all four on push/PR
  - Add `rollup-plugin-visualizer` and inspect `dist/stats.html` for chunk sizes
  - Connect the repo to Vercel; set the `VITE_API_URL` env var in the Vercel UI
  - Verify the preview deploy URL works end-to-end

### Exercises

1. Run `npm run build` and `npm run preview`; inspect the `dist/` output.
2. Add a `VITE_API_URL` env var and read it via `import.meta.env.VITE_API_URL`.
3. Add `rollup-plugin-visualizer` and inspect the bundle treemap.
4. Write a GitHub Actions workflow that runs lint, typecheck, test, and build.
5. Deploy to Vercel (or Netlify) and verify the live URL loads.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `npm run build` produce for a Vite + Vue SPA?
9. A) A server bundle
10. B) A Docker image
11. C) A zip of the source
12. D) Static assets in dist/ (HTML, JS, CSS, images) (*)
13. Explanation: `npm run build` outputs static assets in `dist/` ready to serve from any static host (with a fallback for SPA routing).
14. Q2: Which env vars are exposed to the client in Vite?
15. A) Only VITE_-prefixed vars via import.meta.env.VITE_X (*)
16. B) All env vars
17. C) NODE_ENV only
18. D) None
19. Explanation: Only `VITE_*`-prefixed vars are exposed to client code via `import.meta.env`; others are server-only and silently undefined on the client.
20. Q3: What's required on a static host for SPA routing to work?
21. A) A custom domain
22. B) A fallback rewrite to index.html for unknown paths (*)
23. C) HTTPS
24. D) A CDN
25. Explanation: SPA routers use history mode; without a fallback to `index.html`, deep links return 404. Configure redirects on Netlify/Vercel/Nginx.
26. Q4: How do you code-split a route in Vue?
27. A) component: lazy("./X.vue")
28. B) chunk: true
29. C) component: () => import("./X.vue") (*)
30. D) async: true
31. Explanation: Dynamic import `() => import("./X.vue")` lets the bundler code-split the component into a separate chunk loaded on navigation.
32. Q5: What's Lighthouse CI for?
33. A) Unit testing
34. B) Bundle analysis
35. C) Type checking
36. D) Running Lighthouse audits in CI and failing builds below thresholds (*)
37. Explanation: Lighthouse CI runs performance/accessibility/SEO audits on every build and can fail builds that fall below a configured threshold.
38. Q6: Which tool visualizes a Vite bundle?
39. A) rollup-plugin-visualizer (*)
40. B) webpack-bundle-analyzer
41. C) source-map-explorer only
42. D) bundle-stats-cli
43. Explanation: `rollup-plugin-visualizer` (Vite uses Rollup) generates a treemap of the bundle in `dist/stats.html` for inspecting chunk sizes.
44. Q7: Which command deploys to Vercel from the CLI?
45. A) vercel deploy
46. B) vercel (*)
47. C) vc push
48. D) deploy vercel
49. Explanation: `vercel` (the CLI) deploys a preview build of the current directory; `vercel --prod` deploys to production.
50. Q8: What's a common mistake with env vars?
51. A) Using too many
52. B) Caching them
53. C) Committing .env.local secrets or using non-VITE_-prefixed vars in client code (*)
54. D) Using strings
55. Explanation: Never commit secrets; and remember only `VITE_*`-prefixed vars are exposed to the client — others are undefined in browser code.
56. Q9: Which script type-checks a Vue + TS project?
57. A) tsc --check
58. B) eslint --typecheck
59. C) vitest typecheck
60. D) vue-tsc --noEmit (*)
61. Explanation: `vue-tsc --noEmit` runs the Vue-aware TypeScript compiler without emitting JS; it type-checks .vue and .ts files.
62. Q10: What does `npm run preview` do?
63. A) Serves the production build (dist/) locally to verify it works (*)
64. B) Starts the dev server
65. C) Deploys a preview to the cloud
66. D) Generates a preview image
67. Explanation: `vite preview` serves the production build from `dist/` locally so you can verify the built app behaves correctly before deploying.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: What does `npm run build` produce for a Vite + Vue SPA?
  options:
    - A server bundle
    - A Docker image
    - A zip of the source
    - Static assets in dist/ (HTML, JS, CSS, images)
  correctIndex: 3
  explanation: "`npm run build` outputs static assets in `dist/` ready to serve from any static host (with a fallback for SPA routing)."
- id: q2
  question: Which env vars are exposed to the client in Vite?
  options:
    - Only VITE_-prefixed vars via import.meta.env.VITE_X
    - All env vars
    - NODE_ENV only
    - None
  correctIndex: 0
  explanation: Only `VITE_*`-prefixed vars are exposed to client code via `import.meta.env`; others are server-only and silently undefined on the client.
- id: q3
  question: What's required on a static host for SPA routing to work?
  options:
    - A custom domain
    - A fallback rewrite to index.html for unknown paths
    - HTTPS
    - A CDN
  correctIndex: 1
  explanation: SPA routers use history mode; without a fallback to `index.html`, deep links return 404. Configure redirects on Netlify/Vercel/Nginx.
- id: q4
  question: How do you code-split a route in Vue?
  options:
    - 'component: lazy("./X.vue")'
    - "chunk: true"
    - 'component: () => import("./X.vue")'
    - "async: true"
  correctIndex: 2
  explanation: Dynamic import `() => import("./X.vue")` lets the bundler code-split the component into a separate chunk loaded on navigation.
- id: q5
  question: What's Lighthouse CI for?
  options:
    - Unit testing
    - Bundle analysis
    - Type checking
    - Running Lighthouse audits in CI and failing builds below thresholds
  correctIndex: 3
  explanation: Lighthouse CI runs performance/accessibility/SEO audits on every build and can fail builds that fall below a configured threshold.
- id: q6
  question: Which tool visualizes a Vite bundle?
  options:
    - rollup-plugin-visualizer
    - webpack-bundle-analyzer
    - source-map-explorer only
    - bundle-stats-cli
  correctIndex: 0
  explanation: "`rollup-plugin-visualizer` (Vite uses Rollup) generates a treemap of the bundle in `dist/stats.html` for inspecting chunk sizes."
- id: q7
  question: Which command deploys to Vercel from the CLI?
  options:
    - vercel deploy
    - vercel
    - vc push
    - deploy vercel
    - deploys a preview build of the current directory; `vercel --prod` deploys to production.
  correctIndex: 1
  explanation: "`vercel` (the CLI) deploys a preview build of the current directory; `vercel --prod` deploys to production."
- id: q8
  question: What's a common mistake with env vars?
  options:
    - Using too many
    - Caching them
    - Committing .env.local secrets or using non-VITE_-prefixed vars in client code
    - Using strings
  correctIndex: 2
  explanation: Never commit secrets; and remember only `VITE_*`-prefixed vars are exposed to the client — others are undefined in browser code.
- id: q9
  question: Which script type-checks a Vue + TS project?
  options:
    - tsc --check
    - eslint --typecheck
    - vitest typecheck
    - vue-tsc --noEmit
  correctIndex: 3
  explanation: "`vue-tsc --noEmit` runs the Vue-aware TypeScript compiler without emitting JS; it type-checks .vue and .ts files."
- id: q10
  question: What does `npm run preview` do?
  options:
    - Serves the production build (dist/) locally to verify it works
    - Starts the dev server
    - Deploys a preview to the cloud
    - Generates a preview image
  correctIndex: 0
  explanation: "`vite preview` serves the production build from `dist/` locally so you can verify the built app behaves correctly before deploying."
```

