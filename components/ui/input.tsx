import * as React from "react"

import { cn } from "@/lib/cn"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex w-full rounded-md border border-slate-300 bg-transparent p-3 text-sm placeholder:text-slate-400 focus:outline-none focus:border-orange-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-50 dark:focus:border-orange-500",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
