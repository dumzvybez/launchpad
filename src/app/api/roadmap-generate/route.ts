import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import type { PersonalizationInput } from "@/lib/types";
import { CAREER_MAP, LANGUAGE_MAP, OCCUPATION_MAP } from "@/lib/career-data";

const SYSTEM_PROMPT = `You are Launchpad's roadmap architect. You design personalized coding learning roadmaps.

Your job: given a learner's profile, output a JSON learning roadmap with the RIGHT number of phases (4-8) — NOT always 6.

CRITICAL: Keep the response CONCISE to fit in 6000 tokens. Use:
- 4-8 phases total
- 2-3 modules per phase (NOT 4+)
- 2-3 tasks per module (NOT 4+)
- Short strings (1 sentence max for brief/why)
- 2-3 steps per task (NOT 5+)

Output format — STRICT JSON, no markdown, no commentary:
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
              "why": string (short),
              "brief": string (short),
              "steps": string[] (2-3),
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
}

Rules:
- Choose phases naturally (4-8). Do NOT force exactly 6.
- Phase 1 = foundations. Last phase = capstone + career.
- Reference Launchpad lesson IDs (py-01 to py-15, js-01 to js-15, typescript-01 to typescript-10, etc.) where the topic matches.
- Be SPECIFIC but CONCISE. No filler text.
- Output ONLY the JSON object.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input, issues, previousRoadmap }: {
      input: PersonalizationInput;
      issues?: string[];
      previousRoadmap?: unknown;
    } = body;

    if (!input || !input.careerId) {
      return NextResponse.json({ error: "input with careerId is required" }, { status: 400 });
    }

    // Build a rich context string for the AI
    const career = CAREER_MAP[input.careerId];
    const occupation = OCCUPATION_MAP[input.occupationId];
    const languages = input.selectedLanguageIds
      .map((id: string) => LANGUAGE_MAP[id])
      .filter(Boolean);

    const userContext = {
      career: career ? {
        id: career.id,
        label: career.label,
        description: career.description,
        recommendedLanguages: career.recommendedLanguages,
        skills: career.skills,
      } : null,
      subPath: input.subPath,
      occupation: occupation ? {
        label: occupation.label,
        pace: occupation.pace,
        description: occupation.description,
      } : null,
      skillLevel: input.skillLevel,
      selectedLanguages: languages.map((l: { id: string; name: string; difficulty: number; tagline: string }) => ({
        id: l.id,
        name: l.name,
        difficulty: l.difficulty,
        tagline: l.tagline,
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
      // Retry — send the issues back to the AI for correction
      prompt = `Previous roadmap had these validation issues:\n${JSON.stringify(issues, null, 2)}\n\nPrevious roadmap JSON:\n${JSON.stringify(previousRoadmap, null, 2)}\n\nPlease return a CORRECTED JSON roadmap that fixes ALL the listed issues. Same format. Output ONLY the JSON.`;
    } else {
      prompt = `Design a personalized coding learning roadmap for this learner. Choose the right number of phases (4-10) based on the profile complexity. Output ONLY the JSON roadmap.\n\nLearner profile:\n${JSON.stringify(userContext, null, 2)}`;
    }

    try {
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        model: "glm-4.6",
        max_tokens: 6000,
      });

      const content = completion.choices?.[0]?.message?.content ?? "";

      // Extract JSON from the response (handle markdown fences if present)
      let jsonStr = content.trim();
      // Strip ```json ... ``` if present
      const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fenceMatch) {
        jsonStr = fenceMatch[1].trim();
      }
      // Find the first { and last } to extract just the JSON object
      const start = jsonStr.indexOf("{");
      const end = jsonStr.lastIndexOf("}");
      if (start !== -1 && end !== -1) {
        jsonStr = jsonStr.slice(start, end + 1);
      }

      let roadmap;
      try {
        roadmap = JSON.parse(jsonStr);
      } catch (parseErr) {
        // Try to recover truncated JSON by closing open braces/brackets
        const openBraces = (jsonStr.match(/{/g) || []).length;
        const closeBraces = (jsonStr.match(/}/g) || []).length;
        const openBrackets = (jsonStr.match(/\[/g) || []).length;
        const closeBrackets = (jsonStr.match(/\]/g) || []).length;
        let recovered = jsonStr;
        // Remove trailing incomplete string/property (e.g. "title": "some th)
        recovered = recovered.replace(/,\s*"[^"]*":\s*"[^"]*$/, "");
        recovered = recovered.replace(/,\s*"[^"]*":\s*$/, "");
        recovered = recovered.replace(/,\s*$/, "");
        // Close open structures
        for (let i = 0; i < openBrackets - closeBrackets; i++) recovered += "]";
        for (let i = 0; i < openBraces - closeBraces; i++) recovered += "}";
        try {
          roadmap = JSON.parse(recovered);
          console.log("[roadmap-generate] recovered truncated JSON");
        } catch (e2) {
          return NextResponse.json(
            { error: `AI returned invalid JSON: ${(parseErr as Error).message}`, raw: content.slice(0, 500) },
            { status: 502 },
          );
        }
      }

      return NextResponse.json({ roadmap });
    } catch (aiErr) {
      console.error("AI roadmap generation error:", aiErr);
      return NextResponse.json(
        { error: `AI service error: ${(aiErr as Error).message}` },
        { status: 502 },
      );
    }
  } catch (err) {
    return NextResponse.json(
      { error: `Invalid request: ${(err as Error).message}` },
      { status: 400 },
    );
  }
}
