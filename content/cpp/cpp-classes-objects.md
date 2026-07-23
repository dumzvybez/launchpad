---
slug: cpp-classes-objects
id: cpp-06
track: cpp
order: 6
title: Classes and Objects
description: Define classes with access specifiers, constructors, destructors, copy/move operations, and learn the Rule of 0/3/5 that governs when you must write each special member function.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=250s
whyItMatters: Define classes with access specifiers, constructors, destructors, copy/move operations, and learn the Rule of 0/3/5 that governs when you must write each special member function.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# Classes and Objects

## Classes and Objects

### Why It Matters

Define classes with access specifiers, constructors, destructors, copy/move operations, and learn the Rule of 0/3/5 that governs when you must write each special member function.

Define classes with access specifiers, constructors, destructors, copy/move operations, and learn the Rule of 0/3/5 that governs when you must write each special member function.

### Prerequisites

- Stage 1-5 (especially pointers and dynamic memory)

### Topics

- struct vs class (only default access differs)
- public, private, protected access specifiers
- Constructors: default, parameterized, copy, move, delegating
- Initializer lists (the only way to init members and base classes)
- Destructor
- Copy constructor and copy assignment
- Move constructor and move assignment (preview — Stage 11)
- The Rule of 0 / Rule of 3 / Rule of 5
- explicit constructors and conversion operators
- const member functions and mutable
- static members

### Key Concepts

- Members initialize in declaration order in the class, NOT the order in the initializer list — out-of-order init lists are a common bug.
- The Rule of 0: prefer to design classes whose members manage their own resources (smart pointers, containers) so you write zero special member functions and the compiler-generated defaults are correct.
- The Rule of 5: if you write any of {dtor, copy ctor, copy assign, move ctor, move assign}, you probably need all five.
- explicit on single-argument constructors prevents implicit conversions (e.g., `MyClass m = 42;`).
- const member functions promise not to modify logical state; mutable allows physical mutation (caches, mutexes) under const.
- A virtual destructor is required in any class intended as a polymorphic base (covered in Stage 7).

```cpp
#include <string>
#include <iostream>

class Person {
public:
    Person(std::string name, int age) : name_(std::move(name)), age_(age) {}
    const std::string& name() const { return name_; }
    int age() const { return age_; }
private:
    std::string name_;
    int age_;
};

int main() {
    Person p{"Alice", 30};
    std::cout << p.name() << " is " << p.age() << '\n';
}
```
Caption: Simple class with initializer list

### Common Pitfalls

- Member init order != initializer list order — members are initialized in declaration order regardless of the list; -Wreorder warns. Always list initializers in declaration order.
- Forgetting the virtual destructor on a polymorphic base — deleting through a Base* to a Derived doesn't call Derived's destructor; leaks and UB. Make the base dtor virtual.
- Self-assignment not handled in operator= — `a = a` corrupts state when operator= deletes its own buffer before copying; check `if (this != &other)` or use copy-and-swap.
- Calling virtual functions from constructors or destructors — virtual dispatch uses the type currently being constructed/destructed, not the most-derived; this is a classic silent bug.
- Single-arg constructors without explicit — implicit conversions trigger surprising temporaries; mark single-arg constructors explicit unless implicit conversion is intended.

### Real-World Applications

- Adobe Photoshop's image object model is a deep C++ class hierarchy with carefully crafted copy/move semantics and virtual destructors.
- Qt's QObject hierarchy forbids value semantics (no copy) and uses parent-child ownership to delete children automatically — a Rule-of-0 variant.
- LLVM's StringRef and Twine are non-owning view types whose Rule-of-0 design avoids ownership bugs.
- Unreal Engine's UObject is the base of all gameplay classes, with reflection metadata and a virtual destructor; subclasses follow strict Rule-of-5 patterns for asset lifetime.

### Interview Questions

- 1. What is the Rule of 0? — If your class's members manage their own resources (smart pointers, containers), write zero special member functions; the compiler defaults are correct.
- 2. What is the Rule of 5? — If you write any of dtor / copy ctor / copy assign / move ctor / move assign, you probably need all five to maintain invariants.
- 3. Why do members initialize in declaration order, not init-list order? — The standard mandates it; init-list order is irrelevant. -Wreorder warns about mismatches.
- 4. Why must polymorphic bases have a virtual destructor? — Otherwise deleting through a Base* doesn't call the Derived destructor, leaking resources.
- 5. What does explicit do? — It forbids implicit conversions and copy-init from a single value, requiring direct or brace initialization.

### Mini Project

Build a Temperature Logger Class: A class TemperatureLog that stores a sequence of readings with timestamps, computes min/max/average, and serializes to a CSV string. Suggested approach:
  - Use std::vector<double> for readings and std::vector<int64_t> for timestamps
  - Follow Rule of 0 — no manual special members
  - Provide add(double reading, int64_t ts), min(), max(), average() (const)
  - Provide to_csv() const returning std::string
  - Mark single-arg constructors explicit; make accessors const

### Exercises

1. Write a class with an out-of-order initializer list; compile with -Wreorder and read the warning; reorder to match declaration order.
2. Demonstrate Rule-of-5 by writing a Buffer class with a raw char*; verify with valgrind that copies and moves do not leak or double-free.
3. Refactor Buffer to use std::vector<char> (Rule of 0); verify the same test cases still pass.
4. Add explicit to a single-arg constructor; try `MyClass m = 42;` and read the error.
5. Create a class with a mutable mutex; mark read methods const and lock the mutex inside them; verify compilation.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the only difference between struct and class in C++?
9. A) struct is smaller
10. B) Default access: struct is public, class is private (*)
11. C) struct cannot have methods
12. D) class cannot be inherited
13. Explanation: struct and class are identical except for default access (public for struct, private for class) and default inheritance (public for struct, private for class).
14. Q2: In what order are class members initialized?
15. A) Alphabetical order
16. B) Initializer-list order
17. C) Declaration order in the class (*)
18. D) Random order
19. Explanation: Members initialize in declaration order regardless of init-list order; -Wreorder warns when they differ.
20. Q3: What is the Rule of 0?
21. A) Zero members
22. B) Zero constructors
23. C) Zero destructors
24. D) Write zero special member functions when members manage their own resources (*)
25. Explanation: If your members (smart pointers, containers) manage resources, the compiler-generated defaults are correct; write none yourself.
26. Q4: Why must a polymorphic base class have a virtual destructor?
27. A) So `delete base_ptr` calls the Derived destructor (*)
28. B) To allow abstract classes
29. C) To enable RTTI
30. D) To make the class final
31. Explanation: Without a virtual destructor, deleting through a Base* has UB and skips the Derived destructor, leaking resources.
32. Q5: What does explicit prevent?
33. A) Direct initialization
34. B) Implicit conversions and copy-init from a single value (*)
35. C) Construction with multiple args
36. D) Move semantics
37. Explanation: explicit on a single-arg ctor blocks `T x = value;` style implicit conversion; `T x(value)` or `T x{value}` still works.
38. Q6: What does mutable allow?
39. A) Mutating const members
40. B) Re-seating references
41. C) Physical mutation of a member inside a const method (*)
42. D) Skipping constructors
43. Explanation: mutable lets a const member function modify a member (e.g., a cache or mutex) while preserving logical const-ness.
44. Q7: What is the safest pattern for operator= to handle self-assignment?
45. A) Trust the user not to self-assign
46. B) Throw an exception on self-assignment
47. C) Always assert
48. D) Check `if (this != &other)` or use copy-and-swap (*)
49. Explanation: Self-assignment check or copy-and-swap prevents `a = a` from corrupting state; copy-and-swap is also exception-safe.
50. Q8: Why is calling a virtual function from a constructor problematic?
51. A) Virtual dispatch uses the type currently being constructed, not the most-derived (*)
52. B) It is a syntax error
53. C) Virtual functions cannot be called
54. D) It is fine and works correctly
55. Explanation: During construction, the dynamic type is the constructor's class, so virtual calls dispatch to that class's overrides — usually not what you want.
56. Q9: Which is the correct signature for a const member function?
57. A) `const void f()`
58. B) `void f() const` (*)
59. C) `void const f()`
60. D) `const void f() const`
61. Explanation: The trailing const is the member-function const qualifier; it binds `this` as `const T*`, preventing member mutation.
62. Q10: When does the Rule of 5 apply?
63. A) Never
64. B) Only for trivially copyable types
65. C) When you write any of the 5 special members, you probably need all 5 (*)
66. D) Only in C++11
67. Explanation: If you declare any of dtor / copy ctor / copy assign / move ctor / move assign, the compiler may suppress the others; declaring all five explicitly is the safe choice.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the only difference between struct and class in C++?
  options:
    - struct is smaller
    - "Default access: struct is public, class is private"
    - struct cannot have methods
    - class cannot be inherited
  correctIndex: 1
  explanation: struct and class are identical except for default access (public for struct, private for class) and default inheritance (public for struct, private for class).
- id: q2
  question: In what order are class members initialized?
  options:
    - Alphabetical order
    - Initializer-list order
    - Declaration order in the class
    - Random order
  correctIndex: 2
  explanation: Members initialize in declaration order regardless of init-list order; -Wreorder warns when they differ.
- id: q3
  question: What is the Rule of 0?
  options:
    - Zero members
    - Zero constructors
    - Zero destructors
    - Write zero special member functions when members manage their own resources
  correctIndex: 3
  explanation: If your members (smart pointers, containers) manage resources, the compiler-generated defaults are correct; write none yourself.
- id: q4
  question: Why must a polymorphic base class have a virtual destructor?
  options:
    - So `delete base_ptr` calls the Derived destructor
    - To allow abstract classes
    - To enable RTTI
    - To make the class final
  correctIndex: 0
  explanation: Without a virtual destructor, deleting through a Base* has UB and skips the Derived destructor, leaking resources.
- id: q5
  question: What does explicit prevent?
  options:
    - Direct initialization
    - Implicit conversions and copy-init from a single value
    - Construction with multiple args
    - Move semantics
  correctIndex: 1
  explanation: explicit on a single-arg ctor blocks `T x = value;` style implicit conversion; `T x(value)` or `T x{value}` still works.
- id: q6
  question: What does mutable allow?
  options:
    - Mutating const members
    - Re-seating references
    - Physical mutation of a member inside a const method
    - Skipping constructors
  correctIndex: 2
  explanation: mutable lets a const member function modify a member (e.g., a cache or mutex) while preserving logical const-ness.
- id: q7
  question: What is the safest pattern for operator= to handle self-assignment?
  options:
    - Trust the user not to self-assign
    - Throw an exception on self-assignment
    - Always assert
    - Check `if (this != &other)` or use copy-and-swap
  correctIndex: 3
  explanation: Self-assignment check or copy-and-swap prevents `a = a` from corrupting state; copy-and-swap is also exception-safe.
- id: q8
  question: Why is calling a virtual function from a constructor problematic?
  options:
    - Virtual dispatch uses the type currently being constructed, not the most-derived
    - It is a syntax error
    - Virtual functions cannot be called
    - It is fine and works correctly
  correctIndex: 0
  explanation: During construction, the dynamic type is the constructor's class, so virtual calls dispatch to that class's overrides — usually not what you want.
- id: q9
  question: Which is the correct signature for a const member function?
  options:
    - "`const void f()`"
    - "`void f() const`"
    - "`void const f()`"
    - "`const void f() const`"
  correctIndex: 1
  explanation: The trailing const is the member-function const qualifier; it binds `this` as `const T*`, preventing member mutation.
- id: q10
  question: When does the Rule of 5 apply?
  options:
    - Never
    - Only for trivially copyable types
    - When you write any of the 5 special members, you probably need all 5
    - Only in C++11
  correctIndex: 2
  explanation: If you declare any of dtor / copy ctor / copy assign / move ctor / move assign, the compiler may suppress the others; declaring all five explicitly is the safe choice.
```

