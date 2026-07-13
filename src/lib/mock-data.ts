import type { Room, StudyDocument, Flashcard, ChatMessage, Assessment } from "@/src/types/index"

export const mockRooms: Room[] = [
    {
        id: "biologia-celular",
        name: "Biología Celular",
        subject: "Ciencias Naturales",
        description:
            "Estructura y función de la célula, organelos, membrana y metabolismo.",
        color: "oklch(0.62 0.15 155)",
        documentCount: 3,
        flashcardCount: 24,
        lastActivity: "Hace 2 horas",
        progress: 68,
    },
    {
        id: "calculo-diferencial",
        name: "Cálculo Diferencial",
        subject: "Matemáticas",
        description: "Límites, derivadas, reglas de derivación y aplicaciones.",
        color: "oklch(0.51 0.19 265)",
        documentCount: 4,
        flashcardCount: 31,
        lastActivity: "Ayer",
        progress: 42,
    },
    {
        id: "historia-contemporanea",
        name: "Historia Contemporánea",
        subject: "Ciencias Sociales",
        description: "Del siglo XIX a la actualidad: revoluciones y guerras mundiales.",
        color: "oklch(0.75 0.15 75)",
        documentCount: 2,
        flashcardCount: 18,
        lastActivity: "Hace 3 días",
        progress: 85,
    },
]

export const mockDocuments: Record<string, StudyDocument[]> = {
    "biologia-celular": [
        {
            id: "doc-1",
            name: "Estructura celular.pdf",
            sizeKb: 2480,
            type: "pdf",
            status: "listo",
            pages: 34,
            uploadedAt: "12 mar 2026",
        },
        {
            id: "doc-2",
            name: "Metabolismo y respiración.pdf",
            sizeKb: 1890,
            type: "pdf",
            status: "listo",
            pages: 22,
            uploadedAt: "12 mar 2026",
        },
        {
            id: "doc-3",
            name: "Apuntes clase 4.docx",
            sizeKb: 640,
            type: "docx",
            status: "procesando",
            pages: 8,
            uploadedAt: "Hoy",
        },
    ],
}

export const mockFlashcards: Record<string, Flashcard[]> = {
    "biologia-celular": [
        {
            id: "fc-1",
            question: "¿Cuál es la función principal de la mitocondria?",
            answer:
                "Producir energía en forma de ATP mediante la respiración celular. Se la conoce como la central energética de la célula.",
            source: "Estructura celular.pdf · p.12",
            mastery: "dominada",
        },
        {
            id: "fc-2",
            question: "¿Qué diferencia hay entre célula procariota y eucariota?",
            answer:
                "La eucariota posee núcleo definido y organelos membranosos; la procariota carece de núcleo y su material genético está libre en el citoplasma.",
            source: "Estructura celular.pdf · p.5",
            mastery: "aprendiendo",
        },
        {
            id: "fc-3",
            question: "¿Qué es la membrana plasmática?",
            answer:
                "Una bicapa lipídica que rodea la célula, controla el paso de sustancias y mantiene el equilibrio interno (homeostasis).",
            source: "Estructura celular.pdf · p.8",
            mastery: "nueva",
        },
        {
            id: "fc-4",
            question: "¿Dónde ocurre la síntesis de proteínas?",
            answer:
                "En los ribosomas, que pueden estar libres en el citoplasma o adheridos al retículo endoplasmático rugoso.",
            source: "Metabolismo y respiración.pdf · p.3",
            mastery: "aprendiendo",
        },
    ],
}

export const mockChat: Record<string, ChatMessage[]> = {
    "biologia-celular": [
        {
            id: "m-1",
            role: "assistant",
            content:
                "¡Hola! Soy tu asistente de estudio para Biología Celular. Puedo responder preguntas basándome únicamente en los documentos de esta sala. ¿Qué quieres repasar hoy?",
        },
    ],
}

export const mockAssessments: Record<string, Assessment[]> = {
    "biologia-celular": [
        {
            id: "eval-1",
            roomId: "biologia-celular",
            title: "Repaso: Organelos celulares",
            difficulty: "media",
            createdAt: "Hoy",
            questions: [
                {
                    id: "q-1",
                    type: "opcion-multiple",
                    prompt: "¿Qué organelo es responsable de producir ATP?",
                    options: ["Ribosoma", "Mitocondria", "Aparato de Golgi", "Lisosoma"],
                    correctIndex: 1,
                    explanation:
                        "La mitocondria realiza la respiración celular para producir ATP.",
                    source: "Estructura celular.pdf · p.12",
                },
                {
                    id: "q-2",
                    type: "verdadero-falso",
                    prompt:
                        "Las células procariotas poseen un núcleo delimitado por membrana.",
                    options: ["Verdadero", "Falso"],
                    correctIndex: 1,
                    explanation:
                        "Falso. Las procariotas no tienen núcleo definido; su ADN está libre en el citoplasma.",
                    source: "Estructura celular.pdf · p.5",
                },
                {
                    id: "q-3",
                    type: "opcion-multiple",
                    prompt: "¿Cuál es la función de la membrana plasmática?",
                    options: [
                        "Almacenar información genética",
                        "Sintetizar lípidos",
                        "Controlar el paso de sustancias",
                        "Digerir residuos celulares",
                    ],
                    correctIndex: 2,
                    explanation:
                        "La membrana plasmática regula el intercambio de sustancias y mantiene la homeostasis.",
                    source: "Estructura celular.pdf · p.8",
                },
            ],
        },
    ],
}

// Respuestas simuladas del chat RAG
export function generateMockAnswer(question: string): ChatMessage {
    const answers = [
        {
            content:
                "Según tus documentos, la mitocondria es el organelo encargado de la respiración celular y la producción de ATP. Su membrana interna forma pliegues llamados crestas que aumentan la superficie disponible para las reacciones energéticas.",
            citations: [{ docName: "Estructura celular.pdf", page: 12 }],
        },
        {
            content:
                "De acuerdo con el material de la sala, la membrana plasmática es una bicapa lipídica selectivamente permeable. Regula qué sustancias entran y salen de la célula, lo que resulta esencial para mantener la homeostasis.",
            citations: [{ docName: "Estructura celular.pdf", page: 8 }],
        },
        {
            content:
                "Basándome en tus apuntes, la síntesis de proteínas ocurre en los ribosomas. Estos leen el ARN mensajero y ensamblan aminoácidos en el orden indicado para formar cadenas polipeptídicas.",
            citations: [{ docName: "Metabolismo y respiración.pdf", page: 3 }],
        },
    ]
    const pick = answers[Math.floor(Math.random() * answers.length)]
    return {
        id: `m-${Date.now()}`,
        role: "assistant",
        content: pick.content,
        citations: pick.citations,
    }
}
