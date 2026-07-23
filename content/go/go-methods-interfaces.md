---
slug: go-methods-interfaces
id: go-08
track: go
order: 8
title: Methods and Interfaces
description: Define methods on types, understand pointer vs value receivers, write implicit interfaces, and master the empty interface `any` plus type assertions and type switches.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=5600s
whyItMatters: Define methods on types, understand pointer vs value receivers, write implicit interfaces, and master the empty interface `any` plus type assertions and type switches.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Methods and Interfaces

## Methods and Interfaces

### Why It Matters

Define methods on types, understand pointer vs value receivers, write implicit interfaces, and master the empty interface `any` plus type assertions and type switches.

Define methods on types, understand pointer vs value receivers, write implicit interfaces, and master the empty interface `any` plus type assertions and type switches.

### Prerequisites

- Stage 7: Pointers in Go.
- Comfort with structs and pointer receivers.

### Topics

- Method declarations: value receiver vs pointer receiver
- Method sets and the addressability rule
- Interfaces — implicit satisfaction (no `implements` keyword)
- The empty interface `interface{}` aka `any` (Go 1.18+ alias)
- Type assertions: `x.(T)` and comma-ok form
- Type switches: `switch v := x.(type)`
- Embedding interfaces (composition)
- nil interface values and the nil-dereference trap

### Key Concepts

- Interfaces are satisfied implicitly: a type implements an interface if it has all the required methods — no `implements` keyword, no declaration.
- Pointer receiver methods are only in the method set of `*T`; value receiver methods are in both `T` and `*T`. This affects interface satisfaction.
- The empty interface `any` (alias for `interface{}`) holds any value; use type assertions or switches to recover the concrete type.
- A nil interface value has no type and panics on method call; an interface holding a nil pointer has a type and is non-nil (Stage 7 trap).
- Interfaces are typically small (one or two methods); the standard idiom is `-er` suffix (`Reader`, `Writer`, `Stringer`).

```go
type Counter struct{ n int }

func (c Counter)  Get() int     { return c.n }     // value receiver
func (c *Counter) Inc()         { c.n++ }          // pointer receiver

c := Counter{}
c.Inc()           // OK — Go auto-takes &c (c is addressable)
// Counter{}.Inc()  // ERROR — Counter{} is not addressable

var i interface{ Get() int } = &c  // *Counter has Get (via value receiver) and Inc
```
Caption: Value vs pointer receiver

### Common Pitfalls

- Implementing an interface with value receiver when callers have a `*T` — value receiver methods are in both method sets, so this works; the trap is the reverse (pointer-only methods + value type).
- Calling a method on a nil interface — `var s Stringer; s.String()` panics (no type); a nil concrete value with a non-nil interface type can still call methods if the method handles nil.
- Using `any` when a specific interface would be clearer — `any` defeats compile-time type safety; prefer small interfaces like `io.Reader`.
- Forgetting that a pointer is needed to satisfy an interface — `var i io.Writer = bytes.Buffer{}` won't compile because `Write` has a pointer receiver; use `&bytes.Buffer{}`.
- Confusing `interface{}` with `Object` (from Java) — Go's `any` is just an interface with no methods; boxing rules differ (e.g., storing an int in `any` boxes it on the heap).

### Real-World Applications

- `io.Reader` and `io.Writer` are the most-used interfaces in Go; they power files, network sockets, buffers, gzip, crypto, and HTTP bodies.
- `fmt.Stringer` is implemented by virtually every type that wants a custom `%v`/`%s` representation — used throughout the standard library.
- `error` is itself a one-method interface; the entire error-handling ecosystem is built on this single contract.
- `sort.Interface` (Len, Less, Swap) was the standard sort contract before Go 1.21's `slices.SortFunc` made it generic; many codebases still use it.
- Kubernetes controllers depend on the `client.Object` interface (`GetName`, `GetNamespace`, ...) for generic resource handling.

### Interview Questions

- 1. How does Go's interface satisfaction differ from Java's? — Implicit: no `implements` keyword; a type satisfies an interface if it has all the methods, checked at compile time at the assignment site.
- 2. What's the rule for pointer vs value receiver method sets? — Value receiver methods are in both T and *T's method sets; pointer receiver methods are only in *T's set.
- 3. Why does `var i io.Writer = bytes.Buffer{}` fail to compile? — `Buffer.Write` has a pointer receiver, so only `*bytes.Buffer` is in `io.Writer`'s method set; use `&bytes.Buffer{}`.
- 4. What is `any`? — An alias for `interface{}` introduced in Go 1.18; the empty interface that holds any value, requiring type assertions or switches to recover the concrete type.
- 5. What's a nil interface, and what happens when you call a method on it? — A nil interface has no type; calling any method on it panics with "nil pointer dereference" (technically, a nil interface call).

### Mini Project

Build a Shape Area Calculator with Interfaces: A library defining a `Shape` interface (`Area() float64`, `Perimeter() float64`) implemented by `Circle`, `Rectangle`, and `Triangle`, plus a `TotalArea(shapes []Shape) float64` reducer and a `String()` method for each shape. Suggested approach:
  - Define `type Shape interface { Area() float64; Perimeter() float64 }`
  - Implement each shape with value receivers (immutable data)
  - Add `Stringer` so `fmt.Println(c)` prints "Circle(r=3)"
  - Use a type switch in `Describe(s Shape)` to print shape-specific info
  - Write table-driven tests covering all three shapes

### Exercises

1. Implement `fmt.Stringer` on a `Money` type and verify `fmt.Println` uses it.
2. Trigger the "interface not satisfied" compile error by assigning a `bytes.Buffer{}` (not pointer) to `io.Writer`.
3. Write a type switch over `any` handling int, string, []byte, and default.
4. Embed `io.Reader` and `io.Writer` into a custom `ReadWriter` interface and implement it.
5. Implement `error` on a custom struct and return it from a function; verify `errors.As` recognizes it.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How does a Go type declare it implements an interface?
9. A) With the `implements` keyword
10. B) Via a //go:implements comment
11. C) By embedding the interface
12. D) Implicitly — by having all the required methods (*)
13. Explanation: Go has no `implements` keyword; interface satisfaction is implicit and checked at compile time when the value is assigned to the interface type.
14. Q2: Which methods are in the method set of `*T`?
15. A) Both value and pointer receiver methods of T (*)
16. B) Only pointer receiver methods
17. C) Only value receiver methods
18. D) None — *T has no method set
19. Explanation: The method set of *T includes both value receiver and pointer receiver methods. The method set of T includes only value receiver methods.
20. Q3: Why does `var w io.Writer = bytes.Buffer{}` fail to compile?
21. A) bytes.Buffer has no Write method
22. B) Write has a pointer receiver, so only *bytes.Buffer satisfies io.Writer (*)
23. C) io.Writer is private
24. D) You can't assign structs to interfaces
25. Explanation: `bytes.Buffer.Write` has a pointer receiver, so `bytes.Buffer{}` (value) lacks Write in its method set; use `&bytes.Buffer{}`.
26. Q4: What is `any` in Go 1.18+?
27. A) A new keyword for generics
28. B) A type parameter
29. C) An alias for `interface{}` (the empty interface) (*)
30. D) A runtime type
31. Explanation: Go 1.18 introduced `any` as a predeclared alias for `interface{}` for readability in generic and dynamic-typed code.
32. Q5: What's a type assertion in Go?
33. A) `x instanceof T`
34. B) `x as T`
35. C) `cast<T>(x)`
36. D) `x.(T)` — asserts the interface x holds type T (*)
37. Explanation: `x.(T)` asserts that the interface value x holds type T; the comma-ok form (`v, ok := x.(T)`) avoids panic if the assertion fails.
38. Q6: What does `switch v := x.(type)` do?
39. A) A type switch — in each case, v has the case's concrete type (*)
40. B) A regular switch on the type name
41. C) Compile error
42. D) A type assertion that always panics
43. Explanation: A type switch binds v to the concrete type in each case; `case int:` makes v an int, `case string:` makes v a string, etc.
44. Q7: What happens when you call a method on a nil interface value?
45. A) Returns nil
46. B) Panics — nil interface has no concrete type to dispatch to (*)
47. C) Compile error
48. D) Calls a default method
49. Explanation: A nil interface holds no type, so the runtime can't find the method to call; it panics with a nil interface dereference.
50. Q8: Which is the idiomatic Go interface naming convention?
51. A) IReader (Hungarian)
52. B) AbstractReader
53. C) Reader (single-method, -er suffix) (*)
54. D) BaseReader
55. Explanation: Go interfaces with one method are named after the method plus `-er` (Reader, Writer, Stringer, Closer). Multi-method interfaces have descriptive names.
56. Q9: Can a Go interface embed another interface?
57. A) No — only structs can embed
58. B) Only via reflection
59. C) Only in generic code
60. D) Yes — embedded interfaces promote their methods (*)
61. Explanation: Interfaces can embed other interfaces; `type RW interface { io.Reader; io.Writer }` is equivalent to listing all the embedded methods.
62. Q10: What does the comma-ok type assertion do if the assertion fails?
63. A) Returns the zero value and false — no panic (*)
64. B) Panics
65. C) Returns nil and true
66. D) Compile error
67. Explanation: `v, ok := x.(T)` returns the zero value of T and ok=false if x doesn't hold T; the single-value form `v := x.(T)` panics on failure.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How does a Go type declare it implements an interface?
  options:
    - With the `implements` keyword
    - Via a //go:implements comment
    - By embedding the interface
    - Implicitly — by having all the required methods
  correctIndex: 3
  explanation: Go has no `implements` keyword; interface satisfaction is implicit and checked at compile time when the value is assigned to the interface type.
- id: q2
  question: Which methods are in the method set of `*T`?
  options:
    - Both value and pointer receiver methods of T
    - Only pointer receiver methods
    - Only value receiver methods
    - None — *T has no method set
  correctIndex: 0
  explanation: The method set of *T includes both value receiver and pointer receiver methods. The method set of T includes only value receiver methods.
- id: q3
  question: Why does `var w io.Writer = bytes.Buffer{}` fail to compile?
  options:
    - bytes.Buffer has no Write method
    - Write has a pointer receiver, so only *bytes.Buffer satisfies io.Writer
    - io.Writer is private
    - You can't assign structs to interfaces
  correctIndex: 1
  explanation: "`bytes.Buffer.Write` has a pointer receiver, so `bytes.Buffer{}` (value) lacks Write in its method set; use `&bytes.Buffer{}`."
- id: q4
  question: What is `any` in Go 1.18+?
  options:
    - A new keyword for generics
    - A type parameter
    - An alias for `interface{}` (the empty interface)
    - A runtime type
  correctIndex: 2
  explanation: Go 1.18 introduced `any` as a predeclared alias for `interface{}` for readability in generic and dynamic-typed code.
- id: q5
  question: What's a type assertion in Go?
  options:
    - "`x instanceof T`"
    - "`x as T`"
    - "`cast<T>(x)`"
    - "`x.(T)` — asserts the interface x holds type T"
    - "` asserts that the interface value x holds type T; the comma-ok form (`v, ok := x.(T)`) avoids panic if the assertion fails."
  correctIndex: 3
  explanation: "`x.(T)` asserts that the interface value x holds type T; the comma-ok form (`v, ok := x.(T)`) avoids panic if the assertion fails."
- id: q6
  question: What does `switch v := x.(type)` do?
  options:
    - A type switch — in each case, v has the case's concrete type
    - A regular switch on the type name
    - Compile error
    - A type assertion that always panics
  correctIndex: 0
  explanation: A type switch binds v to the concrete type in each case; `case int:` makes v an int, `case string:` makes v a string, etc.
- id: q7
  question: What happens when you call a method on a nil interface value?
  options:
    - Returns nil
    - Panics — nil interface has no concrete type to dispatch to
    - Compile error
    - Calls a default method
  correctIndex: 1
  explanation: A nil interface holds no type, so the runtime can't find the method to call; it panics with a nil interface dereference.
- id: q8
  question: Which is the idiomatic Go interface naming convention?
  options:
    - IReader (Hungarian)
    - AbstractReader
    - Reader (single-method, -er suffix)
    - BaseReader
  correctIndex: 2
  explanation: Go interfaces with one method are named after the method plus `-er` (Reader, Writer, Stringer, Closer). Multi-method interfaces have descriptive names.
- id: q9
  question: Can a Go interface embed another interface?
  options:
    - No — only structs can embed
    - Only via reflection
    - Only in generic code
    - Yes — embedded interfaces promote their methods
  correctIndex: 3
  explanation: Interfaces can embed other interfaces; `type RW interface { io.Reader; io.Writer }` is equivalent to listing all the embedded methods.
- id: q10
  question: What does the comma-ok type assertion do if the assertion fails?
  options:
    - Returns the zero value and false — no panic
    - Panics
    - Returns nil and true
    - Compile error
    - "` returns the zero value of T and ok=false if x doesn't hold T; the single-value form `v := x.(T)` panics on failure."
  correctIndex: 0
  explanation: "`v, ok := x.(T)` returns the zero value of T and ok=false if x doesn't hold T; the single-value form `v := x.(T)` panics on failure."
```

