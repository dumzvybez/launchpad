---
slug: python-getting-started-python
id: python-01
track: python
order: 1
title: Getting Started with Python
description: Install Python, write your first program, and understand the REPL and basic execution model.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw
whyItMatters: Install Python, write your first program, and understand the REPL and basic execution model.
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Getting Started with Python

## Getting Started with Python

### Why It Matters

Install Python, write your first program, and understand the REPL and basic execution model.

Install Python, write your first program, and understand the REPL and basic execution model.

### Prerequisites

- None — this is the entry point for the Python track.
- Basic computer literacy (installing software, using a terminal).

### Topics

- Installing Python 3 on Windows/macOS/Linux
- Using the REPL (Read-Eval-Print Loop)
- Running .py files from the command line
- Comments and code style (PEP 8)
- Using the print() function
- Choosing and configuring an editor (VS Code, PyCharm)
- Virtual environments overview (why they matter)
- The Python execution model (source -> bytecode -> PVM)

### Key Concepts

- Python is interpreted, not compiled (technically: compiled to bytecode, then interpreted by the PVM)
- Indentation defines code blocks (no braces)
- Python 3 is the current standard (Python 2 is EOL since 2020)
- Everything is an object
- The REPL is a feedback loop: type, evaluate, print, repeat

```python
print("Hello, World!")
```
Caption: Hello World

### Common Pitfalls

- Using Python 2 instead of Python 3 — always verify with `python3 --version`; Python 2 reached end-of-life in January 2020.
- Mixing tabs and spaces for indentation — pick spaces (4 per level, per PEP 8) and configure your editor to insert spaces when you press Tab.
- Forgetting to save the file before running — the most common cause of "my changes don't show up"; enable auto-save in your editor.
- Running scripts from the wrong directory — use `pwd` (macOS/Linux) or `cd` (Windows) to confirm you're in the folder containing the .py file before running it.

### Real-World Applications

- Instagram's backend uses Python (Django) to serve over 1 billion active users.
- Netflix uses Python for its recommendation engine, security automation, and regional failover scripts.
- Dropbox's desktop client is largely Python; the company hired Guido van Rossum for years.
- The Reddit comment ranking algorithm was prototyped in Python before being ported to Go.

### Interview Questions

- 1. What's the difference between Python 2 and Python 3? — Mention print as a function, unicode strings by default, integer division, and EOL status of Python 2.
- 2. How does Python execute code? — Source -> bytecode (.pyc) -> Python Virtual Machine (PVM) interprets bytecode.
- 3. Why does Python use indentation instead of braces? — Readability and reducing the "naked block" bug class; PEP 8 codifies it.
- 4. What's the REPL useful for? — Rapid prototyping, exploring APIs, debugging, and learning the language without writing files.
- 5. Name 3 popular Python IDEs and one strength of each. — VS Code (broad ecosystem), PyCharm (deep Python-specific refactors), Jupyter (data exploration).

### Mini Project

Build a Greeting Generator CLI: A command-line tool that takes a name and optional greeting word, then prints a personalized greeting with a timestamp. Suggested approach:
  - Use argparse with `--name` (required) and `--greeting` (default "Hello")
  - Import datetime to stamp the output
  - Print the result with an f-string
  - Add a `--uppercase` flag to shout the greeting
  - Handle missing --name with a friendly error message

### Exercises

1. Install Python 3 and run `python3 --version` to confirm it prints 3.10 or higher.
2. Open the REPL and use it as a calculator: compute 17 * 23, 2 ** 10, and 100 / 7.
3. Create a file `hello.py` that prints your name and age using f-strings, then run it from the terminal.
4. Add a multi-line docstring at the top of `hello.py` explaining what the script does and run it again — observe nothing changes in the output.
5. >>> QUIZ (Stage 1) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Who created Python?
8. A) Guido van Rossum (*)
9. B) Linus Torvalds
10. C) Dennis Ritchie
11. D) Brendan Eich
12. Explanation: Guido van Rossum began Python in late 1989 and released version 1.0 in February 1991.
13. Q2: What does print() do?
14. A) Sends to a physical printer
15. B) Writes to stdout (*)
16. C) Creates a file
17. D) Sends an email
18. Explanation: print() writes text to standard output (the terminal by default), optionally to a file via the file= argument.
19. Q3: Which defines a code block in Python?
20. A) Braces {}
21. B) Parentheses ()
22. C) Indentation (*)
23. D) Semicolons ;
24. Explanation: Python uses indentation (typically 4 spaces, per PEP 8) to define blocks instead of braces or keywords like begin/end.
25. Q4: Which Python version is the current standard as of 2024?
26. A) Python 2.7
27. B) Python 1.x
28. C) Python 4.0
29. D) Python 3.x (*)
30. Explanation: Python 2 reached end-of-life in January 2020; Python 3.x (3.12+ in 2024) is the only supported branch.
31. Q5: What does the REPL stand for?
32. A) Read-Eval-Print Loop (*)
33. B) Read-Evaluate-Print-Loop
34. C) Run-Edit-Print Loop
35. D) Real-Time Execution Pipe Loop
36. Explanation: REPL = Read-Eval-Print Loop. It reads one expression, evaluates it, prints the result, then loops.
37. Q6: Which file extension do Python source files use?
38. A) .pyc
39. B) .py (*)
40. C) .python
41. D) .p
42. Explanation: .py is the source extension; .pyc is the compiled bytecode produced automatically by the interpreter.
43. Q7: Which command runs a script named hello.py on most systems?
44. A) run hello.py
45. B) execute hello.py
46. C) python3 hello.py (*)
47. D) hello.py
48. Explanation: `python3 hello.py` invokes the Python 3 interpreter on the file. On Windows-only setups, `python hello.py` also works.
49. Q8: What is PEP 8?
50. A) A Python Enhancement Proposal that defines the standard library
51. B) The protocol used by pip
52. C) A built-in package for parsing
53. D) A Python Enhancement Proposal that defines code style conventions (*)
54. Explanation: PEP 8 is the official Python style guide covering indentation, naming, line length, imports, and more.
55. Q9: What is the Python Virtual Machine (PVM)?
56. A) The interpreter that executes Python bytecode (*)
57. B) A hypervisor for running Python containers
58. C) A virtual environment manager like venv
59. D) A just-in-time compiler like PyPy
60. Explanation: The PVM (also called the Python interpreter) reads .pyc bytecode and executes it instruction by instruction.
61. Q10: Which of these is the recommended way to manage dependencies per project?
62. A) Install everything globally with sudo pip install
63. B) Use a virtual environment per project (*)
64. C) Copy dependencies into the source folder
65. D) Vendor all dependencies as .py files
66. Explanation: A virtual environment (venv, virtualenv, or poetry/uv) isolates each project's dependencies, preventing version conflicts across projects.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Who created Python?
  options:
    - Guido van Rossum
    - Linus Torvalds
    - Dennis Ritchie
    - Brendan Eich
  correctIndex: 0
  explanation: Guido van Rossum began Python in late 1989 and released version 1.0 in February 1991.
- id: q2
  question: What does print() do?
  options:
    - Sends to a physical printer
    - Writes to stdout
    - Creates a file
    - Sends an email
  correctIndex: 1
  explanation: print() writes text to standard output (the terminal by default), optionally to a file via the file= argument.
- id: q3
  question: Which defines a code block in Python?
  options:
    - Braces {}
    - Parentheses ()
    - Indentation
    - Semicolons ;
  correctIndex: 2
  explanation: Python uses indentation (typically 4 spaces, per PEP 8) to define blocks instead of braces or keywords like begin/end.
- id: q4
  question: Which Python version is the current standard as of 2024?
  options:
    - Python 2.7
    - Python 1.x
    - Python 4.0
    - Python 3.x
  correctIndex: 3
  explanation: Python 2 reached end-of-life in January 2020; Python 3.x (3.12+ in 2024) is the only supported branch.
- id: q5
  question: What does the REPL stand for?
  options:
    - Read-Eval-Print Loop
    - Read-Evaluate-Print-Loop
    - Run-Edit-Print Loop
    - Real-Time Execution Pipe Loop
  correctIndex: 0
  explanation: REPL = Read-Eval-Print Loop. It reads one expression, evaluates it, prints the result, then loops.
- id: q6
  question: Which file extension do Python source files use?
  options:
    - .pyc
    - .py
    - .python
    - .p
  correctIndex: 1
  explanation: .py is the source extension; .pyc is the compiled bytecode produced automatically by the interpreter.
- id: q7
  question: Which command runs a script named hello.py on most systems?
  options:
    - run hello.py
    - execute hello.py
    - python3 hello.py
    - hello.py
  correctIndex: 2
  explanation: "`python3 hello.py` invokes the Python 3 interpreter on the file. On Windows-only setups, `python hello.py` also works."
- id: q8
  question: What is PEP 8?
  options:
    - A Python Enhancement Proposal that defines the standard library
    - The protocol used by pip
    - A built-in package for parsing
    - A Python Enhancement Proposal that defines code style conventions
  correctIndex: 3
  explanation: PEP 8 is the official Python style guide covering indentation, naming, line length, imports, and more.
- id: q9
  question: What is the Python Virtual Machine (PVM)?
  options:
    - "?"
    - The interpreter that executes Python bytecode
    - A hypervisor for running Python containers
    - A virtual environment manager like venv
    - A just-in-time compiler like PyPy
  correctIndex: 1
  explanation: The PVM (also called the Python interpreter) reads .pyc bytecode and executes it instruction by instruction.
- id: q10
  question: Which of these is the recommended way to manage dependencies per project?
  options:
    - Install everything globally with sudo pip install
    - Use a virtual environment per project
    - Copy dependencies into the source folder
    - Vendor all dependencies as .py files
  correctIndex: 1
  explanation: A virtual environment (venv, virtualenv, or poetry/uv) isolates each project's dependencies, preventing version conflicts across projects.
```

