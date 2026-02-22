"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft, Search, X, Star, MapPin, ChevronDown,
    CheckCircle, Clock, Zap,
    LayoutList, Map as MapIcon, Image as ImageIcon,
    Briefcase, Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import { SearchMap } from "@/components/map/SearchMap";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExpertResult {
    id: string;
    name: string;
    specialty: string;
    category: string;
    rating: number;
    reviews: number;
    distance: string;
    price: string;
    avatar: string;
    avatarUrl?: string;
    verified: boolean;
    active: boolean;
    lastActive: string;
    bio: string;
    tags: string[];
    completedJobs: number;
    relevanceScore?: number;
    distanceKm?: number;
    priceMin?: number;
    lat?: number;
    lng?: number;
    h3Index?: string;
}

// ─── Synthetic fallback data (shown when CF is unreachable) ──────────────────

const SYNTHETIC_EXPERTS: ExpertResult[] = [
    {
        id: "syn-001", name: "Carlos Mendoza", specialty: "Electricista certificado",
        category: "Reparación y mantenimiento", rating: 4.9, reviews: 87,
        distance: "1.2 km", price: "$45.000/h", avatar: "CM", verified: true,
        active: true, lastActive: "Activo ahora",
        bio: "Electricista con 12 años de experiencia en instalaciones residenciales y comerciales. Trabajo con materiales certificados y garantizo mis reparaciones.",
        tags: ["Instalaciones", "Cortos circuitos", "Tableros eléctricos", "Emergencias"],
        completedJobs: 143, relevanceScore: 0.95, distanceKm: 1.2,
        priceMin: 45000, lat: 3.4516, lng: -76.5320,
    },
    {
        id: "syn-002", name: "Andrés Vargas", specialty: "Plomero y gasfitería",
        category: "Reparación y mantenimiento", rating: 4.7, reviews: 52,
        distance: "2.1 km", price: "$40.000/h", avatar: "AV", verified: true,
        active: true, lastActive: "Activo ahora",
        bio: "Plomero con experiencia en reparación de fugas, instalación de tuberías y destape de cañerías. Disponible 24/7 para emergencias.",
        tags: ["Fugas", "Desagüe", "Tuberías", "Calentadores"],
        completedJobs: 89, relevanceScore: 0.88, distanceKm: 2.1,
        priceMin: 40000, lat: 3.4580, lng: -76.5280,
    },
    {
        id: "syn-003", name: "Luisa Fernández", specialty: "Pintora de interiores",
        category: "Construcción e ingeniería", rating: 5.0, reviews: 34,
        distance: "800 m", price: "$35.000/h", avatar: "LF", verified: false,
        active: false, lastActive: "Activo hace 2h",
        bio: "Pintora especializada en interiores y exteriores. Trabajos limpios, sin manchas y con acabados premium. Incluyo materiales a precio de costo.",
        tags: ["Interiores", "Exteriores", "Estuco", "Texturizados"],
        completedJobs: 61, relevanceScore: 0.82, distanceKm: 0.8,
        priceMin: 35000, lat: 3.4490, lng: -76.5350,
    },
    {
        id: "syn-004", name: "Jorge Castillo", specialty: "Carpintero mueblista",
        category: "Reparación y mantenimiento", rating: 4.8, reviews: 71,
        distance: "3.4 km", price: "$50.000/h", avatar: "JC", verified: true,
        active: false, lastActive: "Activo hace 5h",
        bio: "Carpintero con más de 15 años fabricando muebles y realizando trabajos de ebanistería. Cocinas, closets, puertas y más.",
        tags: ["Muebles", "Closets", "Cocinas", "Reparaciones"],
        completedJobs: 210, relevanceScore: 0.79, distanceKm: 3.4,
        priceMin: 50000, lat: 3.4450, lng: -76.5200,
    },
    {
        id: "syn-005", name: "María Gómez", specialty: "Técnica en refrigeración",
        category: "Reparación y mantenimiento", rating: 4.6, reviews: 28,
        distance: "1.8 km", price: "$55.000/h", avatar: "MG", verified: false,
        active: true, lastActive: "Activo ahora",
        bio: "Técnica certificada en mantenimiento de aires acondicionados y neveras. Diagnóstico gratuito y servicio garantizado.",
        tags: ["Aires acondicionados", "Neveras", "Lavadoras", "Electrodomésticos"],
        completedJobs: 45, relevanceScore: 0.76, distanceKm: 1.8,
        priceMin: 55000, lat: 3.4560, lng: -76.5390,
    },
    {
        id: "syn-006", name: "Ricardo Torres", specialty: "Cerrajero de emergencia",
        category: "Reparación y mantenimiento", rating: 4.9, reviews: 115,
        distance: "600 m", price: "$60.000/h", avatar: "RT", verified: true,
        active: true, lastActive: "Activo ahora",
        bio: "Cerrajero con 20 años de experiencia. Aperturas de emergencia, cambios de chapas e instalación de cerraduras de seguridad. Disponible las 24 horas.",
        tags: ["Emergencias", "Cerraduras", "Cajas fuertes", "Puertas blindadas"],
        completedJobs: 387, relevanceScore: 0.93, distanceKm: 0.6,
        priceMin: 60000, lat: 3.4530, lng: -76.5310,
    },
    {
        id: "syn-007", name: "Valentina Ríos", specialty: "Aseadora del hogar",
        category: "Limpieza y mantenimiento del hogar", rating: 4.8, reviews: 44,
        distance: "2.5 km", price: "$30.000/h", avatar: "VR", verified: false,
        active: false, lastActive: "Activo hace 1h",
        bio: "Servicio de aseo profundo y mantenimiento del hogar. Con mis propios productos de limpieza. Referencias disponibles.",
        tags: ["Aseo profundo", "Cocina", "Baños", "Pisos"],
        completedJobs: 78, relevanceScore: 0.72, distanceKm: 2.5,
        priceMin: 30000, lat: 3.4420, lng: -76.5430,
    },
    {
        id: "syn-008", name: "David Mora", specialty: "Técnico en sistemas",
        category: "Tecnología e informática", rating: 4.7, reviews: 63,
        distance: "4.2 km", price: "$50.000/h", avatar: "DM", verified: true,
        active: true, lastActive: "Activo ahora",
        bio: "Técnico en computadores y redes. Formateo, eliminación de virus, instalación de programas. Servicio a domicilio.",
        tags: ["Computadores", "Redes", "Formateo", "Impresoras"],
        completedJobs: 124, relevanceScore: 0.70, distanceKm: 4.2,
        priceMin: 50000, lat: 3.4600, lng: -76.5150,
    },
];

const CATEGORIES = ["Todos", "Reparación", "Construcción", "Limpieza", "Tecnología", "Belleza", "Mecánica", "Cuidado", "Deporte"];

const SUBCATEGORIES: Record<string, string[]> = {
    "Reparación": ["Todos", "Electricista", "Plomero", "Cerrajero", "Carpintero", "Pintor", "Refrigeración"],
    "Construcción": ["Todos", "Obra civil", "Remodelaciones", "Enchapes", "Drywall", "Pintura exterior"],
    "Limpieza": ["Todos", "Aseo del hogar", "Lavandería", "Limpieza de oficinas", "Desinfección"],
    "Tecnología": ["Todos", "Técnico PC", "Redes", "Soporte móvil", "CCTV", "Software"],
    "Belleza": ["Todos", "Peluquería", "Manicure", "Maquillaje", "Barbería", "Masajes"],
    "Mecánica": ["Todos", "Mecánica general", "Eléctrica automotriz", "Latonería", "Diagnóstico"],
    "Cuidado": ["Todos", "Cuidado adulto mayor", "Enfermería", "Cuidado infantil", "Psicología"],
    "Deporte": ["Todos", "Entrenador personal", "Yoga", "Natación", "Nutricionista"],
};

const SORT_OPTIONS = [
    { id: "relevance", label: "Relevancia" },
    { id: "rating", label: "Calificación" },
    { id: "distance", label: "Distancia" },
    { id: "price_asc", label: "Precio ↑" },
];
const PRICE_FILTERS = ["Cualquier precio", "Menos de $30.000/h", "$30k – $50k/h", "Más de $50k/h"];
const RATING_FILTERS = ["Cualquier calificación", "4.5 o más ⭐", "4.0 o más ⭐", "3.5 o más ⭐"];
const RADIUS_OPTIONS = [1, 2, 3, 5, 10, 15, 20];

// ─── List Card (compact — like Indeed) ───────────────────────────────────────

function ListCard({ expert, selected, onClick }: { expert: ExpertResult; selected: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left p-4 border-b border-slate-100 transition-all hover:bg-slate-50 group",
                selected ? "bg-green-50/60 border-l-[3px] border-l-[#34af00]" : "border-l-[3px] border-l-transparent"
            )}
        >
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm overflow-hidden"
                        style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                    >
                        {expert.avatarUrl ? (
                            <img src={expert.avatarUrl} alt={expert.name} className="w-full h-full object-cover" />
                        ) : (
                            expert.avatar
                        )}
                    </div>
                    {expert.active && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Name + verified */}
                    <div className="flex items-center gap-1.5">
                        <p className={cn("text-sm font-bold truncate", selected ? "text-[#34af00]" : "text-slate-900 group-hover:text-[#34af00] transition-colors")}>
                            {expert.name}
                        </p>
                        {expert.verified && <CheckCircle className="w-3.5 h-3.5 text-[#34af00] shrink-0" />}
                    </div>
                    <p className="text-xs text-[#34af00] font-semibold truncate">{expert.specialty}</p>

                    {/* Rating + distance */}
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-slate-700">{expert.rating}</span>
                            <span className="text-xs text-slate-400">({expert.reviews})</span>
                        </div>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500 flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" />{expert.distance}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500">
                            {expert.completedJobs} trabajos
                        </span>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-1 flex-wrap mt-1.5">
                        {expert.tags.slice(0, 3).map((t) => (
                            <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-full font-medium">{t}</span>
                        ))}
                    </div>
                </div>

                <div className="text-right shrink-0 ml-1">
                    <p className="text-sm font-bold text-slate-900">{expert.price}</p>
                    <p className="text-[10px] text-slate-400">tarifa aprox.</p>
                    <p className={cn("text-[10px] mt-1", expert.active ? "text-green-500" : "text-slate-400")}>
                        {expert.active ? "● En línea" : <><Clock className="inline w-2.5 h-2.5 mr-0.5" />{expert.lastActive.replace("Activo ", "")}</>}
                    </p>
                </div>
            </div>
        </button>
    );
}

// ─── Detail Panel (right side, like Indeed) ───────────────────────────────────

function DetailPanel({ expert, onClose }: { expert: ExpertResult | null; onClose: () => void }) {
    if (!expert) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center px-8 bg-[#f8fafc]">
                <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-5 border border-slate-100">
                    <Briefcase className="w-9 h-9 text-slate-300" />
                </div>
                <p className="text-base font-bold text-slate-600">Selecciona un experto</p>
                <p className="text-sm text-slate-400 mt-1 max-w-xs">Haz clic en un resultado para ver su perfil completo.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-white overflow-y-auto h-full">
            {/* Cover hero */}
            <div
                className="relative h-44 shrink-0"
                style={{ background: "linear-gradient(135deg, #34af00 0%, #1e7a00 100%)" }}
            >
                <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                    <ImageIcon className="w-20 h-20 text-white" />
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Avatar overlapping */}
                <div className="absolute left-6 -bottom-8">
                    <div
                        className="w-16 h-16 rounded-2xl border-4 border-white flex items-center justify-center text-white font-bold text-xl shadow-lg overflow-hidden"
                        style={{ background: "linear-gradient(135deg, #2d9600, #1e6e00)" }}
                    >
                        {expert.avatarUrl
                            ? <img src={expert.avatarUrl} alt={expert.name} className="w-full h-full object-cover" />
                            : expert.avatar
                        }
                    </div>
                </div>

                {expert.verified && (
                    <span className="absolute right-4 bottom-3 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Verificado
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="pt-10 px-6 pb-28">
                {/* Name & specialty */}
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900">{expert.name}</h2>
                        <p className="text-sm text-[#34af00] font-semibold mt-0.5">{expert.specialty}</p>
                        <p className="text-xs text-slate-400">{expert.category}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-extrabold text-[#34af00]">{expert.price}</p>
                        <p className="text-xs text-slate-400">tarifa aprox./h</p>
                    </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 mt-2">
                    <span className={cn("w-2 h-2 rounded-full shrink-0", expert.active ? "bg-green-400" : "bg-slate-300")} />
                    <span className="text-xs text-slate-500">{expert.lastActive}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                    {[
                        { label: "Calificación", value: `${expert.rating} ⭐`, sub: `${expert.reviews} reseñas` },
                        { label: "Distancia", value: expert.distance, sub: "de tu zona" },
                        { label: "Trabajos", value: expert.completedJobs, sub: "completados" },
                    ].map((s) => (
                        <div key={s.label} className="bg-slate-50 rounded-2xl p-3 text-center">
                            <p className="text-sm font-bold text-slate-900">{s.value}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{s.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Bio */}
                <div className="mt-5">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Sobre el experto</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{expert.bio}</p>
                </div>

                {/* Tags */}
                <div className="mt-4">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Especialidades</h3>
                    <div className="flex flex-wrap gap-2">
                        {expert.tags.map((t) => (
                            <span key={t} className="px-3 py-1 rounded-full border border-[#34af00]/30 bg-green-50 text-[#34af00] text-xs font-semibold">{t}</span>
                        ))}
                    </div>
                </div>

                {/* Reviews */}
                <div className="mt-5">
                    <h3 className="text-sm font-bold text-slate-900 mb-3">Opiniones recientes</h3>
                    <div className="space-y-3">
                        {[
                            { name: "Ana P.", date: "Feb 2026", text: "Excelente trabajo, muy puntual y profesional. Lo volvería a contratar sin dudar.", stars: 5 },
                            { name: "Luis G.", date: "Ene 2026", text: "Resolvió el problema rápidamente. Precio justo y buena calidad.", stars: 5 },
                            { name: "Sofía M.", date: "Ene 2026", text: "Muy buen servicio, llegó a tiempo y dejó el trabajo limpio.", stars: 4 },
                        ].map((r, i) => (
                            <div key={i} className="p-3 rounded-2xl bg-slate-50">
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-slate-300 flex items-center justify-center text-[10px] font-bold text-white">{r.name[0]}</div>
                                        <div>
                                            <span className="text-xs font-semibold text-slate-800">{r.name}</span>
                                            <span className="text-[10px] text-slate-400 ml-1">· {r.date}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: r.stars }).map((_, j) => (
                                            <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">"{r.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Fixed CTA */}
            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex gap-3">
                <button
                    className="flex-1 h-12 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95"
                    style={{ background: "linear-gradient(135deg, #34af00, #2d9600)", boxShadow: "0 4px 20px rgba(52,175,0,.3)" }}
                >
                    <Zap className="w-4 h-4" />
                    Cotizar con {expert.name.split(" ")[0]}
                </button>
                {/* Future: open WhatsApp */}
                <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 hover:bg-slate-200 transition-colors">
                    <Phone className="w-4 h-4 text-slate-600" />
                </button>
            </div>
        </div>
    );
}

// ─── Mobile Bottom Sheet ──────────────────────────────────────────────────────

function MobileSheet({ expert, onClose }: { expert: ExpertResult | null; onClose: () => void }) {
    if (!expert) return null;
    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onClose} />
            <div
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl md:hidden"
                style={{ maxHeight: "85vh", animation: "slideUp 0.3s cubic-bezier(0.32,0.72,0,1)", paddingBottom: "env(safe-area-inset-bottom)" }}
            >
                <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-slate-200" /></div>
                <div className="overflow-y-auto" style={{ maxHeight: "calc(85vh - 2rem)" }}>
                    {/* Header */}
                    <div className="flex items-start gap-4 px-5 py-4 border-b border-slate-100">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden"
                            style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                        >
                            {expert.avatarUrl ? <img src={expert.avatarUrl} alt={expert.name} className="w-full h-full object-cover" /> : expert.avatar}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                                <h2 className="text-base font-bold text-slate-900">{expert.name}</h2>
                                {expert.verified && <CheckCircle className="w-4 h-4 text-[#34af00]" />}
                            </div>
                            <p className="text-sm text-[#34af00] font-semibold">{expert.specialty}</p>
                            <p className="text-xs text-slate-400">{expert.category}</p>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <X className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>
                    {/* Stats */}
                    <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                        <div className="flex flex-col items-center py-3 gap-0.5">
                            <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span className="text-base font-bold">{expert.rating}</span></div>
                            <span className="text-[10px] text-slate-500">{expert.reviews} reseñas</span>
                        </div>
                        <div className="flex flex-col items-center py-3 gap-0.5">
                            <span className="text-base font-bold text-slate-900">{expert.distance}</span>
                            <span className="text-[10px] text-slate-500">de ti</span>
                        </div>
                        <div className="flex flex-col items-center py-3 gap-0.5">
                            <span className="text-base font-bold text-[#34af00]">{expert.price}</span>
                            <span className="text-[10px] text-slate-500">por hora</span>
                        </div>
                    </div>
                    {/* Bio */}
                    <div className="px-5 py-4 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900 mb-1.5">Sobre el experto</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{expert.bio}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {expert.tags.map((t) => <span key={t} className="px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-[#34af00] text-xs font-semibold">{t}</span>)}
                        </div>
                    </div>
                    {/* Reviews */}
                    <div className="px-5 py-4">
                        <h3 className="text-sm font-bold text-slate-900 mb-2">Opiniones</h3>
                        {[
                            { name: "Ana P.", text: "Excelente, muy puntual y profesional.", stars: 5 },
                            { name: "Luis G.", text: "Resolvió el problema rápidamente.", stars: 5 },
                        ].map((r, i) => (
                            <div key={i} className="p-3 rounded-xl bg-slate-50 mb-2">
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs font-semibold text-slate-800">{r.name}</span>
                                    <div className="flex gap-0.5">{Array.from({ length: r.stars }).map((_, j) => <Star key={j} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />)}</div>
                                </div>
                                <p className="text-xs text-slate-600">"{r.text}"</p>
                            </div>
                        ))}
                    </div>
                    <div className="h-24" />
                </div>
                {/* CTA */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}>
                    <button
                        className="w-full h-12 rounded-2xl font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-all"
                        style={{ background: "linear-gradient(135deg, #34af00, #2d9600)", boxShadow: "0 4px 20px rgba(52,175,0,.3)" }}
                    >
                        <Zap className="w-5 h-5" /> Cotizar con {expert.name.split(" ")[0]}
                    </button>
                </div>
            </div>
            <style jsx>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        </>
    );
}

// ─── View Toggle ──────────────────────────────────────────────────────────────

function ViewToggle({ view, onChange }: { view: "list" | "map"; onChange: (v: "list" | "map") => void }) {
    return (
        <div className="flex items-center bg-slate-100 rounded-xl p-0.5 shrink-0">
            <button
                onClick={() => onChange("list")}
                className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all",
                    view === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                )}
            >
                <LayoutList className="w-3.5 h-3.5" /> Lista
            </button>
            <button
                onClick={() => onChange("map")}
                className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all",
                    view === "map" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                )}
            >
                <MapIcon className="w-3.5 h-3.5" /> Mapa
            </button>
        </div>
    );
}

// ─── Filter Pill (reusable dropdown pill) ────────────────────────────────────

function FilterPill({
    label, active, children, onOpen, isOpen, onClose,
}: {
    label: string; active?: boolean;
    children: React.ReactNode;
    onOpen: () => void; isOpen: boolean; onClose: () => void;
}) {
    return (
        <div className="relative shrink-0">
            <button
                onClick={() => isOpen ? onClose() : onOpen()}
                className={cn(
                    "h-9 px-4 rounded-full text-sm font-semibold border flex items-center gap-1.5 transition-all whitespace-nowrap",
                    active
                        ? "bg-[#34af00]/10 border-[#34af00] text-[#34af00]"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-400"
                )}
            >
                {label}
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
                <div
                    className="absolute top-[calc(100%+6px)] left-0 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[200] overflow-hidden"
                    style={{ minWidth: 200 }}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

function FilterBar({
    activeCat, setActiveCat,
    activeSub, setActiveSub,
    activePrice, setActivePrice,
    activeRating, setActiveRating,
    activeRadius, setActiveRadius,
    sortBy, setSortBy,
    resultCount,
    view, setView,
    isSynthetic,
}: {
    activeCat: string; setActiveCat: (v: string) => void;
    activeSub: string; setActiveSub: (v: string) => void;
    activePrice: string; setActivePrice: (v: string) => void;
    activeRating: string; setActiveRating: (v: string) => void;
    activeRadius: number; setActiveRadius: (v: number) => void;
    sortBy: string; setSortBy: (v: string) => void;
    resultCount: number;
    view: "list" | "map"; setView: (v: "list" | "map") => void;
    isSynthetic: boolean;
}) {
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const toggle = (key: string) => setOpenFilter(prev => prev === key ? null : key);
    const close = () => setOpenFilter(null);
    const subcats = activeCat !== "Todos" ? SUBCATEGORIES[activeCat] : null;

    return (
        <div
            className="bg-white border-b border-slate-100 px-6 md:px-10 py-3 shrink-0"
            onClick={(e) => e.stopPropagation()}
        >
            {isSynthetic && (
                <div className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-0.5 mb-2.5 inline-block font-semibold">
                    ⚡ Datos de demostración · Activa el emulador para datos reales
                </div>
            )}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-nowrap">

                {/* ── 1. Categoría (LinkedIn-style) ── */}
                <FilterPill
                    label={activeCat === "Todos" ? "Categoría" : activeCat}
                    active={activeCat !== "Todos"}
                    isOpen={openFilter === "cat"}
                    onOpen={() => toggle("cat")}
                    onClose={close}
                >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 pt-3 pb-1">Categoría</p>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => { setActiveCat(cat); setActiveSub("Todos"); close(); }}
                            className={cn(
                                "w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors",
                                activeCat === cat ? "text-[#34af00] bg-green-50 font-semibold" : "text-slate-700 hover:bg-slate-50"
                            )}
                        >
                            {activeCat === cat && <span className="w-1.5 h-1.5 rounded-full bg-[#34af00] shrink-0" />}
                            {cat}
                        </button>
                    ))}
                </FilterPill>

                {/* ── 2. Subcategoría (aparece solo si hay categoría activa) ── */}
                {subcats && (
                    <FilterPill
                        label={activeSub === "Todos" ? "Subcategoría" : activeSub}
                        active={activeSub !== "Todos"}
                        isOpen={openFilter === "sub"}
                        onOpen={() => toggle("sub")}
                        onClose={close}
                    >
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 pt-3 pb-1">Subcategoría de {activeCat}</p>
                        {subcats.map((sub) => (
                            <button
                                key={sub}
                                onClick={() => { setActiveSub(sub); close(); }}
                                className={cn(
                                    "w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors",
                                    activeSub === sub ? "text-[#34af00] bg-green-50 font-semibold" : "text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                {activeSub === sub && <span className="w-1.5 h-1.5 rounded-full bg-[#34af00] shrink-0" />}
                                {sub === "Todos" ? `Todo en ${activeCat}` : sub}
                            </button>
                        ))}
                    </FilterPill>
                )}

                {/* ── Divider ── */}
                <div className="hidden md:block w-px h-5 bg-slate-200 mx-1 shrink-0" />

                {/* ── 3. Calificación ── */}
                <FilterPill
                    label={activeRating === "Cualquier calificación" ? "Calificación" : activeRating}
                    active={activeRating !== "Cualquier calificación"}
                    isOpen={openFilter === "rating"}
                    onOpen={() => toggle("rating")}
                    onClose={close}
                >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 pt-3 pb-1">Calificación mínima</p>
                    {RATING_FILTERS.map((r) => (
                        <button key={r} onClick={() => { setActiveRating(r); close(); }}
                            className={cn("w-full text-left px-4 py-2.5 text-sm transition-colors",
                                activeRating === r ? "text-[#34af00] bg-green-50 font-semibold" : "text-slate-700 hover:bg-slate-50")}
                        >{r}</button>
                    ))}
                </FilterPill>

                {/* ── 4. Radio (slider dinámico) ── */}
                <FilterPill
                    label={activeRadius === 20 ? "Radio" : `Radio: ${activeRadius} km`}
                    active={activeRadius < 20}
                    isOpen={openFilter === "radius"}
                    onOpen={() => toggle("radius")}
                    onClose={close}
                >
                    <div className="px-5 pt-4 pb-5" style={{ width: 260 }}>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Distancia máxima</p>
                        <p className="text-2xl font-extrabold text-[#34af00] mb-3">{activeRadius} km</p>
                        <input
                            type="range"
                            min={1} max={20} step={1}
                            value={activeRadius}
                            onChange={(e) => setActiveRadius(Number(e.target.value))}
                            className="w-full accent-[#34af00] h-2 rounded-full"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>1 km</span><span>10 km</span><span>20 km</span>
                        </div>
                        <div className="flex gap-2 mt-4 flex-wrap">
                            {RADIUS_OPTIONS.map(r => (
                                <button key={r} onClick={() => setActiveRadius(r)}
                                    className={cn("px-3 py-1 rounded-full text-xs font-semibold border transition-all",
                                        activeRadius === r ? "bg-[#34af00] border-[#34af00] text-white" : "bg-white border-slate-200 text-slate-600 hover:border-[#34af00]")}
                                >{r} km</button>
                            ))}
                        </div>
                    </div>
                </FilterPill>

                {/* ── 5. Precio ── */}
                <FilterPill
                    label={activePrice === "Cualquier precio" ? "Precio" : activePrice}
                    active={activePrice !== "Cualquier precio"}
                    isOpen={openFilter === "price"}
                    onOpen={() => toggle("price")}
                    onClose={close}
                >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 pt-3 pb-1">Rango de precio</p>
                    {PRICE_FILTERS.map((p) => (
                        <button key={p} onClick={() => { setActivePrice(p); close(); }}
                            className={cn("w-full text-left px-4 py-2.5 text-sm transition-colors",
                                activePrice === p ? "text-[#34af00] bg-green-50 font-semibold" : "text-slate-700 hover:bg-slate-50")}
                        >{p}</button>
                    ))}
                </FilterPill>

                {/* ── 6. Ordenar ── */}
                <FilterPill
                    label={`Ordenar: ${sortBy}`}
                    active={sortBy !== "Relevancia"}
                    isOpen={openFilter === "sort"}
                    onOpen={() => toggle("sort")}
                    onClose={close}
                >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 pt-3 pb-1">Ordenar por</p>
                    {SORT_OPTIONS.map((opt) => (
                        <button key={opt.id} onClick={() => { setSortBy(opt.label); close(); }}
                            className={cn("w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors",
                                sortBy === opt.label ? "text-[#34af00] bg-green-50 font-semibold" : "text-slate-700 hover:bg-slate-50")}
                        >
                            {sortBy === opt.label && <span className="w-1.5 h-1.5 rounded-full bg-[#34af00]" />}
                            {opt.label}
                        </button>
                    ))}
                </FilterPill>

                {/* Result count + view toggle */}
                <div className="ml-auto flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-400 whitespace-nowrap">{resultCount} expertos</span>
                    <ViewToggle view={view} onChange={setView} />
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function SearchPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get("q") ?? "");
    const [activeCat, setActiveCat] = useState(searchParams.get("cat") || "Todos");
    const [activeSub, setActiveSub] = useState("Todos");
    const [activePrice, setActivePrice] = useState("Cualquier precio");
    const [activeRating, setActiveRating] = useState("Cualquier calificación");
    const [activeRadius, setActiveRadius] = useState(20);
    const [sortBy, setSortBy] = useState("Relevancia");
    const [view, setView] = useState<"list" | "map">("list");

    const [allExperts, setAllExperts] = useState<ExpertResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSynthetic, setIsSynthetic] = useState(false);
    const [selected, setSelected] = useState<ExpertResult | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!query) inputRef.current?.focus();
    }, []);

    // Fetch from CF with fallback to synthetic data
    useEffect(() => {
        async function fetchExperts() {
            setLoading(true);
            try {
                const lat = 3.4516;
                const lng = -76.5320;
                const searchExpertsFn = httpsCallable<any, { results: any[] }>(functions, "searchExperts");

                // Race CF call against a 6-second timeout
                const cfPromise = searchExpertsFn({ lat, lng, limit: 100 });
                const timeoutPromise = new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error("CF_TIMEOUT")), 6000)
                );

                const response = await Promise.race([cfPromise, timeoutPromise]);
                const fetched: ExpertResult[] = response.data.results as ExpertResult[];

                if (fetched.length > 0) {
                    setAllExperts(fetched);
                    setIsSynthetic(false);
                    // Auto-select first result so detail panel is always visible
                    const expertIdToSelect = searchParams.get("expert");
                    if (expertIdToSelect) {
                        const target = fetched.find(e => e.id === expertIdToSelect);
                        if (target) setSelected(target); else setSelected(fetched[0]);
                    } else {
                        setSelected(fetched[0]);
                    }
                } else {
                    setAllExperts(SYNTHETIC_EXPERTS);
                    setIsSynthetic(true);
                    setSelected(SYNTHETIC_EXPERTS[0]);
                }
            } catch {
                // CF unreachable (no emulator running) or timeout → fallback
                setAllExperts(SYNTHETIC_EXPERTS);
                setIsSynthetic(true);
                setSelected(SYNTHETIC_EXPERTS[0]);
            } finally {
                setLoading(false);
            }
        }
        fetchExperts();
    }, []);

    // Filter
    const CAT_MAP: Record<string, string> = {
        "Reparación": "Reparación y mantenimiento",
        "Construcción": "Construcción e ingeniería",
        "Limpieza": "Limpieza y mantenimiento del hogar",
        "Tecnología": "Tecnología e informática",
    };

    const filteredResults = allExperts.filter((e) => {
        const targetCat = CAT_MAP[activeCat] || activeCat;
        const matchQ = !query ||
            e.name.toLowerCase().includes(query.toLowerCase()) ||
            e.specialty.toLowerCase().includes(query.toLowerCase()) ||
            e.category.toLowerCase().includes(query.toLowerCase()) ||
            e.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
        const matchCat = activeCat === "Todos" || e.category === targetCat;
        const matchSub = activeSub === "Todos" || e.specialty.toLowerCase().includes(activeSub.toLowerCase()) || e.tags.some(t => t.toLowerCase().includes(activeSub.toLowerCase()));

        let matchPrice = true;
        if (activePrice === "Menos de $30.000/h") matchPrice = (e.priceMin ?? 0) < 30000;
        else if (activePrice === "$30k – $50k/h") matchPrice = (e.priceMin ?? 0) >= 30000 && (e.priceMin ?? 0) <= 50000;
        else if (activePrice === "Más de $50k/h") matchPrice = (e.priceMin ?? 0) > 50000;

        let matchRating = true;
        if (activeRating === "4.5 o más ⭐") matchRating = e.rating >= 4.5;
        else if (activeRating === "4.0 o más ⭐") matchRating = e.rating >= 4.0;
        else if (activeRating === "3.5 o más ⭐") matchRating = e.rating >= 3.5;

        const matchRadius = (e.distanceKm ?? 0) <= activeRadius;

        return matchQ && matchCat && matchSub && matchPrice && matchRating && matchRadius;
    });

    // Sort
    const results = [...filteredResults].sort((a, b) => {
        if (sortBy === "Calificación") return b.rating - a.rating;
        if (sortBy === "Distancia") return (a.distanceKm ?? 0) - (b.distanceKm ?? 0);
        if (sortBy === "Precio ↑") return (a.priceMin ?? 0) - (b.priceMin ?? 0);
        return (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0);
    });

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[#f8fafc]" onClick={() => { /* close dropdowns by propagation stop in FilterBar */ }}>
            {/* ── Search bar ── */}
            <div className="bg-white border-b border-slate-100 px-4 py-3 md:px-8 shrink-0">
                <div className="flex items-center gap-3 max-w-7xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-all active:scale-90 hover:bg-slate-200 md:hidden"
                    >
                        <ArrowLeft className="w-4 h-4 text-slate-700" />
                    </button>

                    <div className="flex-1 flex items-center gap-2 h-11 px-4 rounded-2xl bg-slate-100">
                        <Search className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                            ref={inputRef}
                            id="search-input"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Electricista, plomero, pintor..."
                            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                        />
                        {query && (
                            <button onClick={() => setQuery("")} className="shrink-0">
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-2 h-11 px-4 rounded-2xl bg-slate-100 min-w-[180px]">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-500">Cali, Colombia</span>
                    </div>

                    <button
                        className="hidden md:flex items-center gap-2 h-11 px-5 rounded-2xl font-semibold text-white text-sm shrink-0 transition-all hover:opacity-90 active:scale-95"
                        style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                    >
                        <Search className="w-4 h-4" /> Buscar
                    </button>
                </div>
            </div>

            {/* ── Filter bar (with view toggle) ── */}
            <FilterBar
                activeCat={activeCat} setActiveCat={setActiveCat}
                activeSub={activeSub} setActiveSub={setActiveSub}
                activePrice={activePrice} setActivePrice={setActivePrice}
                activeRating={activeRating} setActiveRating={setActiveRating}
                activeRadius={activeRadius} setActiveRadius={setActiveRadius}
                sortBy={sortBy} setSortBy={setSortBy}
                resultCount={results.length}
                view={view} setView={setView}
                isSynthetic={isSynthetic}
            />

            {/* ── Content area ── */}
            <div className="flex-1 overflow-hidden min-h-0">

                {/* ── MAP VIEW ── */}
                {view === "map" && (
                    <div className="w-full h-full relative">
                        <SearchMap results={results} selectedId={selected?.id} onSelect={setSelected} />
                        {/* Floating card when selected on map */}
                        {selected && (
                            <div className="absolute bottom-4 left-4 right-4 z-[1000] md:hidden">
                                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-start gap-3">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0 overflow-hidden"
                                        style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                                    >
                                        {selected.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-900 text-sm">{selected.name}</p>
                                        <p className="text-xs text-[#34af00] font-semibold">{selected.specialty}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                            <span className="text-xs font-bold">{selected.rating}</span>
                                            <span className="text-xs text-slate-400">· {selected.distance}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-[#34af00]">{selected.price}</p>
                                        <button
                                            onClick={() => setView("list")}
                                            className="mt-1 text-[10px] text-[#34af00] font-semibold underline"
                                        >
                                            Ver perfil
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── LIST VIEW ── */}
                {view === "list" && (
                    <>
                        {/* ── MOBILE: full-width scrollable list ── */}
                        <div className="md:hidden flex-1 overflow-y-auto bg-[#f8fafc]">
                            {loading ? (
                                <div className="space-y-0 bg-white">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="px-4 py-3 border-b border-slate-100 flex gap-3 animate-pulse">
                                            <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
                                            <div className="flex-1 space-y-2 pt-1">
                                                <div className="h-3.5 bg-slate-200 rounded-full w-3/4" />
                                                <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                                                <div className="h-3 bg-slate-100 rounded-full w-2/3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : results.length > 0 ? (
                                <div className="bg-white">
                                    {results.map((e) => (
                                        <ListCard
                                            key={e.id}
                                            expert={e}
                                            selected={selected?.id === e.id}
                                            onClick={() => setSelected(e)}
                                        />
                                    ))}
                                    <div className="h-6" />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                                    <span className="text-5xl mb-4">🔍</span>
                                    <p className="text-base font-bold text-slate-700">Sin resultados</p>
                                    <p className="text-sm text-slate-400 mt-1">Prueba con otro término o cambia los filtros.</p>
                                </div>
                            )}
                        </div>

                        {/* ── DESKTOP: split 1:2 with 3cm outer margins ── */}
                        <div className="hidden md:flex h-full overflow-hidden px-[112px] py-4 gap-5 bg-[#f8fafc]">
                            {/* Left: service list — flex-1 */}
                            <div className="flex-[1] min-w-0 overflow-y-auto bg-white rounded-2xl border border-slate-100 shadow-sm">
                                {loading ? (
                                    <div className="space-y-0 py-2">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="px-4 py-3 border-b border-slate-100 flex gap-3 animate-pulse">
                                                <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
                                                <div className="flex-1 space-y-2 pt-1">
                                                    <div className="h-3.5 bg-slate-200 rounded-full w-3/4" />
                                                    <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                                                    <div className="h-3 bg-slate-100 rounded-full w-2/3" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className="py-1">
                                        {results.map((e) => (
                                            <ListCard
                                                key={e.id}
                                                expert={e}
                                                selected={selected?.id === e.id}
                                                onClick={() => setSelected(e)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                                        <span className="text-5xl mb-4">🔍</span>
                                        <p className="text-base font-bold text-slate-700">Sin resultados</p>
                                        <p className="text-sm text-slate-400 mt-1">
                                            Prueba con &quot;electricista&quot;, &quot;plomero&quot; o cambia los filtros.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Right: detail panel — flex-2 */}
                            <div className="flex-[2] min-w-0 overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
                                <DetailPanel
                                    expert={selected ?? results[0] ?? null}
                                    onClose={() => setSelected(results[0] ?? null)}
                                />
                            </div>
                        </div>

                        {/* Mobile bottom sheet (opens when card tapped) */}
                        <MobileSheet expert={selected} onClose={() => setSelected(null)} />
                    </>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense>
            <SearchPageContent />
        </Suspense>
    );
}
