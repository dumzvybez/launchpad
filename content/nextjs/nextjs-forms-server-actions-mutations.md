---
slug: nextjs-forms-server-actions-mutations
id: nextjs-13
track: nextjs
order: 13
title: Forms, Server Actions, and Mutations
description: Build forms with Server Actions, validate input with Zod, handle pending states with `useFormStatus`, and revalidate cached data after mutations.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=TJQbDPGzm0Y&t=120s
whyItMatters: Build forms with Server Actions, validate input with Zod, handle pending states with `useFormStatus`, and revalidate cached data after mutations.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Forms, Server Actions, and Mutations

## Forms, Server Actions, and Mutations

### Why It Matters

Build forms with Server Actions, validate input with Zod, handle pending states with `useFormStatus`, and revalidate cached data after mutations.

Build forms with Server Actions, validate input with Zod, handle pending states with `useFormStatus`, and revalidate cached data after mutations.

### Prerequisites

- Stage 8: Route Handlers and API Routes.
- Stage 6: Data Fetching and caching.
- HTML forms and basic validation concepts.

### Topics

- What Server Actions are and how they differ from API routes
- `'use server'` directive on files and inline functions
- Invoking actions from `<form action={...}>` without JS
- `useFormStatus` for pending UI
- `useFormState` (or `useActionState` in React 19) for return values
- Validating input with Zod and returning typed errors
- `revalidatePath` and `revalidateTag` after mutations
- Progressive enhancement: actions work without JavaScript enabled

### Key Concepts

- Server Actions are async functions that run on the server but can be called from client components or HTML forms
- A file marked `'use server'` exports only async functions; each becomes an action
- Actions called via `<form action={fn}>` work even with JavaScript disabled (progressive enhancement)
- `useFormStatus` is a hook used inside a child of the form to read pending state
- After a mutation, call `revalidatePath('/...')` or `revalidateTag('...')` to refresh cached data

```ts
// app/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  title: z.string().min(3).max(100),
  body: z.string().min(10),
});

export async function createPost(formData: FormData) {
  const parsed = schema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }
  await db.post.create({ data: parsed.data });
  revalidatePath("/blog");
  return { ok: true };
}
```
Caption: A Server Action file

### Common Pitfalls

- Forgetting `'use server'` at the top of the action file — without it, the function is treated as a client function and tries to run in the browser, breaking on Node-only imports.
- Not calling `revalidatePath` after a mutation — the cached list page keeps showing stale data because Next.js does not know the data changed.
- Trusting formData without validation — always validate with Zod (or similar) on the server; client-side validation is for UX, not security.
- Exporting non-async functions from a `'use server'` file — server actions must be async; the build fails on synchronous exports.
- Passing non-serializable arguments (like a Date object) to an action — actions are called over the network; arguments must be serializable.

### Real-World Applications

- Vercel's comment system uses Server Actions to post comments without a separate API route, with `revalidatePath` refreshing the comment list instantly.
- Notion uses Server Actions for document mutations, ensuring actions work even with JavaScript disabled during degraded network conditions.
- Linear uses Server Actions for issue creation, validating with Zod and revalidating cached views.
- Twitch uses Server Actions for moderator actions (ban, timeout) with optimistic UI for instant feedback.

### Interview Questions

- 1. What is a Server Action? — An async function marked with `'use server'` that runs on the server but can be called from client components or HTML forms without writing a separate API route.
- 2. How do Server Actions enable progressive enhancement? — When attached via `<form action={fn}>`, they work even with JavaScript disabled because Next.js generates a fallback POST endpoint.
- 3. What is `useFormStatus` for? — A hook used in a child of a form to read the pending state of the submit, so the button can show a spinner without prop drilling.
- 4. How do you refresh cached data after a mutation? — Call `revalidatePath('/path')` or `revalidateTag('tag')` from inside the action to invalidate the relevant caches.
- 5. Why validate on the server even if you validate on the client? — Client validation can be bypassed; server validation with Zod is the source of truth and protects against malformed or malicious input.

### Mini Project

Build a comment box: A form on a blog post that posts a comment via a Server Action, validates with Zod, shows a pending state on the submit button, and calls `revalidatePath` to refresh the comment list. Suggested approach:
  - Create `app/actions.ts` with `'use server'` exporting `addComment(formData)`
  - Validate with Zod; return `{ ok, errors }` typed result
  - Store comments in an in-memory array (or Prisma if you've done Stage 15)
  - Use a `<form action={addComment}>` with a `SubmitButton` client component using `useFormStatus`
  - Call `revalidatePath('/blog/[slug]')` after the insert

### Exercises

1. Create a `'use server'` file with an async function and call it from a `<form action>`.
2. Add Zod validation and verify the action returns errors for bad input.
3. Use `useFormStatus` in a child submit button to show a pending state.
4. After the mutation, call `revalidatePath` and confirm the list refreshes.
5. Disable JavaScript in the browser and confirm the form still submits (progressive enhancement).
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which directive marks a file as containing Server Actions?
9. A) 'use server' (*)
10. B) 'use client'
11. C) 'use strict'
12. D) 'use async'
13. Explanation: A single-line `'use server'` directive at the top of a file marks all exported async functions in that file as Server Actions callable from the client.
14. Q2: Which React hook reads the pending state of a form submit?
15. A) useForm
16. B) useFormStatus (*)
17. C) usePending
18. D) useSubmit
19. Explanation: `useFormStatus` (from `react-dom`) is used inside a child of a form to read whether the form is currently submitting; it must be in a child component, not the form itself.
20. Q3: Which function invalidates a path's cache after a mutation?
21. A) purgePath()
22. B) invalidatePath()
23. C) revalidatePath() (*)
24. D) refreshPath()
25. Explanation: `revalidatePath('/path')` from `next/cache` invalidates the cached data for that path so the next request re-fetches fresh data.
26. Q4: Why do Server Actions enable progressive enhancement?
27. A) They run client-side
28. B) They cache results
29. C) They use WebSockets
30. D) Forms with action={fn} work even with JavaScript disabled via a generated POST endpoint (*)
31. Explanation: Next.js generates a fallback POST endpoint for actions attached via `<form action={fn}>`, so the form still submits and the action still runs without client JavaScript.
32. Q5: What must all exports from a `'use server'` file be?
33. A) Async functions only (*)
34. B) Synchronous
35. C) Classes
36. D) Constants
37. Explanation: A `'use server'` file can only export async functions; exporting a non-async function, class, or constant fails the build.
38. Q6: What is the recommended way to validate Server Action input?
39. A) Trust the client
40. B) Validate with Zod (or similar) on the server inside the action (*)
41. C) Validate only in the browser
42. D) Skip validation for trusted users
43. Explanation: Always validate server-side with a schema library like Zod; client validation is for UX and can be bypassed, so the server is the source of truth.
44. Q7: Which hook returns the action's result and pending state in React 19?
45. A) useFormState
46. B) useMutation
47. C) useActionState (*)
48. D) useAction
49. Explanation: React 19 renamed `useFormState` to `useActionState`; it returns `[state, action, pending]` for managing a Server Action's lifecycle.
50. Q8: What types of arguments can be passed to a Server Action?
51. A) Any JavaScript value
52. B) Only strings
53. C) Only Promises
54. D) Only serializable values (FormData, plain objects, primitives) — no functions or class instances (*)
55. Explanation: Server Actions are called over the network so arguments must be serializable; FormData, plain objects, arrays, and primitives work, but functions and class instances do not.
56. Q9: What happens if you forget to call `revalidatePath` after a mutation?
57. A) The cached list page keeps showing stale data (*)
58. B) The action fails
59. C) The build fails
60. D) Nothing changes
61. Explanation: Next.js does not know your data changed; without `revalidatePath` or `revalidateTag`, the cached pages continue serving the old data until the revalidate window expires.
62. Q10: Where must `useFormStatus` be called?
63. A) In the form component itself
64. B) In a child component rendered inside the form (*)
65. C) In a layout
66. D) In a server component
67. Explanation: `useFormStatus` reads the status of the nearest parent `<form>` via context, so it must be used in a component rendered inside the form (e.g. the submit button), not in the form component itself.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which directive marks a file as containing Server Actions?
  options:
    - "'use server'"
    - "'use client'"
    - "'use strict'"
    - "'use async'"
  correctIndex: 0
  explanation: A single-line `'use server'` directive at the top of a file marks all exported async functions in that file as Server Actions callable from the client.
- id: q2
  question: Which React hook reads the pending state of a form submit?
  options:
    - useForm
    - useFormStatus
    - usePending
    - useSubmit
  correctIndex: 1
  explanation: "`useFormStatus` (from `react-dom`) is used inside a child of a form to read whether the form is currently submitting; it must be in a child component, not the form itself."
- id: q3
  question: Which function invalidates a path's cache after a mutation?
  options:
    - purgePath()
    - invalidatePath()
    - revalidatePath()
    - refreshPath()
  correctIndex: 2
  explanation: "`revalidatePath('/path')` from `next/cache` invalidates the cached data for that path so the next request re-fetches fresh data."
- id: q4
  question: Why do Server Actions enable progressive enhancement?
  options:
    - They run client-side
    - They cache results
    - They use WebSockets
    - Forms with action={fn} work even with JavaScript disabled via a generated POST endpoint
  correctIndex: 3
  explanation: Next.js generates a fallback POST endpoint for actions attached via `<form action={fn}>`, so the form still submits and the action still runs without client JavaScript.
- id: q5
  question: What must all exports from a `'use server'` file be?
  options:
    - Async functions only
    - Synchronous
    - Classes
    - Constants
  correctIndex: 0
  explanation: A `'use server'` file can only export async functions; exporting a non-async function, class, or constant fails the build.
- id: q6
  question: What is the recommended way to validate Server Action input?
  options:
    - Trust the client
    - Validate with Zod (or similar) on the server inside the action
    - Validate only in the browser
    - Skip validation for trusted users
  correctIndex: 1
  explanation: Always validate server-side with a schema library like Zod; client validation is for UX and can be bypassed, so the server is the source of truth.
- id: q7
  question: Which hook returns the action's result and pending state in React 19?
  options:
    - useFormState
    - useMutation
    - useActionState
    - useAction
  correctIndex: 2
  explanation: React 19 renamed `useFormState` to `useActionState`; it returns `[state, action, pending]` for managing a Server Action's lifecycle.
- id: q8
  question: What types of arguments can be passed to a Server Action?
  options:
    - Any JavaScript value
    - Only strings
    - Only Promises
    - Only serializable values (FormData, plain objects, primitives) — no functions or class instances
  correctIndex: 3
  explanation: Server Actions are called over the network so arguments must be serializable; FormData, plain objects, arrays, and primitives work, but functions and class instances do not.
- id: q9
  question: What happens if you forget to call `revalidatePath` after a mutation?
  options:
    - The cached list page keeps showing stale data
    - The action fails
    - The build fails
    - Nothing changes
  correctIndex: 0
  explanation: Next.js does not know your data changed; without `revalidatePath` or `revalidateTag`, the cached pages continue serving the old data until the revalidate window expires.
- id: q10
  question: Where must `useFormStatus` be called?
  options:
    - In the form component itself
    - In a child component rendered inside the form
    - In a layout
    - In a server component
  correctIndex: 1
  explanation: "`useFormStatus` reads the status of the nearest parent `<form>` via context, so it must be used in a component rendered inside the form (e.g. the submit button), not in the form component itself."
```

