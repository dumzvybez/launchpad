---
slug: kotlin-testing-junit-5-mockk-kotest-turbine
id: kotlin-19
track: kotlin
order: 19
title: Testing — JUnit 5, MockK, Kotest, Turbine
description: Test Kotlin code with JUnit 5 (via kotlin.test), mock with MockK, write expressive specs in Kotest, and verify Flows with Turbine.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=dzUc9vrsldM&t=9720s
whyItMatters: Test Kotlin code with JUnit 5 (via kotlin. test), mock with MockK, write expressive specs in Kotest, and verify Flows with Turbine.
deepDiveResources:
  - label: W3Schools Kotlin
    url: https://www.w3schools.com/kotlin/
    kind: course
  - label: Kotlin Official Docs
    url: https://kotlinlang.org/docs/home.html
    kind: doc
---

# Testing — JUnit 5, MockK, Kotest, Turbine

## Testing — JUnit 5, MockK, Kotest, Turbine

### Why It Matters

Test Kotlin code with JUnit 5 (via kotlin. test), mock with MockK, write expressive specs in Kotest, and verify Flows with Turbine.

Test Kotlin code with JUnit 5 (via kotlin.test), mock with MockK, write expressive specs in Kotest, and verify Flows with Turbine.

### Prerequisites

- Stage 1-18.
- Comfort with coroutines, Flows, and the language so far.

### Topics

- JUnit 5 with `kotlin.test` annotations
- `@Test`, `@BeforeEach`, `@DisplayName`, `@ParameterizedTest`
- Assertions: kotlin.test assertEquals, assertThrows, assertNotNull
- MockK: `every`, `verify`, `relaxed = true`, `slot`
- Suspending mocks: `coEvery`, `coVerify`
- Kotest: BehaviorSpec, StringSpec, property testing
- Turbine for Flow testing: `awaitItem`, `awaitComplete`
- `runTest` for coroutine tests

### Key Concepts

- `kotlin.test` provides a thin, multiplatform wrapper over JUnit 5 (JVM) and other engines — your tests work on Kotlin/JS and Kotlin/Native too.
- MockK is Kotlin-first: handles final classes, suspending functions, extension functions, and objects (which Java mocking frameworks struggle with).
- `coEvery { repo.fetch() } returns ...` mocks suspend functions; regular `every` is for non-suspend.
- Kotest offers multiple spec styles (BehaviorSpec, StringSpec, FreeSpec) and property-based testing for generative testing.
- Turbine is a tiny library that lets you collect a Flow in a test and assert emissions one-by-one with `awaitItem()`.

```kotlin
import kotlin.test.*

class CalculatorTest {
    private lateinit var calc: Calculator

    @BeforeTest
    fun setUp() { calc = Calculator() }

    @Test
    fun `adds two numbers`() {
        assertEquals(5, calc.add(2, 3))
    }

    @Test
    fun `throws on divide by zero`() {
        assertFailsWith<ArithmeticException> { calc.divide(1, 0) }
    }
}
```
Caption: JUnit 5 + kotlin.test

### Common Pitfalls

- Using `runBlocking` in coroutine tests — use `runTest` instead; it skips delays and runs on a virtual-time dispatcher for speed.
- Forgetting `coEvery`/`coVerify` for suspend functions — `every` is for non-suspend; using it on a suspend function fails to mock.
- Mocking value classes or final classes without MockK — Java mocking frameworks (Mockito) choke on Kotlin's final-by-default; MockK handles them out of the box.
- Not unmocking after a test — MockK's `clearAllMocks()` or `clearMocks(mock)` in `@AfterEach` prevents test pollution; JUnit 5 extensions help.
- Asserting on Flow with `toList()` only — works for cold finite flows but loses timing info; use Turbine for emissions order, errors, and completion.

### Real-World Applications

- Square uses MockK in Cash App's massive Android test suite because it handles final classes and suspend functions natively.
- JetBrains' Kotlin compiler tests use JUnit 5 with parameterized tests for thousands of codegen cases.
- Slack's Android team uses Kotest's property testing for generative state-machine tests of complex UI flows.
- Cash App open-sourced Turbine for Flow testing — used across the Android ecosystem now.

### Interview Questions

- 1. Why prefer MockK over Mockito for Kotlin? — MockK handles final classes, suspend functions, extension functions, and objects natively; Mockito needs the mockito-inline hack and still struggles with suspend.
- 2. What does `runTest` do that `runBlocking` doesn't? — `runTest` runs on a virtual-time test dispatcher and auto-advances delays, so tests are fast and deterministic.
- 3. Difference between `every` and `coEvery`? — `every` mocks a regular function; `coEvery` mocks a `suspend` function — using the wrong one fails to mock.
- 4. What is Turbine for? — Testing `Flow` emissions in order with `awaitItem()`, `awaitComplete()`, `awaitError()` — much cleaner than `toList()` for non-trivial flows.
- 5. What are Kotest's spec styles? — BehaviorSpec (given/when/then), StringSpec ("test name" { }), FreeSpec, ShouldSpec, etc.; pick one and stay consistent.

### Mini Project

Build a Tested User Service: A `UserService` with `suspend fun load(id): User` that calls a `UserRepo`; write JUnit 5 tests with MockK (happy path + not-found), a Kotest BehaviorSpec, and a Turbine test for a `userFlow`. Suggested approach:
  - `interface UserRepo { suspend fun findById(id: String): User? }`
  - `class UserService(val repo: UserRepo) { suspend fun load(id: String) = repo.findById(id) ?: throw NotFound() }`
  - JUnit test with `coEvery { repo.findById("u1") } returns User("a")` and `coVerify`
  - Kotest BehaviorSpec with the same logic
  - Turbine test for `service.userFlow()` that emits Loading -> Success

### Exercises

1. Write a JUnit 5 test for `Calculator.add` and `divide` (with `assertFailsWith<ArithmeticException>`).
2. Use MockK to mock a `UserRepo` and verify a service method calls it exactly once with `coVerify`.
3. Convert one JUnit test to a Kotest BehaviorSpec and compare readability.
4. Write a Turbine test for `flowOf(1, 2, 3)` asserting three items and completion.
5. Use `runTest` to test a `suspend fun` that uses `delay(1000)` and verify the test runs in milliseconds, not seconds.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which library is Kotlin-first for mocking?
9. A) Mockito
10. B) EasyMock
11. C) MockK (*)
12. D) PowerMock
13. Explanation: MockK is built for Kotlin — handles final classes, suspend functions, extension functions, and objects out of the box; Mockito needs `mockito-inline` and still struggles.
14. Q2: Which function mocks a `suspend` function?
15. A) `every`
16. B) `mock`
17. C) `stub`
18. D) `coEvery` (*)
19. Explanation: `coEvery { repo.fetch() } returns ...` mocks a suspend function; `every` is for non-suspend functions and will fail on suspend.
20. Q3: Why use `runTest` instead of `runBlocking` for coroutine tests?
21. A) `runTest` runs on virtual time and auto-skips delays for speed (*)
22. B) `runBlocking` is deprecated
23. C) `runBlocking` only works on JVM
24. D) `runTest` requires Spring
25. Explanation: `runTest` uses a virtual-time test dispatcher that auto-advances `delay`, so tests with delays complete in milliseconds instead of real time.
26. Q4: Which Kotest spec uses given/when/then?
27. A) StringSpec
28. B) BehaviorSpec (*)
29. C) FreeSpec
30. D) FunSpec
31. Explanation: `BehaviorSpec` uses `given`/`when`/`then` blocks for BDD-style specs; StringSpec uses bare strings, FreeSpec uses indentation.
32. Q5: Which library is used to test Flows?
33. A) MockK
34. B) JUnit
35. C) Turbine (*)
36. D) AssertJ
37. Explanation: Turbine (from Cash App) provides `flow.test { awaitItem(); awaitComplete() }` to assert emissions in order — much cleaner than `toList()`.
38. Q6: What does `assertEquals(5, calc.add(2, 3))` check?
39. A) That 5 is greater than 3
40. B) That 2 and 3 are positive
41. C) Nothing
42. D) That `calc.add(2, 3)` returns 5 (*)
43. Explanation: `assertEquals(expected, actual)` fails the test if `expected != actual`; here it verifies `add(2,3)` returns 5.
44. Q7: How do you verify a mock was called exactly once?
45. A) `coVerify(exactly = 1) { repo.fetch() }` for suspend (*)
46. B) `verify { repo.fetch() }`
47. C) `mock.count()`
48. D) `repo.wasCalled`
49. Explanation: For suspend functions use `coVerify(exactly = 1) { repo.fetch() }`; `exactly = 0` asserts it was NOT called.
50. Q8: What does Turbine's `awaitItem()` return?
51. A) The whole Flow
52. B) The next emitted item (*)
53. C) A Job
54. D) The collector
55. Explanation: `awaitItem()` suspends until the next emission and returns it; `awaitComplete()` and `awaitError()` check terminal state.
56. Q9: Does MockK handle final classes by default?
57. A) No
58. B) Only with `mockito-inline`
59. C) Yes — Kotlin-first; no special setup needed (*)
60. D) Only with `open`
61. Explanation: MockK handles final classes, objects, and extension functions natively because Kotlin classes are final by default — this is its main reason to exist.
62. Q10: Which annotation marks a test method in kotlin.test?
63. A) `@TestMethod`
64. B) `@TestCase`
65. C) `@Run`
66. D) `@Test` (*)
67. Explanation: `@Test` marks a test method (JUnit 5 via kotlin.test); `@BeforeTest` and `@AfterTest` run setup/teardown around each test.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which library is Kotlin-first for mocking?
  options:
    - Mockito
    - EasyMock
    - MockK
    - PowerMock
  correctIndex: 2
  explanation: MockK is built for Kotlin — handles final classes, suspend functions, extension functions, and objects out of the box; Mockito needs `mockito-inline` and still struggles.
- id: q2
  question: Which function mocks a `suspend` function?
  options:
    - "`every`"
    - "`mock`"
    - "`stub`"
    - "`coEvery`"
  correctIndex: 3
  explanation: "`coEvery { repo.fetch() } returns ...` mocks a suspend function; `every` is for non-suspend functions and will fail on suspend."
- id: q3
  question: Why use `runTest` instead of `runBlocking` for coroutine tests?
  options:
    - "`runTest` runs on virtual time and auto-skips delays for speed"
    - "`runBlocking` is deprecated"
    - "`runBlocking` only works on JVM"
    - "`runTest` requires Spring"
  correctIndex: 0
  explanation: "`runTest` uses a virtual-time test dispatcher that auto-advances `delay`, so tests with delays complete in milliseconds instead of real time."
- id: q4
  question: Which Kotest spec uses given/when/then?
  options:
    - StringSpec
    - BehaviorSpec
    - FreeSpec
    - FunSpec
  correctIndex: 1
  explanation: "`BehaviorSpec` uses `given`/`when`/`then` blocks for BDD-style specs; StringSpec uses bare strings, FreeSpec uses indentation."
- id: q5
  question: Which library is used to test Flows?
  options:
    - MockK
    - JUnit
    - Turbine
    - AssertJ
  correctIndex: 2
  explanation: Turbine (from Cash App) provides `flow.test { awaitItem(); awaitComplete() }` to assert emissions in order — much cleaner than `toList()`.
- id: q6
  question: What does `assertEquals(5, calc.add(2, 3))` check?
  options:
    - That 5 is greater than 3
    - That 2 and 3 are positive
    - Nothing
    - That `calc.add(2, 3)` returns 5
  correctIndex: 3
  explanation: "`assertEquals(expected, actual)` fails the test if `expected != actual`; here it verifies `add(2,3)` returns 5."
- id: q7
  question: How do you verify a mock was called exactly once?
  options:
    - "`coVerify(exactly = 1) { repo.fetch() }` for suspend"
    - "`verify { repo.fetch() }`"
    - "`mock.count()`"
    - "`repo.wasCalled`"
  correctIndex: 0
  explanation: For suspend functions use `coVerify(exactly = 1) { repo.fetch() }`; `exactly = 0` asserts it was NOT called.
- id: q8
  question: What does Turbine's `awaitItem()` return?
  options:
    - The whole Flow
    - The next emitted item
    - A Job
    - The collector
  correctIndex: 1
  explanation: "`awaitItem()` suspends until the next emission and returns it; `awaitComplete()` and `awaitError()` check terminal state."
- id: q9
  question: Does MockK handle final classes by default?
  options:
    - No
    - Only with `mockito-inline`
    - Yes — Kotlin-first; no special setup needed
    - Only with `open`
  correctIndex: 2
  explanation: MockK handles final classes, objects, and extension functions natively because Kotlin classes are final by default — this is its main reason to exist.
- id: q10
  question: Which annotation marks a test method in kotlin.test?
  options:
    - "`@TestMethod`"
    - "`@TestCase`"
    - "`@Run`"
    - "`@Test`"
  correctIndex: 3
  explanation: "`@Test` marks a test method (JUnit 5 via kotlin.test); `@BeforeTest` and `@AfterTest` run setup/teardown around each test."
```

