---
slug: python-packaging-virtual-environments-project-structure
id: python-19
track: python
order: 19
title: Packaging, Virtual Environments, and Project Structure
description: Structure Python projects like a professional — virtual environments, pyproject.toml, src/ layout, entry points, and modern tools (uv, poetry).
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=21500s
whyItMatters: Structure Python projects like a professional — virtual environments, pyproject. toml, src/ layout, entry points, and modern tools (uv, poetry).
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Packaging, Virtual Environments, and Project Structure

## Packaging, Virtual Environments, and Project Structure

### Why It Matters

Structure Python projects like a professional — virtual environments, pyproject. toml, src/ layout, entry points, and modern tools (uv, poetry).

Structure Python projects like a professional — virtual environments, pyproject.toml, src/ layout, entry points, and modern tools (uv, poetry).

### Prerequisites

- Stage 18: Performance — Memory, Caching, and Optimization
- Stage 13: Modules, Packages, and the Standard Library.

### Topics

- Virtual environments with venv (stdlib) and uv/poetry
- requirements.txt vs pyproject.toml vs Pipfile
- pyproject.toml with [build-system] and [project]
- src/ layout vs flat layout — and why src/ wins
- Entry points (console_scripts) for CLI packages
- __version__ and dynamic versioning
- Lockfiles (poetry.lock, uv.lock) for reproducible installs
- Tooling: ruff, black, mypy, pre-commit
- Publishing to PyPI (twine, build)

### Key Concepts

- A virtual environment isolates a project's dependencies from the system Python and from other projects.
- pyproject.toml is the modern standard (PEP 621) — replaces setup.py and setup.cfg for most cases.
- src/ layout prevents accidental imports from the project root, forcing tests to install the package (catches packaging bugs).
- Pin dependencies (==) for apps; allow ranges (>=) for libraries.
- A lockfile records exact transitive versions for reproducible installs across machines.

```bash
# Create and activate a venv
python3 -m venv .venv
source .venv/bin/activate         # macOS/Linux
# .venv\Scripts\activate          # Windows

# Install dependencies
pip install requests pytest
pip freeze > requirements.txt     # pin exact versions

# Modern alternative: uv (10-100x faster than pip)
uv venv
uv pip install requests pytest
```
Caption: venv setup

### Common Pitfalls

- Committing the .venv folder — add it to .gitignore; venvs are machine-specific and huge.
- No pinned dependencies — unpinned deps break reproducibility when a transitive package releases a breaking change.
- Flat layout imports — `import myapp` works from the project root by accident but breaks once installed elsewhere; src/ layout forces a real install.
- Mixing system Python with project deps — install everything into a venv; never `sudo pip install`.
- Forgetting to add __init__.py — pre-3.3 packages required it; today namespace packages work without it, but explicit __init__.py is clearer.

### Real-World Applications

- FastAPI's own codebase uses pyproject.toml + src/ layout + modern tooling.
- Black uses pyproject.toml with entry points so `black` is a CLI command after install.
- Pandas uses setuptools with a complex pyproject.toml and Cython build steps.
- Poetry and uv (Astral) are themselves Python packages distributed via pyproject.toml + entry points.

### Interview Questions

- 1. Why use a virtual environment? — Isolates project dependencies; prevents version conflicts across projects and from system Python.
- 2. What's the difference between requirements.txt and pyproject.toml? — requirements.txt is a flat list of deps; pyproject.toml (PEP 621) is the modern standard for project metadata + deps + tool config.
- 3. Why prefer src/ layout? — Forces you to install the package before importing it, catching packaging bugs early; prevents accidental imports from the project root.
- 4. What's an entry point (console_scripts)? — A CLI command mapped to a Python function, installed automatically by pip; lets users run `myapp` instead of `python -m myapp`.
- 5. What's a lockfile? — A file (poetry.lock, uv.lock) recording exact transitive versions for reproducible installs across machines and time.

### Mini Project

Build a Publishable CLI Package: Convert the Stage 13 CLI toolkit into a proper installable package with pyproject.toml, src/ layout, entry point, and a console_scripts command. Suggested approach:
  - Restructure into src/myapp/ with __init__.py exposing __version__
  - Write pyproject.toml with [build-system], [project], [project.scripts]
  - Add a [project.optional-dependencies] dev section with pytest, ruff, mypy
  - Install editable with `pip install -e .` and verify `myapp` command works
  - Add a .gitignore that excludes .venv, *.egg-info, __pycache__, dist/

### Exercises

1. Create a venv, install requests, and pip freeze to requirements.txt.
2. Write a minimal pyproject.toml with name, version, dependencies, and one optional-deps group.
3. Restructure a flat project into src/ layout; verify `pip install -e .` works.
4. Add a [project.scripts] entry point and verify the CLI command runs after install.
5. Add ruff and mypy config sections to pyproject.toml; run `ruff check .` and `mypy src`.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why use a virtual environment?
9. A) It's required by Python
10. B) Isolates project dependencies from system Python and other projects (*)
11. C) It makes code faster
12. D) It's the only way to install packages
13. Explanation: venv isolates each project's deps, preventing version conflicts and protecting the system Python from breakage.
14. Q2: Which is the modern standard for project metadata?
15. A) pyproject.toml (PEP 621) (*)
16. B) setup.cfg
17. C) setup.py
18. D) requirements.txt
19. Explanation: pyproject.toml is the modern standard; setup.py/setup.cfg are legacy. requirements.txt is just a dep list, not metadata.
20. Q3: Why prefer src/ layout over flat layout?
21. A) It's faster
22. B) Required by pip
23. C) Forces a real install before import — catches packaging bugs (*)
24. D) Smaller file size
25. Explanation: With src/, you can't accidentally import the package from the project root; you must `pip install -e .` first, which catches packaging bugs in tests.
26. Q4: What does [project.scripts] define?
27. A) Build scripts
28. B) Shell scripts
29. C) Test scripts
30. D) Entry points — CLI commands mapped to Python functions (*)
31. Explanation: [project.scripts] maps a command name to a function (e.g. myapp = "myapp.cli:main"); pip install creates the executable.
32. Q5: What should be in .gitignore for a Python project?
33. A) pyproject.toml
34. B) .venv/, __pycache__/, *.egg-info, dist/ (*)
35. C) src/
36. D) README.md
37. Explanation: .venv (machine-specific), __pycache__ (compiled bytecode), *.egg-info/dist (build artifacts) shouldn't be committed; source files should be.
38. Q6: What's a lockfile for?
39. A) Recording exact transitive versions for reproducible installs (*)
40. B) Locking the Python version
41. C) Preventing concurrent pip installs
42. D) Locking the package from PyPI
43. Explanation: Lockfiles (poetry.lock, uv.lock, pip-tools' requirements.lock) pin exact versions of all transitive deps so installs are reproducible.
44. Q7: Which is the modern, very fast pip alternative?
45. A) conda
46. B) easy_install
47. C) uv (*)
48. D) distribute
49. Explanation: uv (by Astral, written in Rust) is 10-100x faster than pip and handles venv creation, installs, and lockfiles in one tool.
50. Q8: What's wrong with `sudo pip install`?
51. A) Slower than venv
52. B) Only works on Windows
53. C) Not allowed on Linux
54. D) Pollutes system Python — can break OS tools that depend on it (*)
55. Explanation: System Python is often used by OS tools (e.g. apt, yum); changing its packages can break the OS. Always use a venv.
56. Q9: Which is correct for editable install during development?
57. A) pip install .
58. B) pip install -e . (*)
59. C) pip install --editable
60. D) python setup.py install
61. Explanation: `pip install -e .` (editable) installs the package in "develop mode" — changes to source are reflected immediately without reinstall.
62. Q10: What does requires-python = ">=3.10" in pyproject.toml do?
63. A) Declares the minimum Python version; pip refuses to install on older versions (*)
64. B) Installs Python 3.10 if missing
65. C) Forces the user to upgrade
66. D) Sets the build Python
67. Explanation: requires-python is metadata; pip checks the user's Python version and refuses to install if it doesn't satisfy the constraint.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why use a virtual environment?
  options:
    - It's required by Python
    - Isolates project dependencies from system Python and other projects
    - It makes code faster
    - It's the only way to install packages
  correctIndex: 1
  explanation: venv isolates each project's deps, preventing version conflicts and protecting the system Python from breakage.
- id: q2
  question: Which is the modern standard for project metadata?
  options:
    - pyproject.toml (PEP 621)
    - setup.cfg
    - setup.py
    - requirements.txt
  correctIndex: 0
  explanation: pyproject.toml is the modern standard; setup.py/setup.cfg are legacy. requirements.txt is just a dep list, not metadata.
- id: q3
  question: Why prefer src/ layout over flat layout?
  options:
    - It's faster
    - Required by pip
    - Forces a real install before import — catches packaging bugs
    - Smaller file size
  correctIndex: 2
  explanation: With src/, you can't accidentally import the package from the project root; you must `pip install -e .` first, which catches packaging bugs in tests.
- id: q4
  question: What does [project.scripts] define?
  options:
    - Build scripts
    - Shell scripts
    - Test scripts
    - Entry points — CLI commands mapped to Python functions
  correctIndex: 3
  explanation: '[project.scripts] maps a command name to a function (e.g. myapp = "myapp.cli:main"); pip install creates the executable.'
- id: q5
  question: What should be in .gitignore for a Python project?
  options:
    - pyproject.toml
    - .venv/, __pycache__/, *.egg-info, dist/
    - src/
    - README.md
  correctIndex: 1
  explanation: .venv (machine-specific), __pycache__ (compiled bytecode), *.egg-info/dist (build artifacts) shouldn't be committed; source files should be.
- id: q6
  question: What's a lockfile for?
  options:
    - Recording exact transitive versions for reproducible installs
    - Locking the Python version
    - Preventing concurrent pip installs
    - Locking the package from PyPI
  correctIndex: 0
  explanation: Lockfiles (poetry.lock, uv.lock, pip-tools' requirements.lock) pin exact versions of all transitive deps so installs are reproducible.
- id: q7
  question: Which is the modern, very fast pip alternative?
  options:
    - conda
    - easy_install
    - uv
    - distribute
  correctIndex: 2
  explanation: uv (by Astral, written in Rust) is 10-100x faster than pip and handles venv creation, installs, and lockfiles in one tool.
- id: q8
  question: What's wrong with `sudo pip install`?
  options:
    - Slower than venv
    - Only works on Windows
    - Not allowed on Linux
    - Pollutes system Python — can break OS tools that depend on it
  correctIndex: 3
  explanation: System Python is often used by OS tools (e.g. apt, yum); changing its packages can break the OS. Always use a venv.
- id: q9
  question: Which is correct for editable install during development?
  options:
    - pip install .
    - pip install -e .
    - pip install --editable
    - python setup.py install
  correctIndex: 1
  explanation: '`pip install -e .` (editable) installs the package in "develop mode" — changes to source are reflected immediately without reinstall.'
- id: q10
  question: What does requires-python = ">=3.10" in pyproject.toml do?
  options:
    - Declares the minimum Python version; pip refuses to install on older versions
    - Installs Python 3.10 if missing
    - Forces the user to upgrade
    - Sets the build Python
  correctIndex: 0
  explanation: requires-python is metadata; pip checks the user's Python version and refuses to install if it doesn't satisfy the constraint.
```

