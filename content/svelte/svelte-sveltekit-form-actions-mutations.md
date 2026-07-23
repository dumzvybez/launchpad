---
slug: svelte-sveltekit-form-actions-mutations
id: svelte-15
track: svelte
order: 15
title: SvelteKit — Form Actions and Mutations
description: Handle form submissions server-side with SvelteKit form actions, validate input, return typed validation errors, and use the enhance function for progressive enhancement.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=9OlLxkaeVvw&t=60s
whyItMatters: Handle form submissions server-side with SvelteKit form actions, validate input, return typed validation errors, and use the enhance function for progressive enhancement.
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# SvelteKit — Form Actions and Mutations

## SvelteKit — Form Actions and Mutations

### Why It Matters

Handle form submissions server-side with SvelteKit form actions, validate input, return typed validation errors, and use the enhance function for progressive enhancement.

Handle form submissions server-side with SvelteKit form actions, validate input, return typed validation errors, and use the enhance function for progressive enhancement.

### Prerequisites

- Stage 14: SvelteKit — Load Functions
- HTML forms (POST, form-data).
- Stage 5: Event Handlers.

### Topics

- Declaring actions in +page.server.ts
- Form method="POST" with action="?/name"
- Named actions: ?/create, ?/update
- Returning data and validation errors: { form, status }
- form prop in +page.svelte
- Progressive enhancement with use:enhance
- applyAction and update result types
- CSRF protection (built-in) and origin checks

### Key Concepts

- Form actions are POST handlers in +page.server.ts keyed by name
- The form's action attribute points to the named action: `?/create`
- Return `{ status, errors }` (or just data) to communicate validation errors
- The page receives `form` prop containing the last action result
- use:enhance (from $app/forms) makes the form submit via fetch, with optimistic and rollback patterns
- Without enhance, forms still work via full-page POST (progressive enhancement)

```ts
// src/routes/signup/+page.server.ts
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    if (!email.includes("@")) {
      return fail(400, { email, error: "Invalid email" });
    }
    if (password.length < 8) {
      return fail(400, { email, error: "Password too short" });
    }

    // create user...
    throw redirect(303, "/welcome");
  }
};
```
Caption: Form action with validation

### Common Pitfalls

- Forgetting method="POST" — form actions only handle POST; GET forms don't reach actions.
- Returning raw objects instead of `fail()` for validation errors — `fail(400, {...})` is the correct way; it preserves the form data and sets a failure status.
- Disabling JavaScript and assuming forms break — by default, forms work via full-page POST; use:enhance is progressive, not required.
- Not setting action="?/name" for named actions — without it, the default action runs and the named one is ignored.
- Mutating shared state in actions without invalidation — call `invalidate()` or use the result of `update()` to refresh page data after mutations.

### Real-World Applications

- The New York Times' comment section uses form actions with enhance for progressive enhancement and optimistic posting.
- Apple Music's playlist editor uses form actions for create/rename/delete with `fail()` validation.
- Rakuten's checkout uses multi-step form actions with named actions per step (address, payment, review).
- Chess.com's analysis tools use form actions to save game annotations with enhance for snappy UX.

### Interview Questions

- 1. What are SvelteKit form actions? — POST handlers declared in +page.server.ts (or +layout.server.ts), invoked by <form method="POST" action="?/name">.
- 2. How do you return validation errors? — Use `fail(400, { field, error })` from @sveltejs/kit; the page receives the result as the `form` prop.
- 3. What does use:enhance do? — Submits the form via fetch instead of full-page reload, supports optimistic updates and rollback; the form still works without JS.
- 4. How do you name an action? — Use a named key in the actions object and reference it via `action="?/create"` in the form.
- 5. Why return fail() instead of throw error()? — fail() preserves form data and lets the page show inline errors; error() shows the error page.

### Mini Project

Build a Signup Form with Validation and Optimistic Submit: A /signup page with email/password form, server-side validation returning fail() on bad input, enhance for progressive enhancement, and a loading state. On success, redirect to /welcome. Suggested approach:
  - Create +page.server.ts with a default action validating email + password
  - Return fail(400, { email, error }) on validation failure
  - In +page.svelte, use use:enhance to toggle loading and call update()
  - Display form?.error inline and prefill email from form?.email
  - throw redirect(303, "/welcome") on success

### Exercises

1. Build a POST form with a default action that logs form data server-side.
2. Add email validation returning fail(400, { error }).
3. Add use:enhance with a loading state.
4. Create two named actions (?/create, ?/delete) and wire both forms.
5. Implement optimistic add with rollback using update({ reset: false }).
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Where are SvelteKit form actions declared?
9. A) +page.svelte
10. B) svelte.config.js
11. C) +page.server.ts (*)
12. D) +page.ts
13. Explanation: Form actions live in +page.server.ts (or +layout.server.ts) as an `actions` object; each key is a named action.
14. Q2: What HTTP method do form actions respond to?
15. A) GET
16. B) PUT
17. C) DELETE
18. D) POST (*)
19. Explanation: Form actions only handle POST; GET forms don't reach actions. Always include method="POST" on the form.
20. Q3: How do you return validation errors?
21. A) return fail(400, { field, error }) (*)
22. B) throw error(400)
23. C) return { status: 400 }
24. D) console.error
25. Explanation: `import { fail } from "@sveltejs/kit"; return fail(400, {...})` preserves form data and lets the page render inline errors via the `form` prop.
26. Q4: What does use:enhance do?
27. A) Adds validation
28. B) Submits via fetch (progressive enhancement) with optimistic + rollback hooks (*)
29. C) Disables the form
30. D) Sets the action attribute
31. Explanation: `import { enhance } from "$app/forms"; use:enhance={fn}` submits via fetch instead of full-page reload, supports pre/post hooks and rollback.
32. Q5: How do you reference a named action?
33. A) action="/create"
34. B) action="#create"
35. C) action="?/create" (*)
36. D) name="create"
37. Explanation: Named actions are referenced via `action="?/name"` (the `?/` prefix tells SvelteKit to call the named action on the current page).
38. Q6: How does +page.svelte read the action result?
39. A) this.action
40. B) useAction()
41. C) window.__form
42. D) let { form } = $props() (*)
43. Explanation: The page receives the last action result as the `form` prop; it's typed from the action's return type via generated types.
44. Q7: Does a form action work without JavaScript?
45. A) Yes — forms POST normally and the page reloads (*)
46. B) No
47. C) Only in Svelte 4
48. D) Only with enhance
49. Explanation: Form actions are progressive: without JS, the browser POSTs and reloads the page; use:enhance layers on SPA-style submission.
50. Q8: What's a common pitfall with named actions?
51. A) Using them at all
52. B) Forgetting action="?/name" so the default action runs (*)
53. C) Using too many
54. D) Using method="POST"
55. Explanation: Without `action="?/name"` on the form, SvelteKit calls the default action; the named one is silently ignored.
56. Q9: How do you redirect after a successful action?
57. A) return { redirect: true }
58. B) window.location = "/path"
59. C) throw redirect(303, "/path") (*)
60. D) return "/path"
61. Explanation: `import { redirect } from "@sveltejs/kit"; throw redirect(303, "/path")` triggers a navigation. Status 303 is standard for POST-redirect-GET.
62. Q10: How do you refresh page data after a mutation?
63. A) Reload the page
64. B) Restart the server
65. C) Use goto()
66. D) Use update() inside enhance, or call invalidate() (*)
67. Explanation: Inside enhance, call `await update()` to apply the action result and re-run loads; or call `invalidate()` / `invalidateAll()` from $app/navigation.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Where are SvelteKit form actions declared?
  options:
    - +page.svelte
    - svelte.config.js
    - +page.server.ts
    - +page.ts
  correctIndex: 2
  explanation: Form actions live in +page.server.ts (or +layout.server.ts) as an `actions` object; each key is a named action.
- id: q2
  question: What HTTP method do form actions respond to?
  options:
    - GET
    - PUT
    - DELETE
    - POST
  correctIndex: 3
  explanation: Form actions only handle POST; GET forms don't reach actions. Always include method="POST" on the form.
- id: q3
  question: How do you return validation errors?
  options:
    - return fail(400, { field, error })
    - throw error(400)
    - "return { status: 400 }"
    - console.error
  correctIndex: 0
  explanation: '`import { fail } from "@sveltejs/kit"; return fail(400, {...})` preserves form data and lets the page render inline errors via the `form` prop.'
- id: q4
  question: What does use:enhance do?
  options:
    - Adds validation
    - Submits via fetch (progressive enhancement) with optimistic + rollback hooks
    - Disables the form
    - Sets the action attribute
  correctIndex: 1
  explanation: '`import { enhance } from "$app/forms"; use:enhance={fn}` submits via fetch instead of full-page reload, supports pre/post hooks and rollback.'
- id: q5
  question: How do you reference a named action?
  options:
    - action="/create"
    - action="#create"
    - action="?/create"
    - name="create"
  correctIndex: 2
  explanation: Named actions are referenced via `action="?/name"` (the `?/` prefix tells SvelteKit to call the named action on the current page).
- id: q6
  question: How does +page.svelte read the action result?
  options:
    - this.action
    - useAction()
    - window.__form
    - let { form } = $props()
  correctIndex: 3
  explanation: The page receives the last action result as the `form` prop; it's typed from the action's return type via generated types.
- id: q7
  question: Does a form action work without JavaScript?
  options:
    - Yes — forms POST normally and the page reloads
    - No
    - Only in Svelte 4
    - Only with enhance
  correctIndex: 0
  explanation: "Form actions are progressive: without JS, the browser POSTs and reloads the page; use:enhance layers on SPA-style submission."
- id: q8
  question: What's a common pitfall with named actions?
  options:
    - Using them at all
    - Forgetting action="?/name" so the default action runs
    - Using too many
    - Using method="POST"
  correctIndex: 1
  explanation: Without `action="?/name"` on the form, SvelteKit calls the default action; the named one is silently ignored.
- id: q9
  question: How do you redirect after a successful action?
  options:
    - "return { redirect: true }"
    - window.location = "/path"
    - throw redirect(303, "/path")
    - return "/path"
  correctIndex: 2
  explanation: '`import { redirect } from "@sveltejs/kit"; throw redirect(303, "/path")` triggers a navigation. Status 303 is standard for POST-redirect-GET.'
- id: q10
  question: How do you refresh page data after a mutation?
  options:
    - Reload the page
    - Restart the server
    - Use goto()
    - Use update() inside enhance, or call invalidate()
  correctIndex: 3
  explanation: Inside enhance, call `await update()` to apply the action result and re-run loads; or call `invalidate()` / `invalidateAll()` from $app/navigation.
```

