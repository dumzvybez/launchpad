---
slug: swift-testing-xctest-swift-testing-xctestplan
id: swift-19
track: swift
order: 19
title: Testing — XCTest, Swift Testing, XCTestPlan
description: Write unit, integration, and UI tests with XCTest and the modern Swift Testing framework, organize tests with XCTestPlan, and measure coverage.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=ySa58y1SRy0&t=1080s
whyItMatters: Write unit, integration, and UI tests with XCTest and the modern Swift Testing framework, organize tests with XCTestPlan, and measure coverage.
deepDiveResources:
  - label: W3Schools Swift
    url: https://www.swift.org/learn/
    kind: course
  - label: Swift Official Docs
    url: https://docs.swift.org/swift-book/
    kind: doc
---

# Testing — XCTest, Swift Testing, XCTestPlan

## Testing — XCTest, Swift Testing, XCTestPlan

### Why It Matters

Write unit, integration, and UI tests with XCTest and the modern Swift Testing framework, organize tests with XCTestPlan, and measure coverage.

Write unit, integration, and UI tests with XCTest and the modern Swift Testing framework, organize tests with XCTestPlan, and measure coverage.

### Prerequisites

- Stage 6: Functions and Closures
- Stage 13: Generics
- Stage 14: Error Handling
- Stage 18: SwiftUI Fundamentals (for UI testing)

### Topics

- XCTest: `XCTestCase`, `setUp`/`tearDown`, `XCTAssertEqual`, etc.
- Swift Testing (Swift 5.10+): `@Test`, `#expect`, `#require`, traits
- Parameterized tests with `@Test` and `arguments:`
- Async and thrown tests
- Mocks and stubs with protocols
- UI tests with `XCUITest`
- Test plans (`XCTestPlan`) for shared configurations
- Code coverage in Xcode
- Snapshot testing (swift-snapshot-testing)
- Performance tests with `measure { }`

### Key Concepts

- XCTest is the legacy framework (JUnit-style, classes); Swift Testing is the new macro-based framework with `@Test`, `#expect`, and richer parameterization.
- `#require` throws on failure (use to bail early); `#expect` records and continues.
- Parameterized tests run the same logic over many inputs — one declaration, N executions.
- Use protocols to inject test doubles (mocks/stubs); don't subclass production types.
- Snapshot testing compares rendered UI to a stored image — great for catching unintended visual regressions.

```swift
import XCTest
@testable import MyApp

final class CalculatorTests: XCTestCase {
    func testAdd() {
        let calc = Calculator()
        XCTAssertEqual(calc.add(2, 3), 5)
    }

    func testDivideByZeroThrows() throws {
        let calc = Calculator()
        XCTAssertThrowsError(try calc.divide(10, by: 0)) { error in
            XCTAssertEqual(error as? CalcError, .divideByZero)
        }
    }
}
```
Caption: XCTest basics

### Common Pitfalls

- Testing implementation details instead of behavior — tests become brittle; prefer testing observable outcomes.
- Sharing mutable state across tests — one test's mutations leak into the next; use `setUp`/`tearDown` or `@Suite` structs that reinit per test.
- Not mocking the network — flaky tests depending on external services; inject a `NetworkClient` protocol and provide a mock.
- Using `XCTAssertTrue` for everything — `XCTAssertEqual` gives better failure messages; in Swift Testing use `#expect(a == b)`.
- Forgetting `@testable import` — without it, internal symbols aren't visible to the test target.

### Real-World Applications

- Apple's standard library ships with thousands of XCTest cases; the Swift Testing framework is itself tested with both.
- LinkedIn's iOS app uses XCTest with a custom mock server for deterministic integration tests, plus snapshot tests for critical screens.
- Airbnb's iOS tests use swift-snapshot-testing to lock down UI appearance and catch regressions across iOS versions.
- Lyft's CI runs Swift Testing suites parameterized over ride types and surge scenarios, catching edge cases with one declaration.

### Interview Questions

- 1. What's the difference between XCTest and Swift Testing? — XCTest is class-based and JUnit-style; Swift Testing (5.10+) uses `@Test` macros, `#expect`, parameterization, and is more concise.
- 2. What's the difference between `#expect` and `#require`? — `#expect` records a failure and continues; `#require` throws, halting the test (use to bail on essential preconditions).
- 3. How do parameterized tests work in Swift Testing? — `@Test(arguments: [...])` runs the function once per argument, each treated as a separate test.
- 4. Why inject dependencies via protocols in tests? — To substitute mocks/stubs for the real network, database, or hardware, making tests deterministic and fast.
- 5. What's snapshot testing and when is it useful? — Compare rendered UI to a stored image; great for catching unintended visual regressions, with the trade-off of needing to review and accept new baselines.

### Mini Project

Build a Test Suite for a Tip Calculator: Write the production `TipCalculator` struct, then write both XCTest and Swift Testing versions of the test suite covering edge cases (0%, 100%, negative bill, rounding). Suggested approach:
  - `struct TipCalculator { func tip(bill: Decimal, pct: Decimal) -> Decimal }`
  - XCTest with `XCTestCase` and `XCTAssertEqual`
  - Swift Testing with `@Test(arguments: [(bill, pct, expected)])`
  - Add `#require(bill >= 0)` guard tests
  - Add a snapshot test on a SwiftUI view using swift-snapshot-testing

### Exercises

1. Write `XCTestCase` tests for `Calculator.add` and `divide`.
2. Rewrite the same tests using Swift Testing `@Test` and `#expect`.
3. Add a parameterized `@Test(arguments:)` for `divide` over multiple denominators.
4. Refactor a production class to take a `NetworkClient` protocol; write a `MockClient` and a test using it.
5. Write a UI test that launches the app, taps a button, and asserts a label appears.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the legacy Apple testing framework?
9. A) Swift Testing
10. B) Quick/Nimble
11. C) XCTest (*)
12. D) XCTestPlan
13. Explanation: XCTest is the original class-based framework (JUnit-style); Swift Testing (5.10+) is the modern macro-based alternative.
14. Q2: Which macro in Swift Testing records a failure and continues?
15. A) #require
16. B) #assert
17. C) #test
18. D) #expect (*)
19. Explanation: `#expect` records a failure and lets the test continue; `#require` throws and halts the test on failure.
20. Q3: What does `@Test(arguments: [...])` do?
21. A) Runs the function once per argument, each as a separate test (*)
22. B) Defines a single test
23. C) Sets a timeout
24. D) Marks the test as async
25. Explanation: Parameterized tests run the function N times — once per argument — and report each as its own test case in results.
26. Q4: What does `@testable import` enable?
27. A) Async tests
28. B) Access to `internal` symbols from the test target (*)
29. C) Mocking
30. D) Coverage
31. Explanation: Without `@testable`, only `public` symbols are visible; `@testable` exposes `internal` so you can unit-test internal types and functions.
32. Q5: What's a primary benefit of injecting dependencies via protocols?
33. A) Performance
34. B) Thread safety
35. C) Substituting mocks/stubs for deterministic, fast tests (*)
36. D) Memory safety
37. Explanation: Protocols let tests swap in mocks for the network, DB, or hardware — eliminating flakiness and avoiding real I/O.
38. Q6: What does `setUp()` do in an XCTestCase?
39. A) Tears down state
40. B) Runs once for the whole suite
41. C) Skips the test
42. D) Runs before each test, initializing shared state (*)
43. Explanation: `setUp()` runs before each test method, providing a clean slate; `tearDown()` runs after each test.
44. Q7: What's the difference between `XCTAssertEqual` and `XCTAssertTrue`?
45. A) `XCTAssertEqual` produces a diff in failure messages; `XCTAssertTrue` just says "failed" (*)
46. B) None
47. C) `XCTAssertTrue` is async
48. D) `XCTAssertEqual` is deprecated
49. Explanation: `XCTAssertEqual(a, b)` reports both values on failure, making debugging easier; `XCTAssertTrue(a == b)` just reports the boolean.
50. Q8: What's snapshot testing used for?
51. A) Performance benchmarks
52. B) Catching unintended visual regressions by comparing rendered UI to a stored image (*)
53. C) Testing networks
54. D) Memory profiling
55. Explanation: Snapshot testing renders a view to an image and diffs against a baseline; useful for catching UI regressions, with the trade-off of needing baseline reviews.
56. Q9: What does `measure { }` do in XCTest?
57. A) Records a video
58. B) Captures a snapshot
59. C) Runs the block 5+ times and reports timing metrics for performance regression tracking (*)
60. D) Throws on slow code
61. Explanation: `measure { ... }` runs the block multiple times, capturing wall-clock and CPU metrics; Xcode tracks them across runs to flag regressions.
62. Q10: How do you write an async test in XCTest?
63. A) `func testFoo() async` — unsupported
64. B) Use expectations only
65. C) Use semaphores
66. D) `func testFoo() async throws` (XCTest supports async since Xcode 13) (*)
67. Explanation: XCTest supports `async throws` on test methods; for older code, use `XCTestExpectation` and `waitForExpectations`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the legacy Apple testing framework?
  options:
    - Swift Testing
    - Quick/Nimble
    - XCTest
    - XCTestPlan
  correctIndex: 2
  explanation: XCTest is the original class-based framework (JUnit-style); Swift Testing (5.10+) is the modern macro-based alternative.
- id: q2
  question: Which macro in Swift Testing records a failure and continues?
  options:
    - "#require"
    - "#assert"
    - "#test"
    - "#expect"
  correctIndex: 3
  explanation: "`#expect` records a failure and lets the test continue; `#require` throws and halts the test on failure."
- id: q3
  question: "What does `@Test(arguments: [...])` do?"
  options:
    - Runs the function once per argument, each as a separate test
    - Defines a single test
    - Sets a timeout
    - Marks the test as async
  correctIndex: 0
  explanation: Parameterized tests run the function N times — once per argument — and report each as its own test case in results.
- id: q4
  question: What does `@testable import` enable?
  options:
    - Async tests
    - Access to `internal` symbols from the test target
    - Mocking
    - Coverage
  correctIndex: 1
  explanation: Without `@testable`, only `public` symbols are visible; `@testable` exposes `internal` so you can unit-test internal types and functions.
- id: q5
  question: What's a primary benefit of injecting dependencies via protocols?
  options:
    - Performance
    - Thread safety
    - Substituting mocks/stubs for deterministic, fast tests
    - Memory safety
  correctIndex: 2
  explanation: Protocols let tests swap in mocks for the network, DB, or hardware — eliminating flakiness and avoiding real I/O.
- id: q6
  question: What does `setUp()` do in an XCTestCase?
  options:
    - Tears down state
    - Runs once for the whole suite
    - Skips the test
    - Runs before each test, initializing shared state
  correctIndex: 3
  explanation: "`setUp()` runs before each test method, providing a clean slate; `tearDown()` runs after each test."
- id: q7
  question: What's the difference between `XCTAssertEqual` and `XCTAssertTrue`?
  options:
    - '`XCTAssertEqual` produces a diff in failure messages; `XCTAssertTrue` just says "failed"'
    - None
    - "`XCTAssertTrue` is async"
    - "`XCTAssertEqual` is deprecated"
  correctIndex: 0
  explanation: "`XCTAssertEqual(a, b)` reports both values on failure, making debugging easier; `XCTAssertTrue(a == b)` just reports the boolean."
- id: q8
  question: What's snapshot testing used for?
  options:
    - Performance benchmarks
    - Catching unintended visual regressions by comparing rendered UI to a stored image
    - Testing networks
    - Memory profiling
  correctIndex: 1
  explanation: Snapshot testing renders a view to an image and diffs against a baseline; useful for catching UI regressions, with the trade-off of needing baseline reviews.
- id: q9
  question: What does `measure { }` do in XCTest?
  options:
    - Records a video
    - Captures a snapshot
    - Runs the block 5+ times and reports timing metrics for performance regression tracking
    - Throws on slow code
  correctIndex: 2
  explanation: "`measure { ... }` runs the block multiple times, capturing wall-clock and CPU metrics; Xcode tracks them across runs to flag regressions."
- id: q10
  question: How do you write an async test in XCTest?
  options:
    - "`func testFoo() async` — unsupported"
    - Use expectations only
    - Use semaphores
    - "`func testFoo() async throws` (XCTest supports async since Xcode 13)"
  correctIndex: 3
  explanation: XCTest supports `async throws` on test methods; for older code, use `XCTestExpectation` and `waitForExpectations`.
```

