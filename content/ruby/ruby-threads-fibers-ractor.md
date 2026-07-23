---
slug: ruby-threads-fibers-ractor
id: ruby-16
track: ruby
order: 16
title: Threads, Fibers, and Ractor
description: Use Thread + Mutex for IO concurrency, Fiber for cooperative coroutines, and Ractor for true parallelism in Ruby 3.0+.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=10400s
whyItMatters: Use Thread + Mutex for IO concurrency, Fiber for cooperative coroutines, and Ractor for true parallelism in Ruby 3. 0+.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Threads, Fibers, and Ractor

## Threads, Fibers, and Ractor

### Why It Matters

Use Thread + Mutex for IO concurrency, Fiber for cooperative coroutines, and Ractor for true parallelism in Ruby 3. 0+.

Use Thread + Mutex for IO concurrency, Fiber for cooperative coroutines, and Ractor for true parallelism in Ruby 3.0+.

### Prerequisites

- Stage 15: Testing (for concurrent test design)
- Stage 11: Exception Handling (threads raise independently).

### Topics

- Thread.new, Thread.current, Thread#join, Thread#value
- Mutex#synchronize for critical sections
- Queue and SizedQueue for producer/consumer
- ConditionVariable for cross-thread signaling
- Fiber.new, Fiber.yield, Fiber#resume
- Fibers as the basis of Enumerator
- Ractor (Ruby 3.0+) for parallel execution
- GIL (MRI) vs Ractor's true parallelism

### Key Concepts

- MRI's Global Interpreter Lock (GIL) means CPU-bound threads don't run in true parallel — but IO-bound threads interleave.
- Always protect shared mutable state with Mutex#synchronize; race conditions cause lost updates that are nearly impossible to debug.
- Queue is thread-safe — use it for producer/consumer patterns instead of rolling your own mutex-protected array.
- Fibers are cooperative (you must explicitly yield); Threads are preemptive (the runtime switches).
- Ractors run in true parallel (no GIL) but can only share frozen (immutable) objects — mutable state must be copied or passed via messages.
- Unhandled exceptions in a Thread crash the thread silently; check thread.status or thread.value to surface errors.

```ruby
threads = 10.times.map do |i|
  Thread.new(i) do |n|
    sleep(rand(0.01..0.05))
    "thread-#{n} done"
  end
end

# Wait for all threads and collect their values
results = threads.map(&:value)
puts results.inspect

# CAUTION: MRI's GIL means CPU-bound threads don't run truly in parallel
# (but IO-bound threads DO interleave — great for HTTP calls)
```
Caption: Threads

### Common Pitfalls

- Forgetting Mutex around shared state — Use mutex.synchronize { ... } for any read-modify-write on shared state; lost updates from race conditions are nearly impossible to debug.
- Swallowing thread exceptions — An unhandled exception in a Thread dies silently; call thread.value (re-raises) or set Thread.abort_on_exception = true to surface errors.
- Assuming threads give CPU-bound parallelism in MRI — MRI's GIL serializes CPU work; for true parallelism use Ractor (Ruby 3.0+) or JRuby/TruffleRuby.
- Sharing mutable objects across Ractors — Ractors require shared objects to be frozen; pass mutable data as a copy or via messages.
- Deadlocking with nested Mutexes — Always acquire locks in a consistent order; use Mutex#synchronize (auto-releases) and avoid nested locks.

### Real-World Applications

- Sidekiq (used by GitHub, Shopify, Stripe) uses threads + Celluloid/Concurrent-Ruby to process millions of background jobs per day on MRI.
- Shopify's webhook delivery uses Queue-based producer/consumer threads to fan out events across hundreds of merchants.
- Stripe's payment engine uses Ractors (Ruby 3.0+) in experimental pipelines for parallel fraud detection.
- GitHub's webhook ingestion uses Fibers via Enumerator to stream events lazily without buffering them all.

### Interview Questions

- 1. What does MRI's GIL prevent? — True parallel execution of CPU-bound Ruby threads — only one thread runs Ruby code at a time (IO threads still interleave).
- 2. What's the difference between Thread and Fiber? — Threads are preemptive (runtime switches); Fibers are cooperative (you must explicitly yield).
- 3. What does Mutex#synchronize do? — Acquires the lock, runs the block, releases the lock (even on exception) — protects critical sections.
- 4. What's special about Ractor in Ruby 3.0+? — It enables true parallelism (no GIL) by isolating state — shared objects must be frozen.
- 5. Why use Queue instead of a mutex-protected Array? — Queue is built-in thread-safe; rolling your own mutex + array is error-prone (forgot to lock, deadlocks, etc.).

### Mini Project

Build a Parallel Web Crawler: A CLI that fetches N URLs concurrently
using a thread pool of size K, prints response codes, and uses a Queue
for work distribution. Suggested approach:
Suggested approach:
  - Push URLs into a Queue
  - Spawn K Thread workers that pop from the queue
  - Use Net::HTTP.get_response (IO-bound, benefits from threads)
  - Use a Mutex to safely accumulate results
  - Join all threads and print summary

### Exercises

1. Spawn 10 threads that each print their thread id and sleep 0.1s; join them all.
2. Increment a shared counter from 100 threads using Mutex#synchronize; verify no lost updates.
3. Use Queue to implement a producer/consumer with one producer thread and two consumers.
4. Create a Fiber that yields three values and resumes with arguments between each.
5. Spawn 4 Ractors that compute a CPU-bound sum in parallel and verify it's faster than serial.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does MRI's GIL prevent?
9. A) IO operations
10. B) Garbage collection
11. C) Threads from being created
12. D) True parallel CPU execution across threads (*)
13. Explanation: The GIL allows only one thread to run Ruby code at a time — IO-bound threads still interleave while waiting.
14. Q2: What's the difference between Thread and Fiber?
15. A) Threads are preemptive; Fibers are cooperative (*)
16. B) Threads are deprecated
17. C) Fibers are preemptive; Threads cooperative
18. D) They're identical
19. Explanation: Threads can be switched at any time; Fibers only switch when you explicitly call Fiber.yield.
20. Q3: What does Mutex#synchronize do?
21. A) Locks forever
22. B) Acquires the lock, runs the block, releases on exit (even on exception) (*)
23. C) Skips the block if locked
24. D) Creates a new thread
25. Explanation: synchronize is the safe way to wrap critical sections — always releases the lock.
26. Q4: What's special about Ractor in Ruby 3.0+?
27. A) It's a Fiber alias
28. B) It's a thread pool
29. C) True parallelism without the GIL, with isolated state (*)
30. D) It's deprecated
31. Explanation: Ractors run in parallel; each has its own state and can only share frozen objects.
32. Q5: Why prefer Queue over a Mutex-protected Array?
33. A) Queue is faster than Array
34. B) Mutex is deprecated
35. C) Array doesn't support push/pop
36. D) Queue is built-in thread-safe (*)
37. Explanation: Queue handles all locking internally — rolling your own mutex + array is error-prone.
38. Q6: What does Thread#value do?
39. A) Waits for the thread and returns its block's return value (re-raises any exception) (*)
40. B) Returns the thread's ID
41. C) Returns the thread's status
42. D) Returns nil
43. Explanation: value joins the thread and returns its result; if the thread raised, value re-raises.
44. Q7: What happens to an unhandled exception in a Thread by default?
45. A) Crashes the whole program
46. B) Dies silently (unless abort_on_exception = true) (*)
47. C) Is printed to stderr automatically
48. D) Is re-raised in the main thread
49. Explanation: By default, thread exceptions are silent — set Thread.abort_on_exception = true to surface them.
50. Q8: What does Fiber.yield do?
51. A) Raises an error
52. B) Creates a new fiber
53. C) Pauses the fiber and returns the value to the caller (*)
54. D) Returns from the method
55. Explanation: Fiber.yield pauses the fiber and returns the given value to the caller of #resume.
56. Q9: Which object can be shared across Ractors without freezing?
57. A) Strings
58. B) Arrays
59. C) Hashes
60. D) None — all shared objects must be frozen (*)
61. Explanation: Ractors isolate state; to share an object it must be frozen (immutable) or passed as a copy via messages.
62. Q10: What's a common deadlock cause?
63. A) Acquiring multiple locks in inconsistent order (*)
64. B) Using too many threads
65. C) Using Queue
66. D) Using Fiber
67. Explanation: When two threads each hold a lock the other needs, they wait forever — acquire locks in a consistent global order.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does MRI's GIL prevent?
  options:
    - IO operations
    - Garbage collection
    - Threads from being created
    - True parallel CPU execution across threads
  correctIndex: 3
  explanation: The GIL allows only one thread to run Ruby code at a time — IO-bound threads still interleave while waiting.
- id: q2
  question: What's the difference between Thread and Fiber?
  options:
    - Threads are preemptive; Fibers are cooperative
    - Threads are deprecated
    - Fibers are preemptive; Threads cooperative
    - They're identical
  correctIndex: 0
  explanation: Threads can be switched at any time; Fibers only switch when you explicitly call Fiber.yield.
- id: q3
  question: What does Mutex#synchronize do?
  options:
    - Locks forever
    - Acquires the lock, runs the block, releases on exit (even on exception)
    - Skips the block if locked
    - Creates a new thread
  correctIndex: 1
  explanation: synchronize is the safe way to wrap critical sections — always releases the lock.
- id: q4
  question: What's special about Ractor in Ruby 3.0+?
  options:
    - It's a Fiber alias
    - It's a thread pool
    - True parallelism without the GIL, with isolated state
    - It's deprecated
  correctIndex: 2
  explanation: Ractors run in parallel; each has its own state and can only share frozen objects.
- id: q5
  question: Why prefer Queue over a Mutex-protected Array?
  options:
    - Queue is faster than Array
    - Mutex is deprecated
    - Array doesn't support push/pop
    - Queue is built-in thread-safe
  correctIndex: 3
  explanation: Queue handles all locking internally — rolling your own mutex + array is error-prone.
- id: q6
  question: What does Thread#value do?
  options:
    - Waits for the thread and returns its block's return value (re-raises any exception)
    - Returns the thread's ID
    - Returns the thread's status
    - Returns nil
  correctIndex: 0
  explanation: value joins the thread and returns its result; if the thread raised, value re-raises.
- id: q7
  question: What happens to an unhandled exception in a Thread by default?
  options:
    - Crashes the whole program
    - Dies silently (unless abort_on_exception = true)
    - Is printed to stderr automatically
    - Is re-raised in the main thread
  correctIndex: 1
  explanation: By default, thread exceptions are silent — set Thread.abort_on_exception = true to surface them.
- id: q8
  question: What does Fiber.yield do?
  options:
    - Raises an error
    - Creates a new fiber
    - Pauses the fiber and returns the value to the caller
    - Returns from the method
  correctIndex: 2
  explanation: "Fiber.yield pauses the fiber and returns the given value to the caller of #resume."
- id: q9
  question: Which object can be shared across Ractors without freezing?
  options:
    - Strings
    - Arrays
    - Hashes
    - None — all shared objects must be frozen
  correctIndex: 3
  explanation: Ractors isolate state; to share an object it must be frozen (immutable) or passed as a copy via messages.
- id: q10
  question: What's a common deadlock cause?
  options:
    - Acquiring multiple locks in inconsistent order
    - Using too many threads
    - Using Queue
    - Using Fiber
  correctIndex: 0
  explanation: When two threads each hold a lock the other needs, they wait forever — acquire locks in a consistent global order.
```

