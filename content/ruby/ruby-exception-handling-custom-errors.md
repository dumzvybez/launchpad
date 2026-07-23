---
slug: ruby-exception-handling-custom-errors
id: ruby-11
track: ruby
order: 11
title: Exception Handling and Custom Errors
description: Master begin/rescue/ensure/raise, build custom error hierarchies, retry transient failures, and avoid rescuing Exception.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=6900s
whyItMatters: Master begin/rescue/ensure/raise, build custom error hierarchies, retry transient failures, and avoid rescuing Exception.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Exception Handling and Custom Errors

## Exception Handling and Custom Errors

### Why It Matters

Master begin/rescue/ensure/raise, build custom error hierarchies, retry transient failures, and avoid rescuing Exception.

Master begin/rescue/ensure/raise, build custom error hierarchies, retry transient failures, and avoid rescuing Exception.

### Prerequisites

- Stage 10: Enumerable and Comparable
- Familiarity with method definition and classes.

### Topics

- begin / rescue / else / ensure / end
- raise (with message or exception object)
- Standard error hierarchy: Exception > StandardError > ...
- Custom error classes inheriting StandardError
- retry for transient failures (inside rescue only)
- rescue in modifier form (`expr rescue default`)
- Multiple rescue clauses by exception type
- Never rescue Exception (rescue StandardError instead)

### Key Concepts

- rescue without a class catches StandardError (NOT Exception); rescuing Exception traps Ctrl-C and NoMemoryError.
- `raise` (no args) re-raises the current exception; `raise "msg"` raises RuntimeError; `raise ErrorClass, msg` raises that class.
- ensure ALWAYS runs — even on exception, even on return — use it for cleanup (closing files, releasing locks).
- retry re-runs the entire begin block from the top; only valid inside a rescue clause.
- Custom errors should inherit from StandardError (or a more specific subclass), not Exception.
- rescue's class list is ordered: first match wins, so put specific classes before generic ones.

```ruby
def parse_int(str)
  Integer(str)   # raises ArgumentError on bad input
rescue ArgumentError => e
  puts "Bad input #{str.inspect}: #{e.message}"
  0   # default value
end

puts parse_int("42")     # 42
puts parse_int("hello")  # Bad input... ; 0

# begin/rescue/ensure (like try/finally):
def safe_read(path)
  f = File.open(path)
  f.read
rescue Errno::ENOENT
  puts "File not found: #{path}"
  nil
ensure
  f&.close   # always runs, even on exception
  puts 'closed'
end
```
Caption: begin/rescue/ensure basics

### Common Pitfalls

- Rescuing Exception instead of StandardError — Exception catches NoMemoryError, Interrupt (Ctrl-C), and SignalException — rescue StandardError or specific subclasses.
- Forgetting ensure for resource cleanup — Use ensure to close files/sockets/locks even on exception; better, use the block form File.open(path) { |f| ... } which closes automatically.
- Using retry without a counter — retry without an attempt limit causes infinite loops on permanent failures; always track attempts and re-raise after MAX_RETRIES.
- Swallowing exceptions with bare rescue — `rescue` with no logging hides bugs; at minimum log `e.class` and `e.message`, or re-raise after a fallback.
- Putting generic rescue before specific — Order matters: `rescue StandardError` before `rescue ArgumentError` means the specific clause is unreachable; put specific first.

### Real-World Applications

- Rails uses rescue_from in controllers to map custom exceptions to HTTP status codes (e.g., ActiveRecord::RecordNotFound -> 404).
- Stripe's payment engine uses retry with exponential backoff to handle transient database deadlocks on charge creation.
- Shopify's order pipeline rescues specific exception subclasses to route failed orders to a dead-letter queue for manual review.
- GitHub's webhook delivery uses begin/ensure to release Redis locks even when handler code raises.

### Interview Questions

- 1. What does bare `rescue` (no class) catch? — StandardError (NOT Exception) — rescuing Exception would trap Ctrl-C and NoMemoryError.
- 2. What does `raise` (no args) do? — Re-raises the current exception inside a rescue block; raises RuntimeError outside.
- 3. When does `ensure` run? — ALWAYS — on success, on exception, and even on explicit return from inside begin.
- 4. Where is `retry` valid? — Only inside a rescue clause — it re-runs the entire begin block from the top.
- 5. What should custom error classes inherit from? — StandardError (or a subclass) — not Exception, to avoid trapping system-level errors.

### Mini Project

Build a Robust CSV Importer: A tool that reads a CSV file, validates
each row, raises custom ValidationError for bad rows, retries on
transient IO errors, and writes a summary report. Suggested approach:
Suggested approach:
  - Define class ValidationError < StandardError with attr_reader :row
  - Wrap file open in begin/rescue Errno::ENOENT
  - Use retry with a counter for transient IO errors
  - Rescue ValidationError per-row and continue processing
  - Use ensure to log final counts (success/fail)

### Exercises

1. Write a method that divides two numbers and rescues ZeroDivisionError with a friendly message.
2. Define a custom ValidationError class with a `field` attribute, raise it, and rescue it.
3. Use retry with a counter to simulate an API call that fails 3 times then succeeds.
4. Demonstrate that `ensure` runs even when `return` is called inside begin.
5. Show that bare `rescue` catches StandardError but NOT a manually-raised Exception subclass.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does bare `rescue` (no class) catch?
9. A) Exception only
10. B) All errors including NoMemoryError
11. C) StandardError only (NOT Exception) (*)
12. D) Only RuntimeError
13. Explanation: Bare rescue catches StandardError — rescuing Exception would trap Ctrl-C and out-of-memory errors.
14. Q2: What does `raise` with no arguments do inside a rescue?
15. A) Raises RuntimeError
16. B) Returns nil
17. C) Exits the program
18. D) Re-raises the current exception (*)
19. Explanation: Bare raise in a rescue re-raises the in-flight exception — useful after logging.
20. Q3: When does `ensure` execute?
21. A) Always — even on exception or explicit return (*)
22. B) Only on exception
23. C) Only on success
24. D) Only when re-raising
25. Explanation: ensure runs no matter how the begin block exits — perfect for cleanup.
26. Q4: Where is `retry` valid?
27. A) Anywhere in a method
28. B) Only inside a rescue block (*)
29. C) Inside ensure
30. D) Inside else
31. Explanation: retry re-runs the begin block from the top; only legal inside rescue.
32. Q5: What should custom error classes inherit from?
33. A) Exception
34. B) RuntimeError
35. C) StandardError (*)
36. D) Object
37. Explanation: StandardError is the conventional base for app-level exceptions; inheriting Exception traps system errors.
38. Q6: What's the danger of `rescue Exception`?
39. A) Slower than rescue StandardError
40. B) Doesn't catch anything
41. C) Causes syntax errors
42. D) Traps Ctrl-C, NoMemoryError, and SignalException (*)
43. Explanation: Exception is the root — rescuing it traps system-level signals you usually want to let propagate.
44. Q7: What does `expr rescue default` (modifier form) do?
45. A) Returns default if expr raises StandardError (*)
46. B) Returns default if expr returns nil
47. C) Raises default
48. D) Skips default
49. Explanation: Modifier rescue catches StandardError and returns the fallback value; useful for one-liners like `Integer(s) rescue 0`.
50. Q8: How should multiple rescue clauses be ordered?
51. A) Generic before specific
52. B) Specific subclasses before generic classes (*)
53. C) Order doesn't matter
54. D) Alphabetical
55. Explanation: First match wins — put specific exceptions (e.g., ArgumentError) before generic (e.g., StandardError).
56. Q9: What does the `else` clause in begin/rescue do?
57. A) Runs only on exception
58. B) Runs always
59. C) Runs only if NO exception was raised (*)
60. D) Runs before rescue
61. Explanation: else runs after the begin block succeeds without raising — rare but useful for clarity.
62. Q10: What's the return value of a begin/rescue block that rescues?
63. A) nil
64. B) The exception object
65. C) The last expression in begin
66. D) The last expression in the rescue clause (*)
67. Explanation: If rescue fires, its last expression becomes the block's value; otherwise the begin's last expression does.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does bare `rescue` (no class) catch?
  options:
    - Exception only
    - All errors including NoMemoryError
    - StandardError only (NOT Exception)
    - Only RuntimeError
  correctIndex: 2
  explanation: Bare rescue catches StandardError — rescuing Exception would trap Ctrl-C and out-of-memory errors.
- id: q2
  question: What does `raise` with no arguments do inside a rescue?
  options:
    - Raises RuntimeError
    - Returns nil
    - Exits the program
    - Re-raises the current exception
  correctIndex: 3
  explanation: Bare raise in a rescue re-raises the in-flight exception — useful after logging.
- id: q3
  question: When does `ensure` execute?
  options:
    - Always — even on exception or explicit return
    - Only on exception
    - Only on success
    - Only when re-raising
  correctIndex: 0
  explanation: ensure runs no matter how the begin block exits — perfect for cleanup.
- id: q4
  question: Where is `retry` valid?
  options:
    - Anywhere in a method
    - Only inside a rescue block
    - Inside ensure
    - Inside else
  correctIndex: 1
  explanation: retry re-runs the begin block from the top; only legal inside rescue.
- id: q5
  question: What should custom error classes inherit from?
  options:
    - Exception
    - RuntimeError
    - StandardError
    - Object
  correctIndex: 2
  explanation: StandardError is the conventional base for app-level exceptions; inheriting Exception traps system errors.
- id: q6
  question: What's the danger of `rescue Exception`?
  options:
    - Slower than rescue StandardError
    - Doesn't catch anything
    - Causes syntax errors
    - Traps Ctrl-C, NoMemoryError, and SignalException
  correctIndex: 3
  explanation: Exception is the root — rescuing it traps system-level signals you usually want to let propagate.
- id: q7
  question: What does `expr rescue default` (modifier form) do?
  options:
    - Returns default if expr raises StandardError
    - Returns default if expr returns nil
    - Raises default
    - Skips default
  correctIndex: 0
  explanation: Modifier rescue catches StandardError and returns the fallback value; useful for one-liners like `Integer(s) rescue 0`.
- id: q8
  question: How should multiple rescue clauses be ordered?
  options:
    - Generic before specific
    - Specific subclasses before generic classes
    - Order doesn't matter
    - Alphabetical
  correctIndex: 1
  explanation: First match wins — put specific exceptions (e.g., ArgumentError) before generic (e.g., StandardError).
- id: q9
  question: What does the `else` clause in begin/rescue do?
  options:
    - Runs only on exception
    - Runs always
    - Runs only if NO exception was raised
    - Runs before rescue
  correctIndex: 2
  explanation: else runs after the begin block succeeds without raising — rare but useful for clarity.
- id: q10
  question: What's the return value of a begin/rescue block that rescues?
  options:
    - nil
    - The exception object
    - The last expression in begin
    - The last expression in the rescue clause
  correctIndex: 3
  explanation: If rescue fires, its last expression becomes the block's value; otherwise the begin's last expression does.
```

