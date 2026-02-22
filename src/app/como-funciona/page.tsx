import Link from "next/link";
import { ArrowLeft, Search, CheckCircle, Star, Briefcase, Handshake, MapPin, Zap } from "lucide-react";

export const metadata = {
    title: "Cómo funciona — Chambit",
    description: "Aprende cómo Chambit conecta clientes con expertos locales de manera rápida y segura.",
};

const CLIENT_STEPS = [
    {
        icon: Search,
        title: "1. Cuéntanos qué necesitas",
        desc: "Busca a un electricista, plomero, o cualquier otro experto cercano. Puedes explorar por categorías o escribir tu problema.",
    },
    {
        icon: MapPin,
        title: "2. Compara expertos locales",
        desc: "Revisa perfiles, cercanía, precios de referencia y reputación real de cada profesional.",
    },
    {
        icon: Handshake,
        title: "3. Cotiza y acuerda rápido",
        desc: "Sin intermediarios largos. Contacta a los expertos, acuerden el precio y fijen la visita directamente.",
    },
    {
        icon: Star,
        title: "4. Califica y mejora la comunidad",
        desc: "Tu experiencia cuenta. Califica el trabajo para ayudar a otros clientes a tomar buenas decisiones.",
    },
];

const EXPERT_STEPS = [
    {
        icon: Briefcase,
        title: "1. Completa tu perfil",
        desc: "Regístrate como usuario y activa tu perfil de experto. Cuéntanos qué haces y dónde trabajas.",
    },
    {
        icon: Zap,
        title: "2. Recibe solicitudes cercanas",
        desc: "Los clientes de tu ciudad te verán cuando necesiten los servicios que ofreces.",
    },
    {
        icon: Handshake,
        title: "3. Negocia directamente",
        desc: "Acuerda el precio según el mercado. Nosotros no te cobramos comisiones por conseguir el trabajo.",
    },
    {
        icon: CheckCircle,
        title: "4. Construye tu reputación",
        desc: "Gana reseñas positivas para subir de posición. Un buen trabajo se traduce en más clientes futuros.",
    },
];

const FAQS = [
    {
        q: "¿Chambit cobra alguna comisión por los servicios?",
        a: "No. En nuestra fase inicial, el uso de Chambit es libre de comisiones por encontrar o cerrar un trabajo. Queremos que el valor se quede entre el cliente y el experto.",
    },
    {
        q: "¿Cómo sé si un experto es responsable?",
        a: "En Chambit implementamos un sistema de reputación basado en trabajos reales. Las estrellas que ves no son casualidad, provienen de un balance cuidadoso de su historial.",
    },
    {
        q: "¿Qué pasa si hay un desacuerdo en el servicio?",
        a: "Chambit facilita la conexión, pero el acuerdo es directo entre ustedes. Animamos a ambas partes a comunicarse clara y oportunamente; los usuarios problemáticos verán afectada su escalada o serán suspendidos.",
    },
    {
        q: "¿Necesito tarjeta de crédito para buscar a alguien?",
        a: "No. La búsqueda de profesionales es gratuita y sin compromiso. Solo pagas al experto por el servicio acordado de la forma que pacten.",
    },
];

export default function ComoFuncionaPage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero */}
            <div className="bg-white border-b border-slate-100 px-6 py-12 md:py-20 text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto relative z-10">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-600 font-medium text-sm mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Volver al inicio
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
                        Simple, rápido y <span className="text-[#34af00]">sin fricción</span>
                    </h1>
                    <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Chambit está diseñado para que resolver tus problemas en casa o empezar a trabajar no sea un dolor de cabeza.
                    </p>
                </div>
                {/* Decorative blobs */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-12 md:mt-16 space-y-20">

                {/* Flow: Client */}
                <div>
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">¿Necesitas ayuda con algo?</h2>
                        <p className="text-slate-500 mt-2">Así es como encuentras al experto ideal en tu ciudad.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {CLIENT_STEPS.map((step, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative pt-10 hover:-translate-y-1 transition-transform">
                                <div className="absolute -top-6 left-6 w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                                    <step.icon className="w-6 h-6 text-[#34af00]" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 text-center">
                        <Link href="/search" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#34af00] text-white font-bold transition-transform hover:scale-105 shadow-md shadow-green-500/20">
                            Buscar un experto
                        </Link>
                    </div>
                </div>

                {/* Flow: Expert */}
                <div>
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">¿Eres un profesional independiente?</h2>
                        <p className="text-slate-500 mt-2">Te conectamos con vecinos que valoran el trabajo bien hecho.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {EXPERT_STEPS.map((step, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative pt-10 hover:-translate-y-1 transition-transform">
                                <div className="absolute -top-6 left-6 w-12 h-12 bg-[#0ea5e9]/10 rounded-2xl border border-[#0ea5e9]/20 flex items-center justify-center">
                                    <step.icon className="w-6 h-6 text-[#0ea5e9]" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 text-center">
                        <Link href="/onboarding" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border-2 border-[#0ea5e9] text-[#0ea5e9] font-bold transition-all hover:bg-[#0ea5e9]/5">
                            Quiero ofrecer servicios
                        </Link>
                    </div>
                </div>

                {/* Trust / FAQ */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 md:p-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Tus dudas resueltas</h2>
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                            {FAQS.map((faq, idx) => (
                                <div key={idx}>
                                    <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
