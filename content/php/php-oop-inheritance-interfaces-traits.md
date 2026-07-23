---
slug: php-oop-inheritance-interfaces-traits
id: php-11
track: php
order: 11
title: OOP — Inheritance, Interfaces, Traits
description: Compose behavior with `extends`, `abstract` classes, `interface` contracts, and `trait` reuse — and learn when each is appropriate, plus the subtleties of `final`, `abstract`, and the Liskov substitution principle.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=8000s
whyItMatters: Compose behavior with `extends`, `abstract` classes, `interface` contracts, and `trait` reuse — and learn when each is appropriate, plus the subtleties of `final`, `abstract`, and the Liskov substitution principle.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# OOP — Inheritance, Interfaces, Traits

## OOP — Inheritance, Interfaces, Traits

### Why It Matters

Compose behavior with `extends`, `abstract` classes, `interface` contracts, and `trait` reuse — and learn when each is appropriate, plus the subtleties of `final`, `abstract`, and the Liskov substitution principle.

Compose behavior with `extends`, `abstract` classes, `interface` contracts, and `trait` reuse — and learn when each is appropriate, plus the subtleties of `final`, `abstract`, and the Liskov substitution principle.

### Prerequisites

- Stage 10: Object-Oriented PHP — Classes and Objects

### Topics

- `extends` and single inheritance
- `abstract` classes and methods
- `interface` contracts and multiple implementation
- `trait` reuse and conflict resolution (`insteadof`, `as`)
- `final` classes and methods
- Method overriding and `parent::method()`
- The Liskov Substitution Principle (LSP)
- Interface vs abstract class: when to use each
- Trait pitfalls: state, property conflicts, abstract methods in traits
- `instanceof` and interface type checks

### Key Concepts

- PHP supports single inheritance only — a class can `extend` one parent, but can implement multiple interfaces. Use traits for horizontal reuse.
- An `interface` declares a contract (method signatures only); an `abstract class` can have implementation and state. Use interfaces for "what it does", abstract classes for "base behavior + extension points".
- A `trait` is compiled into a class at use time — it's not inheritance, so `instanceof` doesn't see traits. Trait property conflicts are a frequent bug source.
- `final` on a class prevents subclassing; `final` on a method prevents overriding. Mark classes `final` by default and open them only when needed.
- LSP: a subclass must be substitutable for its parent without breaking behavior — don't strengthen preconditions (e.g. rejecting inputs the parent accepted) or weaken postconditions (returning a different type).

```php
<?php
declare(strict_types=1);

interface Stringable
{
    public function asString(): string;
}

abstract class Animal
{
    public function __construct(protected readonly string $name) {}

    abstract public function sound(): string;

    public function describe(): string
    {
        return sprintf("%s says %s", $this->name, $this->sound());
    }
}

final class Dog extends Animal implements Stringable
{
    public function sound(): string { return "Woof"; }
    public function asString(): string { return $this->describe(); }
}

$d = new Dog("Rex");
echo $d->asString();   // "Rex says Woof"
echo ($d instanceof Stringable) ? "yes" : "no"; // yes
```
Caption: Interface and abstract class together

### Common Pitfalls

- Trait property conflicts — two traits declaring the same property name with different defaults cause a fatal error; declare properties in only one place or use abstract accessors.
- Using `instanceof` to check for traits — `instanceof` checks classes and interfaces only; use `class_uses($obj)` to detect traits (and recurse for parent classes).
- Strengthening preconditions in subclasses (LSP violation) — if a parent accepts any int, the subclass must not reject negatives; callers expect the subclass to honor the parent's contract.
- Forgetting `parent::__construct()` in a subclass constructor — parent properties and initialization are silently skipped, leaving objects in a half-initialized state.
- Marking methods `final` too eagerly in framework base classes — this prevents legitimate customization; mark them `final` only when overriding would break invariants.

### Real-World Applications

- Laravel's Eloquent uses traits heavily (`SoftDeletes`, `HasFactory`, `HasRelationships`) to compose behavior into models without inheritance coupling.
- Symfony's `EventDispatcher` uses interfaces for `EventSubscriberInterface` and abstract classes for `Event`, allowing both inheritance and composition.
- WordPress's `WP_REST_Controller` is an abstract base class that defines the CRUD method signatures; subclasses implement them for each post type.
- Slack's Hack codebase used interfaces aggressively for handler contracts (one interface per HTTP method) and traits for shared logging/metrics.

### Interview Questions

- 1. What's the difference between an interface and an abstract class? — Interfaces declare method signatures only (no state); abstract classes can have implementation and properties. A class can implement multiple interfaces but extend only one abstract class.
- 2. What problem do traits solve? — Horizontal reuse: sharing behavior across unrelated classes without inheritance. Use traits for cross-cutting concerns (logging, validation), not as a substitute for interfaces.
- 3. What is LSP and how is it commonly violated? — Liskov Substitution: a subclass must be substitutable for its parent. Violated when a subclass strengthens preconditions (rejects inputs the parent accepted) or weakens postconditions (returns a different type).
- 4. Why does `instanceof` not detect traits? — `instanceof` checks classes and interfaces only; traits are compiled into classes at use time. Use `class_uses()` (and recurse for parents) to detect trait usage.
- 5. What is `final` good for? — `final class` prevents subclassing (use for value objects, services); `final method` prevents overriding. Mark classes final by default and open only when needed.

### Mini Project

Build a Shapes Library with Interfaces and Traits: An `interface Shape { public function area(): float; }`, an abstract `AbstractShape` with shared `name` property and `describe()` method, two concrete shapes (`Circle`, `Rectangle`), and a `Colorable` trait that adds `color` and `hex()` methods. Suggested approach:
  - Define `Shape` interface with `area(): float` and `perimeter(): float`
  - Define `AbstractShape` with `public readonly string $name` and `describe(): string`
  - Implement `Circle` and `Rectangle` extending `AbstractShape`
  - Add a `Colorable` trait with `protected string $color` and `hex(): string`
  - Use the trait in both shapes and verify LSP holds

### Exercises

1. Write an interface `Renderable` with `render(): string`, then implement it in a `Button` and `Image` class.
2. Create an abstract `Vehicle` with abstract `maxSpeed(): int` and concrete `describe()`, then implement `Car` and `Bicycle`.
3. Write two traits with a conflicting method name; resolve the conflict with `insteadof` and `as`.
4. Write a trait with an `abstract protected function rules(): array` and use it in two classes that provide `rules()`.
5. Demonstrate an LSP violation: a `Square extends Rectangle` that breaks `setWidth`/`setHeight` semantics, then refactor to a shared interface.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How many parent classes can a PHP class extend?
9. A) 0
10. B) 2
11. C) 1 (*)
12. D) Unlimited
13. Explanation: PHP supports single inheritance: a class can extend one parent. Use interfaces (multiple) and traits for additional behavior.
14. Q2: Which keyword prevents a class from being subclassed?
15. A) sealed
16. B) abstract
17. C) readonly
18. D) final (*)
19. Explanation: `final` (on a class) prevents extension; on a method, prevents overriding. PHP has no `sealed` keyword.
20. Q3: What does `instanceof` check?
21. A) Classes and interfaces (not traits) (*)
22. B) Only direct parent classes
23. C) Traits only
24. D) Property names
25. Explanation: `instanceof` checks the class hierarchy and implemented interfaces. Traits are compiled in, not detected by `instanceof`; use `class_uses()`.
26. Q4: How do you resolve a method-name conflict between two traits?
27. A) Rename one trait
28. B) Use `insteadof` and `as` (*)
29. C) Use a private scope
30. D) You cannot — fatal error
31. Explanation: Inside `use Trait1, Trait2 { Trait1::m insteadof Trait2; Trait2::m as alias; }` resolves conflicts and lets you alias the hidden method.
32. Q5: What does LSP (Liskov Substitution Principle) require?
33. A) All methods are static
34. B) Every class has a logger
35. C) A subclass must be substitutable for its parent without breaking behavior (*)
36. D) Properties are readonly
37. Explanation: LSP: subclasses must honor the parent's contract — no strengthening preconditions, no weakening postconditions. The Square/Rectangle example is a classic violation.
38. Q6: What happens if you forget `parent::__construct()` in a subclass?
39. A) Compilation error
40. B) A deprecation notice
41. C) Automatic call anyway
42. D) Parent properties and initialization are silently skipped (*)
43. Explanation: PHP does not auto-call `parent::__construct()`; you must call it explicitly, or the parent's initialization (and any invariants it sets up) is skipped.
44. Q7: Can a trait declare an abstract method?
45. A) Yes — the using class must implement it (*)
46. B) No — only classes and interfaces
47. C) Only if the trait is final
48. D) Only static methods
49. Explanation: Traits can declare abstract methods, forcing the using class to implement them — useful for template-method patterns.
50. Q8: Which is a trait property conflict?
51. A) Two traits with the same method name
52. B) Two traits declaring the same property name with different defaults (*)
53. C) A trait used in two classes
54. D) A trait with a private method
55. Explanation: Two traits declaring the same property with different defaults cause a fatal "trait inheritance conflict" — declare properties in only one place or use abstract accessors.
56. Q9: What does an `interface` declare?
57. A) Method signatures plus private properties
58. B) Concrete implementations
59. C) Method signatures only — no implementation or state (*)
60. D) Constants and constructors
61. Explanation: Interfaces declare public method signatures (and constants); no properties, no implementation. A class can implement multiple interfaces.
62. Q10: Which keyword is used to call a parent class's method?
63. A) super::
64. B) base::
65. C) ancestor::
66. D) parent:: (*)
67. Explanation: `parent::method()` calls the parent class's version of the method (used in overridden methods to extend behavior). PHP has no `super` or `base`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How many parent classes can a PHP class extend?
  options:
    - "0"
    - "2"
    - "1"
    - Unlimited
  correctIndex: 2
  explanation: "PHP supports single inheritance: a class can extend one parent. Use interfaces (multiple) and traits for additional behavior."
- id: q2
  question: Which keyword prevents a class from being subclassed?
  options:
    - sealed
    - abstract
    - readonly
    - final
  correctIndex: 3
  explanation: "`final` (on a class) prevents extension; on a method, prevents overriding. PHP has no `sealed` keyword."
- id: q3
  question: What does `instanceof` check?
  options:
    - Classes and interfaces (not traits)
    - Only direct parent classes
    - Traits only
    - Property names
  correctIndex: 0
  explanation: "`instanceof` checks the class hierarchy and implemented interfaces. Traits are compiled in, not detected by `instanceof`; use `class_uses()`."
- id: q4
  question: How do you resolve a method-name conflict between two traits?
  options:
    - Rename one trait
    - Use `insteadof` and `as`
    - Use a private scope
    - You cannot — fatal error
  correctIndex: 1
  explanation: Inside `use Trait1, Trait2 { Trait1::m insteadof Trait2; Trait2::m as alias; }` resolves conflicts and lets you alias the hidden method.
- id: q5
  question: What does LSP (Liskov Substitution Principle) require?
  options:
    - All methods are static
    - Every class has a logger
    - A subclass must be substitutable for its parent without breaking behavior
    - Properties are readonly
  correctIndex: 2
  explanation: "LSP: subclasses must honor the parent's contract — no strengthening preconditions, no weakening postconditions. The Square/Rectangle example is a classic violation."
- id: q6
  question: What happens if you forget `parent::__construct()` in a subclass?
  options:
    - Compilation error
    - A deprecation notice
    - Automatic call anyway
    - Parent properties and initialization are silently skipped
  correctIndex: 3
  explanation: PHP does not auto-call `parent::__construct()`; you must call it explicitly, or the parent's initialization (and any invariants it sets up) is skipped.
- id: q7
  question: Can a trait declare an abstract method?
  options:
    - Yes — the using class must implement it
    - No — only classes and interfaces
    - Only if the trait is final
    - Only static methods
  correctIndex: 0
  explanation: Traits can declare abstract methods, forcing the using class to implement them — useful for template-method patterns.
- id: q8
  question: Which is a trait property conflict?
  options:
    - Two traits with the same method name
    - Two traits declaring the same property name with different defaults
    - A trait used in two classes
    - A trait with a private method
  correctIndex: 1
  explanation: Two traits declaring the same property with different defaults cause a fatal "trait inheritance conflict" — declare properties in only one place or use abstract accessors.
- id: q9
  question: What does an `interface` declare?
  options:
    - Method signatures plus private properties
    - Concrete implementations
    - Method signatures only — no implementation or state
    - Constants and constructors
  correctIndex: 2
  explanation: Interfaces declare public method signatures (and constants); no properties, no implementation. A class can implement multiple interfaces.
- id: q10
  question: Which keyword is used to call a parent class's method?
  options:
    - "super::"
    - "base::"
    - "ancestor::"
    - "parent::"
  correctIndex: 3
  explanation: "`parent::method()` calls the parent class's version of the method (used in overridden methods to extend behavior). PHP has no `super` or `base`."
```

