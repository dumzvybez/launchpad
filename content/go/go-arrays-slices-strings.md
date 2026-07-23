---
slug: go-arrays-slices-strings
id: go-05
track: go
order: 5
title: Arrays, Slices, and Strings
description: Master Go's signature data structure — the slice — including backing arrays, capacity, append growth, copy, subslice aliasing, and the immutable string's relationship to []byte.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YS4e4q9oBaU&t=3200s
whyItMatters: Master Go's signature data structure — the slice — including backing arrays, capacity, append growth, copy, subslice aliasing, and the immutable string's relationship to []byte.
deepDiveResources:
  - label: W3Schools Go
    url: https://www.w3schools.com/go/
    kind: course
  - label: Go Official Docs
    url: https://go.dev/doc/
    kind: doc
---

# Arrays, Slices, and Strings

## Arrays, Slices, and Strings

### Why It Matters

Master Go's signature data structure — the slice — including backing arrays, capacity, append growth, copy, subslice aliasing, and the immutable string's relationship to []byte.

Master Go's signature data structure — the slice — including backing arrays, capacity, append growth, copy, subslice aliasing, and the immutable string's relationship to []byte.

### Prerequisites

- Stage 4: Functions, Multiple Returns, and Errors.
- Comfort with `for` and `range`.

### Topics

- Arrays: fixed-size, value types ([N]T)
- Slices: variable-size, reference types ([]T) backed by an array
- slice header: {ptr, len, cap}
- make([]T, len, cap), literal []T{...}, nil slice vs empty slice
- append, copy, and the doubling-capacity growth strategy
- Subslicing (s[1:3]) and the aliasing trap
- Strings as immutable byte slices; []byte(s) conversion cost
- bytes and strings packages (Builder, Reader, Replacer)

### Key Concepts

- An array `[N]T` is a value type — assigning or passing copies all N elements; almost never what you want.
- A slice is a 3-word header (pointer + len + cap) into a backing array; assigning or passing a slice copies only the header.
- `append` returns a new slice header; if cap is sufficient it reuses the backing array, otherwise it allocates a new one and copies.
- A subslice `s[a:b]` shares the backing array — mutating `t[0]` mutates `s[a]`. Use `copy` to detach.
- A nil slice behaves like an empty slice for read operations (`len`, `range`, `append`) but JSON-marshals as `null` not `[]`.

```go
var arr [3]int = [3]int{1, 2, 3}  // array — value type
brr := arr                         // copies all 3 elements
brr[0] = 99
fmt.Println(arr[0], brr[0])        // 1 99

s := []int{1, 2, 3}               // slice — header copied
t := s
t[0] = 99
fmt.Println(s[0], t[0])            // 99 99 — shared backing array
```
Caption: Array vs slice

### Common Pitfalls

- Subslicing keeps the backing array alive — `bytes.Split` on a 1MB file can hold the entire 1MB alive through one tiny subslice; copy out small pieces.
- Forgetting `s = append(s, x)` and writing `append(s, x)` — append returns a new header; if you ignore the return you may keep using the old header and lose data when the capacity grew.
- Assuming `append` always copies — it reuses the backing array if cap permits, so two slices can unexpectedly alias after `t := s[:2:2]; t = append(t, x)` is not used (full slice expression `s[:2:2]` sets cap to 2).
- Comparing slices with `==` — slices (and maps) are not comparable with `==` (compile error); use `bytes.Equal` or `reflect.DeepEqual` or write a loop.
- Returning a slice that aliases an input — `func f(s []int) []int { return s[:5] }` lets callers mutate the caller's data; copy if you need isolation.

### Real-World Applications

- The Go `bytes` package itself uses subslice operations heavily, with carefully documented aliasing guarantees in `bytes.Replace` and `bytes.Split`.
- Kubernetes watch caches use ring buffers backed by slices to avoid allocations on hot paths.
- The `containerd` runtime uses pre-allocated slice pools (`sync.Pool` of `[]byte`) to avoid GC pressure when handling many small container IPC messages.
- Prometheus's TSDB uses capacity-bounded slices and explicit copy on hot paths to control memory residency.

### Interview Questions

- 1. What's in a slice header? — A pointer to the backing array, a length, and a capacity (3 words on 64-bit).
- 2. When does `append` allocate? — When the new length exceeds the current capacity; the runtime grows capacity (typically doubling for small slices, ~1.25x for large).
- 3. What's the difference between a nil slice and an empty slice? — `var s []int` is nil (s == nil); `s := []int{}` is empty (s != nil). Both have len 0, but JSON marshals nil as `null` and empty as `[]`.
- 4. How do you prevent an `append` from aliasing the original? — Use a full slice expression `s[a:b:b]` to cap capacity at b, or `copy` into a fresh slice.
- 5. Why can't you compare two slices with `==`? — Slice equality is ambiguous (deep vs shallow, NaN handling) and the language designers left it to the programmer; use `bytes.Equal` or `reflect.DeepEqual` or a loop.

### Mini Project

Build a CSV-like Line Splitter with Bounded Memory: A library that reads a large file in chunks and yields one line at a time without loading the whole file into memory. Suggested approach:
  - Use `bufio.Scanner` with a custom `SplitFunc` for line boundaries
  - For huge lines, set `scanner.Buffer(buf, maxLineSize)` to avoid OOM
  - Yield lines via a callback or channel; copy out the line bytes to avoid aliasing the scanner's buffer
  - Add a `MaxLines` option and a `--quiet` flag for suppressed output
  - Write a benchmark comparing `bufio.Scanner` vs `bytes.Split`

### Exercises

1. Write a `Reverse(s []int)` function that reverses in place and confirm the original caller's slice reflects the change.
2. Demonstrate the aliasing trap: subslice, mutate, and prove the backing array is shared.
3. Use a full slice expression `s[:2:2]` to force append to allocate, and verify with `cap()`.
4. Marshal a struct with a nil slice and an empty slice to JSON and observe the difference.
5. Implement `Equal(a, b []int) bool` without using `reflect.DeepEqual`.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What three pieces of data make up a Go slice header?
9. A) ptr, len, cap (*)
10. B) ptr, size, type
11. C) array, length, element_size
12. D) head, tail, count
13. Explanation: A slice is a 3-word header: a pointer to the backing array, the current length, and the capacity (max length before reallocation).
14. Q2: What does `append(s, x)` return?
15. A) The original slice mutated in place
16. B) A new slice header (possibly with a new backing array) (*)
17. C) An error
18. D) An index
19. Explanation: `append` returns a new slice header. If capacity is sufficient it reuses the backing array; otherwise it allocates a new one and copies.
20. Q3: Are arrays in Go value types or reference types?
21. A) Reference types
22. B) Pointer types
23. C) Value types — copying an array copies all elements (*)
24. D) Interface types
25. Explanation: Arrays ([N]T) are value types; assigning or passing an array copies all N elements. This is why we usually pass pointers to arrays or use slices.
26. Q4: What does `s == nil` evaluate to for `var s []int`?
27. A) Compile error
28. B) false
29. C) panic
30. D) true (*)
31. Explanation: `var s []int` is a nil slice; comparing to nil yields true. An empty slice `[]int{}` would compare as false.
32. Q5: How does a subslice like `t := s[1:3]` relate to `s`?
33. A) t shares the backing array with s — mutating t[0] mutates s[1] (*)
34. B) t is a deep copy
35. C) t is a new array
36. D) t is immutable
37. Explanation: Subslicing creates a new header pointing into the same backing array, so mutations to t are visible through s (and vice versa).
38. Q6: What happens if you write `append(s, x)` without assigning the result?
39. A) Compile error
40. B) The new element may be lost when the slice grew beyond cap (*)
41. C) Nothing — append mutates s in place
42. D) panic
43. Explanation: append returns a new header; if it had to allocate, the original s still points at the old (too-small) backing array and the new element is unreachable.
44. Q7: Why does `[]int{1,2} == []int{1,2}` not compile?
45. A) The slices are different lengths
46. B) The compiler is buggy
47. C) Slices don't have a == operator — equality is intentionally undefined for slices (*)
48. D) You must use = instead
49. Explanation: Slice equality is not defined (deep vs shallow ambiguity, NaN keys, etc.); use bytes.Equal, reflect.DeepEqual, or a manual loop.
50. Q8: What does `make([]int, 3, 5)` produce?
51. A) A slice of length 5 and capacity 3
52. B) An array of 3 ints
53. C) A map of int to int
54. D) A slice of length 3 and capacity 5 (*)
55. Explanation: `make([]T, len, cap)` creates a slice with the given length (zeroed) and capacity; here 3 elements usable, room for 5 before reallocation.
56. Q9: How does a nil slice behave under `range`?
57. A) Iterates zero times, like an empty slice (*)
58. B) Panics
59. C) Iterates once yielding nil
60. D) Compile error
61. Explanation: Ranging over a nil slice iterates zero times, just like an empty slice — they're equivalent for read operations.
62. Q10: What's a full slice expression and why use it?
63. A) `s[:]` — same as `s`
64. B) `s[low:high:max]` — sets capacity to (max-low) to force append to allocate (*)
65. C) `s[::]` — colon-only syntax
66. D) `s[0:len(s)]` — explicit bounds
67. Explanation: `s[low:high:max]` (three indices) sets the new slice's capacity to `max-low`, letting you control aliasing; appending past `max` allocates a fresh array.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What three pieces of data make up a Go slice header?
  options:
    - ptr, len, cap
    - ptr, size, type
    - array, length, element_size
    - head, tail, count
  correctIndex: 0
  explanation: "A slice is a 3-word header: a pointer to the backing array, the current length, and the capacity (max length before reallocation)."
- id: q2
  question: What does `append(s, x)` return?
  options:
    - The original slice mutated in place
    - A new slice header (possibly with a new backing array)
    - An error
    - An index
  correctIndex: 1
  explanation: "`append` returns a new slice header. If capacity is sufficient it reuses the backing array; otherwise it allocates a new one and copies."
- id: q3
  question: Are arrays in Go value types or reference types?
  options:
    - Reference types
    - Pointer types
    - Value types — copying an array copies all elements
    - Interface types
    - are value types; assigning or passing an array copies all N elements. This is why we usually pass pointers to arrays or use slices.
  correctIndex: 2
  explanation: Arrays ([N]T) are value types; assigning or passing an array copies all N elements. This is why we usually pass pointers to arrays or use slices.
- id: q4
  question: What does `s == nil` evaluate to for `var s []int`?
  options:
    - Compile error
    - "false"
    - panic
    - "true"
  correctIndex: 3
  explanation: "`var s []int` is a nil slice; comparing to nil yields true. An empty slice `[]int{}` would compare as false."
- id: q5
  question: How does a subslice like `t := s[1:3]` relate to `s`?
  options:
    - t shares the backing array with s — mutating t[0] mutates s[1]
    - t is a deep copy
    - t is a new array
    - t is immutable
  correctIndex: 0
  explanation: Subslicing creates a new header pointing into the same backing array, so mutations to t are visible through s (and vice versa).
- id: q6
  question: What happens if you write `append(s, x)` without assigning the result?
  options:
    - Compile error
    - The new element may be lost when the slice grew beyond cap
    - Nothing — append mutates s in place
    - panic
  correctIndex: 1
  explanation: append returns a new header; if it had to allocate, the original s still points at the old (too-small) backing array and the new element is unreachable.
- id: q7
  question: Why does `[]int{1,2} == []int{1,2}` not compile?
  options:
    - The slices are different lengths
    - The compiler is buggy
    - Slices don't have a == operator — equality is intentionally undefined for slices
    - You must use = instead
  correctIndex: 2
  explanation: Slice equality is not defined (deep vs shallow ambiguity, NaN keys, etc.); use bytes.Equal, reflect.DeepEqual, or a manual loop.
- id: q8
  question: What does `make([]int, 3, 5)` produce?
  options:
    - A slice of length 5 and capacity 3
    - An array of 3 ints
    - A map of int to int
    - A slice of length 3 and capacity 5
  correctIndex: 3
  explanation: "`make([]T, len, cap)` creates a slice with the given length (zeroed) and capacity; here 3 elements usable, room for 5 before reallocation."
- id: q9
  question: How does a nil slice behave under `range`?
  options:
    - Iterates zero times, like an empty slice
    - Panics
    - Iterates once yielding nil
    - Compile error
  correctIndex: 0
  explanation: Ranging over a nil slice iterates zero times, just like an empty slice — they're equivalent for read operations.
- id: q10
  question: What's a full slice expression and why use it?
  options:
    - "`s[:]` — same as `s`"
    - "`s[low:high:max]` — sets capacity to (max-low) to force append to allocate"
    - "`s[::]` — colon-only syntax"
    - "`s[0:len(s)]` — explicit bounds"
  correctIndex: 1
  explanation: "`s[low:high:max]` (three indices) sets the new slice's capacity to `max-low`, letting you control aliasing; appending past `max` allocates a fresh array."
```

