---
slug: cpp-stl-containers-vector-map-set-unordered
id: cpp-09
track: cpp
order: 9
title: The STL — Containers (vector, map, set, unordered_*)
description: Tour the STL containers — vector, deque, list, array, map, set, unordered_map, unordered_set — and the iterator invalidation rules that govern safe use.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=400s
whyItMatters: Tour the STL containers — vector, deque, list, array, map, set, unordered_map, unordered_set — and the iterator invalidation rules that govern safe use.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# The STL — Containers (vector, map, set, unordered_*)

## The STL — Containers (vector, map, set, unordered_*)

### Why It Matters

Tour the STL containers — vector, deque, list, array, map, set, unordered_map, unordered_set — and the iterator invalidation rules that govern safe use.

Tour the STL containers — vector, deque, list, array, map, set, unordered_map, unordered_set — and the iterator invalidation rules that govern safe use.

### Prerequisites

- Stage 1-8 (especially templates)

### Topics

- Sequence containers: array, vector, deque, list, forward_list
- Associative containers: map, set, multimap, multiset (ordered, red-black tree)
- Unordered containers: unordered_map, unordered_set, etc. (hash table)
- Container adaptors: stack, queue, priority_queue
- Iterator invalidation rules per container
- Big-O complexity cheat sheet
- Custom comparators and custom hash functions
- std::vector<bool> specialization (and its quirks)
- Choosing the right container

### Key Concepts

- vector is the default: contiguous storage, O(1) random access, amortized O(1) push_back; insert/erase in the middle is O(n).
- map/set are ordered (red-black tree): O(log n) lookup, insert, erase; iteration is in sorted order.
- unordered_map/set are hash tables: average O(1) lookup/insert/erase, worst-case O(n); iteration order is unspecified.
- Iterator invalidation differs per container: vector push_back invalidates all iterators if it reallocates; list insert never invalidates; deque is the most surprising.
- std::vector<bool> is a special-case packed 1-bit-per-bool; its proxy-reference breaks generic code that expects `T&`.
- Use reserve() on vector when you know the final size to avoid reallocation cascades.

```cpp
#include <vector>
#include <iostream>

int main() {
    std::vector<int> v;
    v.reserve(1'000'000);              // one allocation, no realloc cascade
    for (int i = 0; i < 1'000'000; ++i) v.push_back(i);
    std::cout << v.size() << ' ' << v.capacity() << '\n';
}
```
Caption: vector with reserve

### Common Pitfalls

- Iterator invalidation after push_back on vector — the iterator may point into freed memory after a reallocation; reserve or take the index, not the iterator.
- Erasing in a range-based for — invalidates the implicit iterator; use the erase-remove idiom (Stage 10) or iterate by index carefully.
- unordered_map pointers/references to elements — rehashing invalidates pointers and references too (not just iterators); if you store pointers, prefer map or use a list-based store.
- std::vector<bool> proxy references — `auto& x = v[0]` doesn't compile; `for (auto& x : v)` doesn't compile; use std::vector<char> or std::deque<bool> instead.
- Using map when unordered_map suffices — map's ordered iteration is useful, but the O(log n) lookup vs O(1) average can be a real perf cliff for hot lookups.

### Real-World Applications

- Google's dense_hash_map (sparsepp) is a faster unordered_map used internally for hot lookup paths in Search and Spanner.
- LLVM's SmallVector<T, N> is a vector with a small inline buffer; the engine uses it everywhere to avoid heap allocations for small temporaries.
- MongoDB's WiredTiger uses page-based B-trees (similar in spirit to std::map) for its primary index structure.
- Unreal Engine's TArray<T> is essentially std::vector with extra features (memory tracking, slack control); it's the default container across the engine.

### Interview Questions

- 1. When is unordered_map faster than map? — Average O(1) vs O(log n) lookup; unordered wins when order doesn't matter and the hash is good.
- 2. What invalidates vector iterators? — push_back (if reallocation), insert/erase at or before the iterator, resize that grows beyond capacity; reserve() before insertion avoids reallocation.
- 3. Why is std::vector<bool> problematic? — It's a special-case packed storage with proxy references that break `T&` expectations and some generic algorithms.
- 4. What's the difference between deque and list? — deque has contiguous chunks with O(1) random access and O(1) front/back push/pop; list is doubly-linked with O(1) splicing but O(n) random access.
- 5. How do you choose between set and unordered_set? — Set keeps elements sorted (O(log n)) and supports range queries; unordered_set is faster average (O(1)) but unordered.

### Mini Project

Build a Word Frequency Counter: A program that reads a text file and prints the top-N most frequent words. Suggested approach:
  - Read the file with std::ifstream; tokenize on whitespace and punctuation
  - Use std::unordered_map<std::string, int> for counting
  - Copy to std::vector<pair> and sort by count desc, then word asc
  - Or use std::priority_queue with a custom comparator
  - Print the top N (default 10) words with their counts

### Exercises

1. Build a std::vector<int> with 1M random ints; benchmark push_back without reserve vs with reserve; explain the difference.
2. Insert 1M random ints into a std::map and an std::unordered_map; benchmark lookup; explain which is faster and why.
3. Demonstrate iterator invalidation: push_back into a vector with capacity() == size(); access the old iterator under ASan.
4. Build a std::vector<bool> and try `for (auto& x : v)`; read the error; rewrite using `for (auto x : v)`.
5. Write a custom hash for a struct with two strings; verify it works in std::unordered_set<YourStruct, YourHash>.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the average-case complexity of unordered_map::find?
9. A) O(1) (*)
10. B) O(log n)
11. C) O(n)
12. D) O(n log n)
13. Explanation: unordered_map is a hash table; average lookup is O(1), worst-case O(n) when many keys collide.
14. Q2: What invalidates a vector iterator?
15. A) Iterating to the end
16. B) push_back that causes reallocation (*)
17. C) Calling size()
18. D) Reading an element
19. Explanation: Reallocation moves the storage; old iterators point to freed memory. reserve() before insertion avoids reallocation.
20. Q3: Which container keeps elements in sorted order?
21. A) unordered_map
22. B) unordered_set
23. C) map (*)
24. D) vector (always)
25. Explanation: map and set are implemented as red-black trees; iteration yields elements in sorted key order. unordered_* are unsorted.
26. Q4: Why is std::vector<bool> special?
27. A) It is not a real container
28. B) It is always faster
29. C) It uses 1 byte per bool
30. D) It packs bits and returns proxy references, breaking T& (*)
31. Explanation: vector<bool> is a special-case packed 1-bit-per-bool; its operator[] returns a proxy that breaks generic code expecting T&.
32. Q5: What does vector::reserve(n) do?
33. A) Sets capacity to >= n without constructing elements (*)
34. B) Allocates n elements
35. C) Sets size to n
36. D) Constructs n default elements
37. Explanation: reserve allocates raw capacity without constructing; size is unchanged. Subsequent push_backs up to n won't reallocate.
38. Q6: Which container has O(1) front push/pop AND O(1) random access?
39. A) list
40. B) deque (*)
41. C) forward_list
42. D) set
43. Explanation: deque supports O(1) push/pop at both ends and O(1) random access; list has O(1) front push/pop but O(n) random access.
44. Q7: When does unordered_map rehashing invalidate pointers to elements?
45. A) Never
46. B) Always
47. C) When rehashing moves nodes (insert that exceeds load factor) (*)
48. D) Only on clear()
49. Explanation: Rehashing on insertion can move nodes, invalidating pointers and references; if you need stable pointers, use map or a node-based container.
50. Q8: What is the complexity of vector::insert in the middle?
51. A) O(1)
52. B) O(log n)
53. C) O(n log n)
54. D) O(n) (*)
55. Explanation: Inserting in the middle of a vector shifts subsequent elements by one, an O(n) operation.
56. Q9: Which container is implemented as a doubly-linked list?
57. A) list (*)
58. B) vector
59. C) deque
60. D) array
61. Explanation: std::list is a doubly-linked list with O(1) splice and O(1) push/pop at both ends, but O(n) random access.
62. Q10: What is the erase-remove idiom?
63. A) erase(begin, end)
64. B) `v.erase(std::remove(v.begin(), v.end(), val), v.end())` (or std::erase in C++20) (*)
65. C) delete v[i]
66. D) v.remove(val)
67. Explanation: To remove all matching elements, use erase-remove (or std::erase / std::erase_if in C++20) since remove just shifts and returns a new end.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the average-case complexity of unordered_map::find?
  options:
    - O(1)
    - O(log n)
    - O(n)
    - O(n log n)
  correctIndex: 0
  explanation: unordered_map is a hash table; average lookup is O(1), worst-case O(n) when many keys collide.
- id: q2
  question: What invalidates a vector iterator?
  options:
    - Iterating to the end
    - push_back that causes reallocation
    - Calling size()
    - Reading an element
  correctIndex: 1
  explanation: Reallocation moves the storage; old iterators point to freed memory. reserve() before insertion avoids reallocation.
- id: q3
  question: Which container keeps elements in sorted order?
  options:
    - unordered_map
    - unordered_set
    - map
    - vector (always)
  correctIndex: 2
  explanation: map and set are implemented as red-black trees; iteration yields elements in sorted key order. unordered_* are unsorted.
- id: q4
  question: Why is std::vector<bool> special?
  options:
    - It is not a real container
    - It is always faster
    - It uses 1 byte per bool
    - It packs bits and returns proxy references, breaking T&
  correctIndex: 3
  explanation: vector<bool> is a special-case packed 1-bit-per-bool; its operator[] returns a proxy that breaks generic code expecting T&.
- id: q5
  question: What does vector::reserve(n) do?
  options:
    - Sets capacity to >= n without constructing elements
    - Allocates n elements
    - Sets size to n
    - Constructs n default elements
  correctIndex: 0
  explanation: reserve allocates raw capacity without constructing; size is unchanged. Subsequent push_backs up to n won't reallocate.
- id: q6
  question: Which container has O(1) front push/pop AND O(1) random access?
  options:
    - list
    - deque
    - forward_list
    - set
  correctIndex: 1
  explanation: deque supports O(1) push/pop at both ends and O(1) random access; list has O(1) front push/pop but O(n) random access.
- id: q7
  question: When does unordered_map rehashing invalidate pointers to elements?
  options:
    - Never
    - Always
    - When rehashing moves nodes (insert that exceeds load factor)
    - Only on clear()
  correctIndex: 2
  explanation: Rehashing on insertion can move nodes, invalidating pointers and references; if you need stable pointers, use map or a node-based container.
- id: q8
  question: What is the complexity of vector::insert in the middle?
  options:
    - O(1)
    - O(log n)
    - O(n log n)
    - O(n)
  correctIndex: 3
  explanation: Inserting in the middle of a vector shifts subsequent elements by one, an O(n) operation.
- id: q9
  question: Which container is implemented as a doubly-linked list?
  options:
    - list
    - vector
    - deque
    - array
  correctIndex: 0
  explanation: std::list is a doubly-linked list with O(1) splice and O(1) push/pop at both ends, but O(n) random access.
- id: q10
  question: What is the erase-remove idiom?
  options:
    - erase(begin, end)
    - "`v.erase(std::remove(v.begin(), v.end(), val), v.end())` (or std::erase in C++20)"
    - delete v[i]
    - v.remove(val)
  correctIndex: 1
  explanation: To remove all matching elements, use erase-remove (or std::erase / std::erase_if in C++20) since remove just shifts and returns a new end.
```

