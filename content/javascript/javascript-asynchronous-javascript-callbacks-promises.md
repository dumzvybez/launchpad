---
slug: javascript-asynchronous-javascript-callbacks-promises
id: javascript-07
track: javascript
order: 7
title: Asynchronous JavaScript — Callbacks and Promises
description: Reason about time in JavaScript — callbacks, the callback hell problem, and the Promise abstraction that replaced it.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=4900s
whyItMatters: Reason about time in JavaScript — callbacks, the callback hell problem, and the Promise abstraction that replaced it.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Asynchronous JavaScript — Callbacks and Promises

## Asynchronous JavaScript — Callbacks and Promises

### Why It Matters

Reason about time in JavaScript — callbacks, the callback hell problem, and the Promise abstraction that replaced it.

Reason about time in JavaScript — callbacks, the callback hell problem, and the Promise abstraction that replaced it.

### Prerequisites

- Stage 6: Events and Interactivity
- Understanding of the call stack from earlier stages.

### Topics

- Why async matters: single-threaded, non-blocking I/O
- Callbacks: patterns, error-first convention
- Callback hell / pyramid of doom
- Promise states: pending, fulfilled, rejected
- then, catch, finally
- Promise chaining and return values
- Promise.all, Promise.allSettled, Promise.race, Promise.any
- Converting callbacks to promises (util.promisify, manual wrap)

### Key Concepts

- A Promise is a state machine: pending → (fulfilled | rejected), one-shot, immutable after settle
- `then` returns a new promise, enabling chaining
- `Promise.all` rejects on FIRST rejection; `Promise.allSettled` waits for ALL and never rejects
- `Promise.race` resolves/rejects with the FIRST to settle; `Promise.any` resolves with the first FULFILLMENT (ignores rejections until all reject)
- Errors in a chain skip to the next `catch` — and a `catch` can recover by returning a value
- Always handle rejections — unhandled promise rejections crash Node and warn in browsers

```javascript
const fs = require("fs");

// Callback style
fs.readFile("a.txt", "utf8", (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});

// Promisified
const readFile = (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

readFile("a.txt").then(console.log).catch(console.error);
```
Caption: Callback → Promise

### Common Pitfalls

- Forgetting to return inner promises in a chain — `then(() => fetch(...))` without return breaks the chain; always `return` the inner promise.
- Using `Promise.all` when you should use `Promise.allSettled` — `all` fails fast; if you want partial results, use `allSettled`.
- Not handling rejections — unhandled rejections crash Node 15+ and emit warnings in browsers; always end a chain with `.catch()`.
- Creating promises you never resolve/reject — leaks forever; if you write `new Promise`, ensure both paths fire.
- Mixing callback and promise styles — pick one per codebase; use `util.promisify` to convert legacy callbacks consistently.

### Real-World Applications

- Netflix's player uses Promise chains to sequence DRM initialization, manifest fetching, and segment loading before playback starts.
- Stripe's SDK uses Promise.all to fan out to multiple endpoints when loading a customer's payment methods,subscriptions, and invoices in parallel.
- Cloudflare's edge workers rely on Promise-based fetch handlers; their entire request lifecycle is a Promise the runtime awaits.
- Slack's desktop client uses Promise.allSettled to load presence, profile, and channel data in parallel — partial failures don't break the UI.

### Interview Questions

- 1. What are the three states of a Promise? — pending, fulfilled, rejected; once settled it's immutable.
- 2. Difference between `Promise.all` and `Promise.allSettled`? — all rejects on first rejection; allSettled waits for all and gives per-promise results.
- 3. What is `Promise.race`? — Settles with the first promise to settle (resolve OR reject); useful for timeouts.
- 4. How do you convert a callback-based function to a promise? — Wrap it in `new Promise((resolve, reject) => cb((err, val) => err ? reject(err) : resolve(val)))` or use `util.promisify`.
- 5. What happens to an unhandled rejection? — In Node 15+ it crashes the process; in browsers it's a console warning; always add `.catch()`.

### Mini Project

Build an "Image Preloader" that takes an array of image URLs and returns a promise that resolves when all have loaded (or rejects if any fail after 3 retries). It outputs a map of URL → loaded dimensions. Suggested approach:
  - Wrap each Image's onload/onerror in a Promise
  - Use Promise.all to wait for all images
  - Add a `withRetry(fn, n)` helper that retries on rejection
  - Add a per-image timeout using Promise.race against a delay promise
  - Log per-image timing and total time

### Exercises

1. Write `promisify(fn)` that converts an error-first callback function to a promise-returning one.
2. Implement `promiseTimeout(p, ms)` that rejects if `p` doesn't settle within `ms`.
3. Build `mapWithConcurrency(items, n, fn)` that runs `fn` over items but at most `n` concurrently.
4. Convert a callback-based `setTimeout` chain into a flat promise chain using `delay(ms)` helpers.
5. Use `Promise.allSettled` to fetch 5 URLs and report success/failure counts.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How many times can a Promise settle?
9. A) Once per second
10. B) Once — it's then immutable (*)
11. C) Twice
12. D) Unlimited
13. Explanation: A Promise transitions from pending to fulfilled OR rejected exactly once; further resolve/reject calls are ignored.
14. Q2: `Promise.all` rejects when:
15. A) All promises reject
16. B) Any one promise rejects (*)
17. C) The first one resolves
18. D) Never
19. Explanation: Promise.all is fail-fast: the first rejection rejects the aggregate immediately.
20. Q3: Which NEVER rejects?
21. A) Promise.all
22. B) Promise.race
23. C) Promise.allSettled (*)
24. D) Promise.any
25. Explanation: allSettled waits for all and returns per-promise {status, value/reason}; it never rejects.
26. Q4: `Promise.any` resolves with:
27. A) The first to settle
28. B) The first to fulfill (*)
29. C) The last to fulfill
30. D) All values combined
31. Explanation: any ignores rejections until ALL reject (then AggregateError); it resolves with the first fulfillment.
32. Q5: In a `.then(() => fetch(...))` chain, what's missing?
33. A) A `return` before fetch (*)
34. B) A semicolon
35. C) An await
36. D) Nothing — it works
37. Explanation: Arrow functions with braces need `return`; without it, the chain gets `undefined` instead of the fetch promise.
38. Q6: An unhandled promise rejection in Node 15+:
39. A) Prints a warning
40. B) Crashes the process (*)
41. C) Is silently ignored
42. D) Auto-retries
43. Explanation: Node 15+ exits non-zero on unhandled rejections; always add `.catch()` or a try/catch around await.
44. Q7: `Promise.race` is useful for:
45. A) Loading all images
46. B) Implementing timeouts against a slow promise (*)
47. C) Aggregating results
48. D) Canceling promises
49. Explanation: Race a slow promise against a delay; whichever settles first wins, effectively giving you a timeout.
50. Q8: A Promise is in which state before resolve/reject?
51. A) fulfilled
52. B) rejected
53. C) pending (*)
54. D) settled
55. Explanation: A new Promise starts in pending; it transitions to fulfilled or rejected on first settle.
56. Q9: Which converts an error-first callback to a promise?
57. A) Promise.from(cb)
58. B) util.promisify(cb) (*)
59. C) cb.toPromise()
60. D) await cb()
61. Explanation: util.promisify wraps error-first callbacks, returning a function that returns a promise.
62. Q10: `.finally(cb)` runs when:
63. A) Only on fulfillment
64. B) Only on rejection
65. C) Either way — settled (*)
66. D) Never
67. Explanation: finally runs regardless of outcome and doesn't see the value; useful for cleanup like hiding spinners.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How many times can a Promise settle?
  options:
    - Once per second
    - Once — it's then immutable
    - Twice
    - Unlimited
  correctIndex: 1
  explanation: A Promise transitions from pending to fulfilled OR rejected exactly once; further resolve/reject calls are ignored.
- id: q2
  question: "`Promise.all` rejects when:"
  options:
    - All promises reject
    - Any one promise rejects
    - The first one resolves
    - Never
  correctIndex: 1
  explanation: "Promise.all is fail-fast: the first rejection rejects the aggregate immediately."
- id: q3
  question: Which NEVER rejects?
  options:
    - Promise.all
    - Promise.race
    - Promise.allSettled
    - Promise.any
  correctIndex: 2
  explanation: allSettled waits for all and returns per-promise {status, value/reason}; it never rejects.
- id: q4
  question: "`Promise.any` resolves with:"
  options:
    - The first to settle
    - The first to fulfill
    - The last to fulfill
    - All values combined
  correctIndex: 1
  explanation: any ignores rejections until ALL reject (then AggregateError); it resolves with the first fulfillment.
- id: q5
  question: In a `.then(() => fetch(...))` chain, what's missing?
  options:
    - A `return` before fetch
    - A semicolon
    - An await
    - Nothing — it works
  correctIndex: 0
  explanation: Arrow functions with braces need `return`; without it, the chain gets `undefined` instead of the fetch promise.
- id: q6
  question: "An unhandled promise rejection in Node 15+:"
  options:
    - Prints a warning
    - Crashes the process
    - Is silently ignored
    - Auto-retries
  correctIndex: 1
  explanation: Node 15+ exits non-zero on unhandled rejections; always add `.catch()` or a try/catch around await.
- id: q7
  question: "`Promise.race` is useful for:"
  options:
    - Loading all images
    - Implementing timeouts against a slow promise
    - Aggregating results
    - Canceling promises
  correctIndex: 1
  explanation: Race a slow promise against a delay; whichever settles first wins, effectively giving you a timeout.
- id: q8
  question: A Promise is in which state before resolve/reject?
  options:
    - fulfilled
    - rejected
    - pending
    - settled
  correctIndex: 2
  explanation: A new Promise starts in pending; it transitions to fulfilled or rejected on first settle.
- id: q9
  question: Which converts an error-first callback to a promise?
  options:
    - Promise.from(cb)
    - util.promisify(cb)
    - cb.toPromise()
    - await cb()
  correctIndex: 1
  explanation: util.promisify wraps error-first callbacks, returning a function that returns a promise.
- id: q10
  question: "`.finally(cb)` runs when:"
  options:
    - Only on fulfillment
    - Only on rejection
    - Either way — settled
    - Never
  correctIndex: 2
  explanation: finally runs regardless of outcome and doesn't see the value; useful for cleanup like hiding spinners.
```

