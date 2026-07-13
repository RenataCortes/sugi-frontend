"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/src/types/index"

const COLORS = [
    "oklch(0.51 0.19 265)",
    "oklch(0.62 0.15 155)",
    "oklch(0.75 0.15 75)",
    "oklch(0.58 0.19 25)",
]

function setAuthCookie(value: string) {
    if (typeof document === "undefined") return
    document.cookie = `sugi_auth=${value}; path=/; max-age=${60 * 60 * 24 * 7}`
}

function clearAuthCookie() {
    if (typeof document === "undefined") return
    document.cookie = "sugi_auth=; path=/; max-age=0"
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    register: (
        name: string,
        email: string,
        password: string,
        role: User["role"],
    ) => Promise<void>
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: async (email) => {
                // Simulación de autenticación
                await new Promise((r) => setTimeout(r, 700))
                const name = email.split("@")[0].replace(/[._]/g, " ")
                const user: User = {
                    id: crypto.randomUUID(),
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    email,
                    role: "estudiante",
                    avatarColor: COLORS[0],
                }
                setAuthCookie(user.id)
                set({ user, isAuthenticated: true })
            },
            register: async (name, email, _password, role) => {
                await new Promise((r) => setTimeout(r, 900))
                const user: User = {
                    id: crypto.randomUUID(),
                    name,
                    email,
                    role,
                    avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)],
                }
                setAuthCookie(user.id)
                set({ user, isAuthenticated: true })
            },
            logout: () => {
                clearAuthCookie()
                set({ user: null, isAuthenticated: false })
            },
        }),
        { name: "sugi-auth" },
    ),
)
