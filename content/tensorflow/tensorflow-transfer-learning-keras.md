---
slug: tensorflow-transfer-learning-keras
id: tensorflow-08
track: tensorflow
order: 8
title: Transfer Learning with Keras
description: "Apply transfer learning: pretrained models, freeze, fine-tune."
difficulty: intermediate
estMinutes: 70
contentVersion: 1.0.0
---

# Transfer Learning with Keras

## Transfer Learning with Keras

### Why It Matters

Apply transfer learning: pretrained models, freeze, fine-tune.

### Prerequisites

- Complete lesson 07 first.

### Topics

- Pretrained models ResNet EfficientNet MobileNet
- Freezing and unfreezing layers
- Custom classification heads
- Fine-tuning strategies

### Key Concepts

- pretrained in tf.keras.applications
- Freeze base layers for feature extraction
- Unfreeze top layers for fine-tuning

```python
base = ResNet50(weights=imagenet, include_top=False)
```
Caption: Transfer Learning with Keras - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Wrong preprocessing function for pretrained model
- Fine-tuning with too high learning rate

### Real-World Applications

- Custom image classification
- Medical imaging
- Fine-grained classification

### Interview Questions

- Feature extraction vs fine-tuning?
- How to freeze layers?

### Mini Project

Use transfer learning to classify custom dataset with ResNet50.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "Transfer Learning with Keras"?
  options:
    - Freezing and unfreezing layers
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
    - Pretrained models ResNet EfficientNet MobileNet
  correctIndex: 3
  explanation: "The correct answer is: Pretrained models ResNet EfficientNet MobileNet"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It is only supported on Linux operating systems
    - It was deprecated in the latest version
    - pretrained in tf.keras.applications
    - It requires a paid commercial license to use
  correctIndex: 2
  explanation: "The correct answer is: pretrained in tf.keras.applications"
- id: q3
  question: Which of the following best describes a concept from "Transfer Learning with Keras"?
  options:
    - It requires root/administrator privileges
    - Freeze base layers for feature extraction
    - It is a legacy feature with no modern use
    - It only works with specific hardware configurations
  correctIndex: 1
  explanation: "The correct answer is: Freeze base layers for feature extraction"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - Unfreeze top layers for fine-tuning
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
    - It applies exclusively to web development
  correctIndex: 0
  explanation: "The correct answer is: Unfreeze top layers for fine-tuning"
- id: q5
  question: Which of the following is a core topic in "Transfer Learning with Keras"?
  options:
    - Pretrained models ResNet EfficientNet MobileNet
    - Writing device drivers
    - Managing database migrations
    - Freezing and unfreezing layers
  correctIndex: 3
  explanation: "The correct answer is: Freezing and unfreezing layers"
- id: q6
  question: What is a common pitfall related to "Transfer Learning with Keras"?
  options:
    - Naming variables with lowercase letters
    - Using version control for the project
    - Wrong preprocessing function for pretrained model
    - Fine-tuning with too high learning rate
  correctIndex: 2
  explanation: "The correct answer is: Wrong preprocessing function for pretrained model"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Following established coding conventions
    - Fine-tuning with too high learning rate
    - Testing code before deployment
    - Using descriptive variable names
  correctIndex: 1
  explanation: "The correct answer is: Fine-tuning with too high learning rate"
- id: q8
  question: In what real-world scenario would you use the concepts from "Transfer Learning with Keras"?
  options:
    - Custom image classification
    - Medical imaging
    - Writing poetry and creative fiction
    - Composing orchestral music scores
  correctIndex: 0
  explanation: "The correct answer is: Custom image classification"
- id: q9
  question: Which of the following is a relevant interview question about "Transfer Learning with Keras"?
  options:
    - How to freeze layers?
    - How many planets are in the solar system?
    - What year was the company founded?
    - Feature extraction vs fine-tuning?
  correctIndex: 3
  explanation: "The correct answer is: Feature extraction vs fine-tuning?"
- id: q10
  question: Why does "Transfer Learning with Keras" matter in real-world practice?
  options:
    - It was important historically but is no longer relevant
    - It is only used by academic researchers, not industry
    - "Apply transfer learning: pretrained models, freeze, fine-tune."
    - It is a purely theoretical concept with no practical use
  correctIndex: 2
  explanation: "The correct answer is: Apply transfer learning: pretrained models, freeze, fine-tune."
```

