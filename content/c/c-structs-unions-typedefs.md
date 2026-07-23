---
slug: c-structs-unions-typedefs
id: c-09
track: c
order: 9
title: structs, unions, and typedefs
description: Group related data into structs, share storage between types with unions, and rename types with typedef — the foundation of every C API.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=5500s
whyItMatters: Group related data into structs, share storage between types with unions, and rename types with typedef — the foundation of every C API.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# structs, unions, and typedefs

## structs, unions, and typedefs

### Why It Matters

Group related data into structs, share storage between types with unions, and rename types with typedef — the foundation of every C API.

Group related data into structs, share storage between types with unions, and rename types with typedef — the foundation of every C API.

### Prerequisites

- Stage 6: Pointers.
- Stage 8: Dynamic Memory.

### Topics

- struct declaration, definition, and initialization
- Designated initializers (C99)
- Padding and alignment — sizeof surprises
- typedef: aliasing types and forward declarations
- unions: sharing storage, type punning
- Anonymous structs and unions (C11)
- struct pointers and the -> operator
- Bit-fields

### Key Concepts

- A struct is a named bundle of possibly-different-typed members laid out contiguously (with padding).
- The compiler may insert padding for alignment — `struct {char c; int i;}` is typically 8 bytes, not 5.
- typedef creates an alias; it does NOT create a new type (no type-safety between typedefs of the same underlying type).
- A union overlays all members at the same address — sizeof is the max member size; writing one member makes others undefined.
- `p->member` is shorthand for `(*p).member` — used heavily with struct pointers.
- Bit-fields let you pack members into bits, but the layout is implementation-defined.

```c
#include <stdio.h>

typedef struct {
    char  name[32];
    int   age;
    float gpa;
} Student;

int main(void) {
    Student s = { .name = "Ada Lovelace", .age = 28, .gpa = 3.9f };
    Student *p = &s;
    printf("%s age=%d gpa=%.2f\n", p->name, p->age, p->gpa);
    return 0;
}
```
Caption: Struct basics

### Common Pitfalls

- Forgetting `struct` keyword in self-referential members — `typedef struct { Node *next; } Node;` fails because Node isn't yet a type; use `struct Node *next` inside.
- Assuming struct layout across platforms — padding and bit-field layout are implementation-defined; never memcpy a struct across machines.
- Comparing structs with == — `s1 == s2` is a compile error; use memcmp (after zeroing padding) or field-by-field compare.
- Reading the wrong union member — reading a member that wasn't last written is UB in C99 (implementation-defined in C11 with the "active member" rule).
- Bit-field portability — `int flag : 1;` may be signed or unsigned; explicitly use `unsigned int flag : 1;` for portability.

### Real-World Applications

- The Linux kernel's `struct task_struct` has hundreds of members defining a process; it's carefully laid out to minimize cache-line crossings.
- SQLite's `struct sqlite3` and `struct sqlite3_stmt` are the central handle types returned by sqlite3_open and sqlite3_prepare_v2.
- Redis's `struct redisObject` (robj) wraps every value as a tagged union of string, list, hash, set, zset encodings.
- Network protocols (TCP, IP, DNS headers) are often modeled as packed structs in C; e.g., `struct tcphdr` in <netinet/tcp.h>.

### Interview Questions

- 1. Why does `struct { char c; int i; }` have size 8, not 5? — The compiler inserts 3 bytes of padding after `c` so `i` is 4-byte aligned for efficient access.
- 2. What is a tagged union? — A struct containing a union plus an enum/int "tag" identifying the active member — the foundation of variant types.
- 3. What does typedef do, and what doesn't it do? — Creates an alias for an existing type; it does NOT create a distinct type, so typedef'd ints are interchangeable.
- 4. What's the difference between `struct Point p;` and `Point p;` (after `typedef struct {...} Point;`)? — Nothing functionally; the typedef just lets you omit the `struct` keyword.
- 5. Why is struct padding a portability issue? — Padding depends on the platform ABI; binary structs are not portable across architectures or even across compilers.

### Mini Project

Build a Tagged-Union Variant: A simple `Value` type that holds either an int, a double, or a string, plus a tag enum. Suggested approach:
  - Define `typedef enum { VAL_INT, VAL_DOUBLE, VAL_STRING } ValueType;`
  - Define `typedef struct { ValueType tag; union { int i; double d; char *s; } as; } Value;`
  - Write make_int(i), make_double(d), make_string(s) constructors
  - Write value_print(const Value*) that switches on tag
  - Write value_free(Value*) that frees the string if tag is VAL_STRING

### Exercises

1. Define a struct Point with x, y; write a function to compute the distance between two Points.
2. Print sizeof and offsetof for several struct layouts; explain the padding.
3. Implement a tagged union for a JSON-like value (null, bool, number, string, array, object).
4. Reorder members of a struct to minimize padding and verify with sizeof.
5. Build a small linked list of struct Node and traverse it.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What is the typical sizeof `struct { char c; int i; }` on a 64-bit platform?
9. A) 8 (*)
10. B) 5
11. C) 12
12. D) 16
13. Explanation: The compiler pads `c` to 4 bytes so `i` is 4-byte aligned; total is 8 bytes.
14. Q2: How do you access a member via a struct pointer?
15. A) `p.member`
16. B) `p->member` (equivalent to `(*p).member`) (*)
17. C) `p::member`
18. D) `p@member`
19. Explanation: `->` is shorthand for dereference-then-access; `p->member` is exactly `(*p).member`.
20. Q3: What does typedef do?
21. A) Defines a new distinct type
22. B) Allocates memory for a type
23. C) Creates an alias for an existing type (*)
24. D) Removes a type at compile time
25. Explanation: typedef aliases an existing type; typedef'd types are interchangeable with their underlying type (no type safety).
26. Q4: Why does this fail? `typedef struct { Node *next; } Node;`
27. A) typedef doesn't work with structs
28. B) struct Node can't have a pointer member
29. C) Missing semicolon
30. D) Node isn't yet defined when the field is parsed (*)
31. Explanation: The typedef name Node isn't in scope until after the closing brace; use `struct Node *next` and forward-declare.
32. Q5: What is a union?
33. A) A type where members share the same storage (*)
34. B) A struct with all const members
35. C) A way to merge two structs
36. D) A thread-safe struct
37. Explanation: All union members occupy the same bytes; sizeof is the max member size; writing one member makes others undefined.
38. Q6: Can you compare two structs with `==`?
39. A) Yes, always
40. B) No — it's a compile error in C (*)
41. C) Yes, but only with -O2
42. D) Yes, but only if they have no pointers
43. Explanation: C has no struct ==; compare field-by-field or memcmp (after zeroing padding).
44. Q7: What is a designated initializer?
45. A) `struct S s = S(1, 2);`
46. B) `struct S s = new S(1, 2);`
47. C) `struct S s = { .x = 1, .y = 2 };` (C99) (*)
48. D) `struct S s = S{1, 2};`
49. Explanation: C99 designated initializers name fields explicitly: `{ .field = value }`, leaving unmentioned fields zero.
50. Q8: What does C11 add for unions inside structs?
51. A) Virtual functions
52. B) Inheritance
53. C) Methods
54. D) Anonymous structs/unions (members accessed directly) (*)
55. Explanation: C11 allows anonymous struct/union members; their members are accessed directly without naming the union.
56. Q9: What is a tagged union?
57. A) A struct with a tag (enum/int) plus a union — the tag identifies the active member (*)
58. B) A union with a function pointer
59. C) A union of two tags
60. D) A struct with a const tag
61. Explanation: A tagged union pairs a tag with a union, letting code safely dispatch on the active member — the basis of variants.
62. Q10: Are bit-fields portable across compilers?
63. A) Yes, fully
64. B) No — layout, signedness, and packing are implementation-defined (*)
65. C) Yes, since C89
66. D) Only if declared as `int`
67. Explanation: Bit-field bit-order, signedness, and alignment vary by compiler; never serialize bit-field structs to disk or network.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What is the typical sizeof `struct { char c; int i; }` on a 64-bit platform?
  options:
    - "8"
    - "5"
    - "12"
    - "16"
  correctIndex: 0
  explanation: The compiler pads `c` to 4 bytes so `i` is 4-byte aligned; total is 8 bytes.
- id: q2
  question: How do you access a member via a struct pointer?
  options:
    - "`p.member`"
    - "`p->member` (equivalent to `(*p).member`)"
    - "`p::member`"
    - "`p@member`"
  correctIndex: 1
  explanation: "`->` is shorthand for dereference-then-access; `p->member` is exactly `(*p).member`."
- id: q3
  question: What does typedef do?
  options:
    - Defines a new distinct type
    - Allocates memory for a type
    - Creates an alias for an existing type
    - Removes a type at compile time
  correctIndex: 2
  explanation: typedef aliases an existing type; typedef'd types are interchangeable with their underlying type (no type safety).
- id: q4
  question: Why does this fail? `typedef struct { Node *next; } Node;`
  options:
    - typedef doesn't work with structs
    - struct Node can't have a pointer member
    - Missing semicolon
    - Node isn't yet defined when the field is parsed
  correctIndex: 3
  explanation: The typedef name Node isn't in scope until after the closing brace; use `struct Node *next` and forward-declare.
- id: q5
  question: What is a union?
  options:
    - A type where members share the same storage
    - A struct with all const members
    - A way to merge two structs
    - A thread-safe struct
  correctIndex: 0
  explanation: All union members occupy the same bytes; sizeof is the max member size; writing one member makes others undefined.
- id: q6
  question: Can you compare two structs with `==`?
  options:
    - Yes, always
    - No — it's a compile error in C
    - Yes, but only with -O2
    - Yes, but only if they have no pointers
  correctIndex: 1
  explanation: C has no struct ==; compare field-by-field or memcmp (after zeroing padding).
- id: q7
  question: What is a designated initializer?
  options:
    - "`struct S s = S(1, 2);`"
    - "`struct S s = new S(1, 2);`"
    - "`struct S s = { .x = 1, .y = 2 };` (C99)"
    - "`struct S s = S{1, 2};`"
  correctIndex: 2
  explanation: "C99 designated initializers name fields explicitly: `{ .field = value }`, leaving unmentioned fields zero."
- id: q8
  question: What does C11 add for unions inside structs?
  options:
    - Virtual functions
    - Inheritance
    - Methods
    - Anonymous structs/unions (members accessed directly)
  correctIndex: 3
  explanation: C11 allows anonymous struct/union members; their members are accessed directly without naming the union.
- id: q9
  question: What is a tagged union?
  options:
    - A struct with a tag (enum/int) plus a union — the tag identifies the active member
    - A union with a function pointer
    - A union of two tags
    - A struct with a const tag
  correctIndex: 0
  explanation: A tagged union pairs a tag with a union, letting code safely dispatch on the active member — the basis of variants.
- id: q10
  question: Are bit-fields portable across compilers?
  options:
    - Yes, fully
    - No — layout, signedness, and packing are implementation-defined
    - Yes, since C89
    - Only if declared as `int`
  correctIndex: 1
  explanation: Bit-field bit-order, signedness, and alignment vary by compiler; never serialize bit-field structs to disk or network.
```

