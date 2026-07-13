"use client"

import { use, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FileText, Layers, ListChecks, MessagesSquare, Crown, LockKeyhole } from "lucide-react"
import { Topbar } from "@/src/components/app/topbar"
import { DocumentsTab } from "@/src/components/salas/documents-tab"
import { FlashcardsTab } from "@/src/components/salas/flashcards-tab"
import { AssessmentsTab } from "@/src/components/salas/assessments-tab"
import { RoomManage } from "@/src/components/salas/room-manage"
import { Button } from "@/src/components/ui/button"
import { useDataStore, isRoomOwner, isRoomMember } from "@/src/store/useDataStore"
import { useAuthStore } from "@/src/store/useAuthStore"
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
    const user = useAuthStore((s) => s.user)
    const [tab, setTab] = useState<TabId>("documentos")

    if (!room) notFound()

    const isOwner = isRoomOwner(room, user?.id)
    const isMember = isRoomMember(room, user?.id)

    // Solo los miembros pueden entrar; el resto debe unirse con el código.
    if (!isMember) {
        return (
            <div className="min-h-screen">
                <Topbar backHref="/dashboard" backLabel="Mis salas" />
                <main className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-20 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                        <LockKeyhole className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h1 className="mt-5 font-serif text-xl font-semibold">
                        No tienes acceso a esta sala
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Esta sala es privada. Pide el código a quien la creó y únete desde el
                        panel &ldquo;Unirse con código&rdquo;.
                    </p>
                    <Link href="/dashboard" className="mt-6">
                        <Button>Volver a mis salas</Button>
                    </Link>
                </main>
            </div>
        )
    }

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
                            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                {isOwner ? (
                                    <>
                                        <Crown className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                                        Eres el propietario de esta sala
                                    </>
                                ) : (
                                    <>Creada por {room.ownerName}</>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                        <Link href={`/salas/${room.id}/chat`}>
                            <Button>
                                <MessagesSquare className="h-4 w-4" aria-hidden="true" />
                                Abrir chat IA
                            </Button>
                        </Link>
                        <RoomManage room={room} isOwner={isOwner} />
                    </div>
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
