---
slug: html-validation-tooling-capstone-prep
id: html-20
track: html
order: 20
title: Validation, Tooling, and Capstone Prep
description: Polish your HTML with automated tooling and prepare for the capstone. This stage covers the W3C validator, HTML linters, axe and Lighthouse audits, CI integration, and how to plan the capstone documentation site.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=7500s
whyItMatters: Polish your HTML with automated tooling and prepare for the capstone. This stage covers the W3C validator, HTML linters, axe and Lighthouse audits, CI integration, and how to plan the capstone documentation site.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# Validation, Tooling, and Capstone Prep

## Validation, Tooling, and Capstone Prep

### Why It Matters

Polish your HTML with automated tooling and prepare for the capstone. This stage covers the W3C validator, HTML linters, axe and Lighthouse audits, CI integration, and how to plan the capstone documentation site.

Polish your HTML with automated tooling and prepare for the capstone. This stage covers the W3C validator, HTML linters, axe and Lighthouse audits, CI integration, and how to plan the capstone documentation site.

### Prerequisites

- All prior 19 stages
- Comfortable running CLI tools and reading terminal output

### Topics

- The W3C Nu Html Checker (validator.w3.org) and `vnu` CLI
- HTMLHint and `@html-eslint/parser` for lint rules
- Prettier for HTML formatting
- axe DevTools and `@axe-core/playwright` for automated a11y testing
- Lighthouse CI for performance, accessibility, SEO, and PWA audits
- Browser DevTools: Elements, Issues tab, Rendering panel, Coverage
- Headless browser testing (Playwright) for HTML structure assertions
- CI integration: GitHub Actions workflow that fails on validator errors
- Capstone planning: scope, file structure, deployment target

### Key Concepts

- Validation catches structural bugs (unclosed tags, duplicate IDs, invalid nesting) that browsers silently fix but cause subtle issues.
- Linters enforce team conventions (attribute order, indentation, no inline styles); Prettier handles formatting.
- Lighthouse is the single best free audit: Performance, Accessibility, Best Practices, SEO, and PWA — all in one report.
- Accessibility testing must combine automated (axe catches ~30% of issues) with manual keyboard and screen reader testing.
- CI should fail on validator errors, lint warnings, and Lighthouse scores below a threshold (e.g., 90).

```bash
# Install the Nu Html Checker CLI
npm install -g vnu-jar

# Validate a single file
vnu index.html

# Validate a whole directory
vnu --skip-non-html ./dist/

# CI-friendly: exit non-zero on errors, ignore warnings
vnu --errors-only ./dist/
```
Caption: Run the W3C validator locally

### Common Pitfalls

- Skipping validation because "it renders fine" — browsers silently fix broken HTML but the fixes can cause subtle accessibility and SEO bugs; validate every page.
- Ignoring Lighthouse accessibility warnings — automated audits catch ~30% of a11y issues; treat them as the floor, not the ceiling.
- No automated a11y testing in CI — accessibility regressions slip in unnoticed; add `@axe-core/playwright` to your E2E suite.
- Only testing in Chrome — Safari and Firefox parse HTML differently and have different DevTools; test in at least two browsers.
- Treating the capstone as "just another project" — it should integrate every concept: semantics, a11y, SEO, structured data, PWA, performance, and security.

### Real-World Applications

- The W3C Nu Html Checker runs millions of validations per month and is the reference implementation used by browser vendors.
- Microsoft's Edge team uses Lighthouse CI on every PR to web.dev and docs.microsoft.com to prevent performance regressions.
- Gov.uk runs axe-core in CI on every page template; any PR that introduces an a11y violation is blocked from merge.
- Mozilla's MDN runs `vnu` and `htmlhint` in CI so no broken HTML ships to the docs site.

### Interview Questions

- 1. Why validate HTML if browsers render broken HTML anyway? — Browsers silently fix errors in unpredictable ways; validation catches structural bugs that cause subtle accessibility, SEO, and rendering issues.
- 2. What does Lighthouse measure? — Performance, Accessibility, Best Practices, SEO, and (if applicable) PWA — each scored 0-100.
- 3. What percentage of accessibility issues can axe catch automatically? — Roughly 30%; manual keyboard and screen reader testing is still required.
- 4. How do you enforce HTML quality in CI? — Run `vnu` (validator), `htmlhint` (linter), and `@axe-core/playwright` (a11y) in a GitHub Actions workflow that fails on errors.
- 5. What is the difference between `vnu` and `htmlhint`? — `vnu` validates against the HTML spec (correctness); `htmlhint` enforces team style conventions (consistency).

### Mini Project

Build an Audited, Validated Page Ready for Capstone: Take a previous stage's mini project and run it through the full quality pipeline: W3C validator, HTMLHint, Prettier, axe, and Lighthouse. Fix every issue until all checks pass green. Suggested approach:
  - Run `npx vnu --errors-only index.html` and fix every reported error
  - Run `npx htmlhint index.html` and fix every warning
  - Run `npx prettier --check index.html` and apply with `--write`
  - Install axe DevTools browser extension and resolve all violations
  - Run Lighthouse and target 90+ on all categories; document any remaining issues

### Exercises

1. Install `vnu-jar` globally and validate every HTML file in your project; fix all errors.
2. Add `htmlhint` to your project with a config file and fix every warning.
3. Run Lighthouse on your homepage and improve any category below 90 to 90+.
4. Add an `@axe-core/playwright` test that fails on any a11y violation.
5. Write a GitHub Actions workflow that runs validator, linter, and axe on every PR.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which tool is the canonical HTML validator?
9. A) ESLint
10. B) Prettier
11. C) W3C Nu Html Checker (vnu) (*)
12. D) Lighthouse
13. Explanation: The W3C Nu Html Checker (`vnu`, also at validator.w3.org) is the reference implementation for HTML validation against the spec.
14. Q2: Which tool audits Performance, Accessibility, Best Practices, SEO, and PWA in one report?
15. A) Lighthouse (*)
16. B) axe
17. C) WebPageTest
18. D) HTMLHint
19. Explanation: Lighthouse produces a single report with five categories scored 0-100; axe is a11y-only.
20. Q3: Approximately what percentage of accessibility issues can axe catch automatically?
21. A) 90%
22. B) 30% (*)
23. C) 100%
24. D) 5%
25. Explanation: Automated a11y tools like axe catch roughly 30% of WCAG issues; the rest require manual keyboard and screen reader testing.
26. Q4: Which library runs axe inside Playwright tests?
27. A) @axe-core/playwright (*)
28. B) axe-playwright
29. C) playwright-axe
30. D) a11y-playwright
31. Explanation: `@axe-core/playwright` is the official axe-core integration for Playwright; it returns violations you can assert against.
32. Q5: Why validate HTML if browsers render broken HTML anyway?
33. A) For SEO points
34. B) It speeds up page load
35. C) Validation is required by law
36. D) Browsers fix errors unpredictably, causing subtle a11y and rendering bugs (*)
37. Explanation: Browsers apply error-correction heuristics that vary by engine; validation catches structural issues before they cause subtle accessibility or layout problems.
38. Q6: Which linter enforces HTML style conventions like attribute order and indentation?
39. A) vnu
40. B) ESLint
41. C) Stylelint
42. D) HTMLHint (*)
43. Explanation: HTMLHint enforces team conventions (style, consistency); `vnu` validates against the spec (correctness).
44. Q7: Which formatter auto-indents and reflows HTML consistently?
45. A) ESLint
46. B) HTMLHint
47. C) Prettier (*)
48. D) vnu
49. Explanation: Prettier is an opinionated formatter that reflows HTML (and many other languages) for consistent style across a team.
50. Q8: What does the DevTools Issues tab report?
51. A) CSS lint warnings
52. B) Browser-detected page issues like cross-origin errors, deprecated features, and CSP violations (*)
53. C) Network latency
54. D) JS heap size
55. Explanation: The Issues tab surfaces browser-detected problems: cross-origin port blocks, deprecated APIs, mixed content, cookie issues, and CSP violations.
56. Q9: Which CI threshold is commonly enforced for Lighthouse categories?
57. A) 90+ (*)
58. B) 50+
59. C) 70+
60. D) 100
61. Explanation: A common CI gate is "all Lighthouse categories ≥ 90"; Lighthouse CI fails the build if any category drops below the threshold.
62. Q10: What is the most important capstone preparation?
63. A) Choosing a color scheme
64. B) Buying a domain
65. C) Setting up analytics
66. D) Planning how to integrate every concept: semantics, a11y, SEO, structured data, PWA, performance, security (*)
67. Explanation: The capstone is a synthesis project; planning how to weave together semantics, a11y, SEO, structured data, PWA, performance, and security is more important than any individual design choice.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: Which tool is the canonical HTML validator?
  options:
    - ESLint
    - Prettier
    - W3C Nu Html Checker (vnu)
    - Lighthouse
  correctIndex: 2
  explanation: The W3C Nu Html Checker (`vnu`, also at validator.w3.org) is the reference implementation for HTML validation against the spec.
- id: q2
  question: Which tool audits Performance, Accessibility, Best Practices, SEO, and PWA in one report?
  options:
    - Lighthouse
    - axe
    - WebPageTest
    - HTMLHint
  correctIndex: 0
  explanation: Lighthouse produces a single report with five categories scored 0-100; axe is a11y-only.
- id: q3
  question: Approximately what percentage of accessibility issues can axe catch automatically?
  options:
    - 90%
    - 30%
    - 100%
    - 5%
  correctIndex: 1
  explanation: Automated a11y tools like axe catch roughly 30% of WCAG issues; the rest require manual keyboard and screen reader testing.
- id: q4
  question: Which library runs axe inside Playwright tests?
  options:
    - "@axe-core/playwright"
    - axe-playwright
    - playwright-axe
    - a11y-playwright
  correctIndex: 0
  explanation: "`@axe-core/playwright` is the official axe-core integration for Playwright; it returns violations you can assert against."
- id: q5
  question: Why validate HTML if browsers render broken HTML anyway?
  options:
    - For SEO points
    - It speeds up page load
    - Validation is required by law
    - Browsers fix errors unpredictably, causing subtle a11y and rendering bugs
  correctIndex: 3
  explanation: Browsers apply error-correction heuristics that vary by engine; validation catches structural issues before they cause subtle accessibility or layout problems.
- id: q6
  question: Which linter enforces HTML style conventions like attribute order and indentation?
  options:
    - vnu
    - ESLint
    - Stylelint
    - HTMLHint
  correctIndex: 3
  explanation: HTMLHint enforces team conventions (style, consistency); `vnu` validates against the spec (correctness).
- id: q7
  question: Which formatter auto-indents and reflows HTML consistently?
  options:
    - ESLint
    - HTMLHint
    - Prettier
    - vnu
  correctIndex: 2
  explanation: Prettier is an opinionated formatter that reflows HTML (and many other languages) for consistent style across a team.
- id: q8
  question: What does the DevTools Issues tab report?
  options:
    - CSS lint warnings
    - Browser-detected page issues like cross-origin errors, deprecated features, and CSP violations
    - Network latency
    - JS heap size
  correctIndex: 1
  explanation: "The Issues tab surfaces browser-detected problems: cross-origin port blocks, deprecated APIs, mixed content, cookie issues, and CSP violations."
- id: q9
  question: Which CI threshold is commonly enforced for Lighthouse categories?
  options:
    - 90+
    - 50+
    - 70+
    - "100"
  correctIndex: 0
  explanation: A common CI gate is "all Lighthouse categories ≥ 90"; Lighthouse CI fails the build if any category drops below the threshold.
- id: q10
  question: What is the most important capstone preparation?
  options:
    - Choosing a color scheme
    - Buying a domain
    - Setting up analytics
    - "Planning how to integrate every concept: semantics, a11y, SEO, structured data, PWA, performance, security"
  correctIndex: 3
  explanation: The capstone is a synthesis project; planning how to weave together semantics, a11y, SEO, structured data, PWA, performance, and security is more important than any individual design choice.
```

