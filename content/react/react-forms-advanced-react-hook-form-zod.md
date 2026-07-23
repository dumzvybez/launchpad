---
slug: react-forms-advanced-react-hook-form-zod
id: react-15
track: react
order: 15
title: Forms Advanced — React Hook Form, Zod
description: Build complex, performant forms with React Hook Form's uncontrolled model, validate with Zod schemas, and ship type-safe forms end-to-end.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=j942wKiXFu8&t=840s
whyItMatters: Build complex, performant forms with React Hook Form's uncontrolled model, validate with Zod schemas, and ship type-safe forms end-to-end.
deepDiveResources:
  - label: W3Schools React
    url: https://www.w3schools.com/react/
    kind: course
  - label: React Official Docs
    url: https://react.dev/learn
    kind: doc
---

# Forms Advanced — React Hook Form, Zod

## Forms Advanced — React Hook Form, Zod

### Why It Matters

Build complex, performant forms with React Hook Form's uncontrolled model, validate with Zod schemas, and ship type-safe forms end-to-end.

Build complex, performant forms with React Hook Form's uncontrolled model, validate with Zod schemas, and ship type-safe forms end-to-end.

### Prerequisites

- Stage 14: Error Boundaries and Suspense.
- Stage 6: Forms and Controlled Inputs (for comparison).

### Topics

- Why controlled inputs don't scale (re-renders, validation complexity)
- React Hook Form: `useForm`, `register`, `handleSubmit`
- Zod schemas and `zodResolver`
- Type-safe form values from Zod (`z.infer<typeof schema>`)
- Validation modes: onSubmit, onChange, onBlur
- Async validation and server-side validation reuse
- `Controller` for third-party inputs (MUI, Radix)
- Field arrays with `useFieldArray`

### Key Concepts

- React Hook Form uses uncontrolled inputs by default — fewer re-renders than controlled forms
- Zod is a single source of truth for both runtime validation and TypeScript types
- `zodResolver` bridges Zod schemas into React Hook Form's resolver
- Server and client can share the same Zod schema — single source of truth for validation
- Field arrays handle dynamic lists (add/remove rows) with proper `key` management

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "At least 8 characters"),
  remember: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await fetch("/api/login", { method: "POST", body: JSON.stringify(values) });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register("password")} />
      {errors.password && <p>{errors.password.message}</p>}

      <label>
        <input type="checkbox" {...register("remember")} /> Remember me
      </label>

      <button type="submit" disabled={isSubmitting}>Log in</button>
    </form>
  );
}
```
Caption: Basic form with Zod

### Common Pitfalls

- Using `register` on a third-party component that doesn't spread props — use `<Controller>` for MUI/Radix selects, date pickers, etc.
- Forgetting the `as const` on dynamic field names like `guests.${i}.name` — TypeScript can't infer the path otherwise.
- Validating only on the client — reuse the same Zod schema on the server; never trust client data.
- Using `key={i}` for field-array rows — use the `id` React Hook Form provides (`f.id`) so removing a middle row doesn't shuffle state.
- Mixing controlled inputs (`value`+`onChange`) with `register` on the same input — pick one model per input.

### Real-World Applications

- Vercel's deployment forms use React Hook Form + Zod for environment variable and config forms with complex validation.
- Linear's issue creation modal uses React Hook Form with field arrays for sub-issues and labels.
- Stripe's merchant dashboard uses Zod schemas shared between the React form and the API for type-safe validation.
- Cal.com's event-type form uses React Hook Form + Zod for availability scheduling with custom resolvers.

### Interview Questions

- 1. Why use React Hook Form over controlled inputs? — Uncontrolled by default = fewer re-renders on each keystroke; built-in validation, field arrays, and devtools.
- 2. What is Zod and why pair it with RHF? — Zod is a TypeScript-first schema validator; `zodResolver` plugs it into RHF, and `z.infer` derives the form's type from the schema.
- 3. Why is sharing the Zod schema between client and server valuable? — Single source of truth for validation; the server reuses the same schema, eliminating drift.
- 4. When do you need `<Controller>`? — When wrapping third-party components that don't accept a `ref`-based `register` (MUI Select, Radix Dropdown, custom date pickers).
- 5. What's the field-array `id` for? — It's a stable key RHF provides for each row so adding/removing rows preserves per-row state without shuffling.

### Mini Project

Build an "Event Registration Form" with React Hook Form + Zod: fields for name, email, phone (with regex), event choice (select), dietary restrictions (textarea), and a dynamic list of guest names. Reuse the Zod schema on a fake server endpoint. Suggested approach:
  - Define a Zod schema with all fields and a `.array()` for guests
  - Use `zodResolver` and `useForm<z.infer<typeof schema>>`
  - Add a `useFieldArray` for guests with stable `f.id` keys
  - Validate on blur (`mode: "onBlur"`) for less aggressive errors
  - Reuse the schema in a fake `submitRegistration(values)` that returns parsed-or-error

### Exercises

1. Convert a controlled form to React Hook Form and observe the lower re-render count in the Profiler.
2. Add a Zod schema with custom error messages per field.
3. Use `<Controller>` to wrap an MUI `<Select>`.
4. Build a field-array form (todos with title + done) and verify removing the middle row doesn't shuffle state.
5. Reuse the same Zod schema in a Node script to validate server-side input.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why does React Hook Form typically re-render less than controlled inputs?
9. A) It's faster because it skips TypeScript
10. B) It uses fewer hooks
11. C) It uses refs (uncontrolled) instead of state per keystroke (*)
12. D) It's a class component
13. Explanation: RHF uses refs to read input values, so a keystroke doesn't trigger a React re-render of the whole form — only the field itself updates via the DOM.
14. Q2: What does `zodResolver(schema)` do?
15. A) Generates TypeScript types from a form
16. B) Submits the form
17. C) Registers inputs
18. D) Bridges a Zod schema into RHF's resolver for runtime validation (*)
19. Explanation: `zodResolver` adapts a Zod schema so RHF can run it on form values and surface errors per field; combine with `z.infer` for the form's type.
20. Q3: How do you derive the form's TypeScript type from a Zod schema?
21. A) `type FormValues = z.infer<typeof schema>` (*)
22. B) Manually write an interface
23. C) Use `any`
24. D) Use `unknown`
25. Explanation: `z.infer<typeof schema>` produces a TypeScript type matching the schema, giving you a single source of truth for both runtime validation and types.
26. Q4: When must you use `<Controller>` instead of `register`?
27. A) For text inputs
28. B) For third-party components that don't accept a ref-based register (*)
29. C) For checkboxes
30. D) For radio buttons
31. Explanation: `register` works for native inputs via refs; third-party components (MUI Select, Radix Dropdown, custom date pickers) need `<Controller>` to wire value/onChange.
32. Q5: Why use `f.id` as the key for field-array rows?
33. A) It's shorter
34. B) It's required by TypeScript
35. C) It's a stable key RHF provides so removing a middle row doesn't shuffle state (*)
36. D) It's the row index
37. Explanation: RHF assigns each row a stable `id`; using it as the React `key` ensures correct reconciliation when rows are added/removed/reordered.
38. Q6: Why share a Zod schema between client and server?
39. A) Less code on the server
40. B) For SEO
41. C) To skip HTTPS
42. D) Single source of truth — no validation drift between client and server (*)
43. Explanation: Importing the same Zod schema on both sides guarantees identical validation; you can never drift into "client accepts what server rejects" or vice versa.
44. Q7: Which `mode` option validates on blur instead of every keystroke?
45. A) `onBlur` (*)
46. B) `onSubmit`
47. C) `onChange`
48. D) `onTouched`
49. Explanation: `mode: "onBlur"` runs validation when a field loses focus, reducing aggressive error display while typing; `onChange` validates every keystroke.
50. Q8: What is `useFieldArray` for?
51. A) Iterating a static list
52. B) Managing dynamic lists of fields (add/remove/append/swap) with stable keys (*)
53. C) Submitting arrays
54. D) Caching arrays
55. Explanation: `useFieldArray` returns `fields`, `append`, `remove`, etc. for dynamic repeating groups like guests, todos, or addresses — with stable row IDs.
56. Q9: What's a common bug when registering a dynamic field name like `guests.${i}.name`?
57. A) Using i instead of id
58. B) Both A and B
59. C) Forgetting `as const` so TypeScript can't infer the literal path (*)
60. D) None
61. Explanation: Without `as const`, TypeScript widens the template string to `string` and the field type check fails. Always use `as const` on dynamic paths.
62. Q10: Why is `isSubmitting` from `formState` useful?
63. A) It shows errors
64. B) It tracks touched fields
65. C) It tracks dirty fields
66. D) It lets you disable the submit button during async submission to prevent double-submit (*)
67. Explanation: `isSubmitting` is true while the async `onSubmit` runs; disable the button to prevent users from submitting twice.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why does React Hook Form typically re-render less than controlled inputs?
  options:
    - It's faster because it skips TypeScript
    - It uses fewer hooks
    - It uses refs (uncontrolled) instead of state per keystroke
    - It's a class component
  correctIndex: 2
  explanation: RHF uses refs to read input values, so a keystroke doesn't trigger a React re-render of the whole form — only the field itself updates via the DOM.
- id: q2
  question: What does `zodResolver(schema)` do?
  options:
    - Generates TypeScript types from a form
    - Submits the form
    - Registers inputs
    - Bridges a Zod schema into RHF's resolver for runtime validation
  correctIndex: 3
  explanation: "`zodResolver` adapts a Zod schema so RHF can run it on form values and surface errors per field; combine with `z.infer` for the form's type."
- id: q3
  question: How do you derive the form's TypeScript type from a Zod schema?
  options:
    - "`type FormValues = z.infer<typeof schema>`"
    - Manually write an interface
    - Use `any`
    - Use `unknown`
  correctIndex: 0
  explanation: "`z.infer<typeof schema>` produces a TypeScript type matching the schema, giving you a single source of truth for both runtime validation and types."
- id: q4
  question: When must you use `<Controller>` instead of `register`?
  options:
    - For text inputs
    - For third-party components that don't accept a ref-based register
    - For checkboxes
    - For radio buttons
  correctIndex: 1
  explanation: "`register` works for native inputs via refs; third-party components (MUI Select, Radix Dropdown, custom date pickers) need `<Controller>` to wire value/onChange."
- id: q5
  question: Why use `f.id` as the key for field-array rows?
  options:
    - It's shorter
    - It's required by TypeScript
    - It's a stable key RHF provides so removing a middle row doesn't shuffle state
    - It's the row index
  correctIndex: 2
  explanation: RHF assigns each row a stable `id`; using it as the React `key` ensures correct reconciliation when rows are added/removed/reordered.
- id: q6
  question: Why share a Zod schema between client and server?
  options:
    - Less code on the server
    - For SEO
    - To skip HTTPS
    - Single source of truth — no validation drift between client and server
  correctIndex: 3
  explanation: Importing the same Zod schema on both sides guarantees identical validation; you can never drift into "client accepts what server rejects" or vice versa.
- id: q7
  question: Which `mode` option validates on blur instead of every keystroke?
  options:
    - "`onBlur`"
    - "`onSubmit`"
    - "`onChange`"
    - "`onTouched`"
  correctIndex: 0
  explanation: '`mode: "onBlur"` runs validation when a field loses focus, reducing aggressive error display while typing; `onChange` validates every keystroke.'
- id: q8
  question: What is `useFieldArray` for?
  options:
    - Iterating a static list
    - Managing dynamic lists of fields (add/remove/append/swap) with stable keys
    - Submitting arrays
    - Caching arrays
  correctIndex: 1
  explanation: "`useFieldArray` returns `fields`, `append`, `remove`, etc. for dynamic repeating groups like guests, todos, or addresses — with stable row IDs."
- id: q9
  question: What's a common bug when registering a dynamic field name like `guests.${i}.name`?
  options:
    - Using i instead of id
    - Both A and B
    - Forgetting `as const` so TypeScript can't infer the literal path
    - None
  correctIndex: 2
  explanation: Without `as const`, TypeScript widens the template string to `string` and the field type check fails. Always use `as const` on dynamic paths.
- id: q10
  question: Why is `isSubmitting` from `formState` useful?
  options:
    - It shows errors
    - It tracks touched fields
    - It tracks dirty fields
    - It lets you disable the submit button during async submission to prevent double-submit
  correctIndex: 3
  explanation: "`isSubmitting` is true while the async `onSubmit` runs; disable the button to prevent users from submitting twice."
```

