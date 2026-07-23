---
slug: python-debugging-logging-profiling
id: python-16
track: python
order: 16
title: Debugging, Logging, and Profiling
description: Move beyond print() — use pdb for interactive debugging, the logging module for production-grade logs, and cProfile/tracemalloc to find slow spots and memory hogs.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=17900s
whyItMatters: Move beyond print() — use pdb for interactive debugging, the logging module for production-grade logs, and cProfile/tracemalloc to find slow spots and memory hogs.
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Debugging, Logging, and Profiling

## Debugging, Logging, and Profiling

### Why It Matters

Move beyond print() — use pdb for interactive debugging, the logging module for production-grade logs, and cProfile/tracemalloc to find slow spots and memory hogs.

Move beyond print() — use pdb for interactive debugging, the logging module for production-grade logs, and cProfile/tracemalloc to find slow spots and memory hogs.

### Prerequisites

- Stage 15: Testing — pytest, unittest, and TDD Basics
- Stage 12: Error Handling — Exceptions and Custom Errors.

### Topics

- print() vs logging — when to use each
- The logging module: getLogger, levels, handlers, formatters
- pdb: breakpoints, step, next, continue, p, pp
- breakpoint() builtin (3.7+) and PYTHONBREAKPOINT
- cProfile and pstats for CPU profiling
- timeit for micro-benchmarks
- tracemalloc for memory snapshots
- memory_profiler for line-by-line memory
- Structured logging with extra= fields and JSON formatters

### Key Concepts

- logging has 5 levels: DEBUG, INFO, WARNING, ERROR, CRITICAL — set the right level per environment.
- pdb drops you into a debugger at breakpoint() calls; commands: n (next), s (step), c (continue), p (print), l (list), q (quit).
- cProfile measures function call counts and time; pstats sorts and displays results.
- "Premature optimization is the root of all evil" — profile first, then optimize the hot path.
- logging is thread-safe but not async-safe by default; use queue-based handlers in async code.

```python
import logging

# Module-level logger (don't use root logger directly)
logger = logging.getLogger(__name__)

# Configure once at app entry point
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logger.debug("debug detail")        # not shown (level=INFO)
logger.info("user %s logged in", user_id)   # use %s, NOT f-string, for lazy formatting
logger.warning("disk usage at %d%%", 90)
logger.error("failed to send email", exc_info=True)   # includes traceback
logger.critical("database is down")
```
Caption: logging setup

### Common Pitfalls

- Using print() in production — no levels, no formatting, no easy routing to files/services; use logging.
- Using f-strings in log messages — `logger.info(f"hi {x}")` formats even when level is too low; use `logger.info("hi %s", x)` for lazy formatting.
- Logging in hot loops — produces gigabytes of logs and slows the app; sample or aggregate instead.
- Profiling without action — running cProfile is useless if you don't read pstats output and fix the top function.
- Configuring logging in library code — only the app entry point should configure handlers; libraries should just getLogger() and emit.

### Real-World Applications

- Instagram uses Python's logging extensively; structured JSON logs feed into Scuba for analysis.
- Netflix's Spinnaker uses Python logging with custom handlers that ship logs to Elasticsearch.
- Dropbox uses tracemalloc in CI to catch memory regressions in its sync engine.
- Spotify uses cProfile on its recommendation pipeline to find slow feature-extraction functions.

### Interview Questions

- 1. Why use logging instead of print? — Levels, timestamps, formatting, routing to files/services, lazy formatting, thread-safety.
- 2. What's the difference between logger.info(f"...") and logger.info("...", arg)? — f-string formats eagerly (even if level is too low); %s args are formatted lazily only if the message will be emitted.
- 3. What does breakpoint() do? — Drops into pdb (or your configured debugger) at that line; configurable via PYTHONBREAKPOINT.
- 4. How does cProfile work? — Instruments every function call to record count and time; produces a stats object you sort with pstats.
- 5. What's the first step before optimizing? — Profile! "Premature optimization is the root of all evil" — measure, then optimize the actual bottleneck.

### Mini Project

Build a Profiled Fibonacci Comparator: Compare three fib implementations (recursive, memoized with lru_cache, iterative) using timeit, cProfile, and tracemalloc. Output a comparison table. Suggested approach:
  - Define the three implementations in a module
  - Use timeit.timeit to measure wall-clock time for fib(30)
  - Use cProfile.Profile() to count function calls
  - Use tracemalloc to measure peak memory
  - Print a Markdown table comparing all three

### Exercises

1. Configure logging with a file handler and an INFO level; log a few messages.
2. Insert breakpoint() in a buggy function and step through with pdb.
3. Profile a slow function with cProfile and identify the top time-consuming call.
4. Use timeit to compare sum(range(1000)) vs reduce(operator.add, range(1000)).
5. Use tracemalloc to measure peak memory of building a list of 1M ints.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is the recommended way to log in production?
9. A) print() with redirection
10. B) sys.stdout.write
11. C) Writing to files directly
12. D) The logging module (*)
13. Explanation: logging gives levels, formatting, multiple handlers, thread-safety, and lazy formatting — print has none of these.
14. Q2: Why prefer `logger.info("hi %s", name)` over `logger.info(f"hi {name}")`?
15. A) Faster always
16. B) Lazy formatting — only formats if the message will actually be emitted (*)
17. C) It's required by PEP 8
18. D) f-strings don't work in logging
19. Explanation: With f-strings, the format happens before the level check, wasting CPU when INFO is disabled; %s defers formatting until needed.
20. Q3: What does breakpoint() do (Python 3.7+)?
21. A) Pauses the program for 1 second
22. B) Raises BreakpointException
23. C) Drops into pdb (or configured debugger) at that line (*)
24. D) Logs a debug message
25. Explanation: breakpoint() invokes sys.breakpointhook, which by default starts pdb; configurable via PYTHONBREAKPOINT env var.
26. Q4: Which tool profiles CPU time of function calls?
27. A) cProfile (*)
28. B) tracemalloc
29. C) memory_profiler
30. D) timeit (for individual lines)
31. Explanation: cProfile instruments every function call to count and time; pstats sorts/displays. tracemalloc is for memory.
32. Q5: Which tool measures peak memory allocation?
33. A) cProfile
34. B) timeit
35. C) pstats
36. D) tracemalloc (*)
37. Explanation: tracemalloc traces memory allocations and reports current/peak; memory_profiler gives line-by-line memory usage.
38. Q6: What are the five logging levels in order?
39. A) TRACE, INFO, WARN, ERROR, FATAL
40. B) DEBUG, INFO, WARNING, ERROR, CRITICAL (*)
41. C) DEBUG, LOG, WARN, ERROR, PANIC
42. D) INFO, DEBUG, WARN, ERR, CRIT
43. Explanation: Standard levels are DEBUG < INFO < WARNING < ERROR < CRITICAL; setting level=WARNING suppresses DEBUG and INFO.
44. Q7: Where should logging.basicConfig be called?
45. A) In every module
46. B) In library code
47. C) Once at the app entry point (*)
48. D) Inside each function
49. Explanation: Libraries should only getLogger() and emit; the application (not library) configures handlers/formatters at startup.
50. Q8: What does the pdb command `n` do?
51. A) Next line — don't step into functions (*)
52. B) Step into a function
53. C) Continue to next breakpoint
54. D) Print variables
55. Explanation: n (next) executes the current line and stops at the next line in the same frame; s (step) steps into function calls.
56. Q9: What's "premature optimization"?
57. A) Writing tests first
58. B) Optimizing too late
59. C) Using cProfile
60. D) Optimizing before profiling — guessing at bottlenecks (*)
61. Explanation: Knuth: "Premature optimization is the root of all evil." Profile first, then optimize the actual bottleneck.
62. Q10: What's a common pitfall with logging in hot loops?
63. A) Logs are too detailed
64. B) Produces gigabytes of logs and slows the app — sample or aggregate (*)
65. C) Logging doesn't work in loops
66. D) Logs are auto-throttled
67. Explanation: Logging inside tight loops (e.g. per-row in a billion-row ETL) generates massive logs and dominates runtime; sample (every N) or aggregate counters.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is the recommended way to log in production?
  options:
    - print() with redirection
    - sys.stdout.write
    - Writing to files directly
    - The logging module
  correctIndex: 3
  explanation: logging gives levels, formatting, multiple handlers, thread-safety, and lazy formatting — print has none of these.
- id: q2
  question: Why prefer `logger.info("hi %s", name)` over `logger.info(f"hi {name}")`?
  options:
    - Faster always
    - Lazy formatting — only formats if the message will actually be emitted
    - It's required by PEP 8
    - f-strings don't work in logging
  correctIndex: 1
  explanation: With f-strings, the format happens before the level check, wasting CPU when INFO is disabled; %s defers formatting until needed.
- id: q3
  question: What does breakpoint() do (Python 3.7+)?
  options:
    - Pauses the program for 1 second
    - Raises BreakpointException
    - Drops into pdb (or configured debugger) at that line
    - Logs a debug message
  correctIndex: 2
  explanation: breakpoint() invokes sys.breakpointhook, which by default starts pdb; configurable via PYTHONBREAKPOINT env var.
- id: q4
  question: Which tool profiles CPU time of function calls?
  options:
    - cProfile
    - tracemalloc
    - memory_profiler
    - timeit (for individual lines)
  correctIndex: 0
  explanation: cProfile instruments every function call to count and time; pstats sorts/displays. tracemalloc is for memory.
- id: q5
  question: Which tool measures peak memory allocation?
  options:
    - cProfile
    - timeit
    - pstats
    - tracemalloc
  correctIndex: 3
  explanation: tracemalloc traces memory allocations and reports current/peak; memory_profiler gives line-by-line memory usage.
- id: q6
  question: What are the five logging levels in order?
  options:
    - TRACE, INFO, WARN, ERROR, FATAL
    - DEBUG, INFO, WARNING, ERROR, CRITICAL
    - DEBUG, LOG, WARN, ERROR, PANIC
    - INFO, DEBUG, WARN, ERR, CRIT
  correctIndex: 1
  explanation: Standard levels are DEBUG < INFO < WARNING < ERROR < CRITICAL; setting level=WARNING suppresses DEBUG and INFO.
- id: q7
  question: Where should logging.basicConfig be called?
  options:
    - In every module
    - In library code
    - Once at the app entry point
    - Inside each function
  correctIndex: 2
  explanation: Libraries should only getLogger() and emit; the application (not library) configures handlers/formatters at startup.
- id: q8
  question: What does the pdb command `n` do?
  options:
    - Next line — don't step into functions
    - Step into a function
    - Continue to next breakpoint
    - Print variables
  correctIndex: 0
  explanation: n (next) executes the current line and stops at the next line in the same frame; s (step) steps into function calls.
- id: q9
  question: What's "premature optimization"?
  options:
    - Writing tests first
    - Optimizing too late
    - Using cProfile
    - Optimizing before profiling — guessing at bottlenecks
  correctIndex: 3
  explanation: 'Knuth: "Premature optimization is the root of all evil." Profile first, then optimize the actual bottleneck.'
- id: q10
  question: What's a common pitfall with logging in hot loops?
  options:
    - Logs are too detailed
    - Produces gigabytes of logs and slows the app — sample or aggregate
    - Logging doesn't work in loops
    - Logs are auto-throttled
    - generates massive logs and dominates runtime; sample (every N) or aggregate counters.
  correctIndex: 1
  explanation: Logging inside tight loops (e.g. per-row in a billion-row ETL) generates massive logs and dominates runtime; sample (every N) or aggregate counters.
```

