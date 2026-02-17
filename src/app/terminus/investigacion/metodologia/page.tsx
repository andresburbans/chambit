import Link from "next/link"
import { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { Compass, Hammer, Search, Rocket, Layers, Map, Database, Monitor, Smartphone } from "lucide-react"

export const metadata: Metadata = {
    title: "Metodología — Investigación Chambit",
    description: "Enfoque metodológico y procesos de investigación utilizados en el desarrollo de Chambit.",
}

export default function MetodologiaPage() {
    return (
        <div className="space-y-12">
            {/* HERO */}
            <section className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-[#2E382E]">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#4CAF50]" />
                </div>
                <h1 className="text-4xl font-bold leading-tight tracking-tight">
                    Metodología de investigación
                </h1>
                <p className="max-w-3xl text-[15px] text-muted-foreground">
                    La <strong>metodología</strong> de Chambit combina <strong>investigación cualitativa y cuantitativa</strong>,
                    <strong> desarrollo iterativo</strong> y <strong>validación experimental</strong>. Utilizamos un
                    enfoque <strong>mixed-methods</strong> que integra datos de usuario, análisis técnico y
                    experimentación controlada para garantizar solidez científica y aplicabilidad práctica.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Mixed-methods
                    </span>
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Desarrollo iterativo
                    </span>
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Validación experimental
                    </span>
                </div>
            </section>

            {/* ENFOQUE GENERAL */}
            <section className="grid gap-6 md:grid-cols-3">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold">Paradigma</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Investigación-acción participativa con enfoque constructivista.
                        Los usuarios y expertos son co-creadores del conocimiento.
                    </p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-semibold">Diseño</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Estudio exploratorio longitudinal con componentes experimentales
                        y cuasi-experimentales en entornos naturales.
                    </p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-semibold">Enfoque temporal</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Investigación formativa durante desarrollo, sumativa post-lanzamiento,
                        con evaluación continua y adaptaciones basadas en datos.
                    </p>
                </Card>
            </section>

            {/* DIAGRAMA DE METODOLOGÍA */}
            <section className="space-y-4">
                <div className="w-full bg-gradient-to-b from-white to-slate-50 text-slate-900 py-10">
                    <div className="mx-auto max-w-6xl px-6 md:px-10 space-y-8">
                        {/* HEADER */}
                        <header>
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Diagrama metodológico</h3>
                            <p className="mt-2 text-slate-600 text-justify">
                                Aquí se presentan las fases secuenciales alineadas con los objetivos del proyecto. Este diagrama resume el flujo de trabajo, desde la planificación hasta el lanzamiento del producto mínimo viable (PMV), basado en el innovador modelo de búsqueda geo-contextual, que mejorará significativamente la experiencia de conexión entre clientes y prestadores de servicios.
                            </p>
                        </header>

                        {/* Timeline superior */}
                        <div className="relative">
                            <div className="hidden md:flex items-center">
                                {[1, 2, 3, 4].map((n, i) => (
                                    <div key={n} className="flex items-center flex-1">
                                        <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-slate-900 text-white shadow-md z-10">
                                            <span className="text-sm font-semibold">{n}</span>
                                        </div>
                                        {i < 3 && (
                                            <div className="flex-1 flex items-center px-3">
                                                <div className="h-1 flex-1 bg-slate-200 rounded-full" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="hidden md:grid grid-cols-4 text-xs text-slate-600 mt-3">
                                <div className="text-left pl-0">Planificación</div>
                                <div className="text-left pl-0">Prototipo</div>
                                <div className="text-left pl-0">Búsqueda híbrida</div>
                                <div className="text-left pl-0">Integración</div>
                            </div>
                        </div>

                        {/* Grid de fases */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    id: 1,
                                    title: "Fase 1: Planificación y diseño",
                                    icon: "Compass",
                                    color: "from-sky-100 to-sky-50",
                                    bullets: [
                                        "Lógica de negocio (Lean starup, BMC)",
                                        "Análisis del fenómeno espacial",
                                        "Diseño del modelo de datos geográfico",
                                        "Análisis espacial, consulta y visualización", "Datos, metadatos y privacidad"
                                        ,
                                    ],
                                    chips: ["Lean startup", "Geodata", "SIG", "PII"],
                                },
                                {
                                    id: 2,
                                    title: "Fase 2: Captura, persistencia, consulta y visualización",
                                    icon: "Hammer",
                                    color: "from-emerald-100 to-emerald-50",
                                    bullets: [
                                        "Prototipo PWA base",
                                        "Bases de datos alfanumérica y espacial",
                                        "Indexación por rejilla hexagonal H3",
                                        "Georeferenciación dinámica y operativa", "Geovisualización operativa (Lista/mapa)"
                                        ,
                                    ],
                                    chips: ["PWA base (UI/UX)", "DB", "H3", "visualización"],
                                },
                                {
                                    id: 3,
                                    title: "Fase 3: Modelo de búsqueda geo-contextual (híbrido)",
                                    icon: "Search",
                                    color: "from-amber-100 to-amber-50",
                                    bullets: [
                                        "Filtrado por candidatos H3 y puntuación probabilística",
                                        "Construcción del vector de características y ordenamiento LTR (opcional)",
                                        "Integración de las partes del modelo de búsqueda",
                                        "Dashboard de geoanálisis básico"
                                        ,
                                    ],
                                    chips: ["Busqueda", "Filtrado", "WLC", "LTR"],
                                },
                                {
                                    id: 4,
                                    title: "Fase 4: Integración, pruebas de funcionalidad y despliegue del sistema",
                                    icon: "Rocket",
                                    color: "from-violet-100 to-violet-50",
                                    bullets: [
                                        "Conexión del PWA base con el modelo de búsqueda",
                                        "pruebas ligeras de rendimiento y resiliencia",
                                        "verificación de coherencia funcional y espacial",
                                        "Caching, seguridad y reglas de acceso", "Despliegue operacional y documentación (manual de usuario)"
                                        ,
                                    ],
                                    chips: ["Integración", "Tests", "Seguridad", "Despliegue"],
                                },
                            ].map((p, idx) => (
                                <div
                                    key={p.id}
                                    className={`relative rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-b ${p.color} p-5`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="shrink-0 mt-0.5">
                                            {p.icon === "Compass" && <Compass className="w-6 h-6 text-slate-700" />}
                                            {p.icon === "Hammer" && <Hammer className="w-6 h-6 text-slate-700" />}
                                            {p.icon === "Search" && <Search className="w-6 h-6 text-slate-700" />}
                                            {p.icon === "Rocket" && <Rocket className="w-6 h-6 text-slate-700" />}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold leading-tight">{p.title}</h4>
                                            <ul className="mt-3 space-y-2 text-sm text-slate-700">
                                                {p.bullets.map((b, i) => (
                                                    <li key={i} className="flex gap-2 items-start">
                                                        <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-slate-600/70" />
                                                        <span>{b}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {p.chips.map((c, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-xs px-2.5 py-1 rounded-full border border-slate-300 bg-white/70 backdrop-blur-sm"
                                                    >
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Esquinas decorativas */}
                                    <div className="pointer-events-none absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-white/60 border border-slate-200 shadow-[0_1px_0_#fff_inset]" />
                                    <div className="pointer-events-none absolute -bottom-3 -right-3 w-10 h-10 rounded-xl bg-white/60 border border-slate-200 shadow-[0_1px_0_#fff_inset]" />
                                </div>
                            ))}
                        </div>

                        {/* Componentes del modelo híbrido */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Layers className="w-4 h-4" /> Componentes del SIG como aplicación.
                            </h3>
                            <div className="grid md:grid-cols-4 gap-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <Smartphone className="w-20 h-auto mt-1" />
                                    <div>
                                        <div className="font-medium">Cliente PWA</div>
                                        <p className="text-slate-600 text-justify">
                                            Interfaz web progresiva que permite la interacción fluida entre cliente y prestador,
                                            permitiendo la búsqueda, visualización y solicitud de servicios en tiempo real.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Database className="w-20 h-4 mt-1" />
                                    <div>
                                        <div className="font-medium">Gestión de datos</div>
                                        <p className="text-slate-600 text-justify">
                                            DB persistente para el almacenamiento, gestión y control de datos alfanuméricos georreferenciados, permitiendo consultas rápidas y seguras.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Search className="w-20 h-auto mt-1" />
                                    <div>
                                        <div className="font-medium">Modelo de búsqueda geo-contextual</div>
                                        <p className="text-slate-600 text-justify">
                                            Modelo computacional basado en algoritmos híbridos que pondera cercanía, reputación y afinidad conductual para ordenar candidatos según pertinencia espacial y contextual.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Monitor className="w-20 h-auto mt-1" />
                                    <div>
                                        <div className="font-medium">Dashboard administrativo</div>
                                        <p className="text-slate-600 text-justify">
                                            Dashboard intuitivo de monitoreo que centraliza datos de uso, visualiza servicios en mapas de calor, analiza su distribución espacial y genera métricas simples para decisiones informadas.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Nota de alcance */}
                        <p className="text-xs text-slate-500">
                            Nota: Las actividades indicadas se enfocan en la planificación, construcción e integración del sistema. Cualquier
                            evaluación externa o piloto se gestionará fuera del alcance metodológico comprometido en esta sección.
                        </p>
                    </div>
                </div>
            </section>

            {/* MÉTODOS CUALITATIVOS */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Métodos cualitativos</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold">Entrevistas en profundidad</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            50 entrevistas semi-estructuradas con usuarios potenciales, expertos activos
                            y stakeholders. Duración 45-60 minutos. Análisis temático con NVivo.
                        </p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold">Grupos focales</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            8 sesiones con 6-8 participantes cada una. Moderadas por facilitadores
                            entrenados. Grabación audiovisual y transcripción verbatim.
                        </p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold">Observación participante</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Etnografía digital durante 6 meses. Análisis de interacciones en plataformas
                            similares y patrones de comportamiento no observables.
                        </p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold">Análisis de casos</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Estudio comparativo de 12 plataformas similares. Framework de análisis:
                            modelo de negocio, UX/UI, métricas de éxito, lecciones aprendidas.
                        </p>
                    </Card>
                </div>
            </section>

            {/* PROCESO DE DESARROLLO */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Proceso de desarrollo</h2>
                <div className="space-y-6">
                    {[
                        {
                            phase: "Fase 1: Discovery & Research",
                            duration: "3 meses",
                            activities: ["Benchmarking competitivo", "Entrevistas exploratorias", "Análisis de mercado", "Definición de MVP"],
                        },
                        {
                            phase: "Fase 2: Design & Prototype",
                            duration: "2 meses",
                            activities: ["Wireframes y mockups", "Prototipos interactivos", "Testing de usabilidad", "Validación de hipótesis"],
                        },
                        {
                            phase: "Fase 3: Development & Testing",
                            duration: "4 meses",
                            activities: ["Desarrollo iterativo", "A/B testing continuo", "Integración de analytics", "Optimización de performance"],
                        },
                        {
                            phase: "Fase 4: Launch & Scale",
                            duration: "3 meses",
                            activities: ["Beta testing", "Lanzamiento progresivo", "Monitoreo continuo", "Iteraciones basadas en datos"],
                        },
                    ].map((p, i) => (
                        <div key={i} className="flex flex-col gap-3 rounded-lg border p-6 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4CAF50] text-sm font-semibold text-white">
                                        {i + 1}
                                    </div>
                                    <h3 className="text-lg font-semibold">{p.phase}</h3>
                                </div>
                                <div className="text-sm text-[#4CAF50] font-medium">{p.duration}</div>
                                <ul className="text-sm text-muted-foreground">
                                    {p.activities.map((a, j) => (
                                        <li key={j}>• {a}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* VALIDACIÓN Y ÉTICA */}
            <section className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Validación de resultados</h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Triangulación de métodos (cuantitativo + cualitativo)</li>
                        <li>• Validación cruzada con stakeholders</li>
                        <li>• Análisis de sensibilidad y robustez</li>
                        <li>• Replicabilidad de experimentos</li>
                        <li>• Generalización a contextos similares</li>
                    </ul>
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Consideraciones éticas</h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Consentimiento informado en todas las fases</li>
                        <li>• Anonimización de datos personales</li>
                        <li>• Transparencia en algoritmos de matching</li>
                        <li>• Protección de datos sensibles</li>
                        <li>• Equidad en representación de grupos</li>
                    </ul>
                </div>
            </section>

            {/* CTA */}
            <section className="rounded-xl border bg-white p-6">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">¿Quieres ver el cronograma completo?</h3>
                        <p className="text-sm text-muted-foreground">
                            Explora las fases detalladas y hitos del proyecto.
                        </p>
                    </div>
                    <Link
                        href="/terminus/investigacion/cronograma"
                        className="inline-flex items-center rounded-md bg-[#4CAF50] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#43a047]"
                    >
                        Ver cronograma
                    </Link>
                </div>
            </section>
        </div>
    )
}
