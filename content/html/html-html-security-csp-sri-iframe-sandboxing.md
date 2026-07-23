---
slug: html-html-security-csp-sri-iframe-sandboxing
id: html-19
track: html
order: 19
title: HTML Security — CSP, SRI, iframe Sandboxing
description: Lock down your page against XSS, supply-chain attacks, and clickjacking. This stage covers Content Security Policy, Subresource Integrity, security headers, and how to embed third-party content safely.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=7100s
whyItMatters: Lock down your page against XSS, supply-chain attacks, and clickjacking. This stage covers Content Security Policy, Subresource Integrity, security headers, and how to embed third-party content safely.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# HTML Security — CSP, SRI, iframe Sandboxing

## HTML Security — CSP, SRI, iframe Sandboxing

### Why It Matters

Lock down your page against XSS, supply-chain attacks, and clickjacking. This stage covers Content Security Policy, Subresource Integrity, security headers, and how to embed third-party content safely.

Lock down your page against XSS, supply-chain attacks, and clickjacking. This stage covers Content Security Policy, Subresource Integrity, security headers, and how to embed third-party content safely.

### Prerequisites

- Stage 13: iframes, Embeds, and Sandbox
- Stage 17: HTML for PWAs (HTTPS context)
- Stage 18: HTML Performance (resource loading)

### Topics

- Content Security Policy (CSP): directives (`default-src`, `script-src`, `style-src`, `img-src`, `connect-src`, `frame-src`, `font-src`, `base-uri`, `form-action`)
- CSP via `<meta http-equiv="Content-Security-Policy">` vs HTTP header
- `nonce` and `hash` sources for inline scripts
- Subresource Integrity (SRI): `integrity` and `crossorigin` on `<script>` and `<link>`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy` via `<meta name="referrer">`
- `Permissions-Policy` header (formerly Feature-Policy)
- Clickjacking defense: CSP `frame-ancestors` and `X-Frame-Options`
- Mixed content: HTTPS page loading HTTP resources

### Key Concepts

- CSP is the most powerful XSS mitigation: it tells the browser which sources are allowed for each resource type, blocking the rest.
- `unsafe-inline` and `unsafe-eval` in CSP defeat most of its protection; prefer nonces or hashes for inline scripts.
- SRI verifies a third-party script's hash before execution; if the CDN is compromised and the file changes, the browser blocks it.
- A page served over HTTPS that loads HTTP resources triggers mixed-content warnings and the browser blocks active mixed content.
- `frame-ancestors 'none'` in CSP prevents your page from being framed anywhere (clickjacking defense).

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'nonce-abc123' https://cdn.example.com;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://api.example.com;
               frame-ancestors 'none';
               base-uri 'none';
               form-action 'self'">
<script nonce="abc123">console.log('Inline script with matching nonce');</script>
```
Caption: CSP via meta tag

### Common Pitfalls

- `unsafe-inline` in `script-src` — defeats most CSP protection; use nonces or hashes for inline scripts.
- Missing SRI on third-party scripts — if the CDN is compromised, the altered script runs on your page; always add `integrity`.
- Mixed content (HTTPS page loading HTTP resources) — browser blocks active mixed content and warns on passive; use protocol-relative URLs or HTTPS only.
- Setting CSP via meta only — meta CSP cannot set `frame-ancestors`, `report-uri`, or `sandbox`; use the HTTP header for full coverage.
- Forgetting `crossorigin="anonymous"` on SRI scripts — without it the browser makes a no-CORS request and SRI verification fails silently.

### Real-World Applications

- GitHub ships a strict CSP with nonces for inline scripts and SRI on all third-party libraries across millions of pages.
- Cloudflare's dashboard uses CSP, `X-Frame-Options: DENY`, and SRI on every page to defend against XSS and supply-chain attacks.
- MDN sets CSP, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin` on every doc page.
- Twitter's embed widget uses SRI on its `platform.js` script so a compromise of the CDN cannot inject malicious code into embedders.

### Interview Questions

- 1. What is Content Security Policy (CSP)? — An HTTP header (or meta tag) that tells the browser which sources are allowed for each resource type, mitigating XSS by blocking unapproved sources.
- 2. Why is `unsafe-inline` discouraged? — It allows any inline script to execute, defeating CSP's main XSS protection; use nonces or hashes instead.
- 3. What does Subresource Integrity (SRI) do? — Verifies a third-party script's hash before execution; if the file is tampered with, the browser blocks it.
- 4. How do you prevent clickjacking? — Set CSP `frame-ancestors 'none'` (or `X-Frame-Options: DENY`) so your page cannot be framed.
- 5. What is mixed content? — An HTTPS page loading HTTP resources; browsers block active mixed content (scripts, iframes) and warn on passive (images).

### Mini Project

Build a CSP-Secured Page: A page with a strict CSP (no `unsafe-inline`), SRI on a third-party script, `Referrer-Policy`, and a sandboxed iframe. Verify no console violations appear. Suggested approach:
  - Generate a per-request nonce and put it in CSP `script-src` and on inline scripts
  - Load a third-party library from a CDN with `integrity` and `crossorigin="anonymous"`
  - Set `<meta name="referrer" content="strict-origin-when-cross-origin">`
  - Embed a YouTube iframe with `sandbox="allow-scripts allow-same-origin allow-popups"`
  - Open DevTools console and confirm zero CSP violations while interacting with the page

### Exercises

1. Set `Content-Security-Policy-Report-Only` first to find violations without breaking the page.
2. Add SRI to every third-party script on your page using the `integrity` attribute.
3. Convert an inline `onclick` handler to an event listener with a CSP nonce.
4. Set `X-Frame-Options: DENY` and verify your page cannot be embedded in an iframe.
5. Audit your page for mixed content with Lighthouse and fix all HTTP URLs to HTTPS.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the primary purpose of Content Security Policy?
9. A) Faster page loads
10. B) Better SEO
11. C) Mitigating XSS by restricting resource sources (*)
12. D) Email security
13. Explanation: CSP tells the browser which sources are allowed for scripts, styles, images, etc., blocking unauthorized content even if XSS injects it.
14. Q2: Which CSP source value should you AVOID for inline scripts?
15. A) 'self'
16. B) 'nonce-abc123'
17. C) 'sha256-...'
18. D) 'unsafe-inline' (*)
19. Explanation: `unsafe-inline` allows any inline script to run, defeating CSP's XSS protection; use nonces or hashes instead.
20. Q3: What does Subresource Integrity (SRI) verify?
21. A) The script's license
22. B) The script's file size
23. C) The script's author
24. D) The script's hash matches the expected value (*)
25. Explanation: SRI hashes the fetched file and compares to the `integrity` attribute; if they differ (e.g., CDN compromised), the browser blocks execution.
26. Q4: Which attribute is REQUIRED alongside SRI for cross-origin scripts?
27. A) type="module"
28. B) async
29. C) crossorigin="anonymous" (*)
30. D) defer
31. Explanation: SRI requires CORS; without `crossorigin="anonymous"` the browser makes a no-CORS request and the integrity check is skipped.
32. Q5: How do you prevent your page from being framed (clickjacking defense)?
33. A) CSP frame-ancestors 'none' (or X-Frame-Options: DENY) (*)
34. B) <meta name="frame" content="none">
35. C) sandbox attribute
36. D) rel="noopener"
37. Explanation: `frame-ancestors 'none'` in CSP (or `X-Frame-Options: DENY`) prevents any page from embedding yours in an iframe.
38. Q6: What is mixed content?
39. A) A page with both images and text
40. B) An HTTPS page loading HTTP resources (*)
41. C) A page with multiple CSS files
42. D) A page with mixed languages
43. Explanation: Mixed content occurs when an HTTPS page loads HTTP resources; browsers block active mixed content (scripts) and warn on passive (images).
44. Q7: Why prefer CSP via HTTP header over `<meta>`?
45. A) Meta CSP is invalid
46. B) Header is slower
47. C) Meta CSP cannot set frame-ancestors, report-uri, or sandbox (*)
48. D) Meta is deprecated
49. Explanation: Meta CSP cannot set `frame-ancestors`, `report-uri`, or `sandbox` directives; use the HTTP header for full coverage.
50. Q8: What does `X-Content-Type-Options: nosniff` do?
51. A) Prevents MIME-type sniffing; the browser respects declared Content-Type (*)
52. B) Blocks all scripts
53. C) Enables caching
54. D) Disables cookies
55. Explanation: Without `nosniff`, browsers may sniff a file's actual type and execute a non-script file as a script; `nosniff` blocks this.
56. Q9: What does `Referrer-Policy: strict-origin-when-cross-origin` send for a cross-origin request?
57. A) The full URL
58. B) Only the origin (scheme + host) (*)
59. C) Nothing
60. D) The path only
61. Explanation: For cross-origin requests, this policy sends only the origin (e.g., `https://example.com/`); same-origin requests still send the full URL.
62. Q10: Which `sandbox` flag combination is dangerous for untrusted iframe content?
63. A) allow-scripts only
64. B) allow-forms only
65. C) allow-popups only
66. D) allow-scripts allow-same-origin (*)
67. Explanation: With both `allow-scripts` and `allow-same-origin`, the framed page can manipulate its own sandbox attribute and escape — never use this combo for untrusted content.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the primary purpose of Content Security Policy?
  options:
    - Faster page loads
    - Better SEO
    - Mitigating XSS by restricting resource sources
    - Email security
  correctIndex: 2
  explanation: CSP tells the browser which sources are allowed for scripts, styles, images, etc., blocking unauthorized content even if XSS injects it.
- id: q2
  question: Which CSP source value should you AVOID for inline scripts?
  options:
    - "'self'"
    - "'nonce-abc123'"
    - "'sha256-...'"
    - "'unsafe-inline'"
  correctIndex: 3
  explanation: "`unsafe-inline` allows any inline script to run, defeating CSP's XSS protection; use nonces or hashes instead."
- id: q3
  question: What does Subresource Integrity (SRI) verify?
  options:
    - verify?
    - The script's license
    - The script's file size
    - The script's author
    - The script's hash matches the expected value
  correctIndex: 4
  explanation: SRI hashes the fetched file and compares to the `integrity` attribute; if they differ (e.g., CDN compromised), the browser blocks execution.
- id: q4
  question: Which attribute is REQUIRED alongside SRI for cross-origin scripts?
  options:
    - type="module"
    - async
    - crossorigin="anonymous"
    - defer
  correctIndex: 2
  explanation: SRI requires CORS; without `crossorigin="anonymous"` the browser makes a no-CORS request and the integrity check is skipped.
- id: q5
  question: How do you prevent your page from being framed (clickjacking defense)?
  options:
    - "CSP frame-ancestors 'none' (or X-Frame-Options: DENY)"
    - <meta name="frame" content="none">
    - sandbox attribute
    - rel="noopener"
  correctIndex: 0
  explanation: "`frame-ancestors 'none'` in CSP (or `X-Frame-Options: DENY`) prevents any page from embedding yours in an iframe."
- id: q6
  question: What is mixed content?
  options:
    - A page with both images and text
    - An HTTPS page loading HTTP resources
    - A page with multiple CSS files
    - A page with mixed languages
  correctIndex: 1
  explanation: Mixed content occurs when an HTTPS page loads HTTP resources; browsers block active mixed content (scripts) and warn on passive (images).
- id: q7
  question: Why prefer CSP via HTTP header over `<meta>`?
  options:
    - Meta CSP is invalid
    - Header is slower
    - Meta CSP cannot set frame-ancestors, report-uri, or sandbox
    - Meta is deprecated
  correctIndex: 2
  explanation: Meta CSP cannot set `frame-ancestors`, `report-uri`, or `sandbox` directives; use the HTTP header for full coverage.
- id: q8
  question: "What does `X-Content-Type-Options: nosniff` do?"
  options:
    - Prevents MIME-type sniffing; the browser respects declared Content-Type
    - Blocks all scripts
    - Enables caching
    - Disables cookies
  correctIndex: 0
  explanation: Without `nosniff`, browsers may sniff a file's actual type and execute a non-script file as a script; `nosniff` blocks this.
- id: q9
  question: "What does `Referrer-Policy: strict-origin-when-cross-origin` send for a cross-origin request?"
  options:
    - The full URL
    - Only the origin (scheme + host)
    - Nothing
    - The path only
  correctIndex: 1
  explanation: For cross-origin requests, this policy sends only the origin (e.g., `https://example.com/`); same-origin requests still send the full URL.
- id: q10
  question: Which `sandbox` flag combination is dangerous for untrusted iframe content?
  options:
    - allow-scripts only
    - allow-forms only
    - allow-popups only
    - allow-scripts allow-same-origin
  correctIndex: 3
  explanation: With both `allow-scripts` and `allow-same-origin`, the framed page can manipulate its own sandbox attribute and escape — never use this combo for untrusted content.
```

