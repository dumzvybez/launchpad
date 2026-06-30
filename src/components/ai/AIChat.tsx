"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Plus,
  Trash2,
  MessageSquare,
  Settings,
  Maximize2,
  Minimize2,
  X,
  Bot,
  Loader2,
  AlertTriangle,
  Target,
  ChevronDown,
  Search,
} from "lucide-react";
import { useStore, PROVIDER_MODELS, PROVIDER_INFO } from "@/lib/store";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { ChatMessage, AIProviderKey } from "@/lib/types";
import {
  pickInterviewQuestions,
  buildInterviewSystemPrompt,
  type QuestionDifficulty,
} from "@/lib/interview-questions";
import { CAREER_MAP } from "@/lib/career-data";
import { ALL_LANGUAGE_INFO } from "@/lib/lessons-data";

interface AIChatProps {
  /** When true, render as a full-page tab (no floating chrome). */
  fullTab?: boolean;
  /** Optional callback to maximize (open as full tab). */
  onMaximize?: () => void;
  /** Optional callback to close the floating window. */
  onClose?: () => void;
}

export function AIChat({ fullTab = false, onMaximize, onClose }: AIChatProps) {
  const conversations = useStore((s) => s.state.chatConversations);
  const activeChatId = useStore((s) => s.state.activeChatId);
  const createChat = useStore((s) => s.createChatConversation);
  const deleteChat = useStore((s) => s.deleteChatConversation);
  const setActiveChat = useStore((s) => s.setActiveChat);
  const addMessage = useStore((s) => s.addChatMessage);
  const aiSettings = useStore((s) => s.state.aiSettings);
  const setAISettings = useStore((s) => s.setAISettings);
  const aiWarningAcknowledged = useStore((s) => s.state.aiWarningAcknowledged);
  const acknowledgeWarning = useStore((s) => s.acknowledgeAIWarning);
  const clearAllChats = useStore((s) => s.clearAllChats);
  const setView = useStore((s) => s.setView);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(fullTab);
  const [showWarning, setShowWarning] = useState(!aiWarningAcknowledged);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  // Interview Mode state (Section 4.2)
  const [interviewMode, setInterviewMode] = useState(false);
  const [interviewSystemPrompt, setInterviewSystemPrompt] = useState<string | null>(null);
  const [interviewDifficulty, setInterviewDifficulty] = useState<QuestionDifficulty>("intermediate");
  const [interviewQuestionCount, setInterviewQuestionCount] = useState(10);
  // Code Review Mode state (in-AI-Tutor Code Review)
  const [codeReviewMode, setCodeReviewMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Get or create active conversation
  const activeConversation = conversations.find((c) => c.id === activeChatId) ?? null;
  const hasUserKey = !!aiSettings.apiKey;
  const needsSetup = !hasUserKey;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeConversation?.messages]);

  // Ensure there's an active conversation
  useEffect(() => {
    if (!activeChatId && conversations.length === 0) {
      // Don't auto-create — wait for user to start typing or click new chat
    } else if (!activeChatId && conversations.length > 0) {
      setActiveChat(conversations[0].id);
    }
  }, [activeChatId, conversations, setActiveChat]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    // BYOK: require API key
    if (!hasUserKey) {
      setShowSettings(true);
      return;
    }

    // Create a conversation if none active
    let chatId = activeChatId;
    if (!chatId) {
      chatId = createChat();
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    addMessage(chatId, userMessage);
    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...(activeConversation?.messages ?? []), userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          apiKey: aiSettings.apiKey,
          provider: aiSettings.provider,
          model: aiSettings.model,
          temperature: aiSettings.temperature,
          customEndpoint: aiSettings.customEndpoint,
          // Pass the interview system prompt when in Interview Mode
          ...(interviewSystemPrompt ? { systemPrompt: interviewSystemPrompt } : {}),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: data.content || "(no response)",
        timestamp: new Date().toISOString(),
        provider: data.provider,
      };
      addMessage(chatId, assistantMessage);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: "assistant",
        content: `⚠️ Error: ${(err as Error).message}\n\nCheck your API key and provider settings.`,
        timestamp: new Date().toISOString(),
      };
      addMessage(chatId, errorMessage);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  // Test Connection — sends "Hi" to verify the API key works
  const handleTestConnection = async () => {
    if (!aiSettings.apiKey || !aiSettings.model) {
      setTestResult({ ok: false, msg: "Enter an API key and select a model first." });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const url = `/api/chat?test=1&provider=${encodeURIComponent(aiSettings.provider)}&apiKey=${encodeURIComponent(aiSettings.apiKey)}&model=${encodeURIComponent(aiSettings.model)}${aiSettings.customEndpoint ? `&customEndpoint=${encodeURIComponent(aiSettings.customEndpoint)}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.ok) {
        setTestResult({ ok: true, msg: "✅ Connected!" });
      } else {
        setTestResult({ ok: false, msg: `❌ Failed — ${data.error ?? "check your key"}` });
      }
    } catch (err) {
      setTestResult({ ok: false, msg: `❌ Failed — ${(err as Error).message}` });
    } finally {
      setTesting(false);
    }
  };

  const handleNewChat = () => {
    createChat();
    setInput("");
    // Reset interview mode when starting a new chat
    setInterviewMode(false);
    setInterviewSystemPrompt(null);
    inputRef.current?.focus();
  };

  // ============================================================
  // Interview Mode (Section 4.2)
  // ============================================================
  const profile = useStore((s) => s.state.profile);
  const roadmap = useStore((s) => s.state.roadmap);

  const handleStartInterview = () => {
    if (!hasUserKey) {
      setShowSettings(true);
      return;
    }
    const careerId = profile.careerId ?? "software-engineering";
    const careerLabel = CAREER_MAP[careerId]?.label ?? "Software Engineering";
    const languages = roadmap?.languageIds ?? [];
    if (languages.length === 0) {
      alert("Please complete onboarding first so we know which languages to interview you on.");
      return;
    }
    const skillLevel = profile.skillLevel ?? "intermediate";
    // Pick seed questions
    const seedQuestions = pickInterviewQuestions({
      career: careerId,
      languages,
      count: interviewQuestionCount,
      difficulty: interviewDifficulty,
    });
    // Build system prompt
    const sysPrompt = buildInterviewSystemPrompt({
      career: careerLabel,
      languages: languages.map((id) => ALL_LANGUAGE_INFO[id]?.name ?? id),
      skillLevel,
      count: interviewQuestionCount,
      seedQuestions,
    });
    // Create a fresh chat for the interview
    const chatId = createChat();
    // Set the interview system prompt — will be sent with every message
    setInterviewSystemPrompt(sysPrompt);
    setInterviewMode(false); // close setup screen
    // First user message triggers the AI to introduce itself + ask Q1
    const kickOffMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: `Hi! I'm ready to start my mock interview. Please introduce yourself and ask the first question. (Difficulty: ${interviewDifficulty}, ${interviewQuestionCount} questions total.)`,
      timestamp: new Date().toISOString(),
    };
    addMessage(chatId, kickOffMessage);
    setInput("");
    setSending(true);
    // Fire the first AI call
    (async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [kickOffMessage].map((m) => ({ role: m.role, content: m.content })),
            apiKey: aiSettings.apiKey,
            provider: aiSettings.provider,
            model: aiSettings.model,
            temperature: aiSettings.temperature,
            customEndpoint: aiSettings.customEndpoint,
            systemPrompt: sysPrompt,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          role: "assistant",
          content: data.content || "(no response)",
          timestamp: new Date().toISOString(),
          provider: data.provider,
        };
        addMessage(chatId, assistantMessage);
      } catch (err) {
        const errorMessage: ChatMessage = {
          id: `msg-${Date.now()}-err`,
          role: "assistant",
          content: `⚠️ Error: ${(err as Error).message}\n\nCheck your API key and provider settings.`,
          timestamp: new Date().toISOString(),
        };
        addMessage(chatId, errorMessage);
      } finally {
        setSending(false);
        inputRef.current?.focus();
      }
    })();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // First-time warning modal
  if (showWarning) {
    return (
      <div className={cn(fullTab ? "p-6" : "p-4")}>
        <div className="rounded-xl border-2 border-amber-500/60 bg-amber-500/10 p-5 max-w-md mx-auto">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
            <div>
              <h3 className="font-semibold text-sm">AI Tutor — Privacy notice</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Your messages are sent to AI servers for processing. Don&apos;t share sensitive personal information like passwords, addresses, or financial details. Conversations are stored on your device only.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              acknowledgeWarning();
              setShowWarning(false);
            }}
            className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            I understand — start chatting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full", fullTab ? "flex-row gap-4" : "flex-col")}>
      {/* History sidebar — only in fullTab or when toggled */}
      {(fullTab || showHistory) && (
        <div className={cn(fullTab ? "w-64 shrink-0" : "absolute inset-0 z-10 bg-background p-3", "flex flex-col gap-2")} style={!fullTab ? { position: "absolute" } : undefined}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">History</h3>
            {!fullTab && (
              <button onClick={() => setShowHistory(false)} className="p-1 rounded hover:bg-foreground/10">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> New chat
          </button>
          <div className="flex-1 overflow-y-auto space-y-1 mt-2">
            {conversations.length === 0 ? (
              <p className="text-[10px] text-muted-foreground text-center py-4">No conversations yet</p>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  className={cn(
                    "group flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors",
                    c.id === activeChatId ? "bg-primary/10 text-primary" : "hover:bg-foreground/5",
                  )}
                  onClick={() => { setActiveChat(c.id); if (!fullTab) setShowHistory(false); }}
                >
                  <MessageSquare className="h-3 w-3 shrink-0" />
                  <span className="flex-1 truncate">{c.title}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteChat(c.id); }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-foreground/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
          </div>
          {conversations.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Delete all conversations? This cannot be undone.")) {
                  clearAllChats();
                }
              }}
              className="text-[10px] text-muted-foreground hover:text-rose-500 transition-colors text-center py-1"
            >
              Clear all history
            </button>
          )}
        </div>
      )}

      {/* Chat panel */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-border/60">
          <Bot className="h-4 w-4 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">AI Tutor</div>
            <div className="text-[10px] text-muted-foreground">
              {hasUserKey ? `${PROVIDER_INFO[aiSettings.provider]?.label ?? aiSettings.provider} · ${aiSettings.model}` : "No API key set — click Settings to add one"}
            </div>
          </div>
          {/* Section 2.3: Settings + History + New Chat accessible in BOTH views */}
          <button
            onClick={handleNewChat}
            className="p-1.5 rounded hover:bg-foreground/10"
            title="New chat"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          {/* Interview Mode button — icon-only in floating bubble, icon+label in full-screen tab */}
          <button
            onClick={() => setInterviewMode(true)}
            className={cn(
              "rounded hover:bg-foreground/10 text-violet-500 transition-colors flex items-center gap-1.5",
              fullTab ? "px-2.5 py-1.5 text-xs font-medium border border-violet-500/30 hover:border-violet-500/50" : "p-1.5",
            )}
            title="🎯 Interview Mode"
          >
            <Target className="h-3.5 w-3.5" />
            {fullTab && <span>Interview Mode</span>}
          </button>
          {/* AI Code Review button — only in full-screen tab (icon+label) */}
          {fullTab && (
            <button
              onClick={() => setCodeReviewMode(true)}
              className="px-2.5 py-1.5 text-xs font-medium rounded hover:bg-foreground/10 text-fuchsia-500 border border-fuchsia-500/30 hover:border-fuchsia-500/50 transition-colors flex items-center gap-1.5"
              title="🔍 AI Code Review"
            >
              <Search className="h-3.5 w-3.5" />
              Code Review
            </button>
          )}
          {!fullTab && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 rounded hover:bg-foreground/10"
              title="History"
            >
              <MessageSquare className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded hover:bg-foreground/10"
            title="Settings"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
          {!fullTab && onMaximize && (
            <button
              onClick={onMaximize}
              className="p-1.5 rounded hover:bg-foreground/10"
              title="Open as tab"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          )}
          {!fullTab && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-foreground/10"
              title="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Settings panel */}
        {showSettings && <AISettingsPanel onClose={() => setShowSettings(false)} />}

        {/* Interview Mode setup screen (Section 4.2) */}
        {interviewMode && (
          <InterviewSetupScreen
            careerId={profile.careerId}
            languages={roadmap?.languageIds ?? []}
            skillLevel={profile.skillLevel}
            difficulty={interviewDifficulty}
            questionCount={interviewQuestionCount}
            onDifficultyChange={setInterviewDifficulty}
            onQuestionCountChange={setInterviewQuestionCount}
            onStart={handleStartInterview}
            onCancel={() => setInterviewMode(false)}
          />
        )}

        {/* AI Code Review panel — only in full-screen tab */}
        {codeReviewMode && fullTab && (
          <CodeReviewPanel
            onClose={() => setCodeReviewMode(false)}
          />
        )}

        {/* Interview Mode banner — shown when an interview is in progress */}
        {interviewSystemPrompt && !interviewMode && (
          <div className="rounded-md bg-violet-500/10 border border-violet-500/30 px-3 py-1.5 text-xs text-violet-600 dark:text-violet-300 flex items-center gap-2">
            <Target className="h-3 w-3" />
            <span className="font-medium">Interview Mode active</span>
            <span className="text-muted-foreground">· AI is acting as a senior interviewer</span>
            <button
              onClick={() => {
                setInterviewSystemPrompt(null);
                handleNewChat();
              }}
              className="ml-auto text-[10px] hover:underline"
            >
              End interview →
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 min-h-0">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-8">
              <Bot className="h-8 w-8 mx-auto mb-2 text-primary/50" />
              <p>Ask me anything about coding!</p>
              <p className="text-[10px] mt-1">I can help with concepts, debugging, code reviews, and more.</p>
            </div>
          ) : (
            activeConversation.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))
          )}
          {sending && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pl-2">
              <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* BYOK setup prompt — shown when no API key is set */}
        {!hasUserKey && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-2 mb-2 text-xs">
            <div className="font-semibold text-amber-700 dark:text-amber-300 mb-1">Set up your AI Tutor</div>
            <p className="text-[10px] text-muted-foreground">
              Bring your own API key (Gemini, Groq, OpenRouter, OpenAI, Anthropic, or custom). Click Settings → enter your key → click Test Connection.
            </p>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border/60 pt-2">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about coding..."
              rows={1}
              className="flex-1 resize-none rounded-lg bg-card/60 border border-border/60 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 max-h-32"
              style={{ minHeight: "36px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending || !hasUserKey}
              className={cn(
                "p-2 rounded-lg shrink-0 transition-colors",
                input.trim() && !sending && hasUserKey
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-foreground/5 text-muted-foreground cursor-not-allowed",
              )}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 text-center">
            AI may make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// InterviewSetupScreen — Section 4.2 setup UI
// ============================================================
function InterviewSetupScreen({
  careerId,
  languages,
  skillLevel,
  difficulty,
  questionCount,
  onDifficultyChange,
  onQuestionCountChange,
  onStart,
  onCancel,
}: {
  careerId?: string;
  languages: string[];
  skillLevel?: string;
  difficulty: QuestionDifficulty;
  questionCount: number;
  onDifficultyChange: (d: QuestionDifficulty) => void;
  onQuestionCountChange: (n: number) => void;
  onStart: () => void;
  onCancel: () => void;
}) {
  const careerLabel = careerId ? (CAREER_MAP[careerId]?.label ?? "Software Engineering") : "Software Engineering";
  const languageNames = languages.map((id) => ALL_LANGUAGE_INFO[id]?.name ?? id);

  return (
    <div className="rounded-xl border border-violet-500/40 bg-violet-500/5 p-4 space-y-3 my-2">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
          <Target className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold">🎯 Technical Interview Simulator</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            I&apos;ll ask you real interview questions for your career and languages. Answer them like you&apos;re in a real interview. I&apos;ll give you honest feedback on each answer.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-1 rounded hover:bg-foreground/10 shrink-0"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-foreground/5 p-2">
          <div className="text-[10px] uppercase text-muted-foreground">Career</div>
          <div className="font-medium truncate">{careerLabel}</div>
        </div>
        <div className="rounded-lg bg-foreground/5 p-2">
          <div className="text-[10px] uppercase text-muted-foreground">Skill level</div>
          <div className="font-medium capitalize">{skillLevel ?? "intermediate"}</div>
        </div>
      </div>

      <div className="rounded-lg bg-foreground/5 p-2">
        <div className="text-[10px] uppercase text-muted-foreground mb-1">Languages</div>
        <div className="flex flex-wrap gap-1">
          {languageNames.length > 0 ? languageNames.map((l) => (
            <span key={l} className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-600 dark:text-violet-300">{l}</span>
          )) : <span className="text-[10px] text-muted-foreground italic">No languages selected</span>}
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <div className="text-[10px] uppercase text-muted-foreground mb-1">Difficulty</div>
          <div className="grid grid-cols-3 gap-1.5">
            {(["beginner", "intermediate", "advanced"] as QuestionDifficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => onDifficultyChange(d)}
                className={cn(
                  "px-2 py-1.5 rounded-md text-xs font-medium capitalize transition-colors",
                  difficulty === d
                    ? "bg-violet-500 text-white"
                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10",
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase text-muted-foreground mb-1">Number of questions</div>
          <div className="grid grid-cols-3 gap-1.5">
            {[5, 10, 15].map((n) => (
              <button
                key={n}
                onClick={() => onQuestionCountChange(n)}
                className={cn(
                  "px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
                  questionCount === n
                    ? "bg-violet-500 text-white"
                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10",
                )}
              >
                {n} Qs
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold hover:brightness-110 transition-all"
      >
        🎯 Start mock interview
      </button>
      <p className="text-[10px] text-muted-foreground text-center">
        The AI will ask one question at a time and give feedback after each answer.
      </p>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
          <Bot className="h-3 w-3 text-white" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-3 py-2",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card/80 border border-border/60",
        )}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
      </div>
      {isUser && (
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-teal-400 to-amber-300 flex items-center justify-center shrink-0 text-[10px] font-bold text-white">
          You
        </div>
      )}
    </div>
  );
}

function AISettingsPanel({ onClose }: { onClose: () => void }) {
  const aiSettings = useStore((s) => s.state.aiSettings);
  const setAISettings = useStore((s) => s.setAISettings);
  const clearAllChats = useStore((s) => s.clearAllChats);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleProviderChange = (provider: AIProviderKey) => {
    const models = PROVIDER_MODELS[provider] ?? [];
    setAISettings({
      provider,
      model: models[0] ?? "",
      apiKey: aiSettings.apiKey, // preserve key
      customEndpoint: provider === "custom" ? aiSettings.customEndpoint : undefined,
    });
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    if (!aiSettings.apiKey || !aiSettings.model) {
      setTestResult({ ok: false, msg: "Enter an API key and select a model first." });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const url = `/api/chat?test=1&provider=${encodeURIComponent(aiSettings.provider)}&apiKey=${encodeURIComponent(aiSettings.apiKey)}&model=${encodeURIComponent(aiSettings.model)}${aiSettings.customEndpoint ? `&customEndpoint=${encodeURIComponent(aiSettings.customEndpoint)}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.ok) {
        setTestResult({ ok: true, msg: "✅ Connected!" });
      } else {
        setTestResult({ ok: false, msg: `❌ Failed — ${data.error ?? "check your key"}` });
      }
    } catch (err) {
      setTestResult({ ok: false, msg: `❌ Failed — ${(err as Error).message}` });
    } finally {
      setTesting(false);
    }
  };

  const currentProviderInfo = PROVIDER_INFO[aiSettings.provider];

  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-3 my-2 space-y-3 max-h-[60vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold">AI Settings</h4>
        <button onClick={onClose} className="p-1 rounded hover:bg-foreground/10">
          <X className="h-3 w-3" />
        </button>
      </div>

      <div>
        <label className="text-[10px] uppercase text-muted-foreground block mb-1">Provider</label>
        <select
          value={aiSettings.provider}
          onChange={(e) => handleProviderChange(e.target.value as AIProviderKey)}
          className="w-full px-2 py-1.5 rounded-md bg-background border border-border text-xs"
        >
          {(Object.keys(PROVIDER_INFO) as AIProviderKey[]).map((p) => (
            <option key={p} value={p}>
              {PROVIDER_INFO[p].icon} {PROVIDER_INFO[p].label}
              {PROVIDER_INFO[p].recommended ? " ⭐" : ""}
              {PROVIDER_INFO[p].freeModels.length > 0 ? " (free tier)" : ""}
            </option>
          ))}
        </select>
      </div>

      {aiSettings.provider === "custom" && (
        <div>
          <label className="text-[10px] uppercase text-muted-foreground block mb-1">Endpoint URL</label>
          <input
            type="text"
            value={aiSettings.customEndpoint ?? ""}
            onChange={(e) => setAISettings({ customEndpoint: e.target.value })}
            placeholder="https://your-endpoint.com/v1/chat/completions"
            className="w-full px-2 py-1.5 rounded-md bg-background border border-border text-xs font-mono"
          />
        </div>
      )}

      <div>
        <label className="text-[10px] uppercase text-muted-foreground block mb-1">API key</label>
        <input
          type="password"
          value={aiSettings.apiKey}
          onChange={(e) => setAISettings({ apiKey: e.target.value })}
          placeholder="paste your API key here"
          className="w-full px-2 py-1.5 rounded-md bg-background border border-border text-xs font-mono"
        />
        <p className="text-[10px] text-muted-foreground mt-1">
          Your key is stored only on this device (localStorage) and sent directly to {currentProviderInfo?.label}. We never see it.
        </p>
      </div>

      {/* Get free key links */}
      {currentProviderInfo?.getFreeKeyUrl && (
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="text-muted-foreground">Get a free key:</span>
          <a
            href={currentProviderInfo.getFreeKeyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            {currentProviderInfo.getFreeKeyUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")} →
          </a>
        </div>
      )}

      <div>
        <label className="text-[10px] uppercase text-muted-foreground block mb-1">Model</label>
        <select
          value={aiSettings.model}
          onChange={(e) => setAISettings({ model: e.target.value })}
          className="w-full px-2 py-1.5 rounded-md bg-background border border-border text-xs font-mono"
        >
          {(PROVIDER_MODELS[aiSettings.provider] || []).map((m) => {
            const isFree = currentProviderInfo?.freeModels.includes(m);
            return (
              <option key={m} value={m}>
                {m}{isFree ? " ✅ free" : ""}
              </option>
            );
          })}
          {!PROVIDER_MODELS[aiSettings.provider]?.includes(aiSettings.model) && aiSettings.model && (
            <option value={aiSettings.model}>{aiSettings.model}</option>
          )}
        </select>
        <input
          type="text"
          value={aiSettings.model}
          onChange={(e) => setAISettings({ model: e.target.value })}
          placeholder="or type a custom model name"
          className="w-full mt-1 px-2 py-1 rounded-md bg-background border border-border text-[10px] font-mono"
        />
      </div>

      <div>
        <label className="text-[10px] uppercase text-muted-foreground block mb-1">
          Temperature / creativity: {aiSettings.temperature.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="1.5"
          step="0.1"
          value={aiSettings.temperature}
          onChange={(e) => setAISettings({ temperature: parseFloat(e.target.value) })}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>0 (precise)</span>
          <span>1.5 (creative)</span>
        </div>
      </div>

      {/* Test Connection button */}
      <div className="pt-2 border-t border-border/60">
        <button
          onClick={handleTestConnection}
          disabled={testing}
          className="w-full py-1.5 rounded-md text-xs bg-primary/15 text-primary hover:bg-primary/25 transition-colors disabled:opacity-50"
        >
          {testing ? "Testing…" : "Test Connection"}
        </button>
        {testResult && (
          <div className={cn(
            "mt-2 px-2 py-1.5 rounded-md text-[11px] font-medium",
            testResult.ok ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/15 text-rose-600 dark:text-rose-400",
          )}>
            {testResult.msg}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-border/60">
        <button
          onClick={() => {
            if (confirm("Delete ALL chat conversations? This cannot be undone.")) {
              clearAllChats();
            }
          }}
          className="w-full py-1.5 rounded-md text-xs text-rose-500 hover:bg-rose-500/10 transition-colors"
        >
          Clear all chat history
        </button>
      </div>

      <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground">
        <strong>Privacy:</strong> Your conversations are stored only on this device. Messages are sent to {currentProviderInfo?.label ?? "the provider"} for processing. Don&apos;t share sensitive info.
      </div>
    </div>
  );
}

// ============================================================
// CodeReviewPanel — in-AI-Tutor Code Review
// Lets the user paste code (no project context needed) and get an AI review.
// ============================================================
function CodeReviewPanel({ onClose }: { onClose: () => void }) {
  const aiSettings = useStore((s) => s.state.aiSettings);
  const addChatMessage = useStore((s) => s.addChatMessage);
  const createChat = useStore((s) => s.createChat);
  const setActiveChat = useStore((s) => s.setActiveChat);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [context, setContext] = useState("");
  const [review, setReview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasKey = !!aiSettings.apiKey;

  const handleSubmit = async () => {
    if (!code.trim()) return;
    if (!hasKey) {
      setError("No API key configured. Click Settings to add one.");
      return;
    }
    setLoading(true);
    setError(null);
    setReview(null);

    const systemPrompt = `You are a senior software engineer performing a code review. The user has shared some code${context ? ` and noted: "${context}"` : ""}.

Review their code for:
1. **Correctness** — Does it work as intended? Are there bugs?
2. **Code Quality** — Is it readable, well-named, properly indented?
3. **Best Practices** — Does it follow ${language} conventions and idioms?
4. **Efficiency** — Any unnecessary complexity or performance issues?
5. **Improvements** — 3 specific, actionable things they could add or improve

Format your response with these exact headings:
## Overall Impression
## What Works Well (list 3-5 specific things)
## Issues Found (list each issue with explanation and fix)
## Suggested Improvements (list 3 with code examples)
## Score: X/10
## Encouragement (one genuine, specific sentence)

Be honest but encouraging. This is a learning context. Use code blocks for all code examples.`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user" as const,
            content: `Please review this ${language} code${context ? ` (Context: ${context})` : ""}:\n\n\`\`\`${language}\n${code}\n\`\`\``,
          }],
          apiKey: aiSettings.apiKey,
          provider: aiSettings.provider,
          model: aiSettings.model,
          temperature: aiSettings.temperature,
          customEndpoint: aiSettings.customEndpoint,
          systemPrompt,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
      setReview(data.content || "(no response)");
      // Set badge-tracking flags
      if (typeof window !== "undefined") {
        window.localStorage.setItem("launchpad:code-reviewed", "1");
        const current = Number(window.localStorage.getItem("launchpad:code-review-count") ?? "0");
        window.localStorage.setItem("launchpad:code-review-count", String(current + 1));
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToChat = () => {
    if (!review) return;
    const chatId = createChat();
    addChatMessage(chatId, {
      id: `msg-${Date.now()}`,
      role: "user",
      content: `**Code Review** (${language})${context ? `\n\nContext: ${context}` : ""}\n\n\`\`\`${language}\n${code}\n\`\`\``,
      timestamp: new Date().toISOString(),
    });
    addChatMessage(chatId, {
      id: `msg-${Date.now()}-review`,
      role: "assistant",
      content: review,
      timestamp: new Date().toISOString(),
      provider: aiSettings.provider,
    });
    setActiveChat(chatId);
    onClose();
  };

  return (
    <div className="rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/5 p-4 space-y-3 my-2">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center shrink-0">
          <Search className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold">🔍 AI Code Review</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Paste your code and get a structured review: correctness, quality, best practices, efficiency, and 3 specific improvements.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-foreground/10 shrink-0"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-medium shrink-0">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs bg-foreground/5 rounded-md px-2 py-1 border border-border/60"
          >
            {["javascript", "typescript", "python", "html", "css", "sql", "bash", "java", "c", "cpp", "csharp", "go", "rust", "swift", "kotlin", "php", "ruby", "r", "dart", "react", "nextjs", "svelte", "vue", "angular", "nodejs"].map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={8}
          placeholder={`// Paste your ${language} code here...`}
          className="w-full px-3 py-2 rounded-md bg-foreground/5 border border-border/60 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40"
        />
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Optional: what does this code do? What are you trying to achieve?"
          className="w-full px-3 py-1.5 rounded-md bg-foreground/5 border border-border/60 text-xs"
        />
      </div>

      {error && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 p-2 text-xs text-rose-600 dark:text-rose-300">
          ⚠️ {error}
        </div>
      )}

      {review && (
        <div className="rounded-md border border-border/60 bg-foreground/5 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold">AI Review</div>
            <div className="flex gap-2">
              <button onClick={() => navigator.clipboard.writeText(review)} className="text-[10px] px-2 py-1 rounded-md bg-foreground/5 hover:bg-foreground/10">Copy</button>
              <button onClick={handleSaveToChat} className="text-[10px] px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20">Save to Chat</button>
            </div>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none text-xs">
            <pre className="whitespace-pre-wrap font-sans">{review}</pre>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={handleSubmit}
          disabled={!code.trim() || loading || !hasKey}
          className={cn(
            "flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors",
            code.trim() && !loading && hasKey
              ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white hover:brightness-110"
              : "bg-foreground/5 text-muted-foreground cursor-not-allowed",
          )}
        >
          {loading ? "Reviewing..." : "🔍 Submit for Review"}
        </button>
        <button onClick={onClose} className="px-3 py-2 rounded-md border border-border/60 text-xs hover:bg-foreground/5">
          Cancel
        </button>
      </div>
    </div>
  );
}
