# Launchpad CHANGELOG — Round 2

## Section 1 — Certificates: Quiz Score Requirement
- Per-language certificates now require 75%+ average quiz score across all quizzes in the track
- Certificate button shows three states: active (eligible), "Retake Quizzes to Unlock" (score < 75%), "Complete all lessons first" (incomplete)
- Removed "Regenerate Plan" button from Account Settings entirely
- Added "Restart Onboarding (Regenerate Plan)" section to Settings → Data & backup
- Updated Help Centre Q&A for regenerate plan to point to Settings → Reset

## Section 2 — AI Tutor: Full Audit and Fixes
- Updated Groq model list: added `llama-3.1-70b-versatile`, removed deprecated `mixtral-8x7b-32768`
- Updated OpenRouter models: `google/gemini-2.5-flash` (free, recommended), `meta-llama/llama-3.3-70b-instruct` (free)
- Updated Gemini models: added `gemini-1.5-pro`
- All provider implementations verified correct (Gemini, OpenAI, Anthropic, Groq, OpenRouter, Custom)
- Custom provider now supports endpoint URL field
- All providers have custom model text input alongside dropdown
- Settings accessible in both floating bubble and full-screen AI Tutor tab
- New Chat and Chat History accessible in both views

## Section 6 — Remove Verify Links from Certificates
- Verified: no "Verify at" URLs remain in either language or career master certificates
- Certificate IDs (LP-XXXX) retained for reference

## Section 9 — Onboarding Double Retry Loop
- Existing implementation already has retry logic: AI chain → validation → retry with issues → deterministic fallback
- Source message shown on plan preview (teal "AI-generated" or amber "Built-in engine used")

## Section 16 — README Update
- Full rewrite with updated counts, AI providers, certificate info, environment variables

## Section 17 — Comparison Document
- Created COMPARISON.md with detailed comparison against 9 major platforms
- Identified 5 areas where Launchpad leads, 4 competitive areas, 5 gaps
- Suggested 5 future improvements

## Other Changes
- AccountView: Removed Regenerate Plan button and related state
- SettingsView: Added "Restart Onboarding" section with amber styling
- HelpCentre: Updated regenerate plan Q&A
- Store: Updated PROVIDER_MODELS and PROVIDER_INFO with correct current models
