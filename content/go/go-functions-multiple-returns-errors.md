---
slug: go-functions-multiple-returns-errors
id: go-04
track: go
order: 4
title: Functions, Multiple Returns, and Errors
description: Define functions with multiple return values, master Go's error-as-value philosophy, learn defer with named returns, and meet panic/recover — the escape hatch you should rarely use.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=2400s
whyItMatters: Define functions with multiple return values, master Go's error-as-value philosophy, learn defer with named returns, and meet panic/recover — the escape hatch you should rarely use.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Functions, Multiple Returns, and Errors

## Functions, Multiple Returns, and Errors

### Why It Matters

Define functions with multiple return values, master Go's error-as-value philosophy, learn defer with named returns, and meet panic/recover — the escape hatch you should rarely use.

Define functions with multiple return values, master Go's error-as-value philosophy, learn defer with named returns, and meet panic/recover — the escape hatch you should rarely use.

### Prerequisites

- Stage 3: Control Flow — Conditionals and Loops.
- Comfort with `if err != nil`.

### Topics

- Function declarations, parameters, and named return values
- Multiple return values (idiomatic for value+error)
- Variadic functions (func sum(nums ...int) int)
- Anonymous functions and closures
- defer with named returns (naked return footgun)
- The error interface and error-as-value philosophy
- panic and recover — when they're appropriate
- The init() function and package initialization order

### Key Concepts

- Functions can return multiple values, and idiomatic Go returns `(value, error)` rather than throwing.
- `error` is a built-in interface (`type error interface { Error() string }`); any type implementing that method is an error.
- Named return values are zero-initialized and can be assigned anywhere in the function; `return` (naked) returns them — concise in short functions, dangerous in long ones.
- `defer` evaluates arguments immediately but runs the call at function return; combined with named returns it can modify what's returned.
- `panic` is for impossible states (programmer bugs) and rare init failures; `recover` only works in a deferred function and only stops the current panic.

```go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("divide by zero: %v / %v", a, b)
    }
    return a / b, nil
}

q, err := divide(10, 0)
if err != nil {
    log.Fatal(err)
}
```
Caption: Multiple returns

### Common Pitfalls

- Naked returns in long functions — `return` with no values silently returns the named results; readers can't tell what changed; reserve named returns for short functions or for defer interaction.
- Ignoring errors with `_` — silently discarding errors hides bugs; only use `_` when you have a documented reason (e.g., fmt.Println always returns nil).
- Using panic for normal error flow — panic is for impossible states and programmer bugs; library code should return errors, not panic.
- `recover` outside a deferred function — `recover()` returns nil if called from a non-deferred function or after the panic has propagated; it only catches the current goroutine's panic.
- Forgetting that defer evaluates arguments at registration — `defer log.Println(f())` calls `f()` immediately; wrap in a closure (`defer func() { log.Println(f()) }()`) to defer the call.

### Real-World Applications

- The entire Go standard library returns errors rather than throwing; `os.Open`, `json.Unmarshal`, `http.ListenAndServe` all follow `(value, error)`.
- Kubernetes API calls return structured errors (apierrors.IsNotFound, IsConflict) that callers inspect with `errors.Is`/`errors.As`.
- HashiCorp's go-plugin uses panic/recover at the RPC boundary to convert plugin panics into structured errors returned to the host.
- Uber's go.uber.org/multierr package lets callers accumulate multiple errors and return them as one, used widely in service shutdown paths.

### Interview Questions

- 1. Why does Go use multiple return values instead of exceptions? — To make error handling explicit in the type signature, force callers to consider failure, and avoid the performance and control-flow complexity of exceptions.
- 2. What is `error`? — A built-in interface with a single method `Error() string`; any type implementing that method is an error.
- 3. What's a naked return? — `return` with no values in a function with named returns; it returns the current values of the named return variables; concise but can be unclear.
- 4. When should you use panic? — For impossible states (invariant violations, nil-deref-should-be-impossible), init failures that can't be recovered, and never for normal control flow in library code.
- 5. How does `recover` work? — `recover()` called inside a deferred function stops the current panic, returning the panic value; outside a defer or after the panic propagates it returns nil.

### Mini Project

Build a Config Loader with Structured Errors: A small library that reads a JSON config file, validates required fields, and returns typed errors (ErrMissingField, ErrInvalidValue) so callers can branch on error kind. Suggested approach:
  - Define a `type ConfigError struct { Field, Reason string }` with `Error() string`
  - Use `os.ReadFile` + `json.Unmarshal` into a struct
  - Validate with a chain of helper functions returning `(bool, error)`
  - Expose `Load(path string) (*Config, error)`
  - Write a `errors.As` test confirming the typed error reaches the caller

### Exercises

1. Write a variadic `max(nums ...int) int` and confirm `max([]int{3,1,2}...)` works.
2. Write a function with named returns that uses defer to set an error return on panic, and test it with a panicking helper.
3. Implement a small pipeline: `parse(string) (int, error)` then `double(int) int`, and chain them with explicit error checks.
4. Build a closure that captures an outer counter and increments it; verify Go closures are by-reference on captured vars.
5. Replace one `panic`-based error path in a small program with a returned error, and observe the call-site diff.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the `error` type in Go?
9. A) A built-in struct
10. B) A keyword like try
11. C) A type alias for string
12. D) A built-in interface with `Error() string` (*)
13. Explanation: `error` is a predeclared interface: `type error interface { Error() string }`. Any type implementing that method satisfies error.
14. Q2: How many values can a Go function return?
15. A) Multiple (idiomatic: value + error) (*)
16. B) One only
17. C) Up to two
18. D) Only one, but it can be a struct
19. Explanation: Go functions can return multiple values; the idiomatic pattern is `(value, error)` so callers must handle failure explicitly.
20. Q3: What is a naked return?
21. A) A return without parentheses
22. B) `return` with no expression in a function with named returns (*)
23. C) A return from a goroutine
24. D) A return at end of file
25. Explanation: With named return values, a bare `return` returns the current values of those named variables; concise in short funcs, error-prone in long ones.
26. Q4: When are defer arguments evaluated?
27. A) At function return
28. B) Lazily on first use
29. C) Immediately at the defer statement (*)
30. D) After all other defers
31. Explanation: `defer f(args)` evaluates `args` immediately and schedules the call for function return; wrap in a closure to defer argument evaluation too.
32. Q5: Where does `recover()` work?
33. A) Anywhere in the program
34. B) Only in main()
35. C) Only in init()
36. D) Only inside a deferred function, and only for the current goroutine's panic (*)
37. Explanation: `recover()` returns the panic value when called from a deferred function in the panicking goroutine; elsewhere it returns nil.
38. Q6: What's the idiomatic way to signal "expected" failure in a Go library?
39. A) Return an error (*)
40. B) panic
41. C) os.Exit(1)
42. D) log.Fatal
43. Explanation: Library code returns errors; panic is reserved for impossible states (programmer bugs) and a few init failures.
44. Q7: How do you spread a slice into a variadic parameter?
45. A) sum(slice)
46. B) sum(...slice) (*)
47. C) sum(slice...)
48. D) sum(*slice)
49. Explanation: The `...` suffix on a slice argument spreads it into a variadic parameter: `sum(nums...)` where `func sum(nums ...int)`.
50. Q8: What does `func sum(nums ...int) int` declare?
51. A) A function taking a single slice argument
52. B) A function with optional int arguments
53. C) A function taking any number of int arguments (*)
54. D) A function returning many ints
55. Explanation: Variadic parameters collect zero or more arguments into a slice of the parameter type (here `nums []int` inside the function).
56. Q9: Which is true about Go closures?
57. A) They capture variables by value
58. B) They cannot capture outer variables
59. C) They run on a separate stack
60. D) They capture variables by reference (*)
61. Explanation: Closures capture outer variables by reference (the variable, not a snapshot), so mutating inside the closure affects the outer variable.
62. Q10: Why is ignoring errors with `_` risky?
63. A) It silently discards failure information that callers needed to handle (*)
64. B) It's a compile error
65. C) It panics at runtime
66. D) It disables the garbage collector
67. Explanation: `_, _ = f()` discards returned errors; only do this with a documented reason (e.g., fmt.Println always returns nil) or you hide real bugs.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the `error` type in Go?
  options:
    - A built-in struct
    - A keyword like try
    - A type alias for string
    - A built-in interface with `Error() string`
  correctIndex: 3
  explanation: "`error` is a predeclared interface: `type error interface { Error() string }`. Any type implementing that method satisfies error."
- id: q2
  question: How many values can a Go function return?
  options:
    - "Multiple (idiomatic: value + error)"
    - One only
    - Up to two
    - Only one, but it can be a struct
  correctIndex: 0
  explanation: Go functions can return multiple values; the idiomatic pattern is `(value, error)` so callers must handle failure explicitly.
- id: q3
  question: What is a naked return?
  options:
    - A return without parentheses
    - "`return` with no expression in a function with named returns"
    - A return from a goroutine
    - A return at end of file
  correctIndex: 1
  explanation: With named return values, a bare `return` returns the current values of those named variables; concise in short funcs, error-prone in long ones.
- id: q4
  question: When are defer arguments evaluated?
  options:
    - At function return
    - Lazily on first use
    - Immediately at the defer statement
    - After all other defers
  correctIndex: 2
  explanation: "`defer f(args)` evaluates `args` immediately and schedules the call for function return; wrap in a closure to defer argument evaluation too."
- id: q5
  question: Where does `recover()` work?
  options:
    - Anywhere in the program
    - Only in main()
    - Only in init()
    - Only inside a deferred function, and only for the current goroutine's panic
  correctIndex: 3
  explanation: "`recover()` returns the panic value when called from a deferred function in the panicking goroutine; elsewhere it returns nil."
- id: q6
  question: What's the idiomatic way to signal "expected" failure in a Go library?
  options:
    - Return an error
    - panic
    - os.Exit(1)
    - log.Fatal
  correctIndex: 0
  explanation: Library code returns errors; panic is reserved for impossible states (programmer bugs) and a few init failures.
- id: q7
  question: How do you spread a slice into a variadic parameter?
  options:
    - sum(slice)
    - sum(...slice)
    - sum(slice...)
    - sum(*slice)
  correctIndex: 1
  explanation: "The `...` suffix on a slice argument spreads it into a variadic parameter: `sum(nums...)` where `func sum(nums ...int)`."
- id: q8
  question: What does `func sum(nums ...int) int` declare?
  options:
    - A function taking a single slice argument
    - A function with optional int arguments
    - A function taking any number of int arguments
    - A function returning many ints
  correctIndex: 2
  explanation: Variadic parameters collect zero or more arguments into a slice of the parameter type (here `nums []int` inside the function).
- id: q9
  question: Which is true about Go closures?
  options:
    - They capture variables by value
    - They cannot capture outer variables
    - They run on a separate stack
    - They capture variables by reference
  correctIndex: 3
  explanation: Closures capture outer variables by reference (the variable, not a snapshot), so mutating inside the closure affects the outer variable.
- id: q10
  question: Why is ignoring errors with `_` risky?
  options:
    - It silently discards failure information that callers needed to handle
    - It's a compile error
    - It panics at runtime
    - It disables the garbage collector
  correctIndex: 0
  explanation: "`_, _ = f()` discards returned errors; only do this with a documented reason (e.g., fmt.Println always returns nil) or you hide real bugs."
```

