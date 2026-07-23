---
slug: html-microdata-rdfa-structured-data
id: html-14
track: html
order: 14
title: Microdata, RDFa, and Structured Data
description: Help search engines and social platforms understand your content. This stage covers schema.org vocabularies, JSON-LD (the recommended format), microdata, and RDFa, plus how structured data powers rich results.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=5100s
whyItMatters: Help search engines and social platforms understand your content. This stage covers schema.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# Microdata, RDFa, and Structured Data

## Microdata, RDFa, and Structured Data

### Why It Matters

Help search engines and social platforms understand your content. This stage covers schema.

Help search engines and social platforms understand your content. This stage covers schema.org vocabularies, JSON-LD (the recommended format), microdata, and RDFa, plus how structured data powers rich results.

### Prerequisites

- Stage 6: Semantic HTML and Document Outline
- Stage 10: Metadata, SEO, and Open Graph

### Topics

- schema.org types: `Article`, `Product`, `Recipe`, `Event`, `Organization`, `Person`, `BreadcrumbList`, `FAQPage`
- JSON-LD: `<script type="application/ld+json">` blocks (recommended format)
- Microdata: `itemscope`, `itemtype`, `itemprop`
- RDFa: `vocab`, `typeof`, `property`
- Rich result eligibility in Google Search
- Required vs recommended properties per schema type
- Testing with Google's Rich Results Test and Schema.org Validator
- Avoiding structured data spam penalties

### Key Concepts

- JSON-LD is Google's preferred format because it separates data from markup and is easy to generate server-side.
- Structured data does not guarantee a rich result; it makes you eligible, and Google decides based on quality and relevance.
- Only mark up visible content; hidden structured data that doesn't match what users see can trigger a manual action.
- Use the most specific schema type available (e.g., `BlogPosting` extends `Article`).
- BreadcrumbList structured data powers breadcrumb displays in search results.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "How to Bake Sourdough Bread",
  "image": "https://acme.example/img/sourdough.jpg",
  "datePublished": "2024-09-15",
  "dateModified": "2024-09-20",
  "author": { "@type": "Person", "name": "Ada Lovelace" },
  "publisher": {
    "@type": "Organization",
    "name": "Acme Bakery",
    "logo": { "@type": "ImageObject", "url": "https://acme.example/logo.png" }
  },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://acme.example/recipes/sourdough" }
}
</script>
```
Caption: JSON-LD for an article

### Common Pitfalls

- Marking up content not visible on the page — Google may issue a manual action; structured data should describe what users see.
- Mixing JSON-LD and microdata for the same entity — pick one format per entity to avoid duplicate/conflicting data.
- Putting JSON-LD in `<body>` when it could go in `<head>` — valid either way, but head placement is conventional and parsed earlier.
- Using the wrong schema type (e.g., `Article` when `BlogPosting` fits) — use the most specific type to qualify for the most rich results.
- Forgetting required properties — Google requires `headline`, `datePublished`, `author`, `image` for Article rich results; omitting them disqualifies the page.

### Real-World Applications

- AllRecipes and BBC Good Food mark up every recipe with `Recipe` schema to power Google's recipe carousel with cook time, ratings, and ingredients.
- Eventbrite uses `Event` structured data so Google Search shows event listings with date, location, and ticket links.
- IMDb uses `Movie` and `Review` schema to power rich results with ratings, cast, and review snippets.
- Wikipedia's infoboxes use microdata and RDFa so search engines can surface country stats, species taxonomy, and other facts.

### Interview Questions

- 1. Which structured data format does Google recommend? — JSON-LD, because it separates data from markup and is easy to generate server-side.
- 2. What does schema.org provide? — A shared vocabulary of types and properties (e.g., `Recipe.cookTime`) that search engines and other consumers agree on.
- 3. Does structured data guarantee a rich result? — No; it makes you eligible. Google's algorithms decide whether to show a rich result based on quality and relevance.
- 4. What is `BreadcrumbList` for? — Powers breadcrumb trails in search results, helping users understand page hierarchy.
- 5. Should structured data describe hidden content? — No; only mark up visible content. Marking up hidden or mismatched content can trigger a manual penalty.

### Mini Project

Build a Recipe Page with Structured Data: A recipe page with visible name, image, ingredients, instructions, prep/cook time, and nutrition, plus matching `Recipe` JSON-LD. Validate with Google's Rich Results Test. Suggested approach:
  - Author the visible recipe using `<h1>`, `<ul>` for ingredients, `<ol>` for steps, `<time>` for prep/cook
  - Add `<script type="application/ld+json">` with `@type: Recipe` and the same data
  - Include required fields: `name`, `image`, `recipeIngredient`, `recipeInstructions`, `prepTime`, `cookTime`, `totalTime`
  - Add a `BreadcrumbList` JSON-LD for Home → Recipes → Sourdough
  - Test at search.google.com/test/rich-results and fix all errors

### Exercises

1. Add `Organization` JSON-LD to your homepage with `name`, `url`, `logo`, and `sameAs` links to your social profiles.
2. Convert a microdata-marked product into JSON-LD and verify both render the same in the Rich Results Test.
3. Add `FAQPage` structured data to a FAQ section and confirm Google shows expandable Q&A in search results.
4. Run your page through the Schema.org Validator and fix any type mismatches.
5. Audit your structured data to ensure every marked-up field has matching visible content.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which structured data format does Google recommend?
9. A) Microdata
10. B) RDFa
11. C) XML
12. D) JSON-LD (*)
13. Explanation: Google recommends JSON-LD (`<script type="application/ld+json">`) because it separates data from markup and is easy to generate server-side.
14. Q2: Which vocabulary is the de-facto standard for structured data?
15. A) Dublin Core
16. B) schema.org (*)
17. C) Open Graph
18. D) Microformats
19. Explanation: Schema.org is maintained by Google, Microsoft, Yahoo, and Yandex and is the vocabulary used by virtually all modern structured data.
20. Q3: Where does JSON-LD typically go in the document?
21. A) Only in <body>
22. B) In <head> (or anywhere; head is conventional) (*)
23. C) In a separate .json file referenced by <link>
24. D) Inside <meta>
25. Explanation: JSON-LD can go anywhere, but `<head>` placement is conventional because parsers read it before body content.
26. Q4: Does adding structured data guarantee a rich result?
27. A) Yes, always
28. B) No; it makes you eligible, Google decides based on quality (*)
29. C) Only for recipes
30. D) Only if you pay
31. Explanation: Structured data signals eligibility; Google's algorithms decide whether to actually show a rich result, often based on content quality and relevance.
32. Q5: Which schema type is most specific for a blog post?
33. A) Article
34. B) WebPage
35. C) BlogPosting (*)
36. D) CreativeWork
37. Explanation: `BlogPosting` extends `Article` extends `CreativeWork`; using the most specific type qualifies for the most rich result features.
38. Q6: What is `BreadcrumbList` used for?
39. A) Powering breadcrumb trails in search results (*)
40. B) Styling breadcrumbs
41. C) Loading CSS
42. D) Internal navigation only
43. Explanation: `BreadcrumbList` schema tells Google the page hierarchy so it can show breadcrumb snippets in search results.
44. Q7: What is a common reason for a structured-data manual penalty?
45. A) Marking up content not visible on the page (*)
46. B) Using JSON-LD instead of microdata
47. C) Forgetting the @context
48. D) Using too many properties
49. Explanation: Marking up hidden or non-visible content that doesn't match what users see is considered spam and can trigger a manual action.
50. Q8: Which attribute signals the start of a microdata item?
51. A) itemstart
52. B) itemtype
53. C) itemprop
54. D) itemscope (*)
55. Explanation: `itemscope` declares a new item; `itemtype` gives its schema type; `itemprop` labels its properties.
56. Q9: Which tool validates structured data for Google rich results?
57. A) W3C Validator
58. B) Lighthouse
59. C) Google's Rich Results Test (*)
60. D) axe DevTools
61. Explanation: search.google.com/test/rich-results specifically validates structured data for rich result eligibility and shows any errors or warnings.
62. Q10: What does `recipeInstructions` expect in `Recipe` schema?
63. A) A single string
64. B) A URL
65. C) An array of `HowToStep` or a single string (*)
66. D) An image
67. Explanation: `recipeInstructions` accepts either a string or an array of `HowToStep` objects; the array form enables step-by-step rich results.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which structured data format does Google recommend?
  options:
    - Microdata
    - RDFa
    - XML
    - JSON-LD
  correctIndex: 3
  explanation: Google recommends JSON-LD (`<script type="application/ld+json">`) because it separates data from markup and is easy to generate server-side.
- id: q2
  question: Which vocabulary is the de-facto standard for structured data?
  options:
    - Dublin Core
    - schema.org
    - Open Graph
    - Microformats
  correctIndex: 1
  explanation: Schema.org is maintained by Google, Microsoft, Yahoo, and Yandex and is the vocabulary used by virtually all modern structured data.
- id: q3
  question: Where does JSON-LD typically go in the document?
  options:
    - Only in <body>
    - In <head> (or anywhere; head is conventional)
    - In a separate .json file referenced by <link>
    - Inside <meta>
  correctIndex: 1
  explanation: JSON-LD can go anywhere, but `<head>` placement is conventional because parsers read it before body content.
- id: q4
  question: Does adding structured data guarantee a rich result?
  options:
    - Yes, always
    - No; it makes you eligible, Google decides based on quality
    - Only for recipes
    - Only if you pay
  correctIndex: 1
  explanation: Structured data signals eligibility; Google's algorithms decide whether to actually show a rich result, often based on content quality and relevance.
- id: q5
  question: Which schema type is most specific for a blog post?
  options:
    - Article
    - WebPage
    - BlogPosting
    - CreativeWork
  correctIndex: 2
  explanation: "`BlogPosting` extends `Article` extends `CreativeWork`; using the most specific type qualifies for the most rich result features."
- id: q6
  question: What is `BreadcrumbList` used for?
  options:
    - Powering breadcrumb trails in search results
    - Styling breadcrumbs
    - Loading CSS
    - Internal navigation only
  correctIndex: 0
  explanation: "`BreadcrumbList` schema tells Google the page hierarchy so it can show breadcrumb snippets in search results."
- id: q7
  question: What is a common reason for a structured-data manual penalty?
  options:
    - Marking up content not visible on the page
    - Using JSON-LD instead of microdata
    - Forgetting the @context
    - Using too many properties
  correctIndex: 0
  explanation: Marking up hidden or non-visible content that doesn't match what users see is considered spam and can trigger a manual action.
- id: q8
  question: Which attribute signals the start of a microdata item?
  options:
    - itemstart
    - itemtype
    - itemprop
    - itemscope
  correctIndex: 3
  explanation: "`itemscope` declares a new item; `itemtype` gives its schema type; `itemprop` labels its properties."
- id: q9
  question: Which tool validates structured data for Google rich results?
  options:
    - W3C Validator
    - Lighthouse
    - Google's Rich Results Test
    - axe DevTools
  correctIndex: 2
  explanation: search.google.com/test/rich-results specifically validates structured data for rich result eligibility and shows any errors or warnings.
- id: q10
  question: What does `recipeInstructions` expect in `Recipe` schema?
  options:
    - A single string
    - A URL
    - An array of `HowToStep` or a single string
    - An image
  correctIndex: 2
  explanation: "`recipeInstructions` accepts either a string or an array of `HowToStep` objects; the array form enables step-by-step rich results."
```

