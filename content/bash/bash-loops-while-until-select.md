---
slug: bash-loops-while-until-select
id: bash-05
track: bash
order: 5
title: Loops — for, while, until, select
description: Repeat work with for-in lists, C-style for counters, while/until conditions, and interactive select menus — and learn to read lines safely with `while IFS= read`.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=800s
whyItMatters: Repeat work with for-in lists, C-style for counters, while/until conditions, and interactive select menus — and learn to read lines safely with `while IFS= read`.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Loops — for, while, until, select

## Loops — for, while, until, select

### Why It Matters

Repeat work with for-in lists, C-style for counters, while/until conditions, and interactive select menus — and learn to read lines safely with `while IFS= read`.

Repeat work with for-in lists, C-style for counters, while/until conditions, and interactive select menus — and learn to read lines safely with `while IFS= read`.

### Prerequisites

- Stage 1-4: control flow, variables, tests
- Comfort with redirecting file input with `<`

### Topics

- for var in list (word-list iteration)
- C-style for (( init; cond; update ))
- while condition; do ...; done
- until condition; do ...; done
- select var in list (interactive menu)
- break and continue (with optional N for nested loops)
- while IFS= read -r line (the safe line-reading idiom)
- Looping with the seq and brace expansion {1..10} idioms

### Key Concepts

- `for x in $list` performs word splitting on $list — often wrong; use `for x in "${arr[@]}"` for arrays or quoted expansions.
- `for (( i=0; i<n; i++ ))` is Bash's C-style for; you can use `(( ))` arithmetic in the condition.
- `while IFS= read -r line` is the safe idiom to read lines preserving leading/trailing whitespace and backslashes; -r disables escape interpretation.
- `until` is `while not` — it runs the body until the condition succeeds (exit 0).
- `select` displays a numbered menu and reads user choice into REPLY; the chosen item goes into the loop variable.
- `break N` breaks out of N enclosing loops; `continue N` continues the Nth enclosing loop.

```bash
# Iterate a list
for f in *.txt; do
  echo "Processing $f"
done

# C-style counter
for (( i=0; i<5; i++ )); do
  echo "i = $i"
done

# Brace expansion
for n in {1..10}; do
  printf '%d ' "$n"
done
echo
```
Caption: for-in and C-style for

### Common Pitfalls

- Iterating with `for f in $(ls)` — breaks on filenames with spaces, newlines, or glob chars; use `for f in *` or `find ... -print0 | while IFS= read -r -d '' f`.
- Using `cat file | while read line` — the pipe runs the while in a subshell, so any variables set inside don't persist after; redirect instead: `while ... done < file`.
- Forgetting `IFS=` and `-r` in `read` — without IFS=, leading/trailing whitespace is stripped; without -r, backslashes get eaten.
- Infinite loop because the loop body never changes the condition — always verify the counter increments or the file pointer advances.
- Using `for i in {1..$N}` — brace expansion happens BEFORE variable expansion, so {1..$N} doesn't interpolate; use `for (( i=1; i<=N; i++ ))` or `seq 1 "$N"`.

### Real-World Applications

- The Homebrew brew formulas use `for f in *.rb` style loops to iterate package definitions during bulk updates.
- Git's pre-commit hooks (and many third-party hooks) iterate staged files with `for f in $(git diff --cached --name-only)`.
- The Linux kernel's `scripts/` directory uses `while read` loops to parse Makefile and Kconfig fragments during build.
- Ansible's local-facts collector scripts use `while IFS== read -r k v` to parse /etc/ansible/facts.d/*.fact files.

### Interview Questions

- 1. Why is `for f in $(ls)` dangerous? — Word splitting on the ls output breaks filenames containing spaces, newlines, or glob characters; use `for f in *` (nullglob-aware) or find with -print0.
- 2. Why doesn't this loop's variable persist? — `cat file | while read line; do x=1; done; echo $x` — the pipe puts the while in a subshell; redirect instead: `while ... done < file`.
- 3. What's the canonical safe line-read idiom? — `while IFS= read -r line; do ...; done < file` — IFS= preserves whitespace, -r disables backslash escapes.
- 4. How is `until` different from `while`? — until runs while the condition FAILS (until it succeeds); while runs while it succeeds. They are logical opposites.
- 5. How do you break out of two nested loops at once? — `break 2` breaks out of the current loop and one enclosing loop; the optional N defaults to 1.

### Mini Project

Build a "logwatch.sh" tail-following monitor: A script that tails a log file (or stdin) and prints a colored, prefixed summary of each line based on level (INFO/WARN/ERROR). It uses a while-read loop with case to classify lines, and handles SIGINT to print a summary count before exiting. Suggested approach:
  - Use `tail -n 0 -f "$logfile" | while IFS= read -r line` (note: pipe runs in subshell; use process substitution `<(tail -f ...)` to keep state)
  - Use case to classify by regex/glob on the line (e.g. *ERROR*, *WARN*)
  - Use ANSI color codes (\\033[31m for red, etc.) and reset
  - Trap SIGINT to print "Saw $errors errors, $warnings warnings" and exit
  - Add a --follow flag and a --grep pattern flag

### Exercises

1. Use `for f in *.txt` to print the first line of every .txt file in the current directory.
2. Use a C-style `for (( i=1; i<=10; i++ ))` to print the squares of numbers 1-10.
3. Read /etc/passwd line by line with `while IFS= read -r` and print just the username (first field).
4. Build a select menu that asks the user to pick a directory from ~/Downloads and lists its contents.
5. Write an `until` loop that retries a `curl -sf` to a URL every 2 seconds, up to 30 times, then exits with an error.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is the safe way to iterate over all .txt files in the current directory?
9. A) for f in *.txt (*)
10. B) for f in $(ls *.txt)
11. C) for f in `find . -name *.txt`
12. D) for f in $(echo *.txt)
13. Explanation: `for f in *.txt` lets Bash expand the glob itself; no word splitting happens on the result, so filenames with spaces are preserved.
14. Q2: Why don't variables set inside `cat file | while read line; do x=1; done` persist?
15. A) cat strips them
16. B) The while runs in a subshell due to the pipe (*)
17. C) read discards variables
18. D) x is local by default
19. Explanation: Each command in a pipeline runs in a subshell; variable assignments there don't propagate back. Use `while ... done < file` instead.
20. Q3: What's the safe line-reading idiom?
21. A) while read line; do ...; done
22. B) while read -e line; do ...; done
23. C) while IFS= read -r line; do ...; done (*)
24. D) while get line; do ...; done
25. Explanation: IFS= preserves leading/trailing whitespace; -r disables backslash escape interpretation. Both together are the canonical safe form.
26. Q4: What does `for (( i=0; i<3; i++ ))` use?
27. A) POSIX arithmetic
28. B) Python syntax
29. C) AWK syntax
30. D) C-style arithmetic for-loop, Bash-specific (*)
31. Explanation: `for (( ))` is Bash's C-style for loop; it uses the (( )) arithmetic evaluator and is not POSIX-portable.
32. Q5: What does `select flavor in a b c` do?
33. A) Displays a numbered menu and reads user input into REPLY; the choice goes into $flavor (*)
34. B) Picks a random item
35. C) Sorts the list
36. D) Filters the list
37. Explanation: select prints a numbered menu, prompts with PS3, reads the user's choice into REPLY, and assigns the corresponding item to the loop variable.
38. Q6: How does `until cond; do ...; done` differ from `while cond; do ...; done`?
39. A) until runs once; while repeats
40. B) until runs while cond is false; while runs while cond is true (*)
41. C) until is faster
42. D) They are identical
43. Explanation: until loops until the condition succeeds (exit 0); while loops while it succeeds. They are logical opposites.
44. Q7: Why does `for i in {1..$N}` not work as expected?
45. A) $N must be quoted
46. B) {1..$N} is a syntax error
47. C) Brace expansion happens before variable expansion (*)
48. D) Bash doesn't support brace expansion
49. Explanation: Brace expansion runs before any parameter expansion, so {1..$N} never interpolates; use `for (( i=1; i<=N; i++ ))` or `seq 1 "$N"`.
50. Q8: How do you break out of two nested loops?
51. A) break all
52. B) exit 2
53. C) double break
54. D) break 2 (*)
55. Explanation: `break N` breaks out of N enclosing loops; N defaults to 1. Same for `continue N`.
56. Q9: What does `continue` do inside a loop?
57. A) Restarts the loop from the top, skipping the rest of the body (*)
58. B) Prints "continue"
59. C) Exits the loop
60. D) Pauses the loop
61. Explanation: `continue` skips the rest of the current iteration and jumps to the next; `continue N` applies to the Nth enclosing loop.
62. Q10: Which reads stdin line by line WITHOUT losing backslashes?
63. A) read line
64. B) read -r line (*)
65. C) read -e line
66. D) read -a line
67. Explanation: -r disables backslash escape interpretation; without it, `\n` becomes `n` and `\\` becomes `\`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is the safe way to iterate over all .txt files in the current directory?
  options:
    - for f in *.txt
    - for f in $(ls *.txt)
    - for f in `find . -name *.txt`
    - for f in $(echo *.txt)
  correctIndex: 0
  explanation: "`for f in *.txt` lets Bash expand the glob itself; no word splitting happens on the result, so filenames with spaces are preserved."
- id: q2
  question: Why don't variables set inside `cat file | while read line; do x=1; done` persist?
  options:
    - cat strips them
    - The while runs in a subshell due to the pipe
    - read discards variables
    - x is local by default
  correctIndex: 1
  explanation: Each command in a pipeline runs in a subshell; variable assignments there don't propagate back. Use `while ... done < file` instead.
- id: q3
  question: What's the safe line-reading idiom?
  options:
    - while read line; do ...; done
    - while read -e line; do ...; done
    - while IFS= read -r line; do ...; done
    - while get line; do ...; done
  correctIndex: 2
  explanation: IFS= preserves leading/trailing whitespace; -r disables backslash escape interpretation. Both together are the canonical safe form.
- id: q4
  question: What does `for (( i=0; i<3; i++ ))` use?
  options:
    - POSIX arithmetic
    - Python syntax
    - AWK syntax
    - C-style arithmetic for-loop, Bash-specific
  correctIndex: 3
  explanation: "`for (( ))` is Bash's C-style for loop; it uses the (( )) arithmetic evaluator and is not POSIX-portable."
- id: q5
  question: What does `select flavor in a b c` do?
  options:
    - Displays a numbered menu and reads user input into REPLY; the choice goes into $flavor
    - Picks a random item
    - Sorts the list
    - Filters the list
  correctIndex: 0
  explanation: select prints a numbered menu, prompts with PS3, reads the user's choice into REPLY, and assigns the corresponding item to the loop variable.
- id: q6
  question: How does `until cond; do ...; done` differ from `while cond; do ...; done`?
  options:
    - until runs once; while repeats
    - until runs while cond is false; while runs while cond is true
    - until is faster
    - They are identical
  correctIndex: 1
  explanation: until loops until the condition succeeds (exit 0); while loops while it succeeds. They are logical opposites.
- id: q7
  question: Why does `for i in {1..$N}` not work as expected?
  options:
    - $N must be quoted
    - "{1..$N} is a syntax error"
    - Brace expansion happens before variable expansion
    - Bash doesn't support brace expansion
  correctIndex: 2
  explanation: Brace expansion runs before any parameter expansion, so {1..$N} never interpolates; use `for (( i=1; i<=N; i++ ))` or `seq 1 "$N"`.
- id: q8
  question: How do you break out of two nested loops?
  options:
    - break all
    - exit 2
    - double break
    - break 2
  correctIndex: 3
  explanation: "`break N` breaks out of N enclosing loops; N defaults to 1. Same for `continue N`."
- id: q9
  question: What does `continue` do inside a loop?
  options:
    - Restarts the loop from the top, skipping the rest of the body
    - Prints "continue"
    - Exits the loop
    - Pauses the loop
  correctIndex: 0
  explanation: "`continue` skips the rest of the current iteration and jumps to the next; `continue N` applies to the Nth enclosing loop."
- id: q10
  question: Which reads stdin line by line WITHOUT losing backslashes?
  options:
    - read line
    - read -r line
    - read -e line
    - read -a line
  correctIndex: 1
  explanation: -r disables backslash escape interpretation; without it, `\n` becomes `n` and `\\` becomes `\`.
```

