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
  // Standard baseline: 14 hr/week (2 hr/day × 7 days)
  const baselineWeekly = 14;
  // Timeline shrinks as weekly hours grow (more time = faster completion)
  const availabilityMultiplier = baselineWeekly / Math.max(weeklyHours, 1);

  const skillMultiplier = SKILL_LEVEL_MULTIPLIER[input.skillLevel];
  const occupation = OCCUPATION_MAP[input.occupationId];
  const paceMultiplier = occupation ? PACE_MULTIPLIER[occupation.pace] : 1.0;

  const timelineMultiplier = skillMultiplier * paceMultiplier * availabilityMultiplier;

  // Base roadmap = 52 weeks (1 year) at 14 hr/week
  const baseWeeks = 52;
  const totalWeeks = Math.max(8, Math.round(baseWeeks * timelineMultiplier));
  const totalHours = Math.round(totalWeeks * weeklyHours);

  return { weeklyHours, timelineMultiplier, totalWeeks, totalHours };
}

// Adjust phase weighting based on skill level — beginners spend more on phases 1-2,
// advanced learners skip ahead to phases 4-5
function phaseWeight(phaseNumber: number, skillLevel: SkillLevel): number {
  if (skillLevel === "beginner") {
    return [1.3, 1.3, 1.0, 1.0, 1.0, 0.8][phaseNumber - 1] ?? 1.0;
  }
  if (skillLevel === "intermediate") {
    return [0.7, 0.8, 1.0, 1.1, 1.1, 1.0][phaseNumber - 1] ?? 1.0;
  }
  // advanced
  return [0.3, 0.4, 0.7, 1.3, 1.3, 1.1][phaseNumber - 1] ?? 1.0;
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
  return input.selectedLanguageIds
    .slice(1)
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
    estWeeks: 0, // filled in below
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
    estWeeks: 0,
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
    estWeeks: 0,
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

  if (input.careerId === "web-dev" || (input.careerId === "software-engineering" && input.subPath === "frontend") || input.subPath === "fullstack") {
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
  } else if (input.careerId === "cloud-devops" || input.subPath === "devops") {
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
    estWeeks: 0,
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
    estWeeks: 0,
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
  return {
    id: tpl.id,
    number: tpl.number,
    title: tpl.title,
    subtitle: tpl.subtitle,
    color: tpl.color,
    icon: tpl.icon,
    estWeeks: 0,
    objectives: [
      "Build a portfolio capstone project",
      "Prepare your resume and online presence",
      "Practice technical interviews",
      "Apply to jobs or ship your product",
    ],
    modules: [
      {
        id: `${tpl.id}-m1-capstone`,
        title: "Capstone project",
        description: "Build something that demonstrates everything you've learned.",
        tasks: [
          {
            id: `${tpl.id}-m1-t1`,
            title: "Design your capstone",
            why: `A well-scoped capstone is the centerpiece of your portfolio.`,
            brief: `Pick a problem, scope it, and write a one-page design doc.`,
            estMinutes: 180,
            xp: 100,
            tags: ["capstone", "core"],
          },
          {
            id: `${tpl.id}-m1-t2`,
            title: "Build and ship your capstone",
            why: `This is what you'll show employers or users.`,
            brief: `Implement, test, document, and deploy your capstone.`,
            estMinutes: 1800,
            xp: 500,
            tags: ["capstone", "core", "project"],
          },
        ],
      },
      {
        id: `${tpl.id}-m2-resume`,
        title: "Resume and online presence",
        description: "Make yourself findable and impressive.",
        tasks: [
          {
            id: `${tpl.id}-m2-t1`,
            title: "Write a one-page resume",
            why: `Your resume is still the universal application artifact.`,
            brief: `Draft a one-page resume highlighting projects, skills, and impact.`,
            estMinutes: 240,
            xp: 100,
            tags: ["career", "core"],
          },
          {
            id: `${tpl.id}-m2-t2`,
            title: "Optimize your GitHub and LinkedIn",
            why: `Recruiters look at these before reaching out.`,
            brief: `Pin your best repos, write a clear bio, update LinkedIn.`,
            estMinutes: 120,
            xp: 70,
            tags: ["career", "core"],
          },
        ],
      },
      {
        id: `${tpl.id}-m3-interviews`,
        title: "Interview prep",
        description: "Practice until interviews feel routine.",
        tasks: [
          {
            id: `${tpl.id}-m3-t1`,
            title: "Solve 30 LeetCode-style problems",
            why: `Algorithm interviews are still common at most companies.`,
            brief: `Solve 10 easy, 15 medium, 5 hard problems.`,
            estMinutes: 1200,
            xp: 250,
            tags: ["interview", "stretch"],
          },
          {
            id: `${tpl.id}-m3-t2`,
            title: "Do 5 mock interviews",
            why: `Mock interviews expose gaps you didn't know you had.`,
            brief: `Use pramp.com, interviewing.io, or a friend.`,
            estMinutes: 600,
            xp: 200,
            tags: ["interview", "core"],
          },
        ],
      },
      {
        id: `${tpl.id}-m4-apply`,
        title: "Apply or ship",
        description: "Get the job — or ship your product.",
        tasks: [
          {
            id: `${tpl.id}-m4-t1`,
            title: "Apply to 20 roles or launch your product",
            why: `Volume matters — applications are a numbers game.`,
            brief: `Send 20 thoughtful applications or publicly launch your product.`,
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
  python: [
    { keywords: ["getting started", "install", "hello world", "first program", "repl"], lessonId: "py-01" },
    { keywords: ["variable", "data type", "type"], lessonId: "py-02" },
    { keywords: ["string", "f-string"], lessonId: "py-03" },
    { keywords: ["number", "operator", "arithmetic"], lessonId: "py-04" },
    { keywords: ["list", "tuple"], lessonId: "py-05" },
    { keywords: ["dict", "set", "dictionary"], lessonId: "py-06" },
    { keywords: ["conditional", "if", "else", "match"], lessonId: "py-07" },
    { keywords: ["loop", "for", "while", "range"], lessonId: "py-08" },
    { keywords: ["function", "def", "lambda", "argument"], lessonId: "py-09" },
    { keywords: ["class", "object", "inheritance", "oop"], lessonId: "py-10" },
    { keywords: ["error", "exception", "try", "except"], lessonId: "py-11" },
    { keywords: ["file", "read", "write", "open"], lessonId: "py-12" },
    { keywords: ["module", "import", "package", "pip"], lessonId: "py-13" },
    { keywords: ["api", "requests", "http", "rest"], lessonId: "py-14" },
    { keywords: ["test", "pytest", "assert"], lessonId: "py-15" },
  ],
  javascript: [
    { keywords: ["getting started", "install", "hello world", "first program"], lessonId: "js-01" },
    { keywords: ["variable", "let", "const", "var", "data type"], lessonId: "js-02" },
    { keywords: ["string", "template literal"], lessonId: "js-03" },
    { keywords: ["number", "operator", "arithmetic"], lessonId: "js-04" },
    { keywords: ["array", "map", "filter", "reduce"], lessonId: "js-05" },
    { keywords: ["object", "destructur"], lessonId: "js-06" },
    { keywords: ["conditional", "if", "else", "switch", "ternary"], lessonId: "js-07" },
    { keywords: ["loop", "for", "while", "iteration"], lessonId: "js-08" },
    { keywords: ["function", "arrow", "callback"], lessonId: "js-09" },
    { keywords: ["class", "object", "inheritance", "oop"], lessonId: "js-10" },
    { keywords: ["async", "await", "promise"], lessonId: "js-11" },
    { keywords: ["fetch", "api", "http", "rest"], lessonId: "js-12" },
    { keywords: ["dom", "document", "element", "event"], lessonId: "js-13" },
    { keywords: ["localstorage", "sessionstorage", "storage"], lessonId: "js-14" },
    { keywords: ["module", "import", "export", "test"], lessonId: "js-15" },
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
  // Pick the language to match against (first language that has lessons)
  const langWithLessons = languageIds.find((id) => LESSON_TOPIC_MAP[id]) ?? "python";
  const topicMap = LESSON_TOPIC_MAP[langWithLessons] ?? LESSON_TOPIC_MAP.python;

  return phases.map((phase) => ({
    ...phase,
    modules: phase.modules.map((mod) => ({
      ...mod,
      tasks: mod.tasks.map((task) => {
        if (task.lessonId) return task; // already linked
        const text = (task.title + " " + task.brief + " " + task.why).toLowerCase();
        for (const entry of topicMap) {
          if (entry.keywords.some((kw) => text.includes(kw))) {
            return { ...task, lessonId: entry.lessonId };
          }
        }
        return task;
      }),
    })),
  }));
}

// ============================================================
// Main generator
// ============================================================

export function generateRoadmap(input: PersonalizationInput): GeneratedRoadmap {
  const timeline = computeTimeline(input);
  const career = CAREER_MAP[input.careerId];

  // Generate phases — the count varies based on profile complexity.
  // Phase 0 is always the VS Code Setup phase (installs, extensions, theme,
  // shortcuts, official tutorial video). All subsequent phases get bumped
  // by one in numbering.
  const phases: GeneratedPhase[] = [
    genVSCodeSetupPhase(input, 1),
    genPhase1(input, timeline),
    genPhase2(input),
    genPhase3(input),
    genPhase4(input),
    genPhase5(input),
    genPhase6(input),
  ];
  phases.forEach((p, i) => { p.number = i + 1; });

  // Add extra phases for multi-language learners
  const secondaryLangs = secondaryLanguages(input);
  if (secondaryLangs.length >= 1) {
    const extraPhase = genExtraLanguagePhase(input, secondaryLangs[0], phases.length + 1);
    phases.splice(4, 0, extraPhase); // insert after VS Code + Phase 1,2,3 (was 3, now 4)
    phases.forEach((p, i) => { p.number = i + 1; });
  }

  // Add AI bonus track as the final phase
  const bonusPhase = genAIBonusPhase(input, phases.length + 1);
  phases.push(bonusPhase);
  phases.forEach((p, i) => { p.number = i + 1; });

  // Link tasks to Launchpad lessons (where a match exists)
  const linkedPhases = linkTasksToLessons(phases, input.selectedLanguageIds);

  // Distribute total weeks across phases using skill-level weights
  const weights = linkedPhases.map((p) => phaseWeight(p.number, input.skillLevel));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const finalPhases = linkedPhases.map((p, i) => ({
    ...p,
    estWeeks: Math.max(1, Math.round((timeline.totalWeeks * weights[i]) / totalWeight)),
  }));

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

// ============================================================
// Extra phases for multi-language learners
// ============================================================

function genExtraLanguagePhase(input: PersonalizationInput, lang: LanguageInfo, phaseNumber: number): GeneratedPhase {
  const colors: PhaseColor[] = ["teal", "violet", "amber", "rose", "emerald", "sky"];
  const color = colors[(phaseNumber - 1) % colors.length];
  return {
    id: `phase-${phaseNumber}-second-lang-${lang.id}`,
    number: phaseNumber,
    title: `Second Language: ${lang.name}`,
    subtitle: `Add ${lang.name} to your toolkit`,
    color,
    icon: lang.icon,
    estWeeks: 0,
    objectives: [
      `Learn ${lang.name} syntax and core idioms`,
      `Translate concepts from your first language`,
      `Build a small project in ${lang.name}`,
    ],
    modules: [
      {
        id: `phase-${phaseNumber}-m1-syntax`,
        title: `${lang.name} fundamentals`,
        description: `Learn the syntax, types, and control flow of ${lang.name}.`,
        tasks: [
          {
            id: `phase-${phaseNumber}-m1-t1`,
            title: `Set up ${lang.name} and run hello world`,
            why: `A working setup unblocks everything else.`,
            brief: `Install ${lang.name}, set up your editor, and run hello world.`,
            estMinutes: 60,
            xp: 40,
            tags: ["core", "setup"],
            steps: [
              `Install ${lang.name}`,
              `Install editor extensions`,
              `Run hello world`,
            ],
          },
          {
            id: `phase-${phaseNumber}-m1-t2`,
            title: `Learn ${lang.name} syntax and types`,
            why: `Each language has unique idioms — learn them early.`,
            brief: `Study ${lang.name}'s syntax, primitive types, and operators.`,
            estMinutes: 180,
            xp: 80,
            tags: ["core"],
          },
        ],
      },
      {
        id: `phase-${phaseNumber}-m2-project`,
        title: `Build a small ${lang.name} project`,
        description: `Apply ${lang.name} to a real problem.`,
        tasks: [
          {
            id: `phase-${phaseNumber}-m2-t1`,
            title: `Build a CLI tool or small app in ${lang.name}`,
            why: `Building in a new language exposes its strengths and quirks.`,
            brief: `Pick a small problem and implement it in ${lang.name}.`,
            estMinutes: 480,
            xp: 200,
            tags: ["project", "core"],
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
  const careerId = input.careerId;
  let title = "AI Foundations — Bonus Track";
  let subtitle = "Integrating AI into your career path";
  let objectives: string[] = [
    "Understand how AI is changing your field",
    "Learn to use AI tools productively",
    "Build a small AI-powered feature",
  ];
  let modules: GeneratedPhase["modules"] = [];

  if (careerId === "software-engineering" || input.subPath === "backend" || input.subPath === "fullstack") {
    title = "AI in Software Engineering — Bonus Track";
    subtitle = "LLM APIs, AI-assisted coding, copilots";
    objectives = [
      "Understand LLM APIs (OpenAI, Anthropic, Z.ai)",
      "Use AI coding assistants (Copilot, Cursor) effectively",
      "Build an AI-powered feature in your app",
    ];
    modules = [
      {
        id: `phase-${phaseNumber}-m1-llm-apis`,
        title: "LLM APIs and integration",
        description: "Learn to call LLM APIs from your apps.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m1-t1`,
            title: "Call an LLM API from your code",
            why: "AI features are becoming table stakes in modern apps.",
            brief: "Use OpenAI, Anthropic, or Z.ai SDK to call an LLM and print a response.",
            estMinutes: 120,
            xp: 80,
            tags: ["ai", "bonus"],
            steps: ["Get an API key", "Install the SDK", "Send a prompt", "Parse the response"],
          },
          {
            id: `phase-${phaseNumber}-m1-t2`,
            title: "Add streaming responses to an app",
            why: "Streaming dramatically improves perceived AI performance.",
            brief: "Stream an LLM response token-by-token to a UI.",
            estMinutes: 180,
            xp: 100,
            tags: ["ai", "bonus"],
          },
        ],
      },
      {
        id: `phase-${phaseNumber}-m2-copilots`,
        title: "AI coding assistants",
        description: "Use Copilot, Cursor, and Claude Code to ship faster.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m2-t1`,
            title: "Set up GitHub Copilot or Cursor",
            why: "AI assistants 2-5x your coding speed once you know how to use them.",
            brief: "Install an AI assistant and complete a small task using its suggestions.",
            estMinutes: 60,
            xp: 50,
            tags: ["ai", "bonus", "tools"],
          },
        ],
      },
    ];
  } else if (careerId === "cloud-devops" || input.subPath === "devops") {
    title = "AI in Cloud/DevOps — Bonus Track";
    subtitle = "MLOps, AI-assisted monitoring, intelligent automation";
    objectives = [
      "Understand MLOps pipeline fundamentals",
      "Use AI for log analysis and anomaly detection",
      "Deploy an ML model to production",
    ];
    modules = [
      {
        id: `phase-${phaseNumber}-m1-mlops`,
        title: "MLOps fundamentals",
        description: "Operationalize machine learning models.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m1-t1`,
            title: "Deploy a model with FastAPI + Docker",
            why: "Serving models is the bridge from notebook to production.",
            brief: "Wrap a pre-trained model in a FastAPI service and containerize it.",
            estMinutes: 240,
            xp: 120,
            tags: ["ai", "bonus", "mlops"],
          },
          {
            id: `phase-${phaseNumber}-m1-t2`,
            title: "Set up model monitoring",
            why: "Models degrade in production — monitoring catches drift.",
            brief: "Add basic input/output logging and drift detection.",
            estMinutes: 180,
            xp: 100,
            tags: ["ai", "bonus"],
          },
        ],
      },
    ];
  } else if (careerId === "data-science") {
    title = "Machine Learning Foundations — Bonus Track";
    subtitle = "From statistics to deep learning";
    objectives = [
      "Master the ML workflow end-to-end",
      "Build and evaluate your first models",
      "Understand deep learning basics",
    ];
    modules = [
      {
        id: `phase-${phaseNumber}-m1-ml-basics`,
        title: "Machine learning fundamentals",
        description: "Supervised, unsupervised, and evaluation.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m1-t1`,
            title: "Build a classification model with scikit-learn",
            why: "Classification is the canonical ML task.",
            brief: "Load a dataset, train a classifier, evaluate with precision/recall/F1.",
            estMinutes: 240,
            xp: 120,
            tags: ["ai", "bonus", "ml"],
          },
          {
            id: `phase-${phaseNumber}-m1-t2`,
            title: "Train a neural network with PyTorch or TensorFlow",
            why: "Deep learning powers modern AI.",
            brief: "Build, train, and evaluate a small neural net on MNIST.",
            estMinutes: 300,
            xp: 150,
            tags: ["ai", "bonus", "deep-learning"],
          },
        ],
      },
    ];
  } else if (careerId === "ai-ml") {
    title = "Advanced AI/ML — Bonus Track";
    subtitle = "LLMs, RAG, and production AI systems";
    objectives = [
      "Build with large language models",
      "Implement RAG (retrieval-augmented generation)",
      "Ship an AI feature to production",
    ];
    modules = [
      {
        id: `phase-${phaseNumber}-m1-llms`,
        title: "Large language models in depth",
        description: "Prompt engineering, fine-tuning, RAG.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m1-t1`,
            title: "Build a RAG system",
            why: "RAG grounds LLMs in your data — the most useful AI pattern.",
            brief: "Embed documents, store in a vector DB, retrieve and feed to an LLM.",
            estMinutes: 360,
            xp: 200,
            tags: ["ai", "bonus", "rag"],
          },
          {
            id: `phase-${phaseNumber}-m1-t2`,
            title: "Fine-tune a small model",
            why: "Fine-tuning tailors models to your domain.",
            brief: "Fine-tune a small open model (e.g. Llama 3 8B) on a custom dataset.",
            estMinutes: 480,
            xp: 250,
            tags: ["ai", "bonus", "fine-tuning"],
          },
        ],
      },
    ];
  } else if (careerId === "web-dev") {
    title = "AI-Powered Web UX — Bonus Track";
    subtitle = "Chatbots, recommendations, AI features";
    objectives = [
      "Build an AI chatbot for your site",
      "Add smart recommendations",
      "Generate content with AI",
    ];
    modules = [
      {
        id: `phase-${phaseNumber}-m1-chatbot`,
        title: "AI chatbot for your site",
        description: "Add a conversational AI to a web app.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m1-t1`,
            title: "Build an AI chat widget",
            why: "Chatbots are the most common AI feature on the web.",
            brief: "Build a chat widget that calls an LLM API and streams responses.",
            estMinutes: 360,
            xp: 200,
            tags: ["ai", "bonus", "web"],
          },
        ],
      },
    ];
  } else if (careerId === "cybersecurity") {
    title = "AI in Cybersecurity — Bonus Track";
    subtitle = "Threat detection, security automation, AI red teaming";
    objectives = [
      "Use AI for threat detection",
      "Automate security responses",
      "Understand AI red teaming and prompt injection",
    ];
    modules = [
      {
        id: `phase-${phaseNumber}-m1-ai-security`,
        title: "AI for security automation",
        description: "Detect anomalies and respond with AI.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m1-t1`,
            title: "Build an anomaly detection system",
            why: "AI catches threats that signature-based systems miss.",
            brief: "Train a model to detect anomalies in log data.",
            estMinutes: 300,
            xp: 150,
            tags: ["ai", "bonus", "security"],
          },
        ],
      },
    ];
  } else if (careerId === "mobile-dev") {
    title = "AI in Mobile Apps — Bonus Track";
    subtitle = "On-device ML, AI features in mobile apps";
    objectives = [
      "Add AI features to a mobile app",
      "Use on-device ML for privacy",
      "Integrate cloud AI APIs",
    ];
    modules = [
      {
        id: `phase-${phaseNumber}-m1-mobile-ai`,
        title: "AI features in mobile apps",
        description: "On-device ML and cloud AI integration.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m1-t1`,
            title: "Add image classification to your mobile app",
            why: "On-device ML keeps data private and works offline.",
            brief: "Use Core ML (iOS) or ML Kit (Android) to classify images.",
            estMinutes: 240,
            xp: 120,
            tags: ["ai", "bonus", "mobile"],
          },
        ],
      },
    ];
  } else if (careerId === "game-dev") {
    title = "AI in Games — Bonus Track";
    subtitle = "NPCs, procedural generation, AI game tools";
    objectives = [
      "Use AI for NPC behavior",
      "Generate content procedurally",
      "Leverage AI tools in your engine",
    ];
    modules = [
      {
        id: `phase-${phaseNumber}-m1-game-ai`,
        title: "AI for game NPCs and content",
        description: "Behavior trees, procedural generation, ML agents.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m1-t1`,
            title: "Build an AI-controlled NPC",
            why: "Smart NPCs make games feel alive.",
            brief: "Implement a behavior tree or utility AI for an NPC.",
            estMinutes: 300,
            xp: 150,
            tags: ["ai", "bonus", "game"],
          },
        ],
      },
    ];
  } else if (careerId === "hardware-embedded") {
    title = "AI on Embedded Devices — Bonus Track";
    subtitle = "TinyML, edge inference, AI on microcontrollers";
    objectives = [
      "Run ML models on microcontrollers",
      "Understand edge AI tradeoffs",
      "Build a TinyML project",
    ];
    modules = [
      {
        id: `phase-${phaseNumber}-m1-tinyml`,
        title: "TinyML on microcontrollers",
        description: "Run ML inference on edge devices.",
        tasks: [
          {
            id: `phase-${phaseNumber}-m1-t1`,
            title: "Deploy a TinyML model to a microcontroller",
            why: "Edge AI enables smart devices without cloud round-trips.",
            brief: "Use TensorFlow Lite for Microcontrollers to run a small model on an ESP32.",
            estMinutes: 360,
            xp: 200,
            tags: ["ai", "bonus", "embedded"],
          },
        ],
      },
    ];
  }

  return {
    id: `phase-${phaseNumber}-ai-bonus`,
    number: phaseNumber,
    title,
    subtitle,
    color: "violet",
    icon: "🎁",
    estWeeks: 0,
    objectives,
    modules,
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
            tags: ["setup", "vscode", "tutorial", "video", "youtube:vscode-getting-started"],
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
// AI-driven roadmap generation (calls /api/roadmap-generate)
// Returns null if AI fails — caller should fall back to deterministic gen.
// ============================================================

export async function generateRoadmapWithAI(
  input: PersonalizationInput,
): Promise<{ roadmap: GeneratedRoadmap | null; error?: string; allFailed?: boolean }> {
  try {
    const res = await fetch("/api/roadmap-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { roadmap: null, error: data.error || `HTTP ${res.status}`, allFailed: !!data.allFailed };
    }
    const data = await res.json();
    const aiRoadmap = data.roadmap;
    if (!aiRoadmap || !aiRoadmap.phases || !Array.isArray(aiRoadmap.phases)) {
      return { roadmap: null, error: "AI returned malformed roadmap" };
    }
    // Normalize: ensure required fields exist
    const career = CAREER_MAP[input.careerId];
    const weeklyHours = input.hoursPerDay * input.daysPerWeek;
    const normalized: GeneratedRoadmap = {
      careerId: input.careerId,
      careerLabel: aiRoadmap.careerLabel || career?.label || "Software Engineering",
      subPath: input.subPath,
      languageIds: input.selectedLanguageIds,
      totalWeeks: aiRoadmap.totalWeeks || Math.max(8, Math.round((52 * 14) / Math.max(weeklyHours, 1))),
      totalHours: aiRoadmap.totalHours || Math.round((aiRoadmap.totalWeeks || 52) * weeklyHours),
      phases: aiRoadmap.phases.map((p: GeneratedPhase, i: number) => ({
        ...p,
        number: i + 1, // ensure sequential
        estWeeks: p.estWeeks || 4,
        modules: (p.modules || []).map((m, mi) => ({
          ...m,
          id: m.id || `phase-${i + 1}-m-${mi + 1}`,
          tasks: (m.tasks || []).map((t, ti) => ({
            ...t,
            id: t.id || `phase-${i + 1}-m-${mi + 1}-t-${ti + 1}`,
            estMinutes: t.estMinutes || 60,
            xp: t.xp || 50,
            tags: t.tags || [],
          })),
        })),
      })),
      generatedAt: new Date().toISOString(),
      aiRefinement: "Generated by AI",
      source: (aiRoadmap.source as RoadmapSource) || "ai-gemini",
    };
    return { roadmap: normalized };
  } catch (err) {
    return { roadmap: null, error: (err as Error).message };
  }
}

// Retry — send issues back to AI for correction (one retry)
export async function regenerateRoadmapWithAI(
  input: PersonalizationInput,
  previousRoadmap: GeneratedRoadmap,
  issues: string[],
): Promise<{ roadmap: GeneratedRoadmap | null; error?: string }> {
  try {
    const res = await fetch("/api/roadmap-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, issues, previousRoadmap }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { roadmap: null, error: data.error || `HTTP ${res.status}` };
    }
    const data = await res.json();
    const aiRoadmap = data.roadmap;
    if (!aiRoadmap || !aiRoadmap.phases) {
      return { roadmap: null, error: "AI retry returned malformed roadmap" };
    }
    const career = CAREER_MAP[input.careerId];
    const normalized: GeneratedRoadmap = {
      careerId: input.careerId,
      careerLabel: aiRoadmap.careerLabel || career?.label || "Software Engineering",
      subPath: input.subPath,
      languageIds: input.selectedLanguageIds,
      totalWeeks: aiRoadmap.totalWeeks || previousRoadmap.totalWeeks,
      totalHours: aiRoadmap.totalHours || previousRoadmap.totalHours,
      phases: aiRoadmap.phases.map((p: GeneratedPhase, i: number) => ({
        ...p,
        number: i + 1,
        estWeeks: p.estWeeks || 4,
        modules: (p.modules || []).map((m, mi) => ({
          ...m,
          id: m.id || `phase-${i + 1}-m-${mi + 1}`,
          tasks: (m.tasks || []).map((t, ti) => ({
            ...t,
            id: t.id || `phase-${i + 1}-m-${mi + 1}-t-${ti + 1}`,
            estMinutes: t.estMinutes || 60,
            xp: t.xp || 50,
            tags: t.tags || [],
          })),
        })),
      })),
      generatedAt: new Date().toISOString(),
      aiRefinement: "Generated by AI — corrected after validation",
      source: (aiRoadmap.source as RoadmapSource) || "ai-gemini",
    };
    return { roadmap: normalized };
  } catch (err) {
    return { roadmap: null, error: (err as Error).message };
  }
}

// ============================================================
// 7-stage visual generation pipeline (for the animated indicator)
// Each stage is a step the engine performs — UI shows progress.
// ============================================================

export const GENERATION_STAGES: Array<{ id: string; label: string; description: string }> = [
  { id: "analyze", label: "Analyzing inputs", description: "Reading your career, languages, and availability" },
  { id: "career", label: "Mapping career path", description: "Selecting the right specialization for your goals" },
  { id: "languages", label: "Loading language metadata", description: "Fetching demand, salary, and use-case data" },
  { id: "ai", label: "AI personalizing your plan...", description: "Sending your profile to the AI (Gemini → Groq → OpenRouter fallback)" },
  { id: "phases", label: "Designing phases", description: "AI determines the right number of phases for your path" },
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
