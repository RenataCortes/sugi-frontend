"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Check, Settings, Crown, Trash2, UserMinus } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Modal } from "@/src/components/ui/modal"
import { useDataStore } from "@/src/store/useDataStore"
import type { Room } from "@/src/types/index"

export function RoomManage({
    room,
    isOwner,
}: {
    room: Room
    isOwner: boolean
}) {
    const router = useRouter()
    const deleteRoom = useDataStore((s) => s.deleteRoom)
    const removeMember = useDataStore((s) => s.removeMember)

    const [copied, setCopied] = useState(false)
    const [manageOpen, setManageOpen] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    async function copyCode() {
        try {
            await navigator.clipboard.writeText(room.code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
        } catch {
            // Clipboard no disponible: no hacemos nada.
        }
    }

    function handleDelete() {
        deleteRoom(room.id)
        router.push("/dashboard")
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={copyCode}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm transition-colors hover:bg-secondary"
                aria-label="Copiar código de la sala"
            >
                <span className="text-muted-foreground">Código</span>
                <span className="font-mono font-semibold tracking-widest">{room.code}</span>
                {copied ? (
                    <Check className="h-4 w-4 text-success-foreground" aria-hidden="true" />
                ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )}
            </button>

            {isOwner && (
                <Button variant="outline" onClick={() => setManageOpen(true)}>
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    Administrar
                </Button>
            )}

            <Modal
                open={manageOpen}
                onClose={() => {
                    setManageOpen(false)
                    setConfirmDelete(false)
                }}
                title="Administrar sala"
                description="Solo el propietario puede gestionar los miembros y eliminar la sala."
            >
                <div className="space-y-5">
                    <div>
                        <p className="mb-2 text-sm font-medium">
                            Miembros ({room.members.length})
                        </p>
                        <ul className="space-y-2">
                            {room.members.map((m) => {
                                const owner = m.id === room.ownerId
                                return (
                                    <li
                                        key={m.id}
                                        className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5"
                                    >
                                        <span
                                            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-primary-foreground"
                                            style={{ backgroundColor: m.avatarColor }}
                                        >
                                            {m.name.slice(0, 2).toUpperCase()}
                                        </span>
                                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                            {m.name}
                                        </span>
                                        {owner ? (
                                            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                <Crown className="h-3 w-3" aria-hidden="true" />
                                                Propietario
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => removeMember(room.id, m.id)}
                                                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                                            >
                                                <UserMinus className="h-3.5 w-3.5" aria-hidden="true" />
                                                Expulsar
                                            </button>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                        {confirmDelete ? (
                            <div className="space-y-3">
                                <p className="text-sm text-foreground">
                                    ¿Seguro que quieres eliminar <strong>{room.name}</strong>? Se
                                    borrarán sus documentos, flashcards y evaluaciones. Esta acción no
                                    se puede deshacer.
                                </p>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setConfirmDelete(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                                        Eliminar definitivamente
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium">Eliminar sala</p>
                                    <p className="text-xs text-muted-foreground">
                                        Elimina la sala y todo su contenido.
                                    </p>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setConfirmDelete(true)}
                                >
                                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                                    Eliminar
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    )
}
