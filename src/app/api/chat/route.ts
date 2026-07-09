import { NextRequest, NextResponse } from "next/server";
import type { AIProviderKey } from "@/lib/types";

// v5.77 fix: explicit runtime + max duration for the BYOK chat proxy.
// v5.866 BUG 2A FIX: added `dynamic = "force-dynamic"` to ensure Vercel
// doesn't cache or buffer the streaming response.
export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// v5.77 fix: 60s timeout for upstream AI fetches (BYOK chat can produce long responses).
// v5.85 fix (5.5): lowered from 60s to 50s to leave buffer before Vercel's maxDuration=60
const CHAT_FETCH_TIMEOUT_MS = 50_000;

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
  const h = host.toLowerCase().replace(/^\[|\]$/g, ""); // strip IPv6 brackets
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h === "0.0.0.0" || h === "::") return true;
  // IPv4 loopback 127.x.x.x
  if (/^127\.\d+\.\d+\.\d+$/.test(h)) return true;
  // IPv4 private ranges
  if (/^10\.\d+\.\d+\.\d+$/.test(h)) return true;
  if (/^192\.168\.\d+\.\d+$/.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(h)) return true;
  // Link-local 169.254.x.x (AWS/GCP/Azure metadata endpoints)
  if (/^169\.254\.\d+\.\d+$/.test(h)) return true;
  // IPv6 loopback / link-local
  if (h === "::1") return true;
  if (h.startsWith("fe80:")) return true;
  // IPv6 unique local addresses fc00::/7 (private IPv6 range)
  if (h.startsWith("fc") || h.startsWith("fd")) return true;
  // IPv4-mapped IPv6 like ::ffff:127.0.0.1
  const mapped = h.match(/^(?:::ffff:)?(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) {
    return isPrivateOrLoopbackHost(mapped[1]);
  }
  // Block decimal / hex / octal IPv4 forms — these are all valid ways to
  // write e.g. 127.0.0.1 (e.g. http://2130706433/ = 127.0.0.1) and would
  // otherwise bypass the dotted-decimal checks above.
  if (/^\d+$/.test(h)) {
    const n = Number(h);
    if (Number.isFinite(n) && n >= 0 && n <= 0xffffffff) {
      // Reconstruct dotted-decimal and recurse.
      const a = (n >>> 24) & 0xff;
      const b = (n >>> 16) & 0xff;
      const c = (n >>> 8) & 0xff;
      const d = n & 0xff;
      return isPrivateOrLoopbackHost(`${a}.${b}.${c}.${d}`);
    }
  }
  if (/^0x[0-9a-f]+$/i.test(h)) {
    const n = parseInt(h, 16);
    if (Number.isFinite(n) && n >= 0 && n <= 0xffffffff) {
      const a = (n >>> 24) & 0xff;
      const b = (n >>> 16) & 0xff;
      const c = (n >>> 8) & 0xff;
      const d = n & 0xff;
      return isPrivateOrLoopbackHost(`${a}.${b}.${c}.${d}`);
    }
  }
  // v5.865 fix (B.5): block octal IP forms (0177.0.0.1 = 127.0.0.1)
  if (/^0[0-7]+\.\d+\.\d+\.\d+$/.test(h)) {
    const parts = h.split(".");
    const octal = parseInt(parts[0], 8);
    if (octal <= 255) {
      return isPrivateOrLoopbackHost(`${octal}.${parts[1]}.${parts[2]}.${parts[3]}`);
    }
  }
  // v5.865 fix (B.5): block mixed octal/decimal forms (127.0.0.0177 etc.)
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) {
    const parts = h.split(".");
    // If any part has a leading zero and is more than 1 char, it might be octal
    for (const part of parts) {
      if (part.length > 1 && part.startsWith("0")) {
        const octal = parseInt(part, 8);
        if (!isNaN(octal) && octal <= 255) {
          const decoded = parts.map((p) => parseInt(p, 8).toString(10)).join(".");
          return isPrivateOrLoopbackHost(decoded);
        }
      }
    }
  }
  return false;
}

// v5.86 fix (D.5): DNS resolution + re-check since we're on Node.js runtime.
// This guards against DNS-rebinding attacks where a hostname resolves to a
// public IP initially but later resolves to a private IP.
import { lookup as dnsLookup } from "node:dns/promises";

async function assertSafeExternalUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Invalid custom endpoint URL");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`Custom endpoint must use http(s) protocol, got ${url.protocol}`);
  }
  // Block internal/private IPs and localhost (literal hostname check)
  if (isPrivateOrLoopbackHost(url.hostname)) {
    throw new Error(`Custom endpoint hostname "${url.hostname}" is blocked (SSRF protection)`);
  }
  // v5.86 fix (D.5): DNS-resolve the hostname and re-check the resolved IP.
  // This catches DNS-rebinding where a hostname like "evil.com" initially
  // resolves to a public IP but later resolves to 127.0.0.1 or 169.254.169.254.
  try {
    const addresses = await dnsLookup(url.hostname, { all: true });
    for (const addr of addresses) {
      if (isPrivateOrLoopbackHost(addr.address)) {
        throw new Error(`Custom endpoint hostname "${url.hostname}" resolves to blocked IP ${addr.address} (SSRF protection)`);
      }
    }
  } catch (err) {
    // If DNS lookup fails for a non-blocking reason, let the fetch handle it.
    // But if it's our own throw, re-throw.
    if (err instanceof Error && err.message.includes("blocked IP")) {
      throw err;
    }
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
    signal: AbortSignal.timeout(CHAT_FETCH_TIMEOUT_MS),
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
    signal: AbortSignal.timeout(CHAT_FETCH_TIMEOUT_MS),
    // v5.875 (HIGH-2): Prevent SSRF via redirect. Without this, a custom
    // endpoint could return 302 → http://169.254.169.254/ (cloud metadata)
    // and fetch would follow it, reading the response. With "manual",
    // 3xx responses are returned as-is and the !res.ok check below rejects them.
    redirect: "manual",
  });
  // v5.875 (HIGH-2): Reject any 3xx redirect response.
  if (res.status >= 300 && res.status < 400) {
    throw new Error(`Custom endpoint returned a redirect (${res.status}) — redirects are blocked for security (SSRF protection).`);
  }
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
    signal: AbortSignal.timeout(CHAT_FETCH_TIMEOUT_MS),
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
        { "HTTP-Referer": "https://launchpad--dev.vercel.app", "X-Title": "Launchpad" },
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
      await assertSafeExternalUrl(customEndpoint);
      return callOpenAICompatible(customEndpoint, apiKey, model, messages, temperature, {}, systemPrompt);
    }
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// ============================================================
// v5.875 (HIGH-9): Server-side rate limiting for /api/chat.
// Prevents abuse/cost-runaway on AI provider API keys. Uses the same
// in-memory pattern as the certificate endpoints (per-instance on Vercel;
// for production, upgrade to Vercel KV/Upstash Redis for distributed limits).
// Limit: 30 requests per 2 minutes per IP (streaming + non-streaming combined).
// Test Connection calls are limited separately: 10 per hour per IP.
// ============================================================
const CHAT_RATE_LIMIT_WINDOW_MS = 2 * 60 * 1000; // 2 minutes
const CHAT_RATE_LIMIT_MAX = 30;
const TEST_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const TEST_RATE_LIMIT_MAX = 10;
const chatRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const testRateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkChatRateLimit(ip: string, isTest: boolean): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const map = isTest ? testRateLimitMap : chatRateLimitMap;
  const windowMs = isTest ? TEST_RATE_LIMIT_WINDOW_MS : CHAT_RATE_LIMIT_WINDOW_MS;
  const maxReqs = isTest ? TEST_RATE_LIMIT_MAX : CHAT_RATE_LIMIT_MAX;

  // Clean up expired entries
  for (const [key, val] of map) {
    if (now >= val.resetAt) map.delete(key);
  }

  const entry = map.get(ip);
  if (!entry || now >= entry.resetAt) {
    map.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (entry.count >= maxReqs) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { allowed: true, retryAfterSec: 0 };
}

function getChatClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

// ============================================================
// POST handler — supports both real chat and POST-based Test Connection
// (test=1 in the JSON body sends "Hi" instead of the messages array,
//  so the API key is never leaked in URL query strings)
// ============================================================
export async function POST(req: NextRequest) {
  try {
    // v5.875 (HIGH-9): Rate limit check. Test Connection has a stricter
    // limit (10/hour) to prevent API-key enumeration against upstream providers.
    const clientIp = getChatClientIp(req);
    const body = await req.json();
    const isTest = !!body.test;
    const rl = checkChatRateLimit(clientIp, isTest);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${rl.retryAfterSec}s.` },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
      );
    }
    const {
      messages,
      provider,
      apiKey,
      model,
      temperature,
      customEndpoint,
      systemPrompt,
      test,
      stream,
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
      /** v5.78: when truthy, stream the response as SSE (token-by-token). */
      stream?: boolean;
    } = body;

    // BYOK: every user must provide their own API key — no free default
    // v5.85 fix (5.3): cap apiKey length to prevent abuse
    if (!apiKey || !apiKey.trim() || apiKey.length > 200) {
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

    // v5.77 fix: validate message content shape. Previously a client could send
    // `{ role: "user", content: null }` or `{ role: "user", content: 123 }` which
    // passed the role filter but caused cryptic upstream errors.
    const sanitized = messages
      .filter((m: { role?: string; content?: unknown }) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0 &&
        m.content.length < 100_000, // cap per-message length at 100KB
      )
      .map((m: { role: string; content: string }) => ({ role: m.role as "user" | "assistant", content: m.content }))
      .slice(-20);

    if (sanitized.length === 0) {
      return NextResponse.json({ error: "No valid messages after filtering" }, { status: 400 });
    }

    // v5.78/v5.79: SSE streaming path. Streams token-by-token for ALL 6 providers.
    // v5.78 added: OpenAI-compatible (groq, openrouter, openai, custom).
    // v5.79 added: Gemini (streamGenerateContent + alt=sse) and Anthropic (messages + stream:true).
    if (stream) {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      // Build the upstream request based on provider.
      let upstreamUrl: string;
      let upstreamHeaders: Record<string, string>;
      let upstreamBody: string;
      // Parser type: "openai" | "gemini" | "anthropic"
      let sseFormat: "openai" | "gemini" | "anthropic";

      if (provider === "groq" || provider === "openrouter" || provider === "openai" || provider === "custom") {
        sseFormat = "openai";
        if (provider === "groq") {
          upstreamUrl = "https://api.groq.com/openai/v1/chat/completions";
          upstreamHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` };
        } else if (provider === "openrouter") {
          upstreamUrl = "https://openrouter.ai/api/v1/chat/completions";
          upstreamHeaders = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://launchpad--dev.vercel.app",
            "X-Title": "Launchpad",
          };
        } else if (provider === "openai") {
          upstreamUrl = "https://api.openai.com/v1/chat/completions";
          upstreamHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` };
        } else {
          if (!customEndpoint) throw new Error("Custom endpoint URL is required");
          await assertSafeExternalUrl(customEndpoint);
          upstreamUrl = customEndpoint;
          upstreamHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` };
        }
        const fullMessages = [
          { role: "system", content: systemPrompt ?? SYSTEM_PROMPT },
          ...sanitized,
        ];
        upstreamBody = JSON.stringify({
          model,
          messages: fullMessages,
          temperature: temperature ?? 0.7,
          max_tokens: 2048,
          stream: true,
        });
      } else if (provider === "gemini") {
        // v5.79: Gemini streaming via streamGenerateContent?alt=sse
        sseFormat = "gemini";
        upstreamUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
        upstreamHeaders = { "Content-Type": "application/json" };
        const contents = sanitized.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));
        upstreamBody = JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemPrompt ?? SYSTEM_PROMPT }] },
          generationConfig: { temperature: temperature ?? 0.7, maxOutputTokens: 2048 },
        });
      } else if (provider === "anthropic") {
        // v5.79: Anthropic streaming via messages endpoint with stream:true
        sseFormat = "anthropic";
        upstreamUrl = "https://api.anthropic.com/v1/messages";
        upstreamHeaders = {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        };
        upstreamBody = JSON.stringify({
          model,
          max_tokens: 2048,
          system: systemPrompt ?? SYSTEM_PROMPT,
          temperature: temperature ?? 0.7,
          stream: true,
          messages: sanitized.map((m) => ({ role: m.role, content: m.content })),
        });
      } else {
        // Unknown provider — fall through to non-streaming.
        sseFormat = "openai"; // unreachable but satisfies TS
        upstreamUrl = "";
        upstreamHeaders = {};
        upstreamBody = "{}";
      }

      if (sseFormat && upstreamUrl) {
        // v5.866 BUG 2A FIX: replaced AbortSignal.any() (which may not exist
        // in all Node.js versions on Vercel) with a simple timeout signal.
        // AbortSignal.any() was added in Node v20.3.0 — if the Vercel
        // deployment uses an older v20.x, it would throw TypeError
        // "AbortSignal.any is not a function", which was caught by the
        // outer try/catch and returned a 502 — but the client had already
        // created an empty assistant message, producing the "static bubble
        // with no content" symptom.
        const upstreamRes = await fetch(upstreamUrl, {
          method: "POST",
          headers: upstreamHeaders,
          body: upstreamBody,
          signal: AbortSignal.timeout(CHAT_FETCH_TIMEOUT_MS),
          // v5.875 (HIGH-2): Prevent SSRF via redirect on custom endpoints.
          redirect: "manual",
        });

        // v5.875 (HIGH-2): Reject any 3xx redirect response (SSRF protection).
        if (upstreamRes.status >= 300 && upstreamRes.status < 400) {
          throw new Error(`Upstream returned a redirect (${upstreamRes.status}) — redirects are blocked for security (SSRF protection).`);
        }

        if (!upstreamRes.ok || !upstreamRes.body) {
          const txt = await upstreamRes.text().catch(() => "");
          console.error("[chat] upstream error:", { provider, status: upstreamRes.status, body: txt.slice(0, 200) });
          throw new Error(`${provider} HTTP ${upstreamRes.status}: ${txt.slice(0, 200)}`);
        }

        console.log("[chat] streaming started:", { provider, sseFormat, model });

        const transformedStream = new ReadableStream({
          async start(controller) {
            const reader = upstreamRes.body!.getReader();
            let buffer = "";
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });

                // v5.86 fix (B.1): SSE messages are delimited by \n\n (double newline),
                // NOT single \n. Splitting on \n caused partial/mangled parsing that
                // broke streaming for ALL providers.
                const messages = buffer.split("\n\n");
                buffer = messages.pop() ?? ""; // keep incomplete message

                for (const message of messages) {
                  // An SSE message can have multiple lines (event:, data:, id:, etc.)
                  // We only care about data: lines.
                  const lines = message.split("\n");
                  for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || !trimmed.startsWith("data: ")) continue;
                    const data = trimmed.slice(6);

                    // OpenAI-compatible: data: [DONE] marks the end.
                    if (sseFormat === "openai" && data === "[DONE]") {
                      controller.close();
                      return;
                    }

                    // Skip non-JSON data lines (some providers send comments)
                    if (data === "[DONE]" || data === "") continue;

                    try {
                      const parsed = JSON.parse(data);
                      let delta: string | undefined;

                      if (sseFormat === "openai") {
                        // {choices: [{delta: {content: "..."}}]}
                        delta = parsed?.choices?.[0]?.delta?.content;
                      } else if (sseFormat === "gemini") {
                        // Gemini SSE format:
                        // {candidates: [{content: {parts: [{text: "..."}]}}]}
                        delta = parsed?.candidates?.[0]?.content?.parts
                          ?.map((p: { text?: string }) => p.text)
                          .join("");
                      } else if (sseFormat === "anthropic") {
                        // Anthropic SSE format:
                        // data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"..."}}
                        if (parsed?.type === "content_block_delta" && parsed?.delta?.text) {
                          delta = parsed.delta.text;
                        }
                        // message_stop event marks the end.
                        if (parsed?.type === "message_stop") {
                          controller.close();
                          return;
                        }
                      }

                      if (delta) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`));
                      }
                    } catch {
                      // Skip malformed JSON chunks (keepalive comments, partial data).
                    }
                  }
                }
              }
              controller.close();
            } catch (err) {
              // v5.865 fix (B.12): sanitize the error before sending to the client.
              // The raw error may contain upstream HTTP response bodies with API
              // key fragments or internal URLs.
              // v5.90 (PART 6): PRIVACY FIX — also sanitize the server-side log.
              // The raw error may include the Gemini URL (which contains ?key=...).
              // Strip ?key=... before logging to prevent API key leaking to Vercel logs.
              const streamErr = err instanceof Error ? err : new Error(String(err));
              const sanitizedStreamMsg = streamErr.message.replace(/\?key=[^&\s"]+/g, "?key=[REDACTED]");
              console.error("[chat] streaming error:", streamErr.name, sanitizedStreamMsg);
              try {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "The AI provider returned an error during streaming. Please check your API key and try again." })}\n\n`));
              } catch {
                // controller already closed
              }
              controller.close();
            }
          },
        });

        return new Response(transformedStream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      }
    }

    // Non-streaming path (default, or Gemini/Anthropic which don't support
    // the OpenAI-compatible SSE format above).
    const content = await fetchProviderChat(
      provider,
      apiKey,
      model,
      sanitized,
      temperature ?? 0.7,
      customEndpoint,
      systemPrompt,
    );

    return NextResponse.json({ content, provider });
  } catch (err) {
    // v5.77 fix: don't leak the raw error message to the client (it may
    // contain API key fragments from upstream error echoes).
    // v5.90 (PART 6): PRIVACY FIX — don't log the raw error object either.
    // Node's fetch errors on network failures (DNS, timeout, connection refused)
    // include the URL in the error message — and for Gemini, the URL contains
    // `?key=${apiKey}`. Logging the raw error would write the user's API key
    // to Vercel server logs. Now we sanitize: strip any `?key=...` from the
    // error message before logging, and log only the error name + sanitized message.
    const errObj = err instanceof Error ? err : new Error(String(err));
    const rawMsg = errObj.message;
    // v5.90: strip ?key=... from the message (Gemini URL key leak)
    const sanitizedMsg = rawMsg.replace(/\?key=[^&\s"]+/g, "?key=[REDACTED]");
    console.error("[chat] error:", errObj.name, sanitizedMsg);
    const msg = sanitizedMsg;
    // Detect abort/timeout errors and return a clearer message.
    if (errObj.name === "TimeoutError" || errObj.name === "AbortError" || msg.includes("aborted") || msg.includes("timeout")) {
      return NextResponse.json(
        { error: "Request timed out. The AI provider may be slow or unresponsive." },
        { status: 504 },
      );
    }
    return NextResponse.json(
      { error: "The AI provider returned an error. Please check your API key and try again." },
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
