---
slug: bash-build-real-world-cli-capstone-prep
id: bash-20
track: bash
order: 20
title: Build a Real-World CLI and Capstone Prep
description: Bring everything together — design a maintainable multi-file Bash CLI with a lib/ structure, subcommands, help, logging, config, signal handling, and version checks — and prep for the capstone project.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=3800s
whyItMatters: Bring everything together — design a maintainable multi-file Bash CLI with a lib/ structure, subcommands, help, logging, config, signal handling, and version checks — and prep for the capstone project.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Build a Real-World CLI and Capstone Prep

## Build a Real-World CLI and Capstone Prep

### Why It Matters

Bring everything together — design a maintainable multi-file Bash CLI with a lib/ structure, subcommands, help, logging, config, signal handling, and version checks — and prep for the capstone project.

Bring everything together — design a maintainable multi-file Bash CLI with a lib/ structure, subcommands, help, logging, config, signal handling, and version checks — and prep for the capstone project.

### Prerequisites

- Stage 1-19: all prior Bash concepts
- Completion of at least one mini project from prior stages

### Topics

- Multi-file Bash: main script + lib/ + sourced helpers
- Subcommand dispatch with shared global state
- Logging levels (DEBUG/INFO/WARN/ERROR) with timestamps
- Config file loading (.myapprc) with section support
- Robust argument parsing (getopts + manual long options)
- Signal handling (trap INT TERM EXIT) and cleanup
- Version checks and feature detection
- Man page generation and shell completion
- Pre-capstone checklist: tests, lint, CI, docs

### Key Concepts

- A real Bash CLI lives in multiple files: a top-level `myapp` (or `myapp.sh`) that sources lib/*.sh files for subcommands and helpers.
- Define a `log()` function that prints to stderr with a level prefix and timestamp — keeps stdout clean for piping.
- Load config from $HOME/.myapprc (or $XDG_CONFIG_HOME/myapp/config) with sensible defaults via `${VAR:-default}`.
- Subcommand dispatch via `case "$cmd" in deploy) deploy_cmd "$@" ;; ...` — pass remaining args to each subcommand function.
- `trap cleanup EXIT` to remove temp files, kill child processes, and write a final log line — regardless of how the script exits.
- Feature detection: `command -v curl >/dev/null || { echo "curl required" >&2; exit 1; }` — never assume a tool is installed.
- Generate shell completion with `complete -F _myapp myapp` and a `_myapp` function that case-dispatches on subcommand.

```text
myapp/
    myapp               # main executable
    lib/
        common.sh       # logging, helpers, defaults
        deploy.sh       # deploy subcommand
        rollback.sh     # rollback subcommand
        status.sh       # status subcommand
    completions/
        myapp.bash      # bash completion script
    man/
        myapp.1         # man page
    tests/
        test.bats       # bats-core tests
```
Caption: Multi-file CLI structure

### Common Pitfalls

- Hardcoding paths to binaries — use `command -v` to find them or rely on PATH; on different distros curl lives in /usr/bin or /bin.
- Skipping the cleanup trap — orphan temp files and child processes accumulate; trap EXIT to clean up no matter what.
- Mixing stdout (data) and stderr (logs) — your CLI's machine-readable output should be on stdout; logs and human messages on stderr so users can pipe cleanly.
- Not versioning the CLI — embed a VERSION constant and expose `myapp version`; check on startup to warn about upgrades.
- Forgetting shell completion — users expect tab-completion in modern CLIs; ship a completion script and document `source completions/myapp.bash` in the README.

### Real-World Applications

- The `hub` CLI (GitHub on the command line) is partly Bash with subcommands like hub pull-request.
- The Heroku Toolbelt v3 shipped a Bash wrapper for the heroku command before the rewrite in Go.
- The Docker `docker-entrypoint.sh` for mysql is a multi-file Bash CLI with config parsing, subcommand dispatch, and signal handling.
- The Android NDK's `ndk-build` is a Bash script that wraps make with a clean CLI surface.

### Interview Questions

- 1. How do you structure a multi-file Bash CLI? — Top-level executable that sources lib/*.sh files; each subcommand lives in its own file with a `<name>_cmd` function; common helpers in lib/common.sh.
- 2. Why log to stderr instead of stdout? — Stdout is for machine-readable data; stderr is for logs and human messages. This lets users pipe your CLI's output cleanly.
- 3. How do you detect if a command is available? — `command -v curl >/dev/null 2>&1` (POSIX) or `which curl`; bail early with a clear error if required tools are missing.
- 4. What goes in a cleanup trap? — Remove temp dirs, kill background processes, write a final log line, release locks. Trap EXIT INT TERM so it fires on any exit.
- 5. How do you ship shell completion? — Write a `_myapp` function that case-dispatches on the current word and use `complete -F _myapp myapp`; document `source`-ing it in .bashrc or installing to /etc/bash_completion.d/.

### Mini Project

Build a "deployctl" CLI scaffold (capstone prep): A multi-file Bash CLI with subcommands (init, build, deploy, status, rollback), logging, config loading from ~/.deployctlrc, signal handling, and a basic bats test. This is a smaller version of the capstone project — focus on structure, not features. Suggested approach:
  - Create the directory layout (myapp, lib/common.sh, lib/deploy.sh, tests/test.bats)
  - Implement common.sh with log_info/log_error, cleanup trap, require_cmd
  - Implement deploy.sh with deploy_cmd that takes --env and --tag args
  - Add a usage() function and a `help` subcommand
  - Write 3 bats tests: unknown command exits 2, `version` prints version, `--help` exits 0
  - Run shellcheck on every file; fix all warnings

### Exercises

1. Create a two-file Bash CLI (myapp + lib/common.sh) where myapp sources common.sh and calls a helper function.
2. Add a `log_info` function that writes to stderr with a timestamp; call it from a subcommand.
3. Add a `version` subcommand that prints a VERSION constant from the main script.
4. Write a bats test that asserts `myapp unknown-cmd` exits with code 2.
5. Add `trap cleanup EXIT` and a cleanup function that removes a temp dir; verify it runs on Ctrl-C.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Where should a Bash CLI's logs go?
9. A) stdout
10. B) /var/log/myapp.log only
11. C) syslog only
12. D) stderr — keeps stdout clean for machine-readable data (*)
13. Explanation: Stdout is for data the user might pipe (e.g. `myapp status | jq`); logs and human messages go to stderr so they don't corrupt the data stream.
14. Q2: How do you structure a multi-file Bash CLI?
15. A) Top-level executable sources lib/*.sh files; subcommands in separate files (*)
16. B) One big script
17. C) Compile with bash-cc
18. D) Inline functions only
19. Explanation: A top-level executable that sources lib/*.sh keeps each subcommand in its own file (deploy.sh, rollback.sh) and shared helpers in lib/common.sh; this is maintainable and ShellCheck-friendly.
20. Q3: How do you detect if `curl` is installed?
21. A) test -f /usr/bin/curl
22. B) command -v curl >/dev/null 2>&1 (*)
23. C) which curl (always)
24. D) ps curl
25. Explanation: `command -v curl` is POSIX and uses PATH; it returns 0 if curl is found, 1 if not. `which` is non-POSIX and may not exist in minimal containers.
26. Q4: What does `trap cleanup EXIT INT TERM` ensure?
27. A) Cleanup runs only on Ctrl-C
28. B) Cleanup never runs
29. C) Cleanup runs on any exit (normal, error, signal) and on INT/TERM signals (*)
30. D) Cleanup runs twice on exit
31. Explanation: EXIT fires on any termination (normal exit, set -e failure, uncaught signal); INT and TERM explicitly fire on those signals. Listing all three ensures cleanup in every scenario.
32. Q5: Why expose a `version` subcommand?
33. A) For marketing
34. B) It's required by POSIX
35. C) It speeds up the CLI
36. D) Lets users (and CI) check the installed version; enables upgrade detection and reproducible bug reports (*)
37. Explanation: A version subcommand embeds VERSION in the script and lets users verify they have the right build; CI can assert the deployed version matches expectations.
38. Q6: How do you dispatch subcommands like git (myapp deploy, myapp rollback)?
39. A) case "$1" in deploy) deploy_cmd "$@" ;; ... (*)
40. B) if/elif chain
41. C) eval "$1_cmd"
42. D) function dispatch
43. Explanation: A case statement on $1 (then shift to remove it) is the standard pattern; pass remaining "$@" to the subcommand function. Eval would be a code-injection risk.
44. Q7: Why use `command -v` instead of hardcoded `/usr/bin/curl`?
45. A) Performance
46. B) curl may live in /bin/curl, /usr/local/bin/curl, or /opt/homebrew/bin/curl; command -v respects PATH (*)
47. C) command -v is faster
48. D) Hardcoded paths are POSIX-illegal
49. Explanation: Different distros and Homebrew layouts put binaries in different paths; command -v finds them via PATH. Hardcoded paths break portability.
50. Q8: Where should shell completion scripts be installed?
51. A) Anywhere
52. B) /tmp only
53. C) /etc/bash_completion.d/ or sourced from .bashrc; document both options (*)
54. D) In the user's home directory only
55. Explanation: System-wide: /etc/bash_completion.d/myapp (or /usr/share/bash-completion/completions/). Per-user: source from .bashrc. Document both in the README.
56. Q9: What should the cleanup trap do?
57. A) Only print "bye"
58. B) Restart the script
59. C) Send an email
60. D) Remove temp dirs, kill child processes, release locks, write a final log line (*)
61. Explanation: Cleanup removes temp files (rm -rf $_TMPDIR), kills child PIDs, releases flock locks, and optionally logs "exiting". Trap EXIT INT TERM so it fires on any termination.
62. Q10: Which feature check pattern is safest for Bash 4+ features?
63. A) (( BASH_VERSINFO[0] >= 4 )) at the top; bail with a clear message if not (*)
64. B) Try the feature and see if it errors
65. C) Check $BASH_VERSION string
66. D) Assume Bash 5+ everywhere
67. Explanation: BASH_VERSINFO[0] is the major version as an integer (easy to compare arithmetically); check it at the top and exit with a clear "Requires Bash 4.0+" message rather than failing cryptically later.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: Where should a Bash CLI's logs go?
  options:
    - stdout
    - /var/log/myapp.log only
    - syslog only
    - stderr — keeps stdout clean for machine-readable data
  correctIndex: 3
  explanation: Stdout is for data the user might pipe (e.g. `myapp status | jq`); logs and human messages go to stderr so they don't corrupt the data stream.
- id: q2
  question: How do you structure a multi-file Bash CLI?
  options:
    - Top-level executable sources lib/*.sh files; subcommands in separate files
    - One big script
    - Compile with bash-cc
    - Inline functions only
  correctIndex: 0
  explanation: A top-level executable that sources lib/*.sh keeps each subcommand in its own file (deploy.sh, rollback.sh) and shared helpers in lib/common.sh; this is maintainable and ShellCheck-friendly.
- id: q3
  question: How do you detect if `curl` is installed?
  options:
    - test -f /usr/bin/curl
    - command -v curl >/dev/null 2>&1
    - which curl (always)
    - ps curl
  correctIndex: 1
  explanation: "`command -v curl` is POSIX and uses PATH; it returns 0 if curl is found, 1 if not. `which` is non-POSIX and may not exist in minimal containers."
- id: q4
  question: What does `trap cleanup EXIT INT TERM` ensure?
  options:
    - Cleanup runs only on Ctrl-C
    - Cleanup never runs
    - Cleanup runs on any exit (normal, error, signal) and on INT/TERM signals
    - Cleanup runs twice on exit
  correctIndex: 2
  explanation: EXIT fires on any termination (normal exit, set -e failure, uncaught signal); INT and TERM explicitly fire on those signals. Listing all three ensures cleanup in every scenario.
- id: q5
  question: Why expose a `version` subcommand?
  options:
    - For marketing
    - It's required by POSIX
    - It speeds up the CLI
    - Lets users (and CI) check the installed version; enables upgrade detection and reproducible bug reports
  correctIndex: 3
  explanation: A version subcommand embeds VERSION in the script and lets users verify they have the right build; CI can assert the deployed version matches expectations.
- id: q6
  question: How do you dispatch subcommands like git (myapp deploy, myapp rollback)?
  options:
    - case "$1" in deploy) deploy_cmd "$@" ;; ...
    - if/elif chain
    - eval "$1_cmd"
    - function dispatch
  correctIndex: 0
  explanation: A case statement on $1 (then shift to remove it) is the standard pattern; pass remaining "$@" to the subcommand function. Eval would be a code-injection risk.
- id: q7
  question: Why use `command -v` instead of hardcoded `/usr/bin/curl`?
  options:
    - Performance
    - curl may live in /bin/curl, /usr/local/bin/curl, or /opt/homebrew/bin/curl; command -v respects PATH
    - command -v is faster
    - Hardcoded paths are POSIX-illegal
  correctIndex: 1
  explanation: Different distros and Homebrew layouts put binaries in different paths; command -v finds them via PATH. Hardcoded paths break portability.
- id: q8
  question: Where should shell completion scripts be installed?
  options:
    - Anywhere
    - /tmp only
    - /etc/bash_completion.d/ or sourced from .bashrc; document both options
    - In the user's home directory only
  correctIndex: 2
  explanation: "System-wide: /etc/bash_completion.d/myapp (or /usr/share/bash-completion/completions/). Per-user: source from .bashrc. Document both in the README."
- id: q9
  question: What should the cleanup trap do?
  options:
    - Only print "bye"
    - Restart the script
    - Send an email
    - Remove temp dirs, kill child processes, release locks, write a final log line
    - ', kills child PIDs, releases flock locks, and optionally logs "exiting". Trap EXIT INT TERM so it fires on any termination.'
  correctIndex: 3
  explanation: Cleanup removes temp files (rm -rf $_TMPDIR), kills child PIDs, releases flock locks, and optionally logs "exiting". Trap EXIT INT TERM so it fires on any termination.
- id: q10
  question: Which feature check pattern is safest for Bash 4+ features?
  options:
    - (( BASH_VERSINFO[0] >= 4 )) at the top; bail with a clear message if not
    - Try the feature and see if it errors
    - Check $BASH_VERSION string
    - Assume Bash 5+ everywhere
  correctIndex: 0
  explanation: BASH_VERSINFO[0] is the major version as an integer (easy to compare arithmetically); check it at the top and exit with a clear "Requires Bash 4.0+" message rather than failing cryptically later.
```

