---
slug: sql-security-roles-grants-rls-auditing
id: sql-18
track: sql
order: 18
title: Security — Roles, Grants, RLS, Auditing
description: Lock down access with roles and grants, enforce per-row visibility with Row-Level Security (RLS), encrypt sensitive columns with pgcrypto, and audit activity with pgaudit.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=11800s
whyItMatters: Lock down access with roles and grants, enforce per-row visibility with Row-Level Security (RLS), encrypt sensitive columns with pgcrypto, and audit activity with pgaudit.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Security — Roles, Grants, RLS, Auditing

## Security — Roles, Grants, RLS, Auditing

### Why It Matters

Lock down access with roles and grants, enforce per-row visibility with Row-Level Security (RLS), encrypt sensitive columns with pgcrypto, and audit activity with pgaudit.

Lock down access with roles and grants, enforce per-row visibility with Row-Level Security (RLS), encrypt sensitive columns with pgcrypto, and audit activity with pgaudit.

### Prerequisites

- Stage 17: Replication, Backups, and High Availability.
- Familiarity with CREATE ROLE and GRANT basics.

### Topics

- CREATE ROLE, LOGIN vs NOLOGIN, group roles
- GRANT / REVOKE on schemas, tables, sequences, functions
- Default privileges and ALTER DEFAULT PRIVILEGES
- Row-Level Security (RLS): CREATE POLICY, USING, WITH CHECK
- RLS with multi-tenant apps: session variables and current_setting
- pgcrypto: pgp_sym_encrypt, pgp_sym_decrypt, gen_random_uuid
- pgaudit extension for activity logging
- Principle of least privilege; the dangers of SUPERUSER

### Key Concepts

- A role can be a login (has password, can connect) or a group (NOLOGIN; users inherit its privileges).
- GRANT controls object-level access (SELECT/INSERT/UPDATE/DELETE on tables, USAGE on schemas).
- RLS adds a per-row filter using CREATE POLICY ... USING (...); the table owner bypasses RLS unless FORCE ROW LEVEL SECURITY is set.
- For multi-tenant apps, set a session variable (set_config('app.tenant_id', ...)) and reference it in policies via current_setting('app.tenant_id').
- pgcrypto provides pgp_sym_encrypt/decrypt for column-level encryption; the key is application-supplied, never stored in the DB.
- pgaudit logs DML, DDL, and SELECT activity to the standard Postgres log for compliance.
- NEVER grant SUPERUSER to an application role; use a least-privilege role and reserve SUPERUSER for DBAs.

```sql
-- Group role (no login) for read-only access
CREATE ROLE reporting_ro NOLOGIN;
GRANT USAGE ON SCHEMA public TO reporting_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO reporting_ro;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO reporting_ro;

-- Login role that inherits from the group
CREATE ROLE alice LOGIN PASSWORD '...' IN ROLE reporting_ro;
```
Caption: Roles and grants

### Common Pitfalls

- SUPERUSER for the app — catastrophic for blast radius; use a least-privilege role, reserve SUPERUSER for DBAs.
- Forgetting FORCE ROW LEVEL SECURITY — by default, the table owner bypasses RLS; FORCE applies it to the owner too.
- RLS without a session variable — policies referencing current_setting fail or return wrong results if the app forgets to SET it.
- Storing the pgcrypto key in the DB — defeats the purpose; the key must come from the app (env var, KMS).
- Over-granting on the public schema — by default, all roles can CREATE in public; revoke and use ALTER DEFAULT PRIVILEGES.

### Real-World Applications

- Stripe uses RLS to isolate merchant data in shared tables; the app sets app.merchant_id per request.
- Airbnb uses RLS and group roles to scope host vs guest visibility on bookings.
- LinkedIn uses least-privilege roles and pgaudit for compliance with GDPR and CCPA access logging.
- Uber uses pgcrypto for payment-token encryption at rest, with keys held in a KMS.

### Interview Questions

- 1. Difference between a LOGIN role and a group role? — LOGIN can connect; group (NOLOGIN) is for privilege inheritance via IN ROLE.
- 2. What does FORCE ROW LEVEL SECURITY do? — Applies RLS policies to the table owner, who otherwise bypasses them.
- 3. How do you implement per-tenant isolation in a shared schema? — RLS with a session variable (set_config('app.tenant_id', ...)) referenced via current_setting in USING/WITH CHECK.
- 4. Why is SUPERUSER for the app a bad idea? — Blast radius; a single SQL injection can drop tables, read any data, or grant privileges to attackers.
- 5. How do you store encrypted columns in Postgres? — pgcrypto's pgp_sym_encrypt/decrypt, with the key supplied by the app (env var/KMS), stored in a bytea column.

### Mini Project

Build a Multi-Tenant Notes Service Schema: A `notes` table with RLS isolating notes by tenant_id (set via app.tenant_id session variable), an encrypted_body column using pgcrypto, a least-privilege `notes_app` role, and a pgaudit log config. Suggested approach:
  - CREATE TABLE notes (id, tenant_id, owner_id, encrypted_body, created_at)
  - ENABLE + FORCE ROW LEVEL SECURITY
  - CREATE POLICY tenant_isolation USING (tenant_id = current_setting('app.tenant_id')::int)
  - Create notes_app LOGIN role with SELECT/INSERT/UPDATE/DELETE on notes only
  - Configure pgaudit.log = 'write, ddl'
  - Document the per-request SET app.tenant_id flow

### Exercises

1. Create a group role `analytics_ro` and grant SELECT on all tables; create a login role that inherits it.
2. Enable RLS on a `notes` table; create a policy filtering by user_id = current_user.
3. Test FORCE ROW LEVEL SECURITY: as the table owner, verify rows are filtered.
4. Use pgp_sym_encrypt to store a secret; verify pgp_sym_decrypt recovers it.
5. Configure pgaudit.log = 'write'; insert a row; verify the statement appears in the log.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why is it dangerous to grant SUPERUSER to an application role?
9. A) It's slower
10. B) Blast radius: a SQL injection can read/drop anything or escalate privileges (*)
11. C) SUPERUSER can't use indexes
12. D) It's not supported
13. Explanation: SUPERUSER bypasses all checks; a single injection becomes catastrophic. Use least-privilege roles; reserve SUPERUSER for DBAs.
14. Q2: What does FORCE ROW LEVEL SECURITY do?
15. A) Enables RLS
16. B) Forces policies to use indexes
17. C) Applies RLS policies to the table owner, who otherwise bypasses them (*)
18. D) Locks the table
19. Explanation: By default the table owner bypasses RLS; FORCE makes policies apply to the owner too — critical for shared multi-tenant tables.
20. Q3: How does RLS get the tenant_id in a multi-tenant app?
21. A) From the IP address
22. B) From the connection string only
23. C) From the WAL
24. D) From a session variable set per request (e.g. current_setting('app.tenant_id')) (*)
25. Explanation: The app calls SET app.tenant_id = '42' per request; policies reference current_setting('app.tenant_id') in USING/WITH CHECK.
26. Q4: Where should the pgcrypto encryption key be stored?
27. A) In the application (env var, KMS, secrets manager) — never in the DB (*)
28. B) In the same table as the ciphertext
29. C) In a Postgres config file
30. D) Hardcoded in the function
31. Explanation: Storing the key with the ciphertext defeats encryption; supply the key from the app via current_setting('app.pgp_key') set per session.
32. Q5: What does pgaudit provide?
33. A) Encryption
34. B) Compliance-grade logging of DML/DDL/SELECT to the Postgres log (*)
35. C) RLS
36. D) Connection pooling
37. Explanation: pgaudit logs statements with role and object info to the Postgres log; required for many compliance regimes (SOC 2, HIPAA, PCI).
38. Q6: A group role is best used for?
39. A) Logging in
40. B) Storing passwords
41. C) Privilege inheritance (NOLOGIN role that logins INHERIT from) (*)
42. D) Encryption
43. Explanation: Create group roles (NOLOGIN) representing access tiers; grant privileges to the group; assign login users to the group via IN ROLE.
44. Q7: What does `GRANT SELECT ON ALL TABLES IN SCHEMA public` miss?
45. A) Tables created after the GRANT
46. B) Tables in other schemas
47. C) Future tables unless ALTER DEFAULT PRIVILEGES is also set
48. D) All of the above (*)
49. Explanation: Existing-only grant; ALTER DEFAULT PRIVILEGES covers future tables, and other schemas need their own grants.
50. Q8: What does `WITH CHECK` in a policy enforce?
51. A) That the row matches the policy on INSERT/UPDATE (not just on read) (*)
52. B) That the user has CHECK constraints
53. C) That the table is healthy
54. D) That the policy is enabled
55. Explanation: USING filters reads; WITH CHECK ensures new/updated rows still match the policy, preventing a tenant from inserting another tenant's rows.
56. Q9: ALTER DEFAULT PRIVILEGES is used to?
57. A) Set default column values
58. B) Grant privileges on tables CREATED AFTER the statement by a specific role (*)
59. C) Enable RLS
60. D) Configure pgaudit
61. Explanation: ALTER DEFAULT PRIVILEGES ... GRANT SELECT ON TABLES TO role grants on future tables created by the specified role, closing the "new tables lack grants" gap.
62. Q10: pgp_sym_encrypt returns what type?
63. A) text
64. B) jsonb
65. C) bytea (binary encrypted blob) (*)
66. D) uuid
67. Explanation: pgp_sym_encrypt returns a bytea containing the PGP-encrypted message; store in a bytea column, decrypt with pgp_sym_decrypt.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why is it dangerous to grant SUPERUSER to an application role?
  options:
    - It's slower
    - "Blast radius: a SQL injection can read/drop anything or escalate privileges"
    - SUPERUSER can't use indexes
    - It's not supported
  correctIndex: 1
  explanation: SUPERUSER bypasses all checks; a single injection becomes catastrophic. Use least-privilege roles; reserve SUPERUSER for DBAs.
- id: q2
  question: What does FORCE ROW LEVEL SECURITY do?
  options:
    - Enables RLS
    - Forces policies to use indexes
    - Applies RLS policies to the table owner, who otherwise bypasses them
    - Locks the table
  correctIndex: 2
  explanation: By default the table owner bypasses RLS; FORCE makes policies apply to the owner too — critical for shared multi-tenant tables.
- id: q3
  question: How does RLS get the tenant_id in a multi-tenant app?
  options:
    - From the IP address
    - From the connection string only
    - From the WAL
    - From a session variable set per request (e.g. current_setting('app.tenant_id'))
  correctIndex: 3
  explanation: The app calls SET app.tenant_id = '42' per request; policies reference current_setting('app.tenant_id') in USING/WITH CHECK.
- id: q4
  question: Where should the pgcrypto encryption key be stored?
  options:
    - In the application (env var, KMS, secrets manager) — never in the DB
    - In the same table as the ciphertext
    - In a Postgres config file
    - Hardcoded in the function
  correctIndex: 0
  explanation: Storing the key with the ciphertext defeats encryption; supply the key from the app via current_setting('app.pgp_key') set per session.
- id: q5
  question: What does pgaudit provide?
  options:
    - Encryption
    - Compliance-grade logging of DML/DDL/SELECT to the Postgres log
    - RLS
    - Connection pooling
    - .
  correctIndex: 1
  explanation: pgaudit logs statements with role and object info to the Postgres log; required for many compliance regimes (SOC 2, HIPAA, PCI).
- id: q6
  question: A group role is best used for?
  options:
    - Logging in
    - Storing passwords
    - Privilege inheritance (NOLOGIN role that logins INHERIT from)
    - Encryption
    - representing access tiers; grant privileges to the group; assign login users to the group via IN ROLE.
  correctIndex: 2
  explanation: Create group roles (NOLOGIN) representing access tiers; grant privileges to the group; assign login users to the group via IN ROLE.
- id: q7
  question: What does `GRANT SELECT ON ALL TABLES IN SCHEMA public` miss?
  options:
    - Tables created after the GRANT
    - Tables in other schemas
    - Future tables unless ALTER DEFAULT PRIVILEGES is also set
    - All of the above
  correctIndex: 3
  explanation: Existing-only grant; ALTER DEFAULT PRIVILEGES covers future tables, and other schemas need their own grants.
- id: q8
  question: What does `WITH CHECK` in a policy enforce?
  options:
    - That the row matches the policy on INSERT/UPDATE (not just on read)
    - That the user has CHECK constraints
    - That the table is healthy
    - That the policy is enabled
  correctIndex: 0
  explanation: USING filters reads; WITH CHECK ensures new/updated rows still match the policy, preventing a tenant from inserting another tenant's rows.
- id: q9
  question: ALTER DEFAULT PRIVILEGES is used to?
  options:
    - Set default column values
    - Grant privileges on tables CREATED AFTER the statement by a specific role
    - Enable RLS
    - Configure pgaudit
  correctIndex: 1
  explanation: ALTER DEFAULT PRIVILEGES ... GRANT SELECT ON TABLES TO role grants on future tables created by the specified role, closing the "new tables lack grants" gap.
- id: q10
  question: pgp_sym_encrypt returns what type?
  options:
    - text
    - jsonb
    - bytea (binary encrypted blob)
    - uuid
  correctIndex: 2
  explanation: pgp_sym_encrypt returns a bytea containing the PGP-encrypted message; store in a bytea column, decrypt with pgp_sym_decrypt.
```

