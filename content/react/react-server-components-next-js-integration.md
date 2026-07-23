---
slug: react-server-components-next-js-integration
id: react-19
track: react
order: 19
title: Server Components and Next.js Integration
description: "Adopt React Server Components (RSC) and Next.js App Router: render on the server by default, stream with Suspense, and add interactivity selectively with `'use client'`."
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=1080s
whyItMatters: "Adopt React Server Components (RSC) and Next. js App Router: render on the server by default, stream with Suspense, and add interactivity selectively with `'use client'`."
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Server Components and Next.js Integration

## Server Components and Next.js Integration

### Why It Matters

Adopt React Server Components (RSC) and Next. js App Router: render on the server by default, stream with Suspense, and add interactivity selectively with `'use client'`.

Adopt React Server Components (RSC) and Next.js App Router: render on the server by default, stream with Suspense, and add interactivity selectively with `'use client'`.

### Prerequisites

- Stage 18: Testing.
- Stage 14: Error Boundaries and Suspense.
- SSR vs CSR concepts, the request/response cycle.

### Topics

- React Server Components (RSC) and the server/client split
- Next.js App Router: `app/` directory, layouts, pages
- `'use client'` and `'use server'` directives
- Data fetching in server components (async/await)
- Streaming with Suspense
- Server Actions for mutations
- When to use client vs server components
- Hydration, layout shifts, and SEO benefits

### Key Concepts

- Server components render on the server and ship zero JS to the client by default
- Client components (marked `'use client'`) run on the client and can use state, effects, and event handlers
- Server components can fetch data directly with async/await — no `useEffect`
- Server Actions (`'use server'`) let client components call server-side mutations without writing API routes
- Streaming with Suspense sends HTML progressively, improving perceived performance

```tsx
// app/users/page.tsx — server component by default
import { db } from "@/lib/db";

export default async function UsersPage() {
  const users = await db.user.findMany();   // direct DB access, no API route
  return (
    <ul>
      {users.map((u) => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```
Caption: Server component with async data fetch

### Common Pitfalls

- Adding `'use client'` to the root layout — opts the entire app into client rendering and kills RSC benefits. Keep layout as a server component; mark only interactive children as `'use client'`.
- Trying to use `useState`/`useEffect` in a server component — they only work in client components; the bundler errors. Add `'use client'` at the top.
- Passing functions from a server component to a client component as props — functions aren't serializable across the boundary; pass data, or extract the client piece into a Server Action.
- Forgetting `revalidatePath` / `revalidateTag` after a Server Action — the cached page stays stale; users see old data until revalidation.
- Hydration mismatches from server/client divergence — never render time-dependent or `window`-dependent values in a server component.

### Real-World Applications

- Vercel.com itself is built on Next.js App Router with RSC for marketing pages and client components for the interactive dashboard.
- Hulu's marketing site uses Next.js + RSC for fast first paint and SEO; interactive video previews are client islands.
- Notion's public-facing site and many marketing pages use Next.js with server components for content rendering.
- TikTok's web experience uses Next.js with RSC for feed rendering and client islands for the video player.

### Interview Questions

- 1. What is a React Server Component? — A component that renders on the server and ships zero JS to the client; it can fetch data directly with async/await but cannot use hooks or browser APIs.
- 2. When do you need `'use client'`? — When a component needs state (`useState`), effects (`useEffect`), event handlers, or browser APIs. Server components are the default in the App Router.
- 3. What is a Server Action? — A function marked `'use server'` that runs on the server and is callable from client components via a special RPC; replaces hand-written POST endpoints for mutations.
- 4. Why stream with Suspense in RSC? — To send HTML progressively: ship the static shell immediately, stream slow data in as it resolves, improving TTFB and perceived performance.
- 5. What can't you pass from a server to a client component? — Functions and class instances aren't serializable; pass plain data, or move the function into a Server Action.

### Mini Project

Build a "Blog with RSC": A Next.js App Router blog with a server-rendered post list, individual post pages fetched from a database (or markdown files), and a client-side "Like" button using a Server Action. Stream the comments section with Suspense. Suggested approach:
  - Use the App Router `app/` directory
  - Render post list and post pages as server components with async fetch
  - Create a `LikeButton` client component that calls a Server Action
  - Use `revalidatePath("/posts/[slug]")` after a like
  - Wrap `<Comments/>` (slow fetch) in `<Suspense>` to stream it in

### Exercises

1. Convert a client-rendered page to a server component and remove the `useEffect` fetch.
2. Mark a component `'use client'` and confirm `useState` now works.
3. Create a Server Action that inserts a row and call it from a form `action` prop.
4. Add `revalidatePath` after a mutation and confirm the page updates.
5. Wrap a slow server component in `<Suspense>` and observe streaming in the network tab.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is a React Server Component (RSC)?
9. A) A component that runs only on the client
10. B) A class component
11. C) A component that renders on the server and ships zero JS to the client (*)
12. D) A Suspense boundary
13. Explanation: RSC renders on the server, can fetch data directly with async/await, and ships zero JS for the component itself to the client — only its serialized output.
14. Q2: When must you add `'use client'`?
15. A) For every component
16. B) For server actions
17. C) Only for layouts
18. D) When the component uses useState, useEffect, event handlers, or browser APIs (*)
19. Explanation: Hooks, effects, event handlers, and browser APIs run only on the client; mark such components `'use client'` so the bundler treats them accordingly.
20. Q3: What can a server component do that a client component cannot?
21. A) Fetch data directly with async/await and access server-only APIs (*)
22. B) Use useState
23. C) Attach onClick handlers
24. D) Render JSX
25. Explanation: Server components can use async/await and access server-only resources (DB, secrets); they cannot use hooks or browser APIs.
26. Q4: What is a Server Action?
27. A) A React hook
28. B) A function marked `'use server'` callable from client components for mutations (*)
29. C) A type of Suspense
30. D) A CSS class
31. Explanation: Server Actions run on the server and can be called from client components (e.g. via a form `action` prop), replacing hand-written API routes for mutations.
32. Q5: Why call `revalidatePath` after a Server Action?
33. A) To clear the React cache
34. B) To re-render the client component
35. C) To refresh the cached page so users see updated data (*)
36. D) For SEO
37. Explanation: Next.js caches routes; without `revalidatePath` (or `revalidateTag`), users see stale data after a mutation. Revalidation refreshes the cached HTML.
38. Q6: What can't you pass from a server component to a client component as a prop?
39. A) Strings
40. B) Numbers
41. C) Arrays of plain data
42. D) Functions and class instances (*)
43. Explanation: The server/client boundary serializes props; functions and class instances aren't serializable. Pass plain data, or extract the function into a Server Action.
44. Q7: Why stream with Suspense in RSC?
45. A) To send HTML progressively — ship the shell now, stream slow data later (*)
46. B) For SEO
47. C) To enable client components
48. D) To skip rendering
49. Explanation: Streaming sends the static shell immediately and fills in slow async sections as they resolve, improving perceived performance and TTFB.
50. Q8: Why is adding `'use client'` to the root layout an anti-pattern?
51. A) It's deprecated
52. B) It opts the entire app into client rendering, killing RSC benefits (*)
53. C) It breaks TypeScript
54. D) It disables Suspense
55. Explanation: The root layout is a server component by default; marking it `'use client'` forces everything below into the client bundle, defeating server components.
56. Q9: Which is a hydration mismatch risk in RSC?
57. A) Passing plain data
58. B) Using async/await
59. C) Rendering `Date.now()` or `Math.random()` in a server component (*)
60. D) Streaming with Suspense
61. Explanation: Time- or randomness-dependent values differ between server and client renders; React warns and discards the server HTML. Read such values in client effects.
62. Q10: Which is true about RSC and SEO?
63. A) RSC hurts SEO
64. B) RSC has no SEO impact
65. C) RSC requires client-side rendering for SEO
66. D) RSC improves SEO because content renders server-side and ships as HTML (*)
67. Explanation: Server components render HTML on the server, so crawlers receive fully-formed content — improving SEO and first paint vs client-only rendering.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is a React Server Component (RSC)?
  options:
    - "?"
    - A component that runs only on the client
    - A class component
    - A component that renders on the server and ships zero JS to the client
    - A Suspense boundary
  correctIndex: 3
  explanation: RSC renders on the server, can fetch data directly with async/await, and ships zero JS for the component itself to the client — only its serialized output.
- id: q2
  question: When must you add `'use client'`?
  options:
    - For every component
    - For server actions
    - Only for layouts
    - When the component uses useState, useEffect, event handlers, or browser APIs
  correctIndex: 3
  explanation: Hooks, effects, event handlers, and browser APIs run only on the client; mark such components `'use client'` so the bundler treats them accordingly.
- id: q3
  question: What can a server component do that a client component cannot?
  options:
    - Fetch data directly with async/await and access server-only APIs
    - Use useState
    - Attach onClick handlers
    - Render JSX
  correctIndex: 0
  explanation: Server components can use async/await and access server-only resources (DB, secrets); they cannot use hooks or browser APIs.
- id: q4
  question: What is a Server Action?
  options:
    - A React hook
    - A function marked `'use server'` callable from client components for mutations
    - A type of Suspense
    - A CSS class
  correctIndex: 1
  explanation: Server Actions run on the server and can be called from client components (e.g. via a form `action` prop), replacing hand-written API routes for mutations.
- id: q5
  question: Why call `revalidatePath` after a Server Action?
  options:
    - To clear the React cache
    - To re-render the client component
    - To refresh the cached page so users see updated data
    - For SEO
  correctIndex: 2
  explanation: Next.js caches routes; without `revalidatePath` (or `revalidateTag`), users see stale data after a mutation. Revalidation refreshes the cached HTML.
- id: q6
  question: What can't you pass from a server component to a client component as a prop?
  options:
    - Strings
    - Numbers
    - Arrays of plain data
    - Functions and class instances
  correctIndex: 3
  explanation: The server/client boundary serializes props; functions and class instances aren't serializable. Pass plain data, or extract the function into a Server Action.
- id: q7
  question: Why stream with Suspense in RSC?
  options:
    - To send HTML progressively — ship the shell now, stream slow data later
    - For SEO
    - To enable client components
    - To skip rendering
  correctIndex: 0
  explanation: Streaming sends the static shell immediately and fills in slow async sections as they resolve, improving perceived performance and TTFB.
- id: q8
  question: Why is adding `'use client'` to the root layout an anti-pattern?
  options:
    - It's deprecated
    - It opts the entire app into client rendering, killing RSC benefits
    - It breaks TypeScript
    - It disables Suspense
  correctIndex: 1
  explanation: The root layout is a server component by default; marking it `'use client'` forces everything below into the client bundle, defeating server components.
- id: q9
  question: Which is a hydration mismatch risk in RSC?
  options:
    - Passing plain data
    - Using async/await
    - Rendering `Date.now()` or `Math.random()` in a server component
    - Streaming with Suspense
  correctIndex: 2
  explanation: Time- or randomness-dependent values differ between server and client renders; React warns and discards the server HTML. Read such values in client effects.
- id: q10
  question: Which is true about RSC and SEO?
  options:
    - RSC hurts SEO
    - RSC has no SEO impact
    - RSC requires client-side rendering for SEO
    - RSC improves SEO because content renders server-side and ships as HTML
  correctIndex: 3
  explanation: Server components render HTML on the server, so crawlers receive fully-formed content — improving SEO and first paint vs client-only rendering.
```

