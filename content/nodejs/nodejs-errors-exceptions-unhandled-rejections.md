---
slug: nodejs-errors-exceptions-unhandled-rejections
id: nodejs-09
track: nodejs
order: 9
title: Errors, Exceptions, and Unhandled Rejections
description: Handle errors the Node way — try/catch with async, error-first callbacks, custom error classes, `Error.cause`, and why `uncaughtException` should crash (not swallow).
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zb3Qk8SG5Ms&t=240s
whyItMatters: Handle errors the Node way — try/catch with async, error-first callbacks, custom error classes, `Error. cause`, and why `uncaughtException` should crash (not swallow).
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# Errors, Exceptions, and Unhandled Rejections

## Errors, Exceptions, and Unhandled Rejections

### Why It Matters

Handle errors the Node way — try/catch with async, error-first callbacks, custom error classes, `Error. cause`, and why `uncaughtException` should crash (not swallow).

Handle errors the Node way — try/catch with async, error-first callbacks, custom error classes, `Error.cause`, and why `uncaughtException` should crash (not swallow).

### Prerequisites

- Stage 1: Getting Started with Node.js.
- Stage 2: The Node.js Event Loop (rejection microtasks).
- Stage 8: Events and EventEmitter (the 'error' event).

### Topics

- `try/catch` with async functions (the modern idiom)
- Error-first callbacks (legacy but everywhere: `(err, result) => ...`)
- Custom error classes with `extends Error` and `Error.code`
- `Error.cause` (Node 16.9+) for wrapping lower-level errors
- `process.on("uncaughtException")` — log then exit
- `process.on("unhandledRejection")` — crashes since Node 15
- `process.on("rejectionHandled")` — late `.catch()` after a tick
- Error codes: `ENOENT`, `EADDRINUSE`, `ERR_INVALID_ARG_TYPE`, etc.

### Key Concepts

- `try/catch` works in async functions — wrap async calls and the catch fires on rejection.
- Error-first callbacks predate Promises — `(err, result) => ...` where `err` is non-null on failure; still used by many core APIs.
- An `uncaughtException` means your process is in an unknown state — log it and let the process exit, then rely on PM2/k8s to restart.
- Since Node 15, `unhandledRejection` terminates the process by default — every Promise needs a `.catch` or the caller must `await` it.
- Use `Error.cause` to wrap lower-level errors while preserving the original stack and context.

```javascript
async function fetchUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("fetchUser failed:", err.message);
    throw err;   // re-throw after logging; or return a default
  }
}
```
Caption: try/catch with async

### Common Pitfalls

- Catching `uncaughtException` and continuing — the process is in an unknown state; you'll likely corrupt data or hang. Log and exit, let PM2/k8s restart.
- Forgetting `.catch` on a Promise or `await` in an async function — `unhandledRejection` crashes the process since Node 15.
- Throwing in `setTimeout` or event handlers — the throw isn't caught by a surrounding `try` because the callback runs later; it becomes an `uncaughtException`.
- Swallowing errors with empty `catch (e) {}` — bugs hide silently; at minimum log them, even in dev.
- Using `instanceof Error` instead of checking `err.code` — `instanceof` doesn't survive serialization (across processes/worker_threads); check `.code` or `.name`.

### Real-World Applications

- Every production Node service should crash on uncaught errors and rely on PM2, systemd, or k8s to restart — this is the explicit Node.js design recommendation.
- Sentry's Node SDK hooks `uncaughtException` and `unhandledRejection` to ship the stack trace before the process dies.
- Netflix's Hystrix-like circuit breakers wrap external calls so partial failures don't propagate as uncaught exceptions.
- Stripe's Node SDK throws typed errors (`StripeError`, `StripeCardError`) with codes so callers can branch.

### Interview Questions

- 1. What's the recommended behavior for `uncaughtException`? — Log the error and exit, then rely on a process manager (PM2, systemd, k8s) to restart; do NOT continue running because the process state is unknown.
- 2. What changed about `unhandledRejection` in Node 15? — It now terminates the process by default (previously it only printed a warning); every Promise needs a `.catch` or the caller must `await` it.
- 3. What is `Error.cause`? — A standard option (Node 16.9+) to wrap a lower-level error while preserving the original on `err.cause`; great for adding context without losing the stack.
- 4. What's an error-first callback? — The legacy Node convention `(err, result) => ...` where `err` is non-null on failure; still used by many core APIs (`fs.readFile` without promises).
- 5. Why shouldn't you swallow errors with `catch (e) {}`? — Bugs hide silently; at minimum log them so you can debug. Empty catches make production issues impossible to diagnose.

### Mini Project

Build a Robust Error Reporter: A small library that wraps async functions, catches errors, classifies them by code (`ENOENT`, `EADDRINUSE`, custom codes), logs to console + an in-memory ring buffer, and exposes an HTTP endpoint to view the last 100 errors. Suggested approach:
  - Implement `wrapAsync(fn)` that returns a function returning `fn().catch(classify)`
  - Add a custom `AppError` class with `code`, `severity`, and `cause`
  - Maintain a `RingBuffer` of last 100 errors with timestamp, code, message, stack
  - Expose `GET /errors` (HTTP endpoint from Stage 5) returning the buffer as JSON
  - Add `process.on("uncaughtException")` and `process.on("unhandledRejection")` that log to the buffer and exit

### Exercises

1. Write an async function that throws, call it without try/catch, and observe the `unhandledRejection` crash.
2. Add a try/catch and a custom error class; verify `err instanceof` works.
3. Use `Error.cause` to wrap an `ENOENT` from `fs.readFile` with a contextual message.
4. Register `uncaughtException` and `unhandledRejection` handlers that log and `process.exit(1)`.
5. Build an error-first callback wrapper that converts it to a Promise (`new Promise((res, rej) => fn((err, val) => err ? rej(err) : res(val)))`).
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Since which Node version does `unhandledRejection` crash the process?
9. A) Node 15 (*)
10. B) Node 12
11. C) Node 18
12. D) Node 22
13. Explanation: Node 15 made `unhandledRejection` terminate the process by default (previously only a warning); every Promise needs a `.catch` or `await`.
14. Q2: What is the recommended handling of `uncaughtException`?
15. A) Catch it and keep running
16. B) Log and exit, let the process manager restart (*)
17. C) Ignore it
18. D) Convert it to a warning
19. Explanation: The process is in an unknown state after an uncaught exception; the official guidance is to log and exit, then let PM2/systemd/k8s restart.
20. Q3: Which option on `new Error(msg, opts)` preserves a lower-level error?
21. A) { stack: err }
22. B) { original: err }
23. C) { cause: err } (*)
24. D) { parent: err }
25. Explanation: `Error.cause` (Node 16.9+) wraps a lower-level error while preserving its stack and message on `err.cause`.
26. Q4: What is an error-first callback?
27. A) (result, err) => ...
28. B) err => result
29. C) result => err
30. D) (err, result) => ... (*)
31. Explanation: The Node convention: first argument is the error (non-null on failure), second is the result — still used by many core APIs like `fs.readFile` (non-promise form).
32. Q5: What does throwing inside `setTimeout` produce?
33. A) An uncaughtException (the try has already exited) (*)
34. B) Caught by surrounding try/catch
35. C) A silent failure
36. D) A rejected promise
37. Explanation: The `try` block has already exited by the time the timer fires; the throw becomes an `uncaughtException` — use Promise-wrapped timers instead.
38. Q6: Which is a safe way to identify a specific error type?
39. A) instanceof Error only
40. B) Checking err.code or err.name (*)
41. C) String matching on err.stack
42. D) err.type
43. Explanation: `instanceof` fails across process/worker boundaries (prototype chain not preserved); `err.code` (`ENOENT`, `EADDRINUSE`) or `err.name` is serialization-safe.
44. Q7: What does an empty `catch (e) {}` cause?
45. A) Faster code
46. B) A syntax error
47. C) Silent failures that hide bugs (*)
48. D) Better memory usage
49. Explanation: Empty catches swallow errors so you can't diagnose production issues; at minimum log the error.
50. Q8: What is `process.on("rejectionHandled")` for?
51. A) It fires when a rejection is caught after one tick
52. B) It replaces `unhandledRejection`
53. C) It is the same as `Promise.catch`
54. D) It fires when a `.catch` is added late to an already-rejected promise (*)
55. Explanation: If a Promise was reported as `unhandledRejection` but then `.catch` is added later (next tick), `rejectionHandled` fires so you can un-track it.
56. Q9: Which Node error code means "address already in use"?
57. A) EADDRINUSE (*)
58. B) ENOENT
59. C) EACCES
60. D) ECONNREFUSED
61. Explanation: `EADDRINUSE` is thrown when binding to a port that's already taken; `ENOENT` is file-not-found, `EACCES` is permission denied.
62. Q10: How does `try/catch` work with async functions?
63. A) It doesn't — async errors can't be caught
64. B) A `try` around `await` catches the rejection (*)
65. C) You must use `.catch()` instead
66. D) It only works in CJS, not ESM
67. Explanation: `try { await asyncFn() } catch (e) { ... }` catches the rejected promise — the modern idiomatic way to handle async errors.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Since which Node version does `unhandledRejection` crash the process?
  options:
    - Node 15
    - Node 12
    - Node 18
    - Node 22
  correctIndex: 0
  explanation: Node 15 made `unhandledRejection` terminate the process by default (previously only a warning); every Promise needs a `.catch` or `await`.
- id: q2
  question: What is the recommended handling of `uncaughtException`?
  options:
    - Catch it and keep running
    - Log and exit, let the process manager restart
    - Ignore it
    - Convert it to a warning
  correctIndex: 1
  explanation: The process is in an unknown state after an uncaught exception; the official guidance is to log and exit, then let PM2/systemd/k8s restart.
- id: q3
  question: Which option on `new Error(msg, opts)` preserves a lower-level error?
  options:
    - "{ stack: err }"
    - "{ original: err }"
    - "{ cause: err }"
    - "{ parent: err }"
  correctIndex: 2
  explanation: "`Error.cause` (Node 16.9+) wraps a lower-level error while preserving its stack and message on `err.cause`."
- id: q4
  question: What is an error-first callback?
  options:
    - (result, err) => ...
    - err => result
    - result => err
    - (err, result) => ...
  correctIndex: 3
  explanation: "The Node convention: first argument is the error (non-null on failure), second is the result — still used by many core APIs like `fs.readFile` (non-promise form)."
- id: q5
  question: What does throwing inside `setTimeout` produce?
  options:
    - An uncaughtException (the try has already exited)
    - Caught by surrounding try/catch
    - A silent failure
    - A rejected promise
  correctIndex: 0
  explanation: The `try` block has already exited by the time the timer fires; the throw becomes an `uncaughtException` — use Promise-wrapped timers instead.
- id: q6
  question: Which is a safe way to identify a specific error type?
  options:
    - instanceof Error only
    - Checking err.code or err.name
    - String matching on err.stack
    - err.type
  correctIndex: 1
  explanation: "`instanceof` fails across process/worker boundaries (prototype chain not preserved); `err.code` (`ENOENT`, `EADDRINUSE`) or `err.name` is serialization-safe."
- id: q7
  question: What does an empty `catch (e) {}` cause?
  options:
    - Faster code
    - A syntax error
    - Silent failures that hide bugs
    - Better memory usage
  correctIndex: 2
  explanation: Empty catches swallow errors so you can't diagnose production issues; at minimum log the error.
- id: q8
  question: What is `process.on("rejectionHandled")` for?
  options:
    - It fires when a rejection is caught after one tick
    - It replaces `unhandledRejection`
    - It is the same as `Promise.catch`
    - It fires when a `.catch` is added late to an already-rejected promise
  correctIndex: 3
  explanation: If a Promise was reported as `unhandledRejection` but then `.catch` is added later (next tick), `rejectionHandled` fires so you can un-track it.
- id: q9
  question: Which Node error code means "address already in use"?
  options:
    - EADDRINUSE
    - ENOENT
    - EACCES
    - ECONNREFUSED
  correctIndex: 0
  explanation: "`EADDRINUSE` is thrown when binding to a port that's already taken; `ENOENT` is file-not-found, `EACCES` is permission denied."
- id: q10
  question: How does `try/catch` work with async functions?
  options:
    - It doesn't — async errors can't be caught
    - A `try` around `await` catches the rejection
    - You must use `.catch()` instead
    - It only works in CJS, not ESM
  correctIndex: 1
  explanation: "`try { await asyncFn() } catch (e) { ... }` catches the rejected promise — the modern idiomatic way to handle async errors."
```

