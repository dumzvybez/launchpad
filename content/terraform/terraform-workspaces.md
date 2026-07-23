---
slug: terraform-workspaces
id: terraform-10
track: terraform
order: 10
title: Workspaces
description: Manage multiple environments from a single configuration.
difficulty: intermediate
estMinutes: 65
contentVersion: 1.0.0
---

# Workspaces

## Workspaces

### Why It Matters

Manage multiple environments from a single configuration.

### Prerequisites

- Complete lesson 09 first.

### Topics

- Workspace creation and switching
- Workspace-specific variables
- State isolation
- Workspaces vs directories

### Key Concepts

- Workspaces share config but separate state
- terraform.workspace returns current name
- Good for similar environments

```hcl
terraform workspace new prod
```
Caption: Workspaces - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Workspaces for very different environments use dirs
- Forgetting to select workspace before apply

### Real-World Applications

- Dev staging prod environments
- Feature branch environments
- Testing changes

### Interview Questions

- Workspaces vs directories?
- When to use workspaces?

### Mini Project

Set up workspaces for dev staging and prod environments.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "Workspaces"?
  options:
    - Workspace-specific variables
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
    - Workspace creation and switching
  correctIndex: 3
  explanation: "The correct answer is: Workspace creation and switching"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It is only supported on Linux operating systems
    - It was deprecated in the latest version
    - Workspaces share config but separate state
    - It requires a paid commercial license to use
  correctIndex: 2
  explanation: "The correct answer is: Workspaces share config but separate state"
- id: q3
  question: Which of the following best describes a concept from "Workspaces"?
  options:
    - It requires root/administrator privileges
    - terraform.workspace returns current name
    - It is a legacy feature with no modern use
    - It only works with specific hardware configurations
  correctIndex: 1
  explanation: "The correct answer is: terraform.workspace returns current name"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - Good for similar environments
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
    - It applies exclusively to web development
  correctIndex: 0
  explanation: "The correct answer is: Good for similar environments"
- id: q5
  question: Which of the following is a core topic in "Workspaces"?
  options:
    - Workspace creation and switching
    - Writing device drivers
    - Managing database migrations
    - Workspace-specific variables
  correctIndex: 3
  explanation: "The correct answer is: Workspace-specific variables"
- id: q6
  question: What is a common pitfall related to "Workspaces"?
  options:
    - Naming variables with lowercase letters
    - Using version control for the project
    - Workspaces for very different environments use dirs
    - Forgetting to select workspace before apply
  correctIndex: 2
  explanation: "The correct answer is: Workspaces for very different environments use dirs"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Following established coding conventions
    - Forgetting to select workspace before apply
    - Testing code before deployment
    - Using descriptive variable names
  correctIndex: 1
  explanation: "The correct answer is: Forgetting to select workspace before apply"
- id: q8
  question: In what real-world scenario would you use the concepts from "Workspaces"?
  options:
    - Dev staging prod environments
    - Feature branch environments
    - Writing poetry and creative fiction
    - Composing orchestral music scores
  correctIndex: 0
  explanation: "The correct answer is: Dev staging prod environments"
- id: q9
  question: Which of the following is a relevant interview question about "Workspaces"?
  options:
    - When to use workspaces?
    - How many planets are in the solar system?
    - What year was the company founded?
    - Workspaces vs directories?
  correctIndex: 3
  explanation: "The correct answer is: Workspaces vs directories?"
- id: q10
  question: Why does "Workspaces" matter in real-world practice?
  options:
    - It was important historically but is no longer relevant
    - It is only used by academic researchers, not industry
    - Manage multiple environments from a single configuration.
    - It is a purely theoretical concept with no practical use
  correctIndex: 2
  explanation: "The correct answer is: Manage multiple environments from a single configuration."
```

