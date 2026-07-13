"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, BookMarked, FileText, Layers } from "lucide-react"
import { Topbar } from "@/src/components/app/topbar"
import { RoomCard } from "@/src/components/dashboard/room-card"
import { Button } from "@/src/components/ui/button"
import { Input, Field } from "@/src/components/ui/input"
import { Modal } from "@/src/components/ui/modal"
import { useDataStore } from "@/src/store/useDataStore"
import { useAuthStore } from "@/src/store/useAuthStore"

export default function DashboardPage() {
    const router = useRouter()
    const rooms = useDataStore((s) => s.rooms)
    const createRoom = useDataStore((s) => s.createRoom)
    const user = useAuthStore((s) => s.user)

    const [query, setQuery] = useState("")
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [subject, setSubject] = useState("")
    const [description, setDescription] = useState("")

    const filtered = useMemo(
        () =>
            rooms.filter(
                (r) =>
                    r.name.toLowerCase().includes(query.toLowerCase()) ||
                    r.subject.toLowerCase().includes(query.toLowerCase()),
            ),
        [rooms, query],
    )

    const totalDocs = rooms.reduce((a, r) => a + r.documentCount, 0)
    const totalCards = rooms.reduce((a, r) => a + r.flashcardCount, 0)

    function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim()) return
        const id = createRoom({ name: name.trim(), subject: subject.trim(), description: description.trim() })
        setOpen(false)
        setName("")
        setSubject("")
        setDescription("")
        router.push(`/salas/${id}`)
    }

    const stats = [
        { icon: BookMarked, label: "Salas", value: rooms.length },
        { icon: FileText, label: "Documentos", value: totalDocs },
        { icon: Layers, label: "Flashcards", value: totalCards },
    ]

    return (
        <div className="min-h-screen">
            <Topbar />

            <main className="mx-auto w-full max-w-6xl px-4 py-8">
                <div className="flex flex-col gap-1">
                    <h1 className="font-serif text-2xl font-semibold tracking-tight">
                        Hola, {user?.name?.split(" ")[0] ?? "estudiante"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Estas son tus salas de estudio. Crea una nueva o continúa donde lo dejaste.
                    </p>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <s.icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div>
                                <p className="text-xl font-semibold leading-none">{s.value}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search
                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <Input
                            placeholder="Buscar salas..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button onClick={() => setOpen(true)}>
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Nueva sala
                    </Button>
                </div>

                {/* Rooms grid */}
                {filtered.length > 0 ? (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
                        <BookMarked className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                        <p className="mt-3 font-medium">No se encontraron salas</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Crea tu primera sala para empezar a estudiar.
                        </p>
                    </div>
                )}
            </main>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title="Nueva sala de estudio"
                description="Organiza cada materia en su propio espacio."
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <Field label="Nombre de la sala" htmlFor="room-name">
                        <Input
                            id="room-name"
                            placeholder="Ej. Química Orgánica"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Field>
                    <Field label="Materia / área" htmlFor="room-subject">
                        <Input
                            id="room-subject"
                            placeholder="Ej. Ciencias Naturales"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </Field>
                    <Field label="Descripción (opcional)" htmlFor="room-desc">
                        <Input
                            id="room-desc"
                            placeholder="¿Qué estudiarás aquí?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Field>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Crear sala</Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
