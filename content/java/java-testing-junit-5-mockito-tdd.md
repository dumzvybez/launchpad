---
slug: java-testing-junit-5-mockito-tdd
id: java-19
track: java
order: 19
title: Testing — JUnit 5, Mockito, and TDD
description: Write unit tests with JUnit 5, mock collaborators with Mockito, measure coverage with JaCoCo, and apply TDD red-green-refactor to drive design.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=21600s
whyItMatters: Write unit tests with JUnit 5, mock collaborators with Mockito, measure coverage with JaCoCo, and apply TDD red-green-refactor to drive design.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# Testing — JUnit 5, Mockito, and TDD

## Testing — JUnit 5, Mockito, and TDD

### Why It Matters

Write unit tests with JUnit 5, mock collaborators with Mockito, measure coverage with JaCoCo, and apply TDD red-green-refactor to drive design.

Write unit tests with JUnit 5, mock collaborators with Mockito, measure coverage with JaCoCo, and apply TDD red-green-refactor to drive design.

### Prerequisites

- Stage 18: Build Tools — Maven, Gradle, and Dependency Management.
- Comfort writing small Java programs with classes, generics, and exceptions.

### Topics

- JUnit 5 (Jupiter) architecture: Platform, Jupiter, Vintage
- @Test, @BeforeEach, @AfterEach, @BeforeAll, @Nested, @DisplayName
- Assertions: assertEquals, assertThrows, assertAll, assertTimeout
- Parameterized tests with @ParameterizedTest and @MethodSource
- Mockito: @Mock, @InjectMocks, when().thenReturn(), verify()
- Test doubles: dummy, stub, spy, fake, mock
- Coverage with JaCoCo and the Maven/Gradle plugin
- TDD red-green-refactor and behavior-driven naming

### Key Concepts

- JUnit 5 splits into Platform (runner), Jupiter (new API), and Vintage (JUnit 4 compatibility).
- Tests should be FAST, ISOLATED, REPEATABLE, SELF-VALIDATING, TIMELY (FIRST principles).
- Mockito mocks by default return defaults (null/0/false); use `when().thenReturn()` to stub and `verify()` to assert interactions.
- Parameterized tests replace copy-paste test methods with a single test fed by a source of inputs.
- TDD's red-green-refactor loop drives design from the outside-in: write a failing test, make it pass minimally, then improve the design.

```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {
    private Calculator calc;

    @BeforeEach
    void setUp() { calc = new Calculator(); }

    @Test
    @DisplayName("1 + 1 = 2")
    void adds() {
        assertEquals(2, calc.add(1, 1));
    }

    @Test
    void divideByZeroThrows() {
        assertThrows(ArithmeticException.class, () -> calc.divide(1, 0));
    }
}
```
Caption: Basic JUnit 5 test

### Common Pitfalls

- Testing implementation details instead of behavior — refactors break the tests; assert on observable outcomes.
- Over-mocking — every collaborator mocked yields brittle tests and low signal; prefer real fakes for value objects.
- Using `verify` on every call — couples tests to call counts; verify only what matters for the behavior under test.
- Skipping parameterized tests in favor of copy-paste — ten near-identical test methods are a maintenance nightmare; use `@ParameterizedTest`.
- Chasing 100% coverage — coverage measures lines, not value; a 100%-covered codebase can have zero useful assertions.

### Real-World Applications

- Spring Boot Test (@SpringBootTest, @WebMvcTest) integrates JUnit 5 with the Spring TestContext, enabling slice tests of controllers and services.
- Mockito is the default mocking library across the Java ecosystem; Spring Boot's @MockBean annotation wraps it for DI integration.
- JUnit 5's @Nested enables BDD-style grouped tests used widely in domain-heavy applications (banking, insurance, healthcare).
- JaCoCo coverage reports are a standard gate in CI at most enterprises; many enforce ≥80% line coverage on core modules.

### Interview Questions

- 1. What are the JUnit 5 modules? — Platform (runtime), Jupiter (new programming model), Vintage (JUnit 4 compatibility).
- 2. What's the difference between @Mock and @InjectMocks? — @Mock creates a mock of a collaborator; @InjectMocks creates an instance of the class under test and injects the mocks.
- 3. What is a parameterized test? — A single test method run multiple times with different inputs supplied by a source (@ValueSource, @MethodSource, @CsvSource).
- 4. What's the difference between a stub and a mock? — A stub provides canned answers; a mock also records interactions for later verification.
- 5. What is TDD's red-green-refactor? — Red: write a failing test. Green: make it pass minimally. Refactor: improve the design without changing behavior.

### Mini Project

Build a TDD-Driven Roman Numeral Converter: Use strict TDD to convert integers (1-3999) to Roman numerals and back. Suggested approach:
  - Write a failing test for `toRoman(1)` returning "I"
  - Make it pass with the simplest implementation
  - Add tests for 4 ("IV"), 9 ("IX"), 40 ("XL"), and 3999 ("MMMCMXCIX") one at a time
  - Use `@ParameterizedTest` with @CsvSource for bulk cases
  - Add reverse conversion tests (`fromRoman("XLII") == 42`)

### Exercises

1. Write a JUnit 5 test class for a `Stack` with @BeforeEach to create a fresh stack and tests for push, pop, and peek exceptions.
2. Convert a copy-paste set of test methods into a single `@ParameterizedTest` fed by `@MethodSource`.
3. Mock a `PaymentGateway` with Mockito; stub `charge` to return true, call `OrderService.placeOrder`, and verify the audit log was called.
4. Add the JaCoCo Maven plugin and configure a 70% line-coverage minimum; run `mvn verify` and inspect the report at target/site/jacoco/index.html.
5. Apply TDD to a FizzBuzz implementation: write one test, watch it fail, make it pass; iterate one requirement at a time.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: JUnit 5's new programming-model module is called?
9. A) Vintage
10. B) Platform
11. C) Jupiter (*)
12. D) Juno
13. Explanation: JUnit 5 = Platform + Jupiter + Vintage. Jupiter is the new programming model (annotations/assertions). Vintage runs JUnit 3/4 tests.
14. Q2: `@BeforeEach` runs?
15. A) Once per test class
16. B) Only before the first test
17. C) After each test method
18. D) Before each test method (*)
19. Explanation: @BeforeEach replaces JUnit 4's @Before and runs before every test method, ensuring fresh state. @BeforeAll runs once per class (must be static).
20. Q3: `assertThrows` is used to?
21. A) Assert that a callable throws a specific exception type (*)
22. B) Suppress exceptions
23. C) Re-throw checked exceptions
24. D) Mark a test as expected-to-fail
25. Explanation: `assertThrows(Class<T>, Executable)` runs the lambda and asserts it throws the given type, returning the thrown exception for further assertions.
26. Q4: A Mockito `@Mock` annotated field is initialized by?
27. A) The JVM automatically
28. B) MockitoExtension (or MockitoAnnotations.openMocks) (*)
29. C) The Spring container always
30. D) JUnit by default
31. Explanation: @Mock fields are initialized by Mockito (typically via @ExtendWith(MockitoExtension.class)). Without initialization the field stays null.
32. Q5: `@InjectMocks` does what?
33. A) Mocks a class
34. B) Skips injection
35. C) Creates an instance of the class under test and injects its @Mock collaborators (*)
36. D) Replaces a method with a stub
37. Explanation: @InjectMocks instantiates the class under test and injects the @Mock fields via constructor, setter, or field injection (constructor preferred).
38. Q6: A parameterized test in JUnit 5 uses?
39. A) @Test with arguments
40. B) @RunWith(Parameterized.class)
41. C) @DataProvider
42. D) @ParameterizedTest with a source annotation (e.g., @MethodSource) (*)
43. Explanation: @ParameterizedTest + a source (@ValueSource, @CsvSource, @MethodSource, @EnumSource) feeds multiple inputs to a single test method.
44. Q7: Mockito's `when(mock.foo()).thenReturn(x)` is an example of?
45. A) Stubbing (*)
46. B) Verification
47. C) Spying
48. D) Argument capture
49. Explanation: `when().thenReturn()` stubs a method to return a canned value. `verify(mock).foo()` is the verification counterpart.
50. Q8: JaCoCo measures?
51. A) Test execution time
52. B) Code coverage (line, branch) by instrumenting bytecode at runtime (*)
53. C) Memory usage
54. D) Thread count
55. Explanation: JaCoCo (Java Code Coverage) instruments bytecode via a Java agent, recording which lines/branches were executed during tests and emitting XML/HTML reports.
56. Q9: TDD's red-green-refactor means?
57. A) Red: deploy, Green: rollback, Refactor: delete
58. B) Red: stop, Green: go, Refactor: rebuild
59. C) Red: failing test, Green: minimal pass, Refactor: improve design (*)
60. D) Red: refactor, Green: write tests, Refactor: release
61. Explanation: TDD's loop: write a failing test (red), make it pass with minimal code (green), then improve the design without changing behavior (refactor).
62. Q10: The FIRST principles of testing include?
63. A) Functional, Iterative, Reliable, Static, Typed
64. B) Frequent, Independent, Random, Safe, Tested
65. C) First-class, Inheritance, Runtime, Strict, Tolerant
66. D) Fast, Isolated, Repeatable, Self-validating, Timely (*)
67. Explanation: FIRST = Fast, Isolated, Repeatable, Self-validating, Timely — properties of good unit tests (from Robert Martin / Kent Beck).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: JUnit 5's new programming-model module is called?
  options:
    - Vintage
    - Platform
    - Jupiter
    - Juno
  correctIndex: 2
  explanation: JUnit 5 = Platform + Jupiter + Vintage. Jupiter is the new programming model (annotations/assertions). Vintage runs JUnit 3/4 tests.
- id: q2
  question: "`@BeforeEach` runs?"
  options:
    - Once per test class
    - Only before the first test
    - After each test method
    - Before each test method
  correctIndex: 3
  explanation: "@BeforeEach replaces JUnit 4's @Before and runs before every test method, ensuring fresh state. @BeforeAll runs once per class (must be static)."
- id: q3
  question: "`assertThrows` is used to?"
  options:
    - Assert that a callable throws a specific exception type
    - Suppress exceptions
    - Re-throw checked exceptions
    - Mark a test as expected-to-fail
  correctIndex: 0
  explanation: "`assertThrows(Class<T>, Executable)` runs the lambda and asserts it throws the given type, returning the thrown exception for further assertions."
- id: q4
  question: A Mockito `@Mock` annotated field is initialized by?
  options:
    - The JVM automatically
    - MockitoExtension (or MockitoAnnotations.openMocks)
    - The Spring container always
    - JUnit by default
  correctIndex: 1
  explanation: "@Mock fields are initialized by Mockito (typically via @ExtendWith(MockitoExtension.class)). Without initialization the field stays null."
- id: q5
  question: "`@InjectMocks` does what?"
  options:
    - Mocks a class
    - Skips injection
    - Creates an instance of the class under test and injects its @Mock collaborators
    - Replaces a method with a stub
  correctIndex: 2
  explanation: "@InjectMocks instantiates the class under test and injects the @Mock fields via constructor, setter, or field injection (constructor preferred)."
- id: q6
  question: A parameterized test in JUnit 5 uses?
  options:
    - "@Test with arguments"
    - "@RunWith(Parameterized.class)"
    - "@DataProvider"
    - "@ParameterizedTest with a source annotation (e.g., @MethodSource)"
  correctIndex: 3
  explanation: "@ParameterizedTest + a source (@ValueSource, @CsvSource, @MethodSource, @EnumSource) feeds multiple inputs to a single test method."
- id: q7
  question: Mockito's `when(mock.foo()).thenReturn(x)` is an example of?
  options:
    - Stubbing
    - Verification
    - Spying
    - Argument capture
  correctIndex: 0
  explanation: "`when().thenReturn()` stubs a method to return a canned value. `verify(mock).foo()` is the verification counterpart."
- id: q8
  question: JaCoCo measures?
  options:
    - Test execution time
    - Code coverage (line, branch) by instrumenting bytecode at runtime
    - Memory usage
    - Thread count
  correctIndex: 1
  explanation: JaCoCo (Java Code Coverage) instruments bytecode via a Java agent, recording which lines/branches were executed during tests and emitting XML/HTML reports.
- id: q9
  question: TDD's red-green-refactor means?
  options:
    - "Red: deploy, Green: rollback, Refactor: delete"
    - "Red: stop, Green: go, Refactor: rebuild"
    - "Red: failing test, Green: minimal pass, Refactor: improve design"
    - "Red: refactor, Green: write tests, Refactor: release"
  correctIndex: 2
  explanation: "TDD's loop: write a failing test (red), make it pass with minimal code (green), then improve the design without changing behavior (refactor)."
- id: q10
  question: The FIRST principles of testing include?
  options:
    - Functional, Iterative, Reliable, Static, Typed
    - Frequent, Independent, Random, Safe, Tested
    - First-class, Inheritance, Runtime, Strict, Tolerant
    - Fast, Isolated, Repeatable, Self-validating, Timely
  correctIndex: 3
  explanation: FIRST = Fast, Isolated, Repeatable, Self-validating, Timely — properties of good unit tests (from Robert Martin / Kent Beck).
```

