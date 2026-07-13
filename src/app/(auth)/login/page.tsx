"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { AuthShell } from "@/src/components/auth/auth-shell"
import { Button } from "@/src/components/ui/button"
import { Input, Field } from "@/src/components/ui/input"
import { useAuthStore } from "@/src/store/useAuthStore"

function LoginForm() {
    const router = useRouter()
    const params = useSearchParams()
    const login = useAuthStore((s) => s.login)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        if (!email || !password) {
            setError("Completa todos los campos.")
            return
        }
        setLoading(true)
        try {
            await login(email, password)
            router.push(params.get("next") ?? "/dashboard")
        } catch {
            setError("No se pudo iniciar sesión. Inténtalo de nuevo.")
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Field>

            {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {loading ? "Ingresando..." : "Iniciar sesión"}
            </Button>

            <p className="pt-2 text-center text-sm text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Link href="/registro" className="font-medium text-primary hover:underline">
                    Regístrate
                </Link>
            </p>
        </form>
    )
}

export default function LoginPage() {
    return (
        <AuthShell
            title="Bienvenido de vuelta"
            subtitle="Ingresa tus datos para continuar estudiando."
        >
            <Suspense fallback={<div className="h-72" />}>
                <LoginForm />
            </Suspense>
        </AuthShell>
    )
}
