---
slug: php-forms-get-post-validation
id: php-07
track: php
order: 7
title: Forms, $_GET, $_POST, and Validation
description: Handle HTML form submissions with PHP superglobals, validate input safely with `filter_input`, and learn why `$_POST` is not the only (or best) way to read a request body.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=4800s
whyItMatters: Handle HTML form submissions with PHP superglobals, validate input safely with `filter_input`, and learn why `$_POST` is not the only (or best) way to read a request body.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Forms, $_GET, $_POST, and Validation

## Forms, $_GET, $_POST, and Validation

### Why It Matters

Handle HTML form submissions with PHP superglobals, validate input safely with `filter_input`, and learn why `$_POST` is not the only (or best) way to read a request body.

Handle HTML form submissions with PHP superglobals, validate input safely with `filter_input`, and learn why `$_POST` is not the only (or best) way to read a request body.

### Prerequisites

- Stage 4: Functions and Include Files
- Stage 5: Arrays
- Stage 6: Strings and Regular Expressions

### Topics

- The superglobals: `$_GET`, `$_POST`, `$_REQUEST`, `$_SERVER`, `$_FILES`, `$_COOKIE`
- HTML form basics: `method="GET"` vs `method="POST"`, `enctype`
- Reading form fields and selecting default values
- `filter_input` and `filter_input_array` (FILTER_VALIDATE_*, FILTER_SANITIZE_*)
- `$_POST` vs `php://input` for JSON and raw bodies
- CSRF tokens (basic introduction; deep coverage in Stage 15)
- Sticky forms: re-rendering submitted values on validation error
- File upload basics (deep coverage in Stage 9)
- HTTP method semantics: GET (safe, idempotent), POST (unsafe)
- Redirect-after-POST (PRG pattern)

### Key Concepts

- `$_GET` is populated from the URL query string; `$_POST` is populated only for `application/x-www-form-urlencoded` and `multipart/form-data` bodies — JSON requests require reading `php://input`.
- `$_REQUEST` contains `$_GET`, `$_POST`, and `$_COOKIE` merged per `request_order` in php.ini — never trust it for security-sensitive decisions because cookies can override POST.
- `filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL)` is safer than `$_POST['email']` directly because it handles missing keys, validates the value, and returns false on failure.
- Always re-render submitted values when validation fails (sticky forms) — escape with `htmlspecialchars` to prevent reflected XSS.
- The PRG (Post/Redirect/Get) pattern prevents double-submission: POST validates and redirects to a GET page; refresh doesn't re-submit.

```php
<?php
// contact.php — handle a POST contact form
$errors = [];
$name  = filter_input(INPUT_POST, 'name',  FILTER_SANITIZE_SPECIAL_CHARS) ?? '';
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$msg   = filter_input(INPUT_POST, 'msg',   FILTER_UNSAFE_RAW) ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($name === '') { $errors[] = 'Name is required'; }
    if ($email === false) { $errors[] = 'Valid email required'; }
    if (mb_strlen($msg) < 10) { $errors[] = 'Message too short'; }

    if (!$errors) {
        // Save to DB, send email, then PRG redirect
        header('Location: /thanks');
        exit;
    }
}
?>
<form method="POST" action="/contact">
  <input name="name"  value="<?= htmlspecialchars($name, ENT_QUOTES) ?>">
  <input name="email" value="<?= htmlspecialchars($email ?: '', ENT_QUOTES) ?>">
  <textarea name="msg"><?= htmlspecialchars($msg, ENT_QUOTES) ?></textarea>
  <button type="submit">Send</button>
</form>
```
Caption: Reading form fields safely

### Common Pitfalls

- Reading `$_POST` for JSON requests — `$_POST` is only populated for `application/x-www-form-urlencoded` and `multipart/form-data`; for `application/json`, read `php://input` and `json_decode`.
- Trusting `$_REQUEST` — it merges GET, POST, and COOKIE per `request_order`; a malicious cookie can override a POST value. Use `$_GET` or `$_POST` explicitly.
- Forgetting `htmlspecialchars` when re-rendering submitted values — a user who submits `<script>alert(1)</script>` as their name triggers reflected XSS when you re-display the form with errors.
- Using `FILTER_SANITIZE_*` to "make input safe" — sanitization filters are lossy and not a substitute for context-aware escaping; validate input and escape output for its target context (HTML, SQL, URL, JS).
- Not following PRG — if a POST handler renders HTML directly, refreshing the page re-submits the form (often creating duplicate records); redirect to a GET page after successful POST.

### Real-World Applications

- WordPress's admin forms use nonce-based CSRF tokens (similar to `hash_equals`) for every action — the `wp_nonce_field` helper is ubiquitous in core and plugins.
- Slack's PHP endpoints used `php://input` for JSON webhooks (Slash commands, interactive components) and never relied on `$_POST` for JSON payloads.
- Wikipedia's edit form uses PRG with a redirect to the rendered article after save, preventing double-edits on refresh.
- Mailchimp's signup forms use `filter_input_array` with strict rules and re-render invalid submissions sticky, with per-field error messages.

### Interview Questions

- 1. What's the difference between `$_GET` and `$_POST`? — `$_GET` is populated from the URL query string; `$_POST` from `application/x-www-form-urlencoded` or `multipart/form-data` bodies only.
- 2. How do you read a JSON request body in PHP? — `file_get_contents('php://input')` then `json_decode($raw, true)` — `$_POST` is empty for JSON.
- 3. What does `filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL)` return? — The validated string on success, false on validation failure, or null if the key is missing.
- 4. Why is `$_REQUEST` dangerous? — It merges GET, POST, and COOKIE; a cookie can override a POST value, allowing attackers to bypass POST-only CSRF protections.
- 5. What is the PRG pattern and why use it? — Post/Redirect/Get: the POST handler redirects to a GET page after success, so refreshing doesn't re-submit (no duplicate records).

### Mini Project

Build a Registration Form with Validation: An HTML form with name, email, password, and confirm-password fields, validated server-side with sticky re-rendering and per-field error messages. Suggested approach:
  - Use `filter_input_array(INPUT_POST, $rules)` for validation rules
  - Validate that password and confirm-password match with `hash_equals`
  - Hash the password with `password_hash($pw, PASSWORD_DEFAULT)` before "saving" (just echo a success)
  - Re-render the form with submitted values (sticky) and per-field errors
  - Add a CSRF token stored in `$_SESSION`

### Exercises

1. Build a form with a single text field and a submit button; on POST, echo the value with `htmlspecialchars`.
2. Send a JSON POST request with `curl -d '{"a":1}' -H 'Content-Type: application/json' http://localhost:8000/api.php` and confirm `$_POST` is empty.
3. Use `filter_input(INPUT_POST, 'age', FILTER_VALIDATE_INT, ['options' => ['min_range' => 18]])` to enforce age 18+.
4. Build a sticky form that re-renders submitted values when validation fails.
5. Implement a CSRF token: generate, store in session, embed as hidden field, verify with `hash_equals` on POST.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Where is `$_POST` populated from?
9. A) The URL query string
10. B) Cookies
11. C) The request body for application/x-www-form-urlencoded or multipart/form-data (*)
12. D) HTTP headers
13. Explanation: `$_POST` is populated only for form-encoded or multipart bodies; JSON bodies require reading `php://input`.
14. Q2: How do you read a JSON request body in PHP?
15. A) `$_POST['json']`
16. B) `$_REQUEST['json']`
17. C) `stream_get_json()`
18. D) `file_get_contents('php://input')` then `json_decode` (*)
19. Explanation: `$_POST` is empty for JSON; read the raw body with `file_get_contents('php://input')` and decode with `json_decode`.
20. Q3: What does `filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL)` return on a valid email?
21. A) The email string (*)
22. B) true
23. C) 1
24. D) An associative array
25. Explanation: Validation filters return the validated value on success, false on failure, or null if the input key is missing.
26. Q4: Why is `$_REQUEST` considered dangerous?
27. A) It is slower than $_POST
28. B) It merges GET, POST, and COOKIE — cookies can override POST (*)
29. C) It is removed in PHP 8
30. D) It does not exist in CLI
31. Explanation: `$_REQUEST` merges GET/POST/COOKIE per `request_order` in php.ini; a cookie can override a POST value, bypassing CSRF protections.
32. Q5: What does PRG stand for?
33. A) Pre-Render-Get
34. B) Parse-Render-Generate
35. C) Post/Redirect/Get (*)
36. D) PHP-Request-Group
37. Explanation: PRG is Post/Redirect/Get: a POST handler redirects to a GET page after success, preventing re-submission on refresh.
38. Q6: Which escaping function prevents reflected XSS in HTML output?
39. A) addslashes
40. B) htmlentities (broader, but rarely needed)
41. C) strip_tags
42. D) htmlspecialchars (*)
43. Explanation: `htmlspecialchars` escapes `<`, `>`, `&`, `"`, and (with ENT_QUOTES) `'` for safe HTML output. Use the right flags and UTF-8 encoding.
44. Q7: What is the safe way to compare a CSRF token from a session vs a form?
45. A) `hash_equals` (*)
46. B) `==`
47. C) `===`
48. D) `strcmp`
49. Explanation: `hash_equals` does a constant-time comparison to prevent timing attacks on string equality checks; `===` short-circuits on the first byte difference.
50. Q8: What HTTP status code is appropriate for "CSRF token mismatch"?
51. A) 400 Bad Request
52. B) 419 Authentication Timeout (Laravel convention) (*)
53. C) 401 Unauthorized
54. D) 403 Forbidden
55. Explanation: Laravel uses 419 (Authentication Timeout) for CSRF mismatches, distinguishing them from auth failures; 403 is also acceptable but less specific.
56. Q9: Which `enctype` is required for file uploads in HTML forms?
57. A) application/x-www-form-urlencoded
58. B) text/plain
59. C) multipart/form-data (*)
60. D) application/json
61. Explanation: `multipart/form-data` is required for file uploads; the default `application/x-www-form-urlencoded` cannot transport file contents.
62. Q10: What does `FILTER_REQUIRE_ARRAY` do?
63. A) Converts a value to an array
64. B) Validates each array element recursively
65. C) Sorts the array
66. D) Requires the input to be an array; otherwise returns null/false (*)
67. Explanation: `FILTER_REQUIRE_ARRAY` is a flag that requires the input value to be an array (e.g. for multi-select form fields); if not an array, the filter returns null or false.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Where is `$_POST` populated from?
  options:
    - The URL query string
    - Cookies
    - The request body for application/x-www-form-urlencoded or multipart/form-data
    - HTTP headers
  correctIndex: 2
  explanation: "`$_POST` is populated only for form-encoded or multipart bodies; JSON bodies require reading `php://input`."
- id: q2
  question: How do you read a JSON request body in PHP?
  options:
    - "`$_POST['json']`"
    - "`$_REQUEST['json']`"
    - "`stream_get_json()`"
    - "`file_get_contents('php://input')` then `json_decode`"
  correctIndex: 3
  explanation: "`$_POST` is empty for JSON; read the raw body with `file_get_contents('php://input')` and decode with `json_decode`."
- id: q3
  question: What does `filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL)` return on a valid email?
  options:
    - "` return on a valid email?"
    - The email string
    - "true"
    - "1"
    - An associative array
  correctIndex: 1
  explanation: Validation filters return the validated value on success, false on failure, or null if the input key is missing.
- id: q4
  question: Why is `$_REQUEST` considered dangerous?
  options:
    - It is slower than $_POST
    - It merges GET, POST, and COOKIE — cookies can override POST
    - It is removed in PHP 8
    - It does not exist in CLI
  correctIndex: 1
  explanation: "`$_REQUEST` merges GET/POST/COOKIE per `request_order` in php.ini; a cookie can override a POST value, bypassing CSRF protections."
- id: q5
  question: What does PRG stand for?
  options:
    - Pre-Render-Get
    - Parse-Render-Generate
    - Post/Redirect/Get
    - PHP-Request-Group
  correctIndex: 2
  explanation: "PRG is Post/Redirect/Get: a POST handler redirects to a GET page after success, preventing re-submission on refresh."
- id: q6
  question: Which escaping function prevents reflected XSS in HTML output?
  options:
    - addslashes
    - htmlentities (broader, but rarely needed)
    - strip_tags
    - htmlspecialchars
    - "`'` for safe HTML output. Use the right flags and UTF-8 encoding."
  correctIndex: 3
  explanation: "`htmlspecialchars` escapes `<`, `>`, `&`, `\"`, and (with ENT_QUOTES) `'` for safe HTML output. Use the right flags and UTF-8 encoding."
- id: q7
  question: What is the safe way to compare a CSRF token from a session vs a form?
  options:
    - "`hash_equals`"
    - "`==`"
    - "`===`"
    - "`strcmp`"
  correctIndex: 0
  explanation: "`hash_equals` does a constant-time comparison to prevent timing attacks on string equality checks; `===` short-circuits on the first byte difference."
- id: q8
  question: What HTTP status code is appropriate for "CSRF token mismatch"?
  options:
    - 400 Bad Request
    - 419 Authentication Timeout (Laravel convention)
    - 401 Unauthorized
    - 403 Forbidden
  correctIndex: 1
  explanation: Laravel uses 419 (Authentication Timeout) for CSRF mismatches, distinguishing them from auth failures; 403 is also acceptable but less specific.
- id: q9
  question: Which `enctype` is required for file uploads in HTML forms?
  options:
    - application/x-www-form-urlencoded
    - text/plain
    - multipart/form-data
    - application/json
  correctIndex: 2
  explanation: "`multipart/form-data` is required for file uploads; the default `application/x-www-form-urlencoded` cannot transport file contents."
- id: q10
  question: What does `FILTER_REQUIRE_ARRAY` do?
  options:
    - Converts a value to an array
    - Validates each array element recursively
    - Sorts the array
    - Requires the input to be an array; otherwise returns null/false
  correctIndex: 3
  explanation: "`FILTER_REQUIRE_ARRAY` is a flag that requires the input value to be an array (e.g. for multi-select form fields); if not an array, the filter returns null or false."
```

