"use client"

import { useState } from "react"
import { Sparkles, Layers, Loader2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { FlashcardItem } from "@/src/components/salas/flashcard-item"
import { useDataStore } from "@/src/store/useDataStore"

// NUEVO: Declaramos los arrays vacíos fuera del componente para 
// mantener la misma referencia en memoria y evitar el infinite loop en Zustand.
// (Usamos `any[]` por simplicidad, pero puedes tiparlos con tus interfaces si lo prefieres)
const EMPTY_CARDS: any[] = []
const EMPTY_DOCS: any[] = []

export function FlashcardsTab({ roomId }: { roomId: string }) {
    // Usamos las constantes en lugar de crear un [] nuevo cada vez
    const cards = useDataStore((s) => s.flashcards[roomId] ?? EMPTY_CARDS)
    const documents = useDataStore((s) => s.documents[roomId] ?? EMPTY_DOCS)
    const [generating, setGenerating] = useState(false)

    const hasDocs = documents.some((d: any) => d.status === "listo")

    function handleGenerate() {
        setGenerating(true)
        setTimeout(() => setGenerating(false), 1600)
    }

    return (
        <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    {cards.length} tarjeta(s) generadas desde tus documentos
                </p>
                <Button size="sm" onClick={handleGenerate} disabled={!hasDocs || generating}>
                    {generating ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                    )}
                    {generating ? "Generando..." : "Generar con IA"}
                </Button>
            </div>

            {!hasDocs && (
                <p className="mt-3 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                    Sube y espera a que se indexe al menos un documento para generar
                    flashcards.
                </p>
            )}

            {cards.length > 0 ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map((card) => (
                        <FlashcardItem key={card.id} card={card} />
                    ))}
                </div>
            ) : (
                <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-14 text-center">
                    <Layers className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                    <p className="mt-3 font-medium">Sin flashcards todavía</p>
                    <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                        Genera tarjetas de repaso automáticamente a partir del contenido de
                        tus documentos.
                    </p>
                </div>
            )}
        </div>
    )
}