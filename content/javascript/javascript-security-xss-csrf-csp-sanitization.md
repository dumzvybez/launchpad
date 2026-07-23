---
slug: javascript-security-xss-csrf-csp-sanitization
id: javascript-18
track: javascript
order: 18
title: Security — XSS, CSRF, CSP, and Sanitization
description: Defend JavaScript apps against XSS, CSRF, supply-chain attacks, and unsafe data handling — using CSP, sanitization, and secure patterns.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=PkZNo7MFNFg&t=14700s
whyItMatters: Defend JavaScript apps against XSS, CSRF, supply-chain attacks, and unsafe data handling — using CSP, sanitization, and secure patterns.
deepDiveResources:
  - label: W3Schools JavaScript
    url: https://www.w3schools.com/js/
    kind: course
  - label: JavaScript Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    kind: doc
---

# Security — XSS, CSRF, CSP, and Sanitization

## Security — XSS, CSRF, CSP, and Sanitization

### Why It Matters

Defend JavaScript apps against XSS, CSRF, supply-chain attacks, and unsafe data handling — using CSP, sanitization, and secure patterns.

Defend JavaScript apps against XSS, CSRF, supply-chain attacks, and unsafe data handling — using CSP, sanitization, and secure patterns.

### Prerequisites

- Stage 17: Performance — Bundle Size, Lazy Loading, Memory
- Understanding of the DOM (Stage 5) and Fetch (Stage 12).

### Topics

- XSS: stored, reflected, DOM-based
- innerHTML vs textContent vs DOMPurify
- Content Security Policy (CSP) headers
- CSRF tokens and SameSite cookies
- HttpOnly, Secure, SameSite cookie flags
- Subresource Integrity (SRI) for scripts
- Supply-chain risks: dependencies, lockfiles, npm audit
- Clickjacking and X-Frame-Options

### Key Concepts

- XSS lets attackers run JS in your origin — they can read localStorage, make authenticated requests, steal sessions
- The #1 XSS defense is using textContent for plain text and a sanitizer (DOMPurify) for HTML
- CSP restricts where scripts can load from and blocks inline scripts; report-only mode is a safe starting point
- CSRF is prevented with SameSite=Lax/Strict cookies and anti-CSRF tokens for state changes
- HttpOnly cookies can't be read by JS, defeating XSS token theft
- SRI hashes verify that third-party scripts haven't been tampered with

```javascript
// BAD: XSS if name comes from user input
element.innerHTML = `<h1>Welcome ${user.name}</h1>`;

// GOOD: textContent for plain text
element.textContent = `Welcome ${user.name}`;

// GOOD: DOMPurify for HTML
import DOMPurify from "dompurify";
element.innerHTML = DOMPurify.sanitize(userBioHtml);
```
Caption: Safe DOM updates

### Common Pitfalls

- Using `innerHTML` with user input — instant XSS; use textContent or DOMPurify.
- Storing auth tokens in localStorage — readable by XSS; use httpOnly cookies.
- Setting `SameSite=None` without `Secure` — browsers reject it; default to Lax.
- Allowing `unsafe-inline` in CSP for scripts — defeats most XSS protection; use nonces or hashes.
- Blindly trusting npm packages — supply-chain attacks are real; review deps, use npm audit, pin versions, consider socket.dev.

### Real-World Applications

- GitHub serves a strict CSP with nonces on every script tag, blocking inline XSS vectors across millions of pages.
- Google Docs sanitizes rich-text input via DOMPurify-like passes before rendering user content in contenteditable.
- Twitter's web client uses httpOnly cookies plus CSRF tokens for state changes, surviving repeated XSS disclosures.
- The npm ecosystem (Microsoft/GitHub) ships `npm audit` and Dependabot to surface known vulnerabilities across millions of projects.

### Interview Questions

- 1. What are the three types of XSS? — Stored (persisted in DB), Reflected (in URL, echoed), DOM-based (client-side sink like innerHTML).
- 2. How do you prevent XSS? — Use textContent for plain text, sanitize HTML with DOMPurify, set a strict CSP, never inject user data into HTML.
- 3. What does CSP do? — Restricts script/style/asset sources via HTTP header; blocks inline scripts unless nonced; reduces XSS blast radius.
- 4. How is CSRF prevented? — SameSite=Lax/Strict cookies, anti-CSRF tokens for state changes, check Origin/Referer headers.
- 5. Why use HttpOnly cookies? — JS can't read them, so even if XSS fires, attackers can't exfiltrate the session token.

### Mini Project

Build a "Guestbook" app where users submit messages that are rendered to everyone — with XSS defenses: textContent for the message, DOMPurify for an optional HTML mode, a CSP header (served from a tiny Node backend), and a SameSite cookie for the session. Suggested approach:
  - Frontend: form with message input + HTML-mode toggle
  - Use textContent by default; DOMPurify.sanitize when HTML mode is on
  - Backend: Express server setting CSP and SameSite=Strict cookie
  - Add a deliberately vulnerable "old view" page that uses innerHTML — demonstrate the attack
  - Add SRI to the DOMPurify script tag and verify with browser DevTools

### Exercises

1. Write a small XSS demo: inject `<img src=x onerror=alert(1)>` via innerHTML, then fix it with textContent.
2. Configure a CSP header in a Node server that blocks inline scripts; test with a script tag.
3. Set HttpOnly, Secure, SameSite=Lax cookies in Express; verify document.cookie is empty.
4. Add SRI to a CDN-hosted script; tamper with the file and observe the browser blocking it.
5. Run `npm audit` on a real project; fix the top 3 vulnerabilities.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: The primary defense against XSS for plain text is:
9. A) innerHTML
10. B) textContent (*)
11. C) outerHTML
12. D) document.write
13. Explanation: textContent never parses HTML, so user input is rendered as inert text — XSS-proof.
14. Q2: To render sanitized HTML, use:
15. A) innerHTML directly
16. B) DOMPurify.sanitize then innerHTML (*)
17. C) outerHTML
18. D) eval
19. Explanation: DOMPurify strips scripts and dangerous attributes, leaving only safe HTML; then innerHTML is safe.
20. Q3: HttpOnly cookies:
21. A) Can be read by JS
22. B) Cannot be read by JS, defeating XSS token theft (*)
23. C) Are encrypted
24. D) Only work in HTTPS
25. Explanation: HttpOnly blocks document.cookie access; combined with Secure, they're the safest session store.
26. Q4: SameSite=Lax:
27. A) Sends cookies on all cross-site requests
28. B) Blocks most cross-site cookie sends (CSRF defense) (*)
29. C) Deletes cookies
30. D) Is invalid
31. Explanation: Lax sends cookies on top-level GET navigations only; blocks cross-site POST — strong CSRF defense.
32. Q5: CSP primarily:
33. A) Encrypts traffic
34. B) Restricts script/asset sources to prevent XSS (*)
35. C) Adds cookies
36. D) Compresses JS
37. Explanation: A CSP header whitelists script/style/img sources, blocks inline scripts unless nonced, and reduces XSS impact.
38. Q6: SRI verifies:
39. A) TLS certificates
40. B) That a third-party script's hash matches (*)
41. C) CSP headers
42. D) Cookie flags
43. Explanation: Subresource Integrity adds an integrity hash to <script>/<link>; the browser blocks tampered files.
44. Q7: Storing auth tokens in localStorage is risky because:
45. A) It's slow
46. B) Any XSS can read them (*)
47. C) They expire too fast
48. D) They're shared across tabs
49. Explanation: localStorage is JS-readable; XSS exfiltrates tokens. Use httpOnly cookies for sessions.
50. Q8: A CSRF attack:
51. A) Steals cookies via JS
52. B) Tricks the user's browser into making state-changing requests (*)
53. C) Injects scripts
54. D) Encrypts traffic
55. Explanation: CSRF exploits the browser auto-attaching cookies to forge authenticated requests; SameSite + tokens defend.
56. Q9: `unsafe-inline` in a CSP for scripts:
57. A) Is recommended
58. B) Mostly defeats XSS protection — use nonces/hashes (*)
59. C) Required for HTTPS
60. D) Has no effect
61. Explanation: 'unsafe-inline' allows inline <script> tags and event handlers — a major XSS vector. Use nonces or hashes instead.
62. Q10: To mitigate supply-chain risk:
63. A) Install every package globally
64. B) Pin versions, audit deps, review new packages, use lockfiles (*)
65. C) Use only jQuery
66. D) Avoid npm
67. Explanation: Pin versions, run npm audit, review package behavior, and use tools like socket.dev or Dependabot to catch malicious packages.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: "The primary defense against XSS for plain text is:"
  options:
    - innerHTML
    - textContent
    - outerHTML
    - document.write
  correctIndex: 1
  explanation: textContent never parses HTML, so user input is rendered as inert text — XSS-proof.
- id: q2
  question: "To render sanitized HTML, use:"
  options:
    - innerHTML directly
    - DOMPurify.sanitize then innerHTML
    - outerHTML
    - eval
  correctIndex: 1
  explanation: DOMPurify strips scripts and dangerous attributes, leaving only safe HTML; then innerHTML is safe.
- id: q3
  question: "HttpOnly cookies:"
  options:
    - Can be read by JS
    - Cannot be read by JS, defeating XSS token theft
    - Are encrypted
    - Only work in HTTPS
  correctIndex: 1
  explanation: HttpOnly blocks document.cookie access; combined with Secure, they're the safest session store.
- id: q4
  question: "SameSite=Lax:"
  options:
    - Sends cookies on all cross-site requests
    - Blocks most cross-site cookie sends (CSRF defense)
    - Deletes cookies
    - Is invalid
  correctIndex: 1
  explanation: Lax sends cookies on top-level GET navigations only; blocks cross-site POST — strong CSRF defense.
- id: q5
  question: "CSP primarily:"
  options:
    - Encrypts traffic
    - Restricts script/asset sources to prevent XSS
    - Adds cookies
    - Compresses JS
  correctIndex: 1
  explanation: A CSP header whitelists script/style/img sources, blocks inline scripts unless nonced, and reduces XSS impact.
- id: q6
  question: "SRI verifies:"
  options:
    - TLS certificates
    - That a third-party script's hash matches
    - CSP headers
    - Cookie flags
  correctIndex: 1
  explanation: Subresource Integrity adds an integrity hash to <script>/<link>; the browser blocks tampered files.
- id: q7
  question: "Storing auth tokens in localStorage is risky because:"
  options:
    - It's slow
    - Any XSS can read them
    - They expire too fast
    - They're shared across tabs
  correctIndex: 1
  explanation: localStorage is JS-readable; XSS exfiltrates tokens. Use httpOnly cookies for sessions.
- id: q8
  question: "A CSRF attack:"
  options:
    - Steals cookies via JS
    - Tricks the user's browser into making state-changing requests
    - Injects scripts
    - Encrypts traffic
  correctIndex: 1
  explanation: CSRF exploits the browser auto-attaching cookies to forge authenticated requests; SameSite + tokens defend.
- id: q9
  question: "`unsafe-inline` in a CSP for scripts:"
  options:
    - Is recommended
    - Mostly defeats XSS protection — use nonces/hashes
    - Required for HTTPS
    - Has no effect
  correctIndex: 1
  explanation: "'unsafe-inline' allows inline <script> tags and event handlers — a major XSS vector. Use nonces or hashes instead."
- id: q10
  question: "To mitigate supply-chain risk:"
  options:
    - Install every package globally
    - Pin versions, audit deps, review new packages, use lockfiles
    - Use only jQuery
    - Avoid npm
  correctIndex: 1
  explanation: Pin versions, run npm audit, review package behavior, and use tools like socket.dev or Dependabot to catch malicious packages.
```

