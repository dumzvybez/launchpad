---
slug: javascript-variables-types-operators
id: javascript-02
track: javascript
order: 2
title: Variables, Types, and Operators
description: Master `let`, `const`, and `var`, the seven primitive types, type coercion, equality, and JavaScript's operator precedence rules.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=600s
whyItMatters: Master `let`, `const`, and `var`, the seven primitive types, type coercion, equality, and JavaScript's operator precedence rules.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Variables, Types, and Operators

## Variables, Types, and Operators

### Why It Matters

Master `let`, `const`, and `var`, the seven primitive types, type coercion, equality, and JavaScript's operator precedence rules.

Master `let`, `const`, and `var`, the seven primitive types, type coercion, equality, and JavaScript's operator precedence rules.

### Prerequisites

- Stage 1: Getting Started with JavaScript
- Familiarity with the browser console or Node REPL.

### Topics

- let, const, var and their scoping rules
- Primitive types: string, number, boolean, null, undefined, symbol, bigint
- Reference type: object (and arrays, functions, dates)
- typeof, instanceof, and their gotchas
- == vs === and Abstract vs Strict Equality
- Arithmetic, assignment, comparison, logical, bitwise operators
- Nullish coalescing (??) and optional chaining (?.)
- Template literals and string interpolation

### Key Concepts

- `const` prevents reassignment, not mutation — objects/arrays declared with const can still have their contents changed
- `let` is block-scoped; `var` is function-scoped and hoisted with value `undefined`
- `typeof null === "object"` is a historical bug kept for backward compatibility
- Numbers are IEEE-754 doubles — there is no separate integer type; 0.1 + 0.2 !== 0.3
- `==` coerces operands (often surprisingly); always prefer `===`
- `NaN` is the only value not equal to itself; use Number.isNaN to test

```javascript
function demo() {
  if (true) {
    var x = 1;     // function-scoped
    let y = 2;     // block-scoped
    const z = 3;   // block-scoped, no reassignment
  }
  console.log(x); // 1 — var leaks out of the block
  console.log(y); // ReferenceError
}
```
Caption: let, const, var scoping

### Common Pitfalls

- Using `==` instead of `===` — silent coercion makes `0 == ""`, `null == undefined`, and `"1" == 1` all true; always use `===` unless you specifically want coercion.
- Mutating objects declared with `const` — `const` only freezes the binding, not the value; use `Object.freeze` (shallow) or `readonly` (TS) to prevent mutation.
- Treating `NaN` like a normal comparable value — `NaN !== NaN`; use `Number.isNaN(x)` (not the global `isNaN`, which coerces).
- Assuming `0.1 + 0.2 === 0.3` — IEEE-754 floats give 0.30000000000000004; use `Math.abs(a-b) < Number.EPSILON` for comparisons.
- Forgetting that `typeof null === "object"` — to detect null use `x === null`; to detect arrays use `Array.isArray`.

### Real-World Applications

- React's reconciliation engine relies on reference equality (`===`) to decide which props changed; mutating state instead of replacing it breaks re-renders company-wide at Meta, where this is enforced via lint rules.
- Stripe's JavaScript SDK uses optional chaining and nullish coalescing throughout to safely navigate nested API responses for payment intents.
- The Lodash library exists largely to paper over the equality/deep-clone/coercion pitfalls that JavaScript ships with; thousands of companies depend on it.
- Google Docs' real-time collaboration layer uses BigInt for op IDs to avoid floating-point precision loss in CRDT sequences.

### Interview Questions

- 1. What's the difference between `let`, `const`, and `var`? — var is function-scoped and hoisted; let/const are block-scoped and in the TDZ; const can't be reassigned (but objects can be mutated).
- 2. Why does `0.1 + 0.2 !== 0.3` in JavaScript? — Numbers are IEEE-754 doubles; 0.1 and 0.2 can't be represented exactly in binary floating point.
- 3. Explain the Temporal Dead Zone (TDZ). — The period between entering a scope and a let/const declaration where accessing the variable throws ReferenceError; it prevents use-before-init.
- 4. What's the difference between `==` and `===`? — `==` coerces operands to a common type; `===` requires same type and value; prefer `===`.
- 5. How do you safely check for null? — Use `x === null`; `typeof null === "object"` is a legacy bug. For null OR undefined use `x == null`.

### Mini Project

Build a "Type Inspector" function `inspect(value)` that returns a string describing the value's type, equality-class, and a deep-clone-safe flag. It takes any JS value and prints a structured report. Suggested approach:
  - Use typeof for primitives, Array.isArray for arrays, and Object.prototype.toString.call for the rest
  - Distinguish null from objects explicitly
  - Detect NaN with Number.isNaN and report IEEE-754 quirks for numbers
  - Add a `mutability` field that returns "immutable" for primitives and "mutable" for objects
  - Test with: 42, "hi", null, undefined, NaN, [], {}, function(){}, Symbol(), 10n

### Exercises

1. Write a function `deepEqual(a, b)` that compares two values structurally (handle objects, arrays, primitives).
2. Create a `clamp(n, min, max)` function using only `??` and ternaries — no `if`.
3. Demonstrate the TDZ: declare `let x = 5`, then write `console.log(x); let x;` and observe the error.
4. Build `safeDivide(a, b)` that returns `Infinity`, `NaN`, or a finite number and tests for each.
5. Show that `Object.freeze` is shallow by freezing `{nested: {x:1}}` and mutating `nested.x`.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which keyword declares a block-scoped variable that can be reassigned?
9. A) var
10. B) let (*)
11. C) const
12. D) static
13. Explanation: let is block-scoped and reassignable; const is block-scoped but not reassignable; var is function-scoped.
14. Q2: What does typeof null return?
15. A) "null"
16. B) "object" (*)
17. C) "undefined"
18. D) "none"
19. Explanation: A historical bug from the original implementation; typeof null === "object" is kept for backward compatibility.
20. Q3: What is 0.1 + 0.2 in JavaScript?
21. A) 0.3
22. B) 0.30000000000000004 (*)
23. C) 0.3000001
24. D) NaN
25. Explanation: IEEE-754 doubles can't represent 0.1 or 0.2 exactly, producing a tiny rounding error.
26. Q4: Which comparison is true?
27. A) 0 === ""
28. B) null === undefined
29. C) NaN === NaN
30. D) 1 === 1.0 (*)
31. Explanation: 1 and 1.0 are the same IEEE-754 double; the other three are false because of type or NaN.
32. Q5: Which operator only catches null and undefined (not 0 or "")?
33. A) ||
34. B) ?? (*)
35. C) &&
36. D) ?
37. Explanation: ?? is the nullish coalescing operator; || also falsies 0, "", NaN, and false.
38. Q6: const prevents:
39. A) Mutation of object properties
40. B) Reassignment of the binding (*)
41. C) Garbage collection
42. D) Property enumeration
43. Explanation: const freezes the variable binding; the object it points to can still be mutated.
44. Q7: What does `[] == false` evaluate to?
45. A) true (*)
46. B) false
47. C) TypeError
48. D) undefined
49. Explanation: == coerces both sides to numbers: [] → "" → 0, false → 0, so they're equal — a classic coercion trap.
50. Q8: How do you correctly check if a value is NaN?
51. A) value === NaN
52. B) isNaN(value)
53. C) Number.isNaN(value) (*)
54. D) typeof value === "nan"
55. Explanation: Number.isNaN doesn't coerce, so it's only true for actual NaN; global isNaN("hello") returns true misleadingly.
56. Q9: Which is NOT a primitive type in JavaScript?
57. A) symbol
58. B) bigint
59. C) array (*)
60. D) undefined
61. Explanation: Arrays are objects (reference type); the seven primitives are string, number, boolean, null, undefined, symbol, bigint.
62. Q10: `let x = 5; { let x = 10; } console.log(x);` prints:
63. A) 10
64. B) 5 (*)
65. C) undefined
66. D) ReferenceError
67. Explanation: let is block-scoped, so the inner x shadows but doesn't change the outer x; output is 5.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which keyword declares a block-scoped variable that can be reassigned?
  options:
    - var
    - let
    - const
    - static
  correctIndex: 1
  explanation: let is block-scoped and reassignable; const is block-scoped but not reassignable; var is function-scoped.
- id: q2
  question: What does typeof null return?
  options:
    - '"null"'
    - '"object"'
    - '"undefined"'
    - '"none"'
  correctIndex: 1
  explanation: A historical bug from the original implementation; typeof null === "object" is kept for backward compatibility.
- id: q3
  question: What is 0.1 + 0.2 in JavaScript?
  options:
    - "0.3"
    - "0.30000000000000004"
    - "0.3000001"
    - NaN
  correctIndex: 1
  explanation: IEEE-754 doubles can't represent 0.1 or 0.2 exactly, producing a tiny rounding error.
- id: q4
  question: Which comparison is true?
  options:
    - 0 === ""
    - null === undefined
    - NaN === NaN
    - 1 === 1.0
  correctIndex: 3
  explanation: 1 and 1.0 are the same IEEE-754 double; the other three are false because of type or NaN.
- id: q5
  question: Which operator only catches null and undefined (not 0 or "")?
  options:
    - "||"
    - ??
    - "&&"
    - "?"
  correctIndex: 1
  explanation: ?? is the nullish coalescing operator; || also falsies 0, "", NaN, and false.
- id: q6
  question: "const prevents:"
  options:
    - Mutation of object properties
    - Reassignment of the binding
    - Garbage collection
    - Property enumeration
  correctIndex: 1
  explanation: const freezes the variable binding; the object it points to can still be mutated.
- id: q7
  question: What does `[] == false` evaluate to?
  options:
    - "true"
    - "false"
    - TypeError
    - undefined
  correctIndex: 0
  explanation: "== coerces both sides to numbers: [] → \"\" → 0, false → 0, so they're equal — a classic coercion trap."
- id: q8
  question: How do you correctly check if a value is NaN?
  options:
    - value === NaN
    - isNaN(value)
    - Number.isNaN(value)
    - typeof value === "nan"
  correctIndex: 2
  explanation: Number.isNaN doesn't coerce, so it's only true for actual NaN; global isNaN("hello") returns true misleadingly.
- id: q9
  question: Which is NOT a primitive type in JavaScript?
  options:
    - symbol
    - bigint
    - array
    - undefined
  correctIndex: 2
  explanation: Arrays are objects (reference type); the seven primitives are string, number, boolean, null, undefined, symbol, bigint.
- id: q10
  question: "`let x = 5; { let x = 10; } console.log(x);` prints:"
  options:
    - "10"
    - "5"
    - undefined
    - ReferenceError
  correctIndex: 1
  explanation: let is block-scoped, so the inner x shadows but doesn't change the outer x; output is 5.
```

