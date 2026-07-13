import type { Assessment, AssessmentQuestion } from "@/src/types/index"

const BANK: Omit<AssessmentQuestion, "id">[] = [
    {
        type: "opcion-multiple",
        prompt: "¿Qué organelo es responsable de producir ATP?",
        options: ["Ribosoma", "Mitocondria", "Aparato de Golgi", "Lisosoma"],
        correctIndex: 1,
        explanation: "La mitocondria realiza la respiración celular para producir ATP.",
        source: "Estructura celular.pdf · p.12",
    },
    {
        type: "verdadero-falso",
        prompt: "Las células procariotas poseen un núcleo delimitado por membrana.",
        options: ["Verdadero", "Falso"],
        correctIndex: 1,
        explanation:
            "Falso. Las procariotas no tienen núcleo definido; su ADN está libre en el citoplasma.",
        source: "Estructura celular.pdf · p.5",
    },
    {
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
    {
        type: "opcion-multiple",
        prompt: "¿Dónde se sintetizan las proteínas dentro de la célula?",
        options: [
            "En los ribosomas",
            "En el núcleo",
            "En las vacuolas",
            "En la pared celular",
        ],
        correctIndex: 0,
        explanation:
            "Los ribosomas leen el ARN mensajero y ensamblan los aminoácidos en proteínas.",
        source: "Metabolismo y respiración.pdf · p.3",
    },
    {
        type: "verdadero-falso",
        prompt: "El retículo endoplasmático rugoso tiene ribosomas adheridos.",
        options: ["Verdadero", "Falso"],
        correctIndex: 0,
        explanation:
            "Verdadero. Los ribosomas adheridos le dan su aspecto rugoso y participan en la síntesis de proteínas.",
        source: "Estructura celular.pdf · p.15",
    },
    {
        type: "opcion-multiple",
        prompt: "¿Qué proceso genera energía usando oxígeno?",
        options: [
            "Fermentación",
            "Fotosíntesis",
            "Respiración aeróbica",
            "Difusión",
        ],
        correctIndex: 2,
        explanation:
            "La respiración aeróbica utiliza oxígeno para producir grandes cantidades de ATP.",
        source: "Metabolismo y respiración.pdf · p.7",
    },
]

const difficultyLabel: Record<Assessment["difficulty"], string> = {
    facil: "Fácil",
    media: "Media",
    dificil: "Difícil",
}

export function generateAssessment(
    roomId: string,
    difficulty: Assessment["difficulty"],
    count = 5,
): Assessment {
    const shuffled = [...BANK].sort(() => Math.random() - 0.5).slice(0, count)
    const questions: AssessmentQuestion[] = shuffled.map((q, i) => ({
        ...q,
        id: `q-${Date.now()}-${i}`,
    }))
    return {
        id: `eval-${Date.now()}`,
        roomId,
        title: `Evaluación ${difficultyLabel[difficulty]} · ${questions.length} preguntas`,
        difficulty,
        questions,
        createdAt: "Hoy",
    }
}
