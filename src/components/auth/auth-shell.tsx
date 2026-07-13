import Link from "next/link"
import { Logo } from "@/src/components/logo"
import { BookOpen, Layers, MessagesSquare } from "lucide-react"

const highlights = [
    { icon: BookOpen, text: "Tus documentos, tu base de conocimiento" },
    { icon: MessagesSquare, text: "Chat con IA basado en tu material" },
    { icon: Layers, text: "Flashcards y evaluaciones automáticas" },
]

export function AuthShell({
    title,
    subtitle,
    children,
}: {
    title: string
    subtitle: string
    children: React.ReactNode
}) {
    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* Left brand panel */}
            <div className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
                <Link href="/">
                    <Logo className="[&_span:last-child]:text-primary-foreground [&>span:first-child]:bg-primary-foreground [&>span:first-child]:text-primary" />
                </Link>
                <div className="space-y-6">
                    <h2 className="text-balance font-serif text-3xl font-semibold leading-tight">
                        Convierte tus apuntes en tu mejor tutor de estudio.
                    </h2>
                    <ul className="space-y-3">
                        {highlights.map((h) => (
                            <li key={h.text} className="flex items-center gap-3 text-sm">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/15">
                                    <h.icon className="h-4 w-4" aria-hidden="true" />
                                </span>
                                {h.text}
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="text-sm text-primary-foreground/70">
                    © 2026 Sugi · Plataforma educativa con IA
                </p>
            </div>

            {/* Right form panel */}
            <div className="flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-sm">
                    <div className="mb-8 lg:hidden">
                        <Link href="/">
                            <Logo />
                        </Link>
                    </div>
                    <h1 className="font-serif text-2xl font-semibold tracking-tight">
                        {title}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
                    <div className="mt-8">{children}</div>
                </div>
            </div>
        </div>
    )
}
