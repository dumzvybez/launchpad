---
slug: dart-functions-parameters-closures
id: dart-04
track: dart
order: 4
title: Functions, Parameters, and Closures
description: Master Dart's function syntax, named and positional parameters, default values, arrow functions, first-class functions, lexical closures, and the typedef/type alias system.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=1800s
whyItMatters: Master Dart's function syntax, named and positional parameters, default values, arrow functions, first-class functions, lexical closures, and the typedef/type alias system.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Functions, Parameters, and Closures

## Functions, Parameters, and Closures

### Why It Matters

Master Dart's function syntax, named and positional parameters, default values, arrow functions, first-class functions, lexical closures, and the typedef/type alias system.

Master Dart's function syntax, named and positional parameters, default values, arrow functions, first-class functions, lexical closures, and the typedef/type alias system.

### Prerequisites

- Stage 2: Variables, Types, and null safety
- Stage 3: Control Flow — Conditionals and Loops

### Topics

- Function declarations and arrow (`=>`) syntax
- Required positional parameters
- Optional positional parameters with `[ ]`
- Named parameters with `{ }` and `required`
- Default values (must be compile-time constants)
- First-class functions and higher-order functions
- Lexical closures and captured variables
- typedef and the modern `typedef F = ...` form

### Key Concepts

- Named parameters default to optional; mark with `required` to force callers to supply them.
- Optional positional params use square brackets and may have defaults; named params use braces.
- Default values must be compile-time constants — `void f({DateTime d = DateTime.now()})` is a compile error.
- Functions close over their lexical environment; a returned function captures variables by reference, so mutations after the closure is created are visible.
- `typedef` creates a named function type; modern syntax `typedef IntFn = int Function(int);` is preferred over the legacy `typedef int IntFn(int);`.
- All functions are objects of type `Function`; calling a non-function throws `NoSuchMethodError`.

```dart
// Positional required + optional with defaults
String greet(String name, [String greeting = 'Hello']) =>
    '$greeting, $name!';

// Named params (optional by default, mark required)
void configure({
  required String host,
  int port = 8080,
  bool tls = false,
}) {
  print('$host:$port tls=$tls');
}

void main() {
  print(greet('Anna'));                   // Hello, Anna!
  print(greet('Bob', 'Hi'));              // Hi, Bob!
  configure(host: 'api.x.com', tls: true);
}
```
Caption: Parameters

### Common Pitfalls

- Default value not a compile-time constant — `void f({List<int> xs = []})` is allowed (const list), but `void f({DateTime d = DateTime.now()})` is not; use `DateTime? d` and `?? DateTime.now()` inside.
- Marking a parameter `required` when callers can't always supply it — `required` enforces presence at the call site; if you want a default, drop `required` and supply a value.
- Capturing a loop variable in a closure and expecting snapshot semantics — `var fns = <Function>[]; for (var i = 0; i < 3; i++) fns.add(() => i);` produces three closures all returning 3 (final value of i). Snapshot with `final local = i;` inside the loop body.
- Confusing optional positional `[ ]` with named `{ }` — they look similar but have completely different call syntax; positional uses bare args, named uses `key: value`.
- Returning `void` from an arrow function accidentally — `void f() => print('hi');` is fine because `print` returns void; `int f() => print('hi');` is a type error because print returns void, not int.

### Real-World Applications

- Flutter's `setState(() { ... })` API uses a closure to encapsulate mutations to widget state.
- The Dart SDK's `Iterable` methods (map, where, expand) are heavily used in production code at Google to compose pipelines.
- Alibaba's Xianyu uses named parameters extensively in its data layer to make call sites self-documenting (`fetchUser(id: 42, withOrders: true)`).
- BMW's app uses typedefs to define telemetry callback signatures that are swapped between mock and production implementations.

### Interview Questions

- 1. What's the difference between `[int x]` and `{int x}` in a parameter list? — Square brackets make `x` optional positional; braces make `x` optional named (call site uses `x: value`).
- 2. What does `required` do? — Forces callers to supply the named parameter; without it the param is optional.
- 3. Why must default values be compile-time constants? — Defaults are baked into the call site by the compiler; runtime-evaluated defaults like `DateTime.now()` cannot be inlined.
- 4. What is a closure? — A function object that retains access to variables from its enclosing lexical scope, even after that scope has exited.
- 5. How do you create a named function type alias in modern Dart? — `typedef IntFn = int Function(int);` defines `IntFn` as the type of functions taking and returning int.

### Mini Project

Build a Tiny Functional Library: Implement `map`, `filter`, `reduce`, and `compose` as standalone functions (not methods) that work on `List<dynamic>`, with proper typedefs and JSDoc-style comments. Then use them to compute the sum of squares of even numbers from 1..20. Suggested approach:
  - Define `typedef Mapper<T, R> = R Function(T);` and similar for Pred and Reducer
  - Implement `List<R> mapList<T, R>(List<T> xs, Mapper<T, R> f)` etc.
  - Implement `compose` that takes two `Function`s and returns their composition
  - Chain them to compute `sum(square(evens(1..20)))` via the compose helper
  - Add a few sanity `assert`s to validate results in debug mode

### Exercises

1. Write a function `String repeat(String s, [int times = 1])` that returns `s` repeated `times` times.
2. Define a typedef for `bool Function(int)` and pass a lambda to a function that filters a list.
3. Write `makeAdder(int n)` that returns a closure adding `n` to its argument; call it twice and confirm state persists.
4. Capture a loop variable incorrectly, observe the bug, then fix by snapshotting to a local.
5. Convert a chain of nested function calls to use named parameters for clarity.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How are optional positional parameters declared?
9. A) {int x}
10. B) (int x)?
11. C) optional int x
12. D) [int x] (*)
13. Explanation: Square brackets `[int x]` denote an optional positional parameter; `{int x}` denotes an optional named one.
14. Q2: What does `required` do in a named parameter?
15. A) Forces the caller to supply it (*)
16. B) Makes it positional
17. C) Makes it nullable
18. D) Marks it as const
19. Explanation: `required` removes the optional-ness of a named parameter, so the analyzer errors if the call site omits it.
20. Q3: Default values for parameters must be...
21. A) Nullable
22. B) Compile-time constants (*)
23. C) Marked with `late`
24. D) Of type dynamic
25. Explanation: Defaults are inlined at the call site, so they must be evaluable at compile time — `int x = 5` is fine, `DateTime d = DateTime.now()` is not.
26. Q4: What does an arrow function (`=>`) do?
27. A) Declares an async function
28. B) Throws an arrow exception
29. C) Returns the expression on the right (*)
30. D) Lazily evaluates the body
31. Explanation: `expr => value` is shorthand for `{ return value; }`; it must yield a value (or `void`) compatible with the return type.
32. Q5: Closures in Dart capture variables...
33. A) By value (snapshot at creation)
34. B) By deep-copy
35. C) Only if marked `final`
36. D) By reference (see later mutations) (*)
37. Explanation: Dart closures capture variables by reference, so mutations after the closure is created remain visible to the closure.
38. Q6: Which typedef syntax is preferred in modern Dart?
39. A) typedef IntFn = int Function(int); (*)
40. B) typedef int IntFn(int x);
41. C) type IntFn = Function;
42. D) alias IntFn = int->int;
43. Explanation: The modern form `typedef Name = Signature;` reads naturally and works for any function type, including generics.
44. Q7: What does `Function` (with no args) represent?
45. A) An empty function
46. B) The supertype of all function objects (*)
47. C) A function that returns void
48. D) A generic function
49. Explanation: `Function` is the top type for function objects; every function is assignable to `Function`, but you lose static type info on the parameters.
50. Q8: Which is a valid higher-order function call?
51. A) map(fn, list)
52. B) list->map(fn)
53. C) list.map(fn) (*)
54. D) apply(map, list, fn)
55. Explanation: `Iterable.map` takes a function and returns a lazy `Iterable`; call it as `list.map(fn)` and materialize with `.toList()`.
56. Q9: What's the issue with `int f() => print('hi');`?
57. A) print is undefined
58. B) Arrow functions cannot call print
59. C) Nothing — it prints 'hi' and returns 0
60. D) print returns void, not int — type error (*)
61. Explanation: `print` returns `void`; an arrow function's expression type must be assignable to the declared return type, so `int` rejects `void`.
62. Q10: Which captures the loop variable by snapshot?
63. A) for (var i...) { final j = i; fns.add(() => j); } (*)
64. B) fns.add(() => i);
65. C) for (var i...) fns.add(() => i);
66. D) for (var i...) fns.add(() => i+0);
67. Explanation: Copying `i` to a `final j` declared inside the loop body creates a fresh binding per iteration, so each closure snapshots its own `j`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How are optional positional parameters declared?
  options:
    - "{int x}"
    - (int x)?
    - optional int x
    - "[int x]"
  correctIndex: 3
  explanation: Square brackets `[int x]` denote an optional positional parameter; `{int x}` denotes an optional named one.
- id: q2
  question: What does `required` do in a named parameter?
  options:
    - Forces the caller to supply it
    - Makes it positional
    - Makes it nullable
    - Marks it as const
  correctIndex: 0
  explanation: "`required` removes the optional-ness of a named parameter, so the analyzer errors if the call site omits it."
- id: q3
  question: Default values for parameters must be...
  options:
    - Nullable
    - Compile-time constants
    - Marked with `late`
    - Of type dynamic
  correctIndex: 1
  explanation: Defaults are inlined at the call site, so they must be evaluable at compile time — `int x = 5` is fine, `DateTime d = DateTime.now()` is not.
- id: q4
  question: What does an arrow function (`=>`) do?
  options:
    - Declares an async function
    - Throws an arrow exception
    - Returns the expression on the right
    - Lazily evaluates the body
  correctIndex: 2
  explanation: "`expr => value` is shorthand for `{ return value; }`; it must yield a value (or `void`) compatible with the return type."
- id: q5
  question: Closures in Dart capture variables...
  options:
    - By value (snapshot at creation)
    - By deep-copy
    - Only if marked `final`
    - By reference (see later mutations)
  correctIndex: 3
  explanation: Dart closures capture variables by reference, so mutations after the closure is created remain visible to the closure.
- id: q6
  question: Which typedef syntax is preferred in modern Dart?
  options:
    - typedef IntFn = int Function(int);
    - typedef int IntFn(int x);
    - type IntFn = Function;
    - alias IntFn = int->int;
  correctIndex: 0
  explanation: The modern form `typedef Name = Signature;` reads naturally and works for any function type, including generics.
- id: q7
  question: What does `Function` (with no args) represent?
  options:
    - An empty function
    - The supertype of all function objects
    - A function that returns void
    - A generic function
  correctIndex: 1
  explanation: "`Function` is the top type for function objects; every function is assignable to `Function`, but you lose static type info on the parameters."
- id: q8
  question: Which is a valid higher-order function call?
  options:
    - map(fn, list)
    - list->map(fn)
    - list.map(fn)
    - apply(map, list, fn)
  correctIndex: 2
  explanation: "`Iterable.map` takes a function and returns a lazy `Iterable`; call it as `list.map(fn)` and materialize with `.toList()`."
- id: q9
  question: What's the issue with `int f() => print('hi');`?
  options:
    - print is undefined
    - Arrow functions cannot call print
    - Nothing — it prints 'hi' and returns 0
    - print returns void, not int — type error
  correctIndex: 3
  explanation: "`print` returns `void`; an arrow function's expression type must be assignable to the declared return type, so `int` rejects `void`."
- id: q10
  question: Which captures the loop variable by snapshot?
  options:
    - for (var i...) { final j = i; fns.add(() => j); }
    - fns.add(() => i);
    - for (var i...) fns.add(() => i);
    - for (var i...) fns.add(() => i+0);
  correctIndex: 0
  explanation: Copying `i` to a `final j` declared inside the loop body creates a fresh binding per iteration, so each closure snapshots its own `j`.
```

