---
slug: go-maps-structs
id: go-06
track: go
order: 6
title: Maps and Structs
description: Work with Go's two main aggregate types — the hash map and the struct — including map zero values, struct embedding (preview), field tags, and the iteration-order trap.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=4000s
whyItMatters: Work with Go's two main aggregate types — the hash map and the struct — including map zero values, struct embedding (preview), field tags, and the iteration-order trap.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Maps and Structs

## Maps and Structs

### Why It Matters

Work with Go's two main aggregate types — the hash map and the struct — including map zero values, struct embedding (preview), field tags, and the iteration-order trap.

Work with Go's two main aggregate types — the hash map and the struct — including map zero values, struct embedding (preview), field tags, and the iteration-order trap.

### Prerequisites

- Stage 5: Arrays, Slices, and Strings.
- Comfort with `range` and slice headers.

### Topics

- map[K]V — make, literal, nil map, read-vs-write zero value
- Map operations: get, set, delete, the comma-ok idiom
- Map iteration order is randomized
- Concurrency: maps are NOT safe for concurrent use — sync.Map or mutex
- Struct types, field declarations, zero values
- Struct literals: positional vs keyed
- Struct tags (`json:"field_name,omitempty"`)
- Anonymous struct and embedded fields (preview of Stage 9)

### Key Concepts

- A nil map returns the zero value on read but panics on write; always `make(map[K]V)` before writing.
- Map keys must be comparable (no slices, maps, or funcs as keys); pointers and structs are fine.
- Map iteration order is randomized by the runtime — never rely on it; sort keys explicitly.
- Structs are value types like arrays; pass by pointer if you want to mutate or avoid large copies.
- Field tags are arbitrary string metadata read by reflection (encoding/json, database/sql, etc.).

```go
m := map[string]int{"a": 1, "b": 2}
m["c"] = 3
v, ok := m["x"]      // comma-ok: ok is false if absent
if !ok {
    fmt.Println("missing") // v is the zero value (0)
}
delete(m, "a")

var nilMap map[string]int
fmt.Println(nilMap["a"]) // 0 — read OK
// nilMap["a"] = 1       // panic: assignment to entry in nil map
```
Caption: Map basics

### Common Pitfalls

- Concurrent map read+write panics — Go detects concurrent map access and `throw`s (unrecoverable); use `sync.Mutex` or `sync.Map` for concurrent access.
- Writing to a nil map — `var m map[string]int; m["x"] = 1` panics; always `make(map[string]int)` first.
- Taking the address of a map element — `&m["k"]` is a compile error; map entries can move during rehashing, so their address is unstable.
- Using a slice or map as a map key — compile error; only comparable types work; use a string key or a struct of comparable fields.
- Iterating a map and expecting order — the runtime randomizes iteration order; sort keys explicitly when order matters.

### Real-World Applications

- The Go runtime's map implementation is a Swiss-tables-inspired open-addressing hash map; it powers every `map[K]V` in every Go program.
- Kubernetes resource caches (`caches.go`) use maps keyed by `types.UID` to look up pods/services in O(1).
- The `encoding/json` package uses struct field tags via reflection to map JSON keys to Go fields — a pattern copied by `database/sql`, `yaml.v3`, `mapstructure`, and many more.
- HashiCorp Consul's service catalog uses maps of maps keyed by datacenter → service → instance, guarded by RWMutex.

### Interview Questions

- 1. Why does a nil map panic on write but not on read? — Reads return the zero value safely; writes require an initialized hash table, so the runtime panics on `nil[k] = v` to fail fast.
- 2. What types are valid as map keys? — Any comparable type: bool, numbers, strings, arrays, pointers, channels, interfaces (if dynamic type is comparable), and structs of comparable fields. Slices, maps, and funcs are not.
- 3. Why is map iteration order randomized? — To prevent callers from depending on it; the runtime shuffles the iteration start bucket, forcing explicit sorting when order matters.
- 4. What happens if two goroutines write to the same map concurrently? — The runtime detects it and `throw`s (a fatal, unrecoverable panic) — you must use `sync.Mutex`/`RWMutex` or `sync.Map`.
- 5. What do struct tags do? — They're arbitrary string metadata attached to fields, read at runtime via reflection; `encoding/json` uses `json:"name,omitempty"` to drive marshaling.

### Mini Project

Build a JSON-driven Configuration Registry: A library that loads a JSON file into a `map[string]User` and supports lookups by ID, listing in sorted order, and thread-safe updates via `sync.RWMutex`. Suggested approach:
  - Define `type User struct{ ID string; Name string; Roles []string }`
  - Use `json.Unmarshal` into `map[string]User`
  - Wrap the map in a struct with `mu sync.RWMutex` and `Get`, `Set`, `List` methods
  - Sort keys in `List` for deterministic output
  - Add a benchmark comparing `RWMutex`-guarded map vs `sync.Map`

### Exercises

1. Trigger the "concurrent map writes" runtime fatal by spawning two goroutines that write to the same map; observe the crash.
2. Build a map of `[]string` values and rewrite it to use a string key formed by joining, to satisfy the "comparable key" rule.
3. Add `json:"-"` to a `Password` field and verify it's never serialized.
4. Marshal a struct twice — once with `omitempty` and once without — and diff the output.
5. Implement `Set` and `Get` on a `sync.Mutex`-wrapped `map[string]int` and stress-test with 100 goroutines.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What happens when you write to a nil map?
9. A) Compile error
10. B) Panic — runtime error: assignment to entry in nil map (*)
11. C) Silent no-op
12. D) Returns an error
13. Explanation: A nil map has no backing hash table, so writes panic. Reads are safe and return the zero value. Always `make(map[K]V)` before writing.
14. Q2: Which is NOT a valid map key type?
15. A) string
16. B) int
17. C) []int (*)
18. D) struct{ X int }
19. Explanation: Slices are not comparable (no == operator), so they cannot be map keys. Structs of comparable fields are valid keys.
20. Q3: Why does Go randomize map iteration order?
21. A) For performance
22. B) Because maps are stored as hash sets
23. C) It doesn't — that's a bug
24. D) To prevent callers from relying on order, forcing explicit sorting (*)
25. Explanation: The runtime intentionally randomizes the iteration start bucket to break any caller that depends on order, ensuring portability across Go versions.
26. Q4: What's the comma-ok idiom for a map?
27. A) v, ok := m[k] — ok is true iff k is present (*)
28. B) v := m[k]
29. C) v, err := m[k]
30. D) v := m.Get(k)
31. Explanation: `v, ok := m[k]` returns the value and a bool indicating presence; without ok, v is the zero value when absent.
32. Q5: What happens if two goroutines write to the same map concurrently?
33. A) Silent corruption
34. B) The runtime fatally throws "concurrent map writes" (*)
35. C) The map becomes locked
36. D) Compile error
37. Explanation: Go's runtime detects concurrent map access and aborts the program with a fatal (unrecoverable) error; use a mutex or sync.Map.
38. Q6: What do struct field tags like `json:"name,omitempty"` do?
39. A) Rename the Go field at compile time
40. B) Make the field private
41. C) Provide metadata read by reflection in packages like encoding/json (*)
42. D) Add type information
43. Explanation: Field tags are arbitrary strings parsed at runtime via reflect; encoding/json uses them to map JSON keys and control omitempty/skip behavior.
44. Q7: How do you make a map-of-slices like `map[string][]int`?
45. A) m := make(map[string][]int); append to m["k"] directly
46. B) Use sync.Map
47. C) It's impossible
48. D) Initialize the slice first: `m["k"] = append(m["k"], v)` — but be careful, append returns a new slice you must reassign (*)
49. Explanation: `m["k"] = append(m["k"], v)` works because append returns the (possibly new) slice, which you then re-store in the map.
50. Q8: Are structs value types or reference types?
51. A) Value types — assigning a struct copies all fields (*)
52. B) Reference types
53. C) Pointer types
54. D) Interface types
55. Explanation: Structs are value types; passing a struct to a function copies it. Use *Struct if you need mutation or to avoid copying large structs.
56. Q9: What does `&m["k"]` (address of a map element) do?
57. A) Returns a pointer to the value
58. B) Compile error — map element addresses are unstable because of rehashing (*)
59. C) Panics at runtime
60. D) Returns nil
61. Explanation: Map entries can move during rehashing, so taking their address is forbidden by the spec; the compiler rejects `&m[k]`.
62. Q10: Which struct literal style is preferred and why?
63. A) Positional: `User{1, "Alice"}`
64. B) JSON-like: `User{"id":1}`
65. C) Keyed: `User{ID: 1, Name: "Alice"}` — order-independent and self-documenting (*)
66. D) Constructor: `User.New(1, "Alice")`
67. Explanation: Keyed literals are robust to field reordering and addition; positional literals break when fields are added, so keyed is the idiomatic choice.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What happens when you write to a nil map?
  options:
    - Compile error
    - "Panic — runtime error: assignment to entry in nil map"
    - Silent no-op
    - Returns an error
    - "` before writing."
  correctIndex: 1
  explanation: A nil map has no backing hash table, so writes panic. Reads are safe and return the zero value. Always `make(map[K]V)` before writing.
- id: q2
  question: Which is NOT a valid map key type?
  options:
    - string
    - int
    - "[]int"
    - struct{ X int }
  correctIndex: 2
  explanation: Slices are not comparable (no == operator), so they cannot be map keys. Structs of comparable fields are valid keys.
- id: q3
  question: Why does Go randomize map iteration order?
  options:
    - For performance
    - Because maps are stored as hash sets
    - It doesn't — that's a bug
    - To prevent callers from relying on order, forcing explicit sorting
  correctIndex: 3
  explanation: The runtime intentionally randomizes the iteration start bucket to break any caller that depends on order, ensuring portability across Go versions.
- id: q4
  question: What's the comma-ok idiom for a map?
  options:
    - v, ok := m[k] — ok is true iff k is present
    - v := m[k]
    - v, err := m[k]
    - v := m.Get(k)
  correctIndex: 0
  explanation: "`v, ok := m[k]` returns the value and a bool indicating presence; without ok, v is the zero value when absent."
- id: q5
  question: What happens if two goroutines write to the same map concurrently?
  options:
    - Silent corruption
    - The runtime fatally throws "concurrent map writes"
    - The map becomes locked
    - Compile error
  correctIndex: 1
  explanation: Go's runtime detects concurrent map access and aborts the program with a fatal (unrecoverable) error; use a mutex or sync.Map.
- id: q6
  question: What do struct field tags like `json:"name,omitempty"` do?
  options:
    - Rename the Go field at compile time
    - Make the field private
    - Provide metadata read by reflection in packages like encoding/json
    - Add type information
  correctIndex: 2
  explanation: Field tags are arbitrary strings parsed at runtime via reflect; encoding/json uses them to map JSON keys and control omitempty/skip behavior.
- id: q7
  question: How do you make a map-of-slices like `map[string][]int`?
  options:
    - m := make(map[string][]int); append to m["k"] directly
    - Use sync.Map
    - It's impossible
    - 'Initialize the slice first: `m["k"] = append(m["k"], v)` — but be careful, append returns a new slice you must reassign'
  correctIndex: 3
  explanation: '`m["k"] = append(m["k"], v)` works because append returns the (possibly new) slice, which you then re-store in the map.'
- id: q8
  question: Are structs value types or reference types?
  options:
    - Value types — assigning a struct copies all fields
    - Reference types
    - Pointer types
    - Interface types
  correctIndex: 0
  explanation: Structs are value types; passing a struct to a function copies it. Use *Struct if you need mutation or to avoid copying large structs.
- id: q9
  question: What does `&m["k"]` (address of a map element) do?
  options:
    - Returns a pointer to the value
    - Compile error — map element addresses are unstable because of rehashing
    - Panics at runtime
    - Returns nil
  correctIndex: 1
  explanation: Map entries can move during rehashing, so taking their address is forbidden by the spec; the compiler rejects `&m[k]`.
- id: q10
  question: Which struct literal style is preferred and why?
  options:
    - 'Positional: `User{1, "Alice"}`'
    - 'JSON-like: `User{"id":1}`'
    - 'Keyed: `User{ID: 1, Name: "Alice"}` — order-independent and self-documenting'
    - 'Constructor: `User.New(1, "Alice")`'
  correctIndex: 2
  explanation: Keyed literals are robust to field reordering and addition; positional literals break when fields are added, so keyed is the idiomatic choice.
```

