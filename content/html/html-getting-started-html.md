---
slug: html-getting-started-html
id: html-01
track: html
order: 1
title: Getting Started with HTML
description: Set up your first HTML document, learn the skeleton every page shares, and open it in a browser. This stage establishes the mental model of elements, tags, and attributes.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE
whyItMatters: Set up your first HTML document, learn the skeleton every page shares, and open it in a browser. This stage establishes the mental model of elements, tags, and attributes.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# Getting Started with HTML

## Getting Started with HTML

### Why It Matters

Set up your first HTML document, learn the skeleton every page shares, and open it in a browser. This stage establishes the mental model of elements, tags, and attributes.

Set up your first HTML document, learn the skeleton every page shares, and open it in a browser. This stage establishes the mental model of elements, tags, and attributes.

### Prerequisites

- None — this is the entry point for the HTML track.
- Basic computer literacy: a text editor (VS Code recommended) and a web browser.

### Topics

- What HTML is (markup, not programming) and where it fits in the web stack
- The minimal valid HTML5 document: doctype, html, head, body
- Elements vs tags vs attributes
- The lang attribute and charset meta
- The viewport meta tag for responsive rendering
- How browsers parse HTML (lenient but strict is better)
- Saving and opening .html files locally
- Viewing source and using DevTools Elements panel

### Key Concepts

- HTML describes structure and semantics; CSS describes appearance; JavaScript describes behavior.
- An element is the whole package (opening tag + content + closing tag); a tag is just the `<...>` marker.
- The doctype is `<!DOCTYPE html>` — case-insensitive but conventionally uppercase.
- Browsers render even broken HTML, but validation catches bugs and improves accessibility.
- The `<head>` holds metadata; the `<body>` holds visible content.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is my first HTML page.</p>
  </body>
</html>
```
Caption: Minimal valid HTML5 page

### Common Pitfalls

- Omitting `<!DOCTYPE html>` — triggers "quirks mode" in browsers, which renders using legacy non-standard box-model rules; always include it as the first line.
- Forgetting `<meta charset="utf-8">` — browsers may guess wrong and garble non-ASCII characters; declare it inside the first 1024 bytes of the document.
- Missing `<meta name="viewport" ...>` — mobile browsers render at a desktop width and zoom out, producing tiny text; include it on every page.
- Skipping the `lang` attribute on `<html>` — hurts screen reader pronunciation and SEO; set `<html lang="en">` (or the appropriate BCP 47 tag).
- Using uppercase tag names like `<BODY>` — valid but inconsistent with modern lowercase convention; stick to lowercase for readability and tooling compatibility.

### Real-World Applications

- MDN Web Docs serves every reference page as a hand-authored HTML document with strict validation and a known document outline.
- Wikipedia's article HTML is generated from wikitext but parsed and normalized to valid HTML5 for over 6 million English articles.
- GitHub renders every README.md as HTML inside a wrapper page, with the same doctype/charset/viewport trio you write here.
- The Web.dev site ships hand-tuned HTML with Lighthouse scores above 95 on every page.

### Interview Questions

- 1. What is the purpose of `<!DOCTYPE html>`? — It tells the browser to use standards mode rather than quirks mode; without it, layout falls back to legacy non-standard rules.
- 2. What is the difference between an element and a tag? — A tag is the `<...>` marker; an element is the whole package including content and any closing tag.
- 3. Why does the `<html>` element need a `lang` attribute? — It tells screen readers which pronunciation to use, helps search engines, and is required for valid HTML5.
- 4. What goes in `<head>` versus `<body>`? — Head holds metadata (title, charset, links, scripts); body holds everything the user sees.
- 5. Why must you include the viewport meta tag? — Without it, mobile browsers assume a 980px-wide viewport and zoom out, making text tiny and unusable on phones.

### Mini Project

Build a Personal Homepage: A single `index.html` file with a heading, a short bio paragraph, a list of three hobbies, and a footer with the current year. Open it in your browser and validate it at validator.w3.org. Suggested approach:
  - Start with the minimal HTML5 template above
  - Add an `<h1>` with your name and a `<p>` with one sentence about you
  - Use a `<ul>` with three `<li>` items for hobbies
  - Add a `<footer>` with `<small>&copy; 2024 Your Name</small>`
  - Run it through the W3C validator and fix any reported errors

### Exercises

1. Create `index.html` from scratch (no copy-paste) and open it in your browser without a server (just double-click the file).
2. View the source of your favorite website (Ctrl+U / Cmd+Opt+U) and identify the doctype, charset, and viewport tags.
3. Open DevTools (F12) and use the Elements panel to inspect and live-edit the `<h1>` text on a page.
4. Add an HTML comment describing what your page is for, then verify it doesn't appear on the rendered page.
5. Validate your homepage at validator.w3.org and fix every error and warning until it passes.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does HTML stand for?
9. A) Hyperlink Text Management Language
10. B) HyperText Markup Language (*)
11. C) High Technical Modern Language
12. D) Home Tool Markup Language
13. Explanation: HTML = HyperText Markup Language, the standard markup language for documents on the web.
14. Q2: Which line must appear first in a valid HTML5 document?
15. A) <html>
16. B) <!DOCTYPE html> (*)
17. C) <head>
18. D) <meta charset="utf-8">
19. Explanation: `<!DOCTYPE html>` must be the very first line; omitting it triggers quirks mode.
20. Q3: Where should the `<meta charset="utf-8">` tag go?
21. A) Inside the first 1024 bytes of the document, in the head (*)
22. B) At the end of the body
23. C) Anywhere in the document
24. D) In a separate .css file
25. Explanation: Browsers scan only the first 1024 bytes for charset; placing it later can cause a garbled re-parse.
26. Q4: Which element holds visible page content?
27. A) <head>
28. B) <meta>
29. C) <title>
30. D) <body> (*)
31. Explanation: The `<body>` element contains everything the user sees; `<head>` contains only metadata.
32. Q5: What is the role of the viewport meta tag?
33. A) It enables JavaScript
34. B) It styles the page
35. C) It controls layout on mobile devices (*)
36. D) It validates the HTML
37. Explanation: `meta name="viewport"` tells mobile browsers how to scale the page; without it they simulate a desktop width.
38. Q6: Which is a valid HTML comment?
39. A) // This is a comment
40. B) <!-- This is a comment --> (*)
41. C) # This is a comment
42. D) /* This is a comment */
43. Explanation: HTML comments use `<!-- ... -->` syntax; the other forms are JS/CSS/Python comments and have no effect in HTML.
44. Q7: What is an "element" in HTML?
45. A) The opening tag, content, and closing tag together (*)
46. B) Just the opening tag
47. C) A CSS class
48. D) A JavaScript variable
49. Explanation: An element is the full package: opening tag + content + closing tag (e.g., `<p>Hi</p>` is one element).
50. Q8: Why set `lang="en"` on the `<html>` element?
51. A) It translates the page automatically
52. B) It is required for HTML validation only
53. C) It sets the page's text color
54. D) It improves screen reader pronunciation and SEO (*)
55. Explanation: The lang attribute tells assistive tech which language to use for pronunciation and helps search engines serve localized results.
56. Q9: What happens if you omit `<!DOCTYPE html>`?
57. A) The page will not load at all
58. B) The page becomes valid XML
59. C) Browsers enter quirks mode with legacy non-standard layout (*)
60. D) Nothing changes
61. Explanation: Without the doctype, browsers use quirks mode, which emulates legacy IE5.5-era box model and table layout rules.
62. Q10: Which is the recommended editor for hand-authoring HTML?
63. A) A plain-text editor like VS Code (*)
64. B) Microsoft Word
65. C) Notepad with .doc extension
66. D) Adobe Photoshop
67. Explanation: HTML must be authored as plain text; rich-text editors like Word insert binary formatting that breaks the markup.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does HTML stand for?
  options:
    - Hyperlink Text Management Language
    - HyperText Markup Language
    - High Technical Modern Language
    - Home Tool Markup Language
  correctIndex: 1
  explanation: HTML = HyperText Markup Language, the standard markup language for documents on the web.
- id: q2
  question: Which line must appear first in a valid HTML5 document?
  options:
    - <html>
    - <!DOCTYPE html>
    - <head>
    - <meta charset="utf-8">
  correctIndex: 1
  explanation: "`<!DOCTYPE html>` must be the very first line; omitting it triggers quirks mode."
- id: q3
  question: Where should the `<meta charset="utf-8">` tag go?
  options:
    - Inside the first 1024 bytes of the document, in the head
    - At the end of the body
    - Anywhere in the document
    - In a separate .css file
  correctIndex: 0
  explanation: Browsers scan only the first 1024 bytes for charset; placing it later can cause a garbled re-parse.
- id: q4
  question: Which element holds visible page content?
  options:
    - <head>
    - <meta>
    - <title>
    - <body>
  correctIndex: 3
  explanation: The `<body>` element contains everything the user sees; `<head>` contains only metadata.
- id: q5
  question: What is the role of the viewport meta tag?
  options:
    - It enables JavaScript
    - It styles the page
    - It controls layout on mobile devices
    - It validates the HTML
  correctIndex: 2
  explanation: '`meta name="viewport"` tells mobile browsers how to scale the page; without it they simulate a desktop width.'
- id: q6
  question: Which is a valid HTML comment?
  options:
    - // This is a comment
    - <!-- This is a comment -->
    - "# This is a comment"
    - /* This is a comment */
  correctIndex: 1
  explanation: HTML comments use `<!-- ... -->` syntax; the other forms are JS/CSS/Python comments and have no effect in HTML.
- id: q7
  question: What is an "element" in HTML?
  options:
    - The opening tag, content, and closing tag together
    - Just the opening tag
    - A CSS class
    - A JavaScript variable
  correctIndex: 0
  explanation: "An element is the full package: opening tag + content + closing tag (e.g., `<p>Hi</p>` is one element)."
- id: q8
  question: Why set `lang="en"` on the `<html>` element?
  options:
    - It translates the page automatically
    - It is required for HTML validation only
    - It sets the page's text color
    - It improves screen reader pronunciation and SEO
  correctIndex: 3
  explanation: The lang attribute tells assistive tech which language to use for pronunciation and helps search engines serve localized results.
- id: q9
  question: What happens if you omit `<!DOCTYPE html>`?
  options:
    - The page will not load at all
    - The page becomes valid XML
    - Browsers enter quirks mode with legacy non-standard layout
    - Nothing changes
  correctIndex: 2
  explanation: Without the doctype, browsers use quirks mode, which emulates legacy IE5.5-era box model and table layout rules.
- id: q10
  question: Which is the recommended editor for hand-authoring HTML?
  options:
    - A plain-text editor like VS Code
    - Microsoft Word
    - Notepad with .doc extension
    - Adobe Photoshop
  correctIndex: 0
  explanation: HTML must be authored as plain text; rich-text editors like Word insert binary formatting that breaks the markup.
```

