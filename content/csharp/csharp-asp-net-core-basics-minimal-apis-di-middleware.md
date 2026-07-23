---
slug: csharp-asp-net-core-basics-minimal-apis-di-middleware
id: csharp-19
track: csharp
order: 19
title: ASP.NET Core Basics — Minimal APIs, DI, Middleware
description: Build HTTP APIs with Minimal APIs, wire up the DI container (singleton/scoped/transient), compose middleware, and structure a real `Program.cs` for production.
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8&t=18000s
whyItMatters: Build HTTP APIs with Minimal APIs, wire up the DI container (singleton/scoped/transient), compose middleware, and structure a real `Program. cs` for production.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# ASP.NET Core Basics — Minimal APIs, DI, Middleware

## ASP.NET Core Basics — Minimal APIs, DI, Middleware

### Why It Matters

Build HTTP APIs with Minimal APIs, wire up the DI container (singleton/scoped/transient), compose middleware, and structure a real `Program. cs` for production.

Build HTTP APIs with Minimal APIs, wire up the DI container (singleton/scoped/transient), compose middleware, and structure a real `Program.cs` for production.

### Prerequisites

- Stage 18: Testing (WebApplicationFactory).
- Stage 11: async/await.
- Stage 16: Multithreading (DI thread safety).

### Topics

- `WebApplication` and `WebApplicationBuilder` (top-level Program.cs)
- Minimal APIs: `MapGet`, `MapPost`, route parameters, return types
- Dependency injection: `AddSingleton`, `AddScoped`, `AddTransient`, `AddHttpClient`
- Constructor injection vs `[FromKeyedServices]` (.NET 8 keyed services)
- Middleware pipeline: `Use`, `Run`, `Map`, `UseWhen`
- Built-in middleware: routing, auth, exception handler, static files, response caching
- Configuration: `IConfiguration`, `appsettings.json`, environment variables, options pattern
- Logging: `ILogger<T>`, structured logging, Serilog integration

### Key Concepts

- DI lifetimes: Singleton (one instance app-wide, must be thread-safe), Scoped (one per request, share across handlers in the same request), Transient (new every time).
- Capturing a scoped service in a singleton causes a captive dependency — the singleton holds the scoped service forever, breaking per-request semantics; the container throws on validation.
- Minimal APIs compile handlers into request delegates at startup; parameters are bound by convention (route, query, body, services) — concise but slightly less explicit than controllers.
- Middleware runs in order on the way in and the way out (the pipeline is a chain); `app.Use(async (ctx, next) => { ... await next(); ... });` wraps the rest of the pipeline.
- The options pattern binds strongly-typed POCOs to `IConfiguration` sections; validate with `ValidateDataAnnotations()` or a `Validate` func on startup to fail fast.

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddHttpClient<IPaymentClient, PaymentClient>();

var app = builder.Build();
app.UseExceptionHandler(ex => ex.Run(async ctx => { /* problem details */ }));
app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/products/{id:int}", async (int id, IProductService svc) =>
    Results.Ok(await svc.GetAsync(id)));

app.MapPost("/products", async (ProductCreateDto dto, IProductService svc) =>
{
    var created = await svc.CreateAsync(dto);
    return Results.Created($"/products/{created.Id}", created);
});

app.Run();
```
Caption: Minimal API Program.cs

### Common Pitfalls

- Captive dependencies — a singleton consuming a scoped service; the scoped service lives forever, breaking per-request semantics. Use `IServiceScopeFactory` or move the singleton to scoped.
- Using `AddDbContext` as transient — DbContext is not thread-safe and should be scoped (one per request); transient creates many instances and bypasses the pool.
- Forgetting `ValidateOnStart` on options — invalid config is discovered at first request, not at startup; call `ValidateOnStart()` to fail fast.
- Middleware ordering — `UseAuthentication` must come before `UseAuthorization`; `UseRouting` before `UseEndpoints`; `UseExceptionHandler` early; wrong order causes silent auth bypass or 404s.
- Injecting `IConfiguration` directly — instead of strongly-typed options; use the options pattern for testability and validation.

### Real-World Applications

- Stack Overflow's public site runs on ASP.NET Core Minimal-ish APIs (they migrated controllers to endpoint routing for perf), serving ~900M pageviews/month.
- Microsoft's Azure SDK management libraries are built on ASP.NET Core's DI and HttpClientFactory patterns.
- Unity's Netcode for GameObjects uses ASP.NET Core-style DI in the server hosting layer for multiplayer game servers.
- Accenture's internal microservices use ASP.NET Core Minimal APIs with OpenAPI and Serilog structured logging on Azure Kubernetes Service.

### Interview Questions

- 1. What are the three DI lifetimes and when do you use each? — Singleton (one app-wide, thread-safe, for stateless/expensive services); Scoped (one per request, for DbContext/repositories); Transient (new every time, for lightweight stateless).
- 2. What is a captive dependency? — A longer-lived service (e.g., singleton) that holds a shorter-lived service (e.g., scoped); the shorter one is held captive beyond its intended lifetime, breaking per-request semantics.
- 3. What is the difference between `AddDbContext` and `AddDbContextPool`? — `AddDbContext` registers scoped; `AddDbContextPool` pools instances for reuse across requests (faster, fewer allocations) — but the instance is reset between uses.
- 4. Why does middleware order matter? — The pipeline runs in registration order; auth before authz, routing before endpoints, exception handler early. Wrong order can cause silent auth bypass or 404s for valid routes.
- 5. What is the options pattern and why prefer it over `IConfiguration`? — Strongly-typed POCOs bound to config sections with validation; testable, refactor-safe, and fail-fast via `ValidateOnStart`.

### Mini Project

Build a URL Shortener API: A Minimal API with endpoints to create (`POST /shorten`), redirect (`GET /{code}`), and view stats (`GET /stats/{code}`), backed by an in-memory `ConcurrentDictionary`, with structured logging and options-based config. Suggested approach:
  - `WebApplication.CreateBuilder` + `AddScoped<IShortenerService, ShortenerService>()`
  - `app.MapPost("/shorten", (ShortenRequest req, IShortenerService svc) => Results.Created(...))`
  - `app.MapGet("/{code}", async (string code, IShortenerService svc) => Results.Redirect(await svc.ResolveAsync(code)))`
  - Add `ITelemetry` scoped service using `ILogger<T>` structured logging
  - Bind `ShortenerOptions { BaseUrl }` via the options pattern with `ValidateOnStart`

### Exercises

1. Build a Minimal API with `MapGet`, `MapPost`, and a scoped service; verify one instance per request via a GUID log.
2. Inject `IConfiguration` into a transient service and reproduce the captive-dependency warning by injecting it into a singleton.
3. Author a timing middleware that adds `X-Elapsed-Ms` to every response.
4. Bind an `EmailOptions` POCO with `[Required]` and call `ValidateOnStart`; verify the app fails to start when the section is missing.
5. Write a `WebApplicationFactory<Program>` test that POSTs and then GETs a shortened URL end-to-end.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which DI lifetime creates one instance per HTTP request?
9. A) Singleton
10. B) Transient
11. C) Scoped (*)
12. D) Static
13. Explanation: Scoped services have one instance per DI scope (per HTTP request by default); singletons are app-wide, transients are new every time.
14. Q2: A singleton that injects a scoped service is called…
15. A) A factory pattern
16. B) Lazy loading
17. C) A scoped singleton
18. D) A captive dependency (the scoped service lives forever) (*)
19. Explanation: The scoped service is held captive beyond its intended request scope, breaking per-request semantics; the container throws on validation. Use `IServiceScopeFactory` instead.
20. Q3: `AddDbContext<T>` registers the context as…
21. A) Scoped (one per request) (*)
22. B) Singleton
23. C) Transient
24. D) Static
25. Explanation: DbContext is not thread-safe and should be scoped (one per request); `AddDbContextPool` reuses instances across requests (faster) but resets them between uses.
26. Q4: Middleware in ASP.NET Core runs…
27. A) Once per app lifecycle
28. B) In order on the way in and reverse order on the way out (a chain) (*)
29. C) In parallel
30. D) Only on errors
31. Explanation: Each middleware calls `await next()` to invoke the next; after it returns, code after `next` runs on the way out. The pipeline is a chain — order matters.
32. Q5: `ValidateOnStart()` on options…
33. A) Validates options on every request
34. B) Disables validation
35. C) Validates options when the app starts (fail fast) (*)
36. D) Validates only at runtime
37. Explanation: Without `ValidateOnStart`, invalid config is discovered at first use; `ValidateOnStart` triggers validation at host startup so the app refuses to start with bad config.
38. Q6: Minimal API parameter binding by convention maps…
39. A) All parameters from the body
40. B) Only services
41. C) Only strings
42. D) Route, query, body, and services automatically based on type and name (*)
43. Explanation: Minimal APIs bind route params from `{id}`, query from querystring, body from JSON for complex types, and registered services from DI — all by convention. Explicit attributes (`[FromBody]`) override.
44. Q7: Which middleware order is correct?
45. A) UseRouting → UseAuthentication → UseAuthorization → UseEndpoints (*)
46. B) UseAuthorization → UseRouting → UseAuthentication → UseEndpoints
47. C) UseEndpoints → UseRouting → UseAuthentication
48. D) UseAuthentication → UseEndpoints → UseRouting
49. Explanation: Routing must come first (to identify the endpoint), then authentication (who is the user?), then authorization (are they allowed?), then endpoints. Wrong order can silently bypass auth.
50. Q8: `Results.Ok(obj)` in a Minimal API returns…
51. A) A 201 Created
52. B) A 200 with a JSON body (*)
53. C) A 204 No Content
54. D) A 500
55. Explanation: `Results.Ok(obj)` returns HTTP 200 with `obj` serialized as JSON; `Results.Created(uri, obj)` returns 201; `Results.NoContent()` returns 204.
56. Q9: `AddHttpClient<TClient, TImpl>()` registers…
57. A) A singleton HttpClient
58. B) A transient HttpClient
59. C) A typed HttpClient with managed lifetime and pooled HttpMessageHandler (*)
60. D) A scoped HttpClient
61. Explanation: `AddHttpClient<T>` registers a typed client (transient) that wraps an `IHttpClientFactory`-provided handler; the handler is pooled and recycled (HttpClient itself is long-lived to avoid socket exhaustion).
62. Q10: The options pattern is preferred over injecting `IConfiguration` directly because…
63. A) IConfiguration is internal
64. B) IConfiguration is slower
65. C) Options are required by the runtime
66. D) Options are strongly typed, testable, and support validation (*)
67. Explanation: Options bind strongly-typed POCOs to config sections with validation and `ValidateOnStart`; injecting `IConfiguration` loses type safety, refactoring, and testability.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which DI lifetime creates one instance per HTTP request?
  options:
    - Singleton
    - Transient
    - Scoped
    - Static
  correctIndex: 2
  explanation: Scoped services have one instance per DI scope (per HTTP request by default); singletons are app-wide, transients are new every time.
- id: q2
  question: A singleton that injects a scoped service is called…
  options:
    - A factory pattern
    - Lazy loading
    - A scoped singleton
    - A captive dependency (the scoped service lives forever)
  correctIndex: 3
  explanation: The scoped service is held captive beyond its intended request scope, breaking per-request semantics; the container throws on validation. Use `IServiceScopeFactory` instead.
- id: q3
  question: "`AddDbContext<T>` registers the context as…"
  options:
    - Scoped (one per request)
    - Singleton
    - Transient
    - Static
  correctIndex: 0
  explanation: DbContext is not thread-safe and should be scoped (one per request); `AddDbContextPool` reuses instances across requests (faster) but resets them between uses.
- id: q4
  question: Middleware in ASP.NET Core runs…
  options:
    - Once per app lifecycle
    - In order on the way in and reverse order on the way out (a chain)
    - In parallel
    - Only on errors
  correctIndex: 1
  explanation: Each middleware calls `await next()` to invoke the next; after it returns, code after `next` runs on the way out. The pipeline is a chain — order matters.
- id: q5
  question: "`ValidateOnStart()` on options…"
  options:
    - Validates options on every request
    - Disables validation
    - Validates options when the app starts (fail fast)
    - Validates only at runtime
  correctIndex: 2
  explanation: Without `ValidateOnStart`, invalid config is discovered at first use; `ValidateOnStart` triggers validation at host startup so the app refuses to start with bad config.
- id: q6
  question: Minimal API parameter binding by convention maps…
  options:
    - All parameters from the body
    - Only services
    - Only strings
    - Route, query, body, and services automatically based on type and name
  correctIndex: 3
  explanation: Minimal APIs bind route params from `{id}`, query from querystring, body from JSON for complex types, and registered services from DI — all by convention. Explicit attributes (`[FromBody]`) override.
- id: q7
  question: Which middleware order is correct?
  options:
    - UseRouting → UseAuthentication → UseAuthorization → UseEndpoints
    - UseAuthorization → UseRouting → UseAuthentication → UseEndpoints
    - UseEndpoints → UseRouting → UseAuthentication
    - UseAuthentication → UseEndpoints → UseRouting
  correctIndex: 0
  explanation: Routing must come first (to identify the endpoint), then authentication (who is the user?), then authorization (are they allowed?), then endpoints. Wrong order can silently bypass auth.
- id: q8
  question: "`Results.Ok(obj)` in a Minimal API returns…"
  options:
    - A 201 Created
    - A 200 with a JSON body
    - A 204 No Content
    - A 500
  correctIndex: 1
  explanation: "`Results.Ok(obj)` returns HTTP 200 with `obj` serialized as JSON; `Results.Created(uri, obj)` returns 201; `Results.NoContent()` returns 204."
- id: q9
  question: "`AddHttpClient<TClient, TImpl>()` registers…"
  options:
    - A singleton HttpClient
    - A transient HttpClient
    - A typed HttpClient with managed lifetime and pooled HttpMessageHandler
    - A scoped HttpClient
  correctIndex: 2
  explanation: "`AddHttpClient<T>` registers a typed client (transient) that wraps an `IHttpClientFactory`-provided handler; the handler is pooled and recycled (HttpClient itself is long-lived to avoid socket exhaustion)."
- id: q10
  question: The options pattern is preferred over injecting `IConfiguration` directly because…
  options:
    - IConfiguration is internal
    - IConfiguration is slower
    - Options are required by the runtime
    - Options are strongly typed, testable, and support validation
  correctIndex: 3
  explanation: Options bind strongly-typed POCOs to config sections with validation and `ValidateOnStart`; injecting `IConfiguration` loses type safety, refactoring, and testability.
```

