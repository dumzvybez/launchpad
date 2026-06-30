"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GlassCard — the foundational surface of the Liquid Glass design system.
 * Frosted, refractive, with depth. Variants: default, elevated, flat.
 */
type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "elevated" | "flat";
  hover?: boolean;
  as?: React.ElementType;
};

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = false, as: Comp = "div", children, ...props }, ref) => {
    return (
      <Comp
        ref={ref}
        className={cn(
          "glass rounded-2xl",
          variant === "elevated" && "glass-elevated",
          variant === "flat" && "glass-flat",
          hover && "glass-hover cursor-pointer",
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
GlassCard.displayName = "GlassCard";

export const GlassCardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-5 pt-5 pb-3", className)} {...props} />
);

export const GlassCardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      "text-sm font-semibold tracking-tight text-foreground/90",
      className,
    )}
    {...props}
  />
);

export const GlassCardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-xs text-muted-foreground mt-1 leading-relaxed", className)}
    {...props}
  />
);

export const GlassCardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-5 pb-5", className)} {...props} />
);

/**
 * GlassButton — primary interactive element
 */
type GlassButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "subtle";
  size?: "sm" | "md" | "lg" | "icon";
};

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97]",
          {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 text-sm",
            lg: "h-12 px-6 text-base",
            icon: "h-10 w-10",
          }[size],
          variant === "primary" &&
            "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:brightness-110",
          variant === "ghost" &&
            "text-foreground/70 hover:text-foreground hover:bg-foreground/5",
          variant === "outline" &&
            "border border-border bg-transparent hover:bg-foreground/5 text-foreground",
          variant === "subtle" &&
            "bg-foreground/5 text-foreground/80 hover:bg-foreground/10",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
GlassButton.displayName = "GlassButton";

/**
 * GlassPill — small badge/tag
 */
export function GlassPill({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        "bg-foreground/6 text-foreground/75 border border-border/50",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * ProgressBar — gradient, animated
 */
export function ProgressBar({
  value,
  className,
  showLabel = false,
  size = "md",
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  // Coerce to a number and guard against NaN — `Math.max(0, NaN)` returns
  // NaN, which then renders as `width: 'NaN%'` (invalid CSS, bar shows 0).
  const safeValue = Number.isFinite(value) ? value : 0;
  const pct = Math.min(100, Math.max(0, safeValue));
  const heights = { sm: "h-1", md: "h-1.5", lg: "h-2.5" };
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "relative flex-1 overflow-hidden rounded-full bg-foreground/8",
          heights[size],
        )}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-teal-400 via-fuchsia-400 to-amber-300 transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            boxShadow: "0 0 8px oklch(0.78 0.16 195 / 0.4)",
          }}
        />
      </div>
      {showLabel && (
        <span className="font-mono text-[10px] tabular-nums text-muted-foreground w-8 text-right">
          {pct}%
        </span>
      )}
    </div>
  );
}

/**
 * ProgressRing — circular SVG progress
 */
export function ProgressRing({
  value,
  size = 64,
  strokeWidth = 6,
  className,
  children,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Guard against NaN — see ProgressBar above.
  const safeValue = Number.isFinite(value) ? value : 0;
  const offset = circumference - (Math.min(100, safeValue) / 100) * circumference;
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="progress-ring">
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.78 0.16 195)" />
            <stop offset="50%" stopColor="oklch(0.74 0.2 320)" />
            <stop offset="100%" stopColor="oklch(0.82 0.18 80)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-foreground/8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ring-gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

/**
 * StatChip — small metric display
 */
export function StatChip({
  label,
  value,
  hint,
  icon,
  className,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
  accent?: "teal" | "amber" | "rose" | "violet" | "emerald" | "primary";
}) {
  const accentMap: Record<string, string> = {
    teal: "text-teal-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
    violet: "text-fuchsia-400",
    emerald: "text-emerald-400",
    primary: "text-primary",
  };
  return (
    <div
      className={cn(
        "glass rounded-2xl p-4 flex flex-col gap-1.5 relative overflow-hidden group",
        className,
      )}
    >
      {/* Subtle top-left accent glow */}
      <div
        className={cn(
          "absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 transition-opacity group-hover:opacity-40",
          accent ? accentMap[accent] : "text-primary",
        )}
        style={{
          background: "currentColor",
          filter: "blur(30px)",
        }}
      />
      <div className="relative flex items-center justify-between">
        <span className="text-eyebrow">
          {label}
        </span>
        {icon && <span className={cn("text-muted-foreground", accent && accentMap[accent])}>{icon}</span>}
      </div>
      <div className="relative text-2xl font-bold tabular-nums tracking-tight">{value}</div>
      {hint && <div className="relative text-[10px] text-muted-foreground font-mono">{hint}</div>}
    </div>
  );
}
