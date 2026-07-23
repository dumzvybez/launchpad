---
slug: swift-properties-stored-computed-lazy-observers
id: swift-09
track: swift
order: 9
title: Properties — Stored, Computed, Lazy, Observers
description: Use Swift's four kinds of property — stored, computed, lazy, and observed — and understand the subtleties of `didSet`, `willSet`, and `lazy` initialization.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0&t=480s
whyItMatters: Use Swift's four kinds of property — stored, computed, lazy, and observed — and understand the subtleties of `didSet`, `willSet`, and `lazy` initialization.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Properties — Stored, Computed, Lazy, Observers

## Properties — Stored, Computed, Lazy, Observers

### Why It Matters

Use Swift's four kinds of property — stored, computed, lazy, and observed — and understand the subtleties of `didSet`, `willSet`, and `lazy` initialization.

Use Swift's four kinds of property — stored, computed, lazy, and observed — and understand the subtleties of `didSet`, `willSet`, and `lazy` initialization.

### Prerequisites

- Stage 8: Structs and Classes
- Stage 6: Functions and Closures (for lazy's closure capture)

### Topics

- Stored properties (var and let)
- Computed properties: getter and setter
- Lazy stored properties (`lazy var`)
- Property observers: `willSet` and `didSet`
- Type properties (`static var`, `class var`)
- Property wrappers (preview: `@State`, `@AppStorage`)
- Default values and observers on initialization
- `lazy` and threadsafety (not atomic by default)
- Computed property vs method — when to choose

### Key Concepts

- Stored properties hold state; computed properties derive state from other properties.
- `lazy var` initializes on first access and is not thread-safe by default; in a multithreaded context, two threads can both initialize it.
- `willSet`/`didSet` observers do NOT fire during initialization; they fire only on subsequent mutations.
- A `let` constant stored property must be set exactly once — either at declaration or in `init`.
- Computed properties should be O(1) — if you're doing heavy work, use a method so callers know it's not cheap.

```swift
struct Temperature {
    var celsius: Double {
        willSet { print("about to set \(newValue)") }
        didSet { print("changed from \(oldValue) to \(celsius)") }
    }
    var fahrenheit: Double { celsius * 9 / 5 + 32 }  // computed

    init(celsius: Double) {
        self.celsius = celsius  // observers do NOT fire here
    }
}
var t = Temperature(celsius: 25)
t.celsius = 30  // prints: about to set 30.0 / changed from 25.0 to 30.0
```
Caption: Stored, computed, lazy, observers

### Common Pitfalls

- Expecting `didSet` to fire during `init` — observers skip initialization; if you need them, move setup into a separate `configure()` after init.
- Mutating a property from within its own `didSet` — this re-fires `didSet` and can cause infinite recursion; use a flag or compute the new value without setting it back.
- Accessing `lazy var` from multiple threads concurrently — Swift does not synchronize lazy init; both threads can run the initializer, leaking memory or worse. Use a `DispatchQueue` or `actor` if needed.
- Marking `lazy` on a `let` — compile error; lazy requires `var` because initialization mutates the storage.
- Using a computed property for expensive work — callers expect O(1); if you're parsing JSON, call a `func` instead.

### Real-World Applications

- Apple's SwiftUI uses property wrappers (`@State`, `@Binding`, `@StateObject`) to declare observable storage; under the hood each is a property wrapper.
- LinkedIn uses `didSet` on view-model state to trigger analytics events whenever user-facing state changes.
- Slack uses `lazy var` for one-time setup of heavy view components (like the message input bar) to keep `init` cheap.
- Things 3 uses `didSet` on `task.dueDate` to auto-reschedule recurring tasks when the user drags a date.

### Interview Questions

- 1. What's the difference between a stored and a computed property? — Stored properties hold memory; computed properties are getters/setters re-evaluated each access with no backing storage of their own.
- 2. When do `willSet`/`didSet` fire? — On every mutation EXCEPT during initialization; the initial assignment in `init` does not trigger observers.
- 3. Is `lazy var` thread-safe? — No, by default. Two threads can both initialize it; use a serial queue or actor if you need atomicity.
- 4. What is a property wrapper? — A generic type annotated with `@propertyWrapper` that wraps storage with custom get/set behavior, accessed via `@WrapperName` on a property.
- 5. Can a `let` stored property be `lazy`? — No; `lazy` requires `var` because the value is set on first access (after init).

### Mini Project

Build a Settings Screen Model: A `struct Settings` with properties like `volume`, `brightness`, and `theme` that auto-persist to `UserDefaults` via a custom `@UserDefault` property wrapper. Suggested approach:
  - Define `@propertyWrapper struct UserDefault<T>` with a key and `UserDefaults`
  - Implement `wrappedValue` get/set that reads/writes the store
  - Add `didSet` on `theme` to fire a notification
  - Test by mutating and confirming persistence across instances
  - Add `@Clamped(0...100)` wrapping for volume

### Exercises

1. Write `struct Rectangle { var width, height: Double; var area: Double { width * height } }` and verify `area` recomputes on mutation.
2. Add `didSet` to `width` that prints the delta; observe it doesn't fire in `init`.
3. Add `lazy var expensive: Data = makeBigData()` and access it twice; print a log on first access only.
4. Build a `@propertyWrapper struct NonEmpty` that rejects empty strings.
5. Add a `static var allThemes: [String]` to a `Theme` struct and verify it's shared across instances.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: When do `willSet`/`didSet` observers fire?
9. A) On every mutation EXCEPT during init (*)
10. B) On every property mutation including init
11. C) Only during init
12. D) Only on `let` properties
13. Explanation: Observers skip the initial assignment in `init`; they fire on all subsequent mutations.
14. Q2: What is a computed property?
15. A) A property with backing storage
16. B) A getter (and optional setter) re-evaluated on each access (*)
17. C) A `lazy var`
18. D) A static property
19. Explanation: Computed properties have no storage of their own; they derive their value from other properties each time they're accessed.
20. Q3: Is `lazy var` thread-safe by default?
21. A) Yes
22. B) Only in classes
23. C) No — concurrent access can double-initialize (*)
24. D) Only in structs
25. Explanation: Swift does not synchronize lazy initialization; multiple threads can simultaneously run the initializer. Use a serial queue or actor for atomicity.
26. Q4: Can a `let` property be `lazy`?
27. A) Yes
28. B) Only in classes
29. C) Only with a default value
30. D) No — `lazy` requires `var` (*)
31. Explanation: `lazy` defers initialization to first access, which mutates the storage; that requires `var`.
32. Q5: What does `oldValue` refer to inside `didSet`?
33. A) The value before the mutation (*)
34. B) The new value
35. C) The default value
36. D) The first value ever set
37. Explanation: Inside `didSet`, `oldValue` is the property's value before this mutation; `newValue` (in `willSet`) is the incoming value.
38. Q6: What is a property wrapper?
39. A) A protocol
40. B) A type annotated `@propertyWrapper` that wraps storage with custom get/set behavior (*)
41. C) A type of closure
42. D) A test double
43. Explanation: Property wrappers encapsulate storage logic; `@State`, `@AppStorage`, and `@Clamped` are examples. They're applied via `@Wrapper` syntax.
44. Q7: What's the convention for computed property complexity?
45. A) Must be O(n)
46. B) No convention
47. C) Should be O(1) — heavy work belongs in a `func` (*)
48. D) Must be O(log n)
49. Explanation: Callers expect computed properties to be cheap; if work is non-trivial (parsing, network), expose it as a method.
50. Q8: What is a type property in Swift?
51. A) A property accessed via an instance
52. B) A computed property
53. C) A class instance variable
54. D) A property on the type itself (`static var`) (*)
55. Explanation: Type properties (`static var`) belong to the type, not instances; they're shared across all instances (like class variables in other languages).
56. Q9: What's the difference between `static var` and `class var`?
57. A) `class var` can be overridden by subclasses; `static var` cannot (*)
58. B) None
59. C) `static var` is for value types only
60. D) `class var` is thread-safe
61. Explanation: `static` is final (cannot be overridden); `class` allows overriding in subclasses (but only for computed properties on classes).
62. Q10: What happens if you mutate a property from within its own `didSet`?
63. A) Compile error
64. B) Re-fires `didSet` (possible infinite recursion) (*)
65. C) No effect
66. D) Crashes immediately
67. Explanation: Setting the property inside its own `didSet` re-triggers the observer, potentially looping; use a flag or restructure to avoid.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: When do `willSet`/`didSet` observers fire?
  options:
    - On every mutation EXCEPT during init
    - On every property mutation including init
    - Only during init
    - Only on `let` properties
  correctIndex: 0
  explanation: Observers skip the initial assignment in `init`; they fire on all subsequent mutations.
- id: q2
  question: What is a computed property?
  options:
    - A property with backing storage
    - A getter (and optional setter) re-evaluated on each access
    - A `lazy var`
    - A static property
  correctIndex: 1
  explanation: Computed properties have no storage of their own; they derive their value from other properties each time they're accessed.
- id: q3
  question: Is `lazy var` thread-safe by default?
  options:
    - Yes
    - Only in classes
    - No — concurrent access can double-initialize
    - Only in structs
  correctIndex: 2
  explanation: Swift does not synchronize lazy initialization; multiple threads can simultaneously run the initializer. Use a serial queue or actor for atomicity.
- id: q4
  question: Can a `let` property be `lazy`?
  options:
    - Yes
    - Only in classes
    - Only with a default value
    - No — `lazy` requires `var`
  correctIndex: 3
  explanation: "`lazy` defers initialization to first access, which mutates the storage; that requires `var`."
- id: q5
  question: What does `oldValue` refer to inside `didSet`?
  options:
    - The value before the mutation
    - The new value
    - The default value
    - The first value ever set
  correctIndex: 0
  explanation: Inside `didSet`, `oldValue` is the property's value before this mutation; `newValue` (in `willSet`) is the incoming value.
- id: q6
  question: What is a property wrapper?
  options:
    - A protocol
    - A type annotated `@propertyWrapper` that wraps storage with custom get/set behavior
    - A type of closure
    - A test double
  correctIndex: 1
  explanation: Property wrappers encapsulate storage logic; `@State`, `@AppStorage`, and `@Clamped` are examples. They're applied via `@Wrapper` syntax.
- id: q7
  question: What's the convention for computed property complexity?
  options:
    - Must be O(n)
    - No convention
    - Should be O(1) — heavy work belongs in a `func`
    - Must be O(log n)
  correctIndex: 2
  explanation: Callers expect computed properties to be cheap; if work is non-trivial (parsing, network), expose it as a method.
- id: q8
  question: What is a type property in Swift?
  options:
    - A property accessed via an instance
    - A computed property
    - A class instance variable
    - A property on the type itself (`static var`)
  correctIndex: 3
  explanation: Type properties (`static var`) belong to the type, not instances; they're shared across all instances (like class variables in other languages).
- id: q9
  question: What's the difference between `static var` and `class var`?
  options:
    - "`class var` can be overridden by subclasses; `static var` cannot"
    - None
    - "`static var` is for value types only"
    - "`class var` is thread-safe"
  correctIndex: 0
  explanation: "`static` is final (cannot be overridden); `class` allows overriding in subclasses (but only for computed properties on classes)."
- id: q10
  question: What happens if you mutate a property from within its own `didSet`?
  options:
    - Compile error
    - Re-fires `didSet` (possible infinite recursion)
    - No effect
    - Crashes immediately
  correctIndex: 1
  explanation: Setting the property inside its own `didSet` re-triggers the observer, potentially looping; use a flag or restructure to avoid.
```

