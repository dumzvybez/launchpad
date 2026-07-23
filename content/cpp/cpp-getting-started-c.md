---
slug: cpp-getting-started-c
id: cpp-01
track: cpp
order: 1
title: Getting Started with C++
description: Install a C++ compiler, write your first program, and understand the compile-link pipeline, the C++ standard library, and the iostream abstraction that replaces printf.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=18c3MTX0PK0
whyItMatters: Install a C++ compiler, write your first program, and understand the compile-link pipeline, the C++ standard library, and the iostream abstraction that replaces printf.
deepDiveResources:
  - label: W3Schools C++
    url: https://www.w3schools.com/cpp/
    kind: course
  - label: C++ Official Docs
    url: https://en.cppreference.com/w/
    kind: doc
---

# Getting Started with C++

## Getting Started with C++

### Why It Matters

Install a C++ compiler, write your first program, and understand the compile-link pipeline, the C++ standard library, and the iostream abstraction that replaces printf.

Install a C++ compiler, write your first program, and understand the compile-link pipeline, the C++ standard library, and the iostream abstraction that replaces printf.

### Prerequisites

- None — this is the entry point for the C++ track.
- Basic computer literacy (using a terminal, installing software).

### Topics

- History of C++ (Bjarne Stroustrup, Bell Labs, 1979-onward, "C with Classes")
- Installing g++/clang++/MSVC on Linux, macOS, Windows
- The compile pipeline: preprocess, compile, assemble, link
- Writing main() and returning an int
- std::cout, std::endl, and the iostream library
- Namespaces and `using namespace std;` (and why to avoid it in headers)
- Header files (.h/.hpp) and source files (.cpp)
- C++ standards: C++98, C++11, C++14, C++17, C++20, C++23

### Key Concepts

- C++ is a compiled, statically typed, multi-paradigm language with zero-overhead abstractions.
- main returns int: 0 for success, non-zero for error (visible to the shell via $?).
- The C++ Standard Library (std::) is large: containers, algorithms, concurrency, I/O, regex.
- Source is portable; binary is not — recompile per platform and standard.
- The toolchain: cpp (preprocessor) -> cc1plus (compiler) -> as (assembler) -> ld (linker).
- Header files declare interfaces; source files define implementations; the One Definition Rule (ODR) governs what may be defined where.

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```
Caption: Hello World

### Common Pitfalls

- Forgetting `#include <iostream>` and using std::cout — enable -Wall to catch undeclared identifiers; C++ has no implicit declarations.
- Putting `using namespace std;` in a header file — it pollutes every translation unit that includes the header and silently breaks overload resolution; keep using-declarations in .cpp files or scope them to functions.
- Compiling without -Wall -Wextra -Wpedantic — silently shipping bugs the compiler already diagnosed; always enable warnings and treat them as errors with -Werror in CI.
- Writing `void main()` — main must return int; "void main()" is non-standard and breaks shell $? checks.
- Using a 20-year-old compiler (Turbo C++, MSVC 6) — those predate C++11 and have none of the modern features this track uses; require g++ >= 11, clang++ >= 14, or MSVC 2022.

### Real-World Applications

- Google Chrome's rendering engine (Blink) and JavaScript engine (V8) are written in C++; the browser ships over 30M lines of C++ across platforms.
- Adobe Photoshop, Illustrator, and Premiere are large C++ codebases; Photoshop dates to 1990 and still compiles with MSVC.
- Microsoft Office (Word, Excel, PowerPoint) is primarily C++ on Windows; the COM ABI underpinning Office is C++-compatible.
- MongoDB's storage engine (WiredTiger) and core server are C++; the codebase compiles with both g++ and clang++.

### Interview Questions

- 1. Who created C++ and what was its original name? — Bjarne Stroustrup at Bell Labs starting in 1979; originally called "C with Classes," renamed C++ in 1983.
- 2. What are the four phases of C++ compilation? — Preprocess (.ii), compile (.s assembly), assemble (.o object), link (executable).
- 3. What is the One Definition Rule (ODR)? — Every entity (function, variable, class) must have exactly one definition across the entire program; violations are usually linker errors but can be silent UB.
- 4. Why avoid `using namespace std;` in headers? — It transitive-pollutes every includer, can introduce name clashes, and silently changes overload resolution in downstream code.
- 5. Name the major C++ standards and one headline feature of each. — C++11 (lambdas, smart pointers, move semantics), C++14 (generic lambdas, binary literals), C++17 (structured bindings, optional, variant), C++20 (concepts, ranges, modules, coroutines), C++23 (std::expected, std::print, explicit-deduction-guide).

### Mini Project

Build a Greeting Generator CLI: A command-line tool that takes a name from argv and prints a personalized greeting with a timestamp. Suggested approach:
  - Read argc/argv in main; if argc < 2, print usage and return 1
  - Use std::time and std::localtime from <ctime> to stamp output
  - Print with std::cout and the << operator chain
  - Add a --uppercase flag (detected by scanning argv) to shout the greeting
  - Compile with -Wall -Wextra -Wpedantic -std=c++20 and fix every warning

### Exercises

1. Install g++ or clang++ and run `g++ --version` to confirm it prints 11.0 or higher; verify C++20 support with `echo '#include <version>
2. int main(){return __cpp_lib_concepts;}' | g++ -std=c++20 -x c++ - -o /tmp/cpp20test && /tmp/cpp20test; echo $?`.
3. Create a file `hello.cpp` that prints your name and age using std::cout chains, then compile with `g++ -std=c++20 -Wall -Wextra hello.cpp -o hello` and run it.
4. Add a multi-line `/* ... */` comment at the top of `hello.cpp` explaining what the script does; rebuild and observe nothing changes in the output.
5. Write a program that reads an int from std::cin and prints its square; test with negative and very large values (note what happens at INT_MAX).
6. Compare the size of the same source compiled with -O0 vs -O2 (`ls -la`); explain why optimization changes binary size.
7. >>> QUIZ (Stage 1) <<<
8. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
9. Q1: Who created C++?
10. A) Bjarne Stroustrup (*)
11. B) Dennis Ritchie
12. C) James Gosling
13. D) Anders Hejlsberg
14. Explanation: Bjarne Stroustrup began "C with Classes" at Bell Labs in 1979; it was renamed C++ in 1983.
15. Q2: What does std::cout do?
16. A) Sends to a physical printer
17. B) Writes to stdout (*)
18. C) Creates a file
19. D) Sends an email
20. Explanation: std::cout is the standard output stream, an instance of std::ostream backed by the C stdout stream.
21. Q3: Which header provides std::cout?
22. A) <stdio.h>
23. B) <cstdio>
24. C) <iostream> (*)
25. D) <ostream>
26. Explanation: <iostream> declares std::cout, std::cin, std::cerr, and std::clog along with the stream classes.
27. Q4: What is the correct signature of main in a hosted environment?
28. A) void main()
29. B) main()
30. C) int main(void argc, char argv)
31. D) int main() or int main(int argc, char* argv[]) (*)
32. Explanation: The C++ standard requires main to return int; the two allowed forms are `int main()` and `int main(int argc, char* argv[])`.
33. Q5: What does the compile pipeline do first?
34. A) Preprocess (*)
35. B) Assemble
36. C) Link
37. D) Optimize
38. Explanation: The preprocessor runs first, expanding #include directives and macros to produce a single translation unit.
39. Q6: Why avoid `using namespace std;` in a header?
40. A) It triggers a compile error
41. B) It pollutes every translation unit that includes the header (*)
42. C) It slows compilation by 10x
43. D) It is fine in headers
44. Explanation: Using-directives in headers propagate to every includer, causing name clashes and surprising overload resolution.
45. Q7: Which flag enables all common warnings in g++?
46. A) -w
47. B) -O3
48. C) -Wall -Wextra (*)
49. D) -std=c++20
50. Explanation: -Wall enables most warnings and -Wextra adds the rest; combine with -Werror to fail the build on warnings.
51. Q8: What is the ODR?
52. A) Object Destruction Rule — destructors run in reverse order
53. B) Operator Dispatch Rule — overload resolution picks the best match
54. C) Optional Default Return — main may omit its return
55. D) One Definition Rule — every entity must have exactly one definition in the program (*)
56. Explanation: The One Definition Rule states each function, variable, and class has exactly one definition across the program; violations cause linker errors or UB.
57. Q9: Which is the latest C++ standard with broad compiler support as of 2024?
58. A) C++20 (*)
59. B) C++11
60. C) C++14
61. D) C++17
62. Explanation: C++20 is the latest standard with full support in g++ 12+, clang++ 14+, and MSVC 2022; C++23 support is partial.
63. Q10: What does `std::endl` do beyond printing a newline?
64. A) Nothing — it is identical to '\n'
65. B) Flushes the output stream (*)
66. C) Closes the stream
67. D) Resets the cursor position
68. Explanation: std::endl inserts '\n' and flushes the stream; '\n' alone avoids the flush and is faster for bulk output.
69. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Who created C++?
  options:
    - Bjarne Stroustrup
    - Dennis Ritchie
    - James Gosling
    - Anders Hejlsberg
  correctIndex: 0
  explanation: Bjarne Stroustrup began "C with Classes" at Bell Labs in 1979; it was renamed C++ in 1983.
- id: q2
  question: What does std::cout do?
  options:
    - Sends to a physical printer
    - Writes to stdout
    - Creates a file
    - Sends an email
  correctIndex: 1
  explanation: std::cout is the standard output stream, an instance of std::ostream backed by the C stdout stream.
- id: q3
  question: Which header provides std::cout?
  options:
    - <stdio.h>
    - <cstdio>
    - <iostream>
    - <ostream>
  correctIndex: 2
  explanation: <iostream> declares std::cout, std::cin, std::cerr, and std::clog along with the stream classes.
- id: q4
  question: What is the correct signature of main in a hosted environment?
  options:
    - void main()
    - main()
    - int main(void argc, char argv)
    - int main() or int main(int argc, char* argv[])
  correctIndex: 3
  explanation: The C++ standard requires main to return int; the two allowed forms are `int main()` and `int main(int argc, char* argv[])`.
- id: q5
  question: What does the compile pipeline do first?
  options:
    - Preprocess
    - Assemble
    - Link
    - Optimize
  correctIndex: 0
  explanation: "The preprocessor runs first, expanding #include directives and macros to produce a single translation unit."
- id: q6
  question: Why avoid `using namespace std;` in a header?
  options:
    - It triggers a compile error
    - It pollutes every translation unit that includes the header
    - It slows compilation by 10x
    - It is fine in headers
  correctIndex: 1
  explanation: Using-directives in headers propagate to every includer, causing name clashes and surprising overload resolution.
- id: q7
  question: Which flag enables all common warnings in g++?
  options:
    - -w
    - -O3
    - -Wall -Wextra
    - -std=c++20
  correctIndex: 2
  explanation: -Wall enables most warnings and -Wextra adds the rest; combine with -Werror to fail the build on warnings.
- id: q8
  question: What is the ODR?
  options:
    - Object Destruction Rule — destructors run in reverse order
    - Operator Dispatch Rule — overload resolution picks the best match
    - Optional Default Return — main may omit its return
    - One Definition Rule — every entity must have exactly one definition in the program
  correctIndex: 3
  explanation: The One Definition Rule states each function, variable, and class has exactly one definition across the program; violations cause linker errors or UB.
- id: q9
  question: Which is the latest C++ standard with broad compiler support as of 2024?
  options:
    - C++20
    - C++11
    - C++14
    - C++17
  correctIndex: 0
  explanation: C++20 is the latest standard with full support in g++ 12+, clang++ 14+, and MSVC 2022; C++23 support is partial.
- id: q10
  question: What does `std::endl` do beyond printing a newline?
  options:
    - Nothing — it is identical to '\n'
    - Flushes the output stream
    - Closes the stream
    - Resets the cursor position
  correctIndex: 1
  explanation: std::endl inserts '\n' and flushes the stream; '\n' alone avoids the flush and is faster for bulk output.
```

