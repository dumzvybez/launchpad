---
slug: go-error-handling-patterns-errors-errors-wrapping
id: go-13
track: go
order: 13
title: Error Handling Patterns — errors.Is, errors.As, wrapping
description: Master modern Go error handling — wrapping with %w, inspecting with errors.Is and errors.As, sentinel errors, custom error types, and the errors.Join (1.20+) multi-error combiner.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=9600s
whyItMatters: Master modern Go error handling — wrapping with %w, inspecting with errors. Is and errors.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Error Handling Patterns — errors.Is, errors.As, wrapping

## Error Handling Patterns — errors.Is, errors.As, wrapping

### Why It Matters

Master modern Go error handling — wrapping with %w, inspecting with errors. Is and errors.

Master modern Go error handling — wrapping with %w, inspecting with errors.Is and errors.As, sentinel errors, custom error types, and the errors.Join (1.20+) multi-error combiner.

### Prerequisites

- Stage 12: The context Package and Cancellation.
- Comfort with the error interface.

### Topics

- Sentinel errors: var ErrXxx = errors.New("...")
- Wrapping with fmt.Errorf("...: %w", err)
- errors.Is — check for a specific error in the chain
- errors.As — extract a typed error from the chain
- Custom error types implementing the error interface
- The Unwrap() error method for custom chains
- errors.Join (Go 1.20+) — combine multiple errors
- panic vs error — when to use each, and recover at API boundaries

### Key Concepts

- Wrapping (`%w`) preserves the cause chain; the wrapped error can be retrieved via `errors.Unwrap` and tested via `errors.Is`/`errors.As`.
- `errors.Is(err, target)` walks the chain (calling Unwrap recursively) and reports whether any error in the chain matches target by equality.
- `errors.As(err, &target)` walks the chain and assigns the first error of the target's type to target; used for extracting structured error info.
- Sentinel errors (`io.EOF`, `sql.ErrNoRows`) are package-level vars; compare with `errors.Is`, not `==`, to support wrapping.
- `errors.Join(e1, e2, ...)` (Go 1.20+) creates a single error that Unwraps to a `[]error`; `errors.Is`/`As` walk all branches.

```go
var ErrNotFound = errors.New("not found")

func Fetch(id int) (*User, error) {
    if id == 0 {
        return nil, fmt.Errorf("Fetch(%d): %w", id, ErrNotFound)
    }
    return &User{ID: id}, nil
}

u, err := Fetch(0)
if errors.Is(err, ErrNotFound) { // TRUE — %w preserved the chain
    log.Println("user missing")
}
```
Caption: Sentinel + wrap + Is

### Common Pitfalls

- Comparing wrapped errors with `==` — `err == io.EOF` is false if err was wrapped; use `errors.Is(err, io.EOF)` to walk the chain.
- Wrapping with `%v` instead of `%w` — `%v` formats the cause as a string but breaks the chain; `errors.Is`/`As` won't find the cause.
- Returning sensitive info in error messages — don't put passwords, tokens, or PII in errors; they may be logged or returned to clients.
- Sentinel errors that are too granular — prefer a small set of well-named sentinels (ErrNotFound, ErrConflict) plus typed errors for structured detail.
- Not implementing Unwrap on custom multi-errors — pre-1.20, this required Is/As methods; Go 1.20+ supports `Unwrap() []error` natively.

### Real-World Applications

- The database/sql package defines `sql.ErrNoRows`, `sql.ErrConnDone`, `sql.ErrTxDone` — all sentinel errors checked via `errors.Is` after wrapping.
- gRPC-Go's `status.Code(err)` uses errors.As to extract a `*status.Status` from wrapped errors, mapping Go errors to gRPC codes.
- HashiCorp's go-multierror (pre-1.20) was the canonical multi-error library; Go 1.20's errors.Join covers most use cases natively.
- Kubernetes API errors (`apierrors.IsNotFound`, `IsConflict`) wrap HTTP responses into typed errors that callers inspect with errors.As.

### Interview Questions

- 1. What's the difference between `%v` and `%w` in fmt.Errorf? — `%v` formats the cause as a string (breaks the chain); `%w` wraps the cause, preserving the chain so errors.Is/As can walk it.
- 2. What does errors.Is do? — Walks the error chain (via Unwrap) and reports whether any error in the chain equals the target sentinel; use this instead of `==`.
- 3. What does errors.As do? — Walks the chain and assigns the first error of the target's type to the target pointer; used to extract structured info from wrapped errors.
- 4. What's a sentinel error? — A package-level error variable (e.g., io.EOF, sql.ErrNoRows) that callers compare against via errors.Is to detect specific conditions.
- 5. What does errors.Join do? — Combines multiple errors into one whose Unwrap returns a []error; errors.Is/As walk all branches. Returns nil if all inputs are nil.

### Mini Project

Build a Config Validator with Typed Errors: A library that validates a `Config` struct field-by-field, accumulating errors via errors.Join, and exposes typed `ValidationError` errors that callers can extract with errors.As to render per-field error UI. Suggested approach:
  - Define `type ValidationError struct { Field, Reason string }` with `Error() string`
  - Run each check, append `*ValidationError` (or nil) to a slice
  - Return `errors.Join(errs...)` — automatically nil if all nil
  - Caller does `var ve *ValidationError; if errors.As(err, &ve) { ... }`
  - Add a test confirming a 3-error result yields a joined error whose `Error()` mentions all fields

### Exercises

1. Wrap io.EOF with `fmt.Errorf("...: %w", io.EOF)` and confirm `errors.Is(err, io.EOF)` is true; redo with `%v` and confirm it's false.
2. Define a custom error type, return it from a function, and extract it with errors.As in the caller.
3. Use errors.Join to combine 3 errors; verify errors.As walks to find one of them.
4. Implement Unwrap() []error on a custom MultiError type (Go 1.20+).
5. Refactor a sentinel `==` comparison in existing code to use errors.Is.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which verb in fmt.Errorf wraps the cause, preserving the chain?
9. A) %w (*)
10. B) %v
11. C) %s
12. D) %e
13. Explanation: `%w` wraps the cause so errors.Is and errors.As can walk the chain. `%v` and `%s` format the cause as a string and break the chain.
14. Q2: What does errors.Is(err, target) do?
15. A) Returns err if it equals target
16. B) Walks the chain (Unwrap) and reports whether any error equals target (*)
17. C) Compares types only
18. D) Always returns true
19. Explanation: `errors.Is` recursively unwraps err and compares each level to target (using each error's Is method if defined); use it instead of `==` for wrapped errors.
20. Q3: What does errors.As(err, &target) do?
21. A) Casts err to target's type
22. B) Returns a bool only
23. C) Walks the chain and assigns the first error of target's type to target (*)
24. D) Panics on mismatch
25. Explanation: `errors.As` walks the chain and, if any error matches the type target points to, assigns it and returns true; otherwise returns false. Used to extract structured error info.
26. Q4: How should you compare against io.EOF in wrapped errors?
27. A) if err == io.EOF
28. B) if err.Error() == "EOF"
29. C) if strings.Contains(err.Error(), "EOF")
30. D) if errors.Is(err, io.EOF) (*)
31. Explanation: Always use `errors.Is(err, io.EOF)` — wrapping may have hidden io.EOF behind another error, and `==` won't walk the chain.
32. Q5: What's a sentinel error in Go?
33. A) A package-level error variable compared via errors.Is (*)
34. B) A panic
35. C) A type assertion
36. D) An error channel
37. Explanation: Sentinels are exported package-level error vars (io.EOF, sql.ErrNoRows, context.Canceled) that callers check via errors.Is to detect specific conditions.
38. Q6: What does errors.Join(e1, e2, e3) return?
39. A) The first non-nil error
40. B) A single error whose Unwrap returns a []error, or nil if all inputs are nil (*)
41. C) A string concatenation
42. D) A channel
43. Explanation: `errors.Join` combines errors; if all are nil, it returns nil. Otherwise it returns an error whose `Unwrap() []error` yields the non-nil inputs, walkable by errors.Is/As.
44. Q7: Which Go version introduced errors.Join?
45. A) 1.13
46. B) 1.18
47. C) 1.20 (*)
48. D) 1.22
49. Explanation: `errors.Join` and `Unwrap() []error` support shipped in Go 1.20 (February 2023), making multi-error handling standard-library native.
50. Q8: What method does a custom error type implement to integrate with the chain?
51. A) String() string only
52. B) Code() int
53. C) Is() bool
54. D) Error() string (to satisfy error); Unwrap() error or Unwrap() []error for chain support (*)
55. Explanation: Implementing `Error() string` satisfies the error interface. Implementing `Unwrap() error` (or `Unwrap() []error` in 1.20+) opts into chain walking by errors.Is/As.
56. Q9: What's a common security pitfall in error messages?
57. A) Leaking secrets (passwords, tokens, PII) into errors that get logged or returned to clients (*)
58. B) Too verbose
59. C) Using %w
60. D) Using sentinel errors
61. Explanation: Errors are often logged or returned to API clients; never embed credentials, tokens, or PII. Use opaque error codes for clients and detailed logs server-side.
62. Q10: Why avoid very granular sentinel errors?
63. A) They're slow
64. B) A small set of well-named sentinels plus typed errors for detail is easier to maintain and reason about (*)
65. C) They cause panics
66. D) Go doesn't allow them
67. Explanation: A handful of well-known sentinels (ErrNotFound, ErrConflict) plus typed errors (ValidationError, QuotaError) for structured detail scales better than dozens of fine-grained sentinels.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which verb in fmt.Errorf wraps the cause, preserving the chain?
  options:
    - "%w"
    - "%v"
    - "%s"
    - "%e"
  correctIndex: 0
  explanation: "`%w` wraps the cause so errors.Is and errors.As can walk the chain. `%v` and `%s` format the cause as a string and break the chain."
- id: q2
  question: What does errors.Is(err, target) do?
  options:
    - Returns err if it equals target
    - Walks the chain (Unwrap) and reports whether any error equals target
    - Compares types only
    - Always returns true
  correctIndex: 1
  explanation: "`errors.Is` recursively unwraps err and compares each level to target (using each error's Is method if defined); use it instead of `==` for wrapped errors."
- id: q3
  question: What does errors.As(err, &target) do?
  options:
    - Casts err to target's type
    - Returns a bool only
    - Walks the chain and assigns the first error of target's type to target
    - Panics on mismatch
  correctIndex: 2
  explanation: "`errors.As` walks the chain and, if any error matches the type target points to, assigns it and returns true; otherwise returns false. Used to extract structured error info."
- id: q4
  question: How should you compare against io.EOF in wrapped errors?
  options:
    - if err == io.EOF
    - if err.Error() == "EOF"
    - if strings.Contains(err.Error(), "EOF")
    - if errors.Is(err, io.EOF)
    - "` — wrapping may have hidden io.EOF behind another error, and `==` won't walk the chain."
  correctIndex: 3
  explanation: Always use `errors.Is(err, io.EOF)` — wrapping may have hidden io.EOF behind another error, and `==` won't walk the chain.
- id: q5
  question: What's a sentinel error in Go?
  options:
    - A package-level error variable compared via errors.Is
    - A panic
    - A type assertion
    - An error channel
  correctIndex: 0
  explanation: Sentinels are exported package-level error vars (io.EOF, sql.ErrNoRows, context.Canceled) that callers check via errors.Is to detect specific conditions.
- id: q6
  question: What does errors.Join(e1, e2, e3) return?
  options:
    - The first non-nil error
    - A single error whose Unwrap returns a []error, or nil if all inputs are nil
    - A string concatenation
    - A channel
  correctIndex: 1
  explanation: "`errors.Join` combines errors; if all are nil, it returns nil. Otherwise it returns an error whose `Unwrap() []error` yields the non-nil inputs, walkable by errors.Is/As."
- id: q7
  question: Which Go version introduced errors.Join?
  options:
    - "1.13"
    - "1.18"
    - "1.20"
    - "1.22"
  correctIndex: 2
  explanation: "`errors.Join` and `Unwrap() []error` support shipped in Go 1.20 (February 2023), making multi-error handling standard-library native."
- id: q8
  question: What method does a custom error type implement to integrate with the chain?
  options:
    - String() string only
    - Code() int
    - Is() bool
    - Error() string (to satisfy error); Unwrap() error or Unwrap() []error for chain support
  correctIndex: 3
  explanation: Implementing `Error() string` satisfies the error interface. Implementing `Unwrap() error` (or `Unwrap() []error` in 1.20+) opts into chain walking by errors.Is/As.
- id: q9
  question: What's a common security pitfall in error messages?
  options:
    - Leaking secrets (passwords, tokens, PII) into errors that get logged or returned to clients
    - Too verbose
    - Using %w
    - Using sentinel errors
  correctIndex: 0
  explanation: Errors are often logged or returned to API clients; never embed credentials, tokens, or PII. Use opaque error codes for clients and detailed logs server-side.
- id: q10
  question: Why avoid very granular sentinel errors?
  options:
    - They're slow
    - A small set of well-named sentinels plus typed errors for detail is easier to maintain and reason about
    - They cause panics
    - Go doesn't allow them
  correctIndex: 1
  explanation: A handful of well-known sentinels (ErrNotFound, ErrConflict) plus typed errors (ValidationError, QuotaError) for structured detail scales better than dozens of fine-grained sentinels.
```

