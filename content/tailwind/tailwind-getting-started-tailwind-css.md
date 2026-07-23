---
slug: tailwind-getting-started-tailwind-css
id: tailwind-01
track: tailwind
order: 1
title: Getting Started with Tailwind CSS
description: Understand utility-first CSS and set up Tailwind in your first project.
difficulty: beginner
estMinutes: 50
contentVersion: 1.0.0
---

# Getting Started with Tailwind CSS

## Getting Started with Tailwind CSS

### Why It Matters

Tailwind CSS is a utility-first CSS framework that lets you build custom designs without leaving your HTML. Instead of writing custom CSS classes, you compose styles from small, reusable utility classes. It's the fastest-growing CSS approach and is used by companies like GitHub, Netflix, and Shopify.

Tailwind CSS scans your HTML files for class names and generates only the CSS you actually use — no unused styles, no bloated stylesheet. The result is a tiny, highly optimized CSS bundle.

### Prerequisites

- Basic HTML and CSS knowledge
- A code editor (VS Code recommended)
- Node.js installed (for the Tailwind CLI)

### Topics

- What is utility-first CSS?
- Installing Tailwind via CLI or PostCSS
- The tailwind.config.js file
- Your first utility classes
- The Tailwind IntelliSense VS Code extension

```html
<!-- A button styled entirely with Tailwind utility classes -->
<button class="
  bg-blue-500
  hover:bg-blue-700
  text-white
  font-bold
  py-2
  px-4
  rounded
  transition-colors
  duration-200
">
  Click me
</button>
```
Caption: A styled button using only Tailwind classes

### Key Concepts

- Utility class: a single-purpose CSS class like text-center, p-4, or bg-blue-500
- Responsive prefix: sm:, md:, lg:, xl: — applies styles only at that breakpoint or larger
- Configuration: tailwind.config.js customizes colors, fonts, spacing, and more
- JIT (Just-In-Time): Tailwind generates CSS on-demand as it scans your files

### Common Pitfalls

- Not installing the Tailwind IntelliSense extension — you'll miss autocomplete and hover previews
- Using @apply too early — embrace utility classes first; @apply is for reducing repetition later
- Forgetting to configure content paths in tailwind.config.js — Tailwind won't generate CSS for files it doesn't scan

### Interview Questions

- What is utility-first CSS and what are its advantages?
- How does Tailwind differ from Bootstrap or other CSS frameworks?
- How does Tailwind keep the CSS bundle small?

### Mini Project

Create a simple landing page with a hero section, a feature grid, and a footer — all styled with Tailwind utility classes. No custom CSS.

### Exercises

1. Install the Tailwind IntelliSense VS Code extension and try hovering over classes to see the CSS preview
2. Make your landing page responsive by adding md: and lg: prefixes

```quiz
- id: q1
  question: What does 'utility-first CSS' mean?
  options:
    - Writing CSS utilities from scratch
    - Using small, single-purpose CSS classes to compose styles directly in HTML
    - A CSS reset tool
    - A CSS preprocessor
  correctIndex: 1
  explanation: Utility-first means you style elements by composing small, single-purpose classes (like p-4, text-center, bg-blue-500) directly in your HTML, rather than writing custom CSS classes.
- id: q2
  question: How does Tailwind keep the final CSS bundle small?
  options:
    - It uses CSS minification only
    - It scans your HTML and generates only the CSS classes you actually use
    - It inlines all CSS
    - It doesn't — Tailwind produces large CSS files
  correctIndex: 1
  explanation: Tailwind's JIT engine scans your content files for class names and generates only the CSS for classes you actually use. Unused utilities are never included in the final bundle.
- id: q3
  question: Which file configures Tailwind's theme (colors, fonts, spacing)?
  options:
    - package.json
    - tailwind.config.js
    - .tailwindrc
    - webpack.config.js
  correctIndex: 1
  explanation: tailwind.config.js is where you customize Tailwind's theme — add custom colors, fonts, breakpoints, spacing, and more.
- id: q4
  question: "What does the md: prefix do in Tailwind?"
  options:
    - Applies the style only on mobile
    - Applies the style at the medium breakpoint (768px) and larger
    - Applies the style only in dark mode
    - Makes the text medium-sized
  correctIndex: 1
  explanation: "md: is a responsive prefix — it applies the style only at the medium breakpoint (768px) and above. For example, md:text-center centers text only on screens 768px+ wide."
- id: q5
  question: What is the Tailwind IntelliSense VS Code extension used for?
  options:
    - Compiling Tailwind CSS
    - Autocomplete, hover previews, and linting for Tailwind classes
    - Deploying Tailwind sites
    - Converting CSS to Tailwind
  correctIndex: 1
  explanation: The IntelliSense extension provides autocomplete for class names, hover previews showing the CSS, and linting — it's essential for a productive Tailwind workflow.
```

