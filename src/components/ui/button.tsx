import * as React from "react";
import { cn } from "@/lib/utils";
export function Button({ className, variant = "primary", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary"|"secondary"|"outline"|"ghost"|"danger" }) {
  const styles = { primary:"bg-primary text-white hover:bg-primary-hover", secondary:"bg-surface-muted text-foreground hover:bg-border", outline:"border border-border bg-surface hover:bg-surface-muted", ghost:"hover:bg-surface-muted", danger:"bg-danger text-white hover:bg-red-700" };
  return <button className={cn("inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", styles[variant], className)} {...props}/>;
}
