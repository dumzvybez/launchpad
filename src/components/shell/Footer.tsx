"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { HelpCentre } from "@/components/help/HelpCentre";

// ============================================================
// Privacy Policy content
// ============================================================
const PRIVACY_POLICY = `# Launchpad Privacy Policy
Last updated: June 2026

## Our principle
Launchpad is built on one core principle: your data is yours.
We collect nothing, store nothing on our servers, and sell nothing.

## What stays on your device
- Your profile (name, career, languages, skill level, availability)
- Your roadmap and task progress
- Your lesson progress and quiz scores
- Your badges and achievements
- Your AI chat history
- Your settings and preferences
- Your daily challenge streaks

All of this lives in your browser's localStorage. Clearing your browser erases it all.
Use Settings → Backup to export a JSON copy.

## What gets sent to servers
- AI Chat messages: When you send a message to the AI tutor, it goes to the AI
  provider you've configured (Gemini, OpenAI, Anthropic, Groq, or OpenRouter).
  The provider processes it and returns a response. We never see your messages.
- AI Roadmap generation: During onboarding, your career, language, and availability
  inputs are sent to Google Gemini (or Groq/OpenRouter as fallback) to generate
  your personalized roadmap. After generation, nothing is sent again.

You provide your own API keys. Launchpad does not bundle any AI keys.
Your keys are stored on your device only.

## What we never do
- We don't have user accounts.
- We don't sync across devices.
- We don't sell or share data.
- We don't use data for ads.
- We don't track you with analytics.
- We don't have access to your AI chat content.

## Source code
Launchpad is 100% open-source. Every line is auditable at:
https://github.com/dumzvybez/Launchpad

## Contact
Questions? Reach out via the developer links in the footer or Settings → About Developer.`;

// ============================================================
// Footer component with Privacy Policy modal + Help Centre modal
// ============================================================
export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="px-4 sm:px-6 py-3 mt-auto border-t border-border/40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-muted-foreground font-mono">
          {/* Founder info — desktop shows full, mobile shows copyright only */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-teal-400 via-fuchsia-400 to-amber-300 flex items-center justify-center text-[8px] font-bold text-white shrink-0">
              D
            </div>
            <span className="hidden sm:inline">
              Built by{" "}
              <a
                href="https://duminduwanasinghe-dev.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-medium hover:text-primary hover:underline transition-colors"
              >
                Dumindu Dulara Wanasinghe
              </a>{" "}
              · Launchpad © {year}
            </span>
            <span className="sm:hidden">Launchpad © {year}</span>
          </div>

          {/* Links */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => setHelpOpen(true)}
              className="hover:text-foreground transition-colors"
            >
              Help Centre
            </button>
            <span>·</span>
            <a
              href="https://github.com/dumzvybez/Launchpad"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub Repo
            </a>
            <span>·</span>
            <kbd className="px-1.5 py-0.5 rounded bg-foreground/8 border border-border/40">⌘K</kbd>
            <span>command palette</span>
          </div>

          {/* Mobile links — condensed */}
          <div className="sm:hidden flex items-center gap-3">
            <button onClick={() => setPrivacyOpen(true)} className="hover:text-foreground transition-colors">Privacy</button>
            <span>·</span>
            <button onClick={() => setHelpOpen(true)} className="hover:text-foreground transition-colors">Help</button>
            <span>·</span>
            <a href="https://github.com/dumzvybez/Launchpad" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </footer>

      {/* Privacy Policy modal */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Launchpad Privacy Policy</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <article className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
              {PRIVACY_POLICY.split("\n\n").map((block, i) => {
                if (block.startsWith("# ")) {
                  return <h1 key={i} className="text-lg font-bold mt-0">{block.replace(/^# /, "")}</h1>;
                }
                if (block.startsWith("## ")) {
                  return <h2 key={i} className="text-base font-semibold mt-4">{block.replace(/^## /, "")}</h2>;
                }
                const lines = block.split("\n").map((line, j) => {
                  if (line.startsWith("- ")) {
                    return <li key={j} className="ml-4 list-disc">{line.replace(/^- /, "")}</li>;
                  }
                  return <p key={j} className="text-sm">{line}</p>;
                });
                return <div key={i} className="space-y-1">{lines}</div>;
              })}
            </article>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Help Centre modal */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Help Centre</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[65vh] pr-4">
            <HelpCentre />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
