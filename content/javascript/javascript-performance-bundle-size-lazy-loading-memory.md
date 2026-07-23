---
slug: javascript-performance-bundle-size-lazy-loading-memory
id: javascript-17
track: javascript
order: 17
title: Performance — Bundle Size, Lazy Loading, Memory
description: Measure and optimize JavaScript performance — bundle size, runtime, memory, and rendering — using modern tools and patterns.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=13800s
whyItMatters: Measure and optimize JavaScript performance — bundle size, runtime, memory, and rendering — using modern tools and patterns.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Performance — Bundle Size, Lazy Loading, Memory

## Performance — Bundle Size, Lazy Loading, Memory

### Why It Matters

Measure and optimize JavaScript performance — bundle size, runtime, memory, and rendering — using modern tools and patterns.

Measure and optimize JavaScript performance — bundle size, runtime, memory, and rendering — using modern tools and patterns.

### Prerequisites

- Stage 16: Object-Oriented JavaScript and Prototypes
- Familiarity with bundlers (previewed in Stage 10).

### Topics

- Measuring: Lighthouse, WebPageTest, Chrome DevTools Performance
- Core Web Vitals: LCP, FID/INP, CLS
- Bundle size and tree-shaking
- Code-splitting with dynamic import()
- Lazy loading images, components, routes
- Debounce, throttle, requestAnimationFrame
- Memory leaks: closures, listeners, detached DOM
- Web Workers for CPU-heavy work

### Key Concepts

- The main thread is single — long tasks (>50ms) block input; break them up
- Tree-shaking removes unused exports at build time, but only works with ESM and side-effect-free modules
- Code-splitting ships less JS upfront; load features on demand via dynamic import
- Memory leaks come from retained references: closures holding DOM nodes, listeners never removed, growing caches
- requestAnimationFrame aligns visual updates to the display refresh — never use setTimeout for animation
- Web Workers move CPU work off the main thread but add postMessage overhead

```javascript
// Instead of importing statically:
// import HeavyChart from "./HeavyChart.js";

// Lazy-load only when the route is visited:
const routes = {
  "/dashboard": () => import("./pages/Dashboard.js").then(m => m.default),
  "/settings":  () => import("./pages/Settings.js").then(m => m.default),
};

async function renderRoute(path) {
  const page = await routes[path]();
  document.querySelector("#app").replaceChildren(page());
}
```
Caption: Code-split a route

### Common Pitfalls

- Shipping one big bundle — every page pays the parse cost; split routes and lazy-load heavy features.
- Using setTimeout for animations — janky and not aligned to refresh; use requestAnimationFrame or CSS transitions.
- Forgetting to remove event listeners — listeners retain closures that retain DOM nodes; classic leak in SPAs.
- Polling with setInterval when observers exist — IntersectionObserver, ResizeObserver, MutationObserver are cheaper.
- Ignoring Core Web Vitals — Google ranks pages on LCP/INP/CLS; measure in production with field data, not just lab.

### Real-World Applications

- Twitter/X reduced initial JS by 80% via route-level code-splitting, improving time-to-interactive significantly on mobile.
- Figma offloads rendering math to Web Workers so the main thread stays 60fps even with huge canvases.
- Airbnb uses Lighthouse CI in GitHub Actions to block PRs that regress Core Web Vitals beyond a threshold.
- Notion virtualizes long documents with IntersectionObserver so 10,000-block pages render smoothly.

### Interview Questions

- 1. What are Core Web Vitals? — LCP (loading), INP (interactivity, replaced FID), CLS (visual stability); Google's ranking signals.
- 2. How does tree-shaking work? — Static analysis of ESM imports removes unused exports; works only on side-effect-free modules.
- 3. How do you code-split in a SPA? — Dynamic import() at route boundaries; bundler creates separate chunks loaded on demand.
- 4. What causes memory leaks in JS? — Retained references: closures holding DOM, listeners never removed, growing caches; use DevTools Heap snapshots.
- 5. Why use requestAnimationFrame over setTimeout for animation? — rAF aligns to the display refresh, avoids wasted frames, and pauses when the tab is hidden.

### Mini Project

Build a "Performance Dashboard" page that loads a heavy chart (mock 200KB) lazily on button click, measures LCP and TTI with the Performance API, and reports them. It outputs timings to the page and console. Suggested approach:
  - Use `performance.getEntriesByType("navigation")` for load metrics
  - Use the PerformanceObserver API to capture LCP
  - Dynamic-import a mock "heavy" module on button click
  - Show before/after metrics on screen
  - Add a Web Worker that hashes a 10MB random buffer; show main thread stays responsive

### Exercises

1. Run Lighthouse on a sample page and list the top 3 JS-related opportunities.
2. Code-split a 3-route SPA; verify each route loads only its chunk in the Network tab.
3. Use the Heap Snapshot tool to find a deliberately leaked listener in a small demo.
4. Replace a setInterval-based animation with requestAnimationFrame; measure smoothness.
5. Move a CPU-heavy computation (e.g., parsing a 5MB JSON) into a Web Worker; show the main thread stays responsive.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Core Web Vitals include:
9. A) TTI, FCP, TTFB
10. B) LCP, INP, CLS (*)
11. C) DOM, CSS, JS
12. D) RAM, CPU, GPU
13. Explanation: LCP (Largest Contentful Paint), INP (Interaction to Next Paint), CLS (Cumulative Layout Shift) are Google's user-experience signals.
14. Q2: Tree-shaking requires:
15. A) CommonJS modules
16. B) ESM and side-effect-free modules (*)
17. C) Inline scripts
18. D) eval
19. Explanation: Bundlers statically analyze ESM imports/exports; side-effect-free modules let them safely drop unused exports.
20. Q3: Dynamic import() enables:
21. A) Sync loading
22. B) Code-splitting and lazy loading (*)
23. C) Smaller initial HTML
24. D) Faster parsing of CSS
25. Explanation: import() returns a Promise and triggers a separate chunk load on demand.
26. Q4: Animations should use:
27. A) setTimeout
28. B) setInterval
29. C) requestAnimationFrame (*)
30. D) while loops
31. Explanation: rAF aligns to the display refresh (~60Hz) and pauses when the tab is hidden — smoother and efficient.
32. Q5: A common memory leak in SPAs is:
33. A) Too many comments
34. B) Event listeners never removed (*)
35. C) Using let instead of const
36. D) Strict mode
37. Explanation: Listeners hold closures that retain DOM nodes; removeEventListener or use AbortController per page.
38. Q6: Long tasks (>50ms) on the main thread:
39. A) Are fine
40. B) Block input and hurt INP (*)
41. C) Run faster in modern browsers
42. D) Get auto-parallelized
43. Explanation: The main thread is single; long tasks delay event handling and visual updates.
44. Q7: Web Workers help with:
45. A) DOM updates
46. B) CPU-heavy work off the main thread (*)
47. C) Smaller bundles
48. D) Network requests only
49. Explanation: Workers run JS in a separate thread; can't touch DOM but can postMessage results back.
50. Q8: IntersectionObserver is preferred over scroll polling because:
51. A) It's older
52. B) It's cheaper — the browser does the math (*)
53. C) It works in Node
54. D) It's required by law
55. Explanation: The observer pattern offloads intersection math to the browser, avoiding constant scroll listeners.
56. Q9: Lighthouse measures:
57. A) Test coverage
58. B) Performance, accessibility, SEO, best practices (*)
59. C) Bundle size only
60. D) CI/CD pipelines
61. Explanation: Lighthouse audits performance, a11y, best practices, SEO, and Progressive Web App criteria.
62. Q10: To measure real-user Web Vitals in production:
63. A) Use only lab tools
64. B) Use web-vitals library + RUM (Real User Monitoring) (*)
65. C) Run Lighthouse on a fast machine
66. D) You can't measure in production
67. Explanation: Field data via web-vitals + analytics gives real-world LCP/INP/CLS across devices and networks.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "Core Web Vitals include:"
  options:
    - TTI, FCP, TTFB
    - LCP, INP, CLS
    - DOM, CSS, JS
    - RAM, CPU, GPU
  correctIndex: 1
  explanation: LCP (Largest Contentful Paint), INP (Interaction to Next Paint), CLS (Cumulative Layout Shift) are Google's user-experience signals.
- id: q2
  question: "Tree-shaking requires:"
  options:
    - CommonJS modules
    - ESM and side-effect-free modules
    - Inline scripts
    - eval
  correctIndex: 1
  explanation: Bundlers statically analyze ESM imports/exports; side-effect-free modules let them safely drop unused exports.
- id: q3
  question: "Dynamic import() enables:"
  options:
    - Sync loading
    - Code-splitting and lazy loading
    - Smaller initial HTML
    - Faster parsing of CSS
  correctIndex: 1
  explanation: import() returns a Promise and triggers a separate chunk load on demand.
- id: q4
  question: "Animations should use:"
  options:
    - setTimeout
    - setInterval
    - requestAnimationFrame
    - while loops
  correctIndex: 2
  explanation: rAF aligns to the display refresh (~60Hz) and pauses when the tab is hidden — smoother and efficient.
- id: q5
  question: "A common memory leak in SPAs is:"
  options:
    - Too many comments
    - Event listeners never removed
    - Using let instead of const
    - Strict mode
  correctIndex: 1
  explanation: Listeners hold closures that retain DOM nodes; removeEventListener or use AbortController per page.
- id: q6
  question: "Long tasks (>50ms) on the main thread:"
  options:
    - Are fine
    - Block input and hurt INP
    - Run faster in modern browsers
    - Get auto-parallelized
  correctIndex: 1
  explanation: The main thread is single; long tasks delay event handling and visual updates.
- id: q7
  question: "Web Workers help with:"
  options:
    - DOM updates
    - CPU-heavy work off the main thread
    - Smaller bundles
    - Network requests only
  correctIndex: 1
  explanation: Workers run JS in a separate thread; can't touch DOM but can postMessage results back.
- id: q8
  question: "IntersectionObserver is preferred over scroll polling because:"
  options:
    - It's older
    - It's cheaper — the browser does the math
    - It works in Node
    - It's required by law
  correctIndex: 1
  explanation: The observer pattern offloads intersection math to the browser, avoiding constant scroll listeners.
- id: q9
  question: "Lighthouse measures:"
  options:
    - Test coverage
    - Performance, accessibility, SEO, best practices
    - Bundle size only
    - CI/CD pipelines
  correctIndex: 1
  explanation: Lighthouse audits performance, a11y, best practices, SEO, and Progressive Web App criteria.
- id: q10
  question: "To measure real-user Web Vitals in production:"
  options:
    - Use only lab tools
    - Use web-vitals library + RUM (Real User Monitoring)
    - Run Lighthouse on a fast machine
    - You can't measure in production
  correctIndex: 1
  explanation: Field data via web-vitals + analytics gives real-world LCP/INP/CLS across devices and networks.
```

