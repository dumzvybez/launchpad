---
slug: bash-text-processing-grep-sed-awk
id: bash-09
track: bash
order: 9
title: Text Processing — grep, sed, awk
description: Slice and dice text streams with the Unix power tools — grep for filtering, sed for stream editing, and awk for columnar data — and learn when each is the right tool.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=1600s
whyItMatters: Slice and dice text streams with the Unix power tools — grep for filtering, sed for stream editing, and awk for columnar data — and learn when each is the right tool.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Text Processing — grep, sed, awk

## Text Processing — grep, sed, awk

### Why It Matters

Slice and dice text streams with the Unix power tools — grep for filtering, sed for stream editing, and awk for columnar data — and learn when each is the right tool.

Slice and dice text streams with the Unix power tools — grep for filtering, sed for stream editing, and awk for columnar data — and learn when each is the right tool.

### Prerequisites

- Stage 1-8: pipes, redirection, regex basics from Stage 4
- Comfort with `|` and stdin/stdout

### Topics

- grep: -E (ERE), -v (invert), -i (case), -c (count), -n (line no), -A/-B/-C context
- grep -q for silent test (exit code only); grep -o for matched substring
- sed: substitute s/old/new/g, addresses (1,$, /regex/), -n + p, -i in-place
- sed -E for ERE; sed -i.bak for portable in-place with backup
- awk: -F field separator, $0, $1..$NF, NR, NF, BEGIN/END blocks
- awk patterns (regex and comparison), one-liners, and arrays
- Choosing: grep = filter, sed = transform, awk = compute

### Key Concepts

- grep -E uses POSIX Extended Regular Expressions (ERE) — cleaner than the default BRE which needs backslashes for +, ?, |.
- grep -q is the canonical "does this match?" test — it exits 0 if any line matches, 1 if none; pair with if for control flow.
- sed -i edits the file in place BUT the GNU and BSD/macOS versions differ: GNU accepts `sed -i 's/x/y/'`, BSD requires `sed -i '' 's/x/y/'`; use `sed -i.bak` for portability.
- awk auto-splits each line on whitespace (configurable with -F) into $1, $2, ..., $NF; NR is line number, NF is field count.
- awk is a full programming language with variables, arrays, and functions — it's often faster than Bash loops for columnar processing because it's a single process.
- For simple find-and-replace, sed is right; for "compute aggregates over columns", awk is right; for "does this line match a pattern", grep is right.

```bash
# Find lines containing "error" (case-insensitive, line numbers)
grep -ni error app.log

# Count matches
grep -c TODO *.py

# Silent test (exit code only, no output)
if grep -q "^root:" /etc/passwd; then
  echo "root user exists"
fi

# Print only the matched part
echo "user=ada id=42" | grep -o '[0-9]\+'   # 42

# Context lines
grep -A 2 -B 2 "panic" kernel.log
```
Caption: grep

### Common Pitfalls

- Using sed -i without a backup on macOS — BSD sed requires an argument after -i (even empty: `sed -i ''`); GNU sed doesn't; use `sed -i.bak` for portability.
- Forgetting that grep uses BRE by default — `\+`, `\?`, `\|` need backslashes in BRE; switch to `grep -E` for ERE where + ? | work unescaped.
- Using sed with `/` in patterns without escaping — `sed 's//usr/bin//opt/bin/'` breaks; use a different delimiter: `sed 's|/usr/bin|/opt/bin|'`.
- Expecting awk to split on whitespace exactly — consecutive whitespace counts as ONE separator (good for /etc/passwd:); for literal single-space splitting, set -F' '.
- Forgetting that sed operates line-by-line — multi-line operations need -z (GNU) or `:a;N;$!ba;` patterns; for multi-line work consider awk or perl.

### Real-World Applications

- Logrotate's postrotate scripts use grep to find stale PIDs in /var/run/*.pid files.
- The Kubernetes kubeadm config generator uses sed to patch kubelet command-line flags.
- Netflix's Atlas monitoring system has shell wrappers that use awk to compute percentiles from metric TSV files.
- The Git source release tarball's Makefile uses awk to compute version strings from git-describe output.

### Interview Questions

- 1. What's the difference between `grep -E` and `grep` (no flag)? — grep uses Basic Regular Expressions (BRE) where + ? | need backslashes; grep -E uses Extended (ERE) where they don't.
- 2. Why does `sed -i 's/x/y/' file` fail on macOS? — BSD sed requires an argument after -i (the backup suffix); use `sed -i '' 's/x/y/'` on macOS or `sed -i.bak` for portability.
- 3. How do you sum column 2 of a file with awk? — `awk '{sum+=$2} END {print sum}' file` — sum accumulates per line, END prints the total.
- 4. What's the canonical grep test for "does this match"? — `grep -q` (quiet) returns 0 if any line matches; pair with if: `if grep -q pattern file; then ...`.
- 5. Why use a different sed delimiter for paths? — `/` in the search/replace collides with the default delimiter; use `s|/old/path|/new/path|` with |, #, or @.

### Mini Project

Build a "logsummarize.sh" nginx log analyzer: A script that reads an nginx access log on stdin and prints the top 5 IP addresses by request count, the top 5 paths, and the total bytes transferred. It uses grep for status-code filtering, awk for aggregation, and sort + uniq for ranking. Suggested approach:
  - Use awk to extract client IP ($1) and request path (parsed from $7)
  - Pipe through sort | uniq -c | sort -rn | head -5 for rankings
  - Use awk's END block to sum the bytes field ($10) and print total
  - Add a --status 5xx flag using grep -E ' 5[0-9]{2} '
  - Bonus: add a --json flag that wraps output in JSON via printf

### Exercises

1. Use `grep -n TODO` on a codebase to list all TODOs with line numbers.
2. Use `sed -i.bak 's/localhost/127.0.0.1/g' file` and verify the .bak was created.
3. Write an awk one-liner that prints lines from /etc/passwd where the shell (last field) is /bin/bash.
4. Use `awk -F: '{sum+=$3} END {print sum}' /etc/passwd` to sum all UIDs.
5. Build a pipeline `grep ERROR log | sed 's/.*ERROR: //' | awk '{print $1}' | sort | uniq -c | sort -rn | head` and explain each stage.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which grep flag enables Extended Regular Expressions (ERE)?
9. A) -E (*)
10. B) -e
11. C) -r
12. D) -x
13. Explanation: grep -E uses ERE where + ? | () work unescaped; plain grep uses BRE where they need backslashes.
14. Q2: How do you make sed edit a file in place portably across GNU and BSD?
15. A) sed -i 's/x/y/' file
16. B) sed -i.bak 's/x/y/' file (*)
17. C) sed -inplace 's/x/y/' file
18. D) sed --inplace 's/x/y/' file
19. Explanation: GNU sed takes an optional -i arg; BSD sed requires one (even empty string). `-i.bak` works on both and gives you a backup.
20. Q3: What does `grep -q pattern file` do?
21. A) Prints quiet errors
22. B) Quotes the pattern
23. C) Exits 0 if pattern matches, 1 if not, with no output (*)
24. D) Counts matches quietly
25. Explanation: -q suppresses output and just returns an exit status; ideal for if/while conditions.
26. Q4: In awk, what is $NF?
27. A) The line number
28. B) The first field
29. C) A non-flag variable
30. D) The number of fields in the current line; with $ it's the LAST field's value (*)
31. Explanation: NF is the field count for the current record; $NF is the value of the last field (e.g. shell in /etc/passwd).
32. Q5: Which awk variable holds the current line number?
33. A) NR (*)
34. B) LN
35. C) LINE
36. D) $
37. Explanation: NR (Number of Records) is the count of records (lines) read so far; FNR is the count within the current file.
38. Q6: How do you sum column 2 of a file with awk?
39. A) awk '{sum+2}'
40. B) awk '{sum+=$2} END {print sum}' file (*)
41. C) awk 'sum $2'
42. D) awk '{print sum $2}'
43. Explanation: sum+=$2 accumulates per record; END runs after the last record, printing the total.
44. Q7: Which sed delimiter avoids escaping slashes in paths?
45. A) Only / works
46. B) Backslash only
47. C) Any non-slash char like | # @ or , (*)
48. D) Brackets []
49. Explanation: sed's s command accepts any single char as delimiter; common choices for paths are |, #, @, or , to avoid backslash-sprawl.
50. Q8: What does `sed '/^$/d'` do?
51. A) Deletes the d flag
52. B) Deletes the first line
53. C) Duplicates non-blank lines
54. D) Deletes all blank lines (*)
55. Explanation: `/^$/` matches empty lines (start followed immediately by end); `d` deletes them.
56. Q9: Which tool is BEST for "compute the average of column 3"?
57. A) awk (*)
58. B) grep
59. C) sed
60. D) cut
61. Explanation: awk is a small programming language with arithmetic and END blocks; grep filters, sed transforms, cut splits — none compute.
62. Q10: What does `grep -c pattern file` output?
63. A) The matched lines
64. B) The number of matching lines (*)
65. C) The character count
66. D) The byte count
67. Explanation: -c prints the COUNT of matching lines (not the lines themselves); combine with -o for per-match counts via wc -l.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which grep flag enables Extended Regular Expressions (ERE)?
  options:
    - "?"
    - -E
    - -e
    - -r
    - -x
  correctIndex: 1
  explanation: grep -E uses ERE where + ? | () work unescaped; plain grep uses BRE where they need backslashes.
- id: q2
  question: How do you make sed edit a file in place portably across GNU and BSD?
  options:
    - sed -i 's/x/y/' file
    - sed -i.bak 's/x/y/' file
    - sed -inplace 's/x/y/' file
    - sed --inplace 's/x/y/' file
  correctIndex: 1
  explanation: GNU sed takes an optional -i arg; BSD sed requires one (even empty string). `-i.bak` works on both and gives you a backup.
- id: q3
  question: What does `grep -q pattern file` do?
  options:
    - Prints quiet errors
    - Quotes the pattern
    - Exits 0 if pattern matches, 1 if not, with no output
    - Counts matches quietly
  correctIndex: 2
  explanation: -q suppresses output and just returns an exit status; ideal for if/while conditions.
- id: q4
  question: In awk, what is $NF?
  options:
    - The line number
    - The first field
    - A non-flag variable
    - The number of fields in the current line; with $ it's the LAST field's value
  correctIndex: 3
  explanation: NF is the field count for the current record; $NF is the value of the last field (e.g. shell in /etc/passwd).
- id: q5
  question: Which awk variable holds the current line number?
  options:
    - NR
    - LN
    - LINE
    - $
  correctIndex: 0
  explanation: NR (Number of Records) is the count of records (lines) read so far; FNR is the count within the current file.
- id: q6
  question: How do you sum column 2 of a file with awk?
  options:
    - awk '{sum+2}'
    - awk '{sum+=$2} END {print sum}' file
    - awk 'sum $2'
    - awk '{print sum $2}'
  correctIndex: 1
  explanation: sum+=$2 accumulates per record; END runs after the last record, printing the total.
- id: q7
  question: Which sed delimiter avoids escaping slashes in paths?
  options:
    - Only / works
    - Backslash only
    - "Any non-slash char like | # @ or ,"
    - Brackets []
  correctIndex: 2
  explanation: "sed's s command accepts any single char as delimiter; common choices for paths are |, #, @, or , to avoid backslash-sprawl."
- id: q8
  question: What does `sed '/^$/d'` do?
  options:
    - Deletes the d flag
    - Deletes the first line
    - Duplicates non-blank lines
    - Deletes all blank lines
  correctIndex: 3
  explanation: "`/^$/` matches empty lines (start followed immediately by end); `d` deletes them."
- id: q9
  question: Which tool is BEST for "compute the average of column 3"?
  options:
    - awk
    - grep
    - sed
    - cut
  correctIndex: 0
  explanation: awk is a small programming language with arithmetic and END blocks; grep filters, sed transforms, cut splits — none compute.
- id: q10
  question: What does `grep -c pattern file` output?
  options:
    - The matched lines
    - The number of matching lines
    - The character count
    - The byte count
  correctIndex: 1
  explanation: -c prints the COUNT of matching lines (not the lines themselves); combine with -o for per-match counts via wc -l.
```

