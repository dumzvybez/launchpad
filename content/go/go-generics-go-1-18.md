---
slug: go-generics-go-1-18
id: go-14
track: go
order: 14
title: Generics (Go 1.18+)
description: Write type-parameterized functions and types with Go 1.18+ generics — understand type sets, constraints, the constraints/comparable package, and when generics beat interfaces (and when they don't).
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=10400s
whyItMatters: Write type-parameterized functions and types with Go 1. 18+ generics — understand type sets, constraints, the constraints/comparable package, and when generics beat interfaces (and when they don't).
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Generics (Go 1.18+)

## Generics (Go 1.18+)

### Why It Matters

Write type-parameterized functions and types with Go 1. 18+ generics — understand type sets, constraints, the constraints/comparable package, and when generics beat interfaces (and when they don't).

Write type-parameterized functions and types with Go 1.18+ generics — understand type sets, constraints, the constraints/comparable package, and when generics beat interfaces (and when they don't).

### Prerequisites

- Stage 13: Error Handling Patterns.
- Comfort with interfaces and slices.

### Topics

- Type parameters: `func Map[T, U any](s []T, f func(T) U) []U`
- Type sets and constraints (the `[T ~int | ~float64]` syntax)
- The constraints package: Ordered, Comparable (and the cmp package in 1.21)
- Generic types: `type Set[T comparable] map[T]struct{}`
- Generic methods and receiver constraints
- Type inference at call sites
- When to use generics vs interfaces vs code generation
- The slices and maps packages (Go 1.21+)

### Key Concepts

- Type parameters are compile-time abstractions; unlike C++ templates, Go constrains them with interfaces (type sets) and rejects operations not allowed for all types in the set.
- `comparable` is a built-in constraint allowing `==` and `!=`; required for map keys and slice-search.
- The `~` token ("underlying type") allows `[T ~int]` to accept any type whose underlying type is int (e.g., `type MyInt int`).
- Type inference usually lets you omit type arguments: `Map(s, f)` instead of `Map[int, string](s, f)`.
- Generics shine for container types (Set, Heap, Stack), functional helpers (Map, Filter, Reduce), and the standard library's `slices`/`maps` packages; they don't replace interfaces for runtime polymorphism.

```go
func Map[T, U any](s []T, f func(T) U) []U {
    out := make([]U, len(s))
    for i, v := range s {
        out[i] = f(v)
    }
    return out
}

func Filter[T any](s []T, keep func(T) bool) []T {
    out := s[:0:0] // nil slice
    for _, v := range s {
        if keep(v) {
            out = append(out, v)
        }
    }
    return out
}

doubled := Map([]int{1, 2, 3}, func(x int) int { return x * 2 })
names := Map([]User{...}, func(u User) string { return u.Name })
```
Caption: Generic Map and Filter

### Common Pitfalls

- Reaching for generics when an interface suffices — generics are a tool, not a goal; if a non-generic `[]int` works, use it.
- Over-constraining type parameters — `[T int | int32 | int64]` is brittle; use `[T cmp.Ordered]` or a custom constraint with `~`.
- Forgetting `~` for type aliases — `[T int]` rejects `type MyInt int`; `[T ~int]` accepts it via underlying-type matching.
- Methods cannot have type parameters not on the receiver — Go doesn't (yet) support generic methods; use a top-level generic function instead.
- Comparing generic values with `==` without `comparable` — the compiler rejects it; add `comparable` to the constraint or use `cmp.Compare`.

### Real-World Applications

- The Go 1.21 standard library's `slices` and `maps` packages are entirely generic — replacing thousands of lines of per-type sort/search helpers.
- The `container/heap` package was previously interface-based (sort.Interface-like); many codebases now use generic heap implementations.
- Loophole Labs' drivers and the Kratos game server use generics for typed configuration loading and event bus dispatch.
- The popular `golang.org/x/exp/constraints` and `golang.org/x/exp/slices` packages were the prototypes that became the 1.21 standard library.

### Interview Questions

- 1. When did Go introduce generics? — Go 1.18 (March 2022); type parameters, type sets, and the constraints package shipped.
- 2. What's a type set? — The set of types allowed for a type parameter, expressed as an interface with embedded types (e.g., `[T ~int | ~string]`).
- 3. What does `comparable` constrain? — Types that support `==` and `!=`; required for map keys and `slices.Contains`.
- 4. What does `~` mean in a constraint? — "Underlying type" — `[T ~int]` accepts any type whose underlying type is int (e.g., `type MyInt int`), not just int itself.
- 5. When should you NOT use generics? — When an interface or concrete type suffices; generics add complexity and aren't free at the call site or for readability.

### Mini Project

Build a Generic Cache with TTL: A library `cache.New[K comparable, V any]()` returning a `Cache[K, V]` with `Get`, `Set` (with TTL), and `Delete`, internally backed by `map[K]entry[V]` guarded by `sync.RWMutex`. Suggested approach:
  - Define `type entry[V any] struct { v V; expiresAt time.Time }`
  - Use `sync.RWMutex` for concurrent access; check expiry on Get
  - Provide a `Cleanup()` method that scans and purges expired entries
  - Add a generic `GetOrCompute(K, func() V) V` helper
  - Write tests for `Cache[string, *User]` and `Cache[int, float64]`

### Exercises

1. Write a generic `Contains[T comparable](s []T, v T) bool` and compare with `slices.Contains`.
2. Build a generic `Stack[T any]` with Push/Pop/Peek; test with int and string.
3. Use `[T cmp.Ordered]` to implement a generic `Max` for int, float64, and string.
4. Refactor a `Set` type that previously used `map[interface{}]struct{}` to use generics.
5. Use `maps.Clone` and `slices.Sort` to replace hand-written map-copy and slice-sort code.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which Go version introduced generics?
9. A) 1.16
10. B) 1.18 (*)
11. C) 1.17
12. D) 1.21
13. Explanation: Go 1.18 (March 2022) shipped type parameters, type sets, and the constraints package — the biggest language change since Go 1.
14. Q2: Which built-in constraint allows `==` and `!=`?
15. A) any
16. B) Ordered
17. C) comparable (*)
18. D) Equal
19. Explanation: `comparable` is a predeclared constraint that permits `==` and `!=`; required for map keys, slice-contains, and similar equality operations.
20. Q3: What does the `~` token do in a constraint?
21. A) Bitwise NOT
22. B) Approximate equality
23. C) Negates the constraint
24. D) Matches the underlying type, accepting type aliases like `type MyInt int` (*)
25. Explanation: `~T` means "any type whose underlying type is T." `[T ~int]` accepts int, MyInt (where `type MyInt int`), and any other int-based named type.
26. Q4: What is a type set?
27. A) The set of types allowed for a type parameter, expressed as an interface embedding types (*)
28. B) A runtime collection of types
29. C) A reflect.Kind enum
30. D) A generic map
31. Explanation: A type set is the set of types a type parameter can be instantiated with, expressed via an interface that embeds types (e.g., `interface{ ~int | ~string }`).
32. Q5: Can a Go method have its own type parameters (not on the receiver)?
33. A) Yes, always
34. B) No — Go does not (yet) support generic methods; use a top-level function (*)
35. C) Only on interface methods
36. D) Only in Go 1.22+
37. Explanation: As of Go 1.22, methods cannot introduce type parameters beyond those on the receiver. Use a top-level generic function (e.g., `slices.Sort`) for this.
38. Q6: Which Go 1.21 standard library packages are entirely generic?
39. A) sort and container/heap
40. B) encoding/json
41. C) slices and maps (*)
42. D) net/http
43. Explanation: `slices` and `maps` (Go 1.21) provide generic Sort, BinarySearch, Contains, Clone, Keys, Values, etc. — replacing most per-type helpers in user code.
44. Q7: Which constraint in the cmp package (Go 1.21) allows `<`, `>`, `<=`, `>=`?
45. A) cmp.Comparable
46. B) cmp.Sorted
47. C) cmp.Numeric
48. D) cmp.Ordered (*)
49. Explanation: `cmp.Ordered` is `~int | ~uint | ~float | ~string` (roughly), allowing ordered comparison. The `cmp` package also provides `cmp.Compare` and `cmp.Less`.
50. Q8: When should you NOT use generics?
51. A) When a concrete type or interface suffices — don't add complexity for no gain (*)
52. B) Always — generics are always better
53. C) Only for library code
54. D) Never use generics
55. Explanation: Generics are a tool, not a goal. If a non-generic `[]int` works, use it. Reach for generics for containers, functional helpers, and standard library-style utilities.
56. Q9: What does type inference let you do at the call site?
57. A) Skip the function name
58. B) Skip type arguments — `Map(s, f)` instead of `Map[int, string](s, f)` (*)
59. C) Skip return values
60. D) Run the function lazily
61. Explanation: The compiler infers type arguments from the function's argument types, so explicit instantiation is usually unnecessary. Specify explicitly only when inference can't deduce (e.g., zero-arg funcs).
62. Q10: Which standard library function sorts a `[]int` in place in Go 1.21+?
63. A) sort.Ints
64. B) container/heap
65. C) slices.Sort (*)
66. D) reflect.Sort
67. Explanation: `slices.Sort(s)` is generic and works on any slice of `cmp.Ordered` elements. `sort.Ints` still works but is the older, non-generic path.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which Go version introduced generics?
  options:
    - "1.16"
    - "1.18"
    - "1.17"
    - "1.21"
  correctIndex: 1
  explanation: Go 1.18 (March 2022) shipped type parameters, type sets, and the constraints package — the biggest language change since Go 1.
- id: q2
  question: Which built-in constraint allows `==` and `!=`?
  options:
    - any
    - Ordered
    - comparable
    - Equal
  correctIndex: 2
  explanation: "`comparable` is a predeclared constraint that permits `==` and `!=`; required for map keys, slice-contains, and similar equality operations."
- id: q3
  question: What does the `~` token do in a constraint?
  options:
    - Bitwise NOT
    - Approximate equality
    - Negates the constraint
    - Matches the underlying type, accepting type aliases like `type MyInt int`
  correctIndex: 3
  explanation: '`~T` means "any type whose underlying type is T." `[T ~int]` accepts int, MyInt (where `type MyInt int`), and any other int-based named type.'
- id: q4
  question: What is a type set?
  options:
    - The set of types allowed for a type parameter, expressed as an interface embedding types
    - A runtime collection of types
    - A reflect.Kind enum
    - A generic map
  correctIndex: 0
  explanation: A type set is the set of types a type parameter can be instantiated with, expressed via an interface that embeds types (e.g., `interface{ ~int | ~string }`).
- id: q5
  question: Can a Go method have its own type parameters (not on the receiver)?
  options:
    - Yes, always
    - No — Go does not (yet) support generic methods; use a top-level function
    - Only on interface methods
    - Only in Go 1.22+
  correctIndex: 1
  explanation: As of Go 1.22, methods cannot introduce type parameters beyond those on the receiver. Use a top-level generic function (e.g., `slices.Sort`) for this.
- id: q6
  question: Which Go 1.21 standard library packages are entirely generic?
  options:
    - sort and container/heap
    - encoding/json
    - slices and maps
    - net/http
  correctIndex: 2
  explanation: "`slices` and `maps` (Go 1.21) provide generic Sort, BinarySearch, Contains, Clone, Keys, Values, etc. — replacing most per-type helpers in user code."
- id: q7
  question: Which constraint in the cmp package (Go 1.21) allows `<`, `>`, `<=`, `>=`?
  options:
    - cmp.Comparable
    - cmp.Sorted
    - cmp.Numeric
    - cmp.Ordered
  correctIndex: 3
  explanation: "`cmp.Ordered` is `~int | ~uint | ~float | ~string` (roughly), allowing ordered comparison. The `cmp` package also provides `cmp.Compare` and `cmp.Less`."
- id: q8
  question: When should you NOT use generics?
  options:
    - When a concrete type or interface suffices — don't add complexity for no gain
    - Always — generics are always better
    - Only for library code
    - Never use generics
  correctIndex: 0
  explanation: Generics are a tool, not a goal. If a non-generic `[]int` works, use it. Reach for generics for containers, functional helpers, and standard library-style utilities.
- id: q9
  question: What does type inference let you do at the call site?
  options:
    - Skip the function name
    - Skip type arguments — `Map(s, f)` instead of `Map[int, string](s, f)`
    - Skip return values
    - Run the function lazily
  correctIndex: 1
  explanation: The compiler infers type arguments from the function's argument types, so explicit instantiation is usually unnecessary. Specify explicitly only when inference can't deduce (e.g., zero-arg funcs).
- id: q10
  question: Which standard library function sorts a `[]int` in place in Go 1.21+?
  options:
    - sort.Ints
    - container/heap
    - slices.Sort
    - reflect.Sort
  correctIndex: 2
  explanation: "`slices.Sort(s)` is generic and works on any slice of `cmp.Ordered` elements. `sort.Ints` still works but is the older, non-generic path."
```

