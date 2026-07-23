---
slug: css-selectors-specificity
id: css-02
track: css
order: 2
title: Selectors and Specificity
description: Master the selector vocabulary (type, class, ID, attribute, combinators, pseudo) and the specificity algorithm that decides which rule wins. This stage is the foundation of every maintainable stylesheet.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=1L2YiWdaUDM&t=250s
whyItMatters: Master the selector vocabulary (type, class, ID, attribute, combinators, pseudo) and the specificity algorithm that decides which rule wins. This stage is the foundation of every maintainable stylesheet.
deepDiveResources:
  - label: W3Schools CSS
    url: https://www.w3schools.com/css/
    kind: course
  - label: CSS Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    kind: doc
---

# Selectors and Specificity

## Selectors and Specificity

### Why It Matters

Master the selector vocabulary (type, class, ID, attribute, combinators, pseudo) and the specificity algorithm that decides which rule wins. This stage is the foundation of every maintainable stylesheet.

Master the selector vocabulary (type, class, ID, attribute, combinators, pseudo) and the specificity algorithm that decides which rule wins. This stage is the foundation of every maintainable stylesheet.

### Prerequisites

- Stage 1: Getting Started with CSS
- Comfortable writing a basic rule with a class selector.

### Topics

- Type, class, ID, and universal selectors
- Attribute selectors: [attr], [attr=val], [attr^=], [attr$=], [attr*=], [attr~=]
- Descendant ( ), child (>), adjacent sibling (+), general sibling (~) combinators
- Pseudo-classes (:hover, :focus, :checked) vs pseudo-elements (::before, ::after)
- The specificity score (a, b, c, d) — IDs, classes/attrs/pseudo-classes, types/pseudo-elements
- Inline styles and !important
- :is(), :where(), and :has() and their specificity rules
- Specificity wars and how to defuse them

### Key Concepts

- Specificity is a 4-part score: (inline, IDs, classes/attrs/pseudo-classes, types/pseudo-elements).
- `!important` beats normal declarations; later `!important` beats earlier; inline beats author rules.
- :is() takes the highest specificity of its arguments; :where() always has 0 specificity.
- ID selectors (a=1) beat any number of class selectors; never use IDs for styling if you can help it.
- Pseudo-elements (::before) count as a type-level selector for specificity, not a class-level one.

### Common Pitfalls

- Styling with ID selectors (#header) — IDs create specificity you cannot override with classes; prefer classes for styling.
- Using !important to "win" — it escalates specificity wars; fix the cascade instead, or scope with :where().
- Forgetting that :is() takes the highest specificity of its arguments — :is(.btn, #x) inherits the ID specificity; use :where() for zero specificity.
- Writing long selector chains ("nav div ul li a") — fragile and high specificity; prefer a single class on the target.
- Misreading `~` vs `+` — `+` matches only the immediately following sibling; `~` matches all later siblings.

### Real-World Applications

- GitHub uses BEM-style class names so every selector is a single class (specificity 0,0,1,0), making overrides predictable.
- Stripe uses :where() in its design-system reset to ensure consumer overrides always win against base styles.
- Linear uses attribute selectors like `[data-state="open"]` in Radix UI primitives to style component state declaratively.
- Tailwind CSS compiles utility classes to single-class selectors, keeping specificity flat by design.

### Interview Questions

- 1. How is CSS specificity calculated? — As a 4-tuple (inline, IDs, classes/attrs/pseudo-classes, types/pseudo-elements); compare left-to-right.
- 2. What is the difference between :is() and :where()? — Both group selectors, but :where() has zero specificity while :is() takes the highest of its arguments.
- 3. Which wins: an ID selector or 100 class selectors? — The ID selector; specificity is not numeric sum but tuple comparison.
- 4. When should you use !important? — Rarely; legitimate uses include user-style overrides, third-party widget defaults, and accessibility guarantees.
- 5. What is the difference between `+` and `~` combinators? — `+` selects the immediately following sibling; `~` selects all following siblings.

### Mini Project

Build a Styled Navigation Bar: A horizontal nav with 5 links, hover state, active link, and a "new" badge on one item. Demonstrates type, class, attribute, pseudo-class, and pseudo-element selectors. Suggested approach:
  - Use a class .nav-link for base styles
  - Use [aria-current="page"] for the active link (specificity equal to a class)
  - Use :hover and :focus-visible for interactive states
  - Use ::after with content to render the "new" badge via an attribute
  - Verify each state in DevTools by toggling :hover and :focus-visible

### Exercises

1. Write four rules that all target the same paragraph and predict the winner by computing specificity before checking in DevTools.
2. Refactor a stylesheet that uses #id selectors to use classes; confirm overrides now work as expected.
3. Use :where() to write a zero-specificity reset and verify a single class can override it.
4. Style external links with `[href^="https://"]:not([href*="yoursite.com"])` and add an icon with ::after.
5. Write a :nth-child rule that highlights every 3rd item starting from the 2nd in a list.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which selector has the highest specificity?
9. A) .card
10. B) #header (*)
11. C) nav ul li
12. D) [href]
13. Explanation: An ID selector contributes (0,1,0,0) which beats any combination of classes, attributes, and types.
14. Q2: What is the specificity of `:where(.btn, #x)`?
15. A) (0,1,0,0)
16. B) (0,0,1,0)
17. C) (0,0,0,0) (*)
18. D) (1,0,0,0)
19. Explanation: :where() always has zero specificity regardless of its arguments.
20. Q3: Which combinator selects ONLY the immediately following sibling?
21. A) Adjacent sibling (+) (*)
22. B) Descendant (space)
23. C) Child (>)
24. D) General sibling (~)
25. Explanation: `h2 + p` matches a <p> that directly follows an <h2>; `~` would match all later <p>.
26. Q4: Which selector matches elements with a `data-open` attribute of any value?
27. A) [data-open="*"]
28. B) [data-open] (*)
29. C) [data-open~=any]
30. D) [data-open^=""]
31. Explanation: `[attr]` matches any element with the attribute present, regardless of value.
32. Q5: What does `a[href$=".pdf"]::after { content: " PDF"; }` do?
33. A) Adds " PDF" after every link
34. B) Sets the link href to .pdf
35. C) Adds " PDF" after only PDF links (*)
36. D) Underlines PDF links
37. Explanation: `$=` matches suffix, so this targets links whose href ends in .pdf and inserts the text via ::after.
38. Q6: Why should you avoid styling with ID selectors?
39. A) IDs are deprecated
40. B) They slow down the browser
41. C) They cannot be combined with classes
42. D) Their high specificity is hard to override with classes (*)
43. Explanation: An ID selector has specificity (0,1,0,0), beating any number of classes; this makes future overrides painful.
44. Q7: Which pseudo-element counts as a type-level selector for specificity?
45. A) ::before (*)
46. B) :hover
47. C) :first-child
48. D) :nth-child(2)
49. Explanation: Pseudo-elements (::before, ::after, ::first-line) add to the type slot, not the class slot.
50. Q8: Which is a legitimate use of !important?
51. A) Winning a specificity argument
52. B) A user-supplied accessibility stylesheet guaranteeing focus visibility (*)
53. C) Avoiding class names
54. D) Making a property "more inherited"
55. Explanation: !important is legitimate for user stylesheets (e.g., forced focus rings) where the user must override author styles.
56. Q9: Which selector matches every even-numbered row of a table body?
57. A) tbody tr:nth-child(odd)
58. B) tbody tr:even
59. C) tbody tr:nth-child(even) (*)
60. D) tbody tr:nth(2)
61. Explanation: `:nth-child(even)` matches rows 2, 4, 6, ... of each parent.
62. Q10: What is the specificity of `nav#top .item a:hover`?
63. A) (0,2,2,2)
64. B) (0,1,3,1)
65. C) (0,1,2,3)
66. D) (0,1,2,2) (*)
67. Explanation: One ID (#top) + two classes (.item, :hover) + two types (nav, a) = (0,1,2,2).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which selector has the highest specificity?
  options:
    - .card
    - "#header"
    - nav ul li
    - "[href]"
  correctIndex: 1
  explanation: An ID selector contributes (0,1,0,0) which beats any combination of classes, attributes, and types.
- id: q2
  question: "What is the specificity of `:where(.btn, #x)`?"
  options:
    - (0,1,0,0)
    - (0,0,1,0)
    - (0,0,0,0)
    - (1,0,0,0)
  correctIndex: 2
  explanation: :where() always has zero specificity regardless of its arguments.
- id: q3
  question: Which combinator selects ONLY the immediately following sibling?
  options:
    - Adjacent sibling (+)
    - Descendant (space)
    - Child (>)
    - General sibling (~)
  correctIndex: 0
  explanation: "`h2 + p` matches a <p> that directly follows an <h2>; `~` would match all later <p>."
- id: q4
  question: Which selector matches elements with a `data-open` attribute of any value?
  options:
    - '[data-open="*"]'
    - "[data-open]"
    - "[data-open~=any]"
    - '[data-open^=""]'
  correctIndex: 1
  explanation: "`[attr]` matches any element with the attribute present, regardless of value."
- id: q5
  question: 'What does `a[href$=".pdf"]::after { content: " PDF"; }` do?'
  options:
    - Adds " PDF" after every link
    - Sets the link href to .pdf
    - Adds " PDF" after only PDF links
    - Underlines PDF links
  correctIndex: 2
  explanation: "`$=` matches suffix, so this targets links whose href ends in .pdf and inserts the text via ::after."
- id: q6
  question: Why should you avoid styling with ID selectors?
  options:
    - IDs are deprecated
    - They slow down the browser
    - They cannot be combined with classes
    - Their high specificity is hard to override with classes
  correctIndex: 3
  explanation: An ID selector has specificity (0,1,0,0), beating any number of classes; this makes future overrides painful.
- id: q7
  question: Which pseudo-element counts as a type-level selector for specificity?
  options:
    - ::before
    - :hover
    - :first-child
    - :nth-child(2)
  correctIndex: 0
  explanation: Pseudo-elements (::before, ::after, ::first-line) add to the type slot, not the class slot.
- id: q8
  question: Which is a legitimate use of !important?
  options:
    - Winning a specificity argument
    - A user-supplied accessibility stylesheet guaranteeing focus visibility
    - Avoiding class names
    - Making a property "more inherited"
  correctIndex: 1
  explanation: "!important is legitimate for user stylesheets (e.g., forced focus rings) where the user must override author styles."
- id: q9
  question: Which selector matches every even-numbered row of a table body?
  options:
    - tbody tr:nth-child(odd)
    - tbody tr:even
    - tbody tr:nth-child(even)
    - tbody tr:nth(2)
  correctIndex: 2
  explanation: "`:nth-child(even)` matches rows 2, 4, 6, ... of each parent."
- id: q10
  question: What is the specificity of `nav#top .item a:hover`?
  options:
    - (0,2,2,2)
    - (0,1,3,1)
    - (0,1,2,3)
    - (0,1,2,2)
  correctIndex: 3
  explanation: One ID (#top) + two classes (.item, :hover) + two types (nav, a) = (0,1,2,2).
```

