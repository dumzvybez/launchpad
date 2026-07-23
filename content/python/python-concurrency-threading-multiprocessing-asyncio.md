---
slug: python-concurrency-threading-multiprocessing-asyncio
id: python-17
track: python
order: 17
title: Concurrency — Threading, Multiprocessing, and asyncio
description: Run code in parallel with threading, multiprocessing, and asyncio — and learn exactly when to use each (the GIL makes this a critical decision in Python).
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=19100s
whyItMatters: Run code in parallel with threading, multiprocessing, and asyncio — and learn exactly when to use each (the GIL makes this a critical decision in Python).
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Concurrency — Threading, Multiprocessing, and asyncio

## Concurrency — Threading, Multiprocessing, and asyncio

### Why It Matters

Run code in parallel with threading, multiprocessing, and asyncio — and learn exactly when to use each (the GIL makes this a critical decision in Python).

Run code in parallel with threading, multiprocessing, and asyncio — and learn exactly when to use each (the GIL makes this a critical decision in Python).

### Prerequisites

- Stage 16: Debugging, Logging, and Profiling
- Stage 8: Comprehensions and Generators (for async generators).

### Topics

- The GIL (Global Interpreter Lock) — what it is and isn't
- threading: Thread, Lock, RLock, Condition, Event
- multiprocessing: Process, Pool, Queue, Pipe
- concurrent.futures: ThreadPoolExecutor, ProcessPoolExecutor
- asyncio: async/await, coroutines, tasks, gather, wait
- I/O-bound vs CPU-bound — when to use threading/asyncio vs multiprocessing
- Thread safety and the queue module
- Daemon threads and graceful shutdown

### Key Concepts

- The GIL prevents multiple threads from executing Python bytecode simultaneously — threading helps I/O-bound work, NOT CPU-bound.
- For CPU-bound work (number crunching), use multiprocessing to bypass the GIL with separate processes.
- asyncio is single-threaded cooperative concurrency — great for thousands of idle I/O connections (HTTP, DB).
- Threads share memory (need locks); processes don't (need queues/pipes).
- `async def` defines a coroutine; you must `await` it; calling it directly returns a coroutine object, not the result.

```python
import threading, time, requests

def fetch(url, results, idx):
    r = requests.get(url, timeout=5)
    results[idx] = r.status_code

urls = ["https://httpbin.org/get"] * 10
results = [None] * len(urls)
threads = [threading.Thread(target=fetch, args=(url, results, i)) for i, url in enumerate(urls)]
for t in threads: t.start()
for t in threads: t.join()
print(results)   # [200, 200, ..., 200] — concurrent HTTP
```
Caption: threading — I/O-bound

### Common Pitfalls

- GIL misconception — thinking threads speed up CPU-bound work; they don't (only one thread runs Python at a time). Use multiprocessing.
- Shared mutable state without locks — `counter += 1` is NOT atomic; multiple threads will lose updates. Use a Lock or queue.
- Calling blocking code in async functions — `time.sleep`, `requests.get`, or any blocking I/O freezes the entire event loop; use async libs (aiohttp, asyncio.sleep).
- Forgetting `if __name__ == "__main__":` with multiprocessing on Windows — required because Windows re-imports the module in each child process.
- Daemon threads killed mid-work — daemon threads are abruptly terminated at interpreter shutdown; don't use them for critical cleanup.

### Real-World Applications

- Instagram uses asyncio in some microservices for high-concurrency fan-out (likes, comments).
- Netflix uses multiprocessing in its encoding pipeline to parallelize video transcoding across CPU cores.
- Dropbox uses threading in its desktop client for non-blocking UI during sync.
- Reddit uses asyncio (aiohttp) for its real-time WebSocket services handling millions of concurrent connections.

### Interview Questions

- 1. What is the GIL? — Global Interpreter Lock; prevents multiple threads from running Python bytecode simultaneously in CPython.
- 2. When would you use threading vs multiprocessing? — Threading for I/O-bound (network/disk); multiprocessing for CPU-bound (math, image processing).
- 3. What is asyncio? — Single-threaded cooperative concurrency via async/await; great for thousands of idle I/O connections.
- 4. What's wrong with calling time.sleep in an async function? — It blocks the entire event loop; use asyncio.sleep to yield control.
- 5. How do you make counter += 1 thread-safe? — Use a threading.Lock around it, or an atomic primitive like queue.Queue.

### Mini Project

Build a Concurrent Web Scraper: A CLI that fetches N URLs concurrently using threading, multiprocessing, and asyncio variants — and benchmarks each. Suggested approach:
  - Implement three scraper functions (threaded, multiprocessing, async)
  - Use requests for sync/threaded, aiohttp for async
  - Time each variant with time.perf_counter
  - Add a --mode flag to select which to run
  - Print a comparison table

### Exercises

1. Use threading to fetch 10 URLs concurrently and time it vs sequential.
2. Use multiprocessing.Pool to compute squares of 1M numbers in parallel.
3. Write an async function that fetches 10 URLs concurrently with aiohttp and asyncio.gather.
4. Demonstrate that `counter += 1` across threads loses updates; fix with a Lock.
5. Use queue.Queue to pass work between a producer thread and a consumer thread.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does the GIL prevent?
9. A) Multiple processes from running
10. B) Importing modules
11. C) Multiple threads from executing Python bytecode simultaneously (*)
12. D) Recursive function calls
13. Explanation: The Global Interpreter Lock in CPython allows only one thread to execute Python bytecode at a time; threads help I/O-bound, not CPU-bound.
14. Q2: Which is best for CPU-bound work (number crunching)?
15. A) threading
16. B) asyncio
17. C) yield
18. D) multiprocessing (*)
19. Explanation: Multiprocessing uses separate processes (each with its own GIL), so CPU-bound work parallelizes across cores; threads don't help CPU-bound in CPython.
20. Q3: Which is best for thousands of idle HTTP connections?
21. A) threading (1 thread per connection)
22. B) asyncio (*)
23. C) multiprocessing
24. D) Sequential
25. Explanation: asyncio is single-threaded cooperative — perfect for thousands of mostly-idle I/O connections; threads have ~8MB stack overhead each.
26. Q4: What does `async def f()` return when called?
27. A) A coroutine object (must be awaited to execute) (*)
28. B) The function's return value
29. C) A Future
30. D) A Task
31. Explanation: Calling an async function returns a coroutine object; you must await it (or schedule via asyncio.create_task) for it to execute.
32. Q5: What's wrong with time.sleep(1) inside an async function?
33. A) Nothing — it works fine
34. B) Raises RuntimeError
35. C) Blocks the entire event loop — use asyncio.sleep(1) (*)
36. D) Sleeps the wrong thread
37. Explanation: time.sleep is synchronous and blocks; asyncio.sleep is a coroutine that yields control back to the loop, allowing other tasks to run.
38. Q6: Why is `counter += 1` not thread-safe?
39. A) It's atomic
40. B) Only GIL-locked operations are safe
41. C) Counters can't be incremented in threads
42. D) It's read-modify-write (3 steps); threads can interleave and lose updates (*)
43. Explanation: += compiles to LOAD, ADD, STORE; a context switch between any two steps loses updates. Use a Lock or atomic primitive.
44. Q7: What's required for multiprocessing on Windows?
45. A) import multiprocessing at the top
46. B) `if __name__ == "__main__":` guard around the entry point (*)
47. C) Setting PYTHONPATH
48. D) Using Pool instead of Process
49. Explanation: Windows re-imports the main module in each child process; without the __main__ guard, child processes re-execute the spawn code and recurse.
50. Q8: What's a daemon thread?
51. A) A thread that runs in the background and is abruptly killed at interpreter shutdown (*)
52. B) A thread that can't be joined
53. C) A thread with elevated permissions
54. D) A thread that runs as root
55. Explanation: Daemon threads (t.daemon=True) are killed abruptly at shutdown; don't use them for work that needs graceful cleanup (file writes, DB commits).
56. Q9: Which is thread-safe WITHOUT a manual lock?
57. A) A list
58. B) A dict
59. C) queue.Queue (*)
60. D) A set
61. Explanation: queue.Queue is implemented with internal locks; .put and .get are safe to call from multiple threads. Lists/dicts/sets need external locks for compound operations.
62. Q10: What does asyncio.gather(*tasks) do?
63. A) Runs tasks sequentially
64. B) Returns the fastest result only
65. C) Cancels all tasks on first failure
66. D) Runs tasks concurrently and returns a list of results in submission order (*)
67. Explanation: gather schedules all coroutines concurrently and returns their results in the order they were passed (not completion order). On exception, default behavior raises immediately.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does the GIL prevent?
  options:
    - Multiple processes from running
    - Importing modules
    - Multiple threads from executing Python bytecode simultaneously
    - Recursive function calls
  correctIndex: 2
  explanation: The Global Interpreter Lock in CPython allows only one thread to execute Python bytecode at a time; threads help I/O-bound, not CPU-bound.
- id: q2
  question: Which is best for CPU-bound work (number crunching)?
  options:
    - threading
    - asyncio
    - yield
    - multiprocessing
    - ", so CPU-bound work parallelizes across cores; threads don't help CPU-bound in CPython."
  correctIndex: 3
  explanation: Multiprocessing uses separate processes (each with its own GIL), so CPU-bound work parallelizes across cores; threads don't help CPU-bound in CPython.
- id: q3
  question: Which is best for thousands of idle HTTP connections?
  options:
    - threading (1 thread per connection)
    - asyncio
    - multiprocessing
    - Sequential
  correctIndex: 1
  explanation: asyncio is single-threaded cooperative — perfect for thousands of mostly-idle I/O connections; threads have ~8MB stack overhead each.
- id: q4
  question: What does `async def f()` return when called?
  options:
    - A coroutine object (must be awaited to execute)
    - The function's return value
    - A Future
    - A Task
  correctIndex: 0
  explanation: Calling an async function returns a coroutine object; you must await it (or schedule via asyncio.create_task) for it to execute.
- id: q5
  question: What's wrong with time.sleep(1) inside an async function?
  options:
    - Nothing — it works fine
    - Raises RuntimeError
    - Blocks the entire event loop — use asyncio.sleep(1)
    - Sleeps the wrong thread
  correctIndex: 2
  explanation: time.sleep is synchronous and blocks; asyncio.sleep is a coroutine that yields control back to the loop, allowing other tasks to run.
- id: q6
  question: Why is `counter += 1` not thread-safe?
  options:
    - It's atomic
    - Only GIL-locked operations are safe
    - Counters can't be incremented in threads
    - It's read-modify-write (3 steps); threads can interleave and lose updates
  correctIndex: 3
  explanation: += compiles to LOAD, ADD, STORE; a context switch between any two steps loses updates. Use a Lock or atomic primitive.
- id: q7
  question: What's required for multiprocessing on Windows?
  options:
    - import multiprocessing at the top
    - '`if __name__ == "__main__":` guard around the entry point'
    - Setting PYTHONPATH
    - Using Pool instead of Process
  correctIndex: 1
  explanation: Windows re-imports the main module in each child process; without the __main__ guard, child processes re-execute the spawn code and recurse.
- id: q8
  question: What's a daemon thread?
  options:
    - A thread that runs in the background and is abruptly killed at interpreter shutdown
    - A thread that can't be joined
    - A thread with elevated permissions
    - A thread that runs as root
  correctIndex: 0
  explanation: Daemon threads (t.daemon=True) are killed abruptly at shutdown; don't use them for work that needs graceful cleanup (file writes, DB commits).
- id: q9
  question: Which is thread-safe WITHOUT a manual lock?
  options:
    - A list
    - A dict
    - queue.Queue
    - A set
  correctIndex: 2
  explanation: queue.Queue is implemented with internal locks; .put and .get are safe to call from multiple threads. Lists/dicts/sets need external locks for compound operations.
- id: q10
  question: What does asyncio.gather(*tasks) do?
  options:
    - Runs tasks sequentially
    - Returns the fastest result only
    - Cancels all tasks on first failure
    - Runs tasks concurrently and returns a list of results in submission order
  correctIndex: 3
  explanation: gather schedules all coroutines concurrently and returns their results in the order they were passed (not completion order). On exception, default behavior raises immediately.
```

