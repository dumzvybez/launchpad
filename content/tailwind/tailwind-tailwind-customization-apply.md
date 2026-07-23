---
slug: tailwind-tailwind-customization-apply
id: tailwind-05
track: tailwind
order: 5
title: Tailwind Customization & @apply
description: Extend Tailwind with custom themes, extract reusable component classes with @apply, and build a design system.
difficulty: intermediate
estMinutes: 70
contentVersion: 1.0.0
---

# Tailwind Customization & @apply

## Tailwind Customization & @apply

### Why It Matters

Every real project needs custom branding — brand colors, custom fonts, reusable component patterns. Tailwind's configuration system and the @apply directive let you customize everything and extract reusable component classes when utility-first gets repetitive.

The tailwind.config.js file is your design system's single source of truth. The @apply directive lets you extract commonly-used utility combinations into named classes — useful for buttons, cards, and other repeated patterns.

### Prerequisites

- Complete all previous Tailwind lessons
- Basic understanding of CSS and design systems

### Topics

- Customizing colors, fonts, spacing in tailwind.config.js
- Adding custom breakpoints
- The @apply directive for component classes
- When to use @apply vs utility classes
- Plugins and presets

```javascript
// tailwind.config.js — custom theme
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};
```
Caption: Customizing Tailwind's theme

```css
/* Using @apply to extract reusable component classes */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6 dark:bg-gray-800;
  }
}
```
Caption: Extracting component classes with @apply

### Key Concepts

- extend: adds to Tailwind's defaults without replacing them (recommended)
- theme override (without extend): replaces Tailwind's defaults entirely
- @apply: extracts utility combinations into a named CSS class
- @layer components: tells Tailwind these are component-level classes (lower priority than utilities)

### Common Pitfalls

- Overusing @apply — if you're writing .card { @apply ... } for every component, you lose the benefit of utility-first. Use it only for truly repeated patterns
- Not using extend — if you set theme.colors without extend, you lose ALL of Tailwind's default colors
- Forgetting to purge — if content paths are wrong, @apply classes may be stripped from production CSS

### Interview Questions

- How do you add custom brand colors to Tailwind?
- What does @apply do and when should you use it?
- What's the difference between extending and overriding a theme?

### Mini Project

Create a small design system: custom brand colors in tailwind.config.js, 3 button variants (.btn-primary, .btn-secondary, .btn-danger) using @apply, and a .card component class. Build a page that uses all of them.

### Exercises

1. Add a custom animation (e.g., fade-in) to tailwind.config.js and use it
2. Create a .input component class with focus states using @apply

```quiz
- id: q1
  question: What is the difference between extend and override in tailwind.config.js?
  options:
    - They are the same
    - extend adds to defaults; override replaces defaults entirely
    - extend replaces; override adds
    - There is no extend option
  correctIndex: 1
  explanation: Using theme.extend.colors adds your custom colors alongside Tailwind's defaults. Setting theme.colors directly REPLACES all default colors — you lose blue, red, gray, etc. Always use extend unless you intentionally want to remove defaults.
- id: q2
  question: What does @apply do?
  options:
    - Applies a CSS reset
    - Extracts utility class combinations into a named CSS class
    - Applies a Tailwind plugin
    - Imports external CSS
  correctIndex: 1
  explanation: "@apply lets you write .btn { @apply bg-blue-500 text-white px-4 py-2 rounded; } — it extracts the utility classes into a reusable named class, reducing repetition in your HTML."
- id: q3
  question: When should you use @apply?
  options:
    - Always — for every element
    - Never — utility classes only
    - Only for truly repeated patterns (buttons, cards) where the utility combination is identical across many uses
    - Only in production
  correctIndex: 2
  explanation: Use @apply sparingly — only for component patterns that repeat identically (e.g., all primary buttons look the same). For one-off styles, use utility classes directly. Overusing @apply defeats the purpose of utility-first CSS.
- id: q4
  question: How do you add a custom font family in Tailwind?
  options:
    - "@import the font in CSS only"
    - Add fontFamily to theme.extend in tailwind.config.js
    - Use the font-family utility
    - It's not possible
  correctIndex: 1
  explanation: "Add fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] } to theme.extend in tailwind.config.js. Then use font-sans to apply it."
- id: q5
  question: What does @layer components do?
  options:
    - Removes component styles
    - Tells Tailwind these are component-level classes (lower priority than utilities)
    - Disables utility classes
    - Groups CSS files
  correctIndex: 1
  explanation: "@layer components wraps your @apply classes so Tailwind knows they are component-level. This means utility classes always override them — so you can write .btn { @apply bg-blue-500 } and still override with bg-red-500 in your HTML."
```

