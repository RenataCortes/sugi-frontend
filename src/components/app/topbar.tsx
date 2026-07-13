"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, LogOut, User as UserIcon } from "lucide-react"
import { Logo } from "@/src/components/logo"
import { useAuthStore } from "@/src/store/useAuthStore"

export function Topbar({
    backHref,
    backLabel,
}: {
    backHref?: string
    backLabel?: string
}) {
    const router = useRouter()
    const user = useAuthStore((s) => s.user)
    const logout = useAuthStore((s) => s.logout)
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function onClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", onClick)
        return () => document.removeEventListener("mousedown", onClick)
    }, [])

    function handleLogout() {
        logout()
        router.push("/login")
    }

    const initials = user?.name
        ? user.name
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "SU"

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    {backHref ? (
                        <Link
                            href={backHref}
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                            {backLabel ?? "Volver"}
                        </Link>
                    ) : (
                        <Link href="/dashboard">
                            <Logo />
                        </Link>
                    )}
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="flex items-center gap-2 rounded-full border border-border bg-card p-1 pr-3 transition-colors hover:bg-secondary"
                        aria-label="Menú de usuario"
                    >
                        <span
                            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-primary-foreground"
                            style={{ backgroundColor: user?.avatarColor ?? "var(--primary)" }}
                        >
                            {initials}
                        </span>
                        <span className="hidden text-sm font-medium sm:inline">
                            {user?.name ?? "Usuario"}
                        </span>
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
                            <div className="border-b border-border px-4 py-3">
                                <p className="truncate text-sm font-medium">
                                    {user?.name ?? "Usuario"}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {user?.email ?? ""}
                                </p>
                                <span className="mt-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-xs capitalize text-secondary-foreground">
                                    {user?.role ?? "estudiante"}
                                </span>
                            </div>
                            <div className="p-1">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary"
                                    onClick={() => setOpen(false)}
                                >
                                    <UserIcon className="h-4 w-4" aria-hidden="true" />
                                    Mis salas
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                                >
                                    <LogOut className="h-4 w-4" aria-hidden="true" />
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
