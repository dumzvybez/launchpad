---
slug: nodejs-http-module-building-server-scratch
id: nodejs-05
track: nodejs
order: 5
title: The http Module — Building a Server from Scratch
description: Build HTTP servers and clients with the built-in `node:http` module — handle requests, responses, status codes, headers, JSON bodies, and basic routing without any framework.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zb3Qk8SG5Ms&t=120s
whyItMatters: Build HTTP servers and clients with the built-in `node:http` module — handle requests, responses, status codes, headers, JSON bodies, and basic routing without any framework.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# The http Module — Building a Server from Scratch

## The http Module — Building a Server from Scratch

### Why It Matters

Build HTTP servers and clients with the built-in `node:http` module — handle requests, responses, status codes, headers, JSON bodies, and basic routing without any framework.

Build HTTP servers and clients with the built-in `node:http` module — handle requests, responses, status codes, headers, JSON bodies, and basic routing without any framework.

### Prerequisites

- Stage 1: Getting Started with Node.js.
- Stage 2: The Node.js Event Loop (request handlers must not block).
- Stage 6: Streams (req is a Readable stream, res is a Writable stream).

### Topics

- `http.createServer(handler)` and the request/response objects
- `req` as a Readable stream: reading the body, headers, method, url
- `res` as a Writable stream: `setHeader`, `writeHead`, `write`, `end`
- Status codes and standard headers (Content-Type, Content-Length)
- Routing by `req.method` and `req.url` (manual; use Express/Fastify for more)
- HTTP client via global `fetch` (Node 18+) and `http.request`
- Query string parsing with `node:url` and `URLSearchParams`
- Server timeouts: `requestTimeout`, `headersTimeout`, `keepAliveTimeout`

### Key Concepts

- A single Node process serves thousands of concurrent connections via the event loop; one handler runs at a time per request.
- `req` is a Readable stream — read the body by listening to 'data'/'end' events or use `req.toArray()`/async iteration.
- Always call `res.end()` exactly once per request; not calling it leaves the connection hanging.
- Bind to `0.0.0.0` (not `localhost`) in containers so the host port can route to the container.
- Use `fetch` (global since Node 18) for outbound HTTP; the older `http.request` is more verbose.

```javascript
const http = require("node:http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!\n");
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running at http://localhost:3000");
});
```
Caption: Hello-world HTTP server

### Common Pitfalls

- Forgetting to call `res.end()` — the request hangs and the connection leaks; always end the response exactly once per request.
- Not handling the `'error'` event on the server (`server.on("error", ...)`) — a bind failure (EADDRINUSE) throws an unhandled exception and crashes the process.
- Reading the request body for every route — `req` is a stream; if you don't consume it for GET/DELETE, the connection stays open longer than needed.
- Binding to `localhost` or `127.0.0.1` in a Docker container — the host can't reach the service; bind to `0.0.0.0` instead.
- Setting `Content-Type: application/json` but writing non-JSON or omitting `Content-Length` — clients and proxies may misparse the response.

### Real-World Applications

- Express and Fastify are both built on `node:http` — your favorite framework is a wrapper around `http.createServer`.
- The npm registry's HTTP frontend is built on Node's http module (with Express-style middleware).
- PayPal's Node services use raw http for performance-critical endpoints where Express overhead matters.
- Stripe's CLI and webhook forwarder use `node:http` to receive and replay webhook events locally.

### Interview Questions

- 1. How does `http.createServer` work? — It returns an `http.Server` (an EventEmitter) that listens on a port; for each incoming request it emits a 'request' event with `req` (IncomingMessage) and `res` (ServerResponse).
- 2. What are `req` and `res` in a handler? — `req` is an IncomingMessage that is also a Readable stream (for the body) with headers/method/url; `res` is a ServerResponse that is a Writable stream you call `end()` on.
- 3. How do you read a POST body? — `req` is a stream; collect chunks via 'data'/'end' events or async iteration (`for await (const chunk of req)`), then parse with `JSON.parse`.
- 4. Why bind to `0.0.0.0` in Docker? — `localhost` only accepts connections from inside the container; `0.0.0.0` accepts from any interface so the host's port-forward can reach the service.
- 5. What's the difference between `fetch` (Node 18+) and `http.request`? — `fetch` is the modern Promise-based global API; `http.request` is callback-based and verbose — prefer `fetch` for new code.

### Mini Project

Build a Pure-http JSON API Server: A no-framework REST API for managing "todos" with GET (list), POST (create), GET /:id, PATCH /:id (update), and DELETE /:id. Suggested approach:
  - Use `http.createServer` with a single async handler
  - Parse `req.url` with the `URL` global to extract pathname and query
  - Read JSON bodies with a `readJson(req)` helper using async iteration
  - Maintain an in-memory `todos` array (no DB yet)
  - Always call `res.end(JSON.stringify(...))` and set Content-Type to application/json

### Exercises

1. Build an echo server that responds with the request body as JSON.
2. Add routing for GET /, GET /users, POST /users to the JSON API example.
3. Use `fetch` to GET a JSON API and print the result; add an AbortController timeout.
4. Configure `headersTimeout` and `requestTimeout` and verify a slow client gets dropped.
5. Make a streaming proxy: forward a request body chunk-by-chunk to another server.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which method creates an HTTP server in Node?
9. A) http.createServer(handler) (*)
10. B) http.create()
11. C) new http.Server()
12. D) http.listen(handler)
13. Explanation: `http.createServer(handler)` returns an `http.Server` instance; call `.listen(port)` to bind to a port.
14. Q2: What must you call exactly once per request to finish it?
15. A) res.send()
16. B) res.end() (*)
17. C) res.complete()
18. D) res.finish()
19. Explanation: `res.end()` flushes the response and closes the connection; forgetting it leaves the request hanging and leaks the socket.
20. Q3: What is `req` in a request handler?
21. A) A Writable stream
22. B) A plain object
23. C) A Readable stream (IncomingMessage) (*)
24. D) A Buffer
25. Explanation: `req` (IncomingMessage) is a Readable stream for the request body; it also exposes headers, method, and url.
26. Q4: Since which Node version is `fetch` a global?
27. A) Node 14
28. B) Node 16
29. C) Node 22
30. D) Node 18 (*)
31. Explanation: `fetch` became a stable global in Node 18 (experimental in 16); it uses undici under the hood.
32. Q5: Which address should you bind to inside a Docker container?
33. A) 0.0.0.0 (*)
34. B) 127.0.0.1
35. C) localhost
36. D) ::1
37. Explanation: `0.0.0.0` accepts connections on all interfaces so the host's port-forward can reach the container; `localhost` only accepts from inside the container.
38. Q6: How do you read a POST body in modern Node?
39. A) req.body (always available)
40. B) Async iteration: `for await (const chunk of req)` (*)
41. C) Sync fs.readFileSync on req
42. D) There is no way; use Express
43. Explanation: `req` is a Readable stream; async iteration collects chunks you then concat and parse with `JSON.parse`.
44. Q7: Which server event should you handle to avoid crashes on EADDRINUSE?
45. A) request
46. B) connection
47. C) error (*)
48. D) listening
49. Explanation: Bind failures emit `'error'`; without a listener, Node throws an uncaught exception and crashes. Always `server.on("error", ...)`.
50. Q8: What does `res.writeHead(200, { "Content-Type": "application/json" })` do?
51. A) Sends the body
52. B) Closes the response
53. C) Aborts the request
54. D) Sets status and headers before body (*)
55. Explanation: `writeHead` writes the HTTP status line and headers; you then `res.end(body)` to send the body and close.
56. Q9: Which timeout closes a connection if the full request isn't received in time?
57. A) requestTimeout (*)
58. B) keepAliveTimeout
59. C) idleTimeout
60. D) socketTimeout
61. Explanation: `requestTimeout` (default 300s) closes the connection if the entire request isn't received within the limit; `headersTimeout` is for headers only.
62. Q10: Why is `fetch` preferred over `http.request` for new code?
63. A) It's faster
64. B) It's Promise-based and standard (*)
65. C) It supports HTTP/2
66. D) It works in older Node
67. Explanation: `fetch` is the WHATWG standard Promise-based API; `http.request` is callback-based and verbose — `fetch` is cleaner for new code.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which method creates an HTTP server in Node?
  options:
    - http.createServer(handler)
    - http.create()
    - new http.Server()
    - http.listen(handler)
  correctIndex: 0
  explanation: "`http.createServer(handler)` returns an `http.Server` instance; call `.listen(port)` to bind to a port."
- id: q2
  question: What must you call exactly once per request to finish it?
  options:
    - res.send()
    - res.end()
    - res.complete()
    - res.finish()
  correctIndex: 1
  explanation: "`res.end()` flushes the response and closes the connection; forgetting it leaves the request hanging and leaks the socket."
- id: q3
  question: What is `req` in a request handler?
  options:
    - A Writable stream
    - A plain object
    - A Readable stream (IncomingMessage)
    - A Buffer
  correctIndex: 2
  explanation: "`req` (IncomingMessage) is a Readable stream for the request body; it also exposes headers, method, and url."
- id: q4
  question: Since which Node version is `fetch` a global?
  options:
    - Node 14
    - Node 16
    - Node 22
    - Node 18
  correctIndex: 3
  explanation: "`fetch` became a stable global in Node 18 (experimental in 16); it uses undici under the hood."
- id: q5
  question: Which address should you bind to inside a Docker container?
  options:
    - 0.0.0.0
    - 127.0.0.1
    - localhost
    - ::1
  correctIndex: 0
  explanation: "`0.0.0.0` accepts connections on all interfaces so the host's port-forward can reach the container; `localhost` only accepts from inside the container."
- id: q6
  question: How do you read a POST body in modern Node?
  options:
    - req.body (always available)
    - "Async iteration: `for await (const chunk of req)`"
    - Sync fs.readFileSync on req
    - There is no way; use Express
  correctIndex: 1
  explanation: "`req` is a Readable stream; async iteration collects chunks you then concat and parse with `JSON.parse`."
- id: q7
  question: Which server event should you handle to avoid crashes on EADDRINUSE?
  options:
    - request
    - connection
    - error
    - listening
  correctIndex: 2
  explanation: Bind failures emit `'error'`; without a listener, Node throws an uncaught exception and crashes. Always `server.on("error", ...)`.
- id: q8
  question: 'What does `res.writeHead(200, { "Content-Type": "application/json" })` do?'
  options:
    - Sends the body
    - Closes the response
    - Aborts the request
    - Sets status and headers before body
  correctIndex: 3
  explanation: "`writeHead` writes the HTTP status line and headers; you then `res.end(body)` to send the body and close."
- id: q9
  question: Which timeout closes a connection if the full request isn't received in time?
  options:
    - requestTimeout
    - keepAliveTimeout
    - idleTimeout
    - socketTimeout
  correctIndex: 0
  explanation: "`requestTimeout` (default 300s) closes the connection if the entire request isn't received within the limit; `headersTimeout` is for headers only."
- id: q10
  question: Why is `fetch` preferred over `http.request` for new code?
  options:
    - It's faster
    - It's Promise-based and standard
    - It supports HTTP/2
    - It works in older Node
  correctIndex: 1
  explanation: "`fetch` is the WHATWG standard Promise-based API; `http.request` is callback-based and verbose — `fetch` is cleaner for new code."
```

