---
slug: bash-shell-scripting-best-practices-shellcheck-shfmt
id: bash-19
track: bash
order: 19
title: Shell Scripting Best Practices — ShellCheck, shfmt
description: Lint your scripts with ShellCheck, format them with shfmt, and adopt conventions from the Google and Bash Hackers style guides that make Bash maintainable.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=3600s
whyItMatters: Lint your scripts with ShellCheck, format them with shfmt, and adopt conventions from the Google and Bash Hackers style guides that make Bash maintainable.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Shell Scripting Best Practices — ShellCheck, shfmt

## Shell Scripting Best Practices — ShellCheck, shfmt

### Why It Matters

Lint your scripts with ShellCheck, format them with shfmt, and adopt conventions from the Google and Bash Hackers style guides that make Bash maintainable.

Lint your scripts with ShellCheck, format them with shfmt, and adopt conventions from the Google and Bash Hackers style guides that make Bash maintainable.

### Prerequisites

- Stage 1-18: all prior Bash concepts
- A text editor with shell syntax highlighting

### Topics

- ShellCheck: what it catches (SC2086, SC2046, SC2128, SC2181, etc.)
- ShellCheck directives: # shellcheck disable=SC2086
- shfmt: formatting with -i N (indent), -ci (case indent), -bn (binary ops)
- bash-language-server for editor integration
- Style guides: Google, Bash Hackers, OpenStack
- Version checks with BASH_VERSINFO
- Testing with bats-core (introduced here, deep dive in capstone)
- Defensive coding: validate inputs, fail closed, no eval

### Key Concepts

- ShellCheck is a static analyzer that catches the top ~1500 Bash bugs (unquoted vars, useless cat, deprecated syntax); it's the single biggest Bash quality lever.
- SC2086 ("Double quote to prevent globbing and word splitting") is the most common warning — almost always apply the suggested fix.
- shfmt auto-formats Bash scripts (like gofmt for Go); integrate with your editor to format on save.
- Always check `BASH_VERSINFO` (a 5-element array) before using Bash 4+ features like associative arrays: `(( BASH_VERSINFO[0] >= 4 ))`.
- bats-core is the standard Bash testing framework; write `@test "name" { ... }` blocks with assertions.
- Defensive coding: validate inputs at the top, fail closed on errors, NEVER use eval on user input (use printf %q to escape, or indirect via declare -n).

### Common Pitfalls

- Suppressing ShellCheck warnings globally — instead, suppress per-line with `# shellcheck disable=SC2086` and a comment explaining why; global suppression hides real bugs.
- Using eval on user input — `eval "$USER_INPUT"` is a code-injection vector; use `printf '%q'` to escape or use declare -n for indirect variable access.
- Not pinning Bash version — using `declare -A` on macOS Bash 3.2 fails cryptically; check `BASH_VERSINFO[0]` at the top and bail with a clear error.
- Skipping bats-core tests for shell scripts — Bash is notoriously bug-prone; even a handful of bats tests catch regressions in argument parsing and edge cases.
- Mixing tabs and spaces — shfmt standardizes on one style; configure your editor and shfmt consistently to avoid the "noisy diff" problem.

### Real-World Applications

- ShellCheck is integrated into GitHub Actions, GitLab CI, and pre-commit hooks at companies like Google, Microsoft, and Shopify.
- The Homebrew formula repository enforces shfmt and ShellCheck in CI; PRs that fail lint are auto-blocked.
- Netflix's Spinnaker build scripts run ShellCheck in pre-commit with `-x` (follows source) to catch bugs across sourced libraries.
- The Docker official images' entrypoint scripts are ShellCheck-clean and serve as a public reference for Bash best practices.

### Interview Questions

- 1. What is ShellCheck? — A static analyzer (Haskell program) that catches common Bash bugs like unquoted variables, useless cat, deprecated syntax, and command substitution edge cases.
- 2. What does SC2086 mean? — "Double quote to prevent globbing and word splitting" — the most common ShellCheck warning; almost always apply the fix by quoting the variable.
- 3. How do you disable a ShellCheck warning for one line? — `# shellcheck disable=SC2086` on the line above (with an explanatory comment) — prefer per-line over file-wide suppression.
- 4. What is shfmt? — A Bash auto-formatter (like gofmt) that enforces consistent indentation, spacing, and case style; configurable via .editorconfig.
- 5. How do you check the Bash version in a script? — `BASH_VERSINFO` is a 5-element array; `(( BASH_VERSINFO[0] >= 4 ))` checks for Bash 4+. Always do this before using Bash 4+ features.

### Mini Project

Build a "lint_runner.sh" CI helper: A script that runs ShellCheck and shfmt on every .sh file in a project, exits non-zero on any error, and prints a summary. Suggested approach:
  - Use find -print0 + xargs -0 to gather .sh files safely
  - Run shellcheck with -x (follow source) and --shell=bash
  - Run shfmt -d (diff mode; exits non-zero if changes needed)
  - Capture each tool's exit code; print "PASS/FAIL: <file>" for each
  - Trap EXIT to print a total summary ("X passed, Y failed")
  - Exit non-zero if any tool failed, so CI blocks the PR

### Exercises

1. Install ShellCheck (`brew install shellcheck` or `apt install shellcheck`) and run it on a script you wrote.
2. Run `shfmt -i 4 -ci -bn -d script.sh` and apply any suggested changes.
3. Add `# shellcheck disable=SC2086` above a deliberate word-splitting case with a justification comment.
4. Write a 3-test bats-core file for an `add` function and run it with `bats test.bats`.
5. Add a `BASH_VERSINFO` check at the top of a script that requires Bash 4+ and verify it exits cleanly on macOS Bash 3.2.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is ShellCheck?
9. A) A Bash interpreter
10. B) A shell script formatter
11. C) A static analyzer that catches common Bash bugs like unquoted variables and deprecated syntax (*)
12. D) A unit test framework
13. Explanation: ShellCheck is a static analyzer (written in Haskell) that flags common Bash pitfalls — unquoted vars, useless cat, deprecated syntax, eval misuse — without running the script.
14. Q2: What does ShellCheck warning SC2086 mean?
15. A) Useless use of cat
16. B) Deprecated backticks
17. C) Missing shebang
18. D) Double quote to prevent globbing and word splitting (*)
19. Explanation: SC2086 is the most common warning — it flags an unquoted variable expansion that may word-split or glob. Almost always apply the suggested fix.
20. Q3: How do you disable a ShellCheck warning for a single line?
21. A) # shellcheck disable=SC2086 (*)
22. B) # shellcheck off
23. C) // nocheck
24. D) /* shellcheck skip */
25. Explanation: Put `# shellcheck disable=SCXXXX` on the line above (with a comment explaining why). Prefer per-line suppression over disabling globally — global suppression hides real bugs.
26. Q4: What is shfmt?
27. A) A shell linter
28. B) A Bash auto-formatter (like gofmt) that enforces consistent style (*)
29. C) A test framework
30. D) A package manager
31. Explanation: shfmt (mvdan.cc/sh) formats Bash scripts automatically; configurable via .editorconfig. Run `shfmt -i 4 -ci -bn -w script.sh` to write in place.
32. Q5: How do you check the Bash version inside a script?
33. A) $BASH_VERSION only
34. B) $SHLVL
35. C) BASH_VERSINFO (a 5-element array); (( BASH_VERSINFO[0] >= 4 )) (*)
36. D) bash --version | head -1
37. Explanation: BASH_VERSINFO[0] is the major version as an integer; useful for arithmetic comparison. Always check before using Bash 4+ features like associative arrays.
38. Q6: What is bats-core?
39. A) A Bash linter
40. B) A Bash formatter
41. C) A Bash debugger
42. D) A Bash testing framework with @test blocks (*)
43. Explanation: bats-core (Bash Automated Testing System) lets you write `@test "name" { ... }` blocks with run/status/output assertions — the standard way to unit-test Bash scripts.
44. Q7: Why avoid `eval "$USER_INPUT"`?
45. A) It's a code-injection vector; user input like `; rm -rf /` would run (*)
46. B) eval is slow
47. C) eval is deprecated
48. D) eval only works with numbers
49. Explanation: eval interprets its argument as a Bash command, so user input becomes executable code. Use printf '%q' to escape, or use declare -n for indirect variable access.
50. Q8: Which shfmt flag sets indent to 4 spaces?
51. A) -s 4
52. B) -i 4 (*)
53. C) --indent=4
54. D) -t 4
55. Explanation: -i N sets indent to N spaces (0 = tabs). -ci indents case branches, -bn places binary operators like && at line start, -w writes in place.
56. Q9: Which ShellCheck flag follows `source`d files?
57. A) -f
58. B) --follow
59. C) -x (*)
60. D) -s
61. Explanation: `shellcheck -x script.sh` follows source/. statements so warnings from sourced libraries are also reported. Essential for projects that split code across files.
62. Q10: What's the recommended way to handle ShellCheck SC2086 when you DO want word splitting?
63. A) Disable the warning globally
64. B) Just ignore the warning
65. C) Use eval instead
66. D) Suppress per-line with `# shellcheck disable=SC2086` and a comment explaining why (*)
67. Explanation: Per-line suppression with a justification comment is the cleanest pattern; it documents the intent and keeps ShellCheck useful for the rest of the file.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is ShellCheck?
  options:
    - A Bash interpreter
    - A shell script formatter
    - A static analyzer that catches common Bash bugs like unquoted variables and deprecated syntax
    - A unit test framework
  correctIndex: 2
  explanation: ShellCheck is a static analyzer (written in Haskell) that flags common Bash pitfalls — unquoted vars, useless cat, deprecated syntax, eval misuse — without running the script.
- id: q2
  question: What does ShellCheck warning SC2086 mean?
  options:
    - Useless use of cat
    - Deprecated backticks
    - Missing shebang
    - Double quote to prevent globbing and word splitting
  correctIndex: 3
  explanation: SC2086 is the most common warning — it flags an unquoted variable expansion that may word-split or glob. Almost always apply the suggested fix.
- id: q3
  question: How do you disable a ShellCheck warning for a single line?
  options:
    - "# shellcheck disable=SC2086"
    - "# shellcheck off"
    - // nocheck
    - /* shellcheck skip */
  correctIndex: 0
  explanation: Put `# shellcheck disable=SCXXXX` on the line above (with a comment explaining why). Prefer per-line suppression over disabling globally — global suppression hides real bugs.
- id: q4
  question: What is shfmt?
  options:
    - A shell linter
    - A Bash auto-formatter (like gofmt) that enforces consistent style
    - A test framework
    - A package manager
  correctIndex: 1
  explanation: shfmt (mvdan.cc/sh) formats Bash scripts automatically; configurable via .editorconfig. Run `shfmt -i 4 -ci -bn -w script.sh` to write in place.
- id: q5
  question: How do you check the Bash version inside a script?
  options:
    - $BASH_VERSION only
    - $SHLVL
    - BASH_VERSINFO (a 5-element array); (( BASH_VERSINFO[0] >= 4 ))
    - bash --version | head -1
  correctIndex: 2
  explanation: BASH_VERSINFO[0] is the major version as an integer; useful for arithmetic comparison. Always check before using Bash 4+ features like associative arrays.
- id: q6
  question: What is bats-core?
  options:
    - A Bash linter
    - A Bash formatter
    - A Bash debugger
    - A Bash testing framework with @test blocks
  correctIndex: 3
  explanation: bats-core (Bash Automated Testing System) lets you write `@test "name" { ... }` blocks with run/status/output assertions — the standard way to unit-test Bash scripts.
- id: q7
  question: Why avoid `eval "$USER_INPUT"`?
  options:
    - It's a code-injection vector; user input like `; rm -rf /` would run
    - eval is slow
    - eval is deprecated
    - eval only works with numbers
  correctIndex: 0
  explanation: eval interprets its argument as a Bash command, so user input becomes executable code. Use printf '%q' to escape, or use declare -n for indirect variable access.
- id: q8
  question: Which shfmt flag sets indent to 4 spaces?
  options:
    - -s 4
    - -i 4
    - --indent=4
    - -t 4
  correctIndex: 1
  explanation: -i N sets indent to N spaces (0 = tabs). -ci indents case branches, -bn places binary operators like && at line start, -w writes in place.
- id: q9
  question: Which ShellCheck flag follows `source`d files?
  options:
    - -f
    - --follow
    - -x
    - -s
  correctIndex: 2
  explanation: "`shellcheck -x script.sh` follows source/. statements so warnings from sourced libraries are also reported. Essential for projects that split code across files."
- id: q10
  question: What's the recommended way to handle ShellCheck SC2086 when you DO want word splitting?
  options:
    - Disable the warning globally
    - Just ignore the warning
    - Use eval instead
    - Suppress per-line with `# shellcheck disable=SC2086` and a comment explaining why
  correctIndex: 3
  explanation: Per-line suppression with a justification comment is the cleanest pattern; it documents the intent and keeps ShellCheck useful for the rest of the file.
```

