---
slug: tailwind-tailwind-colors-typography-dark-mode
id: tailwind-03
track: tailwind
order: 3
title: Tailwind Colors, Typography & Dark Mode
description: Style text and backgrounds with Tailwind's color system and implement dark mode.
difficulty: beginner
estMinutes: 55
contentVersion: 1.0.0
---

# Tailwind Colors, Typography & Dark Mode

## Tailwind Colors, Typography & Dark Mode

### Why It Matters

Color and typography define the visual identity of your application. Tailwind's color system (with shades 50-950) and typography utilities let you create professional, accessible designs. Dark mode support is now expected in every modern app.

Tailwind provides a comprehensive color palette with 22 colors, each with 10 shades (50, 100, 200, ..., 950). Dark mode is built-in with the dark: prefix.

### Prerequisites

- Complete 'Getting Started with Tailwind CSS' and 'Tailwind Layout & Spacing'

### Topics

- Background colors (bg-*) and text colors (text-*)
- Color shades (50-950 scale)
- Typography: font-size, font-weight, line-height, letter-spacing
- Dark mode with dark: prefix
- Customizing colors in tailwind.config.js

```html
<!-- Color and typography examples -->
<div class="bg-blue-500 text-white p-4 rounded">
  <h2 class="text-2xl font-bold tracking-tight">Blue background, white text</h2>
  <p class="text-blue-100 text-sm mt-1">Lighter blue text for subtitles</p>
</div>

<!-- Dark mode -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
  <p>This card adapts to dark mode automatically.</p>
</div>

<!-- Typography -->
<p class="text-lg leading-relaxed tracking-wide font-light text-gray-700">
  Large, relaxed text with wide letter spacing and light weight.
</p>
```
Caption: Colors and typography with Tailwind

### Key Concepts

- Color shade: bg-blue-500 is the '500' shade (medium). 50 is lightest, 950 is darkest
- dark: prefix: applies styles only in dark mode (dark:bg-gray-900)
- Typography: text-lg (font-size), font-bold (weight), leading-relaxed (line-height), tracking-wide (letter-spacing)
- Opacity: bg-blue-500/50 sets 50% opacity — no need for rgba()

### Common Pitfalls

- Using too many different colors — stick to 2-3 primary colors plus grays
- Forgetting contrast — text-blue-300 on bg-blue-500 may fail WCAG contrast checks
- Not testing dark mode — some elements look broken when the background flips

### Interview Questions

- How does Tailwind's color shade system work?
- How do you implement dark mode in Tailwind?
- How do you set text opacity in Tailwind?

### Mini Project

Build a pricing card component with a featured tier (different background color), proper typography hierarchy, and dark mode support.

### Exercises

1. Add custom brand colors to tailwind.config.js and use them
2. Implement a dark mode toggle button that switches between light and dark themes

```quiz
- id: q1
  question: What does bg-blue-500 mean in Tailwind?
  options:
    - "background-color: blue with 500px"
    - "background-color: the '500' shade of blue (medium intensity)"
    - "background-color: #500blue"
    - 500% opacity blue
  correctIndex: 1
  explanation: bg-blue-500 sets background-color to the '500' shade of blue — a medium intensity. The scale goes 50 (lightest) to 950 (darkest).
- id: q2
  question: How do you apply a style only in dark mode?
  options:
    - "Use the night: prefix"
    - "Use the dark: prefix (e.g., dark:bg-gray-900)"
    - Use @media (prefers-dark)
    - It's not possible in Tailwind
  correctIndex: 1
  explanation: "The dark: prefix applies styles only when dark mode is active. For example, bg-white dark:bg-gray-900 uses white in light mode and gray-900 in dark mode."
- id: q3
  question: How do you set 50% opacity on a background color?
  options:
    - bg-blue-500-opacity-50
    - bg-blue-500/50
    - bg-blue-500-50
    - opacity-bg-50
  correctIndex: 1
  explanation: "Use the slash syntax: bg-blue-500/50 sets the blue-500 background color at 50% opacity. This works for text colors too (text-blue-500/50)."
- id: q4
  question: Which utility sets line-height?
  options:
    - line-height-relaxed
    - leading-relaxed
    - lh-relaxed
    - line-relaxed
  correctIndex: 1
  explanation: "leading-* utilities set line-height. For example, leading-relaxed sets line-height: 1.625. Other options: leading-none, leading-tight, leading-normal, leading-loose."
- id: q5
  question: What does tracking-wide do?
  options:
    - Increases font size
    - Increases letter-spacing (space between characters)
    - Increases word spacing
    - Increases line height
  correctIndex: 1
  explanation: "tracking-* utilities set letter-spacing. tracking-wide increases the space between characters. Other options: tracking-tighter, tracking-tight, tracking-normal, tracking-wider, tracking-widest."
```

