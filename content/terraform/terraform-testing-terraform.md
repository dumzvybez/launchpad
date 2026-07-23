---
slug: terraform-testing-terraform
id: terraform-13
track: terraform
order: 13
title: Testing Terraform
description: "Test code: validate, fmt, plan, Terratest, OPA."
difficulty: intermediate
estMinutes: 65
contentVersion: 1.0.0
---

# Testing Terraform

## Testing Terraform

### Why It Matters

Test code: validate, fmt, plan, Terratest, OPA.

### Prerequisites

- Complete lesson 12 first.

### Topics

- terraform validate and fmt
- terraform plan in CI
- Terratest for integration tests
- Open Policy Agent OPA

### Key Concepts

- validate checks syntax
- fmt ensures formatting
- Terratest runs real infrastructure tests
- OPA enforces policies

```hcl
terraform fmt -check; terraform validate; terraform plan
```
Caption: Testing Terraform - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Not running validate in CI
- Not cleaning up test infrastructure

### Real-World Applications

- CI/CD pipelines
- Infrastructure testing
- Policy enforcement

### Interview Questions

- validate vs plan?
- What is Terratest?

### Mini Project

Set up GitHub Actions workflow with Terraform validation and plan.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "Testing Terraform"?
  options:
    - terraform plan in CI
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
    - terraform validate and fmt
  correctIndex: 3
  explanation: "The correct answer is: terraform validate and fmt"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It is only supported on Linux operating systems
    - It was deprecated in the latest version
    - validate checks syntax
    - It requires a paid commercial license to use
  correctIndex: 2
  explanation: "The correct answer is: validate checks syntax"
- id: q3
  question: Which of the following best describes a concept from "Testing Terraform"?
  options:
    - It requires root/administrator privileges
    - fmt ensures formatting
    - It is a legacy feature with no modern use
    - It only works with specific hardware configurations
  correctIndex: 1
  explanation: "The correct answer is: fmt ensures formatting"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - Terratest runs real infrastructure tests
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
    - It applies exclusively to web development
  correctIndex: 0
  explanation: "The correct answer is: Terratest runs real infrastructure tests"
- id: q5
  question: Which of the following is a core topic in "Testing Terraform"?
  options:
    - terraform validate and fmt
    - Writing device drivers
    - Managing database migrations
    - terraform plan in CI
  correctIndex: 3
  explanation: "The correct answer is: terraform plan in CI"
- id: q6
  question: What is a common pitfall related to "Testing Terraform"?
  options:
    - Naming variables with lowercase letters
    - Using version control for the project
    - Not running validate in CI
    - Not cleaning up test infrastructure
  correctIndex: 2
  explanation: "The correct answer is: Not running validate in CI"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Following established coding conventions
    - Not cleaning up test infrastructure
    - Testing code before deployment
    - Using descriptive variable names
  correctIndex: 1
  explanation: "The correct answer is: Not cleaning up test infrastructure"
- id: q8
  question: In what real-world scenario would you use the concepts from "Testing Terraform"?
  options:
    - CI/CD pipelines
    - Infrastructure testing
    - Writing poetry and creative fiction
    - Composing orchestral music scores
  correctIndex: 0
  explanation: "The correct answer is: CI/CD pipelines"
- id: q9
  question: Which of the following is a relevant interview question about "Testing Terraform"?
  options:
    - What is Terratest?
    - How many planets are in the solar system?
    - What year was the company founded?
    - validate vs plan?
  correctIndex: 3
  explanation: "The correct answer is: validate vs plan?"
- id: q10
  question: Why does "Testing Terraform" matter in real-world practice?
  options:
    - It was important historically but is no longer relevant
    - It is only used by academic researchers, not industry
    - "Test code: validate, fmt, plan, Terratest, OPA."
    - It is a purely theoretical concept with no practical use
  correctIndex: 2
  explanation: "The correct answer is: Test code: validate, fmt, plan, Terratest, OPA."
```

