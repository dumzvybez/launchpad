---
slug: php-laravel-basics-routing-eloquent-blade
id: php-18
track: php
order: 18
title: Laravel Basics — Routing, Eloquent, Blade
description: "Build a feature-complete web app with Laravel 11: routes and controllers, the Eloquent ORM for database access, Blade templates for views, and migrations for schema management."
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=13600s
whyItMatters: "Build a feature-complete web app with Laravel 11: routes and controllers, the Eloquent ORM for database access, Blade templates for views, and migrations for schema management."
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# Laravel Basics — Routing, Eloquent, Blade

## Laravel Basics — Routing, Eloquent, Blade

### Why It Matters

Build a feature-complete web app with Laravel 11: routes and controllers, the Eloquent ORM for database access, Blade templates for views, and migrations for schema management.

Build a feature-complete web app with Laravel 11: routes and controllers, the Eloquent ORM for database access, Blade templates for views, and migrations for schema management.

### Prerequisites

- Stage 11: OOP — Inheritance, Interfaces, Traits
- Stage 13: Composer and Dependency Management
- Stage 14: PDO and Database Access
- Stage 17: REST APIs with Slim or Laravel Zero

### Topics

- Installing Laravel 11 with `composer create-project laravel/laravel`
- The directory layout: `app/`, `routes/`, `resources/views/`, `database/migrations/`
- `artisan` CLI: `serve`, `make:controller`, `make:model`, `make:migration`
- Routing: `routes/web.php` (web) vs `routes/api.php` (API, prefix `/api`)
- Route parameters, named routes, route groups, middleware
- Controllers: `__invoke` single-action, resource controllers
- Eloquent ORM: defining models, `fillable`/`guarded`, query builder, relationships
- Migrations: `Schema::create`, `up()`/`down()`, column types, indexes, foreign keys
- Blade templates: `@extends`, `@yield`, `@section`, `{{ }}` (escaped) vs `{!! !!}` (raw)
- CSRF: `@csrf` in forms, `VerifyCsrfToken` middleware
- Tinker for REPL-style exploration

### Key Concepts

- Laravel follows MVC: routes dispatch to controllers, controllers coordinate models (Eloquent) and views (Blade), Blade renders HTML with escaped data by default.
- Eloquent is an ActiveRecord ORM: each model class maps to a table, instances are rows, and methods like `find`, `where`, `save`, `delete` operate on the table.
- `fillable` (allow-list) or `guarded` (deny-list) controls mass assignment; never use `$guarded = []` in production (mass-assignment vulnerability).
- Blade's `{{ $var }}` auto-escapes with `htmlspecialchars` (XSS-safe); `{!! $var !!}` outputs raw HTML (only for trusted content).
- Migrations are version-controlled schema changes: `php artisan migrate` runs pending migrations, `migrate:rollback` undoes the last batch. Never edit a migrated file — write a new one.

```php
<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;

Route::get('/', fn() => view('welcome'))->name('home');

Route::resource('posts', PostController::class)->middleware('auth');

// Route model binding: {post} is auto-resolved from the Post model
Route::get('/posts/{post}/publish', [PostController::class, 'publish'])
    ->middleware('can:publish,post')
    ->name('posts.publish');
```
Caption: Routes — web.php

### Common Pitfalls

- N+1 queries — looping `$post->comments` for 100 posts runs 101 queries; fix with eager loading `Post::with('comments')->get()`. Use Laravel Telescope or `Model::preventLazyLoading()` in dev to catch this.
- Using `$guarded = []` (allowing mass assignment on all columns) — attackers can set `is_admin = 1` on a user update; use `$fillable` with an explicit allow-list.
- Outputting user content with `{!! !!}` in Blade — this bypasses `htmlspecialchars`, causing stored XSS; use `{{ }}` (auto-escaped) and only use raw output for trusted HTML.
- Editing a migration that's already run — Laravel records the batch number; editing a migrated file won't re-run it. Write a new migration to change the schema.
- Forgetting `@csrf` in forms — the `VerifyCsrfToken` middleware blocks POST without a token, returning 419; always use `@csrf` or `{{ csrf_field() }}` in Blade forms.

### Real-World Applications

- Laravel powers large apps like Statamic (CMS), Invoice Ninja, and Cachet (status page); 9GAG migrated from custom PHP to Laravel in 2018.
- Statamic (a flat-file CMS) is built entirely on Laravel and ships as a Composer package you install into a fresh Laravel app.
- Slack's newer internal dashboards (built after the Salesforce acquisition) use Laravel for rapid prototyping, replacing custom PHP scripts.
- Etsy explored Laravel for new internal tools but kept the storefront on legacy PHP for performance and migration-cost reasons.

### Interview Questions

- 1. What is Eloquent? — Laravel's ActiveRecord ORM: each model class maps to a table, instances are rows, and `find`/`where`/`save`/`delete` operate on the table.
- 2. What's the difference between `fillable` and `guarded`? — `fillable` is an allow-list of mass-assignable attributes; `guarded` is a deny-list. Never use `$guarded = []` in production (mass-assignment vulnerability).
- 3. How do you prevent N+1 queries in Eloquent? — Use eager loading: `Post::with('comments', 'author')->get()` loads all related data in 2-3 queries instead of N+1.
- 4. What does `{{ $var }}` do in Blade vs `{!! $var !!}`? — `{{ }}` auto-escapes with `htmlspecialchars` (XSS-safe); `{!! !!}` outputs raw HTML (only for trusted content).
- 5. Why use migrations instead of editing the schema directly? — Migrations are version-controlled, repeatable, and reversible (`up()`/`down()`); they let teams share schema changes via git and CI.

### Mini Project

Build a Blog with Posts and Comments: A Laravel 11 app with `Post` and `Comment` models, a migration for each, a resource controller for posts, a Blade view to list posts with their comment counts, and a form to add a comment (with CSRF). Suggested approach:
  - `php artisan make:model Post -mcr` (model + migration + controller)
  - `php artisan make:model Comment -m`
  - Add `hasMany`/`belongsTo` relationships
  - Eager-load comments with `Post::with('comments')->get()`
  - Add `@csrf` to the comment form and validate input with a `FormRequest`

### Exercises

1. Install Laravel 11 with `composer create-project laravel/laravel blog`, then `php artisan serve`.
2. Create a `Post` model + migration; run `php artisan migrate` and inspect the database.
3. Add a `belongsTo` relationship to `User` (as author) and a `hasMany` to `Comment`; eager-load both in a controller.
4. Build a Blade view that lists posts with `{{ $post->title }}` (auto-escaped) and a link to `route('posts.show', $post)`.
5. Add a comment form with `@csrf`, validate with a `FormRequest`, and redirect back with a status message.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is Eloquent in Laravel?
9. A) A templating engine
10. B) An ActiveRecord ORM (*)
11. C) A routing system
12. D) A test framework
13. Explanation: Eloquent is Laravel's ActiveRecord ORM: each model class maps to a table, instances are rows, and methods like `find`, `where`, `save`, `delete` operate on the table.
14. Q2: Which property controls mass-assignment via an allow-list?
15. A) `$guarded`
16. B) `$hidden`
17. C) `$fillable` (*)
18. D) `$casts`
19. Explanation: `$fillable` is an allow-list of mass-assignable attributes (e.g. `['title', 'body']`). `$guarded` is a deny-list; `$guarded = []` disables protection (vulnerable).
20. Q3: How do you prevent N+1 queries in Eloquent?
21. A) Use `->get()` instead of `->all()`
22. B) Cache the query
23. C) Use DB transactions
24. D) Eager load with `Model::with('relation')->get()` (*)
25. Explanation: Eager loading (`with('comments', 'author')`) loads all related data in 2-3 queries instead of N+1 (one query per parent + one per relation access). Use `preventLazyLoading()` in dev.
26. Q4: What does `{{ $var }}` do in Blade?
27. A) Auto-escapes with htmlspecialchars (XSS-safe) (*)
28. B) Outputs raw HTML
29. C) Trims whitespace
30. D) Encodes as JSON
31. Explanation: Blade's `{{ $var }}` auto-escapes with `htmlspecialchars` (XSS-safe). Use `{!! $var !!}` for raw HTML output (only with trusted content).
32. Q5: What does `@csrf` in a Blade form generate?
33. A) A honeypot field
34. B) A hidden `_token` field verified by VerifyCsrfToken middleware (*)
35. C) A CAPTCHA
36. D) A session ID
37. Explanation: `@csrf` generates a hidden `<input name="_token">` with the session's CSRF token; `VerifyCsrfToken` middleware verifies it on POST/PUT/DELETE.
38. Q6: Which artisan command creates a model with migration and resource controller?
39. A) `php artisan create Post`
40. B) `php artisan model Post --all`
41. C) `php artisan make:model Post -mcr` (*)
42. D) `php artisan scaffold Post`
43. Explanation: `make:model Post -mcr` creates the model (`-m` migration, `-c` controller, `-r` resourceful). Combines the most common scaffolding flags.
44. Q7: What is "route model binding"?
45. A) Binding routes to middleware
46. B) Binding routes to controllers
47. C) Binding routes to views
48. D) Laravel auto-resolves a model instance from a route parameter (*)
49. Explanation: Route model binding: `Route::get('/posts/{post}', ...)` resolves `{post}` (an ID) to a `Post` instance via Eloquent's `findOrFail`, returning 404 if not found.
50. Q8: What does `php artisan migrate:rollback` do?
51. A) Undoes the last batch of migrations (*)
52. B) Drops the database
53. C) Re-runs all migrations
54. D) Creates a new migration
55. Explanation: `migrate:rollback` runs the `down()` methods of the last batch of migrations (the most recent `--batch` number in the migrations table), undoing schema changes.
56. Q9: Which Blade directive loops over an array?
57. A) `@loop`
58. B) `@foreach` (*)
59. C) `@iterate`
60. D) `@for-each`
61. Explanation: `@foreach ($items as $item) ... @endforeach` loops over an iterable; `@forelse` provides an `@empty` branch for empty iterables.
62. Q10: What is Laravel Tinker?
63. A) A debugger
64. B) A migration tool
65. C) A REPL for interacting with your app's Eloquent models and services (*)
66. D) A deployment tool
67. Explanation: Tinker is a REPL (powered by PsySH) that boots your Laravel app, letting you interactively test Eloquent queries, services, and helpers: `php artisan tinker`.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is Eloquent in Laravel?
  options:
    - A templating engine
    - An ActiveRecord ORM
    - A routing system
    - A test framework
  correctIndex: 1
  explanation: "Eloquent is Laravel's ActiveRecord ORM: each model class maps to a table, instances are rows, and methods like `find`, `where`, `save`, `delete` operate on the table."
- id: q2
  question: Which property controls mass-assignment via an allow-list?
  options:
    - "`$guarded`"
    - "`$hidden`"
    - "`$fillable`"
    - "`$casts`"
  correctIndex: 2
  explanation: "`$fillable` is an allow-list of mass-assignable attributes (e.g. `['title', 'body']`). `$guarded` is a deny-list; `$guarded = []` disables protection (vulnerable)."
- id: q3
  question: How do you prevent N+1 queries in Eloquent?
  options:
    - Use `->get()` instead of `->all()`
    - Cache the query
    - Use DB transactions
    - Eager load with `Model::with('relation')->get()`
  correctIndex: 3
  explanation: Eager loading (`with('comments', 'author')`) loads all related data in 2-3 queries instead of N+1 (one query per parent + one per relation access). Use `preventLazyLoading()` in dev.
- id: q4
  question: What does `{{ $var }}` do in Blade?
  options:
    - Auto-escapes with htmlspecialchars (XSS-safe)
    - Outputs raw HTML
    - Trims whitespace
    - Encodes as JSON
  correctIndex: 0
  explanation: Blade's `{{ $var }}` auto-escapes with `htmlspecialchars` (XSS-safe). Use `{!! $var !!}` for raw HTML output (only with trusted content).
- id: q5
  question: What does `@csrf` in a Blade form generate?
  options:
    - A honeypot field
    - A hidden `_token` field verified by VerifyCsrfToken middleware
    - A CAPTCHA
    - A session ID
  correctIndex: 1
  explanation: "`@csrf` generates a hidden `<input name=\"_token\">` with the session's CSRF token; `VerifyCsrfToken` middleware verifies it on POST/PUT/DELETE."
- id: q6
  question: Which artisan command creates a model with migration and resource controller?
  options:
    - "`php artisan create Post`"
    - "`php artisan model Post --all`"
    - "`php artisan make:model Post -mcr`"
    - "`php artisan scaffold Post`"
  correctIndex: 2
  explanation: "`make:model Post -mcr` creates the model (`-m` migration, `-c` controller, `-r` resourceful). Combines the most common scaffolding flags."
- id: q7
  question: What is "route model binding"?
  options:
    - Binding routes to middleware
    - Binding routes to controllers
    - Binding routes to views
    - Laravel auto-resolves a model instance from a route parameter
    - to a `Post` instance via Eloquent's `findOrFail`, returning 404 if not found.
  correctIndex: 3
  explanation: "Route model binding: `Route::get('/posts/{post}', ...)` resolves `{post}` (an ID) to a `Post` instance via Eloquent's `findOrFail`, returning 404 if not found."
- id: q8
  question: What does `php artisan migrate:rollback` do?
  options:
    - Undoes the last batch of migrations
    - Drops the database
    - Re-runs all migrations
    - Creates a new migration
  correctIndex: 0
  explanation: "`migrate:rollback` runs the `down()` methods of the last batch of migrations (the most recent `--batch` number in the migrations table), undoing schema changes."
- id: q9
  question: Which Blade directive loops over an array?
  options:
    - "`@loop`"
    - "`@foreach`"
    - "`@iterate`"
    - "`@for-each`"
  correctIndex: 1
  explanation: "`@foreach ($items as $item) ... @endforeach` loops over an iterable; `@forelse` provides an `@empty` branch for empty iterables."
- id: q10
  question: What is Laravel Tinker?
  options:
    - A debugger
    - A migration tool
    - A REPL for interacting with your app's Eloquent models and services
    - A deployment tool
    - "that boots your Laravel app, letting you interactively test Eloquent queries, services, and helpers: `php artisan tinker`."
  correctIndex: 2
  explanation: "Tinker is a REPL (powered by PsySH) that boots your Laravel app, letting you interactively test Eloquent queries, services, and helpers: `php artisan tinker`."
```

