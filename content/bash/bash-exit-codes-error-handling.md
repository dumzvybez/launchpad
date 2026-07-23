---
slug: bash-exit-codes-error-handling
id: bash-11
track: bash
order: 11
title: Exit Codes, &&, ||, and Error Handling
description: Treat Bash as a typed language where every command returns an exit code — chain them safely with && and ||, fail fast with set -e, and trap errors for cleanup.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=2000s
whyItMatters: Treat Bash as a typed language where every command returns an exit code — chain them safely with && and ||, fail fast with set -e, and trap errors for cleanup.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Exit Codes, &&, ||, and Error Handling

## Exit Codes, &&, ||, and Error Handling

### Why It Matters

Treat Bash as a typed language where every command returns an exit code — chain them safely with && and ||, fail fast with set -e, and trap errors for cleanup.

Treat Bash as a typed language where every command returns an exit code — chain them safely with && and ||, fail fast with set -e, and trap errors for cleanup.

### Prerequisites

- Stage 1-10: control flow, functions, pipes
- Understanding that $? holds the last exit code

### Topics

- Exit codes: 0 = success, 1-255 = failure, 128+N = killed by signal N
- `cmd1 && cmd2` (run if success) and `cmd1 || cmd2` (run if failure)
- `if ! cmd` (negate) and the `!` operator
- `set -e` (errexit) and `set -o pipefail`
- `set -e` edge cases: ignored in if conditions, command substitution, && / ||
- trap ERR for cleanup on failure; trap EXIT for always-cleanup
- `|| true` and `|| :` to suppress non-zero exits under set -e

### Key Concepts

- Every command in Bash returns an exit code (0-255); 0 is success, anything else is failure; codes >= 128 mean the process was killed by signal (code - 128).
- `cmd1 && cmd2` runs cmd2 only if cmd1 succeeded; `cmd1 || cmd2` runs cmd2 only if cmd1 failed. They short-circuit.
- `set -e` makes the script exit immediately if any command fails — BUT it's silently disabled in if/while/until conditions, && ||, and command substitution.
- `set -o pipefail` makes a pipeline fail if ANY stage fails (default is "use the last stage's exit code"); without it, `false | true` returns 0.
- `trap 'cleanup' EXIT` runs cleanup when the script exits for ANY reason (normal, error, signal); `trap 'on_err' ERR` runs only on uncaught errors under set -e.
- `cmd || true` (or `cmd || :`) explicitly suppresses a non-zero exit so set -e doesn't fire; useful for "best effort" commands like grep -q.

```bash
true;  echo $?    # 0
false; echo $?    # 1
( exit 42 ); echo $?   # 42
sleep 100 & PID=$!
kill -TERM $PID
wait $PID; echo $?   # 143 = 128 + 15 (SIGTERM)
```
Caption: Exit codes and signals

### Common Pitfalls

- Trusting set -e to catch everything — it does NOT fire inside `if cmd`, `cmd && ...`, `cmd || ...`, or `$(cmd)`; check those explicitly.
- Forgetting pipefail — `false | true` returns 0 by default; `set -o pipefail` makes it return 1; without it, errors in early pipeline stages are lost.
- Using `cmd || true` to silence ALL failures — this hides real bugs; only use for commands whose failure is expected (like grep -q with no match).
- Assuming exit code 1 = "error" — codes 2-255 are also failures but have specific meanings (grep: 1=no match, 2=error; diff: 0=same, 1=different, 2=error).
- Forgetting that exit codes wrap modulo 256 — `exit 300` is actually exit 44 (300 - 256); never use >255 as an exit code.

### Real-World Applications

- Every serious Bash script at Google follows the "strict mode" header (`set -euo pipefail`) per their Shell Style Guide.
- GitHub Actions workflows use `set -e` semantics by default (each step fails the job on non-zero exit), with `continue-on-error: true` to opt out.
- The Linux kernel's `scripts/` build helpers chain gcc calls with `&&` so a compile failure halts the build cleanly.
- HashiCorp's Vagrant and Packer shell provisioners respect `set -e`-style failures; they ship scripts that wrap user code with `set -e` for predictability.

### Interview Questions

- 1. What does `set -e` do? — Causes the script to exit immediately if any command returns non-zero — but it's silently disabled inside if conditions, &&/||, and command substitution.
- 2. Why does `false | true` return 0? — By default, a pipeline's exit code is the LAST command's; `set -o pipefail` changes this to "fail if any stage fails".
- 3. What's the difference between `trap 'fn' EXIT` and `trap 'fn' ERR`? — EXIT runs on any exit (normal, error, signal); ERR runs only on uncaught errors under set -e.
- 4. How do you suppress a single command's failure under set -e? — Append `|| true` or `|| :`; or wrap in an if statement where set -e is disabled.
- 5. What exit code does a process killed by SIGTERM (signal 15) report via $? — 143 (= 128 + 15); signal kills always report 128 + signal number.

### Mini Project

Build a "safe_deploy.sh" deploy script: A script that runs tests, builds a Docker image, pushes it, and triggers a kubectl rollout — failing fast at any step with proper cleanup. Suggested approach:
  - Start with `set -euo pipefail` and a trap EXIT that removes temp files
  - Step 1: run pytest with `pytest || { echo "tests failed"; exit 1; }`
  - Step 2: build image with `docker build -t myapp:${BUILD_NUMBER} .`
  - Step 3: push with `docker push ...`
  - Step 4: kubectl set image deployment/myapp container=myapp:...
  - Step 5: wait for rollout with `kubectl rollout status`
  - On any failure, trap EXIT prints "Deploy FAILED at step N" and rolls back

### Exercises

1. Run `false; echo $?` and `(exit 42); echo $?` and explain the values.
2. Add `set -e` to a script and observe that `grep -q missing file` exits the script; fix with `|| true`.
3. Test that `set -o pipefail` makes `false | true` exit non-zero.
4. Write a script with `trap 'echo bye' EXIT` and verify the message prints on both success and Ctrl-C.
5. Spawn `sleep 100 &`, `kill -TERM $!`, then `wait $!; echo $?` — verify it prints 143.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `set -e` do?
9. A) Echoes every command
10. B) Treats unset variables as errors
11. C) Exits the script on any non-zero exit code (with caveats) (*)
12. D) Enables extended globbing
13. Explanation: set -e (errexit) aborts the script when a command fails — BUT it's silently disabled inside if/while conditions, &&/||, and $().
14. Q2: Why does `false | true` return 0 by default?
15. A) Pipes always succeed
16. B) false returns 0 inside pipes
17. C) true overwrites false's exit code
18. D) A pipeline's exit code is the LAST command's by default; use set -o pipefail to change this (*)
19. Explanation: By default, pipeline exit = last command's exit. `set -o pipefail` makes it the rightmost failed command's exit.
20. Q3: What exit code does a process killed by SIGTERM (signal 15) report?
21. A) 143 (*)
22. B) 1
23. C) 15
24. D) -15
25. Explanation: Signal-killed processes report 128 + signal number; SIGTERM = 15, so $? = 143.
26. Q4: Which makes `cmd` not abort the script under set -e, even on failure?
27. A) cmd > /dev/null
28. B) cmd || true (*)
29. C) cmd 2>&1
30. D) cmd &
31. Explanation: `|| true` makes the compound command always return 0; set -e doesn't fire. Equivalent: `|| :`.
32. Q5: Which trap fires on ANY exit (success, error, signal)?
33. A) trap 'fn' ERR
34. B) trap 'fn' SIGTERM
35. C) trap 'fn' EXIT (*)
36. D) trap 'fn' FAIL
37. Explanation: EXIT fires whenever the shell exits for any reason — normal exit, set -e failure, or uncaught signal (after the signal-specific trap if any).
38. Q6: Where is set -e silently disabled?
39. A) Inside functions
40. B) Inside loops
41. C) Inside subshells
42. D) Inside if/while/until conditions, &&/|| chains, and command substitution (*)
43. Explanation: set -e is disabled wherever a command's exit status is being tested (if/while/until, &&/||) or captured ($()); these contexts explicitly want to handle non-zero exits.
44. Q7: What does `cmd1 && cmd2` do?
45. A) Runs cmd2 only if cmd1 succeeds (*)
46. B) Runs both, returns success only if both succeed
47. C) Runs cmd2 only if cmd1 fails
48. D) Runs both in parallel
49. Explanation: && short-circuits: cmd2 runs only if cmd1 succeeded (exit 0). The compound's exit code is the last evaluated command's.
50. Q8: What does `set -o pipefail` do?
51. A) Fails the script if any pipe is used
52. B) Makes a pipeline's exit code reflect any failed stage, not just the last (*)
53. C) Disables pipes
54. D) Forces pipes to use temp files
55. Explanation: Without pipefail, `false | true` returns 0 (last stage's). With pipefail, it returns 1 (the rightmost failed stage's).
56. Q9: What is the range of valid exit codes in Bash?
57. A) 0 to 1
58. B) 0 to 127
59. C) 0 to 255 (*)
60. D) -128 to 127
61. Explanation: Exit codes are 0-255; 0 = success, 1-125 = user-defined failure, 126 = not executable, 127 = command not found, 128+N = killed by signal N.
62. Q10: What does `if ! grep -q needle haystack; then echo missing; fi` do?
63. A) Errors out
64. B) Always prints "missing"
65. C) Suppresses grep's output
66. D) Prints "missing" if grep finds no match (the ! negates the exit code) (*)
67. Explanation: `!` negates the exit status; grep returns 1 on no match, ! makes it 0, so the if body runs when grep did NOT find the needle.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `set -e` do?
  options:
    - Echoes every command
    - Treats unset variables as errors
    - Exits the script on any non-zero exit code (with caveats)
    - Enables extended globbing
  correctIndex: 2
  explanation: set -e (errexit) aborts the script when a command fails — BUT it's silently disabled inside if/while conditions, &&/||, and $().
- id: q2
  question: Why does `false | true` return 0 by default?
  options:
    - Pipes always succeed
    - false returns 0 inside pipes
    - true overwrites false's exit code
    - A pipeline's exit code is the LAST command's by default; use set -o pipefail to change this
  correctIndex: 3
  explanation: By default, pipeline exit = last command's exit. `set -o pipefail` makes it the rightmost failed command's exit.
- id: q3
  question: What exit code does a process killed by SIGTERM (signal 15) report?
  options:
    - "143"
    - "1"
    - "15"
    - "-15"
  correctIndex: 0
  explanation: Signal-killed processes report 128 + signal number; SIGTERM = 15, so $? = 143.
- id: q4
  question: Which makes `cmd` not abort the script under set -e, even on failure?
  options:
    - cmd > /dev/null
    - cmd || true
    - cmd 2>&1
    - cmd &
  correctIndex: 1
  explanation: "`|| true` makes the compound command always return 0; set -e doesn't fire. Equivalent: `|| :`."
- id: q5
  question: Which trap fires on ANY exit (success, error, signal)?
  options:
    - trap 'fn' ERR
    - trap 'fn' SIGTERM
    - trap 'fn' EXIT
    - trap 'fn' FAIL
  correctIndex: 2
  explanation: EXIT fires whenever the shell exits for any reason — normal exit, set -e failure, or uncaught signal (after the signal-specific trap if any).
- id: q6
  question: Where is set -e silently disabled?
  options:
    - Inside functions
    - Inside loops
    - Inside subshells
    - Inside if/while/until conditions, &&/|| chains, and command substitution
  correctIndex: 3
  explanation: set -e is disabled wherever a command's exit status is being tested (if/while/until, &&/||) or captured ($()); these contexts explicitly want to handle non-zero exits.
- id: q7
  question: What does `cmd1 && cmd2` do?
  options:
    - Runs cmd2 only if cmd1 succeeds
    - Runs both, returns success only if both succeed
    - Runs cmd2 only if cmd1 fails
    - Runs both in parallel
  correctIndex: 0
  explanation: "&& short-circuits: cmd2 runs only if cmd1 succeeded (exit 0). The compound's exit code is the last evaluated command's."
- id: q8
  question: What does `set -o pipefail` do?
  options:
    - Fails the script if any pipe is used
    - Makes a pipeline's exit code reflect any failed stage, not just the last
    - Disables pipes
    - Forces pipes to use temp files
  correctIndex: 1
  explanation: Without pipefail, `false | true` returns 0 (last stage's). With pipefail, it returns 1 (the rightmost failed stage's).
- id: q9
  question: What is the range of valid exit codes in Bash?
  options:
    - 0 to 1
    - 0 to 127
    - 0 to 255
    - -128 to 127
  correctIndex: 2
  explanation: Exit codes are 0-255; 0 = success, 1-125 = user-defined failure, 126 = not executable, 127 = command not found, 128+N = killed by signal N.
- id: q10
  question: What does `if ! grep -q needle haystack; then echo missing; fi` do?
  options:
    - Errors out
    - Always prints "missing"
    - Suppresses grep's output
    - Prints "missing" if grep finds no match (the ! negates the exit code)
  correctIndex: 3
  explanation: "`!` negates the exit status; grep returns 1 on no match, ! makes it 0, so the if body runs when grep did NOT find the needle."
```

