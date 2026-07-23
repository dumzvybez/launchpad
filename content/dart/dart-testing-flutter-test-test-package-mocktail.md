---
slug: dart-testing-flutter-test-test-package-mocktail
id: dart-16
track: dart
order: 16
title: Testing — flutter_test, test package, mocktail
description: Write unit, widget, and integration tests in Dart using the `test` package and `flutter_test`; mock dependencies with `mocktail`; measure coverage; integrate with CI.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=9000s
whyItMatters: Write unit, widget, and integration tests in Dart using the `test` package and `flutter_test`; mock dependencies with `mocktail`; measure coverage; integrate with CI.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Testing — flutter_test, test package, mocktail

## Testing — flutter_test, test package, mocktail

### Why It Matters

Write unit, widget, and integration tests in Dart using the `test` package and `flutter_test`; mock dependencies with `mocktail`; measure coverage; integrate with CI.

Write unit, widget, and integration tests in Dart using the `test` package and `flutter_test`; mock dependencies with `mocktail`; measure coverage; integrate with CI.

### Prerequisites

- Stage 4: Functions, Parameters, and Closures
- Stage 7: Classes, Constructors, and Named Parameters
- Stage 11: Async Programming — Future, async/await
- Stage 13: Error Handling — try/catch, custom exceptions

### Topics

- The `test` package: `test()`, `group()`, `expect()`, `setUp`/`tearDown`
- Matchers: `equals`, `isA`, `throwsA`, `contains`, `completion`, `throwsException`
- `flutter_test`: `testWidgets`, `WidgetTester`, `pumpWidget`, `pump`, `find`
- Mocking with `mocktail`: `registerMocks`, `when(() => ...).thenReturn(...)`, `verify(...)`
- Parameterized tests via `@TestOn` and loops; data-driven tests
- Coverage with `dart test --coverage` + `format_coverage`
- Golden tests for widget screenshots
- Running tests in CI: `dart test`, `flutter test`

### Key Concepts

- Tests live in `test/` and run via `dart test` (or `flutter test`); each file is a test suite.
- `group()` organizes related tests; `setUp`/`tearDown` run before/after each test in the group.
- `expect(actual, matcher)` is the assertion; matchers compose (`allOf`, `anyOf`).
- `mocktail` is a null-safe mocking library with no mirrors — it generates stubs at runtime via noSuchMethod.
- Widget tests use `testWidgets` and a `WidgetTester` to pump the widget tree, interact, and assert via `find.byType`, `find.text`, etc.
- Goldens compare rendered pixels against a reference image; `flutter test --update-goldens` regenerates references.

```dart
import 'package:test/test.dart';

int add(int a, int b) => a + b;

void main() {
  group('add', () {
    test('adds two positive numbers', () {
      expect(add(2, 3), equals(5));
    });

    test('handles negatives', () {
      expect(add(-2, -3), equals(-5));
    });

    test('throws on overflow (hypothetical)', () {
      // expect(() => add(maxInt, 1), throwsA(isA<OverflowError>()));
    });
  });
}
```
Caption: Unit tests

### Common Pitfalls

- Calling `setState` after async without `mounted` check — widget tests may catch this if you `pump` after the await; production code must guard with `if (mounted) setState(...)`.
- Forgetting `await tester.pump()` after an action — pump rebuilds the widget tree and runs pending microtasks; without it, assertions see stale state.
- Mocking too much — over-mocking makes tests brittle and disconnected from real behavior; prefer real implementations for value objects, mock only boundaries (network, DB, time).
- Tests that depend on `DateTime.now()` — flaky; inject a `Clock` or pass a `DateTime` parameter.
- Not waiting for async assertions — `expect(future, completion(equals(5)))` works; `expect(await future, equals(5))` is clearer. Mixing them up causes confusing failures.

### Real-World Applications

- Flutter's own framework ships thousands of tests in `flutter/test/`, used as a reference by app teams worldwide.
- The Hamilton app uses golden tests to lock in pixel-perfect UI regressions across releases.
- Alibaba's Xianyu uses `mocktail` to mock its API layer in widget tests, enabling fast feedback without a backend.
- eBay Motors uses integration tests (`integration_test` package) to verify camera permission flows on a real device farm.

### Interview Questions

- 1. What's the difference between unit, widget, and integration tests in Flutter? — Unit tests pure Dart logic; widget tests a single widget in isolation; integration tests the full app on a device/simulator.
- 2. Why use `mocktail` over `mockito`? — `mocktail` is null-safe and uses no code generation; `mockito` requires `build_runner` and annotations.
- 3. What does `tester.pump()` do? — Triggers a frame and runs microtasks; `pumpAndSettle` pumps until no more frames are scheduled (animations complete).
- 4. How do you test a widget that uses `DateTime.now()`? — Inject a `Clock` (from `package:clock`) and use `Clock.fixed(...)` in tests for determinism.
- 5. How do you measure test coverage? — `dart test --coverage=coverage` generates coverage data; format to lcov and upload to Codecov/Coveralls.

### Mini Project

Build a TDD String Calculator: Build a `StringCalculator` with `int add(String input)` that handles comma and newline delimiters, custom delimiters (`//;\n1;2`), and throws on negatives — all test-first. Write at least 8 unit tests covering edge cases, then implement until tests pass. Suggested approach:
  - Start with empty string → 0
  - Single number → that number
  - Two numbers → sum
  - Newlines as delimiters
  - Custom `//<delim>\n` prefix
  - Negative numbers throw `NegativesNotAllowedException`
  - Numbers > 1000 ignored
  - Run `dart test --coverage` and aim for 100% on the calculator file

### Exercises

1. Write three unit tests for the `add` function from Stage 4 using `test` and `expect`.
2. Mock an `ApiClient` with `mocktail` and verify it's called once.
3. Write a widget test for a `Counter` that increments on tap.
4. Add a golden test for a `Scaffold` with a colored `Container`.
5. Generate coverage and report the percentage via `format_coverage`.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which package is used for unit tests in pure Dart?
9. A) flutter_test
10. B) mocktail
11. C) junit
12. D) test (*)
13. Explanation: The `test` package provides `test()`, `group()`, `expect()` for pure Dart. `flutter_test` builds on it for widget tests.
14. Q2: What does `mocktail` use to stub methods?
15. A) Runtime noSuchMethod interception (*)
16. B) Code generation via build_runner
17. C) Reflection (mirrors)
18. D) Macros
19. Explanation: `mocktail` extends `Mock` and intercepts method calls via `noSuchMethod`, so no codegen is needed — unlike `mockito` which uses annotations + build_runner.
20. Q3: What does `tester.pump()` do?
21. A) Cancels pending timers
22. B) Triggers a frame and runs pending microtasks (*)
23. C) Restarts the widget tree
24. D) Throws if no widget is loaded
25. Explanation: `pump()` triggers one frame and drains microtasks; `pumpAndSettle()` pumps repeatedly until no more frames are scheduled (e.g., animations finish).
26. Q4: Where do test files live?
27. A) lib/test/
28. B) spec/
29. C) test/ (*)
30. D) __tests__/
31. Explanation: Dart convention is `test/` at the project root; `dart test` discovers `_test.dart` files there.
32. Q5: Which matcher checks that a function throws?
33. A) expect(fn, throws)
34. B) expect(fn, throwsException)
35. C) try(fn).throws
36. D) expect(() => fn(), throwsA(isA<Exception>())) (*)
37. Explanation: `throwsA(matcher)` matches an exception; pass `isA<Exception>()` to check the type. The actual call must be wrapped in a closure so the matcher can invoke it.
38. Q6: What's the difference between `pump` and `pumpAndSettle`?
39. A) pump triggers one frame; pumpAndSettle pumps until idle (*)
40. B) Nothing
41. C) pump is for unit tests; pumpAndSettle for widget tests
42. D) pumpAndSettle is faster
43. Explanation: `pump()` advances one frame (or by a duration if given); `pumpAndSettle()` pumps repeatedly until no more frames are scheduled — used to wait for animations.
44. Q7: What's a golden test?
45. A) A test that always passes
46. B) A pixel comparison against a reference image (*)
47. C) A test using a golden (master) isolate
48. D) A performance benchmark
49. Explanation: Golden tests render a widget to an image and compare against a stored reference; `flutter test --update-goldens` regenerates references.
50. Q8: How do you measure coverage?
51. A) dart coverage
52. B) dart analyze --coverage
53. C) dart test --coverage=coverage (*)
54. D) dart pub coverage
55. Explanation: `dart test --coverage=coverage` writes per-file coverage data; `format_coverage` converts to lcov for upload to Codecov/Coveralls.
56. Q9: What's the issue with `DateTime.now()` in tests?
57. A) It returns the wrong time zone
58. B) It throws in tests
59. C) It's deprecated
60. D) It's non-deterministic — flaky tests (*)
61. Explanation: Tests that depend on `DateTime.now()` produce different values per run; inject a `Clock` and use `Clock.fixed(...)` for determinism.
62. Q10: Which package provides `testWidgets`?
63. A) flutter_test (*)
64. B) test
65. C) mocktail
66. D) integration_test
67. Explanation: `flutter_test` provides `testWidgets`, `WidgetTester`, `find`, and `pumpWidget` for testing Flutter widgets in isolation.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which package is used for unit tests in pure Dart?
  options:
    - flutter_test
    - mocktail
    - junit
    - test
  correctIndex: 3
  explanation: The `test` package provides `test()`, `group()`, `expect()` for pure Dart. `flutter_test` builds on it for widget tests.
- id: q2
  question: What does `mocktail` use to stub methods?
  options:
    - Runtime noSuchMethod interception
    - Code generation via build_runner
    - Reflection (mirrors)
    - Macros
  correctIndex: 0
  explanation: "`mocktail` extends `Mock` and intercepts method calls via `noSuchMethod`, so no codegen is needed — unlike `mockito` which uses annotations + build_runner."
- id: q3
  question: What does `tester.pump()` do?
  options:
    - Cancels pending timers
    - Triggers a frame and runs pending microtasks
    - Restarts the widget tree
    - Throws if no widget is loaded
  correctIndex: 1
  explanation: "`pump()` triggers one frame and drains microtasks; `pumpAndSettle()` pumps repeatedly until no more frames are scheduled (e.g., animations finish)."
- id: q4
  question: Where do test files live?
  options:
    - lib/test/
    - spec/
    - test/
    - __tests__/
  correctIndex: 2
  explanation: Dart convention is `test/` at the project root; `dart test` discovers `_test.dart` files there.
- id: q5
  question: Which matcher checks that a function throws?
  options:
    - expect(fn, throws)
    - expect(fn, throwsException)
    - try(fn).throws
    - expect(() => fn(), throwsA(isA<Exception>()))
  correctIndex: 3
  explanation: "`throwsA(matcher)` matches an exception; pass `isA<Exception>()` to check the type. The actual call must be wrapped in a closure so the matcher can invoke it."
- id: q6
  question: What's the difference between `pump` and `pumpAndSettle`?
  options:
    - pump triggers one frame; pumpAndSettle pumps until idle
    - Nothing
    - pump is for unit tests; pumpAndSettle for widget tests
    - pumpAndSettle is faster
  correctIndex: 0
  explanation: "`pump()` advances one frame (or by a duration if given); `pumpAndSettle()` pumps repeatedly until no more frames are scheduled — used to wait for animations."
- id: q7
  question: What's a golden test?
  options:
    - A test that always passes
    - A pixel comparison against a reference image
    - A test using a golden (master) isolate
    - A performance benchmark
  correctIndex: 1
  explanation: Golden tests render a widget to an image and compare against a stored reference; `flutter test --update-goldens` regenerates references.
- id: q8
  question: How do you measure coverage?
  options:
    - dart coverage
    - dart analyze --coverage
    - dart test --coverage=coverage
    - dart pub coverage
  correctIndex: 2
  explanation: "`dart test --coverage=coverage` writes per-file coverage data; `format_coverage` converts to lcov for upload to Codecov/Coveralls."
- id: q9
  question: What's the issue with `DateTime.now()` in tests?
  options:
    - It returns the wrong time zone
    - It throws in tests
    - It's deprecated
    - It's non-deterministic — flaky tests
  correctIndex: 3
  explanation: Tests that depend on `DateTime.now()` produce different values per run; inject a `Clock` and use `Clock.fixed(...)` for determinism.
- id: q10
  question: Which package provides `testWidgets`?
  options:
    - flutter_test
    - test
    - mocktail
    - integration_test
  correctIndex: 0
  explanation: "`flutter_test` provides `testWidgets`, `WidgetTester`, `find`, and `pumpWidget` for testing Flutter widgets in isolation."
```

