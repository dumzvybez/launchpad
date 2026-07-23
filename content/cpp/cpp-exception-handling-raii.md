---
slug: cpp-exception-handling-raii
id: cpp-13
track: cpp
order: 13
title: Exception Handling and RAII
description: Master try/throw/catch, exception safety guarantees (basic, strong, no-throw), RAII as the foundation of resource safety, noexcept, and the std::exception hierarchy.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=600s
whyItMatters: Master try/throw/catch, exception safety guarantees (basic, strong, no-throw), RAII as the foundation of resource safety, noexcept, and the std::exception hierarchy.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# Exception Handling and RAII

## Exception Handling and RAII

### Why It Matters

Master try/throw/catch, exception safety guarantees (basic, strong, no-throw), RAII as the foundation of resource safety, noexcept, and the std::exception hierarchy.

Master try/throw/catch, exception safety guarantees (basic, strong, no-throw), RAII as the foundation of resource safety, noexcept, and the std::exception hierarchy.

### Prerequisites

- Stage 1-12 (especially smart pointers)

### Topics

- try / catch / throw
- The std::exception hierarchy (std::runtime_error, std::logic_error, std::bad_alloc, etc.)
- Catch by reference (not by value — slicing)
- RAII — Resource Acquisition Is Initialization
- Exception safety guarantees: basic, strong, no-throw
- noexcept and noexcept(expr)
- Throwing destructors — the cardinal sin
- std::current_exception, std::exception_ptr (re-throwing across threads)
- Custom exception classes
- Exception specifications: throw() (deprecated), noexcept (modern)

### Key Concepts

- RAII: every resource (memory, file, lock, socket) is tied to an object's lifetime; the destructor releases it — the foundation of safe C++.
- Catch by reference (preferably const ref) — catching by value slices derived exceptions and copies.
- The strong exception guarantee: an operation either completes or leaves the state unchanged; implement via copy-and-swap.
- noexcept tells the compiler (and the standard library) that a function will not throw; if it does, std::terminate is called.
- Destructors must not throw — a throw during stack unwinding calls std::terminate; mark destructors noexcept (default in C++11).
- vector growth uses move only if move is noexcept; otherwise it copies — preserving the strong exception guarantee.

```cpp
#include <fstream>
#include <string>
#include <vector>

std::vector<std::string> read_lines(const std::string& path) {
    std::ifstream in(path);            // RAII: opens file
    if (!in) throw std::runtime_error("cannot open " + path);
    std::vector<std::string> lines;
    std::string line;
    while (std::getline(in, line)) lines.push_back(std::move(line));
    return lines;                      // file closed automatically when `in` destructs
}
```
Caption: RAII for files

### Common Pitfalls

- Throwing from a destructor — std::terminate during stack unwinding; wrap risky cleanup in try/catch and log; mark destructors noexcept.
- Catching by value instead of reference — slices derived exceptions to the static (base) type; always `catch (const std::exception& e)`.
- Missing noexcept on move operations — vector growth will copy instead of move, killing performance; mark moves noexcept when safe.
- Relying on exceptions across thread boundaries without explicit handling — exceptions don't propagate; use std::promise/future or std::exception_ptr to marshal them.
- Using exceptions in hot paths for control flow — exceptions are slow when thrown; use std::optional, std::expected (C++23), or error codes for expected failures.

### Real-World Applications

- Google's internal C++ style guide forbids exceptions in much of its codebase (historical); the alternative status-return pattern is used widely in Chrome and Abseil.
- Bloomberg's BDE uses exceptions pervasively for error handling; its component model relies on the strong guarantee via bslma allocators.
- Unreal Engine asserts in destructors and disables exception handling in many build configurations; the engine uses RAII but rarely throws.
- LLVM uses exceptions in the front-end (clang) for diagnostics, but the back-end largely avoids them for performance.

### Interview Questions

- 1. What is RAII? — Resource Acquisition Is Initialization: tie every resource to an object's lifetime so the destructor releases it; smart pointers, lock_guard, fstream are all RAII.
- 2. What are the three exception safety guarantees? — Basic (no leaks, no broken invariants), strong (operation either completes or rolls back), no-throw (never throws; required for destructors).
- 3. Why catch by reference? — Catching by value slices derived exceptions to the static (base) type and copies the object; reference (preferably const) avoids both.
- 4. Why must destructors not throw? — A throw during stack unwinding (already handling another throw) calls std::terminate; wrap risky cleanup in try/catch and log.
- 5. What is noexcept for? — It promises the function will not throw; the compiler can optimize, the standard library can use move (vector growth), and violations call std::terminate.

### Mini Project

Build a Config File Parser with Strong Guarantee: A parser that reads key=value pairs from a file into a std::map, never leaving a partial state on error. Suggested approach:
  - Wrap std::ifstream in RAII
  - Parse line by line; throw std::runtime_error on malformed lines
  - Build into a temporary map; only swap into the output on success (strong guarantee)
  - Define a custom ConfigParseError exception derived from std::runtime_error
  - Add noexcept move ctor/assign so configs can be returned efficiently

### Exercises

1. Write a class whose destructor throws; trigger the throw during stack unwinding and observe std::terminate.
2. Throw a std::runtime_error from a function; catch by value vs by reference; print typeid(e).name() to see the slicing.
3. Write a copy-assign operator using copy-and-swap; throw from the copy ctor and verify *this is unchanged.
4. Mark a move ctor noexcept and another not; push_back into a vector with reserve(1) to force realloc; verify the noexcept one moves and the other copies.
5. Marshal an exception across a thread using std::promise<std::exception_ptr>; rethrow in the main thread.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does RAII stand for?
9. A) Resource Acquisition Is Initialization (*)
10. B) Resource Allocation Is Initialization
11. C) Resource Access Is Initialization
12. D) Random Access Is Initialization
13. Explanation: Resource Acquisition Is Initialization: each resource is acquired in an object's constructor and released in its destructor, making cleanup automatic.
14. Q2: Why should you catch by reference?
15. A) It is faster
16. B) To avoid slicing derived exceptions to the base type (*)
17. C) References are required
18. D) To enable rethrow
19. Explanation: Catching by value slices the exception to the static (base) type and copies it; catching by reference (preferably const) preserves the derived type.
20. Q3: What happens if an exception is thrown from a destructor during stack unwinding?
21. A) The exception is propagated
22. B) The destructor is retried
23. C) std::terminate is called (*)
24. D) The program continues normally
25. Explanation: Throwing during stack unwinding (already in exception handling) calls std::terminate; destructors should be noexcept and wrap risky cleanup in try/catch.
26. Q4: What does noexcept promise?
27. A) The function is fast
28. B) The function is inline
29. C) The function returns void
30. D) The function will not throw; violations call std::terminate (*)
31. Explanation: noexcept tells the compiler and callers the function will not throw; if it does, std::terminate is called. It enables optimizations and lets the STL use move.
32. Q5: Which guarantee does copy-and-swap provide for operator=?
33. A) Strong (operation completes or rolls back) (*)
34. B) Basic
35. C) No-throw
36. D) None
37. Explanation: Copy-and-swap creates a temporary (may throw, leaving *this unchanged) and swaps via a noexcept swap, providing the strong guarantee.
38. Q6: Why does vector growth copy when move is not noexcept?
39. A) For performance
40. B) To preserve the strong exception guarantee (*)
41. C) Because moves are not allowed
42. D) It is a bug in the STL
43. Explanation: A throwing move mid-realization would leave the source modified and destination partial; copy leaves the source intact, preserving the strong guarantee.
44. Q7: Which is the base class of std::runtime_error and std::logic_error?
45. A) std::error
46. B) std::throwable
47. C) std::exception (*)
48. D) std::base
49. Explanation: std::exception is the root; std::runtime_error and std::logic_error derive from it; user exceptions should derive from std::exception or one of its subclasses.
50. Q8: How do you rethrow the current exception preserving its type?
51. A) throw e;
52. B) rethrow;
53. C) throw std::current_exception();
54. D) throw; (*)
55. Explanation: `throw;` rethrows the currently handled exception preserving its original dynamic type; `throw e;` would slice to e's static type.
56. Q9: What is the basic exception guarantee?
57. A) No leaks and no broken invariants — the object is in a valid state (*)
58. B) The operation always succeeds
59. C) The operation rolls back
60. D) The operation never throws
61. Explanation: The basic guarantee: no resource leaks and the object's invariants are intact (but the value may have changed); the strong guarantee adds rollback.
62. Q10: What is the cost of throwing an exception (when actually thrown)?
63. A) Zero
64. B) Typically much higher than a return code — unwind table walks the stack (*)
65. C) Faster than a function call
66. D) The same as a virtual call
67. Explanation: Thrown exceptions are expensive (often microseconds) due to stack unwinding; the "zero cost if not thrown" model only applies when no exception is thrown. Use exceptions for exceptional cases, not control flow.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does RAII stand for?
  options:
    - Resource Acquisition Is Initialization
    - Resource Allocation Is Initialization
    - Resource Access Is Initialization
    - Random Access Is Initialization
  correctIndex: 0
  explanation: "Resource Acquisition Is Initialization: each resource is acquired in an object's constructor and released in its destructor, making cleanup automatic."
- id: q2
  question: Why should you catch by reference?
  options:
    - It is faster
    - To avoid slicing derived exceptions to the base type
    - References are required
    - To enable rethrow
  correctIndex: 1
  explanation: Catching by value slices the exception to the static (base) type and copies it; catching by reference (preferably const) preserves the derived type.
- id: q3
  question: What happens if an exception is thrown from a destructor during stack unwinding?
  options:
    - The exception is propagated
    - The destructor is retried
    - std::terminate is called
    - The program continues normally
  correctIndex: 2
  explanation: Throwing during stack unwinding (already in exception handling) calls std::terminate; destructors should be noexcept and wrap risky cleanup in try/catch.
- id: q4
  question: What does noexcept promise?
  options:
    - The function is fast
    - The function is inline
    - The function returns void
    - The function will not throw; violations call std::terminate
  correctIndex: 3
  explanation: noexcept tells the compiler and callers the function will not throw; if it does, std::terminate is called. It enables optimizations and lets the STL use move.
- id: q5
  question: Which guarantee does copy-and-swap provide for operator=?
  options:
    - Strong (operation completes or rolls back)
    - Basic
    - No-throw
    - None
  correctIndex: 0
  explanation: Copy-and-swap creates a temporary (may throw, leaving *this unchanged) and swaps via a noexcept swap, providing the strong guarantee.
- id: q6
  question: Why does vector growth copy when move is not noexcept?
  options:
    - For performance
    - To preserve the strong exception guarantee
    - Because moves are not allowed
    - It is a bug in the STL
  correctIndex: 1
  explanation: A throwing move mid-realization would leave the source modified and destination partial; copy leaves the source intact, preserving the strong guarantee.
- id: q7
  question: Which is the base class of std::runtime_error and std::logic_error?
  options:
    - std::error
    - std::throwable
    - std::exception
    - std::base
  correctIndex: 2
  explanation: std::exception is the root; std::runtime_error and std::logic_error derive from it; user exceptions should derive from std::exception or one of its subclasses.
- id: q8
  question: How do you rethrow the current exception preserving its type?
  options:
    - throw e;
    - rethrow;
    - throw std::current_exception();
    - throw;
  correctIndex: 3
  explanation: "`throw;` rethrows the currently handled exception preserving its original dynamic type; `throw e;` would slice to e's static type."
- id: q9
  question: What is the basic exception guarantee?
  options:
    - No leaks and no broken invariants — the object is in a valid state
    - The operation always succeeds
    - The operation rolls back
    - The operation never throws
  correctIndex: 0
  explanation: "The basic guarantee: no resource leaks and the object's invariants are intact (but the value may have changed); the strong guarantee adds rollback."
- id: q10
  question: What is the cost of throwing an exception (when actually thrown)?
  options:
    - Zero
    - Typically much higher than a return code — unwind table walks the stack
    - Faster than a function call
    - The same as a virtual call
  correctIndex: 1
  explanation: Thrown exceptions are expensive (often microseconds) due to stack unwinding; the "zero cost if not thrown" model only applies when no exception is thrown. Use exceptions for exceptional cases, not control flow.
```

