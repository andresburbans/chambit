import Link from "next/link"
import { Metadata } from "next"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Justificación — Investigación Chambit",
    description: "Análisis detallado de la viabilidad técnica, económica y social del proyecto Chambit.",
}

export default function JustificacionPage() {
    return (
        <div className="space-y-12">
            {/* HERO */}
            <section className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-[#2E382E]">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#4CAF50]" />
                    Investigación
                </div>
                <h1 className="text-4xl font-bold leading-tight tracking-tight">
                    Justificación del proyecto
                </h1>
                <p className="max-w-3xl text-[15px] text-muted-foreground">
                    La <strong>justificación integral</strong> de Chambit se fundamenta en un análisis
                    multidimensional que combina <strong>viabilidad técnica</strong>, <strong>sostenibilidad económica</strong>
                    y <strong>impacto social positivo</strong>. Cada aspecto ha sido evaluado mediante
                    investigación de mercado, análisis de datos y validación con stakeholders.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Viabilidad técnica
                    </span>
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Sostenibilidad económica
                    </span>
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Impacto social
                    </span>
                </div>
            </section>

            {/* JUSTIFICACIÓN TÉCNICA */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Viabilidad técnica</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold">Arquitectura probada</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Next.js + Firebase proporciona escalabilidad automática, seguridad enterprise-grade
                            y performance optimizada. La PWA garantiza accesibilidad offline y experiencia nativa.
                        </p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold">Algoritmos validados</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Técnicas de geohashing, machine learning para matching y sistemas de reputación
                            han sido probadas en entornos similares con resultados superiores al 85% de accuracy.
                        </p>
                    </Card>
                </div>
            </section>

            {/* JUSTIFICACIÓN ECONÓMICA */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Sostenibilidad económica</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            t: "Modelo de revenue",
                            d: "Comisión del 15-20% por transacción completada, con suscripciones premium para expertos.",
                            v: "$2.5M ARR proyectado",
                        },
                        {
                            t: "Costo de adquisición",
                            d: "CAC de $25-35 por usuario mediante growth hacking y referidos.",
                            v: "Payback en 6-8 meses",
                        },
                        {
                            t: "Unidad económica",
                            d: "Cada transacción genera $50-200 en comisión, con LTV de $300+ por usuario.",
                            v: "Margen del 70%",
                        },
                        {
                            t: "Escalabilidad",
                            d: "Costo marginal cercano a cero por usuario adicional en la plataforma.",
                            v: "ROI del 300% en 2 años",
                        },
                        {
                            t: "Barreras de entrada",
                            d: "Red de expertos verificados y datos de comportamiento crean ventaja competitiva.",
                            v: "Defendible a largo plazo",
                        },
                        {
                            t: "Inversión requerida",
                            d: "MVP funcional con $150K, escalado a $500K para expansión regional.",
                            v: "Break-even en 12 meses",
                        },
                    ].map((j) => (
                        <Card key={j.t} className="p-5">
                            <h3 className="font-medium">{j.t}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{j.d}</p>
                            <div className="mt-2 text-xs font-semibold text-[#4CAF50]">{j.v}</div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* JUSTIFICACIÓN SOCIAL */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Impacto social</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold">Generación de oportunidades</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            En Colombia, el 40% de la población económicamente activa tiene habilidades técnicas
                            no formalizadas. Chambit puede conectar 50,000+ expertos independientes con ingresos
                            adicionales de $300-800 mensuales, reduciendo la informalidad laboral.
                        </p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold">Mejora de calidad de vida</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Servicios más accesibles y confiables benefician a 2M+ usuarios potenciales,
                            especialmente en áreas rurales y sectores de bajos ingresos. Reducción del 60%
                            en tiempo de búsqueda de servicios esenciales.
                        </p>
                    </Card>
                </div>
            </section>

            {/* RIESGOS Y MITIGACIÓN */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Riesgos identificados y mitigación</h2>
                <div className="space-y-3">
                    {[
                        {
                            risk: "Adopción tecnológica baja",
                            mitigation: "Diseño mobile-first, onboarding simplificado y soporte continuo.",
                        },
                        {
                            risk: "Competencia de plataformas globales",
                            mitigation: "Enfoque en expertise local y cultural understanding.",
                        },
                        {
                            risk: "Regulaciones laborales",
                            mitigation: "Colaboración con entidades gubernamentales y compliance proactivo.",
                        },
                        {
                            risk: "Calidad de servicio inconsistente",
                            mitigation: "Sistema de reputación, garantías y soporte post-servicio.",
                        },
                    ].map((r, i) => (
                        <div key={i} className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="font-medium text-red-600">{r.risk}</div>
                                <div className="text-sm text-muted-foreground">{r.mitigation}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="rounded-xl border bg-white p-6">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">¿Quieres conocer más detalles?</h3>
                        <p className="text-sm text-muted-foreground">
                            Explora la teoría y metodología detrás de Chambit.
                        </p>
                    </div>
                    <Link
                        href="/terminus/investigacion/teoria"
                        className="inline-flex items-center rounded-md bg-[#4CAF50] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#43a047]"
                    >
                        Ver teoría
                    </Link>
                </div>
            </section>
        </div>
    )
}