---
slug: bash-subshells-source-exec
id: bash-14
track: bash
order: 14
title: Subshells, source, exec
description: Isolate work in subshells, share state with source, and replace the current process with exec — three primitives that control Bash's process model.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=2600s
whyItMatters: Isolate work in subshells, share state with source, and replace the current process with exec — three primitives that control Bash's process model.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Subshells, source, exec

## Subshells, source, exec

### Why It Matters

Isolate work in subshells, share state with source, and replace the current process with exec — three primitives that control Bash's process model.

Isolate work in subshells, share state with source, and replace the current process with exec — three primitives that control Bash's process model.

### Prerequisites

- Stage 11-13: exit codes, signals, jobs
- Understanding of how environment variables propagate

### Topics

- Subshells: ( cmd ) — fork without exec
- Command groups: { cmd; } — current shell, no fork
- $(...) command substitution runs in a subshell
- source (or .) — execute in current shell
- exec cmd — replace the current process
- exec N>file — open/close fds in current shell
- Fork bombs: :(){ :|:& };: — and how to mitigate
- cd in a subshell doesn't affect the parent

### Key Concepts

- `( cmds )` runs cmds in a SUBSHELL — a forked child process; variable changes, cd, and trap changes do NOT propagate to the parent.
- `{ cmds; }` runs cmds in the CURRENT shell — it's just a grouping construct; note the trailing semicolon and the required space after {.
- `source file` (or `. file`) executes file's commands in the current shell — used for loading libraries, setting env vars, and activating virtualenvs.
- `exec cmd` REPLACES the current process with cmd — the Bash process is gone; PID stays the same; the script's lines after exec never run.
- `exec N>file` (with N and no command) opens fd N in the current shell — different from `exec cmd` which replaces the process.
- A fork bomb `:(){ :|:& };:` defines a function `:` that calls itself twice in the background; mitigated with `ulimit -u` (per-user process limit).

```bash
#!/usr/bin/env bash
x=1

# SUBSHELL: changes don't propagate
( x=99; echo "inside subshell: x=$x" )
echo "after subshell: x=$x"      # 1

# GROUP: changes DO propagate
{ x=99; echo "inside group: x=$x"; }
echo "after group: x=$x"         # 99
```
Caption: Subshell vs group

### Common Pitfalls

- Expecting `cd` inside `( )` to affect the parent — subshells are forks; the parent's cwd is unchanged. Use `cd` outside, or save/restore.
- Forgetting the space and trailing `;` in `{ cmds; }` — `{cmd}` is not a group; it's the literal string "{cmd}"; you need `{ cmd; }` with spaces and a semicolon.
- Using `exec cmd` thinking the script continues — exec REPLACES the process; lines after exec never run. This is the most common "where did my output go?" bug.
- Confusing `source` and `bash` — `bash file` runs file in a new process (changes lost); `source file` runs in the current shell (changes kept). The virtualenv `activate` script MUST be sourced, not executed.
- Fork bombs via `:(){ :|:& };:` — define a function named `:` that pipelines itself twice in the background; runs exponentially; mitigate with `ulimit -u 100` to cap user processes.

### Real-World Applications

- Python's `venv` and `virtualenv` ship an `activate` script that MUST be sourced (not executed) — it exports PATH and PS1 changes into the current shell.
- Docker ENTRYPOINT scripts end with `exec "$@"` to replace the entrypoint process with the main command (PID 1) so signals reach the right process.
- NVM, pyenv, and rbenv install scripts use `source` to inject shell hooks into .bashrc that re-shim on cd.
- Many CI scripts wrap their main work in a subshell `( ... ) || exit 1` to isolate failures and run cleanup traps reliably.

### Interview Questions

- 1. What's the difference between `( cmds )` and `{ cmds; }`? — Parens run in a subshell (fork — state changes lost); braces run in the current shell (state changes kept).
- 2. What does `exec cmd` do? — Replaces the current process with cmd via execve(2); the PID stays the same but the Bash image is replaced; lines after exec never run.
- 3. Why must `venv/bin/activate` be sourced, not executed? — Sourcing runs it in the current shell, so PATH/PS1 changes propagate; executing runs it in a subshell, so changes are lost when the subshell exits.
- 4. What's a fork bomb and how do you stop it? — A self-spawning function that exhausts the process table (`:(){ :|:& };:`); mitigate with `ulimit -u N` (per-user process limit); killing requires SIGKILL of the user's processes (or reboot if root is locked out).
- 5. Why does `cd /tmp` inside `( ... )` not change the parent's directory? — The subshell is a fork; it has its own copy of the cwd; exiting the subshell discards that copy.

### Mini Project

Build a "sandbox_runner.sh" isolated command runner: A script that runs a user-provided command inside a subshell with a temp working directory, captures the exit code and stdout/stderr separately, restores the parent's cwd, and prints a structured report. Suggested approach:
  - Create a temp dir with mktemp -d
  - Run the command in a subshell: `( cd "$tmpdir"; "$@" >stdout.log 2>stderr.log )`
  - Capture the subshell's exit code with $?
  - Print "exit=$rc, stdout=$(wc -l <stdout.log) lines, stderr=$(wc -l <stderr.log) lines"
  - Trap EXIT to rm -rf the temp dir
  - Add a --keep flag to preserve the temp dir for debugging

### Exercises

1. Run `x=1; ( x=2 ); echo $x` and verify the subshell's change doesn't propagate.
2. Use `{ cd /tmp; pwd; }; pwd` to verify the group's cd DOES propagate.
3. Write a script ending with `exec echo done`; verify no lines after exec run.
4. Create a `config.sh` exporting a variable; source it in another script and verify the variable is set.
5. Open fd 3 with `exec 3>/tmp/log`, write a line, close it, then cat the file.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the difference between `( cmds )` and `{ cmds; }`?
9. A) They are identical
10. B) ( ) runs in a subshell (state lost); { } runs in the current shell (state kept) (*)
11. C) { } runs in a subshell; ( ) runs in the current shell
12. D) Both run in subshells
13. Explanation: Parens fork a subshell — variable assignments, cd, and trap changes do not propagate. Braces group commands in the current shell — changes persist.
14. Q2: What does `exec cmd` do?
15. A) Runs cmd in a subshell
16. B) Backgrounds cmd
17. C) Replaces the current process with cmd; lines after exec never run (*)
18. D) Sources cmd as a function
19. Explanation: exec calls execve(2) to replace the process image; the PID stays the same but the Bash interpreter is gone. Common in Docker ENTRYPOINTs (`exec "$@"`).
20. Q3: Why must Python venv's `activate` be sourced, not executed?
21. A) It's a security requirement
22. B) Sourcing is faster
23. C) Executing requires root
24. D) Sourcing runs it in the current shell so PATH/PS1 changes propagate; executing runs in a subshell that loses them (*)
25. Explanation: The activate script modifies PATH and PS1 in the calling shell; if executed, those changes are confined to the subshell and discarded on exit.
26. Q4: Does `cd /tmp` inside `( cd /tmp; pwd )` change the parent's directory?
27. A) No — subshells are forks; their cwd change is discarded on exit (*)
28. B) Yes
29. C) Only if /tmp is the home directory
30. D) Only with --persistent flag
31. Explanation: A subshell is a separate process with its own copy of cwd; exiting it discards that copy. The parent's cwd is unchanged.
32. Q5: What's the syntax for a command group in the current shell?
33. A) (cmd)
34. B) { cmd; } (*)
35. C) [ cmd ]
36. D) < cmd >
37. Explanation: `{ cmd; }` runs in the current shell; the leading space after { and the trailing semicolon (or newline) are required. Parens would fork a subshell.
38. Q6: What does `source file` (or `. file`) do?
39. A) Runs file in a subshell
40. B) Compiles file
41. C) Reads and executes file's commands in the current shell (*)
42. D) Prints file's source code
43. Explanation: source (POSIX: .) reads file line by line and executes each in the current shell, so variables and functions defined in file persist afterward.
44. Q7: What is `:(){ :|:& };:`?
45. A) A Bash reserved word
46. B) A null command
47. C) A pipe to background
48. D) A fork bomb — defines a function `:` that pipelines itself twice in the background (*)
49. Explanation: This is the classic Bash fork bomb. It defines `:` to spawn two background copies of itself, exhausting the process table exponentially. Mitigate with `ulimit -u`.
50. Q8: What does `exec 3>file` (with no command) do?
51. A) Opens fd 3 for writing to file in the current shell; persists until closed (*)
52. B) Replaces the shell with file
53. C) Runs file with 3 args
54. D) Closes fd 3
55. Explanation: When exec is given only redirections (no command), it applies them to the current shell permanently. Close with `exec 3>&-`.
56. Q9: Why use `exec "$@"` at the end of a Docker entrypoint?
57. A) It's required by Docker
58. B) It replaces the entrypoint shell with the main command (PID 1) so signals reach it directly (*)
59. C) It makes the script faster
60. D) It backgrounds the command
61. Explanation: Without exec, the main command would run as a child of the shell, and signals like SIGTERM wouldn't propagate cleanly. exec makes the command PID 1.
62. Q10: How do you mitigate a fork bomb?
63. A) Reboot every minute
64. B) Disable bash
65. C) Use `ulimit -u N` to cap per-user process count; logrotate processes; cgroups (*)
66. D) Remove the function keyword
67. Explanation: ulimit -u N (or PAM limits, or cgroups pids.max) caps the number of processes a user can spawn, preventing exponential growth.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the difference between `( cmds )` and `{ cmds; }`?
  options:
    - They are identical
    - ( ) runs in a subshell (state lost); { } runs in the current shell (state kept)
    - "{ } runs in a subshell; ( ) runs in the current shell"
    - Both run in subshells
  correctIndex: 1
  explanation: Parens fork a subshell — variable assignments, cd, and trap changes do not propagate. Braces group commands in the current shell — changes persist.
- id: q2
  question: What does `exec cmd` do?
  options:
    - Runs cmd in a subshell
    - Backgrounds cmd
    - Replaces the current process with cmd; lines after exec never run
    - Sources cmd as a function
  correctIndex: 2
  explanation: exec calls execve(2) to replace the process image; the PID stays the same but the Bash interpreter is gone. Common in Docker ENTRYPOINTs (`exec "$@"`).
- id: q3
  question: Why must Python venv's `activate` be sourced, not executed?
  options:
    - It's a security requirement
    - Sourcing is faster
    - Executing requires root
    - Sourcing runs it in the current shell so PATH/PS1 changes propagate; executing runs in a subshell that loses them
  correctIndex: 3
  explanation: The activate script modifies PATH and PS1 in the calling shell; if executed, those changes are confined to the subshell and discarded on exit.
- id: q4
  question: Does `cd /tmp` inside `( cd /tmp; pwd )` change the parent's directory?
  options:
    - No — subshells are forks; their cwd change is discarded on exit
    - Yes
    - Only if /tmp is the home directory
    - Only with --persistent flag
  correctIndex: 0
  explanation: A subshell is a separate process with its own copy of cwd; exiting it discards that copy. The parent's cwd is unchanged.
- id: q5
  question: What's the syntax for a command group in the current shell?
  options:
    - (cmd)
    - "{ cmd; }"
    - "[ cmd ]"
    - < cmd >
  correctIndex: 1
  explanation: "`{ cmd; }` runs in the current shell; the leading space after { and the trailing semicolon (or newline) are required. Parens would fork a subshell."
- id: q6
  question: What does `source file` (or `. file`) do?
  options:
    - Runs file in a subshell
    - Compiles file
    - Reads and executes file's commands in the current shell
    - Prints file's source code
  correctIndex: 2
  explanation: "source (POSIX: .) reads file line by line and executes each in the current shell, so variables and functions defined in file persist afterward."
- id: q7
  question: What is `:(){ :|:& };:`?
  options:
    - A Bash reserved word
    - A null command
    - A pipe to background
    - A fork bomb — defines a function `:` that pipelines itself twice in the background
  correctIndex: 3
  explanation: This is the classic Bash fork bomb. It defines `:` to spawn two background copies of itself, exhausting the process table exponentially. Mitigate with `ulimit -u`.
- id: q8
  question: What does `exec 3>file` (with no command) do?
  options:
    - Opens fd 3 for writing to file in the current shell; persists until closed
    - Replaces the shell with file
    - Runs file with 3 args
    - Closes fd 3
  correctIndex: 0
  explanation: When exec is given only redirections (no command), it applies them to the current shell permanently. Close with `exec 3>&-`.
- id: q9
  question: Why use `exec "$@"` at the end of a Docker entrypoint?
  options:
    - It's required by Docker
    - It replaces the entrypoint shell with the main command (PID 1) so signals reach it directly
    - It makes the script faster
    - It backgrounds the command
  correctIndex: 1
  explanation: Without exec, the main command would run as a child of the shell, and signals like SIGTERM wouldn't propagate cleanly. exec makes the command PID 1.
- id: q10
  question: How do you mitigate a fork bomb?
  options:
    - Reboot every minute
    - Disable bash
    - Use `ulimit -u N` to cap per-user process count; logrotate processes; cgroups
    - Remove the function keyword
  correctIndex: 2
  explanation: ulimit -u N (or PAM limits, or cgroups pids.max) caps the number of processes a user can spawn, preventing exponential growth.
```

