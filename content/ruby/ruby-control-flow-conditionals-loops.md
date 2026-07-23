---
slug: ruby-control-flow-conditionals-loops
id: ruby-03
track: ruby
order: 3
title: Control Flow — Conditionals and Loops
description: Master if/unless/case, while/until/for, modifier forms, and the next/break/redo control keywords.
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=1300s
whyItMatters: Master if/unless/case, while/until/for, modifier forms, and the next/break/redo control keywords.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Control Flow — Conditionals and Loops

## Control Flow — Conditionals and Loops

### Why It Matters

Master if/unless/case, while/until/for, modifier forms, and the next/break/redo control keywords.

Master if/unless/case, while/until/for, modifier forms, and the next/break/redo control keywords.

### Prerequisites

- Stage 2: Variables, Types, and Operators
- Familiarity with irb and string interpolation.

### Topics

- if / elsif / else / end
- unless (negated if) and ternary `cond ? a : b`
- case/when with ===, ranges, classes, and Regexp
- while, until, for...in, loop, and modifier forms
- next, break, redo, retry (and where retry is allowed)
- Truthiness revisited (only nil and false are falsy)
- begin/end/while (do-while) and begin/end/until
- Implicit blocks via `loop` with `break unless`

### Key Concepts

- if/unless can be used as trailing modifiers: `puts "hi" if debug`.
- case/when uses `===` for matching, so Class===instance, Range===n, and Regexp===string all work.
- `while` checks first; `begin...end while` checks last (do-while style).
- `next` skips to the next iteration; `break` exits the loop; `redo` retries the current iteration without re-checking the condition.
- `retry` only works inside a rescue block — not in loops (since Ruby 1.9).
- Loops return nil unless break is given a value; `break value` makes the loop return that value.

```ruby
score = 87
if score >= 90
  grade = "A"
elsif score >= 80
  grade = "B"
else
  grade = "C"
end
puts grade  # B

# Modifier form (single-line):
puts "Pass" if grade != "C"
puts "Fail" unless grade != "C"
```
Caption: if/elsif/else and modifier form

### Common Pitfalls

- Using `retry` outside a rescue block — retry only works inside begin/rescue; in loops use `redo` or a counter-based loop to avoid infinite loops.
- Forgetting that case uses === not == — Remember `when Integer` matches because Integer===obj; `when 5` matches the value 5 because `5 === 5` is true.
- Infinite loop with `redo` — redo doesn't re-check the loop condition; always include a counter or break guard to prevent runaway.
- Mixing `=` with `if` modifier — Ruby treats `if x = get_value` as truthy if x is non-nil; rubocop warns. Use explicit `==` for comparisons.
- Using `for x in arr` (un-idiomatic) — Prefer `arr.each { |x| ... }`; for loops don't create a new scope and leak the loop variable, surprising readers.

### Real-World Applications

- GitHub uses case/when with class matching to route webhook payloads to handler classes for hundreds of event types.
- Shopify's controller before_actions use unless modifiers to skip auth for public pages.
- Airbnb's price engine uses loop with break to find the cheapest available rate across date ranges.
- Stripe's idempotency layer uses begin/rescue/retry to handle transient DB deadlocks on payment intents.

### Interview Questions

- 1. What does `unless x` mean? — Equivalent to `if !x` — runs the branch when x is falsy (nil or false).
- 2. How does case/when match? — Using `===` on the when value against the case target — so classes, ranges, and regexes all work.
- 3. What's the difference between while and begin/end while? — while checks before the first iteration; begin/end while checks after — the body always runs at least once.
- 4. What does `break value` do in a loop? — Exits the loop and returns `value` as the loop's result.
- 5. Where is `retry` allowed? — Only inside a rescue block; it re-runs the begin block from the top, useful for transient error retries.

### Mini Project

Build a FizzBuzz with Custom Rules CLI: A tool that prints numbers 1..N
with rules: multiples of 3 -> "Fizz", 5 -> "Buzz", 7 -> "Bazz", combined
when multiple rules hit. Reads N from ARGV. Suggested approach:
Suggested approach:
  - Use Integer(ARGV[0] || '15') with rescue for invalid input
  - Iterate 1..N with .each
  - Build the output string by appending rules with <<
  - Fall back to the number itself if no rule matched
  - Use a case/when on n for clarity, or rules hash of lambdas

### Exercises

1. Write an if/elsif/else that classifies a temperature as cold (<10), mild (10..25), or hot (>25).
2. Use case/when to classify a value by Class, Range, and Regexp in the same case statement.
3. Write a loop that returns the first even number greater than 100 using `break value`.
4. Use a modifier-form `unless` to skip printing nil values in an array.
5. Demonstrate the for-loop variable leak: print the loop variable after the loop ends.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `puts 'x' unless debug` do?
9. A) Prints 'x' when debug is truthy
10. B) Always prints 'x'
11. C) Prints 'x' when debug is falsy (*)
12. D) Raises unless debug is boolean
13. Explanation: unless is the negation of if — the branch runs when the condition is falsy.
14. Q2: How does case/when match values?
15. A) Using == only
16. B) Using eql?
17. C) Using equal?
18. D) Using === (case-equality) (*)
19. Explanation: case/when uses === on the when-value; this is why classes, ranges, and regexes all match usefully.
20. Q3: Which loop always runs the body at least once?
21. A) begin ... end while cond (*)
22. B) while cond ... end
23. C) until cond ... end
24. D) loop do ... end with break first
25. Explanation: begin/end/while checks after the body, guaranteeing at least one execution (do-while style).
26. Q4: What does `break 42` inside a loop do?
27. A) Skips to next iteration
28. B) Exits the loop and returns 42 (*)
29. C) Raises an error
30. D) Sets a local var 42 and continues
31. Explanation: break with a value makes the loop expression return that value.
32. Q5: What does `next` do in a loop?
33. A) Exits the loop
34. B) Re-runs the current iteration
35. C) Skips to the next iteration (*)
36. D) Restarts the loop from the top
37. Explanation: next skips the rest of the current iteration and moves to the next one.
38. Q6: What does `redo` do?
39. A) Restarts the loop
40. B) Skips the current iteration
41. C) Throws an error
42. D) Re-runs the current iteration WITHOUT re-checking the condition (*)
43. Explanation: redo re-executes the same iteration; useful but risky — add a counter to avoid infinite loops.
44. Q7: Where is `retry` valid?
45. A) Only inside a rescue block (*)
46. B) Anywhere in a loop
47. C) At the top of a method
48. D) In an ensure block
49. Explanation: retry re-runs the enclosing begin block; it's only valid inside rescue.
50. Q8: What's the value of `case 'abc' when String then 's' when /a/ then 'r' else '?' end`?
51. A) 'r'
52. B) 's' (*)
53. C) '?'
54. D) Raises TypeError
55. Explanation: case checks `when` clauses in order; String === 'abc' matches first.
56. Q9: Which is more idiomatic for iterating an array?
57. A) for x in arr ... end
58. B) arr.loop { |x| ... }
59. C) arr.each { |x| ... } (*)
60. D) foreach(arr) { |x| ... }
61. Explanation: each is the idiomatic iterator; for leaks the loop variable and doesn't create a new scope.
62. Q10: What does `until cond` mean?
63. A) Loop while cond is truthy
64. B) Run once if cond is falsy
65. C) Same as if cond
66. D) Loop while cond is falsy (*)
67. Explanation: until loops while the condition is falsy; equivalent to `while !cond`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `puts 'x' unless debug` do?
  options:
    - Prints 'x' when debug is truthy
    - Always prints 'x'
    - Prints 'x' when debug is falsy
    - Raises unless debug is boolean
  correctIndex: 2
  explanation: unless is the negation of if — the branch runs when the condition is falsy.
- id: q2
  question: How does case/when match values?
  options:
    - Using == only
    - Using eql?
    - Using equal?
    - Using === (case-equality)
  correctIndex: 3
  explanation: case/when uses === on the when-value; this is why classes, ranges, and regexes all match usefully.
- id: q3
  question: Which loop always runs the body at least once?
  options:
    - begin ... end while cond
    - while cond ... end
    - until cond ... end
    - loop do ... end with break first
  correctIndex: 0
  explanation: begin/end/while checks after the body, guaranteeing at least one execution (do-while style).
- id: q4
  question: What does `break 42` inside a loop do?
  options:
    - Skips to next iteration
    - Exits the loop and returns 42
    - Raises an error
    - Sets a local var 42 and continues
  correctIndex: 1
  explanation: break with a value makes the loop expression return that value.
- id: q5
  question: What does `next` do in a loop?
  options:
    - Exits the loop
    - Re-runs the current iteration
    - Skips to the next iteration
    - Restarts the loop from the top
  correctIndex: 2
  explanation: next skips the rest of the current iteration and moves to the next one.
- id: q6
  question: What does `redo` do?
  options:
    - Restarts the loop
    - Skips the current iteration
    - Throws an error
    - Re-runs the current iteration WITHOUT re-checking the condition
  correctIndex: 3
  explanation: redo re-executes the same iteration; useful but risky — add a counter to avoid infinite loops.
- id: q7
  question: Where is `retry` valid?
  options:
    - Only inside a rescue block
    - Anywhere in a loop
    - At the top of a method
    - In an ensure block
  correctIndex: 0
  explanation: retry re-runs the enclosing begin block; it's only valid inside rescue.
- id: q8
  question: What's the value of `case 'abc' when String then 's' when /a/ then 'r' else '?' end`?
  options:
    - "'r'"
    - "'s'"
    - "'?'"
    - Raises TypeError
  correctIndex: 1
  explanation: case checks `when` clauses in order; String === 'abc' matches first.
- id: q9
  question: Which is more idiomatic for iterating an array?
  options:
    - for x in arr ... end
    - arr.loop { |x| ... }
    - arr.each { |x| ... }
    - foreach(arr) { |x| ... }
  correctIndex: 2
  explanation: each is the idiomatic iterator; for leaks the loop variable and doesn't create a new scope.
- id: q10
  question: What does `until cond` mean?
  options:
    - Loop while cond is truthy
    - Run once if cond is falsy
    - Same as if cond
    - Loop while cond is falsy
  correctIndex: 3
  explanation: until loops while the condition is falsy; equivalent to `while !cond`.
```

