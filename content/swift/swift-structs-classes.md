---
slug: swift-structs-classes
id: swift-08
track: swift
order: 8
title: Structs and Classes
description: Choose between structs (value types) and classes (reference types), understand the profound difference in copy semantics, and use identity vs equality correctly.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0&t=420s
whyItMatters: Choose between structs (value types) and classes (reference types), understand the profound difference in copy semantics, and use identity vs equality correctly.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Structs and Classes

## Structs and Classes

### Why It Matters

Choose between structs (value types) and classes (reference types), understand the profound difference in copy semantics, and use identity vs equality correctly.

Choose between structs (value types) and classes (reference types), understand the profound difference in copy semantics, and use identity vs equality correctly.

### Prerequisites

- Stage 2: Variables, Types, and Optionals
- Stage 5: Arrays, Sets, and Dictionaries (COW collections)
- Stage 7: Enums and pattern matching

### Topics

- `struct` declaration, memberwise initializers
- `class` declaration, single inheritance, reference semantics
- Value types: copying on assignment, mutation independence
- Reference types: shared identity, aliasing
- `let` on struct (immutable) vs `let` on class (immutable binding, mutable state)
- `==` (Equatable) vs `===` (identity)
- `mutating` methods on structs
- `static` and `class` properties/methods
- When to choose struct vs class (use struct by default)
- Subscripts and computed members (preview)

### Key Concepts

- Structs are value types — assignment copies; mutations to one copy don't affect others.
- Classes are reference types — assignment shares; mutations through any alias are visible everywhere.
- `let s = MyStruct()` makes the struct fully immutable; `let c = MyClass()` only prevents reassigning the binding, not mutating `c`'s properties.
- `===` tests identity (same instance) for classes; `==` tests value equality and must be implemented (synthesized for structs whose fields are `Equatable`).
- Struct methods that mutate `self` must be marked `mutating`; class methods never need this because `self` is a reference.

```swift
struct Point { var x, y: Double }

var p1 = Point(x: 1, y: 2)
var p2 = p1       // copy
p2.x = 99
print(p1.x)       // 1 — p1 unchanged
print(p2.x)       // 99
```
Caption: Struct value semantics

### Common Pitfalls

- Assuming `let` makes a class instance immutable — `let w = Window()` prevents reassigning `w`, but `w.title = "x"` still works because `title` is `var`. Use `let` on properties for true immutability.
- Forgetting `mutating` on a struct method that modifies `self` — compile error: "cannot mutate a value through a non-mutating method".
- Calling a `mutating` method on a `let`-bound struct — fails to compile; bind with `var` first.
- Using `===` on structs — compile error; `===` only works on classes (and AnyObject). Structs have no identity concept, only equality.
- Accidentally sharing state through class properties in concurrent code — class reference types need explicit synchronization (or actor isolation); prefer structs for shared models.

### Real-World Applications

- Apple's Foundation uses structs for `URL`, `Date`, `Data`, and `URLComponents` precisely because their value semantics prevent aliasing bugs in networking stacks.
- SwiftUI's entire data model is structs (`View`, `Color`, `Path`) so the diffing engine can compare old vs new value-typed trees cheaply.
- Lyft uses value-typed model structs for ride requests so concurrent updates don't race on shared mutable state.
- Things 3 uses structs for individual task records so undo/redo is a simple matter of restoring an older value snapshot.

### Interview Questions

- 1. What's the difference between a struct and a class in Swift? — Structs are value types (copy on assign); classes are reference types (share on assign), support inheritance, and use ARC.
- 2. When should you choose a class over a struct? — When you need identity, shared mutable state, inheritance, or Objective-C interop; otherwise prefer structs.
- 3. What does `===` test? — Identity: whether two references point at the same class instance. Structs don't have `===`.
- 4. Why does `let c = MyClass()` still allow mutating `c.title`? — `let` freezes the binding (can't reassign `c`), not the instance's properties; `title` is a `var` on the class.
- 5. Why must struct methods that modify `self` be marked `mutating`? — Because the struct is copied by value; mutating requires writing back to the original binding, which the compiler must permit explicitly.

### Mini Project

Build a Tiny Drawing Canvas: A `Canvas` struct with `pixels: [[Color]]` and `mutating` methods `set(x:y:to:)`, `fill(_:startingAt:)`. Demonstrate that copying a canvas and mutating the copy leaves the original unchanged. Suggested approach:
  - `struct Color: Equatable { let r, g, b: UInt8 }`
  - `struct Canvas { var pixels: [[Color]]; mutating func set(...) }`
  - Implement flood fill with a stack and `mutating func`
  - Copy the canvas, mutate the copy, print both — confirm independence
  - Convert to a class version and show the aliasing difference

### Exercises

1. Write `struct Point` with `var x, y: Double`, copy it, mutate the copy, and confirm the original is unchanged.
2. Write `class Box { var value: Int }`, share it between two variables, mutate one, observe the change in the other.
3. Implement `Equatable` on `struct Point` and verify `==`; try `===` and observe the compile error.
4. Add a `mutating func move(by:)` to Point and demonstrate that calling it on a `let p` fails to compile.
5. Build a class hierarchy `Animal > Dog > Puppy` to confirm single-inheritance; try multiple inheritance and observe the error.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Are structs value types or reference types?
9. A) Reference types
10. B) Depends on fields
11. C) Both
12. D) Value types (*)
13. Explanation: Structs are value types — assignment copies the entire value (with COW for collections), so mutations to one copy don't affect others.
14. Q2: What does `===` test?
15. A) Identity (same instance) for class references (*)
16. B) Value equality
17. C) Type equality
18. D) Hash equality
19. Explanation: `===` returns true if two references point to the same class instance; structs don't support `===` since they have no identity.
20. Q3: Why does `let c = MyClass()` still allow `c.x = 5` if `x` is `var`?
21. A) `let` doesn't apply to classes
22. B) `let` freezes the binding, not the instance's mutable properties (*)
23. C) It's a bug
24. D) `let` is only for value types
25. Explanation: `let c` prevents reassigning `c`, but the class instance's `var` properties remain mutable; use `let` on the property for true immutability.
26. Q4: Why must struct methods that mutate `self` be marked `mutating`?
27. A) Performance
28. B) To allow throwing
29. C) To signal that the method writes back to the binding (value semantics) (*)
30. D) To make it public
31. Explanation: Structs are copied by value; mutation requires writing back to the original binding, which the compiler permits only for `mutating` methods on `var`-bound structs.
32. Q5: What happens if you call `mutating` method on a `let`-bound struct?
33. A) Runtime crash
34. B) Silently no-ops
35. C) Auto-copies
36. D) Compile error (*)
37. Explanation: `let`-bound structs are immutable; the compiler rejects calls to `mutating` methods.
38. Q6: Which supports inheritance in Swift?
39. A) Classes only (*)
40. B) Structs
41. C) Both
42. D) Neither
43. Explanation: Swift classes support single inheritance; structs and enums cannot inherit (they use protocols for shared behavior).
44. Q7: Which is the default choice for new data types in Swift?
45. A) Class
46. B) Struct (*)
47. C) Enum
48. D) Actor
49. Explanation: Apple's guidance and the Swift community prefer structs by default; reach for classes only when you need identity or inheritance.
50. Q8: What's the cardinality of a struct with fields of types A and B?
51. A) |A| + |B|
52. B) |A| - |B|
53. C) |A| × |B| (product) (*)
54. D) |A| ^ |B|
55. Explanation: Structs are product types; the count of distinct values is the product of each field's count.
56. Q9: What does Swift's memberwise initializer for `struct Point { var x: Double; var y: Double }` look like?
57. A) `Point()` with defaults
58. B) `Point(_ x: Double, _ y: Double)`
59. C) `init(x, y)` no labels
60. D) `Point(x: Double, y: Double)` (*)
61. Explanation: The synthesized memberwise init uses each property's external label: `Point(x:y:)`.
62. Q10: When you assign a struct to a new variable, when does the copy happen?
63. A) Immediately on assignment (logical copy; storage shared via COW) (*)
64. B) Only when mutated (COW)
65. C) Never — always shared
66. D) At scope exit
67. Explanation: Logically the copy is immediate; physically, COW defers the buffer copy until a mutation, but the two bindings are independent from the start.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Are structs value types or reference types?
  options:
    - Reference types
    - Depends on fields
    - Both
    - Value types
  correctIndex: 3
  explanation: Structs are value types — assignment copies the entire value (with COW for collections), so mutations to one copy don't affect others.
- id: q2
  question: What does `===` test?
  options:
    - Identity (same instance) for class references
    - Value equality
    - Type equality
    - Hash equality
  correctIndex: 0
  explanation: "`===` returns true if two references point to the same class instance; structs don't support `===` since they have no identity."
- id: q3
  question: Why does `let c = MyClass()` still allow `c.x = 5` if `x` is `var`?
  options:
    - "`let` doesn't apply to classes"
    - "`let` freezes the binding, not the instance's mutable properties"
    - It's a bug
    - "`let` is only for value types"
  correctIndex: 1
  explanation: "`let c` prevents reassigning `c`, but the class instance's `var` properties remain mutable; use `let` on the property for true immutability."
- id: q4
  question: Why must struct methods that mutate `self` be marked `mutating`?
  options:
    - Performance
    - To allow throwing
    - To signal that the method writes back to the binding (value semantics)
    - To make it public
  correctIndex: 2
  explanation: Structs are copied by value; mutation requires writing back to the original binding, which the compiler permits only for `mutating` methods on `var`-bound structs.
- id: q5
  question: What happens if you call `mutating` method on a `let`-bound struct?
  options:
    - Runtime crash
    - Silently no-ops
    - Auto-copies
    - Compile error
  correctIndex: 3
  explanation: "`let`-bound structs are immutable; the compiler rejects calls to `mutating` methods."
- id: q6
  question: Which supports inheritance in Swift?
  options:
    - Classes only
    - Structs
    - Both
    - Neither
  correctIndex: 0
  explanation: Swift classes support single inheritance; structs and enums cannot inherit (they use protocols for shared behavior).
- id: q7
  question: Which is the default choice for new data types in Swift?
  options:
    - Class
    - Struct
    - Enum
    - Actor
  correctIndex: 1
  explanation: Apple's guidance and the Swift community prefer structs by default; reach for classes only when you need identity or inheritance.
- id: q8
  question: What's the cardinality of a struct with fields of types A and B?
  options:
    - "|A| + |B|"
    - "|A| - |B|"
    - "|A| × |B| (product)"
    - "|A| ^ |B|"
  correctIndex: 2
  explanation: Structs are product types; the count of distinct values is the product of each field's count.
- id: q9
  question: "What does Swift's memberwise initializer for `struct Point { var x: Double; var y: Double }` look like?"
  options:
    - "`Point()` with defaults"
    - "`Point(_ x: Double, _ y: Double)`"
    - "`init(x, y)` no labels"
    - "`Point(x: Double, y: Double)`"
  correctIndex: 3
  explanation: "The synthesized memberwise init uses each property's external label: `Point(x:y:)`."
- id: q10
  question: When you assign a struct to a new variable, when does the copy happen?
  options:
    - Immediately on assignment (logical copy; storage shared via COW)
    - Only when mutated (COW)
    - Never — always shared
    - At scope exit
  correctIndex: 0
  explanation: Logically the copy is immediate; physically, COW defers the buffer copy until a mutation, but the two bindings are independent from the start.
```

