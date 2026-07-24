# Launchpad Content Source Directory

This directory is the **source-of-truth** for Launchpad's lesson content.

## Current status: FULLY POPULATED

As of v6.002, all 797 lessons across 38 tracks are authored as Markdown files
here in `content/{track}/*.md`. The legacy TypeScript bundles
(`src/lib/lessons-content.ts` and `src/lib/lessons-extended.ts`) were removed
in v6.006 — the Markdown source is now the only content source.

## Directory structure

```
content/
  python/
    python-getting-started-python.md      # filename = lesson slug
    python-variables-data-types.md
    python-strings-string-methods.md
    ...
    python-capstone-project.md
  javascript/
    ...
  README.md                               # this file
```

Each track has its own subdirectory containing 20–21 lesson Markdown files.
A `README.md` file (like this one) may also appear at the track level.

## Lesson Markdown format

Each lesson Markdown file has YAML frontmatter:

```yaml
---
slug: python-variables-data-types         # STABLE identity (v6.0+)
id: python-02                              # legacy positional id (still used in-memory)
track: python
order: 2                                   # display order only (NOT identity)
title: Variables and Data Types
description: Learn how Python variables work...
difficulty: beginner
estMinutes: 90
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=...
whyItMatters: Learn how Python variables work...
deepDiveResources:
  - label: W3Schools Python
    url: https://www.w3schools.com/python/
    kind: course
---

# Variables and Data Types

## Variables and Data Types

### Why It Matters
...

### Prerequisites
...

### Topics
...

### Key Concepts
...

### Common Pitfalls
...

### Real-World Applications
...

### Interview Questions
...

### Mini Project
...

### Exercises
...

```quiz
id: q1
question: "What does `x = 5` do in Python?"
options:
  - "Binds the name x to an int object with value 5"
  - "Creates a box named x and puts 5 in it"
  - "Allocates memory of fixed size for x"
  - "Declares x as a static int variable"
correctIndex: 0
explanation: "Python variables are name tags on objects..."
```
```

## Content pipeline

### Compile (Markdown → JSON)

`scripts/compile-content.ts` (run via `bun run compile:content`):
1. Reads each `content/{track}/*.md` file.
2. Parses frontmatter + body into `Lesson` objects with `LessonBlock[]` and `QuizQuestion[]`.
3. Emits `public/content/{track}.json` (~200–470 KB per track, lazy-fetched at runtime).

### Metadata generation (Markdown → TypeScript metadata)

`scripts/gen-lesson-meta.ts` (run via `bun run gen:meta`):
1. Reads each `content/{track}/*.md` file's frontmatter.
2. Extracts `{id, track, title, order, slug}` for every lesson.
3. Emits `src/lib/lessons-meta-generated.ts` with slug maps, track counts, and track slug lists.

Both scripts run automatically before `next build` via the `prebuild` script.

## Forward-looking fields (optional, not yet populated)

The following frontmatter fields are defined in the `Lesson` type but not yet
populated on existing lessons. Content authors may add them to opt into future
features without breaking existing content:

- `learningObjectives` — structured Bloom-aligned objectives (v6.0)
- `skillsTaught` — skill references with depth level (v6.0)
- `aiContext` — per-lesson AI context bundle (v6.0)
- `moduleId` — canonical module reference (v6.004)
- `capstoneTier` — capstone tier (v6.004)
- `assessmentLevel` — assessment level (v6.004)
- `practiceChallenges` — structured practice challenges (v6.005)
- `interactiveExamples` — structured interactive code examples (v6.005)
