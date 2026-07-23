---
slug: csharp-testing-xunit-nunit-moq-fluentassertions
id: csharp-18
track: csharp
order: 18
title: Testing — xUnit, NUnit, Moq, FluentAssertions
description: Write unit tests with xUnit (and a peek at NUnit), mock dependencies with Moq, write fluent assertions, and structure tests across unit/integration with Testcontainers.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=17000s
whyItMatters: Write unit tests with xUnit (and a peek at NUnit), mock dependencies with Moq, write fluent assertions, and structure tests across unit/integration with Testcontainers.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# Testing — xUnit, NUnit, Moq, FluentAssertions

## Testing — xUnit, NUnit, Moq, FluentAssertions

### Why It Matters

Write unit tests with xUnit (and a peek at NUnit), mock dependencies with Moq, write fluent assertions, and structure tests across unit/integration with Testcontainers.

Write unit tests with xUnit (and a peek at NUnit), mock dependencies with Moq, write fluent assertions, and structure tests across unit/integration with Testcontainers.

### Prerequisites

- Stage 17: .NET Ecosystem (dotnet test).
- Stage 12: Exception Handling.
- Stage 11: async/await (for async tests).

### Topics

- xUnit: `[Fact]`, `[Theory]`, `[InlineData]`, `[ClassData]`, `[MemberData]`
- Test runner: `dotnet test`, `--filter`, `--logger`, `--collect:"XPlat Code Coverage"`
- AAA pattern (Arrange-Act-Assert) and naming conventions
- Moq: `Mock<T>`, Setup, Returns, ReturnsAsync, Verify, VerifyAll
- FluentAssertions: `.Should().Be()`, `.Should().Throw<T>()`, `.Should().BeEquivalentTo()`
- Test fixtures (`IClassFixture<T>`), `IDisposable` test setup
- Integration tests with `WebApplicationFactory<T>` and Testcontainers
- Coverage with coverlet, `dotnet-coverage`, and ReportGenerator

### Key Concepts

- xUnit creates a new test class instance per test method (unlike NUnit, which reuses); this isolates state but means constructor-based setup runs per test.
- `[Fact]` is a parameterless test; `[Theory]` is parameterized via `[InlineData]` (compile-time constants) or `[MemberData]`/`[ClassData]` (runtime objects).
- Moq mocks interfaces (and virtual methods on classes); setup `mock.Setup(x => x.Foo(It.IsAny<int>())).Returns(42)`; verify with `mock.Verify(x => x.Foo(5), Times.Once)`.
- FluentAssertions reads as natural language and provides deep equivalence via `.BeEquivalentTo(expected)` (ignores extra members by default, compares recursively).
- `WebApplicationFactory<TEntryPoint>` boots your ASP.NET Core app in-process via TestServer for integration tests; Testcontainers spins up real Postgres/Redis in Docker.

```csharp
public class CalculatorTests
{
    [Fact]
    public void Add_TwoPlusTwo_ReturnsFour()
    {
        var calc = new Calculator();
        calc.Add(2, 2).Should().Be(4);
    }

    [Theory]
    [InlineData(1, 2, 3)]
    [InlineData(-1, 1, 0)]
    [InlineData(0, 0, 0)]
    public void Add_VariousInputs_ReturnsSum(int a, int b, int expected)
    {
        new Calculator().Add(a, b).Should().Be(expected);
    }

    [Theory]
    [ClassData(typeof(AddCases))]
    public void Add_ClassData(int a, int b, int expected) { /* ... */ }
}

public class AddCases : IEnumerable<object[]>
{
    public IEnumerator<object[]> GetEnumerator() =>
        new List<object[]> { new object[] { 1, 2, 3 }, new object[] { 10, 20, 30 } }.GetEnumerator();
    System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator() => GetEnumerator();
}
```
Caption: xUnit Fact and Theory

### Common Pitfalls

- Mocking concrete classes without virtual methods — Moq can only override virtual/abstract members; non-virtual setups silently do nothing; prefer mocking interfaces.
- Over-mocking (mock everything) — tests become brittle and verify implementation, not behavior; mock only external boundaries (IO, time, network), use real types for domain logic.
- `Times.Once` on a mock that's also set up via `SetupAllProperties` — easy to get false verifies; use strict mocks (`new Mock<T>(MockBehavior.Strict)`) to fail on unconfigured calls.
- Shared mutable state across tests — xUnit creates a new instance per test, but static fields or `IClassFixture` shared state can leak; reset in the fixture's constructor or use a fresh fixture per test class.
- Integration tests that hit a real database without cleanup — tests pass once then fail on the second run due to duplicate keys; use Testcontainers with a fresh container per test class, or wrap each test in a transaction that rolls back.

### Real-World Applications

- ASP.NET Core's own test suite uses xUnit + `WebApplicationFactory` extensively; the framework ships thousands of integration tests this way.
- EF Core's tests use Testcontainers (SQL Server, Postgres, SQLite) to verify each provider translates LINQ correctly to SQL.
- Microsoft's Roslyn compiler test suite uses xUnit with `[Theory]` over thousands of code samples (the "baselines") to verify compiler output is unchanged.
- Stack Overflow's tests use xUnit + Moq + a real Postgres container via Testcontainers for data-access integration tests.

### Interview Questions

- 1. What is the difference between `[Fact]` and `[Theory]`? — `[Fact]` is a parameterless test; `[Theory]` is parameterized and runs once per data row supplied by `[InlineData]`, `[MemberData]`, or `[ClassData]`.
- 2. How does xUnit isolate tests? — By creating a new instance of the test class per test method (unlike NUnit, which reuses); constructor-based setup runs per test, eliminating cross-test state.
- 3. What can Moq mock? — Interfaces and virtual/abstract members on classes; non-virtual members cannot be intercepted. Prefer mocking interfaces.
- 4. What does `.BeEquivalentTo` do? — Recursively compares two objects by their public properties, ignoring type differences and (by default) extra members on the actual side; great for comparing DTOs to expecteds.
- 5. What is `WebApplicationFactory<T>` for? — Booting an ASP.NET Core app in-process via TestServer for fast, deterministic integration tests without opening real network sockets; you can override services to swap real dependencies for fakes.

### Mini Project

Build a Tested Discount Engine: A `DiscountCalculator` that takes an order and a customer, applies tier-based discounts, and is fully unit-tested with xUnit + Moq + FluentAssertions. Add an integration test for an ASP.NET Core endpoint that uses it. Suggested approach:
  - Define `ICustomerLookup` and `ITimeProvider` interfaces
  - Implement `DiscountCalculator.Apply(Order, Customer)` returning a `decimal`
  - Mock `ITimeProvider` to control "is it Black Friday?" for seasonality tests
  - Write `[Theory]` cases covering tiers (Bronze/Silver/Gold) and edge cases (empty order, negative total)
  - Add a `WebApplicationFactory<Program>` test that POSTs an order and asserts the discounted total

### Exercises

1. Write a `[Theory]` with `[InlineData]` testing `Calculator.Add` over 5 input pairs.
2. Mock an `IEmailSender` and verify it was called with a specific message via `It.Is<string>(...)`.
3. Use FluentAssertions to assert a list has 3 items in order and that an action throws `InvalidOperationException`.
4. Write a `WebApplicationFactory<Program>` integration test for a `/health` endpoint.
5. Enable coverlet coverage with `--collect:"XPlat Code Coverage"` and use ReportGenerator to produce an HTML report; aim for ≥80% on the core library.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: `[Theory]` with `[InlineData(1,2,3)]` runs the test…
9. A) Zero times (Theory requires MemberData)
10. B) Once with a=1, b=2, expected=3 (*)
11. C) Three times (once per value)
12. D) Once with an array
13. Explanation: `[Theory]` parameterized tests run once per data row; `[InlineData(1,2,3)]` is one row mapping to (a=1, b=2, expected=3); multiple `[InlineData]` attributes produce multiple runs.
14. Q2: xUnit creates a new instance of the test class…
15. A) Once per test class
16. B) Per test assembly
17. C) Per test method (isolates state) (*)
18. D) Never
19. Explanation: xUnit instantiates the test class for every test method, so constructor-based setup runs per test and field state cannot leak between tests (unlike NUnit's shared-by-default model).
20. Q3: Moq can mock…
21. A) Any class
22. B) Static methods only
23. C) Sealed classes
24. D) Interfaces and virtual/abstract members on classes (*)
25. Explanation: Moq (and DynamicProxy under the hood) can override only virtual/abstract members; non-virtual instance methods on classes are not interceptable. Prefer mocking interfaces to avoid surprises.
26. Q4: `.Should().BeEquivalentTo(expected)`…
27. A) Recursively compares public properties, ignoring type differences and extra members by default (*)
28. B) Requires the same type
29. C) Is reference equality
30. D) Throws on collections
31. Explanation: `BeEquivalentTo` performs a deep structural comparison of public members, treating different types with matching members as equivalent; excellent for comparing DTOs and entities.
32. Q5: `WebApplicationFactory<Program>`…
33. A) Opens a real TCP socket on port 80
34. B) Boots the ASP.NET Core app in-process via TestServer for fast integration tests (*)
35. C) Requires Docker
36. D) Replaces your DI container
37. Explanation: `WebApplicationFactory` hosts the app in TestServer (in-memory) so you get an `HttpClient` that round-trips through the full pipeline without real sockets; you can override services to swap dependencies.
38. Q6: `mock.Verify(x => x.Foo(5), Times.Once)` checks…
39. A) That Foo returned 5 once
40. B) That Foo is static
41. C) That Foo was called once with argument 5 (*)
42. D) That Foo threw once
43. Explanation: `Verify` asserts that the mocked method was called with matching arguments a specific number of times; `Times.Once` requires exactly one call. Mismatches throw a `MockException` failing the test.
44. Q7: `It.IsAny<int>()` in a Moq setup…
45. A) Matches only zero
46. B) Throws on any call
47. C) Is the default value
48. D) Matches any int argument (*)
49. Explanation: `It.IsAny<T>()` is an argument matcher that matches any value of type T; combined with `Setup` it configures the mock regardless of the argument. Use `It.Is<T>(pred)` for custom matching.
50. Q8: Testcontainers is used to…
51. A) Spin up real databases/Redis/etc. in Docker for integration tests (*)
52. B) Mock the file system
53. C) Replace xUnit
54. D) Run tests in parallel
55. Explanation: Testcontainers starts a real database (Postgres, SQL Server, Redis) in an ephemeral Docker container per test class; integration tests run against a real DB, then the container is torn down.
56. Q9: Coverlet coverage collection is enabled with…
57. A) `<GenerateCoverage>true</GenerateCoverage>` in .csproj
58. B) `dotnet test --collect:"XPlat Code Coverage"` (*)
59. C) `dotnet build --coverage`
60. D) A separate NuGet reference at runtime
61. Explanation: `dotnet test --collect:"XPlat Code Coverage"` runs coverlet (built into the SDK) and emits a coverage file in `TestResults/`; pipe the output to ReportGenerator to produce an HTML report.
62. Q10: A common over-mocking smell is…
63. A) Using `[Theory]`
64. B) Using FluentAssertions
65. C) Mocking every class including domain logic and value objects (*)
66. D) Using IClassFixture
67. Explanation: Mocking should target external boundaries (DB, HTTP, time, email); mocking domain logic makes tests brittle (they verify the implementation, not behavior) and break on every refactor.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "`[Theory]` with `[InlineData(1,2,3)]` runs the test…"
  options:
    - Zero times (Theory requires MemberData)
    - Once with a=1, b=2, expected=3
    - Three times (once per value)
    - Once with an array
  correctIndex: 1
  explanation: "`[Theory]` parameterized tests run once per data row; `[InlineData(1,2,3)]` is one row mapping to (a=1, b=2, expected=3); multiple `[InlineData]` attributes produce multiple runs."
- id: q2
  question: xUnit creates a new instance of the test class…
  options:
    - Once per test class
    - Per test assembly
    - Per test method (isolates state)
    - Never
  correctIndex: 2
  explanation: xUnit instantiates the test class for every test method, so constructor-based setup runs per test and field state cannot leak between tests (unlike NUnit's shared-by-default model).
- id: q3
  question: Moq can mock…
  options:
    - Any class
    - Static methods only
    - Sealed classes
    - Interfaces and virtual/abstract members on classes
  correctIndex: 3
  explanation: Moq (and DynamicProxy under the hood) can override only virtual/abstract members; non-virtual instance methods on classes are not interceptable. Prefer mocking interfaces to avoid surprises.
- id: q4
  question: "`.Should().BeEquivalentTo(expected)`…"
  options:
    - Recursively compares public properties, ignoring type differences and extra members by default
    - Requires the same type
    - Is reference equality
    - Throws on collections
  correctIndex: 0
  explanation: "`BeEquivalentTo` performs a deep structural comparison of public members, treating different types with matching members as equivalent; excellent for comparing DTOs and entities."
- id: q5
  question: "`WebApplicationFactory<Program>`…"
  options:
    - Opens a real TCP socket on port 80
    - Boots the ASP.NET Core app in-process via TestServer for fast integration tests
    - Requires Docker
    - Replaces your DI container
  correctIndex: 1
  explanation: "`WebApplicationFactory` hosts the app in TestServer (in-memory) so you get an `HttpClient` that round-trips through the full pipeline without real sockets; you can override services to swap dependencies."
- id: q6
  question: "`mock.Verify(x => x.Foo(5), Times.Once)` checks…"
  options:
    - That Foo returned 5 once
    - That Foo is static
    - That Foo was called once with argument 5
    - That Foo threw once
  correctIndex: 2
  explanation: "`Verify` asserts that the mocked method was called with matching arguments a specific number of times; `Times.Once` requires exactly one call. Mismatches throw a `MockException` failing the test."
- id: q7
  question: "`It.IsAny<int>()` in a Moq setup…"
  options:
    - Matches only zero
    - Throws on any call
    - Is the default value
    - Matches any int argument
  correctIndex: 3
  explanation: "`It.IsAny<T>()` is an argument matcher that matches any value of type T; combined with `Setup` it configures the mock regardless of the argument. Use `It.Is<T>(pred)` for custom matching."
- id: q8
  question: Testcontainers is used to…
  options:
    - Spin up real databases/Redis/etc. in Docker for integration tests
    - Mock the file system
    - Replace xUnit
    - Run tests in parallel
  correctIndex: 0
  explanation: Testcontainers starts a real database (Postgres, SQL Server, Redis) in an ephemeral Docker container per test class; integration tests run against a real DB, then the container is torn down.
- id: q9
  question: Coverlet coverage collection is enabled with…
  options:
    - "`<GenerateCoverage>true</GenerateCoverage>` in .csproj"
    - '`dotnet test --collect:"XPlat Code Coverage"`'
    - "`dotnet build --coverage`"
    - A separate NuGet reference at runtime
    - and emits a coverage file in `TestResults/`; pipe the output to ReportGenerator to produce an HTML report.
  correctIndex: 1
  explanation: '`dotnet test --collect:"XPlat Code Coverage"` runs coverlet (built into the SDK) and emits a coverage file in `TestResults/`; pipe the output to ReportGenerator to produce an HTML report.'
- id: q10
  question: A common over-mocking smell is…
  options:
    - Using `[Theory]`
    - Using FluentAssertions
    - Mocking every class including domain logic and value objects
    - Using IClassFixture
  correctIndex: 2
  explanation: Mocking should target external boundaries (DB, HTTP, time, email); mocking domain logic makes tests brittle (they verify the implementation, not behavior) and break on every refactor.
```

