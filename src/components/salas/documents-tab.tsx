"use client"

import { useEffect, useState } from "react"
import { FileText, Loader2, CheckCircle2, Plus } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Modal } from "@/src/components/ui/modal"
import { UploadDropzone } from "@/src/components/app/upload-dropzone"
import { useDataStore } from "@/src/store/useDataStore"
import { cn } from "@/src/lib/utils"
import type { StudyDocument } from "@/src/types/index"

function formatSize(kb: number) {
    return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`
}

const typeColors: Record<StudyDocument["type"], string> = {
    pdf: "text-destructive",
    docx: "text-primary",
    pptx: "text-warning-foreground",
    txt: "text-muted-foreground",
}

// NUEVO: Declaramos el array vacío fuera del componente para que 
// mantenga siempre la misma referencia en memoria y evite el infinite loop.
const EMPTY_DOCS: StudyDocument[] = []

export function DocumentsTab({ roomId }: { roomId: string }) {
    // Usamos EMPTY_DOCS en lugar de []
    const documents = useDataStore((s) => s.documents[roomId] ?? EMPTY_DOCS)
    const addDocuments = useDataStore((s) => s.addDocuments)
    const markReady = useDataStore((s) => s.markDocumentReady)
    const [open, setOpen] = useState(false)

    // Simula el procesamiento del RAG: pasa de "procesando" a "listo"
    useEffect(() => {
        const processing = documents.filter((d) => d.status === "procesando")
        if (processing.length === 0) return
        const timers = processing.map((d) =>
            setTimeout(() => markReady(roomId, d.id), 2500),
        )
        return () => timers.forEach(clearTimeout)
    }, [documents, roomId, markReady])

    function handleUpload(files: File[]) {
        addDocuments(roomId, files)
        setOpen(false)
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {documents.length} documento(s) en esta sala
                </p>
                <Button size="sm" onClick={() => setOpen(true)}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Subir
                </Button>
            </div>

            {documents.length > 0 ? (
                <ul className="mt-4 space-y-2">
                    {documents.map((doc) => (
                        <li
                            key={doc.id}
                            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                                <FileText
                                    className={cn("h-5 w-5", typeColors[doc.type])}
                                    aria-hidden="true"
                                />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {formatSize(doc.sizeKb)} · {doc.pages} págs · {doc.uploadedAt}
                                </p>
                            </div>
                            {doc.status === "procesando" ? (
                                <span className="flex items-center gap-1.5 text-xs text-warning-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                    Procesando
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-xs text-success-foreground">
                                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                                    Indexado
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-14 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                    <p className="mt-3 font-medium">Aún no hay documentos</p>
                    <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                        Sube tus apuntes o material y la IA los indexará para el chat, las
                        flashcards y las evaluaciones.
                    </p>
                    <Button size="sm" className="mt-4" onClick={() => setOpen(true)}>
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Subir documentos
                    </Button>
                </div>
            )}

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title="Subir documentos"
                description="Se indexarán para usarse en el chat y las evaluaciones."
            >
                <UploadDropzone onUpload={handleUpload} />
            </Modal>
        </div>
    )
}