---
slug: nextjs-dynamic-routes-generatestaticparams
id: nextjs-07
track: nextjs
order: 7
title: Dynamic Routes and generateStaticParams
description: Use dynamic segments, generate them statically at build time with `generateStaticParams`, and control per-route rendering with `generateMetadata` and dynamic params.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A63UxsQsEbU&t=180s
whyItMatters: Use dynamic segments, generate them statically at build time with `generateStaticParams`, and control per-route rendering with `generateMetadata` and dynamic params.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Dynamic Routes and generateStaticParams

## Dynamic Routes and generateStaticParams

### Why It Matters

Use dynamic segments, generate them statically at build time with `generateStaticParams`, and control per-route rendering with `generateMetadata` and dynamic params.

Use dynamic segments, generate them statically at build time with `generateStaticParams`, and control per-route rendering with `generateMetadata` and dynamic params.

### Prerequisites

- Stage 6: Data Fetching — Server Components, fetch, Caching.
- Stage 2: The App Router and File-Based Routing (dynamic segments).
- Basic understanding of static vs server rendering.

### Topics

- Dynamic segments `[param]` and catch-alls revisited
- `generateStaticParams` to pre-render routes at build time
- Combining `generateStaticParams` with `fetch` caching
- `dynamicParams` (true/false) — allow or reject unbuilt paths
- `generateMetadata` for dynamic page metadata
- Reading `params` synchronously in 14 and asynchronously in 15
- `dynamic = 'force-static'` for fully static routes
- Self-referencing fetch dedupe across layouts and pages

### Key Concepts

- `generateStaticParams` returns an array of `{ param: value }` objects; Next.js pre-renders each one at build time
- Setting `dynamicParams = false` returns 404 for paths not in `generateStaticParams` (pure SSG)
- With `dynamicParams = true` (default), unknown paths render on-demand at runtime
- `generateMetadata` runs on the server and can use `params` to produce per-route SEO tags
- `fetch` calls are deduped per request, so a layout and page can both call the same endpoint without double-fetching

```tsx
// app/blog/[slug]/page.tsx
type Post = { slug: string; title: string; body: string };

export async function generateStaticParams() {
  const posts: { slug: string }[] = await fetch(
    "https://api.example.com/posts"
  ).then((r) => r.json());
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post: Post = await fetch(
    `https://api.example.com/posts/${params.slug}`
  ).then((r) => r.json());
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}
```
Caption: Basic generateStaticParams

### Common Pitfalls

- Forgetting to return `params` as strings — `generateStaticParams` expects all values as strings (URLs are strings); numbers and booleans break the build.
- Setting `dynamicParams = false` and then expecting new content to appear — false means only pre-rendered paths exist; new slugs 404 until the next build.
- Calling `generateStaticParams` from a layout — it only works in `page.tsx` files (and route handlers for static params), not layouts.
- Returning an empty array from `generateStaticParams` and expecting static rendering — empty array means no paths pre-rendered; you must also set `dynamicParams = false` for strict SSG.
- Assuming `params` is available synchronously across versions — in Next.js 15, `params` becomes a Promise and must be awaited; check the version before writing.

### Real-World Applications

- Vercel's docs site uses `generateStaticParams` to pre-render every doc page at build time, producing a fully static site.
- Notion's templates gallery pre-renders each template page with `dynamicParams = false` so only curated templates are reachable.
- Hulu's show catalog uses `generateStaticParams` for top titles and falls back to on-demand rendering for the long tail.
- TikTok's hashtag pages pre-render the top trending tags at build time and dynamically render obscure hashtags on first request.

### Interview Questions

- 1. What does `generateStaticParams` do? — Returns a list of param objects that Next.js pre-renders at build time, making dynamic routes statically generated (SSG).
- 2. What is the difference between `dynamicParams = true` and `false`? — `true` (default) renders unknown paths on-demand at runtime; `false` returns 404 for any path not pre-rendered.
- 3. Can `generateStaticParams` fetch data? — Yes; it runs at build time and can call `fetch` (which is also cached) or any async data source.
- 4. Where is `generateStaticParams` allowed? — Only in `page.tsx` (and route handlers); it cannot be exported from layouts.
- 5. How does `generateMetadata` interact with caching? — It runs on the server and reuses the same `fetch` cache as the page; the same URL is fetched once per request.

### Mini Project

Build a static product catalog: A `/products/[slug]` page that pre-renders the top 50 products at build time, with `dynamicParams = false` so unknown slugs 404, and `generateMetadata` producing per-product OG tags. Suggested approach:
  - Create `app/products/[slug]/page.tsx` with `generateStaticParams` returning 50 slugs from a fake API
  - Set `export const dynamicParams = false`
  - Add `generateMetadata` that fetches the product and returns title/description/OG image
  - Visit a known slug and verify it loads instantly (static)
  - Visit an unknown slug and verify it 404s

### Exercises

1. Add `generateStaticParams` to `/blog/[slug]` and verify the build output pre-renders those paths.
2. Set `dynamicParams = false` and confirm unknown slugs return 404.
3. Add `generateMetadata` returning a custom title per slug; verify the title in the browser tab.
4. Use `fetch` dedupe by calling the same endpoint in both `generateMetadata` and the page; log fetches on the server to confirm one call.
5. Convert a `[...slug]` catch-all to use `generateStaticParams` returning multi-segment arrays.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `generateStaticParams` return?
9. A) A single object with all params
10. B) A Promise of params resolved at runtime
11. C) An array of param objects (e.g. [{ slug: 'a' }]) for paths to pre-render (*)
12. D) An array of URLs
13. Explanation: `generateStaticParams` returns an array of plain objects whose keys match the dynamic segment names; Next.js pre-renders each combination at build time.
14. Q2: What does `export const dynamicParams = false` do?
15. A) Forces all paths to be dynamic
16. B) Disables generateStaticParams
17. C) Enables ISR
18. D) Returns 404 for paths not in generateStaticParams (*)
19. Explanation: `dynamicParams = false` makes the route strictly SSG — any path not pre-rendered at build time returns a 404 instead of being rendered on-demand.
20. Q3: Which file can export `generateStaticParams`?
21. A) page.tsx (*)
22. B) layout.tsx
23. C) error.tsx
24. D) loading.tsx
25. Explanation: `generateStaticParams` is only supported in `page.tsx` (and route handlers) because it pertains to route paths, not layouts or special files.
26. Q4: What is the type of values returned in the param objects?
27. A) Any JSON value
28. B) Strings only (*)
29. C) Numbers
30. D) Booleans
31. Explanation: All param values must be strings because URLs are strings; numbers and booleans break the build. Convert at the call site if needed.
32. Q5: What happens if `generateStaticParams` returns []?
33. A) Build fails
34. B) The route is removed
35. C) No paths pre-rendered; route becomes dynamic unless dynamicParams=false (*)
36. D) All paths are pre-rendered
37. Explanation: An empty array means no paths are pre-rendered; combined with the default `dynamicParams = true`, the route is rendered on-demand. With `false`, every path 404s.
38. Q6: What does `generateMetadata` enable?
39. A) Client-side metadata
40. B) Caching of the entire route
41. C) Static asset optimization
42. D) Per-route SEO tags computed on the server (*)
43. Explanation: `generateMetadata` is an async function that returns a `Metadata` object per route, allowing dynamic titles, descriptions, and OG tags computed server-side.
44. Q7: How does fetch dedupe work across layout and page?
45. A) Calls with the same URL and cache options are deduped per request (*)
46. B) It does not; each fetch runs independently
47. C) Only the first fetch runs; later ones are skipped permanently
48. D) Dedupe only works in production
49. Explanation: Next.js dedupes `fetch` calls with the same input and options within a single render pass, so a layout and page can both call the same endpoint without doubling network traffic.
50. Q8: In Next.js 15, how do you access `params` in a page?
51. A) Synchronously as before
52. B) As a Promise that must be awaited (*)
53. C) Via a hook
54. D) Via context
55. Explanation: Next.js 15 makes `params` and `searchParams` asynchronous (Promises) to support streaming; pages must `await params` before reading values.
56. Q9: Which is true about combining `generateStaticParams` with `fetch`?
57. A) fetch in generateStaticParams is always uncached
58. B) generateStaticParams cannot use fetch
59. C) generateStaticParams can fetch data and the fetch is cached by default like any other (*)
60. D) fetch in generateStaticParams runs on the client
61. Explanation: `generateStaticParams` runs at build time and can call `fetch` with the same caching semantics as pages; the result is reused for pre-rendering.
62. Q10: Which combination produces a strictly static route with no runtime rendering?
63. A) dynamicParams = true, generateStaticParams returning []
64. B) dynamic = 'force-dynamic'
65. C) revalidate = 0
66. D) dynamicParams = false, generateStaticParams returning paths (*)
67. Explanation: `dynamicParams = false` plus a non-empty `generateStaticParams` produces pure SSG: pre-rendered paths only, all others 404.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `generateStaticParams` return?
  options:
    - A single object with all params
    - A Promise of params resolved at runtime
    - "An array of param objects (e.g. [{ slug: 'a' }]) for paths to pre-render"
    - An array of URLs
  correctIndex: 2
  explanation: "`generateStaticParams` returns an array of plain objects whose keys match the dynamic segment names; Next.js pre-renders each combination at build time."
- id: q2
  question: What does `export const dynamicParams = false` do?
  options:
    - Forces all paths to be dynamic
    - Disables generateStaticParams
    - Enables ISR
    - Returns 404 for paths not in generateStaticParams
  correctIndex: 3
  explanation: "`dynamicParams = false` makes the route strictly SSG — any path not pre-rendered at build time returns a 404 instead of being rendered on-demand."
- id: q3
  question: Which file can export `generateStaticParams`?
  options:
    - page.tsx
    - layout.tsx
    - error.tsx
    - loading.tsx
  correctIndex: 0
  explanation: "`generateStaticParams` is only supported in `page.tsx` (and route handlers) because it pertains to route paths, not layouts or special files."
- id: q4
  question: What is the type of values returned in the param objects?
  options:
    - Any JSON value
    - Strings only
    - Numbers
    - Booleans
  correctIndex: 1
  explanation: All param values must be strings because URLs are strings; numbers and booleans break the build. Convert at the call site if needed.
- id: q5
  question: What happens if `generateStaticParams` returns []?
  options:
    - Build fails
    - The route is removed
    - No paths pre-rendered; route becomes dynamic unless dynamicParams=false
    - All paths are pre-rendered
  correctIndex: 2
  explanation: An empty array means no paths are pre-rendered; combined with the default `dynamicParams = true`, the route is rendered on-demand. With `false`, every path 404s.
- id: q6
  question: What does `generateMetadata` enable?
  options:
    - Client-side metadata
    - Caching of the entire route
    - Static asset optimization
    - Per-route SEO tags computed on the server
  correctIndex: 3
  explanation: "`generateMetadata` is an async function that returns a `Metadata` object per route, allowing dynamic titles, descriptions, and OG tags computed server-side."
- id: q7
  question: How does fetch dedupe work across layout and page?
  options:
    - Calls with the same URL and cache options are deduped per request
    - It does not; each fetch runs independently
    - Only the first fetch runs; later ones are skipped permanently
    - Dedupe only works in production
  correctIndex: 0
  explanation: Next.js dedupes `fetch` calls with the same input and options within a single render pass, so a layout and page can both call the same endpoint without doubling network traffic.
- id: q8
  question: In Next.js 15, how do you access `params` in a page?
  options:
    - Synchronously as before
    - As a Promise that must be awaited
    - Via a hook
    - Via context
  correctIndex: 1
  explanation: Next.js 15 makes `params` and `searchParams` asynchronous (Promises) to support streaming; pages must `await params` before reading values.
- id: q9
  question: Which is true about combining `generateStaticParams` with `fetch`?
  options:
    - fetch in generateStaticParams is always uncached
    - generateStaticParams cannot use fetch
    - generateStaticParams can fetch data and the fetch is cached by default like any other
    - fetch in generateStaticParams runs on the client
  correctIndex: 2
  explanation: "`generateStaticParams` runs at build time and can call `fetch` with the same caching semantics as pages; the result is reused for pre-rendering."
- id: q10
  question: Which combination produces a strictly static route with no runtime rendering?
  options:
    - dynamicParams = true, generateStaticParams returning []
    - dynamic = 'force-dynamic'
    - revalidate = 0
    - dynamicParams = false, generateStaticParams returning paths
  correctIndex: 3
  explanation: "`dynamicParams = false` plus a non-empty `generateStaticParams` produces pure SSG: pre-rendered paths only, all others 404."
```

