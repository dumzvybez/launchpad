---
slug: html-html-performance-preload-prefetch-lazy-load
id: html-18
track: html
order: 18
title: HTML Performance — Preload, Prefetch, Lazy Load
description: Squeeze the most out of every byte and every network round-trip. This stage covers resource hints (`preload`, `prefetch`, `preconnect`, `dns-prefetch`), native lazy loading, async/defer scripts, and the `fetchpriority` attribute.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=6700s
whyItMatters: Squeeze the most out of every byte and every network round-trip. This stage covers resource hints (`preload`, `prefetch`, `preconnect`, `dns-prefetch`), native lazy loading, async/defer scripts, and the `fetchpriority` attribute.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# HTML Performance — Preload, Prefetch, Lazy Load

## HTML Performance — Preload, Prefetch, Lazy Load

### Why It Matters

Squeeze the most out of every byte and every network round-trip. This stage covers resource hints (`preload`, `prefetch`, `preconnect`, `dns-prefetch`), native lazy loading, async/defer scripts, and the `fetchpriority` attribute.

Squeeze the most out of every byte and every network round-trip. This stage covers resource hints (`preload`, `prefetch`, `preconnect`, `dns-prefetch`), native lazy loading, async/defer scripts, and the `fetchpriority` attribute.

### Prerequisites

- Stage 1: Getting Started with HTML
- Stage 3: Links and Images
- Stage 10: Metadata, SEO, and Open Graph
- Stage 17: HTML for PWAs (service workers context)

### Topics

- Resource hints: `rel="preload"`, `rel="prefetch"`, `rel="preconnect"`, `rel="dns-prefetch"`, `rel="modulepreload"`
- Native lazy loading: `loading="lazy"` on `<img>` and `<iframe>`
- `decoding="async"` on images
- `fetchpriority` attribute: `high`, `low`, `auto`
- `<script>` attributes: `async`, `defer`, `blocking`
- Critical CSS inlining vs preload
- `<link rel="preload" as="...">` types (font, image, script, style, fetch)
- Preload vs prefetch: when to use which

### Key Concepts

- `preload` tells the browser to fetch a resource needed for the current page ASAP (high priority); `prefetch` fetches for the next navigation (low priority, idle time).
- `preconnect` warms up the DNS/TCP/TLS handshake to a third-party origin; `dns-prefetch` only does DNS lookup.
- `async` downloads the script in parallel and executes as soon as ready (order not guaranteed); `defer` downloads in parallel and executes in order after HTML parsing.
- `loading="lazy"` defers offscreen images and iframes until near the viewport; always pair with explicit `width`/`height` to prevent CLS.
- `fetchpriority="high"` boosts the LCP image's priority so it loads first.

```html
<head>
  <!-- Preconnect to third-party origins for warm DNS+TLS -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://cdn.example.com">

  <!-- Preload the LCP image and critical font -->
  <link rel="preload" as="image" href="/hero.webp"
        imagesrcset="/hero-800.webp 800w, /hero-1600.webp 1600w"
        imagesizes="100vw" fetchpriority="high">
  <link rel="preload" as="font" type="font/woff2"
        href="/fonts/inter-var.woff2" crossorigin>

  <!-- Prefetch the next page -->
  <link rel="prefetch" href="/about" as="document">
</head>
```
Caption: Resource hints in head

### Common Pitfalls

- Lazy-loading the LCP image — destroys Largest Contentful Paint; mark above-the-fold hero images with `loading="eager"` and `fetchpriority="high"`.
- Missing `width`/`height` on lazy images — causes CLS as images pop in; always specify intrinsic dimensions.
- Using `async` for scripts with dependencies — execution order is not guaranteed; use `defer` for ordered execution or bundle them.
- Overusing `preload` — preloading too many resources competes for bandwidth and can slow the LCP; preload only the critical path.
- Forgetting `crossorigin` on font preload — fonts must be fetched with CORS; a preload without `crossorigin` will fetch twice (once preloaded, once by the CSS).

### Real-World Applications

- Web.dev uses `preload` for the hero LCP image and `preconnect` to Google Fonts on every article page.
- CNN uses `fetchpriority="high"` on the hero image and lazy-loads the rest, achieving sub-2s LCP on mobile.
- Smashing Magazine preloads critical fonts and uses `font-display: swap` to avoid invisible text during load.
- GitHub uses `prefetch` on issue links you hover over, so the next page feels instant.

### Interview Questions

- 1. What is the difference between `preload` and `prefetch`? — Preload fetches a resource for the current page at high priority; prefetch fetches for a future navigation at low priority during idle time.
- 2. What does `preconnect` do? — Performs DNS, TCP, and TLS handshake to an origin in advance, saving up to 3 round-trips when the actual request is made.
- 3. What is the difference between `async` and `defer`? — `async` executes as soon as downloaded (order not guaranteed); `defer` executes in document order after HTML parsing.
- 4. When should you NOT use `loading="lazy"`? — On above-the-fold images, especially the LCP element; lazy-loading them delays the Largest Contentful Paint.
- 5. What does `fetchpriority="high"` do? — Boosts the resource's priority in the browser's fetch queue, useful for the LCP image so it loads before less critical resources.

### Mini Project

Build a Performance-Optimized Landing Page: A landing page with a preloaded hero image, preconnect to a font CDN, deferred main script, async analytics, and lazy-loaded below-the-fold images. Run Lighthouse and target 90+ Performance. Suggested approach:
  - Add `<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">`
  - Add `<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>`
  - Preload the woff2 font with `crossorigin`
  - Mark all below-the-fold images with `loading="lazy"` and `decoding="async"`; ensure `width`/`height` are set
  - Use `defer` on app.js and `async` on analytics.js; run Lighthouse and confirm LCP < 2.5s

### Exercises

1. Add `preload` for your LCP image and verify Lighthouse LCP improves by 500ms+.
2. Add `preconnect` to your font CDN and observe earlier font download start in DevTools.
3. Convert a render-blocking `<script>` to `defer` and confirm the page paints sooner.
4. Lazy-load all below-the-fold images with `loading="lazy"` and confirm zero CLS thanks to width/height.
5. Add `fetchpriority="high"` to the LCP image and verify its priority changes in the DevTools Network panel.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which resource hint fetches a resource for the CURRENT page at high priority?
9. A) prefetch
10. B) preload (*)
11. C) preconnect
12. D) dns-prefetch
13. Explanation: `preload` fetches a resource needed for the current page ASAP at high priority; `prefetch` is for future navigations at low priority.
14. Q2: Which attribute defers offscreen images until near the viewport?
15. A) loading="lazy" (*)
16. B) defer
17. C) async
18. D) lazyload
19. Explanation: `loading="lazy"` (native to `<img>` and `<iframe>`) defers loading until the user scrolls near the element, saving bandwidth.
20. Q3: Which script attribute preserves execution order?
21. A) async
22. B) defer (*)
23. C) blocking
24. D) sync
25. Explanation: `defer` scripts execute in document order after HTML parsing; `async` scripts execute as soon as they download, in any order.
26. Q4: What does `preconnect` do?
27. A) Fetches a page in advance
28. B) Caches a font
29. C) Warms up DNS, TCP, and TLS to an origin (*)
30. D) Defers a script
31. Explanation: `preconnect` performs the DNS lookup, TCP handshake, and TLS negotiation in advance, saving up to 3 round-trips when the real request fires.
32. Q5: Why must you pair `loading="lazy"` with `width`/`height`?
33. A) To improve SEO
34. B) To compress the image
35. C) To prevent Cumulative Layout Shift when images load (*)
36. D) Lazy loading requires it
37. Explanation: Without intrinsic dimensions, the browser cannot reserve space, causing layout shift as images pop in; always specify width/height.
38. Q6: Which `fetchpriority` value boosts the LCP image?
39. A) low
40. B) auto
41. C) max
42. D) high (*)
43. Explanation: `fetchpriority="high"` tells the browser to prioritize this resource, ensuring the LCP image loads before less critical ones.
44. Q7: What does `decoding="async"` on `<img>` do?
45. A) Defers the image download
46. B) Lets the browser decode the image off the main thread (*)
47. C) Compresses the image
48. D) Sets the alt text
49. Explanation: `decoding="async"` allows the browser to decode the image asynchronously, avoiding main-thread jank when the image arrives.
50. Q8: Which resource hint should you use for a font?
51. A) <link rel="prefetch" as="font">
52. B) <link rel="preconnect" as="font">
53. C) <link rel="font" href="...">
54. D) <link rel="preload" as="font" crossorigin> (*)
55. Explanation: Preload the font with `as="font"` and `crossorigin` (fonts require CORS); without `crossorigin`, the browser will fetch the font twice.
56. Q9: When should you NOT use `loading="lazy"`?
57. A) On above-the-fold images, especially the LCP (*)
58. B) On PNG images
59. C) On SVGs
60. D) On images with alt text
61. Explanation: Lazy-loading the LCP image delays the Largest Contentful Paint; mark above-the-fold images with `loading="eager"` (default) and `fetchpriority="high"`.
62. Q10: Which `as` value is used for preloading a CSS file?
63. A) as="stylesheet"
64. B) as="css"
65. C) as="style" (*)
66. D) as="text"
67. Explanation: `as="style"` is the correct destination for preloading CSS files; the browser uses the `as` value to set priority and apply the right caching policy.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which resource hint fetches a resource for the CURRENT page at high priority?
  options:
    - prefetch
    - preload
    - preconnect
    - dns-prefetch
  correctIndex: 1
  explanation: "`preload` fetches a resource needed for the current page ASAP at high priority; `prefetch` is for future navigations at low priority."
- id: q2
  question: Which attribute defers offscreen images until near the viewport?
  options:
    - loading="lazy"
    - defer
    - async
    - lazyload
  correctIndex: 0
  explanation: '`loading="lazy"` (native to `<img>` and `<iframe>`) defers loading until the user scrolls near the element, saving bandwidth.'
- id: q3
  question: Which script attribute preserves execution order?
  options:
    - async
    - defer
    - blocking
    - sync
  correctIndex: 1
  explanation: "`defer` scripts execute in document order after HTML parsing; `async` scripts execute as soon as they download, in any order."
- id: q4
  question: What does `preconnect` do?
  options:
    - Fetches a page in advance
    - Caches a font
    - Warms up DNS, TCP, and TLS to an origin
    - Defers a script
  correctIndex: 2
  explanation: "`preconnect` performs the DNS lookup, TCP handshake, and TLS negotiation in advance, saving up to 3 round-trips when the real request fires."
- id: q5
  question: Why must you pair `loading="lazy"` with `width`/`height`?
  options:
    - To improve SEO
    - To compress the image
    - To prevent Cumulative Layout Shift when images load
    - Lazy loading requires it
  correctIndex: 2
  explanation: Without intrinsic dimensions, the browser cannot reserve space, causing layout shift as images pop in; always specify width/height.
- id: q6
  question: Which `fetchpriority` value boosts the LCP image?
  options:
    - low
    - auto
    - max
    - high
  correctIndex: 3
  explanation: '`fetchpriority="high"` tells the browser to prioritize this resource, ensuring the LCP image loads before less critical ones.'
- id: q7
  question: What does `decoding="async"` on `<img>` do?
  options:
    - Defers the image download
    - Lets the browser decode the image off the main thread
    - Compresses the image
    - Sets the alt text
  correctIndex: 1
  explanation: '`decoding="async"` allows the browser to decode the image asynchronously, avoiding main-thread jank when the image arrives.'
- id: q8
  question: Which resource hint should you use for a font?
  options:
    - <link rel="prefetch" as="font">
    - <link rel="preconnect" as="font">
    - <link rel="font" href="...">
    - <link rel="preload" as="font" crossorigin>
    - ; without `crossorigin`, the browser will fetch the font twice.
  correctIndex: 3
  explanation: Preload the font with `as="font"` and `crossorigin` (fonts require CORS); without `crossorigin`, the browser will fetch the font twice.
- id: q9
  question: When should you NOT use `loading="lazy"`?
  options:
    - On above-the-fold images, especially the LCP
    - On PNG images
    - On SVGs
    - On images with alt text
  correctIndex: 0
  explanation: Lazy-loading the LCP image delays the Largest Contentful Paint; mark above-the-fold images with `loading="eager"` (default) and `fetchpriority="high"`.
- id: q10
  question: Which `as` value is used for preloading a CSS file?
  options:
    - as="stylesheet"
    - as="css"
    - as="style"
    - as="text"
  correctIndex: 2
  explanation: '`as="style"` is the correct destination for preloading CSS files; the browser uses the `as` value to set priority and apply the right caching policy.'
```

