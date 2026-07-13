import type { Metadata } from "next"
import { Inter, Lora } from "next/font/google"
import "@/src/app/global.css"

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
})

const lora = Lora({
    subsets: ["latin"],
    variable: "--font-lora",
    display: "swap",
})

export const metadata: Metadata = {
    title: "Sugi · Estudia con IA",
    description:
        "Plataforma educativa con IA: sube tus documentos, genera flashcards, resuelve dudas con un chat basado en tus materiales y evalúa tu aprendizaje.",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es" className={`bg-background ${inter.variable} ${lora.variable}`}>
            <body className="font-sans antialiased">{children}</body>
        </html>
    )
}
