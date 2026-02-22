import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
    title: "Política de Privacidad — Chambit",
    description: "Conoce cómo Chambit recolecta, usa y protege tu información personal.",
};

const sections = [
    {
        title: "1. Información que recolectamos",
        content: [
            "**Datos de cuenta:** nombre completo, número de cédula, correo electrónico, número de teléfono y año de nacimiento.",
            "**Datos de perfil:** foto de perfil, descripción profesional, nivel educativo y servicios ofrecidos (para expertos).",
            "**Datos de ubicación:** almacenamos una representación geohash de tu ubicación (tecnología H3) para conectarte con expertos cercanos. Nunca almacenamos tus coordenadas GPS exactas de forma permanente.",
            "**Datos de uso:** búsquedas realizadas, solicitudes creadas y calificaciones emitidas.",
            "**Datos de dispositivo:** token FCM para notificaciones push (solo si autorizas las notificaciones).",
        ],
    },
    {
        title: "2. Cómo usamos tu información",
        content: [
            "Para crear y gestionar tu cuenta en Chambit.",
            "Para conectarte con expertos cercanos según tu ubicación y necesidades.",
            "Para calcular el ranking y pertinencia de expertos en tu zona.",
            "Para enviarte notificaciones push sobre solicitudes, ofertas y calificaciones.",
            "Para garantizar la seguridad de la plataforma y prevenir fraudes.",
            "Para comunicaciones transaccionales (confirmaciones, actualizaciones de estado de solicitudes).",
        ],
    },
    {
        title: "3. Con quién compartimos tu información",
        content: [
            "**Con otros usuarios:** tu nombre y foto son visibles para los expertos con quienes interactúas. Tu número de teléfono solo se revela cuando existe un MATCH aceptado.",
            "**Con Firebase (Google):** utilizamos Firebase Authentication, Firestore y Cloud Functions para operar la plataforma. Google actúa como procesador de datos bajo nuestras instrucciones.",
            "**Con autoridades:** cuando así lo exija la ley colombiana vigente.",
            "No vendemos, alquilamos ni comercializamos tu información personal con terceros.",
        ],
    },
    {
        title: "4. Seguridad",
        content: [
            "Tus datos están protegidos por las reglas de seguridad de Firestore que impiden el acceso no autorizado.",
            "Firebase App Check protege nuestra API contra accesos no legítimos.",
            "Las contraseñas nunca se almacenan — Firebase Authentication gestiona la autenticación de forma segura.",
            "La ubicación se almacena como índice geohash (H3 resolución 9, ~170m de precisión), no como coordenadas exactas.",
        ],
    },
    {
        title: "5. Tus derechos",
        content: [
            "**Acceso:** puedes consultar los datos que tenemos sobre ti desde tu perfil en la app.",
            "**Rectificación:** puedes actualizar tu nombre, foto, teléfono y otros datos desde la sección de Perfil.",
            "**Eliminación:** puedes solicitar la eliminación de tu cuenta y todos tus datos escribiéndonos a soporte@chambit.co.",
            "**Portabilidad:** puedes solicitar una copia de tus datos en formato estructurado.",
            "**Revocación del consentimiento:** puedes desactivar las notificaciones push desde la configuración de tu dispositivo.",
        ],
    },
    {
        title: "6. Retención de datos",
        content: [
            "Conservamos tus datos mientras tu cuenta esté activa.",
            "Las solicitudes y calificaciones se conservan por un período mínimo de 2 años para garantizar la integridad del sistema de reputación.",
            "Tras la eliminación de cuenta, los datos se anonimizarán en 30 días.",
        ],
    },
    {
        title: "7. Menores de edad",
        content: [
            "Chambit está dirigido exclusivamente a personas mayores de 18 años. No recolectamos conscientemente información de menores. Si detectamos una cuenta de menor de edad, procederemos a su eliminación inmediata.",
        ],
    },
    {
        title: "8. Cambios a esta política",
        content: [
            "Podemos actualizar esta política cuando sea necesario. Te notificaremos por correo electrónico o mediante un aviso visible en la app cuando hagamos cambios materiales.",
        ],
    },
];

export default function PrivacidadPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero */}
            <div
                className="relative px-6 pt-14 pb-14 text-white overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)" }}
            >
                <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10" />
                <div className="max-w-3xl mx-auto relative">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio
                    </Link>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white/80 text-sm font-medium">Política de Privacidad</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Tu privacidad es nuestra prioridad</h1>
                    <p className="text-white/75 text-sm">
                        Última actualización: {new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 text-blue-800 text-sm leading-relaxed">
                    Esta política describe cómo <strong>Chambit</strong> (operado en Colombia) recolecta, usa y protege tu información personal cuando usas nuestra plataforma de conexión entre clientes y expertos locales.
                </div>

                {sections.map((section) => (
                    <div key={section.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h2 className="text-base font-bold text-slate-900 mb-4">{section.title}</h2>
                        <ul className="space-y-2.5">
                            {section.content.map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#34af00] mt-2 shrink-0" />
                                    <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-sm text-slate-600 mb-3">¿Tienes preguntas sobre tu privacidad?</p>
                    <Link
                        href="/contacto"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                    >
                        Contactar soporte
                    </Link>
                </div>
            </div>
        </div>
    );
}