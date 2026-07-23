---
slug: c-file-i-o-fopen-fread-fwrite-fseek
id: c-11
track: c
order: 11
title: File I/O — fopen, fread, fwrite, fseek
description: Open files with fopen, read and write with fread/fwrite, fseek and ftell for random access, and learn why every file handle must be closed on every code path.
difficulty: intermediate
estMinutes: 225
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=6900s
whyItMatters: Open files with fopen, read and write with fread/fwrite, fseek and ftell for random access, and learn why every file handle must be closed on every code path.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# File I/O — fopen, fread, fwrite, fseek

## File I/O — fopen, fread, fwrite, fseek

### Why It Matters

Open files with fopen, read and write with fread/fwrite, fseek and ftell for random access, and learn why every file handle must be closed on every code path.

Open files with fopen, read and write with fread/fwrite, fseek and ftell for random access, and learn why every file handle must be closed on every code path.

### Prerequisites

- Stage 8: Dynamic Memory.
- Stage 9: structs, unions, and typedefs.

### Topics

- FILE* and fopen modes ("r", "w", "a", "rb", "wb", "r+")
- Reading lines with fgets; reading bytes with fread
- Writing with fputs, fprintf, fwrite
- Binary vs text mode (Windows line-ending translation)
- Random access: fseek, ftell, rewind, fgetpos/fsetpos
- Buffered I/O and fflush
- Error detection: ferror, feof
- Closing on every path: goto cleanup

### Key Concepts

- fopen returns a FILE* handle (NULL on failure); you must fclose it.
- Text mode on Windows translates \n <-> \r\n; binary mode ("rb","wb") does not.
- fread/fwrite return counts, not bytes; short counts signal error or EOF.
- fseek/ftell work for binary files; for text files only SEEK_SET with 0 is portable.
- stdio buffers I/O; fflush writes the buffer; fclose also flushes.
- ferror reports a read/write error; feof reports end-of-file — check after the read returns less than expected.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    FILE *fp = fopen("input.txt", "r");
    if (!fp) {
        perror("fopen input.txt");
        return 1;
    }
    char line[256];
    while (fgets(line, sizeof(line), fp)) {
        fputs(line, stdout);   /* echo each line */
    }
    if (ferror(fp)) {
        perror("fgets");
        fclose(fp);
        return 1;
    }
    fclose(fp);
    return 0;
}
```
Caption: fopen, fgets, fclose

### Common Pitfalls

- Not checking fopen's return — fopen returns NULL on missing file/permission; dereferencing NULL FILE* crashes.
- Using feof to control a read loop — feof is only true AFTER a failed read; loop on `while (fgets(...))` instead.
- Forgetting fclose on error paths — every fopen needs a matching fclose on every code path; use goto cleanup or a single return.
- Confusing text and binary mode on Windows — text mode translates \n to \r\n, corrupting binary data; always use "rb"/"wb" for binary.
- Trusting fseek/ftell for file size — ftell on text mode may not return byte offsets; use stat(2) or fseek(SEEK_END) on binary files only.

### Real-World Applications

- SQLite's pager layer uses pread/pwrite (POSIX) for O(1) random access to the database file's 4 KB pages.
- Git's object store uses zlib-compressed files with fseek to specific byte offsets within pack files for fast object lookup.
- nginx streams large HTTP responses with sendfile(2) instead of fread/fwrite to avoid user-space copies.
- The Unix tool `cat` is essentially a `while (fgets) fputs` loop; modern versions use larger buffers for throughput.

### Interview Questions

- 1. What's the difference between "r" and "rb"? — Text mode may translate line endings on Windows; binary mode is byte-exact.
- 2. Why is `while (!feof(fp))` wrong? — feof is only set AFTER a read fails; loop on the read function's return value instead.
- 3. What does fread return? — The number of ITEMS (not bytes) successfully read; a short count signals EOF or error.
- 4. How do you get the size of a file? — For binary: fseek(SEEK_END) + ftell; portable: stat(2). For text, neither is fully reliable.
- 5. Why buffer I/O? — System calls are expensive; stdio buffers in user space and amortizes the syscall cost over many bytes.

### Mini Project

Build a File Statistics CLI: A program that reads a file and prints line count, word count, and byte count (like wc). Suggested approach:
  - Open argv[1] with fopen; check for NULL
  - Read line by line with fgets into a 4 KB buffer
  - For each line, increment line count; use strtok or manual whitespace scan for word count
  - Track byte count via strlen of each line (or ftell at end)
  - Print "lines words bytes filename" matching wc's output format

### Exercises

1. Copy a file byte-by-byte with fgetc/fputc; then with fread/fwrite of 4 KB blocks; benchmark.
2. Read an entire file into a malloc'd buffer; remember to null-terminate.
3. Use fseek/ftell to print a file's size; compare with stat.
4. Append a line to an existing file using mode "a".
5. Read the first 10 bytes of a binary file and print them as hex.
6. >>> QUIZ (Stage 11) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does fopen return on failure?
9. A) EOF
10. B) -1
11. C) NULL (*)
12. D) An empty FILE*
13. Explanation: fopen returns NULL on failure; you must check before using the handle.
14. Q2: Why is `while (!feof(fp)) fgets(...)` wrong?
15. A) It's slow
16. B) feof doesn't exist
17. C) It only works for binary files
18. D) feof only becomes true AFTER a failed read, causing an extra iteration (*)
19. Explanation: Loop on the read function's return: `while (fgets(...))`. feof is for diagnosing why a read failed.
20. Q3: What does fread return?
21. A) Number of items read (*)
22. B) Bytes read
23. C) 0 on success, non-zero on error
24. D) A FILE*
25. Explanation: fread returns the count of complete items (size n each) read; a short count signals EOF or error.
26. Q4: Which mode opens a file for binary writing without translation?
27. A) "w"
28. B) "wb" (*)
29. C) "w+b"
30. D) "wt"
31. Explanation: "wb" opens for binary writing; on Windows, this avoids \n -> \r\n translation that would corrupt binary data.
32. Q5: What does fseek(SEEK_END, 0) do?
33. A) Reads the last byte
34. B) Truncates the file
35. C) Seeks to the end of the file (*)
36. D) Returns the file size
37. Explanation: SEEK_END anchors the offset from the end; offset 0 means the position just past the last byte.
38. Q6: What does fflush do?
39. A) Closes the file
40. B) Reads ahead
41. C) Locks the file
42. D) Writes the buffer's contents to the underlying file (*)
43. Explanation: fflush forces the user-space buffer to be written via the underlying write syscall; fflush(NULL) flushes all output streams.
44. Q7: How do you check whether a read failed due to an I/O error (not EOF)?
45. A) Check ferror(fp) (*)
46. B) Check the return value of feof
47. C) Check errno
48. D) Check the return value of ftell
49. Explanation: ferror returns non-zero if a previous I/O operation on the stream encountered an error; feof is for EOF.
50. Q8: What does fclose do on a buffered output stream?
51. A) Just frees the FILE*
52. B) Flushes the buffer then frees the FILE* (*)
53. C) Discards the buffer
54. D) Nothing — the OS handles it
55. Explanation: fclose flushes pending writes via fflush, then closes the file descriptor and releases the FILE structure.
56. Q9: What's the safe pattern for closing files in a function with multiple error returns?
57. A) Skip the close on error
58. B) Use a longjmp
59. C) Use goto to a single cleanup label (*)
60. D) Use a separate thread
61. Explanation: goto cleanup centralizes fclose so every error path closes the file before returning.
62. Q10: On Windows, what happens if you read a binary file in text mode ("r")?
63. A) Nothing different
64. B) The file is opened read-only
65. C) Compile error
66. D) \r\n is translated to \n, corrupting binary data (*)
67. Explanation: Text mode translates \r\n -> \n on read; binary data containing 0x0D 0x0A bytes will be silently corrupted.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does fopen return on failure?
  options:
    - EOF
    - "-1"
    - "NULL"
    - An empty FILE*
  correctIndex: 2
  explanation: fopen returns NULL on failure; you must check before using the handle.
- id: q2
  question: Why is `while (!feof(fp)) fgets(...)` wrong?
  options:
    - It's slow
    - feof doesn't exist
    - It only works for binary files
    - feof only becomes true AFTER a failed read, causing an extra iteration
  correctIndex: 3
  explanation: "Loop on the read function's return: `while (fgets(...))`. feof is for diagnosing why a read failed."
- id: q3
  question: What does fread return?
  options:
    - Number of items read
    - Bytes read
    - 0 on success, non-zero on error
    - A FILE*
  correctIndex: 0
  explanation: fread returns the count of complete items (size n each) read; a short count signals EOF or error.
- id: q4
  question: Which mode opens a file for binary writing without translation?
  options:
    - '"w"'
    - '"wb"'
    - '"w+b"'
    - '"wt"'
  correctIndex: 1
  explanation: '"wb" opens for binary writing; on Windows, this avoids \n -> \r\n translation that would corrupt binary data.'
- id: q5
  question: What does fseek(SEEK_END, 0) do?
  options:
    - Reads the last byte
    - Truncates the file
    - Seeks to the end of the file
    - Returns the file size
  correctIndex: 2
  explanation: SEEK_END anchors the offset from the end; offset 0 means the position just past the last byte.
- id: q6
  question: What does fflush do?
  options:
    - Closes the file
    - Reads ahead
    - Locks the file
    - Writes the buffer's contents to the underlying file
    - flushes all output streams.
  correctIndex: 3
  explanation: fflush forces the user-space buffer to be written via the underlying write syscall; fflush(NULL) flushes all output streams.
- id: q7
  question: How do you check whether a read failed due to an I/O error (not EOF)?
  options:
    - "?"
    - Check ferror(fp)
    - Check the return value of feof
    - Check errno
    - Check the return value of ftell
  correctIndex: 1
  explanation: ferror returns non-zero if a previous I/O operation on the stream encountered an error; feof is for EOF.
- id: q8
  question: What does fclose do on a buffered output stream?
  options:
    - Just frees the FILE*
    - Flushes the buffer then frees the FILE*
    - Discards the buffer
    - Nothing — the OS handles it
  correctIndex: 1
  explanation: fclose flushes pending writes via fflush, then closes the file descriptor and releases the FILE structure.
- id: q9
  question: What's the safe pattern for closing files in a function with multiple error returns?
  options:
    - Skip the close on error
    - Use a longjmp
    - Use goto to a single cleanup label
    - Use a separate thread
  correctIndex: 2
  explanation: goto cleanup centralizes fclose so every error path closes the file before returning.
- id: q10
  question: On Windows, what happens if you read a binary file in text mode ("r")?
  options:
    - Nothing different
    - The file is opened read-only
    - Compile error
    - \r\n is translated to \n, corrupting binary data
  correctIndex: 3
  explanation: Text mode translates \r\n -> \n on read; binary data containing 0x0D 0x0A bytes will be silently corrupted.
```

