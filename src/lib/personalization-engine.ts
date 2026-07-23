import type {
  CareerId,
  GeneratedPhase,
  GeneratedRoadmap,
  LanguageInfo,
  PersonalizationInput,
  PhaseColor,
  RoadmapSource,
  SkillLevel,
} from "./types";
import { CAREER_MAP, LANGUAGE_MAP, OCCUPATION_MAP, LANGUAGES } from "./career-data";
// v5.92 FIX: use ESM import instead of require() — require() doesn't work in browser/ESM
import { topologicalSort } from "./dependency-graph";
// v5.932: Research-backed AI Bonus Track content (sole source: Consolidated
// AI Tools and Industry Practices Career Guide 2026). See ai-bonus-track-data.ts.
import { getAIBonusContent } from "./ai-bonus-track-data";
import { getTrackLessons } from "./lessons-data";

// ============================================================
// PERSONALIZATION ENGINE
// Generates a unique 6-phase roadmap for each user based on
// career, languages, occupation, skill level, and availability.
// ============================================================

const PHASE_TEMPLATES: Array<{
  id: string;
  number: number;
  title: string;
  subtitle: string;
  color: PhaseColor;
  icon: string;
}> = [
  { id: "phase-1-foundations", number: 1, title: "Foundations", subtitle: "Programming basics & first programs", color: "teal", icon: "🌱" },
  { id: "phase-2-core-language", number: 2, title: "Core Language Mastery", subtitle: "Syntax, data structures, algorithms", color: "violet", icon: "⚡" },
  { id: "phase-3-building-blocks", number: 3, title: "Building Blocks", subtitle: "Projects, tools, version control", color: "amber", icon: "🧱" },
  { id: "phase-4-specialization", number: 4, title: "Specialization", subtitle: "Frameworks & domain skills", color: "rose", icon: "🎯" },
  { id: "phase-5-advanced-topics", number: 5, title: "Advanced Topics", subtitle: "Performance, security, architecture", color: "emerald", icon: "🚀" },
  { id: "phase-6-capstone-career", number: 6, title: "Capstone & Career", subtitle: "Portfolio, interview prep, ship", color: "sky", icon: "🏆" },
];

// Difficulty multipliers per skill level
const SKILL_LEVEL_MULTIPLIER: Record<SkillLevel, number> = {
  beginner: 1.0, // full timeline
  intermediate: 0.7, // skip basics
  advanced: 0.45, // jump to specialization
};

// Occupation pace multipliers
const PACE_MULTIPLIER: Record<string, number> = {
  foundational: 1.0,
  condensed: 0.75,
};

// Compute weekly hours and overall timeline multiplier
function computeTimeline(input: PersonalizationInput): {
  weeklyHours: number;
  timelineMultiplier: number;
  totalWeeks: number;
  totalHours: number;
} {
  const weeklyHours = input.hoursPerDay * input.daysPerWeek;
  // Guard against zero weekly hours. The previous Math.max(weeklyHours, 1)
  // only protected the divisor — the totalHours calc still used raw
  // weeklyHours, producing 728-week roadmaps with 0 hours.
  const safeWeeklyHours = Math.max(weeklyHours, 1);
  // Standard baseline: 14 hr/week (2 hr/day × 7 days)
  const baselineWeekly = 14;
  // Timeline shrinks as weekly hours grow (more time = faster completion)
  const availabilityMultiplier = baselineWeekly / safeWeeklyHours;

  const skillMultiplier = SKILL_LEVEL_MULTIPLIER[input.skillLevel];
  const occupation = OCCUPATION_MAP[input.occupationId];
  const paceMultiplier = occupation ? PACE_MULTIPLIER[occupation.pace] : 1.0;

  // v5.77 fix: clamp the timeline multiplier to [0.25, 4.0] so extreme inputs
  // (e.g. 0 hours/day → availabilityMultiplier = 14) don't produce 728-week
  // roadmaps. 4.0 × 52 weeks = 208 weeks (4 years) is the practical max.
  const rawTimelineMultiplier = skillMultiplier * paceMultiplier * availabilityMultiplier;
  const timelineMultiplier = Math.max(0.25, Math.min(4.0, rawTimelineMultiplier));

  // Base roadmap = 52 weeks (1 year) at 14 hr/week
  const baseWeeks = 52;
  const totalWeeks = Math.max(8, Math.round(baseWeeks * timelineMultiplier));
  const totalHours = Math.round(totalWeeks * safeWeeklyHours);

  return { weeklyHours: safeWeeklyHours, timelineMultiplier, totalWeeks, totalHours };
}

// Adjust phase weighting based on skill level — beginners spend more on phases 1-2,
// advanced learners skip ahead to phases 4-5. The arrays cover up to 9 phases
// (the modern roadmap layout adds a VS Code Setup phase at the start and an
// AI bonus phase at the end, so the old 6-element arrays misaligned weights).
function phaseWeight(phaseNumber: number, skillLevel: SkillLevel): number {
  // v5.929: updated for the new phase structure (Foundation=1, Primary lang=2,
  // Secondary langs=3+, AI Bonus=N-1, Capstone=N). Uses a flat default of 1.0
  // for all phases since the count is now variable. Foundation gets a lighter
  // weight, language phases get full weight, AI Bonus and Capstone get ~1.0.
  if (skillLevel === "beginner") {
    return [0.15, 1.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0][phaseNumber - 1] ?? 1.0;
  }
  if (skillLevel === "intermediate") {
    return [0.1, 0.8, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0][phaseNumber - 1] ?? 1.0;
  }
  // advanced
  return [0.05, 0.4, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0][phaseNumber - 1] ?? 1.0;
}

// ============================================================
// Task & module generation per phase
// ============================================================

function primaryLanguage(input: PersonalizationInput): LanguageInfo | null {
  if (input.selectedLanguageIds.length === 0) return null;
  // Prefer the first non-framework language
  const firstLang = input.selectedLanguageIds.find(
    (id) => LANGUAGE_MAP[id]?.type === "language",
  );
  const id = firstLang ?? input.selectedLanguageIds[0];
  return LANGUAGE_MAP[id] ?? null;
}

function secondaryLanguages(input: PersonalizationInput): LanguageInfo[] {
  // v5.77 fix: filter OUT the primary language instead of using positional slice(1).
  // Previously, if the user selected [react, python], primaryLanguage() returned
  // python (index 1), but slice(1) returned [python] — duplicating the primary
  // as a "secondary" language and creating a redundant "Second Language: Python" phase.
  const primary = primaryLanguage(input);
  return input.selectedLanguageIds
    .filter((id) => !primary || id !== primary.id)
    .map((id) => LANGUAGE_MAP[id])
    .filter(Boolean);
}

const CODE_EXAMPLES: Record<string, { language: "javascript" | "typescript" | "python"; code: string; filename?: string }> = {
  hello_python: {
    language: "python",
    filename: "hello.py",
    code: `# Your first Python program
print("Hello, Launchpad!")

# Variables
name = "Learner"
age = 25
print(f"My name is {name} and I'm {age} years old.")

# A simple function
def greet(who):
    return f"Welcome, {who}!"

print(greet(name))`,
  },
  hello_javascript: {
    language: "javascript",
    filename: "hello.js",
    code: `// Your first JavaScript program
console.log("Hello, Launchpad!");

// Variables
const name = "Learner";
const age = 25;
console.log(\`My name is \${name} and I'm \${age} years old.\`);

// A simple function
function greet(who) {
  return \`Welcome, \${who}!\`;
}

console.log(greet(name));`,
  },
  hello_typescript: {
    language: "typescript",
    filename: "hello.ts",
    code: `// Your first TypeScript program
const name: string = "Learner";
const age: number = 25;

function greet(who: string): string {
  return \`Welcome, \${who}!\`;
}

console.log(greet(name));`,
  },
  loops: {
    language: "python",
    filename: "loops.py",
    code: `# Loops let you repeat work without copy-paste
for i in range(5):
    print(f"Iteration {i}")

# While loop
count = 0
while count < 3:
    print(f"Counting: {count}")
    count += 1`,
  },
  loops_js: {
    language: "javascript",
    filename: "loops.js",
    code: `// Loops let you repeat work without copy-paste
for (let i = 0; i < 5; i++) {
  console.log(\`Iteration \${i}\`);
}

// While loop
let count = 0;
while (count < 3) {
  console.log(\`Counting: \${count}\`);
  count++;
}`,
  },
  functions: {
    language: "python",
    filename: "functions.py",
    code: `# Functions package reusable logic
def add(a, b):
    return a + b

def is_even(n):
    return n % 2 == 0

print(add(2, 3))         # 5
print(is_even(10))       # True
print(is_even(7))        # False`,
  },
  functions_js: {
    language: "javascript",
    filename: "functions.js",
    code: `// Functions package reusable logic
function add(a, b) {
  return a + b;
}

const isEven = (n) => n % 2 === 0;

console.log(add(2, 3));     // 5
console.log(isEven(10));    // true
console.log(isEven(7));     // false`,
  },
};

function helloCodeForLanguage(langId: string) {
  if (langId === "python") return CODE_EXAMPLES.hello_python;
  if (langId === "typescript") return CODE_EXAMPLES.hello_typescript;
  if (langId === "react" || langId === "nextjs") return CODE_EXAMPLES.hello_javascript;
  // Default: JS-style
  return CODE_EXAMPLES.hello_javascript;
}

function loopsCodeForLanguage(langId: string) {
  if (langId === "python" || langId === "django" || langId === "fastapi" || langId === "flask") {
    return CODE_EXAMPLES.loops;
  }
  return CODE_EXAMPLES.loops_js;
}

function functionsCodeForLanguage(langId: string) {
  if (langId === "python" || langId === "django" || langId === "fastapi" || langId === "flask") {
    return CODE_EXAMPLES.functions;
  }
  return CODE_EXAMPLES.functions_js;
}

// ============================================================
// Phase generation
// ============================================================

function genPhase1(input: PersonalizationInput, _timeline: { totalWeeks: number }): GeneratedPhase {
  const tpl = PHASE_TEMPLATES[0];
  const primary = primaryLanguage(input);
  const langId = primary?.id ?? "python";
  const langName = primary?.name ?? "Python";

  const modules = [
    {
      id: `${tpl.id}-m1-setup`,
      title: `Set up your ${langName} environment`,
      description: `Install ${langName}, a code editor, and run your first program.`,
      tasks: [
        {
          id: `${tpl.id}-m1-t1`,
          title: `Install ${langName} and an editor`,
          why: `A working setup is the price of entry — without it nothing else can happen.`,
          brief: `Install ${langName}, VS Code, and any official linter/formatter extension.`,
          steps: [
            `Download ${langName} from the official website`,
            "Install VS Code",
            `Install the ${langName} extension for VS Code`,
            `Verify by running: ${langId === "python" ? "python --version" : "node --version"}`,
          ],
          estMinutes: 60,
          xp: 30,
          tags: ["setup", "core"],
        },
        {
          id: `${tpl.id}-m1-t2`,
          title: `Run your first program`,
          why: `Proving you can execute code unblocks everything else.`,
          brief: `Write a "Hello, Launchpad!" program and run it locally.`,
          steps: [
            `Create a new file`,
            `Type the hello-world snippet`,
            `Run it from your terminal`,
            "Push it to a fresh GitHub repo",
          ],
          estMinutes: 45,
          xp: 40,
          tags: ["core"],
          codeExample: helloCodeForLanguage(langId),
        },
      ],
    },
    {
      id: `${tpl.id}-m2-variables`,
      title: "Variables, types, and operators",
      description: `Learn how ${langName} stores and manipulates data.`,
      tasks: [
        {
          id: `${tpl.id}-m2-t1`,
          title: `Learn ${langName} primitive types`,
          why: `Every program manipulates data — knowing the types available is foundational.`,
          brief: `Read about strings, numbers, booleans, and null/None in ${langName}.`,
          steps: [
            `Read the official ${langName} docs on data types`,
            "Write a script that declares each type",
            "Print the type of each variable",
          ],
          estMinutes: 90,
          xp: 50,
          tags: ["core"],
        },
        {
          id: `${tpl.id}-m2-t2`,
          title: "Practice operators and expressions",
          why: `Logic and arithmetic operators are the verbs of programming.`,
          brief: `Build a small calculator or expense tracker to practice operators.`,
          steps: [
            "Read about arithmetic, comparison, and logical operators",
            "Build a tiny REPL calculator",
            "Add input validation",
          ],
          estMinutes: 120,
          xp: 60,
          tags: ["core", "project"],
        },
      ],
    },
    {
      id: `${tpl.id}-m3-control-flow`,
      title: "Control flow: conditionals and loops",
      description: "Make decisions and repeat work.",
      tasks: [
        {
          id: `${tpl.id}-m3-t1`,
          title: "Master if/else and switch/match",
          why: `Conditionals are how programs make decisions.`,
          brief: `Write small programs that branch on user input.`,
          estMinutes: 90,
          xp: 50,
          tags: ["core"],
          codeExample: loopsCodeForLanguage(langId),
        },
        {
          id: `${tpl.id}-m3-t2`,
          title: "Practice loops",
          why: `Loops turn repetitive work into a single statement.`,
          brief: `Solve 5 small problems using for and while loops.`,
          estMinutes: 120,
          xp: 60,
          tags: ["core"],
        },
      ],
    },
  ];

  return {
    id: tpl.id,
    number: tpl.number,
    title: tpl.title,
    subtitle: tpl.subtitle,
    color: tpl.color,
    icon: tpl.icon,
    estWeeks: 1, // v5.85 fix (4.14): minimum 1 week to avoid confusing '0w' display // filled in below
    objectives: [
      `Install and run ${langName} on your machine`,
      "Understand variables, types, and operators",
      "Write programs with conditionals and loops",
    ],
    modules,
  };
}

function genPhase2(input: PersonalizationInput): GeneratedPhase {
  const tpl = PHASE_TEMPLATES[1];
  const primary = primaryLanguage(input);
  const langId = primary?.id ?? "python";

  return {
    id: tpl.id,
    number: tpl.number,
    title: tpl.title,
    subtitle: tpl.subtitle,
    color: tpl.color,
    icon: tpl.icon,
    estWeeks: 1, // v5.85 fix (4.14): minimum 1 week to avoid confusing '0w' display
    objectives: [
      "Master functions and modular code",
      "Work with collections (lists, dicts/maps, sets)",
      "Understand OOP / structuring larger programs",
      "Practice basic algorithms and complexity",
    ],
    modules: [
      {
        id: `${tpl.id}-m1-functions`,
        title: "Functions and modular code",
        description: "Package logic into reusable units.",
        tasks: [
          {
            id: `${tpl.id}-m1-t1`,
            title: "Define and call functions",
            why: `Functions are the building blocks of any non-trivial program.`,
            brief: `Learn parameters, return values, scope, and default arguments.`,
            estMinutes: 120,
            xp: 60,
            tags: ["core"],
            codeExample: functionsCodeForLanguage(langId),
          },
          {
            id: `${tpl.id}-m1-t2`,
            title: "Higher-order functions and lambdas",
            why: `Passing functions as data unlocks powerful, concise patterns.`,
            brief: `Practice map, filter, reduce (or ${langId === "python" ? "list comprehensions" : "array methods"}).`,
            estMinutes: 120,
            xp: 70,
            tags: ["core"],
          },
        ],
      },
      {
        id: `${tpl.id}-m2-collections`,
        title: "Collections and data structures",
        description: "Work with groups of data efficiently.",
        tasks: [
          {
            id: `${tpl.id}-m2-t1`,
            title: "Master lists, dicts/maps, sets",
            why: `Almost every program manipulates collections.`,
            brief: `Practice CRUD operations on each collection type.`,
            estMinutes: 120,
            xp: 60,
            tags: ["core"],
          },
          {
            id: `${tpl.id}-m2-t2`,
            title: "Implement a stack and queue",
            why: `Building data structures from scratch deepens understanding.`,
            brief: `Implement stack and queue using lists/arrays.`,
            estMinutes: 90,
            xp: 70,
            tags: ["core", "algorithms"],
          },
        ],
      },
      {
        id: `${tpl.id}-m3-oop`,
        title: "Object-oriented programming",
        description: "Model real-world entities with classes and objects.",
        tasks: [
          {
            id: `${tpl.id}-m3-t1`,
            title: "Define classes and objects",
            why: `OOP is the dominant paradigm for organizing large programs.`,
            brief: `Create a class with attributes, methods, and constructors.`,
            estMinutes: 120,
            xp: 70,
            tags: ["core"],
          },
          {
            id: `${tpl.id}-m3-t2`,
            title: "Practice inheritance and polymorphism",
            why: `These let you write flexible, reusable code.`,
            brief: `Build a small class hierarchy (e.g. Animal -> Dog, Cat).`,
            estMinutes: 120,
            xp: 80,
            tags: ["core"],
          },
        ],
      },
      {
        id: `${tpl.id}-m4-algorithms`,
        title: "Algorithms and complexity",
        description: "Solve problems and reason about efficiency.",
        tasks: [
          {
            id: `${tpl.id}-m4-t1`,
            title: "Learn Big O notation",
            why: `Big O lets you reason about how code scales.`,
            brief: `Read about O(1), O(log n), O(n), O(n log n), O(n^2).`,
            estMinutes: 90,
            xp: 60,
            tags: ["algorithms"],
          },
          {
            id: `${tpl.id}-m4-t2`,
            title: "Solve 10 algorithm problems",
            why: `Practice is the only way to internalize algorithmic thinking.`,
            brief: `Solve 10 easy/medium problems on LeetCode or HackerRank.`,
            estMinutes: 600,
            xp: 120,
            tags: ["algorithms", "stretch"],
          },
        ],
      },
    ],
  };
}

function genPhase3(input: PersonalizationInput): GeneratedPhase {
  const tpl = PHASE_TEMPLATES[2];
  const primary = primaryLanguage(input);
  const langName = primary?.name ?? "Python";

  return {
    id: tpl.id,
    number: tpl.number,
    title: tpl.title,
    subtitle: tpl.subtitle,
    color: tpl.color,
    icon: tpl.icon,
    estWeeks: 1, // v5.85 fix (4.14): minimum 1 week to avoid confusing '0w' display
    objectives: [
      "Master Git and GitHub workflow",
      `Build a CLI tool or small project in ${langName}`,
      "Learn debugging and testing basics",
      "Set up a professional development workflow",
    ],
    modules: [
      {
        id: `${tpl.id}-m1-git`,
        title: "Git & version control",
        description: "Track changes and collaborate.",
        tasks: [
          {
            id: `${tpl.id}-m1-t1`,
            title: "Learn Git basics",
            why: `Git is how every team manages code — non-negotiable.`,
            brief: `clone, add, commit, push, pull, branch, merge.`,
            estMinutes: 180,
            xp: 80,
            tags: ["core", "tools"],
          },
          {
            id: `${tpl.id}-m1-t2`,
            title: "Open your first pull request",
            why: `PRs are how real teams ship code.`,
            brief: `Branch, commit, push, and open a PR on GitHub.`,
            estMinutes: 90,
            xp: 70,
            tags: ["core", "workflow"],
          },
        ],
      },
      {
        id: `${tpl.id}-m2-project`,
        title: `Build a CLI project in ${langName}`,
        description: "Apply what you've learned to a real project.",
        tasks: [
          {
            id: `${tpl.id}-m2-t1`,
            title: "Design a small CLI tool",
            why: `Building from scratch forces you to make architecture decisions.`,
            brief: `Pick a small problem (e.g. todo list, file organizer, weather CLI) and build it.`,
            estMinutes: 600,
            xp: 200,
            tags: ["project", "core"],
          },
          {
            id: `${tpl.id}-m2-t2`,
            title: "Publish your project to GitHub",
            why: `Shipping publicly is a habit you want early.`,
            brief: `Add a README, license, and push your project to GitHub.`,
            estMinutes: 120,
            xp: 80,
            tags: ["project"],
          },
        ],
      },
      {
        id: `${tpl.id}-m3-testing`,
        title: "Testing and debugging",
        description: "Catch bugs before users do.",
        tasks: [
          {
            id: `${tpl.id}-m3-t1`,
            title: "Write your first unit tests",
            why: `Tests are how you change code without fear.`,
            brief: `Add 5+ unit tests to your CLI project using ${langName}'s test framework.`,
            estMinutes: 180,
            xp: 100,
            tags: ["core", "testing"],
          },
          {
            id: `${tpl.id}-m3-t2`,
            title: "Learn debugging techniques",
            why: `Bugs are inevitable — knowing how to find them fast is a superpower.`,
            brief: `Practice with a debugger, print debugging, and rubber-ducking.`,
            estMinutes: 120,
            xp: 70,
            tags: ["core"],
          },
        ],
      },
    ],
  };
}

function genPhase4(input: PersonalizationInput): GeneratedPhase {
  const tpl = PHASE_TEMPLATES[3];
  const career = CAREER_MAP[input.careerId];
  const subPathLabel =
    input.careerId === "software-engineering" && input.subPath
      ? ` (${input.subPath})`
      : "";

  // Career-specific specialization tasks
  const specializationTitle = `${career?.label ?? "Software"}${subPathLabel} specialization`;
  const frameworks = input.selectedLanguageIds
    .map((id) => LANGUAGE_MAP[id])
    .filter((l): l is LanguageInfo => l?.type === "framework");

  const frameworkTask = frameworks.length
    ? {
        id: `${tpl.id}-m1-t1`,
        title: `Learn ${frameworks[0].name}`,
        why: `${frameworks[0].name} is a recommended tool for your career path.`,
        brief: `Read the official ${frameworks[0].name} tutorial and build a small app.`,
        estMinutes: 600,
        xp: 200,
        tags: ["framework", "core"],
      }
    : {
        id: `${tpl.id}-m1-t1`,
        title: `Pick and learn a ${career?.label ?? "career"} framework`,
        why: `Frameworks multiply your productivity in your chosen domain.`,
        brief: `Identify one popular framework for your path and complete its official tutorial.`,
        estMinutes: 600,
        xp: 200,
        tags: ["framework", "core"],
      };

  // Career-specific modules
  let careerModules: GeneratedPhase["modules"] = [];

  if (input.careerId === "web-dev" || (input.careerId === "software-engineering" && (input.subPath === "frontend" || input.subPath === "fullstack"))) {
    careerModules = [
      {
        id: `${tpl.id}-m-web`,
        title: "Web frontend specialization",
        description: "HTML, CSS, and modern frontend frameworks.",
        tasks: [
          {
            id: `${tpl.id}-m-web-t1`,
            title: "Master HTML & semantic markup",
            why: `Semantic HTML is the foundation of accessibility and SEO.`,
            brief: `Build a multi-page accessible site using semantic HTML.`,
            estMinutes: 240,
            xp: 100,
            tags: ["frontend", "core"],
          },
          {
            id: `${tpl.id}-m-web-t2`,
            title: "Master CSS layout (Flexbox, Grid)",
            why: `CSS layout is what separates amateurs from pros.`,
            brief: `Build responsive layouts using Flexbox and Grid.`,
            estMinutes: 300,
            xp: 120,
            tags: ["frontend", "core"],
          },
          frameworkTask,
        ],
      },
    ];
  } else if (input.careerId === "data-science" || input.careerId === "ai-ml") {
    careerModules = [
      {
        id: `${tpl.id}-m-data`,
        title: "Data science specialization",
        description: "NumPy, Pandas, visualization, and ML basics.",
        tasks: [
          {
            id: `${tpl.id}-m-data-t1`,
            title: "Master NumPy & Pandas",
            why: `These are the workhorses of every data pipeline.`,
            brief: `Work through a dataset end-to-end: load, clean, transform, analyze.`,
            estMinutes: 480,
            xp: 200,
            tags: ["data", "core"],
          },
          {
            id: `${tpl.id}-m-data-t2`,
            title: "Build a data visualization dashboard",
            why: `Communicating findings is half the job.`,
            brief: `Use matplotlib/seaborn or Plotly to build a dashboard on a real dataset.`,
            estMinutes: 360,
            xp: 150,
            tags: ["data", "project"],
          },
          frameworkTask,
        ],
      },
    ];
  } else if (input.careerId === "cloud-devops" || (input.careerId === "software-engineering" && input.subPath === "devops")) {
    careerModules = [
      {
        id: `${tpl.id}-m-devops`,
        title: "DevOps specialization",
        description: "Linux, Docker, CI/CD, and cloud basics.",
        tasks: [
          {
            id: `${tpl.id}-m-devops-t1`,
            title: "Master Linux & the shell",
            why: `Every DevOps engineer lives in the terminal.`,
            brief: `Learn 30+ essential shell commands and scripting.`,
            estMinutes: 360,
            xp: 150,
            tags: ["devops", "core"],
          },
          {
            id: `${tpl.id}-m-devops-t2`,
            title: "Learn Docker and containerize an app",
            why: `Containers are how modern software is shipped.`,
            brief: `Dockerize your Phase 3 CLI project.`,
            estMinutes: 300,
            xp: 150,
            tags: ["devops", "core"],
          },
          frameworkTask,
        ],
      },
    ];
  } else if (input.careerId === "mobile-dev") {
    careerModules = [
      {
        id: `${tpl.id}-m-mobile`,
        title: "Mobile development specialization",
        description: "Build native or cross-platform mobile apps.",
        tasks: [
          {
            id: `${tpl.id}-m-mobile-t1`,
            title: "Build your first mobile app",
            why: `Mobile has its own constraints — you have to build to feel them.`,
            brief: `Use React Native/Flutter/SwiftUI/Kotlin to build a simple app.`,
            estMinutes: 600,
            xp: 200,
            tags: ["mobile", "core"],
          },
          frameworkTask,
        ],
      },
    ];
  } else if (input.careerId === "game-dev") {
    careerModules = [
      {
        id: `${tpl.id}-m-game`,
        title: "Game development specialization",
        description: "Engines, gameplay programming, and physics.",
        tasks: [
          {
            id: `${tpl.id}-m-game-t1`,
            title: "Learn Unity or Unreal basics",
            why: `Engines are how games are made today.`,
            brief: `Complete the official Unity Roll-a-Ball or Unreal tutorial.`,
            estMinutes: 480,
            xp: 200,
            tags: ["game", "core"],
          },
          frameworkTask,
        ],
      },
    ];
  } else if (input.careerId === "cybersecurity") {
    careerModules = [
      {
        id: `${tpl.id}-m-security`,
        title: "Security specialization",
        description: "Networking, OWASP, and offensive/defensive security.",
        tasks: [
          {
            id: `${tpl.id}-m-security-t1`,
            title: "Learn networking fundamentals",
            why: `You can't secure what you don't understand.`,
            brief: `TCP/IP, DNS, HTTP, ports, and protocols.`,
            estMinutes: 360,
            xp: 150,
            tags: ["security", "core"],
          },
          {
            id: `${tpl.id}-m-security-t2`,
            title: "Master the OWASP Top 10",
            why: `These are the most common vulnerabilities in production code.`,
            brief: `Study each OWASP Top 10 issue and write a tiny vulnerable + fixed example.`,
            estMinutes: 480,
            xp: 200,
            tags: ["security", "core"],
          },
          frameworkTask,
        ],
      },
    ];
  } else if (input.careerId === "hardware-embedded") {
    careerModules = [
      {
        id: `${tpl.id}-m-embedded`,
        title: "Embedded specialization",
        description: "Microcontrollers, RTOS, and hardware interfaces.",
        tasks: [
          {
            id: `${tpl.id}-m-embedded-t1`,
            title: "Blink an LED on a microcontroller",
            why: `The hello world of embedded — proves your toolchain works.`,
            brief: `Use Arduino, ESP32, or STM32 to blink an LED.`,
            estMinutes: 240,
            xp: 100,
            tags: ["embedded", "core"],
          },
          {
            id: `${tpl.id}-m-embedded-t2`,
            title: "Read a sensor and log data",
            why: `Real embedded work is reading from and writing to hardware.`,
            brief: `Read temperature/light/accelerometer data and log it.`,
            estMinutes: 360,
            xp: 150,
            tags: ["embedded", "core"],
          },
        ],
      },
    ];
  } else {
    // Backend / general SE
    careerModules = [
      {
        id: `${tpl.id}-m-backend`,
        title: specializationTitle,
        description: "APIs, databases, and backend frameworks.",
        tasks: [
          {
            id: `${tpl.id}-m-backend-t1`,
            title: "Learn SQL and relational databases",
            why: `Almost every backend persists data in a database.`,
            brief: `Master SELECT, INSERT, UPDATE, DELETE, JOINs, indexes.`,
            estMinutes: 360,
            xp: 150,
            tags: ["backend", "core"],
          },
          {
            id: `${tpl.id}-m-backend-t2`,
            title: "Build a REST API",
            why: `APIs are how backends talk to the world.`,
            brief: `Build a CRUD REST API with authentication.`,
            estMinutes: 480,
            xp: 200,
            tags: ["backend", "core", "project"],
          },
          frameworkTask,
        ],
      },
    ];
  }

  return {
    id: tpl.id,
    number: tpl.number,
    title: tpl.title,
    subtitle: tpl.subtitle,
    color: tpl.color,
    icon: tpl.icon,
    estWeeks: 1, // v5.85 fix (4.14): minimum 1 week to avoid confusing '0w' display
    objectives: [
      `Master key ${career?.label ?? "career"} frameworks and tools`,
      "Build a non-trivial project in your specialization",
      "Connect your code to real data sources",
    ],
    modules: careerModules,
  };
}

function genPhase5(input: PersonalizationInput): GeneratedPhase {
  const tpl = PHASE_TEMPLATES[4];
  return {
    id: tpl.id,
    number: tpl.number,
    title: tpl.title,
    subtitle: tpl.subtitle,
    color: tpl.color,
    icon: tpl.icon,
    estWeeks: 1, // v5.85 fix (4.14): minimum 1 week to avoid confusing '0w' display
    objectives: [
      "Understand system design and architecture",
      "Learn performance optimization",
      "Practice security best practices",
      "Work with cloud and deployment",
    ],
    modules: [
      {
        id: `${tpl.id}-m1-design`,
        title: "System design basics",
        description: "Architect systems that scale.",
        tasks: [
          {
            id: `${tpl.id}-m1-t1`,
            title: "Study common system design patterns",
            why: `These patterns appear in every interview and every real system.`,
            brief: `Read about caching, queues, load balancers, microservices, sharding.`,
            estMinutes: 360,
            xp: 150,
            tags: ["design", "core"],
          },
          {
            id: `${tpl.id}-m1-t2`,
            title: "Design a URL shortener or chat app",
            why: `Practice is the only way to internalize design thinking.`,
            brief: `Sketch the architecture for a small system end-to-end.`,
            estMinutes: 240,
            xp: 120,
            tags: ["design", "stretch"],
          },
        ],
      },
      {
        id: `${tpl.id}-m2-perf`,
        title: "Performance optimization",
        description: "Make your code faster and cheaper.",
        tasks: [
          {
            id: `${tpl.id}-m2-t1`,
            title: "Profile and optimize your Phase 4 project",
            why: `Measuring before optimizing is the only way to actually improve.`,
            brief: `Profile your project, find the slowest part, and make it 2x faster.`,
            estMinutes: 240,
            xp: 120,
            tags: ["performance", "core"],
          },
        ],
      },
      {
        id: `${tpl.id}-m3-security`,
        title: "Security fundamentals",
        description: "Don't ship vulnerabilities.",
        tasks: [
          {
            id: `${tpl.id}-m3-t1`,
            title: "Audit your code for OWASP Top 10",
            why: `Security debt compounds — fix it early.`,
            brief: `Review your projects for common vulnerabilities and fix any found.`,
            estMinutes: 240,
            xp: 120,
            tags: ["security", "core"],
          },
        ],
      },
      {
        id: `${tpl.id}-m4-deploy`,
        title: "Deployment and cloud",
        description: "Ship to real users.",
        tasks: [
          {
            id: `${tpl.id}-m4-t1`,
            title: "Deploy a project to production",
            why: `A project that isn't deployed is a project that isn't finished.`,
            brief: `Deploy your Phase 4 project to Vercel/Render/Fly/your cloud.`,
            estMinutes: 240,
            xp: 120,
            tags: ["deployment", "core"],
          },
        ],
      },
    ],
  };
}

function genPhase6(_input: PersonalizationInput): GeneratedPhase {
  const tpl = PHASE_TEMPLATES[5];
  // v5.929 (#3): Research-backed Capstone & Career content. Sources:
  // - "How to Build a Job-Winning Portfolio" (2025): quality over quantity,
  //   read 5+ job descriptions, tailor portfolio to role
  // - "UX Interview Tips" (Coursera, 2025): practice, portfolio case studies,
  //   quality over quantity for job applications
  // - Industry best practices: mock interviews (pramp.com, interviewing.io),
  //   LeetCode-style prep, resume optimization, GitHub/LinkedIn polish
  return {
    id: tpl.id,
    number: tpl.number,
    title: tpl.title,
    subtitle: tpl.subtitle,
    color: tpl.color,
    icon: tpl.icon,
    estWeeks: 1,
    objectives: [
      "Build a portfolio capstone project that demonstrates full-stack mastery",
      "Prepare a one-page resume and optimize your GitHub/LinkedIn presence",
      "Practice technical interviews until they feel routine (30+ problems, 5+ mocks)",
      "Apply to 20+ roles or publicly launch your product",
    ],
    modules: [
      {
        id: `${tpl.id}-m1-capstone`,
        title: "Capstone project — your portfolio centerpiece",
        description: "Your capstone is the single most important project in your portfolio. It should demonstrate that you can take an idea from concept to deployment — scoping, architecture, implementation, testing, and shipping. According to hiring managers (2025 research), quality matters far more than quantity: one well-executed capstone with a great README, live demo, and clean code beats 10 half-finished tutorials. Pick a project that solves a real problem, uses your full tech stack, and is ambitious enough to be impressive but scoped enough to finish.",
        tasks: [
          {
            id: `${tpl.id}-m1-t1`,
            title: "Design your capstone — scope, architecture, and user stories",
            why: "A well-scoped capstone is the centerpiece of your portfolio. Research shows hiring managers spend 30-60 seconds on a portfolio — your capstone README needs to immediately communicate what it does, why it's impressive, and how to run it. Starting with a design doc forces you to make architecture decisions upfront rather than mid-build.",
            brief: "Pick a problem you're passionate about. Write a one-page design doc: problem statement, user stories (3-5), tech stack justification, architecture diagram (can be simple boxes + arrows), database schema, and a deployment plan. Scope it to 2-4 weeks of work — ambitious but completable.",
            estMinutes: 180,
            xp: 100,
            tags: ["capstone", "core"],
          },
          {
            id: `${tpl.id}-m1-t2`,
            title: "Build, test, document, and deploy your capstone",
            why: "This is what you'll show employers or users. A deployed project with a live URL is 10x more impressive than a GitHub repo that only runs locally. Include tests (even basic ones show professionalism), a README with setup instructions and screenshots, and deploy to a free tier (Vercel, Render, Fly.io).",
            brief: "Implement the full application: frontend, backend, database, and deployment. Write unit tests for critical paths. Create a README with: project title, description, live demo link, tech stack, setup instructions, screenshots/GIF, and lessons learned. Deploy to production.",
            estMinutes: 1800,
            xp: 500,
            tags: ["capstone", "core", "project"],
          },
        ],
      },
      {
        id: `${tpl.id}-m2-resume`,
        title: "Resume and online presence",
        description: "Your resume is still the universal application artifact — every job application asks for one. But your GitHub and LinkedIn are where recruiters find you proactively. In 2025, recruiters search GitHub for active contributors and LinkedIn for professional presence. Optimizing all three means you're both applying (resume) and being found (GitHub/LinkedIn). Research tip: read 5+ job descriptions for your target role and mirror their keywords in your resume — ATS (Applicant Tracking Systems) filter by keyword matches.",
        tasks: [
          {
            id: `${tpl.id}-m2-t1`,
            title: "Write a one-page resume tailored to your target role",
            why: "Your resume is the single most important document in your job search. It needs to pass ATS (Applicant Tracking Systems) that filter by keywords AND impress human recruiters who spend 6-10 seconds scanning it. One page, quantified achievements (not just responsibilities), and keywords matching the job description.",
            brief: "Draft a one-page resume: contact info, professional summary (2 lines), skills (matching job descriptions you've read), projects (capstone + 2 others with live links), experience (if any), education. Use a clean template (latex resume, resumake.io, or a simple Google Doc). Quantify everything: 'Reduced load time by 40%' not 'Improved performance'.",
            estMinutes: 240,
            xp: 100,
            tags: ["career", "core"],
          },
          {
            id: `${tpl.id}-m2-t2`,
            title: "Optimize your GitHub and LinkedIn for recruiters",
            why: "Recruiters look at these before reaching out. A GitHub profile with pinned repos, a clear bio, and green contribution squares signals active development. A LinkedIn profile with your projects, skills, and a professional headline makes you searchable. Both are free and take 1-2 hours to optimize — the highest ROI activity in your job search.",
            brief: "GitHub: pin your 3-6 best repos, write a clear bio with your tech stack, add a profile picture, and ensure each pinned repo has a good README. LinkedIn: update your headline (not just 'Student' — use 'Software Engineer | Python · React · Docker'), add your projects with descriptions, and set your profile to 'Open to work'.",
            estMinutes: 120,
            xp: 70,
            tags: ["career", "core"],
          },
        ],
      },
      {
        id: `${tpl.id}-m3-interviews`,
        title: "Interview preparation",
        description: "Technical interviews are still the gatekeeper at most companies. The format varies — LeetCode-style algorithm problems, system design interviews, take-home projects, and behavioral interviews — but preparation is universal: practice consistently, mock interview to expose blind spots, and study common patterns. Industry research (2025) shows that candidates who complete 100+ LeetCode problems and do 5+ mock interviews have significantly higher offer rates.",
        tasks: [
          {
            id: `${tpl.id}-m3-t1`,
            title: "Solve 30 LeetCode-style problems (10 easy, 15 medium, 5 hard)",
            why: "Algorithm interviews are still common at most companies — especially mid-to-large tech. The key insight: you don't need to solve 500 problems. You need to internalize ~15 core patterns (two pointers, sliding window, BFS/DFS, dynamic programming, etc.) so you can recognize and apply them instantly. 30 well-chosen problems covering all patterns is more effective than 500 random ones.",
            brief: "Create a LeetCode account. Focus on the 'Top Interview 150' list. Solve in this order: arrays/hashing → two pointers → sliding window → stack → binary search → linked list → trees → heap → graphs → DP. For each problem: attempt for 20 min, then read the solution, understand the pattern, and re-implement from memory the next day.",
            estMinutes: 1200,
            xp: 250,
            tags: ["interview", "stretch"],
          },
          {
            id: `${tpl.id}-m3-t2`,
            title: "Do 5 mock interviews",
            why: "Mock interviews expose gaps you didn't know you had. Thinking out loud while solving a problem is a skill that requires practice — it feels unnatural at first. Mock interviews also help with nerves: after 5 mocks, real interviews feel routine. Free options: pramp.com (peer-to-peer), interviewing.io (with engineers from top companies), or a friend/mentor.",
            brief: "Book 5 mock interviews (1 per week for 5 weeks). Mix formats: 2 algorithm (LeetCode medium), 1 system design, 1 behavioral (tell me about a time...), 1 frontend/backend specific. After each mock: note 3 things you did well and 3 things to improve. Track your progress.",
            estMinutes: 600,
            xp: 200,
            tags: ["interview", "core"],
          },
        ],
      },
      {
        id: `${tpl.id}-m4-apply`,
        title: "Apply or ship",
        description: "Job applications are a numbers game — but quality matters. Research shows that tailored applications (customized resume + cover letter for each role) have a 3-5x higher response rate than generic bulk applications. Aim for 20 thoughtful applications to roles where you meet 60%+ of the requirements. Alternatively, if you're building a product, publicly launching is the ultimate validation.",
        tasks: [
          {
            id: `${tpl.id}-m4-t1`,
            title: "Apply to 20 roles or publicly launch your product",
            why: "Volume matters — applications are a numbers game. But research shows tailored applications have 3-5x higher response rates. Spend 15-20 minutes per application: read the job description, tweak your resume's summary/keywords, and write a 3-sentence cover note. 20 thoughtful applications > 100 generic ones.",
            brief: "Create a job application tracker (spreadsheet: company, role, date applied, status, follow-up date). Apply to 20 roles where you meet 60%+ of requirements. For each: customize your resume summary, write a brief cover note referencing the job description, and apply via the company's website (not just LinkedIn Easy Apply). Alternatively, launch your capstone on Product Hunt, Hacker News, or relevant communities.",
            estMinutes: 600,
            xp: 200,
            tags: ["career", "core"],
          },
        ],
      },
    ],
  };
}

// ============================================================
// Accuracy validation — secondary automated check
// ============================================================

export type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export function validateRoadmap(roadmap: GeneratedRoadmap, input: PersonalizationInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Must have between 3 and 12 phases (variable, not capped at 6)
  if (roadmap.phases.length < 3) {
    errors.push(`Roadmap needs at least 3 phases, got ${roadmap.phases.length}`);
  }
  if (roadmap.phases.length > 12) {
    warnings.push(`Roadmap has ${roadmap.phases.length} phases — consider consolidating to <= 12`);
  }

  // 2. Phases must be numbered sequentially starting at 1
  roadmap.phases.forEach((p, i) => {
    if (p.number !== i + 1) {
      errors.push(`Phase ${i + 1} has number ${p.number} (expected ${i + 1})`);
    }
  });

  // 3. Every phase must have at least one module with at least one task
  roadmap.phases.forEach((p) => {
    if (!p.modules.length) {
      errors.push(`Phase ${p.number} (${p.title}) has no modules`);
    }
    p.modules.forEach((m) => {
      if (!m.tasks.length) {
        errors.push(`Phase ${p.number} module "${m.title}" has no tasks`);
      }
    });
  });

  // 4. Task IDs must be unique
  const allTaskIds = new Set<string>();
  const duplicates: string[] = [];
  roadmap.phases.forEach((p) => {
    p.modules.forEach((m) => {
      m.tasks.forEach((t) => {
        if (allTaskIds.has(t.id)) duplicates.push(t.id);
        allTaskIds.add(t.id);
      });
    });
  });
  if (duplicates.length) {
    errors.push(`Duplicate task IDs: ${duplicates.slice(0, 5).join(", ")}`);
  }

  // 5. Selected languages must appear in the roadmap (at least by reference)
  input.selectedLanguageIds.forEach((langId) => {
    const lang = LANGUAGE_MAP[langId];
    if (!lang) {
      warnings.push(`Unknown language id "${langId}" — skipping`);
      return;
    }
    const mentioned = roadmap.phases.some((p) =>
      p.modules.some((m) =>
        m.tasks.some((t) => t.title.includes(lang.name) || t.brief.includes(lang.name) || t.why.includes(lang.name)),
      ),
    );
    if (!mentioned) {
      warnings.push(`Language "${lang.name}" not explicitly mentioned in any task`);
    }
  });

  // 6. Timeline must be reasonable (8-156 weeks, i.e. 2 months to 3 years)
  if (roadmap.totalWeeks < 8 || roadmap.totalWeeks > 156) {
    warnings.push(`Timeline of ${roadmap.totalWeeks} weeks is outside expected range (8-156)`);
  }

  // 7. Total hours must be > 0
  if (roadmap.totalHours <= 0) {
    errors.push("Total hours must be greater than 0");
  }

  // 8. Sum of phase weeks should approximately equal total weeks
  const phaseWeekSum = roadmap.phases.reduce((sum, p) => sum + (p.estWeeks || 0), 0);
  if (phaseWeekSum > 0 && Math.abs(phaseWeekSum - roadmap.totalWeeks) > roadmap.totalWeeks * 0.3) {
    warnings.push(`Sum of phase weeks (${phaseWeekSum}) differs from total weeks (${roadmap.totalWeeks}) by >30%`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================
// Main generator
// ============================================================

// ============================================================
// Lesson linking — match task topics to Launchpad lesson IDs.
// After generating phases, we walk every task and attach a
// lessonId if the task topic matches a known lesson.
// ============================================================

// Map of (language, topic) -> lessonId. Built from the lessons database.
const LESSON_TOPIC_MAP: Record<string, { keywords: string[]; lessonId: string }[]> = {
  // v5.865 fix (2.1/2.2): lesson IDs now match the REAL IDs in lessons-content.ts
  // (`python-01`...`python-21`, `javascript-01`...`javascript-21`, etc.).
  // Previously used `py-01`/`js-01` which don't exist in the lesson database,
  // breaking lesson linking, cert eligibility, and the polyglot badge.
  python: [
    { keywords: ["getting started", "install", "hello world", "first program", "repl"], lessonId: "python-01" },
    { keywords: ["variable", "data type", "type"], lessonId: "python-02" },
    { keywords: ["string", "f-string"], lessonId: "python-03" },
    { keywords: ["number", "operator", "arithmetic"], lessonId: "python-04" },
    { keywords: ["list", "tuple"], lessonId: "python-05" },
    { keywords: ["dict", "set", "dictionary"], lessonId: "python-06" },
    { keywords: ["conditional", "if", "else", "match"], lessonId: "python-07" },
    { keywords: ["loop", "for", "while", "range"], lessonId: "python-08" },
    { keywords: ["function", "def", "lambda", "argument"], lessonId: "python-09" },
    { keywords: ["class", "object", "inheritance", "oop"], lessonId: "python-10" },
    { keywords: ["error", "exception", "try", "except"], lessonId: "python-11" },
    { keywords: ["file", "read", "write", "open"], lessonId: "python-12" },
    { keywords: ["module", "import", "package", "pip"], lessonId: "python-13" },
    { keywords: ["api", "requests", "http", "rest"], lessonId: "python-14" },
    { keywords: ["test", "pytest", "assert"], lessonId: "python-15" },
  ],
  javascript: [
    { keywords: ["getting started", "install", "hello world", "first program"], lessonId: "javascript-01" },
    { keywords: ["variable", "let", "const", "var", "data type"], lessonId: "javascript-02" },
    { keywords: ["string", "template literal"], lessonId: "javascript-03" },
    { keywords: ["number", "operator", "arithmetic"], lessonId: "javascript-04" },
    { keywords: ["array", "map", "filter", "reduce"], lessonId: "javascript-05" },
    { keywords: ["object", "destructur"], lessonId: "javascript-06" },
    { keywords: ["conditional", "if", "else", "switch", "ternary"], lessonId: "javascript-07" },
    { keywords: ["loop", "for", "while", "iteration"], lessonId: "javascript-08" },
    { keywords: ["function", "arrow", "callback"], lessonId: "javascript-09" },
    { keywords: ["class", "object", "inheritance", "oop"], lessonId: "javascript-10" },
    { keywords: ["async", "await", "promise"], lessonId: "javascript-11" },
    { keywords: ["fetch", "api", "http", "rest"], lessonId: "javascript-12" },
    { keywords: ["dom", "document", "element", "event"], lessonId: "javascript-13" },
    { keywords: ["localstorage", "sessionstorage", "storage"], lessonId: "javascript-14" },
    { keywords: ["module", "import", "export", "test"], lessonId: "javascript-15" },
  ],
  typescript: [
    { keywords: ["getting started", "install", "hello"], lessonId: "typescript-01" },
    { keywords: ["variable", "type", "annotation"], lessonId: "typescript-02" },
    { keywords: ["control flow", "if", "loop"], lessonId: "typescript-03" },
    { keywords: ["function", "generic"], lessonId: "typescript-04" },
    { keywords: ["data structure", "array", "map"], lessonId: "typescript-05" },
    { keywords: ["class", "oop", "interface"], lessonId: "typescript-06" },
    { keywords: ["file", "io"], lessonId: "typescript-07" },
    { keywords: ["error", "exception"], lessonId: "typescript-08" },
    { keywords: ["api", "fetch", "http"], lessonId: "typescript-09" },
    { keywords: ["capstone", "project"], lessonId: "typescript-10" },
  ],
  java: [
    { keywords: ["getting started", "install", "hello"], lessonId: "java-01" },
    { keywords: ["variable", "type"], lessonId: "java-02" },
    { keywords: ["control flow", "if", "loop", "switch"], lessonId: "java-03" },
    { keywords: ["function", "method"], lessonId: "java-04" },
    { keywords: ["data structure", "array", "map", "list"], lessonId: "java-05" },
    { keywords: ["class", "oop", "inheritance"], lessonId: "java-06" },
    { keywords: ["file", "io"], lessonId: "java-07" },
    { keywords: ["error", "exception", "try"], lessonId: "java-08" },
    { keywords: ["api", "http"], lessonId: "java-09" },
    { keywords: ["capstone", "project"], lessonId: "java-10" },
  ],
  c: [
    { keywords: ["getting started", "install", "hello"], lessonId: "c-01" },
    { keywords: ["variable", "type", "pointer"], lessonId: "c-02" },
    { keywords: ["control flow", "if", "loop"], lessonId: "c-03" },
    { keywords: ["function", "pointer"], lessonId: "c-04" },
    { keywords: ["array", "struct"], lessonId: "c-05" },
    { keywords: ["struct", "function pointer", "oop"], lessonId: "c-06" },
    { keywords: ["file", "io"], lessonId: "c-07" },
    { keywords: ["error", "errno"], lessonId: "c-08" },
    { keywords: ["api", "http", "curl"], lessonId: "c-09" },
    { keywords: ["capstone", "project"], lessonId: "c-10" },
  ],
  cpp: [
    { keywords: ["getting started", "hello"], lessonId: "cpp-01" },
    { keywords: ["variable", "type"], lessonId: "cpp-02" },
    { keywords: ["control flow", "if", "loop"], lessonId: "cpp-03" },
    { keywords: ["function", "template"], lessonId: "cpp-04" },
    { keywords: ["vector", "map", "data structure"], lessonId: "cpp-05" },
    { keywords: ["class", "oop", "virtual"], lessonId: "cpp-06" },
    { keywords: ["file", "io"], lessonId: "cpp-07" },
    { keywords: ["error", "exception"], lessonId: "cpp-08" },
    { keywords: ["api", "http"], lessonId: "cpp-09" },
    { keywords: ["capstone", "project"], lessonId: "cpp-10" },
  ],
  csharp: [
    { keywords: ["getting started", "hello"], lessonId: "csharp-01" },
    { keywords: ["variable", "type"], lessonId: "csharp-02" },
    { keywords: ["control flow", "if", "loop"], lessonId: "csharp-03" },
    { keywords: ["function", "method"], lessonId: "csharp-04" },
    { keywords: ["list", "linq", "data structure"], lessonId: "csharp-05" },
    { keywords: ["class", "oop", "record"], lessonId: "csharp-06" },
    { keywords: ["file", "io"], lessonId: "csharp-07" },
    { keywords: ["error", "exception"], lessonId: "csharp-08" },
    { keywords: ["api", "http"], lessonId: "csharp-09" },
    { keywords: ["capstone", "project"], lessonId: "csharp-10" },
  ],
  go: [
    { keywords: ["getting started", "hello"], lessonId: "go-01" },
    { keywords: ["variable", "type"], lessonId: "go-02" },
    { keywords: ["control flow", "if", "loop"], lessonId: "go-03" },
    { keywords: ["function", "goroutine"], lessonId: "go-04" },
    { keywords: ["slice", "map", "struct"], lessonId: "go-05" },
    { keywords: ["struct", "interface", "method"], lessonId: "go-06" },
    { keywords: ["file", "io"], lessonId: "go-07" },
    { keywords: ["error", "panic"], lessonId: "go-08" },
    { keywords: ["api", "http"], lessonId: "go-09" },
    { keywords: ["capstone", "project"], lessonId: "go-10" },
  ],
  rust: [
    { keywords: ["getting started", "hello"], lessonId: "rust-01" },
    { keywords: ["variable", "type", "ownership"], lessonId: "rust-02" },
    { keywords: ["control flow", "if", "match", "loop"], lessonId: "rust-03" },
    { keywords: ["function", "closure"], lessonId: "rust-04" },
    { keywords: ["vec", "hashmap", "data structure"], lessonId: "rust-05" },
    { keywords: ["struct", "trait", "impl"], lessonId: "rust-06" },
    { keywords: ["file", "io"], lessonId: "rust-07" },
    { keywords: ["error", "result"], lessonId: "rust-08" },
    { keywords: ["api", "http"], lessonId: "rust-09" },
    { keywords: ["capstone", "project"], lessonId: "rust-10" },
  ],
};

function linkTasksToLessons(phases: GeneratedPhase[], languageIds: string[]): GeneratedPhase[] {
  // v5.77 fix: previously, if none of the user's languages had a topic map,
  // this fell back to "python" and linked Python lessons to non-Python tasks
  // (e.g. a Swift task "Master variables" got linked to lesson py-02).
  // Now we skip lesson linking entirely when no map is available.
  const langWithLessons = languageIds.find((id) => LESSON_TOPIC_MAP[id]);
  if (!langWithLessons) {
    // No topic map for any of the user's languages — return phases unchanged.
    return phases;
  }
  const topicMap = LESSON_TOPIC_MAP[langWithLessons];

  // Pre-compile keyword regexes with word boundaries so that short keywords
  // like "if", "for", "type", "match" don't match substrings of unrelated
  // words (e.g. "significant", "notification", "formula", "typeof").
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const compiled = topicMap.map((entry) => ({
    lessonId: entry.lessonId,
    patterns: entry.keywords.map((kw) => {
      // Multi-word keywords (e.g. "hello world") match as substrings — fine.
      // Single-word keywords must match on word boundaries.
      if (/\s/.test(kw)) {
        return new RegExp(escapeRegex(kw), "i");
      }
      return new RegExp(`\\b${escapeRegex(kw)}\\b`, "i");
    }),
  }));

  return phases.map((phase) => ({
    ...phase,
    // v5.929 (#1): stamp lessonIds onto tasks in ALL language phases (primary +
    // secondary). Uses lessonGroups presence to identify language phases — more
    // robust than the old /^Second Language:\s/ regex which no longer matches
    // the new unique per-language titles. Non-language phases (Foundation, AI
    // Bonus, Capstone) don't have lessonGroups and are skipped.
    modules: phase.modules.map((mod) => ({
      ...mod,
      tasks: mod.tasks.map((task) => {
        if (task.lessonId) return task; // already linked
        if (!phase.lessonGroups || phase.lessonGroups.length === 0) return task; // skip non-language phases
        const text = `${task.title} ${task.brief} ${task.why}`;
        for (const entry of compiled) {
          if (entry.patterns.some((p) => p.test(text))) {
            return { ...task, lessonId: entry.lessonId };
          }
        }
        return task;
      }),
    })),
  }));
}

// ============================================================
// Section 25 — Roadmap content depth enhancement
//
// Post-processes every task in the roadmap to make its `why` and `brief`
// fields more beginner-friendly. The original task descriptions are terse
// (one sentence each). This function expands them to include:
//   - A plain-language explanation of WHAT the task is
//   - A connection to the broader learning path (WHY it matters)
//   - A hint about what the user will be able to do AFTER completing it
//
// The enrichment only applies if the original text is short (under 120
// chars for `why`, under 200 chars for `brief`). Already-detailed tasks
// (like the VS Code setup phase) are left as-is.
// ============================================================

function enrichTaskForBeginner(task: GeneratedPhase["modules"][number]["tasks"][number], phaseTitle: string): GeneratedPhase["modules"][number]["tasks"][number] {
  const enriched = { ...task };

  // Enrich `why` — explain why this task matters in the bigger picture.
  if (task.why.length < 120) {
    const contextHint = ` This is part of "${phaseTitle}" — it builds the foundation you'll need for the next tasks.`;
    enriched.why = task.why + contextHint;
  }

  // Enrich `brief` — add a "what you'll be able to do after" hint.
  if (task.brief.length < 200) {
    const outcomeHint = ` After completing this, you'll be able to ${task.title.toLowerCase().replace(/^install |^set up |^learn |^practice |^master |^build |^create |^write |^run |^read /, "")} confidently.`;
    enriched.brief = task.brief + outcomeHint;
  }

  // Enrich `steps` — if there are fewer than 4 steps, add a "verify your work" step.
  if (task.steps && task.steps.length < 4 && !task.steps.some(s => s.toLowerCase().includes("verify") || s.toLowerCase().includes("check"))) {
    enriched.steps = [...task.steps, "Verify your work: did you complete each step above? If something went wrong, re-read the steps and try again."];
  }

  return enriched;
}

function enrichRoadmapForBeginners(phases: GeneratedPhase[]): GeneratedPhase[] {
  return phases.map((phase) => ({
    ...phase,
    modules: phase.modules.map((mod) => ({
      ...mod,
      tasks: mod.tasks.map((task) => enrichTaskForBeginner(task, phase.title)),
    })),
  }));
}

// ============================================================
// Main generator
// ============================================================

export function generateRoadmap(
  input: PersonalizationInput,
  /** v5.91 (Part 2): Languages auto-injected as prerequisites.
   * Each entry has the trackId and which selected languages required it. */
  autoInjected?: Array<{ trackId: string; requiredBy: string[] }>,
): GeneratedRoadmap {
  const timeline = computeTimeline(input);
  const career = CAREER_MAP[input.careerId];

  // v5.91 (Part 1): Topologically sort the language IDs so prerequisites
  // come before their dependents in the roadmap.
  // v5.92 FIX: use the ESM import (was require() which doesn't work in browser)
  const sortedLangIds = topologicalSort(input.selectedLanguageIds);

  // v5.88: Generate phases — the count now SCALES with the number of selected
  // languages. Previously only primary + ONE secondary language got phases;
  // the other 50+ languages were silently dropped. Now every selected language
  // gets meaningful representation.
  //
  // v5.91: Phase structure now respects dependency ordering.
  // v5.929 (#1): OVERHAUL — removed generic primary-language phases (genPhase1-5).
  // The primary language now gets the SAME real-lesson-content treatment as
  // secondary languages: genExtraLanguagePhase + buildLessonGroups. This
  // means the primary language phase pulls from real Learn-tab lessons with
  // "Go to Lesson" links, auto-completion tied to lesson/quiz progress, and
  // proper lesson-group modules — identical to how secondary languages work.
  //
  // New phase structure:
  //   1. Foundation & Setup (VS Code + Git + essential tools — merged)
  //   2. Primary language phase (real lesson content, same as secondary)
  //   3+. One phase per secondary language (sorted by prerequisite order)
  //   N-1. AI Bonus Track (research-backed per career)
  //   N. Capstone & Career (research-backed depth)
  const primary = primaryLanguage(input);
  const phases: GeneratedPhase[] = [];

  // Phase 1: Foundation & Setup (merged VS Code + Git/tools)
  phases.push(genFoundationPhase(input, 1));

  // Phase 2: Primary language (same mechanism as secondary languages)
  if (primary) {
    const primaryPhase = genExtraLanguagePhase(input, primary, 2);
    // v5.929 (#2): unique title — not "Second Language: X" but a dedicated title
    primaryPhase.title = `${primary.name} Mastery`;
    primaryPhase.subtitle = `${primary.tagline} — your primary language`;
    // Add real lesson groups (same as secondary languages)
    primaryPhase.lessonGroups = buildLessonGroups(primary.id);
    phases.push(primaryPhase);
  }

  // v5.91 (Part 2): Build a map of auto-injected languages for labeling.
  const autoInjectedMap = new Map<string, string[]>();
  if (autoInjected) {
    for (const inj of autoInjected) {
      autoInjectedMap.set(inj.trackId, inj.requiredBy);
    }
  }

  // v5.88: Add a phase for EVERY secondary language (not just the first).
  // v5.91: Use topologically sorted order so prerequisites come first.
  const secondaryLangs = sortedLangIds
    .slice(1) // skip primary (first in sorted order)
    .map((id: string) => LANGUAGE_MAP[id])
    .filter(Boolean);

  if (secondaryLangs.length >= 1) {
    const groups = groupRelatedLanguages(secondaryLangs);
    for (const group of groups) {
      const phaseNum = phases.length + 1;
      if (group.length === 1) {
        const phase = genExtraLanguagePhase(input, group[0], phaseNum);
        // v5.929 (#2): unique per-language phase titles — not "Second Language: X"
        // but a distinctive, natural-sounding title per language.
        phase.title = getLanguagePhaseTitle(group[0]);
        // v5.91 (Part 2): Tag auto-injected phases with "required for" label
        const injectedFor = autoInjectedMap.get(group[0].id);
        if (injectedFor) {
          phase.autoInjectedFor = injectedFor;
          phase.subtitle = `Required for: ${injectedFor.map(id => LANGUAGE_MAP[id]?.name ?? id).join(", ")}`;
        }
        // v5.91 (Part 3): Add real lesson groups
        phase.lessonGroups = buildLessonGroups(group[0].id);
        phases.push(phase);
      } else {
        const phase = genMultiLanguagePhase(input, group, phaseNum);
        // Tag if any language in the group was auto-injected
        const injectedFor = group
          .flatMap(l => autoInjectedMap.get(l.id) ?? [])
          .filter((v, i, a) => a.indexOf(v) === i); // dedupe
        if (injectedFor.length > 0) {
          phase.autoInjectedFor = injectedFor;
        }
        phases.push(phase);
      }
    }
    phases.forEach((p, i) => { p.number = i + 1; });
  }

  // Add AI bonus track as the second-to-last phase
  const bonusPhase = genAIBonusPhase(input, phases.length + 1);
  phases.push(bonusPhase);

  // v5.88 fix: reorder so Capstone is truly last.
  const capstoneIdx = phases.findIndex((p) => p.title.includes("Capstone"));
  if (capstoneIdx !== -1 && capstoneIdx < phases.length - 1) {
    const [capstone] = phases.splice(capstoneIdx, 1);
    phases.push(capstone);
  }
  phases.forEach((p, i) => { p.number = i + 1; });

  // Link tasks to Launchpad lessons (where a match exists)
  const linkedPhases = linkTasksToLessons(phases, input.selectedLanguageIds);

  // Distribute total weeks across phases using skill-level weights
  const weights = linkedPhases.map((p) => phaseWeight(p.number, input.skillLevel));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const weightedPhases = linkedPhases.map((p, i) => ({
    ...p,
    estWeeks: Math.max(1, Math.round((timeline.totalWeeks * weights[i]) / totalWeight)),
  }));

  // Section 25 — enrich task descriptions to be beginner-friendly.
  const finalPhases = input.skillLevel === "beginner"
    ? enrichRoadmapForBeginners(weightedPhases)
    : weightedPhases;

  return {
    careerId: input.careerId,
    careerLabel: career?.label ?? "Software Engineering",
    subPath: input.subPath,
    languageIds: input.selectedLanguageIds,
    totalWeeks: timeline.totalWeeks,
    totalHours: timeline.totalHours,
    phases: finalPhases,
    generatedAt: new Date().toISOString(),
    source: "deterministic" as RoadmapSource,
  };
}

// v5.929 (#2): Unique per-language phase titles.
// Instead of the generic "Second Language: X" pattern, each language gets a
// distinctive, natural-sounding title. The naming approach:
// - Primary language: "{Name} Mastery" (set in generateRoadmap)
// - Secondary languages: "{Name} Essentials" or a custom title for grouped languages
// This reads naturally in the roadmap UI and distinguishes phases at a glance.
function getLanguagePhaseTitle(lang: LanguageInfo): string {
  // v5.930 (#2): Full catalog coverage — unique, descriptive title for EVERY
  // language/track. No generic "{Name} Essentials" fallback — every entry gets
  // a genuinely unique, well-designed title.
  const customTitles: Record<string, string> = {
    // Core programming languages
    python: "Python Programming",
    javascript: "JavaScript Development",
    typescript: "TypeScript Development",
    java: "Java Programming",
    c: "C Programming",
    cpp: "C++ Development",
    csharp: "C# & .NET Development",
    go: "Go Programming",
    rust: "Rust Systems Programming",
    kotlin: "Kotlin Development",
    swift: "Swift & iOS Development",
    php: "PHP Web Development",
    ruby: "Ruby Development",
    r: "R for Data Analysis",
    dart: "Dart & Flutter Development",
    bash: "Bash & Shell Scripting",
    // Web technologies
    html: "HTML & Semantic Markup",
    css: "CSS & Styling",
    // Frameworks
    react: "React Development",
    nextjs: "Next.js Development",
    django: "Django Web Framework",
    fastapi: "FastAPI Development",
    flask: "Flask Web Development",
    svelte: "Svelte Development",
    vue: "Vue Development",
    angular: "Angular Development",
    nodejs: "Node.js Backend Development",
    tailwind: "Tailwind CSS Design",
    // Databases
    sql: "SQL & Querying",
    postgresql: "PostgreSQL & Relational Databases",
    mongodb: "MongoDB & NoSQL Databases",
    // AI/ML
    tensorflow: "TensorFlow & Deep Learning",
    // Systems & low-level
    assembly: "Assembly Language",
    lua: "Lua Scripting",
    "objective-c": "Objective-C Development",
    // Mobile
    "react-native": "React Native Development",
    // Game dev
    gdscript: "Godot & GDScript",
    glsl: "GLSL & Shader Programming",
    // Hardware
    verilog: "Verilog HDL",
    vhdl: "VHDL Hardware Design",
    arduino: "Arduino & Embedded C",
  };
  // Every language in the catalog now has a custom title.
  // The fallback below should never be reached, but is kept as a safety net.
  return customTitles[lang.id] ?? `${lang.name} Development`;
}

// ============================================================
// v5.929 (#3): Foundation Phase — merged VS Code setup + Git/GitHub
// basics + essential developer tools. Replaces both the old
// genVSCodeSetupPhase and genPhase1 (Foundations). Includes genuine
// explanatory content: what each tool is, why it matters, how to use it.
// ============================================================
function genFoundationPhase(input: PersonalizationInput, phaseNumber: number): GeneratedPhase {
  const primary = primaryLanguage(input);
  const langId = primary?.id ?? "python";
  const langName = primary?.name ?? "Python";

  const langExtMap: Record<string, { ext: string; packId: string; packName: string }> = {
    python:     { ext: "Python",            packId: "ms-python.python",                       packName: "Python" },
    javascript: { ext: "JavaScript/TypeScript", packId: "ms-vscode.vscode-typescript-next",    packName: "TypeScript Next" },
    typescript: { ext: "JavaScript/TypeScript", packId: "ms-vscode.vscode-typescript-next",    packName: "TypeScript Next" },
    react:      { ext: "React",             packId: "dsznajder.es7-react-js-snippets",         packName: "ES7+ React Snippets" },
    java:       { ext: "Java",              packId: "vscjava.vscode-java-pack",                packName: "Extension Pack for Java" },
    c:          { ext: "C/C++",             packId: "ms-vscode.cpptools",                      packName: "C/C++" },
    cpp:        { ext: "C/C++",             packId: "ms-vscode.cpptools",                      packName: "C/C++" },
    go:         { ext: "Go",                packId: "golang.Go",                               packName: "Go" },
    rust:       { ext: "Rust",              packId: "rust-lang.rust-analyzer",                 packName: "rust-analyzer" },
    html:       { ext: "HTML",              packId: "ritwickdey.liveserver",                   packName: "Live Server" },
    css:        { ext: "CSS",               packId: "bradlc.vscode-tailwindcss",               packName: "Tailwind CSS IntelliSense" },
    sql:        { ext: "SQL",               packId: "mtxr.sqltools",                           packName: "SQLTools" },
    bash:       { ext: "Bash/Shell",        packId: "timonwong.shellcheck",                    packName: "shellcheck" },
  };
  const langExt = langExtMap[langId] ?? langExtMap.python;

  return {
    id: `phase-${phaseNumber}-foundation`,
    number: phaseNumber,
    title: "Foundation & Developer Setup",
    subtitle: `VS Code, Git/GitHub, terminal basics, and your first ${langName} program`,
    color: "sky",
    icon: "🛠️",
    estWeeks: 1,
    objectives: [
      `Install VS Code and the ${langExt.ext} extension pack`,
      "Set up Git and create your first GitHub repository",
      "Learn essential terminal commands",
      `Run your first ${langName} program from VS Code`,
    ],
    modules: [
      {
        id: `phase-${phaseNumber}-m1-vscode`,
        title: "Download & install VS Code",
        description: "VS Code is the world's most popular code editor — free, open-source, and runs on Windows, macOS, and Linux. It has syntax highlighting, IntelliSense (smart autocomplete), debugging, Git integration, and the largest extension ecosystem of any editor.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m1-t1`,
            title: "Download and install VS Code",
            why: "VS Code is the industry-standard code editor used by over 70% of professional developers. Unlike simple text editors, it understands your code's structure, highlights errors as you type, and integrates with Git for version control.",
            brief: "Download VS Code from code.visualstudio.com and install it. Accept the default options. On Windows, check 'Add to PATH' during installation.",
            estMinutes: 15,
            xp: 30,
            tags: ["setup", "vscode"],
            steps: [
              "Go to https://code.visualstudio.com/download",
              "Download the installer for your OS",
              "Run the installer (on Windows, check 'Add to PATH')",
              "Launch VS Code and verify the welcome screen appears",
            ],
          },
          {
            id: `phase-${phaseNumber}-m1-t2`,
            title: `Install the ${langExt.packName} extension`,
            why: `The ${langExt.packName} extension gives VS Code deep understanding of ${langName} — IntelliSense, error detection, debugging, and formatting. Without it, VS Code is just a text editor.`,
            brief: `Open Extensions (Ctrl+Shift+X), search for "${langExt.packName}", click Install.`,
            estMinutes: 10,
            xp: 30,
            tags: ["setup", "vscode", "extensions"],
            steps: [
              "Open VS Code",
              "Press Ctrl+Shift+X (or Cmd+Shift+X on macOS)",
              `Search for "${langExt.packName}" (${langExt.packId})`,
              "Click Install",
              "Reload VS Code if prompted",
            ],
          },
        ],
      },
      {
        id: `phase-${phaseNumber}-m2-git`,
        title: "Git & GitHub — version control fundamentals",
        description: "Git tracks every change to your code — you can always roll back. GitHub hosts your repositories online — it's your portfolio and collaboration platform. Together they're non-negotiable for every developer.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m2-t1`,
            title: "Install Git and create a GitHub account",
            why: "Git is how every team manages code. GitHub is where employers look at your work. Setting up both now means you can push every project you build.",
            brief: "Install Git from git-scm.com, create a GitHub account, and configure your Git identity.",
            estMinutes: 30,
            xp: 50,
            tags: ["setup", "git", "github"],
            steps: [
              "Download Git from https://git-scm.com/downloads",
              "Create a free GitHub account at https://github.com",
              "Run: git config --global user.name \"Your Name\"",
              "Run: git config --global user.email \"your.email@example.com\"",
              "Verify: git --version",
            ],
          },
          {
            id: `phase-${phaseNumber}-m2-t2`,
            title: "Create your first repository and commit",
            why: "The init → add → commit → push cycle is the fundamental Git workflow you'll repeat thousands of times.",
            brief: "Create a folder, init Git, add a README, commit, connect to GitHub, and push.",
            estMinutes: 60,
            xp: 70,
            tags: ["git", "github", "hands-on"],
            steps: [
              "On GitHub: New repository → 'hello-launchpad' → public",
              "Terminal: mkdir hello-launchpad && cd hello-launchpad",
              "git init",
              "echo \"# Hello Launchpad\" > README.md",
              "git add README.md && git commit -m \"Initial commit\"",
              "git remote add origin https://github.com/YOUR_USERNAME/hello-launchpad.git",
              "git push -u origin main",
            ],
          },
        ],
      },
      {
        id: `phase-${phaseNumber}-m3-terminal`,
        title: "Terminal essentials",
        description: "The terminal is the universal developer interface. Learning 15-20 essential commands makes you dramatically faster than clicking through file explorer windows.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m3-t1`,
            title: "Learn 15 essential terminal commands",
            why: "Every tool — Git, package managers, build tools, deployment — runs from the terminal. The terminal works the same on every OS and every server.",
            brief: "Practice: pwd, ls, cd, mkdir, touch, rm, cp, mv, cat, echo, clear. On Windows, use Git Bash or WSL.",
            estMinutes: 60,
            xp: 50,
            tags: ["terminal", "core"],
            steps: [
              "Open your terminal (Terminal on macOS, Git Bash/WSL on Windows)",
              "Practice: pwd, ls, cd ~, mkdir test, cd test",
              "Create files: touch file1.txt, echo 'hello' > file2.txt",
              "Read: cat file2.txt",
              "Clean up: cd .., rm -r test",
            ],
          },
          {
            id: `phase-${phaseNumber}-m3-t2`,
            title: `Run your first ${langName} program`,
            why: `Verifying your full toolchain works end-to-end: editor → code → terminal → output.`,
            brief: `Create a ${langName} file in VS Code, write hello world, and run it from the integrated terminal.`,
            estMinutes: 30,
            xp: 40,
            tags: ["core", "hands-on"],
            steps: [
              "In VS Code: Ctrl+N (or Cmd+N) to create a new file",
              `Save as hello.${langId === "python" ? "py" : "js"}`,
              `Write the hello world code for ${langName}`,
              "Open integrated terminal (Ctrl+` or Cmd+`)",
              `Run: ${langId === "python" ? "python hello.py" : "node hello.js"}`,
            ],
            codeExample: helloCodeForLanguage(langId),
          },
        ],
      },
    ],
  };
}

// ============================================================
// v5.937: buildLessonGroups — DATA-DRIVEN grouping.
// Reads the `group` field from each lesson in the track and produces
// however many groups the track's content actually defines. Falls back
// to a single "All Lessons" group if lessons don't have a `group` field
// (e.g., legacy content that hasn't been updated yet).
//
// Capstone module removed — capstone-in-Learn-tab is gone; every lesson
// is a normal topic lesson now.
// ============================================================

function buildLessonGroups(trackId: string): import("./types").LessonGroup[] {
  const lessons = getTrackLessons(trackId);
  if (lessons.length === 0) {
    // Fallback for tracks with no loaded lessons yet — return an empty array
    // so the phase renders without lesson groups (the generic modules will show).
    return [];
  }

  // Group lessons by their `group` field, preserving order.
  const groupMap = new Map<string, { lessonIds: string[]; lessonNumbers: number[] }>();
  for (const lesson of lessons) {
    const groupName = lesson.group ?? "All Lessons";
    if (!groupMap.has(groupName)) {
      groupMap.set(groupName, { lessonIds: [], lessonNumbers: [] });
    }
    const entry = groupMap.get(groupName)!;
    entry.lessonIds.push(lesson.id);
    entry.lessonNumbers.push(lesson.order);
  }

  // Convert to LessonGroup[] with descriptions.
  return Array.from(groupMap.entries()).map(([title, { lessonIds, lessonNumbers }]) => ({
    title,
    description: `${lessonIds.length} lesson${lessonIds.length === 1 ? "" : "s"}`,
    lessonIds,
    lessonNumbers,
  }));
}

// ============================================================
// v5.88: Language grouping — combine related languages into
// single phases to keep total phase count reasonable when a user
// selects many languages. E.g., React + Next.js → one phase;
// Django + FastAPI + Flask → one "Python Web Frameworks" phase.
// ============================================================

const LANGUAGE_GROUPS: Array<{ name: string; ids: string[]; maxPerPhase?: number }> = [
  { name: "React Ecosystem", ids: ["react", "nextjs"] },
  { name: "Python Web Frameworks", ids: ["django", "fastapi", "flask"] },
  { name: "Frontend Frameworks", ids: ["svelte", "vue", "angular"] },
  { name: "Compiled Languages", ids: ["java", "c", "cpp", "csharp", "go", "rust"], maxPerPhase: 3 },
  { name: "Mobile Development", ids: ["swift", "kotlin", "dart"] },
  { name: "Scripting Languages", ids: ["php", "ruby", "r", "bash"], maxPerPhase: 3 },
  { name: "Databases", ids: ["postgresql", "mongodb", "sql"] },
  { name: "DevOps Tools", ids: ["docker", "kubernetes", "terraform"] },
  { name: "AI/ML Frameworks", ids: ["pytorch", "tensorflow"] },
  { name: "Modern Web Stack", ids: ["tailwind", "express", "graphql"] },
];

function groupRelatedLanguages(langs: LanguageInfo[]): LanguageInfo[][] {
  const grouped: LanguageInfo[][] = [];
  const used = new Set<string>();

  // First, try to form groups from predefined groupings
  for (const group of LANGUAGE_GROUPS) {
    const members = langs.filter((l) => group.ids.includes(l.id) && !used.has(l.id));
    if (members.length >= 2) {
      // v5.88 fix: if the group has more members than maxPerPhase, split into
      // multiple sub-groups so no language is silently dropped.
      const maxPer = group.maxPerPhase ?? 3;
      for (let i = 0; i < members.length; i += maxPer) {
        const chunk = members.slice(i, i + maxPer);
        if (chunk.length >= 2) {
          grouped.push(chunk);
        } else {
          // Last chunk has only 1 — give it its own single-language phase
          grouped.push(chunk);
        }
        chunk.forEach((m) => used.add(m.id));
      }
    }
  }

  // Remaining languages get their own phases (one per language)
  for (const lang of langs) {
    if (!used.has(lang.id)) {
      grouped.push([lang]);
    }
  }

  return grouped;
}

// ============================================================
// v5.88: Multi-language phase — for grouped related languages
// (e.g., "Python Web Frameworks: Django + FastAPI + Flask")
// ============================================================

function genMultiLanguagePhase(
  input: PersonalizationInput,
  langs: LanguageInfo[],
  phaseNumber: number,
): GeneratedPhase {
  const colors: PhaseColor[] = ["teal", "violet", "amber", "rose", "emerald", "sky"];
  const color = colors[(phaseNumber - 1) % colors.length];
  const langNames = langs.map((l) => l.name).join(" + ");
  const groupConfig = LANGUAGE_GROUPS.find((g) => langs.every((l) => g.ids.includes(l.id)));
  const groupName = groupConfig?.name ?? langNames;

  return {
    id: `phase-${phaseNumber}-group-${langs.map((l) => l.id).join("-")}`,
    number: phaseNumber,
    title: groupName,
    subtitle: `Master ${langNames}`,
    color,
    icon: langs[0].icon,
    estWeeks: Math.max(2, langs.length),
    objectives: [
      `Understand the strengths and use cases of each tool in the ${groupName} ecosystem`,
      `Build a project combining ${langNames}`,
      `Know when to choose which tool for a given problem`,
    ],
    modules: langs.map((lang, mi) => ({
      id: `phase-${phaseNumber}-m${mi + 1}-${lang.id}`,
      title: `${lang.name} essentials`,
      description: `Learn ${lang.name}: ${lang.tagline}`,
      tasks: [
        {
          id: `phase-${phaseNumber}-m${mi + 1}-t1`,
          title: `Set up ${lang.name} and run hello world`,
          why: `A working setup unblocks everything else.`,
          brief: `Install ${lang.name}, set up your editor, and run hello world.`,
          estMinutes: 60,
          xp: 40,
          tags: ["core", "setup"],
          steps: [`Install ${lang.name}`, `Install editor extensions`, `Run hello world`],
        },
        {
          id: `phase-${phaseNumber}-m${mi + 1}-t2`,
          title: `Learn ${lang.name} syntax and core concepts`,
          why: `${lang.tagline} — learning the fundamentals pays off immediately.`,
          brief: `Study ${lang.name}'s syntax, types, and core idioms. ${lang.learningCurve}`,
          estMinutes: 180,
          xp: 80,
          tags: ["core"],
        },
        {
          id: `phase-${phaseNumber}-m${mi + 1}-t3`,
          title: `Build a small project in ${lang.name}`,
          why: `Applying ${lang.name} to a real problem solidifies your understanding.`,
          brief: `Pick a small problem and implement it in ${lang.name}.`,
          estMinutes: 300,
          xp: 120,
          tags: ["project", "core"],
        },
      ],
    })),
  };
}

// ============================================================
// Extra phases for multi-language learners
// ============================================================

function genExtraLanguagePhase(input: PersonalizationInput, lang: LanguageInfo, phaseNumber: number): GeneratedPhase {
  const colors: PhaseColor[] = ["teal", "violet", "amber", "rose", "emerald", "sky"];
  const color = colors[(phaseNumber - 1) % colors.length];

  // v5.89 (BUG 3): Enhanced with real language-specific content from LANGUAGE_MAP.
  // Previously this was a 2-task stub with generic "Learn X syntax" + "Build a project".
  // Now uses lang.tagline, lang.useCases, lang.learningCurve, lang.topCompanies,
  // and lang.difficulty to create genuinely substantive, language-specific tasks.
  const useCases = lang.useCases ?? [];
  const topCompanies = lang.topCompanies ?? [];
  const difficultyNote = lang.difficulty >= 4 ? `${lang.name} has a steeper learning curve — take it slow.` : `${lang.name} is relatively approachable.`;

  // Build tasks based on the language's actual metadata
  const tasks: Array<{
    id: string; title: string; why: string; brief: string;
    estMinutes: number; xp: number; tags: string[];
    steps?: string[]; lessonId?: string;
  }> = [
    {
      id: `phase-${phaseNumber}-m1-t1`,
      title: `Set up ${lang.name} and run hello world`,
      why: `A working setup unblocks everything else. ${lang.tagline}.`,
      brief: `Install ${lang.name}, configure your editor with syntax highlighting and linting, and run a hello world program. ${difficultyNote}`,
      estMinutes: 60,
      xp: 40,
      tags: ["core", "setup"],
      steps: [
        `Install ${lang.name} (follow the official getting started guide)`,
        `Install editor extensions (syntax highlighting, autocomplete, linter)`,
        `Write and run a hello world program`,
        `Verify your setup with a simple calculation or string operation`,
      ],
      lessonId: ["python","javascript","typescript","html","css","sql","java","c","cpp","csharp","go","rust","swift","kotlin","php","ruby","r","dart","bash","react","nextjs","django","fastapi","flask","svelte","vue","angular","nodejs","postgresql","mongodb"].includes(lang.id) ? `${lang.id}-01` : undefined,
    },
    {
      id: `phase-${phaseNumber}-m1-t2`,
      title: `Learn ${lang.name} syntax, types, and control flow`,
      why: `Each language has unique idioms — ${lang.learningCurve}.`,
      brief: `Study ${lang.name}'s syntax, primitive types, operators, conditionals, and loops. ${lang.tagline}. Pay attention to how ${lang.name} handles errors and edge cases.`,
      estMinutes: 240,
      xp: 100,
      tags: ["core", "reading"],
      steps: [
        `Read the official ${lang.name} tutorial / quickstart`,
        `Practice with variables, types, and operators`,
        `Write conditional and loop constructs`,
        `Complete 3-5 exercises from the ${lang.name} docs`,
      ],
      lessonId: ["python","javascript","typescript","html","css","sql","java","c","cpp","csharp","go","rust","swift","kotlin","php","ruby","r","dart","bash","react","nextjs","django","fastapi","flask","svelte","vue","angular","nodejs","postgresql","mongodb"].includes(lang.id) ? `${lang.id}-03` : undefined,
    },
    {
      id: `phase-${phaseNumber}-m1-t3`,
      title: `Master ${lang.name} functions and data structures`,
      why: `Functions and data structures are how you organize real logic. ${lang.name}'s approach may differ from what you know.`,
      brief: `Learn how ${lang.name} defines functions, handles parameters/returns, and works with core data structures (arrays/lists, maps/dicts, sets). ${lang.tagline}.`,
      estMinutes: 200,
      xp: 90,
      tags: ["core"],
      steps: [
        `Write functions with parameters and return values`,
        `Work with ${lang.name}'s core data structures`,
        `Understand scope and lifetime of variables`,
        `Refactor a small script into reusable functions`,
      ],
      lessonId: ["python","javascript","typescript","html","css","sql","java","c","cpp","csharp","go","rust","swift","kotlin","php","ruby","r","dart","bash","react","nextjs","django","fastapi","flask","svelte","vue","angular","nodejs","postgresql","mongodb"].includes(lang.id) ? `${lang.id}-05` : undefined,
    },
  ];

  // Add a use-case-specific task if we have use case data
  if (useCases.length > 0) {
    const primaryUseCase = useCases[0];
    tasks.push({
      id: `phase-${phaseNumber}-m1-t4`,
      title: `Apply ${lang.name} to: ${primaryUseCase}`,
      why: `${lang.name} excels at ${primaryUseCase.toLowerCase()}. Real-world use cases: ${useCases.slice(0, 3).join(", ")}.`,
      brief: `Build a small, focused example demonstrating ${lang.name} for ${primaryUseCase.toLowerCase()}. ${topCompanies.length > 0 ? `Companies like ${topCompanies.slice(0, 2).join(" and ")} use ${lang.name} in production.` : ""}`,
      estMinutes: 180,
      xp: 100,
      tags: ["hands-on", "core"],
      steps: [
        `Research how ${lang.name} is used for ${primaryUseCase.toLowerCase()}`,
        `Build a minimal working example`,
        `Test it with real data`,
        `Document what you learned`,
      ],
      lessonId: ["python","javascript","typescript","html","css","sql","java","c","cpp","csharp","go","rust","swift","kotlin","php","ruby","r","dart","bash","react","nextjs","django","fastapi","flask","svelte","vue","angular","nodejs","postgresql","mongodb"].includes(lang.id) ? `${lang.id}-07` : undefined,
    });
  }

  return {
    id: `phase-${phaseNumber}-second-lang-${lang.id}`,
    number: phaseNumber,
    title: lang.name, // v5.929 (#2): caller overrides with getLanguagePhaseTitle()
    subtitle: lang.tagline,
    color,
    icon: lang.icon,
    estWeeks: Math.max(2, Math.ceil(tasks.length / 2)),
    objectives: [
      `Set up ${lang.name} and understand its syntax and type system`,
      `Master ${lang.name} functions, data structures, and idioms`,
      ...(useCases.length > 0 ? [`Apply ${lang.name} to a real use case: ${useCases[0]}`] : [`Build a working project in ${lang.name}`]),
    ],
    modules: [
      {
        id: `phase-${phaseNumber}-m1-fundamentals`,
        title: `${lang.name} fundamentals`,
        description: `${lang.description.substring(0, 150)}${lang.description.length > 150 ? "..." : ""}`,
        tasks: tasks.slice(0, 3),
      },
      {
        id: `phase-${phaseNumber}-m2-project`,
        title: `Build with ${lang.name}`,
        description: `Apply ${lang.name} to a real problem${useCases.length > 0 ? ` — ${useCases.slice(0, 2).join(", ")}` : ""}.`,
        tasks: tasks.length > 3 ? [tasks[3]] : [
          {
            id: `phase-${phaseNumber}-m2-t1`,
            title: `Build a CLI tool or small app in ${lang.name}`,
            why: `Building in a new language exposes its strengths and quirks. ${lang.tagline}.`,
            brief: `Pick a small problem and implement it in ${lang.name}. ${topCompanies.length > 0 ? `This is the kind of work ${topCompanies[0]} does with ${lang.name}.` : ""}`,
            estMinutes: 480,
            xp: 200,
            tags: ["project", "core"],
            lessonId: ["python","javascript","typescript","html","css","sql","java","c","cpp","csharp","go","rust","swift","kotlin","php","ruby","r","dart","bash","react","nextjs","django","fastapi","flask","svelte","vue","angular","nodejs","postgresql","mongodb"].includes(lang.id) ? `${lang.id}-10` : undefined,
          },
        ],
      },
    ],
  };
}

// ============================================================
// AI Bonus Track — added to every roadmap
// ============================================================

function genAIBonusPhase(input: PersonalizationInput, phaseNumber: number): GeneratedPhase {
  // v5.932: Research-backed AI Bonus Track content. SOLE SOURCE:
  // "Consolidated AI Tools and Industry Practices Career Guide 2026"
  // (merged from ChatGPT, Gemini, Mistral outputs). Each career's content
  // is restructured as guided, instructional material (what it is / why it
  // matters for this career / concrete "try this" first steps) — not a flat
  // task checklist. All 9 app careers map cleanly to the report's 9 sections.
  // Source attributions from the report are preserved in the brief/why fields.
  const content = getAIBonusContent(input.careerId);

  return {
    id: `phase-${phaseNumber}-ai-bonus`,
    number: phaseNumber,
    title: content.title,
    subtitle: content.subtitle,
    color: "violet",
    icon: "🎁",
    estWeeks: 1, // v5.85 fix (4.14): minimum 1 week to avoid confusing '0w' display
    objectives: content.objectives,
    modules: content.modules.map((m) => ({
      id: `phase-${phaseNumber}-${m.id}`,
      title: m.title,
      description: m.description,
      tasks: m.tasks.map((t) => ({
        id: `phase-${phaseNumber}-${t.id}`,
        title: t.title,
        why: t.why,
        brief: t.brief,
        steps: t.steps,
        estMinutes: t.estMinutes,
        xp: t.xp,
        tags: t.tags,
      })),
    })),
  };
}

// ============================================================
// VS Code Setup Phase — always the FIRST phase of every roadmap.
// Teaches the user how to set up VS Code: install, extensions,
// theme, keyboard shortcuts, settings sync, and includes a link
// to the official Microsoft "Get Started with VS Code" tutorial
// video on YouTube.
// ============================================================
function genVSCodeSetupPhase(input: PersonalizationInput, phaseNumber: number): GeneratedPhase {
  const primary = primaryLanguage(input);
  const langId = primary?.id ?? "python";
  const langName = primary?.name ?? "Python";

  // Language-specific VS Code extension packs — Microsoft publishes
  // official extension packs for most popular languages.
  const langExtMap: Record<string, { ext: string; packId: string; packName: string }> = {
    python:     { ext: "Python",            packId: "ms-python.python",                       packName: "Python" },
    javascript: { ext: "JavaScript/TypeScript", packId: "ms-vscode.vscode-typescript-next",    packName: "TypeScript Next" },
    typescript: { ext: "JavaScript/TypeScript", packId: "ms-vscode.vscode-typescript-next",    packName: "TypeScript Next" },
    react:      { ext: "React",             packId: "dsznajder.es7-react-js-snippets",         packName: "ES7+ React Snippets" },
    nextjs:     { ext: "Next.js",           packId: "bradlc.vscode-tailwindcss",               packName: "Tailwind CSS IntelliSense" },
    vue:        { ext: "Vue",               packId: "Vue.volar",                               packName: "Vue Language Features (Volar)" },
    angular:    { ext: "Angular",           packId: "Angular.ng-template",                     packName: "Angular Language Service" },
    svelte:     { ext: "Svelte",            packId: "svelte.svelte-vscode",                    packName: "Svelte for VS Code" },
    nodejs:     { ext: "Node.js",           packId: "ms-vscode.vscode-js-profile",             packName: "Node.js Extension Pack" },
    java:       { ext: "Java",              packId: "vscjava.vscode-java-pack",                packName: "Extension Pack for Java" },
    c:          { ext: "C/C++",             packId: "ms-vscode.cpptools",                      packName: "C/C++" },
    cpp:        { ext: "C/C++",             packId: "ms-vscode.cpptools",                      packName: "C/C++" },
    csharp:     { ext: "C#",                packId: "ms-dotnettools.csharp",                   packName: "C# Dev Kit" },
    go:         { ext: "Go",                packId: "golang.Go",                               packName: "Go" },
    rust:       { ext: "Rust",              packId: "rust-lang.rust-analyzer",                 packName: "rust-analyzer" },
    swift:      { ext: "Swift",             packId: "sswg.swift-lang",                         packName: "Swift Language" },
    kotlin:     { ext: "Kotlin",            packId: "fwcd.kotlin",                             packName: "Kotlin" },
    php:        { ext: "PHP",               packId: "DEVSENSE.phptools-vscode",                packName: "PHP Tools" },
    ruby:       { ext: "Ruby",              packId: "Shopify.ruby-extensions-pack",            packName: "Ruby Extension Pack" },
    r:          { ext: "R",                 packId: "REditorSupport.r",                        packName: "R" },
    dart:       { ext: "Dart/Flutter",      packId: "Dart-Code.dart-code",                     packName: "Dart" },
    bash:       { ext: "Bash/Shell",        packId: "timonwong.shellcheck",                    packName: "shellcheck" },
    sql:        { ext: "SQL",               packId: "mtxr.sqltools",                           packName: "SQLTools" },
    postgresql: { ext: "PostgreSQL",        packId: "ckolkman.vscode-postgres",                packName: "PostgreSQL" },
    mongodb:    { ext: "MongoDB",           packId: "mongodb.mongodb-vscode",                  packName: "MongoDB for VS Code" },
    html:       { ext: "HTML",              packId: "ritwickdey.liveserver",                   packName: "Live Server" },
    css:        { ext: "CSS",               packId: "bradlc.vscode-tailwindcss",               packName: "Tailwind CSS IntelliSense" },
    django:     { ext: "Django",            packId: "batisteo.vscode-django",                  packName: "Django" },
    fastapi:    { ext: "FastAPI",           packId: "ms-python.python",                        packName: "Python (FastAPI)" },
    flask:      { ext: "Flask",             packId: "ms-python.python",                        packName: "Python (Flask)" },
  };
  const langExt = langExtMap[langId] ?? langExtMap.python;

  // Career-specific extension recommendations (on top of the language pack)
  const careerExtMap: Record<string, { packId: string; packName: string }[]> = {
    "web-dev": [
      { packId: "esbenp.prettier-vscode", packName: "Prettier (code formatter)" },
      { packId: "dbaeumer.vscode-eslint", packName: "ESLint" },
      { packId: "ritwickdey.liveserver", packName: "Live Server" },
    ],
    "software-engineering": [
      { packId: "ms-vscode-remote.remote-wsl", packName: "WSL (Windows Subsystem for Linux)" },
      { packId: "ms-azuretools.vscode-docker", packName: "Docker" },
      { packId: "ms-vscode.cpptools-extension-pack", packName: "C/C++ Extension Pack" },
    ],
    "data-science": [
      { packId: "ms-toolsai.jupyter", packName: "Jupyter" },
      { packId: "ms-python.python", packName: "Python" },
    ],
    "ai-ml": [
      { packId: "ms-toolsai.jupyter", packName: "Jupyter" },
      { packId: "ms-python.python", packName: "Python" },
    ],
    "cloud-devops": [
      { packId: "ms-azuretools.vscode-docker", packName: "Docker" },
      { packId: "ms-kubernetes-tools.vscode-kubernetes-tools", packName: "Kubernetes" },
      { packId: "redhat.vscode-yaml", packName: "YAML" },
    ],
    "mobile-dev": [
      { packId: "Dart-Code.flutter", packName: "Flutter" },
      { packId: "ms-vscode.vscode-js-profile", packName: "React Native" },
    ],
    "cybersecurity": [
      { packId: "ms-vscode.cpptools", packName: "C/C++" },
      { packId: "redhat.vscode-yaml", packName: "YAML" },
    ],
    "game-dev": [
      { packId: "ms-vscode.cpptools", packName: "C/C++" },
    ],
    "hardware-embedded": [
      { packId: "ms-vscode.cpptools", packName: "C/C++" },
      { packId: "platformio.platformio-ide", packName: "PlatformIO IDE" },
    ],
  };
  const careerExts = careerExtMap[input.careerId] ?? [];

  return {
    id: `phase-${phaseNumber}-vscode-setup`,
    number: phaseNumber,
    title: "VS Code Setup — Your Developer Environment",
    subtitle: `Install VS Code, configure extensions for ${langName}, master the keyboard shortcuts, and run your first program`,
    color: "sky",
    icon: "🛠️",
    estWeeks: 1,
    objectives: [
      `Install VS Code and the ${langExt.ext} extension pack`,
      "Choose a theme and configure settings for productivity",
      "Learn the essential keyboard shortcuts",
      "Run your first program from inside VS Code",
    ],
    modules: [
      {
        id: `phase-${phaseNumber}-m1-install`,
        title: "Download & install VS Code",
        description: "Get VS Code running on your operating system in under 5 minutes.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m1-t1`,
            title: "Download and install VS Code",
            why: "VS Code is the most popular code editor in the world — free, open-source, runs everywhere, and has the largest extension ecosystem.",
            brief: "Download VS Code from code.visualstudio.com and install it on your operating system (Windows, macOS, or Linux).",
            estMinutes: 15,
            xp: 30,
            tags: ["setup", "vscode"],
            steps: [
              "Go to https://code.visualstudio.com/download",
              "Download the installer for your OS (Windows, macOS, or Linux — pick the one matching your system)",
              "Run the installer with default options",
              "Launch VS Code and verify the welcome screen appears",
            ],
          },
        ],
      },
      {
        id: `phase-${phaseNumber}-m2-extensions`,
        title: `Install the ${langExt.ext} extension pack`,
        description: `Add language support for ${langName} and any career-specific tools.`,
        tasks: [
          {
            id: `phase-${phaseNumber}-m2-t1`,
            title: `Install ${langExt.packName} extension`,
            why: `The official ${langExt.packName} extension gives you syntax highlighting, IntelliSense (autocomplete), debugging, and linting for ${langName}.`,
            brief: `Open the Extensions panel (Ctrl/Cmd+Shift+X), search for "${langExt.packName}", and install it.`,
            estMinutes: 10,
            xp: 30,
            tags: ["setup", "vscode", "extensions"],
            steps: [
              "Open VS Code",
              "Press Ctrl+Shift+X (Windows/Linux) or Cmd+Shift+X (macOS) to open the Extensions panel",
              `Search for "${langExt.packName}" (${langExt.packId})`,
              "Click Install",
              "Reload VS Code if prompted",
            ],
          },
          ...(careerExts.length > 0 ? [{
            id: `phase-${phaseNumber}-m2-t2`,
            title: "Install career-specific extensions",
            why: "These extensions provide the tooling you'll use daily in your chosen career.",
            brief: `Install these extensions for your career path: ${careerExts.map(e => e.packName).join(", ")}.`,
            estMinutes: 15,
            xp: 40,
            tags: ["setup", "vscode", "extensions", "career"],
            steps: careerExts.map(e => `Install "${e.packName}" (${e.packId})`),
          }] : []),
          {
            id: `phase-${phaseNumber}-m2-t3`,
            title: "Install universal productivity extensions",
            why: "These extensions make every developer faster — regardless of language.",
            brief: "Install Prettier (formatter), GitLens (Git superpowers), and indent-rainbow (visual aid).",
            estMinutes: 10,
            xp: 30,
            tags: ["setup", "vscode", "extensions"],
            steps: [
              'Install "Prettier - Code formatter" (esbenp.prettier-vscode)',
              'Install "GitLens — Git supercharged" (eamodio.gitlens)',
              'Install "indent-rainbow" (oderwat.indent-rainbow)',
              'Optional: Install "Material Icon Theme" (PKief.material-icon-theme) for nicer file icons',
            ],
          },
        ],
      },
      {
        id: `phase-${phaseNumber}-m3-theme-and-settings`,
        title: "Choose a theme & tune your settings",
        description: "Make VS Code look great and behave the way you want.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m3-t1`,
            title: "Pick a color theme",
            why: "A good theme reduces eye strain and makes code structure easier to scan.",
            brief: "Open the Command Palette (Ctrl/Cmd+Shift+P), type 'Color Theme', and pick one you like.",
            estMinutes: 5,
            xp: 20,
            tags: ["setup", "vscode", "theme"],
            steps: [
              "Press Ctrl+Shift+P (Windows/Linux) or Cmd+Shift+P (macOS)",
              "Type 'Color Theme' and select 'Preferences: Color Theme'",
              "Try: One Dark Pro, GitHub Dark, Material Theme, or Night Owl",
              "Press Enter to apply",
            ],
          },
          {
            id: `phase-${phaseNumber}-m3-t2`,
            title: "Enable format-on-save and font ligatures",
            why: "Format-on-save keeps your code clean automatically. Font ligatures make =>, !==, and -> render as single glyphs (easier to read).",
            brief: "Open settings.json (Ctrl/Cmd+, then click the file icon) and add the recommended settings.",
            estMinutes: 10,
            xp: 30,
            tags: ["setup", "vscode", "settings"],
            steps: [
              "Press Ctrl+, (Windows/Linux) or Cmd+, (macOS) to open Settings",
              "Click the 'Open Settings (JSON)' icon in the top-right",
              "Add: \"editor.formatOnSave\": true",
              "Add: \"editor.fontLigatures\": true",
              "Optional: Set \"editor.fontFamily\" to 'Fira Code' or 'JetBrains Mono' (download separately)",
            ],
          },
          {
            id: `phase-${phaseNumber}-m3-t3`,
            title: "Enable Settings Sync",
            why: "Settings Sync backs up your extensions, settings, and keybindings to your GitHub or Microsoft account — so they follow you to any computer.",
            brief: "Turn on Settings Sync from the gear menu in the bottom-left corner.",
            estMinutes: 5,
            xp: 20,
            tags: ["setup", "vscode", "sync"],
            steps: [
              "Click the gear icon in the bottom-left corner of VS Code",
              "Select 'Turn on Settings Sync...'",
              "Choose what to sync (Settings, Keybindings, Extensions, UI State, Snippets)",
              "Sign in with GitHub or Microsoft",
            ],
          },
        ],
      },
      {
        id: `phase-${phaseNumber}-m4-shortcuts`,
        title: "Master the essential keyboard shortcuts",
        description: "These 10 shortcuts cover 90% of what professional developers use daily.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m4-t1`,
            title: "Learn the top 10 VS Code shortcuts",
            why: "Memorizing these will roughly double your editing speed within a week.",
            brief: "Practice each shortcut 5 times until it's muscle memory.",
            estMinutes: 30,
            xp: 50,
            tags: ["setup", "vscode", "shortcuts"],
            steps: [
              "Ctrl/Cmd+P — Quick Open file (type a filename to jump to it)",
              "Ctrl/Cmd+Shift+P — Command Palette (search any VS Code command)",
              "Ctrl/Cmd+Shift+X — Extensions panel",
              "Ctrl/Cmd+B — Toggle sidebar",
              "Ctrl/Cmd+` — Toggle integrated terminal",
              "Ctrl/Cmd+/ — Toggle line comment",
              "Alt+Up/Down — Move line up/down",
              "Shift+Alt+Down — Copy line down",
              "Ctrl/Cmd+D — Select next occurrence of current word (multi-cursor)",
              "Ctrl/Cmd+Shift+K — Delete current line",
            ],
          },
          {
            id: `phase-${phaseNumber}-m4-t2`,
            title: "Open the integrated terminal",
            why: "The integrated terminal means you never have to leave VS Code to run commands.",
            brief: "Open the terminal panel and run your first command.",
            estMinutes: 5,
            xp: 20,
            tags: ["setup", "vscode", "terminal"],
            steps: [
              "Press Ctrl+` (backtick, usually above Tab)",
              "Verify the terminal panel opens at the bottom",
              "Type: echo 'Hello from VS Code terminal' and press Enter",
              "Press Ctrl+` again to hide the terminal",
            ],
          },
        ],
      },
      {
        id: `phase-${phaseNumber}-m5-first-program`,
        title: `Write your first ${langName} program in VS Code`,
        description: "Tie it all together — create a file, write code, save, and run it.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m5-t1`,
            title: `Create and run a hello-world ${langName} file`,
            why: "Confirming you can edit, save, and run code from VS Code proves your setup is complete.",
            brief: `Create a new file, write a hello-world ${langName} program, save it, and run it from the integrated terminal.`,
            estMinutes: 20,
            xp: 60,
            tags: ["setup", "vscode", "first-program"],
            steps: [
              "Press Ctrl/Cmd+N to create a new file",
              `Save it (Ctrl/Cmd+S) as 'hello.${langId === "python" ? "py" : langId === "javascript" ? "js" : langId === "typescript" ? "ts" : "txt"}'`,
              langId === "python"
                ? "Type: print('Hello, Launchpad!')"
                : langId === "javascript" || langId === "typescript"
                ? "Type: console.log('Hello, Launchpad!')"
                : `Type your language's hello-world program`,
              "Save the file",
              "Open the terminal (Ctrl/Cmd+`)",
              langId === "python"
                ? "Run: python hello.py"
                : langId === "javascript" || langId === "typescript"
                ? "Run: node hello.js"
                : "Run using your language's standard command",
              "Verify you see the output in the terminal",
            ],
          },
        ],
      },
      {
        id: `phase-${phaseNumber}-m6-tutorial-video`,
        title: "Watch the official VS Code tutorial video",
        description: "Microsoft publishes a free 'Get Started with VS Code' video that covers everything above visually. The video is embedded below — click to expand.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m6-t1`,
            title: "Watch 'Getting Started with VS Code' (official)",
            why: "Seeing VS Code used by an expert fills in the gaps that text instructions miss — workflow, navigation, debugging.",
            brief: "Watch the official Microsoft VS Code tutorial video below, then try one workflow from it.\n\n📺 Watch on YouTube: https://www.youtube-nocookie.com/embed/S320N3xkinE (Microsoft's official 'Getting Started with Visual Studio Code' — 7 min)",
            estMinutes: 15,
            xp: 40,
            tags: ["setup", "vscode", "tutorial", "video", "youtube:S320N3xkinE"],
            steps: [
              "Expand the YouTube video embed below the task description",
              "Watch the full 7-minute walkthrough from Microsoft",
              "Pick ONE feature you didn't know about and try it on your own code",
              "Mark this task complete when done",
            ],
          },
        ],
      },
    ],
  };
}

// ============================================================
// Visual generation pipeline (for the animated indicator)
// Each stage is a step the engine performs — UI shows progress.
// v5.923: AI stage removed — the deterministic engine is the only generator.
// ============================================================

export const GENERATION_STAGES: Array<{ id: string; label: string; description: string }> = [
  { id: "analyze", label: "Analyzing inputs", description: "Reading your career, languages, and availability" },
  { id: "career", label: "Mapping career path", description: "Selecting the right specialization for your goals" },
  { id: "languages", label: "Loading language metadata", description: "Fetching demand, salary, and use-case data" },
  { id: "phases", label: "Designing phases", description: "Determining the right number of phases for your path" },
  { id: "tasks", label: "Generating tasks & modules", description: "Building concrete steps for each phase" },
  { id: "timeline", label: "Computing timeline", description: `Adjusting for ${0}h/week — placeholder, replaced at runtime` },
  { id: "validate", label: "Validating accuracy...", description: "Running 8-check validation on phases, content, dependencies" },
];

export function getGenerationStagesForInput(input: PersonalizationInput) {
  const weeklyHours = input.hoursPerDay * input.daysPerWeek;
  return GENERATION_STAGES.map((s) =>
    s.id === "timeline"
      ? { ...s, description: `Adjusting for ${weeklyHours}h/week availability` }
      : s,
  );
}

// ============================================================
// Helpers
// ============================================================

export function recommendLanguagesForCareer(careerId: CareerId): string[] {
  const career = CAREER_MAP[careerId];
  return career?.recommendedLanguages ?? [];
}

export function languagesByCareer(careerId: CareerId): LanguageInfo[] {
  return LANGUAGES.filter((l) => l.careers.includes(careerId));
}

export function allLanguagesAlphabetical(): LanguageInfo[] {
  return [...LANGUAGES].sort((a, b) => a.name.localeCompare(b.name));
}
