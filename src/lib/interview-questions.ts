/**
 * Interview Questions Database — 220+ mock interview questions organized by
 * career, language, type, and difficulty.
 *
 * Per Section 4.4 of Prompt-2-updated.txt:
 * - Cover all 30 technologies from the v3 course database
 * - Extra coverage for the 6 newly added (Svelte, Vue, Angular, Node.js, PostgreSQL, MongoDB)
 * - Types: conceptual, code review, problem solving, behavioral, system design
 * - Difficulties: beginner, intermediate, advanced
 *
 * Used by AIChat's Interview Mode to seed the AI's first question and
 * provide a fallback pool if the AI deviates from the user's selected
 * languages.
 */

export type QuestionType = "conceptual" | "code-review" | "problem-solving" | "behavioral" | "system-design";
export type QuestionDifficulty = "beginner" | "intermediate" | "advanced";

export type InterviewQuestion = {
  id: string;
  /** Career id this question is most relevant to (or "general") */
  career: string;
  /** Tech/language id (python, javascript, react, svelte, etc.) or "general" */
  language: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  question: string;
  /** Short hint about what a good answer should cover */
  hint: string;
};

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // ============================================================
  // Web Development — JavaScript
  // ============================================================
  { id: "js-1", career: "web-dev", language: "javascript", type: "conceptual", difficulty: "beginner", question: "Explain the difference between `let`, `const`, and `var` in JavaScript.", hint: "Scope (function vs block), reassignment, hoisting, temporal dead zone." },
  { id: "js-2", career: "web-dev", language: "javascript", type: "conceptual", difficulty: "beginner", question: "What is the DOM and how do you access elements using JavaScript?", hint: "Tree of nodes, getElementById, querySelector, traversing parent/children." },
  { id: "js-3", career: "web-dev", language: "javascript", type: "conceptual", difficulty: "beginner", question: "What is an event listener and when would you use one?", hint: "addEventListener, event types, callbacks, removing listeners." },
  { id: "js-4", career: "web-dev", language: "javascript", type: "conceptual", difficulty: "intermediate", question: "Explain what `async/await` does and give a real-world example.", hint: "Promises under the hood, syntax sugar, try/catch, sequential-looking async code." },
  { id: "js-5", career: "web-dev", language: "javascript", type: "conceptual", difficulty: "intermediate", question: "Explain the event loop and the difference between microtasks and macrotasks.", hint: "Call stack, task queue, microtask queue, Promise.then vs setTimeout ordering." },
  { id: "js-6", career: "web-dev", language: "javascript", type: "conceptual", difficulty: "intermediate", question: "What is closure in JavaScript? Give a practical example.", hint: "Function + its lexical scope, data privacy, partial application, modules." },
  { id: "js-7", career: "web-dev", language: "javascript", type: "problem-solving", difficulty: "intermediate", question: "Write a function that debounces another function. Explain your implementation.", hint: "setTimeout, clearTimeout, leading vs trailing edge, this binding." },
  { id: "js-8", career: "web-dev", language: "javascript", type: "code-review", difficulty: "intermediate", question: "Review this code: `const arr = [1,2,3]; arr.forEach(async (x) => await save(x));` — what's wrong?", hint: "forEach doesn't await. Use for...of or Promise.all." },
  { id: "js-9", career: "web-dev", language: "javascript", type: "conceptual", difficulty: "advanced", question: "Explain how JavaScript's prototype chain works and how ES6 classes relate to it.", hint: "Function.prototype, __proto__ vs prototype, class as syntactic sugar, static methods." },
  { id: "js-10", career: "web-dev", language: "javascript", type: "problem-solving", difficulty: "advanced", question: "Implement a deep clone of an object that may contain circular references.", hint: "WeakMap for visited, recursion, handle Date/Map/Set/Array, JSON.stringify pitfalls." },
  { id: "js-11", career: "web-dev", language: "javascript", type: "conceptual", difficulty: "beginner", question: "What is the difference between `==` and `===` in JavaScript?", hint: "Loose equality with coercion vs strict equality. Type coercion rules." },
  { id: "js-12", career: "web-dev", language: "javascript", type: "conceptual", difficulty: "beginner", question: "What are template literals and how do they help with string interpolation?", hint: "Backticks, ${expression}, multi-line strings, tagged templates." },
  { id: "js-13", career: "web-dev", language: "javascript", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between `null` and `undefined`.", hint: "Absence of value vs uninitialized. typeof null bug. == vs ===." },
  { id: "js-14", career: "web-dev", language: "javascript", type: "conceptual", difficulty: "intermediate", question: "What is hoisting in JavaScript? How does it affect variables and functions?", hint: "var/function declarations moved to top, let/const in TDZ, function expressions vs declarations." },
  { id: "js-15", career: "web-dev", language: "javascript", type: "problem-solving", difficulty: "intermediate", question: "Implement a function that flattens a nested array of any depth without using Array.flat().", hint: "Recursion, reduce + concat, iterative stack approach, infinity depth." },
  { id: "js-16", career: "web-dev", language: "javascript", type: "code-review", difficulty: "advanced", question: "Review: `const memo = fn => { const cache = {}; return (...args) => cache[args] || (cache[args] = fn(...args)); };` — issues?", hint: "Cache key uses array stringification (fails for objects), no TTL, memory leak, no this binding." },
  { id: "js-17", career: "web-dev", language: "javascript", type: "conceptual", difficulty: "advanced", question: "Explain generators in JavaScript and how they differ from async iterators.", hint: "function*, yield, lazy evaluation, Symbol.iterator vs Symbol.asyncIterator." },
  { id: "js-18", career: "web-dev", language: "javascript", type: "conceptual", difficulty: "intermediate", question: "What is the difference between `call`, `apply`, and `bind`?", hint: "Direct invocation with this/args-array vs permanent binding, partial application." },

  // ============================================================
  // Web Development — React
  // ============================================================
  { id: "react-1", career: "web-dev", language: "react", type: "conceptual", difficulty: "intermediate", question: "Explain the React component lifecycle and how hooks replace lifecycle methods.", hint: "Mount/update/unmount, useEffect with deps array vs componentDidMount/Update/WillUnmount." },
  { id: "react-2", career: "web-dev", language: "react", type: "conceptual", difficulty: "intermediate", question: "What is the difference between `useState` and `useReducer`? When would you use each?", hint: "Simple vs complex state, transitions, predictability, testing." },
  { id: "react-3", career: "web-dev", language: "react", type: "conceptual", difficulty: "intermediate", question: "Explain what happens when React renders a component — step by step.", hint: "JSX → createElement → reconcile → diff → commit → DOM update. Concurrent mode." },
  { id: "react-4", career: "web-dev", language: "react", type: "conceptual", difficulty: "intermediate", question: "What is prop drilling and how do you solve it?", hint: "Passing props through many layers, Context API, state libs (Zustand/Redux)." },
  { id: "react-5", career: "web-dev", language: "react", type: "code-review", difficulty: "intermediate", question: "Review: `useEffect(() => { fetchData() })` — what's missing?", hint: "Empty deps array → infinite loop. Add [] or proper deps. Cleanup function." },
  { id: "react-6", career: "web-dev", language: "react", type: "conceptual", difficulty: "advanced", question: "Explain React's reconciliation algorithm and the role of the `key` prop.", hint: "Virtual DOM diffing, O(n) heuristic, same-type + key matching, list re-rendering." },
  { id: "react-7", career: "web-dev", language: "react", type: "problem-solving", difficulty: "advanced", question: "Build a custom hook `useDebouncedValue(value, delay)` that returns a debounced version.", hint: "useEffect + setTimeout, cleanup, dependency on value." },
  { id: "react-8", career: "web-dev", language: "react", type: "conceptual", difficulty: "beginner", question: "What is JSX and how does it differ from HTML?", hint: "JSX is syntactic sugar for React.createElement, className vs class, expressions in {}." },
  { id: "react-9", career: "web-dev", language: "react", type: "conceptual", difficulty: "intermediate", question: "What is the difference between controlled and uncontrolled components?", hint: "React state as source of truth vs DOM ref, defaultValue, when to use each." },
  { id: "react-10", career: "web-dev", language: "react", type: "conceptual", difficulty: "advanced", question: "What are React Server Components and how do they differ from Client Components?", hint: "Zero-bundle, async, no state/effects, RSC payload, streaming, App Router." },
  { id: "react-11", career: "web-dev", language: "react", type: "problem-solving", difficulty: "intermediate", question: "Implement a custom `usePrevious(value)` hook that returns the previous value.", hint: "useRef to store value, update in useEffect after render." },
  { id: "react-12", career: "web-dev", language: "react", type: "code-review", difficulty: "advanced", question: "Review: `const [count, setCount] = useState(0); useEffect(() => { setCount(c => c + 1); }, [count]);` — what's wrong?", hint: "Infinite render loop. count in deps triggers effect that updates count. Use functional update with empty deps or restructure." },

  // ============================================================
  // Web Development — Svelte
  // ============================================================
  { id: "svelte-1", career: "web-dev", language: "svelte", type: "conceptual", difficulty: "intermediate", question: "How does Svelte's reactivity model differ from React's?", hint: "Compile-time vs runtime, no virtual DOM, direct DOM mutations, assignment triggers updates." },
  { id: "svelte-2", career: "web-dev", language: "svelte", type: "conceptual", difficulty: "intermediate", question: "What are runes in Svelte 5 and how do they change the mental model?", hint: "$state, $derived, $effect, $props — explicit reactivity signals replacing let/export." },
  { id: "svelte-3", career: "web-dev", language: "svelte", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between Svelte stores and Svelte 5 runes.", hint: "Stores (writable/readable) vs runes ($state/$derived), auto-tracking, migration paths." },
  { id: "svelte-4", career: "web-dev", language: "svelte", type: "conceptual", difficulty: "advanced", question: "When would you choose SvelteKit over Next.js?", hint: "Bundle size, compile-time optimizations, simplicity, server routes, deployment targets." },
  { id: "svelte-5", career: "web-dev", language: "svelte", type: "conceptual", difficulty: "beginner", question: "What is a Svelte component and how does it differ from a React component?", hint: ".svelte files, no JSX, no virtual DOM, compiled to vanilla JS, simpler mental model." },
  { id: "svelte-6", career: "web-dev", language: "svelte", type: "problem-solving", difficulty: "intermediate", question: "How would you implement two-way binding in Svelte? Compare to React.", hint: "bind:value directive, less boilerplate than onChange+setState, when to avoid." },

  // ============================================================
  // Web Development — Vue
  // ============================================================
  { id: "vue-1", career: "web-dev", language: "vue", type: "conceptual", difficulty: "intermediate", question: "What's the difference between `ref` and `reactive` in Vue 3?", hint: "ref = wrapper for any value (.value access), reactive = Proxy on objects, gotchas with primitives." },
  { id: "vue-2", career: "web-dev", language: "vue", type: "conceptual", difficulty: "intermediate", question: "Explain the Composition API vs Options API in Vue 3 — when would you pick each?", hint: "Logic reuse (composables), TypeScript support, code organization, learning curve." },
  { id: "vue-3", career: "web-dev", language: "vue", type: "conceptual", difficulty: "intermediate", question: "How does Vue's reactivity work under the hood (Proxy-based)?", hint: "ES6 Proxy, track deps in getter, trigger updates in setter, contrast with Vue 2's Object.defineProperty." },
  { id: "vue-4", career: "web-dev", language: "vue", type: "conceptual", difficulty: "advanced", question: "Explain Vue's keep-alive component and when to use it.", hint: "Caching component instances, include/exclude, activated/deactivated hooks, memory tradeoffs." },
  { id: "vue-5", career: "web-dev", language: "vue", type: "conceptual", difficulty: "beginner", question: "What is a Vue single-file component (SFC) and what are its three sections?", hint: ".vue file, template/script/style, scoped styles, preprocessor support." },
  { id: "vue-6", career: "web-dev", language: "vue", type: "problem-solving", difficulty: "intermediate", question: "How would you share reactive state across multiple Vue components without Pinia?", hint: "Composables with ref/reactive, provide/inject, event bus pattern, tradeoffs." },

  // ============================================================
  // Web Development — Angular
  // ============================================================
  { id: "angular-1", career: "web-dev", language: "angular", type: "conceptual", difficulty: "intermediate", question: "How does Angular's dependency injection work?", hint: "Providers, injector tree, @Injectable, hierarchical injectors, tree-shakable services." },
  { id: "angular-2", career: "web-dev", language: "angular", type: "conceptual", difficulty: "intermediate", question: "What's the difference between `OnPush` and default change detection?", hint: "Reference checks, immutable patterns, markForCheck, performance implications." },
  { id: "angular-3", career: "web-dev", language: "angular", type: "conceptual", difficulty: "intermediate", question: "What are Angular Signals and why were they introduced?", hint: "Fine-grained reactivity, finer than zone.js, computed/effect, gradual migration." },
  { id: "angular-4", career: "web-dev", language: "angular", type: "conceptual", difficulty: "advanced", question: "Explain Angular's router lifecycle guards and when to use each.", hint: "canActivate, canDeactivate, resolve, canLoad, lazy loading implications." },
  { id: "angular-5", career: "web-dev", language: "angular", type: "conceptual", difficulty: "beginner", question: "What is an Angular module and how does it organize an application?", hint: "NgModule, declarations/imports/exports/providers, bootstrap module, standalone components." },
  { id: "angular-6", career: "web-dev", language: "angular", type: "conceptual", difficulty: "intermediate", question: "Explain RxJS observables and how Angular uses them for HTTP and events.", hint: "Streams over time, subscribe/unsubscribe, operators (map/filter/switchMap), hot vs cold." },

  // ============================================================
  // Backend — Node.js
  // ============================================================
  { id: "nodejs-1", career: "web-dev", language: "nodejs", type: "conceptual", difficulty: "intermediate", question: "Explain the Node.js event loop and the difference between microtasks and macrotasks.", hint: "libuv, phases (timers/pending/poll/check/close), process.nextTick vs Promise.then vs setImmediate." },
  { id: "nodejs-2", career: "web-dev", language: "nodejs", type: "conceptual", difficulty: "intermediate", question: "What are worker threads and when would you use them?", hint: "worker_threads, isolated JS contexts, CPU-bound work, SharedArrayBuffer, message passing." },
  { id: "nodejs-3", career: "web-dev", language: "nodejs", type: "conceptual", difficulty: "intermediate", question: "How does `cluster` differ from `worker_threads`?", hint: "Process-based vs thread-based, IPC vs SharedArrayBuffer, scaling HTTP servers vs CPU work." },
  { id: "nodejs-4", career: "web-dev", language: "nodejs", type: "code-review", difficulty: "intermediate", question: "Review this Express handler: `app.get('/users', async (req, res) => { const users = await db.query(); res.json(users); })` — what's missing?", hint: "No try/catch → unhandled rejection → request hangs. Use express-async-errors or wrap." },
  { id: "nodejs-5", career: "web-dev", language: "nodejs", type: "conceptual", difficulty: "advanced", question: "Explain backpressure in Node.js streams and how to handle it.", hint: "HighWaterMark, .push/.read, pipe() vs pipeline(), pause/resume." },
  { id: "nodejs-6", career: "web-dev", language: "nodejs", type: "conceptual", difficulty: "beginner", question: "What is npm and how does `package.json` work?", hint: "Node package manager, dependencies/devDependencies, semver, scripts field, lockfile." },
  { id: "nodejs-7", career: "web-dev", language: "nodejs", type: "conceptual", difficulty: "beginner", question: "What is the difference between `require` and `import` in Node.js?", hint: "CommonJS vs ESM, synchronous vs asynchronous, named/default exports, dynamic import()." },
  { id: "nodejs-8", career: "web-dev", language: "nodejs", type: "problem-solving", difficulty: "intermediate", question: "How would you implement a simple in-memory rate limiter in Node.js?", hint: "Map of IP → timestamps, sliding window, cleanup interval, consider Redis for distributed." },

  // ============================================================
  // Database — PostgreSQL
  // ============================================================
  { id: "postgres-1", career: "web-dev", language: "postgresql", type: "conceptual", difficulty: "intermediate", question: "Explain MVCC and why Postgres uses it.", hint: "Multi-version concurrency control, snapshot isolation, no read locks, vacuum." },
  { id: "postgres-2", career: "web-dev", language: "postgresql", type: "conceptual", difficulty: "intermediate", question: "What's the difference between `JSON` and `JSONB`?", hint: "Text vs binary, parsing cost, indexing (GIN on JSONB), duplicate keys." },
  { id: "postgres-3", career: "web-dev", language: "postgresql", type: "conceptual", difficulty: "intermediate", question: "How do `LEFT JOIN ... ON` vs `LEFT JOIN ... WHERE` differ when filtering on the inner table?", hint: "ON filters before join (preserves rows with NULL inner), WHERE filters after (acts like INNER JOIN)." },
  { id: "postgres-4", career: "web-dev", language: "postgresql", type: "conceptual", difficulty: "advanced", question: "Explain the ESR rule for compound indexes in PostgreSQL.", hint: "Equality → Sort → Range. Column ordering matters, EXPLAIN ANALYZE verification." },
  { id: "postgres-5", career: "web-dev", language: "postgresql", type: "conceptual", difficulty: "advanced", question: "What are CTEs and when would you use a recursive CTE?", hint: "WITH clause, readability, materialization (Postgres 12+), tree/hierarchy traversal." },
  { id: "postgres-6", career: "web-dev", language: "postgresql", type: "conceptual", difficulty: "beginner", question: "What is a primary key and why is it important?", hint: "Unique identifier, NOT NULL, indexed by default, references via foreign keys." },
  { id: "postgres-7", career: "web-dev", language: "postgresql", type: "problem-solving", difficulty: "intermediate", question: "Write a query to find duplicate emails in a users table.", hint: "GROUP BY + HAVING COUNT(*) > 1, or window function with COUNT OVER." },
  { id: "postgres-8", career: "web-dev", language: "postgresql", type: "conceptual", difficulty: "intermediate", question: "What are ACID properties and how does PostgreSQL enforce them?", hint: "Atomicity/Consistency/Isolation/Durability, WAL, transactions, isolation levels." },

  // ============================================================
  // Database — MongoDB
  // ============================================================
  { id: "mongodb-1", career: "web-dev", language: "mongodb", type: "conceptual", difficulty: "intermediate", question: "When would you choose embedding over referencing in MongoDB schema design?", hint: "1:1 / 1:few → embed; many:many → reference. Access patterns, document size (16MB), atomicity." },
  { id: "mongodb-2", career: "web-dev", language: "mongodb", type: "conceptual", difficulty: "intermediate", question: "Explain the aggregation pipeline and when you'd use `$lookup`.", hint: "Stages ($match/$group/$sort/$project), $lookup as left-outer join, performance vs denormalization." },
  { id: "mongodb-3", career: "web-dev", language: "mongodb", type: "conceptual", difficulty: "intermediate", question: "What is a shard key and how do you pick a good one?", hint: "Even distribution, query isolation, immutability, compound keys, hashed vs ranged." },
  { id: "mongodb-4", career: "web-dev", language: "mongodb", type: "conceptual", difficulty: "advanced", question: "Explain replica sets and how failover works in MongoDB.", hint: "Primary + secondaries + arbiter, elections, oplog, write concerns, read preferences." },
  { id: "mongodb-5", career: "web-dev", language: "mongodb", type: "conceptual", difficulty: "beginner", question: "What is a document in MongoDB and how does it differ from a SQL row?", hint: "BSON document, flexible schema, nested objects/arrays, 16MB limit, no JOINs." },
  { id: "mongodb-6", career: "web-dev", language: "mongodb", type: "problem-solving", difficulty: "intermediate", question: "How would you model a many-to-many relationship in MongoDB?", hint: "Referencing with arrays of IDs, populate via $lookup, or array of embedded subdocs if small." },

  // ============================================================
  // Python / Data Science
  // ============================================================
  { id: "py-1", career: "data-science", language: "python", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between a list and a numpy array. When would you use each?", hint: "Homogeneous vs heterogeneous, memory layout, vectorized ops, fixed-size." },
  { id: "py-2", career: "data-science", language: "python", type: "conceptual", difficulty: "intermediate", question: "What is the purpose of train/test split in machine learning?", hint: "Generalization, overfitting detection, holdout vs cross-validation, stratification." },
  { id: "py-3", career: "data-science", language: "python", type: "conceptual", difficulty: "intermediate", question: "Explain what a pandas DataFrame is and how you would clean missing data.", hint: "2D labeled array, isna/dropna/fillna, forward/backward fill, interpolation." },
  { id: "py-4", career: "software-engineering", language: "python", type: "conceptual", difficulty: "beginner", question: "What's the difference between a list and a tuple in Python?", hint: "Mutability, hashability, memory, idiomatic use (records vs collections)." },
  { id: "py-5", career: "software-engineering", language: "python", type: "conceptual", difficulty: "intermediate", question: "Explain decorators in Python with a simple example.", hint: "Higher-order functions, @syntax sugar, *args/**kwargs, functools.wraps, classes as decorators." },
  { id: "py-6", career: "software-engineering", language: "python", type: "conceptual", difficulty: "advanced", question: "Explain the GIL (Global Interpreter Lock) and how it affects multi-threaded Python code.", hint: "Reference counting, mutex on bytecode, I/O-bound vs CPU-bound, multiprocessing alternative." },
  { id: "py-7", career: "data-science", language: "python", type: "conceptual", difficulty: "beginner", question: "What is a virtual environment and why should you use one?", hint: "Isolated package installs, venv/pipenv/poetry, reproducibility, conflict avoidance." },
  { id: "py-8", career: "software-engineering", language: "python", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between `is` and `==` in Python.", hint: "Identity (memory address) vs equality (value), interned objects, None comparison." },
  { id: "py-9", career: "data-science", language: "python", type: "problem-solving", difficulty: "intermediate", question: "Write a Python function to merge two sorted lists into one sorted list.", hint: "Two-pointer approach, O(n+m), avoid naive concat+sort." },
  { id: "py-10", career: "data-science", language: "python", type: "conceptual", difficulty: "advanced", question: "Explain how Python's import system works (sys.path, packages, modules).", hint: "sys.path search, __init__.py, namespace packages, relative vs absolute imports." },
  { id: "py-11", career: "software-engineering", language: "python", type: "code-review", difficulty: "intermediate", question: "Review: `def get_user(id): return db.users.find_one({'id': id})` — what's missing?", hint: "No type hints, no error handling for None, no input validation, SQL/NoSQL injection if id is dict." },
  { id: "py-12", career: "data-science", language: "python", type: "conceptual", difficulty: "advanced", question: "Explain the difference between synchronous and asynchronous programming in Python.", hint: "asyncio, await, event loop, aiohttp, blocking vs non-blocking I/O." },

  // ============================================================
  // Django / FastAPI / Flask
  // ============================================================
  { id: "django-1", career: "web-dev", language: "django", type: "conceptual", difficulty: "intermediate", question: "Explain Django's ORM and how migrations work.", hint: "Model classes → SQL tables, makemigrations/migrate, schema versioning, introspection." },
  { id: "django-2", career: "web-dev", language: "django", type: "conceptual", difficulty: "intermediate", question: "What is the Django middleware stack and how does it process requests?", hint: "Layered wrappers around view dispatch, process_request/response/view, ordering matters." },
  { id: "django-3", career: "web-dev", language: "django", type: "conceptual", difficulty: "beginner", question: "What is the MVT pattern in Django and how does it differ from MVC?", hint: "Model-View-Template, Django handles the controller, view = view function." },
  { id: "fastapi-1", career: "web-dev", language: "fastapi", type: "conceptual", difficulty: "intermediate", question: "How does FastAPI use Python type hints for validation and docs?", hint: "Pydantic models, automatic OpenAPI/Swagger, dependency injection, async support." },
  { id: "fastapi-2", career: "web-dev", language: "fastapi", type: "conceptual", difficulty: "intermediate", question: "Explain dependency injection in FastAPI with an example.", hint: "Depends(), callable dependencies, sub-dependencies, caching per-request." },
  { id: "flask-1", career: "web-dev", language: "flask", type: "conceptual", difficulty: "beginner", question: "What is Flask and how does it differ from Django?", hint: "Microframework, no ORM/forms/auth by default, more flexible, more boilerplate." },
  { id: "flask-2", career: "web-dev", language: "flask", type: "conceptual", difficulty: "intermediate", question: "Explain Flask's application context and request context.", hint: "Globals that proxy thread-local state, g object, current_app, request." },

  // ============================================================
  // TypeScript
  // ============================================================
  { id: "ts-1", career: "web-dev", language: "typescript", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between `interface` and `type` in TypeScript.", hint: "Declaration merging, extension syntax, union/intersection, primitives." },
  { id: "ts-2", career: "web-dev", language: "typescript", type: "conceptual", difficulty: "intermediate", question: "What are conditional types and when would you use them?", hint: "T extends U ? X : Y, distributive over unions, infer keyword, built-in helpers." },
  { id: "ts-3", career: "web-dev", language: "typescript", type: "conceptual", difficulty: "advanced", question: "Explain TypeScript's structural typing vs nominal typing.", hint: "Shape-based, duck typing, branded types trick for nominal feel." },
  { id: "ts-4", career: "web-dev", language: "typescript", type: "conceptual", difficulty: "beginner", question: "What is the `unknown` type and how does it differ from `any`?", hint: "Top type that requires narrowing, safer than any, type-safe error handling." },
  { id: "ts-5", career: "web-dev", language: "typescript", type: "conceptual", difficulty: "intermediate", question: "What are generics in TypeScript? Give a practical example.", hint: "Type parameters, <T>, constraints (extends), inference, generic functions/classes." },
  { id: "ts-6", career: "web-dev", language: "typescript", type: "problem-solving", difficulty: "advanced", question: "Implement a `DeepPartial<T>` utility type that makes all properties optional recursively.", hint: "Recursive mapped type, keyof, extends object check, union with undefined." },
  { id: "ts-7", career: "web-dev", language: "typescript", type: "code-review", difficulty: "intermediate", question: "Review: `function parse<T>(s: string): T { return JSON.parse(s); }` — what's unsafe?", hint: "No runtime validation, JSON.parse returns any, claim of T is a lie. Use zod/io-ts for runtime checks." },

  // ============================================================
  // SQL (general)
  // ============================================================
  { id: "sql-1", career: "web-dev", language: "sql", type: "conceptual", difficulty: "beginner", question: "What's the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN?", hint: "Matching rows only, all left + matching right, all from both with NULLs." },
  { id: "sql-2", career: "web-dev", language: "sql", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between WHERE and HAVING clauses.", hint: "Row-level filtering (pre-group) vs group-level filtering (post-aggregate)." },
  { id: "sql-3", career: "web-dev", language: "sql", type: "problem-solving", difficulty: "intermediate", question: "Write a SQL query to find the second-highest salary in an employees table.", hint: "Multiple solutions: LIMIT OFFSET, subquery with MAX, window function (DENSE_RANK)." },
  { id: "sql-4", career: "web-dev", language: "sql", type: "conceptual", difficulty: "advanced", question: "What are window functions and how do they differ from GROUP BY?", hint: "OVER() partition, no row collapsing, ROW_NUMBER/RANK/LAG, running totals." },
  { id: "sql-5", career: "web-dev", language: "sql", type: "conceptual", difficulty: "beginner", question: "What is normalization? Explain 1NF, 2NF, and 3NF.", hint: "Atomic values, no partial dependencies, no transitive dependencies." },
  { id: "sql-6", career: "web-dev", language: "sql", type: "conceptual", difficulty: "intermediate", question: "What is an index and when should you create one? Any trade-offs?", hint: "B-tree/Hash, faster reads, slower writes, storage cost, EXPLAIN for query plans." },
  { id: "sql-7", career: "web-dev", language: "sql", type: "problem-solving", difficulty: "advanced", question: "Write a SQL query to find consecutive numbers in a Logs table (LeetCode 180).", hint: "Self-join with offset, LAG window function, or DENSE_RANK with subtraction trick." },

  // ============================================================
  // HTML / CSS
  // ============================================================
  { id: "html-1", career: "web-dev", language: "html", type: "conceptual", difficulty: "beginner", question: "What's the difference between `<section>`, `<article>`, and `<div>`?", hint: "Semantic meaning, document outline, accessibility, when to use each." },
  { id: "html-2", career: "web-dev", language: "html", type: "conceptual", difficulty: "beginner", question: "What are the key accessibility (a11y) attributes every HTML page should include?", hint: "lang, alt text, aria-label, role, semantic landmarks, focus management." },
  { id: "html-3", career: "web-dev", language: "html", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between `<script>`, `<script async>`, and `<script defer>`.", hint: "Block parsing, parallel download + execute when ready, parallel + execute after parse." },
  { id: "css-1", career: "web-dev", language: "css", type: "conceptual", difficulty: "intermediate", question: "Explain CSS specificity and the cascade.", hint: "Inline > ID > class > element, !important, source order, specificity calculation." },
  { id: "css-2", career: "web-dev", language: "css", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between Flexbox and CSS Grid. When would you use each?", hint: "1D vs 2D, content-first vs layout-first, browser support, real-world combos." },
  { id: "css-3", career: "web-dev", language: "css", type: "conceptual", difficulty: "advanced", question: "Explain how the CSS Box Model works and how `box-sizing: border-box` changes it.", hint: "Content + padding + border + margin, default content-box vs border-box, sizing implications." },
  { id: "css-4", career: "web-dev", language: "css", type: "conceptual", difficulty: "intermediate", question: "What are CSS custom properties (variables) and how do they differ from preprocessor variables?", hint: "Runtime in browser, cascade, JavaScript access, scoping vs compiled constants." },
  { id: "css-5", career: "web-dev", language: "css", type: "problem-solving", difficulty: "intermediate", question: "How would you center a div both horizontally and vertically? Give 3 different methods.", hint: "Flexbox (justify+align), Grid (place-items), absolute + transform, margin auto + flex." },
  { id: "css-6", career: "web-dev", language: "css", type: "conceptual", difficulty: "advanced", question: "Explain the BEM naming convention and its pros/cons.", hint: "Block__Element--Modifier, clear relationships, verbosity, harder with dynamic classes." },

  // ============================================================
  // Java / C / C++ / C#
  // ============================================================
  { id: "java-1", career: "software-engineering", language: "java", type: "conceptual", difficulty: "intermediate", question: "Explain the JVM, JDK, and JRE — what's the difference?", hint: "Runtime vs development kit, bytecode, platform independence, JIT compilation." },
  { id: "java-2", career: "software-engineering", language: "java", type: "conceptual", difficulty: "intermediate", question: "What is the difference between `==` and `.equals()` in Java?", hint: "Reference equality vs value equality, String interning, overriding equals/hashCode contract." },
  { id: "java-3", career: "software-engineering", language: "java", type: "conceptual", difficulty: "advanced", question: "Explain how Java's garbage collector works (generational GC).", hint: "Young/old generation, minor vs major GC, mark-sweep-compact, G1/ZGC collectors." },
  { id: "java-4", career: "software-engineering", language: "java", type: "problem-solving", difficulty: "intermediate", question: "Implement a thread-safe singleton in Java. Show 3 approaches.", hint: "Synchronized (slow), double-checked locking, enum singleton, initialization-on-demand holder." },
  { id: "java-5", career: "software-engineering", language: "java", type: "conceptual", difficulty: "beginner", question: "What is the difference between an abstract class and an interface in Java?", hint: "Multiple inheritance, default methods (Java 8+), state vs contract, constructors." },
  { id: "c-1", career: "software-engineering", language: "c", type: "conceptual", difficulty: "intermediate", question: "Explain pointers in C and the difference between `*p`, `p`, and `&p`.", hint: "Address-of, dereference, pointer arithmetic, null/void pointers." },
  { id: "c-2", career: "software-engineering", language: "c", type: "conceptual", difficulty: "advanced", question: "Explain memory management in C — stack vs heap, malloc/free, memory leaks.", hint: "Automatic vs manual, fragmentation, valgrind, double-free, use-after-free." },
  { id: "c-3", career: "software-engineering", language: "c", type: "code-review", difficulty: "intermediate", question: "Review: `char *s = malloc(10); strcpy(s, user_input);` — what's wrong?", hint: "Buffer overflow if user_input > 9 chars. Use strncpy or strlcpy, check NULL, free s." },
  { id: "cpp-1", career: "software-engineering", language: "cpp", type: "conceptual", difficulty: "intermediate", question: "What are smart pointers in C++ and why are they preferred over raw pointers?", hint: "RAII, unique_ptr vs shared_ptr vs weak_ptr, ownership semantics, memory leaks." },
  { id: "cpp-2", career: "software-engineering", language: "cpp", type: "conceptual", difficulty: "advanced", question: "Explain move semantics and rvalue references in C++11.", hint: "&&, std::move, perfect forwarding, copy elision, rule of 5." },
  { id: "cpp-3", career: "software-engineering", language: "cpp", type: "conceptual", difficulty: "intermediate", question: "What is RAII in C++ and why is it important?", hint: "Resource Acquisition Is Initialization, destructors free resources, exception safety." },
  { id: "csharp-1", career: "software-engineering", language: "csharp", type: "conceptual", difficulty: "intermediate", question: "Explain LINQ in C# and give an example of deferred execution.", hint: "IEnumerable/IQueryable, query vs method syntax, yield return, performance implications." },
  { id: "csharp-2", career: "software-engineering", language: "csharp", type: "conceptual", difficulty: "intermediate", question: "What is the difference between `Task` and `Thread` in C#?", hint: "Higher-level abstraction, thread pool, async/await, return values, cancellation." },

  // ============================================================
  // Go / Rust / Swift / Kotlin / PHP / Ruby / R / Dart / Bash
  // ============================================================
  { id: "go-1", career: "cloud-devops", language: "go", type: "conceptual", difficulty: "intermediate", question: "Explain goroutines and channels in Go.", hint: "Lightweight threads, CSP model, buffered vs unbuffered, select statement." },
  { id: "go-2", career: "cloud-devops", language: "go", type: "conceptual", difficulty: "advanced", question: "How does Go handle memory management and garbage collection?", hint: "Concurrent mark-sweep, low latency, escape analysis, stack vs heap allocation." },
  { id: "go-3", career: "cloud-devops", language: "go", type: "conceptual", difficulty: "intermediate", question: "What are Go interfaces and how do they differ from Java/C# interfaces?", hint: "Implicit implementation, duck typing, empty interface, type assertions." },
  { id: "go-4", career: "cloud-devops", language: "go", type: "problem-solving", difficulty: "intermediate", question: "How would you handle errors idiomatically in Go?", hint: "Multiple return values, if err != nil, errors.Is/As, wrapping with %w, custom error types." },
  { id: "rust-1", career: "software-engineering", language: "rust", type: "conceptual", difficulty: "advanced", question: "Explain Rust's ownership model and the borrow checker.", hint: "Ownership transfer, borrowing rules (aliasing vs mutation), lifetimes, zero-cost abstraction." },
  { id: "rust-2", career: "software-engineering", language: "rust", type: "conceptual", difficulty: "intermediate", question: "What is the difference between `String` and `&str` in Rust?", hint: "Owned vs borrowed, heap vs anywhere, UTF-8, growth, slicing." },
  { id: "rust-3", career: "software-engineering", language: "rust", type: "conceptual", difficulty: "advanced", question: "Explain `Box`, `Rc`, and `Arc` in Rust — when do you use each?", hint: "Heap ownership, single-thread shared, multi-thread shared, RefCell/Mutex pairings." },
  { id: "swift-1", career: "mobile-dev", language: "swift", type: "conceptual", difficulty: "intermediate", question: "What are optionals in Swift and how do you safely unwrap them?", hint: "Optional enum, ! vs ?, optional binding, nil-coalescing, guard let vs if let." },
  { id: "swift-2", career: "mobile-dev", language: "swift", type: "conceptual", difficulty: "intermediate", question: "Explain Swift's struct vs class and when to use each.", hint: "Value vs reference type, copy semantics, mutating, ARC, thread safety." },
  { id: "swift-3", career: "mobile-dev", language: "swift", type: "conceptual", difficulty: "advanced", question: "What are Swift's property wrappers and give a practical example.", hint: "@State/@Binding/@AppStorage, reusable logic, projectedValue,wrappedValue." },
  { id: "kotlin-1", career: "mobile-dev", language: "kotlin", type: "conceptual", difficulty: "intermediate", question: "Explain Kotlin's null safety and the difference between `?` and `!!`.", hint: "Nullable types, safe call, non-null assertion, elvis operator, platform types from Java." },
  { id: "kotlin-2", career: "mobile-dev", language: "kotlin", type: "conceptual", difficulty: "intermediate", question: "What are Kotlin coroutines and how do they compare to RxJava?", hint: "Suspending functions, structured concurrency, Dispatchers, Flow vs Observable." },
  { id: "kotlin-3", career: "mobile-dev", language: "kotlin", type: "conceptual", difficulty: "beginner", question: "What is the difference between `val` and `var` in Kotlin?", hint: "Immutable vs mutable reference, similar to const/let, object properties matter." },
  { id: "php-1", career: "web-dev", language: "php", type: "conceptual", difficulty: "beginner", question: "What is Composer and how does it manage PHP dependencies?", hint: "PHP package manager, packagist.org, autoloading, semver, composer.lock." },
  { id: "php-2", career: "web-dev", language: "php", type: "conceptual", difficulty: "intermediate", question: "Explain PHP's type system and the difference between strict and coercive modes.", hint: "declare(strict_types=1), weak typing by default, union types (PHP 8), nullable." },
  { id: "ruby-1", career: "web-dev", language: "ruby", type: "conceptual", difficulty: "intermediate", question: "Explain the Ruby object model — everything is an object, including classes.", hint: "Class inheritance, mixins (modules), metaclass, method lookup chain." },
  { id: "ruby-2", career: "web-dev", language: "ruby", type: "conceptual", difficulty: "intermediate", question: "What are blocks, procs, and lambdas in Ruby? How do they differ?", hint: "Anonymous functions,Proc vs Lambda arity checking, &block, yield." },
  { id: "r-1", career: "data-science", language: "r", type: "conceptual", difficulty: "intermediate", question: "What is the tidyverse and how does it differ from base R?", hint: "dplyr/ggplot2/tidyr, pipe operator, consistent API, tidy data principles." },
  { id: "r-2", career: "data-science", language: "r", type: "conceptual", difficulty: "beginner", question: "Explain the difference between a vector, list, and data.frame in R.", hint: "Atomic vector, recursive list (heterogeneous), data.frame (list of equal-length vectors)." },
  { id: "dart-1", career: "mobile-dev", language: "dart", type: "conceptual", difficulty: "intermediate", question: "What is Dart's sound null safety and how does it differ from optional typing?", hint: "Non-nullable by default, ? for nullable, flow analysis, sound vs unsound." },
  { id: "dart-2", career: "mobile-dev", language: "dart", type: "conceptual", difficulty: "beginner", question: "Explain Flutter's widget tree and how StatefulWidgets differ from StatelessWidgets.", hint: "Immutable widgets, setState, build method, element tree, reconciliation." },
  { id: "bash-1", career: "cloud-devops", language: "bash", type: "conceptual", difficulty: "beginner", question: "What is the difference between a shell variable and an environment variable?", hint: "Local to shell vs inherited by child processes, export, .bashrc/.profile." },
  { id: "bash-2", career: "cloud-devops", language: "bash", type: "problem-solving", difficulty: "intermediate", question: "Write a bash script to find all .log files older than 30 days and compress them.", hint: "find -mtime +30 -name '*.log' -exec gzip {} \\;, log rotation, xargs." },
  { id: "bash-3", career: "cloud-devops", language: "bash", type: "code-review", difficulty: "intermediate", question: "Review: `for f in $(ls *.txt); do mv $f $f.bak; done` — what's wrong?", hint: "Parsing ls breaks on spaces/globs. Use for f in *.txt; do. Quote variables." },

  // ============================================================
  // Cloud / DevOps
  // ============================================================
  { id: "devops-1", career: "cloud-devops", language: "bash", type: "conceptual", difficulty: "beginner", question: "Explain the difference between a virtual machine and a container.", hint: "Hardware-level virtualization vs OS-level, hypervisor vs shared kernel, size/startup time." },
  { id: "devops-2", career: "cloud-devops", language: "bash", type: "conceptual", difficulty: "beginner", question: "What is CI/CD and why is it important?", hint: "Continuous integration / continuous delivery, automation, fast feedback, deployment frequency." },
  { id: "devops-3", career: "cloud-devops", language: "bash", type: "conceptual", difficulty: "beginner", question: "Explain what Docker does in simple terms.", hint: "Container runtime, images vs containers, layered filesystem, Dockerfile, registry." },
  { id: "devops-4", career: "cloud-devops", language: "bash", type: "conceptual", difficulty: "intermediate", question: "What is a Kubernetes Pod and how does it differ from a container?", hint: "Smallest deployable unit, one or more containers, shared network/storage, ephemeral." },
  { id: "devops-5", career: "cloud-devops", language: "bash", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between a Kubernetes Deployment, StatefulSet, and DaemonSet.", hint: "Stateless replicas vs stable identity/storage vs one-per-node, use cases." },
  { id: "devops-6", career: "cloud-devops", language: "bash", type: "conceptual", difficulty: "advanced", question: "How would you design a blue-green deployment strategy?", hint: "Two identical envs, switch traffic, instant rollback, cost overhead, database migrations." },
  { id: "devops-7", career: "cloud-devops", language: "bash", type: "conceptual", difficulty: "intermediate", question: "What is Infrastructure as Code (IaC)? Compare Terraform and CloudFormation.", hint: "Declarative infra, state files, drift detection, multi-cloud vs AWS-only." },
  { id: "devops-8", career: "cloud-devops", language: "bash", type: "problem-solving", difficulty: "intermediate", question: "How would you troubleshoot a slow production deployment?", hint: "Metrics/logs/traces, identify bottleneck (build/deploy/verify), parallelize, caching, rollback plan." },

  // ============================================================
  // Mobile Development
  // ============================================================
  { id: "mobile-1", career: "mobile-dev", language: "swift", type: "conceptual", difficulty: "intermediate", question: "Explain the iOS app lifecycle and the role of AppDelegate/SceneDelegate.", hint: "States (active/inactive/background), UIApplicationDelegate, multi-window (iOS 13+)." },
  { id: "mobile-2", career: "mobile-dev", language: "kotlin", type: "conceptual", difficulty: "intermediate", question: "Explain Android's activity lifecycle and the role of each callback.", hint: "onCreate/onStart/onResume/onPause/onStop/onDestroy, configuration changes, saved state." },
  { id: "mobile-3", career: "mobile-dev", language: "general", type: "conceptual", difficulty: "advanced", question: "Compare native, hybrid, and cross-platform mobile development. When would you choose each?", hint: "Performance/UI fidelity vs code reuse, React Native/Flutter, native modules." },
  { id: "mobile-4", career: "mobile-dev", language: "dart", type: "conceptual", difficulty: "intermediate", question: "How does Flutter achieve 60fps rendering? Explain the rendering pipeline.", hint: "Skia, GPU-accelerated, widget → element → renderobject → layer, no platform views." },

  // ============================================================
  // AI / ML / Data Science
  // ============================================================
  { id: "aiml-1", career: "ai-ml", language: "python", type: "conceptual", difficulty: "intermediate", question: "Explain the bias-variance tradeoff in machine learning.", hint: "Underfitting vs overfitting, model complexity, training vs validation error." },
  { id: "aiml-2", career: "ai-ml", language: "python", type: "conceptual", difficulty: "intermediate", question: "What is gradient descent and how does it differ from stochastic gradient descent?", hint: "Batch vs single sample, learning rate, convergence, mini-batch as compromise." },
  { id: "aiml-3", career: "ai-ml", language: "python", type: "conceptual", difficulty: "advanced", question: "Explain backpropagation in neural networks.", hint: "Chain rule, partial derivatives, forward pass, backward pass, weight updates." },
  { id: "aiml-4", career: "ai-ml", language: "python", type: "conceptual", difficulty: "intermediate", question: "What is the difference between supervised, unsupervised, and reinforcement learning?", hint: "Labeled data vs no labels vs rewards, classification vs clustering vs policy." },
  { id: "aiml-5", career: "ai-ml", language: "python", type: "conceptual", difficulty: "advanced", question: "Explain how Transformers work and why they revolutionized NLP.", hint: "Self-attention, positional encoding, parallel training, scaling laws, GPT/BERT." },
  { id: "aiml-6", career: "ai-ml", language: "python", type: "problem-solving", difficulty: "intermediate", question: "How would you handle an imbalanced classification dataset?", hint: "Resampling (SMOTE), class weights, different metrics (precision/recall/F1/ROC), stratified sampling." },
  { id: "aiml-7", career: "ai-ml", language: "python", type: "conceptual", difficulty: "advanced", question: "Explain the vanishing gradient problem and how LSTMs/ResNets address it.", hint: "Sigmoid saturation, long chains, gating mechanisms, skip connections." },

  // ============================================================
  // Cybersecurity
  // ============================================================
  { id: "security-1", career: "cybersecurity", language: "general", type: "conceptual", difficulty: "beginner", question: "Explain the CIA triad in information security.", hint: "Confidentiality, Integrity, Availability — examples of threats to each." },
  { id: "security-2", career: "cybersecurity", language: "general", type: "conceptual", difficulty: "intermediate", question: "What is SQL injection and how do you prevent it?", hint: "Unsanitized input, parameterized queries, ORM, least privilege, WAF." },
  { id: "security-3", career: "cybersecurity", language: "general", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between symmetric and asymmetric encryption.", hint: "Same key vs public/private pair, AES vs RSA, performance, key distribution." },
  { id: "security-4", career: "cybersecurity", language: "general", type: "conceptual", difficulty: "advanced", question: "What is a CSRF attack and how do you defend against it?", hint: "Cross-site request forgery, anti-CSRF tokens, SameSite cookies, origin checks." },
  { id: "security-5", career: "cybersecurity", language: "general", type: "conceptual", difficulty: "advanced", question: "Explain XSS (cross-site scripting) — types and prevention.", hint: "Stored/reflected/DOM, output encoding, CSP, HttpOnly cookies, sanitize inputs." },
  { id: "security-6", career: "cybersecurity", language: "general", type: "system-design", difficulty: "advanced", question: "Design an authentication system supporting OAuth2, MFA, and session management.", hint: "Authorization code flow, TOTP/SMS, JWT vs server sessions, refresh tokens, revocation." },

  // ============================================================
  // Game Development
  // ============================================================
  { id: "game-1", career: "game-dev", language: "general", type: "conceptual", difficulty: "intermediate", question: "Explain the game loop and why fixed vs variable timestep matters.", hint: "Update/render separation, deterministic physics, frame-rate independence." },
  { id: "game-2", career: "game-dev", language: "general", type: "conceptual", difficulty: "intermediate", question: "What is ECS (Entity-Component-System) architecture and why is it popular?", hint: "Composition over inheritance, data-oriented design, cache locality, parallelization." },
  { id: "game-3", career: "game-dev", language: "general", type: "problem-solving", difficulty: "advanced", question: "How would you implement collision detection for 10,000 objects efficiently?", hint: "Spatial partitioning (quadtree/grid/BVH), broad vs narrow phase, sweep-and-prune." },

  // ============================================================
  // Hardware / Embedded
  // ============================================================
  { id: "hardware-1", career: "hardware-embedded", language: "c", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between a microcontroller and a microprocessor.", hint: "CPU + RAM + I/O on one chip vs standalone CPU, cost/power/use cases." },
  { id: "hardware-2", career: "hardware-embedded", language: "c", type: "conceptual", difficulty: "advanced", question: "What is a real-time operating system (RTOS) and when would you use one?", hint: "Deterministic scheduling, priority inversion, FreeRTOS, hard vs soft real-time." },
  { id: "hardware-3", career: "hardware-embedded", language: "c", type: "problem-solving", difficulty: "intermediate", question: "How do you debug an embedded system without a debugger?", hint: "Serial logging, GPIO toggling, oscilloscope, JTAG, SWD, in-circuit emulation." },

  // ============================================================
  // Behavioral — General
  // ============================================================
  { id: "behavioral-1", career: "software-engineering", language: "general", type: "behavioral", difficulty: "beginner", question: "Tell me about a time you debugged a difficult problem. Walk me through your process.", hint: "STAR format, isolation techniques, root cause, what you learned, prevention." },
  { id: "behavioral-2", career: "software-engineering", language: "general", type: "behavioral", difficulty: "beginner", question: "How do you approach learning a new programming language or framework?", hint: "Project-based learning, official docs, mental models, deliberate practice." },
  { id: "behavioral-3", career: "software-engineering", language: "general", type: "behavioral", difficulty: "intermediate", question: "Describe a project you're proud of and what technical decisions you made.", hint: "Trade-offs, alternatives considered, what you'd do differently, impact metrics." },
  { id: "behavioral-4", career: "software-engineering", language: "general", type: "behavioral", difficulty: "intermediate", question: "Tell me about a time you disagreed with a teammate on a technical decision.", hint: "Empathy, data-driven discussion, compromise, outcome, professional growth." },
  { id: "behavioral-5", career: "software-engineering", language: "general", type: "behavioral", difficulty: "intermediate", question: "Describe a time you had to learn a complex codebase quickly. What was your strategy?", hint: "Documentation, pair programming, tracing execution, writing tests, asking questions." },
  { id: "behavioral-6", career: "software-engineering", language: "general", type: "behavioral", difficulty: "intermediate", question: "Tell me about a time you missed a deadline. How did you handle it?", hint: "Early communication, scope negotiation, postmortem, prevention, accountability." },
  { id: "behavioral-7", career: "software-engineering", language: "general", type: "behavioral", difficulty: "advanced", question: "Describe a time you had to give difficult feedback to a peer or junior.", hint: "Specific examples, impact-focused, actionable suggestions, empathy, follow-up." },
  { id: "behavioral-8", career: "software-engineering", language: "general", type: "behavioral", difficulty: "advanced", question: "Tell me about a time you championed a technical change. How did you get buy-in?", hint: "Data, prototype, stakeholders, pilot, gradual rollout, address concerns." },
  { id: "behavioral-9", career: "software-engineering", language: "general", type: "behavioral", difficulty: "intermediate", question: "How do you balance shipping fast with code quality?", hint: "MVP, tech debt tracking, refactoring sprints, code review, automated tests." },
  { id: "behavioral-10", career: "software-engineering", language: "general", type: "behavioral", difficulty: "intermediate", question: "Describe a time you had to work with a difficult teammate.", hint: "Empathy, focus on work not personality, set boundaries, escalate if needed." },

  // ============================================================
  // System Design — Advanced
  // ============================================================
  { id: "sysdesign-1", career: "software-engineering", language: "general", type: "system-design", difficulty: "advanced", question: "How would you design a URL shortener like bit.ly?", hint: "Requirements, encoding (base62), collision handling, redirects (301 vs 302), analytics, caching, scaling." },
  { id: "sysdesign-2", career: "software-engineering", language: "general", type: "system-design", difficulty: "advanced", question: "Walk me through how you'd design the backend for a messaging app.", hint: "WebSocket vs polling, message ordering, delivery guarantees, presence, scaling, storage." },
  { id: "sysdesign-3", career: "software-engineering", language: "general", type: "system-design", difficulty: "advanced", question: "Design a rate limiter that allows 100 requests per minute per user.", hint: "Token bucket vs sliding window, Redis, distributed coordination, eventual consistency." },
  { id: "sysdesign-4", career: "software-engineering", language: "general", type: "system-design", difficulty: "advanced", question: "How would you design Twitter's news feed?", hint: "Fan-out on write vs read, caching, ranking algorithm, celebrity problem, real-time updates." },
  { id: "sysdesign-5", career: "software-engineering", language: "general", type: "system-design", difficulty: "advanced", question: "Design a distributed cache. How do you handle cache invalidation?", hint: "Write-through/write-behind, TTL, LRU eviction, consistency, cache stampede, consistent hashing." },
  { id: "sysdesign-6", career: "software-engineering", language: "general", type: "system-design", difficulty: "advanced", question: "How would you design a key-value store like Redis?", hint: "In-memory, persistence (AOF/RDB), replication, clustering, eviction policies." },
  { id: "sysdesign-7", career: "software-engineering", language: "general", type: "system-design", difficulty: "advanced", question: "Design a notification system that delivers across email, SMS, and push.", hint: "Queue-based, provider abstraction, retry/backoff, user preferences, deduplication." },
  { id: "sysdesign-8", career: "software-engineering", language: "general", type: "system-design", difficulty: "advanced", question: "How would you design a distributed job scheduler?", hint: "Cron vs event-driven, leader election, at-least-once semantics, idempotency, dead-letter queue." },
  { id: "sysdesign-9", career: "software-engineering", language: "general", type: "system-design", difficulty: "advanced", question: "Design a video streaming service like Netflix.", hint: "CDN, adaptive bitrate, transcoding, DRM, pre-fetching, A/B testing." },
  { id: "sysdesign-10", career: "software-engineering", language: "general", type: "system-design", difficulty: "advanced", question: "How would you design Google Drive's file sync system?", hint: "Chunking, content-addressable storage, conflict resolution, delta sync, offline." },

  // ============================================================
  // Code Review — Cross-language
  // ============================================================
  { id: "review-1", career: "software-engineering", language: "general", type: "code-review", difficulty: "intermediate", question: "What do you look for when reviewing a teammate's pull request?", hint: "Correctness, tests, readability, performance, security, edge cases, scope." },
  { id: "review-2", career: "software-engineering", language: "general", type: "code-review", difficulty: "intermediate", question: "Review this API design: `POST /users/{id}/delete` vs `DELETE /users/{id}` — which is better and why?", hint: "REST conventions, idempotency, HTTP semantics, tooling, cache behavior." },
  { id: "review-3", career: "software-engineering", language: "general", type: "code-review", difficulty: "advanced", question: "Review: a function that catches all exceptions and returns null. Issues?", hint: "Swallows errors, hides bugs, harder to debug, prefer specific exceptions, logging." },
  { id: "review-4", career: "software-engineering", language: "general", type: "code-review", difficulty: "advanced", question: "Review: storing passwords in plain text in a database. What's wrong and how should you do it?", hint: "Bcrypt/argon2, salt, pepper, timing attacks, breaches, OWASP." },

  // ============================================================
  // Testing — General
  // ============================================================
  { id: "testing-1", career: "software-engineering", language: "general", type: "conceptual", difficulty: "beginner", question: "Explain the difference between unit, integration, and end-to-end tests.", hint: "Test pyramid, isolation, speed, cost, confidence, when to use each." },
  { id: "testing-2", career: "software-engineering", language: "general", type: "conceptual", difficulty: "intermediate", question: "What is test-driven development (TDD)? Pros and cons?", hint: "Red-green-refactor, design feedback, regression safety, slower initial pace." },
  { id: "testing-3", career: "software-engineering", language: "general", type: "problem-solving", difficulty: "intermediate", question: "How would you test a function that depends on the current date?", hint: "Dependency injection, mock Date.now, time-machine libraries, deterministic tests." },
  { id: "testing-4", career: "software-engineering", language: "general", type: "conceptual", difficulty: "intermediate", question: "What is mocking and when should you use it? When should you avoid it?", hint: "Replace dependencies, isolate units, over-mocking leads to brittle tests." },

  // ============================================================
  // Git / Version Control
  // ============================================================
  { id: "git-1", career: "software-engineering", language: "general", type: "conceptual", difficulty: "beginner", question: "Explain the difference between `git merge` and `git rebase`.", hint: "Preserves history vs linear history, merge commits, force push, golden rule of rebase." },
  { id: "git-2", career: "software-engineering", language: "general", type: "conceptual", difficulty: "intermediate", question: "What is `git cherry-pick` and when would you use it?", hint: "Apply specific commit, hotfixes, backporting, conflict potential." },
  { id: "git-3", career: "software-engineering", language: "general", type: "problem-solving", difficulty: "intermediate", question: "How do you undo a `git push`? Walk through your options.", hint: "git revert (safe) vs git push --force (dangerous), public history implications." },

  // ============================================================
  // Data Structures & Algorithms
  // ============================================================
  { id: "dsa-1", career: "software-engineering", language: "general", type: "problem-solving", difficulty: "beginner", question: "Reverse a linked list. Explain your approach.", hint: "Iterative (3 pointers) vs recursive. Time O(n), space O(1) vs O(n)." },
  { id: "dsa-2", career: "software-engineering", language: "general", type: "problem-solving", difficulty: "intermediate", question: "Implement a LRU cache with O(1) get and put operations.", hint: "HashMap + doubly-linked list, move-to-front on access, evict tail." },
  { id: "dsa-3", career: "software-engineering", language: "general", type: "problem-solving", difficulty: "intermediate", question: "Given an array of integers, find two numbers that sum to a target. Multiple approaches?", hint: "Brute O(n²), sort+two-pointer O(n log n), hash map O(n). Trade-offs." },
  { id: "dsa-4", career: "software-engineering", language: "general", type: "problem-solving", difficulty: "advanced", question: "Implement Dijkstra's algorithm for shortest paths. Time complexity?", hint: "Priority queue, O((V+E) log V), negative weights limitation, A* comparison." },
  { id: "dsa-5", career: "software-engineering", language: "general", type: "problem-solving", difficulty: "intermediate", question: "Detect a cycle in a linked list. Can you do it in O(1) space?", hint: "Floyd's tortoise and hare, slow+fast pointers, finding cycle start." },
  { id: "dsa-6", career: "software-engineering", language: "general", type: "problem-solving", difficulty: "advanced", question: "Solve the 'trapping rain water' problem. Explain multiple approaches.", hint: "Two-pointer O(n) O(1), DP with prefix/suffix max O(n) O(n), monotonic stack." },
  { id: "dsa-7", career: "software-engineering", language: "general", type: "conceptual", difficulty: "intermediate", question: "When would you use a hash table vs a balanced BST?", hint: "O(1) vs O(log n), ordering, range queries, worst-case hash collisions." },
  { id: "dsa-8", career: "software-engineering", language: "general", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between BFS and DFS. When would you use each?", hint: "Queue vs stack, shortest path vs memory, level-order vs pre/post/in-order." },

  // ============================================================
  // Web Performance & Browser
  // ============================================================
  { id: "perf-1", career: "web-dev", language: "general", type: "conceptual", difficulty: "intermediate", question: "What are Core Web Vitals and why do they matter?", hint: "LCP, INP, CLS. User experience, SEO ranking, measurement, targets." },
  { id: "perf-2", career: "web-dev", language: "general", type: "conceptual", difficulty: "intermediate", question: "Explain how browser rendering works — from URL to painted pixels.", hint: "DNS/TCP/TLS, HTML parse, CSSOM, render tree, layout, paint, composite." },
  { id: "perf-3", career: "web-dev", language: "general", type: "problem-solving", difficulty: "intermediate", question: "How would you optimize a slow-loading web page?", hint: "Measure first (Lighthouse), code-split, lazy-load, cache, CDN, image optimization, reduce JS." },
  { id: "perf-4", career: "web-dev", language: "general", type: "conceptual", difficulty: "advanced", question: "What is the Critical Rendering Path and how do you optimize it?", hint: "Blocking CSS/JS, preload critical resources, defer non-critical, inline critical CSS." },

  // ============================================================
  // API Design
  // ============================================================
  { id: "api-1", career: "software-engineering", language: "general", type: "conceptual", difficulty: "intermediate", question: "What is REST and what are its core principles?", hint: "Stateless, resources, HTTP verbs, URIs, HATEOAS, status codes." },
  { id: "api-2", career: "software-engineering", language: "general", type: "conceptual", difficulty: "intermediate", question: "REST vs GraphQL vs gRPC — when would you choose each?", hint: "Resource-based vs schema-driven vs binary protocol, payload size, streaming." },
  { id: "api-3", career: "software-engineering", language: "general", type: "conceptual", difficulty: "advanced", question: "How do you design API versioning? Compare strategies.", hint: "URL path (/v1/), header, query param, content negotiation. Breaking changes." },
  { id: "api-4", career: "software-engineering", language: "general", type: "problem-solving", difficulty: "intermediate", question: "How do you handle pagination in a REST API? Pros and cons of each approach.", hint: "Offset/limit, cursor-based, keyset, total count, performance at scale." },
  { id: "api-5", career: "software-engineering", language: "general", type: "system-design", difficulty: "advanced", question: "Design a webhook system for an API platform.", hint: "Signing, retries with exponential backoff, dead-letter, idempotency keys, observability." },

  // ============================================================
  // Concurrency
  // ============================================================
  { id: "conc-1", career: "software-engineering", language: "general", type: "conceptual", difficulty: "intermediate", question: "What is a race condition? Give an example and how to prevent it.", hint: "Shared mutable state, atomic operations, locks, mutexes, compare-and-swap." },
  { id: "conc-2", career: "software-engineering", language: "general", type: "conceptual", difficulty: "advanced", question: "Explain deadlock conditions and how to prevent them.", hint: "Coffman conditions: mutual exclusion, hold-and-wait, no preemption, circular wait." },
  { id: "conc-3", career: "software-engineering", language: "general", type: "problem-solving", difficulty: "intermediate", question: "Implement a thread-safe producer-consumer queue.", hint: "Blocking queue, condition variables, semaphores, bounded buffer." },
  { id: "conc-4", career: "software-engineering", language: "general", type: "conceptual", difficulty: "advanced", question: "What is the difference between a mutex and a semaphore?", hint: "Ownership vs counting, binary semaphore ≈ mutex, signaling vs locking." },
];

/**
 * Get all questions matching a given filter.
 */
export function filterQuestions(opts: {
  career?: string;
  language?: string;
  type?: QuestionType;
  difficulty?: QuestionDifficulty;
}): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => {
    if (opts.career && q.career !== opts.career && q.career !== "general") return false;
    if (opts.language && q.language !== opts.language && q.language !== "general") return false;
    if (opts.type && q.type !== opts.type) return false;
    if (opts.difficulty && q.difficulty !== opts.difficulty) return false;
    return true;
  });
}

/**
 * Deterministic shuffle using a seed — used so two consecutive interview
 * sessions with the same seed don't pick the same questions.
 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed >>> 0 || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick N questions matching the user's profile.
 * Returns questions spread across types and difficulties.
 * Uses a deterministic seed (Date.now()) so two consecutive sessions differ.
 */
export function pickInterviewQuestions(opts: {
  career: string;
  languages: string[];
  count: number;
  difficulty: QuestionDifficulty;
}): InterviewQuestion[] {
  // First, get questions for the user's languages
  let pool = INTERVIEW_QUESTIONS.filter((q) => {
    if (q.difficulty !== opts.difficulty) {
      // Allow easier questions to be included when targeting harder difficulty
      if (opts.difficulty === "advanced" && q.difficulty === "intermediate") return true;
      if (opts.difficulty === "intermediate" && q.difficulty === "beginner") return true;
      return false;
    }
    return true;
  });

  // Filter by career or language match
  const matched = pool.filter((q) =>
    q.career === opts.career ||
    q.career === "general" ||
    opts.languages.includes(q.language) ||
    q.language === "general",
  );

  // If not enough, use the full pool
  if (matched.length < opts.count) {
    pool = pool.filter((q) => !matched.includes(q));
    return [...matched, ...pool].slice(0, opts.count);
  }

  // Deterministic shuffle so two sessions in a row pick different questions
  const seed = Date.now() & 0xffffffff;
  const shuffled = seededShuffle(matched, seed);
  return shuffled.slice(0, opts.count);
}

/**
 * Build the interview system prompt for the AI.
 * Per Section 4.3 of Prompt-2-updated.txt.
 */
export function buildInterviewSystemPrompt(opts: {
  career: string;
  languages: string[];
  skillLevel: string;
  count: number;
  seedQuestions: InterviewQuestion[];
}): string {
  const langList = opts.languages.join(", ");
  // Escape any backticks or ${ in question text so the prompt template stays valid
  const escapeForTemplate = (s: string) => s.replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  const seedList = opts.seedQuestions
    .map((q, i) => `${i + 1}. [${q.difficulty}/${q.type}] ${escapeForTemplate(q.question)}`)
    .join("\n");

  return `You are a senior technical interviewer at a top tech company. You are conducting a mock technical interview for a candidate applying for a ${opts.career} role who knows ${langList}.
Their skill level is ${opts.skillLevel}.

INTERVIEW RULES:
1. Ask ONE question at a time. Wait for the candidate's full answer before asking the next.
2. After each answer, give honest, constructive feedback (3-5 sentences): what was good, what was missing, what an ideal answer would have included.
3. Then say "Ready for the next question?" before proceeding.
4. Start with easier questions and gradually increase difficulty.
5. Include a mix of: conceptual questions, "explain this code" questions, problem-solving questions, and behavioral questions.
6. Keep feedback professional but warm. Be encouraging but honest — this is practice.
7. At the end (after all ${opts.count} questions), give an overall summary score (1-10) and 3 specific areas to study before their real interview.
8. Use code blocks (triple backtick) whenever showing code.
9. Never break character. Always act as an interviewer.

Here is a pool of ${opts.seedQuestions.length} curated questions you can draw from. You don't have to use them verbatim — adapt them or ask follow-ups based on the candidate's answers. Feel free to add your own questions on related topics:

${seedList}

Begin by introducing yourself briefly and asking the first question.`;
}
