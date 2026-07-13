"use client"

import { useState } from "react"
import { RotateCcw } from "lucide-react"
import { cn } from "@/src/lib/utils"
import type { Flashcard } from "@/src/types/index"

const masteryStyles: Record<Flashcard["mastery"], string> = {
    nueva: "bg-secondary text-secondary-foreground",
    aprendiendo: "bg-warning/20 text-warning-foreground",
    dominada: "bg-success/20 text-success-foreground",
}

const masteryLabel: Record<Flashcard["mastery"], string> = {
    nueva: "Nueva",
    aprendiendo: "Aprendiendo",
    dominada: "Dominada",
}

export function FlashcardItem({ card }: { card: Flashcard }) {
    const [flipped, setFlipped] = useState(false)

    return (
        <button
            onClick={() => setFlipped((v) => !v)}
            className="flex min-h-44 flex-col rounded-xl border border-border bg-card p-5 text-left transition-all hover:shadow-md"
            aria-label="Voltear tarjeta"
        >
            <div className="flex items-center justify-between">
                <span
                    className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        masteryStyles[card.mastery],
                    )}
                >
                    {masteryLabel[card.mastery]}
                </span>
                <RotateCcw className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </div>

            <div className="flex flex-1 items-center py-4">
                {flipped ? (
                    <p className="text-sm leading-relaxed text-foreground">{card.answer}</p>
                ) : (
                    <p className="font-medium leading-relaxed">{card.question}</p>
                )}
            </div>

            <p className="mt-auto text-xs text-muted-foreground">
                {flipped ? card.source : "Toca para ver la respuesta"}
            </p>
        </button>
    )
}
