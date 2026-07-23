---
slug: tensorflow-time-series-forecasting
id: tensorflow-16
track: tensorflow
order: 16
title: Time Series Forecasting
description: "Build forecasting models: RNNs, LSTMs, transformers."
difficulty: advanced
estMinutes: 70
contentVersion: 1.0.0
---

# Time Series Forecasting

## Time Series Forecasting

### Why It Matters

Build forecasting models: RNNs, LSTMs, transformers.

### Prerequisites

- Complete lesson 15 first.

### Topics

- Windowing time series data
- LSTM for sequence prediction
- Multi-step forecasting
- Evaluation metrics MAE RMSE MAPE

### Key Concepts

- Time series data must be windowed for training
- LSTM captures temporal dependencies
- Multi-step predicts multiple future values

```python
ds = tf.data.Dataset.from_tensor_slices(series).window(window_size+1, shift=1)
```
Caption: Time Series Forecasting - example

Work through each concept carefully. The lessons build progressively.

### Common Pitfalls

- Not shuffling windowed data
- Data leakage normalizing with test stats

### Real-World Applications

- Stock prediction
- Weather forecasting
- Demand forecasting

### Interview Questions

- Windowed dataset?
- Multi-step forecasting?

### Mini Project

Build LSTM model for multi-step time series forecasting.

### Exercises

1. Review the key concepts above.
2. Modify the code example to test understanding.
3. Write your own example from scratch.

```quiz
- id: q1
  question: Which of the following is a key topic covered in "Time Series Forecasting"?
  options:
    - LSTM for sequence prediction
    - Designing custom CPU instruction sets
    - Building operating system kernels from scratch
    - Windowing time series data
  correctIndex: 3
  explanation: "The correct answer is: Windowing time series data"
- id: q2
  question: According to this lesson, which statement is correct?
  options:
    - It is only supported on Linux operating systems
    - It was deprecated in the latest version
    - Time series data must be windowed for training
    - It requires a paid commercial license to use
  correctIndex: 2
  explanation: "The correct answer is: Time series data must be windowed for training"
- id: q3
  question: Which of the following best describes a concept from "Time Series Forecasting"?
  options:
    - It requires root/administrator privileges
    - LSTM captures temporal dependencies
    - It is a legacy feature with no modern use
    - It only works with specific hardware configurations
  correctIndex: 1
  explanation: "The correct answer is: LSTM captures temporal dependencies"
- id: q4
  question: Which statement accurately reflects a key concept from this lesson?
  options:
    - Multi-step predicts multiple future values
    - It is only relevant for beginners, not advanced users
    - It has been replaced by a newer standard
    - It applies exclusively to web development
  correctIndex: 0
  explanation: "The correct answer is: Multi-step predicts multiple future values"
- id: q5
  question: Which of the following is a core topic in "Time Series Forecasting"?
  options:
    - Windowing time series data
    - Writing device drivers
    - Managing database migrations
    - LSTM for sequence prediction
  correctIndex: 3
  explanation: "The correct answer is: LSTM for sequence prediction"
- id: q6
  question: What is a common pitfall related to "Time Series Forecasting"?
  options:
    - Naming variables with lowercase letters
    - Using version control for the project
    - Not shuffling windowed data
    - Data leakage normalizing with test stats
  correctIndex: 2
  explanation: "The correct answer is: Not shuffling windowed data"
- id: q7
  question: Which of the following is identified as a pitfall in this lesson?
  options:
    - Following established coding conventions
    - Data leakage normalizing with test stats
    - Testing code before deployment
    - Using descriptive variable names
  correctIndex: 1
  explanation: "The correct answer is: Data leakage normalizing with test stats"
- id: q8
  question: In what real-world scenario would you use the concepts from "Time Series Forecasting"?
  options:
    - Stock prediction
    - Weather forecasting
    - Writing poetry and creative fiction
    - Composing orchestral music scores
  correctIndex: 0
  explanation: "The correct answer is: Stock prediction"
- id: q9
  question: Which of the following is a relevant interview question about "Time Series Forecasting"?
  options:
    - Multi-step forecasting?
    - How many planets are in the solar system?
    - What year was the company founded?
    - Windowed dataset?
  correctIndex: 3
  explanation: "The correct answer is: Windowed dataset?"
- id: q10
  question: Why does "Time Series Forecasting" matter in real-world practice?
  options:
    - It was important historically but is no longer relevant
    - It is only used by academic researchers, not industry
    - "Build forecasting models: RNNs, LSTMs, transformers."
    - It is a purely theoretical concept with no practical use
  correctIndex: 2
  explanation: "The correct answer is: Build forecasting models: RNNs, LSTMs, transformers."
```

