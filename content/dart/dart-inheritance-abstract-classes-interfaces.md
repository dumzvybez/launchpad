---
slug: dart-inheritance-abstract-classes-interfaces
id: dart-08
track: dart
order: 8
title: Inheritance, Abstract Classes, and Interfaces
description: Learn Dart's OOP features — `extends`, `super`, abstract classes, implicit interfaces, `implements`, `with` (mixin application preview), and the `@override` annotation.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=5xlVP04905w&t=4200s
whyItMatters: Learn Dart's OOP features — `extends`, `super`, abstract classes, implicit interfaces, `implements`, `with` (mixin application preview), and the `@override` annotation.
deepDiveResources:
  - label: W3Schools Dart
    url: https://dart.dev/learn
    kind: course
  - label: Dart Official Docs
    url: https://dart.dev/guides
    kind: doc
---

# Inheritance, Abstract Classes, and Interfaces

## Inheritance, Abstract Classes, and Interfaces

### Why It Matters

Learn Dart's OOP features — `extends`, `super`, abstract classes, implicit interfaces, `implements`, `with` (mixin application preview), and the `@override` annotation.

Learn Dart's OOP features — `extends`, `super`, abstract classes, implicit interfaces, `implements`, `with` (mixin application preview), and the `@override` annotation.

### Prerequisites

- Stage 7: Classes, Constructors, and Named Parameters

### Topics

- `extends` and single inheritance
- `super` calls (constructor, method)
- Abstract classes and abstract methods
- Implicit interfaces — every class defines an interface
- `implements` vs `extends`
- The `@override` annotation and lints
- Covariant parameters and `covariant` keyword
- Sealed type hierarchies (preview; full treatment in Stage 9)

### Key Concepts

- Dart has single inheritance (one `extends`); multiple inheritance of behavior is via mixins (Stage 9).
- Every class implicitly defines an interface consisting of its public members; you can `implement` any class without inheriting its implementation.
- Abstract classes can have abstract methods (no body) that subclasses must implement; concrete classes can't have abstract methods.
- `@override` is a metadata annotation that the analyzer enforces: it errors if the annotated method doesn't actually override a parent.
- Constructors are NOT inherited: a subclass must define its own, and call `super(...)` (implicitly or explicitly).
- `covariant` lets you tighten a parameter type in a subclass (e.g., `void feed(covariant Dog d)` in a subclass of `AnimalFeeder`), but bypasses static checks — use sparingly.

```dart
abstract class Animal {
  final String name;
  Animal(this.name);

  String sound(); // abstract method

  String describe() => '$name says ${sound()}';
}

class Dog extends Animal {
  Dog(String name) : super(name);

  @override
  String sound() => 'Woof';
}

void main() {
  print(Dog('Rex').describe()); // Rex says Woof
}
```
Caption: extends and super

### Common Pitfalls

- Forgetting `super()` in a subclass constructor — Dart inserts an implicit `super()` call only for the no-arg case; if the parent requires args, you must supply them in the initializer list.
- Treating `implements` like `extends` — `implements` re-declares all members without inheriting implementations; beginners often lose the parent's behavior silently.
- Missing `@override` — Without it, accidental name typos (e.g., `tostring` instead of `toString`) silently shadow nothing; the lint `annotate_overrides` requires it.
- Using `covariant` to silence type errors — `covariant` is a runtime-checked escape hatch; prefer generics or redesign.
- Expecting constructors to be inherited — Dart does not inherit constructors; subclasses must declare their own and call `super`.

### Real-World Applications

- Flutter's `StatelessWidget` and `StatefulWidget` are abstract classes; `State<T extends StatefulWidget>` uses generics to associate state with its widget.
- The Dart SDK's `Iterable<E>` is an abstract class with concrete subclasses (`List`, `Set`, custom generators via `sync*`).
- Alibaba's network layer defines `ApiClient` as an abstract interface with multiple implementations (mock, prod, caching) — `implements` lets them swap without changing call sites.
- eBay Motors' data layer uses `extends` to model vehicle hierarchies (Vehicle → Car → Truck), leveraging polymorphism in their rendering pipeline.

### Interview Questions

- 1. What's the difference between `extends` and `implements`? — `extends` inherits implementation and IS-A; `implements` requires re-declaring all members and treats the class as a pure interface.
- 2. Are Dart constructors inherited? — No; subclasses must declare their own and chain to `super(...)`.
- 3. What does `@override` do that the language doesn't already? — The override happens with or without it; `@override` makes the analyzer ERROR if no parent method exists, catching typos.
- 4. Can a class implement multiple interfaces? — Yes; `class C implements A, B, C {}` is valid. Multiple inheritance of implementation requires mixins.
- 5. What is `covariant` for? — Allows a subtype to tighten a parameter type; the check becomes runtime instead of static, useful for generic specialization.

### Mini Project

Build a Shape Hierarchy: Define an abstract class `Shape` with `area()` and `perimeter()` abstract methods, then implement `Circle`, `Rectangle`, and `Triangle` as subclasses. Add a `describe()` method in the base that prints the type and area. Then implement `Jsonifiable` as an interface that each shape also implements. Suggested approach:
  - Abstract class `Shape` with abstract `double area()` and `double perimeter()`
  - Each concrete shape `extends Shape` and `implements Jsonifiable`
  - Add `toString` returning `'$runtimeType(area=$area)'`
  - Use `@override` on every overridden method
  - Write a `printShapes(List<Shape>)` function that loops and calls describe

### Exercises

1. Make `Animal` abstract with `sound()` abstract; subclass `Cat` and `Dog`.
2. Create a `Comparable` implementation for a `Temperature` class.
3. Define an interface `Storable` and have two classes implement it.
4. Try to override `toString` without `@override`; then add the annotation and confirm the lint passes.
5. Demonstrate constructor chaining: `Vehicle` → `Car` with `super(4)` for wheels.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `extends` provide?
9. A) Multiple inheritance
10. B) Interface implementation only
11. C) A mixin application
12. D) Single inheritance of implementation (*)
13. Explanation: Dart supports single inheritance via `extends`; the subclass inherits fields, methods, and IS-A relationship with the parent.
14. Q2: Are constructors inherited in Dart?
15. A) No — subclasses must declare their own (*)
16. B) Yes, all of them
17. C) Only the default constructor
18. D) Only when marked @override
19. Explanation: Dart constructors are not inherited; subclasses must define their own and chain to a parent constructor via `super(...)`.
20. Q3: What does `implements` require?
21. A) Inheriting all parent behavior
22. B) Re-declaring all members of the interface (*)
23. C) Calling super() in every method
24. D) Marking the class abstract
25. Explanation: `implements` treats the class as a pure interface — you must provide your own implementation for every member.
26. Q4: What does the `@override` annotation do?
27. A) Forces a method to be overridden
28. B) Marks the method as final
29. C) Makes the analyzer error if no parent member exists to override (*)
30. D) Adds a runtime check
31. Explanation: `@override` is metadata; the override happens regardless, but the annotation makes the analyzer catch typos and missing parent members.
32. Q5: Can a Dart class implement multiple interfaces?
33. A) No
34. B) Only up to two
35. C) Only if they share a common parent
36. D) Yes (*)
37. Explanation: `class C implements A, B, C {}` is valid; Dart supports multiple interface implementation, with multiple inheritance of behavior via mixins.
38. Q6: What is an abstract method?
39. A) A method with no body that subclasses must implement (*)
40. B) A method marked `final`
41. C) A private method
42. D) A static method
43. Explanation: Abstract methods have no body and force subclasses to provide an implementation; only abstract classes can declare them.
44. Q7: When does Dart insert an implicit `super()` call?
45. A) Always
46. B) Only if the parent has a no-arg constructor and the subclass doesn't explicitly call super (*)
47. C) Never
48. D) Only in const constructors
49. Explanation: Dart inserts `super()` only when the parent has a no-arg constructor and the subclass initializer list doesn't already call super; otherwise you must supply args explicitly.
50. Q8: What does `covariant` do?
51. A) Freezes the parameter type
52. B) Makes the parameter nullable
53. C) Allows tightening a parameter type in a subclass, checked at runtime (*)
54. D) Marks the parameter as required
55. Explanation: `covariant` opts a parameter out of static contravariance checks, allowing a subclass to specify a more specific type; the runtime enforces it.
56. Q9: What is the implicit interface of a class?
57. A) Its private members only
58. B) Only its abstract methods
59. C) Only its static members
60. D) All its public members (fields, methods, getters, setters) (*)
61. Explanation: Every Dart class implicitly exposes an interface consisting of its public members, which other classes can `implement` without inheriting.
62. Q10: Which is a valid override?
63. A) Subclass with a covariant return type (subtype of parent's return) (*)
64. B) Subclass with a different return type entirely
65. C) Subclass with a wider parameter type
66. D) Subclass with no `@override`
67. Explanation: Dart allows the overriding method to return a subtype of the parent's return type (covariant return), but parameters must be the same or tightened via `covariant`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `extends` provide?
  options:
    - Multiple inheritance
    - Interface implementation only
    - A mixin application
    - Single inheritance of implementation
  correctIndex: 3
  explanation: Dart supports single inheritance via `extends`; the subclass inherits fields, methods, and IS-A relationship with the parent.
- id: q2
  question: Are constructors inherited in Dart?
  options:
    - No — subclasses must declare their own
    - Yes, all of them
    - Only the default constructor
    - Only when marked @override
  correctIndex: 0
  explanation: Dart constructors are not inherited; subclasses must define their own and chain to a parent constructor via `super(...)`.
- id: q3
  question: What does `implements` require?
  options:
    - Inheriting all parent behavior
    - Re-declaring all members of the interface
    - Calling super() in every method
    - Marking the class abstract
  correctIndex: 1
  explanation: "`implements` treats the class as a pure interface — you must provide your own implementation for every member."
- id: q4
  question: What does the `@override` annotation do?
  options:
    - Forces a method to be overridden
    - Marks the method as final
    - Makes the analyzer error if no parent member exists to override
    - Adds a runtime check
  correctIndex: 2
  explanation: "`@override` is metadata; the override happens regardless, but the annotation makes the analyzer catch typos and missing parent members."
- id: q5
  question: Can a Dart class implement multiple interfaces?
  options:
    - No
    - Only up to two
    - Only if they share a common parent
    - Yes
  correctIndex: 3
  explanation: "`class C implements A, B, C {}` is valid; Dart supports multiple interface implementation, with multiple inheritance of behavior via mixins."
- id: q6
  question: What is an abstract method?
  options:
    - A method with no body that subclasses must implement
    - A method marked `final`
    - A private method
    - A static method
  correctIndex: 0
  explanation: Abstract methods have no body and force subclasses to provide an implementation; only abstract classes can declare them.
- id: q7
  question: When does Dart insert an implicit `super()` call?
  options:
    - Always
    - Only if the parent has a no-arg constructor and the subclass doesn't explicitly call super
    - Never
    - Only in const constructors
  correctIndex: 1
  explanation: Dart inserts `super()` only when the parent has a no-arg constructor and the subclass initializer list doesn't already call super; otherwise you must supply args explicitly.
- id: q8
  question: What does `covariant` do?
  options:
    - Freezes the parameter type
    - Makes the parameter nullable
    - Allows tightening a parameter type in a subclass, checked at runtime
    - Marks the parameter as required
  correctIndex: 2
  explanation: "`covariant` opts a parameter out of static contravariance checks, allowing a subclass to specify a more specific type; the runtime enforces it."
- id: q9
  question: What is the implicit interface of a class?
  options:
    - Its private members only
    - Only its abstract methods
    - Only its static members
    - All its public members (fields, methods, getters, setters)
  correctIndex: 3
  explanation: Every Dart class implicitly exposes an interface consisting of its public members, which other classes can `implement` without inheriting.
- id: q10
  question: Which is a valid override?
  options:
    - Subclass with a covariant return type (subtype of parent's return)
    - Subclass with a different return type entirely
    - Subclass with a wider parameter type
    - Subclass with no `@override`
  correctIndex: 0
  explanation: Dart allows the overriding method to return a subtype of the parent's return type (covariant return), but parameters must be the same or tightened via `covariant`.
```

