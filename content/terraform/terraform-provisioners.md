---
slug: terraform-provisioners
id: terraform-12
track: terraform
order: 12
title: Provisioners
description: "Run scripts with provisioners: local-exec, remote-exec, file."
difficulty: intermediate
estMinutes: 60
contentVersion: 1.0.0
---

# Provisioners

## Provisioners

### Why It Matters

Run scripts with provisioners: local-exec, remote-exec, file.

### Prerequisites

- Complete lesson 11 first.

### Topics

- local-exec provisioner
- remote-exec provisioner
- file provisioner
- Best practices and alternatives

### Key Concepts

- Provisioners run after resource creation
- local-exec runs on your machine
- Prefer user_data or cloud-init over provisioners

```hcl
provisioner local-exec { command = echo IP }
```
Caption: Provisioners - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Relying on provisioners instead of user_data
- Provisioners do not run on terraform destroy

### Real-World Applications

- Bootstrap configuration
- Triggering deployments
- File copying

### Interview Questions

- Why are provisioners last resort?
- local-exec vs remote-exec?

### Mini Project

Use user_data instead of provisioners for instance bootstrapping.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "Provisioners"?
  options:
    - remote-exec provisioner
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
    - local-exec provisioner
  correctIndex: 3
  explanation: "The correct answer is: local-exec provisioner"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It is only supported on Linux operating systems
    - It was deprecated in the latest version
    - Provisioners run after resource creation
    - It requires a paid commercial license to use
  correctIndex: 2
  explanation: "The correct answer is: Provisioners run after resource creation"
- id: q3
  question: Which of the following best describes a concept from "Provisioners"?
  options:
    - It requires root/administrator privileges
    - local-exec runs on your machine
    - It is a legacy feature with no modern use
    - It only works with specific hardware configurations
  correctIndex: 1
  explanation: "The correct answer is: local-exec runs on your machine"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - Prefer user_data or cloud-init over provisioners
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
    - It applies exclusively to web development
  correctIndex: 0
  explanation: "The correct answer is: Prefer user_data or cloud-init over provisioners"
- id: q5
  question: Which of the following is a core topic in "Provisioners"?
  options:
    - local-exec provisioner
    - Writing device drivers
    - Managing database migrations
    - remote-exec provisioner
  correctIndex: 3
  explanation: "The correct answer is: remote-exec provisioner"
- id: q6
  question: What is a common pitfall related to "Provisioners"?
  options:
    - Naming variables with lowercase letters
    - Using version control for the project
    - Relying on provisioners instead of user_data
    - Provisioners do not run on terraform destroy
  correctIndex: 2
  explanation: "The correct answer is: Relying on provisioners instead of user_data"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Following established coding conventions
    - Provisioners do not run on terraform destroy
    - Testing code before deployment
    - Using descriptive variable names
  correctIndex: 1
  explanation: "The correct answer is: Provisioners do not run on terraform destroy"
- id: q8
  question: In what real-world scenario would you use the concepts from "Provisioners"?
  options:
    - Bootstrap configuration
    - Triggering deployments
    - Writing poetry and creative fiction
    - Composing orchestral music scores
  correctIndex: 0
  explanation: "The correct answer is: Bootstrap configuration"
- id: q9
  question: Which of the following is a relevant interview question about "Provisioners"?
  options:
    - local-exec vs remote-exec?
    - How many planets are in the solar system?
    - What year was the company founded?
    - Why are provisioners last resort?
  correctIndex: 3
  explanation: "The correct answer is: Why are provisioners last resort?"
- id: q10
  question: Why does "Provisioners" matter in real-world practice?
  options:
    - It was important historically but is no longer relevant
    - It is only used by academic researchers, not industry
    - "Run scripts with provisioners: local-exec, remote-exec, file."
    - It is a purely theoretical concept with no practical use
  correctIndex: 2
  explanation: "The correct answer is: Run scripts with provisioners: local-exec, remote-exec, file."
```

