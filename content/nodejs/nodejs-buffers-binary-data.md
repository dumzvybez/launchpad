---
slug: nodejs-buffers-binary-data
id: nodejs-07
track: nodejs
order: 7
title: Buffers and Binary Data
description: Work with raw bytes using Node's Buffer class, convert between encodings (utf8, base64, hex), and avoid the security pitfall of `Buffer.allocUnsafe`.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=zb3Qk8SG5Ms&t=180s
whyItMatters: Work with raw bytes using Node's Buffer class, convert between encodings (utf8, base64, hex), and avoid the security pitfall of `Buffer. allocUnsafe`.
deepDiveResources:
  - label: W3Schools Node.js
    url: https://www.w3schools.com/nodejs/
    kind: course
  - label: Node.js Official Docs
    url: https://nodejs.org/docs/latest/api/
    kind: doc
---

# Buffers and Binary Data

## Buffers and Binary Data

### Why It Matters

Work with raw bytes using Node's Buffer class, convert between encodings (utf8, base64, hex), and avoid the security pitfall of `Buffer. allocUnsafe`.

Work with raw bytes using Node's Buffer class, convert between encodings (utf8, base64, hex), and avoid the security pitfall of `Buffer.allocUnsafe`.

### Prerequisites

- Stage 1: Getting Started with Node.js.
- Stage 6: Streams (chunks are Buffers).

### Topics

- `Buffer.alloc`, `Buffer.allocUnsafe`, `Buffer.from`
- `Buffer.concat`, `buf.subarray`, `buf.slice` (deprecated)
- Encodings: utf8 (default), ascii, base64, base64url, hex, latin1, utf16le
- `Buffer` extends `Uint8Array` — interop with TypedArrays
- `TextEncoder`/`TextDecoder` (Web standard, available in Node)
- `buf.toString(encoding)` and `Buffer.from(str, encoding)`
- Byte length vs character length (`Buffer.byteLength`)
- Reading/writing numbers: `buf.readUInt32BE`, `buf.writeUInt16LE`, etc.

### Key Concepts

- A Buffer is a fixed-length chunk of raw binary memory, allocated outside V8's heap (in libuv's memory pool).
- `Buffer.allocUnsafe` reuses the pool and may contain old data — only use it when you'll immediately overwrite every byte; otherwise use `Buffer.alloc` (zero-filled).
- `Buffer` extends `Uint8Array` — it works anywhere a `Uint8Array` is expected.
- UTF-8 is the default encoding; characters can be 1-4 bytes, so `str.length` (chars) differs from `Buffer.byteLength(str)` (bytes).
- `Buffer.concat` is the right way to join an array of Buffers; it pre-allocates the total size.

```javascript
const b1 = Buffer.alloc(8);              // 8 zero-filled bytes
const b2 = Buffer.allocUnsafe(8);        // 8 bytes of UNINITIALIZED memory (fast, risky)
b2.fill(0);                              // explicitly zero if you must use allocUnsafe

const b3 = Buffer.from("hello", "utf8"); // <Buffer 68 65 6c 6c 6f>
const b4 = Buffer.from([0x48, 0x49]);     // <Buffer 48 49>
const b5 = Buffer.from("SGVsbG8=", "base64"); // decodes to "Hello"
```
Caption: Creating Buffers

### Common Pitfalls

- Using `Buffer.allocUnsafe` and exposing uninitialized memory — old data in the pool (potentially secrets) leaks to the client; always prefer `Buffer.alloc`.
- Treating `str.length` as byte length — UTF-8 multibyte characters mean `str.length` (chars) ≠ `Buffer.byteLength(str)` (bytes); use byte length for HTTP Content-Length.
- Using the deprecated `buf.slice()` which shares memory with the original — prefer `buf.subarray()` (same semantics) or `Buffer.from(buf)` for an independent copy.
- Converting between encodings via `Buffer.from(str, "hex").toString("utf8")` blindly — invalid byte sequences produce replacement characters; validate first.
- Forgetting that `Buffer` is a `Uint8Array` but adds Node-specific methods — if you pass a Buffer to a Web API expecting `Uint8Array`, it works but you lose `Buffer.concat` etc.

### Real-World Applications

- TLS handshakes use Buffers to frame records; HTTPS servers in Node manipulate raw byte streams.
- Image processing libraries (sharp, jimp) read/write Buffers representing pixel data.
- WebSocket frame encoding/decoding (ws library) uses Buffers for opcode, length, mask, and payload.
- Crypto hashing (`crypto.createHash().update(buffer).digest()`) consumes Buffers.

### Interview Questions

- 1. What's the difference between `Buffer.alloc` and `Buffer.allocUnsafe`? — `alloc` zero-fills the buffer (safe but slower); `allocUnsafe` reuses the pool and may contain stale data (faster but a security risk if exposed).
- 2. Is `Buffer` a `Uint8Array`? — Yes, `Buffer extends Uint8Array`; it works anywhere a `Uint8Array` is expected, plus adds Node-specific helpers like `concat`.
- 3. Why does `str.length` differ from `Buffer.byteLength(str)` for non-ASCII text? — `str.length` counts UTF-16 code units (chars); `Buffer.byteLength` counts UTF-8 bytes; non-ASCII characters take 2-4 bytes in UTF-8.
- 4. How do you safely concatenate an array of Buffers? — `Buffer.concat([a, b, c])` pre-allocates the total size and copies all in one pass; faster and safer than repeated `Buffer.concat` in a loop.
- 5. What's the default encoding when you call `Buffer.from("hello")`? — UTF-8; you can pass a second argument to use base64, hex, ascii, latin1, or utf16le.

### Mini Project

Build a Binary File Hex Editor CLI: A tool that reads a file in chunks and prints a hex dump (offset, hex bytes, ASCII representation) like the `xxd` Unix utility. Suggested approach:
  - Read the file with `fs.createReadStream` in 16-byte chunks
  - For each chunk, format the offset as 8-hex-digit, the bytes as 2-hex-digit space-separated, and the ASCII as printable chars (replace non-printable with '.')
  - Pad the last line to 16 bytes for alignment
  - Add a `--search <hex>` flag to highlight matching bytes
  - Test on a small PNG file and verify the PNG magic bytes appear first

### Exercises

1. Encode "Hello, 世界" to UTF-8 and print the byte length; compare with `str.length`.
2. Base64-encode a Buffer, then decode it back and confirm the round trip.
3. Write a 4-byte big-endian uint32 to a Buffer at offset 0 and read it back.
4. Use `Buffer.concat` to join three Buffers and print the result as a string.
5. Read the first 8 bytes of a PNG file and verify the magic number `89 50 4E 47 0D 0A 1A 0A`.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which method creates a zero-filled Buffer?
9. A) Buffer.allocUnsafe
10. B) Buffer.from
11. C) Buffer.alloc (*)
12. D) Buffer.new
13. Explanation: `Buffer.alloc(n)` returns an n-byte buffer zeroed out — safe to expose. `allocUnsafe` reuses pooled memory that may contain stale data.
14. Q2: Why is `Buffer.allocUnsafe` risky?
15. A) It is slower than alloc
16. B) It only works for large buffers
17. C) It is deprecated
18. D) It may contain uninitialized memory (potentially secrets) (*)
19. Explanation: `allocUnsafe` returns memory from a shared pool without zeroing; if you expose it before overwriting every byte, old data (potentially secrets) leaks.
20. Q3: What does Buffer extend?
21. A) Uint8Array (*)
22. B) Array
23. C) Int32Array
24. D) ArrayBuffer
25. Explanation: `Buffer extends Uint8Array`; it works anywhere a `Uint8Array` is expected, plus adds Node-specific helpers like `concat`.
26. Q4: What is the default encoding for `Buffer.from("hello")`?
27. A) ascii
28. B) utf8 (*)
29. C) base64
30. D) latin1
31. Explanation: UTF-8 is the default; pass a second argument ("base64", "hex", etc.) to use a different encoding.
32. Q5: For "世界", which is true?
33. A) str.length === Buffer.byteLength(str)
34. B) str.length > Buffer.byteLength(str)
35. C) Buffer.byteLength(str) > str.length (*)
36. D) They are unrelated
37. Explanation: `str.length` counts UTF-16 code units (chars); `Buffer.byteLength` counts UTF-8 bytes. Each Chinese char is 3 bytes in UTF-8 but 1 code unit, so bytes > chars.
38. Q6: Which method joins an array of Buffers?
39. A) Buffer.join
40. B) Buffer.merge
41. C) Buffer.combine
42. D) Buffer.concat (*)
43. Explanation: `Buffer.concat([a, b, c])` pre-allocates the total size and copies all in one pass — the correct way to join Buffers.
44. Q7: What does `buf.subarray(0, 5)` return?
45. A) A view sharing memory with the original (*)
46. B) A copy of the first 5 bytes
47. C) A string
48. D) An array of numbers
49. Explanation: `subarray` returns a view into the same memory (no copy); use `Buffer.from(buf.subarray(...))` for an independent copy.
50. Q8: Which writes a big-endian 32-bit integer at offset 0?
51. A) buf.writeInt32LE
52. B) buf.writeUInt32BE (*)
53. C) buf.write32
54. D) buf.setInt32
55. Explanation: `writeUInt32BE(value, offset)` writes a 32-bit unsigned integer in big-endian byte order; `LE` variants are little-endian.
56. Q9: How do you decode a base64 string into a UTF-8 string?
57. A) Buffer.from(b64).toString("utf8") — wrong, defaults to base64 in input
58. B) atob(b64)
59. C) Buffer.from(b64, "base64").toString("utf8") (*)
60. D) b64.decode()
61. Explanation: `Buffer.from(b64, "base64")` decodes base64 to bytes; `.toString("utf8")` then converts bytes to a UTF-8 string.
62. Q10: Which Web-standard APIs are also available in Node for text encoding?
63. A) Buffer and ArrayBuffer only
64. B) FileReader
65. C) BlobReader
66. D) TextEncoder and TextDecoder (*)
67. Explanation: `TextEncoder` (string → Uint8Array) and `TextDecoder` (bytes → string) are Web-standard APIs available globally in Node 18+.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which method creates a zero-filled Buffer?
  options:
    - Buffer.allocUnsafe
    - Buffer.from
    - Buffer.alloc
    - Buffer.new
  correctIndex: 2
  explanation: "`Buffer.alloc(n)` returns an n-byte buffer zeroed out — safe to expose. `allocUnsafe` reuses pooled memory that may contain stale data."
- id: q2
  question: Why is `Buffer.allocUnsafe` risky?
  options:
    - It is slower than alloc
    - It only works for large buffers
    - It is deprecated
    - It may contain uninitialized memory (potentially secrets)
  correctIndex: 3
  explanation: "`allocUnsafe` returns memory from a shared pool without zeroing; if you expose it before overwriting every byte, old data (potentially secrets) leaks."
- id: q3
  question: What does Buffer extend?
  options:
    - Uint8Array
    - Array
    - Int32Array
    - ArrayBuffer
  correctIndex: 0
  explanation: "`Buffer extends Uint8Array`; it works anywhere a `Uint8Array` is expected, plus adds Node-specific helpers like `concat`."
- id: q4
  question: What is the default encoding for `Buffer.from("hello")`?
  options:
    - ascii
    - utf8
    - base64
    - latin1
  correctIndex: 1
  explanation: UTF-8 is the default; pass a second argument ("base64", "hex", etc.) to use a different encoding.
- id: q5
  question: For "世界", which is true?
  options:
    - str.length === Buffer.byteLength(str)
    - str.length > Buffer.byteLength(str)
    - Buffer.byteLength(str) > str.length
    - They are unrelated
  correctIndex: 2
  explanation: "`str.length` counts UTF-16 code units (chars); `Buffer.byteLength` counts UTF-8 bytes. Each Chinese char is 3 bytes in UTF-8 but 1 code unit, so bytes > chars."
- id: q6
  question: Which method joins an array of Buffers?
  options:
    - Buffer.join
    - Buffer.merge
    - Buffer.combine
    - Buffer.concat
  correctIndex: 3
  explanation: "`Buffer.concat([a, b, c])` pre-allocates the total size and copies all in one pass — the correct way to join Buffers."
- id: q7
  question: What does `buf.subarray(0, 5)` return?
  options:
    - A view sharing memory with the original
    - A copy of the first 5 bytes
    - A string
    - An array of numbers
  correctIndex: 0
  explanation: "`subarray` returns a view into the same memory (no copy); use `Buffer.from(buf.subarray(...))` for an independent copy."
- id: q8
  question: Which writes a big-endian 32-bit integer at offset 0?
  options:
    - buf.writeInt32LE
    - buf.writeUInt32BE
    - buf.write32
    - buf.setInt32
  correctIndex: 1
  explanation: "`writeUInt32BE(value, offset)` writes a 32-bit unsigned integer in big-endian byte order; `LE` variants are little-endian."
- id: q9
  question: How do you decode a base64 string into a UTF-8 string?
  options:
    - Buffer.from(b64).toString("utf8") — wrong, defaults to base64 in input
    - atob(b64)
    - Buffer.from(b64, "base64").toString("utf8")
    - b64.decode()
  correctIndex: 2
  explanation: '`Buffer.from(b64, "base64")` decodes base64 to bytes; `.toString("utf8")` then converts bytes to a UTF-8 string.'
- id: q10
  question: Which Web-standard APIs are also available in Node for text encoding?
  options:
    - Buffer and ArrayBuffer only
    - FileReader
    - BlobReader
    - TextEncoder and TextDecoder
  correctIndex: 3
  explanation: "`TextEncoder` (string → Uint8Array) and `TextDecoder` (bytes → string) are Web-standard APIs available globally in Node 18+."
```

