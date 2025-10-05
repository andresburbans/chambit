import Link from "next/link"
import { Metadata } from "next"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Planteamiento — Investigación Chambit",
    description: "Marco conceptual y planteamiento del problema que aborda Chambit en el mercado hiperlocal de servicios.",
}

export default function PlanteamientoPage() {
    return (
        <div className="space-y-12">
            {/* HERO */}
            <section className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-[#2E382E]">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#4CAF50]" />
                    Investigación
                </div>
                <h1 className="text-4xl font-bold leading-tight tracking-tight">
                    Planteamiento del problema
                </h1>
                <p className="max-w-3xl text-[15px] text-muted-foreground">
                    En un mundo donde la <strong>demanda de servicios locales</strong> crece exponencialmente,
                    existe una <strong>brecha crítica</strong> entre la necesidad de soluciones rápidas y confiables
                    y la capacidad actual de conexión entre usuarios y expertos calificados. Chambit aborda
                    esta problemática mediante un <strong>enfoque data-driven</strong> y <strong>tecnológico</strong>.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Mercado hiperlocal
                    </span>
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Asimetría de información
                    </span>
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                        Confianza y eficiencia
                    </span>
                </div>
            </section>

            {/* CONTEXTO DEL PROBLEMA */}
            <section className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold">Contexto actual</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Los servicios locales representan el 70% de las transacciones económicas en Latinoamérica,
                        pero la conexión entre demanda y oferta es ineficiente. Los usuarios recurren a recomendaciones
                        personales o búsquedas genéricas, mientras que los expertos luchan por visibilidad.
                    </p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-semibold">Problemática identificada</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Alta fricción en la búsqueda, falta de verificación de calidad, precios opacos,
                        y riesgo de malas experiencias. Esto genera desconfianza y limita el crecimiento
                        del mercado de servicios independientes.
                    </p>
                </Card>
            </section>

            {/* HIPÓTESIS Y OBJETIVOS */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Hipótesis central</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            t: "Conexión eficiente",
                            d: "Un algoritmo de matching geo-contextual puede reducir el tiempo de búsqueda en un 60%.",
                        },
                        {
                            t: "Confianza verificada",
                            d: "Sistemas de reputación progresiva aumentan la disposición a contratar en un 40%.",
                        },
                        {
                            t: "Precios transparentes",
                            d: "Límites de precios sugeridos basados en datos reducen disputas en un 50%.",
                        },
                        {
                            t: "Experiencia móvil",
                            d: "Una PWA optimizada incrementa la retención de usuarios en un 35%.",
                        },
                        {
                            t: "Impacto económico",
                            d: "Plataformas como Chambit pueden generar ingresos adicionales de $500-2000 mensuales por experto.",
                        },
                        {
                            t: "Escalabilidad regional",
                            d: "El modelo es replicable en múltiples ciudades con adaptación cultural mínima.",
                        },
                    ].map((h) => (
                        <Card key={h.t} className="p-5">
                            <h3 className="font-medium">{h.t}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{h.d}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ALCANCE Y LIMITACIONES */}
            <section className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Alcance del estudio</h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Análisis de mercado en 5 ciudades principales de Colombia</li>
                        <li>• Encuestas a 500+ usuarios potenciales y 200+ expertos</li>
                        <li>• Desarrollo de prototipos funcionales (MVP)</li>
                        <li>• Validación de hipótesis mediante experimentos controlados</li>
                        <li>• Métricas de engagement, conversión y satisfacción</li>
                    </ul>
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Limitaciones consideradas</h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Alcance inicial limitado a servicios no regulados</li>
                        <li>• Dependencia de adopción tecnológica en usuarios</li>
                        <li>• Variables económicas externas (inflación, desempleo)</li>
                        <li>• Competencia de plataformas internacionales</li>
                        <li>• Regulaciones locales de intermediación laboral</li>
                    </ul>
                </div>
            </section>

            {/* CTA */}
            <section className="rounded-xl border bg-white p-6">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">¿Interesado en la investigación?</h3>
                        <p className="text-sm text-muted-foreground">
                            Descarga nuestro paper completo sobre el planteamiento del problema.
                        </p>
                    </div>
                    <Link
                        href="/terminus/investigacion/justificacion"
                        className="inline-flex items-center rounded-md bg-[#4CAF50] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#43a047]"
                    >
                        Ver justificación
                    </Link>
                </div>
            </section>
        </div>
    )
}