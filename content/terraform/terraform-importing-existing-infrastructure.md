---
slug: terraform-importing-existing-infrastructure
id: terraform-18
track: terraform
order: 18
title: Importing Existing Infrastructure
description: Bring existing cloud resources under Terraform management.
difficulty: advanced
estMinutes: 65
contentVersion: 1.0.0
---

# Importing Existing Infrastructure

## Importing Existing Infrastructure

### Why It Matters

Bring existing cloud resources under Terraform management.

### Prerequisites

- Complete lesson 17 first.

### Topics

- terraform import command
- Importing complex resources
- Generating config with tfreplace
- Gradual adoption strategy

### Key Concepts

- terraform import adds resources to state without creating
- Must manually write matching configuration
- Gradual adoption start with new then import existing

```hcl
terraform import aws_instance.web i-12345678
```
Caption: Importing Existing Infrastructure - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Importing resources without writing matching config
- Importing production resources without testing

### Real-World Applications

- Adopting Terraform for existing infra
- Migrating from manual cloud management
- Consolidating infrastructure

### Interview Questions

- What does import NOT do?
- Gradual adoption strategy?

### Mini Project

Import an existing EC2 instance and write matching Terraform config.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "Importing Existing Infrastructure"?
  options:
    - Importing complex resources
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
    - terraform import command
  correctIndex: 3
  explanation: "The correct answer is: terraform import command"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It is only supported on Linux operating systems
    - It was deprecated in the latest version
    - terraform import adds resources to state without creating
    - It requires a paid commercial license to use
  correctIndex: 2
  explanation: "The correct answer is: terraform import adds resources to state without creating"
- id: q3
  question: Which of the following best describes a concept from "Importing Existing Infrastructure"?
  options:
    - It requires root/administrator privileges
    - Must manually write matching configuration
    - It is a legacy feature with no modern use
    - It only works with specific hardware configurations
  correctIndex: 1
  explanation: "The correct answer is: Must manually write matching configuration"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - Gradual adoption start with new then import existing
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
    - It applies exclusively to web development
  correctIndex: 0
  explanation: "The correct answer is: Gradual adoption start with new then import existing"
- id: q5
  question: Which of the following is a core topic in "Importing Existing Infrastructure"?
  options:
    - terraform import command
    - Writing device drivers
    - Managing database migrations
    - Importing complex resources
  correctIndex: 3
  explanation: "The correct answer is: Importing complex resources"
- id: q6
  question: What is a common pitfall related to "Importing Existing Infrastructure"?
  options:
    - Naming variables with lowercase letters
    - Using version control for the project
    - Importing resources without writing matching config
    - Importing production resources without testing
  correctIndex: 2
  explanation: "The correct answer is: Importing resources without writing matching config"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Following established coding conventions
    - Importing production resources without testing
    - Testing code before deployment
    - Using descriptive variable names
  correctIndex: 1
  explanation: "The correct answer is: Importing production resources without testing"
- id: q8
  question: In what real-world scenario would you use the concepts from "Importing Existing Infrastructure"?
  options:
    - Adopting Terraform for existing infra
    - Migrating from manual cloud management
    - Writing poetry and creative fiction
    - Composing orchestral music scores
  correctIndex: 0
  explanation: "The correct answer is: Adopting Terraform for existing infra"
- id: q9
  question: Which of the following is a relevant interview question about "Importing Existing Infrastructure"?
  options:
    - Gradual adoption strategy?
    - How many planets are in the solar system?
    - What year was the company founded?
    - What does import NOT do?
  correctIndex: 3
  explanation: "The correct answer is: What does import NOT do?"
- id: q10
  question: Why does "Importing Existing Infrastructure" matter in real-world practice?
  options:
    - It was important historically but is no longer relevant
    - It is only used by academic researchers, not industry
    - Bring existing cloud resources under Terraform management.
    - It is a purely theoretical concept with no practical use
  correctIndex: 2
  explanation: "The correct answer is: Bring existing cloud resources under Terraform management."
```

