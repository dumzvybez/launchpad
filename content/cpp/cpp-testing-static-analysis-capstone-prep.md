---
slug: cpp-testing-static-analysis-capstone-prep
id: cpp-20
track: cpp
order: 20
title: Testing, Static Analysis, and Capstone Prep
description: Lock in correctness with GoogleTest, Catch2, sanitizers, clang-tidy, cppcheck, and CI; then prepare for the capstone project by reviewing every prior stage.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=_zQqN5OYCCM
whyItMatters: Lock in correctness with GoogleTest, Catch2, sanitizers, clang-tidy, cppcheck, and CI; then prepare for the capstone project by reviewing every prior stage.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# Testing, Static Analysis, and Capstone Prep

## Testing, Static Analysis, and Capstone Prep

### Why It Matters

Lock in correctness with GoogleTest, Catch2, sanitizers, clang-tidy, cppcheck, and CI; then prepare for the capstone project by reviewing every prior stage.

Lock in correctness with GoogleTest, Catch2, sanitizers, clang-tidy, cppcheck, and CI; then prepare for the capstone project by reviewing every prior stage.

### Prerequisites

- Stage 1-19

### Topics

- GoogleTest: TEST, TEST_F, EXPECT_*, ASSERT_*, fixtures, parameterized tests
- Catch2: TEST_CASE, SECTION, REQUIRE, generators
- Test discovery and CTest integration
- Sanitizers: -fsanitize=address,undefined,thread,memory
- Static analysis: clang-tidy, cppcheck, clang-static-analyzer
- Coverage: gcov / lcov, llvm-cov
- CI: GitHub Actions, GitLab CI for C++ projects
- Fuzzing with libFuzzer and OSS-Fuzz
- Property-based testing with RapidCheck
- Capstone planning: requirements, design, file structure, milestones

### Key Concepts

- EXPECT_* continues on failure; ASSERT_* aborts the current test (use when continuing is impossible, e.g., a null pointer).
- Sanitizers catch what the compiler doesn't: ASan (memory), UBSan (undefined behavior), TSan (data races), MSan (uninitialized memory).
- clang-tidy enforces style and best practices: modernize-*, bugprone-*, readability-*; cppcheck adds complementary checks.
- Property-based testing generates random inputs to find edge cases you wouldn't think to test manually.
- Fuzzing feeds random/mutated inputs to find crashes and security bugs; libFuzzer + ASan is a powerful combo.
- Test your tests: mutation testing (mull, dextool) verifies your suite catches seeded bugs.

```cpp
#include <gtest/gtest.h>
#include "strutil.hpp"

class StrUtilTest : public ::testing::TestWithParam<std::pair<std::string, std::string>> {};

TEST_P(StrUtilTest, TrimRemovesWhitespace) {
    auto [input, expected] = GetParam();
    EXPECT_EQ(strutil::trim(input), expected);
}

INSTANTIATE_TEST_SUITE_P(BasicCases, StrUtilTest,
    ::testing::Values(
        std::make_pair("  hello  ", "hello"),
        std::make_pair("\tworld\n", "world"),
        std::make_pair("no trim", "no trim")
    ));
```
Caption: GoogleTest fixture

### Common Pitfalls

- EXPECT_* where ASSERT_* is needed — a null pointer dereference after a failed EXPECT crashes the test runner; use ASSERT_* when the next line depends on the previous check.
- Tests that don't run under sanitizers — your suite passes but ASan would have caught a leak or use-after-free; always run CI with sanitizers enabled.
- Testing implementation details instead of behavior — tests that assert internal state break on refactor; test public behavior so refactors are safe.
- Ignoring clang-tidy in CI — modernize-* and bugprone-* catch real bugs; wire clang-tidy into CI with WarningsAsErrors on critical checks.
- Coverage theater — 100% coverage with weak assertions is meaningless; combine coverage with property tests and fuzzing for real assurance.

### Real-World Applications

- LLVM/Clang itself uses lit + GoogleTest for its test suite (over 200k tests), with sanitizers in CI.
- Google's internal codebase uses GoogleTest (the source of the library) with extreme test rigor and Blaze (Bazel's predecessor) for orchestration.
- Chromium's libfuzzer integration in OSS-Fuzz has found thousands of security bugs in parsers across browsers.
- Bloomberg's BDE ships exhaustive GoogleTest suites with each component, covering edge cases like allocators and exception safety.

### Interview Questions

- 1. What's the difference between EXPECT_* and ASSERT_* in GoogleTest? — EXPECT_* records failure and continues; ASSERT_* aborts the current test (use when continuing is impossible, e.g., null pointer).
- 2. What do ASan, UBSan, TSan, MSan each catch? — ASan: memory errors (use-after-free, leak); UBSan: undefined behavior (signed overflow, null deref); TSan: data races; MSan: uninitialized memory reads.
- 3. What is property-based testing? — Generate random inputs satisfying invariants and assert properties hold (e.g., reversing twice yields the original); RapidCheck and RapidCheck-style libs bring this to C++.
- 4. What is fuzzing and why is it powerful for parsers? — A fuzzer mutates inputs to find crashes; combined with ASan it finds memory bugs in input handling that hand-written tests miss.
- 5. What does clang-tidy do that the compiler doesn't? — Enforces style and best-practices checks (modernize-*, bugprone-*, readability-*) that the compiler doesn't, plus automated refactor suggestions.

### Mini Project

Build a Test Suite for the StrUtil Library: Add GoogleTest unit tests, parameterized tests, and integrate with CTest; enable clang-tidy and sanitizers in CI. Suggested approach:
  - One TEST per public function with at least 3 cases each
  - Add TEST_P parameterized tests for trim() with edge cases (empty, all-whitespace, single char)
  - Wire enable_testing() and add_test() (or gtest_discover_tests) in CMake
  - Add a .clang-tidy config with modernize-*, bugprone-*, performance-*
  - Add a GitHub Actions workflow that builds with -fsanitize=address,undefined and runs tests

### Exercises

1. Convert a GoogleTest TEST into a parameterized TEST_P with at least 5 input cases; verify all run.
2. Add a libFuzzer harness for a JSON parser; run it for 60 seconds and triage any crash.
3. Configure a .clang-tidy file with modernize-* checks; run it on your codebase and fix every warning.
4. Add a GitHub Actions workflow that runs cmake, builds with sanitizers, and runs ctest; verify a red build when you introduce a leak.
5. Add coverage with gcov/lcov; achieve at least 80% line coverage on your strutil library.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the difference between EXPECT_* and ASSERT_* in GoogleTest?
9. A) EXPECT_* is deprecated
10. B) ASSERT_* is for asserts, EXPECT_* is for tests
11. C) They are identical
12. D) EXPECT_* continues on failure; ASSERT_* aborts the test (*)
13. Explanation: EXPECT_* records the failure and continues; ASSERT_* aborts the current test (use when the next line would crash, e.g., after a null pointer check).
14. Q2: What does ASan catch?
15. A) Memory errors like use-after-free, leaks, buffer overflow (*)
16. B) Data races
17. C) Uninitialized memory reads
18. D) Undefined behavior
19. Explanation: AddressSanitizer catches memory errors (use-after-free, heap-buffer-overflow, leaks). UBSan catches UB; TSan catches data races; MSan catches uninitialized reads.
20. Q3: What does UBSan catch?
21. A) Memory errors
22. B) Undefined behavior — signed overflow, null deref, etc. (*)
23. C) Data races
24. D) Type errors
25. Explanation: UndefinedBehaviorSanitizer catches UB like signed integer overflow, null pointer dereference, alignment violations, and integer conversions.
26. Q4: What does clang-tidy do that the compiler doesn't?
27. A) Compile code
28. B) Link the binary
29. C) Enforce style and best-practices checks like modernize-*, bugprone-* (*)
30. D) Run tests
31. Explanation: clang-tidy performs static analysis with checks for modernization (modernize-*), bug-prone patterns (bugprone-*), and readability; the compiler focuses on syntax and semantics.
32. Q5: What does property-based testing do?
33. A) Tests class properties
34. B) Tests getter/setter methods
35. C) Replaces unit tests
36. D) Generates random inputs to test invariants (*)
37. Explanation: Property-based testing generates random inputs (within invariants) and asserts properties hold (e.g., sorting twice == sorting once); RapidCheck brings this to C++.
38. Q6: What is libFuzzer for?
39. A) In-process fuzzing to find crashes and security bugs (*)
40. B) A test framework
41. C) A static analyzer
42. D) A coverage tool
43. Explanation: libFuzzer mutates inputs and feeds them to a harness function; combined with ASan it finds memory bugs in input handling that hand-written tests miss.
44. Q7: What is the role of CTest?
45. A) A test framework
46. B) A test runner that integrates with CMake's add_test() (*)
47. C) A static analyzer
48. D) A coverage tool
49. Explanation: CTest runs tests registered via add_test() (or gtest_discover_tests); it integrates with CMake and reports pass/fail per test.
50. Q8: Why run tests under sanitizers in CI?
51. A) It speeds up tests
52. B) It is required by the standard
53. C) It catches memory and UB bugs the regular tests don't (*)
54. D) It improves coverage
55. Explanation: Tests pass without sanitizers but ASan/UBSan would catch leaks, use-after-free, signed overflow; always run CI with sanitizers to catch these before production.
56. Q9: What does gcov / lcov provide?
57. A) A test runner
58. B) A fuzzer
59. C) A static analyzer
60. D) Code coverage reports — line, branch, function coverage (*)
61. Explanation: gcov (GCC) and llvm-cov (Clang) generate coverage data; lcov / genhtml visualize it. Combine with property tests and fuzzing for real assurance.
62. Q10: What does WarningsAsErrors in clang-tidy do?
63. A) Treats selected warnings as errors, failing the build (*)
64. B) Suppresses warnings
65. C) Auto-fixes warnings
66. D) Disables clang-tidy
67. Explanation: WarningsAsErrors makes clang-tidy return non-zero when selected checks fire, failing CI; this enforces that new code passes the checks.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: What is the difference between EXPECT_* and ASSERT_* in GoogleTest?
  options:
    - EXPECT_* is deprecated
    - ASSERT_* is for asserts, EXPECT_* is for tests
    - They are identical
    - EXPECT_* continues on failure; ASSERT_* aborts the test
  correctIndex: 3
  explanation: EXPECT_* records the failure and continues; ASSERT_* aborts the current test (use when the next line would crash, e.g., after a null pointer check).
- id: q2
  question: What does ASan catch?
  options:
    - Memory errors like use-after-free, leaks, buffer overflow
    - Data races
    - Uninitialized memory reads
    - Undefined behavior
  correctIndex: 0
  explanation: AddressSanitizer catches memory errors (use-after-free, heap-buffer-overflow, leaks). UBSan catches UB; TSan catches data races; MSan catches uninitialized reads.
- id: q3
  question: What does UBSan catch?
  options:
    - Memory errors
    - Undefined behavior — signed overflow, null deref, etc.
    - Data races
    - Type errors
  correctIndex: 1
  explanation: UndefinedBehaviorSanitizer catches UB like signed integer overflow, null pointer dereference, alignment violations, and integer conversions.
- id: q4
  question: What does clang-tidy do that the compiler doesn't?
  options:
    - Compile code
    - Link the binary
    - Enforce style and best-practices checks like modernize-*, bugprone-*
    - Run tests
  correctIndex: 2
  explanation: clang-tidy performs static analysis with checks for modernization (modernize-*), bug-prone patterns (bugprone-*), and readability; the compiler focuses on syntax and semantics.
- id: q5
  question: What does property-based testing do?
  options:
    - Tests class properties
    - Tests getter/setter methods
    - Replaces unit tests
    - Generates random inputs to test invariants
  correctIndex: 3
  explanation: Property-based testing generates random inputs (within invariants) and asserts properties hold (e.g., sorting twice == sorting once); RapidCheck brings this to C++.
- id: q6
  question: What is libFuzzer for?
  options:
    - In-process fuzzing to find crashes and security bugs
    - A test framework
    - A static analyzer
    - A coverage tool
  correctIndex: 0
  explanation: libFuzzer mutates inputs and feeds them to a harness function; combined with ASan it finds memory bugs in input handling that hand-written tests miss.
- id: q7
  question: What is the role of CTest?
  options:
    - A test framework
    - A test runner that integrates with CMake's add_test()
    - A static analyzer
    - A coverage tool
  correctIndex: 1
  explanation: CTest runs tests registered via add_test() (or gtest_discover_tests); it integrates with CMake and reports pass/fail per test.
- id: q8
  question: Why run tests under sanitizers in CI?
  options:
    - It speeds up tests
    - It is required by the standard
    - It catches memory and UB bugs the regular tests don't
    - It improves coverage
  correctIndex: 2
  explanation: Tests pass without sanitizers but ASan/UBSan would catch leaks, use-after-free, signed overflow; always run CI with sanitizers to catch these before production.
- id: q9
  question: What does gcov / lcov provide?
  options:
    - A test runner
    - A fuzzer
    - A static analyzer
    - Code coverage reports — line, branch, function coverage
    - and llvm-cov (Clang) generate coverage data; lcov / genhtml visualize it. Combine with property tests and fuzzing for real assurance.
  correctIndex: 3
  explanation: gcov (GCC) and llvm-cov (Clang) generate coverage data; lcov / genhtml visualize it. Combine with property tests and fuzzing for real assurance.
- id: q10
  question: What does WarningsAsErrors in clang-tidy do?
  options:
    - Treats selected warnings as errors, failing the build
    - Suppresses warnings
    - Auto-fixes warnings
    - Disables clang-tidy
  correctIndex: 0
  explanation: WarningsAsErrors makes clang-tidy return non-zero when selected checks fire, failing CI; this enforces that new code passes the checks.
```

