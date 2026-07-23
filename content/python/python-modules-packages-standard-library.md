---
slug: python-modules-packages-standard-library
id: python-13
track: python
order: 13
title: Modules, Packages, and the Standard Library
description: Organize code into modules and packages, master imports, take a tour of Python's batteries-included standard library, and avoid circular-import and name-shadowing traps.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=14300s
whyItMatters: Organize code into modules and packages, master imports, take a tour of Python's batteries-included standard library, and avoid circular-import and name-shadowing traps.
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Modules, Packages, and the Standard Library

## Modules, Packages, and the Standard Library

### Why It Matters

Organize code into modules and packages, master imports, take a tour of Python's batteries-included standard library, and avoid circular-import and name-shadowing traps.

Organize code into modules and packages, master imports, take a tour of Python's batteries-included standard library, and avoid circular-import and name-shadowing traps.

### Prerequisites

- Stage 12: Error Handling — Exceptions and Custom Errors
- Stage 11: File I/O and Context Managers.

### Topics

- import, from...import, import...as
- Modules (.py files) and packages (folders with __init__.py)
- Absolute vs relative imports
- __name__ == "__main__" idiom
- Standard library tour: os, sys, pathlib, collections, datetime, math, re, itertools, functools
- pip and PyPI
- Virtual environments (venv)
- The if T.TYPE_CHECKING pattern for typing-only imports

### Key Concepts

- A module is a .py file; a package is a directory with __init__.py (or namespace package).
- Imports execute the module top-to-bottom on first import; subsequent imports reuse the cached module object (sys.modules).
- Absolute imports use the full path (package.sub.module); relative imports use leading dots (.module, ..module).
- `if __name__ == "__main__":` runs only when the file is executed directly, not when imported.
- Python's stdlib is huge — collections, itertools, functools, pathlib, datetime, re cover most daily needs without third-party libs.

```text
myapp/
    __init__.py
    models/
        __init__.py
        user.py
        post.py
    utils.py
main.py
```
Caption: Module and package structure

### Common Pitfalls

- Circular imports — module A imports B which imports A; refactor by moving shared code to a third module or using late imports inside functions.
- Shadowing stdlib names — naming your file `string.py`, `random.py`, or `requests.py` shadows the real module; pick unique names.
- Wildcard imports (`from x import *`) — pollutes the namespace and hides where names come from; PEP 8 says avoid.
- Missing __init__.py — pre-3.3 packages required it; today namespace packages work without it, but explicit __init__.py is clearer.
- Importing the same module under multiple names — confusing; pick one canonical import and stick with it.

### Real-World Applications

- Instagram's monolithic Django codebase uses thousands of Python modules organized by feature.
- Netflix uses Python's stdlib (collections, itertools) heavily for ETL without third-party deps in core paths.
- Spotify uses functools.lru_cache to memoize expensive music-metadata lookups.
- Reddit structures its Python services into packages with absolute imports and clear __init__.py files.

### Interview Questions

- 1. What's the difference between a module and a package? — A module is a .py file; a package is a directory (with __init__.py) that can contain modules and subpackages.
- 2. What does `if __name__ == "__main__":` do? — Runs the block only when the file is executed directly, not when imported as a module.
- 3. What is a circular import and how do you fix it? — Two modules importing each other; refactor shared code into a third module, or use late imports inside functions.
- 4. What's in sys.modules? — A dict caching already-imported modules; subsequent imports return the cached object instead of re-executing.
- 5. Name 5 standard-library modules you use daily. — pathlib, collections, datetime, functools, itertools, re, json, os, sys, logging (any 5).

### Mini Project

Build a Personal CLI Toolkit: A small Python package `mytools` with submodules (file_utils, date_utils, string_utils) exposing helpers. Use `if __name__ == "__main__"` to provide a CLI entry point. Suggested approach:
  - Create the package folder with __init__.py
  - Each submodule exposes 2-3 functions with type hints and docstrings
  - __init__.py uses relative imports to expose a clean public API
  - main.py uses argparse with subcommands to dispatch to each module
  - Add a `mytools --version` command that reads from __init__.py

### Exercises

1. Create a package `mypkg` with `__init__.py` and a `greetings.py` submodule; import and use it from main.py.
2. Use `if __name__ == "__main__":` so a script can be both imported and run directly.
3. Use collections.Counter to count word frequencies in a sentence.
4. Use functools.lru_cache to memoize a recursive fibonacci function.
5. Demonstrate a circular import and fix it by moving shared code into a third module.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is a Python package?
9. A) A .py file
10. B) A zip archive
11. C) A directory containing modules, usually with __init__.py (*)
12. D) A PyPI download
13. Explanation: A package is a directory (typically with __init__.py) that holds modules and subpackages; a module is a single .py file.
14. Q2: What does `if __name__ == "__main__":` enable?
15. A) Code runs only when the file is executed directly, not when imported (*)
16. B) Faster imports
17. C) Marks the file as the package root
18. D) Hides the block from imports
19. Explanation: When run directly, __name__ is "__main__"; when imported, __name__ is the module name. The idiom separates script behavior from import behavior.
20. Q3: What is a circular import?
21. A) An import inside a function
22. B) Module A imports B which imports A — usually fails (*)
23. C) A relative import
24. D) An import with no target
25. Explanation: Circular imports cause ImportError or partial-module errors; fix by refactoring shared code into a third module or using late (in-function) imports.
26. Q4: What does sys.modules store?
27. A) The list of installed packages
28. B) Module search paths
29. C) The current module's source
30. D) A cache of already-imported module objects (*)
31. Explanation: sys.modules is a dict mapping module names to module objects; subsequent imports reuse the cached object instead of re-executing the file.
32. Q5: What's wrong with `from module import *`?
33. A) Pollutes the namespace and hides name origins — PEP 8 discourages it (*)
34. B) Slower than regular imports
35. C) It's deprecated since 3.8
36. D) Only works in __init__.py
37. Explanation: Wildcard imports make it hard to know where a name came from and can shadow other names; prefer explicit imports.
38. Q6: Which module provides lru_cache?
39. A) collections
40. B) itertools
41. C) functools (*)
42. D) cache
43. Explanation: functools.lru_cache is a decorator that memoizes function results in an LRU cache; great for expensive pure functions.
44. Q7: Which module provides Counter and defaultdict?
45. A) structs
46. B) container
47. C) data
48. D) collections (*)
49. Explanation: collections has Counter, defaultdict, deque, namedtuple, OrderedDict, ChainMap — all container types beyond the built-ins.
50. Q8: What's the danger of naming your file `string.py`?
51. A) No danger
52. B) It shadows the stdlib string module in the same directory (*)
53. C) It's reserved by Python
54. D) It can only contain strings
55. Explanation: Python adds the script's directory to sys.path[0]; your string.py would shadow the stdlib string module for any nearby import.
56. Q9: What's the difference between absolute and relative imports?
57. A) Absolute is faster
58. B) Absolute only works in __init__.py
59. C) Absolute uses full package path; relative uses leading dots (.module, ..module) (*)
60. D) Relative imports are deprecated
61. Explanation: Absolute imports use the full path (package.sub.module); relative imports use dots to navigate from the current package.
62. Q10: Where does pip install packages from by default?
63. A) PyPI (Python Package Index) (*)
64. B) GitHub
65. C) apt
66. D) npm
67. Explanation: pip installs from PyPI by default (pypi.org); you can also install from git URLs, local paths, or private indexes with -i.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is a Python package?
  options:
    - A .py file
    - A zip archive
    - A directory containing modules, usually with __init__.py
    - A PyPI download
  correctIndex: 2
  explanation: A package is a directory (typically with __init__.py) that holds modules and subpackages; a module is a single .py file.
- id: q2
  question: What does `if __name__ == "__main__":` enable?
  options:
    - Code runs only when the file is executed directly, not when imported
    - Faster imports
    - Marks the file as the package root
    - Hides the block from imports
  correctIndex: 0
  explanation: When run directly, __name__ is "__main__"; when imported, __name__ is the module name. The idiom separates script behavior from import behavior.
- id: q3
  question: What is a circular import?
  options:
    - An import inside a function
    - Module A imports B which imports A — usually fails
    - A relative import
    - An import with no target
  correctIndex: 1
  explanation: Circular imports cause ImportError or partial-module errors; fix by refactoring shared code into a third module or using late (in-function) imports.
- id: q4
  question: What does sys.modules store?
  options:
    - The list of installed packages
    - Module search paths
    - The current module's source
    - A cache of already-imported module objects
  correctIndex: 3
  explanation: sys.modules is a dict mapping module names to module objects; subsequent imports reuse the cached object instead of re-executing the file.
- id: q5
  question: What's wrong with `from module import *`?
  options:
    - Pollutes the namespace and hides name origins — PEP 8 discourages it
    - Slower than regular imports
    - It's deprecated since 3.8
    - Only works in __init__.py
  correctIndex: 0
  explanation: Wildcard imports make it hard to know where a name came from and can shadow other names; prefer explicit imports.
- id: q6
  question: Which module provides lru_cache?
  options:
    - collections
    - itertools
    - functools
    - cache
  correctIndex: 2
  explanation: functools.lru_cache is a decorator that memoizes function results in an LRU cache; great for expensive pure functions.
- id: q7
  question: Which module provides Counter and defaultdict?
  options:
    - structs
    - container
    - data
    - collections
  correctIndex: 3
  explanation: collections has Counter, defaultdict, deque, namedtuple, OrderedDict, ChainMap — all container types beyond the built-ins.
- id: q8
  question: What's the danger of naming your file `string.py`?
  options:
    - No danger
    - It shadows the stdlib string module in the same directory
    - It's reserved by Python
    - It can only contain strings
  correctIndex: 1
  explanation: Python adds the script's directory to sys.path[0]; your string.py would shadow the stdlib string module for any nearby import.
- id: q9
  question: What's the difference between absolute and relative imports?
  options:
    - Absolute is faster
    - Absolute only works in __init__.py
    - Absolute uses full package path; relative uses leading dots (.module, ..module)
    - Relative imports are deprecated
  correctIndex: 2
  explanation: Absolute imports use the full path (package.sub.module); relative imports use dots to navigate from the current package.
- id: q10
  question: Where does pip install packages from by default?
  options:
    - PyPI (Python Package Index)
    - GitHub
    - apt
    - npm
  correctIndex: 0
  explanation: pip installs from PyPI by default (pypi.org); you can also install from git URLs, local paths, or private indexes with -i.
```

