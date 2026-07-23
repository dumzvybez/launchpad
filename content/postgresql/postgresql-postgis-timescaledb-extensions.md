---
slug: postgresql-postgis-timescaledb-extensions
id: postgresql-18
track: postgresql
order: 18
title: PostGIS, TimescaleDB, and Extensions
description: Extend Postgres with PostGIS (geospatial), TimescaleDB (time-series), pg_cron (scheduled jobs), pg_stat_statements (query stats), pg_trgm (fuzzy text), and more.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=Q56kljmIN14&t=1800s
whyItMatters: Extend Postgres with PostGIS (geospatial), TimescaleDB (time-series), pg_cron (scheduled jobs), pg_stat_statements (query stats), pg_trgm (fuzzy text), and more.
deepDiveResources:
  - label: W3Schools PostgreSQL
    url: https://www.w3schools.com/postgresql/
    kind: course
  - label: PostgreSQL Official Docs
    url: https://www.postgresql.org/docs/
    kind: doc
---

# PostGIS, TimescaleDB, and Extensions

## PostGIS, TimescaleDB, and Extensions

### Why It Matters

Extend Postgres with PostGIS (geospatial), TimescaleDB (time-series), pg_cron (scheduled jobs), pg_stat_statements (query stats), pg_trgm (fuzzy text), and more.

Extend Postgres with PostGIS (geospatial), TimescaleDB (time-series), pg_cron (scheduled jobs), pg_stat_statements (query stats), pg_trgm (fuzzy text), and more.

### Prerequisites

- Stage 5: Indexes — B-tree, Hash, GIN, GiST, BRIN
- Stage 12: Partitioning — Range, List, Hash

### Topics

- PostGIS: geometry/geography, ST_Distance, ST_Within, GiST spatial indexes
- TimescaleDB: hypertables, continuous aggregates, time-series compression
- pg_cron: schedule SQL jobs (REFRESH MATERIALIZED VIEW, VACUUM, data retention)
- pg_stat_statements: per-query stats for slow-query triage
- pg_trgm: trigram indexes for fuzzy text search (LIKE '%foo%')
- postgresql_anonymizer / pg_anonymizer: GDPR/CCPA data masking
- hypopg: hypothetical indexes (test without creating)
- Extensions are PostgreSQL's superpower — CREATE EXTENSION and the pg_catalog ecosystem

### Key Concepts

- PostGIS adds geometry/geography types, hundreds of ST_* functions, and GiST spatial indexes; the standard for open-source geospatial databases.
- TimescaleDB adds "hypertables" (auto-partitioned time-series) and continuous aggregates (auto-refreshing materialized views for rollups) — easier than manual range partitioning for time-series.
- pg_cron runs SQL jobs on a schedule (cron syntax) inside Postgres; perfect for REFRESH MATERIALIZED VIEW CONCURRENTLY or nightly VACUUM ANALYZE.
- pg_stat_statements records per-query stats (calls, total_time, rows, buffers); essential for slow-query triage. Set `pg_stat_statements.track = all`.
- pg_trgm adds trigram indexes for `LIKE '%foo%'` (which B-tree can't help with); GIN/GiST trigrams power fuzzy text search.
- hypopg lets you test "would this index help?" without creating it (which would take hours on a huge table and add write load).
- Extensions live in `pg_extension` and are installed per-database; `CREATE EXTENSION` requires superuser (or a privileged role with the extension's control file trusted=true).

```sql
CREATE EXTENSION postgis;

CREATE TABLE store (
    id      bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name    text NOT NULL,
    geom    geometry(Point, 4326) NOT NULL           -- SRID 4326 = WGS84
);

CREATE INDEX store_geom_gist ON store USING gist (geom);

-- Find stores within 5 km of a point (geography for distance in meters):
SELECT id, name,
    ST_Distance(geom::geography, ST_MakePoint(-122.42, 37.78)::geography) AS dist_m
FROM store
WHERE ST_DWithin(geom::geography, ST_MakePoint(-122.42, 37.78)::geography, 5000)
ORDER BY dist_m
LIMIT 20;
```
Caption: PostGIS: spatial queries

### Common Pitfalls

- Installing extensions without checking trusted status — most extensions require superuser; only "trusted" extensions (like pg_trgm, pg_stat_statements) can be installed by non-superusers with database CREATE privilege.
- TimescaleDB compression on hot partitions — compress only cold partitions; compressing the active (current) partition causes high write amplification on every insert.
- PostGIS geometry vs geography confusion — geometry is planar (faster, projection-dependent); geography is spherical (slower, accurate for global data). Use geography for lat/lon distance queries in meters.
- pg_stat_statements track = top only — default is 'top' (top-level queries); set `pg_stat_statements.track = all` to track nested statements too (essential for finding slow subqueries).
- pg_cron jobs running as the wrong role — pg_cron runs jobs as the role that scheduled them; use `cron.schedule(..., username, ...)` or set the job's role explicitly to ensure correct privileges.

### Real-World Applications

- Uber uses PostGIS (and formerly a custom geospatial extension) for driver-rider matching by distance.
- Foursquare uses PostGIS for venue search and proximity queries at global scale.
- TimescaleDB is used by monitoring vendors (Promscale, others) for metrics storage on Postgres.
- Reddit uses pg_stat_statements for slow-query triage and pg_trgm for fuzzy subreddit search.

### Interview Questions

- 1. What does PostGIS add to Postgres? — geometry/geography types, hundreds of ST_* spatial functions, and GiST spatial indexes; the standard open-source geospatial database.
- 2. What's a TimescaleDB hypertable? — An auto-partitioned time-series table that looks like a regular table but partitions by time (and optionally by space); continuous aggregates auto-refresh rollups.
- 3. What does pg_cron do? — Schedules SQL jobs (cron syntax) inside Postgres; perfect for REFRESH MATERIALIZED VIEW CONCURRENTLY, VACUUM ANALYZE, or data retention.
- 4. What's the difference between PostGIS geometry and geography? — geometry is planar (fast, projection-dependent); geography is spherical (slower, accurate for global lat/lon distance in meters).
- 5. What does hypopg let you do? — Test "would this index help?" by creating a hypothetical index (in memory only) and running EXPLAIN; avoids the cost of creating a real index on a huge table.

### Mini Project

Build a Geospatial Store Finder: A `store` table with name and geometry(Point, 4326), a GiST index, a `find_stores_within(lat, lon, radius_m)` SQL function that returns stores within a radius sorted by distance, and 1000 random seed stores. Add a TimescaleDB continuous aggregate on a `visit` hypertable for daily store-visit counts. Suggested approach:
  - Use ST_SetSRID(ST_MakePoint(lon, lat), 4326) for the geometry
  - Use ST_DWithin(geom::geography, point::geography, radius_m) and ST_Distance for sorting
  - Create the GiST index on geom
  - For visits: create_hypertable('visit', 'observed_at'); create a continuous aggregate bucketed by day per store
  - Test with a query like find_stores_within(37.78, -122.42, 5000)

### Exercises

1. Install PostGIS; create a store table with geometry(Point, 4326); insert 100 random stores; query for stores within 5km of a point.
2. Install TimescaleDB; create a hypertable on a sensor_reading table; insert 10k rows; create a continuous aggregate bucketed by hour.
3. Install pg_cron; schedule a daily VACUUM ANALYZE on a table; verify the job appears in cron.job.
4. Install pg_stat_statements; run a few queries; query pg_stat_statements for the slowest; reset and verify it clears.
5. Install hypopg; create a hypothetical index; EXPLAIN a query; verify the plan improves; reset.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does PostGIS add to Postgres?
9. A) Time-series support
10. B) Geometry/geography types, ST_* functions, and GiST spatial indexes (*)
11. C) Fuzzy text search
12. D) Scheduled jobs
13. Explanation: PostGIS is the standard open-source geospatial database extension; it adds geometry/geography types, hundreds of ST_* functions (ST_Distance, ST_Within, ST_DWithin), and GiST spatial indexes.
14. Q2: What is a TimescaleDB hypertable?
15. A) A regular table with extra columns
16. B) A materialized view
17. C) An auto-partitioned time-series table (by time, optionally by space) (*)
18. D) A type of index
19. Explanation: A hypertable looks like a regular table but is automatically partitioned by time (and optionally by a space dimension); continuous aggregates auto-refresh rollups on top.
20. Q3: What does pg_cron do?
21. A) Compresses old data
22. B) Replicates data
23. C) Backs up the cluster
24. D) Schedules SQL jobs (cron syntax) inside Postgres (*)
25. Explanation: pg_cron runs SQL jobs on a schedule inside Postgres; perfect for REFRESH MATERIALIZED VIEW CONCURRENTLY, VACUUM ANALYZE, or data retention (drop old partitions).
26. Q4: What's the difference between PostGIS geometry and geography?
27. A) geometry is planar (fast, projection-dependent); geography is spherical (slower, accurate for global distance in meters) (*)
28. B) They are the same
29. C) geography is faster
30. D) geometry supports more functions
31. Explanation: geometry uses planar math (fast, but assumes a projection); geography uses spherical math (slower, but accurate for global lat/lon distance queries in meters). Use geography for "find within X meters".
32. Q5: What does hypopg let you do?
33. A) Drop indexes safely
34. B) Test if an index would help by creating a hypothetical (in-memory) index and running EXPLAIN (*)
35. C) Compress indexes
36. D) Reindex online
37. Explanation: hypopg creates hypothetical indexes in memory only; you can run EXPLAIN to see if the planner would use them, then create the real index only if it helps. Avoids the cost of building a real index on a huge table.
38. Q6: What setting makes pg_stat_statements track nested statements?
39. A) track_activities = on
40. B) log_statement = 'all'
41. C) pg_stat_statements.track = all (*)
42. D) shared_preload_libraries = 'all'
43. Explanation: Default is 'top' (top-level queries only); set 'all' to track nested (subqueries, function calls) too — essential for finding slow subqueries.
44. Q7: What does pg_trgm enable?
45. A) Time-series queries
46. B) Geospatial queries
47. C) JSONB queries
48. D) Trigram indexes for fuzzy and suffix LIKE (e.g. ILIKE '%foo%') (*)
49. Explanation: pg_trgm adds trigram (3-character substring) indexes; GIN/GiST trigrams power `LIKE '%foo%'` (which B-tree can't help with) and fuzzy matching with the % operator.
50. Q8: Which is TRUE about TimescaleDB compression?
51. A) Compress only cold partitions; compressing the active (current) partition causes write amplification (*)
52. B) Compress all partitions for best performance
53. C) Compression is automatic
54. D) Compression works on indexes only
55. Explanation: Compressed chunks are read-only (inserts must decompress first); compressing the active (write-heavy) partition causes high write amplification. Use a policy that compresses chunks older than N days.
56. Q9: What does `SELECT * FROM hypopg_create_index(...)` return?
57. A) The created index OID
58. B) An indexdef and a hypothetical index OID; the index exists only in your session (*)
59. C) An error
60. D) A query plan
61. Explanation: hypopg_create_index creates an in-memory hypothetical index visible only in your session; the returned OID lets you reference it in EXPLAIN. Other sessions don't see it; hypopg_reset() clears it.
62. Q10: What is required to install a non-trusted extension like postgis?
63. A) Restart Postgres
64. B) CREATE EXTENSION can be run by anyone
65. C) Superuser (or a role granted the extension's specific privileges); trusted extensions (pg_trgm, pg_stat_statements) can be installed by database owners (*)
66. D) A special pg_extension role
67. Explanation: Non-trusted extensions require superuser (they can run C code or filesystem operations); trusted extensions (in the control file) can be installed by database owners with CREATE privilege on the database.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does PostGIS add to Postgres?
  options:
    - Time-series support
    - Geometry/geography types, ST_* functions, and GiST spatial indexes
    - Fuzzy text search
    - Scheduled jobs
  correctIndex: 1
  explanation: PostGIS is the standard open-source geospatial database extension; it adds geometry/geography types, hundreds of ST_* functions (ST_Distance, ST_Within, ST_DWithin), and GiST spatial indexes.
- id: q2
  question: What is a TimescaleDB hypertable?
  options:
    - A regular table with extra columns
    - A materialized view
    - An auto-partitioned time-series table (by time, optionally by space)
    - A type of index
  correctIndex: 2
  explanation: A hypertable looks like a regular table but is automatically partitioned by time (and optionally by a space dimension); continuous aggregates auto-refresh rollups on top.
- id: q3
  question: What does pg_cron do?
  options:
    - Compresses old data
    - Replicates data
    - Backs up the cluster
    - Schedules SQL jobs (cron syntax) inside Postgres
  correctIndex: 3
  explanation: pg_cron runs SQL jobs on a schedule inside Postgres; perfect for REFRESH MATERIALIZED VIEW CONCURRENTLY, VACUUM ANALYZE, or data retention (drop old partitions).
- id: q4
  question: What's the difference between PostGIS geometry and geography?
  options:
    - geometry is planar (fast, projection-dependent); geography is spherical (slower, accurate for global distance in meters)
    - They are the same
    - geography is faster
    - geometry supports more functions
  correctIndex: 0
  explanation: geometry uses planar math (fast, but assumes a projection); geography uses spherical math (slower, but accurate for global lat/lon distance queries in meters). Use geography for "find within X meters".
- id: q5
  question: What does hypopg let you do?
  options:
    - Drop indexes safely
    - Test if an index would help by creating a hypothetical (in-memory) index and running EXPLAIN
    - Compress indexes
    - Reindex online
  correctIndex: 1
  explanation: hypopg creates hypothetical indexes in memory only; you can run EXPLAIN to see if the planner would use them, then create the real index only if it helps. Avoids the cost of building a real index on a huge table.
- id: q6
  question: What setting makes pg_stat_statements track nested statements?
  options:
    - track_activities = on
    - log_statement = 'all'
    - pg_stat_statements.track = all
    - shared_preload_libraries = 'all'
  correctIndex: 2
  explanation: Default is 'top' (top-level queries only); set 'all' to track nested (subqueries, function calls) too — essential for finding slow subqueries.
- id: q7
  question: What does pg_trgm enable?
  options:
    - Time-series queries
    - Geospatial queries
    - JSONB queries
    - Trigram indexes for fuzzy and suffix LIKE (e.g. ILIKE '%foo%')
  correctIndex: 3
  explanation: pg_trgm adds trigram (3-character substring) indexes; GIN/GiST trigrams power `LIKE '%foo%'` (which B-tree can't help with) and fuzzy matching with the % operator.
- id: q8
  question: Which is TRUE about TimescaleDB compression?
  options:
    - Compress only cold partitions; compressing the active (current) partition causes write amplification
    - Compress all partitions for best performance
    - Compression is automatic
    - Compression works on indexes only
  correctIndex: 0
  explanation: Compressed chunks are read-only (inserts must decompress first); compressing the active (write-heavy) partition causes high write amplification. Use a policy that compresses chunks older than N days.
- id: q9
  question: What does `SELECT * FROM hypopg_create_index(...)` return?
  options:
    - The created index OID
    - An indexdef and a hypothetical index OID; the index exists only in your session
    - An error
    - A query plan
  correctIndex: 1
  explanation: hypopg_create_index creates an in-memory hypothetical index visible only in your session; the returned OID lets you reference it in EXPLAIN. Other sessions don't see it; hypopg_reset() clears it.
- id: q10
  question: What is required to install a non-trusted extension like postgis?
  options:
    - Restart Postgres
    - CREATE EXTENSION can be run by anyone
    - Superuser (or a role granted the extension's specific privileges); trusted extensions (pg_trgm, pg_stat_statements) can be installed by database owners
    - A special pg_extension role
  correctIndex: 2
  explanation: Non-trusted extensions require superuser (they can run C code or filesystem operations); trusted extensions (in the control file) can be installed by database owners with CREATE privilege on the database.
```

