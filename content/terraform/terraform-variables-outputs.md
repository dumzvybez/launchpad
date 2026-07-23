---
slug: terraform-variables-outputs
id: terraform-06
track: terraform
order: 6
title: Variables and Outputs
description: Make configs reusable with variables and outputs.
difficulty: beginner
estMinutes: 65
contentVersion: 1.0.0
---

# Variables and Outputs

## Variables and Outputs

### Why It Matters

Make configs reusable with variables and outputs.

### Prerequisites

- Complete lesson 05 first.

### Topics

- Input variable types string number list map
- Variable validation
- Output values
- Local variables

### Key Concepts

- Variables make configs reusable across environments
- Output values expose useful info after apply
- Local variables reduce repetition

```hcl
variable instance_count { type = number default = 2 }
```
Caption: Variables and Outputs - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Not validating variable inputs
- Hardcoding values instead of using variables

### Real-World Applications

- Multi-environment deployments
- Reusable modules
- Team collaboration

### Interview Questions

- Variables vs locals?
- What is variable validation?

### Mini Project

Create parameterized Terraform configuration with variables and outputs.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "Variables and Outputs"?
  options:
    - Variable validation
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
    - Input variable types string number list map
  correctIndex: 3
  explanation: "The correct answer is: Input variable types string number list map"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It is only supported on Linux operating systems
    - It was deprecated in the latest version
    - Variables make configs reusable across environments
    - It requires a paid commercial license to use
  correctIndex: 2
  explanation: "The correct answer is: Variables make configs reusable across environments"
- id: q3
  question: Which of the following best describes a concept from "Variables and Outputs"?
  options:
    - It requires root/administrator privileges
    - Output values expose useful info after apply
    - It is a legacy feature with no modern use
    - It only works with specific hardware configurations
  correctIndex: 1
  explanation: "The correct answer is: Output values expose useful info after apply"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - Local variables reduce repetition
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
    - It applies exclusively to web development
  correctIndex: 0
  explanation: "The correct answer is: Local variables reduce repetition"
- id: q5
  question: Which of the following is a core topic in "Variables and Outputs"?
  options:
    - Input variable types string number list map
    - Writing device drivers
    - Managing database migrations
    - Variable validation
  correctIndex: 3
  explanation: "The correct answer is: Variable validation"
- id: q6
  question: What is a common pitfall related to "Variables and Outputs"?
  options:
    - Naming variables with lowercase letters
    - Using version control for the project
    - Not validating variable inputs
    - Hardcoding values instead of using variables
  correctIndex: 2
  explanation: "The correct answer is: Not validating variable inputs"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Following established coding conventions
    - Hardcoding values instead of using variables
    - Testing code before deployment
    - Using descriptive variable names
  correctIndex: 1
  explanation: "The correct answer is: Hardcoding values instead of using variables"
- id: q8
  question: In what real-world scenario would you use the concepts from "Variables and Outputs"?
  options:
    - Multi-environment deployments
    - Reusable modules
    - Writing poetry and creative fiction
    - Composing orchestral music scores
  correctIndex: 0
  explanation: "The correct answer is: Multi-environment deployments"
- id: q9
  question: Which of the following is a relevant interview question about "Variables and Outputs"?
  options:
    - What is variable validation?
    - How many planets are in the solar system?
    - What year was the company founded?
    - Variables vs locals?
  correctIndex: 3
  explanation: "The correct answer is: Variables vs locals?"
- id: q10
  question: Why does "Variables and Outputs" matter in real-world practice?
  options:
    - It was important historically but is no longer relevant
    - It is only used by academic researchers, not industry
    - Make configs reusable with variables and outputs.
    - It is a purely theoretical concept with no practical use
  correctIndex: 2
  explanation: "The correct answer is: Make configs reusable with variables and outputs."
```

