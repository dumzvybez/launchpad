---
slug: rust-collections-vec-hashmap-btreemap
id: rust-11
track: rust
order: 11
title: Collections — Vec, HashMap, BTreeMap
description: Use Rust's core collections — `Vec<T>`, `HashMap<K,V>`, `BTreeMap<K,V>` — and understand when each is appropriate and how ownership moves into them.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OX9HJsJUDxA&t=1000s
whyItMatters: Use Rust's core collections — `Vec<T>`, `HashMap<K,V>`, `BTreeMap<K,V>` — and understand when each is appropriate and how ownership moves into them.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Collections — Vec, HashMap, BTreeMap

## Collections — Vec, HashMap, BTreeMap

### Why It Matters

Use Rust's core collections — `Vec<T>`, `HashMap<K,V>`, `BTreeMap<K,V>` — and understand when each is appropriate and how ownership moves into them.

Use Rust's core collections — `Vec<T>`, `HashMap<K,V>`, `BTreeMap<K,V>` — and understand when each is appropriate and how ownership moves into them.

### Prerequisites

- Stage 10: The Module System
- Stage 7: Slices and String Types
- Stage 5: Ownership — The Fundamental Rule

### Topics

- `Vec<T>`: push, pop, indexing, `with_capacity`, `extend`
- `Vec` growth amortization and capacity
- Slicing `Vec` to `&[T]` and iterating by reference
- `HashMap<K, V>`: insert, get, entry API, removal
- `BTreeMap<K, V>`: ordered iteration, range queries
- `HashSet<T>` and `BTreeSet<T>`
- Ownership: pushing a `String` into a `Vec<String>` moves it
- `Entry` API for "insert if absent" without double lookup
- `collect()` from iterators into collections

### Key Concepts

- `Vec` is a growable heap array; pushing amortizes to O(1) via doubling capacity.
- `HashMap` uses `SipHash` (DoS-resistant) by default; keys must implement `Hash + Eq`.
- `BTreeMap` is a B-tree with sorted keys; iteration is in order and range queries work.
- The `Entry` API is the idiomatic way to "insert if absent" or "modify if present" without a double lookup.
- `collect::<Vec<_>>()` materializes any iterator into a collection; the type may be inferable from context.

```rust
fn main() {
    let mut v: Vec<i32> = Vec::with_capacity(4);
    v.push(1);
    v.push(2);
    v.extend([3, 4]);
    println!("{v:?}  cap={}", v.capacity());
    if let Some(last) = v.pop() { println!("popped {last}"); }
    for n in &v { print!("{n} "); }
}
```
Caption: Vec basics

### Common Pitfalls

- `v[i]` panics on out-of-bounds — use `v.get(i)` returning `Option<&T>` for safe access.
- Forgetting `&` in `for x in &v` — iterating by value consumes `Vec<T>` if `T: Copy` isn't available, moving elements out.
- Using `insert` then `get` (two lookups) — use the `Entry` API to do both in one pass.
- Assuming `HashMap` iteration order is stable — it isn't; if order matters, use `BTreeMap` or sort.
- Pushing a `String` into a `Vec<String>` and then using the original — the value moved into the Vec.

### Real-World Applications

- `serde_json::Map` is a `BTreeMap<String, Value>` by default for deterministic JSON object key order.
- ripgrep uses `Vec<u8>` and `HashSet<PathBuf>` for fast dedup of file paths during traversal.
- Discord's Read States service uses `HashMap<UserId, ReadState>` for O(1) lookups under heavy read traffic.
- Cloudflare's `quiche` uses `BTreeMap<u64, Frame>` to keep ordered stream offsets for HTTP/3 reassembly.

### Interview Questions

- 1. Why does `Vec::push` amortize to O(1)? — Capacity doubles on resize, so total work over N pushes is O(N), amortizing to O(1) per push.
- 2. What traits must a `HashMap` key implement? — `Hash + Eq`; these power hashing and equality for bucket lookup.
- 3. When do you prefer `BTreeMap` over `HashMap`? — When you need ordered iteration or range queries; otherwise `HashMap` is faster for random access.
- 4. What does the `Entry` API do? — Returns an `Entry` enum (`Occupied` or `Vacant`) from a single lookup, enabling `or_insert` without a double lookup.
- 5. What's wrong with `v[i]` for `i` out of range? — It panics at runtime; use `v.get(i)` returning `Option<&T>` for safe access.

### Mini Project

Build a Word Indexer: A tool that reads a file, builds `HashMap<String, Vec<usize>>` mapping each word to the line numbers where it appears, and prints the index sorted alphabetically. Suggested approach:
  - Read lines with `io::BufReader::lines`
  - Use `entry(word).or_default().push(line_no)` for the inverted index
  - Collect into a `BTreeMap<String, Vec<usize>>` for sorted output
  - Print `word: lines...`
  - Add a `--query WORD` flag to look up one word's lines

### Exercises

1. Build a `Vec<i32>` of 1..=10 and use `.iter().map(|x| x*x).collect::<Vec<_>>()`.
2. Count character frequencies in a string using `HashMap<char, u32>` and the Entry API.
3. Insert into a `BTreeMap<&str, i32>` and observe ordered iteration.
4. Use `v.get(100)` and observe `None` instead of a panic.
5. Push a `String` into a `Vec<String>` and try to use the original — observe the move error.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the amortized complexity of `Vec::push`?
9. A) O(n)
10. B) O(log n)
11. C) O(1) (*)
12. D) O(n^2)
13. Explanation: `Vec` doubles capacity on resize; total work for N pushes is O(N), amortizing to O(1) per push.
14. Q2: Which traits must a `HashMap` key implement?
15. A) Ord + PartialOrd
16. B) Clone + Copy
17. C) Default + Display
18. D) Hash + Eq (*)
19. Explanation: `Hash` computes the bucket; `Eq` resolves collisions. `BTreeMap` keys need `Ord`.
20. Q3: Which collection guarantees sorted iteration order?
21. A) BTreeMap (*)
22. B) Vec
23. C) HashMap
24. D) HashSet
25. Explanation: `BTreeMap` is a B-tree; keys are stored sorted. `HashMap` iteration order is unspecified.
26. Q4: What does `v[10]` do when `v.len() == 5`?
27. A) Returns None
28. B) Panics at runtime (*)
29. C) Returns a default value
30. D) Compile error
31. Explanation: Indexing panics on out-of-bounds; use `v.get(10)` for `Option<&T>` access.
32. Q5: What does the Entry API enable?
33. A) Inserting at a specific index
34. B) Iterating in reverse
35. C) Single-lookup "insert if absent" / "modify if present" (*)
36. D) Concurrent access
37. Explanation: `entry(k).or_insert(v)` does one lookup and conditionally inserts; no double lookup.
38. Q6: What does `for x in &v` do for `v: Vec<String>`?
39. A) Moves each String out
40. B) Clones each String
41. C) Drops the Vec
42. D) Borrows each String as `&String` (*)
43. Explanation: `&v` borrows; each `x` is `&String`. `for x in v` (no `&`) would move each element out.
44. Q7: Which method reserves space ahead for known-size pushes?
45. A) `Vec::reserve()` or `Vec::with_capacity()` (*)
46. B) `Vec::grow()`
47. C) `Vec::expand()`
48. D) `Vec::alloc()`
49. Explanation: `with_capacity(n)` pre-allocates; `reserve(additional)` grows if needed, avoiding repeated reallocations.
50. Q8: What does `collect::<Vec<_>>()` do?
51. A) Sums all elements
52. B) Materializes an iterator into a Vec (*)
53. C) Sorts the iterator
54. D) Drops the iterator
55. Explanation: `collect()` consumes the iterator and builds any `FromIterator` collection, often with turbofish for type.
56. Q9: Which collection should you use for ordered, range-queryable keys?
57. A) HashSet
58. B) HashMap
59. C) BTreeMap (*)
60. D) VecDeque
61. Explanation: `BTreeMap` supports ordered iteration and `range()` queries; `HashMap` doesn't.
62. Q10: What happens if you push a `String` into a `Vec<String>`?
63. A) The String is cloned
64. B) The String is borrowed
65. C) Compile error
66. D) The String is moved into the Vec; the original is invalid (*)
67. Explanation: `Vec::push` takes `T` by value; non-Copy `String` is moved, invalidating the original binding.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the amortized complexity of `Vec::push`?
  options:
    - O(n)
    - O(log n)
    - O(1)
    - O(n^2)
    - ", amortizing to O(1) per push."
  correctIndex: 2
  explanation: "`Vec` doubles capacity on resize; total work for N pushes is O(N), amortizing to O(1) per push."
- id: q2
  question: Which traits must a `HashMap` key implement?
  options:
    - Ord + PartialOrd
    - Clone + Copy
    - Default + Display
    - Hash + Eq
  correctIndex: 3
  explanation: "`Hash` computes the bucket; `Eq` resolves collisions. `BTreeMap` keys need `Ord`."
- id: q3
  question: Which collection guarantees sorted iteration order?
  options:
    - BTreeMap
    - Vec
    - HashMap
    - HashSet
  correctIndex: 0
  explanation: "`BTreeMap` is a B-tree; keys are stored sorted. `HashMap` iteration order is unspecified."
- id: q4
  question: What does `v[10]` do when `v.len() == 5`?
  options:
    - Returns None
    - Panics at runtime
    - Returns a default value
    - Compile error
  correctIndex: 1
  explanation: Indexing panics on out-of-bounds; use `v.get(10)` for `Option<&T>` access.
- id: q5
  question: What does the Entry API enable?
  options:
    - Inserting at a specific index
    - Iterating in reverse
    - Single-lookup "insert if absent" / "modify if present"
    - Concurrent access
  correctIndex: 2
  explanation: "`entry(k).or_insert(v)` does one lookup and conditionally inserts; no double lookup."
- id: q6
  question: "What does `for x in &v` do for `v: Vec<String>`?"
  options:
    - Moves each String out
    - Clones each String
    - Drops the Vec
    - Borrows each String as `&String`
  correctIndex: 3
  explanation: "`&v` borrows; each `x` is `&String`. `for x in v` (no `&`) would move each element out."
- id: q7
  question: Which method reserves space ahead for known-size pushes?
  options:
    - "`Vec::reserve()` or `Vec::with_capacity()`"
    - "`Vec::grow()`"
    - "`Vec::expand()`"
    - "`Vec::alloc()`"
  correctIndex: 0
  explanation: "`with_capacity(n)` pre-allocates; `reserve(additional)` grows if needed, avoiding repeated reallocations."
- id: q8
  question: What does `collect::<Vec<_>>()` do?
  options:
    - Sums all elements
    - Materializes an iterator into a Vec
    - Sorts the iterator
    - Drops the iterator
  correctIndex: 1
  explanation: "`collect()` consumes the iterator and builds any `FromIterator` collection, often with turbofish for type."
- id: q9
  question: Which collection should you use for ordered, range-queryable keys?
  options:
    - HashSet
    - HashMap
    - BTreeMap
    - VecDeque
  correctIndex: 2
  explanation: "`BTreeMap` supports ordered iteration and `range()` queries; `HashMap` doesn't."
- id: q10
  question: What happens if you push a `String` into a `Vec<String>`?
  options:
    - The String is cloned
    - The String is borrowed
    - Compile error
    - The String is moved into the Vec; the original is invalid
  correctIndex: 3
  explanation: "`Vec::push` takes `T` by value; non-Copy `String` is moved, invalidating the original binding."
```

