---
slug: java-jdbc-database-access
id: java-15
track: java
order: 15
title: JDBC — Database Access
description: Connect to a database, execute queries with PreparedStatement, handle transactions, use connection pools (HikariCP), and understand SQL injection and ResultSet types.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=16800s
whyItMatters: Connect to a database, execute queries with PreparedStatement, handle transactions, use connection pools (HikariCP), and understand SQL injection and ResultSet types.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# JDBC — Database Access

## JDBC — Database Access

### Why It Matters

Connect to a database, execute queries with PreparedStatement, handle transactions, use connection pools (HikariCP), and understand SQL injection and ResultSet types.

Connect to a database, execute queries with PreparedStatement, handle transactions, use connection pools (HikariCP), and understand SQL injection and ResultSet types.

### Prerequisites

- Stage 14: java.time, Date/Time API, and Formatting.
- Familiarity with SQL basics (SELECT, INSERT, UPDATE, JOIN).

### Topics

- JDBC architecture: DriverManager, Connection, Statement, ResultSet
- PreparedStatement and parameter binding (vs String concatenation)
- SQL injection and why PreparedStatement prevents it
- Transactions, commit, rollback, and savepoints
- Connection pooling with HikariCP
- ResultSet types (TYPE_FORWARD_ONLY, TYPE_SCROLL_INSENSITIVE) and concurrency
- Batch updates and generated keys
- Try-with-resources for Connection/Statement/ResultSet

### Key Concepts

- Always use PreparedStatement with `?` placeholders — never concatenate SQL strings, even for "trusted" inputs.
- JDBC connections are expensive to create; use a connection pool (HikariCP is the de facto standard) to reuse them.
- Auto-commit is on by default; for multi-statement transactions, call `setAutoCommit(false)`, do the work, then `commit()` or `rollback()`.
- Closing a Connection closes its Statements and ResultSets, but explicit try-with-resources on each is best practice.
- Generated keys (auto-increment) are retrieved via `statement.getGeneratedKeys()` after executeUpdate.

```java
String sql = "SELECT id, name FROM users WHERE active = ? AND age > ?";
try (var conn = dataSource.getConnection();
     var ps = conn.prepareStatement(sql)) {
    ps.setBoolean(1, true);
    ps.setInt(2, 18);
    try (var rs = ps.executeQuery()) {
        while (rs.next()) {
            long id = rs.getLong("id");
            String name = rs.getString("name");
            System.out.println(id + " " + name);
        }
    }
}
```
Caption: Basic query with PreparedStatement

### Common Pitfalls

- Concatenating user input into SQL — text-book SQL injection; always use PreparedStatement with `?`.
- Forgetting to `setAutoCommit(false)` for multi-statement transactions — partial writes become committed, breaking atomicity.
- Leaking connections — each `getConnection()` borrows a pooled connection; if you forget to close, the pool exhausts. Always try-with-resources.
- Using Statement (not PreparedStatement) for repeated queries — PreparedStatement is precompiled and reused by the DB, improving performance.
- Catching SQLException and swallowing it — JDBC throws checked exceptions for a reason; log and rethrow or convert to a domain exception.

### Real-World Applications

- HikariCP is the default connection pool in Spring Boot and powers thousands of high-traffic services including those at Atlassian, Shopify, and Airbnb.
- Hibernate and JPA sit on top of JDBC, but the underlying connection and SQL execution flow through JDBC's Connection/PreparedStatement APIs.
- Apache Spark's JDBC connector reads partitions of relational tables in parallel via multiple JDBC connections.
- Square's Realtime service runs JDBC against PostgreSQL with HikariCP, batching micro-transactions at tens of thousands per second.

### Interview Questions

- 1. What is SQL injection and how does PreparedStatement prevent it? — Concatenating user input lets an attacker alter SQL semantics; PreparedStatement separates code from data, so input cannot change the parsed statement.
- 2. What is a connection pool and why is it needed? — Creating a TCP+auth database connection is expensive; a pool keeps connections open and reuses them, reducing per-request latency.
- 3. How do you commit a multi-statement transaction in JDBC? — Call setAutoCommit(false), execute statements, then commit() or rollback() in case of failure.
- 4. What is the difference between Statement and PreparedStatement? — Statement compiles each SQL on execution; PreparedStatement precompiles and binds parameters, allowing reuse and preventing injection.
- 5. How do you get an auto-generated key after an insert? — Pass Statement.RETURN_GENERATED_KEYS to prepareStatement, then call getGeneratedKeys() after executeUpdate.

### Mini Project

Build a JDBC Task Manager: A small CLI that adds, lists, and completes tasks in a Postgres or H2 database. Use HikariCP, PreparedStatement, and transactions. Suggested approach:
  - Add HikariCP and the H2 driver as Maven/Gradle dependencies
  - Initialize the schema in a `CREATE TABLE IF NOT EXISTS` script run on startup
  - Implement `addTask`, `listTasks`, `completeTask` with PreparedStatement and try-with-resources
  - Wrap multi-step operations (e.g., `addTaskWithTags`) in a transaction with rollback on failure
  - Add a `--verbose` flag that prints the SQL and parameters for debugging

### Exercises

1. Connect to an H2 in-memory database, create a table, and insert a row using Statement; verify by reading it back.
2. Refactor the insert to use PreparedStatement with `?` placeholders; attempt to inject SQL via the title field and confirm it's treated as data.
3. Implement a transfer-funds transaction with setAutoCommit(false), commit on success, and rollback on SQLException.
4. Configure HikariCP with maximumPoolSize=10 and measure throughput on 1000 inserts; then try pool size 1 and 100 and explain the curve.
5. Use `executeBatch()` to insert 1000 rows in one round-trip; compare wall time vs 1000 individual executeUpdate calls.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: PreparedStatement prevents SQL injection by?
9. A) Escaping quotes in user input
10. B) Encrypting the query
11. C) Separating the SQL text from parameter values; values cannot change the parsed statement (*)
12. D) Running the query in a sandbox
13. Explanation: PreparedStatement parses the SQL with `?` placeholders, then binds values as data; an attacker's input is treated as a literal value, never as SQL syntax.
14. Q2: Auto-commit is on by default; for a multi-statement transaction you should?
15. A) Set autocommit on
16. B) Use a single Statement for everything
17. C) Use Statement only, never PreparedStatement
18. D) Call setAutoCommit(false), then commit() or rollback() (*)
19. Explanation: With auto-commit, every statement is its own transaction. To group statements, disable auto-commit, execute them, then explicitly commit or rollback.
20. Q3: The de facto standard JDBC connection pool is?
21. A) HikariCP (*)
22. B) Apache DBCP
23. C) c3p0
24. D) Vibur
25. Explanation: HikariCP is the default pool in Spring Boot and the most widely used in modern Java services due to its performance and small footprint.
26. Q4: Forgetting to close a Connection from a pool causes?
27. A) Nothing — pools handle it
28. B) The pool to exhaust, eventually blocking new requests (*)
29. C) A SQLException on every query
30. D) The JVM to crash
31. Explanation: Each getConnection borrows a pooled connection; not returning it shrinks the available pool until exhaustion, after which new getConnection calls block (up to connectionTimeout).
32. Q5: To retrieve an auto-generated key after insert, use?
33. A) ResultSet.getAutoKey()
34. B) A second SELECT MAX(id)
35. C) Statement.RETURN_GENERATED_KEYS and getGeneratedKeys() (*)
36. D) JDBC doesn't support this
37. Explanation: prepareStatement(sql, Statement.RETURN_GENERATED_KEYS) prepares the statement to return keys; after executeUpdate, getGeneratedKeys() yields a ResultSet of generated keys.
38. Q6: Statement vs PreparedStatement — which is preferred for repeated queries?
39. A) Statement
40. B) Both are identical
41. C) CallableStatement
42. D) PreparedStatement (*)
43. Explanation: PreparedStatement is precompiled once and can be reused with different parameter bindings, improving performance and security.
44. Q7: JDBC connections are expensive to create because?
45. A) They require a TCP handshake, DB authentication, and session setup (*)
46. B) They allocate large memory
47. C) The JVM refuses to pool them
48. D) The driver is bytecode-heavy
49. Explanation: A new connection involves a TCP handshake, RDBMS authentication, session/transaction init, and often metadata queries — pooling amortizes this cost.
50. Q8: Batch updates (addBatch/executeBatch) are useful to?
51. A) Run multiple queries in parallel threads
52. B) Send N statements in one network round-trip (*)
53. C) Avoid using Connection
54. D) Bypass the connection pool
55. Explanation: Batch sends multiple INSERT/UPDATE statements as one protocol message, reducing per-row network round-trips and improving throughput by 10-100x.
56. Q9: SQLException is?
57. A) Unchecked
58. B) An Error
59. C) Checked — callers must handle or declare it (*)
60. D) RuntimeException
61. Explanation: SQLException is a checked exception; JDBC forces callers to handle or declare it, reflecting that database errors are recoverable conditions.
62. Q10: TYPE_FORWARD_ONLY ResultSet means?
63. A) You can iterate both directions
64. B) The ResultSet is read-only
65. C) The ResultSet is scrollable
66. D) You can iterate only forward (next()) — the default and most efficient (*)
67. Explanation: TYPE_FORWARD_ONLY (the default) lets the cursor move only forward; TYPE_SCROLL_INSENSITIVE/SENSITIVE allow backward and absolute positioning at higher cost.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: PreparedStatement prevents SQL injection by?
  options:
    - Escaping quotes in user input
    - Encrypting the query
    - Separating the SQL text from parameter values; values cannot change the parsed statement
    - Running the query in a sandbox
  correctIndex: 2
  explanation: PreparedStatement parses the SQL with `?` placeholders, then binds values as data; an attacker's input is treated as a literal value, never as SQL syntax.
- id: q2
  question: Auto-commit is on by default; for a multi-statement transaction you should?
  options:
    - Set autocommit on
    - Use a single Statement for everything
    - Use Statement only, never PreparedStatement
    - Call setAutoCommit(false), then commit() or rollback()
  correctIndex: 3
  explanation: With auto-commit, every statement is its own transaction. To group statements, disable auto-commit, execute them, then explicitly commit or rollback.
- id: q3
  question: The de facto standard JDBC connection pool is?
  options:
    - HikariCP
    - Apache DBCP
    - c3p0
    - Vibur
  correctIndex: 0
  explanation: HikariCP is the default pool in Spring Boot and the most widely used in modern Java services due to its performance and small footprint.
- id: q4
  question: Forgetting to close a Connection from a pool causes?
  options:
    - Nothing — pools handle it
    - The pool to exhaust, eventually blocking new requests
    - A SQLException on every query
    - The JVM to crash
  correctIndex: 1
  explanation: Each getConnection borrows a pooled connection; not returning it shrinks the available pool until exhaustion, after which new getConnection calls block (up to connectionTimeout).
- id: q5
  question: To retrieve an auto-generated key after insert, use?
  options:
    - ResultSet.getAutoKey()
    - A second SELECT MAX(id)
    - Statement.RETURN_GENERATED_KEYS and getGeneratedKeys()
    - JDBC doesn't support this
    - prepares the statement to return keys; after executeUpdate, getGeneratedKeys() yields a ResultSet of generated keys.
  correctIndex: 2
  explanation: prepareStatement(sql, Statement.RETURN_GENERATED_KEYS) prepares the statement to return keys; after executeUpdate, getGeneratedKeys() yields a ResultSet of generated keys.
- id: q6
  question: Statement vs PreparedStatement — which is preferred for repeated queries?
  options:
    - Statement
    - Both are identical
    - CallableStatement
    - PreparedStatement
  correctIndex: 3
  explanation: PreparedStatement is precompiled once and can be reused with different parameter bindings, improving performance and security.
- id: q7
  question: JDBC connections are expensive to create because?
  options:
    - They require a TCP handshake, DB authentication, and session setup
    - They allocate large memory
    - The JVM refuses to pool them
    - The driver is bytecode-heavy
  correctIndex: 0
  explanation: A new connection involves a TCP handshake, RDBMS authentication, session/transaction init, and often metadata queries — pooling amortizes this cost.
- id: q8
  question: Batch updates (addBatch/executeBatch) are useful to?
  options:
    - Run multiple queries in parallel threads
    - Send N statements in one network round-trip
    - Avoid using Connection
    - Bypass the connection pool
  correctIndex: 1
  explanation: Batch sends multiple INSERT/UPDATE statements as one protocol message, reducing per-row network round-trips and improving throughput by 10-100x.
- id: q9
  question: SQLException is?
  options:
    - Unchecked
    - An Error
    - Checked — callers must handle or declare it
    - RuntimeException
  correctIndex: 2
  explanation: SQLException is a checked exception; JDBC forces callers to handle or declare it, reflecting that database errors are recoverable conditions.
- id: q10
  question: TYPE_FORWARD_ONLY ResultSet means?
  options:
    - You can iterate both directions
    - The ResultSet is read-only
    - The ResultSet is scrollable
    - You can iterate only forward (next()) — the default and most efficient
  correctIndex: 3
  explanation: TYPE_FORWARD_ONLY (the default) lets the cursor move only forward; TYPE_SCROLL_INSENSITIVE/SENSITIVE allow backward and absolute positioning at higher cost.
```

