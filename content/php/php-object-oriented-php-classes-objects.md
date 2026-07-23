---
slug: php-object-oriented-php-classes-objects
id: php-10
track: php
order: 10
title: Object-Oriented PHP — Classes and Objects
description: Model real-world entities with classes, properties, visibility, constructors (both legacy and PHP 8 promoted syntax), and the modern `readonly` properties and constructor property promotion introduced in PHP 8.1.
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=7200s
whyItMatters: Model real-world entities with classes, properties, visibility, constructors (both legacy and PHP 8 promoted syntax), and the modern `readonly` properties and constructor property promotion introduced in PHP 8. 1.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Object-Oriented PHP — Classes and Objects

## Object-Oriented PHP — Classes and Objects

### Why It Matters

Model real-world entities with classes, properties, visibility, constructors (both legacy and PHP 8 promoted syntax), and the modern `readonly` properties and constructor property promotion introduced in PHP 8. 1.

Model real-world entities with classes, properties, visibility, constructors (both legacy and PHP 8 promoted syntax), and the modern `readonly` properties and constructor property promotion introduced in PHP 8.1.

### Prerequisites

- Stage 4: Functions and Include Files
- Stage 5: Arrays
- Stage 8: Sessions, Cookies, and Authentication

### Topics

- Declaring classes, properties, and methods
- Visibility: `public`, `protected`, `private`
- The `new` keyword and object instantiation
- Constructors: legacy `__construct($x)` + `$this->x = $x` vs PHP 8 promoted `__construct(public int $x)`
- `readonly` properties (PHP 8.1)
- Typed properties (PHP 7.4+) and default values
- `$this` and the current instance
- Static properties and methods, `self::` vs `static::`
- Class constants and `enum` (PHP 8.1)
- `instanceof`, `get_class()`, `is_a()`
- Magic methods overview: `__construct`, `__get`, `__set`, `__toString`, `__invoke`, `__debugInfo`

### Key Concepts

- Constructor property promotion (PHP 8.0): `__construct(public int $x, private string $y)` auto-declares and assigns the properties, eliminating boilerplate.
- `readonly` properties (PHP 8.1) can be written once (in the constructor) and are read-only afterward — perfect for value objects and DTOs.
- Typed properties (PHP 7.4) throw `TypeError` on assignment of wrong types; without an explicit default, typed properties are uninitialized (not null) until assigned.
- `$this` refers to the current instance from within an instance method; `self::` refers to the class where the code is written (early binding); `static::` is late static binding (resolved at runtime).
- PHP 8.1 enums are real enumerated types with `cases()`, `from()`, `tryFrom()`, and optional methods — far safer than the old "class constants" trick.

```php
<?php
declare(strict_types=1);

// Old style (pre-8.0) — boilerplate
class UserOld
{
    public string $name;
    public int $age;
    public function __construct(string $name, int $age)
    {
        $this->name = $name;
        $this->age = $age;
    }
}

// PHP 8.0+ promoted, 8.1+ readonly
final class User
{
    public function __construct(
        public readonly string $name,
        public readonly int $age,
        public readonly string $email,
    ) {}
}

$u = new User("Ada", 36, "ada@example.com");
echo $u->name;   // Ada
// $u->name = "Grace";  // Error: readonly property
```
Caption: Constructor property promotion and readonly

### Common Pitfalls

- Forgetting that typed properties without a default are uninitialized (not null) — accessing them before assignment throws `Error: Typed property must not be accessed before initialization`. Use `?type` with `= null` if null is a valid state.
- Mutating `readonly` properties after construction — they can be set only once, only from within the same class's scope; even cloning doesn't bypass this. Use a `with()` style method (return a new instance) for "modifications".
- Confusing `self::` with `static::` — `self::$x` always refers to the class where the code is *written*, not the calling class; `static::$x` (late static binding) is resolved at call time, which is usually what you want in inheritance.
- Using `__get`/`__set` magic for everything — these methods make code harder to trace, prevent IDE autocompletion, and silently swallow typos (`$user->namr` returns null instead of erroring). Prefer real properties or a typed `data` array.
- Leaving classes `non-final` by default — most value classes should be `final` to prevent accidental subclassing; the "Final by default" debate rages, but erring on `final` reduces coupling.

### Real-World Applications

- Laravel's Eloquent models use constructor property promotion for internal builders and `readonly` for value objects like `Url` and `EmailAddress`.
- Symfony's DTOs (Data Transfer Objects) use PHP 8.1 `readonly` properties and promoted constructors for API request/response shapes.
- WordPress's `WP_Post` is a plain stdClass-like object, but the modern WP-CLI command classes use `final`, typed properties, and constructor promotion.
- Slack's Hack (PHP dialect) codebase used `<<__Memoize>>` and immutable classes for cache-friendly value types, inspiring PHP's `readonly`.

### Interview Questions

- 1. What is constructor property promotion? — PHP 8.0 syntax: `__construct(public int $x)` declares the property, the parameter, and assigns it in one line, eliminating boilerplate.
- 2. What does `readonly` (PHP 8.1) enforce? — The property can be written only once (typically in the constructor) and only from within the declaring class's scope; subsequent writes throw `Error`.
- 3. What's the difference between `self::` and `static::`? — `self::` is early binding (the class where code is written); `static::` is late static binding (the called class at runtime), essential for inheritance.
- 4. What happens if you access a typed property before initialization? — `Error: Typed property X must not be accessed before initialization`. Use `?type` with `= null` if null is a valid initial state.
- 5. What's the difference between PHP 8.1 enums and class constants? — Enums are real types with `cases()`, `from()`, `tryFrom()`, methods, and exhaustiveness in `match`; class constants are untyped and have no built-in enumeration API.

### Mini Project

Build an Immutable Money Value Object: A `Money` class with `readonly int $cents` and `readonly string $currency`, plus `add()`, `subtract()`, `multiply()`, and `__toString()` methods that return new instances (immutability). Suggested approach:
  - Use constructor property promotion with `readonly`
  - Use an enum for currency codes (`enum Currency: string`)
  - Each arithmetic method returns a new `Money` instance (never mutates `$this`)
  - Throw `InvalidArgumentException` on currency mismatch
  - Implement `__toString()` to format as `"USD 19.99"`

### Exercises

1. Write a `User` class with promoted constructor properties (`name`, `age`, `email`) and `readonly` modifiers.
2. Demonstrate the difference between `self::$label` and `static::$label` with a `Base` and `Child` class.
3. Define an enum `HttpStatus` with at least 4 cases (Ok, NotFound, ServerError) and a `code(): int` method.
4. Create a typed property without a default; access it before assignment to trigger "must not be accessed before initialization".
5. Implement `__toString` on a class so `echo $obj` prints a JSON representation.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which PHP version introduced constructor property promotion?
9. A) 7.4
10. B) 8.0 (*)
11. C) 8.1
12. D) 8.2
13. Explanation: Constructor property promotion (`__construct(public int $x)`) was introduced in PHP 8.0; `readonly` properties came in 8.1.
14. Q2: What does `readonly` enforce on a property?
15. A) It cannot be read outside the class
16. B) It must be a primitive type
17. C) It can be written only once, from the declaring class's scope (*)
18. D) It is serialized as null
19. Explanation: `readonly` (PHP 8.1) allows a single write — typically in the constructor — and only from within the declaring class; subsequent writes throw `Error`.
20. Q3: What does `static::` resolve to (vs `self::`)?
21. A) Always the parent class
22. B) The class where the code is written
23. C) The first subclass
24. D) The called class at runtime (late static binding) (*)
25. Explanation: `static::` uses late static binding, resolving to the class that was actually called; `self::` is early binding, always the class where the code is written.
26. Q4: What happens if you access a typed property before initialization?
27. A) Throws `Error: Typed property X must not be accessed before initialization` (*)
28. B) Returns null
29. C) Returns the default value
30. D) Throws TypeError
31. Explanation: Typed properties without a default are uninitialized (not null); accessing them throws an Error. Use `?type` with `= null` to allow null.
32. Q5: Which PHP version introduced enums?
33. A) 7.4
34. B) 8.1 (*)
35. C) 8.0
36. D) 8.2
37. Explanation: Enums (including backed enums with `enum X: string`) were introduced in PHP 8.1.
38. Q6: What does `Status::tryFrom('invalid')` return?
39. A) Throws ValueError
40. B) The default case
41. C) null (*)
42. D) false
43. Explanation: `tryFrom` returns `null` for invalid values (vs `from`, which throws `ValueError`); use it for graceful fallback.
44. Q7: Which method is invoked when you `echo $obj`?
45. A) __get
46. B) __invoke
47. C) __debugInfo
48. D) __toString (*)
49. Explanation: `__toString()` is called when an object is used in a string context (echo, string concatenation, printf %s).
50. Q8: What does `__get('name')` do?
51. A) Is called when accessing an inaccessible (private/undefined) property (*)
52. B) Reads a public property `name`
53. C) Is the constructor
54. D) Throws always
55. Explanation: `__get` is triggered when reading inaccessible properties (private from outside, or undefined); it's a fallback, not for public properties.
56. Q9: Which keyword prevents a class from being subclassed?
57. A) abstract
58. B) final (*)
59. C) sealed
60. D) static
61. Explanation: `final` prevents a class from being extended (or a method from being overridden). PHP has no `sealed` keyword.
62. Q10: What does `enum` return from `cases()`?
63. A) A string array
64. B) The first case
65. C) An array of enum cases in declaration order (*)
66. D) A generator
67. Explanation: `Status::cases()` returns an array of all enum cases in declaration order, useful for iteration.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which PHP version introduced constructor property promotion?
  options:
    - "7.4"
    - "8.0"
    - "8.1"
    - "8.2"
  correctIndex: 1
  explanation: Constructor property promotion (`__construct(public int $x)`) was introduced in PHP 8.0; `readonly` properties came in 8.1.
- id: q2
  question: What does `readonly` enforce on a property?
  options:
    - It cannot be read outside the class
    - It must be a primitive type
    - It can be written only once, from the declaring class's scope
    - It is serialized as null
  correctIndex: 2
  explanation: "`readonly` (PHP 8.1) allows a single write — typically in the constructor — and only from within the declaring class; subsequent writes throw `Error`."
- id: q3
  question: What does `static::` resolve to (vs `self::`)?
  options:
    - Always the parent class
    - The class where the code is written
    - The first subclass
    - The called class at runtime (late static binding)
  correctIndex: 3
  explanation: "`static::` uses late static binding, resolving to the class that was actually called; `self::` is early binding, always the class where the code is written."
- id: q4
  question: What happens if you access a typed property before initialization?
  options:
    - "Throws `Error: Typed property X must not be accessed before initialization`"
    - Returns null
    - Returns the default value
    - Throws TypeError
  correctIndex: 0
  explanation: Typed properties without a default are uninitialized (not null); accessing them throws an Error. Use `?type` with `= null` to allow null.
- id: q5
  question: Which PHP version introduced enums?
  options:
    - "7.4"
    - "8.1"
    - "8.0"
    - "8.2"
  correctIndex: 1
  explanation: "Enums (including backed enums with `enum X: string`) were introduced in PHP 8.1."
- id: q6
  question: What does `Status::tryFrom('invalid')` return?
  options:
    - Throws ValueError
    - The default case
    - "null"
    - "false"
  correctIndex: 2
  explanation: "`tryFrom` returns `null` for invalid values (vs `from`, which throws `ValueError`); use it for graceful fallback."
- id: q7
  question: Which method is invoked when you `echo $obj`?
  options:
    - __get
    - __invoke
    - __debugInfo
    - __toString
  correctIndex: 3
  explanation: "`__toString()` is called when an object is used in a string context (echo, string concatenation, printf %s)."
- id: q8
  question: What does `__get('name')` do?
  options:
    - Is called when accessing an inaccessible (private/undefined) property
    - Reads a public property `name`
    - Is the constructor
    - Throws always
  correctIndex: 0
  explanation: "`__get` is triggered when reading inaccessible properties (private from outside, or undefined); it's a fallback, not for public properties."
- id: q9
  question: Which keyword prevents a class from being subclassed?
  options:
    - abstract
    - final
    - sealed
    - static
  correctIndex: 1
  explanation: "`final` prevents a class from being extended (or a method from being overridden). PHP has no `sealed` keyword."
- id: q10
  question: What does `enum` return from `cases()`?
  options:
    - A string array
    - The first case
    - An array of enum cases in declaration order
    - A generator
  correctIndex: 2
  explanation: "`Status::cases()` returns an array of all enum cases in declaration order, useful for iteration."
```

