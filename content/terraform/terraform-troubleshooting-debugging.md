---
slug: terraform-troubleshooting-debugging
id: terraform-20
track: terraform
order: 20
title: Troubleshooting and Debugging
description: "Debug common issues: state conflicts, cycles, provider errors, recovery."
difficulty: advanced
estMinutes: 65
contentVersion: 1.0.0
---

# Troubleshooting and Debugging

## Troubleshooting and Debugging

### Why It Matters

Debug common issues: state conflicts, cycles, provider errors, recovery.

### Prerequisites

- Complete lesson 19 first.

### Topics

- State lock conflicts
- Dependency cycle errors
- Provider plugin errors
- State commands for recovery

### Key Concepts

- State locks can be force-unlocked risky
- Dependency cycles must be resolved in config
- TF_LOG=DEBUG enables verbose logging

```hcl
terraform state list; terraform state show aws_instance.web
```
Caption: Troubleshooting and Debugging - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Using force-unlock when another run is active
- Not backing up state before manipulation

### Real-World Applications

- Production incident recovery
- State management
- Debugging deployment failures

### Interview Questions

- Resolve state lock?
- TF_LOG levels?

### Mini Project

Practice state management commands for troubleshooting.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "Troubleshooting and Debugging"?
  options:
    - Dependency cycle errors
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
    - State lock conflicts
  correctIndex: 3
  explanation: "The correct answer is: State lock conflicts"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It is only supported on Linux operating systems
    - It was deprecated in the latest version
    - State locks can be force-unlocked risky
    - It requires a paid commercial license to use
  correctIndex: 2
  explanation: "The correct answer is: State locks can be force-unlocked risky"
- id: q3
  question: Which of the following best describes a concept from "Troubleshooting and Debugging"?
  options:
    - It requires root/administrator privileges
    - Dependency cycles must be resolved in config
    - It is a legacy feature with no modern use
    - It only works with specific hardware configurations
  correctIndex: 1
  explanation: "The correct answer is: Dependency cycles must be resolved in config"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - TF_LOG=DEBUG enables verbose logging
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
    - It applies exclusively to web development
  correctIndex: 0
  explanation: "The correct answer is: TF_LOG=DEBUG enables verbose logging"
- id: q5
  question: Which of the following is a core topic in "Troubleshooting and Debugging"?
  options:
    - State lock conflicts
    - Writing device drivers
    - Managing database migrations
    - Dependency cycle errors
  correctIndex: 3
  explanation: "The correct answer is: Dependency cycle errors"
- id: q6
  question: What is a common pitfall related to "Troubleshooting and Debugging"?
  options:
    - Naming variables with lowercase letters
    - Using version control for the project
    - Using force-unlock when another run is active
    - Not backing up state before manipulation
  correctIndex: 2
  explanation: "The correct answer is: Using force-unlock when another run is active"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Following established coding conventions
    - Not backing up state before manipulation
    - Testing code before deployment
    - Using descriptive variable names
  correctIndex: 1
  explanation: "The correct answer is: Not backing up state before manipulation"
- id: q8
  question: In what real-world scenario would you use the concepts from "Troubleshooting and Debugging"?
  options:
    - Production incident recovery
    - State management
    - Writing poetry and creative fiction
    - Composing orchestral music scores
  correctIndex: 0
  explanation: "The correct answer is: Production incident recovery"
- id: q9
  question: Which of the following is a relevant interview question about "Troubleshooting and Debugging"?
  options:
    - TF_LOG levels?
    - How many planets are in the solar system?
    - What year was the company founded?
    - Resolve state lock?
  correctIndex: 3
  explanation: "The correct answer is: Resolve state lock?"
- id: q10
  question: Why does "Troubleshooting and Debugging" matter in real-world practice?
  options:
    - It was important historically but is no longer relevant
    - It is only used by academic researchers, not industry
    - "Debug common issues: state conflicts, cycles, provider errors, recovery."
    - It is a purely theoretical concept with no practical use
  correctIndex: 2
  explanation: "The correct answer is: Debug common issues: state conflicts, cycles, provider errors, recovery."
```

