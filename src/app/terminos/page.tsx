import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
    title: "Términos y Condiciones — Chambit",
    description: "Lee los términos y condiciones de uso de la plataforma Chambit.",
};

const sections = [
    {
        title: "1. Aceptación de los términos",
        content: [
            "Al crear una cuenta o usar la plataforma Chambit, aceptas los presentes Términos y Condiciones en su totalidad.",
            "Si no estás de acuerdo con alguna parte de estos términos, deberás abstenerte de usar la plataforma.",
            "Chambit se reserva el derecho de modificar estos términos con previo aviso. La continuación del uso después de la notificación implica aceptación.",
        ],
    },
    {
        title: "2. Elegibilidad y cuenta",
        content: [
            "Para usar Chambit debes ser mayor de 18 años y tener capacidad legal para contratar conforme a la ley colombiana.",
            "La información que provees al registrarte debe ser veraz, completa y actualizada.",
            "Eres responsable de la confidencialidad de tu contraseña y de todas las actividades que ocurran en tu cuenta.",
            "Chambit puede suspender o eliminar cuentas que incumplan estos términos, utilicen información falsa o realicen actividades fraudulentas.",
        ],
    },
    {
        title: "3. Roles: clientes y expertos",
        content: [
            "**Clientes** son usuarios que buscan servicios y realizan solicitudes de cotización.",
            "**Expertos** son usuarios que ofrecen servicios profesionales y responden a solicitudes de clientes.",
            "Un usuario puede actuar como cliente y experto simultáneamente.",
            "Los expertos son responsables de la calidad, seguridad y legalidad de los servicios que ofrecen.",
            "Chambit no verifica formalmente las certificaciones o títulos de los expertos; la verificación de credenciales es responsabilidad de las partes.",
        ],
    },
    {
        title: "4. Proceso de solicitud y MATCH",
        content: [
            "Los clientes envían solicitudes de cotización que incluyen descripción del problema y precio ofrecido.",
            "El precio mínimo ofrecido por un cliente debe ser igual o superior al 80% del Precio de Referencia de Calidad (PRC) de la subcategoría.",
            "Los expertos pueden aceptar, rechazar o contra-ofertar. Se permiten máximo 3 rondas de negociación.",
            "El MATCH ocurre cuando ambas partes llegan a un acuerdo. En ese momento se comparten los datos de contacto.",
            "Una vez aceptado el servicio, el cliente y el experto son responsables de coordinar y ejecutar el servicio directamente.",
        ],
    },
    {
        title: "5. Precio de Referencia de Calidad (PRC)",
        content: [
            "El PRC es un precio de referencia calculado automáticamente por Chambit basado en las calificaciones reales de los expertos en cada subcategoría.",
            "El PRC es orientativo y no constituye un precio fijo ni regulado.",
            "Chambit actualiza el PRC periódicamente en función de las transacciones realizadas en la plataforma.",
        ],
    },
    {
        title: "6. Calificaciones y reputación",
        content: [
            "Los clientes pueden calificar a los expertos después de cada servicio completado (1 a 5 estrellas).",
            "Las calificaciones deben ser honestas y basadas en la experiencia real.",
            "Chambit se reserva el derecho de eliminar calificaciones fraudulentas, falsas o que violen estas políticas.",
            "La reputación de los expertos se calcula mediante un sistema bayesiano que pondera la cantidad y calidad de las calificaciones.",
        ],
    },
    {
        title: "7. Prohibiciones",
        content: [
            "Está prohibido ofrecer servicios ilegales, peligrosos o que violen la ley colombiana.",
            "Está prohibido publicar información falsa, engañosa o que pueda perjudicar a terceros.",
            "Está prohibido el uso de bots, scrapers o cualquier automatización no autorizada.",
            "Está prohibido acosar, amenazar o discriminar a otros usuarios de la plataforma.",
            "Está prohibido intentar evadir el sistema de pagos o generar transacciones fuera de la plataforma para evitar calificaciones.",
        ],
    },
    {
        title: "8. Responsabilidad de Chambit",
        content: [
            "Chambit es una plataforma de intermediación y no es parte del contrato de servicios entre clientes y expertos.",
            "Chambit no garantiza la calidad, puntualidad o resultado de los servicios contratados a través de la plataforma.",
            "En la medida permitida por la ley colombiana, Chambit no se hace responsable por daños indirectos, incidentales o emergentes.",
            "Chambit no es responsable por los acuerdos, pagos o disputas que ocurran directamente entre clientes y expertos fuera de la plataforma.",
        ],
    },
    {
        title: "9. Propiedad intelectual",
        content: [
            "Todo el contenido, diseño, código, logotipos y materiales de Chambit son propiedad exclusiva de Chambit y están protegidos por las leyes de propiedad intelectual.",
            "Los usuarios retienen los derechos sobre el contenido que publican, pero otorgan a Chambit una licencia no exclusiva para mostrar dicho contenido en la plataforma.",
        ],
    },
    {
        title: "10. Ley aplicable y jurisdicción",
        content: [
            "Estos términos se rigen por las leyes de la República de Colombia.",
            "Cualquier disputa será resuelta de buena fe mediante negociación directa. Si no hay acuerdo, se acudirá a los tribunales competentes de la ciudad de Cali, Colombia.",
        ],
    },
];

export default function TerminosPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero */}
            <div
                className="relative px-6 pt-14 pb-14 text-white overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)" }}
            >
                <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/5" />
                <div className="max-w-3xl mx-auto relative">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio
                    </Link>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white/70 text-sm font-medium">Términos y Condiciones</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Términos y Condiciones de uso</h1>
                    <p className="text-white/70 text-sm">
                        Última actualización: {new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm leading-relaxed">
                    <strong>Importante:</strong> Al usar Chambit aceptas estos términos. Lee también nuestra{" "}
                    <Link href="/privacidad" className="underline font-semibold hover:text-amber-900">Política de Privacidad</Link>.
                </div>

                {sections.map((section) => (
                    <div key={section.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h2 className="text-base font-bold text-slate-900 mb-4">{section.title}</h2>
                        <ul className="space-y-2.5">
                            {section.content.map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                                    <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-800">$1</strong>') }} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                    <Link href="/privacidad" className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#34af00] hover:shadow-sm transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <span className="text-lg">🔒</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-[#34af00] transition-colors">Política de Privacidad</p>
                            <p className="text-xs text-slate-400">Cómo protegemos tus datos</p>
                        </div>
                    </Link>
                    <Link href="/contacto" className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#34af00] hover:shadow-sm transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                            <span className="text-lg">💬</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-[#34af00] transition-colors">¿Tienes dudas?</p>
                            <p className="text-xs text-slate-400">Contacta con soporte</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}