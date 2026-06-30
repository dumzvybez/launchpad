import { NextRequest, NextResponse } from "next/server";
import type { PersonalizationInput, RoadmapSource } from "@/lib/types";
import { CAREER_MAP, LANGUAGE_MAP, OCCUPATION_MAP } from "@/lib/career-data";

// ============================================================
// SYSTEM PROMPT — exact lesson ID list (30 technologies × 20 stages + capstone)
// (Section 2.5 — printed for developer reference)
// ============================================================

// DEVELOPER REFERENCE — full roadmap system prompt + example JSON response:
// ─────────────────────────────────────────────────────────────
// PROMPT (sent as system message to Gemini/Groq/OpenRouter):
//   "You are Launchpad's roadmap architect. Design personalized coding learning
//    roadmaps. Given a learner's profile, output a JSON learning roadmap with the
//    RIGHT number of phases (4-10) based on profile complexity. Do NOT force exactly 6.
//    PERSONALIZATION RULES:
//    - Phase 1: ALWAYS 'Foundations' — basics of the user's PRIMARY language
//    - If multiple languages: dedicate phases to each (easiest first)
//    - Last phase: ALWAYS 'Capstone & Career' — portfolio + interview prep
//    - Beginners: expand early phases; Intermediate/Advanced: compress early phases
//    - Students: add depth and projects; Professionals: condense
//    - Compute totalWeeks from weeklyHours × totalWeeks ≈ totalHours
//      (Beginner ≈ 600h, Intermediate ≈ 400h, Advanced ≈ 250h)
//    LESSON LINKING (EXACT IDs): python-01..python-20, javascript-01..20,
//    typescript-01..20, html-01..20, css-01..20, sql-01..20, java-01..20,
//    c-01..20, cpp-01..20, csharp-01..20, go-01..20, rust-01..20, swift-01..20,
//    kotlin-01..20, php-01..20, ruby-01..20, r-01..20, dart-01..20, bash-01..20,
//    react-01..20, nextjs-01..20, django-01..20, fastapi-01..20, flask-01..20,
//    svelte-01..20, vue-01..20, angular-01..20, nodejs-01..20, postgresql-01..20,
//    mongodb-01..20. Use lessonId: 'python-03' to link roadmap tasks to lessons.
//    CONTENT RULES: 4-10 phases, 2-4 modules/phase, 2-4 tasks/module, specific
//    actionable tasks, each phase 2-3 objectives, each task estMinutes(30-180)
//    xp(50-300) tags. Include AI Bonus Track as second-to-last phase.
//    Output ONLY valid JSON — no markdown fences."
//
// EXAMPLE JSON RESPONSE (abbreviated):
//   {
//     "careerLabel": "Web Development",
//     "totalWeeks": 36,
//     "totalHours": 504,
//     "phases": [
//       {
//         "id": "phase-1-foundations",
//         "number": 1,
//         "title": "Foundations",
//         "subtitle": "HTML, CSS, and JavaScript basics",
//         "color": "teal",
//         "icon": "🚀",
//         "estWeeks": 6,
//         "objectives": ["Build a static webpage", "Style with CSS", "Add interactivity with JS"],
//         "modules": [
//           {
//             "id": "phase-1-m-1-html",
//             "title": "HTML Structure",
//             "description": "Learn semantic HTML tags",
//             "tasks": [
//               {
//                 "id": "phase-1-m-1-t-1",
//                 "title": "Build a personal bio page",
//                 "why": "Practice semantic HTML",
//                 "brief": "Create an index.html with header, main, section, footer",
//                 "steps": ["Create index.html", "Add semantic tags", "Add content"],
//                 "estMinutes": 60,
//                 "xp": 100,
//                 "tags": ["hands-on"],
//                 "lessonId": "html-01"
//               }
//             ]
//           }
//         ]
//       }
//     ],
//     "source": "ai-gemini"
//   }
// ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Launchpad's roadmap architect. Design personalized coding learning roadmaps.

Given a learner's profile, output a JSON learning roadmap with the RIGHT number of phases
(4-10) — choose based on profile complexity. Do NOT force exactly 6.

PERSONALIZATION RULES:
- Phase 1: ALWAYS "Foundations" — basics of the user's PRIMARY language
- If multiple languages: dedicate phases to each (easiest first)
- Last phase: ALWAYS "Capstone & Career" — portfolio + interview prep
- Beginners: expand early phases (more time on syntax, types, flow)
- Intermediate/Advanced: compress early phases (they know the basics)
- Students: add depth and projects
- Professionals: condense, focus on practical shortcuts
- Compute totalWeeks from: weeklyHours × totalWeeks ≈ totalHours
  (Beginner ≈ 600h, Intermediate ≈ 400h, Advanced ≈ 250h)

LESSON LINKING (CRITICAL — use these EXACT IDs):
- python-01 to python-20 | javascript-01 to javascript-20 | typescript-01 to typescript-20
- html-01 to html-20 | css-01 to css-20 | sql-01 to sql-20
- java-01 to java-20 | c-01 to c-20 | cpp-01 to cpp-20 | csharp-01 to csharp-20
- go-01 to go-20 | rust-01 to rust-20 | swift-01 to swift-20 | kotlin-01 to kotlin-20
- php-01 to php-20 | ruby-01 to ruby-20 | r-01 to r-20 | dart-01 to dart-20
- bash-01 to bash-20 | react-01 to react-20 | nextjs-01 to nextjs-20
- django-01 to django-20 | fastapi-01 to fastapi-20 | flask-01 to flask-20
- svelte-01 to svelte-20 | vue-01 to vue-20 | angular-01 to angular-20
- nodejs-01 to nodejs-20 | postgresql-01 to postgresql-20 | mongodb-01 to mongodb-20
Use lessonId: "python-03" to link roadmap tasks to Learn tab lessons.

CONTENT RULES:
- 4-10 phases total (choose based on complexity)
- 2-4 modules per phase
- 2-4 tasks per module
- Tasks must be SPECIFIC and actionable ("Build a guess-the-number game using while loops",
  NOT "Learn loops")
- Each phase: 2-3 objectives (what the user can do after)
- Each task: estMinutes (30-180), xp (50-300), tags (["hands-on"], ["reading"], etc.)
- Include the AI Bonus Track as the second-to-last phase (before Capstone):
  Customize per career — e.g., "AI in Web Dev: chatbots, recommendations" for web devs;
  "MLOps and AI infrastructure" for DevOps; "LLM APIs and AI-assisted coding" for SWEs

Output ONLY valid JSON — no markdown fences, no commentary. The JSON shape:
{
  "careerLabel": string,
  "totalWeeks": number (8-156),
  "totalHours": number,
  "phases": [
    {
      "id": "phase-N-slug",
      "number": N,
      "title": string,
      "subtitle": string,
      "color": "teal" | "violet" | "amber" | "rose" | "emerald" | "sky",
      "icon": string (single emoji),
      "estWeeks": number,
      "objectives": string[] (2-3),
      "modules": [
        {
          "id": "phase-N-m-M-slug",
          "title": string,
          "description": string,
          "tasks": [
            {
              "id": "phase-N-m-M-t-K",
              "title": string,
              "why": string,
              "brief": string,
              "steps": string[] (2-4),
              "estMinutes": number,
              "xp": number,
              "tags": string[],
              "lessonId": string | null
            }
          ]
        }
      ]
    }
  ]
}`;

// ============================================================
// Helper: extract JSON from text (handles markdown fences + truncated recovery)
// ============================================================
function extractJson(content: string): unknown {
  let jsonStr = content.trim();
  // Strip ```json ... ``` if present
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) jsonStr = fenceMatch[1].trim();
  // Find the first { and last } to extract just the JSON object
  const start = jsonStr.indexOf("{");
  const end = jsonStr.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    jsonStr = jsonStr.slice(start, end + 1);
  }
  try {
    return JSON.parse(jsonStr);
  } catch (parseErr) {
    // Try to recover truncated JSON by closing open braces/brackets
    const openBraces = (jsonStr.match(/{/g) || []).length;
    const closeBraces = (jsonStr.match(/}/g) || []).length;
    const openBrackets = (jsonStr.match(/\[/g) || []).length;
    const closeBrackets = (jsonStr.match(/\]/g) || []).length;
    let recovered = jsonStr;
    // Remove trailing incomplete string/property
    recovered = recovered.replace(/,\s*"[^"]*":\s*"[^"]*$/, "");
    recovered = recovered.replace(/,\s*"[^"]*":\s*$/, "");
    recovered = recovered.replace(/,\s*$/, "");
    // Close open structures
    for (let i = 0; i < openBrackets - closeBrackets; i++) recovered += "]";
    for (let i = 0; i < openBraces - closeBraces; i++) recovered += "}";
    return JSON.parse(recovered);
  }
}

// ============================================================
// Provider 1: Google Gemini 2.5 Flash
// ============================================================
async function callGemini(prompt: string): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 6000 },
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Gemini HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  const content = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("\n") ?? "";
  if (!content) throw new Error("Gemini returned empty content");
  return extractJson(content);
}

// ============================================================
// Provider 2: Groq (llama-3.3-70b-versatile)
// ============================================================
async function callGroq(prompt: string): Promise<unknown> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 6000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Groq HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  if (!content) throw new Error("Groq returned empty content");
  return extractJson(content);
}

// ============================================================
// Provider 3: OpenRouter (google/gemini-2.5-flash)
// ============================================================
async function callOpenRouter(prompt: string): Promise<unknown> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://launchpad--pi.vercel.app",
      "X-Title": "Launchpad",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      temperature: 0.7,
      max_tokens: 6000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`OpenRouter HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  if (!content) throw new Error("OpenRouter returned empty content");
  return extractJson(content);
}

// ============================================================
// Simple in-memory rate limiter — protects the deployer's AI quota
// from public abuse. 5 roadmap generations per IP per hour.
// (Production deployments should swap this for a Redis-backed limiter
//  shared across all instances.)
// ============================================================
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 generations / hour / IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { ok: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true, remaining: RATE_LIMIT_MAX - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { ok: false, remaining: 0, resetIn: entry.resetAt - now };
  }
  entry.count++;
  return { ok: true, remaining: RATE_LIMIT_MAX - entry.count, resetIn: entry.resetAt - now };
}

// Periodically evict expired entries to prevent memory leak
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of rateLimitMap) {
      if (v.resetAt < now) rateLimitMap.delete(k);
    }
  }, 5 * 60 * 1000).unref?.();
}

// ============================================================
// POST handler — runs the 3-provider fallback chain
// ============================================================
export async function POST(req: NextRequest) {
  try {
    // Rate limit by client IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";
    const rl = checkRateLimit(ip);
    if (!rl.ok) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. You can generate up to ${RATE_LIMIT_MAX} roadmaps per hour. Try again in ${Math.ceil(rl.resetIn / 60_000)} minutes.`,
          rateLimited: true,
          retryAfterSeconds: Math.ceil(rl.resetIn / 1000),
        },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(rl.resetIn / 1000)) },
        },
      );
    }

    const body = await req.json();
    const { input, issues, previousRoadmap }: {
      input: PersonalizationInput;
      issues?: string[];
      previousRoadmap?: unknown;
    } = body;

    if (!input || !input.careerId) {
      return NextResponse.json({ error: "input with careerId is required" }, { status: 400 });
    }

    // Cap the size of previousRoadmap to prevent oversized payloads from
    // being forwarded to the AI provider (DoS / cost protection).
    if (previousRoadmap) {
      const size = JSON.stringify(previousRoadmap).length;
      if (size > 100_000) {
        return NextResponse.json(
          { error: `previousRoadmap payload too large (${size} bytes, max 100KB)` },
          { status: 413 },
        );
      }
    }

    // Build rich context for the AI
    const career = CAREER_MAP[input.careerId];
    const occupation = OCCUPATION_MAP[input.occupationId];
    const languages = input.selectedLanguageIds
      .map((id: string) => LANGUAGE_MAP[id])
      .filter(Boolean);

    const userContext = {
      career: career ? {
        id: career.id, label: career.label, description: career.description,
        recommendedLanguages: career.recommendedLanguages, skills: career.skills,
      } : null,
      subPath: input.subPath,
      occupation: occupation ? {
        label: occupation.label, pace: occupation.pace, description: occupation.description,
      } : null,
      skillLevel: input.skillLevel,
      selectedLanguages: languages.map((l: { id: string; name: string; difficulty: number; tagline: string }) => ({
        id: l.id, name: l.name, difficulty: l.difficulty, tagline: l.tagline,
      })),
      availability: {
        hoursPerDay: input.hoursPerDay,
        daysPerWeek: input.daysPerWeek,
        weeklyHours: input.hoursPerDay * input.daysPerWeek,
      },
      name: input.name,
    };

    let prompt: string;
    if (issues && previousRoadmap) {
      prompt = `Previous roadmap had these validation issues:\n${JSON.stringify(issues, null, 2)}\n\nPrevious roadmap JSON:\n${JSON.stringify(previousRoadmap, null, 2)}\n\nPlease return a CORRECTED JSON roadmap that fixes ALL the listed issues. Same format. Output ONLY the JSON.`;
    } else {
      prompt = `Design a personalized coding learning roadmap for this learner. Choose the right number of phases (4-10) based on the profile complexity. Output ONLY the JSON roadmap.\n\nLearner profile:\n${JSON.stringify(userContext, null, 2)}`;
    }

    // Run the 3-provider fallback chain
    const providers: { name: RoadmapSource; fn: () => Promise<unknown> }[] = [
      { name: "ai-gemini", fn: () => callGemini(prompt) },
      { name: "ai-groq", fn: () => callGroq(prompt) },
      { name: "ai-openrouter", fn: () => callOpenRouter(prompt) },
    ];

    let lastError: Error | null = null;
    for (const provider of providers) {
      try {
        const roadmap = await provider.fn();
        // Tag the roadmap with the source
        if (roadmap && typeof roadmap === "object") {
          (roadmap as Record<string, unknown>).source = provider.name;
        }
        console.log(`[roadmap-generate] succeeded via ${provider.name}`);
        return NextResponse.json({ roadmap });
      } catch (err) {
        console.warn(`[roadmap-generate] ${provider.name} failed:`, (err as Error).message);
        lastError = err as Error;
        // Continue to next provider
      }
    }

    // All 3 providers failed — caller (personalization-engine) will fall back to deterministic
    return NextResponse.json(
      {
        error: `All 3 AI providers failed. Last error: ${lastError?.message ?? "unknown"}`,
        allFailed: true,
      },
      { status: 502 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Invalid request: ${(err as Error).message}` },
      { status: 400 },
    );
  }
}
