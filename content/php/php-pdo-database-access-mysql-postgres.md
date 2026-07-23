---
slug: php-pdo-database-access-mysql-postgres
id: php-14
track: php
order: 14
title: PDO and Database Access (MySQL/Postgres)
description: Connect to MySQL and PostgreSQL with PDO, run parameterized queries safely, choose fetch modes wisely, and wrap multi-statement operations in transactions.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=10400s
whyItMatters: Connect to MySQL and PostgreSQL with PDO, run parameterized queries safely, choose fetch modes wisely, and wrap multi-statement operations in transactions.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# PDO and Database Access (MySQL/Postgres)

## PDO and Database Access (MySQL/Postgres)

### Why It Matters

Connect to MySQL and PostgreSQL with PDO, run parameterized queries safely, choose fetch modes wisely, and wrap multi-statement operations in transactions.

Connect to MySQL and PostgreSQL with PDO, run parameterized queries safely, choose fetch modes wisely, and wrap multi-statement operations in transactions.

### Prerequisites

- Stage 4: Functions and Include Files
- Stage 10: Object-Oriented PHP — Classes and Objects
- Stage 13: Composer and Dependency Management

### Topics

- PDO class overview: `PDO`, `PDOStatement`, `PDOException`
- DSN strings for MySQL, PostgreSQL, SQLite
- Connection options: error mode, fetch mode, emulated prepares, charset
- Prepared statements with `prepare` + `execute` (named and `?` placeholders)
- Fetch modes: `FETCH_ASSOC`, `FETCH_OBJ`, `FETCH_CLASS`, `FETCH_NUM`, `FETCH_BOTH`
- `fetch` vs `fetchAll` vs `fetchColumn`
- Transactions: `beginTransaction`, `commit`, `rollBack`
- Error modes: `ERRMODE_SILENT`, `ERRMODE_WARNING`, `ERRMODE_EXCEPTION`
- Emulated prepares (PDO::ATTR_EMULATE_PREPARES) and why to turn them off
- `lastInsertId`, `rowCount`, `bindValue` vs `bindParam`
- Database-specific gotchas (MySQL vs Postgres types, sequences)

### Key Concepts

- Always use prepared statements with bound parameters — never concatenate user input into SQL. PDO's emulated prepares can fall back to string interpolation if a driver lacks native prepares, so disable emulation for security-critical code: `ATTR_EMULATE_PREPARES = false`.
- Set `ERRMODE_EXCEPTION` so PDO throws `PDOException` on errors; otherwise you must check `errorCode()` after every call (error-prone).
- `FETCH_ASSOC` returns associative arrays (most common); `FETCH_CLASS` hydrates objects (useful with DTOs); `FETCH_OBJ` returns `stdClass`.
- `beginTransaction` + `commit`/`rollBack` wrap multi-statement operations; without a transaction, each statement auto-commits, leaving partial state on failure.
- `lastInsertId()` returns the last auto-increment ID for the current connection; for Postgres, you may need to specify a sequence name (`lastInsertId('users_id_seq')`).

```php
<?php
declare(strict_types=1);

$dsn = 'mysql:host=localhost;dbname=app;charset=utf8mb4';
$opts = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,   // native prepares — more secure
    PDO::ATTR_PERSISTENT         => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $opts);
} catch (PDOException $e) {
    throw new RuntimeException('DB connection failed: ' . $e->getMessage(), 0, $e);
}
```
Caption: Connecting with safe options

### Common Pitfalls

- Concatenating user input into SQL — even "trusted" input can be hijacked via XSS-stored-to-SQL or compromised clients; always use prepared statements with bound parameters.
- Leaving `ATTR_EMULATE_PREPARES = true` (the default in some setups) — emulated prepares fall back to string interpolation client-side, which can mask type bugs and bypass native driver protections; set `false` for security-critical code.
- Forgetting to commit or roll back a transaction — if a script dies mid-transaction, the DB rolls back when the connection closes, but the lock may persist; always wrap in try/finally or use `rollBack` in catch.
- Using `rowCount()` for SELECT in MySQL — MySQL returns the number of rows actually fetched (only with buffered queries), but Postgres's `rowCount` for SELECT returns 0 unless you've fetched all rows. Use `SELECT COUNT(*)` for reliable counts.
- Trusting `lastInsertId()` across connections — it's connection-specific; persistent connections or connection pools can return stale IDs. Always call it immediately after the INSERT on the same connection.

### Real-World Applications

- Laravel's database layer wraps PDO with Eloquent; under the hood, every Eloquent query becomes a parameterized PDO statement.
- WordPress still uses `wpdb` (a custom MySQL wrapper, not PDO) for backward compatibility, but every modern PHP framework uses PDO directly.
- Wikipedia's MediaWiki uses PDO (since 1.28) for Postgres and MySQL, with native prepared statements and explicit transaction control.
- Etsy migrated from raw `mysql_*` calls to PDO in 2014-2015, eliminating an entire class of SQL-injection vulnerabilities with prepared statements.

### Interview Questions

- 1. Why use prepared statements instead of `query()` with concatenated SQL? — Prepared statements separate SQL structure from data, preventing SQL injection; the database engine compiles the statement once and binds parameters as data (not executable code).
- 2. What does `ATTR_EMULATE_PREPARES` do? — When true, PDO simulates prepares client-side (string interpolation); when false, it uses native driver prepares (more secure, type-correct). Default is true for MySQL — turn off in production.
- 3. What's the difference between `FETCH_ASSOC`, `FETCH_OBJ`, and `FETCH_CLASS`? — ASSOC returns associative arrays; OBJ returns stdClass instances; CLASS hydrates named class instances with public properties and an optional constructor.
- 4. Why wrap multi-statement operations in a transaction? — Without a transaction, each statement auto-commits; a failure mid-way leaves partial state. Transactions give atomicity (all-or-nothing) plus isolation.
- 5. Why can't you parameterize table or column names? — Prepared statements bind *values* (literals), not identifiers; the DB compiles the SQL structure first. Validate identifiers against an allow-list and interpolate them into SQL.

### Mini Project

Build a Tiny ORM with PDO: A `Model` base class with `find(int $id): ?static`, `all(): array`, `save(): void` (insert or update), and `delete(): void`, plus a `User extends Model` with `table()` returning `'users'`. Suggested approach:
  - Use `static::class` and late static binding so subclasses get their own type back
  - Use `FETCH_CLASS` to hydrate instances
  - Use prepared statements with named parameters everywhere
  - Track a "dirty" flag to skip no-op saves
  - Wrap `save()` in a transaction if it touches multiple rows

### Exercises

1. Connect to a SQLite database (`sqlite:/tmp/test.db`) with `ERRMODE_EXCEPTION` and `FETCH_ASSOC`; create a `users` table and insert a row.
2. Use a prepared statement with named parameters to select users by role; print results with `fetchAll`.
3. Wrap two UPDATEs in a transaction; deliberately throw an exception to verify the rollback.
4. Use `FETCH_CLASS` to hydrate a `User` object from a SELECT; verify the constructor runs after property assignment.
5. Demonstrate that identifiers can't be parameterized by trying to bind `:sort` for an `ORDER BY` clause — then fix it with an allow-list.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which method prepares a SQL statement with bound parameters?
9. A) `PDO::query()`
10. B) `PDO::prepare()` (*)
11. C) `PDO::exec()`
12. D) `PDO::run()`
13. Explanation: `PDO::prepare()` returns a `PDOStatement` that you execute with bound parameters, separating SQL structure from data — preventing injection.
14. Q2: What does `ATTR_EMULATE_PREPARES = false` do?
15. A) Disables prepared statements
16. B) Speeds up queries
17. C) Uses native driver prepares (more secure) (*)
18. D) Enables transactions
19. Explanation: With `false`, PDO uses the database's native prepared statements (more secure, type-correct). With `true` (default for MySQL), it simulates them client-side via interpolation.
20. Q3: Which error mode throws `PDOException` on errors?
21. A) `ERRMODE_SILENT`
22. B) `ERRMODE_WARNING`
23. C) `ERRMODE_FATAL`
24. D) `ERRMODE_EXCEPTION` (*)
25. Explanation: `ERRMODE_EXCEPTION` throws exceptions on errors, letting you handle them with try/catch. `ERRMODE_WARNING` emits E_WARNING; `ERRMODE_SILENT` requires manual `errorCode()` checks.
26. Q4: Which fetch mode returns an associative array?
27. A) `FETCH_ASSOC` (*)
28. B) `FETCH_NUM`
29. C) `FETCH_BOTH`
30. D) `FETCH_OBJ`
31. Explanation: `FETCH_ASSOC` returns arrays keyed by column name. `FETCH_NUM` keys by index; `FETCH_BOTH` includes both; `FETCH_OBJ` returns stdClass instances.
32. Q5: Why can't you parameterize table or column names?
33. A) It's a security risk
34. B) PDO doesn't support placeholders for identifiers — they bind *values* (literals) only (*)
35. C) It's slower
36. D) It only works in MySQL
37. Explanation: Prepared statement placeholders bind values (literals), not identifiers; the SQL structure is compiled first. Validate identifiers with an allow-list and interpolate.
38. Q6: What does `beginTransaction()` + `commit()` provide?
39. A) Faster queries
40. B) Persistent connections
41. C) Atomicity — all-or-nothing for multi-statement operations (*)
42. D) Encryption
43. Explanation: Transactions wrap multiple statements so they all commit or all roll back — providing atomicity. Use `rollBack()` on exception to undo partial work.
44. Q7: Which method returns the last inserted auto-increment ID?
45. A) `PDOStatement::lastId()`
46. B) `PDO::insertId()`
47. C) `PDOStatement::rowCount()`
48. D) `PDO::lastInsertId()` (*)
49. Explanation: `PDO::lastInsertId()` returns the last auto-increment ID for the current connection. For Postgres sequences, pass the sequence name as an argument.
50. Q8: Which fetch mode hydrates objects of a specified class?
51. A) `FETCH_CLASS` (*)
52. B) `FETCH_OBJ`
53. C) `FETCH_LAZY`
54. D) `FETCH_NAMED`
55. Explanation: `FETCH_CLASS` instantiates the named class and assigns public properties from columns; the constructor runs AFTER property assignment (useful for normalization).
56. Q9: What does `PDOStatement::fetchColumn()` return?
57. A) All rows from the result set
58. B) A single value from the next row's first column (or specified column) (*)
59. C) The column count
60. D) An associative array
61. Explanation: `fetchColumn($col = 0)` returns a single value from the next row's specified column — perfect for `SELECT COUNT(*)` or scalar lookups.
62. Q10: Why is `rowCount()` unreliable for SELECT on Postgres?
63. A) It's not implemented
64. B) It returns the number of columns
65. C) It returns 0 unless rows have been fetched (Postgres uses server-side cursors) (*)
66. D) It always returns 1
67. Explanation: Postgres's `rowCount()` for SELECT returns the number of rows fetched so far (often 0 before fetching). Use `SELECT COUNT(*)` with `fetchColumn()` for reliable counts.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which method prepares a SQL statement with bound parameters?
  options:
    - "`PDO::query()`"
    - "`PDO::prepare()`"
    - "`PDO::exec()`"
    - "`PDO::run()`"
  correctIndex: 1
  explanation: "`PDO::prepare()` returns a `PDOStatement` that you execute with bound parameters, separating SQL structure from data — preventing injection."
- id: q2
  question: What does `ATTR_EMULATE_PREPARES = false` do?
  options:
    - Disables prepared statements
    - Speeds up queries
    - Uses native driver prepares (more secure)
    - Enables transactions
    - ", it simulates them client-side via interpolation."
  correctIndex: 2
  explanation: With `false`, PDO uses the database's native prepared statements (more secure, type-correct). With `true` (default for MySQL), it simulates them client-side via interpolation.
- id: q3
  question: Which error mode throws `PDOException` on errors?
  options:
    - "`ERRMODE_SILENT`"
    - "`ERRMODE_WARNING`"
    - "`ERRMODE_FATAL`"
    - "`ERRMODE_EXCEPTION`"
  correctIndex: 3
  explanation: "`ERRMODE_EXCEPTION` throws exceptions on errors, letting you handle them with try/catch. `ERRMODE_WARNING` emits E_WARNING; `ERRMODE_SILENT` requires manual `errorCode()` checks."
- id: q4
  question: Which fetch mode returns an associative array?
  options:
    - "`FETCH_ASSOC`"
    - "`FETCH_NUM`"
    - "`FETCH_BOTH`"
    - "`FETCH_OBJ`"
  correctIndex: 0
  explanation: "`FETCH_ASSOC` returns arrays keyed by column name. `FETCH_NUM` keys by index; `FETCH_BOTH` includes both; `FETCH_OBJ` returns stdClass instances."
- id: q5
  question: Why can't you parameterize table or column names?
  options:
    - It's a security risk
    - PDO doesn't support placeholders for identifiers — they bind *values* (literals) only
    - It's slower
    - It only works in MySQL
  correctIndex: 1
  explanation: Prepared statement placeholders bind values (literals), not identifiers; the SQL structure is compiled first. Validate identifiers with an allow-list and interpolate.
- id: q6
  question: What does `beginTransaction()` + `commit()` provide?
  options:
    - Faster queries
    - Persistent connections
    - Atomicity — all-or-nothing for multi-statement operations
    - Encryption
  correctIndex: 2
  explanation: Transactions wrap multiple statements so they all commit or all roll back — providing atomicity. Use `rollBack()` on exception to undo partial work.
- id: q7
  question: Which method returns the last inserted auto-increment ID?
  options:
    - "`PDOStatement::lastId()`"
    - "`PDO::insertId()`"
    - "`PDOStatement::rowCount()`"
    - "`PDO::lastInsertId()`"
  correctIndex: 3
  explanation: "`PDO::lastInsertId()` returns the last auto-increment ID for the current connection. For Postgres sequences, pass the sequence name as an argument."
- id: q8
  question: Which fetch mode hydrates objects of a specified class?
  options:
    - "`FETCH_CLASS`"
    - "`FETCH_OBJ`"
    - "`FETCH_LAZY`"
    - "`FETCH_NAMED`"
  correctIndex: 0
  explanation: "`FETCH_CLASS` instantiates the named class and assigns public properties from columns; the constructor runs AFTER property assignment (useful for normalization)."
- id: q9
  question: What does `PDOStatement::fetchColumn()` return?
  options:
    - All rows from the result set
    - A single value from the next row's first column (or specified column)
    - The column count
    - An associative array
  correctIndex: 1
  explanation: "`fetchColumn($col = 0)` returns a single value from the next row's specified column — perfect for `SELECT COUNT(*)` or scalar lookups."
- id: q10
  question: Why is `rowCount()` unreliable for SELECT on Postgres?
  options:
    - It's not implemented
    - It returns the number of columns
    - It returns 0 unless rows have been fetched (Postgres uses server-side cursors)
    - It always returns 1
  correctIndex: 2
  explanation: Postgres's `rowCount()` for SELECT returns the number of rows fetched so far (often 0 before fetching). Use `SELECT COUNT(*)` with `fetchColumn()` for reliable counts.
```

