"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Clock, CheckCircle, XCircle, Star, PackageOpen,
    Loader2, MessageCircle, ChevronDown, ChevronUp,
    Zap, DollarSign, User, Play, Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import {
    collection, query, where, orderBy, onSnapshot,
    doc, updateDoc, serverTimestamp,
} from "firebase/firestore";

// ─── Types ────────────────────────────────────────────────────────────────────

type RequestStatus = "open" | "accepted" | "in_progress" | "pending_confirmation" | "completed" | "cancelled";

interface ExpertJob {
    id: string;
    clientId: string;
    clientName: string;
    subcategoryName: string;
    categoryId: string;
    description: string;
    urgency: "flexible" | "soon" | "urgent";
    budgetLabel: string;
    status: RequestStatus;
    acceptedExpertId?: string;
    acceptedExpertName?: string;
    acceptedPrice?: number;
    createdAt: { seconds: number } | null;
    matchedAt?: { seconds: number } | null;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CFG: Record<RequestStatus, { label: string; color: string; bg: string; bar: string }> = {
    open: { label: "Abierta", color: "text-slate-600", bg: "bg-slate-100", bar: "bg-slate-300" },
    accepted: { label: "Vinculado", color: "text-blue-700", bg: "bg-blue-50", bar: "bg-blue-500" },
    in_progress: { label: "En curso", color: "text-[#34af00]", bg: "bg-green-50", bar: "bg-[#34af00]" },
    pending_confirmation: { label: "Esperando confirmación", color: "text-purple-700", bg: "bg-purple-50", bar: "bg-purple-500" },
    completed: { label: "Completada", color: "text-slate-500", bg: "bg-slate-100", bar: "bg-slate-400" },
    cancelled: { label: "Cancelada", color: "text-red-600", bg: "bg-red-50", bar: "bg-red-400" },
};

const URGENCY: Record<string, { label: string; color: string }> = {
    flexible: { label: "Flexible", color: "text-slate-500" },
    soon: { label: "Pronto", color: "text-amber-600" },
    urgent: { label: "🔴 Urgente", color: "text-red-600" },
};

// ─── Job Card ─────────────────────────────────────────────────────────────────

function JobCard({
    job, onInitiate, onFinish, onChat,
}: {
    job: ExpertJob;
    onInitiate: () => void;
    onFinish: () => void;
    onChat: () => void;
}) {
    const cfg = STATUS_CFG[job.status];
    const urg = URGENCY[job.urgency] ?? URGENCY.flexible;
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInitiate = async () => {
        setLoading(true);
        try {
            await updateDoc(doc(db, "requests", job.id), {
                status: "in_progress",
                startedAt: serverTimestamp(),
            });
            onInitiate();
        } finally { setLoading(false); }
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            await updateDoc(doc(db, "requests", job.id), {
                status: "pending_confirmation",
                finishedAt: serverTimestamp(),
            });
            onFinish();
        } finally { setLoading(false); }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className={cn("h-1 w-full", cfg.bar)} />

            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-start gap-3 p-4 text-left"
            >
                {/* Client avatar */}
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">
                    {job.clientName?.[0] ?? "C"}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{job.subcategoryName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{job.clientName}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", cfg.bg, cfg.color)}>
                            {cfg.label}
                        </span>
                        <span className={cn("text-[10px] font-semibold", urg.color)}>{urg.label}</span>
                        {job.acceptedPrice && (
                            <span className="text-[10px] font-bold text-[#34af00]">
                                ${job.acceptedPrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="shrink-0 mt-0.5">
                    {expanded
                        ? <ChevronUp className="w-4 h-4 text-slate-400" />
                        : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
            </button>

            {/* Expanded */}
            {expanded && (
                <div className="px-4 pb-4 border-t border-slate-50 pt-3 space-y-3">
                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed">{job.description}</p>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Presupuesto cliente: <strong className="text-slate-700">{job.budgetLabel}</strong></span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap pt-1">

                        {/* ACCEPTED → Iniciar servicio */}
                        {job.status === "accepted" && (
                            <>
                                <button
                                    onClick={handleInitiate}
                                    disabled={loading}
                                    className="flex-1 h-10 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-60 active:scale-95 transition-all"
                                    style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                                >
                                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                                    Iniciar servicio
                                </button>
                                <button
                                    onClick={onChat}
                                    className="h-10 px-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-1.5"
                                >
                                    <MessageCircle className="w-3.5 h-3.5" /> Chat
                                </button>
                            </>
                        )}

                        {/* IN PROGRESS → Marcar listo */}
                        {job.status === "in_progress" && (
                            <>
                                <button
                                    onClick={handleFinish}
                                    disabled={loading}
                                    className="flex-1 h-10 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-60 active:scale-95 transition-all"
                                    style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                                >
                                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Flag className="w-3.5 h-3.5" />}
                                    Marcar listo
                                </button>
                                <button
                                    onClick={onChat}
                                    className="h-10 px-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-1.5"
                                >
                                    <MessageCircle className="w-3.5 h-3.5" /> Chat
                                </button>
                            </>
                        )}

                        {/* PENDING CONFIRMATION */}
                        {job.status === "pending_confirmation" && (
                            <>
                                <div className="flex-1 flex items-center gap-1.5 h-10 px-3 rounded-xl bg-purple-50 border border-purple-200">
                                    <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                                    <span className="text-xs text-purple-700 font-medium">Esperando al cliente</span>
                                </div>
                                <button
                                    onClick={onChat}
                                    className="h-10 px-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-1.5"
                                >
                                    <MessageCircle className="w-3.5 h-3.5" /> Chat
                                </button>
                            </>
                        )}

                        {/* COMPLETED */}
                        {job.status === "completed" && (
                            <div className="flex items-center gap-1.5 h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 w-full">
                                <CheckCircle className="w-3.5 h-3.5 text-[#34af00]" />
                                <span className="text-xs text-slate-600">Servicio completado ✓</span>
                            </div>
                        )}

                        {/* CANCELLED */}
                        {job.status === "cancelled" && (
                            <div className="flex items-center gap-1.5 h-10 px-3 rounded-xl bg-red-50 border border-red-200 w-full">
                                <XCircle className="w-3.5 h-3.5 text-red-500" />
                                <span className="text-xs text-red-600">El cliente canceló la solicitud</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OpportunitiesPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [jobs, setJobs] = useState<ExpertJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"active" | "history">("active");

    useEffect(() => {
        if (!user?.uid || user.role !== "expert") { setLoading(false); return; }

        const q = query(
            collection(db, "requests"),
            where("acceptedExpertId", "==", user.uid),
            orderBy("matchedAt", "desc")
        );
        const unsub = onSnapshot(q, (snap) => {
            setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ExpertJob)));
            setLoading(false);
        });
        return () => unsub();
    }, [user?.uid]);

    const ACTIVE: RequestStatus[] = ["accepted", "in_progress", "pending_confirmation"];
    const HISTORY: RequestStatus[] = ["completed", "cancelled"];

    const list = jobs.filter((j) =>
        tab === "active" ? ACTIVE.includes(j.status) : HISTORY.includes(j.status)
    );

    if (!user || user.role !== "expert") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
                <span className="text-5xl mb-4">🔒</span>
                <p className="text-base font-bold text-slate-700">Solo para expertos</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="bg-white px-4 pt-5 pb-3 border-b border-slate-100">
                <h1 className="text-xl font-bold text-slate-900">Mis Trabajos</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    {loading ? "Cargando..." : `${list.length} trabajo${list.length !== 1 ? "s" : ""} ${tab === "active" ? "activos" : "en historial"}`}
                </p>

                {/* Tabs */}
                <div className="flex gap-1 mt-3 p-1 bg-slate-100 rounded-2xl">
                    {(["active", "history"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={cn(
                                "flex-1 py-2 rounded-xl text-sm font-semibold transition-all",
                                tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                            )}
                        >
                            {t === "active" ? "Activos" : "Historial"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Find new jobs banner */}
            <div className="mx-4 mt-4">
                <button
                    onClick={() => router.push("/dashboard/open-requests")}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-dashed border-[#34af00]/40 bg-green-50 text-left transition-all active:scale-[0.98]"
                >
                    <div className="w-8 h-8 rounded-xl bg-[#34af00] flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#34af00]">Buscar nuevas peticiones</p>
                        <p className="text-xs text-slate-500">Ve peticiones abiertas de clientes en tu zona</p>
                    </div>
                </button>
            </div>

            {/* List */}
            <div className="flex-1 px-4 py-4 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-[#34af00] animate-spin" />
                    </div>
                ) : list.length > 0 ? (
                    list.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onInitiate={() => { }}
                            onFinish={() => { }}
                            onChat={() => router.push(`/dashboard/chat?id=${job.id}`)}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
                            <PackageOpen className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-base font-bold text-slate-700">
                            {tab === "active" ? "Sin trabajos activos" : "Sin historial aún"}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                            {tab === "active"
                                ? "Cuando un cliente acepte tu propuesta, aparecerá aquí."
                                : "Los trabajos completados aparecerán aquí."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
