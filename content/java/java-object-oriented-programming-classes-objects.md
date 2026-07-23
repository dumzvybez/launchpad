---
slug: java-object-oriented-programming-classes-objects
id: java-05
track: java
order: 5
title: Object-Oriented Programming — Classes and Objects
description: Model real-world entities with classes, fields, constructors, and methods; master `this`, access modifiers, static members, and Java's record type for plain data carriers.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=4800s
whyItMatters: Model real-world entities with classes, fields, constructors, and methods; master `this`, access modifiers, static members, and Java's record type for plain data carriers.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# Object-Oriented Programming — Classes and Objects

## Object-Oriented Programming — Classes and Objects

### Why It Matters

Model real-world entities with classes, fields, constructors, and methods; master `this`, access modifiers, static members, and Java's record type for plain data carriers.

Model real-world entities with classes, fields, constructors, and methods; master `this`, access modifiers, static members, and Java's record type for plain data carriers.

### Prerequisites

- Stage 4: Methods and Arrays.
- Comfort with methods, varargs, and the basic type system.

### Topics

- Class declaration, fields, methods, constructors
- `new` and object construction
- `this` (implicit and explicit) and constructor chaining
- Access modifiers: public, protected, package-private, private
- static fields, methods, and initializer blocks
- final fields and immutability basics
- The `record` type (Java 16+) for transparent data carriers
- Equals, hashCode, and toString contracts

### Key Concepts

- A class is a blueprint; an object is an instance allocated on the heap and referenced via a reference variable.
- `this` refers to the current object; calling `this(args)` delegates to another constructor in the same class (must be the first statement).
- The default constructor is generated only if no constructor is explicitly declared.
- `record` auto-generates a canonical constructor, accessors, equals, hashCode, and toString; fields are final.
- If you override `equals`, you must override `hashCode` to preserve the contract: equal objects must have equal hash codes.

```java
public class Person {
    private final String name;
    private int age;

    public Person(String name) {
        this(name, 0);  // delegate to canonical constructor
    }
    public Person(String name, int age) {
        this.name = Objects.requireNonNull(name);
        this.age = age;
    }
    public String name() { return name; }
    public int age() { return age; }
}
```
Caption: Class with constructor and this()

### Common Pitfalls

- Overriding `equals` without overriding `hashCode` — equal objects can land in different buckets of a HashMap; always override both.
- Forgetting that `==` on objects compares references — `new String("x") == new String("x")` is false; use `.equals()`.
- Using mutable fields in `equals`/`hashCode` — changing a key's hashCode after insertion into a HashMap loses the entry; prefer immutable keys.
- Leaking `this` from a constructor — passing `this` to a foreign method or starting a thread in the constructor allows another thread to see a partially-constructed object.
- Calling overridable methods from a constructor — subclass overrides run before the subclass constructor body, leading to surprising state.

### Real-World Applications

- Apache Kafka's `ProducerRecord` and `ConsumerRecord` are classic immutable data classes with final fields and canonical constructors.
- Spring Framework 6 widely adopts records for DTOs and configuration properties, cutting boilerplate versus pre-Java-14 classes.
- JetBrains' IntelliJ platform API exposes many model elements as records (since the 2023.2 baseline moved to Java 17).
- Apache Cassandra's `DecoratedKey` and `PartitionPosition` use final fields plus explicit equals/hashCode for hashing in the memtable.

### Interview Questions

- 1. What is the difference between a class and an object? — A class is a template (fields + methods); an object is a heap-allocated instance of a class created via `new`.
- 2. Why must hashCode be overridden when equals is? — The contract requires equal objects to have equal hash codes; otherwise HashMap/HashSet can lose entries.
- 3. What does `record` provide? — A concise data carrier with final fields, a canonical constructor, accessors, equals, hashCode, and toString, all auto-generated.
- 4. What is constructor chaining? — Using `this(args)` to delegate from one constructor to another in the same class (or `super(args)` to the parent).
- 5. Why is leaking `this` from a constructor unsafe? — Another thread or override can observe the object before its constructor body completes, seeing default field values.

### Mini Project

Build a Bank Account Model: Model a `BankAccount` with final account number, mutable balance, deposit/withdraw methods, and a record `Transaction` (amount, timestamp, type). Track a List<Transaction> of recent activity. Suggested approach:
  - Make `accountNumber` final; do not expose internal List directly
  - Return an unmodifiable view of recent transactions
  - Throw `IllegalArgumentException` for negative amounts
  - Override `equals`/`hashCode` based on accountNumber
  - Add a `record Transaction(BigDecimal amount, Instant ts, String type)` for activity

### Exercises

1. Write a `Person` class with two constructors (name only, name+age) using `this(...)` to chain; verify both produce valid objects.
2. Convert a 30-line mutable `Point` class to a `record`; compare the source line count and the auto-generated `toString` output.
3. Implement `equals` and `hashCode` for a `Money` class; write a test that puts two equal `Money` objects in a `HashSet` and confirms only one is stored.
4. Demonstrate the leaky-constructor hazard by starting a thread in a constructor that reads a field the constructor body hasn't yet set.
5. Use a static initializer block to load a config file once at class-load time; confirm it runs only once even if you create many instances.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: The default (no-arg) constructor is generated by the compiler when?
9. A) Only if no constructor is declared explicitly (*)
10. B) Always
11. C) Only if the class is public
12. D) Only if the class is final
13. Explanation: If you declare any constructor, the compiler stops generating the default no-arg constructor; you must write it explicitly if you want one.
14. Q2: Which keyword delegates to another constructor in the same class?
15. A) super
16. B) this (*)
17. C) self
18. D) new
19. Explanation: `this(args)` calls another constructor in the same class and must be the first statement of the calling constructor.
20. Q3: What does a `record` auto-generate?
21. A) Getters named getX
22. B) A public no-arg constructor
23. C) Final fields, canonical constructor, accessors (x()), equals, hashCode, toString (*)
24. D) A builder pattern
25. Explanation: Records generate a canonical constructor, accessor methods named after the components (e.g., `x()`), plus equals, hashCode, and toString.
26. Q4: If you override equals but not hashCode, what breaks?
27. A) The class won't compile
28. B) The toString output changes
29. C) Nothing — hashCode has a sensible default
30. D) HashMap/HashSet can lose equal-key entries (*)
31. Explanation: The contract requires equal objects to have equal hash codes; without that, two equal keys can hash to different buckets and be stored separately.
32. Q5: `new String("x") == new String("x")` evaluates to?
33. A) false (*)
34. B) true
35. C) Compile error
36. D) NullPointerException
37. Explanation: `==` compares references; two distinct String objects are not reference-equal. Use `.equals()` to compare content.
38. Q6: The `this` keyword in an instance method refers to?
39. A) The class
40. B) The current object (*)
41. C) The superclass
42. D) The constructor
43. Explanation: `this` is an implicit reference to the object on which the method was invoked; in a constructor it refers to the object being constructed.
44. Q7: Which access modifier makes a member visible only within its own package?
45. A) public
46. B) private
47. C) package-private (no modifier) (*)
48. D) protected
49. Explanation: The absence of a modifier gives package-private access — visible to classes in the same package but not to subclasses in other packages.
50. Q8: Static initializer blocks run when?
51. A) When each instance is constructed
52. B) When the JVM starts
53. C) When the GC runs
54. D) Once, when the class is loaded (*)
55. Explanation: Static initializers run at class-loading time, before any instance is constructed and before main runs.
56. Q9: A `final` field can be assigned?
57. A) Only at declaration or in a constructor (*)
58. B) Anywhere
59. C) Only at declaration
60. D) Only via a setter
61. Explanation: A final field must be definitely assigned exactly once — either at its declaration or in every constructor — before the object is fully constructed.
62. Q10: Calling an overridable method from a constructor is risky because?
63. A) The compiler forbids it
64. B) The subclass override runs before its constructor body (*)
65. C) The JVM throws IllegalAccessError
66. D) It is always safe in Java
67. Explanation: Virtual dispatch always targets the most-derived override, so the subclass method runs before its constructor body, observing uninitialized fields.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: The default (no-arg) constructor is generated by the compiler when?
  options:
    - Only if no constructor is declared explicitly
    - Always
    - Only if the class is public
    - Only if the class is final
  correctIndex: 0
  explanation: If you declare any constructor, the compiler stops generating the default no-arg constructor; you must write it explicitly if you want one.
- id: q2
  question: Which keyword delegates to another constructor in the same class?
  options:
    - super
    - this
    - self
    - new
  correctIndex: 1
  explanation: "`this(args)` calls another constructor in the same class and must be the first statement of the calling constructor."
- id: q3
  question: What does a `record` auto-generate?
  options:
    - Getters named getX
    - A public no-arg constructor
    - Final fields, canonical constructor, accessors (x()), equals, hashCode, toString
    - A builder pattern
  correctIndex: 2
  explanation: Records generate a canonical constructor, accessor methods named after the components (e.g., `x()`), plus equals, hashCode, and toString.
- id: q4
  question: If you override equals but not hashCode, what breaks?
  options:
    - The class won't compile
    - The toString output changes
    - Nothing — hashCode has a sensible default
    - HashMap/HashSet can lose equal-key entries
  correctIndex: 3
  explanation: The contract requires equal objects to have equal hash codes; without that, two equal keys can hash to different buckets and be stored separately.
- id: q5
  question: '`new String("x") == new String("x")` evaluates to?'
  options:
    - "false"
    - "true"
    - Compile error
    - NullPointerException
  correctIndex: 0
  explanation: "`==` compares references; two distinct String objects are not reference-equal. Use `.equals()` to compare content."
- id: q6
  question: The `this` keyword in an instance method refers to?
  options:
    - The class
    - The current object
    - The superclass
    - The constructor
  correctIndex: 1
  explanation: "`this` is an implicit reference to the object on which the method was invoked; in a constructor it refers to the object being constructed."
- id: q7
  question: Which access modifier makes a member visible only within its own package?
  options:
    - public
    - private
    - package-private (no modifier)
    - protected
  correctIndex: 2
  explanation: The absence of a modifier gives package-private access — visible to classes in the same package but not to subclasses in other packages.
- id: q8
  question: Static initializer blocks run when?
  options:
    - When each instance is constructed
    - When the JVM starts
    - When the GC runs
    - Once, when the class is loaded
  correctIndex: 3
  explanation: Static initializers run at class-loading time, before any instance is constructed and before main runs.
- id: q9
  question: A `final` field can be assigned?
  options:
    - Only at declaration or in a constructor
    - Anywhere
    - Only at declaration
    - Only via a setter
  correctIndex: 0
  explanation: A final field must be definitely assigned exactly once — either at its declaration or in every constructor — before the object is fully constructed.
- id: q10
  question: Calling an overridable method from a constructor is risky because?
  options:
    - The compiler forbids it
    - The subclass override runs before its constructor body
    - The JVM throws IllegalAccessError
    - It is always safe in Java
  correctIndex: 1
  explanation: Virtual dispatch always targets the most-derived override, so the subclass method runs before its constructor body, observing uninitialized fields.
```

