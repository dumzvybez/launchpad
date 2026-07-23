---
slug: cpp-concurrency-std-thread-mutex-async-futures
id: cpp-14
track: cpp
order: 14
title: Concurrency — std::thread, mutex, async, futures
description: Learn std::thread, mutexes, std::lock_guard / std::unique_lock, std::async, std::future and std::promise, and the data-race and deadlock hazards of concurrent C++.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=650s
whyItMatters: Learn std::thread, mutexes, std::lock_guard / std::unique_lock, std::async, std::future and std::promise, and the data-race and deadlock hazards of concurrent C++.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# Concurrency — std::thread, mutex, async, futures

## Concurrency — std::thread, mutex, async, futures

### Why It Matters

Learn std::thread, mutexes, std::lock_guard / std::unique_lock, std::async, std::future and std::promise, and the data-race and deadlock hazards of concurrent C++.

Learn std::thread, mutexes, std::lock_guard / std::unique_lock, std::async, std::future and std::promise, and the data-race and deadlock hazards of concurrent C++.

### Prerequisites

- Stage 1-13 (especially RAII and smart pointers)

### Topics

- std::thread — creation, join, detach
- std::mutex, std::recursive_mutex, std::shared_mutex (C++17)
- std::lock_guard and std::unique_lock (RAII locking)
- std::scoped_lock (C++17) — lock multiple mutexes without deadlock
- std::async and std::launch policy
- std::future and std::promise
- std::packaged_task
- Data races and UB
- Deadlocks and lock ordering
- Thread sanitizers (-fsanitize=thread)

### Key Concepts

- A data race (two threads, one write, no synchronization) is undefined behavior — TSan catches it in testing.
- Always use RAII for locks: std::lock_guard or std::unique_lock; never unlock manually.
- Deadlock is prevented by consistent lock ordering or std::scoped_lock / std::lock for acquiring multiple locks atomically.
- std::async with std::launch::async runs on a new thread; without it, the implementation may defer.
- std::future::get() returns the result (or rethrows the stored exception); get() may be called once.
- Detached threads are hard to manage (no join); prefer joined threads, futures, or a thread pool.
- The C++ memory model (Stage 18) defines what concurrent reads/writes are legal.

```cpp
#include <mutex>
#include <vector>

class Counter {
public:
    void increment() {
        std::lock_guard<std::mutex> lk(mtx_);   // RAII lock
        ++value_;
    }
    int get() const {
        std::lock_guard<std::mutex> lk(mtx_);
        return value_;
    }
private:
    mutable std::mutex mtx_;
    int value_ = 0;
};
```
Caption: RAII locking with lock_guard

### Common Pitfalls

- Data race — two threads mutate without a lock; UB. The result may be torn reads, lost updates, or bizarre compiler optimizations. Always lock or use atomics.
- Deadlock from inconsistent lock ordering — Thread A locks m1 then m2; Thread B locks m2 then m1; use std::scoped_lock or a global lock order.
- Forgetting to join or detach a std::thread — std::terminate is called when a joinable thread is destroyed; always join, detach, or move it.
- Calling std::future::get() twice — UB (or throws std::future_error); get() consumes the shared state.
- Capturing a local by reference in a detached thread — the local may be destroyed before the thread reads it; use smart pointers or join the thread.

### Real-World Applications

- WebKit's parallel HTML parser uses a thread pool with std::mutex-protected work queues.
- Unreal Engine's task graph (FGraphEvent) is a dependency-aware thread pool abstracted over std::thread (and platform threads).
- Bloomberg's bdlmt::ThreadPool is heavily used in their infrastructure for async work; the design mirrors std::async + future.
- LLVM's parallel mode algorithms (std::execution::par) use std::thread internally for parallel transforms and reductions.

### Interview Questions

- 1. What is a data race? — Two or more threads access the same memory, at least one is a write, and no synchronization; this is undefined behavior in C++.
- 2. What's the difference between std::lock_guard and std::unique_lock? — lock_guard is the lightweight RAII lock; unique_lock adds the ability to lock/unlock/defer/move and is required for std::condition_variable.
- 3. How does std::scoped_lock prevent deadlock? — It uses a deadlock-avoidance algorithm (like std::lock) to acquire multiple mutexes atomically; you should never manually lock two mutexes in sequence.
- 4. What is std::async's default launch policy? — `std::launch::async | std::launch::deferred` — the implementation may run async OR defer until get(); pass `std::launch::async` explicitly for guaranteed new thread.
- 5. What happens if you destroy a joinable std::thread? — std::terminate is called; always join, detach, or move the thread before its destructor runs.

### Mini Project

Build a Parallel File Word Counter: A program that counts word frequencies across N files in parallel using std::async, then merges results under a mutex. Suggested approach:
  - Read N file paths from argv
  - Launch std::async(std::launch::async, count_words, path) per file
  - Each task returns std::unordered_map<std::string, int>
  - Use a mutex to merge maps into the global result (or merge sequentially after all get())
  - Print top 10 words; compare timing to single-threaded version

### Exercises

1. Write a counter with a missing lock; run under -fsanitize=thread and observe the data-race report.
2. Build a deadlock with two threads locking two mutexes in opposite orders; then fix it with std::scoped_lock.
3. Launch 100 std::async tasks and time them; explain why this is suboptimal (vs a thread pool).
4. Use std::promise<int> and std::future<int> to pass a value from a producer thread to a consumer thread.
5. Implement a thread-safe queue<T> using std::mutex + std::condition_variable (preview of Stage 18 lock-free).
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is a data race?
9. A) Two threads reading the same value
10. B) Two threads accessing the same memory, at least one writing, with no synchronization — UB (*)
11. C) A loop with a race condition
12. D) A bug in std::thread
13. Explanation: A data race is concurrent unsynchronized access with at least one writer; the C++ standard defines this as undefined behavior.
14. Q2: Which is the simplest RAII mutex wrapper?
15. A) std::unique_lock
16. B) std::scoped_lock
17. C) std::lock_guard (*)
18. D) std::mutex::lock
19. Explanation: std::lock_guard is the lightweight RAII lock — constructor locks, destructor unlocks. Use unique_lock when you need to defer/move/condition_variable.
20. Q3: What does std::scoped_lock do that manual locking cannot?
21. A) Lock faster
22. B) Skip locking
23. C) Use atomics
24. D) Acquire multiple mutexes deadlock-free via an avoidance algorithm (*)
25. Explanation: std::scoped_lock (C++17) uses a deadlock-avoidance algorithm to acquire multiple mutexes atomically; manually locking two in sequence risks deadlock.
26. Q4: What happens if you destroy a joinable std::thread?
27. A) std::terminate is called (*)
28. B) It is detached
29. C) It is joined
30. D) Nothing
31. Explanation: A joinable thread's destructor calls std::terminate; always join, detach, or move the thread before its destructor runs.
32. Q5: What is std::async's default launch policy?
33. A) std::launch::async only
34. B) std::launch::async | std::launch::deferred — implementation may defer (*)
35. C) std::launch::deferred only
36. D) No default
37. Explanation: The default is `async | deferred`; the implementation may defer execution until get() is called. Pass `std::launch::async` for guaranteed new thread.
38. Q6: How many times can you call std::future::get()?
39. A) Unlimited
40. B) Twice
41. C) Once — it consumes the shared state (*)
42. D) Never
43. Explanation: get() consumes the shared state; a second call is UB (or throws std::future_error). Use std::shared_future for multiple consumers.
44. Q7: What does std::future::get() do if the task threw an exception?
45. A) Returns a default value
46. B) Returns an error code
47. C) Calls std::terminate
48. D) Rethrows the stored exception (*)
49. Explanation: get() rethrows the exception stored by the async task, propagating it to the calling thread — this is how exceptions cross threads via futures.
50. Q8: Why is capturing a local by reference in a detached thread dangerous?
51. A) The local may be destroyed before the thread reads it — dangling reference (*)
52. B) It is slow
53. C) Detached threads cannot capture
54. D) References are not allowed
55. Explanation: A detached thread outlives the scope that created it; the captured local may be gone. Join instead, or capture by value (e.g., a shared_ptr).
56. Q9: Which is the deadlock-free way to lock two mutexes?
57. A) Lock m1 then m2 in both threads
58. B) Use std::scoped_lock(m1, m2) (*)
59. C) Lock m1 then m2 in one, m2 then m1 in the other (DEADLOCK)
60. D) Avoid mutexes
61. Explanation: std::scoped_lock uses a deadlock-avoidance algorithm to acquire both atomically; manual locking in opposite orders is the textbook deadlock.
62. Q10: What does std::condition_variable require?
63. A) A std::lock_guard
64. B) An atomic
65. C) A std::mutex and a std::unique_lock (*)
66. D) Nothing
67. Explanation: condition_variable::wait requires a std::unique_lock<std::mutex>; lock_guard doesn't expose lock/unlock so it won't compile.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is a data race?
  options:
    - Two threads reading the same value
    - Two threads accessing the same memory, at least one writing, with no synchronization — UB
    - A loop with a race condition
    - A bug in std::thread
  correctIndex: 1
  explanation: A data race is concurrent unsynchronized access with at least one writer; the C++ standard defines this as undefined behavior.
- id: q2
  question: Which is the simplest RAII mutex wrapper?
  options:
    - std::unique_lock
    - std::scoped_lock
    - std::lock_guard
    - std::mutex::lock
  correctIndex: 2
  explanation: std::lock_guard is the lightweight RAII lock — constructor locks, destructor unlocks. Use unique_lock when you need to defer/move/condition_variable.
- id: q3
  question: What does std::scoped_lock do that manual locking cannot?
  options:
    - Lock faster
    - Skip locking
    - Use atomics
    - Acquire multiple mutexes deadlock-free via an avoidance algorithm
  correctIndex: 3
  explanation: std::scoped_lock (C++17) uses a deadlock-avoidance algorithm to acquire multiple mutexes atomically; manually locking two in sequence risks deadlock.
- id: q4
  question: What happens if you destroy a joinable std::thread?
  options:
    - std::terminate is called
    - It is detached
    - It is joined
    - Nothing
  correctIndex: 0
  explanation: A joinable thread's destructor calls std::terminate; always join, detach, or move the thread before its destructor runs.
- id: q5
  question: What is std::async's default launch policy?
  options:
    - std::launch::async only
    - std::launch::async | std::launch::deferred — implementation may defer
    - std::launch::deferred only
    - No default
  correctIndex: 1
  explanation: The default is `async | deferred`; the implementation may defer execution until get() is called. Pass `std::launch::async` for guaranteed new thread.
- id: q6
  question: How many times can you call std::future::get()?
  options:
    - Unlimited
    - Twice
    - Once — it consumes the shared state
    - Never
  correctIndex: 2
  explanation: get() consumes the shared state; a second call is UB (or throws std::future_error). Use std::shared_future for multiple consumers.
- id: q7
  question: What does std::future::get() do if the task threw an exception?
  options:
    - Returns a default value
    - Returns an error code
    - Calls std::terminate
    - Rethrows the stored exception
  correctIndex: 3
  explanation: get() rethrows the exception stored by the async task, propagating it to the calling thread — this is how exceptions cross threads via futures.
- id: q8
  question: Why is capturing a local by reference in a detached thread dangerous?
  options:
    - The local may be destroyed before the thread reads it — dangling reference
    - It is slow
    - Detached threads cannot capture
    - References are not allowed
  correctIndex: 0
  explanation: A detached thread outlives the scope that created it; the captured local may be gone. Join instead, or capture by value (e.g., a shared_ptr).
- id: q9
  question: Which is the deadlock-free way to lock two mutexes?
  options:
    - Lock m1 then m2 in both threads
    - Use std::scoped_lock(m1, m2)
    - Lock m1 then m2 in one, m2 then m1 in the other (DEADLOCK)
    - Avoid mutexes
  correctIndex: 1
  explanation: std::scoped_lock uses a deadlock-avoidance algorithm to acquire both atomically; manual locking in opposite orders is the textbook deadlock.
- id: q10
  question: What does std::condition_variable require?
  options:
    - A std::lock_guard
    - An atomic
    - A std::mutex and a std::unique_lock
    - Nothing
  correctIndex: 2
  explanation: condition_variable::wait requires a std::unique_lock<std::mutex>; lock_guard doesn't expose lock/unlock so it won't compile.
```

