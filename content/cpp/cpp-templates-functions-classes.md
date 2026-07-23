---
slug: cpp-templates-functions-classes
id: cpp-08
track: cpp
order: 8
title: Templates — Functions and Classes
description: Learn function and class templates, template argument deduction, specialization, variadic templates, SFINAE, two-phase lookup, and the concepts-like discipline that templates demand.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=350s
whyItMatters: Learn function and class templates, template argument deduction, specialization, variadic templates, SFINAE, two-phase lookup, and the concepts-like discipline that templates demand.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# Templates — Functions and Classes

## Templates — Functions and Classes

### Why It Matters

Learn function and class templates, template argument deduction, specialization, variadic templates, SFINAE, two-phase lookup, and the concepts-like discipline that templates demand.

Learn function and class templates, template argument deduction, specialization, variadic templates, SFINAE, two-phase lookup, and the concepts-like discipline that templates demand.

### Prerequisites

- Stage 1-7 (especially classes and inheritance)
- Comfort with the STL containers (preview from Stage 9 is helpful but not required)

### Topics

- Function templates: `template<typename T> T max(T a, T b)`
- Class templates: `template<typename T> class Stack { ... }`
- Template argument deduction (CTAD in C++17)
- Explicit and partial specialization
- Variadic templates and parameter packs
- Fold expressions (C++17)
- SFINAE (Substitution Failure Is Not An Error) and std::enable_if
- Two-phase name lookup
- `if constexpr` (preview — Stage 17 revisits)
- Template instantiation model and the ODR

### Key Concepts

- Templates are compile-time: each instantiation produces a distinct type or function; "template code is generic, instantiations are concrete."
- Two-phase lookup: names not dependent on a template parameter are looked up at definition; dependent names are looked up at instantiation (ADL matters here).
- SFINAE: substitution failures during deduction are not errors; they remove a candidate from overload resolution. C++20 concepts replace many SFINAE uses.
- A full specialization of a function template is a non-template function; partial specialization of function templates is not allowed (use overload or class templates).
- Variadic templates with fold expressions make recursive metaprogramming far simpler than the old recursion-on-packs pattern.
- Templates live in headers (no .cpp separate compilation for the generic form); instantiations across TUs are deduplicated by the linker.

```cpp
template<typename T>
T max_of(T a, T b) {
    return a < b ? b : a;
}

// max_of(3, 5);          // T = int
// max_of(3.14, 2.71);    // T = double
// max_of(3, 2.7);        // ERROR: T deduced as both int and double
// max_of<double>(3, 2.7); // OK: explicit T
```
Caption: Function template

### Common Pitfalls

- Forgetting `template` / `typename` on dependent names — `T::iterator` is parsed as a member unless prefixed with `typename`; `obj.template foo<T>()` is needed for dependent template calls. Two-phase lookup surprises await.
- Two-phase lookup biting hidden base members — base class members aren't found in dependent lookup; qualify with `this->` or `Base<T>::` to make them visible.
- Excessive SFINAE — write unmaintainable enable_if chains; prefer C++20 concepts (Stage 17) which are far more readable.
- Templates in .cpp files — generic definitions must be in headers (or use explicit instantiation); otherwise the linker reports undefined references for instantiations.
- Allowing implicit narrowing in templates — `max_of(3, 2.7)` is a deduction error, not silent narrowing; explicit `max_of<double>` or use common_type to accept mixed types.

### Real-World Applications

- The entire STL is templated; std::vector<int>, std::vector<std::string>, etc. are distinct types generated from one class template.
- Eigen (linear algebra library used by TensorFlow, PyTorch) uses expression templates to fuse matrix operations at compile time, avoiding temporaries.
- Unreal Engine's TArray<T> is a templated dynamic array; the engine instantiates hundreds of distinct TArrays across gameplay code.
- LLVM's SmallVector<T, N> uses templates to provide a stack-allocated small-buffer optimization; the N parameter is chosen per call site.

### Interview Questions

- 1. What is the difference between a class template and a class? — A class template is a pattern the compiler uses to generate classes; each instantiation is a distinct class type.
- 2. What is SFINAE? — Substitution Failure Is Not An Error: a substitution failure during template argument deduction removes the candidate from overload resolution instead of causing a hard error.
- 3. What is two-phase name lookup? — Non-dependent names are looked up at template definition; dependent names at instantiation (using ADL). This causes surprising errors when base members aren't qualified.
- 4. What is a fold expression? — A C++17 syntax for reducing a parameter pack over a binary operator: `(... op pack)` or `(pack op ...)`, with optional initial value.
- 5. Why must template definitions usually live in headers? — The compiler needs the full definition to instantiate templates for each type used; without it, only explicit instantiations in a .cpp work.

### Mini Project

Build a Generic Stack<T> Class Template: A stack supporting any element type, with full specializations for bool (bit-packed) and std::string (no copy-elision surprise). Suggested approach:
  - Primary template `template<typename T> class Stack` with std::vector<T> storage
  - push(const T&), push(T&&), pop(), top(), size(), empty()
  - Partial-specialize behavior for bool using std::vector<bool> or a bitset
  - Add a clear() method and operator<< for printing
  - Use static_assert to forbid floating-point tops if you want a teaching constraint

### Exercises

1. Write a function template `max_of` and call it with int, double, and std::string; explain why mixed types fail without explicit T.
2. Write a class template `Pair<T,U>` and a partial specialization `Pair<T,T>` with a same() method; verify both are selected correctly.
3. Convert a recursive variadic template (using a base case) to a fold expression; compare the line counts.
4. Write a function `add_one` enabled only for integral types via std::enable_if; call it with int (OK) and double (error).
5. Provoke the two-phase lookup bug: a derived template class that uses a base member without `this->`; observe the compile error, then fix with `this->`.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is a class template?
9. A) A class with all members public
10. B) An abstract class
11. C) A class with virtual functions
12. D) A pattern the compiler uses to generate classes for specific types (*)
13. Explanation: A class template is a compile-time pattern; each instantiation `Stack<int>`, `Stack<std::string>` produces a distinct class type.
14. Q2: What does SFINAE stand for?
15. A) Substitution Failure Is Not An Error (*)
16. B) Substitution Failure Is Now An Error
17. C) Syntax Failure Is Not An Error
18. D) Static Failure Is Not An Error
19. Explanation: SFINAE: a substitution failure during template argument deduction removes the candidate rather than causing a hard error.
20. Q3: When are dependent names looked up?
21. A) At template definition
22. B) At instantiation (*)
23. C) At link time
24. D) At runtime
25. Explanation: Two-phase lookup: non-dependent names at definition, dependent names at instantiation (often via ADL).
26. Q4: What is a fold expression?
27. A) Folding a class into a smaller one
28. B) A recursive template
29. C) Reducing a parameter pack over a binary operator (C++17) (*)
30. D) A type trait
31. Explanation: Fold expressions (C++17) reduce a pack over a binary operator, e.g. `(... + pack)` or `(pack + ...)` with optional initial value.
32. Q5: Where must template definitions usually live?
33. A) In .cpp files
34. B) In separate .tpl files
35. C) Anywhere
36. D) In headers (or use explicit instantiation) (*)
37. Explanation: The compiler needs the full definition at each instantiation point; templates are usually in headers, or use explicit instantiations in one .cpp.
38. Q6: Why does `T::iterator` need `typename` prefix?
39. A) To tell the compiler T::iterator is a type, not a member (*)
40. B) It is required by the standard
41. C) To make it const
42. D) To enable SFINAE
43. Explanation: Without `typename`, the compiler parses `T::iterator` as a non-type member in dependent contexts; `typename T::iterator` clarifies it is a type.
44. Q7: What is template argument deduction (CTAD in C++17)?
45. A) Manually specifying template arguments
46. B) The compiler deduces template arguments from constructor arguments (*)
47. C) A type trait
48. D) A kind of SFINAE
49. Explanation: Class Template Argument Deduction (C++17) lets the compiler infer template arguments from constructor arguments: `Point p{1, 2}` deduces Point<int>.
50. Q8: What is partial specialization of a function template?
51. A) Allowed
52. B) Required for variadic templates
53. C) Not allowed — use overloads or class templates instead (*)
54. D) A C++20 feature
55. Explanation: Function template partial specialization is not allowed; use overloading or wrap in a class template that supports partial specialization.
56. Q9: What does `std::enable_if_t<std::is_integral_v<T>>` do?
57. A) Asserts T is integral
58. B) Casts T to int
59. C) Throws if T is not integral
60. D) SFINAE-enables the template only for integral T (*)
61. Explanation: enable_if disables the template via SFINAE when T is not integral; the candidate is silently removed rather than failing.
62. Q10: What does `obj.template foo<T>()` disambiguate?
63. A) That foo<T> is a template call, not a less-than comparison (*)
64. B) That foo is virtual
65. C) That foo is static
66. D) That foo returns T
67. Explanation: In dependent contexts, the parser would interpret `foo<T>()` as `foo < T > ()` (comparison) unless `.template` tells it foo is a template.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is a class template?
  options:
    - A class with all members public
    - An abstract class
    - A class with virtual functions
    - A pattern the compiler uses to generate classes for specific types
  correctIndex: 3
  explanation: A class template is a compile-time pattern; each instantiation `Stack<int>`, `Stack<std::string>` produces a distinct class type.
- id: q2
  question: What does SFINAE stand for?
  options:
    - Substitution Failure Is Not An Error
    - Substitution Failure Is Now An Error
    - Syntax Failure Is Not An Error
    - Static Failure Is Not An Error
  correctIndex: 0
  explanation: "SFINAE: a substitution failure during template argument deduction removes the candidate rather than causing a hard error."
- id: q3
  question: When are dependent names looked up?
  options:
    - At template definition
    - At instantiation
    - At link time
    - At runtime
    - .
  correctIndex: 1
  explanation: "Two-phase lookup: non-dependent names at definition, dependent names at instantiation (often via ADL)."
- id: q4
  question: What is a fold expression?
  options:
    - Folding a class into a smaller one
    - A recursive template
    - Reducing a parameter pack over a binary operator (C++17)
    - A type trait
  correctIndex: 2
  explanation: Fold expressions (C++17) reduce a pack over a binary operator, e.g. `(... + pack)` or `(pack + ...)` with optional initial value.
- id: q5
  question: Where must template definitions usually live?
  options:
    - In .cpp files
    - In separate .tpl files
    - Anywhere
    - In headers (or use explicit instantiation)
  correctIndex: 3
  explanation: The compiler needs the full definition at each instantiation point; templates are usually in headers, or use explicit instantiations in one .cpp.
- id: q6
  question: Why does `T::iterator` need `typename` prefix?
  options:
    - To tell the compiler T::iterator is a type, not a member
    - It is required by the standard
    - To make it const
    - To enable SFINAE
  correctIndex: 0
  explanation: Without `typename`, the compiler parses `T::iterator` as a non-type member in dependent contexts; `typename T::iterator` clarifies it is a type.
- id: q7
  question: What is template argument deduction (CTAD in C++17)?
  options:
    - Manually specifying template arguments
    - The compiler deduces template arguments from constructor arguments
    - A type trait
    - A kind of SFINAE
  correctIndex: 1
  explanation: "Class Template Argument Deduction (C++17) lets the compiler infer template arguments from constructor arguments: `Point p{1, 2}` deduces Point<int>."
- id: q8
  question: What is partial specialization of a function template?
  options:
    - Allowed
    - Required for variadic templates
    - Not allowed — use overloads or class templates instead
    - A C++20 feature
  correctIndex: 2
  explanation: Function template partial specialization is not allowed; use overloading or wrap in a class template that supports partial specialization.
- id: q9
  question: What does `std::enable_if_t<std::is_integral_v<T>>` do?
  options:
    - Asserts T is integral
    - Casts T to int
    - Throws if T is not integral
    - SFINAE-enables the template only for integral T
  correctIndex: 3
  explanation: enable_if disables the template via SFINAE when T is not integral; the candidate is silently removed rather than failing.
- id: q10
  question: What does `obj.template foo<T>()` disambiguate?
  options:
    - That foo<T> is a template call, not a less-than comparison
    - That foo is virtual
    - That foo is static
    - That foo returns T
  correctIndex: 0
  explanation: In dependent contexts, the parser would interpret `foo<T>()` as `foo < T > ()` (comparison) unless `.template` tells it foo is a template.
```

