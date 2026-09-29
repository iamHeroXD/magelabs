"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface TabsContextValue {
  value: string;
  onValueChange: (val: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export function Tabs({
  value,
  onValueChange,
  defaultValue,
  children,
  className,
}: {
  value?: string;
  onValueChange?: (val: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [currentVal, setCurrentVal] = React.useState(value || defaultValue || "");

  const activeVal = value !== undefined ? value : currentVal;
  const setVal = onValueChange || setCurrentVal;

  return (
    <TabsContext.Provider value={{ value: activeVal, onValueChange: setVal }}>
      <div className={cn("flex flex-col space-y-2", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center justify-start rounded-md bg-zinc-900/80 p-1 text-zinc-400 border border-zinc-800",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) return null;
  const isSelected = ctx.value === value;

  return (
    <button
      type="button"
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded px-3 py-1 text-xs font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 select-none",
        isSelected
          ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50"
          : "text-zinc-400 hover:text-zinc-200",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx || ctx.value !== value) return null;

  return (
    <div
      className={cn(
        "mt-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500",
        className
      )}
    >
      {children}
    </div>
  );
}
