---
slug: postgresql-security-roles-grants-rls-pgcrypto
id: postgresql-15
track: postgresql
order: 15
title: Security — Roles, Grants, RLS, pgcrypto
description: Implement least-privilege roles, row-level security (RLS) for multi-tenant isolation, column-level grants, and pgcrypto for column-level encryption of PII.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=Q56kljmIN14
whyItMatters: Implement least-privilege roles, row-level security (RLS) for multi-tenant isolation, column-level grants, and pgcrypto for column-level encryption of PII.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# Security — Roles, Grants, RLS, pgcrypto

## Security — Roles, Grants, RLS, pgcrypto

### Why It Matters

Implement least-privilege roles, row-level security (RLS) for multi-tenant isolation, column-level grants, and pgcrypto for column-level encryption of PII.

Implement least-privilege roles, row-level security (RLS) for multi-tenant isolation, column-level grants, and pgcrypto for column-level encryption of PII.

### Prerequisites

- Stage 4: Schemas, Tables, and Constraints
- Stage 8: Functions — SQL, PL/pgSQL, Procedural

### Topics

- Roles vs users vs groups (users are roles with LOGIN)
- GRANT/REVOKE: SELECT, INSERT, UPDATE, DELETE, USAGE, CREATE, EXECUTE
- Column-level GRANTs for sensitive columns (e.g. salary)
- Row-Level Security (RLS): ENABLE, FORCE, CREATE POLICY, USING, WITH CHECK
- Per-tenant RLS via `current_setting('app.tenant_id')`
- pgcrypto: pgp_sym_encrypt/pgp_sym_decrypt, digest, hmac
- SECURITY DEFINER functions with safe search_path (covered in Stage 8)
- pgaudit for compliance-grade DML/DDL logging

### Key Concepts

- The principle of least privilege: grant the minimum needed (INSERT/SELECT on specific tables, no SUPERUSER, no CREATE).
- RLS adds a USING clause (filter rows visible to SELECT/UPDATE/DELETE) and a WITH CHECK clause (rows that can be INSERTed/UPDATEd); without WITH CHECK, new rows can violate isolation.
- `FORCE ROW LEVEL SECURITY` makes RLS apply to the table owner too — important for SECURITY DEFINER functions and "owner can't bypass" semantics.
- `current_setting('app.tenant_id')` set per-request by the application (via SET LOCAL in a transaction) is the standard pattern for per-tenant RLS policies.
- pgcrypto's pgp_sym_encrypt/decrypt is session-key symmetric encryption; the key comes from a session setting (`app.pgp_key`) or environment variable — never store it in the DB.
- Column-level GRANTs (`GRANT SELECT (id, name) ON users TO analyst`) hide sensitive columns from roles that only need the safe ones.
- pgaudit logs DML and DDL for compliance (SOC 2, HIPAA, PCI); configure `pgaudit.log = 'write, ddl'` and ship logs to a SIEM.

```sql
-- Application role: only DML on relevant tables, no SUPERUSER, no CREATE
CREATE ROLE app_user LOGIN PASSWORD 'use-env-secret'
    NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION
    CONNECTION LIMIT 50;

GRANT USAGE  ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE
    ON ALL TABLES IN SCHEMA public TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;

-- Analyst role: read-only, but with sensitive columns hidden
CREATE ROLE analyst LOGIN PASSWORD 'env-secret';
GRANT SELECT (id, name, department_id, hire_date) ON employee TO analyst;
-- analyst cannot SELECT salary or ssn
```
Caption: Least-privilege roles and column-level grants

### Common Pitfalls

- Forgetting WITH CHECK on RLS policies — without WITH CHECK, a tenant-A user can INSERT a row with tenant_id = B (the USING clause only filters reads); always include WITH CHECK.
- Bypassing RLS with SUPERUSER or BYPASSRLS — superusers and roles with BYPASSRLS ignore RLS; never grant these to the application role.
- Storing the pgcrypto key in the database — the key should come from a secret manager (Vault, AWS KMS) or environment variable; if the DB is compromised, the key is too.
- Forgetting FORCE ROW LEVEL SECURITY — without FORCE, the table owner bypasses RLS, which defeats the purpose if your SECURITY DEFINER function owns the table.
- Granting CREATE on public schema to all roles — PG15+ no longer grants CREATE on public to PUBLIC by default, but verify; a malicious user can create objects that shadow yours (the search_path injection vector).

### Real-World Applications

- Stripe uses RLS for per-merchant isolation in shared tables, with FORCE on every tenant-scoped table.
- Discord uses RLS for per-server message isolation in shared message tables for free-tier servers.
- Apple's iCloud services use pgcrypto for column-level encryption of sensitive user data.
- Spotify uses pgaudit for compliance-grade logging of royalty-accounting DML.

### Interview Questions

- 1. What's the difference between USING and WITH CHECK in RLS? — USING filters rows visible to SELECT/UPDATE/DELETE; WITH CHECK constrains INSERT/UPDATE. Without WITH CHECK, a user can INSERT rows they couldn't read.
- 2. What does FORCE ROW LEVEL SECURITY do? — Makes RLS apply to the table owner too (owners normally bypass RLS); essential for SECURITY DEFINER functions and shared tables.
- 3. Where should the pgcrypto key come from? — A secret manager (Vault, AWS KMS) or environment variable; never store it in the DB (if the DB is compromised, the key is too).
- 4. How do you grant SELECT on only some columns? — `GRANT SELECT (id, name) ON users TO analyst` — the role can SELECT only the named columns, hiding salary/ssn.
- 5. What is pgaudit for? — Compliance-grade DML/DDL logging for SOC 2, HIPAA, PCI; configure `pgaudit.log = 'write, ddl'` and ship logs to a SIEM.

### Mini Project

Build a Multi-Tenant RLS Isolation Layer: For `tenants`, `users`, and `events` tables, enable RLS with FORCE, write policies that filter on `current_setting('app.tenant_id')::bigint`, create `app_user` and `analyst` roles with column-level grants, and write a test that demonstrates cross-tenant SELECT/INSERT are blocked. Add pgcrypto for PII in events.payload. Suggested approach:
  - ENABLE and FORCE RLS on users and events
  - Policy: `USING (tenant_id = current_setting('app.tenant_id')::bigint) WITH CHECK (...)`
  - Test: SET LOCAL app.tenant_id = '1'; INSERT a row with tenant_id = 2 — should fail with check violation
  - Test: SET LOCAL app.tenant_id = '1'; SELECT — only tenant 1's rows visible
  - Add pgcrypto for an `events.pii_payload` bytea column

### Exercises

1. Create `app_user` and `analyst` roles; grant DML to app_user and SELECT (excluding salary) to analyst; verify analyst cannot SELECT salary.
2. Enable RLS on a multi-tenant table; create a policy on current_setting('app.tenant_id'); verify cross-tenant SELECT returns zero rows.
3. Add WITH CHECK to the policy; try INSERTing a row with the wrong tenant_id — observe the WITH CHECK violation.
4. Create a pgcrypto-encrypted column; insert with pgp_sym_encrypt; SELECT with pgp_sym_decrypt; verify the column is unreadable without the key.
5. Enable pgaudit and run a few INSERT/UPDATE/DELETE statements; find the audit entries in the Postgres log.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does FORCE ROW LEVEL SECURITY do?
9. A) Enables RLS
10. B) Adds a CHECK constraint
11. C) Makes RLS apply to the table owner too (owners normally bypass RLS) (*)
12. D) Locks the table
13. Explanation: Without FORCE, the table owner bypasses RLS — defeating the purpose for SECURITY DEFINER functions or shared tables. FORCE makes RLS apply to everyone (except SUPERUSER and BYPASSRLS).
14. Q2: What's the difference between USING and WITH CHECK in an RLS policy?
15. A) They are identical
16. B) USING is for SELECT; WITH CHECK is for DELETE
17. C) WITH CHECK is optional and rare
18. D) USING filters reads; WITH CHECK constrains INSERT/UPDATE (*)
19. Explanation: USING filters rows visible to SELECT/UPDATE/DELETE; WITH CHECK constrains which rows can be INSERTed or UPDATEd. Without WITH CHECK, a user can INSERT a row they couldn't read.
20. Q3: Where should the pgcrypto encryption key come from?
21. A) A secret manager (Vault, AWS KMS) or environment variable (*)
22. B) Stored in a table
23. C) Hardcoded in the function
24. D) The postgres user's password
25. Explanation: If the key is in the DB and the DB is compromised, the attacker has both the data and the key. Use a secret manager or env var; load per session via SET app.pgp_key.
26. Q4: Which is the right way to grant SELECT on only some columns?
27. A) GRANT SELECT ON users TO analyst
28. B) GRANT SELECT (id, name) ON users TO analyst (*)
29. C) REVOKE salary FROM analyst
30. D) Create a view (alternative, but column-level GRANT is more direct)
31. Explanation: Column-level GRANTs let the role SELECT only the named columns; the role cannot access salary, ssn, etc. Use this for analyst roles that need a subset of columns.
32. Q5: Who bypasses RLS even with FORCE enabled?
33. A) The table owner
34. B) The postgres user always
35. C) SUPERUSER roles and roles with BYPASSRLS (*)
36. D) No one
37. Explanation: FORCE makes RLS apply to the owner, but SUPERUSERs and roles granted BYPASSRLS still bypass it. Never grant these to the application role.
38. Q6: What does pgaudit log?
39. A) Only errors
40. B) Slow queries
41. C) Connection counts
42. D) DML (write) and DDL statements for compliance (SOC 2, HIPAA, PCI) (*)
43. Explanation: pgaudit logs INSERT/UPDATE/DELETE and DDL statements with role, statement, and relation; configure `pgaudit.log = 'write, ddl'` and ship to your SIEM. log_min_duration_statement handles slow queries.
44. Q7: What's the standard pattern for per-tenant RLS?
45. A) A tenant_id column on every tenant-scoped table, with a policy using current_setting('app.tenant_id') (*)
46. B) One database per tenant
47. C) A separate schema per tenant
48. D) A WHERE clause in every query
49. Explanation: Add tenant_id to every tenant-scoped table, enable RLS, and write a policy that filters on current_setting('app.tenant_id'). The app sets this per-request via SET LOCAL.
50. Q8: Why is granting CREATE on the public schema dangerous?
51. A) It uses too much disk
52. B) A malicious user can create objects that shadow yours (search_path injection) (*)
53. C) It's slower
54. D) It disables RLS
55. Explanation: If a user can CREATE in public, they can create public.users that shadows app.users in a SECURITY DEFINER function with an unfixed search_path. PG15+ no longer grants CREATE on public to PUBLIC by default — verify.
56. Q9: What does `ALTER DEFAULT PRIVILEGES ... GRANT ... ON TABLES TO app_user` do?
57. A) Grants SELECT on all existing tables
58. B) Drops tables
59. C) Applies the GRANT to all future tables created by the current user (*)
60. D) Locks the schema
61. Explanation: ALTER DEFAULT PRIVILEGES sets grants that apply to future objects created by the specified user; pair with explicit GRANTs on existing tables. Essential for consistent privileges as the schema evolves.
62. Q10: Which is a sign that RLS is working correctly?
63. A) Cross-tenant SELECT returns zero rows
64. B) Cross-tenant INSERT raises a WITH CHECK violation
65. C) The owner can see all rows
66. D) Both A and B (*)
67. Explanation: USING filters reads (cross-tenant SELECT = 0 rows); WITH CHECK blocks writes (cross-tenant INSERT raises). Both must hold for correct isolation. The owner bypasses RLS without FORCE.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does FORCE ROW LEVEL SECURITY do?
  options:
    - Enables RLS
    - Adds a CHECK constraint
    - Makes RLS apply to the table owner too (owners normally bypass RLS)
    - Locks the table
    - .
  correctIndex: 2
  explanation: Without FORCE, the table owner bypasses RLS — defeating the purpose for SECURITY DEFINER functions or shared tables. FORCE makes RLS apply to everyone (except SUPERUSER and BYPASSRLS).
- id: q2
  question: What's the difference between USING and WITH CHECK in an RLS policy?
  options:
    - They are identical
    - USING is for SELECT; WITH CHECK is for DELETE
    - WITH CHECK is optional and rare
    - USING filters reads; WITH CHECK constrains INSERT/UPDATE
  correctIndex: 3
  explanation: USING filters rows visible to SELECT/UPDATE/DELETE; WITH CHECK constrains which rows can be INSERTed or UPDATEd. Without WITH CHECK, a user can INSERT a row they couldn't read.
- id: q3
  question: Where should the pgcrypto encryption key come from?
  options:
    - A secret manager (Vault, AWS KMS) or environment variable
    - Stored in a table
    - Hardcoded in the function
    - The postgres user's password
  correctIndex: 0
  explanation: If the key is in the DB and the DB is compromised, the attacker has both the data and the key. Use a secret manager or env var; load per session via SET app.pgp_key.
- id: q4
  question: Which is the right way to grant SELECT on only some columns?
  options:
    - GRANT SELECT ON users TO analyst
    - GRANT SELECT (id, name) ON users TO analyst
    - REVOKE salary FROM analyst
    - Create a view (alternative, but column-level GRANT is more direct)
  correctIndex: 1
  explanation: Column-level GRANTs let the role SELECT only the named columns; the role cannot access salary, ssn, etc. Use this for analyst roles that need a subset of columns.
- id: q5
  question: Who bypasses RLS even with FORCE enabled?
  options:
    - The table owner
    - The postgres user always
    - SUPERUSER roles and roles with BYPASSRLS
    - No one
  correctIndex: 2
  explanation: FORCE makes RLS apply to the owner, but SUPERUSERs and roles granted BYPASSRLS still bypass it. Never grant these to the application role.
- id: q6
  question: What does pgaudit log?
  options:
    - Only errors
    - Slow queries
    - Connection counts
    - DML (write) and DDL statements for compliance (SOC 2, HIPAA, PCI)
  correctIndex: 3
  explanation: pgaudit logs INSERT/UPDATE/DELETE and DDL statements with role, statement, and relation; configure `pgaudit.log = 'write, ddl'` and ship to your SIEM. log_min_duration_statement handles slow queries.
- id: q7
  question: What's the standard pattern for per-tenant RLS?
  options:
    - A tenant_id column on every tenant-scoped table, with a policy using current_setting('app.tenant_id')
    - One database per tenant
    - A separate schema per tenant
    - A WHERE clause in every query
  correctIndex: 0
  explanation: Add tenant_id to every tenant-scoped table, enable RLS, and write a policy that filters on current_setting('app.tenant_id'). The app sets this per-request via SET LOCAL.
- id: q8
  question: Why is granting CREATE on the public schema dangerous?
  options:
    - It uses too much disk
    - A malicious user can create objects that shadow yours (search_path injection)
    - It's slower
    - It disables RLS
  correctIndex: 1
  explanation: If a user can CREATE in public, they can create public.users that shadows app.users in a SECURITY DEFINER function with an unfixed search_path. PG15+ no longer grants CREATE on public to PUBLIC by default — verify.
- id: q9
  question: What does `ALTER DEFAULT PRIVILEGES ... GRANT ... ON TABLES TO app_user` do?
  options:
    - Grants SELECT on all existing tables
    - Drops tables
    - Applies the GRANT to all future tables created by the current user
    - Locks the schema
  correctIndex: 2
  explanation: ALTER DEFAULT PRIVILEGES sets grants that apply to future objects created by the specified user; pair with explicit GRANTs on existing tables. Essential for consistent privileges as the schema evolves.
- id: q10
  question: Which is a sign that RLS is working correctly?
  options:
    - Cross-tenant SELECT returns zero rows
    - Cross-tenant INSERT raises a WITH CHECK violation
    - The owner can see all rows
    - Both A and B
  correctIndex: 3
  explanation: USING filters reads (cross-tenant SELECT = 0 rows); WITH CHECK blocks writes (cross-tenant INSERT raises). Both must hold for correct isolation. The owner bypasses RLS without FORCE.
```

