---
slug: rust-smart-pointers-box-rc-arc-refcell
id: rust-16
track: rust
order: 16
title: Smart Pointers — Box, Rc, Arc, RefCell
description: Use `Box<T>` for heap allocation, `Rc<T>` and `Arc<T>` for shared ownership, and `RefCell<T>`/`Mutex<T>` for interior mutability.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ygL_xcavzQ4&t=6000s
whyItMatters: Use `Box<T>` for heap allocation, `Rc<T>` and `Arc<T>` for shared ownership, and `RefCell<T>`/`Mutex<T>` for interior mutability.
deepDiveResources:
  - label: W3Schools Rust
    url: https://www.rust-lang.org/learn
    kind: course
  - label: Rust Official Docs
    url: https://doc.rust-lang.org/book/
    kind: doc
---

# Smart Pointers — Box, Rc, Arc, RefCell

## Smart Pointers — Box, Rc, Arc, RefCell

### Why It Matters

Use `Box<T>` for heap allocation, `Rc<T>` and `Arc<T>` for shared ownership, and `RefCell<T>`/`Mutex<T>` for interior mutability.

Use `Box<T>` for heap allocation, `Rc<T>` and `Arc<T>` for shared ownership, and `RefCell<T>`/`Mutex<T>` for interior mutability.

### Prerequisites

- Stage 15: Closures and Iterators
- Stage 5: Ownership — The Fundamental Rule
- Stage 13: Generics and Traits

### Topics

- `Box<T>`: heap allocation, recursive types, trait objects
- `Rc<T>`: single-threaded reference counting
- `Arc<T>`: atomic reference counting (thread-safe)
- `RefCell<T>`: interior mutability with runtime borrow checks
- `Mutex<T>` and `RwLock<T>`: thread-safe interior mutability (preview; full in Stage 17)
- `Rc<RefCell<T>>` and `Arc<Mutex<T>>` combinations
- `Cell<T>` for Copy types
- `Deref` and `Drop` traits that power smart pointers
- Reference cycles and `Weak<T>` to break them

### Key Concepts

- `Box<T>` moves a value to the heap; the box itself is on the stack and owns the heap value.
- `Rc<T>` counts references; when the count hits zero, the value is dropped. Not thread-safe.
- `Arc<T>` is `Rc` with atomic counters; safe to share across threads.
- `RefCell<T>` moves borrow checks to runtime: `borrow()` and `borrow_mut()` panic on conflicts.
- `Rc<RefCell<T>>` is the "single-threaded shared mutable" pattern; `Arc<Mutex<T>>` is its multi-threaded counterpart.

```rust
enum List {
    Cons(i32, Box<List>),
    Nil,
}

fn main() {
    let list = List::Cons(1, Box::new(List::Cons(2, Box::new(List::Nil))));
    // Without Box, List would have infinite size.
}
```
Caption: Box for recursive type

### Common Pitfalls

- Creating `Rc` cycles — `Rc<Node>` pointing to itself never drops; use `Weak<T>` to break cycles.
- `RefCell` panicking at runtime — `borrow_mut()` while a `borrow()` is live panics; the borrow checker can't help here.
- Using `Rc` across threads — `Rc` is `!Send`; use `Arc` for shared ownership across threads.
- Forgetting that `Mutex::lock()` returns a `Result` (poisoned mutex) — unwrap-or-handle the poison.
- Treating `Arc<Mutex<T>>` as cheap — every clone is an atomic op and every lock is a syscall-ish; prefer message passing where possible.

### Real-World Applications

- `tokio::spawn` returns a `JoinHandle` and accepts `Future + Send + 'static`; `Arc` is used pervasively to share state between tasks.
- The `grep` crate uses `Box<dyn Matcher>` for trait-object dispatch over different regex engines.
- Servo's DOM uses `Rc<RefCell<Node>>` for the browser DOM tree (single-threaded subtrees, multi-threaded layout).
- `serde` uses `Box<dyn Error>` for type-erased error storage in `Result` returns.

### Interview Questions

- 1. When do you use `Box<T>`? — Heap allocation for large values, recursive types (where size is infinite without indirection), and trait objects (`Box<dyn Trait>`).
- 2. Difference between `Rc` and `Arc`? — `Rc` is non-atomic single-threaded reference counting; `Arc` uses atomic counters and is `Send + Sync`.
- 3. What is interior mutability? — A pattern where you mutate through a shared reference via `RefCell`/`Mutex`/`Cell`, moving borrow checks to runtime.
- 4. Why does `RefCell` panic? — `borrow_mut()` while a `borrow()` is active violates the "one mutable OR many shared" rule at runtime.
- 5. How do you break an `Rc` cycle? — Use `Weak<T>` for back-references; weak refs don't increment the strong count.

### Mini Project

Build a DAG with Rc<RefCell<T>>: A small directed acyclic graph where each node has a list of children, supporting shared children between parents. Suggested approach:
  - Define `struct Node { name: String, children: Vec<Rc<RefCell<Node>>> }`
  - Add `add_child(&self, child: Rc<RefCell<Node>>)`
  - Build a graph where two parents share one child
  - Print strong counts to verify sharing
  - Add `Weak` back-references to parents to avoid cycles

### Exercises

1. Build a recursive `List` enum with `Box<List>`.
2. Share a `String` between three owners using `Rc`; print `Rc::strong_count`.
3. Use `RefCell<Vec<i32>>` to mutate from multiple places; trigger a panic by holding two `borrow_mut`s.
4. Use `Weak<T>` to break a cycle and observe that strong_count drops to zero.
5. Convert an `Rc<RefCell<T>>` to `Arc<Mutex<T>>` to share across threads.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `Box<T>` do?
9. A) Borrows T
10. B) Reference-counts T
11. C) Locks T
12. D) Moves T to the heap, with stack-sized ownership (*)
13. Explanation: `Box<T>` heap-allocates; the box on the stack owns the heap value. Used for recursive types and trait objects.
14. Q2: Which is the thread-safe reference-counting pointer?
15. A) Arc (*)
16. B) Rc
17. C) Box
18. D) Cell
19. Explanation: `Arc<T>` uses atomic counters and is `Send + Sync`; `Rc<T>` is single-threaded and `!Send`.
20. Q3: What does `RefCell<T>` provide?
21. A) Compile-time borrow checks
22. B) Runtime-checked interior mutability (*)
23. C) Atomic locking
24. D) Zero-cost clones
25. Explanation: `RefCell` moves borrow checks to runtime; `borrow_mut()` panics if a borrow is already live.
26. Q4: What happens with `let m = cell.borrow_mut(); let r = cell.borrow();`?
27. A) Compile error
28. B) Returns None
29. C) Runtime panic (*)
30. D) Deadlock
31. Explanation: `RefCell::borrow` after `borrow_mut` panics because the rule "one mutable OR many shared" is checked at runtime.
32. Q5: How do you break an `Rc` cycle?
33. A) Drop the value
34. B) Use `Arc` instead
35. C) Use `Box`
36. D) Use `Weak<T>` for back-references (*)
37. Explanation: `Weak<T>` doesn't increment the strong count, so cycles don't prevent drops; `upgrade()` returns `Option<Rc<T>>`.
38. Q6: Which combination is the multi-threaded "shared mutable" pattern?
39. A) Arc<Mutex<T>> (*)
40. B) Rc<RefCell<T>>
41. C) Box<RefCell<T>>
42. D) Rc<Mutex<T>>
43. Explanation: `Arc<Mutex<T>>` is the canonical thread-safe shared mutable state; `Rc<RefCell<T>>` is its single-threaded counterpart.
44. Q7: What trait powers the auto-deref behavior of `Box`, `Rc`, `Arc`?
45. A) Drop
46. B) Deref (*)
47. C) AsRef
48. D) Borrow
49. Explanation: `Deref` lets `Box<T>`, `Rc<T>`, `Arc<T>` etc. auto-deref to `&T`, enabling method calls on the inner value.
50. Q8: Why is `Rc` not `Send`?
51. A) It owns its data
52. B) It's too slow
53. C) It uses non-atomic counters that would race across threads (*)
54. D) It implements Drop
55. Explanation: `Rc`'s counter increments are non-atomic; concurrent updates would corrupt the count. `Arc` uses atomics.
56. Q9: What does `Mutex::lock()` return?
57. A) The inner T directly
58. B) An Option
59. C) A reference
60. D) A `Result<MutexGuard, PoisonError<MutexGuard>>` (*)
61. Explanation: `lock()` returns a `Result` because a previously-panicked thread "poisons" the mutex; the guard releases on drop.
62. Q10: What is `Cell<T>` used for?
63. A) Interior mutability for `Copy` types via `get`/`set` (*)
64. B) Heap allocation
65. C) Atomic locking
66. D) Trait objects
67. Explanation: `Cell<T>` provides interior mutability for `Copy` types by copying in and out, with no borrow tracking.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `Box<T>` do?
  options:
    - Borrows T
    - Reference-counts T
    - Locks T
    - Moves T to the heap, with stack-sized ownership
  correctIndex: 3
  explanation: "`Box<T>` heap-allocates; the box on the stack owns the heap value. Used for recursive types and trait objects."
- id: q2
  question: Which is the thread-safe reference-counting pointer?
  options:
    - Arc
    - Rc
    - Box
    - Cell
  correctIndex: 0
  explanation: "`Arc<T>` uses atomic counters and is `Send + Sync`; `Rc<T>` is single-threaded and `!Send`."
- id: q3
  question: What does `RefCell<T>` provide?
  options:
    - Compile-time borrow checks
    - Runtime-checked interior mutability
    - Atomic locking
    - Zero-cost clones
  correctIndex: 1
  explanation: "`RefCell` moves borrow checks to runtime; `borrow_mut()` panics if a borrow is already live."
- id: q4
  question: What happens with `let m = cell.borrow_mut(); let r = cell.borrow();`?
  options:
    - Compile error
    - Returns None
    - Runtime panic
    - Deadlock
  correctIndex: 2
  explanation: '`RefCell::borrow` after `borrow_mut` panics because the rule "one mutable OR many shared" is checked at runtime.'
- id: q5
  question: How do you break an `Rc` cycle?
  options:
    - Drop the value
    - Use `Arc` instead
    - Use `Box`
    - Use `Weak<T>` for back-references
  correctIndex: 3
  explanation: "`Weak<T>` doesn't increment the strong count, so cycles don't prevent drops; `upgrade()` returns `Option<Rc<T>>`."
- id: q6
  question: Which combination is the multi-threaded "shared mutable" pattern?
  options:
    - Arc<Mutex<T>>
    - Rc<RefCell<T>>
    - Box<RefCell<T>>
    - Rc<Mutex<T>>
  correctIndex: 0
  explanation: "`Arc<Mutex<T>>` is the canonical thread-safe shared mutable state; `Rc<RefCell<T>>` is its single-threaded counterpart."
- id: q7
  question: What trait powers the auto-deref behavior of `Box`, `Rc`, `Arc`?
  options:
    - Drop
    - Deref
    - AsRef
    - Borrow
  correctIndex: 1
  explanation: "`Deref` lets `Box<T>`, `Rc<T>`, `Arc<T>` etc. auto-deref to `&T`, enabling method calls on the inner value."
- id: q8
  question: Why is `Rc` not `Send`?
  options:
    - It owns its data
    - It's too slow
    - It uses non-atomic counters that would race across threads
    - It implements Drop
  correctIndex: 2
  explanation: "`Rc`'s counter increments are non-atomic; concurrent updates would corrupt the count. `Arc` uses atomics."
- id: q9
  question: What does `Mutex::lock()` return?
  options:
    - The inner T directly
    - An Option
    - A reference
    - A `Result<MutexGuard, PoisonError<MutexGuard>>`
  correctIndex: 3
  explanation: '`lock()` returns a `Result` because a previously-panicked thread "poisons" the mutex; the guard releases on drop.'
- id: q10
  question: What is `Cell<T>` used for?
  options:
    - Interior mutability for `Copy` types via `get`/`set`
    - Heap allocation
    - Atomic locking
    - Trait objects
  correctIndex: 0
  explanation: "`Cell<T>` provides interior mutability for `Copy` types by copying in and out, with no borrow tracking."
```

