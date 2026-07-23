---
slug: svelte-sveltekit-load-functions-page-data
id: svelte-14
track: svelte
order: 14
title: SvelteKit — Load Functions and Page Data
description: Fetch and prepare data on the server (and client) with SvelteKit load functions, type-safe page data, and invalidation patterns for re-fetching after mutations.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=WK4SN853CqI&t=120s
whyItMatters: Fetch and prepare data on the server (and client) with SvelteKit load functions, type-safe page data, and invalidation patterns for re-fetching after mutations.
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# SvelteKit — Load Functions and Page Data

## SvelteKit — Load Functions and Page Data

### Why It Matters

Fetch and prepare data on the server (and client) with SvelteKit load functions, type-safe page data, and invalidation patterns for re-fetching after mutations.

Fetch and prepare data on the server (and client) with SvelteKit load functions, type-safe page data, and invalidation patterns for re-fetching after mutations.

### Prerequisites

- Stage 13: SvelteKit — Routing and Layouts
- Async/await and fetch basics.

### Topics

- +page.ts vs +page.server.ts (universal vs server load)
- The load function: ({ params, fetch, depends, parent })
- Returning data to the page via `data` prop
- Layout loads and parent()
- Type safety with PageData / LayoutData generated types
- invalidate() and invalidateAll() for re-fetching
- await server load from universal load
- Error handling with error() and redirect()

### Key Concepts

- Universal load (+page.ts) runs on both server (initial) and client (navigation); can call external APIs
- Server load (+page.server.ts) runs only on the server; can access secrets and the database
- The `data` prop in +page.svelte is typed from the load function's return
- `depends("key")` declares dependencies for fine-grained invalidation
- `invalidate("key")` re-runs loads that called depends("key")
- error() throws a typed HTTP error; redirect() navigates

```ts
// src/routes/users/[id]/+page.server.ts
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
  const res = await fetch(`/api/users/${params.id}`);
  if (!res.ok) throw error(404, "User not found");
  const user = await res.json();
  return { user };
};
```
Caption: Server load

### Common Pitfalls

- Calling fetch() with absolute URLs to your own app in universal load — use the provided `fetch` argument which works on both server and client and includes cookies.
- Putting secrets in +page.ts (universal) — universal load ships to the client; use +page.server.ts for secrets/DB access.
- Forgetting that load runs on every navigation by default — use `depends()` and `invalidate()` for fine-grained re-fetch control.
- Throwing raw Error instead of `error(404, msg)` — use the `error()` helper to produce typed HTTP responses.
- Not awaiting parent() in nested loads — parent() returns a promise of inherited data; await it before using.

### Real-World Applications

- The New York Times uses server loads to fetch article content server-side for SEO and fast first paint.
- Apple Music's web player uses universal loads to fetch playlists with client-side caching across navigations.
- Rakuten's product pages use server loads with the database adapter to render server-side for SEO and invalidation on add-to-cart.
- Chess.com uses load functions to fetch game PGNs with `depends()` so analysis tools can invalidate just the moves.

### Interview Questions

- 1. What's the difference between +page.ts and +page.server.ts? — +page.ts is universal (runs on server initially and on client for navigations); +page.server.ts is server-only and can access secrets.
- 2. How does +page.svelte access load data? — Via `let { data } = $props()`; `data` is typed from the load function's return type.
- 3. What does depends("key") do? — Declares a dependency key for the load so `invalidate("key")` can re-run just that load.
- 4. When should you use parent()? — In nested layouts/pages to access data returned by parent load functions.
- 5. How do you trigger a load re-fetch after a mutation? — Call `invalidate("key")` or `invalidateAll()` from `$app/navigation`.

### Mini Project

Build a Blog with Server Load and Invalidation: A SvelteKit blog with /, /posts/[slug], and /admin routes. /posts/[slug] uses a server load to fetch the post; /admin uses universal load with depends("posts:all") and a "Refresh" button that calls invalidate. Suggested approach:
  - Create +page.server.ts for /posts/[slug] returning { post }
  - Type data in +page.svelte via $props()
  - Add +page.ts for /admin with depends("admin:posts")
  - Use invalidate("admin:posts") after a delete button calls the API
  - Use error(404, ...) for missing posts

### Exercises

1. Build a +page.server.ts that fetches a list of users from /api/users.
2. Consume data in +page.svelte via `let { data } = $props()`.
3. Add depends() to a load and trigger invalidate() from a button.
4. Use parent() to inherit user data from a root layout load.
5. Throw error(404) for a missing post and observe the error page.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which file holds a SERVER-only load function?
9. A) +page.ts
10. B) +page.server.ts (*)
11. C) +page.svelte
12. D) +layout.svelte
13. Explanation: +page.server.ts runs on the server only (initial SSR and during client navigations via fetch); it can access secrets and the DB.
14. Q2: Which file holds a UNIVERSAL load function?
15. A) +page.server.ts
16. B) +page.svelte
17. C) +page.ts (*)
18. D) svelte.config.js
19. Explanation: +page.ts is universal — runs on the server initially and on the client during navigations; can call external APIs but not access server secrets.
20. Q3: How does +page.svelte receive load data?
21. A) this.data
22. B) useLoader()
23. C) window.__data
24. D) let { data } = $props() (*)
25. Explanation: Svelte 5 + SvelteKit passes data as a prop: `let { data } = $props()`. The type is inferred from the load function's return.
26. Q4: Which load argument should you use to fetch within your own app?
27. A) the `fetch` argument provided to load (*)
28. B) global fetch
29. C) axios
30. D) node-fetch
31. Explanation: Use the `fetch` argument; it includes cookies and works on both server and client, correctly handling your app's internal routes.
32. Q5: What does depends("key") do?
33. A) Logs a dependency
34. B) Declares a dependency for fine-grained invalidation (*)
35. C) Validates the load
36. D) Resets the load
37. Explanation: depends("key") marks the current load as depending on "key"; calling invalidate("key") re-runs just that load.
38. Q6: How do you re-fetch a load after a mutation?
39. A) Reload the page
40. B) Restart the server
41. C) invalidate("key") or invalidateAll() from $app/navigation (*)
42. D) Use goto
43. Explanation: import { invalidate, invalidateAll } from "$app/navigation" — invalidate("key") re-runs loads depending on that key; invalidateAll() re-runs all.
44. Q7: Where should secrets/DB access live?
45. A) +page.ts (universal)
46. B) +page.svelte
47. C) +layout.ts
48. D) +page.server.ts (server only) (*)
49. Explanation: Universal loads (+page.ts) ship to the client; secrets and DB access must be in +page.server.ts which only runs on the server.
50. Q8: What does parent() return in a load?
51. A) A promise of data from parent load functions (*)
52. B) The parent component
53. C) The route params
54. D) The URL
55. Explanation: parent() returns a promise resolving to the merged data from ancestor layout/page loads — await it to access inherited data.
56. Q9: How do you throw a 404 from a load?
57. A) throw new Error("404")
58. B) throw error(404, "Not found") from @sveltejs/kit (*)
59. C) return { status: 404 }
60. D) console.error
61. Explanation: `import { error } from "@sveltejs/kit"; throw error(404, "msg")` produces a typed HTTP error SvelteKit renders with its error page.
62. Q10: When does a universal load run on the client?
63. A) Never
64. B) On initial SSR only
65. C) On client-side navigation between routes (*)
66. D) Only on form submission
67. Explanation: Universal loads run on the server for initial SSR and on the client during SPA-style navigations between routes (for caching and to avoid a server round-trip).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which file holds a SERVER-only load function?
  options:
    - +page.ts
    - +page.server.ts
    - +page.svelte
    - +layout.svelte
  correctIndex: 1
  explanation: +page.server.ts runs on the server only (initial SSR and during client navigations via fetch); it can access secrets and the DB.
- id: q2
  question: Which file holds a UNIVERSAL load function?
  options:
    - +page.server.ts
    - +page.svelte
    - +page.ts
    - svelte.config.js
  correctIndex: 2
  explanation: +page.ts is universal — runs on the server initially and on the client during navigations; can call external APIs but not access server secrets.
- id: q3
  question: How does +page.svelte receive load data?
  options:
    - this.data
    - useLoader()
    - window.__data
    - let { data } = $props()
  correctIndex: 3
  explanation: "Svelte 5 + SvelteKit passes data as a prop: `let { data } = $props()`. The type is inferred from the load function's return."
- id: q4
  question: Which load argument should you use to fetch within your own app?
  options:
    - the `fetch` argument provided to load
    - global fetch
    - axios
    - node-fetch
  correctIndex: 0
  explanation: Use the `fetch` argument; it includes cookies and works on both server and client, correctly handling your app's internal routes.
- id: q5
  question: What does depends("key") do?
  options:
    - Logs a dependency
    - Declares a dependency for fine-grained invalidation
    - Validates the load
    - Resets the load
  correctIndex: 1
  explanation: depends("key") marks the current load as depending on "key"; calling invalidate("key") re-runs just that load.
- id: q6
  question: How do you re-fetch a load after a mutation?
  options:
    - Reload the page
    - Restart the server
    - invalidate("key") or invalidateAll() from $app/navigation
    - Use goto
  correctIndex: 2
  explanation: import { invalidate, invalidateAll } from "$app/navigation" — invalidate("key") re-runs loads depending on that key; invalidateAll() re-runs all.
- id: q7
  question: Where should secrets/DB access live?
  options:
    - +page.ts (universal)
    - +page.svelte
    - +layout.ts
    - +page.server.ts (server only)
  correctIndex: 3
  explanation: Universal loads (+page.ts) ship to the client; secrets and DB access must be in +page.server.ts which only runs on the server.
- id: q8
  question: What does parent() return in a load?
  options:
    - A promise of data from parent load functions
    - The parent component
    - The route params
    - The URL
  correctIndex: 0
  explanation: parent() returns a promise resolving to the merged data from ancestor layout/page loads — await it to access inherited data.
- id: q9
  question: How do you throw a 404 from a load?
  options:
    - throw new Error("404")
    - throw error(404, "Not found") from @sveltejs/kit
    - "return { status: 404 }"
    - console.error
  correctIndex: 1
  explanation: '`import { error } from "@sveltejs/kit"; throw error(404, "msg")` produces a typed HTTP error SvelteKit renders with its error page.'
- id: q10
  question: When does a universal load run on the client?
  options:
    - Never
    - On initial SSR only
    - On client-side navigation between routes
    - Only on form submission
  correctIndex: 2
  explanation: Universal loads run on the server for initial SSR and on the client during SPA-style navigations between routes (for caching and to avoid a server round-trip).
```

