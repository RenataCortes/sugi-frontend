import * as React from "react"
import { cn } from "@/src/lib/utils"

export const Input = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={cn(
                "h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50",
                className,
            )}
            {...props}
        />
    )
})
Input.displayName = "Input"

export function Field({
    label,
    htmlFor,
    children,
}: {
    label: string
    htmlFor: string
    children: React.ReactNode
}) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
                {label}
            </label>
            {children}
        </div>
    )
}
