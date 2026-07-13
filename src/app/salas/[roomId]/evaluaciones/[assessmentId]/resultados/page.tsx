"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, FileText } from "lucide-react"
import { Topbar } from "@/src/components/app/topbar"
import { Button } from "@/src/components/ui/button"
import { useDataStore } from "@/src/store/useDataStore"
import { useResultsStore } from "@/src/store/useResultsStore"
import { cn } from "@/src/lib/utils"

// NUEVO: Declaramos la constante fuera del componente para evitar el infinite loop
const EMPTY_ASSESSMENTS: any[] = []

export default function ResultsPage({
    params,
}: {
    params: Promise<{ roomId: string; assessmentId: string }>
}) {
    const { roomId, assessmentId } = use(params)

    // Usamos la constante en lugar de crear un [] nuevo
    const assessments = useDataStore((s) => s.assessments[roomId] ?? EMPTY_ASSESSMENTS)
    const result = useResultsStore((s) => s.results[assessmentId])

    const assessment = assessments.find((a) => a.id === assessmentId)

    if (!assessment || !result) {
        return (
            <div className="min-h-dvh bg-background">
                <Topbar />
                <div className="mx-auto max-w-2xl px-4 py-20 text-center">
                    <h1 className="text-xl font-semibold">Sin resultados disponibles</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Realiza la evaluación para ver tus resultados aquí.
                    </p>
                    <Link href={`/salas/${roomId}`} className="mt-6 inline-block">
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                            Volver a la sala
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const pct = Math.round((result.score / result.total) * 100)
    const passed = pct >= 60

    return (
        <div className="min-h-dvh bg-background">
            <Topbar />
            <main className="mx-auto max-w-3xl px-4 py-8">
                <Link
                    href={`/salas/${roomId}`}
                    className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Volver a la sala
                </Link>

                <section className="rounded-2xl border border-border bg-card p-6 text-center">
                    <div
                        className={cn(
                            "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
                            passed ? "bg-success/20 text-success-foreground" : "bg-secondary text-muted-foreground",
                        )}
                    >
                        <Trophy className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <h1 className="mt-4 text-2xl font-bold text-balance">{assessment.title}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {passed ? "¡Buen trabajo! Superaste la evaluación." : "Sigue practicando, vas por buen camino."}
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-8">
                        <div>
                            <p className="text-4xl font-bold text-primary">{pct}%</p>
                            <p className="text-xs text-muted-foreground">Puntaje</p>
                        </div>
                        <div className="h-12 w-px bg-border" />
                        <div>
                            <p className="text-4xl font-bold">
                                {result.score}
                                <span className="text-xl text-muted-foreground">/{result.total}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">Correctas</p>
                        </div>
                    </div>
                </section>

                <h2 className="mt-8 mb-3 text-lg font-semibold">Revisión de respuestas</h2>
                <ul className="space-y-3">
                    {assessment.questions.map((q: any, i: number) => {
                        const chosen = result.answers[q.id]
                        const correct = chosen === q.correctIndex
                        return (
                            <li key={q.id} className="rounded-xl border border-border bg-card p-4">
                                <div className="flex items-start gap-3">
                                    <span
                                        className={cn(
                                            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                                            correct ? "bg-success/20 text-success-foreground" : "bg-destructive/15 text-destructive",
                                        )}
                                    >
                                        {correct ? (
                                            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                                        ) : (
                                            <XCircle className="h-4 w-4" aria-hidden="true" />
                                        )}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium">
                                            {i + 1}. {q.prompt}
                                        </p>
                                        <div className="mt-2 space-y-1.5">
                                            {q.options.map((opt: string, oi: number) => {
                                                const isCorrect = oi === q.correctIndex
                                                const isChosen = oi === chosen
                                                return (
                                                    <div
                                                        key={oi}
                                                        className={cn(
                                                            "rounded-lg px-3 py-1.5 text-sm",
                                                            isCorrect && "bg-success/15 font-medium text-success-foreground",
                                                            !isCorrect && isChosen && "bg-destructive/10 text-destructive line-through",
                                                            !isCorrect && !isChosen && "text-muted-foreground",
                                                        )}
                                                    >
                                                        {opt}
                                                        {isCorrect && " ✓"}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <p className="mt-2 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                                            {q.explanation}
                                        </p>
                                        <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                                            <FileText className="h-3 w-3" aria-hidden="true" />
                                            Fuente: {q.source}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>

                <div className="mt-8 flex justify-center">
                    <Link href={`/salas/${roomId}`}>
                        <Button>
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                            Volver y practicar de nuevo
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    )
}