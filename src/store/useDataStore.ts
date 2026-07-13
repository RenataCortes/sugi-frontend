"use client"

import { create } from "zustand"
import type { Room, StudyDocument, Flashcard, ChatMessage, Assessment } from "@/src/types/index"
import { mockRooms, mockDocuments, mockFlashcards, mockChat, mockAssessments } from "@/src/lib/mock-data"

const ROOM_COLORS = [
    "oklch(0.51 0.19 265)",
    "oklch(0.62 0.15 155)",
    "oklch(0.75 0.15 75)",
    "oklch(0.58 0.19 25)",
    "oklch(0.6 0.13 200)",
]

interface DataState {
    rooms: Room[]
    documents: Record<string, StudyDocument[]>
    flashcards: Record<string, Flashcard[]>
    chats: Record<string, ChatMessage[]>
    assessments: Record<string, Assessment[]>

    createRoom: (input: { name: string; subject: string; description: string }) => string
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

export const useDataStore = create<DataState>()((set) => ({
    rooms: mockRooms,
    documents: mockDocuments,
    flashcards: mockFlashcards,
    chats: mockChat,
    assessments: mockAssessments,

    createRoom: ({ name, subject, description }) => {
        const id = slugify(name)
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
        }
        set((state) => ({
            rooms: [room, ...state.rooms],
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
