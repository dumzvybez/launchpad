"use client";

// LessonSection — v6.005 sectioned lesson flow.
// Wraps a group of LessonBlocks with a clear title + icon + visual weight,
// giving the lesson a hierarchy: Intro → Core → Practice → Assessment → Next.
// Additive: existing lessons render their blocks directly; new content (or a
// future LearnView refactor) groups blocks into LessonSection wrappers.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type LessonSectionVariant = "intro" | "core" | "practice" | "assessment" | "extra" | "next";

type Props = {
  title: string;
  icon?: ReactNode;
  variant?: LessonSectionVariant;
  children: ReactNode;
  /** Whether the section is collapsible (default: false). */
  collapsible?: boolean;
  defaultCollapsed?: boolean;
};

const VARIANT_STYLES: Record<LessonSectionVariant, string> = {
  intro: "border-teal-500/20 bg-teal-500/[0.03]",
  core: "border-border/40 bg-transparent",
  practice: "border-amber-500/20 bg-amber-500/[0.03]",
  assessment: "border-primary/20 bg-primary/[0.03]",
  extra: "border-border/30 bg-muted/20",
  next: "border-emerald-500/20 bg-emerald-500/[0.03]",
};

const VARIANT_LABEL: Record<LessonSectionVariant, string> = {
  intro: "Introduction",
  core: "Core Concepts",
  practice: "Practice",
  assessment: "Assessment",
  extra: "Going Deeper",
  next: "What's Next",
};

export function LessonSection({ title, icon, variant = "core", children, collapsible = false, defaultCollapsed = false }: Props) {
  return (
    <section className={cn("rounded-xl border p-4 sm:p-5", VARIANT_STYLES[variant])} aria-label={title}>
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-base shrink-0">{icon}</span>}
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
          {title}
        </h2>
        <span className="ml-auto text-[9px] uppercase tracking-wider text-muted-foreground/60 font-mono">
          {VARIANT_LABEL[variant]}
        </span>
      </div>
      <div className={cn("space-y-3", variant === "core" && "text-[15px] leading-7")}>
        {children}
      </div>
    </section>
  );
}

// Collapsible variant (kept simple to avoid state in the default export).
import { useState } from "react";
export function CollapsibleLessonSection(props: Props) {
  const [open, setOpen] = useState(!props.defaultCollapsed);
  return (
    <LessonSection {...props} title={props.title} icon={
      <button onClick={() => setOpen(!open)} className="text-muted-foreground hover:text-foreground" aria-expanded={open}>
        {open ? "▾" : "▸"}
      </button>
    }>
      {open && props.children}
    </LessonSection>
  );
}
