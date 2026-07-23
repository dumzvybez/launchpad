---
slug: swift-memory-management-arc-weak-unowned-closures
id: swift-15
track: swift
order: 15
title: Memory Management — ARC, weak, unowned, closures
description: Understand Automatic Reference Counting, identify and break retain cycles with `weak`/`unowned`, and capture `self` safely in escaping closures.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0&t=840s
whyItMatters: Understand Automatic Reference Counting, identify and break retain cycles with `weak`/`unowned`, and capture `self` safely in escaping closures.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Memory Management — ARC, weak, unowned, closures

## Memory Management — ARC, weak, unowned, closures

### Why It Matters

Understand Automatic Reference Counting, identify and break retain cycles with `weak`/`unowned`, and capture `self` safely in escaping closures.

Understand Automatic Reference Counting, identify and break retain cycles with `weak`/`unowned`, and capture `self` safely in escaping closures.

### Prerequisites

- Stage 6: Functions and Closures (escaping, capture lists)
- Stage 8: Structs and Classes (reference types)
- Stage 11: Inheritance

### Topics

- ARC: strong references, retain/release, deallocation
- Strong reference cycles between objects
- `weak` references (auto-nil-ing) and `unowned` references (non-nil assumption)
- Capture lists in closures: `[weak self]`, `[unowned self]`
- Escaping closures and self capture
- Common cycle patterns: delegate → delegator, timer → target, NotificationCenter
- Resolving cycles with weak delegates and `[weak self]`
- `deinit` and when it runs
- Value types vs reference types and ARC
- Tools: Memory Graph in Xcode, Allocations instrument

### Key Concepts

- ARC inserts `retain` on strong-reference assignment and `release` when the reference goes out of scope; deallocation happens when the retain count hits zero.
- A strong reference cycle prevents either object's retain count from reaching zero, leaking both.
- `weak var` is auto-nil-ing: when the referenced object deallocates, the weak var becomes nil. Requires `var` (not `let`) and an optional type.
- `unowned` doesn't nil out — it assumes the referenced object outlives the reference; accessing it after deallocation traps.
- In escaping closures that reference `self`, `[weak self]` or `[unowned self]` breaks the cycle: the closure captures a weak/unowned ref instead of a strong one.

```swift
class Person {
    var name: String
    var apartment: Apartment?      // strong
    init(name: String) { self.name = name }
    deinit { print("\(name) deinit") }
}

class Apartment {
    var unit: String
    var tenant: Person?            // strong — CYCLE
    init(unit: String) { self.unit = unit }
    deinit { print("Apartment \(unit) deinit") }
}

var ada: Person? = Person(name: "Ada")
var apt: Apartment? = Apartment(unit: "4A")
ada?.apartment = apt
apt?.tenant = ada
ada = nil; apt = nil  // NEITHER deinit runs — leaked!
```
Caption: Strong reference cycle

### Common Pitfalls

- Forgetting `[weak self]` in an escaping closure stored on `self` — the closure captures `self` strongly, preventing deallocation. Symptom: `deinit` never runs.
- Using `unowned` when the closure might outlive the object — `unowned` traps on access after deallocation; prefer `weak` unless you can prove the lifetime.
- Storing a `Timer` scheduled with `target: self` — `Timer` retains its target until invalidated; always `timer.invalidate()` in `deinit` or before reuse.
- Strong delegate properties — delegates should almost always be `weak` to avoid the classic view-controller ↔ delegate cycle.
- Capturing self indirectly via a stored property reference — even `[weak self]` doesn't help if the closure body accesses `self.something` that strongly captures self elsewhere.

### Real-World Applications

- Apple's UIKit makes `@IBOutlet` views `weak` by default because the view hierarchy already retains them.
- LinkedIn engineers regularly use Xcode's Memory Graph Debugger to find retain cycles in the iOS app's complex view-controller graph.
- Slack uses `[weak self]` in every escaping closure across the codebase, enforced by a custom SwiftLint rule.
- Airbnb's image loader uses `weak` references to view objects so caching doesn't keep deallocated views alive.

### Interview Questions

- 1. What is ARC and how does it differ from garbage collection? — ARC inserts retain/release at compile time; GC runs a background tracer. ARC has no pauses but cannot break cycles.
- 2. What's the difference between `weak` and `unowned`? — `weak` is optional and auto-nils on deallocation; `unowned` is non-optional and assumes the referenced object outlives the reference, trapping if violated.
- 3. Why does an escaping closure that captures `self` strongly create a retain cycle? — The closure is stored (e.g., on a property of self), so self holds the closure and the closure holds self.
- 4. How do you detect a retain cycle in practice? — `deinit` not running is the smoking gun; use Xcode's Memory Graph Debugger or the Allocations instrument to find the cycle.
- 5. Why are delegates conventionally `weak`? — The delegating object often retains the delegate; if the delegate also retained the delegator, neither would deallocate.

### Mini Project

Build a Timer-Based Poller: A `Poller` class that schedules a `Timer` to call a closure every second, then ensure it doesn't leak when released. Suggested approach:
  - `class Poller { private var timer: Timer?; var handler: () -> Void }`
  - In `start()`, schedule `Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in self?.fire() }`
  - In `deinit`, call `timer?.invalidate()`
  - Add a `weak var` reference from the timer's block back to self
  - Verify `Poller().deinit` runs by setting the strong reference to nil and observing the print

### Exercises

1. Build the Person/Apartment strong cycle from the example and confirm neither deinit runs.
2. Add `weak` to break the cycle; confirm both deinit run.
3. Capture self strongly in an escaping closure stored on self; confirm deinit doesn't run.
4. Switch to `[weak self]` and `guard let self else { return }`; confirm deinit runs.
5. Use Xcode's Memory Graph Debugger (or a print in deinit) to confirm a leak in a timer-based example.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does ARC stand for and how does it work?
9. A) Auto-Refs Collector — a background tracer
10. B) Async Reference Counter — runtime only
11. C) Automatic Reference Counting — compiler inserts retain/release at compile time (*)
12. D) Atomic Resource Cache
13. Explanation: ARC inserts retain/release calls statically; no runtime tracer. Pauses are absent, but cycles aren't auto-collected.
14. Q2: What's the difference between `weak` and `unowned`?
15. A) Both are identical
16. B) `weak` traps; `unowned` doesn't
17. C) `unowned` requires Sendable
18. D) `weak` is optional and auto-nils on dealloc; `unowned` assumes non-nil and traps if violated (*)
19. Explanation: `weak` becomes nil when the referenced object deallocates; `unowned` leaves a dangling pointer that traps on access.
20. Q3: Why does `[weak self]` in an escaping closure break a retain cycle?
21. A) The closure captures self as a weak optional, so it doesn't increment self's retain count (*)
22. B) It releases self immediately
23. C) It copies self
24. D) It delays the closure
25. Explanation: Capture lists capture by the specified strength; `[weak self]` captures a weak reference, breaking the strong cycle.
26. Q4: Why are delegates conventionally `weak`?
27. A) Performance
28. B) To avoid a strong cycle between delegator and delegate (*)
29. C) To enable thread safety
30. D) Required by ARC
31. Explanation: If both retained each other strongly, neither would deallocate. `weak` lets the delegate be released when its real owner (e.g., a VC) goes away.
32. Q5: What happens when a `Timer` is scheduled with `target: self` and never invalidated?
33. A) Compile error
34. B) The timer auto-stops
35. C) The timer retains self until invalidated, leaking both (*)
36. D) Nothing
37. Explanation: `Timer` retains its target (or its block's captured self) until `invalidate()` is called. Always invalidate in `deinit`.
38. Q6: What does it mean when `deinit` doesn't run?
39. A) Normal
40. B) ARC crashed
41. C) The class is final
42. D) Likely a retain cycle — the object is still alive somewhere (*)
43. Explanation: A missing `deinit` print is the classic symptom of a retain cycle: the object's retain count never reaches zero.
44. Q7: Can a `weak` reference be `let`?
45. A) No — it must be `var` so it can be nil'd out (*)
46. B) Yes
47. C) Only for classes
48. D) Only with @objc
49. Explanation: `weak` references must be `var` so the runtime can write `nil` when the referenced object deallocates.
50. Q8: When is `unowned` safe to use?
51. A) Always
52. B) When the referenced object is guaranteed to outlive the reference (e.g., parent-child) (*)
53. C) Never
54. D) Only for value types
55. Explanation: `unowned` is safe when you can prove the lifetime relationship — e.g., a credit card's owner being a Customer that owns the card. Otherwise use `weak`.
56. Q9: Do value types (structs/enums) participate in ARC?
57. A) Yes
58. B) Only if they contain a class
59. C) No — only classes and closures do; structs are copied (*)
60. D) Always
61. Explanation: Value types are stored inline and copied on mutation; no reference count. If a struct contains a class field, that field is ARC-managed, but the struct itself isn't.
62. Q10: What tool finds retain cycles in Xcode?
63. A) Leak Finder
64. B) Profiler
65. C) View Debugger
66. D) Memory Graph Debugger (*)
67. Explanation: The Memory Graph Debugger snapshots live objects and their references, highlighting cycles. The Allocations instrument is also useful.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does ARC stand for and how does it work?
  options:
    - Auto-Refs Collector — a background tracer
    - Async Reference Counter — runtime only
    - Automatic Reference Counting — compiler inserts retain/release at compile time
    - Atomic Resource Cache
  correctIndex: 2
  explanation: ARC inserts retain/release calls statically; no runtime tracer. Pauses are absent, but cycles aren't auto-collected.
- id: q2
  question: What's the difference between `weak` and `unowned`?
  options:
    - Both are identical
    - "`weak` traps; `unowned` doesn't"
    - "`unowned` requires Sendable"
    - "`weak` is optional and auto-nils on dealloc; `unowned` assumes non-nil and traps if violated"
  correctIndex: 3
  explanation: "`weak` becomes nil when the referenced object deallocates; `unowned` leaves a dangling pointer that traps on access."
- id: q3
  question: Why does `[weak self]` in an escaping closure break a retain cycle?
  options:
    - The closure captures self as a weak optional, so it doesn't increment self's retain count
    - It releases self immediately
    - It copies self
    - It delays the closure
  correctIndex: 0
  explanation: Capture lists capture by the specified strength; `[weak self]` captures a weak reference, breaking the strong cycle.
- id: q4
  question: Why are delegates conventionally `weak`?
  options:
    - Performance
    - To avoid a strong cycle between delegator and delegate
    - To enable thread safety
    - Required by ARC
    - goes away.
  correctIndex: 1
  explanation: If both retained each other strongly, neither would deallocate. `weak` lets the delegate be released when its real owner (e.g., a VC) goes away.
- id: q5
  question: "What happens when a `Timer` is scheduled with `target: self` and never invalidated?"
  options:
    - Compile error
    - The timer auto-stops
    - The timer retains self until invalidated, leaking both
    - Nothing
  correctIndex: 2
  explanation: "`Timer` retains its target (or its block's captured self) until `invalidate()` is called. Always invalidate in `deinit`."
- id: q6
  question: What does it mean when `deinit` doesn't run?
  options:
    - Normal
    - ARC crashed
    - The class is final
    - Likely a retain cycle — the object is still alive somewhere
  correctIndex: 3
  explanation: "A missing `deinit` print is the classic symptom of a retain cycle: the object's retain count never reaches zero."
- id: q7
  question: Can a `weak` reference be `let`?
  options:
    - No — it must be `var` so it can be nil'd out
    - Yes
    - Only for classes
    - Only with @objc
  correctIndex: 0
  explanation: "`weak` references must be `var` so the runtime can write `nil` when the referenced object deallocates."
- id: q8
  question: When is `unowned` safe to use?
  options:
    - Always
    - When the referenced object is guaranteed to outlive the reference (e.g., parent-child)
    - Never
    - Only for value types
  correctIndex: 1
  explanation: "`unowned` is safe when you can prove the lifetime relationship — e.g., a credit card's owner being a Customer that owns the card. Otherwise use `weak`."
- id: q9
  question: Do value types (structs/enums) participate in ARC?
  options:
    - Yes
    - Only if they contain a class
    - No — only classes and closures do; structs are copied
    - Always
  correctIndex: 2
  explanation: Value types are stored inline and copied on mutation; no reference count. If a struct contains a class field, that field is ARC-managed, but the struct itself isn't.
- id: q10
  question: What tool finds retain cycles in Xcode?
  options:
    - Leak Finder
    - Profiler
    - View Debugger
    - Memory Graph Debugger
  correctIndex: 3
  explanation: The Memory Graph Debugger snapshots live objects and their references, highlighting cycles. The Allocations instrument is also useful.
```

