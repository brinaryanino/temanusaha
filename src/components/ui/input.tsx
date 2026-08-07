import * as React from "react";
import { cn } from "@/lib/utils";
export function Input({className,...props}:React.InputHTMLAttributes<HTMLInputElement>){return <input className={cn("min-h-11 w-full rounded-lg border border-border bg-white px-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-surface-muted",className)} {...props}/>}
