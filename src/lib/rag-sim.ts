import type { StudyDocument, ChatCitation } from "@/src/types/index"

export interface SimAnswer {
    content: string
    citations: ChatCitation[]
}

const SNIPPETS = [
    "Este concepto se define como el proceso mediante el cual el sistema organiza y relaciona la informacion de manera estructurada.",
    "Los autores destacan tres factores principales que influyen directamente en el resultado observado durante el estudio.",
    "La evidencia experimental sugiere una correlacion significativa entre las variables analizadas en el capitulo.",
    "En resumen, la metodologia propuesta permite optimizar los recursos disponibles sin comprometer la precision.",
    "El marco teorico establece las bases para comprender el fenomeno desde una perspectiva integral.",
]

function pickCitations(documents: StudyDocument[], count: number): ChatCitation[] {
    const ready = documents.filter((d) => d.status === "listo")
    const pool = ready.length > 0 ? ready : documents
    if (pool.length === 0) return []

    const citations: ChatCitation[] = []
    for (let i = 0; i < count && i < pool.length + 1; i++) {
        const doc = pool[i % pool.length]
        citations.push({
            docName: doc.name,
            page: ((i * 7 + doc.name.length) % Math.max(1, doc.pages)) + 1,
        })
    }
    return citations
}

const STARTERS = [
    "Con base en tus documentos, esto es lo que encontre:",
    "Segun el material cargado en esta sala:",
    "Revisando tus fuentes, puedo explicarlo asi:",
    "De acuerdo con los apuntes de esta sala:",
]

export function generateRagAnswer(question: string, documents: StudyDocument[]): SimAnswer {
    const q = question.trim().toLowerCase()
    const starter = STARTERS[q.length % STARTERS.length]
    const citations = pickCitations(documents, 2)

    if (documents.length === 0) {
        return {
            content:
                "Todavia no hay documentos en esta sala. Sube uno o mas archivos (PDF, DOCX o TXT) para que pueda responder con base en tu material de estudio.",
            citations: [],
        }
    }

    let body: string
    if (q.includes("resum")) {
        body =
            "Los documentos abordan un tema central que se desarrolla en varias secciones. Las ideas clave incluyen la definicion de los conceptos base, los factores que intervienen y las conclusiones derivadas de la evidencia presentada. Te recomiendo revisar las citas para profundizar en cada punto."
    } else if (q.includes("ejemplo")) {
        body =
            "Un ejemplo representativo que aparece en el material ilustra como se aplica el concepto en un caso concreto, mostrando paso a paso el razonamiento y el resultado esperado."
    } else if (q.includes("diferenc") || q.includes("compar")) {
        body =
            "La principal diferencia radica en el enfoque de cada aproximacion: mientras una prioriza la precision, la otra favorece la eficiencia. Ambas se complementan segun el contexto de aplicacion."
    } else {
        body = `${SNIPPETS[q.length % SNIPPETS.length]} El material tambien detalla sus caracteristicas, su funcionamiento y las condiciones en las que resulta mas efectivo, apoyandose en la evidencia de las fuentes citadas.`
    }

    return {
        content: `${starter}\n\n${body}`,
        citations,
    }
}
