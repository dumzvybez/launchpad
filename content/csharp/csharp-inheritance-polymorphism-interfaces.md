---
slug: csharp-inheritance-polymorphism-interfaces
id: csharp-06
track: csharp
order: 6
title: Inheritance, Polymorphism, and Interfaces
description: Model hierarchies with abstract classes and interfaces, master virtual/override/sealed, default interface methods, and use pattern matching to replace brittle type-switches.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=5000s
whyItMatters: Model hierarchies with abstract classes and interfaces, master virtual/override/sealed, default interface methods, and use pattern matching to replace brittle type-switches.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# Inheritance, Polymorphism, and Interfaces

## Inheritance, Polymorphism, and Interfaces

### Why It Matters

Model hierarchies with abstract classes and interfaces, master virtual/override/sealed, default interface methods, and use pattern matching to replace brittle type-switches.

Model hierarchies with abstract classes and interfaces, master virtual/override/sealed, default interface methods, and use pattern matching to replace brittle type-switches.

### Prerequisites

- Stage 5: Classes, Structs, and Records.
- Stage 4: Methods, Parameters, and Out/Ref.

### Topics

- Base classes, `base` keyword, constructor chaining
- virtual, override, abstract, sealed methods and classes
- Interfaces, multiple interface implementation, explicit implementation
- Default interface methods (DIM, C# 8)
- `is` and `as` operators and pattern-based type tests
- Pattern matching with type and property patterns
- Covariance and contravariance in delegates and interfaces
- Discriminated-union-style modeling via sealed hierarchies + switch

### Key Concepts

- C# supports single inheritance for classes but multiple interface implementation; interfaces define a contract, abstract classes define a contract plus implementation and state.
- `virtual` opts a method into polymorphism; `override` (not `new`) extends it; `new` hides it (brittle — call depends on static type).
- Default interface methods let interfaces ship implementations without breaking existing implementers; they are only callable through the interface type, not the implementing class.
- Pattern matching on a sealed class hierarchy gives exhaustive dispatch — the compiler warns if a case is missing.
- Covariance (`out`) and contravariance (`in`) on generic interfaces preserve assignment compatibility for related types (e.g., `IEnumerable<Derived>` is assignable to `IEnumerable<Base>`).

```csharp
public class Animal
{
    public virtual string Speak() => "...";
}
public class Dog : Animal
{
    public override string Speak() => "Woof";   // polymorphic
}
public class WeirdDog : Animal
{
    public new string Speak() => "???";         // HIDES — depends on static type
}

Animal a = new WeirdDog();
Console.WriteLine(a.Speak());   // "..." — base, because new hides
Animal b = new Dog();
Console.WriteLine(b.Speak());   // "Woof" — override wins
```
Caption: Virtual / override / new

### Common Pitfalls

- Using `new` instead of `override` (or vice versa) — `new` hides the base method, so the call depends on the static type, producing surprising behavior; always use `override` for polymorphism.
- Calling a virtual method from a constructor — the derived override runs before the derived constructor body has executed, so its fields are still uninitialized; this is a classic source of `NullReferenceException` in base constructors.
- Expecting default interface methods to be callable on the implementing class — DIMs are reachable only through the interface type, not through the concrete class; `myClass.DefaultMethod()` is a compile error.
- Forgetting `sealed` on a class meant to be a leaf — without `sealed`, pattern-matching exhaustiveness checking cannot verify that a switch covers all subtypes, so future subclasses silently fall through.
- Implementing an interface explicitly and then trying to call the member on the class instance — `((IList<int>)myList).Add(1)` works but `myList.Add(1)` may not, if `Add` is hidden by an explicit implementation.

### Real-World Applications

- ASP.NET Core's `IHostedService` / `BackgroundService` hierarchy uses virtual methods (`ExecuteAsync`) that derived classes override for long-running services like Stack Overflow's tag reindexer.
- EF Core's `IQueryable<T>` and `IQueryProvider` interfaces (covariant) let LINQ providers compose queries generically; the SQL Server and InMemory providers both implement them.
- Unity's `MonoBehaviour` is an abstract base class with many virtual methods (`Start`, `Update`, `OnCollisionEnter`) that game scripts override for behavior.
- Microsoft's Roslyn `SyntaxNode` hierarchy is a sealed class tree; the visitor pattern dispatches exhaustively across all node kinds via switch.

### Interview Questions

- 1. What is the difference between `virtual`+`override` and `new`? — `override` extends the base method polymorphically (call depends on runtime type); `new` hides it (call depends on static type).
- 2. Why is calling a virtual method from a constructor dangerous? — The derived override runs before the derived constructor body, so derived fields are uninitialized; this causes subtle NullReferenceExceptions.
- 3. What are default interface methods and what problem do they solve? — DIMs (C# 8) let an interface ship a default implementation so adding a method to a published interface does not break existing implementers.
- 4. What is covariance and contravariance in C#? — Covariance (`out`) lets `IEnumerable<Derived>` be used as `IEnumerable<Base>`; contravariance (`in`) lets `Action<Base>` be used as `Action<Derived>`; both preserve type safety.
- 5. Why are sealed class hierarchies useful with pattern matching? — Sealing subclasses lets the compiler verify switch-expression exhaustiveness, so adding a new case without updating switches becomes a compile error.

### Mini Project

Build a Shape Hierarchy with Visitor: An abstract `Shape` base with sealed subtypes (Circle, Rectangle, Triangle, Composite) and a `Visit` pattern that computes area and perimeter. Demonstrate exhaustiveness by adding a new shape and watching the compiler flag every switch. Suggested approach:
  - Define `abstract record Shape` and `sealed record` subtypes
  - Implement `static double Area(Shape s) => s switch { ... }` with all cases
  - Add an `IGeometryVisitor` interface with `VisitCircle`, `VisitRectangle`, etc.
  - Add a default interface method `T Accept<T>(IGeometryVisitor<T> v) => v.VisitOther(this)`
  - Add a new `Hexagon` shape and observe every switch expression now warns

### Exercises

1. Define a base `Animal` with `virtual Speak()`, override in `Dog`, and `new` in `WeirdDog`; print `Speak()` via a base-typed reference to each.
2. Create an interface `IDrawable` with a default `Draw() => Console.WriteLine("drawing")` method; call it only via the interface.
3. Implement `IComparer<T>` and demonstrate contravariance by assigning a `Base` comparer to a `Derived` comparer parameter.
4. Build a sealed hierarchy of `PaymentMethod` (Card, Cash, Crypto) and an exhaustive switch returning a fee; add a new method and verify the compiler warns.
5. Call a virtual method from a base constructor that an override accesses a derived field — observe the default value (zero/null) and explain.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which keyword extends a virtual method polymorphically?
9. A) new
10. B) override (*)
11. C) base
12. D) virtual
13. Explanation: `override` extends a virtual method so calls dispatch on the runtime type; `new` hides it, so calls dispatch on the static type.
14. Q2: Calling a virtual method from a constructor is risky because…
15. A) Virtual methods cannot be called from constructors
16. B) It throws a StackOverflowException
17. C) The derived override runs before the derived constructor body, leaving fields uninitialized (*)
18. D) The JIT cannot inline it
19. Explanation: Virtual dispatch resolves to the most-derived override, which executes before the derived constructor has initialized its fields, causing subtle NullReferenceExceptions.
20. Q3: Default interface methods (DIM) are callable…
21. A) From any code that has the implementing class
22. B) Only via reflection
23. C) From the constructor of the implementing class
24. D) Only through the interface type (*)
25. Explanation: DIMs are reachable only when the static type is the interface; calling them through the implementing class type is a compile error.
26. Q4: Which keyword marks a class so it cannot be subclassed?
27. A) sealed (*)
28. B) abstract
29. C) static
30. D) const
31. Explanation: `sealed` prevents further derivation; this enables the compiler to verify switch-expression exhaustiveness across its sibling subtypes.
32. Q5: `IEnumerable<out T>` is covariant, meaning…
33. A) `IEnumerable<Animal>` is assignable to `IEnumerable<Dog>`
34. B) `IEnumerable<Dog>` is assignable to `IEnumerable<Animal>` (*)
35. C) Both directions work
36. D) Neither direction works
37. Explanation: Covariance (`out`) lets `IEnumerable<Dog>` be assigned to `IEnumerable<Animal>` because T appears only in output positions; this is type-safe.
38. Q6: What does the `new` keyword on a method do?
39. A) Allocates a new instance
40. B) Seals the method
41. C) Hides the inherited member (call depends on static type) (*)
42. D) Makes it abstract
43. Explanation: `new` creates an independent member that hides the base; the compiler warns unless intentional, because calls dispatch on the static type, not runtime type.
44. Q7: An explicit interface implementation is callable via…
45. A) The class instance directly
46. B) Any derived class
47. C) A static method
48. D) A cast to the interface (*)
49. Explanation: Explicit interface members (e.g., `void IList<int>.Add(int)`) are only accessible after casting to the interface, hiding them from the class's public surface.
50. Q8: Multiple inheritance in C# is supported for…
51. A) Interfaces only (*)
52. B) Classes only
53. C) Both classes and interfaces
54. D) Neither
55. Explanation: A class can have one base class but implement multiple interfaces; this avoids the diamond problem with state that plagues C++ multiple inheritance.
56. Q9: A sealed class hierarchy enables…
57. A) Faster virtual dispatch
58. B) Exhaustive pattern-matching verification (*)
59. C) Reflection at runtime
60. D) Default interface methods
61. Explanation: When all subtypes are sealed, the compiler knows the complete set, so it can warn (or error) when a switch expression misses a case.
62. Q10: Which modifier requires an override in every non-abstract subclass?
63. A) virtual
64. B) sealed
65. C) abstract (*)
66. D) static
67. Explanation: `abstract` methods have no implementation in the base; every concrete (non-abstract) derived class must override them or itself be abstract.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which keyword extends a virtual method polymorphically?
  options:
    - new
    - override
    - base
    - virtual
  correctIndex: 1
  explanation: "`override` extends a virtual method so calls dispatch on the runtime type; `new` hides it, so calls dispatch on the static type."
- id: q2
  question: Calling a virtual method from a constructor is risky because…
  options:
    - Virtual methods cannot be called from constructors
    - It throws a StackOverflowException
    - The derived override runs before the derived constructor body, leaving fields uninitialized
    - The JIT cannot inline it
  correctIndex: 2
  explanation: Virtual dispatch resolves to the most-derived override, which executes before the derived constructor has initialized its fields, causing subtle NullReferenceExceptions.
- id: q3
  question: Default interface methods (DIM) are callable…
  options:
    - are callable…
    - From any code that has the implementing class
    - Only via reflection
    - From the constructor of the implementing class
    - Only through the interface type
  correctIndex: 4
  explanation: DIMs are reachable only when the static type is the interface; calling them through the implementing class type is a compile error.
- id: q4
  question: Which keyword marks a class so it cannot be subclassed?
  options:
    - sealed
    - abstract
    - static
    - const
  correctIndex: 0
  explanation: "`sealed` prevents further derivation; this enables the compiler to verify switch-expression exhaustiveness across its sibling subtypes."
- id: q5
  question: "`IEnumerable<out T>` is covariant, meaning…"
  options:
    - "`IEnumerable<Animal>` is assignable to `IEnumerable<Dog>`"
    - "`IEnumerable<Dog>` is assignable to `IEnumerable<Animal>`"
    - Both directions work
    - Neither direction works
  correctIndex: 1
  explanation: Covariance (`out`) lets `IEnumerable<Dog>` be assigned to `IEnumerable<Animal>` because T appears only in output positions; this is type-safe.
- id: q6
  question: What does the `new` keyword on a method do?
  options:
    - Allocates a new instance
    - Seals the method
    - Hides the inherited member (call depends on static type)
    - Makes it abstract
  correctIndex: 2
  explanation: "`new` creates an independent member that hides the base; the compiler warns unless intentional, because calls dispatch on the static type, not runtime type."
- id: q7
  question: An explicit interface implementation is callable via…
  options:
    - The class instance directly
    - Any derived class
    - A static method
    - A cast to the interface
  correctIndex: 3
  explanation: Explicit interface members (e.g., `void IList<int>.Add(int)`) are only accessible after casting to the interface, hiding them from the class's public surface.
- id: q8
  question: Multiple inheritance in C# is supported for…
  options:
    - Interfaces only
    - Classes only
    - Both classes and interfaces
    - Neither
  correctIndex: 0
  explanation: A class can have one base class but implement multiple interfaces; this avoids the diamond problem with state that plagues C++ multiple inheritance.
- id: q9
  question: A sealed class hierarchy enables…
  options:
    - Faster virtual dispatch
    - Exhaustive pattern-matching verification
    - Reflection at runtime
    - Default interface methods
  correctIndex: 1
  explanation: When all subtypes are sealed, the compiler knows the complete set, so it can warn (or error) when a switch expression misses a case.
- id: q10
  question: Which modifier requires an override in every non-abstract subclass?
  options:
    - virtual
    - sealed
    - abstract
    - static
  correctIndex: 2
  explanation: "`abstract` methods have no implementation in the base; every concrete (non-abstract) derived class must override them or itself be abstract."
```

