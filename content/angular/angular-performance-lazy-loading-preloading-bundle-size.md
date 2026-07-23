---
slug: angular-performance-lazy-loading-preloading-bundle-size
id: angular-19
track: angular
order: 19
title: Performance — Lazy Loading, Preloading, Bundle Size
description: Optimize Angular apps with lazy-loaded routes, preloading strategies, `trackBy` (or `track`), OnPush, bundle budgets, and tools to measure and shrink bundle size.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXjVelFtpuQ&t=480s
whyItMatters: Optimize Angular apps with lazy-loaded routes, preloading strategies, `trackBy` (or `track`), OnPush, bundle budgets, and tools to measure and shrink bundle size.
deepDiveResources:
  - label: W3Schools Angular
    url: https://www.w3schools.com/angular/
    kind: course
  - label: Angular Official Docs
    url: https://angular.dev/overview
    kind: doc
---

# Performance — Lazy Loading, Preloading, Bundle Size

## Performance — Lazy Loading, Preloading, Bundle Size

### Why It Matters

Optimize Angular apps with lazy-loaded routes, preloading strategies, `trackBy` (or `track`), OnPush, bundle budgets, and tools to measure and shrink bundle size.

Optimize Angular apps with lazy-loaded routes, preloading strategies, `trackBy` (or `track`), OnPush, bundle budgets, and tools to measure and shrink bundle size.

### Prerequisites

- Stage 7: Routing and Navigation (lazy routes are the foundation).
- Stage 13: Change Detection (OnPush is critical for performance).
- Stage 4: Directives (you understand `track` on `@for`).

### Topics

- Lazy loading routes via `loadComponent` and `loadChildren`
- Preloading strategies: `NoPreloading`, `PreloadAllModules`, custom `PreloadingStrategy`
- `track` on `@for` (mandatory) — DOM recycling for large lists
- OnPush change detection + signals (Stage 13 recap)
- `NgOptimizedImage` for lazy, priority, and responsive images
- Bundle budgets in `angular.json` (`maximumWarning`, `maximumError`)
- `ng build --source-map` + `source-map-explorer` for bundle analysis
- `standalone: false` to `standalone: true` migration impact on tree-shaking
- Hydration (Angular 17+) and SSR for first-paint wins

### Key Concepts

- Each `loadComponent` / `loadChildren` becomes a separate JS chunk — only downloaded on navigation
- Custom preloading strategies can prefetch high-probability routes (e.g., the next likely page) without loading everything
- `track` is mandatory on `@for` — gives Angular a stable identity to recycle DOM nodes on add/remove/reorder
- `NgOptimizedImage` adds lazy-loading, priority hints, and responsive image srcset to `<img>` for free LCP wins
- Bundle budgets fail the build (`maximumError`) or warn (`maximumWarning`) when chunks exceed thresholds — keeping bundle size in check

```typescript
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

// Preload only routes the user is likely to visit next
export class RoleAwarePreload implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    const auth = inject(AuthService);
    if (route.data?.['preload'] && auth.canPreload(route.data['role'])) {
      // Wait 2s after idle, then preload
      return timer(2000).pipe(switchMap(() => load()));
    }
    return of(null);
  }
}

// main.ts:
// provideRouter(routes, withPreloading(RoleAwarePreload))
```
Caption: Lazy routes + custom preloading strategy

### Common Pitfalls

- Forgetting to lazy-load non-critical routes — they bundle into the initial chunk, bloating first paint; use `loadComponent` / `loadChildren`.
- Tracking `@for` by `track $index` on a reorderable list — DOM recycles wrong, inputs leak across items; track by a unique ID.
- Rendering 10,000+ items without virtual scrolling — the browser chokes rendering them all; use `cdk-virtual-scroll-viewport` from `@angular/cdk/scrolling`.
- Loading all images eagerly — kills LCP; use `NgOptimizedImage` with `priority` only on the LCP image and let others lazy-load.
- Setting bundle budgets too loose — silent growth; set `maximumError` aggressively (e.g., 1MB initial) so CI fails on regressions.

### Real-World Applications

- Google Ads' dashboard lazy-loads the campaign editor, reducing the initial bundle from 4MB to 800KB.
- Upwork uses a custom preloading strategy that prefetches the "post a job" flow only for client users (not freelancers).
- PayPal uses `NgOptimizedImage` on the checkout page's hero image, cutting LCP by 1.2s on mobile.
- Microsoft Teams uses `cdk-virtual-scroll-viewport` for the chat message list, rendering only ~30 messages of a 10000-message thread.

### Interview Questions

- 1. What's the difference between `NoPreloading`, `PreloadAllModules`, and a custom strategy? — None = lazy routes never preload; All = preload all after initial; custom = conditional (e.g., role-based or bandwidth-based).
- 2. Why is `track` mandatory on `@for`? — It gives Angular a stable identity to recycle DOM nodes on add/remove/reorder, avoiding full re-renders.
- 3. What does `NgOptimizedImage` do? — Adds lazy loading, `priority` hint for LCP image, responsive `srcset`, and image-format negotiation — improving Core Web Vitals.
- 4. How do bundle budgets help? — They fail the build (`maximumError`) or warn (`maximumWarning`) when a chunk exceeds thresholds, preventing silent bundle bloat.
- 5. When would you use virtual scrolling? — For lists with 100+ items (or 1000+); only visible items are rendered, keeping DOM size and memory bounded.

### Mini Project

Build a "Dashboard with Lazy Routes": A three-route app (`/`, `/reports`, `/admin`) where `/reports` and `/admin` are lazy-loaded with a custom preloading strategy that prefetches `/reports` after 2s but never `/admin` (auth-gated). Add bundle budgets that fail the build at 1MB initial. Suggested approach:
  - Define `loadComponent` for `/reports` and `/admin`
  - Implement `RoleAwarePreload implements PreloadingStrategy`
  - Configure `withPreloading(RoleAwarePreload)` in `provideRouter`
  - Add `budgets` to `angular.json` (initial `maximumError: "1mb"`)
  - Run `ng build` and inspect `dist/` chunk sizes

### Exercises

1. Convert an eager route to `loadComponent` and verify it appears as a separate chunk in `dist/`.
2. Implement a custom `PreloadingStrategy` that preloads routes with `data: { preload: true }`.
3. Use `NgOptimizedImage` on the LCP image with `priority` and verify Lighthouse shows a faster LCP.
4. Set bundle budgets in `angular.json` and verify the build fails when adding a heavy dependency.
5. Replace a 5,000-item `<ul>` with `cdk-virtual-scroll-viewport` and measure the DOM node count.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which CLI flag enables lazy loading for a route?
9. A) --lazy
10. B) --split
11. C) None — use `loadComponent`/`loadChildren` in the route config (*)
12. D) --chunk
13. Explanation: Lazy loading is configured by `loadComponent: () => import(...)` or `loadChildren: () => import(...).then(m => m.X)`; no CLI flag is needed.
14. Q2: Which preloading strategy loads ALL lazy routes after the initial bundle?
15. A) NoPreloading
16. B) PreloadEverything
17. C) AutoPreloading
18. D) PreloadAllModules (*)
19. Explanation: `PreloadAllModules` preloads all lazy routes after the initial bundle loads, trading bandwidth for faster subsequent navigation.
20. Q3: Why is `track` mandatory on `@for`?
21. A) To give Angular a stable identity for DOM recycling on add/remove/reorder (*)
22. B) For TypeScript inference
23. C) For accessibility
24. D) To enable pagination
25. Explanation: `track` lets Angular map items to DOM nodes across renders, recycling instead of re-creating — up to 90% faster on large lists.
26. Q4: Which directive adds lazy loading and priority hints to images?
27. A) NgLazyImage
28. B) NgOptimizedImage (*)
29. C) imgLazy
30. D) LazyImg
31. Explanation: `NgOptimizedImage` from `@angular/common` adds `loading="lazy"`, `fetchpriority="high"` for `priority` images, and responsive `srcset` for better LCP.
32. Q5: Which `angular.json` field fails the build when a chunk exceeds a threshold?
33. A) maximumWarning
34. B) maximumSize
35. C) maximumError (*)
36. D) failOn
37. Explanation: `maximumError` fails the build; `maximumWarning` only warns. Both are set per-budget in the project's `budgets` array.
38. Q6: Which CDK module virtualizes huge lists?
39. A) @angular/cdk/virtual
40. B) @angular/cdk/list
41. C) @angular/cdk/infinite
42. D) @angular/cdk/scrolling (CdkVirtualScrollViewport) (*)
43. Explanation: `@angular/cdk/scrolling` provides `cdk-virtual-scroll-viewport` that renders only visible items + buffer, keeping DOM size bounded.
44. Q7: Which `track` value is an anti-pattern for reorderable lists?
45. A) track $index (*)
46. B) track item.id
47. C) track item.uuid
48. D) track item.slug
49. Explanation: `track $index` recycles the wrong DOM node when items reorder, preserving stale state (inputs, selection) on the wrong item.
50. Q8: Which provider enables a custom preloading strategy?
51. A) providePreloading(MyStrategy)
52. B) withPreloading(MyStrategy) (*)
53. C) PreloadingModule.forRoot(MyStrategy)
54. D) setPreloadStrategy(MyStrategy)
55. Explanation: `provideRouter(routes, withPreloading(MyStrategy))` registers a custom `PreloadingStrategy` implementation; default is `NoPreloading`.
56. Q9: What does the `priority` attribute on `NgOptimizedImage` do?
57. A) Resizes the image
58. B) Compresses the image
59. C) Loads the image first in the queue (fetchpriority="high" — boosts LCP) (*)
60. D) Skips loading
61. Explanation: `priority` sets `fetchpriority="high"` and removes `loading="lazy"`, telling the browser to load this image first — use only for the LCP image.
62. Q10: Which tool visualizes the production bundle by module?
63. A) webpack-bundle-analyzer
64. B) Lighthouse only
65. C) tsc --listFiles
66. D) source-map-explorer on the `ng build --source-map` output (*)
67. Explanation: `ng build --source-map=true` produces source maps; `source-map-explorer dist/*.js` renders a treemap showing what's in each chunk, helping identify bloat.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which CLI flag enables lazy loading for a route?
  options:
    - --lazy
    - --split
    - None — use `loadComponent`/`loadChildren` in the route config
    - --chunk
    - "`; no CLI flag is needed."
  correctIndex: 2
  explanation: "Lazy loading is configured by `loadComponent: () => import(...)` or `loadChildren: () => import(...).then(m => m.X)`; no CLI flag is needed."
- id: q2
  question: Which preloading strategy loads ALL lazy routes after the initial bundle?
  options:
    - NoPreloading
    - PreloadEverything
    - AutoPreloading
    - PreloadAllModules
  correctIndex: 3
  explanation: "`PreloadAllModules` preloads all lazy routes after the initial bundle loads, trading bandwidth for faster subsequent navigation."
- id: q3
  question: Why is `track` mandatory on `@for`?
  options:
    - To give Angular a stable identity for DOM recycling on add/remove/reorder
    - For TypeScript inference
    - For accessibility
    - To enable pagination
  correctIndex: 0
  explanation: "`track` lets Angular map items to DOM nodes across renders, recycling instead of re-creating — up to 90% faster on large lists."
- id: q4
  question: Which directive adds lazy loading and priority hints to images?
  options:
    - NgLazyImage
    - NgOptimizedImage
    - imgLazy
    - LazyImg
  correctIndex: 1
  explanation: '`NgOptimizedImage` from `@angular/common` adds `loading="lazy"`, `fetchpriority="high"` for `priority` images, and responsive `srcset` for better LCP.'
- id: q5
  question: Which `angular.json` field fails the build when a chunk exceeds a threshold?
  options:
    - maximumWarning
    - maximumSize
    - maximumError
    - failOn
  correctIndex: 2
  explanation: "`maximumError` fails the build; `maximumWarning` only warns. Both are set per-budget in the project's `budgets` array."
- id: q6
  question: Which CDK module virtualizes huge lists?
  options:
    - "@angular/cdk/virtual"
    - "@angular/cdk/list"
    - "@angular/cdk/infinite"
    - "@angular/cdk/scrolling (CdkVirtualScrollViewport)"
  correctIndex: 3
  explanation: "`@angular/cdk/scrolling` provides `cdk-virtual-scroll-viewport` that renders only visible items + buffer, keeping DOM size bounded."
- id: q7
  question: Which `track` value is an anti-pattern for reorderable lists?
  options:
    - track $index
    - track item.id
    - track item.uuid
    - track item.slug
  correctIndex: 0
  explanation: "`track $index` recycles the wrong DOM node when items reorder, preserving stale state (inputs, selection) on the wrong item."
- id: q8
  question: Which provider enables a custom preloading strategy?
  options:
    - providePreloading(MyStrategy)
    - withPreloading(MyStrategy)
    - PreloadingModule.forRoot(MyStrategy)
    - setPreloadStrategy(MyStrategy)
  correctIndex: 1
  explanation: "`provideRouter(routes, withPreloading(MyStrategy))` registers a custom `PreloadingStrategy` implementation; default is `NoPreloading`."
- id: q9
  question: What does the `priority` attribute on `NgOptimizedImage` do?
  options:
    - Resizes the image
    - Compresses the image
    - Loads the image first in the queue (fetchpriority="high" — boosts LCP)
    - Skips loading
  correctIndex: 2
  explanation: '`priority` sets `fetchpriority="high"` and removes `loading="lazy"`, telling the browser to load this image first — use only for the LCP image.'
- id: q10
  question: Which tool visualizes the production bundle by module?
  options:
    - webpack-bundle-analyzer
    - Lighthouse only
    - tsc --listFiles
    - source-map-explorer on the `ng build --source-map` output
  correctIndex: 3
  explanation: "`ng build --source-map=true` produces source maps; `source-map-explorer dist/*.js` renders a treemap showing what's in each chunk, helping identify bloat."
```

