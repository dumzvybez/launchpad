---
slug: nodejs-express-fastify-web-frameworks
id: nodejs-16
track: nodejs
order: 16
title: Express and Fastify — Web Frameworks
description: Build HTTP APIs with Express (the de facto standard) and Fastify (2-3x faster with schema-based serialization), use middleware, validate input, and handle async errors.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=w-7RQ46RgxU&t=300s
whyItMatters: Build HTTP APIs with Express (the de facto standard) and Fastify (2-3x faster with schema-based serialization), use middleware, validate input, and handle async errors.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# Express and Fastify — Web Frameworks

## Express and Fastify — Web Frameworks

### Why It Matters

Build HTTP APIs with Express (the de facto standard) and Fastify (2-3x faster with schema-based serialization), use middleware, validate input, and handle async errors.

Build HTTP APIs with Express (the de facto standard) and Fastify (2-3x faster with schema-based serialization), use middleware, validate input, and handle async errors.

### Prerequisites

- Stage 5: The http Module — Building a Server from Scratch.
- Stage 9: Errors, Exceptions, and Unhandled Rejections.
- Stage 12: async/await and the Microtask Queue.

### Topics

- Express basics: `app.get/post/use`, `req`/`res` API, middleware ordering
- Fastify basics: plugins, hooks, JSON schemas, fast serialization
- Routing: path params (`:id`), query strings, wildcards
- Middleware patterns: logging, auth, rate-limiting, error handling
- Input validation with `zod` (schema-first, type-safe)
- Async error handling: Express 4 needs wrappers, Fastify auto-catches
- Static files, JSON parsing, body size limits
- Performance comparison and when to choose which

### Key Concepts

- Express is the de facto standard with the largest middleware ecosystem; Fastify is 2-3x faster due to schema-based JSON serialization (compile-time, not runtime).
- Middleware runs in registration order; `app.use(fn)` runs for every route unless mounted on a path prefix.
- Express 4 does NOT auto-catch async errors — use `express-async-errors` or wrap handlers; Express 5 (in beta) does.
- Fastify auto-catches async errors and validates input against JSON Schema (via `ajv`).
- Always validate input at the boundary — use `zod` (preferred) or `ajv`; never trust `req.body`.

```javascript
const express = require("express");
const app = express();

app.use(express.json());               // parse JSON bodies (default limit 100kb)

let todos = [];

app.get("/todos", (req, res) => res.json(todos));

app.post("/todos", async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "title required" });
    const todo = { id: todos.length + 1, title, done: false };
    todos.push(todo);
    res.status(201).json(todo);
  } catch (err) { next(err); }     // pass to error handler
});

// Error handler (last middleware, 4 args)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "internal" });
});

app.listen(3000);
```
Caption: Express JSON API

### Common Pitfalls

- Forgetting that Express 4 doesn't catch async errors — a rejected Promise in a handler becomes `unhandledRejection` and crashes the process; use `express-async-errors` shim or wrap each handler with `asyncHandler(fn)`.
- Middleware order: define `app.use(express.json())` before routes, and the error handler (4-arg middleware) LAST — otherwise bodies aren't parsed and errors aren't caught.
- Not validating input — `req.body` is whatever the client sent; without `zod`/`ajv` validation, an attacker can inject unexpected types or fields.
- Sync middleware blocking the loop — a `bcrypt.compareSync` or `JSON.parse` on a 10MB body in middleware stalls every active request.
- Leaking error stacks in production — `res.status(500).send(err.stack)` exposes internals; return a generic message and log the full error server-side.

### Real-World Applications

- PayPal migrated its API layer to Express and reported significant productivity gains over the previous Java stack.
- Uber's API gateway uses Express-style middleware composition for auth, rate-limiting, and observability.
- Netflix's internal admin tools are built on Express for rapid iteration.
- Many startups (and Y Combinator companies) use Fastify for performance-critical APIs; the MySpace reboot used Fastify.

### Interview Questions

- 1. Express vs Fastify — what would you pick? — Express for ecosystem and learning resources; Fastify for raw performance (2-3x faster via schema-based serialization) and built-in validation.
- 2. What is middleware in Express? — A function `(req, res, next) => ...` that runs in registration order; `app.use(fn)` mounts it for every route, error handlers have 4 args `(err, req, res, next)`.
- 3. How do you handle async errors in Express 4? — Wrap the handler with `asyncHandler(fn)` (a try/catch that calls `next(err)`), or use the `express-async-errors` shim globally; Express 5 catches them natively.
- 4. Why is Fastify faster than Express? — Fastify compiles JSON schemas (via `ajv` + `fast-json-stringify`) into optimized serializers at startup; Express uses `JSON.stringify` at runtime.
- 5. How do you validate input in modern Node APIs? — Use `zod` (schema-first, type-safe, runtime + TypeScript inference) or `ajv` (JSON Schema, Fastify built-in); never trust `req.body` directly.

### Mini Project

Build a REST API with Validation: A `/users` resource (GET list, POST create, GET by id, PATCH update, DELETE) with zod-validated input, request-id middleware, and a global error handler that returns JSON errors. Suggested approach:
  - Scaffold with `express` + `zod` (or `fastify` + JSON schemas)
  - Add request-id middleware (generate UUID, set on req + response header)
  - Define a `UserSchema` and `UserUpdateSchema` with zod
  - Validate `req.body` in POST and PATCH with `schema.safeParse`
  - Add a 4-arg error handler returning `{ error, requestId }` JSON

### Exercises

1. Build an Express server with GET `/`, GET `/users`, POST `/users` and verify with `curl`.
2. Convert the same to Fastify with JSON schemas; compare `ab` benchmark numbers.
3. Add zod validation to POST and return 400 with field-level errors on invalid input.
4. Write a request-id + logging middleware that logs method, path, status, and elapsed ms.
5. Build a 4-arg error handler that catches all thrown errors and returns JSON.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is true about Express 4 and async errors?
9. A) It auto-catches rejected promises in handlers
10. B) It only catches in production
11. C) It crashes the entire process
12. D) It does NOT auto-catch; you must wrap handlers or use a shim (*)
13. Explanation: Express 4 (and earlier) does not catch rejected promises from async handlers; use `express-async-errors` shim or wrap each handler with a try/catch that calls `next(err)`. Express 5 catches them.
14. Q2: Why is Fastify faster than Express?
15. A) It compiles JSON schemas into optimized serializers at startup (*)
16. B) It's written in C++
17. C) It uses fewer dependencies
18. D) It runs on V8 directly
19. Explanation: Fastify uses `ajv` for schema validation and `fast-json-stringify` to compile JSON schemas into fast serializers at startup; Express uses `JSON.stringify` at runtime.
20. Q3: In Express, what signature does an error-handling middleware have?
21. A) (req, res, next)
22. B) (err, req, res, next) — 4 args (*)
23. C) (req, res)
24. D) (err, next)
25. Explanation: Error middleware has 4 args: `(err, req, res, next)`; Express identifies it by arity (4 args). It must be registered LAST after all routes.
26. Q4: What is the recommended library for input validation in modern Node?
27. A) validator.js
28. B) joi
29. C) zod (*)
30. D) hand-written if statements
31. Explanation: `zod` is schema-first, type-safe (infers TypeScript types), and works in both runtime and compile time. `ajv` (JSON Schema) is the Fastify default.
32. Q5: In which order should you register Express middleware?
33. A) Routes first, then body parser, then error handler
34. B) Error handler first, then routes
35. C) Order doesn't matter
36. D) Body parser first, then routes, then error handler last (*)
37. Explanation: Body parsers must run before routes (so `req.body` exists); error handlers (4-arg) must be registered last so they catch errors from all routes.
38. Q6: What does `app.use(express.json())` do?
39. A) Parses JSON request bodies into `req.body` (*)
40. B) Validates JSON
41. C) Sends JSON responses
42. D) Sets the Content-Type header
43. Explanation: `express.json()` is body-parsing middleware that reads the request body (default limit 100kb), parses it as JSON, and assigns to `req.body`.
44. Q7: What happens if you forget to call `next()` in middleware?
45. A) The request auto-completes
46. B) The request hangs (no further middleware runs) (*)
47. C) Express throws
48. D) Nothing
49. Explanation: Middleware must call `next()` (or send a response) to pass control; otherwise the request hangs until the client times out.
50. Q8: Which Fastify feature validates and serializes responses?
51. A) `res.json()`
52. B) `reply.send()` always
53. C) `response` schema in route options (*)
54. D) Hooks
55. Explanation: Fastify's `schema.response[status]` defines the response shape; Fastify compiles it into a fast serializer that skips unknown fields and outputs optimized JSON.
56. Q9: What is the default body size limit in Express?
57. A) 1 MB
58. B) 10 MB
59. C) Unlimited
60. D) 100 kb (*)
61. Explanation: `express.json()` defaults to a 100kb body limit; override with `express.json({ limit: "1mb" })`. Larger limits expose you to memory-exhaustion DoS.
62. Q10: Why should you validate input at the API boundary?
63. A) Never trust client input — protect against type confusion, injection, and unexpected fields (*)
64. B) Faster performance
65. C) Express requires it
66. D) It reduces bundle size
67. Explanation: `req.body` is whatever the client sent; without validation (zod, ajv), attackers can inject unexpected types or fields. Validate at the boundary, trust nowhere else.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is true about Express 4 and async errors?
  options:
    - It auto-catches rejected promises in handlers
    - It only catches in production
    - It crashes the entire process
    - It does NOT auto-catch; you must wrap handlers or use a shim
  correctIndex: 3
  explanation: Express 4 (and earlier) does not catch rejected promises from async handlers; use `express-async-errors` shim or wrap each handler with a try/catch that calls `next(err)`. Express 5 catches them.
- id: q2
  question: Why is Fastify faster than Express?
  options:
    - It compiles JSON schemas into optimized serializers at startup
    - It's written in C++
    - It uses fewer dependencies
    - It runs on V8 directly
  correctIndex: 0
  explanation: Fastify uses `ajv` for schema validation and `fast-json-stringify` to compile JSON schemas into fast serializers at startup; Express uses `JSON.stringify` at runtime.
- id: q3
  question: In Express, what signature does an error-handling middleware have?
  options:
    - (req, res, next)
    - (err, req, res, next) — 4 args
    - (req, res)
    - (err, next)
  correctIndex: 1
  explanation: "Error middleware has 4 args: `(err, req, res, next)`; Express identifies it by arity (4 args). It must be registered LAST after all routes."
- id: q4
  question: What is the recommended library for input validation in modern Node?
  options:
    - validator.js
    - joi
    - zod
    - hand-written if statements
  correctIndex: 2
  explanation: "`zod` is schema-first, type-safe (infers TypeScript types), and works in both runtime and compile time. `ajv` (JSON Schema) is the Fastify default."
- id: q5
  question: In which order should you register Express middleware?
  options:
    - Routes first, then body parser, then error handler
    - Error handler first, then routes
    - Order doesn't matter
    - Body parser first, then routes, then error handler last
  correctIndex: 3
  explanation: Body parsers must run before routes (so `req.body` exists); error handlers (4-arg) must be registered last so they catch errors from all routes.
- id: q6
  question: What does `app.use(express.json())` do?
  options:
    - Parses JSON request bodies into `req.body`
    - Validates JSON
    - Sends JSON responses
    - Sets the Content-Type header
  correctIndex: 0
  explanation: "`express.json()` is body-parsing middleware that reads the request body (default limit 100kb), parses it as JSON, and assigns to `req.body`."
- id: q7
  question: What happens if you forget to call `next()` in middleware?
  options:
    - The request auto-completes
    - The request hangs (no further middleware runs)
    - Express throws
    - Nothing
  correctIndex: 1
  explanation: Middleware must call `next()` (or send a response) to pass control; otherwise the request hangs until the client times out.
- id: q8
  question: Which Fastify feature validates and serializes responses?
  options:
    - "`res.json()`"
    - "`reply.send()` always"
    - "`response` schema in route options"
    - Hooks
  correctIndex: 2
  explanation: Fastify's `schema.response[status]` defines the response shape; Fastify compiles it into a fast serializer that skips unknown fields and outputs optimized JSON.
- id: q9
  question: What is the default body size limit in Express?
  options:
    - 1 MB
    - 10 MB
    - Unlimited
    - 100 kb
  correctIndex: 3
  explanation: '`express.json()` defaults to a 100kb body limit; override with `express.json({ limit: "1mb" })`. Larger limits expose you to memory-exhaustion DoS.'
- id: q10
  question: Why should you validate input at the API boundary?
  options:
    - Never trust client input — protect against type confusion, injection, and unexpected fields
    - Faster performance
    - Express requires it
    - It reduces bundle size
  correctIndex: 0
  explanation: "`req.body` is whatever the client sent; without validation (zod, ajv), attackers can inject unexpected types or fields. Validate at the boundary, trust nowhere else."
```

