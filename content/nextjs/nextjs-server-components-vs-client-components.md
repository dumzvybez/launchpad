---
slug: nextjs-server-components-vs-client-components
id: nextjs-05
track: nextjs
order: 5
title: Server Components vs Client Components
description: Master the 'use client' boundary, the RSC protocol, what can cross between server and client, and how to avoid leaking server-only code to the browser.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A63UxsQsEbU&t=120s
whyItMatters: Master the 'use client' boundary, the RSC protocol, what can cross between server and client, and how to avoid leaking server-only code to the browser.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Server Components vs Client Components

## Server Components vs Client Components

### Why It Matters

Master the 'use client' boundary, the RSC protocol, what can cross between server and client, and how to avoid leaking server-only code to the browser.

Master the 'use client' boundary, the RSC protocol, what can cross between server and client, and how to avoid leaking server-only code to the browser.

### Prerequisites

- Stage 4: Loading, Error, and Not-Found UI.
- Solid React fundamentals (props, hooks, composition).
- Awareness of where code runs (server vs browser).

### Topics

- The 'use client' directive and what it means
- React Server Components (RSC) and the wire protocol
- Server-only APIs: `server-only` and `client-only` packages
- What can pass from server to client (serializable props only)
- Functions, classes, dates, and what does NOT serialize
- Composing client components inside server components
- Importing client components into server components (and vice versa)
- Children-as-prop pattern for passing server content into client components

### Key Concepts

- Server components render on the server, ship zero JS, and can use secrets, fs, and databases
- Client components render on the client (after a server pre-render), ship JS, and can use state, effects, and browser APIs
- The 'use client' directive marks the boundary: that file and its imports become client-bundled
- You can pass server-rendered children as the `children` prop INTO a client component, and they remain server components
- Non-serializable values (functions, class instances, Dates as objects) cannot cross from server to client as props

```tsx
// app/products/page.tsx — server component, no directive needed
import { db } from "@/lib/db";
import AddToCart from "./AddToCart";

export default async function Products() {
  const products = await db.product.findMany();
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          {p.name} — ${p.price}
          <AddToCart productId={p.id} /> {/* client component */}
        </li>
      ))}
    </ul>
  );
}
```
Caption: Server component (default)

### Common Pitfalls

- Marking too many components 'use client' — this ships unnecessary JS; mark only the leaf components that actually need state/effects and keep parents as server components.
- Trying to pass a function as a prop from a server to a client component — functions do not serialize; pass serializable data and let the client component define the handler.
- Importing a server-only library (Prisma, fs) into a client component — the build fails or you leak secrets to the browser; use the `server-only` package to guard imports.
- Assuming 'use client' makes a component client-only — it makes that file and its imports client-bundled, but it can still be server pre-rendered; "client-only" needs an extra guard.
- Forgetting that Date objects lose their prototype when serialized across the boundary — convert to ISO strings on the server and parse on the client if you need date methods.

### Real-World Applications

- Vercel's dashboard keeps data-fetching components as server components while only interactive buttons and forms are marked 'use client', dramatically reducing bundle size.
- Notion's editor ships thousands of server-rendered blocks while only the editing surface (selection, typing) is client-side.
- Linear uses the children-as-prop pattern to keep server-rendered issue metadata inside interactive client dropdowns.
- Hulu's show pages render marketing content server-side and only the video player controls as client components.

### Interview Questions

- 1. What is a Server Component? — A React component that renders on the server, ships zero JS to the client, and can directly access databases, files, and environment secrets.
- 2. What does `'use client'` actually do? — It marks the file and its imports as client-bundled, enabling hooks, events, and browser APIs while still being pre-rendered on the server.
- 3. Can you pass a function from a server component to a client component as a prop? — No; functions are not serializable; use Server Actions (Stage 13) or pass serializable data and define the handler on the client.
- 4. What is the `server-only` package for? — It causes a build error if the file is imported into a client component, protecting server-only code from leaking to the browser.
- 5. How can a client component contain server-rendered content? — Pass server-rendered React elements as the `children` prop; the children remain server components even though their wrapper is a client component.

### Mini Project

Build a server-rendered list with a client filter: A page that fetches a list of products server-side and renders them inside a client `FilterBar` component that lets the user search and sort — keeping all product data on the server. Suggested approach:
  - Create `app/page.tsx` as a server component that fetches products from a fake `db`
  - Create `app/FilterBar.tsx` as a client component with `useState` for query/sort
  - Pass the products as props to `FilterBar` (note: in production you'd paginate)
  - Guard `db` with `import "server-only"` and try (and fail) to import it into FilterBar
  - Add a "Toggle dark mode" button that lives in a separate client component next to FilterBar

### Exercises

1. Create a server component that fetches data and a client component that renders a button; nest the client component inside the server one.
2. Add `import "server-only"` to a server utility and verify the build fails when you import it from a client component.
3. Try passing a `Date` object as a prop from server to client and observe the serialization warning; fix it by sending an ISO string.
4. Use the children-as-prop pattern: a client `Modal` that wraps server-rendered content.
5. Audit an existing page and convert any client component that does not use hooks/effects back to a server component.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which directive marks a file as a client component?
9. A) 'use client' (*)
10. B) 'use server'
11. C) 'client side'
12. D) 'browser only'
13. Explanation: A single-line `'use client'` directive at the very top of a file marks it (and its imports) as client-bundled, enabling hooks, events, and browser APIs.
14. Q2: Which of these can a Server Component do that a Client Component cannot?
15. A) Use useState
16. B) Read from a database directly (*)
17. C) Add event handlers
18. D) Render JSX
19. Explanation: Server components can import database clients, fs, and process.env secrets because they never ship to the browser; client components cannot do these without leaking secrets.
20. Q3: What happens if you try to pass a function as a prop from a server to a client component?
21. A) It works fine
22. B) It silently fails
23. C) The build fails because functions are not serializable across the RSC boundary (*)
24. D) The function runs on the server
25. Explanation: The RSC protocol serializes props as JSON; functions cannot cross the boundary, so the build fails. Use Server Actions or define the handler client-side.
26. Q4: What does the `server-only` package do?
27. A) Marks a component as server-rendered only (no client prerender)
28. B) Optimizes server bundle size
29. C) Enables streaming
30. D) Causes a build error if the file is imported into a client component (*)
31. Explanation: `import "server-only"` at the top of a module causes the bundler to throw if a client component imports it, preventing accidental leakage of server code.
32. Q5: How can a client component contain server-rendered children?
33. A) Pass server-rendered React elements as the `children` prop (*)
34. B) It cannot
35. C) Use a portal
36. D) Use a fragment
37. Explanation: The children-as-prop pattern keeps server-rendered content server-only even when its wrapper is a client component; the children pass through the boundary as already-rendered output.
38. Q6: Does `'use client'` mean the component is NOT pre-rendered on the server?
39. A) Yes, it is client-only
40. B) No, client components are still pre-rendered on the server for the initial HTML (*)
41. C) Only with `export const dynamic = 'force-dynamic'`
42. D) Only in production
43. Explanation: Client components are still server pre-rendered (SSR) for the initial HTML; the directive enables hydration and client-side interactivity, not client-only rendering.
44. Q7: Which of these is NOT serializable across the RSC boundary?
45. A) Plain objects
46. B) Arrays of strings
47. C) Class instances (*)
48. D) Numbers
49. Explanation: Class instances (including Date objects) lose their prototype and methods when serialized; convert them to plain values (e.g. ISO strings) before crossing.
50. Q8: What is the best way to minimize client-side JS in a page?
51. A) Mark everything 'use client' for safety
52. B) Use the Pages Router instead
53. C) Avoid hooks entirely
54. D) Keep parent components as server components and mark only leaf interactive ones 'use client' (*)
55. Explanation: Pushing 'use client' down to the leaves keeps parents server-rendered, dramatically reducing the amount of JS shipped to the browser.
56. Q9: What happens if a client component imports a Prisma client?
57. A) The build fails or secrets leak to the browser; guard with `server-only` (*)
58. B) It works fine
59. C) Prisma automatically switches to a client SDK
60. D) It only runs on the server
61. Explanation: Without a guard, the bundler tries to ship Prisma (and any env secrets it touches) to the browser, breaking the build or exposing secrets. Always use `server-only`.
62. Q10: Which pattern lets you keep server-rendered data inside an interactive dropdown?
63. A) Pass the data as a function prop
64. B) Use a client dropdown that receives server-rendered children (*)
65. C) Mark the dropdown as 'use server'
66. D) Use the Pages Router
67. Explanation: The children-as-prop pattern wraps already-rendered server output inside a client component, preserving the server boundary while adding interactivity.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which directive marks a file as a client component?
  options:
    - "'use client'"
    - "'use server'"
    - "'client side'"
    - "'browser only'"
  correctIndex: 0
  explanation: A single-line `'use client'` directive at the very top of a file marks it (and its imports) as client-bundled, enabling hooks, events, and browser APIs.
- id: q2
  question: Which of these can a Server Component do that a Client Component cannot?
  options:
    - Use useState
    - Read from a database directly
    - Add event handlers
    - Render JSX
  correctIndex: 1
  explanation: Server components can import database clients, fs, and process.env secrets because they never ship to the browser; client components cannot do these without leaking secrets.
- id: q3
  question: What happens if you try to pass a function as a prop from a server to a client component?
  options:
    - It works fine
    - It silently fails
    - The build fails because functions are not serializable across the RSC boundary
    - The function runs on the server
  correctIndex: 2
  explanation: The RSC protocol serializes props as JSON; functions cannot cross the boundary, so the build fails. Use Server Actions or define the handler client-side.
- id: q4
  question: What does the `server-only` package do?
  options:
    - Marks a component as server-rendered only (no client prerender)
    - Optimizes server bundle size
    - Enables streaming
    - Causes a build error if the file is imported into a client component
  correctIndex: 3
  explanation: '`import "server-only"` at the top of a module causes the bundler to throw if a client component imports it, preventing accidental leakage of server code.'
- id: q5
  question: How can a client component contain server-rendered children?
  options:
    - Pass server-rendered React elements as the `children` prop
    - It cannot
    - Use a portal
    - Use a fragment
  correctIndex: 0
  explanation: The children-as-prop pattern keeps server-rendered content server-only even when its wrapper is a client component; the children pass through the boundary as already-rendered output.
- id: q6
  question: Does `'use client'` mean the component is NOT pre-rendered on the server?
  options:
    - Yes, it is client-only
    - No, client components are still pre-rendered on the server for the initial HTML
    - Only with `export const dynamic = 'force-dynamic'`
    - Only in production
    - for the initial HTML; the directive enables hydration and client-side interactivity, not client-only rendering.
  correctIndex: 1
  explanation: Client components are still server pre-rendered (SSR) for the initial HTML; the directive enables hydration and client-side interactivity, not client-only rendering.
- id: q7
  question: Which of these is NOT serializable across the RSC boundary?
  options:
    - Plain objects
    - Arrays of strings
    - Class instances
    - Numbers
  correctIndex: 2
  explanation: Class instances (including Date objects) lose their prototype and methods when serialized; convert them to plain values (e.g. ISO strings) before crossing.
- id: q8
  question: What is the best way to minimize client-side JS in a page?
  options:
    - Mark everything 'use client' for safety
    - Use the Pages Router instead
    - Avoid hooks entirely
    - Keep parent components as server components and mark only leaf interactive ones 'use client'
  correctIndex: 3
  explanation: Pushing 'use client' down to the leaves keeps parents server-rendered, dramatically reducing the amount of JS shipped to the browser.
- id: q9
  question: What happens if a client component imports a Prisma client?
  options:
    - The build fails or secrets leak to the browser; guard with `server-only`
    - It works fine
    - Prisma automatically switches to a client SDK
    - It only runs on the server
  correctIndex: 0
  explanation: Without a guard, the bundler tries to ship Prisma (and any env secrets it touches) to the browser, breaking the build or exposing secrets. Always use `server-only`.
- id: q10
  question: Which pattern lets you keep server-rendered data inside an interactive dropdown?
  options:
    - Pass the data as a function prop
    - Use a client dropdown that receives server-rendered children
    - Mark the dropdown as 'use server'
    - Use the Pages Router
  correctIndex: 1
  explanation: The children-as-prop pattern wraps already-rendered server output inside a client component, preserving the server boundary while adding interactivity.
```

