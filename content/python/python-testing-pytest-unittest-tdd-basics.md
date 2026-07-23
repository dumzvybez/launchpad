---
slug: python-testing-pytest-unittest-tdd-basics
id: python-15
track: python
order: 15
title: Testing — pytest, unittest, and TDD Basics
description: Write tests with pytest and unittest, master fixtures and parametrize, mock external dependencies, and practice test-driven development (red-green-refactor).
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=16700s
whyItMatters: Write tests with pytest and unittest, master fixtures and parametrize, mock external dependencies, and practice test-driven development (red-green-refactor).
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Testing — pytest, unittest, and TDD Basics

## Testing — pytest, unittest, and TDD Basics

### Why It Matters

Write tests with pytest and unittest, master fixtures and parametrize, mock external dependencies, and practice test-driven development (red-green-refactor).

Write tests with pytest and unittest, master fixtures and parametrize, mock external dependencies, and practice test-driven development (red-green-refactor).

### Prerequisites

- Stage 14: Working with APIs and the Web (mocking HTTP calls)
- Stage 12: Error Handling (testing exceptions).

### Topics

- pytest basics: test functions, assertions, running tests
- unittest: TestCase, assertEqual, setUp/tearDown
- pytest fixtures: function, module, session scope
- parametrize for data-driven tests
- Mock and patch (unittest.mock)
- Testing exceptions (pytest.raises)
- Coverage measurement with pytest-cov
- TDD: red (write failing test) -> green (make it pass) -> refactor
- Test organization (unit, integration, e2e)

### Key Concepts

- pytest is the de-facto standard; unittest is the stdlib alternative (both work).
- pytest uses Python's assert statement (no assertEqual needed); better tracebacks.
- Fixtures provide setup/teardown via dependency injection; scopes: function, class, module, session.
- @pytest.mark.parametrize runs the same test with multiple inputs — DRY for table-driven tests.
- Mock objects replace real dependencies (HTTP, DB, filesystem) for fast, deterministic tests.

```python
# test_calc.py
def add(a, b): return a + b

def test_add_ints():
    assert add(2, 3) == 5

def test_add_strings():
    assert add("a", "b") == "ab"

def test_add_raises_on_none():
    import pytest
    with pytest.raises(TypeError):
        add(None, 1)

# Run: pytest test_calc.py -v
```
Caption: pytest basics

### Common Pitfalls

- Testing implementation instead of behavior — fragile tests break on refactors; test what the function does, not how.
- Brittle mocks — over-mocking couples tests to implementation; mock at the boundary (HTTP, DB), not internal calls.
- Shared mutable state in fixtures — using scope="module" with mutable data leaks state between tests; use function scope or reset.
- Not testing edge cases — empty input, None, negative numbers, off-by-one boundaries; parametrize to cover them all.
- Asserting without a message — `assert x` gives a bare failure; use `assert x, "expected x to be truthy"` for context.

### Real-World Applications

- Instagram runs millions of pytest tests per day across its monorepo; fixtures handle DB setup.
- Stripe's Python SDK has 100%+ test coverage with pytest and mock for HTTP boundary.
- Dropbox uses pytest fixtures with session-scoped DB containers for integration tests.
- Netflix uses pytest with hypothesis (property-based testing) for chaos-engineering validation.

### Interview Questions

- 1. What's the difference between pytest and unittest? — pytest uses plain assert with better tracebacks and fixtures; unittest requires TestCase classes and assertEqual methods.
- 2. What is a fixture? — A function that provides setup data/objects to tests via dependency injection; supports scopes (function, module, session).
- 3. What does @pytest.mark.parametrize do? — Runs a test function multiple times with different argument sets — table-driven testing.
- 4. When should you mock? — At boundaries (HTTP, DB, filesystem) to make tests fast, deterministic, and isolated from external state.
- 5. What's TDD? — Red (write a failing test), Green (make it pass with minimal code), Refactor (improve without changing behavior).

### Mini Project

Build a TDD String Calculator: Implement the famous "String Calculator" kata (Roy Osherove) using strict TDD. Start with an empty test, watch it fail, write minimal code, refactor. Suggested approach:
  - Test 1: empty string returns 0
  - Test 2: "1" returns 1; "1,2" returns 3
  - Test 3: handle newlines as delimiters ("1\n2,3")
  - Test 4: custom delimiter ("//;\n1;2")
  - Test 5: negative numbers raise an exception listing all negatives
  - Use @pytest.mark.parametrize for the input/expected pairs

### Exercises

1. Write a pytest test for add(2, 3) using plain assert.
2. Add a fixture that returns a sample list, and write two tests that use it.
3. Use @pytest.mark.parametrize to test add() with 5 input/expected pairs.
4. Use pytest.raises to test that dividing by zero raises ZeroDivisionError.
5. Mock requests.get in a test using @patch and verify it was called with the right URL.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which assertion style does pytest use?
9. A) assert a == b (*)
10. B) self.assertEqual(a, b)
11. C) expect(a).to_equal(b)
12. D) assertThat(a, equals(b))
13. Explanation: pytest uses Python's built-in assert with smart rewriting for better tracebacks; unittest uses self.assertEqual-style methods.
14. Q2: What is a fixture in pytest?
15. A) A test runner
16. B) A test class
17. C) A function that provides setup data/objects via dependency injection (*)
18. D) A mock object
19. Explanation: Fixtures are functions decorated with @pytest.fixture; tests request them by parameter name (dependency injection).
20. Q3: What does @pytest.mark.parametrize do?
21. A) Marks a test as slow
22. B) Sets a timeout
23. C) Skips the test
24. D) Runs the same test multiple times with different argument sets (*)
25. Explanation: parametrize takes a list of argument tuples and runs the test once per tuple — table-driven testing.
26. Q4: What's the correct way to test that f() raises ValueError?
27. A) try: f() except: pass
28. B) with pytest.raises(ValueError): f() (*)
29. C) assert f() == ValueError
30. D) pytest.check(ValueError, f)
31. Explanation: pytest.raises is a context manager that asserts the block raises the specified exception.
32. Q5: Which scope keeps a fixture alive for the entire test session?
33. A) session (*)
34. B) class
35. C) module
36. D) function
37. Explanation: Scopes from narrowest to broadest: function < class < module < session. session runs setup once for the whole pytest run.
38. Q6: What's the recommended boundary to mock?
39. A) Internal function calls
40. B) Pure functions
41. C) External boundaries (HTTP, DB, filesystem) (*)
42. D) Built-in print
43. Explanation: Mock at boundaries to keep tests fast and deterministic; mocking internal calls couples tests to implementation.
44. Q7: What's TDD's "red" step?
45. A) Write passing tests
46. B) Delete tests
47. C) Refactor code
48. D) Write a failing test first (*)
49. Explanation: TDD: Red (write a failing test), Green (minimal code to pass), Refactor (improve without breaking tests).
50. Q8: How do you run pytest with coverage?
51. A) pytest --coverage
52. B) pytest --cov=mypackage (*)
53. C) pytest run coverage
54. D) coverage pytest
55. Explanation: pytest-cov adds the --cov flag; `pytest --cov=src --cov-report=term-missing` shows line coverage per file.
56. Q9: Which is a good coverage target?
57. A) ≥80% on core modules, with critical paths at 95%+ (*)
58. B) 100% on everything
59. C) 50%
60. D) Coverage doesn't matter
61. Explanation: 80% is a common baseline; critical paths need higher coverage. 100% is rarely worth it (e.g. error branches in __del__).
62. Q10: What's a brittle mock?
63. A) A mock that fails randomly
64. B) A mock without a return value
65. C) A mock that always returns True
66. D) A mock too tightly coupled to implementation — breaks on refactor (*)
67. Explanation: Brittle mocks assert implementation details (call counts, internal sequences); prefer behavior assertions at the boundary.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which assertion style does pytest use?
  options:
    - assert a == b
    - self.assertEqual(a, b)
    - expect(a).to_equal(b)
    - assertThat(a, equals(b))
  correctIndex: 0
  explanation: pytest uses Python's built-in assert with smart rewriting for better tracebacks; unittest uses self.assertEqual-style methods.
- id: q2
  question: What is a fixture in pytest?
  options:
    - A test runner
    - A test class
    - A function that provides setup data/objects via dependency injection
    - A mock object
  correctIndex: 2
  explanation: Fixtures are functions decorated with @pytest.fixture; tests request them by parameter name (dependency injection).
- id: q3
  question: What does @pytest.mark.parametrize do?
  options:
    - Marks a test as slow
    - Sets a timeout
    - Skips the test
    - Runs the same test multiple times with different argument sets
  correctIndex: 3
  explanation: parametrize takes a list of argument tuples and runs the test once per tuple — table-driven testing.
- id: q4
  question: What's the correct way to test that f() raises ValueError?
  options:
    - "try: f() except: pass"
    - "with pytest.raises(ValueError): f()"
    - assert f() == ValueError
    - pytest.check(ValueError, f)
  correctIndex: 1
  explanation: pytest.raises is a context manager that asserts the block raises the specified exception.
- id: q5
  question: Which scope keeps a fixture alive for the entire test session?
  options:
    - session
    - class
    - module
    - function
  correctIndex: 0
  explanation: "Scopes from narrowest to broadest: function < class < module < session. session runs setup once for the whole pytest run."
- id: q6
  question: What's the recommended boundary to mock?
  options:
    - Internal function calls
    - Pure functions
    - External boundaries (HTTP, DB, filesystem)
    - Built-in print
  correctIndex: 2
  explanation: Mock at boundaries to keep tests fast and deterministic; mocking internal calls couples tests to implementation.
- id: q7
  question: What's TDD's "red" step?
  options:
    - Write passing tests
    - Delete tests
    - Refactor code
    - Write a failing test first
  correctIndex: 3
  explanation: "TDD: Red (write a failing test), Green (minimal code to pass), Refactor (improve without breaking tests)."
- id: q8
  question: How do you run pytest with coverage?
  options:
    - pytest --coverage
    - pytest --cov=mypackage
    - pytest run coverage
    - coverage pytest
  correctIndex: 1
  explanation: pytest-cov adds the --cov flag; `pytest --cov=src --cov-report=term-missing` shows line coverage per file.
- id: q9
  question: Which is a good coverage target?
  options:
    - ≥80% on core modules, with critical paths at 95%+
    - 100% on everything
    - 50%
    - Coverage doesn't matter
  correctIndex: 0
  explanation: 80% is a common baseline; critical paths need higher coverage. 100% is rarely worth it (e.g. error branches in __del__).
- id: q10
  question: What's a brittle mock?
  options:
    - A mock that fails randomly
    - A mock without a return value
    - A mock that always returns True
    - A mock too tightly coupled to implementation — breaks on refactor
  correctIndex: 3
  explanation: Brittle mocks assert implementation details (call counts, internal sequences); prefer behavior assertions at the boundary.
```

