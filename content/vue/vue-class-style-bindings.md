---
slug: vue-class-style-bindings
id: vue-05
track: vue
order: 5
title: Class and Style Bindings
description: Bind CSS classes and inline styles reactively, including object syntax, array syntax, and the special $style scoped class helper.
difficulty: beginner
estMinutes: 135
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=YrxBCBibVo0&t=120s
whyItMatters: Bind CSS classes and inline styles reactively, including object syntax, array syntax, and the special $style scoped class helper.
deepDiveResources:
  - label: W3Schools Vue
    url: https://www.w3schools.com/vue/
    kind: course
  - label: Vue Official Docs
    url: https://vuejs.org/guide/introduction.html
    kind: doc
---

# Class and Style Bindings

## Class and Style Bindings

### Why It Matters

Bind CSS classes and inline styles reactively, including object syntax, array syntax, and the special $style scoped class helper.

Bind CSS classes and inline styles reactively, including object syntax, array syntax, and the special $style scoped class helper.

### Prerequisites

- Stage 2: The Vue Instance and Reactivity.
- Stage 3: Template Syntax (v-bind shorthand).
- Basic CSS selectors and specificity.

### Topics

- Object syntax for `:class` (`{ active: isActive, 'text-danger': hasError }`)
- Array syntax for `:class` (`['btn', isActive && 'btn-primary']`)
- Combining static class with `:class` binding
- Object syntax for `:style` (`{ color: activeColor, fontSize: size + 'px' }`)
- Multi-value bindings for vendor prefixes (`{ display: ['-webkit-box', 'flex'] }`)
- Scoped CSS in `<style scoped>` and `:deep()` / `:slotted()` / `:global()`
- CSS Modules via `<style module>` and the `$style` helper
- v-bind() in CSS (`color: v-bind(themeColor)`)

### Key Concepts

- `:class` merges with the static `class` attribute — both apply
- Object syntax is reactive: keys with truthy values are added, falsy keys are removed
- Vue auto-camelCases `:style` keys but accepts kebab-case in strings
- Scoped styles use a `data-v-xxxx` attribute selector — they do NOT leak to children except via `:deep()`
- `v-bind(varName)` inside `<style>` lets you use a reactive component variable as a CSS value

```vue
<script setup lang="ts">
import { ref, computed } from "vue";

const isActive = ref(true);
const hasError = ref(false);
const size = ref<"sm" | "md" | "lg">("md");

const sizeClass = computed(() => `btn-${size.value}`);
</script>

<template>
  <div class="static" :class="{ active: isActive, 'error': hasError }">Object</div>
  <div :class="['btn', sizeClass, { disabled: !isActive }]">Array</div>
</template>
```
Caption: Object and array :class syntax

### Common Pitfalls

- Forgetting that scoped styles do NOT apply to child component root by default — use `:deep()` to penetrate, or accept the child's own class.
- Using kebab-case object keys without quotes — `{ 'font-size': '18px' }` requires quotes; `{ fontSize: '18px' }` is preferred.
- Expecting `:class` to replace static `class` — Vue merges them; both apply, which is usually what you want.
- Mutating scoped style via JS outside the SFC — scoped styles use a generated `data-v-xxxx` attribute, so external selectors won't match without `:global()`.
- Using `v-bind()` in CSS with a non-reactive value — it only updates if the source is a ref or part of a reactive object; constants like `v-bind('red')` are syntax errors.

### Real-World Applications

- GitLab's design system uses `:class` object syntax to toggle utility classes for spacing, color, and typography variants.
- Alibaba's Element Plus library uses CSS Modules + scoped CSS to encapsulate component styles across thousands of pages.
- Behance's portfolio grid uses `:style` bindings for dynamic grid columns based on viewport width.
- Adobe Portfolio's theme editor uses `v-bind()` in CSS to let users customize accent colors without re-rendering the whole stylesheet.

### Interview Questions

- 1. How does `:class` interact with the static `class` attribute? — They merge: Vue combines the static class with the dynamic `:class` binding; both apply to the element.
- 2. What is the object syntax for `:class`? — An object whose keys are class names and values are truthy/falsy; truthy keys are applied, falsy keys removed.
- 3. How do scoped styles work in Vue? — Vue adds a unique `data-v-xxxx` attribute to the SFC's elements and rewrites CSS selectors to include it, scoping rules to the component.
- 4. What does `:deep()` do? — It bypasses the scoped selector boundary so a parent can style descendants rendered by child components.
- 5. How does `v-bind()` in CSS work? — The Vue compiler replaces it with a CSS variable bound to a reactive ref; when the ref changes, the variable updates and the CSS re-applies.

### Mini Project

Build a "Theme Toggle" component: An SFC with a button that toggles between light and dark themes, using `:class` for theme classes, `:style` for an accent color, and `v-bind()` in CSS for the background. Suggested approach:
  - Use `ref<'light' | 'dark'>('light')` for the theme
  - Bind `:class="{ 'theme-light': theme === 'light', 'theme-dark': theme === 'dark' }"` on the root
  - Use `:style="{ '--accent': accent }"` to expose a custom property to children
  - In `<style scoped>`, use `background: v-bind(theme === 'dark' ? '#222' : '#fff')`
  - Persist the theme to localStorage and restore it on mount

### Exercises

1. Render three buttons with `:class` object syntax toggling "active" on click.
2. Use `:style` array syntax to merge a base style object and an override object.
3. Build a scoped style block and use `:deep()` to style a child's `.title` class.
4. Use `v-bind()` in CSS to bind a `color` ref to a paragraph's `color`.
5. Enable CSS Modules via `<style module>` and use `$style.card` in the template.
6. >>> QUIZ (Stage 5) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does :class="{ active: isActive }" do?
9. A) Adds the class "active" only when isActive is truthy (*)
10. B) Sets class="active"
11. C) Always removes "active"
12. D) Throws if isActive is false
13. Explanation: Object syntax adds each key whose value is truthy and removes it when falsy, reactively.
14. Q2: How does :class merge with a static class="btn" attribute?
15. A) It replaces the static class
16. B) It merges — both static and dynamic classes apply (*)
17. C) The static class wins
18. D) Vue throws an error
19. Explanation: Vue merges static `class` and `:class`; the element receives the union of both.
20. Q3: Which is the correct object syntax for :style with a kebab-case property?
21. A) { font-size: '18px' }
22. B) { 'fontSize' } = '18px'
23. C) { 'font-size': '18px' } (*)
24. D) { fontsize: '18px' }
25. Explanation: JS object keys with hyphens must be quoted; `{ 'font-size': '18px' }` or camelCase `{ fontSize: '18px' }` both work.
26. Q4: What does <style scoped> do?
27. A) Imports global CSS
28. B) Disables CSS for the component
29. C) Removes all specificity
30. D) Adds a data-v-xxxx attribute selector so styles only apply to the SFC's elements (*)
31. Explanation: Scoped CSS adds a unique attribute to the SFC's elements and rewrites selectors to include `[data-v-xxxx]`, scoping the rules.
32. Q5: How do you style a child component's inner element from a scoped parent?
33. A) Use :deep(.inner) (*)
34. B) You cannot
35. C) Use !important
36. D) Use a separate <style> block without scoped
37. Explanation: `:deep(.inner)` (formerly `::v-deep` or `/deep/`) bypasses the scoped boundary so a parent can target descendant elements rendered by children.
38. Q6: What does v-bind(themeColor) do inside <style>?
39. A) Compiles to a static value
40. B) Imports a Vue variable into CSS as a reactive custom property (*)
41. C) Throws a syntax error
42. D) Creates a new Vue directive
43. Explanation: `v-bind(varName)` in CSS compiles to a CSS custom property set on the component's root and updates reactively when the ref changes.
44. Q7: Which is the array syntax for :class?
45. A) :class="{ 'btn', 'btn-active' }"
46. B) :class="('btn', 'btn-active')"
47. C) :class="['btn', isActive && 'btn-active']" (*)
48. D) :class="<btn, btn-active>"
49. Explanation: Array syntax accepts a list of strings, refs, or objects (which are merged); falsy items are ignored.
50. Q8: Why might scoped CSS NOT style a child component's root element?
51. A) Because the child's root has a different data-v attribute
52. B) Because the child is in a different file
53. C) Because scoped CSS is broken in Vue 3
54. D) It actually DOES style the child's root automatically (*)
55. Explanation: By design, a parent's scoped styles DO affect the root element of a child component (the data-v attribute is applied to the child's root too).
56. Q9: What is the $style helper for?
57. A) Accessing classes defined in a <style module> block (*)
58. B) Inline styling
59. C) Importing Tailwind
60. D) A shortcut for :style
61. Explanation: `<style module>` enables CSS Modules; `$style.className` gives the scoped, hashed class name to use in the template.
62. Q10: Multi-value :style bindings like { display: ['-webkit-box', 'flex'] } are useful for what?
63. A) Animations
64. B) Vendor prefix fallbacks (*)
65. C) Responsive design
66. D) Theming
67. Explanation: An array value in `:style` emits multiple declarations so the browser uses the last one it supports — handy for vendor prefixes.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: 'What does :class="{ active: isActive }" do?'
  options:
    - Adds the class "active" only when isActive is truthy
    - Sets class="active"
    - Always removes "active"
    - Throws if isActive is false
  correctIndex: 0
  explanation: Object syntax adds each key whose value is truthy and removes it when falsy, reactively.
- id: q2
  question: How does :class merge with a static class="btn" attribute?
  options:
    - It replaces the static class
    - It merges — both static and dynamic classes apply
    - The static class wins
    - Vue throws an error
  correctIndex: 1
  explanation: Vue merges static `class` and `:class`; the element receives the union of both.
- id: q3
  question: Which is the correct object syntax for :style with a kebab-case property?
  options:
    - "{ font-size: '18px' }"
    - "{ 'fontSize' } = '18px'"
    - "{ 'font-size': '18px' }"
    - "{ fontsize: '18px' }"
  correctIndex: 2
  explanation: "JS object keys with hyphens must be quoted; `{ 'font-size': '18px' }` or camelCase `{ fontSize: '18px' }` both work."
- id: q4
  question: What does <style scoped> do?
  options:
    - Imports global CSS
    - Disables CSS for the component
    - Removes all specificity
    - Adds a data-v-xxxx attribute selector so styles only apply to the SFC's elements
  correctIndex: 3
  explanation: Scoped CSS adds a unique attribute to the SFC's elements and rewrites selectors to include `[data-v-xxxx]`, scoping the rules.
- id: q5
  question: How do you style a child component's inner element from a scoped parent?
  options:
    - Use :deep(.inner)
    - You cannot
    - Use !important
    - Use a separate <style> block without scoped
  correctIndex: 0
  explanation: "`:deep(.inner)` (formerly `::v-deep` or `/deep/`) bypasses the scoped boundary so a parent can target descendant elements rendered by children."
- id: q6
  question: What does v-bind(themeColor) do inside <style>?
  options:
    - Compiles to a static value
    - Imports a Vue variable into CSS as a reactive custom property
    - Throws a syntax error
    - Creates a new Vue directive
  correctIndex: 1
  explanation: "`v-bind(varName)` in CSS compiles to a CSS custom property set on the component's root and updates reactively when the ref changes."
- id: q7
  question: Which is the array syntax for :class?
  options:
    - :class="{ 'btn', 'btn-active' }"
    - :class="('btn', 'btn-active')"
    - :class="['btn', isActive && 'btn-active']"
    - :class="<btn, btn-active>"
  correctIndex: 2
  explanation: Array syntax accepts a list of strings, refs, or objects (which are merged); falsy items are ignored.
- id: q8
  question: Why might scoped CSS NOT style a child component's root element?
  options:
    - Because the child's root has a different data-v attribute
    - Because the child is in a different file
    - Because scoped CSS is broken in Vue 3
    - It actually DOES style the child's root automatically
  correctIndex: 3
  explanation: By design, a parent's scoped styles DO affect the root element of a child component (the data-v attribute is applied to the child's root too).
- id: q9
  question: What is the $style helper for?
  options:
    - Accessing classes defined in a <style module> block
    - Inline styling
    - Importing Tailwind
    - A shortcut for :style
  correctIndex: 0
  explanation: "`<style module>` enables CSS Modules; `$style.className` gives the scoped, hashed class name to use in the template."
- id: q10
  question: "Multi-value :style bindings like { display: ['-webkit-box', 'flex'] } are useful for what?"
  options:
    - Animations
    - Vendor prefix fallbacks
    - Responsive design
    - Theming
  correctIndex: 1
  explanation: An array value in `:style` emits multiple declarations so the browser uses the last one it supports — handy for vendor prefixes.
```

