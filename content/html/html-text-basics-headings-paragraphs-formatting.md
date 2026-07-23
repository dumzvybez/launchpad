---
slug: html-text-basics-headings-paragraphs-formatting
id: html-02
track: html
order: 2
title: Text Basics — Headings, Paragraphs, Formatting
description: Master the core text elements that make up 90% of article content. You will learn heading hierarchy, semantic emphasis, and the difference between presentational and meaningful formatting.
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=350s
whyItMatters: Master the core text elements that make up 90% of article content. You will learn heading hierarchy, semantic emphasis, and the difference between presentational and meaningful formatting.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# Text Basics — Headings, Paragraphs, Formatting

## Text Basics — Headings, Paragraphs, Formatting

### Why It Matters

Master the core text elements that make up 90% of article content. You will learn heading hierarchy, semantic emphasis, and the difference between presentational and meaningful formatting.

Master the core text elements that make up 90% of article content. You will learn heading hierarchy, semantic emphasis, and the difference between presentational and meaningful formatting.

### Prerequisites

- Stage 1: Getting Started with HTML
- A passing understanding of the document skeleton (head/body) and how to save and open an .html file.

### Topics

- Headings `<h1>` through `<h6>` and document outline
- Paragraphs `<p>` and whitespace handling
- Line break `<br>` and thematic break `<hr>`
- Strong importance `<strong>` vs bold `<b>`
- Emphasis `<em>` vs italic `<i>`
- Marked text `<mark>`, small `<small>`, sub/superscript
- Deleted `<del>` and inserted `<ins>`
- Quotations `<blockquote>`, `<q>`, and `<cite>`

### Key Concepts

- Headings form an outline; do not skip levels (no `<h1>` to `<h4>`).
- HTML collapses runs of whitespace into a single space; use `<pre>` to preserve it.
- `<strong>` and `<em>` carry meaning (importance, emphasis) and are preferred over `<b>` and `<i>` when semantics matter.
- `<b>` and `<i>` are still valid in HTML5 but are stylistically neutral — use them only when no semantic element fits (e.g., a ship name in italics).
- `<blockquote>` is a block-level quotation; `<q>` is inline and the browser inserts quotation marks.

```html
<h1>Page Title</h1>
<h2>Section One</h2>
<h3>Subsection 1.1</h3>
<h2>Section Two</h2>
<h3>Subsection 2.1</h3>
<h4>Detail under 2.1</h4>
```
Caption: Heading hierarchy

### Common Pitfalls

- Using `<br>` to add vertical spacing — use CSS `margin` instead; `<br>` is for meaningful line breaks like addresses or poems.
- Skipping heading levels (e.g., `<h1>` to `<h4>`) — breaks screen reader outline navigation; move through levels sequentially.
- Using `<b>`/`<i>` for emphasis — prefer `<strong>`/`<em>` which carry semantics; reserve `<b>`/`<i>` for stylistic-only cases with no semantic alternative.
- Multiple `<h1>` tags just for visual size — use one `<h1>` per page (or one per sectioning root); size with CSS, not by choosing a different heading level.
- Forgetting `<cite>` inside `<blockquote>` — the `cite` attribute is invisible to users; add a visible `<cite>` element so readers see the source.

### Real-World Applications

- Wikipedia articles use `<h1>` through `<h6>` for the table of contents and section navigation across 6M+ articles.
- Medium posts use `<blockquote>` to style pull-quotes and `<strong>`/`<em>` for editorial emphasis throughout every story.
- MDN reference pages nest headings inside `<article>` elements so the document outline maps cleanly to the page's table of contents.
- GitHub READMEs render `<code>` and `<pre>` for syntax-highlighted code blocks across millions of repositories.

### Interview Questions

- 1. What is the difference between `<strong>` and `<b>`? — `<strong>` indicates importance (semantic); `<b>` is stylistically bold without conveying importance, used as a last resort.
- 2. How do screen readers use headings? — They build a navigable outline so users can jump between sections; skipping levels or using headings for styling breaks this.
- 3. Why does HTML collapse whitespace? — Historical layout convention; runs of spaces, tabs, and newlines are rendered as a single space unless inside `<pre>`.
- 4. When should you use `<blockquote>` vs `<q>`? — `<blockquote>` for block-level quotations (multi-line, indented); `<q>` for inline quotations where the browser inserts quotation marks.
- 5. What does the `<cite>` element represent? — The title of a creative work (book, song, film) or the source of a quotation; use it inside `<blockquote>`'s `<footer>` for visible attribution.

### Mini Project

Build an Article Page: A single-page article about a topic you love with a title, byline, 3-5 sections of body text, a pull-quote, and inline code snippets. Focus on correct heading hierarchy and semantic formatting. Suggested approach:
  - Open with `<article>` containing an `<h1>` title and `<p>` byline
  - Add 3-5 `<h2>` sections, each with 2-3 `<p>` paragraphs
  - Include one `<blockquote>` with a `<cite>` attribution
  - Use `<strong>`, `<em>`, `<mark>`, and `<code>` at least once each
  - Validate at validator.w3.org and confirm no heading-level skips

### Exercises

1. Write a recipe page with `<h1>` recipe name, `<h2>` for Ingredients and Steps, and `<ul>` for ingredient lists.
2. Mark up a poem using `<pre>` so the line breaks and indentation are preserved exactly.
3. Convert a paragraph that uses bold/italic styling into one that uses `<strong>`/`<em>` where semantics apply.
4. Add a `<blockquote>` with the `cite` attribute AND a visible `<cite>` element to a quote you admire.
5. Use `<kbd>`, `<samp>`, and `<var>` to document a keyboard shortcut and its expected output.
6. >>> QUIZ (Stage 2) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: How many heading levels does HTML provide?
9. A) 6 (*)
10. B) 3
11. C) 5
12. D) 10
13. Explanation: HTML defines `<h1>` through `<h6>`, six levels of heading.
14. Q2: Which element conveys "strong importance" semantically?
15. A) <b>
16. B) <mark>
17. C) <u>
18. D) <strong> (*)
19. Explanation: `<strong>` indicates importance with semantic meaning; `<b>` is purely stylistic.
20. Q3: What does `<br>` represent?
21. A) A horizontal rule
22. B) A paragraph break
23. C) A line break (*)
24. D) A bold tag
25. Explanation: `<br>` produces a hard line break within a block; it is not for adding vertical spacing.
26. Q4: Which element preserves whitespace and line breaks exactly as written?
27. A) <p>
28. B) <span>
29. C) <pre> (*)
30. D) <code>
31. Explanation: `<pre>` preserves whitespace, tabs, and newlines; `<code>` alone does not.
32. Q5: Which element is appropriate for an inline quotation?
33. A) <blockquote>
34. B) <quote>
35. C) <q> (*)
36. D) <cite>
37. Explanation: `<q>` is for inline quotations; the browser automatically inserts the appropriate quotation marks.
38. Q6: Which is a common mistake when using headings?
39. A) Using <h1> as the page title
40. B) Using CSS to size them
41. C) Putting them in the body
42. D) Skipping heading levels like <h1> to <h4> (*)
43. Explanation: Skipping levels breaks the document outline screen readers use to navigate; move through h1 → h2 → h3 sequentially.
44. Q7: What does the `<del>` element represent?
45. A) A keyboard delete key
46. B) Deleted text, e.g., a removed price (*)
47. C) Bold text
48. D) A definition list item
49. Explanation: `<del>` marks text as removed, typically rendered with strikethrough; pair with `<ins>` to show edits.
50. Q8: When should you use `<i>` instead of `<em>`?
51. A) When emphasis is required
52. B) When the italic styling has no semantic emphasis, e.g., a ship name (*)
53. C) Never — `<i>` is deprecated
54. D) Only in tables
55. Explanation: `<i>` is valid in HTML5 for stylistically italic text with no emphasis semantics, such as taxonomic or ship names.
56. Q9: What does `<mark>` do?
57. A) Marks text as deleted
58. B) Highlights text as relevant, like a highlighter pen (*)
59. C) Adds a bookmark anchor
60. D) Underlines text
61. Explanation: `<mark>` highlights text as relevant in the current context, e.g., search-result matches; rendered with a yellow background by default.
62. Q10: Which element should wrap a code block to preserve formatting?
63. A) <pre><code> (*)
64. B) <code> alone
65. C) <blockquote><code>
66. D) <samp>
67. Explanation: `<pre>` preserves whitespace and `<code>` marks the content as code; together they render formatted code blocks correctly.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: How many heading levels does HTML provide?
  options:
    - "6"
    - "3"
    - "5"
    - "10"
  correctIndex: 0
  explanation: HTML defines `<h1>` through `<h6>`, six levels of heading.
- id: q2
  question: Which element conveys "strong importance" semantically?
  options:
    - <b>
    - <mark>
    - <u>
    - <strong>
  correctIndex: 3
  explanation: "`<strong>` indicates importance with semantic meaning; `<b>` is purely stylistic."
- id: q3
  question: What does `<br>` represent?
  options:
    - A horizontal rule
    - A paragraph break
    - A line break
    - A bold tag
  correctIndex: 2
  explanation: "`<br>` produces a hard line break within a block; it is not for adding vertical spacing."
- id: q4
  question: Which element preserves whitespace and line breaks exactly as written?
  options:
    - <p>
    - <span>
    - <pre>
    - <code>
  correctIndex: 2
  explanation: "`<pre>` preserves whitespace, tabs, and newlines; `<code>` alone does not."
- id: q5
  question: Which element is appropriate for an inline quotation?
  options:
    - <blockquote>
    - <quote>
    - <q>
    - <cite>
  correctIndex: 2
  explanation: "`<q>` is for inline quotations; the browser automatically inserts the appropriate quotation marks."
- id: q6
  question: Which is a common mistake when using headings?
  options:
    - Using <h1> as the page title
    - Using CSS to size them
    - Putting them in the body
    - Skipping heading levels like <h1> to <h4>
  correctIndex: 3
  explanation: Skipping levels breaks the document outline screen readers use to navigate; move through h1 → h2 → h3 sequentially.
- id: q7
  question: What does the `<del>` element represent?
  options:
    - A keyboard delete key
    - Deleted text, e.g., a removed price
    - Bold text
    - A definition list item
  correctIndex: 1
  explanation: "`<del>` marks text as removed, typically rendered with strikethrough; pair with `<ins>` to show edits."
- id: q8
  question: When should you use `<i>` instead of `<em>`?
  options:
    - When emphasis is required
    - When the italic styling has no semantic emphasis, e.g., a ship name
    - Never — `<i>` is deprecated
    - Only in tables
  correctIndex: 1
  explanation: "`<i>` is valid in HTML5 for stylistically italic text with no emphasis semantics, such as taxonomic or ship names."
- id: q9
  question: What does `<mark>` do?
  options:
    - Marks text as deleted
    - Highlights text as relevant, like a highlighter pen
    - Adds a bookmark anchor
    - Underlines text
  correctIndex: 1
  explanation: "`<mark>` highlights text as relevant in the current context, e.g., search-result matches; rendered with a yellow background by default."
- id: q10
  question: Which element should wrap a code block to preserve formatting?
  options:
    - <pre><code>
    - <code> alone
    - <blockquote><code>
    - <samp>
  correctIndex: 0
  explanation: "`<pre>` preserves whitespace and `<code>` marks the content as code; together they render formatted code blocks correctly."
```

