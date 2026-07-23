---
slug: bash-functions-arguments
id: bash-06
track: bash
order: 6
title: Functions and Arguments
description: Define reusable functions, pass and shift arguments, scope variables with local, and return values via stdout — because Bash functions can only return exit codes, not data.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=1000s
whyItMatters: Define reusable functions, pass and shift arguments, scope variables with local, and return values via stdout — because Bash functions can only return exit codes, not data.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Functions and Arguments

## Functions and Arguments

### Why It Matters

Define reusable functions, pass and shift arguments, scope variables with local, and return values via stdout — because Bash functions can only return exit codes, not data.

Define reusable functions, pass and shift arguments, scope variables with local, and return values via stdout — because Bash functions can only return exit codes, not data.

### Prerequisites

- Stage 1-5: control flow, loops, variables, tests
- Comfort with command substitution $() (Stage 3)

### Topics

- Function definition: `function name() {}` and `name() {}` (both forms)
- Positional parameters inside functions: $1 $2 ... $@ $#
- return vs exit (return for functions, exit for scripts)
- local and declare for scoping
- Returning values via stdout + $(...) capture
- shift to consume arguments
- Recursive functions and `local` for recursion safety
- Exporting functions with `export -f` (Bash 4+)

### Key Concepts

- `function name() { ... }` and `name() { ... }` are equivalent; the `function` keyword is optional and Bash-only.
- Functions have their own $1 $2 ... $@ $# — these are NOT the script's args; they're the args passed TO the function.
- `return` exits a function with an exit code (0-255); `exit` exits the whole script. Use return for functions.
- Functions cannot return strings or numbers — they return exit codes. To "return" data, echo it and capture with `result=$(my_func)`.
- `local var` makes a variable function-scoped; without local, assignments leak into the calling scope (and into globals).
- `export -f my_func` exports the function so child processes (subshells, xargs -P, parallel) can call it.

```bash
#!/usr/bin/env bash
greet() {
  local name="$1"
  echo "Hello, $name!"
}

greet "World"            # Hello, World!
greet                    # Hello, !   (no arg -> $1 is empty)
greet "Ada" "Bob"        # $2 is silently dropped (echo doesn't use it)
```
Caption: Defining and calling

### Common Pitfalls

- Expecting `return $value` to return data — return only takes an exit code (0-255); values >255 wrap modulo 256; use echo + $() for data.
- Forgetting `local` — variables set inside a function without local become globals; this is the #1 cause of spooky action-at-a-distance bugs in Bash.
- Using `$1` thinking it's the script's argument inside a function — inside a function $1 is the function's first arg; save the script's args before calling.
- Defining a function inside a pipe (`... | my_func`) — the function runs in a subshell, so any state changes (assignments, file writes to caller's vars) don't propagate.
- Calling `exit` from a function when you meant `return` — exit kills the entire script, not just the function; this is the most common cause of "my script died unexpectedly".

### Real-World Applications

- The bash-completion project (used by every major distro) defines thousands of functions for tab-completing git, docker, kubectl, etc.
- The Docker docker-entrypoint.sh scripts (mysql, postgres, redis) define helper functions like `docker_create_db_directories` to keep the main flow readable.
- The Google Cloud SDK (gcloud) install script defines functions for OS detection, URL fetching, and path manipulation that are reused throughout.
- AWS's amazon-eks-ami build scripts use exported functions passed to Packer's local provisioner for parallel execution.

### Interview Questions

- 1. What's the difference between `return` and `exit`? — return exits a function with an exit code (0-255); exit exits the entire script. Use return inside functions.
- 2. How do you "return" a string from a Bash function? — You can't directly; echo the value and capture with `result=$(my_func)`. The exit code is separate.
- 3. Why use `local` in functions? — Without local, variable assignments leak to the calling scope (often global); local makes them function-scoped and is essential for recursion.
- 4. What does `export -f my_func` do? — Exports the function definition to child processes via the environment, so subshells and `xargs -P` can call it.
- 5. Why does my function work standalone but not inside `find ... -exec my_func {} \;`? — find -exec spawns a new shell that doesn't know your function; export -f it first, or wrap with `bash -c` and source a lib.

### Mini Project

Build a "stringlib.sh" library: A sourced library of string-manipulation functions: trim, upper, lower, reverse, contains, starts_with, ends_with. Each function takes a string (and a pattern for the last two) and echoes the result. Suggested approach:
  - Implement trim by stripping leading/trailing whitespace with ${var#"${var%%[![:space:]]*}"} and ${var%"${var##*[![:space:]]}"}
  - upper/lower via ${var^^} / ${var,,}
  - reverse with a `while read` character loop or `rev` if available
  - contains via [[ "$1" == *"$2"* ]]; starts_with via [[ "$1" == "$2"* ]]
  - Add a `stringlib_selftest` function that asserts each function on sample inputs

### Exercises

1. Write a function `max(a, b)` that echoes the larger of two numbers using $(( )) and if.
2. Write a recursive function `fib(n)` that echoes the nth Fibonacci number; test fib(10) = 55.
3. Demonstrate the difference between `return 5` and `echo 5` by capturing both $? and $() in two test functions.
4. Write a variadic `sum_all` function that uses `shift` to add up all its arguments and echoes the result.
5. Use `export -f` to make a function available to `xargs -P 4 -I{} bash -c 'my_func {}'` running in parallel.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How does a Bash function return data to its caller?
9. A) Via return
10. B) Via echo + $(...) capture; return is only for exit codes (*)
11. C) Via a global RESULT variable
12. D) Via stderr
13. Explanation: Functions return exit codes (0-255) via `return`; to pass data back, echo it and capture with `result=$(my_func)`.
14. Q2: What does `local x=1` do?
15. A) Makes x a constant
16. B) Exports x to child processes
17. C) Scopes x to the current function (*)
18. D) Makes x an integer
19. Explanation: local creates a function-scoped variable; without it, assignments persist into the calling scope (often global).
20. Q3: What happens if you call `exit 1` inside a function?
21. A) Only the function exits with code 1
22. B) The function returns 1 and the script continues
23. C) Error: exit not allowed in functions
24. D) The entire script exits with code 1 (*)
25. Explanation: exit terminates the whole script regardless of where it's called; use `return` to exit only the function.
26. Q4: What does `export -f my_func` do?
27. A) Exports my_func to child processes via the environment (*)
28. B) Deletes my_func
29. C) Makes my_func inline
30. D) Compiles my_func
31. Explanation: export -f serializes the function into an environment variable (`BASH_FUNC_my_func%%`) so child shells can call it.
32. Q5: Inside a function, what is $1?
33. A) The script's first argument
34. B) The function's first argument (*)
35. C) Always 1
36. D) The PID of the caller
37. Explanation: Functions have their own positional parameters; $1 inside a function is the first argument passed TO the function, not to the script.
38. Q6: Which two function-definition syntaxes are equivalent in Bash?
39. A) function name() {} and def name {}
40. B) func name {} and fn name {}
41. C) function name() {} and name() {} (*)
42. D) name() {} and func name {}
43. Explanation: Both `function name() { ... }` and `name() { ... }` work; the `function` keyword is optional and Bash-only (not POSIX).
44. Q7: Why does this leak the variable: `f() { x=1; }; f; echo $x` prints 1?
45. A) x was already global
46. B) Bash has no scope rules
47. C) echo can read function-local vars
48. D) All variables in functions are global by default (*)
49. Explanation: Without `local`, assignments inside a function modify the existing (or create a new global) variable; use `local x=1` to keep it scoped.
50. Q8: What's the maximum value `return` can take?
51. A) 255 (*)
52. B) 127
53. C) 256
54. D) 32767
55. Explanation: return takes an exit code 0-255; values wrap modulo 256, so `return 256` is equivalent to `return 0`.
56. Q9: What does `shift` do?
57. A) Moves $1 to $0
58. B) Discards $1 and shifts $2->$1, $3->$2, etc. (*)
59. C) Reverses the arg list
60. D) Prints all args
61. Explanation: shift (default shift 1) drops the first positional parameter and renumbers the rest; useful for variadic functions and arg parsing.
62. Q10: Why might a function work in your script but fail inside `find -exec`?
63. A) find doesn't allow function calls
64. B) find -exec runs as root
65. C) find -exec spawns a new shell that doesn't know your function; export -f it first (*)
66. D) find -exec disables functions
67. Explanation: -exec launches a fresh process; your function lives in the current shell. Export it with `export -f name` or use `bash -c` with a sourced lib.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How does a Bash function return data to its caller?
  options:
    - Via return
    - Via echo + $(...) capture; return is only for exit codes
    - Via a global RESULT variable
    - Via stderr
  correctIndex: 1
  explanation: Functions return exit codes (0-255) via `return`; to pass data back, echo it and capture with `result=$(my_func)`.
- id: q2
  question: What does `local x=1` do?
  options:
    - Makes x a constant
    - Exports x to child processes
    - Scopes x to the current function
    - Makes x an integer
  correctIndex: 2
  explanation: local creates a function-scoped variable; without it, assignments persist into the calling scope (often global).
- id: q3
  question: What happens if you call `exit 1` inside a function?
  options:
    - Only the function exits with code 1
    - The function returns 1 and the script continues
    - "Error: exit not allowed in functions"
    - The entire script exits with code 1
  correctIndex: 3
  explanation: exit terminates the whole script regardless of where it's called; use `return` to exit only the function.
- id: q4
  question: What does `export -f my_func` do?
  options:
    - Exports my_func to child processes via the environment
    - Deletes my_func
    - Makes my_func inline
    - Compiles my_func
  correctIndex: 0
  explanation: export -f serializes the function into an environment variable (`BASH_FUNC_my_func%%`) so child shells can call it.
- id: q5
  question: Inside a function, what is $1?
  options:
    - The script's first argument
    - The function's first argument
    - Always 1
    - The PID of the caller
  correctIndex: 1
  explanation: Functions have their own positional parameters; $1 inside a function is the first argument passed TO the function, not to the script.
- id: q6
  question: Which two function-definition syntaxes are equivalent in Bash?
  options:
    - function name() {} and def name {}
    - func name {} and fn name {}
    - function name() {} and name() {}
    - name() {} and func name {}
    - .
  correctIndex: 2
  explanation: Both `function name() { ... }` and `name() { ... }` work; the `function` keyword is optional and Bash-only (not POSIX).
- id: q7
  question: "Why does this leak the variable: `f() { x=1; }; f; echo $x` prints 1?"
  options:
    - x was already global
    - Bash has no scope rules
    - echo can read function-local vars
    - All variables in functions are global by default
  correctIndex: 3
  explanation: Without `local`, assignments inside a function modify the existing (or create a new global) variable; use `local x=1` to keep it scoped.
- id: q8
  question: What's the maximum value `return` can take?
  options:
    - "255"
    - "127"
    - "256"
    - "32767"
  correctIndex: 0
  explanation: return takes an exit code 0-255; values wrap modulo 256, so `return 256` is equivalent to `return 0`.
- id: q9
  question: What does `shift` do?
  options:
    - Moves $1 to $0
    - Discards $1 and shifts $2->$1, $3->$2, etc.
    - Reverses the arg list
    - Prints all args
  correctIndex: 1
  explanation: shift (default shift 1) drops the first positional parameter and renumbers the rest; useful for variadic functions and arg parsing.
- id: q10
  question: Why might a function work in your script but fail inside `find -exec`?
  options:
    - find doesn't allow function calls
    - find -exec runs as root
    - find -exec spawns a new shell that doesn't know your function; export -f it first
    - find -exec disables functions
  correctIndex: 2
  explanation: -exec launches a fresh process; your function lives in the current shell. Export it with `export -f name` or use `bash -c` with a sourced lib.
```

