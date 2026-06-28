import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

const SYSTEM_PROMPT = `You are Launchpad AI Tutor — a friendly but professional coding mentor inside the Launchpad coding education platform.

Your job is to help learners of all levels with programming questions. You should:
- Be encouraging but precise
- Use code blocks (with language tags) for ALL code examples
- Explain concepts step by step when the learner is a beginner
- Be more concise and technical with advanced learners
- Redirect non-coding questions politely: "I focus on coding — for that, try [appropriate resource]"
- Suggest the user try things in the Launchpad Playground when relevant
- Mention relevant lessons from the Learn tab when applicable

Format rules:
- Use **bold** for emphasis
- Use *italic* sparingly
- Use \`inline code\` for symbols, function names, and short code
- Use \`\`\`language\n...\`\`\` blocks for multi-line code
- Keep explanations focused — no fluff
- If you don't know something, say so honestly

You are part of Launchpad — a privacy-first, on-device coding education platform. User data stays in their browser.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, apiKey, provider, model, temperature } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }

    // If user provided their own API key and provider, route accordingly
    if (apiKey && provider && provider !== "zai") {
      try {
        const response = await fetchProviderChat({
          provider,
          apiKey,
          model: model || "gpt-4o-mini",
          temperature: temperature ?? 0.7,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        });
        return NextResponse.json({ content: response, provider });
      } catch (err) {
        return NextResponse.json(
          { error: `Provider error: ${(err as Error).message}` },
          { status: 500 },
        );
      }
    }

    // Default: use Z.ai SDK (built-in)
    try {
      const zai = await ZAI.create();
      const formattedMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      ];

      const completion = await zai.chat.completions.create({
        messages: formattedMessages,
        temperature: temperature ?? 0.7,
        model: model || "glm-4.6",
        max_tokens: 2048,
      });

      const content = completion.choices?.[0]?.message?.content ?? "";
      return NextResponse.json({ content, provider: "zai" });
    } catch (err) {
      console.error("ZAI chat error:", err);
      return NextResponse.json(
        { error: `AI service error: ${(err as Error).message}` },
        { status: 500 },
      );
    }
  } catch (err) {
    return NextResponse.json(
      { error: `Invalid request: ${(err as Error).message}` },
      { status: 400 },
    );
  }
}

async function fetchProviderChat(opts: {
  provider: string;
  apiKey: string;
  model: string;
  temperature: number;
  messages: { role: string; content: string }[];
}): Promise<string> {
  const { provider, apiKey, model, temperature, messages } = opts;

  let url = "";
  let headers: Record<string, string> = {};
  let body: unknown = {};

  if (provider === "openai") {
    url = "https://api.openai.com/v1/chat/completions";
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
    body = { model, messages, temperature, max_tokens: 2048 };
  } else if (provider === "groq") {
    url = "https://api.groq.com/openai/v1/chat/completions";
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
    body = { model, messages, temperature, max_tokens: 2048 };
  } else if (provider === "custom") {
    const [endpoint, key] = apiKey.split("|");
    url = endpoint;
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    };
    body = { model, messages, temperature, max_tokens: 2048 };
  } else {
    throw new Error(`Unknown provider: ${provider}`);
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}
