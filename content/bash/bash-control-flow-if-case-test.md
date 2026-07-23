---
slug: bash-control-flow-if-case-test
id: bash-04
track: bash
order: 4
title: Control Flow — if, case, test
description: Drive script decisions with if/elif/else, multi-branch case statements, and the test operators — and understand why [[ ]] is almost always better than [ ].
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=600s
whyItMatters: Drive script decisions with if/elif/else, multi-branch case statements, and the test operators — and understand why [[ ]] is almost always better than [ ].
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Control Flow — if, case, test

## Control Flow — if, case, test

### Why It Matters

Drive script decisions with if/elif/else, multi-branch case statements, and the test operators — and understand why [[ ]] is almost always better than [ ].

Drive script decisions with if/elif/else, multi-branch case statements, and the test operators — and understand why [[ ]] is almost always better than [ ].

### Prerequisites

- Stage 1: Getting Started with Bash
- Stage 2: Variables, Strings, and Parameter Expansion
- Stage 3: Command Substitution and Arithmetic

### Topics

- if/elif/else/fi structure
- The [ ] (test) command — POSIX, external, single-bracket
- The [[ ]] extended test — Bash-only, safer, more powerful
- File tests: -e -f -d -r -w -x -s -L
- String tests: -z -n == != < > (lexicographic in [[)
- Integer tests: -eq -ne -lt -le -gt -ge
- Logical: && || ! and -a -o (deprecated in [)
- case/esac with glob patterns and | alternation

### Key Concepts

- [ ] is the POSIX `test` command — it's parsed like any command, so `>` is redirection and unquoted empty vars are syntax errors.
- [[ ]] is a Bash keyword parsed specially — no word splitting on vars, < > do string comparison, && || work natively, regex with =~.
- In [[ ]], the right-hand side of == and != is a glob pattern; quote it to compare literally, leave unquoted to glob-match.
- Integer comparison uses -eq -lt etc.; using == on numbers works but does string comparison ("09" != "9").
- case patterns use shell globs (not regex): * matches anything, ? matches one char, [abc] matches a set, | separates alternatives.
- if takes a command (any command) — its exit status decides the branch; `[ ]` and `[[ ]]` are just commands that exit 0 or 1.

### Common Pitfalls

- Using `=` vs `==` inconsistently — both work in [[ ]]; in POSIX [, only `=` is standard (== is a Bash extension); for portability use `=`.
- Forgetting spaces inside `[ ]` — `[1 -eq 1]` fails; `[ 1 -eq 1 ]` works because [ is a command and needs whitespace-separated args.
- Using < and > in [ ] without escaping — `[ a < b ]` is parsed as input redirection; use `[ a \< b ]` or `[[ a < b ]]`.
- Comparing numbers as strings — `[ "09" = "9" ]` returns false even though they're numerically equal; use `[ 09 -eq 9 ]` instead.
- Forgetting `;;` in case branches — without the terminator Bash falls through to the next pattern's body, which is rarely intended.

### Real-World Applications

- The rustup install script uses case on $(uname -s) and $(uname -m) to pick the right prebuilt binary tarball.
- Homebrew's brew shell command uses case to dispatch subcommands (install, uninstall, search, etc.) to internal functions.
- The Docker entrypoint scripts for postgres, mysql, and redis images use if [[ ]] to detect first-run vs subsequent startup.
- nvm's install.sh uses if [[ ]] with regex to validate version strings like "18.16.0" before resolving URLs.

### Interview Questions

- 1. What's the difference between [ ] and [[ ]]? — [ is the POSIX test command (external binary); [[ is a Bash keyword that doesn't word-split, supports && || natively, allows regex with =~, and is generally safer.
- 2. Why does `[ $x = "yes" ]` fail when $x is empty? — Without quotes, the command becomes `[ = "yes" ]` which is a syntax error; quote `"$x"` or use `[[ $x == yes ]]`.
- 3. How do you match a regex in Bash? — Only in [[ ]]: `[[ $str =~ ^[0-9]+$ ]]`; captures go into the BASH_REMATCH array.
- 4. What does `case ... in pattern) ... ;;&` do? — `;;` exits the case; `;;&` falls through and re-tests subsequent patterns (Bash 4+).
- 5. Why use -eq instead of = for numbers? — = does string comparison; "09" != "9" as strings; -eq does numeric comparison and treats them as equal.

### Mini Project

Build an "os_detect.sh" library: A script that detects the OS, distro, init system, and package manager, then prints a normalized JSON object. It uses case on `uname -s`, checks /etc/os-release, and tests for systemctl vs service vs apk/apt/yum. Suggested approach:
  - Use uname -s and a case statement to branch on Linux/Darwin/BSD/Windows
  - On Linux, source /etc/os-release and read ID and VERSION_ID
  - Test for package managers with `command -v apt-get`, `command -v dnf`, etc.
  - Detect init system by checking if /run/systemd/system exists
  - Emit a JSON object using printf, with proper quoting

### Exercises

1. Write an if/elif/else that classifies a number as positive, negative, or zero using [[ ]].
2. Use case to convert a one-letter grade (A, B, C, D, F) to a numeric range.
3. Test whether /etc/passwd is a regular file AND readable in one [[ ]] expression.
4. Use [[ =~ ]] to validate that $1 matches an IPv4 address pattern (4 dot-separated numbers 0-255).
5. Compare `[ "10" = "10" ]` and `[ "10" -eq "10" ]`; then test `[ "010" -eq "10" ]` and explain the result.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is safer in Bash — [ ] or [[ ]]?
9. A) [ ] — it is POSIX
10. B) They are identical
11. C) Neither; use (( ))
12. D) [[ ]] — it does not word-split and supports regex (*)
13. Explanation: [[ ]] is a Bash keyword parsed specially: no word splitting on variables, native && and ||, and =~ for regex.
14. Q2: What's wrong with `[ $x = yes ]` when $x is empty?
15. A) It becomes `[ = yes ]` — a syntax error (*)
16. B) Nothing — it returns false
17. C) It prints $x
18. D) It matches everything
19. Explanation: Unquoted empty $x vanishes, leaving `[ = yes ]`; Bash sees `=` as the operator with no left operand. Quote it: `[ "$x" = yes ]`.
20. Q3: Which operator matches a regex in Bash?
21. A) ==
22. B) =~ (*)
23. C) ~=
24. D) ~~
25. Explanation: =~ is the regex operator inside [[ ]]; the regex is on the right and captures go into BASH_REMATCH.
26. Q4: Which tests if a file exists AND is a regular file?
27. A) [ -e file ]
28. B) [ -d file ]
29. C) [ -f file ] (*)
30. D) [ -r file ]
31. Explanation: -e is "exists (any type)"; -f is "exists AND is a regular file"; -d is directory; -r is readable.
32. Q5: In `[[ $name == *.txt ]]`, what does *.txt do?
33. A) Literal comparison
34. B) Regex match
35. C) Arithmetic comparison
36. D) Glob pattern match against $name (*)
37. Explanation: Inside [[ ]], the RHS of == is a glob pattern (unless quoted); *.txt matches any string ending in .txt.
38. Q6: Which case-statement terminator exits the case immediately?
39. A) ;; (*)
40. B) ;;&
41. C) ;&
42. D) esac
43. Explanation: ;; exits the case; ;& falls through unconditionally to the next pattern body; ;;& falls through and re-tests subsequent patterns (Bash 4+).
44. Q7: Why does `[ "09" = "9" ]` return false?
45. A) Bash converts to integer
46. B) Leading zeros matter in string comparison (*)
47. C) It is a syntax error
48. D) Quotes disable comparison
49. Explanation: = is string comparison; "09" and "9" differ as strings. For numeric equality use `[ 09 -eq 9 ]` or `[[ 09 -eq 9 ]]`.
50. Q8: Which is the POSIX-standard string equality operator in [ ]?
51. A) ==
52. B) eq
53. C) = (*)
54. D) equals
55. Explanation: POSIX test specifies `=` for string equality; `==` is a Bash extension that also works in [[ ]] but is not portable to dash.
56. Q9: How do you combine two conditions in [[ ]]?
57. A) -a and -o
58. B) AND and OR
59. C) & and |
60. D) && and || (*)
61. Explanation: Inside [[ ]] use && and ||; the -a and -o operators are POSIX-deprecated and only work in [ ].
62. Q10: What is the exit code of `[[ -e /etc/passwd ]]`?
63. A) 0 if /etc/passwd exists, 1 otherwise (*)
64. B) Always 0
65. C) The PID of passwd
66. D) The inode number
67. Explanation: [[ ]] returns 0 if the test succeeds, 1 if it fails; that's what makes it usable as the condition for if/while.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is safer in Bash — [ ] or [[ ]]?
  options:
    - "[ ] — it is POSIX"
    - They are identical
    - Neither; use (( ))
    - "[[ ]] — it does not word-split and supports regex"
  correctIndex: 3
  explanation: "[[ ]] is a Bash keyword parsed specially: no word splitting on variables, native && and ||, and =~ for regex."
- id: q2
  question: What's wrong with `[ $x = yes ]` when $x is empty?
  options:
    - It becomes `[ = yes ]` — a syntax error
    - Nothing — it returns false
    - It prints $x
    - It matches everything
  correctIndex: 0
  explanation: 'Unquoted empty $x vanishes, leaving `[ = yes ]`; Bash sees `=` as the operator with no left operand. Quote it: `[ "$x" = yes ]`.'
- id: q3
  question: Which operator matches a regex in Bash?
  options:
    - ==
    - =~
    - ~=
    - ~~
  correctIndex: 1
  explanation: =~ is the regex operator inside [[ ]]; the regex is on the right and captures go into BASH_REMATCH.
- id: q4
  question: Which tests if a file exists AND is a regular file?
  options:
    - "[ -e file ]"
    - "[ -d file ]"
    - "[ -f file ]"
    - "[ -r file ]"
  correctIndex: 2
  explanation: -e is "exists (any type)"; -f is "exists AND is a regular file"; -d is directory; -r is readable.
- id: q5
  question: In `[[ $name == *.txt ]]`, what does *.txt do?
  options:
    - Literal comparison
    - Regex match
    - Arithmetic comparison
    - Glob pattern match against $name
  correctIndex: 3
  explanation: Inside [[ ]], the RHS of == is a glob pattern (unless quoted); *.txt matches any string ending in .txt.
- id: q6
  question: Which case-statement terminator exits the case immediately?
  options:
    - ;;
    - ;;&
    - ;&
    - esac
  correctIndex: 0
  explanation: ;; exits the case; ;& falls through unconditionally to the next pattern body; ;;& falls through and re-tests subsequent patterns (Bash 4+).
- id: q7
  question: Why does `[ "09" = "9" ]` return false?
  options:
    - Bash converts to integer
    - Leading zeros matter in string comparison
    - It is a syntax error
    - Quotes disable comparison
  correctIndex: 1
  explanation: = is string comparison; "09" and "9" differ as strings. For numeric equality use `[ 09 -eq 9 ]` or `[[ 09 -eq 9 ]]`.
- id: q8
  question: Which is the POSIX-standard string equality operator in [ ]?
  options:
    - ==
    - eq
    - =
    - equals
  correctIndex: 2
  explanation: POSIX test specifies `=` for string equality; `==` is a Bash extension that also works in [[ ]] but is not portable to dash.
- id: q9
  question: How do you combine two conditions in [[ ]]?
  options:
    - -a and -o
    - AND and OR
    - "& and |"
    - "&& and ||"
  correctIndex: 3
  explanation: Inside [[ ]] use && and ||; the -a and -o operators are POSIX-deprecated and only work in [ ].
- id: q10
  question: What is the exit code of `[[ -e /etc/passwd ]]`?
  options:
    - 0 if /etc/passwd exists, 1 otherwise
    - Always 0
    - The PID of passwd
    - The inode number
  correctIndex: 0
  explanation: "[[ ]] returns 0 if the test succeeds, 1 if it fails; that's what makes it usable as the condition for if/while."
```

