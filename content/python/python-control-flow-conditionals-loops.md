---
slug: python-control-flow-conditionals-loops
id: python-05
track: python
order: 5
title: Control Flow — Conditionals and Loops
description: "Learn Python's control-flow toolkit: if/elif/else, for, while, break/continue/pass, the match statement (3.10+), and the unique `else` clause on loops."
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=4100s
whyItMatters: "Learn Python's control-flow toolkit: if/elif/else, for, while, break/continue/pass, the match statement (3. 10+), and the unique `else` clause on loops."
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Control Flow — Conditionals and Loops

## Control Flow — Conditionals and Loops

### Why It Matters

Learn Python's control-flow toolkit: if/elif/else, for, while, break/continue/pass, the match statement (3. 10+), and the unique `else` clause on loops.

Learn Python's control-flow toolkit: if/elif/else, for, while, break/continue/pass, the match statement (3.10+), and the unique `else` clause on loops.

### Prerequisites

- Stage 2: Variables and Data Types
- Stage 4: Numbers, Booleans, and Operators (boolean logic).

### Topics

- if / elif / else
- for loops over iterables
- while loops
- break, continue, pass
- The for/else and while/else construct (else runs if no break)
- range(), enumerate(), zip()
- match statement with structural pattern matching (3.10+)
- Nested loops and the labeled-break workaround

### Key Concepts

- for loops iterate over any iterable — not just ranges; Python's for is a "foreach".
- `else` on a loop runs only if the loop completes without `break` — useful for search patterns.
- range(stop), range(start, stop), range(start, stop, step) — stop is exclusive.
- enumerate(iterable, start=0) yields (index, value) pairs — preferred over range(len(...)).
- match statements support structural pattern matching (literals, classes, mappings, sequences).

```python
score = 87
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
print(grade)  # 'B'
```
Caption: if/elif/else

### Common Pitfalls

- Modifying a list while iterating over it — skips elements; iterate over a copy (`for x in lst[:]`) or build a new list.
- Using `range(len(...))` instead of enumerate — `for i, v in enumerate(lst)` is more Pythonic and avoids indexing errors.
- Confusing `elif` with multiple `if` — `elif` is exclusive (only one branch runs); multiple ifs all evaluate independently.
- Forgetting that `else` on a loop runs only without `break` — common source of "why is my else running?" bugs.
- Infinite while loops without a clear exit — always have an increment/exit condition or use a max-iterations safety counter.

### Real-World Applications

- Reddit uses Python for-loop-heavy ranking algorithms (hot/new/top scoring for millions of posts).
- Instagram's image-processing pipeline uses match-style dispatch to route uploads to different resizers.
- Spotify's recommendation engine uses for/else to find the first track matching a user's seed profile.
- Yelp's review filter iterates over reviews with break-on-first-flag patterns to short-circuit spam detection.

### Interview Questions

- 1. What's the difference between `for` and `while` in Python? — `for` iterates over an iterable; `while` loops until a condition is false.
- 2. What does `else` on a loop do? — Runs only if the loop completed without `break`; useful for search-then-fallback patterns.
- 3. Why prefer enumerate over range(len(...))? — Cleaner, less error-prone, and you get both index and value in one go.
- 4. What does `pass` do? — It's a no-op placeholder; required where a statement is syntactically required but you have nothing to do.
- 5. When would you use match vs if/elif? — match shines for structural pattern matching (destructuring lists, dicts, classes); if/elif is fine for simple boolean checks.

### Mini Project

Build a FizzBuzz Variations CLI: A tool that prints FizzBuzz for 1..N, but with configurable divisors and labels (e.g. --rule 3=Fizz --rule 5=Buzz --rule 7=Bazz). Suggested approach:
  - Parse rules from argparse into a list of (divisor, label) tuples
  - Iterate 1..N with a for loop
  - Build the output string by checking each rule
  - Use for/else or a flag to print the number itself if no rule matched
  - Add a --json flag to emit results as a list of {n, output} objects

### Exercises

1. Write FizzBuzz for 1..30 using if/elif/else.
2. Rewrite FizzBuzz using for/else so the loop prints the number only if no label was added.
3. Use enumerate to print the top-5 items from a list with their indices.
4. Use zip to combine two lists of names and scores into a list of dicts.
5. Write a match statement that dispatches on a tuple (op, x, y) for +, -, *, /.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `for x in [1,2,3]: print(x)` do?
9. A) Declares x three times
10. B) Indexes the list at x
11. C) Creates an infinite loop
12. D) Iterates over the list, binding x to each element (*)
13. Explanation: Python's for is a "foreach" — it iterates over any iterable, binding the loop variable to each element.
14. Q2: When does the `else` clause of a for loop run?
15. A) Always after the loop
16. B) Only if the loop completed without break (*)
17. C) Only if the loop never executed
18. D) Only if the loop raised an exception
19. Explanation: for/else runs only if the loop wasn't broken out of — useful for "search" patterns.
20. Q3: Which is the Pythonic way to get index + value?
21. A) for i, v in enumerate(lst) (*)
22. B) for i in range(len(lst)): lst[i]
23. C) for v, i in zip(lst, range(100))
24. D) for i, v in lst.items()
25. Explanation: enumerate yields (index, value) pairs cleanly; range(len(...)) is the anti-pattern.
26. Q4: What does `range(1, 10, 2)` yield?
27. A) 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
28. B) 1, 3, 5, 7
29. C) 1, 3, 5, 7, 9 (*)
30. D) 2, 4, 6, 8, 10
31. Explanation: range(start, stop, step) — start=1, stop=10 (exclusive), step=2 gives 1, 3, 5, 7, 9.
32. Q5: What does `break` do?
33. A) Skips to the next iteration
34. B) Restarts the loop from the top
35. C) Raises BreakException
36. D) Exits the nearest enclosing loop immediately (*)
37. Explanation: break terminates the nearest enclosing for or while loop; continue skips to the next iteration.
38. Q6: What does `pass` do?
39. A) Returns from a function
40. B) Acts as a no-op placeholder where a statement is required (*)
41. C) Skips one iteration
42. D) Throws NotImplementedError
43. Explanation: pass is a syntactic placeholder; e.g. used in empty function/class bodies or stub except blocks.
44. Q7: Which Python version introduced `match`?
45. A) 3.10 (*)
46. B) 3.8
47. C) 3.6
48. D) 3.12
49. Explanation: Structural pattern matching (match/case) was added in PEP 634, released with Python 3.10.
50. Q8: What happens if you `lst.remove(x)` while iterating `for x in lst`?
51. A) No effect
52. B) Raises StopIteration
53. C) Elements get skipped — iterating over a mutating list is unsafe (*)
54. D) Python creates a copy automatically
55. Explanation: Mutating a list during iteration shifts indices and skips elements; iterate over a copy (lst[:]) or build a new list.
56. Q9: Which stops at the SHORTEST iterable?
57. A) enumerate(a, b)
58. B) itertools.zip_longest(a, b)
59. C) itertools.chain(a, b)
60. D) zip(a, b) (*)
61. Explanation: zip stops when the shortest iterable is exhausted; zip_longest fills missing values with a fillvalue.
62. Q10: What does `while True: ...` need?
63. A) A `pass` statement
64. B) An explicit `break` to exit (or it loops forever) (*)
65. C) An `else` clause
66. D) A `finally` clause
67. Explanation: while True loops forever unless broken out of with break or by raising an exception.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "What does `for x in [1,2,3]: print(x)` do?"
  options:
    - Declares x three times
    - Indexes the list at x
    - Creates an infinite loop
    - Iterates over the list, binding x to each element
  correctIndex: 3
  explanation: Python's for is a "foreach" — it iterates over any iterable, binding the loop variable to each element.
- id: q2
  question: When does the `else` clause of a for loop run?
  options:
    - Always after the loop
    - Only if the loop completed without break
    - Only if the loop never executed
    - Only if the loop raised an exception
  correctIndex: 1
  explanation: for/else runs only if the loop wasn't broken out of — useful for "search" patterns.
- id: q3
  question: Which is the Pythonic way to get index + value?
  options:
    - for i, v in enumerate(lst)
    - "for i in range(len(lst)): lst[i]"
    - for v, i in zip(lst, range(100))
    - for i, v in lst.items()
  correctIndex: 0
  explanation: enumerate yields (index, value) pairs cleanly; range(len(...)) is the anti-pattern.
- id: q4
  question: What does `range(1, 10, 2)` yield?
  options:
    - 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    - 1, 3, 5, 7
    - 1, 3, 5, 7, 9
    - 2, 4, 6, 8, 10
  correctIndex: 2
  explanation: range(start, stop, step) — start=1, stop=10 (exclusive), step=2 gives 1, 3, 5, 7, 9.
- id: q5
  question: What does `break` do?
  options:
    - Skips to the next iteration
    - Restarts the loop from the top
    - Raises BreakException
    - Exits the nearest enclosing loop immediately
  correctIndex: 3
  explanation: break terminates the nearest enclosing for or while loop; continue skips to the next iteration.
- id: q6
  question: What does `pass` do?
  options:
    - Returns from a function
    - Acts as a no-op placeholder where a statement is required
    - Skips one iteration
    - Throws NotImplementedError
  correctIndex: 1
  explanation: pass is a syntactic placeholder; e.g. used in empty function/class bodies or stub except blocks.
- id: q7
  question: Which Python version introduced `match`?
  options:
    - "3.10"
    - "3.8"
    - "3.6"
    - "3.12"
  correctIndex: 0
  explanation: Structural pattern matching (match/case) was added in PEP 634, released with Python 3.10.
- id: q8
  question: What happens if you `lst.remove(x)` while iterating `for x in lst`?
  options:
    - No effect
    - Raises StopIteration
    - Elements get skipped — iterating over a mutating list is unsafe
    - Python creates a copy automatically
  correctIndex: 2
  explanation: Mutating a list during iteration shifts indices and skips elements; iterate over a copy (lst[:]) or build a new list.
- id: q9
  question: Which stops at the SHORTEST iterable?
  options:
    - enumerate(a, b)
    - itertools.zip_longest(a, b)
    - itertools.chain(a, b)
    - zip(a, b)
  correctIndex: 3
  explanation: zip stops when the shortest iterable is exhausted; zip_longest fills missing values with a fillvalue.
- id: q10
  question: "What does `while True: ...` need?"
  options:
    - A `pass` statement
    - An explicit `break` to exit (or it loops forever)
    - An `else` clause
    - A `finally` clause
  correctIndex: 1
  explanation: while True loops forever unless broken out of with break or by raising an exception.
```

