---
slug: cpp-inheritance-polymorphism
id: cpp-07
track: cpp
order: 7
title: Inheritance and Polymorphism
description: Master single and multiple inheritance, virtual functions, override and final, pure virtual functions and abstract classes, virtual destructors, and the object-slicing pitfall.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=300s
whyItMatters: Master single and multiple inheritance, virtual functions, override and final, pure virtual functions and abstract classes, virtual destructors, and the object-slicing pitfall.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# Inheritance and Polymorphism

## Inheritance and Polymorphism

### Why It Matters

Master single and multiple inheritance, virtual functions, override and final, pure virtual functions and abstract classes, virtual destructors, and the object-slicing pitfall.

Master single and multiple inheritance, virtual functions, override and final, pure virtual functions and abstract classes, virtual destructors, and the object-slicing pitfall.

### Prerequisites

- Stage 1-6 (especially classes and Rule of 5)

### Topics

- Single inheritance: public, protected, private
- Multiple inheritance and the diamond problem
- Virtual base classes
- Virtual functions, vtables, virtual dispatch
- override and final (C++11)
- Pure virtual functions and abstract classes
- Virtual destructors (revisited)
- Object slicing — what it is and how to prevent it
- RTTI: dynamic_cast, typeid
- final on classes (no further derivation)

### Key Concepts

- A virtual function is dispatched by runtime type via the vtable; non-virtual functions dispatch by static type.
- override makes the compiler check that you actually override a base virtual; without it, a signature mismatch silently adds a new virtual instead of overriding.
- final stops further overriding (or derivation, when applied to a class).
- A class with at least one pure virtual function (`= 0`) is abstract and cannot be instantiated.
- Object slicing: passing a Derived by value to a function taking Base copies only the Base subobject, losing the Derived parts and breaking virtual dispatch.
- Multiple inheritance introduces ambiguity and the diamond problem; virtual inheritance resolves the diamond at the cost of slower member access.

```cpp
#include <iostream>
#include <memory>

class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;        // pure virtual -> abstract
};

class Circle : public Shape {
public:
    Circle(double r) : r_(r) {}
    double area() const override { return 3.14159 * r_ * r_; }
private:
    double r_;
};

class Square : public Shape {
public:
    Square(double s) : s_(s) {}
    double area() const override { return s_ * s_; }
private:
    double s_;
};

int main() {
    std::unique_ptr<Shape> s = std::make_unique<Circle>(2.0);
    std::cout << s->area() << '\n';   // 12.566 — dispatched to Circle::area
}
```
Caption: Virtual dispatch and override

### Common Pitfalls

- Forgetting `override` on a derived virtual — a signature mismatch silently creates a new virtual instead of overriding; always mark overrides with `override`.
- Object slicing when passing by value — pass polymorphic types by reference or pointer (or unique_ptr/shared_ptr), never by value.
- Non-virtual destructor on a polymorphic base — `delete base_ptr` is UB; the base dtor must be virtual (or protected non-virtual + delete only in derived).
- Calling virtual functions from constructors/destructors — dispatch goes to the type being constructed/destructed, not the most-derived; avoid or use a two-phase init.
- Diamond inheritance without virtual bases — `d.a` is ambiguous; virtual inheritance creates a single shared base subobject but at a perf cost.

### Real-World Applications

- Unreal Engine's gameplay classes (AActor, APawn, ACharacter) form a deep virtual hierarchy; UObject's virtual destructor and reflection metadata power the editor.
- Qt's widget hierarchy (QWidget -> QPushButton, etc.) uses virtual functions for paint, event handling, and size hints; slicing is prevented by value-semantics-forbidden APIs.
- LLVM's Pass hierarchy uses virtual functions for run() and analysis; override is mandated by the style guide.
- Adobe Illustrator's document object model uses deep virtual hierarchies with careful slicing prevention via protected constructors.

### Interview Questions

- 1. What is a vtable? — A per-class table of function pointers used to dispatch virtual calls; each object has a vptr to its class's vtable.
- 2. What does override do? — It instructs the compiler to verify the function actually overrides a base virtual; mismatches become compile errors instead of silent new virtuals.
- 3. What is object slicing and how do you prevent it? — Passing a Derived by value to a function taking Base copies only the Base subobject, losing the Derived parts; pass by reference, pointer, or smart pointer.
- 4. What is the diamond problem and how is it solved? — Multiple inheritance creating two Base subobjects in a derived class; virtual inheritance creates a single shared Base subobject.
- 5. Why are virtual destructors needed for polymorphic bases? — Without one, deleting through a Base* has UB and skips the Derived destructor; the base dtor must be virtual (or protected non-virtual).

### Mini Project

Build a Shape Hierarchy with Area/Perimeter: A polymorphic Shape base class with Circle, Rectangle, Triangle, and Square subclasses, plus a function that sums the areas of a vector<unique_ptr<Shape>>. Suggested approach:
  - Shape is abstract with pure virtual area() and perimeter(), virtual dtor
  - Each derived class holds its parameters and overrides both methods
  - Use std::vector<std::unique_ptr<Shape>> to hold a heterogeneous collection
  - Sum areas with a range-based for loop calling ->area()
  - Add a JSON serializer that uses dynamic_cast or a virtual to_json() method

### Exercises

1. Write a base class without a virtual destructor; delete a Derived through a Base* under ASan; observe the diagnostic.
2. Add `override` to a derived virtual with a typo'd signature; read the compile error.
3. Demonstrate object slicing: pass a Derived by value to a function taking Base; print the runtime type with typeid before and after.
4. Build a diamond with and without virtual inheritance; show the ambiguity error in the non-virtual case.
5. Use dynamic_cast to downcast a Base* to Derived* safely; verify the cast returns nullptr when the type doesn't match.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `override` do?
9. A) Forces the function to be virtual
10. B) Makes the function pure virtual
11. C) Verifies the function actually overrides a base virtual (*)
12. D) Hides the base function
13. Explanation: override makes the compiler verify the function overrides a base virtual; mismatches become compile errors instead of silent new virtuals.
14. Q2: What is object slicing?
15. A) Cutting an object in half
16. B) Using std::slice on a vector
17. C) A type of memory corruption
18. D) Passing a Derived by value to a Base parameter loses the Derived parts (*)
19. Explanation: By-value passing copies only the Base subobject, losing the Derived parts and breaking virtual dispatch; pass by reference or pointer.
20. Q3: When is a class abstract?
21. A) When it has at least one pure virtual function (*)
22. B) When it has no members
23. C) When it has a virtual destructor
24. D) When it is in a namespace
25. Explanation: A class with at least one pure virtual (`= 0`) is abstract and cannot be instantiated; only derived classes that override all pure virtuals can.
26. Q4: What does `final` on a virtual function do?
27. A) Marks it as the last function in the class
28. B) Prevents further overriding in derived classes (*)
29. C) Makes the function pure virtual
30. D) Forces it to be inlined
31. Explanation: final prevents derived classes from overriding the function; applied to a class, it prevents further derivation.
32. Q5: Why must a polymorphic base have a virtual destructor?
33. A) To make the class abstract
34. B) To enable static_cast
35. C) So `delete base_ptr` calls the Derived destructor (*)
36. D) To speed up construction
37. Explanation: Without a virtual destructor, deleting through a Base* has UB and skips the Derived destructor; a virtual dtor ensures correct cleanup.
38. Q6: How is the diamond problem solved?
39. A) Use multiple inheritance
40. B) Make all methods static
41. C) Use private inheritance
42. D) Virtual inheritance (*)
43. Explanation: Virtual inheritance makes the shared base have a single subobject in the most-derived class, resolving the ambiguity.
44. Q7: What does dynamic_cast do on a failed pointer downcast?
45. A) Returns nullptr (*)
46. B) Throws std::bad_cast
47. C) Returns the original pointer
48. D) Is UB
49. Explanation: dynamic_cast on a pointer returns nullptr on failure; on a reference it throws std::bad_cast (since references can't be null).
50. Q8: What happens if you call a virtual function from a constructor?
51. A) The most-derived override is called
52. B) The override for the type being constructed is called (*)
53. C) It is UB
54. D) The base version is always called
55. Explanation: During construction, the dynamic type is the constructor's class, so virtual dispatch goes to that class's override — usually surprising.
56. Q9: What is a vtable?
57. A) A table of virtual base classes
58. B) A table of all class members
59. C) A per-class table of function pointers used for virtual dispatch (*)
60. D) A synonym for RTTI
61. Explanation: Each class with virtual functions has a vtable of function pointers; each object has a vptr pointing to its class's vtable.
62. Q10: What is the cost of a virtual function call vs a non-virtual one?
63. A) Identical
64. B) 10x slower
65. C) It depends on the OS
66. D) An extra pointer dereference (vtable lookup) (*)
67. Explanation: Virtual calls add an indirection through the vtable (plus possibly defeating inlining); the perf cost is usually small but can matter in tight loops.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `override` do?
  options:
    - Forces the function to be virtual
    - Makes the function pure virtual
    - Verifies the function actually overrides a base virtual
    - Hides the base function
  correctIndex: 2
  explanation: override makes the compiler verify the function overrides a base virtual; mismatches become compile errors instead of silent new virtuals.
- id: q2
  question: What is object slicing?
  options:
    - Cutting an object in half
    - Using std::slice on a vector
    - A type of memory corruption
    - Passing a Derived by value to a Base parameter loses the Derived parts
  correctIndex: 3
  explanation: By-value passing copies only the Base subobject, losing the Derived parts and breaking virtual dispatch; pass by reference or pointer.
- id: q3
  question: When is a class abstract?
  options:
    - When it has at least one pure virtual function
    - When it has no members
    - When it has a virtual destructor
    - When it is in a namespace
  correctIndex: 0
  explanation: A class with at least one pure virtual (`= 0`) is abstract and cannot be instantiated; only derived classes that override all pure virtuals can.
- id: q4
  question: What does `final` on a virtual function do?
  options:
    - Marks it as the last function in the class
    - Prevents further overriding in derived classes
    - Makes the function pure virtual
    - Forces it to be inlined
  correctIndex: 1
  explanation: final prevents derived classes from overriding the function; applied to a class, it prevents further derivation.
- id: q5
  question: Why must a polymorphic base have a virtual destructor?
  options:
    - To make the class abstract
    - To enable static_cast
    - So `delete base_ptr` calls the Derived destructor
    - To speed up construction
  correctIndex: 2
  explanation: Without a virtual destructor, deleting through a Base* has UB and skips the Derived destructor; a virtual dtor ensures correct cleanup.
- id: q6
  question: How is the diamond problem solved?
  options:
    - Use multiple inheritance
    - Make all methods static
    - Use private inheritance
    - Virtual inheritance
  correctIndex: 3
  explanation: Virtual inheritance makes the shared base have a single subobject in the most-derived class, resolving the ambiguity.
- id: q7
  question: What does dynamic_cast do on a failed pointer downcast?
  options:
    - Returns nullptr
    - Throws std::bad_cast
    - Returns the original pointer
    - Is UB
  correctIndex: 0
  explanation: dynamic_cast on a pointer returns nullptr on failure; on a reference it throws std::bad_cast (since references can't be null).
- id: q8
  question: What happens if you call a virtual function from a constructor?
  options:
    - The most-derived override is called
    - The override for the type being constructed is called
    - It is UB
    - The base version is always called
  correctIndex: 1
  explanation: During construction, the dynamic type is the constructor's class, so virtual dispatch goes to that class's override — usually surprising.
- id: q9
  question: What is a vtable?
  options:
    - A table of virtual base classes
    - A table of all class members
    - A per-class table of function pointers used for virtual dispatch
    - A synonym for RTTI
  correctIndex: 2
  explanation: Each class with virtual functions has a vtable of function pointers; each object has a vptr pointing to its class's vtable.
- id: q10
  question: What is the cost of a virtual function call vs a non-virtual one?
  options:
    - Identical
    - 10x slower
    - It depends on the OS
    - An extra pointer dereference (vtable lookup)
  correctIndex: 3
  explanation: Virtual calls add an indirection through the vtable (plus possibly defeating inlining); the perf cost is usually small but can matter in tight loops.
```

