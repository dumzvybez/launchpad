---
slug: typescript-async-await-promises-typescript
id: typescript-14
track: typescript
order: 14
title: Async/Await and Promises in TypeScript
description: Type async functions, model Promise return types, handle errors with typed catches, and avoid the floating-promise trap.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ&t=8400s
whyItMatters: Type async functions, model Promise return types, handle errors with typed catches, and avoid the floating-promise trap.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Async/Await and Promises in TypeScript

## Async/Await and Promises in TypeScript

### Why It Matters

Type async functions, model Promise return types, handle errors with typed catches, and avoid the floating-promise trap.

Type async functions, model Promise return types, handle errors with typed catches, and avoid the floating-promise trap.

### Prerequisites

- Stage 4: Functions and Type Inference.
- Stage 10: Type Narrowing and Type Guards.
- Stage 11: Tooling — tsconfig, ESLint, Prettier.

### Topics

- `Promise<T>` and `async`/`await` syntax
- Inference of async return types
- `Awaited<T>` and recursive unwrapping
- Typed errors: `try`/`catch` with `unknown`
- `Promise.all`, `Promise.allSettled`, `Promise.race`, `Promise.any`
- The `no-floating-promises` ESLint rule
- Cancellation with `AbortController`
- Concurrency limits with `p-limit` and `Promise` pools

### Key Concepts

- An `async` function's return type is always `Promise<T>`; `await` unwraps a Promise, recursively (via `Awaited<T>`).
- In TS 4.4+, `catch` variables are `unknown` by default (under `useUnknownInCatchVariables`); narrow before use.
- A floating promise (one you forgot to `await` or `.catch`) silently swallows rejections; `no-floating-promises` catches this.
- `Promise.all` short-circuits on the first rejection; `Promise.allSettled` waits for all and reports each outcome.
- `AbortController` is the standard way to cancel fetches and other async work in modern platforms.

```typescript
async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as User; // cast needed; JSON is unknown
}
```
Caption: Basic async types

### Common Pitfalls

- Forgetting to `await` a promise — the function returns immediately and the rejection is lost; `no-floating-promises` prevents this.
- Casting `await res.json() as User` without validation — the cast is a lie; use Zod or a runtime check to validate the JSON shape.
- Using `Promise.all` when you mean `Promise.allSettled` — `all` short-circuits on the first rejection, hiding partial success.
- Catching with `catch (e: any)` — under `useUnknownInCatchVariables`, this is a type error; narrow `e: unknown` instead.
- Awaiting sequentially when calls are independent — `await a(); await b();` doubles latency; use `await Promise.all([a(), b()])` instead.

### Real-World Applications

- Vercel's edge functions use `AbortController` for timeout enforcement on the edge runtime.
- Stripe's webhook handler uses `Promise.allSettled` to fan out event delivery to multiple sinks without one failure blocking the others.
- The GitHub Actions runner uses `p-limit` to bound concurrent job execution across matrix builds.
- Slack's API SDK uses typed `Promise<SlackResponse<T>>` returns for every endpoint, with `unknown`-typed catch variables forced into `ApiError` via `instanceof`.

### Interview Questions

- 1. What is the return type of an `async` function? — Always `Promise<T>`, where T is the declared (or inferred) return type.
- 2. What does `Awaited<T>` do? — Recursively unwraps nested Promises: `Awaited<Promise<Promise<number>>>` is `number`.
- 3. Why does `catch (e)` default to `unknown` in strict projects? — Because `useUnknownInCatchVariables` (part of `strict`) forces narrowing, preventing `e.message` on non-Error throws.
- 4. What's the difference between `Promise.all` and `Promise.allSettled`? — `all` short-circuits on the first rejection; `allSettled` waits for all and returns `{status, value/reason}` for each.
- 5. How do you cancel an in-flight `fetch`? — Pass an `AbortSignal` from `new AbortController()` to `fetch(url, { signal })`; call `controller.abort()` to cancel.

### Mini Project

Build a typed Concurrent Fetcher: A `fetchAll<T>(urls: string[], opts: { concurrency: number; timeoutMs: number }): Promise<Result<T, Error>[]>` that uses AbortController and a concurrency limit. Suggested approach:
  - Define `type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }`
  - Use a simple counter-based semaphore (or `p-limit`)
  - Wire `AbortController` per request with a `setTimeout` fallback
  - Use `Promise.allSettled` so one failure doesn't abort the batch
  - Map settled results to `Result<T, Error>` and return

### Exercises

1. Write `async function fetchUser(id: string): Promise<User>` and call it from another async function with `await`.
2. Trigger a rejection that you forget to `await`; enable `no-floating-promises` and observe the lint error.
3. Replace `Promise.all` with `Promise.allSettled` and switch on `r.status` to handle both outcomes.
4. Add a 5-second timeout to a fetch using `AbortController`.
5. Use `p-limit` (or your own semaphore) to bound 100 concurrent fetches to 5 at a time.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the return type of `async function f(): Promise<number>`?
9. A) `number`
10. B) `Promise<number>` (the async keyword wraps it again, but TS normalizes to `Promise<number>`) (*)
11. C) `Promise<Promise<number>>`
12. D) `void`
13. Explanation: An async function's declared return is automatically wrapped in a Promise; declaring `Promise<number>` keeps it as `Promise<number>` (no double-wrap — TS normalizes).
14. Q2: What does `Awaited<Promise<Promise<number>>>` resolve to?
15. A) `Promise<number>`
16. B) `Promise<Promise<number>>`
17. C) `number` (*)
18. D) `unknown`
19. Explanation: `Awaited<T>` recursively unwraps nested Promises until it reaches the innermost non-Promise type — here `number`.
20. Q3: Under `useUnknownInCatchVariables`, what is the type of `e` in `catch (e)`?
21. A) `any`
22. B) `Error`
23. C) `never`
24. D) `unknown` (*)
25. Explanation: The strict flag types catch variables as `unknown`, forcing you to narrow (e.g., `if (e instanceof Error)`) before accessing properties.
26. Q4: Which combinator waits for all promises and reports each outcome?
27. A) `Promise.allSettled` (*)
28. B) `Promise.all`
29. C) `Promise.race`
30. D) `Promise.any`
31. Explanation: `Promise.allSettled` resolves to an array of `{status: "fulfilled"|"rejected", value?|reason?}` after all input promises finish.
32. Q5: Which ESLint rule catches forgotten `await` on promises?
33. A) `no-async`
34. B) `@typescript-eslint/no-floating-promises` (*)
35. C) `await-thenable`
36. D) `promise-all`
37. Explanation: `no-floating-promises` flags promise-valued expressions that are neither awaited nor `.catch`'d, preventing silently swallowed rejections.
38. Q6: How do you cancel an in-flight `fetch`?
39. A) Call `fetch.cancel()`
40. B) Set a timeout
41. C) Pass an `AbortSignal` from `new AbortController()` and call `.abort()` (*)
42. D) You cannot cancel fetch
43. Explanation: The standard pattern is `const c = new AbortController(); fetch(url, { signal: c.signal }); c.abort();`.
44. Q7: Why is `await res.json() as User` unsafe?
45. A) It throws at runtime
46. B) `await` doesn't work on `.json()`
47. C) `res.json()` returns `string`
48. D) The cast bypasses validation; the JSON could be any shape (*)
49. Explanation: `res.json()` returns `Promise<any>`; the cast tells TS to trust the shape without verifying — a Zod schema or manual validation is the safe approach.
50. Q8: Which pattern doubles latency for two independent calls?
51. A) `await a(); await b();` (sequential) (*)
52. B) `await Promise.all([a(), b()])`
53. C) `Promise.allSettled([a(), b()])`
54. D) `await Promise.race([a(), b()])`
55. Explanation: Sequential `await`s wait for the first to finish before starting the second; `Promise.all` runs them concurrently.
56. Q9: What does `Promise.any` do?
57. A) Returns the first rejection
58. B) Returns the first fulfilled value (rejects only if all reject) (*)
59. C) Returns all values
60. D) Returns the last value
61. Explanation: `Promise.any` resolves with the first fulfilled value and rejects (with an `AggregateError`) only if every input promise rejects.
62. Q10: Which is the correct typed catch pattern?
63. A) `catch (e: any) { e.message }`
64. B) `catch (e: Error) { e.message }`
65. C) `catch (e) { if (e instanceof Error) e.message }` (*)
66. D) `catch { e.message }`
67. Explanation: Under strict mode `e` is `unknown`; you must narrow (e.g., `instanceof Error`) before accessing `.message`. Annotating `e: Error` is itself an error under `useUnknownInCatchVariables`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "What is the return type of `async function f(): Promise<number>`?"
  options:
    - "`number`"
    - "`Promise<number>` (the async keyword wraps it again, but TS normalizes to `Promise<number>`)"
    - "`Promise<Promise<number>>`"
    - "`void`"
  correctIndex: 1
  explanation: An async function's declared return is automatically wrapped in a Promise; declaring `Promise<number>` keeps it as `Promise<number>` (no double-wrap — TS normalizes).
- id: q2
  question: What does `Awaited<Promise<Promise<number>>>` resolve to?
  options:
    - "`Promise<number>`"
    - "`Promise<Promise<number>>`"
    - "`number`"
    - "`unknown`"
  correctIndex: 2
  explanation: "`Awaited<T>` recursively unwraps nested Promises until it reaches the innermost non-Promise type — here `number`."
- id: q3
  question: Under `useUnknownInCatchVariables`, what is the type of `e` in `catch (e)`?
  options:
    - "`any`"
    - "`Error`"
    - "`never`"
    - "`unknown`"
  correctIndex: 3
  explanation: The strict flag types catch variables as `unknown`, forcing you to narrow (e.g., `if (e instanceof Error)`) before accessing properties.
- id: q4
  question: Which combinator waits for all promises and reports each outcome?
  options:
    - "`Promise.allSettled`"
    - "`Promise.all`"
    - "`Promise.race`"
    - "`Promise.any`"
  correctIndex: 0
  explanation: '`Promise.allSettled` resolves to an array of `{status: "fulfilled"|"rejected", value?|reason?}` after all input promises finish.'
- id: q5
  question: Which ESLint rule catches forgotten `await` on promises?
  options:
    - "`no-async`"
    - "`@typescript-eslint/no-floating-promises`"
    - "`await-thenable`"
    - "`promise-all`"
  correctIndex: 1
  explanation: "`no-floating-promises` flags promise-valued expressions that are neither awaited nor `.catch`'d, preventing silently swallowed rejections."
- id: q6
  question: How do you cancel an in-flight `fetch`?
  options:
    - Call `fetch.cancel()`
    - Set a timeout
    - Pass an `AbortSignal` from `new AbortController()` and call `.abort()`
    - You cannot cancel fetch
  correctIndex: 2
  explanation: "The standard pattern is `const c = new AbortController(); fetch(url, { signal: c.signal }); c.abort();`."
- id: q7
  question: Why is `await res.json() as User` unsafe?
  options:
    - It throws at runtime
    - "`await` doesn't work on `.json()`"
    - "`res.json()` returns `string`"
    - The cast bypasses validation; the JSON could be any shape
  correctIndex: 3
  explanation: "`res.json()` returns `Promise<any>`; the cast tells TS to trust the shape without verifying — a Zod schema or manual validation is the safe approach."
- id: q8
  question: Which pattern doubles latency for two independent calls?
  options:
    - "`await a(); await b();` (sequential)"
    - "`await Promise.all([a(), b()])`"
    - "`Promise.allSettled([a(), b()])`"
    - "`await Promise.race([a(), b()])`"
  correctIndex: 0
  explanation: Sequential `await`s wait for the first to finish before starting the second; `Promise.all` runs them concurrently.
- id: q9
  question: What does `Promise.any` do?
  options:
    - Returns the first rejection
    - Returns the first fulfilled value (rejects only if all reject)
    - Returns all values
    - Returns the last value
  correctIndex: 1
  explanation: "`Promise.any` resolves with the first fulfilled value and rejects (with an `AggregateError`) only if every input promise rejects."
- id: q10
  question: Which is the correct typed catch pattern?
  options:
    - "`catch (e: any) { e.message }`"
    - "`catch (e: Error) { e.message }`"
    - "`catch (e) { if (e instanceof Error) e.message }`"
    - "`catch { e.message }`"
  correctIndex: 2
  explanation: "Under strict mode `e` is `unknown`; you must narrow (e.g., `instanceof Error`) before accessing `.message`. Annotating `e: Error` is itself an error under `useUnknownInCatchVariables`."
```

