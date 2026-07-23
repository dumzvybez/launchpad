---
slug: bash-command-substitution-arithmetic
id: bash-03
track: bash
order: 3
title: Command Substitution and Arithmetic
description: Capture command output into variables with $(), perform integer arithmetic with $(()), and understand the limits of Bash math (no floats — use bc or awk).
difficulty: beginner
estMinutes: 105
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=400s
whyItMatters: Capture command output into variables with $(), perform integer arithmetic with $(()), and understand the limits of Bash math (no floats — use bc or awk).
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Command Substitution and Arithmetic

## Command Substitution and Arithmetic

### Why It Matters

Capture command output into variables with $(), perform integer arithmetic with $(()), and understand the limits of Bash math (no floats — use bc or awk).

Capture command output into variables with $(), perform integer arithmetic with $(()), and understand the limits of Bash math (no floats — use bc or awk).

### Prerequisites

- Stage 1: Getting Started with Bash
- Stage 2: Variables, Strings, and Parameter Expansion

### Topics

- Command substitution: $(cmd) vs backticks `cmd`
- Nesting $( $( $(...)) ) cleanly
- Arithmetic expansion: $(( expr ))
- Arithmetic operators: + - * / % ** (and C-style ++ -- +=)
- Bases: $(( 16#FF )), $(( 2#1010 )), $(( 8#77 ))
- let, declare -i, and the deprecated expr
- Why Bash has no floats — using bc, awk, or python for decimal math
- RANDOM, SRANDOM (Bash 5.1+), and seeding from /dev/urandom

### Key Concepts

- $(cmd) is preferred over backticks because it nests cleanly and reads better; backticks require backslash-escaping nested backticks.
- $(( expr )) performs integer arithmetic using C-like syntax; division truncates toward zero (no rounding).
- Inside $(()), variable names don't need $ (a=5; echo $(( a * 2 ))); using $a works too but is slightly slower.
- Bash integers are 64-bit signed; there is NO floating point — `echo $(( 1 / 3 ))` is `0`, not 0.333.
- $(( base#value )) converts from any base 2-64: $(( 16#FF )) = 255.
- RANDOM is 0-32767 (15-bit); SRANDOM (Bash 5.1+) is 32-bit and uses getrandom() for cryptographic-quality entropy.

```bash
now=$(date +%Y-%m-%d)
host=$(hostname)
files=$(ls | wc -l)
echo "Today is $now on $host with $files files"

# Nesting works cleanly with $()
kernel_major=$(uname -r | cut -d. -f1)
echo "Kernel major: $kernel_major"
```
Caption: Command substitution

### Common Pitfalls

- Using backticks `cmd` for nesting — `a=$(echo $(date))` is clean; `a=\`echo \`date\`\`` is unreadable and error-prone; always prefer $().
- Expecting `echo $(( 10 / 3 ))` to print 3.33 — Bash arithmetic is integer-only; pipe to bc or awk for floats.
- Confusing `(( ))` (test/execute, returns exit code) with `$(( ))` (expansion, returns value) — `(( x++ ))` increments; `echo $(( x++ ))` prints the old value AND increments.
- Forgetting that RANDOM is only 15-bit (0-32767) — for security tokens use SRANDOM (Bash 5.1+) or read from /dev/urandom with `od`/`xxd`.
- Using `expr $a + $b` (deprecated) — `expr` forks a process for every operation; `$(( a + b ))` is a built-in and ~100x faster in loops.

### Real-World Applications

- The Bash automated installers for nvm, pyenv, and rbenv all use `$(curl -fsSL URL | bash)` to fetch and pipe install scripts.
- Linux From Scratch (LFS) build scripts use $(( )) extensively for chapter and step counters without spawning expr.
- The Linux kernel's `make` shell wrappers use $(( )) for build-version arithmetic (patch-level computation).
- HashiCorp's Vagrant installer scripts use `$(uname -m)` to detect architecture and pick the right binary tarball.

### Interview Questions

- 1. Why is $(cmd) preferred over backticks? — It nests without escaping, composes more cleanly, and matches the syntax of $var and ${var}; backticks require ugly \`...\` nesting.
- 2. What's the result of `echo $(( 7 / 2 ))`? — 3, because Bash arithmetic is integer-only and truncates toward zero.
- 3. How would you compute 10/3 with 4 decimal places in Bash? — Pipe to bc: `echo "scale=4; 10/3" | bc` returns 3.3333.
- 4. What's the difference between `(( x++ ))` and `x=$(( x++ ))`? — The first just increments; the second assigns the OLD value of x to x, so x stays the same (post-increment returns pre-value).
- 5. How do you generate a random hex byte in pure Bash? — `printf '%02x' $(( RANDOM % 256 ))`; for cryptographic strength use `xxd -p -l1 /dev/urandom`.

### Mini Project

Build a "calc.sh" calculator: A CLI that takes an arithmetic expression as a single argument and prints the result. It auto-detects whether the expression needs floats (presence of `.` or `/` with non-divisible operands) and routes to $(( )) or bc accordingly. Suggested approach:
  - Parse $1 to detect presence of decimal point or operators requiring floats
  - If integer-only: use $(( expr )) and print the result
  - If float: echo "scale=6; $expr" | bc -l and print
  - Validate the expression with a regex before evaluation (no shell metachars)
  - Add a --hex flag to print the result in hex via `printf '%x'`

### Exercises

1. Assign `date_out=$(date)` and `date_out2=$(date +%s)`; print both and explain the difference.
2. Compute `15 / 4` three ways: with $(( )), with `expr 15 / 4`, and with `echo "scale=2; 15/4" | bc`; note the outputs.
3. Write a loop that prints numbers 1-10 using `(( i++ ))` and a while loop.
4. Convert hex `0xDEADBEEF` to decimal using $(( 16#DEADBEEF )); verify with `printf '%d'`.
5. Generate 5 random numbers in [1, 100] using $(( RANDOM % 100 + 1 )) and print them comma-separated.
6. >>> QUIZ (Stage 3) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is the preferred command-substitution syntax?
9. A) `cmd`
10. B) ${cmd}
11. C) $(cmd) (*)
12. D) #[cmd]
13. Explanation: $(cmd) nests cleanly without escaping and reads better; backticks require backslash-escaping for nesting.
14. Q2: What does `echo $(( 7 / 2 ))` print?
15. A) 3.5
16. B) 4
17. C) 0
18. D) 3 (*)
19. Explanation: Bash arithmetic is integer-only and truncates toward zero; 7/2 = 3, not 3.5.
20. Q3: How do you compute 10/3 to 4 decimal places from Bash?
21. A) echo "scale=4; 10/3" | bc (*)
22. B) echo $(( 10 / 3 ))
23. C) echo $(( scale=4; 10/3 ))
24. D) printf "%.4f" $(( 10/3 ))
25. Explanation: Bash has no floats; bc supports arbitrary precision with the scale variable.
26. Q4: Which computes the decimal value of hex FF?
27. A) $(( 0xFF ))
28. B) $(( 16#FF )) (*)
29. C) $(( hex(FF) ))
30. D) $(( FF ))
31. Explanation: $(( base#value )) converts from any base 2-64; 16#FF = 255. 0xFF also works as a literal but base# is the general form.
32. Q5: What is the range of $RANDOM?
33. A) 0 to 2^31-1
34. B) 0 to 65535
35. C) 0 to 32767 (*)
36. D) 1 to 100
37. Explanation: $RANDOM is 15-bit (0-32767); for higher range or cryptographic strength use SRANDOM (Bash 5.1+) or /dev/urandom.
38. Q6: What does `(( x++ ))` do?
39. A) Returns the new value of x
40. B) Prints x
41. C) Decrements x
42. D) Increments x and returns the old value's exit code (0 if x was non-zero) (*)
43. Explanation: (( )) executes arithmetic and returns an exit code (0 if result non-zero, 1 if zero); the increment side-effect happens regardless.
44. Q7: Why is `expr $a + $b` discouraged?
45. A) It forks a new process for every operation; $(( a + b )) is a builtin and far faster (*)
46. B) It only works on Linux
47. C) It only handles integers up to 100
48. D) It is deprecated and removed in Bash 5
49. Explanation: expr is an external binary; $(( )) is a Bash builtin. In a loop of 10000 iterations, expr can be 100x slower.
50. Q8: Which syntax converts binary 1010 to decimal?
51. A) $(( bin(1010) ))
52. B) $(( 2#1010 )) (*)
53. C) $(( 1010b ))
54. D) $(( 0b1010 ))
55. Explanation: $(( base#value )) works for bases 2-64; 2#1010 = 10.
56. Q9: What does `declare -i n=5; n=n+10; echo $n` print?
57. A) n+10
58. B) 5
59. C) 15 (*)
60. D) Error
61. Explanation: declare -i makes assignments auto-evaluate as arithmetic, so n=n+10 is treated as n=$(( n + 10 )) = 15.
62. Q10: Which Bash version introduced $SRANDOM (32-bit cryptographic-quality random)?
63. A) 4.0
64. B) 4.4
65. C) 3.2
66. D) 5.1 (*)
67. Explanation: SRANDOM was added in Bash 5.1 (2020) and uses getrandom() or /dev/urandom; useful for security tokens.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is the preferred command-substitution syntax?
  options:
    - "`cmd`"
    - ${cmd}
    - $(cmd)
    - "#[cmd]"
  correctIndex: 2
  explanation: $(cmd) nests cleanly without escaping and reads better; backticks require backslash-escaping for nesting.
- id: q2
  question: What does `echo $(( 7 / 2 ))` print?
  options:
    - "3.5"
    - "4"
    - "0"
    - "3"
  correctIndex: 3
  explanation: Bash arithmetic is integer-only and truncates toward zero; 7/2 = 3, not 3.5.
- id: q3
  question: How do you compute 10/3 to 4 decimal places from Bash?
  options:
    - echo "scale=4; 10/3" | bc
    - echo $(( 10 / 3 ))
    - echo $(( scale=4; 10/3 ))
    - printf "%.4f" $(( 10/3 ))
  correctIndex: 0
  explanation: Bash has no floats; bc supports arbitrary precision with the scale variable.
- id: q4
  question: Which computes the decimal value of hex FF?
  options:
    - $(( 0xFF ))
    - $(( 16#FF ))
    - $(( hex(FF) ))
    - $(( FF ))
  correctIndex: 1
  explanation: $(( base#value )) converts from any base 2-64; 16#FF = 255. 0xFF also works as a literal but base# is the general form.
- id: q5
  question: What is the range of $RANDOM?
  options:
    - 0 to 2^31-1
    - 0 to 65535
    - 0 to 32767
    - 1 to 100
  correctIndex: 2
  explanation: $RANDOM is 15-bit (0-32767); for higher range or cryptographic strength use SRANDOM (Bash 5.1+) or /dev/urandom.
- id: q6
  question: What does `(( x++ ))` do?
  options:
    - Returns the new value of x
    - Prints x
    - Decrements x
    - Increments x and returns the old value's exit code (0 if x was non-zero)
  correctIndex: 3
  explanation: (( )) executes arithmetic and returns an exit code (0 if result non-zero, 1 if zero); the increment side-effect happens regardless.
- id: q7
  question: Why is `expr $a + $b` discouraged?
  options:
    - It forks a new process for every operation; $(( a + b )) is a builtin and far faster
    - It only works on Linux
    - It only handles integers up to 100
    - It is deprecated and removed in Bash 5
  correctIndex: 0
  explanation: expr is an external binary; $(( )) is a Bash builtin. In a loop of 10000 iterations, expr can be 100x slower.
- id: q8
  question: Which syntax converts binary 1010 to decimal?
  options:
    - $(( bin(1010) ))
    - $(( 2#1010 ))
    - $(( 1010b ))
    - $(( 0b1010 ))
  correctIndex: 1
  explanation: $(( base#value )) works for bases 2-64; 2#1010 = 10.
- id: q9
  question: What does `declare -i n=5; n=n+10; echo $n` print?
  options:
    - n+10
    - "5"
    - "15"
    - Error
  correctIndex: 2
  explanation: declare -i makes assignments auto-evaluate as arithmetic, so n=n+10 is treated as n=$(( n + 10 )) = 15.
- id: q10
  question: Which Bash version introduced $SRANDOM (32-bit cryptographic-quality random)?
  options:
    - "4.0"
    - "4.4"
    - "3.2"
    - "5.1"
  correctIndex: 3
  explanation: SRANDOM was added in Bash 5.1 (2020) and uses getrandom() or /dev/urandom; useful for security tokens.
```

