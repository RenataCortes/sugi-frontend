import { GraduationCap } from "lucide-react"
import { cn } from "@/src/lib/utils"

export function Logo({
    className,
    showText = true,
}: {
    className?: string
    showText?: boolean
}) {
    return (
        <span className={cn("inline-flex items-center gap-2", className)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </span>
            {showText && (
                <span className="font-serif text-xl font-semibold tracking-tight">
                    Sugi
                </span>
            )}
        </span>
    )
}
