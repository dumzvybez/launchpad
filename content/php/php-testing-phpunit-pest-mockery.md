---
slug: php-testing-phpunit-pest-mockery
id: php-19
track: php
order: 19
title: Testing — PHPUnit, Pest, Mockery
description: Write fast, isolated unit tests with PHPUnit and Pest, replace dependencies with Mockery test doubles, and use data providers for table-driven tests.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=14400s
whyItMatters: Write fast, isolated unit tests with PHPUnit and Pest, replace dependencies with Mockery test doubles, and use data providers for table-driven tests.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Testing — PHPUnit, Pest, Mockery

## Testing — PHPUnit, Pest, Mockery

### Why It Matters

Write fast, isolated unit tests with PHPUnit and Pest, replace dependencies with Mockery test doubles, and use data providers for table-driven tests.

Write fast, isolated unit tests with PHPUnit and Pest, replace dependencies with Mockery test doubles, and use data providers for table-driven tests.

### Prerequisites

- Stage 11: OOP — Inheritance, Interfaces, Traits
- Stage 13: Composer and Dependency Management
- Stage 16: Error Handling, Exceptions, and Logging
- Stage 18: Laravel Basics — Routing, Eloquent, Blade

### Topics

- PHPUnit 10 architecture: TestCase, assertions, fixtures
- Pest 2 syntax: `it()`, `test()`, `expect()`, closures
- Test lifecycle: `setUp`, `tearDown`, `setUpBeforeClass`
- Assertions: `assertSame`, `assertEquals`, `expectException`, `assertInstanceOf`
- Data providers (`#[DataProvider]` attribute in PHPUnit 10)
- Mockery: `Mockery::mock()`, expectations, `shouldReceive`, `andReturn`
- Test doubles: stubs, mocks, spies, fakes
- Dependency injection and `Container::bind()` for swapping in tests
- Laravel testing: `RefreshDatabase`, `actingAs`, `json()` test client
- Coverage: `--coverage-html`, `--coverage-text`, Xdebug vs PCOV
- Test naming, AAA pattern (Arrange-Act-Assert), and fast tests (<1s each)

### Key Concepts

- Pest is a layer over PHPUnit with a closure-based DSL: `it('adds two numbers', fn() => expect(add(1, 2))->toBe(3));`. Same engine, less boilerplate.
- A mock verifies behavior (expects calls); a stub returns canned answers (doesn't verify); a spy records calls for later inspection. Use the simplest double that works.
- Data providers run the same test with different inputs: `#[DataProvider('additionCases')]` + a static method returning arrays of arguments.
- `assertEquals` uses loose `==`; `assertSame` uses strict `===`. Prefer `assertSame` for scalars (catches `"3"` vs `3` bugs).
- A good unit test is fast (<100ms), isolated (no DB/network), repeatable (same result every time), and self-verifying (no manual inspection needed).

```php
<?php
// tests/CalculatorTest.php
use App\Calculator;

it('adds two numbers', function () {
    $calc = new Calculator();
    expect($calc->add(2, 3))->toBe(5);
});

it('throws on division by zero', function () {
    $calc = new Calculator();
    $calc->divide(10, 0);
})->throws(InvalidArgumentException::class, 'Cannot divide by zero');

// Dataset (Pest syntax)
it('multiplies correctly', function ($a, $b, $expected) {
    expect((new Calculator())->multiply($a, $b))->toBe($expected);
})->with([
    [2, 3, 6],
    [0, 5, 0],
    [-2, 4, -8],
]);
```
Caption: Pest test basics

### Common Pitfalls

- Using `assertEquals` where `assertSame` is needed — `assertEquals(3, "3")` passes (loose `==`); `assertSame(3, "3")` fails (strict `===`). Prefer `assertSame` for scalars.
- Mocking concrete classes instead of interfaces — Mockery can mock concrete classes (with some limitations), but mocking interfaces is cleaner and decouples tests from implementation details.
- Forgetting `RefreshDatabase` (or migrations) in Laravel feature tests — without it, tests share DB state and become flaky; `RefreshDatabase` rolls back between tests.
- Tests that depend on order or shared state — PHPUnit runs tests in arbitrary order; if test B depends on test A's side effects, it's a flaky test. Each test must set up its own state.
- Mocking everything (over-mocking) — when every test mocks every dependency, you're testing your mocks, not your code. Prefer real objects for value types and simple dependencies; mock only external boundaries (DB, APIs, filesystem).

### Real-World Applications

- Laravel's own test suite has ~30,000 PHPUnit tests; the framework requires PRs to maintain 100% coverage on core packages.
- Symfony's components are tested with PHPUnit and a custom `KernelTestCase` for booting the DI container in tests.
- Wikipedia's MediaWiki uses PHPUnit with database-backed integration tests, isolated per-test with transactions that roll back.
- Slack's Hack codebase used Hacktest (a PHPUnit port) with FBExpect assertions; they ran ~1M tests per CI run on internal infrastructure.

### Interview Questions

- 1. What's the difference between a mock and a stub? — A stub returns canned answers (no behavior verification); a mock verifies that specific calls were made (expectations). Use the simplest double that works.
- 2. Why use `assertSame` over `assertEquals`? — `assertSame` uses strict `===` (catches `"3"` vs `3`); `assertEquals` uses loose `==`. Prefer strict for scalars to catch type bugs.
- 3. What does `RefreshDatabase` do in Laravel tests? — Runs migrations once, then wraps each test in a transaction that rolls back, giving each test a clean DB state without re-migrating.
- 4. What is a data provider? — A method (annotated with `#[DataProvider]` in PHPUnit 10 or `->with()` in Pest) that returns arrays of arguments, running the test once per row — perfect for table-driven tests.
- 5. What makes a "good" unit test? — Fast (<100ms), isolated (no DB/network), repeatable (same result every run), self-verifying (asserts expected outcome), and timely (written close to the code).

### Mini Project

Build a Test Suite for a Calculator Class: A `Calculator` class with `add`, `subtract`, `multiply`, `divide`, and a `History` dependency that records each operation. Write Pest tests covering happy paths, edge cases (division by zero, overflow), and use Mockery to verify the `History` calls. Suggested approach:
  - Install Pest and Mockery via Composer
  - Use Pest datasets for the arithmetic tests (5+ cases each)
  - Mock the `History` interface and assert `record()` is called once per operation
  - Use `throws()` to assert the right exception on division by zero
  - Run `composer test` and `composer test --coverage` to verify ≥90% coverage

### Exercises

1. Install Pest via `composer require --dev pestphp/pest`; write `it('adds', fn() => expect(1+1)->toBe(2));` and run `./vendor/bin/pest`.
2. Refactor a test from `assertEquals` to `assertSame` and observe how `"3"` vs `3` is caught.
3. Use a Pest `->with([...])` dataset to test a slugify function with 5 input/output pairs.
4. Mock a `Logger` interface with Mockery and assert `info()` is called once with a specific message.
5. Write a Laravel feature test using `RefreshDatabase` and `actingAs($user)` to test an authenticated route.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is Pest in the PHP testing ecosystem?
9. A) A mocking library
10. B) A code coverage tool
11. C) A DSL layer over PHPUnit with closure-based syntax (*)
12. D) A benchmarking tool
13. Explanation: Pest is a layer over PHPUnit with a closure-based DSL (`it()`, `expect()`). Same engine, less boilerplate; PHPUnit assertions still work underneath.
14. Q2: Which assertion uses strict `===` comparison?
15. A) assertEquals
16. B) assertLike
17. C) assertLoose
18. D) assertSame (*)
19. Explanation: `assertSame` uses strict `===` (catches `"3"` vs `3`); `assertEquals` uses loose `==`. Prefer `assertSame` for scalars to catch type bugs.
20. Q3: What's the difference between a mock and a stub?
21. A) A stub returns canned answers; a mock verifies calls (*)
22. B) A mock returns canned answers; a stub verifies calls
23. C) They're identical
24. D) A mock is for classes; a stub is for interfaces
25. Explanation: A stub returns canned answers without verifying behavior; a mock verifies that specific calls were made (expectations). Use the simplest double that works.
26. Q4: What does `RefreshDatabase` do?
27. A) Drops and recreates the DB per test
28. B) Runs migrations once, wraps each test in a rollback transaction (*)
29. C) Seeds the DB with factories
30. D) Disables the DB
31. Explanation: `RefreshDatabase` migrates once (or uses an in-memory DB), then wraps each test in a transaction that rolls back — clean state without re-migrating per test (fast).
32. Q5: Which Mockery method sets up a call expectation?
33. A) `expects`
34. B) `willReceive`
35. C) `shouldReceive` (*)
36. D) `mustCall`
37. Explanation: `shouldReceive('method')->once()->with($arg)` sets up a call expectation on a Mockery mock. `MockeryPHPUnitIntegration` trait auto-verifies at test end.
38. Q6: What does the `#[DataProvider]` attribute do?
39. A) Marks a test as slow
40. B) Marks a test as skipped
41. C) Marks a test as a group
42. D) Marks a method as providing datasets for a test (*)
43. Explanation: `#[DataProvider('cases')]` (PHPUnit 10) marks a method as returning an array of argument arrays; the test runs once per row — table-driven tests.
44. Q7: What's the AAA pattern in testing?
45. A) Arrange-Act-Assert (*)
46. B) Assert-Act-Arrange
47. C) Auto-Apply-Assert
48. D) Array-Async-Await
49. Explanation: AAA: Arrange (set up state), Act (call the method under test), Assert (verify the result). Each test should follow this structure for readability.
50. Q8: Which PHP extension provides code coverage for PHPUnit?
51. A) OPcache
52. B) Xdebug or PCOV (*)
53. C) APCu
54. D) Redis
55. Explanation: Xdebug (with `coverage` mode) or PCOV (lighter, faster) provides code coverage. PCOV is recommended for coverage-only use; Xdebug for debugging+coverage.
56. Q9: Why is `actingAs($user)` useful in Laravel tests?
57. A) It seeds the DB
58. B) It mocks the user model
59. C) It authenticates the given user for the test request (*)
60. D) It creates a factory
61. Explanation: `actingAs($user)` logs in the given user for subsequent test requests, so authenticated routes can be tested without going through the login form.
62. Q10: What is "over-mocking"?
63. A) Using Mockery instead of PHPUnit
64. B) Mocking interfaces instead of classes
65. C) Mocking static methods
66. D) Mocking too many classes — testing mocks instead of code (*)
67. Explanation: Over-mocking: every test mocks every dependency, so you're testing your mocks, not your code. Prefer real objects for value types; mock only external boundaries.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is Pest in the PHP testing ecosystem?
  options:
    - A mocking library
    - A code coverage tool
    - A DSL layer over PHPUnit with closure-based syntax
    - A benchmarking tool
  correctIndex: 2
  explanation: Pest is a layer over PHPUnit with a closure-based DSL (`it()`, `expect()`). Same engine, less boilerplate; PHPUnit assertions still work underneath.
- id: q2
  question: Which assertion uses strict `===` comparison?
  options:
    - assertEquals
    - assertLike
    - assertLoose
    - assertSame
  correctIndex: 3
  explanation: '`assertSame` uses strict `===` (catches `"3"` vs `3`); `assertEquals` uses loose `==`. Prefer `assertSame` for scalars to catch type bugs.'
- id: q3
  question: What's the difference between a mock and a stub?
  options:
    - A stub returns canned answers; a mock verifies calls
    - A mock returns canned answers; a stub verifies calls
    - They're identical
    - A mock is for classes; a stub is for interfaces
  correctIndex: 0
  explanation: A stub returns canned answers without verifying behavior; a mock verifies that specific calls were made (expectations). Use the simplest double that works.
- id: q4
  question: What does `RefreshDatabase` do?
  options:
    - Drops and recreates the DB per test
    - Runs migrations once, wraps each test in a rollback transaction
    - Seeds the DB with factories
    - Disables the DB
    - ", then wraps each test in a transaction that rolls back — clean state without re-migrating per test (fast)."
  correctIndex: 1
  explanation: "`RefreshDatabase` migrates once (or uses an in-memory DB), then wraps each test in a transaction that rolls back — clean state without re-migrating per test (fast)."
- id: q5
  question: Which Mockery method sets up a call expectation?
  options:
    - "`expects`"
    - "`willReceive`"
    - "`shouldReceive`"
    - "`mustCall`"
  correctIndex: 2
  explanation: "`shouldReceive('method')->once()->with($arg)` sets up a call expectation on a Mockery mock. `MockeryPHPUnitIntegration` trait auto-verifies at test end."
- id: q6
  question: What does the `#[DataProvider]` attribute do?
  options:
    - Marks a test as slow
    - Marks a test as skipped
    - Marks a test as a group
    - Marks a method as providing datasets for a test
  correctIndex: 3
  explanation: "`#[DataProvider('cases')]` (PHPUnit 10) marks a method as returning an array of argument arrays; the test runs once per row — table-driven tests."
- id: q7
  question: What's the AAA pattern in testing?
  options:
    - Arrange-Act-Assert
    - Assert-Act-Arrange
    - Auto-Apply-Assert
    - Array-Async-Await
  correctIndex: 0
  explanation: "AAA: Arrange (set up state), Act (call the method under test), Assert (verify the result). Each test should follow this structure for readability."
- id: q8
  question: Which PHP extension provides code coverage for PHPUnit?
  options:
    - OPcache
    - Xdebug or PCOV
    - APCu
    - Redis
  correctIndex: 1
  explanation: Xdebug (with `coverage` mode) or PCOV (lighter, faster) provides code coverage. PCOV is recommended for coverage-only use; Xdebug for debugging+coverage.
- id: q9
  question: Why is `actingAs($user)` useful in Laravel tests?
  options:
    - It seeds the DB
    - It mocks the user model
    - It authenticates the given user for the test request
    - It creates a factory
  correctIndex: 2
  explanation: "`actingAs($user)` logs in the given user for subsequent test requests, so authenticated routes can be tested without going through the login form."
- id: q10
  question: What is "over-mocking"?
  options:
    - Using Mockery instead of PHPUnit
    - Mocking interfaces instead of classes
    - Mocking static methods
    - Mocking too many classes — testing mocks instead of code
  correctIndex: 3
  explanation: "Over-mocking: every test mocks every dependency, so you're testing your mocks, not your code. Prefer real objects for value types; mock only external boundaries."
```

