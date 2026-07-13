export interface User {
    id: string
    name: string
    email: string
    role: "estudiante" | "docente"
    avatarColor: string
}

export type DocumentStatus = "procesando" | "listo" | "error"

export interface StudyDocument {
    id: string
    name: string
    sizeKb: number
    type: "pdf" | "docx" | "pptx" | "txt"
    status: DocumentStatus
    pages: number
    uploadedAt: string
}

export interface Flashcard {
    id: string
    question: string
    answer: string
    source: string
    mastery: "nueva" | "aprendiendo" | "dominada"
}

export interface RoomMember {
    id: string
    name: string
    avatarColor: string
}

export interface Room {
    id: string
    name: string
    subject: string
    description: string
    color: string
    documentCount: number
    flashcardCount: number
    lastActivity: string
    progress: number
    /** Id del usuario que creó la sala (único que puede administrarla). */
    ownerId: string
    /** Nombre del propietario, para mostrarlo en la UI. */
    ownerName: string
    /** Código para que otras personas se unan a la sala. */
    code: string
    /** Miembros de la sala (incluye al propietario). */
    members: RoomMember[]
}

export interface ChatCitation {
    docName: string
    page: number
}

export interface ChatMessage {
    id: string
    role: "user" | "assistant"
    content: string
    citations?: ChatCitation[]
}

export type QuestionType = "opcion-multiple" | "verdadero-falso"

export interface AssessmentQuestion {
    id: string
    type: QuestionType
    prompt: string
    options: string[]
    correctIndex: number
    explanation: string
    source: string
}

export interface Assessment {
    id: string
    roomId: string
    title: string
    difficulty: "facil" | "media" | "dificil"
    questions: AssessmentQuestion[]
    createdAt: string
}

export interface AssessmentResult {
    assessmentId: string
    score: number
    total: number
    answers: Record<string, number>
}
