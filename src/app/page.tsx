import Link from "next/link"
import { FileText, Layers, MessagesSquare, ListChecks, ArrowRight, Sparkles } from "lucide-react"
import { Logo } from "@/src/components/logo"
import { Button } from "@/src/components/ui/button"

const features = [
  {
    icon: FileText,
    title: "Sube tus documentos",
    desc: "PDF, Word o presentaciones. Sugi los indexa para convertirlos en tu base de conocimiento personal.",
  },
  {
    icon: MessagesSquare,
    title: "Pregunta con IA (RAG)",
    desc: "Resuelve dudas con respuestas basadas únicamente en tu material, con citas a la página exacta.",
  },
  {
    icon: Layers,
    title: "Flashcards automáticas",
    desc: "Genera tarjetas de repaso a partir de tus apuntes y practica con repetición espaciada.",
  },
  {
    icon: ListChecks,
    title: "Evaluaciones y preguntas",
    desc: "Crea cuestionarios de opción múltiple para medir tu comprensión y detectar vacíos.",
  },
]

const steps = [
  { n: "01", t: "Crea una sala", d: "Organiza cada materia en su propio espacio de estudio." },
  { n: "02", t: "Carga material", d: "Sube documentos y deja que la IA los procese." },
  { n: "03", t: "Estudia y evalúa", d: "Chatea, repasa con flashcards y pon a prueba tu avance." },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/registro">
              <Button size="sm">Crear cuenta</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              Aprendizaje potenciado con IA
            </span>
            <h1 className="mt-6 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Convierte tus apuntes en tu mejor tutor
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Sugi es tu plataforma de estudio con IA: sube tus documentos,
              conversa con ellos, genera flashcards y evalúa lo que aprendes.
              Todo en un solo lugar.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/registro">
                <Button size="lg" className="w-full sm:w-auto">
                  Empezar gratis
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-card/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-16">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16">
          <h2 className="text-center font-serif text-3xl font-semibold tracking-tight">
            Cómo funciona
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="flex flex-col items-start gap-3">
                <span className="font-serif text-3xl font-semibold text-primary">
                  {s.n}
                </span>
                <h3 className="text-lg font-semibold">{s.t}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border">
          <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center">
            <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight">
              Estudia de forma más inteligente, no más difícil
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Únete a estudiantes que ya transforman sus materiales en
              conocimiento que perdura.
            </p>
            <Link href="/registro" className="mt-8 inline-block">
              <Button size="lg">
                Crear mi cuenta
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
          <Logo showText />
          <p>© 2026 Sugi. Plataforma educativa con IA.</p>
        </div>
      </footer>
    </div>
  )
}
