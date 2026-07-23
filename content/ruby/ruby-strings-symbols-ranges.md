---
slug: ruby-strings-symbols-ranges
id: ruby-04
track: ruby
order: 4
title: Strings, Symbols, and Ranges
description: Work with Ruby strings, symbols, ranges, heredocs, encodings, and the symbol-vs-string distinction.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=2000s
whyItMatters: Work with Ruby strings, symbols, ranges, heredocs, encodings, and the symbol-vs-string distinction.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Strings, Symbols, and Ranges

## Strings, Symbols, and Ranges

### Why It Matters

Work with Ruby strings, symbols, ranges, heredocs, encodings, and the symbol-vs-string distinction.

Work with Ruby strings, symbols, ranges, heredocs, encodings, and the symbol-vs-string distinction.

### Prerequisites

- Stage 3: Control Flow — Conditionals and Loops
- Stage 2: understanding of == vs equal? vs eql?

### Topics

- Single vs double quotes and escape sequences
- String interpolation and method calls inside #{}
- Heredocs (<<-, <<~, squiggly heredoc) for multi-line strings
- Symbols (:name) — immutable, interned, used as Hash keys
- Ranges: .. (inclusive) vs ... (exclusive)
- String methods: chars, split, gsub, strip, upcase, scan
- Frozen strings, encoding (UTF-8 default), and force_encoding
- String mutation vs functional methods (<< vs +)

### Key Concepts

- Symbols are immutable and interned — the same :name literal always has the same object_id; ideal for Hash keys.
- Double-quoted strings process `\\n`, `\\t`, `#{...}`; single-quoted only process `\\\\` and `\\'`.
- `..` is inclusive (1..5 includes 5); `...` is exclusive (1...5 stops at 4).
- Most String methods (gsub, upcase, strip) return new strings; <<, []=, gsub! mutate in place.
- Heredoc `<<~` (squiggly) strips leading whitespace, making multi-line templates readable.
- Strings default to UTF-8 in Ruby 2.0+; `force_encoding("ASCII-8BIT")` for raw bytes.

```ruby
name = "world"
puts "Hello, #{name.capitalize}!"   # Hello, World!
puts "2 + 2 = #{2 + 2}"             # 2 + 2 = 4
puts "#{"%05.2f" % 3.14159}"        # 03.14
```
Caption: Interpolation and method calls in #{}

### Common Pitfalls

- Using a string key when you meant a symbol (or vice versa) — Pick a convention per hash; for JSON parsing use hash_with_indifferent_access or convert keys with `transform_keys(&:to_sym)`.
- Forgetting that << mutates and + does not — `s << x` modifies s in place and returns s; `s + x` returns a new string and leaves s alone.
- Using `..` when you meant `...` — `..` includes the end, `...` excludes it — off-by-one bugs in pagination are common.
- Assuming single-quoted strings interpolate — Switch to double quotes when you need #{}, or use format() / %-formatting.
- Calling `gsub!` and expecting a return value when no match — `gsub!` returns nil if no substitution was made (unlike `gsub` which always returns a string) — common nil-class-method bug.

### Real-World Applications

- GitHub uses symbols for thousands of internal event-type keys, saving memory over allocating new strings per request.
- Shopify's Liquid template engine parses heredocs and multi-line strings for safe merchant-editable storefront templates.
- Airbnb's i18n library uses symbol keys for translation lookups across 30+ locales.
- Stripe's webhook signature verifier uses Range matching on time windows to reject replays outside the 5-minute tolerance.

### Interview Questions

- 1. Why are symbols preferred as Hash keys? — They're interned (one object_id per name) and immutable — faster comparisons and lower memory than string keys.
- 2. What's the difference between `..` and `...`? — `..` is inclusive (includes the end); `...` is exclusive (stops before the end).
- 3. What does `<<~` heredoc do? — Squiggly heredoc strips the leading whitespace common to all lines, making multi-line templates readable.
- 4. Why does `gsub!` return nil sometimes? — gsub! returns nil when no substitution happened (mutation was skipped); use `gsub` if you need a guaranteed string back.
- 5. How do single-quoted and double-quoted strings differ? — Single quotes only escape `\\\\` and `\\'`; double quotes process `\\n`, `\\t`, `#{}`, and more.

### Mini Project

Build a Markdown-to-HTML Mini Converter: A CLI that reads a Markdown
file, converts # headings, **bold**, *italic*, and [link](url) to HTML,
and prints the result. Suggested approach:
Suggested approach:
  - Read the file with File.read(ARGV[0])
  - Use gsub with regex for each transformation
  - Use a heredoc to wrap output in <html><body>
  - Handle headings with a case statement on the # count
  - Use squiggly heredoc for clean template indentation

### Exercises

1. Create a hash with both symbol and string 'name' keys; verify they're separate.
2. Use a heredoc with `<<~` that produces a clean JSON template after stripping indentation.
3. Use gsub with a block to upcase every word in a sentence.
4. Demonstrate that `s << 'x'` mutates s while `s + 'x'` does not.
5. Use a Range (1...10) with `.to_a` and `.each` — confirm it excludes 10.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is true about symbols?
9. A) They are mutable
10. B) They can be subclassed
11. C) They support interpolation
12. D) They are interned (one object per name) (*)
13. Explanation: Symbols are immutable, interned singletons — ideal for Hash keys and method names.
14. Q2: What does `(1...5).to_a` return?
15. A) [1, 2, 3, 4] (*)
16. B) [1, 2, 3, 4, 5]
17. C) [1, 2, 3]
18. D) [2, 3, 4, 5]
19. Explanation: `...` is exclusive — stops before the end value.
20. Q3: Which heredoc strips common leading whitespace?
21. A) <<-HEREDOC
22. B) <<~HEREDOC (*)
23. C) <<HEREDOC
24. D) <<'HEREDOC'
25. Explanation: The squiggly heredoc <<~ (Ruby 2.3+) strips the common leading whitespace.
26. Q4: What does `"abc".gsub!('x', 'y')` return when there's no 'x'?
27. A) "abc"
28. B) ""
29. C) nil (*)
30. D) Raises NoMethodError
31. Explanation: gsub! returns nil if no substitution happened — a classic source of nil-class-method bugs.
32. Q5: What does `s << "x"` do that `s + "x"` does not?
33. A) Returns nil
34. B) Converts s to an array
35. C) Raises if s is frozen only sometimes
36. D) Mutates s in place (*)
37. Explanation: << mutates the receiver; + returns a new string and leaves s unchanged.
38. Q6: Which string syntax supports `#{expr}` interpolation?
39. A) Double quotes (*)
40. B) Single quotes
41. C) Both single and double
42. D) Neither — use format()
43. Explanation: Only double-quoted strings process #{} interpolation.
44. Q7: What is the default encoding for string literals in Ruby 2.0+?
45. A) ASCII-8BIT
46. B) UTF-8 (*)
47. C) ISO-8859-1
48. D) US-ASCII
49. Explanation: UTF-8 is the default source encoding since Ruby 2.0 (set by the magic comment or default).
50. Q8: What does `"hi".freeze` return?
51. A) A new frozen string
52. B) nil
53. C) The same string object, now frozen (*)
54. D) A Symbol
55. Explanation: freeze mutates the object's frozen status and returns the receiver.
56. Q9: What does `{ name: 'Alice' }[:name]` return?
57. A) nil
58. B) :name
59. C) Raises KeyError
60. D) 'Alice' (*)
61. Explanation: The new hash literal syntax `name:` creates a symbol key; `:name` retrieves the value.
62. Q10: Which converts a string to a symbol?
63. A) "name".to_sym (*)
64. B) "name".symbolize
65. C) :name
66. D) Symbol("name")
67. Explanation: to_sym and the symbol literal :"#{}" both produce a symbol; the best answer is `to_sym`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is true about symbols?
  options:
    - They are mutable
    - They can be subclassed
    - They support interpolation
    - They are interned (one object per name)
  correctIndex: 3
  explanation: Symbols are immutable, interned singletons — ideal for Hash keys and method names.
- id: q2
  question: What does `(1...5).to_a` return?
  options:
    - "[1, 2, 3, 4]"
    - "[1, 2, 3, 4, 5]"
    - "[1, 2, 3]"
    - "[2, 3, 4, 5]"
  correctIndex: 0
  explanation: "`...` is exclusive — stops before the end value."
- id: q3
  question: Which heredoc strips common leading whitespace?
  options:
    - <<-HEREDOC
    - <<~HEREDOC
    - <<HEREDOC
    - <<'HEREDOC'
  correctIndex: 1
  explanation: The squiggly heredoc <<~ (Ruby 2.3+) strips the common leading whitespace.
- id: q4
  question: What does `"abc".gsub!('x', 'y')` return when there's no 'x'?
  options:
    - '"abc"'
    - '""'
    - nil
    - Raises NoMethodError
  correctIndex: 2
  explanation: gsub! returns nil if no substitution happened — a classic source of nil-class-method bugs.
- id: q5
  question: What does `s << "x"` do that `s + "x"` does not?
  options:
    - Returns nil
    - Converts s to an array
    - Raises if s is frozen only sometimes
    - Mutates s in place
  correctIndex: 3
  explanation: << mutates the receiver; + returns a new string and leaves s unchanged.
- id: q6
  question: Which string syntax supports `#{expr}` interpolation?
  options:
    - Double quotes
    - Single quotes
    - Both single and double
    - Neither — use format()
  correctIndex: 0
  explanation: "Only double-quoted strings process #{} interpolation."
- id: q7
  question: What is the default encoding for string literals in Ruby 2.0+?
  options:
    - ASCII-8BIT
    - UTF-8
    - ISO-8859-1
    - US-ASCII
  correctIndex: 1
  explanation: UTF-8 is the default source encoding since Ruby 2.0 (set by the magic comment or default).
- id: q8
  question: What does `"hi".freeze` return?
  options:
    - A new frozen string
    - nil
    - The same string object, now frozen
    - A Symbol
  correctIndex: 2
  explanation: freeze mutates the object's frozen status and returns the receiver.
- id: q9
  question: "What does `{ name: 'Alice' }[:name]` return?"
  options:
    - nil
    - :name
    - Raises KeyError
    - "'Alice'"
  correctIndex: 3
  explanation: The new hash literal syntax `name:` creates a symbol key; `:name` retrieves the value.
- id: q10
  question: Which converts a string to a symbol?
  options:
    - '"name".to_sym'
    - '"name".symbolize'
    - :name
    - Symbol("name")
  correctIndex: 0
  explanation: to_sym and the symbol literal :"#{}" both produce a symbol; the best answer is `to_sym`.
```

