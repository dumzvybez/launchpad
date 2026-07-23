---
slug: terraform-data-sources
id: terraform-11
track: terraform
order: 11
title: Data Sources
description: Query existing infrastructure with data sources for dynamic config.
difficulty: intermediate
estMinutes: 65
contentVersion: 1.0.0
---

# Data Sources

## Data Sources

### Why It Matters

Query existing infrastructure with data sources for dynamic config.

### Prerequisites

- Complete lesson 10 first.

### Topics

- Data source syntax
- Common data sources aws_ami aws_vpc
- Using data sources for AMI lookup
- Combining with resources

### Key Concepts

- Data sources READ existing infrastructure do not create
- Useful for finding latest AMIs or existing VPCs
- Fetched at plan time

```hcl
data aws_ami linux { most_recent = true }
```
Caption: Data Sources - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Using data sources for managed resources
- Not filtering data sources

### Real-World Applications

- Dynamic AMI selection
- Referencing shared infrastructure
- Multi-account setups

### Interview Questions

- Data source vs resource?
- When to use data sources?

### Mini Project

Use data sources to find the latest AMI and deploy an instance.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "Data Sources"?
  options:
    - Common data sources aws_ami aws_vpc
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
    - Data source syntax
  correctIndex: 3
  explanation: "The correct answer is: Data source syntax"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It is only supported on Linux operating systems
    - It was deprecated in the latest version
    - Data sources READ existing infrastructure do not create
    - It requires a paid commercial license to use
  correctIndex: 2
  explanation: "The correct answer is: Data sources READ existing infrastructure do not create"
- id: q3
  question: Which of the following best describes a concept from "Data Sources"?
  options:
    - It requires root/administrator privileges
    - Useful for finding latest AMIs or existing VPCs
    - It is a legacy feature with no modern use
    - It only works with specific hardware configurations
  correctIndex: 1
  explanation: "The correct answer is: Useful for finding latest AMIs or existing VPCs"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - Fetched at plan time
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
    - It applies exclusively to web development
  correctIndex: 0
  explanation: "The correct answer is: Fetched at plan time"
- id: q5
  question: Which of the following is a core topic in "Data Sources"?
  options:
    - Data source syntax
    - Writing device drivers
    - Managing database migrations
    - Common data sources aws_ami aws_vpc
  correctIndex: 3
  explanation: "The correct answer is: Common data sources aws_ami aws_vpc"
- id: q6
  question: What is a common pitfall related to "Data Sources"?
  options:
    - Naming variables with lowercase letters
    - Using version control for the project
    - Using data sources for managed resources
    - Not filtering data sources
  correctIndex: 2
  explanation: "The correct answer is: Using data sources for managed resources"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Following established coding conventions
    - Not filtering data sources
    - Testing code before deployment
    - Using descriptive variable names
  correctIndex: 1
  explanation: "The correct answer is: Not filtering data sources"
- id: q8
  question: In what real-world scenario would you use the concepts from "Data Sources"?
  options:
    - Dynamic AMI selection
    - Referencing shared infrastructure
    - Writing poetry and creative fiction
    - Composing orchestral music scores
  correctIndex: 0
  explanation: "The correct answer is: Dynamic AMI selection"
- id: q9
  question: Which of the following is a relevant interview question about "Data Sources"?
  options:
    - When to use data sources?
    - How many planets are in the solar system?
    - What year was the company founded?
    - Data source vs resource?
  correctIndex: 3
  explanation: "The correct answer is: Data source vs resource?"
- id: q10
  question: Why does "Data Sources" matter in real-world practice?
  options:
    - It was important historically but is no longer relevant
    - It is only used by academic researchers, not industry
    - Query existing infrastructure with data sources for dynamic config.
    - It is a purely theoretical concept with no practical use
  correctIndex: 2
  explanation: "The correct answer is: Query existing infrastructure with data sources for dynamic config."
```

