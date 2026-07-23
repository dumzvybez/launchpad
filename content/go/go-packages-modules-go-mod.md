---
slug: go-packages-modules-go-mod
id: go-15
track: go
order: 15
title: Packages, Modules, and go mod
description: Structure Go code into packages and modules, master the go.mod file (require, replace, retract, exclude), understand semantic import versioning, and publish modules to a registry.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=11200s
whyItMatters: Structure Go code into packages and modules, master the go. mod file (require, replace, retract, exclude), understand semantic import versioning, and publish modules to a registry.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Packages, Modules, and go mod

## Packages, Modules, and go mod

### Why It Matters

Structure Go code into packages and modules, master the go. mod file (require, replace, retract, exclude), understand semantic import versioning, and publish modules to a registry.

Structure Go code into packages and modules, master the go.mod file (require, replace, retract, exclude), understand semantic import versioning, and publish modules to a registry.

### Prerequisites

- Stage 14: Generics (Go 1.18+).
- Comfort with `go mod init` and `go get`.

### Topics

- Package layout: one package per directory, package name = directory basename
- Internal packages (`internal/`) — restricted import visibility
- Module paths and semantic import versioning (/v2, /v3 for major bumps)
- go.mod: module, go, require, replace, exclude, retract
- go.sum and the verification hash chain
- Module proxies, GOPROXY, GONOSUMCHECK, GOFLAGS
- Vendoring (go mod vendor) for reproducible builds
- Publishing: tagging git, GOPROXY=proxy.golang.org, the pkg.go.dev index

### Key Concepts

- A module is a versioned unit (one go.mod); a package is a directory within it. Modules are versioned; packages aren't.
- Semantic import versioning: a v2+ module MUST have `/v2` (or higher) in its import path, so v1 and v2 can coexist in one binary.
- The `internal/` directory is special — packages under it can only be imported from within the module subtree rooted at the parent of `internal/`.
- go.sum records the cryptographic hash of each module's zip; verification prevents supply-chain tampering.
- Module proxies (GOPROXY) cache and serve modules; you can run your own (Athens) or use the default proxy.golang.org.

```text
example.com/myapp/
├── go.mod              # module example.com/myapp
├── go.sum
├── main.go             # package main
├── internal/           # only importable from within example.com/myapp
│   └── store/
│       └── store.go    # package store
├── api/
│   ├── handler.go      # package api
│   └── types.go
└── cmd/
    └── myapp/
        └── main.go     # package main (a second binary)
```
Caption: Module layout

### Common Pitfalls

- Forgetting the /v2 suffix on a major bump — Go's module system requires it; without it, v1 and v2 collide and tools refuse to resolve.
- Importing from `internal/` outside the allowed subtree — compile error; `internal/` is only visible within the module subtree rooted at the parent of `internal/`.
- Mixing `go mod tidy` and `go mod vendor` incorrectly — after `go mod vendor`, builds use `vendor/`; if you change deps, re-run `go mod tidy && go mod vendor`.
- Tagging a non-HEAD commit — `git tag v1.0.0 <commit>` publishes an older commit; double-check `git log --oneline -1 v1.0.0` matches HEAD.
- Depending on `latest` — `go get foo@latest` is fine for dev, but check in a specific version in go.mod to ensure reproducible builds.

### Real-World Applications

- The Go standard library itself is split into `golang.org/x/...` submodules (x/sys, x/net, x/tools) each independently versioned.
- Kubernetes publishes dozens of modules (k8s.io/api, k8s.io/client-go, k8s.io/apimachinery) with strict semver and a custom k8s.io/* module proxy.
- HashiCorp's libraries (go.uber.org/multierr, go.uber.org/zap) use vanity URLs (go.uber.org) with their own vanity server redirecting to GitHub.
- Docker's moby project uses a multi-module layout with vendor/ checked in for reproducible downstream builds.

### Interview Questions

- 1. What's the difference between a package and a module? — A module is a versioned collection of packages with one go.mod at the root; a package is a directory of .go files within a module. Modules are versioned; packages aren't.
- 2. Why does Go require /v2 in the import path for major bumps? — So v1 and v2 can coexist in the same binary (e.g., during incremental migration) without import-path collisions.
- 3. What's special about the internal/ directory? — Packages under `internal/` can only be imported from within the module subtree rooted at the parent of `internal/`, enforcing encapsulation.
- 4. What's in go.sum and why does it matter? — Cryptographic hashes (h1:...) of each module's zip and mod file; the toolchain verifies them on download to prevent supply-chain tampering.
- 5. What does GOPROXY do? — Configures the module proxy URL(s); proxy.golang.org is the default, caching and serving modules. Set GOPROXY=off for air-gapped builds or to a private Athens instance.

### Mini Project

Build a Multi-Package Math Library and Publish It: A small `mathkit` module with sub-packages `mathkit/stats` (Mean, Median, StdDev), `mathkit/vec` (generic Vector[T]), and `mathkit/internal/curve` (spline helper), with a tag v1.0.0 published via a local git remote. Suggested approach:
  - `go mod init example.com/mathkit`
  - Create three sub-packages and write table-driven tests
  - Verify `internal/curve` is unimportable from a fake external module
  - Tag v1.0.0 and run `go list -m -versions` to confirm
  - Add a `replace` directive in a demo app to develop locally

### Exercises

1. Create a module with `internal/` subpackages and confirm an external import is rejected.
2. Bump a module from v1 to v2 with the /v2 suffix; verify both can coexist.
3. Run `go mod vendor` and inspect the vendor/ directory; confirm `go build -mod=vendor` works.
4. Use `replace github.com/foo/bar => ./local/bar` to develop a dependency locally.
5. Tag a release, run `go list -m -versions`, and verify the version appears.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the difference between a Go package and a module?
9. A) They're the same
10. B) A package contains multiple modules
11. C) A module is a versioned collection of packages with one go.mod (*)
12. D) Modules live inside packages
13. Explanation: A module is the versioned unit (one go.mod at root); a package is a directory of .go files within a module. Modules are versioned; packages are not.
14. Q2: For a v2 module, what must the import path contain?
15. A) @v2
16. B) -v2
17. C) _v2
18. D) /v2 (*)
19. Explanation: Semantic import versioning requires v2+ modules to include `/v2` (or `/v3`, etc.) in the import path so v1 and v2 can coexist in one binary.
20. Q3: What's special about the `internal/` directory?
21. A) Packages under it are only importable within the parent's module subtree (*)
22. B) It's encrypted
23. C) It's not compiled
24. D) It must contain only test files
25. Explanation: `internal/` enforces encapsulation: its packages can only be imported from code rooted at the directory that is the parent of `internal/`.
26. Q4: What does go.sum contain?
27. A) Module source code
28. B) Cryptographic hashes of each module's zip and mod file (*)
29. C) Module versions only
30. D) License information
31. Explanation: go.sum records h1:... hashes of module zips and go.mod files; the toolchain verifies them on download to prevent supply-chain tampering.
32. Q5: What does `go mod vendor` do?
33. A) Publishes your module to a vendor
34. B) Removes unused dependencies
35. C) Copies all dependencies into a vendor/ directory for offline/reproducible builds (*)
36. D) Adds new dependencies
37. Explanation: `go mod vendor` populates `vendor/` with all transitive dependencies so subsequent builds can run with `-mod=vendor` without a network.
38. Q6: Which directive in go.mod lets you substitute a dependency with a local path?
39. A) exclude
40. B) retract
41. C) local
42. D) replace (*)
43. Explanation: `replace github.com/foo/bar => ../bar` swaps the upstream dependency for a local path during development. Use `replace ... => ... v0.0.0` for a different version.
44. Q7: What does the retract directive mark?
45. A) Versions that should not be used (known-broken releases) (*)
46. B) Removed packages
47. C) Internal packages
48. D) Deprecated APIs
49. Explanation: `retract [v1.5.0]` (or `retract v1.5.0 // reason`) marks a published version as retracted; tooling warns users who upgrade to or stay on it.
50. Q8: Which command adds a dependency at a specific version?
51. A) go install foo@v1.2.3
52. B) go get foo@v1.2.3 (*)
53. C) go add foo@v1.2.3
54. D) go dep foo@v1.2.3
55. Explanation: `go get foo@v1.2.3` updates go.mod and go.sum to require that version. `go install foo@v1.2.3` installs a binary tool, not a dependency.
56. Q9: Where do packages default-published via a git tag appear?
57. A) npmjs.com
58. B) godoc.org only
59. C) pkg.go.dev (after the proxy fetches the tag) (*)
60. D) GitHub Packages
61. Explanation: Tagging a release (e.g., git tag v1.0.0; git push --tags) makes proxy.golang.org fetch, hash, and index it; pkg.go.dev renders the docs.
62. Q10: Why does Go require /v2 on a major version bump?
63. A) Performance
64. B) To match npm conventions
65. C) It's optional
66. D) So v1 and v2 can coexist in the same binary via distinct import paths (*)
67. Explanation: Distinct import paths let a single binary import both v1 and v2 (during incremental migration) without collision — the core reason for semantic import versioning.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the difference between a Go package and a module?
  options:
    - They're the same
    - A package contains multiple modules
    - A module is a versioned collection of packages with one go.mod
    - Modules live inside packages
  correctIndex: 2
  explanation: A module is the versioned unit (one go.mod at root); a package is a directory of .go files within a module. Modules are versioned; packages are not.
- id: q2
  question: For a v2 module, what must the import path contain?
  options:
    - "@v2"
    - -v2
    - _v2
    - /v2
  correctIndex: 3
  explanation: Semantic import versioning requires v2+ modules to include `/v2` (or `/v3`, etc.) in the import path so v1 and v2 can coexist in one binary.
- id: q3
  question: What's special about the `internal/` directory?
  options:
    - Packages under it are only importable within the parent's module subtree
    - It's encrypted
    - It's not compiled
    - It must contain only test files
  correctIndex: 0
  explanation: "`internal/` enforces encapsulation: its packages can only be imported from code rooted at the directory that is the parent of `internal/`."
- id: q4
  question: What does go.sum contain?
  options:
    - Module source code
    - Cryptographic hashes of each module's zip and mod file
    - Module versions only
    - License information
  correctIndex: 1
  explanation: go.sum records h1:... hashes of module zips and go.mod files; the toolchain verifies them on download to prevent supply-chain tampering.
- id: q5
  question: What does `go mod vendor` do?
  options:
    - Publishes your module to a vendor
    - Removes unused dependencies
    - Copies all dependencies into a vendor/ directory for offline/reproducible builds
    - Adds new dependencies
  correctIndex: 2
  explanation: "`go mod vendor` populates `vendor/` with all transitive dependencies so subsequent builds can run with `-mod=vendor` without a network."
- id: q6
  question: Which directive in go.mod lets you substitute a dependency with a local path?
  options:
    - exclude
    - retract
    - local
    - replace
  correctIndex: 3
  explanation: "`replace github.com/foo/bar => ../bar` swaps the upstream dependency for a local path during development. Use `replace ... => ... v0.0.0` for a different version."
- id: q7
  question: What does the retract directive mark?
  options:
    - Versions that should not be used (known-broken releases)
    - Removed packages
    - Internal packages
    - Deprecated APIs
  correctIndex: 0
  explanation: "`retract [v1.5.0]` (or `retract v1.5.0 // reason`) marks a published version as retracted; tooling warns users who upgrade to or stay on it."
- id: q8
  question: Which command adds a dependency at a specific version?
  options:
    - go install foo@v1.2.3
    - go get foo@v1.2.3
    - go add foo@v1.2.3
    - go dep foo@v1.2.3
  correctIndex: 1
  explanation: "`go get foo@v1.2.3` updates go.mod and go.sum to require that version. `go install foo@v1.2.3` installs a binary tool, not a dependency."
- id: q9
  question: Where do packages default-published via a git tag appear?
  options:
    - npmjs.com
    - godoc.org only
    - pkg.go.dev (after the proxy fetches the tag)
    - GitHub Packages
  correctIndex: 2
  explanation: Tagging a release (e.g., git tag v1.0.0; git push --tags) makes proxy.golang.org fetch, hash, and index it; pkg.go.dev renders the docs.
- id: q10
  question: Why does Go require /v2 on a major version bump?
  options:
    - Performance
    - To match npm conventions
    - It's optional
    - So v1 and v2 can coexist in the same binary via distinct import paths
  correctIndex: 3
  explanation: Distinct import paths let a single binary import both v1 and v2 (during incremental migration) without collision — the core reason for semantic import versioning.
```

