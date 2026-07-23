---
slug: nextjs-middleware-edge-functions
id: nextjs-09
track: nextjs
order: 9
title: Middleware and Edge Functions
description: Use `middleware.ts` to run code before every request — authentication redirects, A/B testing, locale routing, and feature gating — on the Edge runtime.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A63UxsQsEbU&t=240s
whyItMatters: Use `middleware. ts` to run code before every request — authentication redirects, A/B testing, locale routing, and feature gating — on the Edge runtime.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Middleware and Edge Functions

## Middleware and Edge Functions

### Why It Matters

Use `middleware. ts` to run code before every request — authentication redirects, A/B testing, locale routing, and feature gating — on the Edge runtime.

Use `middleware.ts` to run code before every request — authentication redirects, A/B testing, locale routing, and feature gating — on the Edge runtime.

### Prerequisites

- Stage 8: Route Handlers and API Routes.
- HTTP cookies, headers, and redirects.
- The difference between edge and Node.js runtimes.

### Topics

- The `middleware.ts` file convention and location
- The `matcher` config to limit which routes run middleware
- Reading and mutating request headers and cookies
- `NextResponse.redirect` and `NextResponse.rewrite`
- Edge runtime constraints (no fs, no Node APIs)
- Authentication patterns: redirect to /login if no session
- A/B testing and feature flags via cookies
- Setting request headers to forward data to RSC

### Key Concepts

- Middleware runs BEFORE every matched request, including static assets if matcher is permissive
- The `matcher` array (or exported config) filters which paths trigger middleware — use it!
- Middleware runs on the Edge runtime by default and cannot use Node-only APIs
- You can rewrite (server-side, URL hidden) or redirect (client-visible URL change) requests
- Headers set in middleware arrive in RSC via `headers()` from `next/headers`

```ts
// middleware.ts (in project root or src/)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  const isAuthed = Boolean(session);

  if (!isAuthed && req.nextUrl.pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*"],
};
```
Caption: Basic auth middleware

### Common Pitfalls

- Forgetting to set `matcher` — middleware runs on EVERY request including static assets, slowing the whole site; always filter.
- Using Node-only modules (fs, Prisma) in middleware — the Edge runtime does not support them; use lightweight crypto or fetch-based auth.
- Verifying JWTs with the `jsonwebtoken` library in middleware — that library uses Node crypto; use `jose` which is Web Crypto-compatible.
- Returning `NextResponse.next()` without setting headers when you wanted to forward data — headers must be set on the response object returned from middleware.
- Redirecting without preserving search params — clone `req.nextUrl` and modify only the path; otherwise the `?next=...` query is lost.

### Real-World Applications

- Vercel's middleware handles authentication and project routing for the dashboard, redirecting unauthenticated users to login before they hit protected routes.
- Hulu uses middleware for geo-restrictions, rewriting users to region-appropriate catalogs.
- Twitch uses middleware for A/B testing layout changes via bucket cookies served at the edge.
- Notion uses middleware to redirect users to their workspace subdomain based on the session cookie.

### Interview Questions

- 1. Where does `middleware.ts` live? — In the project root or `src/` (next to `app/`), not inside `app/`.
- 2. What does the `matcher` config do? — Filters which paths trigger middleware; without it, middleware runs on every request including static assets.
- 3. What runtime does middleware use by default? — The Edge runtime, which supports Web APIs but not Node-only modules like `fs` or Prisma.
- 4. What is the difference between `redirect` and `rewrite`? — `redirect` sends the user to a new URL (visible in the address bar); `rewrite` serves content from a different path internally while keeping the URL the same.
- 5. How do you verify a JWT in middleware? — Use `jose` (Web Crypto) instead of `jsonwebtoken` (Node crypto), because middleware runs on the Edge runtime.

### Mini Project

Build locale-aware middleware: A middleware that detects the user's preferred locale from a cookie, redirects non-localized paths to `/en/...` (or `/es/...`), and excludes `_next`, `api`, and any file with an extension. Suggested approach:
  - Create `middleware.ts` at the project root
  - Use a negative-lookahead regex matcher to exclude `/_next`, `/api`, and any path containing a dot
  - Read the `locale` cookie; default to `en`
  - Use `NextResponse.redirect` to send `/about` to `/en/about`
  - Add a `[locale]` segment under `app/` to render the localized pages

### Exercises

1. Add a middleware that logs every request URL and verify it runs in `next dev`.
2. Add a `matcher` so middleware only runs on `/dashboard/*` and verify static assets are excluded.
3. Implement a session-cookie check that redirects unauthed users to `/login?next=...`.
4. Set a request header in middleware and read it from a server component via `headers()`.
5. Use `jose` to verify a JWT in middleware and deny access on invalid tokens.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Where should middleware.ts live?
9. A) In the project root or src/ next to app/ (*)
10. B) Inside app/
11. C) In app/api/
12. D) In public/
13. Explanation: `middleware.ts` must live in the project root or `src/` (next to the `app/` directory); placing it inside `app/` does not work.
14. Q2: What does the `matcher` config do?
15. A) Decides the runtime
16. B) Decides which routes middleware runs on (*)
17. C) Sets the redirect target
18. D) Caches middleware responses
19. Explanation: `matcher` is an array of path patterns; only matching paths trigger middleware. Without it, middleware runs on every request including static assets, hurting performance.
20. Q3: What runtime does middleware use by default?
21. A) Node.js
22. B) Web Worker
23. C) Edge (*)
24. D) Service Worker
25. Explanation: Middleware runs on the Edge runtime by default, which supports Web APIs but not Node-only modules like `fs`, `crypto`, or Prisma.
26. Q4: Which library verifies JWTs in middleware?
27. A) jsonwebtoken
28. B) passport
29. C) bcrypt
30. D) jose (*)
31. Explanation: `jose` uses Web Crypto and runs on the Edge runtime; `jsonwebtoken` uses Node crypto and is not Edge-compatible.
32. Q5: What is the difference between `NextResponse.redirect` and `NextResponse.rewrite`?
33. A) redirect changes the URL in the address bar; rewrite serves a different path internally without changing the URL (*)
34. B) redirect is server-side; rewrite is client-side
35. C) They are identical
36. D) rewrite is faster
37. Explanation: `redirect` returns a 3xx with a Location header (URL changes); `rewrite` keeps the URL but serves content from a different internal path.
38. Q6: Which matcher excludes static assets and the API folder?
39. A) "/*"
40. B) "/((?!_next|api|.*\\..*).*)" (*)
41. C) "/dashboard/*"
42. D) "/**/*"
43. Explanation: The negative lookahead regex excludes `/_next`, `/api`, and any path containing a dot (file extensions), so middleware only runs on real routes.
44. Q7: Can middleware read cookies?
45. A) No
46. B) Only via fetch
47. C) Yes, via req.cookies.get(name) (*)
48. D) Only in production
49. Explanation: The `NextRequest` object passed to middleware exposes `req.cookies.get(name)` to read cookies for auth, A/B testing, and locale detection.
50. Q8: How do you forward data from middleware to server components?
51. A) Use a global variable
52. B) Use process.env
53. C) Use a database
54. D) Set request headers and read them with headers() in RSC (*)
55. Explanation: Set headers on the `NextResponse` returned from middleware (e.g. `res.headers.set('x-user-id', id)`), then read them in RSC with `headers()` from `next/headers`.
56. Q9: Why is running middleware without a matcher a problem?
57. A) It runs on every request including static assets, slowing the site (*)
58. B) It crashes the build
59. C) It only runs once
60. D) It disables caching
61. Explanation: Without `matcher`, middleware executes for every request — including JS, CSS, images, and other static assets — adding latency to every load.
62. Q10: Which of these is NOT available in middleware?
63. A) fetch
64. B) fs (*)
65. C) Web Crypto
66. D) URL
67. Explanation: `fs` is a Node-only module; the Edge runtime supports Web APIs like `fetch`, Web Crypto, and `URL` but not Node built-ins.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Where should middleware.ts live?
  options:
    - In the project root or src/ next to app/
    - Inside app/
    - In app/api/
    - In public/
  correctIndex: 0
  explanation: "`middleware.ts` must live in the project root or `src/` (next to the `app/` directory); placing it inside `app/` does not work."
- id: q2
  question: What does the `matcher` config do?
  options:
    - Decides the runtime
    - Decides which routes middleware runs on
    - Sets the redirect target
    - Caches middleware responses
  correctIndex: 1
  explanation: "`matcher` is an array of path patterns; only matching paths trigger middleware. Without it, middleware runs on every request including static assets, hurting performance."
- id: q3
  question: What runtime does middleware use by default?
  options:
    - Node.js
    - Web Worker
    - Edge
    - Service Worker
  correctIndex: 2
  explanation: Middleware runs on the Edge runtime by default, which supports Web APIs but not Node-only modules like `fs`, `crypto`, or Prisma.
- id: q4
  question: Which library verifies JWTs in middleware?
  options:
    - jsonwebtoken
    - passport
    - bcrypt
    - jose
  correctIndex: 3
  explanation: "`jose` uses Web Crypto and runs on the Edge runtime; `jsonwebtoken` uses Node crypto and is not Edge-compatible."
- id: q5
  question: What is the difference between `NextResponse.redirect` and `NextResponse.rewrite`?
  options:
    - redirect changes the URL in the address bar; rewrite serves a different path internally without changing the URL
    - redirect is server-side; rewrite is client-side
    - They are identical
    - rewrite is faster
  correctIndex: 0
  explanation: "`redirect` returns a 3xx with a Location header (URL changes); `rewrite` keeps the URL but serves content from a different internal path."
- id: q6
  question: Which matcher excludes static assets and the API folder?
  options:
    - '"/*"'
    - '"/((?!_next|api|.*\\..*).*)"'
    - '"/dashboard/*"'
    - '"/**/*"'
  correctIndex: 1
  explanation: The negative lookahead regex excludes `/_next`, `/api`, and any path containing a dot (file extensions), so middleware only runs on real routes.
- id: q7
  question: Can middleware read cookies?
  options:
    - No
    - Only via fetch
    - Yes, via req.cookies.get(name)
    - Only in production
  correctIndex: 2
  explanation: The `NextRequest` object passed to middleware exposes `req.cookies.get(name)` to read cookies for auth, A/B testing, and locale detection.
- id: q8
  question: How do you forward data from middleware to server components?
  options:
    - Use a global variable
    - Use process.env
    - Use a database
    - Set request headers and read them with headers() in RSC
  correctIndex: 3
  explanation: Set headers on the `NextResponse` returned from middleware (e.g. `res.headers.set('x-user-id', id)`), then read them in RSC with `headers()` from `next/headers`.
- id: q9
  question: Why is running middleware without a matcher a problem?
  options:
    - It runs on every request including static assets, slowing the site
    - It crashes the build
    - It only runs once
    - It disables caching
  correctIndex: 0
  explanation: Without `matcher`, middleware executes for every request — including JS, CSS, images, and other static assets — adding latency to every load.
- id: q10
  question: Which of these is NOT available in middleware?
  options:
    - fetch
    - fs
    - Web Crypto
    - URL
  correctIndex: 1
  explanation: "`fs` is a Node-only module; the Edge runtime supports Web APIs like `fetch`, Web Crypto, and `URL` but not Node built-ins."
```

