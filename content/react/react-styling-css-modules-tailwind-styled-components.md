---
slug: react-styling-css-modules-tailwind-styled-components
id: react-17
track: react
order: 17
title: Styling — CSS Modules, Tailwind, styled-components
description: "Choose and apply a modern styling strategy: scoped CSS Modules, utility-first Tailwind, and CSS-in-JS with styled-components — and learn the tradeoffs."
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=960s
whyItMatters: "Choose and apply a modern styling strategy: scoped CSS Modules, utility-first Tailwind, and CSS-in-JS with styled-components — and learn the tradeoffs."
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Styling — CSS Modules, Tailwind, styled-components

## Styling — CSS Modules, Tailwind, styled-components

### Why It Matters

Choose and apply a modern styling strategy: scoped CSS Modules, utility-first Tailwind, and CSS-in-JS with styled-components — and learn the tradeoffs.

Choose and apply a modern styling strategy: scoped CSS Modules, utility-first Tailwind, and CSS-in-JS with styled-components — and learn the tradeoffs.

### Prerequisites

- Stage 16: State Management.
- CSS fundamentals: selectors, specificity, flex/grid, responsive design.

### Topics

- CSS Modules: scoping, composition, `:global`
- Tailwind: utility classes, configuration, the JIT engine
- styled-components / Emotion: tagged template literals, props, theming
- Comparison: bundle size, runtime, DX, type safety
- Conditional and dynamic styles
- Dark mode and theming
- Responsive and container queries
- CSS-in-JS pitfalls with SSR

### Key Concepts

- CSS Modules scope class names to the component by hashing — no global collisions
- Tailwind's JIT compiles only the utilities you use into a tiny final CSS bundle
- CSS-in-JS (styled-components) generates styles at runtime, which has a cost on SSR and first paint
- All three support theming via CSS variables or a provider
- Pick based on team familiarity, SSR needs, and type-safety appetite

```tsx
import styles from "./Button.module.css";

export function Button({ variant = "primary" }: { variant?: "primary" | "ghost" }) {
  return (
    <button className={`${styles.btn} ${styles[variant]}`}>
      Click
    </button>
  );
}
```
Caption: CSS Modules

### Common Pitfalls

- Forgetting the `$` prefix for transient props in styled-components v6 — non-`$` props are forwarded to the DOM and React warns about unknown attributes.
- Overusing `!important` in Tailwind to override specificity — refactor your utilities or use `layer` instead.
- Including the full Tailwind CSS instead of using the JIT scanner — bundle bloats to megabytes; ensure `content` globs cover only your source files.
- CSS-in-JS runtime cost on SSR — styled-components generates styles at runtime; consider zero-runtime alternatives (Linaria, Vanilla-Extract, Tailwind) for SSR-heavy apps.
- Global CSS leaks with CSS Modules — `:global(...)` escapes scoping; use sparingly or you'll reintroduce global collisions.

### Real-World Applications

- Vercel, GitHub (Primer React), and Hashnode use Tailwind for utility-first development at scale.
- PayPal and Reddit (web) have used styled-components for theming at scale; many have since migrated to zero-runtime CSS-in-JS.
- Spotify's web player uses CSS Modules with custom PostCSS for scoping.
- Notion uses a custom CSS-in-JS system optimized for their block editor with memoized style hashing.

### Interview Questions

- 1. CSS Modules vs Tailwind vs styled-components — main tradeoff? — Modules: scoped + familiar; Tailwind: utility-first + tiny bundles with JIT; styled-components: dynamic props + theming, but runtime cost on SSR.
- 2. What is Tailwind's JIT and why does it matter? — It compiles only the utility classes you actually use into the final CSS, keeping bundles small (vs the old pre-built megabyte CSS).
- 3. Why use `$` for transient props in styled-components v6? — Props without `$` are forwarded to the DOM as attributes, causing React warnings; `$` marks them as styling-only.
- 4. What's the SSR cost of styled-components? — Runtime style generation requires extracting styles server-side and rehydrating, adding complexity and overhead vs zero-runtime solutions.
- 5. How do CSS Modules scope classes? — The compiler hashes class names (e.g. `.btn` → `.Button_btn__a1b2c`), making them unique per file and avoiding global collisions.

### Mini Project

Build a "Themeable Card Component" three ways: CSS Modules, Tailwind, and styled-components. Each version supports a `variant` (default/bordered/elevated) and a `size` (sm/md/lg), plus a dark-mode toggle via a `data-theme` attribute on the root. Compare DX, bundle size, and re-render behavior. Suggested approach:
  - Implement the same Card API in each approach
  - Use CSS variables for theming across all three
  - Toggle `data-theme="dark"` on the root and watch all three adapt
  - Build each and compare the production CSS bundle size
  - Note any TS prop-typing differences

### Exercises

1. Build a small component with CSS Modules and confirm class names are hashed in DevTools.
2. Reproduce the same component with Tailwind and measure the CSS bundle.
3. Add a transient `$variant` prop to a styled-components button and confirm it isn't forwarded to the DOM.
4. Implement dark mode with CSS variables and a `data-theme` attribute.
5. Migrate one component from styled-components to Tailwind and observe runtime behavior changes.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How do CSS Modules scope class names?
9. A) By hashing class names (e.g. `.btn` -> `.Button_btn__a1b2c`) (*)
10. B) By prefixing with the file name manually
11. C) With `!important`
12. D) With inline styles
13. Explanation: The CSS Modules compiler rewrites class names with a hash unique per file, avoiding global collisions while keeping the source readable.
14. Q2: What does Tailwind's JIT engine do?
15. A) Compiles all utility classes upfront
16. B) Compiles only the utility classes you actually use into the final CSS (*)
17. C) Defers CSS loading
18. D) Skips class scanning
19. Explanation: JIT scans your source files and generates only the utilities present, producing a tiny final CSS bundle (vs the old pre-built megabyte CSS).
20. Q3: Why use the `$` prefix for transient props in styled-components v6?
21. A) It's required by TypeScript
22. B) For performance
23. C) To prevent the prop from being forwarded to the DOM as an attribute (*)
24. D) It's a CSS variable prefix
25. Explanation: Without `$`, styled-components forwards unknown props to the DOM element, triggering React warnings; `$` marks a prop as styling-only.
26. Q4: Which approach has a runtime cost on SSR?
27. A) CSS Modules
28. B) Tailwind
29. C) Vanilla Extract
30. D) styled-components (runtime CSS-in-JS) (*)
31. Explanation: styled-components generates styles at runtime and requires server-side extraction + client rehydration; CSS Modules, Tailwind, and Vanilla Extract compile styles at build time.
32. Q5: Which is a zero-runtime CSS-in-JS option?
33. A) Vanilla Extract / Linaria (*)
34. B) styled-components
35. C) emotion (default)
36. D) inline styles
37. Explanation: Vanilla Extract and Linaria compile styles to static CSS at build time, eliminating the runtime cost of traditional CSS-in-JS.
38. Q6: How do you escape scoping in CSS Modules intentionally?
39. A) Use `!important`
40. B) Use `:global(...)` (*)
41. C) Inline styles
42. D) Use `@apply`
43. Explanation: `:global(.x)` opts a selector out of the local scoping; use sparingly (e.g. for third-party overrides) or you reintroduce global collisions.
44. Q7: Which is a Tailwind anti-pattern?
45. A) Using `@apply` in component CSS
46. B) Configuring `content` globs
47. C) Overusing `!important` to override specificity (*)
48. D) Using the JIT
49. Explanation: If you need `!important` constantly, your design tokens or class layering is wrong; refactor with `layer` or fix the cascade instead of forcing specificity.
50. Q8: Why configure Tailwind's `content` globs carefully?
51. A) To enable JIT
52. B) To minify CSS
53. C) For TypeScript
54. D) So the scanner includes your source files (and only those) — too broad includes unused classes; too narrow misses some (*)
55. Explanation: The JIT scanner generates utilities found in the `content` files; misconfigured globs either bloat the bundle (too broad) or drop styles (too narrow).
56. Q9: Which styling approach is most ergonomic for dynamic prop-driven styles?
57. A) styled-components (props in template literal) (*)
58. B) CSS Modules (needs class strings)
59. C) Tailwind (needs conditional class strings)
60. D) Plain CSS (no props)
61. Explanation: styled-components lets you interpolate `${(p) => ...}` directly in the CSS, making dynamic prop-driven styles concise — at the cost of runtime.
62. Q10: Which is best for theming across all three approaches?
63. A) Inline styles
64. B) CSS variables (custom properties) on a root element (*)
65. C) `!important`
66. D) Specificity hacks
67. Explanation: CSS variables cascade through the DOM and can be flipped by a `data-theme` attribute, working seamlessly with CSS Modules, Tailwind, and styled-components alike.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How do CSS Modules scope class names?
  options:
    - By hashing class names (e.g. `.btn` -> `.Button_btn__a1b2c`)
    - By prefixing with the file name manually
    - With `!important`
    - With inline styles
  correctIndex: 0
  explanation: The CSS Modules compiler rewrites class names with a hash unique per file, avoiding global collisions while keeping the source readable.
- id: q2
  question: What does Tailwind's JIT engine do?
  options:
    - Compiles all utility classes upfront
    - Compiles only the utility classes you actually use into the final CSS
    - Defers CSS loading
    - Skips class scanning
    - .
  correctIndex: 1
  explanation: JIT scans your source files and generates only the utilities present, producing a tiny final CSS bundle (vs the old pre-built megabyte CSS).
- id: q3
  question: Why use the `$` prefix for transient props in styled-components v6?
  options:
    - It's required by TypeScript
    - For performance
    - To prevent the prop from being forwarded to the DOM as an attribute
    - It's a CSS variable prefix
  correctIndex: 2
  explanation: Without `$`, styled-components forwards unknown props to the DOM element, triggering React warnings; `$` marks a prop as styling-only.
- id: q4
  question: Which approach has a runtime cost on SSR?
  options:
    - CSS Modules
    - Tailwind
    - Vanilla Extract
    - styled-components (runtime CSS-in-JS)
  correctIndex: 3
  explanation: styled-components generates styles at runtime and requires server-side extraction + client rehydration; CSS Modules, Tailwind, and Vanilla Extract compile styles at build time.
- id: q5
  question: Which is a zero-runtime CSS-in-JS option?
  options:
    - Vanilla Extract / Linaria
    - styled-components
    - emotion (default)
    - inline styles
  correctIndex: 0
  explanation: Vanilla Extract and Linaria compile styles to static CSS at build time, eliminating the runtime cost of traditional CSS-in-JS.
- id: q6
  question: How do you escape scoping in CSS Modules intentionally?
  options:
    - Use `!important`
    - Use `:global(...)`
    - Inline styles
    - Use `@apply`
  correctIndex: 1
  explanation: "`:global(.x)` opts a selector out of the local scoping; use sparingly (e.g. for third-party overrides) or you reintroduce global collisions."
- id: q7
  question: Which is a Tailwind anti-pattern?
  options:
    - Using `@apply` in component CSS
    - Configuring `content` globs
    - Overusing `!important` to override specificity
    - Using the JIT
  correctIndex: 2
  explanation: If you need `!important` constantly, your design tokens or class layering is wrong; refactor with `layer` or fix the cascade instead of forcing specificity.
- id: q8
  question: Why configure Tailwind's `content` globs carefully?
  options:
    - To enable JIT
    - To minify CSS
    - For TypeScript
    - So the scanner includes your source files (and only those) — too broad includes unused classes; too narrow misses some
  correctIndex: 3
  explanation: The JIT scanner generates utilities found in the `content` files; misconfigured globs either bloat the bundle (too broad) or drop styles (too narrow).
- id: q9
  question: Which styling approach is most ergonomic for dynamic prop-driven styles?
  options:
    - styled-components (props in template literal)
    - CSS Modules (needs class strings)
    - Tailwind (needs conditional class strings)
    - Plain CSS (no props)
  correctIndex: 0
  explanation: styled-components lets you interpolate `${(p) => ...}` directly in the CSS, making dynamic prop-driven styles concise — at the cost of runtime.
- id: q10
  question: Which is best for theming across all three approaches?
  options:
    - Inline styles
    - CSS variables (custom properties) on a root element
    - "`!important`"
    - Specificity hacks
  correctIndex: 1
  explanation: CSS variables cascade through the DOM and can be flipped by a `data-theme` attribute, working seamlessly with CSS Modules, Tailwind, and styled-components alike.
```

