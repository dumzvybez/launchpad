---
slug: css-css-variables-custom-properties-theming
id: css-12
track: css
order: 12
title: CSS Variables (Custom Properties) and Theming
description: "CSS custom properties (`--brand: ...`) are the foundation of modern theming. Learn declaration, inheritance, `var()` with fallbacks, runtime updates, theme switching, and the gotchas of inheritance and animation."
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=40K1pvxEwlE&t=400s
whyItMatters: CSS custom properties (`--brand:. `) are the foundation of modern theming.
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# CSS Variables (Custom Properties) and Theming

## CSS Variables (Custom Properties) and Theming

### Why It Matters

CSS custom properties (`--brand:. `) are the foundation of modern theming.

CSS custom properties (`--brand: ...`) are the foundation of modern theming. Learn declaration, inheritance, `var()` with fallbacks, runtime updates, theme switching, and the gotchas of inheritance and animation.

### Prerequisites

- Stage 1-11 (especially Stage 4 colors and Stage 8 responsive)
- Comfort with the cascade and inheritance

### Topics

- Declaring custom properties: `--name: value;`
- Using `var(--name, fallback)`
- Scope: `:root` vs element-local vs component-local
- Inheritance and the cascade (custom properties inherit)
- Type registration with `@property` (animatable custom properties)
- Runtime updates via JavaScript (`element.style.setProperty`)
- Theme switching: light/dark via `data-theme` and `light-dark()`
- Design tokens: spacing, color, typography, radius scales

### Key Concepts

- Custom properties are resolved per element, not at parse time; they can be overridden at any scope and updated at runtime via JS.
- They inherit like `color` does — declare on `:root` for global tokens, on a component for scoped tokens.
- `var(--brand, #333)` provides a fallback used when `--brand` is not defined or invalid.
- Plain custom properties are NOT animatable by default; register them with `@property` (with a `syntax`) to enable animation.
- Custom properties can reference other custom properties (`--hover: color-mix(in oklch, var(--brand), white 20%);`).

```css
:root {
  /* Color tokens */
  --color-brand: oklch(60% 0.2 250);
  --color-brand-hover: color-mix(in oklch, var(--color-brand), white 20%);
  --color-bg: white;
  --color-fg: #111;
  --color-border: #e5e7eb;

  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-full: 9999px;
}
```
Caption: Design tokens

### Common Pitfalls

- Assuming custom properties are animatable — they are not unless registered with `@property` and a `syntax`.
- Forgetting the fallback in `var(--name, fallback)` — when the variable is invalid (not undefined), the property becomes invalid and the whole declaration is ignored.
- Using custom properties in `@media` queries — you cannot use `var()` in media query conditions; use a literal value.
- Expecting custom properties to behave like Sass variables — they resolve at the element, not at compile time; the cascade and inheritance matter.
- Overriding a custom property on too broad a selector — declaring `--brand: red` on `body` cascades to everything; scope it to a class or `[data-theme]` instead.

### Real-World Applications

- Stripe uses CSS custom properties for design tokens so the marketing site and dashboard can be re-themed per product (Stripe Atlas, Sigma, etc.).
- Vercel uses `data-theme="dark"` and a custom-property swap to flip the entire dashboard without reloading.
- Linear uses `@property`-registered custom properties to animate gradient angles in their issue status badges.
- GitHub uses custom properties for syntax highlighting themes (light/dark/dim) — one swap updates all code blocks.

### Interview Questions

- 1. How do CSS custom properties differ from preprocessor variables (Sass/Less)? — Custom properties are resolved per element at runtime, inherit, and can be updated via JS; preprocessor variables are compile-time constants.
- 2. What is the role of the fallback in `var(--name, fallback)`? — It is used when the custom property is not defined or invalid; without it, the property using `var()` becomes invalid and the declaration is ignored.
- 3. How do you make a custom property animatable? — Register it with `@property { syntax: "<type>"; inherits: bool; initial-value: ...; }` so the browser knows its type.
- 4. How would you implement a runtime theme switcher? — Define tokens on `:root`, override them on `[data-theme="dark"]`, and toggle the attribute via JS; `color-scheme` flips UA widgets.
- 5. Why can't you use `var()` inside a `@media` query? — Media query conditions are evaluated before the cascade resolves custom properties, so they require literal values.

### Mini Project

Build a Theme Switcher with Design Tokens: A small UI (header, button, card) themed with CSS custom properties, with a toggle button that flips between light and dark by setting `data-theme` on `<html>`. Use `light-dark()` for the OS-aware default and `@property` for one animatable property. Suggested approach:
  - Define color, spacing, and radius tokens on `:root`
  - Use `light-dark()` for OS-default theme
  - Override tokens on `[data-theme="dark"]`
  - Add a button that toggles `data-theme` between "light" and "dark"
  - Persist the choice in `localStorage` and apply before first paint (FOUC prevention)
  - Register one custom property with `@property` and use it in a subtle animation

### Exercises

1. Convert a stylesheet's hardcoded colors to custom properties and verify nothing changes visually.
2. Use `var(--name, fallback)` and confirm the fallback is used when the variable is undefined.
3. Register a custom property with `@property` for `<color>` and animate it; observe smooth color transitions.
4. Toggle `data-theme="dark"` via JS and verify all themed surfaces swap.
5. Persist the user's theme choice in `localStorage` and apply it inline in `<head>` before paint.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How are CSS custom properties declared?
9. A) `--name: value;` (*)
10. B) `$name: value;`
11. C) `@var name: value;`
12. D) `var name = value;`
13. Explanation: Custom properties use the `--name: value;` syntax and are referenced via `var(--name)`.
14. Q2: Which function references a custom property with a fallback?
15. A) `$name, fallback`
16. B) `prop(name, fallback)`
17. C) `get(name, fallback)`
18. D) `var(--name, fallback)` (*)
19. Explanation: `var(--name, fallback)` uses the fallback if the property is undefined or invalid.
20. Q3: Do custom properties inherit by default?
21. A) Yes, like `color` they inherit down the tree (*)
22. B) No, they are scoped to the element
23. C) Only when declared with `inherit`
24. D) Only inside `:root`
25. Explanation: Custom properties inherit by default; declaring on `:root` makes them global, on a class makes them scoped to that subtree.
26. Q4: How do you make a custom property animatable?
27. A) Just reference it in `@keyframes`
28. B) Register it with `@property` and a `syntax` (*)
29. C) Use `var()` inside `transition`
30. D) Custom properties are always animatable
31. Explanation: Plain custom properties are not animatable; registering with `@property { syntax: "<type>"; ... }` enables interpolation.
32. Q5: Which attribute is commonly toggled to switch themes?
33. A) `class="dark"`
34. B) `theme="dark"`
35. C) `data-theme="dark"` (*)
36. D) `mode="dark"`
37. Explanation: `data-theme` is a common convention; override custom properties on `[data-theme="dark"]` to flip the theme.
38. Q6: What does `light-dark(lightValue, darkValue)` return?
39. A) The average of both
40. B) Always the first value
41. C) Always the second value
42. D) The value matching the active `color-scheme` (*)
43. Explanation: `light-dark()` returns the first value in light mode and the second in dark mode, based on the active `color-scheme`.
44. Q7: Why can't you use `var()` inside a `@media` query?
45. A) Media queries are evaluated before the cascade resolves custom properties (*)
46. B) It is too slow
47. C) `var()` is invalid syntax
48. D) Custom properties are not inherited
49. Explanation: Media query conditions are static; they must be literal values, not runtime-resolved custom properties.
50. Q8: Which rule registers a custom property's type?
51. A) `@var`
52. B) `@property` (*)
53. C) `@custom-property`
54. D) `@register`
55. Explanation: `@property { syntax: "<angle>"; inherits: false; initial-value: 0deg; }` registers a typed custom property.
56. Q9: How do you update a custom property at runtime via JS?
57. A) `element.var = "value"`
58. B) `element.css("--name", "value")`
59. C) `element.style.setProperty("--name", "value")` (*)
60. D) `element.setProperty("name", "value")`
61. Explanation: `element.style.setProperty("--name", "value")` updates the custom property on that element, and the cascade re-resolves.
62. Q10: Which behavior do custom properties share with `color`?
63. A) They are not inherited
64. B) They trigger layout
65. C) They cannot be overridden
66. D) They inherit down the DOM tree (*)
67. Explanation: Custom properties inherit by default like `color`, so a token set on `:root` cascades to every element.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How are CSS custom properties declared?
  options:
    - "`--name: value;`"
    - "`$name: value;`"
    - "`@var name: value;`"
    - "`var name = value;`"
  correctIndex: 0
  explanation: "Custom properties use the `--name: value;` syntax and are referenced via `var(--name)`."
- id: q2
  question: Which function references a custom property with a fallback?
  options:
    - "`$name, fallback`"
    - "`prop(name, fallback)`"
    - "`get(name, fallback)`"
    - "`var(--name, fallback)`"
  correctIndex: 3
  explanation: "`var(--name, fallback)` uses the fallback if the property is undefined or invalid."
- id: q3
  question: Do custom properties inherit by default?
  options:
    - Yes, like `color` they inherit down the tree
    - No, they are scoped to the element
    - Only when declared with `inherit`
    - Only inside `:root`
  correctIndex: 0
  explanation: Custom properties inherit by default; declaring on `:root` makes them global, on a class makes them scoped to that subtree.
- id: q4
  question: How do you make a custom property animatable?
  options:
    - Just reference it in `@keyframes`
    - Register it with `@property` and a `syntax`
    - Use `var()` inside `transition`
    - Custom properties are always animatable
  correctIndex: 1
  explanation: 'Plain custom properties are not animatable; registering with `@property { syntax: "<type>"; ... }` enables interpolation.'
- id: q5
  question: Which attribute is commonly toggled to switch themes?
  options:
    - '`class="dark"`'
    - '`theme="dark"`'
    - '`data-theme="dark"`'
    - '`mode="dark"`'
  correctIndex: 2
  explanation: '`data-theme` is a common convention; override custom properties on `[data-theme="dark"]` to flip the theme.'
- id: q6
  question: What does `light-dark(lightValue, darkValue)` return?
  options:
    - The average of both
    - Always the first value
    - Always the second value
    - The value matching the active `color-scheme`
  correctIndex: 3
  explanation: "`light-dark()` returns the first value in light mode and the second in dark mode, based on the active `color-scheme`."
- id: q7
  question: Why can't you use `var()` inside a `@media` query?
  options:
    - Media queries are evaluated before the cascade resolves custom properties
    - It is too slow
    - "`var()` is invalid syntax"
    - Custom properties are not inherited
  correctIndex: 0
  explanation: Media query conditions are static; they must be literal values, not runtime-resolved custom properties.
- id: q8
  question: Which rule registers a custom property's type?
  options:
    - "`@var`"
    - "`@property`"
    - "`@custom-property`"
    - "`@register`"
  correctIndex: 1
  explanation: '`@property { syntax: "<angle>"; inherits: false; initial-value: 0deg; }` registers a typed custom property.'
- id: q9
  question: How do you update a custom property at runtime via JS?
  options:
    - '`element.var = "value"`'
    - '`element.css("--name", "value")`'
    - '`element.style.setProperty("--name", "value")`'
    - '`element.setProperty("name", "value")`'
  correctIndex: 2
  explanation: '`element.style.setProperty("--name", "value")` updates the custom property on that element, and the cascade re-resolves.'
- id: q10
  question: Which behavior do custom properties share with `color`?
  options:
    - They are not inherited
    - They trigger layout
    - They cannot be overridden
    - They inherit down the DOM tree
  correctIndex: 3
  explanation: Custom properties inherit by default like `color`, so a token set on `:root` cascades to every element.
```

