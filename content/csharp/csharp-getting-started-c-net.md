---
slug: csharp-getting-started-c-net
id: csharp-01
track: csharp
order: 1
title: Getting Started with C# and .NET
description: Install the .NET 8 SDK, use the dotnet CLI to scaffold your first app, run a top-level-statements Hello World, and understand the edit-build-run loop and the CLR execution model.
difficulty: beginner
estMinutes: 75
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=GhQdlIFylQ8
whyItMatters: Install the. NET 8 SDK, use the dotnet CLI to scaffold your first app, run a top-level-statements Hello World, and understand the edit-build-run loop and the CLR execution model.
deepDiveResources:
  - label: W3Schools C#
    url: https://www.w3schools.com/cs/
    kind: course
  - label: C# Official Docs
    url: https://learn.microsoft.com/dotnet/csharp/
    kind: doc
---

# Getting Started with C# and .NET

## Getting Started with C# and .NET

### Why It Matters

Install the. NET 8 SDK, use the dotnet CLI to scaffold your first app, run a top-level-statements Hello World, and understand the edit-build-run loop and the CLR execution model.

Install the .NET 8 SDK, use the dotnet CLI to scaffold your first app, run a top-level-statements Hello World, and understand the edit-build-run loop and the CLR execution model.

### Prerequisites

- None — this is the entry point for the C# track.
- Basic computer literacy (installing software, using a terminal).

### Topics

- Installing the .NET 8 SDK on Windows/macOS/Linux
- The dotnet CLI: new, build, run, test, publish, restore
- Project templates: console, webapi, classlib, xunit
- Top-level statements (C# 9+) and implicit usings (C# 10+)
- The .csproj SDK-style project file
- The CLR, JIT, and the managed execution model
- Namespaces and using directives, global usings
- Choosing an IDE: Visual Studio 2022, VS Code + C# Dev Kit, Rider

### Key Concepts

- C# compiles to IL (Intermediate Language) in assemblies (.dll/.exe); the CLR JIT-compiles IL to native code at runtime.
- .NET 8 is the current LTS (Nov 2023); .NET 9 (Nov 2024) is STS. Stick to LTS for production.
- Top-level statements let Program.cs be one line; the compiler synthesizes a Program class with a Main method.
- "Managed" means the CLR handles memory, GC, type safety, and exception handling.
- The SDK includes the runtime, compilers (Roslyn), and the dotnet CLI; the runtime alone is redistributable for end-user deployment.

```csharp
// Program.cs — entire file
Console.WriteLine("Hello, World!");
```
Caption: Hello World (top-level statements)

### Common Pitfalls

- Installing only the runtime when you need to build — the SDK includes the runtime plus the dotnet CLI and compilers; the runtime-only bundle cannot compile.
- Calling `dotnet run Program.cs` — `dotnet run` takes no file argument; run it from the project directory and it finds the .csproj automatically.
- Confusing .NET Framework (Windows-only, 4.8, no new features) with .NET (8+) — modern .NET is cross-platform; never start a new project on .NET Framework.
- Forgetting `dotnet restore` after pulling a repo with no `obj/` — SDK-style projects restore implicitly on build, but offline/CI scenarios may need an explicit `dotnet restore`.
- Using an STS release (e.g., .NET 9) in production without a migration plan — STS releases are supported for 18 months; LTS releases (8, future 10) are supported for 3 years.

### Real-World Applications

- Stack Overflow's public Q&A site runs on ASP.NET Core on .NET 8 (migrated from .NET Framework), serving ~900M pageviews/month.
- Unity (the game engine) uses C# as its scripting language; titles like Cuphead, Hollow Knight, and Genshin Impact ship C# scripts to millions of players.
- Accenture runs tens of thousands of internal ASP.NET Core microservices on Azure Kubernetes Service for client engagements.
- Alibaba's Taobao mobile backend uses .NET on Linux for select high-throughput services alongside Java and Go.

### Interview Questions

- 1. What is the CLR and how does it differ from the .NET SDK? — The CLR is the runtime (JIT, GC, type loader); the SDK adds the Roslyn compilers, dotnet CLI, and templates needed to develop.
- 2. What is IL and when is it compiled to native code? — IL (Intermediate Language) is the bytecode stored in assemblies; the CLR JIT-compiles each method to native code on first call.
- 3. What are top-level statements and which C# version introduced them? — C# 9 (2020) lets a Program.cs consist of statements directly; the compiler synthesizes a Program.Main.
- 4. What is the difference between .NET and .NET Framework? — .NET (5+) is cross-platform, open-source, yearly-released; .NET Framework is Windows-only and 4.8 is the last version.
- 5. Why might you choose .NET 8 over .NET 9 for a new service? — .NET 8 is LTS with 3-year support; .NET 9 is STS with 18-month support, so 8 is safer for long-lived production workloads.

### Mini Project

Build a Greeting Generator CLI: A console app that takes a name from argv (or `--name Alice`), prints a personalized greeting with a timestamp, and falls back to "World" when no arg is given. Suggested approach:
  - `dotnet new console -n GreetApp` and open the folder
  - Use `args` (available in top-level statements) and a simple `--name Alice` parser
  - Stamp the output with `DateTimeOffset.Now` and an ISO-8601 format
  - Print with an interpolated string `$"Hello, {name}! [{ts}]"`
  - Document `dotnet run -- --name Alice` in a README

### Exercises

1. Install the .NET 8 SDK and confirm with `dotnet --version` and `dotnet --list-runtimes`.
2. Create a console app, change Program.cs to print your name, and run it with `dotnet run`.
3. Inspect the generated assembly with `ilspycmd bin/Debug/net8.0/GreetApp.dll` (install via `dotnet tool install -g ilspycmd`) and find the synthesized Main.
4. Add an `args` check that prints a usage hint and returns non-zero when no args are passed.
5. Publish a self-contained single-file binary with `dotnet publish -c Release -r linux-x64 --self-contained true /p:PublishSingleFile=true` and run it on a clean directory.
6. >>> QUIZ (Stage 1) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Who is the principal designer of C#?
9. A) Anders Hejlsberg (*)
10. B) James Gosling
11. C) Bjarne Stroustrup
12. D) Guido van Rossum
13. Explanation: Anders Hejlsberg led C# design at Microsoft; he previously designed Turbo Pascal and Delphi at Borland.
14. Q2: What does `dotnet new console -n HelloApp` create?
15. A) A NuGet package named HelloApp
16. B) A new console project folder with .csproj and Program.cs (*)
17. C) A Docker image tagged HelloApp
18. D) A solution file only
19. Explanation: `dotnet new console -n HelloApp` scaffolds a HelloApp/ directory containing HelloApp.csproj and Program.cs using the console template.
20. Q3: Which C# version introduced top-level statements?
21. A) C# 7
22. B) C# 8
23. C) C# 9 (*)
24. D) C# 12
25. Explanation: Top-level statements shipped in C# 9 with .NET 5 (2020); the compiler synthesizes a Program class with a Main method.
26. Q4: What does the CLR JIT do?
27. A) Compiles .cs files to .dll files
28. B) Packages assemblies into NuGet
29. C) Generates XML documentation
30. D) Compiles IL to native machine code at runtime (*)
31. Explanation: The JIT (Just-In-Time) compiler translates IL bytecode into native CPU instructions on first execution of each method.
32. Q5: Which is the current LTS .NET release as of 2024?
33. A) .NET 8 (*)
34. B) .NET Framework 4.8
35. C) .NET 6
36. D) .NET 9
37. Explanation: .NET 8 (Nov 2023) is LTS with 3-year support; .NET 9 (Nov 2024) is STS with 18-month support.
38. Q6: What is IL?
39. A) A native executable format
40. B) Intermediate Language bytecode stored in assemblies (*)
41. C) An interface language for COM
42. D) The installer log format
43. Explanation: IL (Intermediate Language, also MSIL/CIL) is the CPU-agnostic bytecode the C# compiler emits and the CLR JIT consumes.
44. Q7: Which command runs a console project from its directory?
45. A) dotnet exec
46. B) dotnet start
47. C) dotnet run (*)
48. D) dotnet launch Program.cs
49. Explanation: `dotnet run` restores, builds, and executes the project in the current directory; it takes no source-file argument.
50. Q8: What's the difference between the SDK and the Runtime?
51. A) They are identical
52. B) The runtime includes the SDK
53. C) The SDK is for Java, the runtime for C#
54. D) The SDK includes the runtime plus compilers and CLI for development (*)
55. Explanation: The SDK contains the runtime, the Roslyn compilers, the dotnet CLI, and templates; the runtime-only bundle cannot compile.
56. Q9: Which file is the project file in an SDK-style .NET app?
57. A) *.csproj (*)
58. B) project.json
59. C) packages.config
60. D) Makefile
61. Explanation: SDK-style projects use a .csproj XML file (e.g., HelloApp.csproj) referencing a project SDK like Microsoft.NET.Sdk.
62. Q10: Implicit usings (C# 10+) automatically import which set for a console app?
63. A) System.Windows.Forms only
64. B) System, System.Linq, System.Console, and other common namespaces (*)
65. C) No namespaces; you must import System manually
66. D) All NuGet packages on the machine
67. Explanation: Implicit usings add a hidden GlobalUsings.g.cs with System, System.Collections.Generic, System.IO, System.Linq, System.Net.Http, System.Threading, System.Threading.Tasks, etc.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Who is the principal designer of C#?
  options:
    - Anders Hejlsberg
    - James Gosling
    - Bjarne Stroustrup
    - Guido van Rossum
  correctIndex: 0
  explanation: Anders Hejlsberg led C# design at Microsoft; he previously designed Turbo Pascal and Delphi at Borland.
- id: q2
  question: What does `dotnet new console -n HelloApp` create?
  options:
    - A NuGet package named HelloApp
    - A new console project folder with .csproj and Program.cs
    - A Docker image tagged HelloApp
    - A solution file only
  correctIndex: 1
  explanation: "`dotnet new console -n HelloApp` scaffolds a HelloApp/ directory containing HelloApp.csproj and Program.cs using the console template."
- id: q3
  question: Which C# version introduced top-level statements?
  options:
    - C# 7
    - C# 8
    - C# 9
    - C# 12
  correctIndex: 2
  explanation: Top-level statements shipped in C# 9 with .NET 5 (2020); the compiler synthesizes a Program class with a Main method.
- id: q4
  question: What does the CLR JIT do?
  options:
    - Compiles .cs files to .dll files
    - Packages assemblies into NuGet
    - Generates XML documentation
    - Compiles IL to native machine code at runtime
  correctIndex: 3
  explanation: The JIT (Just-In-Time) compiler translates IL bytecode into native CPU instructions on first execution of each method.
- id: q5
  question: Which is the current LTS .NET release as of 2024?
  options:
    - .NET 8
    - .NET Framework 4.8
    - .NET 6
    - .NET 9
  correctIndex: 0
  explanation: .NET 8 (Nov 2023) is LTS with 3-year support; .NET 9 (Nov 2024) is STS with 18-month support.
- id: q6
  question: What is IL?
  options:
    - A native executable format
    - Intermediate Language bytecode stored in assemblies
    - An interface language for COM
    - The installer log format
    - is the CPU-agnostic bytecode the C# compiler emits and the CLR JIT consumes.
  correctIndex: 1
  explanation: IL (Intermediate Language, also MSIL/CIL) is the CPU-agnostic bytecode the C# compiler emits and the CLR JIT consumes.
- id: q7
  question: Which command runs a console project from its directory?
  options:
    - dotnet exec
    - dotnet start
    - dotnet run
    - dotnet launch Program.cs
  correctIndex: 2
  explanation: "`dotnet run` restores, builds, and executes the project in the current directory; it takes no source-file argument."
- id: q8
  question: What's the difference between the SDK and the Runtime?
  options:
    - They are identical
    - The runtime includes the SDK
    - The SDK is for Java, the runtime for C#
    - The SDK includes the runtime plus compilers and CLI for development
  correctIndex: 3
  explanation: The SDK contains the runtime, the Roslyn compilers, the dotnet CLI, and templates; the runtime-only bundle cannot compile.
- id: q9
  question: Which file is the project file in an SDK-style .NET app?
  options:
    - "*.csproj"
    - project.json
    - packages.config
    - Makefile
  correctIndex: 0
  explanation: SDK-style projects use a .csproj XML file (e.g., HelloApp.csproj) referencing a project SDK like Microsoft.NET.Sdk.
- id: q10
  question: Implicit usings (C# 10+) automatically import which set for a console app?
  options:
    - System.Windows.Forms only
    - System, System.Linq, System.Console, and other common namespaces
    - No namespaces; you must import System manually
    - All NuGet packages on the machine
  correctIndex: 1
  explanation: Implicit usings add a hidden GlobalUsings.g.cs with System, System.Collections.Generic, System.IO, System.Linq, System.Net.Http, System.Threading, System.Threading.Tasks, etc.
```

