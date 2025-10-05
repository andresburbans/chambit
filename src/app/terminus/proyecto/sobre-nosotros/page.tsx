// src/app/terminus/proyecto/sobre-nosotros/page.tsx
import Link from "next/link"
import { Metadata } from "next"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Sobre nosotros — Proyecto Chambit",
    description:
        "Conoce la visión, propósito y equipo detrás de Chambit, el mercado hiperlocal que conecta clientes con expertos confiables.",
}

export default function SobreNosotrosPage() {
    return (
        <div className="space-y-12">
            {/* HERO */}
            <section className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-[#2E382E]">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#4CAF50]" />
                    Proyecto Chambit
                </div>
                <h1 className="text-4xl font-bold leading-tight tracking-tight">
                    Sobre nosotros
                </h1>
                <p className="max-w-3xl text-[15px] text-muted-foreground">
                    Chambit es un <strong>mercado hiperlocal</strong> —web y PWA— que
                    conecta a personas con <strong>expertos verificados</strong> para
                    resolver servicios del día a día con <strong>pertinencia</strong>,
                    <strong> confianza</strong> y <strong>rapidez</strong>. Diseñamos la
                    experiencia mobile-first, con búsqueda contextual, precios sugeridos y
                    un flujo de negociación claro.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        PWA mobile-first
                    </span>
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Búsqueda geo-contextual
                    </span>
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Confianza y reputación
                    </span>
                </div>
            </section>

            {/* PROPÓSITO / VISIÓN */}
            <section className="grid gap-6 md:grid-cols-3">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold">Propósito</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Crear oportunidades reales en lo local: que pedir ayuda sea simple,
                        justo y seguro; y que el conocimiento de las personas se convierta
                        en ingresos sostenibles.
                    </p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-semibold">Visión</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Ser la forma más confiable de encontrar y contratar expertos
                        cerca de ti en Latinoamérica, con experiencias ágiles y
                        transparentes.
                    </p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-semibold">Cómo lo logramos</h3>
                    <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                        <li>Categorización clara por subcategorías.</li>
                        <li>Precios sugeridos y límites razonables.</li>
                        <li>Reputación, reseñas y verificación progresiva.</li>
                        <li>Notificaciones oportunas y PWA instalable.</li>
                    </ul>
                </Card>
            </section>

            {/* VALORES */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Nuestros valores</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            t: "Confianza primero",
                            d: "Verificación, reputación visible y reglas claras para ambas partes.",
                        },
                        {
                            t: "Pertinencia",
                            d: "Mostramos al experto correcto en el momento correcto, según contexto y ubicación.",
                        },
                        {
                            t: "Claridad",
                            d: "Expectativas, precio y tiempos definidos antes de empezar.",
                        },
                        {
                            t: "Impacto local",
                            d: "Favorecemos a la comunidad y a los oficios cercanos.",
                        },
                        {
                            t: "Accesibilidad",
                            d: "UI/UX simple, legible y pensada para móvil.",
                        },
                        {
                            t: "Aprender haciendo",
                            d: "Iteramos con datos: pruebas controladas y feedback real.",
                        },
                    ].map((v) => (
                        <Card key={v.t} className="p-5">
                            <h3 className="font-medium">{v.t}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{v.d}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* EQUIPO (placeholder simple y limpio) */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Equipo core</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {[
                        {
                            name: "Dirección de Producto",
                            role: "Estrategia & experiencia",
                            desc:
                                "Define visión, prioriza el roadmap y asegura consistencia de experiencia.",
                        },
                        {
                            name: "Ingeniería",
                            role: "Full-stack & PWA",
                            desc:
                                "Next.js + Firebase (Auth, Firestore, Storage). Performance, accesibilidad y DX.",
                        },
                        {
                            name: "Ciencia de Datos",
                            role: "Relevancia & precios",
                            desc:
                                "Señales de reputación, geohash, estimadores y validaciones de integridad.",
                        },
                        {
                            name: "Operaciones",
                            role: "Calidad & Soporte",
                            desc:
                                "Onboarding de expertos, resolución de disputas y atención al cliente.",
                        },
                    ].map((m) => (
                        <Card key={m.name} className="p-5">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF7EC] text-sm font-semibold text-[#2E382E]">
                                    {m.name.split(" ").map((x) => x[0]).join("").slice(0, 2)}
                                </div>
                                <div className="space-y-1">
                                    <div className="font-medium">{m.name}</div>
                                    <div className="text-xs text-[#4CAF50]">{m.role}</div>
                                    <p className="text-sm text-muted-foreground">{m.desc}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* CRONO / HITOS (mini-timeline) */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Hitos</h2>
                <div className="space-y-3">
                    {[
                        {
                            date: "2024 Q4",
                            text: "MVP PWA: búsqueda, detalle, cotización y Terminus.",
                        },
                        {
                            date: "2025 Q1",
                            text: "Misiones (tablero), XP y rangos D–S. Notificaciones PWA.",
                        },
                        {
                            date: "2025 Q2",
                            text: "Algoritmo de pertinencia v1: señales de proximidad y reputación.",
                        },
                    ].map((h, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#79E576]" />
                            <div>
                                <div className="text-sm font-medium">{h.date}</div>
                                <div className="text-sm text-muted-foreground">{h.text}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="rounded-xl border bg-white p-6">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">¿Quieres colaborar con Chambit?</h3>
                        <p className="text-sm text-muted-foreground">
                            Escríbenos y cuéntanos cómo te gustaría aportar al proyecto.
                        </p>
                    </div>
                    <Link
                        href="/terminus/proyecto/contactanos"
                        className="inline-flex items-center rounded-md bg-[#4CAF50] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#43a047]"
                    >
                        Contáctanos
                    </Link>
                </div>
            </section>
        </div>
    )
}