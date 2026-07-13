"use client"

import { useState } from "react"
import Link from "next/link"
import { Sparkles, ListChecks, Loader2, Play, BarChart3, HelpCircle } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Modal } from "@/src/components/ui/modal"
import { QuizRunner } from "@/src/components/salas/quiz-runner"
import { useDataStore } from "@/src/store/useDataStore"
import { useResultsStore } from "@/src/store/useResultsStore"
import { generateAssessment } from "@/src/lib/generate-assessment"
import { cn } from "@/src/lib/utils"
import type { Assessment } from "@/src/types/index"

const difficulties: { value: Assessment["difficulty"]; label: string }[] = [
    { value: "facil", label: "Fácil" },
    { value: "media", label: "Media" },
    { value: "dificil", label: "Difícil" },
]

// NUEVO: Declaramos las constantes fuera del componente para evitar el infinite loop
const EMPTY_ASSESSMENTS: Assessment[] = []
const EMPTY_DOCS: any[] = [] // Puedes tiparlo con StudyDocument si lo tienes disponible

export function AssessmentsTab({ roomId }: { roomId: string }) {
    // Usamos las constantes en lugar de crear arreglos nuevos (?? [])
    const assessments = useDataStore((s) => s.assessments[roomId] ?? EMPTY_ASSESSMENTS)
    const addAssessment = useDataStore((s) => s.addAssessment)
    const documents = useDataStore((s) => s.documents[roomId] ?? EMPTY_DOCS)
    const results = useResultsStore((s) => s.results)

    const [genOpen, setGenOpen] = useState(false)
    const [difficulty, setDifficulty] = useState<Assessment["difficulty"]>("media")
    const [count, setCount] = useState(5)
    const [generating, setGenerating] = useState(false)
    const [active, setActive] = useState<Assessment | null>(null)
    const [runnerOpen, setRunnerOpen] = useState(false)

    const hasDocs = documents.some((d: any) => d.status === "listo")

    function handleGenerate() {
        setGenerating(true)
        setTimeout(() => {
            const assessment = generateAssessment(roomId, difficulty, count)
            addAssessment(roomId, assessment)
            setGenerating(false)
            setGenOpen(false)
        }, 1500)
    }

    function startQuiz(assessment: Assessment) {
        setActive(assessment)
        setRunnerOpen(true)
    }

    return (
        <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    {assessments.length} evaluación(es) · genera preguntas desde tus documentos
                </p>
                <Button size="sm" onClick={() => setGenOpen(true)} disabled={!hasDocs}>
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Generar evaluación
                </Button>
            </div>

            {!hasDocs && (
                <p className="mt-3 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                    Necesitas al menos un documento indexado para generar preguntas.
                </p>
            )}

            {assessments.length > 0 ? (
                <ul className="mt-4 space-y-3">
                    {assessments.map((a) => {
                        const result = results[a.id]
                        return (
                            <li
                                key={a.id}
                                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <ListChecks className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium">{a.title}</p>
                                        <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                                                {a.questions.length} preguntas
                                            </span>
                                            <span>· {a.createdAt}</span>
                                            {result && (
                                                <span className="rounded-full bg-success/20 px-2 py-0.5 font-medium text-success-foreground">
                                                    {result.score}/{result.total}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {result && (
                                        <Link
                                            href={`/salas/${roomId}/evaluaciones/${a.id}/resultados`}
                                        >
                                            <Button size="sm" variant="outline">
                                                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                                                Resultados
                                            </Button>
                                        </Link>
                                    )}
                                    <Button size="sm" onClick={() => startQuiz(a)}>
                                        <Play className="h-4 w-4" aria-hidden="true" />
                                        {result ? "Reintentar" : "Realizar"}
                                    </Button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-14 text-center">
                    <ListChecks className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                    <p className="mt-3 font-medium">Aún no hay evaluaciones</p>
                    <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                        Genera un cuestionario con IA para poner a prueba lo que has
                        estudiado.
                    </p>
                </div>
            )}

            {/* Modal de generación */}
            <Modal
                open={genOpen}
                onClose={() => setGenOpen(false)}
                title="Generar evaluación"
                description="La IA creará preguntas basadas en tus documentos."
            >
                <div className="space-y-5">
                    <div className="space-y-1.5">
                        <span className="text-sm font-medium">Dificultad</span>
                        <div className="grid grid-cols-3 gap-2">
                            {difficulties.map((d) => (
                                <button
                                    key={d.value}
                                    onClick={() => setDifficulty(d.value)}
                                    className={cn(
                                        "rounded-lg border p-2.5 text-sm font-medium transition-colors",
                                        difficulty === d.value
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border text-muted-foreground hover:bg-secondary",
                                    )}
                                >
                                    {d.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <span className="text-sm font-medium">
                            Número de preguntas: {count}
                        </span>
                        <input
                            type="range"
                            min={3}
                            max={6}
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                            className="w-full accent-[var(--primary)]"
                        />
                    </div>

                    <Button
                        className="w-full"
                        onClick={handleGenerate}
                        disabled={generating}
                    >
                        {generating ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : (
                            <Sparkles className="h-4 w-4" aria-hidden="true" />
                        )}
                        {generating ? "Generando preguntas..." : "Generar"}
                    </Button>
                </div>
            </Modal>

            <QuizRunner
                roomId={roomId}
                assessment={active}
                open={runnerOpen}
                onClose={() => setRunnerOpen(false)}
            />
        </div>
    )
}