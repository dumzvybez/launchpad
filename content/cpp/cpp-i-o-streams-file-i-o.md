---
slug: cpp-i-o-streams-file-i-o
id: cpp-15
track: cpp
order: 15
title: I/O Streams and File I/O
description: Master std::istream / std::ostream, std::ifstream / std::ofstream, std::stringstream, manipulators, binary I/O, and the failure modes of stream state.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0&t=700s
whyItMatters: Master std::istream / std::ostream, std::ifstream / std::ofstream, std::stringstream, manipulators, binary I/O, and the failure modes of stream state.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# I/O Streams and File I/O

## I/O Streams and File I/O

### Why It Matters

Master std::istream / std::ostream, std::ifstream / std::ofstream, std::stringstream, manipulators, binary I/O, and the failure modes of stream state.

Master std::istream / std::ostream, std::ifstream / std::ofstream, std::stringstream, manipulators, binary I/O, and the failure modes of stream state.

### Prerequisites

- Stage 1-14

### Topics

- std::istream, std::ostream, std::iostream
- std::cin, std::cout, std::cerr, std::clog
- std::ifstream, std::ofstream, std::fstream
- std::istringstream, std::ostringstream, std::stringstream
- Stream state: goodbit, failbit, badbit, eofbit
- Manipulators: std::setw, std::setprecision, std::fixed, std::hex, std::boolalpha
- Binary I/O with read() / write()
- Custom operator<< and operator>>
- sync_with_stdio(false) for performance
- Error handling and stream exceptions

### Key Concepts

- Streams track four state bits; `if (stream)` checks good/fail/bad; `stream.clear()` resets.
- operator>> skips whitespace by default; use std::noskipws to disable.
- operator<< and operator>> can be overloaded for custom types — return the stream reference for chaining.
- Binary I/O with read()/write() works on raw bytes; you must handle endianness and padding for portable files.
- std::ostringstream is the modern way to build strings; avoids snprintf buffer management.
- sync_with_stdio(false) decouples C++ streams from C stdio for speed; do it once at program start.

```cpp
#include <iostream>
#include <iomanip>

int main() {
    double pi = 3.141592653589793;
    std::cout << std::fixed << std::setprecision(4) << pi << '\n'    // 3.1416
              << std::scientific << pi << '\n'                       // 3.1416e+00
              << std::hex << 255 << '\n'                             // ff
              << std::boolalpha << (1 == 1) << '\n';                 // true
}
```
Caption: Formatted output with manipulators

### Common Pitfalls

- Not checking stream state after reads — `std::cin >> n` may fail silently and leave n unchanged; check `if (cin >> n)` or stream state.
- Forgetting to clear stream state after a failed read — subsequent reads also fail; call `cin.clear()` and `cin.ignore(...)`.
- Mixing << and >> in code that doesn't check state — one failure cascades to all subsequent operations.
- Binary file portability — structs have padding and endianness differs across platforms; serialize field-by-field in a known byte order.
- Performance: per-line std::endl flushing — std::endl flushes the buffer; use '\n' for bulk output (10x+ speedup in tight loops).

### Real-World Applications

- LLVM's diagnostic streams (llvm::outs, llvm::errs) are std::ostream-compatible and used pervasively for compiler output.
- Bloomberg's bsl::ostream mirrors std::ostream with allocator support, used in their infrastructure for structured logging.
- Qt's QTextStream wraps QIODevice (file, socket, buffer) with operator<< / >> for portable text I/O.
- Google's logging (glog) is built on std::ostream, with custom manipulators for severity and verbosity.

### Interview Questions

- 1. What are the four stream state bits? — goodbit, failbit (formatting failure, recoverable), badbit (I/O failure, unrecoverable), eofbit (end of input).
- 2. Why use std::ostringstream instead of snprintf? — Type-safe, no buffer management, supports custom operator<<, and integrates with the stream idiom.
- 3. What does sync_with_stdio(false) do? — Decouples C++ streams from C stdio, allowing independent buffering and faster I/O when C stdio isn't used.
- 4. How do you make a custom type printable? — Overload operator<<(std::ostream&, const T&) returning the stream reference for chaining.
- 5. Why is binary serialization of a raw struct not portable? — Structs have implementation-defined padding and the platform may be little- or big-endian; serialize field-by-field in a fixed byte order.

### Mini Project

Build a CSV Writer Class: A class CsvWriter that takes rows of strings and writes well-formed CSV to a stream, with proper quoting of fields containing commas, quotes, or newlines. Suggested approach:
  - Constructor takes std::ostream& and a delimiter (default ',')
  - write_row(const std::vector<std::string>&) — quote fields needing quoting, double internal quotes
  - operator<< for fluent API: writer << "a" << "b" << CsvWriter::endl
  - Add a write_header() that writes a row and tracks column count for validation
  - Write a small main that reads lines from stdin and dumps them as a CSV file

### Exercises

1. Read a file of integers (one per line) into a vector<int>; handle non-numeric lines by skipping with cin.clear() and cin.ignore().
2. Write a custom operator<< for a std::vector<T>; verify chained printing works.
3. Use std::ostringstream to build a SQL INSERT statement with proper quoting of string values.
4. Write a 4-byte little-endian uint32 to a file and read it back; verify roundtrip with hexdump.
5. Time std::endl vs '\n' on 1 million lines of output; measure the speedup.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does std::endl do beyond printing '\n'?
9. A) Closes the stream
10. B) Resets the cursor
11. C) Flushes the output buffer (*)
12. D) Nothing extra
13. Explanation: std::endl inserts '\n' AND flushes the stream; '\n' alone avoids the flush and is much faster for bulk output.
14. Q2: Which stream state bit indicates a recoverable formatting failure?
15. A) goodbit
16. B) badbit
17. C) eofbit
18. D) failbit (*)
19. Explanation: failbit is set on a formatting error (e.g., reading an int from "abc"); it's recoverable with clear(). badbit is unrecoverable I/O failure.
20. Q3: How do you reset a stream's error state?
21. A) stream.clear() (*)
22. B) stream.reset()
23. C) stream.flush()
24. D) Reopen the stream
25. Explanation: stream.clear() resets all error bits to goodbit; you usually follow with stream.ignore() to discard the bad input.
26. Q4: What does operator<< return for chaining?
27. A) void
28. B) The same std::ostream& it received (*)
29. C) bool
30. D) int
31. Explanation: operator<< returns std::ostream&, enabling chained calls like `cout << a << b << c`.
32. Q5: Why is writing a raw struct to a binary file non-portable?
33. A) Structs can't be written
34. B) Files cannot contain structs
35. C) Padding and endianness vary across platforms (*)
36. D) Binary I/O is non-portable by definition
37. Explanation: Structs have implementation-defined padding; platforms differ in endianness. Serialize field-by-field in a known byte order for portability.
38. Q6: What does std::ostringstream do?
39. A) Reads from a string
40. B) Reads from stdin
41. C) Writes to stderr
42. D) Writes to an in-memory string buffer — string building (*)
43. Explanation: std::ostringstream is an output stream backed by a std::string; you call .str() to retrieve the assembled string.
44. Q7: What does sync_with_stdio(false) do?
45. A) Decouples C++ streams from C stdio for speed (*)
46. B) Disables iostream
47. C) Synchronizes all streams
48. D) Is required
49. Explanation: sync_with_stdio(false) decouples C++ stream buffering from C stdio, often improving speed; do it once at program start if you don't mix C and C++ I/O.
50. Q8: Which manipulator sets the field width for the next output only?
51. A) std::setfill
52. B) std::setw (*)
53. C) std::setprecision
54. D) std::fixed
55. Explanation: std::setw is sticky only for the next output operation; other manipulators like setprecision and fixed persist until changed.
56. Q9: What does std::boolalpha do?
57. A) Casts to bool
58. B) Validates booleans
59. C) Prints bools as "true"/"false" instead of 1/0 (*)
60. D) Throws on bad bool
61. Explanation: std::boolalpha makes bool I/O use textual "true"/"false" instead of integer 1/0; std::noboolalpha restores the integer form.
62. Q10: What is the safest way to read an int from std::cin with bad-input handling?
63. A) `int n; std::cin >> n;`
64. B) `std::cin.get_int(n)`
65. C) `n = std::cin.read_int()`
66. D) `if (std::cin >> n) { ... } else { std::cin.clear(); std::cin.ignore(...); }` (*)
67. Explanation: Check the stream after the read; on failure, clear the state and ignore the bad input before retrying. Otherwise n is unchanged and the stream stays in a fail state.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does std::endl do beyond printing '\n'?
  options:
    - Closes the stream
    - Resets the cursor
    - Flushes the output buffer
    - Nothing extra
  correctIndex: 2
  explanation: std::endl inserts '\n' AND flushes the stream; '\n' alone avoids the flush and is much faster for bulk output.
- id: q2
  question: Which stream state bit indicates a recoverable formatting failure?
  options:
    - goodbit
    - badbit
    - eofbit
    - failbit
  correctIndex: 3
  explanation: failbit is set on a formatting error (e.g., reading an int from "abc"); it's recoverable with clear(). badbit is unrecoverable I/O failure.
- id: q3
  question: How do you reset a stream's error state?
  options:
    - stream.clear()
    - stream.reset()
    - stream.flush()
    - Reopen the stream
  correctIndex: 0
  explanation: stream.clear() resets all error bits to goodbit; you usually follow with stream.ignore() to discard the bad input.
- id: q4
  question: What does operator<< return for chaining?
  options:
    - void
    - The same std::ostream& it received
    - bool
    - int
  correctIndex: 1
  explanation: operator<< returns std::ostream&, enabling chained calls like `cout << a << b << c`.
- id: q5
  question: Why is writing a raw struct to a binary file non-portable?
  options:
    - Structs can't be written
    - Files cannot contain structs
    - Padding and endianness vary across platforms
    - Binary I/O is non-portable by definition
  correctIndex: 2
  explanation: Structs have implementation-defined padding; platforms differ in endianness. Serialize field-by-field in a known byte order for portability.
- id: q6
  question: What does std::ostringstream do?
  options:
    - Reads from a string
    - Reads from stdin
    - Writes to stderr
    - Writes to an in-memory string buffer — string building
  correctIndex: 3
  explanation: std::ostringstream is an output stream backed by a std::string; you call .str() to retrieve the assembled string.
- id: q7
  question: What does sync_with_stdio(false) do?
  options:
    - Decouples C++ streams from C stdio for speed
    - Disables iostream
    - Synchronizes all streams
    - Is required
  correctIndex: 0
  explanation: sync_with_stdio(false) decouples C++ stream buffering from C stdio, often improving speed; do it once at program start if you don't mix C and C++ I/O.
- id: q8
  question: Which manipulator sets the field width for the next output only?
  options:
    - std::setfill
    - std::setw
    - std::setprecision
    - std::fixed
  correctIndex: 1
  explanation: std::setw is sticky only for the next output operation; other manipulators like setprecision and fixed persist until changed.
- id: q9
  question: What does std::boolalpha do?
  options:
    - Casts to bool
    - Validates booleans
    - Prints bools as "true"/"false" instead of 1/0
    - Throws on bad bool
  correctIndex: 2
  explanation: std::boolalpha makes bool I/O use textual "true"/"false" instead of integer 1/0; std::noboolalpha restores the integer form.
- id: q10
  question: What is the safest way to read an int from std::cin with bad-input handling?
  options:
    - "`int n; std::cin >> n;`"
    - "`std::cin.get_int(n)`"
    - "`n = std::cin.read_int()`"
    - "`if (std::cin >> n) { ... } else { std::cin.clear(); std::cin.ignore(...); }`"
  correctIndex: 3
  explanation: Check the stream after the read; on failure, clear the state and ignore the bad input before retrying. Otherwise n is unchanged and the stream stays in a fail state.
```

