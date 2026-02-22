"use client";

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, ShieldCheck, Activity, Layers, BarChart3, Flame, TrendingUp, ChevronDown } from "lucide-react";
import { latLngToCell, cellToChildren, gridDisk } from "h3-js";

// ─── CORRECCIÓN: Índices H3 generados desde el centro REAL de Cali ────────────
// Centro geográfico de Cali: 3.4516°N, 76.5320°W
const CALI_LAT = 3.4516;
const CALI_LNG = -76.5320;
const CALI_CENTER: [number, number] = [CALI_LAT, CALI_LNG];

// gridDisk k=2 en res-7 = 19 celdas ~98 km² sobre Cali urbana
const CALI_BASE_CELL_R7 = latLngToCell(CALI_LAT, CALI_LNG, 7);
const CALI_BASE_INDICES = gridDisk(CALI_BASE_CELL_R7, 2); // 19 celdas correctas

// Dynamic import del mapa (Leaflet no es SSR-compatible)
const GeozonesMap = dynamic(() => import("@/components/admin/geozones-map"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[600px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 text-sm font-medium">
            Cargando motor espacial H3...
        </div>
    ),
});

// ─── Datos sintéticos: demanda de categorías por hexágono y por tiempo ─────────
const CATEGORIES = ["Reparación", "Limpieza", "Construcción", "Belleza", "Tecnología", "Mecánica", "Deporte"];
const CAT_COLORS: Record<string, string> = {
    "Reparación": "#3b82f6",
    "Limpieza": "#34af00",
    "Construcción": "#f59e0b",
    "Belleza": "#ec4899",
    "Tecnología": "#8b5cf6",
    "Mecánica": "#ef4444",
    "Deporte": "#06b6d4",
};

// Genera un valor de demanda sintético estable por (h3Index, category, timeKey)
function syntheticDemand(h3Index: string, category: string, timeKey: string): number {
    let hash = 0;
    const s = h3Index + category + timeKey;
    for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) & 0xffffff;
    return (hash % 80) + 5; // 5–85
}

// Genera scores por hexágono para una categoría y periodo dados
function generateHexScores(indices: string[], category: string, period: string): Record<string, number> {
    const scores: Record<string, number> = {};
    indices.forEach(h => { scores[h] = syntheticDemand(h, category, period); });
    return scores;
}

// ─── Tipos ────────────────────────────────────────────────────────────────────
type ViewMode = "geozone" | "heatmap" | "hotspots";
type TimePeriod = "hoy" | "semana" | "mes" | "personalizado";

const PERIOD_LABELS: Record<TimePeriod, string> = {
    hoy: "Hoy",
    semana: "Última semana",
    mes: "Último mes",
    personalizado: "Personalizado",
};

// ─── Dropdown component ───────────────────────────────────────────────────────
function Dropdown<T extends string>({
    value, options, labels, onChange, icon: Icon, title,
}: {
    value: T;
    options: T[];
    labels?: Record<T, string>;
    onChange: (v: T) => void;
    icon?: React.ElementType;
    title?: string;
}) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            {title && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>}
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 transition-all shadow-sm min-w-[160px] justify-between"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
                    {labels ? labels[value] : value}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute top-full mt-1 left-0 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden min-w-full">
                        {options.map(opt => (
                            <button
                                key={opt}
                                onClick={() => { onChange(opt); setOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors ${opt === value ? "text-[#34af00] bg-green-50" : "text-slate-700"}`}
                            >
                                {labels ? labels[opt] : opt}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Stat badge ───────────────────────────────────────────────────────────────
function StatRow({ label, value, color = "text-slate-800" }: { label: string; value: string; color?: string }) {
    return (
        <div className="flex justify-between items-center text-sm py-1.5 border-b border-slate-50 last:border-0">
            <span className="text-slate-500">{label}</span>
            <span className={`font-bold ${color}`}>{value}</span>
        </div>
    );
}

// ─── Hotspot legend item ──────────────────────────────────────────────────────
function HotspotLegend({ category, score, pct }: { category: string; score: number; pct: number }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">{category}</span>
                <span className="font-bold" style={{ color: CAT_COLORS[category] }}>{score}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: CAT_COLORS[category] }} />
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminGeozonesPage() {
    const [resolution, setResolution] = useState<7 | 8 | 9>(7);
    const [viewMode, setViewMode] = useState<ViewMode>("geozone");
    const [selectedCategory, setSelectedCategory] = useState<string>("Reparación");
    const [timePeriod, setTimePeriod] = useState<TimePeriod>("semana");

    // Genera índices correctos para la resolución actual
    const currentIndices = useMemo(() => {
        if (resolution === 7) return CALI_BASE_INDICES;
        return CALI_BASE_INDICES.flatMap(parent => cellToChildren(parent, resolution));
    }, [resolution]);

    // Scores de demanda para el heatmap / hotspots (solo para esas vistas)
    const hexScores = useMemo(() => {
        if (viewMode === "geozone") return undefined;
        return generateHexScores(currentIndices, selectedCategory, timePeriod);
    }, [currentIndices, selectedCategory, timePeriod, viewMode]);

    // Top categorías para sidebar cuando se está en hotspot mode
    const topCats = useMemo(() => {
        if (viewMode !== "hotspots") return [];
        const totals = CATEGORIES.map(cat => ({
            cat,
            score: currentIndices.reduce((s, h) => s + syntheticDemand(h, cat, timePeriod), 0),
        })).sort((a, b) => b.score - a.score);
        const max = totals[0]?.score || 1;
        return totals.map(t => ({ ...t, pct: Math.round((t.score / max) * 100) }));
    }, [currentIndices, timePeriod, viewMode]);

    const VIEW_MODE_ICONS: Record<ViewMode, React.ElementType> = {
        geozone: Layers,
        heatmap: Flame,
        hotspots: TrendingUp,
    };
    const ViewIcon = VIEW_MODE_ICONS[viewMode];

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Inteligencia Geoespacial</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Grillas H3 · Demanda por categoría · Zonas calientes · Cali, Colombia</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="bg-[#34af00]/10 text-[#34af00] border-[#34af00]/20 px-3 py-1 text-xs font-semibold">
                        <Activity className="h-3 w-3 mr-1.5" /> Motor activo
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1 text-xs font-semibold">
                        <Globe className="h-3 w-3 mr-1.5" /> Colombia
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* ── Sidebar ─────────────────────────────────────────────── */}
                <div className="lg:col-span-1 space-y-4">

                    {/* Ciudad */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <MapPin className="w-4 h-4 text-[#34af00]" />
                            Ciudad activa
                        </div>
                        <p className="text-xl font-extrabold text-slate-900">Santiago de Cali</p>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Hub principal MVP</p>
                        <div className="pt-2 space-y-0.5">
                            <StatRow label="Expertos activos" value="124" color="text-[#34af00]" />
                            <StatRow label="Celdas H3 activas" value={String(currentIndices.length)} color="text-blue-600" />
                            <StatRow label="Resolución" value={`Res ${resolution} (${resolution === 7 ? "~1.4km" : resolution === 8 ? "~0.46km" : "~200m"})`} />
                            <StatRow label="Centro" value={`${CALI_LAT}°N, ${Math.abs(CALI_LNG)}°O`} />
                        </div>
                    </div>

                    {/* Modo de visualización */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <ViewIcon className="w-4 h-4 text-violet-500" />
                            Modo de vista
                        </div>
                        <div className="space-y-1.5">
                            {(["geozone", "heatmap", "hotspots"] as ViewMode[]).map(mode => {
                                const I = VIEW_MODE_ICONS[mode];
                                const labels = { geozone: "Geozona H3", heatmap: "Mapa de calor", hotspots: "Análisis geo-zonas" };
                                const descs = {
                                    geozone: "Celdas activas de la plataforma",
                                    heatmap: "Demanda por categoría y tiempo",
                                    hotspots: "Zonas de alta presión geoespacial",
                                };
                                return (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode)}
                                        className={`w-full flex items-start gap-2.5 p-3 rounded-xl text-left transition-all ${viewMode === mode ? "bg-violet-50 border border-violet-200" : "hover:bg-slate-50 border border-transparent"}`}
                                    >
                                        <I className={`w-4 h-4 mt-0.5 shrink-0 ${viewMode === mode ? "text-violet-600" : "text-slate-400"}`} />
                                        <div>
                                            <p className={`text-xs font-bold ${viewMode === mode ? "text-violet-700" : "text-slate-700"}`}>{labels[mode]}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{descs[mode]}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Resolución H3 */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Layers className="w-4 h-4 text-slate-400" />
                            Resolución H3
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                            {([7, 8, 9] as const).map(r => (
                                <button
                                    key={r}
                                    onClick={() => setResolution(r)}
                                    className={`py-2 rounded-xl text-xs font-bold transition-all ${resolution === r ? "bg-[#34af00] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                                >
                                    Res {r}
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                            {resolution === 7 && "Res 7 · ~5.16 km² · 1.4km arista · Vecindario"}
                            {resolution === 8 && "Res 8 · ~0.74 km² · 0.46km arista · Manzanas"}
                            {resolution === 9 && "Res 9 · ~0.105 km² · 200m arista · Bloque"}
                        </p>
                    </div>

                    {/* Hotspot analysis sidebar */}
                    {viewMode === "hotspots" && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <BarChart3 className="w-4 h-4 text-orange-500" />
                                Demanda por categoría
                            </div>
                            <div className="space-y-2.5">
                                {topCats.map(t => (
                                    <HotspotLegend key={t.cat} category={t.cat} score={t.score} pct={t.pct} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Privacy card */}
                    <div className="bg-gradient-to-br from-[#34af00] to-[#2d9600] rounded-2xl p-5 text-white">
                        <ShieldCheck className="w-8 h-8 mb-3 opacity-80" />
                        <h3 className="font-bold text-sm leading-tight">Privacidad garantizada</h3>
                        <p className="text-white/75 text-xs mt-1.5 leading-relaxed">
                            Las coordenadas GPS exactas nunca se almacenan. Solo se usan índices H3 para búsqueda y análisis.
                        </p>
                    </div>
                </div>

                {/* ── Map Area + Controls ──────────────────────────────────── */}
                <div className="lg:col-span-3 space-y-4">

                    {/* Controls bar above map */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap items-end gap-4">
                        {/* Always show category selector for heatmap and hotspot */}
                        {(viewMode === "heatmap" || viewMode === "hotspots") && (
                            <Dropdown
                                value={selectedCategory}
                                options={CATEGORIES}
                                onChange={setSelectedCategory}
                                icon={BarChart3}
                                title="Categoría"
                            />
                        )}
                        {/* Time period selector */}
                        {(viewMode === "heatmap" || viewMode === "hotspots") && (
                            <Dropdown
                                value={timePeriod}
                                options={["hoy", "semana", "mes", "personalizado"] as TimePeriod[]}
                                labels={PERIOD_LABELS}
                                onChange={setTimePeriod}
                                icon={TrendingUp}
                                title="Período"
                            />
                        )}

                        <div className="ml-auto text-right">
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                                {viewMode === "geozone" && `${currentIndices.length} celdas activas · Res ${resolution}`}
                                {viewMode === "heatmap" && `${selectedCategory} · ${PERIOD_LABELS[timePeriod]} · ${currentIndices.length} hex`}
                                {viewMode === "hotspots" && `Análisis multicat · ${PERIOD_LABELS[timePeriod]} · ${currentIndices.length} zonas`}
                            </p>
                            <p className="text-[10px] text-[#34af00] font-bold mt-0.5">
                                Centro: {CALI_LAT}°N {Math.abs(CALI_LNG)}°O (validado)
                            </p>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-slate-900 text-base">
                                    {viewMode === "geozone" && "Topología de red H3"}
                                    {viewMode === "heatmap" && `Mapa de calor — ${selectedCategory}`}
                                    {viewMode === "hotspots" && "Geoclustering — Zonas de alta demanda"}
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Grilla H3 Res-{resolution} · Cali, Valle del Cauca · MVP v0.2
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#34af00] animate-pulse" />
                                <span className="text-xs text-slate-500 font-medium">Live</span>
                            </div>
                        </div>
                        <GeozonesMap
                            center={CALI_CENTER}
                            zoom={resolution === 9 ? 14 : resolution === 8 ? 13 : 12}
                            resolution={resolution}
                            activeH3Indices={currentIndices}
                            viewMode={viewMode}
                            hexScores={hexScores}
                            selectedCategory={selectedCategory}
                            categoryColor={CAT_COLORS[selectedCategory]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
