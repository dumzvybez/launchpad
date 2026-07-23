---
slug: swift-functions-closures
id: swift-06
track: swift
order: 6
title: Functions and Closures
description: Define functions with parameters, labels, defaults, and variadics, then master closures — Swift's first-class anonymous functions with capture semantics.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0&t=300s
whyItMatters: Define functions with parameters, labels, defaults, and variadics, then master closures — Swift's first-class anonymous functions with capture semantics.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Functions and Closures

## Functions and Closures

### Why It Matters

Define functions with parameters, labels, defaults, and variadics, then master closures — Swift's first-class anonymous functions with capture semantics.

Define functions with parameters, labels, defaults, and variadics, then master closures — Swift's first-class anonymous functions with capture semantics.

### Prerequisites

- Stage 2: Variables, Types, and Optionals
- Stage 3: Control Flow
- Stage 5: Arrays, Sets, and Dictionaries (map/filter/reduce)

### Topics

- Function declarations and return types
- Argument labels and parameter names (`func greet(name value: String)`)
- Default parameter values and variadic parameters (`...`)
- `inout` parameters and mutation at call sites
- Function types `(Int, Int) -> Int` as first-class values
- Closures: `{ (params) -> ReturnType in body }`
- Trailing closure syntax and multiple trailing closures (Swift 5.3+)
- Capture lists: `[weak self]`, `[unowned self]`, `[captured = expr]`
- `@escaping` and `@autoclosure` attributes
- `lazy` map/filter with sequences

### Key Concepts

- Argument labels are part of the API: `f(label param:)` and `f(param:)` are different functions.
- Closures capture variables by reference to their enclosing scope; mutations persist.
- `@escaping` marks closures that outlive the function call (stored or async) — required for async callbacks.
- Capture lists execute at closure creation, not invocation; `[weak self]` breaks retain cycles.
- `@autoclosure` wraps an expression in a no-arg closure, enabling short-circuit behavior (used by `&&`, `||`, `??`).

```swift
func greet(name: String, with prefix: String = "Hello") -> String {
    return "\(prefix), \(name)!"
}
greet(name: "Ada")                    // "Hello, Ada!"
greet(name: "Ada", with: "Hi")        // "Hi, Ada!"
```
Caption: Argument labels and defaults

### Common Pitfalls

- Forgetting `@escaping` on a closure stored for later — the compiler complains "closure cannot capture mutating self"; mark escaping closures explicitly.
- Creating retain cycles by capturing `self` strongly in an escaping closure stored on `self` — use `[weak self]` and `guard let self else { return }`.
- Confusing argument label with parameter name — `func f(label name: String)` is called `f(label: "x")`, not `f(name: "x")`; the parameter `name` is only used in the body.
- Forgetting `inout` requires `&` at the call site — `increment(&x)`, not `increment(x)`.
- Using `[unowned self]` when the closure might outlive the object — `unowned` traps if the reference is nil; prefer `weak` + `guard let`.

### Real-World Applications

- Apple's `URLSession.dataTask(with:completionHandler:)` uses `@escaping` closures for async network responses; the closure runs after `dataTask` returns.
- Combine's `sink(receiveValue:)` returns a `Cancellable` and stores the closure; you must hold the cancellable or the stream is torn down.
- LinkedIn's networking layer wraps completion-handler APIs in async/await via `withCheckedContinuation`, using `@escaping` underneath.
- SwiftUI's `Button(action: { ... })` uses trailing closure syntax and is the most recognizable API in the framework.

### Interview Questions

- 1. What's the difference between an argument label and a parameter name? — The label is used at the call site; the parameter name is used inside the body. They can differ (`func f(label name:)`).
- 2. What does `@escaping` mean? — The closure can outlive the function call (be stored or run asynchronously); the compiler requires it so it can manage capture lifetimes.
- 3. Why use `[weak self]` in an escaping closure? — To break a retain cycle when the closure is stored on `self`; otherwise the closure holds `self` alive and `self` holds the closure alive.
- 4. When would you use `@autoclosure`? — When you want a caller to pass a bare expression that's lazily evaluated, e.g. `assert(cond)` or `&&` short-circuiting.
- 5. What's the difference between `inout` and a regular parameter? — `inout` is pass-by-reference (copy-in/copy-out); the caller must use `&` and the function can mutate the caller's variable.

### Mini Project

Build a Tiny Promise/Future Implementation: A `Promise<T>` that exposes `resolve`, `reject`, and `then`, with `@escaping` closures and a `[weak self]` capture list. Suggested approach:
  - Define `enum State<T> { case pending; case fulfilled(T); case rejected(Error) }`
  - Store callbacks in `[() -> Void]` arrays
  - Use a `DispatchQueue` to serialize state transitions
  - Use `[weak self]` in `then` to avoid cycles
  - Add `catch` and `finally` chaining

### Exercises

1. Write `func power(_ base: Double, _ exp: Int) -> Double` and call it without labels (using `_`).
2. Write a variadic `max(of numbers: Int...) -> Int?` that returns the maximum or `nil` for an empty call.
3. Write a function `repeatTask(times:n:action:)` that uses an escaping closure and `[weak self]`.
4. Implement `&&` using `@autoclosure`: `func and(_ a: @autoclosure () -> Bool, _ b: @autoclosure () -> Bool) -> Bool`.
5. Convert `func fetch(_ url: URL, completion: @escaping (Data?) -> Void)` to async/await using `withCheckedThrowingContinuation`.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `@escaping` mean on a closure parameter?
9. A) The closure throws
10. B) The closure can outlive the function call (*)
11. C) The closure is synchronous
12. D) The closure runs immediately
13. Explanation: `@escaping` tells the compiler the closure may be stored or invoked after the function returns, affecting capture semantics.
14. Q2: How do you call `func greet(name: String, with prefix: String = "Hi")`?
15. A) `greet("Ada")`
16. B) `greet(Ada, Hi)`
17. C) `greet(name: "Ada")` or `greet(name: "Ada", with: "Yo")` (*)
18. D) `greet(name=Ada, with=Yo)`
19. Explanation: Argument labels are required at the call site; `with` has a default so it can be omitted.
20. Q3: What does `[weak self]` do in a closure?
21. A) Forces self to be non-nil
22. B) Copies self
23. C) Makes self Sendable
24. D) Captures self as a weak optional to break retain cycles (*)
25. Explanation: `[weak self]` captures `self` as `Weak<Self>`, allowing deallocation; inside the closure `self` is now `Self?` and must be bound.
26. Q4: What does `@autoclosure` enable?
27. A) Auto-generation of closures from a bare expression (*)
28. B) Async closures
29. C) Throwing closures
30. D) Generic closures
31. Explanation: `@autoclosure` wraps an expression in a no-arg closure so the caller writes `assert(x > 0)` and the call site delays evaluation.
32. Q5: Which is the correct syntax for a variadic parameter?
33. A) `func sum(_ nums: [Int])`
34. B) `func sum(_ nums: Int...)` (*)
35. C) `func sum(_ nums: Int*)`
36. D) `func sum(_ nums: ...Int)`
37. Explanation: `Int...` is the variadic syntax; inside the body `nums` is `[Int]`.
38. Q6: What does `inout` require at the call site?
39. A) `*value`
40. B) `value`
41. C) `&value` (*)
42. D) `inout value`
43. Explanation: `inout` is copy-in/copy-out; the call site marks it with `&` to signal mutation, like C's address-of.
44. Q7: What is the trailing closure syntax for `Button(action: { print("tapped") })`?
45. A) `Button(print("tapped"))`
46. B) `Button(action: print("tapped"))`
47. C) No trailing form exists
48. D) `Button { print("tapped") }` (*)
49. Explanation: When the last parameter is a closure, you can write it after the parens: `Button { ... }`. Swift 5.3+ supports multiple trailing closures.
50. Q8: When is a capture list evaluated?
51. A) When the closure is created (*)
52. B) When the closure is invoked
53. C) Lazily on first access
54. D) At scope exit
55. Explanation: Capture lists like `[weak self]` or `[captured = self.value]` run when the closure is created, capturing a snapshot of values.
56. Q9: Why use `unowned` instead of `weak`?
57. A) It's safer
58. B) When the closure's lifetime is bounded by the object's lifetime and you don't want optional binding (*)
59. C) It avoids retain cycles better than weak
60. D) It's required for async
61. Explanation: `unowned` assumes the reference is non-nil during the closure's execution; it traps if violated. Use it only when the closure cannot outlive the object.
62. Q10: What's the function type of `(Int, Int) -> Int`?
63. A) An instance of `Function<Int, Int>`
64. B) A protocol
65. C) A first-class value that can be stored, passed, and returned (*)
66. D) A class
67. Explanation: Swift function types are first-class; you can assign them to variables, pass them as arguments, and return them from functions.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `@escaping` mean on a closure parameter?
  options:
    - The closure throws
    - The closure can outlive the function call
    - The closure is synchronous
    - The closure runs immediately
  correctIndex: 1
  explanation: "`@escaping` tells the compiler the closure may be stored or invoked after the function returns, affecting capture semantics."
- id: q2
  question: 'How do you call `func greet(name: String, with prefix: String = "Hi")`?'
  options:
    - '`greet("Ada")`'
    - "`greet(Ada, Hi)`"
    - '`greet(name: "Ada")` or `greet(name: "Ada", with: "Yo")`'
    - "`greet(name=Ada, with=Yo)`"
  correctIndex: 2
  explanation: Argument labels are required at the call site; `with` has a default so it can be omitted.
- id: q3
  question: What does `[weak self]` do in a closure?
  options:
    - Forces self to be non-nil
    - Copies self
    - Makes self Sendable
    - Captures self as a weak optional to break retain cycles
  correctIndex: 3
  explanation: "`[weak self]` captures `self` as `Weak<Self>`, allowing deallocation; inside the closure `self` is now `Self?` and must be bound."
- id: q4
  question: What does `@autoclosure` enable?
  options:
    - Auto-generation of closures from a bare expression
    - Async closures
    - Throwing closures
    - Generic closures
  correctIndex: 0
  explanation: "`@autoclosure` wraps an expression in a no-arg closure so the caller writes `assert(x > 0)` and the call site delays evaluation."
- id: q5
  question: Which is the correct syntax for a variadic parameter?
  options:
    - "`func sum(_ nums: [Int])`"
    - "`func sum(_ nums: Int...)`"
    - "`func sum(_ nums: Int*)`"
    - "`func sum(_ nums: ...Int)`"
  correctIndex: 1
  explanation: "`Int...` is the variadic syntax; inside the body `nums` is `[Int]`."
- id: q6
  question: What does `inout` require at the call site?
  options:
    - "`*value`"
    - "`value`"
    - "`&value`"
    - "`inout value`"
  correctIndex: 2
  explanation: "`inout` is copy-in/copy-out; the call site marks it with `&` to signal mutation, like C's address-of."
- id: q7
  question: 'What is the trailing closure syntax for `Button(action: { print("tapped") })`?'
  options:
    - '`Button(print("tapped"))`'
    - '`Button(action: print("tapped"))`'
    - No trailing form exists
    - '`Button { print("tapped") }`'
  correctIndex: 3
  explanation: "When the last parameter is a closure, you can write it after the parens: `Button { ... }`. Swift 5.3+ supports multiple trailing closures."
- id: q8
  question: When is a capture list evaluated?
  options:
    - When the closure is created
    - When the closure is invoked
    - Lazily on first access
    - At scope exit
  correctIndex: 0
  explanation: Capture lists like `[weak self]` or `[captured = self.value]` run when the closure is created, capturing a snapshot of values.
- id: q9
  question: Why use `unowned` instead of `weak`?
  options:
    - It's safer
    - When the closure's lifetime is bounded by the object's lifetime and you don't want optional binding
    - It avoids retain cycles better than weak
    - It's required for async
  correctIndex: 1
  explanation: "`unowned` assumes the reference is non-nil during the closure's execution; it traps if violated. Use it only when the closure cannot outlive the object."
- id: q10
  question: What's the function type of `(Int, Int) -> Int`?
  options:
    - An instance of `Function<Int, Int>`
    - A protocol
    - A first-class value that can be stored, passed, and returned
    - A class
  correctIndex: 2
  explanation: Swift function types are first-class; you can assign them to variables, pass them as arguments, and return them from functions.
```

