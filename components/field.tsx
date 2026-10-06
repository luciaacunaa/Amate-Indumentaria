"use client"

import type { InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type FieldProps = {
  label: string
  className?: string
} & InputHTMLAttributes<HTMLInputElement>

export function Field({ label, className, id, ...props }: FieldProps) {
  const inputId = id ?? props.name
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className="text-sm font-semibold text-foreground/80">
        {label}
      </label>
      <input
        id={inputId}
        className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/25"
        {...props}
      />
    </div>
  )
}
