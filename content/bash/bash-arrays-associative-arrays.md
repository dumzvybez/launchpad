---
slug: bash-arrays-associative-arrays
id: bash-07
track: bash
order: 7
title: Arrays and Associative Arrays
description: Group related values in indexed arrays and key-value maps (associative arrays, Bash 4+), iterate them safely, and use mapfile for bulk line reads.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tK9Oc6AEnR4&t=1200s
whyItMatters: Group related values in indexed arrays and key-value maps (associative arrays, Bash 4+), iterate them safely, and use mapfile for bulk line reads.
deepDiveResources:
  - label: W3Schools Bash / Shell
    url: https://www.w3schools.com/bash/
    kind: course
  - label: Bash / Shell Official Docs
    url: https://www.gnu.org/software/bash/manual/
    kind: doc
---

# Arrays and Associative Arrays

## Arrays and Associative Arrays

### Why It Matters

Group related values in indexed arrays and key-value maps (associative arrays, Bash 4+), iterate them safely, and use mapfile for bulk line reads.

Group related values in indexed arrays and key-value maps (associative arrays, Bash 4+), iterate them safely, and use mapfile for bulk line reads.

### Prerequisites

- Stage 1-6: variables, functions, loops
- Bash 4.0+ for associative arrays (verify with `echo $BASH_VERSINFO`)

### Topics

- Indexed arrays: arr=(a b c) and arr[3]=d
- Reading all elements: ${arr[@]} and ${arr[*]}
- Length: ${#arr[@]}; element count
- Slicing: ${arr[@]:1:2}
- Iteration: for x in "${arr[@]}"
- Associative arrays (Bash 4+): declare -A map; map[key]=value
- mapfile / readarray (Bash 4+) to read lines into an array
- Appending, deleting, and pattern substitution on arrays

### Key Concepts

- ${arr[@]} expands to all elements as separate words; ${arr[*]} expands to all as a single word joined by IFS — almost always want ${arr[@]}.
- ALWAYS quote `"${arr[@]}"` — without quotes, each element word-splits and globs, breaking elements with spaces.
- ${arr[0]} is the first element; ${arr} (no subscript) is also ${arr[0]} — but it's safer to be explicit.
- Associative arrays require `declare -A` BEFORE assignment; without it, Bash creates an indexed array with index "key" (which evaluates to 0).
- mapfile (a.k.a. readarray) reads stdin into an array, one element per line; use `-t` to strip the trailing newline.
- Arrays are 0-indexed by default but can be sparse: `arr[5]=x` leaves 0-4 unset.

```bash
#!/usr/bin/env bash
fruits=(apple banana cherry)
fruits+=(date)                # append
echo "${fruits[0]}"          # apple
echo "${fruits[-1]}"         # date  (negative index, Bash 4.3+)
echo "${#fruits[@]}"         # 4     (element count)
echo "${fruits[@]}"          # apple banana cherry date

# Safe iteration (note the quotes)
for f in "${fruits[@]}"; do
  echo "- $f"
done

# Slicing: from index 1, take 2
echo "${fruits[@]:1:2}"      # banana cherry
```
Caption: Indexed arrays

### Common Pitfalls

- Using ${arr} instead of ${arr[@]} — ${arr} is just the first element (${arr[0]}); use ${arr[@]} to get all.
- Forgetting `declare -A` before assigning an associative array — without it, Bash treats it as indexed, and `m[key]=x` silently becomes `m[0]=x` (since "key" as arithmetic evaluates to 0).
- Iterating with `for x in ${arr[@]}` (unquoted) — word-splits elements with spaces; use `for x in "${arr[@]}"`.
- macOS shipping Bash 3.2 which has NO associative arrays — `declare -A` fails; install Bash 5 via Homebrew or use a flat file as a key-value store.
- Assuming array order in associative arrays — indexed arrays preserve insertion order; associative arrays do NOT (their key order is implementation-defined).

### Real-World Applications

- bash-completion uses associative arrays to map command names to completion functions for fast dispatch.
- The Docker entrypoint for the official postgres image uses indexed arrays to build argument lists for `postgres` and `initdb`.
- Jenkins's shell-step environment setup uses mapfile -t to parse multi-line env var values into arrays for export.
- The Linux kernel's `scripts/depmod.sh` uses indexed arrays to track module dependencies in correct order.

### Interview Questions

- 1. What's the difference between ${arr[@]} and ${arr[*]}? — @ expands each element as a separate word; * joins them into a single word with IFS (usually space). Almost always use @.
- 2. How do you check if a key exists in an associative array? — `[[ -v map[key] ]]` (Bash 4.2+); or `[[ ${map[key]+x} ]]` for older Bash.
- 3. Why does `declare -A m; m[key]=1` then `echo ${#m[@]}` print 1 on Bash 4+ but the wrong thing on 3.2? — Bash 3.2 has no assoc arrays; `m[key]=1` becomes `m[0]=1` (indexed, with "key" coerced to 0).
- 4. How do you read a file's lines into an array? — `mapfile -t lines < file` (Bash 4+) or `IFS=$'\n' read -r -d '' -a lines < file` for older.
- 5. How do you iterate an associative array's keys? — `for k in "${!map[@]}"` — the ! prefix gives keys (or indices for indexed arrays).

### Mini Project

Build a "wordfreq.sh" word-frequency counter: A script that reads stdin, splits on whitespace, counts each word's occurrences, and prints the top 10 sorted by frequency descending. It uses an associative array to accumulate counts. Suggested approach:
  - Read all of stdin into a string with $(< /dev/stdin) or while read
  - Split into words using read -ra in a loop (or for w in $text with IFS adjusted)
  - Use declare -A count; (( count[$w]++ ))
  - Iterate keys, print "$count $w", pipe to sort -rn, head -10
  - Add a --min N flag to filter words with fewer than N occurrences

### Exercises

1. Create an indexed array of 5 colors and print the count and the last element using ${arr[-1]}.
2. Build a declare -A map of country-to-capital for 5 countries; iterate keys and print "Capital of X is Y".
3. Use `mapfile -t` to read /etc/passwd into an array; print the number of users and the first 3 lines.
4. Append three fruits to an existing array using `arr+=(x y z)` and print the new length.
5. Use `[[ -v map[key] ]]` to check whether "Paris" is a key in your country map.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which expansion gives all array elements as separate words?
9. A) ${arr}
10. B) ${arr[*]}
11. C) ${arr[@]} (*)
12. D) ${arr[*]}
13. Explanation: ${arr[@]} expands each element as a discrete word; ${arr[*]} joins them all into a single word with IFS.
14. Q2: How do you get the number of elements in an array?
15. A) ${#arr}
16. B) ${arr[#]}
17. C) ${#arr[*]} always returns 1
18. D) ${#arr[@]} (*)
19. Explanation: ${#arr[@]} (or ${#arr[*]}) gives the element count; ${#arr} is the length of the first element only.
20. Q3: Which statement creates an associative array?
21. A) declare -A map (*)
22. B) declare -a map
23. C) array map
24. D) hash map
25. Explanation: `declare -A` (capital A) creates an associative array; lowercase -a creates an indexed array.
26. Q4: What happens if you do `m[key]=1` without `declare -A m` first?
27. A) Syntax error
28. B) m is treated as indexed; "key" coerces to 0, so m[0]=1 (*)
29. C) Bash creates the assoc array on demand
30. D) m becomes a string
31. Explanation: Without declare -A, Bash treats m as an indexed array; the subscript "key" is evaluated as arithmetic, which is 0.
32. Q5: How do you iterate keys of an associative array?
33. A) for k in ${map[@]}
34. B) for k in ${map[!]}
35. C) for k in "${!map[@]}" (*)
36. D) for k in keys(map)
37. Explanation: The ! prefix in ${!map[@]} returns the keys (for assoc arrays) or indices (for indexed arrays).
38. Q6: Which Bash version introduced associative arrays?
39. A) 3.0
40. B) 3.2
41. C) 5.0
42. D) 4.0 (*)
43. Explanation: Associative arrays (declare -A) were added in Bash 4.0 (2009); macOS default Bash is 3.2 and does not support them.
44. Q7: How do you read a file's lines into an array, one element per line?
45. A) mapfile -t lines < file (*)
46. B) read -a lines < file
47. C) arr=(cat file)
48. D) lines=cat file
49. Explanation: `mapfile -t lines < file` (a.k.a. readarray) reads each line into an array element, stripping the trailing newline with -t.
50. Q8: Why must you quote "${arr[@]}" when iterating?
51. A) Bash forbids unquoted array expansion
52. B) Without quotes, each element word-splits and globs, breaking elements with spaces (*)
53. C) Quotes make iteration faster
54. D) Quotes sort the array
55. Explanation: Unquoted ${arr[@]} is subject to word splitting AND glob expansion on each element; quoted "${arr[@]}" preserves each element as-is.
56. Q9: How do you check if a key exists in an associative array (Bash 4.2+)?
57. A) [ -e map[key] ]
58. B) if map[key]
59. C) [[ -v map[key] ]] (*)
60. D) [[ map[key] == * ]]
61. Explanation: `[[ -v map[key] ]]` tests whether the named variable (or array element) is set; older Bash can use `[[ ${map[key]+set} ]]`.
62. Q10: What does `arr+=(x y)` do?
63. A) Replaces arr with (x y)
64. B) Removes x and y from arr
65. C) Errors — += is not valid
66. D) Appends x and y to arr (*)
67. Explanation: The += operator appends to arrays (and to strings, when used on a scalar variable).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which expansion gives all array elements as separate words?
  options:
    - ${arr}
    - ${arr[*]}
    - ${arr[@]}
    - ${arr[*]}
  correctIndex: 2
  explanation: ${arr[@]} expands each element as a discrete word; ${arr[*]} joins them all into a single word with IFS.
- id: q2
  question: How do you get the number of elements in an array?
  options:
    - ${#arr}
    - ${arr[#]}
    - ${#arr[*]} always returns 1
    - ${#arr[@]}
  correctIndex: 3
  explanation: ${#arr[@]} (or ${#arr[*]}) gives the element count; ${#arr} is the length of the first element only.
- id: q3
  question: Which statement creates an associative array?
  options:
    - declare -A map
    - declare -a map
    - array map
    - hash map
    - creates an associative array; lowercase -a creates an indexed array.
  correctIndex: 0
  explanation: "`declare -A` (capital A) creates an associative array; lowercase -a creates an indexed array."
- id: q4
  question: What happens if you do `m[key]=1` without `declare -A m` first?
  options:
    - Syntax error
    - m is treated as indexed; "key" coerces to 0, so m[0]=1
    - Bash creates the assoc array on demand
    - m becomes a string
  correctIndex: 1
  explanation: Without declare -A, Bash treats m as an indexed array; the subscript "key" is evaluated as arithmetic, which is 0.
- id: q5
  question: How do you iterate keys of an associative array?
  options:
    - for k in ${map[@]}
    - for k in ${map[!]}
    - for k in "${!map[@]}"
    - for k in keys(map)
  correctIndex: 2
  explanation: The ! prefix in ${!map[@]} returns the keys (for assoc arrays) or indices (for indexed arrays).
- id: q6
  question: Which Bash version introduced associative arrays?
  options:
    - "3.0"
    - "3.2"
    - "5.0"
    - "4.0"
    - were added in Bash 4.0 (2009); macOS default Bash is 3.2 and does not support them.
  correctIndex: 3
  explanation: Associative arrays (declare -A) were added in Bash 4.0 (2009); macOS default Bash is 3.2 and does not support them.
- id: q7
  question: How do you read a file's lines into an array, one element per line?
  options:
    - mapfile -t lines < file
    - read -a lines < file
    - arr=(cat file)
    - lines=cat file
  correctIndex: 0
  explanation: "`mapfile -t lines < file` (a.k.a. readarray) reads each line into an array element, stripping the trailing newline with -t."
- id: q8
  question: Why must you quote "${arr[@]}" when iterating?
  options:
    - Bash forbids unquoted array expansion
    - Without quotes, each element word-splits and globs, breaking elements with spaces
    - Quotes make iteration faster
    - Quotes sort the array
  correctIndex: 1
  explanation: Unquoted ${arr[@]} is subject to word splitting AND glob expansion on each element; quoted "${arr[@]}" preserves each element as-is.
- id: q9
  question: How do you check if a key exists in an associative array (Bash 4.2+)?
  options:
    - "[ -e map[key] ]"
    - if map[key]
    - "[[ -v map[key] ]]"
    - "[[ map[key] == * ]]"
  correctIndex: 2
  explanation: "`[[ -v map[key] ]]` tests whether the named variable (or array element) is set; older Bash can use `[[ ${map[key]+set} ]]`."
- id: q10
  question: What does `arr+=(x y)` do?
  options:
    - Replaces arr with (x y)
    - Removes x and y from arr
    - Errors — += is not valid
    - Appends x and y to arr
  correctIndex: 3
  explanation: The += operator appends to arrays (and to strings, when used on a scalar variable).
```

