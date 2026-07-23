---
slug: go-goroutines-sync-package
id: go-10
track: go
order: 10
title: Goroutines and the sync Package
description: Launch goroutines, understand the GMP scheduler, and use the sync package — Mutex, RWMutex, WaitGroup, Once, Pool, Cond, and Map — to coordinate shared state safely.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=7200s
whyItMatters: Launch goroutines, understand the GMP scheduler, and use the sync package — Mutex, RWMutex, WaitGroup, Once, Pool, Cond, and Map — to coordinate shared state safely.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Goroutines and the sync Package

## Goroutines and the sync Package

### Why It Matters

Launch goroutines, understand the GMP scheduler, and use the sync package — Mutex, RWMutex, WaitGroup, Once, Pool, Cond, and Map — to coordinate shared state safely.

Launch goroutines, understand the GMP scheduler, and use the sync package — Mutex, RWMutex, WaitGroup, Once, Pool, Cond, and Map — to coordinate shared state safely.

### Prerequisites

- Stage 9: Embedding and Composition.
- Comfort with pointers and methods.

### Topics

- Goroutines: `go f(args)` — lightweight, ~2KB initial stack, growable
- The GMP model: goroutines (G), machine threads (M), processors (P)
- `runtime.Gosched()`, `runtime.NumGoroutine()`
- sync.Mutex and sync.RWMutex — Lock/Unlock, RLock/RUnlock
- sync.WaitGroup — Add/Done/Wait
- sync.Once — exactly-once initialization
- sync.Pool — reuse scratch buffers
- sync.Cond — condition variable signaling
- sync.Map — concurrent map for read-heavy workloads
- The race detector (`go run -race`)

### Key Concepts

- Goroutines are cheap (2KB initial stack, grows/shrinks); you can spawn hundreds of thousands.
- The GMP scheduler multiplexes goroutines onto OS threads; a blocked syscall hands its M back to the runtime.
- `sync.Mutex` is not reentrant — locking twice from the same goroutine deadlocks.
- A `sync.Mutex` value must not be copied — always pass by pointer; `go vet` catches this.
- The race detector (`-race`) is your friend; it catches data races that would otherwise be heisenbugs.

```go
func fanOut(items []string) {
    var wg sync.WaitGroup
    for _, item := range items {
        wg.Add(1)
        go func(item string) {       // pass item as arg (pre-1.22 safe)
            defer wg.Done()
            process(item)
        }(item)
    }
    wg.Wait()
}
```
Caption: WaitGroup + goroutines

### Common Pitfalls

- Copying a sync.Mutex — passing a struct containing a Mutex by value copies the Mutex, breaking its invariants and causing deadlock or races; `go vet` catches this.
- Goroutine leaks — `go func() { ch <- v }()` blocks forever if no one reads from ch; use `context`, buffered channels, or select-with-default.
- Forgetting `wg.Add` before `go` — adding inside the goroutine can race with `wg.Wait()` returning early; always `wg.Add(1)` before the `go` statement.
- Reentrant locking — Go's Mutex is not reentrant; calling a method that locks the same mutex from a method already holding it deadlocks.
- Using sync.Map as a general replacement for map+Mutex — sync.Map is slower for typical workloads; it shines only for read-heavy or disjoint-key workloads.

### Real-World Applications

- The entire Kubernetes controller manager spawns goroutines per controller, per worker, per informer — tens of thousands of goroutines per cluster manager process.
- Uber's go.uber.org/ratelimit uses a sync.Mutex-guarded token bucket to rate-limit API calls across goroutines.
- The net/http server spawns one goroutine per request — Go's cheap goroutines make this viable at millions of req/s.
- HashiCorp's raft implementation uses sync.Mutex and sync.Cond to coordinate log replication across goroutines.

### Interview Questions

- 1. What's the GMP model? — Goroutines (G) scheduled onto Machine threads (M) via Processor contexts (P); the runtime multiplexes Gs onto Ms, with one P per GOMAXPROCS.
- 2. Why is sync.Mutex not reentrant? — Reentrancy requires tracking the owner (per-goroutine ID, which Go doesn't expose) and is error-prone; the designers chose simplicity — re-lock deadlocks.
- 3. What does sync.Once guarantee? — That a function runs exactly once across all goroutines, even under concurrent first calls — used for lazy singletons.
- 4. When should you use sync.Map? — For read-heavy or disjoint-key workloads where multiple goroutines read but few write, or where each goroutine writes to disjoint keys; otherwise map+Mutex is faster.
- 5. How does the race detector work? — It instruments memory accesses at compile time and checks Happens-Before relationships at runtime; overhead is 5-10x but it catches races deterministically.

### Mini Project

Build a Concurrent URL Fetcher with Bounded Workers: A CLI that fetches N URLs concurrently with a configurable worker pool size, reports per-URL timing and status, and uses a WaitGroup + semaphore (channel) to bound concurrency. Suggested approach:
  - Define `type Result struct { URL string; Status int; Duration time.Duration; Err error }`
  - Use a buffered channel `sem := make(chan struct{}, workers)` as a semaphore
  - Spawn one goroutine per URL, acquire sem before fetch, release after
  - Collect results via a `results chan Result`
  - Run under `go run -race` to confirm no data races

### Exercises

1. Spawn 1000 goroutines incrementing a shared counter without a mutex; observe lost updates and verify with `-race`.
2. Add a sync.Mutex and re-run; confirm counts are correct and `-race` is clean.
3. Use sync.Once to lazy-init a config singleton accessed from 100 goroutines.
4. Implement a worker pool with `n` workers consuming from a `chan int`; benchmark different n.
5. Trigger a deadlock by locking a Mutex twice in the same goroutine; verify `go vet` doesn't catch it but the runtime does.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Approximately how much stack does a new goroutine start with?
9. A) 1 MB
10. B) 8 KB (grows as needed) — modern Go uses ~2KB then grows (*)
11. C) 64 KB
12. D) Same as an OS thread (8 MB)
13. Explanation: Goroutines start with a small stack (2-8 KB depending on Go version) that grows on demand, allowing hundreds of thousands of goroutines per process.
14. Q2: What does GMP stand for in the Go scheduler?
15. A) Generic Map Processor
16. B) Global Memory Pool
17. C) Goroutine, Machine, Processor (*)
18. D) Garbage, Mutex, Pool
19. Explanation: G = goroutine, M = OS thread (Machine), P = Processor context (one per GOMAXPROCS). The scheduler multiplexes Gs onto Ms via Ps.
20. Q3: Is sync.Mutex reentrant in Go?
21. A) Yes — same goroutine can re-lock
22. B) Only with -race enabled
23. C) Only for read locks
24. D) No — re-locking from the same goroutine deadlocks (*)
25. Explanation: Go's Mutex is not reentrant; locking twice from the same goroutine deadlocks. Go doesn't expose goroutine IDs, so reentrancy wasn't implemented.
26. Q4: What happens if you copy a sync.Mutex (e.g., pass by value)?
27. A) Breaks invariants — `go vet` flags it as a "copy of lock value" (*)
28. B) It works fine
29. C) Compile error
30. D) Runtime panic
31. Explanation: Mutexes have internal state that must not be copied; copying breaks invariants. `go vet` detects this pattern; always pass by pointer.
32. Q5: Which WaitGroup call must happen before the `go` statement?
33. A) wg.Done()
34. B) wg.Add(1) (*)
35. C) wg.Wait()
36. D) wg.Reset()
37. Explanation: Always call `wg.Add(1)` before `go f()`. Adding inside the goroutine races with `wg.Wait()` returning early (Wait could see zero count before Add runs).
38. Q6: What does sync.Once.Do guarantee?
39. A) The function runs exactly once per goroutine
40. B) The function is async
41. C) The function runs at most once, even under concurrent first calls (*)
42. D) The function is cached
43. Explanation: `once.Do(f)` runs f exactly once across all goroutines; concurrent callers block until the first invocation completes. Used for lazy singletons.
44. Q7: When is sync.Map preferred over map+Mutex?
45. A) Always — it's strictly better
46. B) Write-heavy workloads
47. C) Single-goroutine code
48. D) Read-heavy or disjoint-key workloads (*)
49. Explanation: sync.Map optimizes for read-heavy or disjoint-key scenarios; for typical read-write mix or single-goroutine use, map+Mutex is faster.
50. Q8: What does `go run -race` do?
51. A) Enables the data race detector at runtime (*)
52. B) Compiles with optimizations
53. C) Runs tests in parallel
54. D) Detects deadlocks
55. Explanation: `-race` instruments memory accesses and checks Happens-Before at runtime, catching data races that would otherwise be nondeterministic heisenbugs.
56. Q9: How do you bound goroutine concurrency cheaply?
57. A) One OS thread per goroutine
58. B) Use a buffered channel as a semaphore (`sem := make(chan struct{}, N)`) (*)
59. C) sync.Mutex
60. D) sync.Once
61. Explanation: Acquiring from a buffered channel of size N admits at most N goroutines into a section; releasing (putting back) lets the next one in — a cheap semaphore.
62. Q10: What's the typical overhead of the race detector?
63. A) None
64. B) 100x CPU
65. C) 5-10x CPU and 2x memory — for CI/dev only, not production (*)
66. D) 2x binary size only
67. Explanation: The race detector adds ~5-10x CPU and 2x memory overhead; it's for dev and CI, not production. Some teams ship a race-enabled binary to a small fraction of canaries.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Approximately how much stack does a new goroutine start with?
  options:
    - 1 MB
    - 8 KB (grows as needed) — modern Go uses ~2KB then grows
    - 64 KB
    - Same as an OS thread (8 MB)
  correctIndex: 1
  explanation: Goroutines start with a small stack (2-8 KB depending on Go version) that grows on demand, allowing hundreds of thousands of goroutines per process.
- id: q2
  question: What does GMP stand for in the Go scheduler?
  options:
    - Generic Map Processor
    - Global Memory Pool
    - Goroutine, Machine, Processor
    - Garbage, Mutex, Pool
    - . The scheduler multiplexes Gs onto Ms via Ps.
  correctIndex: 2
  explanation: G = goroutine, M = OS thread (Machine), P = Processor context (one per GOMAXPROCS). The scheduler multiplexes Gs onto Ms via Ps.
- id: q3
  question: Is sync.Mutex reentrant in Go?
  options:
    - Yes — same goroutine can re-lock
    - Only with -race enabled
    - Only for read locks
    - No — re-locking from the same goroutine deadlocks
  correctIndex: 3
  explanation: Go's Mutex is not reentrant; locking twice from the same goroutine deadlocks. Go doesn't expose goroutine IDs, so reentrancy wasn't implemented.
- id: q4
  question: What happens if you copy a sync.Mutex (e.g., pass by value)?
  options:
    - Breaks invariants — `go vet` flags it as a "copy of lock value"
    - It works fine
    - Compile error
    - Runtime panic
  correctIndex: 0
  explanation: Mutexes have internal state that must not be copied; copying breaks invariants. `go vet` detects this pattern; always pass by pointer.
- id: q5
  question: Which WaitGroup call must happen before the `go` statement?
  options:
    - wg.Done()
    - wg.Add(1)
    - wg.Wait()
    - wg.Reset()
  correctIndex: 1
  explanation: Always call `wg.Add(1)` before `go f()`. Adding inside the goroutine races with `wg.Wait()` returning early (Wait could see zero count before Add runs).
- id: q6
  question: What does sync.Once.Do guarantee?
  options:
    - The function runs exactly once per goroutine
    - The function is async
    - The function runs at most once, even under concurrent first calls
    - The function is cached
  correctIndex: 2
  explanation: "`once.Do(f)` runs f exactly once across all goroutines; concurrent callers block until the first invocation completes. Used for lazy singletons."
- id: q7
  question: When is sync.Map preferred over map+Mutex?
  options:
    - Always — it's strictly better
    - Write-heavy workloads
    - Single-goroutine code
    - Read-heavy or disjoint-key workloads
  correctIndex: 3
  explanation: sync.Map optimizes for read-heavy or disjoint-key scenarios; for typical read-write mix or single-goroutine use, map+Mutex is faster.
- id: q8
  question: What does `go run -race` do?
  options:
    - Enables the data race detector at runtime
    - Compiles with optimizations
    - Runs tests in parallel
    - Detects deadlocks
  correctIndex: 0
  explanation: "`-race` instruments memory accesses and checks Happens-Before at runtime, catching data races that would otherwise be nondeterministic heisenbugs."
- id: q9
  question: How do you bound goroutine concurrency cheaply?
  options:
    - One OS thread per goroutine
    - Use a buffered channel as a semaphore (`sem := make(chan struct{}, N)`)
    - sync.Mutex
    - sync.Once
  correctIndex: 1
  explanation: Acquiring from a buffered channel of size N admits at most N goroutines into a section; releasing (putting back) lets the next one in — a cheap semaphore.
- id: q10
  question: What's the typical overhead of the race detector?
  options:
    - None
    - 100x CPU
    - 5-10x CPU and 2x memory — for CI/dev only, not production
    - 2x binary size only
  correctIndex: 2
  explanation: The race detector adds ~5-10x CPU and 2x memory overhead; it's for dev and CI, not production. Some teams ship a race-enabled binary to a small fraction of canaries.
```

