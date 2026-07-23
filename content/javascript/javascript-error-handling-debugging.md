---
slug: javascript-error-handling-debugging
id: javascript-13
track: javascript
order: 13
title: Error Handling and Debugging
description: Handle errors gracefully with try/catch, custom errors, and global handlers, then debug with the browser DevTools and Node inspector.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=10300s
whyItMatters: Handle errors gracefully with try/catch, custom errors, and global handlers, then debug with the browser DevTools and Node inspector.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Error Handling and Debugging

## Error Handling and Debugging

### Why It Matters

Handle errors gracefully with try/catch, custom errors, and global handlers, then debug with the browser DevTools and Node inspector.

Handle errors gracefully with try/catch, custom errors, and global handlers, then debug with the browser DevTools and Node inspector.

### Prerequisites

- Stage 12: Fetch API and AJAX
- Familiarity with async/await and the call stack.

### Topics

- try/catch/finally
- Throwing and catching custom Error subclasses
- Error.cause (ES2022) for wrapping
- Global handlers: window.onerror, window.onunhandledrejection
- Node: process.on("uncaughtException"), "unhandledRejection"
- Browser DevTools: Sources panel, breakpoints, watch, call stack
- Node inspector: `node --inspect`, Chrome DevTools for Node
- Source maps and async stack traces

### Key Concepts

- Errors bubble up the call stack until a catch handles them — uncaught errors crash Node, throw in browsers
- Always extend `Error` for custom types so `instanceof` works and stack traces are correct
- `Error.cause` lets you wrap low-level errors without losing the original
- Async errors become rejected promises — handle with try/catch (in async functions) or `.catch()`
- Source maps let DevTools show original TS/JSX even when running bundled/minified code
- `window.addEventListener("error", ...)` catches synchronous errors; `"unhandledrejection"` catches promise rejections

```javascript
class ApiError extends Error {
  constructor(message, { status, cause } = {}) {
    super(message, { cause });
    this.name = "ApiError";
    this.status = status;
  }
}

async function getUser(id) {
  const r = await fetch(`/api/users/${id}`);
  if (!r.ok) throw new ApiError(`Failed to load user ${id}`, { status: r.status, cause: new Error(`HTTP ${r.status}`) });
  return r.json();
}

try {
  await getUser(999);
} catch (err) {
  if (err instanceof ApiError) console.error(`${err.name} (${err.status}):`, err.message, "caused by", err.cause);
  else throw err;
}
```
Caption: Custom error subclasses with cause

### Common Pitfalls

- Swallowing errors with empty catch — `catch {}` hides bugs; at minimum log, or rethrow if you can't handle.
- Catching and rethrowing loses the stack — `throw err` preserves it, but `throw new Error(err.message)` resets it; use Error.cause instead.
- Forgetting to handle async rejections — they become unhandled rejections; wrap awaits in try/catch or attach `.catch()`.
- Using `instanceof Error` for cross-realm objects — different realms (iframes, vm) have different Error constructors; use `err.name` or duck-typing.
- Not testing error paths — happy-path-only testing leaves error handlers broken; deliberately trigger errors in tests.

### Real-World Applications

- Sentry (used by Disney, Cloudflare, GitHub) instruments window.onerror and unhandledrejection to capture client-side errors across millions of sessions.
- VS Code's error telemetry wraps extension calls in try/catch and reports unexpected errors to Microsoft without crashing the editor.
- Slack's desktop app uses an error boundary pattern so a single channel's failure doesn't crash the whole client.
- The Netflix player has tiered error handling: per-frame errors are logged, segment errors trigger a quality downgrade, and fatal errors trigger a player reload.

### Interview Questions

- 1. What's the difference between `throw new Error("x")` and `throw "x"`? — The first creates an Error with a stack trace; the second throws a string, losing the stack — always throw an Error.
- 2. What is Error.cause? — An ES2022 standard option to attach an underlying error, preserving the chain without losing the original stack.
- 3. How do you catch a rejected promise in an async function? — Wrap the await in try/catch, or attach `.catch()` to the outer promise.
- 4. What does a source map do? — Maps minified/bundled code positions back to the original source so DevTools and error reporters show meaningful stacks.
- 5. Why log to a global error handler? — Catches errors you forgot to handle, plus async rejections; essential for production telemetry.

### Mini Project

Build a "Tiny Error Reporter" that hooks into window.onerror and unhandledrejection, batches errors, and POSTs them to a mock `/log` endpoint every 5 seconds or 10 errors (whichever first). It runs silently in the background. Suggested approach:
  - Define a custom `LoggedError` class with `severity` and `context`
  - Listen for both "error" and "unhandledrejection" events
  - Store events in a queue with timestamps and stack traces
  - Flush the queue with fetch POST on a 5s interval AND when queue size hits 10
  - Add a sampling rate (e.g., only send 10% in dev) to avoid noise

### Exercises

1. Write a `safe(fn)` wrapper that catches and returns `{ ok, value, error }`.
2. Create three custom error classes (AuthError, NotFoundError, ValidationError) and a switch handler.
3. Use Error.cause to wrap a fetch TypeError in a custom NetworkError.
4. Set a conditional breakpoint in DevTools that pauses only when a variable exceeds a threshold.
5. Trigger and handle an unhandledrejection in a small test page; observe the warning.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: `throw "oops"` is bad because:
9. A) It's slow
10. B) You lose the stack trace and Error semantics (*)
11. C) Strings can't be thrown
12. D) It crashes Node
13. Explanation: Always throw an Error instance — strings work but lose the stack and break instanceof Error checks.
14. Q2: Error.cause (ES2022) is used to:
15. A) Replace the stack
16. B) Wrap and preserve the underlying error (*)
17. C) Cancel the error
18. D) Silence console.error
19. Explanation: Pass { cause } to super() to chain errors without losing the original stack or context.
20. Q3: window.onerror catches:
21. A) Promise rejections
22. B) Synchronous errors (*)
23. C) Network failures only
24. D) Node errors
25. Explanation: For async/promise rejections, also listen for "unhandledrejection" events.
26. Q4: `catch { /* nothing */ }`:
27. A) Is best practice
28. B) Swallows errors — at least log them (*)
29. C) Rethrows automatically
30. D) Only works in async
31. Explanation: Empty catches hide bugs; log, rethrow, or recover explicitly.
32. Q5: `instanceof Error` may fail across:
33. A) Functions
34. B) Realms (iframes, vm contexts) (*)
35. C) Async functions
36. D) Strict mode
37. Explanation: Each realm has its own Error constructor; cross-realm instanceof checks can return false. Use err.name as a fallback.
38. Q6: Conditional breakpoints are useful to:
39. A) Pause only when a condition is true (*)
40. B) Skip errors
41. C) Replace logging entirely
42. D) Disable try/catch
43. Explanation: Right-click a breakpoint to add a condition; the debugger pauses only when it evaluates truthy.
44. Q7: To inspect Node code in Chrome DevTools:
45. A) node --inspect-brk script.js (*)
46. B) node --debug
47. C) Just run node script.js
48. D) Use console.inspect
49. Explanation: --inspect-brk pauses on the first line; open chrome://inspect to attach DevTools.
50. Q8: Source maps let you:
51. A) Compile TypeScript
52. B) See original source positions in minified code (*)
53. C) Bundle modules
54. D) Lint code
55. Explanation: Source maps translate minified positions back to your original files so DevTools and error reporters are useful.
56. Q9: `unhandledrejection` events fire for:
57. A) Sync errors
58. B) Promises without .catch() or try/catch (*)
59. C) Network errors
60. D) DOM errors
61. Explanation: Add window.addEventListener("unhandledrejection", ...) to catch promises no one awaited or caught.
62. Q10: Best practice for production error handling is to:
63. A) Rethrow everything to the user
64. B) Catch at boundaries, log to a tracker, degrade gracefully (*)
65. C) Use empty catch blocks
66. D) Disable all errors
67. Explanation: Catch where you can recover, log to Sentry/ Datadog, and show users a friendly fallback — never crash silently.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: '`throw "oops"` is bad because:'
  options:
    - It's slow
    - You lose the stack trace and Error semantics
    - Strings can't be thrown
    - It crashes Node
  correctIndex: 1
  explanation: Always throw an Error instance — strings work but lose the stack and break instanceof Error checks.
- id: q2
  question: "Error.cause (ES2022) is used to:"
  options:
    - Replace the stack
    - Wrap and preserve the underlying error
    - Cancel the error
    - Silence console.error
  correctIndex: 1
  explanation: Pass { cause } to super() to chain errors without losing the original stack or context.
- id: q3
  question: "window.onerror catches:"
  options:
    - Promise rejections
    - Synchronous errors
    - Network failures only
    - Node errors
  correctIndex: 1
  explanation: For async/promise rejections, also listen for "unhandledrejection" events.
- id: q4
  question: "`catch { /* nothing */ }`:"
  options:
    - Is best practice
    - Swallows errors — at least log them
    - Rethrows automatically
    - Only works in async
  correctIndex: 1
  explanation: Empty catches hide bugs; log, rethrow, or recover explicitly.
- id: q5
  question: "`instanceof Error` may fail across:"
  options:
    - Functions
    - Realms (iframes, vm contexts)
    - Async functions
    - Strict mode
  correctIndex: 1
  explanation: Each realm has its own Error constructor; cross-realm instanceof checks can return false. Use err.name as a fallback.
- id: q6
  question: "Conditional breakpoints are useful to:"
  options:
    - Pause only when a condition is true
    - Skip errors
    - Replace logging entirely
    - Disable try/catch
  correctIndex: 0
  explanation: Right-click a breakpoint to add a condition; the debugger pauses only when it evaluates truthy.
- id: q7
  question: "To inspect Node code in Chrome DevTools:"
  options:
    - node --inspect-brk script.js
    - node --debug
    - Just run node script.js
    - Use console.inspect
  correctIndex: 0
  explanation: --inspect-brk pauses on the first line; open chrome://inspect to attach DevTools.
- id: q8
  question: "Source maps let you:"
  options:
    - Compile TypeScript
    - See original source positions in minified code
    - Bundle modules
    - Lint code
  correctIndex: 1
  explanation: Source maps translate minified positions back to your original files so DevTools and error reporters are useful.
- id: q9
  question: "`unhandledrejection` events fire for:"
  options:
    - Sync errors
    - Promises without .catch() or try/catch
    - Network errors
    - DOM errors
  correctIndex: 1
  explanation: Add window.addEventListener("unhandledrejection", ...) to catch promises no one awaited or caught.
- id: q10
  question: "Best practice for production error handling is to:"
  options:
    - Rethrow everything to the user
    - Catch at boundaries, log to a tracker, degrade gracefully
    - Use empty catch blocks
    - Disable all errors
  correctIndex: 1
  explanation: Catch where you can recover, log to Sentry/ Datadog, and show users a friendly fallback — never crash silently.
```

