import Link from "next/link";
import { ArrowLeft, Users, MapPin, Star, Zap, Shield, TrendingUp, Compass, Search } from "lucide-react";

export const metadata = {
    title: "Nosotros — Chambit",
    description: "Conoce la historia y misión de Chambit: conectar expertos locales con quienes los necesitan de forma rápida, segura y a precio justo.",
};

const stats = [
    { value: "30+", label: "categorías de servicio" },
    { value: "Cali", label: "primera ciudad" },
    { value: "0%", label: "comisiones iniciales" },
    { value: "100%", label: "verificados" },
];

const pillars = [
    {
        icon: MapPin,
        title: "Expertos a tu alcance",
        desc: "Te mostramos a los profesionales disponibles en tu zona. Reducimos el tiempo de espera porque quien te ayuda ya está cerca.",
        color: "#34af00",
    },
    {
        icon: Shield,
        title: "Confianza verificada",
        desc: "Nuestro sistema de reseñas no se basa en volumen, sino en consistencia. Cada cliente que califica construye el perfil real de los trabajadores.",
        color: "#0ea5e9",
    },
    {
        icon: TrendingUp,
        title: "Precios referenciados",
        desc: "Para que nadie cobre de más ni de menos. Nuestro Precio de Referencia de Calidad te guía para que el trato sea justo para ambas partes.",
        color: "#8b5cf6",
    },
    {
        icon: Zap,
        title: "Sin intermediarios largos",
        desc: "Chambit te contacta con el experto, pero ustedes arreglan el día, la hora y la forma de pago directo. Más libertad y menos fricción.",
        color: "#f59e0b",
    },
];

export default function NosotrosPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div
                className="relative px-6 pt-16 pb-24 text-white overflow-hidden text-center"
                style={{ background: "linear-gradient(135deg, #1e6e00 0%, #34af00 60%, #4acf10 100%)" }}
            >
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10" />
                <div className="absolute -left-12 bottom-0 w-40 h-40 rounded-full bg-white/5" />
                <div className="absolute right-1/3 top-1/2 w-20 h-20 rounded-full bg-white/5" />

                <div className="max-w-4xl mx-auto relative z-10">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white font-medium text-sm mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Volver al inicio
                    </Link>
                    <div className="mb-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white/95 text-xs font-semibold backdrop-blur-sm shadow-sm">
                            🌱 Hacemos equipo con Colombia
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight max-w-2xl mx-auto">
                        Nacimos para que contratar en Colombia sea <span className="text-yellow-300">simple y confiable.</span>
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                        Unimos a clientes y expertos locales bajo reglas claras, reputación transparente y un enfoque 100% hiperlocal.
                    </p>

                    {/* Dual CTA Header */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/search" className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-[#34af00] font-bold shadow-lg shadow-black/10 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                            <Search className="w-4 h-4" /> Buscar un experto
                        </Link>
                        <Link href="/onboarding" className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#1e6e00]/40 text-white font-bold backdrop-blur-md border border-white/20 hover:bg-[#1e6e00]/60 transition-colors flex items-center justify-center gap-2">
                            <Briefcase className="w-4 h-4" /> Ofrecer mis servicios
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats bar */}
            <div className="max-w-4xl mx-auto -mt-10 px-6 relative z-20">
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map(({ value, label }) => (
                        <div key={label} className="text-center">
                            <p className="text-3xl font-extrabold text-slate-900">{value}</p>
                            <p className="text-sm font-medium text-slate-500 mt-1">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-20 space-y-24">

                {/* 1. Misión / Resultados */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">¿Por qué usar Chambit?</h2>
                        <p className="text-slate-600 text-lg leading-relaxed mb-4">
                            Encontrar a un buen plomero o electricista dependía de a quién conocías. Los precios eran un misterio y la confianza era ciega. <strong>Chambit cambia todo eso.</strong>
                        </p>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Construimos una plataforma donde los trabajadores independientes de Cali crecen demostrando su talento continuo, y tú consigues arreglar tu casa rápidamente con precios del mercado real.
                        </p>
                    </div>
                    <div className="bg-green-50 rounded-3xl p-8 border border-green-100">
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-[#34af00] text-white flex items-center justify-center shrink-0">1</div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Encuentras más rápido</h4>
                                    <p className="text-sm text-slate-600 mt-1">Busca por necesidad y te conectamos con las personas que están a pocos kilómetros.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-[#34af00] text-white flex items-center justify-center shrink-0">2</div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Sabes cuánto pagar</h4>
                                    <p className="text-sm text-slate-600 mt-1">Nuestra herramienta de precios referenciados elimina las sorpresas y protege tu bolsillo.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Pillars / Cómo te protegemos */}
                <div>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">¿Cómo protegemos tu experiencia?</h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">Nuestro modelo se basa en la transparencia operativa. El éxito de uno es el éxito de todos.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {pillars.map(({ icon: Icon, title, desc, color }) => (
                            <div key={title} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 hover:-translate-y-1 transition-transform">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${color}15` }}>
                                    <Icon className="w-7 h-7" style={{ color }} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                                <p className="text-slate-600 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Expansión / Visión LATAM */}
                <div className="bg-slate-900 rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
                    <Compass className="w-64 h-64 text-slate-800 absolute -right-20 -top-20 opacity-50" />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-extrabold text-white mb-6">De Cali hacia toda Colombia</h2>
                        <p className="text-slate-300 text-lg leading-relaxed mb-10">
                            Nuestra prueba piloto y base de operaciones MVP se centra en Santiago de Cali, reuniendo a los mejores expertos del Valle del Cauca. Sin embargo, nuestra tecnología hiperlocal escala a todo el país. Queremos que nadie se quede sin solucionar sus tareas diarias.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/como-funciona" className="px-8 py-3.5 rounded-2xl bg-white text-slate-900 font-bold transition-transform hover:scale-105 shadow-xl shadow-black/20">
                                Ver cómo funciona
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Temporary for this file to resolve the Briefcase import quickly
function Briefcase(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
}
