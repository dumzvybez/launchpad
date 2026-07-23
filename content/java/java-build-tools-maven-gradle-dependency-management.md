---
slug: java-build-tools-maven-gradle-dependency-management
id: java-18
track: java
order: 18
title: Build Tools — Maven, Gradle, and Dependency Management
description: Build, package, and dependency-manage Java projects with Maven and Gradle, understand transitive resolution, scopes, multi-module projects, and the modern Gradle Kotlin DSL.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=A74TOX803D0&t=20400s
whyItMatters: Build, package, and dependency-manage Java projects with Maven and Gradle, understand transitive resolution, scopes, multi-module projects, and the modern Gradle Kotlin DSL.
deepDiveResources:
  - label: W3Schools Java
    url: https://www.w3schools.com/java/
    kind: course
  - label: Java Official Docs
    url: https://docs.oracle.com/en/java/
    kind: doc
---

# Build Tools — Maven, Gradle, and Dependency Management

## Build Tools — Maven, Gradle, and Dependency Management

### Why It Matters

Build, package, and dependency-manage Java projects with Maven and Gradle, understand transitive resolution, scopes, multi-module projects, and the modern Gradle Kotlin DSL.

Build, package, and dependency-manage Java projects with Maven and Gradle, understand transitive resolution, scopes, multi-module projects, and the modern Gradle Kotlin DSL.

### Prerequisites

- Stage 17: JVM Internals — Memory Model, GC, Classloading.
- Comfort with the command line and JVM tooling.

### Topics

- Maven: pom.xml, lifecycle phases, plugins, repositories
- Maven dependency scopes (compile, test, provided, runtime)
- Gradle: build.gradle (Groovy) and build.gradle.kts (Kotlin DSL)
- Gradle tasks, configurations, and the build cache
- Transitive dependency resolution and conflict resolution strategies
- Multi-module projects and the aggregator pattern
- Publishing artifacts to Maven Central / internal repositories
- BOM (Bill of Materials) and dependency locking

### Key Concepts

- Maven is declarative and convention-over-configuration; its lifecycle (clean, validate, compile, test, package, verify, install, deploy) drives everything.
- Gradle is more flexible (a Groovy/Kotlin DSL) with incremental builds and a build cache that can cut CI times dramatically.
- Transitive dependencies are resolved via nearest-wins (Maven) or configurable conflict resolution (Gradle).
- A BOM (pom with `<dependencyManagement>`) imports a curated version set; consumers avoid version mismatches across related libraries.
- Dependency locking (Maven `mvn dependency:lock`, Gradle `dependencyLocking`) produces reproducible builds from a lockfile.

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>app</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>

  <properties>
    <maven.compiler.release>17</maven.compiler.release>
    <junit.version>5.10.2</junit.version>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>${junit.version}</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.2.5</version>
      </plugin>
    </plugins>
  </build>
</project>
```
Caption: Maven pom.xml

### Common Pitfalls

- Pinning different versions of the same transitive dependency across modules — classpath hell; use a BOM or dependency locking to keep them consistent.
- Forgetting `<scope>provided</scope>` for servlet APIs in WAR builds — the container provides them at runtime; bundling them causes conflicts.
- Using `compile` (deprecated) instead of `implementation` in Gradle — `implementation` hides internals from consumers; `api` is the modern replacement for the old `compile`.
- Letting snapshot versions leak into releases — `-SNAPSHOT` dependencies can change at any time and break reproducibility; lock or release-pin.
- Skipping the build cache and incremental compilation — Gradle's build cache can cut CI time by 50%+; Maven's `mvn -T 4` parallelizes but does not cache.

### Real-World Applications

- Spring Boot's parent POM and spring-boot-dependencies BOM pin hundreds of library versions to known-good combinations — adopting the BOM eliminates version mismatches.
- Apache projects (Kafka, Spark, Hadoop) are built with Gradle or Maven and ship multi-module projects with strict dependency management.
- Netflix's Nebula plugin extends Gradle with release and dependency-locking features used across hundreds of internal services.
- LinkedIn's internal Gradle plugins enforce dependency allow-lists and license checks at build time across thousands of repos.

### Interview Questions

- 1. What is the Maven lifecycle and its main phases? — clean, validate, compile, test, package, verify, install, deploy; each phase runs plugin goals.
- 2. Maven dependency scopes — what does `provided` mean? — The dependency is on the compile classpath but not packaged; the runtime environment (e.g., servlet container) provides it.
- 3. What is the difference between Gradle's `implementation` and `api`? — `implementation` is not exposed to consumers' compile classpath; `api` is (the old `compile`).
- 4. What is a BOM and why use it? — A POM with `<dependencyManagement>` that pins versions of related libraries; importing it via `<type>pom</type>` `<scope>import</scope>` keeps versions consistent.
- 5. How does Maven resolve version conflicts in transitive dependencies? — Nearest-wins: the version closest in the dependency tree to the root is chosen; Gradle is similar but configurable.

### Mini Project

Build a Multi-Module Maven Project: A parent POM with two modules — `core` (a library) and `cli` (an executable that depends on `core`). Add JUnit 5 tests in each. Suggested approach:
  - Create a parent pom.xml with `<packaging>pom</packaging>` and `<modules><module>core</module><module>cli</module></modules>`
  - In the parent, set `maven.compiler.release=17` and define junit-bom in `<dependencyManagement>`
  - In `core`, define a small `Calculator` class with tests
  - In `cli`, depend on `core` with `<version>${project.version}</version>` and provide a main class
  - Build with `mvn clean install` and run the cli with `java -jar cli/target/cli-1.0.0.jar`

### Exercises

1. Convert a single-module Maven project to use a spring-boot-dependencies BOM; observe that versions become optional in your dependencies.
2. Run `mvn dependency:tree` on a Spring Boot starter; identify at least three transitive dependencies you didn't directly declare.
3. In a Gradle project, introduce a transitive conflict (e.g., Guava 31 and 33 from two deps); resolve it with `resolutionStrategy.force`.
4. Enable the Gradle build cache (`org.gradle.caching=true`) and rerun a clean build; observe task outputs being fetched from cache.
5. Use `mvn versions:display-dependency-updates` to find outdated dependencies in a real project; update one and verify tests still pass.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Maven's default configuration file is?
9. A) build.gradle
10. B) pom.xml (*)
11. C) settings.xml
12. D) project.json
13. Explanation: Maven uses pom.xml (Project Object Model). settings.xml is for user/global settings; build.gradle is Gradle's.
14. Q2: Maven dependency scope `provided` means?
15. A) The dependency is available at runtime only
16. B) Only used during test
17. C) On the compile classpath but not packaged; the runtime environment supplies it (*)
18. D) Bundled into the final JAR
19. Explanation: `provided` (e.g., servlet-api in a WAR) is on compile/test classpaths but not packaged — the container provides its own copy at runtime.
20. Q3: Gradle's `implementation` configuration differs from `api` in that?
21. A) `implementation` is exposed to consumer compile classpath
22. B) `implementation` is deprecated
23. C) They are identical
24. D) `implementation` is NOT exposed to consumer compile classpath (*)
25. Explanation: `implementation` dependencies leak only at runtime to consumers; `api` dependencies are exposed on the consumer's compile classpath. `implementation` improves build incrementalism.
26. Q4: A BOM (Bill of Materials) is imported as?
27. A) A `pom` with `<scope>import</scope>` inside `<dependencyManagement>` (*)
28. B) A regular dependency with `<scope>compile</scope>`
29. C) A plugin
30. D) A test dependency
31. Explanation: Importing a BOM via `<type>pom</type>` and `<scope>import</scope>` pulls in its `<dependencyManagement>` entries, letting you omit versions in your dependencies.
32. Q5: Maven resolves version conflicts in transitive dependencies by?
33. A) Always taking the highest version
34. B) Nearest-wins (the version closest to the root in the dependency tree) (*)
35. C) Always taking the lowest version
36. D) Random selection
37. Explanation: Maven's nearest-wins picks the version closest to the project root in the dependency tree; ties are resolved by order of declaration.
38. Q6: Which Gradle setting enables the build cache?
39. A) `org.gradle.parallel=true`
40. B) `gradle.cache.enabled=true`
41. C) `org.gradle.caching=true` (*)
42. D) `--cache` flag on every task
43. Explanation: `org.gradle.caching=true` in gradle.properties enables task-output caching, allowing CI to reuse outputs from prior builds and cut times dramatically.
44. Q7: The Maven lifecycle phase that produces the packaged artifact is?
45. A) compile
46. B) test
47. C) install
48. D) package (*)
49. Explanation: `package` compiles, tests, and packages into jar/war. `install` pushes the package to the local ~/.m2; `deploy` pushes to a remote repo.
50. Q8: Spring Boot's curated version set is published as?
51. A) A BOM (spring-boot-dependencies) (*)
52. B) A single JAR
53. C) A plugin
54. D) An environment variable
55. Explanation: spring-boot-dependencies is a BOM with hundreds of pinned versions; importing it into your `<dependencyManagement>` keeps your transitive versions aligned with Spring Boot's tested set.
56. Q9: SNAPSHOT versions in Maven are?
57. A) Immutable final releases
58. B) Mutable and may be updated by remote redeploys (*)
59. C) Always binary-incompatible
60. D) Forbidden in repositories
61. Explanation: -SNAPSHOT versions are mutable: Maven periodically checks the remote repo for updated artifacts. They enable iterative development but break reproducibility if used in releases.
62. Q10: Multi-module Maven projects use?
63. A) A single pom.xml with all modules inline
64. B) Gradle subprojects only
65. C) A parent pom with `<packaging>pom</packaging>` and `<modules>` listing submodules (*)
66. D) BOMs only
67. Explanation: A parent pom with `<packaging>pom</packaging>` and `<modules><module>...</module></modules>` aggregates submodules; each submodule has its own pom.xml with `<parent>` pointing up.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Maven's default configuration file is?
  options:
    - build.gradle
    - pom.xml
    - settings.xml
    - project.json
  correctIndex: 1
  explanation: Maven uses pom.xml (Project Object Model). settings.xml is for user/global settings; build.gradle is Gradle's.
- id: q2
  question: Maven dependency scope `provided` means?
  options:
    - The dependency is available at runtime only
    - Only used during test
    - On the compile classpath but not packaged; the runtime environment supplies it
    - Bundled into the final JAR
    - is on compile/test classpaths but not packaged — the container provides its own copy at runtime.
  correctIndex: 2
  explanation: "`provided` (e.g., servlet-api in a WAR) is on compile/test classpaths but not packaged — the container provides its own copy at runtime."
- id: q3
  question: Gradle's `implementation` configuration differs from `api` in that?
  options:
    - "`implementation` is exposed to consumer compile classpath"
    - "`implementation` is deprecated"
    - They are identical
    - "`implementation` is NOT exposed to consumer compile classpath"
  correctIndex: 3
  explanation: "`implementation` dependencies leak only at runtime to consumers; `api` dependencies are exposed on the consumer's compile classpath. `implementation` improves build incrementalism."
- id: q4
  question: A BOM (Bill of Materials) is imported as?
  options:
    - A `pom` with `<scope>import</scope>` inside `<dependencyManagement>`
    - A regular dependency with `<scope>compile</scope>`
    - A plugin
    - A test dependency
  correctIndex: 0
  explanation: Importing a BOM via `<type>pom</type>` and `<scope>import</scope>` pulls in its `<dependencyManagement>` entries, letting you omit versions in your dependencies.
- id: q5
  question: Maven resolves version conflicts in transitive dependencies by?
  options:
    - Always taking the highest version
    - Nearest-wins (the version closest to the root in the dependency tree)
    - Always taking the lowest version
    - Random selection
  correctIndex: 1
  explanation: Maven's nearest-wins picks the version closest to the project root in the dependency tree; ties are resolved by order of declaration.
- id: q6
  question: Which Gradle setting enables the build cache?
  options:
    - "`org.gradle.parallel=true`"
    - "`gradle.cache.enabled=true`"
    - "`org.gradle.caching=true`"
    - "`--cache` flag on every task"
  correctIndex: 2
  explanation: "`org.gradle.caching=true` in gradle.properties enables task-output caching, allowing CI to reuse outputs from prior builds and cut times dramatically."
- id: q7
  question: The Maven lifecycle phase that produces the packaged artifact is?
  options:
    - compile
    - test
    - install
    - package
  correctIndex: 3
  explanation: "`package` compiles, tests, and packages into jar/war. `install` pushes the package to the local ~/.m2; `deploy` pushes to a remote repo."
- id: q8
  question: Spring Boot's curated version set is published as?
  options:
    - A BOM (spring-boot-dependencies)
    - A single JAR
    - A plugin
    - An environment variable
  correctIndex: 0
  explanation: spring-boot-dependencies is a BOM with hundreds of pinned versions; importing it into your `<dependencyManagement>` keeps your transitive versions aligned with Spring Boot's tested set.
- id: q9
  question: SNAPSHOT versions in Maven are?
  options:
    - Immutable final releases
    - Mutable and may be updated by remote redeploys
    - Always binary-incompatible
    - Forbidden in repositories
  correctIndex: 1
  explanation: "-SNAPSHOT versions are mutable: Maven periodically checks the remote repo for updated artifacts. They enable iterative development but break reproducibility if used in releases."
- id: q10
  question: Multi-module Maven projects use?
  options:
    - A single pom.xml with all modules inline
    - Gradle subprojects only
    - A parent pom with `<packaging>pom</packaging>` and `<modules>` listing submodules
    - BOMs only
  correctIndex: 2
  explanation: A parent pom with `<packaging>pom</packaging>` and `<modules><module>...</module></modules>` aggregates submodules; each submodule has its own pom.xml with `<parent>` pointing up.
```

