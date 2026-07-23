---
slug: php-file-i-o-uploads
id: php-09
track: php
order: 9
title: File I/O and Uploads
description: Read and write files with `file_get_contents`, `fopen`/`fread`/`fwrite`, handle file uploads safely with `$_FILES` and `move_uploaded_file`, and discover stream wrappers and filters.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=OK_JCtrrv-c&t=6400s
whyItMatters: Read and write files with `file_get_contents`, `fopen`/`fread`/`fwrite`, handle file uploads safely with `$_FILES` and `move_uploaded_file`, and discover stream wrappers and filters.
deepDiveResources:
  - label: W3Schools PHP
    url: https://www.w3schools.com/php/
    kind: course
  - label: PHP Official Docs
    url: https://www.php.net/manual/en/
    kind: doc
---

# File I/O and Uploads

## File I/O and Uploads

### Why It Matters

Read and write files with `file_get_contents`, `fopen`/`fread`/`fwrite`, handle file uploads safely with `$_FILES` and `move_uploaded_file`, and discover stream wrappers and filters.

Read and write files with `file_get_contents`, `fopen`/`fread`/`fwrite`, handle file uploads safely with `$_FILES` and `move_uploaded_file`, and discover stream wrappers and filters.

### Prerequisites

- Stage 4: Functions and Include Files
- Stage 7: Forms, $_GET, $_POST, and Validation

### Topics

- `file_get_contents` and `file_put_contents` for one-shot reads/writes
- `fopen`, `fread`, `fwrite`, `fclose`, `feof` for streamed I/O
- File modes: `r`, `w`, `a`, `r+`, `x`, `c`, `b` (binary) flag
- `$_FILES` superglobal: `name`, `tmp_name`, `size`, `type`, `error`
- `move_uploaded_file` vs `rename`
- Upload validation: size, MIME type, extension allow-list
- `is_uploaded_file` defense
- Directory traversal prevention: `realpath`, `basename`
- Stream wrappers: `file://`, `http://`, `php://`, `data://`, `compress.zlib://`
- `SplFileInfo` and `DirectoryIterator` for OO file handling
- `flock` for file locking (shared, exclusive)

### Key Concepts

- `$_FILES['field']['error']` is always present and must be checked — `UPLOAD_ERR_OK` (0) means success; other codes (`UPLOAD_ERR_INI_SIZE`, `UPLOAD_ERR_PARTIAL`, etc.) indicate specific failures.
- `$_FILES['field']['type']` is set by the browser and trivially spoofable; never trust it for security. Use `finfo_file()` to detect MIME from file contents.
- `move_uploaded_file` is the safe way to move an uploaded file — it checks `is_uploaded_file` internally, preventing path-traversal tricks where an attacker submits `/etc/passwd` as a "file".
- `file_get_contents('php://input')` reads the raw request body; `file_get_contents('https://...')` does an HTTP GET (subject to `allow_url_fopen`).
- Locking: `flock($fp, LOCK_EX)` for exclusive (write) lock, `LOCK_SH` for shared (read), `LOCK_UN` to release. Without locking, concurrent writes can corrupt files.

```php
<?php
// Read entire file
$content = file_get_contents('/path/to/file.txt');
if ($content === false) { throw new RuntimeException('Read failed'); }

// Write atomically (with explicit lock)
file_put_contents('/path/to/out.txt', $content, LOCK_EX);

// Append
file_put_contents('/path/to/log.txt', "new line\n", FILE_APPEND | LOCK_EX);
```
Caption: One-shot read/write

### Common Pitfalls

- Trusting `$_FILES['field']['type']` — it's set by the browser and trivially spoofable; use `finfo_file()` to detect MIME from file contents.
- Using the client-supplied `name` as the destination filename — attackers can submit `../../etc/passwd` or `evil.php`; generate a random name with `bin2hex(random_bytes(16))`.
- Calling `rename()` instead of `move_uploaded_file` — `rename` does not verify the file was actually uploaded via HTTP POST, so an attacker can sometimes move arbitrary files; `move_uploaded_file` checks `is_uploaded_file`.
- Forgetting the `b` flag on Windows — `fopen('file', 'r')` on Windows does CR/LF translation that corrupts binary files; always use `'rb'`, `'wb'`, `'ab'` for binary-safe access (cross-platform safe).
- Not checking `upload_max_filesize` and `post_max_size` — large uploads silently fail with `UPLOAD_ERR_INI_SIZE` if they exceed php.ini limits; check both values and document them.

### Real-World Applications

- WordPress's media uploader uses `move_uploaded_file` plus `wp_check_filetype` (which uses `finfo` internally) to safely accept images, PDFs, and archives.
- Slack's file-sharing API uses `finfo` for MIME detection and stores files in S3 with random UUIDs as keys, never the client-supplied name.
- Wikipedia's upload handler (`Special:Upload`) uses a strict allow-list of extensions plus `finfo`, plus virus scanning, before accepting any file.
- Mailchimp uses `SplFileInfo` and `DirectoryIterator` to walk template directories, with `realpath`-based traversal protection.

### Interview Questions

- 1. Why is `$_FILES['field']['type']` unreliable? — It's set by the browser and trivially spoofable; use `finfo_file()` to detect MIME from file contents.
- 2. Why use `move_uploaded_file` instead of `rename`? — `move_uploaded_file` checks `is_uploaded_file` internally, preventing attackers from moving arbitrary server files (e.g. `/etc/passwd`) via the upload endpoint.
- 3. What does the `b` flag do in `fopen` modes? — Binary mode: disables CR/LF translation on Windows, which would corrupt binary files. Use `'rb'`/`'wb'` cross-platform for safety.
- 4. What is `flock(LOCK_EX)` for? — Exclusive (write) file locking to prevent concurrent writes from corrupting a file; `LOCK_SH` is shared (read) lock, `LOCK_UN` releases.
- 5. How do you prevent directory traversal when serving user-named files? — Use `realpath()` and check the result starts with your base directory's `realpath`; reject anything that escapes the base.

### Mini Project

Build an Image Upload Gallery: A form that accepts up to 3 image uploads, validates each with `finfo` for MIME and a 2 MB size limit, stores them with random names in `uploads/`, and renders an `<img>` gallery of all stored images. Suggested approach:
  - Use the `multiple` HTML attribute and `name="photos[]"`
  - Iterate `$_FILES['photos']['error']` as an array (multi-file)
  - Validate each with `finfo->file()` against an allow-list
  - Generate random names with `bin2hex(random_bytes(16))`
  - Read the gallery directory with `DirectoryIterator` to render existing images

### Exercises

1. Use `file_put_contents('log.txt', "msg\n", FILE_APPEND | LOCK_EX)` to append to a log file safely.
2. Build a single-file upload form; validate the file with `finfo` and save with a random name via `move_uploaded_file`.
3. Open a large file with `fopen` and `fread` in 8 KB chunks; print the byte count.
4. Implement directory-traversal protection: accept `?file=foo.txt` and reject `?file=../../etc/passwd` using `realpath`.
5. List all `.jpg` files in a directory using `DirectoryIterator` and `SplFileInfo::getExtension()`.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why is `$_FILES['field']['type']` unreliable?
9. A) It's set by the browser and trivially spoofable (*)
10. B) It's always null
11. C) It's only set for images
12. D) It uses the wrong MIME database
13. Explanation: The `type` field is the browser-supplied Content-Type, easily spoofed. Use `finfo_file()` to detect MIME from file contents.
14. Q2: Which function safely moves an uploaded file?
15. A) rename
16. B) move_uploaded_file (*)
17. C) copy
18. D) fopen + fwrite
19. Explanation: `move_uploaded_file` checks `is_uploaded_file` internally, preventing attackers from moving arbitrary server files via the upload endpoint.
20. Q3: What does the `b` flag do in `fopen('file', 'rb')`?
21. A) Buffered mode
22. B) Backup mode
23. C) Binary-safe mode (no CR/LF translation on Windows) (*)
24. D) Block-mode I/O
25. Explanation: The `b` flag disables CR/LF translation on Windows, which would corrupt binary files. Cross-platform-safe for any non-text file.
26. Q4: What is `flock($fp, LOCK_EX)` used for?
27. A) Encrypting a file
28. B) Exclusive access to a database
29. C) Locking a session
30. D) Exclusive (write) file locking to prevent concurrent-write corruption (*)
31. Explanation: `LOCK_EX` is an exclusive lock (one writer at a time); `LOCK_SH` is shared (multiple readers); `LOCK_UN` releases.
32. Q5: What value of `$_FILES['field']['error']` indicates a successful upload?
33. A) 0 (UPLOAD_ERR_OK) (*)
34. B) 1
35. C) -1
36. D) null
37. Explanation: `UPLOAD_ERR_OK` (constant value 0) means success; other codes (1-8) indicate specific failures like size limits or partial uploads.
38. Q6: How do you prevent directory traversal when serving user-named files?
39. A) Use `basename()` only
40. B) Use `realpath()` and verify the result starts with the base directory's `realpath` (*)
41. C) Use `urlencode`
42. D) Strip `..` from the input
43. Explanation: `realpath()` resolves symlinks and `..`; check that the result starts with your base directory's resolved path. `basename` alone is insufficient if the base path is wrong.
44. Q7: Which PHP function reads an entire file into a string?
45. A) fread_all
46. B) readfile
47. C) file_get_contents (*)
48. D) fgets
49. Explanation: `file_get_contents` reads the entire file into a string; `readfile` writes it directly to output (no return value of the contents); `fread` is for chunked reads.
50. Q8: What does `is_uploaded_file()` check?
51. A) Whether the file is in /tmp
52. B) Whether the file is an image
53. C) Whether the file is readable
54. D) Whether the file was uploaded via HTTP POST (*)
55. Explanation: `is_uploaded_file()` returns true only for files that were uploaded via HTTP POST, preventing attackers from moving arbitrary server files.
56. Q9: Which `finfo` flag returns the MIME type?
57. A) FILEINFO_MIME_TYPE (*)
58. B) FILEINFO_EXTENSION
59. C) FILEINFO_RAW
60. D) FILEINFO_ENCODING
61. Explanation: `FILEINFO_MIME_TYPE` returns just the MIME type (e.g. `image/png`); `FILEINFO_MIME` returns type plus encoding (e.g. `image/png; charset=binary`).
62. Q10: What does `file_put_contents($path, $data, LOCK_EX)` do?
63. A) Writes with an exclusive lock
64. B) Writes atomically with an exclusive lock to prevent concurrent corruption (*)
65. C) Appends with a lock
66. D) Encrypts the data
67. Explanation: The `LOCK_EX` flag acquires an exclusive lock during the write, preventing other processes from corrupting the file by writing simultaneously.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why is `$_FILES['field']['type']` unreliable?
  options:
    - It's set by the browser and trivially spoofable
    - It's always null
    - It's only set for images
    - It uses the wrong MIME database
  correctIndex: 0
  explanation: The `type` field is the browser-supplied Content-Type, easily spoofed. Use `finfo_file()` to detect MIME from file contents.
- id: q2
  question: Which function safely moves an uploaded file?
  options:
    - rename
    - move_uploaded_file
    - copy
    - fopen + fwrite
  correctIndex: 1
  explanation: "`move_uploaded_file` checks `is_uploaded_file` internally, preventing attackers from moving arbitrary server files via the upload endpoint."
- id: q3
  question: What does the `b` flag do in `fopen('file', 'rb')`?
  options:
    - Buffered mode
    - Backup mode
    - Binary-safe mode (no CR/LF translation on Windows)
    - Block-mode I/O
  correctIndex: 2
  explanation: The `b` flag disables CR/LF translation on Windows, which would corrupt binary files. Cross-platform-safe for any non-text file.
- id: q4
  question: What is `flock($fp, LOCK_EX)` used for?
  options:
    - "` used for?"
    - Encrypting a file
    - Exclusive access to a database
    - Locking a session
    - Exclusive (write) file locking to prevent concurrent-write corruption
  correctIndex: 4
  explanation: "`LOCK_EX` is an exclusive lock (one writer at a time); `LOCK_SH` is shared (multiple readers); `LOCK_UN` releases."
- id: q5
  question: What value of `$_FILES['field']['error']` indicates a successful upload?
  options:
    - 0 (UPLOAD_ERR_OK)
    - "1"
    - "-1"
    - "null"
  correctIndex: 0
  explanation: "`UPLOAD_ERR_OK` (constant value 0) means success; other codes (1-8) indicate specific failures like size limits or partial uploads."
- id: q6
  question: How do you prevent directory traversal when serving user-named files?
  options:
    - Use `basename()` only
    - Use `realpath()` and verify the result starts with the base directory's `realpath`
    - Use `urlencode`
    - Strip `..` from the input
  correctIndex: 1
  explanation: "`realpath()` resolves symlinks and `..`; check that the result starts with your base directory's resolved path. `basename` alone is insufficient if the base path is wrong."
- id: q7
  question: Which PHP function reads an entire file into a string?
  options:
    - fread_all
    - readfile
    - file_get_contents
    - fgets
  correctIndex: 2
  explanation: "`file_get_contents` reads the entire file into a string; `readfile` writes it directly to output (no return value of the contents); `fread` is for chunked reads."
- id: q8
  question: What does `is_uploaded_file()` check?
  options:
    - Whether the file is in /tmp
    - Whether the file is an image
    - Whether the file is readable
    - Whether the file was uploaded via HTTP POST
  correctIndex: 3
  explanation: "`is_uploaded_file()` returns true only for files that were uploaded via HTTP POST, preventing attackers from moving arbitrary server files."
- id: q9
  question: Which `finfo` flag returns the MIME type?
  options:
    - FILEINFO_MIME_TYPE
    - FILEINFO_EXTENSION
    - FILEINFO_RAW
    - FILEINFO_ENCODING
  correctIndex: 0
  explanation: "`FILEINFO_MIME_TYPE` returns just the MIME type (e.g. `image/png`); `FILEINFO_MIME` returns type plus encoding (e.g. `image/png; charset=binary`)."
- id: q10
  question: What does `file_put_contents($path, $data, LOCK_EX)` do?
  options:
    - "` do?"
    - Writes with an exclusive lock
    - Writes atomically with an exclusive lock to prevent concurrent corruption
    - Appends with a lock
    - Encrypts the data
  correctIndex: 2
  explanation: The `LOCK_EX` flag acquires an exclusive lock during the write, preventing other processes from corrupting the file by writing simultaneously.
```

