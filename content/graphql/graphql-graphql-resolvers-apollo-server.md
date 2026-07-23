---
slug: graphql-graphql-resolvers-apollo-server
id: graphql-03
track: graphql
order: 3
title: GraphQL Resolvers & Apollo Server
description: Build a working GraphQL server with Apollo Server and write resolvers that fetch data.
difficulty: intermediate
estMinutes: 75
contentVersion: 1.0.0
---

# GraphQL Resolvers & Apollo Server

## GraphQL Resolvers & Apollo Server

### Why It Matters

Resolvers are the functions that actually fetch the data for each field in your schema. Apollo Server is the most popular GraphQL server for Node.js — it handles parsing, validation, caching, and gives you GraphiQL (an interactive query explorer) for free. This is where the schema meets real data.

A resolver is a function that returns data for a specific field. Apollo Server connects your schema (type definitions) to your resolvers (data-fetching functions) and serves them over HTTP.

### Prerequisites

- Complete 'Getting Started with GraphQL' and 'GraphQL Schema & Types'
- Node.js and npm installed

### Topics

- Installing Apollo Server
- Writing resolver functions
- The resolver signature: (parent, args, context, info)
- Context for shared data (auth, database connections)
- Running the server and exploring with GraphiQL

```javascript
// npm install @apollo/server graphql
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// 1. Define the schema (typeDefs)
const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    author: User!
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
  }
`;

// 2. Mock data
const users = [
  { id: '1', name: 'Ada', email: 'ada@example.com' },
  { id: '2', name: 'Grace', email: 'grace@example.com' },
];
const posts = [
  { id: '1', title: 'Hello World', authorId: '1' },
  { id: '2', title: 'GraphQL Rocks', authorId: '1' },
];

// 3. Write resolvers — one function per field
const resolvers = {
  Query: {
    user: (_, { id }) => users.find(u => u.id === id),
    users: () => users,
  },
  // Field resolver: resolve 'posts' on a User
  User: {
    posts: (parent) => posts.filter(p => p.authorId === parent.id),
  },
  // Field resolver: resolve 'author' on a Post
  Post: {
    author: (parent) => users.find(u => u.id === parent.authorId),
  },
};

// 4. Start the server
const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`GraphQL API ready at ${url}`);
```
Caption: A complete Apollo Server with resolvers

### Key Concepts

- Resolver: a function (parent, args, context, info) => data that fetches the value for a field
- parent: the result of the parent resolver (e.g., for User.posts, parent is the User object)
- args: the arguments passed to the field (e.g., user(id: "1") → args.id = '1')
- context: shared across all resolvers — use for database connections, auth user, etc.
- GraphiQL: built-in interactive query explorer at http://localhost:4000

### Common Pitfalls

- Forgetting to write field resolvers for related types — if User has a 'posts' field but no resolver, it returns null
- Using global variables for data — use the context parameter to pass database connections
- Not handling errors — throw new Error('User not found') in a resolver; Apollo formats it as { errors: [{ message: 'User not found' }] }

### Interview Questions

- What are the four arguments a GraphQL resolver receives?
- What is the 'context' in Apollo Server used for?
- How do field resolvers work for related types?

### Mini Project

Build a GraphQL API for a simple blog: types for User and Post, queries to get users and posts by author, and resolvers that use in-memory arrays. Test all queries in GraphiQL.

### Exercises

1. Add a context function that simulates authentication (check for a fake auth header)
2. Add a Mutation type with a createPost mutation and write its resolver

```quiz
- id: q1
  question: What are the four arguments a GraphQL resolver receives?
  options:
    - req, res, next, err
    - parent, args, context, info
    - query, mutation, subscription, type
    - schema, types, resolvers, data
  correctIndex: 1
  explanation: Resolvers receive (parent, args, context, info). parent = the parent object's resolved value, args = the field's arguments, context = shared data (db, auth), info = schema details (rarely used).
- id: q2
  question: What is the 'context' used for in Apollo Server?
  options:
    - Storing the schema
    - Sharing data across all resolvers (database connections, authenticated user, etc.)
    - Caching query results
    - Logging requests
  correctIndex: 1
  explanation: context is an object shared across all resolvers for a single request. Use it to pass database connections, the authenticated user, request headers, etc. Define it once in the server setup; access it in any resolver as the third argument.
- id: q3
  question: How does a field resolver for a related type work?
  options:
    - It's automatic — no resolver needed
    - You write a resolver on the parent type (e.g., User.posts) that receives the parent User object and returns the related posts
    - It's configured in the schema
    - It's handled by the database
  correctIndex: 1
  explanation: "For User.posts, you write a resolver in the User object: User: { posts: (parent) => posts.filter(p => p.authorId === parent.id) }. The parent argument is the User object — use its id to find the related posts."
- id: q4
  question: What is GraphiQL?
  options:
    - A GraphQL database
    - An interactive in-browser GraphQL query explorer — lets you write and test queries with autocomplete
    - A GraphQL linter
    - A GraphQL hosting service
  correctIndex: 1
  explanation: GraphiQL (or Apollo Sandbox) is a built-in interactive IDE for GraphQL. Open your server URL in a browser and you get a query editor with autocomplete (from the schema), syntax highlighting, and response pane — free with Apollo Server.
- id: q5
  question: What happens if a resolver throws an Error?
  options:
    - The server crashes
    - "Apollo formats it as a GraphQL error response: { errors: [{ message: '...' }], data: null }"
    - The query is retried
    - The error is ignored
  correctIndex: 1
  explanation: "If a resolver throws, Apollo catches it and returns a structured error response: { errors: [{ message: 'Error message', ... }], data: null }. The server doesn't crash — other parts of the query may still return data if they're independent."
```

