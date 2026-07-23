---
slug: ruby-enumerable-comparable
id: ruby-10
track: ruby
order: 10
title: Enumerable and Comparable
description: Include Enumerable to get map/select/reduce for free; include Comparable to get </>/sort for free via <=>.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=6200s
whyItMatters: Include Enumerable to get map/select/reduce for free; include Comparable to get </>/sort for free via <=>.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Enumerable and Comparable

## Enumerable and Comparable

### Why It Matters

Include Enumerable to get map/select/reduce for free; include Comparable to get </>/sort for free via <=>.

Include Enumerable to get map/select/reduce for free; include Comparable to get </>/sort for free via <=>.

### Prerequisites

- Stage 9: Inheritance, Modules, and Mixins
- Familiarity with each/map/select (Stage 5).

### Topics

- Including Enumerable requires defining #each
- Enumerable methods: map, select, reduce, sort, max_by, group_by, partition, tally, chunk
- Including Comparable requires defining #<=>
- Comparable gives <, >, ==, between?, clamp, sort integration
- <=> (spaceship) returns -1, 0, 1, or nil
- Enumerator and Enumerator::Lazy for deferred evaluation
- sort_by with array of keys for multi-criteria sorting
- each_with_object and inject

### Key Concepts

- Enumerable gives you 50+ methods for free if you implement just #each.
- Comparable gives you <, >, <=, >=, ==, between?, clamp for free if you implement #<=>.
- <=> (spaceship) returns -1 if self < other, 0 if equal, 1 if greater, nil if incomparable.
- Lazy enumerators defer work; `(1..Float::INFINITY).lazy.map { ... }.first(5)` computes only what's needed.
- sort_by with an array of keys sorts by first key, then second, etc. — use negation for descending on numerics.
- each_with_object memoizes an object across iterations (unlike reduce which returns the memo's last value).

```ruby
class Playlist
  include Enumerable

  def initialize(*songs)
    @songs = songs
  end

  # Enumerable REQUIRES you to define #each
  def each(&blk) = @songs.each(&blk)
end

p = Playlist.new('A', 'B', 'C', 'DD')

# Now you get map, select, reduce, sort, etc. for free:
puts p.map(&:length).inspect       # [1, 1, 1, 2]
puts p.select { |s| s.length > 1 }  # DD
puts p.reduce('') { |acc, s| acc + s }  # ABCDD
puts p.max_by(&:length)             # DD
puts p.tally                        # {"A"=>1, "B"=>1, ...}
puts p.sort_by { |s| [-s.length, s] }.inspect  # sort by length desc then alpha
```
Caption: Enumerable: define each, get everything

### Common Pitfalls

- Forgetting to define #each when including Enumerable — Enumerable REQUIRES #each; without it, every other method raises NoMethodError on iteration.
- Returning nil from <=> breaks sort — <=> must return -1/0/1; returning nil (e.g., comparing incompatible types) makes sort raise ArgumentError.
- Using reduce when you mean each_with_object — reduce returns the block's last value; each_with_object returns the memo — the latter is less surprising for accumulation.
- Confusing max and max_by — max uses <=>; max_by uses the block's return value — use max_by(&:score) to find the element with the highest score.
- Loading infinite sequences without lazy — `(1..Float::INFINITY).map { ... }.first(5)` hangs forever; add .lazy before map to defer evaluation.

### Real-World Applications

- Rails ActiveRecord::Relation includes Enumerable so you can chain .map, .select, .sort_by on query results.
- Shopify's product catalog uses Comparable on Money objects to sort prices across multiple currencies after conversion.
- Airbnb's date-range search uses lazy enumerators to stream available dates from a year-long availability matrix.
- GitHub's commit-graph traversal uses Enumerator to walk millions of commits without loading them all into memory.

### Interview Questions

- 1. What must you define to use Enumerable? — #each — every other Enumerable method is built on top of it.
- 2. What must you define to use Comparable? — #<=> (the spaceship operator) — it returns -1, 0, 1, or nil.
- 3. What does <=> return when comparing 5 to 10? — -1 (5 is less than 10); returns 0 for equal, 1 for greater, nil for incomparable.
- 4. Why use lazy on a Range? — Defers evaluation so infinite sequences can be queried with .first(N) without hanging.
- 5. How does sort_by handle multiple criteria? — Return an array of keys; sort_by compares element-wise — use negation on numerics for descending order.

### Mini Project

Build a Deck of Cards with Enumerable/Comparable: A Card class
(Comparable by rank), a Deck class (Enumerable with shuffle, deal,
sort), and a Hand class that uses sort_by to arrange cards. Suggested
approach:
Suggested approach:
  - Define Card with <=> based on rank
  - Define Deck#include Enumerable and #each over @cards
  - Use sort_by { |c| [c.suit, c.rank] } for full ordering
  - Use partition to split dealt cards into hands
  - Use max_by to find the highest card in a hand

### Exercises

1. Include Enumerable in a Playlist class with #each; demonstrate .map and .select work.
2. Include Comparable in a Temperature class with #<=>; demonstrate sort, between?, and clamp.
3. Build an infinite Fibonacci Enumerator and use .first(10).
4. Use sort_by with array keys to sort people by [dept, age desc, name].
5. Use each_with_object to build a hash of word => count from an array.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What must you define to include Enumerable?
9. A) #map
10. B) #each (*)
11. C) #size
12. D) #to_a
13. Explanation: Enumerable is built entirely on #each — define it and you get map, select, reduce, sort, etc. for free.
14. Q2: What must you define to include Comparable?
15. A) #==
16. B) #<
17. C) #<=> (*)
18. D) #hash
19. Explanation: Comparable requires #<=> (spaceship) — it derives <, >, <=, >=, ==, between?, clamp.
20. Q3: What does `5 <=> 10` return?
21. A) 1
22. B) 0
23. C) nil
24. D) -1 (*)
25. Explanation: Spaceship returns -1 if left < right, 0 if equal, 1 if left > right.
26. Q4: Why add .lazy before .map on an infinite Range?
27. A) To defer evaluation so .first(N) doesn't hang (*)
28. B) To memoize results
29. C) To parallelize
30. D) To make it thread-safe
31. Explanation: lazy creates an Enumerator::Lazy that only computes values as forced — essential for infinite sequences.
32. Q5: How do you sort_by multiple criteria?
33. A) Chain sort_by calls
34. B) Return an array of sort keys (*)
35. C) Pass a lambda
36. D) Use sort instead
37. Explanation: sort_by compares the returned arrays element-wise; use negation for descending on numerics.
38. Q6: What's the difference between reduce and each_with_object?
39. A) They're identical
40. B) each_with_object is deprecated
41. C) reduce uses the block's last return as memo; each_with_object returns the memo object (*)
42. D) reduce only works on arrays
43. Explanation: each_with_object always returns the memo — less surprising than reduce which requires you to return the memo at end of block.
44. Q7: What does `partition` return?
45. A) A hash
46. B) Only matching elements
47. C) Only non-matching elements
48. D) A 2-element array: [matching, non-matching] (*)
49. Explanation: partition splits the collection into [matching, non-matching] in one pass.
50. Q8: What does `tally` return?
51. A) A hash of element => count (*)
52. B) The most common element
53. C) The unique elements
54. D) The total count
55. Explanation: tally counts occurrences: %w[a a b].tally == {"a"=>2, "b"=>1}.
56. Q9: What does `clamp(1, 10)` return for 15?
57. A) 15
58. B) 10 (*)
59. C) 1
60. D) nil
61. Explanation: clamp constrains the value to the range; 15 above the max returns the max (10).
62. Q10: What does `max_by(&:score)` return?
63. A) The scores sorted
64. B) The highest score value
65. C) The element with the highest score (*)
66. D) All elements with max score
67. Explanation: max_by returns the element for which the block returns the maximum value.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What must you define to include Enumerable?
  options:
    - "#map"
    - "#each"
    - "#size"
    - "#to_a"
  correctIndex: 1
  explanation: "Enumerable is built entirely on #each — define it and you get map, select, reduce, sort, etc. for free."
- id: q2
  question: What must you define to include Comparable?
  options:
    - "#=="
    - "#<"
    - "#<=>"
    - "#hash"
  correctIndex: 2
  explanation: "Comparable requires #<=> (spaceship) — it derives <, >, <=, >=, ==, between?, clamp."
- id: q3
  question: What does `5 <=> 10` return?
  options:
    - "1"
    - "0"
    - nil
    - "-1"
  correctIndex: 3
  explanation: Spaceship returns -1 if left < right, 0 if equal, 1 if left > right.
- id: q4
  question: Why add .lazy before .map on an infinite Range?
  options:
    - To defer evaluation so .first(N) doesn't hang
    - To memoize results
    - To parallelize
    - To make it thread-safe
  correctIndex: 0
  explanation: lazy creates an Enumerator::Lazy that only computes values as forced — essential for infinite sequences.
- id: q5
  question: How do you sort_by multiple criteria?
  options:
    - Chain sort_by calls
    - Return an array of sort keys
    - Pass a lambda
    - Use sort instead
  correctIndex: 1
  explanation: sort_by compares the returned arrays element-wise; use negation for descending on numerics.
- id: q6
  question: What's the difference between reduce and each_with_object?
  options:
    - They're identical
    - each_with_object is deprecated
    - reduce uses the block's last return as memo; each_with_object returns the memo object
    - reduce only works on arrays
  correctIndex: 2
  explanation: each_with_object always returns the memo — less surprising than reduce which requires you to return the memo at end of block.
- id: q7
  question: What does `partition` return?
  options:
    - A hash
    - Only matching elements
    - Only non-matching elements
    - "A 2-element array: [matching, non-matching]"
  correctIndex: 3
  explanation: partition splits the collection into [matching, non-matching] in one pass.
- id: q8
  question: What does `tally` return?
  options:
    - A hash of element => count
    - The most common element
    - The unique elements
    - The total count
  correctIndex: 0
  explanation: 'tally counts occurrences: %w[a a b].tally == {"a"=>2, "b"=>1}.'
- id: q9
  question: What does `clamp(1, 10)` return for 15?
  options:
    - "15"
    - "10"
    - "1"
    - nil
  correctIndex: 1
  explanation: clamp constrains the value to the range; 15 above the max returns the max (10).
- id: q10
  question: What does `max_by(&:score)` return?
  options:
    - The scores sorted
    - The highest score value
    - The element with the highest score
    - All elements with max score
  correctIndex: 2
  explanation: max_by returns the element for which the block returns the maximum value.
```

