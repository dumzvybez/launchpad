---
slug: nodejs-async-await-microtask-queue
id: nodejs-12
track: nodejs
order: 12
title: async/await and the Microtask Queue
description: Master async functions, `await`, Promise combinators (`all`/`allSettled`/`race`/`any`), microtask timing, AbortController cancellation, and the `await` in `forEach` pitfall.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=w-7RQ46RgxU&t=60s
whyItMatters: Master async functions, `await`, Promise combinators (`all`/`allSettled`/`race`/`any`), microtask timing, AbortController cancellation, and the `await` in `forEach` pitfall.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# async/await and the Microtask Queue

## async/await and the Microtask Queue

### Why It Matters

Master async functions, `await`, Promise combinators (`all`/`allSettled`/`race`/`any`), microtask timing, AbortController cancellation, and the `await` in `forEach` pitfall.

Master async functions, `await`, Promise combinators (`all`/`allSettled`/`race`/`any`), microtask timing, AbortController cancellation, and the `await` in `forEach` pitfall.

### Prerequisites

- Stage 1: Getting Started with Node.js.
- Stage 2: The Node.js Event Loop (microtasks drain between phases).
- Stage 9: Errors (unhandled rejection).

### Topics

- `async function` and `await` semantics
- Promise combinators: `all`, `allSettled`, `race`, `any`
- Sequential vs parallel `await` (use `Promise.all` to parallelize)
- The `await` in `forEach` pitfall (use `for...of` or `Promise.all`)
- Top-level await (ESM only)
- `AbortController` and `AbortSignal` for cancellation
- Async iterators and `for await...of`
- Microtask queue and ordering vs `setTimeout`

### Key Concepts

- `await` suspends the async function (not the event loop); other callbacks keep running.
- `Promise.all` runs promises in parallel and short-circuits on first rejection; `allSettled` waits for all and never rejects.
- `await` in `forEach` does NOT wait — `forEach` is sync; use `for...of` or `Promise.all(arr.map(async ...))`.
- `AbortController.abort()` cancels `fetch`, `setTimeout` (Node 18+), and any signal-aware API.
- Microtasks (Promise callbacks) drain before the next macrotask, including before `setTimeout(0)`.

```javascript
// SLOW: each request waits for the previous to finish (~3s total)
async function slow() {
  const results = [];
  for (const id of [1, 2, 3]) {
    results.push(await fetch(`/api/users/${id}`).then((r) => r.json()));
  }
  return results;
}

// FAST: all requests in parallel (~1s total)
async function fast() {
  const responses = await Promise.all(
    [1, 2, 3].map((id) => fetch(`/api/users/${id}`).then((r) => r.json()))
  );
  return responses;
}
```
Caption: Sequential vs parallel

### Common Pitfalls

- Awaiting sequentially in a loop when parallel is possible — `for (const x of arr) await f(x)` is O(n) latency; use `Promise.all(arr.map(f))` for O(1).
- Using `await` inside `forEach` — `forEach` doesn't await its callback; the loop "finishes" before any iteration does. Use `for...of` or `Promise.all`.
- Forgetting `try/catch` (or `.catch`) in an async function — the rejection becomes `unhandledRejection` and crashes the process.
- Throwing from `Promise.all` short-circuits and skips the slowest promises — if you want all results (including errors), use `Promise.allSettled`.
- Top-level `await` in CommonJS — it's ESM-only; either convert to ESM or wrap in an async IIFE `(async () => { ... })()`.

### Real-World Applications

- GitHub's API gateway uses async/await to fan out to multiple services in parallel via `Promise.all`.
- Stripe's Node SDK is fully async; every API call returns a Promise.
- Slack's Bolt framework uses async handlers that must `await next()` to call middleware chains.
- Netflix's Hystrix-like circuit breakers wrap async functions with timeouts via `Promise.race`.

### Interview Questions

- 1. What's the difference between `Promise.all` and `Promise.allSettled`? — `all` short-circuits on first rejection (others may be cancelled); `allSettled` waits for all and returns `{status, value/reason}` for each.
- 2. Why doesn't `await` work in `forEach`? — `forEach` is synchronous and ignores the Promise returned by the async callback; the loop "completes" before any iteration does. Use `for...of` or `Promise.all(arr.map(async ...))`.
- 3. How do you cancel a `fetch`? — Pass an `AbortSignal` from `new AbortController()`; call `controller.abort()` to cancel — the fetch rejects with `AbortError`.
- 4. What is a microtask? — A Promise callback (or `queueMicrotask` callback) scheduled on the microtask queue, drained between event-loop phases and before the next macrotask.
- 5. Where is top-level `await` supported? — ESM only; in CommonJS wrap your code in `(async () => { ... })()`.

### Mini Project

Build a Parallel URL Fetcher with Timeout: A CLI that takes N URLs as arguments, fetches them in parallel with a configurable per-request timeout, and prints a summary (success/error per URL with elapsed time). Suggested approach:
  - Parse URLs from `process.argv.slice(2)` and a `--timeout` flag with `parseArgs`
  - Wrap each fetch with `AbortController` + `setTimeout` for the per-request timeout
  - Use `Promise.allSettled` so one failure doesn't kill the others
  - Print `{ url, status, ok, elapsedMs, error? }` per URL, sorted by elapsed
  - Print a final summary: N succeeded, M failed, total elapsed

### Exercises

1. Write sequential and parallel versions of fetching 5 URLs; measure and compare timing.
2. Demonstrate the `forEach` pitfall: log "done" before any awaited fetch resolves.
3. Use `Promise.allSettled` to fetch 5 URLs and print which succeeded/failed.
4. Implement `fetchWithTimeout(url, ms)` using `AbortController`.
5. Use an async generator to stream paginated API results with `for await`.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `await` do inside an async function?
9. A) Blocks the event loop
10. B) Throws if the Promise is pending
11. C) Returns the Promise unchanged
12. D) Suspends the function until the Promise resolves; loop keeps running (*)
13. Explanation: `await` pauses the async function (saving its state) without blocking the event loop; other callbacks continue running.
14. Q2: Which combinator short-circuits on first rejection?
15. A) Promise.all (*)
16. B) Promise.allSettled
17. C) Promise.race
18. D) Promise.any
19. Explanation: `Promise.all` rejects as soon as any input rejects; the others may be in-flight. `allSettled` waits for all and never rejects.
20. Q3: Why doesn't `await` work in `forEach`?
21. A) forEach is async
22. B) forEach ignores the returned Promise; the loop "completes" before iterations finish (*)
23. C) await is disabled in callbacks
24. D) forEach is deprecated
25. Explanation: `forEach` is synchronous; it calls the async callback but doesn't await the returned Promise. Use `for...of` or `Promise.all(arr.map(async ...))`.
26. Q4: Which combinator waits for all promises and never rejects?
27. A) Promise.all
28. B) Promise.race
29. C) Promise.allSettled (*)
30. D) Promise.any
31. Explanation: `Promise.allSettled` returns `{status, value/reason}` for each input; it never rejects, so you can handle partial failures.
32. Q5: How do you cancel a `fetch`?
33. A) Call fetch.cancel()
34. B) Set a timeout on the Promise
35. C) You can't cancel fetch
36. D) Pass an AbortSignal from a new AbortController (*)
37. Explanation: `const ctrl = new AbortController(); fetch(url, { signal: ctrl.signal })` then `ctrl.abort()` cancels the request; it rejects with `AbortError`.
38. Q6: Where is top-level await supported?
39. A) ESM only (*)
40. B) Everywhere
41. C) CommonJS only
42. D) Neither
43. Explanation: Top-level `await` is an ESM feature; in CommonJS, wrap code in an async IIFE: `(async () => { await ... })()`.
44. Q7: Why prefer `Promise.all(arr.map(asyncFn))` over `for (const x of arr) await asyncFn(x)`?
45. A) It uses less memory
46. B) It runs in parallel (O(1) latency vs O(n)) (*)
47. C) It's the only way to await
48. D) It's required by Node
49. Explanation: `map` kicks off all async ops immediately, then `Promise.all` awaits them in parallel; sequential `await` in a loop adds latencies.
50. Q8: Which is faster: 3 sequential 1s fetches or 3 parallel 1s fetches?
51. A) Sequential (~3s)
52. B) Same speed
53. C) Parallel (~1s) (*)
54. D) Depends on CPU
55. Explanation: Parallel fetches overlap; 3 sequential 1s requests take 3s total, parallel take ~1s (limited by the slowest).
56. Q9: What is the microtask queue?
57. A) The queue for setTimeout callbacks
58. B) The libuv thread pool
59. C) The V8 garbage collector queue
60. D) The queue for Promise callbacks, drained between event-loop phases (*)
61. Explanation: Microtasks (Promise.then callbacks, queueMicrotask) drain between every event-loop phase and before the next macrotask.
62. Q10: What does `Promise.any` do?
63. A) Resolves with the first fulfillment; rejects only if all reject (*)
64. B) Resolves with the first rejection
65. C) Rejects with the first rejection
66. D) Returns all results
67. Explanation: `Promise.any` (ES2021) resolves as soon as any input fulfills; it rejects with `AggregateError` only if every input rejects.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `await` do inside an async function?
  options:
    - Blocks the event loop
    - Throws if the Promise is pending
    - Returns the Promise unchanged
    - Suspends the function until the Promise resolves; loop keeps running
  correctIndex: 3
  explanation: "`await` pauses the async function (saving its state) without blocking the event loop; other callbacks continue running."
- id: q2
  question: Which combinator short-circuits on first rejection?
  options:
    - Promise.all
    - Promise.allSettled
    - Promise.race
    - Promise.any
  correctIndex: 0
  explanation: "`Promise.all` rejects as soon as any input rejects; the others may be in-flight. `allSettled` waits for all and never rejects."
- id: q3
  question: Why doesn't `await` work in `forEach`?
  options:
    - forEach is async
    - forEach ignores the returned Promise; the loop "completes" before iterations finish
    - await is disabled in callbacks
    - forEach is deprecated
  correctIndex: 1
  explanation: "`forEach` is synchronous; it calls the async callback but doesn't await the returned Promise. Use `for...of` or `Promise.all(arr.map(async ...))`."
- id: q4
  question: Which combinator waits for all promises and never rejects?
  options:
    - Promise.all
    - Promise.race
    - Promise.allSettled
    - Promise.any
  correctIndex: 2
  explanation: "`Promise.allSettled` returns `{status, value/reason}` for each input; it never rejects, so you can handle partial failures."
- id: q5
  question: How do you cancel a `fetch`?
  options:
    - Call fetch.cancel()
    - Set a timeout on the Promise
    - You can't cancel fetch
    - Pass an AbortSignal from a new AbortController
  correctIndex: 3
  explanation: "`const ctrl = new AbortController(); fetch(url, { signal: ctrl.signal })` then `ctrl.abort()` cancels the request; it rejects with `AbortError`."
- id: q6
  question: Where is top-level await supported?
  options:
    - ESM only
    - Everywhere
    - CommonJS only
    - Neither
  correctIndex: 0
  explanation: "Top-level `await` is an ESM feature; in CommonJS, wrap code in an async IIFE: `(async () => { await ... })()`."
- id: q7
  question: Why prefer `Promise.all(arr.map(asyncFn))` over `for (const x of arr) await asyncFn(x)`?
  options:
    - It uses less memory
    - It runs in parallel (O(1) latency vs O(n))
    - It's the only way to await
    - It's required by Node
  correctIndex: 1
  explanation: "`map` kicks off all async ops immediately, then `Promise.all` awaits them in parallel; sequential `await` in a loop adds latencies."
- id: q8
  question: "Which is faster: 3 sequential 1s fetches or 3 parallel 1s fetches?"
  options:
    - Sequential (~3s)
    - Same speed
    - Parallel (~1s)
    - Depends on CPU
  correctIndex: 2
  explanation: Parallel fetches overlap; 3 sequential 1s requests take 3s total, parallel take ~1s (limited by the slowest).
- id: q9
  question: What is the microtask queue?
  options:
    - The queue for setTimeout callbacks
    - The libuv thread pool
    - The V8 garbage collector queue
    - The queue for Promise callbacks, drained between event-loop phases
  correctIndex: 3
  explanation: Microtasks (Promise.then callbacks, queueMicrotask) drain between every event-loop phase and before the next macrotask.
- id: q10
  question: What does `Promise.any` do?
  options:
    - Resolves with the first fulfillment; rejects only if all reject
    - Resolves with the first rejection
    - Rejects with the first rejection
    - Returns all results
  correctIndex: 0
  explanation: "`Promise.any` (ES2021) resolves as soon as any input fulfills; it rejects with `AggregateError` only if every input rejects."
```

