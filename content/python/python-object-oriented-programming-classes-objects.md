---
slug: python-object-oriented-programming-classes-objects
id: python-09
track: python
order: 9
title: Object-Oriented Programming — Classes and Objects
description: Model real-world entities with classes and objects — __init__, self, instance vs class attributes, methods, properties, and the deadly mutable-class-attribute trap.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=9300s
whyItMatters: Model real-world entities with classes and objects — __init__, self, instance vs class attributes, methods, properties, and the deadly mutable-class-attribute trap.
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Object-Oriented Programming — Classes and Objects

## Object-Oriented Programming — Classes and Objects

### Why It Matters

Model real-world entities with classes and objects — __init__, self, instance vs class attributes, methods, properties, and the deadly mutable-class-attribute trap.

Model real-world entities with classes and objects — __init__, self, instance vs class attributes, methods, properties, and the deadly mutable-class-attribute trap.

### Prerequisites

- Stage 8: Comprehensions and Generators
- Stage 7: Data Structures (mutable vs immutable).

### Topics

- class keyword and class body
- __init__ and self
- Instance attributes vs class attributes
- Instance methods, @classmethod, @staticmethod
- Properties (@property, getter/setter)
- __repr__ vs __str__
- name mangling with __double_leading_underscore
- Dataclasses (3.7+) for boilerplate-free data holders
- Composition vs inheritance (intro)

### Key Concepts

- A class is a blueprint; an object is an instance with its own state.
- `self` is the conventional name for the instance reference passed as the first parameter.
- Class attributes are shared across all instances; instance attributes are per-object.
- @property turns a method into a computed attribute (with optional setter).
- @classmethod receives the class as first arg (cls); @staticmethod receives neither self nor cls.

```python
class Dog:
    species = "Canis familiaris"   # class attribute — shared

    def __init__(self, name, age):
        self.name = name           # instance attribute
        self.age = age

    def bark(self):                # instance method
        return f"{self.name} says woof!"

    @classmethod
    def from_dict(cls, d):
        return cls(d["name"], d["age"])

dog = Dog("Rex", 5)
print(dog.bark())         # Rex says woof!
print(dog.species)        # Canis familiaris
print(Dog.from_dict({"name": "Max", "age": 3}).bark())  # Max says woof!
```
Caption: Basic class

### Common Pitfalls

- Mutable class attributes — `class C: items = []` shares the list across ALL instances; fix by initializing in __init__.
- Forgetting `self` as the first parameter — `def bark(name)` should be `def bark(self)`; otherwise TypeError on call.
- Defining a property with only a getter and trying to assign — @property without @x.setter makes the attribute read-only; assignment raises AttributeError.
- Confusing `__str__` (user-facing) with `__repr__` (developer-facing, should be unambiguous) — define both; if only one, define __repr__.
- Using __double_underscore for "private" — it's name mangling, not access control; `_single` is the convention for "internal."

### Real-World Applications

- Instagram's Django models use Python classes extensively; class attributes model DB schema, instance attributes model rows.
- Spotify's audio feature pipeline uses dataclasses to pass track metadata through processing stages.
- Dropbox's file-sync engine uses properties to expose computed attributes (sync status, size on disk).
- Reddit's comment tree uses @classmethod constructors to build trees from API responses.

### Interview Questions

- 1. What is `self`? — The instance reference passed as the first parameter to instance methods; convention, not a keyword.
- 2. What's the difference between a class attribute and an instance attribute? — Class attrs are shared across all instances; instance attrs are per-object.
- 3. What does @property do? — Turns a method into a computed attribute; supports optional getter/setter/deleter.
- 4. What's the mutable class attribute trap? — Putting a mutable (list/dict/set) at class scope shares it across all instances; fix in __init__.
- 5. When would you use @classmethod vs @staticmethod? — @classmethod for alternate constructors (cls); @staticmethod for utility helpers that don't need self/cls.

### Mini Project

Build a Bank Account class hierarchy: A base Account class with deposit/withdraw, a SavingsAccount with interest accrual, and a CheckingAccount with overdraft protection. Use @property for balance, raise ValueError on invalid operations, and add a __repr__. Suggested approach:
  - Define Account with _balance protected attribute
  - Use @property for balance (read-only)
  - Add @classmethod from_json to construct from API responses
  - Override withdraw in subclasses with different rules
  - Use a dataclass for transaction records

### Exercises

1. Write a Dog class with name and breed instance attributes and a bark() method.
2. Reproduce the mutable class attribute trap with `class C: items = []` and fix it.
3. Add a @property to a Circle class that computes area from radius.
4. Convert a plain class to a dataclass with type hints and a default_factory list.
5. Add __repr__ and __str__ to a class so print(obj) and repr(obj) differ.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is `self` in a Python method?
9. A) A keyword meaning "this class"
10. B) The class object itself
11. C) A global variable
12. D) The instance reference passed as the first parameter (*)
13. Explanation: By convention, the first parameter of an instance method is named self and refers to the instance the method was called on.
14. Q2: What's wrong with `class C: items = []`?
15. A) The list is shared across ALL instances of C (*)
16. B) SyntaxError
17. C) items cannot be a list
18. D) Nothing — this is correct
19. Explanation: Class-level mutable attributes are shared; mutating via one instance affects all. Initialize in __init__ instead.
20. Q3: What does @property do?
21. A) Marks a class as abstract
22. B) Caches the method result
23. C) Turns a method into a computed attribute (with optional setter) (*)
24. D) Makes the method static
25. Explanation: @property lets you access a method like an attribute; pair with @x.setter for controlled assignment.
26. Q4: What's the difference between @classmethod and @staticmethod?
27. A) They're identical
28. B) @classmethod receives cls; @staticmethod receives neither self nor cls (*)
29. C) @staticmethod receives cls; @classmethod receives self
30. D) @classmethod is for instances only
31. Explanation: @classmethod's first arg is the class (cls) — good for alternate constructors. @staticmethod is just a function attached to a class.
32. Q5: Which method should you define for `repr(obj)`?
33. A) __str__
34. B) __tostring__
35. C) __print__
36. D) __repr__ (*)
37. Explanation: __repr__ is for developers and should be unambiguous (ideally eval-able); __str__ is for end users. If only one, define __repr__.
38. Q6: What does a @property with no @x.setter allow?
39. A) Read-only — assignment raises AttributeError (*)
40. B) Read and write
41. C) Write-only
42. D) Neither read nor write
43. Explanation: A property with only a getter is read-only; obj.x = ... raises AttributeError: can't set attribute.
44. Q7: Which decorator creates boilerplate-free data holders (3.7+)?
45. A) @holder
46. B) @struct
47. C) @dataclass (*)
48. D) @record
49. Explanation: @dataclass auto-generates __init__, __repr__, __eq__ from type-annotated fields.
50. Q8: How do you set a mutable default in a dataclass?
51. A) tags: list = []
52. B) tags: list = field(default_factory=list) (*)
53. C) tags: list = list()
54. D) tags = []
55. Explanation: Mutable defaults must use field(default_factory=...) — using [] directly raises ValueError (the dataclass version of the mutable-default trap).
56. Q9: What does `__double_leading_underscore` do?
57. A) Marks a method as private (convention only)
58. B) Throws SyntaxError
59. C) Makes the method static
60. D) Triggers name mangling: __x becomes _ClassName__x (*)
61. Explanation: Double leading underscore triggers name mangling to avoid collisions in subclasses; it's NOT access control.
62. Q10: When does __init__ run?
63. A) When an instance is created via ClassName(...) (*)
64. B) When the class is defined
65. C) When an attribute is accessed
66. D) When the instance is garbage-collected
67. Explanation: __init__ is the initializer; it runs after __new__ creates the instance, when you call ClassName(args).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is `self` in a Python method?
  options:
    - A keyword meaning "this class"
    - The class object itself
    - A global variable
    - The instance reference passed as the first parameter
  correctIndex: 3
  explanation: By convention, the first parameter of an instance method is named self and refers to the instance the method was called on.
- id: q2
  question: "What's wrong with `class C: items = []`?"
  options:
    - The list is shared across ALL instances of C
    - SyntaxError
    - items cannot be a list
    - Nothing — this is correct
  correctIndex: 0
  explanation: Class-level mutable attributes are shared; mutating via one instance affects all. Initialize in __init__ instead.
- id: q3
  question: What does @property do?
  options:
    - Marks a class as abstract
    - Caches the method result
    - Turns a method into a computed attribute (with optional setter)
    - Makes the method static
  correctIndex: 2
  explanation: "@property lets you access a method like an attribute; pair with @x.setter for controlled assignment."
- id: q4
  question: What's the difference between @classmethod and @staticmethod?
  options:
    - They're identical
    - "@classmethod receives cls; @staticmethod receives neither self nor cls"
    - "@staticmethod receives cls; @classmethod receives self"
    - "@classmethod is for instances only"
  correctIndex: 1
  explanation: "@classmethod's first arg is the class (cls) — good for alternate constructors. @staticmethod is just a function attached to a class."
- id: q5
  question: Which method should you define for `repr(obj)`?
  options:
    - __str__
    - __tostring__
    - __print__
    - __repr__
  correctIndex: 3
  explanation: __repr__ is for developers and should be unambiguous (ideally eval-able); __str__ is for end users. If only one, define __repr__.
- id: q6
  question: What does a @property with no @x.setter allow?
  options:
    - Read-only — assignment raises AttributeError
    - Read and write
    - Write-only
    - Neither read nor write
  correctIndex: 0
  explanation: "A property with only a getter is read-only; obj.x = ... raises AttributeError: can't set attribute."
- id: q7
  question: Which decorator creates boilerplate-free data holders (3.7+)?
  options:
    - "@holder"
    - "@struct"
    - "@dataclass"
    - "@record"
  correctIndex: 2
  explanation: "@dataclass auto-generates __init__, __repr__, __eq__ from type-annotated fields."
- id: q8
  question: How do you set a mutable default in a dataclass?
  options:
    - "tags: list = []"
    - "tags: list = field(default_factory=list)"
    - "tags: list = list()"
    - tags = []
  correctIndex: 1
  explanation: Mutable defaults must use field(default_factory=...) — using [] directly raises ValueError (the dataclass version of the mutable-default trap).
- id: q9
  question: What does `__double_leading_underscore` do?
  options:
    - Marks a method as private (convention only)
    - Throws SyntaxError
    - Makes the method static
    - "Triggers name mangling: __x becomes _ClassName__x"
  correctIndex: 3
  explanation: Double leading underscore triggers name mangling to avoid collisions in subclasses; it's NOT access control.
- id: q10
  question: When does __init__ run?
  options:
    - When an instance is created via ClassName(...)
    - When the class is defined
    - When an attribute is accessed
    - When the instance is garbage-collected
  correctIndex: 0
  explanation: __init__ is the initializer; it runs after __new__ creates the instance, when you call ClassName(args).
```

