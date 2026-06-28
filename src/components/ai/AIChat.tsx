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
} from "lucide-react";
import { useStore, getRateLimitInfo, canSendMessage, PROVIDER_MODELS } from "@/lib/store";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { ChatMessage } from "@/lib/types";

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
  const rateLimitTimestamps = useStore((s) => s.state.rateLimitTimestamps);
  const recordRateLimitHit = useStore((s) => s.recordRateLimitHit);
  const aiWarningAcknowledged = useStore((s) => s.state.aiWarningAcknowledged);
  const acknowledgeWarning = useStore((s) => s.acknowledgeAIWarning);
  const clearAllChats = useStore((s) => s.clearAllChats);
  const setView = useStore((s) => s.setView);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(fullTab);
  const [showWarning, setShowWarning] = useState(!aiWarningAcknowledged);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Get or create active conversation
  const activeConversation = conversations.find((c) => c.id === activeChatId) ?? null;
  const hasUserKey = !!aiSettings.apiKey;

  // Rate limit info — recompute on every render
  const rateInfo = getRateLimitInfo({ ...useStore.getState().state, rateLimitTimestamps });

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

    // Check rate limit
    if (!canSendMessage(useStore.getState().state, hasUserKey)) {
      return; // UI shows the limit
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

    // Record rate limit hit for Z.ai (no user key)
    if (!hasUserKey) {
      recordRateLimitHit();
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...(activeConversation?.messages ?? []), userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          apiKey: aiSettings.apiKey || undefined,
          provider: aiSettings.provider,
          model: aiSettings.model,
          temperature: aiSettings.temperature,
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
        content: `⚠️ Error: ${(err as Error).message}\n\nTry again, or add your own API key in settings to use a different provider.`,
        timestamp: new Date().toISOString(),
      };
      addMessage(chatId, errorMessage);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleNewChat = () => {
    createChat();
    setInput("");
    inputRef.current?.focus();
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
              {hasUserKey ? `${aiSettings.provider} · ${aiSettings.model}` : `Z.ai · ${rateInfo.remaining}/${15} left`}
            </div>
          </div>
          {!fullTab && (
            <>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-1.5 rounded hover:bg-foreground/10"
                title="History"
              >
                <MessageSquare className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 rounded hover:bg-foreground/10"
                title="Settings"
              >
                <Settings className="h-3.5 w-3.5" />
              </button>
              {onMaximize && (
                <button
                  onClick={onMaximize}
                  className="p-1.5 rounded hover:bg-foreground/10"
                  title="Open as tab"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded hover:bg-foreground/10"
                  title="Close"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Settings panel */}
        {showSettings && <AISettingsPanel onClose={() => setShowSettings(false)} />}

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

        {/* Rate limit warning */}
        {!hasUserKey && rateInfo.remaining === 0 && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-2 mb-2 text-xs">
            <div className="font-semibold text-amber-700 dark:text-amber-300 mb-1">Rate limit reached</div>
            <p className="text-[10px] text-muted-foreground">
              Resets in {rateInfo.resetsAt ? formatTimeUntil(rateInfo.resetsAt) : "soon"}. Add your own API key in settings to bypass limits.
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
              disabled={!input.trim() || sending || (!hasUserKey && rateInfo.remaining === 0)}
              className={cn(
                "p-2 rounded-lg shrink-0 transition-colors",
                input.trim() && !sending && (hasUserKey || rateInfo.remaining > 0)
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
          onChange={(e) => setAISettings({ provider: e.target.value as never })}
          className="w-full px-2 py-1.5 rounded-md bg-background border border-border text-xs"
        >
          <option value="zai">Z.ai (default, rate-limited)</option>
          <option value="openai">OpenAI (bring your own key)</option>
          <option value="groq">Groq (bring your own key)</option>
          <option value="custom">Custom endpoint</option>
        </select>
      </div>

      {aiSettings.provider !== "zai" && (
        <div>
          <label className="text-[10px] uppercase text-muted-foreground block mb-1">
            API key {aiSettings.provider === "custom" && "(format: endpoint|key)"}
          </label>
          <input
            type="password"
            value={aiSettings.apiKey}
            onChange={(e) => setAISettings({ apiKey: e.target.value })}
            placeholder="sk-..."
            className="w-full px-2 py-1.5 rounded-md bg-background border border-border text-xs font-mono"
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            Your key is stored only on this device and sent directly to the provider. It bypasses our rate limits.
          </p>
        </div>
      )}

      <div>
        <label className="text-[10px] uppercase text-muted-foreground block mb-1">Model</label>
        <select
          value={aiSettings.model}
          onChange={(e) => setAISettings({ model: e.target.value })}
          className="w-full px-2 py-1.5 rounded-md bg-background border border-border text-xs font-mono"
        >
          {(PROVIDER_MODELS[aiSettings.provider] || []).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
          {/* Allow custom model entry */}
          {!PROVIDER_MODELS[aiSettings.provider]?.includes(aiSettings.model) && (
            <option value={aiSettings.model}>{aiSettings.model}</option>
          )}
        </select>
        <input
          type="text"
          value={aiSettings.model}
          onChange={(e) => setAISettings({ model: e.target.value })}
          placeholder="custom-model-name"
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
        <strong>Privacy:</strong> Your conversations are stored only on this device. Messages are sent to {aiSettings.provider === "zai" ? "Z.ai servers" : `the ${aiSettings.provider} API`} for processing. Don&apos;t share sensitive info.
      </div>
    </div>
  );
}

function formatTimeUntil(timestamp: number): string {
  const ms = timestamp - Date.now();
  const minutes = Math.ceil(ms / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}
