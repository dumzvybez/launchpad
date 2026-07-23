---
slug: mongodb-security-auth-roles-tls-field-level-encryption
id: mongodb-16
track: mongodb
order: 16
title: Security — Auth, Roles, TLS, Field-Level Encryption
description: Lock down MongoDB with SCRAM/x.509 auth, RBAC roles, TLS, and Client-Side Field-Level Encryption (CSFLE) / Queryable Encryption for sensitive fields.
difficulty: advanced
estMinutes: 300
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=c2M-rlkkT5o&t=900s
whyItMatters: Lock down MongoDB with SCRAM/x. 509 auth, RBAC roles, TLS, and Client-Side Field-Level Encryption (CSFLE) / Queryable Encryption for sensitive fields.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Security — Auth, Roles, TLS, Field-Level Encryption

## Security — Auth, Roles, TLS, Field-Level Encryption

### Why It Matters

Lock down MongoDB with SCRAM/x. 509 auth, RBAC roles, TLS, and Client-Side Field-Level Encryption (CSFLE) / Queryable Encryption for sensitive fields.

Lock down MongoDB with SCRAM/x.509 auth, RBAC roles, TLS, and Client-Side Field-Level Encryption (CSFLE) / Queryable Encryption for sensitive fields.

### Prerequisites

- Stage 12 (Replication) — auth must be configured BEFORE going to production.
- Comfort with TLS certificates and Node.js crypto basics.

### Topics

- Enabling auth: `--auth` and the localhost exception
- SCRAM-SHA-256 (default) and SCRAM-SHA-1 (deprecated)
- x.509 certificate authentication (mutual TLS)
- Built-in roles: `read`, `readWrite`, `dbAdmin`, `userAdmin`, `clusterAdmin`
- Custom roles with `grantRolesToUser` and `createRole`
- TLS/SSL configuration: `--tlsMode requireTLS`, CA file, certificate key
- Network: bind IP, firewalls, VPC peering, Atlas IP allowlist
- Client-Side Field-Level Encryption (CSFLE) with AWS KMS / local KMS
- Queryable Encryption (7.0+) for encrypted equality/range queries

### Key Concepts

- Authentication = WHO you are (SCRAM, x.509, LDAP, Kerberos); Authorization = WHAT you can do (RBAC roles).
- The localhost exception lets you create the first admin user on a freshly auth-enabled mongod without credentials — but only until the first user exists.
- Always require TLS in production (`tlsMode: requireTLS`); without it, credentials and data traverse the network in plaintext.
- CSFLE encrypts sensitive fields CLIENT-SIDE before sending to MongoDB — the server never sees plaintext, so even a DBA can't read SSNs.
- Queryable Encryption (7.0+) extends CSFLE to allow equality (and in 8.0+ range) queries on encrypted fields — the server processes queries without decrypting.

```javascript
// Without auth yet, connect locally and create the admin user (localhost exception)
use admin
db.createUser({
  user: "admin",
  pwd: passwordPrompt(),         // prompts securely
  roles: [ { role: "userAdminAnyDatabase", db: "admin" },
           { role: "readWriteAnyDatabase", db: "admin" } ]
})

// Then restart mongod with --auth (or security.authorization: true in config)
```
Caption: Enable auth and create the admin user

### Common Pitfalls

- Going to production with auth disabled — there's a long history of exposed MongoDB instances scraped from the internet; ALWAYS enable `security.authorization: enabled` before going live.
- Granting `root` or `dbOwner` to every application user — use least-privilege custom roles (`readWrite` on one collection) so a compromised app can't drop the database.
- Running MongoDB without TLS — credentials and data cross the network in plaintext; require TLS (`tlsMode: requireTLS`) and pin a CA in production.
- Storing the CSFLE master key on the same host as MongoDB — defeats the purpose; use AWS KMS / Azure Key Vault / GCP KMS so a database breach doesn't expose the keys.
- Using SCRAM-SHA-1 (deprecated) — set `authenticationMechanisms: SCRAM-SHA-256` and rotate legacy users; SCRAM-SHA-1 is vulnerable and removed in default builds.

### Real-World Applications

- Stripe uses CSFLE on PII fields so even database administrators can't read customer SSNs/tax IDs.
- Coinbase uses x.509 mutual TLS for all internal MongoDB connections in zero-trust networks.
- Adobe uses custom roles per microservice so a compromised service can only touch its own database.
- Cisco uses Queryable Encryption (7.0+) for encrypted device-serial lookups across geographies.

### Interview Questions

- 1. What's the difference between authentication and authorization? — Auth = who you are (SCRAM/x.509); authz = what you can do (RBAC roles).
- 2. What's the localhost exception? — Lets you create the first admin user on a freshly auth-enabled mongod without credentials; expires once the first user exists.
- 3. What does CSFLE protect against? — A DBA or attacker with database access can't read encrypted fields — encryption/decryption happens client-side with a key the server never sees.
- 4. Why require TLS in production? — Without it, credentials (SCRAM) and all data cross the network in plaintext, vulnerable to sniffing and MITM.
- 5. What's Queryable Encryption? — Extension to CSFLE (7.0+) that lets the server process equality (and range in 8.0+) queries on encrypted fields without decryption.

### Mini Project

Add CSFLE to a Patients Service: Encrypt the `ssn` and `diagnosis` fields on the `patients` collection using CSFLE with a local KMS key (dev) and a deterministic algorithm for `ssn` (so equality queries work) and randomized for `diagnosis`. Suggested approach:
  - Generate a 96-byte master key, store in `master-key.txt` (dev only)
  - Create a data-encryption key in the `encryption.__keyVault` collection
  - Define a `schemaMap` for `medical.patients` encrypting `ssn` (deterministic) and `diagnosis` (randomized)
  - Connect the Node driver with `autoEncryption` enabled
  - Insert a patient, then connect WITHOUT autoEncryption and confirm the fields are ciphertext in the database

### Exercises

1. Enable `--auth` on a local mongod, create an admin user via the localhost exception, then connect as that user.
2. Create a least-privilege custom role `ordersRO` with only `find` on `shop.orders`; verify it can't insert.
3. Configure `requireTLS` on mongod and connect with `mongosh --tls --tlsCertificateKeyFile=...`.
4. Set up CSFLE with a local KMS key and confirm an encrypted field is stored as ciphertext when read without the autoEncryption option.
5. >>> QUIZ (Stage 16) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: What's the difference between authentication and authorization in MongoDB?
8. A) They're the same thing
9. B) Authentication is for reads; authorization for writes
10. C) Authentication is for clients; authorization for servers
11. D) Authentication is who you are (SCRAM/x.509); authorization is what you can do (RBAC roles) (*)
12. Explanation: Authentication establishes identity (SCRAM, x.509, LDAP, Kerberos); authorization (RBAC roles like `readWrite`, `dbAdmin`) determines what an authenticated user can do.
13. Q2: What does the localhost exception allow?
14. A) Creating the first admin user on a freshly auth-enabled mongod without credentials (*)
15. B) Connecting without TLS
16. C) Reading any collection locally
17. D) Skipping authorization in development
18. Explanation: On a fresh mongod with `--auth`, the localhost exception lets you create the first user from localhost without authenticating — until that first user exists.
19. Q3: Which SCRAM mechanism is recommended?
20. A) SCRAM-SHA-1
21. B) SCRAM-SHA-256 (*)
22. C) MONGODB-CR
23. D) PLAIN
24. Explanation: SCRAM-SHA-256 is the default and recommended; SCRAM-SHA-1 is deprecated and removed from default builds in recent MongoDB versions.
25. Q4: What does Client-Side Field-Level Encryption (CSFLE) protect against?
26. A) Network sniffing only
27. B) SQL injection
28. C) A DBA or attacker with database access reading sensitive fields — encryption is client-side (*)
29. D) Replica set failover
30. Explanation: CSFLE encrypts fields client-side before sending to MongoDB; the server stores only ciphertext, so even a DBA with full DB access can't read SSNs/PINs.
31. Q5: Where should the CSFLE master key live in production?
32. A) On the MongoDB host
33. B) In a config file on the app server
34. C) In the database itself
35. D) In a cloud KMS (AWS KMS, Azure Key Vault, GCP KMS) — not on the DB host (*)
36. Explanation: Storing the master key alongside the database defeats CSFLE's purpose; use a cloud KMS so a database breach doesn't expose the keys.
37. Q6: Which TLS mode is recommended for production?
38. A) requireTLS (*)
39. B) disabled
40. C) allowTLS
41. D) preferTLS
42. Explanation: `requireTLS` mandates TLS for all connections; lower modes (allowTLS, preferTLS) permit plaintext connections, leaving credentials vulnerable.
43. Q7: What's the principle behind least-privilege roles?
44. A) Give everyone `root` for simplicity
45. B) Grant each app/user only the permissions it needs (e.g., `find` on one collection) so a compromise can't drop the DB (*)
46. C) Revoke all roles in production
47. D) Use the same role for all services
48. Explanation: Least-privilege limits blast radius — a compromised analytics service with `find` on `orders` can't drop the collection or write to it.
49. Q8: What does Queryable Encryption (7.0+) add over CSFLE?
50. A) Encryption at rest
51. B) TLS for all connections
52. C) Equality (and range in 8.0+) queries on encrypted fields WITHOUT server-side decryption (*)
53. D) Schema validation
54. Explanation: CSFLE makes encrypted fields unsearchable; Queryable Encryption lets the server process equality/range queries on ciphertext, returning encrypted results the client decrypts.
55. Q9: Why is SCRAM-SHA-1 discouraged?
56. A) It's slower
57. B) It requires enterprise license
58. C) It doesn't work with TLS
59. D) It's deprecated and vulnerable compared to SCRAM-SHA-256; removed from default builds (*)
60. Explanation: SCRAM-SHA-1 uses weaker hashing; modern MongoDB defaults to SCRAM-SHA-256 and removes SCRAM-SHA-1 from default builds.
61. Q10: Which is a critical production security step often forgotten?
62. A) Enabling `--auth` BEFORE exposing the port to the internet (*)
63. B) Using port 27017 (default)
64. C) Allowing 0.0.0.0/0 in the IP allowlist
65. D) Disabling the journal
66. Explanation: There's a long history of internet-exposed MongoDB instances scraped because auth was disabled; enable auth and restrict the IP allowlist BEFORE exposing the port.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the difference between authentication and authorization in MongoDB?
  options:
    - They're the same thing
    - Authentication is for reads; authorization for writes
    - Authentication is for clients; authorization for servers
    - Authentication is who you are (SCRAM/x.509); authorization is what you can do (RBAC roles)
  correctIndex: 3
  explanation: Authentication establishes identity (SCRAM, x.509, LDAP, Kerberos); authorization (RBAC roles like `readWrite`, `dbAdmin`) determines what an authenticated user can do.
- id: q2
  question: What does the localhost exception allow?
  options:
    - Creating the first admin user on a freshly auth-enabled mongod without credentials
    - Connecting without TLS
    - Reading any collection locally
    - Skipping authorization in development
  correctIndex: 0
  explanation: On a fresh mongod with `--auth`, the localhost exception lets you create the first user from localhost without authenticating — until that first user exists.
- id: q3
  question: Which SCRAM mechanism is recommended?
  options:
    - SCRAM-SHA-1
    - SCRAM-SHA-256
    - MONGODB-CR
    - PLAIN
  correctIndex: 1
  explanation: SCRAM-SHA-256 is the default and recommended; SCRAM-SHA-1 is deprecated and removed from default builds in recent MongoDB versions.
- id: q4
  question: What does Client-Side Field-Level Encryption (CSFLE) protect against?
  options:
    - protect against?
    - Network sniffing only
    - SQL injection
    - A DBA or attacker with database access reading sensitive fields — encryption is client-side
    - Replica set failover
  correctIndex: 3
  explanation: CSFLE encrypts fields client-side before sending to MongoDB; the server stores only ciphertext, so even a DBA with full DB access can't read SSNs/PINs.
- id: q5
  question: Where should the CSFLE master key live in production?
  options:
    - On the MongoDB host
    - In a config file on the app server
    - In the database itself
    - In a cloud KMS (AWS KMS, Azure Key Vault, GCP KMS) — not on the DB host
  correctIndex: 3
  explanation: Storing the master key alongside the database defeats CSFLE's purpose; use a cloud KMS so a database breach doesn't expose the keys.
- id: q6
  question: Which TLS mode is recommended for production?
  options:
    - requireTLS
    - disabled
    - allowTLS
    - preferTLS
    - permit plaintext connections, leaving credentials vulnerable.
  correctIndex: 0
  explanation: "`requireTLS` mandates TLS for all connections; lower modes (allowTLS, preferTLS) permit plaintext connections, leaving credentials vulnerable."
- id: q7
  question: What's the principle behind least-privilege roles?
  options:
    - Give everyone `root` for simplicity
    - Grant each app/user only the permissions it needs (e.g., `find` on one collection) so a compromise can't drop the DB
    - Revoke all roles in production
    - Use the same role for all services
  correctIndex: 1
  explanation: Least-privilege limits blast radius — a compromised analytics service with `find` on `orders` can't drop the collection or write to it.
- id: q8
  question: What does Queryable Encryption (7.0+) add over CSFLE?
  options:
    - Encryption at rest
    - TLS for all connections
    - Equality (and range in 8.0+) queries on encrypted fields WITHOUT server-side decryption
    - Schema validation
  correctIndex: 2
  explanation: CSFLE makes encrypted fields unsearchable; Queryable Encryption lets the server process equality/range queries on ciphertext, returning encrypted results the client decrypts.
- id: q9
  question: Why is SCRAM-SHA-1 discouraged?
  options:
    - It's slower
    - It requires enterprise license
    - It doesn't work with TLS
    - It's deprecated and vulnerable compared to SCRAM-SHA-256; removed from default builds
  correctIndex: 3
  explanation: SCRAM-SHA-1 uses weaker hashing; modern MongoDB defaults to SCRAM-SHA-256 and removes SCRAM-SHA-1 from default builds.
- id: q10
  question: Which is a critical production security step often forgotten?
  options:
    - Enabling `--auth` BEFORE exposing the port to the internet
    - Using port 27017 (default)
    - Allowing 0.0.0.0/0 in the IP allowlist
    - Disabling the journal
  correctIndex: 0
  explanation: There's a long history of internet-exposed MongoDB instances scraped because auth was disabled; enable auth and restrict the IP allowlist BEFORE exposing the port.
```

