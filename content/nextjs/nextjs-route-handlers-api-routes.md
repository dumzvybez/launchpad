---
slug: nextjs-route-handlers-api-routes
id: nextjs-08
track: nextjs
order: 8
title: Route Handlers and API Routes
description: Build HTTP endpoints with `app/api/.../route.ts` Route Handlers, handle GET/POST/PUT/DELETE, stream responses, and use the Web `Request`/`Response` APIs.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A63UxsQsEbU&t=210s
whyItMatters: Build HTTP endpoints with `app/api/. /route.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Route Handlers and API Routes

## Route Handlers and API Routes

### Why It Matters

Build HTTP endpoints with `app/api/. /route.

Build HTTP endpoints with `app/api/.../route.ts` Route Handlers, handle GET/POST/PUT/DELETE, stream responses, and use the Web `Request`/`Response` APIs.

### Prerequisites

- Stage 7: Dynamic Routes and generateStaticParams.
- HTTP methods and status codes.
- The Web Fetch API (Request, Response, Headers).

### Topics

- Route Handlers vs Pages Router API routes
- File convention: `route.ts` (NOT `page.tsx`) inside app/api/
- GET/POST/PUT/PATCH/DELETE exported functions
- Reading the body, query, headers, and cookies
- Returning JSON, streams, and binary with the Web Response API
- Setting cookies and headers on responses
- Edge vs Node.js runtime selection
- Caching GET route handlers with `next.revalidate` and static routes

### Key Concepts

- A `route.ts` file replaces `page.tsx` — a folder cannot have both
- Route handlers receive a `Request` (or `NextRequest`) and return a `Response` (or `NextResponse`)
- GET handlers can be cached statically if they don't read dynamic APIs
- POST/PUT/DELETE are always dynamic and never cached
- `runtime = 'edge' | 'nodejs'` selects where the handler runs

```ts
// app/api/products/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const products = await fetch("https://api.example.com/products").then((r) =>
    r.json()
  );
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();
  // ...validate, persist...
  return NextResponse.json({ ok: true, id: Math.random() }, { status: 201 });
}
```
Caption: Basic GET handler

### Common Pitfalls

- Putting both `route.ts` and `page.tsx` in the same folder — Next.js throws a build error; a folder can have only one of them.
- Forgetting that POST/PUT/DELETE handlers are never cached — they always run dynamically; only GET can be cached when it doesn't read dynamic APIs.
- Using `req.body` as a string — `Request.body` is a ReadableStream; parse JSON with `await req.json()` or form data with `await req.formData()`.
- Importing Node-only modules (fs, crypto) in a route handler marked `runtime = 'edge'` — edge runtime only supports Web APIs; use Node runtime for fs/crypto.
- Setting cookies without `httpOnly` — session cookies that are not httpOnly can be read by any JS on the page, enabling XSS token theft.

### Real-World Applications

- Vercel's API routes power webhooks, OAuth callbacks, and short-lived cron endpoints across thousands of customer projects.
- Notion uses Route Handlers for webhooks that sync external content into their database.
- Twitch uses edge Route Handlers to authenticate viewer tokens at the edge for low-latency stream protection.
- Hulu uses Node Route Handlers for billing webhooks from Stripe that update subscription state.

### Interview Questions

- 1. What is the difference between a Route Handler and a Page Router API route? — Route Handlers use `app/api/.../route.ts` with Web `Request/Response` and explicit verb exports; Page Router used `pages/api/*.ts` with `req`/`res` (Node-like).
- 2. Can a folder have both `route.ts` and `page.tsx`? — No; Next.js throws a build error because both claim the same URL path.
- 3. Which HTTP methods can be cached? — Only GET, and only when the handler does not read dynamic APIs like cookies or searchParams.
- 4. How do you set a cookie from a Route Handler? — Use `NextResponse` and call `res.cookies.set(name, value, options)` with httpOnly, secure, and sameSite flags.
- 5. What is the difference between `runtime = 'edge'` and `'nodejs'`? — Edge runs on V8 (Web APIs only, no fs/crypto, cold-start free); Node.js runs full Node but with cold starts.

### Mini Project

Build a tiny URL shortener API: A `POST /api/shorten` that accepts a URL, stores it in an in-memory Map, returns a short code, and a `GET /:code` that redirects to the original. Suggested approach:
  - Create `app/api/shorten/route.ts` with a POST handler that generates a 6-char code
  - Store mappings in a module-level `Map` (note: resets on cold start)
  - Create `app/[code]/page.tsx` (or `app/go/[code]/route.ts`) that looks up the URL and uses `redirect()` from `next/navigation`
  - Add a `GET /api/shorten?code=...` to retrieve stats
  - Add input validation with Zod and return 400 on bad input

### Exercises

1. Create `app/api/hello/route.ts` returning JSON from a GET handler; verify with curl.
2. Add a POST handler that echoes the body and verify it returns 201.
3. Set a cookie on the response and confirm it appears in the browser.
4. Add a streaming GET that emits one chunk per second for 5 seconds.
5. Add `export const runtime = 'edge'` and try importing `fs` — verify the build fails.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What file convention defines a Route Handler?
9. A) page.tsx
10. B) api.ts
11. C) handler.ts
12. D) route.ts (*)
13. Explanation: A `route.ts` file inside any `app/` folder (typically `app/api/.../`) defines a Route Handler that responds to HTTP requests at that path.
14. Q2: Which HTTP methods can be statically cached?
15. A) GET only (when no dynamic APIs are read) (*)
16. B) POST
17. C) PUT and PATCH
18. D) DELETE
19. Explanation: Only GET handlers can be cached, and only when they do not read cookies, headers, or searchParams; POST/PUT/PATCH/DELETE are always dynamic.
20. Q3: Can a folder have both `route.ts` and `page.tsx`?
21. A) Yes, route.ts takes precedence
22. B) No, the build fails — they claim the same path (*)
23. C) Yes, page.tsx takes precedence
24. D) Only in the Pages Router
25. Explanation: A folder cannot contain both `route.ts` and `page.tsx`; both would respond to the same URL path, so Next.js throws a build error.
26. Q4: How do you parse a JSON body in a Route Handler?
27. A) req.body as string
28. B) JSON.parse(req)
29. C) await req.json() (*)
30. D) req.body.json()
31. Explanation: The Web `Request.body` is a ReadableStream; call `await req.json()` to parse the body as JSON. For form data use `await req.formData()`.
32. Q5: Which runtime supports Node-only modules like `fs`?
33. A) edge
34. B) Both
35. C) Neither
36. D) nodejs (*)
37. Explanation: `runtime = 'nodejs'` (the default) supports Node APIs; `runtime = 'edge'` runs on V8 with Web APIs only and cannot import fs, crypto, or most Node modules.
38. Q6: How do you set a cookie on a NextResponse?
39. A) res.cookies.set(name, value, options) (*)
40. B) res.headers.set('Cookie', ...)
41. C) res.setCookie(...)
42. D) document.cookie = ...
43. Explanation: `NextResponse` exposes a `cookies` API; call `res.cookies.set(name, value, { httpOnly, secure, sameSite, maxAge, path })` to set a cookie properly.
44. Q7: Which flag on a session cookie prevents JavaScript from reading it?
45. A) secure
46. B) httpOnly (*)
47. C) sameSite
48. D) maxAge
49. Explanation: `httpOnly: true` prevents `document.cookie` from reading the cookie, mitigating XSS-based token theft; always set it on session cookies.
50. Q8: What does a streaming Route Handler return?
51. A) A string
52. B) A Buffer
53. C) A ReadableStream wrapped in a Response/NextResponse (*)
54. D) An async iterator
55. Explanation: Build a `ReadableStream` and return it inside a `NextResponse` with the right Content-Type; the client receives chunks as they are enqueued.
56. Q9: What is `NextRequest`?
57. A) A hook for client components
58. B) A Node.js http.IncomingMessage
59. C) A Websocket
60. D) A replacement for Request that adds Next-specific helpers like nextUrl and cookies (*)
61. Explanation: `NextRequest` extends the Web `Request` with Next.js helpers such as `nextUrl` (with parsed searchParams), `cookies`, and geo/IP info.
62. Q10: Which is true about POST handlers?
63. A) They are always dynamic and never cached (*)
64. B) They can be cached with revalidate
65. C) They run only on the edge
66. D) They must return JSON
67. Explanation: POST (and PUT/PATCH/DELETE) handlers always run per-request and are never cached, because caching write operations would be incorrect.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What file convention defines a Route Handler?
  options:
    - page.tsx
    - api.ts
    - handler.ts
    - route.ts
  correctIndex: 3
  explanation: A `route.ts` file inside any `app/` folder (typically `app/api/.../`) defines a Route Handler that responds to HTTP requests at that path.
- id: q2
  question: Which HTTP methods can be statically cached?
  options:
    - GET only (when no dynamic APIs are read)
    - POST
    - PUT and PATCH
    - DELETE
  correctIndex: 0
  explanation: Only GET handlers can be cached, and only when they do not read cookies, headers, or searchParams; POST/PUT/PATCH/DELETE are always dynamic.
- id: q3
  question: Can a folder have both `route.ts` and `page.tsx`?
  options:
    - Yes, route.ts takes precedence
    - No, the build fails — they claim the same path
    - Yes, page.tsx takes precedence
    - Only in the Pages Router
  correctIndex: 1
  explanation: A folder cannot contain both `route.ts` and `page.tsx`; both would respond to the same URL path, so Next.js throws a build error.
- id: q4
  question: How do you parse a JSON body in a Route Handler?
  options:
    - req.body as string
    - JSON.parse(req)
    - await req.json()
    - req.body.json()
  correctIndex: 2
  explanation: The Web `Request.body` is a ReadableStream; call `await req.json()` to parse the body as JSON. For form data use `await req.formData()`.
- id: q5
  question: Which runtime supports Node-only modules like `fs`?
  options:
    - edge
    - Both
    - Neither
    - nodejs
  correctIndex: 3
  explanation: "`runtime = 'nodejs'` (the default) supports Node APIs; `runtime = 'edge'` runs on V8 with Web APIs only and cannot import fs, crypto, or most Node modules."
- id: q6
  question: How do you set a cookie on a NextResponse?
  options:
    - res.cookies.set(name, value, options)
    - res.headers.set('Cookie', ...)
    - res.setCookie(...)
    - document.cookie = ...
  correctIndex: 0
  explanation: "`NextResponse` exposes a `cookies` API; call `res.cookies.set(name, value, { httpOnly, secure, sameSite, maxAge, path })` to set a cookie properly."
- id: q7
  question: Which flag on a session cookie prevents JavaScript from reading it?
  options:
    - secure
    - httpOnly
    - sameSite
    - maxAge
  correctIndex: 1
  explanation: "`httpOnly: true` prevents `document.cookie` from reading the cookie, mitigating XSS-based token theft; always set it on session cookies."
- id: q8
  question: What does a streaming Route Handler return?
  options:
    - A string
    - A Buffer
    - A ReadableStream wrapped in a Response/NextResponse
    - An async iterator
  correctIndex: 2
  explanation: Build a `ReadableStream` and return it inside a `NextResponse` with the right Content-Type; the client receives chunks as they are enqueued.
- id: q9
  question: What is `NextRequest`?
  options:
    - A hook for client components
    - A Node.js http.IncomingMessage
    - A Websocket
    - A replacement for Request that adds Next-specific helpers like nextUrl and cookies
  correctIndex: 3
  explanation: "`NextRequest` extends the Web `Request` with Next.js helpers such as `nextUrl` (with parsed searchParams), `cookies`, and geo/IP info."
- id: q10
  question: Which is true about POST handlers?
  options:
    - They are always dynamic and never cached
    - They can be cached with revalidate
    - They run only on the edge
    - They must return JSON
    - handlers always run per-request and are never cached, because caching write operations would be incorrect.
  correctIndex: 0
  explanation: POST (and PUT/PATCH/DELETE) handlers always run per-request and are never cached, because caching write operations would be incorrect.
```

