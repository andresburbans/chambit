"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
    Users, Briefcase, MapPin, TrendingUp, Star, Zap,
    BarChart3, Clock, Activity, ArrowUpRight, ArrowDownRight,
    Globe, Filter,
} from "lucide-react";
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell, ScatterChart, Scatter,
    PieChart, Pie, Legend,
} from "recharts";

// Dynamic import of H3 map to avoid SSR issues
const H3HexMap = dynamic(() => import("@/components/admin/H3HexMap"), { ssr: false, loading: () => <MapSkeleton /> });

// ─── Types ────────────────────────────────────────────────────────────────────
interface KPI {
    label: string;
    value: string;
    sub: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    trend: number; // positive = up, negative = down
}

// ─── Synthetic data for Cali MVP ─────────────────────────────────────────────
const KPIS: KPI[] = [
    { label: "Usuarios totales", value: "2.847", sub: "+18% este mes", icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: 18 },
    { label: "Expertos activos", value: "612", sub: "+7 esta semana", icon: Briefcase, color: "text-[#34af00]", bg: "bg-green-50", trend: 7 },
    { label: "Solicitudes abiertas", value: "143", sub: "42 urgentes", icon: Zap, color: "text-orange-500", bg: "bg-orange-50", trend: 12 },
    { label: "Tasa de match", value: "78.4%", sub: "+2.1% vs mes anterior", icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50", trend: 2.1 },
    { label: "Rating promedio", value: "4.71 ★", sub: "de 5.00 posible", icon: Star, color: "text-amber-500", bg: "bg-amber-50", trend: 0.3 },
    { label: "Zona activa", value: "Cali", sub: "1 geozona habilitada", icon: MapPin, color: "text-rose-600", bg: "bg-rose-50", trend: 0 },
];

// Hourly activity (requests created per hour, averaged over last 30 days)
const HOURLY_ACTIVITY = [
    { hour: "0h", expertos: 4, clientes: 2 }, { hour: "2h", expertos: 2, clientes: 1 },
    { hour: "4h", expertos: 1, clientes: 1 }, { hour: "6h", expertos: 8, clientes: 6 },
    { hour: "8h", expertos: 24, clientes: 18 }, { hour: "10h", expertos: 38, clientes: 31 },
    { hour: "12h", expertos: 42, clientes: 37 }, { hour: "14h", expertos: 35, clientes: 29 },
    { hour: "16h", expertos: 44, clientes: 40 }, { hour: "18h", expertos: 39, clientes: 34 },
    { hour: "20h", expertos: 28, clientes: 24 }, { hour: "22h", expertos: 15, clientes: 11 },
];

// Weekly growth
const WEEKLY_TREND = [
    { week: "S1 Ene", usuarios: 1800, expertos: 420, solicitudes: 280 },
    { week: "S2 Ene", usuarios: 2020, expertos: 451, solicitudes: 310 },
    { week: "S3 Ene", usuarios: 2250, expertos: 478, solicitudes: 349 },
    { week: "S4 Ene", usuarios: 2480, expertos: 501, solicitudes: 388 },
    { week: "S1 Feb", usuarios: 2650, expertos: 544, solicitudes: 412 },
    { week: "S2 Feb", usuarios: 2847, expertos: 612, solicitudes: 458 },
];

// Category demand by zone (for radar chart)
const CATEGORY_RADAR = [
    { cat: "Reparación", zona_norte: 88, zona_sur: 75, zona_centro: 92 },
    { cat: "Limpieza", zona_norte: 72, zona_sur: 68, zona_centro: 80 },
    { cat: "Construcción", zona_norte: 65, zona_sur: 90, zona_centro: 55 },
    { cat: "Belleza", zona_norte: 80, zona_sur: 60, zona_centro: 85 },
    { cat: "Tecnología", zona_norte: 70, zona_sur: 45, zona_centro: 95 },
    { cat: "Mecánica", zona_norte: 55, zona_sur: 82, zona_centro: 60 },
];

// Conversion funnel
const FUNNEL = [
    { stage: "Búsquedas", value: 4280, pct: 100, color: "#3b82f6" },
    { stage: "Ver experto", value: 2941, pct: 68.7, color: "#8b5cf6" },
    { stage: "Solicitud enviada", value: 1124, pct: 26.3, color: "#f59e0b" },
    { stage: "Oferta aceptada", value: 756, pct: 17.7, color: "#34af00" },
    { stage: "Servicio completo", value: 580, pct: 13.6, color: "#10b981" },
    { stage: "Con calificación", value: 498, pct: 11.6, color: "#059669" },
];

// Category distribution pie
const CATEGORY_PIE = [
    { name: "Reparación", value: 38, color: "#3b82f6" },
    { name: "Limpieza", value: 22, color: "#34af00" },
    { name: "Construcción", value: 15, color: "#f59e0b" },
    { name: "Belleza", value: 12, color: "#ec4899" },
    { name: "Tecnología", value: 8, color: "#8b5cf6" },
    { name: "Mecánica", value: 5, color: "#ef4444" },
];

// Expert performance scatter (rating vs completed jobs, bubble = price)
const EXPERT_SCATTER = [
    { jobs: 320, rating: 4.9, price: 60, name: "Cerrajería" },
    { jobs: 210, rating: 4.8, price: 50, name: "Carpintería" },
    { jobs: 143, rating: 4.9, price: 45, name: "Eléctrico" },
    { jobs: 124, rating: 4.7, price: 50, name: "Sistemas" },
    { jobs: 89, rating: 4.7, price: 40, name: "Plomería" },
    { jobs: 78, rating: 4.8, price: 30, name: "Limpieza" },
    { jobs: 65, rating: 4.6, price: 35, name: "Pintura" },
    { jobs: 61, rating: 5.0, price: 35, name: "Pintura" },
    { jobs: 45, rating: 4.6, price: 55, name: "Refrigeración" },
    { jobs: 38, rating: 4.3, price: 25, name: "Doméstico" },
    { jobs: 22, rating: 4.1, price: 30, name: "Varios" },
    { jobs: 15, rating: 3.9, price: 20, name: "Nuevo" },
];

// ─── Skeleton loaders ─────────────────────────────────────────────────────────
function MapSkeleton() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-2xl gap-3">
            <div className="w-10 h-10 border-4 border-[#34af00]/30 border-t-[#34af00] rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Cargando grilla H3...</p>
        </div>
    );
}

// ─── Top bar tab selector ─────────────────────────────────────────────────────
type Tab = "overview" | "spatial" | "comportamiento" | "conversión";
const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Resumen", icon: BarChart3 },
    { id: "spatial", label: "Análisis Espacial H3", icon: Globe },
    { id: "comportamiento", label: "Comportamiento", icon: Activity },
    { id: "conversión", label: "Conversión", icon: TrendingUp },
];

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ kpi }: { kpi: KPI }) {
    const Icon = kpi.icon;
    const isUp = kpi.trend > 0;
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
            <div className="flex items-start justify-between">
                <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                {kpi.trend !== 0 && (
                    <div className={`flex items-center gap-0.5 text-xs font-semibold ${isUp ? "text-green-600" : "text-red-500"}`}>
                        {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {Math.abs(kpi.trend)}%
                    </div>
                )}
            </div>
            <p className="mt-3 text-2xl font-extrabold text-slate-900">{kpi.value}</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">{kpi.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>
        </div>
    );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, subtitle, children, className = "" }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}>
            <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900">{title}</h3>
                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {KPIS.map(k => <KpiCard key={k.label} kpi={k} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly growth */}
                <Section title="Crecimiento semanal" subtitle="Usuarios, expertos y solicitudes (últimas 6 semanas)" className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={WEEKLY_TREND}>
                            <defs>
                                <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gExpertos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#34af00" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#34af00" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,.08)", fontSize: 12 }} />
                            <Area type="monotone" dataKey="usuarios" stroke="#3b82f6" fill="url(#gUsers)" strokeWidth={2} name="Usuarios" />
                            <Area type="monotone" dataKey="expertos" stroke="#34af00" fill="url(#gExpertos)" strokeWidth={2} name="Expertos" />
                            <Area type="monotone" dataKey="solicitudes" stroke="#f59e0b" fill="none" strokeWidth={2} strokeDasharray="4 2" name="Solicitudes" />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </Section>

                {/* Category pie */}
                <Section title="Distribución por categoría" subtitle="% de solicitudes totales">
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={CATEGORY_PIE} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                                {CATEGORY_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
                            </Pie>
                            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, lineHeight: "1.8" }} />
                        </PieChart>
                    </ResponsiveContainer>
                </Section>
            </div>

            {/* Expert performance scatter */}
            <Section title="Desempeño de expertos" subtitle="Correlación: trabajos completados vs calificación (tamaño = precio/hora)">
                <ResponsiveContainer width="100%" height={260}>
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="jobs" name="Trabajos" tick={{ fontSize: 10, fill: "#94a3b8" }} label={{ value: "Trabajos completados", position: "insideBottom", offset: -5, fontSize: 10, fill: "#94a3b8" }} />
                        <YAxis dataKey="rating" name="Rating" domain={[3.5, 5.1]} tick={{ fontSize: 10, fill: "#94a3b8" }} label={{ value: "Calificación", angle: -90, position: "insideLeft", fontSize: 10, fill: "#94a3b8" }} />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }}
                            content={({ payload }) => payload?.[0] ? (
                                <div className="bg-white rounded-xl shadow-lg p-3 text-xs border border-slate-100">
                                    <p className="font-bold text-slate-800">{payload[0].payload.name}</p>
                                    <p className="text-slate-500">Trabajos: <span className="font-semibold text-slate-800">{payload[0].payload.jobs}</span></p>
                                    <p className="text-slate-500">Rating: <span className="font-semibold text-amber-500">{payload[0].payload.rating} ★</span></p>
                                    <p className="text-slate-500">Precio: <span className="font-semibold text-[#34af00]">${payload[0].payload.price}k/h</span></p>
                                </div>
                            ) : null}
                        />
                        <Scatter data={EXPERT_SCATTER} fill="#34af00" fillOpacity={0.75} shape={(props: any) => (
                            <circle cx={props.cx} cy={props.cy} r={Math.max(5, props.payload.price / 8)} fill="#34af00" fillOpacity={0.65} stroke="#fff" strokeWidth={1.5} />
                        )} />
                    </ScatterChart>
                </ResponsiveContainer>
            </Section>
        </div>
    );
}

// ─── Spatial Tab ──────────────────────────────────────────────────────────────
function SpatialTab() {
    const [hexRes, setHexRes] = useState<7 | 9>(7);
    const [metric, setMetric] = useState<"expertos" | "solicitudes" | "demanda">("expertos");

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="bg-white rounded-xl border border-slate-200 p-1 flex gap-1">
                    {([7, 9] as const).map(r => (
                        <button key={r} onClick={() => setHexRes(r)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${hexRes === r ? "bg-[#34af00] text-white" : "text-slate-500 hover:text-slate-800"}`}>
                            Res {r} {r === 7 ? "(~1.4km)" : "(~200m)"}
                        </button>
                    ))}
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-1 flex gap-1">
                    {(["expertos", "solicitudes", "demanda"] as const).map(m => (
                        <button key={m} onClick={() => setMetric(m)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${metric === m ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"}`}>
                            {m}
                        </button>
                    ))}
                </div>
                <div className="ml-auto text-xs text-slate-400 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Datos sintéticos MVP · Cali, Valle del Cauca
                </div>
            </div>

            {/* Map main */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ height: 520 }}>
                <H3HexMap resolution={hexRes} metric={metric} />
            </div>

            {/* Spatial correlations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Section title="Demanda por categoría vs zona" subtitle="Índice de demanda normalizado (0–100) por zona de la ciudad">
                    <ResponsiveContainer width="100%" height={240}>
                        <RadarChart data={CATEGORY_RADAR}>
                            <PolarGrid stroke="#f1f5f9" />
                            <PolarAngleAxis dataKey="cat" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <Radar name="Zona Norte" dataKey="zona_norte" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                            <Radar name="Zona Sur" dataKey="zona_sur" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
                            <Radar name="Zona Centro" dataKey="zona_centro" stroke="#34af00" fill="#34af00" fillOpacity={0.15} />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </Section>

                <Section title="Densidad de expertos por hexágono" subtitle="Top 8 celdas H3-res7 con mayor concentración de expertos">
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart layout="vertical" data={[
                            { cell: "872830828ff...", expertos: 18, solicitudes: 31 },
                            { cell: "872830829ff...", expertos: 14, solicitudes: 24 },
                            { cell: "87283082bff...", expertos: 11, solicitudes: 19 },
                            { cell: "87283082fff...", expertos: 9, solicitudes: 14 },
                            { cell: "87283082aff...", expertos: 8, solicitudes: 12 },
                            { cell: "8728308abff...", expertos: 7, solicitudes: 10 },
                            { cell: "87283082dff...", expertos: 5, solicitudes: 8 },
                            { cell: "87283082eff...", expertos: 3, solicitudes: 5 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <YAxis type="category" dataKey="cell" tick={{ fontSize: 9, fill: "#94a3b8" }} width={90} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} />
                            <Bar dataKey="expertos" fill="#34af00" radius={[0, 4, 4, 0]} name="Expertos" />
                            <Bar dataKey="solicitudes" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Solicitudes" />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                        </BarChart>
                    </ResponsiveContainer>
                </Section>
            </div>
        </div>
    );
}

// ─── Behavior Tab ─────────────────────────────────────────────────────────────
function ComportamientoTab() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Section title="Actividad por hora del día" subtitle="Promedio de acciones: búsquedas y solicitudes creadas (últimos 30 días)">
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={HOURLY_ACTIVITY}>
                            <defs>
                                <linearGradient id="gEx" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#34af00" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#34af00" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gCl" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} />
                            <Area type="monotone" dataKey="expertos" stroke="#34af00" fill="url(#gEx)" strokeWidth={2} name="Expertos activos" />
                            <Area type="monotone" dataKey="clientes" stroke="#3b82f6" fill="url(#gCl)" strokeWidth={2} name="Clientes activos" />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="mt-3 flex gap-4 text-xs text-slate-500 border-t border-slate-50 pt-3">
                        <div>🌅 <strong>Pico mañana:</strong> 10h–12h</div>
                        <div>🌆 <strong>Pico tarde:</strong> 16h–18h</div>
                        <div>🌙 <strong>Mínimo:</strong> 3h–5h</div>
                    </div>
                </Section>

                <Section title="Tiempo de respuesta de expertos" subtitle="Distribución del tiempo entre solicitud → primera oferta">
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={[
                            { rango: "< 5 min", count: 184, pct: 32 },
                            { rango: "5–15 min", count: 218, pct: 38 },
                            { rango: "15–30 min", count: 97, pct: 17 },
                            { rango: "30–60 min", count: 45, pct: 8 },
                            { rango: "> 1 hora", count: 29, pct: 5 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="rango" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v) => [`${v} solicitudes`]} />
                            <Bar dataKey="count" name="Solicitudes" radius={[6, 6, 0, 0]}>
                                {[184, 218, 97, 45, 29].map((_, i) => (
                                    <Cell key={i} fill={["#34af00", "#5cd219", "#f59e0b", "#f97316", "#ef4444"][i]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-slate-400 mt-2 text-center">
                        ⚡ El <strong className="text-[#34af00]">70%</strong> de solicitudes recibe oferta en menos de 15 minutos
                    </p>
                </Section>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Expert retention */}
                <Section title="Retención de expertos" subtitle="% activos por cohorte mensual">
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={[
                            { mes: "M1", ret: 100 }, { mes: "M2", ret: 81 }, { mes: "M3", ret: 69 },
                            { mes: "M4", ret: 61 }, { mes: "M5", ret: 57 }, { mes: "M6", ret: 54 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <YAxis unit="%" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v) => [`${v}%`]} />
                            <Line type="monotone" dataKey="ret" stroke="#34af00" strokeWidth={2.5} dot={{ fill: "#34af00", r: 4 }} name="Retención" />
                        </LineChart>
                    </ResponsiveContainer>
                </Section>

                {/* Solicitudes por día de semana */}
                <Section title="Solicitudes por día" subtitle="Promedio semanal">
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={[
                            { dia: "Lun", v: 58 }, { dia: "Mar", v: 72 }, { dia: "Mié", v: 65 },
                            { dia: "Jue", v: 71 }, { dia: "Vie", v: 84 }, { dia: "Sáb", v: 93 }, { dia: "Dom", v: 61 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="dia" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} />
                            <Bar dataKey="v" name="Solicitudes" radius={[5, 5, 0, 0]}>
                                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((_, i) => (
                                    <Cell key={i} fill={i === 5 ? "#34af00" : i === 4 ? "#5cd219" : "#d1fae5"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-slate-400 text-center mt-1">📅 Sábado es el día de mayor demanda</p>
                </Section>

                {/* Rating distribution */}
                <Section title="Distribución de calificaciones" subtitle="% de ratings por estrella">
                    <div className="space-y-2.5 mt-1">
                        {[
                            { stars: 5, pct: 62, count: 309 },
                            { stars: 4, pct: 25, count: 124 },
                            { stars: 3, pct: 8, count: 40 },
                            { stars: 2, pct: 3, count: 15 },
                            { stars: 1, pct: 2, count: 10 },
                        ].map(r => (
                            <div key={r.stars} className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-amber-500 w-8">{r.stars}★</span>
                                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${r.pct}%` }} />
                                </div>
                                <span className="text-xs text-slate-400 w-8 text-right">{r.pct}%</span>
                            </div>
                        ))}
                        <p className="text-xs text-slate-400 text-center pt-2">Promedio global: <strong className="text-amber-500">4.71 ★</strong></p>
                    </div>
                </Section>
            </div>
        </div>
    );
}

// ─── Conversion Tab ───────────────────────────────────────────────────────────
function ConversionTab() {
    return (
        <div className="space-y-6">
            <Section title="Funnel de conversión" subtitle="Este mes · De visita a calificación completa">
                <div className="space-y-3 mt-2 max-w-2xl mx-auto">
                    {FUNNEL.map((step, i) => (
                        <div key={step.stage} className="flex items-center gap-4">
                            <div className="w-32 shrink-0 text-right text-xs font-semibold text-slate-600">{step.stage}</div>
                            <div className="flex-1 relative h-9 bg-slate-50 rounded-xl overflow-hidden">
                                <div
                                    className="h-full rounded-xl flex items-center justify-end pr-3 transition-all"
                                    style={{ width: `${step.pct}%`, backgroundColor: step.color, opacity: 0.85 }}
                                >
                                    <span className="text-white text-xs font-bold">{step.value.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="w-14 text-xs text-slate-400 shrink-0">{step.pct}%</div>
                            {i > 0 && (
                                <div className="w-20 text-xs text-slate-400 hidden sm:block">
                                    ↓ {(FUNNEL[i - 1].value > 0 ? ((step.value / FUNNEL[i - 1].value) * 100).toFixed(1) : 0)}%
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8 text-center border-t border-slate-100 pt-6">
                    <div>
                        <p className="text-2xl font-extrabold text-slate-900">26.3%</p>
                        <p className="text-xs text-slate-500 mt-0.5">Búsqueda → Solicitud</p>
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-[#34af00]">67.3%</p>
                        <p className="text-xs text-slate-500 mt-0.5">Solicitud → Oferta aceptada</p>
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-amber-500">85.7%</p>
                        <p className="text-xs text-slate-500 mt-0.5">Completados → Con rating</p>
                    </div>
                </div>
            </Section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Section title="Tiempo hasta primera oferta vs tasa de conversión" subtitle="Por categoría de servicio">
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={[
                            { cat: "Cerrajería", tiempo: 4.2, conversion: 89 },
                            { cat: "Eléctrico", tiempo: 7.8, conversion: 81 },
                            { cat: "Plomería", tiempo: 9.1, conversion: 76 },
                            { cat: "Limpieza", tiempo: 14.3, conversion: 71 },
                            { cat: "Pintura", tiempo: 18.7, conversion: 62 },
                            { cat: "Sistemas", tiempo: 22.4, conversion: 58 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="cat" tick={{ fontSize: 9, fill: "#94a3b8" }} />
                            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#94a3b8" }} label={{ value: "Tiempo (min)", angle: -90, position: "insideLeft", fontSize: 9, fill: "#94a3b8" }} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#94a3b8" }} unit="%" />
                            <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} />
                            <Bar yAxisId="left" dataKey="tiempo" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Tiempo (min)" />
                            <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#34af00" strokeWidth={2.5} dot={{ r: 4, fill: "#34af00" }} name="Conversión %" />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-slate-400 text-center mt-2">
                        💡 Correlación inversa fuerte: menos tiempo → mayor conversión
                    </p>
                </Section>

                <Section title="Abandono por etapa" subtitle="Razones de no conversión (encuesta + inferido)">
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart layout="vertical" data={[
                            { razon: "Precio muy alto", pct: 38 },
                            { razon: "Sin expertos cerca", pct: 24 },
                            { razon: "Demora en respuesta", pct: 18 },
                            { razon: "Cambió de opinión", pct: 11 },
                            { razon: "Uso otra app", pct: 9 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                            <XAxis type="number" unit="%" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <YAxis type="category" dataKey="razon" tick={{ fontSize: 10, fill: "#94a3b8" }} width={130} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v) => [`${v}%`]} />
                            <Bar dataKey="pct" radius={[0, 6, 6, 0]} name="% de abandonos">
                                {[38, 24, 18, 11, 9].map((_, i) => (
                                    <Cell key={i} fill={["#ef4444", "#f97316", "#f59e0b", "#94a3b8", "#cbd5e1"][i]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Section>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminAnalyticsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("overview");

    const TabContent = {
        overview: OverviewTab,
        spatial: SpatialTab,
        comportamiento: ComportamientoTab,
        conversión: ConversionTab,
    }[activeTab];

    return (
        <div className="space-y-6 pb-12">
            {/* Page header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Analytics de Plataforma</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Análisis espacial H3 · Cali, Valle del Cauca · MVP v0.2</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 font-semibold">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Datos sintéticos MVP
                    </div>
                    <button className="flex items-center gap-2 text-xs bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 font-semibold px-3 py-1.5 rounded-full">
                        <Filter className="w-3.5 h-3.5" /> Filtros
                    </button>
                    <button className="flex items-center gap-2 text-xs bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 font-semibold px-3 py-1.5 rounded-full">
                        <Clock className="w-3.5 h-3.5" /> Últimos 30 días
                    </button>
                </div>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab content */}
            <TabContent />
        </div>
    );
}
