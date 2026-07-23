---
slug: tailwind-tailwind-responsive-design-states
id: tailwind-04
track: tailwind
order: 4
title: Tailwind Responsive Design & States
description: Build responsive interfaces with breakpoint prefixes and style interactive states like hover and focus.
difficulty: intermediate
estMinutes: 65
contentVersion: 1.0.0
---

# Tailwind Responsive Design & States

## Tailwind Responsive Design & States

### Why It Matters

Modern websites must work on screens from 320px (phones) to 2560px+ (large monitors). Tailwind's responsive prefixes (sm:, md:, lg:, xl:) and state modifiers (hover:, focus:, active:) let you handle all of this without media queries or custom CSS — directly in your HTML.

Tailwind uses a mobile-first approach: base styles apply to all screens, and responsive prefixes apply at that breakpoint and above. State modifiers (hover:, focus:) work the same way.

### Prerequisites

- Complete 'Getting Started with Tailwind CSS' and 'Tailwind Layout & Spacing'

### Topics

- Mobile-first responsive design
- Breakpoint prefixes: sm:, md:, lg:, xl:, 2xl:
- State modifiers: hover:, focus:, active:, disabled:
- Group hover and peer modifiers
- Custom breakpoints in tailwind.config.js

```html
<!-- Responsive: starts stacked on mobile, side-by-side on desktop -->
<div class="flex flex-col md:flex-row gap-4">
  <div class="flex-1 bg-blue-100 p-4">Left</div>
  <div class="flex-1 bg-green-100 p-4">Right</div>
</div>

<!-- Hover and focus states -->
<button class="
  bg-indigo-500 hover:bg-indigo-600
  focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
  focus:outline-none
  active:bg-indigo-700
  disabled:opacity-50 disabled:cursor-not-allowed
  text-white font-medium py-2 px-4 rounded
  transition-colors
">
  Click me
</button>

<!-- Group hover: child changes when parent is hovered -->
<div class="group bg-white p-4 rounded cursor-pointer">
  <h3 class="group-hover:text-blue-500">Hover the card</h3>
  <p class="opacity-0 group-hover:opacity-100 transition-opacity">This text appears on hover</p>
</div>
```
Caption: Responsive and state examples

### Key Concepts

- Mobile-first: base (unprefixed) styles apply to mobile; md: applies at 768px+
- hover:focus:active: state modifiers — style changes when the user interacts
- group-hover: child elements change when the parent (.group) is hovered
- peer: sibling element state — peer-checked: styles the sibling of a checked input

### Common Pitfalls

- Forgetting mobile-first — if you set text-lg, it applies to ALL screens; use text-base lg:text-lg to override on larger screens
- Not adding focus styles — accessibility requires visible focus indicators; use focus:ring-2
- Overusing group/peer — if the relationship is complex, extract a component instead

### Interview Questions

- Explain Tailwind's mobile-first approach
- What is group-hover and when would you use it?
- How do you style focus states for accessibility in Tailwind?

### Mini Project

Build a responsive navbar that shows a hamburger menu on mobile (hidden by default, toggled with a button) and full links on desktop. Use responsive prefixes and group-hover for dropdown menus.

### Exercises

1. Add a focus-visible ring to all interactive elements on your page
2. Create a card that reveals additional content on hover using group-hover

```quiz
- id: q1
  question: What does Tailwind's 'mobile-first' approach mean?
  options:
    - You should design for mobile only
    - Base (unprefixed) styles apply to mobile; responsive prefixes apply at larger screens
    - Mobile styles are written last
    - You must use a mobile emulator
  correctIndex: 1
  explanation: "In Tailwind's mobile-first approach, unprefixed styles apply to ALL screen sizes (starting from mobile). Responsive prefixes like md: and lg: apply at that breakpoint and above — they override the base styles on larger screens."
- id: q2
  question: What does group-hover do?
  options:
    - Hovers all elements in a group
    - Styles child elements when the parent (.group) is hovered
    - Creates a hover animation
    - Groups multiple hover styles
  correctIndex: 1
  explanation: "Add class 'group' to a parent element, then use group-hover: on children. When the parent is hovered, the child's group-hover: styles apply. Useful for card hovers, dropdown menus, etc."
- id: q3
  question: "Which breakpoint does md: correspond to?"
  options:
    - 480px
    - 640px
    - 768px
    - 1024px
  correctIndex: 2
  explanation: "md: applies at 768px and above. The default breakpoints are: sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px."
- id: q4
  question: How do you add a focus ring for accessibility?
  options:
    - focus:ring-2 focus:ring-blue-400
    - focus:border-blue-400
    - focus:outline-blue
    - focus:ring
  correctIndex: 0
  explanation: Use focus:ring-2 focus:ring-blue-400 focus:outline-none to add a visible focus ring. The ring utility creates an outline-like ring that doesn't affect layout — essential for keyboard accessibility.
- id: q5
  question: What does disabled:opacity-50 do?
  options:
    - Sets 50% opacity always
    - Sets 50% opacity only when the element is disabled
    - Disables the opacity
    - Sets opacity to 50px
  correctIndex: 1
  explanation: "disabled: is a state modifier — the style applies only when the element is in the disabled state. disabled:opacity-50 makes disabled buttons appear faded at 50% opacity."
```

