---
slug: nextjs-performance-core-web-vitals-bundle-analysis
id: nextjs-18
track: nextjs
order: 18
title: Performance — Core Web Vitals, Bundle Analysis
description: Measure and optimize Core Web Vitals (LCP, CLS, INP), analyze your bundle with `@next/bundle-analyzer`, and apply code-splitting, prefetching, and tree-shaking techniques.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=TJQbDPGzm0Y&t=420s
whyItMatters: Measure and optimize Core Web Vitals (LCP, CLS, INP), analyze your bundle with `@next/bundle-analyzer`, and apply code-splitting, prefetching, and tree-shaking techniques.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Performance — Core Web Vitals, Bundle Analysis

## Performance — Core Web Vitals, Bundle Analysis

### Why It Matters

Measure and optimize Core Web Vitals (LCP, CLS, INP), analyze your bundle with `@next/bundle-analyzer`, and apply code-splitting, prefetching, and tree-shaking techniques.

Measure and optimize Core Web Vitals (LCP, CLS, INP), analyze your bundle with `@next/bundle-analyzer`, and apply code-splitting, prefetching, and tree-shaking techniques.

### Prerequisites

- Stage 17: Testing — Jest, Playwright, Vitest.
- Stage 11: Image, Font, and Link Components.
- Browser DevTools (Network, Performance, Lighthouse).

### Topics

- Core Web Vitals: LCP, CLS, INP (formerly FID)
- Lighthouse and `next build` metrics
- `@next/bundle-analyzer` for visualizing JS shipped
- Code-splitting with `next/dynamic` and `React.lazy`
- Tree-shaking and named imports
- `next/script` strategies for third-party JS
- The `next/font` FOUT/CLS fix
- Real User Monitoring (RUM) with `web-vitals`

### Key Concepts

- LCP (Largest Contentful Paint) measures loading; optimize hero image and font loading
- CLS (Cumulative Layout Shift) measures visual stability; reserve space for images and fonts
- INP (Interaction to Next Paint) measures interactivity; replace heavy effects with deferred work
- Bundle analysis reveals large dependencies; lazy-load non-critical routes
- `next/dynamic` with `ssr: false` for client-only components; default `ssr: true` for code-splitting

```js
// next.config.mjs
import bundleAnalyzer from "@next/bundle-analyzer";
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  // ... your config
};
export default withBundleAnalyzer(nextConfig);
```
Caption: Bundle analyzer setup

### Common Pitfalls

- Shipping a heavy chart library (chart.js, d3) eagerly — lazy-load it with `next/dynamic` so it only downloads when the dashboard route is visited.
- Setting `ssr: false` on a component that should be SEO-indexed — search engines cannot see it; only disable SSR for genuinely client-only widgets.
- Importing moment.js instead of date-fns — moment ships 60KB+ with all locales; use tree-shakeable alternatives like date-fns or `Intl.DateTimeFormat`.
- Forgetting that `'use client'` boundaries affect bundle size — a single 'use client' at the top pulls in all its imports; push it down to leaf components.
- Measuring only in Lighthouse — Lighthouse is lab data; real users on slow networks will differ. Always collect field data via `web-vitals`.

### Real-World Applications

- Vercel uses `@next/bundle-analyzer` on every PR to catch bundle regressions before they ship.
- Notion uses `next/dynamic` to lazy-load heavy block types (e.g. math, code) so the editor stays fast.
- Hulu monitors INP closely during live events when millions of users interact with the player.
- TikTok uses RUM data via `web-vitals` to detect regional slowdowns and route users to closer CDNs.

### Interview Questions

- 1. What are the three Core Web Vitals? — LCP (Largest Contentful Paint), CLS (Cumulative Layout Shift), and INP (Interaction to Next Paint, replacing FID in 2024).
- 2. What does `@next/bundle-analyzer` do? — Visualizes the JS shipped per route as a treemap, helping you find large dependencies and accidental imports.
- 3. When would you use `next/dynamic` with `ssr: false`? — For client-only widgets (canvas libraries, browser APIs like window) that should not be server-rendered; default `ssr: true` for code-splitting SEO content.
- 4. Why collect field data with `web-vitals` instead of relying on Lighthouse? — Lighthouse is synthetic lab data; real users on slow devices and networks behave differently, so RUM (Real User Monitoring) captures actual experience.
- 5. How does `'use client'` affect bundle size? — It pulls all its imports into the client bundle; pushing it down to leaf components keeps parents server-rendered and reduces shipped JS.

### Mini Project

Build a fast dashboard with bundle analysis: A `/dashboard` page that lazy-loads a heavy chart via `next/dynamic`, runs `ANALYZE=true npm run build` to inspect the bundle, and reports Core Web Vitals to a custom `/api/vitals` endpoint. Suggested approach:
  - Install `@next/bundle-analyzer` and wire it into `next.config.mjs`
  - Create a fake `HeavyChart` component that imports a 100KB+ library (e.g. d3)
  - Use `next/dynamic` to lazy-load HeavyChart with a loading placeholder
  - Add a `WebVitals` client component using `useReportWebVitals`
  - Run `ANALYZE=true npm run build` and inspect the client.html treemap

### Exercises

1. Install `@next/bundle-analyzer` and run `ANALYZE=true npm run build`; identify the largest dependency.
2. Lazy-load a heavy component with `next/dynamic` and confirm it's split into its own chunk.
3. Add `useReportWebVitals` and log LCP, CLS, INP to the console.
4. Replace `moment` with `date-fns` (or `Intl.DateTimeFormat`) and compare bundle sizes.
5. Run Lighthouse on your home page and aim for ≥90 on all four categories.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What are the three Core Web Vitals (as of 2024)?
9. A) FCP, TTI, TBT
10. B) LCP, CLS, INP (*)
11. C) LCP, FID, TTI
12. D) CLS, FCP, INP
13. Explanation: The three Core Web Vitals are LCP (Largest Contentful Paint, loading), CLS (Cumulative Layout Shift, visual stability), and INP (Interaction to Next Paint, interactivity — replacing FID in March 2024).
14. Q2: Which package visualizes the JS shipped per route?
15. A) @next/font
16. B) next/dynamic
17. C) @next/bundle-analyzer (*)
18. D) next/script
19. Explanation: `@next/bundle-analyzer` produces treemap visualizations (client.html, server.html) showing exactly what each chunk contains, so you can find large dependencies.
20. Q3: Which function lazy-loads a component with code-splitting?
21. A) React.lazy() in any component
22. B) import()
23. C) require()
24. D) next/dynamic (*)
25. Explanation: `next/dynamic` is Next.js's wrapper around React.lazy that supports SSR (or `ssr: false`), loading placeholders, and code-splitting — preferred over raw React.lazy in Next.js.
26. Q4: What does `ssr: false` do in next/dynamic?
27. A) Skips server-side rendering — the component only renders on the client (*)
28. B) Disables code-splitting
29. C) Disables hydration
30. D) Enables prefetching
31. Explanation: `ssr: false` makes the dynamic component render only on the client (useful for canvas/browser-API libraries); use the default `ssr: true` for SEO-relevant content.
32. Q5: Why use `web-vitals` (RUM) instead of just Lighthouse?
33. A) Lighthouse is deprecated
34. B) Lighthouse is synthetic lab data; real users on slow devices/networks differ, so collect field data (*)
35. C) web-vitals is faster
36. D) Lighthouse does not measure INP
37. Explanation: Lighthouse simulates one device/network; `web-vitals` collects real user measurements (field data) so you see actual experiences across device classes and connection types.
38. Q6: Which hook reports Core Web Vitals to a custom endpoint?
39. A) useAnalytics()
40. B) useWebVitals()
41. C) useReportWebVitals() (*)
42. D) usePerformance()
43. Explanation: `useReportWebVitals` from `next/web-vitals` is a client-side hook that fires a callback with each Core Web Vital metric, which you can POST to an analytics endpoint.
44. Q7: Why push `'use client'` down to leaf components?
45. A) To avoid server rendering entirely
46. B) To enable caching
47. C) To make tests easier
48. D) To keep parent components server-rendered, reducing client bundle size (*)
49. Explanation: A 'use client' file pulls all its imports into the client bundle; keeping parents as server components means only the leaf's JS ships to the browser.
50. Q8: Which is a typical cause of high CLS?
51. A) Images without width/height and unreserved font space (*)
52. B) Slow server response
53. C) Too many server components
54. D) Use of TypeScript
55. Explanation: CLS measures layout shifts; images without dimensions, ads without reserved space, and web fonts that push content after loading are the most common causes.
56. Q9: What does `next/font` do to improve CLS?
57. A) Preloads all fonts
58. B) Inlines font CSS at build time so fonts load without a layout shift (*)
59. C) Disables fonts on mobile
60. D) Hosts fonts on a CDN
61. Explanation: `next/font` self-hosts fonts at build time, subsets them, and inlines the CSS so the font is available immediately — no FOUT and no CLS from late-loading fonts.
62. Q10: Which strategy for `next/script` defers analytics until idle?
63. A) beforeInteractive
64. B) afterInteractive
65. C) lazyOnload (*)
66. D) worker
67. Explanation: `strategy="lazyOnload"` defers the script until after the page is interactive and idle, suitable for analytics and other non-critical third-party scripts.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What are the three Core Web Vitals (as of 2024)?
  options:
    - FCP, TTI, TBT
    - LCP, CLS, INP
    - LCP, FID, TTI
    - CLS, FCP, INP
  correctIndex: 1
  explanation: The three Core Web Vitals are LCP (Largest Contentful Paint, loading), CLS (Cumulative Layout Shift, visual stability), and INP (Interaction to Next Paint, interactivity — replacing FID in March 2024).
- id: q2
  question: Which package visualizes the JS shipped per route?
  options:
    - "@next/font"
    - next/dynamic
    - "@next/bundle-analyzer"
    - next/script
  correctIndex: 2
  explanation: "`@next/bundle-analyzer` produces treemap visualizations (client.html, server.html) showing exactly what each chunk contains, so you can find large dependencies."
- id: q3
  question: Which function lazy-loads a component with code-splitting?
  options:
    - React.lazy() in any component
    - import()
    - require()
    - next/dynamic
  correctIndex: 3
  explanation: "`next/dynamic` is Next.js's wrapper around React.lazy that supports SSR (or `ssr: false`), loading placeholders, and code-splitting — preferred over raw React.lazy in Next.js."
- id: q4
  question: "What does `ssr: false` do in next/dynamic?"
  options:
    - Skips server-side rendering — the component only renders on the client
    - Disables code-splitting
    - Disables hydration
    - Enables prefetching
  correctIndex: 0
  explanation: "`ssr: false` makes the dynamic component render only on the client (useful for canvas/browser-API libraries); use the default `ssr: true` for SEO-relevant content."
- id: q5
  question: Why use `web-vitals` (RUM) instead of just Lighthouse?
  options:
    - instead of just Lighthouse?
    - Lighthouse is deprecated
    - Lighthouse is synthetic lab data; real users on slow devices/networks differ, so collect field data
    - web-vitals is faster
    - Lighthouse does not measure INP
  correctIndex: 2
  explanation: Lighthouse simulates one device/network; `web-vitals` collects real user measurements (field data) so you see actual experiences across device classes and connection types.
- id: q6
  question: Which hook reports Core Web Vitals to a custom endpoint?
  options:
    - useAnalytics()
    - useWebVitals()
    - useReportWebVitals()
    - usePerformance()
  correctIndex: 2
  explanation: "`useReportWebVitals` from `next/web-vitals` is a client-side hook that fires a callback with each Core Web Vital metric, which you can POST to an analytics endpoint."
- id: q7
  question: Why push `'use client'` down to leaf components?
  options:
    - To avoid server rendering entirely
    - To enable caching
    - To make tests easier
    - To keep parent components server-rendered, reducing client bundle size
  correctIndex: 3
  explanation: A 'use client' file pulls all its imports into the client bundle; keeping parents as server components means only the leaf's JS ships to the browser.
- id: q8
  question: Which is a typical cause of high CLS?
  options:
    - Images without width/height and unreserved font space
    - Slow server response
    - Too many server components
    - Use of TypeScript
  correctIndex: 0
  explanation: CLS measures layout shifts; images without dimensions, ads without reserved space, and web fonts that push content after loading are the most common causes.
- id: q9
  question: What does `next/font` do to improve CLS?
  options:
    - Preloads all fonts
    - Inlines font CSS at build time so fonts load without a layout shift
    - Disables fonts on mobile
    - Hosts fonts on a CDN
  correctIndex: 1
  explanation: "`next/font` self-hosts fonts at build time, subsets them, and inlines the CSS so the font is available immediately — no FOUT and no CLS from late-loading fonts."
- id: q10
  question: Which strategy for `next/script` defers analytics until idle?
  options:
    - beforeInteractive
    - afterInteractive
    - lazyOnload
    - worker
  correctIndex: 2
  explanation: '`strategy="lazyOnload"` defers the script until after the page is interactive and idle, suitable for analytics and other non-critical third-party scripts.'
```

