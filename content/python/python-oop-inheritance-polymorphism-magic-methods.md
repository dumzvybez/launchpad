---
slug: python-oop-inheritance-polymorphism-magic-methods
id: python-10
track: python
order: 10
title: OOP — Inheritance, Polymorphism, Magic Methods
description: Build class hierarchies with inheritance and super(), master polymorphism via duck typing, and unlock Python's magic methods (dunders) to make your objects behave like built-ins.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=10600s
whyItMatters: Build class hierarchies with inheritance and super(), master polymorphism via duck typing, and unlock Python's magic methods (dunders) to make your objects behave like built-ins.
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# OOP — Inheritance, Polymorphism, Magic Methods

## OOP — Inheritance, Polymorphism, Magic Methods

### Why It Matters

Build class hierarchies with inheritance and super(), master polymorphism via duck typing, and unlock Python's magic methods (dunders) to make your objects behave like built-ins.

Build class hierarchies with inheritance and super(), master polymorphism via duck typing, and unlock Python's magic methods (dunders) to make your objects behave like built-ins.

### Prerequisites

- Stage 9: Object-Oriented Programming — Classes and Objects
- Stage 6: Functions and Scope (for understanding method resolution).

### Topics

- Single and multiple inheritance
- super() and cooperative multiple inheritance
- Method Resolution Order (MRO) and the C3 linearization
- Polymorphism and duck typing
- Abstract base classes (abc.ABC, @abstractmethod)
- Magic methods: __eq__, __hash__, __lt__, __len__, __getitem__, __iter__, __contains__
- __enter__/__exit__ for context managers (preview for Stage 11)
- __call__ for callable objects

### Key Concepts

- Subclasses inherit attributes and methods from their base class(es); override to specialize.
- super() in multiple inheritance follows the MRO (C3 linearization) — order matters.
- If you override __eq__, Python sets __hash__ to None (objects become unhashable) unless you also define __hash__.
- Duck typing: "if it walks like a duck..." — Python doesn't care about types, only behavior.
- Abstract base classes (ABCs) define interfaces; subclasses can't instantiate until all @abstractmethod are implemented.

```python
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        raise NotImplementedError

class Dog(Animal):
    def speak(self):
        return f"{self.name} says woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says meow!"

for a in [Dog("Rex"), Cat("Whiskers")]:
    print(a.speak())  # polymorphism — same call, different behavior
```
Caption: Inheritance and super()

### Common Pitfalls

- Forgetting to define __hash__ when you override __eq__ — Python sets __hash__ = None, making your objects unhashable (can't put them in sets or use as dict keys).
- Using super() in multiple inheritance without understanding MRO — debug with `cls.__mro__` to see the actual call order.
- Diamond inheritance with non-cooperative super() — every class in the hierarchy must call super().__init__() with **kwargs for cooperative MRO to work.
- Liskov violations — overriding a method to reject a subclass of inputs that the parent accepted; breaks substitutability.
- Returning NotImplemented vs raising TypeError in __eq__ — return NotImplemented (not raise) so Python can try the reflected operation.

### Real-World Applications

- Django's class-based views use multiple inheritance with mixins (LoginRequiredMixin, TemplateResponseMixin) — MRO matters.
- SQLAlchemy uses __eq__/__hash__ on column descriptors to enable ORM queries like `User.name == "Ada"`.
- NumPy's ndarray overrides __getitem__, __add__, __len__ to make arrays behave like Python containers.
- Pandas DataFrame uses __iter__, __getitem__, and __len__ to integrate with Python's iteration and slicing protocols.

### Interview Questions

- 1. What is the MRO? — Method Resolution Order, the order Python searches classes for methods; computed via C3 linearization (since 2.3).
- 2. What happens if you override __eq__ but not __hash__? — __hash__ is set to None; instances become unhashable (can't use in sets or as dict keys).
- 3. What is duck typing? — Python checks behavior, not type; if an object has the methods you call, it works.
- 4. What's the difference between an ABC and a regular class? — ABCs can't be instantiated until all @abstractmethod are implemented in subclasses.
- 5. Why is super() important in multiple inheritance? — It ensures the next class in the MRO gets called, enabling cooperative inheritance.

### Mini Project

Build a Custom Collection: A SortedList class that always keeps its elements sorted. Override __len__, __getitem__, __iter__, __contains__, __eq__, __hash__ (carefully!), and __repr__. Use bisect.insort for efficient insertion. Suggested approach:
  - Store items in a regular list, kept sorted
  - Use bisect.insort for O(n) insertion
  - __getitem__ supports slicing (return a new SortedList)
  - Implement __eq__ by comparing sorted lists element-wise
  - Make it unhashable by setting __hash__ = None (lists are mutable)

### Exercises

1. Write an Animal base class with an abstract speak() method; implement Dog and Cat subclasses.
2. Override __eq__ on a Point class and verify it works; then check that instances are no longer hashable.
3. Add __hash__ back using hash((x, y)) and verify Points can be set keys.
4. Write a class that uses super().__init__() cooperatively with two parent classes.
5. Override __len__, __getitem__, and __iter__ on a custom Stack class.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does super() do in a subclass method?
9. A) Returns the parent class instance
10. B) Calls the next method in the MRO (often the parent) (*)
11. C) Creates a new instance of the parent
12. D) Bypasses the parent's __init__
13. Explanation: super() returns a proxy that dispatches to the next class in the MRO — typically the parent, but in multiple inheritance it follows C3 linearization.
14. Q2: If you override __eq__ but not __hash__, what happens?
15. A) __hash__ is set to None — instances become unhashable (*)
16. B) Nothing changes
17. C) __hash__ uses id() automatically
18. D) Raises TypeError at class definition
19. Explanation: Python's data model: if you define __eq__, __hash__ becomes None unless you also define it. Objects are then unhashable.
20. Q3: What does MRO stand for?
21. A) Memory Reference Order
22. B) Method Read Order
23. C) Member Resolution Object
24. D) Method Resolution Order (*)
25. Explanation: MRO is the order Python searches base classes for methods; computed via C3 linearization. View with ClassName.__mro__.
26. Q4: What is duck typing?
27. A) Type-checking with isinstance
28. B) Using only duck-typed interfaces
29. C) Caring about behavior (methods), not the actual type (*)
30. D) A pattern from Ruby, not Python
31. Explanation: "If it walks like a duck and quacks like a duck..." — Python calls methods on objects without checking their type.
32. Q5: What does @abstractmethod do?
33. A) Marks a method as private
34. B) Forces subclasses to implement it before instantiation (*)
35. C) Makes the method static
36. D) Caches the method's return value
37. Explanation: Classes inheriting from ABC can't be instantiated until all @abstractmethod methods are implemented in some subclass.
38. Q6: What's a "Liskov violation"?
39. A) Overriding a method to reject inputs the parent accepted (*)
40. B) Using multiple inheritance
41. C) Calling super() incorrectly
42. D) Forgetting __hash__
43. Explanation: Liskov Substitution Principle: subclasses must accept everything the parent accepts. Tightening input types breaks substitutability.
44. Q7: What should __eq__ return for an unsupported type?
45. A) False
46. B) True
47. C) raise TypeError
48. D) NotImplemented (*)
49. Explanation: Return NotImplemented (not raise) so Python can try the reflected operation (other.__eq__(self)) before falling back to identity.
50. Q8: Which magic method makes `len(obj)` work?
51. A) __length__
52. B) __size__
53. C) __len__ (*)
54. D) __count__
55. Explanation: __len__ is called by len(); must return a non-negative int.
56. Q9: Which magic method makes `for x in obj` work?
57. A) __loop__
58. B) __iter__ (*)
59. C) __for__
60. D) __next__
61. Explanation: __iter__ returns an iterator (which has __next__); for loops call iter() on the object, then next() on the result.
62. Q10: How does C3 linearization handle the diamond problem?
63. A) It computes a consistent MRO that visits each class once, parents before children, left before right (*)
64. B) It can't — diamond inheritance is illegal
65. C) It raises an error
66. D) It picks the leftmost parent only
67. Explanation: C3 guarantees a monotonic, consistent order: each class appears once, parents after children, left-to-right preference. If impossible, it raises TypeError.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does super() do in a subclass method?
  options:
    - Returns the parent class instance
    - Calls the next method in the MRO (often the parent)
    - Creates a new instance of the parent
    - Bypasses the parent's __init__
  correctIndex: 1
  explanation: super() returns a proxy that dispatches to the next class in the MRO — typically the parent, but in multiple inheritance it follows C3 linearization.
- id: q2
  question: If you override __eq__ but not __hash__, what happens?
  options:
    - __hash__ is set to None — instances become unhashable
    - Nothing changes
    - __hash__ uses id() automatically
    - Raises TypeError at class definition
  correctIndex: 0
  explanation: "Python's data model: if you define __eq__, __hash__ becomes None unless you also define it. Objects are then unhashable."
- id: q3
  question: What does MRO stand for?
  options:
    - Memory Reference Order
    - Method Read Order
    - Member Resolution Object
    - Method Resolution Order
  correctIndex: 3
  explanation: MRO is the order Python searches base classes for methods; computed via C3 linearization. View with ClassName.__mro__.
- id: q4
  question: What is duck typing?
  options:
    - Type-checking with isinstance
    - Using only duck-typed interfaces
    - Caring about behavior (methods), not the actual type
    - A pattern from Ruby, not Python
  correctIndex: 2
  explanation: '"If it walks like a duck and quacks like a duck..." — Python calls methods on objects without checking their type.'
- id: q5
  question: What does @abstractmethod do?
  options:
    - Marks a method as private
    - Forces subclasses to implement it before instantiation
    - Makes the method static
    - Caches the method's return value
  correctIndex: 1
  explanation: Classes inheriting from ABC can't be instantiated until all @abstractmethod methods are implemented in some subclass.
- id: q6
  question: What's a "Liskov violation"?
  options:
    - Overriding a method to reject inputs the parent accepted
    - Using multiple inheritance
    - Calling super() incorrectly
    - Forgetting __hash__
  correctIndex: 0
  explanation: "Liskov Substitution Principle: subclasses must accept everything the parent accepts. Tightening input types breaks substitutability."
- id: q7
  question: What should __eq__ return for an unsupported type?
  options:
    - "False"
    - "True"
    - raise TypeError
    - NotImplemented
  correctIndex: 3
  explanation: Return NotImplemented (not raise) so Python can try the reflected operation (other.__eq__(self)) before falling back to identity.
- id: q8
  question: Which magic method makes `len(obj)` work?
  options:
    - __length__
    - __size__
    - __len__
    - __count__
  correctIndex: 2
  explanation: __len__ is called by len(); must return a non-negative int.
- id: q9
  question: Which magic method makes `for x in obj` work?
  options:
    - __loop__
    - __iter__
    - __for__
    - __next__
  correctIndex: 1
  explanation: __iter__ returns an iterator (which has __next__); for loops call iter() on the object, then next() on the result.
- id: q10
  question: How does C3 linearization handle the diamond problem?
  options:
    - It computes a consistent MRO that visits each class once, parents before children, left before right
    - It can't — diamond inheritance is illegal
    - It raises an error
    - It picks the leftmost parent only
  correctIndex: 0
  explanation: "C3 guarantees a monotonic, consistent order: each class appears once, parents after children, left-to-right preference. If impossible, it raises TypeError."
```

