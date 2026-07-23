---
slug: javascript-strings-arrays-array-methods
id: javascript-03
track: javascript
order: 3
title: Strings, Arrays, and Array Methods
description: Manipulate strings and arrays fluently using the modern functional methods — map, filter, reduce, slice, splice, sort, and friends.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=1300s
whyItMatters: Manipulate strings and arrays fluently using the modern functional methods — map, filter, reduce, slice, splice, sort, and friends.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Strings, Arrays, and Array Methods

## Strings, Arrays, and Array Methods

### Why It Matters

Manipulate strings and arrays fluently using the modern functional methods — map, filter, reduce, slice, splice, sort, and friends.

Manipulate strings and arrays fluently using the modern functional methods — map, filter, reduce, slice, splice, sort, and friends.

### Prerequisites

- Stage 2: Variables, Types, and Operators
- Comfort with arrays and objects as reference types.

### Topics

- String methods: slice, split, replace, replaceAll, padStart, includes, trim
- Template literals and tagged templates
- Array methods: map, filter, reduce, find, some, every, forEach
- Mutating vs non-mutating methods (push/pop/splice vs slice/concat/map)
- Spread and rest operators (...arr)
- Array destructuring and the swap idiom
- sort() and its comparator pitfalls
- flat() and flatMap()

### Key Concepts

- Most array methods are non-mutating (return a new array); a few mutate (push, pop, shift, unshift, splice, sort, reverse)
- `sort()` defaults to lexicographic order even for numbers — always pass a comparator
- `reduce` is the most powerful fold; master it once and you can express map/filter/etc. with it
- Strings are immutable — every "modification" returns a new string
- Spread copies one level deep — nested arrays still share references
- `Array.from` converts iterables/NodeLists into real arrays; `Array.of` is the safe constructor

```javascript
const orders = [
  { id: 1, total: 30, status: "shipped" },
  { id: 2, total: 75, status: "pending" },
  { id: 3, total: 120, status: "shipped" },
];

const shippedRevenue = orders
  .filter(o => o.status === "shipped")
  .map(o => o.total)
  .reduce((sum, n) => sum + n, 0);

console.log(shippedRevenue); // 150
```
Caption: Functional pipeline

### Common Pitfalls

- Forgetting that `sort()` mutates — `arr.sort()` changes the original array; sort a copy with `[...arr].sort(cmp)` or `arr.toSorted(cmp)` (ES2023).
- Sorting numbers without a comparator — `[10, 1, 2].sort()` gives `[1, 10, 2]` because they're coerced to strings; always pass `(a, b) => a - b`.
- Confusing `splice` (mutating) with `slice` (non-mutating) — `splice(index, deleteCount, ...items)` modifies in place; `slice(start, end)` returns a copy.
- Using `forEach` when you wanted `map` — `forEach` returns undefined and is for side effects; `map` returns a new array.
- Shallow copying nested arrays with spread — `[...nested]` only copies the outer array; inner arrays still share references; use `structuredClone` for deep copies.

### Real-World Applications

- Airbnb's listing search pipeline uses chained map/filter/reduce to transform thousands of raw API records into renderable cards in milliseconds.
- Slack's message threading uses flatMap to flatten channel+thread message trees into a single scrollable list.
- The Netflix UI's row-based carousel renders hundreds of titles via `.map` over normalized API responses, with virtualization layered on top.
- Google Sheets' client uses immutable array updates (spread + slice) to make cell-edit history reversible via undo stacks.

### Interview Questions

- 1. What's the difference between `map` and `forEach`? — map returns a new array of the same length; forEach returns undefined and is for side effects.
- 2. Why does `[10, 1, 2].sort()` return `[1, 10, 2]`? — Default sort coerces to strings and compares lexicographically; pass a numeric comparator.
- 3. Explain reduce. — It folds an array into a single value using an accumulator and current value; pass an initial accumulator to avoid type surprises.
- 4. Does `sort` mutate? — Yes; use `toSorted` (ES2023) or `[...arr].sort()` for a non-mutating sort.
- 5. How do you deep-copy an array of objects? — `structuredClone(arr)` (built-in since 2022) is the safest; JSON parse/stringify loses dates and functions.

### Mini Project

Build a "CSV-to-Objects" parser that takes a multi-line CSV string with a header row and returns an array of objects keyed by the headers. It outputs structured data and handles quoted values containing commas. Suggested approach:
  - Split input by newlines, then split each row by comma (respecting quotes)
  - Use the first row as the keys; map subsequent rows to objects via reduce or a for loop
  - Add a `--json` flag to JSON.stringify the output
  - Write a `filterRows(data, predicate)` helper that returns matching rows
  - Test with a 5-row CSV including one quoted "Hello, World" cell

### Exercises

1. Write `groupBy(arr, keyFn)` using reduce — group objects by a computed key.
2. Implement `unique(arr)` three ways: Set, filter+indexOf, and reduce.
3. Write a function that flattens a nested array of any depth without using `flat`.
4. Sort `["banana","apple","Cherry"]` case-insensitively and explain why default sort puts "Cherry" first.
5. Build a `chunk(arr, size)` function that splits an array into sub-arrays of length `size`.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which array method does NOT mutate the original array?
9. A) push
10. B) splice
11. C) map (*)
12. D) sort
13. Explanation: map returns a new array; push, splice, and sort mutate the original.
14. Q2: What does `[10, 1, 2].sort()` return?
15. A) [1, 2, 10]
16. B) [1, 10, 2] (*)
17. C) [10, 1, 2]
18. D) [2, 1, 10]
19. Explanation: Default sort coerces to strings and orders lexicographically: "1" < "10" < "2".
20. Q3: `reduce` is used to:
21. A) Remove duplicates
22. B) Fold an array into a single value (*)
23. C) Reverse an array
24. D) Filter out falsy values
25. Explanation: reduce takes an accumulator and current value, returning one accumulated result.
26. Q4: Which expression deep-copies a nested object safely in modern JS?
27. A) Object.assign({}, obj)
28. B) {...obj}
29. C) structuredClone(obj) (*)
30. D) JSON.stringify(obj)
31. Explanation: structuredClone handles nested objects, Dates, Maps, Sets; spread and Object.assign are shallow.
32. Q5: What does `"hello".split("").reverse().join("")` return?
33. A) "hello"
34. B) "olleh" (*)
35. C) ["h","e","l","l","o"]
36. D) TypeError
37. Explanation: split makes an array, reverse flips it, join glues the chars back into "olleh".
38. Q6: `Array.from(document.querySelectorAll("p"))` is used to:
39. A) Convert a NodeList to a real Array (*)
40. B) Create a new array of `<p>` elements
41. C) Replace querySelectorAll
42. D) Add event listeners
43. Explanation: querySelectorAll returns a NodeList (no .map); Array.from gives you the full array API.
44. Q7: Which is the safe way to swap two variables?
45. A) [a, b] = [b, a] (*)
46. B) a = b; b = a;
47. C) swap(a, b)
48. D) a, b = b, a
49. Explanation: Destructuring assignment swaps values atomically without a temp variable.
50. Q8: What does `[1,2,3].flatMap(x => [x, x*10])` return?
51. A) [[1,10],[2,20],[3,30]]
52. B) [1, 10, 2, 20, 3, 30] (*)
53. C) [1, 2, 3, 10, 20, 30]
54. D) [1, 2, 3]
55. Explanation: flatMap maps then flattens by one level, giving [1,10,2,20,3,30].
56. Q9: Which string method is immutable (returns a new string)?
57. A) All string methods — strings are immutable (*)
58. B) Only slice
59. C) Only replace
60. D) None — strings are mutable
61. Explanation: Strings are primitives and can't be mutated; every method returns a new string.
62. Q10: `["a","b","c"].reduce((acc, x) => acc + x, "")` returns:
63. A) "abc" (*)
64. B) ["a","b","c"]
65. C) "cba"
66. D) 0
67. Explanation: With an initial "" accumulator, reduce concatenates: "" + "a" + "b" + "c" = "abc".
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which array method does NOT mutate the original array?
  options:
    - push
    - splice
    - map
    - sort
  correctIndex: 2
  explanation: map returns a new array; push, splice, and sort mutate the original.
- id: q2
  question: What does `[10, 1, 2].sort()` return?
  options:
    - "[1, 2, 10]"
    - "[1, 10, 2]"
    - "[10, 1, 2]"
    - "[2, 1, 10]"
  correctIndex: 1
  explanation: 'Default sort coerces to strings and orders lexicographically: "1" < "10" < "2".'
- id: q3
  question: "`reduce` is used to:"
  options:
    - Remove duplicates
    - Fold an array into a single value
    - Reverse an array
    - Filter out falsy values
  correctIndex: 1
  explanation: reduce takes an accumulator and current value, returning one accumulated result.
- id: q4
  question: Which expression deep-copies a nested object safely in modern JS?
  options:
    - Object.assign({}, obj)
    - "{...obj}"
    - structuredClone(obj)
    - JSON.stringify(obj)
  correctIndex: 2
  explanation: structuredClone handles nested objects, Dates, Maps, Sets; spread and Object.assign are shallow.
- id: q5
  question: What does `"hello".split("").reverse().join("")` return?
  options:
    - '"hello"'
    - '"olleh"'
    - '["h","e","l","l","o"]'
    - TypeError
  correctIndex: 1
  explanation: split makes an array, reverse flips it, join glues the chars back into "olleh".
- id: q6
  question: '`Array.from(document.querySelectorAll("p"))` is used to:'
  options:
    - Convert a NodeList to a real Array
    - Create a new array of `<p>` elements
    - Replace querySelectorAll
    - Add event listeners
  correctIndex: 0
  explanation: querySelectorAll returns a NodeList (no .map); Array.from gives you the full array API.
- id: q7
  question: Which is the safe way to swap two variables?
  options:
    - "[a, b] = [b, a]"
    - a = b; b = a;
    - swap(a, b)
    - a, b = b, a
  correctIndex: 0
  explanation: Destructuring assignment swaps values atomically without a temp variable.
- id: q8
  question: What does `[1,2,3].flatMap(x => [x, x*10])` return?
  options:
    - "[[1,10],[2,20],[3,30]]"
    - "[1, 10, 2, 20, 3, 30]"
    - "[1, 2, 3, 10, 20, 30]"
    - "[1, 2, 3]"
  correctIndex: 1
  explanation: flatMap maps then flattens by one level, giving [1,10,2,20,3,30].
- id: q9
  question: Which string method is immutable (returns a new string)?
  options:
    - All string methods — strings are immutable
    - Only slice
    - Only replace
    - None — strings are mutable
  correctIndex: 0
  explanation: Strings are primitives and can't be mutated; every method returns a new string.
- id: q10
  question: '`["a","b","c"].reduce((acc, x) => acc + x, "")` returns:'
  options:
    - '"abc"'
    - '["a","b","c"]'
    - '"cba"'
    - "0"
  correctIndex: 0
  explanation: 'With an initial "" accumulator, reduce concatenates: "" + "a" + "b" + "c" = "abc".'
```

