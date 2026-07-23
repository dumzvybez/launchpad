---
slug: javascript-fetch-api-ajax
id: javascript-12
track: javascript
order: 12
title: Fetch API and AJAX
description: Make HTTP requests with `fetch`, handle responses, abort requests with AbortController, and consume streaming data.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=9400s
whyItMatters: Make HTTP requests with `fetch`, handle responses, abort requests with AbortController, and consume streaming data.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Fetch API and AJAX

## Fetch API and AJAX

### Why It Matters

Make HTTP requests with `fetch`, handle responses, abort requests with AbortController, and consume streaming data.

Make HTTP requests with `fetch`, handle responses, abort requests with AbortController, and consume streaming data.

### Prerequisites

- Stage 11: The Browser APIs and Storage
- Comfort with async/await and Promise chains.

### Topics

- fetch() — basic usage, Request, Response, Headers
- HTTP methods, status codes, and the `ok` flag
- JSON, FormData, Blob, and ArrayBuffer bodies
- AbortController and request cancellation
- Streaming responses with ReadableStream
- CORS, preflight, and credentials
- Error handling: network vs HTTP errors
- Retry and exponential backoff

### Key Concepts

- `fetch` only rejects on NETWORK errors — HTTP 4xx/5xx are NOT rejections; check `response.ok`
- The Response body is a stream; reading via `.json()`/`.text()` consumes it
- AbortController cancels an in-flight fetch — essential for typeahead search and route changes
- CORS is enforced by browsers, not servers; preflight (OPTIONS) is sent for non-simple requests
- `credentials: "include"` sends cookies cross-origin; the server must allow it with `Access-Control-Allow-Credentials`
- Streams let you process large responses without buffering them entirely in memory

```javascript
async function getJSON(url, options) {
  const r = await fetch(url, options);
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
  return r.json();
}

try {
  const user = await getJSON("/api/users/1");
  console.log(user);
} catch (err) {
  console.error("Request failed:", err.message);
}
```
Caption: Basic JSON fetch with error handling

### Common Pitfalls

- Assuming `fetch` rejects on 404/500 — it only rejects on network failures; always check `response.ok` or `response.status`.
- Setting `Content-Type: multipart/form-data` manually — breaks the boundary; let the browser set it for FormData.
- Forgetting to abort stale requests in typeahead — causes race conditions where older responses overwrite newer ones.
- Not encoding query parameters — `?q=hello world` is invalid; use `encodeURIComponent` or `new URLSearchParams`.
- Mixing `credentials: "include"` with `Access-Control-Allow-Origin: *` — browsers reject this; specify the exact origin on the server.

### Real-World Applications

- GitHub's PR interface uses fetch with AbortController so switching between PRs cancels pending diff fetches.
- Stripe's SDK streams payment confirmation events via fetch's ReadableStream to update UI progressively.
- The Twitter/X web client uses fetch with AbortController and request deduping to handle rapid timeline scrolls.
- Notion's collaborative editor uses fetch with streaming responses to receive ops in real time without WebSocket overhead for some flows.

### Interview Questions

- 1. When does `fetch` reject vs resolve? — Rejects only on network errors; resolves for any HTTP response (even 4xx/5xx); check `response.ok`.
- 2. How do you cancel a fetch? — Pass an AbortController's signal in options and call `.abort()`; the promise rejects with AbortError.
- 3. What is CORS? — Cross-Origin Resource Sharing; the browser blocks cross-origin requests unless the server returns the right headers; preflight OPTIONS for non-simple requests.
- 4. Why shouldn't you set Content-Type for FormData? — The browser must set the boundary string; setting it manually breaks the multipart body.
- 5. How do you stream a fetch response? — Read from `response.body.getReader()` and decode chunks; perfect for large or partial data.

### Mini Project

Build a "Movie Search" app that queries a free movie API (e.g., the OMDb or TMDB public API) with a debounced input, cancels stale requests via AbortController, and shows a grid of results with posters. It takes a search query and outputs a styled grid. Suggested approach:
  - Sign up for a free TMDB API key
  - Debounce input by 250ms (Stage 6 helper)
  - Use AbortController to cancel the previous search on each new input
  - Render results into a CSS grid of poster cards
  - Add a loading spinner and a "no results" empty state

### Exercises

1. Write a `getJSON` helper that throws on non-2xx and returns parsed JSON.
2. Build a request cancellation demo: kick off a fetch, abort it after 100ms, observe AbortError.
3. Implement `fetchRetry(url, retries)` with exponential backoff for 5xx responses only.
4. Stream a large text response chunk-by-chunk and log byte counts.
5. POST a FormData with a file and a text field to httpbin.org/post; inspect the echo.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: fetch rejects when:
9. A) The server returns 404
10. B) The server returns 500
11. C) There's a network error (*)
12. D) The response isn't JSON
13. Explanation: fetch only rejects on network-level failures; HTTP errors are still resolved Responses — check r.ok.
14. Q2: To cancel a fetch, use:
15. A) fetch.cancel()
16. B) AbortController and pass its signal (*)
17. C) clearTimeout
18. D) Promise.reject
19. Explanation: Pass { signal: controller.signal } and call controller.abort(); the promise rejects with AbortError.
20. Q3: FormData's Content-Type should be:
21. A) Set to multipart/form-data manually
22. B) Left alone — the browser sets it with the boundary (*)
23. C) Set to application/json
24. D) Omitted entirely
25. Explanation: Setting it yourself strips the boundary; let the browser set it automatically.
26. Q4: `response.ok` is true when status is:
27. A) 2xx (*)
28. B) 4xx
29. C) 5xx
30. D) Any
31. Explanation: ok is shorthand for status in 200-299; check it before parsing.
32. Q5: CORS is enforced by:
33. A) The server
34. B) The browser (*)
35. C) The OS
36. D) The DNS
37. Explanation: Browsers block cross-origin responses lacking the right Access-Control-Allow-Origin header; servers only opt in.
38. Q6: `credentials: "include"`:
39. A) Strips cookies
40. B) Sends cookies cross-origin (*)
41. C) Logs you out
42. D) Has no effect
43. Explanation: include sends cookies cross-origin; the server must respond with Allow-Credentials: true and a specific (non-*) origin.
44. Q7: Exponential backoff typically waits:
45. A) Constant 100ms
46. B) 2^i * base — doubling each retry (*)
47. C) Random delay only
48. D) Forever
49. Explanation: 2^i * base (e.g., 200, 400, 800ms) gives the server time to recover and reduces load.
50. Q8: To encode `hello world` in a query string:
51. A) Use it as-is
52. B) encodeURIComponent("hello world") → "hello%20world" (*)
53. C) JSON.stringify
54. D) base64
55. Explanation: encodeURIComponent escapes spaces and special chars; or use new URLSearchParams({q: "..."}).
56. Q9: ReadableStream is used to:
57. A) Compress responses
58. B) Process response data in chunks without buffering all (*)
59. C) Send cookies
60. D) Parse JSON
61. Explanation: response.body is a ReadableStream; getReader() lets you handle chunks as they arrive.
62. Q10: Preflight (OPTIONS) is sent for:
63. A) All requests
64. B) GET only
65. C) Non-simple requests (custom headers, methods other than GET/POST/HEAD) (*)
66. D) Form submissions only
67. Explanation: Browsers preflight "non-simple" cross-origin requests with an OPTIONS check before the real request.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "fetch rejects when:"
  options:
    - The server returns 404
    - The server returns 500
    - There's a network error
    - The response isn't JSON
  correctIndex: 2
  explanation: fetch only rejects on network-level failures; HTTP errors are still resolved Responses — check r.ok.
- id: q2
  question: "To cancel a fetch, use:"
  options:
    - fetch.cancel()
    - AbortController and pass its signal
    - clearTimeout
    - Promise.reject
  correctIndex: 1
  explanation: "Pass { signal: controller.signal } and call controller.abort(); the promise rejects with AbortError."
- id: q3
  question: "FormData's Content-Type should be:"
  options:
    - Set to multipart/form-data manually
    - Left alone — the browser sets it with the boundary
    - Set to application/json
    - Omitted entirely
  correctIndex: 1
  explanation: Setting it yourself strips the boundary; let the browser set it automatically.
- id: q4
  question: "`response.ok` is true when status is:"
  options:
    - 2xx
    - 4xx
    - 5xx
    - Any
  correctIndex: 0
  explanation: ok is shorthand for status in 200-299; check it before parsing.
- id: q5
  question: "CORS is enforced by:"
  options:
    - The server
    - The browser
    - The OS
    - The DNS
  correctIndex: 1
  explanation: Browsers block cross-origin responses lacking the right Access-Control-Allow-Origin header; servers only opt in.
- id: q6
  question: '`credentials: "include"`:'
  options:
    - Strips cookies
    - Sends cookies cross-origin
    - Logs you out
    - Has no effect
  correctIndex: 1
  explanation: "include sends cookies cross-origin; the server must respond with Allow-Credentials: true and a specific (non-*) origin."
- id: q7
  question: "Exponential backoff typically waits:"
  options:
    - Constant 100ms
    - 2^i * base — doubling each retry
    - Random delay only
    - Forever
  correctIndex: 1
  explanation: 2^i * base (e.g., 200, 400, 800ms) gives the server time to recover and reduces load.
- id: q8
  question: "To encode `hello world` in a query string:"
  options:
    - Use it as-is
    - encodeURIComponent("hello world") → "hello%20world"
    - JSON.stringify
    - base64
  correctIndex: 1
  explanation: 'encodeURIComponent escapes spaces and special chars; or use new URLSearchParams({q: "..."}).'
- id: q9
  question: "ReadableStream is used to:"
  options:
    - Compress responses
    - Process response data in chunks without buffering all
    - Send cookies
    - Parse JSON
  correctIndex: 1
  explanation: response.body is a ReadableStream; getReader() lets you handle chunks as they arrive.
- id: q10
  question: "Preflight (OPTIONS) is sent for:"
  options:
    - "is sent for:"
    - All requests
    - GET only
    - Non-simple requests (custom headers, methods other than GET/POST/HEAD)
    - Form submissions only
  correctIndex: 3
  explanation: Browsers preflight "non-simple" cross-origin requests with an OPTIONS check before the real request.
```

