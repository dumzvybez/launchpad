---
slug: ruby-lambdas-operator
id: ruby-07
track: ruby
order: 7
title: Lambdas and the & Operator
description: Distinguish lambdas from Procs (arity, return semantics), master the &-to-proc trick, and use curry for partial application.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=4100s
whyItMatters: Distinguish lambdas from Procs (arity, return semantics), master the &-to-proc trick, and use curry for partial application.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Lambdas and the & Operator

## Lambdas and the & Operator

### Why It Matters

Distinguish lambdas from Procs (arity, return semantics), master the &-to-proc trick, and use curry for partial application.

Distinguish lambdas from Procs (arity, return semantics), master the &-to-proc trick, and use curry for partial application.

### Prerequisites

- Stage 6: Methods, Blocks, and Procs
- Understanding of yield, &block, and Proc.new.

### Topics

- Lambda literal: ->(a, b) { ... } (stabby lambda)
- lambda vs Proc: arity strictness and return semantics
- & to convert Symbol to Proc (the &:symbol idiom)
- method(:name) to capture a method as an object
- Method objects vs Procs vs Lambdas
- curry and partial application
- Method composition with .>> and .<< (Ruby 2.6+)
- When to prefer lambda over Proc

### Key Concepts

- Lambdas check argument count (ArgumentError on mismatch); Procs fill missing with nil and ignore extras.
- return inside a lambda returns from the lambda only; return inside a Proc returns from the enclosing method.
- `&:upcase` is sugar for `&:upcase.to_proc`, where Symbol#to_proc returns a Proc that sends the symbol to its arg.
- method(:name) returns a Method object (bound to a receiver) that can be called or converted to a Proc with &.
- Lambdas (not Procs) respond to .curry, enabling partial application.
- Use lambda when you want strict arity and predictable return behavior; Proc when you want block-like semantics.

```ruby
# Lambda syntax (both forms are equivalent):
add = ->(a, b) { a + b }
add2 = lambda { |a, b| a + b }

puts add.call(2, 3)   # 5
puts add.(2, 3)       # 5

# Lambdas CHECK argument count (unlike Procs)
strict = ->(a, b) { [a, b] }
puts strict.call(1, 2).inspect  # [1, 2]
begin
  strict.call(1)    # ArgumentError: wrong number of arguments
rescue ArgumentError => e
  puts "Caught: #{e.message}"
end
```
Caption: Lambda syntax and arity checking

### Common Pitfalls

- Expecting Proc's loose arity from a lambda — Lambdas raise ArgumentError on wrong arg count; Procs silently pad with nil. Pick the right tool.
- Using `return` inside a Proc expecting local control — return in a Proc exits the enclosing method; use `next` for early-block-exit, or use a lambda.
- Confusing Method objects with Procs — Method is bound to a receiver and responds to .receiver/.name; Proc is unbound. Convert with .to_proc or pass with &.
- Expecting curry on a Proc — Only lambdas respond to .curry; convert with .to_proc.to_lambda (Ruby 3.0+) or just use lambda literals.
- Forgetting that `&:symbol` only works for single-arg blocks — The Symbol#to_proc trick yields one argument; for multi-arg calls write the block explicitly.

### Real-World Applications

- Rails uses `&:id` extensively: `User.all.map(&:id)` is shorthand for `map { |u| u.id }`.
- Shopify's service objects use lambdas for composable validation rules passed into form objects.
- Stripe's webhook handler dispatch uses method(:on_event) and & to route events to bound methods.
- GitHub's GraphQL resolvers use lambdas for lazy field resolution to defer DB calls until needed.

### Interview Questions

- 1. What's the arity difference between lambda and Proc? — Lambdas enforce argument count (raise on mismatch); Procs pad missing with nil and ignore extras.
- 2. What does `return` inside a lambda do? — Returns from the lambda only (NOT the enclosing method) — unlike Proc which exits the method.
- 3. What does `&:upcase` expand to? — `&:upcase.to_proc` which creates a Proc that calls .upcase on its single argument.
- 4. How do you capture an existing method as a callable object? — Use `method(:name)` to get a Method object bound to the current receiver; call it with .call or convert to Proc with &.
- 5. Which supports .curry: Proc or lambda? — Only lambdas support .curry for partial application; Procs raise NoMethodError.

### Mini Project

Build a Function Composition DSL: A small library that composes lambdas
with >> and << to build data pipelines (e.g., parse -> validate ->
transform). Suggested approach:
Suggested approach:
  - Define each step as a stabby lambda ->(x) { ... }
  - Use Ruby 2.6+ .>> and .<< to compose
  - Chain 4-5 steps and call .call(input)
  - Add a curry-based partial application demo
  - Print intermediate results by tapping the pipeline

### Exercises

1. Write `add = ->(a, b) { a + b }` and call it with wrong arity — observe the ArgumentError.
2. Use `&:upcase` to map an array of strings.
3. Capture `def double(x); x * 2; end` with method(:double) and call it.
4. Use .curry to create a `double` lambda from `multiply = ->(a,b) { a*b }`.
5. Demonstrate return semantics: define a method that yields to both a lambda and a Proc with `return` inside.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the key arity difference between lambda and Proc?
9. A) Procs enforce arg count; lambdas don't
10. B) Both enforce arg count
11. C) Lambdas enforce arg count; Procs pad with nil (*)
12. D) Neither enforces arg count
13. Explanation: Lambdas raise ArgumentError on wrong arg count; Procs silently accept any number, padding with nil.
14. Q2: What does `return` inside a lambda do?
15. A) Returns from the enclosing method
16. B) Raises LocalJumpError
17. C) Returns nil
18. D) Returns from the lambda only (*)
19. Explanation: Lambdas have their own return scope — return exits just the lambda.
20. Q3: What does `&:upcase` expand to?
21. A) &:upcase.to_proc (*)
22. B) proc { upcase }
23. C) lambda(&:upcase)
24. D) &:upcase.to_method
25. Explanation: Symbol#to_proc returns a Proc that sends the symbol to its argument; & converts it to a block.
26. Q4: What does `method(:foo)` return?
27. A) A Proc
28. B) A Method object bound to the receiver (*)
29. C) A Symbol
30. D) nil
31. Explanation: method(:foo) returns a Method object that knows its receiver and name; call with .call or pass with &.
32. Q5: Which supports `.curry` for partial application?
33. A) Proc only
34. B) Both lambda and Proc
35. C) lambda only (*)
36. D) Neither
37. Explanation: Only lambdas respond to .curry; Procs raise NoMethodError.
38. Q6: Which is the stabby lambda syntax?
39. A) lambda x => x + 1
40. B) fn(x) => x + 1
41. C) def(x) { x + 1 }
42. D) ->(x) { x + 1 } (*)
43. Explanation: ->(args) { body } is the stabby lambda literal, equivalent to lambda { |args| body }.
44. Q7: What's the result of `[1,2,3].map(&:to_s).map(&:length)`?
45. A) [1, 1, 1] (*)
46. B) ["1", "2", "3"]
47. C) [3]
48. D) Raises
49. Explanation: First map converts to strings; second map gets each string's length (all 1).
50. Q8: What does `lambda { return 5 }.call` return?
51. A) nil
52. B) 5 (*)
53. C) Raises LocalJumpError
54. D) Returns from the enclosing method
55. Explanation: Lambda's return is local; the call returns 5.
56. Q9: What's the Ruby 2.6+ method composition operator?
57. A) .compose()
58. B) .then()
59. C) .>> and .<< (*)
60. D) .pipe()
61. Explanation: Method#>> and Method#<< compose methods: (f >> g).(x) == g.call(f.call(x)).
62. Q10: Which best describes when to prefer a lambda over a Proc?
63. A) When you want block-like semantics with nil padding
64. B) When you want to use yield
65. C) Never — Procs are always better
66. D) When you want strict arity and local return (*)
67. Explanation: Lambdas behave more like methods (strict arity, local return); Procs behave like blocks.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the key arity difference between lambda and Proc?
  options:
    - Procs enforce arg count; lambdas don't
    - Both enforce arg count
    - Lambdas enforce arg count; Procs pad with nil
    - Neither enforces arg count
  correctIndex: 2
  explanation: Lambdas raise ArgumentError on wrong arg count; Procs silently accept any number, padding with nil.
- id: q2
  question: What does `return` inside a lambda do?
  options:
    - Returns from the enclosing method
    - Raises LocalJumpError
    - Returns nil
    - Returns from the lambda only
  correctIndex: 3
  explanation: Lambdas have their own return scope — return exits just the lambda.
- id: q3
  question: What does `&:upcase` expand to?
  options:
    - "&:upcase.to_proc"
    - proc { upcase }
    - lambda(&:upcase)
    - "&:upcase.to_method"
  correctIndex: 0
  explanation: Symbol#to_proc returns a Proc that sends the symbol to its argument; & converts it to a block.
- id: q4
  question: What does `method(:foo)` return?
  options:
    - A Proc
    - A Method object bound to the receiver
    - A Symbol
    - nil
  correctIndex: 1
  explanation: method(:foo) returns a Method object that knows its receiver and name; call with .call or pass with &.
- id: q5
  question: Which supports `.curry` for partial application?
  options:
    - Proc only
    - Both lambda and Proc
    - lambda only
    - Neither
  correctIndex: 2
  explanation: Only lambdas respond to .curry; Procs raise NoMethodError.
- id: q6
  question: Which is the stabby lambda syntax?
  options:
    - lambda x => x + 1
    - fn(x) => x + 1
    - def(x) { x + 1 }
    - ->(x) { x + 1 }
  correctIndex: 3
  explanation: ->(args) { body } is the stabby lambda literal, equivalent to lambda { |args| body }.
- id: q7
  question: What's the result of `[1,2,3].map(&:to_s).map(&:length)`?
  options:
    - "[1, 1, 1]"
    - '["1", "2", "3"]'
    - "[3]"
    - Raises
  correctIndex: 0
  explanation: First map converts to strings; second map gets each string's length (all 1).
- id: q8
  question: What does `lambda { return 5 }.call` return?
  options:
    - nil
    - "5"
    - Raises LocalJumpError
    - Returns from the enclosing method
  correctIndex: 1
  explanation: Lambda's return is local; the call returns 5.
- id: q9
  question: What's the Ruby 2.6+ method composition operator?
  options:
    - .compose()
    - .then()
    - .>> and .<<
    - .pipe()
  correctIndex: 2
  explanation: "Method#>> and Method#<< compose methods: (f >> g).(x) == g.call(f.call(x))."
- id: q10
  question: Which best describes when to prefer a lambda over a Proc?
  options:
    - When you want block-like semantics with nil padding
    - When you want to use yield
    - Never — Procs are always better
    - When you want strict arity and local return
  correctIndex: 3
  explanation: Lambdas behave more like methods (strict arity, local return); Procs behave like blocks.
```

