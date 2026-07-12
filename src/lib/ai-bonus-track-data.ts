// ============================================================
// ai-bonus-track-data.ts — v5.932
//
// Research-backed AI Bonus Track content for every career path.
// SOLE SOURCE: "Consolidated AI Tools and Industry Practices Career
// Guide 2026" (merged from ChatGPT, Gemini, Mistral outputs).
//
// Each career's content is restructured as GUIDED, instructional
// material (not a flat checklist). Every task follows the pattern:
//   - title:  the tool/practice name + what it is (one line)
//   - why:    why it matters for THIS specific career (≥120 chars,
//             drawn from the report's "why" context)
//   - brief:  a guided explanation + concrete "try this" first step
//             (≥200 chars, actionable — e.g. "Install X and try Y")
//   - steps:  3-5 concrete first steps the learner can actually do
//
// Source attributions from the research report are preserved in the
// `brief` or `why` fields where present (e.g. "Source: Gemini, Mistral").
//
// All 9 app careers map cleanly to the report's 9 career sections —
// no gaps, no fabrication.
// ============================================================

export type AIBonusTask = {
  id: string;
  title: string;
  why: string;
  brief: string;
  steps?: string[];
  estMinutes: number;
  xp: number;
  tags?: string[];
};

export type AIBonusModule = {
  id: string;
  title: string;
  description: string;
  tasks: AIBonusTask[];
};

export type AIBonusCareerContent = {
  title: string;
  subtitle: string;
  objectives: string[];
  modules: AIBonusModule[];
};

// ============================================================
// Master industry context — prepended to every career's first module
// description so the learner understands the 2026 AI landscape.
// (From report section 1: "The 2026 AI Technical Landscape")
// ============================================================

const LANDSCAPE_CONTEXT =
  "In 2026, AI adoption among professional developers ranges from 84% to 91%. " +
  "AI assistance has cut the average time for a new hire to merge their tenth pull request in half, " +
  "with task completion speeds increasing 10% to 55.8%. Daily AI users achieve ~60% higher merge volume. " +
  "However, AI-coauthored pull requests contain ~1.7× more issues than human-only code, and 45% of " +
  "AI-generated code contains security vulnerabilities. This \"Operational Paradox\" means every " +
  "developer must now demonstrate the capability to audit, test, and defend every line of AI-assisted code.";

// ============================================================
// Career: software-engineering
// (Report section 3)
// ============================================================

const SOFTWARE_ENGINEERING: AIBonusCareerContent = {
  title: "AI in Software Engineering — Bonus Track",
  subtitle: "AI coding assistants, LLM APIs, and the code-quality paradox",
  objectives: [
    "Use AI coding assistants (Copilot, Cursor, Claude Code) to ship 18-55% faster while auditing their output",
    "Integrate LLM APIs (OpenAI, Anthropic, Z.ai) with structured output and function calling",
    "Apply the industry practices (CI/CD, IaC, observability) that make AI-assisted code safe to ship",
  ],
  modules: [
    {
      id: "ai-tools",
      title: "AI Coding Assistants & IDE Integration",
      description: LANDSCAPE_CONTEXT + " For software engineers, AI coding assistants are now essential infrastructure — GitHub Copilot yields a documented 55.8% improvement in task speed, and Cursor reached $2B ARR by early 2026. This module covers the tools every engineer is expected to know.",
      tasks: [
        {
          id: "t1-copilot",
          title: "GitHub Copilot — AI pair programming in your IDE",
          why: "Copilot provides real-time autocomplete, function generation, and multi-file explanations directly in the IDE. Industry data documents a 55.8% improvement in task speed (Source: Gemini, Mistral, ChatGPT). Every major tech company now expects developers to use these tools — not using them is a competitive disadvantage.",
          brief: "Copilot is an AI pair programmer that suggests code as you type, based on your project's context. Install the extension, write a comment describing what you want (e.g. \"// function to validate an email address\"), and accept or refine the suggestion. The key skill is crafting good prompts and reviewing suggestions critically — AI-coauthored PRs contain ~1.7× more issues than human-only code, so you must audit every suggestion. Try this: install Copilot in VS Code, write a comment describing a utility function you need, and accept the suggestion — then review it line by line for correctness and security.",
          steps: [
            "Install the GitHub Copilot VS Code extension (free for students/open-source maintainers)",
            "Open a file and type a comment describing a function you need (e.g. \"// debounce a function call\")",
            "Accept the ghost-text suggestion with Tab, or press Ctrl+Enter for a full function generation",
            "Review the generated code line by line — check for edge cases, security issues, and off-by-one errors",
            "Run your test suite against the AI-generated code to verify correctness",
          ],
          estMinutes: 60,
          xp: 60,
          tags: ["ai", "bonus", "tools"],
        },
        {
          id: "t2-cursor",
          title: "Cursor — the AI-first code editor with multi-file context",
          why: "Cursor is an AI-first code editor (a fork of VS Code) that indexes entire codebases locally to enable multi-file edits and natural-language debugging. It reached $2B ARR by early 2026 (Source: Gemini, Mistral, ChatGPT). Unlike Copilot's single-file suggestions, Cursor's Composer feature can refactor across files, write tests, and implement features from a natural-language description.",
          brief: "Cursor indexes your entire codebase so its AI can reason across files — ask it \"add error handling to all API routes\" and it edits multiple files coherently. Download Cursor (free tier available), open a project, and press Ctrl+I to open Composer. Describe a multi-file change (e.g. \"add input validation to every endpoint in the routes/ folder\") and review the diff it produces. The skill is writing precise instructions and verifying the multi-file diff before accepting. Try this: open a small project in Cursor, use Composer to add logging to 3 files at once, and review the unified diff.",
          steps: [
            "Download Cursor from cursor.com (free tier, replaces or runs alongside VS Code)",
            "Open an existing project and press Ctrl+I (or Cmd+I) to open the Composer panel",
            "Type a multi-file instruction like \"add try/catch error handling to every function in utils.js\"",
            "Review the unified diff across all affected files before accepting",
            "Run your tests to confirm the AI's multi-file refactor didn't break anything",
          ],
          estMinutes: 90,
          xp: 80,
          tags: ["ai", "bonus", "tools"],
        },
        {
          id: "t3-claude-code",
          title: "Claude Code — terminal-based assistant for deep codebase work",
          why: "Claude Code runs directly in the shell to analyze codebases and execute Git operations, specializing in deep multi-file architectural work (Source: Gemini, Mistral). Unlike IDE plugins, it can run terminal commands, inspect Git history, and reason about large repos — making it powerful for refactoring and debugging across an entire project.",
          brief: "Claude Code is a terminal-based AI assistant that can read your codebase, run shell commands, and make multi-file edits. Install it via npm, navigate to your project, and ask it to do something architectural (e.g. \"find all functions that don't have tests and write tests for them\"). It will inspect files, run commands, and produce a diff you can review. Try this: install Claude Code, run it in a project, and ask it to \"find and fix any TODO comments in the codebase\" — review each change it proposes.",
          steps: [
            "Install Claude Code: npm install -g @anthropic-ai/claude-code",
            "Navigate to a project in your terminal and run: claude",
            "Ask it an architectural question: \"which functions have no test coverage?\"",
            "Have it make a change: \"write tests for the 3 most important untested functions\"",
            "Review the diff with git diff before committing — verify the tests actually pass",
          ],
          estMinutes: 90,
          xp: 80,
          tags: ["ai", "bonus", "tools"],
        },
      ],
    },
    {
      id: "llm-apis",
      title: "LLM APIs & Building AI Features",
      description: "Large Language Model APIs (OpenAI GPT-4o, Anthropic Claude, Google Gemini, Z.ai) are the backbone of modern AI features. In 2026, these APIs support function calling (the AI invokes your code), structured output (JSON mode), and vision (image understanding). Understanding how to call them, handle rate limits, and manage costs is a core skill for any engineer building AI-powered applications.",
      tasks: [
        {
          id: "t1-call-llm",
          title: "Call an LLM API and parse the response",
          why: "AI features are table stakes in modern applications. Every engineer building AI-powered features must understand the API layer — authentication, request structure (system + user messages), response parsing, and error handling (rate limits, timeouts, invalid JSON). This is the foundation for every AI feature you'll build.",
          brief: "Use the OpenAI, Anthropic, or Z.ai SDK to call an LLM and print a response. Get an API key, install the official SDK (npm install openai / pip install anthropic), construct a messages array with system + user roles, send the request, and parse the JSON response. Handle errors gracefully (rate limits return 429, timeouts need retries). Try this: get a free API key from Google AI Studio (Gemini) or Groq, write a 10-line script that sends \"explain what a closure is\" and prints the response, then add a try/catch for rate-limit errors.",
          steps: [
            "Get a free API key from Google AI Studio (aistudio.google.com) or Groq (console.groq.com)",
            "Install the SDK: npm install @google/generative-ai (or the provider of your choice)",
            "Write a script that sends a system message + user message and prints the response",
            "Add error handling: catch rate-limit (429) errors and retry with exponential backoff",
            "Log the token count and estimated cost from the response to understand pricing",
          ],
          estMinutes: 120,
          xp: 100,
          tags: ["ai", "bonus", "api"],
        },
        {
          id: "t2-structured-output",
          title: "Structured output (JSON mode) — making LLMs return parseable data",
          why: "Real applications need structured data, not free text. JSON mode forces the LLM to return valid JSON, which you parse directly into TypeScript/Python objects. This is how production AI features work — classification, extraction, and summarization all rely on structured output. Without it, you'd be regex-parsing free text, which is fragile and error-prone.",
          brief: "Configure the API call to request JSON output. Define a schema (e.g. {summary: string, sentiment: 'positive'|'negative'|'neutral', key_points: string[]}), send a prompt asking the LLM to analyze a text, and parse the structured response into a typed object. Validate the response against your schema (the LLM can occasionally produce malformed JSON). Try this: build a small script that takes a product review and returns {sentiment, score (1-5), summary} as JSON — then feed it 5 reviews and display the results in a table.",
          steps: [
            "Define a TypeScript interface or Python dataclass for your expected output",
            "Set response_format: { type: 'json_object' } (OpenAI) or the equivalent for your provider",
            "Write a prompt that explicitly asks for JSON matching your schema",
            "Parse the response with JSON.parse, then validate each field against your schema",
            "Handle malformed JSON gracefully (retry or fall back to a default)",
          ],
          estMinutes: 150,
          xp: 120,
          tags: ["ai", "bonus", "api"],
        },
      ],
    },
    {
      id: "industry-practices",
      title: "Industry Practices for AI-Assisted Development",
      description: "The 2026 \"Operational Paradox\" — AI speeds up delivery but AI-coauthored PRs contain ~1.7× more issues — means industry practices are more important than ever. CI/CD pipelines, code reviews, and observability are what make AI-assisted code safe to ship.",
      tasks: [
        {
          id: "t1-cicd",
          title: "CI/CD pipelines — automated quality gates for AI-assisted code",
          why: "CI/CD pipelines automatically run compilation, linting, and tests before code merges. With AI generating ~45% of code containing security vulnerabilities (per the 2026 report), automated quality gates are the only way to catch AI-introduced issues before they reach production. Every engineering team now requires CI to pass before merge.",
          brief: "A CI/CD pipeline runs your tests, linter, and security scans on every push and pull request — before code can merge. Set up GitHub Actions (free for public repos) to run your test suite, ESLint, and a security scanner like Snyk on every PR. Configure branch protection to require a green CI check before merging. Try this: add a .github/workflows/ci.yml file to a project that runs npm test && npm run lint on every push — then deliberately introduce a bug and watch CI catch it.",
          steps: [
            "Create .github/workflows/ci.yml in your repo",
            "Add a job that runs on push/PR: checkout, install deps, run tests, run linter",
            "Add Snyk or CodeQL for security scanning of AI-generated code",
            "Enable branch protection in GitHub Settings → Branches → Require status checks to pass",
            "Deliberately push a failing test and confirm CI blocks the merge",
          ],
          estMinutes: 120,
          xp: 100,
          tags: ["ai", "bonus", "devops"],
        },
        {
          id: "t2-code-review",
          title: "Code review — auditing AI-generated code like a senior engineer",
          why: "Peer-level code reviews ensure AI-generated and human-written code meet architectural standards. With AI coauthoring ~1.7× more issues per PR, every AI suggestion must be reviewed critically — for correctness, security, performance, and architectural fit. The ability to audit AI code is now a top hiring signal (the report calls this the \"Trust Reset\" period).",
          brief: "Code review for AI-assisted PRs means treating every AI suggestion as untrusted input. When reviewing a PR: check for hardcoded secrets (AI often invents API keys), verify edge-case handling (AI skips error paths), confirm test coverage (AI writes tests that pass but don't test the right things), and look for security vulnerabilities (45% of AI code has them). Try this: open a PR that used Copilot or Cursor, and review it line by line using a checklist — log every issue you find.",
          steps: [
            "Open a PR in your project that was written with AI assistance",
            "Check for hardcoded secrets, API keys, or credentials (AI sometimes invents these)",
            "Verify every function has error handling for edge cases (null inputs, network failures)",
            "Confirm the tests actually test behavior, not just that functions don't crash",
            "Run a security scanner (Snyk, CodeQL) on the PR branch and review findings",
          ],
          estMinutes: 60,
          xp: 60,
          tags: ["ai", "bonus", "review"],
        },
      ],
    },
  ],
};

// ============================================================
// Career: web-dev
// (Report section 4)
// ============================================================

const WEB_DEV: AIBonusCareerContent = {
  title: "AI-Powered Web Development — Bonus Track",
  subtitle: "Design-to-code tools, full-stack AI builders, and modern web practices",
  objectives: [
    "Use AI design-to-code tools (v0, Bolt.new, Lovable) to generate UI components and full-stack MVPs",
    "Apply component-driven, accessible, performant web practices to AI-generated code",
    "Build a portfolio that demonstrates cross-device excellence and WCAG compliance",
  ],
  modules: [
    {
      id: "ai-tools",
      title: "AI Web Development Tools",
      description: LANDSCAPE_CONTEXT + " For web developers, AI tools now generate production-ready React/Next.js components in ~8 seconds and full-stack MVPs in hours. v0 by Vercel turns text or Figma screenshots into components; Bolt.new runs full-stack apps in the browser via WebContainer technology.",
      tasks: [
        {
          id: "t1-v0",
          title: "v0 by Vercel — generate React/Next.js/Tailwind components from text",
          why: "v0 generates production-ready React, Next.js, and Tailwind CSS components from text or Figma screenshots. It produces UI components in ~8 seconds, dramatically accelerating frontend development. For web developers, this means you can prototype an entire component library in an afternoon — but you must still understand the generated code to customize and maintain it.",
          brief: "v0 is a design-to-code tool: you describe a component in plain English (or paste a Figma screenshot) and it generates a working React + Tailwind component. Go to v0.dev, type a prompt like \"a pricing card with three tiers, highlight the middle one\", and v0 generates the component. Copy the code into your project, then customize it. The skill is writing precise prompts and understanding the generated code. Try this: generate a responsive navbar with a mobile hamburger menu, copy it into a Next.js project, and verify it renders correctly.",
          steps: [
            "Go to v0.dev (free with a Vercel account)",
            "Type a prompt: \"a responsive product card with image, title, price, and add-to-cart button\"",
            "Refine the output with follow-up messages (e.g. \"make the button teal and add a hover effect\")",
            "Copy the generated code into your Next.js/React project",
            "Verify it renders correctly and is responsive on mobile + desktop widths",
          ],
          estMinutes: 45,
          xp: 50,
          tags: ["ai", "bonus", "web"],
        },
        {
          id: "t2-bolt",
          title: "Bolt.new — browser-based full-stack app generation with WebContainer",
          why: "Bolt.new leverages WebContainer technology to write, run, and instantly deploy full-stack JavaScript applications with active backends — entirely in the browser. It can generate a working full-stack MVP in hours, not weeks. This is a paradigm shift: you can go from idea to deployed app without any local setup.",
          brief: "Bolt.new runs a full Node.js environment in your browser (via WebContainer), so it can generate AND run a complete full-stack app — frontend, backend, database — without any local setup. Go to bolt.new, describe what you want (e.g. \"a todo app with user auth and a Postgres database\"), and watch it build, install deps, and run the app live. You can chat with it to add features. Try this: generate a simple blog with posts + comments, then ask it to add user authentication — observe how it modifies the code and redeploys.",
          steps: [
            "Go to bolt.new (free tier available)",
            "Describe a full-stack app: \"a URL shortener with a clean UI and a SQLite database\"",
            "Watch it generate the code, install dependencies, and run the app in the browser",
            "Use the chat to add a feature: \"add click-count analytics for each shortened URL\"",
            "Deploy the app directly from Bolt (or export the code to run locally)",
          ],
          estMinutes: 90,
          xp: 90,
          tags: ["ai", "bonus", "web"],
        },
        {
          id: "t3-lovable",
          title: "Lovable.dev / Locofy — rapid frontend scaffolding from designs",
          why: "Lovable.dev focuses on high-quality frontend layouts and visual interface scaffolding for corporate dashboards. Locofy and Anima automatically convert Figma/Adobe XD designs into production-ready React, Vue, or Next.js code. These tools bridge the designer-to-developer handoff, which is traditionally one of the slowest parts of web development.",
          brief: "Lovable.dev and Locofy convert visual designs (Figma, Adobe XD, or text descriptions) into production-ready frontend code. If you have a Figma design, paste the link into Locofy and it generates a React component. If you have a text description, Lovable.dev builds a dashboard layout. The generated code uses semantic HTML and Tailwind CSS. Try this: take a Figma design (or screenshot) of a dashboard, feed it to Locofy or Lovable, and integrate the generated React component into a Next.js project.",
          steps: [
            "Go to lovable.dev or locofy.ai (free tiers available)",
            "Paste a Figma design URL or upload a screenshot of a UI you want to build",
            "Configure the output framework (React/Next.js/Vue) and styling (Tailwind/CSS modules)",
            "Copy the generated code into your project",
            "Review the generated code for accessibility (semantic HTML, aria attributes) and fix any gaps",
          ],
          estMinutes: 75,
          xp: 70,
          tags: ["ai", "bonus", "web"],
        },
      ],
    },
    {
      id: "industry-practices",
      title: "Modern Web Practices for AI-Generated Code",
      description: "AI tools generate code fast, but that code must still meet 2026 industry standards: component-driven architecture, WCAG AA/AAA accessibility, and Core Web Vitals performance budgets. These practices are what separate a generated prototype from a production-ready application.",
      tasks: [
        {
          id: "t1-component-driven",
          title: "Component-driven UI with React/Next.js — isolate state, ensure reusability",
          why: "Component-driven UI means building interfaces via reactive frameworks (React, Next.js) to isolate state and ensure reusability. AI tools generate components, but without a component-driven architecture, those components become coupled and unmaintainable. This practice is the foundation that makes AI-generated code manageable at scale.",
          brief: "Component-driven architecture means each UI piece is a self-contained component with its own state, props, and styles — composable into larger interfaces. When AI generates a component, refactor it to follow this pattern: extract reusable bits into their own components, lift shared state to a parent, and use props for customization. Try this: take an AI-generated page, break it into 3-4 reusable components (Header, Card, Footer), and verify each works independently when rendered in isolation.",
          steps: [
            "Take a page generated by v0 or Bolt and identify reusable pieces (cards, navbars, footers)",
            "Extract each piece into its own component file with a clear props interface",
            "Use Storybook (or a simple test page) to render each component in isolation",
            "Ensure each component manages only its own state — lift shared state to the parent",
            "Verify the refactored page renders identically to the original AI-generated version",
          ],
          estMinutes: 90,
          xp: 80,
          tags: ["ai", "bonus", "web"],
        },
        {
          id: "t2-accessibility",
          title: "WCAG accessibility — making AI-generated UIs usable for everyone",
          why: "WCAG Level AA/AAA compliance using semantic HTML is a 2026 industry requirement. AI tools often generate div-soup instead of semantic HTML (button, nav, main, section), missing aria attributes and keyboard navigation. Recruiters explicitly look for WCAG compliance evidence in portfolios — it's a hiring signal.",
          brief: "Accessibility means your UI works for users with assistive technologies (screen readers, keyboard navigation). AI-generated code often uses generic <div> tags instead of semantic elements. Audit AI-generated components: replace <div onClick> with <button>, add aria-labels to icon-only buttons, ensure tab order is logical, and test with a screen reader. Try this: run Lighthouse Accessibility audit on an AI-generated page, fix every issue it finds, and re-run until you score 100.",
          steps: [
            "Run Lighthouse in Chrome DevTools on an AI-generated page (Audit → Accessibility)",
            "Replace every <div onClick> with a semantic <button> element",
            "Add aria-label attributes to icon-only buttons (e.g. aria-label=\"Close menu\")",
            "Navigate the page with only the Tab key — verify every interactive element is reachable",
            "Test with a screen reader (VoiceOver on Mac, NVDA on Windows) — confirm it reads logically",
          ],
          estMinutes: 75,
          xp: 70,
          tags: ["ai", "bonus", "web", "a11y"],
        },
        {
          id: "t3-performance",
          title: "Core Web Vitals — performance budgets for AI-generated apps",
          why: "Continuous monitoring of Core Web Vitals (LCP, FID, CLS) and asset bundle budgeting is a 2026 industry standard. AI tools can generate heavy, unoptimized code (large images, unminified bundles, layout shift). Candidates must provide evidence of improving load speeds through API caching and asset optimization — it's a career-readiness signal.",
          brief: "Core Web Vitals are Google's performance metrics: LCP (Largest Contentful Paint, <2.5s), FID (First Input Delay, <100ms), CLS (Cumulative Layout Shift, <0.1). AI-generated apps often violate these. Run Lighthouse Performance audit, then fix issues: lazy-load images, code-split heavy routes, preconnect to API domains, and minimize bundle size. Try this: run Lighthouse on an AI-generated app, identify the top 3 performance issues, fix them, and re-run to verify your scores improved.",
          steps: [
            "Run Lighthouse Performance audit on your AI-generated app (Chrome DevTools → Lighthouse)",
            "Fix LCP: lazy-load below-the-fold images with loading=\"lazy\" and add width/height attributes",
            "Fix CLS: add explicit width/height to images and reserve space for ads/embeds",
            "Reduce bundle size: use next/dynamic to code-split heavy components (charts, editors)",
            "Re-run Lighthouse and verify all three Core Web Vitals are in the green",
          ],
          estMinutes: 90,
          xp: 80,
          tags: ["ai", "bonus", "web", "performance"],
        },
      ],
    },
  ],
};

// ============================================================
// Career: cloud-devops
// (Report section 5)
// ============================================================

const CLOUD_DEVOPS: AIBonusCareerContent = {
  title: "AI in Cloud/DevOps — Bonus Track",
  subtitle: "AI-assisted IaC, intelligent monitoring, and GitOps automation",
  objectives: [
    "Use AI DevOps tools (Amazon Q, Gemini Code Assist, Aider) to generate and validate IaC",
    "Apply GitOps, Kubernetes orchestration, and observability with AI-assisted troubleshooting",
    "Build multi-tier IaC portfolio projects with disaster recovery simulations",
  ],
  modules: [
    {
      id: "ai-tools",
      title: "AI DevOps Tools & IaC Assistants",
      description: LANDSCAPE_CONTEXT + " For Cloud/DevOps, AI tools deliver 23.0% to 46.7% average speedups in automated systems operations and routing. Amazon Q Developer generates optimized cloud scripts, Gemini Code Assist troubleshoots cloud console issues, and Aider integrates with Git to scaffold infrastructure configurations.",
      tasks: [
        {
          id: "t1-amazon-q",
          title: "Amazon Q Developer — AWS-integrated IaC generation and security scanning",
          why: "Amazon Q Developer generates optimized cloud scripts and configuration recommendations specific to AWS infrastructure. It also identifies insecure coding patterns — critical because 45% of AI-generated code contains security vulnerabilities. For DevOps engineers working in AWS, this is the most directly integrated AI tool available.",
          brief: "Amazon Q Developer (formerly CodeWhisperer) is an AWS-integrated assistant that generates Terraform/CloudFormation, recommends architectural improvements, and scans for security issues. Install the AWS Toolkit VS Code extension, sign in with your AWS Builder ID, and ask it to generate an IaC snippet (e.g. \"Terraform for an S3 bucket with versioning and encryption\"). Review the output for security (it flags insecure patterns) and cost. Try this: generate Terraform for a VPC with public+private subnets and a NAT gateway, then run terraform plan to verify it.",
          steps: [
            "Install the AWS Toolkit VS Code extension and sign in with AWS Builder ID (free)",
            "Open a .tf file and type a comment: \"# VPC with public and private subnets\"",
            "Accept Amazon Q's Terraform suggestion and review it for security best practices",
            "Run terraform plan to verify the configuration is valid and see the estimated cost",
            "Ask Q to scan for security issues: right-click → Security Scan, and fix any findings",
          ],
          estMinutes: 90,
          xp: 90,
          tags: ["ai", "bonus", "devops"],
        },
        {
          id: "t2-aider",
          title: "Aider — terminal-based AI for Git-integrated IaC commits",
          why: "Aider is a terminal tool that integrates with Git to scaffold infrastructure configurations and execute atomic commits. Unlike IDE plugins, it works directly in the shell and makes Git commits for each AI change — creating a clean, reviewable history of AI-assisted modifications. This is especially valuable for IaC where every change must be tracked and reviewed.",
          brief: "Aider is a CLI AI assistant that edits your code and makes Git commits for each change. Install it via pip, navigate to a Terraform repo, and ask it to make a change (e.g. \"add a CloudWatch alarm for high CPU\"). It edits the file, runs terraform fmt, and makes a Git commit with a descriptive message. Review the commit, then terraform plan to verify. Try this: use Aider to add an S3 bucket policy to an existing Terraform module, review the commit diff, and verify with terraform validate.",
          steps: [
            "Install Aider: pip install aider-chat (requires an API key for OpenAI/Anthropic)",
            "Navigate to a Terraform repo and run: aider",
            "Ask it to add a resource: \"add a CloudWatch alarm that triggers when CPU > 80%\"",
            "Review the Git commit it makes (git log + git show HEAD)",
            "Run terraform validate && terraform plan to verify the AI-generated IaC is correct",
          ],
          estMinutes: 75,
          xp: 80,
          tags: ["ai", "bonus", "devops"],
        },
        {
          id: "t3-kubeai",
          title: "KubeAI & Terraform AI — specialized manifest and HCL generation",
          why: "KubeAI specializes in Kubernetes manifest generation, optimization, and troubleshooting. Terraform AI Assistants generate and validate HCL (HashiCorp Configuration Language) scripts. These specialized tools outperform general-purpose LLMs on domain-specific IaC because they're trained on the relevant syntax and best practices.",
          brief: "Specialized AI tools for K8s and Terraform produce better manifests than general LLMs. For Kubernetes, use KubeAI (or ask Cursor/Copilot with a K8s-specific prompt) to generate a Deployment with liveness/readiness probes, resource limits, and a HorizontalPodAutoscaler. For Terraform, use a Terraform AI assistant to generate HCL that follows your organization's module conventions. Try this: generate a K8s Deployment + Service + HPA for a web app, then validate it with kubectl apply --dry-run=client.",
          steps: [
            "Use Cursor or Copilot with a K8s prompt: \"generate a Deployment with 3 replicas, liveness probe, and resource limits\"",
            "Add a HorizontalPodAutoscaler that scales on CPU > 70%",
            "Validate the manifests: kubectl apply --dry-run=client -f deployment.yaml",
            "Use a Terraform AI assistant to generate an RDS instance module with encryption and backups",
            "Run terraform validate && terraform fmt to verify the HCL is correct and formatted",
          ],
          estMinutes: 90,
          xp: 90,
          tags: ["ai", "bonus", "devops"],
        },
      ],
    },
    {
      id: "industry-practices",
      title: "DevOps Industry Practices with AI",
      description: "The 2026 DevOps stack — declarative IaC, GitOps, Kubernetes, observability, and DevSecOps — is what makes AI-assisted infrastructure safe to ship. AI generates configs fast, but these practices ensure those configs are version-controlled, reviewable, monitored, and secure.",
      tasks: [
        {
          id: "t1-gitops",
          title: "GitOps — manage infrastructure changes via pull requests",
          why: "GitOps uses pull requests and Git-based workflows to manage infrastructure changes. Every IaC change is a PR that goes through review, CI validation, and approval before merging — which auto-syncs to the cluster. This is the industry standard for managing AI-generated infrastructure code safely: no one applies AI configs directly to production.",
          brief: "GitOps means your Git repo is the single source of truth for infrastructure. You make changes via PRs, CI runs terraform plan/kubectl diff, and a controller (ArgoCD, Flux) syncs approved changes to the cluster. Set up a simple GitOps flow: store K8s manifests in a repo, install ArgoCD, and connect them — every PR merge auto-deploys. Try this: create a repo with a K8s Deployment, install ArgoCD in a local cluster (minikube), and watch it sync when you merge a PR.",
          steps: [
            "Create a Git repo with a k8s/ folder containing a Deployment manifest",
            "Install ArgoCD in a minikube cluster: kubectl apply -f argocd-install.yaml",
            "Connect ArgoCD to your repo and create an Application that syncs the k8s/ folder",
            "Open a PR that changes the replica count from 2 to 3 — CI runs kubectl diff",
            "Merge the PR and watch ArgoCD auto-sync the change to your cluster",
          ],
          estMinutes: 120,
          xp: 100,
          tags: ["ai", "bonus", "devops", "gitops"],
        },
        {
          id: "t2-observability",
          title: "Observability — Prometheus/Grafana monitoring for AI-assisted systems",
          why: "The observability stack (Prometheus, Grafana, ELK) collects metrics and detects anomalies in real time. With AI generating infrastructure code that may have subtle issues (resource limits, missing probes), observability is how you catch problems in production before users do. Every DevOps engineer must know this stack.",
          brief: "Observability means you can see what's happening inside your systems via metrics, logs, and traces. Install Prometheus (metrics scraper) and Grafana (dashboard) in a minikube cluster, configure them to scrape your app's /metrics endpoint, and build a dashboard showing CPU, memory, request rate, and error rate. Set up an alert that fires when error rate > 5%. Try this: deploy a sample app, break it (scale to 0 replicas), and watch the Grafana dashboard + alert reflect the outage.",
          steps: [
            "Install Prometheus + Grafana in minikube using the kube-prometheus-stack Helm chart",
            "Deploy a sample app that exposes a /metrics endpoint (request count, latency)",
            "Build a Grafana dashboard showing: request rate, p95 latency, error rate, CPU usage",
            "Create a Grafana alert: fire when error rate > 5% for 2 minutes",
            "Break the app (scale to 0 replicas) and verify the alert fires",
          ],
          estMinutes: 120,
          xp: 100,
          tags: ["ai", "bonus", "devops", "observability"],
        },
      ],
    },
  ],
};

// ============================================================
// Career: data-science
// (Report section 6)
// ============================================================

const DATA_SCIENCE: AIBonusCareerContent = {
  title: "AI in Data Science — Bonus Track",
  subtitle: "AI-assisted analysis, modern data stack, and reproducible notebooks",
  objectives: [
    "Use AI data tools (PandasAI, Jupyter AI, OpenAI Advanced Data Analysis) to accelerate analysis",
    "Apply the modern data stack (dbt, lakeFS, Snowflake/BigQuery) with AI-assisted SQL",
    "Build a portfolio of reproducible notebooks with quantified business impact",
  ],
  modules: [
    {
      id: "ai-tools",
      title: "AI Data Analysis Tools",
      description: LANDSCAPE_CONTEXT + " For data scientists, AI tools deliver 35% less time spent on data pipeline code and 42% faster exploratory analysis. PandasAI runs aggregations via natural language, Jupyter AI generates statistical functions inside notebooks, and OpenAI Advanced Data Analysis provides a sandboxed environment for predictive modeling.",
      tasks: [
        {
          id: "t1-pandasai",
          title: "PandasAI — natural-language queries on DataFrames",
          why: "PandasAI integrates generative models with DataFrames to run aggregations via natural language. Instead of writing df.groupby('region')['revenue'].sum(), you ask \"what's the total revenue by region?\" and PandasAI generates and runs the code. This cuts exploratory analysis time by ~42%, letting you focus on interpretation rather than syntax.",
          brief: "PandasAI wraps a pandas DataFrame with an LLM that translates natural-language questions into Python code and runs it. Install it (pip install pandasai), load a CSV into a SmartDataframe, and ask questions in plain English. The tool generates the pandas code, executes it, and returns the result. Try this: load a sales CSV into PandasAI and ask \"which product category had the highest revenue growth last quarter?\" — then inspect the generated code to verify it's correct.",
          steps: [
            "Install PandasAI: pip install pandasai (requires an LLM API key)",
            "Load a CSV: from pandasai import SmartDataframe; df = SmartDataframe('sales.csv')",
            "Ask a natural-language question: df.chat('what is the average order value by month?')",
            "Inspect the generated pandas code (PandasAI logs it) — verify it's correct",
            "Ask a more complex question with a follow-up: \"chart that as a line graph\"",
          ],
          estMinutes: 60,
          xp: 60,
          tags: ["ai", "bonus", "data"],
        },
        {
          id: "t2-jupyter-ai",
          title: "Jupyter AI — in-notebook statistical function generation",
          why: "Jupyter AI generates statistical functions and formats visualizations directly within notebook environments. Data scientists spend significant time on boilerplate (plot formatting, statistical test setup) — Jupyter AI eliminates that, letting you focus on analysis. The 42% faster exploratory analysis figure is largely attributable to this category of tool.",
          brief: "Jupyter AI is a JupyterLab extension that lets you chat with an LLM inside your notebook. You can ask it to generate code (\"write a function to compute a 95% confidence interval\"), explain an error, or format a matplotlib chart. Install the extension, open a notebook, and use the chat sidebar. Try this: load a dataset, ask Jupyter AI to \"generate a boxplot of revenue by region with proper labels and a log scale\", and run the generated code cell.",
          steps: [
            "Install Jupyter AI: pip install jupyter-ai (requires an LLM API key)",
            "Open JupyterLab and find the AI chat sidebar (right side)",
            "Load a dataset into a notebook: df = pd.read_csv('data.csv')",
            "Ask the AI: \"write code to plot the distribution of each numeric column as a grid of histograms\"",
            "Run the generated code cell, then ask a follow-up: \"add a KDE overlay to each histogram\"",
          ],
          estMinutes: 75,
          xp: 70,
          tags: ["ai", "bonus", "data"],
        },
        {
          id: "t3-automl",
          title: "AutoML platforms — DataRobot, H2O, AutoGluon for model pipelines",
          why: "Enterprise-grade AutoML tools including DataRobot (governance), H2O Driverless AI (tabular pipelines), AutoGluon (multimodal data), and Vertex AI (cloud-native modeling) automate model selection, hyperparameter tuning, and ensembling. They're used in production environments where governance and reproducibility matter — knowing them is a hiring signal for senior data science roles.",
          brief: "AutoML platforms automate the ML pipeline: you provide data, they try many models, tune hyperparameters, and return the best ensemble. Use H2O Driverless AI (free community edition) or AutoGluon (open source) on a tabular dataset — both produce a leaderboard of models with performance metrics. The skill is interpreting the results and understanding WHY the winning model won, not just trusting the black box. Try this: load the Titanic dataset into AutoGluon, run fit(), and review the model leaderboard — then inspect the feature importance of the winning model.",
          steps: [
            "Install AutoGluon: pip install autogluon (open source, no API key needed)",
            "Load a tabular dataset: train = pd.read_csv('train.csv')",
            "Run AutoML: predictor = TabularPredictor(label='survived').fit(train)",
            "Review the model leaderboard: predictor.leaderboard(test)",
            "Inspect feature importance of the best model: predictor.feature_importance(test)",
          ],
          estMinutes: 120,
          xp: 100,
          tags: ["ai", "bonus", "data", "ml"],
        },
      ],
    },
    {
      id: "industry-practices",
      title: "Modern Data Stack Practices",
      description: "The 2026 modern data stack — ELT with dbt, data versioning with lakeFS, and statistical rigor — is what makes AI-assisted analysis trustworthy. AI can generate SQL and visualizations fast, but without these practices, the results aren't reproducible or defensible.",
      tasks: [
        {
          id: "t1-dbt",
          title: "dbt — SQL-based transformations with version control and testing",
          why: "The modern data stack uses ELT (Extract, Load, Transform) workflows with dbt for SQL-based transformations and Snowflake/BigQuery for warehousing. dbt brings software engineering practices (version control, testing, documentation) to SQL — which is essential when AI generates transformation code that must be reviewed and tested.",
          brief: "dbt (data build tool) lets you write SQL transformations as modular, testable models — like functions in code. Each model is a .sql file that dbt compiles, runs in dependency order, and tests. Install dbt, connect it to a local Postgres or a free BigQuery sandbox, and create a model that cleans and joins raw tables. Add tests (not_null, unique) and document columns. Try this: build a 3-model dbt pipeline (raw → staging → mart) for a sales dataset, add tests, and run dbt test to verify data quality.",
          steps: [
            "Install dbt: pip install dbt-core dbt-postgres (or dbt-bigquery)",
            "Initialize a project: dbt init my_project, configure the connection to Postgres/BigQuery",
            "Create a staging model: clean column names, cast types, filter out nulls from a raw table",
            "Create a mart model: aggregate the staging model by month and product category",
            "Add tests (not_null, unique, accepted_values) and run: dbt test",
          ],
          estMinutes: 120,
          xp: 100,
          tags: ["ai", "bonus", "data", "dbt"],
        },
        {
          id: "t2-lakefs",
          title: "lakeFS — data versioning for reproducible analysis",
          why: "lakeFS implements data versioning to branch and rollback datasets, ensuring full reproducibility. When AI generates analysis code, the results must be reproducible — if the data changes, the analysis changes. lakeFS brings Git-like branching to object storage (S3), so you can experiment on a branch without affecting production data.",
          brief: "lakeFS is like Git for data lakes — it lets you branch, commit, and merge datasets in S3 without copying them. Install lakeFS (Docker), connect it to an S3 bucket, and create a branch. Run an AI-assisted analysis on the branch; if it produces bad results, you can roll back instantly. Try this: set up lakeFS locally, commit a dataset, branch it, modify the data on the branch, and then revert the commit to restore the original state.",
          steps: [
            "Run lakeFS locally via Docker: docker run -p 8000:8000 treeverse/lakefs",
            "Create a repository and upload a CSV dataset via the lakeFS UI",
            "Create a branch: \"experiment-1\" — make changes to the data on this branch",
            "Run an AI-assisted analysis notebook against the branch data",
            "Revert the commit on the branch and verify the data is back to its original state",
          ],
          estMinutes: 90,
          xp: 80,
          tags: ["ai", "bonus", "data", "versioning"],
        },
      ],
    },
  ],
};

// ============================================================
// Career: ai-ml
// (Report section 7)
// ============================================================

const AI_ML: AIBonusCareerContent = {
  title: "Advanced AI/ML — Bonus Track",
  subtitle: "MLOps, RAG systems, vector databases, and responsible AI",
  objectives: [
    "Build RAG systems with vector databases (ChromaDB, pgvector) and defensive safeguards",
    "Use MLOps platforms (W&B, MLflow, Braintrust, LangSmith) for experiment tracking and LLM monitoring",
    "Apply responsible AI practices (bias checks, explainability) and ship end-to-end production AI",
  ],
  modules: [
    {
      id: "ai-tools",
      title: "MLOps & LLM Tooling",
      description: LANDSCAPE_CONTEXT + " For AI/ML engineers, these tools deliver ~70% reduction in time-to-baseline-model and structured RAG verification cycles. Weights & Biases tracks experiments, Braintrust monitors LLM output quality, LangSmith traces prompt pipelines, and Hugging Face Transformers is required knowledge for fine-tuning.",
      tasks: [
        {
          id: "t1-wandb",
          title: "Weights & Biases — experiment tracking and model registries",
          why: "W&B (and Neptune.ai) platforms track hyperparameters, visualize loss curves, and manage model registries. They deliver ~70% reduction in time-to-baseline-model by making experiments comparable and reproducible. Without experiment tracking, you can't tell which hyperparameter change actually improved the model — making AI/ML work guesswork.",
          brief: "W&B logs every training run's hyperparameters, metrics, and system stats to a dashboard where you can compare runs side by side. Install the wandb library, add 3 lines of code to your training script (wandb.init, wandb.log), and every run appears in your W&B dashboard with interactive charts. Try this: train a small model on MNIST with 3 different learning rates, log each to W&B, and use the dashboard to identify the best learning rate from the loss curves.",
          steps: [
            "Install W&B: pip install wandb, then wandb login (free account)",
            "Add to your training script: wandb.init(project='mnist-experiment', config={'lr': 0.001})",
            "Log metrics each epoch: wandb.log({'loss': loss, 'accuracy': acc})",
            "Run the script 3 times with different learning rates (0.1, 0.01, 0.001)",
            "Open the W&B dashboard and compare the 3 runs — which learning rate converged fastest?",
          ],
          estMinutes: 90,
          xp: 90,
          tags: ["ai", "bonus", "mlops"],
        },
        {
          id: "t2-langsmith",
          title: "LangSmith — tracing prompt pipelines and monitoring LLM costs",
          why: "LangSmith traces prompt pipelines and monitors API costs for generative AI architectures. When you build LLM apps, you need to see the full chain (prompt → model → output → downstream calls) to debug failures and track costs. Without tracing, a single user query might trigger 5 LLM calls and cost $0.50 — and you'd never know.",
          brief: "LangSmith (by LangChain) traces every LLM call in your application — the prompt, the response, the latency, the token count, and the cost. Wrap your LLM calls in LangChain, enable LangSmith tracing, and every request appears in a visual trace. Try this: build a simple RAG chain (retrieve + generate), enable LangSmith, send 5 queries, and review the traces to see exactly where time and tokens are spent.",
          steps: [
            "Create a free LangSmith account and get an API key",
            "Set environment variables: LANGCHAIN_TRACING_V2=true, LANGCHAIN_API_KEY=...",
            "Build a simple chain: retrieval (ChromaDB) → prompt template → LLM call",
            "Send 5 test queries and open the LangSmith dashboard",
            "Review each trace: identify which step (retrieval vs. LLM) takes the most time and tokens",
          ],
          estMinutes: 90,
          xp: 90,
          tags: ["ai", "bonus", "mlops", "llm"],
        },
        {
          id: "t3-huggingface",
          title: "Hugging Face Transformers — fine-tuning pretrained models",
          why: "Hugging Face Transformers is required knowledge for fine-tuning pretrained NLP and vision models. The hub hosts 500K+ models — fine-tuning one of these on your domain data is dramatically faster and cheaper than training from scratch. Every AI/ML job expects this skill.",
          brief: "Hugging Face Transformers provides pretrained models (BERT, Llama, etc.) you can fine-tune on your own data with a few lines of code. Use the Trainer API to fine-tune a small model (e.g. distilbert) on a text classification task. The key skill is knowing which pretrained model to start with and how to format your data for it. Try this: fine-tune distilbert-base-uncased on the IMDB sentiment dataset and measure the accuracy improvement over the zero-shot baseline.",
          steps: [
            "Install: pip install transformers datasets torch",
            "Load a dataset: datasets.load_dataset('imdb') and a tokenizer for distilbert",
            "Tokenize the dataset and set up the Trainer with TrainingArguments",
            "Fine-tune: trainer.train() — this takes ~10 min on a free Colab GPU",
            "Compare the fine-tuned model's accuracy against the zero-shot baseline",
          ],
          estMinutes: 180,
          xp: 150,
          tags: ["ai", "bonus", "ml", "fine-tuning"],
        },
      ],
    },
    {
      id: "industry-practices",
      title: "Production AI Practices",
      description: "The 2026 AI/ML industry practices — semantic search with vector databases, systematic ML tracking, and responsible AI — are what separate a notebook experiment from a production AI system. RAG with defensive safeguards is the most in-demand pattern.",
      tasks: [
        {
          id: "t1-rag",
          title: "RAG with defensive safeguards — confidence thresholds and safety filters",
          why: "RAG (retrieval-augmented generation) grounds LLMs in your data — the most useful AI pattern in 2026. But production RAG systems need defensive safeguards: confidence thresholds (don't answer if retrieval score is low), token limiters (prevent cost overruns), and safety filters (block harmful output). Portfolios must feature these safeguards — it's a top career-readiness signal.",
          brief: "A RAG system retrieves relevant documents from a vector database, feeds them to an LLM, and generates an answer grounded in those documents. Build one with ChromaDB (vector store) + an LLM API. Add safeguards: if the top retrieval score is below a threshold, respond \"I don't have enough information\" instead of hallucinating. Try this: build a RAG over a small set of FAQ documents, add a confidence threshold, and test it with a question NOT in the FAQ to verify it refuses instead of making up an answer.",
          steps: [
            "Install: pip install chromadb langchain openai",
            "Embed 10 FAQ documents into ChromaDB (collection.create_with_documents)",
            "Build a retrieval chain: query ChromaDB → top 3 docs → LLM prompt → answer",
            "Add a confidence threshold: if top doc similarity < 0.7, return \"I don't have enough information\"",
            "Test with an unrelated question — verify the system refuses instead of hallucinating",
          ],
          estMinutes: 180,
          xp: 150,
          tags: ["ai", "bonus", "rag", "production"],
        },
        {
          id: "t2-responsible-ai",
          title: "Responsible AI — bias checks, explainability, and safety frameworks",
          why: "Responsible AI incorporates ethics, bias checks, and explainability frameworks into the development cycle. In 2026, with 45% of AI-generated code containing vulnerabilities and increased regulatory scrutiny, every AI/ML practitioner must be able to audit their models for bias and explain their predictions. This is no longer optional — it's a hiring requirement.",
          brief: "Responsible AI means: testing your model for demographic bias, providing explanations for predictions (SHAP, LIME), and adding safety filters to prevent harmful output. Use SHAP to explain a model's predictions, test for bias across demographic groups, and add a content-safety filter to an LLM output. Try this: train a simple classifier, run SHAP on 10 predictions to see which features drove each decision, and test the model's accuracy across different subgroups to detect bias.",
          steps: [
            "Install: pip install shap",
            "Train a classifier (e.g. sklearn RandomForest on a tabular dataset)",
            "Run SHAP: explainer = shap.TreeExplainer(model); shap_values = explainer.shap_values(X_test)",
            "Visualize: shap.summary_plot(shap_values, X_test) — which features matter most?",
            "Test for bias: split the test set by a demographic column and compare accuracy across groups",
          ],
          estMinutes: 120,
          xp: 100,
          tags: ["ai", "bonus", "responsible-ai"],
        },
      ],
    },
  ],
};

// ============================================================
// Career: cybersecurity
// (Report section 8)
// ============================================================

const CYBERSECURITY: AIBonusCareerContent = {
  title: "AI in Cybersecurity — Bonus Track",
  subtitle: "AI threat detection, SIEM/SOAR automation, and shift-left security",
  objectives: [
    "Use AI security tools (Security Copilot, Charlotte AI, Snyk) for threat detection and response",
    "Apply STRIDE threat modeling, SIEM/SOAR integration, and shift-left security in CI pipelines",
    "Build a portfolio with threat-detection rules, home labs, and incident-response storytelling",
  ],
  modules: [
    {
      id: "ai-tools",
      title: "AI Security Tools & Threat Detection",
      description: LANDSCAPE_CONTEXT + " For cybersecurity, AI tools deliver 26% faster response times and resolve 40% to 60% of Tier 1 alerts autonomously. Microsoft Security Copilot translates natural language into KQL queries, CrowdStrike Charlotte AI stops malware via behavioral analytics, and Snyk scans code/containers/IaC for vulnerabilities.",
      tasks: [
        {
          id: "t1-security-copilot",
          title: "Microsoft Security Copilot — natural-language KQL and alert summarization",
          why: "Security Copilot translates natural language into Kusto Query Language (KQL) and summarizes security alerts. This is transformative for SOC analysts who spend hours writing complex KQL queries — now they can ask \"show me all failed logins from non-corporate IPs in the last 24 hours\" and get the query instantly. It also summarizes long alert chains, cutting response time by 26%.",
          brief: "Security Copilot is an AI assistant for Microsoft Sentinel/Defender that writes KQL queries from natural language and summarizes incidents. If you have access (via a Microsoft Sentinel workspace), open Copilot and ask it to write a KQL query for a specific threat hunt. Review the generated query — it's usually correct but may need refinement for your schema. Try this: ask Copilot \"write a KQL query to detect users who logged in from two different countries within 1 hour\", review the query, and run it in your Sentinel workspace.",
          steps: [
            "Access Security Copilot via a Microsoft Sentinel workspace (free trial available)",
            "Open the Copilot panel and type: \"write a KQL query to detect brute-force login attempts\"",
            "Review the generated query — check table names and column names match your schema",
            "Refine with a follow-up: \"filter to only show attempts outside business hours\"",
            "Run the query in Sentinel's Logs panel and review the results",
          ],
          estMinutes: 75,
          xp: 80,
          tags: ["ai", "bonus", "security"],
        },
        {
          id: "t2-snyk",
          title: "Snyk — AI-powered vulnerability scanning for code, containers, and IaC",
          why: "Snyk performs AI-powered vulnerability scanning for code, container images, and IaC scripts. With 45% of AI-generated code containing security vulnerabilities, Snyk is the automated gatekeeper that catches them before deployment. It integrates directly into CI/CD pipelines — every PR is scanned automatically.",
          brief: "Snyk scans your code, Docker images, and Terraform for known vulnerabilities (CVEs) and provides fix PRs. Install the Snyk CLI (free tier), run snyk test on a project, and review the vulnerability list. Snyk prioritizes by severity and exploitability, and can auto-generate fix PRs. Try this: run snyk test on a Node.js project with outdated dependencies, review the top 3 vulnerabilities, and use snyk wizard to generate fix PRs.",
          steps: [
            "Install Snyk CLI: npm install -g snyk (or brew install snyk-cli)",
            "Authenticate: snyk auth (free account)",
            "Run a scan: snyk test in a project directory — review the vulnerability list",
            "Scan a Docker image: snyk container test node:18 (check for OS-level CVEs)",
            "Use snyk wizard to auto-generate fix PRs for the top vulnerabilities",
          ],
          estMinutes: 60,
          xp: 70,
          tags: ["ai", "bonus", "security", "devsecops"],
        },
        {
          id: "t3-virustotal",
          title: "VirusTotal Code Insight — AI analysis of malware and zero-day exploits",
          why: "VirusTotal Code Insight analyzes binary files and scripts to summarize malware characteristics and zero-day exploits. Instead of manually reverse-engineering a suspicious file, the AI provides a human-readable summary of what the file does, what it connects to, and whether it's malicious. This cuts analysis time from hours to minutes.",
          brief: "VirusTotal (owned by Google) scans files against 70+ antivirus engines and, with Code Insight, uses AI to summarize what a file does. Upload a suspicious file (or hash) to virustotal.com, review the detection ratio, and read the AI-generated Code Insight summary. Try this: download the EICAR test file (a safe, standard malware test sample), upload it to VirusTotal, and review the Code Insight summary — then compare with the EICAR test file's known behavior.",
          steps: [
            "Download the EICAR test file: https://secure.eicar.org/eicar.com.txt (safe, standard AV test)",
            "Go to virustotal.com (free account) and upload the EICAR file",
            "Review the detection ratio (should be 60+ engines flagging it)",
            "Read the Code Insight AI summary — does it correctly describe the file as a test string?",
            "Upload a real script (e.g. a bash script you wrote) and review what the AI says it does",
          ],
          estMinutes: 45,
          xp: 50,
          tags: ["ai", "bonus", "security"],
        },
      ],
    },
    {
      id: "industry-practices",
      title: "Security Industry Practices with AI",
      description: "The 2026 cybersecurity practices — STRIDE/MITRE ATT&CK threat modeling, SIEM/SOAR integration, UEBA, and shift-left security — are how AI-assisted security teams operate. AI tools generate detections and responses, but these frameworks ensure they're comprehensive and integrated.",
      tasks: [
        {
          id: "t1-stride",
          title: "STRIDE & MITRE ATT&CK — threat modeling and adversary emulation",
          why: "STRIDE and MITRE ATT&CK are the standard frameworks for threat modeling and adversary emulation. STRIDE (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) helps you systematically identify threats in a design. MITRE ATT&CK maps real adversary techniques to detections. Every security engineer must know both — they're interview staples.",
          brief: "STRIDE is a checklist for finding threats in a system design. Take an architecture diagram and apply each STRIDE category: can an attacker spoof a user? Tamper with data? Deny an action? etc. MITRE ATT&CK is a knowledge base of adversary techniques — map your detections to ATT&CK techniques to ensure coverage. Try this: take a simple web app architecture (client, API, database), apply STRIDE to identify 6 threats (one per category), and map each to a MITRE ATT&CK technique.",
          steps: [
            "Draw a simple architecture: web client → API server → Postgres database → S3 storage",
            "Apply STRIDE: for each category, identify one threat (e.g. Spoofing: JWT token theft)",
            "Map each threat to a MITRE ATT&CK technique (e.g. T1552 Unsecured Credentials)",
            "For each threat, write a one-sentence mitigation (e.g. \"use short-lived JWTs with refresh tokens\")",
            "Document the full threat model in a markdown file — this is portfolio-ready",
          ],
          estMinutes: 90,
          xp: 90,
          tags: ["ai", "bonus", "security", "threat-modeling"],
        },
        {
          id: "t2-shift-left",
          title: "Shift-left security — SAST and SCA embedded in CI pipelines",
          why: "Shift-left security embeds static application security tests (SAST) and software composition analysis (SCA) into CI pipelines. Instead of finding vulnerabilities in production (expensive), you catch them in the PR (cheap). With AI generating 45% of code with vulnerabilities, shift-left is the only way to keep up — manual review can't scale to AI output volume.",
          brief: "Shift-left means security checks run on every PR, before merge. Add SAST (static analysis — finds injection flaws, hardcoded secrets) and SCA (dependency scanning — finds vulnerable npm/pip packages) to your CI. GitHub CodeQL is free SAST; Snyk/Dependabot is free SCA. Try this: enable Dependabot alerts + CodeQL on a GitHub repo, deliberately commit a SQL injection vulnerability, and watch the PR get flagged before merge.",
          steps: [
            "In a GitHub repo: Settings → Code security → enable Dependabot alerts + security updates",
            "Enable CodeQL: Settings → Code security → Code scanning → Set up CodeQL",
            "Deliberately commit a vulnerability: a SQL string concatenation in a query",
            "Open a PR — CodeQL should flag the SQL injection and block the merge",
            "Fix the vulnerability (use parameterized queries) and verify the PR passes",
          ],
          estMinutes: 75,
          xp: 80,
          tags: ["ai", "bonus", "security", "devsecops"],
        },
      ],
    },
  ],
};

// ============================================================
// Career: mobile-dev
// (Report section 9)
// ============================================================

const MOBILE_DEV: AIBonusCareerContent = {
  title: "AI in Mobile Development — Bonus Track",
  subtitle: "On-device ML, AI-assisted native UIs, and mobile CI/CD",
  objectives: [
    "Use AI mobile tools (Gemini in Android Studio, Xcode AI Assistant) for native development",
    "Apply native declarative UIs (SwiftUI, Jetpack Compose) and Kotlin Multiplatform with AI assistance",
    "Build a portfolio with live App Store/Google Play deployments and crash analytics",
  ],
  modules: [
    {
      id: "ai-tools",
      title: "AI Mobile Development Tools",
      description: LANDSCAPE_CONTEXT + " For mobile developers, Xcode's AI Assistant supports multi-model local assistance with latencies under 400ms, and Gemini in Android Studio resolves Gradle build errors and supports Jetpack Compose development. On-device AI via Apple Neural Engines and Android NPUs enables privacy-preserving ML features.",
      tasks: [
        {
          id: "t1-xcode-ai",
          title: "Xcode AI Assistant — SwiftUI layouts and multi-model local assistance",
          why: "Xcode AI Assistant supports SwiftUI layouts and multi-model local assistance for Apple platforms. It runs on-device (Apple Neural Engine), so your code never leaves the device — a privacy advantage over cloud-based assistants. For iOS developers, this is the most integrated AI tool, with latencies under 400ms for local suggestions.",
          brief: "Xcode's built-in AI assistant (Xcode 16+) helps you write SwiftUI views, fix Swift errors, and generate boilerplate — all on-device. Open Xcode, start a new SwiftUI project, and use the AI assistant (Cmd+/ or the inline prompt) to generate a view. The key skill is writing precise SwiftUI descriptions. Try this: ask Xcode AI to \"generate a SwiftUI login form with email and password fields, validation, and a submit button\" — then customize the generated view.",
          steps: [
            "Open Xcode 16+ and create a new iOS App project with SwiftUI interface",
            "Press Cmd+/ (or use the inline AI prompt) to open the AI assistant",
            "Ask it to: \"generate a SwiftUI List with a NavigationLink for each item in an array\"",
            "Review the generated SwiftUI code — check it compiles and renders in the preview",
            "Ask a follow-up: \"add a swipe-to-delete gesture on each row\"",
          ],
          estMinutes: 60,
          xp: 70,
          tags: ["ai", "bonus", "mobile"],
        },
        {
          id: "t2-gemini-android",
          title: "Gemini in Android Studio — Gradle troubleshooting and Compose support",
          why: "Gemini in Android Studio resolves Gradle build errors and supports Jetpack Compose development. Gradle errors are notoriously cryptic — Gemini explains them in plain English and suggests fixes. For Android developers, this alone saves hours per week. It also generates Compose UI code from descriptions.",
          brief: "Gemini in Android Studio is a built-in AI assistant that explains build errors, generates Jetpack Compose code, and answers Android development questions. Open Android Studio, start a new Compose project, and when you hit a Gradle error, ask Gemini to explain it. For UI, ask it to generate a Compose function. Try this: create a new Compose project, ask Gemini to \"generate a Compose function for a bottom navigation bar with 3 tabs\", and integrate it into your MainActivity.",
          steps: [
            "Open Android Studio (Hedgehog+) and create a new Empty Compose Activity project",
            "Open the Gemini panel (View → Tool Windows → Gemini)",
            "Ask it to: \"generate a Jetpack Compose function for a profile card with avatar, name, and bio\"",
            "Copy the generated @Composable function into your project and preview it",
            "Introduce a deliberate Gradle error (e.g. wrong dependency version) and ask Gemini to explain the error",
          ],
          estMinutes: 75,
          xp: 80,
          tags: ["ai", "bonus", "mobile"],
        },
        {
          id: "t3-on-device-ml",
          title: "On-device ML — Core ML (iOS) and ML Kit (Android) for privacy-preserving features",
          why: "On-device ML via Apple Neural Engines and Android NPUs enables AI features that work offline and keep user data private — never sending it to a cloud server. This is a 2026 hiring signal: apps that process sensitive data (health, finance) require on-device ML. Local mobile AI latencies are now under 400ms, making on-device viable for real-time features.",
          brief: "On-device ML runs models directly on the phone's neural chip — no network needed. For iOS, use Core ML with a pretrained model (e.g. MobileNet for image classification). For Android, use ML Kit (Google's on-device ML SDK). The advantage is privacy (data never leaves the device) and offline capability. Try this: add Core ML image classification to an iOS app — take a photo, classify it on-device in <400ms, and display the result.",
          steps: [
            "Download a pretrained Core ML model from Apple's model gallery (e.g. MobileNetV2)",
            "Drag the .mlmodel file into your Xcode project (Xcode auto-generates a Swift class)",
            "Import Vision framework, create a VNCoreMLRequest with the model",
            "Add a UIImagePicker to let the user take a photo, then run the classification request",
            "Display the top-3 classification results with confidence scores — all on-device, no network",
          ],
          estMinutes: 120,
          xp: 120,
          tags: ["ai", "bonus", "mobile", "on-device-ml"],
        },
      ],
    },
    {
      id: "industry-practices",
      title: "Mobile Industry Practices with AI",
      description: "The 2026 mobile practices — native declarative UIs (SwiftUI, Jetpack Compose), Kotlin Multiplatform for shared logic, and automated crash analytics — are what make AI-assisted mobile apps production-ready. Live App Store/Google Play deployments are a top career-readiness signal.",
      tasks: [
        {
          id: "t1-declarative-ui",
          title: "Native declarative UIs — SwiftUI and Jetpack Compose as the modern standard",
          why: "Native declarative UIs using SwiftUI for iOS and Jetpack Compose for Android are the modern standard — Apple and Google have both moved away from imperative UI (UIKit, XML layouts). AI assistants generate declarative UI code, so you must understand the paradigm to review and customize it. Every mobile job in 2026 expects declarative UI skills.",
          brief: "Declarative UI means you describe WHAT the UI should look like for a given state, and the framework handles the updates when state changes (no manual DOM/view manipulation). Build a small screen in both SwiftUI and Jetpack Compose — note how similar the paradigms are. Try this: build a todo list screen in SwiftUI (@State + List + ForEach), then build the same screen in Jetpack Compose (remember + LazyColumn + items), and compare the code side by side.",
          steps: [
            "In Xcode, build a SwiftUI todo screen: @State var items, a List with ForEach, and an add button",
            "In Android Studio, build the same in Compose: remember { mutableStateListOf() }, LazyColumn, items()",
            "Add a swipe-to-delete gesture in both (SwipeActions in SwiftUI, SwipeToDismiss in Compose)",
            "Compare: note how both use state-driven declarative patterns despite different syntax",
            "Persist the list: use @AppStorage (SwiftUI) and DataStore (Compose) to survive app restarts",
          ],
          estMinutes: 120,
          xp: 100,
          tags: ["ai", "bonus", "mobile"],
        },
        {
          id: "t2-crash-analytics",
          title: "Automated crash analytics — Firebase Crashlytics and Sentry",
          why: "Using Firebase App Quality Insights or Sentry to monitor real-world stability is a 2026 industry requirement. When you ship AI-assisted mobile code, you need real-time crash reporting to catch issues AI testing missed. Live app store deployments with crash analytics evidence are a top career-readiness signal — recruiters want to see you can ship AND maintain.",
          brief: "Crash analytics tools (Firebase Crashlytics, Sentry) automatically capture crashes in production, group them by root cause, and alert you. Integrate Crashlytics into an iOS or Android app, ship a test build with a deliberate crash, and view the crash report in the Firebase console. Try this: add Crashlytics to a small iOS app, trigger a deliberate crash (force-unwrap a nil), ship to TestFlight, and review the stack trace in the Firebase console.",
          steps: [
            "Create a Firebase project and add an iOS or Android app (follow the setup wizard)",
            "Install Crashlytics: CocoaPods/SPM for iOS, or Gradle dependency for Android",
            "Add a deliberate crash button: fatalError() in Swift or throw RuntimeException() in Kotlin",
            "Ship to TestFlight (iOS) or Internal Testing (Android) and tap the crash button",
            "Open the Firebase console → Crashlytics — verify the crash appears with a full stack trace",
          ],
          estMinutes: 90,
          xp: 80,
          tags: ["ai", "bonus", "mobile", "analytics"],
        },
      ],
    },
  ],
};

// ============================================================
// Career: game-dev
// (Report section 10)
// ============================================================

const GAME_DEV: AIBonusCareerContent = {
  title: "AI in Game Development — Bonus Track",
  subtitle: "AI engine assistants, generative assets, and high-fidelity rendering",
  objectives: [
    "Use AI game tools (Unity AI Suite, Summer Engine, Rosebud AI) for coding and asset generation",
    "Apply high-fidelity rendering (Lumen, Nanite) and distributed compilation with AI assistance",
    "Build a portfolio with playable browser game deployments and performance profiling evidence",
  ],
  modules: [
    {
      id: "ai-tools",
      title: "AI Game Development Tools",
      description: LANDSCAPE_CONTEXT + " For game developers, AI tools deliver up to 50% automated test case reduction and save weeks on asset generation. Unity AI Suite (Muse & Sentis) accelerates C# coding and runs ML models on-device, Summer Engine is an in-engine assistant for Godot 4, and Meshy/Leonardo AI generate 3D assets from text.",
      tasks: [
        {
          id: "t1-unity-muse",
          title: "Unity AI Suite (Muse & Sentis) — AI coding and on-device ML in Unity",
          why: "Unity AI Suite accelerates C# coding (Muse) and runs machine learning models locally on target devices (Sentis). Muse generates C# scripts and shaders from descriptions; Sentis lets you run neural networks inside Unity for NPC behavior, without a server. Together, they cut development time and enable AI features that run on-device — important for games where latency matters.",
          brief: "Unity Muse is an AI assistant inside the Unity Editor that generates C# scripts, shaders, and sprites from text descriptions. Unity Sentis runs neural networks on-device inside Unity. Open Unity, install Muse from the Package Manager, and ask it to generate a C# script (e.g. \"a script that moves the player with WASD\"). For Sentis, download a pretrained ONNX model and run it inside Unity. Try this: use Muse to generate a player-movement script, then use Sentis to run a simple image-classification model on a texture at runtime.",
          steps: [
            "Open Unity 6+ and install the Muse package (Window → Package Manager → Muse)",
            "Open Muse Chat and ask: \"generate a C# script for a third-person camera that follows the player\"",
            "Attach the generated script to your Main Camera and test in Play mode",
            "Install Unity Sentis and download a small ONNX model (e.g. from the Unity Sentis samples)",
            "Run the model at runtime on a captured frame from the game camera",
          ],
          estMinutes: 120,
          xp: 110,
          tags: ["ai", "bonus", "game"],
        },
        {
          id: "t2-meshy",
          title: "Meshy / Leonardo AI — generative 3D assets and concept art",
          why: "Meshy and Leonardo AI are generative assistants for building 3D assets, textures, and concept art. They save weeks on asset generation — a 3D model that takes a human artist 2 days can be generated in minutes. For indie game developers and small studios, these tools make asset production viable without a dedicated art team.",
          brief: "Meshy generates 3D models from text prompts or images; Leonardo AI generates concept art and textures. Go to meshy.ai, type a prompt (e.g. \"a low-poly fantasy sword\"), and download the generated .obj or .fbx file. Import it into Unity or Godot. The quality varies — expect to iterate on prompts and sometimes clean up the mesh in Blender. Try this: generate 3 low-poly props (sword, shield, potion) with Meshy, import them into a game engine, and place them in a scene.",
          steps: [
            "Go to meshy.ai (free tier with daily credits)",
            "Generate a 3D model: prompt \"low-poly wooden treasure chest, game-ready, stylized\"",
            "Download the .fbx file and import it into Unity (Assets → Import New Asset)",
            "Add the model to a scene, add a material, and test it in Play mode",
            "Generate a texture with Leonardo AI (leonardo.ai) and apply it to the chest model",
          ],
          estMinutes: 75,
          xp: 70,
          tags: ["ai", "bonus", "game", "assets"],
        },
        {
          id: "t3-summer-engine",
          title: "Summer Engine — in-engine AI assistant for Godot 4",
          why: "Summer Engine is an in-engine assistant for Godot 4 that writes C# and GDScript and reviews build logs. Godot is the fastest-growing open-source game engine, and Summer Engine brings AI-assisted development to it — particularly valuable for GDScript, where general-purpose LLMs are less reliable than for mainstream languages.",
          brief: "Summer Engine is an AI assistant plugin for Godot 4 that writes GDScript/C# and helps debug build errors. Install the plugin in Godot 4, open a project, and use the AI panel to generate a script (e.g. \"a GDScript for a 2D platformer player with double jump\"). Review the generated code — GDScript has a unique syntax, so verify it compiles. Try this: install Summer Engine in Godot 4, generate a player-controller script for a 2D platformer, and test it in a scene with a CharacterBody2D.",
          steps: [
            "Download Godot 4 (free, open source) from godotengine.org",
            "Install the Summer Engine plugin from the Asset Library (or GitHub)",
            "Create a new 2D scene with a CharacterBody2D and a Sprite2D",
            "Ask Summer Engine: \"generate a GDScript for a 2D platformer player with WASD movement and jumping\"",
            "Attach the script, run the scene, and test the movement — refine the script as needed",
          ],
          estMinutes: 90,
          xp: 90,
          tags: ["ai", "bonus", "game"],
        },
      ],
    },
    {
      id: "industry-practices",
      title: "Game Industry Practices with AI",
      description: "The 2026 game development practices — high-fidelity rendering (Lumen, Nanite), distributed compilation, asset version control (Perforce), and Model Context Protocol for AI-engine integration — are what make AI-assisted game development scalable. Playable browser deployments with performance profiling evidence are a top career-readiness signal.",
      tasks: [
        {
          id: "t1-unreal-rendering",
          title: "High-fidelity rendering — Unreal Engine's Lumen and Nanite",
          why: "Unreal Engine's Lumen (real-time global illumination) and Nanite (virtualized geometry) are the 2026 standard for high-fidelity rendering. Lumen eliminates baked lighting; Nanite enables film-quality assets in real-time. Knowing these systems is a hiring signal for AAA game studios. AI tools can help configure and troubleshoot them.",
          brief: "Lumen provides real-time dynamic global illumination (light bounces realistically without baking). Nanite renders billions of polygons by only drawing what's visible. Open Unreal Engine 5, create a new project with the Lumen+Nanite template, import a high-poly Nanite-compatible mesh, and add dynamic lights. Move lights around in real-time and watch Lumen update. Try this: set up a scene with a Nanite statue and a moving spotlight, and compare the lighting quality to a traditional baked-lighting setup.",
          steps: [
            "Install Unreal Engine 5 (free from the Epic Games Launcher) and create a blank project",
            "Enable Nanite: create a Nanite Mesh (import a high-poly model with Nanite enabled)",
            "Add a few dynamic lights (point light, spotlight) and ensure Lumen is enabled in project settings",
            "Move the lights in real-time during Play mode — watch Lumen bounce the light dynamically",
            "Profile performance with stat unit — verify Nanite keeps the frame rate high despite high poly count",
          ],
          estMinutes: 120,
          xp: 100,
          tags: ["ai", "bonus", "game", "rendering"],
        },
        {
          id: "t2-playable-deploy",
          title: "Playable browser game deployment with performance profiling",
          why: "Candidates must have fully functional game loops deployed on platforms like itch.io, and evidence of managing frame rates and minimizing shader compilation stutters is required. A playable browser deployment proves you can ship a complete game loop — not just a tech demo. This is the top career-readiness signal for game developers.",
          brief: "Deploy a small game to itch.io as a playable WebGL build. Use Godot or Unity (both support WebGL export). Before deploying, profile the game to ensure a stable 60 FPS and no shader compilation stutters (which cause one-frame hitches). Export the game, upload to itch.io, and test in a browser. Try this: build a small 2D game in Godot, export to WebGL, upload to itch.io, and verify it runs at 60 FPS in Chrome with no stuttering.",
          steps: [
            "Build a minimal game loop in Godot 4 (player movement + one collectible + win condition)",
            "Profile: use Godot's built-in profiler (Debugger → Profiler) — identify any frame spikes",
            "Optimize: if FPS drops below 60, reduce draw calls or simplify physics",
            "Export to WebGL: Project → Export → Add HTML5, then Project → Export to produce a .zip",
            "Upload the .zip to itch.io (free account), set it as playable in-browser, and test in Chrome",
          ],
          estMinutes: 150,
          xp: 120,
          tags: ["ai", "bonus", "game", "deployment"],
        },
      ],
    },
  ],
};

// ============================================================
// Career: hardware-embedded
// (Report section 11)
// ============================================================

const HARDWARE_EMBEDDED: AIBonusCareerContent = {
  title: "AI in Hardware/Embedded — Bonus Track",
  subtitle: "AI-assisted PCB design, TinyML, and hardware-software co-design",
  objectives: [
    "Use AI hardware tools (Flux.ai, JITX, Edge Impulse) for schematic design and TinyML",
    "Apply RTOS development and Hardware-in-the-Loop testing with AI assistance",
    "Build a portfolio with physical PCB designs, bare-metal firmware, and hardware diagnostics",
  ],
  modules: [
    {
      id: "ai-tools",
      title: "AI Hardware Design & TinyML Tools",
      description: LANDSCAPE_CONTEXT + " For hardware/embedded engineers, AI tools deliver 25× faster PCB design compiling and 65% to 90% manual layout effort savings. Flux.ai/JITX automate schematic wiring, Edge Impulse reduces neural network RAM usage by 25% to 55%, and TensorFlow Lite for Microcontrollers runs inference on 20+ hardware platforms.",
      tasks: [
        {
          id: "t1-flux",
          title: "Flux.ai / JITX — browser-based schematic design and PCB routing automation",
          why: "Flux.ai and JITX are browser-based suites that automate schematic wiring and compile hardware specs into PCB routing. They deliver 25× faster PCB design compiling and 65% to 90% manual layout effort savings. For hardware engineers, these tools transform PCB design from a weeks-long manual process into a days-long AI-assisted one.",
          brief: "Flux.ai is a browser-based circuit design tool with an AI copilot that suggests components, auto-wires connections, and checks for design rule violations. JITX lets you describe hardware in code (like programming, but for circuits). Go to flux.ai, create a new project, and use the AI copilot to build a simple LED blinker circuit with a 555 timer. Try this: design a simple circuit in Flux.ai with AI assistance, run the built-in circuit simulator, and export the schematic as a PDF.",
          steps: [
            "Go to flux.ai and create a free account, then start a new project",
            "Use the AI copilot (chat panel): \"design a 555 timer LED blinker circuit with a 9V battery\"",
            "Review the AI-suggested schematic — check component values (resistors, capacitors)",
            "Run the built-in circuit simulator — verify the LED blinks at the expected frequency",
            "Export the schematic as a PDF and the netlist for a PCB layout tool",
          ],
          estMinutes: 90,
          xp: 90,
          tags: ["ai", "bonus", "hardware"],
        },
        {
          id: "t2-edge-impulse",
          title: "Edge Impulse — TinyML platform that reduces neural network RAM by 25-55%",
          why: "Edge Impulse is an end-to-end TinyML platform that reduces neural network RAM usage by 25% to 55% — critical for microcontrollers with 64KB of RAM. It handles the full pipeline: data collection, model training, quantization, and deployment to embedded targets. This is the dominant TinyML platform in 2026 and a required skill for embedded AI jobs.",
          brief: "Edge Impulse is a cloud-based platform for building TinyML models that run on microcontrollers. You collect sensor data (via your phone or a dev board), upload it to Edge Impulse, train a model, and deploy it as optimized C++ to an ESP32, Arduino, or other target. The platform auto-quantizes the model to fit in tiny RAM. Try this: collect accelerometer data (wave vs. circle motion) with your phone via the Edge Impulse app, train a classifier, and deploy it to an ESP32 (or simulate in the browser).",
          steps: [
            "Create a free Edge Impulse account and start a new project",
            "Install the Edge Impulse app on your phone and collect 30s of \"wave\" + 30s of \"circle\" accelerometer data",
            "Design an impulse: spectral features → neural network classifier (all in the browser)",
            "Train the model — Edge Impulse auto-quantizes it to fit in microcontroller RAM",
            "Deploy: download the C++ library and run it on an ESP32 (or use the browser simulator)",
          ],
          estMinutes: 150,
          xp: 130,
          tags: ["ai", "bonus", "hardware", "tinyml"],
        },
        {
          id: "t3-tflite-micro",
          title: "TensorFlow Lite for Microcontrollers — on-device inference on 20+ platforms",
          why: "TensorFlow Lite for Microcontrollers (TFLM) is a lightweight framework supporting over 20 hardware platforms for on-device inference. It's the open-source foundation under most TinyML deployments — Edge Impulse exports to TFLM. Knowing TFLM directly is valuable for embedded engineers who need to customize the inference pipeline beyond what platform tools offer.",
          brief: "TFLM runs small neural networks on microcontrollers (ESP32, Arduino, STM32) with as little as 16KB of RAM. It's a C++ library you compile into your firmware. Start with the official \"hello world\" example (sin wave prediction) on an ESP32 or Arduino Nano 33 BLE Sense. Try this: build the TFLM sine-function example on an ESP32, flash it, and verify the model's predictions match the actual sine function on the serial monitor.",
          steps: [
            "Install PlatformIO (VS Code extension) for embedded development",
            "Clone the TFLM examples: github.com/tensorflow/tflite-micro",
            "Build the \"hello_world\" example for ESP32: the model predicts sin(x) from a trained model",
            "Flash the firmware to an ESP32 (or run the Desktop simulation if no hardware)",
            "Open the serial monitor — verify the model's sine predictions match the true sin(x) values",
          ],
          estMinutes: 120,
          xp: 110,
          tags: ["ai", "bonus", "hardware", "tinyml"],
        },
      ],
    },
    {
      id: "industry-practices",
      title: "Embedded Industry Practices with AI",
      description: "The 2026 embedded practices — hardware-software co-design, RTOS development (FreeRTOS, Zephyr), and Hardware-in-the-Loop testing — are what make AI-assisted embedded systems reliable. Physical PCB designs, bare-metal firmware, and hardware diagnostic competencies are the top career-readiness signals.",
      tasks: [
        {
          id: "t1-rtos",
          title: "RTOS development — FreeRTOS and Zephyr for time-sensitive tasks",
          why: "RTOS (Real-Time Operating System) development using FreeRTOS or Zephyr coordinates time-sensitive tasks on microcontrollers. Unlike a simple superloop, an RTOS lets you run multiple tasks with deterministic scheduling — essential for real-time systems (motor control, sensor fusion, communication). Every embedded job beyond basic Arduino work expects RTOS experience.",
          brief: "An RTOS (FreeRTOS, Zephyr) lets you run multiple \"tasks\" (threads) on a microcontroller with priority-based preemptive scheduling — ensuring time-critical tasks always run on time. Install PlatformIO, create a FreeRTOS project for ESP32, and create 2 tasks (e.g. blink an LED + read a sensor) with different priorities. Try this: build a FreeRTOS project on ESP32 with a high-priority sensor-reading task and a low-priority LED-blink task — verify the sensor task preempts the LED task.",
          steps: [
            "Install PlatformIO in VS Code and create a new ESP32 project",
            "Write a FreeRTOS program with 2 tasks: vSensorTask (high priority) and vLedTask (low priority)",
            "vSensorTask: read an analog pin every 100ms, vLedTask: blink an LED every 500ms",
            "Add a shared resource (a global variable) protected by a mutex — both tasks access it safely",
            "Flash to ESP32 and use the serial monitor — verify the high-priority task preempts the low-priority one",
          ],
          estMinutes: 120,
          xp: 100,
          tags: ["ai", "bonus", "hardware", "rtos"],
        },
        {
          id: "t2-hil",
          title: "Hardware-in-the-Loop (HIL) testing — automated firmware validation",
          why: "HIL testing deploys automated test loops where compiled firmware is flashed to physical systems and tested against simulated inputs. It's how automotive, aerospace, and medical device teams validate firmware before deployment. With AI generating embedded code, HIL is the safety net that catches issues simulation alone can't find — because it tests real hardware behavior.",
          brief: "HIL testing means your firmware runs on REAL hardware, but the inputs come from an automated test harness (simulating sensors, actuators, and edge cases). Set up a simple HIL test: flash firmware to an ESP32, use a Python script to send test inputs via serial, and assert the outputs match expectations. Try this: write an ESP32 firmware that reads a temperature sensor and controls a fan, then write a Python HIL test that sends fake temperature values via serial and verifies the fan-control output.",
          steps: [
            "Write ESP32 firmware: reads a temperature from serial, returns 'FAN_ON' if temp > 30, else 'FAN_OFF'",
            "Flash the firmware to an ESP32 connected via USB",
            "Write a Python HIL test using pyserial: send '25\\n' → expect 'FAN_OFF', send '35\\n' → expect 'FAN_ON'",
            "Add edge-case tests: send '30' (boundary), send 'abc' (invalid), send '' (empty)",
            "Automate: run the test suite in CI with pytest — flash firmware, run tests, report results",
          ],
          estMinutes: 120,
          xp: 100,
          tags: ["ai", "bonus", "hardware", "testing"],
        },
      ],
    },
  ],
};

// ============================================================
// Master map: careerId → research-backed AI Bonus Track content.
// All 9 app careers have a corresponding section in the research
// report — no gaps, no fabrication.
// ============================================================

export const AI_BONUS_TRACK_CONTENT: Record<string, AIBonusCareerContent> = {
  "software-engineering": SOFTWARE_ENGINEERING,
  "web-dev": WEB_DEV,
  "cloud-devops": CLOUD_DEVOPS,
  "data-science": DATA_SCIENCE,
  "ai-ml": AI_ML,
  "cybersecurity": CYBERSECURITY,
  "mobile-dev": MOBILE_DEV,
  "game-dev": GAME_DEV,
  "hardware-embedded": HARDWARE_EMBEDDED,
};

// ============================================================
// Default fallback content (used only if an unknown careerId is
// passed — should never happen since all 9 careers are mapped,
// but prevents a crash if the career catalog is extended).
// ============================================================

const FALLBACK: AIBonusCareerContent = {
  title: "AI Foundations — Bonus Track",
  subtitle: "Integrating AI into your career path",
  objectives: [
    "Understand how AI is changing your field",
    "Learn to use AI tools productively",
    "Build a small AI-powered feature",
  ],
  modules: [
    {
      id: "ai-foundations",
      title: "AI foundations for your career",
      description: LANDSCAPE_CONTEXT + " This is a general AI foundations track. If you're seeing this, your career path may not yet have a dedicated research-backed AI Bonus Track — let us know so we can add one.",
      tasks: [
        {
          id: "t1-explore",
          title: "Explore AI tools relevant to your career",
          why: "AI adoption among professional developers ranges from 84% to 91% in 2026, with task completion speeds increasing 10% to 55.8%. Every career path now has AI tools that dramatically accelerate work — exploring them is the first step to staying competitive. Daily AI users achieve ~60% higher output volume than infrequent users.",
          brief: "Research 2-3 AI tools relevant to your specific career path. For software engineers, this means coding assistants (Copilot, Cursor). For data scientists, analysis tools (PandasAI, Jupyter AI). For DevOps, IaC assistants (Amazon Q, Aider). Pick one tool, install it, and use it for a real task this week. The key is to start using AI tools daily — the productivity gap between daily and infrequent users is 60%. Try this: pick one AI tool from your field, install it, and complete one real task with it today.",
          steps: [
            "Search for \"AI tools for [your career]\" and read 1-2 recent articles (2025-2026)",
            "Pick one tool that has a free tier and install it",
            "Use it for a real task you'd do anyway (write code, analyze data, generate config)",
            "Note how much time it saved and what its limitations are",
            "Make it a daily habit — the productivity gains compound with regular use",
          ],
          estMinutes: 60,
          xp: 50,
          tags: ["ai", "bonus"],
        },
      ],
    },
  ],
};

export function getAIBonusContent(careerId: string): AIBonusCareerContent {
  return AI_BONUS_TRACK_CONTENT[careerId] ?? FALLBACK;
}
