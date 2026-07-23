---
slug: cpp-control-flow-conditionals-loops
id: cpp-03
track: cpp
order: 3
title: Control Flow — Conditionals and Loops
description: Master if/else, switch with fallthrough, the four loop forms (for, while, do-while, range-based for), break/continue, and the modern if-with-initializer.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=100s
whyItMatters: Master if/else, switch with fallthrough, the four loop forms (for, while, do-while, range-based for), break/continue, and the modern if-with-initializer.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# Control Flow — Conditionals and Loops

## Control Flow — Conditionals and Loops

### Why It Matters

Master if/else, switch with fallthrough, the four loop forms (for, while, do-while, range-based for), break/continue, and the modern if-with-initializer.

Master if/else, switch with fallthrough, the four loop forms (for, while, do-while, range-based for), break/continue, and the modern if-with-initializer.

### Prerequisites

- Stage 1: Getting Started with C++
- Stage 2: Variables, Types, and Operators

### Topics

- if / else if / else
- switch / case / default / fallthrough / [[fallthrough]] attribute
- for loop (C-style), while, do-while
- Range-based for (C++11)
- break and continue
- if-with-initializer (C++17): `if (auto x = f(); cond)`
- switch-with-initializer (C++17)
- Structured bindings preview (covered in Stage 16)
- Ternary operator `cond ? a : b`

### Key Concepts

- switch only works on integral and enum types; case labels must be constant expressions.
- switch falls through unless you break; C++17 added [[fallthrough]] to document intentional fallthrough.
- Range-based for works on anything with begin()/end() (arrays, STL containers, initializer lists).
- The C++17 if-init lets you scope a variable to the if/else block — cleaner code and no leaks.
- continue in a range-based for is equivalent to advancing to the next element.
- Always use `default:` in switch when handling enums to catch future enum additions (or use -Wswitch-enum).

```cpp
#include <map>
#include <string>
#include <iostream>

int main() {
    std::map<std::string, int> ages{{"Alice", 30}, {"Bob", 25}};
    if (auto it = ages.find("Alice"); it != ages.end()) {
        std::cout << "Alice is " << it->second << '\n';
    } else {
        std::cout << "Alice not found\n";
    }
    return 0;
}
```
Caption: if with initializer (C++17)

### Common Pitfalls

- Forgetting `break;` in a switch case — unintentional fallthrough executes the next case's body; use [[fallthrough]] to silence intentional ones.
- Comparing floating-point with `==` — `0.1 + 0.2 != 0.3` due to IEEE-754; use an epsilon comparison `std::abs(a - b) < 1e-9`.
- Modifying a container while iterating it with range-based for — invalidates iterators and is UB; collect changes and apply after the loop, or use iterator-based loops carefully.
- Using `continue` inside a do-while expecting it to re-test the condition — it does, but only after re-evaluating; if your increment is between the body and the condition, continue may skip it.
- Writing `if (x = 0)` instead of `if (x == 0)` — assignment, not comparison; enable -Wparentheses (part of -Wextra) to catch this.

### Real-World Applications

- LLVM's instruction selector uses giant switch statements over opcode enums, with -Wswitch-enum ensuring every opcode is handled.
- Unreal Engine's gameplay AbilitySystem uses if-with-initializer patterns to scope lookup results cleanly.
- Chromium's URL parser uses range-based for over parsed components for safe iteration.
- MongoDB's query planner uses switch over stage types with [[fallthrough]] for shared setup logic.

### Interview Questions

- 1. What is the difference between `while` and `do-while`? — while tests before the body (may execute 0 times); do-while tests after (executes at least once).
- 2. Why does switch only accept integral/enum types? — Cases are translated to jump tables indexed by integer values; non-integral types cannot be compared at compile time.
- 3. What is the C++17 if-with-initializer? — `if (init; cond)` scopes the init to the if/else block, avoiding name leakage and simplifying cleanup.
- 4. What is `[[fallthrough]]` and why was it added? — An attribute (C++17) documenting intentional fallthrough so -Wimplicit-fallthrough doesn't fire; without it, accidental fallthrough is a silent bug.
- 5. Why is `if (x = 0)` a classic bug? — It assigns 0 to x and evaluates as false; -Wparentheses (in -Wextra) warns about assignment in conditions.

### Mini Project

Build a FizzBuzz CLI with Custom Rules: A program that prints FizzBuzz from 1 to N, with user-configurable rules (e.g., "3 -> Fizz", "5 -> Buzz", "7 -> Bazz"). Suggested approach:
  - Parse N from argv with std::stoi and std::invalid_argument handling
  - Store rules in a std::vector<std::pair<int, std::string>>
  - Use a range-based for over 1..N (use std::views::iota from C++20)
  - For each number, use if/else chains to build the output string
  - Add a --rules flag to load custom rules from stdin

### Exercises

1. Write a switch over an enum class Color with all 7 rainbow colors; remove one case and observe the -Wswitch warning.
2. Refactor an if/else chain into a switch; identify which is more readable and why.
3. Write a do-while loop that reads integers from std::cin until the user enters -1; handle std::cin failure on non-integer input.
4. Use the C++17 if-with-initializer to scope an std::ifstream to a block that reads the first line of a file.
5. Time a range-based for vs an index-based for over a std::vector<int> of 10 million elements; explain the result.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which types can a switch statement accept?
9. A) Any type
10. B) Only int
11. C) Integral and enum types only (*)
12. D) Only enum class
13. Explanation: switch requires integral or enumeration types; case labels must be constant expressions of a compatible type.
14. Q2: What does [[fallthrough]] do?
15. A) Forces a break
16. B) Skips to the default case
17. C) Throws an exception
18. D) Documents intentional fallthrough to silence warnings (*)
19. Explanation: [[fallthrough]] (C++17) is an attribute telling the compiler the fallthrough is intentional, silencing -Wimplicit-fallthrough.
20. Q3: What is the C++17 if-with-initializer syntax?
21. A) `if (init; cond) { ... }` (*)
22. B) `if init; cond { ... }`
23. C) `if (init) cond { ... }`
24. D) `if (cond, init) { ... }`
25. Explanation: The if-init form is `if (init-statement; condition)`, scoping the init to the if/else block.
26. Q4: How many times does a do-while loop execute its body at minimum?
27. A) Zero
28. B) One (*)
29. C) Two
30. D) Until the condition is true
31. Explanation: do-while tests the condition after the body, so the body executes at least once even if the condition is initially false.
32. Q5: What does range-based for require of its target?
33. A) It must be a std::vector
34. B) It must be a C array
35. C) It must expose begin() and end() (or be an array) (*)
36. D) It must support operator[]
37. Explanation: Range-based for works on any type with begin()/end() member or free functions, including arrays and initializer lists.
38. Q6: What happens if you forget `break;` in a switch case?
39. A) Compile error
40. B) Runtime error
41. C) Skips to default
42. D) Falls through to the next case (*)
43. Explanation: Without break, execution falls through to the next case label, executing its code regardless of whether the case matches.
44. Q7: Why is `if (x = 0)` problematic?
45. A) It assigns 0 to x and evaluates as false (*)
46. B) It is a syntax error
47. C) It compares x to 0
48. D) It is fine
49. Explanation: `=` is assignment; the result is the assigned value (0), so the if-body never runs and x is silently reset to 0.
50. Q8: Why shouldn't you compare floats with `==`?
51. A) Floats cannot be compared
52. B) IEEE-754 rounding makes exact equality unreliable (*)
53. C) `==` is not defined for floats
54. D) Floats use IEEE-854
55. Explanation: Floating-point arithmetic introduces rounding errors; 0.1 + 0.2 != 0.3. Use an epsilon comparison instead.
56. Q9: What does continue do in a range-based for?
57. A) Jumps to the start of the loop body
58. B) Re-runs the current element
59. C) Advances to the next element (*)
60. D) Exits the loop
61. Explanation: continue in a range-based for advances the implicit iterator to the next element, just like in a traditional for.
62. Q10: Which warning catches missing switch cases over an enum?
63. A) -Wmissing-cases
64. B) -Wenum-missing
65. C) -Wpedantic
66. D) -Wswitch / -Wswitch-enum (*)
67. Explanation: -Wswitch warns on missing cases (without default); -Wswitch-enum warns even with a default present.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which types can a switch statement accept?
  options:
    - Any type
    - Only int
    - Integral and enum types only
    - Only enum class
  correctIndex: 2
  explanation: switch requires integral or enumeration types; case labels must be constant expressions of a compatible type.
- id: q2
  question: What does [[fallthrough]] do?
  options:
    - Forces a break
    - Skips to the default case
    - Throws an exception
    - Documents intentional fallthrough to silence warnings
  correctIndex: 3
  explanation: "[[fallthrough]] (C++17) is an attribute telling the compiler the fallthrough is intentional, silencing -Wimplicit-fallthrough."
- id: q3
  question: What is the C++17 if-with-initializer syntax?
  options:
    - "`if (init; cond) { ... }`"
    - "`if init; cond { ... }`"
    - "`if (init) cond { ... }`"
    - "`if (cond, init) { ... }`"
  correctIndex: 0
  explanation: The if-init form is `if (init-statement; condition)`, scoping the init to the if/else block.
- id: q4
  question: How many times does a do-while loop execute its body at minimum?
  options:
    - Zero
    - One
    - Two
    - Until the condition is true
  correctIndex: 1
  explanation: do-while tests the condition after the body, so the body executes at least once even if the condition is initially false.
- id: q5
  question: What does range-based for require of its target?
  options:
    - It must be a std::vector
    - It must be a C array
    - It must expose begin() and end() (or be an array)
    - It must support operator[]
  correctIndex: 2
  explanation: Range-based for works on any type with begin()/end() member or free functions, including arrays and initializer lists.
- id: q6
  question: What happens if you forget `break;` in a switch case?
  options:
    - Compile error
    - Runtime error
    - Skips to default
    - Falls through to the next case
  correctIndex: 3
  explanation: Without break, execution falls through to the next case label, executing its code regardless of whether the case matches.
- id: q7
  question: Why is `if (x = 0)` problematic?
  options:
    - It assigns 0 to x and evaluates as false
    - It is a syntax error
    - It compares x to 0
    - It is fine
  correctIndex: 0
  explanation: "`=` is assignment; the result is the assigned value (0), so the if-body never runs and x is silently reset to 0."
- id: q8
  question: Why shouldn't you compare floats with `==`?
  options:
    - Floats cannot be compared
    - IEEE-754 rounding makes exact equality unreliable
    - "`==` is not defined for floats"
    - Floats use IEEE-854
  correctIndex: 1
  explanation: Floating-point arithmetic introduces rounding errors; 0.1 + 0.2 != 0.3. Use an epsilon comparison instead.
- id: q9
  question: What does continue do in a range-based for?
  options:
    - Jumps to the start of the loop body
    - Re-runs the current element
    - Advances to the next element
    - Exits the loop
  correctIndex: 2
  explanation: continue in a range-based for advances the implicit iterator to the next element, just like in a traditional for.
- id: q10
  question: Which warning catches missing switch cases over an enum?
  options:
    - -Wmissing-cases
    - -Wenum-missing
    - -Wpedantic
    - -Wswitch / -Wswitch-enum
  correctIndex: 3
  explanation: -Wswitch warns on missing cases (without default); -Wswitch-enum warns even with a default present.
```

