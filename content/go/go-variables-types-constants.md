---
slug: go-variables-types-constants
id: go-02
track: go
order: 2
title: Variables, Types, and Constants
description: Declare variables across Go's built-in types, master zero values and short declarations, understand constants and iota, and meet the type-conversion vs type-assertion distinction.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=800s
whyItMatters: Declare variables across Go's built-in types, master zero values and short declarations, understand constants and iota, and meet the type-conversion vs type-assertion distinction.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Variables, Types, and Constants

## Variables, Types, and Constants

### Why It Matters

Declare variables across Go's built-in types, master zero values and short declarations, understand constants and iota, and meet the type-conversion vs type-assertion distinction.

Declare variables across Go's built-in types, master zero values and short declarations, understand constants and iota, and meet the type-conversion vs type-assertion distinction.

### Prerequisites

- Stage 1: Getting Started with Go.
- Comfort running `go run` and `go build`.

### Topics

- Built-in types: int (and sized int8/16/32/64), uint, float32/64, complex, byte, rune, string, bool
- Variable declaration: var, :=, multiple assignment, blank identifier
- Zero values: 0, false, "" , nil
- Constants, untyped constants, and iota enumerations
- Type conversions (T(x)) vs type assertions (x.(T))
- The string/[]byte duality and UTF-8 runes
- Pointers (briefly) and the new() function
- Naming conventions: exported vs unexported, camelCase, acronyms (URL, ID)

### Key Concepts

- Go has no implicit numeric conversion; `int32` to `int` requires explicit `int(x)`. This eliminates a whole class of C bugs.
- Zero values mean a freshly declared variable is always in a valid state — no "uninitialized memory" UB.
- Untyped constants have arbitrary precision and only take a type when used in context; `const Pi = 3.14159` works for both float and complex contexts.
- `iota` is a per-const-block resettable counter; it's how idiomatic enums are built in Go.
- A Go string is an immutable sequence of bytes, usually but not necessarily UTF-8; indexing yields bytes, range yields runes.

```go
var a int          // zero value 0
var b = 42         // inferred int
var c, d = 1, 2    // multiple
e := "hi"          // short decl (function scope only)
_, ok := parse(x)  // blank identifier discards a return
```
Caption: Variable declaration styles

### Common Pitfalls

- Implicit conversion between int and int32 — Go forbids it; you must write `int32(x)` explicitly, which catches overflow-on-conversion bugs at compile time.
- Assuming `len(s)` returns the number of characters — `len(string)` returns bytes; for rune count use `utf8.RuneCountInString(s)` or `len([]rune(s))`.
- Using `:=` outside a function — short declarations are function-scoped only; package-level vars must use `var name = value`.
- Re-declaring a variable with `:=` in a different scope by accident — at least one LHS variable must be new for `:=`, otherwise use `=`.
- Mutating a string by index — strings are immutable; `s[0] = 'X'` is a compile error, you must convert to `[]byte`, mutate, and convert back.

### Real-World Applications

- Kubernetes uses `iota`-based constants for resource quantities, API versions, and condition types throughout its API packages.
- The Go standard library's `time` package defines `time.Nanosecond`, `time.Microsecond`, ..., `time.Hour` via a const block that relies on `iota`.
- HashiCorp Terraform's schema package uses typed int constants (iota-based) for schema behaviors and field flags.
- Docker's container exit-code constants and signal mappings use Go const blocks for compile-time safety.

### Interview Questions

- 1. What is a zero value and why does Go have them? — Every type has a deterministic zero value (0, false, "", nil) so freshly declared variables are always in a valid state, eliminating uninitialized-memory bugs.
- 2. What's the difference between `var x = 1` and `x := 1`? — Both infer the type; `:=` is short declaration usable only inside functions and re-uses existing variables if at least one is new on the LHS.
- 3. What is `iota`? — A per-const-block counter that resets to 0 in each `const (...)` block, used to build idiomatic enums and bit-shift constants.
- 4. Why does Go require explicit numeric conversions? — To make narrowing and sign changes visible at the call site, eliminating a whole class of silent-overflow bugs inherited from C.
- 5. What's the difference between a string and a []byte? — string is immutable and (typically) UTF-8; []byte is a mutable slice; converting between them allocates a copy unless the compiler can prove safety.

### Mini Project

Build a Unit Converter CLI: A command-line tool that converts between units (length meters/feet/miles, weight kg/lb, temperature C/F/K). Reads `--from`, `--to`, and `--value` from flags, prints the result with 4 significant digits, and supports a `--list` flag showing all valid pairs. Suggested approach:
  - Use the `flag` package for argument parsing
  - Define a map of conversion functions keyed by "from:to" strings
  - Handle temperature separately (non-linear affine transforms)
  - Format with `%.4g` via `fmt.Sprintf`
  - Add unit tests for at least one conversion per category

### Exercises

1. Declare a const block using iota for HTTP status groups (1xx, 2xx, 3xx, 4xx, 5xx) as integers 1-5.
2. Write a function that counts runes vs bytes in a string and verify they differ for "café".
3. Convert an int to float64 and back, printing the value at each step; observe what happens with very large ints.
4. Build a small package `units` with exported constants for Meter, Foot, Kilometer and a function to convert.
5. Benchmark `[]byte(s)` vs `string(b)` allocation with `go test -bench` to confirm each conversion allocates.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the zero value of an int in Go?
9. A) null
10. B) 0 (*)
11. C) undefined
12. D) nil
13. Explanation: Numeric types zero to 0, booleans to false, strings to "", and pointers/slices/maps/chans/funcs/interfaces to nil.
14. Q2: Which declaration is valid only inside a function body?
15. A) var x = 5
16. B) const x = 5
17. C) x := 5 (*)
18. D) type X int
19. Explanation: Short declaration `:=` is permitted only inside functions; package-level declarations must use `var`, `const`, or `type`.
20. Q3: What does `len("café")` return on a typical UTF-8 system?
21. A) 4
22. B) 6
23. C) 7
24. D) 5 (*)
25. Explanation: "café" is 4 runes but é is 2 bytes in UTF-8, so the byte length is 5; use `utf8.RuneCountInString` for rune count.
26. Q4: What is `iota` in a Go const block?
27. A) A predeclared identifier representing a 0-based counter that resets per const block (*)
28. B) A random number generator
29. C) A floating-point epsilon
30. D) A type alias for int64
31. Explanation: `iota` is the per-const-block counter; it starts at 0 in each `const (...)` group and increments per line.
32. Q5: Why does Go forbid implicit int-to-int32 conversion?
33. A) For performance
34. B) To force explicit narrowing and avoid silent overflow bugs (*)
35. C) Because int is always 32 bits
36. D) Because Go has no numeric types
37. Explanation: Every numeric conversion must be written explicitly (e.g. `int32(x)`) so that narrowing and sign changes are visible at the call site.
38. Q6: Which keyword or operator performs a type assertion?
39. A) T(x)
40. B) x as T
41. C) x.(T) (*)
42. D) cast<T>(x)
43. Explanation: `x.(T)` asserts that the interface value x holds type T; `T(x)` is a (static) type conversion, not an assertion.
44. Q7: What happens when you write `s[0] = 'H'` for a string s?
45. A) Compiles and modifies the first byte
46. B) Panics at runtime
47. C) Allocates a new string
48. D) Compile error — strings are immutable (*)
49. Explanation: Go strings are immutable byte sequences; the compiler rejects index assignment. Convert to []byte, mutate, then convert back.
50. Q8: Which is an untyped constant?
51. A) const Pi = 3.14159 (*)
52. B) var Pi = 3.14159
53. C) const Pi float64 = 3.14159
54. D) Pi := 3.14159
55. Explanation: Without an explicit type, `const Pi = 3.14159` is untyped (high precision) and adapts to the context in which it is used.
56. Q9: What does `new(int)` return?
57. A) An int with value 0
58. B) A *int pointing to a zero-valued int (*)
59. C) A nil pointer
60. D) A slice of int
61. Explanation: `new(T)` allocates a zero-valued T and returns a pointer to it; for `new(int)` that's `*int` pointing at 0.
62. Q10: Which naming convention is idiomatic for an exported function returning a URL for a user ID?
63. A) getURLForUserID
64. B) GetUrlForUserId
65. C) GetURLForUserID (*)
66. D) get_url_for_user_id
67. Explanation: Go uses camelCase (or PascalCase for exports) and uppercases acronyms as a unit (URL, ID, HTTP), so exported names read GetURLForUserID.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the zero value of an int in Go?
  options:
    - "null"
    - "0"
    - undefined
    - nil
  correctIndex: 1
  explanation: Numeric types zero to 0, booleans to false, strings to "", and pointers/slices/maps/chans/funcs/interfaces to nil.
- id: q2
  question: Which declaration is valid only inside a function body?
  options:
    - var x = 5
    - const x = 5
    - x := 5
    - type X int
  correctIndex: 2
  explanation: Short declaration `:=` is permitted only inside functions; package-level declarations must use `var`, `const`, or `type`.
- id: q3
  question: What does `len("café")` return on a typical UTF-8 system?
  options:
    - "4"
    - "6"
    - "7"
    - "5"
  correctIndex: 3
  explanation: '"café" is 4 runes but é is 2 bytes in UTF-8, so the byte length is 5; use `utf8.RuneCountInString` for rune count.'
- id: q4
  question: What is `iota` in a Go const block?
  options:
    - A predeclared identifier representing a 0-based counter that resets per const block
    - A random number generator
    - A floating-point epsilon
    - A type alias for int64
  correctIndex: 0
  explanation: "`iota` is the per-const-block counter; it starts at 0 in each `const (...)` group and increments per line."
- id: q5
  question: Why does Go forbid implicit int-to-int32 conversion?
  options:
    - For performance
    - To force explicit narrowing and avoid silent overflow bugs
    - Because int is always 32 bits
    - Because Go has no numeric types
  correctIndex: 1
  explanation: Every numeric conversion must be written explicitly (e.g. `int32(x)`) so that narrowing and sign changes are visible at the call site.
- id: q6
  question: Which keyword or operator performs a type assertion?
  options:
    - T(x)
    - x as T
    - x.(T)
    - cast<T>(x)
    - "` asserts that the interface value x holds type T; `T(x)` is a (static) type conversion, not an assertion."
  correctIndex: 2
  explanation: "`x.(T)` asserts that the interface value x holds type T; `T(x)` is a (static) type conversion, not an assertion."
- id: q7
  question: What happens when you write `s[0] = 'H'` for a string s?
  options:
    - Compiles and modifies the first byte
    - Panics at runtime
    - Allocates a new string
    - Compile error — strings are immutable
  correctIndex: 3
  explanation: Go strings are immutable byte sequences; the compiler rejects index assignment. Convert to []byte, mutate, then convert back.
- id: q8
  question: Which is an untyped constant?
  options:
    - const Pi = 3.14159
    - var Pi = 3.14159
    - const Pi float64 = 3.14159
    - Pi := 3.14159
  correctIndex: 0
  explanation: Without an explicit type, `const Pi = 3.14159` is untyped (high precision) and adapts to the context in which it is used.
- id: q9
  question: What does `new(int)` return?
  options:
    - An int with value 0
    - A *int pointing to a zero-valued int
    - A nil pointer
    - A slice of int
    - "` allocates a zero-valued T and returns a pointer to it; for `new(int)` that's `*int` pointing at 0."
  correctIndex: 1
  explanation: "`new(T)` allocates a zero-valued T and returns a pointer to it; for `new(int)` that's `*int` pointing at 0."
- id: q10
  question: Which naming convention is idiomatic for an exported function returning a URL for a user ID?
  options:
    - getURLForUserID
    - GetUrlForUserId
    - GetURLForUserID
    - get_url_for_user_id
    - ", so exported names read GetURLForUserID."
  correctIndex: 2
  explanation: Go uses camelCase (or PascalCase for exports) and uppercases acronyms as a unit (URL, ID, HTTP), so exported names read GetURLForUserID.
```

