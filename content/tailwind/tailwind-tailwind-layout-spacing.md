---
slug: tailwind-tailwind-layout-spacing
id: tailwind-02
track: tailwind
order: 2
title: Tailwind Layout & Spacing
description: Master Flexbox, Grid, padding, margin, and gap utilities for layout.
difficulty: beginner
estMinutes: 60
contentVersion: 1.0.0
---

# Tailwind Layout & Spacing

## Tailwind Layout & Spacing

### Why It Matters

Layout is the foundation of every UI. Tailwind's spacing and layout utilities (Flexbox, Grid, padding, margin, gap) let you build any layout without writing a single line of custom CSS. Understanding these utilities is essential for building responsive, well-aligned interfaces.

Tailwind uses a consistent spacing scale (0, 1, 2, 3, 4, ... where each unit = 0.25rem = 4px by default). This makes spacing predictable and consistent across your entire project.

### Prerequisites

- Complete 'Getting Started with Tailwind CSS'
- Basic understanding of Flexbox and CSS Grid

### Topics

- Padding (p-*) and margin (m-*) utilities
- The spacing scale (1 = 0.25rem = 4px)
- Flexbox utilities (flex, items-*, justify-*)
- CSS Grid utilities (grid, grid-cols-*, gap-*)
- Responsive layout patterns

```html
<!-- A responsive card grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="text-lg font-bold mb-2">Card 1</h3>
    <p class="text-gray-600 text-sm">A card with padding and shadow.</p>
  </div>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="text-lg font-bold mb-2">Card 2</h3>
    <p class="text-gray-600 text-sm">Responsive: 1 col on mobile, 2 on tablet, 3 on desktop.</p>
  </div>
</div>

<!-- A centered flex container -->
<div class="flex items-center justify-center min-h-screen">
  <div class="text-center">
    <h1 class="text-4xl font-bold">Centered content</h1>
  </div>
</div>
```
Caption: Layout examples with Tailwind

### Key Concepts

- Spacing scale: p-4 = padding: 1rem (16px); m-2 = margin: 0.5rem (8px)
- flex: sets display: flex; items-center vertically centers; justify-center horizontally centers
- grid grid-cols-3: creates a 3-column grid; gap-4 sets 1rem gap between items
- Responsive: grid-cols-1 md:grid-cols-3 means 1 column on mobile, 3 columns on medium screens+

### Common Pitfalls

- Using arbitrary pixel values (p-[17px]) instead of the scale — breaks design consistency
- Forgetting that margin doesn't collapse in flex/grid contexts — use gap instead
- Not testing responsive layouts — always check mobile, tablet, and desktop views

### Interview Questions

- How does Tailwind's spacing scale work?
- How would you create a responsive 3-column grid that collapses to 1 column on mobile?
- Why use gap instead of margin for grid/flex spacing?

### Mini Project

Build a responsive navigation bar: logo on the left, links on the right (flexbox), that collapses to a vertical menu on mobile using Tailwind's responsive utilities.

### Exercises

1. Create a card grid that shows 1 card per row on mobile, 2 on tablet, 4 on desktop
2. Build a sticky footer that stays at the bottom of the page using flexbox

```quiz
- id: q1
  question: What does p-4 mean in Tailwind?
  options:
    - "padding: 4px"
    - "padding: 1rem (16px)"
    - "padding: 0.4rem"
    - "padding: 4rem"
  correctIndex: 1
  explanation: "Tailwind's spacing scale uses 1 unit = 0.25rem = 4px. So p-4 = padding: 1rem (16px). The scale goes 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24..."
- id: q2
  question: How do you create a responsive 3-column grid that's 1 column on mobile?
  options:
    - grid grid-cols-3
    - grid grid-cols-1 md:grid-cols-3
    - grid columns-1-3
    - responsive-grid 1/3
  correctIndex: 1
  explanation: "grid grid-cols-1 md:grid-cols-3 means: 1 column by default (mobile), and 3 columns at the medium breakpoint (768px+) and above."
- id: q3
  question: Which utility classes center content both horizontally and vertically?
  options:
    - text-center align-center
    - flex items-center justify-center
    - center both
    - flex-center
  correctIndex: 1
  explanation: "flex sets display: flex, items-center vertically centers (align-items: center), and justify-center horizontally centers (justify-content: center)."
- id: q4
  question: Why is gap preferred over margin for spacing grid/flex children?
  options:
    - It's faster
    - It only applies between items (no extra space at edges) and doesn't have margin-collapse issues
    - It's required by Tailwind
    - It uses less memory
  correctIndex: 1
  explanation: gap applies space ONLY between items — no extra space at the outer edges. It also avoids margin-collapse issues that make margin-based spacing unpredictable in flex/grid contexts.
- id: q5
  question: What does min-h-screen do?
  options:
    - Sets min-height to 100px
    - Sets min-height to 100vh (full viewport height)
    - Sets min-height to 100rem
    - Hides content on small screens
  correctIndex: 1
  explanation: "min-h-screen sets min-height: 100vh, which makes the element at least as tall as the viewport. Useful for full-height layouts like centered login pages."
```

