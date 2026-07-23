---
slug: dart-error-handling-try-catch-custom-exceptions
id: dart-13
track: dart
order: 13
title: Error Handling — try/catch, custom exceptions
description: Master Dart's error model — `throw`, `try`/`on`/`catch`/`finally`, the difference between `Exception` and `Error`, custom exception types, and async error propagation.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=7200s
whyItMatters: Master Dart's error model — `throw`, `try`/`on`/`catch`/`finally`, the difference between `Exception` and `Error`, custom exception types, and async error propagation.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Error Handling — try/catch, custom exceptions

## Error Handling — try/catch, custom exceptions

### Why It Matters

Master Dart's error model — `throw`, `try`/`on`/`catch`/`finally`, the difference between `Exception` and `Error`, custom exception types, and async error propagation.

Master Dart's error model — `throw`, `try`/`on`/`catch`/`finally`, the difference between `Exception` and `Error`, custom exception types, and async error propagation.

### Prerequisites

- Stage 11: Async Programming — Future, async/await
- Stage 12: Streams — Single and Broadcast

### Topics

- `throw` and the fact that Dart lets you throw anything (not just Exceptions)
- `try` / `on Type` / `catch (e, st)` / `finally`
- The `Exception` vs `Error` distinction (programmer bugs vs runtime failures)
- Custom exceptions: `class MyException implements Exception`
- `StackTrace` and `print(st)` for debugging
- Async errors: rejected Futures, `catchError`, `try/await`
- `Never` as the return type of a function that always throws
- The `noThrows` lint and strict error handling

### Key Concepts

- Dart distinguishes Errors (programmer mistakes — IndexError, StateError, AssertionError; usually not caught) from Exceptions (runtime conditions like network failures; should be caught).
- `on ExceptionType catch (e)` catches a specific type; bare `catch (e, st)` catches everything (avoid in production code; use specific types).
- The stack trace is the second parameter to `catch` — always log it for debugging.
- Async errors propagate through the Future chain; `await`ing a Future that completes with an error re-throws synchronously at the await point.
- You can throw any non-null object, but throwing `String` or `int` is anti-pattern; throw an Exception or Error subclass.
- A function with return type `Never` never returns normally — it always throws or loops forever; useful for "unreachable" markers.

```dart
Future<void> run() async {
  try {
    final data = await fetchData();
    process(data);
  } on TimeoutException catch (e) {
    print('timeout: $e');
  } on FormatException catch (e) {
    print('format: $e');
  } catch (e, st) {
    print('unexpected: $e\n$st');
  } finally {
    cleanup();
  }
}
```
Caption: try/on/catch/finally

### Common Pitfalls

- Catching `catch (e)` and swallowing — silent failures are the worst kind of bug; at minimum log the error and stack trace, or rethrow.
- Confusing `Exception` and `Error` — Errors (StateError, ArgumentError, AssertionError) signal programmer mistakes; you usually shouldn't catch them in production. Catch Exceptions for expected runtime conditions.
- Throwing strings or ints — `throw 'oops'` is legal but breaks `on Exception catch`; always throw an Exception or Error subclass.
- Forgetting the stack trace — `catch (e)` loses the trace; use `catch (e, st)` and log both for debugging.
- Rethrowing with `throw e` vs `rethrow` — `throw e` resets the stack trace to the current location, hiding the original throw site; use `rethrow` to preserve it.

### Real-World Applications

- Flutter's framework distinguishes between framework Errors (which go to FlutterError.onError) and user-thrown Exceptions (which propagate normally).
- The Hamilton app uses a custom `ApiException` hierarchy to map HTTP errors to user-friendly messages in the UI.
- Alibaba's Xianyu uses `Never`-returning assertion helpers to mark unreachable code paths, with the compiler verifying exhaustiveness.
- eBay Motors uses error-zone isolation (runZonedGuarded) to keep one feature's error from crashing the whole app.

### Interview Questions

- 1. What's the difference between `Exception` and `Error` in Dart? — Errors signal programmer bugs (AssertionError, StateError); Exceptions signal expected runtime conditions (network, IO). Catch Exceptions; fix Errors.
- 2. What does `on T catch (e, st)` do? — Catches only exceptions of type T (or subtype), binding the exception to `e` and the stack trace to `st`.
- 3. Why use `rethrow` instead of `throw e`? — `rethrow` preserves the original stack trace; `throw e` resets it to the current line, making debugging harder.
- 4. What is `Never` useful for? — Marking functions that never return (always throw or loop) and proving to the compiler that a code path is unreachable.
- 5. Can you throw a non-Exception in Dart? — Yes, any non-null object can be thrown, but doing so defeats `on Exception catch` and is considered bad practice.

### Mini Project

Build a Custom Exception Hierarchy: Define `AppException` as the base, with `NetworkException`, `AuthException`, `ValidationException`, and `NotFoundException` as subclasses. Implement a `SafeRunner<T>` that wraps an async function, catches each type, and returns a `Result<T>` (Success or Failure from Stage 9). Log all errors with stack traces via a `Logger`. Suggested approach:
  - `sealed class AppException implements Exception` with subclasses per type
  - `Future<Result<T>> safeRun<T>(Future<T> Function() op)` that try/catches
  - Use `catch (e, st)` to capture the stack trace
  - Map each exception type to a `Failure(error)` record
  - Print formatted errors with stack traces in debug mode

### Exercises

1. Throw and catch a custom `FormatException`-like exception from a parser.
2. Use `rethrow` in a wrapper that logs and re-throws.
3. Implement a function returning `Never` that always throws `UnsupportedError`.
4. Demonstrate async error propagation: throw inside a Future, catch at the caller.
5. Use `runZonedGuarded` to isolate uncaught errors in a small script.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: In Dart, what can you throw?
9. A) Any non-null object (*)
10. B) Only Exception subclasses
11. C) Only Error subclasses
12. D) Only strings
13. Explanation: Dart allows throwing any non-null object, but idiomatic code throws Exception or Error subclasses so `on T catch` works.
14. Q2: What's the difference between `Exception` and `Error`?
15. A) Errors are recoverable; Exceptions aren't
16. B) Errors signal programmer bugs; Exceptions signal expected runtime conditions (*)
17. C) They're identical
18. D) Errors are async; Exceptions are sync
19. Explanation: Errors (AssertionError, StateError, ArgumentError) indicate programmer mistakes; Exceptions (TimeoutException, FormatException) indicate expected runtime conditions you should catch.
20. Q3: How do you preserve the original stack trace when rethrowing?
21. A) throw e
22. B) throw Exception(e)
23. C) rethrow (*)
24. D) throw StackTrace.current
25. Explanation: `rethrow` keeps the original stack trace; `throw e` resets the trace to the current line, hiding where the error originated.
26. Q4: Which catches only TimeoutException?
27. A) catch (e)
28. B) catch (TimeoutException e)
29. C) try (TimeoutException e)
30. D) on TimeoutException catch (e) (*)
31. Explanation: `on T catch (e, st)` filters by type; bare `catch (e)` catches everything, which is rarely what you want in production.
32. Q5: What is the return type of a function that always throws?
33. A) Never (*)
34. B) void
35. C) Null
36. D) dynamic
37. Explanation: `Never` is the bottom type signaling the function never returns normally; the compiler uses it for exhaustiveness and unreachable-code reasoning.
38. Q6: What does `catch (e, st)` bind?
39. A) e to the stack, st to the error
40. B) e to the error, st to the stack trace (*)
41. C) Both to the error
42. D) Both to the stack
43. Explanation: The first parameter is the exception object; the optional second is the StackTrace. Always log both for debuggable errors.
44. Q7: How do async errors propagate?
45. A) They don't — only sync errors propagate
46. B) As separate events on the event loop
47. C) Through the Future chain; `await` re-throws at the await site (*)
48. D) Only via try/catch in the originating function
49. Explanation: A Future that completes with an error rejects the chain; `await`-ing it re-throws synchronously at the await point, where you can `try`/`catch` it.
50. Q8: What does `finally` do?
51. A) Catches all errors
52. B) Only runs on success
53. C) Only runs on error
54. D) Runs cleanup code regardless of success or failure (*)
55. Explanation: `finally` runs after try (and any catch), whether the try block succeeded or threw — perfect for closing resources.
56. Q9: What's wrong with `catch (e) { /* nothing */ }`?
57. A) It silently swallows errors, hiding bugs (*)
58. B) Nothing — it's fine
59. C) It crashes the program
60. D) It logs the error automatically
61. Explanation: Empty catch blocks hide errors from operators and developers; at minimum log the error, and consider whether you really should swallow it.
62. Q10: What does `runZonedGuarded` do?
63. A) Runs code in a new isolate
64. B) Runs code in an error zone, catching uncaught sync and async errors (*)
65. C) Guards against type errors
66. D) Catches only Errors, not Exceptions
67. Explanation: `runZonedGuarded(body, onError)` runs `body` in a zone that intercepts uncaught errors (sync and async), useful for app-level error containment in Flutter.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: In Dart, what can you throw?
  options:
    - Any non-null object
    - Only Exception subclasses
    - Only Error subclasses
    - Only strings
  correctIndex: 0
  explanation: Dart allows throwing any non-null object, but idiomatic code throws Exception or Error subclasses so `on T catch` works.
- id: q2
  question: What's the difference between `Exception` and `Error`?
  options:
    - Errors are recoverable; Exceptions aren't
    - Errors signal programmer bugs; Exceptions signal expected runtime conditions
    - They're identical
    - Errors are async; Exceptions are sync
  correctIndex: 1
  explanation: Errors (AssertionError, StateError, ArgumentError) indicate programmer mistakes; Exceptions (TimeoutException, FormatException) indicate expected runtime conditions you should catch.
- id: q3
  question: How do you preserve the original stack trace when rethrowing?
  options:
    - throw e
    - throw Exception(e)
    - rethrow
    - throw StackTrace.current
  correctIndex: 2
  explanation: "`rethrow` keeps the original stack trace; `throw e` resets the trace to the current line, hiding where the error originated."
- id: q4
  question: Which catches only TimeoutException?
  options:
    - catch (e)
    - catch (TimeoutException e)
    - try (TimeoutException e)
    - on TimeoutException catch (e)
  correctIndex: 3
  explanation: "`on T catch (e, st)` filters by type; bare `catch (e)` catches everything, which is rarely what you want in production."
- id: q5
  question: What is the return type of a function that always throws?
  options:
    - Never
    - void
    - "Null"
    - dynamic
  correctIndex: 0
  explanation: "`Never` is the bottom type signaling the function never returns normally; the compiler uses it for exhaustiveness and unreachable-code reasoning."
- id: q6
  question: What does `catch (e, st)` bind?
  options:
    - e to the stack, st to the error
    - e to the error, st to the stack trace
    - Both to the error
    - Both to the stack
  correctIndex: 1
  explanation: The first parameter is the exception object; the optional second is the StackTrace. Always log both for debuggable errors.
- id: q7
  question: How do async errors propagate?
  options:
    - They don't — only sync errors propagate
    - As separate events on the event loop
    - Through the Future chain; `await` re-throws at the await site
    - Only via try/catch in the originating function
  correctIndex: 2
  explanation: A Future that completes with an error rejects the chain; `await`-ing it re-throws synchronously at the await point, where you can `try`/`catch` it.
- id: q8
  question: What does `finally` do?
  options:
    - Catches all errors
    - Only runs on success
    - Only runs on error
    - Runs cleanup code regardless of success or failure
  correctIndex: 3
  explanation: "`finally` runs after try (and any catch), whether the try block succeeded or threw — perfect for closing resources."
- id: q9
  question: What's wrong with `catch (e) { /* nothing */ }`?
  options:
    - It silently swallows errors, hiding bugs
    - Nothing — it's fine
    - It crashes the program
    - It logs the error automatically
  correctIndex: 0
  explanation: Empty catch blocks hide errors from operators and developers; at minimum log the error, and consider whether you really should swallow it.
- id: q10
  question: What does `runZonedGuarded` do?
  options:
    - Runs code in a new isolate
    - Runs code in an error zone, catching uncaught sync and async errors
    - Guards against type errors
    - Catches only Errors, not Exceptions
  correctIndex: 1
  explanation: "`runZonedGuarded(body, onError)` runs `body` in a zone that intercepts uncaught errors (sync and async), useful for app-level error containment in Flutter."
```

