---
slug: ruby-getting-started-ruby
id: ruby-01
track: ruby
order: 1
title: Getting Started with Ruby
description: Install Ruby 3.x, write your first program, run it from the command line, and explore irb (the interactive Ruby shell).
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg
whyItMatters: Install Ruby 3. x, write your first program, run it from the command line, and explore irb (the interactive Ruby shell).
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Getting Started with Ruby

## Getting Started with Ruby

### Why It Matters

Install Ruby 3. x, write your first program, run it from the command line, and explore irb (the interactive Ruby shell).

Install Ruby 3.x, write your first program, run it from the command line, and explore irb (the interactive Ruby shell).

### Prerequisites

- None — this is the entry point for the Ruby track.
- Basic computer literacy (installing software, using a terminal).

### Topics

- Installing Ruby 3.x on macOS/Linux/Windows (rbenv, rvm, asdf)
- Running .rb files with `ruby`
- Using irb (interactive Ruby) and ri (Ruby index) for docs
- Comments: `#` single line, `=begin`/`=end` blocks
- `puts`, `print`, and `p` differences
- String interpolation basics (`"#{expr}"`)
- The Ruby object model: everything is an object
- Gem and Bundler overview (preview)

### Key Concepts

- Ruby is interpreted by YARV (Yet Another Ruby VM) and is dynamically typed.
- Everything (including integers, nil, classes) is an object with methods.
- `puts` adds a newline; `print` does not; `p` calls `.inspect` for debugging.
- String interpolation `#{}` only works inside double-quoted strings, not single.
- Method calls don't always need parentheses: `puts "hi"` is the same as `puts("hi")`.
- Ruby 3.x adds static typing (RBS + TypeProf), pattern matching, and Ractor for parallelism.

```ruby
puts "Hello, World!"
```
Caption: Hello World

### Common Pitfalls

- Installing the system Ruby instead of a version manager — Use rbenv, rvm, or asdf so you can run multiple Ruby versions side by side without polluting system tools.
- Confusing puts and p in debugging — Use `p obj` (calls `inspect`, shows structure) for debugging and `puts obj` (calls `to_s`, human-readable) for output.
- Using single quotes when you need interpolation — Switch to double quotes, or use `\n`-style escapes only inside double-quoted strings.
- Editing Ruby with tabs mixed with spaces — Ruby convention is 2-space indentation; configure your editor to insert spaces for Tab to avoid syntax errors in heredocs and blocks.

### Real-World Applications

- GitHub's backend has been written in Ruby (Rails) since 2008; billions of git operations route through Ruby services daily.
- Shopify runs one of the largest Rails monoliths in the world, with over 500,000 merchants on a single codebase.
- Stripe's API server and dashboard were originally Ruby; much of the dashboard still runs Ruby today.
- Airbnb's original monolith was Rails; the company still runs large Ruby services alongside newer polyglot stack.

### Interview Questions

- 1. Who created Ruby, and when? — Yukihiro Matsumoto (Matz) released Ruby 0.95 in December 1995; Ruby 3.0 shipped December 2020.
- 2. What's the difference between puts, print, and p? — puts adds a newline and calls to_s; print writes without newline; p calls inspect and returns the object.
- 3. Why does `puts 'Hello, #{name}'` print the literal `#{name}`? — Single-quoted strings don't process interpolation; switch to double quotes.
- 4. What is irb useful for? — Exploring object methods, prototyping expressions, and debugging without writing a file.
- 5. Name two version managers for Ruby and why you'd use one. — rbenv (lightweight, shims) and rvm (richer feature set, gemsets); both isolate Ruby versions per project.

### Mini Project

Build a Greeting Generator CLI: A command-line tool that takes a name
and optional greeting word, then prints a personalized greeting with a
timestamp. Reads ARGV for the name and uses an environment variable or
default for the greeting. Suggested approach:
Suggested approach:
  - Read name from ARGV[0]; print usage if missing
  - Use Time.now.strftime for the timestamp
  - Default greeting to "Hello" but allow override via first CLI flag
  - Use double-quoted string with #{} interpolation
  - Print to $stdout with puts

### Exercises

1. Install Ruby 3.x via rbenv or rvm and verify with `ruby --version` (should print 3.x).
2. Open irb and use it as a calculator: 17 * 23, 2 ** 10, 100 / 7.0.
3. Create a file `hello.rb` that prints your name and current time using interpolation, then run it from the terminal.
4. In irb, run `[1,2,3].methods.sort` to see all methods available on an Array — observe how rich Ruby's stdlib is.
5. Run `ri Array#each` from the terminal to read the built-in docs for that method.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Who created Ruby?
9. A) Yukihiro Matsumoto (Matz) (*)
10. B) Brendan Eich
11. C) Guido van Rossum
12. D) Larry Wall
13. Explanation: Matz released Ruby 0.95 in December 1995 in Japan.
14. Q2: Which command prints WITH a trailing newline?
15. A) print
16. B) puts (*)
17. C) write
18. D) echo
19. Explanation: puts always appends `\n`; print does not.
20. Q3: Which string syntax enables `#{expr}` interpolation?
21. A) Single quotes ''
22. B) Backticks ``
23. C) Double quotes "" (*)
24. D) Both single and double
25. Explanation: Only double-quoted strings process #{} interpolation; single quotes are literal.
26. Q4: What does `p obj` do that `puts obj` does not?
27. A) It prints twice
28. B) It writes to stderr
29. C) It raises on nil
30. D) It calls inspect and returns the object (*)
31. Explanation: p uses inspect (debug-friendly) and returns its argument; puts uses to_s and returns nil.
32. Q5: Which is the recommended way to manage Ruby versions on a dev machine?
33. A) A version manager like rbenv or rvm (*)
34. B) sudo apt install ruby
35. C) Copy a ruby binary into /usr/local/bin
36. D) Use the macOS system Ruby only
37. Explanation: Version managers let you run multiple Ruby versions per-project without polluting system tools.
38. Q6: What does YARV stand for?
39. A) Yielding And Returning Values
40. B) Yet Another Ruby VM — the bytecode interpreter since Ruby 1.9 (*)
41. C) Young's Asynchronous Runtime Vessel
42. D) YARV is the original interpreter name from 1995
43. Explanation: YARV replaced the old AST-walking interpreter starting in Ruby 1.9 (2007).
44. Q7: Which file extension do Ruby source files use?
45. A) .ruby
46. B) .rbe
47. C) .rb (*)
48. D) .ru
49. Explanation: .rb is source; .ru is Rack-up (used for Rack config files like config.ru).
50. Q8: Which command starts an interactive Ruby session?
51. A) ruby -i
52. B) repl ruby
53. C) ruby --interactive
54. D) irb (*)
55. Explanation: irb = interactive Ruby; it evaluates expressions one at a time.
56. Q9: Which is true about parentheses in method calls?
57. A) They are optional in most cases (puts 'hi' == puts('hi')) (*)
58. B) They are required for every call
59. C) They cause syntax errors when omitted
60. D) They are only required inside classes
61. Explanation: Ruby lets you omit parens for method calls with arguments, which gives its DSL-like readability.
62. Q10: What does Ruby 3.0 introduce for parallelism?
63. A) goroutines
64. B) Ractor (Actor-based parallel execution) (*)
65. C) async/await keywords
66. D) Nothing — Ruby is single-threaded only
67. Explanation: Ractor (Ruby Actor) enables true parallel execution without the GIL, added in Ruby 3.0.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Who created Ruby?
  options:
    - Yukihiro Matsumoto (Matz)
    - Brendan Eich
    - Guido van Rossum
    - Larry Wall
  correctIndex: 0
  explanation: Matz released Ruby 0.95 in December 1995 in Japan.
- id: q2
  question: Which command prints WITH a trailing newline?
  options:
    - print
    - puts
    - write
    - echo
  correctIndex: 1
  explanation: puts always appends `\n`; print does not.
- id: q3
  question: Which string syntax enables `#{expr}` interpolation?
  options:
    - Single quotes ''
    - Backticks ``
    - Double quotes ""
    - Both single and double
  correctIndex: 2
  explanation: "Only double-quoted strings process #{} interpolation; single quotes are literal."
- id: q4
  question: What does `p obj` do that `puts obj` does not?
  options:
    - It prints twice
    - It writes to stderr
    - It raises on nil
    - It calls inspect and returns the object
  correctIndex: 3
  explanation: p uses inspect (debug-friendly) and returns its argument; puts uses to_s and returns nil.
- id: q5
  question: Which is the recommended way to manage Ruby versions on a dev machine?
  options:
    - A version manager like rbenv or rvm
    - sudo apt install ruby
    - Copy a ruby binary into /usr/local/bin
    - Use the macOS system Ruby only
  correctIndex: 0
  explanation: Version managers let you run multiple Ruby versions per-project without polluting system tools.
- id: q6
  question: What does YARV stand for?
  options:
    - Yielding And Returning Values
    - Yet Another Ruby VM — the bytecode interpreter since Ruby 1.9
    - Young's Asynchronous Runtime Vessel
    - YARV is the original interpreter name from 1995
  correctIndex: 1
  explanation: YARV replaced the old AST-walking interpreter starting in Ruby 1.9 (2007).
- id: q7
  question: Which file extension do Ruby source files use?
  options:
    - .ruby
    - .rbe
    - .rb
    - .ru
  correctIndex: 2
  explanation: .rb is source; .ru is Rack-up (used for Rack config files like config.ru).
- id: q8
  question: Which command starts an interactive Ruby session?
  options:
    - ruby -i
    - repl ruby
    - ruby --interactive
    - irb
  correctIndex: 3
  explanation: irb = interactive Ruby; it evaluates expressions one at a time.
- id: q9
  question: Which is true about parentheses in method calls?
  options:
    - They are optional in most cases (puts 'hi' == puts('hi'))
    - They are required for every call
    - They cause syntax errors when omitted
    - They are only required inside classes
  correctIndex: 0
  explanation: Ruby lets you omit parens for method calls with arguments, which gives its DSL-like readability.
- id: q10
  question: What does Ruby 3.0 introduce for parallelism?
  options:
    - goroutines
    - Ractor (Actor-based parallel execution)
    - async/await keywords
    - Nothing — Ruby is single-threaded only
  correctIndex: 1
  explanation: Ractor (Ruby Actor) enables true parallel execution without the GIL, added in Ruby 3.0.
```

