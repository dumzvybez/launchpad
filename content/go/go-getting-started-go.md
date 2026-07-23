---
slug: go-getting-started-go
id: go-01
track: go
order: 1
title: Getting Started with Go
description: Install the Go toolchain, write and run your first program with `go run`, understand the module/workspace model, and meet the fmt, os, and log standard library packages.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU
whyItMatters: Install the Go toolchain, write and run your first program with `go run`, understand the module/workspace model, and meet the fmt, os, and log standard library packages.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Getting Started with Go

## Getting Started with Go

### Why It Matters

Install the Go toolchain, write and run your first program with `go run`, understand the module/workspace model, and meet the fmt, os, and log standard library packages.

Install the Go toolchain, write and run your first program with `go run`, understand the module/workspace model, and meet the fmt, os, and log standard library packages.

### Prerequisites

- None — this is the entry point for the Go track.
- Basic computer literacy (installing software, using a terminal).

### Topics

- Installing Go 1.21+ on Windows/macOS/Linux
- The `go` command: run, build, test, install, mod, vet, fmt
- Modules, go.mod, and semantic import versioning
- Workspaces (go.work) for multi-module development
- package main and the func main() entry point
- Importing standard library packages (fmt, os, log)
- gofmt and goimports — formatting is non-negotiable
- The Go execution model: source → compile → static binary

### Key Concepts

- Go compiles to a single static binary with no runtime dependencies — perfect for containers.
- `package main` plus `func main()` is the entry point; the binary exits when main returns.
- A module is a versioned collection of packages declared in go.mod; you almost always need one.
- The standard library is batteries-included (net/http, encoding/json, crypto, testing) — reach for it before external deps.
- Go code is formatted by `gofmt`; never argue about style, run it on save.

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```
Caption: Hello World

### Common Pitfalls

- Running `go run hello.go` from a directory without a go.mod — Go 1.16+ requires a module; run `go mod init <name>` first or use `GO111MODULE=on` explicitly.
- Putting the file in the wrong package — only `package main` with a `func main()` produces an executable; `package foo` builds a library.
- Editing a file in $GOPATH/src manually — modules live anywhere on disk; never edit files under $GOPATH/pkg/mod (those are cached module sources).
- Forgetting that `go build` drops the binary next to the source, not into ./bin — use `go build -o bin/hello` or `go install` to control output location.
- Confusing `go run` (compile-and-run, discards binary) with `go build` (produces binary) — use `go run` for dev, `go build`/`go install` for shipping.

### Real-World Applications

- Docker's CLI (`docker`) and daemon (`dockerd`) are written in Go; the static binary is why a Docker install is one tarball per OS/arch.
- Kubernetes is almost entirely Go (api server, kubelet, scheduler, controller-manager); the entire CNCF graduated project list is dominated by Go.
- HashiCorp's Terraform, Vault, Consul, and Nomad are Go — chosen for static binaries and cross-compilation.
- Twitch migrated its IRC chat ingress from Python to Go and dropped p99 latency by an order of magnitude.

### Interview Questions

- 1. Who designed Go and why? — Griesemer, Pike, Thompson at Google (2007-2009) to fix C++ build times and Java's verbosity while keeping static typing and fast compilation.
- 2. What is a Go module? — A versioned collection of Go packages in a directory with a go.mod file at the root; the unit of versioning and dependency resolution.
- 3. Why does Go ship as a static binary? — The linker bundles the runtime and all dependencies; no shared libc dependency means trivial Docker images (FROM scratch) and easy cross-compilation.
- 4. What does `go mod tidy` do? — Adds missing imports to go.mod/go.sum and removes unused dependencies; run before every commit.
- 5. How does `go run` differ from `go build`? — `go run` compiles to a temp dir and executes immediately, discarding the binary; `go build` produces a persistent binary you can deploy.

### Mini Project

Build a Greeting Generator CLI: A command-line tool that takes a name from argv (or `--name Alice`), prints a personalized greeting with a timestamp, and falls back to "World" when no argument is supplied. Suggested approach:
  - `go mod init example.com/greet` and create main.go with package main
  - Parse `os.Args` manually or use the `flag` package for `--name`
  - Stamp output with `time.Now().UTC().Format(time.RFC3339)`
  - Print with `fmt.Printf("Hello, %s! [%s]\n", name, ts)`
  - Document `go run . --name Alice` and `go build -o greet` in a README

### Exercises

1. Install Go 1.21+ and confirm with `go version` and `go env GOROOT GOPATH GOBIN`.
2. Create a module `example.com/hello`, write main.go printing your name, and run it with `go run .`.
3. Cross-compile: `GOOS=linux GOARCH=arm64 go build -o hello-arm64` and verify the file type with `file hello-arm64`.
4. Add a `--shout` flag that uppercases the greeting using `strings.ToUpper`.
5. Run `gofmt -w main.go` and `go vet ./...` to confirm zero diagnostics before committing.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Who designed Go at Google?
9. A) Rob Pike, Robert Griesemer, and Ken Thompson (*)
10. B) Bjarne Stroustrup and Herb Sutter
11. C) James Gosling and Bill Joy
12. D) Guido van Rossum and Brett Cannon
13. Explanation: Griesemer, Pike, and Thompson began Go in 2007 to address build-time and complexity problems with C++ at Google scale.
14. Q2: Which command runs a Go program without leaving a binary on disk?
15. A) go build
16. B) go run (*)
17. C) go install
18. D) go exec
19. Explanation: `go run` compiles to a temp directory and immediately executes the resulting binary, then cleans up.
20. Q3: What is the minimum required file to start a Go module?
21. A) Makefile
22. B) main.go only
23. C) go.mod (*)
24. D) go.sum
25. Explanation: `go mod init <path>` creates go.mod, which declares the module path and Go version; main.go alone won't compile in module-aware mode (Go 1.16+).
26. Q4: Which package must a Go file declare to produce an executable binary?
27. A) package app with a func Run()
28. B) package exe with a func Start()
29. C) package bin with a func Execute()
30. D) package main with a func main() (*)
31. Explanation: The linker produces an executable only when the entry package is `main` and exports a `func main()` (optionally with `func init()`).
32. Q5: What does `go mod tidy` do?
33. A) Adds missing and removes unused dependencies (*)
34. B) Reformats go.mod for readability
35. C) Downloads all transitive module sources
36. D) Compiles all test files
37. Explanation: `go mod tidy` reconciles go.mod and go.sum with the actual imports in the source tree, adding needed modules and pruning unused ones.
38. Q6: Why are Go binaries typically large but deployment-friendly?
39. A) They are written in interpreted bytecode
40. B) They bundle the runtime and dependencies as a static binary (*)
41. C) They require installing a JVM first
42. D) They ship as a zip of .go files
43. Explanation: Go links the runtime, dependencies, and required type info into one static binary, so deployments are a single file with no shared-lib requirements.
44. Q7: Which command adds a new third-party dependency to your module?
45. A) go add
46. B) go install pkg
47. C) go get <pkg> (*)
48. D) go pull <pkg>
49. Explanation: `go get golang.org/x/time/rate` (or `go get foo@v1.2.3`) updates go.mod and go.sum with the new requirement.
50. Q8: What is the entry point of a Go program?
51. A) func start()
52. B) func init() in any package
53. C) func Main() in package app
54. D) func main() in package main (*)
55. Explanation: The runtime calls `main.main` after all `init()` functions run; only `package main` with `func main()` produces an executable.
56. Q9: Which tool enforces canonical Go formatting?
57. A) gofmt (*)
58. B) goimports only
59. C) clang-format
60. D) prettier
61. Explanation: `gofmt` (and `go fmt ./...`) applies the canonical Go style; `goimports` adds auto-import management on top of gofmt.
62. Q10: Where does `go install` place the resulting binary by default?
63. A) The current directory
64. B) $GOBIN (often $HOME/go/bin) (*)
65. C) /usr/local/bin
66. D) $GOROOT/bin
67. Explanation: `go install` compiles and copies the binary to `$GOBIN` (defaulting to `$GOPATH/bin`, typically `$HOME/go/bin`), which should be on your PATH.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Who designed Go at Google?
  options:
    - Rob Pike, Robert Griesemer, and Ken Thompson
    - Bjarne Stroustrup and Herb Sutter
    - James Gosling and Bill Joy
    - Guido van Rossum and Brett Cannon
  correctIndex: 0
  explanation: Griesemer, Pike, and Thompson began Go in 2007 to address build-time and complexity problems with C++ at Google scale.
- id: q2
  question: Which command runs a Go program without leaving a binary on disk?
  options:
    - go build
    - go run
    - go install
    - go exec
  correctIndex: 1
  explanation: "`go run` compiles to a temp directory and immediately executes the resulting binary, then cleans up."
- id: q3
  question: What is the minimum required file to start a Go module?
  options:
    - Makefile
    - main.go only
    - go.mod
    - go.sum
  correctIndex: 2
  explanation: "`go mod init <path>` creates go.mod, which declares the module path and Go version; main.go alone won't compile in module-aware mode (Go 1.16+)."
- id: q4
  question: Which package must a Go file declare to produce an executable binary?
  options:
    - package app with a func Run()
    - package exe with a func Start()
    - package bin with a func Execute()
    - package main with a func main()
  correctIndex: 3
  explanation: The linker produces an executable only when the entry package is `main` and exports a `func main()` (optionally with `func init()`).
- id: q5
  question: What does `go mod tidy` do?
  options:
    - Adds missing and removes unused dependencies
    - Reformats go.mod for readability
    - Downloads all transitive module sources
    - Compiles all test files
  correctIndex: 0
  explanation: "`go mod tidy` reconciles go.mod and go.sum with the actual imports in the source tree, adding needed modules and pruning unused ones."
- id: q6
  question: Why are Go binaries typically large but deployment-friendly?
  options:
    - They are written in interpreted bytecode
    - They bundle the runtime and dependencies as a static binary
    - They require installing a JVM first
    - They ship as a zip of .go files
  correctIndex: 1
  explanation: Go links the runtime, dependencies, and required type info into one static binary, so deployments are a single file with no shared-lib requirements.
- id: q7
  question: Which command adds a new third-party dependency to your module?
  options:
    - go add
    - go install pkg
    - go get <pkg>
    - go pull <pkg>
  correctIndex: 2
  explanation: "`go get golang.org/x/time/rate` (or `go get foo@v1.2.3`) updates go.mod and go.sum with the new requirement."
- id: q8
  question: What is the entry point of a Go program?
  options:
    - func start()
    - func init() in any package
    - func Main() in package app
    - func main() in package main
  correctIndex: 3
  explanation: The runtime calls `main.main` after all `init()` functions run; only `package main` with `func main()` produces an executable.
- id: q9
  question: Which tool enforces canonical Go formatting?
  options:
    - gofmt
    - goimports only
    - clang-format
    - prettier
  correctIndex: 0
  explanation: "`gofmt` (and `go fmt ./...`) applies the canonical Go style; `goimports` adds auto-import management on top of gofmt."
- id: q10
  question: Where does `go install` place the resulting binary by default?
  options:
    - The current directory
    - $GOBIN (often $HOME/go/bin)
    - /usr/local/bin
    - $GOROOT/bin
  correctIndex: 1
  explanation: "`go install` compiles and copies the binary to `$GOBIN` (defaulting to `$GOPATH/bin`, typically `$HOME/go/bin`), which should be on your PATH."
```

