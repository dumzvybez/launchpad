---
slug: java-java-time-date-time-api-formatting
id: java-14
track: java
order: 14
title: java.time, Date/Time API, and Formatting
description: Use the modern java.time API (LocalDate, LocalTime, LocalDateTime, ZonedDateTime, Instant, Duration, Period) for all date and time work, and format/parse with DateTimeFormatter.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=15600s
whyItMatters: Use the modern java. time API (LocalDate, LocalTime, LocalDateTime, ZonedDateTime, Instant, Duration, Period) for all date and time work, and format/parse with DateTimeFormatter.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# java.time, Date/Time API, and Formatting

## java.time, Date/Time API, and Formatting

### Why It Matters

Use the modern java. time API (LocalDate, LocalTime, LocalDateTime, ZonedDateTime, Instant, Duration, Period) for all date and time work, and format/parse with DateTimeFormatter.

Use the modern java.time API (LocalDate, LocalTime, LocalDateTime, ZonedDateTime, Instant, Duration, Period) for all date and time work, and format/parse with DateTimeFormatter.

### Prerequisites

- Stage 13: Concurrency — Threads, Executors, Synchronizers.
- Awareness of the legacy Date/Calendar APIs (so you know what to avoid).

### Topics

- The legacy java.util.Date and Calendar (and why to avoid them)
- java.time core classes: Instant, LocalDate, LocalTime, LocalDateTime, ZonedDateTime
- Duration (time-based) vs Period (date-based)
- Temporal amounts and TemporalAdjusters
- DateTimeFormatter for parsing and formatting
- Time zones, ZoneId, and ZoneOffset
- Clock for testability
- Internationalization with NumberFormat and DateFormat

### Key Concepts

- java.time types are immutable and thread-safe (Date and Calendar are mutable and broken).
- `Instant` is a point on the UTC timeline (machine time); `LocalDateTime` is wall-clock time without a zone (human time, ambiguous).
- `Duration` measures seconds/nanoseconds (use between Instants or LocalTimes); `Period` measures years/months/days (use between LocalDates).
- `ZonedDateTime` carries a ZoneId so it can resolve DST overlaps/gaps; `OffsetDateTime` carries only a fixed offset.
- `DateTimeFormatter` is thread-safe (unlike the legacy SimpleDateFormat, which is notoriously not).

```java
import java.time.*;
import java.time.format.DateTimeFormatter;

LocalDate today = LocalDate.now();
LocalTime now = LocalTime.now();
LocalDateTime dt = LocalDateTime.of(2024, Month.MARCH, 14, 13, 0);
Instant epoch = Instant.EPOCH;
ZonedDateTime zdt = ZonedDateTime.now(ZoneId.of("America/New_York"));

System.out.println(today.plusDays(7));             // 2024-03-21 (today + 7)
System.out.println(dt.format(DateTimeFormatter.ISO_DATE_TIME));
```
Caption: Basic java.time usage

### Common Pitfalls

- Using `Date` or `Calendar` in new code — mutable, months are 0-indexed (January = 0), and not thread-safe; use java.time.
- Using `SimpleDateFormat` from multiple threads — not thread-safe; use `DateTimeFormatter` (immutable and thread-safe).
- Confusing `LocalDateTime` with `Instant` — LocalDateTime has no zone and is ambiguous; Instant is unambiguous UTC.
- Adding 24 hours and calling it "tomorrow" — DST transitions make some days 23 or 25 hours; use `LocalDate.plusDays(1)` instead of `Instant.plus(Duration.ofHours(24))`.
- Storing instants as longs (epoch millis) — loses timezone context and is opaque; use ISO-8601 strings or Instant/OffsetDateTime in persistence.

### Real-World Applications

- Airlines' flight scheduling systems rely on ZonedDateTime to handle DST transitions and timezone-aware arrival computations.
- Apache Kafka stores record timestamps as epoch millis internally but exposes them through Instant-based APIs in the Java client.
- Spring's @Scheduled cron expressions evaluate against a configurable Clock (ZoneId), enabling deterministic testing.
- LinkedIn's notification platform uses java.time throughout — Clock injection lets tests simulate "tomorrow" without waiting.

### Interview Questions

- 1. Why was java.time introduced? — Date and Calendar were mutable, had 0-indexed months, and were not thread-safe; java.time (JSR 310, Java 8) is immutable, ISO-8601-aligned, and thread-safe.
- 2. Difference between Instant, LocalDateTime, and ZonedDateTime? — Instant is UTC machine time; LocalDateTime is wall-clock without a zone (ambiguous); ZonedDateTime adds a ZoneId for disambiguation.
- 3. Duration vs Period? — Duration is time-based (seconds + nanos); Period is date-based (years + months + days) — adding a Period of 1 month to Jan 31 gives Feb 28.
- 4. Why is SimpleDateFormat dangerous in concurrent code? — It's mutable and not thread-safe; concurrent format/parse calls corrupt internal state. Use DateTimeFormatter.
- 5. How do you make time-dependent code testable? — Inject a `Clock` (java.time.Clock) and use `Instant.now(clock)` / `LocalDate.now(clock)`; tests pass a fixed clock.

### Mini Project

Build a Meeting Planner: Given participants' time zones and a candidate UTC instant, find the next N working-hour slots (9-17 local) that work for everyone. Suggested approach:
  - Take a `List<ZoneId>` and a starting `Instant` from argv
  - For each candidate hour, compute each participant's `ZonedDateTime` and check 9 <= hour < 17, Mon-Fri
  - Use `TemporalAdjusters.next(DayOfWeek.MONDAY)` for weekend skipping
  - Inject `Clock` so tests can fix the time
  - Print results in ISO-8601 UTC and in each participant's local time

### Exercises

1. Compute your age in years and total days using LocalDate and Period; verify against a manual calculation.
2. Build a DateRange iterator that yields each LocalDate between two bounds using a Stream and `LocalDate::datesUntil` (Java 9+).
3. Parse "2024-03-14T13:00:00-05:00" with OffsetDateTime; convert to Instant and ZonedDateTime in two zones; print all three.
4. Demonstrate that SimpleDateFormat is not thread-safe by spawning threads that concurrently format dates; observe corruption. Replace with DateTimeFormatter.
5. Inject a `Clock.fixed(...)` into a service whose method returns "is it morning?" and write a JUnit test that asserts true at 09:00 and false at 14:00.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: java.time types are?
9. A) Mutable and not thread-safe
10. B) Immutable and thread-safe (*)
11. C) Mutable but thread-safe
12. D) Immutable but not thread-safe
13. Explanation: All java.time types are immutable and thread-safe; methods like plusDays return a new instance rather than mutating the original.
14. Q2: Which type represents a point on the UTC timeline?
15. A) LocalDate
16. B) LocalDateTime
17. C) Instant (*)
18. D) LocalTime
19. Explanation: Instant is a machine-time point on the UTC timeline (seconds + nanos since the Unix epoch). LocalDate/LocalDateTime have no zone.
20. Q3: SimpleDateFormat is?
21. A) Thread-safe
22. B) Deprecated for removal
23. C) A subtype of DateTimeFormatter
24. D) Not thread-safe — concurrent use corrupts internal state (*)
25. Explanation: SimpleDateFormat mutates internal Calendar state during format/parse; concurrent calls corrupt it. Use DateTimeFormatter (immutable, thread-safe) instead.
26. Q4: Duration vs Period — which is date-based (years/months/days)?
27. A) Period (*)
28. B) Duration
29. C) Both
30. D) Neither
31. Explanation: Period is date-based (P1Y2M3D); Duration is time-based (PT90S = 90 seconds). Adding Period.ofMonths(1) to Jan 31 yields Feb 28.
32. Q5: Which type should you use for a future appointment with a timezone?
33. A) LocalDateTime
34. B) ZonedDateTime (*)
35. C) LocalDate
36. D) Instant only
37. Explanation: ZonedDateTime carries a ZoneId, so it can resolve DST overlaps/gaps. LocalDateTime is ambiguous (no zone); Instant is unambiguous but loses wall-clock context.
38. Q6: In legacy `java.util.Calendar`, January is represented by?
39. A) 1
40. B) "JAN"
41. C) 0 (*)
42. D) An enum
43. Explanation: Calendar months are 0-indexed (January = 0), a notorious source of off-by-one bugs. java.time uses the Month enum instead.
44. Q7: For testable time-dependent code, inject a?
45. A) Date
46. B) long epoch millis
47. C) Thread
48. D) Clock (*)
49. Explanation: Inject java.time.Clock; in production use Clock.systemUTC() and in tests use Clock.fixed(instant, zone) for deterministic behavior.
50. Q8: Adding 24 hours to compute "tomorrow" can fail because?
51. A) DST transitions make some days 23 or 25 hours (*)
52. B) The JVM uses 25-hour days internally
53. C) Time zones don't exist
54. D) LocalDateTime doesn't support addition
55. Explanation: On DST spring-forward, a day is 23 hours; on fall-back, 25. Use LocalDate.plusDays(1) (calendar-aware) instead of Instant.plusHours(24).
56. Q9: `DateTimeFormatter.ofPattern("yyyy-MM-dd")` is?
57. A) Mutable
58. B) Immutable and thread-safe; safe to share as a static final (*)
59. C) Only for parsing, not formatting
60. D) Slower than SimpleDateFormat
61. Explanation: DateTimeFormatter is immutable and thread-safe; it's standard practice to declare formatters as `private static final` constants.
62. Q10: Which represents a date with an offset (no full zone rules)?
63. A) ZonedDateTime
64. B) LocalDateTime
65. C) OffsetDateTime (*)
66. D) Instant
67. Explanation: OffsetDateTime carries a fixed ZoneOffset (e.g., -05:00) without DST rules. ZonedDateTime carries a full ZoneId (e.g., America/New_York) and resolves DST.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: java.time types are?
  options:
    - Mutable and not thread-safe
    - Immutable and thread-safe
    - Mutable but thread-safe
    - Immutable but not thread-safe
  correctIndex: 1
  explanation: All java.time types are immutable and thread-safe; methods like plusDays return a new instance rather than mutating the original.
- id: q2
  question: Which type represents a point on the UTC timeline?
  options:
    - LocalDate
    - LocalDateTime
    - Instant
    - LocalTime
  correctIndex: 2
  explanation: Instant is a machine-time point on the UTC timeline (seconds + nanos since the Unix epoch). LocalDate/LocalDateTime have no zone.
- id: q3
  question: SimpleDateFormat is?
  options:
    - Thread-safe
    - Deprecated for removal
    - A subtype of DateTimeFormatter
    - Not thread-safe — concurrent use corrupts internal state
  correctIndex: 3
  explanation: SimpleDateFormat mutates internal Calendar state during format/parse; concurrent calls corrupt it. Use DateTimeFormatter (immutable, thread-safe) instead.
- id: q4
  question: Duration vs Period — which is date-based (years/months/days)?
  options:
    - Period
    - Duration
    - Both
    - Neither
    - ; Duration is time-based (PT90S = 90 seconds). Adding Period.ofMonths(1) to Jan 31 yields Feb 28.
  correctIndex: 0
  explanation: Period is date-based (P1Y2M3D); Duration is time-based (PT90S = 90 seconds). Adding Period.ofMonths(1) to Jan 31 yields Feb 28.
- id: q5
  question: Which type should you use for a future appointment with a timezone?
  options:
    - LocalDateTime
    - ZonedDateTime
    - LocalDate
    - Instant only
  correctIndex: 1
  explanation: ZonedDateTime carries a ZoneId, so it can resolve DST overlaps/gaps. LocalDateTime is ambiguous (no zone); Instant is unambiguous but loses wall-clock context.
- id: q6
  question: In legacy `java.util.Calendar`, January is represented by?
  options:
    - "1"
    - '"JAN"'
    - "0"
    - An enum
  correctIndex: 2
  explanation: Calendar months are 0-indexed (January = 0), a notorious source of off-by-one bugs. java.time uses the Month enum instead.
- id: q7
  question: For testable time-dependent code, inject a?
  options:
    - Date
    - long epoch millis
    - Thread
    - Clock
  correctIndex: 3
  explanation: Inject java.time.Clock; in production use Clock.systemUTC() and in tests use Clock.fixed(instant, zone) for deterministic behavior.
- id: q8
  question: Adding 24 hours to compute "tomorrow" can fail because?
  options:
    - DST transitions make some days 23 or 25 hours
    - The JVM uses 25-hour days internally
    - Time zones don't exist
    - LocalDateTime doesn't support addition
  correctIndex: 0
  explanation: On DST spring-forward, a day is 23 hours; on fall-back, 25. Use LocalDate.plusDays(1) (calendar-aware) instead of Instant.plusHours(24).
- id: q9
  question: '`DateTimeFormatter.ofPattern("yyyy-MM-dd")` is?'
  options:
    - Mutable
    - Immutable and thread-safe; safe to share as a static final
    - Only for parsing, not formatting
    - Slower than SimpleDateFormat
  correctIndex: 1
  explanation: DateTimeFormatter is immutable and thread-safe; it's standard practice to declare formatters as `private static final` constants.
- id: q10
  question: Which represents a date with an offset (no full zone rules)?
  options:
    - ZonedDateTime
    - LocalDateTime
    - OffsetDateTime
    - Instant
  correctIndex: 2
  explanation: OffsetDateTime carries a fixed ZoneOffset (e.g., -05:00) without DST rules. ZonedDateTime carries a full ZoneId (e.g., America/New_York) and resolves DST.
```

