import { NextRequest, NextResponse } from "next/server";
import type { AIProviderKey } from "@/lib/types";

// ============================================================
// System prompt — Launchpad AI Tutor persona
// (Section 2.5 — printed for developer reference)
// ============================================================

// DEVELOPER REFERENCE — full chat system prompt sent to the AI:
// ─────────────────────────────────────────────────────────────
// "You are the Launchpad AI Tutor, a friendly and knowledgeable coding mentor
//  on Launchpad, a free, privacy-first coding education platform.
//  Your role: help learners understand coding concepts, debug code, design solutions.
//  Always wrap code in fenced code blocks with the correct language tag.
//  For beginners, explain step-by-step and define jargon on first use.
//  For non-coding questions (personal advice, medical, legal, financial), politely
//  redirect to coding topics. When relevant, mention the Learn tab (630 lessons
//  across 30 languages), the Playground tab (run code in-browser), and the Roadmap
//  tab. Be concise but complete. Prefer small, runnable examples over long prose.
//  Launchpad is privacy-first and on-device; remind users their data stays on device.
//  You support 30 technologies: Python, JavaScript, TypeScript, HTML, CSS, SQL, Java,
//  C, C++, C#, Go, Rust, Swift, Kotlin, PHP, Ruby, R, Dart, Bash, React, Next.js,
//  Django, FastAPI, Flask, Svelte, Vue, Angular, Node.js, PostgreSQL, MongoDB."
// ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the Launchpad AI Tutor, a friendly and knowledgeable coding mentor on Launchpad, a free, privacy-first coding education platform.

Your role:
- Help learners understand coding concepts, debug code, and design solutions.
- Always wrap code in fenced code blocks with the correct language tag.
- For beginners, explain step-by-step and define jargon on first use.
- For non-coding questions (personal advice, medical, legal, financial), politely redirect to coding topics.
- When relevant, mention the Learn tab (630 lessons across 30 languages), the Playground tab (run code in-browser), and the Roadmap tab (your personalized plan).
- Be concise but complete. Prefer small, runnable examples over long prose.
- Launchpad is privacy-first and on-device; remind users their data stays on their device.

You support 30 technologies: Python, JavaScript, TypeScript, HTML, CSS, SQL, Java, C, C++, C#, Go, Rust, Swift, Kotlin, PHP, Ruby, R, Dart, Bash, React, Next.js, Django, FastAPI, Flask, Svelte, Vue, Angular, Node.js, PostgreSQL, MongoDB.`;

// ============================================================
// SSRF protection — block private / loopback / link-local hosts
// from being used as `customEndpoint`. This prevents a user from
// making the server fetch internal services (e.g. cloud metadata).
// ============================================================
function isPrivateOrLoopbackHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h === "0.0.0.0" || h === "::" || h === "[::]") return true;
  // IPv4 loopback 127.x.x.x
  if (/^127\.\d+\.\d+\.\d+$/.test(h)) return true;
  // IPv4 private ranges
  if (/^10\.\d+\.\d+\.\d+$/.test(h)) return true;
  if (/^192\.168\.\d+\.\d+$/.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(h)) return true;
  // Link-local 169.254.x.x (AWS/GCP/Azure metadata endpoints)
  if (/^169\.254\.\d+\.\d+$/.test(h)) return true;
  // IPv6 loopback / link-local
  if (h === "::1" || h === "[::1]") return true;
  if (h.startsWith("fe80:") || h.startsWith("[fe80:")) return true;
  return false;
}

function assertSafeExternalUrl(rawUrl: string): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Invalid custom endpoint URL");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`Custom endpoint must use http(s) protocol, got ${url.protocol}`);
  }
  // Block internal/private IPs and localhost
  if (isPrivateOrLoopbackHost(url.hostname)) {
    throw new Error(`Custom endpoint hostname "${url.hostname}" is blocked (SSRF protection)`);
  }
  return url;
}

// ============================================================
// Provider routing — BYOK only (no free default)
// ============================================================
type ChatMsg = { role: "user" | "assistant"; content: string };

async function callGemini(apiKey: string, model: string, messages: ChatMsg[], temperature: number, systemPrompt: string = SYSTEM_PROMPT): Promise<string> {
  // Gemini uses parts/roles; systemInstruction is separate
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { temperature, maxOutputTokens: 2048 },
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Gemini HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("\n") ?? "";
}

async function callOpenAICompatible(
  url: string,
  apiKey: string,
  model: string,
  messages: ChatMsg[],
  temperature: number,
  extraHeaders: Record<string, string> = {},
  systemPrompt: string = SYSTEM_PROMPT,
): Promise<string> {
  const fullMessages = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages: fullMessages,
      temperature,
      max_tokens: 2048,
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`${url} HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

async function callAnthropic(apiKey: string, model: string, messages: ChatMsg[], temperature: number, systemPrompt: string = SYSTEM_PROMPT): Promise<string> {
  // Anthropic: system is a top-level field; messages is just user/assistant
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system: systemPrompt,
      temperature,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Anthropic HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  return data?.content?.map((c: { text?: string }) => c.text).join("\n") ?? "";
}

async function fetchProviderChat(
  provider: AIProviderKey,
  apiKey: string,
  model: string,
  messages: ChatMsg[],
  temperature: number,
  customEndpoint?: string,
  systemPrompt?: string,
): Promise<string> {
  switch (provider) {
    case "gemini":
      return callGemini(apiKey, model, messages, temperature, systemPrompt);
    case "groq":
      return callOpenAICompatible(
        "https://api.groq.com/openai/v1/chat/completions",
        apiKey, model, messages, temperature, {}, systemPrompt,
      );
    case "openrouter":
      return callOpenAICompatible(
        "https://openrouter.ai/api/v1/chat/completions",
        apiKey, model, messages, temperature,
        { "HTTP-Referer": "https://launchpad--pi.vercel.app", "X-Title": "Launchpad" },
        systemPrompt,
      );
    case "openai":
      return callOpenAICompatible(
        "https://api.openai.com/v1/chat/completions",
        apiKey, model, messages, temperature, {}, systemPrompt,
      );
    case "anthropic":
      return callAnthropic(apiKey, model, messages, temperature, systemPrompt);
    case "custom": {
      if (!customEndpoint) throw new Error("Custom endpoint URL is required");
      // SSRF: validate the custom endpoint before fetching it
      assertSafeExternalUrl(customEndpoint);
      return callOpenAICompatible(customEndpoint, apiKey, model, messages, temperature, {}, systemPrompt);
    }
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// ============================================================
// POST handler — supports both real chat and POST-based Test Connection
// (test=1 in the JSON body sends "Hi" instead of the messages array,
//  so the API key is never leaked in URL query strings)
// ============================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      provider,
      apiKey,
      model,
      temperature,
      customEndpoint,
      systemPrompt,
      test,
    }: {
      messages?: ChatMsg[];
      provider: AIProviderKey;
      apiKey: string;
      model: string;
      temperature?: number;
      customEndpoint?: string;
      /** Optional custom system prompt (e.g. for Interview Mode). Falls back to default. */
      systemPrompt?: string;
      /** When truthy, run the "Test Connection" path: send "Hi" instead of messages. */
      test?: boolean;
    } = body;

    // BYOK: every user must provide their own API key — no free default
    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json(
        { error: "API key is required. Add your own key in AI Tutor settings." },
        { status: 401 },
      );
    }
    if (!provider) {
      return NextResponse.json({ error: "Provider is required" }, { status: 400 });
    }
    if (!model) {
      return NextResponse.json({ error: "Model is required" }, { status: 400 });
    }

    // Test Connection path — POST-based, no URL params
    if (test) {
      try {
        const content = await fetchProviderChat(
          provider, apiKey, model,
          [{ role: "user", content: "Hi" }],
          0.7, customEndpoint,
        );
        return NextResponse.json({ ok: true, response: content.slice(0, 200) });
      } catch (err) {
        return NextResponse.json({ ok: false, error: (err as Error).message });
      }
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    // Sanitize messages — keep last 20 to bound cost
    const trimmed = messages.slice(-20);

    const content = await fetchProviderChat(
      provider,
      apiKey,
      model,
      trimmed,
      temperature ?? 0.7,
      customEndpoint,
      systemPrompt,
    );

    return NextResponse.json({ content, provider });
  } catch (err) {
    console.error("[chat] error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 502 },
    );
  }
}

// ============================================================
// GET handler — simple health check.
// The previous "Test Connection via GET ?apiKey=..." endpoint was
// deprecated and removed for security (API keys were leaking into
// browser history, server logs, and CDN access logs). Use POST with
// `{ test: true }` in the body instead.
// ============================================================
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "launchpad-chat",
    note: "Use POST with { test: true } in the body to test a connection. The GET ?test=1&apiKey=... endpoint has been removed for security.",
  });
}
