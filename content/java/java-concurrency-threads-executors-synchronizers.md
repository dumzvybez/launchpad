---
slug: java-concurrency-threads-executors-synchronizers
id: java-13
track: java
order: 13
title: Concurrency — Threads, Executors, Synchronizers
description: Create and manage threads, use ExecutorService and CompletableFuture, coordinate with latches/semaphores/CountDownLatch, and understand the Java Memory Model and volatile.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=14400s
whyItMatters: Create and manage threads, use ExecutorService and CompletableFuture, coordinate with latches/semaphores/CountDownLatch, and understand the Java Memory Model and volatile.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# Concurrency — Threads, Executors, Synchronizers

## Concurrency — Threads, Executors, Synchronizers

### Why It Matters

Create and manage threads, use ExecutorService and CompletableFuture, coordinate with latches/semaphores/CountDownLatch, and understand the Java Memory Model and volatile.

Create and manage threads, use ExecutorService and CompletableFuture, coordinate with latches/semaphores/CountDownLatch, and understand the Java Memory Model and volatile.

### Prerequisites

- Stage 12: I/O — Files, NIO, and Serialization.
- Solid grasp of generics, lambdas, and try-with-resources.

### Topics

- Thread creation (extends Thread, implements Runnable, Callable)
- Thread lifecycle: new, runnable, blocked, waiting, timed-waiting, terminated
- ExecutorService, ThreadPoolExecutor, and factory methods
- Callable, Future, and FutureTask
- CompletableFuture and async composition
- Synchronizers: CountDownLatch, CyclicBarrier, Semaphore, Phaser
- The java.util.concurrent collections (ConcurrentHashMap, BlockingQueue, etc.)
- volatile, happens-before, and the Java Memory Model

### Key Concepts

- The Java Memory Model (JMM, JSR 133) defines a happens-before relation that guarantees visibility of writes between threads.
- `volatile` guarantees visibility and ordering but not atomicity of compound actions (e.g., `++` is still racy).
- ExecutorService abstracts thread management; the right pool size depends on workload (CPU-bound: #cores; I/O-bound: much higher).
- CompletableFuture composes async pipelines with `thenApply`, `thenCompose`, `allOf`, `anyOf` — the Java 8 analog of JavaScript promises.
- Virtual threads (Project Loom, Java 21) let you write blocking code that scales to millions of concurrent tasks.

```java
ExecutorService pool = Executors.newFixedThreadPool(4);
Future<Integer> f = pool.submit(() -> {
    Thread.sleep(1000);
    return 42;
});
Integer result = f.get();   // blocks up to 1s
pool.shutdown();             // stop accepting new tasks
```
Caption: ExecutorService and Callable

### Common Pitfalls

- Calling `new Thread().start()` for every task — unbounded thread creation exhausts memory and context-switches the CPU; use an ExecutorService.
- Forgetting to `shutdown()` the ExecutorService — the JVM never exits because non-daemon pool threads keep it alive; use try-with-resources or explicit shutdown.
- Sharing mutable state without synchronization — visibility and atomicity bugs; use `volatile`, locks, or atomic variables.
- Using `Future.get()` without a timeout — hangs forever if the producing task is stuck; always pass a timeout.
- Assuming `volatile` makes `++` atomic — it doesn't; use `AtomicInteger` or a lock for compound actions.

### Real-World Applications

- Netty's event-loop model is the canonical example of a custom ExecutorService driving non-blocking I/O for millions of connections (used by Finagle at Twitter, Cassandra, gRPC-Java).
- Netflix's Hystrix (now superseded by Resilience4j) used semaphores and bulkheads to isolate downstream service calls and prevent cascading failures.
- Cassandra's read-path uses Staged Event-Driven Architecture (SEDA) — separate thread pools for distinct stages, bounded by queues.
- Project Loom (virtual threads, Java 21) is being adopted by Spring Boot 3.2, Quarkus, and Helidon to scale blocking JDBC code to millions of concurrent requests.

### Interview Questions

- 1. What is the Java Memory Model? — A formal specification (JSR 133) of how threads interact through memory, defining happens-before relations for visibility and ordering.
- 2. Difference between `volatile` and `synchronized`? — volatile guarantees visibility/ordering for a single field; synchronized provides mutual exclusion and visibility for a block.
- 3. Why prefer ExecutorService over `new Thread`? — Thread creation is expensive; pools reuse threads, queue tasks, and let you tune concurrency and rejection policies.
- 4. What is the right pool size for CPU-bound vs I/O-bound work? — CPU-bound: roughly #cores (Brian Goetz's formula: N_threads = N_cpu * U_cpu * (1 + W/C)); I/O-bound: much higher (often tens to hundreds).
- 5. What problem do virtual threads solve? — They let you write straightforward blocking code that scales to millions of concurrent tasks by mounting/blocking on the carrier pool instead of OS threads.

### Mini Project

Build a Parallel Web Crawler: Fetch a list of URLs concurrently with a bounded thread pool, parse HTML titles, and report results with a CompletableFuture pipeline. Suggested approach:
  - Use `ExecutorService.newFixedThreadPool(8)` and a `Semaphore(8)` for backpressure
  - Submit a `Callable<PageResult>` per URL
  - Use `CompletableFuture.supplyAsync(..., pool).thenApply(Parser::title)`
  - Combine results via `CompletableFuture.allOf(...).join()`
  - Add a 5-second timeout per request via `orTimeout` (Java 9+)

### Exercises

1. Create an ExecutorService with 4 threads, submit 10 Callables, and print their results as they complete using `ExecutorCompletionService`.
2. Demonstrate a data race with two threads incrementing a shared int 100k times each; fix it with `AtomicInteger`.
3. Use a `CountDownLatch` to coordinate a "ready, set, go" pattern across 5 worker threads.
4. Build a `CompletableFuture` pipeline that fetches a user, then their orders, then emails a summary; chain with `thenCompose` for the async steps.
5. Spawn 10,000 virtual threads each sleeping 500ms; measure total wall time and contrast with 10,000 platform threads (you may not be able to spawn that many).
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which interface represents a task that returns a value?
9. A) Callable (*)
10. B) Runnable
11. C) Thread
12. D) Executor
13. Explanation: Callable<V> is the parameterized counterpart of Runnable; its `call()` method returns a V and can throw checked exceptions.
14. Q2: `Future.get()` without a timeout will?
15. A) Return immediately if no result is ready
16. B) Block indefinitely until the result is available (*)
17. C) Throw TimeoutException after 1 second
18. D) Throw InterruptedException every 100ms
19. Explanation: `get()` blocks until the task completes; always pass a timeout (`get(long, TimeUnit)`) to avoid hanging on a stuck task.
20. Q3: Which ExecutorService factory creates an unbounded thread pool?
21. A) newFixedThreadPool
22. B) newSingleThreadExecutor
23. C) newCachedThreadPool (*)
24. D) newScheduledThreadPool
25. Explanation: newCachedThreadPool creates threads on demand and reuses idle ones for 60 seconds; under bursty load it can spawn unbounded threads — dangerous in production.
26. Q4: `volatile` guarantees?
27. A) Atomicity of compound actions
28. B) Mutual exclusion
29. C) Thread safety for any operation
30. D) Visibility and ordering, but not atomicity of `++` (*)
31. Explanation: volatile provides visibility (writes are immediately seen) and ordering (no reordering across the volatile field) but `i++` is still read-modify-write — use AtomicInteger.
32. Q5: Forgetting to call `shutdown()` on an ExecutorService causes?
33. A) The JVM hangs at exit because pool threads are non-daemon (*)
34. B) Nothing — the JVM exits anyway
35. C) A StackOverflowError
36. D) An OutOfMemoryError
37. Explanation: Pool threads are non-daemon by default; they keep the JVM alive. Always shutdown() (or use try-with-resources on the executor in Java 19+).
38. Q6: CompletableFuture's `thenCompose` is analogous to?
39. A) `map`
40. B) `flatMap` — it flattens a nested CompletableFuture (*)
41. C) `forEach`
42. D) `reduce`
43. Explanation: thenCompose takes a function returning a CompletableFuture and flattens, avoiding `CompletableFuture<CompletableFuture<T>>`. thenApply is the map analog.
44. Q7: Virtual threads (Java 21) are best described as?
45. A) A new OS thread per task
46. B) A wrapper around ExecutorService
47. C) Lightweight user-mode threads scheduled by the JVM on a small carrier pool (*)
48. D) A synonym for daemon threads
49. Explanation: Virtual threads (JEP 444, Java 21) are JVM-scheduled, user-mode threads mounted on a small pool of OS carrier threads; blocking a virtual thread unmounts it.
50. Q8: CountDownLatch vs CyclicBarrier?
51. A) Both are equivalent
52. B) CyclicBarrier is one-shot; CountDownLatch resets
53. C) Neither blocks
54. D) CountDownLatch is one-shot; CyclicBarrier resets and can be reused (*)
55. Explanation: CountDownLatch counts down once and cannot be reset; CyclicBarrier waits for N parties to arrive at the barrier, then optionally runs an action and resets.
56. Q9: Semaphore(5) is commonly used to?
57. A) Limit concurrent access to 5 (*)
58. B) Spawn 5 threads
59. C) Run a task 5 times
60. D) Reject after 5 ms
61. Explanation: A Semaphore with N permits allows up to N concurrent acquirers; used to throttle access to a resource (e.g., 5 concurrent DB connections).
62. Q10: The happens-before relation is defined by?
63. A) The Java Language Specification
64. B) The Java Memory Model (JSR 133) (*)
65. C) The JVM Specification for class loading
66. D) The JIT compiler heuristics
67. Explanation: The Java Memory Model (JSR 133, finalized in Java 5) defines happens-before, which determines when one thread's writes are guaranteed visible to another.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which interface represents a task that returns a value?
  options:
    - Callable
    - Runnable
    - Thread
    - Executor
  correctIndex: 0
  explanation: Callable<V> is the parameterized counterpart of Runnable; its `call()` method returns a V and can throw checked exceptions.
- id: q2
  question: "`Future.get()` without a timeout will?"
  options:
    - Return immediately if no result is ready
    - Block indefinitely until the result is available
    - Throw TimeoutException after 1 second
    - Throw InterruptedException every 100ms
  correctIndex: 1
  explanation: "`get()` blocks until the task completes; always pass a timeout (`get(long, TimeUnit)`) to avoid hanging on a stuck task."
- id: q3
  question: Which ExecutorService factory creates an unbounded thread pool?
  options:
    - newFixedThreadPool
    - newSingleThreadExecutor
    - newCachedThreadPool
    - newScheduledThreadPool
  correctIndex: 2
  explanation: newCachedThreadPool creates threads on demand and reuses idle ones for 60 seconds; under bursty load it can spawn unbounded threads — dangerous in production.
- id: q4
  question: "`volatile` guarantees?"
  options:
    - Atomicity of compound actions
    - Mutual exclusion
    - Thread safety for any operation
    - Visibility and ordering, but not atomicity of `++`
  correctIndex: 3
  explanation: volatile provides visibility (writes are immediately seen) and ordering (no reordering across the volatile field) but `i++` is still read-modify-write — use AtomicInteger.
- id: q5
  question: Forgetting to call `shutdown()` on an ExecutorService causes?
  options:
    - The JVM hangs at exit because pool threads are non-daemon
    - Nothing — the JVM exits anyway
    - A StackOverflowError
    - An OutOfMemoryError
  correctIndex: 0
  explanation: Pool threads are non-daemon by default; they keep the JVM alive. Always shutdown() (or use try-with-resources on the executor in Java 19+).
- id: q6
  question: CompletableFuture's `thenCompose` is analogous to?
  options:
    - "`map`"
    - "`flatMap` — it flattens a nested CompletableFuture"
    - "`forEach`"
    - "`reduce`"
  correctIndex: 1
  explanation: thenCompose takes a function returning a CompletableFuture and flattens, avoiding `CompletableFuture<CompletableFuture<T>>`. thenApply is the map analog.
- id: q7
  question: Virtual threads (Java 21) are best described as?
  options:
    - A new OS thread per task
    - A wrapper around ExecutorService
    - Lightweight user-mode threads scheduled by the JVM on a small carrier pool
    - A synonym for daemon threads
  correctIndex: 2
  explanation: Virtual threads (JEP 444, Java 21) are JVM-scheduled, user-mode threads mounted on a small pool of OS carrier threads; blocking a virtual thread unmounts it.
- id: q8
  question: CountDownLatch vs CyclicBarrier?
  options:
    - Both are equivalent
    - CyclicBarrier is one-shot; CountDownLatch resets
    - Neither blocks
    - CountDownLatch is one-shot; CyclicBarrier resets and can be reused
  correctIndex: 3
  explanation: CountDownLatch counts down once and cannot be reset; CyclicBarrier waits for N parties to arrive at the barrier, then optionally runs an action and resets.
- id: q9
  question: Semaphore(5) is commonly used to?
  options:
    - Limit concurrent access to 5
    - Spawn 5 threads
    - Run a task 5 times
    - Reject after 5 ms
  correctIndex: 0
  explanation: A Semaphore with N permits allows up to N concurrent acquirers; used to throttle access to a resource (e.g., 5 concurrent DB connections).
- id: q10
  question: The happens-before relation is defined by?
  options:
    - The Java Language Specification
    - The Java Memory Model (JSR 133)
    - The JVM Specification for class loading
    - The JIT compiler heuristics
  correctIndex: 1
  explanation: The Java Memory Model (JSR 133, finalized in Java 5) defines happens-before, which determines when one thread's writes are guaranteed visible to another.
```

