"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Modal } from "@/src/components/ui/modal"
import { cn } from "@/src/lib/utils"
import { useResultsStore } from "@/src/store/useResultsStore"
import type { Assessment } from "@/src/types/index"

export function QuizRunner({
    roomId,
    assessment,
    open,
    onClose,
}: {
    roomId: string
    assessment: Assessment | null
    open: boolean
    onClose: () => void
}) {
    const router = useRouter()
    const saveResult = useResultsStore((s) => s.saveResult)
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState<Record<string, number>>({})
    const [selected, setSelected] = useState<number | null>(null)

    if (!assessment) return null

    const question = assessment.questions[current]
    const isLast = current === assessment.questions.length - 1

    function handleNext() {
        if (selected === null || !assessment) return
        const nextAnswers = { ...answers, [question.id]: selected }
        setAnswers(nextAnswers)
        setSelected(null)

        if (isLast) {
            const score = assessment.questions.reduce(
                (acc, q) => acc + (nextAnswers[q.id] === q.correctIndex ? 1 : 0),
                0,
            )
            saveResult({
                assessmentId: assessment.id,
                score,
                total: assessment.questions.length,
                answers: nextAnswers,
            })
            handleReset()
            onClose()
            router.push(
                `/salas/${roomId}/evaluaciones/${assessment.id}/resultados`,
            )
        } else {
            setCurrent((c) => c + 1)
        }
    }

    function handleReset() {
        setCurrent(0)
        setAnswers({})
        setSelected(null)
    }

    function handleClose() {
        handleReset()
        onClose()
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title={assessment.title}
            description={`Pregunta ${current + 1} de ${assessment.questions.length}`}
        >
            <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                        width: `${((current + 1) / assessment.questions.length) * 100}%`,
                    }}
                />
            </div>

            <p className="font-medium leading-relaxed">{question.prompt}</p>

            <div className="mt-4 space-y-2">
                {question.options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => setSelected(i)}
                        className={cn(
                            "flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors",
                            selected === i
                                ? "border-primary bg-primary/10"
                                : "border-border hover:bg-secondary",
                        )}
                    >
                        <span
                            className={cn(
                                "flex h-5 w-5 items-center justify-center rounded-full border text-xs",
                                selected === i
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border",
                            )}
                        >
                            {selected === i && <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}
                        </span>
                        {opt}
                    </button>
                ))}
            </div>

            <Button
                className="mt-5 w-full"
                onClick={handleNext}
                disabled={selected === null}
            >
                {isLast ? "Finalizar y ver resultados" : "Siguiente"}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
        </Modal>
    )
}
