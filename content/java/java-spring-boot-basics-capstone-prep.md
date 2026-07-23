---
slug: java-spring-boot-basics-capstone-prep
id: java-20
track: java
order: 20
title: Spring Boot Basics and Capstone Prep
description: Stand up a Spring Boot REST service with controllers, services, repositories, configuration, and validation, then prepare to combine every prior stage in the capstone.
difficulty: advanced
estMinutes: 360
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=22800s
whyItMatters: Stand up a Spring Boot REST service with controllers, services, repositories, configuration, and validation, then prepare to combine every prior stage in the capstone.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# Spring Boot Basics and Capstone Prep

## Spring Boot Basics and Capstone Prep

### Why It Matters

Stand up a Spring Boot REST service with controllers, services, repositories, configuration, and validation, then prepare to combine every prior stage in the capstone.

Stand up a Spring Boot REST service with controllers, services, repositories, configuration, and validation, then prepare to combine every prior stage in the capstone.

### Prerequisites

- Stage 19: Testing — JUnit 5, Mockito, and TDD.
- All previous stages — this stage ties them together.

### Topics

- Spring Boot starter projects and auto-configuration
- @SpringBootApplication, @Component, @Service, @Repository, @Controller/@RestController
- Dependency injection (constructor injection preferred)
- Configuration with application.yml and @ConfigurationProperties
- @GetMapping/@PostMapping and request/response binding
- Bean Validation with @Valid, @NotNull, @Size
- Exception handling with @ControllerAdvice
- Testing with @SpringBootTest, @WebMvcTest, @DataJpaTest
- Actuator and health checks

### Key Concepts

- Spring Boot's auto-configuration inspects the classpath and wires sensible defaults (e.g., embedded Tomcat, HikariCP, Jackson).
- Constructor injection is the recommended DI style — fields can be final, classes are easier to test, and the compiler enforces dependencies.
- @RestController = @Controller + @ResponseBody; methods return data (serialized to JSON by Jackson) instead of view names.
- Bean Validation (@Valid, @NotNull, @Size) declaratively validates input; @ControllerAdvice centralizes error responses.
- @SpringBootTest loads the full context (slow); @WebMvcTest and @DataJpaTest load only slices (fast).

```java
@RestController
@RequestMapping("/api/tasks")
@Validated
public class TaskController {
    private final TaskService service;

    public TaskController(TaskService service) { this.service = service; }  // constructor injection

    @PostMapping
    public Task create(@Valid @RequestBody TaskCreate req) {
        return service.create(req);
    }

    @GetMapping("/{id}")
    public Task get(@PathVariable Long id) {
        return service.findOrThrow(id);
    }
}

public record TaskCreate(
    @NotBlank String title,
    @Size(max = 500) String description,
    @NotNull Priority priority) {}
```
Caption: REST controller with validation

### Common Pitfalls

- Field injection with @Autowired — makes dependencies hidden, fields non-final, and tests harder; use constructor injection.
- Loading the full context in every test (@SpringBootTest) — slow; use slice tests (@WebMvcTest, @DataJpaTest) for unit-level coverage.
- Letting exceptions propagate without @ControllerAdvice — clients get 500s with stack traces; map known exceptions to status codes centrally.
- Putting business logic in controllers — controllers should bind/validate/return; put logic in @Service classes.
- Forgetting @Transactional on multi-step service methods — partial writes commit on a JPA repository default; wrap mutating flows explicitly.

### Real-World Applications

- Spring Boot powers large portions of the backends at Disney+, Capital One, Netflix (with Spring Cloud), and countless fintech and enterprise services.
- Spring's auto-configuration was the inspiration for Micronaut and Quarkus, which mirror the convention-over-configuration approach with ahead-of-time compilation.
- The Spring Initializr (start.spring.io) generates ~50 million projects per year and is the de facto entry point for new Java services.
- Spring Boot 3.2 introduced first-class virtual-thread support, letting blocking JPA code scale to millions of concurrent requests.

### Interview Questions

- 1. What does @SpringBootApplication do? — Combines @Configuration, @EnableAutoConfiguration, and @ComponentScan; it's the standard entry point for a Spring Boot app.
- 2. Why prefer constructor injection? — Fields can be final, the compiler enforces dependencies, and tests can construct the object with mocks without reflection.
- 3. What is @RestController? — @Controller + @ResponseBody; methods return data (serialized by Jackson) instead of view names.
- 4. What is the difference between @SpringBootTest and @WebMvcTest? — @SpringBootTest loads the full context (slow); @WebMvcTest loads only the web slice (controllers, converters, MockMvc).
- 5. How does Spring Boot auto-configuration work? — Conditional classes (@ConditionalOnClass, @ConditionalOnMissingBean) inspect the classpath and register beans; @EnableAutoConfiguration triggers them.

### Mini Project

Build a Task API Skeleton: A Spring Boot REST service for tasks with create, read, list, update, and delete operations, validation, and a controller advice. This skeleton seeds the capstone. Suggested approach:
  - Generate a project at start.spring.io with Web, Validation, JPA, H2, and Actuator
  - Define `Task` JPA entity and `TaskRepository extends JpaRepository<Task, Long>`
  - Implement `TaskService` with @Transactional create/update and OrElseThrow for find
  - Expose a `TaskController` with POST/GET/LIST/PUT/DELETE mapped to /api/tasks
  - Add a `@RestControllerAdvice` mapping TaskNotFoundException to 404 and validation errors to 400
  - Write @WebMvcTest tests for the controller and @DataJpaTest tests for the repository

### Exercises

1. Generate a Spring Boot project at start.spring.io with Web, JPA, H2, Validation, and Actuator; run it and visit /actuator/health.
2. Convert a @Controller that returns view names into a @RestController returning JSON; verify with curl.
3. Add @Valid and @NotBlank validation to a request DTO; send invalid JSON and observe the 400 response from your @ControllerAdvice.
4. Write a @WebMvcTest that mocks the service layer and asserts the controller returns 404 on a missing id; then write a @DataJpaTest for the repository.
5. Enable virtual threads in Spring Boot 3.2 (`spring.threads.virtual.enabled=true`); load-test with a slow endpoint and observe thread scaling.
6. >>> QUIZ (Stage 20) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: @SpringBootApplication combines?
9. A) @Component, @Service, @Repository
10. B) @Bean, @Autowired, @Component
11. C) @Controller, @RestController, @RequestMapping
12. D) @Configuration, @EnableAutoConfiguration, @ComponentScan (*)
13. Explanation: @SpringBootApplication is a meta-annotation combining @Configuration (bean definitions), @EnableAutoConfiguration (auto-wiring), and @ComponentScan (component discovery).
14. Q2: The recommended dependency injection style in Spring is?
15. A) Constructor injection (*)
16. B) Field injection (@Autowired on fields)
17. C) Setter injection only
18. D) Static injection
19. Explanation: Constructor injection allows final fields, surfaces dependencies in the API, and is the Spring team's recommended approach. @Autowired on fields is discouraged.
20. Q3: @RestController is shorthand for?
21. A) @Controller + @Component
22. B) @Controller + @ResponseBody (*)
23. C) @Service + @RequestMapping
24. D) @Configuration + @Bean
25. Explanation: @RestController = @Controller + @ResponseBody (added at the type level). Every method's return value is serialized to the response body (typically JSON via Jackson).
26. Q4: @WebMvcTest loads?
27. A) The entire Spring context
28. B) Only JPA repositories
29. C) Only the web slice — controllers, converters, and MockMvc (*)
30. D) Nothing — it's a no-op
31. Explanation: @WebMvcTest loads only the web layer (controllers, MVC infra, MockMvc) — fast and isolated. Services are typically mocked with @MockBean.
32. Q5: Bean Validation (@Valid, @NotBlank) integrates with Spring MVC by?
33. A) Skipping validation
34. B) Throwing SQLException
35. C) Logging only
36. D) Triggering MethodArgumentNotValidException on failure (*)
37. Explanation: When @Valid fails, Spring throws MethodArgumentNotValidException, which a @ControllerAdvice can map to a 400 response with field-level error details.
38. Q6: Spring Boot auto-configuration primarily relies on?
39. A) @Conditional annotations (@ConditionalOnClass, @ConditionalOnMissingBean, etc.) (*)
40. B) Reflection without conditions
41. C) XML configuration files
42. D) Manual bean wiring
43. Explanation: Auto-configuration classes use @Conditional* annotations to register beans only when the classpath/properties are appropriate, enabling sensible defaults without manual wiring.
44. Q7: @Transactional on a service method?
45. A) Has no effect
46. B) Wraps the method in a transaction; commits on normal return, rolls back on RuntimeException (*)
47. C) Forces async execution
48. D) Disables the persistence context
49. Explanation: @Transactional (Spring's) opens a transaction, binds the EM to the thread, commits on normal return, and rolls back on unchecked exceptions by default.
50. Q8: HikariCP is the default connection pool in Spring Boot because?
51. A) It's the only pool that works
52. B) Spring wrote it themselves
53. C) It's fast, lightweight, and production-grade (*)
54. D) It was the only choice pre-2015
55. Explanation: HikariCP (~130KB) outperforms older pools (DBCP, c3p0, Tomcat JDBC) and has been the default since Spring Boot 2.0.
56. Q9: Spring Boot Actuator provides?
57. A) A web framework
58. B) A database driver
59. C) An ORM
60. D) Production-ready endpoints (health, info, metrics, env) (*)
61. Explanation: Actuator adds operational endpoints (/actuator/health, /actuator/metrics, /actuator/env, /actuator/info) for monitoring and management — production-ready by design.
62. Q10: Spring Boot 3.2 introduced first-class support for?
63. A) Virtual threads (*)
64. B) Java 8
65. C) XML config revival
66. D) Native reflection
67. Explanation: Spring Boot 3.2 added `spring.threads.virtual.enabled=true`, mounting blocking servlet/JPA work onto virtual threads so blocking code can scale to millions of concurrent requests.
68. ----------------------------------------------------------------------
69. ======================================================================

```quiz
- id: q1
  question: "@SpringBootApplication combines?"
  options:
    - "@Component, @Service, @Repository"
    - "@Bean, @Autowired, @Component"
    - "@Controller, @RestController, @RequestMapping"
    - "@Configuration, @EnableAutoConfiguration, @ComponentScan"
  correctIndex: 3
  explanation: "@SpringBootApplication is a meta-annotation combining @Configuration (bean definitions), @EnableAutoConfiguration (auto-wiring), and @ComponentScan (component discovery)."
- id: q2
  question: The recommended dependency injection style in Spring is?
  options:
    - Constructor injection
    - Field injection (@Autowired on fields)
    - Setter injection only
    - Static injection
  correctIndex: 0
  explanation: Constructor injection allows final fields, surfaces dependencies in the API, and is the Spring team's recommended approach. @Autowired on fields is discouraged.
- id: q3
  question: "@RestController is shorthand for?"
  options:
    - "@Controller + @Component"
    - "@Controller + @ResponseBody"
    - "@Service + @RequestMapping"
    - "@Configuration + @Bean"
  correctIndex: 1
  explanation: "@RestController = @Controller + @ResponseBody (added at the type level). Every method's return value is serialized to the response body (typically JSON via Jackson)."
- id: q4
  question: "@WebMvcTest loads?"
  options:
    - The entire Spring context
    - Only JPA repositories
    - Only the web slice — controllers, converters, and MockMvc
    - Nothing — it's a no-op
  correctIndex: 2
  explanation: "@WebMvcTest loads only the web layer (controllers, MVC infra, MockMvc) — fast and isolated. Services are typically mocked with @MockBean."
- id: q5
  question: Bean Validation (@Valid, @NotBlank) integrates with Spring MVC by?
  options:
    - Skipping validation
    - Throwing SQLException
    - Logging only
    - Triggering MethodArgumentNotValidException on failure
  correctIndex: 3
  explanation: When @Valid fails, Spring throws MethodArgumentNotValidException, which a @ControllerAdvice can map to a 400 response with field-level error details.
- id: q6
  question: Spring Boot auto-configuration primarily relies on?
  options:
    - "@Conditional annotations (@ConditionalOnClass, @ConditionalOnMissingBean, etc.)"
    - Reflection without conditions
    - XML configuration files
    - Manual bean wiring
  correctIndex: 0
  explanation: Auto-configuration classes use @Conditional* annotations to register beans only when the classpath/properties are appropriate, enabling sensible defaults without manual wiring.
- id: q7
  question: "@Transactional on a service method?"
  options:
    - Has no effect
    - Wraps the method in a transaction; commits on normal return, rolls back on RuntimeException
    - Forces async execution
    - Disables the persistence context
  correctIndex: 1
  explanation: "@Transactional (Spring's) opens a transaction, binds the EM to the thread, commits on normal return, and rolls back on unchecked exceptions by default."
- id: q8
  question: HikariCP is the default connection pool in Spring Boot because?
  options:
    - It's the only pool that works
    - Spring wrote it themselves
    - It's fast, lightweight, and production-grade
    - It was the only choice pre-2015
    - outperforms older pools (DBCP, c3p0, Tomcat JDBC) and has been the default since Spring Boot 2.0.
  correctIndex: 2
  explanation: HikariCP (~130KB) outperforms older pools (DBCP, c3p0, Tomcat JDBC) and has been the default since Spring Boot 2.0.
- id: q9
  question: Spring Boot Actuator provides?
  options:
    - A web framework
    - A database driver
    - An ORM
    - Production-ready endpoints (health, info, metrics, env)
  correctIndex: 3
  explanation: Actuator adds operational endpoints (/actuator/health, /actuator/metrics, /actuator/env, /actuator/info) for monitoring and management — production-ready by design.
- id: q10
  question: Spring Boot 3.2 introduced first-class support for?
  options:
    - Virtual threads
    - Java 8
    - XML config revival
    - Native reflection
  correctIndex: 0
  explanation: Spring Boot 3.2 added `spring.threads.virtual.enabled=true`, mounting blocking servlet/JPA work onto virtual threads so blocking code can scale to millions of concurrent requests.
```

