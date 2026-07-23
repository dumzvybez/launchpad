---
slug: php-namespaces-autoloading-psr-4
id: php-12
track: php
order: 12
title: Namespaces, Autoloading, and PSR-4
description: Organize large codebases with namespaces, eliminate manual `require` chains with PSR-4 autoloading, and understand the Composer-generated class map that powers modern PHP.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=8800s
whyItMatters: Organize large codebases with namespaces, eliminate manual `require` chains with PSR-4 autoloading, and understand the Composer-generated class map that powers modern PHP.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Namespaces, Autoloading, and PSR-4

## Namespaces, Autoloading, and PSR-4

### Why It Matters

Organize large codebases with namespaces, eliminate manual `require` chains with PSR-4 autoloading, and understand the Composer-generated class map that powers modern PHP.

Organize large codebases with namespaces, eliminate manual `require` chains with PSR-4 autoloading, and understand the Composer-generated class map that powers modern PHP.

### Prerequisites

- Stage 4: Functions and Include Files
- Stage 10: Object-Oriented PHP — Classes and Objects
- Stage 11: OOP — Inheritance, Interfaces, Traits

### Topics

- Declaring namespaces with `namespace App\Service;`
- Sub-namespaces and the namespace separator `\`
- `use` imports, aliasing `use App\Service\User as UserService`
- Grouped `use` statements
- The `__NAMESPACE__` magic constant
- `namespace` keyword for inline access
- Manual autoloading with `spl_autoload_register`
- PSR-4 spec: `Acme\Log\Writer` -> `src/Log/Writer.php`
- Composer's PSR-4 autoloader (`vendor/autoload.php`)
- Classmap autoloading and `composer dump-autoload --optimize`
- The global namespace and `\` prefix for built-ins

### Key Concepts

- A namespace is a prefix for class/interface/trait/function names, declared as the first statement of a file: `namespace App\Domain;`.
- Names in the global namespace (built-in functions like `strlen`) must be prefixed with `\` from within a namespace: `\strlen($s)` — otherwise PHP looks in the current namespace first, falls back to global for *functions* (not classes!), which is a frequent source of bugs.
- PSR-4 maps a fully-qualified class name to a file path: `Acme\Log\Writer` -> `src/Log/Writer.php` (under the `Acme\` -> `src/` rule). The class name's last segment is the filename.
- `spl_autoload_register` lets you register one or more autoloaders; PHP calls them in registration order when an unknown class is referenced.
- Composer's `vendor/autoload.php` is generated from `composer.json`'s `autoload` section; always include it once at the entry point of your app.

```php
<?php
// src/Domain/User.php
namespace App\Domain;

use App\Service\EmailService;
use App\Service\Logger\{FileLogger, MailLogger};  // grouped imports

final class User
{
    public function __construct(
        public readonly string $name,
        private EmailService $emails,
        private FileLogger $logger,
    ) {}

    public function notify(string $msg): void
    {
        $this->logger->log($msg);              // App\Service\Logger\FileLogger
        $this->emails->send($this->name, $msg);

        // Built-in function from a namespace: prefix with \ to skip fallback lookup
        $len = \strlen($msg);
        echo "Sent {$len} bytes";
    }
}
```
Caption: Namespaces and use

### Common Pitfalls

- Forgetting the leading `\` on built-in functions in namespaces — PHP falls back to global for *functions* (with a perf hit), but for *classes* it does not fall back, so `new Exception()` from a namespace fails with "class not found". Always `use Exception;` or prefix with `\Exception`.
- Confusing the namespace separator `\` with `/` or `.` — PHP uses `\` (backslash); `/` is for file paths (used in PSR-4 mapping), and `.` is for string concatenation.
- Mismatched namespace and file path — PSR-4 requires the class name's last segment to match the filename exactly (case-sensitive on Linux): `App\User` must be `src/User.php`, not `src/user.php`.
- Not regenerating the autoloader after adding classes — Composer's PSR-4 autoloader does not need regeneration for new files (it computes paths on the fly), but the classmap (`-o`) does — run `composer dump-autoload` after structural changes if you use `--optimize`.
- Declaring the `namespace` statement after any other code — it must be the very first PHP statement (only `declare(strict_types=1)` is allowed before it), or you get a fatal "namespace declaration statement has to be the very first statement".

### Real-World Applications

- Laravel's entire codebase is PSR-4 with `Illuminate\` -> `src/` mapping, autoloaded via Composer.
- Symfony components use PSR-4 namespaces like `Symfony\Component\HttpFoundation`, allowing each component to be installed independently.
- WordPress core does not use namespaces (legacy code from PHP 4 era), but modern plugins like WooCommerce and Jetpack do, with PSR-4 autoloaders.
- Slack's Hack codebase used a similar autoloader scheme with `HL¦` namespace prefixes mapped to directories, before moving to Hack's built-in module system.

### Interview Questions

- 1. What is PSR-4? — A standard mapping from fully-qualified class names to file paths: `Acme\Log\Writer` -> `src/Log/Writer.php` under the `Acme\` -> `src/` rule. The class name's last segment is the filename.
- 2. Why must `namespace` be the first statement in a file? — It's a parser rule: the only thing allowed before it is `declare(strict_types=1)`. Any other code (echo, whitespace-only outside `<?php` is fine) causes a fatal error.
- 3. Why do built-in functions need a leading `\` in namespaces? — Without it, PHP looks for a same-named function in the current namespace first (falling back to global with a perf hit for functions). Classes do NOT fall back, so `new Exception()` in a namespace fails.
- 4. What's the difference between PSR-4 and classmap autoloading? — PSR-4 computes the path from the class name on the fly; classmap is a pre-built array of class => file (faster, but needs `composer dump-autoload` to update).
- 5. What does `composer dump-autoload --optimize` do? — Builds a classmap for all known classes, converting PSR-4 lookups (which compute paths on the fly) into a single array lookup — significantly faster in production.

### Mini Project

Build a PSR-4-Autoloaded Greeting Library: A small `App\Greeter` library with `App\Greeter\Greeter` class, `App\Greeter\Formatter\HtmlFormatter` and `Formatter\PlainFormatter` classes, and a custom autoloader that maps `App\Greeter\` to `src/`. Suggested approach:
  - Create the directory structure `src/Greeter/` and `src/Greeter/Formatter/`
  - Register an `spl_autoload_register` callback that strips the `App\` prefix and maps `\` to `/`
  - Implement `Greeter` that takes a `FormatterInterface` in its constructor
  - Provide `index.php` as the entry point that requires the autoloader and uses the classes
  - Optionally convert to Composer PSR-4 with a `composer.json` autoload section

### Exercises

1. Create a namespaced class `App\Math\Calculator` with `add` and `multiply` methods; load it via a custom PSR-4 autoloader.
2. From within a namespace, call `\strlen($s)` (with backslash) vs `strlen($s)` (without) and observe the behavior in PHP 8.
3. Set up `composer.json` with `"psr-4": {"App\\": "src/"}` and run `composer dump-autoload`; then `require 'vendor/autoload.php'` and use `App\Something`.
4. Use grouped `use` imports: `use App\Math\{Calculator, Geometry, Stats};`.
5. Demonstrate the "namespace must be first statement" rule by putting an `echo` before `namespace` and reading the fatal error.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which character is the namespace separator in PHP?
9. A) /
10. B) .
11. C) ::
12. D) \ (backslash) (*)
13. Explanation: PHP uses the backslash `\` as the namespace separator (e.g. `App\Domain\User`). `/` is for file paths in PSR-4 mapping, `.` is for string concat.
14. Q2: Where must the `namespace` statement appear in a file?
15. A) First statement (only `declare(strict_types=1)` may precede it) (*)
16. B) Anywhere
17. C) After the first class
18. D) At the end of the file
19. Explanation: `namespace` must be the very first PHP statement in the file; `declare(strict_types=1)` is the only thing allowed before it.
20. Q3: What does PSR-4 specify?
21. A) A code style guide
22. B) A mapping from fully-qualified class names to file paths (*)
23. C) A logging interface
24. D) A cache interface
25. Explanation: PSR-4 maps a fully-qualified class name to a file path: `Acme\Log\Writer` -> `src/Log/Writer.php` under the `Acme\` -> `src/` rule.
26. Q4: Why do built-in functions sometimes need a leading `\` in namespaces?
27. A) They don't — it's optional everywhere
28. B) To make them faster
29. C) Without `\`, PHP looks for a same-named function in the current namespace first (*)
30. D) To enable strict mode
31. Explanation: Without `\`, PHP searches the current namespace first (falling back to global for functions with a perf hit, but NOT for classes). Prefix with `\` for clarity and speed.
32. Q5: Which statement is correct about classes in namespaces?
33. A) `new Exception()` falls back to global `\Exception`
34. B) You cannot use built-in classes in namespaces
35. C) Class names are case-insensitive in namespaces
36. D) `new Exception()` looks only for `App\...\Exception` — no fallback (*)
37. Explanation: Unlike functions, classes do NOT fall back to global from a namespace. Always `use Exception;` or write `new \Exception()`.
38. Q6: What does `composer dump-autoload --optimize` produce?
39. A) A classmap array for faster lookups in production (*)
40. B) A minified PHP file
41. C) A namespace diagram
42. D) A list of dead classes
43. Explanation: `--optimize` (or `-o`) builds a classmap (class => file array), converting PSR-4 path computation into a single array lookup — much faster in production.
44. Q7: Which `use` syntax imports multiple classes from one namespace?
45. A) `use App\Math\Calculator, Geometry, Stats;`
46. B) `use App\Math\{Calculator, Geometry, Stats};` (*)
47. C) `use App\Math\*;`
48. D) `import App\Math;`
49. Explanation: Grouped `use` syntax (PHP 7.0+) lets you import multiple classes from one namespace in a single statement with curly braces.
50. Q8: What does `__NAMESPACE__` return?
51. A) The parent namespace
52. B) The global namespace always
53. C) The current namespace as a string (*)
54. D) null
55. Explanation: `__NAMESPACE__` is a magic constant returning the current namespace as a string (empty string in the global namespace).
56. Q9: Which Composer section configures PSR-4 autoloading?
57. A) `auto`
58. B) `require`
59. C) `classes`
60. D) `autoload` with `psr-4` key (*)
61. Explanation: The `autoload` section with a `psr-4` key maps namespace prefixes to directories: `{"psr-4": {"App\\": "src/"}}`.
62. Q10: What happens if the filename case doesn't match the class name on Linux?
63. A) "Class not found" fatal — Linux filesystems are case-sensitive (*)
64. B) Works — case-insensitive
65. C) A warning is emitted
66. D) PHP auto-renames the file
67. Explanation: Linux filesystems are case-sensitive; PSR-4 requires the filename's last segment to match the class name exactly. macOS HFS+ is case-insensitive by default (masks the bug), but Linux prod fails.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which character is the namespace separator in PHP?
  options:
    - /
    - .
    - "::"
    - \ (backslash)
  correctIndex: 3
  explanation: PHP uses the backslash `\` as the namespace separator (e.g. `App\Domain\User`). `/` is for file paths in PSR-4 mapping, `.` is for string concat.
- id: q2
  question: Where must the `namespace` statement appear in a file?
  options:
    - First statement (only `declare(strict_types=1)` may precede it)
    - Anywhere
    - After the first class
    - At the end of the file
  correctIndex: 0
  explanation: "`namespace` must be the very first PHP statement in the file; `declare(strict_types=1)` is the only thing allowed before it."
- id: q3
  question: What does PSR-4 specify?
  options:
    - A code style guide
    - A mapping from fully-qualified class names to file paths
    - A logging interface
    - A cache interface
  correctIndex: 1
  explanation: "PSR-4 maps a fully-qualified class name to a file path: `Acme\\Log\\Writer` -> `src/Log/Writer.php` under the `Acme\\` -> `src/` rule."
- id: q4
  question: Why do built-in functions sometimes need a leading `\` in namespaces?
  options:
    - They don't — it's optional everywhere
    - To make them faster
    - Without `\`, PHP looks for a same-named function in the current namespace first
    - To enable strict mode
  correctIndex: 2
  explanation: Without `\`, PHP searches the current namespace first (falling back to global for functions with a perf hit, but NOT for classes). Prefix with `\` for clarity and speed.
- id: q5
  question: Which statement is correct about classes in namespaces?
  options:
    - "`new Exception()` falls back to global `\\Exception`"
    - You cannot use built-in classes in namespaces
    - Class names are case-insensitive in namespaces
    - "`new Exception()` looks only for `App\\...\\Exception` — no fallback"
  correctIndex: 3
  explanation: Unlike functions, classes do NOT fall back to global from a namespace. Always `use Exception;` or write `new \Exception()`.
- id: q6
  question: What does `composer dump-autoload --optimize` produce?
  options:
    - A classmap array for faster lookups in production
    - A minified PHP file
    - A namespace diagram
    - A list of dead classes
  correctIndex: 0
  explanation: "`--optimize` (or `-o`) builds a classmap (class => file array), converting PSR-4 path computation into a single array lookup — much faster in production."
- id: q7
  question: Which `use` syntax imports multiple classes from one namespace?
  options:
    - "`use App\\Math\\Calculator, Geometry, Stats;`"
    - "`use App\\Math\\{Calculator, Geometry, Stats};`"
    - "`use App\\Math\\*;`"
    - "`import App\\Math;`"
  correctIndex: 1
  explanation: Grouped `use` syntax (PHP 7.0+) lets you import multiple classes from one namespace in a single statement with curly braces.
- id: q8
  question: What does `__NAMESPACE__` return?
  options:
    - The parent namespace
    - The global namespace always
    - The current namespace as a string
    - "null"
  correctIndex: 2
  explanation: "`__NAMESPACE__` is a magic constant returning the current namespace as a string (empty string in the global namespace)."
- id: q9
  question: Which Composer section configures PSR-4 autoloading?
  options:
    - "`auto`"
    - "`require`"
    - "`classes`"
    - "`autoload` with `psr-4` key"
  correctIndex: 3
  explanation: 'The `autoload` section with a `psr-4` key maps namespace prefixes to directories: `{"psr-4": {"App\\": "src/"}}`.'
- id: q10
  question: What happens if the filename case doesn't match the class name on Linux?
  options:
    - '"Class not found" fatal — Linux filesystems are case-sensitive'
    - Works — case-insensitive
    - A warning is emitted
    - PHP auto-renames the file
  correctIndex: 0
  explanation: Linux filesystems are case-sensitive; PSR-4 requires the filename's last segment to match the class name exactly. macOS HFS+ is case-insensitive by default (masks the bug), but Linux prod fails.
```

