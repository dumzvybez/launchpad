---
slug: php-sessions-cookies-authentication
id: php-08
track: php
order: 8
title: Sessions, Cookies, and Authentication
description: Persist user state across requests with `$_SESSION` and `$_COOKIE`, build a login flow with `password_hash`/`password_verify`, and learn to defend against session fixation and session hijacking.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=5600s
whyItMatters: Persist user state across requests with `$_SESSION` and `$_COOKIE`, build a login flow with `password_hash`/`password_verify`, and learn to defend against session fixation and session hijacking.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Sessions, Cookies, and Authentication

## Sessions, Cookies, and Authentication

### Why It Matters

Persist user state across requests with `$_SESSION` and `$_COOKIE`, build a login flow with `password_hash`/`password_verify`, and learn to defend against session fixation and session hijacking.

Persist user state across requests with `$_SESSION` and `$_COOKIE`, build a login flow with `password_hash`/`password_verify`, and learn to defend against session fixation and session hijacking.

### Prerequisites

- Stage 4: Functions and Include Files
- Stage 7: Forms, $_GET, $_POST, and Validation

### Topics

- Cookie basics: `setcookie()`, `$_COOKIE`, expiration, path/domain
- Session basics: `session_start()`, `$_SESSION`, `session_regenerate_id()`
- Session configuration: `session.cookie_httponly`, `cookie_secure`, `cookie_samesite`
- `password_hash($pw, PASSWORD_DEFAULT)` and `password_verify($pw, $hash)`
- bcrypt vs Argon2id (`PASSWORD_ARGON2ID` since 7.3)
- Login flow: form, verify, regenerate, redirect
- Logout flow: destroy session, clear cookie
- Session fixation attacks and `session_regenerate_id(true)`
- "Remember me" tokens: long-lived vs session cookies
- Timing attacks and `hash_equals`

### Key Concepts

- A cookie is sent by the server via the `Set-Cookie` header and echoed back by the browser; `$_COOKIE` is populated from incoming cookies, not from `setcookie()` calls in the same request.
- PHP sessions store a server-side file (by default) keyed by a session ID stored in a cookie (`PHPSESSID`); `$_SESSION` is a serialized array read at `session_start()` and written at script end.
- `password_hash` with `PASSWORD_DEFAULT` uses bcrypt (cost 10) by default in 7.x, and may switch to Argon2id in future versions; always use `PASSWORD_DEFAULT`, never hard-code `PASSWORD_BCRYPT`.
- `password_verify` is constant-time and safe against timing attacks; comparing hashes with `===` is not.
- Session fixation: an attacker sets the victim's session ID (via a link or XSS), then waits for them to log in. Defense: call `session_regenerate_id(true)` after a successful login to invalidate the old ID.

```php
<?php
// Set a cookie — must be called before any output (headers)
setcookie(
    name: 'theme',
    value: 'dark',
    expires_or_options: [
        'expires'  => time() + 86400 * 30,  // 30 days
        'path'     => '/',
        'domain'   => '',
        'secure'   => true,     // HTTPS only
        'httponly' => true,     // not accessible via JS
        'samesite' => 'Lax',    // or 'Strict' / 'None'
    ]
);

// Reading: $_COOKIE['theme'] is populated on the NEXT request, not this one
$theme = $_COOKIE['theme'] ?? 'light';
```
Caption: Cookie basics

### Common Pitfalls

- Using `md5` or `sha1` for passwords — both are fast, unsalted, and crackable on commodity GPUs in seconds. Always use `password_hash` with `PASSWORD_DEFAULT` (bcrypt or Argon2id).
- Forgetting `session_regenerate_id(true)` after login — without it, an attacker who fixed the victim's session ID earlier can hijack the now-authenticated session (session fixation).
- Calling `setcookie()` after output — cookies are sent in HTTP headers, which must come before the body; any whitespace, BOM, or `echo` before `setcookie` causes "headers already sent".
- Setting `cookie_httponly=0` or `cookie_secure=0` in production — without `httponly`, JavaScript can read the session cookie (XSS = session theft); without `secure`, the cookie is sent over plain HTTP.
- Revealing which field is wrong — "email not found" vs "wrong password" lets attackers enumerate accounts; always return a generic "invalid credentials" message.

### Real-World Applications

- WordPress's `wp-login.php` uses PHP sessions (or its own auth-cookie scheme) with `password_hash` since 4.0, replacing the older `phpass` portable hashes.
- Slack uses long-lived "remember me" tokens rotated on each use, in addition to short-lived session cookies, to balance UX and security.
- Wikipedia uses session regeneration on every privilege escalation (login, admin action) to prevent fixation; the `mw_session` backend is custom for cross-wiki sessions.
- Mailchimp uses Argon2id for password hashing (set via `PASSWORD_ARGON2ID`) on PHP 7.3+ for stronger GPU-cracking resistance than bcrypt.

### Interview Questions

- 1. Why must `setcookie` be called before any output? — Cookies are sent in HTTP headers, which must precede the body; any whitespace or `echo` before `setcookie` triggers "headers already sent".
- 2. What does `session_regenerate_id(true)` do? — Issues a new session ID, deletes the old session file (`true` = delete old), and migrates data to the new ID — essential after login to prevent fixation.
- 3. Why is `password_hash` better than `md5`/`sha1`? — It uses bcrypt or Argon2id (slow, salted, memory-hard), making GPU cracking infeasible; md5/sha1 are fast and unsalted.
- 4. What's the difference between `cookie_httponly` and `cookie_secure`? — `httponly` prevents JavaScript from reading the cookie (XSS defense); `secure` ensures the cookie is only sent over HTTPS (network-sniffing defense).
- 5. How does a session fixation attack work? — An attacker sets the victim's session ID (via a link or XSS); when the victim logs in, the attacker's ID becomes authenticated. Defense: `session_regenerate_id(true)` after login.

### Mini Project

Build a Login/Logout System with Session Regeneration: A three-page demo (login.php, dashboard.php, logout.php) that hashes a hardcoded password, verifies it, regenerates the session ID on login, shows a personalized dashboard, and destroys the session on logout. Suggested approach:
  - Store a pre-hashed password (`password_hash('secret', PASSWORD_DEFAULT)`) in a constant
  - In login.php, verify with `password_verify` and call `session_regenerate_id(true)` on success
  - Set `cookie_httponly`, `cookie_secure`, `cookie_samesite=Lax` via `ini_set` before `session_start()`
  - In dashboard.php, redirect to login if `$_SESSION['user_id']` is not set
  - In logout.php, clear `$_SESSION`, expire the cookie, and call `session_destroy()`

### Exercises

1. Hash a password with `password_hash('test', PASSWORD_DEFAULT)` and verify it with `password_verify('test', $hash)` — confirm both work.
2. Set a cookie with `setcookie('theme', 'dark', [...secure options])` and read it on the next request via `$_COOKIE['theme']`.
3. Implement a login form that calls `session_regenerate_id(true)` on success and stores the user ID in `$_SESSION`.
4. Build a logout flow that clears `$_SESSION`, expires the session cookie, and calls `session_destroy()`.
5. Configure `session.cookie_samesite=Lax` and `cookie_httponly=1` via `ini_set` before `session_start()` — verify with browser devtools.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `password_hash($pw, PASSWORD_DEFAULT)` use by default in current PHP?
9. A) MD5
10. B) SHA-1
11. C) Plain text
12. D) bcrypt (may change to Argon2id in future versions) (*)
13. Explanation: `PASSWORD_DEFAULT` currently uses bcrypt (cost 10), but may be upgraded to Argon2id in future PHP versions; always use `PASSWORD_DEFAULT`, not the specific algorithm.
14. Q2: Why must `setcookie()` be called before any output?
15. A) Cookies are HTTP headers, which must precede the body (*)
16. B) It's a syntax requirement
17. C) PHP buffers all output until setcookie runs
18. D) It must be called only in CLI
19. Explanation: Cookies are sent in HTTP headers; any whitespace, BOM, or echo before `setcookie()` causes "headers already sent".
20. Q3: What does `session_regenerate_id(true)` do?
21. A) Deletes the session and starts fresh
22. B) Issues a new session ID and deletes the old session file (*)
23. C) Resets all session variables
24. D) Encrypts the session ID
25. Explanation: `session_regenerate_id(true)` issues a new session ID, migrates session data to it, and deletes the old session — essential after login to prevent fixation.
26. Q4: What does `cookie_httponly=1` prevent?
27. A) Cookies being sent over HTTP (vs HTTPS)
28. B) Cookies being sent on cross-site requests
29. C) JavaScript from reading the cookie via document.cookie (*)
30. D) Cookies expiring
31. Explanation: `httponly` blocks JavaScript access to the cookie, mitigating session theft via XSS. `secure` is for HTTPS-only; `samesite` is for cross-site requests.
32. Q5: Which function verifies a password against a `password_hash` hash?
33. A) hash_equals
34. B) password_match
35. C) md5_compare
36. D) password_verify (*)
37. Explanation: `password_verify($pw, $hash)` is constant-time and handles bcrypt/Argon2 re-computation internally; never compare hashes with `===`.
38. Q6: What is a session fixation attack?
39. A) An attacker sets the victim's session ID, then waits for them to log in (*)
40. B) Stealing a session ID via XSS
41. C) Brute-forcing a session ID
42. D) Replaying a captured session cookie
43. Explanation: In fixation, the attacker forces a known session ID onto the victim; when the victim authenticates, the attacker's ID is now valid. Defense: regenerate after login.
44. Q7: What is the `samesite=Lax` cookie attribute for?
45. A) Prevents JavaScript from reading the cookie
46. B) Restricts the cookie to same-site requests, with top-level GET exceptions (*)
47. C) Forces HTTPS
48. D) Encrypts the cookie value
49. Explanation: `samesite=Lax` blocks the cookie on cross-site POST requests but allows it on top-level GET navigations; `Strict` blocks all cross-site; `None` requires `secure`.
50. Q8: What does `session_destroy()` do?
51. A) Clears `$_SESSION` array
52. B) Expires the session cookie
53. C) Deletes the session file on the server (*)
54. D) Logs the user out globally
55. Explanation: `session_destroy()` deletes the server-side session data; you must also clear `$_SESSION` and expire the cookie manually for a full logout.
56. Q9: Which is the recommended way to compare two strings to avoid timing attacks?
57. A) `==`
58. B) `===`
59. C) `strcmp`
60. D) `hash_equals` (*)
61. Explanation: `hash_equals` does a constant-time comparison, preventing timing attacks; `===` and `strcmp` short-circuit on the first byte difference, leaking length info.
62. Q10: What hashing algorithm does `PASSWORD_ARGON2ID` use?
63. A) Argon2id — memory-hard, GPU-cracking resistant (*)
64. B) bcrypt
65. C) PBKDF2
66. D) scrypt
67. Explanation: `PASSWORD_ARGON2ID` uses Argon2id (the recommended variant of Argon2), which is memory-hard and more resistant to GPU/ASIC cracking than bcrypt.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `password_hash($pw, PASSWORD_DEFAULT)` use by default in current PHP?
  options:
    - "` use by default in current PHP?"
    - MD5
    - SHA-1
    - Plain text
    - bcrypt (may change to Argon2id in future versions)
  correctIndex: 4
  explanation: "`PASSWORD_DEFAULT` currently uses bcrypt (cost 10), but may be upgraded to Argon2id in future PHP versions; always use `PASSWORD_DEFAULT`, not the specific algorithm."
- id: q2
  question: Why must `setcookie()` be called before any output?
  options:
    - Cookies are HTTP headers, which must precede the body
    - It's a syntax requirement
    - PHP buffers all output until setcookie runs
    - It must be called only in CLI
  correctIndex: 0
  explanation: Cookies are sent in HTTP headers; any whitespace, BOM, or echo before `setcookie()` causes "headers already sent".
- id: q3
  question: What does `session_regenerate_id(true)` do?
  options:
    - Deletes the session and starts fresh
    - Issues a new session ID and deletes the old session file
    - Resets all session variables
    - Encrypts the session ID
  correctIndex: 1
  explanation: "`session_regenerate_id(true)` issues a new session ID, migrates session data to it, and deletes the old session — essential after login to prevent fixation."
- id: q4
  question: What does `cookie_httponly=1` prevent?
  options:
    - Cookies being sent over HTTP (vs HTTPS)
    - Cookies being sent on cross-site requests
    - JavaScript from reading the cookie via document.cookie
    - Cookies expiring
  correctIndex: 2
  explanation: "`httponly` blocks JavaScript access to the cookie, mitigating session theft via XSS. `secure` is for HTTPS-only; `samesite` is for cross-site requests."
- id: q5
  question: Which function verifies a password against a `password_hash` hash?
  options:
    - hash_equals
    - password_match
    - md5_compare
    - password_verify
  correctIndex: 3
  explanation: "`password_verify($pw, $hash)` is constant-time and handles bcrypt/Argon2 re-computation internally; never compare hashes with `===`."
- id: q6
  question: What is a session fixation attack?
  options:
    - An attacker sets the victim's session ID, then waits for them to log in
    - Stealing a session ID via XSS
    - Brute-forcing a session ID
    - Replaying a captured session cookie
  correctIndex: 0
  explanation: "In fixation, the attacker forces a known session ID onto the victim; when the victim authenticates, the attacker's ID is now valid. Defense: regenerate after login."
- id: q7
  question: What is the `samesite=Lax` cookie attribute for?
  options:
    - Prevents JavaScript from reading the cookie
    - Restricts the cookie to same-site requests, with top-level GET exceptions
    - Forces HTTPS
    - Encrypts the cookie value
  correctIndex: 1
  explanation: "`samesite=Lax` blocks the cookie on cross-site POST requests but allows it on top-level GET navigations; `Strict` blocks all cross-site; `None` requires `secure`."
- id: q8
  question: What does `session_destroy()` do?
  options:
    - Clears `$_SESSION` array
    - Expires the session cookie
    - Deletes the session file on the server
    - Logs the user out globally
  correctIndex: 2
  explanation: "`session_destroy()` deletes the server-side session data; you must also clear `$_SESSION` and expire the cookie manually for a full logout."
- id: q9
  question: Which is the recommended way to compare two strings to avoid timing attacks?
  options:
    - "`==`"
    - "`===`"
    - "`strcmp`"
    - "`hash_equals`"
  correctIndex: 3
  explanation: "`hash_equals` does a constant-time comparison, preventing timing attacks; `===` and `strcmp` short-circuit on the first byte difference, leaking length info."
- id: q10
  question: What hashing algorithm does `PASSWORD_ARGON2ID` use?
  options:
    - Argon2id — memory-hard, GPU-cracking resistant
    - bcrypt
    - PBKDF2
    - scrypt
  correctIndex: 0
  explanation: "`PASSWORD_ARGON2ID` uses Argon2id (the recommended variant of Argon2), which is memory-hard and more resistant to GPU/ASIC cracking than bcrypt."
```

