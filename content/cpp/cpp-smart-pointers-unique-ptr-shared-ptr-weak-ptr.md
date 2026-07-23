---
slug: cpp-smart-pointers-unique-ptr-shared-ptr-weak-ptr
id: cpp-12
track: cpp
order: 12
title: Smart Pointers — unique_ptr, shared_ptr, weak_ptr
description: Replace raw new/delete with std::unique_ptr, std::shared_ptr, and std::weak_ptr — the RAII types that make C++ memory management safe by default.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=550s
whyItMatters: Replace raw new/delete with std::unique_ptr, std::shared_ptr, and std::weak_ptr — the RAII types that make C++ memory management safe by default.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# Smart Pointers — unique_ptr, shared_ptr, weak_ptr

## Smart Pointers — unique_ptr, shared_ptr, weak_ptr

### Why It Matters

Replace raw new/delete with std::unique_ptr, std::shared_ptr, and std::weak_ptr — the RAII types that make C++ memory management safe by default.

Replace raw new/delete with std::unique_ptr, std::shared_ptr, and std::weak_ptr — the RAII types that make C++ memory management safe by default.

### Prerequisites

- Stage 1-11 (especially move semantics and Rule of 5)

### Topics

- std::unique_ptr — exclusive ownership
- std::make_unique (C++14) — safer than direct new
- std::shared_ptr — shared reference-counted ownership
- std::make_shared — single allocation for control block + object
- std::weak_ptr — non-owning observer, breaks cycles
- Custom deleters
- std::enable_shared_from_this
- shared_ptr control blocks and atomic refcount cost
- Cycles: how to detect and break with weak_ptr
- Smart pointers and the Rule of 0

### Key Concepts

- unique_ptr has zero overhead vs raw pointer — use it by default for exclusive ownership.
- shared_ptr's refcount is atomic — thread-safe for the refcount but NOT for the pointed-to object's mutations.
- make_shared allocates control block + object in one heap allocation; direct `shared_ptr(new T)` does two.
- A shared_ptr cycle (A holds shared_ptr to B, B holds shared_ptr to A) leaks both; break with weak_ptr.
- weak_ptr::lock() atomically returns a shared_ptr (or null) — safe observation across threads.
- enable_shared_from_this lets a member function obtain a shared_ptr to *this safely.
- Custom deleters allow unique_ptr to manage FILE*, sockets, Windows HANDLEs, etc.

```cpp
#include <memory>
#include <iostream>

class Widget {
public:
    Widget()  { std::cout << "ctor\n"; }
    ~Widget() { std::cout << "dtor\n"; }
};

int main() {
    {
        auto w = std::make_unique<Widget>();   // ctor
    }                                          // dtor — automatic cleanup
    // std::unique_ptr<Widget> bad = new Widget; // ERROR: must be direct-init
    std::unique_ptr<Widget> p(new Widget);     // OK but make_unique preferred
}
```
Caption: unique_ptr — exclusive ownership

### Common Pitfalls

- shared_ptr cycles — A holds shared_ptr<B>, B holds shared_ptr<A>; both refcounts never reach 0; break cycles with weak_ptr.
- Using shared_ptr when unique_ptr suffices — shared_ptr's atomic refcount has real cost; use unique_ptr unless you genuinely need shared ownership.
- Calling shared_from_this() on a non-shared object — UB (or std::bad_weak_ptr); the object must already be managed by a shared_ptr.
- Two shared_ptrs each with their own control block for the same raw pointer — `shared_ptr<T> a(new T); shared_ptr<T> b(a.get());` double-frees; always copy from an existing shared_ptr.
- Thread-safety misconception — the refcount is atomic, but the object's mutations are NOT synchronized; you still need a mutex (or atomics) for concurrent writes.

### Real-World Applications

- WebKit's rendering tree uses smart pointers for tree node ownership; cycles are broken with weak pointers.
- Chromium's content layer uses scoped_refptr (a custom smart pointer similar to shared_ptr) for ref-counted cross-process objects.
- Unreal Engine's TSharedPtr and TWeakObjectPtr mirror std::shared_ptr / std::weak_ptr with engine-specific allocator support.
- LLVM uses std::unique_ptr extensively for AST node ownership; pass-by-unique_ptr expresses transfer of ownership.

### Interview Questions

- 1. What's the difference between unique_ptr and shared_ptr? — unique_ptr is exclusive (zero overhead); shared_ptr is shared (atomic refcount); prefer unique_ptr unless you need shared ownership.
- 2. Why prefer make_shared over shared_ptr(new T)? — make_shared does one heap allocation (control block + object) vs two; it's also exception-safe in expressions like `f(shared_ptr<T>(new T), g())` where g() can throw.
- 3. How do you break a shared_ptr cycle? — Replace one of the shared_ptrs with a weak_ptr; weak_ptr doesn't increment the strong refcount, so objects can be reclaimed.
- 4. What is enable_shared_from_this for? — It lets a member function safely obtain a shared_ptr to *this, used for capturing self in async callbacks.
- 5. Is shared_ptr's object access thread-safe? — No. The refcount is atomic, but mutating the pointed-to object requires external synchronization; only the control block operations are thread-safe.

### Mini Project

Build a DAG Task Scheduler: A scheduler where tasks hold weak_ptrs to their dependencies to avoid cycles, and a shared_ptr owns each task. Suggested approach:
  - Class Task with run() method and std::vector<std::weak_ptr<Task>> deps
  - Scheduler holds std::vector<std::shared_ptr<Task>> tasks
  - Before running a task, check all deps via weak_ptr::lock(); skip if any expired
  - Topologically order tasks; run on a single thread first (Stage 14 adds threads)
  - Verify with a test that creating an actual cycle is caught (tasks never become runnable)

### Exercises

1. Build a doubly-linked list with shared_ptr next and weak_ptr prev; verify no leak under valgrind.
2. Use a custom deleter to wrap FILE* in a unique_ptr; verify the file is closed on scope exit.
3. Demonstrate the double-control-block bug: `shared_ptr<T> a(new T); shared_ptr<T> b(a.get());` — observe the double-free under ASan.
4. Use enable_shared_from_this in a class that schedules an async callback capturing self; verify the object stays alive.
5. Benchmark shared_ptr copy (atomic refcount inc) vs unique_ptr copy (won't compile — explain why) vs raw pointer copy.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the overhead of std::unique_ptr vs a raw pointer?
9. A) 2x memory
10. B) Slower access
11. C) Refcount atomic cost
12. D) Zero overhead by default (*)
13. Explanation: unique_ptr has zero space/time overhead vs a raw pointer (no control block, no refcount); custom deleters may add a small per-object cost.
14. Q2: Why prefer std::make_shared over `shared_ptr<T>(new T)`?
15. A) One allocation instead of two, plus exception safety (*)
16. B) It is faster
17. C) It is required by the standard
18. D) It avoids the destructor
19. Explanation: make_shared allocates control block + object together; it also avoids the leak risk in `f(shared_ptr<T>(new T), g())` if g() throws.
20. Q3: What does std::weak_ptr prevent?
21. A) Memory leaks
22. B) shared_ptr cycles and leaks (*)
23. C) Iterator invalidation
24. D) Exception leaks
25. Explanation: weak_ptr doesn't increment the strong refcount, so it doesn't keep the object alive; using it on one side of a cycle lets the objects be reclaimed.
26. Q4: What does enable_shared_from_this provide?
27. A) A virtual destructor
28. B) A custom deleter
29. C) A safe way to get a shared_ptr to *this inside a member function (*)
30. D) Atomic refcount
31. Explanation: enable_shared_from_this::shared_from_this() returns a shared_ptr to *this, but only if the object is already managed by a shared_ptr; otherwise UB (or throws bad_weak_ptr).
32. Q5: Is shared_ptr's pointed-to object access thread-safe?
33. A) Yes, fully
34. B) No part is
35. C) Only on Windows
36. D) Only the refcount operations are; object access needs external sync (*)
37. Explanation: The control block (refcount) operations are atomic; mutating the object through the pointer requires a mutex or atomics, just like any shared data.
38. Q6: What happens if you call shared_from_this() on a stack-allocated object?
39. A) UB or throws std::bad_weak_ptr — the object must already be in a shared_ptr (*)
40. B) Returns nullptr
41. C) Returns a valid shared_ptr
42. D) Compile error
43. Explanation: shared_from_this relies on the control block created when the object was placed in a shared_ptr; without one, behavior is undefined (or throws bad_weak_ptr).
44. Q7: What is the result of `shared_ptr<T> a(new T); shared_ptr<T> b(a.get());`?
45. A) Two independent shared_ptrs — OK
46. B) Double-free — two control blocks for the same pointer (*)
47. C) Compile error
48. D) A is set to nullptr
49. Explanation: Each shared_ptr constructor with new creates its own control block; b.get() == a.get() but they have separate refcounts, so both will delete the pointer.
50. Q8: What does unique_ptr with a custom deleter allow?
51. A) Faster access
52. B) Shared ownership
53. C) Managing non-memory resources like FILE*, sockets, HANDLEs (*)
54. D) Thread safety
55. Explanation: The custom deleter runs in the destructor, so unique_ptr can wrap any resource (FILE*, socket, Windows HANDLE) and clean it up automatically.
56. Q9: Why does shared_ptr cost more than unique_ptr?
57. A) It uses a virtual destructor
58. B) It always uses the heap
59. C) It requires mutexes
60. D) Atomic refcount operations and a control block allocation (*)
61. Explanation: shared_ptr maintains an atomic refcount in a control block; inc/dec operations are atomic, which has measurable cost vs unique_ptr's no-overhead design.
62. Q10: What is the Rule of 0 with smart pointers?
63. A) Use smart pointers/containers as members so you write zero special members (*)
64. B) Never use smart pointers
65. C) Always use exactly zero smart pointers
66. D) Use exactly zero members
67. Explanation: When class members are smart pointers/containers, the compiler-generated copy/move/dtor are correct; you write none yourself (the Rule of 0).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the overhead of std::unique_ptr vs a raw pointer?
  options:
    - 2x memory
    - Slower access
    - Refcount atomic cost
    - Zero overhead by default
  correctIndex: 3
  explanation: unique_ptr has zero space/time overhead vs a raw pointer (no control block, no refcount); custom deleters may add a small per-object cost.
- id: q2
  question: Why prefer std::make_shared over `shared_ptr<T>(new T)`?
  options:
    - "`?"
    - One allocation instead of two, plus exception safety
    - It is faster
    - It is required by the standard
    - It avoids the destructor
    - ", g())` if g() throws."
  correctIndex: 1
  explanation: make_shared allocates control block + object together; it also avoids the leak risk in `f(shared_ptr<T>(new T), g())` if g() throws.
- id: q3
  question: What does std::weak_ptr prevent?
  options:
    - Memory leaks
    - shared_ptr cycles and leaks
    - Iterator invalidation
    - Exception leaks
  correctIndex: 1
  explanation: weak_ptr doesn't increment the strong refcount, so it doesn't keep the object alive; using it on one side of a cycle lets the objects be reclaimed.
- id: q4
  question: What does enable_shared_from_this provide?
  options:
    - A virtual destructor
    - A custom deleter
    - A safe way to get a shared_ptr to *this inside a member function
    - Atomic refcount
  correctIndex: 2
  explanation: enable_shared_from_this::shared_from_this() returns a shared_ptr to *this, but only if the object is already managed by a shared_ptr; otherwise UB (or throws bad_weak_ptr).
- id: q5
  question: Is shared_ptr's pointed-to object access thread-safe?
  options:
    - Yes, fully
    - No part is
    - Only on Windows
    - Only the refcount operations are; object access needs external sync
  correctIndex: 3
  explanation: The control block (refcount) operations are atomic; mutating the object through the pointer requires a mutex or atomics, just like any shared data.
- id: q6
  question: What happens if you call shared_from_this() on a stack-allocated object?
  options:
    - UB or throws std::bad_weak_ptr — the object must already be in a shared_ptr
    - Returns nullptr
    - Returns a valid shared_ptr
    - Compile error
  correctIndex: 0
  explanation: shared_from_this relies on the control block created when the object was placed in a shared_ptr; without one, behavior is undefined (or throws bad_weak_ptr).
- id: q7
  question: What is the result of `shared_ptr<T> a(new T); shared_ptr<T> b(a.get());`?
  options:
    - ; shared_ptr<T> b(a.get());`?
    - Two independent shared_ptrs — OK
    - Double-free — two control blocks for the same pointer
    - Compile error
    - A is set to nullptr
  correctIndex: 2
  explanation: Each shared_ptr constructor with new creates its own control block; b.get() == a.get() but they have separate refcounts, so both will delete the pointer.
- id: q8
  question: What does unique_ptr with a custom deleter allow?
  options:
    - Faster access
    - Shared ownership
    - Managing non-memory resources like FILE*, sockets, HANDLEs
    - Thread safety
    - and clean it up automatically.
  correctIndex: 2
  explanation: The custom deleter runs in the destructor, so unique_ptr can wrap any resource (FILE*, socket, Windows HANDLE) and clean it up automatically.
- id: q9
  question: Why does shared_ptr cost more than unique_ptr?
  options:
    - It uses a virtual destructor
    - It always uses the heap
    - It requires mutexes
    - Atomic refcount operations and a control block allocation
  correctIndex: 3
  explanation: shared_ptr maintains an atomic refcount in a control block; inc/dec operations are atomic, which has measurable cost vs unique_ptr's no-overhead design.
- id: q10
  question: What is the Rule of 0 with smart pointers?
  options:
    - Use smart pointers/containers as members so you write zero special members
    - Never use smart pointers
    - Always use exactly zero smart pointers
    - Use exactly zero members
  correctIndex: 0
  explanation: When class members are smart pointers/containers, the compiler-generated copy/move/dtor are correct; you write none yourself (the Rule of 0).
```

