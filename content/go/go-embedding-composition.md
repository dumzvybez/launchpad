---
slug: go-embedding-composition
id: go-09
track: go
order: 9
title: Embedding and Composition
description: Master Go's composition-over-inheritance model — struct embedding (field and method promotion), interface embedding, and the subtle difference between embedding a struct vs embedding an interface.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=6400s
whyItMatters: Master Go's composition-over-inheritance model — struct embedding (field and method promotion), interface embedding, and the subtle difference between embedding a struct vs embedding an interface.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Embedding and Composition

## Embedding and Composition

### Why It Matters

Master Go's composition-over-inheritance model — struct embedding (field and method promotion), interface embedding, and the subtle difference between embedding a struct vs embedding an interface.

Master Go's composition-over-inheritance model — struct embedding (field and method promotion), interface embedding, and the subtle difference between embedding a struct vs embedding an interface.

### Prerequisites

- Stage 8: Methods and Interfaces.
- Comfort with pointer vs value receivers.

### Topics

- Struct embedding: an un-named field of type T
- Field and method promotion rules
- Embedding by value vs by pointer
- Overriding promoted methods (and calling the inner via `s.T.Method()`)
- Interface embedding (composition of contracts)
- Embedding an interface inside a struct (advanced — partial implementation)
- Why Go has no inheritance, no virtual methods, no super()
- Mocking via interface embedding in tests

### Key Concepts

- Go has no inheritance; it has embedding. An embedded field's methods and fields are promoted to the outer struct, but there is no subtype relationship.
- Embedding by value (`T`) makes the inner part of the outer; embedding by pointer (`*T`) shares one instance and allows nil inner.
- Promoted methods can be overridden by defining a method with the same name on the outer struct; the outer can call the inner via `s.T.Method()`.
- Embedding an interface in a struct lets you partially implement the interface and defer the rest to a runtime-supplied implementation — a powerful pattern for decorators and mocks.
- There is no `super()` and no virtual dispatch; method calls are statically resolved at compile time based on the static type.

```go
type Animal struct{ Name string }
func (a Animal) Speak() string { return a.Name + " makes a sound" }

type Dog struct {
    Animal        // embedded — Dog has a Name field and Speak method
    Breed string
}

d := Dog{Animal: Animal{Name: "Rex"}, Breed: "Lab"}
fmt.Println(d.Name)        // "Rex" — promoted field
fmt.Println(d.Speak())     // "Rex makes a sound" — promoted method
fmt.Println(d.Animal.Speak()) // also works — explicit access
```
Caption: Basic struct embedding

### Common Pitfalls

- Expecting subtype polymorphism — `Dog` is NOT a subtype of `Animal` in Go; you cannot pass a `Dog` where an `Animal` is required unless `Animal` is an interface.
- Embedding a struct by value when you want shared state — by-value embedding copies the inner at construction; use `*T` for shared mutable state.
- Forgetting that promoted method overrides are not virtual — `s.Speak()` calls the outer; `s.Animal.Speak()` calls the inner; there's no dynamic dispatch on the concrete type.
- Embedding an interface and forgetting to initialize it — calling a method on the nil embedded interface panics; either initialize or check.
- Confusing embedding with composition — embedding promotes names; plain composition (a named field) does not. `type S struct { a A }` does not promote A's methods; `type S struct { A }` does.

### Real-World Applications

- `bufio.Reader` embeds `io.Reader` (interface) so it can wrap any reader while adding buffering — the canonical decorator pattern in Go.
- `http.ServeMux` and middleware libraries embed `http.Handler` to compose handlers; gorilla/mux and chi both use this pattern.
- Logrus and Zap loggers embed a core `io.Writer` plus optional hooks; the embedded interface lets users swap destinations.
- Kubernetes `client-go`'s `clientset` embeds many versioned interfaces (AppsV1Interface, CoreV1Interface) to compose a single typed client.

### Interview Questions

- 1. What's the difference between inheritance and embedding? — Inheritance creates subtype relationships and virtual dispatch; embedding promotes names but creates no subtype relation and uses static dispatch.
- 2. What gets promoted when you embed a struct? — All exported and unexported fields and methods of the embedded type are promoted to the outer struct, accessible without qualification.
- 3. Can you override a promoted method? — Yes — define a method with the same name on the outer struct; the outer method wins for `s.M()`, but `s.T.M()` still calls the inner.
- 4. What does embedding an interface in a struct do? — Defers part of the interface implementation to runtime; the struct provides some methods and delegates the rest to the embedded interface.
- 5. Does Go have `super()`? — No — there's no virtual dispatch and no super; you call the embedded method explicitly via `s.T.M()`.

### Mini Project

Build a Layered Logger with Middleware Embedding: A small `log` package with a `CoreLogger` interface (`Log(level, msg string)`), and decorators that add timestamps, JSON formatting, and rate limiting — all via interface embedding. Suggested approach:
  - Define `type Logger interface { Log(level, msg string) }`
  - Build `type TimestampLogger struct { Logger }` that prepends time.Now
  - Build `type JSONLogger struct { Logger }` that wraps msg in JSON
  - Compose: `l := &JSONLogger{Logger: &TimestampLogger{Logger: &StdoutLogger{}}}`
  - Add a test that verifies the order of decorations

### Exercises

1. Embed `sync.Mutex` into a struct and call `s.Lock()` directly — verify promotion works.
2. Override a promoted method and call both via `s.M()` and `s.T.M()`.
3. Embed an interface in a struct, leave it nil, and trigger the panic; then guard with `if s.I != nil`.
4. Build a decorator that wraps `io.Reader` and counts bytes read, using interface embedding.
5. Compare `type S struct { A A }` (named field, no promotion) vs `type S struct { A }` (embedded, promotion) by trying `s.M()` on each.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does embedding a struct promote to the outer struct?
9. A) Both fields and methods of the embedded type (*)
10. B) Only fields
11. C) Only methods
12. D) Nothing — you must access via the field name
13. Explanation: Embedding promotes both fields and methods of the inner type to the outer struct, accessible without qualification, while still allowing explicit access.
14. Q2: Does embedding create a subtype relationship?
15. A) Yes — Dog is a subtype of Animal
16. B) No — Go has no subtypes; embedding only promotes names (*)
17. C) Only if both are interfaces
18. D) Only with pointer embedding
19. Explanation: Go has no inheritance or subtypes. Embedding promotes names but does not make the outer type assignable where the inner is required (unless the inner is an interface and the outer satisfies it).
20. Q3: How do you call the inner method when the outer overrides it?
21. A) super.M()
22. B) s.M.inner()
23. C) s.T.M() — explicit access to the embedded field (*)
24. D) You can't
25. Explanation: There's no `super`; call the embedded method explicitly via `s.T.M()` where T is the embedded type's name.
26. Q4: What's the difference between `type S struct { A A }` and `type S struct { A }`?
27. A) No difference
28. B) The first embeds A; the second is a named field
29. C) Both embed A
30. D) The second embeds A (promoting methods/fields); the first is a named field (no promotion) (*)
31. Explanation: `struct { A }` (no field name) embeds A and promotes; `struct { A A }` is a named field and does not promote. To call A's methods on the latter, use `s.A.M()`.
32. Q5: What does embedding an interface in a struct enable?
33. A) Partial implementation + runtime delegation of the rest (*)
34. B) Multiple inheritance
35. C) Generic dispatch
36. D) Compile-time interface checking
37. Explanation: Embedding an interface lets the struct provide some methods and delegate the rest to a runtime-supplied implementation set into the embedded interface field — a classic decorator pattern.
38. Q6: What happens if you call a method on a nil embedded interface?
39. A) Returns nil
40. B) Panics — nil interface dereference (*)
41. C) Compile error
42. D) Calls a default no-op
43. Explanation: An uninitialized embedded interface is nil; calling a method on it panics. Guard with `if s.Inner != nil` or initialize at construction.
44. Q7: Does Go support virtual dispatch on concrete types?
45. A) Yes — all methods are virtual
46. B) Only for embedded methods
47. C) No — method calls on concrete types are statically resolved (*)
48. D) Only for pointer receivers
49. Explanation: Go has virtual dispatch only through interfaces. Calls on concrete types are statically resolved at compile time — no vtable lookup.
50. Q8: Why embed by pointer (`*T`) instead of by value (`T`)?
51. A) Pointer embedding is always faster
52. B) Value embedding is illegal
53. C) Pointer embedding promotes more methods
54. D) To share one instance of the inner across multiple outers, and to allow nil inner (*)
55. Explanation: Pointer embedding shares the inner instance (mutations visible across all outers), allows nil inner (lazy init), and is required when the inner has unexported zero values you can't construct.
56. Q9: Which standard library type embeds io.Reader to add buffering?
57. A) bufio.Reader (*)
58. B) bytes.Buffer
59. C) io.LimitReader
60. D) strings.Reader
61. Explanation: `bufio.Reader` embeds `io.Reader` (an interface) so it can wrap any reader while adding read-ahead buffering — the canonical decorator pattern.
62. Q10: What's a common test-time use of interface embedding?
63. A) Performance optimization
64. B) Mocking — embed a mock interface to override only the methods a test exercises (*)
65. C) Garbage collection tuning
66. D) Generic dispatch
67. Explanation: Embedding an interface in a real struct lets tests substitute a mock that overrides only the relevant methods, delegating the rest to the real implementation — a staple Go testing pattern.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does embedding a struct promote to the outer struct?
  options:
    - Both fields and methods of the embedded type
    - Only fields
    - Only methods
    - Nothing — you must access via the field name
  correctIndex: 0
  explanation: Embedding promotes both fields and methods of the inner type to the outer struct, accessible without qualification, while still allowing explicit access.
- id: q2
  question: Does embedding create a subtype relationship?
  options:
    - Yes — Dog is a subtype of Animal
    - No — Go has no subtypes; embedding only promotes names
    - Only if both are interfaces
    - Only with pointer embedding
  correctIndex: 1
  explanation: Go has no inheritance or subtypes. Embedding promotes names but does not make the outer type assignable where the inner is required (unless the inner is an interface and the outer satisfies it).
- id: q3
  question: How do you call the inner method when the outer overrides it?
  options:
    - super.M()
    - s.M.inner()
    - s.T.M() — explicit access to the embedded field
    - You can't
  correctIndex: 2
  explanation: There's no `super`; call the embedded method explicitly via `s.T.M()` where T is the embedded type's name.
- id: q4
  question: What's the difference between `type S struct { A A }` and `type S struct { A }`?
  options:
    - No difference
    - The first embeds A; the second is a named field
    - Both embed A
    - The second embeds A (promoting methods/fields); the first is a named field (no promotion)
  correctIndex: 3
  explanation: "`struct { A }` (no field name) embeds A and promotes; `struct { A A }` is a named field and does not promote. To call A's methods on the latter, use `s.A.M()`."
- id: q5
  question: What does embedding an interface in a struct enable?
  options:
    - Partial implementation + runtime delegation of the rest
    - Multiple inheritance
    - Generic dispatch
    - Compile-time interface checking
  correctIndex: 0
  explanation: Embedding an interface lets the struct provide some methods and delegate the rest to a runtime-supplied implementation set into the embedded interface field — a classic decorator pattern.
- id: q6
  question: What happens if you call a method on a nil embedded interface?
  options:
    - Returns nil
    - Panics — nil interface dereference
    - Compile error
    - Calls a default no-op
  correctIndex: 1
  explanation: An uninitialized embedded interface is nil; calling a method on it panics. Guard with `if s.Inner != nil` or initialize at construction.
- id: q7
  question: Does Go support virtual dispatch on concrete types?
  options:
    - Yes — all methods are virtual
    - Only for embedded methods
    - No — method calls on concrete types are statically resolved
    - Only for pointer receivers
  correctIndex: 2
  explanation: Go has virtual dispatch only through interfaces. Calls on concrete types are statically resolved at compile time — no vtable lookup.
- id: q8
  question: Why embed by pointer (`*T`) instead of by value (`T`)?
  options:
    - Pointer embedding is always faster
    - Value embedding is illegal
    - Pointer embedding promotes more methods
    - To share one instance of the inner across multiple outers, and to allow nil inner
  correctIndex: 3
  explanation: Pointer embedding shares the inner instance (mutations visible across all outers), allows nil inner (lazy init), and is required when the inner has unexported zero values you can't construct.
- id: q9
  question: Which standard library type embeds io.Reader to add buffering?
  options:
    - bufio.Reader
    - bytes.Buffer
    - io.LimitReader
    - strings.Reader
  correctIndex: 0
  explanation: "`bufio.Reader` embeds `io.Reader` (an interface) so it can wrap any reader while adding read-ahead buffering — the canonical decorator pattern."
- id: q10
  question: What's a common test-time use of interface embedding?
  options:
    - Performance optimization
    - Mocking — embed a mock interface to override only the methods a test exercises
    - Garbage collection tuning
    - Generic dispatch
  correctIndex: 1
  explanation: Embedding an interface in a real struct lets tests substitute a mock that overrides only the relevant methods, delegating the rest to the real implementation — a staple Go testing pattern.
```

