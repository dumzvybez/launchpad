---
slug: python-performance-memory-caching-optimization
id: python-18
track: python
order: 18
title: Performance — Memory, Caching, and Optimization
description: "Make Python faster and leaner — functools.lru_cache for memoization, __slots__ for memory, deque vs list, and the golden rule: profile before you optimize."
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=20300s
whyItMatters: "Make Python faster and leaner — functools. lru_cache for memoization, __slots__ for memory, deque vs list, and the golden rule: profile before you optimize."
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Performance — Memory, Caching, and Optimization

## Performance — Memory, Caching, and Optimization

### Why It Matters

Make Python faster and leaner — functools. lru_cache for memoization, __slots__ for memory, deque vs list, and the golden rule: profile before you optimize.

Make Python faster and leaner — functools.lru_cache for memoization, __slots__ for memory, deque vs list, and the golden rule: profile before you optimize.

### Prerequisites

- Stage 17: Concurrency — Threading, Multiprocessing, and asyncio
- Stage 16: Debugging, Logging, and Profiling.

### Topics

- Big-O refresher for Python operations (list vs set vs dict)
- functools.lru_cache and functools.cache (3.9+)
- Manual memoization patterns
- __slots__ for memory-efficient classes
- collections.deque vs list (O(1) vs O(n) at the front)
- Generators for streaming memory savings
- String concatenation: join vs +=
- numpy for vectorized math (10-100x over Python loops)
- Profiling-driven optimization workflow

### Key Concepts

- list.insert(0, x) and list.pop(0) are O(n); use collections.deque for O(1) at both ends.
- `x in list` is O(n); `x in set` and `x in dict` are O(1) average — convert once, query many times.
- @lru_cache(maxsize=128) memoizes a pure function's results — huge wins for recursive Fibonacci.
- __slots__ disables per-instance __dict__, saving ~40 bytes per instance (matters for millions of instances).
- "Measure, don't guess" — always profile before optimizing; your intuition about bottlenecks is usually wrong.

```python
from functools import lru_cache
import time

# Without cache — exponential time
def fib_slow(n):
    return n if n < 2 else fib_slow(n-1) + fib_slow(n-2)

# With cache — O(n)
@lru_cache(maxsize=None)
def fib_fast(n):
    return n if n < 2 else fib_fast(n-1) + fib_fast(n-2)

start = time.perf_counter()
print(fib_fast(100), time.perf_counter() - start)   # instant
print(fib_slow(35), time.perf_counter() - start)    # ~3 seconds

# Cache info
print(fib_fast.cache_info())   # CacheInfo(hits=97, misses=101, maxsize=None, currsize=101)
```
Caption: lru_cache

### Common Pitfalls

- Premature optimization — guessing at bottlenecks; always profile first with cProfile.
- Caching without invalidation — lru_cache on a function whose inputs are mutable or whose output depends on external state returns stale results.
- __slots__ with inheritance — subclasses must also define __slots__ (or they get a __dict__ back); mixing slots and non-slots is subtle.
- Using list for queues — pop(0)/insert(0, x) is O(n); use collections.deque for O(1) at both ends.
- `x in list` in hot loops — O(n) per check; convert to a set once for O(1) lookups.

### Real-World Applications

- Instagram uses lru_cache extensively to memoize permission checks per request.
- Netflix uses numpy for vectorized recommendation computations (10-100x over Python loops).
- Spotify uses __slots__ on its track-metadata classes to fit millions of songs in memory.
- Dropbox uses generators and streaming to handle file lists without loading everything into RAM.

### Interview Questions

- 1. What's the difference between list and deque? — list is O(n) at the front; deque is O(1) at both ends (doubly-linked list of blocks).
- 2. What does @lru_cache do? — Memoizes a function's results in an LRU cache; pure functions get huge speedups on repeated calls.
- 3. What's the time complexity of `x in list` vs `x in set`? — list is O(n); set is O(1) average (hashing).
- 4. What does __slots__ do? — Disables per-instance __dict__, saving memory at the cost of not allowing new attributes.
- 5. When should you NOT optimize? — Until you've profiled and identified a real bottleneck. "Premature optimization is the root of all evil."

### Mini Project

Build a Memoized Fibonacci Profiler: Compare naive recursive fib, lru_cache fib, iterative fib, and matrix-exponentiation fib — measuring time and peak memory for fib(30), fib(35), fib(40). Suggested approach:
  - Implement all four versions
  - Use timeit for wall-clock time
  - Use tracemalloc for peak memory
  - Print a Markdown comparison table
  - Add a --cache-size flag for lru_cache to test cache eviction impact

### Exercises

1. Write naive recursive fib and an lru_cache version; benchmark both.
2. Add __slots__ to a class and measure memory savings with sys.getsizeof.
3. Compare list.pop(0) vs deque.popleft() for 100,000 items.
4. Convert `x in large_list` to `x in set(large_list)` and benchmark.
5. Use numpy to compute element-wise squares of 1M numbers; compare to a list comprehension.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the time complexity of `x in list`?
9. A) O(n) (*)
10. B) O(log n)
11. C) O(1)
12. D) O(n^2)
13. Explanation: Lists are arrays; membership check scans element by element — O(n). Sets and dicts are O(1) average via hashing.
14. Q2: What does @lru_cache(maxsize=128) do?
15. A) Caches the function's source code
16. B) Memoizes up to 128 most recent call results, evicting least-recently-used (*)
17. C) Limits the function to 128 calls
18. D) Runs the function 128 times in parallel
19. Explanation: lru_cache memoizes results keyed by arguments; maxsize=N evicts the least-recently-used entry when full. maxsize=None for unbounded.
20. Q3: What does __slots__ do?
21. A) Makes attributes private
22. B) Speeds up method calls
23. C) Adds type checking
24. D) Disables per-instance __dict__, saving memory (*)
25. Explanation: __slots__ pre-declares allowed attributes and skips creating a per-instance __dict__, saving ~40 bytes per instance (matters for millions of objects).
26. Q4: Which is O(1) for pop(0)?
27. A) list
28. B) tuple
29. C) collections.deque (*)
30. D) str
31. Explanation: deque is a doubly-linked list of blocks — popleft() is O(1). list.pop(0) is O(n) because all elements shift.
32. Q5: What's the recommended approach before optimizing?
33. A) Profile first, then optimize the actual bottleneck (*)
34. B) Optimize everything
35. C) Ask the user
36. D) Use Cython everywhere
37. Explanation: "Premature optimization is the root of all evil" — profile (cProfile, timeit), find the real bottleneck, then optimize.
38. Q6: What's a danger of lru_cache?
39. A) It's slow
40. B) Returns stale results if the function depends on external/mutable state (*)
41. C) It leaks memory always
42. D) It only works on recursive functions
43. Explanation: lru_cache keys on arguments; if the function reads external state (time, files, globals) or mutates inputs, cached results become stale. Use on pure functions only.
44. Q7: Which is fastest for element-wise math on 1M numbers?
45. A) Python for loop
46. B) List comprehension
47. C) map() with lambda
48. D) numpy vectorized operations (*)
49. Explanation: numpy uses C-level vectorized operations (SIMD), 10-100x faster than Python loops for numeric arrays.
50. Q8: What's the trap with __slots__ and inheritance?
51. A) Subclasses can't have any attributes
52. B) __slots__ is inherited automatically
53. C) Subclasses must also define __slots__ or they get a __dict__ back (*)
54. D) __slots__ disables inheritance
55. Explanation: __slots__ only affects the class that defines it; subclasses inherit slots but also get a __dict__ unless they declare their own __slots__.
56. Q9: What's `x in set(targets)` vs `x in targets` (list)?
57. A) Set is O(1) average; list is O(n) — convert once, query many times (*)
58. B) Same speed
59. C) List is faster
60. D) Set can't be used in `in`
61. Explanation: Build the set once (O(n)) and do O(1) lookups; for many lookups, this is much faster than repeated O(n) list scans.
62. Q10: What's the recommended way to build a large string from chunks?
63. A) Repeated s += chunk
64. B) "".join(list_of_chunks) (*)
65. C) io.BytesIO
66. D) print() to a file
67. Explanation: += is O(n^2) (each concatenation rebuilds the string); join() builds the final string in one pass.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the time complexity of `x in list`?
  options:
    - O(n)
    - O(log n)
    - O(1)
    - O(n^2)
  correctIndex: 0
  explanation: Lists are arrays; membership check scans element by element — O(n). Sets and dicts are O(1) average via hashing.
- id: q2
  question: What does @lru_cache(maxsize=128) do?
  options:
    - Caches the function's source code
    - Memoizes up to 128 most recent call results, evicting least-recently-used
    - Limits the function to 128 calls
    - Runs the function 128 times in parallel
  correctIndex: 1
  explanation: lru_cache memoizes results keyed by arguments; maxsize=N evicts the least-recently-used entry when full. maxsize=None for unbounded.
- id: q3
  question: What does __slots__ do?
  options:
    - Makes attributes private
    - Speeds up method calls
    - Adds type checking
    - Disables per-instance __dict__, saving memory
  correctIndex: 3
  explanation: __slots__ pre-declares allowed attributes and skips creating a per-instance __dict__, saving ~40 bytes per instance (matters for millions of objects).
- id: q4
  question: Which is O(1) for pop(0)?
  options:
    - list
    - tuple
    - collections.deque
    - str
  correctIndex: 2
  explanation: deque is a doubly-linked list of blocks — popleft() is O(1). list.pop(0) is O(n) because all elements shift.
- id: q5
  question: What's the recommended approach before optimizing?
  options:
    - Profile first, then optimize the actual bottleneck
    - Optimize everything
    - Ask the user
    - Use Cython everywhere
  correctIndex: 0
  explanation: '"Premature optimization is the root of all evil" — profile (cProfile, timeit), find the real bottleneck, then optimize.'
- id: q6
  question: What's a danger of lru_cache?
  options:
    - It's slow
    - Returns stale results if the function depends on external/mutable state
    - It leaks memory always
    - It only works on recursive functions
  correctIndex: 1
  explanation: lru_cache keys on arguments; if the function reads external state (time, files, globals) or mutates inputs, cached results become stale. Use on pure functions only.
- id: q7
  question: Which is fastest for element-wise math on 1M numbers?
  options:
    - Python for loop
    - List comprehension
    - map() with lambda
    - numpy vectorized operations
    - ", 10-100x faster than Python loops for numeric arrays."
  correctIndex: 3
  explanation: numpy uses C-level vectorized operations (SIMD), 10-100x faster than Python loops for numeric arrays.
- id: q8
  question: What's the trap with __slots__ and inheritance?
  options:
    - Subclasses can't have any attributes
    - __slots__ is inherited automatically
    - Subclasses must also define __slots__ or they get a __dict__ back
    - __slots__ disables inheritance
  correctIndex: 2
  explanation: __slots__ only affects the class that defines it; subclasses inherit slots but also get a __dict__ unless they declare their own __slots__.
- id: q9
  question: What's `x in set(targets)` vs `x in targets` (list)?
  options:
    - Set is O(1) average; list is O(n) — convert once, query many times
    - Same speed
    - List is faster
    - Set can't be used in `in`
  correctIndex: 0
  explanation: Build the set once (O(n)) and do O(1) lookups; for many lookups, this is much faster than repeated O(n) list scans.
- id: q10
  question: What's the recommended way to build a large string from chunks?
  options:
    - Repeated s += chunk
    - '"".join(list_of_chunks)'
    - io.BytesIO
    - print() to a file
  correctIndex: 1
  explanation: += is O(n^2) (each concatenation rebuilds the string); join() builds the final string in one pass.
```

