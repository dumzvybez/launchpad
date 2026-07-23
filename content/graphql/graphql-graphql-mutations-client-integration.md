---
slug: graphql-graphql-mutations-client-integration
id: graphql-04
track: graphql
order: 4
title: GraphQL Mutations & Client Integration
description: Write mutations to modify data and connect a frontend to your GraphQL API with Apollo Client.
difficulty: intermediate
estMinutes: 70
contentVersion: 1.0.0
---

# GraphQL Mutations & Client Integration

## GraphQL Mutations & Client Integration

### Why It Matters

Reading data is only half the API. Mutations let you create, update, and delete data. And building a real app means connecting a frontend (React, Vue, etc.) to your GraphQL backend. Apollo Client provides caching, loading states, and error handling out of the box.

Mutations are the GraphQL equivalent of POST/PUT/DELETE. On the frontend, Apollo Client integrates with React (or any framework) to send queries and mutations, cache results, and update the UI automatically.

### Prerequisites

- Complete all previous GraphQL lessons
- Basic React knowledge (for the frontend section)

### Topics

- Defining mutations in the schema
- Writing mutation resolvers
- Apollo Client setup in React
- useQuery and useMutation hooks
- Cache updates after mutations

```javascript
// Server: mutation resolver
const typeDefs = `#graphql
  type Mutation {
    createPost(input: CreatePostInput!): Post!
  }
  input CreatePostInput {
    title: String!
    content: String!
  }
`;

const resolvers = {
  Mutation: {
    createPost: (_, { input }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      const post = { id: String(posts.length + 1), ...input, authorId: context.user.id };
      posts.push(post);
      return post;
    },
  },
};

// Client (React): useMutation hook
import { useMutation, gql } from '@apollo/client';

const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
    }
  }
`;

function CreatePostForm() {
  const [createPost, { loading, error }] = useMutation(CREATE_POST);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({
        variables: { input: { title: 'My Post', content: 'Hello!' } },
      });
      console.log('Post created!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={loading}>Create Post</button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```
Caption: Mutation resolver and Apollo Client integration

### Key Concepts

- Mutation type: defines write operations in the schema (createPost, updateUser, deleteUser)
- useMutation: Apollo Client hook for executing mutations — returns [mutateFn, { loading, error, data }]
- useQuery: Apollo Client hook for executing queries — auto-runs on mount, provides loading/error/data states
- Cache: Apollo Client caches query results — mutations can update the cache automatically or manually
- Optimistic UI: update the UI before the server responds — feels instant, rolls back if the mutation fails

### Common Pitfalls

- Not updating the cache after a mutation — the new post doesn't appear in the list until a page refresh. Use refetchQueries or update the cache manually
- Forgetting to handle loading and error states in the UI — users see nothing while the mutation is in flight
- Not validating input on the server — always validate mutation input in the resolver, even if the client validated it too

### Interview Questions

- How do mutations differ from queries in GraphQL?
- How does Apollo Client cache query results?
- How do you update the Apollo cache after a mutation?

### Mini Project

Add a createPost mutation to your blog API. Then build a simple React form that uses useMutation to create a post and display it. Make sure the post list updates after creation (use refetchQueries or cache update).

### Exercises

1. Add a deletePost mutation and a delete button in the UI
2. Implement optimistic UI: show the new post immediately, roll back if the mutation fails

```quiz
- id: q1
  question: What is a GraphQL mutation?
  options:
    - A type of query
    - A write operation that modifies data (create, update, delete) — like POST/PUT/DELETE in REST
    - A schema change
    - A real-time subscription
  correctIndex: 1
  explanation: A mutation is a write operation. It modifies data on the server and returns the modified data. The Mutation type in the schema defines all available write operations.
- id: q2
  question: What does useMutation return in Apollo Client?
  options:
    - Just the data
    - "A tuple: [mutateFunction, { loading, error, data }]"
    - A promise
    - A subscription
  correctIndex: 1
  explanation: "useMutation returns [mutateFunction, resultObject]. Call mutateFunction({ variables: {...} }) to execute the mutation. resultObject has { loading, error, data } for the UI state."
- id: q3
  question: Why might a newly created post not appear in the list after a createPost mutation?
  options:
    - The mutation failed
    - Apollo Client cached the old list and didn't update it — use refetchQueries or update the cache manually
    - The server didn't save it
    - The UI is broken
  correctIndex: 1
  explanation: "Apollo Client caches query results. After a mutation, the cache still has the old list. Solutions: (1) refetchQueries: ['GetPosts'] to re-run the list query, (2) update the cache manually in the mutation's update function, or (3) use optimistic UI."
- id: q4
  question: What is optimistic UI in Apollo Client?
  options:
    - Showing an error before the request
    - Updating the UI immediately (before the server responds) and rolling back if the mutation fails — makes the app feel instant
    - A type of caching
    - A query optimization
  correctIndex: 1
  explanation: Optimistic UI updates the UI immediately with the expected result, before the server responds. If the mutation succeeds, the optimistic update is confirmed. If it fails, the UI rolls back. This makes the app feel instant — no loading spinner.
- id: q5
  question: Should you validate mutation input on the server even if the client validated it?
  options:
    - No, client validation is enough
    - Yes — the client can be bypassed (Postman, curl, malicious user); always validate on the server too
    - Only for sensitive data
    - Only in production
  correctIndex: 1
  explanation: Client-side validation is for UX (immediate feedback). Server-side validation is for security — the client can be bypassed entirely (curl, Postman, malicious user). Always validate on the server, even if the client also validates.
```

