---
slug: go-building-clis-web-servers-capstone-prep
id: go-20
track: go
order: 20
title: Building CLIs and Web Servers and Capstone Prep
description: Tie everything together — build production-grade CLIs with cobra and Web servers with net/http (or chi), wire middleware, use structured logging (slog), and prepare for the capstone.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=15200s
whyItMatters: Tie everything together — build production-grade CLIs with cobra and Web servers with net/http (or chi), wire middleware, use structured logging (slog), and prepare for the capstone.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Building CLIs and Web Servers and Capstone Prep

## Building CLIs and Web Servers and Capstone Prep

### Why It Matters

Tie everything together — build production-grade CLIs with cobra and Web servers with net/http (or chi), wire middleware, use structured logging (slog), and prepare for the capstone.

Tie everything together — build production-grade CLIs with cobra and Web servers with net/http (or chi), wire middleware, use structured logging (slog), and prepare for the capstone.

### Prerequisites

- Stage 19: Tooling.
- All prior stages.

### Topics

- CLI structure: cobra (commands, flags, subcommands) and pflag
- Long-running processes: signal handling, graceful shutdown, health checks
- HTTP middleware: logging, recovery, request-id, CORS, auth
- Structured logging with log/slog (Go 1.21+) — text and JSON handlers
- Configuration: env vars, flags, config files (viper, koanf)
- Health and readiness endpoints (/healthz, /readyz)
- Observability: metrics (prometheus), tracing (otel), structured logs
- Project layout, Makefile, Dockerfile, CI

### Key Concepts

- A CLI should have clear subcommands (`myapp serve`, `myapp migrate`), each with its own flags; cobra is the de-facto standard.
- A web server must handle SIGINT/SIGTERM gracefully: stop accepting new connections, drain in-flight handlers, exit.
- log/slog (Go 1.21+) is the standard structured logger; prefer it over logrus/zap for new code (those still work, but slog is in stdlib).
- Health endpoints separate liveness (process up — `/healthz`) from readiness (deps up — `/readyz`); orchestrators use both.
- The standard project layout (cmd/, internal/, pkg/) is a convention, not a rule; pick what fits your team and stay consistent.

```go
package main

import (
    "context"
    "github.com/spf13/cobra"
)

func main() {
    root := &cobra.Command{
        Use: "myapp",
        Short: "My app does X",
    }
    serve := &cobra.Command{
        Use: "serve",
        RunE: func(cmd *cobra.Command, args []string) error {
            return runServer(cmd.Context())
        },
    }
    root.AddCommand(serve)
    root.Execute()
}
```
Caption: Cobra CLI skeleton

### Common Pitfalls

- No graceful shutdown — `srv.ListenAndServe()` until killed loses in-flight requests; wire up Shutdown(ctx) on SIGINT/SIGTERM.
- Logging with `log.Printf` instead of structured logs — switch to log/slog for JSON output that log aggregators can parse.
- Mixing health and readiness — `/healthz` (liveness) returns 200 if the process is up; `/readyz` returns 200 only if deps (DB, downstream) are reachable. Don't conflate them.
- Single-stage Dockerfiles with `golang:1.21` as the final image — final image is 800MB+; use multi-stage with distroless or scratch for ~10MB.
- No ReadHeaderTimeout — Slowloris exposure; always set it on the http.Server.

### Real-World Applications

- Docker's CLI uses cobra; the `docker run`, `docker ps`, `docker build` subcommands map to cobra commands.
- Kubernetes' apiserver, kubelet, and controller-manager all use the cobra-style CLI with shared global flags via a genericclioptions package.
- HashiCorp tools (Terraform, Vault, Consul) ship as single static binaries with cobra-style subcommands and structured logging.
- The Prometheus server uses net/http + custom middleware + slog/log for observability, with /-/healthy and /-/ready endpoints.

### Interview Questions

- 1. How do you gracefully shut down a Go HTTP server? — Use signal.NotifyContext to catch SIGINT/SIGTERM, then srv.Shutdown(ctx) to stop accepting new connections and wait for in-flight handlers (with a deadline).
- 2. What's the difference between /healthz and /readyz? — /healthz (liveness) returns 200 if the process is alive (orchestrator restarts on failure); /readyz (readiness) returns 200 only if the service can serve traffic (deps healthy; orchestrator stops routing on failure).
- 3. Why use log/slog over logrus or zap in new code? — slog is in the standard library (Go 1.21+) with structured logging and interchangeable handlers; logrus/zap still work but slog avoids the dependency for new projects.
- 4. What's a multi-stage Docker build, and why use one for Go? — Build in a golang image, copy only the binary into a distroless/scratch final image — final image is ~10MB instead of ~800MB, with no compiler or shell for attackers.
- 5. Why use cobra over the standard flag package? — cobra gives subcommands, persistent flags, help generation, and shell completion out of the box; flag is fine for trivial tools but cobra scales to multi-command CLIs like docker, kubectl, terraform.

### Mini Project

Build a Production-Ready URL Shortener Service Skeleton: A cobra CLI (`shorten serve`, `shorten migrate`) that starts an HTTP server with `/healthz`, `/readyz`, `/shorten`, and `/{key}` endpoints, structured logging via slog, graceful shutdown on SIGINT, a multi-stage Dockerfile, and a Makefile. Suggested approach:
  - `cmd/shorten/main.go` with cobra root + serve/migrate subcommands
  - `internal/server` with the http.Server, mux, and middleware
  - `internal/store` interface with an in-memory implementation
  - slog JSON handler writing to stdout
  - Multi-stage Dockerfile with distroless final image and a Makefile with build/test/lint/docker targets

### Exercises

1. Refactor a single-binary CLI into cobra subcommands.
2. Add signal.NotifyContext + srv.Shutdown to an existing HTTP server; verify clean exit on Ctrl+C.
3. Replace `log.Printf` with slog.Info, slog.With, and a JSON handler.
4. Write a multi-stage Dockerfile producing a <20MB image for a Go service.
5. Add `/healthz` and `/readyz` endpoints and verify they behave differently when a downstream dep is down.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which library is the de-facto standard for multi-command Go CLIs?
9. A) flag
10. B) urfave/cli only
11. C) argparse
12. D) cobra (*)
13. Explanation: cobra provides subcommands, persistent flags, help generation, and shell completion. It powers docker, kubectl, terraform, and many other major Go CLIs.
14. Q2: Which Go 1.21+ package provides structured logging in the standard library?
15. A) log/slog (*)
16. B) log
17. C) logrus
18. D) zap
19. Explanation: `log/slog` (Go 1.21, August 2023) provides structured logging with text and JSON handlers and the Logger interface. logrus/zap remain popular but slog is stdlib-native.
20. Q3: What does srv.Shutdown(ctx) do during graceful shutdown?
21. A) Kills all connections immediately
22. B) Closes listeners (no new conns), waits for in-flight handlers or ctx (*)
23. C) Restarts the server
24. D) Drops the connection pool
25. Explanation: Shutdown stops accepting new connections, waits for in-flight handlers to finish (or ctx to expire), then returns. Use it with signal.NotifyContext on SIGINT/SIGTERM.
26. Q4: Which signal handler pattern captures Ctrl+C and SIGTERM?
27. A) os.Exit on channel receive
28. B) panic on signal
29. C) signal.NotifyContext(ctx, syscall.SIGINT, syscall.SIGTERM) (*)
30. D) signal.Ignore
31. Explanation: `signal.NotifyContext(ctx, SIGINT, SIGTERM)` returns a context that's cancelled when either signal arrives, idiomatically wired into runServer(ctx) for graceful shutdown.
32. Q5: What's the difference between /healthz and /readyz?
33. A) None — they're aliases
34. B) /healthz is for HTTP, /readyz for TCP
35. C) /healthz is deprecated
36. D) /healthz = liveness (process up); /readyz = readiness (deps up, can serve) (*)
37. Explanation: Liveness (/healthz) — should the orchestrator restart the pod? Readiness (/readyz) — should the orchestrator route traffic to it? A pod can be live but not ready (e.g., warming up).
38. Q6: What's the canonical way to produce a small Go Docker image?
39. A) Multi-stage build: compile in golang, copy binary to distroless/scratch (*)
40. B) Use golang:1.21 as the final image
41. C) Use docker-slim on a regular build
42. D) Use ubuntu:latest
43. Explanation: Multi-stage builds compile in a full golang image, then copy the static binary into a minimal final image (distroless static or scratch) — final size ~10-20MB, no shell or compiler for attackers.
44. Q7: Why set ReadHeaderTimeout on http.Server?
45. A) Faster request handling
46. B) Mitigates Slowloris attacks that send headers one byte at a time (*)
47. C) Required for HTTP/2
48. D) Reduces memory
49. Explanation: ReadHeaderTimeout caps the time to read the request headers, mitigating Slowloris-style DoS. Always set it (e.g., 5s) on every http.Server.
50. Q8: Which middleware should every production HTTP server have?
51. A) Only logging
52. B) CORS only
53. C) Logging, recovery (panic → 500), request-id, and timeouts (*)
54. D) None — net/http is enough
55. Explanation: At minimum: structured logging, panic recovery (so one bad handler doesn't crash the process), per-request IDs for tracing, and timeouts (read, write, idle). Auth and CORS depend on the use case.
56. Q9: What does cobra's RunE return?
57. A) void
58. B) A status code int
59. C) A context
60. D) An error — cobra prints it and sets the exit code automatically (*)
61. Explanation: `RunE: func(cmd, args) error` returns an error; cobra prints it and exits non-zero. Use Run (no error) only when failures are impossible; prefer RunE for proper error propagation.
62. Q10: Why use a Makefile for a Go service?
63. A) One entry point for build/test/lint/docker commands — reproducible across team and CI (*)
64. B) Go can't build without it
65. C) It's required by Go
66. D) To replace go mod
67. Explanation: A Makefile (or Taskfile, justfile) gives the team one canonical `make build`, `make test`, `make lint`, `make docker` — same commands in CI as on laptops, reducing "works on my machine" drift.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: Which library is the de-facto standard for multi-command Go CLIs?
  options:
    - flag
    - urfave/cli only
    - argparse
    - cobra
  correctIndex: 3
  explanation: cobra provides subcommands, persistent flags, help generation, and shell completion. It powers docker, kubectl, terraform, and many other major Go CLIs.
- id: q2
  question: Which Go 1.21+ package provides structured logging in the standard library?
  options:
    - log/slog
    - log
    - logrus
    - zap
  correctIndex: 0
  explanation: "`log/slog` (Go 1.21, August 2023) provides structured logging with text and JSON handlers and the Logger interface. logrus/zap remain popular but slog is stdlib-native."
- id: q3
  question: What does srv.Shutdown(ctx) do during graceful shutdown?
  options:
    - Kills all connections immediately
    - Closes listeners (no new conns), waits for in-flight handlers or ctx
    - Restarts the server
    - Drops the connection pool
  correctIndex: 1
  explanation: Shutdown stops accepting new connections, waits for in-flight handlers to finish (or ctx to expire), then returns. Use it with signal.NotifyContext on SIGINT/SIGTERM.
- id: q4
  question: Which signal handler pattern captures Ctrl+C and SIGTERM?
  options:
    - os.Exit on channel receive
    - panic on signal
    - signal.NotifyContext(ctx, syscall.SIGINT, syscall.SIGTERM)
    - signal.Ignore
    - "` returns a context that's cancelled when either signal arrives, idiomatically wired into runServer(ctx) for graceful shutdown."
  correctIndex: 2
  explanation: "`signal.NotifyContext(ctx, SIGINT, SIGTERM)` returns a context that's cancelled when either signal arrives, idiomatically wired into runServer(ctx) for graceful shutdown."
- id: q5
  question: What's the difference between /healthz and /readyz?
  options:
    - None — they're aliases
    - /healthz is for HTTP, /readyz for TCP
    - /healthz is deprecated
    - /healthz = liveness (process up); /readyz = readiness (deps up, can serve)
  correctIndex: 3
  explanation: Liveness (/healthz) — should the orchestrator restart the pod? Readiness (/readyz) — should the orchestrator route traffic to it? A pod can be live but not ready (e.g., warming up).
- id: q6
  question: What's the canonical way to produce a small Go Docker image?
  options:
    - "Multi-stage build: compile in golang, copy binary to distroless/scratch"
    - Use golang:1.21 as the final image
    - Use docker-slim on a regular build
    - Use ubuntu:latest
  correctIndex: 0
  explanation: Multi-stage builds compile in a full golang image, then copy the static binary into a minimal final image (distroless static or scratch) — final size ~10-20MB, no shell or compiler for attackers.
- id: q7
  question: Why set ReadHeaderTimeout on http.Server?
  options:
    - Faster request handling
    - Mitigates Slowloris attacks that send headers one byte at a time
    - Required for HTTP/2
    - Reduces memory
  correctIndex: 1
  explanation: ReadHeaderTimeout caps the time to read the request headers, mitigating Slowloris-style DoS. Always set it (e.g., 5s) on every http.Server.
- id: q8
  question: Which middleware should every production HTTP server have?
  options:
    - Only logging
    - CORS only
    - Logging, recovery (panic → 500), request-id, and timeouts
    - None — net/http is enough
  correctIndex: 2
  explanation: "At minimum: structured logging, panic recovery (so one bad handler doesn't crash the process), per-request IDs for tracing, and timeouts (read, write, idle). Auth and CORS depend on the use case."
- id: q9
  question: What does cobra's RunE return?
  options:
    - void
    - A status code int
    - A context
    - An error — cobra prints it and sets the exit code automatically
  correctIndex: 3
  explanation: "`RunE: func(cmd, args) error` returns an error; cobra prints it and exits non-zero. Use Run (no error) only when failures are impossible; prefer RunE for proper error propagation."
- id: q10
  question: Why use a Makefile for a Go service?
  options:
    - One entry point for build/test/lint/docker commands — reproducible across team and CI
    - Go can't build without it
    - It's required by Go
    - To replace go mod
  correctIndex: 0
  explanation: A Makefile (or Taskfile, justfile) gives the team one canonical `make build`, `make test`, `make lint`, `make docker` — same commands in CI as on laptops, reducing "works on my machine" drift.
```

