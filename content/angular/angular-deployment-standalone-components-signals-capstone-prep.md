---
slug: angular-deployment-standalone-components-signals-capstone-prep
id: angular-20
track: angular
order: 20
title: Deployment, Standalone Components, Signals, and Capstone Prep
description: Recap modern Angular (standalone components, signals, new control flow), configure production builds, deploy to static hosts and Firebase, and prep the capstone project.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXjVelFtpuQ&t=540s
whyItMatters: Recap modern Angular (standalone components, signals, new control flow), configure production builds, deploy to static hosts and Firebase, and prep the capstone project.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Deployment, Standalone Components, Signals, and Capstone Prep

## Deployment, Standalone Components, Signals, and Capstone Prep

### Why It Matters

Recap modern Angular (standalone components, signals, new control flow), configure production builds, deploy to static hosts and Firebase, and prep the capstone project.

Recap modern Angular (standalone components, signals, new control flow), configure production builds, deploy to static hosts and Firebase, and prep the capstone project.

### Prerequisites

- All previous stages — this is the integration and deployment stage.
- A working Angular 17+ app (the exercises from Stages 1-19 are a good base).

### Topics

- Recap: standalone components, signals, `@if`/`@for`/`@switch`, functional providers
- `provideZonelessChangeDetection()` migration (Angular 18+)
- Production builds: `ng build --configuration production` and what it does (AOT, minify, tree-shake, budgets)
- `angular.json` build optimizations: `optimization`, `sourceMap`, `localize`, `prerender`
- Deploying to Firebase Hosting (`ng add @angular/fire`)
- Deploying to Vercel / Netlify / GitHub Pages with SPA fallback rewrites
- SSR with `@angular/ssr` for SEO and first-paint
- Capstone project scope and architecture preview

### Key Concepts

- The production build runs AOT compilation, minification, tree-shaking, and bundle budgets
- Static-host deploys need a SPA fallback (all 404s → `index.html`) so deep links work
- `@angular/fire` provides Firebase Hosting, Auth, Firestore, and Cloud Functions integration
- `provideZonelessChangeDetection()` is the future — smaller bundle, more predictable CD, but requires signals-only state
- SSR (`@angular/ssr`) renders the app on the server for SEO and faster first paint; hydration reuses the DOM

```json
// angular.json (excerpt)
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "budgets": [
                { "type": "initial", "maximumWarning": "500kb", "maximumError": "1mb" }
              ]
            }
          }
        }
      }
    }
  }
}
```
Caption: Production build configuration

### Common Pitfalls

- Deploying without SPA fallback — deep links return 404 on static hosts; configure rewrites (Vercel: `vercel.json`; Netlify: `_redirects`; Firebase: `firebase.json`).
- Forgetting `--configuration production` — `ng build` defaults to development (unminified, no AOT, larger); always specify production.
- Enabling `provideZonelessChangeDetection()` without migrating all state to signals — third-party libs that rely on zone.js (e.g., Material date pickers using setTimeout) can break; test thoroughly.
- Deploying without cache headers — static assets in `dist/` have hashed names but `index.html` should never cache; set `Cache-Control: no-cache` for `index.html` and `immutable, max-age=31536000` for hashed assets.
- Adding SSR and breaking client-only features (`window`, `document`) — guard with `isPlatformBrowser(platformId)` or use `afterNextRender` for browser-only code.

### Real-World Applications

- Google Ads deploys Angular to internal Firebase Hosting with CDN edge caching; deep links work via SPA fallback rewrites.
- Microsoft Office Online uses Angular SSR for the marketing pages and CSR for the editor, optimizing SEO and first paint differently per surface.
- Upwork deploys to Vercel with `vercel.json` rewrites; preview deploys per PR via the Vercel GitHub integration.
- PayPal uses zoneless change detection on the new checkout flow, shrinking the bundle by ~30KB and improving INP.

### Interview Questions

- 1. What does `ng build --configuration production` do? — AOT compilation, minification, tree-shaking, source-map stripping, license extraction, and budget enforcement.
- 2. Why does a static-host deploy need a SPA fallback? — Without it, deep links (e.g., `/users/42`) return 404 because there's no real file at that path; rewrite all routes to `index.html`.
- 3. What's the benefit of `provideZonelessChangeDetection()`? — Removes zone.js (~30KB), CD fires only on signal changes or markForCheck, more predictable and faster.
- 4. What does `@angular/ssr` add? — Server-side rendering: `server.ts`, `main.server.ts`, and a `server` build output; hydration reuses the rendered DOM on the client.
- 5. How do you handle browser-only code in SSR? — Guard with `isPlatformBrowser(platformId)` or use `afterNextRender(() => { ... })` which only runs in the browser.

### Mini Project

Build a "Deployed Portfolio" app: A small Angular portfolio with a home, projects, and about page, deployed to Vercel with SPA fallback, hashed-asset caching, and a 30-day immutable cache. Suggested approach:
  - Build three lazy routes (`/`, `/projects`, `/about`)
  - Run `ng build --configuration production` and inspect `dist/`
  - Add `vercel.json` with SPA rewrites and asset Cache-Control headers
  - Connect the repo to Vercel and deploy on push to main
  - Verify deep links (e.g., `/projects/foo`) work after a hard reload

### Exercises

1. Run `ng build --configuration production` and inspect the size of each chunk in `dist/`.
2. Configure `vercel.json` with SPA fallback rewrites and deploy.
3. Add `provideZonelessChangeDetection()` to a small app and verify signals still drive re-renders.
4. Run `ng add @angular/ssr` and verify the server build produces `dist/<app>/server`.
5. Use `afterNextRender(() => { ... })` to run a browser-only effect (e.g., localStorage access) in an SSR app.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which CLI command produces a production-optimized build?
9. A) ng build
10. B) ng serve --prod (deprecated)
11. C) ng compile --release
12. D) ng build --configuration production (*)
13. Explanation: `ng build --configuration production` runs AOT, minification, tree-shaking, source-map stripping, license extraction, and budget enforcement.
14. Q2: Why does a static-host deploy need a SPA fallback rewrite?
15. A) Deep links (e.g., /users/42) return 404 without one — there's no real file at that path (*)
16. B) To enable HTTPS
17. C) To compress assets
18. D) To enable SSR
19. Explanation: Static hosts serve files; deep links to client-side routes have no file, so all unknown paths must rewrite to `index.html`.
20. Q3: Which provider removes zone.js from the bundle?
21. A) withZoneless
22. B) provideZonelessChangeDetection (*)
23. C) provideNoZone
24. D) disableZone()
25. Explanation: `provideZonelessChangeDetection()` (Angular 18+) removes zone.js (~30KB); CD fires only on signal changes or `markForCheck`.
26. Q4: Which package adds server-side rendering to an Angular app?
27. A) @angular/universal
28. B) @angular/server
29. C) @angular/ssr (*)
30. D) @angular/platform-server
31. Explanation: `ng add @angular/ssr` adds `server.ts`, `main.server.ts`, and a server build target; `@angular/universal` was the older name (now `@angular/ssr`).
32. Q5: How do you guard browser-only code (localStorage, window) in SSR?
33. A) Wrap in try/catch only
34. B) Use document directly
35. C) Browser-only code is fine in SSR
36. D) isPlatformBrowser(platformId) or afterNextRender(...) (*)
37. Explanation: SSR runs on Node where `window`/`document`/`localStorage` are undefined; guard with `isPlatformBrowser` or use `afterNextRender` (browser-only lifecycle hook).
38. Q6: Which Vercel config file sets SPA rewrites and cache headers?
39. A) vercel.json (*)
40. B) vercel.config.js
41. C) .vercelrc
42. D) angular.json
43. Explanation: `vercel.json` configures rewrites (SPA fallback), headers (cache-control), and other Vercel project settings; deploy via CLI (`vercel`) or GitHub integration.
44. Q7: Which Cache-Control header should be set on hashed JS bundles?
45. A) no-cache
46. B) public, max-age=31536000, immutable (*)
47. C) no-store
48. D) max-age=60
49. Explanation: Hashed filenames change on content change, so they can be cached aggressively (1 year, immutable); never set this for `index.html` (use no-cache).
50. Q8: Which Cache-Control should be set on `index.html`?
51. A) immutable, max-age=31536000
52. B) no-store
53. C) no-cache (*)
54. D) max-age=31536000
55. Explanation: `index.html` references the latest hashed bundles; it must always revalidate to pick up new deploys — use `no-cache` (revalidate, don't store).
56. Q9: Which Angular 18+ provider schedules CD only when signals change or markForCheck is called?
57. A) withOnPushMode
58. B) provideSignalOnlyCD
59. C) provideManualCD
60. D) provideZonelessChangeDetection (*)
61. Explanation: `provideZonelessChangeDetection()` opts out of zone.js; CD is scheduled when signals change or `markForCheck` is called — smaller bundle, more predictable.
62. Q10: Which Firebase package adds Hosting, Auth, and Firestore integration to Angular?
63. A) @angular/fire (*)
64. B) firebase-angular
65. C) @firebase/angular
66. D) AngularFire2
67. Explanation: `@angular/fire` (formerly AngularFire 2) is the official Angular Firebase integration; `ng add @angular/fire` scaffolds Hosting, Auth, Firestore, and Functions.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: Which CLI command produces a production-optimized build?
  options:
    - ng build
    - ng serve --prod (deprecated)
    - ng compile --release
    - ng build --configuration production
  correctIndex: 3
  explanation: "`ng build --configuration production` runs AOT, minification, tree-shaking, source-map stripping, license extraction, and budget enforcement."
- id: q2
  question: Why does a static-host deploy need a SPA fallback rewrite?
  options:
    - Deep links (e.g., /users/42) return 404 without one — there's no real file at that path
    - To enable HTTPS
    - To compress assets
    - To enable SSR
  correctIndex: 0
  explanation: Static hosts serve files; deep links to client-side routes have no file, so all unknown paths must rewrite to `index.html`.
- id: q3
  question: Which provider removes zone.js from the bundle?
  options:
    - withZoneless
    - provideZonelessChangeDetection
    - provideNoZone
    - disableZone()
    - ; CD fires only on signal changes or `markForCheck`.
  correctIndex: 1
  explanation: "`provideZonelessChangeDetection()` (Angular 18+) removes zone.js (~30KB); CD fires only on signal changes or `markForCheck`."
- id: q4
  question: Which package adds server-side rendering to an Angular app?
  options:
    - "@angular/universal"
    - "@angular/server"
    - "@angular/ssr"
    - "@angular/platform-server"
  correctIndex: 2
  explanation: "`ng add @angular/ssr` adds `server.ts`, `main.server.ts`, and a server build target; `@angular/universal` was the older name (now `@angular/ssr`)."
- id: q5
  question: How do you guard browser-only code (localStorage, window) in SSR?
  options:
    - Wrap in try/catch only
    - Use document directly
    - Browser-only code is fine in SSR
    - isPlatformBrowser(platformId) or afterNextRender(...)
  correctIndex: 3
  explanation: SSR runs on Node where `window`/`document`/`localStorage` are undefined; guard with `isPlatformBrowser` or use `afterNextRender` (browser-only lifecycle hook).
- id: q6
  question: Which Vercel config file sets SPA rewrites and cache headers?
  options:
    - vercel.json
    - vercel.config.js
    - .vercelrc
    - angular.json
  correctIndex: 0
  explanation: "`vercel.json` configures rewrites (SPA fallback), headers (cache-control), and other Vercel project settings; deploy via CLI (`vercel`) or GitHub integration."
- id: q7
  question: Which Cache-Control header should be set on hashed JS bundles?
  options:
    - no-cache
    - public, max-age=31536000, immutable
    - no-store
    - max-age=60
  correctIndex: 1
  explanation: Hashed filenames change on content change, so they can be cached aggressively (1 year, immutable); never set this for `index.html` (use no-cache).
- id: q8
  question: Which Cache-Control should be set on `index.html`?
  options:
    - immutable, max-age=31536000
    - no-store
    - no-cache
    - max-age=31536000
  correctIndex: 2
  explanation: "`index.html` references the latest hashed bundles; it must always revalidate to pick up new deploys — use `no-cache` (revalidate, don't store)."
- id: q9
  question: Which Angular 18+ provider schedules CD only when signals change or markForCheck is called?
  options:
    - withOnPushMode
    - provideSignalOnlyCD
    - provideManualCD
    - provideZonelessChangeDetection
  correctIndex: 3
  explanation: "`provideZonelessChangeDetection()` opts out of zone.js; CD is scheduled when signals change or `markForCheck` is called — smaller bundle, more predictable."
- id: q10
  question: Which Firebase package adds Hosting, Auth, and Firestore integration to Angular?
  options:
    - "@angular/fire"
    - firebase-angular
    - "@firebase/angular"
    - AngularFire2
  correctIndex: 0
  explanation: "`@angular/fire` (formerly AngularFire 2) is the official Angular Firebase integration; `ng add @angular/fire` scaffolds Hosting, Auth, Firestore, and Functions."
```

