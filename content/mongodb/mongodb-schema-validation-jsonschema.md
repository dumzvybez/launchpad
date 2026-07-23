---
slug: mongodb-schema-validation-jsonschema
id: mongodb-18
track: mongodb
order: 18
title: Schema Validation with $jsonSchema
description: Enforce document shape at write time with `$jsonSchema` validators, choose `strict` vs `moderate` enforcement, and migrate schemas safely.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=c2M-rlkkT5o&t=1260s
whyItMatters: Enforce document shape at write time with `$jsonSchema` validators, choose `strict` vs `moderate` enforcement, and migrate schemas safely.
deepDiveResources:
  - label: W3Schools MongoDB
    url: https://www.w3schools.com/mongodb/
    kind: course
  - label: MongoDB Official Docs
    url: https://www.mongodb.com/docs/
    kind: doc
---

# Schema Validation with $jsonSchema

## Schema Validation with $jsonSchema

### Why It Matters

Enforce document shape at write time with `$jsonSchema` validators, choose `strict` vs `moderate` enforcement, and migrate schemas safely.

Enforce document shape at write time with `$jsonSchema` validators, choose `strict` vs `moderate` enforcement, and migrate schemas safely.

### Prerequisites

- Stage 2 (Documents, Collections, BSON) and Stage 9 (Schema Design).
- JSON Schema basics (draft-07 used by MongoDB).

### Topics

- `validator` and `validationLevel` (`off`, `moderate`, `strict`)
- `validationAction` (`error` or `warn`)
- `$jsonSchema` keyword set: `bsonType`, `required`, `properties`, `enum`, `pattern`, `minimum`/`maximum`
- Conditional rules with `$or`, `$and`, `if`/`then`/`else` operator form
- `collMod` to add/update validators on existing collections
- Migrating an existing collection to validation (use `warn` first)
- `$jsonSchema` vs the legacy operator-form validator

### Key Concepts

- Schema validation runs at WRITE time on the primary; it rejects (or warns) documents that don't match.
- `validationLevel: "strict"` validates all writes; `"moderate"` validates inserts and updates that already-valid documents; `"off"` disables validation.
- `validationAction: "error"` rejects invalid writes (default); `"warn"` logs them but allows them — useful for migration.
- `$jsonSchema` follows JSON Schema draft-07 with BSON extensions (`bsonType` accepts `"int"`, `"long"`, `"objectId"`, `"date"`, `"decimal"`, etc.).
- Validators do NOT validate deletes and do NOT migrate existing data; if you add a validator to an existing collection, pre-existing invalid docs stay until updated.

```javascript
db.createCollection("users", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: [ "name", "email", "createdAt" ],
    properties: {
      name:      { bsonType: "string", maxLength: 100 },
      email:     { bsonType: "string", pattern: "^[^@]+@[^@]+\\.[^@]+$" },
      age:       { bsonType: "int", minimum: 0, maximum: 150 },
      role:      { enum: [ "admin", "user", "guest" ] },
      addresses: {
        bsonType: "array",
        items: {
          bsonType: "object",
          required: [ "city", "zip" ],
          properties: {
            city: { bsonType: "string" },
            zip:  { bsonType: "string", pattern: "^[0-9]{5}(-[0-9]{4})?$" }
          }
        }
      },
      createdAt: { bsonType: "date" }
    },
    additionalProperties: false
  }},
  validationLevel: "strict",
  validationAction: "error"
})
```
Caption: Create collection with $jsonSchema

### Common Pitfalls

- Switching an existing collection from no validator straight to `strict` + `error` — existing bad docs can't be updated without fixing them first; use `warn` to discover them.
- Using `"moderate"` and expecting it to validate updates to invalid docs — moderate only validates updates to ALREADY-VALID docs; existing invalid docs stay invalid (by design).
- Writing `$jsonSchema` with `type: "integer"` (JSON Schema form) instead of `bsonType: "int"` — use `bsonType` to distinguish MongoDB's int/long/double/decimal.
- Forgetting that validation does NOT run on deletes — invalid docs that exist before adding a validator can still be deleted (which is usually fine, but surprising).
- Tightening validation then breaking the app silently — always roll out validators in `warn` mode first, monitor the log, fix the data, then switch to `error`.

### Real-World Applications

- Stripe uses $jsonSchema to enforce required fields and money-format constraints on payment-intent documents at write time.
- eBay uses validators to enforce listing-shape invariants per category (e.g., "if category=cars, require VIN and mileage").
- Adobe uses validators to enforce per-tenant document shapes so a buggy service can't corrupt another tenant's data.
- Coinbase uses `enum` and `bsonType` constraints to prevent ledger entries with invalid status or amount types.

### Interview Questions

- 1. What's the difference between `validationLevel` `strict` and `moderate`? — `strict` validates all writes; `moderate` validates inserts + updates to already-valid docs (skips invalid existing docs).
- 2. What does `validationAction: "warn"` do? — Logs the violation but allows the write — useful for safely rolling out validation on existing collections.
- 3. What's the difference between `type` and `bsonType` in `$jsonSchema`? — `type` is JSON Schema (string/number/integer); `bsonType` is MongoDB-specific (int/long/double/decimal/objectId/date/binData).
- 4. Can validation prevent updates to pre-existing invalid documents? — No; with `moderate`, updates to invalid existing docs are NOT validated (by design) — fix or migrate them first.
- 5. How do you add validation to an existing collection? — Use `collMod` with `validator`, ideally starting in `warn` mode to discover and fix existing bad docs before switching to `error`.

### Mini Project

Add Strict Validation to an Existing `users` Collection: Take a `users` collection with mixed data, design a `$jsonSchema` validator (required fields, email pattern, role enum, address subdoc), roll it out in `warn` mode, fix existing bad docs, then switch to `strict` + `error`. Suggested approach:
  - Inspect existing docs with `find().limit(20)` and a `$type` audit pipeline
  - Draft a `$jsonSchema` covering `name`, `email` (pattern), `age` (int 0-150), `role` (enum), `addresses` (array of subdocs)
  - Apply via `collMod` with `validationLevel: "moderate", validationAction: "warn"`
  - Run writes and grep the mongod log for DocumentValidationError; fix the offending docs
  - Switch to `validationLevel: "strict", validationAction: "error"` and verify a bad insert is rejected

### Exercises

1. Create a new collection with a `$jsonSchema` validator requiring `email` (pattern) and `age` (int 0-150); insert a valid and an invalid doc.
2. Add a validator to an existing collection in `warn` mode; insert a bad doc and confirm it's allowed but logged.
3. Use the operator form (`$or`) to require `permissions` array when `role` is "admin".
4. Migrate an existing collection: `warn` -> inspect log -> fix docs -> `strict` + `error`.
5. >>> QUIZ (Stage 18) <<<
6. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
7. Q1: Which `validationLevel` validates ALL writes (including to pre-existing docs)?
8. A) off
9. B) strict (*)
10. C) moderate
11. D) warn
12. Explanation: `strict` validates every insert and update; `moderate` skips updates to already-invalid existing docs (so you don't get stuck); `off` disables validation.
13. Q2: What does `validationAction: "warn"` do?
14. A) Rejects the write
15. B) Disables validation
16. C) Logs the violation but allows the write (*)
17. D) Drops the bad document
18. Explanation: `warn` lets the write through and logs a DocumentValidationError — ideal for safely rolling out validation on existing collections before enforcing `error`.
19. Q3: Which keyword specifies MongoDB-specific BSON types in `$jsonSchema`?
20. A) type
21. B) mongoType
22. C) kind
23. D) bsonType (*)
24. Explanation: `bsonType` accepts MongoDB-specific types like "int", "long", "double", "decimal", "objectId", "date", "binData"; `type` is JSON Schema's plain types.
25. Q4: Can validation prevent deletion of an invalid document?
26. A) No — validation runs on inserts/updates/replacements only, not deletes (*)
27. B) Yes
28. C) Only with strict mode
29. D) Only with a trigger
30. Explanation: Validation runs on writes that create/modify documents; deletes are not validated. Invalid docs that pre-date the validator can still be deleted.
31. Q5: How do you apply a validator to an EXISTING collection?
32. A) Recreate the collection
33. B) Use `collMod` with `validator` (*)
34. C) Use `createIndex`
35. D) You can't
36. Explanation: `db.runCommand({ collMod: "users", validator: {...}, validationLevel: "...", validationAction: "..." })` adds or updates a validator on an existing collection.
37. Q6: What's the recommended rollout strategy for adding validation to existing data?
38. A) Switch directly to strict + error
39. B) Drop the collection
40. C) Start with warn + moderate, find/fix bad docs, then switch to strict + error (*)
41. D) Disable writes during rollout
42. Explanation: Start in `warn` mode to discover pre-existing bad docs without breaking the app; fix them; then switch to `strict` + `error` to enforce.
43. Q7: Which JSON Schema keyword constrains a string field to a regex?
44. A) format
45. B) regex
46. C) match
47. D) pattern (*)
48. Explanation: `pattern: "^[^@]+@[^@]+\\.[^@]+$"` constrains the string to match a regex — useful for email/zip/phone format enforcement.
49. Q8: What's the difference between `additionalProperties: false` and `required: [...]`?
50. A) `additionalProperties: false` rejects fields not in `properties`; `required` mandates presence of named fields (*)
51. B) They're synonyms
52. C) `additionalProperties` only works in strict mode
53. D) `required` is for arrays
54. Explanation: `required` lists fields that must be present; `additionalProperties: false` forbids any field not declared in `properties` — together they lock the document shape.
55. Q9: What does `moderate` validation do for an update to an already-invalid doc?
56. A) Rejects it
57. B) Skips validation (lets the update through) (*)
58. C) Logs and rejects
59. D) Auto-fixes the doc
60. Explanation: `moderate` validates updates to ALREADY-VALID docs only — updates to invalid existing docs are not validated, so you can fix them in stages without getting stuck.
61. Q10: Which keyword enforces a value from a fixed list?
62. A) values
63. B) oneOf
64. C) enum (*)
65. D) allowed
66. Explanation: `enum: [ "admin", "user", "guest" ]` constrains the field to one of the listed values — useful for status fields and roles.
67. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which `validationLevel` validates ALL writes (including to pre-existing docs)?
  options:
    - off
    - strict
    - moderate
    - warn
  correctIndex: 1
  explanation: "`strict` validates every insert and update; `moderate` skips updates to already-invalid existing docs (so you don't get stuck); `off` disables validation."
- id: q2
  question: 'What does `validationAction: "warn"` do?'
  options:
    - Rejects the write
    - Disables validation
    - Logs the violation but allows the write
    - Drops the bad document
  correctIndex: 2
  explanation: "`warn` lets the write through and logs a DocumentValidationError — ideal for safely rolling out validation on existing collections before enforcing `error`."
- id: q3
  question: Which keyword specifies MongoDB-specific BSON types in `$jsonSchema`?
  options:
    - type
    - mongoType
    - kind
    - bsonType
  correctIndex: 3
  explanation: "`bsonType` accepts MongoDB-specific types like \"int\", \"long\", \"double\", \"decimal\", \"objectId\", \"date\", \"binData\"; `type` is JSON Schema's plain types."
- id: q4
  question: Can validation prevent deletion of an invalid document?
  options:
    - No — validation runs on inserts/updates/replacements only, not deletes
    - Yes
    - Only with strict mode
    - Only with a trigger
  correctIndex: 0
  explanation: Validation runs on writes that create/modify documents; deletes are not validated. Invalid docs that pre-date the validator can still be deleted.
- id: q5
  question: How do you apply a validator to an EXISTING collection?
  options:
    - Recreate the collection
    - Use `collMod` with `validator`
    - Use `createIndex`
    - You can't
  correctIndex: 1
  explanation: '`db.runCommand({ collMod: "users", validator: {...}, validationLevel: "...", validationAction: "..." })` adds or updates a validator on an existing collection.'
- id: q6
  question: What's the recommended rollout strategy for adding validation to existing data?
  options:
    - Switch directly to strict + error
    - Drop the collection
    - Start with warn + moderate, find/fix bad docs, then switch to strict + error
    - Disable writes during rollout
  correctIndex: 2
  explanation: Start in `warn` mode to discover pre-existing bad docs without breaking the app; fix them; then switch to `strict` + `error` to enforce.
- id: q7
  question: Which JSON Schema keyword constrains a string field to a regex?
  options:
    - format
    - regex
    - match
    - pattern
  correctIndex: 3
  explanation: '`pattern: "^[^@]+@[^@]+\\.[^@]+$"` constrains the string to match a regex — useful for email/zip/phone format enforcement.'
- id: q8
  question: "What's the difference between `additionalProperties: false` and `required: [...]`?"
  options:
    - "`additionalProperties: false` rejects fields not in `properties`; `required` mandates presence of named fields"
    - They're synonyms
    - "`additionalProperties` only works in strict mode"
    - "`required` is for arrays"
  correctIndex: 0
  explanation: "`required` lists fields that must be present; `additionalProperties: false` forbids any field not declared in `properties` — together they lock the document shape."
- id: q9
  question: What does `moderate` validation do for an update to an already-invalid doc?
  options:
    - Rejects it
    - Skips validation (lets the update through)
    - Logs and rejects
    - Auto-fixes the doc
  correctIndex: 1
  explanation: "`moderate` validates updates to ALREADY-VALID docs only — updates to invalid existing docs are not validated, so you can fix them in stages without getting stuck."
- id: q10
  question: Which keyword enforces a value from a fixed list?
  options:
    - values
    - oneOf
    - enum
    - allowed
  correctIndex: 2
  explanation: '`enum: [ "admin", "user", "guest" ]` constrains the field to one of the listed values — useful for status fields and roles.'
```

