---
slug: sql-data-warehousing-olap-capstone-prep
id: sql-20
track: sql
order: 20
title: Data Warehousing, OLAP, and Capstone Prep
description: Design star and snowflake schemas for analytics, learn slowly-changing dimensions, and survey columnar extensions (Citus, Redshift, ClickHouse) and the dbt workflow — setting you up for the capstone project.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=HXV3zeQKqGY&t=13200s
whyItMatters: Design star and snowflake schemas for analytics, learn slowly-changing dimensions, and survey columnar extensions (Citus, Redshift, ClickHouse) and the dbt workflow — setting you up for the capstone project.
deepDiveResources:
  - label: W3Schools SQL
    url: https://www.w3schools.com/sql/
    kind: course
  - label: SQL Official Docs
    url: https://dev.mysql.com/doc/
    kind: doc
---

# Data Warehousing, OLAP, and Capstone Prep

## Data Warehousing, OLAP, and Capstone Prep

### Why It Matters

Design star and snowflake schemas for analytics, learn slowly-changing dimensions, and survey columnar extensions (Citus, Redshift, ClickHouse) and the dbt workflow — setting you up for the capstone project.

Design star and snowflake schemas for analytics, learn slowly-changing dimensions, and survey columnar extensions (Citus, Redshift, ClickHouse) and the dbt workflow — setting you up for the capstone project.

### Prerequisites

- Stage 19: SQL in Application Code — ORMs, Migrations, Connection Pooling.
- All prior stages (this is the integrative capstone-prep stage).

### Topics

- OLTP vs OLAP — workload differences
- Star schema: fact tables and dimension tables
- Snowflake schema — normalized dimensions
- Surrogate vs natural keys in the warehouse
- Slowly Changing Dimensions (SCD Type 1, 2, 3)
- Columnar extensions: Citus, TimescaleDB, Redshift, ClickHouse, DuckDB
- ETL vs ELT; dbt for transformations-as-code
- Materialized views, rollups, and pre-aggregation strategies

### Key Concepts

- OLTP: many short transactions, normalized, current-state. OLAP: few huge queries, denormalized, historical.
- A star schema has a central fact table (events, metrics) surrounded by dimension tables (entities); denormalized for fast joins.
- Surrogate keys (warehouse-assigned bigint) decouple the warehouse from source-system natural keys, which can change.
- SCD Type 2 keeps history by adding a new row with effective_from/effective_to when a dimension attribute changes; the fact row's snapshot links to the right version.
- Columnar stores (ClickHouse, Redshift) compress and scan columns; great for aggregations over wide tables, bad for single-row updates.
- dbt turns SELECTs into materialized views/models with tests, docs, and lineage — the modern ELT workflow.

```sql
-- Dimension tables (denormalized)
CREATE TABLE dim_customer (
    customer_key   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id    bigint UNIQUE NOT NULL,  -- natural key from source
    name           text,
    segment        text,
    effective_from date NOT NULL,
    effective_to   date,
    is_current     boolean NOT NULL DEFAULT true
);

CREATE TABLE dim_date (
    date_key   int PRIMARY KEY,  -- YYYYMMDD
    full_date  date NOT NULL,
    year       int, month int, day int, quarter int, day_of_week int
);

-- Fact table (events/measures)
CREATE TABLE fact_payment (
    payment_key  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_key bigint NOT NULL REFERENCES dim_customer(customer_key),
    date_key     int    NOT NULL REFERENCES dim_date(date_key),
    amount       numeric(10,2) NOT NULL,
    payment_date timestamptz NOT NULL
);

CREATE INDEX ON fact_payment(date_key);
CREATE INDEX ON fact_payment(customer_key);
```
Caption: Star schema: fact + dimensions

### Common Pitfalls

- OLTP schema as warehouse — third-normal-form joins explode for analytics; denormalize into a star schema.
- Natural keys in the fact table — source-system IDs can change or be reused; always use surrogate keys in the warehouse.
- Forgetting SCD Type 2 — overwriting dimension rows loses historical context; facts can no longer be associated with the right version.
- Using row-store Postgres for petabyte analytics — columnar (Redshift, ClickHouse, Snowflake) is orders of magnitude faster for scans.
- No dbt tests — silent nulls or duplicate keys in dimension tables corrupt every downstream metric; add unique, not_null, and relationships tests.

### Real-World Applications

- Netflix uses Redshift for content-engagement analytics, with star schemas over petabytes of watch events.
- Airbnb's internal analytics warehouse uses dbt on top of Redshift/Snowflake with hundreds of tested models.
- LinkedIn uses a mix of Hive and Pinot for OLAP; star schemas over member-activity facts power dashboards.
- Stripe Sigma exposes a star schema directly to customers; merchants run SQL over their own charge facts.

### Interview Questions

- 1. Difference between OLTP and OLAP? — OLTP is many short transactions on normalized current-state data; OLAP is few large analytic queries on denormalized historical data.
- 2. What is a star schema? — A central fact table surrounded by denormalized dimension tables; optimized for fast analytical joins.
- 3. What is SCD Type 2? — Slowly Changing Dimension Type 2 keeps history by inserting a new row with effective dates when a dimension attribute changes.
- 4. Why use surrogate keys in the warehouse? — Source natural keys can change or be reused; surrogate keys are stable, warehouse-assigned, and decouple the warehouse from upstream churn.
- 5. What does dbt do? — Turns SELECTs into materialized models (tables/views/incremental) with tests, docs, and lineage — the ELT workflow.

### Mini Project

Build a Mini Data Warehouse: Take the dvdrental schema, build a star schema (dim_customer with SCD2, dim_date, fact_payment), load it with INSERT ... SELECT, write 3 OLAP queries (revenue by segment, top customers, monthly trend), and wrap the queries as dbt models with tests. Suggested approach:
  - Create dim_date with a generate_series for 2020-2030
  - Create dim_customer with SCD2 columns (effective_from, effective_to, is_current)
  - Load fact_payment with INSERT ... SELECT, mapping payment_date -> date_key via dim_date
  - Write daily_revenue, top_customers, and monthly_trend dbt models
  - Add dbt tests: unique on dim_customer.customer_key, not_null on fact_payment.amount

### Exercises

1. Build a star schema for `payment` with `dim_customer`, `dim_date`, and `fact_payment`.
2. Implement an SCD Type 2 update for a customer segment change; verify history is preserved.
3. Write an OLAP query: revenue by customer segment and month.
4. Wrap the query as a dbt incremental model keyed on day; test with two runs.
5. Add dbt tests (unique, not_null) on dim_customer.customer_key and fact_payment.amount.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which is OLTP, not OLAP?
9. A) Aggregating 5 years of revenue by month
10. B) A nightly cube refresh
11. C) A dashboard of top-100 customers
12. D) A web app processing a payment checkout (*)
13. Explanation: OLTP is many short transactions on current-state data (checkout); OLAP is few large analytic queries over historical data.
14. Q2: A star schema consists of?
15. A) A central fact table surrounded by denormalized dimension tables (*)
16. B) A single denormalized table
17. C) Many snowflake-normalized dimension tables
18. D) A graph of edges and nodes
19. Explanation: Star schema = one fact table at the center, dimensions radiating out, denormalized for fast joins; snowflake normalizes the dimensions.
20. Q3: SCD Type 2 preserves history by?
21. A) Overwriting in place
22. B) Inserting a new row with effective_from/effective_to and is_current flags (*)
23. C) Deleting the old row
24. D) Using a separate archive table only
25. Explanation: Type 2 keeps the old row (expired) and adds a new current row, so facts can be associated with the dimension version valid at the time.
26. Q4: Why use surrogate keys in the warehouse?
27. A) They're smaller than natural keys
28. B) They're required by dbt
29. C) Source natural keys can change or be reused; surrogates are stable and warehouse-assigned (*)
30. D) They're always UUIDs
31. Explanation: Surrogate keys decouple the warehouse from upstream churn; the fact references the surrogate, and SCD2 produces multiple surrogates per natural key.
32. Q5: Which is a columnar OLAP store?
33. A) Postgres row-store
34. B) MySQL InnoDB
35. C) SQLite
36. D) ClickHouse / Redshift / Snowflake (*)
37. Explanation: Columnar stores compress and scan columns efficiently — orders of magnitude faster for analytical scans, but poor for single-row updates.
38. Q6: dbt's primary purpose is?
39. A) Transformations-as-code: SELECTs materialized as tables/views/incremental with tests and lineage (*)
40. B) Connection pooling
41. C) Logical replication
42. D) Full-text search
43. Explanation: dbt (data build tool) turns SELECT statements into materialized warehouse models with tests, docs, and lineage — the ELT workflow.
44. Q7: In a star schema, the fact table holds?
45. A) Customer names and addresses
46. B) Measures (metrics) and foreign keys to dimensions (*)
47. C) Surrogate key definitions only
48. D) DDL scripts
49. Explanation: The fact table stores numeric measures (amount, count) and FKs to dimensions; descriptive attributes live in dimension tables.
50. Q8: Snowflake schema differs from star in that?
51. A) It uses snowflake IDs
52. B) It doesn't have a fact table
53. C) Dimensions are normalized into multiple tables (*)
54. D) It's for OLTP
55. Explanation: Snowflake normalizes dimensions (e.g. customer -> city -> country), saving space at the cost of more joins; star keeps dimensions denormalized.
56. Q9: Which dbt materialization rebuilds only new rows on each run?
57. A) view
58. B) table
59. C) ephemeral
60. D) incremental (*)
61. Explanation: incremental materialization uses a unique_key and an is_incremental() filter to insert only new/changed rows — fast for growing fact tables.
62. Q10: A required dbt test for dim_customer.customer_key is?
63. A) unique + not_null (*)
64. B) foreign_key only
65. C) relationships only
66. D) accepted_values only
67. Explanation: Primary-key columns should have unique (no dups) and not_null (no NULLs) tests at minimum; relationships tests reference other models.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: Which is OLTP, not OLAP?
  options:
    - Aggregating 5 years of revenue by month
    - A nightly cube refresh
    - A dashboard of top-100 customers
    - A web app processing a payment checkout
  correctIndex: 3
  explanation: OLTP is many short transactions on current-state data (checkout); OLAP is few large analytic queries over historical data.
- id: q2
  question: A star schema consists of?
  options:
    - A central fact table surrounded by denormalized dimension tables
    - A single denormalized table
    - Many snowflake-normalized dimension tables
    - A graph of edges and nodes
  correctIndex: 0
  explanation: Star schema = one fact table at the center, dimensions radiating out, denormalized for fast joins; snowflake normalizes the dimensions.
- id: q3
  question: SCD Type 2 preserves history by?
  options:
    - Overwriting in place
    - Inserting a new row with effective_from/effective_to and is_current flags
    - Deleting the old row
    - Using a separate archive table only
  correctIndex: 1
  explanation: Type 2 keeps the old row (expired) and adds a new current row, so facts can be associated with the dimension version valid at the time.
- id: q4
  question: Why use surrogate keys in the warehouse?
  options:
    - They're smaller than natural keys
    - They're required by dbt
    - Source natural keys can change or be reused; surrogates are stable and warehouse-assigned
    - They're always UUIDs
  correctIndex: 2
  explanation: Surrogate keys decouple the warehouse from upstream churn; the fact references the surrogate, and SCD2 produces multiple surrogates per natural key.
- id: q5
  question: Which is a columnar OLAP store?
  options:
    - Postgres row-store
    - MySQL InnoDB
    - SQLite
    - ClickHouse / Redshift / Snowflake
  correctIndex: 3
  explanation: Columnar stores compress and scan columns efficiently — orders of magnitude faster for analytical scans, but poor for single-row updates.
- id: q6
  question: dbt's primary purpose is?
  options:
    - "Transformations-as-code: SELECTs materialized as tables/views/incremental with tests and lineage"
    - Connection pooling
    - Logical replication
    - Full-text search
  correctIndex: 0
  explanation: dbt (data build tool) turns SELECT statements into materialized warehouse models with tests, docs, and lineage — the ELT workflow.
- id: q7
  question: In a star schema, the fact table holds?
  options:
    - Customer names and addresses
    - Measures (metrics) and foreign keys to dimensions
    - Surrogate key definitions only
    - DDL scripts
  correctIndex: 1
  explanation: The fact table stores numeric measures (amount, count) and FKs to dimensions; descriptive attributes live in dimension tables.
- id: q8
  question: Snowflake schema differs from star in that?
  options:
    - It uses snowflake IDs
    - It doesn't have a fact table
    - Dimensions are normalized into multiple tables
    - It's for OLTP
  correctIndex: 2
  explanation: Snowflake normalizes dimensions (e.g. customer -> city -> country), saving space at the cost of more joins; star keeps dimensions denormalized.
- id: q9
  question: Which dbt materialization rebuilds only new rows on each run?
  options:
    - view
    - table
    - ephemeral
    - incremental
  correctIndex: 3
  explanation: incremental materialization uses a unique_key and an is_incremental() filter to insert only new/changed rows — fast for growing fact tables.
- id: q10
  question: A required dbt test for dim_customer.customer_key is?
  options:
    - unique + not_null
    - foreign_key only
    - relationships only
    - accepted_values only
  correctIndex: 0
  explanation: Primary-key columns should have unique (no dups) and not_null (no NULLs) tests at minimum; relationships tests reference other models.
```

