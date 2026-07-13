"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

export function Modal({
    open,
    onClose,
    title,
    description,
    children,
}: {
    open: boolean
    onClose: () => void
    title: string
    description?: string
    children: React.ReactNode
}) {
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose()
        }
        if (open) document.addEventListener("keydown", onKey)
        return () => document.removeEventListener("keydown", onKey)
    }, [open, onClose])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="font-serif text-lg font-semibold">{title}</h2>
                        {description && (
                            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        aria-label="Cerrar"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
                <div className="mt-5">{children}</div>
            </div>
        </div>
    )
}
