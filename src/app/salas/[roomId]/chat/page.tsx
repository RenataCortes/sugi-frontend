"use client"

import { useEffect, useRef, useState, use } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Sparkles, FileText, Bot, User as UserIcon } from "lucide-react"
import { Topbar } from "@/src/components/app/topbar"
import { Button } from "@/src/components/ui/button"
import { useDataStore } from "@/src/store/useDataStore"
import { generateRagAnswer } from "@/src/lib/rag-sim"
import type { ChatMessage } from "@/src/types/index"

const SUGGESTIONS = [
    "Hazme un resumen del material",
    "Dame un ejemplo del concepto principal",
    "Explica las diferencias clave",
    "Genera una pregunta de repaso",
]

export default function ChatPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = use(params)
    const rooms = useDataStore((s) => s.rooms)
    const chats = useDataStore((s) => s.chats)
    const documents = useDataStore((s) => s.documents)
    const addChatMessage = useDataStore((s) => s.addChatMessage)

    const room = rooms.find((r) => r.id === roomId)
    const messages = chats[roomId] ?? []
    const docs = documents[roomId] ?? []

    const [input, setInput] = useState("")
    const [typing, setTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }, [messages.length, typing])

    function send(text: string) {
        const content = text.trim()
        if (!content || typing) return
        setInput("")

        const userMsg: ChatMessage = {
            id: `m-${Date.now()}`,
            role: "user",
            content,
        }
        addChatMessage(roomId, userMsg)
        setTyping(true)

        setTimeout(() => {
            const answer = generateRagAnswer(content, docs)
            addChatMessage(roomId, {
                id: `m-${Date.now() + 1}`,
                role: "assistant",
                content: answer.content,
                citations: answer.citations,
            })
            setTyping(false)
        }, 900)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
            e.preventDefault()
            send(input)
        }
    }

    if (!room) {
        return (
            <div className="min-h-dvh bg-background">
                <Topbar />
                <div className="mx-auto max-w-2xl px-4 py-20 text-center">
                    <h1 className="text-xl font-semibold text-foreground">Sala no encontrada</h1>
                    <Link href="/dashboard" className="mt-4 inline-block text-primary hover:underline">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-dvh flex-col bg-background">
            <Topbar />

            <header className="border-b border-border bg-card">
                <div className="mx-auto flex w-full max-w-4xl items-center gap-3 px-4 py-3">
                    <Link
                        href={`/salas/${roomId}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Volver a la sala"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-card"
                        style={{ backgroundColor: room.color }}
                    >
                        <Sparkles className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                        <h1 className="truncate text-sm font-semibold text-foreground">Tutor IA · {room.name}</h1>
                        <p className="text-xs text-muted-foreground">
                            {docs.length} {docs.length === 1 ? "documento" : "documentos"} en contexto
                        </p>
                    </div>
                </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-4xl px-4 py-6">
                    <div className="flex flex-col gap-5">
                        {messages.map((m) => (
                            <MessageBubble key={m.id} message={m} />
                        ))}
                        {typing && (
                            <div className="flex items-start gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Bot className="h-4 w-4" />
                                </span>
                                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-card px-4 py-3 ring-1 ring-border">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                                </div>
                            </div>
                        )}
                    </div>

                    {messages.length <= 1 && !typing && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {SUGGESTIONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => send(s)}
                                    className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t border-border bg-card">
                <div className="mx-auto w-full max-w-4xl px-4 py-3">
                    <div className="flex items-end gap-2 rounded-2xl border border-border bg-background p-2 focus-within:ring-2 focus-within:ring-ring">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            placeholder="Pregunta algo sobre tu material..."
                            className="max-h-32 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                        />
                        <Button
                            size="icon"
                            onClick={() => send(input)}
                            disabled={!input.trim() || typing}
                            aria-label="Enviar mensaje"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                        Respuestas simuladas basadas en tus documentos. Verifica siempre la información.
                    </p>
                </div>
            </div>
        </div>
    )
}

function MessageBubble({ message }: { message: ChatMessage }) {
    const isUser = message.role === "user"
    return (
        <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
            <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isUser ? "bg-foreground text-background" : "bg-primary/10 text-primary"
                    }`}
            >
                {isUser ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </span>
            <div className={`flex max-w-[80%] flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
                <div
                    className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                            ? "rounded-tr-sm bg-primary text-primary-foreground"
                            : "rounded-tl-sm bg-card text-foreground ring-1 ring-border"
                        }`}
                >
                    {message.content}
                </div>
                {message.citations && message.citations.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {message.citations.map((c, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                            >
                                <FileText className="h-3 w-3" />
                                {c.docName} · p.{c.page}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
