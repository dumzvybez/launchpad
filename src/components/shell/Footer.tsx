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

      {/* Privacy Policy modal — redesigned with clear sectioned layout */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-teal-400 via-fuchsia-400 to-amber-300 flex items-center justify-center text-white text-xs">🔒</span>
              Launchpad Privacy Policy
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[65vh] pr-4">
            <div className="space-y-5 text-sm">
              {/* Last updated + principle */}
              <div className="rounded-lg bg-gradient-to-br from-teal-500/10 to-violet-500/10 border border-teal-500/20 p-3">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Last updated</div>
                <div className="text-xs font-medium">June 2026</div>
                <p className="text-xs text-foreground mt-2 leading-relaxed">
                  <strong>Our principle:</strong> Your data is yours. We collect nothing, store nothing on our servers, and sell nothing.
                </p>
              </div>

              {/* Section: What stays on your device */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  What stays on your device
                </h3>
                <ul className="space-y-1 text-xs text-muted-foreground ml-1">
                  <li>• Your profile (name, career, languages, skill level, availability)</li>
                  <li>• Your roadmap and task progress</li>
                  <li>• Your lesson progress and quiz scores</li>
                  <li>• Your badges and achievements</li>
                  <li>• Your AI chat history</li>
                  <li>• Your settings and preferences</li>
                  <li>• Your daily challenge streaks</li>
                </ul>
                <p className="text-[11px] text-muted-foreground mt-2 italic">
                  All of this lives in your browser&apos;s localStorage. Clearing your browser erases it all. Use Settings → Backup to export a JSON copy.
                </p>
              </div>

              {/* Section: What gets sent to servers */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  What gets sent to servers
                </h3>
                <div className="space-y-2 ml-1">
                  <div className="text-xs text-muted-foreground">
                    <strong className="text-foreground">AI Chat & Mock Interviews & Code Review:</strong> When you send a message, it goes to the AI provider you&apos;ve configured (Gemini, OpenAI, Anthropic, Groq, or OpenRouter). The provider processes it and returns a response. We never see your messages.
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <strong className="text-foreground">AI Roadmap generation:</strong> During onboarding, your career, language, and availability inputs are sent to Google Gemini (or Groq/OpenRouter as fallback) to generate your personalized roadmap. After generation, nothing is sent again.
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <strong className="text-foreground">YouTube video supplements:</strong> When you expand a video in a lesson, your browser connects to youtube-nocookie.com (YouTube&apos;s privacy-enhanced mode). YouTube doesn&apos;t track you until you press play.
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Community tab:</strong> Uses GitHub Discussions via Giscus. Posting requires a GitHub account. Your Launchpad progress is never shared there.
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2 italic">
                  You provide your own API keys (BYOK). Launchpad does not bundle any AI keys. Your keys are stored on your device only.
                </p>
              </div>

              {/* Section: What we never do */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  What we never do
                </h3>
                <ul className="space-y-1 text-xs text-muted-foreground ml-1">
                  <li>✗ We don&apos;t have user accounts</li>
                  <li>✗ We don&apos;t sync across devices</li>
                  <li>✗ We don&apos;t sell or share data</li>
                  <li>✗ We don&apos;t use data for ads</li>
                  <li>✗ We don&apos;t track you with analytics</li>
                  <li>✗ We don&apos;t have access to your AI chat content</li>
                </ul>
              </div>

              {/* Section: Source code */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400 mb-2 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  Source code
                </h3>
                <p className="text-xs text-muted-foreground ml-1">
                  Launchpad is 100% open-source. Every line is auditable at:{" "}
                  <a
                    href="https://github.com/dumzvybez/launchpad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    github.com/dumzvybez/launchpad
                  </a>
                </p>
              </div>

              {/* Section: Contact */}
              <div className="pt-3 border-t border-border/40">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Questions?</h3>
                <p className="text-xs text-muted-foreground">
                  Reach out via the developer links in the footer or Settings → About Developer.
                </p>
              </div>
            </div>
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
