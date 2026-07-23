---
slug: python-variables-data-types
id: python-02
track: python
order: 2
title: Variables and Data Types
description: Learn how Python variables work as name tags on objects, and meet the core built-in types (int, float, str, bool, None, complex).
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=720s
whyItMatters: Learn how Python variables work as name tags on objects, and meet the core built-in types (int, float, str, bool, None, complex).
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Variables and Data Types

## Variables and Data Types

### Why It Matters

Learn how Python variables work as name tags on objects, and meet the core built-in types (int, float, str, bool, None, complex).

Learn how Python variables work as name tags on objects, and meet the core built-in types (int, float, str, bool, None, complex).

### Prerequisites

- Stage 1: Getting Started with Python
- Comfort running .py files and using the REPL.

### Topics

- Variable assignment and rebinding
- Dynamic typing vs static typing
- Core built-in types: int, float, str, bool, NoneType, complex
- type(), isinstance(), id()
- Mutable vs immutable types (overview)
- Multiple assignment and tuple unpacking
- Type hints (basic annotations, not enforced at runtime)
- Naming rules and PEP 8 conventions (snake_case)

### Key Concepts

- Variables are names bound to objects, not boxes that hold values.
- "Dynamic typing" means a name can be rebound to any type at any time.
- Everything is an object, including functions and classes.
- id() returns the identity (memory address) of an object.
- isinstance(x, (int, float)) is preferred over type(x) == int.

```python
x = 10          # x bound to int 10
print(type(x))  # <class 'int'>
x = "ten"       # rebind x to a str — totally legal in Python
print(type(x))  # <class 'str'>
```
Caption: Assignment and rebinding

### Common Pitfalls

- Treating variables as boxes — Python variables are name tags on objects; `a = b` binds a second name to the same object, which surprises people when the object is mutable.
- Using type(x) == int instead of isinstance(x, int) — isinstance handles subclasses (like bool being an int subclass); prefer isinstance.
- Forgetting that None is a singleton — always compare with `x is None`, never `x == None` (PEP 8 explicitly recommends this).
- Mixing tabs and spaces — Python 3 disallows mixing in the same block; pick one (spaces, per PEP 8).
- Using Python keywords as variable names (class, type, list, dict) — this shadows the builtin and breaks later code.

### Real-World Applications

- Spotify's backend uses Python for variable-heavy data pipeline orchestration; correct type handling prevents silent bugs in ETL.
- Instagram uses isinstance checks in Django class-based views to dispatch different serializers.
- JPMorgan's Athena platform uses Python with type hints (mypy) to enforce type contracts across thousands of modules.
- Dropbox's type-checking migration to mypy caught hundreds of bugs at static-analysis time.

### Interview Questions

- 1. What's the difference between dynamic and static typing? — Python checks types at runtime; static languages check at compile time.
- 2. Is Python strongly or weakly typed? — Strongly: "1" + 1 raises TypeError, unlike JavaScript which coerces.
- 3. How are Python variables stored? — Names are references bound to objects in memory; assignment rebinds the name.
- 4. What's the difference between `==` and `is`? — `==` compares values, `is` compares identity (same object in memory).
- 5. Why is `is None` preferred over `== None`? — None is a singleton; `is` is faster and immune to weird __eq__ overrides.

### Mini Project

Build a Type Inspector CLI: A tool that takes any Python literal as a string (e.g. "42", "3.14", "true", "[1,2]") and reports its inferred type, value, id, and mutability. Suggested approach:
  - Use ast.literal_eval to safely parse the input
  - Build a dict mapping type -> mutability flag
  - Print type, value, id, and "mutable" or "immutable"
  - Handle parse errors with a friendly message
  - Add a --json flag to emit results as JSON

### Exercises

1. Create variables of each core type (int, float, str, bool, None, complex) and print their type() and id().
2. Demonstrate that `a = b = [1, 2, 3]` makes both names point to the same list by appending to one and printing the other.
3. Write a function that uses isinstance to return different strings for int, float, str, list, dict, and "unknown".
4. Add type hints to a function `def add(a, b): return a + b` and verify with `mypy` that passing mismatched types raises a warning.
5. Show that `True + True` evaluates to 2 — explain why by checking `isinstance(True, int)`.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `x = 5` do in Python?
9. A) Binds the name x to an int object with value 5 (*)
10. B) Creates a box named x and puts 5 in it
11. C) Allocates memory of fixed size for x
12. D) Declares x as a static int variable
13. Explanation: Python variables are name tags on objects; assignment binds a name to an object, not the other way around.
14. Q2: Which builtin returns True for isinstance(7, int)?
15. A) type(7) == int
16. B) 7.isint()
17. C) isinstance(7, int) (*)
18. D) type(7).isinstance(int)
19. Explanation: isinstance is the canonical type check; it also handles subclasses (e.g. bool is an int).
20. Q3: What is the type of None?
21. A) None
22. B) NoneType (*)
23. C) Null
24. D) null
25. Explanation: None is the singleton instance of NoneType; type(None) returns <class 'NoneType'>.
26. Q4: Which of these is a mutable type?
27. A) tuple
28. B) str
29. C) frozenset
30. D) list (*)
31. Explanation: list is mutable; tuple, str, and frozenset are immutable (their contents cannot change after creation).
32. Q5: `a = b = [1, 2]` then `b.append(3)` — what is `a`?
33. A) [1, 2, 3] (*)
34. B) [1, 2]
35. C) Raises an error
36. D) [1, 2] but b is [1, 2, 3]
37. Explanation: Both names bind to the same list object; appending via b mutates that object, visible through a.
38. Q6: How should you check if a variable x is None?
39. A) if x == None
40. B) if x.equals(None)
41. C) if x = None
42. D) if x is None (*)
43. Explanation: None is a singleton; PEP 8 recommends `is None` because it's faster and immune to __eq__ overrides.
44. Q7: Which is True given `isinstance(True, int)`?
45. A) False — bool and int are unrelated
46. B) Raises TypeError
47. C) True — bool is a subclass of int (*)
48. D) Depends on Python version
49. Explanation: bool subclasses int (True==1, False==0); isinstance reflects the inheritance hierarchy.
50. Q8: What does id(x) return?
51. A) The variable's name as a string
52. B) The object's identity (typically its memory address) (*)
53. C) The object's type
54. D) A unique hash of the value
55. Explanation: id() returns an integer guaranteed unique and constant for the object's lifetime; CPython uses the memory address.
56. Q9: What's the result of `type(3.14)`?
57. A) <class 'float'> (*)
58. B) <class 'number'>
59. C) <class 'decimal'>
60. D) <class 'real'>
61. Explanation: 3.14 is a float; Python uses the IEEE 754 double-precision format for floats.
62. Q10: What happens with `x: int = "hello"`?
63. A) TypeError at runtime
64. B) x is automatically converted to 0
65. C) No error — type hints are not enforced at runtime (*)
66. D) mypy is invoked automatically
67. Explanation: Annotations are metadata; Python does not check them at runtime. Tools like mypy do static checking.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `x = 5` do in Python?
  options:
    - Binds the name x to an int object with value 5
    - Creates a box named x and puts 5 in it
    - Allocates memory of fixed size for x
    - Declares x as a static int variable
  correctIndex: 0
  explanation: Python variables are name tags on objects; assignment binds a name to an object, not the other way around.
- id: q2
  question: Which builtin returns True for isinstance(7, int)?
  options:
    - type(7) == int
    - 7.isint()
    - isinstance(7, int)
    - type(7).isinstance(int)
  correctIndex: 2
  explanation: isinstance is the canonical type check; it also handles subclasses (e.g. bool is an int).
- id: q3
  question: What is the type of None?
  options:
    - None
    - NoneType
    - "Null"
    - "null"
  correctIndex: 1
  explanation: None is the singleton instance of NoneType; type(None) returns <class 'NoneType'>.
- id: q4
  question: Which of these is a mutable type?
  options:
    - tuple
    - str
    - frozenset
    - list
  correctIndex: 3
  explanation: list is mutable; tuple, str, and frozenset are immutable (their contents cannot change after creation).
- id: q5
  question: "`a = b = [1, 2]` then `b.append(3)` — what is `a`?"
  options:
    - "[1, 2, 3]"
    - "[1, 2]"
    - Raises an error
    - "[1, 2] but b is [1, 2, 3]"
  correctIndex: 0
  explanation: Both names bind to the same list object; appending via b mutates that object, visible through a.
- id: q6
  question: How should you check if a variable x is None?
  options:
    - if x == None
    - if x.equals(None)
    - if x = None
    - if x is None
  correctIndex: 3
  explanation: None is a singleton; PEP 8 recommends `is None` because it's faster and immune to __eq__ overrides.
- id: q7
  question: Which is True given `isinstance(True, int)`?
  options:
    - False — bool and int are unrelated
    - Raises TypeError
    - True — bool is a subclass of int
    - Depends on Python version
  correctIndex: 2
  explanation: bool subclasses int (True==1, False==0); isinstance reflects the inheritance hierarchy.
- id: q8
  question: What does id(x) return?
  options:
    - The variable's name as a string
    - The object's identity (typically its memory address)
    - The object's type
    - A unique hash of the value
  correctIndex: 1
  explanation: id() returns an integer guaranteed unique and constant for the object's lifetime; CPython uses the memory address.
- id: q9
  question: What's the result of `type(3.14)`?
  options:
    - <class 'float'>
    - <class 'number'>
    - <class 'decimal'>
    - <class 'real'>
  correctIndex: 0
  explanation: 3.14 is a float; Python uses the IEEE 754 double-precision format for floats.
- id: q10
  question: 'What happens with `x: int = "hello"`?'
  options:
    - TypeError at runtime
    - x is automatically converted to 0
    - No error — type hints are not enforced at runtime
    - mypy is invoked automatically
  correctIndex: 2
  explanation: Annotations are metadata; Python does not check them at runtime. Tools like mypy do static checking.
```

