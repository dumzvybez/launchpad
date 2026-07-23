---
slug: graphql-graphql-subscriptions
id: graphql-16
track: graphql
order: 16
title: GraphQL Subscriptions
description: Real-time updates with subscriptions using WebSockets.
difficulty: advanced
estMinutes: 75
contentVersion: 1.0.0
---

# GraphQL Subscriptions

## GraphQL Subscriptions

### Why It Matters

Real-time updates with subscriptions using WebSockets.

### Prerequisites

- Complete lesson 15 first.

### Topics

- Subscription type
- WebSocket transport
- PubSub events
- Filtering

### Key Concepts

- Subscriptions use WebSocket
- PubSub enables pub/sub
- Filters allow client filtering

```graphql
type Subscription { postAdded: Post }
```
Caption: GraphQL Subscriptions - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Not cleaning up subscriptions
- Too many events overwhelms

### Real-World Applications

- Live chat
- Real-time dashboards
- Collaborative editing

### Interview Questions

- Subscriptions vs queries?
- How does PubSub work?

### Mini Project

Add real-time subscription for new posts.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "GraphQL Subscriptions"?
  options:
    - Subscription type
    - WebSocket transport
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
  correctIndex: 0
  explanation: "The correct answer is: Subscription type"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It requires a paid commercial license to use
    - It is only supported on Linux operating systems
    - It was deprecated in the latest version
    - Subscriptions use WebSocket
  correctIndex: 3
  explanation: "The correct answer is: Subscriptions use WebSocket"
- id: q3
  question: Which of the following best describes a concept from "GraphQL Subscriptions"?
  options:
    - It only works with specific hardware configurations
    - It requires root/administrator privileges
    - PubSub enables pub/sub
    - It is a legacy feature with no modern use
  correctIndex: 2
  explanation: "The correct answer is: PubSub enables pub/sub"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - It applies exclusively to web development
    - Filters allow client filtering
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
  correctIndex: 1
  explanation: "The correct answer is: Filters allow client filtering"
- id: q5
  question: Which of the following is a core topic in "GraphQL Subscriptions"?
  options:
    - WebSocket transport
    - Subscription type
    - Writing device drivers
    - Managing database migrations
  correctIndex: 0
  explanation: "The correct answer is: WebSocket transport"
- id: q6
  question: What is a common pitfall related to "GraphQL Subscriptions"?
  options:
    - Too many events overwhelms
    - Naming variables with lowercase letters
    - Using version control for the project
    - Not cleaning up subscriptions
  correctIndex: 3
  explanation: "The correct answer is: Not cleaning up subscriptions"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Using descriptive variable names
    - Following established coding conventions
    - Too many events overwhelms
    - Testing code before deployment
  correctIndex: 2
  explanation: "The correct answer is: Too many events overwhelms"
- id: q8
  question: In what real-world scenario would you use the concepts from "GraphQL Subscriptions"?
  options:
    - Composing orchestral music scores
    - Live chat
    - Real-time dashboards
    - Writing poetry and creative fiction
  correctIndex: 1
  explanation: "The correct answer is: Live chat"
- id: q9
  question: Which of the following is a relevant interview question about "GraphQL Subscriptions"?
  options:
    - Subscriptions vs queries?
    - How does PubSub work?
    - How many planets are in the solar system?
    - What year was the company founded?
  correctIndex: 0
  explanation: "The correct answer is: Subscriptions vs queries?"
- id: q10
  question: Why does "GraphQL Subscriptions" matter in real-world practice?
  options:
    - It is a purely theoretical concept with no practical use
    - It was important historically but is no longer relevant
    - It is only used by academic researchers, not industry
    - Real-time updates with subscriptions using WebSockets.
  correctIndex: 3
  explanation: "The correct answer is: Real-time updates with subscriptions using WebSockets."
```

