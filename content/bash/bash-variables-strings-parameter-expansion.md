---
slug: bash-variables-strings-parameter-expansion
id: bash-02
track: bash
order: 2
title: Variables, Strings, and Parameter Expansion
description: Master Bash variable assignment, quoting rules, and the parameter-expansion toolkit that lets you slice, default, and transform strings without forking external commands.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=200s
whyItMatters: Master Bash variable assignment, quoting rules, and the parameter-expansion toolkit that lets you slice, default, and transform strings without forking external commands.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Variables, Strings, and Parameter Expansion

## Variables, Strings, and Parameter Expansion

### Why It Matters

Master Bash variable assignment, quoting rules, and the parameter-expansion toolkit that lets you slice, default, and transform strings without forking external commands.

Master Bash variable assignment, quoting rules, and the parameter-expansion toolkit that lets you slice, default, and transform strings without forking external commands.

### Prerequisites

- Stage 1: Getting Started with Bash
- Comfort creating and running a .sh file
- Basic understanding of `echo` and command-line arguments

### Topics

- Variable assignment rules (no spaces around =)
- Single quotes ('literal') vs double quotes ("$interp")
- $VAR vs ${VAR} vs "${VAR}" — when each matters
- Parameter expansion: ${var:-default}, ${var:=default}, ${var:+set}, ${var:?error}
- String operations: ${#var}, ${var#prefix}, ${var%suffix}, ${var//old/new}
- Case modification (Bash 4+): ${var^^}, ${var,,}, ${var^}, ${var,}
- Special parameters: $0, $1-$9, $#, $@, $*, $$, $!, $?, $-
- Exporting variables with `export` and `declare -x`

### Key Concepts

- Assignment is `name=value` with NO spaces; `name = value` is a syntax error (Bash sees name as a command).
- Single quotes preserve every character literally; double quotes interpolate $vars and allow `\` escapes for $, `, \, ", newline.
- Always quote `"$var"` — without quotes, Bash performs word splitting AND glob expansion on the value, turning "a b" into two args and "*" into a file list.
- ${var:-default} returns default if var is unset/empty; ${var-default} (no colon) returns default only if unset.
- export passes a variable to child processes; plain assignment is shell-local only.
- The difference between $@ and "$@": the former word-splits every arg; the latter preserves each arg as a separate quoted item.

```bash
#!/usr/bin/env bash
name="Ada"            # No spaces around =
greeting="Hello, $name"      # Double quotes interpolate
literal='Hello, $name'       # Single quotes are literal
echo "$greeting"             # Hello, Ada
echo "$literal"              # Hello, $name
echo "Path: $PATH"           # Double quotes preserve spaces in $PATH
```
Caption: Assignment and quoting

### Common Pitfalls

- Writing `name = value` with spaces — Bash parses this as "run the command `name` with args `=` and `value`"; remove the spaces.
- Forgetting to quote `"$var"` — values containing spaces get word-split and globs expand; always use `"$var"` unless you specifically want splitting.
- Mixing single and double quotes — `'$USER'` is literal; `"$USER"` interpolates; you cannot nest single inside single, only escape with `'...'\''...'`.
- Confusing ${var:-x} (empty OR unset) with ${var-x} (only unset) — the colon changes the test; pick the one matching your intent.
- Expecting `export` to update the parent shell — export only pushes to children; to set the parent you must `source` a script that does the assignment.

### Real-World Applications

- The Homebrew install script (/bin/bash -c "$(curl -fsSL ...)") uses parameter expansion like ${USER:-$(whoami)} throughout to set sensible defaults.
- Kubernetes' kind and k3s install scripts use ${KUBECONFIG:-$HOME/.kube/config} to honor user overrides.
- Git's `git-completion.bash` and `git-prompt.sh` use ${var:?msg} to bail early when required binaries are missing.
- AWS CLI v2 installer uses ${TMPDIR:-/tmp} to pick a scratch directory, gracefully degrading on minimal containers.

### Interview Questions

- 1. Why does `name = value` fail in Bash? — Bash tokenizes on whitespace; it tries to execute `name` as a command with `=` and `value` as arguments; remove the spaces.
- 2. What's the difference between `'$x'` and `"$x"`? — Single quotes are literal (no interpolation); double quotes interpolate $x and allow backslash escapes for $ ` " \ newline.
- 3. What does `${var:-default}` return if var is empty string? — `default`, because the colon tests for both unset AND empty; without the colon (`${var-default}`) it returns the empty value.
- 4. How do you strip the file extension from `archive.tar.gz`? — `${f%.*}` removes the shortest suffix matching `.*` (gives `archive.tar`); `${f%%.*}` removes the longest (gives `archive`).
- 5. Why prefer `"$@"` over `$@`? — Quoted `"$@"` preserves each argument as a separate quoted item, even if it contains spaces; unquoted `$@` word-splits and globs.

### Mini Project

Build a "pathutil.sh" library: A sourced library that exposes functions for manipulating file paths: basename, dirname, strip_extension, swap_extension, and join_paths. Each function uses only parameter expansion (no forks to /usr/bin/basename or /usr/bin/dirname). Suggested approach:
  - Implement basename via ${path##*/} and dirname via ${path%/*}
  - Use ${file%.*} and ${file%%.*} for extension stripping
  - Join paths by stripping trailing / from prefix and leading / from suffix
  - Add a `_assert_set` helper using ${1:?usage msg}
  - Add a self-test mode (`./pathutil.sh --test`) that asserts each function on sample inputs

### Exercises

1. Assign a variable `greeting="Hello, World!"` and print its length with `${#greeting}`.
2. Use `${var:-default}` to print a fallback when `API_KEY` is unset.
3. Strip the .tar.gz extension from a filename using both `${f%.*}` and `${f%%.*}` and observe the difference.
4. Convert a string to uppercase using `${var^^}` (Bash 4+); verify on macOS Bash 3.2 it fails.
5. Write a one-liner that prints "Hello, $USER (pid $$)" using double quotes and verify the variables interpolate.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which assignment is correct Bash syntax?
9. A) name = value
10. B) name=value (*)
11. C) name := value
12. D) let name = value
13. Explanation: Bash assignment requires no spaces around =; with spaces Bash treats `name` as a command name.
14. Q2: What does `'$USER'` (single quotes) print in echo?
15. A) Your username
16. B) An empty string
17. C) The literal text $USER (*)
18. D) A syntax error
19. Explanation: Single quotes preserve every character literally, so $USER is not interpolated.
20. Q3: What does `${var:-default}` return when var is set to empty string?
21. A) Empty string
22. B) var
23. C) A syntax error
24. D) default (*)
25. Explanation: The colon tests for unset OR empty, so an empty var triggers the default. Without the colon, empty returns empty.
26. Q4: Which expansion strips the longest suffix matching `.*` from $f?
27. A) ${f%%.*} (*)
28. B) ${f%.*}
29. C) ${f#.*}
30. D) ${f##.*}
31. Explanation: %% strips the LONGEST matching suffix; % strips the shortest. # and ## work on prefixes.
32. Q5: What is the safest way to expand a variable that may contain spaces?
33. A) $var
34. B) "$var" (*)
35. C) ${var}
36. D) '$var'
37. Explanation: Double quotes preserve the value as a single argument; without quotes Bash word-splits and globs the value.
38. Q6: Which expansion uppercases the entire string in Bash 4+?
39. A) ${var^}
40. B) ${var UPPER}
41. C) ${var^^} (*)
42. D) ${var:?UPPER}
43. Explanation: ^^ uppercases all characters; ^ uppercases only the first. Both require Bash 4.0 or newer.
44. Q7: What does `${#var}` return?
45. A) The number of words in var
46. B) The PID of var
47. C) A hash of var
48. D) The length of var in characters (*)
49. Explanation: ${#var} is the string length in bytes/characters (depending on locale).
50. Q8: What does `export VAR=1` do that `VAR=1` does not?
51. A) Makes VAR available to child processes (*)
52. B) Makes VAR read-only
53. C) Makes VAR a global function
54. D) Removes VAR from the environment
55. Explanation: export adds VAR to the environment so child processes inherit it; plain assignment is shell-local only.
56. Q9: How do you abort a script if CONFIG is unset, with a custom message?
57. A) if [ -z "$CONFIG" ]; exit 1; fi
58. B) ${CONFIG:?CONFIG must be set} (*)
59. C) ${CONFIG:-CONFIG must be set}
60. D) unset CONFIG && exit
61. Explanation: ${var:?msg} prints msg to stderr and exits with code 1 if var is unset or empty.
62. Q10: What's the difference between $@ and "$@"?
63. A) None — they are identical
64. B) $@ is POSIX, "$@" is bash-only
65. C) "$@" preserves each argument as a separate quoted item (*)
66. D) "$@" joins all args with spaces
67. Explanation: Unquoted $@ word-splits and globs each argument; quoted "$@" preserves each as a discrete item, which is what you almost always want.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which assignment is correct Bash syntax?
  options:
    - name = value
    - name=value
    - name := value
    - let name = value
  correctIndex: 1
  explanation: Bash assignment requires no spaces around =; with spaces Bash treats `name` as a command name.
- id: q2
  question: What does `'$USER'` (single quotes) print in echo?
  options:
    - Your username
    - An empty string
    - The literal text $USER
    - A syntax error
  correctIndex: 2
  explanation: Single quotes preserve every character literally, so $USER is not interpolated.
- id: q3
  question: What does `${var:-default}` return when var is set to empty string?
  options:
    - Empty string
    - var
    - A syntax error
    - default
  correctIndex: 3
  explanation: The colon tests for unset OR empty, so an empty var triggers the default. Without the colon, empty returns empty.
- id: q4
  question: Which expansion strips the longest suffix matching `.*` from $f?
  options:
    - ${f%%.*}
    - ${f%.*}
    - ${f#.*}
    - ${f##.*}
  correctIndex: 0
  explanation: "%% strips the LONGEST matching suffix; % strips the shortest. # and ## work on prefixes."
- id: q5
  question: What is the safest way to expand a variable that may contain spaces?
  options:
    - $var
    - '"$var"'
    - ${var}
    - "'$var'"
  correctIndex: 1
  explanation: Double quotes preserve the value as a single argument; without quotes Bash word-splits and globs the value.
- id: q6
  question: Which expansion uppercases the entire string in Bash 4+?
  options:
    - ${var^}
    - ${var UPPER}
    - ${var^^}
    - ${var:?UPPER}
  correctIndex: 2
  explanation: ^^ uppercases all characters; ^ uppercases only the first. Both require Bash 4.0 or newer.
- id: q7
  question: What does `${#var}` return?
  options:
    - The number of words in var
    - The PID of var
    - A hash of var
    - The length of var in characters
  correctIndex: 3
  explanation: ${#var} is the string length in bytes/characters (depending on locale).
- id: q8
  question: What does `export VAR=1` do that `VAR=1` does not?
  options:
    - Makes VAR available to child processes
    - Makes VAR read-only
    - Makes VAR a global function
    - Removes VAR from the environment
  correctIndex: 0
  explanation: export adds VAR to the environment so child processes inherit it; plain assignment is shell-local only.
- id: q9
  question: How do you abort a script if CONFIG is unset, with a custom message?
  options:
    - if [ -z "$CONFIG" ]; exit 1; fi
    - ${CONFIG:?CONFIG must be set}
    - ${CONFIG:-CONFIG must be set}
    - unset CONFIG && exit
  correctIndex: 1
  explanation: ${var:?msg} prints msg to stderr and exits with code 1 if var is unset or empty.
- id: q10
  question: What's the difference between $@ and "$@"?
  options:
    - None — they are identical
    - $@ is POSIX, "$@" is bash-only
    - '"$@" preserves each argument as a separate quoted item'
    - '"$@" joins all args with spaces'
  correctIndex: 2
  explanation: Unquoted $@ word-splits and globs each argument; quoted "$@" preserves each as a discrete item, which is what you almost always want.
```

