---
slug: fastapi-websocket-routes
id: fastapi-13
track: fastapi
order: 13
title: WebSocket Routes
description: Add WebSocket endpoints with `@app.websocket("/ws")`, manage connections in a connection manager, authenticate via query-string tokens, and handle graceful disconnects.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=3600s
whyItMatters: Add WebSocket endpoints with `@app. websocket("/ws")`, manage connections in a connection manager, authenticate via query-string tokens, and handle graceful disconnects.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# WebSocket Routes

## WebSocket Routes

### Why It Matters

Add WebSocket endpoints with `@app. websocket("/ws")`, manage connections in a connection manager, authenticate via query-string tokens, and handle graceful disconnects.

Add WebSocket endpoints with `@app.websocket("/ws")`, manage connections in a connection manager, authenticate via query-string tokens, and handle graceful disconnects.

### Prerequisites

- Stage 7: Security — OAuth2, JWT, API Keys
- Stage 9: async/await in FastAPI
- Familiarity with the WebSocket protocol basics.

### Topics

- `@app.websocket("/ws")` and `WebSocket` parameter
- `accept()`, `receive_text()`, `send_text()`, `send_json()`, `close()`
- The `WebSocketDisconnect` exception and graceful teardown
- A `ConnectionManager` class for broadcasting
- Authentication via query-string token (browsers can't set WS headers)
- Heartbeats (ping/pong) and idle timeouts
- Per-route dependencies on WebSockets (Depends works, but no HTTP status)
- Reverse-proxy (Nginx) WebSocket upgrade configuration

### Key Concepts

- WebSockets are a separate ASGI protocol; middleware and HTTP-only features (CORS, request body) don't fully apply.
- Browsers can't set custom headers on WebSocket handshakes — pass tokens via query string (`?token=...`) or cookies.
- A connection manager holds active connections in a set or dict keyed by user/room; broadcast iterates and sends.
- Always handle `WebSocketDisconnect` so the server doesn't log noise when clients drop.
- Behind Nginx, set `proxy_http_version 1.1` and the `Upgrade`/`Connection` headers.

```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

@app.websocket("/ws/echo")
async def echo(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            msg = await ws.receive_text()
            await ws.send_text(f"echo: {msg}")
    except WebSocketDisconnect:
        pass
```
Caption: Minimal echo endpoint

### Common Pitfalls

- Trying to set Authorization headers on a browser WebSocket — impossible; use `?token=...` or cookies.
- Forgetting `WebSocketDisconnect` handling — fills logs with tracebacks when clients close tabs.
- Iterating `active` while modifying it — `RuntimeError: list changed size during iteration`; collect dead sockets and remove after the loop.
- Blocking the loop inside `receive_text` — it's awaitable, but a long CPU-bound task between receives blocks all connections on that worker.
- Not handling the proxy upgrade — Nginx needs `proxy_http_version 1.1` and `Upgrade`/`Connection` headers or the handshake fails with 502.

### Real-World Applications

- Discord's real-time gateway is a WebSocket-based protocol; FastAPI WebSockets are the Python equivalent at smaller scale.
- Figma's collaborative editing uses WebSockets for cursor positions and document updates; FastAPI is a fine host for the cursor-channel piece.
- Twitch chat uses IRC-over-WebSocket; the same connection-manager pattern applies for fan-out broadcasting.
- Robinhood's price-feed streams stock quotes over WebSockets; FastAPI + Redis pub/sub is a common pattern.

### Interview Questions

- 1. Why can't browsers send custom headers on WebSocket handshakes? — The browser WebSocket API doesn't expose headers; pass tokens via query string or cookies.
- 2. How do you broadcast to all connected clients? — Maintain a `list[WebSocket]` in a connection manager and iterate, sending to each; collect dead sockets for removal.
- 3. What exception should you always handle in a WebSocket route? — `WebSocketDisconnect`; otherwise client disconnects log tracebacks.
- 4. How do you authenticate a WebSocket? — Verify a token from the query string (`?token=...`) or cookie before `await ws.accept()`; reject with `ws.close(code=WS_1008_POLICY_VIOLATION)`.
- 5. What Nginx directives are needed for WebSockets? — `proxy_http_version 1.1;` plus `proxy_set_header Upgrade $http_upgrade;` and `Connection "upgrade";`.

### Mini Project

Build a "Live Chat Room" WebSocket: A `/ws/chat?token=...` endpoint that authenticates via JWT, registers the connection in a `ConnectionManager`, broadcasts incoming messages to all connected clients, and cleans up on disconnect. Suggested approach:
  - Reuse the JWT verification from Stage 7
  - Implement `ConnectionManager` with `connect`, `disconnect`, `broadcast`
  - Auth before `accept`; close with `WS_1008_POLICY_VIOLATION` on bad token
  - Loop `receive_text` + `broadcast`, catching `WebSocketDisconnect`
  - Test with a `websockets` Python client or browser DevTools

### Exercises

1. Build an echo endpoint and test it with a Python `websockets` client.
2. Add a `ConnectionManager` and broadcast incoming messages to all clients.
3. Reject unauthenticated connections via query-string token; verify the close code.
4. Connect three clients and confirm a message from one reaches all three.
5. >>> QUIZ (Stage 13) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Why can't browsers send custom headers (e.g., Authorization) on a WebSocket handshake?
8. A) The browser WebSocket API doesn't expose them (*)
9. B) Headers are deprecated
10. C) HTTP/2 forbids it
11. D) FastAPI rejects them
12. Explanation: The JS `WebSocket` constructor only takes URL, subprotocols, and (recently) a reserved options bag — no general headers; use query string or cookies.
13. Q2: Which exception must you handle in a WebSocket route?
14. A) `HTTPException`
15. B) `WebSocketDisconnect` (*)
16. C) `ConnectionError`
17. D) `TimeoutError`
18. Explanation: `WebSocketDisconnect` is raised when the client closes; without handling it, FastAPI logs a traceback.
19. Q3: How do you accept a WebSocket connection?
20. A) `await ws.connect()`
21. B) `return ws.ok()`
22. C) `await ws.accept()` (*)
23. D) `ws.status = 200`
24. Explanation: `await ws.accept()` completes the handshake; before that you can reject with `ws.close(code=...)`.
25. Q4: How do you authenticate a WebSocket in a browser?
26. A) Authorization header
27. B) POST body
28. C) IP allowlist
29. D) Query-string token or cookie (*)
30. Explanation: Browsers can't set WS headers; pass tokens via `?token=...` or rely on cookies (sent on the WS handshake).
31. Q5: What close code indicates policy violation (e.g., bad auth)?
32. A) 1008 (*)
33. B) 1000
34. C) 1006
35. D) 1011
36. Explanation: `WS_1008_POLICY_VIOLATION` (1008) signals the connection was rejected for policy reasons such as failed auth.
37. Q6: What's the safe pattern when broadcasting to a list?
38. A) Modify the list while iterating
39. B) Collect dead sockets and remove after the loop (*)
40. C) Use a deque
41. D) Use a tuple
42. Explanation: Mutating a list while iterating raises `RuntimeError`; collect dead sockets during iteration and remove them after.
43. Q7: Which ASGI protocol type does a WebSocket use?
44. A) "http"
45. B) "lifespan"
46. C) "websocket" (*)
47. D) "ws"
48. Explanation: ASGI scope `type` is `"websocket"` for WS connections; HTTP routes see `"http"`.
49. Q8: Why avoid CPU-bound work between `receive_text` calls?
50. A) It uses too much memory
51. B) It triggers garbage collection
52. C) It's insecure
53. D) It blocks the event loop, stalling all WS connections on the worker (*)
54. Explanation: WebSocket handlers run on the event loop; long CPU work blocks every other connection on the same worker.
55. Q9: Which Nginx directive is required for WebSockets?
56. A) `proxy_http_version 1.1;` plus Upgrade/Connection headers (*)
57. B) `proxy_buffering on;`
58. C) `gzip on;`
59. D) `client_max_body_size 0;`
60. Explanation: WebSockets need HTTP/1.1 upgrade; without `proxy_http_version 1.1` and the Upgrade/Connection headers, the handshake fails.
61. Q10: Can `Depends` be used on WebSocket routes?
62. A) No
63. B) Yes — but failed dependencies close the socket rather than return HTTP status (*)
64. C) Only sync deps
65. D) Only async deps
66. Explanation: WebSocket routes support `Depends`, but a failed dependency can't return an HTTP error; close the socket with an appropriate code.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why can't browsers send custom headers (e.g., Authorization) on a WebSocket handshake?
  options:
    - The browser WebSocket API doesn't expose them
    - Headers are deprecated
    - HTTP/2 forbids it
    - FastAPI rejects them
  correctIndex: 0
  explanation: The JS `WebSocket` constructor only takes URL, subprotocols, and (recently) a reserved options bag — no general headers; use query string or cookies.
- id: q2
  question: Which exception must you handle in a WebSocket route?
  options:
    - "`HTTPException`"
    - "`WebSocketDisconnect`"
    - "`ConnectionError`"
    - "`TimeoutError`"
  correctIndex: 1
  explanation: "`WebSocketDisconnect` is raised when the client closes; without handling it, FastAPI logs a traceback."
- id: q3
  question: How do you accept a WebSocket connection?
  options:
    - "`await ws.connect()`"
    - "`return ws.ok()`"
    - "`await ws.accept()`"
    - "`ws.status = 200`"
  correctIndex: 2
  explanation: "`await ws.accept()` completes the handshake; before that you can reject with `ws.close(code=...)`."
- id: q4
  question: How do you authenticate a WebSocket in a browser?
  options:
    - Authorization header
    - POST body
    - IP allowlist
    - Query-string token or cookie
  correctIndex: 3
  explanation: Browsers can't set WS headers; pass tokens via `?token=...` or rely on cookies (sent on the WS handshake).
- id: q5
  question: What close code indicates policy violation (e.g., bad auth)?
  options:
    - "1008"
    - "1000"
    - "1006"
    - "1011"
  correctIndex: 0
  explanation: "`WS_1008_POLICY_VIOLATION` (1008) signals the connection was rejected for policy reasons such as failed auth."
- id: q6
  question: What's the safe pattern when broadcasting to a list?
  options:
    - Modify the list while iterating
    - Collect dead sockets and remove after the loop
    - Use a deque
    - Use a tuple
  correctIndex: 1
  explanation: Mutating a list while iterating raises `RuntimeError`; collect dead sockets during iteration and remove them after.
- id: q7
  question: Which ASGI protocol type does a WebSocket use?
  options:
    - '"http"'
    - '"lifespan"'
    - '"websocket"'
    - '"ws"'
  correctIndex: 2
  explanation: ASGI scope `type` is `"websocket"` for WS connections; HTTP routes see `"http"`.
- id: q8
  question: Why avoid CPU-bound work between `receive_text` calls?
  options:
    - It uses too much memory
    - It triggers garbage collection
    - It's insecure
    - It blocks the event loop, stalling all WS connections on the worker
  correctIndex: 3
  explanation: WebSocket handlers run on the event loop; long CPU work blocks every other connection on the same worker.
- id: q9
  question: Which Nginx directive is required for WebSockets?
  options:
    - "`proxy_http_version 1.1;` plus Upgrade/Connection headers"
    - "`proxy_buffering on;`"
    - "`gzip on;`"
    - "`client_max_body_size 0;`"
  correctIndex: 0
  explanation: WebSockets need HTTP/1.1 upgrade; without `proxy_http_version 1.1` and the Upgrade/Connection headers, the handshake fails.
- id: q10
  question: Can `Depends` be used on WebSocket routes?
  options:
    - No
    - Yes — but failed dependencies close the socket rather than return HTTP status
    - Only sync deps
    - Only async deps
  correctIndex: 1
  explanation: WebSocket routes support `Depends`, but a failed dependency can't return an HTTP error; close the socket with an appropriate code.
```

