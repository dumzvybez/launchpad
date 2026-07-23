---
slug: rust-slices-string-types-string-vs-str
id: rust-07
track: rust
order: 7
title: Slices and String Types (String vs &str)
description: Master `&[T]` slices and the `String`/`&str` distinction — the most-confused pair in Rust — and learn when to use each.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OX9HJsJUDxA&t=600s
whyItMatters: Master `&[T]` slices and the `String`/`&str` distinction — the most-confused pair in Rust — and learn when to use each.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Slices and String Types (String vs &str)

## Slices and String Types (String vs &str)

### Why It Matters

Master `&[T]` slices and the `String`/`&str` distinction — the most-confused pair in Rust — and learn when to use each.

Master `&[T]` slices and the `String`/`&str` distinction — the most-confused pair in Rust — and learn when to use each.

### Prerequisites

- Stage 6: References and Borrowing
- Stage 5: Ownership — The Fundamental Rule

### Topics

- Slices `&[T]` and `&mut [T]` as fat-pointer views
- String slices `&str` = `&[u8]` guaranteed UTF-8
- `String` (owned, growable, heap-allocated) vs `&str` (borrowed, fixed)
- `&str` literals: `'static` lifetime, stored in the binary
- `String::from`, `.to_string()`, `.to_owned()`, `format!`
- Slicing with `[a..b]` on String/&str (panics on non-char boundaries!)
- Deref coercion: `&String` -> `&str`, `&Vec<T>` -> `&[T]`
- Byte strings `b"..."`, raw strings `r"..."`, and `OsStr`/`Path` for filesystem paths

### Key Concepts

- `&[T]` is a fat pointer (start + length) that borrows from an owner; it does not allocate.
- `String` is a heap buffer of UTF-8 bytes; `&str` is a borrowed view of UTF-8 bytes (often pointing into a `String` or a `'static` literal).
- Functions should prefer `&str` over `&String` (more general; `&String` derefs to `&str`).
- `String` is to `&str` what `Vec<T>` is to `&[T]` — owner vs view.
- Slicing a string at a non-UTF-8 byte boundary panics; use `.chars()`/`.char_indices()` for safe iteration.

```rust
fn greet(name: &str) -> String {       // takes any &str (literals, &String, etc.)
    format!("Hello, {name}!")
}

fn main() {
    let owned: String = String::from("Ada");
    let lit: &str = "Grace";            // &'static str
    let borrowed: &str = &owned;        // &String -> &str via deref coercion
    println!("{}", greet(&owned));
    println!("{}", greet(lit));
    println!("{}", greet(borrowed));
}
```
Caption: String vs &str

### Common Pitfalls

- Slicing a non-ASCII `&str` at an arbitrary byte index — panics at runtime on a char boundary; iterate with `.char_indices()`.
- Storing `&str` in a struct when you need ownership — `&str` borrows; if the struct outlives the borrow you need `String`.
- Using `&String` as a parameter type — use `&str` for generality (any `&String` derefs to `&str`, but not vice versa).
- Confusing `to_string()` (allocates a `String`) with `as_str()` (returns a borrow) — they're fundamentally different operations.
- Calling `.push_str()` on a `&str` — `&str` is immutable; you need an owned `String` to grow it.

### Real-World Applications

- `serde_json` exposes `&str` views into the parsed buffer when using `&[u8]` input, avoiding allocations.
- ripgrep uses `&[u8]` slices (via `bstr`) throughout because file contents are not always UTF-8.
- Cloudflare's `quiche` parses packet headers as `&[u8]` slices borrowed from the network buffer.
- The standard library's `Path`/`OsStr` types abstract over platform-specific path encodings for safe filesystem code.

### Interview Questions

- 1. What's the difference between `String` and `&str`? — `String` owns a growable heap UTF-8 buffer; `&str` is a borrowed view (often into a `String` or a `'static` literal).
- 2. Why prefer `&str` over `&String` as a function parameter? — More general; `&String` derefs to `&str` but not vice versa, so `&str` accepts both.
- 3. What is a slice? — A fat pointer (start + length) that borrows from an owner; `&[T]` and `&str` are slices.
- 4. What happens if you slice a `&str` at a non-char boundary? — Runtime panic ("byte index N is not a char boundary"); use `.char_indices()` for safe iteration.
- 5. What is deref coercion? — Automatic conversion `&String -> &str`, `&Vec<T> -> &[T]`, `&Box<T> -> &T` so APIs can take the more general borrowed form.

### Mini Project

Build a Word Frequency Counter: Read text from stdin, split on whitespace, count occurrences of each word, and print the top 5. Suggested approach:
  - Read with `io::stdin().read_to_string(&mut buf)`
  - Use `buf.split_whitespace()` returning `&str` slices (no allocation)
  - Store counts in `HashMap<&str, u32>` (borrows from `buf`)
  - Sort by count using a collected `Vec<(&str, u32)>`
  - Print the top 5 with `println!`

### Exercises

1. Write `fn longest_word(s: &str) -> &str` returning a slice of the longest word.
2. Build a `String` with `push_str` and `+`, then slice it into `&str` views.
3. Cause a char-boundary panic by slicing `"héllo"` at byte 1; fix with `.char_indices()`.
4. Write a function `fn first(s: &String) -> &str` and call it on a `String`; then change it to `&str` and observe it accepts more inputs.
5. Use `b"..."` byte string literals and inspect the `&[u8; N]` type.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is `&str`?
9. A) An owned growable UTF-8 buffer
10. B) A list of chars
11. C) A borrowed view of UTF-8 bytes (*)
12. D) A wide pointer to bytes
13. Explanation: `&str` is a fat pointer (start + length) borrowing UTF-8 bytes; `String` is the owned, growable form.
14. Q2: Which is more general as a function parameter?
15. A) `&String`
16. B) `String`
17. C) `&'static str`
18. D) `&str` (*)
19. Explanation: `&str` accepts string literals, `&String`, and any `&str`; `&String` only accepts a borrowed `String`.
20. Q3: What is the lifetime of a string literal `"hi"`?
21. A) 'static (*)
22. B) The enclosing function
23. C) The enclosing block
24. D) The enclosing module
25. Explanation: String literals are stored in the binary and have the `'static` lifetime — they live for the entire program.
26. Q4: What does `&s[1..3]` do for `s = "héllo"` (é is two bytes)?
27. A) Returns "él"
28. B) Panics — byte 1 is not a char boundary (*)
29. C) Returns "hé"
30. D) Returns "h"
31. Explanation: String slicing by byte range panics if a boundary falls inside a multi-byte char; use `.char_indices()`.
32. Q5: What does `.to_string()` do?
33. A) Returns a `&str`
34. B) Mutates in place
35. C) Allocates a new owned `String` (*)
36. D) Casts to `&'static str`
37. Explanation: `.to_string()` (via `ToString`/`Display`) allocates and returns an owned `String`.
38. Q6: Which conversion is automatic via deref coercion?
39. A) `&str` to `&String`
40. B) `String` to `&'static str`
41. C) `&str` to `&[u8]`
42. D) `&String` to `&str` (*)
43. Explanation: `String` derefs to `str`, so `&String` coerces to `&str` automatically.
44. Q7: What's the type of `b"hi"`?
45. A) `&[u8; 2]` (*)
46. B) `&str`
47. C) `&String`
48. D) `[char; 2]`
49. Explanation: `b"..."` is a byte string literal of type `&[u8; N]`.
50. Q8: Which method splits a `&str` into borrowed `&str` slices without allocating?
51. A) `.to_string()`
52. B) `.split_whitespace()` (*)
53. C) `.chars().collect::<String>()`
54. D) `.to_owned()`
55. Explanation: `.split_whitespace()` returns an iterator of `&str` slices borrowed from the original.
56. Q9: How do you grow a `String`?
57. A) `.push_str()` on a `&str`
58. B) `.extend()` on `&str`
59. C) `.push_str()` on a `String` (*)
60. D) You can't; build a new one each time
61. Explanation: `String` has `.push_str(&str)`, `.push(char)`, `+`, `+=`, and `format!` for growth.
62. Q10: What is `&[T]`?
63. A) An owned array
64. B) A `Vec<T>` reference
65. C) A type-erased iterator
66. D) A borrowed slice (fat pointer: start + length) (*)
67. Explanation: `&[T]` is a slice — a fat pointer borrowing a contiguous run of `T` from an owner (array, Vec, etc.).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is `&str`?
  options:
    - An owned growable UTF-8 buffer
    - A list of chars
    - A borrowed view of UTF-8 bytes
    - A wide pointer to bytes
  correctIndex: 2
  explanation: "`&str` is a fat pointer (start + length) borrowing UTF-8 bytes; `String` is the owned, growable form."
- id: q2
  question: Which is more general as a function parameter?
  options:
    - "`&String`"
    - "`String`"
    - "`&'static str`"
    - "`&str`"
  correctIndex: 3
  explanation: "`&str` accepts string literals, `&String`, and any `&str`; `&String` only accepts a borrowed `String`."
- id: q3
  question: What is the lifetime of a string literal `"hi"`?
  options:
    - "'static"
    - The enclosing function
    - The enclosing block
    - The enclosing module
  correctIndex: 0
  explanation: String literals are stored in the binary and have the `'static` lifetime — they live for the entire program.
- id: q4
  question: What does `&s[1..3]` do for `s = "héllo"` (é is two bytes)?
  options:
    - Returns "él"
    - Panics — byte 1 is not a char boundary
    - Returns "hé"
    - Returns "h"
  correctIndex: 1
  explanation: String slicing by byte range panics if a boundary falls inside a multi-byte char; use `.char_indices()`.
- id: q5
  question: What does `.to_string()` do?
  options:
    - Returns a `&str`
    - Mutates in place
    - Allocates a new owned `String`
    - Casts to `&'static str`
  correctIndex: 2
  explanation: "`.to_string()` (via `ToString`/`Display`) allocates and returns an owned `String`."
- id: q6
  question: Which conversion is automatic via deref coercion?
  options:
    - "`&str` to `&String`"
    - "`String` to `&'static str`"
    - "`&str` to `&[u8]`"
    - "`&String` to `&str`"
  correctIndex: 3
  explanation: "`String` derefs to `str`, so `&String` coerces to `&str` automatically."
- id: q7
  question: What's the type of `b"hi"`?
  options:
    - "`&[u8; 2]`"
    - "`&str`"
    - "`&String`"
    - "`[char; 2]`"
  correctIndex: 0
  explanation: '`b"..."` is a byte string literal of type `&[u8; N]`.'
- id: q8
  question: Which method splits a `&str` into borrowed `&str` slices without allocating?
  options:
    - "`.to_string()`"
    - "`.split_whitespace()`"
    - "`.chars().collect::<String>()`"
    - "`.to_owned()`"
  correctIndex: 1
  explanation: "`.split_whitespace()` returns an iterator of `&str` slices borrowed from the original."
- id: q9
  question: How do you grow a `String`?
  options:
    - "`.push_str()` on a `&str`"
    - "`.extend()` on `&str`"
    - "`.push_str()` on a `String`"
    - You can't; build a new one each time
  correctIndex: 2
  explanation: "`String` has `.push_str(&str)`, `.push(char)`, `+`, `+=`, and `format!` for growth."
- id: q10
  question: What is `&[T]`?
  options:
    - An owned array
    - A `Vec<T>` reference
    - A type-erased iterator
    - "A borrowed slice (fat pointer: start + length)"
  correctIndex: 3
  explanation: "`&[T]` is a slice — a fat pointer borrowing a contiguous run of `T` from an owner (array, Vec, etc.)."
```

