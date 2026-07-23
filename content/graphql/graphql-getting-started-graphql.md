---
slug: graphql-getting-started-graphql
id: graphql-01
track: graphql
order: 1
title: Getting Started with GraphQL
description: Understand GraphQL — a query language for APIs that gives clients exactly the data they ask for.
difficulty: beginner
estMinutes: 60
contentVersion: 1.0.0
---

# Getting Started with GraphQL

## Getting Started with GraphQL

### Why It Matters

GraphQL, developed by Facebook in 2012 and open-sourced in 2015, solves the biggest problems with REST APIs: over-fetching (getting too much data) and under-fetching (getting too little, requiring multiple round-trips). Companies like GitHub, Shopify, and Airbnb use GraphQL because it lets frontend developers ask for exactly what they need in a single request.

GraphQL is a query language for your API. Instead of multiple REST endpoints (GET /users, GET /users/1/posts, GET /posts/1/comments), you send a single query to one endpoint that describes exactly what data you want — and get back exactly that, nothing more, nothing less.

### Prerequisites

- Basic understanding of APIs and HTTP
- JavaScript fundamentals
- Familiarity with JSON

### Topics

- What is GraphQL and why use it?
- GraphQL vs REST — key differences
- The GraphQL schema: types, queries, mutations
- Writing your first query
- The single endpoint: /graphql

```graphql
# GraphQL query — get a user and their posts, but only the fields you need
query {
  user(id: 1) {
    name
    email
    posts {
      title
      publishedAt
    }
  }
}

# The response matches the query's shape exactly
# {
#   "user": {
#     "name": "Ada",
#     "email": "ada@example.com",
#     "posts": [
#       { "title": "Hello World", "publishedAt": "2024-01-15" }
#     ]
#   }
# }
```
Caption: A GraphQL query and its response

### Key Concepts

- Schema: the contract between client and server — defines what types and operations exist
- Query: reads data (like GET in REST)
- Mutation: modifies data (like POST/PUT/DELETE in REST)
- Subscription: real-time updates via WebSocket (like a live feed)
- Resolver: a function that fetches the data for a specific field

### Common Pitfalls

- Over-fetching in REST: GET /users/1 returns the user's bio, avatar, settings, billing — when you only needed the name. GraphQL lets you ask for just { name }
- Under-fetching in REST: to show a user's posts and comments, you need 3 API calls. GraphQL does it in 1
- N+1 problem: if a resolver fetches each post's author individually, 100 posts = 101 database queries. Use DataLoader to batch

### Interview Questions

- What is GraphQL and how does it differ from REST?
- What are the advantages of GraphQL over REST?
- What is the N+1 problem in GraphQL and how do you solve it?

### Mini Project

Explore the public Star Wars GraphQL API at https://graphql.org/swapi/. Write a query to get a character's name and the titles of all films they appear in.

### Exercises

1. Compare: how many REST calls would it take to get a GitHub user's name, their 5 most recent repos, and each repo's last 3 issues? In GraphQL, it's one query.
2. Write a GraphQL query that asks for a film's title, director, and release date

```quiz
- id: q1
  question: What is the key advantage of GraphQL over REST?
  options:
    - It's faster
    - Clients ask for exactly the data they need — no over-fetching or under-fetching
    - It uses less memory
    - It doesn't require a server
  correctIndex: 1
  explanation: GraphQL lets clients specify exactly which fields they want. No over-fetching (getting unused data) and no under-fetching (needing multiple round-trips). One query gets exactly what you need.
- id: q2
  question: How many endpoints does a typical GraphQL API have?
  options:
    - One per resource (like REST)
    - One — usually /graphql
    - One per query type
    - It depends on the database
  correctIndex: 1
  explanation: A GraphQL API has a single endpoint (usually /graphql). All queries, mutations, and subscriptions go to this one URL. The server figures out what data to return based on the query string.
- id: q3
  question: What is a GraphQL Query used for?
  options:
    - Creating data
    - Reading data (like GET in REST)
    - Deleting data
    - Real-time updates
  correctIndex: 1
  explanation: A Query reads data — it's the GraphQL equivalent of a GET request. Mutations modify data (create/update/delete). Subscriptions provide real-time updates.
- id: q4
  question: What is the N+1 problem in GraphQL?
  options:
    - N servers + 1 client
    - A resolver that makes 1 query for a list, then N queries for each item's related data — solved by batching with DataLoader
    - N queries to 1 database
    - A network timeout
  correctIndex: 1
  explanation: If a list of 100 posts each need their author, a naive resolver makes 1 query for the posts + 100 queries for each author = 101 queries (N+1). DataLoader batches these into 2 queries.
- id: q5
  question: What does a GraphQL schema do?
  options:
    - Stores the database
    - Defines the contract between client and server — what types and operations exist
    - Caches queries
    - Handles authentication
  correctIndex: 1
  explanation: The schema is the API's contract. It defines what types exist (User, Post, Comment), what fields they have, and what operations (queries, mutations) are available. Clients can introspect the schema to discover what's possible.
```

