"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { GlassButton } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * ConfirmDialog — v5.933: Reusable themed confirmation modal.
 *
 * Replaces native `window.confirm()` calls with the app's glass-styled
 * AlertDialog. Used by NotificationCentre (Clear All), CommandPalette
 * (Reset all progress), and any other confirmation flow.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  destructive = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  destructive?: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel asChild>
            <GlassButton variant="ghost" size="md" className="mt-0">
              {cancelLabel}
            </GlassButton>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <GlassButton
              variant={destructive ? "primary" : "primary"}
              size="md"
              className={cn("mt-0", destructive && "bg-rose-500 hover:bg-rose-600 text-white border-rose-500/40")}
              onClick={() => { onConfirm(); onOpenChange(false); }}
            >
              {confirmLabel}
            </GlassButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * InfoDialog — v5.933: Reusable themed information modal.
 *
 * Replaces native `alert()` calls with the app's glass-styled AlertDialog.
 * Used by RoadmapView, LearnView, CareerView, AIChat, and certificate-pdf
 * for informational messages that previously used alert().
 */
export function InfoDialog({
  open,
  onOpenChange,
  title,
  children,
  closeLabel = "OK",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  closeLabel?: string;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold">{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <GlassButton variant="primary" size="md" className="mt-0" onClick={() => onOpenChange(false)}>
              {closeLabel}
            </GlassButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
