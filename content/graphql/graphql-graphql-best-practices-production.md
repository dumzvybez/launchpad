---
slug: graphql-graphql-best-practices-production
id: graphql-05
track: graphql
order: 5
title: GraphQL Best Practices & Production
description: Security, performance, pagination, and production patterns for GraphQL APIs.
difficulty: advanced
estMinutes: 80
contentVersion: 1.0.0
---

# GraphQL Best Practices & Production

## GraphQL Best Practices & Production

### Why It Matters

A naive GraphQL API is a security nightmare — clients can request infinitely nested data, bypass rate limits, and crash the server with expensive queries. Production GraphQL APIs need pagination, depth limiting, cost analysis, authentication, and caching. This lesson covers everything you need to ship safely.

Production GraphQL APIs address: (1) pagination (cursor-based for large lists), (2) security (depth limiting, query cost analysis, rate limiting), (3) authentication (per-resolver or schema-level), (4) caching (response caching, DataLoader for N+1), and (5) error handling (partial success, error codes).

### Prerequisites

- Complete all previous GraphQL lessons
- Understanding of authentication concepts (JWT, sessions)

### Topics

- Cursor-based pagination (Relay-style connections)
- Depth limiting and query complexity analysis
- Authentication and authorization in resolvers
- DataLoader for N+1 batching
- Persisted queries for security and performance
- Federation and schema stitching (overview)

```javascript
// 1. Cursor-based pagination (Relay connection pattern)
const typeDefs = `#graphql
  type PostConnection {
    edges: [PostEdge!]!
    pageInfo: PageInfo!
  }
  type PostEdge {
    node: Post!
    cursor: String!
  }
  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }
  type Query {
    posts(first: Int = 10, after: String): PostConnection!
  }
`;

// 2. Authentication via context
const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    const user = await verifyToken(token); // your JWT verification
    return { user }; // available in every resolver as context.user
  },
});

// 3. Authorization in resolvers
const resolvers = {
  Query: {
    // Only authenticated users can see their posts
    myPosts: (_, __, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return posts.filter(p => p.authorId === context.user.id);
    },
  },
};

// 4. Depth limiting (prevent malicious nested queries)
import depthLimit from 'graphql-depth-limit';
const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5)], // max 5 levels of nesting
});
```
Caption: Production GraphQL patterns

### Key Concepts

- Cursor pagination: instead of page numbers, use cursors (opaque tokens). The client says 'give me 10 items after this cursor' — stable when data changes
- Depth limiting: cap how deep a query can nest (e.g., max 5 levels) — prevents { user { posts { author { posts { author { ... } } } } } } infinite recursion
- Query complexity: assign a cost to each field; reject queries that exceed a cost budget — prevents expensive queries
- Persisted queries: the client sends a query hash, not the full query string — smaller requests, server only accepts pre-registered queries
- DataLoader: batches and caches database requests within a single request — solves the N+1 problem

### Common Pitfalls

- Allowing unlimited depth — a malicious client can nest { user { posts { author { posts { author { ... } } } } } } infinitely, crashing the server
- Not paginating lists — returning 10,000 posts in one query is slow and memory-intensive; use cursor pagination
- Authenticating at the HTTP level only — GraphQL has one endpoint; do auth in the context, then authorize per-resolver

### Interview Questions

- How does cursor-based pagination differ from offset pagination?
- What is the N+1 problem and how does DataLoader solve it?
- How do you prevent malicious clients from sending deeply nested queries?

### Mini Project

Add production features to your blog API: (1) cursor-based pagination on the posts query, (2) authentication via context (JWT), (3) a protected myPosts query, (4) depth limiting (max 5 levels).

### Exercises

1. Install graphql-depth-limit and add it as a validation rule
2. Add DataLoader to batch user lookups (solve the N+1 problem when fetching post authors)

```quiz
- id: q1
  question: Why is cursor-based pagination preferred over offset pagination in GraphQL?
  options:
    - It's faster
    - It's stable when data changes — if a new item is inserted between page 1 and 2, offset pagination shows a duplicate; cursor pagination doesn't
    - It uses less memory
    - It's required by GraphQL
  correctIndex: 1
  explanation: Offset pagination (page=2&limit=10) breaks when data changes between requests — a new insert can cause a duplicate or skipped item. Cursor pagination ('give me 10 items after this cursor') is stable because the cursor points to a specific position, not a calculated offset.
- id: q2
  question: What does DataLoader do?
  options:
    - Caches GraphQL queries
    - Batches and caches database requests within a single GraphQL request — solves the N+1 problem
    - Loads data from files
    - Balances the server load
  correctIndex: 1
  explanation: DataLoader batches multiple individual database queries into a single query. If 100 posts each need their author, DataLoader collects all 100 author IDs and fires ONE 'SELECT * FROM users WHERE id IN (1,2,3,...)' query instead of 100 separate queries.
- id: q3
  question: How do you prevent deeply nested malicious queries?
  options:
    - Rate limiting
    - Depth limiting — use graphql-depth-limit to cap nesting at e.g. 5 levels
    - Authentication
    - Caching
  correctIndex: 1
  explanation: graphql-depth-limit adds a validation rule that rejects queries exceeding a max depth. Without it, a client could send { user { posts { author { posts { author { ... infinite ... } } } } } } and crash the server.
- id: q4
  question: Where should authentication happen in a GraphQL API?
  options:
    - At the HTTP middleware level only
    - In the context function — extract the user from the request, then authorize per-resolver
    - In each resolver's schema definition
    - In the database
  correctIndex: 1
  explanation: GraphQL has one endpoint, so HTTP-level auth alone isn't enough. Do authentication in the context function (extract the user from the JWT). Then do authorization per-resolver — check context.user in each resolver that needs it.
- id: q5
  question: What are persisted queries?
  options:
    - Queries saved to the database
    - The client sends a query hash instead of the full query string — smaller requests and the server only accepts pre-registered queries (security)
    - Cached query results
    - Queries that never change
  correctIndex: 1
  explanation: "Persisted queries: the client and server agree on a set of queries at build time. At runtime, the client sends just the hash (e.g., abc123), not the full query string. This reduces request size and prevents clients from sending arbitrary queries — a security feature."
```

