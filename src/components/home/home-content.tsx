"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    ChevronRight,
    Star,
    Zap,
    ArrowRight,
    X,
    Shield,
    Clock,
    Eye,
    MessageCircle,
    CheckCircle2,
    Users,
    Sparkles,
} from "lucide-react";

import Link from "next/link";
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURED_CATEGORIES = [
    { id: "cat-reparacion", label: "Reparación", emoji: "🔧", color: "#FFF3E0", accent: "#FF9800" },
    { id: "cat-construccion", label: "Construcción", emoji: "🏗️", color: "#E8F5E9", accent: "#4CAF50" },
    { id: "cat-limpieza", label: "Limpieza", emoji: "✨", color: "#E3F2FD", accent: "#2196F3" },
    { id: "cat-cuidado", label: "Cuidado", emoji: "💚", color: "#FCE4EC", accent: "#E91E63" },
    { id: "cat-belleza", label: "Belleza", emoji: "💅", color: "#F3E5F5", accent: "#9C27B0" },
    { id: "cat-mecanica", label: "Mecánica", emoji: "🚗", color: "#E0F7FA", accent: "#00BCD4" },
    { id: "cat-tecnologia", label: "Tecnología", emoji: "💻", color: "#EDE7F6", accent: "#673AB7" },
    { id: "cat-otras", label: "Más", emoji: "⚡", color: "#FFF8E1", accent: "#FFC107" },
];

const QUICK_SEARCHES = ["Electricista", "Plomero", "Pintor", "Limpieza", "Enfermera", "Mecánico"];

const HOME_STEPS = [
    {
        icon: Search,
        title: "Cuéntanos qué necesitas",
        description:
            "Escribe el servicio que buscas, elige categoría y ciudad. En segundos recibirás opciones.",
        tag: "Paso 1",
        color: "#E8F5E9",
        accent: "#34af00",
    },
    {
        icon: CheckCircle2,
        title: "Compara perfiles verificados",
        description:
            "Revisa experiencia, calificaciones, precios y radio de cobertura de cada profesional.",
        tag: "Paso 2",
        color: "#E3F2FD",
        accent: "#2196F3",
    },
    {
        icon: MessageCircle,
        title: "Agenda con confianza",
        description:
            "Habla directo con el experto, acuerda el trabajo y coordina horario fácilmente.",
        tag: "Paso 3",
        color: "#FFF3E0",
        accent: "#FF9800",
    },
];

const VALUE_POINTS = [
    {
        icon: Clock,
        title: "Más rápido",
        body: "Encuentra opciones en minutos, no en días. Sin llamadas perdidas ni esperas.",
        stat: "~5 min",
        statLabel: "para recibir opciones",
    },
    {
        icon: Shield,
        title: "Más seguro",
        body: "Perfiles con reputación, reseñas reales y proceso de validación de identidad.",
        stat: "100%",
        statLabel: "perfiles verificados",
    },
    {
        icon: Eye,
        title: "Más claro",
        body: "Precios, calificaciones y experiencia visibles antes de contratar. Sin sorpresas.",
        stat: "4.8★",
        statLabel: "satisfacción promedio",
    },
];

const STATS = [
    { value: "+500", label: "Expertos verificados" },
    { value: "+2,000", label: "Servicios completados" },
    { value: "4.8★", label: "Satisfacción promedio" },
];

// ─── Inline Search Modal (Mobile) ─────────────────────────────────────────────

const MODAL_CATEGORIES = [
    { id: "cat-reparacion", label: "Reparación", emoji: "🔧" },
    { id: "cat-construccion", label: "Construcción", emoji: "🏗️" },
    { id: "cat-limpieza", label: "Limpieza", emoji: "✨" },
    { id: "cat-cuidado", label: "Cuidado", emoji: "💚" },
    { id: "cat-belleza", label: "Belleza", emoji: "💅" },
    { id: "cat-mecanica", label: "Mecánica", emoji: "🚗" },
    { id: "cat-tecnologia", label: "Tecnología", emoji: "💻" },
    { id: "cat-otras", label: "Más servicios", emoji: "⚡" },
];

const TRENDING = ["Electricista", "Plomero", "Pintor", "Limpieza", "Mecánico"];

function SearchModal({ onClose }: { onClose: () => void }) {
    const router = useRouter();
    const [q, setQ] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const go = (searchQuery: string, cat?: string) => {
        const trimmed = searchQuery.trim();
        // Only navigate if we have a query OR a category
        if (!trimmed && !cat) return;
        const params = new URLSearchParams();
        if (trimmed) params.set("q", trimmed);
        if (cat) params.set("cat", cat);
        router.push(`/search?${params.toString()}`);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="fixed top-0 left-0 right-0 z-50 bg-white rounded-b-3xl shadow-2xl md:top-16 md:left-1/2 md:-translate-x-1/2 md:w-[560px] md:rounded-3xl md:mt-4"
                style={{
                    animation: "slideDown .25s cubic-bezier(0.32,0.72,0,1)",
                }}
            >
                {/* Search input row */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100">
                    <div className="flex-1 flex items-center gap-2 h-12 px-4 rounded-2xl bg-slate-100">
                        <Search className="w-5 h-5 text-slate-400 shrink-0" />
                        <input
                            ref={inputRef}
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && go(q)}
                            placeholder="¿Qué necesitas? ej. electricista..."
                            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                        />
                        {q && (
                            <button onClick={() => setQ("")}>
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0"
                    >
                        <X className="w-4 h-4 text-slate-600" />
                    </button>
                </div>

                {/* Trending */}
                <div className="px-4 pt-3 pb-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                        Búsquedas frecuentes
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        {TRENDING.map((t) => (
                            <button
                                key={t}
                                onClick={() => go(t)}
                                className="px-3 py-1.5 rounded-full text-sm border border-slate-200 bg-white text-slate-700 hover:border-[#34af00] hover:text-[#34af00] transition-all"
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Categories */}
                <div className="px-4 pt-2 pb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                        Explorar categorías
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                        {MODAL_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => go("", cat.id)}
                                className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-slate-50 hover:bg-green-50 hover:border-[#34af00]/30 border border-transparent transition-all"
                            >
                                <span className="text-2xl">{cat.emoji}</span>
                                <span className="text-[10px] font-semibold text-slate-700 text-center leading-tight">
                                    {cat.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search CTA — only when there's text */}
                {q.trim() && (
                    <div className="px-4 pb-5">
                        <button
                            onClick={() => go(q)}
                            className="w-full h-12 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95"
                            style={{
                                background: "linear-gradient(135deg, #34af00, #2d9600)",
                                boxShadow: "0 4px 20px rgba(52,175,0,.3)",
                            }}
                        >
                            <Search className="w-5 h-5" /> Buscar &quot;{q.trim()}&quot;
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @media (min-width: 768px) {
          @keyframes slideDown {
            from {
              transform: translateX(-50%) translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateX(-50%) translateY(0);
              opacity: 1;
            }
          }
        }
      `}</style>
        </>
    );
}

// ─── Search bar trigger (used in mobile hero) ─────────────────────────────────

export function HomeSearchBar({ className = "" }: { className?: string }) {
    const [open, setOpen] = useState(false);
    // Detect if the bar is being rendered on a white/light background (overridden via className)
    const isLight = className.includes("!bg-white");
    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={`w-full flex items-center gap-3 px-5 h-16 rounded-2xl text-left transition-all ${isLight
                    ? "bg-white border border-slate-200 shadow-lg hover:shadow-xl"
                    : "bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30"
                    } ${className}`}
            >
                <Search className={`w-5 h-5 shrink-0 ${isLight ? "text-slate-400" : "text-white/80"}`} />
                <span className={`text-sm flex-1 ${isLight ? "text-slate-400" : "text-white/80"}`}>
                    Electricista, plomero, pintor...
                </span>
            </button>
            {open && <SearchModal onClose={() => setOpen(false)} />}
        </>
    );
}

// ─── Intersection Observer for fade-in animations ─────────────────────────────

function useFadeIn() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    obs.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return {
        ref,
        style: {
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        } as React.CSSProperties,
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE COMPONENTS (< md)
// ═══════════════════════════════════════════════════════════════════════════════

export function HomeMobileHeader() {
    return (
        <div
            className="px-5 pt-10 pb-8 md:hidden relative overflow-hidden"
            style={{
                background: "linear-gradient(135deg, #0d4700 0%, #1a6b00 40%, #34af00 100%)",
            }}
        >
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5" />

            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Tagline */}
                <h1 className="text-3xl font-extrabold leading-tight mb-6 tracking-tight">
                    <span className="text-green-300">Si hay chamba,</span>{" "}
                    <br />
                    <span className="text-white font-extrabold">hay Chambit.</span>
                </h1>

                {/* Search bar — white background matching desktop */}
                <HomeSearchBar className="!bg-white !border-white/0 shadow-lg" />

                {/* Quick tags */}
                <div className="flex gap-2 mt-4 flex-wrap justify-center">
                    {QUICK_SEARCHES.slice(0, 4).map((q) => (
                        <span
                            key={q}
                            className="px-2.5 py-1 rounded-full text-xs bg-white/15 text-green-100 backdrop-blur-sm border border-white/10"
                        >
                            {q}
                        </span>
                    ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-6 pt-5 border-t border-white/10 w-full justify-center">
                    {STATS.map((s) => (
                        <div key={s.label} className="text-center flex-1">
                            <p className="text-lg font-extrabold text-white">{s.value}</p>
                            <p className="text-[10px] text-green-200/80 leading-tight">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function HomeCategoryGrid() {
    const router = useRouter();
    const fade = useFadeIn();
    return (
        <div ref={fade.ref} style={fade.style} className="mt-6 px-4 md:hidden">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-slate-900">
                    Servicios más buscados
                </h2>
                <Link
                    href="/search"
                    className="text-xs text-[#34af00] font-semibold flex items-center gap-0.5"
                >
                    Ver todos <ChevronRight className="w-3.5 h-3.5" />
                </Link>
            </div>
            {/* 2×2 featured */}
            <div className="grid grid-cols-2 gap-2.5 mb-3">
                {FEATURED_CATEGORIES.slice(0, 4).map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => router.push(`/search?cat=${cat.id}`)}
                        className="flex flex-col items-start p-4 rounded-2xl transition-all active:scale-95 hover:shadow-md"
                        style={{ background: cat.color }}
                    >
                        <span className="text-3xl mb-2">{cat.emoji}</span>
                        <span className="text-sm font-bold text-slate-800">
                            {cat.label}
                        </span>
                    </button>
                ))}
            </div>
            {/* Horizontal scroll */}
            <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
                {FEATURED_CATEGORIES.slice(4).map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => router.push(`/search?cat=${cat.id}`)}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl shrink-0 w-[72px] transition-all active:scale-95"
                        style={{ background: cat.color }}
                    >
                        <span className="text-2xl">{cat.emoji}</span>
                        <span className="text-[10px] font-semibold text-slate-700 text-center leading-tight">
                            {cat.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export function HomeQuickSearches() {
    const router = useRouter();
    return (
        <div className="mt-5 px-4 md:hidden">
            <h2 className="text-base font-bold text-slate-900 mb-3">
                <Zap className="inline w-4 h-4 text-[#34af00] mr-1" />
                Búsquedas frecuentes
            </h2>
            <div className="flex gap-2 flex-wrap">
                {QUICK_SEARCHES.map((q) => (
                    <button
                        key={q}
                        onClick={() =>
                            router.push(`/search?q=${encodeURIComponent(q)}`)
                        }
                        className="px-3 py-1.5 rounded-full text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:border-[#34af00] hover:text-[#34af00] transition-all active:scale-95"
                    >
                        {q}
                    </button>
                ))}
            </div>
        </div>
    );
}

export function HomeHowItWorks() {
    const fade = useFadeIn();
    return (
        <div
            ref={fade.ref}
            style={{ ...fade.style, background: "#f8fafc" }}
            className="mt-6 px-4 py-6 md:hidden"
        >
            <h2 className="text-lg font-bold text-slate-900 mb-1">
                Así de fácil funciona Chambit
            </h2>
            <p className="text-sm text-slate-500 mb-5">
                En 3 pasos encuentras al profesional que necesitas
            </p>
            <div className="space-y-3">
                {HOME_STEPS.map((step) => {
                    const Icon = step.icon;
                    return (
                        <div
                            key={step.title}
                            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex gap-4 items-start"
                        >
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: step.color }}
                            >
                                <Icon className="w-5 h-5" style={{ color: step.accent }} />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wide mb-0.5" style={{ color: step.accent }}>
                                    {step.tag}
                                </p>
                                <p className="text-sm font-bold text-slate-900 mb-1">
                                    {step.title}
                                </p>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function HomeValueProps() {
    const fade = useFadeIn();
    return (
        <div
            ref={fade.ref}
            style={fade.style}
            className="mt-0 px-4 py-6 md:hidden"
        >
            <h2 className="text-lg font-bold text-slate-900 mb-1">
                ¿Por qué miles eligen Chambit?
            </h2>
            <p className="text-sm text-slate-500 mb-4">
                Más que un directorio, somos tu aliado
            </p>
            <div className="grid grid-cols-1 gap-3">
                {VALUE_POINTS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm flex gap-4 items-start"
                        >
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5 text-[#34af00]" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold text-slate-900">
                                        {item.title}
                                    </p>
                                    <span className="text-xs font-bold text-[#34af00]">
                                        {item.stat}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">{item.body}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function HomeNearbySection() {
    const [experts, setExperts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const fade = useFadeIn();

    useEffect(() => {
        async function fetchFeatured() {
            try {
                const q = query(
                    collection(db, "users"),
                    where("role", "==", "both"),
                    orderBy("expert.rating", "desc"),
                    limit(3)
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setExperts(data);
            } catch (error) {
                console.error("Error fetching featured experts:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeatured();
    }, []);

    return (
        <div ref={fade.ref} style={fade.style} className="mt-2 px-4 mb-4 md:hidden">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-slate-900">
                    🏆 Mejor calificados
                </h2>
                <Link
                    href="/search"
                    className="text-xs text-[#34af00] font-semibold flex items-center gap-0.5"
                >
                    Ver más <ChevronRight className="w-3.5 h-3.5" />
                </Link>
            </div>
            <div className="flex flex-col gap-3">
                {loading ? (
                    <div className="text-sm text-center text-slate-500 py-4 opacity-50">
                        Cargando profesionales...
                    </div>
                ) : (
                    experts.map((expert) => (
                        <Link key={expert.id} href={`/search?expert=${expert.id}`}>
                            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all active:scale-[0.98]">
                                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                                    <img
                                        src={expert.avatarUrl}
                                        alt={expert.firstName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-bold text-slate-900 truncate">
                                            {expert.displayName}
                                        </p>
                                        {expert.expert?.verified && (
                                            <span className="shrink-0 w-4 h-4 rounded-full bg-[#34af00] flex items-center justify-center">
                                                <span className="text-white text-[8px] font-bold">
                                                    ✓
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">
                                        {expert.expert?.subcategoryName}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center gap-0.5">
                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                            <span className="text-xs font-semibold text-slate-700">
                                                {expert.expert?.rating?.toFixed(1) || "N/A"}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                ({expert.expert?.ratingCount || 0})
                                            </span>
                                        </div>
                                        <span className="text-slate-300">·</span>
                                        <span className="text-xs text-slate-500 truncate max-w-[80px]">
                                            📍 ~{expert.expert?.coverageRadiusKm || 5} km
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-bold text-[#34af00]">
                                        Desde $
                                        {expert.expert?.priceMin?.toLocaleString("es-CO")}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}

// Mobile CTA banner
function MobileCTABanner() {
    const fade = useFadeIn();
    return (
        <div
            ref={fade.ref}
            style={fade.style}
            className="mx-4 mb-6 md:hidden"
        >
            <div
                className="rounded-3xl p-6 text-white relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #0d4700 0%, #1a6b00 40%, #34af00 100%)",
                }}
            >
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
                <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5" />

                <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-2">
                        ¿Eres un profesional?
                    </h3>
                    <p className="text-sm text-green-100/80 mb-4">
                        Únete a Chambit y consigue clientes en tu zona. Miles de personas buscan tus servicios ahora mismo.
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#1a6b00] rounded-xl text-sm font-bold transition-all active:scale-95 hover:shadow-lg"
                    >
                        Registrarme como experto <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESKTOP LAYOUT (≥ md)
// ═══════════════════════════════════════════════════════════════════════════════

export function HomeDesktopLayout() {
    const router = useRouter();
    const [desktopQuery, setDesktopQuery] = useState("");

    const [experts, setExperts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeatured() {
            try {
                const q = query(
                    collection(db, "users"),
                    where("role", "==", "both"),
                    orderBy("expert.rating", "desc"),
                    limit(6)
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setExperts(data);
            } catch (error) {
                console.error("Error fetching featured experts:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeatured();
    }, []);

    const goToSearchFromDesktop = () => {
        const term = desktopQuery.trim();
        if (!term) return; // ← FIX: do NOT navigate with empty query
        router.push(`/search?q=${encodeURIComponent(term)}`);
    };

    return (
        <div className="hidden md:block min-h-screen">
            {/* ═══ SECTION 1: HERO ═══ */}
            <section
                className="relative overflow-hidden"
                style={{
                    background:
                        "linear-gradient(135deg, #0d4700 0%, #1a6b00 35%, #258c00 65%, #34af00 100%)",
                }}
            >
                {/* Decorative elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 right-[10%] w-[500px] h-[500px] rounded-full bg-white/[0.03]" />
                    <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-white/[0.03]" />
                    <div className="absolute top-1/2 right-[30%] w-4 h-4 rounded-full bg-green-300/20" />
                    <div className="absolute top-[20%] right-[20%] w-3 h-3 rounded-full bg-green-200/15" />
                    <div className="absolute bottom-[30%] right-[15%] w-2 h-2 rounded-full bg-white/10" />
                </div>

                <div className="max-w-7xl mx-auto px-8 py-20 lg:py-28 relative z-10">
                    {/* Centred hero column */}
                    <div className="flex flex-col items-center text-center">

                        {/* Tagline H1 */}
                        <h1 className="text-4xl lg:text-[60px] font-extrabold leading-[1.1] tracking-tight mb-8">
                            <span className="text-green-300">Si hay chamba,</span>{" "}
                            <span className="text-white font-extrabold">hay Chambit.</span>
                        </h1>

                        {/* ── Desktop Search Bar — 1.3× bigger ── */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                goToSearchFromDesktop();
                            }}
                            className="flex items-center gap-0 w-full max-w-2xl h-[72px] rounded-2xl bg-white shadow-lg shadow-black/10 overflow-hidden transition-all group hover:shadow-xl"
                        >
                            <div className="flex items-center gap-3 flex-1 px-6 h-full">
                                <Search className="w-6 h-6 text-slate-400 group-focus-within:text-[#34af00] transition-colors shrink-0" />
                                <input
                                    value={desktopQuery}
                                    onChange={(e) => setDesktopQuery(e.target.value)}
                                    placeholder="Escribe el servicio: electricista, plomero, pintor..."
                                    className="flex-1 h-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-lg"
                                    aria-label="Buscar expertos por servicio"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!desktopQuery.trim()}
                                className="h-full px-9 text-white font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #34af00, #2d9600)",
                                }}
                            >
                                Buscar
                            </button>
                        </form>

                        {/* Quick searches */}
                        <div className="flex gap-2 mt-5 flex-wrap justify-center">
                            <span className="text-xs text-green-300/60 font-medium pt-1">
                                Frecuentes:
                            </span>
                            {QUICK_SEARCHES.map((q) => (
                                <button
                                    key={q}
                                    onClick={() =>
                                        router.push(
                                            `/search?q=${encodeURIComponent(q)}`
                                        )
                                    }
                                    className="px-3 py-1 rounded-full text-sm border border-white/15 bg-white/10 text-green-100 hover:bg-white/20 hover:border-white/30 transition-all backdrop-blur-sm"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center gap-12 mt-10 pt-6 border-t border-white/10">
                            {STATS.map((s) => (
                                <div key={s.label} className="text-center">
                                    <p className="text-2xl font-extrabold text-white">
                                        {s.value}
                                    </p>
                                    <p className="text-xs text-green-200/60">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 2: CATEGORIES ═══ */}
            <section className="bg-white py-14">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
                                Servicios más buscados
                            </h2>
                            <p className="text-base text-slate-500 mt-1">
                                Explora las categorías más populares
                            </p>
                        </div>
                        <Link
                            href="/search"
                            className="text-sm text-[#34af00] font-semibold flex items-center gap-1 hover:underline"
                        >
                            Ver todos <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-4 gap-5">
                        {FEATURED_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() =>
                                    router.push(`/search?cat=${cat.id}`)
                                }
                                className="group flex flex-col items-center gap-4 py-10 px-6 rounded-3xl transition-all hover:scale-105 hover:shadow-xl border border-transparent hover:border-slate-200"
                                style={{ background: cat.color }}
                            >
                                <span className="text-6xl group-hover:scale-110 transition-transform">
                                    {cat.emoji}
                                </span>
                                <span className="text-base font-bold text-slate-800">
                                    {cat.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 3: HOW IT WORKS ═══ */}
            <section className="bg-[#f8fafc] py-14 lg:py-20">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-[#34af00] text-sm font-semibold mb-4">
                            <Sparkles className="w-4 h-4" />
                            Así de simple
                        </div>
                        <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-3">
                            ¿Cómo funciona Chambit?
                        </h2>
                        <p className="text-base lg:text-lg text-slate-500 max-w-2xl mx-auto">
                            En 3 pasos encuentras al profesional que necesitas. Sin
                            complicaciones, sin largas esperas.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
                        {HOME_STEPS.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={step.title}
                                    className="relative bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                                >
                                    {/* Step number */}
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-5"
                                        style={{
                                            background: `linear-gradient(135deg, ${step.accent}, ${step.accent}cc)`,
                                        }}
                                    >
                                        {i + 1}
                                    </div>

                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                                        style={{ background: step.color }}
                                    >
                                        <Icon
                                            className="w-7 h-7"
                                            style={{ color: step.accent }}
                                        />
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        {step.description}
                                    </p>

                                    {/* Connector line (not on last) */}
                                    {i < HOME_STEPS.length - 1 && (
                                        <div className="hidden lg:block absolute top-16 -right-4 lg:-right-4 w-8 border-t-2 border-dashed border-slate-200" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 4: VALUE PROPS ═══ */}
            <section
                className="py-14 lg:py-20 relative overflow-hidden"
                style={{
                    background:
                        "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)",
                }}
            >
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-3">
                            ¿Por qué miles eligen Chambit?
                        </h2>
                        <p className="text-base lg:text-lg text-slate-600 max-w-2xl mx-auto">
                            Más que un directorio. Tu aliado para resolver servicios del mundo
                            real con profesionales de confianza.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {VALUE_POINTS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.title}
                                    className="bg-white rounded-3xl p-6 lg:p-8 border border-green-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-7 h-7 text-[#34af00]" />
                                    </div>
                                    <div className="text-2xl lg:text-3xl font-extrabold text-[#34af00] mb-1">
                                        {item.stat}
                                    </div>
                                    <p className="text-xs text-slate-400 mb-3">
                                        {item.statLabel}
                                    </p>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        {item.body}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 5: FEATURED EXPERTS ═══ */}
            <section className="bg-white py-14 lg:py-20">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
                                🏆 Profesionales mejor calificados
                            </h2>
                            <p className="text-base text-slate-500 mt-1">
                                Expertos verificados y con las mejores reseñas
                            </p>
                        </div>
                        <Link
                            href="/search"
                            className="text-sm text-[#34af00] font-semibold flex items-center gap-1 hover:underline"
                        >
                            Ver todos <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
                        {loading ? (
                            <div className="col-span-2 xl:col-span-3 text-center py-10 opacity-50">
                                Cargando profesionales...
                            </div>
                        ) : (
                            experts.map((expert) => (
                                <Link
                                    key={expert.id}
                                    href={`/search?expert=${expert.id}`}
                                >
                                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer h-full flex flex-col">
                                        {/* Top row */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                                                <img
                                                    src={expert.avatarUrl}
                                                    alt={expert.firstName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1">
                                                    <p className="text-sm font-bold text-slate-900 truncate">
                                                        {expert.displayName}
                                                    </p>
                                                    {expert.expert?.verified && (
                                                        <span className="shrink-0 w-4 h-4 rounded-full bg-[#34af00] flex items-center justify-center">
                                                            <span className="text-white text-[8px] font-bold">
                                                                ✓
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-[#34af00] font-semibold truncate">
                                                    {expert.expert?.subcategoryName}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2 flex-1">
                                            {expert.expert?.tagline || expert.expert?.bio}
                                        </p>

                                        {/* Stats row */}
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                <span className="text-xs font-bold text-slate-800">
                                                    {expert.expert?.rating?.toFixed(1) || "N/A"}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    ({expert.expert?.ratingCount || 0})
                                                </span>
                                            </div>
                                            <span className="text-xs font-bold text-[#34af00]">
                                                Desde $
                                                {expert.expert?.priceMin?.toLocaleString(
                                                    "es-CO"
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* See more CTA */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/search"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white text-sm font-bold transition-all hover:shadow-lg hover:scale-105"
                            style={{
                                background:
                                    "linear-gradient(135deg, #34af00, #2d9600)",
                            }}
                        >
                            Ver todos los profesionales{" "}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 6: DUAL CTA BANNER ═══ */}
            <section
                className="py-14 lg:py-20 relative overflow-hidden"
                style={{
                    background:
                        "linear-gradient(135deg, #0d4700 0%, #1a6b00 40%, #34af00 100%)",
                }}
            >
                {/* Decorative */}
                <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-white/[0.03]" />
                <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-white/[0.03]" />

                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="grid grid-cols-2 gap-8 lg:gap-12">
                        {/* For clients */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-white/10">
                            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                                <Search className="w-6 h-6 text-green-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                ¿Necesitas un experto hoy?
                            </h3>
                            <p className="text-base text-green-100/70 mb-6 leading-relaxed">
                                Describe lo que necesitas y recibe propuestas de profesionales
                                verificados en minutos. Sin compromiso.
                            </p>
                            <Link
                                href="/search"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1a6b00] rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:scale-105"
                            >
                                Buscar ahora <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* For experts */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-white/10">
                            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                                <Users className="w-6 h-6 text-green-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                ¿Eres un profesional?
                            </h3>
                            <p className="text-base text-green-100/70 mb-6 leading-relaxed">
                                Únete a Chambit y consigue clientes en tu zona. Miles de
                                personas buscan tus servicios ahora mismo.
                            </p>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1a6b00] rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:scale-105"
                            >
                                Registrarme como experto{" "}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
