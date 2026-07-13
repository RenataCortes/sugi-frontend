"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, GraduationCap, Presentation } from "lucide-react"
import { AuthShell } from "@/src/components/auth/auth-shell"
import { Button } from "@/src/components/ui/button"
import { Input, Field } from "@/src/components/ui/input"
import { useAuthStore } from "@/src/store/useAuthStore"
import { cn } from "@/src/lib/utils"
import type { User } from "@/src/types/index"

const roles: { value: User["role"]; label: string; icon: typeof GraduationCap }[] =
    [
        { value: "estudiante", label: "Estudiante", icon: GraduationCap },
        { value: "docente", label: "Docente", icon: Presentation },
    ]

export default function RegistroPage() {
    const router = useRouter()
    const register = useAuthStore((s) => s.register)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState<User["role"]>("estudiante")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        if (!name || !email || !password) {
            setError("Completa todos los campos.")
            return
        }
        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.")
            return
        }
        setLoading(true)
        try {
            await register(name, email, password, role)
            router.push("/dashboard")
        } catch {
            setError("No se pudo crear la cuenta. Inténtalo de nuevo.")
            setLoading(false)
        }
    }

    return (
        <AuthShell
            title="Crea tu cuenta"
            subtitle="Empieza a estudiar con IA en menos de un minuto."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Nombre completo" htmlFor="name">
                    <Input
                        id="name"
                        placeholder="Ana Martínez"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Field>
                <Field label="Correo electrónico" htmlFor="email">
                    <Input
                        id="email"
                        type="email"
                        placeholder="tu@correo.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Field>
                <Field label="Contraseña" htmlFor="password">
                    <Input
                        id="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Field>

                <div className="space-y-1.5">
                    <span className="text-sm font-medium text-foreground">Soy</span>
                    <div className="grid grid-cols-2 gap-2">
                        {roles.map((r) => (
                            <button
                                key={r.value}
                                type="button"
                                onClick={() => setRole(r.value)}
                                className={cn(
                                    "flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors",
                                    role === r.value
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border text-muted-foreground hover:bg-secondary",
                                )}
                            >
                                <r.icon className="h-4 w-4" aria-hidden="true" />
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {error}
                    </p>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                    {loading ? "Creando cuenta..." : "Crear cuenta"}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                    Inicia sesión
                </Link>
            </p>
        </AuthShell>
    )
}
