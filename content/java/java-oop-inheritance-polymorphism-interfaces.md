---
slug: java-oop-inheritance-polymorphism-interfaces
id: java-06
track: java
order: 6
title: OOP — Inheritance, Polymorphism, Interfaces
description: Extend classes, override and overload methods, model behavior with interfaces and default methods, and use sealed classes and permits to control the inheritance hierarchy.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=6000s
whyItMatters: Extend classes, override and overload methods, model behavior with interfaces and default methods, and use sealed classes and permits to control the inheritance hierarchy.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# OOP — Inheritance, Polymorphism, Interfaces

## OOP — Inheritance, Polymorphism, Interfaces

### Why It Matters

Extend classes, override and overload methods, model behavior with interfaces and default methods, and use sealed classes and permits to control the inheritance hierarchy.

Extend classes, override and overload methods, model behavior with interfaces and default methods, and use sealed classes and permits to control the inheritance hierarchy.

### Prerequisites

- Stage 5: Object-Oriented Programming — Classes and Objects.
- Solid grasp of constructors, fields, and equals/hashCode.

### Topics

- extends, super, and single inheritance
- Method overriding vs overloading
- The @Override annotation
- Upcasting and downcasting
- `instanceof` and pattern-instanceof (`o instanceof Foo f`)
- abstract classes and abstract methods
- Interfaces, multiple inheritance of type, default methods, static methods
- sealed classes and `permits` (Java 17)
- final classes and final methods

### Key Concepts

- Java allows single class inheritance but multiple interface implementation, sidestepping the diamond problem on state (but not on default methods).
- `@Override` is optional but recommended; it catches typos like a misspelled method name at compile time.
- Default methods (Java 8+) let interfaces evolve without breaking implementers; conflicts must be resolved by the implementer.
- Sealed classes (Java 17) declare an exhaustive set of permitted subclasses, enabling exhaustive pattern matching and safer domain modeling.
- `instanceof` pattern binding (Java 16) combines a type check with a variable declaration, removing boilerplate casts.

```java
public class Animal {
    private final String name;
    public Animal(String name) { this.name = name; }
    public String sound() { return "?"; }
    public final String name() { return name; } // cannot be overridden
}
public class Dog extends Animal {
    public Dog(String name) { super(name); }
    @Override public String sound() { return "Woof"; }
}
```
Caption: Inheritance and override

### Common Pitfalls

- Forgetting `@Override` — typos in method names silently create new methods instead of overriding; `@Override` makes the compiler catch it.
- Calling overridable methods from a constructor — virtual dispatch sends execution into a subclass override that runs before the subclass constructor body, observing uninitialized fields.
- Default-method conflicts — implementing two interfaces with the same default method forces the implementer to override and disambiguate with `InterfaceName.super.method()`.
- Using `instanceof` instead of polymorphism — long if/else instanceof chains usually signal missing methods on a common interface; prefer dispatch.
- Forgetting that interfaces can have `private` methods (Java 9+) for sharing code between defaults — duplicated code in default methods is a smell.

### Real-World Applications

- The Java Collections Framework is the canonical example: `List`, `Set`, `Map` interfaces with abstract `AbstractList`, `AbstractSet` skeletons and concrete `ArrayList`, `LinkedList`, `HashSet`, `TreeSet` subclasses.
- Spring's `BeanDefinition`, `FactoryBean`, and many `*Aware` interfaces (ApplicationContextAware, BeanNameAware) lean heavily on interface-based design for callback injection.
- Apache Kafka's `Serializer`/`Deserializer`/`Partitioner` interfaces let users plug in custom wire formats without modifying Kafka internals.
- IntelliJ's PSI (Program Structure Interface) tree uses abstract base classes and a sealed-like hierarchy of node types; refactorings dispatch on type.

### Interview Questions

- 1. Why does Java disallow multiple class inheritance? — To avoid the diamond problem on state (inherited fields from two parents); multiple inheritance of type via interfaces is allowed.
- 2. What is the difference between overriding and overloading? — Override redefines a parent method with the same signature; overload introduces a same-named method with a different parameter list.
- 3. What problem do default methods solve? — They let library interfaces evolve by adding methods without breaking existing implementers.
- 4. What is a sealed class and when would you use it? — A class that explicitly lists its permitted subclasses (Java 17), enabling exhaustive pattern matching and controlled hierarchies.
- 5. Why is `@Override` recommended even though it's optional? — It catches typos and signature drift at compile time; a misspelled method name without `@Override` silently becomes a new method.

### Mini Project

Build a Payment Processor Hierarchy: A sealed interface `PaymentMethod` permits `CreditCard`, `PayPal`, `Crypto`. Each implements `charge(BigDecimal amount)`. Use a switch expression over the sealed hierarchy to compute processing fees. Suggested approach:
  - Declare the sealed interface and its permits
  - Make each subclass a final record (e.g., `record CreditCard(String masked) implements PaymentMethod`)
  - Add a `processingFee` method default in the interface that subclasses can override
  - Use a switch expression to dispatch on the type and compute fees
  - Add a `static factory PaymentMethod.of(String code, String token)` that constructs the right variant

### Exercises

1. Create an `Animal` superclass with subclasses `Dog`, `Cat`, `Bird`; override `sound()` and verify polymorphic dispatch from a `List<Animal>`.
2. Add a default method to an existing interface and confirm a class that already implements it continues to compile without changes.
3. Deliberately create a default-method conflict by implementing two interfaces with the same default; resolve it in the class with `InterfaceName.super.method()`.
4. Convert an `if/else if` chain of `instanceof` checks into a Java 21 pattern-matching switch; measure line-count savings.
5. Declare a sealed `Shape` hierarchy and write an exhaustive switch without a default; verify the compiler enforces exhaustiveness.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Java allows how many parent classes for a single class?
9. A) Unlimited
10. B) One (single class inheritance) (*)
11. C) Two
12. D) Four
13. Explanation: Java supports single class inheritance only — a class has at most one superclass — but a class can implement any number of interfaces.
14. Q2: The `@Override` annotation is?
15. A) Required for every override
16. B) Required only for interface methods
17. C) Optional but recommended; catches typos at compile time (*)
18. D) Available only in records
19. Explanation: `@Override` is optional but tells the compiler to verify the method actually overrides a parent method, catching signature drift and typos.
20. Q3: Default methods in interfaces were added in?
21. A) Java 5
22. B) Java 11
23. C) Java 17
24. D) Java 8 (*)
25. Explanation: Default methods (and static methods on interfaces) were added in Java 8 to enable interface evolution alongside lambda expressions.
26. Q4: Sealed classes were finalized in which Java version?
27. A) Java 17 (*)
28. B) Java 14
29. C) Java 16
30. D) Java 21
31. Explanation: Sealed classes (JEP 409) were finalized in Java 17, after previews in 15 and 16.
32. Q5: A class implements two interfaces with the same default method. What happens?
33. A) The first interface's version wins
34. B) Compile error unless the class overrides the method (*)
35. C) The second interface's version wins
36. D) Runtime exception
37. Explanation: The compiler forces the implementing class to override the conflicting method, optionally calling `I1.super.m()` or `I2.super.m()` to disambiguate.
38. Q6: `instanceof` pattern binding (`o instanceof String s`) was finalized in?
39. A) Java 8
40. B) Java 14
41. C) Java 16 (*)
42. D) Java 21
43. Explanation: Pattern matching for instanceof (JEP 394) was finalized in Java 16, after being a preview in 14 and 15.
44. Q7: Which keyword prevents a class from being subclassed?
45. A) sealed
46. B) abstract
47. C) static
48. D) final (*)
49. Explanation: A `final` class cannot be extended (e.g., String, Integer). Sealed classes restrict but do not forbid subclassing.
50. Q8: A `sealed` class must declare its permitted subclasses using which keyword?
51. A) permits (*)
52. B) extends
53. C) implements
54. D) allows
55. Explanation: A sealed class lists its permitted subclasses with `permits`; those subclasses must be final, sealed, or non-sealed.
56. Q9: Calling an overridable method from a constructor is dangerous because?
57. A) The compiler rejects it
58. B) The subclass override runs before its constructor body executes (*)
59. C) The JVM throws VerifyError
60. D) It is always safe if the method is private
61. Explanation: Virtual dispatch always invokes the most-derived override; in a constructor that means subclass code runs before the subclass constructor body, observing uninitialized fields.
62. Q10: An abstract class can contain?
63. A) Only abstract methods
64. B) Only concrete methods
65. C) Both abstract and concrete methods, fields, and constructors (*)
66. D) Only static methods
67. Explanation: An abstract class may have a mix of abstract and concrete methods, instance fields, static members, and constructors (invoked via super()).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Java allows how many parent classes for a single class?
  options:
    - Unlimited
    - One (single class inheritance)
    - Two
    - Four
  correctIndex: 1
  explanation: Java supports single class inheritance only — a class has at most one superclass — but a class can implement any number of interfaces.
- id: q2
  question: The `@Override` annotation is?
  options:
    - Required for every override
    - Required only for interface methods
    - Optional but recommended; catches typos at compile time
    - Available only in records
  correctIndex: 2
  explanation: "`@Override` is optional but tells the compiler to verify the method actually overrides a parent method, catching signature drift and typos."
- id: q3
  question: Default methods in interfaces were added in?
  options:
    - Java 5
    - Java 11
    - Java 17
    - Java 8
  correctIndex: 3
  explanation: Default methods (and static methods on interfaces) were added in Java 8 to enable interface evolution alongside lambda expressions.
- id: q4
  question: Sealed classes were finalized in which Java version?
  options:
    - Java 17
    - Java 14
    - Java 16
    - Java 21
  correctIndex: 0
  explanation: Sealed classes (JEP 409) were finalized in Java 17, after previews in 15 and 16.
- id: q5
  question: A class implements two interfaces with the same default method. What happens?
  options:
    - The first interface's version wins
    - Compile error unless the class overrides the method
    - The second interface's version wins
    - Runtime exception
  correctIndex: 1
  explanation: The compiler forces the implementing class to override the conflicting method, optionally calling `I1.super.m()` or `I2.super.m()` to disambiguate.
- id: q6
  question: "`instanceof` pattern binding (`o instanceof String s`) was finalized in?"
  options:
    - Java 8
    - Java 14
    - Java 16
    - Java 21
  correctIndex: 2
  explanation: Pattern matching for instanceof (JEP 394) was finalized in Java 16, after being a preview in 14 and 15.
- id: q7
  question: Which keyword prevents a class from being subclassed?
  options:
    - sealed
    - abstract
    - static
    - final
  correctIndex: 3
  explanation: A `final` class cannot be extended (e.g., String, Integer). Sealed classes restrict but do not forbid subclassing.
- id: q8
  question: A `sealed` class must declare its permitted subclasses using which keyword?
  options:
    - permits
    - extends
    - implements
    - allows
  correctIndex: 0
  explanation: A sealed class lists its permitted subclasses with `permits`; those subclasses must be final, sealed, or non-sealed.
- id: q9
  question: Calling an overridable method from a constructor is dangerous because?
  options:
    - The compiler rejects it
    - The subclass override runs before its constructor body executes
    - The JVM throws VerifyError
    - It is always safe if the method is private
  correctIndex: 1
  explanation: Virtual dispatch always invokes the most-derived override; in a constructor that means subclass code runs before the subclass constructor body, observing uninitialized fields.
- id: q10
  question: An abstract class can contain?
  options:
    - Only abstract methods
    - Only concrete methods
    - Both abstract and concrete methods, fields, and constructors
    - Only static methods
  correctIndex: 2
  explanation: An abstract class may have a mix of abstract and concrete methods, instance fields, static members, and constructors (invoked via super()).
```

