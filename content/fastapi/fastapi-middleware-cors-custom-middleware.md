---
slug: fastapi-middleware-cors-custom-middleware
id: fastapi-11
track: fastapi
order: 11
title: Middleware, CORS, and Custom Middleware
description: Add CORS, request-id, timing, and custom middleware using both `@app.middleware("http")` and ASGI middleware classes, and understand ordering, performance, and the per-request scope.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=3000s
whyItMatters: Add CORS, request-id, timing, and custom middleware using both `@app. middleware("http")` and ASGI middleware classes, and understand ordering, performance, and the per-request scope.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# Middleware, CORS, and Custom Middleware

## Middleware, CORS, and Custom Middleware

### Why It Matters

Add CORS, request-id, timing, and custom middleware using both `@app. middleware("http")` and ASGI middleware classes, and understand ordering, performance, and the per-request scope.

Add CORS, request-id, timing, and custom middleware using both `@app.middleware("http")` and ASGI middleware classes, and understand ordering, performance, and the per-request scope.

### Prerequisites

- Stage 1: Getting Started with FastAPI
- Stage 9: async/await in FastAPI
- Familiarity with HTTP headers and status codes.

### Topics

- `CORSMiddleware` and preflight (`OPTIONS`) handling
- `add_middleware(...)` vs `@app.middleware("http")` vs ASGI middleware classes
- Middleware ordering: outermost first; added last runs first on request
- Request ID, timing, and structured logging middleware
- `request.state` for stashing per-request data
- Common built-ins: `TrustedHostMiddleware`, `GZipMiddleware`, `HTTPSRedirectMiddleware`
- Custom ASGI middleware via `__init__(self, app)` and `__call__(scope, receive, send)`
- Performance: avoid blocking I/O and heavy CPU work in middleware

### Key Concepts

- Middleware added later wraps middleware added earlier: the last-added runs first on the request, last on the response.
- CORS preflight (`OPTIONS`) is handled by `CORSMiddleware`; if it's misconfigured, browser requests fail with confusing errors.
- `BaseHTTPMiddleware` is convenient but adds overhead; pure ASGI middleware is faster.
- `request.state` is the per-request scratchpad; use it to pass data from middleware to handlers.
- Heavy work in middleware runs on every request including `/health`; gate expensive work by path.

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.example.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
Caption: CORS setup

### Common Pitfalls

- Setting `allow_origins=["*"]` with `allow_credentials=True` — browsers reject this combination; list explicit origins when credentials are involved.
- Forgetting the `OPTIONS` preflight — `CORSMiddleware` handles it automatically only if it's mounted; double-check the order.
- Adding middleware after routes are defined — middleware must be added before requests are served (the order of `add_middleware` calls matters at startup, not at request time).
- Doing blocking I/O in middleware — it stalls the event loop for every request; offload with `run_in_threadpool` if needed.
- Heavy work in middleware running on `/health` — gate by path; health checks should return in <10ms or load balancers will fail you.

### Real-World Applications

- Stripe's API injects `Request-Id` in every response so support can trace a charge — the canonical request-id middleware use case.
- GitHub sets `X-GitHub-Request-Id` and timing headers on every API call; same pattern via FastAPI middleware.
- Netflix's edge adds request IDs and per-route timing to correlate spans across dozens of services; FastAPI middleware is the per-service piece.
- Microsoft Azure sets `x-ms-request-id` and `x-ms-correlation-request-id` headers — both expressible as FastAPI middleware.

### Interview Questions

- 1. What's the middleware execution order? — Last-added runs first on the request, last on the response (outermost wraps innermost).
- 2. Why does `allow_origins=["*"]` + `allow_credentials=True` fail? — Browsers reject the combination for security; you must list explicit origins when credentials are involved.
- 3. What's the difference between `@app.middleware("http")` and a pure ASGI middleware? — The former uses `BaseHTTPMiddleware` (convenient, slower); the latter is raw ASGI (faster, more code).
- 4. What is `request.state` for? — A per-request scratchpad namespace; middleware can stash `request.state.request_id` and handlers can read it.
- 5. Why must `/health` be fast? — Load balancers probe it frequently; if it's slow (e.g., due to middleware DB checks), the LB may deregister you.

### Mini Project

Build a "Production-Ready Middleware Stack": Add CORS (one explicit origin), GZip (min 1KB), TrustedHost, request-id, and timing middleware to a small FastAPI app. Verify response headers include `X-Request-ID` and `X-Elapsed-Ms`. Confirm `/health` is fast. Suggested approach:
  - Add `CORSMiddleware` with `allow_origins=["https://app.example.com"]`
  - Add `GZipMiddleware(minimum_size=1000)`
  - Add `TrustedHostMiddleware(allowed_hosts=["api.example.com"])`
  - Write `@app.middleware("http")` setting `request.state.request_id`
  - Return headers on the response; test with `curl -i -H "Origin: https://app.example.com"`

### Exercises

1. Add `CORSMiddleware` and test from a browser-based fetch (or `curl -H "Origin: ..."`) to verify `Access-Control-Allow-Origin`.
2. Add a request-id middleware that sets `request.state.request_id` and reads it in a route.
3. Add GZipMiddleware and confirm large JSON responses get `Content-Encoding: gzip`.
4. Write a pure ASGI middleware that adds a header and verify ordering vs `@app.middleware("http")`.
5. >>> QUIZ (Stage 11) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: What's the execution order of middleware?
8. A) First-added runs first on request
9. B) Alphabetical by name
10. C) Last-added runs first on request, last on response (*)
11. D) Random
12. Explanation: Middleware wraps the app like layers of an onion; the outermost (last added) is the first to see the request and the last to see the response.
13. Q2: What happens if you set `allow_origins=["*"]` with `allow_credentials=True`?
14. A) It works fine
15. B) Only GET is allowed
16. C) Cookies are auto-attached
17. D) Browsers reject the combination (*)
18. Explanation: The CORS spec forbids wildcard origins with credentials; you must list explicit origins when cookies are involved.
19. Q3: Which handles the CORS preflight (`OPTIONS`) request?
20. A) CORSMiddleware (automatically) (*)
21. B) The route handler
22. C) GZipMiddleware
23. D) The ASGI server
24. Explanation: `CORSMiddleware` intercepts `OPTIONS` preflight and returns the appropriate `Access-Control-Allow-*` headers.
25. Q4: Which is faster: `@app.middleware("http")` or a pure ASGI middleware?
26. A) `@app.middleware("http")`
27. B) Pure ASGI middleware (*)
28. C) They're identical
29. D) Depends on Python version
30. Explanation: `@app.middleware("http")` uses `BaseHTTPMiddleware` which adds overhead; pure ASGI middleware skips the request/response wrapping.
31. Q5: What is `request.state` for?
32. A) Caching across requests
33. B) Storing sessions
34. C) Stashing per-request data (e.g., request_id) (*)
35. D) Holding global config
36. Explanation: `request.state` is a per-request namespace; middleware can write to it and handlers can read from it.
37. Q6: Why must `/health` be fast?
38. A) It's a special route
39. B) It doesn't run middleware
40. C) It can't return JSON
41. D) Load balancers probe it frequently; slow responses cause deregistration (*)
42. Explanation: LBs probe health endpoints every few seconds; if middleware makes them slow, the LB may consider the instance unhealthy.
43. Q7: Which middleware redirects HTTP to HTTPS?
44. A) `HTTPSRedirectMiddleware` (*)
45. B) `CORSMiddleware`
46. C) `TrustedHostMiddleware`
47. D) `GZipMiddleware`
48. Explanation: `HTTPSRedirectMiddleware` returns a 307 redirect to the HTTPS URL.
49. Q8: What does `GZipMiddleware(minimum_size=1000)` do?
50. A) Compresses all responses
51. B) Compresses responses larger than 1000 bytes (*)
52. C) Limits response size to 1000 bytes
53. D) Decompresses request bodies
54. Explanation: Only responses above `minimum_size` are gzipped (small ones aren't worth the overhead).
55. Q9: Why avoid blocking I/O in middleware?
56. A) Middleware can't use I/O
57. B) Blocking I/O is insecure
58. C) It stalls the event loop for every request (*)
59. D) It causes CORS errors
60. Explanation: Middleware runs on the event loop; blocking I/O stalls every concurrent request on the worker.
61. Q10: How do you add a custom ASGI middleware class?
62. A) `@app.middleware("asgi")`
63. B) `app.middleware.append(MyMiddleware)`
64. C) `MyMiddleware.register(app)`
65. D) `app.add_middleware(MyMiddleware)` (*)
66. Explanation: `app.add_middleware(cls, **kwargs)` instantiates the class wrapping the app; the class must accept `app` in `__init__`.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the execution order of middleware?
  options:
    - First-added runs first on request
    - Alphabetical by name
    - Last-added runs first on request, last on response
    - Random
  correctIndex: 2
  explanation: Middleware wraps the app like layers of an onion; the outermost (last added) is the first to see the request and the last to see the response.
- id: q2
  question: What happens if you set `allow_origins=["*"]` with `allow_credentials=True`?
  options:
    - It works fine
    - Only GET is allowed
    - Cookies are auto-attached
    - Browsers reject the combination
  correctIndex: 3
  explanation: The CORS spec forbids wildcard origins with credentials; you must list explicit origins when cookies are involved.
- id: q3
  question: Which handles the CORS preflight (`OPTIONS`) request?
  options:
    - CORSMiddleware (automatically)
    - The route handler
    - GZipMiddleware
    - The ASGI server
  correctIndex: 0
  explanation: "`CORSMiddleware` intercepts `OPTIONS` preflight and returns the appropriate `Access-Control-Allow-*` headers."
- id: q4
  question: 'Which is faster: `@app.middleware("http")` or a pure ASGI middleware?'
  options:
    - '`@app.middleware("http")`'
    - Pure ASGI middleware
    - They're identical
    - Depends on Python version
  correctIndex: 1
  explanation: '`@app.middleware("http")` uses `BaseHTTPMiddleware` which adds overhead; pure ASGI middleware skips the request/response wrapping.'
- id: q5
  question: What is `request.state` for?
  options:
    - Caching across requests
    - Storing sessions
    - Stashing per-request data (e.g., request_id)
    - Holding global config
  correctIndex: 2
  explanation: "`request.state` is a per-request namespace; middleware can write to it and handlers can read from it."
- id: q6
  question: Why must `/health` be fast?
  options:
    - It's a special route
    - It doesn't run middleware
    - It can't return JSON
    - Load balancers probe it frequently; slow responses cause deregistration
  correctIndex: 3
  explanation: LBs probe health endpoints every few seconds; if middleware makes them slow, the LB may consider the instance unhealthy.
- id: q7
  question: Which middleware redirects HTTP to HTTPS?
  options:
    - "`HTTPSRedirectMiddleware`"
    - "`CORSMiddleware`"
    - "`TrustedHostMiddleware`"
    - "`GZipMiddleware`"
  correctIndex: 0
  explanation: "`HTTPSRedirectMiddleware` returns a 307 redirect to the HTTPS URL."
- id: q8
  question: What does `GZipMiddleware(minimum_size=1000)` do?
  options:
    - Compresses all responses
    - Compresses responses larger than 1000 bytes
    - Limits response size to 1000 bytes
    - Decompresses request bodies
  correctIndex: 1
  explanation: Only responses above `minimum_size` are gzipped (small ones aren't worth the overhead).
- id: q9
  question: Why avoid blocking I/O in middleware?
  options:
    - Middleware can't use I/O
    - Blocking I/O is insecure
    - It stalls the event loop for every request
    - It causes CORS errors
  correctIndex: 2
  explanation: Middleware runs on the event loop; blocking I/O stalls every concurrent request on the worker.
- id: q10
  question: How do you add a custom ASGI middleware class?
  options:
    - '`@app.middleware("asgi")`'
    - "`app.middleware.append(MyMiddleware)`"
    - "`MyMiddleware.register(app)`"
    - "`app.add_middleware(MyMiddleware)`"
  correctIndex: 3
  explanation: "`app.add_middleware(cls, **kwargs)` instantiates the class wrapping the app; the class must accept `app` in `__init__`."
```

