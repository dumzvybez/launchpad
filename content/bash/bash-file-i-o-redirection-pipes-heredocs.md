---
slug: bash-file-i-o-redirection-pipes-heredocs
id: bash-08
track: bash
order: 8
title: File I/O — Redirection, Pipes, Heredocs
description: Master Bash's I/O model — file descriptors, redirection, heredocs, herestrings, process substitution, and the `exec` trick for opening persistent file descriptors.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=1400s
whyItMatters: Master Bash's I/O model — file descriptors, redirection, heredocs, herestrings, process substitution, and the `exec` trick for opening persistent file descriptors.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# File I/O — Redirection, Pipes, Heredocs

## File I/O — Redirection, Pipes, Heredocs

### Why It Matters

Master Bash's I/O model — file descriptors, redirection, heredocs, herestrings, process substitution, and the `exec` trick for opening persistent file descriptors.

Master Bash's I/O model — file descriptors, redirection, heredocs, herestrings, process substitution, and the `exec` trick for opening persistent file descriptors.

### Prerequisites

- Stage 1-7: variables, functions, arrays
- Basic familiarity with stdin/stdout/stderr

### Topics

- Standard streams: 0=stdin, 1=stdout, 2=stderr
- Output redirection: > >> >|  &>
- Input redirection: < and <<
- Combining streams: 2>&1 (and ordering matters!)
- Heredoc <<EOF vs <<'EOF' (quoted = no interpolation)
- Herestring <<<"$var"
- Process substitution: <(cmd) and >(cmd)
- exec N>file, exec N<&- for persistent file descriptors

### Key Concepts

- Bash processes redirections LEFT to RIGHT: `cmd 2>&1 >file` redirects stderr to the OLD stdout (terminal), then stdout to file; the common bug. Use `cmd >file 2>&1` or `cmd &>file`.
- &>file is Bash shorthand for `>file 2>&1`; not POSIX-portable but very common.
- <<'EOF' (with quoted delimiter) disables variable and command substitution inside the heredoc; <<EOF (unquoted) interpolates $vars and $(cmds).
- Process substitution <(cmd) creates a temporary named pipe (/dev/fd/NN) — useful for diffing two command outputs without temp files.
- `exec 3>file` opens fd 3 for writing and keeps it open for the rest of the script; close with `exec 3>&-`.
- /dev/tcp/HOST/PORT and /dev/udp/HOST/PORT (Bash-only) give raw TCP/UDP sockets without netcat.

```bash
echo "to stdout"
echo "to stderr" >&2

# Overwrite vs append
echo "line1" > out.log
echo "line2" >> out.log

# Capture both stdout and stderr (ordering matters!)
cmd >all.log 2>&1     # correct
cmd 2>&1 >all.log     # WRONG: stderr still goes to terminal
cmd &>all.log         # Bash shorthand (not POSIX)
```
Caption: Redirection basics

### Common Pitfalls

- Writing `cmd 2>&1 >file` expecting both streams in file — stderr goes to terminal because 2>&1 runs BEFORE >file; reorder to `cmd >file 2>&1`.
- Forgetting to quote heredoc delimiter when you want literal text — `<<EOF` interpolates $vars and $(cmds); use `<<'EOF'` for literal.
- Not closing file descriptors opened with `exec N>file` — fds leak to child processes and can cause "too many open files" in loops; close with `exec N>&-`.
- Using /dev/tcp and assuming it's portable — it's a Bash-only virtual file (no actual /dev/tcp on disk); dash, zsh, and most other shells don't support it.
- Writing to a file with > that already exists — `>` silently truncates; use `>|` to force truncate even with noclobber set, or `set -o noclobber` to make > fail on existing files.

### Real-World Applications

- The Docker entrypoint scripts use `exec 3>/tmp/init.log` for persistent debug logging that survives the container's main process.
- The Git pre-commit framework pipes file lists via process substitution to linters: `eslint <(git diff --cached --name-only | grep .js$)`.
- The Linux kernel's `make` uses 2>&1 redirection throughout build scripts to merge compiler diagnostics into the build log.
- Kubernetes's kubeadm uses heredocs to write generated config files (kubelet.service, /etc/kubernetes/*.yaml) atomically.

### Interview Questions

- 1. What's the difference between `cmd 2>&1 >file` and `cmd >file 2>&1`? — In the first, stderr goes to terminal because 2>&1 runs before stdout is redirected; in the second, both end up in file. Order matters.
- 2. What does `<<'EOF'` do differently from `<<EOF`? — Quoting the delimiter disables $var and $(cmd) substitution inside the heredoc; the body is literal.
- 3. What's a herestring and when would you use it? — `<<<"$var"` feeds a variable as a single line of stdin to a command, without needing echo or a temp file: `grep pattern <<<"$text"`.
- 4. What does process substitution `<(cmd)` create? — A temporary file-like object (often /dev/fd/NN or a named pipe) that another command can read as if it were a file.
- 5. How do you open fd 3 for writing and keep it open? — `exec 3>/tmp/log`; subsequent `echo ... >&3` writes to it; close with `exec 3>&-`.

### Mini Project

Build a "logsplit.sh" stream demultiplexer: A script that reads mixed log lines on stdin and writes INFO lines to stdout, WARN to stderr, and ERROR to a file (errors.log) AND stderr. It uses fd redirection to keep all three streams open. Suggested approach:
  - Use `while IFS= read -r line` to consume stdin
  - Use case to classify by level prefix (INFO/WARN/ERROR)
  - Open fd 3 with `exec 3>errors.log` for persistent error-file writes
  - Use `echo "$line" >&1` (stdout), `>&2` (stderr), `>&3` (file) appropriately
  - Close fd 3 with `exec 3>&-` on EXIT trap

### Exercises

1. Run `ls /nonexistent >out 2>&1` and verify out contains the error message.
2. Use a heredoc with `<<'EOF'` to print literal text containing $VAR; then unquote and observe interpolation.
3. Use `grep foo <<<"$myvar"` to search a variable's contents without echo.
4. Open fd 4 to /tmp/notes with `exec 4>`, write 3 lines, close with `exec 4>&-`, then cat the file.
5. Use process substitution to `diff <(seq 1 5) <(seq 1 6)` and explain the output.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which redirection order sends both stdout and stderr to a file?
9. A) cmd 2>&1 >file
10. B) cmd 2>file 1>file
11. C) cmd >file, 2>&1
12. D) cmd >file 2>&1 (*)
13. Explanation: Redirections are processed left to right; `>file 2>&1` first redirects stdout to file, then points stderr at the (now-file) stdout. The reverse order sends stderr to the terminal.
14. Q2: What does `<<'EOF'` do compared to `<<EOF`?
15. A) Quoted delimiter disables variable and command substitution (*)
16. B) No difference
17. C) Quoted delimiter enables substitution
18. D) Quoted delimiter removes blank lines
19. Explanation: Quoting the heredoc delimiter (single or double quotes) makes the body literal — no $var or $(cmd) interpolation.
20. Q3: What is `<<<"$var"` called?
21. A) Heredoc
22. B) Herestring (*)
23. C) Here-pipe
24. D) Variable redirect
25. Explanation: A herestring feeds a single variable's value as one line of stdin to a command — useful for `grep pattern <<<"$text"` without spawning echo.
26. Q4: What does `<(cmd)` produce?
27. A) A subshell
28. B) A copy of cmd's output to a temp file always
29. C) A file-like object (often /dev/fd/NN) reading from cmd's stdout (*)
30. D) A backgrounded cmd
31. Explanation: Process substitution creates a FIFO/pipe that appears as a path like /dev/fd/63; another command can read it as if it were a file.
32. Q5: What are the three standard streams' file descriptor numbers?
33. A) 1=stdin 2=stdout 3=stderr
34. B) 0=stdout 1=stdin 2=stderr
35. C) 0=stderr 1=stdin 2=stdout
36. D) 0=stdin 1=stdout 2=stderr (*)
37. Explanation: fd 0 is stdin, fd 1 is stdout, fd 2 is stderr — POSIX convention shared by every process.
38. Q6: What does `exec 3>file` do?
39. A) Opens fd 3 for writing to file, persistently until closed (*)
40. B) Replaces the shell with file
41. C) Runs file with 3 arguments
42. D) Truncates file 3 times
43. Explanation: `exec N>file` (with N != 0 and no command) opens fd N for the rest of the script; close with `exec N>&-`.
44. Q7: Which is the Bash shorthand for `>file 2>&1`?
45. A) >&&2 file
46. B) &>file (*)
47. C) >> file 2
48. D) |&file
49. Explanation: `&>file` (and `&>>file` for append) is Bash-only shorthand; not POSIX-portable but very common in scripts.
50. Q8: What does `set -o noclobber` do?
51. A) Prevents file deletion
52. B) Forces truncation
53. C) Prevents overwriting existing files with > (*)
54. D) Disables pipes
55. Explanation: With noclobber set, `>existing` fails; use `>|` to force truncation despite noclobber.
56. Q9: Why might `cat /dev/tcp/google.com/80` fail in dash?
57. A) dash doesn't have cat
58. B) dash can't open sockets for security
59. C) Google blocks dash
60. D) /dev/tcp is a Bash-only virtual file, not a real device node (*)
61. Explanation: /dev/tcp and /dev/udp are Bash-only virtual filesystem hooks; no actual file exists at that path, so other shells (dash, zsh) fail.
62. Q10: What happens if you forget to close an fd opened with `exec 3>file`?
63. A) The fd leaks to child processes and can exhaust the fd table in long loops (*)
64. B) Nothing — Bash closes it automatically
65. C) The file is deleted
66. D) Bash crashes
67. Explanation: Unclosed fds persist for the script's lifetime and are inherited by children; in loops that spawn children, this can exhaust the per-process fd limit.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which redirection order sends both stdout and stderr to a file?
  options:
    - cmd 2>&1 >file
    - cmd 2>file 1>file
    - cmd >file, 2>&1
    - cmd >file 2>&1
  correctIndex: 3
  explanation: Redirections are processed left to right; `>file 2>&1` first redirects stdout to file, then points stderr at the (now-file) stdout. The reverse order sends stderr to the terminal.
- id: q2
  question: What does `<<'EOF'` do compared to `<<EOF`?
  options:
    - Quoted delimiter disables variable and command substitution
    - No difference
    - Quoted delimiter enables substitution
    - Quoted delimiter removes blank lines
  correctIndex: 0
  explanation: Quoting the heredoc delimiter (single or double quotes) makes the body literal — no $var or $(cmd) interpolation.
- id: q3
  question: What is `<<<"$var"` called?
  options:
    - Heredoc
    - Herestring
    - Here-pipe
    - Variable redirect
  correctIndex: 1
  explanation: A herestring feeds a single variable's value as one line of stdin to a command — useful for `grep pattern <<<"$text"` without spawning echo.
- id: q4
  question: What does `<(cmd)` produce?
  options:
    - A subshell
    - A copy of cmd's output to a temp file always
    - A file-like object (often /dev/fd/NN) reading from cmd's stdout
    - A backgrounded cmd
  correctIndex: 2
  explanation: Process substitution creates a FIFO/pipe that appears as a path like /dev/fd/63; another command can read it as if it were a file.
- id: q5
  question: What are the three standard streams' file descriptor numbers?
  options:
    - 1=stdin 2=stdout 3=stderr
    - 0=stdout 1=stdin 2=stderr
    - 0=stderr 1=stdin 2=stdout
    - 0=stdin 1=stdout 2=stderr
  correctIndex: 3
  explanation: fd 0 is stdin, fd 1 is stdout, fd 2 is stderr — POSIX convention shared by every process.
- id: q6
  question: What does `exec 3>file` do?
  options:
    - Opens fd 3 for writing to file, persistently until closed
    - Replaces the shell with file
    - Runs file with 3 arguments
    - Truncates file 3 times
  correctIndex: 0
  explanation: "`exec N>file` (with N != 0 and no command) opens fd N for the rest of the script; close with `exec N>&-`."
- id: q7
  question: Which is the Bash shorthand for `>file 2>&1`?
  options:
    - ">&&2 file"
    - "&>file"
    - ">> file 2"
    - "|&file"
  correctIndex: 1
  explanation: "`&>file` (and `&>>file` for append) is Bash-only shorthand; not POSIX-portable but very common in scripts."
- id: q8
  question: What does `set -o noclobber` do?
  options:
    - Prevents file deletion
    - Forces truncation
    - Prevents overwriting existing files with >
    - Disables pipes
  correctIndex: 2
  explanation: With noclobber set, `>existing` fails; use `>|` to force truncation despite noclobber.
- id: q9
  question: Why might `cat /dev/tcp/google.com/80` fail in dash?
  options:
    - dash doesn't have cat
    - dash can't open sockets for security
    - Google blocks dash
    - /dev/tcp is a Bash-only virtual file, not a real device node
  correctIndex: 3
  explanation: /dev/tcp and /dev/udp are Bash-only virtual filesystem hooks; no actual file exists at that path, so other shells (dash, zsh) fail.
- id: q10
  question: What happens if you forget to close an fd opened with `exec 3>file`?
  options:
    - The fd leaks to child processes and can exhaust the fd table in long loops
    - Nothing — Bash closes it automatically
    - The file is deleted
    - Bash crashes
  correctIndex: 0
  explanation: Unclosed fds persist for the script's lifetime and are inherited by children; in loops that spawn children, this can exhaust the per-process fd limit.
```

