---
slug: nextjs-advanced-patterns-capstone-prep
id: nextjs-20
track: nextjs
order: 20
title: Advanced Patterns and Capstone Prep
description: Master advanced App Router patterns — parallel and intercepting routes, streaming with Suspense, optimistic UI, error recovery, and prepare for the capstone project.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dufPA_v48YM&t=120s
whyItMatters: Master advanced App Router patterns — parallel and intercepting routes, streaming with Suspense, optimistic UI, error recovery, and prepare for the capstone project.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Advanced Patterns and Capstone Prep

## Advanced Patterns and Capstone Prep

### Why It Matters

Master advanced App Router patterns — parallel and intercepting routes, streaming with Suspense, optimistic UI, error recovery, and prepare for the capstone project.

Master advanced App Router patterns — parallel and intercepting routes, streaming with Suspense, optimistic UI, error recovery, and prepare for the capstone project.

### Prerequisites

- Stage 19: Deployment — Vercel, Docker, Self-Host.
- Stages 1-19 (the full track).
- Comfort with server/client component composition.

### Topics

- Parallel routes (`@folder`) for simultaneous layouts
- Intercepting routes (`(.)`, `(..)`, `(...)`) for modals and contextual navigation
- Streaming with multiple Suspense boundaries
- Optimistic UI with `useOptimistic` (React 19)
- Custom `fetch` wrappers with retries and auth
- Co-locating queries with React Query for client-side caching
- Route segment config (`revalidate`, `dynamic`, `runtime`) deep-dive
- Capstone project preparation: scope, file structure, dependencies

### Key Concepts

- Parallel routes render multiple pages in one layout via named slots (`@analytics`, `@team`)
- Intercepting routes "catch" a navigation and render it in a modal without losing context (e.g. photo modal in a feed)
- Streaming with Suspense lets part of a page render while slow data loads in the background
- `useOptimistic` lets you show predicted state immediately and reconcile when the action resolves
- For the capstone, plan a clear scope (auth + CRUD + deployment), pick the stack early, and write tests from day one

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <section className="col-span-2">{children}</section>
      <aside>{analytics}</aside>
      <aside>{team}</aside>
    </div>
  );
}

// app/dashboard/@analytics/page.tsx  -> renders into the `analytics` slot
// app/dashboard/@team/page.tsx      -> renders into the `team` slot
```
Caption: Parallel routes

### Common Pitfalls

- Using parallel routes without a `default.tsx` for each slot — Next.js requires a `default` export for slots that may not match the current URL (e.g. initial load).
- Forgetting that intercepting routes only work for soft navigations — a full page reload on `/feed/photo/1` renders the full `photo/[id]/page.tsx`, not the modal.
- Wrapping the whole page in one Suspense boundary — that defeats streaming; wrap each slow component separately so they stream in independently.
- Using `useOptimistic` without reconciling on action failure — if the action fails, the optimistic state stays; reset it in a `catch` or use `useActionState`'s returned error.
- Over-engineering the capstone — pick a focused scope (one CRUD entity + auth + deployment) and ship it; you can extend with stretch goals after.

### Real-World Applications

- Vercel's dashboard uses parallel routes to render analytics, activity, and team widgets in one layout.
- Notion uses intercepting routes to open doc previews in modals without losing the workspace context.
- Linear uses `useOptimistic` for instant issue status changes that reconcile with the server.
- Twitch uses streaming Suspense to show the player immediately while chat and analytics load in.

### Interview Questions

- 1. What are parallel routes? — Named slots (`@analytics`, `@team`) that render multiple pages simultaneously into one layout, useful for dashboards with multiple panels.
- 2. What are intercepting routes for? — Catching a soft navigation and rendering it in a different context (e.g. a photo modal over a feed) without losing the original page.
- 3. How does Suspense streaming improve UX? — Each Suspense boundary streams independently, so fast content shows immediately while slow data loads in the background.
- 4. What does `useOptimistic` do? — Shows predicted state immediately (e.g. incremented like count) and reconciles when the underlying action resolves.
- 5. How do you prepare for the capstone? — Pick a focused scope, define file structure and stack early, write tests from day one, and deploy continuously.

### Mini Project

Build a feed with modal previews: A `/feed` page rendering a list of photos, an intercepting route that opens a photo in a modal on soft navigation, and a parallel `@stats` slot showing live stats — all streaming with Suspense. Suggested approach:
  - Create `app/feed/page.tsx` rendering a grid of photos
  - Add `app/feed/photo/[id]/page.tsx` for full-page photo view (direct nav)
  - Add `app/feed/@modal/(..)photo/[id]/page.tsx` with a `<Modal>` wrapper
  - Add `app/feed/@modal/default.tsx` returning null
  - Wrap the stats panel in a Suspense boundary so it streams in

### Exercises

1. Create a layout with two parallel slots (`@main` and `@sidebar`) and add `default.tsx` for each.
2. Add an intercepting route that opens a modal on soft navigation and verify a full reload shows the page route.
3. Wrap two slow components in separate Suspense boundaries and observe them streaming in.
4. Use `useOptimistic` for a like button and confirm the count updates instantly.
5. Scope the capstone project: write a 2-sentence problem statement, list the entities, and pick the stack.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What do parallel routes enable?
9. A) Two URLs for the same page
10. B) Caching of routes
11. C) Background data fetching
12. D) Multiple pages rendered simultaneously into one layout via named slots (*)
13. Explanation: Parallel routes use named slots (e.g. `@analytics`, `@team`) to render multiple page components into a single layout, perfect for dashboards with multiple panels.
14. Q2: What do intercepting routes do?
15. A) Catch a soft navigation and render it in a different context (e.g. a modal) without losing the original page (*)
16. B) Block navigation entirely
17. C) Cache the destination
18. D) Redirect to a 404
19. Explanation: Intercepting routes (`(..)folder`) catch a soft navigation and render it differently — e.g. opening a photo in a modal over the feed — without losing the original page context.
20. Q3: What is required for each parallel slot that may not match the current URL?
21. A) A loading.tsx
22. B) A default.tsx export (*)
23. C) An error.tsx
24. D) A page.tsx
25. Explanation: Each parallel slot needs a `default.tsx` to handle cases where the URL does not provide content for that slot (e.g. initial load).
26. Q4: Why wrap each slow component in its own Suspense boundary?
27. A) To increase bundle size
28. B) To enable caching
29. C) So each one streams independently — fast content shows immediately while slow data loads (*)
30. D) To skip rendering
31. Explanation: Multiple Suspense boundaries let each slow component stream in independently; one big boundary would block the whole page until everything resolves.
32. Q5: What does `useOptimistic` do?
33. A) Caches data optimistically
34. B) Skips server validation
35. C) Disables errors
36. D) Shows predicted state immediately and reconciles when the action resolves (*)
37. Explanation: `useOptimistic` lets you render predicted state (e.g. an incremented like count) instantly, then reconciles with the real result when the action resolves or rolls back on error.
38. Q6: When does an intercepting route NOT apply?
39. A) On a full page reload (direct URL) — the regular page route is used (*)
40. B) On soft navigation
41. C) On hover
42. D) On click
43. Explanation: Intercepting routes only apply on soft (client-side) navigation; a full page reload or direct URL load renders the standard `photo/[id]/page.tsx` instead of the modal.
44. Q7: How should you scope a capstone project?
45. A) Build everything you can think of
46. B) Pick a focused scope (one CRUD entity + auth + deployment) and ship it (*)
47. C) Skip auth
48. D) Skip deployment
49. Explanation: A focused scope (one entity, auth, deployment) ships in the time you have; stretch goals can come after the MVP is live.
50. Q8: What is the syntax for an intercepting route that goes up one level?
51. A) (.)folder
52. B) (...)folder
53. C) (..)folder (*)
54. D) (../)folder
55. Explanation: `(.)` matches the same level, `(..)` matches one level up, `(..)(..)` two levels up, and `(...)` matches the root app directory.
56. Q9: Why must you reconcile `useOptimistic` on action failure?
57. A) It auto-resets
58. B) It throws an error
59. C) It is impossible to fail
60. D) Optimistic state stays even if the action fails; you must roll it back in a catch or via useActionState's error return (*)
61. Explanation: `useOptimistic` does not auto-rollback; if the action throws, the optimistic state remains. Handle errors explicitly (try/catch or `useActionState`) to revert.
62. Q10: Which route segment config option opts a route into the edge runtime?
63. A) export const runtime = 'edge' (*)
64. B) export const edge = true
65. C) middleware matcher
66. D) next.config.mjs edge: true
67. Explanation: `export const runtime = 'edge'` in a page or route handler opts that route into the Edge runtime; the default is `'nodejs'`.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: What do parallel routes enable?
  options:
    - Two URLs for the same page
    - Caching of routes
    - Background data fetching
    - Multiple pages rendered simultaneously into one layout via named slots
  correctIndex: 3
  explanation: Parallel routes use named slots (e.g. `@analytics`, `@team`) to render multiple page components into a single layout, perfect for dashboards with multiple panels.
- id: q2
  question: What do intercepting routes do?
  options:
    - Catch a soft navigation and render it in a different context (e.g. a modal) without losing the original page
    - Block navigation entirely
    - Cache the destination
    - Redirect to a 404
  correctIndex: 0
  explanation: Intercepting routes (`(..)folder`) catch a soft navigation and render it differently — e.g. opening a photo in a modal over the feed — without losing the original page context.
- id: q3
  question: What is required for each parallel slot that may not match the current URL?
  options:
    - A loading.tsx
    - A default.tsx export
    - An error.tsx
    - A page.tsx
  correctIndex: 1
  explanation: Each parallel slot needs a `default.tsx` to handle cases where the URL does not provide content for that slot (e.g. initial load).
- id: q4
  question: Why wrap each slow component in its own Suspense boundary?
  options:
    - To increase bundle size
    - To enable caching
    - So each one streams independently — fast content shows immediately while slow data loads
    - To skip rendering
  correctIndex: 2
  explanation: Multiple Suspense boundaries let each slow component stream in independently; one big boundary would block the whole page until everything resolves.
- id: q5
  question: What does `useOptimistic` do?
  options:
    - Caches data optimistically
    - Skips server validation
    - Disables errors
    - Shows predicted state immediately and reconciles when the action resolves
  correctIndex: 3
  explanation: "`useOptimistic` lets you render predicted state (e.g. an incremented like count) instantly, then reconciles with the real result when the action resolves or rolls back on error."
- id: q6
  question: When does an intercepting route NOT apply?
  options:
    - On a full page reload (direct URL) — the regular page route is used
    - On soft navigation
    - On hover
    - On click
  correctIndex: 0
  explanation: Intercepting routes only apply on soft (client-side) navigation; a full page reload or direct URL load renders the standard `photo/[id]/page.tsx` instead of the modal.
- id: q7
  question: How should you scope a capstone project?
  options:
    - Build everything you can think of
    - Pick a focused scope (one CRUD entity + auth + deployment) and ship it
    - Skip auth
    - Skip deployment
  correctIndex: 1
  explanation: A focused scope (one entity, auth, deployment) ships in the time you have; stretch goals can come after the MVP is live.
- id: q8
  question: What is the syntax for an intercepting route that goes up one level?
  options:
    - (.)folder
    - (...)folder
    - (..)folder
    - (../)folder
  correctIndex: 2
  explanation: "`(.)` matches the same level, `(..)` matches one level up, `(..)(..)` two levels up, and `(...)` matches the root app directory."
- id: q9
  question: Why must you reconcile `useOptimistic` on action failure?
  options:
    - It auto-resets
    - It throws an error
    - It is impossible to fail
    - Optimistic state stays even if the action fails; you must roll it back in a catch or via useActionState's error return
  correctIndex: 3
  explanation: "`useOptimistic` does not auto-rollback; if the action throws, the optimistic state remains. Handle errors explicitly (try/catch or `useActionState`) to revert."
- id: q10
  question: Which route segment config option opts a route into the edge runtime?
  options:
    - export const runtime = 'edge'
    - export const edge = true
    - middleware matcher
    - "next.config.mjs edge: true"
  correctIndex: 0
  explanation: "`export const runtime = 'edge'` in a page or route handler opts that route into the Edge runtime; the default is `'nodejs'`."
```

