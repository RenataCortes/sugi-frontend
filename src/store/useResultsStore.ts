"use client"

import { create } from "zustand"
import type { AssessmentResult } from "@/src/types/index"

interface ResultsState {
    results: Record<string, AssessmentResult>
    saveResult: (result: AssessmentResult) => void
}

export const useResultsStore = create<ResultsState>()((set) => ({
    results: {},
    saveResult: (result) =>
        set((state) => ({
            results: { ...state.results, [result.assessmentId]: result },
        })),
}))
