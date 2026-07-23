---
slug: php-error-handling-exceptions-logging
id: php-16
track: php
order: 16
title: Error Handling, Exceptions, and Logging
description: Configure PHP's error reporting, throw and catch typed exceptions (including `finally` and custom exception hierarchies), and ship structured logs with Monolog per PSR-3.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=12000s
whyItMatters: Configure PHP's error reporting, throw and catch typed exceptions (including `finally` and custom exception hierarchies), and ship structured logs with Monolog per PSR-3.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Error Handling, Exceptions, and Logging

## Error Handling, Exceptions, and Logging

### Why It Matters

Configure PHP's error reporting, throw and catch typed exceptions (including `finally` and custom exception hierarchies), and ship structured logs with Monolog per PSR-3.

Configure PHP's error reporting, throw and catch typed exceptions (including `finally` and custom exception hierarchies), and ship structured logs with Monolog per PSR-3.

### Prerequisites

- Stage 4: Functions and Include Files
- Stage 10: Object-Oriented PHP — Classes and Objects
- Stage 13: Composer and Dependency Management

### Topics

- `error_reporting`, `display_errors`, `log_errors` in php.ini
- `E_ERROR`, `E_WARNING`, `E_NOTICE`, `E_DEPRECATED`, `E_STRICT`
- `set_error_handler` and `set_exception_handler`
- Throwing and catching: `try`/`catch`/`finally`
- Multiple catch blocks and `catch (A | B $e)` union (PHP 8.0)
- The Exception hierarchy: `Throwable`, `Exception`, `Error`, `TypeError`, `ValueError`
- Custom exception classes with extra context
- `error_log()` and the `error_log` ini directive
- PSR-3 logging and Monolog: handlers, formatters, processors
- Log levels: DEBUG, INFO, NOTICE, WARNING, ERROR, CRITICAL, ALERT, EMERGENCY
- `throw` as an expression (PHP 8.0)

### Key Concepts

- PHP has two parallel error channels: errors (notices/warnings/fatals from the engine) and exceptions (objects thrown with `throw`). `set_error_handler` lets you convert errors to exceptions, but fatal errors and `E_ERROR` cannot be caught by user handlers.
- `Throwable` (PHP 7+) is the interface both `Exception` and `Error` implement; catch `Throwable` to handle both, but be specific when possible (`catch (PDOException $e)`).
- `finally` runs whether an exception was thrown or not — useful for cleanup (closing file handles, releasing locks). It runs after `catch` and before the exception propagates.
- PSR-3 (LoggerInterface) standardizes log method names (`info`, `error`, etc.) and the `$context` array; Monolog is the de-facto implementation, supporting file/stream/Syslog/Slack/ELK handlers.
- In production: `display_errors = Off`, `log_errors = On`, `error_reporting = E_ALL` — log everything but never show errors to users (info leak). In dev: `display_errors = On`.

```php
<?php
// In production: log everything, display nothing
error_reporting(E_ALL);
ini_set('display_errors', '0');          // Off in prod, On in dev
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/logs/php-error.log');

// In development:
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
```
Caption: Error reporting config

### Common Pitfalls

- Catching `Exception` instead of `Throwable` — since PHP 7, fatal-like errors throw `Error` (a `Throwable` but not an `Exception`); catching `Exception` misses `TypeError`, `ArgumentCountError`, etc. Catch `Throwable` for the catch-all.
- Using `display_errors = On` in production — leaks file paths, SQL fragments, and stack traces to attackers; turn it off and log errors instead.
- Swallowing exceptions with empty catch blocks — `catch (Exception $e) {}` hides bugs; at minimum, log the exception or rethrow it.
- Forgetting `finally` for resource cleanup — without `finally`, an exception between `fopen` and `fclose` leaks the file handle; use `finally` or, better, a `try-with-resources`-style helper.
- Throwing generic `Exception` instead of specific subclasses — generic exceptions can't be caught selectively; create a hierarchy (`UserNotFoundException`, `ValidationException`, etc.) for granular handling.

### Real-World Applications

- Laravel's exception handler (`app/Exceptions/Handler.php`) catches all `Throwable`, logs via Monolog, and renders a friendly response; it has dedicated handlers for `ModelNotFoundException`, `ValidationException`, and `AuthenticationException`.
- Symfony's `ErrorHandler` converts PHP errors to `ErrorException`, catches fatals via `register_shutdown_function`, and integrates with Monolog for structured logging.
- Wikipedia's MediaWiki uses a custom error handler that converts notices/warnings to `MWException`, ensuring that even minor issues are surfaced during development.
- Etsy's codebase ships a "log everything, never swallow" lint rule: every `catch` block must either log, rethrow, or be explicitly annotated with `// @phpstan-ignore-line`.

### Interview Questions

- 1. What's the difference between `Exception` and `Error` in PHP 7+? — Both implement `Throwable`; `Exception` is for "normal" exceptions, `Error` is for engine/runtime issues (TypeError, ArgumentCountError, etc.). Catch `Throwable` for a catch-all.
- 2. Why use `finally`? — `finally` runs whether or not an exception was thrown, making it ideal for cleanup (closing handles, releasing locks) without duplicating code in try and catch.
- 3. What does `set_error_handler` let you do? — Convert PHP errors (notices/warnings) into `ErrorException` so they can be caught with try/catch — but it cannot catch fatal `E_ERROR`.
- 4. What's the recommended `display_errors` setting for production? — `Off` (log errors instead with `log_errors = On` and `error_reporting = E_ALL`). In dev, `display_errors = On` for debugging.
- 5. What is PSR-3? — A standard `LoggerInterface` with methods like `info($msg, array $context)` and eight log levels (DEBUG through EMERGENCY); Monolog is the de-facto implementation.

### Mini Project

Build a Logging Middleware for a Slim App: A PSR-15 middleware that wraps each request in a try/catch, logs the request method/path, status code, and duration, and logs exceptions with stack traces to a rotating file via Monolog. Suggested approach:
  - Install `monolog/monolog` and `slim/slim`
  - Use `RotatingFileHandler` with 7-day retention at INFO level
  - Use `microtime(true)` before/after to compute duration
  - Catch `Throwable`, log at ERROR level with the exception in `$context`, then rethrow
  - Add a `WebProcessor` to capture ip/url/referrer in every log line

### Exercises

1. Set `error_reporting(E_ALL)` and `display_errors=0` in a script; trigger a warning and observe it's logged but not displayed.
2. Throw a custom `UserNotFoundException` with an `email` property; catch it and print the property.
3. Write a try/catch/finally that opens a file, throws in the try, and closes the file in `finally` — verify it's always closed.
4. Set up Monolog with a `StreamHandler` writing to `app.log`; log an INFO and an ERROR with context data.
5. Use `set_error_handler` to convert `E_WARNING` to `ErrorException`, then catch it in a try/catch.
6. >>> QUIZ (Stage 16) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which interface do both `Exception` and `Error` implement in PHP 7+?
9. A) Catchable
10. B) BaseException
11. C) Exceptionable
12. D) Throwable (*)
13. Explanation: `Throwable` is the interface both `Exception` and `Error` implement. Catch `Throwable` for a catch-all; `Error` covers TypeError, ArgumentCountError, etc.
14. Q2: Which block runs whether or not an exception was thrown?
15. A) finally (*)
16. B) catch
17. C) else
18. D) switch
19. Explanation: `finally` always runs after try/catch — perfect for cleanup (closing handles, releasing locks) without duplicating code.
20. Q3: What is the recommended `display_errors` setting in production?
21. A) On
22. B) Off (*)
23. C) stderr
24. D) syslog
25. Explanation: Production should set `display_errors = Off` (don't leak paths/stacks to users) and `log_errors = On` with `error_reporting = E_ALL`. Dev can show errors.
26. Q4: What does `set_error_handler` let you do?
27. A) Catch fatal errors
28. B) Disable error reporting
29. C) Convert PHP errors (notices/warnings) to ErrorException (*)
30. D) Send errors to Slack
31. Explanation: `set_error_handler` lets you convert notices/warnings into `ErrorException` for try/catch handling. Fatal `E_ERROR` cannot be caught by user handlers (use `register_shutdown_function`).
32. Q5: Which log level is most severe?
33. A) WARNING
34. B) ERROR
35. C) CRITICAL
36. D) EMERGENCY (*)
37. Explanation: PSR-3 levels in order: DEBUG, INFO, NOTICE, WARNING, ERROR, CRITICAL, ALERT, EMERGENCY. EMERGENCY is the most severe (system unusable).
38. Q6: What does `catch (A | B $e)` do?
39. A) Union catch — same handler for both A and B (*)
40. B) Catches A then B
41. C) Throws A or B
42. D) A syntax error
43. Explanation: Union catch (PHP 8.0) uses the same handler for multiple exception types: `catch (UserNotFoundException | DatabaseException $e) { ... }`.
44. Q7: Which is the de-facto PSR-3 logging implementation?
45. A) Symfony Console
46. B) Monolog (*)
47. C) Doctrine
48. D) PHPMailer
49. Explanation: Monolog is the de-facto PSR-3 LoggerInterface implementation, supporting file/stream/Syslog/Slack/ELK handlers, formatters, and processors.
50. Q8: What does `throw` as an expression (PHP 8.0) enable?
51. A) `throw` outside a function
52. B) Multiple throws
53. C) `$value ?? throw new Exception()` — throw in expression position (*)
54. D) Async throws
55. Explanation: In PHP 8.0+, `throw` is an expression: `$user = $repo->find($id) ?? throw new UserNotFoundException($id);` — concise null-or-throw patterns.
56. Q9: What should you do in a catch block instead of swallowing the exception?
57. A) Re-throw it
58. B) Log it
59. C) Convert to a more specific exception
60. D) Any of the above — but never silently swallow (*)
61. Explanation: Empty catch blocks hide bugs; at minimum log the exception, rethrow it, or convert to a more specific exception. Never silently swallow.
62. Q10: Which PHP function logs a message to the configured error log?
63. A) `error_log()` (*)
64. B) `log_error()`
65. C) `print_log()`
66. D) `syslog()`
67. Explanation: `error_log($msg)` writes to the configured `error_log` destination (file, syslog, email). For structured logging, use Monolog.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which interface do both `Exception` and `Error` implement in PHP 7+?
  options:
    - Catchable
    - BaseException
    - Exceptionable
    - Throwable
  correctIndex: 3
  explanation: "`Throwable` is the interface both `Exception` and `Error` implement. Catch `Throwable` for a catch-all; `Error` covers TypeError, ArgumentCountError, etc."
- id: q2
  question: Which block runs whether or not an exception was thrown?
  options:
    - finally
    - catch
    - else
    - switch
  correctIndex: 0
  explanation: "`finally` always runs after try/catch — perfect for cleanup (closing handles, releasing locks) without duplicating code."
- id: q3
  question: What is the recommended `display_errors` setting in production?
  options:
    - On
    - Off
    - stderr
    - syslog
  correctIndex: 1
  explanation: Production should set `display_errors = Off` (don't leak paths/stacks to users) and `log_errors = On` with `error_reporting = E_ALL`. Dev can show errors.
- id: q4
  question: What does `set_error_handler` let you do?
  options:
    - Catch fatal errors
    - Disable error reporting
    - Convert PHP errors (notices/warnings) to ErrorException
    - Send errors to Slack
  correctIndex: 2
  explanation: "`set_error_handler` lets you convert notices/warnings into `ErrorException` for try/catch handling. Fatal `E_ERROR` cannot be caught by user handlers (use `register_shutdown_function`)."
- id: q5
  question: Which log level is most severe?
  options:
    - WARNING
    - ERROR
    - CRITICAL
    - EMERGENCY
  correctIndex: 3
  explanation: "PSR-3 levels in order: DEBUG, INFO, NOTICE, WARNING, ERROR, CRITICAL, ALERT, EMERGENCY. EMERGENCY is the most severe (system unusable)."
- id: q6
  question: What does `catch (A | B $e)` do?
  options:
    - Union catch — same handler for both A and B
    - Catches A then B
    - Throws A or B
    - A syntax error
  correctIndex: 0
  explanation: "Union catch (PHP 8.0) uses the same handler for multiple exception types: `catch (UserNotFoundException | DatabaseException $e) { ... }`."
- id: q7
  question: Which is the de-facto PSR-3 logging implementation?
  options:
    - Symfony Console
    - Monolog
    - Doctrine
    - PHPMailer
  correctIndex: 1
  explanation: Monolog is the de-facto PSR-3 LoggerInterface implementation, supporting file/stream/Syslog/Slack/ELK handlers, formatters, and processors.
- id: q8
  question: What does `throw` as an expression (PHP 8.0) enable?
  options:
    - "`throw` outside a function"
    - Multiple throws
    - "`$value ?? throw new Exception()` — throw in expression position"
    - Async throws
  correctIndex: 2
  explanation: "In PHP 8.0+, `throw` is an expression: `$user = $repo->find($id) ?? throw new UserNotFoundException($id);` — concise null-or-throw patterns."
- id: q9
  question: What should you do in a catch block instead of swallowing the exception?
  options:
    - Re-throw it
    - Log it
    - Convert to a more specific exception
    - Any of the above — but never silently swallow
  correctIndex: 3
  explanation: Empty catch blocks hide bugs; at minimum log the exception, rethrow it, or convert to a more specific exception. Never silently swallow.
- id: q10
  question: Which PHP function logs a message to the configured error log?
  options:
    - "`error_log()`"
    - "`log_error()`"
    - "`print_log()`"
    - "`syslog()`"
  correctIndex: 0
  explanation: "`error_log($msg)` writes to the configured `error_log` destination (file, syslog, email). For structured logging, use Monolog."
```

