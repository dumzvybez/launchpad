---
slug: postgresql-functions-sql-pl-pgsql-procedural
id: postgresql-08
track: postgresql
order: 8
title: Functions — SQL, PL/pgSQL, Procedural
description: Write SQL functions, PL/pgSQL procedural functions, and use other PL languages (plpgsql, plpython3u, plv8) — and learn when to use a function vs a view vs an application-side query.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=qw--VYLpxG4&t=8400s
whyItMatters: Write SQL functions, PL/pgSQL procedural functions, and use other PL languages (plpgsql, plpython3u, plv8) — and learn when to use a function vs a view vs an application-side query.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Functions — SQL, PL/pgSQL, Procedural

## Functions — SQL, PL/pgSQL, Procedural

### Why It Matters

Write SQL functions, PL/pgSQL procedural functions, and use other PL languages (plpgsql, plpython3u, plv8) — and learn when to use a function vs a view vs an application-side query.

Write SQL functions, PL/pgSQL procedural functions, and use other PL languages (plpgsql, plpython3u, plv8) — and learn when to use a function vs a view vs an application-side query.

### Prerequisites

- Stage 4: Schemas, Tables, and Constraints
- Stage 7: Views and Materialized Views

### Topics

- CREATE FUNCTION basics: parameters, RETURNS, LANGUAGE, STRICT, SECURITY DEFINER vs INVOKER
- SQL functions: inlined, simple, fast for set-returning
- PL/pgSQL: variables, IF, LOOP, FOR, WHILE, EXCEPTION blocks
- RETURN NEXT and RETURN QUERY for set-returning functions (SRFs)
- Function volatility: IMMUTABLE, STABLE, VOLATILE (default) — and why it matters for indexes
- Dollar-quoting ($$body$$) and named tags ($func$body$func$) to avoid quote escaping
- search_path injection in SECURITY DEFINER — the #1 function security bug
- Other PLs: plpython3u (untrusted), plv8 (JavaScript), plperl

### Key Concepts

- Function volatility determines what the planner can do: IMMUTABLE (same args → same result, forever) can be precomputed and used in indexes; STABLE (same within a transaction) can be cached; VOLATILE (default) might return different results each call.
- Marking a function IMMUTABLE incorrectly is a footgun — the planner may precompute it once and reuse the result, hiding bugs that depend on time or DB state.
- SECURITY DEFINER functions run with the privileges of the function owner, not the caller — they're the Postgres equivalent of setuid. Always fix search_path or you're vulnerable to a trojan-horse attack.
- The classic search_path injection: a SECURITY DEFINER function owned by `postgres` that runs `SELECT * FROM users WHERE ...` — an attacker creates a malicious `users` function/table in `public` and hijacks the call.
- Fix: `ALTER FUNCTION ... SET search_path = my_schema, pg_temp;` (explicit, no public).
- PL/pgSQL is a real language with variables, loops, exceptions — but don't write business logic in it; use it for tight data operations and keep complex logic in your application.
- SQL functions can be inlined into the calling query (faster than PL/pgSQL for simple cases), but PL/pgSQL lets you use control flow.

```sql
-- IMMUTABLE: same args -> same result forever; can be used in indexes
CREATE OR REPLACE FUNCTION price_with_tax(price numeric, rate numeric)
RETURNS numeric
LANGUAGE sql
IMMUTABLE
STRICT                              -- returns NULL if any arg is NULL
AS $$
    SELECT (price * (1 + rate))::numeric(19, 2)
$$;

-- Now you can index on it:
CREATE INDEX products_taxed_price_idx
    ON products (price_with_tax(price, tax_rate));

SELECT price_with_tax(100, 0.07);   -- 107.00
```
Caption: SQL function with STRICT and IMMUTABLE

### Common Pitfalls

- SECURITY DEFINER without fixing search_path — the #1 Postgres function vulnerability; an attacker creates a malicious object in `public` (or pg_temp) and hijacks the call. Always `ALTER FUNCTION ... SET search_path = my_schema, pg_temp`.
- Marking a function IMMUTABLE when it depends on DB state or time — the planner may precompute and reuse, hiding bugs. IMMUTABLE means "same args → same result, forever, no side effects".
- Forgetting STRICT when you want NULL-in-NULL-out — without STRICT, a function called with a NULL arg still runs and you must handle NULL manually.
- Using PL/pgSQL for complex business logic — it's hard to test, debug, and version-control; keep complex logic in your application and reserve PL/pgSQL for tight data operations.
- Not REVOKE-ing EXECUTE from PUBLIC on security-sensitive functions — by default, any role can call any function; restrict with explicit GRANT.

### Real-World Applications

- Stripe's ledger uses PL/pgSQL functions for atomic money-movement operations that must be transactional at the database level.
- Discord uses SQL functions as a thin API layer for high-frequency lookups (user presence, channel membership).
- Reddit uses IMMUTABLE functions to compute vote rankings that are then indexed for fast feed generation.
- Spotify uses SECURITY DEFINER functions to expose curated analytics to internal tools without granting direct table access.

### Interview Questions

- 1. What's the difference between SECURITY DEFINER and SECURITY INVOKER? — DEFINER runs with the function owner's privileges (like setuid); INVOKER (default) runs with the caller's privileges.
- 2. What is the search_path injection attack on SECURITY DEFINER? — Without an explicit search_path, an attacker creates a malicious object in `public` (or pg_temp) that shadows the intended schema, hijacking the call.
- 3. What does IMMUTABLE mean for a function, and why does it matter? — Same args → same result forever, no side effects; the planner can precompute and use it in expression indexes. Mis-marking is a footgun.
- 4. What's the difference between IMMUTABLE, STABLE, and VOLATILE? — IMMUTABLE: same args, same result forever; STABLE: same within a transaction; VOLATILE (default): can return different results each call.
- 5. When would you use a SQL function over PL/pgSQL? — SQL functions can be inlined into the calling query (faster for simple cases) and are easier to reason about; PL/pgSQL is for control flow and loops.

### Mini Project

Build a Funds-Transfer API: A `transfer_funds(from_acct, to_acct, amount)` PL/pgSQL function that: (1) locks the source row FOR UPDATE, (2) checks balance, (3) updates both accounts, (4) writes an audit log row, (5) raises a clean error on insufficient funds, (6) rolls back on any exception. Add tests that demonstrate success, insufficient funds, and concurrent transfer (deadlock). Suggested approach:
  - Use SELECT ... FOR UPDATE to lock the source row
  - RAISE EXCEPTION ... USING ERRCODE = '40001' for insufficient funds
  - Wrap the body in BEGIN ... EXCEPTION WHEN OTHERS THEN RAISE;
  - Add a SECURITY DEFINER wrapper `transfer_funds_safe` with a fixed search_path
  - Test deadlock by running two transfers in opposite directions from two psql sessions

### Exercises

1. Create an IMMUTABLE function `price_with_tax(price, rate)` and index on it; verify the index is used via EXPLAIN.
2. Create a PL/pgSQL function with a FOR loop that inserts 1000 rows; measure the time vs a single INSERT ... SELECT.
3. Create a set-returning function with RETURN QUERY; SELECT from it; verify the result.
4. Create a SECURITY DEFINER function and demonstrate the search_path injection attack (create a malicious public.users table); then fix with explicit search_path and re-demonstrate the attack fails.
5. Mark a function STABLE that uses now() — observe the planner error or warning, then fix by marking it VOLATILE or STABLE carefully.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does SECURITY DEFINER mean for a function?
9. A) It runs with the caller's privileges
10. B) It can only be called by the owner
11. C) It encrypts the parameters
12. D) It runs with the function owner's privileges (like setuid) (*)
13. Explanation: SECURITY DEFINER runs with the owner's privileges — useful for granting controlled access to data the caller can't see directly. Always fix search_path or you're vulnerable to a trojan-horse attack.
14. Q2: What is the classic search_path injection attack on a SECURITY DEFINER function?
15. A) An attacker creates a malicious object in public (or pg_temp) that shadows the intended schema (*)
16. B) An attacker guesses the password
17. C) An attacker resets search_path globally
18. D) An attacker drops the function
19. Explanation: Without an explicit search_path, the function resolves names using the caller's search_path; a malicious public.users table can hijack `SELECT * FROM users`. Fix with `ALTER FUNCTION ... SET search_path = my_schema, pg_temp`.
20. Q3: What does IMMUTABLE function volatility mean?
21. A) Same args → same result within a transaction
22. B) Same args → same result forever, no side effects; can be precomputed and used in indexes (*)
23. C) The function can't be called twice
24. D) The function has no parameters
25. Explanation: IMMUTABLE is the strongest guarantee — the planner can precompute and index it. Mis-marking (e.g. for a function using now()) is a serious bug.
26. Q4: What does STRICT do in CREATE FUNCTION?
27. A) Validates the function body
28. B) Forces IMMUTABLE volatility
29. C) Returns NULL immediately if any argument is NULL; the body is not executed (*)
30. D) Disables exceptions
31. Explanation: STRICT (a.k.a. RETURNS NULL ON NULL INPUT) skips the body and returns NULL when any arg is NULL; useful for math-style functions and to avoid manual NULL handling.
32. Q5: Which is the right way to fix a SECURITY DEFINER function's search_path?
33. A) Drop and recreate it weekly
34. B) Set search_path globally in postgresql.conf
35. C) Mark the function IMMUTABLE
36. D) ALTER FUNCTION ... SET search_path = my_schema, pg_temp (*)
37. Explanation: Fix search_path explicitly with no `public`; pg_temp is allowed but should be last. This makes the function resolve names only in my_schema, blocking the trojan-horse attack.
38. Q6: What's the difference between SQL functions and PL/pgSQL functions?
39. A) SQL functions can be inlined into the calling query; PL/pgSQL adds control flow (*)
40. B) SQL functions are slower
41. C) PL/pgSQL functions can't return sets
42. D) SQL functions require superuser
43. Explanation: SQL functions are macro-expanded and inlined by the planner (faster for simple cases); PL/pgSQL is a real procedural language with variables, loops, and exceptions.
44. Q7: Which volatility is correct for a function that reads from a table?
45. A) IMMUTABLE
46. B) STABLE (*)
47. C) VOLATILE
48. D) Any — it doesn't matter
49. Explanation: Table reads mean the result depends on DB state, so IMMUTABLE is wrong; STABLE (same result within a transaction) is correct for read-only functions. VOLATILE is the default but too pessimistic for read-only functions.
50. Q8: What does RETURN QUERY do in PL/pgSQL?
51. A) Returns immediately
52. B) Throws an error
53. C) Appends the rows from a SELECT to the function's result set (*)
54. D) Rolls back the transaction
55. Explanation: RETURN QUERY appends rows to the set-returning function's output, allowing a PL/pgSQL function to yield multiple rows from one or more SELECTs.
56. Q9: What is dollar-quoting ($$body$$) for?
57. A) Commenting
58. B) Marking IMMUTABLE
59. C) Naming the function
60. D) Avoiding quote escaping inside function bodies (*)
61. Explanation: Dollar-quoting lets you write single quotes inside a function body without doubling them; use a named tag ($func$ ... $func$) if the body contains $$ itself.
62. Q10: What is a benefit of marking a function IMMUTABLE correctly?
63. A) The planner can precompute it and use it in expression indexes (*)
64. B) It runs faster automatically
65. C) It can be called without EXECUTE privilege
66. D) It can't raise errors
67. Explanation: IMMUTABLE tells the planner the result is constant for given args; it can be cached, precomputed, and used to build expression indexes (e.g. `CREATE INDEX ON t (my_immutable_func(col))`).
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does SECURITY DEFINER mean for a function?
  options:
    - It runs with the caller's privileges
    - It can only be called by the owner
    - It encrypts the parameters
    - It runs with the function owner's privileges (like setuid)
  correctIndex: 3
  explanation: SECURITY DEFINER runs with the owner's privileges — useful for granting controlled access to data the caller can't see directly. Always fix search_path or you're vulnerable to a trojan-horse attack.
- id: q2
  question: What is the classic search_path injection attack on a SECURITY DEFINER function?
  options:
    - An attacker creates a malicious object in public (or pg_temp) that shadows the intended schema
    - An attacker guesses the password
    - An attacker resets search_path globally
    - An attacker drops the function
  correctIndex: 0
  explanation: Without an explicit search_path, the function resolves names using the caller's search_path; a malicious public.users table can hijack `SELECT * FROM users`. Fix with `ALTER FUNCTION ... SET search_path = my_schema, pg_temp`.
- id: q3
  question: What does IMMUTABLE function volatility mean?
  options:
    - Same args → same result within a transaction
    - Same args → same result forever, no side effects; can be precomputed and used in indexes
    - The function can't be called twice
    - The function has no parameters
  correctIndex: 1
  explanation: IMMUTABLE is the strongest guarantee — the planner can precompute and index it. Mis-marking (e.g. for a function using now()) is a serious bug.
- id: q4
  question: What does STRICT do in CREATE FUNCTION?
  options:
    - Validates the function body
    - Forces IMMUTABLE volatility
    - Returns NULL immediately if any argument is NULL; the body is not executed
    - Disables exceptions
    - skips the body and returns NULL when any arg is NULL; useful for math-style functions and to avoid manual NULL handling.
  correctIndex: 2
  explanation: STRICT (a.k.a. RETURNS NULL ON NULL INPUT) skips the body and returns NULL when any arg is NULL; useful for math-style functions and to avoid manual NULL handling.
- id: q5
  question: Which is the right way to fix a SECURITY DEFINER function's search_path?
  options:
    - Drop and recreate it weekly
    - Set search_path globally in postgresql.conf
    - Mark the function IMMUTABLE
    - ALTER FUNCTION ... SET search_path = my_schema, pg_temp
  correctIndex: 3
  explanation: Fix search_path explicitly with no `public`; pg_temp is allowed but should be last. This makes the function resolve names only in my_schema, blocking the trojan-horse attack.
- id: q6
  question: What's the difference between SQL functions and PL/pgSQL functions?
  options:
    - SQL functions can be inlined into the calling query; PL/pgSQL adds control flow
    - SQL functions are slower
    - PL/pgSQL functions can't return sets
    - SQL functions require superuser
  correctIndex: 0
  explanation: SQL functions are macro-expanded and inlined by the planner (faster for simple cases); PL/pgSQL is a real procedural language with variables, loops, and exceptions.
- id: q7
  question: Which volatility is correct for a function that reads from a table?
  options:
    - IMMUTABLE
    - STABLE
    - VOLATILE
    - Any — it doesn't matter
  correctIndex: 1
  explanation: Table reads mean the result depends on DB state, so IMMUTABLE is wrong; STABLE (same result within a transaction) is correct for read-only functions. VOLATILE is the default but too pessimistic for read-only functions.
- id: q8
  question: What does RETURN QUERY do in PL/pgSQL?
  options:
    - Returns immediately
    - Throws an error
    - Appends the rows from a SELECT to the function's result set
    - Rolls back the transaction
  correctIndex: 2
  explanation: RETURN QUERY appends rows to the set-returning function's output, allowing a PL/pgSQL function to yield multiple rows from one or more SELECTs.
- id: q9
  question: What is dollar-quoting ($$body$$) for?
  options:
    - Commenting
    - Marking IMMUTABLE
    - Naming the function
    - Avoiding quote escaping inside function bodies
  correctIndex: 3
  explanation: Dollar-quoting lets you write single quotes inside a function body without doubling them; use a named tag ($func$ ... $func$) if the body contains $$ itself.
- id: q10
  question: What is a benefit of marking a function IMMUTABLE correctly?
  options:
    - The planner can precompute it and use it in expression indexes
    - It runs faster automatically
    - It can be called without EXECUTE privilege
    - It can't raise errors
  correctIndex: 0
  explanation: IMMUTABLE tells the planner the result is constant for given args; it can be cached, precomputed, and used to build expression indexes (e.g. `CREATE INDEX ON t (my_immutable_func(col))`).
```

