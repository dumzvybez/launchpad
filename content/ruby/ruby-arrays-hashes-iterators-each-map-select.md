---
slug: ruby-arrays-hashes-iterators-each-map-select
id: ruby-05
track: ruby
order: 5
title: Arrays, Hashes, and Iterators (each, map, select)
description: Learn Ruby's core collections and the iterator trio each/map/select, plus the famous mutable-default-Hash pitfall.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=2700s
whyItMatters: Learn Ruby's core collections and the iterator trio each/map/select, plus the famous mutable-default-Hash pitfall.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Arrays, Hashes, and Iterators (each, map, select)

## Arrays, Hashes, and Iterators (each, map, select)

### Why It Matters

Learn Ruby's core collections and the iterator trio each/map/select, plus the famous mutable-default-Hash pitfall.

Learn Ruby's core collections and the iterator trio each/map/select, plus the famous mutable-default-Hash pitfall.

### Prerequisites

- Stage 4: Strings, Symbols, and Ranges
- Familiarity with blocks (preview of Stage 6).

### Topics

- Array literals: [], %w[], %i[]
- Hash literals (new and old syntax) and Hash.new with default
- each vs map vs select vs reduce (and what each returns)
- each_with_index, with_index, group_by, partition, tally
- Array methods: push/pop, shift/unshift, sort, flatten, zip
- Hash methods: keys, values, merge, transform_values, dig
- Splat (*) in array destructuring
- Lazy enumerators for infinite sequences

### Key Concepts

- each returns the original collection (NOT the accumulated results) — common source of bugs.
- map returns a new array with one entry per element; the block's return value becomes the entry.
- select keeps elements where the block returns truthy; reject is the inverse.
- Hash.new({}) shares one default object across all missing keys; use Hash.new { |h,k| h[k] = {} } for per-key defaults.
- Splat (*) collects multiple values: `a, *rest = [1,2,3,4]` makes a=1, rest=[2,3,4].
- Lazy enumerators defer evaluation — `(1..Float::INFINITY).lazy.select(&:even?).first(5)`.

```ruby
nums = [1, 2, 3, 4, 5]

# each returns the original array (NOT the accumulated result)
result = nums.each { |n| n * 2 }
puts result.inspect  # [1, 2, 3, 4, 5]

# map returns a NEW array of transformed values
doubled = nums.map { |n| n * 2 }
puts doubled.inspect  # [2, 4, 6, 8, 10]

# select filters by truthy block results
evens = nums.select { |n| n.even? }
puts evens.inspect  # [2, 4]

# reduce accumulates
sum = nums.reduce(0) { |acc, n| acc + n }
puts sum  # 15
```
Caption: each vs map vs select vs reduce

### Common Pitfalls

- Using each when you meant map — each returns the original collection; use map when you need a new array of transformed values.
- Hash.new({}) shares the default object across all keys — Use Hash.new { |h, k| h[k] = {} } so each missing key gets its own fresh object.
- Modifying an array while iterating it — Mutating a collection during each causes skipped/duplicated elements; build a new array with map/select instead.
- Confusing select with detect — select returns ALL matching elements; detect (aka find) returns the FIRST match or nil.
- Forgetting that map returns nil for nil block returns — If your block returns nil for some elements, map produces an array with nils — use compact to clean, or filter_map (Ruby 2.7+).

### Real-World Applications

- GitHub uses enumerable chains (.map.select.reduce) in its code-review routing to filter and score pull request candidates.
- Shopify's order pipeline uses group_by to bucket orders by fulfillment center before dispatching to warehouse APIs.
- Airbnb's search backend uses lazy enumerators to stream filter results from millions of listings without loading all into memory.
- Stripe's reconciliation jobs use reduce to aggregate millions of ledger entries into daily settlement totals.

### Interview Questions

- 1. What does `each` return? — The original collection unchanged — NOT the accumulated block results (that's map).
- 2. What's the difference between map and select? — map transforms each element into a new array; select filters elements where the block is truthy.
- 3. Why is `Hash.new({})` dangerous? — It shares the SAME default object across all missing keys, causing cross-contamination of unrelated entries.
- 4. What does `detect` return? — The FIRST element for which the block is truthy, or nil if none match (alias: find).
- 5. What does `each_with_index` yield? — Two block args: the element and its zero-based index.

### Mini Project

Build a Word Frequency Analyzer CLI: A tool that reads a text file,
counts word occurrences (case-insensitive), and prints the top 10 most-
frequent words with their counts. Suggested approach:
Suggested approach:
  - Read text with File.read(ARGV[0]).downcase
  - Split into words with .scan(/\w+/)
  - Use tally (Ruby 2.7+) or group_by + count
  - Sort by value descending with .sort_by { |k,v| -v }
  - Take the top 10 and print formatted output

### Exercises

1. Given [1,2,3,4,5], use map to square, select to filter evens, and reduce to sum the result.
2. Build a hash with Hash.new { |h,k| h[k] = [] } and append elements to grouped lists.
3. Use each_with_index to print '1. apple', '2. banana', etc.
4. Use group_by to bucket [1,2,3,4,5,6] into {odd: [...], even: [...]}.
5. Use `(1..Float::INFINITY).lazy.select(&:even?).first(5)` and verify only 5 values are computed.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `[1,2,3].each { |n| n * 2 }` return?
9. A) [1, 2, 3] (*)
10. B) [2, 4, 6]
11. C) 6
12. D) nil
13. Explanation: each returns the original array; use map to get the transformed [2,4,6].
14. Q2: What does `[1,2,3,4].select(&:even?)` return?
15. A) [1, 3]
16. B) [2, 4] (*)
17. C) 2
18. D) true
19. Explanation: select keeps elements where the block is truthy.
20. Q3: What's the danger of `Hash.new({})`?
21. A) It's slower than {}
22. B) It raises KeyError on missing keys
23. C) All missing keys share the SAME default object (*)
24. D) It freezes the default
25. Explanation: Hash.new({}) returns the same hash instance for every missing key, causing cross-contamination.
26. Q4: What does `detect` (alias `find`) return?
27. A) All matching elements
28. B) The index of the first match
29. C) true if any match exists
30. D) The first matching element (or nil) (*)
31. Explanation: detect returns the first element for which the block is truthy, or nil if none.
32. Q5: Which correctly creates an array of words from a string?
33. A) %w[a b c] (*)
34. B) "a b c".split_words
35. C) new Array('a b c')
36. D) Array.words("a b c")
37. Explanation: %w[] creates an array of words from whitespace-separated tokens without quotes/commas.
38. Q6: What does `[1,2,3].reduce(:+)` return?
39. A) [1, 2, 3]
40. B) 6 (*)
41. C) 3
42. D) Raises
43. Explanation: reduce(:+) sums all elements using the + method (symbol shorthand).
44. Q7: What does `each_with_index` yield?
45. A) Just the element
46. B) The index only
47. C) The element and its index (*)
48. D) The element and the previous element
49. Explanation: each_with_index yields two block args: (element, index).
50. Q8: How do you safely default missing Hash keys to per-key arrays?
51. A) Hash.new([])
52. B) Hash.new(Array.new)
53. C) Hash.new { [] }
54. D) Hash.new { |h, k| h[k] = [] } (*)
55. Explanation: The block form assigns a NEW array per missing key, preventing shared-state bugs.
56. Q9: What does `(1..Float::INFINITY).lazy.select(&:even?).first(3)` return?
57. A) [2, 4, 6] (*)
58. B) Raises RangeError
59. C) [1, 2, 3]
60. D) An infinite loop
61. Explanation: lazy defers evaluation; first(3) forces only the elements needed to produce 3 evens.
62. Q10: What does `tally` (Ruby 2.7+) do on an array?
63. A) Sorts the array
64. B) Returns a hash of element => count (*)
65. C) Returns the unique elements
66. D) Returns the most common element
67. Explanation: tally counts occurrences: %w[a a b].tally == {'a'=>2, 'b'=>1}.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `[1,2,3].each { |n| n * 2 }` return?
  options:
    - "[1, 2, 3]"
    - "[2, 4, 6]"
    - "6"
    - nil
  correctIndex: 0
  explanation: each returns the original array; use map to get the transformed [2,4,6].
- id: q2
  question: What does `[1,2,3,4].select(&:even?)` return?
  options:
    - "[1, 3]"
    - "[2, 4]"
    - "2"
    - "true"
  correctIndex: 1
  explanation: select keeps elements where the block is truthy.
- id: q3
  question: What's the danger of `Hash.new({})`?
  options:
    - It's slower than {}
    - It raises KeyError on missing keys
    - All missing keys share the SAME default object
    - It freezes the default
  correctIndex: 2
  explanation: Hash.new({}) returns the same hash instance for every missing key, causing cross-contamination.
- id: q4
  question: What does `detect` (alias `find`) return?
  options:
    - All matching elements
    - The index of the first match
    - true if any match exists
    - The first matching element (or nil)
  correctIndex: 3
  explanation: detect returns the first element for which the block is truthy, or nil if none.
- id: q5
  question: Which correctly creates an array of words from a string?
  options:
    - "%w[a b c]"
    - '"a b c".split_words'
    - new Array('a b c')
    - Array.words("a b c")
  correctIndex: 0
  explanation: "%w[] creates an array of words from whitespace-separated tokens without quotes/commas."
- id: q6
  question: What does `[1,2,3].reduce(:+)` return?
  options:
    - "[1, 2, 3]"
    - "6"
    - "3"
    - Raises
  correctIndex: 1
  explanation: reduce(:+) sums all elements using the + method (symbol shorthand).
- id: q7
  question: What does `each_with_index` yield?
  options:
    - Just the element
    - The index only
    - The element and its index
    - The element and the previous element
  correctIndex: 2
  explanation: "each_with_index yields two block args: (element, index)."
- id: q8
  question: How do you safely default missing Hash keys to per-key arrays?
  options:
    - Hash.new([])
    - Hash.new(Array.new)
    - Hash.new { [] }
    - Hash.new { |h, k| h[k] = [] }
  correctIndex: 3
  explanation: The block form assigns a NEW array per missing key, preventing shared-state bugs.
- id: q9
  question: What does `(1..Float::INFINITY).lazy.select(&:even?).first(3)` return?
  options:
    - .lazy.select(&:even?).first(3)` return?
    - "[2, 4, 6]"
    - Raises RangeError
    - "[1, 2, 3]"
    - An infinite loop
  correctIndex: 1
  explanation: lazy defers evaluation; first(3) forces only the elements needed to produce 3 evens.
- id: q10
  question: What does `tally` (Ruby 2.7+) do on an array?
  options:
    - Sorts the array
    - Returns a hash of element => count
    - Returns the unique elements
    - Returns the most common element
  correctIndex: 1
  explanation: "tally counts occurrences: %w[a a b].tally == {'a'=>2, 'b'=>1}."
```

