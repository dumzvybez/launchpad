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
    case "custom":
      if (!customEndpoint) throw new Error("Custom endpoint URL is required");
      return callOpenAICompatible(customEndpoint, apiKey, model, messages, temperature, {}, systemPrompt);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// ============================================================
// POST handler
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
    }: {
      messages: ChatMsg[];
      provider: AIProviderKey;
      apiKey: string;
      model: string;
      temperature?: number;
      customEndpoint?: string;
      /** Optional custom system prompt (e.g. for Interview Mode). Falls back to default. */
      systemPrompt?: string;
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
// GET handler — simple health check + "Test Connection" endpoint
// ============================================================
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const test = url.searchParams.get("test");
  if (test === "1") {
    // Test connection: send "Hi" to the configured provider
    const provider = url.searchParams.get("provider") as AIProviderKey;
    const apiKey = url.searchParams.get("apiKey") || "";
    const model = url.searchParams.get("model") || "";
    const customEndpoint = url.searchParams.get("customEndpoint") || undefined;
    if (!provider || !apiKey || !model) {
      return NextResponse.json({ ok: false, error: "Missing provider/apiKey/model params" }, { status: 400 });
    }
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
  return NextResponse.json({ ok: true, service: "launchpad-chat" });
}
