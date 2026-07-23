---
slug: tensorflow-keras-sequential-functional-api
id: tensorflow-07
track: tensorflow
order: 7
title: Keras Sequential and Functional API
description: "Build networks: Sequential, Functional API, Model subclassing."
difficulty: beginner
estMinutes: 70
contentVersion: 1.0.0
---

# Keras Sequential and Functional API

## Keras Sequential and Functional API

### Why It Matters

Build networks: Sequential, Functional API, Model subclassing.

### Prerequisites

- Complete lesson 06 first.

### Topics

- Sequential for linear stacks
- Functional API for multi-input output
- Model subclassing for custom
- Layer types Dense Conv2D LSTM

### Key Concepts

- Sequential for linear model stacks
- Functional supports branching sharing multi-io
- Subclassing gives full control

```python
model = keras.Sequential([Dense(128, activation=relu), Dense(10)])
```
Caption: Keras Sequential and Functional API - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Using Sequential for models with branches
- Not naming layers hard to debug

### Real-World Applications

- Image classification
- Multi-modal models
- Transfer learning

### Interview Questions

- Functional vs Sequential?
- When to use subclassing?

### Mini Project

Build multi-input model using Functional API.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "Keras Sequential and Functional API"?
  options:
    - Functional API for multi-input output
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
    - Sequential for linear stacks
  correctIndex: 3
  explanation: "The correct answer is: Sequential for linear stacks"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It is only supported on Linux operating systems
    - It was deprecated in the latest version
    - Sequential for linear model stacks
    - It requires a paid commercial license to use
  correctIndex: 2
  explanation: "The correct answer is: Sequential for linear model stacks"
- id: q3
  question: Which of the following best describes a concept from "Keras Sequential and Functional API"?
  options:
    - It requires root/administrator privileges
    - Functional supports branching sharing multi-io
    - It is a legacy feature with no modern use
    - It only works with specific hardware configurations
  correctIndex: 1
  explanation: "The correct answer is: Functional supports branching sharing multi-io"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - Subclassing gives full control
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
    - It applies exclusively to web development
  correctIndex: 0
  explanation: "The correct answer is: Subclassing gives full control"
- id: q5
  question: Which of the following is a core topic in "Keras Sequential and Functional API"?
  options:
    - Sequential for linear stacks
    - Writing device drivers
    - Managing database migrations
    - Functional API for multi-input output
  correctIndex: 3
  explanation: "The correct answer is: Functional API for multi-input output"
- id: q6
  question: What is a common pitfall related to "Keras Sequential and Functional API"?
  options:
    - Naming variables with lowercase letters
    - Using version control for the project
    - Using Sequential for models with branches
    - Not naming layers hard to debug
  correctIndex: 2
  explanation: "The correct answer is: Using Sequential for models with branches"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Following established coding conventions
    - Not naming layers hard to debug
    - Testing code before deployment
    - Using descriptive variable names
  correctIndex: 1
  explanation: "The correct answer is: Not naming layers hard to debug"
- id: q8
  question: In what real-world scenario would you use the concepts from "Keras Sequential and Functional API"?
  options:
    - Image classification
    - Multi-modal models
    - Writing poetry and creative fiction
    - Composing orchestral music scores
  correctIndex: 0
  explanation: "The correct answer is: Image classification"
- id: q9
  question: Which of the following is a relevant interview question about "Keras Sequential and Functional API"?
  options:
    - When to use subclassing?
    - How many planets are in the solar system?
    - What year was the company founded?
    - Functional vs Sequential?
  correctIndex: 3
  explanation: "The correct answer is: Functional vs Sequential?"
- id: q10
  question: Why does "Keras Sequential and Functional API" matter in real-world practice?
  options:
    - It was important historically but is no longer relevant
    - It is only used by academic researchers, not industry
    - "Build networks: Sequential, Functional API, Model subclassing."
    - It is a purely theoretical concept with no practical use
  correctIndex: 2
  explanation: "The correct answer is: Build networks: Sequential, Functional API, Model subclassing."
```

