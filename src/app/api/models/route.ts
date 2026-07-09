import { NextRequest, NextResponse } from "next/server";
import type { AIProviderKey } from "@/lib/types";

// v5.90 (PART 4): Live model list fetching for all 6 providers.
// Fetches the current model list from each provider's API using the user's key.
// Caches for 1 hour per provider (in-memory, per serverless instance).
// Falls back to a maintained static list if the live fetch fails.

export const runtime = "nodejs";
export const maxDuration = 30;

// ============================================================
// v5.90 (PART 4): Fallback model lists — used when live fetch fails.
// These are MAINTAINED STATIC LISTS that require manual updates.
// ============================================================
export const FALLBACK_MODELS: Record<AIProviderKey, string[]> = {
  groq: ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b"],
  gemini: ["gemini-2.5-flash-lite", "gemini-3-flash", "gemini-3.5-flash"],
  openrouter: [
    "meta-llama/llama-3.3-70b-instruct:free",
    "openai/gpt-oss-120b:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "google/gemma-4-31b-it:free",
    "openrouter/free",
  ],
  openai: ["gpt-4o-mini"],
  anthropic: ["claude-sonnet-4-5"],
  custom: [],
};

// ============================================================
// In-memory cache: { provider -> { models, fetchedAt } }
// TTL: 1 hour. Per serverless instance (same limitation as other
// in-memory caches on Vercel — acceptable for model lists which
// change infrequently).
// ============================================================
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const modelCache = new Map<string, { models: string[]; fetchedAt: number }>();

function getCachedModels(provider: string): string[] | null {
  const entry = modelCache.get(provider);
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) {
    modelCache.delete(provider);
    return null;
  }
  return entry.models;
}

function setCachedModels(provider: string, models: string[]): void {
  modelCache.set(provider, { models, fetchedAt: Date.now() });
}

// ============================================================
// Live fetch functions for each provider
// ============================================================

async function fetchGroqModels(apiKey: string): Promise<string[]> {
  const res = await fetch("https://api.groq.com/openai/v1/models", {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Groq models HTTP ${res.status}`);
  const data = await res.json();
  const models: string[] = (data?.data ?? []).map((m: { id: string }) => m.id).filter(Boolean);
  if (models.length === 0) throw new Error("Groq returned empty model list");
  return models.sort();
}

async function fetchGeminiModels(apiKey: string): Promise<string[]> {
  // v5.90 (PART 4): Google's current model-listing endpoint.
  // Per Google's official docs: GET https://generativelanguage.googleapis.com/v1beta/models
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`Gemini models HTTP ${res.status}`);
  const data = await res.json();
  // Gemini returns { models: [{ name: "models/gemini-2.5-flash", supportedGenerationMethods: [...] }] }
  const models: string[] = (data?.models ?? [])
    .filter((m: { supportedGenerationMethods?: string[] }) =>
      m.supportedGenerationMethods?.includes("generateContent"))
    .map((m: { name: string }) => m.name.replace(/^models\//, ""))
    .filter(Boolean);
  if (models.length === 0) throw new Error("Gemini returned empty model list");
  return models.sort();
}

async function fetchOpenRouterModels(apiKey: string): Promise<string[]> {
  const res = await fetch("https://openrouter.ai/api/v1/models", {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`OpenRouter models HTTP ${res.status}`);
  const data = await res.json();
  // v5.90 (PART 4): filter for FREE models (pricing.prompt == "0" && pricing.completion == "0")
  // since OpenRouter's free roster rotates and models can be removed without notice.
  const models: string[] = (data?.data ?? [])
    .filter((m: { pricing?: { prompt?: string; completion?: string } }) =>
      m.pricing?.prompt === "0" && m.pricing?.completion === "0")
    .map((m: { id: string }) => m.id)
    .filter(Boolean);
  if (models.length === 0) {
    // If no free models found, return ALL models (user may have a paid key)
    const allModels: string[] = (data?.data ?? []).map((m: { id: string }) => m.id).filter(Boolean);
    if (allModels.length === 0) throw new Error("OpenRouter returned empty model list");
    return allModels.sort();
  }
  return models.sort();
}

async function fetchOpenAIModels(apiKey: string): Promise<string[]> {
  const res = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`OpenAI models HTTP ${res.status}`);
  const data = await res.json();
  const models: string[] = (data?.data ?? [])
    .map((m: { id: string }) => m.id)
    .filter((id: string) => !id.startsWith("dall-e") && !id.startsWith("whisper") && !id.startsWith("tts") && !id.startsWith("embed"))
    .filter(Boolean);
  if (models.length === 0) throw new Error("OpenAI returned empty model list");
  return models.sort();
}

async function fetchAnthropicModels(_apiKey: string): Promise<string[]> {
  // v5.90 (PART 4): Anthropic does NOT currently expose a public models-listing endpoint.
  // Use the maintained static fallback list.
  // Models: claude-opus-4-1, claude-sonnet-4-5, claude-haiku-4-5
  // Clearly mark this as a maintained static list requiring manual updates.
  return FALLBACK_MODELS.anthropic;
}

// ============================================================
// POST handler — fetch models for a given provider
// ============================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, apiKey, customEndpoint }: {
      provider: AIProviderKey;
      apiKey: string;
      customEndpoint?: string;
    } = body;

    if (!provider) {
      return NextResponse.json({ error: "provider is required" }, { status: 400 });
    }
    if (!apiKey || apiKey.trim().length === 0) {
      return NextResponse.json({ error: "apiKey is required" }, { status: 401 });
    }
    if (apiKey.length > 200) {
      return NextResponse.json({ error: "apiKey too long" }, { status: 400 });
    }

    // v5.90 (PART 4): Custom endpoint — not applicable for live-fetching.
    // The user provides their own model name directly as free text.
    if (provider === "custom") {
      return NextResponse.json({ models: [], source: "custom" });
    }

    // Check cache first
    const cached = getCachedModels(provider);
    if (cached) {
      return NextResponse.json({ models: cached, source: "cache" });
    }

    // Live fetch
    try {
      let models: string[];
      switch (provider) {
        case "groq": models = await fetchGroqModels(apiKey); break;
        case "gemini": models = await fetchGeminiModels(apiKey); break;
        case "openrouter": models = await fetchOpenRouterModels(apiKey); break;
        case "openai": models = await fetchOpenAIModels(apiKey); break;
        case "anthropic": models = await fetchAnthropicModels(apiKey); break;
        default: models = FALLBACK_MODELS[provider] ?? [];
      }
      setCachedModels(provider, models);
      return NextResponse.json({ models, source: "live" });
    } catch (fetchErr) {
      // v5.90 (PART 4): On live fetch failure, use the fallback list.
      // v5.90 (PART 6): PRIVACY FIX — sanitize the error message before logging
      // and returning. Gemini's models endpoint uses ?key=${apiKey} in the URL,
      // and fetch errors may include the URL. Strip ?key=... to prevent leaking.
      const rawFetchMsg = (fetchErr as Error).message || String(fetchErr);
      const sanitizedFetchMsg = rawFetchMsg.replace(/\?key=[^&\s"]+/g, "?key=[REDACTED]");
      console.warn(`[models] live fetch failed for ${provider}, using fallback:`, sanitizedFetchMsg);
      const fallback = FALLBACK_MODELS[provider] ?? [];
      // Cache the fallback too (with shorter TTL — 10 min — so we retry sooner)
      modelCache.set(provider, { models: fallback, fetchedAt: Date.now() - CACHE_TTL_MS + 10 * 60 * 1000 });
      return NextResponse.json({
        models: fallback,
        source: "fallback",
        error: `Live fetch failed: ${sanitizedFetchMsg}`,
      });
    }
  } catch (err) {
    return NextResponse.json({ error: `Invalid request: ${(err as Error).message}` }, { status: 400 });
  }
}
