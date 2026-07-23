---
slug: python-data-structures-lists-dicts-sets-tuples
id: python-07
track: python
order: 7
title: Data Structures — Lists, Dicts, Sets, Tuples
description: Master Python's four core built-in collections — lists, dicts, sets, and tuples — including iteration, the insertion-ordered dict (3.7+), and the deadly list-aliasing trap.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=6800s
whyItMatters: Master Python's four core built-in collections — lists, dicts, sets, and tuples — including iteration, the insertion-ordered dict (3. 7+), and the deadly list-aliasing trap.
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Data Structures — Lists, Dicts, Sets, Tuples

## Data Structures — Lists, Dicts, Sets, Tuples

### Why It Matters

Master Python's four core built-in collections — lists, dicts, sets, and tuples — including iteration, the insertion-ordered dict (3. 7+), and the deadly list-aliasing trap.

Master Python's four core built-in collections — lists, dicts, sets, and tuples — including iteration, the insertion-ordered dict (3.7+), and the deadly list-aliasing trap.

### Prerequisites

- Stage 6: Functions and Scope
- Stage 5: Control Flow — Conditionals and Loops.

### Topics

- list: append, extend, insert, pop, sort, sorted, reverse, index, count
- dict: get, keys, values, items, update, setdefault, pop, dict comprehension
- set: add, remove, discard, union, intersection, difference, symmetric_difference
- tuple: immutability, packing/unpacking, named tuples
- Nested data structures (list of dicts, dict of lists)
- Dict ordering (insertion-ordered since 3.7, guaranteed by language spec)
- Aliasing vs copying (shallow copy with copy.copy, deep copy with copy.deepcopy)
- collections module: defaultdict, Counter, OrderedDict, deque

### Key Concepts

- Lists, dicts, and sets are mutable; tuples and strings are immutable.
- `a = b` for a mutable object creates an alias — both names point to the same object.
- Dicts are insertion-ordered since 3.7 (and as a CPython detail since 3.6).
- Sets use hashing for O(1) membership tests but require hashable elements.
- Tuples are immutable but may contain mutable elements (e.g. (1, [2, 3])).

```python
a = [1, 2, 3]
b = a            # alias — same object
b.append(4)
print(a)         # [1, 2, 3, 4]  ← a changed too!

# Shallow copy (top-level only)
c = a.copy()     # or a[:] or list(a)
c.append(5)
print(a)         # [1, 2, 3, 4]  ← unchanged

# Deep copy (recursively copies nested mutables)
import copy
nested = [[1, 2], [3, 4]]
deep = copy.deepcopy(nested)
deep[0].append(99)
print(nested)    # [[1, 2], [3, 4]]  ← unchanged
```
Caption: List aliasing and copy

### Common Pitfalls

- List aliasing — `b = a` aliases the list; mutating b mutates a. Use `b = a.copy()` or `b = list(a)` for a shallow copy.
- Modifying a dict while iterating — RuntimeError: dictionary changed size during iteration; iterate over `list(d.items())` to take a snapshot.
- Mutable class attributes shared across instances — `class C: items = []` makes ALL instances share the same list; fix by initializing in __init__.
- Using `== None` instead of `is None` — `==` can be overridden; None is a singleton, so `is None` is correct.
- Forgetting that tuples are immutable only at the top level — `(1, [2, 3])[1].append(4)` works fine; the list inside is mutable.

### Real-World Applications

- Instagram uses Python dicts (now ordered) to model post metadata fields with consistent iteration order for cache keys.
- Spotify uses sets for O(1) membership checks in user-genre matching (millions of users × thousands of genres).
- Reddit uses Counter from collections for vote tallying and hot-ranking computation.
- Dropbox uses deepcopy to snapshot file-sync state before applying remote changes.

### Interview Questions

- 1. What's the difference between a list and a tuple? — Lists are mutable; tuples are immutable (but can contain mutable elements).
- 2. Are dicts ordered in Python? — Yes, since 3.7 (3.6 in CPython), dicts preserve insertion order, guaranteed by the language spec.
- 3. What's the difference between `b = a` and `b = a.copy()` for a list? — `b = a` aliases; `b = a.copy()` makes a shallow copy (new list, same element references).
- 4. When would you use a set vs a list? — Set for O(1) membership tests and uniqueness; list for ordered/indexed data with duplicates.
- 5. What is a defaultdict? — A dict that auto-creates missing keys via a factory function (e.g. defaultdict(int) starts missing keys at 0).

### Mini Project

Build a Word Frequency Analyzer: A CLI that reads a text file and prints the top-N most common words, ignoring stopwords, with case folding. Suggested approach:
  - Use collections.Counter for counting
  - Use a set of stopwords for O(1) lookup
  - Use dict comprehension to filter stopwords
  - Use Counter.most_common(N) for the top-N
  - Add a --min-length flag and a --json output flag

### Exercises

1. Reproduce the list-aliasing bug with `a = [1]; b = a; b.append(2)`; fix it with a copy.
2. Build a dict mapping names to ages, then iterate over .items() in insertion order.
3. Use a set to find the unique words in a paragraph.
4. Use defaultdict(list) to group words by their first letter.
5. Use a namedtuple to model a 2D Point and compute the distance between two points.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `b = a` do when a is a list?
9. A) Creates a new list with the same elements
10. B) Aliases a — both names point to the same list object (*)
11. C) Creates a copy of a
12. D) Throws a TypeError
13. Explanation: Assignment in Python binds names to objects; b = a aliases the same list, so mutations through b are visible through a.
14. Q2: Since which Python version are dicts guaranteed insertion-ordered?
15. A) 3.5
16. B) 3.6
17. C) 3.7 (*)
18. D) 3.10
19. Explanation: CPython 3.6 introduced ordered dicts as an implementation detail; Python 3.7 made insertion-order a language guarantee.
20. Q3: Which makes a SHALLOW copy of a list?
21. A) b = a
22. B) b = list.copy(a)
23. C) b = copy.deepcopy(a)
24. D) b = a.copy() (*)
25. Explanation: a.copy() (or a[:] or list(a)) creates a new list with the same element references — only the top level is copied.
26. Q4: What's the time complexity of `x in my_set`?
27. A) O(1) average (*)
28. B) O(log n)
29. C) O(n)
30. D) O(n^2)
31. Explanation: Sets use hashing; membership test is O(1) average (O(n) worst case with hash collisions).
32. Q5: Which collection guarantees uniqueness AND is mutable?
33. A) list
34. B) set (*)
35. C) tuple
36. D) dict
37. Explanation: Sets store unique hashable elements and are mutable; frozenset is the immutable version.
38. Q6: What runs `d.items()` while you `del d[k]` inside the loop?
39. A) No effect
40. B) Silently skips the deleted key
41. C) RuntimeError: dictionary changed size during iteration (*)
42. D) Raises KeyError
43. Explanation: Mutating a dict during iteration raises RuntimeError in Python 3; iterate over list(d.items()) to snapshot first.
44. Q7: What does `defaultdict(int)` return for a missing key?
45. A) None
46. B) Empty string
47. C) KeyError
48. D) 0 (*)
49. Explanation: defaultdict calls the factory (int() → 0) for missing keys and stores it; no KeyError raised.
50. Q8: Which is True about tuples?
51. A) Tuples are immutable, but their elements can be mutable (*)
52. B) Tuples cannot contain mutable objects
53. C) Tuples have an .append() method
54. D) Tuples are unordered
55. Explanation: The tuple container is immutable, but a list inside a tuple can still be mutated: (1, [2]).append(3) is illegal but (1, [2])[1].append(3) is fine.
56. Q9: Which is the right way to check `x is None`?
57. A) x == None
58. B) x is None (*)
59. C) x = None
60. D) x.equals(None)
61. Explanation: None is a singleton; `is None` is faster and immune to __eq__ overrides. PEP 8 explicitly recommends this.
62. Q10: What does `Counter("aaabbc").most_common(2)` return?
63. A) [('a', 3), ('b', 2)]
64. B) [('a', 3), ('c', 1)]
65. C) [('a', 3), ('b', 2)] (*)
66. D) [('a', 3)]
67. Explanation: most_common(2) returns the 2 most frequent items as (element, count) tuples, in descending order.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `b = a` do when a is a list?
  options:
    - Creates a new list with the same elements
    - Aliases a — both names point to the same list object
    - Creates a copy of a
    - Throws a TypeError
  correctIndex: 1
  explanation: Assignment in Python binds names to objects; b = a aliases the same list, so mutations through b are visible through a.
- id: q2
  question: Since which Python version are dicts guaranteed insertion-ordered?
  options:
    - "3.5"
    - "3.6"
    - "3.7"
    - "3.10"
  correctIndex: 2
  explanation: CPython 3.6 introduced ordered dicts as an implementation detail; Python 3.7 made insertion-order a language guarantee.
- id: q3
  question: Which makes a SHALLOW copy of a list?
  options:
    - b = a
    - b = list.copy(a)
    - b = copy.deepcopy(a)
    - b = a.copy()
  correctIndex: 3
  explanation: a.copy() (or a[:] or list(a)) creates a new list with the same element references — only the top level is copied.
- id: q4
  question: What's the time complexity of `x in my_set`?
  options:
    - O(1) average
    - O(log n)
    - O(n)
    - O(n^2)
  correctIndex: 0
  explanation: Sets use hashing; membership test is O(1) average (O(n) worst case with hash collisions).
- id: q5
  question: Which collection guarantees uniqueness AND is mutable?
  options:
    - list
    - set
    - tuple
    - dict
  correctIndex: 1
  explanation: Sets store unique hashable elements and are mutable; frozenset is the immutable version.
- id: q6
  question: What runs `d.items()` while you `del d[k]` inside the loop?
  options:
    - No effect
    - Silently skips the deleted key
    - "RuntimeError: dictionary changed size during iteration"
    - Raises KeyError
  correctIndex: 2
  explanation: Mutating a dict during iteration raises RuntimeError in Python 3; iterate over list(d.items()) to snapshot first.
- id: q7
  question: What does `defaultdict(int)` return for a missing key?
  options:
    - None
    - Empty string
    - KeyError
    - "0"
  correctIndex: 3
  explanation: defaultdict calls the factory (int() → 0) for missing keys and stores it; no KeyError raised.
- id: q8
  question: Which is True about tuples?
  options:
    - Tuples are immutable, but their elements can be mutable
    - Tuples cannot contain mutable objects
    - Tuples have an .append() method
    - Tuples are unordered
  correctIndex: 0
  explanation: "The tuple container is immutable, but a list inside a tuple can still be mutated: (1, [2]).append(3) is illegal but (1, [2])[1].append(3) is fine."
- id: q9
  question: Which is the right way to check `x is None`?
  options:
    - x == None
    - x is None
    - x = None
    - x.equals(None)
  correctIndex: 1
  explanation: None is a singleton; `is None` is faster and immune to __eq__ overrides. PEP 8 explicitly recommends this.
- id: q10
  question: What does `Counter("aaabbc").most_common(2)` return?
  options:
    - "[('a', 3), ('b', 2)]"
    - "[('a', 3), ('c', 1)]"
    - "[('a', 3), ('b', 2)]"
    - "[('a', 3)]"
  correctIndex: 2
  explanation: most_common(2) returns the 2 most frequent items as (element, count) tuples, in descending order.
```

