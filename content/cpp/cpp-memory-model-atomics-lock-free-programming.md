---
slug: cpp-memory-model-atomics-lock-free-programming
id: cpp-18
track: cpp
order: 18
title: Memory Model, atomics, and lock-free programming
description: Master the C++ memory model, std::atomic, memory orderings, false sharing, cache-line alignment, and the hard problems of lock-free data structures.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=850s
whyItMatters: Master the C++ memory model, std::atomic, memory orderings, false sharing, cache-line alignment, and the hard problems of lock-free data structures.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# Memory Model, atomics, and lock-free programming

## Memory Model, atomics, and lock-free programming

### Why It Matters

Master the C++ memory model, std::atomic, memory orderings, false sharing, cache-line alignment, and the hard problems of lock-free data structures.

Master the C++ memory model, std::atomic, memory orderings, false sharing, cache-line alignment, and the hard problems of lock-free data structures.

### Prerequisites

- Stage 1-17 (especially concurrency)
- Comfort with bitwise operations and the standard library's <atomic>

### Topics

- The C++ memory model: happens-before, sequenced-before, synchronizes-with
- std::atomic<T> and its operations: load, store, exchange, CAS (compare_exchange_*)
- Memory orderings: relaxed, acquire, release, acq_rel, seq_cst
- Fences: std::atomic_thread_fence
- std::atomic_ref<T> (C++20)
- False sharing and cache-line alignment (alignas(64))
- ABA problem in lock-free stacks
- Hazard pointers and RCU (preview)
- Lock-free vs wait-free vs lock-based
- When NOT to write lock-free code

### Key Concepts

- The C++ memory model defines what cross-thread reads/writes are legal; without synchronization, almost everything is a data race (UB).
- std::atomic provides atomicity and a memory ordering; the default seq_cst is the strongest and easiest to reason about, but slowest.
- Acquire/release pairing: a release store synchronizes with an acquire load of the same atomic, establishing a happens-before edge.
- False sharing: two threads writing adjacent fields on the same cache line cause the cache coherence protocol to thrash; alignas(64) to give each its own line.
- ABA: a value changes from A to B back to A, fooling a CAS that nothing changed; solve with tagged pointers or hazard pointers.
- Lock-free is hard: prefer mutex + condvar unless you've measured a need; even experts ship bugs.

```cpp
#include <atomic>
#include <vector>
#include <thread>

int main() {
    std::atomic<int> counter{0};
    std::vector<std::thread> ts;
    for (int i = 0; i < 8; ++i) {
        ts.emplace_back([&] {
            for (int j = 0; j < 100'000; ++j) counter.fetch_add(1, std::memory_order_relaxed);
        });
    }
    for (auto& t : ts) t.join();
    return counter.load();   // 800000 — atomic, no lost updates
}
```
Caption: Atomic counter with seq_cst (default)

### Common Pitfalls

- Using relaxed for cross-thread coordination — relaxed atomicity guarantees no tearing but NOT visibility of other writes; use release/acquire or seq_cst for ordering.
- False sharing — two threads writing fields on the same cache line destroy scalability; pad with alignas(64) or use separate allocations.
- ABA in lock-free CAS loops — value goes A->B->A, fooling CAS; use tagged pointers (version counter) or hazard pointers / RCU.
- Assuming volatile == atomic — volatile in C++ is for memory-mapped I/O, not thread synchronization; use std::atomic.
- Writing lock-free code when mutex would do — lock-free is exponentially harder to get right; measure first, optimize only with evidence.

### Real-World Applications

- LMAX Disruptor (Java, but inspired C++ lock-free ring buffers) uses cache-line padding (false-sharing avoidance) for sub-microsecond latency.
- Folly's AtomicHashMap and HazPtr-enabled lock-free queues power Facebook's real-time infrastructure.
- Intel's TBB (Threading Building Blocks) provides concurrent_hash_map and concurrent_queue using fine-grained locking and lock-free paths.
- HFT trading firms (Jane Street, Citadel Securities) use seq_cst minimally, prefer acq_rel + cache-line alignment for hot paths.

### Interview Questions

- 1. What is the C++ memory model? — A set of rules defining when cross-thread reads/writes are visible and ordered; without synchronization, most accesses are data races (UB).
- 2. What's the difference between seq_cst and acq_rel? — seq_cst provides a single global total order of all atomic operations; acq_rel only pairs release stores with acquire loads, allowing more reordering but better performance.
- 3. What is false sharing? — Two threads writing different fields on the same cache line cause cache-coherence thrashing; pad with alignas(64) so each thread's data is on its own line.
- 4. What is the ABA problem? — A value changes A->B->A, fooling a CAS into thinking nothing changed; solve with version tags, hazard pointers, or epoch-based reclamation (RCU).
- 5. Why is volatile not a substitute for atomic? — volatile only prevents compiler caching for memory-mapped I/O; it provides no atomicity, no memory ordering, and no thread synchronization.

### Mini Project

Build a Lock-Free SPSC Ring Buffer: A single-producer single-consumer ring buffer using std::atomic with acquire/release semantics — the simplest safe lock-free structure. Suggested approach:
  - Buffer<T, N> with T slots_[N], atomic<size_t> head_, atomic<size_t> tail_
  - Producer: read tail_ (acquire); if full, return false; write slot; head_.store(new_head, release)
  - Consumer: read head_ (acquire); if empty, return nullopt; read slot; tail_.store(new_tail, release)
  - Use power-of-2 N for modulo via bitmask
  - Benchmark against a mutex-protected queue

### Exercises

1. Build a counter with std::atomic<int>; have 8 threads increment 1M times each; verify the final value is 8M.
2. Implement acquire/release message passing between two threads; verify the consumer always sees the producer's payload.
3. Build a struct with two std::atomic<int> fields adjacent in memory; benchmark with and without alignas(64).
4. Implement a lock-free stack push() (CAS loop); note the ABA risk in pop() and explain why pop() is harder.
5. Use std::atomic_ref<T> to atomically access a non-atomic int from multiple threads; verify no lost updates.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the default memory ordering for std::atomic operations?
9. A) relaxed
10. B) seq_cst (*)
11. C) acquire
12. D) release
13. Explanation: The default is std::memory_order_seq_cst — the strongest, providing a single global total order. It's easiest to reason about but slowest.
14. Q2: What does std::memory_order_relaxed guarantee?
15. A) Atomicity + acquire/release
16. B) Sequential consistency
17. C) Atomicity only — no ordering or visibility of other ops (*)
18. D) Nothing
19. Explanation: relaxed guarantees atomicity (no tearing) but no ordering or visibility of other memory operations; safe for counters but not for coordination.
20. Q3: What is false sharing?
21. A) Sharing a mutex
22. B) Sharing an atomic
23. C) Sharing a pointer
24. D) Two threads writing different fields on the same cache line — coherence thrash (*)
25. Explanation: Adjacent fields share a cache line; writes by either thread invalidate the line for the other, destroying scalability. Fix with alignas(64).
26. Q4: Which memory ordering pair establishes a happens-before edge?
27. A) release (store) / acquire (load) of the same atomic (*)
28. B) relaxed / relaxed
29. C) seq_cst / relaxed
30. D) acquire / acquire
31. Explanation: A release store synchronizes with a subsequent acquire load of the same atomic, creating a happens-before edge that makes prior writes visible.
32. Q5: What is the ABA problem?
33. A) A bug in atomics
34. B) A value changes A->B->A, fooling CAS into thinking nothing changed (*)
35. C) A race condition
36. D) A deadlock
37. Explanation: CAS reads A, computes new value, then CAS-checks A; if another thread changed A->B->A in between, CAS succeeds but the assumption (nothing changed) is wrong.
38. Q6: Why is volatile not a substitute for atomic?
39. A) volatile is slower
40. B) volatile is deprecated
41. C) volatile provides no atomicity, ordering, or synchronization (*)
42. D) volatile is the same as atomic
43. Explanation: volatile only prevents compiler caching of memory accesses (for memory-mapped I/O); it has no atomicity, no memory ordering, and no thread-safety semantics.
44. Q7: What does std::atomic_ref<T> (C++20) enable?
45. A) Atomic access to a const variable
46. B) A reference that is atomic
47. C) A weak pointer
48. D) Atomic access to a non-atomic variable (*)
49. Explanation: std::atomic_ref<T> wraps an existing non-atomic T to provide atomic access; the underlying object must outlive all atomic_refs and all other accesses must be through them.
50. Q8: Which is the strongest memory ordering?
51. A) seq_cst (*)
52. B) acquire
53. C) release
54. D) acq_rel
55. Explanation: seq_cst (sequentially consistent) provides a single global total order of all seq_cst operations across all threads; it's the strongest but slowest.
56. Q9: Why is lock-free programming difficult?
57. A) It is slower
58. B) ABA, memory reclamation, and subtle ordering bugs are hard (*)
59. C) It is not allowed
60. D) It requires a special compiler
61. Explanation: Lock-free code must handle ABA, safe memory reclamation (hazard pointers, RCU), and exact memory orderings; the failure modes are subtle and intermittent.
62. Q10: When should you prefer mutex over lock-free?
63. A) Never
64. B) Always
65. C) When you haven't measured a need for lock-free — mutex is simpler and often fast enough (*)
66. D) Only in single-threaded code
67. Explanation: Lock-free is exponentially harder to get right; mutex + condvar is simpler and usually fast enough. Measure first; go lock-free only with evidence.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the default memory ordering for std::atomic operations?
  options:
    - relaxed
    - seq_cst
    - acquire
    - release
  correctIndex: 1
  explanation: The default is std::memory_order_seq_cst — the strongest, providing a single global total order. It's easiest to reason about but slowest.
- id: q2
  question: What does std::memory_order_relaxed guarantee?
  options:
    - Atomicity + acquire/release
    - Sequential consistency
    - Atomicity only — no ordering or visibility of other ops
    - Nothing
  correctIndex: 2
  explanation: relaxed guarantees atomicity (no tearing) but no ordering or visibility of other memory operations; safe for counters but not for coordination.
- id: q3
  question: What is false sharing?
  options:
    - Sharing a mutex
    - Sharing an atomic
    - Sharing a pointer
    - Two threads writing different fields on the same cache line — coherence thrash
  correctIndex: 3
  explanation: Adjacent fields share a cache line; writes by either thread invalidate the line for the other, destroying scalability. Fix with alignas(64).
- id: q4
  question: Which memory ordering pair establishes a happens-before edge?
  options:
    - release (store) / acquire (load) of the same atomic
    - relaxed / relaxed
    - seq_cst / relaxed
    - acquire / acquire
  correctIndex: 0
  explanation: A release store synchronizes with a subsequent acquire load of the same atomic, creating a happens-before edge that makes prior writes visible.
- id: q5
  question: What is the ABA problem?
  options:
    - A bug in atomics
    - A value changes A->B->A, fooling CAS into thinking nothing changed
    - A race condition
    - A deadlock
  correctIndex: 1
  explanation: CAS reads A, computes new value, then CAS-checks A; if another thread changed A->B->A in between, CAS succeeds but the assumption (nothing changed) is wrong.
- id: q6
  question: Why is volatile not a substitute for atomic?
  options:
    - volatile is slower
    - volatile is deprecated
    - volatile provides no atomicity, ordering, or synchronization
    - volatile is the same as atomic
    - ; it has no atomicity, no memory ordering, and no thread-safety semantics.
  correctIndex: 2
  explanation: volatile only prevents compiler caching of memory accesses (for memory-mapped I/O); it has no atomicity, no memory ordering, and no thread-safety semantics.
- id: q7
  question: What does std::atomic_ref<T> (C++20) enable?
  options:
    - Atomic access to a const variable
    - A reference that is atomic
    - A weak pointer
    - Atomic access to a non-atomic variable
  correctIndex: 3
  explanation: std::atomic_ref<T> wraps an existing non-atomic T to provide atomic access; the underlying object must outlive all atomic_refs and all other accesses must be through them.
- id: q8
  question: Which is the strongest memory ordering?
  options:
    - seq_cst
    - acquire
    - release
    - acq_rel
  correctIndex: 0
  explanation: seq_cst (sequentially consistent) provides a single global total order of all seq_cst operations across all threads; it's the strongest but slowest.
- id: q9
  question: Why is lock-free programming difficult?
  options:
    - It is slower
    - ABA, memory reclamation, and subtle ordering bugs are hard
    - It is not allowed
    - It requires a special compiler
    - ", and exact memory orderings; the failure modes are subtle and intermittent."
  correctIndex: 1
  explanation: Lock-free code must handle ABA, safe memory reclamation (hazard pointers, RCU), and exact memory orderings; the failure modes are subtle and intermittent.
- id: q10
  question: When should you prefer mutex over lock-free?
  options:
    - Never
    - Always
    - When you haven't measured a need for lock-free — mutex is simpler and often fast enough
    - Only in single-threaded code
  correctIndex: 2
  explanation: Lock-free is exponentially harder to get right; mutex + condvar is simpler and usually fast enough. Measure first; go lock-free only with evidence.
```

