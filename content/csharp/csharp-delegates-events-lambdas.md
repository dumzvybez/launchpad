---
slug: csharp-delegates-events-lambdas
id: csharp-09
track: csharp
order: 9
title: Delegates, Events, and Lambdas
description: Author delegates and the built-in Action/Func types, raise and handle events, capture variables in lambdas (and the classic loop-capture bug), and understand multicast dispatch.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=8000s
whyItMatters: Author delegates and the built-in Action/Func types, raise and handle events, capture variables in lambdas (and the classic loop-capture bug), and understand multicast dispatch.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# Delegates, Events, and Lambdas

## Delegates, Events, and Lambdas

### Why It Matters

Author delegates and the built-in Action/Func types, raise and handle events, capture variables in lambdas (and the classic loop-capture bug), and understand multicast dispatch.

Author delegates and the built-in Action/Func types, raise and handle events, capture variables in lambdas (and the classic loop-capture bug), and understand multicast dispatch.

### Prerequisites

- Stage 6: Inheritance, Polymorphism, and Interfaces.
- Stage 8: Collections.

### Topics

- Delegate types: custom, generic, Action<>, Action<>, Func<,T>
- Lambda expressions and statement lambdas
- Method group conversions
- Captured variables and closures (the loop-variable bug)
- Events: `event` keyword, add/remove accessors, INotifyPropertyChanged
- Multicast delegates and the invocation list
- Delegate covariance/contravariance
- Discards and partial application via closures

### Key Concepts

- A delegate is a type-safe function pointer — `Func<int, int, int>` is "a function taking two ints, returning an int".
- `event` restricts a delegate to only `+=`/`-=` from outside the class — only the declaring class can invoke or clear it; this is the encapsulation that makes events safe for publish/subscribe.
- Closures capture variables by reference, not value — the classic `foreach (var i in ...) Actions.Add(() => Console.Write(i));` bug captures the same `i`, so all lambdas print the final value.
- Multicast delegates return only the last result; for events you should use `void` return and `event` semantics.
- Before C# 5, the `foreach` loop variable was declared outside the loop, so all lambdas captured the same variable; since C# 5 each iteration gets its own — but the bug persists with `for` loops.

```csharp
public delegate int MathOp(int a, int b);

MathOp add = (a, b) => a + b;
Func<int, int, int> mul = (a, b) => a * b;
Action<string> log = msg => Console.WriteLine($"[{DateTimeOffset.Now:HH:mm:ss}] {msg}");

Console.WriteLine(add(2, 3));    // 5
Console.WriteLine(mul(2, 3));    // 6
log("hello");
```
Caption: Delegates, Action, Func

### Common Pitfalls

- Capturing the loop variable in a `for` loop — all lambdas see the final value because the same variable is mutated each iteration; introduce a per-iteration local copy.
- Returning a value from a multicast delegate — only the last handler's return is observed; use `void` + out parameters or iterate `GetInvocationList()` manually.
- Forgetting to unsubscribe (`-=`) from an event — the publisher holds a reference to the subscriber, causing a memory leak (the subscriber is never GC'd); use weak event patterns or unsubscribe in Dispose.
- Throwing inside an event handler — if one handler throws, subsequent handlers in the invocation list do NOT run; wrap each in try/catch or use `GetInvocationList()` to isolate.
- Using a public delegate field instead of an event — `public Action? Foo;` lets external code call `Foo()` or even clear it (`Foo = null`), breaking encapsulation; use `event` to restrict to `+=`/`-=`.

### Real-World Applications

- WPF/WinForms data binding is built on `INotifyPropertyChanged` — every property setter raises `PropertyChanged` so UI controls refresh; Visual Studio designers subscribe throughout.
- ASP.NET Core's request pipeline uses `Func<RequestDelegate, RequestDelegate>` delegates for middleware; each middleware captures the next delegate in a closure.
- Unity's `UnityEvent` and C# events drive game logic — `OnCollisionEnter` fires the physics event, which scripts subscribe to for scoring, sound, and effects.
- Reactive Extensions (Rx.NET) is built entirely on `IObservable<T>` and `IObserver<T>`, with delegates gluing together LINQ-style operators over event streams.

### Interview Questions

- 1. What is the difference between a delegate and an event? — A delegate is a callable function pointer; an `event` is a delegate with restricted access (only `+=`/`-=` from outside), enabling safe publish/subscribe.
- 2. Why do all lambdas in a `for` loop sometimes print the same value? — The loop variable is captured by reference, so all lambdas share one variable that ends at the final value; copy to a local per iteration.
- 3. What is a multicast delegate and how does it handle return values? — A delegate with multiple handlers in its invocation list; invoking it runs all handlers but returns only the last result (which is why events use `void`).
- 4. Why is forgetting to unsubscribe from an event a memory leak? — The publisher's invocation list holds a strong reference to the subscriber, preventing GC; the subscriber stays alive as long as the publisher.
- 5. What is the closure capture model in C# — by value or by reference? — By reference; lambdas capture the variable itself (a hidden field in a compiler-generated closure class), so later mutations are visible to the lambda.

### Mini Project

Build an Event-Driven Stock Ticker: A `Ticker` class that raises `PriceChanged` events with the old and new price, and multiple subscribers (logger, alert threshold, moving average) that react independently. Suggested approach:
  - Define `public event EventHandler<PriceChangedEventArgs>? PriceChanged;`
  - `PriceChangedEventArgs` carries `Symbol`, `OldPrice`, `NewPrice`, and `Timestamp`
  - Wrap each subscriber's handler in try/catch via `GetInvocationList()` so one failure doesn't block others
  - Demonstrate the closure bug by adding a lambda capturing a `for` variable and printing all-5s
  - Implement `IDisposable` on a subscriber that unsubscribes in `Dispose` to avoid leaks

### Exercises

1. Declare a custom `delegate bool Filter(int n)` and use it with `List<int>.FindAll` via a lambda and via a method group.
2. Reproduce the loop-capture bug with a `for` loop, then fix it with a local copy; confirm the difference.
3. Build a `Button` class with a `Clicked` event and a `Form` subscriber; verify that forgetting to unsubscribe leaks the Form.
4. Create a multicast `Func<int>` returning different values and iterate `GetInvocationList()` to collect all results.
5. Convert an `Action<string>` logging delegate into an `event` and observe that external code can no longer invoke it directly.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does the `event` keyword restrict compared to a plain delegate field?
9. A) External code can only add/remove handlers (+=/-=), not invoke or clear (*)
10. B) It makes the delegate immutable
11. C) It makes the delegate thread-safe
12. D) It allows only one handler
13. Explanation: `event` adds encapsulation: outside the declaring class, the only allowed operations are `+=` and `-=`; the declaring class retains full control to invoke, clear, or replace.
14. Q2: Lambdas in C# capture variables…
15. A) By value (a snapshot at creation)
16. B) By reference (the variable itself) (*)
17. C) Only if marked `ref`
18. D) Only for static lambdas
19. Explanation: Closures capture the variable by reference — the lambda holds a reference to a hidden field that aliases the captured variable, so later mutations are visible.
20. Q3: In a `for (int i=0; i<5; i++) actions.Add(()=>Console.Write(i));` loop, what prints?
21. A) 0 1 2 3 4
22. B) 0 0 0 0 0
23. C) 5 5 5 5 5 (*)
24. D) Nothing
25. Explanation: All lambdas capture the same `i` variable, which ends at 5; printing happens after the loop, so every lambda sees 5.
26. Q4: Since C# 5, `foreach` over `items` capturing the loop variable…
27. A) Captures the same variable across iterations (bug persists)
28. B) Is disallowed
29. C) Throws at runtime
30. D) Captures a fresh variable per iteration (bug fixed) (*)
31. Explanation: C# 5 changed foreach to declare a fresh loop variable per iteration, so the capture bug is fixed for foreach — but the bug persists for `for` loops with an explicit counter.
32. Q5: A multicast `Func<int>` invoked directly returns…
33. A) Only the last handler's result (*)
34. B) The sum of all handler results
35. C) The first handler's result
36. D) An array of results
37. Explanation: Multicast invocation runs all handlers but discards intermediate return values; only the last handler's result is returned — which is why events use `void`.
38. Q6: Which built-in delegate type represents "takes a string, returns nothing"?
39. A) Func<string>
40. B) Action<string> (*)
41. C) Predicate<string>
42. D) Converter<string, string>
43. Explanation: `Action<T>` takes one argument and returns void; `Func<T, TResult>` returns a value; `Predicate<T>` returns bool.
44. Q7: Forgetting to unsubscribe (`-=`) from a long-lived publisher's event causes…
45. A) A compile error
46. B) The event to fire twice
47. C) A memory leak (subscriber kept alive by the invocation list) (*)
48. D) Nothing; the GC handles it
49. Explanation: The publisher's backing delegate holds a strong reference to the subscriber, so the subscriber is reachable and cannot be GC'd — a classic .NET memory leak.
50. Q8: If one handler in a multicast invocation throws, what happens to the others?
51. A) They still run
52. B) The exception is swallowed
53. C) The runtime crashes
54. D) They are skipped (subsequent handlers do not run) (*)
55. Explanation: Multicast invocation runs handlers in order; an exception propagates immediately and subsequent handlers in the invocation list do NOT run — iterate GetInvocationList() with try/catch to isolate.
56. Q9: `public Action? Foo;` (public delegate field) allows external code to…
57. A) Invoke Foo(), clear it (Foo=null), or replace it — breaking encapsulation (*)
58. B) Only add handlers
59. C) Nothing; it is read-only
60. D) Only read its target
61. Explanation: A public delegate field is fully accessible — external code can invoke, clear, or reassign it; use `event` to restrict external access to +=/-=.
62. Q10: What is `GetInvocationList()` useful for?
63. A) Counting GC roots
64. B) Listing all subscribed handlers and invoking each in try/catch to isolate failures (*)
65. C) Serializing the delegate
66. D) Converting the delegate to a string
67. Explanation: `GetInvocationList()` returns an array of individual delegates; iterating it lets you invoke each in its own try/catch so one handler's exception does not block the others.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does the `event` keyword restrict compared to a plain delegate field?
  options:
    - External code can only add/remove handlers (+=/-=), not invoke or clear
    - It makes the delegate immutable
    - It makes the delegate thread-safe
    - It allows only one handler
  correctIndex: 0
  explanation: "`event` adds encapsulation: outside the declaring class, the only allowed operations are `+=` and `-=`; the declaring class retains full control to invoke, clear, or replace."
- id: q2
  question: Lambdas in C# capture variables…
  options:
    - By value (a snapshot at creation)
    - By reference (the variable itself)
    - Only if marked `ref`
    - Only for static lambdas
  correctIndex: 1
  explanation: Closures capture the variable by reference — the lambda holds a reference to a hidden field that aliases the captured variable, so later mutations are visible.
- id: q3
  question: In a `for (int i=0; i<5; i++) actions.Add(()=>Console.Write(i));` loop, what prints?
  options:
    - 0 1 2 3 4
    - 0 0 0 0 0
    - 5 5 5 5 5
    - Nothing
  correctIndex: 2
  explanation: All lambdas capture the same `i` variable, which ends at 5; printing happens after the loop, so every lambda sees 5.
- id: q4
  question: Since C# 5, `foreach` over `items` capturing the loop variable…
  options:
    - Captures the same variable across iterations (bug persists)
    - Is disallowed
    - Throws at runtime
    - Captures a fresh variable per iteration (bug fixed)
  correctIndex: 3
  explanation: C# 5 changed foreach to declare a fresh loop variable per iteration, so the capture bug is fixed for foreach — but the bug persists for `for` loops with an explicit counter.
- id: q5
  question: A multicast `Func<int>` invoked directly returns…
  options:
    - Only the last handler's result
    - The sum of all handler results
    - The first handler's result
    - An array of results
  correctIndex: 0
  explanation: Multicast invocation runs all handlers but discards intermediate return values; only the last handler's result is returned — which is why events use `void`.
- id: q6
  question: Which built-in delegate type represents "takes a string, returns nothing"?
  options:
    - Func<string>
    - Action<string>
    - Predicate<string>
    - Converter<string, string>
  correctIndex: 1
  explanation: "`Action<T>` takes one argument and returns void; `Func<T, TResult>` returns a value; `Predicate<T>` returns bool."
- id: q7
  question: Forgetting to unsubscribe (`-=`) from a long-lived publisher's event causes…
  options:
    - A compile error
    - The event to fire twice
    - A memory leak (subscriber kept alive by the invocation list)
    - Nothing; the GC handles it
  correctIndex: 2
  explanation: The publisher's backing delegate holds a strong reference to the subscriber, so the subscriber is reachable and cannot be GC'd — a classic .NET memory leak.
- id: q8
  question: If one handler in a multicast invocation throws, what happens to the others?
  options:
    - They still run
    - The exception is swallowed
    - The runtime crashes
    - They are skipped (subsequent handlers do not run)
  correctIndex: 3
  explanation: Multicast invocation runs handlers in order; an exception propagates immediately and subsequent handlers in the invocation list do NOT run — iterate GetInvocationList() with try/catch to isolate.
- id: q9
  question: "`public Action? Foo;` (public delegate field) allows external code to…"
  options:
    - Invoke Foo(), clear it (Foo=null), or replace it — breaking encapsulation
    - Only add handlers
    - Nothing; it is read-only
    - Only read its target
  correctIndex: 0
  explanation: A public delegate field is fully accessible — external code can invoke, clear, or reassign it; use `event` to restrict external access to +=/-=.
- id: q10
  question: What is `GetInvocationList()` useful for?
  options:
    - Counting GC roots
    - Listing all subscribed handlers and invoking each in try/catch to isolate failures
    - Serializing the delegate
    - Converting the delegate to a string
  correctIndex: 1
  explanation: "`GetInvocationList()` returns an array of individual delegates; iterating it lets you invoke each in its own try/catch so one handler's exception does not block the others."
```

