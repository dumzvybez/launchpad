---
slug: bash-cron-systemd-timers-scheduling
id: bash-18
track: bash
order: 18
title: Cron, systemd timers, and Scheduling
description: Schedule recurring jobs with cron and systemd timers, handle cron's restrictive environment, and prevent concurrent runs with flock.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=3400s
whyItMatters: Schedule recurring jobs with cron and systemd timers, handle cron's restrictive environment, and prevent concurrent runs with flock.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Cron, systemd timers, and Scheduling

## Cron, systemd timers, and Scheduling

### Why It Matters

Schedule recurring jobs with cron and systemd timers, handle cron's restrictive environment, and prevent concurrent runs with flock.

Schedule recurring jobs with cron and systemd timers, handle cron's restrictive environment, and prevent concurrent runs with flock.

### Prerequisites

- Stage 11-17: error handling, CLI parsing, strict mode
- Comfort with absolute paths and process IDs

### Topics

- crontab format: 5 fields (minute hour day month weekday) + command
- crontab -e -l -r (edit, list, remove)
- Special entries: @reboot @daily @weekly @monthly @yearly
- cron's environment: minimal PATH, no tty, /bin/sh shell
- Escaping % in cron (it's a newline)
- systemd timers: .service + .timer units
- flock for preventing concurrent runs
- anacron for laptops (run missed jobs on boot)

### Key Concepts

- cron runs jobs with a minimal environment: PATH is usually /usr/bin:/bin, no USER profile is sourced, and the shell is /bin/sh (dash on Debian).
- The `%` character is special in crontab (it becomes a newline); escape with `\%` or use a wrapper script.
- Cron has NO controlling terminal — anything that reads stdin (like `read`) gets EOF; redirect stdin from /dev/null.
- systemd timers are more powerful than cron: they support sub-second precision, monotonic clocks, dependencies, and journalctl logging.
- `flock /tmp/myapp.lock -c 'command'` ensures only one instance runs at a time; without it, long-running cron jobs can stack up.
- Use absolute paths for all binaries (cron's PATH may not include /usr/local/bin); or set PATH explicitly at the top of your crontab.

```cron
# Run every day at 3am
0 3 * * * /usr/local/bin/backup.sh

# Every 15 minutes
*/15 * * * * /usr/local/bin/health-check.sh

# Weekdays at 9am
0 9 * * 1-5 /usr/local/bin/daily-report.sh

# Special entries
@reboot /usr/local/bin/startup.sh
@daily /usr/local/bin/cleanup.sh
```
Caption: Basic crontab

### Common Pitfalls

- Using relative paths in cron — cron's cwd is usually $HOME; use absolute paths for all binaries and files.
- Forgetting that cron's shell is /bin/sh — bash-isms like [[ ]] and arrays fail; either set SHELL=/bin/bash in crontab or use a wrapper script.
- Using % in cron commands without escaping — % becomes a newline; escape with `\%` or wrap in a script.
- No flock on long-running jobs — if a job takes 10 min and runs every 5 min, instances pile up; use `flock -n /tmp/lock -c 'cmd'` to skip if already running.
- Assuming cron has your $PATH — cron's PATH is minimal (/usr/bin:/bin); use absolute paths or set PATH at the top of your crontab.

### Real-World Applications

- Let's Encrypt's certbot is typically run via cron or systemd timer to renew TLS certificates every 12 hours.
- AWS RDS automated backups are triggered via cron-like internal schedulers in the RDS control plane.
- Logrotate ships with /etc/cron.daily/logrotate on most Linux distros (or a systemd timer on systemd-based systems).
- Netflix's internal autoscaler runs every 60 seconds via systemd timer, querying metrics and adjusting ASG desired capacity.

### Interview Questions

- 1. What's the format of a crontab entry? — 5 fields (minute hour day-of-month month day-of-week) followed by the command; * means "any value", */N means "every N units".
- 2. Why do cron jobs fail with "command not found" when they work from your shell? — Cron's PATH is minimal (often just /usr/bin:/bin); either set PATH in crontab or use absolute paths.
- 3. How do you escape % in a crontab? — Backslash-escape it (\%); % is special in crontab (becomes a newline). Best practice: wrap complex commands in a script.
- 4. How do you prevent overlapping cron runs? — `flock -n /tmp/lock -c 'cmd'` — if the lock is held, the new instance exits immediately; or `flock -w 60` to wait up to 60s.
- 5. What advantage does a systemd timer have over cron? — Sub-second precision, monotonic clocks, dependencies between units, built-in journald logging, Persistent= to run missed jobs on boot, and `systemctl list-timers` visibility.

### Mini Project

Build a "db_backup.sh" scheduled backup: A script that dumps a PostgreSQL database to a timestamped .sql.gz file, keeps the last 7 days of backups, and is wired to run via both cron and a systemd timer. It uses flock to prevent overlap. Suggested approach:
  - Start with `set -euo pipefail`; require PGHOST, PGDATABASE, etc. via ${VAR:?msg}
  - Acquire a lock with `exec 9>/tmp/dbbackup.lock; flock -n 9 || exit 0`
  - Dump: `pg_dump "$PGDATABASE" | gzip > "$BACKUP_DIR/$(date +%F).sql.gz"`
  - Prune: `find "$BACKUP_DIR" -name '*.sql.gz' -mtime +7 -delete`
  - Provide a sample crontab line and a sample .timer + .service file in comments

### Exercises

1. Run `crontab -l` to view your current crontab; if empty, add a job that touches /tmp/hourly every hour.
2. Add `* * * * * date +\%H:\%M >> /tmp/minutely.log` and verify it appends every minute.
3. Use `flock -n /tmp/test.lock -c 'sleep 60'` in two terminals; verify the second exits immediately.
4. Create a systemd .service + .timer that runs `echo hi > /tmp/test` every minute; enable and start the timer.
5. Use `journalctl -u yourservice -f` to watch the timer's output in real time.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How many time fields does a crontab entry have?
9. A) 3
10. B) 5 (*)
11. C) 7
12. D) 6
13. Explanation: Five fields: minute, hour, day-of-month, month, day-of-week. * matches any value; */N means "every N units"; ranges (1-5) and lists (1,3,5) are supported.
14. Q2: What is cron's default shell?
15. A) /bin/bash
16. B) /bin/zsh
17. C) /bin/sh (often dash on Debian/Ubuntu) (*)
18. D) Whatever the user's login shell is
19. Explanation: cron uses /bin/sh by default, which on Debian/Ubuntu is dash — a POSIX-only shell. Bash-isms like [[ ]] fail unless you set SHELL=/bin/bash in the crontab.
20. Q3: How do you escape % in a crontab command?
21. A) %%
22. B) %%
23. C) %
24. D) \% (*)
25. Explanation: % is special in crontab (it becomes a newline, like in `date`); escape with backslash: `date +\%Y-\%m-\%d`. Best practice: wrap in a script.
26. Q4: What does cron's PATH typically contain?
27. A) A minimal /usr/bin:/bin (*)
28. B) Your full $PATH from .bashrc
29. C) /sbin only
30. D) Nothing — you must set PATH explicitly
31. Explanation: cron's PATH is minimal; it does NOT source your .bashrc or .profile. Either set PATH at the top of the crontab or use absolute paths to all binaries.
32. Q5: How do you prevent overlapping cron runs of the same job?
33. A) Use a PID file
34. B) flock -n /tmp/lock -c 'cmd' (*)
35. C) Run as root
36. D) Use crontab -l first
37. Explanation: `flock -n /tmp/myapp.lock -c 'cmd'` tries to acquire the lock non-interactively; if held, it exits 0 immediately (or use -w 60 to wait).
38. Q6: Which cron entry runs only at system boot?
39. A) @boot
40. B) 0 0 1 1 *
41. C) @reboot (*)
42. D) @startup
43. Explanation: @reboot runs the command once when cron starts (typically at boot). Other special entries: @yearly, @monthly, @weekly, @daily, @hourly.
44. Q7: What does `Persistent=true` do in a systemd .timer?
45. A) Keeps the timer running after reboot only
46. B) Makes the timer read-only
47. C) Logs to a persistent journal
48. D) Runs missed jobs on boot (like anacron) (*)
49. Explanation: Persistent=true (with OnCalendar) means "if the system was off when the timer should have fired, run it once on next boot" — like anacron for laptops.
50. Q8: Why might a cron job that reads from stdin hang forever?
51. A) Cron has no controlling terminal; reads block or get EOF — redirect stdin from /dev/null (*)
52. B) Cron jobs can't read stdin
53. C) Cron runs in a chroot
54. D) Cron disables stdin for security
55. Explanation: Cron jobs have no tty; a `read` gets immediate EOF (not block). If your script tries to read interactively, it gets EOF; redirect stdin from /dev/null explicitly to be safe.
56. Q9: Which systemd command shows all active timers?
57. A) systemctl list-units --type=timer
58. B) systemctl list-timers --all (*)
59. C) systemctl timers
60. D) journalctl --timers
61. Explanation: `systemctl list-timers --all` shows every timer (active or not) with its next/last trigger and the unit it activates. Drop --all for active only.
62. Q10: What's a key advantage of systemd timers over cron?
63. A) They are simpler to write
64. B) They don't require root
65. C) Sub-second precision, dependencies, journald logging, and Persistent= to catch missed runs (*)
66. D) They have a friendlier editor
67. Explanation: systemd timers offer OnCalendar, OnBootSec, monotonic clocks, unit dependencies, automatic journald logging, Persistent= to run missed jobs on boot, and visibility via `systemctl list-timers`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How many time fields does a crontab entry have?
  options:
    - "3"
    - "5"
    - "7"
    - "6"
  correctIndex: 1
  explanation: 'Five fields: minute, hour, day-of-month, month, day-of-week. * matches any value; */N means "every N units"; ranges (1-5) and lists (1,3,5) are supported.'
- id: q2
  question: What is cron's default shell?
  options:
    - /bin/bash
    - /bin/zsh
    - /bin/sh (often dash on Debian/Ubuntu)
    - Whatever the user's login shell is
  correctIndex: 2
  explanation: cron uses /bin/sh by default, which on Debian/Ubuntu is dash — a POSIX-only shell. Bash-isms like [[ ]] fail unless you set SHELL=/bin/bash in the crontab.
- id: q3
  question: How do you escape % in a crontab command?
  options:
    - "%%"
    - "%%"
    - "%"
    - \%
  correctIndex: 3
  explanation: "% is special in crontab (it becomes a newline, like in `date`); escape with backslash: `date +\\%Y-\\%m-\\%d`. Best practice: wrap in a script."
- id: q4
  question: What does cron's PATH typically contain?
  options:
    - A minimal /usr/bin:/bin
    - Your full $PATH from .bashrc
    - /sbin only
    - Nothing — you must set PATH explicitly
  correctIndex: 0
  explanation: cron's PATH is minimal; it does NOT source your .bashrc or .profile. Either set PATH at the top of the crontab or use absolute paths to all binaries.
- id: q5
  question: How do you prevent overlapping cron runs of the same job?
  options:
    - Use a PID file
    - flock -n /tmp/lock -c 'cmd'
    - Run as root
    - Use crontab -l first
  correctIndex: 1
  explanation: "`flock -n /tmp/myapp.lock -c 'cmd'` tries to acquire the lock non-interactively; if held, it exits 0 immediately (or use -w 60 to wait)."
- id: q6
  question: Which cron entry runs only at system boot?
  options:
    - "@boot"
    - 0 0 1 1 *
    - "@reboot"
    - "@startup"
  correctIndex: 2
  explanation: "@reboot runs the command once when cron starts (typically at boot). Other special entries: @yearly, @monthly, @weekly, @daily, @hourly."
- id: q7
  question: What does `Persistent=true` do in a systemd .timer?
  options:
    - Keeps the timer running after reboot only
    - Makes the timer read-only
    - Logs to a persistent journal
    - Runs missed jobs on boot (like anacron)
  correctIndex: 3
  explanation: Persistent=true (with OnCalendar) means "if the system was off when the timer should have fired, run it once on next boot" — like anacron for laptops.
- id: q8
  question: Why might a cron job that reads from stdin hang forever?
  options:
    - Cron has no controlling terminal; reads block or get EOF — redirect stdin from /dev/null
    - Cron jobs can't read stdin
    - Cron runs in a chroot
    - Cron disables stdin for security
  correctIndex: 0
  explanation: Cron jobs have no tty; a `read` gets immediate EOF (not block). If your script tries to read interactively, it gets EOF; redirect stdin from /dev/null explicitly to be safe.
- id: q9
  question: Which systemd command shows all active timers?
  options:
    - systemctl list-units --type=timer
    - systemctl list-timers --all
    - systemctl timers
    - journalctl --timers
  correctIndex: 1
  explanation: "`systemctl list-timers --all` shows every timer (active or not) with its next/last trigger and the unit it activates. Drop --all for active only."
- id: q10
  question: What's a key advantage of systemd timers over cron?
  options:
    - They are simpler to write
    - They don't require root
    - Sub-second precision, dependencies, journald logging, and Persistent= to catch missed runs
    - They have a friendlier editor
  correctIndex: 2
  explanation: systemd timers offer OnCalendar, OnBootSec, monotonic clocks, unit dependencies, automatic journald logging, Persistent= to run missed jobs on boot, and visibility via `systemctl list-timers`.
```

