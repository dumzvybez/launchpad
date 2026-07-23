---
slug: go-testing-table-driven-tests-benchmarks-fuzzing
id: go-16
track: go
order: 16
title: Testing — table-driven tests, benchmarks, fuzzing
description: Write idiomatic Go tests with the testing package — table-driven tests, benchmarks, subtests with t.Run, the Go 1.18+ fuzzing harness, and test coverage analysis.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=12000s
whyItMatters: Write idiomatic Go tests with the testing package — table-driven tests, benchmarks, subtests with t. Run, the Go 1.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Testing — table-driven tests, benchmarks, fuzzing

## Testing — table-driven tests, benchmarks, fuzzing

### Why It Matters

Write idiomatic Go tests with the testing package — table-driven tests, benchmarks, subtests with t. Run, the Go 1.

Write idiomatic Go tests with the testing package — table-driven tests, benchmarks, subtests with t.Run, the Go 1.18+ fuzzing harness, and test coverage analysis.

### Prerequisites

- Stage 15: Packages, Modules, and go mod.
- Comfort writing Go functions and packages.

### Topics

- The testing package: func TestXxx(t *testing.T)
- Table-driven tests with t.Run subtests
- t.Helper, t.Cleanup, t.Setenv, t.TempDir
- Benchmarks: func BenchmarkXxx(b *testing.B) with b.ResetTimer, b.ReportAllocs
- Fuzzing (Go 1.18+): func FuzzXxx(f *testing.F) with f.Add seeds and f.Fuzz
- Coverage: go test -cover, -coverprofile, -coverpkg
- Test main and setup/teardown: TestMain(m *testing.M)
- testify, gomock, and other ecosystem libraries

### Key Concepts

- Table-driven tests are the Go idiom: define a slice of struct{ name, input, want }, loop with `t.Run(tc.name, ...)`.
- `t.Run` creates a subtest with its own name; failing a subtest doesn't abort the parent unless you use `t.Fatal` in a parent helper.
- Benchmarks use `b.N` iterations the runtime tunes; always `b.ResetTimer()` after setup and `b.ReportAllocs()` for allocation counts.
- Go 1.18+ native fuzzing: `func FuzzXxx(f *testing.F)` with corpus seeds via `f.Add(...)` and `f.Fuzz(func(t *testing.T, ...) { ... })`.
- Coverage reports what's executed, not what's verified — 100% coverage doesn't mean 100% correctness.

```go
func TestAdd(t *testing.T) {
    cases := []struct {
        name    string
        a, b, want int
    }{
        {"positive", 2, 3, 5},
        {"negative", -2, -3, -5},
        {"zero", 0, 0, 0},
    }
    for _, tc := range cases {
        t.Run(tc.name, func(t *testing.T) {
            got := Add(tc.a, tc.b)
            if got != tc.want {
                t.Errorf("Add(%d, %d) = %d; want %d", tc.a, tc.b, got, tc.want)
            }
        })
    }
}
```
Caption: Table-driven test

### Common Pitfalls

- Calling t.Fatal inside a subtest from a helper — t.Fatal aborts only the current goroutine; use t.Error + return or pass *testing.T to helpers carefully.
- Forgetting b.ResetTimer after benchmark setup — setup time counts against you; always reset before the hot loop.
- Treating 100% coverage as 100% correctness — coverage shows what ran, not what assertions were made; pair with mutation testing for real confidence.
- Not seeding the fuzz corpus — `f.Add` seeds guide the fuzzer toward interesting inputs; without seeds, fuzzing starts from random bytes and finds fewer bugs.
- Reading env vars without t.Setenv — `os.Setenv` leaks across tests; `t.Setenv("KEY", "value")` automatically restores the original on test exit.

### Real-World Applications

- The Go standard library has one of the highest test-coverage ratios of any stdlib; the runtime tests alone number in the thousands.
- Kubernetes uses ginkgo + gomega for behavior tests, but the unit tests are plain testing package table-driven tests.
- HashiCorp tools (Terraform, Vault) ship extensive table-driven acceptance tests, including parallel-safe variants via t.Parallel.
- The Go team runs continuous fuzzing on the standard library; Go 1.18+ shipped with hundreds of seed corpora in the repo.

### Interview Questions

- 1. What's the idiomatic Go test style? — Table-driven: define a slice of struct cases, loop with t.Run(tc.name, func(t *testing.T) { ... }) for subtest isolation.
- 2. What's the difference between t.Error and t.Fatal? — t.Error marks failure and continues; t.Fatal marks failure and immediately stops the current test (or subtest).
- 3. How does b.N work in benchmarks? — The runtime runs the benchmark with increasing b.N until it has a stable measurement; you write `for i := 0; i < b.N; i++ { ... }`.
- 4. What does Go 1.18+ native fuzzing add? — `func FuzzXxx(f *testing.F)` with `f.Add(seeds...)` and `f.Fuzz(func(t *testing.T, ...) { ... })`; corpus is stored in testdata/fuzz/ for regression.
- 5. Why prefer t.Setenv over os.Setenv? — t.Setenv records the original value and restores it on test exit (via t.Cleanup), preventing cross-test pollution when tests run in the same process.

### Mini Project

Build a Markdown Link Checker with Tests, Benchmarks, and Fuzz Targets: A library `mdcheck` that extracts [text](url) links from a Markdown string, returns them as a slice, plus unit tests (table-driven), a benchmark comparing regex vs hand-parser, and a fuzz target ensuring the parser never panics on arbitrary input. Suggested approach:
  - Define `func Links(md string) []Link`
  - Table-driven tests covering nested brackets, edge cases, and invalid input
  - Benchmark regex-based vs hand-rolled parser; compare allocs
  - Fuzz target calls Links on random []byte, fails only on panic
  - Run `go test -cover` and aim for ≥85% coverage on the parser

### Exercises

1. Convert a hand-written test with three asserts into a table-driven test with t.Run subtests.
2. Write a benchmark comparing `string +` vs `strings.Builder` for N concatenations; report allocs.
3. Add a fuzz target for a parser that should never panic; seed with at least 3 inputs.
4. Use t.Setenv to mock a config env var, and verify it's restored after the test.
5. Generate a coverage profile, view it in the browser, and find a missed branch.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which signature is a valid Go test function?
9. A) func testAdd(t *testing.T)
10. B) func TestAdd(t testing.T)
11. C) func AddTest(t *T)
12. D) func TestAdd(t *testing.T) (*)
13. Explanation: Test functions start with `Test`, take `*testing.T`, and have no return value: `func TestAdd(t *testing.T)`. Subtests use the same signature with t.Run.
14. Q2: What's the idiomatic Go test style?
15. A) Table-driven tests with t.Run subtests (*)
16. B) BDD with describe/it
17. C) JUnit-style @Test annotations
18. D) AssertJ-style fluent assertions
19. Explanation: Table-driven: a slice of struct cases, each run via `t.Run(tc.name, func(t *testing.T) { ... })` for isolation and named output.
20. Q3: What's the difference between t.Error and t.Fatal?
21. A) None
22. B) t.Error continues the test; t.Fatal stops immediately (*)
23. C) t.Error is for warnings; t.Fatal is for errors
24. D) t.Fatal logs less
25. Explanation: `t.Errorf` marks failure and continues; `t.Fatalf` marks failure and immediately exits the current test/subtest via runtime.Goexit.
26. Q4: In a benchmark, what is b.N?
27. A) A constant
28. B) The number of CPU cores
29. C) The number of iterations the runtime chose for stable measurement (*)
30. D) The number of test cases
31. Explanation: The runtime runs the benchmark with increasing b.N until variance is acceptable; you write `for i := 0; i < b.N; i++` to do the measured work.
32. Q5: Which call resets the benchmark timer after setup?
33. A) b.Stop()
34. B) b.Restart()
35. C) b.Clear()
36. D) b.ResetTimer() (*)
37. Explanation: `b.ResetTimer()` discards time accumulated during setup so only the hot loop is measured; `b.ReportAllocs()` adds allocation counts.
38. Q6: Which Go version introduced native fuzzing?
39. A) 1.18 (*)
40. B) 1.16
41. C) 1.20
42. D) 1.21
43. Explanation: Go 1.18 (March 2022) shipped native fuzzing: `func FuzzXxx(f *testing.F)`, `f.Add(seeds...)`, `f.Fuzz(func(t *testing.T, ...) { ... })`.
44. Q7: What does f.Add do in a fuzz test?
45. A) Adds a new test
46. B) Seeds the fuzz corpus with example inputs (*)
47. C) Adds a benchmark
48. D) Adds a subtest
49. Explanation: `f.Add(...)` adds seed inputs to the corpus, guiding the fuzzer toward interesting regions; discovered crashing inputs are saved to testdata/fuzz/ for regression.
50. Q8: Which command produces a coverage profile?
51. A) go cover -profile=cover.out
52. B) go test -coverage cover.out
53. C) go test -cover -coverprofile=cover.out (*)
54. D) go tool cover cover.out
55. Explanation: `go test -cover -coverprofile=cover.out ./...` writes per-line coverage; `go tool cover -html=cover.out` renders it, `-func=cover.out` prints per-function %.
56. Q9: Why prefer t.Setenv over os.Setenv in tests?
57. A) t.Setenv is faster
58. B) os.Setenv is deprecated
59. C) t.Setenv is parallel-safe
60. D) t.Setenv auto-restores the original value on test exit (*)
61. Explanation: `t.Setenv(k, v)` records the prior value and registers a cleanup that restores it, preventing cross-test pollution. Note: t.Setenv implies the test can't be t.Parallel.
62. Q10: Does 100% line coverage guarantee correctness?
63. A) No — coverage shows what ran, not what assertions verified; pair with property tests/mutation testing (*)
64. B) Yes
65. C) Only in Go
66. D) Only for table-driven tests
67. Explanation: Coverage measures execution, not assertion quality. A test that runs a branch with no asserts counts as covered; pair with mutation testing or property/fuzz tests for real confidence.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which signature is a valid Go test function?
  options:
    - func testAdd(t *testing.T)
    - func TestAdd(t testing.T)
    - func AddTest(t *T)
    - func TestAdd(t *testing.T)
    - "`. Subtests use the same signature with t.Run."
  correctIndex: 3
  explanation: "Test functions start with `Test`, take `*testing.T`, and have no return value: `func TestAdd(t *testing.T)`. Subtests use the same signature with t.Run."
- id: q2
  question: What's the idiomatic Go test style?
  options:
    - Table-driven tests with t.Run subtests
    - BDD with describe/it
    - JUnit-style @Test annotations
    - AssertJ-style fluent assertions
    - "{ ... })` for isolation and named output."
  correctIndex: 0
  explanation: "Table-driven: a slice of struct cases, each run via `t.Run(tc.name, func(t *testing.T) { ... })` for isolation and named output."
- id: q3
  question: What's the difference between t.Error and t.Fatal?
  options:
    - None
    - t.Error continues the test; t.Fatal stops immediately
    - t.Error is for warnings; t.Fatal is for errors
    - t.Fatal logs less
  correctIndex: 1
  explanation: "`t.Errorf` marks failure and continues; `t.Fatalf` marks failure and immediately exits the current test/subtest via runtime.Goexit."
- id: q4
  question: In a benchmark, what is b.N?
  options:
    - A constant
    - The number of CPU cores
    - The number of iterations the runtime chose for stable measurement
    - The number of test cases
  correctIndex: 2
  explanation: The runtime runs the benchmark with increasing b.N until variance is acceptable; you write `for i := 0; i < b.N; i++` to do the measured work.
- id: q5
  question: Which call resets the benchmark timer after setup?
  options:
    - b.Stop()
    - b.Restart()
    - b.Clear()
    - b.ResetTimer()
  correctIndex: 3
  explanation: "`b.ResetTimer()` discards time accumulated during setup so only the hot loop is measured; `b.ReportAllocs()` adds allocation counts."
- id: q6
  question: Which Go version introduced native fuzzing?
  options:
    - "1.18"
    - "1.16"
    - "1.20"
    - "1.21"
    - "`, `f.Add(seeds...)`, `f.Fuzz(func(t *testing.T, ...) { ... })`."
  correctIndex: 0
  explanation: "Go 1.18 (March 2022) shipped native fuzzing: `func FuzzXxx(f *testing.F)`, `f.Add(seeds...)`, `f.Fuzz(func(t *testing.T, ...) { ... })`."
- id: q7
  question: What does f.Add do in a fuzz test?
  options:
    - Adds a new test
    - Seeds the fuzz corpus with example inputs
    - Adds a benchmark
    - Adds a subtest
  correctIndex: 1
  explanation: "`f.Add(...)` adds seed inputs to the corpus, guiding the fuzzer toward interesting regions; discovered crashing inputs are saved to testdata/fuzz/ for regression."
- id: q8
  question: Which command produces a coverage profile?
  options:
    - go cover -profile=cover.out
    - go test -coverage cover.out
    - go test -cover -coverprofile=cover.out
    - go tool cover cover.out
  correctIndex: 2
  explanation: "`go test -cover -coverprofile=cover.out ./...` writes per-line coverage; `go tool cover -html=cover.out` renders it, `-func=cover.out` prints per-function %."
- id: q9
  question: Why prefer t.Setenv over os.Setenv in tests?
  options:
    - t.Setenv is faster
    - os.Setenv is deprecated
    - t.Setenv is parallel-safe
    - t.Setenv auto-restores the original value on test exit
  correctIndex: 3
  explanation: "`t.Setenv(k, v)` records the prior value and registers a cleanup that restores it, preventing cross-test pollution. Note: t.Setenv implies the test can't be t.Parallel."
- id: q10
  question: Does 100% line coverage guarantee correctness?
  options:
    - No — coverage shows what ran, not what assertions verified; pair with property tests/mutation testing
    - Yes
    - Only in Go
    - Only for table-driven tests
  correctIndex: 0
  explanation: Coverage measures execution, not assertion quality. A test that runs a branch with no asserts counts as covered; pair with mutation testing or property/fuzz tests for real confidence.
```

