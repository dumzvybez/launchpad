---
slug: kubernetes-statefulsets-persistent-volumes
id: kubernetes-17
track: kubernetes
order: 17
title: StatefulSets and Persistent Volumes
description: Run stateful apps with StatefulSets and PVs.
difficulty: advanced
estMinutes: 75
contentVersion: 1.0.0
---

# StatefulSets and Persistent Volumes

## StatefulSets and Persistent Volumes

### Why It Matters

Run stateful apps with StatefulSets and PVs.

### Prerequisites

- Complete lesson 16 first.

### Topics

- StatefulSet vs Deployment
- PV and PVC
- StorageClasses
- Snapshots

### Key Concepts

- StatefulSets stable identity storage
- PV cluster resource PVC user request
- StorageClasses dynamic provisioning

```yaml
kind: StatefulSet spec: volumeClaimTemplates:
```
Caption: StatefulSets and Persistent Volumes - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Deployments for stateful apps
- No volumeClaimTemplates

### Real-World Applications

- Database clusters
- Message queues
- Distributed file systems

### Interview Questions

- StatefulSet vs Deployment?
- When to use PVs?

### Mini Project

Deploy PostgreSQL StatefulSet with storage.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "StatefulSets and Persistent Volumes"?
  options:
    - StatefulSet vs Deployment
    - PV and PVC
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
  correctIndex: 0
  explanation: "The correct answer is: StatefulSet vs Deployment"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It requires a paid commercial license to use
    - It is only supported on Linux operating systems
    - It was deprecated in the latest version
    - StatefulSets stable identity storage
  correctIndex: 3
  explanation: "The correct answer is: StatefulSets stable identity storage"
- id: q3
  question: Which of the following best describes a concept from "StatefulSets and Persistent Volumes"?
  options:
    - It only works with specific hardware configurations
    - It requires root/administrator privileges
    - PV cluster resource PVC user request
    - It is a legacy feature with no modern use
  correctIndex: 2
  explanation: "The correct answer is: PV cluster resource PVC user request"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - It applies exclusively to web development
    - StorageClasses dynamic provisioning
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
  correctIndex: 1
  explanation: "The correct answer is: StorageClasses dynamic provisioning"
- id: q5
  question: Which of the following is a core topic in "StatefulSets and Persistent Volumes"?
  options:
    - PV and PVC
    - StatefulSet vs Deployment
    - Writing device drivers
    - Managing database migrations
  correctIndex: 0
  explanation: "The correct answer is: PV and PVC"
- id: q6
  question: What is a common pitfall related to "StatefulSets and Persistent Volumes"?
  options:
    - No volumeClaimTemplates
    - Naming variables with lowercase letters
    - Using version control for the project
    - Deployments for stateful apps
  correctIndex: 3
  explanation: "The correct answer is: Deployments for stateful apps"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Using descriptive variable names
    - Following established coding conventions
    - No volumeClaimTemplates
    - Testing code before deployment
  correctIndex: 2
  explanation: "The correct answer is: No volumeClaimTemplates"
- id: q8
  question: In what real-world scenario would you use the concepts from "StatefulSets and Persistent Volumes"?
  options:
    - Composing orchestral music scores
    - Database clusters
    - Message queues
    - Writing poetry and creative fiction
  correctIndex: 1
  explanation: "The correct answer is: Database clusters"
- id: q9
  question: Which of the following is a relevant interview question about "StatefulSets and Persistent Volumes"?
  options:
    - StatefulSet vs Deployment?
    - When to use PVs?
    - How many planets are in the solar system?
    - What year was the company founded?
  correctIndex: 0
  explanation: "The correct answer is: StatefulSet vs Deployment?"
- id: q10
  question: Why does "StatefulSets and Persistent Volumes" matter in real-world practice?
  options:
    - It is a purely theoretical concept with no practical use
    - It was important historically but is no longer relevant
    - It is only used by academic researchers, not industry
    - Run stateful apps with StatefulSets and PVs.
  correctIndex: 3
  explanation: "The correct answer is: Run stateful apps with StatefulSets and PVs."
```

