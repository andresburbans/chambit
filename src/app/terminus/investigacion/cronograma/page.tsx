import Link from "next/link"
import { Metadata } from "next"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Cronograma — Investigación Chambit",
    description: "Planificación temporal detallada del desarrollo e implementación de Chambit.",
}

export default function CronogramaPage() {
    return (
        <div className="space-y-12">
            {/* HERO */}
            <section className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-[#2E382E]">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#4CAF50]" />
                    Investigación
                </div>
                <h1 className="text-4xl font-bold leading-tight tracking-tight">
                    Cronograma del proyecto
                </h1>
                <p className="max-w-3xl text-[15px] text-muted-foreground">
                    El <strong>cronograma</strong> de Chambit sigue una <strong>metodología ágil</strong>
                    con <strong>hitos mensuales</strong> y <strong>entregables específicos</strong>.
                    La planificación integra investigación, desarrollo y validación en ciclos iterativos
                    de 2-4 semanas, permitiendo adaptación rápida basada en datos de usuario.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Metodología ágil
                    </span>
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Hitos mensuales
                    </span>
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Validación continua
                    </span>
                </div>
            </section>

            {/* CRONOGRAMA GENERAL */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Cronograma general (12 meses)</h2>
                <div className="space-y-4">
                    {[
                        {
                            quarter: "Q1 2025: Fundación",
                            duration: "3 meses",
                            milestones: [
                                "Setup infraestructura técnica",
                                "Research de mercado completo",
                                "Definición de MVP y user personas",
                                "Prototipos de baja fidelidad",
                            ],
                            status: "En progreso",
                        },
                        {
                            quarter: "Q2 2025: Desarrollo Core",
                            duration: "3 meses",
                            milestones: [
                                "Desarrollo de plataforma base",
                                "Implementación de algoritmos de matching",
                                "Sistema de autenticación y perfiles",
                                "Testing de usabilidad inicial",
                            ],
                            status: "Planificado",
                        },
                        {
                            quarter: "Q3 2025: Validación",
                            duration: "3 meses",
                            milestones: [
                                "Beta testing con usuarios reales",
                                "Optimización de algoritmos",
                                "Implementación de sistema de pagos",
                                "Análisis de métricas y KPIs",
                            ],
                            status: "Planificado",
                        },
                        {
                            quarter: "Q4 2025: Escalado",
                            duration: "3 meses",
                            milestones: [
                                "Lanzamiento público en Bogotá",
                                "Expansión a otras ciudades",
                                "Programa de referidos y growth",
                                "Evaluación de impacto y ajustes",
                            ],
                            status: "Planificado",
                        },
                    ].map((q, i) => (
                        <Card key={i} className="p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">{q.quarter}</h3>
                                    <div className="text-sm text-[#4CAF50] font-medium">{q.duration}</div>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        {q.milestones.map((m, j) => (
                                            <li key={j}>• {m}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="text-xs font-medium text-white bg-[#4CAF50] px-2 py-1 rounded">
                                    {q.status}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* HITOS DETALLADOS Q1 */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Hitos detallados Q1 2025</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {[
                        {
                            month: "Mes 1: Enero",
                            tasks: [
                                "Configuración Firebase (Auth, Firestore, Storage)",
                                "Setup repositorio y CI/CD básico",
                                "Entrevistas exploratorias (20 usuarios)",
                                "Análisis competitivo preliminar",
                            ],
                        },
                        {
                            month: "Mes 2: Febrero",
                            tasks: [
                                "Desarrollo de landing page",
                                "Encuestas cuantitativas (n=200)",
                                "Definición de user journey principal",
                                "Wireframes de alta fidelidad",
                            ],
                        },
                        {
                            month: "Mes 3: Marzo",
                            tasks: [
                                "Prototipo funcional (Next.js + mock data)",
                                "Testing de usabilidad (n=50)",
                                "Validación de hipótesis de negocio",
                                "Preparación para desarrollo full-stack",
                            ],
                        },
                    ].map((m, i) => (
                        <Card key={i} className="p-5">
                            <h3 className="font-semibold text-[#4CAF50]">{m.month}</h3>
                            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                {m.tasks.map((t, j) => (
                                    <li key={j}>• {t}</li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            </section>

            {/* DEPENDENCIAS Y RIESGOS */}
            <section className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Dependencias críticas</h2>
                    <div className="space-y-3">
                        {[
                            {
                                item: "Equipo técnico completo",
                                impact: "Alto - Bloquea desarrollo",
                                mitigation: "Contratación anticipada, formación interna",
                            },
                            {
                                item: "APIs de geolocalización",
                                impact: "Medio - Afecta UX",
                                mitigation: "Múltiples proveedores, fallback offline",
                            },
                            {
                                item: "Integración de pagos",
                                impact: "Alto - Bloquea monetización",
                                mitigation: "Selección de partner temprano",
                            },
                        ].map((d, i) => (
                            <div key={i} className="rounded-lg border p-4">
                                <div className="font-medium">{d.item}</div>
                                <div className="text-sm text-red-600 mt-1">{d.impact}</div>
                                <div className="text-sm text-muted-foreground mt-1">{d.mitigation}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Riesgos y contingencias</h2>
                    <div className="space-y-3">
                        {[
                            {
                                risk: "Retraso en contratación",
                                contingency: "+1 mes buffer, freelancers temporales",
                            },
                            {
                                risk: "Cambios regulatorios",
                                contingency: "Legal review mensual, compliance proactivo",
                            },
                            {
                                risk: "Baja adopción inicial",
                                contingency: "Growth hacking plan B, partnerships locales",
                            },
                        ].map((r, i) => (
                            <div key={i} className="rounded-lg border p-4">
                                <div className="font-medium text-red-600">{r.risk}</div>
                                <div className="text-sm text-muted-foreground mt-1">{r.contingency}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MÉTRICAS DE SEGUIMIENTO */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Métricas de seguimiento</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            metric: "User Acquisition",
                            target: "500 usuarios beta",
                            frequency: "Semanal",
                        },
                        {
                            metric: "Engagement Rate",
                            target: ">70% sesión semanal",
                            frequency: "Diario",
                        },
                        {
                            metric: "Conversion Funnel",
                            target: "15% booking rate",
                            frequency: "Semanal",
                        },
                        {
                            metric: "Expert Retention",
                            target: ">80% mensual",
                            frequency: "Mensual",
                        },
                        {
                            metric: "NPS",
                            target: ">50",
                            frequency: "Mensual",
                        },
                        {
                            metric: "CAC Payback",
                            target: "<6 meses",
                            frequency: "Trimestral",
                        },
                        {
                            metric: "Revenue Growth",
                            target: "30% MoM",
                            frequency: "Mensual",
                        },
                        {
                            metric: "Churn Rate",
                            target: "<5% mensual",
                            frequency: "Mensual",
                        },
                    ].map((m, i) => (
                        <Card key={i} className="p-4">
                            <div className="text-sm font-semibold text-[#4CAF50]">{m.metric}</div>
                            <div className="text-xs text-muted-foreground mt-1">{m.target}</div>
                            <div className="text-xs text-muted-foreground">{m.frequency}</div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* PRESUPUESTO */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Presupuesto estimado</h2>
                <div className="rounded-lg border overflow-hidden">
                    <div className="grid grid-cols-4 gap-0 bg-gray-50 p-4 font-semibold text-sm">
                        <div>Categoría</div>
                        <div>Q1</div>
                        <div>Q2-Q3</div>
                        <div>Q4</div>
                    </div>
                    {[
                        { category: "Desarrollo técnico", q1: "$45K", q23: "$80K", q4: "$25K" },
                        { category: "Research & UX", q1: "$15K", q23: "$20K", q4: "$10K" },
                        { category: "Marketing & Growth", q1: "$5K", q23: "$25K", q4: "$40K" },
                        { category: "Operaciones", q1: "$10K", q23: "$15K", q4: "$20K" },
                        { category: "Total", q1: "$75K", q23: "$140K", q4: "$95K" },
                    ].map((b, i) => (
                        <div key={i} className={`grid grid-cols-4 gap-0 p-4 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <div className={i === 4 ? 'font-semibold' : ''}>{b.category}</div>
                            <div className={i === 4 ? 'font-semibold' : ''}>{b.q1}</div>
                            <div className={i === 4 ? 'font-semibold' : ''}>{b.q23}</div>
                            <div className={i === 4 ? 'font-semibold' : ''}>{b.q4}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="rounded-xl border bg-white p-6">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">¿Listo para colaborar?</h3>
                        <p className="text-sm text-muted-foreground">
                            Contáctanos para discutir oportunidades de partnership o inversión.
                        </p>
                    </div>
                    <Link
                        href="/terminus/proyecto/contactanos"
                        className="inline-flex items-center rounded-md bg-[#4CAF50] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#43a047]"
                    >
                        Contactar
                    </Link>
                </div>
            </section>
        </div>
    )
}