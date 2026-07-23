---
slug: cpp-stl-algorithms-iterators
id: cpp-10
track: cpp
order: 10
title: STL Algorithms and Iterators
description: Master the STL algorithm library (find, sort, transform, accumulate) and the iterator categories that govern which algorithms work on which containers.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=450s
whyItMatters: Master the STL algorithm library (find, sort, transform, accumulate) and the iterator categories that govern which algorithms work on which containers.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# STL Algorithms and Iterators

## STL Algorithms and Iterators

### Why It Matters

Master the STL algorithm library (find, sort, transform, accumulate) and the iterator categories that govern which algorithms work on which containers.

Master the STL algorithm library (find, sort, transform, accumulate) and the iterator categories that govern which algorithms work on which containers.

### Prerequisites

- Stage 1-9 (especially STL containers)

### Topics

- Iterator categories: input, output, forward, bidirectional, random-access, contiguous (C++20)
- Non-modifying algorithms: find, count, search, all_of, any_of, none_of
- Modifying algorithms: transform, copy, remove, replace, unique, reverse
- Sorting and searching: sort, stable_sort, partial_sort, binary_search, lower_bound, upper_bound
- Numeric algorithms: accumulate, inner_product, partial_sum, reduce (C++17 parallel)
- Min/max: min, max, minmax, clamp
- Lambda expressions (preview — Stage 16 revisits in depth)
- The erase-remove idiom and std::erase (C++20)
- Parallel algorithms (C++17): std::execution::par

### Key Concepts

- Algorithms are decoupled from containers via iterators: a sort works on any random-access iterator pair.
- Iterator category determines which algorithms apply: binary_search needs random-access; list can be sorted with its own member sort (since list iterators are bidirectional).
- Always prefer algorithms over hand-rolled loops: they're tested, often optimized (vectorized), and express intent.
- std::sort is introsort (quicksort + heapsort fallback): O(n log n) average and worst-case.
- std::accumulate is left-fold; std::reduce (C++17) is associativity-friendly for parallel execution.
- Lambdas make algorithms terse: `std::sort(v.begin(), v.end(), [](int a, int b){ return a > b; });`

```cpp
#include <vector>
#include <algorithm>
#include <iostream>

int main() {
    std::vector<int> v{5, 2, 8, 1, 9, 3};
    std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });
    for (int x : v) std::cout << x << ' ';   // 9 8 5 3 2 1
}
```
Caption: sort with lambda

### Common Pitfalls

- Calling binary_search on an unsorted range — UB (or just wrong); sort first, or use find for unsorted (O(n)).
- Comparator inconsistency — `std::sort` with a comparator that's not a strict weak order (e.g., `<=` instead of `<`) is UB; double-check by writing tests with equal elements.
- Using std::remove alone — it doesn't erase; it shifts and returns a new end. Always pair with erase (or use C++20 std::erase).
- Iterator invalidation in transform with back_inserter — back_inserter is safe but watch that the destination vector has enough capacity for the source range.
- Misreading accumulate's initial value — `std::accumulate(begin, end, 0)` on a vector<double> computes int arithmetic (initial value type); use 0.0 or pass an explicit double init.

### Real-World Applications

- Bloomberg's BDE library provides a comprehensive set of algorithms complementing the STL for finance use cases.
- Google's Abseil adds flat_tree-based containers and additional algorithms tuned for cache locality.
- Unreal Engine uses std::sort and stable_sort extensively; gameplay code often customizes the comparator for cache-friendly iteration.
- Chromium's STL usage is extensive; the codebase carefully avoids the few STL algorithms (like std::regex) known to be slow.

### Interview Questions

- 1. What is the difference between std::sort and std::stable_sort? — sort is O(n log n) but may reorder equal elements; stable_sort preserves relative order of equal elements but is O(n log n) with extra memory (or O(n log^2 n) without).
- 2. Why is `std::binary_search` on an unsorted range UB? — The algorithm assumes the range is partitioned by `<` with respect to the value; on an unsorted range it produces wrong results.
- 3. What is the erase-remove idiom? — `v.erase(std::remove(v.begin(), v.end(), val), v.end())` because std::remove only shifts non-matching elements forward; erase truncates the rest. C++20's std::erase replaces this.
- 4. What is the iterator category required by std::sort? — Random-access (or contiguous in C++20); list iterators are only bidirectional, so list has its own sort() member.
- 5. Why does std::accumulate's initial value matter for floats? — The init's type determines the accumulation type; `accumulate(begin, end, 0)` on doubles does int arithmetic. Pass `0.0`.

### Mini Project

Build a CSV Stats Calculator: A program that reads numeric columns from a CSV file and computes min, max, mean, median, and standard deviation per column using STL algorithms. Suggested approach:
  - Parse CSV with std::ifstream and std::getline + std::stringstream
  - For each column, store values in a std::vector<double>
  - Use std::minmax_element for min/max
  - Use std::accumulate for sum, then divide for mean
  - Sort a copy with std::sort to find median; use std::inner_product for variance

### Exercises

1. Sort a vector<int> descending with a lambda comparator; verify with a unit test.
2. Apply std::transform to square each element of a vector; chain with std::accumulate to compute the sum of squares.
3. Use the erase-remove idiom to strip all odd numbers from a vector; then rewrite with C++20 std::erase_if.
4. Sort a vector then use std::lower_bound to find the first element >= 50; print its index.
5. Use std::reduce (C++17) with std::execution::par on a large vector and compare timing to std::accumulate.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is std::sort's complexity?
9. A) O(n)
10. B) O(n log n) average and worst-case (*)
11. C) O(n^2)
12. D) O(log n)
13. Explanation: std::sort is introsort (quicksort + heapsort fallback), giving O(n log n) average and worst-case.
14. Q2: What does std::remove do?
15. A) Erases elements from the container
16. B) Deletes the elements
17. C) Shifts non-matching elements forward and returns a new end; does not erase (*)
18. D) Sorts the elements
19. Explanation: std::remove reorders in place; you must call erase with the returned iterator to actually drop the elements (or use C++20 std::erase).
20. Q3: What is required of a comparator passed to std::sort?
21. A) It must return bool
22. B) It must use <=
23. C) It must be commutative
24. D) It must be a strict weak order (*)
25. Explanation: The comparator must be a strict weak order (irreflexive, asymmetric, transitive, equivalent-incomparable); using <= is UB.
26. Q4: Which iterator category does std::sort require?
27. A) Random-access (*)
28. B) Input
29. C) Forward
30. D) Bidirectional
31. Explanation: std::sort requires random-access iterators (contiguous in C++20); list iterators are only bidirectional, so list has its own member sort.
32. Q5: What does std::accumulate(begin, end, 0) do on a vector<double>?
33. A) Sums doubles
34. B) Computes int arithmetic — initial value type is int (*)
35. C) Throws
36. D) Returns 0
37. Explanation: The initial value's type determines the accumulator type; pass 0.0 (or explicit double) to accumulate doubles correctly.
38. Q6: What does std::binary_search require of the input range?
39. A) Nothing
40. B) Unique elements
41. C) Sorted by the same comparator (*)
42. D) A hash function
43. Explanation: binary_search assumes the range is partitioned (sorted) by `<` with respect to the value; on an unsorted range results are wrong.
44. Q7: What is the erase-remove idiom?
45. A) erase(begin, end)
46. B) v.remove(val)
47. C) std::erase only
48. D) v.erase(std::remove(...), v.end()) (*)
49. Explanation: std::remove shifts non-matching elements forward; v.erase truncates from the returned iterator to v.end(). C++20 std::erase wraps both.
50. Q8: Which algorithm finds the first element >= value in a sorted range?
51. A) std::lower_bound (*)
52. B) std::find
53. C) std::upper_bound
54. D) std::search
55. Explanation: lower_bound returns an iterator to the first element not less than value (i.e., >= value); upper_bound returns the first element greater than value.
56. Q9: What does std::transform do?
57. A) Modifies in place
58. B) Applies a function to each element, writing results to an output range (*)
59. C) Sorts and transforms
60. D) Erases transformed elements
61. Explanation: transform applies a unary (or binary) function to each element of the input range and writes the results to an output iterator.
62. Q10: What is std::reduce (C++17) for?
63. A) Reducing container size
64. B) Removing elements
65. C) A sum/fold that can run in parallel and out of order (*)
66. D) A synonym for std::transform
67. Explanation: std::reduce (C++17) sums/folds in an unspecified order, enabling parallel execution with std::execution::par, unlike std::accumulate which is strictly left-to-right.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is std::sort's complexity?
  options:
    - O(n)
    - O(n log n) average and worst-case
    - O(n^2)
    - O(log n)
  correctIndex: 1
  explanation: std::sort is introsort (quicksort + heapsort fallback), giving O(n log n) average and worst-case.
- id: q2
  question: What does std::remove do?
  options:
    - Erases elements from the container
    - Deletes the elements
    - Shifts non-matching elements forward and returns a new end; does not erase
    - Sorts the elements
  correctIndex: 2
  explanation: std::remove reorders in place; you must call erase with the returned iterator to actually drop the elements (or use C++20 std::erase).
- id: q3
  question: What is required of a comparator passed to std::sort?
  options:
    - It must return bool
    - It must use <=
    - It must be commutative
    - It must be a strict weak order
  correctIndex: 3
  explanation: The comparator must be a strict weak order (irreflexive, asymmetric, transitive, equivalent-incomparable); using <= is UB.
- id: q4
  question: Which iterator category does std::sort require?
  options:
    - Random-access
    - Input
    - Forward
    - Bidirectional
  correctIndex: 0
  explanation: std::sort requires random-access iterators (contiguous in C++20); list iterators are only bidirectional, so list has its own member sort.
- id: q5
  question: What does std::accumulate(begin, end, 0) do on a vector<double>?
  options:
    - Sums doubles
    - Computes int arithmetic — initial value type is int
    - Throws
    - Returns 0
  correctIndex: 1
  explanation: The initial value's type determines the accumulator type; pass 0.0 (or explicit double) to accumulate doubles correctly.
- id: q6
  question: What does std::binary_search require of the input range?
  options:
    - Nothing
    - Unique elements
    - Sorted by the same comparator
    - A hash function
  correctIndex: 2
  explanation: binary_search assumes the range is partitioned (sorted) by `<` with respect to the value; on an unsorted range results are wrong.
- id: q7
  question: What is the erase-remove idiom?
  options:
    - erase(begin, end)
    - v.remove(val)
    - std::erase only
    - v.erase(std::remove(...), v.end())
  correctIndex: 3
  explanation: std::remove shifts non-matching elements forward; v.erase truncates from the returned iterator to v.end(). C++20 std::erase wraps both.
- id: q8
  question: Which algorithm finds the first element >= value in a sorted range?
  options:
    - std::lower_bound
    - std::find
    - std::upper_bound
    - std::search
  correctIndex: 0
  explanation: lower_bound returns an iterator to the first element not less than value (i.e., >= value); upper_bound returns the first element greater than value.
- id: q9
  question: What does std::transform do?
  options:
    - Modifies in place
    - Applies a function to each element, writing results to an output range
    - Sorts and transforms
    - Erases transformed elements
  correctIndex: 1
  explanation: transform applies a unary (or binary) function to each element of the input range and writes the results to an output iterator.
- id: q10
  question: What is std::reduce (C++17) for?
  options:
    - Reducing container size
    - Removing elements
    - A sum/fold that can run in parallel and out of order
    - A synonym for std::transform
  correctIndex: 2
  explanation: std::reduce (C++17) sums/folds in an unspecified order, enabling parallel execution with std::execution::par, unlike std::accumulate which is strictly left-to-right.
```

