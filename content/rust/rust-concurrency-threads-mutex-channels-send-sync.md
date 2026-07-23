---
slug: rust-concurrency-threads-mutex-channels-send-sync
id: rust-17
track: rust
order: 17
title: Concurrency — threads, Mutex, channels, Send/Sync
description: Spawn threads, share state with `Arc<Mutex<T>>`, communicate via channels, and understand the `Send` and `Sync` marker traits.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ygL_xcavzQ4&t=7500s
whyItMatters: Spawn threads, share state with `Arc<Mutex<T>>`, communicate via channels, and understand the `Send` and `Sync` marker traits.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Concurrency — threads, Mutex, channels, Send/Sync

## Concurrency — threads, Mutex, channels, Send/Sync

### Why It Matters

Spawn threads, share state with `Arc<Mutex<T>>`, communicate via channels, and understand the `Send` and `Sync` marker traits.

Spawn threads, share state with `Arc<Mutex<T>>`, communicate via channels, and understand the `Send` and `Sync` marker traits.

### Prerequisites

- Stage 16: Smart Pointers
- Stage 15: Closures and Iterators

### Topics

- `std::thread::spawn` and `JoinHandle`
- `move` closures for thread captures
- `Arc<T>` for atomic shared ownership across threads
- `Mutex<T>` and `RwLock<T>` for thread-safe interior mutability
- `mpsc` channels: `tx.send()`, `rx.recv()`
- `crossbeam` channels (multi-producer, multi-consumer)
- `Send` and `Sync` marker traits and auto-derivation
- `scoped` threads (Rust 1.63+) for non-`'static` borrows
- Poisoned mutexes and how to recover
- Avoiding deadlocks: lock ordering and `std::sync::Mutex` non-reentrant design

### Key Concepts

- `thread::spawn` requires `FnOnce() + Send + 'static`; `move` captures are typical.
- `Arc<Mutex<T>>` is the canonical pattern for shared mutable state across threads.
- `Send` means a type can be transferred across threads; `Sync` means `&T` can be shared across threads.
- `Mutex` is NOT reentrant — calling `lock` twice from the same thread deadlocks.
- Scoped threads (`thread::scope`) let you spawn threads that borrow non-`'static` data, joining automatically at scope end.

```rust
use std::thread;

fn main() {
    let handle = thread::spawn(move || {
        for i in 0..5 { println!("thread: {i}"); }
    });
    for i in 0..5 { println!("main: {i}"); }
    handle.join().unwrap();
}
```
Caption: Spawn and join

### Common Pitfalls

- Forgetting `move` on a thread closure — borrows of locals can't satisfy `'static`; the compiler errors.
- Calling `Mutex::lock` twice on the same mutex from the same thread — deadlocks; `Mutex` is non-reentrant.
- Using `Rc` across threads — `Rc: !Send`; the compiler rejects `thread::spawn(move || rc...)`.
- Holding a `MutexGuard` across `.await` — risks deadlock and slows the runtime; prefer short critical sections (Stage 18).
- Ignoring mutex poisoning — `lock()` returns `Err` if a previous thread panicked while holding the lock; unwrap-or-recover deliberately.

### Real-World Applications

- `rayon` uses scoped threads and work-stealing to parallelize iterator chains (`par_iter`) across cores.
- `tokio` provides async-aware synchronization (`tokio::sync::Mutex`, `tokio::sync::mpsc`) for use across `.await` points.
- Servo's layout engine uses `Arc<RefCell<...>>` for single-threaded subtrees and `Arc<Mutex<...>>` for cross-thread sharing.
- Discord's Read States service uses `Arc<Mutex<HashMap<UserId, ReadState>>>` to share state across worker threads.

### Interview Questions

- 1. What's the difference between `Send` and `Sync`? — `Send` means a type can be moved across threads; `Sync` means `&T` can be shared across threads (i.e. `T: Sync` iff `&T: Send`).
- 2. Why is `Mutex` non-reentrant? — Reentrant locks are slower and error-prone; calling `lock` twice from the same thread deadlocks rather than returning a second guard.
- 3. What does `thread::scope` enable? — Spawning threads that borrow non-`'static` data, joining automatically at scope end — no need for `Arc` for read-only shared borrows.
- 4. Why does `Arc<Mutex<T>>` exist? — `Arc` for shared ownership across threads; `Mutex` for safe interior mutability; together they're the canonical shared-mutable-state pattern.
- 5. What is mutex poisoning? — When a thread panics while holding a `Mutex`, future `lock()` calls return `Err`; you choose to recover or propagate.

### Mini Project

Build a Parallel Word Counter: Read multiple files (paths from argv), spawn one thread per file, count word frequencies in each, and merge results via a channel. Suggested approach:
  - Spawn `thread::scope` per file (or raw `spawn` with `Arc<Mutex<HashMap>>`)
  - Each thread reads its file and builds a `HashMap<String, u32>`
  - Send maps over `mpsc::channel` to a merger thread
  - Merger combines into a final `HashMap`
  - Print top 10 most frequent words

### Exercises

1. Spawn a thread that prints numbers 1..5; join it from main.
2. Share a `Arc<Mutex<i32>>` counter across 10 threads, each incrementing; print the result.
3. Send integers from a producer thread to main via `mpsc::channel`.
4. Use `thread::scope` to mutate two slices of a `Vec` in parallel.
5. Trigger mutex poisoning by panicking in a thread holding a lock; observe `lock().is_err()`.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `thread::spawn` require of its closure?
9. A) `FnOnce() + Send + 'static` (*)
10. B) `Fn + Send + 'static`
11. C) `FnMut + Sync`
12. D) Just `Fn`
13. Explanation: Spawned threads run once (`FnOnce`), must be movable across threads (`Send`), and cannot borrow locals (`'static`).
14. Q2: Which pattern is canonical for shared mutable state across threads?
15. A) Rc<RefCell<T>>
16. B) Arc<Mutex<T>> (*)
17. C) Box<RefCell<T>>
18. D) Arc<RefCell<T>>
19. Explanation: `Arc` provides atomic shared ownership; `Mutex` provides thread-safe interior mutability; together they're the standard pattern.
20. Q3: What does `Send` mean?
21. A) The type can be shared by reference across threads
22. B) The type is async
23. C) The type can be moved across threads (*)
24. D) The type is cloneable
25. Explanation: `Send` types can be transferred by ownership across threads; `Sync` means `&T` can be shared (`T: Sync iff &T: Send`).
26. Q4: Why does `Rc<T>` fail to compile across threads?
27. A) It's not Clone
28. B) It implements Drop
29. C) It's too slow
30. D) `Rc: !Send` because its non-atomic counters would race (*)
31. Explanation: `Rc`'s counter operations are non-atomic; concurrent updates would corrupt the count. Use `Arc` for threads.
32. Q5: What does `thread::scope` enable?
33. A) Spawning threads that borrow non-`'static` data, auto-joined at scope end (*)
34. B) Global thread pools
35. C) Async tasks
36. D) Detached threads
37. Explanation: Scoped threads can borrow local data because they're guaranteed to join before the scope returns.
38. Q6: What happens if you call `Mutex::lock` twice from the same thread?
39. A) Returns the same guard
40. B) Deadlocks — `Mutex` is non-reentrant (*)
41. C) Panics
42. D) Returns Err
43. Explanation: `std::sync::Mutex` is non-reentrant; calling `lock` while holding the guard deadlocks the thread.
44. Q7: What is mutex poisoning?
45. A) Memory corruption
46. B) A GC phase
47. C) When a panicked thread leaves the mutex in a "poisoned" state; future `lock()` returns `Err` (*)
48. D) Lock contention
49. Explanation: A panic while holding the lock marks the mutex poisoned; `lock()` returns `Err(PoisonError)` to signal potentially-inconsistent state.
50. Q8: Which channel type does `std::sync::mpsc` provide?
51. A) Single-producer multi-consumer
52. B) Multi-producer multi-consumer
53. C) Single-producer single-consumer only
54. D) Multi-producer single-consumer (*)
55. Explanation: `mpsc` = multi-producer single-consumer; clone `tx` for multiple senders, single `rx` consumes.
56. Q9: What trait does `Mutex<T>` require of `T`?
57. A) `T: Send` (*)
58. B) `T: Sync`
59. C) `T: Clone`
60. D) `T: Copy`
61. Explanation: `Mutex<T>: Sync` requires `T: Send` — the mutex hands out mutable access by sending the guard across threads.
62. Q10: Why avoid holding a `std::sync::Mutex` guard across `.await`?
63. A) It's not allowed
64. B) Risks deadlock and blocks the executor; use `tokio::sync::Mutex` instead (*)
65. C) It leaks memory
66. D) It panics
67. Explanation: Standard `Mutex` guards aren't async-aware; holding across `.await` can deadlock the runtime. `tokio::sync::Mutex` is designed for this.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `thread::spawn` require of its closure?
  options:
    - "`FnOnce() + Send + 'static`"
    - "`Fn + Send + 'static`"
    - "`FnMut + Sync`"
    - Just `Fn`
  correctIndex: 0
  explanation: Spawned threads run once (`FnOnce`), must be movable across threads (`Send`), and cannot borrow locals (`'static`).
- id: q2
  question: Which pattern is canonical for shared mutable state across threads?
  options:
    - Rc<RefCell<T>>
    - Arc<Mutex<T>>
    - Box<RefCell<T>>
    - Arc<RefCell<T>>
  correctIndex: 1
  explanation: "`Arc` provides atomic shared ownership; `Mutex` provides thread-safe interior mutability; together they're the standard pattern."
- id: q3
  question: What does `Send` mean?
  options:
    - The type can be shared by reference across threads
    - The type is async
    - The type can be moved across threads
    - The type is cloneable
  correctIndex: 2
  explanation: "`Send` types can be transferred by ownership across threads; `Sync` means `&T` can be shared (`T: Sync iff &T: Send`)."
- id: q4
  question: Why does `Rc<T>` fail to compile across threads?
  options:
    - It's not Clone
    - It implements Drop
    - It's too slow
    - "`Rc: !Send` because its non-atomic counters would race"
  correctIndex: 3
  explanation: "`Rc`'s counter operations are non-atomic; concurrent updates would corrupt the count. Use `Arc` for threads."
- id: q5
  question: What does `thread::scope` enable?
  options:
    - Spawning threads that borrow non-`'static` data, auto-joined at scope end
    - Global thread pools
    - Async tasks
    - Detached threads
  correctIndex: 0
  explanation: Scoped threads can borrow local data because they're guaranteed to join before the scope returns.
- id: q6
  question: What happens if you call `Mutex::lock` twice from the same thread?
  options:
    - Returns the same guard
    - Deadlocks — `Mutex` is non-reentrant
    - Panics
    - Returns Err
  correctIndex: 1
  explanation: "`std::sync::Mutex` is non-reentrant; calling `lock` while holding the guard deadlocks the thread."
- id: q7
  question: What is mutex poisoning?
  options:
    - Memory corruption
    - A GC phase
    - When a panicked thread leaves the mutex in a "poisoned" state; future `lock()` returns `Err`
    - Lock contention
  correctIndex: 2
  explanation: A panic while holding the lock marks the mutex poisoned; `lock()` returns `Err(PoisonError)` to signal potentially-inconsistent state.
- id: q8
  question: Which channel type does `std::sync::mpsc` provide?
  options:
    - Single-producer multi-consumer
    - Multi-producer multi-consumer
    - Single-producer single-consumer only
    - Multi-producer single-consumer
  correctIndex: 3
  explanation: "`mpsc` = multi-producer single-consumer; clone `tx` for multiple senders, single `rx` consumes."
- id: q9
  question: What trait does `Mutex<T>` require of `T`?
  options:
    - "`T: Send`"
    - "`T: Sync`"
    - "`T: Clone`"
    - "`T: Copy`"
  correctIndex: 0
  explanation: "`Mutex<T>: Sync` requires `T: Send` — the mutex hands out mutable access by sending the guard across threads."
- id: q10
  question: Why avoid holding a `std::sync::Mutex` guard across `.await`?
  options:
    - It's not allowed
    - Risks deadlock and blocks the executor; use `tokio::sync::Mutex` instead
    - It leaks memory
    - It panics
  correctIndex: 1
  explanation: Standard `Mutex` guards aren't async-aware; holding across `.await` can deadlock the runtime. `tokio::sync::Mutex` is designed for this.
```

