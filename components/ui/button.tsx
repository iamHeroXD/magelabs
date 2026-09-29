import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "amber";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:pointer-events-none disabled:opacity-50 select-none",
          // Variants
          variant === "primary" && "bg-zinc-100 text-zinc-900 hover:bg-white shadow-sm",
          variant === "amber" && "bg-amber-500 text-zinc-950 hover:bg-amber-400 font-semibold shadow-sm",
          variant === "secondary" && "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700/60",
          variant === "outline" && "border border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800/80 hover:text-white",
          variant === "ghost" && "bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white",
          variant === "danger" && "bg-red-600/90 text-white hover:bg-red-500 shadow-sm",
          // Sizes
          size === "sm" && "h-8 px-3 text-xs rounded-md gap-1.5",
          size === "md" && "h-10 px-4 text-sm rounded-md gap-2",
          size === "lg" && "h-12 px-6 text-base rounded-lg gap-2.5",
          size === "icon" && "h-9 w-9 rounded-md p-0",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
