---
slug: ruby-methods-blocks-procs
id: ruby-06
track: ruby
order: 6
title: Methods, Blocks, and Procs
description: Define methods with default and keyword arguments, capture blocks with yield and &, and avoid the famous mutable-default-arg trap.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=3400s
whyItMatters: Define methods with default and keyword arguments, capture blocks with yield and &, and avoid the famous mutable-default-arg trap.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Methods, Blocks, and Procs

## Methods, Blocks, and Procs

### Why It Matters

Define methods with default and keyword arguments, capture blocks with yield and &, and avoid the famous mutable-default-arg trap.

Define methods with default and keyword arguments, capture blocks with yield and &, and avoid the famous mutable-default-arg trap.

### Prerequisites

- Stage 5: Arrays, Hashes, and Iterators
- Familiarity with blocks via each/map/select.

### Topics

- def with positional, default, and keyword arguments
- Splat (*) and double-splat (**) for variadic args
- Implicit blocks via yield and block_given?
- Explicit block capture with &block
- Proc objects: .call, .(), .[]
- return inside a block returns from the enclosing method
- Mutable default argument pitfall
- Method visibility (public, private, protected) preview

### Key Concepts

- Methods return the last expression evaluated; explicit `return` is rarely needed.
- Mutable default args (like `list = []`) are evaluated ONCE at method definition, shared across all calls — a famous bug.
- Blocks are closures: they capture variables from where they were created.
- yield invokes the implicit block passed to a method; block_given? checks for it.
- Use `&blk` to capture a block as a Proc object you can pass around or call later.
- Inside a block, `return` returns from the ENCLOSING METHOD, not just the block (unlike lambdas).

```ruby
def greet(name, greeting = "Hello")
  "#{greeting}, #{name}!"
end

puts greet("Alice")            # Hello, Alice!
puts greet("Bob", "Hi")        # Hi, Bob!

# Keyword arguments (Ruby 2.0+):
def configure(host:, port: 80, ssl: false)
  puts "#{host}:#{port} ssl=#{ssl}"
end
configure(host: "example.com", ssl: true)

# SPLAT collects extra positional args into an array
def sum_all(*nums)
  nums.reduce(0, :+)
end
puts sum_all(1, 2, 3, 4)  # 10
```
Caption: Methods with defaults, keywords, and splat

### Common Pitfalls

- Mutable default arguments shared across calls — Use `list = nil` and create inside the method body, so each call gets a fresh object.
- Using `return` inside a block expecting local control — return inside a Proc/block returns from the enclosing method, not just the block — use `next` to skip a block iteration instead.
- Forgetting block_given? before yield — yield without a block raises LocalJumpError; check with block_given? first.
- Confusing `&block` with a regular argument — `&` marks the parameter as a block capture; without &, the block isn't accessible as an object.
- Defining keyword args before required positional args — Ruby 3.0 enforces ordering: positional first, then keywords; mixing them raises ArgumentError in 3.0+.

### Real-World Applications

- GitHub uses blocks heavily in its routes DSL: `get '/repos' { render json: ... }`.
- Shopify's before_action callbacks use method(:name) and & to pass callbacks as Procs to its middleware stack.
- Airbnb's resolvers use keyword arguments to make GraphQL field definitions self-documenting.
- Stripe's API client uses splat to forward arguments to the underlying HTTP layer for dozens of resource methods.

### Interview Questions

- 1. Why is `def f(list = [])` dangerous? — The default [] is evaluated ONCE at definition time and shared across calls — use `list = nil` and create inside.
- 2. What does `yield` do? — Invokes the implicit block passed to the method; raises LocalJumpError if no block was given.
- 3. How do you capture a block as an object? — Use `&blk` in the parameter list; blk becomes a Proc you can .call or pass to other methods.
- 4. What does `return` inside a Proc do? — Returns from the ENCLOSING METHOD, not just the block (Proc semantics differ from lambda).
- 5. What's the Ruby 3.0 change to keyword arguments? — Keyword and positional args are fully separated; delegation must use `**kwargs` explicitly to avoid silent bugs.

### Mini Project

Build a Logger with Block Lazy Evaluation: A logger that only calls an
expensive block when the log level is enabled, demonstrating yield +
block_given? + Proc capture. Suggested approach:
Suggested approach:
  - Define class Logger with @level = :info
  - Define log(level, &block) that returns unless level >= @level
  - Use block_given? to avoid yielding when no block passed
  - Compare eager string interpolation vs lazy block evaluation
  - Add a benchmark showing the perf savings at debug level

### Exercises

1. Write a method `with_timing(name) { ... }` that prints elapsed time using yield.
2. Demonstrate the mutable default arg bug with `def f(x, arr = [])`.
3. Capture a block with &blk, then call it 3 times with .call, .(), and [].
4. Use keyword arguments to define `configure(host:, port: 80)` and call it both with and without port.
5. Show that `return` inside a Proc returns from the enclosing method (define a method that yields).
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the danger of `def f(list = [])`?
9. A) It's slow
10. B) list is shared across all calls (evaluated once) (*)
11. C) It raises on first call
12. D) list is always nil
13. Explanation: The default [] is created once at definition time and reused — mutating it leaks state across calls.
14. Q2: What does `yield` do in a method?
15. A) Returns the last expression
16. B) Pauses the method
17. C) Invokes the implicit block passed by the caller (*)
18. D) Creates a new Proc
19. Explanation: yield calls the block the caller provided; raises LocalJumpError if no block was given.
20. Q3: How do you check whether a block was passed?
21. A) yield?
22. B) has_block?
23. C) block?
24. D) block_given? (*)
25. Explanation: block_given? returns true if the current method was called with a block.
26. Q4: What does `&blk` in a parameter list do?
27. A) Captures the block as a Proc object (*)
28. B) Marks blk as required
29. C) Forces blk to be a Symbol
30. D) Converts blk to a String
31. Explanation: `&` before the last parameter captures the caller's block as a Proc you can .call or pass on.
32. Q5: What does `return` inside a Proc do?
33. A) Returns from the Proc only
34. B) Returns from the enclosing method (not just the block) (*)
35. C) Raises LocalJumpError
36. D) Skips to the next iteration
37. Explanation: Procs are bound to the enclosing method's scope; return propagates out of the method.
38. Q6: What's true of keyword arguments in Ruby 3.0+?
39. A) Keyword args are deprecated
40. B) Keyword args must come first
41. C) Positional and keyword args are fully separated (*)
42. D) Keyword args require type declarations
43. Explanation: Ruby 3.0 separated positional and keyword args to fix delegation bugs; you can't pass a hash as keywords implicitly.
44. Q7: What does `Proc.new { |x| x + 1 }.call(5)` return?
45. A) 5
46. B) nil
47. C) Raises ArgumentError
48. D) 6 (*)
49. Explanation: Proc.new creates a closure; .call invokes it with the given arguments.
50. Q8: Which is a valid Proc call syntax?
51. A) All of the above (*)
52. B) proc.call(5)
53. C) proc.(5)
54. D) proc[5]
55. Explanation: All three (.call, .(), .[]) are valid ways to invoke a Proc in Ruby.
56. Q9: What does splat (*) in `def sum_all(*nums)` do?
57. A) Makes nums required
58. B) Collects all positional args into nums array (*)
59. C) Raises if more than one arg passed
60. D) Converts nums to a String
61. Explanation: Splat collects extra positional arguments into an Array, enabling variadic methods.
62. Q10: What's the return value of a Ruby method by default?
63. A) nil always
64. B) self
65. C) The last expression evaluated (*)
66. D) The first expression evaluated
67. Explanation: Ruby methods implicitly return the last expression; explicit `return` is rare and discouraged by rubocop.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the danger of `def f(list = [])`?
  options:
    - It's slow
    - list is shared across all calls (evaluated once)
    - It raises on first call
    - list is always nil
  correctIndex: 1
  explanation: The default [] is created once at definition time and reused — mutating it leaks state across calls.
- id: q2
  question: What does `yield` do in a method?
  options:
    - Returns the last expression
    - Pauses the method
    - Invokes the implicit block passed by the caller
    - Creates a new Proc
  correctIndex: 2
  explanation: yield calls the block the caller provided; raises LocalJumpError if no block was given.
- id: q3
  question: How do you check whether a block was passed?
  options:
    - yield?
    - has_block?
    - block?
    - block_given?
  correctIndex: 3
  explanation: block_given? returns true if the current method was called with a block.
- id: q4
  question: What does `&blk` in a parameter list do?
  options:
    - Captures the block as a Proc object
    - Marks blk as required
    - Forces blk to be a Symbol
    - Converts blk to a String
  correctIndex: 0
  explanation: "`&` before the last parameter captures the caller's block as a Proc you can .call or pass on."
- id: q5
  question: What does `return` inside a Proc do?
  options:
    - Returns from the Proc only
    - Returns from the enclosing method (not just the block)
    - Raises LocalJumpError
    - Skips to the next iteration
  correctIndex: 1
  explanation: Procs are bound to the enclosing method's scope; return propagates out of the method.
- id: q6
  question: What's true of keyword arguments in Ruby 3.0+?
  options:
    - Keyword args are deprecated
    - Keyword args must come first
    - Positional and keyword args are fully separated
    - Keyword args require type declarations
  correctIndex: 2
  explanation: Ruby 3.0 separated positional and keyword args to fix delegation bugs; you can't pass a hash as keywords implicitly.
- id: q7
  question: What does `Proc.new { |x| x + 1 }.call(5)` return?
  options:
    - "5"
    - nil
    - Raises ArgumentError
    - "6"
  correctIndex: 3
  explanation: Proc.new creates a closure; .call invokes it with the given arguments.
- id: q8
  question: Which is a valid Proc call syntax?
  options:
    - All of the above
    - proc.call(5)
    - proc.(5)
    - proc[5]
  correctIndex: 0
  explanation: All three (.call, .(), .[]) are valid ways to invoke a Proc in Ruby.
- id: q9
  question: What does splat (*) in `def sum_all(*nums)` do?
  options:
    - Makes nums required
    - Collects all positional args into nums array
    - Raises if more than one arg passed
    - Converts nums to a String
  correctIndex: 1
  explanation: Splat collects extra positional arguments into an Array, enabling variadic methods.
- id: q10
  question: What's the return value of a Ruby method by default?
  options:
    - nil always
    - self
    - The last expression evaluated
    - The first expression evaluated
  correctIndex: 2
  explanation: Ruby methods implicitly return the last expression; explicit `return` is rare and discouraged by rubocop.
```

