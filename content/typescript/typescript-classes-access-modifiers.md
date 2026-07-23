---
slug: typescript-classes-access-modifiers
id: typescript-05
track: typescript
order: 5
title: Classes and Access Modifiers
description: Author ES6 classes in TypeScript with `public`, `private`, `protected`, `readonly`, parameter properties, abstract classes, and `implements`.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ&t=900s
whyItMatters: Author ES6 classes in TypeScript with `public`, `private`, `protected`, `readonly`, parameter properties, abstract classes, and `implements`.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Classes and Access Modifiers

## Classes and Access Modifiers

### Why It Matters

Author ES6 classes in TypeScript with `public`, `private`, `protected`, `readonly`, parameter properties, abstract classes, and `implements`.

Author ES6 classes in TypeScript with `public`, `private`, `protected`, `readonly`, parameter properties, abstract classes, and `implements`.

### Prerequisites

- Stage 3: Interfaces and Type Aliases.
- Stage 4: Functions and Type Inference.

### Topics

- Class fields and method annotations
- `public`, `private`, `protected` modifiers
- The `#` private field syntax (TC39) vs the `private` keyword
- `readonly` fields and `static` members
- Parameter properties (`constructor(private x: number)`)
- `abstract` classes and methods
- `implements` vs `extends`
- Getters and setters

### Key Concepts

- TS `private`/`protected` are compile-time only; the `#` syntax is truly private at runtime (ES2022).
- Parameter properties (`constructor(private id: number)`) declare and assign in one line.
- `implements` checks structural compliance with an interface; it does not inherit implementation.
- `abstract` classes cannot be instantiated directly; subclasses must implement abstract methods.
- Getters/setters are emitted as `Object.defineProperty` accessors, not plain fields.

```typescript
class Account {
  constructor(
    public readonly id: string,
    private balance: number,
    protected owner: string,
  ) {}

  public deposit(amount: number): void {
    this.balance += amount;
  }

  get currentBalance(): number {
    return this.balance;
  }
}
```
Caption: Basic class with modifiers

### Common Pitfalls

- Believing `private` is enforced at runtime — it is not; only the `#` syntax is. Code outside the class can still read `private` fields via `as any` or by ignoring types.
- Mixing `private` (keyword) and `#` (sigil) inconsistently — pick one style per codebase; `#` is the standard going forward and works without TS.
- Using `implements` when you mean `extends` — `implements` only checks shape, it does not inherit; forgetting `super()` calls and overridden methods silently break.
- Forgetting that parameter properties are emitted as fields — this can break tree-shaking if the class is large; prefer explicit fields in performance-critical code.
- Marking a field `readonly` but assigning in two methods — `readonly` permits assignment only inside the constructor; use a getter or return a new instance for "modifications".

### Real-World Applications

- VS Code's text editor model uses abstract classes (`ReferenceProvider`, `HoverProvider`) to define extension points; concrete providers implement them.
- The Angular framework's dependency injection is built on decorators + classes with parameter properties (`constructor(private http: HttpClient)`); this is the canonical Angular pattern.
- TypeORM entities are classes with `@Column()` decorators; the class IS the database schema and the parameter-property style is enforced by convention.
- NestJS controllers and services are plain TS classes with `@Injectable()` decorators; the DI container resolves constructor parameter types via emitDecoratorMetadata.

### Interview Questions

- 1. What is the difference between `private` (keyword) and `#` (sigil)? — `private` is compile-time only; `#` is enforced at runtime via the TC39 private-fields mechanism.
- 2. What does `implements` do? — It checks that a class structurally satisfies an interface; it does not inherit any implementation.
- 3. What are parameter properties? — Constructor parameters with modifiers (`private`, `public`, etc.) that TS auto-declares and assigns as fields.
- 4. Can a `readonly` field be reassigned in a method? — No, only in the constructor. Use a getter or return a new instance to "modify" it.
- 5. What is an abstract class good for? — Defining a partial implementation with extension points (abstract methods) that subclasses must complete.

### Mini Project

Build a typed Bank Account Hierarchy: An abstract `BankAccount` with `deposit`, `withdraw` (abstract), and `balance` getter; `SavingsAccount` and `CheckingAccount` subclasses with overdraft rules. Suggested approach:
  - Define `abstract class BankAccount` with `protected balance: number`
  - Implement `deposit(amount: number): void` in the base class
  - Declare `abstract withdraw(amount: number): boolean`
  - In `CheckingAccount`, allow overdraft up to a `limit`; in `SavingsAccount`, refuse overdraft
  - Add a `readonly id: string` parameter property and a `#pin` truly-private field

### Exercises

1. Write a class `Rectangle` with `readonly` width and height and a `area` getter; instantiate and verify the getter.
2. Add a `private` method and confirm TS errors when you try to call it from outside the class.
3. Refactor the class to use `#` private fields instead of the `private` keyword.
4. Create an `interface Comparable<T>` and `class Score implements Comparable<Score>` with a `compareTo` method.
5. Write an abstract class `Animal` with an abstract `sound()` method, then implement `Dog` and `Cat` subclasses.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which access modifier is enforced at RUNTIME?
9. A) `#` (TC39 private field) (*)
10. B) `private` keyword
11. C) `protected` keyword
12. D) `internal`
13. Explanation: Only the `#` sigil syntax creates a truly private field enforced by the JS engine; the `private` keyword is compile-time only.
14. Q2: What do parameter properties do?
15. A) Mark parameters as readonly
16. B) Auto-declare and assign constructor parameters as fields (*)
17. C) Make parameters optional
18. D) Convert parameters to getters
19. Explanation: A constructor parameter prefixed with `private`/`public`/`protected`/`readonly` is declared as a class field and assigned automatically.
20. Q3: What does `class A implements B` guarantee?
21. A) A inherits B's implementation
22. B) A is a subtype of B at runtime
23. C) A is structurally compatible with B — no implementation is inherited (*)
24. D) B becomes a subclass of A
25. Explanation: `implements` is a structural check only; the class must satisfy the interface but does not inherit any code from it.
26. Q4: Where can a `readonly` field be assigned?
27. A) Anywhere in the class
28. B) Only in static methods
29. C) Anywhere outside the class
30. D) Only inside the constructor (*)
31. Explanation: `readonly` fields can be assigned during construction (constructor body) and nowhere else.
32. Q5: Which keyword declares a class that cannot be instantiated directly?
33. A) `abstract` (*)
34. B) `sealed`
35. C) `final`
36. D) `static`
37. Explanation: `abstract class` cannot be `new`'d; only non-abstract subclasses can be instantiated.
38. Q6: Which modifier makes a member accessible only within the class and its subclasses?
39. A) `private`
40. B) `protected` (*)
41. C) `public`
42. D) `internal`
43. Explanation: `protected` members are visible to the declaring class and any subclass, but not to outside code.
44. Q7: What is emitted for a getter `get x(): number { ... }`?
45. A) A plain field assignment
46. B) A method named `getX`
47. C) An accessor defined via `Object.defineProperty` (*)
48. D) A static property
49. Explanation: Getters/setters compile down to property accessors on the prototype, defined via `Object.defineProperty` in the constructor.
50. Q8: Which is TRUE of `abstract` methods?
51. A) They have a body
52. B) They are always static
53. C) They can be called on the abstract class itself
54. D) They have no body — subclasses must implement them (*)
55. Explanation: Abstract method declarations have no implementation; concrete subclasses must provide one.
56. Q9: What happens if you write `private x` and access it from a subclass?
57. A) Compile error — `private` excludes subclasses (*)
58. B) Works fine
59. C) Runtime error
60. D) Implicitly becomes `protected`
61. Explanation: `private` members are only visible inside the declaring class; subclasses cannot see them. Use `protected` to expose to subclasses.
62. Q10: Which is the recommended modern way to declare a private field?
63. A) `private x: number`
64. B) `#x: number` (*)
65. C) `_x: number` (convention)
66. D) `static x: number`
67. Explanation: The TC39 `#` syntax is runtime-enforced, works in plain JS, and is the modern standard. The `private` keyword remains for backwards compatibility.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which access modifier is enforced at RUNTIME?
  options:
    - "`#` (TC39 private field)"
    - "`private` keyword"
    - "`protected` keyword"
    - "`internal`"
  correctIndex: 0
  explanation: Only the `#` sigil syntax creates a truly private field enforced by the JS engine; the `private` keyword is compile-time only.
- id: q2
  question: What do parameter properties do?
  options:
    - Mark parameters as readonly
    - Auto-declare and assign constructor parameters as fields
    - Make parameters optional
    - Convert parameters to getters
  correctIndex: 1
  explanation: A constructor parameter prefixed with `private`/`public`/`protected`/`readonly` is declared as a class field and assigned automatically.
- id: q3
  question: What does `class A implements B` guarantee?
  options:
    - A inherits B's implementation
    - A is a subtype of B at runtime
    - A is structurally compatible with B — no implementation is inherited
    - B becomes a subclass of A
  correctIndex: 2
  explanation: "`implements` is a structural check only; the class must satisfy the interface but does not inherit any code from it."
- id: q4
  question: Where can a `readonly` field be assigned?
  options:
    - Anywhere in the class
    - Only in static methods
    - Anywhere outside the class
    - Only inside the constructor
  correctIndex: 3
  explanation: "`readonly` fields can be assigned during construction (constructor body) and nowhere else."
- id: q5
  question: Which keyword declares a class that cannot be instantiated directly?
  options:
    - "`abstract`"
    - "`sealed`"
    - "`final`"
    - "`static`"
  correctIndex: 0
  explanation: "`abstract class` cannot be `new`'d; only non-abstract subclasses can be instantiated."
- id: q6
  question: Which modifier makes a member accessible only within the class and its subclasses?
  options:
    - "`private`"
    - "`protected`"
    - "`public`"
    - "`internal`"
  correctIndex: 1
  explanation: "`protected` members are visible to the declaring class and any subclass, but not to outside code."
- id: q7
  question: "What is emitted for a getter `get x(): number { ... }`?"
  options:
    - A plain field assignment
    - A method named `getX`
    - An accessor defined via `Object.defineProperty`
    - A static property
  correctIndex: 2
  explanation: Getters/setters compile down to property accessors on the prototype, defined via `Object.defineProperty` in the constructor.
- id: q8
  question: Which is TRUE of `abstract` methods?
  options:
    - They have a body
    - They are always static
    - They can be called on the abstract class itself
    - They have no body — subclasses must implement them
  correctIndex: 3
  explanation: Abstract method declarations have no implementation; concrete subclasses must provide one.
- id: q9
  question: What happens if you write `private x` and access it from a subclass?
  options:
    - Compile error — `private` excludes subclasses
    - Works fine
    - Runtime error
    - Implicitly becomes `protected`
  correctIndex: 0
  explanation: "`private` members are only visible inside the declaring class; subclasses cannot see them. Use `protected` to expose to subclasses."
- id: q10
  question: Which is the recommended modern way to declare a private field?
  options:
    - "`private x: number`"
    - "`#x: number`"
    - "`_x: number` (convention)"
    - "`static x: number`"
  correctIndex: 1
  explanation: The TC39 `#` syntax is runtime-enforced, works in plain JS, and is the modern standard. The `private` keyword remains for backwards compatibility.
```

