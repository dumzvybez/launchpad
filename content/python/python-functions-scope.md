---
slug: python-functions-scope
id: python-06
track: python
order: 6
title: Functions and Scope
description: Define reusable functions, understand Python's LEGB scoping rules, and master *args/**kwargs — while avoiding the infamous mutable-default-argument trap.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=5400s
whyItMatters: Define reusable functions, understand Python's LEGB scoping rules, and master *args/**kwargs — while avoiding the infamous mutable-default-argument trap.
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Functions and Scope

## Functions and Scope

### Why It Matters

Define reusable functions, understand Python's LEGB scoping rules, and master *args/**kwargs — while avoiding the infamous mutable-default-argument trap.

Define reusable functions, understand Python's LEGB scoping rules, and master *args/**kwargs — while avoiding the infamous mutable-default-argument trap.

### Prerequisites

- Stage 5: Control Flow — Conditionals and Loops
- Stage 2: Variables and Data Types (mutability concepts).

### Topics

- def, parameters, return values
- Default argument values
- *args and **kwargs
- Keyword-only and positional-only parameters (3.8+)
- Lambda expressions
- LEGB scoping (Local, Enclosing, Global, Built-in)
- global and nonlocal keywords
- Closures and capturing variables
- Type hints and docstrings

### Key Concepts

- Default arguments are evaluated ONCE at function definition, not each call — the source of the mutable-default-argument bug.
- Python looks up names in LEGB order: Local -> Enclosing -> Global -> Built-in.
- *args collects positional args into a tuple; **kwargs collects keyword args into a dict.
- A closure captures variables by reference, not value — late-binding closures in loops are a classic bug.
- Functions without an explicit return return None.

```python
# BAD — default list is shared across ALL calls
def add_item(item, lst=[]):
    lst.append(item)
    return lst

print(add_item(1))  # [1]
print(add_item(2))  # [1, 2]  ← not [2]! The same list is reused

# GOOD — use None as a sentinel
def add_item_fixed(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst

print(add_item_fixed(1))  # [1]
print(add_item_fixed(2))  # [2]  ← correct
```
Caption: The mutable default argument trap

### Common Pitfalls

- Mutable default arguments (`def f(x=[])`) — the default is shared across calls; use `def f(x=None): if x is None: x = []`.
- Late-binding closures in loops — `lambda: i` captures the variable i, not its value; use `lambda i=i: i` to bind at definition time.
- Forgetting `return` — a function with no return returns None; `result = func()` then `result + 1` raises TypeError.
- Using `global` when you meant `nonlocal` — `global` rebinds a module-level name; `nonlocal` rebinds an enclosing function's name.
- Modifying a global from inside a function without declaring it — `counter += 1` raises UnboundLocalError; need `global counter`.

### Real-World Applications

- Flask and FastAPI use **kwargs extensively to pass request data to view handlers.
- Django's class-based views use *args/**kwargs to forward init arguments through inheritance chains.
- SQLAlchemy uses closures and lazy evaluation to build query objects at definition time.
- Airflow's DAG definitions rely on closures to capture task context at scheduler time.

### Interview Questions

- 1. What's the mutable default argument bug? — Default values are evaluated once at def time; mutable defaults like [] are shared across all calls.
- 2. What's the fix? — Use None as a sentinel and create the mutable inside the function body.
- 3. What is LEGB? — Python's name resolution order: Local, Enclosing, Global, Built-in.
- 4. What's the difference between *args and **kwargs? — *args collects positional args into a tuple; **kwargs collects keyword args into a dict.
- 5. What is a closure? — A function that retains access to variables from its enclosing scope, even after that scope has finished executing.

### Mini Project

Build a Config Builder: A function `make_config(**kwargs)` that returns a frozen dict of config, with defaults merged in. Then write a decorator `@validate(**types)` that type-checks arguments at call time using isinstance. Suggested approach:
  - Store defaults in a module-level dict
  - Use {**defaults, **kwargs} to merge
  - Use functools.wraps to preserve metadata in the decorator
  - Inspect function signature with inspect.signature
  - Raise TypeError on mismatched types

### Exercises

1. Reproduce the mutable-default-argument bug with `def f(x=[])` and prove the same list is reused across calls.
2. Fix the bug using `x=None` as a sentinel.
3. Reproduce the late-binding closure trap and fix it with `lambda i=i: i`.
4. Write a function that uses LEGB to read a global, then a function that uses `global` to modify it.
5. Write a decorator `@timer` that prints how long a function took to run, using functools.wraps.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's wrong with `def f(x=[])`?
9. A) The default list is created once at def time and shared across all calls (*)
10. B) SyntaxError
11. C) x cannot have a default
12. D) Nothing — it works fine
13. Explanation: Default values are evaluated ONCE at function definition; the same list object is reused across calls, accumulating state.
14. Q2: What's the fix for the mutable default argument trap?
15. A) Use a tuple instead of a list
16. B) Declare x as global
17. C) Add a type hint
18. D) Use None as a sentinel and create the mutable inside the body (*)
19. Explanation: `def f(x=None): if x is None: x = []` creates a fresh list on every call where x wasn't passed.
20. Q3: What does *args collect?
21. A) A list of positional arguments
22. B) A tuple of positional arguments (*)
23. C) A dict of keyword arguments
24. D) A set of arguments
25. Explanation: *args collects extra positional args into a tuple; **kwargs collects extra keyword args into a dict.
26. Q4: What does LEGB stand for?
27. A) Loop, Exception, Global, Block
28. B) Local, External, Global, Builtin
29. C) Local, Enclosing, Global, Built-in (*)
30. D) Lexical, Enclosing, Global, Builtin
31. Explanation: Python resolves names in LEGB order: Local scope, Enclosing function scopes, Global module scope, Built-in scope.
32. Q5: What does `global x` do inside a function?
33. A) Allows rebinding the module-level x inside the function (*)
34. B) Reads x from the global scope
35. C) Creates a new global variable
36. D) Throws NameError if x doesn't exist
37. Explanation: Without `global x`, assigning to x inside a function creates a local; `global` lets you rebind the module-level name.
38. Q6: What does `[lambda: i for i in range(3)][0]()` return?
39. A) 0
40. B) Raises NameError
41. C) 1
42. D) 2 (*)
43. Explanation: Lambdas capture the variable i by reference; by call time i is 2 (the last value from the loop). This is "late binding."
44. Q7: How to fix the late-binding closure trap?
45. A) Use def instead of lambda
46. B) Bind i as a default arg: `lambda i=i: i` (*)
47. C) Use a global variable
48. D) Use functools.partial after the loop
49. Explanation: Default arguments are evaluated at def time, so `lambda i=i: i` captures the current value of i for each lambda.
50. Q8: What does a function without `return` return?
51. A) 0
52. B) The last evaluated expression
53. C) None (*)
54. D) Raises SyntaxError
55. Explanation: Functions without an explicit return return None; this often surprises people doing `result = func()`.
56. Q9: What does `nonlocal x` do?
57. A) Lets a nested function rebind a variable in an enclosing function's scope (*)
58. B) Makes x a module-level variable
59. C) Same as `global x`
60. D) Creates a thread-local variable
61. Explanation: `nonlocal` is for nested functions: it allows rebinding a name in the nearest enclosing function scope (not global).
62. Q10: What does **kwargs always contain?
63. A) A list
64. B) A tuple
65. C) A set
66. D) A dict of keyword arguments (*)
67. Explanation: **kwargs collects unmatched keyword arguments into a dict (string keys, whatever values).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's wrong with `def f(x=[])`?
  options:
    - The default list is created once at def time and shared across all calls
    - SyntaxError
    - x cannot have a default
    - Nothing — it works fine
  correctIndex: 0
  explanation: Default values are evaluated ONCE at function definition; the same list object is reused across calls, accumulating state.
- id: q2
  question: What's the fix for the mutable default argument trap?
  options:
    - Use a tuple instead of a list
    - Declare x as global
    - Add a type hint
    - Use None as a sentinel and create the mutable inside the body
  correctIndex: 3
  explanation: "`def f(x=None): if x is None: x = []` creates a fresh list on every call where x wasn't passed."
- id: q3
  question: What does *args collect?
  options:
    - A list of positional arguments
    - A tuple of positional arguments
    - A dict of keyword arguments
    - A set of arguments
  correctIndex: 1
  explanation: "*args collects extra positional args into a tuple; **kwargs collects extra keyword args into a dict."
- id: q4
  question: What does LEGB stand for?
  options:
    - Loop, Exception, Global, Block
    - Local, External, Global, Builtin
    - Local, Enclosing, Global, Built-in
    - Lexical, Enclosing, Global, Builtin
  correctIndex: 2
  explanation: "Python resolves names in LEGB order: Local scope, Enclosing function scopes, Global module scope, Built-in scope."
- id: q5
  question: What does `global x` do inside a function?
  options:
    - Allows rebinding the module-level x inside the function
    - Reads x from the global scope
    - Creates a new global variable
    - Throws NameError if x doesn't exist
  correctIndex: 0
  explanation: Without `global x`, assigning to x inside a function creates a local; `global` lets you rebind the module-level name.
- id: q6
  question: "What does `[lambda: i for i in range(3)][0]()` return?"
  options:
    - "0"
    - Raises NameError
    - "1"
    - "2"
  correctIndex: 3
  explanation: Lambdas capture the variable i by reference; by call time i is 2 (the last value from the loop). This is "late binding."
- id: q7
  question: How to fix the late-binding closure trap?
  options:
    - Use def instead of lambda
    - "Bind i as a default arg: `lambda i=i: i`"
    - Use a global variable
    - Use functools.partial after the loop
  correctIndex: 1
  explanation: "Default arguments are evaluated at def time, so `lambda i=i: i` captures the current value of i for each lambda."
- id: q8
  question: What does a function without `return` return?
  options:
    - "0"
    - The last evaluated expression
    - None
    - Raises SyntaxError
  correctIndex: 2
  explanation: Functions without an explicit return return None; this often surprises people doing `result = func()`.
- id: q9
  question: What does `nonlocal x` do?
  options:
    - Lets a nested function rebind a variable in an enclosing function's scope
    - Makes x a module-level variable
    - Same as `global x`
    - Creates a thread-local variable
  correctIndex: 0
  explanation: "`nonlocal` is for nested functions: it allows rebinding a name in the nearest enclosing function scope (not global)."
- id: q10
  question: What does **kwargs always contain?
  options:
    - A list
    - A tuple
    - A set
    - A dict of keyword arguments
  correctIndex: 3
  explanation: "**kwargs collects unmatched keyword arguments into a dict (string keys, whatever values)."
```

