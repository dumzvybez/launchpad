---
slug: terraform-security-best-practices
id: terraform-14
track: terraform
order: 14
title: Security Best Practices
description: "Secure infrastructure: least privilege IAM, secrets, encryption, scanning."
difficulty: intermediate
estMinutes: 70
contentVersion: 1.0.0
---

# Security Best Practices

## Security Best Practices

### Why It Matters

Secure infrastructure: least privilege IAM, secrets, encryption, scanning.

### Prerequisites

- Complete lesson 13 first.

### Topics

- IAM least privilege
- Secrets management
- Encryption at rest and in transit
- tfsec for security scanning

### Key Concepts

- Never hardcode secrets in .tf files
- Use IAM roles instead of access keys
- tfsec scans for common security issues

```hcl
variable db_password { sensitive = true }
```
Caption: Security Best Practices - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Hardcoding secrets in .tf files
- Using star in IAM policies over-permissive

### Real-World Applications

- Compliance requirements
- Production infrastructure
- Multi-tenant environments

### Interview Questions

- Why no hardcoded secrets?
- IAM least privilege?

### Mini Project

Set up secure secret management using AWS Secrets Manager.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "Security Best Practices"?
  options:
    - Secrets management
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
    - IAM least privilege
  correctIndex: 3
  explanation: "The correct answer is: IAM least privilege"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It is only supported on Linux operating systems
    - It was deprecated in the latest version
    - Never hardcode secrets in .tf files
    - It requires a paid commercial license to use
  correctIndex: 2
  explanation: "The correct answer is: Never hardcode secrets in .tf files"
- id: q3
  question: Which of the following best describes a concept from "Security Best Practices"?
  options:
    - It requires root/administrator privileges
    - Use IAM roles instead of access keys
    - It is a legacy feature with no modern use
    - It only works with specific hardware configurations
  correctIndex: 1
  explanation: "The correct answer is: Use IAM roles instead of access keys"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - tfsec scans for common security issues
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
    - It applies exclusively to web development
  correctIndex: 0
  explanation: "The correct answer is: tfsec scans for common security issues"
- id: q5
  question: Which of the following is a core topic in "Security Best Practices"?
  options:
    - IAM least privilege
    - Writing device drivers
    - Managing database migrations
    - Secrets management
  correctIndex: 3
  explanation: "The correct answer is: Secrets management"
- id: q6
  question: What is a common pitfall related to "Security Best Practices"?
  options:
    - Naming variables with lowercase letters
    - Using version control for the project
    - Hardcoding secrets in .tf files
    - Using star in IAM policies over-permissive
  correctIndex: 2
  explanation: "The correct answer is: Hardcoding secrets in .tf files"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Following established coding conventions
    - Using star in IAM policies over-permissive
    - Testing code before deployment
    - Using descriptive variable names
  correctIndex: 1
  explanation: "The correct answer is: Using star in IAM policies over-permissive"
- id: q8
  question: In what real-world scenario would you use the concepts from "Security Best Practices"?
  options:
    - Compliance requirements
    - Production infrastructure
    - Writing poetry and creative fiction
    - Composing orchestral music scores
  correctIndex: 0
  explanation: "The correct answer is: Compliance requirements"
- id: q9
  question: Which of the following is a relevant interview question about "Security Best Practices"?
  options:
    - IAM least privilege?
    - How many planets are in the solar system?
    - What year was the company founded?
    - Why no hardcoded secrets?
  correctIndex: 3
  explanation: "The correct answer is: Why no hardcoded secrets?"
- id: q10
  question: Why does "Security Best Practices" matter in real-world practice?
  options:
    - It was important historically but is no longer relevant
    - It is only used by academic researchers, not industry
    - "Secure infrastructure: least privilege IAM, secrets, encryption, scanning."
    - It is a purely theoretical concept with no practical use
  correctIndex: 2
  explanation: "The correct answer is: Secure infrastructure: least privilege IAM, secrets, encryption, scanning."
```

