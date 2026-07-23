---
slug: bash-writing-robust-scripts-set-euo-pipefail-ifs
id: bash-16
track: bash
order: 16
title: Writing Robust Scripts — set -euo pipefail, IFS
description: Adopt Bash "strict mode" (`set -euo pipefail`) for safer scripts, handle unset variables with ${var:-default}, and use IFS deliberately to control word splitting.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=3000s
whyItMatters: Adopt Bash "strict mode" (`set -euo pipefail`) for safer scripts, handle unset variables with ${var:-default}, and use IFS deliberately to control word splitting.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Writing Robust Scripts — set -euo pipefail, IFS

## Writing Robust Scripts — set -euo pipefail, IFS

### Why It Matters

Adopt Bash "strict mode" (`set -euo pipefail`) for safer scripts, handle unset variables with ${var:-default}, and use IFS deliberately to control word splitting.

Adopt Bash "strict mode" (`set -euo pipefail`) for safer scripts, handle unset variables with ${var:-default}, and use IFS deliberately to control word splitting.

### Prerequisites

- Stage 11-15: exit codes, traps, regex
- Comfort with parameter expansion (Stage 2)

### Topics

- set -e (errexit): exit on first failure
- set -u (nounset): error on unset variable references
- set -o pipefail: pipeline fails if any stage fails
- set -x (xtrace): print commands for debugging; PS4 customization
- ${var:-default}, ${var:+set}, ${1:?msg} for safe defaults
- IFS=$' \t\n' — the default; modifying IFS safely (save/restore)
- shopt -s nullglob, globstar, extglob
- Strict-mode caveats and the "Bash strict mode" debate

### Key Concepts

- `set -euo pipefail` is the canonical "strict mode" header — fail on error, fail on unset var, fail on pipe-stage failure.
- `set -u` forces you to provide defaults via `${var:-default}` — otherwise unset var references abort the script.
- The default IFS is space-tab-newline; modifying IFS affects word splitting globally, so always save and restore: `OLDIFS=$IFS; IFS=','; ...; IFS=$OLDIFS`.
- shopt -s nullglob makes `*.txt` expand to nothing (instead of the literal "*.txt") when no files match — prevents "file '*.txt' not found" errors in loops.
- shopt -s globstar enables `**` to match recursively (Bash 4+): `**/*.py` finds .py files in all subdirs.
- `set -x` (xtrace) prints each command before execution; customize the prefix with PS4 (e.g. `PS4='+ $LINENO: '`).

### Common Pitfalls

- Adding `set -e` then being surprised that `cmd || true` is needed — set -e doesn't fire where the exit code is tested; explicit `|| true` is needed for "best-effort" commands.
- Forgetting `${var:-default}` under set -u — `$UNSET` aborts the script; always use `${var:-}` for optional vars or `${var:?msg}` for required ones.
- Modifying IFS without restoring — global IFS change breaks subsequent parsing; always save with OLDIFS=$IFS and restore, or use a subshell: `( IFS=','; ... )`.
- Expecting `set -e` to catch errors in `cmd1 && cmd2` — set -e is disabled in &&/|| chains; the chain returns the last evaluated exit code, which may be 0 even if cmd1 failed.
- Setting `set -e` in a script that sources a third-party file — the sourced file's commands may fail and abort your script unexpectedly; wrap with `( set +e; source file )`.

### Real-World Applications

- Google's Shell Style Guide mandates `set -euo pipefail` for all internal Bash scripts.
- Docker's official library entrypoint scripts (mysql, postgres, redis) begin with strict mode.
- Netflix's Edda and Spinnaker bake scripts use `set -euo pipefail` plus `shopt -s nullglob` for safe iteration.
- GitHub Actions runners set `-e` semantics by default for `run:` steps; you opt out per-step with `continue-on-error: true`.

### Interview Questions

- 1. What does `set -euo pipefail` do? — Sets errexit (exit on error), nounset (error on unset var), and pipefail (pipeline fails if any stage fails). It's the canonical strict-mode header.
- 2. Why use `${var:-default}` under set -u? — Without it, referencing an unset variable aborts the script; the :- default form returns the default if unset/empty.
- 3. What does shopt -s nullglob do? — Makes a glob with no matches expand to nothing (instead of the literal pattern), preventing "file '*.txt' not found" errors in loops.
- 4. What does IFS control? — The Internal Field Separator (default space-tab-newline) used for word splitting after parameter expansion and in `read`.
- 5. How do you trace a Bash script? — `set -x` (xtrace) prints each command before execution; customize the prefix with PS4 (e.g. `PS4='+ $LINENO: '`).

### Mini Project

Build a "config_loader.sh" library: A sourced library that parses INI-style key=value config files into associative arrays, with strict-mode safety. It handles comments (#), blank lines, sections ([section]), and quoted values. Suggested approach:
  - Start with `set -euo pipefail` in the main script (NOT in the lib — let callers decide)
  - Use `while IFS= read -r line` to read the file
  - Skip blank lines and lines starting with #
  - Detect [section] headers and prefix subsequent keys: declare -A cfg; cfg[section.key]=value
  - Strip surrounding quotes from values with ${val#\"} and ${val%\"}
  - Provide a `cfg_get key` function that echoes ${cfg[$key]:-} safely

### Exercises

1. Add `set -euo pipefail` to a script and watch it abort on the first unset variable.
2. Replace `echo "$UNSET"` with `echo "${UNSET:-default}"` and verify it doesn't abort.
3. Use `IFS=',' read -ra arr <<<"a,b,c"` to split a CSV line into an array.
4. Set `shopt -s nullglob` and loop over `*.notreal`; verify the loop body doesn't run.
5. Set `PS4='+ $LINENO: '` then `set -x` and run a small script; observe the line numbers in the trace.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `set -euo pipefail` do?
9. A) Echoes every unset variable
10. B) Disables pipes
11. C) Sets the user to "euo"
12. D) Enables strict mode: exit on error, error on unset var, pipeline fails if any stage fails (*)
13. Explanation: -e = errexit, -u = nounset, -o pipefail = pipefail. Together they form the canonical Bash "strict mode" header.
14. Q2: Under `set -u`, what happens if you reference an unset variable without a default?
15. A) The script aborts with an unbound variable error (*)
16. B) It expands to empty
17. C) It expands to 0
18. D) It expands to the variable name
19. Explanation: set -u (nounset) treats references to unset variables as errors and exits the script. Use ${var:-default} to provide a default.
20. Q3: How do you provide a default for an unset variable?
21. A) $var||default
22. B) ${var:-default} (*)
23. C) var?default
24. D) $var:default
25. Explanation: ${var:-default} returns default if var is unset or empty; ${var-default} returns default only if unset (not if empty).
26. Q4: What does `set -o pipefail` do?
27. A) Disables pipes
28. B) Forces pipes to use temp files
29. C) Makes a pipeline's exit code reflect any failed stage, not just the last (*)
30. D) Logs all pipe failures
31. Explanation: Without pipefail, `false | true` returns 0 (last stage). With pipefail, it returns 1 (rightmost failed stage).
32. Q5: What does IFS control?
33. A) The Interactive File System
34. B) The Input Flag Set
35. C) The Interactive Field Set
36. D) The Internal Field Separator used for word splitting and `read` (*)
37. Explanation: IFS (default space-tab-newline) determines how unquoted parameter expansions are split into words and how `read` separates fields.
38. Q6: What does `shopt -s nullglob` do?
39. A) Makes a non-matching glob expand to nothing instead of the literal pattern (*)
40. B) Disables globbing entirely
41. C) Hides dotfiles
42. D) Makes globbing recursive
43. Explanation: Without nullglob, `*.notreal` expands to the literal "*.notreal"; with nullglob, it expands to nothing, so loops over it don't run.
44. Q7: Which shopt enables recursive `**` globbing?
45. A) shopt -s nullglob
46. B) shopt -s globstar (*)
47. C) shopt -s extglob
48. D) shopt -s recursive
49. Explanation: globstar (Bash 4+) makes `**` match files in all subdirectories: `**/*.py` finds every .py file recursively.
50. Q8: How do you save and restore IFS safely?
51. A) IFS is read-only
52. B) Just change it; it resets automatically
53. C) OLDIFS=$IFS; IFS=','; ...; IFS=$OLDIFS — or use a subshell ( IFS=','; ... ) (*)
54. D) Use pushifs / popifs
55. Explanation: IFS is a regular variable; save the old value and restore it. A subshell `( IFS=','; ... )` isolates the change automatically.
56. Q9: How do you enable Bash command tracing with line numbers?
57. A) set -v
58. B) bash --trace
59. C) set -d
60. D) set -x with PS4='+ $LINENO: ' (*)
61. Explanation: set -x (xtrace) prints each command before execution; PS4 controls the prefix. Setting PS4='+ ${BASH_SOURCE[0]}:${LINENO}: ' shows file:line.
62. Q10: Where is set -e silently disabled (so it WON'T abort on failure)?
63. A) Inside if/while/until conditions, &&/|| chains, and command substitution (*)
64. B) Inside functions
65. C) Inside loops
66. D) Inside case statements
67. Explanation: set -e is disabled wherever the command's exit status is being tested or captured. This is by design — `if cmd` needs to handle cmd's failure.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `set -euo pipefail` do?
  options:
    - Echoes every unset variable
    - Disables pipes
    - Sets the user to "euo"
    - "Enables strict mode: exit on error, error on unset var, pipeline fails if any stage fails"
  correctIndex: 3
  explanation: -e = errexit, -u = nounset, -o pipefail = pipefail. Together they form the canonical Bash "strict mode" header.
- id: q2
  question: Under `set -u`, what happens if you reference an unset variable without a default?
  options:
    - The script aborts with an unbound variable error
    - It expands to empty
    - It expands to 0
    - It expands to the variable name
  correctIndex: 0
  explanation: set -u (nounset) treats references to unset variables as errors and exits the script. Use ${var:-default} to provide a default.
- id: q3
  question: How do you provide a default for an unset variable?
  options:
    - $var||default
    - ${var:-default}
    - var?default
    - $var:default
  correctIndex: 1
  explanation: ${var:-default} returns default if var is unset or empty; ${var-default} returns default only if unset (not if empty).
- id: q4
  question: What does `set -o pipefail` do?
  options:
    - Disables pipes
    - Forces pipes to use temp files
    - Makes a pipeline's exit code reflect any failed stage, not just the last
    - Logs all pipe failures
  correctIndex: 2
  explanation: Without pipefail, `false | true` returns 0 (last stage). With pipefail, it returns 1 (rightmost failed stage).
- id: q5
  question: What does IFS control?
  options:
    - The Interactive File System
    - The Input Flag Set
    - The Interactive Field Set
    - The Internal Field Separator used for word splitting and `read`
  correctIndex: 3
  explanation: IFS (default space-tab-newline) determines how unquoted parameter expansions are split into words and how `read` separates fields.
- id: q6
  question: What does `shopt -s nullglob` do?
  options:
    - Makes a non-matching glob expand to nothing instead of the literal pattern
    - Disables globbing entirely
    - Hides dotfiles
    - Makes globbing recursive
  correctIndex: 0
  explanation: Without nullglob, `*.notreal` expands to the literal "*.notreal"; with nullglob, it expands to nothing, so loops over it don't run.
- id: q7
  question: Which shopt enables recursive `**` globbing?
  options:
    - shopt -s nullglob
    - shopt -s globstar
    - shopt -s extglob
    - shopt -s recursive
  correctIndex: 1
  explanation: "globstar (Bash 4+) makes `**` match files in all subdirectories: `**/*.py` finds every .py file recursively."
- id: q8
  question: How do you save and restore IFS safely?
  options:
    - IFS is read-only
    - Just change it; it resets automatically
    - OLDIFS=$IFS; IFS=','; ...; IFS=$OLDIFS — or use a subshell ( IFS=','; ... )
    - Use pushifs / popifs
  correctIndex: 2
  explanation: IFS is a regular variable; save the old value and restore it. A subshell `( IFS=','; ... )` isolates the change automatically.
- id: q9
  question: How do you enable Bash command tracing with line numbers?
  options:
    - set -v
    - bash --trace
    - set -d
    - "set -x with PS4='+ $LINENO: '"
  correctIndex: 3
  explanation: "set -x (xtrace) prints each command before execution; PS4 controls the prefix. Setting PS4='+ ${BASH_SOURCE[0]}:${LINENO}: ' shows file:line."
- id: q10
  question: Where is set -e silently disabled (so it WON'T abort on failure)?
  options:
    - Inside if/while/until conditions, &&/|| chains, and command substitution
    - Inside functions
    - Inside loops
    - Inside case statements
  correctIndex: 0
  explanation: set -e is disabled wherever the command's exit status is being tested or captured. This is by design — `if cmd` needs to handle cmd's failure.
```

