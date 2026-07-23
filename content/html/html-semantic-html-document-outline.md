---
slug: html-semantic-html-document-outline
id: html-06
track: html
order: 6
title: Semantic HTML and Document Outline
description: Use semantic elements to give your page a meaningful structure that screen readers, search engines, and developer tools can navigate. This stage formalizes the document outline and the role each landmark plays.
difficulty: beginner
estMinutes: 150
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=1900s
whyItMatters: Use semantic elements to give your page a meaningful structure that screen readers, search engines, and developer tools can navigate. This stage formalizes the document outline and the role each landmark plays.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# Semantic HTML and Document Outline

## Semantic HTML and Document Outline

### Why It Matters

Use semantic elements to give your page a meaningful structure that screen readers, search engines, and developer tools can navigate. This stage formalizes the document outline and the role each landmark plays.

Use semantic elements to give your page a meaningful structure that screen readers, search engines, and developer tools can navigate. This stage formalizes the document outline and the role each landmark plays.

### Prerequisites

- Stage 1: Getting Started with HTML
- Stage 4: Lists, Tables, and Structural Elements
- Stage 5: Forms and Input Elements

### Topics

- Document outline and the single `<h1>` convention
- Sectioning roots: `<article>`, `<section>`, `<aside>`, `<nav>`
- Landmark elements: `<header>`, `<main>`, `<footer>`, `<search>`
- `<address>` for contact information
- `<time>` with the `datetime` attribute
- `<figure>` and `<figcaption>` as sectioning roots
- ARIA landmark roles vs native semantic elements
- `aria-label` and `aria-labelledby` for distinguishing multiple navs

### Key Concepts

- Semantic elements carry implicit ARIA roles (e.g., `<nav>` → `role="navigation"`); add explicit ARIA only when needed.
- There should be exactly one `<main>` element per page, marking the dominant content.
- `<article>` is self-contained and distributable; `<section>` is a thematic grouping with a heading.
- The `<time>` element's `datetime` attribute provides a machine-readable timestamp while the content is human-readable.
- When you have multiple landmarks of the same type (two `<nav>` elements), give each a unique `aria-label`.

```html
<body>
  <header>
    <a href="/"><img src="logo.svg" alt="Acme Co."></a>
    <nav aria-label="Primary">
      <ul><li><a href="/">Home</a></li><li><a href="/blog">Blog</a></li></ul>
    </nav>
  </header>
  <main>
    <article>
      <header>
        <h1>Article Title</h1>
        <p>Published <time datetime="2024-09-15">Sep 15, 2024</time></p>
      </header>
      <section><h2>Introduction</h2><p>...</p></section>
      <section><h2>Body</h2><p>...</p></section>
    </article>
  </main>
  <footer>
    <address>Contact: <a href="mailto:hello@acme.co">hello@acme.co</a></address>
    <p>&copy; 2024 Acme Co.</p>
  </footer>
</body>
```
Caption: Full semantic page skeleton

### Common Pitfalls

- Multiple `<main>` elements on a page — invalid HTML; there must be exactly one `<main>` per page (or per sectioning root like a dialog).
- Using `<section>` without a heading — `<section>` requires a heading to be valid; if there's no heading, use a `<div>`.
- Adding redundant `role="navigation"` to `<nav>` — the ARIA role is implicit; redundant ARIA is a code smell (ARIA rule #1: don't override native semantics).
- Using `<address>` for physical mailing addresses only — `<address>` is specifically for contact information for the document or article author; physical addresses should use `<p>` or schema.org PostalAddress.
- Multiple `<nav>` elements with no distinguishing `aria-label` — screen readers list "navigation" multiple times with no way to tell them apart; label each uniquely.

### Real-World Applications

- The New York Times article pages use `<article>` with nested `<header>`, `<time>`, `<section>` elements for every story.
- Gov.uk uses `<main>` with `id="content"` and a "Skip to main content" link on every public service page.
- MDN wraps each reference page in `<main>` with `<article>` inside, plus `<aside>` for the "In this article" sidebar.
- Apple's product pages use `<section>` landmarks so screen reader users can jump between product features.

### Interview Questions

- 1. What is the difference between `<section>` and `<article>`? — `<article>` is self-contained and distributable (a blog post); `<section>` is a thematic grouping within a larger document.
- 2. How many `<main>` elements can a page have? — Exactly one (excluding those inside detached documents like `<dialog>` or `<iframe>`).
- 3. What does the `<address>` element represent? — Contact information for the author/owner of the document or article, not arbitrary physical addresses.
- 4. Why does `<nav>` already have `role="navigation"`? — Semantic elements have implicit ARIA roles; adding `role="navigation"` explicitly is redundant.
- 5. What is the document outline? — The hierarchical structure formed by headings and sectioning elements, which screen readers expose for navigation.

### Mini Project

Build a Blog Homepage: A semantic blog index page with a header containing primary nav, a main area listing 3-5 article previews (each an `<article>` with header, time, and excerpt), and a footer with contact info. Suggested approach:
  - Use `<header>`, `<nav aria-label="Primary">`, `<main>`, `<footer>`
  - Each article preview uses `<article>` with `<header>` containing `<h2>` and `<time datetime="...">`
  - Add a `<search>` landmark in the header for a site search form
  - Use `<aside aria-label="Newsletter signup">` for a sidebar call-to-action
  - Include a "Skip to main content" link as the first focusable element

### Exercises

1. Open your page in a screen reader (VoiceOver/NVDA) and use the landmark menu to jump between regions.
2. Run the page through the W3C validator and confirm there is exactly one `<main>`.
3. Replace a `<div class="nav">` with `<nav>` and remove the redundant `role="navigation"`.
4. Add `aria-label="Footer"` to a footer that contains secondary nav so it is distinguishable.
5. Convert a `<p>Published on Sep 15, 2024</p>` to use `<time datetime="2024-09-15">`.
6. >>> QUIZ (Stage 6) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How many `<main>` elements should a typical page have?
9. A) Zero
10. B) Up to three
11. C) Exactly one (*)
12. D) Unlimited
13. Explanation: A page should have exactly one `<main>` element representing its dominant content; multiple `<main>` is invalid.
14. Q2: Which element is for self-contained, distributable content like a blog post?
15. A) <section>
16. B) <article> (*)
17. C) <div>
18. D) <aside>
19. Explanation: `<article>` is for self-contained content that could be syndicated independently (a blog post, product card, news story).
20. Q3: What does the `<address>` element represent?
21. A) Any physical location
22. B) A postal address book entry
23. C) Contact information for the document or article author (*)
24. D) A map embed
25. Explanation: `<address>` is specifically for contact information of the document/article author, not arbitrary physical addresses.
26. Q4: Why should you NOT add `role="navigation"` to a `<nav>` element?
27. A) It is invalid HTML
28. B) It breaks screen readers
29. C) It disables the nav
30. D) It is redundant; the role is implicit (*)
31. Explanation: ARIA rule #1 says: don't add a role that duplicates native semantics. `<nav>` already implies `role="navigation"`.
32. Q5: Which element provides a machine-readable timestamp?
33. A) <date>
34. B) <timestamp>
35. C) <meta name="date">
36. D) <time> with datetime attribute (*)
37. Explanation: `<time datetime="2024-09-15">` provides both a human-readable content and a machine-readable ISO timestamp.
38. Q6: What is required inside a `<section>` element for valid semantics?
39. A) A <p>
40. B) An image
41. C) A heading (h2-h6) (*)
42. D) A list
43. Explanation: `<section>` should always contain a heading; without one, use a `<div>` instead.
44. Q7: How do you distinguish two `<nav>` elements for screen reader users?
45. A) Use different colors
46. B) Add unique aria-label to each (*)
47. C) Add different CSS classes
48. D) You cannot
49. Explanation: `aria-label="Primary"` and `aria-label="Footer"` let screen reader users tell multiple nav landmarks apart.
50. Q8: Which landmark element is new in HTML (2023) for site search?
51. A) <search> (*)
52. B) <find>
53. C) <query>
54. D) <lookup>
55. Explanation: The `<search>` element was added to HTML in 2023 to wrap search/filter forms as a navigation landmark.
56. Q9: What does the document outline describe?
57. A) The CSS box model
58. B) The hierarchical heading and sectioning structure (*)
59. C) The DOM tree
60. D) The viewport size
61. Explanation: The document outline is the heading/section hierarchy that screen readers expose for in-page navigation.
62. Q10: Where should a "Skip to main content" link appear?
63. A) As the first focusable element in the body (*)
64. B) In the footer
65. C) Inside <main>
66. D) In the <head>
67. Explanation: The skip link should be the first focusable element so keyboard users can bypass repetitive nav and jump straight to main content.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How many `<main>` elements should a typical page have?
  options:
    - Zero
    - Up to three
    - Exactly one
    - Unlimited
  correctIndex: 2
  explanation: A page should have exactly one `<main>` element representing its dominant content; multiple `<main>` is invalid.
- id: q2
  question: Which element is for self-contained, distributable content like a blog post?
  options:
    - <section>
    - <article>
    - <div>
    - <aside>
  correctIndex: 1
  explanation: "`<article>` is for self-contained content that could be syndicated independently (a blog post, product card, news story)."
- id: q3
  question: What does the `<address>` element represent?
  options:
    - Any physical location
    - A postal address book entry
    - Contact information for the document or article author
    - A map embed
  correctIndex: 2
  explanation: "`<address>` is specifically for contact information of the document/article author, not arbitrary physical addresses."
- id: q4
  question: Why should you NOT add `role="navigation"` to a `<nav>` element?
  options:
    - It is invalid HTML
    - It breaks screen readers
    - It disables the nav
    - It is redundant; the role is implicit
  correctIndex: 3
  explanation: "ARIA rule #1 says: don't add a role that duplicates native semantics. `<nav>` already implies `role=\"navigation\"`."
- id: q5
  question: Which element provides a machine-readable timestamp?
  options:
    - <date>
    - <timestamp>
    - <meta name="date">
    - <time> with datetime attribute
  correctIndex: 3
  explanation: '`<time datetime="2024-09-15">` provides both a human-readable content and a machine-readable ISO timestamp.'
- id: q6
  question: What is required inside a `<section>` element for valid semantics?
  options:
    - A <p>
    - An image
    - A heading (h2-h6)
    - A list
  correctIndex: 2
  explanation: "`<section>` should always contain a heading; without one, use a `<div>` instead."
- id: q7
  question: How do you distinguish two `<nav>` elements for screen reader users?
  options:
    - Use different colors
    - Add unique aria-label to each
    - Add different CSS classes
    - You cannot
  correctIndex: 1
  explanation: '`aria-label="Primary"` and `aria-label="Footer"` let screen reader users tell multiple nav landmarks apart.'
- id: q8
  question: Which landmark element is new in HTML (2023) for site search?
  options:
    - <search>
    - <find>
    - <query>
    - <lookup>
  correctIndex: 0
  explanation: The `<search>` element was added to HTML in 2023 to wrap search/filter forms as a navigation landmark.
- id: q9
  question: What does the document outline describe?
  options:
    - The CSS box model
    - The hierarchical heading and sectioning structure
    - The DOM tree
    - The viewport size
  correctIndex: 1
  explanation: The document outline is the heading/section hierarchy that screen readers expose for in-page navigation.
- id: q10
  question: Where should a "Skip to main content" link appear?
  options:
    - As the first focusable element in the body
    - In the footer
    - Inside <main>
    - In the <head>
  correctIndex: 0
  explanation: The skip link should be the first focusable element so keyboard users can bypass repetitive nav and jump straight to main content.
```

