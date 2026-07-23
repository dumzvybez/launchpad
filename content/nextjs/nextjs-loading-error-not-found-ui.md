---
slug: nextjs-loading-error-not-found-ui
id: nextjs-04
track: nextjs
order: 4
title: Loading, Error, and Not-Found UI
description: Add loading.tsx, error.tsx, not-found.tsx, and global-error.tsx to your routes to handle streaming, errors, and 404s gracefully.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A63UxsQsEbU&t=90s
whyItMatters: Add loading. tsx, error.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Loading, Error, and Not-Found UI

## Loading, Error, and Not-Found UI

### Why It Matters

Add loading. tsx, error.

Add loading.tsx, error.tsx, not-found.tsx, and global-error.tsx to your routes to handle streaming, errors, and 404s gracefully.

### Prerequisites

- Stage 3: Pages, Layouts, and Templates.
- React error boundaries and Suspense basics.
- Understanding of async rendering and streaming.

### Topics

- loading.tsx: Suspense fallback for a route
- error.tsx: route-level error boundary (must be a client component)
- not-found.tsx: 404 UI for unmatched routes
- global-error.tsx: top-level error boundary that replaces <html>/<body>
- How loading.tsx streams content with React Suspense
- Throwing errors from server components and catching in error.tsx
- Calling `notFound()` to trigger the not-found UI programmatically
- Nested error/loading boundaries along the route tree

### Key Concepts

- loading.tsx wraps the page in a Suspense boundary — Next.js streams the fallback first, then the page
- error.tsx must be a client component (it needs to recover from errors interactively)
- error.tsx receives `{ error, reset }` props; `reset()` re-renders the route
- not-found.tsx renders when `notFound()` is called OR no route matches
- global-error.tsx replaces the root layout if the root layout itself throws — it must render `<html>` and `<body>`

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="h-6 w-1/3 bg-gray-200 rounded mb-4" />
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-2/3 bg-gray-200 rounded" />
    </div>
  );
}
```
Caption: loading.tsx

### Common Pitfalls

- Forgetting `'use client'` on error.tsx — error boundaries must be client components because they use React state and event handlers to recover; a server error.tsx fails the build.
- Expecting error.tsx to catch errors in the root layout — it cannot, because the root layout wraps error.tsx; use `global-error.tsx` for root layout errors.
- Calling `notFound()` from a client component — `notFound()` is a server-side throw; in client components you must navigate to a non-existent route or render a custom 404 inline.
- Treating `error.digest` as a public message — the digest is a stable hash for server logs; do not surface it as user-facing text because it leaks nothing useful to users and may be confusing.
- Assuming loading.tsx replaces the page on slow navigations — it only shows during the streaming of the new page's server work; client-side navigations show the previous page until the new one streams in.

### Real-World Applications

- Vercel's dashboard uses nested loading.tsx skeletons for project views so users see instant feedback while analytics stream in.
- Notion surfaces friendly not-found pages when a shared doc link is revoked or the page does not exist.
- Twitch uses error.tsx boundaries in dashboards so a single failing widget (e.g. analytics) does not break the whole creator studio.
- Hulu uses global-error.tsx to recover from layout-level failures during live events, ensuring the page never fully white-screens.

### Interview Questions

- 1. Why must error.tsx be a client component? — Error boundaries use React state and an event handler (`reset()`) to recover, which require client-side interactivity; server components cannot be error boundaries.
- 2. What does `loading.tsx` do under the hood? — It wraps the page's segment in a React Suspense boundary and streams the fallback first, then the resolved page.
- 3. How do you trigger the 404 UI from a server component? — Call `notFound()` from `next/navigation`; Next.js throws a special error caught by the nearest not-found.tsx.
- 4. What is `global-error.tsx` for? — It catches errors thrown by the root layout itself, replacing `<html>`/`<body>` while the rest of the app reinitializes; it must render those tags itself.
- 5. Does `error.tsx` catch errors thrown in sibling layout files? — Only errors in the same segment or below; a layout error is caught by an error.tsx at the same level or higher, never lower.

### Mini Project

Build a resilient blog reader: A `/blog/[slug]` page that streams the post with a `loading.tsx` skeleton, throws into `error.tsx` when the API fails, and shows `not-found.tsx` when the slug does not exist. Suggested approach:
  - Create `app/blog/[slug]/page.tsx` that fetches a post and calls `notFound()` if missing
  - Add `app/blog/[slug]/loading.tsx` with a shimmering skeleton
  - Add `app/blog/[slug]/error.tsx` as a client component with a Retry button
  - Add a top-level `app/not-found.tsx` for unmatched routes
  - Add `app/global-error.tsx` rendering `<html>/<body>` for worst-case recovery

### Exercises

1. Add `loading.tsx` to `/dashboard` and observe the skeleton appearing before the page resolves.
2. Throw an error from a server component and confirm `error.tsx` catches it with a Retry button.
3. Call `notFound()` from a page when data is missing and verify the not-found UI renders.
4. Create `app/global-error.tsx` and manually throw from the root layout to test the worst-case boundary.
5. Add a nested `error.tsx` inside `/dashboard/settings` and verify it catches only settings errors, not dashboard-wide ones.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which file acts as a Suspense fallback while a route's server work streams in?
9. A) error.tsx
10. B) not-found.tsx
11. C) template.tsx
12. D) loading.tsx (*)
13. Explanation: `loading.tsx` wraps the page's segment in a Suspense boundary and Next.js streams the fallback first, then the resolved page content.
14. Q2: Why MUST error.tsx start with `'use client'`?
15. A) Error boundaries need React state and reset() to recover, which require client-side rendering (*)
16. B) Server components cannot have props
17. C) Server components throw uncatchable errors
18. D) Vercel only deploys client components as error boundaries
19. Explanation: Error boundaries use React state and an event handler (reset) to recover; server components cannot be error boundaries, so error.tsx must be a client component.
20. Q3: Which function from `next/navigation` triggers the not-found UI?
21. A) throw404()
22. B) notFound() (*)
23. C) notFound(true)
24. D) render404()
25. Explanation: `notFound()` throws a special internal error caught by the nearest `not-found.tsx`, rendering the 404 UI for that segment.
26. Q4: Which file catches errors thrown by the ROOT layout itself?
27. A) app/error.tsx
28. B) app/not-found.tsx
29. C) app/global-error.tsx (*)
30. D) app/loading.tsx
31. Explanation: `global-error.tsx` replaces the root layout when it throws; it must render `<html>` and `<body>` itself because the root layout is bypassed.
32. Q5: What props does an error.tsx component receive?
33. A) { error, reset }
34. B) { error, reset, params }
35. C) { error, retry, digest }
36. D) { error, reset } where error has an optional digest field (*)
37. Explanation: error.tsx receives `{ error, reset }` where `error` is an Error (with optional `digest` hash for server logs) and `reset()` re-renders the route.
38. Q6: Where does loading.tsx render relative to the page?
39. A) In place of the page while it streams, then swapped out (*)
40. B) Below the page
41. C) Above the page
42. D) Only on initial server load, not client navigations
43. Explanation: The loading.tsx fallback renders in place of the page while the server work streams; once the page is ready, React swaps it in.
44. Q7: Can error.tsx catch an error in its parent layout?
45. A) Yes
46. B) No, only errors in the same segment or below (*)
47. C) Only if it has 'use client'
48. D) Only with global-error.tsx
49. Explanation: error.tsx catches errors in its segment and below; errors in a parent layout bubble up to a higher error boundary or global-error.tsx.
50. Q8: What is `error.digest` for?
51. A) A user-facing error message
52. B) A retry counter
53. C) A stable hash to correlate client errors with server logs (*)
54. D) The HTTP status code
55. Explanation: `digest` is a stable hash of the error generated on the server, letting you correlate a user-reported error with server logs without exposing internals.
56. Q9: What happens if you call notFound() in a client component?
57. A) It throws and renders not-found.tsx
58. B) It is a no-op
59. C) It crashes the build
60. D) It is only valid in server components; client components must navigate to a missing route or render a custom 404 (*)
61. Explanation: `notFound()` is a server-side throw; in client components you handle missing data by navigating to a missing route or rendering your own inline 404.
62. Q10: Which is true about nested error boundaries?
63. A) Each segment can have its own error.tsx, and errors bubble up to the nearest one (*)
64. B) Only one error boundary per app is allowed
65. C) error.tsx must always be at the root
66. D) Nested error boundaries cause hydration errors
67. Explanation: Each segment can declare its own error.tsx; an error bubbles up to the nearest one, allowing fine-grained recovery without losing the whole page.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which file acts as a Suspense fallback while a route's server work streams in?
  options:
    - error.tsx
    - not-found.tsx
    - template.tsx
    - loading.tsx
  correctIndex: 3
  explanation: "`loading.tsx` wraps the page's segment in a Suspense boundary and Next.js streams the fallback first, then the resolved page content."
- id: q2
  question: Why MUST error.tsx start with `'use client'`?
  options:
    - Error boundaries need React state and reset() to recover, which require client-side rendering
    - Server components cannot have props
    - Server components throw uncatchable errors
    - Vercel only deploys client components as error boundaries
  correctIndex: 0
  explanation: Error boundaries use React state and an event handler (reset) to recover; server components cannot be error boundaries, so error.tsx must be a client component.
- id: q3
  question: Which function from `next/navigation` triggers the not-found UI?
  options:
    - throw404()
    - notFound()
    - notFound(true)
    - render404()
  correctIndex: 1
  explanation: "`notFound()` throws a special internal error caught by the nearest `not-found.tsx`, rendering the 404 UI for that segment."
- id: q4
  question: Which file catches errors thrown by the ROOT layout itself?
  options:
    - app/error.tsx
    - app/not-found.tsx
    - app/global-error.tsx
    - app/loading.tsx
  correctIndex: 2
  explanation: "`global-error.tsx` replaces the root layout when it throws; it must render `<html>` and `<body>` itself because the root layout is bypassed."
- id: q5
  question: What props does an error.tsx component receive?
  options:
    - "{ error, reset }"
    - "{ error, reset, params }"
    - "{ error, retry, digest }"
    - "{ error, reset } where error has an optional digest field"
  correctIndex: 3
  explanation: error.tsx receives `{ error, reset }` where `error` is an Error (with optional `digest` hash for server logs) and `reset()` re-renders the route.
- id: q6
  question: Where does loading.tsx render relative to the page?
  options:
    - In place of the page while it streams, then swapped out
    - Below the page
    - Above the page
    - Only on initial server load, not client navigations
  correctIndex: 0
  explanation: The loading.tsx fallback renders in place of the page while the server work streams; once the page is ready, React swaps it in.
- id: q7
  question: Can error.tsx catch an error in its parent layout?
  options:
    - Yes
    - No, only errors in the same segment or below
    - Only if it has 'use client'
    - Only with global-error.tsx
  correctIndex: 1
  explanation: error.tsx catches errors in its segment and below; errors in a parent layout bubble up to a higher error boundary or global-error.tsx.
- id: q8
  question: What is `error.digest` for?
  options:
    - A user-facing error message
    - A retry counter
    - A stable hash to correlate client errors with server logs
    - The HTTP status code
  correctIndex: 2
  explanation: "`digest` is a stable hash of the error generated on the server, letting you correlate a user-reported error with server logs without exposing internals."
- id: q9
  question: What happens if you call notFound() in a client component?
  options:
    - It throws and renders not-found.tsx
    - It is a no-op
    - It crashes the build
    - It is only valid in server components; client components must navigate to a missing route or render a custom 404
  correctIndex: 3
  explanation: "`notFound()` is a server-side throw; in client components you handle missing data by navigating to a missing route or rendering your own inline 404."
- id: q10
  question: Which is true about nested error boundaries?
  options:
    - Each segment can have its own error.tsx, and errors bubble up to the nearest one
    - Only one error boundary per app is allowed
    - error.tsx must always be at the root
    - Nested error boundaries cause hydration errors
  correctIndex: 0
  explanation: Each segment can declare its own error.tsx; an error bubbles up to the nearest one, allowing fine-grained recovery without losing the whole page.
```

