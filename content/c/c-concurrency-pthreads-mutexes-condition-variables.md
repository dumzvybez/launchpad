---
slug: c-concurrency-pthreads-mutexes-condition-variables
id: c-18
track: c
order: 18
title: Concurrency — pthreads, Mutexes, Condition Variables
description: Write multi-threaded C with pthreads — create and join threads, protect shared state with mutexes, and signal waiting threads with condition variables.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=11800s
whyItMatters: Write multi-threaded C with pthreads — create and join threads, protect shared state with mutexes, and signal waiting threads with condition variables.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# Concurrency — pthreads, Mutexes, Condition Variables

## Concurrency — pthreads, Mutexes, Condition Variables

### Why It Matters

Write multi-threaded C with pthreads — create and join threads, protect shared state with mutexes, and signal waiting threads with condition variables.

Write multi-threaded C with pthreads — create and join threads, protect shared state with mutexes, and signal waiting threads with condition variables.

### Prerequisites

- Stage 8: Dynamic Memory.
- Stage 10: Function Pointers.
- Stage 15: Error Handling (for errno).
- Stage 17: Data Structures (queues are common thread-pool primitives).

### Topics

- pthread_create and pthread_join
- pthread_t handles and thread IDs
- Mutexes: pthread_mutex_init/lock/unlock/destroy
- Condition variables: pthread_cond_init/wait/signal/broadcast
- Race conditions and data races
- Deadlocks and lock ordering
- Producer-consumer with a bounded queue
- Thread-local storage with __thread and _Thread_local

### Key Concepts

- A thread is an independent execution context sharing address space with its parent.
- A data race occurs when two threads access the same memory without synchronization, with at least one write — UB.
- A mutex serializes access to shared state; lock before access, unlock after.
- Condition variables let threads wait for a condition; always pair with a mutex and a loop checking the predicate.
- Deadlock occurs when two threads each hold a lock the other needs; prevent with lock ordering or timeouts.
- __thread / _Thread_local gives each thread its own copy of a variable.
- Most C library functions (strtok, rand, errno pre-C11) are NOT thread-safe; use the _r variants.

```c
#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

static void *worker(void *arg) {
    long id = (long)arg;
    printf("thread %ld running\n", id);
    sleep(1);
    printf("thread %ld done\n", id);
    return NULL;
}

int main(void) {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, worker, (void*)1L);
    pthread_create(&t2, NULL, worker, (void*)2L);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("all threads joined\n");
    return 0;
}
```
Caption: Thread create and join

### Common Pitfalls

- Data race on shared variable — `counter++` without a lock is UB under multi-threading; use a mutex or stdatomic.
- Condition variable without a predicate loop — spurious wakeups are allowed; always `while (!cond) pthread_cond_wait(...)`, never `if`.
- Forgetting to lock before cond_wait — cond_wait atomically unlocks and waits; you MUST hold the mutex when calling it.
- Deadlock from lock-ordering inversion — two threads acquiring two locks in opposite orders deadlock; establish a global lock order.
- Using non-thread-safe functions — strtok, rand,asctime share static state; use strtok_r, rand_r,asctime_r or _Thread_local buffers.

### Real-World Applications

- The Linux kernel uses per-CPU spinlocks, RCU, and seqlocks to scale to thousands of cores without mutexes on hot paths.
- Redis 6+ runs I/O threads (read/write syscalls) and a separate bio thread for slow operations; the main thread still serializes command execution.
- nginx runs one worker process per CPU, each handling thousands of connections with epoll; mutexes are used within workers but not across them.
- SQLite supports multi-threaded mode (SQLITE_THREADSAFE=2) where each connection is single-threaded but connections can be used by different threads.

### Interview Questions

- 1. What is a data race? — Two or more threads access the same memory, at least one is a write, and no synchronization orders them — undefined behavior in C11.
- 2. Why must cond_wait be called inside a `while` loop? — Spurious wakeups are allowed by POSIX; the predicate may also become false again before you wake, so re-check.
- 3. What's a deadlock, and how do you prevent it? — Two or more threads each hold a lock the other needs; prevent with a global lock-acquisition order or use trylock with timeouts.
- 4. What's the difference between a mutex and a spinlock? — A mutex blocks (deschedules) the thread; a spinlock busy-waits. Spinlocks are for very short critical sections and interrupt context.
- 5. What is _Thread_local? — A storage class (C11) giving each thread its own instance of a variable; useful for errno-like state in libraries.

### Mini Project

Build a Thread Pool: A pool of N worker threads pulling jobs from a shared queue. Suggested approach:
  - Define `typedef void (*JobFn)(void *);` and a Job struct { JobFn fn; void *arg; Job *next; }
  - Maintain a shared linked-list queue protected by a mutex + condvar (not_empty)
  - workers loop: pop a job (waiting if empty), run fn(arg)
  - Provide pool_submit(pool, fn, arg) and pool_destroy(pool) (set a shutdown flag, broadcast, join)
  - Test with 1000 jobs across 4 workers; verify all run

### Exercises

1. Spawn 4 threads that each increment a shared counter 100k times; observe the race without a lock, then fix with a mutex.
2. Implement producer-consumer with a bounded buffer using one mutex and two condvars.
3. Cause an intentional deadlock by having two threads acquire two locks in opposite orders.
4. Use _Thread_local to give each thread its own buffer; verify they don't interfere.
5. Compile with -fsanitize=thread and demonstrate TSan detecting a data race.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which header declares pthread_create?
9. A) <threads.h>
10. B) <pthread.h> (*)
11. C) <thread.h>
12. D) <concurrent.h>
13. Explanation: pthreads (POSIX) live in <pthread.h>; link with -pthread. C11's <threads.h> is a thinner, optional alternative.
14. Q2: What is a data race?
15. A) Two threads reading the same variable
16. B) A thread that finishes too quickly
17. C) Two threads accessing the same memory unsynchronized, at least one writing — UB (*)
18. D) A deadlock
19. Explanation: C11 defines data races as unsynchronized conflicting accesses; the result is undefined behavior.
20. Q3: Why must cond_wait be called inside a `while` loop?
21. A) For performance
22. B) To avoid memory leaks
23. C) The mutex requires it
24. D) Spurious wakeups are allowed; the predicate must be re-checked (*)
25. Explanation: POSIX permits spurious wakeups; another thread may also have consumed the resource. Always loop on the predicate.
26. Q4: What does pthread_cond_wait do atomically?
27. A) Unlocks the mutex and blocks; re-locks before returning (*)
28. B) Locks the mutex and waits
29. C) Signals another condvar
30. D) Frees the mutex
31. Explanation: cond_wait releases the mutex so producers can proceed, then re-acquires it before returning to the caller.
32. Q5: What causes a deadlock?
33. A) A thread that never sleeps
34. B) Two threads each holding a lock the other needs (*)
35. C) A memory leak
36. D) A data race
37. Explanation: Classic deadlock: T1 holds A waiting for B; T2 holds B waiting for A. Prevent with lock ordering.
38. Q6: What's the difference between a mutex and a spinlock?
39. A) No difference
40. B) A mutex is faster
41. C) A mutex deschedules the waiting thread; a spinlock busy-waits (*)
42. D) A spinlock is for memory only
43. Explanation: Mutexes block (yield the CPU); spinlocks burn CPU. Use spinlocks only for very short critical sections or interrupt context.
44. Q7: What does `_Thread_local` do?
45. A) Makes a variable const
46. B) Makes a variable shared
47. C) Hides a variable from other files
48. D) Gives each thread its own instance of the variable (*)
49. Explanation: _Thread_local (C11) is a storage class giving each thread a separate copy; useful for errno-like state.
50. Q8: Which flag links the pthread library on Linux?
51. A) -pthread (*)
52. B) -lpthread
53. C) -threads
54. D) -lpthreads
55. Explanation: -pthread (no "l") sets both the compiler preprocessor defines and the linker flag; -lpthread works too but isn't recommended.
56. Q9: Why is strtok unsafe in multi-threaded code?
57. A) It's slow
58. B) It uses a static internal pointer shared across threads (*)
59. C) It can't handle long strings
60. D) It's not in the standard library
61. Explanation: strtok's internal state races between threads; use strtok_r (POSIX) or strtok_s (Annex K) which take a saveptr.
62. Q10: Which sanitizer detects data races?
63. A) -fsanitize=address
64. B) -fsanitize=undefined
65. C) -fsanitize=thread (*)
66. D) -fsanitize=memory
67. Explanation: ThreadSanitizer (TSan) instruments memory accesses and reports data races; ASan is for memory errors, UBSan for UB, MSan for uninitialized reads.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which header declares pthread_create?
  options:
    - <threads.h>
    - <pthread.h>
    - <thread.h>
    - <concurrent.h>
    - live in <pthread.h>; link with -pthread. C11's <threads.h> is a thinner, optional alternative.
  correctIndex: 1
  explanation: pthreads (POSIX) live in <pthread.h>; link with -pthread. C11's <threads.h> is a thinner, optional alternative.
- id: q2
  question: What is a data race?
  options:
    - Two threads reading the same variable
    - A thread that finishes too quickly
    - Two threads accessing the same memory unsynchronized, at least one writing — UB
    - A deadlock
  correctIndex: 2
  explanation: C11 defines data races as unsynchronized conflicting accesses; the result is undefined behavior.
- id: q3
  question: Why must cond_wait be called inside a `while` loop?
  options:
    - For performance
    - To avoid memory leaks
    - The mutex requires it
    - Spurious wakeups are allowed; the predicate must be re-checked
  correctIndex: 3
  explanation: POSIX permits spurious wakeups; another thread may also have consumed the resource. Always loop on the predicate.
- id: q4
  question: What does pthread_cond_wait do atomically?
  options:
    - Unlocks the mutex and blocks; re-locks before returning
    - Locks the mutex and waits
    - Signals another condvar
    - Frees the mutex
  correctIndex: 0
  explanation: cond_wait releases the mutex so producers can proceed, then re-acquires it before returning to the caller.
- id: q5
  question: What causes a deadlock?
  options:
    - A thread that never sleeps
    - Two threads each holding a lock the other needs
    - A memory leak
    - A data race
  correctIndex: 1
  explanation: "Classic deadlock: T1 holds A waiting for B; T2 holds B waiting for A. Prevent with lock ordering."
- id: q6
  question: What's the difference between a mutex and a spinlock?
  options:
    - No difference
    - A mutex is faster
    - A mutex deschedules the waiting thread; a spinlock busy-waits
    - A spinlock is for memory only
    - ; spinlocks burn CPU. Use spinlocks only for very short critical sections or interrupt context.
  correctIndex: 2
  explanation: Mutexes block (yield the CPU); spinlocks burn CPU. Use spinlocks only for very short critical sections or interrupt context.
- id: q7
  question: What does `_Thread_local` do?
  options:
    - Makes a variable const
    - Makes a variable shared
    - Hides a variable from other files
    - Gives each thread its own instance of the variable
  correctIndex: 3
  explanation: _Thread_local (C11) is a storage class giving each thread a separate copy; useful for errno-like state.
- id: q8
  question: Which flag links the pthread library on Linux?
  options:
    - -pthread
    - -lpthread
    - -threads
    - -lpthreads
  correctIndex: 0
  explanation: -pthread (no "l") sets both the compiler preprocessor defines and the linker flag; -lpthread works too but isn't recommended.
- id: q9
  question: Why is strtok unsafe in multi-threaded code?
  options:
    - It's slow
    - It uses a static internal pointer shared across threads
    - It can't handle long strings
    - It's not in the standard library
    - or strtok_s (Annex K) which take a saveptr.
  correctIndex: 1
  explanation: strtok's internal state races between threads; use strtok_r (POSIX) or strtok_s (Annex K) which take a saveptr.
- id: q10
  question: Which sanitizer detects data races?
  options:
    - -fsanitize=address
    - -fsanitize=undefined
    - -fsanitize=thread
    - -fsanitize=memory
  correctIndex: 2
  explanation: ThreadSanitizer (TSan) instruments memory accesses and reports data races; ASan is for memory errors, UBSan for UB, MSan for uninitialized reads.
```

