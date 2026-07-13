import Link from "next/link"
import { FileText, Layers, Clock, Crown, Users } from "lucide-react"
import type { Room } from "@/src/types/index"

export function RoomCard({ room, isOwner }: { room: Room; isOwner: boolean }) {
    return (
        <Link
            href={`/salas/${room.id}`}
            className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="flex items-center gap-3">
                <span
                    className="h-10 w-1.5 rounded-full"
                    style={{ backgroundColor: room.color }}
                    aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {room.subject}
                    </p>
                    <h3 className="truncate font-semibold group-hover:text-primary">
                        {room.name}
                    </h3>
                </div>
                <span
                    className={
                        isOwner
                            ? "flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                            : "flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                    }
                >
                    {isOwner ? (
                        <>
                            <Crown className="h-3 w-3" aria-hidden="true" />
                            Propietario
                        </>
                    ) : (
                        "Miembro"
                    )}
                </span>
            </div>

            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {room.description}
            </p>

            <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progreso</span>
                    <span className="font-medium text-foreground">{room.progress}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                        className="h-full rounded-full"
                        style={{ width: `${room.progress}%`, backgroundColor: room.color }}
                    />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    {room.documentCount} docs
                </span>
                <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                    {room.flashcardCount} tarjetas
                </span>
                <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    {room.members.length}
                </span>
                <span className="ml-auto flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {room.lastActivity}
                </span>
            </div>
        </Link>
    )
}
