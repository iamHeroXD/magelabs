import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "amber" | "outline" | "success" | "danger" | "secondary";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors select-none",
        variant === "default" && "bg-zinc-800 text-zinc-200 border border-zinc-700/60",
        variant === "amber" && "bg-amber-500/10 text-amber-400 border border-amber-500/30",
        variant === "success" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
        variant === "danger" && "bg-red-500/10 text-red-400 border border-red-500/30",
        variant === "secondary" && "bg-zinc-900 text-zinc-400 border border-zinc-800",
        variant === "outline" && "border border-zinc-700 text-zinc-300",
        className
      )}
      {...props}
    />
  );
}
