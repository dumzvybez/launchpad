---
slug: c-data-structures-linked-lists-stacks-queues
id: c-17
track: c
order: 17
title: Data Structures — Linked Lists, Stacks, Queues
description: Build the three foundational data structures in C — singly/doubly linked lists, stacks, and queues — using struct pointers and function pointers for clean APIs.
difficulty: advanced
estMinutes: 315
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=KJgsSFOSQv0&t=11100s
whyItMatters: Build the three foundational data structures in C — singly/doubly linked lists, stacks, and queues — using struct pointers and function pointers for clean APIs.
deepDiveResources:
  - label: W3Schools C
    url: https://www.w3schools.com/c/
    kind: course
  - label: C Official Docs
    url: https://en.cppreference.com/w/c
    kind: doc
---

# Data Structures — Linked Lists, Stacks, Queues

## Data Structures — Linked Lists, Stacks, Queues

### Why It Matters

Build the three foundational data structures in C — singly/doubly linked lists, stacks, and queues — using struct pointers and function pointers for clean APIs.

Build the three foundational data structures in C — singly/doubly linked lists, stacks, and queues — using struct pointers and function pointers for clean APIs.

### Prerequisites

- Stage 8: Dynamic Memory.
- Stage 9: structs, unions, and typedefs.
- Stage 10: Function Pointers.
- Stage 16: Advanced Pointers.

### Topics

- Singly linked list: insert, delete, traverse, free
- Doubly linked list: prev/next pointers, O(1) removal
- Sentinel nodes and circular variants
- Stack via array (top index) or linked list (head)
- Queue via ring buffer or linked list (head/tail)
- Freeing lists: walking and releasing each node
- Ownership: who is responsible for freeing element data?
- Generic containers via void* + element size

### Key Concepts

- A linked list node holds a value plus a pointer to the next node; traversal follows the chain.
- Singly linked lists support O(1) push-front but O(n) random access; doubly linked lists support O(1) removal given a node pointer.
- A sentinel (dummy head) simplifies edge cases — no "is head" special case in insertion/removal.
- A stack is LIFO; push and pop from the same end (top).
- A queue is FIFO; push to the back, pop from the front; a ring buffer gives O(1) without linked-list overhead.
- Every data structure must have a free function that releases both node storage and (optionally) element data.
- Generic containers in C use void* + element size; ownership of element data must be explicit in the API.

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

static Node *list_push_front(Node *head, int v) {
    Node *n = malloc(sizeof(Node));
    if (!n) return head;
    n->value = v;
    n->next  = head;
    return n;
}

static void list_print(const Node *head) {
    for (const Node *p = head; p; p = p->next) {
        printf("%d -> ", p->value);
    }
    printf("NULL\n");
}

static void list_free(Node *head) {
    while (head) {
        Node *next = head->next;
        free(head);
        head = next;
    }
}

int main(void) {
    Node *h = NULL;
    h = list_push_front(h, 3);
    h = list_push_front(h, 2);
    h = list_push_front(h, 1);
    list_print(h);   /* 1 -> 2 -> 3 -> NULL */
    list_free(h);
    return 0;
}
```
Caption: Singly linked list

### Common Pitfalls

- Forgetting to free list nodes — every malloc'd node must be freed; a list_free that walks and frees is required.
- Use-after-free during list traversal — `free(p); p = p->next;` reads freed memory; save `p->next` first.
- Losing the head pointer — `head = head->next; free(old);` correctly updates; but if you forget to reassign, you corrupt the list.
- Off-by-one in ring buffer — `count` and `cap` must agree; using only head/tail without count makes "empty" vs "full" ambiguous.
- Not handling empty-list edge cases — removing from an empty list crashes; check `head == NULL` (or sentinel self-loop) first.

### Real-World Applications

- The Linux kernel's list.h is a doubly linked list with a sentinel, used by thousands of subsystems; the container_of macro recovers the enclosing struct.
- Redis uses a doubly linked list (adlist.c) for list-type values plus a separate listpack for short encodings.
- SQLite's pager uses a hash table whose buckets are singly linked lists for fast page lookup.
- nginx uses pool-allocated singly linked lists for HTTP header storage — O(1) allocation, O(n) cleanup via pool reset.

### Interview Questions

- 1. How do you reverse a singly linked list? — Iterate with three pointers (prev, cur, next), redirecting cur->next to prev at each step; O(n) time, O(1) space.
- 2. How do you detect a cycle in a linked list? — Floyd's tortoise-and-hare: two pointers, one moving 1 step, the other 2; they meet iff there's a cycle.
- 3. When is a doubly linked list worth the extra pointer? — When you need O(1) removal given a node pointer (LRU caches, scheduler queues, undo lists).
- 4. How do you implement a queue with two stacks? — Push to stack1; pop from stack2; when stack2 is empty, dump stack1 into stack2 (which reverses order). Amortized O(1).
- 5. Why use a sentinel node? — It eliminates "is this the head?" special cases in insertion/removal; the code is shorter and easier to verify.

### Mini Project

Build a Generic Linked List Library: A list that holds any type via void* + element size, with insert, find, remove, and free. Suggested approach:
  - `typedef struct Node { void *data; struct Node *next; } Node;`
  - `typedef struct { Node *head; size_t sz; } List;`
  - list_push_front(List*, const void *item) mallocs a Node and copies `sz` bytes
  - list_find(List*, const void *key, int (*cmp)(const void*, const void*))
  - list_free(List*) walks the list, freeing data then node
  - Test with int, char*, and a struct Point

### Exercises

1. Reverse a singly linked list both iteratively and recursively.
2. Detect a cycle in a linked list using Floyd's algorithm.
3. Implement a stack using two queues (and vice versa).
4. Build a priority queue using a binary heap (array-based).
5. Write a function to merge two sorted linked lists into one.
6. >>> QUIZ (Stage 17) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the time complexity of inserting at the head of a singly linked list?
9. A) O(1) (*)
10. B) O(n)
11. C) O(log n)
12. D) O(n^2)
13. Explanation: Head insertion allocates a node, points it at the current head, and updates head — constant time.
14. Q2: What does a doubly linked list allow that a singly linked list doesn't?
15. A) Faster traversal
16. B) O(1) removal given a node pointer (*)
17. C) Smaller memory footprint
18. D) Random access by index
19. Explanation: With a prev pointer you can unlink a node in O(1) without re-traversing for its predecessor.
20. Q3: What's the bug in `free(p); p = p->next;`?
21. A) Nothing
22. B) Memory leak
23. C) Use-after-free — p->next is read after free (*)
24. D) Compile error
25. Explanation: After free, p's memory is reused; reading p->next is UB. Save `Node *next = p->next;` before free.
26. Q4: What's a sentinel node used for?
27. A) Faster iteration
28. B) Marking the end of the list
29. C) Reducing memory
30. D) Eliminating "is head" special cases in insert/remove (*)
31. Explanation: A dummy head means insertions and removals always have a predecessor/successor — no special-casing.
32. Q5: A queue follows which ordering?
33. A) FIFO (*)
34. B) LIFO
35. C) Priority
36. D) Random
37. Explanation: FIFO: First In, First Out. Items are removed in the same order they were added.
38. Q6: How does a ring-buffer queue distinguish full from empty?
39. A) Check if head == tail (ambiguous)
40. B) Maintain an explicit count, or never fill the last slot (*)
41. C) Use a sentinel value
42. D) It can't distinguish them
43. Explanation: Without a count, head==tail means both empty and full; a count field or "leave one slot empty" convention disambiguates.
44. Q7: What's the time complexity of finding an element in an unsorted singly linked list?
45. A) O(1)
46. B) O(log n)
47. C) O(n) (*)
48. D) O(n log n)
49. Explanation: You must walk the list from head; worst case is n comparisons.
50. Q8: How does Floyd's cycle-detection algorithm work?
51. A) Hash every node
52. B) Reverse the list
53. C) Sort the list
54. D) Two pointers, one moving 1 step, the other 2; if they meet, there's a cycle (*)
55. Explanation: Tortoise-and-hare: the fast pointer laps the slow one iff a cycle exists; O(n) time, O(1) space.
56. Q9: What's the safe pattern for freeing a list?
57. A) `while (p) { Node *n = p->next; free(p); p = n; }` (*)
58. B) `while (p) { free(p); p = p->next; }`
59. C) `for (Node *p = head; p; p++) free(p);`
60. D) `free(head);`
61. Explanation: Save the next pointer before freeing the current node; otherwise you read freed memory.
62. Q10: Why do generic containers in C use void* + element size?
63. A) For performance
64. B) To hold any element type without templates (*)
65. C) Because C has no struct types
66. D) To avoid malloc
67. Explanation: C has no generics; void* + size + memcpy lets you store any type, exactly like qsort's interface.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the time complexity of inserting at the head of a singly linked list?
  options:
    - O(1)
    - O(n)
    - O(log n)
    - O(n^2)
  correctIndex: 0
  explanation: Head insertion allocates a node, points it at the current head, and updates head — constant time.
- id: q2
  question: What does a doubly linked list allow that a singly linked list doesn't?
  options:
    - Faster traversal
    - O(1) removal given a node pointer
    - Smaller memory footprint
    - Random access by index
  correctIndex: 1
  explanation: With a prev pointer you can unlink a node in O(1) without re-traversing for its predecessor.
- id: q3
  question: What's the bug in `free(p); p = p->next;`?
  options:
    - Nothing
    - Memory leak
    - Use-after-free — p->next is read after free
    - Compile error
  correctIndex: 2
  explanation: After free, p's memory is reused; reading p->next is UB. Save `Node *next = p->next;` before free.
- id: q4
  question: What's a sentinel node used for?
  options:
    - Faster iteration
    - Marking the end of the list
    - Reducing memory
    - Eliminating "is head" special cases in insert/remove
  correctIndex: 3
  explanation: A dummy head means insertions and removals always have a predecessor/successor — no special-casing.
- id: q5
  question: A queue follows which ordering?
  options:
    - FIFO
    - LIFO
    - Priority
    - Random
  correctIndex: 0
  explanation: "FIFO: First In, First Out. Items are removed in the same order they were added."
- id: q6
  question: How does a ring-buffer queue distinguish full from empty?
  options:
    - Check if head == tail (ambiguous)
    - Maintain an explicit count, or never fill the last slot
    - Use a sentinel value
    - It can't distinguish them
  correctIndex: 1
  explanation: Without a count, head==tail means both empty and full; a count field or "leave one slot empty" convention disambiguates.
- id: q7
  question: What's the time complexity of finding an element in an unsorted singly linked list?
  options:
    - O(1)
    - O(log n)
    - O(n)
    - O(n log n)
  correctIndex: 2
  explanation: You must walk the list from head; worst case is n comparisons.
- id: q8
  question: How does Floyd's cycle-detection algorithm work?
  options:
    - Hash every node
    - Reverse the list
    - Sort the list
    - Two pointers, one moving 1 step, the other 2; if they meet, there's a cycle
  correctIndex: 3
  explanation: "Tortoise-and-hare: the fast pointer laps the slow one iff a cycle exists; O(n) time, O(1) space."
- id: q9
  question: What's the safe pattern for freeing a list?
  options:
    - "`while (p) { Node *n = p->next; free(p); p = n; }`"
    - "`while (p) { free(p); p = p->next; }`"
    - "`for (Node *p = head; p; p++) free(p);`"
    - "`free(head);`"
  correctIndex: 0
  explanation: Save the next pointer before freeing the current node; otherwise you read freed memory.
- id: q10
  question: Why do generic containers in C use void* + element size?
  options:
    - For performance
    - To hold any element type without templates
    - Because C has no struct types
    - To avoid malloc
  correctIndex: 1
  explanation: C has no generics; void* + size + memcpy lets you store any type, exactly like qsort's interface.
```

