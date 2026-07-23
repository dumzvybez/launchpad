---
slug: python-file-i-o-context-managers
id: python-11
track: python
order: 11
title: File I/O and Context Managers
description: Read and write files reliably using the `with` statement, master pathlib for cross-platform path handling, and build your own context managers with __enter__/__exit__.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=11900s
whyItMatters: Read and write files reliably using the `with` statement, master pathlib for cross-platform path handling, and build your own context managers with __enter__/__exit__.
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# File I/O and Context Managers

## File I/O and Context Managers

### Why It Matters

Read and write files reliably using the `with` statement, master pathlib for cross-platform path handling, and build your own context managers with __enter__/__exit__.

Read and write files reliably using the `with` statement, master pathlib for cross-platform path handling, and build your own context managers with __enter__/__exit__.

### Prerequisites

- Stage 10: OOP — Inheritance, Polymorphism, Magic Methods (for __enter__/__exit__).
- Stage 7: Data Structures (dict, list for CSV/JSON).

### Topics

- open() and read modes (r, w, a, x, b, +)
- Text vs binary mode (str vs bytes)
- The `with` statement and context managers
- Reading line-by-line vs .read() vs .readlines()
- pathlib.Path for path manipulation
- Reading/writing CSV with the csv module
- Reading/writing JSON with json.dump/load
- Custom context managers (__enter__/__exit__) and @contextmanager
- Encoding: always specify encoding="utf-8"

### Key Concepts

- The `with` statement guarantees __exit__ runs (closes the file) even if an exception is raised.
- "r" is default mode; "w" truncates the file; "a" appends; "x" exclusive-create (fails if file exists).
- Text mode ("r") returns str; binary mode ("rb") returns bytes — never mix them.
- pathlib.Path is the modern, cross-platform replacement for os.path string manipulation.
- Always pass encoding="utf-8" explicitly — Windows defaults to cp1252, which mangles non-ASCII text.

```python
# Reading
with open("data.txt", encoding="utf-8") as f:
    text = f.read()        # whole file as one string
    # or line by line (memory-efficient for large files):
    # for line in f:
    #     process(line)

# Writing (overwrites)
with open("out.txt", "w", encoding="utf-8") as f:
    f.write("hello\n")
    f.write("world\n")

# Appending
with open("log.txt", "a", encoding="utf-8") as f:
    f.write("new entry\n")
```
Caption: Reading and writing with with

### Common Pitfalls

- Forgetting to close files — use `with` always; without it, file handles leak (especially on Windows) until GC runs.
- Confusing "w" (truncate) with "a" (append) — "w" destroys existing content; if you want to add, use "a".
- Not specifying encoding — open() defaults to the locale encoding (cp1252 on Windows); always pass encoding="utf-8" for portability.
- Reading large files with .read() — loads the entire file into memory; iterate line-by-line for big files.
- Using csv without newline="" — extra blank rows appear on Windows; always open CSV files with newline="".

### Real-World Applications

- Dropbox's file-sync engine uses Python context managers to guarantee file handles close across network errors.
- Yelp uses pathlib for cross-platform log file rotation in its data pipeline.
- Spotify uses the csv module to import monthly royalty data from labels.
- Reddit uses json.load/dump extensively for API responses and configuration files.

### Interview Questions

- 1. Why use `with open(...)` instead of just open()? — Guarantees __exit__ (file close) runs even on exception; without it, you can leak file handles.
- 2. What's the difference between text and binary mode? — Text returns str (with encoding/decoding); binary returns bytes (raw).
- 3. What's the default encoding on Windows Python? — cp1252 (locale-dependent); always specify encoding="utf-8" for portability.
- 4. What does pathlib add over os.path? — Object-oriented, chainable API; cross-platform; .read_text/.write_text convenience methods.
- 5. When would you write a custom context manager? — When you have setup/teardown that must always run (DB connections, locks, timers, transactions).

### Mini Project

Build a Config File Manager: A CLI that reads/writes/updates a JSON config file with atomic writes (write to .tmp then rename). Suggested approach:
  - Use pathlib.Path for the file path
  - Read with json.load in a `with` block
  - Write to a .tmp file first, then os.replace to atomic rename
  - Use a @contextmanager for transactional updates
  - Add a --validate flag that checks the schema before saving

### Exercises

1. Read a text file line by line and count total lines using `with open()`.
2. Use pathlib to list all .py files recursively in a directory.
3. Write a list of dicts to CSV using csv.DictWriter with newline="".
4. Write a context manager that prints elapsed time on exit using @contextmanager.
5. Demonstrate atomic file writes: write to a temp file, then os.replace to swap.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why use `with open("f.txt") as f:`?
9. A) It guarantees f.close() runs even on exception (*)
10. B) It's faster
11. C) It opens the file in binary mode
12. D) It caches the file contents
13. Explanation: The with statement calls __exit__ on the context manager, which closes the file — even if an exception is raised mid-block.
14. Q2: Which mode truncates (destroys existing content)?
15. A) "r"
16. B) "w" (*)
17. C) "a"
18. D) "x"
19. Explanation: "w" opens for writing and truncates the file; "a" appends; "x" exclusive-creates (fails if exists).
20. Q3: What does text mode return from .read()?
21. A) bytes
22. B) list
23. C) str (*)
24. D) tuple
25. Explanation: Text mode ("r") returns str; binary mode ("rb") returns bytes. Never mix them.
26. Q4: What's the default encoding on Windows Python?
27. A) UTF-8
28. B) UTF-16
29. C) ASCII
30. D) cp1252 (locale-dependent) (*)
31. Explanation: Python uses the locale encoding by default — cp1252 on most Windows systems. Always pass encoding="utf-8" for portability.
32. Q5: What must you pass when opening a CSV file for writing?
33. A) mode="x"
34. B) encoding="bytes"
35. C) newline="" (*)
36. D) buffering=0
37. Explanation: On Windows, csv.writer emits extra blank rows without newline=""; the csv module docs require it.
38. Q6: Which module is preferred for cross-platform path manipulation?
39. A) os.path
40. B) glob
41. C) shutil
42. D) pathlib (*)
43. Explanation: pathlib offers an object-oriented, chainable, cross-platform API; os.path is the older string-based alternative.
44. Q7: What does __exit__ return to suppress an exception?
45. A) True (*)
46. B) False
47. C) None
48. D) The exception object
49. Explanation: If __exit__ returns a truthy value, the exception is suppressed (not propagated); return False to propagate.
50. Q8: Which decorator creates a context manager from a generator?
51. A) @ctx
52. B) @contextmanager (from contextlib) (*)
53. C) @manager
54. D) @yield_context
55. Explanation: @contextlib.contextmanager turns a generator function (with a single yield) into a context manager.
56. Q9: What does Path("a/b/c.txt").parent return?
57. A) "a/b" — wait, actually PurePath('a/b') (*)
58. B) "a"
59. C) "c.txt"
60. D) "a/b/c.txt"
61. Explanation: .parent returns the parent directory path; Path("a/b/c.txt").parent is Path("a/b").
62. Q10: What's the recommended way to read a 10GB log file?
63. A) f.read() to load all into memory
64. B) f.readlines() then iterate
65. C) Iterate line-by-line with `for line in f` (*)
66. D) Use pickle.load
67. Explanation: Line-by-line iteration streams the file without loading all of it into memory; .read() and .readlines() materialize the whole file.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why use `with open("f.txt") as f:`?
  options:
    - It guarantees f.close() runs even on exception
    - It's faster
    - It opens the file in binary mode
    - It caches the file contents
  correctIndex: 0
  explanation: The with statement calls __exit__ on the context manager, which closes the file — even if an exception is raised mid-block.
- id: q2
  question: Which mode truncates (destroys existing content)?
  options:
    - '"r"'
    - '"w"'
    - '"a"'
    - '"x"'
  correctIndex: 1
  explanation: '"w" opens for writing and truncates the file; "a" appends; "x" exclusive-creates (fails if exists).'
- id: q3
  question: What does text mode return from .read()?
  options:
    - bytes
    - list
    - str
    - tuple
  correctIndex: 2
  explanation: Text mode ("r") returns str; binary mode ("rb") returns bytes. Never mix them.
- id: q4
  question: What's the default encoding on Windows Python?
  options:
    - UTF-8
    - UTF-16
    - ASCII
    - cp1252 (locale-dependent)
  correctIndex: 3
  explanation: Python uses the locale encoding by default — cp1252 on most Windows systems. Always pass encoding="utf-8" for portability.
- id: q5
  question: What must you pass when opening a CSV file for writing?
  options:
    - mode="x"
    - encoding="bytes"
    - newline=""
    - buffering=0
  correctIndex: 2
  explanation: On Windows, csv.writer emits extra blank rows without newline=""; the csv module docs require it.
- id: q6
  question: Which module is preferred for cross-platform path manipulation?
  options:
    - os.path
    - glob
    - shutil
    - pathlib
  correctIndex: 3
  explanation: pathlib offers an object-oriented, chainable, cross-platform API; os.path is the older string-based alternative.
- id: q7
  question: What does __exit__ return to suppress an exception?
  options:
    - "True"
    - "False"
    - None
    - The exception object
  correctIndex: 0
  explanation: If __exit__ returns a truthy value, the exception is suppressed (not propagated); return False to propagate.
- id: q8
  question: Which decorator creates a context manager from a generator?
  options:
    - "@ctx"
    - "@contextmanager (from contextlib)"
    - "@manager"
    - "@yield_context"
  correctIndex: 1
  explanation: "@contextlib.contextmanager turns a generator function (with a single yield) into a context manager."
- id: q9
  question: What does Path("a/b/c.txt").parent return?
  options:
    - "\"a/b\" — wait, actually PurePath('a/b')"
    - '"a"'
    - '"c.txt"'
    - '"a/b/c.txt"'
  correctIndex: 0
  explanation: .parent returns the parent directory path; Path("a/b/c.txt").parent is Path("a/b").
- id: q10
  question: What's the recommended way to read a 10GB log file?
  options:
    - f.read() to load all into memory
    - f.readlines() then iterate
    - Iterate line-by-line with `for line in f`
    - Use pickle.load
  correctIndex: 2
  explanation: Line-by-line iteration streams the file without loading all of it into memory; .read() and .readlines() materialize the whole file.
```

