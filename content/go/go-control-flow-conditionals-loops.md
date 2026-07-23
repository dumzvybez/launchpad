---
slug: go-control-flow-conditionals-loops
id: go-03
track: go
order: 3
title: Control Flow — Conditionals and Loops
description: Master if/else, switch (with no-arg and type switches), for loops (the only loop in Go), break/continue/labels, and the pre-1.22 vs 1.22+ range-loop variable capture semantics.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=1600s
whyItMatters: Master if/else, switch (with no-arg and type switches), for loops (the only loop in Go), break/continue/labels, and the pre-1. 22 vs 1.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Control Flow — Conditionals and Loops

## Control Flow — Conditionals and Loops

### Why It Matters

Master if/else, switch (with no-arg and type switches), for loops (the only loop in Go), break/continue/labels, and the pre-1. 22 vs 1.

Master if/else, switch (with no-arg and type switches), for loops (the only loop in Go), break/continue/labels, and the pre-1.22 vs 1.22+ range-loop variable capture semantics.

### Prerequisites

- Stage 2: Variables, Types, and Constants.
- Familiarity with `var`/`:=` and basic types.

### Topics

- if, else if, else — with initializer expressions
- switch (expression switch and no-condition switch)
- Type switches: switch v := x.(type)
- for as the only loop: classic, condition-only, infinite, range
- break, continue, and labeled statements
- defer and its LIFO ordering (intro)
- Goto (yes, Go has goto — and when it's acceptable)
- The range loop variable capture bug (pre-1.22) and the 1.22 fix

### Key Concepts

- Go has only `for`; there is no `while` or `do-while` — `for cond {}` and `for {}` cover them.
- `if` and `switch` accept an initializer (`if err := f(); err != nil`) that scopes variables to the block.
- A `switch` with no expression is a cleaner `if/else if` chain; cases don't fall through by default.
- `fallthrough` is explicit and rarely needed; it transfers control to the next case body unconditionally.
- Pre-Go-1.22 `range` re-used one loop variable per iteration — the classic closure-capture footgun; Go 1.22 fixed it to create a fresh variable per iteration.

```go
if err := doWork(); err != nil {
    log.Printf("failed: %v", err)
    return
}
// err is not in scope here
```
Caption: If with initializer

### Common Pitfalls

- Capturing the loop variable in a closure pre-Go-1.22 — all closures saw the final value; pass it as a goroutine arg or shadow it inside the loop body.
- Expecting `switch` cases to fall through — Go's switch does NOT fall through by default; you must write `fallthrough` explicitly.
- Ranging over a map and expecting a specific order — map iteration is randomized by the runtime; sort keys explicitly if order matters.
- Using `break` inside a `switch` and expecting it to break a surrounding `for` — `break` exits the innermost `switch`/`for`/`select`; use a label to break the outer loop.
- Forgetting `defer` runs LIFO and only at function return — placing `defer mu.Unlock()` in a loop defers N unlocks until function exit, leaking the lock until then.

### Real-World Applications

- The Go runtime scheduler itself is a giant select/for loop driving goroutines; understanding loops is understanding Go's concurrency substrate.
- Kubernetes controllers are giant `for` loops that watch a shared informer cache and reconcile desired vs actual state.
- The `net/http` request multiplexer uses a `switch` on method+path to route incoming requests.
- Prometheus's scrape loop is a `for { select { case <-ticker.C: scrape() } }` pattern used in thousands of exporters.

### Interview Questions

- 1. Why does Go have only `for`? — Simplicity and orthogonality; `for cond {}` covers `while` and `for {}` covers infinite loops, removing three keywords for one concept.
- 2. What does `fallthrough` do? — Transfers control to the next case body unconditionally, regardless of the next case's expression; rarely needed and idiomatic Go avoids it.
- 3. What's the range loop variable capture bug, and when was it fixed? — Pre-1.22, `range` re-used one variable per iteration so closures captured the final value; Go 1.22 made each iteration get a fresh variable.
- 4. How do you break out of an outer loop from inside a switch? — Use a labeled break (`outer: for { switch { case ...: break outer } }`).
- 5. Why does `defer` inside a loop cause resource leaks? — Defers stack up LIFO and only fire at function return, so a `defer f.Close()` in a loop accumulates open files until the function exits; close explicitly inside the loop.

### Mini Project

Build a FizzBuzz CLI with Configurable Rules: A CLI that reads an integer N and a JSON ruleset like `{"3":"Fizz","5":"Buzz","7":"Bazz"}` and prints FizzBuzz-style output for 1..N. Suggested approach:
  - Use `flag` for `-n` and `-rules <path>`
  - Decode the rules JSON into `map[int]string`
  - Sort the divisors so output is deterministic
  - Use a `for` loop and a `strings.Builder` per line
  - Add a `--quiet` flag to suppress lines with no rule match

### Exercises

1. Write a function that classifies a number as positive/negative/zero using a no-condition switch.
2. Rewrite a nested if/else chain as a switch with case ranges.
3. Trigger the pre-1.22 loop-capture bug with `GOEXPERIMENT=loopvar=0 go run` (1.21) and confirm the fix in 1.22 by running the same code.
4. Use a labeled break to exit an outer loop when an inner search finds a match.
5. Implement a tiny state machine using `switch` and `goto` for error-handling cleanup (a rare, legitimate goto use).
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How many loop constructs does Go have?
9. A) Three: for, while, do-while
10. B) Two: for and while
11. C) One: for (*)
12. D) Four: for, while, do-while, foreach
13. Explanation: Go has only `for`; the classic, condition-only, and infinite forms cover what other languages split across `while` and `do-while`.
14. Q2: Does a Go switch case fall through to the next case by default?
15. A) Yes, always
16. B) Only for empty cases
17. C) Only for default
18. D) No — you must write `fallthrough` explicitly (*)
19. Explanation: Go switch cases do not fall through automatically; `fallthrough` is explicit and transfers control unconditionally.
20. Q3: In Go 1.21, what does `for i := 0; i < 3; i++ { go func() { print(i) }() }` likely print?
21. A) Likely 333 or similar — the closure captures the final value of i (*)
22. B) Always 012
23. C) Compile error
24. D) Nothing — goroutines never run
25. Explanation: Pre-1.22, range/classic for loops re-used one variable; closures captured the final value. Go 1.22 fixed this by creating a fresh i per iteration.
26. Q4: Which statement exits an outer loop from inside a switch?
27. A) break outer
28. B) break (*)
29. C) continue outer
30. D) return outer
31. Explanation: A labeled `break outer` (where `outer:` labels a `for` statement) exits the labeled loop; plain `break` exits only the innermost switch/for/select.
32. Q5: In which order do `defer` statements execute?
33. A) First-in, first-out
34. B) In parallel
35. C) Last-in, first-out (LIFO) at function return (*)
36. D) Immediately when declared
37. Explanation: Defers push onto a stack and pop in reverse order when the enclosing function returns, so the last defer registered runs first.
38. Q6: What does a `switch` with no expression do?
39. A) Compile error
40. B) Always runs default
41. C) Falls through all cases
42. D) Behaves as a cleaner if/else-if chain (each case is a bool expression) (*)
43. Explanation: A no-expression `switch` evaluates each case expression as a bool and runs the first true one; it's the idiomatic multi-branch if/else.
44. Q7: What does a type switch look like?
45. A) switch v := x.(type) { ... } (*)
46. B) switch x.type { ... }
47. C) switch (x) { case T: ... }
48. D) case T := x { ... }
49. Explanation: `switch v := x.(type)` binds v to the concrete type in each case; in `case int:` v has type int.
50. Q8: Ranging over a map in Go, what can you assume about iteration order?
51. A) Insertion order
52. B) Random — the runtime intentionally shuffles map iteration (*)
53. C) Sorted by key
54. D) Reverse insertion order
55. Explanation: Map iteration order is randomized by the runtime to prevent callers from depending on it; sort keys explicitly if you need a deterministic order.
56. Q9: Which Go feature lets you write `if err := f(); err != nil { ... }`?
57. A) It's a ternary expression
58. B) It's a closure call
59. C) if statements accept a short initializer before the condition (*)
60. D) It's a macro
61. Explanation: `if` (and `switch` and `for`) accept an initializer statement separated from the condition by `;`, scoping the variable to the block.
62. Q10: What's the safe fix for the pre-1.22 loop-capture bug when targeting Go 1.21?
63. A) Use global variables
64. B) Add a sleep before the goroutine
65. C) Use a sync.Mutex
66. D) Pass the loop variable as a parameter to the closure or goroutine (*)
67. Explanation: `go func(i int) { ... }(i)` (or shadowing `i := i` inside the loop) creates a fresh variable per iteration, avoiding the shared-variable capture.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How many loop constructs does Go have?
  options:
    - "Three: for, while, do-while"
    - "Two: for and while"
    - "One: for"
    - "Four: for, while, do-while, foreach"
  correctIndex: 2
  explanation: Go has only `for`; the classic, condition-only, and infinite forms cover what other languages split across `while` and `do-while`.
- id: q2
  question: Does a Go switch case fall through to the next case by default?
  options:
    - Yes, always
    - Only for empty cases
    - Only for default
    - No — you must write `fallthrough` explicitly
  correctIndex: 3
  explanation: Go switch cases do not fall through automatically; `fallthrough` is explicit and transfers control unconditionally.
- id: q3
  question: In Go 1.21, what does `for i := 0; i < 3; i++ { go func() { print(i) }() }` likely print?
  options:
    - Likely 333 or similar — the closure captures the final value of i
    - Always 012
    - Compile error
    - Nothing — goroutines never run
  correctIndex: 0
  explanation: Pre-1.22, range/classic for loops re-used one variable; closures captured the final value. Go 1.22 fixed this by creating a fresh i per iteration.
- id: q4
  question: Which statement exits an outer loop from inside a switch?
  options:
    - break outer
    - break
    - continue outer
    - return outer
  correctIndex: 1
  explanation: A labeled `break outer` (where `outer:` labels a `for` statement) exits the labeled loop; plain `break` exits only the innermost switch/for/select.
- id: q5
  question: In which order do `defer` statements execute?
  options:
    - First-in, first-out
    - In parallel
    - Last-in, first-out (LIFO) at function return
    - Immediately when declared
  correctIndex: 2
  explanation: Defers push onto a stack and pop in reverse order when the enclosing function returns, so the last defer registered runs first.
- id: q6
  question: What does a `switch` with no expression do?
  options:
    - Compile error
    - Always runs default
    - Falls through all cases
    - Behaves as a cleaner if/else-if chain (each case is a bool expression)
  correctIndex: 3
  explanation: A no-expression `switch` evaluates each case expression as a bool and runs the first true one; it's the idiomatic multi-branch if/else.
- id: q7
  question: What does a type switch look like?
  options:
    - switch v := x.(type) { ... }
    - switch x.type { ... }
    - "switch (x) { case T: ... }"
    - case T := x { ... }
  correctIndex: 0
  explanation: "`switch v := x.(type)` binds v to the concrete type in each case; in `case int:` v has type int."
- id: q8
  question: Ranging over a map in Go, what can you assume about iteration order?
  options:
    - Insertion order
    - Random — the runtime intentionally shuffles map iteration
    - Sorted by key
    - Reverse insertion order
  correctIndex: 1
  explanation: Map iteration order is randomized by the runtime to prevent callers from depending on it; sort keys explicitly if you need a deterministic order.
- id: q9
  question: Which Go feature lets you write `if err := f(); err != nil { ... }`?
  options:
    - It's a ternary expression
    - It's a closure call
    - if statements accept a short initializer before the condition
    - It's a macro
  correctIndex: 2
  explanation: "`if` (and `switch` and `for`) accept an initializer statement separated from the condition by `;`, scoping the variable to the block."
- id: q10
  question: What's the safe fix for the pre-1.22 loop-capture bug when targeting Go 1.21?
  options:
    - Use global variables
    - Add a sleep before the goroutine
    - Use a sync.Mutex
    - Pass the loop variable as a parameter to the closure or goroutine
  correctIndex: 3
  explanation: "`go func(i int) { ... }(i)` (or shadowing `i := i` inside the loop) creates a fresh variable per iteration, avoiding the shared-variable capture."
```

