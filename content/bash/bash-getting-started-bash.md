---
slug: bash-getting-started-bash
id: bash-01
track: bash
order: 1
title: Getting Started with Bash
description: Install Bash, write your first script, understand the shell vs terminal distinction, and run scripts three different ways.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4
whyItMatters: Install Bash, write your first script, understand the shell vs terminal distinction, and run scripts three different ways.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Getting Started with Bash

## Getting Started with Bash

### Why It Matters

Install Bash, write your first script, understand the shell vs terminal distinction, and run scripts three different ways.

Install Bash, write your first script, understand the shell vs terminal distinction, and run scripts three different ways.

### Prerequisites

- None — this is the entry point for the Bash track.
- Familiarity with a terminal emulator (opening one, typing commands).
- A POSIX-like system: Linux, macOS, or WSL on Windows.

### Topics

- What is a shell? Terminal vs shell vs console
- Bash history and where it ships (Linux distros, macOS, WSL, Docker base images)
- Bash 5.x features (assoc arrays, ${var^}, mapfile, BASH_VERSINFO)
- bash vs sh vs dash vs zsh (portability vs features)
- The shebang line: #!/usr/bin/env bash
- Making a script executable with chmod +x
- The PATH variable and how commands resolve
- Running a script three ways: ./script, bash script, source script

### Key Concepts

- A shell is a command interpreter; a terminal is the window that hosts it.
- #!/usr/bin/env bash is more portable than #!/bin/bash across distros, BSDs, and Homebrew on macOS.
- Bash 5.0 (2019) added ${var^}/${var,} case modification and others; macOS still ships 3.2 by default.
- The exit status of the last command lives in $?; 0 means success, 1-255 failure, >128 killed by signal.
- source (or .) executes in the current shell; ./script spawns a subshell so variable changes don't leak back.
- Without the executable bit, ./script fails with "Permission denied" even if the file is readable.

```bash
#!/usr/bin/env bash
# Save as hello.sh and run with: ./hello.sh
echo "Hello, World!"
echo "Running on Bash $BASH_VERSION"
```
Caption: Hello World

### Common Pitfalls

- Assuming #!/bin/sh is the same as #!/bin/bash — on Debian/Ubuntu /bin/sh is dash, a POSIX-only shell; bash-isms like [[ ]] and arrays will fail.
- Forgetting to chmod +x — running ./script gives "Permission denied"; fix with `chmod +x script` or run via `bash script`.
- Using #!/bin/bash instead of #!/usr/bin/env bash — env searches PATH so it finds Bash on NixOS, macOS/Homebrew, and BSDs where Bash isn't in /bin.
- macOS shipping Bash 3.2 — Apple froze Bash at 3.2 due to GPLv3; install Bash 5 via Homebrew (`brew install bash`) for modern features.
- Confusing `source` with executing — `source script` runs in the current shell so variables persist; `./script` runs in a subshell so they don't.

### Real-World Applications

- GitLab CI/CD runs every job's `script:` section in Bash by default; millions of pipelines per day depend on Bash.
- GitHub Actions' ubuntu-latest runners default to Bash for `run:` steps; the popular `actions/checkout` is invoked by a Bash wrapper.
- Netflix's Spinnaker bake scripts and many on-call runbooks are written in Bash because every EC2 instance has it preinstalled.
- Docker's `RUN` instructions in Debian/Ubuntu base images execute under /bin/sh (dash) by default — switching to `SHELL ["/bin/bash", "-c"]` enables bash syntax in Dockerfiles.

### Interview Questions

- 1. What's the difference between a terminal and a shell? — A terminal is the window/PTY app (gnome-terminal, iTerm); the shell (bash, zsh) is the interpreter that reads commands inside it.
- 2. Why does `#!/usr/bin/env bash` beat `#!/bin/bash`? — env searches PATH, so it finds Bash wherever installed (Homebrew on macOS, NixOS, BSDs), improving portability.
- 3. What does `$?` hold? — The exit status of the most recently executed command; 0 = success, 1-255 = failure, codes above 128 indicate signal death.
- 4. What's the difference between `source script.sh` and `./script.sh`? — source runs in the current shell (variables persist); ./script spawns a subshell (variables don't leak).
- 5. Why does Debian's /bin/sh reject `[[ ]]`? — /bin/sh is dash on Debian/Ubuntu, a POSIX shell that doesn't support bash's `[[`; use `[ ]` for portability or set the shebang to bash.

### Mini Project

Build a "system_info.sh" script: A CLI that prints the OS name, kernel version, uptime, current shell, and Bash version in a labeled box. It takes no arguments and outputs 5 labeled lines wrapped in a simple ASCII border. Suggested approach:
  - Use uname -srm for OS and kernel info
  - Use uptime -p (Linux) or `uptime` (macOS) for uptime
  - Use $SHELL and $BASH_VERSION for shell info
  - Draw a 44-char-wide border with printf and hyphens
  - Make the script executable and test all three execution methods

### Exercises

1. Install Bash 5 (`brew install bash` on macOS or your distro's package manager) and verify `bash --version` reports 5.x.
2. Write hello.sh with the env shebang, mark it executable, and run it three ways; observe which execution method leaks variables.
3. Run `ls /nonexistent; echo $?` and explain the non-zero exit code.
4. Find where Bash lives on your system with `command -v bash` and `which -a bash`.
5. Compare `cat /etc/shells` on Linux and macOS; note which shells are available.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the difference between a terminal and a shell?
9. A) The terminal is the window app; the shell is the command interpreter inside it (*)
10. B) They are the same thing
11. C) The shell is the window; the terminal interprets commands
12. D) A terminal requires a GUI; a shell does not
13. Explanation: A terminal emulator (gnome-terminal, iTerm2) is the program hosting a TTY; the shell (bash, zsh) is the interpreter that runs inside it.
14. Q2: Which shebang is the most portable for Bash scripts?
15. A) #!/bin/bash
16. B) #!/usr/bin/env bash (*)
17. C) #!/usr/bin/bash
18. D) #!bash
19. Explanation: env searches PATH, so it finds Bash wherever it's installed (Homebrew, NixOS, BSDs), unlike hardcoded paths.
20. Q3: On Debian/Ubuntu, what is /bin/sh typically?
21. A) bash
22. B) zsh
23. C) dash (*)
24. D) ksh
25. Explanation: Debian and Ubuntu symlink /bin/sh to dash, a minimal POSIX shell, for faster boot scripts.
26. Q4: What does `$?` contain immediately after a command runs?
27. A) The PID of the command
28. B) The command's name
29. C) The wall-clock duration of the command
30. D) The exit status of the last command (*)
31. Explanation: $? holds the exit code of the most recent command: 0 for success, 1-255 for failure, >128 for signals.
32. Q5: Why does `./script.sh` fail with "Permission denied" even though the file is readable?
33. A) The executable bit is not set; chmod +x fixes it (*)
34. B) The script has a syntax error
35. C) Bash is not installed
36. D) The shebang is wrong
37. Explanation: Direct execution requires the executable bit; readable but non-executable files can still be run via `bash script.sh`.
38. Q6: What's the difference between `source script.sh` and `./script.sh`?
39. A) No difference
40. B) source runs in the current shell; ./script spawns a subshell (*)
41. C) source spawns a subshell; ./script runs in the current shell
42. D) source only works in zsh
43. Explanation: source (or .) executes the script in the current shell so variable and function definitions persist; ./ spawns a child.
44. Q7: Which Bash version is preinstalled on macOS (without Homebrew)?
45. A) 5.0
46. B) 4.4
47. C) 3.2 (*)
48. D) 2.05
49. Explanation: Apple ships Bash 3.2 (the last GPLv2 version) due to GPLv3 licensing concerns; `brew install bash` gives 5.x.
50. Q8: What does `chmod +x script.sh` do?
51. A) Compiles the script
52. B) Adds the script to PATH
53. C) Removes read permission
54. D) Adds the executable bit for user, group, and other (*)
55. Explanation: chmod +x toggles on the executable bit for all three permission classes (u/g/o), enabling ./script execution.
56. Q9: Which command shows where Bash is installed?
57. A) command -v bash or which bash (*)
58. B) whereis bash only
59. C) find / bash
60. D) locate bash
61. Explanation: `command -v bash` is POSIX and reliable; `which bash` is common; both print the path to the first bash in PATH.
62. Q10: What is Bash primarily?
63. A) A compiled language
64. B) A shell and scripting language interpreter (*)
65. C) A text editor
66. D) A package manager
67. Explanation: Bash (Bourne-Again Shell) is both an interactive command interpreter and a scripting language; it interprets rather than compiles.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the difference between a terminal and a shell?
  options:
    - The terminal is the window app; the shell is the command interpreter inside it
    - They are the same thing
    - The shell is the window; the terminal interprets commands
    - A terminal requires a GUI; a shell does not
  correctIndex: 0
  explanation: A terminal emulator (gnome-terminal, iTerm2) is the program hosting a TTY; the shell (bash, zsh) is the interpreter that runs inside it.
- id: q2
  question: Which shebang is the most portable for Bash scripts?
  options:
    - "#!/bin/bash"
    - "#!/usr/bin/env bash"
    - "#!/usr/bin/bash"
    - "#!bash"
  correctIndex: 1
  explanation: env searches PATH, so it finds Bash wherever it's installed (Homebrew, NixOS, BSDs), unlike hardcoded paths.
- id: q3
  question: On Debian/Ubuntu, what is /bin/sh typically?
  options:
    - bash
    - zsh
    - dash
    - ksh
  correctIndex: 2
  explanation: Debian and Ubuntu symlink /bin/sh to dash, a minimal POSIX shell, for faster boot scripts.
- id: q4
  question: What does `$?` contain immediately after a command runs?
  options:
    - The PID of the command
    - The command's name
    - The wall-clock duration of the command
    - The exit status of the last command
  correctIndex: 3
  explanation: "$? holds the exit code of the most recent command: 0 for success, 1-255 for failure, >128 for signals."
- id: q5
  question: Why does `./script.sh` fail with "Permission denied" even though the file is readable?
  options:
    - The executable bit is not set; chmod +x fixes it
    - The script has a syntax error
    - Bash is not installed
    - The shebang is wrong
  correctIndex: 0
  explanation: Direct execution requires the executable bit; readable but non-executable files can still be run via `bash script.sh`.
- id: q6
  question: What's the difference between `source script.sh` and `./script.sh`?
  options:
    - No difference
    - source runs in the current shell; ./script spawns a subshell
    - source spawns a subshell; ./script runs in the current shell
    - source only works in zsh
  correctIndex: 1
  explanation: source (or .) executes the script in the current shell so variable and function definitions persist; ./ spawns a child.
- id: q7
  question: Which Bash version is preinstalled on macOS (without Homebrew)?
  options:
    - "5.0"
    - "4.4"
    - "3.2"
    - "2.05"
  correctIndex: 2
  explanation: Apple ships Bash 3.2 (the last GPLv2 version) due to GPLv3 licensing concerns; `brew install bash` gives 5.x.
- id: q8
  question: What does `chmod +x script.sh` do?
  options:
    - Compiles the script
    - Adds the script to PATH
    - Removes read permission
    - Adds the executable bit for user, group, and other
  correctIndex: 3
  explanation: chmod +x toggles on the executable bit for all three permission classes (u/g/o), enabling ./script execution.
- id: q9
  question: Which command shows where Bash is installed?
  options:
    - command -v bash or which bash
    - whereis bash only
    - find / bash
    - locate bash
  correctIndex: 0
  explanation: "`command -v bash` is POSIX and reliable; `which bash` is common; both print the path to the first bash in PATH."
- id: q10
  question: What is Bash primarily?
  options:
    - A compiled language
    - A shell and scripting language interpreter
    - A text editor
    - A package manager
  correctIndex: 1
  explanation: Bash (Bourne-Again Shell) is both an interactive command interpreter and a scripting language; it interprets rather than compiles.
```

