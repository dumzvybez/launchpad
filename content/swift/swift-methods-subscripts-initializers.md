---
slug: swift-methods-subscripts-initializers
id: swift-10
track: swift
order: 10
title: Methods, Subscripts, and Initializers
description: Define methods, subscripts, and initializers on structs and classes, including designated vs convenience initializers, required initializers, and `init?`/`init!`.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0&t=540s
whyItMatters: Define methods, subscripts, and initializers on structs and classes, including designated vs convenience initializers, required initializers, and `init?`/`init!`.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Methods, Subscripts, and Initializers

## Methods, Subscripts, and Initializers

### Why It Matters

Define methods, subscripts, and initializers on structs and classes, including designated vs convenience initializers, required initializers, and `init?`/`init!`.

Define methods, subscripts, and initializers on structs and classes, including designated vs convenience initializers, required initializers, and `init?`/`init!`.

### Prerequisites

- Stage 8: Structs and Classes
- Stage 9: Properties

### Topics

- Instance methods, `self`, `mutating`
- Type methods (`static func`, `class func`)
- Subscripts: `subscript(index) -> Element`
- Multi-parameter subscripts
- Memberwise initializers (structs)
- Designated and convenience initializers (classes)
- Initializer delegation
- `required init` and `init?(coder:)` for `NSCoding`/`Decodable`
- Failable initializers (`init?`) and throwing initializers (`init() throws`)
- Default initializer vs memberwise initializer

### Key Concepts

- Classes have two kinds of initializers: designated (the primary init that sets all stored properties) and convenience (delegates to another init).
- `init` must set every non-optional stored property before returning; optional properties default to nil.
- A `required init` forces every subclass to implement that initializer, enabling polymorphic construction (used by `Decodable` and `NSCoding`).
- Failable initializers (`init?`) return `nil` to signal failure; the caller gets an optional.
- Subscripts are syntactic sugar for `object[at: x]` access; you can define them with any parameter types and any number of parameters.

```swift
struct Person {
    let id: UUID
    var name: String
    // Memberwise init synthesized: Person(id:name:)

    init(id: UUID = UUID(), name: String) {
        self.id = id
        self.name = name
    }
}
```
Caption: Memberwise and custom init

### Common Pitfalls

- Calling a method on `self` in a class init before `super.init()` — illegal; the object isn't fully constructed yet.
- Forgetting that `convenience init` must delegate to another init on the same class (not call `super.init` directly) — compile error.
- Defining a custom init on a struct and losing the memberwise init — once you write any custom init, Swift stops synthesizing the memberwise one. Add `extension` to keep both.
- Marking `required` on an init and forgetting to implement it in a subclass — compile error; the subclass must reimplement.
- Failing to set a non-optional stored property in `init` — the compiler errors: "returned from initializer without initializing all stored properties". Add a default or assign in init.

### Real-World Applications

- Apple's UIKit uses `init(coder:)` as a `required init` so `UIViewController` subclasses can be loaded from storyboards; failing to implement it is a common storyboard crash.
- LinkedIn's networking models conform to `Decodable` via `required init(from:)`, allowing the JSON decoder to polymorphically construct them.
- Airbnb uses custom subscripts on its Epoxy data models for ergonomic section/item access (`section[0][3]`).
- Things 3 uses convenience initializers to provide sensible defaults (e.g. `Task(titled:)` calls `Task(title:dueDate:tags:notes:)` with defaults).

### Interview Questions

- 1. What's the difference between a designated and a convenience initializer? — Designated inits set every stored property and call a superclass designated init; convenience inits delegate to another init on the same class.
- 2. Why does defining a custom init on a struct remove the memberwise init? — Swift synthesizes the memberwise init only if you define no custom inits; once you write one, the compiler assumes you want full control.
- 3. What does `required init` mean? — Every direct subclass must implement it, enabling polymorphic construction (used by `Decodable` and `NSCoding`).
- 4. What's a failable initializer (`init?`)? — An initializer that can return `nil` to signal failure, producing an optional instance.
- 5. Can a subclass omit a `required init`? — No; if the parent marks an init `required`, the subclass must implement it (often satisfied via inheritance if the subclass doesn't define any new designated inits).

### Mini Project

Build a Sparse 2D Matrix: A `SparseMatrix` struct with `subscript(row:col:)` that lazily stores non-zero values in a `Dictionary<(Int,Int), Double>`. Suggested approach:
  - Use a `Dictionary` keyed by a tuple-like `struct Index: Hashable`
  - Implement `subscript` get/set returning 0 for missing keys
  - Add `init(rows:cols:)` and a `count` of non-zero entries
  - Add a `convenience init` (via extension) that takes a literal `[[Double]]`
  - Verify that `matrix[5,5] = 9.0` then `print(matrix[5,5])` returns 9.0

### Exercises

1. Write `struct Point` with a custom init that accepts a string `"3,4"` and parses to `(3,4)`.
2. Add a `convenience init` to a class that delegates to its designated init with defaults.
3. Write a `subscript(safe index: Int) -> Element?` on a `Collection` extension that returns nil out of bounds.
4. Define `struct User` with a failable `init?(email:)` that returns nil on invalid emails.
5. Add a `required init(from:)` to a Codable class and decode it from JSON.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What must a designated initializer do that a convenience init doesn't?
9. A) Be public
10. B) Set all stored properties and call a super designated init (*)
11. C) Take no parameters
12. D) Be final
13. Explanation: Designated inits are the "primary" init: they set every stored property and (in classes) delegate up to the superclass's designated init. Convenience inits delegate sideways.
14. Q2: What happens to the memberwise init when you write a custom init on a struct?
15. A) Nothing
16. B) The memberwise init becomes internal
17. C) The memberwise init is no longer synthesized (*)
18. D) Compile error
19. Explanation: Swift synthesizes the memberwise init only when no custom init is defined; once you add one, the compiler stops synthesizing. Add the custom init in an extension to keep the memberwise init.
20. Q3: What does `required init` enforce?
21. A) The init is called automatically
22. B) The init is final
23. C) The init is private
24. D) Every direct subclass must implement it (*)
25. Explanation: `required` propagates the requirement to all subclasses, enabling polymorphic construction (e.g., `Decodable`'s `init(from:)`).
26. Q4: What does `init?` return on failure?
27. A) nil, producing an optional instance (*)
28. B) A default value
29. C) Throws
30. D) A fatal error
31. Explanation: Failable initializers (`init?`) return `nil` to signal failure; the result type is `Self?`. `init!` produces an implicitly unwrapped optional.
32. Q5: How does `subscript` differ from a method?
33. A) It can't take parameters
34. B) It enables `[index]` syntax at call site (*)
35. C) It's always mutating
36. D) It can't return a value
37. Explanation: Subscripts are syntactic sugar for indexed access; `m[i, j]` is shorthand for `m.subscript(i, j)`.
38. Q6: Why does UIKit's `UIViewController` require `init(coder:)`?
39. A) For unit tests
40. B) For ARC
41. C) So storyboards/XIBs can polymorphically construct subclasses (*)
42. D) For memory safety
43. Explanation: Storyboards instantiate view controllers via `NSCoding`, which requires `init(coder:)`; marking it `required` ensures subclasses conform.
44. Q7: What must be true before calling `super.init` in a subclass?
45. A) `self` must be returned
46. B) Nothing
47. C) The object must be deallocated
48. D) All subclass properties must be initialized (*)
49. Explanation: Swift requires every property introduced by the subclass to be initialized before delegating up to `super.init`, ensuring the object is fully formed before super's init runs.
50. Q8: What's the difference between `init?` and `init!`?
51. A) `init?` returns `Self?`; `init!` returns `Self!` (IUO) (*)
52. B) `init?` is async
53. C) `init!` throws
54. D) They're identical
55. Explanation: Both are failable; `init?` yields a regular optional, `init!` yields an implicitly unwrapped optional that auto-unwraps on use (trapping if nil).
56. Q9: Can a convenience init call `super.init` directly?
57. A) Yes
58. B) No — it must delegate to another init on the same class (*)
59. C) Only in structs
60. D) Only if final
61. Explanation: Convenience inits delegate sideways (to a designated init on the same class), which then delegates up. Calling `super.init` from a convenience init is a compile error.
62. Q10: What happens if you forget to set a non-optional stored property in `init`?
63. A) Property defaults to nil and crashes on access
64. B) Runtime warning
65. C) Compile error: returned without initializing all stored properties (*)
66. D) Nothing
67. Explanation: Swift requires every non-optional stored property to be initialized before `init` returns; the compiler enforces this statically.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What must a designated initializer do that a convenience init doesn't?
  options:
    - Be public
    - Set all stored properties and call a super designated init
    - Take no parameters
    - Be final
  correctIndex: 1
  explanation: "Designated inits are the \"primary\" init: they set every stored property and (in classes) delegate up to the superclass's designated init. Convenience inits delegate sideways."
- id: q2
  question: What happens to the memberwise init when you write a custom init on a struct?
  options:
    - Nothing
    - The memberwise init becomes internal
    - The memberwise init is no longer synthesized
    - Compile error
  correctIndex: 2
  explanation: Swift synthesizes the memberwise init only when no custom init is defined; once you add one, the compiler stops synthesizing. Add the custom init in an extension to keep the memberwise init.
- id: q3
  question: What does `required init` enforce?
  options:
    - The init is called automatically
    - The init is final
    - The init is private
    - Every direct subclass must implement it
  correctIndex: 3
  explanation: "`required` propagates the requirement to all subclasses, enabling polymorphic construction (e.g., `Decodable`'s `init(from:)`)."
- id: q4
  question: What does `init?` return on failure?
  options:
    - nil, producing an optional instance
    - A default value
    - Throws
    - A fatal error
  correctIndex: 0
  explanation: Failable initializers (`init?`) return `nil` to signal failure; the result type is `Self?`. `init!` produces an implicitly unwrapped optional.
- id: q5
  question: How does `subscript` differ from a method?
  options:
    - It can't take parameters
    - It enables `[index]` syntax at call site
    - It's always mutating
    - It can't return a value
  correctIndex: 1
  explanation: Subscripts are syntactic sugar for indexed access; `m[i, j]` is shorthand for `m.subscript(i, j)`.
- id: q6
  question: Why does UIKit's `UIViewController` require `init(coder:)`?
  options:
    - For unit tests
    - For ARC
    - So storyboards/XIBs can polymorphically construct subclasses
    - For memory safety
  correctIndex: 2
  explanation: Storyboards instantiate view controllers via `NSCoding`, which requires `init(coder:)`; marking it `required` ensures subclasses conform.
- id: q7
  question: What must be true before calling `super.init` in a subclass?
  options:
    - "`self` must be returned"
    - Nothing
    - The object must be deallocated
    - All subclass properties must be initialized
  correctIndex: 3
  explanation: Swift requires every property introduced by the subclass to be initialized before delegating up to `super.init`, ensuring the object is fully formed before super's init runs.
- id: q8
  question: What's the difference between `init?` and `init!`?
  options:
    - "`init?` returns `Self?`; `init!` returns `Self!` (IUO)"
    - "`init?` is async"
    - "`init!` throws"
    - They're identical
  correctIndex: 0
  explanation: Both are failable; `init?` yields a regular optional, `init!` yields an implicitly unwrapped optional that auto-unwraps on use (trapping if nil).
- id: q9
  question: Can a convenience init call `super.init` directly?
  options:
    - Yes
    - No — it must delegate to another init on the same class
    - Only in structs
    - Only if final
  correctIndex: 1
  explanation: Convenience inits delegate sideways (to a designated init on the same class), which then delegates up. Calling `super.init` from a convenience init is a compile error.
- id: q10
  question: What happens if you forget to set a non-optional stored property in `init`?
  options:
    - Property defaults to nil and crashes on access
    - Runtime warning
    - "Compile error: returned without initializing all stored properties"
    - Nothing
  correctIndex: 2
  explanation: Swift requires every non-optional stored property to be initialized before `init` returns; the compiler enforces this statically.
```

