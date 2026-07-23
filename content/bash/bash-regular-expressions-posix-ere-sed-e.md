---
slug: bash-regular-expressions-posix-ere-sed-e
id: bash-15
track: bash
order: 15
title: Regular Expressions — POSIX ERE, sed -E
description: Master POSIX Extended Regular Expressions (ERE) with grep -E and sed -E, drive Bash's own =~ operator with BASH_REMATCH, and know when to reach for awk or perl instead.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=2800s
whyItMatters: Master POSIX Extended Regular Expressions (ERE) with grep -E and sed -E, drive Bash's own =~ operator with BASH_REMATCH, and know when to reach for awk or perl instead.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Regular Expressions — POSIX ERE, sed -E

## Regular Expressions — POSIX ERE, sed -E

### Why It Matters

Master POSIX Extended Regular Expressions (ERE) with grep -E and sed -E, drive Bash's own =~ operator with BASH_REMATCH, and know when to reach for awk or perl instead.

Master POSIX Extended Regular Expressions (ERE) with grep -E and sed -E, drive Bash's own =~ operator with BASH_REMATCH, and know when to reach for awk or perl instead.

### Prerequisites

- Stage 9: grep, sed, awk basics
- Stage 4: [[ ]] and the =~ operator

### Topics

- BRE vs ERE: when to use which
- ERE metacharacters: . * + ? ^ $ | ( ) [ ] { }
- Character classes: [[:alpha:]] [[:digit:]] [[:alnum:]] [[:space:]]
- Anchors and word boundaries: ^ $ \b \< \>
- Quantifiers: {n} {n,} {n,m}
- grep -E / sed -E / awk's ~ operator
- Bash =~ operator and BASH_REMATCH array
- When to use perl -pe instead of sed (lazy/greedy, lookahead)

### Key Concepts

- POSIX has two regex flavors: BRE (Basic, default for grep/sed — needs backslashes for + ? | ()) and ERE (Extended — uses them bare). Always prefer ERE for clarity.
- Anchors: ^ matches start of line, $ matches end. \b is word boundary (GNU extension; POSIX uses [[:<:]] and [[:>:]] in some impls).
- POSIX character classes [[:alpha:]] are more portable than Perl \w — use them in scripts that may run on BSD/macOS.
- Bash's =~ only works inside [[ ]]; the RHS regex is UNQUOTED (quoting makes it a literal); captures go into BASH_REMATCH[0] (whole match), [1], [2]... (groups).
- sed -E uses ERE; sed (no -E) uses BRE where ( ) + ? | need backslashes.
- For complex regex (lookahead, non-greedy, backreferences), use `perl -pe 's/.../.../g'` — sed/grep can't do these.

```bash
# IPv4-ish pattern (4 dotted decimals)
echo "192.168.1.1" | grep -E '^[0-9]{1,3}(\.[0-9]{1,3}){3}$'

# Email-ish pattern
echo "user@example.com" | grep -E '^[[:alnum:]._-]+@[[:alnum:]-]+\.[[:alpha:]]+$'

# Alternation
echo "error" | grep -E '^(error|warning|critical)$'

# Word boundary (GNU)
echo "the cat sat" | grep -E '\bcat\b'
```
Caption: grep -E with ERE

### Common Pitfalls

- Quoting the regex on the RHS of =~ — `[[ $s =~ "^[0-9]+$" ]]` makes it a literal string match, not a regex; leave the regex UNQUOTED.
- Forgetting that BASH_REMATCH[0] is the WHOLE match — [1], [2], ... are the capture groups; off-by-one is common.
- Using \d \w \s in grep/sed — these are Perl extensions, not POSIX; use [0-9], [[:alnum:]_], [[:space:]] for portability.
- Expecting .* to be non-greedy — POSIX regex is always greedy; use [^x]* (negated class) for "up to x" or perl's *?.
- Forgetting that grep -E and sed -E use ERE while grep/sed default to BRE — `\+` works in BRE but `+` doesn't; in ERE it's the reverse.

### Real-World Applications

- Logrotate's config parser uses sed -E to extract directives from /etc/logrotate.d/*.
- AWS CLI's output filters use grep -E for `--query` shorthand patterns.
- Git's `prepare-commit-msg` hook templates use sed -E to strip branch-prefix from auto-generated messages (e.g. "feature/foo" -> "foo").
- The Linux kernel's `scripts/extract-vmlinux` uses awk + sed -E to parse ELF headers.

### Interview Questions

- 1. What's the difference between BRE and ERE? — BRE (default for grep/sed) needs backslashes for + ? | (); ERE (grep -E, sed -E) uses them bare. ERE is more readable.
- 2. Why must the RHS of =~ be unquoted in [[ ]]? — Quoting makes it a literal string match (== with glob), not a regex; unquoted, it's interpreted as a regex.
- 3. What is BASH_REMATCH? — An array where [0] is the whole match and [1], [2], ... are capture groups from the most recent =~ operation.
- 4. Are \d \w \s portable in grep/sed? — No, they're Perl extensions; POSIX uses [0-9], [[:alnum:]_], [[:space:]] — use these in portable scripts.
- 5. When should you reach for perl instead of sed? — For non-greedy quantifiers (*?), lookahead/lookbehind, backreferences, or Unicode character classes — POSIX can't do these.

### Mini Project

Build a "log_parser.sh" structured log extractor: A script that reads an nginx/apache combined log on stdin and emits CSV with fields (timestamp, method, path, status, bytes, client_ip). It uses sed -E for cleanup and Bash =~ for the main parse. Suggested approach:
  - Define a regex matching the combined log format
  - Use [[ $line =~ $regex ]] and pull fields from BASH_REMATCH[1..N]
  - Skip lines that don't match (continue)
  - Use sed -E to strip the [ ] around the timestamp and convert it to ISO
  - Output comma-separated fields via printf
  - Add a --json flag that wraps fields in JSON objects

### Exercises

1. Use `grep -E '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'` to validate ISO dates.
2. Use `sed -E 's/(\w+)@(\w+)/\2\/\1/'` to swap user and domain in an email.
3. Use `[[ $phone =~ ^\+?[0-9 -]{7,15}$ ]]` to validate a phone number.
4. Extract the year from "2024-03-15" using =~ and BASH_REMATCH[1].
5. Use `perl -pe 's/\d+/X/g'` to redact all numbers from a file.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which grep flag enables Extended Regular Expressions (ERE)?
9. A) -e
10. B) -r
11. C) -E (*)
12. D) -x
13. Explanation: grep -E uses ERE where + ? | () {} work unescaped; plain grep uses BRE where they need backslashes.
14. Q2: Why must the RHS of `[[ $s =~ regex ]]` be unquoted?
15. A) For performance
16. B) Quotes are syntax errors in [[ ]]
17. C) Quotes disable regex capture
18. D) Quoting makes it a literal string match, not a regex (*)
19. Explanation: Quoted, the RHS is treated as a string for == comparison; unquoted, it's interpreted as a regex. Use a variable to store complex regexes: `re='^[0-9]+$'; [[ $s =~ $re ]]`.
20. Q3: What is BASH_REMATCH[0]?
21. A) The whole match (*)
22. B) The first capture group
23. C) The unmatched portion
24. D) The regex source
25. Explanation: BASH_REMATCH[0] is the entire match; [1], [2], ... are the capture groups in order. The array is set after every successful =~.
26. Q4: Which is the POSIX-portable equivalent of Perl's \d?
27. A) \d
28. B) [0-9] or [[:digit:]] (*)
29. C) \D
30. D) [digits]
31. Explanation: \d is a Perl extension not in POSIX; use [0-9] or [[:digit:]] for portability across grep/sed/awk on all platforms.
32. Q5: Which sed flag enables Extended Regular Expressions?
33. A) -e
34. B) -r (GNU alias for -E)
35. C) -E (*)
36. D) Both B and C
37. Explanation: Both B and C are correct (-E is POSIX, -r is the GNU alias); they are equivalent. The standard answer is -E.
38. Q6: Are POSIX regexes greedy by default?
39. A) No, they are lazy
40. B) Only in BRE
41. C) Only in ERE
42. D) Yes, * and + match as much as possible (*)
43. Explanation: POSIX quantifiers are greedy — they match the longest possible string. For "up to X" use a negated class like [^,]*, or use perl with *?.
44. Q7: What does the `^` anchor match?
45. A) The start of the line (or string with -m) (*)
46. B) The end of the line
47. C) A negation in a class only
48. D) The literal ^ character
49. Explanation: Outside a character class, ^ matches the start of the line (or string in some tools). Inside [^...], it negates the class.
50. Q8: Which character class matches any whitespace in POSIX ERE?
51. A) \s
52. B) [[:space:]] (*)
53. C) \w
54. D) [space]
55. Explanation: \s is Perl-only; POSIX uses [[:space:]] which matches space, tab, newline, etc., portably across grep/sed/awk.
56. Q9: How do you capture a group in sed -E?
57. A) Use \( \)
58. B) Use $1 $2
59. C) Use ( ) and reference with \1, \2, ... (*)
60. D) Capture is automatic
61. Explanation: In sed -E, ( ) create a capture group; reference in the replacement with \1, \2, etc. (In BRE you'd use \( \).)
62. Q10: When should you use perl instead of sed?
63. A) Never
64. B) Only on Linux
65. C) Only with root
66. D) For non-greedy quantifiers (*?), lookahead/lookbehind, or backreferences — POSIX can't do these (*)
67. Explanation: POSIX regex lacks non-greedy quantifiers, lookahead/lookbehind, and backreferences; perl supports them all. `perl -pe 's/.../.../g'` is the escape hatch.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which grep flag enables Extended Regular Expressions (ERE)?
  options:
    - "?"
    - -e
    - -r
    - -E
    - -x
  correctIndex: 3
  explanation: grep -E uses ERE where + ? | () {} work unescaped; plain grep uses BRE where they need backslashes.
- id: q2
  question: Why must the RHS of `[[ $s =~ regex ]]` be unquoted?
  options:
    - For performance
    - Quotes are syntax errors in [[ ]]
    - Quotes disable regex capture
    - Quoting makes it a literal string match, not a regex
  correctIndex: 3
  explanation: "Quoted, the RHS is treated as a string for == comparison; unquoted, it's interpreted as a regex. Use a variable to store complex regexes: `re='^[0-9]+$'; [[ $s =~ $re ]]`."
- id: q3
  question: What is BASH_REMATCH[0]?
  options:
    - The whole match
    - The first capture group
    - The unmatched portion
    - The regex source
  correctIndex: 0
  explanation: BASH_REMATCH[0] is the entire match; [1], [2], ... are the capture groups in order. The array is set after every successful =~.
- id: q4
  question: Which is the POSIX-portable equivalent of Perl's \d?
  options:
    - \d
    - "[0-9] or [[:digit:]]"
    - \D
    - "[digits]"
  correctIndex: 1
  explanation: \d is a Perl extension not in POSIX; use [0-9] or [[:digit:]] for portability across grep/sed/awk on all platforms.
- id: q5
  question: Which sed flag enables Extended Regular Expressions?
  options:
    - -e
    - -r (GNU alias for -E)
    - -E
    - Both B and C
  correctIndex: 2
  explanation: Both B and C are correct (-E is POSIX, -r is the GNU alias); they are equivalent. The standard answer is -E.
- id: q6
  question: Are POSIX regexes greedy by default?
  options:
    - No, they are lazy
    - Only in BRE
    - Only in ERE
    - Yes, * and + match as much as possible
  correctIndex: 3
  explanation: POSIX quantifiers are greedy — they match the longest possible string. For "up to X" use a negated class like [^,]*, or use perl with *?.
- id: q7
  question: What does the `^` anchor match?
  options:
    - The start of the line (or string with -m)
    - The end of the line
    - A negation in a class only
    - The literal ^ character
  correctIndex: 0
  explanation: Outside a character class, ^ matches the start of the line (or string in some tools). Inside [^...], it negates the class.
- id: q8
  question: Which character class matches any whitespace in POSIX ERE?
  options:
    - \s
    - "[[:space:]]"
    - \w
    - "[space]"
  correctIndex: 1
  explanation: \s is Perl-only; POSIX uses [[:space:]] which matches space, tab, newline, etc., portably across grep/sed/awk.
- id: q9
  question: How do you capture a group in sed -E?
  options:
    - Use \( \)
    - Use $1 $2
    - Use ( ) and reference with \1, \2, ...
    - Capture is automatic
  correctIndex: 2
  explanation: In sed -E, ( ) create a capture group; reference in the replacement with \1, \2, etc. (In BRE you'd use \( \).)
- id: q10
  question: When should you use perl instead of sed?
  options:
    - Never
    - Only on Linux
    - Only with root
    - For non-greedy quantifiers (*?), lookahead/lookbehind, or backreferences — POSIX can't do these
  correctIndex: 3
  explanation: POSIX regex lacks non-greedy quantifiers, lookahead/lookbehind, and backreferences; perl supports them all. `perl -pe 's/.../.../g'` is the escape hatch.
```

