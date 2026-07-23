---
slug: kubernetes-configmaps-secrets
id: kubernetes-16
track: kubernetes
order: 16
title: ConfigMaps and Secrets
description: Manage configuration and sensitive data.
difficulty: advanced
estMinutes: 70
contentVersion: 1.0.0
---

# ConfigMaps and Secrets

## ConfigMaps and Secrets

### Why It Matters

Manage configuration and sensitive data.

### Prerequisites

- Complete lesson 15 first.

### Topics

- ConfigMap creation
- Secret creation
- Env var injection
- Volume mounting

### Key Concepts

- ConfigMaps non-sensitive
- Secrets sensitive base64
- Both as env or files

```yaml
apiVersion: v1 kind: ConfigMap
```
Caption: ConfigMaps and Secrets - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Storing sensitive in ConfigMaps
- Not encrypting Secrets

### Real-World Applications

- Env-specific config
- DB credentials
- Feature flags

### Interview Questions

- ConfigMap vs Secret?
- How to consume in Pods?

### Mini Project

Create ConfigMap and Secret use in Pod.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "ConfigMaps and Secrets"?
  options:
    - ConfigMap creation
    - Secret creation
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
  correctIndex: 0
  explanation: "The correct answer is: ConfigMap creation"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It requires a paid commercial license to use
    - It is only supported on Linux operating systems
    - It was deprecated in the latest version
    - ConfigMaps non-sensitive
  correctIndex: 3
  explanation: "The correct answer is: ConfigMaps non-sensitive"
- id: q3
  question: Which of the following best describes a concept from "ConfigMaps and Secrets"?
  options:
    - It only works with specific hardware configurations
    - It requires root/administrator privileges
    - Secrets sensitive base64
    - It is a legacy feature with no modern use
  correctIndex: 2
  explanation: "The correct answer is: Secrets sensitive base64"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - It applies exclusively to web development
    - Both as env or files
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
  correctIndex: 1
  explanation: "The correct answer is: Both as env or files"
- id: q5
  question: Which of the following is a core topic in "ConfigMaps and Secrets"?
  options:
    - Secret creation
    - ConfigMap creation
    - Writing device drivers
    - Managing database migrations
  correctIndex: 0
  explanation: "The correct answer is: Secret creation"
- id: q6
  question: What is a common pitfall related to "ConfigMaps and Secrets"?
  options:
    - Not encrypting Secrets
    - Naming variables with lowercase letters
    - Using version control for the project
    - Storing sensitive in ConfigMaps
  correctIndex: 3
  explanation: "The correct answer is: Storing sensitive in ConfigMaps"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Using descriptive variable names
    - Following established coding conventions
    - Not encrypting Secrets
    - Testing code before deployment
  correctIndex: 2
  explanation: "The correct answer is: Not encrypting Secrets"
- id: q8
  question: In what real-world scenario would you use the concepts from "ConfigMaps and Secrets"?
  options:
    - Composing orchestral music scores
    - Env-specific config
    - DB credentials
    - Writing poetry and creative fiction
  correctIndex: 1
  explanation: "The correct answer is: Env-specific config"
- id: q9
  question: Which of the following is a relevant interview question about "ConfigMaps and Secrets"?
  options:
    - ConfigMap vs Secret?
    - How to consume in Pods?
    - How many planets are in the solar system?
    - What year was the company founded?
  correctIndex: 0
  explanation: "The correct answer is: ConfigMap vs Secret?"
- id: q10
  question: Why does "ConfigMaps and Secrets" matter in real-world practice?
  options:
    - It is a purely theoretical concept with no practical use
    - It was important historically but is no longer relevant
    - It is only used by academic researchers, not industry
    - Manage configuration and sensitive data.
  correctIndex: 3
  explanation: "The correct answer is: Manage configuration and sensitive data."
```

