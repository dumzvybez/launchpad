---
slug: javascript-object-oriented-javascript-prototypes
id: javascript-16
track: javascript
order: 16
title: Object-Oriented JavaScript and Prototypes
description: Understand JavaScript's true OOP model — prototypes, the prototype chain, classes, inheritance, and mixins — and how `class` is sugar over a prototype system.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=13000s
whyItMatters: Understand JavaScript's true OOP model — prototypes, the prototype chain, classes, inheritance, and mixins — and how `class` is sugar over a prototype system.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Object-Oriented JavaScript and Prototypes

## Object-Oriented JavaScript and Prototypes

### Why It Matters

Understand JavaScript's true OOP model — prototypes, the prototype chain, classes, inheritance, and mixins — and how `class` is sugar over a prototype system.

Understand JavaScript's true OOP model — prototypes, the prototype chain, classes, inheritance, and mixins — and how `class` is sugar over a prototype system.

### Prerequisites

- Stage 15: Functional Programming in JavaScript
- Comfort with ES6 classes from Stage 9.

### Topics

- The prototype chain: __proto__, Object.getPrototypeOf, Object.create
- Function constructors (legacy) vs class syntax
- class, extends, super
- Static methods and properties
- Mixins and composition over inheritance
- Object.create, Object.assign for inheritance
- Getters, setters, and property descriptors
- new.target and abstract-class patterns

### Key Concepts

- Every object has a hidden [[Prototype]] link accessed via `__proto__` or `Object.getPrototypeOf`
- Property lookup walks the prototype chain until found or `null` (Object.prototype's prototype)
- `class` is syntactic sugar over prototype-based constructors — `extends` wires up prototypes
- JS has single inheritance via prototypes but multiple inheritance via mixins (Object.assign)
- `new` calls the constructor with `this` bound to a fresh object whose prototype is Constructor.prototype
- `super` in a constructor must be called before `this` access in a subclass

```javascript
const animal = { breathe() { return `${this.name} breathes`; } };
const dog = Object.create(animal);
dog.bark = function() { return `${this.name} barks`; };

const rex = Object.create(dog);
rex.name = "Rex";
console.log(rex.breathe()); // "Rex breathes" — found on animal
console.log(rex.bark());    // "Rex barks"    — found on dog
console.log(Object.getPrototypeOf(rex) === dog); // true
```
Caption: Prototype chain

### Common Pitfalls

- Forgetting `super()` before `this` in a subclass — throws ReferenceError; the engine needs parent setup before `this` exists.
- Mutating shared array/object properties on the prototype — all instances share them; define in the constructor instead.
- Confusing `__proto__` (legacy, deprecated) with `Object.getPrototypeOf` — use the latter; __proto__ still works but is non-standard on non-objects.
- Using deep inheritance hierarchies — fragile and hard to refactor; prefer composition (mixins, small focused classes).
- Calling `Child.method` and expecting `this` to be the child — when you assign a method to a parent and call via a child instance, `this` is the child (correct), but static methods are NOT inherited via extends (they are since ES2015 — verify).

### Real-World Applications

- The Node.js `EventEmitter` class uses prototype-based inheritance; nearly every stream and socket in Node's standard library extends it.
- Three.js uses ES6 classes for its scene graph (Mesh extends Object3D extends EventDispatcher); the entire library is OOP at its core.
- Custom Elements (Web Components) rely on `class MyElement extends HTMLElement`; YouTube, GitHub, and Apple Music ship them.
- The MongoDB Node driver uses class hierarchies (Cursor, MongoClient) for its public API surface.

### Interview Questions

- 1. What is the prototype chain? — Each object has a [[Prototype]] link; property lookup walks the chain until found or null (end of chain).
- 2. Is `class` just sugar? — Yes; under the hood, classes compile to function constructors with prototype methods; `extends` wires up prototypes.
- 3. Why call `super()` first in a subclass constructor? — `this` doesn't exist until the parent constructor runs; accessing `this` before super throws.
- 4. How do mixins differ from inheritance? — Mixins compose behavior via Object.assign to the prototype; no class hierarchy; more flexible, less coupling.
- 5. What does `new` do? — Creates an object, sets its [[Prototype]] to Constructor.prototype, calls the constructor with `this`, returns the object (or the constructor's return value if it's an object).

### Mini Project

Build a small class hierarchy for a "Shape Renderer": an abstract `Shape` base with `area()` and `toString()`, plus `Circle`, `Rectangle`, and `Triangle` subclasses. Add a `Serializable` mixin and a `ShapeRegistry` that tracks all instances. Suggested approach:
  - Define `Shape` with `#id` private field, a static `#registry` Set, and an abstract `area()` that throws
  - Subclass each shape with `super(name)` and override `area()`
  - Mix in `Serializable` (serialize/toJSON) via Object.assign on Shape.prototype
  - Add `Shape.all()` returning `[...Shape.#registry]`
  - Write a `totalArea(shapes)` reducer and demonstrate polymorphism

### Exercises

1. Recreate the `class` keyword's behavior using function constructors and `Object.create`.
2. Build a `Vehicle` → `Car` → `ElectricCar` hierarchy; demonstrate `super` calls in both constructor and methods.
3. Write a `Loggable` mixin that adds `.log()` to any class; mix it into two unrelated classes.
4. Use `Object.defineProperty` to make a property read-only and enumerable=false; verify with for...in.
5. Implement an abstract method pattern: a base class whose method throws "not implemented".
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Property lookup walks:
9. A) The call stack
10. B) The prototype chain (*)
11. C) The event loop
12. D) The module graph
13. Explanation: JS looks up properties on the object, then its [[Prototype]], and so on up to Object.prototype (whose prototype is null).
14. Q2: `class` in JavaScript is:
15. A) A new runtime concept
16. B) Syntactic sugar over prototypes and constructors (*)
17. C) Required for OOP
18. D) Always faster than functions
19. Explanation: Classes compile to function constructors with prototype methods; `extends` wires up prototypes.
20. Q3: In a subclass constructor, you must call:
21. A) this() first
22. B) super() before using this (*)
23. C) parent() before using this
24. D) Nothing special
25. Explanation: `this` doesn't exist until super() runs; accessing it before throws ReferenceError.
26. Q4: `Object.create(proto)` creates an object whose:
27. A) Constructor is proto
28. B) [[Prototype]] is proto (*)
29. C) Class is proto
30. D) Type is proto
31. Explanation: Object.create sets the [[Prototype]] link directly, without calling a constructor.
32. Q5: `rex instanceof Dog` checks:
33. A) rex's class name
34. B) If Dog.prototype is anywhere in rex's prototype chain (*)
35. C) rex's constructor name
36. D) rex's typeof
37. Explanation: instanceof walks the prototype chain of rex looking for Dog.prototype.
38. Q6: Mixins in JS are usually applied via:
39. A) Multiple extends
40. B) Object.assign(Class.prototype, Mixin) (*)
41. C) import *
42. D) decorators only
43. Explanation: JS has single inheritance; mixins compose behavior by copying methods onto the prototype.
44. Q7: Static methods are:
45. A) Inherited via __proto__ of instances
46. B) Called on the class itself, not instances (*)
47. C) Always private
48. D) The same as prototype methods
49. Explanation: `static` puts the method on the constructor function itself: Animal.create("x"), not rex.create().
50. Q8: `Object.defineProperty(obj, "x", { value: 1, writable: false })`:
51. A) Makes x mutable
52. B) Makes x read-only at the descriptor level (*)
53. C) Deletes x
54. D) Is the same as obj.x = 1
55. Explanation: Property descriptors control writability, enumerability, configurability; writable:false blocks reassignment.
56. Q9: The end of every prototype chain is:
57. A) Object
58. B) Function
59. C) null (*)
60. D) undefined
61. Explanation: Object.prototype's [[Prototype]] is null; lookup stops there and returns undefined.
62. Q10: Deep inheritance hierarchies are usually:
63. A) Recommended
64. B) Fragile — prefer composition (*)
65. C) Required for OOP
66. D) Faster than mixins
67. Explanation: Composition (mixins, small classes) is more flexible and easier to refactor than deep class trees.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "Property lookup walks:"
  options:
    - The call stack
    - The prototype chain
    - The event loop
    - The module graph
  correctIndex: 1
  explanation: JS looks up properties on the object, then its [[Prototype]], and so on up to Object.prototype (whose prototype is null).
- id: q2
  question: "`class` in JavaScript is:"
  options:
    - A new runtime concept
    - Syntactic sugar over prototypes and constructors
    - Required for OOP
    - Always faster than functions
  correctIndex: 1
  explanation: Classes compile to function constructors with prototype methods; `extends` wires up prototypes.
- id: q3
  question: "In a subclass constructor, you must call:"
  options:
    - this() first
    - super() before using this
    - parent() before using this
    - Nothing special
  correctIndex: 1
  explanation: "`this` doesn't exist until super() runs; accessing it before throws ReferenceError."
- id: q4
  question: "`Object.create(proto)` creates an object whose:"
  options:
    - Constructor is proto
    - "[[Prototype]] is proto"
    - Class is proto
    - Type is proto
  correctIndex: 1
  explanation: Object.create sets the [[Prototype]] link directly, without calling a constructor.
- id: q5
  question: "`rex instanceof Dog` checks:"
  options:
    - rex's class name
    - If Dog.prototype is anywhere in rex's prototype chain
    - rex's constructor name
    - rex's typeof
  correctIndex: 1
  explanation: instanceof walks the prototype chain of rex looking for Dog.prototype.
- id: q6
  question: "Mixins in JS are usually applied via:"
  options:
    - Multiple extends
    - Object.assign(Class.prototype, Mixin)
    - import *
    - decorators only
  correctIndex: 1
  explanation: JS has single inheritance; mixins compose behavior by copying methods onto the prototype.
- id: q7
  question: "Static methods are:"
  options:
    - Inherited via __proto__ of instances
    - Called on the class itself, not instances
    - Always private
    - The same as prototype methods
  correctIndex: 1
  explanation: '`static` puts the method on the constructor function itself: Animal.create("x"), not rex.create().'
- id: q8
  question: '`Object.defineProperty(obj, "x", { value: 1, writable: false })`:'
  options:
    - Makes x mutable
    - Makes x read-only at the descriptor level
    - Deletes x
    - Is the same as obj.x = 1
  correctIndex: 1
  explanation: Property descriptors control writability, enumerability, configurability; writable:false blocks reassignment.
- id: q9
  question: "The end of every prototype chain is:"
  options:
    - Object
    - Function
    - "null"
    - undefined
  correctIndex: 2
  explanation: Object.prototype's [[Prototype]] is null; lookup stops there and returns undefined.
- id: q10
  question: "Deep inheritance hierarchies are usually:"
  options:
    - Recommended
    - Fragile — prefer composition
    - Required for OOP
    - Faster than mixins
  correctIndex: 1
  explanation: Composition (mixins, small classes) is more flexible and easier to refactor than deep class trees.
```

