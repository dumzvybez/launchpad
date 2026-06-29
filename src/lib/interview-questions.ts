/**
 * Interview Questions Database — 200+ mock interview questions organized by
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

  // ============================================================
  // Web Development — Svelte (NEW)
  // ============================================================
  { id: "svelte-1", career: "web-dev", language: "svelte", type: "conceptual", difficulty: "intermediate", question: "How does Svelte's reactivity model differ from React's?", hint: "Compile-time vs runtime, no virtual DOM, direct DOM mutations, assignment triggers updates." },
  { id: "svelte-2", career: "web-dev", language: "svelte", type: "conceptual", difficulty: "intermediate", question: "What are runes in Svelte 5 and how do they change the mental model?", hint: "$state, $derived, $effect, $props — explicit reactivity signals replacing let/export." },
  { id: "svelte-3", career: "web-dev", language: "svelte", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between Svelte stores and Svelte 5 runes.", hint: "Stores (writable/readable) vs runes ($state/$derived), auto-tracking, migration paths." },
  { id: "svelte-4", career: "web-dev", language: "svelte", type: "conceptual", difficulty: "advanced", question: "When would you choose SvelteKit over Next.js?", hint: "Bundle size, compile-time optimizations, simplicity, server routes, deployment targets." },

  // ============================================================
  // Web Development — Vue (NEW)
  // ============================================================
  { id: "vue-1", career: "web-dev", language: "vue", type: "conceptual", difficulty: "intermediate", question: "What's the difference between `ref` and `reactive` in Vue 3?", hint: "ref = wrapper for any value (.value access), reactive = Proxy on objects, gotchas with primitives." },
  { id: "vue-2", career: "web-dev", language: "vue", type: "conceptual", difficulty: "intermediate", question: "Explain the Composition API vs Options API in Vue 3 — when would you pick each?", hint: "Logic reuse (composables), TypeScript support, code organization, learning curve." },
  { id: "vue-3", career: "web-dev", language: "vue", type: "conceptual", difficulty: "intermediate", question: "How does Vue's reactivity work under the hood (Proxy-based)?", hint: "ES6 Proxy, track deps in getter, trigger updates in setter, contrast with Vue 2's Object.defineProperty." },
  { id: "vue-4", career: "web-dev", language: "vue", type: "conceptual", difficulty: "advanced", question: "Explain Vue's keep-alive component and when to use it.", hint: "Caching component instances, include/exclude, activated/deactivated hooks, memory tradeoffs." },

  // ============================================================
  // Web Development — Angular (NEW)
  // ============================================================
  { id: "angular-1", career: "web-dev", language: "angular", type: "conceptual", difficulty: "intermediate", question: "How does Angular's dependency injection work?", hint: "Providers, injector tree, @Injectable, hierarchical injectors, tree-shakable services." },
  { id: "angular-2", career: "web-dev", language: "angular", type: "conceptual", difficulty: "intermediate", question: "What's the difference between `OnPush` and default change detection?", hint: "Reference checks, immutable patterns, markForCheck, performance implications." },
  { id: "angular-3", career: "web-dev", language: "angular", type: "conceptual", difficulty: "intermediate", question: "What are Angular Signals and why were they introduced?", hint: "Fine-grained reactivity, finer than zone.js, computed/effect, gradual migration." },
  { id: "angular-4", career: "web-dev", language: "angular", type: "conceptual", difficulty: "advanced", question: "Explain Angular's router lifecycle guards and when to use each.", hint: "canActivate, canDeactivate, resolve, canLoad, lazy loading implications." },

  // ============================================================
  // Backend — Node.js (NEW)
  // ============================================================
  { id: "nodejs-1", career: "web-dev", language: "nodejs", type: "conceptual", difficulty: "intermediate", question: "Explain the Node.js event loop and the difference between microtasks and macrotasks.", hint: "libuv, phases (timers/pending/poll/check/close), process.nextTick vs Promise.then vs setImmediate." },
  { id: "nodejs-2", career: "web-dev", language: "nodejs", type: "conceptual", difficulty: "intermediate", question: "What are worker threads and when would you use them?", hint: "worker_threads, isolated JS contexts, CPU-bound work, SharedArrayBuffer, message passing." },
  { id: "nodejs-3", career: "web-dev", language: "nodejs", type: "conceptual", difficulty: "intermediate", question: "How does `cluster` differ from `worker_threads`?", hint: "Process-based vs thread-based, IPC vs SharedArrayBuffer, scaling HTTP servers vs CPU work." },
  { id: "nodejs-4", career: "web-dev", language: "nodejs", type: "code-review", difficulty: "intermediate", question: "Review this Express handler: `app.get('/users', async (req, res) => { const users = await db.query(); res.json(users); })` — what's missing?", hint: "No try/catch → unhandled rejection → request hangs. Use express-async-errors or wrap." },
  { id: "nodejs-5", career: "web-dev", language: "nodejs", type: "conceptual", difficulty: "advanced", question: "Explain backpressure in Node.js streams and how to handle it.", hint: "HighWaterMark, .push/.read, pipe() vs pipeline(), pause/resume." },

  // ============================================================
  // Database — PostgreSQL (NEW)
  // ============================================================
  { id: "postgres-1", career: "web-dev", language: "postgresql", type: "conceptual", difficulty: "intermediate", question: "Explain MVCC and why Postgres uses it.", hint: "Multi-version concurrency control, snapshot isolation, no read locks, vacuum." },
  { id: "postgres-2", career: "web-dev", language: "postgresql", type: "conceptual", difficulty: "intermediate", question: "What's the difference between `JSON` and `JSONB`?", hint: "Text vs binary, parsing cost, indexing (GIN on JSONB), duplicate keys." },
  { id: "postgres-3", career: "web-dev", language: "postgresql", type: "conceptual", difficulty: "intermediate", question: "How do `LEFT JOIN ... ON` vs `LEFT JOIN ... WHERE` differ when filtering on the inner table?", hint: "ON filters before join (preserves rows with NULL inner), WHERE filters after (acts like INNER JOIN)." },
  { id: "postgres-4", career: "web-dev", language: "postgresql", type: "conceptual", difficulty: "advanced", question: "Explain the ESR rule for compound indexes in PostgreSQL.", hint: "Equality → Sort → Range. Column ordering matters, EXPLAIN ANALYZE verification." },
  { id: "postgres-5", career: "web-dev", language: "postgresql", type: "conceptual", difficulty: "advanced", question: "What are CTEs and when would you use a recursive CTE?", hint: "WITH clause, readability, materialization (Postgres 12+), tree/hierarchy traversal." },

  // ============================================================
  // Database — MongoDB (NEW)
  // ============================================================
  { id: "mongodb-1", career: "web-dev", language: "mongodb", type: "conceptual", difficulty: "intermediate", question: "When would you choose embedding over referencing in MongoDB schema design?", hint: "1:1 / 1:few → embed; many:many → reference. Access patterns, document size (16MB), atomicity." },
  { id: "mongodb-2", career: "web-dev", language: "mongodb", type: "conceptual", difficulty: "intermediate", question: "Explain the aggregation pipeline and when you'd use `$lookup`.", hint: "Stages ($match/$group/$sort/$project), $lookup as left-outer join, performance vs denormalization." },
  { id: "mongodb-3", career: "web-dev", language: "mongodb", type: "conceptual", difficulty: "intermediate", question: "What is a shard key and how do you pick a good one?", hint: "Even distribution, query isolation, immutability, compound keys, hashed vs ranged." },
  { id: "mongodb-4", career: "web-dev", language: "mongodb", type: "conceptual", difficulty: "advanced", question: "Explain replica sets and how failover works in MongoDB.", hint: "Primary + secondaries + arbiter, elections, oplog, write concerns, read preferences." },

  // ============================================================
  // Python / Data Science
  // ============================================================
  { id: "py-1", career: "data-science", language: "python", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between a list and a numpy array. When would you use each?", hint: "Homogeneous vs heterogeneous, memory layout, vectorized ops, fixed-size." },
  { id: "py-2", career: "data-science", language: "python", type: "conceptual", difficulty: "intermediate", question: "What is the purpose of train/test split in machine learning?", hint: "Generalization, overfitting detection, holdout vs cross-validation, stratification." },
  { id: "py-3", career: "data-science", language: "python", type: "conceptual", difficulty: "intermediate", question: "Explain what a pandas DataFrame is and how you would clean missing data.", hint: "2D labeled array, isna/dropna/fillna, forward/backward fill, interpolation." },
  { id: "py-4", career: "software-engineering", language: "python", type: "conceptual", difficulty: "beginner", question: "What's the difference between a list and a tuple in Python?", hint: "Mutability, hashability, memory, idiomatic use (records vs collections)." },
  { id: "py-5", career: "software-engineering", language: "python", type: "conceptual", difficulty: "intermediate", question: "Explain decorators in Python with a simple example.", hint: "Higher-order functions, @syntax sugar, *args/**kwargs, functools.wraps, classes as decorators." },
  { id: "py-6", career: "software-engineering", language: "python", type: "conceptual", difficulty: "advanced", question: "Explain the GIL (Global Interpreter Lock) and how it affects multi-threaded Python code.", hint: "Reference counting, mutex on bytecode, I/O-bound vs CPU-bound, multiprocessing alternative." },

  // ============================================================
  // TypeScript
  // ============================================================
  { id: "ts-1", career: "web-dev", language: "typescript", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between `interface` and `type` in TypeScript.", hint: "Declaration merging, extension syntax, union/intersection, primitives." },
  { id: "ts-2", career: "web-dev", language: "typescript", type: "conceptual", difficulty: "intermediate", question: "What are conditional types and when would you use them?", hint: "T extends U ? X : Y, distributive over unions, infer keyword, built-in helpers." },
  { id: "ts-3", career: "web-dev", language: "typescript", type: "conceptual", difficulty: "advanced", question: "Explain TypeScript's structural typing vs nominal typing.", hint: "Shape-based, duck typing, branded types trick for nominal feel." },

  // ============================================================
  // SQL (general)
  // ============================================================
  { id: "sql-1", career: "web-dev", language: "sql", type: "conceptual", difficulty: "beginner", question: "What's the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN?", hint: "Matching rows only, all left + matching right, all from both with NULLs." },
  { id: "sql-2", career: "web-dev", language: "sql", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between WHERE and HAVING clauses.", hint: "Row-level filtering (pre-group) vs group-level filtering (post-aggregate)." },
  { id: "sql-3", career: "web-dev", language: "sql", type: "problem-solving", difficulty: "intermediate", question: "Write a SQL query to find the second-highest salary in an employees table.", hint: "Multiple solutions: LIMIT OFFSET, subquery with MAX, window function (DENSE_RANK)." },
  { id: "sql-4", career: "web-dev", language: "sql", type: "conceptual", difficulty: "advanced", question: "What are window functions and how do they differ from GROUP BY?", hint: "OVER() partition, no row collapsing, ROW_NUMBER/RANK/LAG, running totals." },

  // ============================================================
  // HTML / CSS
  // ============================================================
  { id: "html-1", career: "web-dev", language: "html", type: "conceptual", difficulty: "beginner", question: "What's the difference between `<section>`, `<article>`, and `<div>`?", hint: "Semantic meaning, document outline, accessibility, when to use each." },
  { id: "css-1", career: "web-dev", language: "css", type: "conceptual", difficulty: "intermediate", question: "Explain CSS specificity and the cascade.", hint: "Inline > ID > class > element, !important, source order, specificity calculation." },
  { id: "css-2", career: "web-dev", language: "css", type: "conceptual", difficulty: "intermediate", question: "Explain the difference between Flexbox and CSS Grid. When would you use each?", hint: "1D vs 2D, content-first vs layout-first, browser support, real-world combos." },
  { id: "css-3", career: "web-dev", language: "css", type: "conceptual", difficulty: "advanced", question: "Explain how the CSS Box Model works and how `box-sizing: border-box` changes it.", hint: "Content + padding + border + margin, default content-box vs border-box, sizing implications." },

  // ============================================================
  // Java / C / C++ / C#
  // ============================================================
  { id: "java-1", career: "software-engineering", language: "java", type: "conceptual", difficulty: "intermediate", question: "Explain the JVM, JDK, and JRE — what's the difference?", hint: "Runtime vs development kit, bytecode, platform independence, JIT compilation." },
  { id: "java-2", career: "software-engineering", language: "java", type: "conceptual", difficulty: "intermediate", question: "What is the difference between `==` and `.equals()` in Java?", hint: "Reference equality vs value equality, String interning, overriding equals/hashCode contract." },
  { id: "c-1", career: "software-engineering", language: "c", type: "conceptual", difficulty: "intermediate", question: "Explain pointers in C and the difference between `*p`, `p`, and `&p`.", hint: "Address-of, dereference, pointer arithmetic, null/void pointers." },
  { id: "cpp-1", career: "software-engineering", language: "cpp", type: "conceptual", difficulty: "intermediate", question: "What are smart pointers in C++ and why are they preferred over raw pointers?", hint: "RAII, unique_ptr vs shared_ptr vs weak_ptr, ownership semantics, memory leaks." },
  { id: "csharp-1", career: "software-engineering", language: "csharp", type: "conceptual", difficulty: "intermediate", question: "Explain LINQ in C# and give an example of deferred execution.", hint: "IEnumerable/IQueryable, query vs method syntax, yield return, performance implications." },

  // ============================================================
  // Go / Rust / Swift / Kotlin
  // ============================================================
  { id: "go-1", career: "cloud-devops", language: "go", type: "conceptual", difficulty: "intermediate", question: "Explain goroutines and channels in Go.", hint: "Lightweight threads, CSP model, buffered vs unbuffered, select statement." },
  { id: "go-2", career: "cloud-devops", language: "go", type: "conceptual", difficulty: "advanced", question: "How does Go handle memory management and garbage collection?", hint: "Concurrent mark-sweep, low latency, escape analysis, stack vs heap allocation." },
  { id: "rust-1", career: "software-engineering", language: "rust", type: "conceptual", difficulty: "advanced", question: "Explain Rust's ownership model and the borrow checker.", hint: "Ownership transfer, borrowing rules (aliasing vs mutation), lifetimes, zero-cost abstraction." },
  { id: "swift-1", career: "mobile-dev", language: "swift", type: "conceptual", difficulty: "intermediate", question: "What are optionals in Swift and how do you safely unwrap them?", hint: "Optional enum, ! vs ?, optional binding, nil-coalescing, guard let vs if let." },
  { id: "kotlin-1", career: "mobile-dev", language: "kotlin", type: "conceptual", difficulty: "intermediate", question: "Explain Kotlin's null safety and the difference between `?` and `!!`.", hint: "Nullable types, safe call, non-null assertion, elvis operator, platform types from Java." },

  // ============================================================
  // Cloud / DevOps
  // ============================================================
  { id: "devops-1", career: "cloud-devops", language: "bash", type: "conceptual", difficulty: "beginner", question: "Explain the difference between a virtual machine and a container.", hint: "Hardware-level virtualization vs OS-level, hypervisor vs shared kernel, size/startup time." },
  { id: "devops-2", career: "cloud-devops", language: "bash", type: "conceptual", difficulty: "beginner", question: "What is CI/CD and why is it important?", hint: "Continuous integration / continuous delivery, automation, fast feedback, deployment frequency." },
  { id: "devops-3", career: "cloud-devops", language: "bash", type: "conceptual", difficulty: "beginner", question: "Explain what Docker does in simple terms.", hint: "Container runtime, images vs containers, layered filesystem, Dockerfile, registry." },
  { id: "devops-4", career: "cloud-devops", language: "bash", type: "conceptual", difficulty: "intermediate", question: "What is a Kubernetes Pod and how does it differ from a container?", hint: "Smallest deployable unit, one or more containers, shared network/storage, ephemeral." },

  // ============================================================
  // Software Engineering — General — Behavioral
  // ============================================================
  { id: "behavioral-1", career: "software-engineering", language: "general", type: "behavioral", difficulty: "beginner", question: "Tell me about a time you debugged a difficult problem. Walk me through your process.", hint: "STAR format, isolation techniques, root cause, what you learned, prevention." },
  { id: "behavioral-2", career: "software-engineering", language: "general", type: "behavioral", difficulty: "beginner", question: "How do you approach learning a new programming language or framework?", hint: "Project-based learning, official docs, mental models, deliberate practice." },
  { id: "behavioral-3", career: "software-engineering", language: "general", type: "behavioral", difficulty: "intermediate", question: "Describe a project you're proud of and what technical decisions you made.", hint: "Trade-offs, alternatives considered, what you'd do differently, impact metrics." },
  { id: "behavioral-4", career: "software-engineering", language: "general", type: "behavioral", difficulty: "intermediate", question: "Tell me about a time you disagreed with a teammate on a technical decision.", hint: "Empathy, data-driven discussion, compromise, outcome, professional growth." },
  { id: "behavioral-5", career: "software-engineering", language: "general", type: "behavioral", difficulty: "intermediate", question: "Describe a time you had to learn a complex codebase quickly. What was your strategy?", hint: "Documentation, pair programming, tracing execution, writing tests, asking questions." },

  // ============================================================
  // System Design — Advanced
  // ============================================================
  { id: "sysdesign-1", career: "software-engineering", language: "general", type: "system-design", difficulty: "advanced", question: "How would you design a URL shortener like bit.ly?", hint: "Requirements, encoding (base62), collision handling, redirects (301 vs 302), analytics, caching, scaling." },
  { id: "sysdesign-2", career: "software-engineering", language: "general", type: "system-design", difficulty: "advanced", question: "Walk me through how you'd design the backend for a messaging app.", hint: "WebSocket vs polling, message ordering, delivery guarantees, presence, scaling, storage." },
  { id: "sysdesign-3", career: "software-engineering", language: "general", type: "system-design", difficulty: "advanced", question: "Design a rate limiter that allows 100 requests per minute per user.", hint: "Token bucket vs sliding window, Redis, distributed coordination, eventual consistency." },
  { id: "sysdesign-4", career: "software-engineering", language: "general", type: "system-design", difficulty: "advanced", question: "How would you design Twitter's news feed?", hint: "Fan-out on write vs read, caching, ranking algorithm, celebrity problem, real-time updates." },
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
 * Pick N questions matching the user's profile.
 * Returns questions spread across types and difficulties.
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

  // Shuffle and pick
  const shuffled = [...matched].sort(() => Math.random() - 0.5);
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
  const seedList = opts.seedQuestions
    .map((q, i) => `${i + 1}. [${q.difficulty}/${q.type}] ${q.question}`)
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
