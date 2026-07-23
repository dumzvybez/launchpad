---
slug: ruby-variables-types-operators
id: ruby-02
track: ruby
order: 2
title: Variables, Types, and Operators
description: Learn Ruby's dynamic typing, local variables, primitive types, and the subtleties of ==, equal?, and eql?.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=600s
whyItMatters: Learn Ruby's dynamic typing, local variables, primitive types, and the subtleties of ==, equal?, and eql?.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Variables, Types, and Operators

## Variables, Types, and Operators

### Why It Matters

Learn Ruby's dynamic typing, local variables, primitive types, and the subtleties of ==, equal?, and eql?.

Learn Ruby's dynamic typing, local variables, primitive types, and the subtleties of ==, equal?, and eql?.

### Prerequisites

- Stage 1: Getting Started with Ruby
- Comfort with irb and running .rb files.

### Topics

- Local variables: lowercase, snake_case, no declaration keyword
- Integer and Float (Float::INFINITY, NaN)
- Boolean: true, false, and nil (which is falsy)
- Symbols (:name) vs Strings (preview of Stage 4)
- Operators: + - * / % ** and parallel assignment
- Comparison: ==, !=, <, >, <=>, ===, equal?, eql?
- Frozen string literals and `# frozen_string_literal: true`
- Type conversion: to_i, to_f, to_s, to_a, to_h

### Key Concepts

- Variables are references to objects, not boxes holding values — assignment rebinds the name.
- `==` is value equality (overridable); `equal?` is object identity (same object_id); `eql?` is hash-key equality.
- nil is the only falsy value besides false; 0, "", and [] are all truthy (surprise for C/Python folks).
- Integer division uses /, but operands must include a Float for a Float result.
- Frozen strings can't be mutated; `# frozen_string_literal: true` at file top freezes all string literals in that file.

```ruby
a = 1
b = 2
a, b = b, a        # swap without a temp var
puts "a=#{a} b=#{b}"  # a=2 b=1
```
Caption: Variables and parallel assignment

### Common Pitfalls

- Assuming 0 or "" is falsy — Only nil and false are falsy in Ruby; use `if x.nil?` or `if x.empty?` for explicit checks.
- Using == to compare string identity — Use `equal?` for object identity; == compares values and is what you want for content equality.
- Integer division surprises (5 / 2 == 2) — Make one operand a Float (5.0 / 2 or 5.fdiv(2)) for a Float result.
- Forgetting frozen_string_literal: true causes string mutation bugs — Add the magic comment to freeze all literals in the file; if you must mutate, dup the string first.
- Using `=` in an `if` condition instead of `==` — Ruby doesn't error (assignment returns the assigned value), so lint with rubocop or use `if x == 5`.

### Real-World Applications

- GitHub uses Ruby's flexible operator overloading and == semantics to compare commits and refs in its reviewer-routing code.
- Shopify relies on frozen_string_literal across its monolith to cut GC pressure on millions of string allocations per request.
- Stripe's API gateway uses symbol keys for parsed JSON lookups, taking advantage of symbol interning for O(1) Hash access.

### Interview Questions

- 1. What's the difference between ==, equal?, and eql? — == is value equality (overridable); equal? is identity (same object_id); eql? is hash-key equality (value + type).
- 2. Is 0 truthy or falsy in Ruby? — Truthy — only nil and false are falsy. This surprises developers from C/Python where 0 is falsy.
- 3. What does `# frozen_string_literal: true` do? — Freezes every string literal in the file so they can't be mutated; saves memory and prevents accidental mutation bugs.
- 4. Why use `a, b = b, a`? — Parallel assignment swaps variables without a temp var — idiomatic Ruby for swap operations.
- 5. How does Ruby handle `5 / 2`? — Integer division returns 2 (Integer); use `5.0 / 2` or `5.fdiv(2)` to get 2.5.

### Mini Project

Build a Tip Calculator CLI: A tool that reads a bill amount and tip
percentage from ARGV, computes the tip and total, splits among N people,
and prints a formatted breakdown. Suggested approach:
Suggested approach:
  - Parse ARGV with Float() and Integer() (raises on bad input)
  - Compute tip = bill * pct / 100.0
  - Use parallel assignment to split totals per person
  - Format with Kernel#format ("%.2f") for currency
  - Guard against negative inputs with a clear message

### Exercises

1. In irb, create two strings 'foo' and 'foo' and compare with ==, equal?, and eql?. Predict before running.
2. Write a script that swaps two variables using parallel assignment and prints the result.
3. Add `# frozen_string_literal: true` to a file, then try `s = 'x'; s << 'y'` — observe the RuntimeError.
4. Write `if x then puts "truthy" end` for x = 0, "", and [] — confirm they are truthy.
5. Compute 7 / 2, 7.0 / 2, 7.fdiv(2), and 7 % 2 — predict each result first.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which values are falsy in Ruby?
9. A) 0 and ""
10. B) nil and false only (*)
11. C) nil, false, 0, ""
12. D) nil, false, and []
13. Explanation: Only nil and false are falsy; everything else (including 0 and "") is truthy.
14. Q2: What does `a.equal?(b)` test?
15. A) Same value
16. B) Same class
17. C) Same object identity (same object_id) (*)
18. D) Same hash code
19. Explanation: equal? is identity comparison — true only if a and b are the same object.
20. Q3: What is the result of `5 / 2`?
21. A) 2.5
22. B) 2.0
23. C) Raises ZeroDivisionError
24. D) 2 (*)
25. Explanation: Integer division returns an Integer; you need 5.0/2 or 5.fdiv(2) for 2.5.
26. Q4: What does `# frozen_string_literal: true` do?
27. A) Freezes all string literals in the file (*)
28. B) Forces UTF-8 encoding
29. C) Disables string interpolation
30. D) Makes strings immutable globally
31. Explanation: The magic comment freezes all string literals in that file so they can't be mutated.
32. Q5: Which swaps two variables idiomatically in Ruby?
33. A) tmp = a; a = b; b = tmp
34. B) a, b = b, a (*)
35. C) swap(a, b)
36. D) a ^= b; b ^= a; a ^= b
37. Explanation: Parallel assignment swaps in one statement without a temp var.
38. Q6: What does `eql?` enforce that `==` does not?
39. A) Same object_id
40. B) Same frozen status
41. C) Same type (*)
42. D) Nothing — they're identical
43. Explanation: eql? requires both value AND type to match; 1 == 1.0 is true but 1.eql?(1.0) is false (used by Hash keys).
44. Q7: Which is truthy?
45. A) nil
46. B) false
47. C) Both nil and false are truthy
48. D) 0 (*)
49. Explanation: 0 is truthy in Ruby — a classic gotcha for C/Python converts.
50. Q8: What does `"hello".freeze << "x"` do?
51. A) Raises RuntimeError (*)
52. B) "hellox"
53. C) "hello"
54. D) Returns nil
55. Explanation: Frozen strings can't be mutated; << raises RuntimeError.
56. Q9: What does `x = nil; x || "default"` return?
57. A) nil
58. B) "default" (*)
59. C) Raises NoMethodError
60. D) false
61. Explanation: || returns the right side when the left is nil/false — a common default-value idiom.
62. Q10: Which converts "42" to an Integer, raising on bad input?
63. A) "42".to_i
64. B) int("42")
65. C) Integer("42") (*)
66. D) "42".int
67. Explanation: Integer() raises ArgumentError on bad input; to_i silently returns 0 — use Integer() for validation.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which values are falsy in Ruby?
  options:
    - 0 and ""
    - nil and false only
    - nil, false, 0, ""
    - nil, false, and []
  correctIndex: 1
  explanation: Only nil and false are falsy; everything else (including 0 and "") is truthy.
- id: q2
  question: What does `a.equal?(b)` test?
  options:
    - Same value
    - Same class
    - Same object identity (same object_id)
    - Same hash code
  correctIndex: 2
  explanation: equal? is identity comparison — true only if a and b are the same object.
- id: q3
  question: What is the result of `5 / 2`?
  options:
    - "2.5"
    - "2.0"
    - Raises ZeroDivisionError
    - "2"
  correctIndex: 3
  explanation: Integer division returns an Integer; you need 5.0/2 or 5.fdiv(2) for 2.5.
- id: q4
  question: "What does `# frozen_string_literal: true` do?"
  options:
    - Freezes all string literals in the file
    - Forces UTF-8 encoding
    - Disables string interpolation
    - Makes strings immutable globally
  correctIndex: 0
  explanation: The magic comment freezes all string literals in that file so they can't be mutated.
- id: q5
  question: Which swaps two variables idiomatically in Ruby?
  options:
    - tmp = a; a = b; b = tmp
    - a, b = b, a
    - swap(a, b)
    - a ^= b; b ^= a; a ^= b
  correctIndex: 1
  explanation: Parallel assignment swaps in one statement without a temp var.
- id: q6
  question: What does `eql?` enforce that `==` does not?
  options:
    - Same object_id
    - Same frozen status
    - Same type
    - Nothing — they're identical
  correctIndex: 2
  explanation: eql? requires both value AND type to match; 1 == 1.0 is true but 1.eql?(1.0) is false (used by Hash keys).
- id: q7
  question: Which is truthy?
  options:
    - nil
    - "false"
    - Both nil and false are truthy
    - "0"
  correctIndex: 3
  explanation: 0 is truthy in Ruby — a classic gotcha for C/Python converts.
- id: q8
  question: What does `"hello".freeze << "x"` do?
  options:
    - Raises RuntimeError
    - '"hellox"'
    - '"hello"'
    - Returns nil
  correctIndex: 0
  explanation: Frozen strings can't be mutated; << raises RuntimeError.
- id: q9
  question: What does `x = nil; x || "default"` return?
  options:
    - nil
    - '"default"'
    - Raises NoMethodError
    - "false"
  correctIndex: 1
  explanation: "|| returns the right side when the left is nil/false — a common default-value idiom."
- id: q10
  question: Which converts "42" to an Integer, raising on bad input?
  options:
    - '"42".to_i'
    - int("42")
    - Integer("42")
    - '"42".int'
  correctIndex: 2
  explanation: Integer() raises ArgumentError on bad input; to_i silently returns 0 — use Integer() for validation.
```

