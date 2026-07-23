---
slug: python-error-handling-exceptions-custom-errors
id: python-12
track: python
order: 12
title: Error Handling — Exceptions and Custom Errors
description: Handle errors gracefully with try/except/else/finally, design a custom exception hierarchy, and avoid the deadly bare `except` that swallows KeyboardInterrupt.
difficulty: intermediate
estMinutes: 240
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=rfscVS0vtbw&t=13100s
whyItMatters: Handle errors gracefully with try/except/else/finally, design a custom exception hierarchy, and avoid the deadly bare `except` that swallows KeyboardInterrupt.
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
  - label: Python Official Docs
    url: https://docs.python.org/3/
    kind: doc
---

# Error Handling — Exceptions and Custom Errors

## Error Handling — Exceptions and Custom Errors

### Why It Matters

Handle errors gracefully with try/except/else/finally, design a custom exception hierarchy, and avoid the deadly bare `except` that swallows KeyboardInterrupt.

Handle errors gracefully with try/except/else/finally, design a custom exception hierarchy, and avoid the deadly bare `except` that swallows KeyboardInterrupt.

### Prerequisites

- Stage 11: File I/O and Context Managers
- Stage 9: Object-Oriented Programming (for subclassing Exception).

### Topics

- try / except / else / finally
- Raising exceptions with raise
- The exception hierarchy (BaseException -> Exception -> ...)
- Built-in exceptions: ValueError, TypeError, KeyError, IndexError, FileNotFoundError
- Custom exception classes
- Exception chaining: raise ... from ...
- Re-raising with bare `raise`
- The danger of bare `except:` and broad `except Exception:`
- Assertions and when NOT to use them

### Key Concepts

- `else` runs only if no exception was raised in try; `finally` always runs.
- Bare `except:` catches BaseException — including KeyboardInterrupt and SystemExit; almost always a bug.
- Custom exceptions should inherit from Exception (not BaseException) so they're not accidentally caught by cleanup code.
- `raise X from Y` chains exceptions, preserving the original traceback for debugging.
- Assertions are for debugging invariants, NOT for runtime validation — they're stripped with `python -O`.

```python
def safe_divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Can't divide by zero")
        return None
    except TypeError as e:
        print(f"Type error: {e}")
        return None
    else:
        # runs only if NO exception was raised
        print(f"Result: {result}")
        return result
    finally:
        # always runs, even on return or exception
        print("cleanup")

safe_divide(10, 2)   # Result: 5; cleanup
safe_divide(10, 0)   # Can't divide by zero; cleanup
```
Caption: try/except/else/finally

### Common Pitfalls

- Bare `except:` — catches KeyboardInterrupt and SystemExit, making Ctrl+C not work; use `except Exception:`.
- Swallowing exceptions silently (`except: pass`) — bugs hide forever; at minimum log them.
- Catching too broadly (`except Exception:`) — masks programming errors; catch specific types you can actually handle.
- Using assertions for runtime validation — `assert x > 0` is stripped by `python -O`; use `if x <= 0: raise ValueError`.
- Forgetting to re-raise — if you can't actually handle the exception, log and `raise` (bare) to propagate.

### Real-World Applications

- Instagram's API layer uses a custom ApiError hierarchy to map internal exceptions to HTTP status codes.
- Netflix's chaos engineering tools deliberately raise exceptions to test exception-handling resilience.
- Stripe's Python SDK uses exception chaining to surface API errors with the original HTTP context.
- Dropbox's sync engine uses custom SyncConflictError and NetworkError to drive retry logic.

### Interview Questions

- 1. What's the difference between `except:` and `except Exception:`? — Bare except catches BaseException (including KeyboardInterrupt); Exception skips those.
- 2. What's the order of try/except/else/finally? — try, then except (if raised), else (if no exception), finally (always).
- 3. What does `raise X from Y` do? — Chains X as caused by Y, preserving Y's traceback for debugging.
- 4. Should custom exceptions inherit from Exception or BaseException? — Exception; inheriting from BaseException risks being caught by cleanup code.
- 5. Why not use assertions for runtime validation? — `python -O` strips assertions; they're for debugging invariants, not user input validation.

### Mini Project

Build a Retry Decorator: A decorator @retry(max_attempts=3, exceptions=(NetworkError, TimeoutError), backoff=2) that retries a function on failure with exponential backoff. Suggested approach:
  - Use functools.wraps to preserve metadata
  - Loop max_attempts times, catching the specified exceptions
  - Sleep with time.sleep(backoff ** attempt) for exponential backoff
  - Re-raise the last exception if all attempts fail
  - Add a --jitter option to randomize backoff

### Exercises

1. Write try/except/else/finally and demonstrate that finally always runs.
2. Create a custom exception hierarchy: AppError -> DatabaseError -> NotFoundError.
3. Use `raise X from Y` to chain a high-level error to a low-level one.
4. Demonstrate that bare `except:` catches KeyboardInterrupt; fix it with `except Exception:`.
5. Write a function that uses `assert` for an internal invariant, then run it with `python -O` to see the assert stripped.
6. >>> QUIZ (Stage 12) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does bare `except:` catch?
9. A) Only ValueError
10. B) Only Exception subclasses
11. C) Nothing
12. D) BaseException — including KeyboardInterrupt and SystemExit (*)
13. Explanation: Bare except catches BaseException, which includes KeyboardInterrupt and SystemExit — usually a bug; use except Exception: instead.
14. Q2: When does the `else` block of try/except run?
15. A) Always
16. B) Only if an exception was raised
17. C) Only if NO exception was raised in try (*)
18. D) Only if finally didn't run
19. Explanation: else runs only when the try block completed without raising; useful to keep risky code out of the try block.
20. Q3: When does `finally` run?
21. A) Only on exception
22. B) Always — even on return, break, or exception (*)
23. C) Only on success
24. D) Only if else didn't run
25. Explanation: finally always executes, regardless of how the try block exits — even on return, break, continue, or unhandled exception.
26. Q4: What does `raise NewError from original_error` do?
27. A) Chains them — NewError caused by original_error, preserving traceback (*)
28. B) Replaces the original error
29. C) Suppresses NewError
30. D) Raises both simultaneously
31. Explanation: raise ... from ... sets __cause__ on the new exception, showing "The above exception was the direct cause of..." in the traceback.
32. Q5: Which should custom exceptions inherit from?
33. A) BaseException
34. B) Error
35. C) object
36. D) Exception (*)
37. Explanation: Inherit from Exception (not BaseException) so cleanup code that catches Exception doesn't accidentally swallow system-exit signals.
38. Q6: What does a bare `raise` do inside an except block?
39. A) Raises RuntimeError
40. B) Raises NothingHappenedError
41. C) Re-raises the currently-handled exception, preserving the traceback (*)
42. D) Suppresses the exception
43. Explanation: Bare `raise` re-raises the active exception with its original traceback — useful to log-and-rethrow.
44. Q7: What happens to `assert x > 0` when run with `python -O`?
45. A) Same as before — assertions always run
46. B) The assertion is stripped (no check) — assertions are for debugging only (*)
47. C) The assertion throws SyntaxError
48. D) The assertion is converted to if-check
49. Explanation: `python -O` removes assert statements; never use assert for runtime validation of user input.
50. Q8: Which is the recommended pattern for unhandleable exceptions?
51. A) Log and re-raise with bare `raise` (*)
52. B) except: pass
53. C) Catch Exception and ignore
54. D) Convert to SystemExit
55. Explanation: If you can't actually handle the exception, log it and re-raise with bare `raise` to preserve the traceback and let callers handle it.
56. Q9: Which is a built-in Python exception?
57. A) NotFoundError
58. B) DatabaseError
59. C) NetworkError
60. D) FileNotFoundError (*)
61. Explanation: FileNotFoundError is built-in (subclass of OSError); the others are user-defined in this example.
62. Q10: What's the exception hierarchy root?
63. A) Exception
64. B) object
65. C) BaseException (*)
66. D) Error
67. Explanation: BaseException is the root; Exception is its subclass (skipping SystemExit, KeyboardInterrupt, GeneratorExit). Most user code catches Exception.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does bare `except:` catch?
  options:
    - Only ValueError
    - Only Exception subclasses
    - Nothing
    - BaseException — including KeyboardInterrupt and SystemExit
  correctIndex: 3
  explanation: "Bare except catches BaseException, which includes KeyboardInterrupt and SystemExit — usually a bug; use except Exception: instead."
- id: q2
  question: When does the `else` block of try/except run?
  options:
    - Always
    - Only if an exception was raised
    - Only if NO exception was raised in try
    - Only if finally didn't run
  correctIndex: 2
  explanation: else runs only when the try block completed without raising; useful to keep risky code out of the try block.
- id: q3
  question: When does `finally` run?
  options:
    - Only on exception
    - Always — even on return, break, or exception
    - Only on success
    - Only if else didn't run
  correctIndex: 1
  explanation: finally always executes, regardless of how the try block exits — even on return, break, continue, or unhandled exception.
- id: q4
  question: What does `raise NewError from original_error` do?
  options:
    - Chains them — NewError caused by original_error, preserving traceback
    - Replaces the original error
    - Suppresses NewError
    - Raises both simultaneously
  correctIndex: 0
  explanation: raise ... from ... sets __cause__ on the new exception, showing "The above exception was the direct cause of..." in the traceback.
- id: q5
  question: Which should custom exceptions inherit from?
  options:
    - BaseException
    - Error
    - object
    - Exception
  correctIndex: 3
  explanation: Inherit from Exception (not BaseException) so cleanup code that catches Exception doesn't accidentally swallow system-exit signals.
- id: q6
  question: What does a bare `raise` do inside an except block?
  options:
    - Raises RuntimeError
    - Raises NothingHappenedError
    - Re-raises the currently-handled exception, preserving the traceback
    - Suppresses the exception
  correctIndex: 2
  explanation: Bare `raise` re-raises the active exception with its original traceback — useful to log-and-rethrow.
- id: q7
  question: What happens to `assert x > 0` when run with `python -O`?
  options:
    - Same as before — assertions always run
    - The assertion is stripped (no check) — assertions are for debugging only
    - The assertion throws SyntaxError
    - The assertion is converted to if-check
  correctIndex: 1
  explanation: "`python -O` removes assert statements; never use assert for runtime validation of user input."
- id: q8
  question: Which is the recommended pattern for unhandleable exceptions?
  options:
    - Log and re-raise with bare `raise`
    - "except: pass"
    - Catch Exception and ignore
    - Convert to SystemExit
  correctIndex: 0
  explanation: If you can't actually handle the exception, log it and re-raise with bare `raise` to preserve the traceback and let callers handle it.
- id: q9
  question: Which is a built-in Python exception?
  options:
    - NotFoundError
    - DatabaseError
    - NetworkError
    - FileNotFoundError
  correctIndex: 3
  explanation: FileNotFoundError is built-in (subclass of OSError); the others are user-defined in this example.
- id: q10
  question: What's the exception hierarchy root?
  options:
    - Exception
    - object
    - BaseException
    - Error
  correctIndex: 2
  explanation: BaseException is the root; Exception is its subclass (skipping SystemExit, KeyboardInterrupt, GeneratorExit). Most user code catches Exception.
```

