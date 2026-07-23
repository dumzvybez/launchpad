---
slug: php-getting-started-php
id: php-01
track: php
order: 1
title: Getting Started with PHP
description: Install PHP 8.2+, run your first script, and learn the request/response lifecycle that shapes every PHP application.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c
whyItMatters: Install PHP 8. 2+, run your first script, and learn the request/response lifecycle that shapes every PHP application.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Getting Started with PHP

## Getting Started with PHP

### Why It Matters

Install PHP 8. 2+, run your first script, and learn the request/response lifecycle that shapes every PHP application.

Install PHP 8.2+, run your first script, and learn the request/response lifecycle that shapes every PHP application.

### Prerequisites

- None — this is the entry point for the PHP track.
- Basic terminal familiarity (running commands, editing text files).

### Topics

- Installing PHP 8.2+ on macOS, Windows, and Linux
- The php CLI vs the web SAPI (built-in `php -S` server)
- Running .php files: `php script.php` vs serving over HTTP
- `phpinfo()` and the php.ini configuration file
- `echo`, `print`, and `printf`
- Single-line `//` and multi-line `/* */` comments
- Embedding PHP in HTML with `<?php ?>` and `<?= ?>`
- Editor setup (VS Code + Intelephense, PhpStorm)
- Xdebug installation overview

### Key Concepts

- PHP is a server-side, request-scoped language: each HTTP request starts a fresh PHP process with no shared in-memory state (unless using Swoole, RoadRunner, or Laravel Octane).
- PHP code is delimited by `<?php ?>` tags; anything outside the tags is emitted verbatim (HTML passthrough).
- The CLI SAPI runs scripts in a shell with no HTTP request; the web SAPI (CGI, FastCGI, or PHP-FPM) processes HTTP requests and emits headers plus a body.
- PHP 8.2+ is the current supported line; PHP 7.4 reached end-of-life in 2022, and PHP 8.0 in 2023.
- Composer is the de-facto package manager for PHP (covered in Stage 13); nearly every modern PHP project uses it.

```php
<?php
// hello.php
echo "Hello, World!\n";
print "PHP version: " . PHP_VERSION . "\n";
printf("Running on %s\n", PHP_OS);
```
Caption: Hello World — CLI

### Common Pitfalls

- Using short open tags `<?` or `<%` — disabled by default and removed in PHP 8; always use `<?php` or the short-echo `<?=` (always available since 5.4).
- Forgetting to start the file with `<?php` — anything before the opening tag is emitted as raw text, which is a common cause of "headers already sent" errors when whitespace precedes `<?php` in an included file.
- Leaving `phpinfo()` on a production server — it leaks PHP version, loaded extensions, environment variables, and absolute paths; delete it after debugging.
- Mixing PHP versions on the same machine (system PHP vs Homebrew vs XAMPP vs Valet) — `php -v` in the terminal can show a different version than the web server uses; verify both.
- Editing the wrong php.ini — `php --ini` shows the CLI ini path, but the FPM/web SAPI uses a different file; check `phpinfo()` "Loaded Configuration File" for the web one.

### Real-World Applications

- Wikipedia runs on MediaWiki, a PHP application serving billions of page views per month across hundreds of language editions.
- WordPress powers roughly 43% of all websites, all written in PHP, with a plugin ecosystem of over 60,000 free plugins.
- Slack's original backend was largely PHP; the team migrated the most latency-sensitive services to Hack (a PHP dialect from Meta) on the HHVM runtime.
- Mailchimp's marketing platform and Etsy's storefront are both large PHP codebases handling high-throughput transactional workloads.

### Interview Questions

- 1. Who created PHP and when? — Rasmus Lerdorf in 1994, originally as "Personal Home Page" tools; the recursive acronym "PHP: Hypertext Preprocessor" came later.
- 2. What's the difference between the CLI SAPI and the web SAPI? — CLI runs scripts in a shell with no HTTP request/response; web SAPI (FPM/CGI) processes HTTP requests and emits headers plus a body to a web server.
- 3. What does `<?=` do? — It is the short-echo tag, equivalent to `<?php echo`, always available since PHP 5.4, used to emit an expression directly in HTML.
- 4. Why is PHP called "request-scoped"? — Each HTTP request starts a fresh PHP process with no shared in-memory state; persistence requires sessions, files, a database, or an external cache.
- 5. What is PHP-FPM and why is it used? — FastCGI Process Manager: a long-running pool of PHP workers that nginx or Apache proxy to, avoiding the per-request process startup cost.

### Mini Project

Build a Greeting CLI: A command-line PHP script that takes a name from `$argv` and prints a personalized greeting with the current timestamp. Suggested approach:
  - Read `$argv[1]` for the name; default to "World" if missing
  - Use `date('c')` for an ISO 8601 timestamp
  - Use `printf` to format the output on a single line
  - Add a `--uppercase` flag (parsed from `$argv`) to shout the greeting
  - Print a friendly usage message if `--help` is passed

### Exercises

1. Install PHP 8.2+ and run `php -v` to confirm the version is 8.2 or higher.
2. Create `hello.php` that prints your name and the current date using `echo` and `date()`.
3. Run `php -S localhost:8000` and visit `http://localhost:8000/hello.php` in a browser.
4. Create a `phpinfo.php` file containing `<?php phpinfo();`, view it in a browser, then delete it — observe which configuration details it exposes.
5. Run `php -r 'echo PHP_VERSION;'` and explain why `-r` is useful for quick one-liners.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Who created PHP?
9. A) Rasmus Lerdorf (*)
10. B) Andi Gutmans
11. C) Zeev Suraski
12. D) Nikita Popov
13. Explanation: Rasmus Lerdorf created PHP in 1994; Gutmans and Suraski later rewrote the engine (Zend) for PHP 3 and 4.
14. Q2: What did PHP originally stand for?
15. A) PHP: Hypertext Preprocessor
16. B) Personal Home Page (*)
17. C) Preprocessed HTML Pages
18. D) Public HTTP Processor
19. Explanation: PHP originally stood for "Personal Home Page"; it is now the recursive acronym "PHP: Hypertext Preprocessor".
20. Q3: Which tag is the canonical way to open a PHP block?
21. A) <?
22. B) <%
23. C) <?php (*)
24. D) <script language="php">
25. Explanation: `<?php` is the canonical, always-enabled opening tag; `<?` short tags are disabled by default and `<%` was removed in PHP 7.
26. Q4: What does the `<?=` tag do?
27. A) Declares a constant
28. B) Starts a heredoc
29. C) Begins a strict-mode block
30. D) Short-echo: equivalent to `<?php echo` (*)
31. Explanation: `<?=` is the short echo tag — always available since PHP 5.4 — and emits the expression's value inline.
32. Q5: Which command starts PHP's built-in development web server?
33. A) php -S localhost:8000 (*)
34. B) php serve
35. C) php start
36. D) php httpd
37. Explanation: `php -S <host>:<port>` starts the single-threaded built-in server, intended for development only.
38. Q6: What does `phpinfo()` output?
39. A) The PHP version only
40. B) The full PHP configuration — version, extensions, ini paths, env vars (*)
41. C) The list of installed Composer packages
42. D) The current script's opcode dump
43. Explanation: phpinfo() prints a complete configuration page; it must never be left on a production server because it leaks sensitive details.
44. Q7: Which PHP version line is the oldest still receiving security support as of 2024?
45. A) PHP 5.6
46. B) PHP 7.0
47. C) PHP 8.1 (*)
48. D) PHP 7.4
49. Explanation: PHP 8.1+ is the supported line in 2024; PHP 7.4 EOL'd in 2022 and PHP 8.0 EOL'd late 2023.
50. Q8: What is PHP-FPM?
51. A) A package manager for PHP
52. B) A frontend preprocessor for PHP
53. C) A function profiler
54. D) A FastCGI process manager that runs PHP workers for a web server (*)
55. Explanation: PHP-FPM keeps a pool of PHP worker processes alive so nginx or Apache can proxy requests without spawning a new process per request.
56. Q9: What happens to PHP's in-memory variables after an HTTP request ends?
57. A) They are discarded — PHP is request-scoped (*)
58. B) They persist for the next request from the same user
59. C) They persist for the next request from any user
60. D) They are written to disk automatically
61. Explanation: PHP is request-scoped: every request starts with a fresh process state. Persistent storage requires sessions, a DB, or a cache.
62. Q10: Which VS Code extension is most popular for PHP IntelliSense?
63. A) Pylance
64. B) PHP Intelephense (*)
65. C) Tailwind CSS IntelliSense
66. D) ESLint
67. Explanation: Intelephense is the dominant PHP language server for VS Code; PhpStorm is the leading commercial IDE alternative.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Who created PHP?
  options:
    - Rasmus Lerdorf
    - Andi Gutmans
    - Zeev Suraski
    - Nikita Popov
  correctIndex: 0
  explanation: Rasmus Lerdorf created PHP in 1994; Gutmans and Suraski later rewrote the engine (Zend) for PHP 3 and 4.
- id: q2
  question: What did PHP originally stand for?
  options:
    - "PHP: Hypertext Preprocessor"
    - Personal Home Page
    - Preprocessed HTML Pages
    - Public HTTP Processor
  correctIndex: 1
  explanation: 'PHP originally stood for "Personal Home Page"; it is now the recursive acronym "PHP: Hypertext Preprocessor".'
- id: q3
  question: Which tag is the canonical way to open a PHP block?
  options:
    - <?
    - <%
    - <?php
    - <script language="php">
  correctIndex: 2
  explanation: "`<?php` is the canonical, always-enabled opening tag; `<?` short tags are disabled by default and `<%` was removed in PHP 7."
- id: q4
  question: What does the `<?=` tag do?
  options:
    - Declares a constant
    - Starts a heredoc
    - Begins a strict-mode block
    - "Short-echo: equivalent to `<?php echo`"
  correctIndex: 3
  explanation: "`<?=` is the short echo tag — always available since PHP 5.4 — and emits the expression's value inline."
- id: q5
  question: Which command starts PHP's built-in development web server?
  options:
    - php -S localhost:8000
    - php serve
    - php start
    - php httpd
  correctIndex: 0
  explanation: "`php -S <host>:<port>` starts the single-threaded built-in server, intended for development only."
- id: q6
  question: What does `phpinfo()` output?
  options:
    - The PHP version only
    - The full PHP configuration — version, extensions, ini paths, env vars
    - The list of installed Composer packages
    - The current script's opcode dump
  correctIndex: 1
  explanation: phpinfo() prints a complete configuration page; it must never be left on a production server because it leaks sensitive details.
- id: q7
  question: Which PHP version line is the oldest still receiving security support as of 2024?
  options:
    - PHP 5.6
    - PHP 7.0
    - PHP 8.1
    - PHP 7.4
  correctIndex: 2
  explanation: PHP 8.1+ is the supported line in 2024; PHP 7.4 EOL'd in 2022 and PHP 8.0 EOL'd late 2023.
- id: q8
  question: What is PHP-FPM?
  options:
    - A package manager for PHP
    - A frontend preprocessor for PHP
    - A function profiler
    - A FastCGI process manager that runs PHP workers for a web server
  correctIndex: 3
  explanation: PHP-FPM keeps a pool of PHP worker processes alive so nginx or Apache can proxy requests without spawning a new process per request.
- id: q9
  question: What happens to PHP's in-memory variables after an HTTP request ends?
  options:
    - They are discarded — PHP is request-scoped
    - They persist for the next request from the same user
    - They persist for the next request from any user
    - They are written to disk automatically
  correctIndex: 0
  explanation: "PHP is request-scoped: every request starts with a fresh process state. Persistent storage requires sessions, a DB, or a cache."
- id: q10
  question: Which VS Code extension is most popular for PHP IntelliSense?
  options:
    - Pylance
    - PHP Intelephense
    - Tailwind CSS IntelliSense
    - ESLint
  correctIndex: 1
  explanation: Intelephense is the dominant PHP language server for VS Code; PhpStorm is the leading commercial IDE alternative.
```

