---
slug: bash-process-management-jobs-bg-fg-nohup-disown
id: bash-13
track: bash
order: 13
title: Process Management — jobs, bg, fg, nohup, disown
description: Run jobs in the background, manage them with jobs/bg/fg, survive logout with nohup and disown, and orchestrate parallel work with coproc and wait.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=2400s
whyItMatters: Run jobs in the background, manage them with jobs/bg/fg, survive logout with nohup and disown, and orchestrate parallel work with coproc and wait.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Process Management — jobs, bg, fg, nohup, disown

## Process Management — jobs, bg, fg, nohup, disown

### Why It Matters

Run jobs in the background, manage them with jobs/bg/fg, survive logout with nohup and disown, and orchestrate parallel work with coproc and wait.

Run jobs in the background, manage them with jobs/bg/fg, survive logout with nohup and disown, and orchestrate parallel work with coproc and wait.

### Prerequisites

- Stage 11-12: exit codes, signals, traps
- Comfort with `$!` and `wait`

### Topics

- Background jobs: `cmd &`
- jobs, bg %N, fg %N, Ctrl-Z, job specs (%1, %2)
- wait $PID and wait (all jobs)
- nohup cmd & (immune to SIGHUP)
- disown (remove job from shell's table)
- setsid (start in a new session, detached)
- coproc (coprocess: bidirectional pipe to a background command)
- /dev/null for stdin/stdout when backgrounding

### Key Concepts

- `cmd &` runs cmd in the background; $! immediately captures its PID.
- When a shell exits, it sends SIGHUP to all its jobs; nohup, disown, and setsid prevent this.
- `wait` (no arg) blocks until ALL background jobs finish; `wait $PID` waits for one; `wait -n` (Bash 5.1+) waits for ANY one to finish.
- `disown` removes a job from the shell's job table, so it survives shell exit; unlike nohup, the job keeps running with its existing SIGHUP disposition.
- `setsid` runs a command in a new session (detached from any controlling terminal); more thorough than nohup for true daemonization.
- `coproc NAME cmd` starts cmd in the background with bidirectional pipes; read from ${NAME[0]} and write to ${NAME[1]}.

```bash
#!/usr/bin/env bash
# Launch 3 jobs in parallel, wait for all
for i in 1 2 3; do
  (sleep "$i"; echo "Job $i done") &
done
wait   # block until all 3 finish
echo "All jobs complete"
```
Caption: Background and wait

### Common Pitfalls

- Expecting `cmd &` to survive logout — by default, the shell sends SIGHUP to all jobs on exit; use nohup or disown for survival.
- Forgetting to redirect stdin/stdout for backgrounded jobs — they inherit the terminal; if the terminal closes, the job may block on read or write. Use `< /dev/null` and `> log 2>&1`.
- Using `wait` without checking exit codes — `wait` returns the job's exit code; capture with `wait $pid; rc=$?` to detect failures.
- Assuming `wait -n` is portable — it was added in Bash 5.1 (2020); older Bash (including macOS 3.2) doesn't support it; use `wait $pid` for each.
- Confusing disown with nohup — nohup sets SIGHUP to ignore BEFORE the job starts (and is inherited); disown removes a running job from the table without changing its signal disposition. They can stack.

### Real-World Applications

- Cron jobs and systemd services run detached (the equivalent of setsid + nohup) so they survive user logout.
- The classic `nohup ./build.sh &` is how developers kick off long builds over SSH without risking disconnect-induced termination.
- Jenkins's `sh` step uses process groups to forward signals and `wait` to collect exit codes from parallel steps.
- GNU parallel internally uses `wait` and `$!` to track thousands of concurrent jobs across CPU cores and remote machines.

### Interview Questions

- 1. What's the difference between `cmd &`, `nohup cmd &`, and `setsid cmd &`? — `&` backgrounds but the job dies on SIGHUP at shell exit; nohup ignores SIGHUP; setsid starts a new session (fully detached from controlling terminal).
- 2. What does `wait -n` do? — Waits for ANY ONE background job to finish (returns its exit code); added in Bash 5.1, useful for dynamic job-pool patterns.
- 3. Why redirect stdin to /dev/null for backgrounded jobs? — Backgrounded jobs inherit the terminal; if they try to read and the terminal closes, they hang or error. /dev/null gives them immediate EOF.
- 4. What's the difference between disown and nohup? — nohup must be used at start time and sets SIGHUP=ignore; disown works on an already-running job, removing it from the shell's job table without changing signal disposition.
- 5. What does coproc provide that `cmd | ... | cmd` doesn't? — A bidirectional pipe: you can write to the coproc's stdin AND read its stdout from the parent shell, enabling interactive (request/response) scripting.

### Mini Project

Build a "parallel_fetch.sh" URL fetcher: A script that fetches N URLs in parallel (configurable concurrency with -j), waits for all to finish, and prints a summary of successes and failures with HTTP status codes. Suggested approach:
  - Read URLs from a file (one per line) or stdin
  - Use a job counter and `wait -n` (Bash 5.1+) or a manual PID array + `wait $pid`
  - Launch each fetch in a subshell: `( code=$(curl -s -o /dev/null -w "%{http_code}" "$url"); echo "$code $url" >> results.log ) &`
  - Cap concurrency with a counter: `while (( $(jobs -r | wc -l) >= MAX )); do wait -n; done`
  - Trap EXIT to print the summary sorted by status code

### Exercises

1. Launch `sleep 5 &` and `sleep 3 &`, then `wait` and observe the order of completion.
2. Use `nohup sleep 100 > /tmp/s.log 2>&1 &`, log out and back in, and verify the process is still running with `pgrep`.
3. Background a job, suspend with Ctrl-Z, resume with `bg %1`, then `disown` it; verify `jobs` shows nothing.
4. Spawn `bc -l` with `coproc`, send "2*3", read the result, and close the input fd.
5. Use `wait -n` (Bash 5.1+) in a loop to process jobs as they finish (job pool pattern).
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `cmd &` do?
9. A) Runs cmd in the background; the shell prompt returns immediately (*)
10. B) Runs cmd twice
11. C) Sends cmd to all sessions
12. D) Runs cmd with no arguments
13. Explanation: `&` backgrounds the command; $! captures its PID. The job is still part of the shell's job table and will receive SIGHUP on shell exit.
14. Q2: What signal does the shell send to jobs when it exits?
15. A) SIGINT
16. B) SIGHUP (*)
17. C) SIGTERM
18. D) SIGKILL
19. Explanation: On exit, the shell sends SIGHUP (1) to all its jobs; this is why nohup (no-HUP) exists to ignore it.
20. Q3: Which makes a job immune to SIGHUP from the start?
21. A) disown
22. B) bg
23. C) nohup (*)
24. D) coproc
25. Explanation: `nohup cmd &` sets SIGHUP to ignore before exec'ing cmd; the job survives logout. nohup also redirects stdout to nohup.out if it's a terminal.
26. Q4: What does `wait` (no arguments) do?
27. A) Waits for one second
28. B) Waits for the last-spawned job
29. C) Errors out
30. D) Blocks until ALL background jobs finish (*)
31. Explanation: `wait` with no args blocks until all background jobs complete; `wait $PID` waits for one specific job; `wait -n` (Bash 5.1+) waits for any one.
32. Q5: What does `disown %1` do?
33. A) Removes job %1 from the shell's job table so it survives shell exit (*)
34. B) Kills job %1
35. C) Pauses job %1
36. D) Sends job %1 to the system tray
37. Explanation: disown removes the job from the shell's job table; the job keeps running but no longer receives SIGHUP on shell exit and is not shown by `jobs`.
38. Q6: Which Bash version introduced `wait -n`?
39. A) 4.0
40. B) 5.1 (*)
41. C) 4.4
42. D) 3.2
43. Explanation: `wait -n` (wait for any one job) was added in Bash 5.1 (2020); older Bash must track PIDs manually and wait on each.
44. Q7: Why redirect stdin to /dev/null for backgrounded jobs?
45. A) For performance
46. B) /dev/null speeds up the job
47. C) Backgrounded jobs inherit the terminal; if it closes, reads hang or fail (*)
48. D) It's required by POSIX
49. Explanation: A backgrounded job that tries to read from a closed terminal will block or fail; </dev/null gives it immediate EOF, preventing hangs.
50. Q8: What does `setsid cmd` do that `nohup cmd &` does not?
51. A) Ignores SIGHUP
52. B) Redirects stdout
53. C) Runs cmd as root
54. D) Starts cmd in a new session, fully detached from the controlling terminal (*)
55. Explanation: setsid creates a new session and detaches from any controlling terminal; nohup only ignores SIGHUP and keeps the same session. setsid is more thorough for daemonization.
56. Q9: What does `coproc NAME cmd` provide?
57. A) A bidirectional pipe to a backgrounded command via fds ${NAME[0]} and ${NAME[1]} (*)
58. B) A read-only pipe
59. C) A faster fork
60. D) A copy of cmd
61. Explanation: coproc runs cmd in the background with two fds: ${NAME[0]} for reading its stdout, ${NAME[1]} for writing to its stdin. Enables interactive scripting.
62. Q10: What does Ctrl-Z do in a terminal?
63. A) Sends SIGKILL
64. B) Sends SIGTSTP, suspending the foreground job (*)
65. C) Sends SIGINT
66. D) Closes the terminal
67. Explanation: Ctrl-Z sends SIGTSTP (suspend), stopping the foreground process and returning to the shell prompt; resume with `fg` (foreground) or `bg` (background).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `cmd &` do?
  options:
    - Runs cmd in the background; the shell prompt returns immediately
    - Runs cmd twice
    - Sends cmd to all sessions
    - Runs cmd with no arguments
  correctIndex: 0
  explanation: "`&` backgrounds the command; $! captures its PID. The job is still part of the shell's job table and will receive SIGHUP on shell exit."
- id: q2
  question: What signal does the shell send to jobs when it exits?
  options:
    - SIGINT
    - SIGHUP
    - SIGTERM
    - SIGKILL
    - exists to ignore it.
  correctIndex: 1
  explanation: On exit, the shell sends SIGHUP (1) to all its jobs; this is why nohup (no-HUP) exists to ignore it.
- id: q3
  question: Which makes a job immune to SIGHUP from the start?
  options:
    - disown
    - bg
    - nohup
    - coproc
  correctIndex: 2
  explanation: "`nohup cmd &` sets SIGHUP to ignore before exec'ing cmd; the job survives logout. nohup also redirects stdout to nohup.out if it's a terminal."
- id: q4
  question: What does `wait` (no arguments) do?
  options:
    - Waits for one second
    - Waits for the last-spawned job
    - Errors out
    - Blocks until ALL background jobs finish
  correctIndex: 3
  explanation: "`wait` with no args blocks until all background jobs complete; `wait $PID` waits for one specific job; `wait -n` (Bash 5.1+) waits for any one."
- id: q5
  question: What does `disown %1` do?
  options:
    - Removes job %1 from the shell's job table so it survives shell exit
    - Kills job %1
    - Pauses job %1
    - Sends job %1 to the system tray
  correctIndex: 0
  explanation: disown removes the job from the shell's job table; the job keeps running but no longer receives SIGHUP on shell exit and is not shown by `jobs`.
- id: q6
  question: Which Bash version introduced `wait -n`?
  options:
    - "4.0"
    - "5.1"
    - "4.4"
    - "3.2"
  correctIndex: 1
  explanation: "`wait -n` (wait for any one job) was added in Bash 5.1 (2020); older Bash must track PIDs manually and wait on each."
- id: q7
  question: Why redirect stdin to /dev/null for backgrounded jobs?
  options:
    - For performance
    - /dev/null speeds up the job
    - Backgrounded jobs inherit the terminal; if it closes, reads hang or fail
    - It's required by POSIX
  correctIndex: 2
  explanation: A backgrounded job that tries to read from a closed terminal will block or fail; </dev/null gives it immediate EOF, preventing hangs.
- id: q8
  question: What does `setsid cmd` do that `nohup cmd &` does not?
  options:
    - Ignores SIGHUP
    - Redirects stdout
    - Runs cmd as root
    - Starts cmd in a new session, fully detached from the controlling terminal
  correctIndex: 3
  explanation: setsid creates a new session and detaches from any controlling terminal; nohup only ignores SIGHUP and keeps the same session. setsid is more thorough for daemonization.
- id: q9
  question: What does `coproc NAME cmd` provide?
  options:
    - A bidirectional pipe to a backgrounded command via fds ${NAME[0]} and ${NAME[1]}
    - A read-only pipe
    - A faster fork
    - A copy of cmd
  correctIndex: 0
  explanation: "coproc runs cmd in the background with two fds: ${NAME[0]} for reading its stdout, ${NAME[1]} for writing to its stdin. Enables interactive scripting."
- id: q10
  question: What does Ctrl-Z do in a terminal?
  options:
    - Sends SIGKILL
    - Sends SIGTSTP, suspending the foreground job
    - Sends SIGINT
    - Closes the terminal
  correctIndex: 1
  explanation: Ctrl-Z sends SIGTSTP (suspend), stopping the foreground process and returning to the shell prompt; resume with `fg` (foreground) or `bg` (background).
```

