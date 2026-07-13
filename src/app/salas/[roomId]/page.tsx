"use client"

import { use, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FileText, Layers, ListChecks, MessagesSquare } from "lucide-react"
import { Topbar } from "@/src/components/app/topbar"
import { DocumentsTab } from "@/src/components/salas/documents-tab"
import { FlashcardsTab } from "@/src/components/salas/flashcards-tab"
import { AssessmentsTab } from "@/src/components/salas/assessments-tab"
import { Button } from "@/src/components/ui/button"
import { useDataStore } from "@/src/store/useDataStore"
import { cn } from "@/src/lib/utils"

type TabId = "documentos" | "flashcards" | "evaluaciones"

const tabs: { id: TabId; label: string; icon: typeof FileText }[] = [
    { id: "documentos", label: "Documentos", icon: FileText },
    { id: "flashcards", label: "Flashcards", icon: Layers },
    { id: "evaluaciones", label: "Evaluaciones", icon: ListChecks },
]

export default function RoomPage({
    params,
}: {
    params: Promise<{ roomId: string }>
}) {
    const { roomId } = use(params)
    const room = useDataStore((s) => s.rooms.find((r) => r.id === roomId))
    const [tab, setTab] = useState<TabId>("documentos")

    if (!room) notFound()

    return (
        <div className="min-h-screen">
            <Topbar backHref="/dashboard" backLabel="Mis salas" />

            <main className="mx-auto w-full max-w-6xl px-4 py-8">
                {/* Room header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                        <span
                            className="mt-1 h-12 w-1.5 rounded-full"
                            style={{ backgroundColor: room.color }}
                            aria-hidden="true"
                        />
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                {room.subject}
                            </p>
                            <h1 className="font-serif text-2xl font-semibold tracking-tight">
                                {room.name}
                            </h1>
                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                {room.description}
                            </p>
                        </div>
                    </div>
                    <Link href={`/salas/${room.id}/chat`}>
                        <Button>
                            <MessagesSquare className="h-4 w-4" aria-hidden="true" />
                            Abrir chat IA
                        </Button>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="mt-8 flex gap-1 overflow-x-auto border-b border-border">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={cn(
                                "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                                tab === t.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground",
                            )}
                        >
                            <t.icon className="h-4 w-4" aria-hidden="true" />
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="mt-6">
                    {tab === "documentos" && <DocumentsTab roomId={room.id} />}
                    {tab === "flashcards" && <FlashcardsTab roomId={room.id} />}
                    {tab === "evaluaciones" && <AssessmentsTab roomId={room.id} />}
                </div>
            </main>
        </div>
    )
}
