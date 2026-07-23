---
slug: cpp-functions-references
id: cpp-04
track: cpp
order: 4
title: Functions and References
description: Learn function definition, parameter passing by value and by reference, const references for efficient read-only arguments, default arguments, overload resolution, and inline.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=150s
whyItMatters: Learn function definition, parameter passing by value and by reference, const references for efficient read-only arguments, default arguments, overload resolution, and inline.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# Functions and References

## Functions and References

### Why It Matters

Learn function definition, parameter passing by value and by reference, const references for efficient read-only arguments, default arguments, overload resolution, and inline.

Learn function definition, parameter passing by value and by reference, const references for efficient read-only arguments, default arguments, overload resolution, and inline.

### Prerequisites

- Stage 1: Getting Started with C++
- Stage 2: Variables, Types, and Operators
- Stage 3: Control Flow — Conditionals and Loops

### Topics

- Function declaration vs definition
- Parameter passing: by value, by reference (lvalue ref), by const reference
- Return values: by value, by reference, by const reference
- Default arguments
- Function overloading and overload resolution
- inline functions and the ODR
- constexpr functions
- Recursion and stack usage
- Why pass std::string by const ref, not by value (without move semantics — Stage 11 revisits)

### Key Concepts

- Pass-by-value copies the argument; pass-by-reference avoids the copy and lets you mutate the caller's object.
- const T& is the idiomatic "read-only argument" — no copy, no mutation, works for rvalues and lvalues.
- A reference must be initialized and cannot be re-seated; `T&` aliases an existing object.
- Dangling references are UB: never return a reference to a local, a temporary, or an out-of-scope object.
- Overload resolution picks the best-matching function by arity, conversions, and template specialization — when in doubt, mark overloads explicit or use tag dispatch.
- A function declaration with default arguments must not be redeclared with different defaults in the same scope.

```cpp
#include <iostream>
#include <vector>

void by_value(std::vector<int> v)        { v.push_back(99); }   // copy
void by_ref(std::vector<int>& v)         { v.push_back(99); }   // mutate caller
void by_cref(const std::vector<int>& v)  { std::cout << v.size(); } // read only

int main() {
    std::vector<int> data{1, 2, 3};
    by_value(data);   // data unchanged
    by_ref(data);     // data now has 4 elements
    by_cref(data);    // prints 4
}
```
Caption: Pass by value, reference, const reference

### Common Pitfalls

- Returning a reference to a local — UB; the local is destroyed when the function returns, leaving a dangling reference. Return by value (RVO will elide the copy) or take an output parameter.
- Passing large objects by value — unnecessary copy; pass by const reference for read-only, or by value when you intend to consume/move (Stage 11).
- Default arguments in declarations vs definitions — declare defaults only once (typically in the header); redeclaring with different defaults in the .cpp is a redeclaration error.
- Hidden overloads in derived classes — `using Base::f;` to unhide base overloads when adding a new overload in a derived class (covered more in Stage 7).
- Lifetime extension of temporaries by const references does NOT extend through function returns — `const T& f() { return make_temp(); }` returns a dangling reference even though `const T& r = make_temp();` (direct bind) is safe.

### Real-World Applications

- The STL passes comparators and projections by value or const ref via templates; std::sort takes a Compare by value, so cheap-to-copy function objects are recommended.
- Qt's API consistently uses `const QString&` for read-only string parameters to avoid deep copies.
- Google's Abseil style guide recommends passing cheap-to-copy types (under 2 pointers) by value and everything else by const ref.
- LLVM's IR builders pass `const Twine&` for efficient string concatenation without temporaries.

### Interview Questions

- 1. When do you pass by value vs by const reference? — Pass cheap types (int, pointer, small PODs) by value; pass anything with non-trivial copy (string, vector, custom classes) by const ref. With move semantics, "sink" parameters may be passed by value then moved.
- 2. What is lifetime extension? — Binding a temporary to a const lvalue reference extends the temporary's lifetime to that of the reference — but only at the point of binding, not through function returns.
- 3. What is overload resolution? — The compiler picks the best-matching function by counting implicit conversions; ties or no viable candidates produce ambiguity errors.
- 4. Why must references be initialized? — A reference is an alias for an existing object; an uninitialized reference has no referent and the standard forbids it.
- 5. What is the difference between `inline` and `constexpr` functions? — inline permits definition in multiple TUs (ODR relaxation) and is a hint to inline; constexpr requires the function be evaluable at compile time for constant arguments.

### Mini Project

Build a String Manipulation Library: A small library of string utilities (split, join, trim, to_lower) using const ref parameters and value returns. Suggested approach:
  - Put declarations in strutil.hpp and definitions in strutil.cpp
  - split(const std::string&, char delim) -> std::vector<std::string>
  - join(const std::vector<std::string>&, const std::string& sep) -> std::string
  - trim(const std::string&) -> std::string (remove leading/trailing whitespace)
  - to_lower(const std::string&) -> std::string (use std::transform with ::tolower)
  - Write a small main.cpp that exercises every function

### Exercises

1. Write a function `void increment(int& x)` and demonstrate it modifies the caller's variable; contrast with `void increment(int x)` which doesn't.
2. Write a function returning a const reference to a local; compile with -fsanitize=address and observe the diagnostic on use.
3. Demonstrate overload resolution between `f(int)` and `f(double)` by calling `f(3.14f)`; explain the chosen overload.
4. Write a function with three default arguments and call it 4 different ways.
5. Write `inline int square(int x) { return x * x; }` in a header; include it from two .cpp files in the same program to confirm the ODR relaxation works.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why pass std::string by const reference instead of by value?
9. A) Strings cannot be copied
10. B) const ref is the only allowed form
11. C) It is required by the standard
12. D) To avoid the copy and prevent modification (*)
13. Explanation: Passing by const T& avoids the potentially expensive copy and the const prevents modification; for sink parameters, pass by value and move (Stage 11).
14. Q2: What is UB in the following: `const T& f() { T local; return local; }`?
15. A) Returning a reference to a local that is destroyed on return (*)
16. B) Returning a const reference
17. C) Local variables cannot be const
18. D) Nothing — this is fine
19. Explanation: The local's lifetime ends when f returns, so the returned reference dangles; using it is undefined behavior.
20. Q3: Can a reference be re-seated to a different object after initialization?
21. A) Yes, with `ref = other`
22. B) No — references cannot be re-seated; assignment assigns through them (*)
23. C) Only with const_cast
24. D) Only in C++20 and later
25. Explanation: A reference is bound at initialization and cannot be made to refer to a different object; `r = other;` assigns other to the referent.
26. Q4: Where should default arguments be specified?
27. A) In the .cpp definition
28. B) In both header and .cpp
29. C) In the header declaration (only once per scope) (*)
30. D) Anywhere — they are merged
31. Explanation: Defaults go in the declaration (header); redeclaring with different defaults in the same scope is an error.
32. Q5: What does overload resolution do when no function matches?
33. A) Picks the first declared
34. B) Throws an exception
35. C) Calls a default overload
36. D) Compile error — no viable function (*)
37. Explanation: Overload resolution selects the best viable candidate; if none is viable, the program is ill-formed (compile error).
38. Q6: What is lifetime extension?
39. A) Binding a temporary to a const ref extends its lifetime to that of the ref (*)
40. B) Extending the lifetime of a function's local
41. C) Garbage collection
42. D) A feature of shared_ptr
43. Explanation: `const T& r = make_temp();` extends the temporary's lifetime to that of r — but only at the binding site, not through function returns.
44. Q7: What does `inline` primarily request of the compiler?
45. A) Always expand the function body inline
46. B) Relax the ODR so the function may be defined in multiple TUs (*)
47. C) Make the function constexpr
48. D) Make the function static
49. Explanation: Modern `inline` is mostly an ODR relaxation; the actual inlining decision is the compiler's based on cost heuristics.
50. Q8: What happens if a derived class adds an overload without `using Base::f;`?
51. A) Compile error
52. B) The base overloads are inherited
53. C) The base overloads are hidden (*)
54. D) Runtime error
55. Explanation: A derived-class overload of the same name hides all base overloads; `using Base::f;` re-exposes them.
56. Q9: Which is the idiomatic signature for a function that takes a string it will not modify?
57. A) void f(std::string s)
58. B) void f(std::string& s)
59. C) void f(std::string* s)
60. D) void f(const std::string& s) (*)
61. Explanation: `const std::string&` is the canonical read-only string parameter — no copy, no mutation, accepts lvalues and rvalues.
62. Q10: What is the result of `f(42L)` when overloads `f(int)` and `f(double)` exist?
63. A) Ambiguous — both require conversion (*)
64. B) Calls f(int)
65. C) Calls f(double)
66. D) Compile error — no match
67. Explanation: `long -> int` and `long -> double` are both standard conversions of equal rank, so overload resolution is ambiguous.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why pass std::string by const reference instead of by value?
  options:
    - Strings cannot be copied
    - const ref is the only allowed form
    - It is required by the standard
    - To avoid the copy and prevent modification
  correctIndex: 3
  explanation: Passing by const T& avoids the potentially expensive copy and the const prevents modification; for sink parameters, pass by value and move (Stage 11).
- id: q2
  question: "What is UB in the following: `const T& f() { T local; return local; }`?"
  options:
    - Returning a reference to a local that is destroyed on return
    - Returning a const reference
    - Local variables cannot be const
    - Nothing — this is fine
  correctIndex: 0
  explanation: The local's lifetime ends when f returns, so the returned reference dangles; using it is undefined behavior.
- id: q3
  question: Can a reference be re-seated to a different object after initialization?
  options:
    - Yes, with `ref = other`
    - No — references cannot be re-seated; assignment assigns through them
    - Only with const_cast
    - Only in C++20 and later
  correctIndex: 1
  explanation: A reference is bound at initialization and cannot be made to refer to a different object; `r = other;` assigns other to the referent.
- id: q4
  question: Where should default arguments be specified?
  options:
    - In the .cpp definition
    - In both header and .cpp
    - In the header declaration (only once per scope)
    - Anywhere — they are merged
  correctIndex: 2
  explanation: Defaults go in the declaration (header); redeclaring with different defaults in the same scope is an error.
- id: q5
  question: What does overload resolution do when no function matches?
  options:
    - Picks the first declared
    - Throws an exception
    - Calls a default overload
    - Compile error — no viable function
  correctIndex: 3
  explanation: Overload resolution selects the best viable candidate; if none is viable, the program is ill-formed (compile error).
- id: q6
  question: What is lifetime extension?
  options:
    - Binding a temporary to a const ref extends its lifetime to that of the ref
    - Extending the lifetime of a function's local
    - Garbage collection
    - A feature of shared_ptr
  correctIndex: 0
  explanation: "`const T& r = make_temp();` extends the temporary's lifetime to that of r — but only at the binding site, not through function returns."
- id: q7
  question: What does `inline` primarily request of the compiler?
  options:
    - Always expand the function body inline
    - Relax the ODR so the function may be defined in multiple TUs
    - Make the function constexpr
    - Make the function static
  correctIndex: 1
  explanation: Modern `inline` is mostly an ODR relaxation; the actual inlining decision is the compiler's based on cost heuristics.
- id: q8
  question: What happens if a derived class adds an overload without `using Base::f;`?
  options:
    - Compile error
    - The base overloads are inherited
    - The base overloads are hidden
    - Runtime error
  correctIndex: 2
  explanation: A derived-class overload of the same name hides all base overloads; `using Base::f;` re-exposes them.
- id: q9
  question: Which is the idiomatic signature for a function that takes a string it will not modify?
  options:
    - void f(std::string s)
    - void f(std::string& s)
    - void f(std::string* s)
    - void f(const std::string& s)
  correctIndex: 3
  explanation: "`const std::string&` is the canonical read-only string parameter — no copy, no mutation, accepts lvalues and rvalues."
- id: q10
  question: What is the result of `f(42L)` when overloads `f(int)` and `f(double)` exist?
  options:
    - "` when overloads `f(int)` and `f(double)` exist?"
    - Ambiguous — both require conversion
    - Calls f(int)
    - Calls f(double)
    - Compile error — no match
  correctIndex: 1
  explanation: "`long -> int` and `long -> double` are both standard conversions of equal rank, so overload resolution is ambiguous."
```

