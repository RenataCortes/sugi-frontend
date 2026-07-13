"use client"

import { create } from "zustand"
import type { Room, RoomMember, StudyDocument, Flashcard, ChatMessage, Assessment } from "@/src/types/index"
import { mockRooms, mockDocuments, mockFlashcards, mockChat, mockAssessments, SEED_OWNER_ID } from "@/src/lib/mock-data"

const ROOM_COLORS = [
    "oklch(0.51 0.19 265)",
    "oklch(0.62 0.15 155)",
    "oklch(0.75 0.15 75)",
    "oklch(0.58 0.19 25)",
    "oklch(0.6 0.13 200)",
]

/** True si el usuario es el propietario de la sala (único que puede administrarla). */
export function isRoomOwner(room: Room, userId?: string | null): boolean {
    if (!userId) return false
    // Las salas de ejemplo (semilla) se tratan como propias.
    return room.ownerId === userId || room.ownerId === SEED_OWNER_ID
}

/** True si el usuario es propietario o miembro de la sala. */
export function isRoomMember(room: Room, userId?: string | null): boolean {
    if (!userId) return false
    return isRoomOwner(room, userId) || room.members.some((m) => m.id === userId)
}

/** Genera un código legible de 6 caracteres (sin caracteres ambiguos). */
function generateCode(existing: Room[]): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let code = ""
    do {
        code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    } while (existing.some((r) => r.code === code))
    return code
}

export type JoinResult =
    | { ok: true; roomId: string; alreadyMember: boolean }
    | { ok: false; error: string }

interface DataState {
    rooms: Room[]
    documents: Record<string, StudyDocument[]>
    flashcards: Record<string, Flashcard[]>
    chats: Record<string, ChatMessage[]>
    assessments: Record<string, Assessment[]>

    createRoom: (
        input: { name: string; subject: string; description: string },
        owner: RoomMember,
    ) => string
    joinRoom: (code: string, member: RoomMember) => JoinResult
    deleteRoom: (roomId: string) => void
    removeMember: (roomId: string, userId: string) => void
    addDocuments: (roomId: string, files: File[]) => void
    markDocumentReady: (roomId: string, docId: string) => void
    addChatMessage: (roomId: string, message: ChatMessage) => void
    addAssessment: (roomId: string, assessment: Assessment) => void
}

function slugify(text: string) {
    return (
        text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || `sala-${Date.now()}`
    )
}

function fileType(name: string): StudyDocument["type"] {
    const ext = name.split(".").pop()?.toLowerCase()
    if (ext === "pdf") return "pdf"
    if (ext === "docx" || ext === "doc") return "docx"
    if (ext === "pptx" || ext === "ppt") return "pptx"
    return "txt"
}

export const useDataStore = create<DataState>()((set, get) => ({
    rooms: mockRooms,
    documents: mockDocuments,
    flashcards: mockFlashcards,
    chats: mockChat,
    assessments: mockAssessments,

    createRoom: ({ name, subject, description }, owner) => {
        const id = `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`
        const room: Room = {
            id,
            name,
            subject: subject || "General",
            description: description || "Nueva sala de estudio.",
            color: ROOM_COLORS[Math.floor(Math.random() * ROOM_COLORS.length)],
            documentCount: 0,
            flashcardCount: 0,
            lastActivity: "Recién creada",
            progress: 0,
            ownerId: owner.id,
            ownerName: owner.name,
            code: generateCode([]),
            members: [owner],
        }
        set((state) => ({
            rooms: [{ ...room, code: generateCode(state.rooms) }, ...state.rooms],
            documents: { ...state.documents, [id]: [] },
            flashcards: { ...state.flashcards, [id]: [] },
            chats: {
                ...state.chats,
                [id]: [
                    {
                        id: `m-${Date.now()}`,
                        role: "assistant",
                        content:
                            "¡Sala creada! Sube documentos y podré ayudarte a estudiar respondiendo preguntas basadas en tu material.",
                    },
                ],
            },
            assessments: { ...state.assessments, [id]: [] },
        }))
        return id
    },

    joinRoom: (code, member) => {
        const normalized = code.trim().toUpperCase()
        if (!normalized) return { ok: false, error: "Ingresa un código." }
        const room = get().rooms.find((r) => r.code === normalized)
        if (!room) return { ok: false, error: "No encontramos una sala con ese código." }

        if (isRoomMember(room, member.id)) {
            return { ok: true, roomId: room.id, alreadyMember: true }
        }

        set((state) => ({
            rooms: state.rooms.map((r) =>
                r.id === room.id ? { ...r, members: [...r.members, member] } : r,
            ),
        }))
        return { ok: true, roomId: room.id, alreadyMember: false }
    },

    deleteRoom: (roomId) =>
        set((state) => {
            const { [roomId]: _d, ...documents } = state.documents
            const { [roomId]: _f, ...flashcards } = state.flashcards
            const { [roomId]: _c, ...chats } = state.chats
            const { [roomId]: _a, ...assessments } = state.assessments
            return {
                rooms: state.rooms.filter((r) => r.id !== roomId),
                documents,
                flashcards,
                chats,
                assessments,
            }
        }),

    removeMember: (roomId, userId) =>
        set((state) => ({
            rooms: state.rooms.map((r) =>
                r.id === roomId
                    ? { ...r, members: r.members.filter((m) => m.id !== userId) }
                    : r,
            ),
        })),

    addDocuments: (roomId, files) => {
        const newDocs: StudyDocument[] = files.map((f, i) => ({
            id: `doc-${Date.now()}-${i}`,
            name: f.name,
            sizeKb: Math.max(1, Math.round(f.size / 1024)),
            type: fileType(f.name),
            status: "procesando",
            pages: Math.max(1, Math.round(f.size / 40000)),
            uploadedAt: "Hoy",
        }))
        set((state) => {
            const current = state.documents[roomId] ?? []
            const rooms = state.rooms.map((r) =>
                r.id === roomId
                    ? {
                        ...r,
                        documentCount: current.length + newDocs.length,
                        lastActivity: "Hace un momento",
                    }
                    : r,
            )
            return {
                rooms,
                documents: { ...state.documents, [roomId]: [...newDocs, ...current] },
            }
        })
    },

    markDocumentReady: (roomId, docId) =>
        set((state) => ({
            documents: {
                ...state.documents,
                [roomId]: (state.documents[roomId] ?? []).map((d) =>
                    d.id === docId ? { ...d, status: "listo" } : d,
                ),
            },
        })),

    addChatMessage: (roomId, message) =>
        set((state) => ({
            chats: {
                ...state.chats,
                [roomId]: [...(state.chats[roomId] ?? []), message],
            },
        })),

    addAssessment: (roomId, assessment) =>
        set((state) => ({
            assessments: {
                ...state.assessments,
                [roomId]: [assessment, ...(state.assessments[roomId] ?? [])],
            },
        })),
}))
