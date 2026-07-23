---
slug: typescript-decorators-metadata
id: typescript-13
track: typescript
order: 13
title: Decorators and Metadata
description: Apply class, method, property, and parameter decorators; use `emitDecoratorMetadata` and `reflect-metadata` to enable DI patterns.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=p6dO9u0M7MQ&t=7600s
whyItMatters: Apply class, method, property, and parameter decorators; use `emitDecoratorMetadata` and `reflect-metadata` to enable DI patterns.
deepDiveResources:
  - label: W3Schools TypeScript
    url: https://www.w3schools.com/typescript/
    kind: course
  - label: TypeScript Official Docs
    url: https://www.typescriptlang.org/docs/
    kind: doc
---

# Decorators and Metadata

## Decorators and Metadata

### Why It Matters

Apply class, method, property, and parameter decorators; use `emitDecoratorMetadata` and `reflect-metadata` to enable DI patterns.

Apply class, method, property, and parameter decorators; use `emitDecoratorMetadata` and `reflect-metadata` to enable DI patterns.

### Prerequisites

- Stage 5: Classes and Access Modifiers.
- Stage 11: Tooling — tsconfig, ESLint, Prettier.

### Topics

- Enabling decorators (`experimentalDecorators`, `emitDecoratorMetadata`)
- Class decorators
- Method decorators
- Property decorators
- Parameter decorators
- Decorator factories
- `reflect-metadata` and the `design:type`/`design:paramtypes` keys
- The TC39 stage-3 decorators proposal (TS 5+ `experimentalDecorators: false`)

### Key Concepts

- Legacy decorators (`experimentalDecorators: true`) are the Angular/NestJS standard; the TC39 proposal is now stage-3.
- A decorator is a function called at class-definition time; it can replace the method/class with a wrapped version.
- `emitDecoratorMetadata` emits `Reflect.metadata("design:type", ...)` calls so DI containers can read parameter types.
- Decorators apply bottom-up for methods, top-down for classes when stacked.
- The TC39 proposal (TS 5.0+, behind a different flag) is incompatible with legacy decorators — pick one per project.

```typescript
function log(target: any, key: string, desc: PropertyDescriptor) {
  const original = desc.value;
  desc.value = function (...args: any[]) {
    console.log(`Calling ${key} with`, args);
    return original.apply(this, args);
  };
}

class Service {
  @log
  greet(name: string) { return `Hello, ${name}`; }
}
```
Caption: Method decorator

### Common Pitfalls

- Forgetting `experimentalDecorators: true` in tsconfig — without it, `@decorator` syntax is a parse error (or interpreted as the TC39 proposal).
- Mixing legacy decorators with the TC39 proposal — they have incompatible semantics and APIs; pick one and set the right tsconfig flag.
- Believing decorator metadata works without `reflect-metadata` — `emitDecoratorMetadata` only emits `Reflect.metadata(...)` calls; you must import the polyfill `reflect-metadata` to make `Reflect.getMetadata` work.
- Expecting decorators to work on plain functions — they only apply to classes and their members; function decorators are not supported.
- Using parameter decorators without `design:paramtypes` — the metadata is only emitted if `emitDecoratorMetadata: true`; otherwise the decorator can't see parameter types.

### Real-World Applications

- Angular's entire framework is built on decorators: `@Component`, `@Injectable`, `@Input`, `@Output`, `@Directive`.
- NestJS uses `@Module`, `@Controller`, `@Get`, `@Post`, `@Injectable` for its DI-driven architecture.
- TypeORM entities use `@Entity`, `@Column`, `@PrimaryGeneratedColumn` to declare the database schema in code.
- The `class-validator` library uses `@IsString`, `@IsEmail`, `@MinLength` property decorators to attach validation rules; NestJS pipes consume them.

### Interview Questions

- 1. What is a decorator? — A function called at class-definition time that can observe or replace the class, method, property, or parameter it decorates.
- 2. What does `emitDecoratorMetadata` do? — Emits `Reflect.metadata("design:type", ...)` calls so DI containers can read parameter and property types via `reflect-metadata`.
- 3. What is `reflect-metadata` and why do you need it? — A polyfill that implements the (withdrawn) `Reflect.metadata` spec; `emitDecoratorMetadata` emits calls to it.
- 4. What's the difference between legacy decorators and the TC39 proposal? — Legacy (`experimentalDecorators`) is the Angular/NestJS standard; the TC39 proposal (TS 5.0+) has incompatible semantics and APIs.
- 5. Can you decorate a free-standing function? — No; TS decorators apply only to classes and their members (methods, properties, parameters).

### Mini Project

Build a Validation Decorator Library: A `@Required`, `@MinLength(n)`, `@MaxLength(n)`, `@IsEmail` set of property decorators plus a `validate(obj)` function that reads the metadata and reports errors. Suggested approach:
  - Enable `experimentalDecorators` and `emitDecoratorMetadata` in tsconfig; `npm i reflect-metadata`
  - Define a `Map<Function, Map<string, Rule[]>>` to register rules per class/property
  - Write `Required` and the `MinLength` factory as property decorators
  - Implement `validate(obj): { field: string; error: string }[]`
  - Apply to a `class UserForm { @Required @MinLength(3) name: string = "" }` and test

### Exercises

1. Enable `experimentalDecorators` and write a method decorator that logs each call with its arguments.
2. Write a class decorator factory that adds a `createdAt` field to every instance.
3. Use `emitDecoratorMetadata` + `reflect-metadata` to log a method's parameter types at definition time.
4. Build a `@Deprecated("use X instead")` decorator that warns on first call.
5. Apply the `class-validator` library to a form class and run `validate`; compare to your hand-rolled version.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which tsconfig flag enables legacy decorators?
9. A) `experimentalDecorators: true` (*)
10. B) `decorators: true`
11. C) `emitDecorators: true`
12. D) `allowDecorators: true`
13. Explanation: `experimentalDecorators: true` enables the legacy decorator syntax used by Angular, NestJS, and TypeORM.
14. Q2: What does `emitDecoratorMetadata` emit?
15. A) Decorator source code
16. B) Type information as `Reflect.metadata(...)` calls (*)
17. C) Runtime type-checks
18. D) ES2022 private fields
19. Explanation: `emitDecoratorMetadata` causes `tsc` to emit `Reflect.metadata("design:type", T)` calls so DI containers can read parameter and property types.
20. Q3: Which polyfill makes `Reflect.getMetadata` work at runtime?
21. A) `core-js`
22. B) `babel-polyfill`
23. C) `reflect-metadata` (*)
24. D) `tslib`
25. Explanation: The `reflect-metadata` package polyfills the (withdrawn) `Reflect.metadata` spec that `emitDecoratorMetadata` relies on.
26. Q4: Which TypeScript construct CANNOT be decorated?
27. A) A class
28. B) A method
29. C) A property
30. D) A free-standing function (*)
31. Explanation: TS decorators apply only to classes and their members (methods, properties, parameters); free-standing functions cannot be decorated.
32. Q5: What is a decorator factory?
33. A) A function that returns the actual decorator — enabling `@Dec(arg)` syntax (*)
34. B) A class that produces decorators
35. C) A type of method decorator
36. D) A polyfill for decorators
37. Explanation: `@Dec(arg)` calls `Dec(arg)` first, which must return the actual decorator function — this is the factory pattern.
38. Q6: When are decorators evaluated?
39. A) At runtime when the method is called
40. B) At class-definition time (when the class is first loaded) (*)
41. C) At compile time
42. D) On garbage collection
43. Explanation: Decorators run once when the class is defined; they can replace methods or the constructor before any instance exists.
44. Q7: Which framework relies heavily on `@Injectable()` and constructor DI?
45. A) React
46. B) Vue
47. C) NestJS (*)
48. D) Svelte
49. Explanation: NestJS is built on decorators + DI: `@Injectable()`, `@Controller()`, `@Module()`, with `emitDecoratorMetadata` providing the type info.
50. Q8: Which is the order when stacking method decorators `@A @B @C`?
51. A) Top-down: A, B, C
52. B) Random
53. C) All at once
54. D) Bottom-up: C, B, A (factories top-down, decorators bottom-up) (*)
55. Explanation: Factories are evaluated top-down (A, B, C), but the resulting decorators are applied bottom-up (C wraps B wraps A's result).
56. Q9: What does the TC39 stage-3 decorator proposal change?
57. A) It standardizes a different, incompatible decorator API and semantics (*)
58. B) It removes decorators entirely
59. C) It makes decorators faster
60. D) It deprecates `experimentalDecorators`
61. Explanation: The TC39 proposal has a new API and stronger semantics (e.g., no `@expose`, different metadata model); TS 5.0+ supports it behind a separate flag, but legacy decorators remain the Angular/NestJS standard.
62. Q10: Which is a real Angular decorator?
63. A) `@Service`
64. B) `@Injectable` (*)
65. C) `@ComponentClass`
66. D) `@NgModel`
67. Explanation: Angular's DI uses `@Injectable()` on services; `@Component`, `@Directive`, `@Pipe`, `@Input`, and `@Output` are the other core decorators.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which tsconfig flag enables legacy decorators?
  options:
    - "`experimentalDecorators: true`"
    - "`decorators: true`"
    - "`emitDecorators: true`"
    - "`allowDecorators: true`"
  correctIndex: 0
  explanation: "`experimentalDecorators: true` enables the legacy decorator syntax used by Angular, NestJS, and TypeORM."
- id: q2
  question: What does `emitDecoratorMetadata` emit?
  options:
    - Decorator source code
    - Type information as `Reflect.metadata(...)` calls
    - Runtime type-checks
    - ES2022 private fields
    - "` calls so DI containers can read parameter and property types."
  correctIndex: 1
  explanation: '`emitDecoratorMetadata` causes `tsc` to emit `Reflect.metadata("design:type", T)` calls so DI containers can read parameter and property types.'
- id: q3
  question: Which polyfill makes `Reflect.getMetadata` work at runtime?
  options:
    - "`core-js`"
    - "`babel-polyfill`"
    - "`reflect-metadata`"
    - "`tslib`"
  correctIndex: 2
  explanation: The `reflect-metadata` package polyfills the (withdrawn) `Reflect.metadata` spec that `emitDecoratorMetadata` relies on.
- id: q4
  question: Which TypeScript construct CANNOT be decorated?
  options:
    - A class
    - A method
    - A property
    - A free-standing function
  correctIndex: 3
  explanation: TS decorators apply only to classes and their members (methods, properties, parameters); free-standing functions cannot be decorated.
- id: q5
  question: What is a decorator factory?
  options:
    - A function that returns the actual decorator — enabling `@Dec(arg)` syntax
    - A class that produces decorators
    - A type of method decorator
    - A polyfill for decorators
  correctIndex: 0
  explanation: "`@Dec(arg)` calls `Dec(arg)` first, which must return the actual decorator function — this is the factory pattern."
- id: q6
  question: When are decorators evaluated?
  options:
    - At runtime when the method is called
    - At class-definition time (when the class is first loaded)
    - At compile time
    - On garbage collection
  correctIndex: 1
  explanation: Decorators run once when the class is defined; they can replace methods or the constructor before any instance exists.
- id: q7
  question: Which framework relies heavily on `@Injectable()` and constructor DI?
  options:
    - React
    - Vue
    - NestJS
    - Svelte
  correctIndex: 2
  explanation: "NestJS is built on decorators + DI: `@Injectable()`, `@Controller()`, `@Module()`, with `emitDecoratorMetadata` providing the type info."
- id: q8
  question: Which is the order when stacking method decorators `@A @B @C`?
  options:
    - "Top-down: A, B, C"
    - Random
    - All at once
    - "Bottom-up: C, B, A (factories top-down, decorators bottom-up)"
    - ", but the resulting decorators are applied bottom-up (C wraps B wraps A's result)."
  correctIndex: 3
  explanation: Factories are evaluated top-down (A, B, C), but the resulting decorators are applied bottom-up (C wraps B wraps A's result).
- id: q9
  question: What does the TC39 stage-3 decorator proposal change?
  options:
    - It standardizes a different, incompatible decorator API and semantics
    - It removes decorators entirely
    - It makes decorators faster
    - It deprecates `experimentalDecorators`
  correctIndex: 0
  explanation: The TC39 proposal has a new API and stronger semantics (e.g., no `@expose`, different metadata model); TS 5.0+ supports it behind a separate flag, but legacy decorators remain the Angular/NestJS standard.
- id: q10
  question: Which is a real Angular decorator?
  options:
    - "`@Service`"
    - "`@Injectable`"
    - "`@ComponentClass`"
    - "`@NgModel`"
  correctIndex: 1
  explanation: Angular's DI uses `@Injectable()` on services; `@Component`, `@Directive`, `@Pipe`, `@Input`, and `@Output` are the other core decorators.
```

