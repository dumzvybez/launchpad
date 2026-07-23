---
slug: swift-error-handling-throws-try-result
id: swift-14
track: swift
order: 14
title: Error Handling — throws, try, Result
description: Throw, catch, and propagate errors with `throws`/`try`/`catch`, model fallible operations with `Result<Success, Failure>`, and choose between throws and Result deliberately.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0&t=780s
whyItMatters: Throw, catch, and propagate errors with `throws`/`try`/`catch`, model fallible operations with `Result<Success, Failure>`, and choose between throws and Result deliberately.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Error Handling — throws, try, Result

## Error Handling — throws, try, Result

### Why It Matters

Throw, catch, and propagate errors with `throws`/`try`/`catch`, model fallible operations with `Result<Success, Failure>`, and choose between throws and Result deliberately.

Throw, catch, and propagate errors with `throws`/`try`/`catch`, model fallible operations with `Result<Success, Failure>`, and choose between throws and Result deliberately.

### Prerequisites

- Stage 6: Functions and Closures (escaping closures)
- Stage 7: Enums (associated values)
- Stage 13: Generics

### Topics

- `Error` protocol and `enum` errors
- `throws`, `try`, `try?`, `try!`, `catch`
- Propagating errors up the call stack
- `rethrows` for higher-order functions
- `Result<Success, Failure: Error>` type
- `Result.map`, `Result.flatMap`, `Result.mapError`
- Converting between throws and Result with `Result(catching:)`
- `defer` for cleanup
- `any Error` vs typed throws (Swift 6 preview)
- `localizedDescription` and `CustomStringConvertible` errors

### Key Concepts

- Swift errors are values conforming to the `Error` protocol; the convention is to model them as enums with associated values for context.
- `try?` converts a throwing call to an optional (nil on throw); `try!` traps on throw (rarely safe).
- `Result` is useful when you need to store or pass around an error value (e.g. completion handlers) before deciding how to handle it.
- `defer` schedules cleanup to run when the current scope exits, regardless of how (return, throw, break).
- `rethrows` lets a function propagate errors only if its closure parameter throws — used by `map`, `filter`.

```swift
enum LoadError: Error {
    case fileMissing(String)
    case invalidFormat(line: Int)
}

func loadConfig(at url: URL) throws -> [String: String] {
    let handle = openHandle(url)
    defer { closeHandle(handle) }  // runs even if we throw

    let data = try readFile(handle)
    guard let parsed = parse(data) else { throw LoadError.invalidFormat(line: 1) }
    return parsed
}

do {
    let cfg = try loadConfig(at: URL(fileURLWithPath: "/etc/app.conf"))
    print(cfg)
} catch LoadError.fileMissing(let path) {
    print("missing: \(path)")
} catch {
    print("other error: \(error)")
}
```
Caption: throws, try, catch, defer

### Common Pitfalls

- Using `try!` to silence errors — every `try!` is a potential `fatalError`; prefer `try?` + handling or `do/catch`.
- Catching errors too broadly with bare `catch {}` — you lose the error context; at minimum log `error` or `error.localizedDescription`.
- Forgetting `defer` for resource cleanup — opening a file/handle and throwing before closing leaks the resource; defer runs on scope exit.
- Conflating `Result` and `throws` — `Result` is best for stored errors or completion handlers; `throws` is best for synchronous, immediate propagation.
- Throwing non-descriptive errors (`throw NSError(...)`) — define a typed enum so callers can pattern-match exhaustively.

### Real-World Applications

- Apple's Foundation uses `throws` throughout for file I/O, JSON decoding (`JSONDecoder().decode`), and `URLSession` async APIs.
- LinkedIn's networking layer wraps `URLSession` errors in `APIError` enums with associated `statusCode` and `responseData` for rich error handling.
- Airbnb's Swift style guide mandates typed `Error` enums (not `NSError`) so error sites are exhaustive and Swift-idiomatic.
- Lyft uses `Result` in legacy completion-handler APIs, but new code uses `async throws` for cleaner control flow.

### Interview Questions

- 1. What's the difference between `try`, `try?`, and `try!`? — `try` propagates (requires `throws`/`catch`); `try?` returns an optional (nil on throw); `try!` traps on throw.
- 2. When would you use `Result` instead of `throws`? — When the error is a value you want to store, pass to a completion handler, or transform with `map`/`flatMap` before deciding.
- 3. What does `rethrows` do? — A function with a `rethrows` parameter only propagates errors if its closure parameter throws; non-throwing closures don't require `try`.
- 4. What's the rule for `defer` execution? — Deferred blocks run in reverse order of registration when the enclosing scope exits — via return, throw, or early exit.
- 5. Why define errors as enums? — They're sum types, enabling exhaustive `switch` in `catch`; the compiler surfaces every case when you add a new one.

### Mini Project

Build a Config Loader: A `loadConfig(at:) throws -> Config` that reads a file, parses lines like `KEY=VALUE`, validates types, and throws `ConfigError` enums with line numbers. Provide a `loadConfigSafe(at:) -> Result<Config, ConfigError>` wrapper. Suggested approach:
  - `enum ConfigError: Error { case fileMissing; case parseError(line: Int, message: String); case typeMismatch(key: String) }`
  - Use `defer` to close the file handle
  - Use `try?` for an optional variant and `Result` for a stored variant
  - Add a `rethrows` `map(transform:)` helper
  - Write a `do/catch` with exhaustive pattern matching for each case

### Exercises

1. Define `enum MathError: Error { case divideByZero }` and a `func divide(_ a: Int, _ b: Int) throws -> Int`.
2. Call it with `try?` and `try!` to observe the difference.
3. Wrap the throwing function in `Result(catching:)`.
4. Use `defer` to print "done" at the end of a function with multiple early returns.
5. Write a `rethrows` higher-order function that applies a transform to an array element.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `try?` return?
9. A) The success value
10. B) An optional that's nil on throw (*)
11. C) A Result
12. D) Always throws
13. Explanation: `try? expr` evaluates to `Optional.success`; if the expression throws, the result is `nil`. Useful for "don't care about the error" cases.
14. Q2: What does `try!` do on throw?
15. A) Returns nil
16. B) Rethrows to caller
17. C) Traps with a fatal error (*)
18. D) Logs and continues
19. Explanation: `try!` asserts the call won't throw; if it does, the program traps. Use only when failure is logically impossible.
20. Q3: Which protocol must an error type conform to?
21. A) Throwable
22. B) Exception
23. C) Failible
24. D) Error (*)
25. Explanation: Any type conforming to the marker `Error` protocol can be thrown; enums are the conventional choice.
26. Q4: What does `rethrows` mean?
27. A) The function only throws if its closure parameter throws (*)
28. B) The function always throws
29. C) The function never throws
30. D) The function catches all errors
31. Explanation: `rethrows` propagates errors only when a closure argument throws; calling with a non-throwing closure requires no `try`.
32. Q5: When does a `defer` block run?
33. A) Only on return
34. B) When the enclosing scope exits — return, throw, or early exit — in reverse order of registration (*)
35. C) At program end
36. D) On the next line
37. Explanation: `defer` schedules cleanup for any scope exit path, in LIFO order, making it ideal for resource teardown alongside `throws`.
38. Q6: What's the convention for representing errors in Swift?
39. A) Subclass NSError
40. B) Use String messages
41. C) Define an enum conforming to Error with associated values for context (*)
42. D) Throw Int codes
43. Explanation: Enums with associated values give exhaustive pattern matching and structured context (line numbers, paths, codes).
44. Q7: Which is the better choice for an async completion handler?
45. A) `throws`
46. B) Global error state
47. C) `try?` everywhere
48. D) `Result<Success, Failure: Error>` — errors are values you can store and pass (*)
49. Explanation: `Result` lets you store an outcome in a property or pass it to a callback; modern Swift often replaces this with `async throws`.
50. Q8: What does `Result(catching: { try f() })` do?
51. A) Wraps a throwing call into a Result, catching any thrown error as .failure (*)
52. B) Same as `try f()`
53. C) Always returns .success
54. D) Traps on error
55. Explanation: `Result(catching:)` runs the throwing closure and packages the outcome as `.success` or `.failure`, bridging `throws` into `Result`.
56. Q9: What's a downside of bare `catch {}`?
57. A) Compile error
58. B) Swallows the error silently; at minimum log it (*)
59. C) Slows runtime
60. D) None — it's idiomatic
61. Explanation: Bare `catch` discards the error, hiding bugs; catch the specific error or at least print `error.localizedDescription`.
62. Q10: What does `Result.map` do?
63. A) Maps the error type
64. B) Throws
65. C) Transforms the success value, propagating failure unchanged (*)
66. D) Returns Optional
67. Explanation: `map` applies a transform to `.success(value)`, leaving `.failure` untouched. `mapError` is the symmetric operation for the failure side.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `try?` return?
  options:
    - The success value
    - An optional that's nil on throw
    - A Result
    - Always throws
  correctIndex: 1
  explanation: "`try? expr` evaluates to `Optional.success`; if the expression throws, the result is `nil`. Useful for \"don't care about the error\" cases."
- id: q2
  question: What does `try!` do on throw?
  options:
    - Returns nil
    - Rethrows to caller
    - Traps with a fatal error
    - Logs and continues
  correctIndex: 2
  explanation: "`try!` asserts the call won't throw; if it does, the program traps. Use only when failure is logically impossible."
- id: q3
  question: Which protocol must an error type conform to?
  options:
    - Throwable
    - Exception
    - Failible
    - Error
  correctIndex: 3
  explanation: Any type conforming to the marker `Error` protocol can be thrown; enums are the conventional choice.
- id: q4
  question: What does `rethrows` mean?
  options:
    - The function only throws if its closure parameter throws
    - The function always throws
    - The function never throws
    - The function catches all errors
  correctIndex: 0
  explanation: "`rethrows` propagates errors only when a closure argument throws; calling with a non-throwing closure requires no `try`."
- id: q5
  question: When does a `defer` block run?
  options:
    - Only on return
    - When the enclosing scope exits — return, throw, or early exit — in reverse order of registration
    - At program end
    - On the next line
  correctIndex: 1
  explanation: "`defer` schedules cleanup for any scope exit path, in LIFO order, making it ideal for resource teardown alongside `throws`."
- id: q6
  question: What's the convention for representing errors in Swift?
  options:
    - Subclass NSError
    - Use String messages
    - Define an enum conforming to Error with associated values for context
    - Throw Int codes
  correctIndex: 2
  explanation: Enums with associated values give exhaustive pattern matching and structured context (line numbers, paths, codes).
- id: q7
  question: Which is the better choice for an async completion handler?
  options:
    - "`throws`"
    - Global error state
    - "`try?` everywhere"
    - "`Result<Success, Failure: Error>` — errors are values you can store and pass"
  correctIndex: 3
  explanation: "`Result` lets you store an outcome in a property or pass it to a callback; modern Swift often replaces this with `async throws`."
- id: q8
  question: "What does `Result(catching: { try f() })` do?"
  options:
    - Wraps a throwing call into a Result, catching any thrown error as .failure
    - Same as `try f()`
    - Always returns .success
    - Traps on error
  correctIndex: 0
  explanation: "`Result(catching:)` runs the throwing closure and packages the outcome as `.success` or `.failure`, bridging `throws` into `Result`."
- id: q9
  question: What's a downside of bare `catch {}`?
  options:
    - Compile error
    - Swallows the error silently; at minimum log it
    - Slows runtime
    - None — it's idiomatic
  correctIndex: 1
  explanation: Bare `catch` discards the error, hiding bugs; catch the specific error or at least print `error.localizedDescription`.
- id: q10
  question: What does `Result.map` do?
  options:
    - Maps the error type
    - Throws
    - Transforms the success value, propagating failure unchanged
    - Returns Optional
  correctIndex: 2
  explanation: "`map` applies a transform to `.success(value)`, leaving `.failure` untouched. `mapError` is the symmetric operation for the failure side."
```

