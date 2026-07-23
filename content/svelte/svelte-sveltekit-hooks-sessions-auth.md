---
slug: svelte-sveltekit-hooks-sessions-auth
id: svelte-16
track: svelte
order: 16
title: SvelteKit — Hooks, Sessions, and Auth
description: Intercept every request with SvelteKit hooks (handle, handleError, handleFetch), implement session management with cookies, and gate routes behind authentication.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=9OlLxkaeVvw&t=120s
whyItMatters: Intercept every request with SvelteKit hooks (handle, handleError, handleFetch), implement session management with cookies, and gate routes behind authentication.
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# SvelteKit — Hooks, Sessions, and Auth

## SvelteKit — Hooks, Sessions, and Auth

### Why It Matters

Intercept every request with SvelteKit hooks (handle, handleError, handleFetch), implement session management with cookies, and gate routes behind authentication.

Intercept every request with SvelteKit hooks (handle, handleError, handleFetch), implement session management with cookies, and gate routes behind authentication.

### Prerequisites

- Stage 14: SvelteKit — Load Functions
- Stage 15: SvelteKit — Form Actions
- HTTP cookies and session concepts.

### Topics

- src/hooks.server.ts: the `handle` function
- The event object: locals, cookies, request, url, params
- Sequence() for composing multiple hooks
- handleError for global error logging
- handleFetch for cross-origin request rewriting
- Cookies API: set, get, delete, serialize
- Loading locals in +layout.server.ts for session sharing
- Route groups with auth gates

### Key Concepts

- handle({ event, resolve }) wraps every request — mutate event.locals, then call resolve(event) to render
- event.locals is shared across load/action for the request — set the user here
- Cookies are httpOnly by default — set with cookies.set("name", value, { path, httpOnly, sameSite })
- +layout.server.ts can read event.locals.user and return it to all pages
- handleError fires for uncaught errors — log to Sentry, return a friendly message

```ts
// src/hooks.server.ts
import type { Handle } from "@sveltejs/kit";
import { verifySession } from "$lib/server/auth";

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get("session");
  if (session) {
    const user = await verifySession(session);
    if (user) event.locals.user = user;
    else event.cookies.delete("session", { path: "/" });
  }
  return resolve(event);
};
```
Caption: Auth hook with cookies

### Common Pitfalls

- Setting cookies without httpOnly — exposes session tokens to XSS; always use httpOnly: true for session cookies.
- Forgetting sameSite: "lax" (or "strict") — leaves you open to CSRF; SvelteKit also enforces origin checks for form actions.
- Mutating event.locals after resolve() — too late; set locals before calling resolve.
- Returning user passwords in +layout.server.ts — return only safe fields (id, email, name), never the password hash.
- Using localStorage for sessions — XSS can read it; use httpOnly cookies set by the server.

### Real-World Applications

- The New York Times gates subscriber-only articles via a session cookie set in hooks.server.ts.
- Apple Music's web player uses MusicKit tokens refreshed in the handle hook on every request.
- Rakuten's checkout requires auth — a handle hook redirects unauthenticated users to /login with a returnTo param.
- Chess.com uses session cookies for authenticated play and rate-limits via event.locals in hooks.

### Interview Questions

- 1. What does the handle hook do? — Wraps every request, letting you mutate event.locals (e.g., set the user from a session cookie) before rendering.
- 2. How do you share the user with load functions? — Set event.locals.user in handle; read locals.user in +layout.server.ts and return it.
- 3. Why use httpOnly cookies for sessions? — JavaScript can't read them, mitigating XSS token theft; localStorage is XSS-readable.
- 4. How do you compose multiple hooks? — Use `sequence(handleA, handleB)` from @sveltejs/kit/hooks; each receives the event in order.
- 5. What's handleError for? — Catches uncaught errors for logging (Sentry) and returning a friendly message to the user.

### Mini Project

Build a Login + Protected Routes Flow: A /login page that authenticates and sets a session cookie, a hooks.server.ts that loads the user into event.locals on every request, a +layout.server.ts that shares user with all pages, and a /dashboard route that redirects to /login if no user. Suggested approach:
  - Create hooks.server.ts that reads the session cookie and sets event.locals.user
  - Add +layout.server.ts returning { user: locals.user }
  - Build /login/+page.server.ts with a default action that authenticates and cookies.set
  - Add /dashboard/+layout.server.ts that throws redirect(307, "/login") if !locals.user
  - Add a logout action that cookies.delete and redirects

### Exercises

1. Implement a handle hook that sets event.locals.requestId = crypto.randomUUID().
2. Add a logging handle that prints method + pathname for every request.
3. Use sequence() to compose auth and logging hooks.
4. Set a session cookie with httpOnly, sameSite, secure in a login action.
5. Add a protected /admin route that redirects to /login if no user.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Where does the server-side handle hook live?
9. A) src/hooks.ts
10. B) src/app.ts
11. C) +layout.server.ts
12. D) src/hooks.server.ts (*)
13. Explanation: Server hooks live in src/hooks.server.ts; client hooks (rare) in src/hooks.client.ts; universal in src/hooks.ts.
14. Q2: What does handle({ event, resolve }) return?
15. A) The result of resolve(event) — the rendered response (*)
16. B) A string
17. C) A promise of locals
18. D) A redirect
19. Explanation: The handle function must call resolve(event) to produce the response; mutations to event.locals happen before that call.
20. Q3: How do you share data set in handle with load functions?
21. A) via event.url
22. B) via event.locals (*)
23. C) via cookies only
24. D) via URL params
25. Explanation: event.locals is per-request and shared between handle, load, and action; set locals.user in handle, read locals.user in load.
26. Q4: Which cookie flag prevents JavaScript from reading it?
27. A) secure
28. B) sameSite
29. C) httpOnly (*)
30. D) maxAge
31. Explanation: httpOnly: true makes the cookie inaccessible to document.cookie, mitigating XSS token theft. Always use it for session tokens.
32. Q5: How do you compose multiple handle functions?
33. A) Array of handles
34. B) Call them manually
35. C) You can't
36. D) sequence(handleA, handleB) from @sveltejs/kit/hooks (*)
37. Explanation: `import { sequence } from "@sveltejs/kit/hooks"; export const handle = sequence(a, b)` runs each in order, passing the event through.
38. Q6: What does handleError do?
39. A) Catches uncaught errors for logging and friendly messages (*)
40. B) Renders 404
41. C) Replaces handle
42. D) Validates forms
43. Explanation: handleError fires for uncaught errors during request handling; log to Sentry, return { message } shown to the user.
44. Q7: Where do you set a session cookie?
45. A) handle
46. B) An action via cookies.set() (*)
47. C) +page.svelte
48. D) svelte.config.js
49. Explanation: Cookies are set via event.cookies.set() (in actions or load) or response.headers in handle; most commonly in a login action.
50. Q8: Why avoid localStorage for sessions?
51. A) It's deprecated
52. B) It's slow
53. C) JavaScript (and XSS) can read it; httpOnly cookies can't be (*)
54. D) It only works in Svelte 4
55. Explanation: localStorage is readable by any JS, so XSS steals the token; httpOnly cookies can't be read by JS, mitigating XSS-based theft.
56. Q9: What's the role of +layout.server.ts in auth?
57. A) Sets the cookie
58. B) Authenticates
59. C) Validates forms
60. D) Reads locals.user and returns it to all pages as data (*)
61. Explanation: +layout.server.ts (root) reads event.locals.user (set by handle) and returns { user } to all descendant layouts and pages.
62. Q10: Which sameSite value prevents CSRF for form actions?
63. A) "lax" or "strict" (*)
64. B) "none"
65. C) "all"
66. D) "off"
67. Explanation: sameSite: "lax" (default in modern browsers) blocks cross-site POSTs; "strict" is stricter; "none" requires secure and is unsafe.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Where does the server-side handle hook live?
  options:
    - src/hooks.ts
    - src/app.ts
    - +layout.server.ts
    - src/hooks.server.ts
  correctIndex: 3
  explanation: Server hooks live in src/hooks.server.ts; client hooks (rare) in src/hooks.client.ts; universal in src/hooks.ts.
- id: q2
  question: What does handle({ event, resolve }) return?
  options:
    - The result of resolve(event) — the rendered response
    - A string
    - A promise of locals
    - A redirect
  correctIndex: 0
  explanation: The handle function must call resolve(event) to produce the response; mutations to event.locals happen before that call.
- id: q3
  question: How do you share data set in handle with load functions?
  options:
    - via event.url
    - via event.locals
    - via cookies only
    - via URL params
  correctIndex: 1
  explanation: event.locals is per-request and shared between handle, load, and action; set locals.user in handle, read locals.user in load.
- id: q4
  question: Which cookie flag prevents JavaScript from reading it?
  options:
    - secure
    - sameSite
    - httpOnly
    - maxAge
  correctIndex: 2
  explanation: "httpOnly: true makes the cookie inaccessible to document.cookie, mitigating XSS token theft. Always use it for session tokens."
- id: q5
  question: How do you compose multiple handle functions?
  options:
    - Array of handles
    - Call them manually
    - You can't
    - sequence(handleA, handleB) from @sveltejs/kit/hooks
  correctIndex: 3
  explanation: '`import { sequence } from "@sveltejs/kit/hooks"; export const handle = sequence(a, b)` runs each in order, passing the event through.'
- id: q6
  question: What does handleError do?
  options:
    - Catches uncaught errors for logging and friendly messages
    - Renders 404
    - Replaces handle
    - Validates forms
  correctIndex: 0
  explanation: handleError fires for uncaught errors during request handling; log to Sentry, return { message } shown to the user.
- id: q7
  question: Where do you set a session cookie?
  options:
    - handle
    - An action via cookies.set()
    - +page.svelte
    - svelte.config.js
  correctIndex: 1
  explanation: Cookies are set via event.cookies.set() (in actions or load) or response.headers in handle; most commonly in a login action.
- id: q8
  question: Why avoid localStorage for sessions?
  options:
    - It's deprecated
    - It's slow
    - JavaScript (and XSS) can read it; httpOnly cookies can't be
    - It only works in Svelte 4
  correctIndex: 2
  explanation: localStorage is readable by any JS, so XSS steals the token; httpOnly cookies can't be read by JS, mitigating XSS-based theft.
- id: q9
  question: What's the role of +layout.server.ts in auth?
  options:
    - Sets the cookie
    - Authenticates
    - Validates forms
    - Reads locals.user and returns it to all pages as data
  correctIndex: 3
  explanation: +layout.server.ts (root) reads event.locals.user (set by handle) and returns { user } to all descendant layouts and pages.
- id: q10
  question: Which sameSite value prevents CSRF for form actions?
  options:
    - '"lax" or "strict"'
    - '"none"'
    - '"all"'
    - '"off"'
  correctIndex: 0
  explanation: 'sameSite: "lax" (default in modern browsers) blocks cross-site POSTs; "strict" is stricter; "none" requires secure and is unsafe.'
```

