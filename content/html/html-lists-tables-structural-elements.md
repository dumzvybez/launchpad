---
slug: html-lists-tables-structural-elements
id: html-04
track: html
order: 4
title: Lists, Tables, and Structural Elements
description: Organize content into lists, data tables, and structural containers. You will learn the difference between `<div>` and `<section>`, when a table is appropriate, and how to make tables accessible with `<caption>` and `scope`.
difficulty: beginner
estMinutes: 120
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=1100s
whyItMatters: Organize content into lists, data tables, and structural containers. You will learn the difference between `<div>` and `<section>`, when a table is appropriate, and how to make tables accessible with `<caption>` and `scope`.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# Lists, Tables, and Structural Elements

## Lists, Tables, and Structural Elements

### Why It Matters

Organize content into lists, data tables, and structural containers. You will learn the difference between `<div>` and `<section>`, when a table is appropriate, and how to make tables accessible with `<caption>` and `scope`.

Organize content into lists, data tables, and structural containers. You will learn the difference between `<div>` and `<section>`, when a table is appropriate, and how to make tables accessible with `<caption>` and `scope`.

### Prerequisites

- Stage 1: Getting Started with HTML
- Stage 2: Text Basics — Headings, Paragraphs, Formatting
- Stage 3: Links and Images

### Topics

- Unordered `<ul>`, ordered `<ol>`, and description `<dl>` lists
- List attributes: `start`, `reversed`, `type`, `value`
- Nested lists
- Table structure: `<table>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>`, `<td>`
- `<caption>`, `<colgroup>`, and `colspan`/`rowspan`
- The `scope` attribute on `<th>` for accessibility
- `<div>` and `<span>` as generic containers
- Structural semantic elements: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`, `<aside>`

### Key Concepts

- Lists imply semantic relationships; do not fake lists with `<div>` and bullet characters.
- Tables are for tabular data only — never for layout. Use CSS Grid or Flexbox for layout.
- `<th scope="col">` and `<th scope="row">` tell screen readers how header cells map to data cells.
- `<div>` is a generic container with no semantic meaning; reach for `<section>`, `<article>`, `<nav>`, etc., when they apply.
- `<section>` groups thematically related content with a heading; `<article>` is self-contained and distributable (a blog post, a product card).

```html
<ul>
  <li>Fruits
    <ul>
      <li>Apples</li>
      <li>Oranges</li>
    </ul>
  </li>
  <li>Vegetables</li>
</ul>

<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language</dd>
  <dt>CSS</dt>
  <dd>Cascading Style Sheets</dd>
</dl>
```
Caption: Nested list and description list

### Common Pitfalls

- Using tables for page layout — a 2005 anti-pattern; use CSS Grid or Flexbox. Tables are only for tabular data.
- Missing `scope` on `<th>` — screen readers cannot reliably associate headers with data cells; add `scope="col"` or `scope="row"`.
- Reaching for `<div>` when a semantic element exists — "div soup" hurts accessibility and SEO; use `<nav>`, `<main>`, `<section>`, etc.
- Faking lists with `<div>` and `•` characters — loses list semantics; screen reader users cannot navigate by list items.
- Missing `<caption>` on data tables — the caption is the table's accessible name; without it, screen reader users hear "table" with no context.

### Real-World Applications

- Wikipedia uses thousands of data tables for infoboxes (country stats, species taxonomy, etc.) across every article.
- GitHub's file browser renders repository trees as semantic tables with `<th scope="col">` headers for name, last commit, and time.
- MDN's browser-compatibility tables use `<table>` with `<caption>` and scoped headers so screen reader users can navigate cell by cell.
- The BBC homepage uses `<section>`, `<article>`, and `<aside>` rather than `<div>` for its news cards.

### Interview Questions

- 1. What is the difference between `<div>` and `<section>`? — `<div>` is a generic container with no semantics; `<section>` groups thematically related content and should include a heading.
- 2. When should you use `<dl>` instead of `<ul>`? — For name/value pairs (terms and definitions), like a glossary or metadata list; use `<ul>` for unordered items.
- 3. Why does `<th>` need a `scope` attribute? — It tells screen readers whether the header applies to a column or a row, enabling correct cell-to-header association.
- 4. What is "div soup"? — Overuse of `<div>` instead of semantic elements (`<nav>`, `<main>`, `<article>`), which damages accessibility and makes the document outline meaningless.
- 5. Should tables be used for layout? — No; tables are for tabular data. Use CSS Grid or Flexbox for layout. Tables-for-layout breaks accessibility and responsive design.

### Mini Project

Build a Pricing Page: A marketing page with a header, three pricing tiers in a structural layout, and a feature-comparison table. Focus on using semantic structural elements and an accessible comparison table. Suggested approach:
  - Use `<header>`, `<nav>`, `<main>`, and `<footer>` for the page skeleton
  - Inside `<main>`, use `<section>` for "Pricing Tiers" with three `<article>` cards
  - Each tier card has an `<h3>` name, `<p>` price, and `<ul>` of features
  - Below, build a `<table>` with `<caption>` comparing features across tiers
  - Add `scope="col"` and `scope="row"` to every `<th>`

### Exercises

1. Convert a `<div>`-based sidebar into `<aside aria-label="...">` and verify the landmark appears in the browser's accessibility tree.
2. Add a `<caption>` to an existing table and read the page with a screen reader to hear the difference.
3. Mark every `<th>` in a table with the appropriate `scope` and run axe DevTools to confirm zero table-related issues.
4. Replace a fake list (`<div>` with `•` text) with a proper `<ul>` and confirm screen reader list navigation now works.
5. Build a `<dl>` of metadata (author, published, updated) for an article and style it with CSS Grid.
6. >>> QUIZ (Stage 4) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which element is for unordered lists?
9. A) <ol>
10. B) <ul> (*)
11. C) <dl>
12. D) <list>
13. Explanation: `<ul>` is for unordered (bulleted) lists; `<ol>` is ordered (numbered), and `<dl>` is for description/name-value lists.
14. Q2: What is the purpose of the `scope` attribute on `<th>`?
15. A) It associates the header with a row or column for screen readers (*)
16. B) It sizes the cell
17. C) Italicizes the cell
18. D) It marks the cell as required
19. Explanation: `scope="col"` or `scope="row"` tells screen readers which cells the header applies to.
20. Q3: Which element should be used for page layout, NOT tables?
21. A) <table>
22. B) <tr>
23. C) <frame>
24. D) CSS Grid or Flexbox (*)
25. Explanation: Tables are for tabular data only; modern layout uses CSS Grid, Flexbox, or multi-column layout.
26. Q4: Which element provides an accessible name for a data table?
27. A) <caption> (*)
28. B) <title>
29. C) <summary>
30. D) <th>
31. Explanation: `<caption>` is the table's accessible name and is announced by screen readers when entering the table.
32. Q5: Which element groups self-contained, distributable content like a blog post?
33. A) <section>
34. B) <div>
35. C) <aside>
36. D) <article> (*)
37. Explanation: `<article>` is for self-contained content that could be syndicated (blog post, product card, news story).
38. Q6: What is "div soup"?
39. A) A CSS framework
40. B) A type of layout
41. C) Overusing <div> instead of semantic elements (*)
42. D) A meta tag
43. Explanation: "Div soup" is the anti-pattern of using `<div>` for everything, losing semantics and accessibility.
44. Q7: Which element holds the primary navigation?
45. A) <menu>
46. B) <navigation>
47. C) <nav> (*)
48. D) <links>
49. Explanation: `<nav>` is the semantic element for navigation; it is exposed as a navigation landmark to assistive tech.
50. Q8: Which list element is best for a glossary (term + definition pairs)?
51. A) <dl> (*)
52. B) <ul>
53. C) <ol>
54. D) <menu>
55. Explanation: `<dl>` (description list) with `<dt>` (term) and `<dd>` (definition) is the correct element for name/value pairs.
56. Q9: Where should the `<caption>` element appear inside a table?
57. A) At the very end
58. B) As the first child (*)
59. C) Inside <thead>
60. D) Anywhere in <tbody>
61. Explanation: `<caption>` must be the first child of `<table>` so screen readers announce it before the cells.
62. Q10: Which structural element marks the dominant content of the page?
63. A) <header>
64. B) <section>
65. C) <div>
66. D) <main> (*)
67. Explanation: `<main>` wraps the dominant content of the document; there should be only one `<main>` per page.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which element is for unordered lists?
  options:
    - <ol>
    - <ul>
    - <dl>
    - <list>
  correctIndex: 1
  explanation: "`<ul>` is for unordered (bulleted) lists; `<ol>` is ordered (numbered), and `<dl>` is for description/name-value lists."
- id: q2
  question: What is the purpose of the `scope` attribute on `<th>`?
  options:
    - It associates the header with a row or column for screen readers
    - It sizes the cell
    - Italicizes the cell
    - It marks the cell as required
  correctIndex: 0
  explanation: '`scope="col"` or `scope="row"` tells screen readers which cells the header applies to.'
- id: q3
  question: Which element should be used for page layout, NOT tables?
  options:
    - <table>
    - <tr>
    - <frame>
    - CSS Grid or Flexbox
  correctIndex: 3
  explanation: Tables are for tabular data only; modern layout uses CSS Grid, Flexbox, or multi-column layout.
- id: q4
  question: Which element provides an accessible name for a data table?
  options:
    - <caption>
    - <title>
    - <summary>
    - <th>
  correctIndex: 0
  explanation: "`<caption>` is the table's accessible name and is announced by screen readers when entering the table."
- id: q5
  question: Which element groups self-contained, distributable content like a blog post?
  options:
    - <section>
    - <div>
    - <aside>
    - <article>
  correctIndex: 3
  explanation: "`<article>` is for self-contained content that could be syndicated (blog post, product card, news story)."
- id: q6
  question: What is "div soup"?
  options:
    - A CSS framework
    - A type of layout
    - Overusing <div> instead of semantic elements
    - A meta tag
  correctIndex: 2
  explanation: '"Div soup" is the anti-pattern of using `<div>` for everything, losing semantics and accessibility.'
- id: q7
  question: Which element holds the primary navigation?
  options:
    - <menu>
    - <navigation>
    - <nav>
    - <links>
  correctIndex: 2
  explanation: "`<nav>` is the semantic element for navigation; it is exposed as a navigation landmark to assistive tech."
- id: q8
  question: Which list element is best for a glossary (term + definition pairs)?
  options:
    - <dl>
    - <ul>
    - <ol>
    - <menu>
  correctIndex: 0
  explanation: "`<dl>` (description list) with `<dt>` (term) and `<dd>` (definition) is the correct element for name/value pairs."
- id: q9
  question: Where should the `<caption>` element appear inside a table?
  options:
    - At the very end
    - As the first child
    - Inside <thead>
    - Anywhere in <tbody>
  correctIndex: 1
  explanation: "`<caption>` must be the first child of `<table>` so screen readers announce it before the cells."
- id: q10
  question: Which structural element marks the dominant content of the page?
  options:
    - <header>
    - <section>
    - <div>
    - <main>
  correctIndex: 3
  explanation: "`<main>` wraps the dominant content of the document; there should be only one `<main>` per page."
```

