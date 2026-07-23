---
slug: ruby-file-i-o-serialization
id: ruby-12
track: ruby
order: 12
title: File I/O and Serialization
description: Read and write files with the File class, serialize to JSON, YAML, and Marshal, and avoid deserialization security traps.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=7600s
whyItMatters: Read and write files with the File class, serialize to JSON, YAML, and Marshal, and avoid deserialization security traps.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# File I/O and Serialization

## File I/O and Serialization

### Why It Matters

Read and write files with the File class, serialize to JSON, YAML, and Marshal, and avoid deserialization security traps.

Read and write files with the File class, serialize to JSON, YAML, and Marshal, and avoid deserialization security traps.

### Prerequisites

- Stage 11: Exception Handling and Custom Errors
- Familiarity with begin/rescue/ensure.

### Topics

- File.read, File.write, File.foreach, File.open with block
- File modes: r, w, a, r+, w+, b (binary)
- binread/binwrite for binary data
- JSON.generate / JSON.parse (and symbolize_names)
- YAML.dump / YAML.load / YAML.safe_load
- Marshal.dump / Marshal.load (and why it's unsafe)
- Pathname for cross-platform path manipulation
- Tempfile for safe scratch files

### Key Concepts

- Use File.open(path) { |f| ... } (block form) to guarantee the file is closed, even on exception.
- File.foreach streams a file line-by-line without loading it all into memory — ideal for large files.
- JSON.parse with symbolize_names: true returns symbol keys (more idiomatic than string keys).
- YAML.load is safe by default in Ruby 3.1+; for older Ruby or untrusted input, use YAML.safe_load.
- Marshal is Ruby-only and insecure — never Marshal.load untrusted data (RCE risk via deserialization gadgets).
- JSON has no Symbol type; symbols serialize as strings and stay strings on parse.

```ruby
# Read entire file as a string
content = File.read('data.txt')

# Read lines into an array (without loading huge file all at once, use foreach)
File.foreach('data.txt') do |line|
  puts line.chomp   # chomp removes trailing newline
end

# Write (overwrites)
File.write('out.txt', "hello\n")

# Append
File.write('out.txt', "more\n", mode: 'a')

# Block form auto-closes the file (like Python's with):
File.open('out.txt', 'r') do |f|
  f.each_line { |line| puts line.chomp }
end   # file is closed here, even on exception
```
Caption: Reading and writing files

### Common Pitfalls

- Reading a huge file with File.read — Use File.foreach to stream line-by-line; File.read loads the entire file into memory.
- Forgetting to close files — Use the block form File.open(path) { |f| ... } — the file is closed automatically, even on exception.
- Marshal.load on untrusted data — Marshal can instantiate arbitrary classes (deserialization RCE); use JSON or YAML.safe_load for untrusted input.
- YAML.load on old Ruby without safe_load — Prefer YAML.safe_load explicitly, even on Ruby 3.1+ where load is safe by default — clarity over implicit safety.
- Confusing JSON string keys with symbol keys — JSON.parse returns string keys by default; pass symbolize_names: true to convert them to symbols for idiomatic access.

### Real-World Applications

- Rails uses YAML for database.yml, secrets.yml, and config files; AR models use Marshal for fragment caching.
- Shopify's data pipeline uses JSON.parse with symbolize_names to ingest millions of webhook payloads per day.
- GitHub's config loader uses YAML.safe_load to prevent object-injection attacks from contributor-submitted YAML configs.
- Stripe's batch import tools use File.foreach to stream multi-GB CSV files without blowing memory.

### Interview Questions

- 1. Why use File.open(path) { |f| ... } (block form)? — Auto-closes the file even on exception — safer than manual close in ensure.
- 2. How do you stream a large file line-by-line? — Use File.foreach(path) { |line| ... } — it doesn't load the whole file into memory.
- 3. What does JSON.parse with symbolize_names: true do? — Returns symbol keys instead of string keys for idiomatic hash access.
- 4. Why avoid Marshal.load on untrusted data? — Marshal can instantiate arbitrary classes, enabling RCE via deserialization gadgets.
- 5. What's safe about YAML.safe_load vs YAML.load? — safe_load only permits a whitelist of classes; load (in old Ruby) could instantiate any class, enabling object injection.

### Mini Project

Build a JSON-backed Key-Value Store: A small persistent KV store that
reads a JSON file at startup, supports get/set/delete, and atomically
writes back on every change. Suggested approach:
Suggested approach:
  - Load data with JSON.parse(File.read(path), symbolize_names: true) on init
  - Implement get/set/delete on a Hash
  - Write atomically: write to .tmp then File.rename
  - Wrap all IO in begin/rescue Errno::ENOENT
  - Add a pretty-print option for human-readable output

### Exercises

1. Use File.foreach to count lines in a large file without loading it all.
2. Write a hash to JSON with JSON.pretty_generate and read it back with symbolize_names: true.
3. Use YAML.safe_load to read a config.yml and print the parsed structure.
4. Use Tempfile to create a scratch file and write/read data, then close it.
5. Marshal.dump an object, write to a file, then Marshal.load and inspect — note the security caveat.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why prefer File.open(path) { |f| ... } (block form)?
9. A) Faster than open/close
10. B) Required by RuboCop
11. C) It's the only way to read
12. D) Auto-closes the file even on exception (*)
13. Explanation: The block form guarantees the file is closed when the block exits — even on exception.
14. Q2: Which method streams a large file line-by-line without loading all into memory?
15. A) File.foreach (*)
16. B) File.read
17. C) File.readlines
18. D) File.load
19. Explanation: File.foreach yields each line as it reads — constant memory for any file size.
20. Q3: What does JSON.parse(s, symbolize_names: true) return?
21. A) A hash with string keys
22. B) A hash with symbol keys (*)
23. C) An OpenStruct
24. D) Raises
25. Explanation: symbolize_names converts JSON string keys to symbols for idiomatic access.
26. Q4: Why is Marshal.load unsafe on untrusted data?
27. A) It's slower than JSON
28. B) It loses data
29. C) It can instantiate arbitrary classes (RCE) (*)
30. D) It only works on small objects
31. Explanation: Marshal can deserialize any Ruby object including gadgets that execute code — use JSON for untrusted input.
32. Q5: Which YAML method is safest for untrusted input?
33. A) YAML.load
34. B) YAML.load_file
35. C) YAML.unsafe_load
36. D) YAML.safe_load (*)
37. Explanation: safe_load permits only a whitelist of classes; load and unsafe_load can instantiate any class.
38. Q6: What does File.write(path, content, mode: 'a') do?
39. A) Appends to the file (*)
40. B) Overwrites the file
41. C) Creates a binary file
42. D) Raises if file exists
43. Explanation: mode: 'a' opens in append mode; default mode is 'w' (overwrite).
44. Q7: How do you read binary data?
45. A) File.read (always binary)
46. B) File.binread (*)
47. C) File.read_binary
48. D) File.read(mode: 'b')
49. Explanation: binread reads in binary mode without encoding conversion — use binwrite to write binary.
50. Q8: What does Tempfile provide?
51. A) A file that never closes
52. B) A faster File class
53. C) A file that's auto-deleted when garbage collected (*)
54. D) A memory-only file
55. Explanation: Tempfile creates a unique scratch file in /tmp that's removed when the object is GC'd (or close! is called).
56. Q9: What's the issue with reading a 10GB file via File.read?
57. A) It's not allowed
58. B) It's slower than foreach
59. C) Requires root
60. D) Loads all 10GB into memory (*)
61. Explanation: File.read loads the entire file into a single string — use File.foreach for streaming.
62. Q10: What does `f.each_line { |line| ... }` yield?
63. A) Each line INCLUDING the trailing newline (*)
64. B) Each line WITHOUT the newline
65. C) Words split by spaces
66. D) Characters
67. Explanation: each_line includes the newline; call .chomp on each line to strip it.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why prefer File.open(path) { |f| ... } (block form)?
  options:
    - Faster than open/close
    - Required by RuboCop
    - It's the only way to read
    - Auto-closes the file even on exception
  correctIndex: 3
  explanation: The block form guarantees the file is closed when the block exits — even on exception.
- id: q2
  question: Which method streams a large file line-by-line without loading all into memory?
  options:
    - File.foreach
    - File.read
    - File.readlines
    - File.load
  correctIndex: 0
  explanation: File.foreach yields each line as it reads — constant memory for any file size.
- id: q3
  question: "What does JSON.parse(s, symbolize_names: true) return?"
  options:
    - A hash with string keys
    - A hash with symbol keys
    - An OpenStruct
    - Raises
  correctIndex: 1
  explanation: symbolize_names converts JSON string keys to symbols for idiomatic access.
- id: q4
  question: Why is Marshal.load unsafe on untrusted data?
  options:
    - It's slower than JSON
    - It loses data
    - It can instantiate arbitrary classes (RCE)
    - It only works on small objects
  correctIndex: 2
  explanation: Marshal can deserialize any Ruby object including gadgets that execute code — use JSON for untrusted input.
- id: q5
  question: Which YAML method is safest for untrusted input?
  options:
    - YAML.load
    - YAML.load_file
    - YAML.unsafe_load
    - YAML.safe_load
  correctIndex: 3
  explanation: safe_load permits only a whitelist of classes; load and unsafe_load can instantiate any class.
- id: q6
  question: "What does File.write(path, content, mode: 'a') do?"
  options:
    - Appends to the file
    - Overwrites the file
    - Creates a binary file
    - Raises if file exists
  correctIndex: 0
  explanation: "mode: 'a' opens in append mode; default mode is 'w' (overwrite)."
- id: q7
  question: How do you read binary data?
  options:
    - File.read (always binary)
    - File.binread
    - File.read_binary
    - "File.read(mode: 'b')"
  correctIndex: 1
  explanation: binread reads in binary mode without encoding conversion — use binwrite to write binary.
- id: q8
  question: What does Tempfile provide?
  options:
    - A file that never closes
    - A faster File class
    - A file that's auto-deleted when garbage collected
    - A memory-only file
  correctIndex: 2
  explanation: Tempfile creates a unique scratch file in /tmp that's removed when the object is GC'd (or close! is called).
- id: q9
  question: What's the issue with reading a 10GB file via File.read?
  options:
    - It's not allowed
    - It's slower than foreach
    - Requires root
    - Loads all 10GB into memory
  correctIndex: 3
  explanation: File.read loads the entire file into a single string — use File.foreach for streaming.
- id: q10
  question: What does `f.each_line { |line| ... }` yield?
  options:
    - Each line INCLUDING the trailing newline
    - Each line WITHOUT the newline
    - Words split by spaces
    - Characters
  correctIndex: 0
  explanation: each_line includes the newline; call .chomp on each line to strip it.
```

