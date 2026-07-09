"use client";

import { useState, useEffect, useCallback } from "react";
import type { AIProviderKey } from "@/lib/types";

// v5.90 (PART 4): Client-side hook for fetching model lists from each provider.
// Caches for 1 hour per provider (in localStorage so it persists across sessions).
// Falls back to the static PROVIDER_MODELS list from store.ts if the live fetch fails.

const CACHE_KEY_PREFIX = "launchpad:model-cache:";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

type CachedModels = {
  models: string[];
  source: "live" | "cache" | "fallback";
  fetchedAt: number;
};

function getCachedModels(provider: string): CachedModels | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${CACHE_KEY_PREFIX}${provider}`);
    if (!raw) return null;
    const parsed: CachedModels = JSON.parse(raw);
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) {
      window.localStorage.removeItem(`${CACHE_KEY_PREFIX}${provider}`);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function setCachedModels(provider: string, models: string[], source: "live" | "fallback"): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CachedModels = { models, source, fetchedAt: Date.now() };
    window.localStorage.setItem(`${CACHE_KEY_PREFIX}${provider}`, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — non-critical
  }
}

/**
 * v5.90 (PART 4): Fetch the model list for a given provider.
 * Returns { models, source, loading, error, refetch }.
 * - source "live": freshly fetched from the provider's API
 * - source "cache": served from 1-hour localStorage cache
 * - source "fallback": live fetch failed, using the static fallback list
 */
export function useProviderModels(
  provider: AIProviderKey | string,
  apiKey: string,
  customEndpoint?: string,
): {
  models: string[];
  source: "live" | "cache" | "fallback" | "static";
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [models, setModels] = useState<string[]>([]);
  const [source, setSource] = useState<"live" | "cache" | "fallback" | "static">("static");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => setRefetchTrigger((n) => n + 1), []);

  useEffect(() => {
    if (!provider || !apiKey || apiKey.trim().length === 0) {
      setModels([]);
      setSource("static");
      setError(null);
      return;
    }

    // Custom endpoint — no model list (user types model name directly)
    if (provider === "custom") {
      setModels([]);
      setSource("static");
      setError(null);
      return;
    }

    // Check localStorage cache first
    const cached = getCachedModels(provider);
    if (cached && refetchTrigger === 0) {
      setModels(cached.models);
      setSource("cache");
      setError(null);
      return;
    }

    // Live fetch
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch("/api/models", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider, apiKey, customEndpoint }),
        });
        const data = await res.json();
        if (cancelled) return;

        if (data.models && Array.isArray(data.models) && data.models.length > 0) {
          setModels(data.models);
          setSource(data.source === "fallback" ? "fallback" : "live");
          // Cache in localStorage (only if live or fallback, not if from server cache)
          if (data.source !== "cache") {
            setCachedModels(provider, data.models, data.source === "fallback" ? "fallback" : "live");
          }
          setError(data.error || null);
        } else {
          setModels([]);
          setSource("fallback");
          setError(data.error || "No models returned");
        }
      } catch (err) {
        if (cancelled) return;
        setModels([]);
        setSource("fallback");
        setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, apiKey, customEndpoint, refetchTrigger]);

  return { models, source, loading, error, refetch };
}
