"use client";

import { AIChat } from "@/components/ai/AIChat";
import { useStore } from "@/lib/store";
import { GlassCard } from "@/components/glass/GlassPrimitives";

export function AITutorView() {
  const setMaximized = useStore((s) => s.setAiTutorMaximized);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Tutor</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your personal coding mentor — ask about concepts, debug code, get explanations, and more.
        </p>
      </div>

      <GlassCard className="p-4 h-[calc(100vh-220px)] min-h-[500px]">
        <AIChat fullTab onMaximize={() => setMaximized(false)} />
      </GlassCard>
    </div>
  );
}
