---
slug: graphql-graphql-schema-types
id: graphql-02
track: graphql
order: 2
title: GraphQL Schema & Types
description: Define your API's contract with a GraphQL schema — types, queries, and mutations.
difficulty: beginner
estMinutes: 65
contentVersion: 1.0.0
---

# GraphQL Schema & Types

## GraphQL Schema & Types

### Why It Matters

The schema is the heart of a GraphQL API. It defines what data exists, what operations are possible, and what the client can ask for. A well-designed schema is self-documenting, type-safe, and enables autocomplete in tools like GraphiQL and Apollo Client.

A GraphQL schema is written in the Schema Definition Language (SDL). It defines types (objects with fields), queries (read operations), and mutations (write operations). Each field has a type — String, Int, Boolean, ID, or a custom type.

### Prerequisites

- Complete 'Getting Started with GraphQL'
- Basic understanding of typed languages (TypeScript helpful)

### Topics

- Schema Definition Language (SDL)
- Scalar types: String, Int, Float, Boolean, ID
- Object types and fields
- Query and Mutation types
- Arguments and input types
- Enums and lists

```graphql
# Schema Definition Language (SDL)

# Object type — a User has these fields
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
  posts: [Post!]!
}

# Another object type
type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  publishedAt: String
}

# The Query type — defines all read operations
type Query {
  user(id: ID!): User
  users(limit: Int = 10): [User!]!
  posts(authorId: ID): [Post!]!
}

# The Mutation type — defines all write operations
type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}

# Input type — for mutation arguments
input CreateUserInput {
  name: String!
  email: String!
  age: Int
}

input UpdateUserInput {
  name: String
  email: String
  age: Int
}

# Enum — a field with a fixed set of values
enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```
Caption: A complete GraphQL schema

### Key Concepts

- !: Non-nullable — the field always returns a value (never null). String! means required
- [Type!]: A non-empty list of non-null items
- ID: a unique identifier scalar type (serialized as a string)
- Input type: a type used for mutation arguments (like a DTO in REST)
- Enum: a type with a fixed set of values

### Common Pitfalls

- Overusing non-null (!) — if a field is ! and the resolver returns null, the entire query fails. Use null carefully for fields that might not always be available
- Not using input types for mutations — flat arguments (name: String, email: String) don't scale; group them in an input type
- Designing the schema to match your database — design it for the CLIENT, not the database. The schema is the API, not the data model

### Interview Questions

- What does the ! mean in a GraphQL schema?
- What is the difference between an input type and an object type?
- Should your GraphQL schema mirror your database schema? Why or why not?

### Mini Project

Write a GraphQL schema for a blog: types for User, Post, and Comment. Include queries (getUser, getAllPosts) and mutations (createPost, addComment). Use input types for mutation arguments.

### Exercises

1. Add an enum type for PostStatus (DRAFT, PUBLISHED, ARCHIVED) and use it in the Post type
2. Make the 'age' field on User nullable, and the 'email' field non-null — explain why

```quiz
- id: q1
  question: What does the ! mean in GraphQL (e.g., String!)?
  options:
    - The field is optional
    - The field is non-nullable — it must always return a value, never null
    - The field is an array
    - The field is deprecated
  correctIndex: 1
  explanation: "! marks a field as non-nullable. String! means the field must always return a string, never null. If a resolver for a non-null field returns null, the entire query fails with an error."
- id: q2
  question: What is an input type used for in GraphQL?
  options:
    - For query arguments
    - For mutation arguments (grouping multiple fields into a structured input)
    - For database inputs
    - For file uploads
  correctIndex: 1
  explanation: "Input types group multiple fields into a structured argument for mutations. Instead of createUser(name: String, email: String, age: Int), you write createUser(input: CreateUserInput!). This is more maintainable and extensible."
- id: q3
  question: Should your GraphQL schema mirror your database schema?
  options:
    - Yes, always
    - No — design the schema for the CLIENT's needs, not the database structure
    - It depends on the database
    - Only for SQL databases
  correctIndex: 1
  explanation: The GraphQL schema is the API contract, not the data model. Design it for what clients need — they might want computed fields, aggregated data, or related data that spans multiple database tables. The resolvers handle the mapping.
- id: q4
  question: What does [Post!]! mean?
  options:
    - A nullable list of nullable posts
    - A non-null list where every item is also non-null (the list is never null and never contains null items)
    - An empty list
    - A single post
  correctIndex: 1
  explanation: "[Post!]! means: a non-null list (!) of non-null posts (Post!). The list itself can't be null (it can be empty []), and no item in the list can be null."
- id: q5
  question: What is the ID scalar type in GraphQL?
  options:
    - An integer ID
    - A unique identifier, serialized as a string but can be parsed as a number
    - A UUID only
    - An auto-incrementing integer
  correctIndex: 1
  explanation: ID is a scalar type for unique identifiers. It's serialized as a string, but the server can accept either a string or an integer as input. It's semantically 'this is an identifier' — not just a string.
```

