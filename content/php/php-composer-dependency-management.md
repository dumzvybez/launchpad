---
slug: php-composer-dependency-management
id: php-13
track: php
order: 13
title: Composer and Dependency Management
description: Use Composer to declare dependencies, manage versions, autoload your code, and ship installable libraries — the de-facto standard for every modern PHP project.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=9600s
whyItMatters: Use Composer to declare dependencies, manage versions, autoload your code, and ship installable libraries — the de-facto standard for every modern PHP project.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Composer and Dependency Management

## Composer and Dependency Management

### Why It Matters

Use Composer to declare dependencies, manage versions, autoload your code, and ship installable libraries — the de-facto standard for every modern PHP project.

Use Composer to declare dependencies, manage versions, autoload your code, and ship installable libraries — the de-facto standard for every modern PHP project.

### Prerequisites

- Stage 4: Functions and Include Files
- Stage 12: Namespaces, Autoloading, and PSR-4

### Topics

- `composer.json` schema: `name`, `description`, `type`, `license`, `require`, `require-dev`
- Version constraints: `^1.2`, `~1.2`, `1.2.*`, `>=1.2 <2.0`, `dev-main`, `*`
- `composer install`, `update`, `require`, `remove`
- `composer.lock` and reproducible builds
- Autoloading: `psr-4`, `classmap`, `files`
- Scripts: `pre-install-cmd`, `post-autoload-dump`, custom scripts
- Packagist and private repositories (VCS, Satis, Packagist private)
- `composer dump-autoload`, `--optimize`, `--classmap-authoritative`
- Platform packages: `php`, `ext-pdo`, `lib-libxml`
- Semantic versioning and the caret/tilde ranges
- Patches and `cweagans/composer-patches` for downstream fixes

### Key Concepts

- `composer install` reads `composer.lock` (creates it on first run) and installs exact versions; `composer update` re-resolves constraints and updates the lock file. Use `install` in CI/deploy for reproducibility, `update` occasionally to refresh.
- `^1.2.3` means `>=1.2.3 <2.0.0` (compatible within major); `~1.2.3` means `>=1.2.3 <1.3.0` (compatible within minor). `^` is the most common constraint for libraries.
- `composer.lock` MUST be committed for applications (so every deploy gets the same versions); it should NOT be committed for libraries (let the consumer resolve).
- Platform packages (`php`, `ext-pdo`, `ext-mbstring`) declare runtime requirements; Composer refuses to install if the platform doesn't match (use `--ignore-platform-reqs` sparingly).
- `vendor/autoload.php` is the entry point for autoloading both your code and dependencies; require it once at the top of your app's entry script.

```json
{
    "name": "acme/blog",
    "description": "A simple blog application",
    "type": "project",
    "license": "MIT",
    "require": {
        "php": ">=8.2",
        "ext-pdo": "*",
        "ext-mbstring": "*",
        "monolog/monolog": "^3.5",
        "slim/slim": "^4.12",
        "doctrine/orm": "^2.15"
    },
    "require-dev": {
        "phpunit/phpunit": "^10.5",
        "pestphp/pest": "^2.30",
        "squizlabs/php_codesniffer": "^3.8",
        "phpstan/phpstan": "^1.10"
    },
    "autoload": {
        "psr-4": {
            "Acme\\Blog\\": "src/"
        },
        "files": ["src/helpers.php"]
    },
    "autoload-dev": {
        "psr-4": {
            "Acme\\Blog\\Tests\\": "tests/"
        }
    },
    "scripts": {
        "test": "pest",
        "lint": "phpcs src",
        "stan": "phpstan analyse src",
        "post-autoload-dump": [
            "Acme\\Blog\\Installer::postInstall"
        ]
    },
    "config": {
        "platform": {"php": "8.2"},
        "optimize-autoloader": true,
        "sort-packages": true
    }
}
```
Caption: composer.json for an application

### Common Pitfalls

- Committing `composer.lock` for a library — libraries should let consumers resolve; only applications (type=project) commit the lock. Miscommitting causes version conflicts downstream.
- Using `*` or `dev-main` without `@dev` for stable requirements — `*` resolves to the latest including unstable, breaking on new majors; `dev-main` tracks the branch tip (unstable). Pin with `^` on a stable tag instead.
- Forgetting to install extensions declared as `ext-*` — Composer refuses to install if `ext-mbstring` is required but missing; install the extension via your package manager (e.g. `apt install php8.2-mbstring`).
- Running `composer update` in production instead of `composer install` — `update` re-resolves and may pull newer versions not tested in CI; `install` reads the lock file for exact reproducible versions.
- Not running `composer dump-autoload --optimize` in production — without `--optimize`, the PSR-4 autoloader computes file paths on every class load (slow); with it, a classmap makes lookups O(1).

### Real-World Applications

- Laravel's `laravel/laravel` is a Composer project skeleton; every Laravel app starts with `composer create-project laravel/laravel`.
- Symfony's component-based architecture ships each component (HttpFoundation, Console, etc.) as a separate Composer package, allowing selective installation.
- WordPress itself does not yet use Composer for core, but `composer.json` is standard in premium plugins like Jetpack and WooCommerce, with Packagist mirrors (wpackagist.org) for plugin distribution.
- Slack's Hack codebase used Composer before migrating to HHVM's native package manager; many internal libraries were published to a private Satis instance.

### Interview Questions

- 1. What's the difference between `composer install` and `composer update`? — `install` reads `composer.lock` for exact reproducible versions; `update` re-resolves constraints and updates the lock file. Use `install` in CI/deploy.
- 2. What does `^1.2.3` mean? — `>=1.2.3 <2.0.0` — compatible within the major version (caret); the most common constraint for libraries following semver.
- 3. Should you commit `composer.lock` for a library? — No: libraries should let consumers resolve versions; commit it only for applications (type=project).
- 4. What is `vendor/autoload.php`? — The generated autoloader entry point; require it once at the top of your app's entry script to autoload your code (per `autoload.psr-4`) and dependencies.
- 5. What does `composer dump-autoload --optimize` do? — Builds a classmap (class => file array) for all known classes, converting PSR-4 path computation into a single array lookup — much faster in production.

### Mini Project

Build a Composer-Packaged String Utils Library: A small library `acme/str-utils` with `Acme\Str\Slugger` and `Acme\Str\Caser` classes, a `composer.json` with PSR-4 autoload, a `README.md`, and a basic Pest test suite. Suggested approach:
  - Init with `composer init` and answer the prompts
  - Configure `autoload.psr-4`: `{"Acme\\Str\\": "src/"}`
  - Configure `autoload-dev.psr-4`: `{"Acme\\Str\\Tests\\": "tests/"}`
  - Write `Slugger::slugify(string): string` and `Caser::toCamel(string): string`
  - Add `pestphp/pest` as dev dep, write 3-4 tests, run `composer test`

### Exercises

1. Run `composer init` to create a `composer.json`; then `composer require monolog/monolog:^3.5` and inspect the changes to `composer.json` and `composer.lock`.
2. Configure PSR-4 autoload for `App\` -> `src/`, run `composer dump-autoload`, then `require 'vendor/autoload.php'` and use a class from `src/`.
3. Add a `composer test` script that runs `pest` (or `phpunit`); run it with `composer test`.
4. Compare `^1.2.3` vs `~1.2.3` by reading the Composer semver docs and writing out the resolved ranges.
5. Run `composer install --no-dev --optimize-autoloader` and observe the difference in `vendor/composer/autoload_classmap.php`.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which command installs exact versions from `composer.lock`?
9. A) composer install (*)
10. B) composer update
11. C) composer require
12. D) composer resolve
13. Explanation: `composer install` reads the lock file and installs the exact versions recorded there — use it in CI and production for reproducibility.
14. Q2: What does the constraint `^1.2.3` resolve to?
15. A) >=1.2.3 <1.3.0
16. B) >=1.2.3 <2.0.0 (*)
17. C) >=1.2.3 <1.2.4
18. D) only 1.2.3
19. Explanation: Caret `^` locks the major version: `>=1.2.3 <2.0.0` — minors and patches can move within the same major (semver compatible).
20. Q3: Should you commit `composer.lock` for a library package?
21. A) Yes, always
22. B) Only if it has dependencies
23. C) No — let consumers resolve versions (*)
24. D) Only for PHP 8+
25. Explanation: Libraries should NOT commit `composer.lock` (let consumers resolve); only applications (type=project) commit it for reproducible deploys.
26. Q4: Which Composer section configures PSR-4 autoload?
27. A) `psr4`
28. B) `bootstrap`
29. C) `classes`
30. D) `autoload` with `psr-4` key (*)
31. Explanation: The `autoload` section with a `psr-4` key maps namespace prefixes to directories. `autoload-dev` is for dev-only classes (tests).
32. Q5: What does `composer dump-autoload --optimize` produce?
33. A) A classmap array for O(1) lookups (*)
34. B) A minified PHP binary
35. C) A dependency tree graph
36. D) A list of security advisories
37. Explanation: `--optimize` (or `-o`) builds a classmap (class => file array), replacing PSR-4 path computation with a single array lookup — much faster in production.
38. Q6: How do you declare a PHP version requirement?
39. A) `"php_version": "8.2"`
40. B) `"require": {"php": ">=8.2"}` (*)
41. C) `"platform": "8.2"`
42. D) `"runtime": "php8.2"`
43. Explanation: PHP itself is a platform package in `require`: `"php": ">=8.2"`. Extensions use `ext-*` (e.g. `ext-mbstring`).
44. Q7: What does `composer require --dev phpunit/phpunit` do?
45. A) Installs PHPUnit globally
46. B) Skips PHPUnit in production
47. C) Adds PHPUnit to `require-dev` (*)
48. D) Removes PHPUnit from dev
49. Explanation: `--dev` adds the package to `require-dev` (not installed with `--no-dev` in production). Useful for test/lint tools.
50. Q8: Which constraint means "any version" (rarely safe)?
51. A) ^
52. B) ~
53. C) >=0
54. D) * (*)
55. Explanation: `*` matches any version, including pre-releases and majors — risky for stability. Always pin with `^` on a stable tag for libraries.
56. Q9: What is `vendor/autoload.php`?
57. A) The generated autoloader entry point for your app and dependencies (*)
58. B) A Composer binary
59. C) A package manager
60. D) A PHP extension
61. Explanation: `vendor/autoload.php` is generated by Composer and is the entry point for autoloading both your code (per `autoload.psr-4`) and dependencies — require it once at your app's entry.
62. Q10: What does `"type": "project"` mean in `composer.json`?
63. A) It's a library
64. B) It's a runnable application (commit composer.lock) (*)
65. C) It's a metapackage
66. D) It's a Composer plugin
67. Explanation: `type: project` indicates an application (not a library); for projects, `composer.lock` should be committed for reproducible deploys.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which command installs exact versions from `composer.lock`?
  options:
    - composer install
    - composer update
    - composer require
    - composer resolve
  correctIndex: 0
  explanation: "`composer install` reads the lock file and installs the exact versions recorded there — use it in CI and production for reproducibility."
- id: q2
  question: What does the constraint `^1.2.3` resolve to?
  options:
    - ">=1.2.3 <1.3.0"
    - ">=1.2.3 <2.0.0"
    - ">=1.2.3 <1.2.4"
    - only 1.2.3
  correctIndex: 1
  explanation: "Caret `^` locks the major version: `>=1.2.3 <2.0.0` — minors and patches can move within the same major (semver compatible)."
- id: q3
  question: Should you commit `composer.lock` for a library package?
  options:
    - Yes, always
    - Only if it has dependencies
    - No — let consumers resolve versions
    - Only for PHP 8+
  correctIndex: 2
  explanation: Libraries should NOT commit `composer.lock` (let consumers resolve); only applications (type=project) commit it for reproducible deploys.
- id: q4
  question: Which Composer section configures PSR-4 autoload?
  options:
    - "`psr4`"
    - "`bootstrap`"
    - "`classes`"
    - "`autoload` with `psr-4` key"
  correctIndex: 3
  explanation: The `autoload` section with a `psr-4` key maps namespace prefixes to directories. `autoload-dev` is for dev-only classes (tests).
- id: q5
  question: What does `composer dump-autoload --optimize` produce?
  options:
    - A classmap array for O(1) lookups
    - A minified PHP binary
    - A dependency tree graph
    - A list of security advisories
  correctIndex: 0
  explanation: "`--optimize` (or `-o`) builds a classmap (class => file array), replacing PSR-4 path computation with a single array lookup — much faster in production."
- id: q6
  question: How do you declare a PHP version requirement?
  options:
    - '`"php_version": "8.2"`'
    - '`"require": {"php": ">=8.2"}`'
    - '`"platform": "8.2"`'
    - '`"runtime": "php8.2"`'
  correctIndex: 1
  explanation: 'PHP itself is a platform package in `require`: `"php": ">=8.2"`. Extensions use `ext-*` (e.g. `ext-mbstring`).'
- id: q7
  question: What does `composer require --dev phpunit/phpunit` do?
  options:
    - Installs PHPUnit globally
    - Skips PHPUnit in production
    - Adds PHPUnit to `require-dev`
    - Removes PHPUnit from dev
  correctIndex: 2
  explanation: "`--dev` adds the package to `require-dev` (not installed with `--no-dev` in production). Useful for test/lint tools."
- id: q8
  question: Which constraint means "any version" (rarely safe)?
  options:
    - ^
    - "~"
    - ">=0"
    - "*"
  correctIndex: 3
  explanation: "`*` matches any version, including pre-releases and majors — risky for stability. Always pin with `^` on a stable tag for libraries."
- id: q9
  question: What is `vendor/autoload.php`?
  options:
    - The generated autoloader entry point for your app and dependencies
    - A Composer binary
    - A package manager
    - A PHP extension
  correctIndex: 0
  explanation: "`vendor/autoload.php` is generated by Composer and is the entry point for autoloading both your code (per `autoload.psr-4`) and dependencies — require it once at your app's entry."
- id: q10
  question: 'What does `"type": "project"` mean in `composer.json`?'
  options:
    - It's a library
    - It's a runnable application (commit composer.lock)
    - It's a metapackage
    - It's a Composer plugin
  correctIndex: 1
  explanation: "`type: project` indicates an application (not a library); for projects, `composer.lock` should be committed for reproducible deploys."
```

