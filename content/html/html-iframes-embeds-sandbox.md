---
slug: html-iframes-embeds-sandbox
id: html-13
track: html
order: 13
title: iframes, Embeds, and Sandbox
description: Embed third-party content safely. This stage covers the `<iframe>` element, the `sandbox` attribute, the `allow` attribute, `postMessage` for cross-frame communication, and the headers that control who can frame your pages.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=4700s
whyItMatters: Embed third-party content safely. This stage covers the `<iframe>` element, the `sandbox` attribute, the `allow` attribute, `postMessage` for cross-frame communication, and the headers that control who can frame your pages.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# iframes, Embeds, and Sandbox

## iframes, Embeds, and Sandbox

### Why It Matters

Embed third-party content safely. This stage covers the `<iframe>` element, the `sandbox` attribute, the `allow` attribute, `postMessage` for cross-frame communication, and the headers that control who can frame your pages.

Embed third-party content safely. This stage covers the `<iframe>` element, the `sandbox` attribute, the `allow` attribute, `postMessage` for cross-frame communication, and the headers that control who can frame your pages.

### Prerequisites

- Stage 1: Getting Started with HTML
- Stage 7: Media — Audio, Video, Embeds
- Stage 8: Accessibility (a11y) Fundamentals

### Topics

- The `<iframe>` element: `src`, `srcdoc`, `name`, `width`, `height`, `loading`, `title`
- The `sandbox` attribute and its flags (`allow-scripts`, `allow-same-origin`, `allow-forms`, `allow-popups`, etc.)
- The `allow` attribute for browser-feature permissions (camera, microphone, geolocation, fullscreen)
- `srcdoc` for inline iframe content
- `postMessage` and `MessageChannel` for cross-frame messaging
- `X-Frame-Options` (DENY, SAMEORIGIN) — legacy header
- CSP `frame-ancestors` directive — modern replacement for X-Frame-Options
- CSP `frame-src` for embedding trusted sources

### Key Concepts

- An iframe without `sandbox` runs with full privileges of its origin; always sandbox untrusted content.
- `sandbox` with no value applies ALL restrictions; you re-enable specific abilities with flags like `allow-scripts`.
- Never combine `allow-scripts` and `allow-same-origin` on untrusted content — it lets the framed page remove its own sandbox.
- `postMessage` is the only safe way to communicate across iframe origins; always verify `event.origin`.
- `X-Frame-Options` is deprecated in favor of CSP `frame-ancestors`, but include both for older browser support.

```html
<iframe
  src="https://widget.example/embed"
  title="Acme weather widget — shows current temperature and forecast"
  width="320" height="200"
  sandbox="allow-scripts"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade">
</iframe>
```
Caption: Sandboxed iframe with title

### Common Pitfalls

- Iframe without `sandbox` — runs with full privileges of its origin; sandbox all untrusted or third-party content.
- Missing `title` on iframe — screen readers announce "frame" with no context; always add a descriptive `title`.
- `postMessage` without origin verification — any origin can send messages; always check `event.origin` against an allowlist.
- Combining `allow-scripts` and `allow-same-origin` on untrusted content — the framed page can modify its own `sandbox` attribute and escape; never do this for third-party content.
- Using only `X-Frame-Options` — deprecated and less flexible than CSP; use `Content-Security-Policy: frame-ancestors` for modern protection.

### Real-World Applications

- YouTube embeds use `<iframe>` with `sandbox`-like restrictions and an `allow` attribute for fullscreen and autoplay.
- Google Maps embeds use `<iframe>` with a descriptive `title` and `loading="lazy"` to defer map load until scroll.
- CodeSandbox runs user code in a sandboxed `<iframe>` with `sandbox="allow-scripts allow-modals allow-popups"` but never `allow-same-origin`.
- Stripe Payment Element uses `postMessage` with strict origin verification to communicate between the parent page and the iframe'd card form.

### Interview Questions

- 1. Why must every `<iframe>` have a `title`? — Screen readers announce "frame" with no context; the title provides the accessible name.
- 2. What is the most dangerous `sandbox` combination for untrusted content? — `allow-scripts allow-same-origin` together let the framed page remove its own sandbox attribute and escape.
- 3. How does `postMessage` security work? — Sender specifies target origin; receiver must verify `event.origin` against an allowlist before trusting the data.
- 4. What is the difference between `X-Frame-Options` and CSP `frame-ancestors`? — `frame-ancestors` supports multiple origins and wildcards; `X-Frame-Options` supports only DENY or SAMEORIGIN and is deprecated.
- 5. What does the `allow` attribute do? — Grants specific browser permissions (camera, microphone, geolocation, fullscreen) to the framed page, replacing per-feature attributes.

### Mini Project

Build a Sandboxed Widget Embed: A page that embeds a third-party widget (use a YouTube or Maps embed) with a strict `sandbox`, descriptive `title`, and `loading="lazy"`. Then build a parent/child iframe pair that exchanges data via `postMessage` with origin verification. Suggested approach:
  - Embed a YouTube video with `sandbox="allow-scripts allow-same-origin allow-popups"` and a descriptive `title`
  - Add `loading="lazy"` so the iframe defers until scroll
  - Create a parent.html and child.html on different ports/origins
  - Parent sends `{type:'hello'}` to child via `postMessage(msg, 'https://childorigin')`
  - Child receives, verifies `event.origin`, and replies with `{type:'ack'}`

### Exercises

1. Add `title` to every iframe on a page and verify NVDA announces it.
2. Set `sandbox=""` (no flags) on an iframe and confirm no scripts run, no forms submit.
3. Add `loading="lazy"` to below-the-fold iframes and verify they don't load until scroll.
4. Send a `postMessage` from an iframe to its parent and verify the parent checks `event.origin`.
5. Set CSP `frame-ancestors 'none'` on a page and verify it cannot be embedded anywhere.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which attribute on `<iframe>` provides an accessible name?
9. A) alt
10. B) aria-label
11. C) title (*)
12. D) name
13. Explanation: The `title` attribute is the standard accessible name for iframes; screen readers announce "frame, [title]".
14. Q2: What does an empty `sandbox` attribute (no flags) do?
15. A) Allows everything
16. B) Applies all restrictions: no scripts, no forms, no popups, treats as unique origin (*)
17. C) Disables the iframe entirely
18. D) Enables only scripts
19. Explanation: `sandbox=""` applies all restrictions; you opt back into specific capabilities with flags like `allow-scripts`.
20. Q3: Which `sandbox` combination is dangerous for untrusted content?
21. A) allow-scripts only
22. B) allow-forms only
23. C) allow-popups only
24. D) allow-scripts allow-same-origin (*)
25. Explanation: With both `allow-scripts` and `allow-same-origin`, the framed page can modify its own `sandbox` attribute and escape the sandbox entirely.
26. Q4: How must a `postMessage` receiver validate the message?
27. A) Check `event.source`
28. B) Check `event.timeStamp`
29. C) Check `event.origin` against an allowlist (*)
30. D) No validation needed
31. Explanation: Any origin can call `postMessage`; the receiver MUST verify `event.origin` matches an expected value before trusting the data.
32. Q5: Which modern header replaces `X-Frame-Options`?
33. A) CSP `frame-ancestors` (*)
34. B) CSP `child-src`
35. C) `X-Frame-Source`
36. D) `X-Embed-Allowed`
37. Explanation: `Content-Security-Policy: frame-ancestors` supports multiple origins and wildcards; `X-Frame-Options` is deprecated but kept for backward compatibility.
38. Q6: What is `srcdoc` used for?
39. A) Loading external HTML into the iframe
40. B) Inline HTML content for the iframe (*)
41. C) Setting the iframe's title
42. D) Encoding the iframe sandbox
43. Explanation: `srcdoc="<p>Hi</p>"` provides the iframe's HTML inline, useful for demos and widgets that don't need a separate URL.
44. Q7: Which attribute on `<iframe>` defers loading until near the viewport?
45. A) loading="lazy" (*)
46. B) lazy
47. C) defer
48. D) async
49. Explanation: `loading="lazy"` (the same attribute used on `<img>`) defers iframe load until the user scrolls near it, improving performance.
50. Q8: What does the `allow` attribute grant?
51. A) Cross-origin access
52. B) Permissions for browser features like camera and fullscreen (*)
53. C) CSS feature queries
54. D) Form submission rights
55. Explanation: `allow="camera; microphone; fullscreen"` grants specific Permissions Policy features to the framed page.
56. Q9: Which value of `X-Frame-Options` blocks all framing?
57. A) DENY (*)
58. B) SAMEORIGIN
59. C) ALLOW-FROM
60. D) NONE
61. Explanation: `X-Frame-Options: DENY` blocks all framing; `SAMEORIGIN` allows only same-origin; `ALLOW-FROM` is deprecated and ignored by modern browsers.
62. Q10: When should you sandbox first-party content?
63. A) Never — first-party is always trusted
64. B) Only on Mondays
65. C) Sandboxing breaks first-party iframes
66. D) When it runs user-provided or untrusted code, e.g., a code playground (*)
67. Explanation: Even first-party content should be sandboxed when it executes untrusted code (e.g., a JS playground), as the sandbox limits blast radius if the code is malicious.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which attribute on `<iframe>` provides an accessible name?
  options:
    - alt
    - aria-label
    - title
    - name
  correctIndex: 2
  explanation: The `title` attribute is the standard accessible name for iframes; screen readers announce "frame, [title]".
- id: q2
  question: What does an empty `sandbox` attribute (no flags) do?
  options:
    - Allows everything
    - "Applies all restrictions: no scripts, no forms, no popups, treats as unique origin"
    - Disables the iframe entirely
    - Enables only scripts
  correctIndex: 1
  explanation: '`sandbox=""` applies all restrictions; you opt back into specific capabilities with flags like `allow-scripts`.'
- id: q3
  question: Which `sandbox` combination is dangerous for untrusted content?
  options:
    - allow-scripts only
    - allow-forms only
    - allow-popups only
    - allow-scripts allow-same-origin
  correctIndex: 3
  explanation: With both `allow-scripts` and `allow-same-origin`, the framed page can modify its own `sandbox` attribute and escape the sandbox entirely.
- id: q4
  question: How must a `postMessage` receiver validate the message?
  options:
    - Check `event.source`
    - Check `event.timeStamp`
    - Check `event.origin` against an allowlist
    - No validation needed
  correctIndex: 2
  explanation: Any origin can call `postMessage`; the receiver MUST verify `event.origin` matches an expected value before trusting the data.
- id: q5
  question: Which modern header replaces `X-Frame-Options`?
  options:
    - CSP `frame-ancestors`
    - CSP `child-src`
    - "`X-Frame-Source`"
    - "`X-Embed-Allowed`"
  correctIndex: 0
  explanation: "`Content-Security-Policy: frame-ancestors` supports multiple origins and wildcards; `X-Frame-Options` is deprecated but kept for backward compatibility."
- id: q6
  question: What is `srcdoc` used for?
  options:
    - Loading external HTML into the iframe
    - Inline HTML content for the iframe
    - Setting the iframe's title
    - Encoding the iframe sandbox
  correctIndex: 1
  explanation: "`srcdoc=\"<p>Hi</p>\"` provides the iframe's HTML inline, useful for demos and widgets that don't need a separate URL."
- id: q7
  question: Which attribute on `<iframe>` defers loading until near the viewport?
  options:
    - loading="lazy"
    - lazy
    - defer
    - async
  correctIndex: 0
  explanation: '`loading="lazy"` (the same attribute used on `<img>`) defers iframe load until the user scrolls near it, improving performance.'
- id: q8
  question: What does the `allow` attribute grant?
  options:
    - Cross-origin access
    - Permissions for browser features like camera and fullscreen
    - CSS feature queries
    - Form submission rights
  correctIndex: 1
  explanation: '`allow="camera; microphone; fullscreen"` grants specific Permissions Policy features to the framed page.'
- id: q9
  question: Which value of `X-Frame-Options` blocks all framing?
  options:
    - DENY
    - SAMEORIGIN
    - ALLOW-FROM
    - NONE
  correctIndex: 0
  explanation: "`X-Frame-Options: DENY` blocks all framing; `SAMEORIGIN` allows only same-origin; `ALLOW-FROM` is deprecated and ignored by modern browsers."
- id: q10
  question: When should you sandbox first-party content?
  options:
    - Never — first-party is always trusted
    - Only on Mondays
    - Sandboxing breaks first-party iframes
    - When it runs user-provided or untrusted code, e.g., a code playground
  correctIndex: 3
  explanation: Even first-party content should be sandboxed when it executes untrusted code (e.g., a JS playground), as the sandbox limits blast radius if the code is malicious.
```

