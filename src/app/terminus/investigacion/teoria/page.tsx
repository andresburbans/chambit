import Link from "next/link"
import { Metadata } from "next"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Teoría — Investigación Chambit",
    description: "Fundamentos teóricos y marco conceptual que sustentan el desarrollo de Chambit.",
}

export default function TeoriaPage() {
    return (
        <div className="space-y-12">
            {/* HERO */}
            <section className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-[#2E382E]">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#4CAF50]" />
                    Investigación
                </div>
                <h1 className="text-4xl font-bold leading-tight tracking-tight">
                    Marco teórico
                </h1>
                <p className="max-w-3xl text-[15px] text-muted-foreground">
                    El <strong>marco teórico</strong> de Chambit se construye sobre fundamentos de
                    <strong>economía de plataformas</strong>, <strong>ciencia de datos aplicada</strong>
                    y <strong>psicología del comportamiento</strong>. Integramos teorías probadas
                    con innovaciones tecnológicas para crear un modelo predictivo y escalable.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Economía de plataformas
                    </span>
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Teoría de juegos
                    </span>
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Behavioral economics
                    </span>
                </div>
            </section>

            {/* FUNDAMENTOS TEÓRICOS */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Fundamentos teóricos</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold">Teoría de las plataformas multisided</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Basada en trabajos de Rochet y Tirole (2003), Chambit opera como plataforma
                            de dos lados: usuarios demandantes y expertos oferentes. El éxito depende del
                            equilibrio entre network effects y diseño de incentivos apropiados.
                        </p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold">Teoría de la reputación</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Siguiendo a Shapiro (1983) y Klein & Leffler (1981), implementamos señales
                            de calidad a través de reputación acumulada, reseñas verificadas y garantías
                            implícitas para reducir asimetrías de información.
                        </p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold">Behavioral economics aplicada</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Incorporamos insights de Kahneman & Tversky sobre sesgos cognitivos,
                            diseñando interfaces que minimicen fricción y maximicen confianza mediante
                            defaults inteligentes y feedback inmediato.
                        </p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold">Teoría de matching óptimo</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Aplicamos algoritmos de asignación basados en teoría de grafos y machine
                            learning para optimizar conexiones usuario-experto, considerando múltiples
                            dimensiones: ubicación, especialidad, disponibilidad y compatibilidad.
                        </p>
                    </Card>
                </div>
            </section>

            {/* MODELOS MATEMÁTICOS */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Modelos matemáticos</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            t: "Modelo de utilidad",
                            d: "U = α·C - β·T - γ·R + δ·Q",
                            exp: "Utilidad = Confianza - Tiempo - Riesgo + Calidad",
                        },
                        {
                            t: "Función de matching",
                            d: "M(u,e) = Σ w_i · s_i(u,e)",
                            exp: "Compatibilidad ponderada por señales",
                        },
                        {
                            t: "Ecuación de reputación",
                            d: "R_t = R_{t-1} + λ·(r - R_{t-1})",
                            exp: "Actualización exponencial de rating",
                        },
                        {
                            t: "Modelo de precios",
                            d: "P* = f(D, S, L, C)",
                            exp: "Precio óptimo por demanda, oferta, localización y complejidad",
                        },
                        {
                            t: "Network effects",
                            d: "V = k·(N_d · N_e)^α",
                            exp: "Valor proporcional al producto de redes",
                        },
                        {
                            t: "Tasa de conversión",
                            d: "C = 1 / (1 + e^(-β·X))",
                            exp: "Logística con variables predictoras",
                        },
                    ].map((m) => (
                        <Card key={m.t} className="p-5">
                            <h3 className="font-medium">{m.t}</h3>
                            <div className="mt-1 font-mono text-sm text-[#4CAF50]">{m.d}</div>
                            <p className="mt-1 text-xs text-muted-foreground">{m.exp}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* INNOVACIONES PROPUESTAS */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Innovaciones propuestas</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Sistema de verificación progresiva</h3>
                        <p className="text-sm text-muted-foreground">
                            Más allá de la reputación binaria, implementamos niveles de confianza
                            que evolucionan con el tiempo y el comportamiento, inspirado en
                            teoría de señales de Spence (1973).
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Algoritmo de pertinencia contextual</h3>
                        <p className="text-sm text-muted-foreground">
                            Integramos geolocalización, historial de búsquedas y patrones temporales
                            para predicciones de intención, extendiendo modelos de recomendación
                            colaborativa a servicios locales.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Mecánica de compromiso gamificada</h3>
                        <p className="text-sm text-muted-foreground">
                            Aplicamos teoría de la motivación intrínseca (Deci & Ryan) mediante
                            XP, rangos y logros que incentivan participación sin monetización
                            forzada.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Modelo de precios dinámicos</h3>
                        <p className="text-sm text-muted-foreground">
                            Algoritmos de yield management adaptados a servicios locales,
                            considerando elasticidad de demanda y oferta disponible en tiempo real.
                        </p>
                    </div>
                </div>
            </section>

            {/* VALIDACIÓN TEÓRICA */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Validación teórica</h2>
                <div className="rounded-lg border bg-gray-50 p-6">
                    <p className="text-sm text-muted-foreground">
                        Las hipótesis teóricas han sido validadas mediante:
                    </p>
                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                        <li>• Análisis de casos de éxito: Uber, TaskRabbit, Thumbtack</li>
                        <li>• Experimentos controlados en mercados similares</li>
                        <li>• Modelos econométricos con datos históricos</li>
                        <li>• Simulaciones Monte Carlo para escenarios de riesgo</li>
                        <li>• Validación cualitativa con expertos del dominio</li>
                    </ul>
                </div>
            </section>

            {/* CTA */}
            <section className="rounded-xl border bg-white p-6">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">¿Interesado en la metodología?</h3>
                        <p className="text-sm text-muted-foreground">
                            Descubre cómo implementamos estos fundamentos teóricos.
                        </p>
                    </div>
                    <Link
                        href="/terminus/investigacion/metodologia"
                        className="inline-flex items-center rounded-md bg-[#4CAF50] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#43a047]"
                    >
                        Ver metodología
                    </Link>
                </div>
            </section>
        </div>
    )
}