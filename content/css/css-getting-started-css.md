---
slug: css-getting-started-css
id: css-01
track: css
order: 1
title: Getting Started with CSS
description: Set up your first stylesheet, learn the three ways to apply CSS, and understand the cascade. This stage establishes the mental model of rules, selectors, declarations, and how styles reach elements.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=1L2YiWdaUDM
whyItMatters: Set up your first stylesheet, learn the three ways to apply CSS, and understand the cascade. This stage establishes the mental model of rules, selectors, declarations, and how styles reach elements.
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# Getting Started with CSS

## Getting Started with CSS

### Why It Matters

Set up your first stylesheet, learn the three ways to apply CSS, and understand the cascade. This stage establishes the mental model of rules, selectors, declarations, and how styles reach elements.

Set up your first stylesheet, learn the three ways to apply CSS, and understand the cascade. This stage establishes the mental model of rules, selectors, declarations, and how styles reach elements.

### Prerequisites

- None — basic HTML knowledge is helpful (know what an element, attribute, and class are).
- A text editor (VS Code recommended) and a modern browser with DevTools.

### Topics

- What CSS is and where it fits in the web platform
- The three ways to apply CSS: inline, internal, external
- Anatomy of a rule: selector, declaration block, property, value
- Linking an external stylesheet with <link rel="stylesheet">
- Comments in CSS
- The cascade: origin, importance, specificity, order
- Inheritance: which properties inherit and which do not
- Using DevTools Elements panel to inspect and tweak styles

### Key Concepts

- CSS describes presentation; HTML describes structure; JS describes behavior.
- A rule = selector + declaration block; a declaration = property: value.
- The cascade resolves conflicts using origin > importance > specificity > order.
- Inherited properties (color, font-*) propagate from parent to child; box model properties do not.
- External stylesheets are cached, shared across pages, and almost always the right choice.

```html
<!-- 1. External (preferred) -->
<link rel="stylesheet" href="styles.css">

<!-- 2. Internal (per-page overrides) -->
<style>
  body { font-family: system-ui, sans-serif; }
</style>

<!-- 3. Inline (avoid; cannot use most selectors) -->
<p style="color: rebeccapurple;">Hello</p>
```
Caption: Three ways to apply CSS

### Common Pitfalls

- Using inline styles for everything — keep styles in external .css files so they are cacheable, shareable, and selectable.
- Forgetting to link the stylesheet (typo in href, wrong path) — open DevTools > Network and confirm styles.css returns 200, not 404.
- Typing a property name wrong (e.g., "colour" instead of "color") — the browser silently ignores unknown declarations; check the DevTools warning.
- Confusing "cascading" with "object-oriented inheritance" — the cascade picks one winning declaration per property; it is not a prototype chain.
- Putting a semicolon inside the value instead of after the declaration (e.g., `color: "red;";`) — use a single semicolon to terminate each declaration.

### Real-World Applications

- GitHub's UI is rendered with a compiled CSS bundle (Primer) that every page links once and the browser caches across navigation.
- Stripe's marketing site uses external stylesheets scoped per template so designers can ship a new campaign without redeploying the app shell.
- Apple's product pages use a single critical-CSS block inlined in <head> for above-the-fold hero content, then async-load the full stylesheet.
- Vercel's dashboard uses CSS Modules that compile to external stylesheets, scoped per component to avoid global collisions.

### Interview Questions

- 1. What does "cascading" mean in CSS? — Conflicts between rules are resolved by origin, importance, specificity, and source order, with the later rules winning ties.
- 2. Name the three ways to include CSS in a page and when to use each. — External (default), internal <style> (per-page overrides), inline (rare; for email or one-off overrides).
- 3. What is the difference between a property and a declaration? — A property is a name (color); a declaration is a property:value pair (color: red).
- 4. Which properties inherit by default? Give three examples. — color, font-family, line-height, text-align, letter-spacing, list-style, visibility.
- 5. How do you inspect which rule won for a given element? — Right-click > Inspect; in the Styles pane, rules are listed in cascade order; struck-through declarations were overridden.

### Mini Project

Build a Personal Bio Page: A single-page HTML file with an external styles.css that styles a name, photo, bio, and three link buttons. The page takes an external stylesheet link and outputs a styled bio viewable in any browser. Suggested approach:
  - Create index.html with semantic markup (header, main, footer)
  - Create styles.css and link it via <link rel="stylesheet">
  - Use the body, p, a, h1, h2 selectors to apply base styles
  - Add a wrapper <div class="bio"> to scope styles with a class selector
  - Verify in DevTools that no declarations are struck through unexpectedly

### Exercises

1. Create index.html and styles.css; link them; verify the Network tab shows styles.css as 200.
2. Style the body with `font-family: system-ui, sans-serif;` and `color: #222;` and observe inheritance on paragraphs.
3. Add an inline style on one paragraph that overrides the inherited color; explain the cascade in a comment.
4. Use DevTools to edit a color live, then copy the final value back into your stylesheet.
5. >>> QUIZ (Stage 1) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: What does CSS stand for?
8. A) Cascading Style Sheets (*)
9. B) Creative Style Sheets
10. C) Computer Style Syntax
11. D) Colorful Style Sheets
12. Explanation: CSS stands for Cascading Style Sheets; "cascading" refers to how conflicting rules are resolved.
13. Q2: Which method of including CSS is preferred for most projects?
14. A) Inline style attributes
15. B) External stylesheets (*)
16. C) Internal <style> blocks
17. D) JavaScript-inserted styles
18. Explanation: External stylesheets are cached, shared across pages, and selectable by every element on the site.
19. Q3: Which HTML element links an external stylesheet?
20. A) <link rel="stylesheet"> (*)
21. B) <script>
22. C) <css>
23. D) <style>
24. Explanation: `<link rel="stylesheet" href="...">` in the <head> links an external .css file.
25. Q4: What is the smallest unit of CSS that pairs a property with a value?
26. A) A rule
27. B) A declaration (*)
28. C) A selector
29. D) An at-rule
30. Explanation: A declaration is one "property: value;" pair; a rule is the selector plus its declaration block.
31. Q5: Which of the following properties is inherited by default?
32. A) border
33. B) margin
34. C) color (*)
35. D) width
36. Explanation: `color` inherits; box-model properties like `border`, `margin`, and `width` do not.
37. Q6: When two rules conflict, which order does the cascade use to pick a winner?
38. A) Importance > order > specificity > origin
39. B) Specificity > importance > origin > order
40. C) Order > specificity > importance > origin
41. D) Origin > importance > specificity > order (*)
42. Explanation: The cascade first groups by origin/importance, then resolves by specificity, finally by source order.
43. Q7: What does it mean when a declaration is shown with strikethrough in DevTools?
44. A) The declaration was overridden by another rule in the cascade (*)
45. B) The declaration is deprecated
46. C) The declaration is invalid syntax
47. D) The declaration is commented out
48. Explanation: Strikethrough means the declaration lost the cascade and is not applied.
49. Q8: How do you write a CSS comment?
50. A) // comment
51. B) /* comment */ (*)
52. C) # comment
53. D) <!-- comment -->
54. Explanation: CSS uses C-style block comments `/* ... */`; // is not a comment in plain CSS (it is in some preprocessors).
55. Q9: Which DevTools pane shows the final resolved value of every property on an element?
56. A) Elements
57. B) Sources
58. C) Computed (*)
59. D) Network
60. Explanation: The Computed pane shows the final computed value after the cascade and inheritance have resolved.
61. Q10: Why should you avoid inline styles for primary styling?
62. A) They are deprecated
63. B) They are slower to parse
64. C) They only work in Chrome
65. D) They are not selectable, not cacheable, and not shareable across pages (*)
66. Explanation: Inline styles cannot use selectors, are not cached separately, and are hard to maintain at scale.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does CSS stand for?
  options:
    - Cascading Style Sheets
    - Creative Style Sheets
    - Computer Style Syntax
    - Colorful Style Sheets
  correctIndex: 0
  explanation: CSS stands for Cascading Style Sheets; "cascading" refers to how conflicting rules are resolved.
- id: q2
  question: Which method of including CSS is preferred for most projects?
  options:
    - Inline style attributes
    - External stylesheets
    - Internal <style> blocks
    - JavaScript-inserted styles
  correctIndex: 1
  explanation: External stylesheets are cached, shared across pages, and selectable by every element on the site.
- id: q3
  question: Which HTML element links an external stylesheet?
  options:
    - <link rel="stylesheet">
    - <script>
    - <css>
    - <style>
  correctIndex: 0
  explanation: '`<link rel="stylesheet" href="...">` in the <head> links an external .css file.'
- id: q4
  question: What is the smallest unit of CSS that pairs a property with a value?
  options:
    - A rule
    - A declaration
    - A selector
    - An at-rule
  correctIndex: 1
  explanation: 'A declaration is one "property: value;" pair; a rule is the selector plus its declaration block.'
- id: q5
  question: Which of the following properties is inherited by default?
  options:
    - border
    - margin
    - color
    - width
  correctIndex: 2
  explanation: "`color` inherits; box-model properties like `border`, `margin`, and `width` do not."
- id: q6
  question: When two rules conflict, which order does the cascade use to pick a winner?
  options:
    - Importance > order > specificity > origin
    - Specificity > importance > origin > order
    - Order > specificity > importance > origin
    - Origin > importance > specificity > order
  correctIndex: 3
  explanation: The cascade first groups by origin/importance, then resolves by specificity, finally by source order.
- id: q7
  question: What does it mean when a declaration is shown with strikethrough in DevTools?
  options:
    - The declaration was overridden by another rule in the cascade
    - The declaration is deprecated
    - The declaration is invalid syntax
    - The declaration is commented out
  correctIndex: 0
  explanation: Strikethrough means the declaration lost the cascade and is not applied.
- id: q8
  question: How do you write a CSS comment?
  options:
    - // comment
    - /* comment */
    - "# comment"
    - <!-- comment -->
  correctIndex: 1
  explanation: CSS uses C-style block comments `/* ... */`; // is not a comment in plain CSS (it is in some preprocessors).
- id: q9
  question: Which DevTools pane shows the final resolved value of every property on an element?
  options:
    - Elements
    - Sources
    - Computed
    - Network
  correctIndex: 2
  explanation: The Computed pane shows the final computed value after the cascade and inheritance have resolved.
- id: q10
  question: Why should you avoid inline styles for primary styling?
  options:
    - They are deprecated
    - They are slower to parse
    - They only work in Chrome
    - They are not selectable, not cacheable, and not shareable across pages
  correctIndex: 3
  explanation: Inline styles cannot use selectors, are not cached separately, and are hard to maintain at scale.
```

