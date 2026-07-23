---
slug: terraform-ci-cd-terraform
id: terraform-15
track: terraform
order: 15
title: CI/CD with Terraform
description: "Integrate into CI/CD: GitHub Actions, Atlantis, plan apply workflow."
difficulty: advanced
estMinutes: 70
contentVersion: 1.0.0
---

# CI/CD with Terraform

## CI/CD with Terraform

### Why It Matters

Integrate into CI/CD: GitHub Actions, Atlantis, plan apply workflow.

### Prerequisites

- Complete lesson 14 first.

### Topics

- GitHub Actions for Terraform
- Branch-based environments
- Atlantis for PR automation
- Plan and apply workflow

### Key Concepts

- Run terraform plan on every PR
- Run terraform apply only on merge to main
- Atlantis automates plan apply via PR comments

```yaml
on: pull_request jobs: plan:
```
Caption: CI/CD with Terraform - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Running apply on every push
- Not reviewing plan output before apply

### Real-World Applications

- Infrastructure as Code CI/CD
- Pull request reviews
- Automated deployments

### Interview Questions

- Recommended CI/CD workflow?
- Atlantis purpose?

### Mini Project

Set up GitHub Actions workflow for Terraform plan on PR and apply on merge.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "CI/CD with Terraform"?
  options:
    - Branch-based environments
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
    - GitHub Actions for Terraform
  correctIndex: 3
  explanation: "The correct answer is: GitHub Actions for Terraform"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It is only supported on Linux operating systems
    - It was deprecated in the latest version
    - Run terraform plan on every PR
    - It requires a paid commercial license to use
  correctIndex: 2
  explanation: "The correct answer is: Run terraform plan on every PR"
- id: q3
  question: Which of the following best describes a concept from "CI/CD with Terraform"?
  options:
    - It requires root/administrator privileges
    - Run terraform apply only on merge to main
    - It is a legacy feature with no modern use
    - It only works with specific hardware configurations
  correctIndex: 1
  explanation: "The correct answer is: Run terraform apply only on merge to main"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - Atlantis automates plan apply via PR comments
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
    - It applies exclusively to web development
  correctIndex: 0
  explanation: "The correct answer is: Atlantis automates plan apply via PR comments"
- id: q5
  question: Which of the following is a core topic in "CI/CD with Terraform"?
  options:
    - GitHub Actions for Terraform
    - Writing device drivers
    - Managing database migrations
    - Branch-based environments
  correctIndex: 3
  explanation: "The correct answer is: Branch-based environments"
- id: q6
  question: What is a common pitfall related to "CI/CD with Terraform"?
  options:
    - Naming variables with lowercase letters
    - Using version control for the project
    - Running apply on every push
    - Not reviewing plan output before apply
  correctIndex: 2
  explanation: "The correct answer is: Running apply on every push"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Following established coding conventions
    - Not reviewing plan output before apply
    - Testing code before deployment
    - Using descriptive variable names
  correctIndex: 1
  explanation: "The correct answer is: Not reviewing plan output before apply"
- id: q8
  question: In what real-world scenario would you use the concepts from "CI/CD with Terraform"?
  options:
    - Infrastructure as Code CI/CD
    - Pull request reviews
    - Writing poetry and creative fiction
    - Composing orchestral music scores
  correctIndex: 0
  explanation: "The correct answer is: Infrastructure as Code CI/CD"
- id: q9
  question: Which of the following is a relevant interview question about "CI/CD with Terraform"?
  options:
    - Atlantis purpose?
    - How many planets are in the solar system?
    - What year was the company founded?
    - Recommended CI/CD workflow?
  correctIndex: 3
  explanation: "The correct answer is: Recommended CI/CD workflow?"
- id: q10
  question: Why does "CI/CD with Terraform" matter in real-world practice?
  options:
    - It was important historically but is no longer relevant
    - It is only used by academic researchers, not industry
    - "Integrate into CI/CD: GitHub Actions, Atlantis, plan apply workflow."
    - It is a purely theoretical concept with no practical use
  correctIndex: 2
  explanation: "The correct answer is: Integrate into CI/CD: GitHub Actions, Atlantis, plan apply workflow."
```

