"use client"

import { useRef, useState } from "react"
import { UploadCloud, FileText, X } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"

export function UploadDropzone({
    onUpload,
}: {
    onUpload: (files: File[]) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [dragging, setDragging] = useState(false)
    const [files, setFiles] = useState<File[]>([])

    function addFiles(list: FileList | null) {
        if (!list) return
        setFiles((prev) => [...prev, ...Array.from(list)])
    }

    function removeFile(index: number) {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    function handleSubmit() {
        if (files.length === 0) return
        onUpload(files)
        setFiles([])
    }

    return (
        <div className="space-y-4">
            <div
                onDragOver={(e) => {
                    e.preventDefault()
                    setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault()
                    setDragging(false)
                    addFiles(e.dataTransfer.files)
                }}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors",
                    dragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/60 hover:bg-secondary/50",
                )}
            >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UploadCloud className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-medium">
                    Arrastra tus archivos o haz clic para seleccionar
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    PDF, Word, PowerPoint o TXT
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    className="hidden"
                    onChange={(e) => addFiles(e.target.files)}
                />
            </div>

            {files.length > 0 && (
                <ul className="space-y-2">
                    {files.map((f, i) => (
                        <li
                            key={`${f.name}-${i}`}
                            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/50 px-3 py-2"
                        >
                            <span className="flex min-w-0 items-center gap-2">
                                <FileText
                                    className="h-4 w-4 shrink-0 text-primary"
                                    aria-hidden="true"
                                />
                                <span className="truncate text-sm">{f.name}</span>
                            </span>
                            <button
                                onClick={() => removeFile(i)}
                                className="shrink-0 rounded p-1 text-muted-foreground hover:text-destructive"
                                aria-label={`Quitar ${f.name}`}
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={files.length === 0}
            >
                Subir {files.length > 0 ? `${files.length} archivo(s)` : "archivos"}
            </Button>
        </div>
    )
}
