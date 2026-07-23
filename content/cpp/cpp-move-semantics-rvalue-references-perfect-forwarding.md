---
slug: cpp-move-semantics-rvalue-references-perfect-forwarding
id: cpp-11
track: cpp
order: 11
title: Move Semantics, rvalue references, perfect forwarding
description: Learn rvalue references, std::move and std::forward, move constructors and assignment, RVO/NRVO, and how perfect forwarding enables generic factory functions.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=500s
whyItMatters: Learn rvalue references, std::move and std::forward, move constructors and assignment, RVO/NRVO, and how perfect forwarding enables generic factory functions.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# Move Semantics, rvalue references, perfect forwarding

## Move Semantics, rvalue references, perfect forwarding

### Why It Matters

Learn rvalue references, std::move and std::forward, move constructors and assignment, RVO/NRVO, and how perfect forwarding enables generic factory functions.

Learn rvalue references, std::move and std::forward, move constructors and assignment, RVO/NRVO, and how perfect forwarding enables generic factory functions.

### Prerequisites

- Stage 1-10 (especially classes, Rule of 5, STL containers)

### Topics

- lvalue vs rvalue vs xvalue vs prvalue (value categories)
- rvalue references (T&&) and what they bind to
- std::move — a cast, not a move
- std::forward and forwarding references (T&& in deduced context)
- Move constructor and move assignment
- noexcept move and the standard library's strong exception guarantee
- Return Value Optimization (RVO) and Named RVO (NRVO)
- Perfect forwarding and std::make_unique / std::make_shared
- Pessimization: std::move on a return that would have RVO'd
- Reference collapsing rules

### Key Concepts

- An rvalue reference (T&&) extends a temporary's lifetime or identifies a "movable" object; `T&&` in template argument deduction is a "forwarding reference" that collapses to either T& or T&&.
- std::move is just a cast to T&& — it does no moving itself; the move happens via the move constructor/assignment.
- std::forward<T> casts a forwarding reference back to its original value category, enabling perfect forwarding.
- RVO/NRVO can elide copies entirely; `return std::move(local)` often DISables NRVO and forces a move — a classic pessimization.
- noexcept move operations matter: vector reallocation uses move only if the move ctor is noexcept; otherwise it copies to preserve the strong exception guarantee.
- Reference collapsing: T& & -> T&; T& && -> T&; T&& & -> T&; T&& && -> T&&.

```cpp
#include <utility>
#include <cstring>
#include <algorithm>

class Buffer {
public:
    Buffer(size_t n) : data_(new char[n]), size_(n) {}
    ~Buffer() { delete[] data_; }

    Buffer(const Buffer& o) : data_(new char[o.size_]), size_(o.size_) {
        std::memcpy(data_, o.data_, size_);
    }
    Buffer& operator=(const Buffer& o) { Buffer tmp(o); swap(tmp); return *this; }

    Buffer(Buffer&& o) noexcept                 // MOVE ctor
        : data_(o.data_), size_(o.size_) {
        o.data_ = nullptr; o.size_ = 0;
    }
    Buffer& operator=(Buffer&& o) noexcept { swap(o); return *this; }

    void swap(Buffer& o) noexcept {
        std::swap(data_, o.data_); std::swap(size_, o.size_);
    }
private:
    char*  data_; size_t size_;
};
```
Caption: Move constructor

### Common Pitfalls

- `return std::move(local);` — disables NRVO and forces a move; return by plain `return local;` for free RVO/NRVO.
- std::move on a const object — `std::move(const T&)` produces `const T&&`, which can't bind to `T&&` and falls back to copy; check that your types are non-const before moving.
- Using a moved-from object — the standard leaves it "valid but unspecified"; you may assign or destroy it, but reading is risky.
- Non-noexcept move in std::vector — vector growth copies (not moves) when the move ctor isn't noexcept, to preserve the strong exception guarantee; mark moves noexcept.
- Confusing forwarding references with rvalue references — `void f(T&&)` in a template is a forwarding reference; `void f(std::string&&)` is an rvalue reference. The rules differ.

### Real-World Applications

- Facebook's folly library uses move semantics extensively to avoid string copies in HTTP request handling.
- Bloomberg's BDE marks all moving operations noexcept to enable optimal container behavior.
- Unreal Engine's FString move operations are critical for game-tick performance; the engine audits for missing noexcept.
- LLVM's SmallVector move operations are noexcept to enable cheap relocation of inline buffers.

### Interview Questions

- 1. What is std::move? — A cast to an rvalue reference (T&&); it does no work itself but enables move constructors and assignment to take over resources.
- 2. What is the difference between `T&&` as a forwarding reference vs rvalue reference? — In a deduced context (`template<typename T> void f(T&&)`), T&& is a forwarding reference that binds to either; outside deduction, `T&&` is an rvalue reference and binds only to rvalues.
- 3. What is perfect forwarding? — Using std::forward<T> to preserve the value category of an argument through a template function, so an lvalue stays an lvalue and an rvalue stays an rvalue.
- 4. Why does `return std::move(local);` hurt? — It disables NRVO (named return value optimization) and forces a move; plain `return local;` lets the compiler elide the copy entirely.
- 5. Why does vector growth copy when move isn't noexcept? — To preserve the strong exception guarantee: a throwing move mid-reallocation would leave the source modified and the destination partial; copy leaves the source intact.

### Mini Project

Build a String Builder with Move-Sensitive Append: A StringBuilder class that accumulates strings via move-aware append methods, plus a finalize() that returns the assembled string by value. Suggested approach:
  - Use std::vector<std::string> for parts
  - append(const std::string&) — copy
  - append(std::string&&) — move overload
  - append(std::string_view) — view, no copy
  - finalize() returns std::string by value; let NRVO elide the copy
  - Benchmark against std::ostringstream on 10k appends

### Exercises

1. Write a class with a noexcept move ctor and another without; push_back each into a vector with reserve(1) to force reallocation; observe which copies and which moves.
2. Write a function returning std::string by value both with and without `std::move`; benchmark to demonstrate NRVO pessimization.
3. Implement a perfect-forwarding factory `make<T>(args...)` that calls new T(args...); test with lvalue and rvalue args.
4. Demonstrate reference collapsing: declare `template<typename T> void f(T&&)` and call with lvalues and rvalues; use std::is_lvalue_reference to print the deduced T.
5. Move a std::unique_ptr from one variable to another; verify the source is nullptr afterwards.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does std::move do?
9. A) Performs the move
10. B) Deletes the source
11. C) Casts to an rvalue reference; the move ctor does the actual moving (*)
12. D) Calls operator=
13. Explanation: std::move is a cast to T&&; the move constructor or assignment operator performs the actual resource transfer.
14. Q2: What is a forwarding reference?
15. A) Any T&& parameter
16. B) A reference that forwards arguments
17. C) A C++14 feature
18. D) T&& in a deduced context (template<typename T> void f(T&&)) (*)
19. Explanation: T&& in a deduced context is a forwarding reference that binds to lvalues and rvalues; outside deduction, T&& is an rvalue reference.
20. Q3: What does `return std::move(local);` typically do?
21. A) Disables NRVO and forces a move — a pessimization (*)
22. B) Improves performance
23. C) Is required for correctness
24. D) Throws an exception
25. Explanation: Plain `return local;` enables NRVO which elides the copy entirely; `return std::move(local)` blocks NRVO and forces a move.
26. Q4: Why does vector growth copy when the move ctor is not noexcept?
27. A) Moves are slower
28. B) To preserve the strong exception guarantee (*)
29. C) The standard forbids non-noexcept moves
30. D) Vectors always copy
31. Explanation: A throwing move mid-reallocation would leave the source modified and destination partial; copy leaves the source intact, preserving the strong exception guarantee.
32. Q5: What does std::forward do?
33. A) Moves its argument
34. B) Copies its argument
35. C) Casts a forwarding reference to its original value category (*)
36. D) Deletes its argument
37. Explanation: std::forward<T>(x) casts x to T&& if it was an rvalue, or T& if it was an lvalue, preserving the original value category.
38. Q6: What state is a moved-from std::string in?
39. A) Destroyed
40. B) Empty string always
41. C) Null
42. D) Valid but unspecified — you may assign or destroy, but not assume contents (*)
43. Explanation: The standard requires moved-from objects be valid (destructible, assignable) but says nothing about their value; do not read without reassigning.
44. Q7: What is reference collapsing for T& &&?
45. A) T& (*)
46. B) T&&
47. C) T
48. D) Error
49. Explanation: Reference collapsing rules: T& & -> T&, T& && -> T&, T&& & -> T&, T&& && -> T&&. An rvalue ref to an lvalue ref collapses to lvalue ref.
50. Q8: What does `std::move(const T&)` produce?
51. A) T&&
52. B) const T&& — which falls back to copy when binding to T&& (*)
53. C) T&
54. D) Error
55. Explanation: std::move on a const lvalue yields const T&&, which cannot bind to T&& (move ctor); overload resolution falls back to the copy ctor.
56. Q9: What is RVO?
57. A) Reference Value Object
58. B) Recurse Value Option
59. C) Return Value Optimization — elides the copy of a returned temporary (*)
60. D) Random Vector Order
61. Explanation: RVO elides the copy/move of a returned temporary; NRVO extends this to named local variables. C++17 makes RVO mandatory in many cases.
62. Q10: Which is true of perfect forwarding?
63. A) It works without templates
64. B) It always moves
65. C) It always copies
66. D) It uses std::forward to preserve value category through templates (*)
67. Explanation: Perfect forwarding uses forwarding references (T&& in deduced context) plus std::forward<T> to preserve the original value category through a template function.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does std::move do?
  options:
    - Performs the move
    - Deletes the source
    - Casts to an rvalue reference; the move ctor does the actual moving
    - Calls operator=
  correctIndex: 2
  explanation: std::move is a cast to T&&; the move constructor or assignment operator performs the actual resource transfer.
- id: q2
  question: What is a forwarding reference?
  options:
    - Any T&& parameter
    - A reference that forwards arguments
    - A C++14 feature
    - T&& in a deduced context (template<typename T> void f(T&&))
  correctIndex: 3
  explanation: T&& in a deduced context is a forwarding reference that binds to lvalues and rvalues; outside deduction, T&& is an rvalue reference.
- id: q3
  question: What does `return std::move(local);` typically do?
  options:
    - Disables NRVO and forces a move — a pessimization
    - Improves performance
    - Is required for correctness
    - Throws an exception
  correctIndex: 0
  explanation: Plain `return local;` enables NRVO which elides the copy entirely; `return std::move(local)` blocks NRVO and forces a move.
- id: q4
  question: Why does vector growth copy when the move ctor is not noexcept?
  options:
    - Moves are slower
    - To preserve the strong exception guarantee
    - The standard forbids non-noexcept moves
    - Vectors always copy
  correctIndex: 1
  explanation: A throwing move mid-reallocation would leave the source modified and destination partial; copy leaves the source intact, preserving the strong exception guarantee.
- id: q5
  question: What does std::forward do?
  options:
    - Moves its argument
    - Copies its argument
    - Casts a forwarding reference to its original value category
    - Deletes its argument
  correctIndex: 2
  explanation: std::forward<T>(x) casts x to T&& if it was an rvalue, or T& if it was an lvalue, preserving the original value category.
- id: q6
  question: What state is a moved-from std::string in?
  options:
    - Destroyed
    - Empty string always
    - "Null"
    - Valid but unspecified — you may assign or destroy, but not assume contents
  correctIndex: 3
  explanation: The standard requires moved-from objects be valid (destructible, assignable) but says nothing about their value; do not read without reassigning.
- id: q7
  question: What is reference collapsing for T& &&?
  options:
    - T&
    - T&&
    - T
    - Error
  correctIndex: 0
  explanation: "Reference collapsing rules: T& & -> T&, T& && -> T&, T&& & -> T&, T&& && -> T&&. An rvalue ref to an lvalue ref collapses to lvalue ref."
- id: q8
  question: What does `std::move(const T&)` produce?
  options:
    - T&&
    - const T&& — which falls back to copy when binding to T&&
    - T&
    - Error
  correctIndex: 1
  explanation: std::move on a const lvalue yields const T&&, which cannot bind to T&& (move ctor); overload resolution falls back to the copy ctor.
- id: q9
  question: What is RVO?
  options:
    - Reference Value Object
    - Recurse Value Option
    - Return Value Optimization — elides the copy of a returned temporary
    - Random Vector Order
  correctIndex: 2
  explanation: RVO elides the copy/move of a returned temporary; NRVO extends this to named local variables. C++17 makes RVO mandatory in many cases.
- id: q10
  question: Which is true of perfect forwarding?
  options:
    - It works without templates
    - It always moves
    - It always copies
    - It uses std::forward to preserve value category through templates
  correctIndex: 3
  explanation: Perfect forwarding uses forwarding references (T&& in deduced context) plus std::forward<T> to preserve the original value category through a template function.
```

