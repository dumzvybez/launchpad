---
slug: rust-async-await-tokio
id: rust-18
track: rust
order: 18
title: async/await and Tokio
description: Write async functions, drive futures with Tokio, use `tokio::spawn`, and learn the pitfalls of `Send` bounds, blocking, and cancellation.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ygL_xcavzQ4&t=9000s
whyItMatters: Write async functions, drive futures with Tokio, use `tokio::spawn`, and learn the pitfalls of `Send` bounds, blocking, and cancellation.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# async/await and Tokio

## async/await and Tokio

### Why It Matters

Write async functions, drive futures with Tokio, use `tokio::spawn`, and learn the pitfalls of `Send` bounds, blocking, and cancellation.

Write async functions, drive futures with Tokio, use `tokio::spawn`, and learn the pitfalls of `Send` bounds, blocking, and cancellation.

### Prerequisites

- Stage 17: Concurrency
- Stage 15: Closures and Iterators

### Topics

- `async fn` and `Future` trait
- `.await` points and the state machine transformation
- `tokio::main` macros (single-threaded `current_thread` vs multi-thread)
- `tokio::spawn` and `JoinHandle`
- `tokio::sync::mpsc`, `oneshot`, `broadcast` channels
- `tokio::sync::Mutex` vs `std::sync::Mutex`
- Async-aware I/O: `tokio::fs`, `tokio::net`, `tokio::io`
- `select!` for racing futures
- Blocking in async: `tokio::task::spawn_blocking` for CPU/legacy code
- Cancellation safety: dropping a future cancels it mid-`.await`

### Key Concepts

- `async fn` returns a `Future` — a state machine; nothing runs until you `.await` or spawn it.
- Tokio is a multi-threaded async runtime; `#[tokio::main]` is the entry point macro.
- `.await` yields control back to the runtime, allowing other tasks to run.
- A future is `Send` if all data held across `.await` points is `Send`; required for `tokio::spawn` on the multi-threaded runtime.
- Blocking calls (`std::thread::sleep`, `std::fs::read`, `reqwest::blocking`) in async starve the runtime; wrap them in `spawn_blocking`.

```rust
#[tokio::main]
async fn main() {
    let result = fetch_value().await;
    println!("got {result}");
}

async fn fetch_value() -> i32 {
    tokio::time::sleep(std::time::Duration::from_millis(50)).await;
    42
}
```
Caption: Basic async/await

### Common Pitfalls

- Calling `std::thread::sleep` or `std::fs::read` in async — blocks the executor thread; use `tokio::time::sleep` and `tokio::fs::read`.
- Holding a `std::sync::Mutex` guard across `.await` — risks deadlock and blocks the runtime; use `tokio::sync::Mutex` or scope the guard tightly.
- Forgetting `Send` bounds on a future spawned with `tokio::spawn` on multi-threaded runtime — compiler errors with "future is not Send".
- Treating `?` in async fn as panic-safe — `?` still propagates `Err`; combine with proper error handling.
- Cancellation unsafety — dropping a future mid-`.await` may leave shared state inconsistent; design cancellation-safe code (no half-updates).

### Real-World Applications

- `reqwest` is the standard async HTTP client, built on `hyper` and Tokio.
- `axum` is a Tokio-based web framework from the Tokio team, used at Cloudflare and others.
- `sqlx` is an async SQL client supporting compile-time query checking, built on Tokio.
- Discord's gateway client runs on Tokio; it processes millions of WebSocket events per second across many tasks.

### Interview Questions

- 1. What is a `Future` in Rust? — A state machine that may not be ready; `poll` is called by the runtime; nothing runs until awaited or spawned.
- 2. Why does Tokio require `Send` futures on the multi-threaded runtime? — Tasks can be moved between worker threads; data held across `.await` must be `Send`.
- 3. What does `tokio::task::spawn_blocking` do? — Offloads blocking work to a dedicated thread pool, freeing async workers.
- 4. What's the difference between `std::sync::Mutex` and `tokio::sync::Mutex`? — `tokio::sync::Mutex` is async-aware (the `.await` for the lock yields); use std `Mutex` for short critical sections without `.await`.
- 5. What is cancellation safety? — A future is cancellation-safe if dropping it at any `.await` point leaves shared state consistent; required for `select!` branches.

### Mini Project

Build an Async URL Fetcher: Read URLs from argv, fetch each concurrently with `reqwest`, and print status codes. Suggested approach:
  - Add `tokio` and `reqwest` to `Cargo.toml`
  - `#[tokio::main] async fn main()`
  - Build a `Vec<JoinHandle<Result<StatusCode, _>>>` via `tokio::spawn`
  - `join_all` or `join!` to await all
  - Print each URL with its status code

### Exercises

1. Write an `async fn` that sleeps for 100ms and returns a number; call it from `main`.
2. Spawn two tasks that each print and yield; join them with `tokio::join!`.
3. Send integers from a spawned task to main via `tokio::sync::mpsc`.
4. Use `tokio::select!` to race a timeout against an HTTP fetch.
5. Trigger a "future is not Send" error by holding `Rc` across `.await`; fix with `Arc`.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `async fn` return?
9. A) The return value directly
10. B) A `Future` that produces the return value when awaited (*)
11. C) A thread
12. D) An iterator
13. Explanation: `async fn` returns an anonymous `Future` type; nothing runs until you `.await` or spawn it on a runtime.
14. Q2: Which crate is the most common async runtime?
15. A) async-std
16. B) futures
17. C) tokio (*)
18. D) smol
19. Explanation: Tokio is the dominant async runtime; `#[tokio::main]` is the canonical entry point.
20. Q3: What does `.await` do?
21. A) Blocks the thread until the future is ready
22. B) Panics on pending
23. C) Spawns a thread
24. D) Yields control to the runtime if the future isn't ready (*)
25. Explanation: `.await` polls the future; if `Pending`, it yields back to the runtime so other tasks can run.
26. Q4: What happens if you call `std::thread::sleep` inside an async fn?
27. A) Blocks the executor thread, starving other tasks (*)
28. B) Nothing wrong
29. C) Panics
30. D) Compiles but does nothing
31. Explanation: Blocking calls don't yield; the executor thread can't run other tasks. Use `tokio::time::sleep`.
32. Q5: Why does `tokio::spawn` (multi-threaded) require `Send + 'static` futures?
33. A) For performance
34. B) Tasks can move between worker threads; data held across `.await` must be `Send` (*)
35. C) It doesn't — only `Sync` is required
36. D) To prevent deadlocks
37. Explanation: The multi-threaded runtime steals tasks across workers; a future containing non-`Send` data (like `Rc`) can't be moved.
38. Q6: Which function offloads blocking work to a dedicated thread pool?
39. A) `tokio::spawn`
40. B) `tokio::task::yield_now`
41. C) `tokio::task::spawn_blocking` (*)
42. D) `tokio::block_in_place`
43. Explanation: `spawn_blocking` runs a blocking closure on a separate thread pool, freeing async workers.
44. Q7: Which `select!` branch wins if both futures are ready?
45. A) Both run
46. B) The first one listed
47. C) The last one listed
48. D) One is chosen pseudo-randomly (since 1.45+) to avoid starvation (*)
49. Explanation: `tokio::select!` randomizes ready branches to avoid starving low-priority arms; one branch is picked.
50. Q8: Why prefer `tokio::sync::Mutex` over `std::sync::Mutex` for long critical sections?
51. A) It's async-aware — `.await`-ing the lock yields instead of blocking the runtime (*)
52. B) It's faster
53. C) It's automatically reentrant
54. D) It avoids poisoning
55. Explanation: `tokio::sync::Mutex::lock().await` yields while waiting; `std::sync::Mutex::lock()` blocks the thread. For short non-`.await` sections, std is fine.
56. Q9: What does dropping a future mid-`.await` do?
57. A) Panics
58. B) Cancels the future silently — its state is discarded (*)
59. C) Continues in the background
60. D) Deadlocks
61. Explanation: Dropping a future cancels it; this is how `select!` cancels losing branches. Code must be cancellation-safe.
62. Q10: Which macro is the entry point for a Tokio application?
63. A) `#[async_main]`
64. B) `#[tokio_runtime]`
65. C) `#[tokio::main]` (*)
66. D) `#[async_std::main]`
67. Explanation: `#[tokio::main]` wraps `fn main` to set up and run the Tokio runtime; it can take args like `flavor = "current_thread"`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `async fn` return?
  options:
    - The return value directly
    - A `Future` that produces the return value when awaited
    - A thread
    - An iterator
  correctIndex: 1
  explanation: "`async fn` returns an anonymous `Future` type; nothing runs until you `.await` or spawn it on a runtime."
- id: q2
  question: Which crate is the most common async runtime?
  options:
    - async-std
    - futures
    - tokio
    - smol
  correctIndex: 2
  explanation: Tokio is the dominant async runtime; `#[tokio::main]` is the canonical entry point.
- id: q3
  question: What does `.await` do?
  options:
    - Blocks the thread until the future is ready
    - Panics on pending
    - Spawns a thread
    - Yields control to the runtime if the future isn't ready
  correctIndex: 3
  explanation: "`.await` polls the future; if `Pending`, it yields back to the runtime so other tasks can run."
- id: q4
  question: What happens if you call `std::thread::sleep` inside an async fn?
  options:
    - Blocks the executor thread, starving other tasks
    - Nothing wrong
    - Panics
    - Compiles but does nothing
  correctIndex: 0
  explanation: Blocking calls don't yield; the executor thread can't run other tasks. Use `tokio::time::sleep`.
- id: q5
  question: Why does `tokio::spawn` (multi-threaded) require `Send + 'static` futures?
  options:
    - For performance
    - Tasks can move between worker threads; data held across `.await` must be `Send`
    - It doesn't — only `Sync` is required
    - To prevent deadlocks
  correctIndex: 1
  explanation: The multi-threaded runtime steals tasks across workers; a future containing non-`Send` data (like `Rc`) can't be moved.
- id: q6
  question: Which function offloads blocking work to a dedicated thread pool?
  options:
    - "`tokio::spawn`"
    - "`tokio::task::yield_now`"
    - "`tokio::task::spawn_blocking`"
    - "`tokio::block_in_place`"
  correctIndex: 2
  explanation: "`spawn_blocking` runs a blocking closure on a separate thread pool, freeing async workers."
- id: q7
  question: Which `select!` branch wins if both futures are ready?
  options:
    - Both run
    - The first one listed
    - The last one listed
    - One is chosen pseudo-randomly (since 1.45+) to avoid starvation
  correctIndex: 3
  explanation: "`tokio::select!` randomizes ready branches to avoid starving low-priority arms; one branch is picked."
- id: q8
  question: Why prefer `tokio::sync::Mutex` over `std::sync::Mutex` for long critical sections?
  options:
    - It's async-aware — `.await`-ing the lock yields instead of blocking the runtime
    - It's faster
    - It's automatically reentrant
    - It avoids poisoning
  correctIndex: 0
  explanation: "`tokio::sync::Mutex::lock().await` yields while waiting; `std::sync::Mutex::lock()` blocks the thread. For short non-`.await` sections, std is fine."
- id: q9
  question: What does dropping a future mid-`.await` do?
  options:
    - Panics
    - Cancels the future silently — its state is discarded
    - Continues in the background
    - Deadlocks
  correctIndex: 1
  explanation: Dropping a future cancels it; this is how `select!` cancels losing branches. Code must be cancellation-safe.
- id: q10
  question: Which macro is the entry point for a Tokio application?
  options:
    - "`#[async_main]`"
    - "`#[tokio_runtime]`"
    - "`#[tokio::main]`"
    - "`#[async_std::main]`"
  correctIndex: 2
  explanation: '`#[tokio::main]` wraps `fn main` to set up and run the Tokio runtime; it can take args like `flavor = "current_thread"`.'
```

