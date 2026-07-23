---
slug: fastapi-file-uploads-streaming-responses
id: fastapi-14
track: fastapi
order: 14
title: File Uploads and Streaming Responses
description: Accept file uploads with `UploadFile` (and `File(...)`), stream large responses with `StreamingResponse`, return files with `FileResponse`, and avoid the memory blowup pitfalls.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=tLKKmouUams&t=3900s
whyItMatters: Accept file uploads with `UploadFile` (and `File(. )`), stream large responses with `StreamingResponse`, return files with `FileResponse`, and avoid the memory blowup pitfalls.
deepDiveResources:
  - label: W3Schools FastAPI
    url: https://fastapi.tiangolo.com/learn/
    kind: course
  - label: FastAPI Official Docs
    url: https://fastapi.tiangolo.com/
    kind: doc
---

# File Uploads and Streaming Responses

## File Uploads and Streaming Responses

### Why It Matters

Accept file uploads with `UploadFile` (and `File(. )`), stream large responses with `StreamingResponse`, return files with `FileResponse`, and avoid the memory blowup pitfalls.

Accept file uploads with `UploadFile` (and `File(...)`), stream large responses with `StreamingResponse`, return files with `FileResponse`, and avoid the memory blowup pitfalls.

### Prerequisites

- Stage 4: Pydantic Models and Validation
- Stage 9: async/await in FastAPI
- Familiarity with multipart/form-data.

### Topics

- `UploadFile` (spooled to disk past 1MB) vs `bytes` (fully in memory)
- `File(...)` and `Form(...)` for multipart fields
- Multiple files: `list[UploadFile]`
- Reading in chunks: `await file.read(chunk_size)` vs `await file.read()`
- `StreamingResponse` with a sync or async generator
- `FileResponse` for serving files with proper headers
- `Response(content=..., media_type="application/octet-stream")` for raw bytes
- Size limits and `python-multipart` dependency

### Key Concepts

- `UploadFile` spools to a temp file past 1MB by default, avoiding memory blowup; `bytes` loads the whole file into RAM.
- Read large uploads in chunks (`async for chunk in file`), not `await file.read()` — the latter loads the entire file.
- `StreamingResponse` sends bytes as they're produced, keeping memory low for large or infinite responses.
- `FileResponse` is the easiest way to serve a file with the right `Content-Type` and `Content-Disposition`.
- You must `pip install python-multipart` to use `UploadFile`/`Form` — FastAPI prints a warning otherwise.

```python
from fastapi import FastAPI, UploadFile, File

app = FastAPI()

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    contents = await file.read()  # OK for small files
    return {"filename": file.filename, "size": len(contents)}
```
Caption: Single file upload

### Common Pitfalls

- Calling `await file.read()` for large uploads — loads the whole file into memory; stream in chunks with `await file.read(N)` or `async for chunk in file`.
- Forgetting `python-multipart` — FastAPI prints a warning and uploads fail with 500; always add to requirements.
- Trusting `file.filename` for the on-disk path — path traversal attack; sanitize with `Path(filename).name` or generate a UUID.
- Using `StreamingResponse` with a sync generator — works but blocks the event loop; use an async generator or wrap with `run_in_threadpool`.
- Not setting `Content-Disposition: attachment; filename="..."` on downloads — browsers inline-display instead of downloading.

### Real-World Applications

- Stripe's file upload endpoints (dispute evidence, identity docs) accept multipart uploads with size limits — same `UploadFile` pattern.
- Slack's file upload API streams large files to S3; FastAPI's chunked read + `boto3` (via `run_in_threadpool`) is the small-scale analog.
- Cloudinary's upload API accepts multipart uploads with chunked transfer; FastAPI's `UploadFile` spools past 1MB by default.
- Netflix's subtitle ingestion accepts large `.vtt` files via streaming upload, then processes them in a queue.

### Interview Questions

- 1. What's the difference between `UploadFile` and `bytes`? — `UploadFile` spools to disk past 1MB (low memory); `bytes` loads the whole file into RAM.
- 2. How do you read a large upload without blowing memory? — Loop `while chunk := await file.read(N)` (or `async for chunk in file`); never `await file.read()` for big files.
- 3. Which dependency is required for `UploadFile`? — `python-multipart`; without it, FastAPI prints a warning and the upload fails.
- 4. When do you use `StreamingResponse` vs `FileResponse`? — `StreamingResponse` for generated/transformed bytes; `FileResponse` for serving an existing file with correct headers.
- 5. Why must you sanitize `file.filename`? — Untrusted filenames can contain `../` for path traversal; use `Path(filename).name` or generate a UUID.

### Mini Project

Build a "Chunked Upload + Download" Service: A POST `/upload` endpoint that streams a file to disk in 1MB chunks, returns a UUID, and a GET `/download/{uuid}` endpoint that streams it back via `FileResponse` with `Content-Disposition: attachment`. Suggested approach:
  - Generate a UUID per upload; save under `/storage/{uuid}.bin`
  - Use `while chunk := await file.read(1024*1024): out.write(chunk)`
  - Return `{"id": uuid, "size": ..., "filename": file.filename}`
  - In the GET route, return `FileResponse(path, filename=original, media_type="application/octet-stream")`
  - Test with `curl -F "file=@big.bin" /upload` and `curl -OJ /download/<uuid>`

### Exercises

1. Add a single-file upload endpoint that returns filename + size; test with `curl -F`.
2. Convert it to chunked reads (1MB) and upload a 100MB file; verify memory stays low.
3. Add a `list[UploadFile]` endpoint and confirm multiple files are accepted.
4. Serve a generated CSV via `StreamingResponse` with an async generator yielding rows.
5. >>> QUIZ (Stage 14) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Where does `UploadFile` spool large uploads by default?
8. A) In Redis
9. B) To a temp file past 1MB (*)
10. C) Fully in memory
11. D) To the database
12. Explanation: `UploadFile` uses `SpooledTemporaryFile` with a 1MB threshold; above that, it transparently writes to disk.
13. Q2: Which dependency is required for `UploadFile` to work?
14. A) requests
15. B) boto3
16. C) python-multipart (*)
17. D) aiofiles
18. Explanation: `python-multipart` parses multipart/form-data; without it FastAPI logs a warning and the upload fails.
19. Q3: How should you read a large upload to avoid memory blowup?
20. A) `await file.read()` (whole file)
21. B) `file.read().split()`
22. C) `bytes(file)`
23. D) `await file.read(1024*1024)` in a loop (*)
24. Explanation: `await file.read()` loads the whole file into RAM; chunked reads keep memory bounded.
25. Q4: How do you accept multiple files in one request?
26. A) `files: Annotated[list[UploadFile], File()]` (*)
27. B) `file: UploadFile = File(..., multiple=True)`
28. C) `files: UploadFile[]`
29. D) `files: list[bytes]`
30. Explanation: A `list[UploadFile]` parameter (with `File()`) accepts multiple files; FastAPI collects them into a list.
31. Q5: Which response class streams bytes from a generator?
32. A) `PlainTextResponse`
33. B) `StreamingResponse` (*)
34. C) `HTMLResponse`
35. D) `JSONResponse`
36. Explanation: `StreamingResponse` accepts a sync or async generator and sends chunks as they're produced.
37. Q6: Which response class is easiest for serving an existing file?
38. A) `StreamingResponse`
39. B) `JSONResponse`
40. C) `FileResponse` (*)
41. D) `Response`
42. Explanation: `FileResponse(path, filename=...)` sets `Content-Type`, `Content-Length`, and `Content-Disposition` automatically.
43. Q7: Why must you sanitize `file.filename`?
44. A) Filenames are case-sensitive
45. B) Filenames can include emoji
46. C) Filenames are too long
47. D) Filenames can contain `../` enabling path traversal (*)
48. Explanation: Untrusted filenames can be `../../etc/passwd`; use `Path(filename).name` or generate a UUID.
49. Q8: Which header forces a download instead of inline display?
50. A) `Content-Disposition: attachment; filename="x.bin"` (*)
51. B) `Content-Type: application/octet-stream`
52. C) `X-Download: yes`
53. D) `Cache-Control: no-store`
54. Explanation: `Content-Disposition: attachment` tells the browser to save rather than render the file.
55. Q9: What happens with a sync generator in `StreamingResponse`?
56. A) It doesn't work
57. B) It works but blocks the event loop between yields (*)
58. C) It's automatically wrapped
59. D) It raises TypeError
60. Explanation: Sync generators are supported but each iteration runs on the event loop; use an async generator or `run_in_threadpool` for blocking sources.
61. Q10: Which is a safe default chunk size for streaming uploads?
62. A) 1 byte
63. B) 1KB
64. C) 1MB (*)
65. D) The whole file
66. Explanation: 1MB is a common tradeoff: small enough to bound memory, large enough to amortize I/O overhead.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Where does `UploadFile` spool large uploads by default?
  options:
    - In Redis
    - To a temp file past 1MB
    - Fully in memory
    - To the database
  correctIndex: 1
  explanation: "`UploadFile` uses `SpooledTemporaryFile` with a 1MB threshold; above that, it transparently writes to disk."
- id: q2
  question: Which dependency is required for `UploadFile` to work?
  options:
    - requests
    - boto3
    - python-multipart
    - aiofiles
  correctIndex: 2
  explanation: "`python-multipart` parses multipart/form-data; without it FastAPI logs a warning and the upload fails."
- id: q3
  question: How should you read a large upload to avoid memory blowup?
  options:
    - "`await file.read()` (whole file)"
    - "`file.read().split()`"
    - "`bytes(file)`"
    - "`await file.read(1024*1024)` in a loop"
  correctIndex: 3
  explanation: "`await file.read()` loads the whole file into RAM; chunked reads keep memory bounded."
- id: q4
  question: How do you accept multiple files in one request?
  options:
    - "`files: Annotated[list[UploadFile], File()]`"
    - "`file: UploadFile = File(..., multiple=True)`"
    - "`files: UploadFile[]`"
    - "`files: list[bytes]`"
  correctIndex: 0
  explanation: A `list[UploadFile]` parameter (with `File()`) accepts multiple files; FastAPI collects them into a list.
- id: q5
  question: Which response class streams bytes from a generator?
  options:
    - "`PlainTextResponse`"
    - "`StreamingResponse`"
    - "`HTMLResponse`"
    - "`JSONResponse`"
  correctIndex: 1
  explanation: "`StreamingResponse` accepts a sync or async generator and sends chunks as they're produced."
- id: q6
  question: Which response class is easiest for serving an existing file?
  options:
    - "`StreamingResponse`"
    - "`JSONResponse`"
    - "`FileResponse`"
    - "`Response`"
  correctIndex: 2
  explanation: "`FileResponse(path, filename=...)` sets `Content-Type`, `Content-Length`, and `Content-Disposition` automatically."
- id: q7
  question: Why must you sanitize `file.filename`?
  options:
    - Filenames are case-sensitive
    - Filenames can include emoji
    - Filenames are too long
    - Filenames can contain `../` enabling path traversal
  correctIndex: 3
  explanation: Untrusted filenames can be `../../etc/passwd`; use `Path(filename).name` or generate a UUID.
- id: q8
  question: Which header forces a download instead of inline display?
  options:
    - '`Content-Disposition: attachment; filename="x.bin"`'
    - "`Content-Type: application/octet-stream`"
    - "`X-Download: yes`"
    - "`Cache-Control: no-store`"
  correctIndex: 0
  explanation: "`Content-Disposition: attachment` tells the browser to save rather than render the file."
- id: q9
  question: What happens with a sync generator in `StreamingResponse`?
  options:
    - It doesn't work
    - It works but blocks the event loop between yields
    - It's automatically wrapped
    - It raises TypeError
  correctIndex: 1
  explanation: Sync generators are supported but each iteration runs on the event loop; use an async generator or `run_in_threadpool` for blocking sources.
- id: q10
  question: Which is a safe default chunk size for streaming uploads?
  options:
    - 1 byte
    - 1KB
    - 1MB
    - The whole file
  correctIndex: 2
  explanation: "1MB is a common tradeoff: small enough to bound memory, large enough to amortize I/O overhead."
```

