---
slug: javascript-es6-features-modern-syntax
id: javascript-09
track: javascript
order: 9
title: ES6+ Features and Modern Syntax
description: Adopt the post-2015 syntax that defines modern JavaScript — destructuring, template literals, classes, symbols, iterators, generators, optional chaining, and more.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=6700s
whyItMatters: Adopt the post-2015 syntax that defines modern JavaScript — destructuring, template literals, classes, symbols, iterators, generators, optional chaining, and more.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# ES6+ Features and Modern Syntax

## ES6+ Features and Modern Syntax

### Why It Matters

Adopt the post-2015 syntax that defines modern JavaScript — destructuring, template literals, classes, symbols, iterators, generators, optional chaining, and more.

Adopt the post-2015 syntax that defines modern JavaScript — destructuring, template literals, classes, symbols, iterators, generators, optional chaining, and more.

### Prerequisites

- Stage 8: Async/Await and the Event Loop
- Comfort with functions, objects, and arrays.

### Topics

- let/const, arrow functions, default/rest/spread (recap)
- Template literals, tagged templates
- Destructuring (arrays, objects, nested, defaults)
- Classes, getters/setters, static methods, class fields
- Symbols and well-known symbols (Symbol.iterator)
- Iterators and generators (function*, yield)
- Optional chaining (?.) and nullish coalescing (??)
- Numeric separators, BigInt, private class fields (#)

### Key Concepts

- ES6 (2015) was the language's biggest leap; since then a yearly cadence ships smaller features
- Iterators/iterables power `for...of`, spread, destructuring, and `Array.from`
- Generators are functions that can pause (yield) and resume — the basis of async/await
- Private fields (`#x`) are truly private, unlike convention-based `_x`
- Symbols are unique, non-enumerable keys — useful for metaprogramming via well-known symbols
- Tagged templates let you build DSLs (styled-components, html``)

```javascript
class BankAccount {
  #balance = 0;            // truly private

  constructor(initial = 0) {
    this.#balance = initial;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Invalid deposit");
    this.#balance += amount;
    return this.#balance;
  }

  get balance() { return this.#balance; }
}

const acc = new BankAccount(100);
console.log(acc.balance);  // 100
// console.log(acc.#balance); // SyntaxError — private
```
Caption: Class with private fields

### Common Pitfalls

- Treating `_x` as private — convention only; it's still enumerable and writable; use `#x` for true privacy.
- Mixing BigInt and Number — `1n + 1` throws TypeError; convert explicitly with `Number()` or `BigInt()`.
- Forgetting `Symbol.iterator` to make a class iterable — `for...of` and spread won't work until you implement it.
- Using template literals for SQL without escaping — tagged templates don't sanitize; use parameterized queries for SQL.
- Class fields are NOT on the prototype — instance fields live on each instance, increasing per-instance memory for many objects.

### Real-World Applications

- styled-components (used by Atlassian, Bloomberg, Coinbase) is built on tagged templates: `css\`color: red\`` compiles to hashed class names.
- The React class fields proposal (now standard) simplified class components at Facebook before hooks took over; the same syntax ships in every modern codebase.
- MongoDB's Node driver uses BigInt for 64-bit integer fields to avoid float precision loss when serializing large counts.
- Webpack's tapable library uses Symbols internally to expose extension hooks without polluting the public API surface.

### Interview Questions

- 1. What is a Symbol? — A unique, immutable primitive; often used as object keys that won't collide with string keys (and aren't enumerated by for...in).
- 2. What's the difference between `#x` and `_x`? — `#x` is a true private field (enforced by the engine); `_x` is just a naming convention with no privacy.
- 3. What is a generator? — A function that can pause (yield) and resume; returns an iterator; the foundation of async/await.
- 4. How do you make a custom class iterable? — Implement `[Symbol.iterator]()` returning an object with a `next()` method.
- 5. Can you mix BigInt and Number in arithmetic? — No; `1n + 1` throws TypeError; convert explicitly first.

### Mini Project

Build a "Linked List" class that's iterable — supports `for...of`, spread, destructuring — plus methods `push`, `pop`, `map`, `filter`, and `forEach`. It takes initial values and exposes the standard collection API. Suggested approach:
  - Use a private `#head` and `#tail` field with a `Node` helper class
  - Implement `[Symbol.iterator]()` as a generator that walks the chain
  - Implement `map` and `filter` to return new LinkedLists
  - Add a `get size()` getter using a private counter
  - Add a `reverse()` method that mutates in place and returns `this` for chaining

### Exercises

1. Write a generator `take(gen, n)` that yields the first `n` values of another generator.
2. Build a `Vector2` class with `#x`, `#y`, getters, and `add`/`scale` methods.
3. Implement a tagged template `sql\`...\`` that returns parameterized query objects (placeholder for now).
4. Use BigInt to compute 100! (factorial) and print the full decimal expansion.
5. Create a class `Stack` with private storage and an iterable interface (`for...of` pops in LIFO order).
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which declares a truly private field?
9. A) _name
10. B) #name (*)
11. C) private name
12. D) __name__
13. Explanation: #name is enforced by the engine; _name is only a convention and remains accessible.
14. Q2: What does a `function*` declaration create?
15. A) An async function
16. B) A generator function (*)
17. C) A class
18. D) A Promise
19. Explanation: function* returns a generator; calling it gives an iterator whose .next() resumes after each yield.
20. Q3: BigInt literals end with:
21. A) b
22. B) n (*)
23. C) L
24. D) g
25. Explanation: 123n is a BigInt; 123 is a Number. Mixing throws TypeError.
26. Q4: To make a class work with `for...of`, implement:
27. A) Symbol.create
28. B) Symbol.iterator (*)
29. C) Symbol.forOf
30. D) iterator()
31. Explanation: for...of looks up Symbol.iterator on the object; it should return an iterator with .next().
32. Q5: `1_000_000` is:
33. A) A BigInt
34. B) A regular Number with visual separators (*)
35. C) A string
36. D) A SyntaxError
37. Explanation: Numeric separators are purely visual; the value is just 1000000.
38. Q6: Which is FALSE about Symbols?
39. A) They are unique
40. B) They are enumerable in for...in (*)
41. C) They can be object keys
42. D) Symbol.iterator is well-known
43. Explanation: Symbol-keyed properties are skipped by for...in and Object.keys; use Object.getOwnPropertySymbols to see them.
44. Q7: Tagged templates are used by:
45. A) styled-components for CSS-in-JS (*)
46. B) The DOM API
47. C) Promises
48. D) Module imports
49. Explanation: A tag function receives string parts + values, enabling DSLs like css`color: red` or html`<div>${x}</div>`.
50. Q8: `class Foo { #x = 5; }` — `new Foo().#x` from outside:
51. A) Returns 5
52. B) Throws SyntaxError — private (*)
53. C) Returns undefined
54. D) Returns 5 only in strict mode
55. Explanation: Private fields can only be accessed inside the class body; outside access is a syntax error.
56. Q9: `??` returns the right side when the left is:
57. A) Falsy
58. B) Only null or undefined (*)
59. C) NaN
60. D) An empty string
61. Explanation: Nullish coalescing only catches null/undefined, preserving 0, "", and false as valid values.
62. Q10: A generator's `yield` keyword:
63. A) Returns from the function permanently
64. B) Pauses the function, emitting a value (*)
65. C) Throws
66. D) Is identical to return
67. Explanation: yield pauses the generator and emits a value; calling .next() again resumes after the yield.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which declares a truly private field?
  options:
    - _name
    - "#name"
    - private name
    - __name__
  correctIndex: 1
  explanation: "#name is enforced by the engine; _name is only a convention and remains accessible."
- id: q2
  question: What does a `function*` declaration create?
  options:
    - An async function
    - A generator function
    - A class
    - A Promise
  correctIndex: 1
  explanation: function* returns a generator; calling it gives an iterator whose .next() resumes after each yield.
- id: q3
  question: "BigInt literals end with:"
  options:
    - b
    - n
    - L
    - g
  correctIndex: 1
  explanation: 123n is a BigInt; 123 is a Number. Mixing throws TypeError.
- id: q4
  question: "To make a class work with `for...of`, implement:"
  options:
    - Symbol.create
    - Symbol.iterator
    - Symbol.forOf
    - iterator()
  correctIndex: 1
  explanation: for...of looks up Symbol.iterator on the object; it should return an iterator with .next().
- id: q5
  question: "`1_000_000` is:"
  options:
    - A BigInt
    - A regular Number with visual separators
    - A string
    - A SyntaxError
  correctIndex: 1
  explanation: Numeric separators are purely visual; the value is just 1000000.
- id: q6
  question: Which is FALSE about Symbols?
  options:
    - They are unique
    - They are enumerable in for...in
    - They can be object keys
    - Symbol.iterator is well-known
  correctIndex: 1
  explanation: Symbol-keyed properties are skipped by for...in and Object.keys; use Object.getOwnPropertySymbols to see them.
- id: q7
  question: "Tagged templates are used by:"
  options:
    - styled-components for CSS-in-JS
    - The DOM API
    - Promises
    - Module imports
  correctIndex: 0
  explanation: "A tag function receives string parts + values, enabling DSLs like css`color: red` or html`<div>${x}</div>`."
- id: q8
  question: "`class Foo { #x = 5; }` — `new Foo().#x` from outside:"
  options:
    - Returns 5
    - Throws SyntaxError — private
    - Returns undefined
    - Returns 5 only in strict mode
  correctIndex: 1
  explanation: Private fields can only be accessed inside the class body; outside access is a syntax error.
- id: q9
  question: "`??` returns the right side when the left is:"
  options:
    - Falsy
    - Only null or undefined
    - NaN
    - An empty string
  correctIndex: 1
  explanation: Nullish coalescing only catches null/undefined, preserving 0, "", and false as valid values.
- id: q10
  question: "A generator's `yield` keyword:"
  options:
    - Returns from the function permanently
    - Pauses the function, emitting a value
    - Throws
    - Is identical to return
  correctIndex: 1
  explanation: yield pauses the generator and emits a value; calling .next() again resumes after the yield.
```

