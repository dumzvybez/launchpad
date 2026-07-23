---
slug: bash-cli-argument-parsing-getopts-manual-parsing
id: bash-17
track: bash
order: 17
title: CLI Argument Parsing — getopts, manual parsing
description: Parse command-line arguments with getopts for short flags, hand-roll long options (--help) with a while loop, and structure subcommands (git-style) cleanly.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=3200s
whyItMatters: Parse command-line arguments with getopts for short flags, hand-roll long options (--help) with a while loop, and structure subcommands (git-style) cleanly.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# CLI Argument Parsing — getopts, manual parsing

## CLI Argument Parsing — getopts, manual parsing

### Why It Matters

Parse command-line arguments with getopts for short flags, hand-roll long options (--help) with a while loop, and structure subcommands (git-style) cleanly.

Parse command-line arguments with getopts for short flags, hand-roll long options (--help) with a while loop, and structure subcommands (git-style) cleanly.

### Prerequisites

- Stage 1-16: all prior Bash concepts
- Comfort with shift and "$@"

### Topics

- getopts "abc:" OPT — short-flag parsing
- OPTIND and OPTARG; resetting OPTIND for multiple getopts passes
- Manual parsing: while (( $# > 0 )); do case "$1" in ...
- Long options: --help, --output=FILE, --output FILE
- The -- separator (end of options)
- Subcommand dispatch (git-style): myapp deploy, myapp rollback
- Help generation and exit codes (0 ok, 1 usage error, 2 bad args)

### Key Concepts

- getopts only handles short flags (-a, -b value); it cannot do --long without manual work.
- The "abc:" syntax means: -a and -b take no arg, -c takes an arg (the trailing colon). A leading colon `:` in the optstring enables silent error reporting.
- getopts is POSIX-standard; the older `getopt` (external binary) is broken on BSD and should be avoided.
- Manual parsing with `while (( $# > 0 )); do case "$1" in --help) ...;; --output) shift; out=$1;; --output=*) out=${1#*=};; esac; shift; done` handles --long.
- The `--` separator marks the end of options; everything after is treated as positional args (e.g. `rm -- --weird-filename`).
- Standard exit codes for CLIs: 0 = success, 1 = generic error, 2 = usage/argument error (getopts uses 2).

### Common Pitfalls

- Using `getopt` (the external binary) instead of `getopts` (the builtin) — getopt is broken on BSD, can't handle spaces in args reliably, and is deprecated. Always use getopts.
- Forgetting to `shift $((OPTIND - 1))` after getopts — without it, $@ still contains the parsed options, breaking positional args.
- Not resetting OPTIND when calling getopts twice — OPTIND is global; if you parse options twice (e.g. in a subcommand), reset: `OPTIND=1` before the second pass.
- Confusing `--opt value` (two args) with `--opt=value` (one arg) — manual parsing must handle BOTH; use case patterns `--opt)` (shift 2) and `--opt=*)` (extract with ${1#*=}).
- Using exit 1 for usage errors — convention is exit 2 for argument errors (so callers can distinguish "bad args" from "command failed"); getopts itself exits 2 on bad input.

### Real-World Applications

- Git's CLI is the canonical example of subcommand dispatch in C; many tools (kubectl, docker, gcloud) mimic its style.
- The homebrew `brew` command uses a mix of getopts (in older scripts) and manual parsing for subcommands like `brew install --HEAD --verbose foo`.
- AWS CLI v2 uses argparse under the hood but its install script uses manual Bash parsing for --install-dir, -u, etc.
- The Linux kernel's `scripts/` tools use manual parsing with case to handle -h, --help, and -- separator consistently.

### Interview Questions

- 1. What's the difference between `getopts` and `getopt`? — getopts is a Bash builtin (POSIX, reliable); getopt is an external binary that's broken on BSD and unreliable with spaces. Always use getopts.
- 2. What does the colon in `"abc:"` mean in a getopts optstring? — A trailing colon after an option letter means the option takes an argument (stored in $OPTARG). A LEADING colon enables silent error reporting (you handle ? and : cases).
- 3. How do you handle --long options in Bash? — getopts can't; write a manual `while (( $# > 0 )); do case "$1" in --long) ...;; --long=*) val=${1#*=};; esac; shift; done` loop.
- 4. What is the `--` separator for? — Marks end of options; everything after is positional, even if it starts with -. Critical for `rm -- --weird-file`.
- 5. What exit code convention should a CLI follow for argument errors? — 0 = success, 1 = generic runtime error, 2 = usage / argument error; this matches getopts and lets callers distinguish bad-invocation from runtime failures.

### Mini Project

Build a "todo.sh" CLI: A simple todo list CLI with subcommands (add, list, done, remove) and options (--priority, --verbose). It stores todos in a flat file (~/.todos.tsv) with tab-separated fields (id, priority, text, status). Suggested approach:
  - Subcommand dispatch via case on $1; shift before passing to subcommand functions
  - Use manual parsing in each subcommand for --priority and -v flags
  - add: append a row with auto-incrementing ID and status=pending
  - list: read with `while IFS=$'\t' read -r id pri text status`; print formatted
  - done: mark a row's status=done via sed -i or awk in-place rewrite
  - Add a -h/--help flag and a usage() function with exit codes (0 ok, 2 bad args)

### Exercises

1. Use getopts to parse `-v` and `-n NAME` and verify they're consumed from $@.
2. After getopts, print `"$@"` and verify only positional args remain.
3. Write a manual parser for `--output FILE` (two args) and `--output=FILE` (one arg); test both.
4. Add a `--` separator to your parser and verify `myapp -- --file` treats `--file` as positional.
5. Build a 3-subcommand CLI (init, run, clean) that dispatches with case and exits 2 on unknown commands.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is the recommended tool for parsing short options in Bash?
9. A) getopts (Bash builtin) (*)
10. B) getopt (external binary)
11. C) argparse
12. D) shift loop with case
13. Explanation: getopts is a POSIX Bash builtin, reliable across platforms; getopt is an external binary that's broken on BSD and mishandles spaces. Always use getopts.
14. Q2: What does a trailing colon mean in a getopts optstring like `"abc:"`?
15. A) -c takes no argument
16. B) -c takes an argument (stored in OPTARG) (*)
17. C) -c is required
18. D) -c is silent
19. Explanation: A colon after an option letter means it requires an argument; the value is in $OPTARG. A leading colon in the optstring enables silent error reporting.
20. Q3: After getopts finishes, what must you do to get the remaining positional args?
21. A) Nothing; $@ is already clean
22. B) shift $OPTIND
23. C) shift $((OPTIND - 1)) (*)
24. D) unset OPTIND
25. Explanation: OPTIND is the index of the next arg to process; `shift $((OPTIND - 1))` removes the parsed options, leaving only positionals in $@.
26. Q4: Can getopts parse --long options?
27. A) Yes, natively
28. B) Only with -l flag
29. C) Only in Bash 5+
30. D) No — you must write a manual while/case loop (*)
31. Explanation: getopts is short-flag only; for --long options write a manual `while (( $# > 0 )); do case "$1" in --long) ...; esac; shift; done` loop.
32. Q5: What does the `--` separator do in argument parsing?
33. A) Marks end of options; everything after is positional even if it starts with - (*)
34. B) Comments the rest of the line
35. C) Required by POSIX
36. D) Disables shell globbing
37. Explanation: `--` tells the parser "no more options follow". Critical for `rm -- --weird-filename` (treats the file starting with - as a positional arg).
38. Q6: What exit code should a CLI use for an argument error?
39. A) 0
40. B) 2 (*)
41. C) 1
42. D) 127
43. Explanation: Convention: 0 = success, 1 = runtime error, 2 = usage / argument error. This matches getopts' behavior and lets callers distinguish bad-invocation from runtime failures.
44. Q7: How do you handle both `--output FILE` (two args) and `--output=FILE` (one arg)?
45. A) Only one form works; pick one
46. B) Use a regex
47. C) Two case patterns: --output) shift 2 ;; and --output=*) val=${1#*=} ;; (*)
48. D) It's impossible in pure Bash
49. Explanation: Two case branches: `--output)` takes the next arg (shift 2); `--output=*)` strips the prefix with `${1#*=}` (shift 1). Both forms are common, handle both.
50. Q8: How do you dispatch subcommands like git (myapp deploy, myapp rollback)?
51. A) if/elif on $1
52. B) function dispatch
53. C) Bash doesn't support subcommands
54. D) case "$1" in deploy) deploy_cmd "$@" ;; ... (*)
55. Explanation: A case statement on $1 (then shift to remove it) is the standard pattern; pass remaining "$@" to the subcommand function.
56. Q9: Why reset OPTIND to 1 before a second getopts pass?
57. A) OPTIND is global and persists; without resetting, the second pass starts where the first left off (*)
58. B) OPTIND is read-only
59. C) OPTIND resets automatically
60. D) For performance
61. Explanation: OPTIND is global state; if you call getopts again (e.g. for subcommand options), reset OPTIND=1 so it starts parsing from the beginning of $@.
62. Q10: Which colon placement in an optstring enables SILENT error reporting (letting you handle ? and : yourself)?
63. A) Trailing colon
64. B) Leading colon: ":abc:" (*)
65. C) No colon
66. D) Double colon :: after each letter
67. Explanation: A leading colon `":abc:"` makes getopts silent: unknown options set opt to `?` (you handle), and missing-argument cases set opt to `:` (you handle). Without it, getopts prints its own error message.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is the recommended tool for parsing short options in Bash?
  options:
    - getopts (Bash builtin)
    - getopt (external binary)
    - argparse
    - shift loop with case
  correctIndex: 0
  explanation: getopts is a POSIX Bash builtin, reliable across platforms; getopt is an external binary that's broken on BSD and mishandles spaces. Always use getopts.
- id: q2
  question: What does a trailing colon mean in a getopts optstring like `"abc:"`?
  options:
    - -c takes no argument
    - -c takes an argument (stored in OPTARG)
    - -c is required
    - -c is silent
  correctIndex: 1
  explanation: A colon after an option letter means it requires an argument; the value is in $OPTARG. A leading colon in the optstring enables silent error reporting.
- id: q3
  question: After getopts finishes, what must you do to get the remaining positional args?
  options:
    - Nothing; $@ is already clean
    - shift $OPTIND
    - shift $((OPTIND - 1))
    - unset OPTIND
  correctIndex: 2
  explanation: OPTIND is the index of the next arg to process; `shift $((OPTIND - 1))` removes the parsed options, leaving only positionals in $@.
- id: q4
  question: Can getopts parse --long options?
  options:
    - Yes, natively
    - Only with -l flag
    - Only in Bash 5+
    - No — you must write a manual while/case loop
  correctIndex: 3
  explanation: getopts is short-flag only; for --long options write a manual `while (( $# > 0 )); do case "$1" in --long) ...; esac; shift; done` loop.
- id: q5
  question: What does the `--` separator do in argument parsing?
  options:
    - Marks end of options; everything after is positional even if it starts with -
    - Comments the rest of the line
    - Required by POSIX
    - Disables shell globbing
  correctIndex: 0
  explanation: '`--` tells the parser "no more options follow". Critical for `rm -- --weird-filename` (treats the file starting with - as a positional arg).'
- id: q6
  question: What exit code should a CLI use for an argument error?
  options:
    - "0"
    - "2"
    - "1"
    - "127"
  correctIndex: 1
  explanation: "Convention: 0 = success, 1 = runtime error, 2 = usage / argument error. This matches getopts' behavior and lets callers distinguish bad-invocation from runtime failures."
- id: q7
  question: How do you handle both `--output FILE` (two args) and `--output=FILE` (one arg)?
  options:
    - Only one form works; pick one
    - Use a regex
    - "Two case patterns: --output) shift 2 ;; and --output=*) val=${1#*=} ;;"
    - It's impossible in pure Bash
  correctIndex: 2
  explanation: "Two case branches: `--output)` takes the next arg (shift 2); `--output=*)` strips the prefix with `${1#*=}` (shift 1). Both forms are common, handle both."
- id: q8
  question: How do you dispatch subcommands like git (myapp deploy, myapp rollback)?
  options:
    - if/elif on $1
    - function dispatch
    - Bash doesn't support subcommands
    - case "$1" in deploy) deploy_cmd "$@" ;; ...
  correctIndex: 3
  explanation: A case statement on $1 (then shift to remove it) is the standard pattern; pass remaining "$@" to the subcommand function.
- id: q9
  question: Why reset OPTIND to 1 before a second getopts pass?
  options:
    - OPTIND is global and persists; without resetting, the second pass starts where the first left off
    - OPTIND is read-only
    - OPTIND resets automatically
    - For performance
  correctIndex: 0
  explanation: OPTIND is global state; if you call getopts again (e.g. for subcommand options), reset OPTIND=1 so it starts parsing from the beginning of $@.
- id: q10
  question: "Which colon placement in an optstring enables SILENT error reporting (letting you handle ? and : yourself)?"
  options:
    - Trailing colon
    - 'Leading colon: ":abc:"'
    - No colon
    - "Double colon :: after each letter"
  correctIndex: 1
  explanation: 'A leading colon `":abc:"` makes getopts silent: unknown options set opt to `?` (you handle), and missing-argument cases set opt to `:` (you handle). Without it, getopts prints its own error message.'
```

