---
slug: swift-inheritance-overriding-polymorphism
id: swift-11
track: swift
order: 11
title: Inheritance, Overriding, and Polymorphism
description: Use class inheritance, override methods and properties, leverage polymorphism via dynamic dispatch, and learn the `final` keyword to opt out of dispatch overhead.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0&t=600s
whyItMatters: Use class inheritance, override methods and properties, leverage polymorphism via dynamic dispatch, and learn the `final` keyword to opt out of dispatch overhead.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Inheritance, Overriding, and Polymorphism

## Inheritance, Overriding, and Polymorphism

### Why It Matters

Use class inheritance, override methods and properties, leverage polymorphism via dynamic dispatch, and learn the `final` keyword to opt out of dispatch overhead.

Use class inheritance, override methods and properties, leverage polymorphism via dynamic dispatch, and learn the `final` keyword to opt out of dispatch overhead.

### Prerequisites

- Stage 8: Structs and Classes
- Stage 9: Properties
- Stage 10: Methods, Subscripts, and Initializers

### Topics

- Single inheritance and the `AnyObject` root
- Overriding methods, properties, and property observers
- `super` for delegation
- `final` to prevent further overriding (and enable devirtualization)
- `static` vs `class` for type methods (class can be overridden)
- Polymorphism via dynamic dispatch
- Preventing inheritance: `final class`
- Subscript and init overrides
- `dynamic` keyword for Obj-C dispatch (rare)
- When to prefer composition over inheritance

### Key Concepts

- Swift classes use single inheritance; the implicit root is `AnyObject` (a protocol) — there's no universal `Object` base class.
- Methods on classes are dynamically dispatched by default, allowing subclasses to override them; `final` enables static dispatch and inlining.
- Property observers (`willSet`/`didSet`) added in a subclass fire in addition to those defined in the parent.
- `final class` blocks subclassing entirely; `final func` blocks overriding that method.
- Swift favors composition + protocols over deep inheritance hierarchies; classes that work with value types can't even be subclassed.

```swift
class Shape {
    var area: Double { 0 }
    func describe() -> String { "Shape with area \(area)" }
}

class Circle: Shape {
    let radius: Double
    init(radius: Double) { self.radius = radius }
    override var area: Double { .pi * radius * radius }
    override func describe() -> String { "Circle r=\(radius), \(super.describe())" }
}

let s: Shape = Circle(radius: 2)
print(s.describe())        // polymorphic dispatch to Circle.describe
print(s.area)              // dispatches to Circle.area
```
Caption: Inheritance and override

### Common Pitfalls

- Designing deep inheritance hierarchies (4+ levels) — Swift favors protocol-oriented design; deep hierarchies become brittle and hard to test.
- Forgetting `override` — the compiler errors; you must explicitly mark overrides so it's clear you intended to override (and the compiler can detect typos).
- Overriding a stored property as stored — not allowed; you can only override computed properties or add observers via `override var`.
- Calling `super.init` after using `self` — illegal; `self` is unavailable until after super init completes.
- Adding `final` everywhere for "performance" without measuring — modern Swift devirtualization is excellent; `final` is best reserved as an API contract, not a micro-optimization.

### Real-World Applications

- Apple's UIKit uses inheritance heavily: `UIView > UIControl > UIButton`, with `draw(_:)` as the canonical override point.
- LinkedIn layers `UIViewController > BaseVC > AuthenticatedVC > ProfileVC` — three levels of override — but recent Swift code prefers composition via coordinators.
- Lyft's view-model hierarchy uses `final` classes with protocol conformance, avoiding inheritance entirely in the Swift-first codebase.
- Things 3 uses `final` on model classes to lock the API and allow inlining of hot accessors during rendering.

### Interview Questions

- 1. What's the root class of all Swift classes? — There is no universal `Object`; the implicit supertype is the `AnyObject` protocol.
- 2. What does `final` do, and why might you use it? — Prevents overriding/subclassing; enables static dispatch and inlining. Use it as an API contract or after profiling shows dispatch overhead.
- 3. Can you override a stored property? — No; you can override the getter/setter of a computed property, or add observers to an inherited stored property via `override var`.
- 4. What's the difference between `static func` and `class func`? — `class func` can be overridden in subclasses; `static func` is final and cannot.
- 5. When does Swift prefer composition over inheritance? — Almost always; protocol-oriented programming with value types is the Swift idiom, and classes that need value-type fields can't be subclassed anyway.

### Mini Project

Build a Shape Hierarchy with Polymorphism: A `Shape` base class with `area` and `perimeter`, three subclasses (`Circle`, `Rectangle`, `Triangle`), and a `totalArea(of shapes: [Shape])` function that dispatches polymorphically. Suggested approach:
  - Define `class Shape` with `var area: Double { 0 }` and `var perimeter: Double { 0 }`
  - Subclass with `override var` for each shape
  - Write `func totalArea(_ shapes: [Shape]) -> Double { shapes.reduce(0) { $0 + $1.area } }`
  - Mark the hierarchy `final` after testing, observe compile error preventing further subclassing
  - Refactor to a `protocol Shape` with structs to show the Swift-idiomatic alternative

### Exercises

1. Write `class Animal { func speak() -> String { "?" } }` and a `Dog` subclass that overrides `speak`.
2. Add a `final func name()` to `Animal` and confirm `Dog` cannot override it.
3. Add a stored `var age: Int` to `Animal` with `didSet`; in `Dog`, override with `didSet` to log both observers firing.
4. Mark `Animal` as `final class` and observe the error when trying to subclass.
5. Rewrite the hierarchy using a `protocol Animal` and structs, comparing the two designs.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the root class of all Swift classes?
9. A) NSObject
10. B) Object
11. C) There's no universal root — `AnyObject` is a protocol (*)
12. D) AnyClass
13. Explanation: Swift has no universal base class; `AnyObject` is a protocol that all classes implicitly conform to. NSObject is the Obj-C root.
14. Q2: What does `final` do?
15. A) Marks a class as deallocated
16. B) Forces ARC
17. C) Makes a property constant
18. D) Prevents overriding/subclassing and enables static dispatch (*)
19. Explanation: `final` blocks subclassing (on classes) or method/property override, allowing the compiler to devirtualize and inline.
20. Q3: Can you override a stored property with another stored property?
21. A) No — only computed properties or by adding observers via `override var` (*)
22. B) Yes
23. C) Only in classes
24. D) Only with `dynamic`
25. Explanation: You cannot override storage layout; you can override the accessors of a computed property, or attach observers to an inherited stored property using `override var`.
26. Q4: What's the difference between `static func` and `class func`?
27. A) None
28. B) `class func` can be overridden; `static func` is final (*)
29. C) `static func` is for structs
30. D) `class func` is async
31. Explanation: `class func` is overridable in subclasses; `static func` is final (cannot be overridden).
32. Q5: When you override `var area` with `didSet` in a subclass, do the parent's observers also fire?
33. A) No, only the subclass's
34. B) Only the parent's
35. C) Yes, both fire in order (parent then subclass) (*)
36. D) Compile error
37. Explanation: Overriding an inherited property to add observers stacks them — parent observers fire first, then subclass observers.
38. Q6: Why must `override` be explicit in Swift?
39. A) Performance
40. B) For threading
41. C) For ARC
42. D) To catch typos and signal intent; the compiler errors if no parent method matches (*)
43. Explanation: Explicit `override` makes intent clear and lets the compiler reject accidental shadowing (e.g. typo'd name) as an error.
44. Q7: Which is the Swift-idiomatic alternative to deep inheritance?
45. A) Composition with protocols and value types (*)
46. B) More inheritance
47. C) Macros
48. D) Global functions
49. Explanation: Swift favors protocol-oriented programming: small structs + protocols for shared behavior, rather than deep class hierarchies.
50. Q8: What's the rule for calling `super.init`?
51. A) Must be the first statement of init
52. B) Must be called after initializing subclass properties, before using `self` (*)
53. C) Optional
54. D) Only in convenience init
55. Explanation: Swift requires all subclass-introduced properties to be set before delegating up via `super.init`, and `self` cannot be used until super init completes.
56. Q9: Can a `final class` be subclassed?
57. A) Yes
58. B) Only in tests
59. C) No — `final class` blocks subclassing entirely (*)
60. D) Only with `dynamic`
61. Explanation: `final class` prevents any subclassing; the compiler rejects `class Sub: FinalClass {}`.
62. Q10: What does `dynamic` keyword do (rare)?
63. A) Forces ARC
64. B) Makes a property lazy
65. C) Enables async
66. D) Routes dispatch through Obj-C runtime for KVO/KVC interop (*)
67. Explanation: `dynamic` marks a declaration for Obj-C runtime dispatch, enabling dynamic features like KVO. It's used rarely in pure Swift code.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the root class of all Swift classes?
  options:
    - NSObject
    - Object
    - There's no universal root — `AnyObject` is a protocol
    - AnyClass
  correctIndex: 2
  explanation: Swift has no universal base class; `AnyObject` is a protocol that all classes implicitly conform to. NSObject is the Obj-C root.
- id: q2
  question: What does `final` do?
  options:
    - Marks a class as deallocated
    - Forces ARC
    - Makes a property constant
    - Prevents overriding/subclassing and enables static dispatch
  correctIndex: 3
  explanation: "`final` blocks subclassing (on classes) or method/property override, allowing the compiler to devirtualize and inline."
- id: q3
  question: Can you override a stored property with another stored property?
  options:
    - No — only computed properties or by adding observers via `override var`
    - Yes
    - Only in classes
    - Only with `dynamic`
  correctIndex: 0
  explanation: You cannot override storage layout; you can override the accessors of a computed property, or attach observers to an inherited stored property using `override var`.
- id: q4
  question: What's the difference between `static func` and `class func`?
  options:
    - None
    - "`class func` can be overridden; `static func` is final"
    - "`static func` is for structs"
    - "`class func` is async"
  correctIndex: 1
  explanation: "`class func` is overridable in subclasses; `static func` is final (cannot be overridden)."
- id: q5
  question: When you override `var area` with `didSet` in a subclass, do the parent's observers also fire?
  options:
    - No, only the subclass's
    - Only the parent's
    - Yes, both fire in order (parent then subclass)
    - Compile error
  correctIndex: 2
  explanation: Overriding an inherited property to add observers stacks them — parent observers fire first, then subclass observers.
- id: q6
  question: Why must `override` be explicit in Swift?
  options:
    - Performance
    - For threading
    - For ARC
    - To catch typos and signal intent; the compiler errors if no parent method matches
  correctIndex: 3
  explanation: Explicit `override` makes intent clear and lets the compiler reject accidental shadowing (e.g. typo'd name) as an error.
- id: q7
  question: Which is the Swift-idiomatic alternative to deep inheritance?
  options:
    - Composition with protocols and value types
    - More inheritance
    - Macros
    - Global functions
  correctIndex: 0
  explanation: "Swift favors protocol-oriented programming: small structs + protocols for shared behavior, rather than deep class hierarchies."
- id: q8
  question: What's the rule for calling `super.init`?
  options:
    - Must be the first statement of init
    - Must be called after initializing subclass properties, before using `self`
    - Optional
    - Only in convenience init
  correctIndex: 1
  explanation: Swift requires all subclass-introduced properties to be set before delegating up via `super.init`, and `self` cannot be used until super init completes.
- id: q9
  question: Can a `final class` be subclassed?
  options:
    - Yes
    - Only in tests
    - No — `final class` blocks subclassing entirely
    - Only with `dynamic`
  correctIndex: 2
  explanation: "`final class` prevents any subclassing; the compiler rejects `class Sub: FinalClass {}`."
- id: q10
  question: What does `dynamic` keyword do (rare)?
  options:
    - Forces ARC
    - Makes a property lazy
    - Enables async
    - Routes dispatch through Obj-C runtime for KVO/KVC interop
  correctIndex: 3
  explanation: "`dynamic` marks a declaration for Obj-C runtime dispatch, enabling dynamic features like KVO. It's used rarely in pure Swift code."
```

