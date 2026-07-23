---
slug: javascript-async-await-event-loop
id: javascript-08
track: javascript
order: 8
title: Async/Await and the Event Loop
description: Use `async`/`await` to write sequential-looking async code, and understand the event loop, microtasks, and macrotasks.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=5800s
whyItMatters: Use `async`/`await` to write sequential-looking async code, and understand the event loop, microtasks, and macrotasks.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Async/Await and the Event Loop

## Async/Await and the Event Loop

### Why It Matters

Use `async`/`await` to write sequential-looking async code, and understand the event loop, microtasks, and macrotasks.

Use `async`/`await` to write sequential-looking async code, and understand the event loop, microtasks, and macrotasks.

### Prerequisites

- Stage 7: Asynchronous JavaScript — Callbacks and Promises
- Solid grasp of Promise chaining.

### Topics

- async functions and the await keyword
- Error handling with try/catch
- Sequential vs concurrent await (the `Promise.all` re-pattern)
- Top-level await in ES modules
- The event loop: call stack, task queue, microtask queue
- Microtasks vs macrotasks (setTimeout, setInterval, I/O, messages)
- requestAnimationFrame and render steps
- Async iteration with for-await-of

### Key Concepts

- `await` pauses the async function (NOT the whole program); the call stack unwinds and other tasks run
- Each `await` is a yield to the event loop — sequential awaits serialize; use `Promise.all` for concurrency
- Microtasks (promise callbacks, queueMicrotask) always drain before the next macrotask
- `setTimeout(fn, 0)` runs on the next macrotask — AFTER all microtasks, including new ones added during the drain
- Render steps happen between macrotasks (≈60Hz), interleaved with the microtask drain
- `for await...of` consumes async iterables (e.g., streaming fetch bodies, Node readable streams)

```javascript
// SLOW: each fetch waits for the previous
async function slow() {
  const a = await fetch("/a").then(r => r.json());
  const b = await fetch("/b").then(r => r.json());
  const c = await fetch("/c").then(r => r.json());
  return [a, b, c];
}

// FAST: kick off all three at once, await together
async function fast() {
  const [a, b, c] = await Promise.all([
    fetch("/a").then(r => r.json()),
    fetch("/b").then(r => r.json()),
    fetch("/c").then(r => r.json()),
  ]);
  return [a, b, c];
}
```
Caption: Sequential vs concurrent

### Common Pitfalls

- Sequential `await` when you wanted concurrency — `await a; await b;` serializes; use `Promise.all([a, b])` for parallel.
- Awaiting inside a `.map` callback — `arr.map(async ...)` returns an array of promises you must `Promise.all` over.
- Forgetting try/catch around await — unhandled rejections crash Node; wrap or attach a `.catch` to the outer promise.
- Believing `await` blocks the main thread — it doesn't; the function suspends, the event loop keeps running, but the function appears paused.
- Using `forEach` with async callbacks — `forEach` doesn't await its callback; use `for...of` or `Promise.all(arr.map(async ...))`.

### Real-World Applications

- React Server Components (used at Meta, Vercel, Shopify) use async functions and `for await` to stream rendered output to the browser.
- Cloudflare Workers and Deno Deploy runtimes are built around the event loop and microtask scheduling for millions of edge requests per second.
- VS Code's extension host runs extensions as async tasks on Node's event loop; the editor stays responsive because long-running operations await I/O.
- The Discord client streams message data via async iteration over WebSockets to render millions of messages without blocking.

### Interview Questions

- 1. Does `await` block the main thread? — No; it suspends the async function, returns control to the event loop, and resumes when the awaited promise settles.
- 2. Difference between microtasks and macrotasks? — Microtasks (promise callbacks, queueMicrotask) drain after the current task and before rendering/next task; macrotasks (setTimeout, I/O) are scheduled per loop iteration.
- 3. Why does this print 1,2,3,4? — sync code first (1,2), then microtasks (3), then macrotasks (4); the microtask queue always empties before the next macrotask.
- 4. How do you await an array of promises concurrently? — `await Promise.all(arr.map(async ...))`, NOT sequential awaits.
- 5. What is `for await...of`? — Async iteration over async iterables (streams, fetch bodies, async generators); awaits each `.next()`.

### Mini Project

Build a "Concurrent URL Fetcher" CLI that takes a list of URLs and a concurrency limit, fetches them all, and prints a summary (status, time, byte count) sorted by duration. Suggested approach:
  - Implement `pool(items, concurrency, worker)` using Promise chains
  - Track per-URL timing with `performance.now()`
  - Use `Promise.allSettled` so one failure doesn't kill the batch
  - Print a sorted table with console.table
  - Add a `--limit N` flag (use process.argv or a tiny arg parser)

### Exercises

1. Write `mapLimit(items, n, asyncFn)` that runs at most `n` async operations concurrently.
2. Demonstrate microtask ordering: queue 3 microtasks then a setTimeout, predict the order.
3. Build an async generator `async function*` that yields paginated API results until exhausted.
4. Refactor a 3-step `.then` chain into async/await, then add try/catch with a fallback.
5. Use `for await...of` to read a file line-by-line in Node (`fs.createReadStream` + readline).
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: `await` inside an async function:
9. A) Blocks the entire program
10. B) Suspends the function until the promise settles, freeing the event loop (*)
11. C) Cancels the promise
12. D) Throws synchronously
13. Explanation: await pauses the async function only; control returns to the caller/event loop until the promise settles.
14. Q2: To run 3 fetches concurrently:
15. A) await a; await b; await c;
16. B) await Promise.all([a, b, c]); (*)
17. C) [a, b, c].forEach(await ...)
18. D) await fetch(a, b, c)
19. Explanation: Promise.all kicks off all three in parallel; sequential awaits serialize them.
20. Q3: Microtasks drain:
21. A) Once per second
22. B) Before the next macrotask, including new ones added during the drain (*)
23. C) After every macrotask queue
24. D) Only at program end
25. Explanation: The microtask queue is fully drained after each task, before rendering or the next macrotask — recursively.
26. Q4: `[1,2,3].forEach(async x => await delay(x))` — what happens?
27. A) Waits for each in order
28. B) Returns immediately; forEach doesn't await (*)
29. C) Throws
30. D) Blocks forever
31. Explanation: forEach ignores the returned promises; use for...of or Promise.all(arr.map(async ...)).
32. Q5: `setTimeout(fn, 0)` runs:
33. A) Immediately
34. B) After all sync code and microtasks (*)
35. C) Before any microtasks
36. D) Never
37. Explanation: setTimeout schedules a macrotask; the microtask queue always drains first.
38. Q6: Top-level await is allowed in:
39. A) All scripts
40. B) ES modules (*)
41. C) Inline event handlers
42. D) CommonJS only
43. Explanation: Top-level await works in ES modules (and Node's --experimental-repl-await), not in classic scripts.
44. Q7: `for await (const x of asyncIterable)`:
45. A) Iterates a regular array
46. B) Awaits each .next() of an async iterable (*)
47. C) Is identical to for...of
48. D) Blocks the event loop
49. Explanation: for-await-of consumes async iterables, awaiting each next() — perfect for streams.
50. Q8: Unhandled rejection from `await`:
51. A) Is silently ignored
52. B) Crashes Node 15+ / warns in browser (*)
53. C) Retries automatically
54. D) Logs only in strict mode
55. Explanation: Always wrap awaits in try/catch or attach .catch to the outer promise; otherwise the process exits.
56. Q9: `requestAnimationFrame` callbacks run:
57. A) As microtasks
58. B) Before each repaint, between macrotasks (*)
59. C) As macrotasks
60. D) On the next tick always
61. Explanation: rAF fires before paint, aligned to the display refresh rate — ideal for visual updates.
62. Q10: Which is fastest for 3 independent fetches?
63. A) Sequential awaits
64. B) Concurrent Promise.all (*)
65. C) fetch inside forEach
66. D) Sync fetch
67. Explanation: Promise.all runs them in parallel; total time ≈ slowest, not the sum.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "`await` inside an async function:"
  options:
    - Blocks the entire program
    - Suspends the function until the promise settles, freeing the event loop
    - Cancels the promise
    - Throws synchronously
  correctIndex: 1
  explanation: await pauses the async function only; control returns to the caller/event loop until the promise settles.
- id: q2
  question: "To run 3 fetches concurrently:"
  options:
    - await a; await b; await c;
    - await Promise.all([a, b, c]);
    - "[a, b, c].forEach(await ...)"
    - await fetch(a, b, c)
  correctIndex: 1
  explanation: Promise.all kicks off all three in parallel; sequential awaits serialize them.
- id: q3
  question: "Microtasks drain:"
  options:
    - Once per second
    - Before the next macrotask, including new ones added during the drain
    - After every macrotask queue
    - Only at program end
  correctIndex: 1
  explanation: The microtask queue is fully drained after each task, before rendering or the next macrotask — recursively.
- id: q4
  question: "`[1,2,3].forEach(async x => await delay(x))` — what happens?"
  options:
    - Waits for each in order
    - Returns immediately; forEach doesn't await
    - Throws
    - Blocks forever
  correctIndex: 1
  explanation: forEach ignores the returned promises; use for...of or Promise.all(arr.map(async ...)).
- id: q5
  question: "`setTimeout(fn, 0)` runs:"
  options:
    - Immediately
    - After all sync code and microtasks
    - Before any microtasks
    - Never
  correctIndex: 1
  explanation: setTimeout schedules a macrotask; the microtask queue always drains first.
- id: q6
  question: "Top-level await is allowed in:"
  options:
    - All scripts
    - ES modules
    - Inline event handlers
    - CommonJS only
  correctIndex: 1
  explanation: Top-level await works in ES modules (and Node's --experimental-repl-await), not in classic scripts.
- id: q7
  question: "`for await (const x of asyncIterable)`:"
  options:
    - Iterates a regular array
    - Awaits each .next() of an async iterable
    - Is identical to for...of
    - Blocks the event loop
  correctIndex: 1
  explanation: for-await-of consumes async iterables, awaiting each next() — perfect for streams.
- id: q8
  question: "Unhandled rejection from `await`:"
  options:
    - Is silently ignored
    - Crashes Node 15+ / warns in browser
    - Retries automatically
    - Logs only in strict mode
  correctIndex: 1
  explanation: Always wrap awaits in try/catch or attach .catch to the outer promise; otherwise the process exits.
- id: q9
  question: "`requestAnimationFrame` callbacks run:"
  options:
    - As microtasks
    - Before each repaint, between macrotasks
    - As macrotasks
    - On the next tick always
  correctIndex: 1
  explanation: rAF fires before paint, aligned to the display refresh rate — ideal for visual updates.
- id: q10
  question: Which is fastest for 3 independent fetches?
  options:
    - Sequential awaits
    - Concurrent Promise.all
    - fetch inside forEach
    - Sync fetch
  correctIndex: 1
  explanation: Promise.all runs them in parallel; total time ≈ slowest, not the sum.
```

