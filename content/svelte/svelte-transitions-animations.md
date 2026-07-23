---
slug: svelte-transitions-animations
id: svelte-10
track: svelte
order: 10
title: Transitions and Animations
description: "Add motion to your Svelte apps with built-in transitions (fade, fly, slide), spring/tweened stores for value animation, and animate: for FLIP-based layout animations."
difficulty: intermediate
estMinutes: 210
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zojEMeQGGHs&t=270s
whyItMatters: "Add motion to your Svelte apps with built-in transitions (fade, fly, slide), spring/tweened stores for value animation, and animate: for FLIP-based layout animations."
deepDiveResources:
  - label: W3Schools Svelte
    url: https://learn.svelte.dev/
    kind: course
  - label: Svelte Official Docs
    url: https://svelte.dev/docs
    kind: doc
---

# Transitions and Animations

## Transitions and Animations

### Why It Matters

Add motion to your Svelte apps with built-in transitions (fade, fly, slide), spring/tweened stores for value animation, and animate: for FLIP-based layout animations.

Add motion to your Svelte apps with built-in transitions (fade, fly, slide), spring/tweened stores for value animation, and animate: for FLIP-based layout animations.

### Prerequisites

- Stage 7: Conditionals and Each Blocks
- Stage 9: Stores
- CSS transitions and easing basics.

### Topics

- svelte/transition: fade, fly, slide, scale, draw, blur
- transition: vs in: / out: (one-way transitions)
- Local transitions with |local modifier
- Custom CSS transitions
- svelte/animate: flip for each-block reordering
- svelte/motion: spring, tweened
- Easing functions from svelte/easing
- prefers-reduced-motion considerations

### Key Concepts

- transition: applies both on enter and exit; in:/out: apply separately
- |local modifier keeps transitions from firing on parent {#each} changes
- flip animates position changes in {#each} using the FLIP technique
- spring and tweened are store-like value animators
- Transitions respect prefers-reduced-motion when you use the built-in helpers

```svelte
<script lang="ts">
  import { fade, slide } from "svelte/transition";
  let visible = $state(true);
</script>

<button onclick={() => visible = !visible}>Toggle</button>

{#if visible}
  <p transition:fade={{ duration: 200 }}>I fade in and out.</p>
  <div transition:slide>I slide.</div>
{/if}
```
Caption: Fade and slide on conditional

### Common Pitfalls

- Forgetting that transition: fires on both enter AND exit — use in:/out: for asymmetric effects.
- Missing the |local modifier on {#each} transitions — without it, reordering fires transitions for the whole list, not just added/removed items.
- Animating layout properties (top/left) instead of transform — use translate/scale for GPU-accelerated, 60fps motion.
- Forgetting to honor prefers-reduced-motion — wrap spring/tweened changes in a check, or use the `prefersReducedMotion` store from svelte/motion.
- Applying transitions to {#each} without a key — items need stable keys for flip to track them correctly.

### Real-World Applications

- The New York Times' interactive graphics use svelte/transition to fade in chart series and annotations on scroll.
- Apple Music's now-playing panel uses spring stores to smoothly slide album art between tracks.
- Rakuten's product image carousel uses fly/slide transitions for swipe feedback.
- Chess.com's move animation uses flip to smoothly slide pieces between squares.

### Interview Questions

- 1. What's the difference between transition:, in:, and out:? — transition: applies on both enter and exit; in:/out: apply asymmetrically.
- 2. What does |local do? — Limits a transition in an {#each} block to items actually added/removed, not the whole list when the parent re-renders.
- 3. What's flip? — A Svelte animate: directive that uses the FLIP (First, Last, Invert, Play) technique to animate position changes in {#each}.
- 4. How do spring and tweened differ? — spring uses physics (stiffness/damping) for natural motion; tweened animates between values over a fixed duration with easing.
- 5. How do you respect prefers-reduced-motion? — Use the `prefersReducedMotion` store from svelte/motion to conditionally disable or shorten animations.

### Mini Project

Build an Animated Todo List: A todo app where items fade/slide in on add, fade out on remove, and reordering uses flip. Add a spring-based "today's progress" gauge that animates between 0% and 100% as items are completed. Suggested approach:
  - Use transition:fade on each <li>
  - Apply out:fly for removal to give a "fly off" effect
  - Use animate:flip with a 300ms duration on the {#each}
  - Compute progress with $derived (done.length / total.length)
  - Use a tweened store to smoothly animate the gauge width

### Exercises

1. Add transition:fade to a conditional greeting that toggles on button click.
2. Use in:fly and out:fade on a notification toast.
3. Build a sortable list with animate:flip and a stable key.
4. Animate a number from 0 to 100 using tweened with a cubic easing.
5. Add prefers-reduced-motion support that disables transitions when set.
6. >>> QUIZ (Stage 10) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which module provides fade, fly, slide?
9. A) svelte/animate
10. B) svelte/transition (*)
11. C) svelte/motion
12. D) svelte/easing
13. Explanation: svelte/transition exports fade, fly, slide, scale, blur, draw; svelte/animate provides flip; svelte/motion provides spring/tweened.
14. Q2: What's the difference between transition: and in:/out:?
15. A) None
16. B) in:/out: are deprecated
17. C) transition: applies on enter AND exit; in:/out: apply separately (*)
18. D) transition: is one-way only
19. Explanation: transition: is bidirectional; in: and out: let you specify different effects for enter and exit respectively.
20. Q3: What does the |local modifier do?
21. A) Makes the transition local to the file
22. B) Disables the transition globally
23. C) Speeds up the transition
24. D) Limits a transition in {#each} to items actually added/removed (*)
25. Explanation: Without |local, an {#each} reordering fires transitions for every item; |local restricts it to genuinely added/removed items.
26. Q4: Which module provides the flip animation?
27. A) svelte/animate (*)
28. B) svelte/transition
29. C) svelte/motion
30. D) svelte/easing
31. Explanation: svelte/animate exports flip, used in {#each} as `animate:flip={{ duration }}` to animate position changes via FLIP.
32. Q5: Which module provides spring and tweened?
33. A) svelte/animate
34. B) svelte/motion (*)
35. C) svelte/transition
36. D) svelte/store
37. Explanation: svelte/motion exports spring (physics-based) and tweened (eased over duration), both store-like value animators.
38. Q6: What's a common performance pitfall?
39. A) Using |local
40. B) Using flip
41. C) Animating top/left instead of transform (*)
42. D) Using fade
43. Explanation: Animating layout properties (top/left/width/height) triggers reflow; prefer transform (translate/scale) for GPU-accelerated, 60fps motion.
44. Q7: Why do you need a stable key for animate:flip?
45. A) For sorting
46. B) Keys speed up rendering
47. C) You don't — index works fine
48. D) flip tracks item identity across renders via the key (*)
49. Explanation: flip needs to know which DOM node corresponds to which item across renders; a stable key enables correct position tracking.
50. Q8: How does spring differ from tweened?
51. A) spring uses physics (stiffness/damping); tweened uses fixed duration with easing (*)
52. B) spring is sync only
53. C) They're identical
54. D) tweened is deprecated
55. Explanation: spring produces natural motion via spring physics; tweened animates between values over a fixed duration with an easing function.
56. Q9: How do you respect prefers-reduced-motion?
57. A) You can't
58. B) Use the prefersReducedMotion store from svelte/motion to conditionally disable animations (*)
59. C) Set a global flag
60. D) Use CSS only
61. Explanation: svelte/motion exports `prefersReducedMotion`, a readable store that's true when the user prefers reduced motion — guard your transitions with it.
62. Q10: Where do you apply animate:flip?
63. A) On any element
64. B) On the parent <ul>
65. C) On the <li> inside an {#each} block (*)
66. D) On the button
67. Explanation: animate:flip goes on the iterated element inside {#each}; Svelte animates position changes between renders using FLIP.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which module provides fade, fly, slide?
  options:
    - svelte/animate
    - svelte/transition
    - svelte/motion
    - svelte/easing
  correctIndex: 1
  explanation: svelte/transition exports fade, fly, slide, scale, blur, draw; svelte/animate provides flip; svelte/motion provides spring/tweened.
- id: q2
  question: "What's the difference between transition: and in:/out:?"
  options:
    - None
    - "in:/out: are deprecated"
    - "transition: applies on enter AND exit; in:/out: apply separately"
    - "transition: is one-way only"
  correctIndex: 2
  explanation: "transition: is bidirectional; in: and out: let you specify different effects for enter and exit respectively."
- id: q3
  question: What does the |local modifier do?
  options:
    - Makes the transition local to the file
    - Disables the transition globally
    - Speeds up the transition
    - Limits a transition in {#each} to items actually added/removed
  correctIndex: 3
  explanation: Without |local, an {#each} reordering fires transitions for every item; |local restricts it to genuinely added/removed items.
- id: q4
  question: Which module provides the flip animation?
  options:
    - svelte/animate
    - svelte/transition
    - svelte/motion
    - svelte/easing
  correctIndex: 0
  explanation: svelte/animate exports flip, used in {#each} as `animate:flip={{ duration }}` to animate position changes via FLIP.
- id: q5
  question: Which module provides spring and tweened?
  options:
    - svelte/animate
    - svelte/motion
    - svelte/transition
    - svelte/store
  correctIndex: 1
  explanation: svelte/motion exports spring (physics-based) and tweened (eased over duration), both store-like value animators.
- id: q6
  question: What's a common performance pitfall?
  options:
    - Using |local
    - Using flip
    - Animating top/left instead of transform
    - Using fade
  correctIndex: 2
  explanation: Animating layout properties (top/left/width/height) triggers reflow; prefer transform (translate/scale) for GPU-accelerated, 60fps motion.
- id: q7
  question: Why do you need a stable key for animate:flip?
  options:
    - For sorting
    - Keys speed up rendering
    - You don't — index works fine
    - flip tracks item identity across renders via the key
  correctIndex: 3
  explanation: flip needs to know which DOM node corresponds to which item across renders; a stable key enables correct position tracking.
- id: q8
  question: How does spring differ from tweened?
  options:
    - spring uses physics (stiffness/damping); tweened uses fixed duration with easing
    - spring is sync only
    - They're identical
    - tweened is deprecated
  correctIndex: 0
  explanation: spring produces natural motion via spring physics; tweened animates between values over a fixed duration with an easing function.
- id: q9
  question: How do you respect prefers-reduced-motion?
  options:
    - You can't
    - Use the prefersReducedMotion store from svelte/motion to conditionally disable animations
    - Set a global flag
    - Use CSS only
  correctIndex: 1
  explanation: svelte/motion exports `prefersReducedMotion`, a readable store that's true when the user prefers reduced motion — guard your transitions with it.
- id: q10
  question: Where do you apply animate:flip?
  options:
    - On any element
    - On the parent <ul>
    - On the <li> inside an {#each} block
    - On the button
  correctIndex: 2
  explanation: animate:flip goes on the iterated element inside {#each}; Svelte animates position changes between renders using FLIP.
```

