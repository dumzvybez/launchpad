---
slug: swift-protocols-protocol-oriented-programming
id: swift-12
track: swift
order: 12
title: Protocols and Protocol-Oriented Programming
description: Define protocols, conform types to them, use protocol extensions for default behavior, and embrace protocol-oriented programming — Swift's signature design philosophy.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0&t=660s
whyItMatters: Define protocols, conform types to them, use protocol extensions for default behavior, and embrace protocol-oriented programming — Swift's signature design philosophy.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Protocols and Protocol-Oriented Programming

## Protocols and Protocol-Oriented Programming

### Why It Matters

Define protocols, conform types to them, use protocol extensions for default behavior, and embrace protocol-oriented programming — Swift's signature design philosophy.

Define protocols, conform types to them, use protocol extensions for default behavior, and embrace protocol-oriented programming — Swift's signature design philosophy.

### Prerequisites

- Stage 7: Enums and Pattern Matching
- Stage 8: Structs and Classes
- Stage 11: Inheritance and Polymorphism

### Topics

- Protocol declaration and conformance
- Property and method requirements
- Initializer requirements (`init`)
- Protocol extensions with default implementations
- Protocol inheritance and composition (`&`)
- `Any` and `AnyObject` constraints
- `some` (opaque types) and `any` (existential types)
- Conditional conformance (`extension Array: Equatable where Element: Equatable`)
- Protocol-oriented programming (POP) — value types + protocols
- Retroactive conformance and conventions

### Key Concepts

- A protocol is a contract: types that conform must provide its required members.
- Protocol extensions provide default implementations, enabling mix-in behavior without inheritance.
- `some Protocol` is an opaque type: "some specific conforming type, hidden from the caller"; `any Protocol` is an existential: "any type conforming, dispatched dynamically".
- Swift's standard library is built on POP: `Equatable`, `Hashable`, `Comparable`, `Sequence`, `Collection`, `Codable`.
- Conditional conformance allows `Array<Int>` to be `Equatable` only when `Int` is, automatically extending to any future element type.

```swift
protocol Describable {
    var description: String { get }
}

extension Describable {
    var description: String { "Describable(\(Self.self))" }  // default
}

struct User: Describable { let name: String }
print(User(name: "Ada").description)  // default impl used

struct Point: Describable {
    let x, y: Double
    var description: String { "(\(x), \(y))" }  // override default
}
```
Caption: Protocol with extension default

### Common Pitfalls

- Using `any Protocol` everywhere instead of `some Protocol` — existentials add runtime dispatch overhead and obscure the concrete type; prefer `some` (or generics) when you can.
- Forgetting that protocol extensions are statically dispatched — if a conforming type overrides a default in its own extension, polymorphic calls still hit the protocol's default unless you re-declare the method as a protocol requirement.
- Retroactive conformance collisions — adding `Equatable` to a third-party type from two modules triggers "ambiguous conformance" errors at link time.
- Defining `Self`-referential protocols and trying to use them as existentials — many standard library protocols (`Equatable`, `Hashable`) have `Self` constraints and only work as generic constraints, not as existential types.
- Adding stored properties to protocols — protocols can only require properties, not declare them; concrete conforming types provide the storage.

### Real-World Applications

- Apple's standard library relies on `Equatable`, `Hashable`, `Comparable`, `Codable`, and `Sequence` — all protocols with default-implemented extensions.
- SwiftUI views are `some View` opaque types, allowing the compiler to know the concrete type for diffing while hiding it from callers.
- LinkedIn abstracts its networking layer behind a `protocol APIClient`, with a real `URLSession`-backed client and a mock client for tests.
- Lyft uses a `protocol RideProvider` with default-implemented helpers so test doubles can swap in fake providers without subclassing.

### Interview Questions

- 1. What's the difference between `some Protocol` and `any Protocol`? — `some` is an opaque type (a single concrete type hidden from caller); `any` is an existential (any conforming type, dynamic dispatch).
- 2. Why does protocol extension dispatch surprise people? — Methods added only in an extension (not in the protocol requirement list) are statically dispatched, so they don't override polymorphically.
- 3. Can you add stored properties in a protocol? — No; protocols declare requirements only. Concrete types provide storage.
- 4. What is conditional conformance? — Conforming a generic type to a protocol only when its type parameters conform (e.g. `Array: Equatable where Element: Equatable`).
- 5. What's the difference between protocol inheritance and protocol composition? — Inheritance (`protocol A: B`) makes A refine B; composition (`A & B`) combines multiple protocols into a single type bound without defining a new protocol.

### Mini Project

Build a Repository Pattern: A `protocol Repository<Item>` (associatedtype) with `get(id:)`, `all()`, `save(_:)`, default-implemented `map<T>(_:)` helper, plus two concrete repos: an in-memory `ArrayRepository` and a `DictionaryRepository`. Suggested approach:
  - `protocol Repository { associatedtype Item: Identifiable; func all() -> [Item] }`
  - `extension Repository { func map<T>(_ transform: (Item) -> T) -> [T] { all().map(transform) } }`
  - Implement `ArrayRepository<Item>` and `DictionaryRepository<Item>`
  - Write a generic `func summarize<R: Repository>(_ r: R)` using `some` return
  - Demonstrate that overriding the default `map` in a conforming type still uses the protocol default when called via the existential

### Exercises

1. Define `protocol Greetable { func greet() -> String }` and conform `User` and `Robot`.
2. Add a default `greet` implementation via protocol extension that returns "Hello, \(Self.self)".
3. Write a function taking `some Greetable` and another taking `any Greetable`; explain the difference.
4. Add conditional conformance: `extension Array: CustomStringConvertible where Element: CustomStringConvertible`.
5. Demonstrate the static-dispatch trap: define a protocol with a default `describe()`, override it in a struct's extension, call via the protocol type, observe the default.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the difference between `some Protocol` and `any Protocol`?
9. A) They're the same
10. B) `some` is async; `any` is sync
11. C) `some` is for classes only
12. D) `some` is an opaque single concrete type; `any` is an existential with dynamic dispatch (*)
13. Explanation: `some` hides one concrete type from the caller (static dispatch); `any` allows any conforming type at runtime (existential, dynamic dispatch).
14. Q2: Can a protocol declare stored properties?
15. A) No — protocols declare requirements only; conforming types provide storage (*)
16. B) Yes
17. C) Only `let` properties
18. D) Only via @propertyWrapper
19. Explanation: Protocols specify "what conforming types must provide"; they cannot declare stored state, only property requirements (`var x: Int { get }`).
20. Q3: Why do protocol extension methods sometimes fail to dispatch polymorphically?
21. A) Bug in the compiler
22. B) Methods only in extensions (not in the protocol's requirement list) are statically dispatched (*)
23. C) They're always dispatched dynamically
24. D) Async only
25. Explanation: Extension methods not declared in the protocol itself are statically dispatched to the declared type; to get polymorphism, declare the method as a protocol requirement.
26. Q4: What is conditional conformance?
27. A) Conforming at runtime
28. B) Optional conformance
29. C) Conforming a generic type to a protocol only when type parameters conform (*)
30. D) A typealias
31. Explanation: `extension Array: Equatable where Element: Equatable` makes `Array<T>` Equatable only when `T` is, automatically.
32. Q5: What does `protocol A: B` mean?
33. A) A inherits from class B
34. B) A is a subclass of B
35. C) A wraps B
36. D) A refines B; conforming to A also conforms to B (*)
37. Explanation: Protocols can inherit other protocols; any type conforming to A must also satisfy B's requirements.
38. Q6: What is `Named & Aged`?
39. A) A protocol composition — any type conforming to both Named and Aged (*)
40. B) A new protocol
41. C) A class
42. D) A typealias
43. Explanation: `&` composes protocols inline into an anonymous composition; useful when you don't want to declare a new protocol just for a function signature.
44. Q7: What's "protocol-oriented programming" in Swift?
45. A) Using classes everywhere
46. B) Modeling with value types + protocols + extensions instead of class hierarchies (*)
47. C) Using reflection
48. D) Functional programming
49. Explanation: POP emphasizes structs/enums + protocol abstractions + default-implemented extensions, avoiding deep class hierarchies.
50. Q8: Can you conform a type to a protocol from a different module retroactively?
51. A) No
52. B) Only via subclassing
53. C) Yes, via an extension in your module (*)
54. D) Only if the type is final
55. Explanation: Retroactive conformance (extending foreign types to conform to a protocol) is allowed; risks include "ambiguous conformance" if two modules do it.
56. Q9: Why is `Equatable` problematic as an existential (`any Equatable`)?
57. A) It isn't
58. B) It's too slow
59. C) It's a struct
60. D) It has a `Self` type, which is unknowable for existentials; you can only use it as a generic constraint (*)
61. Explanation: Protocols with `Self` or associated types (PATs) can't be used as plain existentials in older Swift; Swift 5.7+ allows `any Equatable` but comparisons remain limited.
62. Q10: What does adding a default implementation in a protocol extension enable?
63. A) Mix-in behavior without inheritance (*)
64. B) Stored state
65. C) Threading
66. D) Reflection
67. Explanation: Default-implemented protocol methods let conforming types opt in to behavior for free, providing reuse without class inheritance.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the difference between `some Protocol` and `any Protocol`?
  options:
    - They're the same
    - "`some` is async; `any` is sync"
    - "`some` is for classes only"
    - "`some` is an opaque single concrete type; `any` is an existential with dynamic dispatch"
  correctIndex: 3
  explanation: "`some` hides one concrete type from the caller (static dispatch); `any` allows any conforming type at runtime (existential, dynamic dispatch)."
- id: q2
  question: Can a protocol declare stored properties?
  options:
    - No — protocols declare requirements only; conforming types provide storage
    - Yes
    - Only `let` properties
    - Only via @propertyWrapper
  correctIndex: 0
  explanation: 'Protocols specify "what conforming types must provide"; they cannot declare stored state, only property requirements (`var x: Int { get }`).'
- id: q3
  question: Why do protocol extension methods sometimes fail to dispatch polymorphically?
  options:
    - Bug in the compiler
    - Methods only in extensions (not in the protocol's requirement list) are statically dispatched
    - They're always dispatched dynamically
    - Async only
  correctIndex: 1
  explanation: Extension methods not declared in the protocol itself are statically dispatched to the declared type; to get polymorphism, declare the method as a protocol requirement.
- id: q4
  question: What is conditional conformance?
  options:
    - Conforming at runtime
    - Optional conformance
    - Conforming a generic type to a protocol only when type parameters conform
    - A typealias
  correctIndex: 2
  explanation: "`extension Array: Equatable where Element: Equatable` makes `Array<T>` Equatable only when `T` is, automatically."
- id: q5
  question: "What does `protocol A: B` mean?"
  options:
    - A inherits from class B
    - A is a subclass of B
    - A wraps B
    - A refines B; conforming to A also conforms to B
  correctIndex: 3
  explanation: Protocols can inherit other protocols; any type conforming to A must also satisfy B's requirements.
- id: q6
  question: What is `Named & Aged`?
  options:
    - A protocol composition — any type conforming to both Named and Aged
    - A new protocol
    - A class
    - A typealias
  correctIndex: 0
  explanation: "`&` composes protocols inline into an anonymous composition; useful when you don't want to declare a new protocol just for a function signature."
- id: q7
  question: What's "protocol-oriented programming" in Swift?
  options:
    - Using classes everywhere
    - Modeling with value types + protocols + extensions instead of class hierarchies
    - Using reflection
    - Functional programming
  correctIndex: 1
  explanation: POP emphasizes structs/enums + protocol abstractions + default-implemented extensions, avoiding deep class hierarchies.
- id: q8
  question: Can you conform a type to a protocol from a different module retroactively?
  options:
    - No
    - Only via subclassing
    - Yes, via an extension in your module
    - Only if the type is final
  correctIndex: 2
  explanation: Retroactive conformance (extending foreign types to conform to a protocol) is allowed; risks include "ambiguous conformance" if two modules do it.
- id: q9
  question: Why is `Equatable` problematic as an existential (`any Equatable`)?
  options:
    - It isn't
    - It's too slow
    - It's a struct
    - It has a `Self` type, which is unknowable for existentials; you can only use it as a generic constraint
  correctIndex: 3
  explanation: Protocols with `Self` or associated types (PATs) can't be used as plain existentials in older Swift; Swift 5.7+ allows `any Equatable` but comparisons remain limited.
- id: q10
  question: What does adding a default implementation in a protocol extension enable?
  options:
    - Mix-in behavior without inheritance
    - Stored state
    - Threading
    - Reflection
  correctIndex: 0
  explanation: Default-implemented protocol methods let conforming types opt in to behavior for free, providing reuse without class inheritance.
```

