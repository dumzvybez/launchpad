---
slug: html-html-email-newsletter-best-practices
id: html-16
track: html
order: 16
title: HTML Email and Newsletter Best Practices
description: Email HTML is a different world. This stage covers why you still use tables in 2024, inline CSS, preheader text, dark mode, and which modern HTML features will get your email silently dropped by Outlook.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=5900s
whyItMatters: Email HTML is a different world. This stage covers why you still use tables in 2024, inline CSS, preheader text, dark mode, and which modern HTML features will get your email silently dropped by Outlook.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# HTML Email and Newsletter Best Practices

## HTML Email and Newsletter Best Practices

### Why It Matters

Email HTML is a different world. This stage covers why you still use tables in 2024, inline CSS, preheader text, dark mode, and which modern HTML features will get your email silently dropped by Outlook.

Email HTML is a different world. This stage covers why you still use tables in 2024, inline CSS, preheader text, dark mode, and which modern HTML features will get your email silently dropped by Outlook.

### Prerequisites

- Stage 1: Getting Started with HTML
- Stage 4: Lists, Tables, and Structural Elements
- Stage 5: Forms and Input Elements (to understand why forms don't work in email)

### Topics

- Why email clients need table-based layouts (Outlook uses Word's renderer)
- Inline CSS: every style on every element
- Email-safe HTML subset: no `<form>`, no `<script>`, no `<video>`, no `<canvas>`
- Preheader text (the snippet visible after the subject line)
- Dark mode in email: `prefers-color-scheme` and Outlook's `data-ogsc` switches
- Accessibility in email: `role="presentation"`, alt text, semantic structure
- Bulletproof buttons (VML for Outlook)
- MJML and other email frameworks as a productivity layer

### Key Concepts

- Email HTML is HTML circa 2003 because Outlook (the most popular desktop client) renders with Microsoft Word's engine.
- All CSS must be inlined on each element; `<style>` blocks work in some clients but inline is safest.
- Preheader text is the first text in the email; it appears after the subject in the inbox preview.
- Use `role="presentation"` on layout tables so screen readers skip the table semantics.
- Forms, JavaScript, video, and external CSS do not work in email; link to a web version.

```html
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Newsletter — September 2024</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;">
  <!-- Preheader (hidden visually but shown in inbox preview) -->
  <div style="display:none;max-height:0;overflow:hidden;">
    Here's what's new this month: product launch, events, and a reader story.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:24px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border-radius:8px;">
        <tr><td style="padding:24px;font-family:sans-serif;">
          <h1 style="margin:0 0 12px;color:#111;">September Newsletter</h1>
          <p style="margin:0;color:#444;line-height:1.5;">
            Here's what's new this month.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
```
Caption: Email skeleton with preheader

### Common Pitfalls

- Using modern CSS (Grid, Flexbox, `position:fixed`) — unsupported in most email clients; use table layouts and inline styles.
- Including `<form>`, `<script>`, or `<video>` — stripped by email clients; link to a web version instead.
- Forgetting `role="presentation"` on layout tables — screen readers try to navigate them as data tables; mark layout tables as presentation.
- No alt text on images — many clients block images by default; alt text is the only thing users see until they enable images.
- Single-column 800px-wide emails — overflow on mobile; use a max 600-640px container and stack columns with media queries.

### Real-World Applications

- Mailchimp's template gallery ships dozens of table-based, inlined-CSS templates tested across 40+ email clients.
- Substack's newsletter renderer produces table-based HTML so posts look identical in Gmail, Outlook, and Apple Mail.
- GitHub's email notifications use a single 600px table with inlined styles and `role="presentation"` for layout.
- Stripe's transactional emails use bulletproof buttons (VML for Outlook) so CTAs render correctly everywhere.

### Interview Questions

- 1. Why do emails still use table layouts? — Outlook desktop uses Microsoft Word's HTML engine, which does not support modern CSS like Flexbox or Grid; tables are the only reliable layout.
- 2. What is preheader text? — The first text in an email body, shown as a preview snippet after the subject line in the inbox.
- 3. Why must CSS be inlined in email? — Some clients strip `<style>` blocks or ignore class selectors; inline styles on each element are the most reliable.
- 4. Why use `role="presentation"` on layout tables? — Tells screen readers the table is for layout, not data, so they do not announce row/column semantics.
- 5. Which HTML features do NOT work in email? — `<form>`, `<script>`, `<video>`, `<canvas>`, `<iframe>`, external CSS, and most modern CSS like Grid and Flexbox.

### Mini Project

Build a Newsletter Template: A 600px-wide responsive newsletter with a header image, hero block, two stacked article teasers, a bulletproof CTA button, social icons, and a footer with unsubscribe. Suggested approach:
  - Use `<table role="presentation">` for the outer 600px container
  - Inline every style on every element
  - Add hidden preheader text as the first content in `<body>`
  - Build the CTA with the bulletproof button pattern (VML for Outlook)
  - Test in Email on Acid or Litmus preview; verify in Gmail, Outlook, and Apple Mail

### Exercises

1. Inline all CSS in an existing email template using an inliner tool (e.g., juice) and verify nothing breaks.
2. Add `role="presentation"` to every layout table and confirm NVDA does not announce "table, 3 columns".
3. Write a preheader text under 100 characters that complements the subject line.
4. Build a bulletproof button and test it in Outlook (or a Litmus preview).
5. Add dark-mode styles with `prefers-color-scheme` and verify the email adapts in Apple Mail dark mode.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why do email templates still use table-based layouts?
9. A) Tables are faster
10. B) Outlook desktop uses Word's renderer, which lacks modern CSS support (*)
11. C) Email HTML is XML only
12. D) Accessibility requires it
13. Explanation: Outlook desktop (a major client) renders email with Microsoft Word's HTML engine, which does not support Flexbox/Grid; tables are the only reliable layout.
14. Q2: Which HTML element does NOT work in email?
15. A) <form> (*)
16. B) <p>
17. C) <table>
18. D) <img>
19. Explanation: Forms, scripts, video, canvas, and iframes are stripped by email clients; link to a web version instead.
20. Q3: Where should email CSS live?
21. A) In an external stylesheet
22. B) In <style> blocks only
23. C) Inlined on each element (*)
24. D) In <script> tags
25. Explanation: Inlined styles on each element are most reliable; some clients strip <style> blocks or ignore class selectors.
26. Q4: What is preheader text?
27. A) The email subject
28. B) The sender name
29. C) The first text in the body, shown as inbox preview (*)
30. D) The unsubscribe link
31. Explanation: Preheader is the snippet shown after the subject in inbox previews; it is the first text in the email body, often hidden visually.
32. Q5: Why use `role="presentation"` on layout tables in email?
33. A) So screen readers do not announce table semantics (*)
34. B) To make them faster
35. C) To validate the HTML
36. D) To enable dark mode
37. Explanation: `role="presentation"` tells screen readers the table is for layout, not data, so they do not announce "row, column" semantics.
38. Q6: What is the recommended max width for an email container?
39. A) 320px
40. B) 600-640px (*)
41. C) 800px
42. D) 1200px
43. Explanation: 600-640px ensures the email fits within the preview pane of most desktop clients and stacks gracefully on mobile.
44. Q7: Which technique makes buttons render in Outlook?
45. A) CSS border-radius
46. B) SVG buttons
47. C) CSS Grid
48. D) VML (Vector Markup Language) roundrect (*)
49. Explanation: Outlook does not support CSS border-radius on links; VML `<v:roundrect>` wrapped in `<!--[if mso]>` provides rounded buttons in Outlook.
50. Q8: Why must images in email have alt text?
51. A) For SEO
52. B) It is required for validation
53. C) To speed up loading
54. D) Many clients block images by default; alt is all users see until enabled (*)
55. Explanation: Most email clients block remote images by default; alt text is the only thing users see until they enable images, making it critical for context.
56. Q9: Which CSS layout technique is UNSUPPORTED in most email clients?
57. A) Inline styles
58. B) Table cells
59. C) Font-family
60. D) Flexbox and Grid (*)
61. Explanation: Flexbox and Grid are unsupported in Outlook and many other clients; stick to table-based layouts and inline CSS.
62. Q10: What is MJML?
63. A) A markup language that compiles to table-based HTML email (*)
64. B) A new email protocol
65. C) A JavaScript framework
66. D) An email service provider
67. Explanation: MJML is a domain-specific language that compiles to responsive, table-based HTML email, abstracting away Outlook quirks.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why do email templates still use table-based layouts?
  options:
    - Tables are faster
    - Outlook desktop uses Word's renderer, which lacks modern CSS support
    - Email HTML is XML only
    - Accessibility requires it
  correctIndex: 1
  explanation: Outlook desktop (a major client) renders email with Microsoft Word's HTML engine, which does not support Flexbox/Grid; tables are the only reliable layout.
- id: q2
  question: Which HTML element does NOT work in email?
  options:
    - <form>
    - <p>
    - <table>
    - <img>
  correctIndex: 0
  explanation: Forms, scripts, video, canvas, and iframes are stripped by email clients; link to a web version instead.
- id: q3
  question: Where should email CSS live?
  options:
    - In an external stylesheet
    - In <style> blocks only
    - Inlined on each element
    - In <script> tags
  correctIndex: 2
  explanation: Inlined styles on each element are most reliable; some clients strip <style> blocks or ignore class selectors.
- id: q4
  question: What is preheader text?
  options:
    - The email subject
    - The sender name
    - The first text in the body, shown as inbox preview
    - The unsubscribe link
  correctIndex: 2
  explanation: Preheader is the snippet shown after the subject in inbox previews; it is the first text in the email body, often hidden visually.
- id: q5
  question: Why use `role="presentation"` on layout tables in email?
  options:
    - So screen readers do not announce table semantics
    - To make them faster
    - To validate the HTML
    - To enable dark mode
  correctIndex: 0
  explanation: '`role="presentation"` tells screen readers the table is for layout, not data, so they do not announce "row, column" semantics.'
- id: q6
  question: What is the recommended max width for an email container?
  options:
    - 320px
    - 600-640px
    - 800px
    - 1200px
  correctIndex: 1
  explanation: 600-640px ensures the email fits within the preview pane of most desktop clients and stacks gracefully on mobile.
- id: q7
  question: Which technique makes buttons render in Outlook?
  options:
    - CSS border-radius
    - SVG buttons
    - CSS Grid
    - VML (Vector Markup Language) roundrect
  correctIndex: 3
  explanation: Outlook does not support CSS border-radius on links; VML `<v:roundrect>` wrapped in `<!--[if mso]>` provides rounded buttons in Outlook.
- id: q8
  question: Why must images in email have alt text?
  options:
    - For SEO
    - It is required for validation
    - To speed up loading
    - Many clients block images by default; alt is all users see until enabled
  correctIndex: 3
  explanation: Most email clients block remote images by default; alt text is the only thing users see until they enable images, making it critical for context.
- id: q9
  question: Which CSS layout technique is UNSUPPORTED in most email clients?
  options:
    - Inline styles
    - Table cells
    - Font-family
    - Flexbox and Grid
  correctIndex: 3
  explanation: Flexbox and Grid are unsupported in Outlook and many other clients; stick to table-based layouts and inline CSS.
- id: q10
  question: What is MJML?
  options:
    - A markup language that compiles to table-based HTML email
    - A new email protocol
    - A JavaScript framework
    - An email service provider
  correctIndex: 0
  explanation: MJML is a domain-specific language that compiles to responsive, table-based HTML email, abstracting away Outlook quirks.
```

