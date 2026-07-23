---
slug: nextjs-data-fetching-server-components-fetch-caching
id: nextjs-06
track: nextjs
order: 6
title: Data Fetching — Server Components, fetch, Caching
description: "Fetch data in server components with the extended `fetch`, control caching with `revalidate` and `cache: 'no-store'`, and understand ISR, SSG, and SSR rendering modes in the App Router."
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A63UxsQsEbU&t=150s
whyItMatters: "Fetch data in server components with the extended `fetch`, control caching with `revalidate` and `cache: 'no-store'`, and understand ISR, SSG, and SSR rendering modes in the App Router."
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Data Fetching — Server Components, fetch, Caching

## Data Fetching — Server Components, fetch, Caching

### Why It Matters

Fetch data in server components with the extended `fetch`, control caching with `revalidate` and `cache: 'no-store'`, and understand ISR, SSG, and SSR rendering modes in the App Router.

Fetch data in server components with the extended `fetch`, control caching with `revalidate` and `cache: 'no-store'`, and understand ISR, SSG, and SSR rendering modes in the App Router.

### Prerequisites

- Stage 5: Server Components vs Client Components.
- HTTP basics (GET/POST, headers, status codes).
- Familiarity with async/await in JavaScript.

### Topics

- The extended `fetch` in Next.js 14 (caching, revalidate, tags)
- Default caching behavior in 14 vs 15
- `cache: 'force-cache'` (default) vs `cache: 'no-store'`
- `next: { revalidate: N }` for time-based ISR
- `next: { tags: [...] }` for on-demand revalidation via `revalidateTag`
- `revalidatePath()` for path-level invalidation
- `dynamic = 'force-dynamic' | 'force-static' | 'error'` route segment config
- Reading cookies/headers/searchParams and how they opt into dynamic rendering

### Key Concepts

- Next.js 14 extends `fetch` with caching by default (`force-cache`); Next.js 15 changes this to `no-store` by default
- ISR = incremental static regeneration: pages are static but revalidated on a timer or on-demand
- Reading dynamic APIs (cookies, headers, searchParams) opts the route into dynamic rendering
- `generateStaticParams` pre-renders dynamic routes at build time (Stage 7)
- Cache tags let you invalidate many fetches at once with `revalidateTag`

```tsx
// app/products/page.tsx
export const revalidate = 60; // revalidate the whole route at most every 60s

export default async function Products() {
  // Cached for 60s by default; subsequent requests within 60s serve cache
  const res = await fetch("https://api.example.com/products", {
    next: { revalidate: 60, tags: ["products"] },
  });
  const products = await res.json();
  return <ul>{products.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}
```
Caption: Cached fetch with revalidate (ISR)

### Common Pitfalls

- Assuming `fetch` is uncached in Next.js 14 — the default is `force-cache`; if you need fresh data you must pass `cache: 'no-store'` or set `revalidate` to 0.
- Calling `cookies()` or `headers()` inside a static route — these dynamic APIs opt the route into dynamic rendering and break static generation silently.
- Using `revalidate: 0` and expecting ISR — `revalidate: 0` is the same as `no-store` (always fresh); for ISR use `revalidate: N` with N > 0.
- Forgetting that cache tags must be invalidated with `revalidateTag` — without an invalidation hook, cached data persists for the entire revalidate window even after the upstream changes.
- Mixing `cache: 'no-store'` and `next: { revalidate: 60 }` on the same fetch — these conflict; pick one strategy per fetch call.

### Real-World Applications

- Vercel's marketing site uses ISR with `revalidate: 60` to keep pricing pages fresh without rebuilds.
- Notion's public docs use `revalidateTag` to instantly refresh pages when authors publish edits.
- Hulu's show pages use `cache: 'no-store'` for personalized recommendations and ISR for catalog pages.
- TikTok's creator pages use on-demand revalidation triggered by webhooks from the content service when a creator updates their profile.

### Interview Questions

- 1. What is the default caching behavior of `fetch` in Next.js 14? — `force-cache` (cached indefinitely unless revalidated); Next.js 15 flips the default to `no-store`.
- 2. What is ISR? — Incremental Static Regeneration: pages are pre-rendered statically but revalidated on a timer (`revalidate`) or on-demand (`revalidateTag`/`revalidatePath`) without a full rebuild.
- 3. How do you opt a route into dynamic rendering? — Read `cookies()`, `headers()`, or `searchParams`, OR set `export const dynamic = 'force-dynamic'`.
- 4. What is the difference between `revalidate: 0` and `revalidate: 60`? — `0` means never cache (equivalent to `no-store`); `60` means serve cache and revalidate at most every 60 seconds (ISR).
- 5. How do cache tags work? — Add `next: { tags: ['x'] }` to a fetch and call `revalidateTag('x')` to invalidate every fetch with that tag in one call.

### Mini Project

Build a cached news feed: A `/news` page that fetches headlines from a public API and caches them for 60 seconds, with a `/api/revalidate` route that lets a secret bearer token trigger an instant refresh via `revalidateTag`. Suggested approach:
  - Create `app/news/page.tsx` that fetches with `next: { revalidate: 60, tags: ['news'] }`
  - Display the fetch time so users can see when the cache was last refreshed
  - Create `app/api/revalidate/route.ts` that validates a bearer token and calls `revalidateTag('news')`
  - Test by hitting the API endpoint with curl and refreshing `/news`
  - Add `cache: 'no-store'` to a separate `/news/breaking` page for the always-fresh variant

### Exercises

1. Create a page that fetches data and verify with browser DevTools that the second load is instant (cached).
2. Add `cache: 'no-store'` and verify the page now re-fetches on every request (check the response time).
3. Set `revalidate: 5` and verify the page regenerates after 5 seconds of inactivity.
4. Add a cache tag and call `revalidateTag` from an API route; verify the cache is purged.
5. Add `export const dynamic = 'force-dynamic'` and confirm the build no longer pre-renders the page.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the default cache behavior of fetch in Next.js 14?
9. A) Never cached
10. B) Cached indefinitely (force-cache) unless revalidated (*)
11. C) Cached for 60 seconds only
12. D) Cached only in production
13. Explanation: Next.js 14 extends `fetch` with `force-cache` as the default, meaning responses are cached indefinitely until invalidated. Next.js 15 changes this to `no-store`.
14. Q2: Which option disables caching entirely on a fetch?
15. A) cache: 'force-cache'
16. B) revalidate: 0 only when combined with cache: 'force-cache'
17. C) cache: 'no-store' (*)
18. D) next: { cache: false }
19. Explanation: `cache: 'no-store'` tells Next.js to never cache the response; the fetch runs on every request (equivalent to `revalidate: 0`).
20. Q3: What does `next: { revalidate: 60 }` do?
21. A) Rebuilds the page every 60ms
22. B) Forces a 60-second delay before each request
23. C) Sets a 60-second HTTP timeout
24. D) Serves the cached response and regenerates at most every 60 seconds (*)
25. Explanation: `revalidate: 60` is ISR — the cached response is served immediately and a regeneration is triggered in the background at most every 60 seconds.
26. Q4: Which function invalidates all fetches sharing a cache tag?
27. A) revalidateTag() (*)
28. B) purgeTag()
29. C) invalidateTag()
30. D) clearCache()
31. Explanation: `revalidateTag('name')` from `next/cache` invalidates every fetch with that tag, allowing on-demand cache busting without a rebuild.
32. Q5: Reading which API opts a route into dynamic rendering?
33. A) fetch() with default cache
34. B) cookies() (*)
35. C) export const revalidate = 60
36. D) generateStaticParams
37. Explanation: Reading request-time APIs like `cookies()`, `headers()`, or `searchParams` opts the route into dynamic rendering because the output depends on the request.
38. Q6: What does `export const dynamic = 'force-dynamic'` do?
39. A) Forces the route to be cached
40. B) Enables ISR
41. C) Forces the route to always be dynamic (SSR) and never statically optimized (*)
42. D) Disables streaming
43. Explanation: `force-dynamic` opts the route out of static generation, making it always render server-side per request regardless of which APIs are used.
44. Q7: What is ISR?
45. A) Inline Server Rendering
46. B) Initial Server Response
47. C) Indexed Static Rendering
48. D) Incremental Static Regeneration — static pages revalidated on a schedule or on-demand (*)
49. Explanation: ISR (Incremental Static Regeneration) pre-renders pages statically and revalidates them on a timer or on-demand without a full rebuild.
50. Q8: What happens if you set `revalidate: 0`?
51. A) Same as cache: 'no-store' (always fresh) (*)
52. B) Page is cached forever
53. C) Page rebuilds every minute
54. D) Build fails
55. Explanation: `revalidate: 0` is equivalent to `no-store` — the response is never cached and the fetch runs on every request.
56. Q9: Which is a valid way to invalidate a path's cache?
57. A) purgePath('/products')
58. B) revalidatePath('/products') (*)
59. C) clearPath('/products')
60. D) invalidate('/products')
61. Explanation: `revalidatePath('/products')` from `next/cache` invalidates the cached response for a specific URL path on the next request.
62. Q10: Which combination on a single fetch is INVALID?
63. A) cache: 'no-store' (alone)
64. B) next: { revalidate: 60 } (alone)
65. C) cache: 'no-store' AND next: { revalidate: 60 } simultaneously (*)
66. D) next: { tags: ['products'] } (alone)
67. Explanation: You cannot combine `no-store` (never cache) with `revalidate` (cache and refresh) on the same fetch — they are contradictory cache strategies.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the default cache behavior of fetch in Next.js 14?
  options:
    - Never cached
    - Cached indefinitely (force-cache) unless revalidated
    - Cached for 60 seconds only
    - Cached only in production
  correctIndex: 1
  explanation: Next.js 14 extends `fetch` with `force-cache` as the default, meaning responses are cached indefinitely until invalidated. Next.js 15 changes this to `no-store`.
- id: q2
  question: Which option disables caching entirely on a fetch?
  options:
    - "cache: 'force-cache'"
    - "revalidate: 0 only when combined with cache: 'force-cache'"
    - "cache: 'no-store'"
    - "next: { cache: false }"
  correctIndex: 2
  explanation: "`cache: 'no-store'` tells Next.js to never cache the response; the fetch runs on every request (equivalent to `revalidate: 0`)."
- id: q3
  question: "What does `next: { revalidate: 60 }` do?"
  options:
    - Rebuilds the page every 60ms
    - Forces a 60-second delay before each request
    - Sets a 60-second HTTP timeout
    - Serves the cached response and regenerates at most every 60 seconds
  correctIndex: 3
  explanation: "`revalidate: 60` is ISR — the cached response is served immediately and a regeneration is triggered in the background at most every 60 seconds."
- id: q4
  question: Which function invalidates all fetches sharing a cache tag?
  options:
    - revalidateTag()
    - purgeTag()
    - invalidateTag()
    - clearCache()
  correctIndex: 0
  explanation: "`revalidateTag('name')` from `next/cache` invalidates every fetch with that tag, allowing on-demand cache busting without a rebuild."
- id: q5
  question: Reading which API opts a route into dynamic rendering?
  options:
    - fetch() with default cache
    - cookies()
    - export const revalidate = 60
    - generateStaticParams
  correctIndex: 1
  explanation: Reading request-time APIs like `cookies()`, `headers()`, or `searchParams` opts the route into dynamic rendering because the output depends on the request.
- id: q6
  question: What does `export const dynamic = 'force-dynamic'` do?
  options:
    - Forces the route to be cached
    - Enables ISR
    - Forces the route to always be dynamic (SSR) and never statically optimized
    - Disables streaming
  correctIndex: 2
  explanation: "`force-dynamic` opts the route out of static generation, making it always render server-side per request regardless of which APIs are used."
- id: q7
  question: What is ISR?
  options:
    - Inline Server Rendering
    - Initial Server Response
    - Indexed Static Rendering
    - Incremental Static Regeneration — static pages revalidated on a schedule or on-demand
  correctIndex: 3
  explanation: ISR (Incremental Static Regeneration) pre-renders pages statically and revalidates them on a timer or on-demand without a full rebuild.
- id: q8
  question: "What happens if you set `revalidate: 0`?"
  options:
    - "Same as cache: 'no-store' (always fresh)"
    - Page is cached forever
    - Page rebuilds every minute
    - Build fails
  correctIndex: 0
  explanation: "`revalidate: 0` is equivalent to `no-store` — the response is never cached and the fetch runs on every request."
- id: q9
  question: Which is a valid way to invalidate a path's cache?
  options:
    - purgePath('/products')
    - revalidatePath('/products')
    - clearPath('/products')
    - invalidate('/products')
  correctIndex: 1
  explanation: "`revalidatePath('/products')` from `next/cache` invalidates the cached response for a specific URL path on the next request."
- id: q10
  question: Which combination on a single fetch is INVALID?
  options:
    - "cache: 'no-store' (alone)"
    - "next: { revalidate: 60 } (alone)"
    - "cache: 'no-store' AND next: { revalidate: 60 } simultaneously"
    - "next: { tags: ['products'] } (alone)"
  correctIndex: 2
  explanation: You cannot combine `no-store` (never cache) with `revalidate` (cache and refresh) on the same fetch — they are contradictory cache strategies.
```

