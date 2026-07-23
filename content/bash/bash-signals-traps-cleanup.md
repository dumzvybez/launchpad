---
slug: bash-signals-traps-cleanup
id: bash-12
track: bash
order: 12
title: Signals, Traps, and Cleanup
description: Catch and handle signals (SIGINT, SIGTERM, SIGHUP) with trap, implement cleanup functions, and write scripts that play nicely with init systems and Ctrl-C.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=2200s
whyItMatters: Catch and handle signals (SIGINT, SIGTERM, SIGHUP) with trap, implement cleanup functions, and write scripts that play nicely with init systems and Ctrl-C.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Signals, Traps, and Cleanup

## Signals, Traps, and Cleanup

### Why It Matters

Catch and handle signals (SIGINT, SIGTERM, SIGHUP) with trap, implement cleanup functions, and write scripts that play nicely with init systems and Ctrl-C.

Catch and handle signals (SIGINT, SIGTERM, SIGHUP) with trap, implement cleanup functions, and write scripts that play nicely with init systems and Ctrl-C.

### Prerequisites

- Stage 11: exit codes, set -e, trap EXIT
- Understanding of background processes ($!)

### Topics

- Common signals: HUP, INT, QUIT, TERM, KILL, USR1, USR2
- `trap 'handler' SIGNAL ...` syntax
- trap EXIT (fires on any exit), trap ERR (fires on uncaught error)
- `kill -0 PID` (test if process exists) vs `kill PID` (send TERM)
- Signal forwarding to child processes
- Cleanup patterns: temp files, lock files, child processes
- What signals CANNOT be trapped: SIGKILL (9) and SIGSTOP (19)

### Key Concepts

- SIGINT (Ctrl-C, 2) and SIGTERM (15, default for `kill`) are the two most-handled signals; SIGKILL (9) cannot be caught or ignored.
- `trap 'cleanup' EXIT INT TERM` is the defensive pattern — cleanup runs on normal exit, Ctrl-C, or kill.
- `kill -0 PID` sends no signal; it just checks if the process exists (returns 0 if yes, 1 if not). Use this to poll without sending signals.
- Traps are NOT inherited by subshells — a subshell `( ... )` resets traps to defaults; this matters when you background work.
- The exit code after a trap handler runs is the one that caused the trap (for ERR) or 0 + 128 + signum (for signal-triggered EXIT after a trap).
- Signal handlers should be minimal — long-running handlers can cause re-entrancy bugs; set a flag and check it in the main loop.

```bash
#!/usr/bin/env bash
cleanup() {
  echo "Cleaning up..."
  rm -f /tmp/myapp.lock
}
trap cleanup EXIT   # runs on any exit (success, error, signal)

echo "Working..."
# Even if we exit early or hit an error, cleanup runs
exit 0
```
Caption: Basic trap

### Common Pitfalls

- Trying to trap SIGKILL (9) or SIGSTOP (19) — these CANNOT be caught, blocked, or ignored; only SIGTERM/SIGINT/etc. can be trapped.
- Expecting traps to be inherited by subshells — they are NOT; a `( ... )` subshell resets traps to defaults, so cleanup logic must be repeated.
- Long-running trap handlers causing re-entrancy — if a signal arrives while the handler runs, behavior is undefined; keep handlers short (set a flag, return).
- Confusing `kill -0 PID` with `kill PID` — `kill -0` sends no signal (just tests existence); `kill` (default) sends SIGTERM and may actually kill the process.
- Forgetting to exit explicitly inside an INT/TERM trap — without `exit`, the script continues after the handler returns, which is rarely what you want for Ctrl-C.

### Real-World Applications

- The Docker `docker stop` sends SIGTERM, waits 10s, then SIGKILL; well-behaved entrypoint scripts trap TERM to flush buffers and exit cleanly.
- systemd sends SIGTERM then SIGKILL after TimeoutStopSec; service scripts trap TERM to shut down gracefully.
- Kubernetes pod termination sends SIGTERM to PID 1, waits terminationGracePeriodSeconds (default 30s), then SIGKILL; trap-aware containers exit cleanly.
- Jenkins pipeline `sh` steps forward SIGTERM to the child shell, allowing cleanup hooks to run on abort.

### Interview Questions

- 1. Which signals CANNOT be trapped? — SIGKILL (9) and SIGSTOP (19); they bypass the trap mechanism entirely (kernel-level, not deliverable to user space handlers).
- 2. What does `kill -0 PID` do? — Sends no signal; just checks if PID exists (returns 0 if yes, non-zero if not). Useful for polling without side effects.
- 3. Are traps inherited by subshells? — No; a `( ... )` subshell resets traps to their defaults. This is a frequent source of cleanup-not-running bugs.
- 4. Why exit explicitly inside an INT trap? — Without exit, the script continues after the handler returns, often producing confusing output. Exit 130 (= 128 + 2) signals SIGINT to the parent.
- 5. What's the difference between SIGINT and SIGTERM? — SIGINT (2) is sent by Ctrl-C interactively; SIGTERM (15) is sent by `kill` and init systems. Both can be trapped; conventions differ (TERM = "please shut down", INT = "user wants to stop").

### Mini Project

Build a "long_running_job.sh" with graceful shutdown: A script that simulates a long-running batch job (loops with sleep), traps SIGINT/SIGTERM to print a progress summary and exit cleanly, and forwards signals to a child subprocess. Suggested approach:
  - Define on_signal() that prints progress (e.g. "Processed 47/100 items"), kills $child_pid, and exits 130
  - Trap on_signal INT TERM and a separate cleanup-on-EXIT function
  - Launch a child `sleep 600 &` and store its PID
  - Main loop: for i in {1..100}; do sleep 1; done
  - Test by sending `kill -INT $script_pid` from another terminal; verify the summary prints and the child is also killed

### Exercises

1. Write a script that traps INT and prints "Caught Ctrl-C, exiting" then exits 130.
2. Use `kill -0 $$` to verify the current shell's PID exists; explain the result.
3. Trap EXIT to remove a temp file created with mktemp; verify the file is removed on both normal exit and Ctrl-C.
4. Spawn `sleep 100 &`, then `kill -TERM $!` and check `$?` after `wait $!` — should be 143.
5. Try to trap SIGKILL (`trap 'echo nope' KILL`) and verify Bash refuses with an error.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which signals CANNOT be trapped?
9. A) SIGINT and SIGTERM
10. B) SIGHUP and SIGUSR1
11. C) All signals can be trapped
12. D) SIGKILL (9) and SIGSTOP (19) (*)
13. Explanation: SIGKILL and SIGSTOP are handled in kernel space and bypass user-mode handlers entirely; no process can catch or ignore them.
14. Q2: What does `kill -0 PID` do?
15. A) Sends signal 0 (no signal); just checks if the process exists (*)
16. B) Kills the process with signal 0
17. C) Sends SIGCONT
18. D) Tests the process's exit code
19. Explanation: `kill -0 PID` sends no signal but returns 0 if the process exists and the user can signal it; non-zero otherwise. Useful for polling.
20. Q3: Are traps inherited by subshells?
21. A) Yes, always
22. B) No — subshells reset traps to defaults (*)
23. C) Only EXIT traps
24. D) Only if exported with export -f
25. Explanation: `( ... )` and command substitution reset traps to their default disposition; if you need cleanup in a subshell, set traps inside it.
26. Q4: Which signal does Ctrl-C send?
27. A) SIGTERM (15)
28. B) SIGKILL (9)
29. C) SIGINT (2) (*)
30. D) SIGHUP (1)
31. Explanation: Ctrl-C sends SIGINT (signal 2) to the foreground process group; the conventional exit code after trapping it is 130 = 128 + 2.
32. Q5: What's the conventional exit code after trapping and handling SIGINT?
33. A) 0
34. B) 1
35. C) 2
36. D) 130 (*)
37. Explanation: 130 = 128 + 2 (SIGINT's signal number). Following this convention lets parent scripts distinguish "user interrupted" from other failures.
38. Q6: Which trap fires ONLY on uncaught errors under set -e?
39. A) trap 'fn' ERR (*)
40. B) trap 'fn' EXIT
41. C) trap 'fn' INT
42. D) trap 'fn' FAIL
43. Explanation: ERR fires when a command fails (and would cause set -e to exit); EXIT fires on any exit. ERR is useful for "log the failing command" before exit cleanup runs.
44. Q7: Why keep trap handlers short?
45. A) For performance
46. B) To avoid re-entrancy bugs if another signal arrives during the handler (*)
47. C) Bash limits handler length to 80 chars
48. D) Long handlers are POSIX-illegal
49. Explanation: If a second signal arrives while the handler runs, behavior is undefined; set a flag and check it in the main loop instead of doing long work in the handler.
50. Q8: What does `kill PID` (no flag) send by default?
51. A) SIGKILL
52. B) SIGINT
53. C) SIGTERM (*)
54. D) SIGHUP
55. Explanation: `kill` without a flag sends SIGTERM (15) — the "please shut down" signal that can be trapped. `kill -9` sends SIGKILL.
56. Q9: What's the difference between SIGINT and SIGTERM conventionally?
57. A) They are identical
58. B) SIGTERM is from Ctrl-C
59. C) SIGINT cannot be trapped
60. D) SIGINT is user-initiated (Ctrl-C); SIGTERM is system-initiated (kill, init) (*)
61. Explanation: SIGINT (2) is sent interactively by Ctrl-C; SIGTERM (15) is sent by `kill` and init systems. Both can be trapped; conventions differ.
62. Q10: What happens if you forget to `exit` inside an INT trap?
63. A) The script continues after the handler returns, often producing confusing output (*)
64. B) Bash exits anyway
65. C) The script crashes
66. D) The trap is removed
67. Explanation: After the handler returns, execution resumes where the signal arrived. Usually you want to exit explicitly (e.g. exit 130 for SIGINT) to abort cleanly.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which signals CANNOT be trapped?
  options:
    - SIGINT and SIGTERM
    - SIGHUP and SIGUSR1
    - All signals can be trapped
    - SIGKILL (9) and SIGSTOP (19)
  correctIndex: 3
  explanation: SIGKILL and SIGSTOP are handled in kernel space and bypass user-mode handlers entirely; no process can catch or ignore them.
- id: q2
  question: What does `kill -0 PID` do?
  options:
    - Sends signal 0 (no signal); just checks if the process exists
    - Kills the process with signal 0
    - Sends SIGCONT
    - Tests the process's exit code
  correctIndex: 0
  explanation: "`kill -0 PID` sends no signal but returns 0 if the process exists and the user can signal it; non-zero otherwise. Useful for polling."
- id: q3
  question: Are traps inherited by subshells?
  options:
    - Yes, always
    - No — subshells reset traps to defaults
    - Only EXIT traps
    - Only if exported with export -f
  correctIndex: 1
  explanation: "`( ... )` and command substitution reset traps to their default disposition; if you need cleanup in a subshell, set traps inside it."
- id: q4
  question: Which signal does Ctrl-C send?
  options:
    - SIGTERM (15)
    - SIGKILL (9)
    - SIGINT (2)
    - SIGHUP (1)
  correctIndex: 2
  explanation: Ctrl-C sends SIGINT (signal 2) to the foreground process group; the conventional exit code after trapping it is 130 = 128 + 2.
- id: q5
  question: What's the conventional exit code after trapping and handling SIGINT?
  options:
    - "0"
    - "1"
    - "2"
    - "130"
  correctIndex: 3
  explanation: 130 = 128 + 2 (SIGINT's signal number). Following this convention lets parent scripts distinguish "user interrupted" from other failures.
- id: q6
  question: Which trap fires ONLY on uncaught errors under set -e?
  options:
    - trap 'fn' ERR
    - trap 'fn' EXIT
    - trap 'fn' INT
    - trap 'fn' FAIL
  correctIndex: 0
  explanation: ERR fires when a command fails (and would cause set -e to exit); EXIT fires on any exit. ERR is useful for "log the failing command" before exit cleanup runs.
- id: q7
  question: Why keep trap handlers short?
  options:
    - For performance
    - To avoid re-entrancy bugs if another signal arrives during the handler
    - Bash limits handler length to 80 chars
    - Long handlers are POSIX-illegal
  correctIndex: 1
  explanation: If a second signal arrives while the handler runs, behavior is undefined; set a flag and check it in the main loop instead of doing long work in the handler.
- id: q8
  question: What does `kill PID` (no flag) send by default?
  options:
    - SIGKILL
    - SIGINT
    - SIGTERM
    - SIGHUP
  correctIndex: 2
  explanation: '`kill` without a flag sends SIGTERM (15) — the "please shut down" signal that can be trapped. `kill -9` sends SIGKILL.'
- id: q9
  question: What's the difference between SIGINT and SIGTERM conventionally?
  options:
    - They are identical
    - SIGTERM is from Ctrl-C
    - SIGINT cannot be trapped
    - SIGINT is user-initiated (Ctrl-C); SIGTERM is system-initiated (kill, init)
  correctIndex: 3
  explanation: SIGINT (2) is sent interactively by Ctrl-C; SIGTERM (15) is sent by `kill` and init systems. Both can be trapped; conventions differ.
- id: q10
  question: What happens if you forget to `exit` inside an INT trap?
  options:
    - The script continues after the handler returns, often producing confusing output
    - Bash exits anyway
    - The script crashes
    - The trap is removed
    - to abort cleanly.
  correctIndex: 0
  explanation: After the handler returns, execution resumes where the signal arrived. Usually you want to exit explicitly (e.g. exit 130 for SIGINT) to abort cleanly.
```

