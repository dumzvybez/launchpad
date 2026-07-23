# Launchpad Content Source Directory (v6.0 Foundation)

This directory is the **future source-of-truth** for Launchpad's lesson content.

## Current status: FOUNDATION ONLY

As of v6.0, this directory is **scaffolded but not yet populated**. Lesson
content still lives in `src/lib/lessons-content.ts` + `src/lib/lessons-extended.ts`
(the existing 10.6 MB TypeScript bundle). The migration to Markdown-in-`content/`
is a **future phase** (see "Next steps" below).

This directory exists so that:
1. The content-compiler pipeline (`scripts/compile-content.ts`) has a target.
2. Content authors can begin migrating tracks one at a time without waiting
   for a big-bang rewrite.
3. The `src/lib/content-loader.ts` abstraction is ready to swap from in-memory
   lessons to lazy-fetched JSON without changing call sites.

## Target structure

```
content/
  _track-meta/
    python.yaml          # track-level metadata (name, icon, prereqs, version)
    javascript.yaml
    ...
  python/
    getting-started-with-python.md      # filename = lesson slug
    variables-and-data-types.md
    strings-string-methods.md
    ...
  javascript/
    ...
```

Each lesson Markdown file has YAML frontmatter:

```yaml
---
slug: python-variables-and-data-types   # STABLE identity (Phase 1)
track: python
order: 2                                 # display order only (NOT identity)
title: Variables and Data Types
difficulty: beginner
estMinutes: 70
group: Python Basics
learningObjectives:                      # Phase 8 (optional)
  - Declare and initialize variables
  - Understand Python's dynamic typing
skillsTaught:                            # Phase 8 (optional)
  - skillId: python.variables.declaration
    level: intro
aiContext:                               # Phase 9 (optional)
  summary: "Variables are named storage. Python is dynamically typed..."
  keyTakeaways:
    - "Variables don't need type declarations"
    - "type() tells you the current type"
---

# Variables and Data Types

Lesson body in Markdown. Code blocks, callouts, exercises, etc.
```

## Content compiler (future)

`scripts/compile-content.ts` (stub) will:
1. Read each `content/{track}/*.md` file.
2. Parse frontmatter + body.
3. Extract `blocks[]` from Markdown structure (headings, code fences, etc.).
4. Emit `public/content/{track}.json` (~470 KB per track, lazy-fetched).
5. Update `src/lib/lessons-meta-generated.ts` (slug maps, counts).

The client `content-loader.ts` will lazy-fetch `public/content/{track}.json`
on first track open, replacing the current 10.6 MB eager bundle.

## Next steps (out of scope for v6.0)

1. Migrate one pilot track (e.g. Python) from TS to Markdown here.
2. Implement `compile-content.ts` end-to-end.
3. Switch `content-loader.ts` from in-memory to fetch for the pilot track.
4. Migrate remaining tracks incrementally.
5. Remove `lessons-content.ts` once all tracks are migrated.

## Why not do this in v6.0?

The v6.0 release focuses on **identity stability** (slugs), **data migration
safety**, and **generated metadata** — the prerequisites that make a future
content move safe. Moving the 10.6 MB content bundle to Markdown in the same
release would multiply risk without first establishing that lesson
reorganization won't orphan user progress. The slug migration (Phase 1) must
land and prove stable first.
