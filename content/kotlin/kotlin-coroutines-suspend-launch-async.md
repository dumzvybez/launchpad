---
slug: kotlin-coroutines-suspend-launch-async
id: kotlin-15
track: kotlin
order: 15
title: Coroutines — suspend, launch, async
description: "Master Kotlin's coroutines: suspend functions, structured concurrency, `launch` for fire-and-forget, `async`/`await` for results, and the dangers of `runBlocking`."
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=7560s
whyItMatters: "Master Kotlin's coroutines: suspend functions, structured concurrency, `launch` for fire-and-forget, `async`/`await` for results, and the dangers of `runBlocking`."
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Coroutines — suspend, launch, async

## Coroutines — suspend, launch, async

### Why It Matters

Master Kotlin's coroutines: suspend functions, structured concurrency, `launch` for fire-and-forget, `async`/`await` for results, and the dangers of `runBlocking`.

Master Kotlin's coroutines: suspend functions, structured concurrency, `launch` for fire-and-forget, `async`/`await` for results, and the dangers of `runBlocking`.

### Prerequisites

- Stage 1-14.
- Comfort with higher-order functions, lambdas, and threads.

### Topics

- Coroutines overview: lightweight, suspendable computations
- `suspend fun` declarations
- CoroutineScope and structured concurrency
- Dispatchers: Default, IO, Main, Unconfined
- `launch` (Job, fire-and-forget) and `async`/`await` (Deferred)
- `runBlocking` — what it's for and why to avoid in production
- Cancellation: cooperative, `isActive`, `yield`
- Coroutine context and exception handling

### Key Concepts

- Coroutines are lightweight (sub-KB stack) and run on a small thread pool — you can have 100k coroutines vs ~1k threads.
- `suspend fun` may suspend without blocking a thread — the compiler rewrites it into a state machine (CPS transform).
- Structured concurrency: every coroutine has a parent; if the parent cancels, children cancel — this prevents leaks.
- `launch` returns a `Job` for fire-and-forget; `async` returns a `Deferred<T>` you can `await()` for the result.
- `runBlocking` blocks the current thread until the coroutine completes — useful in `main` and tests, but NEVER in production code (defeats the purpose of coroutines).

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {   // top-level bridge for main
    launch {   // fire-and-forget
        delay(500)
        println("World!")
    }
    println("Hello,")        // prints first
    val sum = async { computeSum(1, 2) }
    val product = async { computeProduct(3, 4) }
    println("sum=${sum.await()} product=${product.await()}")
}

suspend fun computeSum(a: Int, b: Int): Int {
    delay(100)
    return a + b
}
suspend fun computeProduct(a: Int, b: Int): Int { delay(100); return a * b }
```
Caption: launch and async

### Common Pitfalls

- Using `runBlocking` in production code — it blocks the thread, defeating the purpose of coroutines; use `suspend fun` and a real dispatcher instead.
- Forgetting structured concurrency — `GlobalScope.launch { }` creates an unstructured coroutine that leaks; always use a `coroutineScope { }` or a `viewModelScope`/`lifecycleScope`.
- Calling blocking code inside a coroutine without switching dispatchers — `Thread.sleep` blocks the underlying thread, starving the dispatcher; wrap in `withContext(Dispatchers.IO)`.
- Ignoring cooperative cancellation — `while (true) { /* no suspending calls */ }` never checks cancellation; use `ensureActive()` or a `yield()`/`delay` checkpoint.
- Mixing `async` without error handling — if one `async` fails, the exception propagates only at `await()`; wrap in `supervisorScope` if you want failures to be isolated.

### Real-World Applications

- Android's `viewModelScope` and `lifecycleScope` provide structured scopes tied to ViewModels and Activities, preventing leaks on configuration changes.
- Ktor's server uses coroutines end-to-end: each request runs in a suspend lambda on the IO dispatcher.
- Spring Boot 3.2+ supports `suspend` controller methods and virtual threads — coroutines are the natural fit for non-blocking services.
- Square's Retrofit added `@Suspend` execution for Kotlin coroutines — every API method is `suspend fun`.

### Interview Questions

- 1. What is the difference between a thread and a coroutine? — Coroutines are lightweight (~100 bytes vs ~1MB thread stack) and suspend without blocking the underlying thread; thousands of coroutines share a small thread pool.
- 2. What is structured concurrency and why does it matter? — Every coroutine runs in a scope tied to a parent; if the parent cancels or fails, children cancel too — preventing leaks and unhandled exceptions.
- 3. Difference between `launch` and `async`? — `launch` returns a `Job` (fire-and-forget); `async` returns a `Deferred<T>` you can `await()` for a result; both are children of their scope.
- 4. Why is `runBlocking` discouraged in production? — It blocks the current thread, defeating the purpose of coroutines; reserve it for `main` and tests.
- 5. How does coroutine cancellation work? — Cooperative: a `CancellationException` is thrown at the next suspension point (`delay`, `await`); long CPU-bound loops must check `isActive` or call `yield()`.

### Mini Project

Build a Concurrent URL Fetcher: A `suspend fun fetchAll(urls: List<String>): List<String>` that fetches all URLs concurrently with `async`, runs on `Dispatchers.IO`, respects a per-call timeout, and gracefully handles failures. Suggested approach:
  - Use `coroutineScope { urls.map { async { fetchOne(it) } }.map { it.await() } }`
  - `suspend fun fetchOne(url: String): String = withContext(Dispatchers.IO) { URL(url).readText() }`
  - Add `withTimeout(5000) { ... }` per fetch
  - Use `supervisorScope` + try/catch if you want partial results
  - Add `runBlocking` only in `main` to start

### Exercises

1. Write `suspend fun repeatMessage(msg: String, n: Int)` that prints `msg` n times with 100ms delay; launch it and cancel after 250ms.
2. Use `async`/`await` to fetch two fake "API" results concurrently and print the time saved vs sequential.
3. Demonstrate cooperative cancellation: a loop that checks `isActive` and exits on cancel.
4. Switch dispatchers: launch on `Main`, do CPU work on `Default`, save to disk on `IO`, return to `Main`.
5. Reproduce a leaked coroutine with `GlobalScope.launch` and explain why structured concurrency fixes it.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What keyword marks a function as suspendable?
9. A) async
10. B) await
11. C) suspend (*)
12. D) yield
13. Explanation: `suspend fun foo()` may suspend without blocking a thread; the compiler rewrites it into a state machine (continuation-passing style).
14. Q2: Why are coroutines lighter than threads?
15. A) They run in user mode only
16. B) They share no state
17. C) They don't use the CPU
18. D) They use less memory (~KB stack vs ~MB) (*)
19. Explanation: Coroutines have a small stack (~100 bytes-1KB) and share a thread pool; you can have 100k coroutines on a few threads.
20. Q3: What does `launch` return?
21. A) Job (*)
22. B) Deferred<T>
23. C) Unit
24. D) Thread
25. Explanation: `launch` returns a `Job` for fire-and-forget; you can `cancel()` or `join()` it but you don't get a result value.
26. Q4: What does `async` return?
27. A) Job
28. B) Deferred<T> — await for the result (*)
29. C) Unit
30. D) Future
31. Explanation: `async` returns a `Deferred<T>`; call `.await()` to get the result (suspending until ready).
32. Q5: Why is `runBlocking` discouraged in production?
33. A) It leaks memory
34. B) It is deprecated
35. C) It blocks the current thread, defeating coroutine benefits (*)
36. D) It requires root
37. Explanation: `runBlocking` blocks the calling thread until the coroutine completes; useful for `main` and tests, but it defeats the non-blocking purpose of coroutines.
38. Q6: What is structured concurrency?
39. A) Coroutines share a global scope
40. B) Coroutines run sequentially
41. C) Coroutines use locks
42. D) Each coroutine has a parent; children cancel with parent (*)
43. Explanation: Every coroutine runs in a parent scope; cancellation/exceptions propagate to children, preventing leaks and unhandled errors.
44. Q7: Which dispatcher is best for blocking I/O (file, JDBC, blocking HTTP)?
45. A) Dispatchers.IO (*)
46. B) Dispatchers.Default
47. C) Dispatchers.Main
48. D) Dispatchers.Unconfined
49. Explanation: `Dispatchers.IO` is a large pool (64+ threads) for blocking operations; `Default` is for CPU work, `Main` for UI.
50. Q8: Is coroutine cancellation cooperative or forced?
51. A) Forced — the thread is killed
52. B) Cooperative — checked at suspension points (*)
53. C) Not possible
54. D) Always immediate
55. Explanation: Cancellation is cooperative: a `CancellationException` is thrown at the next suspension point; CPU-bound loops must check `isActive` or call `yield()`.
56. Q9: What does `GlobalScope.launch` risk?
57. A) Compilation error
58. B) Stack overflow
59. C) Leaked coroutine (no parent scope, never auto-canceled) (*)
60. D) Deadlock
61. Explanation: `GlobalScope` has no parent; coroutines launched there outlive their caller and can leak — prefer `coroutineScope`, `viewModelScope`, etc.
62. Q10: What does `withContext(Dispatchers.IO) { ... }` do?
63. A) Creates a new thread
64. B) Blocks the thread
65. C) Cancels the coroutine
66. D) Switches the coroutine to the IO dispatcher for the block, then resumes (*)
67. Explanation: `withContext` suspends the current coroutine, dispatches the block to the specified dispatcher, and resumes with the result — used to switch threads without blocking.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What keyword marks a function as suspendable?
  options:
    - async
    - await
    - suspend
    - yield
  correctIndex: 2
  explanation: "`suspend fun foo()` may suspend without blocking a thread; the compiler rewrites it into a state machine (continuation-passing style)."
- id: q2
  question: Why are coroutines lighter than threads?
  options:
    - They run in user mode only
    - They share no state
    - They don't use the CPU
    - They use less memory (~KB stack vs ~MB)
    - and share a thread pool; you can have 100k coroutines on a few threads.
  correctIndex: 3
  explanation: Coroutines have a small stack (~100 bytes-1KB) and share a thread pool; you can have 100k coroutines on a few threads.
- id: q3
  question: What does `launch` return?
  options:
    - Job
    - Deferred<T>
    - Unit
    - Thread
  correctIndex: 0
  explanation: "`launch` returns a `Job` for fire-and-forget; you can `cancel()` or `join()` it but you don't get a result value."
- id: q4
  question: What does `async` return?
  options:
    - Job
    - Deferred<T> — await for the result
    - Unit
    - Future
  correctIndex: 1
  explanation: "`async` returns a `Deferred<T>`; call `.await()` to get the result (suspending until ready)."
- id: q5
  question: Why is `runBlocking` discouraged in production?
  options:
    - It leaks memory
    - It is deprecated
    - It blocks the current thread, defeating coroutine benefits
    - It requires root
  correctIndex: 2
  explanation: "`runBlocking` blocks the calling thread until the coroutine completes; useful for `main` and tests, but it defeats the non-blocking purpose of coroutines."
- id: q6
  question: What is structured concurrency?
  options:
    - Coroutines share a global scope
    - Coroutines run sequentially
    - Coroutines use locks
    - Each coroutine has a parent; children cancel with parent
  correctIndex: 3
  explanation: Every coroutine runs in a parent scope; cancellation/exceptions propagate to children, preventing leaks and unhandled errors.
- id: q7
  question: Which dispatcher is best for blocking I/O (file, JDBC, blocking HTTP)?
  options:
    - "?"
    - Dispatchers.IO
    - Dispatchers.Default
    - Dispatchers.Main
    - Dispatchers.Unconfined
  correctIndex: 1
  explanation: "`Dispatchers.IO` is a large pool (64+ threads) for blocking operations; `Default` is for CPU work, `Main` for UI."
- id: q8
  question: Is coroutine cancellation cooperative or forced?
  options:
    - Forced — the thread is killed
    - Cooperative — checked at suspension points
    - Not possible
    - Always immediate
  correctIndex: 1
  explanation: "Cancellation is cooperative: a `CancellationException` is thrown at the next suspension point; CPU-bound loops must check `isActive` or call `yield()`."
- id: q9
  question: What does `GlobalScope.launch` risk?
  options:
    - Compilation error
    - Stack overflow
    - Leaked coroutine (no parent scope, never auto-canceled)
    - Deadlock
  correctIndex: 2
  explanation: "`GlobalScope` has no parent; coroutines launched there outlive their caller and can leak — prefer `coroutineScope`, `viewModelScope`, etc."
- id: q10
  question: What does `withContext(Dispatchers.IO) { ... }` do?
  options:
    - "{ ... }` do?"
    - Creates a new thread
    - Blocks the thread
    - Cancels the coroutine
    - Switches the coroutine to the IO dispatcher for the block, then resumes
  correctIndex: 4
  explanation: "`withContext` suspends the current coroutine, dispatches the block to the specified dispatcher, and resumes with the result — used to switch threads without blocking."
```

