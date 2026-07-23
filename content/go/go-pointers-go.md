---
slug: go-pointers-go
id: go-07
track: go
order: 7
title: Pointers in Go
description: Understand Go's pointers — pass-by-value semantics, the `&` and `*` operators, nil pointers, and the subtle "nil interface vs nil pointer" trap that has bitten every Go developer at least once.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=4800s
whyItMatters: Understand Go's pointers — pass-by-value semantics, the `&` and `*` operators, nil pointers, and the subtle "nil interface vs nil pointer" trap that has bitten every Go developer at least once.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Pointers in Go

## Pointers in Go

### Why It Matters

Understand Go's pointers — pass-by-value semantics, the `&` and `*` operators, nil pointers, and the subtle "nil interface vs nil pointer" trap that has bitten every Go developer at least once.

Understand Go's pointers — pass-by-value semantics, the `&` and `*` operators, nil pointers, and the subtle "nil interface vs nil pointer" trap that has bitten every Go developer at least once.

### Prerequisites

- Stage 6: Maps and Structs.
- Comfort with structs and the value-vs-reference distinction.

### Topics

- & (address-of) and * (dereference)
- Pointers to structs; (*p).Field shorthand p.Field
- new(T) vs &T{}
- Nil pointers and deref panics
- Pass-by-value vs pointer parameters — when to use each
- The nil interface vs nil pointer trap
- Pointer receiver methods (preview of Stage 8)
- Escape analysis and stack vs heap allocation

### Key Concepts

- Go is pass-by-value, always — pointers are themselves values (an address); there is no pass-by-reference.
- `&T{}` allocates a T and returns a *T; `new(T)` does the same but returns a zero-valued *T. They compile to the same thing in practice.
- A nil pointer dereference panics — Go has no null-safety in the type system; check `if p != nil`.
- A nil interface holds no type, but an interface holding a nil pointer is NOT nil — this is the most famous Go gotcha.
- Escape analysis decides stack vs heap; `&x` may keep x on the stack if the pointer doesn't escape the function.

```go
type Counter struct{ n int }

func (c *Counter) Inc() { c.n++ }   // pointer receiver — mutates

c := &Counter{}
c.Inc()
c.Inc()
fmt.Println(c.n) // 2

var p *Counter // nil pointer
// p.Inc()      // would panic: nil pointer dereference
if p != nil {
    p.Inc()
}
```
Caption: Pointer basics

### Common Pitfalls

- Returning a typed nil pointer as an interface — the interface becomes non-nil even though the underlying pointer is nil; check `if err != nil` will be true unexpectedly.
- Dereferencing a nil pointer — `var p *T; p.X` panics; always check `if p != nil` when nil is a valid state.
- Confusing pass-by-value with pass-by-reference — Go is always pass-by-value; pointers are themselves values; there is no C++ reference.
- Taking a pointer to a loop variable pre-1.22 — `for _, v := range s { go func() { use(&v) }() }` shares one v across all goroutines (pre-1.22).
- Holding a pointer to a stack variable that escapes — escape analysis is correct but subtle; `go build -gcflags='-m'` shows what escapes and why.

### Real-World Applications

- The entire `database/sql` package uses `*sql.DB` pointers to represent connection pools; pass-by-pointer avoids copying the pool struct.
- gRPC-Go returns typed-nil errors (`status.Error`) in some legacy code paths, triggering the nil-interface trap; the docs warn about it explicitly.
- The Kubernetes `client-go` informer cache returns pointers to objects (`*v1.Pod`) so callers can mutate the cache entry — but you must deep-copy before mutating.
- The Go runtime itself uses escape analysis to keep small allocations on the stack, a major reason Go is fast for short-lived objects.

### Interview Questions

- 1. Is Go pass-by-value or pass-by-reference? — Always pass-by-value; pointers are themselves values (addresses). There is no C++-style reference parameter.
- 2. What is the nil interface vs nil pointer trap? — An interface is non-nil if it has a type, even if the underlying value is nil; `var p *T; var i error = p; i != nil` is true.
- 3. How do you avoid the nil-interface trap? — Return an explicit `nil` interface (`return nil`), or use a concrete error variable checked before assigning to the interface.
- 4. What is escape analysis? — The compiler decides whether a variable can stay on the stack or must move to the heap; pointers that escape the function (returned, stored in a heap object) force heap allocation.
- 5. When should you use a pointer receiver? — When the method mutates the receiver, when the receiver is large (avoid copying), or to satisfy an interface that other types implement with pointer receivers.

### Mini Project

Build a Linked-List Library with Pointer Manipulation: A small `list` package implementing a singly linked list with `PushFront`, `PushBack`, `Delete`, and `ForEach`, all using `*Node` pointers. Suggested approach:
  - Define `type Node struct { Value int; next *Node }` and `type List struct { head *Node }`
  - Use pointer receivers on all methods
  - Handle nil-list (zero value) gracefully — methods should work on `var l List`
  - Write a `Reverse()` method that walks pointers
  - Add tests confirming deletion handles head/middle/tail correctly

### Exercises

1. Write a function that returns `*int` pointing to a local variable; verify with `go build -gcflags='-m'` that the variable escapes.
2. Trigger the nil-interface trap: return a typed nil pointer as `error` and observe `err != nil` is true.
3. Implement `bump(c Counter)` (value) and `bumpP(c *Counter)` (pointer) and demonstrate the difference.
4. Use `go build -gcflags='-m -l'` on a small program and identify which variables escape.
5. Build a tiny tree type with `*Node` left/right children and a recursive Print.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Is Go pass-by-value or pass-by-reference?
9. A) Pass-by-reference for structs
10. B) Pass-by-reference for slices
11. C) Always pass-by-value — pointers are themselves values (*)
12. D) Pass-by-reference for interfaces
13. Explanation: Go is always pass-by-value. When you pass a pointer, the pointer's value (an address) is copied; there is no C++-style reference.
14. Q2: What does `var p *T; p.X` do at runtime if p is nil?
15. A) Returns the zero value
16. B) Compile error
17. C) Allocates a new T
18. D) Panics with nil pointer dereference (*)
19. Explanation: Dereferencing a nil pointer panics. Go has no null-safety in the type system; you must check `if p != nil` explicitly.
20. Q3: The nil-interface trap: `var p *MyErr = nil; var e error = p; e == nil` is?
21. A) false — the interface holds type *MyErr so it's non-nil (*)
22. B) true
23. C) Compile error
24. D) Panic
25. Explanation: An interface is non-nil if it has a type, even with a nil value. e holds (type=*MyErr, value=nil), so e != nil.
26. Q4: How do you avoid the nil-interface trap when returning errors?
27. A) Always return a non-nil error
28. B) Return an explicit `nil` (untyped) interface, not a typed nil pointer (*)
29. C) Use panic instead
30. D) Wrap in a struct
31. Explanation: `return nil` returns a truly nil interface; `return myTypedNil` returns an interface holding (type=*MyErr, value=nil), which is non-nil.
32. Q5: What does `new(T)` return?
33. A) A zero-valued T
34. B) A nil pointer
35. C) A *T pointing to a zero-valued T (*)
36. D) A slice of T
37. Explanation: `new(T)` allocates a zero-valued T and returns a pointer to it. For structs, `&T{}` is more idiomatic and equivalent.
38. Q6: What is escape analysis?
39. A) Detecting panics
40. B) Profiling CPU usage
41. C) Detecting goroutine leaks
42. D) The compiler deciding whether a variable stays on the stack or must move to the heap (*)
43. Explanation: Escape analysis determines if a variable's address escapes the function (forcing heap allocation) or can stay stack-local.
44. Q7: Which flag shows escape analysis decisions?
45. A) go build -gcflags='-m' (*)
46. B) go build -race
47. C) go vet
48. D) go build -cover
49. Explanation: `-gcflags='-m'` (or `-m -m` for verbose) prints the compiler's escape analysis decisions, including "x escapes to heap".
50. Q8: When should you use a pointer receiver on a method?
51. A) Never
52. B) When the method mutates the receiver, or the struct is large, or to satisfy an interface implemented by pointer (*)
53. C) Always, for performance
54. D) Only on unexported types
55. Explanation: Pointer receivers let you mutate, avoid large copies, and are required if other types implement the interface with pointer receivers (mixing value and pointer receivers for one type is allowed but discouraged).
56. Q9: What's the shorthand for `(*p).Field`?
57. A) p->Field
58. B) p::Field
59. C) p.Field — Go auto-dereferences (*)
60. D) (*p).Field is the only form
61. Explanation: Go automatically dereferences pointer-to-struct fields, so `p.Field` is equivalent to `(*p).Field` for readability.
62. Q10: Pre-1.22, what does `for _, v := range s { go func() { use(&v) }() }` do?
63. A) Each goroutine gets its own v
64. B) Compile error
65. C) Panics immediately
66. D) All goroutines share one v — &v is the same address pointing at the last value (*)
67. Explanation: Pre-1.22, the loop variable v is a single variable reused across iterations; &v is the same address. Pass v as a goroutine argument or shadow it inside the loop.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Is Go pass-by-value or pass-by-reference?
  options:
    - Pass-by-reference for structs
    - Pass-by-reference for slices
    - Always pass-by-value — pointers are themselves values
    - Pass-by-reference for interfaces
  correctIndex: 2
  explanation: Go is always pass-by-value. When you pass a pointer, the pointer's value (an address) is copied; there is no C++-style reference.
- id: q2
  question: What does `var p *T; p.X` do at runtime if p is nil?
  options:
    - Returns the zero value
    - Compile error
    - Allocates a new T
    - Panics with nil pointer dereference
  correctIndex: 3
  explanation: Dereferencing a nil pointer panics. Go has no null-safety in the type system; you must check `if p != nil` explicitly.
- id: q3
  question: "The nil-interface trap: `var p *MyErr = nil; var e error = p; e == nil` is?"
  options:
    - false — the interface holds type *MyErr so it's non-nil
    - "true"
    - Compile error
    - Panic
  correctIndex: 0
  explanation: An interface is non-nil if it has a type, even with a nil value. e holds (type=*MyErr, value=nil), so e != nil.
- id: q4
  question: How do you avoid the nil-interface trap when returning errors?
  options:
    - Always return a non-nil error
    - Return an explicit `nil` (untyped) interface, not a typed nil pointer
    - Use panic instead
    - Wrap in a struct
  correctIndex: 1
  explanation: "`return nil` returns a truly nil interface; `return myTypedNil` returns an interface holding (type=*MyErr, value=nil), which is non-nil."
- id: q5
  question: What does `new(T)` return?
  options:
    - "` return?"
    - A zero-valued T
    - A nil pointer
    - A *T pointing to a zero-valued T
    - A slice of T
    - "` allocates a zero-valued T and returns a pointer to it. For structs, `&T{}` is more idiomatic and equivalent."
  correctIndex: 3
  explanation: "`new(T)` allocates a zero-valued T and returns a pointer to it. For structs, `&T{}` is more idiomatic and equivalent."
- id: q6
  question: What is escape analysis?
  options:
    - Detecting panics
    - Profiling CPU usage
    - Detecting goroutine leaks
    - The compiler deciding whether a variable stays on the stack or must move to the heap
  correctIndex: 3
  explanation: Escape analysis determines if a variable's address escapes the function (forcing heap allocation) or can stay stack-local.
- id: q7
  question: Which flag shows escape analysis decisions?
  options:
    - go build -gcflags='-m'
    - go build -race
    - go vet
    - go build -cover
  correctIndex: 0
  explanation: "`-gcflags='-m'` (or `-m -m` for verbose) prints the compiler's escape analysis decisions, including \"x escapes to heap\"."
- id: q8
  question: When should you use a pointer receiver on a method?
  options:
    - Never
    - When the method mutates the receiver, or the struct is large, or to satisfy an interface implemented by pointer
    - Always, for performance
    - Only on unexported types
  correctIndex: 1
  explanation: Pointer receivers let you mutate, avoid large copies, and are required if other types implement the interface with pointer receivers (mixing value and pointer receivers for one type is allowed but discouraged).
- id: q9
  question: What's the shorthand for `(*p).Field`?
  options:
    - p->Field
    - p::Field
    - p.Field — Go auto-dereferences
    - (*p).Field is the only form
  correctIndex: 2
  explanation: Go automatically dereferences pointer-to-struct fields, so `p.Field` is equivalent to `(*p).Field` for readability.
- id: q10
  question: Pre-1.22, what does `for _, v := range s { go func() { use(&v) }() }` do?
  options:
    - Each goroutine gets its own v
    - Compile error
    - Panics immediately
    - All goroutines share one v — &v is the same address pointing at the last value
  correctIndex: 3
  explanation: Pre-1.22, the loop variable v is a single variable reused across iterations; &v is the same address. Pass v as a goroutine argument or shadow it inside the loop.
```

