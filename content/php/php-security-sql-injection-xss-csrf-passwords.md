---
slug: php-security-sql-injection-xss-csrf-passwords
id: php-15
track: php
order: 15
title: Security — SQL Injection, XSS, CSRF, Passwords
description: "Defend PHP applications against the four most common web vulnerabilities: SQL injection (prepared statements), XSS (context-aware escaping), CSRF (token rotation), and password storage (Argon2id)."
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=11200s
whyItMatters: "Defend PHP applications against the four most common web vulnerabilities: SQL injection (prepared statements), XSS (context-aware escaping), CSRF (token rotation), and password storage (Argon2id)."
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Security — SQL Injection, XSS, CSRF, Passwords

## Security — SQL Injection, XSS, CSRF, Passwords

### Why It Matters

Defend PHP applications against the four most common web vulnerabilities: SQL injection (prepared statements), XSS (context-aware escaping), CSRF (token rotation), and password storage (Argon2id).

Defend PHP applications against the four most common web vulnerabilities: SQL injection (prepared statements), XSS (context-aware escaping), CSRF (token rotation), and password storage (Argon2id).

### Prerequisites

- Stage 7: Forms, $_GET, $_POST, and Validation
- Stage 8: Sessions, Cookies, and Authentication
- Stage 14: PDO and Database Access

### Topics

- OWASP Top 10 context: injection, broken auth, XSS, CSRF
- SQL injection: classic examples, blind SQLi, second-order
- Prepared statements as the only defense (with identifier allow-lists)
- XSS: reflected, stored, DOM — context-aware escaping (HTML, attr, URL, JS, CSS)
- `htmlspecialchars` flags: `ENT_QUOTES | ENT_HTML5`, charset
- CSRF: tokens, `SameSite` cookies, double-submit, Origin/Referer headers
- Password storage: `password_hash` (Argon2id), `password_verify`, `password_needs_rehash`
- Timing attacks and `hash_equals`
- Security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- File upload security (revisited from Stage 9): MIME sniffing, executable extensions
- Mass assignment and `$fillable`-style allow-lists

### Key Concepts

- SQL injection is prevented ONLY by parameterized queries — escaping functions like `addslashes` are insufficient; even stored procedures with dynamic SQL can be vulnerable if they concatenate.
- XSS prevention is context-dependent: `htmlspecialchars` for HTML body, attribute encoding for HTML attributes, `json_encode` for `<script>` contexts, URL-encoding for URLs. There is no single "make safe" function.
- CSRF defenses work in layers: (1) `SameSite=Lax` or `Strict` cookies block most cross-site submissions; (2) per-session CSRF tokens verified with `hash_equals` for the rest; (3) custom headers (e.g. `X-Requested-With`) for API calls.
- `password_needs_rehash($hash, PASSWORD_DEFAULT)` lets you upgrade hashes when you increase bcrypt cost or switch to Argon2id — call it on every successful login and re-store the new hash.
- Security headers (`Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`) are a cheap, high-impact defense layer — set them globally in your front controller or web server config.

```php
<?php
// VULNERABLE — classic SQL injection
$pdo->query("SELECT * FROM users WHERE name = '" . $_GET['name'] . "'");
// Attack: ?name=Ada' OR '1'='1   ->   SELECT * FROM users WHERE name = 'Ada' OR '1'='1'

// SAFE — parameterized
$stmt = $pdo->prepare('SELECT * FROM users WHERE name = :name');
$stmt->execute([':name' => $_GET['name'] ?? '']);

// SAFE — identifier allow-list (column names can't be parameterized)
$sort = $_GET['sort'] ?? 'id';
if (!in_array($sort, ['id', 'name', 'created_at'], true)) { $sort = 'id'; }
$stmt = $pdo->prepare("SELECT * FROM users ORDER BY $sort");
$stmt->execute();
```
Caption: SQL injection — vulnerable vs safe

### Common Pitfalls

- Using `addslashes` or `str_replace` for SQL escaping — both miss multibyte edge cases and DB-specific quirks; only prepared statements (or `PDO::quote`) are safe against SQL injection.
- Using `htmlspecialchars` for JavaScript context — `htmlspecialchars` escapes for HTML, not for `<script>`; use `json_encode` with hex flags to safely embed data in JS.
- Storing CSRF tokens in cookies without `httponly` — a successful XSS can read the cookie and submit it back; store tokens in `$_SESSION` (server-side) or use double-submit with `httponly` cookies and SameSite.
- Forgetting `password_needs_rehash` — when you raise bcrypt cost or switch to Argon2id, existing hashes won't auto-upgrade unless you call `password_needs_rehash` on successful login and re-store.
- Setting `Content-Security-Policy: default-src 'self'` but allowing `unsafe-inline` for backwards compat — `unsafe-inline` and `unsafe-eval` largely defeat CSP; refactor to use nonces or hashes for inline scripts.

### Real-World Applications

- WordPress's `prepare()` method on `wpdb` is the only safe way to run parameterized queries; plugin developers who skip it are responsible for ~80% of plugin SQL injection CVEs.
- Laravel's `csrf` middleware auto-injects tokens into every form via `@csrf` Blade directive, and the `VerifyCsrfToken` middleware verifies every non-GET request.
- Slack used `Content-Security-Policy` with strict nonces (per-request, inline-only) to mitigate XSS in their web client — every inline script gets a fresh nonce.
- Wikipedia's MediaWiki escapes output via context-aware helper functions (`Html::element`, `Xml::escape`), never using raw string concatenation for HTML output.

### Interview Questions

- 1. Why are prepared statements the only safe defense against SQL injection? — They separate SQL structure from data at the parser level; parameters are bound as values (not executable code), so even malicious input can't change the SQL structure.
- 2. What's the right way to escape for HTML vs JavaScript context? — HTML: `htmlspecialchars($s, ENT_QUOTES, 'UTF-8')`; JavaScript: `json_encode($s, JSON_HEX_TAG | ...)`. There's no single "make safe" function — context matters.
- 3. What does `password_needs_rehash` do and when should you call it? — It returns true if the hash was generated with weaker settings than the current default; call it on every successful login and re-store the upgraded hash.
- 4. How does `SameSite=Lax` prevent CSRF? — It blocks the session cookie on cross-site POST requests, so an attacker's `<form action="https://victim.com/delete" method="POST">` can't ride the victim's session.
- 5. What does `Content-Security-Policy: default-src 'self'` do? — Restricts all resource loads (scripts, styles, images, etc.) to the same origin, blocking inline scripts (without nonces) and external domain exfiltration — a strong XSS mitigation.

### Mini Project

Build a Hardened Login Page: A login form with CSRF token, prepared-statement user lookup, `password_verify`, `password_needs_rehash` upgrade on success, `session_regenerate_id(true)`, and security headers (CSP, HSTS, X-Frame-Options). Suggested approach:
  - Set security headers in the front controller before any output
  - Generate a CSRF token in `$_SESSION` and embed as a hidden field
  - Verify the token with `hash_equals` on POST before processing
  - Look up the user with a prepared statement (never concatenate)
  - On success, regenerate the session ID, upgrade the hash if needed, and redirect to a dashboard

### Exercises

1. Demonstrate SQL injection on a vulnerable `query("... WHERE name = '" . $name . "'")` line with `?name=Ada' OR '1'='1`, then fix it with a prepared statement.
2. Escape `<script>alert(1)</script>` for HTML output with `htmlspecialchars($s, ENT_QUOTES, 'UTF-8')` and verify it renders as text.
3. Build a CSRF token system: generate, embed in a form, verify with `hash_equals` on POST, rotate on login.
4. Hash a password with `PASSWORD_ARGON2ID` if available, then use `password_needs_rehash` to check if an old bcrypt hash needs upgrading.
5. Add security headers to a front controller: CSP, HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is the ONLY safe defense against SQL injection?
9. A) addslashes()
10. B) str_replace on quotes
11. C) Prepared statements with bound parameters (*)
12. D) Magic quotes
13. Explanation: Prepared statements separate SQL structure from data at the parser level; parameters are bound as values (not executable code). Escaping functions are insufficient.
14. Q2: Which function escapes for HTML body context?
15. A) addslashes
16. B) json_encode
17. C) urlencode
18. D) htmlspecialchars with ENT_QUOTES (*)
19. Explanation: `htmlspecialchars($s, ENT_QUOTES | ENT_HTML5, 'UTF-8')` escapes `<`, `>`, `&`, `"`, `'` for HTML body and attribute contexts. Use `json_encode` for JavaScript context.
20. Q3: Which function escapes for JavaScript context (e.g. inside `<script>`)?
21. A) json_encode with hex flags (*)
22. B) htmlspecialchars
23. C) urlencode
24. D) strip_tags
25. Explanation: `json_encode($s, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT)` safely embeds data in JavaScript; htmlspecialchars is for HTML, not JS.
26. Q4: What does `password_needs_rehash` return?
27. A) true if the password is correct
28. B) true if the hash was generated with weaker settings than current default (*)
29. C) true if the password is expired
30. D) true if the user needs to log in again
31. Explanation: `password_needs_rehash($hash, PASSWORD_DEFAULT)` returns true if the hash should be regenerated (e.g. higher cost, new algo). Call it on every successful login.
32. Q5: What does `SameSite=Lax` do for CSRF defense?
33. A) Blocks all cross-site requests
34. B) Encrypts the cookie
35. C) Blocks the cookie on cross-site POST requests (allows top-level GET) (*)
36. D) Makes the cookie httponly
37. Explanation: `SameSite=Lax` blocks the cookie on cross-site POST/PUT/DELETE (most CSRF attacks) but allows it on top-level GET navigations. `Strict` blocks all cross-site requests.
38. Q6: Which is a safe way to compare a CSRF token from a session?
39. A) ==
40. B) ===
41. C) strcmp
42. D) hash_equals (*)
43. Explanation: `hash_equals` does a constant-time comparison to prevent timing attacks; `===` and `strcmp` short-circuit on the first byte difference, leaking token info.
44. Q7: Which header prevents clickjacking by blocking iframe embedding?
45. A) X-Frame-Options: DENY (*)
46. B) Content-Security-Policy
47. C) Strict-Transport-Security
48. D) X-Content-Type-Options
49. Explanation: `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`) blocks the page from being embedded in an iframe, preventing clickjacking attacks.
50. Q8: What does `Content-Security-Policy: default-src 'self'` do?
51. A) Encrypts the response
52. B) Restricts all resource loads to the same origin (*)
53. C) Blocks cookies
54. D) Disables JavaScript
55. Explanation: CSP `default-src 'self'` blocks all resource loads (scripts, styles, images, etc.) from external origins and inline scripts (without nonces) — a strong XSS mitigation.
56. Q9: Which PHP function generates a cryptographically secure random token?
57. A) rand()
58. B) mt_rand()
59. C) random_bytes() (*)
60. D) uniqid()
61. Explanation: `random_bytes($n)` uses the OS CSPRNG and is cryptographically secure. `rand`, `mt_rand`, and `uniqid` are predictable and unsafe for security tokens.
62. Q10: What is "second-order SQL injection"?
63. A) Injection that runs twice
64. B) Injection via two SQL queries
65. C) Injection that takes two seconds to run
66. D) Injection via a stored value that is later concatenated into SQL without escaping (*)
67. Explanation: Second-order SQLi: an attacker stores a malicious value (e.g. in a profile field) that passes initial validation, but is later concatenated into a different SQL query without parameterization.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which is the ONLY safe defense against SQL injection?
  options:
    - addslashes()
    - str_replace on quotes
    - Prepared statements with bound parameters
    - Magic quotes
  correctIndex: 2
  explanation: Prepared statements separate SQL structure from data at the parser level; parameters are bound as values (not executable code). Escaping functions are insufficient.
- id: q2
  question: Which function escapes for HTML body context?
  options:
    - addslashes
    - json_encode
    - urlencode
    - htmlspecialchars with ENT_QUOTES
  correctIndex: 3
  explanation: "`htmlspecialchars($s, ENT_QUOTES | ENT_HTML5, 'UTF-8')` escapes `<`, `>`, `&`, `\"`, `'` for HTML body and attribute contexts. Use `json_encode` for JavaScript context."
- id: q3
  question: Which function escapes for JavaScript context (e.g. inside `<script>`)?
  options:
    - json_encode with hex flags
    - htmlspecialchars
    - urlencode
    - strip_tags
    - "` safely embeds data in JavaScript; htmlspecialchars is for HTML, not JS."
  correctIndex: 0
  explanation: "`json_encode($s, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT)` safely embeds data in JavaScript; htmlspecialchars is for HTML, not JS."
- id: q4
  question: What does `password_needs_rehash` return?
  options:
    - true if the password is correct
    - true if the hash was generated with weaker settings than current default
    - true if the password is expired
    - true if the user needs to log in again
    - "` returns true if the hash should be regenerated (e.g. higher cost, new algo). Call it on every successful login."
  correctIndex: 1
  explanation: "`password_needs_rehash($hash, PASSWORD_DEFAULT)` returns true if the hash should be regenerated (e.g. higher cost, new algo). Call it on every successful login."
- id: q5
  question: What does `SameSite=Lax` do for CSRF defense?
  options:
    - Blocks all cross-site requests
    - Encrypts the cookie
    - Blocks the cookie on cross-site POST requests (allows top-level GET)
    - Makes the cookie httponly
  correctIndex: 2
  explanation: "`SameSite=Lax` blocks the cookie on cross-site POST/PUT/DELETE (most CSRF attacks) but allows it on top-level GET navigations. `Strict` blocks all cross-site requests."
- id: q6
  question: Which is a safe way to compare a CSRF token from a session?
  options:
    - ==
    - ===
    - strcmp
    - hash_equals
  correctIndex: 3
  explanation: "`hash_equals` does a constant-time comparison to prevent timing attacks; `===` and `strcmp` short-circuit on the first byte difference, leaking token info."
- id: q7
  question: Which header prevents clickjacking by blocking iframe embedding?
  options:
    - "X-Frame-Options: DENY"
    - Content-Security-Policy
    - Strict-Transport-Security
    - X-Content-Type-Options
  correctIndex: 0
  explanation: "`X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`) blocks the page from being embedded in an iframe, preventing clickjacking attacks."
- id: q8
  question: "What does `Content-Security-Policy: default-src 'self'` do?"
  options:
    - Encrypts the response
    - Restricts all resource loads to the same origin
    - Blocks cookies
    - Disables JavaScript
  correctIndex: 1
  explanation: CSP `default-src 'self'` blocks all resource loads (scripts, styles, images, etc.) from external origins and inline scripts (without nonces) — a strong XSS mitigation.
- id: q9
  question: Which PHP function generates a cryptographically secure random token?
  options:
    - rand()
    - mt_rand()
    - random_bytes()
    - uniqid()
  correctIndex: 2
  explanation: "`random_bytes($n)` uses the OS CSPRNG and is cryptographically secure. `rand`, `mt_rand`, and `uniqid` are predictable and unsafe for security tokens."
- id: q10
  question: What is "second-order SQL injection"?
  options:
    - Injection that runs twice
    - Injection via two SQL queries
    - Injection that takes two seconds to run
    - Injection via a stored value that is later concatenated into SQL without escaping
  correctIndex: 3
  explanation: "Second-order SQLi: an attacker stores a malicious value (e.g. in a profile field) that passes initial validation, but is later concatenated into a different SQL query without parameterization."
```

