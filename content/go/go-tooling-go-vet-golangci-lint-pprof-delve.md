---
slug: go-tooling-go-vet-golangci-lint-pprof-delve
id: go-19
track: go
order: 19
title: Tooling — go vet, golangci-lint, pprof, delve
description: Master the Go tooling ecosystem — go vet and its analyzers, golangci-lint for aggregated linting, pprof for CPU/memory profiling, and the Delve debugger for stepping through Go code.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=14400s
whyItMatters: Master the Go tooling ecosystem — go vet and its analyzers, golangci-lint for aggregated linting, pprof for CPU/memory profiling, and the Delve debugger for stepping through Go code.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Tooling — go vet, golangci-lint, pprof, delve

## Tooling — go vet, golangci-lint, pprof, delve

### Why It Matters

Master the Go tooling ecosystem — go vet and its analyzers, golangci-lint for aggregated linting, pprof for CPU/memory profiling, and the Delve debugger for stepping through Go code.

Master the Go tooling ecosystem — go vet and its analyzers, golangci-lint for aggregated linting, pprof for CPU/memory profiling, and the Delve debugger for stepping through Go code.

### Prerequisites

- Stage 18: Concurrency Patterns.
- Comfort running `go test`, `go build`, and `go vet`.

### Topics

- go vet and the analyzer framework (golang.org/x/tools/go/analysis)
- golangci-lint: config (.golangci.yml), enabling/disabling linters, custom rules
- Common linters: errcheck, gosec, staticcheck, ineffassign, unused, gocyclo
- pprof CPU profiles: runtime/pprof and net/http/pprof
- pprof memory profiles (heap, allocs, goroutine, block, mutex)
- go tool pprof: top, list, web, svg
- Delve (dlv): breakpoints, goroutines, cores, remote attach
- go test -race, -cpuprofile, -memprofile, -blockprofile, -mutexprofile

### Key Concepts

- `go vet` runs a curated set of analyzers by default; you can add more with `-vettool` or run them directly via `go vet -vettool=$(which ...)`.
- golangci-lint aggregates dozens of linters with a single config; it's the de-facto industry standard, run in CI.
- pprof samples CPU at a configurable rate; memory profiles can be heap (current) or allocs (cumulative).
- Delve is the Go-aware debugger; unlike gdb, it understands goroutines, channels, and the runtime scheduler.
- Profiling in production: expose `/debug/pprof/*` on an internal port; capture with `go tool pprof http://service/debug/pprof/profile?seconds=30`.

```go
import "runtime/pprof"

func main() {
    f, _ := os.Create("cpu.prof")
    defer f.Close()
    pprof.StartCPUProfile(f)
    defer pprof.StopCPUProfile()

    heavyWork()
}
// go tool pprof cpu.prof
// (pprof) top10
// (pprof) list HeavyWork
// (pprof) web
```
Caption: CPU profile with runtime/pprof

### Common Pitfalls

- Running pprof in production on the public port — `/debug/pprof` can leak goroutine stacks and expose internals; bind it to localhost or an internal-only listener.
- Profiling without enough samples — a 1-second CPU profile is too noisy; use 30+ seconds for production, or longer for low-rate events.
- Trusing golangci-lint's defaults forever — defaults change between versions; pin the version and explicitly enable the linters you want.
- Using `go vet` alone in CI — vet catches a small set; add staticcheck and gosec for deeper analysis via golangci-lint.
- Debugging with gdb instead of Delve — gdb doesn't understand goroutines, channels, or Go's stack layout; use Delve for any non-trivial Go debugging.

### Real-World Applications

- Google, Uber, and Twitch all run golangci-lint in CI for Go services; many pin a specific version for reproducibility.
- Cloudflare uses pprof extensively on edge workers; the famous "pprof on the edge" blog post walks through diagnosing a 30% CPU regression live.
- The Kubernetes project ships a custom Delve script (`hack/dlv.sh`) for stepping through apiserver boot, which has hundreds of goroutines.
- Docker's CLI uses golangci-lint with a strict config; CI fails on any new lint warning, enforcing style discipline.

### Interview Questions

- 1. What's the difference between go vet and staticcheck? — vet is the curated baseline shipped with Go; staticcheck is a third-party (now widely adopted) suite of deeper checks, often run via golangci-lint.
- 2. How do you profile a running production Go service? — Expose net/http/pprof on an internal port; capture with `go tool pprof http://host/debug/pprof/profile?seconds=30`.
- 3. What's a heap profile vs an allocs profile? — Heap shows current in-use memory; allocs shows cumulative allocations since process start — useful for finding GC pressure.
- 4. Why use Delve instead of gdb? — Delve is Go-aware (goroutines, channels, runtime structs, defer chains); gdb sees only machine state and misreads Go's stack.
- 5. What does `go test -race` do, and what's its overhead? — Enables the data race detector (Happens-Before checks via instrumentation); ~5-10x CPU and 2x memory overhead — for CI/dev, not prod.

### Mini Project

Build a Profile-Aware HTTP Server: A small HTTP server that exposes a separate admin port (`:6060`) with `/debug/pprof/*` endpoints, runs under `go test -race` in CI, and ships with a `.golangci.yml` enabling at least 6 linters. Suggested approach:
  - `import _ "net/http/pprof"` and serve on a separate listener bound to localhost:6060
  - Write a CPU-heavy handler (`/hash`) for testing pprof
  - Add a `.golangci.yml` enabling errcheck, staticcheck, gosec, ineffassign, unused, gocyclo
  - Add a Makefile target `make lint` running golangci-lint run
  - Capture and view a CPU profile with `go tool pprof` and find the hot function

### Exercises

1. Run `go vet ./...` on a project and fix all findings.
2. Add golangci-lint to a project, fix the top 10 warnings, and pin the version.
3. Profile a CPU-heavy program with runtime/pprof; view top10 and list a function.
4. Set a breakpoint in Delve, step through a function, and inspect a goroutine.
5. Run a benchmark with `-race -memprofile`; identify the top allocator.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `go vet` do?
9. A) Formats code
10. B) Runs all tests
11. C) Runs a curated set of static analyzers for common mistakes (*)
12. D) Compiles with -race
13. Explanation: `go vet` runs a baseline set of analyzers (printf, copylocks, struct tags, unreachable, etc.) for common mistakes. It runs automatically during `go test` unless `-vet=off`.
14. Q2: Which tool aggregates dozens of Go linters behind one config?
15. A) gofmt
16. B) go vet
17. C) staticcheck alone
18. D) golangci-lint (*)
19. Explanation: golangci-lint aggregates errcheck, staticcheck, gosec, ineffassign, unused, gocyclo, and many more, configured via `.golangci.yml`. It's the de-facto industry standard.
20. Q3: Which package exposes /debug/pprof endpoints via HTTP?
21. A) net/http/pprof (imported for side effects) (*)
22. B) runtime/pprof
23. C) log/pprof
24. D) profile/pprof
25. Explanation: `import _ "net/http/pprof"` registers `/debug/pprof/*` handlers on the default ServeMux. Use runtime/pprof for offline CPU profiling of batch programs.
26. Q4: What does `go tool pprof http://host/debug/pprof/profile?seconds=30` do?
27. A) Returns a JSON report
28. B) Captures a 30-second CPU profile and opens an interactive shell (*)
29. C) Restarts the service
30. D) Triggers a heap dump
31. Explanation: `go tool pprof URL` fetches a profile and opens the interactive pprof shell (top, list, web). The `seconds=30` query tells the server how long to sample.
32. Q5: Heap vs allocs profile — what's the difference?
33. A) They're identical
34. B) Heap = stacks; allocs = heap
35. C) Heap = current in-use memory; allocs = cumulative allocations since start (*)
36. D) Heap is for CPU; allocs for memory
37. Explanation: Heap profile shows currently live allocations (what could be GC'd); allocs profile shows total allocations since process start — useful for finding GC pressure from short-lived objects.
38. Q6: Why is debugging Go with gdb problematic?
39. A) gdb is deprecated
40. B) gdb is too slow
41. C) gdb doesn't run on Linux
42. D) gdb doesn't understand goroutines, channels, or Go's stack layout — use Delve (*)
43. Explanation: gdb sees machine state (threads, registers) but not Go's runtime abstractions (goroutines, channels, defer chains, GC). Delve is Go-aware and the recommended debugger.
44. Q7: How do you set a breakpoint in Delve?
45. A) `break main.work` inside the dlv REPL (*)
46. B) dlv break main.work
47. C) b main.work
48. D) br main.work
49. Explanation: Inside the Delve REPL, `break <function or file:line>` sets a breakpoint; `continue` runs until it's hit; `print x` inspects variables; `goroutines` lists goroutines.
50. Q8: What's the overhead of `go test -race`?
51. A) None
52. B) ~5-10x CPU and 2x memory — dev/CI only (*)
53. C) 100x
54. D) 2x binary size only
55. Explanation: The race detector instruments memory accesses at compile time and checks Happens-Before at runtime, adding ~5-10x CPU and 2x memory overhead — fine for CI, never for production traffic.
56. Q9: Which linter catches security issues like SQL injection and weak crypto?
57. A) errcheck
58. B) gocyclo
59. C) gosec (*)
60. D) ineffassign
61. Explanation: gosec scans for security misconfigurations (hardcoded credentials, weak crypto, SQL injection, insecure file permissions). It's commonly enabled in golangci-lint configs for service code.
62. Q10: Why bind /debug/pprof to localhost or an internal port in production?
63. A) Performance
64. B) It's a security vulnerability by design
65. C) It doesn't matter
66. D) It can leak goroutine stacks and internal data to anyone (*)
67. Explanation: pprof endpoints expose goroutine stacks, heap contents, and CPU profiles — sensitive internal data. Bind to localhost or a separate internal-only listener; never expose on a public port.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `go vet` do?
  options:
    - Formats code
    - Runs all tests
    - Runs a curated set of static analyzers for common mistakes
    - Compiles with -race
  correctIndex: 2
  explanation: "`go vet` runs a baseline set of analyzers (printf, copylocks, struct tags, unreachable, etc.) for common mistakes. It runs automatically during `go test` unless `-vet=off`."
- id: q2
  question: Which tool aggregates dozens of Go linters behind one config?
  options:
    - gofmt
    - go vet
    - staticcheck alone
    - golangci-lint
  correctIndex: 3
  explanation: golangci-lint aggregates errcheck, staticcheck, gosec, ineffassign, unused, gocyclo, and many more, configured via `.golangci.yml`. It's the de-facto industry standard.
- id: q3
  question: Which package exposes /debug/pprof endpoints via HTTP?
  options:
    - net/http/pprof (imported for side effects)
    - runtime/pprof
    - log/pprof
    - profile/pprof
  correctIndex: 0
  explanation: '`import _ "net/http/pprof"` registers `/debug/pprof/*` handlers on the default ServeMux. Use runtime/pprof for offline CPU profiling of batch programs.'
- id: q4
  question: What does `go tool pprof http://host/debug/pprof/profile?seconds=30` do?
  options:
    - Returns a JSON report
    - Captures a 30-second CPU profile and opens an interactive shell
    - Restarts the service
    - Triggers a heap dump
  correctIndex: 1
  explanation: "`go tool pprof URL` fetches a profile and opens the interactive pprof shell (top, list, web). The `seconds=30` query tells the server how long to sample."
- id: q5
  question: Heap vs allocs profile — what's the difference?
  options:
    - They're identical
    - Heap = stacks; allocs = heap
    - Heap = current in-use memory; allocs = cumulative allocations since start
    - Heap is for CPU; allocs for memory
  correctIndex: 2
  explanation: Heap profile shows currently live allocations (what could be GC'd); allocs profile shows total allocations since process start — useful for finding GC pressure from short-lived objects.
- id: q6
  question: Why is debugging Go with gdb problematic?
  options:
    - gdb is deprecated
    - gdb is too slow
    - gdb doesn't run on Linux
    - gdb doesn't understand goroutines, channels, or Go's stack layout — use Delve
    - . Delve is Go-aware and the recommended debugger.
  correctIndex: 3
  explanation: gdb sees machine state (threads, registers) but not Go's runtime abstractions (goroutines, channels, defer chains, GC). Delve is Go-aware and the recommended debugger.
- id: q7
  question: How do you set a breakpoint in Delve?
  options:
    - "`break main.work` inside the dlv REPL"
    - dlv break main.work
    - b main.work
    - br main.work
  correctIndex: 0
  explanation: Inside the Delve REPL, `break <function or file:line>` sets a breakpoint; `continue` runs until it's hit; `print x` inspects variables; `goroutines` lists goroutines.
- id: q8
  question: What's the overhead of `go test -race`?
  options:
    - None
    - ~5-10x CPU and 2x memory — dev/CI only
    - 100x
    - 2x binary size only
  correctIndex: 1
  explanation: The race detector instruments memory accesses at compile time and checks Happens-Before at runtime, adding ~5-10x CPU and 2x memory overhead — fine for CI, never for production traffic.
- id: q9
  question: Which linter catches security issues like SQL injection and weak crypto?
  options:
    - errcheck
    - gocyclo
    - gosec
    - ineffassign
  correctIndex: 2
  explanation: gosec scans for security misconfigurations (hardcoded credentials, weak crypto, SQL injection, insecure file permissions). It's commonly enabled in golangci-lint configs for service code.
- id: q10
  question: Why bind /debug/pprof to localhost or an internal port in production?
  options:
    - Performance
    - It's a security vulnerability by design
    - It doesn't matter
    - It can leak goroutine stacks and internal data to anyone
  correctIndex: 3
  explanation: pprof endpoints expose goroutine stacks, heap contents, and CPU profiles — sensitive internal data. Bind to localhost or a separate internal-only listener; never expose on a public port.
```

