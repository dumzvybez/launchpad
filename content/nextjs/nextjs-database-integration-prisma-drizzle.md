---
slug: nextjs-database-integration-prisma-drizzle
id: nextjs-15
track: nextjs
order: 15
title: Database Integration — Prisma, Drizzle
description: Connect a Next.js app to a database with Prisma or Drizzle — schema design, the client singleton pattern, server-only usage, and migrations in CI.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=TJQbDPGzm0Y&t=240s
whyItMatters: Connect a Next. js app to a database with Prisma or Drizzle — schema design, the client singleton pattern, server-only usage, and migrations in CI.
deepDiveResources:
  - label: W3Schools Next.js
    url: https://nextjs.org/learn
    kind: course
  - label: Next.js Official Docs
    url: https://nextjs.org/docs
    kind: doc
---

# Database Integration — Prisma, Drizzle

## Database Integration — Prisma, Drizzle

### Why It Matters

Connect a Next. js app to a database with Prisma or Drizzle — schema design, the client singleton pattern, server-only usage, and migrations in CI.

Connect a Next.js app to a database with Prisma or Drizzle — schema design, the client singleton pattern, server-only usage, and migrations in CI.

### Prerequisites

- Stage 14: Authentication — NextAuth.js, Clerk.
- Stage 5: Server Components vs Client Components (server-only imports).
- SQL basics (tables, foreign keys, indexes).

### Topics

- Prisma: schema.prisma, `prisma generate`, migrations
- Drizzle: schema definition with `pg-core`, `drizzle-kit` migrations
- The singleton pattern for the client (avoid exhausting connections in dev)
- `import "server-only"` to prevent client imports
- Connecting to Postgres (Neon, Supabase, Vercel Postgres)
- Transactions, raw queries, and typed results
- Running migrations in CI/CD and on Vercel
- Read replicas and connection pooling (PgBouncer)

### Key Concepts

- The database client must be created once per process in dev (hot reloading creates many); use a global singleton
- Database code belongs only in server components, route handlers, and Server Actions — never client components
- Prisma generates a typed client from `schema.prisma`; Drizzle generates types from your schema definition
- Migrations run via `prisma migrate deploy` (Prisma) or `drizzle-kit migrate` (Drizzle) in CI
- Use connection pooling (PgBouncer, Neon's pooler) for serverless deployments to avoid exhausting connections

```ts
// lib/db.ts
import "server-only";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```
Caption: Prisma singleton

### Common Pitfalls

- Creating a new Prisma client on every request in dev — hot reloading spawns new clients, exhausting DB connections; use the global singleton pattern.
- Importing the database client into a client component — leaks the connection string to the browser; always add `import "server-only"` to the db module.
- Using `prisma migrate dev` in production — it's interactive and can hang CI; use `prisma migrate deploy` for production migrations.
- Forgetting connection pooling on serverless — each serverless function instance opens its own pool; without a pooled connection (PgBouncer, Neon pooler) you exhaust Postgres connections.
- Running migrations in the build step — Vercel builds do not have access to the production DB by default; run migrations via a deploy hook or post-deploy script.

### Real-World Applications

- Vercel uses Prisma for its internal dashboards and docs (the nextjs.org site uses Prisma for some examples).
- Notion uses an internal Postgres-backed layer with Drizzle-style typed clients for its public web app surfaces.
- Hulu uses Drizzle with Postgres for billing and recommendation data, taking advantage of its lightweight bundle.
- TikTok's web surface uses a mix of ORMs for different services; the public web tier uses serverless Postgres with pooling.

### Interview Questions

- 1. Why use a singleton for the Prisma client in development? — Hot reloading creates new clients, exhausting DB connections; a global singleton reuses one client across reloads.
- 2. How do you prevent a database client from being imported into a client component? — Add `import "server-only"` at the top of the db module so the build fails if a client component imports it.
- 3. What is the difference between `prisma migrate dev` and `prisma migrate deploy`? — `dev` is interactive (for local dev), `deploy` is non-interactive (for CI/production).
- 4. Why do serverless deployments need connection pooling? — Each function instance opens its own pool; without a pooler like PgBouncer or Neon's pooler, you quickly exhaust Postgres connections.
- 5. What is Drizzle's main advantage over Prisma? — Smaller bundle, no generated runtime client (types come from your schema definition), and SQL-like API; trade-off is more manual schema definition.

### Mini Project

Build a tiny blog with Prisma: A `/blog` page listing posts from Postgres, a `/blog/new` form using a Server Action to insert, and `prisma migrate deploy` running on Vercel deploy. Suggested approach:
  - Initialize Prisma with `npx prisma init`, define a `Post` model
  - Create the singleton `lib/db.ts` with `import "server-only"`
  - Create a Server Action `createPost(formData)` that inserts and calls `revalidatePath("/blog")`
  - Run `prisma migrate dev --name init` locally to create the table
  - Add a Vercel build hook to run `prisma migrate deploy` before each deploy

### Exercises

1. Install Prisma, define a `User` model, and run a migration locally.
2. Add the singleton pattern to `lib/db.ts` and verify it persists across hot reloads.
3. Add `import "server-only"` to `lib/db.ts` and try importing it from a client component — confirm the build fails.
4. Convert the Prisma setup to Drizzle with the same schema; compare bundle sizes.
5. Add a `Post` model with an index on `authorId` and verify the migration creates the index.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why use a singleton pattern for the Prisma client in development?
9. A) It improves query performance
10. B) It is required by Prisma
11. C) Hot reloading creates new clients, exhausting DB connections without a singleton (*)
12. D) It caches query results
13. Explanation: In dev, Next.js hot reloading can spawn many PrismaClient instances, each opening its own connection pool; a global singleton reuses one client across reloads.
14. Q2: How do you prevent a database client from being imported into a client component?
15. A) Use a try/catch
16. B) Mark it as 'use client'
17. C) Put it in a .server.ts file
18. D) Add `import "server-only"` at the top of the db module (*)
19. Explanation: `import "server-only"` causes a build error if the module is imported into a client component, preventing accidental leakage of the DB connection string and Node-only code.
20. Q3: Which Prisma command runs migrations in production CI?
21. A) prisma migrate deploy (*)
22. B) prisma migrate dev
23. C) prisma db push
24. D) prisma generate
25. Explanation: `prisma migrate deploy` is non-interactive and applies pending migrations in production; `migrate dev` is interactive (local only) and `db push` skips migrations entirely.
26. Q4: Why do serverless deployments need connection pooling?
27. A) Serverless does not support databases
28. B) Each function instance opens its own pool; without a pooler you exhaust Postgres connections (*)
29. C) Pooling speeds up queries
30. D) Pooling is required by Prisma
31. Explanation: Serverless platforms spawn many function instances, each with its own connection pool; without an external pooler (PgBouncer, Neon pooler), Postgres hits its max-connections limit and rejects new connections.
32. Q5: What is Drizzle's main advantage over Prisma?
33. A) Drizzle is simpler
34. B) Drizzle is faster at runtime
35. C) Smaller bundle, no generated runtime client, SQL-like API (*)
36. D) Drizzle does not require SQL knowledge
37. Explanation: Drizzle generates types from your schema definition (no runtime client to bundle), has a SQL-like API, and ships a smaller bundle; the trade-off is more manual schema definition.
38. Q6: Where should database queries live in a Next.js app?
39. A) Anywhere
40. B) Only in client components
41. C) Only in middleware
42. D) Only in server components, route handlers, and Server Actions (*)
43. Explanation: DB queries belong only in server-only contexts (server components, route handlers, Server Actions); importing them into client components leaks the connection string and breaks the build with `server-only`.
44. Q7: Which file defines the Prisma schema?
45. A) prisma/schema.prisma (*)
46. B) prisma.config.ts
47. C) db/schema.ts
48. D) next.config.mjs
49. Explanation: Prisma's schema lives in `prisma/schema.prisma` and defines models, datasources, and generators; running `prisma generate` produces a typed client from it.
50. Q8: What does `prisma generate` do?
51. A) Runs migrations
52. B) Generates a typed client from the schema (*)
53. C) Creates the database
54. D) Deploys to Vercel
55. Explanation: `prisma generate` reads `schema.prisma` and produces a typed PrismaClient in `node_modules/@prisma/client`; you must re-run it after schema changes.
56. Q9: Which Drizzle package contains Postgres column types?
57. A) drizzle-orm/mysql
58. B) drizzle-orm/sqlite
59. C) drizzle-orm/pg-core (*)
60. D) drizzle-kit
61. Explanation: `drizzle-orm/pg-core` exports Postgres-specific column types and helpers like `pgTable`, `text`, `integer`, `timestamp`; use `mysql-core` or `sqlite-core` for other databases.
62. Q10: Why should migrations NOT run during the Vercel build step?
63. A) Vercel does not support migrations
64. B) Migrations are too slow
65. C) Drizzle does not support migrations
66. D) Build containers do not have production DB access by default; use a deploy hook or post-deploy script (*)
67. Explanation: Vercel's build environment typically does not have access to the production database (and should not); run migrations via a deploy hook, post-deploy script, or separate CI step.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why use a singleton pattern for the Prisma client in development?
  options:
    - It improves query performance
    - It is required by Prisma
    - Hot reloading creates new clients, exhausting DB connections without a singleton
    - It caches query results
  correctIndex: 2
  explanation: In dev, Next.js hot reloading can spawn many PrismaClient instances, each opening its own connection pool; a global singleton reuses one client across reloads.
- id: q2
  question: How do you prevent a database client from being imported into a client component?
  options:
    - Use a try/catch
    - Mark it as 'use client'
    - Put it in a .server.ts file
    - Add `import "server-only"` at the top of the db module
  correctIndex: 3
  explanation: '`import "server-only"` causes a build error if the module is imported into a client component, preventing accidental leakage of the DB connection string and Node-only code.'
- id: q3
  question: Which Prisma command runs migrations in production CI?
  options:
    - prisma migrate deploy
    - prisma migrate dev
    - prisma db push
    - prisma generate
  correctIndex: 0
  explanation: "`prisma migrate deploy` is non-interactive and applies pending migrations in production; `migrate dev` is interactive (local only) and `db push` skips migrations entirely."
- id: q4
  question: Why do serverless deployments need connection pooling?
  options:
    - Serverless does not support databases
    - Each function instance opens its own pool; without a pooler you exhaust Postgres connections
    - Pooling speeds up queries
    - Pooling is required by Prisma
  correctIndex: 1
  explanation: Serverless platforms spawn many function instances, each with its own connection pool; without an external pooler (PgBouncer, Neon pooler), Postgres hits its max-connections limit and rejects new connections.
- id: q5
  question: What is Drizzle's main advantage over Prisma?
  options:
    - Drizzle is simpler
    - Drizzle is faster at runtime
    - Smaller bundle, no generated runtime client, SQL-like API
    - Drizzle does not require SQL knowledge
  correctIndex: 2
  explanation: Drizzle generates types from your schema definition (no runtime client to bundle), has a SQL-like API, and ships a smaller bundle; the trade-off is more manual schema definition.
- id: q6
  question: Where should database queries live in a Next.js app?
  options:
    - Anywhere
    - Only in client components
    - Only in middleware
    - Only in server components, route handlers, and Server Actions
  correctIndex: 3
  explanation: DB queries belong only in server-only contexts (server components, route handlers, Server Actions); importing them into client components leaks the connection string and breaks the build with `server-only`.
- id: q7
  question: Which file defines the Prisma schema?
  options:
    - prisma/schema.prisma
    - prisma.config.ts
    - db/schema.ts
    - next.config.mjs
  correctIndex: 0
  explanation: Prisma's schema lives in `prisma/schema.prisma` and defines models, datasources, and generators; running `prisma generate` produces a typed client from it.
- id: q8
  question: What does `prisma generate` do?
  options:
    - Runs migrations
    - Generates a typed client from the schema
    - Creates the database
    - Deploys to Vercel
  correctIndex: 1
  explanation: "`prisma generate` reads `schema.prisma` and produces a typed PrismaClient in `node_modules/@prisma/client`; you must re-run it after schema changes."
- id: q9
  question: Which Drizzle package contains Postgres column types?
  options:
    - drizzle-orm/mysql
    - drizzle-orm/sqlite
    - drizzle-orm/pg-core
    - drizzle-kit
  correctIndex: 2
  explanation: "`drizzle-orm/pg-core` exports Postgres-specific column types and helpers like `pgTable`, `text`, `integer`, `timestamp`; use `mysql-core` or `sqlite-core` for other databases."
- id: q10
  question: Why should migrations NOT run during the Vercel build step?
  options:
    - Vercel does not support migrations
    - Migrations are too slow
    - Drizzle does not support migrations
    - Build containers do not have production DB access by default; use a deploy hook or post-deploy script
  correctIndex: 3
  explanation: Vercel's build environment typically does not have access to the production database (and should not); run migrations via a deploy hook, post-deploy script, or separate CI step.
```

