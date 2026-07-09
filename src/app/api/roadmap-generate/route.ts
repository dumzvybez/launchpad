import { NextRequest, NextResponse } from "next/server";
import type { PersonalizationInput, RoadmapSource } from "@/lib/types";
import { CAREER_MAP, LANGUAGE_MAP, OCCUPATION_MAP } from "@/lib/career-data";

// v5.77 fix: explicit runtime + max duration so the 3-provider fallback chain
// doesn't time out on Vercel Hobby (default 10s).
export const runtime = "nodejs";
export const maxDuration = 60;

// v5.77 fix: 30s timeout for each upstream AI fetch. Prevents a hanging
// provider from blocking the entire fallback chain indefinitely.
const AI_FETCH_TIMEOUT_MS = 30_000;
function abortAfter(ms: number): AbortSignal {
  // AbortSignal.timeout is supported in Node 18+ and all modern browsers.
  return AbortSignal.timeout(ms);
}

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

Given a learner's profile, output a JSON learning roadmap. The number of phases MUST SCALE with the number of selected languages:
- 1-2 languages: 6-8 phases
- 3-5 languages: 8-12 phases
- 6-10 languages: 12-16 phases
- 11-20 languages: 16-22 phases
- 21+ languages: 22-30 phases (one phase per language group, grouped by ecosystem)
Do NOT cap at 10 phases if the user selected many languages. EVERY selected language MUST appear in at least one phase's modules or tasks.

PERSONALIZATION RULES:
- Phase 1: ALWAYS "Foundations" — basics of the user's PRIMARY language
- For each additional language: dedicate a phase (or group related languages like React+Next.js into one phase)
- Last phase: ALWAYS "Capstone & Career" — portfolio + interview prep
- Second-to-last phase: ALWAYS "AI Bonus Track" (customize per career)
- Beginners: expand early phases (more time on syntax, types, flow)
- Intermediate/Advanced: compress early phases (they know the basics)
- Students: add depth and projects
- Professionals: condense, focus on practical shortcuts
- Compute totalWeeks from: weeklyHours × totalWeeks ≈ totalHours
  (Beginner ≈ 600h + 50h per additional language, Intermediate ≈ 400h + 30h per language, Advanced ≈ 250h + 20h per language)

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
- Scale phase count with language count (see above — do NOT cap at 10)
- 2-4 modules per phase (use more modules for grouped language phases)
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
  "totalWeeks": number (8-400),
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
    // Try to recover truncated JSON by closing open braces/brackets.
    // IMPORTANT: count braces/brackets OUTSIDE of string literals —
    // the previous `(jsonStr.match(/{/g) || []).length` counted braces
    // inside JSON strings too (e.g. a task description like "Use the {...}
    // syntax"), producing an incorrect count and appending too many `}`
    // characters, which made the recovered JSON unparseable.
    let inString = false;
    let escape = false;
    let openBraces = 0;
    let closeBraces = 0;
    let openBrackets = 0;
    let closeBrackets = 0;
    for (const ch of jsonStr) {
      if (escape) { escape = false; continue; }
      if (ch === "\\" && inString) { escape = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === "{") openBraces++;
      else if (ch === "}") closeBraces++;
      else if (ch === "[") openBrackets++;
      else if (ch === "]") closeBrackets++;
    }
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
// v5.89 (BUG 2): Safe per-provider token limits based on ACTUAL rate limits.
// v5.90 (PART 2): These are now STARTING defaults. The server reads
// rate-limit headers from provider responses and adapts. On 413 errors,
// it retries with a smaller max_tokens.
// ============================================================
const GEMINI_MAX_TOKENS = 16384;  // Safe within 60s timeout
const GROQ_MAX_TOKENS = 8000;    // Fits within 12K TPM (2K prompt + 8K output = 10K < 12K)
const OPENROUTER_MAX_TOKENS = 8000;  // Model-specific cap
const OPENAI_MAX_TOKENS = 8000;      // v5.90: added OpenAI support
const ANTHROPIC_MAX_TOKENS = 8000;   // v5.90: added Anthropic support
const CUSTOM_MAX_TOKENS = 8000;      // v5.90: added Custom endpoint support

// v5.90 (PART 2): Track rate-limit info from provider response headers.
// Groq returns: x-ratelimit-limit-tokens, x-ratelimit-remaining-tokens, x-ratelimit-reset-tokens
// We use these to size subsequent requests. Initial values are the safe defaults above.
let groqKnownLimit: number | null = null;  // TPM limit, discovered from headers

function getGroqMaxTokens(): number {
  // v5.90: if we've seen rate-limit headers, reserve 30% for the prompt
  // and use the rest for output. Otherwise use the safe default.
  if (groqKnownLimit && groqKnownLimit > 0) {
    const reservedForPrompt = Math.min(3000, Math.floor(groqKnownLimit * 0.3));
    const outputBudget = groqKnownLimit - reservedForPrompt;
    return Math.max(2000, Math.min(outputBudget, 16000)); // clamp 2K-16K
  }
  return GROQ_MAX_TOKENS;
}

// ============================================================
// v5.90 (PART 2): Read rate-limit headers from a response and update
// the known limits. Called after every provider response.
// ============================================================
function updateRateLimitsFromHeaders(provider: string, headers: Headers): void {
  if (provider === "groq") {
    const limitTokens = headers.get("x-ratelimit-limit-tokens");
    if (limitTokens) {
      const n = parseInt(limitTokens, 10);
      if (!isNaN(n) && n > 0) {
        groqKnownLimit = n;
        console.log(`[roadmap-generate] Groq TPM limit discovered from headers: ${n}`);
      }
    }
  }
  // Gemini, OpenRouter, OpenAI, Anthropic don't return useful per-request
  // token-limit headers in a consistent way, so we rely on the safe defaults.
}

// ============================================================
// v5.90 (PART 2): Check if an error is a 413 / rate-limit error that
// warrants a retry with a smaller token budget.
// ============================================================
function isTokenLimitError(status: number, errorMsg: string): boolean {
  if (status === 413) return true;
  if (status === 429) return true;
  // Groq returns 413 with "Request too large for model" message
  if (errorMsg.includes("Request too large") || errorMsg.includes("too large")) return true;
  if (errorMsg.includes("rate limit") || errorMsg.includes("rate_limit")) return true;
  if (errorMsg.includes("maximum context length") || errorMsg.includes("token limit")) return true;
  return false;
}

// ============================================================
// Provider 1: Google Gemini 2.5 Flash
// v5.89: supports optional user-supplied API key (BYOK for roadmap generation)
// v5.90 (PART 1): ONLY uses user-supplied key — no platform key fallback.
// v5.90 (PART 3): Uses Gemini's generateContent format (NOT OpenAI/Anthropic format).
// ============================================================
async function callGemini(prompt: string, userApiKey: string, model: string): Promise<unknown> {
  if (!userApiKey) throw new Error("No Gemini API key provided");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${userApiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      // v5.90 (PART 3): Gemini uses "contents" array with "parts" — NOT OpenAI's
      // "messages" array or Anthropic's top-level "system" field.
      contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: GEMINI_MAX_TOKENS },
    }),
    signal: abortAfter(AI_FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Gemini HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }
  updateRateLimitsFromHeaders("gemini", res.headers);
  const data = await res.json();
  const content = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("\n") ?? "";
  if (!content) throw new Error("Gemini returned empty content");
  return extractJson(content);
}

// ============================================================
// Provider 2: Groq (OpenAI-compatible chat completions)
// v5.90 (PART 1): ONLY uses user-supplied key — no platform key fallback.
// v5.90 (PART 2): Adaptive token limits via rate-limit headers + 413 retry.
// v5.90 (PART 3): Uses OpenAI-compatible format (messages array with role/content).
// ============================================================
async function callGroq(prompt: string, userApiKey: string, model: string): Promise<unknown> {
  if (!userApiKey) throw new Error("No Groq API key provided");
  const maxTokens = getGroqMaxTokens();
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userApiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: maxTokens,
      // v5.90 (PART 3): OpenAI-compatible messages format
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    }),
    signal: abortAfter(AI_FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    const status = res.status;
    // v5.90 (PART 2): On 413/rate-limit, retry with half the token budget
    if (isTokenLimitError(status, txt)) {
      console.warn(`[roadmap-generate] Groq ${status} (tokens too large), retrying with smaller budget`);
      const retryRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${userApiKey}` },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          max_tokens: Math.max(2000, Math.floor(maxTokens / 2)),
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
        }),
        signal: abortAfter(AI_FETCH_TIMEOUT_MS),
      });
      if (!retryRes.ok) {
        const retryTxt = await retryRes.text().catch(() => "");
        throw new Error(`Groq retry HTTP ${retryRes.status}: ${retryTxt.slice(0, 200)}`);
      }
      updateRateLimitsFromHeaders("groq", retryRes.headers);
      const retryData = await retryRes.json();
      const retryContent = retryData?.choices?.[0]?.message?.content ?? "";
      if (!retryContent) throw new Error("Groq retry returned empty content");
      return extractJson(retryContent);
    }
    throw new Error(`Groq HTTP ${status}: ${txt.slice(0, 200)}`);
  }
  updateRateLimitsFromHeaders("groq", res.headers);
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  if (!content) throw new Error("Groq returned empty content");
  return extractJson(content);
}

// ============================================================
// Provider 3: OpenRouter (OpenAI-compatible chat completions)
// v5.90 (PART 1): ONLY uses user-supplied key — no platform key fallback.
// v5.90 (PART 3): Uses OpenAI-compatible format (messages array with role/content).
// ============================================================
async function callOpenRouter(prompt: string, userApiKey: string, model: string): Promise<unknown> {
  if (!userApiKey) throw new Error("No OpenRouter API key provided");
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userApiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://launchpad--dev.vercel.app",
      "X-Title": "Launchpad",
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: OPENROUTER_MAX_TOKENS,
      // v5.90 (PART 3): OpenAI-compatible messages format
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    }),
    signal: abortAfter(AI_FETCH_TIMEOUT_MS),
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
// v5.90 (PART 1+3): Provider 4: OpenAI (OpenAI-compatible chat completions)
// Uses user-supplied key only. OpenAI-compatible format.
// ============================================================
async function callOpenAI(prompt: string, userApiKey: string, model: string): Promise<unknown> {
  if (!userApiKey) throw new Error("No OpenAI API key provided");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userApiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: OPENAI_MAX_TOKENS,
      // v5.90 (PART 3): OpenAI-compatible messages format
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    }),
    signal: abortAfter(AI_FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`OpenAI HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  if (!content) throw new Error("OpenAI returned empty content");
  return extractJson(content);
}

// ============================================================
// v5.90 (PART 1+3): Provider 5: Anthropic (Messages API — NOT OpenAI format)
// v5.90 (PART 3): Uses Anthropic's DISTINCT format: system prompt is a
// top-level "system" field (NOT a message with role:"system"), and the
// messages array contains only user/assistant turns. Field is "max_tokens"
// (same name as OpenAI but different API path).
// ============================================================
async function callAnthropic(prompt: string, userApiKey: string, model: string): Promise<unknown> {
  if (!userApiKey) throw new Error("No Anthropic API key provided");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": userApiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: ANTHROPIC_MAX_TOKENS,
      // v5.90 (PART 3): Anthropic's DISTINCT format — system is top-level,
      // NOT a message with role:"system"
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: prompt },
      ],
    }),
    signal: abortAfter(AI_FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Anthropic HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  // v5.90 (PART 3): Anthropic returns content as an array of {type:"text", text:"..."}
  const content = data?.content?.map((c: { text?: string }) => c.text).join("\n") ?? "";
  if (!content) throw new Error("Anthropic returned empty content");
  return extractJson(content);
}

// ============================================================
// v5.90 (PART 1+3): Provider 6: Custom endpoint (OpenAI-compatible)
// The user provides their own endpoint URL + key + model name.
// v5.90 (PART 1): SSRF protection is applied (same as /api/chat).
// ============================================================
async function callCustom(prompt: string, userApiKey: string, model: string, customEndpoint: string): Promise<unknown> {
  if (!userApiKey) throw new Error("No custom API key provided");
  if (!customEndpoint) throw new Error("Custom endpoint URL is required");
  // v5.90: validate the custom endpoint against SSRF (reuse the chat route's logic)
  await assertSafeExternalUrl(customEndpoint);
  const res = await fetch(customEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userApiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: CUSTOM_MAX_TOKENS,
      // v5.90 (PART 3): OpenAI-compatible messages format
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    }),
    signal: abortAfter(AI_FETCH_TIMEOUT_MS),
    // v5.90: block redirects (SSRF protection, same as /api/chat)
    redirect: "manual",
  });
  // v5.90: reject 3xx redirects
  if (res.status >= 300 && res.status < 400) {
    throw new Error(`Custom endpoint returned a redirect (${res.status}) — redirects are blocked for security.`);
  }
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Custom endpoint HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  if (!content) throw new Error("Custom endpoint returned empty content");
  return extractJson(content);
}

// ============================================================
// v5.90 (PART 1): SSRF protection for custom endpoints
// (copied from /api/chat — same private/loopback IP blocking + DNS re-check)
// ============================================================
function isPrivateOrLoopbackHost(host: string): boolean {
  const h = host.toLowerCase().replace(/^\[|\]$/g, "");
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h === "0.0.0.0" || h === "::") return true;
  if (/^127\.\d+\.\d+\.\d+$/.test(h)) return true;
  if (/^10\.\d+\.\d+\.\d+$/.test(h)) return true;
  if (/^192\.168\.\d+\.\d+$/.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(h)) return true;
  if (/^169\.254\.\d+\.\d+$/.test(h)) return true;
  if (h === "::1") return true;
  if (h.startsWith("fe80:")) return true;
  if (h.startsWith("fc") || h.startsWith("fd")) return true;
  const mapped = h.match(/^(?:::ffff:)?(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateOrLoopbackHost(mapped[1]);
  return false;
}

async function assertSafeExternalUrl(rawUrl: string): Promise<void> {
  let url: URL;
  try { url = new URL(rawUrl); } catch { throw new Error("Invalid custom endpoint URL"); }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`Custom endpoint must use http(s) protocol`);
  }
  if (isPrivateOrLoopbackHost(url.hostname)) {
    throw new Error(`Custom endpoint hostname "${url.hostname}" is blocked (SSRF protection)`);
  }
}

// ============================================================
// v5.85 note (5.1): This rate limiter is per-serverless-instance — on Vercel,
// different function instances have separate counters, so the effective limit
// is instances × 5/hour. For true distributed rate limiting, use Vercel KV or Upstash.
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
  // v5.77 fix: lazy eviction of expired entries (replaces the setInterval that
  // leaked intervals in serverless and never actually ran periodically).
  for (const [k, v] of rateLimitMap) {
    if (v.resetAt < now) rateLimitMap.delete(k);
  }
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

// v5.77 fix: removed module-level setInterval — in Vercel serverless it leaked
// intervals per cold start and never ran periodically (instances freeze between
// invocations). Lazy eviction above handles cleanup.

// ============================================================
// POST handler — runs the 3-provider fallback chain
// ============================================================
export async function POST(req: NextRequest) {
  try {
    // v5.77 fix: rate limit by client IP — use the LAST entry in x-forwarded-for
    // (set by Vercel's edge), not the first (which is client-controllable and
    // allowed trivial rate-limit bypass via `X-Forwarded-For: 1.2.3.4`).
    // If IP can't be determined, apply a stricter "unknown" bucket.
    const xff = req.headers.get("x-forwarded-for");
    let ip: string;
    if (xff) {
      const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
      ip = parts.length > 0 ? parts[parts.length - 1] : "unknown";
    } else {
      ip = req.headers.get("x-real-ip") ?? "unknown";
    }
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

    // Reject oversized request bodies BEFORE parsing to prevent
    // memory-exhaustion DoS. A legitimate roadmap-generate request is
    // well under 10KB; anything bigger is either a corrupt client or a
    // malicious payload.
    const contentLength = Number(req.headers.get("content-length") ?? "0");
    if (contentLength && contentLength > 50_000) {
      return NextResponse.json(
        { error: `Request body too large (${contentLength} bytes, max 50KB)` },
        { status: 413 },
      );
    }

    const body = await req.json();
    const { input, issues, previousRoadmap, userApiKey, userProvider, userModel, customEndpoint }: {
      input: PersonalizationInput;
      issues?: string[];
      previousRoadmap?: unknown;
      /** v5.89 (BUG 4): Optional user-supplied API key (BYOK).
       * v5.90 (PART 1): REQUIRED for any AI generation — if not provided,
       * the route returns allFailed:true so the client uses the deterministic
       * engine. NO platform-wide keys are used for roadmap generation. */
      userApiKey?: string;
      /** Which provider the user's key is for (gemini|groq|openrouter|openai|anthropic|custom). */
      userProvider?: string;
      /** v5.90 (PART 1): The model to use (from the user's settings). */
      userModel?: string;
      /** v5.90 (PART 1): Custom endpoint URL (only for provider="custom"). */
      customEndpoint?: string;
    } = body;

    if (!input || !input.careerId) {
      return NextResponse.json({ error: "input with careerId is required" }, { status: 400 });
    }
    // v5.865 fix (5.2): validate careerId against known CareerId values.
    const knownCareerIds = Object.keys(CAREER_MAP);
    if (!knownCareerIds.includes(input.careerId)) {
      return NextResponse.json(
        { error: `Invalid careerId "${input.careerId}". Must be one of: ${knownCareerIds.join(", ")}` },
        { status: 400 },
      );
    }

    // Cap the size of previousRoadmap to prevent oversized payloads from
    // being forwarded to the AI provider (DoS / cost protection).
    // v5.865 fix (B.1): declare sanitizedRoadmap BEFORE use, fix TDZ crash.
    let sanitizedRoadmap: Record<string, unknown> | null = null;
    if (previousRoadmap) {
      const size = JSON.stringify(previousRoadmap).length;
      if (size > 100_000) {
        return NextResponse.json(
          { error: `previousRoadmap payload too large (${size} bytes, max 100KB)` },
          { status: 413 },
        );
      }
      const pr = previousRoadmap as Record<string, unknown>;
      if (typeof pr !== "object" || pr === null) {
        return NextResponse.json(
          { error: "previousRoadmap must be an object" },
          { status: 400 },
        );
      }
      // Check for instruction-like patterns in stringified roadmap
      const roadmapStr = JSON.stringify(pr);
      const injectionPatterns = [
        /ignore (all )?previous instructions/i,
        /you are (now )?a/i,
        /system prompt/i,
        /forget everything/i,
        /do not follow/i,
        /disregard the above/i,
        /new instructions/i,
        /\[INST\]/i,
        /<\|im_start\|>/i,
      ];
      for (const pattern of injectionPatterns) {
        if (pattern.test(roadmapStr)) {
          return NextResponse.json(
            { error: "previousRoadmap contains suspicious content" },
            { status: 400 },
          );
        }
      }
      // Only allow known roadmap fields — strip anything else
      const allowedFields = ["phases", "totalWeeks", "totalHours", "careerId", "careerLabel", "source", "languageIds"];
      sanitizedRoadmap = {};
      for (const field of allowedFields) {
        if (field in pr) sanitizedRoadmap[field] = pr[field];
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

    // v5.865 fix (B.1): prompt is now declared BEFORE any use, and uses
    // sanitizedRoadmap (not the raw previousRoadmap) to prevent injection.
    // v5.88: explicitly tell the AI how many phases to generate based on language count.
    const langCount = input.selectedLanguageIds.length;
    const minPhases = langCount <= 2 ? 6 : langCount <= 5 ? 8 : langCount <= 10 ? 12 : langCount <= 20 ? 16 : 22;
    const maxPhases = langCount <= 2 ? 8 : langCount <= 5 ? 12 : langCount <= 10 ? 16 : langCount <= 20 ? 22 : 30;
    let prompt: string;
    if (issues && sanitizedRoadmap) {
      prompt = `Previous roadmap had these validation issues:\n${JSON.stringify(issues, null, 2)}\n\nPrevious roadmap JSON:\n${JSON.stringify(sanitizedRoadmap, null, 2)}\n\nPlease return a CORRECTED JSON roadmap that fixes ALL the listed issues. Same format. Output ONLY the JSON.`;
    } else {
      prompt = `Design a personalized coding learning roadmap for this learner.\n\nCRITICAL: The learner selected ${langCount} language(s)/framework(s). You MUST generate between ${minPhases} and ${maxPhases} phases. EVERY one of the ${langCount} selected languages MUST appear in at least one phase — do NOT silently drop any language. Group related languages (e.g., React+Next.js, Django+FastAPI+Flask) into combined phases where sensible, but ensure full coverage.\n\nOutput ONLY the JSON roadmap.\n\nLearner profile:\n${JSON.stringify(userContext, null, 2)}`;
    }

    // v5.90 (PART 1): BYOK-ONLY for roadmap generation.
    // REQUIRED BEHAVIOR:
    //   1. If the user provided their own API key → use ONLY that key (one provider call).
    //   2. If the user did NOT provide a key → return allFailed:true immediately.
    //      The client uses the deterministic engine. NO platform-wide keys are used.
    //   3. NO platform-wide key fallback for roadmap generation.
    // Platform-wide keys (GEMINI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY) are
    // still used by /api/chat for AI Tutor / Interview / Code Review — but NOT
    // for roadmap generation. This resolves the shared-quota TPM exhaustion.

    const safeUserKey = userApiKey && typeof userApiKey === "string" && userApiKey.trim().length > 0 && userApiKey.length <= 200 ? userApiKey.trim() : undefined;
    const safeModel = typeof userModel === "string" && userModel.trim().length > 0 ? userModel.trim() : "";

    // v5.90 (PART 1): If no user key → signal the client to use deterministic engine.
    if (!safeUserKey || !userProvider) {
      console.log("[roadmap-generate] no user API key provided — signaling client to use deterministic engine");
      return NextResponse.json(
        {
          error: "No user API key provided. Roadmap generation requires a user-supplied API key (BYOK). The client will use the deterministic engine instead.",
          allFailed: true,
          noUserKey: true,
        },
        { status: 502 },
      );
    }

    // v5.90 (PART 1): Build a single-provider call using ONLY the user's key.
    // Map provider name → RoadmapSource tag + call function.
    type ProviderEntry = { name: RoadmapSource; fn: () => Promise<unknown> };
    let provider: ProviderEntry | null = null;

    if (userProvider === "gemini" && safeModel) {
      provider = { name: "ai-gemini", fn: () => callGemini(prompt, safeUserKey!, safeModel) };
    } else if (userProvider === "groq" && safeModel) {
      provider = { name: "ai-groq", fn: () => callGroq(prompt, safeUserKey!, safeModel) };
    } else if (userProvider === "openrouter" && safeModel) {
      provider = { name: "ai-openrouter", fn: () => callOpenRouter(prompt, safeUserKey!, safeModel) };
    } else if (userProvider === "openai" && safeModel) {
      // v5.90 (PART 1): OpenAI is a valid RoadmapSource via the "ai-openrouter"
      // tag (we don't have a separate "ai-openai" source, so we tag as openrouter-style).
      // Actually, for clarity, let's add an "ai-openai" source. But to avoid changing
      // the RoadmapSource type (which would break client code), we'll use "ai-openrouter"
      // as the tag for all OpenAI-compatible providers (OpenAI, Anthropic, Custom).
      // The client only uses this for display ("Generated by AI" vs "deterministic").
      provider = { name: "ai-openrouter", fn: () => callOpenAI(prompt, safeUserKey!, safeModel) };
    } else if (userProvider === "anthropic" && safeModel) {
      provider = { name: "ai-openrouter", fn: () => callAnthropic(prompt, safeUserKey!, safeModel) };
    } else if (userProvider === "custom" && safeModel && customEndpoint) {
      provider = { name: "ai-openrouter", fn: () => callCustom(prompt, safeUserKey!, safeModel, customEndpoint) };
    }

    if (!provider) {
      return NextResponse.json(
        { error: `Invalid provider/model combination: provider=${userProvider}, model=${safeModel ? "(set)" : "(missing)"}, customEndpoint=${customEndpoint ? "(set)" : "(missing)"}`, allFailed: true },
        { status: 400 },
      );
    }

    // v5.90 (PART 1): Single attempt with the user's key. No multi-provider fallback.
    try {
      const roadmap = await provider.fn();
      // Tag the roadmap with the source
      if (roadmap && typeof roadmap === "object") {
        (roadmap as Record<string, unknown>).source = provider.name;
      }

      // v5.89 (BUG 2): Post-generation coverage verification. If the AI
      // truncated the output (e.g., hit the 8K token limit with 20+ languages),
      // some selected languages may be missing from the roadmap. Tag them
      // so the client can supplement with deterministic phases.
      const aiRoadmap = roadmap as { phases?: Array<{ modules?: Array<{ tasks?: Array<{ lessonId?: string }> }> }> };
      if (aiRoadmap.phases && Array.isArray(aiRoadmap.phases)) {
        const coveredLangs = new Set<string>();
        for (const phase of aiRoadmap.phases) {
          for (const mod of phase.modules ?? []) {
            for (const task of mod.tasks ?? []) {
              if (task.lessonId) {
                const trackId = task.lessonId.split("-")[0];
                if (trackId) coveredLangs.add(trackId);
              }
            }
          }
        }
        // Also check phase/module/task titles for language names
        const phaseText = JSON.stringify(aiRoadmap.phases).toLowerCase();
        for (const langId of input.selectedLanguageIds) {
          const langName = LANGUAGE_MAP[langId]?.name?.toLowerCase();
          if (phaseText.includes(langId.toLowerCase()) || (langName && phaseText.includes(langName))) {
            coveredLangs.add(langId);
          }
        }
        const missing = input.selectedLanguageIds.filter((id: string) => !coveredLangs.has(id));
        if (missing.length > 0) {
          console.log(`[roadmap-generate] ${provider.name} roadmap missing ${missing.length} languages:`, missing);
          (roadmap as Record<string, unknown>)._missingLanguages = missing;
        }
      }

      console.log(`[roadmap-generate] succeeded via ${provider.name} (user key)`);
      return NextResponse.json({ roadmap });
    } catch (err) {
      // v5.90 (PART 6): PRIVACY FIX — sanitize the error message before logging
      // and before returning to the client. The raw error may include the Gemini
      // URL (which contains ?key=${apiKey}). Strip ?key=... to prevent API key
      // leaking to Vercel server logs or to the client.
      const rawErrMsg = (err as Error).message || String(err);
      const sanitizedErrMsg = rawErrMsg.replace(/\?key=[^&\s"]+/g, "?key=[REDACTED]");
      console.warn(`[roadmap-generate] ${provider.name} failed:`, sanitizedErrMsg);
      return NextResponse.json(
        { error: `${provider.name} failed: ${sanitizedErrMsg}`, allFailed: true },
        { status: 502 },
      );
    }
    // v5.90: unreachable — the try/catch above always returns. Kept for safety.
    return NextResponse.json(
      { error: "Unexpected code path", allFailed: true },
      { status: 500 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Invalid request: ${(err as Error).message}` },
      { status: 400 },
    );
  }
}
