---
slug: terraform-conditionals-loops
id: terraform-07
track: terraform
order: 7
title: Conditionals and Loops
description: Use count, for_each, for expressions, dynamic blocks.
difficulty: beginner
estMinutes: 70
contentVersion: 1.0.0
---

# Conditionals and Loops

## Conditionals and Loops

### Why It Matters

Use count, for_each, for expressions, dynamic blocks.

### Prerequisites

- Complete lesson 06 first.

### Topics

- count for conditional resources
- for_each for map-based resources
- for expressions for transformation
- dynamic blocks

### Key Concepts

- count=0 creates zero resources conditional
- for_each iterates over maps or sets
- for expressions transform lists and maps

```hcl
resource aws_instance app { count = var.env == prod ? 3 : 1 }
```
Caption: Conditionals and Loops - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Using count when for_each is needed
- Complex conditionals hard to read

### Real-World Applications

- Multi-environment setups
- Dynamic security groups
- Conditional resource creation

### Interview Questions

- count vs for_each?
- Dynamic blocks purpose?

### Mini Project

Create Terraform config with conditional resources and dynamic blocks.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "Conditionals and Loops"?
  options:
    - for_each for map-based resources
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
    - count for conditional resources
  correctIndex: 3
  explanation: "The correct answer is: count for conditional resources"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It is only supported on Linux operating systems
    - It was deprecated in the latest version
    - count=0 creates zero resources conditional
    - It requires a paid commercial license to use
  correctIndex: 2
  explanation: "The correct answer is: count=0 creates zero resources conditional"
- id: q3
  question: Which of the following best describes a concept from "Conditionals and Loops"?
  options:
    - It requires root/administrator privileges
    - for_each iterates over maps or sets
    - It is a legacy feature with no modern use
    - It only works with specific hardware configurations
  correctIndex: 1
  explanation: "The correct answer is: for_each iterates over maps or sets"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - for expressions transform lists and maps
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
    - It applies exclusively to web development
  correctIndex: 0
  explanation: "The correct answer is: for expressions transform lists and maps"
- id: q5
  question: Which of the following is a core topic in "Conditionals and Loops"?
  options:
    - count for conditional resources
    - Writing device drivers
    - Managing database migrations
    - for_each for map-based resources
  correctIndex: 3
  explanation: "The correct answer is: for_each for map-based resources"
- id: q6
  question: What is a common pitfall related to "Conditionals and Loops"?
  options:
    - Naming variables with lowercase letters
    - Using version control for the project
    - Using count when for_each is needed
    - Complex conditionals hard to read
  correctIndex: 2
  explanation: "The correct answer is: Using count when for_each is needed"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Following established coding conventions
    - Complex conditionals hard to read
    - Testing code before deployment
    - Using descriptive variable names
  correctIndex: 1
  explanation: "The correct answer is: Complex conditionals hard to read"
- id: q8
  question: In what real-world scenario would you use the concepts from "Conditionals and Loops"?
  options:
    - Multi-environment setups
    - Dynamic security groups
    - Writing poetry and creative fiction
    - Composing orchestral music scores
  correctIndex: 0
  explanation: "The correct answer is: Multi-environment setups"
- id: q9
  question: Which of the following is a relevant interview question about "Conditionals and Loops"?
  options:
    - Dynamic blocks purpose?
    - How many planets are in the solar system?
    - What year was the company founded?
    - count vs for_each?
  correctIndex: 3
  explanation: "The correct answer is: count vs for_each?"
- id: q10
  question: Why does "Conditionals and Loops" matter in real-world practice?
  options:
    - It was important historically but is no longer relevant
    - It is only used by academic researchers, not industry
    - Use count, for_each, for expressions, dynamic blocks.
    - It is a purely theoretical concept with no practical use
  correctIndex: 2
  explanation: "The correct answer is: Use count, for_each, for expressions, dynamic blocks."
```

